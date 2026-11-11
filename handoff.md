# handoff.md — Task Tracker

> Working checklist for the build. **Read this file first every session** — only open `structure.md` / `brain.md` when you need the content spec or a design/architecture decision, not by default. Check off tasks as `[x]` when done, add new tasks under the right phase if scope is discovered, keep notes short under each task if a decision was made while doing it.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Research & Planning
- [x] Crawl and document all pages/sections/content from dial112.mppolice.gov.in → `structure.md`
- [x] Extract design tokens (colors, fonts, CSS structure) from live site → informed `brain.md`
- [x] Write `brain.md` (stack, design system, IA decisions)
- [x] Write `handoff.md` (this file)

## Phase 1 — Project Scaffold
- [ ] `npm create vite@latest . -- --template react-ts` in project root
- [ ] Install deps: `tailwindcss` (+postcss/autoprefixer or Tailwind v4 vite plugin), `framer-motion`, `react-icons`, `react-router-dom`
- [ ] Configure Tailwind (content globs, theme extension with brand colors from `brain.md` §4)
- [ ] Set up 2 Google Fonts chosen in `brain.md` §4 via `index.html` link tags or `@fontsource` packages
- [ ] Base folder structure per `brain.md` §8 (`components/`, `pages/`, `data/`, `types/`, `hooks/`, `utils/`, `assets/`)
- [ ] `react-router-dom` route table wired in `App.tsx` for all 10 routes from `structure.md` §1
- [ ] Global layout shell: `<Header />` + `<Outlet />`/children + `<Footer />`
- [ ] ESLint/Prettier sanity check, confirm `npm run dev` boots clean

## Phase 2 — Design System & Shared Components
- [ ] Tailwind theme: color scale, font families, spacing/radius tokens per `brain.md` §4
- [ ] `EmergencyButton` component (persistent, pulsing/glowing, `tel:112`) — used in header, mobile nav, hero, footer
- [ ] `Header` — logo, nav links, active-route styling, sticky/scroll behavior, mobile hamburger + slide-in nav (Framer Motion)
- [ ] `Footer` — per `structure.md` §2
- [ ] `MotionSection` / scroll-reveal wrapper (Framer Motion `whileInView`, respects `prefers-reduced-motion`)
- [ ] `useCountUp` hook for animated stat numbers
- [ ] `StatCard`, `Badge`, `Button`, `Tabs`, `Modal`/Lightbox primitives in `components/ui/`
- [ ] Decide + implement placeholder image strategy (see `brain.md` §9 — no scraping real MP Police photos)

## Phase 3 — Data Layer
- [ ] `data/nav.ts`, `data/footer.ts`, `data/contact.ts`
- [ ] `data/stats.ts` (homepage impact stats, decade stats, daily call stats — `structure.md` §3.2/§3.6/§3.7)
- [ ] `data/leadership.ts` (3 profiles — `structure.md` §3.4)
- [ ] `data/fleet.ts` (4 infra cards — `structure.md` §3.5)
- [ ] `data/services.ts` (21 services / 4 categories, full copy — `structure.md` §5)
- [ ] `data/stories.ts` (seed w/ 6 real captured entries + generated filler for pagination — `structure.md` §6)
- [ ] `data/news.ts` (seed w/ 6 real + 1 detail example + filler — `structure.md` §7)
- [ ] `data/gallery.ts` (image manifest w/ placeholder sources — `structure.md` §8)
- [ ] `data/weather.ts` (current + 24h trend + 7-day history — `structure.md` §10)
- [ ] `types/` interfaces for all of the above

## Phase 4 — Pages
- [ ] **Home** `/` — hero, impact stats, weather preview, leadership, fleet, decade impact, daily stats, gallery preview, stories preview, news preview, stay-connected (`structure.md` §3)
- [ ] **About** `/about` — hero+stats, landmark achievements, glorious evolution narrative, our promise (5 pillars), lasting legacy, detailed history w/ integrated helplines list (`structure.md` §4)
- [ ] **Services** `/services` — hero+stats, search/filter bar, 21 cards in 4 category groups, empty state (`structure.md` §5)
- [ ] **Stories** `/stories` — list + pagination/load-more (`structure.md` §6)
- [ ] **Story Detail** `/stories/:id` — breadcrumb, headline, date/source, body, image, share buttons, back link
- [ ] **News** `/news` — list + pagination/load-more (`structure.md` §7)
- [ ] **News Detail** `/news/:id` — same shape as Story Detail
- [ ] **Gallery** `/gallery` — All/Photos/Videos tabs, responsive grid, lightbox modal (`structure.md` §8)
- [ ] **Contact** `/contact` — static info directory, no form (`structure.md` §9)
- [ ] **Weather** `/weather` — current conditions, extra metrics row, 24h trend chart, 7-day history, simulated auto-refresh (`structure.md` §10)

## Phase 5 — Motion & Polish Pass
- [ ] Route transitions (`AnimatePresence` in router outlet)
- [ ] Stagger animations on all grids (services, leadership, fleet, gallery)
- [ ] Count-up on every stat number, homepage + about + services
- [ ] Hero motion treatment (parallax/gradient motion, not static)
- [ ] Emergency CTA pulse/glow micro-interaction
- [ ] Hover/tap states on all interactive cards/buttons
- [ ] `prefers-reduced-motion` handled globally

## Phase 6 — QA
- [ ] All internal links/routes verified (no dead links)
- [ ] `tel:112` and WhatsApp links functional (standardized number, `brain.md` §7)
- [ ] Responsive check: mobile / tablet / desktop for every page
- [ ] Lighthouse pass (perf/accessibility) — motion doesn't tank perf, images sized/lazy-loaded
- [ ] Cross-check every page's content against `structure.md` for parity (nothing missing, nothing invented beyond noted improvements)
- [ ] `npm run build` succeeds, preview build looks correct

---

## Open decisions / questions for user (resolve when reached, don't block earlier phases)
- [ ] Exact 2-font pairing (brain.md §4 narrows to a shortlist, needs final pick)
- [ ] Chart approach for weather 24h trend: hand-rolled SVG vs. `recharts` dependency (brain.md §2)
- [ ] Placeholder image approach for leadership/gallery/story photos: gradient+initials vs. placeholder image service vs. user-supplied images (brain.md §9) — **do not scrape real MP Police photos**
- [ ] Pagination vs. "load more" pattern for Stories/News lists

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
