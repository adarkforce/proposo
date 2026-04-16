import { Resend } from 'resend'
import { APP_NAME, APP_URL } from '@/config/constants'

// Lazy init — avoids instantiation at build time when env vars aren't set
let _resend: Resend | null = null
function resend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY
    if (!key) throw new Error('RESEND_API_KEY is not configured')
    _resend = new Resend(key)
  }
  return _resend
}

const FROM_EMAIL = `${APP_NAME} <noreply@proposo.com>`

export async function sendProposalNotification({
  to,
  clientName,
  proposalTitle,
  shareUrl,
  senderName,
}: {
  to: string
  clientName: string
  proposalTitle: string
  shareUrl: string
  senderName: string
}) {
  return resend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `New Proposal: ${proposalTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">You've received a proposal</h2>
        <p>Hi ${clientName},</p>
        <p>${senderName} has sent you a proposal: <strong>${proposalTitle}</strong></p>
        <a href="${shareUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Proposal
        </a>
        <p style="color: #6b7280; font-size: 14px;">This link will take you to a secure page where you can review and accept the proposal.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Sent via ${APP_NAME} — ${APP_URL}</p>
      </div>
    `,
  })
}

export async function sendProposalAccepted({
  to,
  clientName,
  proposalTitle,
  proposalId,
}: {
  to: string
  clientName: string
  proposalTitle: string
  proposalId: string
}) {
  return resend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Proposal Accepted: ${proposalTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #059669;">Proposal Accepted! 🎉</h2>
        <p>${clientName} has accepted your proposal: <strong>${proposalTitle}</strong></p>
        <a href="${APP_URL}/dashboard/proposals/${proposalId}" style="display: inline-block; padding: 12px 24px; background-color: #059669; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Details
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Sent via ${APP_NAME}</p>
      </div>
    `,
  })
}

export async function sendFollowUpReminder({
  to,
  clientName,
  proposalTitle,
  shareUrl,
  daysSinceSent,
  senderName,
}: {
  to: string
  clientName: string
  proposalTitle: string
  shareUrl: string
  daysSinceSent: number
  senderName: string
}) {
  return resend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Reminder: ${proposalTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #111827;">Friendly Reminder</h2>
        <p>Hi ${clientName},</p>
        <p>${senderName} sent you a proposal ${daysSinceSent} days ago: <strong>${proposalTitle}</strong></p>
        <p>Just a friendly follow-up in case you missed it.</p>
        <a href="${shareUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          View Proposal
        </a>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Sent via ${APP_NAME}</p>
      </div>
    `,
  })
}
