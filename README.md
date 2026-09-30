# MKS64 Chess Academy

Professional landing page for **MKS64** — Mohit Kumar Soni’s chess academy.

**Live repo:** [github.com/SacrificerMAN/mks64](https://github.com/SacrificerMAN/mks64)

## Local preview

```bash
npx serve .
# or open index.html in a browser
```

## Deploy on Railway (static site)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select **SacrificerMAN/mks64**
3. Railway will detect Node and run `npm start` (serves the static files via `serve`)
4. Add a public domain under **Settings → Networking → Generate Domain**

Optional: set service start command explicitly to:

```
npx --yes serve -s . -l tcp://0.0.0.0:$PORT
```

No build step required — pure static HTML + images.

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Full landing page |
| `founder.jpg` | Coach photo |
| `s1_1.jpg` … `s10_1.jpg` | Student / tournament gallery |
| `package.json` | Railway / Node static server |

Payments: Razorpay links (India ₹ / International $).  
Lead form posts to Google Apps Script endpoint.
