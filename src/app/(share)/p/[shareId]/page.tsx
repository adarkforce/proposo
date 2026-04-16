import { createServiceClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Zap } from 'lucide-react'
import { APP_NAME } from '@/config/constants'
import type { ProposalContent } from '@/types'
import { AcceptDeclineActions } from '@/components/proposals/accept-decline-actions'

interface PageProps {
  params: Promise<{ shareId: string }>
}

export default async function SharedProposalPage({ params }: PageProps) {
  const { shareId } = await params
  const supabase = await createServiceClient()

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, profiles(full_name, company_name, brand_color)')
    .eq('share_id', shareId)
    .single()

  if (!proposal) notFound()

  const content = proposal.content as ProposalContent
  const profile = proposal.profiles as { full_name: string | null; company_name: string | null; brand_color: string } | null

  // Record view
  await supabase.from('proposal_views').insert({
    proposal_id: proposal.id,
  })

  // Update status to viewed if currently sent
  if (proposal.status === 'sent') {
    await supabase
      .from('proposals')
      .update({ status: 'viewed', viewed_at: new Date().toISOString() })
      .eq('id', proposal.id)
  }

  const brandColor = profile?.brand_color ?? '#2563eb'
  const isAccepted = proposal.status === 'accepted'
  const isDeclined = proposal.status === 'declined'

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5" style={{ color: brandColor }} />
            <span className="font-semibold">
              {profile?.company_name ?? profile?.full_name ?? APP_NAME}
            </span>
          </div>
          {isAccepted && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" /> Accepted
            </Badge>
          )}
          {isDeclined && (
            <Badge className="bg-red-100 text-red-800">
              <XCircle className="mr-1 h-3 w-3" /> Declined
            </Badge>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{proposal.title}</h1>
        {proposal.valid_until && (
          <p className="text-muted-foreground mb-8">
            Valid until {new Date(proposal.valid_until).toLocaleDateString()}
          </p>
        )}

        {/* Summary */}
        {content.summary && (
          <Card className="mb-6">
            <CardContent className="py-6">
              <p className="text-lg">{content.summary}</p>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        {content.sections?.map((section) => (
          <Card key={section.id} className="mb-4">
            <CardHeader>
              <CardTitle style={{ color: brandColor }}>{section.title}</CardTitle>
              {section.description && (
                <p className="text-sm text-muted-foreground">{section.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} x ${item.unit_price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-mono font-semibold">${item.total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Total */}
        <Card className="mb-6" style={{ borderColor: brandColor }}>
          <CardContent className="flex items-center justify-between py-6">
            <span className="text-lg font-medium">Total Amount</span>
            <span className="text-3xl font-bold" style={{ color: brandColor }}>
              ${Number(proposal.total_amount).toLocaleString()}
              <span className="text-sm text-muted-foreground ml-1">{proposal.currency}</span>
            </span>
          </CardContent>
        </Card>

        {/* Terms */}
        {content.terms && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.terms}</p>
            </CardContent>
          </Card>
        )}

        {content.payment_terms && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.payment_terms}</p>
            </CardContent>
          </Card>
        )}

        {/* Accept / Decline */}
        {!isAccepted && !isDeclined && (
          <AcceptDeclineActions shareId={shareId} />
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          Powered by {APP_NAME} — AI-Powered Proposals
        </div>
      </div>
    </div>
  )
}
