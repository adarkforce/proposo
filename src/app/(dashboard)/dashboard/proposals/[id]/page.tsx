import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { APP_URL } from '@/config/constants'
import type { ProposalContent, ProposalStatus } from '@/types'
import { ProposalActions } from '@/components/proposals/proposal-actions'

const STATUS_COLORS: Record<ProposalStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-purple-100 text-purple-800',
  accepted: 'bg-green-100 text-green-800',
  declined: 'bg-red-100 text-red-800',
  expired: 'bg-gray-100 text-gray-600',
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProposalDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, clients(name, email, company)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!proposal) notFound()

  const content = proposal.content as ProposalContent
  const shareUrl = `${APP_URL}/p/${proposal.share_id}`
  const status = proposal.status as ProposalStatus

  // Client info for pre-filling the Send dialog
  const clientRaw = proposal.clients as unknown
  const client = Array.isArray(clientRaw)
    ? (clientRaw[0] as { name: string; email: string; company: string | null } | undefined)
    : (clientRaw as { name: string; email: string; company: string | null } | null)

  return (
    <div>
      <Link
        href="/dashboard/proposals"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Proposals
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{proposal.title}</h1>
            <Badge className={STATUS_COLORS[status]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Created {format(new Date(proposal.created_at), 'MMM d, yyyy')}
            {proposal.valid_until && (
              <> &middot; Valid until {format(new Date(proposal.valid_until), 'MMM d, yyyy')}</>
            )}
          </p>
        </div>
        <ProposalActions
          proposalId={proposal.id}
          shareId={proposal.share_id}
          shareUrl={shareUrl}
          status={status}
          defaultClientEmail={client?.email}
          defaultClientName={client?.name}
          defaultClientCompany={client?.company ?? undefined}
        />
      </div>

      {/* Amount */}
      <Card className="mb-6">
        <CardContent className="flex items-center justify-between py-6">
          <span className="text-lg font-medium">Total Amount</span>
          <span className="text-3xl font-bold">
            ${Number(proposal.total_amount).toLocaleString()}
            <span className="text-sm text-muted-foreground ml-1">{proposal.currency}</span>
          </span>
        </CardContent>
      </Card>

      {/* Summary */}
      {content.summary && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{content.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      {content.sections?.map((section) => (
        <Card key={section.id} className="mb-4">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            {section.description && (
              <p className="text-sm text-muted-foreground">{section.description}</p>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ${item.unit_price.toLocaleString()}
                    </p>
                  </div>
                  <span className="font-mono font-medium">${item.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

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

      {/* Payment Terms */}
      {content.payment_terms && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Payment Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.payment_terms}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
