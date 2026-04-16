# Proposo — AI-Powered Proposal Generator SaaS

Fully automated, deploy-and-earn AI SaaS. Users describe their service in plain English and get a professional, client-ready proposal in under 60 seconds.

## What's Built

A complete, production-ready SaaS with:

- **Marketing site** — Landing, pricing, templates, 18 SEO-optimized industry pages
- **Auth** — Supabase email/password + Google OAuth
- **Dashboard** — Proposal management, client list, analytics, billing, settings
- **AI generation** — Claude API generates complete proposals with itemized pricing
- **Client portal** — Shareable links at `/p/{shareId}` where clients view, accept, decline
- **PDF export** — On-demand branded HTML/PDF export
- **Stripe billing** — 4-tier subscriptions (Free, Pro $29, Business $79, Enterprise $199) with credit tracking
- **Automated follow-ups** — Daily cron sends reminder emails via Resend
- **Webhooks** — Stripe webhook auto-provisions subscriptions and credits

## Tech Stack

Next.js 16 (Turbopack) · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Stripe · Claude API · Resend · Vercel

## Quick Deploy (~15 min)

### 1. Create accounts
- [Supabase](https://supabase.com) — free tier
- [Stripe](https://stripe.com) — test mode first
- [Anthropic Console](https://console.anthropic.com) — Claude API key
- [Resend](https://resend.com) — free tier (3,000 emails/mo)
- [Vercel](https://vercel.com) — free tier

### 2. Supabase setup
1. Create a new project
2. SQL Editor → paste contents of `supabase/migrations/001_initial_schema.sql` → run
3. Auth → Providers → enable Google OAuth (optional)
4. Copy `URL`, `anon key`, and `service_role key` into env vars

### 3. Stripe setup
Create 3 monthly products (Pro $29, Business $79, Enterprise $199), copy price IDs into `src/config/pricing.ts`, and create a webhook pointing to `/api/webhooks/stripe` with events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

### 4. Deploy to Vercel
```bash
vercel --prod
```
Add all env vars from `.env.example` in Vercel dashboard. Also add `CRON_SECRET` (random string) for the follow-up cron.

### 5. Post-deploy
- Add your domain in Vercel
- Update `NEXT_PUBLIC_APP_URL` to production URL
- Update Stripe webhook URL to production
- Verify `vercel.json` cron runs daily at 9 AM

## Local Development

```bash
cp .env.example .env.local   # fill in values
pnpm install
pnpm dev                      # http://localhost:3000
```

## Architecture

```
src/
├── app/
│   ├── (marketing)/        # Public SEO pages
│   ├── (auth)/             # Login, signup
│   ├── (dashboard)/        # Authenticated app
│   ├── (share)/p/[id]      # Public client portal
│   └── api/                # AI, PDF, Stripe webhooks, cron
├── components/
│   ├── landing/            # Marketing components
│   ├── dashboard/          # App shell
│   ├── proposals/          # Proposal UI
│   └── ui/                 # shadcn/ui primitives
├── lib/
│   ├── supabase/           # Client, server, middleware
│   ├── stripe/             # Client + server actions
│   ├── ai/                 # Claude API integration
│   ├── email/              # Resend templates
│   └── validators/         # Zod schemas
└── config/                 # Pricing tiers, constants, SEO
```

## Automation — What Runs Without You

| Stage | Mechanism |
|---|---|
| Acquisition | 18 SEO pages + landing rank for "AI proposal generator", "[industry] proposal template" |
| Signup | Self-serve via Supabase Auth (email + Google OAuth) |
| Onboarding | Auto-profile creation on trigger, 3 free credits, instant generation |
| Conversion | In-app upgrade → Stripe Checkout → webhook → tier upgrade (zero manual) |
| Retention | Daily cron sends follow-up reminders on stale proposals |
| Billing | Stripe handles renewals, failed payments, and customer portal |

## Revenue Model

- **Free**: 3 proposals/mo → converts via credit exhaustion
- **Pro $29/mo**: 50 proposals/mo — primary target (freelancers, consultants)
- **Business $79/mo**: 200 proposals + payment collection + automation
- **Enterprise $199/mo**: Unlimited + white-label

## Files That Matter Most

| File | Why |
|---|---|
| `src/lib/ai/generate-proposal.ts` | The core product — Claude prompt engineering |
| `src/app/api/proposals/generate/route.ts` | Credit gating + AI orchestration |
| `src/app/api/webhooks/stripe/route.ts` | Auto-provisioning subscriptions |
| `src/app/api/cron/route.ts` | Automated retention |
| `supabase/migrations/001_initial_schema.sql` | Data model + RLS policies |
| `src/config/pricing.ts` | Revenue config |

## Next Steps for Growth

1. **Verify** — Put real env vars in `.env.local`, generate a test proposal end-to-end
2. **SEO** — Submit sitemap to Google Search Console; add more industry templates
3. **Launch** — Product Hunt + IndieHackers + r/SaaS
4. **Analytics** — Add PostHog (already a dep — just needs init)
5. **Scale** — Team features, API access, Zapier integration at $10K MRR
