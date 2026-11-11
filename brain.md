# brain.md — Architecture & Design Decisions

> The "why" behind the build. Read this before making any structural/stack decision so we don't re-litigate settled choices. `structure.md` is WHAT we're building; this is HOW; `handoff.md` is the task tracker for the CURRENT state of the build.

## 1. Goal

Rebuild dial112.mppolice.gov.in as a modern SPA: **same pages, same content, same functionality** — significantly better UI polish and motion design. This is a portfolio/practice rebuild, not a government deployment — no real emergency dispatch, no data collection.

**Update (2026-07-27):** the weather page is no longer mock data. `backend/` is a small Python/FastAPI service (`backend/main.py`, `backend/weather_service.py`) that proxies Open-Meteo's free, no-API-key forecast + air-quality endpoints for the Bhopal station coordinates, reshapes the response to match the frontend's existing card layout, and caches it in-memory for `refreshIntervalMinutes`. The frontend (`src/hooks/useWeather.ts`, `src/lib/weatherApi.ts`) polls it. Run with `cd backend && ./.venv/bin/uvicorn main:app --port 8000` (venv + `pip install -r requirements.txt` already set up). Everything else (stats, stories, news, services, gallery) is still static/mock, shaped like the original.

## 2. Stack (locked in by user request — do not deviate)

- **React + Vite + TypeScript** — SPA, strict TS
- **Tailwind CSS** — utility-first styling, no separate CSS-in-JS lib
- **Framer Motion** — all animation/motion (page transitions, scroll reveals, count-ups, hover/tap states)
- **react-icons** — icon set (use `react-icons/fa6` / `lu` / `tb` as needed instead of loading Font Awesome/Tabler webfonts like the original did)
- **react-router-dom** — client-side routing (needed: home, about, services, stories(+detail), news(+detail), gallery, contact, weather)
- Charting for weather 24h trend: keep it lightweight — plain SVG/Framer Motion path animation, or `recharts` if a real chart library is wanted. Decide in handoff task, default to hand-rolled SVG to avoid an extra heavy dependency.
- No backend. No CMS. No auth. All content lives in typed data modules under `src/data/`.
- Package manager: npm (confirm with `package-lock.json` presence; switch only if user has a preference).

## 3. Why not replicate the original stack

Original site is static PHP + vanilla JS + Font Awesome/Tabler webfonts + Chart.js + hand-rolled IntersectionObserver fade classes (`.fade-left`, `.fade-top`, `.show`). We are explicitly upgrading the engineering, not the content — Framer Motion replaces the manual `.show`-class toggling, Tailwind replaces the hand-written `styles.css`, react-icons replaces the two competing icon webfont CDNs (the original loads BOTH Font Awesome 6.5.2 AND 6.5.1 AND Tabler icons — redundant, we ship one).

## 4. Design system (derived from original brand, refined)

Original CSS variables (`:root` in their `styles.css`):
```
--primary-color: #1e3a8acc   (navy blue, semi-transparent)
--secondary-color: #0056a3   (blue)
--accent-color: #ff6b00      (orange — call-to-action / alert)
--text-color: #333
--background-color: #f4f7fa
```
Plus dark navy tones used in hero/stats sections: `#0a1628`, `#0d1b3e`, `#0f1e36`, `#152442` family, and a red (`#dc2626`-ish) for emergency elements, green (`#22c55e`) for success/positive stats.

**Our palette** (keep the institutional navy/orange identity, make it richer, not "startup pastel"):
- `brand-navy` 900→50 scale, anchored near `#0a1628` / `#0d1b3e` (dark hero/section backgrounds)
- `brand-blue` anchored near `#1e3a8a` / `#0056a3` (primary actions, links)
- `brand-orange` `#ff6b00`-ish (secondary accent, sparing use — matches "orange accent from brochure" comment in original CSS)
- `emergency-red` for the DIAL 112 CTA specifically — must always be the most visually urgent element on any page
- `success-green` for positive stat deltas
- Neutral grays for body text/backgrounds, light mode primary (original site is light-mode with dark accent sections, not a dark-mode site — keep it that way, just tastefully deploy dark navy as *section* backgrounds like the original hero does)

**Typography** — original loads Outfit, Rajdhani, DM Sans, JetBrains Mono, Exo 2 (a lot). We consolidate:
- Display/headings: **Outfit** (already does the geometric-technical "gov-tech" look) or **Rajdhani** for the more angular "emergency services" numerals feel — pick ONE for headings.
- Body: **DM Sans** or **Inter** (Inter is a safer, more legible body choice at small sizes; DM Sans matches original closer)
- Numeric/stat display (call counts, weather figures): **JetBrains Mono** or a tabular-nums variant of the display font — stat counters read better in a mono/tabular face.
- Decide exact 2-font pairing in handoff setup task; don't import 5 font families like the original did — 2 is enough.

**Motion language** (this is where we materially beat the original):
- Scroll-triggered reveals via Framer Motion `whileInView` (replaces their manual `.fade-*` + `.show` class toggling) — stagger children in grids (services, leadership, stat cards)
- Animated count-up for all big numbers (impact stats, decade stats, about-page stats) — numbers should visibly tick up when scrolled into view, once, not on every re-render
- Hero: subtle parallax or gradient/particle motion behind the headline, not a static image
- Page transitions: fade/slide on route change (`AnimatePresence` wrapping `<Routes>`)
- Micro-interactions: button hover/tap scale, card hover lift, nav underline slide
- Respect `prefers-reduced-motion` — disable/simplify non-essential motion for accessibility (original site has zero accessibility consideration here — this is a real improvement, not scope creep)
- Emergency CTA button gets its own subtle persistent pulse/glow — it's the single most important element on a police emergency site, motion should reinforce that hierarchy

## 5. Information architecture decisions

- Detail pages use **path params** (`/stories/:id`, `/news/:id`) not the original's `?id=` query strings — cleaner with react-router.
- Stories/News lists: original has no visible pagination (just a very long page). We add **pagination or "load more"** — same content model, better UX, not scope creep (explicitly called out as acceptable in structure.md §11).
- Gallery: original is a single-column list with no lightbox. We upgrade to a **responsive grid + lightbox modal** — still "gallery" functionality, just not broken.
- Services page keeps the **live search/filter** behavior from the original (this is real functionality parity, not an enhancement) — filter by category tabs + text search, matching the original's "No services match your search" empty state copy.
- Weather page: mock data must LOOK live — implement a `setInterval` that jitters the numbers slightly every few minutes to simulate the original's "auto-refresh every 5 min," but do not fabricate a real IoT integration.
- Contact page stays a static info directory (no working form) — matches original exactly, don't invent a form/backend that doesn't exist in the source.

## 6. Data layer

All content in `src/data/*.ts` as typed exports (see structure.md §12 for the file list). Types live in `src/types/`. No fetch/loading states needed since everything is local static data — but structure the data modules as if they *could* later be swapped for API calls (plain exported arrays/objects, not hooks that fetch) so future-you could wire a real API without restructuring components. Don't build the API layer now — YAGNI, just don't paint into a corner.

## 7. Known original-site inconsistencies we resolve (documented, not silently "fixed")

- WhatsApp number differs between pages (7869700112 vs 7587600100) on the live site → we use **7869700112** everywhere (matches homepage + footer + contact page majority).
- Two competing icon webfont CDNs + inline SVGs on original → we use react-icons exclusively.
- 5 Google Font families loaded on original → we use 2.

## 8. File/folder conventions

```
src/
  components/       shared UI (Header, Footer, EmergencyButton, StatCard, MotionSection, etc.)
  components/ui/    small primitives (Button, Badge, Tabs, Modal/Lightbox)
  pages/            one file per route (Home, About, Services, Stories, StoryDetail, News, NewsDetail, Gallery, Contact, Weather)
  data/             static typed content (see structure.md §12)
  types/            shared TS types/interfaces
  hooks/            useCountUp, useInViewOnce, etc.
  lib/ or utils/    small helpers (formatNumber, date formatting)
  assets/           images/icons we source ourselves (see handoff — need placeholder/generated imagery, we are not scraping the gov't site's binary images)
App.tsx             router + layout shell
```

## 9. Assets note

We are **not** downloading/reusing the original site's actual photographs (leadership photos, incident photos, gallery images) — those are real people/real incident photos belonging to MP Police, not appropriate to scrape into a portfolio clone. Use tasteful placeholders instead: solid-color/gradient avatar placeholders or initials for leadership, and either royalty-free stock-style placeholder images, a placeholder image service, or simple generated SVG/gradient tiles for gallery/story/news imagery. Flag this clearly to the user before/while building the Gallery, Leadership, and Stories/News sections.

## 10. Non-goals (explicitly out of scope, per structure.md §11)

No auth, no real complaint filing/tracking, no file uploads, no payments, no CMS/admin, no PWA/offline requirement unless asked.

**Superseded (2026-07-27):** the two items originally listed here — "no real backend" and "no i18n framework (content stays mixed Hindi/English like the source)" — no longer hold. See §1 for the weather backend. For i18n: the user explicitly requested a 6-language switcher (English default, Hindi, Marathi, Gujarati, Urdu, Sindhi) plus a light/dark theme toggle, site-wide.

**i18n architecture:** no external i18n library — a small hand-rolled system since every string needs exactly 6 fixed locales and TypeScript can enforce completeness better than a JSON-key lookup would. Core files: `src/i18n/locales.ts` (`Locale` type, `LocalizedText = Record<Locale, string>`, RTL flags for ur/sd), `src/contexts/LanguageContext.tsx` (`useLanguage()`/`useT()`, persists to localStorage, sets `<html lang dir>`), `src/i18n/ui.ts` (shared chrome strings: nav, footer, Home/Weather page text). Translatable fields in `src/data/*.ts` were converted from `string` to `LocalizedText` (see `types/content.ts`); each data file defines a local `lt(en,hi,mr,gu,ur,sd)` helper. Plain-string unions used for filter/lookup logic (e.g. `ServiceCategory`, gallery `Tab`, weather `WeatherCondition`) stay English at the data layer — a separate `Record<Union, LocalizedText>` lookup (see `STATUS_LABELS` in `Weather.tsx`) supplies the translated display label without disturbing the logic. Urdu/Sindhi are RTL: `document.documentElement.dir` flips globally, but pixel-perfect logical-property RTL mirroring was NOT done throughout — treat that as a known follow-up, not a bug, if raised later.

**Theme architecture:** `src/contexts/ThemeContext.tsx` toggles a `.dark` class on `<html>` (persisted, defaults to OS `prefers-color-scheme`); Tailwind v4 is configured for class-based dark mode via `@custom-variant dark (&:where(.dark, .dark *));` in `index.css` (v4 defaults to media-query dark mode otherwise). Dark mode is implemented as additive `dark:` variants alongside existing light classes (not a semantic-token rewrite) — the mapping table used throughout is documented informally in the session that built it; the gist: `bg-white→dark:bg-navy-800/900`, `bg-navy-50→dark:bg-navy-900/40`, `border-navy-100→dark:border-navy-700`, `text-navy-900→dark:text-navy-50`, `text-navy-500/400→dark:text-navy-400/500`. Sections already on `bg-navy-900`/`bg-navy-800` (heroes, footer) are theme-invariant by design and were left alone.

Decorative `<RadarSweepPattern />`/`<SignalWavesPattern />`/`<DotGridPattern />` SVG backgrounds live in `src/components/SvgBackground.tsx`, used inside hero sections for visual texture.
