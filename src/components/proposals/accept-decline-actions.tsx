'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

interface Props {
  readonly proposalId: string
}

export function AcceptDeclineActions({ proposalId }: Props) {
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)
  const [done, setDone] = useState(false)

  async function handleAction(action: 'accept' | 'decline') {
    setLoading(action)

    const supabase = createClient()
    const now = new Date().toISOString()

    const update =
      action === 'accept'
        ? { status: 'accepted', accepted_at: now }
        : { status: 'declined', declined_at: now }

    const { error } = await supabase
      .from('proposals')
      .update(update)
      .eq('id', proposalId)

    if (error) {
      toast.error('Something went wrong. Please try again.')
      setLoading(null)
      return
    }

    setDone(true)
    setLoading(null)

    if (action === 'accept') {
      toast.success('Proposal accepted! The sender has been notified.')
    } else {
      toast.info('Proposal declined. The sender has been notified.')
    }

    // Reload to show updated status
    window.location.reload()
  }

  if (done) return null

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      <Button
        size="lg"
        className="bg-green-600 hover:bg-green-700 text-white px-8"
        onClick={() => handleAction('accept')}
        disabled={loading !== null}
      >
        {loading === 'accept' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle className="mr-2 h-4 w-4" />
        )}
        Accept Proposal
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="px-8"
        onClick={() => handleAction('decline')}
        disabled={loading !== null}
      >
        {loading === 'decline' ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}
        Decline
      </Button>
    </div>
  )
}
