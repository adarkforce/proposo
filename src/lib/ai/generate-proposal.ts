import Anthropic from '@anthropic-ai/sdk'
import type { GenerateProposalInput, GenerateProposalOutput, ProposalSection } from '@/types'
import { nanoid } from 'nanoid'

// Lazy init — avoids instantiation at build time when env vars aren't set
let _anthropic: Anthropic | null = null
function anthropic(): Anthropic {
  if (!_anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured')
    _anthropic = new Anthropic({ apiKey })
  }
  return _anthropic
}

const SYSTEM_PROMPT = `You are Proposo AI, an expert business proposal writer. You generate professional, persuasive, and detailed proposals for service businesses.

Your proposals are:
- Professional and polished
- Specific with itemized pricing
- Persuasive but honest
- Well-structured with clear sections
- Tailored to the industry and service described

You MUST respond with valid JSON matching this exact schema:
{
  "title": "string — compelling proposal title",
  "summary": "string — 2-3 sentence executive summary",
  "sections": [
    {
      "title": "string — section title",
      "description": "string — detailed section description",
      "items": [
        {
          "description": "string — line item description",
          "quantity": number,
          "unit_price": number,
          "total": number
        }
      ]
    }
  ],
  "terms": "string — terms and conditions",
  "payment_terms": "string — payment schedule/terms",
  "total_amount": number,
  "suggested_valid_days": number
}

Include 3-6 sections. Each section should have 1-5 line items. Make pricing realistic for the industry. Total should be the sum of all item totals.`

export async function generateProposal(
  input: GenerateProposalInput,
): Promise<GenerateProposalOutput> {
  const userPrompt = buildUserPrompt(input)

  const response = await anthropic().messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text response from AI')
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse AI response as JSON')
  }

  const parsed = JSON.parse(jsonMatch[0]) as {
    title: string
    summary: string
    sections: Array<{
      title: string
      description: string
      items: Array<{
        description: string
        quantity: number
        unit_price: number
        total: number
      }>
    }>
    terms: string
    payment_terms: string
    total_amount: number
    suggested_valid_days: number
  }

  const sections: ProposalSection[] = parsed.sections.map((s) => ({
    id: nanoid(),
    title: s.title,
    description: s.description,
    items: s.items.map((item) => ({
      id: nanoid(),
      description: item.description,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
    })),
  }))

  return {
    title: parsed.title,
    content: {
      summary: parsed.summary,
      sections,
      terms: parsed.terms,
      payment_terms: parsed.payment_terms,
    },
    total_amount: parsed.total_amount,
    suggested_valid_days: parsed.suggested_valid_days,
  }
}

function buildUserPrompt(input: GenerateProposalInput): string {
  const parts = [`Generate a professional proposal for the following service:\n\n${input.description}`]

  if (input.client_name) parts.push(`\nClient: ${input.client_name}`)
  if (input.client_company) parts.push(`Client company: ${input.client_company}`)
  if (input.industry) parts.push(`Industry: ${input.industry}`)
  if (input.template) parts.push(`Template/Category: ${input.template}`)
  if (input.currency) parts.push(`Currency: ${input.currency}`)
  if (input.language) parts.push(`Language: ${input.language}`)

  parts.push('\nRespond with ONLY the JSON object, no markdown formatting.')

  return parts.join('\n')
}
