import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PricingSection } from '@/components/landing/pricing-section'
import { CTA } from '@/components/landing/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PricingSection />
      <CTA />
    </>
  )
}
