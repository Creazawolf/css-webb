# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Chelsea Supporters Sweden (CSS) website built with **Next.js 16 + Payload CMS 3 + Neon Postgres**, deployed on Vercel (Stockholm/arn1 region). Swedish-language football supporter club site with CMS-managed content.

The site is replacing the club's section on SvenskaFans, so the information architecture deliberately mirrors what members already know from there (Löpsedel, Artiklar, Matcher, Medlem, Biljetter, Arenaguide, Reseguide, Podden, FPL, Mötesplatser, Redaktionen). The forum ("The Shed") still lives on SvenskaFans and is linked out via `SiteSettings.forumUrl`.

## Commands

```bash
pnpm dev              # Dev server (port 3000)
pnpm build            # Production build (importmap → migrate → next build)
pnpm lint             # ESLint (flat config)
pnpm typecheck        # tsc --noEmit
pnpm seed             # Idempotent starting content: settings, menu, categories, fixed pages
pnpm seed:news        # Demo articles with placeholder images — local only
pnpm payload:types    # Regenerate Payload TypeScript types
pnpm payload:migrate  # Run database migrations
pnpm payload:migrate:create  # Generate a migration (interactive)
```

Package manager is **pnpm** (v10.4.1). Types auto-generate on `pnpm install` via postinstall hook.

## Architecture

### Route Groups

- `app/(frontend)/[locale]/` — Public website with i18n routing (`sv` default, `en` secondary)
- `app/(payload)/admin/` — Payload CMS admin panel (no locale prefix)
- `app/(payload)/api/` — Payload auto-generated REST API

### Routes

| Path | Source |
| --- | --- |
| `/[locale]` | Löpsedel — streaming modules |
| `/[locale]/artiklar` | Article list (paginated via `?sida=`) |
| `/[locale]/artiklar/typ/[type]` | Filtered by `articleType` |
| `/[locale]/artiklar/[slug]` | Article |
| `/[locale]/matcher{,/spelschema,/tabell}` | Chelsea FC:s eget match-API |
| `/[locale]/evenemang`, `/motesplatser`, `/redaktionen`, `/podden`, `/medlemskap`, `/kontakt` | Dedicated pages |
| `/[locale]/[slug]` | Any published `pages` doc (Om oss, Biljetter, Arenaguide, Reseguide, FPL) |

`/nyheter` redirects to `/artiklar` (see `next.config.ts`). Slugs with their own route are listed in `RESERVED_SLUGS` (`lib/pages.ts`) so the catch-all never shadows them.

### Proxy (`proxy.ts`)

Locale detection and redirect. Next 16 renamed the `middleware` convention to `proxy`. Skips `/admin`, `/api`, `/images`, static files and `/_next`; non-locale URLs redirect to `/sv`.

### Payload CMS (embedded in Next.js)

Payload runs inside the Next.js process via `withPayload()`. Config at `payload.config.ts`.

**Collections:** Users, Media, Categories, Posts, Matches, Events, Venues, Members, Pages
**Globals:** SiteSettings, Navigation

`sharp` **must** stay passed into `buildConfig` — without it no image sizes are generated, and the frontend reads `sizes.card` / `sizes.og` everywhere.

Admin UI runs in Swedish (`i18n.supportedLanguages`), collections are grouped (Innehåll / Föreningen / Matcher / Inställningar), and Posts, Pages and Events use drafts with autosave, so published state lives in `_status`, not a custom `status` field.

**Access control** patterns are in `payload/collections/_shared.ts`:
- `isAdmin` / `isAdminOrEditor` — role guards; `isAdminField` for field-level access
- `readPublishedOrPrivileged` — public sees only `_status: published`, editors see all

### Editor experience

Publishing an article requires only **rubrik** and **artikeltext**. Everything else is derived and overridable:
- slug from the title (`slugField`)
- excerpt from the first paragraph (`richTextToPlainText` + `truncateAtWord`)
- author from the logged-in user (`defaultToCurrentUser`)
- `publishedAt` on first publish; SEO falls back to title/excerpt at render time

Editors can upload media and create categories — don't tighten those back to admin-only, or they can't illustrate their own posts.

### Data Fetching

- **Server Components** use the Payload Local API (in-process, no HTTP hop). The sitemap does too — don't fetch the site's own REST API from within the app.
- **External data** lives in `lib/`: `chelsea-matches.ts`, `chelsea-news.ts`, `spotify.ts`, `svenskafans.ts`. Each throws on failure; the calling module catches and renders without itself.

### Caching

Every page sets `export const revalidate`. Slow modules are wrapped in `<Suspense>` with skeletons from `components/Skeletons.tsx` so the shell ships immediately. External fetches carry their own `next.revalidate`.

Payload `afterChange` hooks (`payload/hooks/revalidate.ts`) purge the affected paths on publish, so editors see changes at once. Those helpers must stay no-ops outside a request context — `revalidatePath` throws in scripts and jobs.

### External integrations

- **Chelsea FC match data** — `chelseafc.com/en/api/fixtures/{upcoming,results,league-table}`, keyed by the `pageId` of the club's own Fixtures & Results pages (men `30EGwHPO9uwBCc75RQY6kg`, women `NFFa1rMz6sNIHsRi7Hbpb`). No key, no quota, and the WSL coverage that paid tiers of the general football APIs charge for. `seasonId` is optional — leave it out and the API always answers for the current season, so nothing needs touching between seasons. Endpoints were read out of the club's own bundle (`/assets/<version>/main.js`).
  The `results` feed lags: on 4 Sept 2026 it still omitted the 30 Aug win over Brighton, which the league table already counted. `lib/chelsea-matches.ts` therefore also parses the `data-props` blob on `chelseafc.com/en`, which carries the true last and next match per team, and merges the two. Don't drop that merge — the match centre goes stale without it.
- **Chelsea FC news** — the official listing API at `chelseafc.com/en/api/news/listing/<id>`, discovered from the `data-props` payload on `/en/news`. No key needed. Images go through Chelsea's Cloudinary with `c_fill,q_auto,f_auto`, which takes a 1 MB original down to ~40 kB. We show headline, category and image only, and always link out.
- **Spotify** (`SPOTIFY_CLIENT_ID` / `SECRET`) — ChelseaPodden episodes.
- **SvenskaFans RSS** — legacy archive, off by default (`SiteSettings.showSvenskaFans`). The feed 403s without a browser-like User-Agent.

### Styling

Tailwind CSS 4 via PostCSS. Design tokens in `app/globals.css`.

**Base element styles must stay inside `@layer base`.** Tailwind 4 puts utilities in the `utilities` layer, and unlayered CSS beats layered CSS regardless of specificity — an unlayered `a { color: inherit }` silently overrides every `text-*` utility on links.

Motion lives in `globals.css` behind one easing curve and three durations, and is disabled wholesale under `prefers-reduced-motion`. `components/Reveal.tsx` animates content in on scroll; content is visible by default and only hidden once `html[data-js='on']` is set, so nothing depends on JS to be readable.

### Components

All in `/components/`. Server Components by default — only NavBar, MatchCenter, NextMatchBar, MembershipForm, Reveal, Schedule, FullTable and SvenskaFansSlider are client components.

### i18n

Locale segment `[locale]` in URL path. Swedish slugify in `lib/slugify.ts` (å→a, ä→a, ö→o). Payload localization enabled with fallback.

### TypeScript

Strict mode with `exactOptionalPropertyTypes`, so pass `...(x ? { k: x } : {})` rather than `k: x ?? undefined`. Path aliases: `@/*`, `@/app/*`, `@/components/*`, `@/lib/*`, `@/payload/*`, `@payload-config`.

### SEO

Dynamic sitemap (`app/sitemap.ts`), robots.txt, per-page metadata. Posts and Pages have optional SEO fields that fall back to title/excerpt.

## Key Patterns

- Membership applications write through a server action (`medlemskap/actions.ts`) using `overrideAccess` after validation — `members` stays admin-only so the REST API can't be written to. It answers identically for known addresses so it can't be used to probe the register.
- Media generates 3 sizes: thumbnail (400x300), card (800x600), og (1200x630)
- Members collection is GDPR-minimal — no personnummer or sensitive data
- Local uploads land in `/media` and are gitignored; production uses Vercel Blob
- Vercel deployment has 60s timeout for API routes, 15s for frontend
