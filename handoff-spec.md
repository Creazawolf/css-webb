# Chelsea Supporters Sweden — Handoff-specifikation

> Version 1.0 | 2026-02-22
> För utvecklare som implementerar designsystemet i Next.js 15 + Tailwind CSS 4

---

## 1. Spacing-regler

### Grundprinciper
- **4px-grid:** Allt spacing baseras på multiplar av 4px
- **Konsistens:** Använd Tailwind-tokens (`p-4`, `gap-6`) — aldrig godtyckliga pixelvärden
- **Vertikal rytm:** Sektioner separeras med konsekvent spacing

### Sektionsspacing
| Kontext | Mobile | Desktop | Tailwind |
|---------|--------|---------|----------|
| Mellan sektioner | 48px | 64px | `py-12 lg:py-16` |
| Sektion padding | 24px | 32px | `px-6 lg:px-8` |
| Hero padding-top | 80px | 96px | `pt-20 lg:pt-24` |
| Hero padding-bottom | 64px | 80px | `pb-16 lg:pb-20` |

### Komponentspacing
| Kontext | Värde | Tailwind |
|---------|-------|----------|
| Kort-padding | 16px (compact), 24px (default) | `p-4` / `p-6` |
| Gap mellan kort i grid | 16px (mobile), 24px (desktop) | `gap-4 lg:gap-6` |
| Rubrik → innehåll | 16px | `mb-4` |
| SectionHeader → grid | 32px | `mb-8` |
| Överrubrik → rubrik | 8px | `mb-2` |
| Rubrik → undertext | 12px | `mt-3` |
| Knapp inre spacing | 8px 16px (md), 12px 24px (lg) | `py-2 px-4` / `py-3 px-6` |
| Input padding | 8px 12px | `py-2 px-3` |
| Badge padding | 2px 8px | `py-0.5 px-2` |

### Container
```tsx
// Standardcontainer — använd överallt
<div className="mx-auto max-w-content px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

**Max-width:** `1200px` (`max-w-content` från tokens)
**Artikel:** `680px` (`max-w-article`) — för optimal läsbarhet (45–75 tecken/rad)

---

## 2. Responsiva breakpoints

### Mobile-first strategi
Skriv alltid mobile-styles som default, lägg till breakpoint-prefix för större skärmar.

```tsx
// ✅ Rätt (mobile-first)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

// ❌ Fel (desktop-first)
<div className="grid grid-cols-3 sm:grid-cols-2 grid-cols-1">
```

### Breakpoint-beteenden

| Breakpoint | Kolumner | Nav | Sidebar | Kort-layout |
|-----------|----------|-----|---------|-------------|
| < 640px | 1 | Hamburger | Dold | Stack |
| 640–767px | 2 | Hamburger | Dold | Grid 2-col |
| 768–1023px | 2 | Inline | Dold | Grid 2-col |
| 1024–1279px | 3 | Inline | Synlig | Grid 3-col |
| ≥ 1280px | 3 | Inline | Synlig | Grid 3-col, max-w |

### Layout-grid per sida
```
Startsida:     1-col full-width sektioner, inuti 1–3 col grids
Nyheter:       2/3 + 1/3 sidebar (lg+), 1-col (mobile)
Artikel:       2/3 + 1/3 sidebar (lg+), 1-col (mobile)
Matcher:       2/3 + 1/3 sidebar (lg+), tabs
Medlemskap:    1-col centrerad, max-w-3xl
Om oss:        1-col sektioner
Kontakt:       1/2 + 1/2 (lg+), 1-col (mobile)
```

### Sidebar-kolumn (desktop)
```tsx
// Sidebar layout (nyheter, matcher, artikel)
<div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
  <main>{/* Huvudinnehåll */}</main>
  <aside className="hidden lg:block space-y-6">
    {/* Populärt, MatchCard, MembershipCTA */}
  </aside>
</div>
```

---

## 3. Komponent-states

### Button

| State | Klass-tillägg | Visuellt |
|-------|--------------|----------|
| Default | — | Standard-stil per variant |
| Hover | `hover:` | Mörkare bakgrund, cursor pointer |
| Focus | `focus-visible:` | `ring-2 ring-chelsea-blue/20 ring-offset-2` |
| Active | `active:` | `scale-[0.98]` (subtil press) |
| Disabled | `disabled:` | `opacity-50 cursor-not-allowed` |
| Loading | JS-state | Spinner-ikon, `pointer-events-none` |

```tsx
// Primär knapp — fullständiga states
<button className="
  bg-chelsea-blue text-white font-semibold
  px-4 py-2 rounded-md
  transition-all duration-fast
  hover:bg-chelsea-blue-dark
  focus-visible:ring-2 focus-visible:ring-chelsea-blue/20 focus-visible:ring-offset-2
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
">

// Gold CTA — med glow
<button className="
  bg-gold text-chelsea-blue-dark font-bold
  px-6 py-3 rounded-md shadow-gold
  transition-all duration-fast
  hover:bg-gold-light hover:shadow-lg
  focus-visible:ring-2 focus-visible:ring-gold/30 focus-visible:ring-offset-2
  active:scale-[0.98]
">
```

### Card (NewsCard, EventCard, MatchCard)

| State | Beteende |
|-------|----------|
| Default | `bg-white border border-gray-200 rounded-lg shadow-sm` |
| Hover | `shadow-md border-chelsea-blue/20 -translate-y-0.5` |
| Focus-within | `ring-2 ring-chelsea-blue/10` (om kort har länk) |
| Active | — (navigerar) |

```tsx
<article className="
  bg-white border border-gray-200 rounded-lg shadow-sm
  overflow-hidden
  transition-all duration-base
  hover:shadow-md hover:border-chelsea-blue/20 hover:-translate-y-0.5
  focus-within:ring-2 focus-within:ring-chelsea-blue/10
">
```

### NavBar

| State | Beteende |
|-------|----------|
| Default | Solid `bg-chelsea-blue` |
| Transparent (hero) | `bg-transparent`, transition till solid vid scroll > 80px |
| Scroll-state | `bg-chelsea-blue/95 backdrop-blur-md shadow-lg` |
| Mobile open | Fullscreen overlay `bg-chelsea-blue-dark/95 backdrop-blur` |

```tsx
// Scroll-aware nav (Client Component)
const scrolled = useScrollPosition() > 80;

<nav className={cn(
  "fixed top-0 w-full z-sticky transition-all duration-slow",
  transparent && !scrolled
    ? "bg-transparent"
    : "bg-chelsea-blue/95 backdrop-blur-md shadow-lg"
)}>
```

### Input / Form fields

| State | Stil |
|-------|------|
| Default | `border-gray-200 bg-white` |
| Hover | `border-gray-300` |
| Focus | `border-chelsea-blue ring-2 ring-chelsea-blue/20` |
| Error | `border-error ring-2 ring-error/20` |
| Disabled | `bg-gray-50 text-gray-400 cursor-not-allowed` |

### Tab (filter, match-tabs)

| State | Stil |
|-------|------|
| Default | `text-gray-500 border-b-2 border-transparent` |
| Hover | `text-gray-700` |
| Active | `text-chelsea-blue border-chelsea-blue font-semibold` |

### MatchCard (live)

| State | Extra |
|-------|-------|
| Live | Röd puls-dot (`animate-pulse-live`), `border-match-live/30` |
| Upcoming + event | Guld-badge "Pubkväll" |
| Resultat: Vinst | Grön `bg-match-win/10` left-border |
| Resultat: Förlust | Röd `bg-match-loss/10` left-border |
| Resultat: Oavgjort | Gul `bg-match-draw/10` left-border |

---

## 4. Dark Mode-plan

### Strategi
**Fas 1 (launch):** Enbart light mode. Alla tokens förberedda för dark.
**Fas 2 (post-launch):** Dark mode via `class`-strategi (ej `prefers-color-scheme`).

### Implementering
```tsx
// tailwind.config — förberett
darkMode: 'class', // Aktivera i Fas 2

// Layout.tsx — förberett
<html className={isDark ? 'dark' : ''}>
```

### Dark mode-mappning

| Token (Light) | Token (Dark) | Beskrivning |
|--------------|-------------|-------------|
| `bg-white` | `dark:bg-gray-900` | Sidbakgrund |
| `bg-gray-50` | `dark:bg-gray-800` | Sektion-bakgrund |
| `bg-gray-100` | `dark:bg-gray-800` | Kort-bakgrund |
| `text-gray-900` | `dark:text-white` | Rubriker |
| `text-gray-700` | `dark:text-gray-200` | Brödtext |
| `text-gray-500` | `dark:text-gray-400` | Sekundär text |
| `border-gray-200` | `dark:border-gray-700` | Borders |
| `bg-chelsea-blue` | `dark:bg-chelsea-blue` | Primärfärg (oförändrad) |
| `bg-gold` | `dark:bg-gold` | Accent (oförändrad) |

### Dark mode-principer
1. **Chelsea-blå och guld ändras INTE** — varumärkesfärger ska vara konstanta
2. **Bakgrunder inverteras** — vit → mörk grå, ljus grå → mörkare grå
3. **Text inverteras** — mörk text → ljus text
4. **Shadows reduceras** — mörkare bakgrund kräver subtilare shadows
5. **Bilder** — ingen förändring, men container-bakgrund anpassas
6. **Kontrast:** Minst WCAG AA (4.5:1 för text, 3:1 för stora element)

### Dark shadows
```tsx
// Light
shadow: "0 1px 3px rgba(3, 70, 148, 0.08)"
// Dark
shadow: "0 1px 3px rgba(0, 0, 0, 0.3)"
```

### Förberedelse i kod
```tsx
// Skriv dark:-prefix direkt vid implementering
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

// Kort
<article className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">

// Knappar (primär = oförändrad)
<button className="bg-chelsea-blue text-white">

// Sekundär knapp
<button className="bg-white dark:bg-gray-800 text-chelsea-blue border-chelsea-blue">
```

---

## 5. Accessibility (A11y)

### Färgkontrast
| Kombination | Ratio | WCAG |
|------------|-------|------|
| `#034694` på `#FFFFFF` | 8.1:1 | AAA ✓ |
| `#FFFFFF` på `#034694` | 8.1:1 | AAA ✓ |
| `#D4A843` på `#022B5C` | 5.2:1 | AA ✓ |
| `#B8912E` på `#FFFFFF` | 3.8:1 | AA Large ✓ |
| `#334155` på `#FFFFFF` | 9.7:1 | AAA ✓ |
| `#64748B` på `#FFFFFF` | 4.6:1 | AA ✓ |

> **Notera:** `#D4A843` (gold) på vit bakgrund har ratio 2.5:1 — använd `gold-dark` (#B8912E) för text på ljus bakgrund, eller guld enbart för dekorativa element/ikoner.

### Krav
- **Focus-visible:** Alla interaktiva element måste ha synlig fokus-ring
- **Skip-link:** "Hoppa till innehåll" som första fokuserbara element
- **Alt-text:** Alla bilder ska ha meningsfull alt-text (Payload: `alt`-fält obligatoriskt)
- **Semantisk HTML:** `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`
- **Aria-labels:** Nav-toggle ("Öppna meny" / "Stäng meny"), sociala ikoner
- **Keyboard:** Alla funktioner nåbara med tangentbord
- **Reduced motion:** `motion-reduce:transition-none motion-reduce:animate-none`

```tsx
// Skip-link
<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-max
  focus:bg-gold focus:text-chelsea-blue-dark focus:px-4 focus:py-2 focus:rounded">
  Hoppa till innehåll
</a>
```

---

## 6. Bildhantering

### Next.js Image
```tsx
import Image from 'next/image';

// Standard — alltid använd next/image
<Image
  src={imageUrl}
  alt={altText}
  width={640}
  height={360}
  className="object-cover"
  placeholder="blur"
  blurDataURL={blurHash} // Payload genererar blur-hash
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
/>
```

### Payload CMS bildkonfiguration
```typescript
// collections/Media.ts
{
  slug: 'media',
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    imageSizes: [
      { name: 'thumbnail', width: 160, height: 160, fit: 'cover' },
      { name: 'card', width: 640, height: 360, fit: 'cover' },
      { name: 'featured', width: 1200, height: 600, fit: 'cover' },
      { name: 'hero', width: 1920, height: 1080, fit: 'cover' },
      { name: 'og', width: 1200, height: 630, fit: 'cover' },
    ],
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
}
```

---

## 7. SEO-specifikation

### Metadata per sida
```typescript
// Varje sida exporterar metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${pageTitle} | Chelsea Supporters Sweden`,
    description: metaDescription,
    openGraph: {
      title: pageTitle,
      description: metaDescription,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale: 'sv_SE',
      type: 'website', // eller 'article' för nyheter
    },
    twitter: {
      card: 'summary_large_image',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
```

### Structured Data
- **Organization** (hela sajten)
- **Article** (nyheter/blogginlägg)
- **Event** (evenemang)
- **BreadcrumbList** (alla sidor)
- **SportsEvent** (matcher — om möjligt)

### URL-struktur
| Sida | URL | SEO-titel format |
|------|-----|------------------|
| Startsida | `/` | Chelsea Supporters Sweden — Sveriges Chelsea-community |
| Nyheter | `/nyheter` | Nyheter \| Chelsea Supporters Sweden |
| Artikel | `/nyheter/[slug]` | [Rubrik] \| Chelsea Supporters Sweden |
| Matcher | `/matcher` | Matcher \| Chelsea Supporters Sweden |
| Evenemang | `/evenemang` | Evenemang \| Chelsea Supporters Sweden |
| Medlemskap | `/medlemskap` | Bli medlem \| Chelsea Supporters Sweden |
| Om oss | `/om-oss` | Om oss \| Chelsea Supporters Sweden |
| Kontakt | `/kontakt` | Kontakt \| Chelsea Supporters Sweden |

---

## 8. Komponentfilstruktur

```
src/
├── app/
│   ├── (frontend)/
│   │   ├── layout.tsx          # Root layout med NavBar + Footer
│   │   ├── page.tsx            # Startsida
│   │   ├── nyheter/
│   │   │   ├── page.tsx        # Nyhetslista
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Artikelvy
│   │   ├── matcher/
│   │   │   └── page.tsx        # Matcher (tabs)
│   │   ├── evenemang/
│   │   │   └── page.tsx
│   │   ├── medlemskap/
│   │   │   └── page.tsx
│   │   ├── om-oss/
│   │   │   ├── page.tsx
│   │   │   └── stadgar/
│   │   │       └── page.tsx
│   │   └── kontakt/
│   │       └── page.tsx
│   └── (payload)/              # Payload admin
│       └── admin/
│           └── [[...segments]]/
│               └── page.tsx
├── components/
│   ├── ui/                     # Bas-UI (Button, Input, Badge, Card)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   └── accordion.tsx
│   ├── layout/                 # Layout-komponenter
│   │   ├── nav-bar.tsx         # Server Component
│   │   ├── nav-mobile.tsx      # Client Component (hamburger)
│   │   ├── footer.tsx
│   │   ├── section.tsx
│   │   ├── section-header.tsx
│   │   └── container.tsx
│   ├── match/
│   │   ├── match-card.tsx
│   │   ├── match-list.tsx
│   │   ├── match-hero.tsx      # Client Component (countdown)
│   │   └── live-indicator.tsx  # Client Component (puls)
│   ├── news/
│   │   ├── news-card.tsx
│   │   ├── news-grid.tsx
│   │   ├── news-sidebar.tsx
│   │   └── article-body.tsx    # Rich text renderer
│   ├── events/
│   │   ├── event-card.tsx
│   │   └── event-list.tsx
│   ├── membership/
│   │   ├── membership-cta.tsx
│   │   ├── pricing-card.tsx
│   │   └── benefit-card.tsx
│   ├── player/
│   │   └── player-spotlight.tsx
│   └── shared/
│       ├── social-bar.tsx
│       ├── newsletter-form.tsx # Client Component
│       ├── share-buttons.tsx
│       ├── breadcrumbs.tsx
│       └── pagination.tsx
├── lib/
│   ├── utils.ts                # cn(), formatDate(), etc.
│   └── fonts.ts                # Inter via next/font/google
└── styles/
    └── globals.css             # Tailwind imports + custom props
```

---

## 9. Performance-budget

| Metrik | Mål | Notering |
|--------|-----|----------|
| LCP | < 2.5s | Hero-bild med blur placeholder |
| FID / INP | < 100ms | Minimal JS, RSC default |
| CLS | < 0.1 | Fasta bildstorlekar, font-display swap |
| Total JS (initial) | < 100KB gzipped | Bara Client Components |
| First Load | < 80KB shared | next/font eliminerar FOUT |

### Optimeringar
1. **Server Components som default** — klient bara för interaktivitet
2. **next/image** med sizes-attribut för responsiv serving
3. **next/font** med `Inter` subsettad till latin
4. **ISR** (Incremental Static Regeneration) för nyheter och matcher
5. **Streaming** med Suspense boundaries per sektion
6. **Lazy-load** under fold (EventCard, PlayerSpotlight, SocialBar)

---

## 10. Implementeringsordning

### Sprint 1 — Fundament (v1–2)
1. Tailwind-konfiguration med tokens
2. Bas-UI: Button, Input, Badge, Card
3. Layout: NavBar, Footer, Container, Section
4. Fonts + globala stilar

### Sprint 2 — Startsidan (v3–4)
5. Hero (variant: home + page)
6. MatchCard (alla varianter)
7. NewsCard (featured + default)
8. MembershipCTA (banner + sticky)
9. Startsida sammansatt

### Sprint 3 — Innehållssidor (v5–6)
10. Nyheter (lista + filter + pagination)
11. Artikelvy (rich text + sidebar + relaterade)
12. Matcher (tabs + filter)
13. EventCard + eventlista

### Sprint 4 — Resterande (v7–8)
14. Medlemskap (benefits + pricing + FAQ)
15. Om oss (historia + styrelse + stats)
16. Kontakt (formulär + validation)
17. PlayerSpotlight
18. SEO: metadata, structured data, sitemap
19. Dark mode (om tid finns)

---

## 11. Tekniska beslut

| Beslut | Val | Motivering |
|--------|-----|-----------|
| CSS-ramverk | Tailwind CSS 4 | Utility-first, tree-shaking, tokens |
| Ikoner | Lucide React | Tree-shakeable, konsistent, MIT |
| Formulär | React Hook Form + Zod | Validering, DX, RSC-kompatibel |
| Animation | CSS transitions + Tailwind | Ingen extra bundle, GPU-optimerad |
| Rich text | Payload lexical → React | Inbyggt i Payload 3 |
| State | URL params + React state | Minimal klient-state |
| Datum | date-fns (sv locale) | Lättviktig, tree-shakeable |
| cn() | clsx + tailwind-merge | Klassnamn-sammanslagning |
