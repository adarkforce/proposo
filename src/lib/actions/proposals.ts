'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod/v4'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import {
  sendProposalNotification,
  sendProposalAccepted,
} from '@/lib/email/send'
import { APP_URL } from '@/config/constants'

// ============================================================
// Schemas
// ============================================================
const sendProposalSchema = z.object({
  proposalId: z.string().uuid(),
  clientEmail: z.email(),
  clientName: z.string().min(1).max(200),
  clientCompany: z.string().max(200).optional(),
})

const respondSchema = z.object({
  shareId: z.string().min(1),
  action: z.enum(['accept', 'decline']),
})

// ============================================================
// Types
// ============================================================
interface ActionResult<T = unknown> {
  readonly success: boolean
  readonly data?: T
  readonly error?: string
  readonly warning?: string
}

// ============================================================
// Send Proposal — authenticated, updates status + sends email
// ============================================================
export async function sendProposal(
  input: z.infer<typeof sendProposalSchema>,
): Promise<ActionResult<{ shareUrl: string }>> {
  const parsed = sendProposalSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' }
  }

  const { proposalId, clientEmail, clientName, clientCompany } = parsed.data

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  // Fetch proposal (RLS enforces ownership)
  const { data: proposal, error: fetchErr } = await supabase
    .from('proposals')
    .select('id, title, share_id, user_id')
    .eq('id', proposalId)
    .single()

  if (fetchErr || !proposal) {
    return { success: false, error: 'Proposal not found' }
  }

  // Upsert client record (find by email+user, otherwise create)
  const { data: existingClient } = await supabase
    .from('clients')
    .select('id')
    .eq('user_id', user.id)
    .eq('email', clientEmail)
    .maybeSingle()

  let clientId: string

  if (existingClient) {
    clientId = existingClient.id
    // Update name/company in case they changed
    await supabase
      .from('clients')
      .update({ name: clientName, company: clientCompany ?? null })
      .eq('id', clientId)
  } else {
    const { data: newClient, error: createErr } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: clientName,
        email: clientEmail,
        company: clientCompany ?? null,
      })
      .select('id')
      .single()

    if (createErr || !newClient) {
      return { success: false, error: 'Failed to create client record' }
    }
    clientId = newClient.id
  }

  // Transition proposal: draft → sent
  const now = new Date().toISOString()
  const { error: updateErr } = await supabase
    .from('proposals')
    .update({
      client_id: clientId,
      status: 'sent',
      sent_at: now,
    })
    .eq('id', proposalId)

  if (updateErr) {
    return { success: false, error: 'Failed to update proposal status' }
  }

  const shareUrl = `${APP_URL}/p/${proposal.share_id}`

  // Fetch sender profile for email personalization
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name')
    .eq('id', user.id)
    .single()

  const senderName =
    profile?.company_name ?? profile?.full_name ?? 'Your service provider'

  // Send email — best-effort, never blocks the status transition
  let emailWarning: string | undefined
  try {
    await sendProposalNotification({
      to: clientEmail,
      clientName,
      proposalTitle: proposal.title,
      shareUrl,
      senderName,
    })
  } catch (err) {
    emailWarning =
      err instanceof Error
        ? `Proposal saved, but email failed: ${err.message}`
        : 'Proposal saved, but email could not be sent'
  }

  revalidatePath(`/dashboard/proposals/${proposalId}`)
  revalidatePath('/dashboard/proposals')
  revalidatePath('/dashboard')

  return {
    success: true,
    data: { shareUrl },
    warning: emailWarning,
  }
}

// ============================================================
// Respond to Proposal — PUBLIC (called from share portal, no auth)
// Uses service client to bypass RLS since the public cannot write.
// ============================================================
export async function respondToProposal(
  input: z.infer<typeof respondSchema>,
): Promise<ActionResult> {
  const parsed = respondSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, error: 'Invalid input' }
  }

  const { shareId, action } = parsed.data
  const service = await createServiceClient()

  // Lookup proposal + owner profile
  const { data: proposal } = await service
    .from('proposals')
    .select('id, title, status, user_id, profiles(full_name, email)')
    .eq('share_id', shareId)
    .single()

  if (!proposal) return { success: false, error: 'Proposal not found' }
  if (proposal.status === 'accepted' || proposal.status === 'declined') {
    return { success: false, error: 'Proposal has already been responded to' }
  }

  const now = new Date().toISOString()
  const update =
    action === 'accept'
      ? { status: 'accepted' as const, accepted_at: now }
      : { status: 'declined' as const, declined_at: now }

  const { error: updateErr } = await service
    .from('proposals')
    .update(update)
    .eq('id', proposal.id)

  if (updateErr) {
    return { success: false, error: 'Failed to record response' }
  }

  // Notify owner on accept (best-effort)
  if (action === 'accept') {
    const ownerRaw = proposal.profiles as unknown
    const owner = Array.isArray(ownerRaw)
      ? (ownerRaw[0] as { full_name: string | null; email: string } | undefined)
      : (ownerRaw as { full_name: string | null; email: string } | null)
    if (owner?.email) {
      try {
        await sendProposalAccepted({
          to: owner.email,
          clientName: owner.full_name ?? 'you',
          proposalTitle: proposal.title,
          proposalId: proposal.id,
        })
      } catch {
        // Silent — the status update is the source of truth
      }
    }
  }

  revalidatePath(`/p/${shareId}`)
  return { success: true }
}
