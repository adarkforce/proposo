import type { PricingTier } from '@/types'

export const PRICING_TIERS: readonly PricingTier[] = [
  {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for trying out Proposo',
    price_monthly: 0,
    price_yearly: 0,
    credits_per_month: 3,
    features: [
      '3 proposals per month',
      'AI-powered generation',
      'PDF export',
      'Client sharing link',
      'Basic templates',
    ],
    stripe_price_id_monthly: '',
    stripe_price_id_yearly: '',
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For freelancers and consultants',
    price_monthly: 29,
    price_yearly: 290,
    credits_per_month: 50,
    features: [
      '50 proposals per month',
      'Everything in Starter',
      'Premium templates',
      'Client portal with e-sign',
      'View analytics & tracking',
      'Custom branding',
      'Priority support',
    ],
    stripe_price_id_monthly: 'price_pro_monthly',
    stripe_price_id_yearly: 'price_pro_yearly',
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For growing service businesses',
    price_monthly: 79,
    price_yearly: 790,
    credits_per_month: 200,
    features: [
      '200 proposals per month',
      'Everything in Pro',
      'Payment collection (Stripe)',
      'Automated follow-ups',
      'Team members (up to 5)',
      'CRM integration',
      'API access',
      'White-label options',
    ],
    stripe_price_id_monthly: 'price_business_monthly',
    stripe_price_id_yearly: 'price_business_yearly',
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For agencies and large teams',
    price_monthly: 199,
    price_yearly: 1990,
    credits_per_month: -1, // unlimited
    features: [
      'Unlimited proposals',
      'Everything in Business',
      'Unlimited team members',
      'Full white-label',
      'Custom AI training',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    stripe_price_id_monthly: 'price_enterprise_monthly',
    stripe_price_id_yearly: 'price_enterprise_yearly',
    highlighted: false,
  },
] as const

export const CREDIT_OVERAGE_PRICE = 0.99 // per additional proposal

export function getTier(id: string): PricingTier | undefined {
  return PRICING_TIERS.find((t) => t.id === id)
}

export function hasCredits(tier: PricingTier, used: number): boolean {
  if (tier.credits_per_month === -1) return true
  return used < tier.credits_per_month
}
