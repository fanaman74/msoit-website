# Pricing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a standalone `/pricing` page showing website development pricing (€3,800 one-off / €25/month hosting), linked from the Websites section on `/services`.

**Architecture:** New `src/pages/pricing.astro` using the existing `Layout` component and design system (border-based, orange accent `#ff4f00`, bold type). Two side-by-side pricing cards with a custom-work note and CTA strip. A "View pricing" link is added to the websites service entry in `src/pages/services.astro`.

**Tech Stack:** Astro SSR, Tailwind CSS v4, existing layout/component patterns.

---

### Task 1: Create the pricing page

**Files:**
- Create: `src/pages/pricing.astro`

- [ ] **Step 1: Create `src/pages/pricing.astro`** with this exact content:

```astro
---
import Layout from '../layouts/Layout.astro';
import Button from '../components/ui/Button.astro';
---

<Layout
  title="Website Pricing | MSOIT — Belgian SME IT Services"
  description="Clear website pricing for Belgian SMEs. One-off project fee from €3,800 for a 5-page professional website, plus optional €25/month hosting and maintenance."
  keywords={['website pricing Belgium', 'SME website cost Belgium', 'professional website Belgium', 'MSOIT website']}
>
  <!-- Hero -->
  <section class="section-shell relative bg-white py-20">
    <div class="surface-line pointer-events-none absolute inset-0" aria-hidden="true"></div>
    <div class="relative mx-auto max-w-7xl px-6" data-reveal>
      <div class="mb-8 inline-flex items-center gap-3 border border-[#111111] bg-white px-4 py-2 text-sm font-bold text-[#111111]">
        <span class="h-2.5 w-2.5 bg-accent"></span>
        WEBSITES & DIGITAL PRESENCE
      </div>
      <h1 class="text-balance max-w-3xl text-6xl font-bold leading-[0.88] text-[#111111] sm:text-8xl">
        Website pricing for Belgian SMEs.
      </h1>
      <p class="mt-8 max-w-2xl text-lg leading-8 text-[#444444]">
        A fixed project fee covering design, build and launch. Optional monthly hosting and maintenance to keep everything running smoothly.
      </p>
    </div>
  </section>

  <!-- Pricing cards -->
  <section class="section-shell bg-surface py-20">
    <div class="relative mx-auto max-w-7xl px-6">
      <div class="grid gap-6 lg:grid-cols-2" data-reveal>

        <!-- Card 1: Project fee -->
        <div class="border border-[#111111] bg-white p-8">
          <p class="mb-2 text-xs font-bold uppercase tracking-widest text-[#111111]">Website Project</p>
          <div class="mt-4 flex items-end gap-2">
            <span class="text-6xl font-bold leading-none text-[#111111]">€3,800</span>
          </div>
          <p class="mt-2 text-sm text-[#555555]">one-off · 5 pages minimum</p>

          <ul class="mt-8 space-y-3 border-t border-[#eeeeee] pt-8">
            {[
              'Up to 5 pages',
              'SEO-ready structure',
              'Contact form',
              'Mobile responsive',
            ].map((item) => (
              <li class="flex items-start gap-3 text-sm text-[#444444]">
                <span class="mt-1.5 h-2 w-2 flex-shrink-0 bg-accent"></span>
                {item}
              </li>
            ))}
          </ul>

          <div class="mt-8">
            <Button href="/contact" variant="primary" size="lg">Discuss your project</Button>
          </div>
        </div>

        <!-- Card 2: Hosting -->
        <div class="relative border border-[#111111] bg-white p-8">
          <div class="absolute -top-3 left-6 bg-accent px-3 py-1 text-xs font-bold text-[#111111]">ADD-ON</div>
          <p class="mb-2 text-xs font-bold uppercase tracking-widest text-[#111111]">Hosting & Maintenance</p>
          <div class="mt-4 flex items-end gap-2">
            <span class="text-6xl font-bold leading-none text-[#111111]">€25</span>
            <span class="mb-2 text-lg text-[#555555]">/month</span>
          </div>
          <p class="mt-2 text-sm text-[#555555]">optional · cancel anytime</p>

          <ul class="mt-8 space-y-3 border-t border-[#eeeeee] pt-8">
            {[
              'Managed hosting',
              'Security updates',
              'General maintenance',
              'Monthly check-in',
            ].map((item) => (
              <li class="flex items-start gap-3 text-sm text-[#444444]">
                <span class="mt-1.5 h-2 w-2 flex-shrink-0 bg-accent"></span>
                {item}
              </li>
            ))}
          </ul>

          <div class="mt-8">
            <Button href="/contact" variant="secondary" size="lg">Add hosting</Button>
          </div>
        </div>
      </div>

      <!-- Custom work note -->
      <div class="mt-6 flex flex-col items-start justify-between gap-4 border border-[#111111] bg-white p-6 sm:flex-row sm:items-center" data-reveal>
        <p class="text-sm text-[#444444]">
          <strong class="text-[#111111]">Need more pages or custom features?</strong>
          {' '}Additional pages and integrations are scoped per project.
        </p>
        <a href="/contact" class="flex-shrink-0 text-sm font-bold text-accent hover:underline">Get in touch →</a>
      </div>
    </div>
  </section>

  <!-- CTA strip -->
  <section class="bg-[#111111] py-16">
    <div class="mx-auto max-w-7xl px-6">
      <div class="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <h2 class="text-2xl font-bold text-white sm:text-3xl">Ready to get started?</h2>
          <p class="mt-2 text-[#aaaaaa]">Book a free 30-minute review to discuss your project.</p>
        </div>
        <Button href="/contact" variant="primary" size="lg">Book a free review</Button>
      </div>
    </div>
  </section>
</Layout>
```

- [ ] **Step 2: Verify the page builds** — run `npm run dev` (if not already running) and open `http://localhost:4322/pricing`. Confirm both cards render, the ADD-ON badge appears, and the CTA strip is dark.

- [ ] **Step 3: Commit**

```bash
git add src/pages/pricing.astro
git commit -m "Add /pricing page with website project and hosting cards"
```

---

### Task 2: Link from the Websites service on /services

**Files:**
- Modify: `src/pages/services.astro`

- [ ] **Step 1: Find the websites service article** — it has `id="websites"`. Add a "View pricing" link inside the article, after the `<ul>` of items. Open `src/pages/services.astro` and locate the `services.map()` block (around line 68). The article renders a `<ul>` of items. Add a conditional link after the `</ul>` close that only shows for the websites service:

Replace the `services.map()` render block — change:
```astro
        <ul class="grid gap-3 sm:grid-cols-2" data-stagger>
            {service.items.map((item) => (
              <li data-stagger-item class="flex items-start gap-3 border border-[#111111] bg-surface p-3 text-sm text-[#444444]">
                <span class="mt-1 h-2 w-2 flex-shrink-0 bg-accent"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
```

to:
```astro
        <ul class="grid gap-3 sm:grid-cols-2" data-stagger>
            {service.items.map((item) => (
              <li data-stagger-item class="flex items-start gap-3 border border-[#111111] bg-surface p-3 text-sm text-[#444444]">
                <span class="mt-1 h-2 w-2 flex-shrink-0 bg-accent"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {service.id === 'websites' && (
            <div class="mt-4">
              <a href="/pricing" class="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline">
                View website pricing →
              </a>
            </div>
          )}
```

- [ ] **Step 2: Verify** — open `http://localhost:4322/services`, scroll to the "Websites & Digital Presence" section, confirm the "View website pricing →" link appears and clicking it goes to `/pricing`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/services.astro
git commit -m "Link to /pricing from Websites service section"
```

---

### Task 3: Push

- [ ] **Step 1: Push both commits**

```bash
git push
```

Expected: both commits pushed to `main`, Railway redeploys automatically.
