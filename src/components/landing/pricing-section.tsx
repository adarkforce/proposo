'use client'

import { useState } from 'react'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check } from 'lucide-react'
import { PRICING_TIERS } from '@/config/pricing'
import { cn } from '@/lib/utils'

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>

          {/* Annual toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <Label htmlFor="annual" className="text-sm text-muted-foreground">
              Monthly
            </Label>
            <Switch id="annual" checked={annual} onCheckedChange={setAnnual} />
            <Label htmlFor="annual" className="text-sm text-muted-foreground">
              Annual{' '}
              <Badge variant="secondary" className="ml-1">
                Save 17%
              </Badge>
            </Label>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier) => {
            const price = annual ? tier.price_yearly : tier.price_monthly
            const period = annual ? '/year' : '/month'

            return (
              <Card
                key={tier.id}
                className={cn(
                  'relative flex flex-col',
                  tier.highlighted && 'border-primary shadow-lg scale-[1.02]',
                )}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Most Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {price === 0 ? 'Free' : `$${price}`}
                    </span>
                    {price > 0 && (
                      <span className="text-muted-foreground">{period}</span>
                    )}
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link
                    href="/signup"
                    className={cn(
                      buttonVariants({ variant: tier.highlighted ? 'default' : 'outline' }),
                      'w-full',
                    )}
                  >
                    {tier.id === 'free' ? 'Start Free' : 'Get Started'}
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
