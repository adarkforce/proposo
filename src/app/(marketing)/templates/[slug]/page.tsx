import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowRight } from 'lucide-react'
import { PROPOSAL_TEMPLATES } from '@/config/constants'
import { buildMetadata } from '@/config/seo'
import { cn } from '@/lib/utils'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return PROPOSAL_TEMPLATES.map((t) => ({ slug: t.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const template = PROPOSAL_TEMPLATES.find((t) => t.id === slug)
  if (!template) return {}

  return buildMetadata({
    title: `${template.name} Proposal Template`,
    description: `Generate professional ${template.name.toLowerCase()} proposals with AI. Create itemized quotes, scope documents, and client-ready proposals in seconds.`,
    path: `/templates/${slug}`,
  })
}

export default async function TemplatePage({ params }: PageProps) {
  const { slug } = await params
  const template = PROPOSAL_TEMPLATES.find((t) => t.id === slug)

  if (!template) {
    notFound()
  }

  const benefits = [
    `Professional ${template.name.toLowerCase()} proposal in 60 seconds`,
    'Itemized pricing tailored to your service',
    'Share via link or download as branded PDF',
    'Track when clients view and accept',
    'Built-in payment collection',
    'Automated follow-up reminders',
  ]

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-5xl mb-4">{template.icon}</div>
          <Badge variant="secondary" className="mb-4">
            AI-Powered Template
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {template.name} Proposal Generator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop spending hours writing {template.name.toLowerCase()} proposals.
            Describe your project and let AI create a professional, itemized proposal
            ready to send to your client.
          </p>
        </div>

        <div className="bg-muted/30 rounded-xl border p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">What you get:</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center">
          <Link
            href="/signup"
            className={cn(buttonVariants({ size: 'lg' }), 'text-lg px-8 py-6')}
          >
            Generate Your {template.name} Proposal
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Free to try — no credit card required
          </p>
        </div>
      </div>
    </div>
  )
}
