import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to send proposals that actually win?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Join thousands of service professionals who close more deals with AI-powered proposals.
          Your first 3 proposals are free — no credit card required.
        </p>
        <div className="mt-8">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'text-lg px-8 py-6')}
          >
            Start Generating Proposals
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
