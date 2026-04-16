import type { Metadata } from 'next'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTA } from '@/components/landing/cta'
import { buildMetadata } from '@/config/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Pricing',
  description: 'Simple, transparent pricing for AI-powered proposals. Start free, upgrade when you need more.',
  path: '/pricing',
})

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <CTA />
    </>
  )
}
