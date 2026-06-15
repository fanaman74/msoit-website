# MSOIT Website — Template Reference

> Full reference for reusing this codebase as a template for new client websites. Covers stack, design system, components, patterns, integrations and deployment.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 5 — SSR (`output: 'server'`) |
| Adapter | `@astrojs/node` standalone |
| Styles | Tailwind CSS v4 via `@tailwindcss/vite` (no config file — all tokens in `global.css`) |
| Motion | GSAP 3 + ScrollTrigger (React island: `SiteMotion.tsx`) |
| UI components | React (`@astrojs/react`) — used only for the motion island |
| Icons | `@lucide/astro` |
| Sitemap | `@astrojs/sitemap` |
| Database | Supabase (REST API via fetch — no client library) |
| Email | Resend (`resend` npm package) |
| Hosting | Railway (standalone Node server) |

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.astro       # Sticky nav, logo, language toggle
│   │   └── Footer.astro       # Dark footer, service links, CTA
│   ├── motion/
│   │   └── SiteMotion.tsx     # GSAP scroll animations (React island)
│   ├── sections/              # Full-width page sections
│   │   ├── Hero.astro
│   │   ├── CTASection.astro
│   │   ├── ServicesOverview.astro
│   │   ├── FeaturedSolutions.astro
│   │   ├── ProblemsSolved.astro
│   │   ├── Process.astro
│   │   ├── TrustStatement.astro
│   │   ├── WhyWorkWithMe.astro
│   │   └── AIReviewFeature.astro
│   └── ui/                    # Reusable primitives
│       ├── Button.astro
│       ├── SectionHeading.astro
│       ├── ServiceCard.astro
│       ├── SolutionCard.astro
│       ├── ProblemCard.astro
│       └── ProcessStep.astro
├── layouts/
│   └── Layout.astro           # Root HTML shell, SEO, JSON-LD
├── pages/
│   ├── index.astro
│   ├── services.astro
│   ├── about.astro
│   ├── contact.astro
│   ├── pricing.astro
│   ├── ai-review.astro
│   ├── 404.astro
│   ├── admin.astro            # Password-protected lead dashboard
│   └── api/
│       ├── contact.ts         # Contact form → Supabase + Resend
│       ├── admin-login.ts
│       ├── admin-logout.ts
│       └── admin-update-lead.ts
└── styles/
    └── global.css             # Tailwind + all design tokens
```

---

## Design System

### Colour Tokens (`src/styles/global.css`)

```css
--color-accent:       #ff4f00   /* orange — CTAs, highlights, borders */
--color-accent-light: #ff6b2a
--color-accent-dark:  #cc3f00
--color-surface:      #f7f7f8   /* light grey backgrounds */
--color-surface-alt:  #ededee
/* Greys (navy scale) */
--color-navy-950: #111111
--color-navy-900: #181818
/* ... down to --color-navy-600: #4a4a4a */
```

**In markup use:** `text-accent`, `bg-accent`, `border-[#111111]`, `bg-surface`, `text-[#444444]`, `text-[#555555]`

### Typography

- Font: `Helvetica Neue, Helvetica, Arial, system-ui` (no Google Fonts)
- Headings: `font-bold` (700), tight leading `leading-[0.86]–leading-[0.95]`
- H1 hero: `text-6xl sm:text-7xl lg:text-8xl font-bold`
- H1 inner pages: `text-6xl sm:text-8xl font-bold`
- Body: `text-lg leading-8 text-[#444444]`
- Small labels: `text-sm font-bold text-accent` (uppercase kicker tags)
- Anti-aliasing: `antialiased` on `body`

### Spacing Rhythm

- Section padding: `py-20` (inner pages), `py-24` (CTA)
- Content max-width: `max-w-7xl mx-auto px-6`
- Card gap: `gap-6` or `gap-8`

### Grid Background

Two variants used throughout:

```css
/* Full opacity — used on hero and standalone sections */
.surface-line {
  background-image:
    linear-gradient(rgba(17,17,17,.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(17,17,17,.07) 1px, transparent 1px);
  background-size: 72px 72px;
}

/* Fades out — used on section-shell ::before pseudo */
.section-shell::before {
  /* same grid but masked: mask-image: linear-gradient(to bottom, black, transparent 86%) */
}
```

Apply `surface-line` as `<div class="surface-line pointer-events-none absolute inset-0" aria-hidden="true">` inside a `relative` parent.

### Border Style

All borders: `border border-[#111111]` — 1px solid near-black. No border-radius anywhere (sharp corners throughout).

### Shadow

```css
.premium-shadow { box-shadow: 12px 12px 0 #111111; }
```

Button shadow: `shadow-[6px_6px_0_#111111]` → on hover `shadow-[9px_9px_0_#111111]`

---

## Components

### `Button.astro`

```astro
<Button href="/contact" variant="primary" size="lg">CTA text</Button>
```

| Prop | Values | Notes |
|---|---|---|
| `variant` | `primary` `secondary` `ghost` | primary = orange bg + shadow, secondary = white |
| `size` | `sm` `md` `lg` | sm=px-4/py-2, md=px-5/py-3, lg=px-6/py-3.5 |
| `href` | string | Always an anchor tag |

### `Layout.astro`

Wraps every page. Props:

```astro
<Layout
  title="Page Title"
  description="Meta description."
  keywords={['keyword 1', 'keyword 2']}
  ogImage="/images/og-custom.png"
>
```

Injects: canonical URL, OG tags, Twitter card, JSON-LD structured data, favicon, language attributes.

Title is auto-formatted as `{title} | {SiteName} — {Tagline}`.

### Section pattern

Every content section uses `section-shell`:

```astro
<section class="section-shell bg-white py-20">
  <div class="relative mx-auto max-w-7xl px-6" data-reveal>
    <!-- content -->
  </div>
</section>
```

`section-shell` adds: `position: relative`, `overflow: hidden`, `border-top: 1px solid #111`, fading grid pseudo-element.

### Page hero pattern

```astro
<section class="section-shell bg-white py-20">
  <div class="surface-line pointer-events-none absolute inset-0" aria-hidden="true"></div>
  <div class="relative mx-auto max-w-7xl px-6" data-reveal>
    <p class="mb-5 text-sm font-bold text-accent">Page label</p>
    <h1 class="text-balance max-w-5xl text-6xl font-bold leading-[0.88] text-[#111111] sm:text-8xl">
      Headline here.
    </h1>
    <p class="mt-8 max-w-2xl text-lg leading-8 text-[#444444]">Subheadline.</p>
  </div>
</section>
```

### Kicker tag (used in hero)

```astro
<div class="inline-flex items-center gap-3 border border-[#111111] bg-white px-4 py-2 text-sm font-bold text-[#111111]">
  <span class="h-2.5 w-2.5 bg-accent"></span>
  Label text
</div>
```

### Card pattern

```astro
<div class="border border-[#111111] bg-white p-6 lg:p-8">
  <!-- content -->
</div>
```

On `bg-surface` backgrounds, cards are `bg-white`. On `bg-white` backgrounds, cards use `bg-surface`.

---

## Motion System (`SiteMotion.tsx`)

GSAP React island loaded with `client:load`. Targets data attributes:

| Attribute | Effect |
|---|---|
| `data-reveal` | Fade + blur + translateY up on scroll (ScrollTrigger, once) |
| `data-stagger` | Parent container; children with `data-stagger-item` animate in sequence |
| `data-card` | Subtle lift on hover |
| `data-panel` | Used on hero right-side panel |
| `data-line` | ScaleX from 0→1 (for horizontal rule reveals) |

Hero-specific classes animated on load (no scroll): `.hero-kicker`, `.hero-title`, `.hero-copy`, `.hero-actions`, `.hero-panel`

Respects `prefers-reduced-motion` — skips all animations.

---

## CSS Utilities

```css
.marquee          /* Orange scrolling belt — wraps .marquee__track > .marquee__item */
.accent-bar       /* Orange bg, dark text */
.text-balance     /* text-wrap: balance */
.shape-ring       /* Animated floating circle */
.skip-link        /* Accessibility skip nav */
```

---

## Header (`Header.astro`)

- Sticky, `z-50`, white/90 + backdrop blur
- Logo: inline SVG (M path + orange square accent pixel) + bold "CLIENT" text in `text-accent`
- Nav: `hidden md:flex` — desktop only. Mobile: hamburger toggle (button + mobile nav overlay)
- Language toggle: `en / fr / nl` buttons, `aria-pressed` state, driven by `/i18n.js`
- CTA button: "Book a Review" → `/contact`

**To adapt:** Replace logo SVG, update nav items array, update CTA text/href.

---

## Footer (`Footer.astro`)

- Dark (`bg-[#111111] text-white`)
- 4-column grid: brand + tagline | services links | company links | CTA block
- Logo: same SVG as header but white stroke

---

## Pages

### `index.astro`
Sections in order: `Hero` → `TrustStatement` → `ServicesOverview` → `ProblemsSolved` → `AIReviewFeature` → `FeaturedSolutions` → `WhyWorkWithMe` → `Process` → `CTASection`

### `services.astro`
Hero section + map over `services[]` array. Each service: id, title, description, outcome, items[]. Renders as two-column article grid.

### `pricing.astro`
Two-column card layout: one-off project fee + monthly add-on. Pattern reusable for any pricing page.

### `contact.astro`
Two-column: orange aside (what to expect) + form. Form submits to `/api/contact` via JS fetch. Shows inline success/error status.

### `about.astro`
Solo consultant page with trust signals.

### `admin.astro`
Hidden lead dashboard. Not in nav. Password-protected via httpOnly cookie. Shows `lead_submissions` table from Supabase.

### `404.astro`
Custom not-found page with two CTA links.

---

## Contact Form API (`/api/contact.ts`)

**Flow:** Validate → Store in Supabase → Send confirmation email via Resend → Return JSON

**Env vars required:**
```
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

**Supabase table: `lead_submissions`**

```sql
CREATE TABLE public.lead_submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  company      text,
  email        text NOT NULL,
  phone        text,
  area         text,
  message      text,
  language     text,
  page_url     text,
  referrer     text,
  utm_source   text,
  utm_medium   text,
  utm_campaign text,
  utm_term     text,
  utm_content  text,
  user_agent   text,
  ip_address   text,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_insert" ON public.lead_submissions FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "service_role_select" ON public.lead_submissions FOR SELECT TO service_role USING (true);
```

Confirmation email sends from `hello@{domain}` with visitor's details quoted back. Reply-to set to the same address.

---

## Admin Dashboard (`/admin`)

- URL: `/admin` — not in nav, not indexed (`noindex, nofollow`)
- Password stored server-side only (base64 token in httpOnly cookie)
- Session: 8 hours
- Shows all leads sorted newest-first: status dropdown, date, name, company, email, phone, area, message, language, UTM source
- Status options: `new` (blue) / `contacted` (yellow) / `closed` (green) — updates Supabase on change via `/api/admin-update-lead`

**To adapt:** Change password in `admin.astro`, `admin-login.ts`, and `admin-update-lead.ts` (all three must match).

---

## SEO

Every page gets via `Layout.astro`:
- `<title>` formatted as `{Page Title} | {Brand} — {Tagline}`
- `meta description`, `meta keywords`
- Canonical URL
- OG image (`/images/og-default.png` unless overridden)
- Twitter card
- `geo.region`, `geo.placename` (update per country)
- JSON-LD: `ProfessionalService` + `WebSite` schemas (update business details in `Layout.astro`)
- Sitemap via `@astrojs/sitemap` (auto-generated from pages)

---

## i18n

`/public/i18n.js` — client-side language toggle (en/fr/nl). Elements with `data-en`, `data-fr`, `data-nl` attributes swap content on button press. Language buttons in header and mobile nav use `aria-pressed`.

---

## Astro Config (`astro.config.mjs`)

```js
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://yourdomain.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  security: { checkOrigin: false },  // required for form POSTs
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

---

## Railway Deployment

Build command: `npm run build`  
Start command: `node ./dist/server/entry.mjs`

Required environment variables:
```
PUBLIC_SITE_URL          https://yourdomain.com
SUPABASE_URL             https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY  eyJ...
RESEND_API_KEY           re_...
```

---

## Before You Start: Required Questions

**Always ask the client these two questions before touching any code:**

### 1. What type of website is this?

The answer determines page structure, nav items, section order, content tone and which sections to keep or remove. Common types:

| Type | Typical pages | Notes |
|---|---|---|
| Professional services / consultancy | Home, Services, About, Contact | Keep current structure, swap content |
| Product / SaaS | Home, Features, Pricing, Docs, Contact | Remove services section, add features grid |
| Portfolio / freelancer | Home, Work, About, Contact | Simpler nav, gallery or case study section |
| E-commerce / shop | Home, Products, About, Contact | Add product listing pattern |
| Restaurant / hospitality | Home, Menu, About, Contact | Remove admin/leads if not needed |
| Non-profit / charity | Home, Mission, Impact, Donate, Contact | Swap CTA copy throughout |
| Event / launch | Single page or Home + RSVP | Strip to minimal sections |

### 2. What is the primary brand colour?

The entire site is themed from a single accent colour (`--color-accent`). Get the hex value and update it in **one place**:

```css
/* src/styles/global.css */
--color-accent:       #ff4f00;   /* ← replace with client colour */
--color-accent-light: #ff6b2a;   /* ← lighter tint (~15% lighter) */
--color-accent-dark:  #cc3f00;   /* ← darker shade (~20% darker) */
```

Also update `meta name="theme-color"` in `Layout.astro` to match.

> **Tip:** If the client colour is dark (e.g. navy, dark green), check contrast on the orange-on-white CTA button pattern — you may need to switch button text from `text-[#111111]` to `text-white`.

---

## Checklist: Adapting for a New Client

- [ ] **Answer the two required questions above** (website type + primary colour) before starting
- [ ] `astro.config.mjs` — update `site` URL
- [ ] `Layout.astro` — update brand name, tagline, JSON-LD business details, `geo.region`, `areaServed`, `availableLanguage`
- [ ] `Header.astro` — update logo SVG or text, nav items, CTA text/href
- [ ] `Footer.astro` — update logo, service links, company links, tagline
- [ ] `global.css` — swap `--color-accent` if client has a different brand colour
- [ ] `Hero.astro` — update headline, subheadline, kicker tag, CTA buttons
- [ ] `admin.astro` + `admin-login.ts` + `admin-update-lead.ts` — update admin password
- [ ] Supabase — create new project, run `lead_submissions` SQL, copy URL + service role key
- [ ] Resend — verify sender domain, update `from` address in `contact.ts`
- [ ] Railway — set all 4 env vars, deploy
- [ ] `public/` — replace `favicon.svg`, `og-default.png`
- [ ] Remove or update `i18n.js` if client is single-language
