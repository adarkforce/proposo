import Stripe from 'stripe'

// Lazy init — avoids instantiation at build time when env vars aren't set
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not configured')
    _stripe = new Stripe(key, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

// Proxy for backward compatibility — allows `stripe.foo()` style calls
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop)
  },
})
