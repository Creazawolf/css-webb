# CSS Webb Scaffold Task

You are setting up the Chelsea Supporters Sweden website project.

## What's already here
- `package.json` — dependencies defined
- `payload.config.ts` — Payload CMS config with collections
- `collections/` — 7 collection files + 2 globals + shared utils
- `lib/slugify.ts` — Swedish slug utility
- `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `vercel.json`, `.env.example`
- Design docs: `design-system.md`, `components.md`, `wireframes.md`, `handoff-spec.md`, `architecture.md`

## Your job
1. Create the Next.js App Router structure per `architecture.md`:
   - `app/(frontend)/[locale]/page.tsx` — Home page (placeholder with Chelsea blue hero)
   - `app/(frontend)/[locale]/layout.tsx` — Frontend layout with nav/footer
   - `app/(frontend)/[locale]/nyheter/page.tsx` — News list
   - `app/(frontend)/[locale]/nyheter/[slug]/page.tsx` — News article
   - `app/(frontend)/[locale]/matcher/page.tsx` — Matches
   - `app/(frontend)/[locale]/evenemang/page.tsx` — Events
   - `app/(frontend)/[locale]/medlemskap/page.tsx` — Membership info
   - `app/(frontend)/[locale]/om-oss/page.tsx` — About
   - `app/(frontend)/[locale]/kontakt/page.tsx` — Contact
   - `app/(payload)/admin/[[...segments]]/page.tsx` — Payload admin
   - `app/(payload)/api/[...slug]/route.ts` — Payload API
   - `app/layout.tsx` — Root layout
   - `app/sitemap.ts` — Dynamic sitemap
   - `app/robots.ts` — Robots.txt
2. Move `collections/` into proper project structure
3. Create `app/globals.css` with Tailwind imports + Chelsea blue theme
4. Run `pnpm install` 
5. Verify `pnpm typecheck` passes (fix any issues)
6. Create initial git commit with all files
7. Push to origin main

## Design tokens
Chelsea blue: #034694, Gold: #D4A843, see `design-system.md` for full palette.

## Important
- TypeScript strict mode
- All pages are Server Components by default
- Placeholder content is fine — just make sure the structure is right
- Swedish labels everywhere (this is a Swedish site)
- DON'T modify the .md documentation files
- DON'T create a new package.json — use the existing one
