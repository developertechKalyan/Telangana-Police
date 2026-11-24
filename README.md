# Telangana Police Dial 112 — Website

Public website for Telangana's Dial 112 Emergency Response Support System (TG ERSS): what 112 is, how to
reach it, when to call, what happens after a call, plus a gallery, weather station and an admin area for
gallery uploads. Content direction comes from `TG_ERSS_Dial112_Website_Content_Ideas_v1-0.docx`; all final
text, figures and images need TGiCCC approval.

Start with **`handoff.md`** (current state and open items). `brain.md` explains the design and code decisions;
`structure.md` is the audit of the original MP Dial 112 site the project began from.

## What's in here

| Part | Path | Stack |
|---|---|---|
| Website | `src/` | React 19, Vite, TypeScript, Tailwind CSS v4, Framer Motion |
| API (admin login, password reset, gallery, live weather) | `backend/src/` | Node, Express, MongoDB, Cloudinary, Brevo SMTP, Open-Meteo |

## Run it locally

```bash
# Website — http://localhost:5173
npm install
npm run dev

# API — reads backend/.env (copy backend/.env.example first)
cd backend
npm install
npm run dev             # http://localhost:8000
npm run seed:admin      # creates the admin from ADMIN_* in .env (add `-- --reset-password` to change it)
```

One server, one port: the Node API also serves live weather at `/api/weather` (the old separate Python
weather service was merged into it; see `backend/src/services/weather.ts`).

Required in `backend/.env`: `JWT_SECRET` (generate with `openssl rand -hex 48`; the server won't start
without a strong one). In production also set `NODE_ENV=production`, `CLIENT_URL` (the website's origin) and
`TRUST_PROXY=1` when running behind a proxy. Never commit `.env`.

## Checks

```bash
npm run build   # type-check + production build
npm run lint    # oxlint
cd backend && npx tsc --noEmit
```

## Editing content

- Phone numbers, address, email, availability: `src/data/contact.ts`
  (the public email is empty until the department confirms it; email links stay hidden while it is empty)
- Navigation, emergency number, social links: `src/data/nav.ts`
- Shared interface text in every language: `src/i18n/ui.ts`
- Languages offered in the switcher: `SELECTABLE_LOCALES` in `src/i18n/locales.ts`

## Deploy

Two pieces, hosted separately:

1. **API** (`backend/`) on any Node host (Render, Railway, a VPS, ...): `npm ci && npm start`, with MongoDB
   and the `.env` values above. Set `CLIENT_URL` to the website's address, e.g. `https://your-site.netlify.app`.
2. **Website** on Netlify (`netlify.toml`): in Site settings → Environment variables set
   `VITE_API_URL=https://YOUR-API-HOST/api`, then trigger a new deploy (the value is baked in at build time).

Without `VITE_API_URL` the website still works (pages, static gallery photos, phone numbers), but login,
uploaded gallery photos and live weather show a "not available" message. `public/_redirects` makes sure
`/api/...` on the Netlify domain never returns the web page; it also explains how to proxy `/api` through
the Netlify domain instead of setting `VITE_API_URL`.
