# MSOIT Website

Professional IT consultancy website for MSOIT — Making Sense of IT.

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

## Deployment

This site is configured for deployment to **Railway**. The `package.json` includes build and start scripts that Railway will use automatically.

### Environment Variables

None required for the static site.

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

Tagline: Professional IT consultancy services for SMEs

## Color Scheme

- Primary Navy: `#0f172a` (navy-900)
- Accent Blue: `#2563eb` (accent)
- Success Green: `#10b981`

## Notes

- Contact form action needs to be configured (currently `#`)
- Replace placeholder content with actual MSOIT information
- Add real images to `public/images/`
- Consider adding a blog section in the future
