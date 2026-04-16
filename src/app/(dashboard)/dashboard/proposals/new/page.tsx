'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, ArrowLeft } from 'lucide-react'
import { PROPOSAL_TEMPLATES, SUPPORTED_CURRENCIES } from '@/config/constants'
import Link from 'next/link'

export default function NewProposalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [description, setDescription] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientCompany, setClientCompany] = useState('')
  const [template, setTemplate] = useState('')
  const [currency, setCurrency] = useState('USD')

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()

    if (description.length < 20) {
      setError('Please describe the service in at least 20 characters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          client_name: clientName || undefined,
          client_company: clientCompany || undefined,
          template: template || undefined,
          currency,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data.error ?? 'Failed to generate proposal')
        setLoading(false)
        return
      }

      router.push(`/dashboard/proposals/${data.data.id}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/proposals"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Proposals
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate New Proposal
          </CardTitle>
          <CardDescription>
            Describe the service you&apos;re offering. Our AI will generate a complete,
            professional proposal with itemized pricing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                {error}
              </div>
            )}

            {/* Service description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Describe Your Service <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="E.g., Full website redesign for a local restaurant. 5 pages including home, menu, about, reservations, and contact. Includes responsive design, SEO optimization, menu integration with their POS system, and online booking."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
                minLength={20}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/5000 — The more detail, the better the proposal.
              </p>
            </div>

            {/* Template selection */}
            <div className="space-y-2">
              <Label htmlFor="template">Industry Template</Label>
              <Select value={template} onValueChange={(v) => setTemplate(v ?? '')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an industry (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {PROPOSAL_TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.icon} {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="John Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCompany">Client Company</Label>
                <Input
                  id="clientCompany"
                  placeholder="Acme Corp"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={(v) => setCurrency(v ?? 'USD')}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.symbol} {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating proposal...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Proposal
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
