import type { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { PROPOSAL_TEMPLATES } from '@/config/constants'
import { buildMetadata } from '@/config/seo'
import { cn } from '@/lib/utils'

export const metadata: Metadata = buildMetadata({
  title: 'Proposal Templates',
  description: 'Browse 18+ industry-specific proposal templates. From web development to plumbing, find the perfect starting point.',
  path: '/templates',
})

export default function TemplatesPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Proposal Templates
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from 18+ industry-specific templates. Each one is AI-optimized
            to generate proposals tailored to your exact service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROPOSAL_TEMPLATES.map((template) => (
            <Link key={template.id} href={`/templates/${template.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="text-3xl mb-2">{template.icon}</div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>
                    Generate AI-powered {template.name.toLowerCase()} proposals in seconds
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/signup" className={cn(buttonVariants({ size: 'lg' }), 'text-lg px-8')}>
            Start Generating Proposals Free
          </Link>
        </div>
      </div>
    </div>
  )
}
