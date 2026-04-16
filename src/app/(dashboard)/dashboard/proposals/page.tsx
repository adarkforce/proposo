import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import type { ProposalStatus } from '@/types'

const STATUS_STYLES: Record<ProposalStatus, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  draft: { label: 'Draft', variant: 'secondary' },
  sent: { label: 'Sent', variant: 'outline' },
  viewed: { label: 'Viewed', variant: 'default' },
  accepted: { label: 'Accepted', variant: 'default' },
  declined: { label: 'Declined', variant: 'destructive' },
  expired: { label: 'Expired', variant: 'secondary' },
}

export default async function ProposalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: proposals } = await supabase
    .from('proposals')
    .select('*, clients(name, company)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your proposals
          </p>
        </div>
        <Link
          href="/dashboard/proposals/new"
          className={cn(buttonVariants())}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Link>
      </div>

      {!proposals || proposals.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground mb-4">No proposals yet.</p>
          <Link
            href="/dashboard/proposals/new"
            className={cn(buttonVariants())}
          >
            Create Your First Proposal
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => {
                const status = STATUS_STYLES[proposal.status as ProposalStatus] ?? STATUS_STYLES.draft
                const client = proposal.clients as { name: string; company: string | null } | null

                return (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/proposals/${proposal.id}`}
                        className="font-medium hover:underline"
                      >
                        {proposal.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {client?.name ?? 'No client'}
                    </TableCell>
                    <TableCell className="font-mono">
                      ${Number(proposal.total_amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(proposal.created_at), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
