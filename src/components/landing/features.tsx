import {
  Sparkles,
  FileText,
  Send,
  BarChart3,
  CreditCard,
  Globe,
  Palette,
  Clock,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description:
      'Describe your project in plain English. Our AI creates a complete, professional proposal with realistic pricing in seconds.',
  },
  {
    icon: FileText,
    title: 'Beautiful PDF Export',
    description:
      'Download polished, branded PDFs ready to send. Professional formatting with your logo and colors — no design skills needed.',
  },
  {
    icon: Send,
    title: 'One-Click Client Sharing',
    description:
      'Share proposals via a secure link. Clients view, comment, and accept online. Get notified the moment they open it.',
  },
  {
    icon: BarChart3,
    title: 'View Analytics',
    description:
      'Know when clients open your proposal, how long they spend on each section, and when they\'re ready to buy.',
  },
  {
    icon: CreditCard,
    title: 'Payment Collection',
    description:
      'Accept deposits and payments directly through your proposals. Powered by Stripe for secure, instant transactions.',
  },
  {
    icon: Clock,
    title: 'Automated Follow-ups',
    description:
      'Never lose a deal to silence. Automatic reminder emails go out when proposals haven\'t been viewed or accepted.',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description:
      'Add your logo, brand colors, and company details. Every proposal looks like it came from your own design team.',
  },
  {
    icon: Globe,
    title: '18+ Industry Templates',
    description:
      'From construction to consulting, plumbing to photography — pre-built templates tailored to your industry.',
  },
] as const

export function Features() {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to close deals faster
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI generation to payment collection — Proposo handles the entire proposal
            lifecycle so you can focus on delivering great work.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="relative p-6 bg-background rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
