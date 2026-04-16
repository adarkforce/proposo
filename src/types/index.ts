// ============================================================
// Proposo Core Types
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// --- User & Auth ---
export interface Profile {
  readonly id: string
  readonly email: string
  readonly full_name: string | null
  readonly company_name: string | null
  readonly company_logo_url: string | null
  readonly brand_color: string
  readonly stripe_customer_id: string | null
  readonly subscription_tier: SubscriptionTier
  readonly credits_remaining: number
  readonly created_at: string
  readonly updated_at: string
}

export type SubscriptionTier = 'free' | 'pro' | 'business' | 'enterprise'

// --- Proposals ---
export interface Proposal {
  readonly id: string
  readonly user_id: string
  readonly client_id: string | null
  readonly title: string
  readonly status: ProposalStatus
  readonly share_id: string
  readonly content: ProposalContent
  readonly total_amount: number
  readonly currency: string
  readonly valid_until: string | null
  readonly created_at: string
  readonly updated_at: string
  readonly sent_at: string | null
  readonly viewed_at: string | null
  readonly accepted_at: string | null
  readonly declined_at: string | null
}

export type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired'

export interface ProposalContent {
  readonly summary: string
  readonly sections: readonly ProposalSection[]
  readonly terms: string
  readonly payment_terms: string
}

export interface ProposalSection {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly items: readonly LineItem[]
}

export interface LineItem {
  readonly id: string
  readonly description: string
  readonly quantity: number
  readonly unit_price: number
  readonly total: number
}

// --- Clients ---
export interface Client {
  readonly id: string
  readonly user_id: string
  readonly name: string
  readonly email: string
  readonly company: string | null
  readonly phone: string | null
  readonly address: string | null
  readonly notes: string | null
  readonly created_at: string
  readonly updated_at: string
}

// --- Proposal Views (Analytics) ---
export interface ProposalView {
  readonly id: string
  readonly proposal_id: string
  readonly viewer_ip: string | null
  readonly viewer_email: string | null
  readonly duration_seconds: number
  readonly created_at: string
}

// --- AI Generation ---
export interface GenerateProposalInput {
  readonly description: string
  readonly client_name?: string
  readonly client_company?: string
  readonly industry?: string
  readonly template?: string
  readonly currency?: string
  readonly language?: string
}

export interface GenerateProposalOutput {
  readonly title: string
  readonly content: ProposalContent
  readonly total_amount: number
  readonly suggested_valid_days: number
}

// --- Stripe / Billing ---
export interface PricingTier {
  readonly id: SubscriptionTier
  readonly name: string
  readonly description: string
  readonly price_monthly: number
  readonly price_yearly: number
  readonly credits_per_month: number
  readonly features: readonly string[]
  readonly stripe_price_id_monthly: string
  readonly stripe_price_id_yearly: string
  readonly highlighted: boolean
}

// --- API Responses ---
export interface ApiResponse<T> {
  readonly success: boolean
  readonly data: T | null
  readonly error: string | null
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly total: number
  readonly page: number
  readonly limit: number
}
