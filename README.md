# Saran Chess Academy

Professional landing page for **Saran Chess Academy** — Mohit Kumar Soni’s chess coaching academy.

**Repo:** [github.com/SacrificerMAN/mks64](https://github.com/SacrificerMAN/mks64)

## Local preview

```bash
export GEMINI_API_KEY=your_key
node server.js
```

## Deploy on Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select **SacrificerMAN/mks64**
3. Railway uses `package.json` → `npm start` → `node server.js`
4. **Settings → Networking → Generate Domain**
5. **Variables** → add `GEMINI_API_KEY` from https://aistudio.google.com/apikey
6. Optional: `GEMINI_MODEL=gemini-3.1-flash-lite`

## Coach chat

Bottom-right widget uses Gemini 3.1 Flash-Lite as an academy mentor (GM-style teaching, not a fake FIDE title).

## Department agents

The website chat now routes each conversation to a focused department agent (admissions, academic, parent support, operations, finance, marketing, analytics, or the CEO/orchestrator). Leads saved from chat include the selected agent and channel so the CRM/Google Sheet can be assigned to the right team.

Twilio WhatsApp can call `POST /api/whatsapp/webhook` with `application/x-www-form-urlencoded` data. Set `TWILIO_AUTH_TOKEN` in production and point the WhatsApp sender webhook to the deployed URL. Set `REQUIRE_TWILIO_SIGNATURE=true` to require signature verification when the token is present. The webhook returns TwiML replies and routes lead-intent messages to the same CRM endpoint.

The agents are intentionally approval-based: they do not publish ads, spend money, issue refunds, confirm payments, or make hiring decisions automatically.

## Branding

Site name: **Saran Chess Academy**  
Coach: Mohit Kumar Soni (2520+)
