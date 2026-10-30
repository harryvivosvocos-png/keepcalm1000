# Keep Calm – Days to Go

A "Keep Calm" poster counting down the days, in UK time, until **21 July 2029**. That is 1,000 days after the Defence Secretary's op-ed of 25 Oct 2026. Satire.

- `index.html`: the poster page (static, inline CSS/JS, no trackers)
- `lib/countdown.js`: **`TARGET` date (the one config constant)**, `SITE_URL`, tagline list and the London-time day count. Shared by the page and the OG function.
- `lib/crown.js`: the crown geometry, shared by the page, the canvas poster and the OG image. `favicon.svg` and `apple-touch-icon.png` are static copies of it.
- `api/og.js`: Vercel edge function. `GET /api/og` returns a 1200×630 PNG with today's count. The CDN caches it for at most 1 h and never past UK midnight.
- `fonts/Oswald-Bold.ttf`: Oswald 700 (SIL Open Font License), from Google Fonts

## Develop

```bash
npm install
npm test          # day-count tests, run under UTC, Los Angeles and Kiritimati timezones
npx vercel dev    # http://localhost:3000 and http://localhost:3000/api/og
```

## Deploy

### Vercel CLI
```bash
npx vercel login
npx vercel          # Framework preset "Other", no build command, output directory "."
npx vercel --prod
```

### GitHub import
Push to GitHub, then go to vercel.com → Add New → Project → import the repo → Framework Preset **Other** → Deploy.

### Domain
In the Vercel dashboard, go to Project → Settings → Domains → add `keepcalm1000.co.uk`, and add `www.keepcalm1000.co.uk` redirecting to it. At your registrar, set the DNS records Vercel shows (an A record for the apex, a CNAME for www).

If you change the domain, update `SITE_URL` in `lib/countdown.js` and the absolute URLs in the `<head>` of `index.html` (canonical, og:url, og:image, twitter:image).

## Notes
- **Link previews:** the Share button shares `https://keepcalm1000.co.uk/?d=YYYY-MM-DD`. Each day's link is a new URL, so X, WhatsApp and Discord re-fetch the preview instead of reusing a cached one.
- **iOS:** "Save poster" puts the PNG in Files/Downloads. To save it to Photos, use Share → Save Image.
