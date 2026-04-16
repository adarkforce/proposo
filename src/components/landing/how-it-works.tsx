import { MessageSquare, Wand2, Send, PartyPopper } from 'lucide-react'

const STEPS = [
  {
    step: 1,
    icon: MessageSquare,
    title: 'Describe your service',
    description:
      'Tell us about the project in plain language. "Website redesign for a restaurant, 5 pages, includes menu integration and booking system."',
  },
  {
    step: 2,
    icon: Wand2,
    title: 'AI generates your proposal',
    description:
      'In under 60 seconds, get a complete proposal with executive summary, scope breakdown, itemized pricing, and professional terms.',
  },
  {
    step: 3,
    icon: Send,
    title: 'Send to your client',
    description:
      'Share via link or download as PDF. Your client views it in a branded portal where they can accept and pay — all in one place.',
  },
  {
    step: 4,
    icon: PartyPopper,
    title: 'Win the deal',
    description:
      'Get notified when they view and accept. Collect payment instantly. Move on to the next one — you\'ve got more deals to close.',
  },
] as const

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            From description to done deal in 4 steps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            No more staring at blank documents. No more copying from old proposals.
            Just describe, generate, send, win.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step) => (
            <div key={step.step} className="relative text-center">
              {/* Step number */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">
                {step.step}
              </div>
              {/* Connector line (desktop) */}
              {step.step < 4 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px bg-border" />
              )}
              <step.icon className="mx-auto h-8 w-8 text-primary mb-3" />
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
