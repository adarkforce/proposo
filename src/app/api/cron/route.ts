import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { sendFollowUpReminder } from '@/lib/email/send'
import { APP_URL } from '@/config/constants'
import { differenceInDays } from 'date-fns'

// This endpoint is called by Vercel Cron to send automated follow-ups
// Configure in vercel.json: { "crons": [{ "path": "/api/cron", "schedule": "0 9 * * *" }] }

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()

  // Find proposals that are "sent" but not viewed/accepted after 3 days
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const { data: staleProposals } = await supabase
    .from('proposals')
    .select('*, profiles(full_name, email), clients(name, email)')
    .eq('status', 'sent')
    .lt('sent_at', threeDaysAgo.toISOString())

  if (!staleProposals || staleProposals.length === 0) {
    return NextResponse.json({ message: 'No follow-ups needed', count: 0 })
  }

  let sentCount = 0

  for (const proposal of staleProposals) {
    const client = proposal.clients as { name: string; email: string } | null
    const profile = proposal.profiles as { full_name: string | null; email: string } | null

    if (!client?.email || !profile) continue

    const daysSinceSent = differenceInDays(new Date(), new Date(proposal.sent_at))

    try {
      await sendFollowUpReminder({
        to: client.email,
        clientName: client.name,
        proposalTitle: proposal.title,
        shareUrl: `${APP_URL}/p/${proposal.share_id}`,
        daysSinceSent,
        senderName: profile.full_name ?? 'Your service provider',
      })
      sentCount++
    } catch {
      // Continue with next — don't break the loop
    }
  }

  return NextResponse.json({ message: 'Follow-ups sent', count: sentCount })
}
