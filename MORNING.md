# 🌅 Buongiorno! Proposo è live, ecco cosa resta

## Stato attuale

**🚀 LIVE su:** https://proposo-gilt.vercel.app
**📦 GitHub:** https://github.com/adarkforce/proposo
**🗄️ Supabase project:** `proposo` (ref: `iswtjpzoagizyrkmenap`)
**☁️ Vercel project:** `proposo` nel team `adf4`

### Cosa funziona già
- ✅ Landing page (con gradient hero, stats, features, how-it-works, pricing, CTA)
- ✅ 18 template pages SEO-ottimizzate (/templates/web-development, /templates/plumbing, etc.)
- ✅ Pricing page con toggle Monthly/Annual
- ✅ Signup/Login pages (email + Google OAuth pronti)
- ✅ Supabase auth configurato con redirect URLs per produzione
- ✅ Database schema con RLS policies, trigger auto-profile, 4 tabelle
- ✅ Middleware Next.js protegge /dashboard
- ✅ Dashboard + proposals list + detail + new + billing + settings
- ✅ Send Proposal server action (crea client, cambia status, manda email)
- ✅ Accept/Decline flow dal client portal
- ✅ Stripe webhook endpoint + checkout session action
- ✅ PDF export endpoint
- ✅ Daily cron per follow-up automatici

### Cosa NON funziona ancora
Queste 3 integrazioni richiedono azioni umane che io non posso fare per te (KYC/account creation/domain verification):

| Integrazione | Cosa manca | Tempo stimato | Chi può farlo |
|---|---|---|---|
| **Anthropic** | API key (1 click in console) | 30 sec | **Solo tu** — popup Google OAuth si apre fuori dal MCP |
| **Stripe** | Account + KYC + products + webhook | ~30 min | **Solo tu** — serve SSN/partita IVA, IBAN, ID |
| **Resend** | Account + domain verification | ~15 min | **Solo tu** — servono DNS records |

## 🔧 Step 1 — Anthropic API key (il più urgente)

**Senza questa, generare una proposta fallisce.** Tutto il resto funziona comunque.

1. Vai su https://console.anthropic.com/settings/keys
2. Login (hai già l'account)
3. "Create Key" → dagli nome "proposo-prod" → copia la key (inizia con `sk-ant-api03-...`)
4. Vai su https://vercel.com/adf4/proposo/settings/environment-variables
5. Trova `ANTHROPIC_API_KEY` → clicca i tre puntini → Edit
6. Sostituisci `REPLACE_ME_TOMORROW` con la key vera → Save
7. Trigger redeploy: Deployments → ⋯ del deploy corrente → Redeploy

**Dopo questo, l'intero flow funziona:** signup → login → new proposal → genera con AI → condividi link → client apre → accept/decline.

## 💳 Step 2 — Stripe (quando hai 30 min e documenti pronti)

1. Registrati su https://dashboard.stripe.com/register
2. Completa KYC con SSN/partita IVA, IBAN, documento identità
3. Attiva test mode (top-right toggle)
4. **Crea 3 prodotti** (Products → Add product):
   - **Pro**: $29/mese recurring → copia price ID (es. `price_1O...`)
   - **Business**: $79/mese recurring → copia price ID
   - **Enterprise**: $199/mese recurring → copia price ID
5. **Sostituisci i price ID placeholder** in `src/config/pricing.ts`:
   ```ts
   stripe_price_id_monthly: 'price_pro_monthly',  // ← metti quello vero
   ```
6. **Prendi le API keys** (Developers → API keys):
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`
7. **Crea webhook** (Developers → Webhooks → Add endpoint):
   - URL: `https://proposo-gilt.vercel.app/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copia signing secret (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`
8. Aggiorna le 3 env vars su Vercel → redeploy

## 📧 Step 3 — Resend (per inviare email)

**Senza questa, creare proposal/inviare email a client fallisce silenziosamente** (ho messo try/catch best-effort — la proposta si salva comunque).

1. Registrati su https://resend.com
2. (Opzione A) Usa il dominio sandbox `onboarding@resend.dev` — funziona SUBITO ma a bassa deliverability
3. (Opzione B) Aggiungi un tuo dominio → verify con 3 DNS records → usa il tuo `noreply@tuodominio.com`
4. Settings → API Keys → Create → copia (`re_...`)
5. Aggiorna `RESEND_API_KEY` su Vercel → redeploy
6. **Cambia anche il FROM** in `src/lib/email/send.ts:8`:
   ```ts
   const FROM_EMAIL = `${APP_NAME} <noreply@tuodominio.com>`
   ```

## 🏷️ Step 4 (opzionale) — Dominio personalizzato

`proposo-gilt.vercel.app` funziona, ma per credibilità/SEO conviene un dominio proprio.

1. Compra dominio (Namecheap, Cloudflare, Porkbun, Vercel itself)
2. Vercel → proposo → Settings → Domains → Add
3. Aggiungi i DNS record che Vercel ti dice
4. Quando attivo, aggiorna:
   - `NEXT_PUBLIC_APP_URL` env var → `https://tuodominio.com`
   - Supabase → Auth → URL Config → Site URL e Redirect URLs
5. Redeploy

## 📊 Dove sono le chiavi/credenziali generate

- **Supabase anon + service_role keys**: già in Vercel env vars (tab Environment Variables)
- **Supabase DB password** (`1EilkMJwOoaVgJwi`): non serve altrove, Supabase la gestisce
- **Vercel CRON_SECRET**: auto-generata, già in env vars
- **GitHub repo**: `adarkforce/proposo` (public)

## 🐛 Se qualcosa rompe

- **500 sulle API**: env vars mancanti o sbagliate → Vercel Logs → cerca errore specifico
- **Auth redirect loop**: Supabase Auth → URL Config → verifica che `https://proposo-gilt.vercel.app/**` sia nella whitelist
- **AI generation fails**: Anthropic key ancora placeholder → Step 1
- **Email non arrivano**: Resend key placeholder o FROM non verificato → Step 3

## 🎯 Priorità consigliata

1. **Oggi (5 min)**: Step 1 (Anthropic) → il prodotto diventa usable
2. **Oggi/domani (30 min)**: Step 3 (Resend) → email per send/accept funzionano
3. **Entro settimana (30 min)**: Step 2 (Stripe) → monetizzazione attiva
4. **Quando vuoi**: Step 4 (dominio) → professional look

Buona giornata! 🚀
