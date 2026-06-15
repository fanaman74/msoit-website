# MSOIT Professional Website — Build Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a professional, senior IT consultancy website for SMEs that positions the consultant as a trusted technology partner — secure, modern, and credible.

**Architecture:** Astro static-site framework with Tailwind CSS for styling, component-based layout with reusable sections, multi-page routing. Static HTML output for maximum performance, SEO, and deployability to any host (Netlify, Vercel, Cloudflare Pages, static hosting).

**Tech Stack:** Astro 5, Tailwind CSS 4, TypeScript, Lucide Icons, static deployment.

**Brand:** **MSOIT — Making Sense of IT**. Tagline: *"Secure, automate and modernise your business IT"*. Hosting: **Railway**.

---

## Project Structure

```
msoit-website/
├── .hermes/plans/
├── public/
│   ├── favicon.svg
│   ├── images/
│   │   ├── hero-bg.svg          # Abstract tech background
│   │   ├── og-image.png         # Open Graph social card
│   │   └── logo.svg             # Brand logo
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.astro      # Navigation + mobile menu
│   │   │   ├── Footer.astro      # Footer with links + CTA
│   │   │   └── BaseLayout.astro  # <html>, <head>, <body> wrapper
│   │   ├── sections/
│   │   │   ├── Hero.astro        # Hero with headline + CTAs
│   │   │   ├── TrustStatement.astro
│   │   │   ├── ServicesOverview.astro
│   │   │   ├── ProblemsSolved.astro
│   │   │   ├── AIReviewFeature.astro
│   │   │   ├── FeaturedSolutions.astro
│   │   │   ├── WhyWorkWithMe.astro
│   │   │   ├── Process.astro
│   │   │   └── CTASection.astro
│   │   └── ui/
│   │       ├── ServiceCard.astro
│   │       ├── ProblemCard.astro
│   │       ├── SolutionCard.astro
│   │       ├── ProcessStep.astro
│   │       ├── Button.astro
│   │       ├── SectionHeading.astro
│   │       └── ContactForm.astro
│   ├── content/
│   │   ├── services/
│   │   │   ├── microsoft-365.md
│   │   │   ├── cybersecurity.md
│   │   │   ├── automation.md
│   │   │   ├── ai-review.md
│   │   │   ├── ai-documents.md
│   │   │   └── websites.md
│   │   ├── solutions/
│   │   │   ├── ai-document-management.md
│   │   │   ├── ai-opportunity-review.md
│   │   │   ├── m365-security-review.md
│   │   │   ├── business-automation.md
│   │   │   ├── cloud-migration.md
│   │   │   └── website-modernisation.md
│   │   └── config.ts             # Content collection schemas
│   ├── layouts/
│   │   └── Layout.astro          # Base HTML layout (head, meta, SEO)
│   ├── pages/
│   │   ├── index.astro           # Home
│   │   ├── services/
│   │   │   └── index.astro       # Services overview
│   │   ├── services/[slug].astro # Individual service pages
│   │   ├── ai-review.astro       # AI Opportunity Review
│   │   ├── about.astro           # About page
│   │   ├── contact.astro         # Contact page + form
│   │   ├── 404.astro             # Custom 404
│   │   ├── sitemap.xml.ts        # Sitemap
│   │   └── robots.txt.ts         # Robots.txt
│   └── styles/
│       └── global.css            # Tailwind imports + custom vars
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

---

## Design System

### Colour Palette

| Token | Colour | Hex | Usage |
|-------|--------|-----|-------|
| `--navy-900` | Dark Navy | `#0A1628` | Primary background, hero |
| `--navy-800` | Navy | `#111D35` | Secondary dark backgrounds |
| `--navy-700` | Medium Navy | `#1A2A4A` | Card backgrounds on dark |
| `--slate-100` | Off-white | `#F8FAFC` | Light section backgrounds |
| `--slate-200` | Light grey | `#E2E8F0` | Borders, dividers |
| `--slate-600` | Body text | `#475569` | Secondary text |
| `--white` | White | `#FFFFFF` | Primary text on dark, cards |
| `--accent` | Electric Blue | `#2563EB` | CTAs, links, icons, accents |
| `--accent-light` | Light Blue | `#3B82F6` | Hover states |
| `--accent-dark` | Dark Blue | `#1D4ED8` | Active states |
| `--success` | Teal Green | `#10B981` | Checkmarks, positive indicators |

### Typography

| Role | Font | Weight | Size (Desktop) |
|------|------|--------|----------------|
| Headlines | Inter | 700–800 | 48–56px |
| Subheadlines | Inter | 500–600 | 20–24px |
| Body | Inter | 400 | 16–18px |
| Small / Labels | Inter | 500 | 13–14px |

**Font:** Inter (variable) from Google Fonts — clean, professional, highly legible.

### Spacing

- Section padding: `py-20` (80px) desktop, `py-12` (48px) mobile
- Container max-width: `1200px` with `px-6` padding
- Card padding: `p-8` (32px)
- Section gap between elements: `gap-12` (48px)

### Design Patterns

- **Alternating sections:** Dark navy → White/light grey → Dark navy
- **Cards:** Rounded corners (`rounded-xl`), subtle shadow, clean borders
- **Icons:** Lucide icons — outline style, coloured with accent
- **CTAs:** Solid accent blue button with white text, clear hover state
- **Service cards:** Icon + headline + description + bullet list
- **No stock photos** — use abstract geometric/circuit patterns as background SVGs

---

## SEO Strategy

### Global

- UK English meta titles and descriptions (from instruction doc)
- Open Graph and Twitter Card meta tags on every page
- Structured data (JSON-LD) for `LocalBusiness` and `ProfessionalService`
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Descriptive `alt` text on all images
- Canonical URL on every page
- `robots.txt` + auto-generated `sitemap.xml`

### Page-Specific Meta

| Page | Title | Description |
|------|-------|-------------|
| Home | Secure IT, Automation & AI Solutions for SMEs | Practical IT consultancy for SMEs. Microsoft 365, cybersecurity, automation, AI document systems, websites and AI opportunity reviews. |
| Services | IT Consultancy Services for SMEs | Microsoft 365, cybersecurity, automation, AI consulting, document management and website services for small and medium-sized businesses. |
| AI Review | AI Opportunity Review for SMEs | Understand where AI can help your business with a practical review of processes, risks, tools and realistic AI use cases. |
| About | Senior IT Consultancy — About SecureFlow IT | Senior IT professional helping SMEs with secure systems, automation and modern cloud solutions. |
| Contact | Book a Free IT Review — SecureFlow IT | Book a free 30-minute IT review to discuss your systems, security, automation and AI opportunities. |

---

## Step-by-Step Build Plan

### Phase 1: Project Setup (Tasks 1–3)

#### Task 1: Initialise Astro + Tailwind project

**Objective:** Scaffold the project with Astro, Tailwind CSS, and TypeScript.

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`
- Create: `src/styles/global.css`
- Create: `src/layouts/Layout.astro`

**Steps:**

```bash
cd /Users/fred/Documents/VibeCoding/hermes/msoit-website
npm create astro@latest . -- --template minimal --typescript strict --no-git --no-install
npm install
npm install tailwindcss @tailwindcss/vite
npm install lucide-astro
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://secureflowit.co.uk',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

`src/styles/global.css`:
```css
@import "tailwindcss";

@theme {
  --color-navy-900: #0A1628;
  --color-navy-800: #111D35;
  --color-navy-700: #1A2A4A;
  --color-accent: #2563EB;
  --color-accent-light: #3B82F6;
  --color-accent-dark: #1D4ED8;
  --color-success: #10B981;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  color: #1e293b;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

#### Task 2: Create base layout with SEO head

**Objective:** Build the base HTML layout with meta tags, font loading, and structured data.

**Files:**
- Create: `src/layouts/Layout.astro`

**Key elements:**
- Google Fonts preconnect + Inter variable font
- Dynamic `<title>`, `description`, `og:title`, `og:description`, `og:image` via props
- JSON-LD LocalBusiness schema
- Skip-to-content accessibility link
- Favicon, robots meta

---

#### Task 3: Create Header and Footer components

**Objective:** Build responsive navigation header with mobile hamburger menu, and footer with links and CTA.

**Files:**
- Create: `src/components/layout/Header.astro`
- Create: `src/components/layout/Footer.astro`
- Create: `src/components/ui/Button.astro`

**Header nav items:** Home, Services, AI Review, About, Contact
**Mobile:** Hamburger toggle with JS for slide-down menu
**Footer:** 4-column layout: Brand + tagline | Services links | Company links | CTA button

---

### Phase 2: UI Components (Tasks 4–6)

#### Task 4: Build reusable UI primitives

**Objective:** Create the shared component library (Button, SectionHeading, cards).

**Files:**
- Create: `src/components/ui/Button.astro` — Primary (accent), secondary (outline), ghost variants
- Create: `src/components/ui/SectionHeading.astro` — Heading + optional subtitle, centred or left-aligned
- Create: `src/components/ui/ServiceCard.astro` — Icon + title + description + bullet list + "Learn more" link
- Create: `src/components/ui/ProblemCard.astro` — Icon + title + description
- Create: `src/components/ui/SolutionCard.astro` — Title + description + feature list
- Create: `src/components/ui/ProcessStep.astro` — Step number + title + description

**Button component props:** `variant` (primary/secondary/ghost), `href`, `size` (sm/md/lg), `children`

**ServiceCard:** Navy/dark bg, accent icon, white text, bullet list in lighter colour. Used on homepage services grid.

---

#### Task 5: Create abstract SVG backgrounds

**Objective:** Generate subtle, professional SVG backgrounds for dark sections (no stock photos).

**Files:**
- Create: `public/images/hero-bg.svg` — Abstract geometric network/circuit pattern, very subtle, low opacity lines on navy
- Create: `public/images/pattern-dots.svg` — Dot grid pattern for card sections
- Create: `public/images/pattern-grid.svg` — Subtle grid lines for alternating sections

**Design:** Thin lines, nodes, hexagons — opacity ~5-10% on navy background. Professional, not flashy.

---

#### Task 6: Create brand assets

**Objective:** Create a simple SVG logo and favicon.

**Files:**
- Create: `public/images/logo.svg` — "SecureFlow IT" wordmark or icon + wordmark
- Create: `public/favicon.svg` — Simplified icon mark for browser tab
- Create: `public/og-image.png` (placeholder — can generate later)

**Logo direction:** Clean geometric shield or lock icon combined with a flow/arrow motif. Navy + accent blue. Professional, minimal.

---

### Phase 3: Homepage Sections (Tasks 7–15)

#### Task 7: Hero section

**Objective:** Build the hero with headline, subheading, and dual CTAs on abstract dark background.

**Files:**
- Create: `src/components/sections/Hero.astro`

**Content:**
- **Headline:** "Secure, automate and modernise your business IT"
- **Subheading:** "I help SMEs improve their IT systems, strengthen cybersecurity, automate manual work and build modern cloud, AI and document-management solutions."
- **Primary CTA:** "Book a free 30-minute IT review" → `/contact`
- **Secondary CTA:** "View services" → `/services`
- **Background:** Dark navy with subtle SVG pattern overlay

**Layout:** Full-width, large text, left-aligned content, optional right-side abstract illustration area.

---

#### Task 8: Trust / Positioning statement

**Objective:** Build the intro statement section on a light background.

**Files:**
- Create: `src/components/sections/TrustStatement.astro`

**Content:**
> Technology should make your business easier to run, not more complicated. I help SMEs organise their systems, protect their data, automate routine work and adopt AI in a practical and secure way.

**Design:** Centred text, large readable typography, white background, subtle top/bottom borders.

---

#### Task 9: Services overview section

**Objective:** Build a 6-card grid showing all core services.

**Files:**
- Create: `src/components/sections/ServicesOverview.astro`

**Grid:** 3 columns desktop, 2 tablet, 1 mobile.
**Cards:** ServiceCard component with icon, headline, short description, and link to `/services/[slug]`.

**Services (with icon choices):**
1. Microsoft 365 & Cloud Productivity → `cloud` icon
2. Cybersecurity & IT Governance → `shield-check` icon
3. Business Automation → `workflow` icon
4. AI Strategy & Opportunity Review → `brain` icon
5. AI Document & Knowledge Systems → `file-search` icon
6. Websites & Digital Presence → `globe` icon

---

#### Task 10: Problems Solved section

**Objective:** Build the pain-point section that makes visitors recognise their own situation.

**Files:**
- Create: `src/components/sections/ProblemsSolved.astro`

**Section heading:** "Does this sound familiar?"
**Grid:** 2 columns desktop, 1 mobile. Dark background. Each card has an icon, pain point heading, and description.

**6 Problems:**
1. Too Much Manual Work → `repeat` icon
2. Poor File Management → `folder-search` icon
3. Weak Security → `lock-open` icon
4. Outdated Systems → `monitor-off` icon
5. No Clear IT Ownership → `help-circle` icon
6. Confusion About AI → `brain-cog` icon

---

#### Task 11: AI Opportunity Review feature section

**Objective:** Build a highlighted feature block promoting the AI Review service.

**Files:**
- Create: `src/components/sections/AIReviewFeature.astro`

**Design:** Full-width section with accent blue gradient or dark navy with blue border accent. Two-column layout: left side copy, right side deliverable checklist.

**Content:**
- **Heading:** "AI Opportunity Review"
- **Subheading:** "Understand where AI can genuinely help your business before investing in tools or platforms."
- **Deliverables list:** AI opportunity summary, prioritised use-case list, quick wins, risk considerations, recommended tools, practical roadmap
- **CTA:** "Book an AI Opportunity Review" → `/ai-review`

---

#### Task 12: Featured Solutions section

**Objective:** Build a section showcasing 6 strategic, higher-value solution packages.

**Files:**
- Create: `src/components/sections/FeaturedSolutions.astro`

**Grid:** 3 columns desktop, 2 tablet, 1 mobile.
**Cards:** SolutionCard with title, description, and 3–5 key features listed.

**6 Solutions:**
1. AI Document Management System
2. AI Opportunity Review
3. Microsoft 365 Security Review
4. Business Process Automation
5. Secure Cloud Migration
6. Professional Website Modernisation

---

#### Task 13: Why Work With Me section

**Objective:** Build the trust/credibility section with key strengths.

**Files:**
- Create: `src/components/sections/WhyWorkWithMe.astro`

**Design:** Light background, two-column layout. Left: headline + description paragraph. Right: bullet list of 8 key strengths with checkmark icons.

**Heading:** "Senior IT experience. Practical business solutions."

**8 Key Strengths** (with green `check-circle` icons):
- Senior IT and digital transformation experience
- Strong Microsoft 365, SharePoint and cloud background
- Practical cybersecurity and governance knowledge
- Experience building business applications and automation
- Ability to translate business problems into working technical solutions
- Professional, structured and security-conscious approach
- Experience with documentation, compliance and operational reliability
- Ability to support SMEs that need senior IT thinking without hiring a full IT department

---

#### Task 14: Process section

**Objective:** Build the 5-step engagement process with visual timeline.

**Files:**
- Create: `src/components/sections/Process.astro`

**Design:** Horizontal timeline on desktop, vertical on mobile. Each step has a numbered circle, title, and description. Connected by subtle lines.

**5 Steps:**
1. **Free IT Review** — Short consultation to understand current systems, problems, risks and priorities.
2. **Practical Assessment** — Review business needs, existing tools, security concerns, processes and opportunities.
3. **Clear Recommendations** — Realistic recommendations based on business value, cost, risk and implementation effort.
4. **Implementation** — Build or improve required systems.
5. **Handover and Support** — Documentation, user guidance and follow-up support.

---

#### Task 15: Final CTA section

**Objective:** Build the closing call-to-action banner.

**Files:**
- Create: `src/components/sections/CTASection.astro`

**Design:** Full-width accent blue or dark navy background with white text. Centred headline + subheading + large CTA button.

**Content:**
- **Headline:** "Ready to improve your business IT?"
- **Subheading:** "Book a free 30-minute IT review to discuss your current systems, security risks, manual processes and opportunities for automation or AI."
- **Button:** "Book a free 30-minute IT review" → `/contact`

---

### Phase 4: Pages (Tasks 16–22)

#### Task 16: Assemble the homepage

**Objective:** Compose all sections into the homepage.

**Files:**
- Create: `src/pages/index.astro`

**Section order:**
1. Hero
2. TrustStatement
3. ServicesOverview
4. ProblemsSolved
5. AIReviewFeature
6. FeaturedSolutions
7. WhyWorkWithMe
8. Process
9. CTASection

Alternating backgrounds for visual rhythm:
- Hero: dark navy
- Trust: white
- Services: light grey
- Problems: dark navy
- AI Feature: accent gradient
- Solutions: white
- Why Me: light grey
- Process: dark navy
- CTA: accent blue

---

#### Task 17: Services page and individual service pages

**Objective:** Build services overview page + individual service pages with full copy.

**Files:**
- Create: `src/pages/services/index.astro` — Overview grid of all 6 services
- Create: `src/pages/services/[slug].astro` — Dynamic service page
- Create content MDs: `src/content/services/*.md` (6 files)

**Service page structure:**
- Title + headline
- Description paragraph
- "What's included" bullet list
- Business outcome statement
- CTA: "Discuss this service" → `/contact`

**Content collection schema:** title, headline, description, websiteCopy, servicesIncluded (array), businessOutcome, icon, slug.

---

#### Task 18: AI Opportunity Review page

**Objective:** Build dedicated AI Review page with detailed content.

**Files:**
- Create: `src/pages/ai-review.astro`

**Sections:**
1. Page hero: "AI Opportunity Review for SMEs"
2. Subtitle + intro copy
3. What the review covers (bullet list with icons)
4. Deliverables (checklist with green checkmarks)
5. CTA: "Book an AI Opportunity Review"

---

#### Task 19: About page

**Objective:** Build the About page with consultant positioning.

**Files:**
- Create: `src/pages/about.astro`

**Sections:**
1. Hero: "Senior IT expertise for SMEs"
2. About copy (from instruction doc)
3. Key strengths grid
4. Process overview (condensed)
5. CTA

---

#### Task 20: Contact page with form

**Objective:** Build the contact page with a booking form.

**Files:**
- Create: `src/pages/contact.astro`
- Create: `src/components/ui/ContactForm.astro`

**Form fields:**
- Name (required)
- Company
- Email (required)
- Phone
- Area of Interest (select dropdown): Microsoft 365, Cybersecurity, Automation, AI Opportunity Review, AI Document Management, Website, General IT Review
- Message (textarea)

**Form handling:** Static form — can use a service like Formspree, Netlify Forms, or Web3Forms. Include `id` attribute for service-specific integration. Add basic client-side validation.

**Note:** Add a comment/TODO in the component noting the form endpoint needs to be configured.

---

#### Task 21: 404 page

**Objective:** Custom 404 page matching brand.

**Files:**
- Create: `src/pages/404.astro`

**Content:** "Page not found" + link back to Home and Services.

---

#### Task 22: Sitemap and robots.txt

**Objective:** Auto-generate sitemap.xml and robots.txt for SEO.

**Files:**
- Integrate: `@astrojs/sitemap` package
- Update: `astro.config.mjs` to add sitemap integration
- Create: `public/robots.txt`

```bash
npm install @astrojs/sitemap
```

---

### Phase 5: Polish & Launch Prep (Tasks 23–26)

#### Task 23: Responsive design audit

**Objective:** Review and refine all pages for mobile, tablet, and desktop.

- Test all layouts at 375px, 768px, 1024px, 1440px
- Ensure touch targets are 44px minimum on mobile
- Verify text readability at all breakpoints
- Test navigation menu on mobile
- Check image/SVG scaling

---

#### Task 24: Accessibility check

**Objective:** Ensure WCAG 2.1 AA compliance.

- All images have `alt` text
- Form labels associated with inputs
- Colour contrast ratios meet 4.5:1 minimum
- Focus indicators visible
- Skip-to-content link works
- Keyboard navigation through all interactive elements
- ARIA labels on icon-only buttons
- Heading hierarchy (h1 → h2 → h3) correct

---

#### Task 25: Performance optimisation

**Objective:** Ensure fast load times and good Core Web Vitals.

- Astro produces static HTML — already fast
- Verify no render-blocking resources
- Inline critical CSS
- Preload fonts
- Check image sizes (SVGs only — already lightweight)
- Run `astro build` and verify output size

---

#### Task 26: Build, test, and preview

**Objective:** Final build and local preview verification.

```bash
npm run build
npm run preview
```

Verify:
- All pages render correctly
- All links work (internal and anchor)
- Navigation functions on mobile and desktop
- Contact form validation works
- Sitemap generates correctly
- Meta tags are correct per page
- Open Graph tags render on social scrapers

---

## Risks & Open Decisions

| Decision | Options | Recommendation |
|----------|---------|----------------|
| Brand name | — | **MSOIT — Making Sense of IT** (decided) |
| Form handler | Formspree, Netlify Forms, Web3Forms | Decide at deploy time — use generic POST endpoint |
| Hosting | — | **Railway** (decided) — add `Dockerfile` or Node adapter for SSR/static serving |
| Stock imagery | None vs abstract illustrations | **None** — SVG patterns only (per instructions) |
| Logo design | Text-only vs icon+text vs SVG generation | Start with text-only wordmark, upgrade later |
| Real AI review page CTA | Cal.com vs Calendly vs simple form | Simple form for now, embed calendar widget later |

## Content Checklist (all copy from instruction doc)

- [x] Home — Hero copy ✓
- [x] Home — Trust statement ✓
- [x] Home — Services section ✓
- [x] Home — Problems solved ✓
- [x] Home — AI Review feature ✓
- [x] Home — Featured solutions ✓
- [x] Home — Why work with me ✓
- [x] Home — Process ✓
- [x] Home — Final CTA ✓
- [x] Services page intro ✓
- [x] 6 service detail pages ✓
- [x] AI Review page ✓
- [x] About page ✓
- [x] Contact page ✓
- [x] Meta titles + descriptions ✓
- [x] SEO keywords list ✓

---

## Execution Order Summary

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| 1. Setup | 1–3 | 15 min |
| 2. UI Components | 4–6 | 20 min |
| 3. Homepage Sections | 7–15 | 40 min |
| 4. Pages | 16–22 | 35 min |
| 5. Polish | 23–26 | 20 min |
| **Total** | **26 tasks** | **~2 hours** |
