import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { ProposalContent } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: proposal } = await supabase
    .from('proposals')
    .select('*, profiles(full_name, company_name, brand_color)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!proposal) {
    return NextResponse.json({ error: 'Proposal not found' }, { status: 404 })
  }

  const content = proposal.content as ProposalContent
  const profile = proposal.profiles as { full_name: string | null; company_name: string | null; brand_color: string } | null

  // Generate simple HTML-based PDF (using HTML string for now — can upgrade to @react-pdf/renderer later)
  const html = generatePdfHtml({
    title: proposal.title,
    content,
    totalAmount: Number(proposal.total_amount),
    currency: proposal.currency,
    validUntil: proposal.valid_until,
    companyName: profile?.company_name ?? profile?.full_name ?? '',
    brandColor: profile?.brand_color ?? '#2563eb',
  })

  // Return HTML that can be printed to PDF by the browser
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
      'Content-Disposition': `inline; filename="proposal-${proposal.share_id}.html"`,
    },
  })
}

function generatePdfHtml({
  title,
  content,
  totalAmount,
  currency,
  validUntil,
  companyName,
  brandColor,
}: {
  title: string
  content: ProposalContent
  totalAmount: number
  currency: string
  validUntil: string | null
  companyName: string
  brandColor: string
}): string {
  const sectionsHtml = content.sections
    .map(
      (section) => `
    <div style="margin-bottom: 24px;">
      <h2 style="color: ${brandColor}; font-size: 18px; margin-bottom: 8px;">${section.title}</h2>
      <p style="color: #6b7280; margin-bottom: 12px;">${section.description}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb;">Item</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Qty</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Price</th>
            <th style="text-align: right; padding: 8px; border-bottom: 1px solid #e5e7eb;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${section.items
            .map(
              (item) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.description}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f3f4f6;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f3f4f6;">$${item.unit_price.toLocaleString()}</td>
              <td style="text-align: right; padding: 8px; border-bottom: 1px solid #f3f4f6; font-weight: 600;">$${item.total.toLocaleString()}</td>
            </tr>
          `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `,
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    @media print { body { margin: 0; } }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #111827; }
  </style>
</head>
<body>
  <div style="text-align: right; margin-bottom: 32px;">
    <div style="font-size: 24px; font-weight: bold; color: ${brandColor};">${companyName}</div>
    ${validUntil ? `<div style="color: #6b7280; font-size: 14px;">Valid until: ${new Date(validUntil).toLocaleDateString()}</div>` : ''}
  </div>

  <h1 style="font-size: 28px; margin-bottom: 16px;">${title}</h1>
  <p style="color: #6b7280; font-size: 16px; margin-bottom: 32px;">${content.summary}</p>

  ${sectionsHtml}

  <div style="margin-top: 32px; padding: 16px; background: ${brandColor}10; border-radius: 8px; text-align: right;">
    <span style="font-size: 14px; color: #6b7280;">Total Amount</span><br>
    <span style="font-size: 32px; font-weight: bold; color: ${brandColor};">$${totalAmount.toLocaleString()} ${currency}</span>
  </div>

  ${content.terms ? `<div style="margin-top: 32px;"><h3>Terms & Conditions</h3><p style="color: #6b7280; font-size: 14px; white-space: pre-wrap;">${content.terms}</p></div>` : ''}
  ${content.payment_terms ? `<div style="margin-top: 16px;"><h3>Payment Terms</h3><p style="color: #6b7280; font-size: 14px; white-space: pre-wrap;">${content.payment_terms}</p></div>` : ''}

  <div style="margin-top: 48px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; text-align: center;">
    Generated with Proposo — AI-Powered Proposals
  </div>
</body>
</html>`
}
