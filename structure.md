# structure.md — Site Audit: dial112.mppolice.gov.in

> Source of truth for WHAT we are rebuilding. This is a content/structure/functionality inventory of the live government site, captured 2026-07-24. Do not re-crawl the live site unless a gap is found here — extend this file instead.

Original stack (reference only, we are NOT reusing this): static PHP pages (`index.php`, `about.php`, `services.php`, `story.php`, `dialnews.php`, `Gallery.php`, `contact.php`, `weather.php`, detail pages `news_details.php?id=`, `dialnews_details.php?id=`), custom `styles.css`, Font Awesome + Tabler icon webfonts, Google Fonts (Outfit, Rajdhani, DM Sans, JetBrains Mono, Exo 2), Chart.js for the weather graph, Google Analytics (gtag).

---

## 1. Sitemap / Pages

| # | Original file | Purpose | Our route |
|---|---|---|---|
| 1 | `index.php` | Homepage — hero, stats, weather widget, leadership, fleet, 10-yr impact, daily call stats, gallery preview, stories preview, news preview, social | `/` |
| 2 | `about.php` | "About Dial 112" — history, milestones, evolution story, vision, commitments | `/about` |
| 3 | `services.php` | 21 services across 4 categories, with search/filter | `/services` |
| 4 | `story.php` | Long list of "success story" incidents (rescues, reunifications) | `/stories` |
| 5 | `dialnews.php` | Long list of news incidents (accidents, response actions) | `/news` |
| 6 | `news_details.php?id=` | Individual story detail | `/stories/:id` |
| 7 | `dialnews_details.php?id=` | Individual news detail | `/news/:id` |
| 8 | `Gallery.php` | Photo/video gallery, "All Media / Photos / Videos" tabs | `/gallery` |
| 9 | `contact.php` | Contact info directory (no form) — HQ, command center, phone, email | `/contact` |
| 10 | `weather.php` | Live environmental monitoring dashboard (single station) | `/weather` |

Global chrome on every page: sticky header w/ nav + emergency CTA, mobile hamburger nav, footer.

---

## 2. Global Chrome

### Header
- Logo (MP Police shield/emblem) + wordmark, links to `/`
- Primary nav: Home · Dial112 (About) · Services · Story · News · Gallery · Contact · Weather
- Persistent "EMERGENCY: DIAL 112" button, `tel:112`, styled distinctly (red/orange, always visible)
- Mobile: hamburger icon → slide-in/overlay nav (`mobile-nav`, `mobile-nav-content`, `mobile-nav-link`) with its own emergency button (`mobile-emergency-btn`)
- (CSS has an unused `.language-btn` class — no working language switcher exists on the live site currently. Optional nice-to-have for us, not required for parity.)

### Footer
- Logo + description: "Professional emergency response services ensuring safety and security across Madhya Pradesh with commitment to 'Speed & Determination'."
- Quick Links: Home, About Dial 112, Services, Story, Contact
- Emergency block: Police 112 (tel:112), Universal 112 (tel:112), WhatsApp 7869700112 (wa.me link)
- Contact block: "MP Police Headquarters, Bhopal, Madhya Pradesh, India" · "24 × 7 — All 55 Districts"
- Social icons: Instagram, Facebook, X/Twitter, YouTube
- Bottom bar: "© 2026 Madhya Pradesh Police. All rights reserved." · "Government of Madhya Pradesh"

### Social handles (footer/header, consistent across site)
- Instagram: @dial112mp
- Facebook: @Dial112MP
- X/Twitter: @Dial112MP
- YouTube: DIAL100MP
- WhatsApp: 7869700112 (also seen as 7587600100 on some pages — live site is inconsistent; **we standardize on 7869700112**, flag in brain.md)

---

## 3. Homepage (`/`) — section by section

1. **Hero**
   - Eyebrow: "MP Police Emergency Response"
   - H1: "MP Police Dial 112 — Emergency Response"
   - Sub: "Professional emergency services for Madhya Pradesh — rapid response, community safety, and 24/7 support across all 55 districts."
   - Primary CTA button: "EMERGENCY: DIAL 112" → `tel:112`
   - Background: full-bleed image/video treatment (`.hero-bg`) behind text

2. **Impact Statistics strip** (animated counters)
   - 270,517 — Women's Safety Responses
   - 133,252 — Road Accident Rescues
   - 3,953 — Missing Children Traced
   - 27,860 — Suicide/Depression Interventions

3. **Weather widget (preview)** — "Weather Data" / "Environmental Monitoring Station"
   - Device WMS10042226, live temp 24.2°C Cloudy, feels-like 23°C, rain 43%, high/low 24°/24°, humidity 85.8%, wind 1.2 km/h
   - CTA: "Live Weather Data" → `/weather`

4. **Leadership** — "Our Leadership"
   - Sub: "Guided by visionary leaders committed to safety, justice and rapid emergency response across Madhya Pradesh."
   - 3 cards: Dr. Mohan Yadav (Hon'ble Chief Minister, M.P.), Shri Kailash Makwana (DGP, MP), Shri Adarsh Katiyar (SDG - Telecom) — photo, name, title

5. **Fleet & Infrastructure** — "Powered for Every Emergency"
   - "State-of-the-art infrastructure deployed across all 55 districts."
   - 4 stat cards: 1,200 First Response Vehicles · 150 First Response Bikes · 160-Seater Call Center · Advanced Technology (AI-enabled 24×7) — each with description line

6. **A Decade of Service** — 10-year impact, 4 metric blocks each with Total / This-month / Last-24h / Updated-date:
   - Total Calls Received — 7,504,289
   - Actionable Calls — 2,582,468
   - Assistance to Senior Citizens — 29,768
   - Events Prepared and Help Provided — 2,021,300

7. **Daily Statistics** — "Calls Data" today, gender-split bar/progress per category:
   - Police Events, Emergency (FRV), NON FRV, Medical Assistance, Women Related, Child Related, Cyber, Crashes/Accidents — each with total, M count/%, F count/%

8. **Gallery preview** — "Gallery Images", 12-image grid, link to `/gallery`

9. **Our Stories preview** — 6 cards (image, date, Hindi headline, "Read more") → `/stories/:id`

10. **Our News preview** — 6 cards (same shape) → `/news/:id`

11. **Stay Connected** — social follow block (Facebook, Instagram, X, YouTube)

---

## 4. About page (`/about`)

- Hero: "About Dial 112" / "A Beacon of Safety and Hope Across Madhya Pradesh"
- Stat strip: 8.99 Cr+ Emergency Calls Answered · 16 min Avg Response Time · 55 Districts Covered · 2015 Year of Launch
- **Landmark Achievements** (list): Inauguration of Dial-100 (1 Nov 2015) · Transition to Dial-112 ERSS · 8.99 Cr+ calls · 16-min avg response · Unified multi-agency framework · 1,200 GPS-enabled FRVs
- **The Glorious Evolution** (long-form narrative, 3 subsections):
  - "The Dawn of Dial-100" — origin story, Bhopal command centre, 1,000 GPS FRVs, LBS tech
  - "The Rise of Dial-112" — multi-agency ERSS integration (fire 101, health 108, women 1090, etc.)
  - "A Decade of Impact" — 8.99 crore served, 2.07 crore actionable pleas → 1.97 crore interventions, 19.71 lakh women rescued, 12.48 lakh accident responses
  - "Vision for Tomorrow" — 100-agent contact center, SIP comms, BI tools, number masking, body cams, mobile apps/chatbots
- **Our Promise / Our Commitment to the Community** — 5 pillar cards: Empowering Through Education, Skill Enhancement, Blueprint for the Future, Building Trust, Community First
- **A Lasting Legacy** — closing mission statement
- **Detailed history** — "Legacy of Dial-100 and the advent of Dial-112" long article incl. full list of integrated helplines: Police (112), Health/Ambulance (108), Fire (101), Women's Helpline (1090), Cyber Crime (1930), Railway (139), MP Road Dev Corp (1099), Disaster Mgmt (1079), Women & Child (181, 1098)
- Footer (global)

## 5. Services page (`/services`)

- Hero: "Our Services - Dial 112" / "Comprehensive emergency services across Madhya Pradesh, ensuring rapid response and community safety in all 55 districts."
- Top stat row: Active Cases 2025 · Avg Response Time "7 min" · Resolution Rate (24h)
- **Search/filter bar** — live filters the 21 service cards; empty state message: "No services match your search"
- **21 services in 4 category groups** (grid of cards: icon, title, description w/ embedded stat, feature tags):
  1. *Community Services*: Anonymous Tips & Information; Public Announcements & Notifications
  2. *Personal Safety Services*: Missing Persons Report; Missing/Deceased Persons Identification; Domestic Violence; Sexual Assault; Child Abuse; Stalking or Harassment; Human Trafficking; Suicide Information & Prevention; Elderly and Disabled Emergency Support; Mental Health Crisis Intervention
  3. *Traffic Services*: Traffic and Accident Reports; Road Rage
  4. *Emergency Services*: Online SOS / Panic Alert; Disaster Report; Riots and Public Disturbances; Hostage Situations or Terrorist Threats; Gas Leaks; Fire Incident; Wildlife Incident Reporting
  - Each card carries a 2025 volume stat (e.g. "Processed 7,800 tips in 2025, leading to 1,500 arrests") and 3 feature bullets — see raw list in section 8 below for exact copy to reuse.
- Secondary CTA: "DIAL 112 NOW"
- No downloadable forms, no per-service sub-pages on the live site — cards are informational only (no filing flow to replicate).

## 6. Stories page (`/stories`) + detail (`/stories/:id`)

- Header: "Our Stories"
- Long reverse-chronological list (~100+ entries, July 2026 back to Oct 2025), **no pagination visible on live site** (continuous list — we will paginate/virtualize instead, see brain.md)
- Card: image, "Story" tag, date+time ("23 Jul 2026 Thursday · 11:00 AM"), Hindi headline, "Read Full Story" link
- No search/filter/category on live site
- Detail page: breadcrumb (Home › News/Story › Title), headline, date, source "MP Police Dial 112", body narrative (Hindi), single photo, share buttons (Facebook/Twitter/WhatsApp), "Back to All" link, global footer

## 7. News page (`/news`) + detail (`/news/:id`)

- Same shape as Stories: header "Our News", reverse-chronological list, card = image + "News" tag + date + Hindi headline + preview text
- Detail page identical structure to story detail (breadcrumb, headline, date, source, body, image, share buttons, back link)
- Example real copy already captured for seeding placeholder content — see section 8.

## 8. Gallery page (`/gallery`)

- Header: "Documenting the dedication, reach, and impact of Madhya Pradesh Police Dial 112 — from rescue missions to community outreach across all 55 districts."
- Tabs: "All Media / Photos / Videos" (counts shown, e.g. live site currently bugged showing "0")
- ~30 items, single-column/list on live site (we upgrade to responsive masonry/grid — see brain.md)
- Generic alt text only ("MP Police Gallery"), no per-image captions on the live site
- No lightbox on live site (we add one — improvement, not scope creep, since "gallery" implies viewing)
- Trailing stat strip: 55 districts · 24/7 · 75M+ people served

## 9. Contact page (`/contact`)

- **Not a form** — a contact/info directory. Replicate as-is (no email-sending backend needed):
  - Command & Control Center: "Police Telecommunication Headquarters, Bhadbhada Road, Bhopal, MP, India"
  - HQ: "MP Police Headquarters, Bhopal, Madhya Pradesh, India"
  - Phones: 112 (emergency, 24/7), 0755-2555250 (helpline for calls from outside MP)
  - WhatsApp: 7869700112
  - Email: info.dial112@mppolice.gov.in
  - Availability: "24 × 7 — All 55 Districts"
  - No map embed, no form fields, no validation on the live site.

## 10. Weather page (`/weather`)

- "WeatherOS"-style dashboard, single station: Device WMS10042226 @ Police Telecom HQ, "Auto-refresh every 5 min"
- Current conditions block: Temp 24.2°C (feels 23°C), Cloudy, Humidity 85.8%, Wind 1.2 km/h @ 211°, Rain chance 43%, Precip 0.0mm
- Extra metrics row: Pressure 939.0 hPa, Solar Radiation 0.0 W/m², PM10 14 μg/m³, PM2.5 14 μg/m³, CO₂ 467.0 ppm
- **24-Hour Temperature Trend** — line chart (Chart.js on live site; we use a lightweight charting approach, see brain.md), hourly avg over last 24h
- **7-Day Historical** — daily high/low list, Sat→Thu
- No map, no multi-station list on the live site (single station only) — matches scope, no need to invent more stations.

---

## 11. Interactive functionality inventory (what must actually work)

| Feature | Live site behavior | Our target |
|---|---|---|
| Emergency call CTA | `tel:112` links, header/hero/footer/mobile | same, keep as real `tel:` links |
| WhatsApp CTA | `wa.me/917869700112` | same |
| Mobile nav | hamburger toggles overlay menu | same, animated with Framer Motion |
| Services search/filter | client-side filter over 21 cards, empty state | same, client-side filter/search + category tabs |
| Animated counters | stat numbers appear to count up (`.text-animate`, fade-in classes suggest scroll-triggered reveal) | reproduce with Framer Motion `useInView` + count-up |
| Weather widget | live-looking data, "auto-refresh every 5 min" | mock/static JSON data source refreshed on interval, same shape |
| Weather chart | Chart.js line chart, 24h trend | recharts or a lightweight custom SVG chart, same data shape |
| Gallery tabs | All/Photos/Videos filter | same, client-side filter |
| Stories/News list | long static list, no pagination on live site | paginate or "load more" (improvement — still same content model) |
| Detail pages | route by `?id=` query param | route by `/stories/:id` and `/news/:id` path param |
| Share buttons | FB/Twitter/WhatsApp share links on detail pages | same, `window.open` share intents |
| Social links | external profile links, new tab | same |
| Scroll reveal animations | `.fade-left/right/top/bottom` + `.show` class toggled via JS/IntersectionObserver | reproduce with Framer Motion variants |

No user auth, no complaint filing/tracking form, no downloads/PDFs, no payment, no search across whole site — **confirmed absent on live site, do not add them**, this is an informational/PR site, not a transactional portal.

---

## 12. Content to seed as static/mock data

Since none of this is a live backend for us, we ship the above as static TypeScript/JSON data modules:
- `data/stats.ts` — homepage impact stats, decade stats, daily call stats
- `data/leadership.ts` — 3 leader profiles
- `data/fleet.ts` — 4 infrastructure stat cards
- `data/services.ts` — 21 services × 4 categories (full copy captured in this file, section 5)
- `data/stories.ts` — seed with the 6 homepage examples + enough placeholder entries (reuse real captured Hindi copy where we have it) to make list/pagination meaningful
- `data/news.ts` — same pattern, incl. the one real detail-page example captured (टीकमगढ़/खरगापुर station reunification story)
- `data/gallery.ts` — image manifest (we'll need our own royalty-free / generated placeholder images since we aren't scraping live site binary assets)
- `data/weather.ts` — current conditions + 24h trend + 7-day history, static realistic mock
- `data/contact.ts`, `data/footer.ts`, `data/nav.ts` — chrome content

All Hindi copy above is captured verbatim from the live site and safe to reuse as sample content for a portfolio rebuild of a public government informational page.

---

## 13. Known live-site quirks (do not "fix" into scope creep, just note)
- WhatsApp number inconsistent between pages (7869700112 vs 7587600100) → we standardize on one number, document choice in brain.md.
- Gallery header shows "0 Photos 0 Videos" (counter bug on live site) → we just show real counts.
- No language switcher despite leftover CSS class → optional stretch, not required for parity.
- Mixed Hindi/English content, no i18n framework on live site → we keep content mixed as-is (not building full i18n unless asked).
