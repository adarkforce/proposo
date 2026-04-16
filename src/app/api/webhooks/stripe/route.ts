import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createServiceClient } from '@/lib/supabase/server'
import { getTier } from '@/config/pricing'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.supabase_user_id
      if (!userId) break

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
      const priceId = subscription.items.data[0]?.price.id
      const tier = determineTierFromPrice(priceId)

      await supabase
        .from('profiles')
        .update({
          subscription_tier: tier,
          credits_remaining: getTier(tier)?.credits_per_month ?? 3,
          credits_used_this_month: 0,
          billing_cycle_start: new Date().toISOString(),
        })
        .eq('id', userId)

      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (!profile) break

      const priceId = subscription.items.data[0]?.price.id
      const tier = determineTierFromPrice(priceId)

      if (subscription.status === 'active') {
        await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            credits_remaining: getTier(tier)?.credits_per_month ?? 3,
          })
          .eq('id', profile.id)
      }

      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('profiles')
        .update({
          subscription_tier: 'free',
          credits_remaining: 3,
          credits_used_this_month: 0,
        })
        .eq('stripe_customer_id', customerId)

      break
    }

    case 'invoice.payment_failed': {
      // Could send email notification here
      break
    }
  }

  return NextResponse.json({ received: true })
}

function determineTierFromPrice(priceId: string | undefined): string {
  if (!priceId) return 'free'
  if (priceId.includes('enterprise')) return 'enterprise'
  if (priceId.includes('business')) return 'business'
  if (priceId.includes('pro')) return 'pro'
  return 'free'
}
