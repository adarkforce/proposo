import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProposal } from '@/lib/ai/generate-proposal'
import { generateProposalSchema } from '@/lib/validators/proposal'
import { nanoid } from 'nanoid'
import { addDays } from 'date-fns'
import type { ApiResponse, Proposal } from '@/types'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, error: 'Not authenticated' },
        { status: 401 },
      )
    }

    // Check credits
    const { data: profile } = await supabase
      .from('profiles')
      .select('credits_remaining, subscription_tier')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, error: 'Profile not found' },
        { status: 404 },
      )
    }

    const isUnlimited = profile.subscription_tier === 'enterprise'
    if (!isUnlimited && profile.credits_remaining <= 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 },
      )
    }

    // Validate input
    const body = await request.json()
    const parseResult = generateProposalSchema.safeParse(body)

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, error: firstError?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const input = parseResult.data

    // Generate with AI
    const generated = await generateProposal(input)

    // Create proposal in database
    const shareId = nanoid(12)
    const validUntil = addDays(new Date(), generated.suggested_valid_days).toISOString()

    const { data: proposal, error: insertError } = await supabase
      .from('proposals')
      .insert({
        user_id: user.id,
        title: generated.title,
        content: generated.content,
        total_amount: generated.total_amount,
        currency: input.currency ?? 'USD',
        share_id: shareId,
        valid_until: validUntil,
        status: 'draft',
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, data: null, error: 'Failed to save proposal' },
        { status: 500 },
      )
    }

    // Deduct credit
    if (!isUnlimited) {
      await supabase
        .from('profiles')
        .update({
          credits_remaining: profile.credits_remaining - 1,
          credits_used_this_month: (profile as Record<string, unknown>).credits_used_this_month as number + 1,
        })
        .eq('id', user.id)
    }

    return NextResponse.json<ApiResponse<Proposal>>({
      success: true,
      data: proposal,
      error: null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json<ApiResponse<null>>(
      { success: false, data: null, error: message },
      { status: 500 },
    )
  }
}
