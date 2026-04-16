'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { respondToProposal } from '@/lib/actions/proposals'

interface Props {
  readonly shareId: string
}

export function AcceptDeclineActions({ shareId }: Props) {
  const [pending, startTransition] = useTransition()
  const [current, setCurrent] = useState<'accept' | 'decline' | null>(null)

  function handleAction(action: 'accept' | 'decline') {
    setCurrent(action)
    startTransition(async () => {
      const result = await respondToProposal({ shareId, action })

      if (!result.success) {
        toast.error(result.error ?? 'Something went wrong')
        setCurrent(null)
        return
      }

      if (action === 'accept') {
        toast.success('Proposal accepted! The sender has been notified.')
      } else {
        toast.info('Proposal declined.')
      }

      // Reload to show the updated status badge and hide these buttons
      window.location.reload()
    })
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-8">
      <Button
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-white px-8 w-full sm:w-auto"
        onClick={() => handleAction('accept')}
        disabled={pending}
      >
        {pending && current === 'accept' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Accept Proposal
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="px-8 w-full sm:w-auto"
        onClick={() => handleAction('decline')}
        disabled={pending}
      >
        {pending && current === 'decline' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Decline
      </Button>
    </div>
  )
}
