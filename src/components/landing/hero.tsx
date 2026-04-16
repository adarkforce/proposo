import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles, Clock, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
          <Sparkles className="mr-1.5 h-3.5 w-3.5" />
          AI-Powered Proposals in Seconds
        </Badge>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          Stop writing proposals.{' '}
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            Start winning deals.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
          Describe your service in plain language. Get a professional, client-ready proposal
          with itemized pricing in under 60 seconds. No templates to fill. No formatting to fix.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'text-lg px-8 py-6')}
          >
            Generate Your First Proposal Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="#how-it-works"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'text-lg px-8 py-6')}
          >
            See How It Works
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          No credit card required. 3 free proposals every month.
        </p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center">
            <Clock className="h-8 w-8 text-blue-600 mb-2" />
            <span className="text-3xl font-bold">60s</span>
            <span className="text-sm text-muted-foreground">Average generation time</span>
          </div>
          <div className="flex flex-col items-center">
            <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-3xl font-bold">3x</span>
            <span className="text-sm text-muted-foreground">More proposals sent</span>
          </div>
          <div className="flex flex-col items-center">
            <Sparkles className="h-8 w-8 text-violet-600 mb-2" />
            <span className="text-3xl font-bold">40%</span>
            <span className="text-sm text-muted-foreground">Higher win rate</span>
          </div>
        </div>
      </div>
    </section>
  )
}
