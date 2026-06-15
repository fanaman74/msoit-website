# MSOIT Website

Professional IT consultancy website for MSOIT — Making Sense of IT, focused on Belgium SME IT services.

## Tech Stack

- **Astro 5** - Static site generator
- **Tailwind CSS 4** - Utility-first styling
- **Lucide Icons** - Professional icon set
- **TypeScript** - Type safety

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.example` to `.env` for local development.

```bash
PUBLIC_SITE_URL=https://msoit.eu
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

- `PUBLIC_SITE_URL` controls canonical URLs and sitemap generation.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` store contact form leads in Supabase.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only. Do not expose it in client code.

## Lead Storage

Contact form submissions are stored in the `lead_submissions` Supabase table when the Supabase environment variables are configured. The schema is in:

```text
supabase/lead_submissions.sql
```

Run that SQL in the Supabase SQL editor before enabling production lead capture.

## Deployment

This site is configured for deployment to **Railway**. The `package.json` includes build and start scripts that Railway will use automatically.

### Docker Deployment

A `Dockerfile` is included for containerized deployment if needed.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── layouts/        # Page layouts
├── pages/          # Route pages
└── styles/         # Global styles

public/
└── images/         # Static assets
```

## Pages

- `/` - Homepage
- `/services` - Services overview
- `/ai-review` - AI Opportunity Review
- `/about` - About MSOIT
- `/contact` - Contact form

## Brand

**MSOIT** — Making Sense of IT

Tagline: Professional IT consultancy services for Belgian SMEs

## Color Scheme

- Primary Black: `#111111`
- Accent Orange: `#ff4f00`
- Surface: `#f7f7f8`

## Notes

- SEO metadata and structured data target Belgium SME IT services.
- Language toggle supports English, French and Dutch.
- Add real Open Graph imagery at `public/images/og-default.png`.
