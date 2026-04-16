'use client'

import { useState, useTransition } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Send, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { sendProposal } from '@/lib/actions/proposals'

interface Props {
  readonly proposalId: string
  readonly trigger: React.ReactNode
  readonly defaultClientEmail?: string
  readonly defaultClientName?: string
  readonly defaultClientCompany?: string
}

export function SendProposalDialog({
  proposalId,
  trigger,
  defaultClientEmail = '',
  defaultClientName = '',
  defaultClientCompany = '',
}: Props) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  const [clientEmail, setClientEmail] = useState(defaultClientEmail)
  const [clientName, setClientName] = useState(defaultClientName)
  const [clientCompany, setClientCompany] = useState(defaultClientCompany)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const result = await sendProposal({
        proposalId,
        clientEmail,
        clientName,
        clientCompany: clientCompany || undefined,
      })

      if (!result.success) {
        toast.error(result.error ?? 'Failed to send proposal')
        return
      }

      if (result.warning) {
        toast.warning(result.warning, { duration: 6000 })
      } else {
        toast.success(`Proposal sent to ${clientEmail}`)
      }

      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Send Proposal
            </DialogTitle>
            <DialogDescription>
              We&apos;ll email your client a secure link where they can review, accept,
              or decline this proposal.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clientEmail">
                Client Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">
                Client Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="clientName"
                placeholder="Jane Smith"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Send Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
