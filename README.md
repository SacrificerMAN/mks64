# MKS64 Chess Academy

Professional landing page for **MKS64** — Mohit Kumar Soni’s chess academy.

**Repo:** [github.com/SacrificerMAN/mks64](https://github.com/SacrificerMAN/mks64)

## Local preview

```bash
npx serve .
```

## Deploy on Railway

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select **SacrificerMAN/mks64**
3. Railway uses `package.json` → `npm start` (static file server)
4. **Settings → Networking → Generate Domain**

Start command (if needed):

```
npx --yes serve -s . -l tcp://0.0.0.0:$PORT
```

No build step — pure static HTML + images.

## Features

- Premium dark theme (Fraunces + Inter)
- Chessboard hero background
- Coach / Programs / Results / Pricing / FAQ
- India ₹ + International $ Razorpay links
- Lead form → Google Apps Script
- Mobile navigation drawer
- SEO / Open Graph tags

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Full landing page |
| `founder.jpg` | Coach photo |
| `s1_1.jpg` … `s10_1.jpg` | Student gallery |
| `package.json` | Node static server for Railway |
| `railway.toml` | Railway deploy config |
