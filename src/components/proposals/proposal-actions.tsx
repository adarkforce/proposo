'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ExternalLink, FileDown, Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface ProposalActionsProps {
  readonly proposalId: string
  readonly shareId: string
  readonly shareUrl: string
}

export function ProposalActions({ proposalId, shareId, shareUrl }: ProposalActionsProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleOpenPreview() {
    window.open(shareUrl, '_blank')
  }

  async function handleDownloadPdf() {
    try {
      const res = await fetch(`/api/proposals/${proposalId}/pdf`)
      if (!res.ok) throw new Error('Failed to generate PDF')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `proposal-${shareId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download PDF')
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleCopyLink}>
        {copied ? <Check className="mr-1 h-4 w-4" /> : <Copy className="mr-1 h-4 w-4" />}
        {copied ? 'Copied' : 'Copy Link'}
      </Button>
      <Button variant="outline" size="sm" onClick={handleOpenPreview}>
        <ExternalLink className="mr-1 h-4 w-4" />
        Preview
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
        <FileDown className="mr-1 h-4 w-4" />
        PDF
      </Button>
    </div>
  )
}
