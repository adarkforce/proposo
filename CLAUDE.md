@AGENTS.md

# Proposo — AI Proposal Generator SaaS

## Overview
Proposo is a fully automated AI-powered proposal generator SaaS. Users describe their service/project in plain language and get a beautifully formatted, professional proposal in seconds. Zero human intervention — SEO drives traffic, self-serve signup, usage-based billing via Stripe, AI generation via Claude API.

## Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **Payments**: Stripe (subscriptions + usage-based credits)
- **AI**: Anthropic Claude API (proposal generation)
- **Email**: Resend (transactional emails)
- **PDF**: @react-pdf/renderer
- **Hosting**: Vercel
- **Testing**: Vitest + Testing Library

## Architecture

### Route Groups
- `(marketing)` — Public pages: landing, pricing, templates, SEO pages
- `(auth)` — Login, signup, OAuth callback
- `(dashboard)` — Authenticated app: proposals, clients, settings, billing
- `(share)` — Public proposal sharing portal (no auth required)
- `api/` — API routes: AI generation, PDF export, Stripe webhooks, cron jobs

### Key Directories
- `src/lib/supabase/` — Supabase client (server + browser), middleware helpers
- `src/lib/stripe/` — Stripe client, pricing config, webhook handlers
- `src/lib/ai/` — Claude API integration, prompt templates, proposal generation
- `src/lib/email/` — Resend templates and sending functions
- `src/lib/pdf/` — PDF template components and generation
- `src/lib/validators/` — Zod schemas for all data types
- `src/config/` — App config, pricing tiers, constants

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
RESEND_API_KEY
NEXT_PUBLIC_APP_URL
```

## Commands
- `pnpm dev` — Dev server (port 3000)
- `pnpm build` — Production build
- `pnpm test` — Tests (vitest)
- `pnpm lint` — ESLint

## Code Conventions
- Immutable data — never mutate, always return new objects
- Small files (200-400 lines max)
- Zod validation at all system boundaries
- Server Components by default, 'use client' only when needed
- Server Actions for mutations
