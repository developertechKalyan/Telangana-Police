# handoff.md — Task Tracker

> Read this file first every session. It describes the CURRENT state of the build.
> `brain.md` explains how it is built; `structure.md` is the original MP Dial 112 site audit we started from.

## What this project is

The public website for **Telangana Police Dial 112 (TG ERSS)**. It began as a rebuild of the Madhya Pradesh
Dial 112 site (dial112.mppolice.gov.in), then was moved to Telangana: content, contacts, leadership, photos and
the Hyderabad weather station are all Telangana's. The content brief from the department is
`TG_ERSS_Dial112_Website_Content_Ideas_v1-0.docx`. All final text, figures and images need TGiCCC approval.

## Current state (2026-11-13)

Built and working:
- [x] React 19 + Vite + TypeScript + Tailwind v4 + Framer Motion front end, `npm run build` passes
- [x] 12 public pages: Home, About, Services, When to Call, What Happens, Find You, Citizen Resources,
      Reach Us, Gallery, Contact, Weather, plus Login / Forgot Password / Admin Gallery (logged-in only)
- [x] Languages: English, Hindi, Telugu selectable (Gujarati/Urdu/Sindhi strings exist but are hidden)
- [x] Light/dark theme toggle
- [x] Node/Express API in `backend/` — admin login, OTP password reset (Brevo email), gallery upload (Cloudinary, MongoDB)
- [x] Live weather (Open-Meteo, TGiCCC station) served by the same Node API at `/api/weather`
- [x] Pages are code-split (each page loads on demand); fonts load per selected language

Open items:
- [ ] **Official public email for Dial 112** — set `email` in `src/data/contact.ts` once TGiCCC confirms it.
      Until then every email link on the site is hidden (it used to point at an invalid address).
- [ ] Verify the 040-112 "calling from outside Telangana" number with the department
- [ ] **Deploy the API** somewhere (Netlify only hosts the website) and set `VITE_API_URL` in Netlify — see README → Deploy
- [ ] **Before going live:** set a fresh `JWT_SECRET` on the server (`openssl rand -hex 48`), `NODE_ENV=production`,
      `CLIENT_URL` = the website's address, `TRUST_PROXY=1` if behind a proxy, and real Brevo SMTP credentials
      (without them, password reset emails can't be sent in production). Run `npm run seed:admin` once, then
      remove `ADMIN_PASSWORD` from the server's `.env`.
- [ ] Gallery photo captions IMG_5202/5204/5208/5213/5215/5218 are unverified placeholders (see log 2026-07-31)
- [ ] Mobile/tablet visual check of every page, Lighthouse pass

## Session log
- 2026-07-24 — Completed Phase 0 (site audit + all 3 planning docs). Next: Phase 1 scaffold.
- 2026-07-27 — Weather page redesigned + wired to a real Python/FastAPI backend (Open-Meteo, no API key) instead of mock data — see `brain.md` §1. Then a site-wide 6-language switcher (en/hi/mr/gu/ur/sd) + light/dark theme toggle was added across every page, superseding the old "no i18n framework"/"no real backend" non-goals — see `brain.md` §10 for the architecture. Home, Weather, Header, Footer, EmergencyButton, NewsList/NewsDetail (+ Stories/News/detail wrapper pages), and all shared data files (`stats`, `leadership`, `fleet`, `contact`, `stories`, `news`, `nav`) were converted directly; About/Services(+services.ts)/Gallery(+gallery.ts)+Contact were converted via parallel background agents following the same pattern. If a future session finds any of those three still mid-conversion or reverted, re-run the same conversion (see the `LocalizedText`/`useT()` pattern in `Home.tsx` and `Weather.tsx`, and the `dark:` class mapping table in `brain.md` §10).
- 2026-07-31 — Two targeted edits to `Home.tsx`'s hero section (2nd `<section>` on `/`):
  - **Impact stats grid** (`impactStats.map`, hero right column): removed the decorative bottom-left blurred blob (`-bottom-40 -left-20 ... bg-accent-500/20`) — only the top-right one remains. Added a `flipItem` `Variants` const (rotateY -100→0) applied via `motion.div` + `style={{ transformPerspective: 800 }}` so the 4 cards flip in on scroll instead of the shared `staggerItem` fade/slide. `StatCard` (`components/ui/StatCard.tsx`) icon slot changed from bare colored glyph to a solid `bg-brand-600` rounded-xl badge — this affects every `StatCard` caller (Home impact stats has icons; About's `aboutStats` usage has no `icon` prop so unaffected).
  - **Weather preview section**: replaced the old single-row summary card with a new `WeatherPreview` component (defined in `Home.tsx`, above `export function Home()`) styled like the full `/weather` page's hero block — header row (icon badge, title/kicker, live pulse badge using `ui.home.liveWeatherCta` text, live-ticking clock date), 3-column body (temp+condition w/ `DotGridPattern` texture, radar-ring/clock block reusing the `WEATHER_CONDITION_ICONS` map + `LuArrowUp`/`LuArrowDown` high/low, and a `WeatherMiniStat` stack for humidity/wind with an animated progress bar), footer bar with a `t(ui.common.viewAll)` CTA to `/weather`. Note: `WEATHER_CONDITION_ICONS` here is a Home-local duplicate of the map in `Weather.tsx`'s `CONDITION_ICONS` — if `WeatherCondition` variants ever change, update both.
  - No new i18n keys added (reused `ui.home.*` / `ui.weather.*` / `ui.common.viewAll`); the footer bar's location line composes `ui.home.weatherKicker` + `stationInfo.location` rather than hardcoding new copy.
  - Verified with `npx tsc --noEmit` (clean) and `npm run dev`; did not get a browser screenshot this session (no `chromium-cli` / `playwright` available in the sandbox, and installing was declined) — a human should eyeball `/` before shipping.
- 2026-07-31 (cont.) — Three more `Home.tsx` edits, same session:
  - **Leadership section**: added `mpPoliceLogo` (`@/assets/logo.png`) above the section title. Cards are now a `LeaderCard` flip component (hover or tap to flip) — default face is leader photo (70% height) over name/title (30%), back face is a full-bleed photo. Required adding `image: string` to `LeaderProfile` (`types/content.ts`) and wiring `leader1.png`/`leader2.jpg`/`leader3.png` into `data/leadership.ts` (order matches the `leadership` array: Yadav→leader1, Makwana→leader2, Katiyar→leader3).
  - **Fleet & Infrastructure cards**: added `whileHover={{ y: -6, scale: 1.02 }}` lift + accent border/glow + icon nudge-and-scale-on-hover (Tailwind `group`/`group-hover`), matching the hover pattern already in `Services.tsx`.
  - **Decade of Service section**: reworked from a flat 4-up grid into a 3-column layout (`lg:grid-cols-[1fr_auto_1fr]`) — 2 `DecadeStatBlock` cards left (Total Calls, Actionable Calls), 2 right (Senior Citizens, Events), and a new centered `ShortsVideoCard` (vertical 9:16 video-chrome mockup: channel row, mute/CC/settings icons, center replay button, caption pill + expand icon + progress bar). `DecadeStatBlock` itself was restyled to match the reference screenshot — the big total number moved into a small pill badge next to a `LuPhoneCall` icon, and the 3 metrics (this month/last 24h/updated) became individual chip boxes instead of plain text columns.
  - **`ShortsVideoCard` expects a real file at `public/videos/decade-short.mp4`** (the `public/videos/` dir already existed, empty) — user said they'll drop the actual short video in manually; until then the `<video>` tag just renders black behind the chrome overlay, which still reads fine as a mockup. If asked to wire a different filename/path, that's the one line to change.
- 2026-07-31 (cont.) — `ShortsVideoCard` later swapped from the local-file placeholder to a real embedded YouTube iframe (`https://www.youtube.com/embed/k3odY8sBLX0`, the official DIAL112 MP Shorts clip) — the fake chrome overlay (mute/CC/settings/replay/progress) was removed since YouTube's real player already provides that. The `public/videos/decade-short.mp4` placeholder note above is now stale/moot for that component; the empty `public/videos/` dir is unused unless repurposed elsewhere.
- 2026-07-31 (cont.) — Home.tsx "Stay Connected" section rebuilt: 4 `SocialPreviewCard`s (Facebook/Instagram/X/YouTube) replacing the old icon-circle row, each with brand-colored CTA button. Deliberately does NOT show fabricated follower counts/post captions (unlike a reference screenshot the user shared that had real-looking numbers) — those aren't values this session can verify, so the cards link out to the real profiles instead. `data/nav.ts` `socialLinks` hrefs updated to the user-supplied real URLs (stripped `?ref=embed_page` / `?ig_rid=...` tracking params down to canonical profile URLs).
- 2026-07-31 (cont.) — Footer.tsx rebuilt to match a reference screenshot: real logo image instead of a "112" badge, `EmergencyButton` reused, Quick Links/Emergency columns got `›` bullets, Contact Info column rebuilt as icon-boxed rows (added 2 new i18n keys: `ui.footer.address`, `ui.footer.availability`, all 6 languages). Then a shared `components/ui/HoverUnderline.tsx` was extracted (grows an accent underline under text on `group-hover`) and wired into both Footer's Quick Links/Emergency numbers AND Header's top-bar phone link + desktop nav (inactive links only — the active nav item keeps its own persistent `layoutId="nav-underline"` framer-motion indicator, unchanged). Header's `TopBar` also now collapses (`max-height`/`opacity` transition) once `scrolled` (same >12px threshold already used for the header background swap) and reappears at the top.
- 2026-07-31 (cont.) — Gallery.tsx hero + grid wired to real assets instead of `PlaceholderImage` gradients (the old approach was deliberate per the comment in `data/gallery.ts` — "no real MP Police photographs... not appropriate to scrape" — but the user has since supplied their own real photos/video, so that constraint no longer applies here). `GalleryItem` (`types/content.ts`) got a new `src: string` field. `data/gallery.ts` now imports 19 real photos + 1 video from `src/assets/gallery/` (renamed `assets/banner/gallery.JPG` → `gallery.jpg` — Vite/TS asset module declarations are case-sensitive on the extension, `*.JPG` uppercase has no matching `declare module`). Hero background is that same `assets/banner/gallery.jpg` (aerial fleet-rows photo) with a dark gradient + "VISUAL ARCHIVE" kicker pill + `EmergencyButton`, matching a reference screenshot. Grid thumbs render `<img>`/`<video muted preload="metadata">` directly (video shows a play-icon overlay); lightbox plays video with `controls autoPlay`. **Caption accuracy caveat**: only ~7 of the 20 photos were actually opened and visually verified (drone-tech-centre cluster IMG_5108/5109, felicitation cluster IMG_5159, briefing IMG_5196, launch-event g1/g3/g4/g5) — captions for IMG_5202/5204/5208/5213/5215/5218 are plausible-but-unverified placeholders following the same "internal briefing/meeting" theme as their neighbors in the shoot. Flagged to the user; re-verify against the actual photos before treating those captions as fact.
- 2026-11-13 — Code review + first fixes (content, performance, tidiness; security not yet touched).
  - Content: Fire quick-dial was `102` (that is ambulance) → `101`. Contact email was `112.tspolice.gov.in`
    (not an address) → emptied, and all email rows/links are hidden until the official address is set.
    "All States" → "all 33 districts (of Telangana)" in the footer availability line and 6 other sentences
    (top-bar notice, fleet, gallery intro, Services hero + CTA, Contact hero), each in all 6 languages.
    Leftover MP text removed from login/reset placeholders, the OTP email, the server banner/health check,
    seed-admin defaults and `.env.example`. The `mppolice` MongoDB name and localStorage keys were kept on purpose
    (renaming would orphan existing data / log people out). `backend/.env` itself was not changed.
  - Performance: hero video 37 MB → 22 MB (720p, computers) / 15 MB (540p, phones under 768 px), re-encoded with
    macOS `avconvert` — ffmpeg was not available; a proper CRF encode would get it to roughly 5 MB.
    Oversized photos resized to max 1920 px (src/assets 91.6 MB → about 55 MB); logos to 384 px; `leader3.jpeg` was
    a PNG with a .jpeg name → real JPEG (1.29 MB → 177 KB); `patrol_call.gif` 2.7 MB → animated `patrol_call.webp`
    1.1 MB. Pages other than Home are lazy-loaded (main JS 1,013 KB → 471 KB). Script fonts (Devanagari, Telugu,
    etc.) now load only when that language is chosen (`LanguageContext.tsx` → `loadScriptFont`).
  - Tidiness: favicon now `public/favicon.png` (old path pointed into `src/`, broken after build); `.gitignore`
    fixed (docs were listed as ignored, video rule was wrong, Python caches added); tracked `.DS_Store`, `.pyc`
    and the unrelated `indo.py` removed; README rewritten; providers split into `*Provider.tsx` files and
    `staggerItem` moved to `components/motionVariants.ts` (fast-refresh lint rule); AdminGallery effect deps and
    Home carousel listener cleanup fixed. `oxlint` now reports 0 warnings.
  - Verified: `npm run build`, `oxlint`, backend `tsc --noEmit` all clean; headless Chrome check of Home, Contact,
    Login, Telugu switch and phone width — correct video per screen size, tel:101 present, no tel:102, no mailto,
    no "All States"/MP text, Telugu font loads on demand, no console errors.
- 2026-11-13 — Security fixes (all review items 1–4 and 13–18).
  - Login tokens: no hard-coded JWT secret any more; the server refuses to start if `JWT_SECRET` is missing,
    shorter than 32 chars or the old published value (`config/security.ts`). Tokens are pinned to HS256 and
    stop working when the password changes (`passwordChangedAt`).
  - Admin password: no default. `seed:admin` needs a 12+ char password (upper/lower/number, not the published
    one), never prints it, and only changes an existing admin's password with `--reset-password`.
  - Reset codes: stored as SHA-256 hashes; voided after 5 wrong guesses; verify/reset limited to 20 per 15 min
    per IP; forgot-password gives the same reply for every email; code no longer in the email subject; in
    production it is never written to the logs. New-password rule (12+, mixed case, number) matched on the
    Forgot Password page.
  - `backend/.env` removed from git and ignored. Git history only ever held the published example values,
    which the server now rejects, so history was not rewritten. Local `.env` got a new random JWT secret and
    admin password (TG admin email).
  - Uploads: JPEG/PNG/WEBP/GIF only (no SVG), checked by file content, not the browser's label; Admin Gallery
    file pickers match. Only admin/superadmin can delete (server 403 for officers; delete buttons hidden).
  - Input: request strings validated (no `{"$ne": ...}` objects), Mongoose `sanitizeFilter` on, gallery query
    values allow-listed, bad ids give 404. Error replies no longer expose internal messages in production.
  - CORS: only `CLIENT_URL` (comma-separated) plus localhost in development; `trust proxy` via `TRUST_PROXY`.
    JSON body limit 5 MB → 100 KB.
  - Packages: `npm audit` 0 vulnerabilities on both halves (express 4.22.3, nodemailer 6 → 10, others patched).
  - Verified against a throwaway MongoDB: 27/27 attack-style checks passed (forged token, operator injection,
    account probing, code brute force, token after reset, SVG / disguised uploads, officer delete, CORS,
    rate limit), plus hashed code in the database and no code in production logs.
- 2026-11-13 — Production bugs fixed.
  - Reloads / shared links no longer jump to Home: the intro no longer calls `navigate("/")`. It plays once per
    browser visit (`sessionStorage` key `dial112-intro-seen`) and is skipped for prefers-reduced-motion.
  - Netlify: one API base (`src/lib/apiBase.ts`, `VITE_API_URL`) for login, gallery and weather;
    `VITE_WEATHER_API_URL` is gone. `fetchGalleryItems` no longer uses `new URL()` (crashed on relative bases).
    API calls give a readable "not available" error instead of a JSON parse crash when the server is missing
    or answers with HTML. `public/_redirects` returns a JSON 404 for `/api/*` before the SPA fallback (and shows
    how to proxy instead). `netlify.toml` duplicate redirect removed; Node 22 for Vite 8.
  - Port clash: the Python weather service was ported into Node (`backend/src/services/weather.ts`) and the
    fake hard-coded `/api/weather` route replaced, so there is one server on one port. Python files removed
    (still in git history). The port also fixes a Python bug: `current.time` is in 15-minute steps, so the
    exact match against whole-hour slots failed and the "recent readings" strip / rain chance used 23:00.
  - Also fixed (found by the end-to-end test once login worked): `Login.tsx` called `navigate()` during render
    when already logged in, an endless update loop (React error #185) right after a successful login. Now
    redirects with `<Navigate>`.
  - Verified in headless Chrome against a real API + MongoDB: 15/15 — deep link and reload stay on the page,
    intro plays once per visit and not for reduced motion, live weather, uploaded gallery photo, login → admin
    gallery, no script errors; and with no API configured: clear "not available" messages, built-in gallery
    photos still shown, no script errors. (`public/_redirects` itself can only be tested on Netlify.)
