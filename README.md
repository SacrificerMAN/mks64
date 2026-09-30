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

## Branding

Site name: **Saran Chess Academy**  
Coach: Mohit Kumar Soni (2520+)
