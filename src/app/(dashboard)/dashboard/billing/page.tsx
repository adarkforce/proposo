'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createCheckoutSession, createPortalSession } from '@/lib/stripe/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PRICING_TIERS } from '@/config/pricing'
import { Loader2, ExternalLink } from 'lucide-react'
import type { Profile } from '@/types'

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) setProfile(data as unknown as Profile)
    }
    loadProfile()
  }, [])

  async function handleUpgrade(priceId: string) {
    setLoading(priceId)
    const result = await createCheckoutSession(priceId)
    if (result.url) {
      window.location.href = result.url
    }
    setLoading(null)
  }

  async function handleManageBilling() {
    setLoading('portal')
    const result = await createPortalSession()
    if (result.url) {
      window.location.href = result.url
    }
    setLoading(null)
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const currentTier = PRICING_TIERS.find((t) => t.id === profile.subscription_tier)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and credits</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            You are on the <Badge variant="secondary">{currentTier?.name ?? 'Free'}</Badge> plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Credits Remaining</p>
              <p className="text-2xl font-bold">
                {profile.credits_remaining === -1 ? 'Unlimited' : profile.credits_remaining}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Price</p>
              <p className="text-2xl font-bold">
                {currentTier?.price_monthly === 0 ? 'Free' : `$${currentTier?.price_monthly}/mo`}
              </p>
            </div>
          </div>

          {profile.stripe_customer_id && (
            <Button variant="outline" onClick={handleManageBilling} disabled={loading === 'portal'}>
              {loading === 'portal' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <ExternalLink className="mr-2 h-4 w-4" />
              Manage Billing
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PRICING_TIERS.filter((t) => t.id !== 'free' && t.id !== profile.subscription_tier).map((tier) => (
          <Card key={tier.id}>
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold mb-4">${tier.price_monthly}/mo</p>
              <Button
                className="w-full"
                onClick={() => handleUpgrade(tier.stripe_price_id_monthly)}
                disabled={loading !== null}
              >
                {loading === tier.stripe_price_id_monthly && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Upgrade to {tier.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
