# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chelsea Supporters Sweden (CSS) website built with **Next.js 16 + Payload CMS 3 + Neon Postgres**, deployed on Vercel (Stockholm/arn1 region). Swedish-language football supporter club site with CMS-managed content.

## Commands

```bash
pnpm dev              # Start dev server (port 3000)
pnpm build            # Production build (generates Payload importmap + types first)
pnpm lint             # ESLint
pnpm typecheck        # TypeScript strict check (tsc --noEmit)
pnpm payload:types    # Regenerate Payload TypeScript types
pnpm payload:migrate  # Run database migrations
```

Package manager is **pnpm** (v10.4.1). Types auto-generate on `pnpm install` via postinstall hook.

## Architecture

### Route Groups

- `app/(frontend)/[locale]/` — Public website with i18n routing (`sv` default, `en` secondary)
- `app/(payload)/admin/` — Payload CMS admin panel (no locale prefix)
- `app/(payload)/api/` — Payload auto-generated REST API

### Middleware (`middleware.ts`)

Handles locale detection and redirect. Skips `/admin`, `/api`, `/images`, static files, and `/_next`. Non-locale URLs redirect to `/sv`.

### Payload CMS (embedded in Next.js)

Payload runs inside the Next.js process via `withPayload()` in `next.config.ts`. Config lives at `payload.config.ts`.

**Collections:** Users, Media, Posts, Matches, Events, Categories, Pages, Members

**Globals:** SiteSettings, Navigation

**Access control** patterns are in `payload/collections/_shared.ts`:
- `isAdmin` / `isAdminOrEditor` — role-based guards
- `readPublishedOrPrivileged` — public sees only `status: published`, editors see all

### Data Fetching

- **Server Components** use Payload Local API (in-process, no HTTP hop)
- **External integrations** use REST API at `/api/*`
- Frontend pages are currently placeholder content, not yet wired to CMS

### Styling

Tailwind CSS 4 via PostCSS (`postcss.config.mjs`). Design tokens in `app/globals.css` as CSS custom properties:
- Chelsea Blue: `#034694`, Gold: `#D4A843`
- Extended brand color scale (50–900) in `tailwind.config.ts`
- Font: Inter (via `next/font/google`)

### Components

All in `/components/`. Server Components by default; only NavBar mobile menu uses client-side state. Hardcoded navigation array in NavBar (not yet connected to Payload Navigation global).

### i18n

Locale segment `[locale]` in URL path. Swedish slugify utility in `lib/slugify.ts` handles å→a, ä→a, ö→o. Payload has localization enabled with fallback.

### TypeScript

Strict mode with path aliases: `@/*`, `@/app/*`, `@/components/*`, `@/lib/*`, `@/payload/*`, `@payload-config`.

### SEO

Dynamic sitemap (`app/sitemap.ts`), robots.txt (`app/robots.ts`), metadata API. Posts/Pages have SEO fields (metaTitle, metaDescription, ogImage).

## Key Patterns

- Slug fields auto-generate from title via `beforeValidate` hooks (see `_shared.ts`)
- Posts/Pages use draft/published status with `publishedAt` auto-set on publish
- Media generates 3 image sizes: thumbnail (400x300), card (800x600), og (1200x630)
- Members collection is GDPR-minimal (no personnummer or sensitive data)
- Vercel deployment has 60s timeout for API routes, 15s for frontend
