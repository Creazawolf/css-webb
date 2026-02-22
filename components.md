# Chelsea Supporters Sweden — Komponentbibliotek

> Version 1.0 | 2026-02-22
> Alla komponenter är React Server Components (RSC) om inte annat anges.

---

## 1. NavBar

### Beskrivning
Sticky navigation med Chelsea-blå bakgrund. Transparent på hero, solid vid scroll.

### Struktur
```
┌─────────────────────────────────────────────────────────┐
│ [Logo]  Nyheter  Matcher  Evenemang  Om oss  [Bli medlem] │ ← desktop
│ [Logo]                              [🍔]                │ ← mobile
└─────────────────────────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `transparent` | boolean | false | Transparent bakgrund (hero-sidor) |
| `activeItem` | string | — | Aktiv nav-item |

### Varianter
- **Default:** `bg-chelsea-blue` med vit text
- **Transparent:** Genomskinlig, blir solid vid scroll (>80px)
- **Mobile:** Hamburger-meny, fullscreen overlay med `bg-chelsea-blue-dark`

### Beteende
- Sticky (`position: sticky; top: 0`)
- Scroll-trigger: `transparent → solid` vid 80px scroll
- Mobile meny: Slide-in från höger, 300ms
- CTA-knapp "Bli medlem" alltid synlig (guld accent)
- Visar live match-score som badge vid pågående match (Client Component)

### Specifikation
```
Höjd: 64px (mobile), 72px (desktop)
Logo: 40px höjd
Nav-items: text-sm font-medium, gap-8
CTA: bg-gold text-chelsea-blue-dark rounded-md px-4 py-2
Hamburger: 24px ikon, 44px touch-target
Z-index: z-sticky (30)
```

### States
| State | Stil |
|-------|------|
| Default | Vit text, ingen underline |
| Hover | text-gold, transition-fast |
| Active | text-gold, border-b-2 border-gold |
| Mobile open | Overlay bg-chelsea-blue-dark/95, backdrop-blur |

---

## 2. Hero

### Beskrivning
Fullbredd hero-sektion med bakgrundsbild, overlay och CTA. Startsidans hero lyfter nästa match.

### Varianter

#### A: Startsida (med matchfokus)
```
┌───────────────────────────────────────────────┐
│ ░░░░░░░░░░░ [bakgrundsbild] ░░░░░░░░░░░░░░░ │
│ ░                                           ░ │
│ ░  CHELSEA SUPPORTERS SWEDEN               ░ │
│ ░  Nästa match                              ░ │
│ ░  ┌─────────────────────────────┐          ░ │
│ ░  │ 🏟 Chelsea vs Arsenal       │          ░ │
│ ░  │ Lör 15 mars · 18:30        │          ░ │
│ ░  │ Premier League              │          ░ │
│ ░  │ [Se var vi kollar]          │          ░ │
│ ░  └─────────────────────────────┘          ░ │
│ ░                                           ░ │
│ ░  [Bli medlem]  [Senaste nytt →]           ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└───────────────────────────────────────────────┘
```

#### B: Undersida (enkel)
```
┌───────────────────────────────────────────────┐
│ ░░░ [bakgrundsbild/gradient] ░░░░░░░░░░░░░░░ │
│ ░  Sidtitel                                 ░ │
│ ░  Kort beskrivning                         ░ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└───────────────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `variant` | 'home' \| 'page' | 'page' | Hero-variant |
| `title` | string | — | Huvudrubrik |
| `subtitle` | string | — | Undertext |
| `backgroundImage` | Image | — | Bakgrundsbild |
| `nextMatch` | Match | null | Nästa match (variant home) |
| `cta` | { label, href }[] | — | CTA-knappar |

### Specifikation
```
Höjd: min-h-[500px] (mobile), min-h-[600px] (desktop)
Undersida: min-h-[300px] (mobile), min-h-[350px] (desktop)
Overlay: bg-gradient-to-r from-chelsea-blue-dark/80 to-chelsea-blue/40
Padding: pt-32 pb-16 (inklusive nav-utrymme)
Max-width titel: max-w-3xl
Match-kort i hero: bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20
```

---

## 3. MatchCard

### Beskrivning
Visar en match — kommande, pågående (live) eller spelad. Central komponent.

### Varianter

#### Kommande match
```
┌─────────────────────────────────────┐
│ Premier League                      │
│                                     │
│ [CFC logo]  Chelsea     [Tid]      │
│       vs                            │
│ [ARS logo]  Arsenal     18:30      │
│                                     │
│ Lördag 15 mars · Stamford Bridge   │
│ [Se var vi kollar →]               │
└─────────────────────────────────────┘
```

#### Live match (Client Component)
```
┌─────────────────────────────────────┐
│ 🔴 LIVE · Premier League           │
│                                     │
│ [CFC logo]  Chelsea       2        │
│       vs                            │
│ [ARS logo]  Arsenal       1        │
│                                     │
│ ⏱ 67'                              │
└─────────────────────────────────────┘
```

#### Spelad match
```
┌─────────────────────────────────────┐
│ Premier League · 8 mars             │
│                                     │
│ [CFC logo]  Chelsea       3   ✓    │
│       vs                            │
│ [MNU logo]  Man Utd       1        │
│                                     │
│ [Matchrapport →]                    │
└─────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `match` | Match | — | Matchdata (lag, tid, resultat, tävling) |
| `variant` | 'upcoming' \| 'live' \| 'result' | auto | Beräknas från matchdata |
| `size` | 'compact' \| 'default' \| 'featured' | 'default' | Storlek |
| `showEvent` | boolean | true | Visa pub/event-länk |

### Match-typ
```typescript
interface Match {
  id: string;
  homeTeam: { name: string; logo: Image; };
  awayTeam: { name: string; logo: Image; };
  date: string; // ISO
  competition: string;
  venue?: string;
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'live' | 'finished';
  minute?: number;
  eventLink?: string; // Länk till pubkväll/event
}
```

### Specifikation
```
Bakgrund: bg-white (light) / bg-gray-100 (featured)
Border: border border-gray-200, rounded-lg
Padding: p-4 (compact), p-6 (default), p-8 (featured)
Logo: 32px (compact), 48px (default), 64px (featured)
Resultat-siffror: text-3xl font-bold
Live-puls: 8px cirkel, animation-pulse, bg-error
Hover: shadow-md, translateY(-2px)
Resultat-badge: bg-match-win/draw/loss, text-white, rounded-sm, px-2 py-0.5
```

---

## 4. NewsCard

### Beskrivning
Kort för nyheter och blogginlägg. Viktig för SEO-trafik.

### Varianter

#### Featured (stor)
```
┌───────────────────────────────────────┐
│ ┌─────────────────────────────────┐   │
│ │         [Bild 16:9]            │   │
│ └─────────────────────────────────┘   │
│                                       │
│ NYHETER · 12 mars 2026               │
│ Chelsea-fansen i Sverige reagerar    │
│ på transferryktet                     │
│                                       │
│ Kort ingress med 2–3 rader text...   │
│                                       │
│ Läs mer →                            │
└───────────────────────────────────────┘
```

#### Standard (lista)
```
┌───────────────────────────────────────┐
│ [Bild]  NYHETER · 10 mar             │
│ [thumb] Rubrik på artikeln            │
│ [80px]  Kort ingress...   [Läs mer →]│
└───────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `article` | Article | — | Artikeldata |
| `variant` | 'featured' \| 'default' \| 'compact' | 'default' | Layout |
| `showImage` | boolean | true | Visa thumbnail |
| `showExcerpt` | boolean | true | Visa ingress |

### Specifikation
```
Featured:
  Bild: aspect-video, rounded-xl, overflow-hidden
  Kategori: text-xs uppercase tracking-wide text-gold font-semibold
  Rubrik: text-2xl font-bold text-gray-900, hover:text-chelsea-blue
  Ingress: text-base text-gray-500, line-clamp-3
  Datum: text-sm text-gray-500
  Länk: text-chelsea-blue font-medium, hover:underline

Standard:
  Thumbnail: 80px × 80px (mobile), 120px × 80px (desktop), rounded-md
  Rubrik: text-lg font-semibold, line-clamp-2
  Gap: gap-4

Compact (sidebar):
  Ingen bild, rubrik + datum, text-sm
```

---

## 5. MembershipCTA

### Beskrivning
Call-to-action för medlemskap. Ska synas på varje sida utan att vara påträngande.

### Varianter

#### Banner (inline i content)
```
┌─────────────────────────────────────────────┐
│  ⭐ Bli medlem i CSS                        │
│                                              │
│  Gå med i Sveriges största Chelsea-community │
│  — pubkvällar, resor och gemenskap.          │
│                                              │
│  [Bli medlem →]  Redan medlem? Logga in      │
└─────────────────────────────────────────────┘
```

#### Sticky bar (botten, mobile)
```
┌─────────────────────────────────────────────┐
│  Bli medlem i CSS    [Bli medlem →]          │
└─────────────────────────────────────────────┘
```

#### Sidebar widget
```
┌──────────────────┐
│ BLI MEDLEM       │
│                  │
│ 🎫 Pubkvällar    │
│ ✈️ Matchresor     │
│ 👕 Rabatter       │
│ 🤝 Gemenskap      │
│                  │
│ [Gå med nu →]   │
│ Från 200 kr/år   │
└──────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `variant` | 'banner' \| 'sticky' \| 'sidebar' \| 'inline' | 'banner' | Layout |
| `showPrice` | boolean | false | Visa pris |
| `dismissible` | boolean | true | Sticky: kan stängas |

### Specifikation
```
Banner:
  bg-gradient-to-r from-chelsea-blue to-chelsea-blue-dark
  text-white, rounded-xl, p-8
  CTA-knapp: bg-gold text-chelsea-blue-dark font-bold rounded-md px-6 py-3
  Knapp-shadow: shadow-gold
  Border: border border-gold/20

Sticky:
  fixed bottom-0 left-0 right-0
  bg-chelsea-blue, py-3 px-4
  Z-index: z-sticky (30)
  Visas efter 50% scroll, döljs om dismissed (cookie 7d)
  Slide-up animation, 300ms

Sidebar:
  bg-gray-50 border border-gray-200 rounded-lg p-6
  Ikoner: text-gold
```

---

## 6. Footer

### Beskrivning
Informativ footer med länkar, sociala medier och nyhetsbrev.

### Struktur
```
┌─────────────────────────────────────────────────────────┐
│ ░░░ bg-chelsea-blue-dark ░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                         │
│  [Logo]                                                 │
│  Chelsea Supporters Sweden                              │
│  — Grundat 2003                                        │
│                                                         │
│  FÖRENINGEN     MATCHER        FÖLJ OSS                │
│  Om CSS         Kommande       Instagram ↗             │
│  Bli medlem     Resultat       X (Twitter) ↗           │
│  Stadgar        Premier League Facebook ↗              │
│  Kontakt        Champions Lg   YouTube ↗               │
│                                                         │
│  ┌─────────────────────────────────────────────┐       │
│  │ 📧 Nyhetsbrev                                │       │
│  │ [din@email.se          ] [Prenumerera]       │       │
│  └─────────────────────────────────────────────┘       │
│                                                         │
│  ─────────────────────────────────────────────         │
│  © 2026 Chelsea Supporters Sweden                      │
│  Integritetspolicy · Cookies                           │
│                                                         │
│  Chelsea FC och logotypen är varumärken av              │
│  Chelsea Football Club.                                │
└─────────────────────────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `showNewsletter` | boolean | true | Visa nyhetsbrev-signup |
| `socialLinks` | SocialLink[] | — | Sociala medier-länkar |

### Specifikation
```
Bakgrund: bg-chelsea-blue-dark
Text: text-white/80 (body), text-white (headings)
Kolumner: 1 col (mobile), 2 col (sm), 4 col (lg)
Sektions-headings: text-xs uppercase tracking-widest text-gold font-semibold mb-4
Länkar: text-white/70 hover:text-white transition-fast
Nyhetsbrev-input: bg-white/10 border-white/20 text-white placeholder:text-white/40
Nyhetsbrev-knapp: bg-gold text-chelsea-blue-dark font-semibold
Divider: border-t border-white/10
Bottom-text: text-xs text-white/50
Padding: py-16 (mobile), py-20 (desktop)
```

---

## 7. EventCard

### Beskrivning
Kort för evenemang — pubkvällar, matchresor, årsmöte etc.

### Struktur
```
┌───────────────────────────────────────┐
│ ┌──────┐                              │
│ │ MAR  │  Pubkväll: Chelsea vs Arsenal │
│ │  15  │  The Bishop's Arms, Stockholm │
│ │ LÖR  │  18:00 – Sent                │
│ └──────┘                              │
│           32 anmälda                   │
│           [Anmäl dig →]               │
└───────────────────────────────────────┘
```

### Varianter
- **Default:** Som ovan, horisontell layout
- **Compact:** Enkel rad för kalender-lista
- **Featured:** Stor bild + overlay (matchresor)

#### Featured (matchresa)
```
┌───────────────────────────────────────┐
│ ┌─────────────────────────────────┐   │
│ │    [Bild: Stamford Bridge]     │   │
│ │                                 │   │
│ │  ✈️ MATCHRESA                    │   │
│ │  Chelsea vs Liverpool           │   │
│ │  22–24 april · London           │   │
│ │  Från 4 500 kr                  │   │
│ └─────────────────────────────────┘   │
│                                       │
│ Buss + hotell + matchbiljett          │
│ 12 platser kvar                       │
│ [Boka plats →]                        │
└───────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `event` | Event | — | Eventdata |
| `variant` | 'default' \| 'compact' \| 'featured' | 'default' | Layout |
| `showAttendees` | boolean | true | Visa antal anmälda |
| `showCTA` | boolean | true | Visa anmäl-knapp |

### Event-typ
```typescript
interface Event {
  id: string;
  title: string;
  type: 'pub' | 'trip' | 'meeting' | 'social' | 'other';
  date: string;
  endDate?: string;
  location: string;
  description: string;
  image?: Image;
  attendees?: number;
  maxAttendees?: number;
  price?: number;
  ctaUrl?: string;
}
```

### Specifikation
```
Datum-block:
  bg-chelsea-blue text-white rounded-lg
  w-16 h-16 (default), w-12 h-12 (compact)
  Månad: text-xs uppercase font-semibold
  Dag: text-2xl font-bold
  Veckodag: text-xs

Kort:
  bg-white border border-gray-200 rounded-lg
  Hover: shadow-md, border-chelsea-blue/20
  Padding: p-4

Typ-badge:
  pub: bg-gold/10 text-gold
  trip: bg-chelsea-blue/10 text-chelsea-blue
  meeting: bg-gray-100 text-gray-700

Platser-kvar:
  < 5: text-error font-semibold ("Bara 3 platser kvar!")
  > 5: text-gray-500
```

---

## 8. PlayerSpotlight

### Beskrivning
Lyfter en spelare — för "Spelarfokus"-sektionen på startsidan.

### Struktur
```
┌───────────────────────────────────────┐
│                                       │
│  SPELARFOKUS                         │
│                                       │
│  ┌──────────┐  Cole Palmer            │
│  │          │  #20 · Mittfältare      │
│  │  [Bild]  │                         │
│  │          │  "Han har varit         │
│  │          │  fantastisk den här     │
│  └──────────┘  säsongen"             │
│                                       │
│  ┌──────┐ ┌──────┐ ┌──────┐         │
│  │  15  │ │   8  │ │  4.2 │         │
│  │ Mål  │ │Assist│ │Betyg │         │
│  └──────┘ └──────┘ └──────┘         │
│                                       │
│  [Läs mer om Palmer →]               │
└───────────────────────────────────────┘
```

### Props
| Prop | Typ | Default | Beskrivning |
|------|-----|---------|-------------|
| `player` | Player | — | Spelardata |
| `quote` | string | — | Citat eller blurb |
| `stats` | Stat[] | — | Statistik att visa |

### Player-typ
```typescript
interface Player {
  name: string;
  number: number;
  position: string;
  image: Image;
  nationality?: string;
}

interface Stat {
  label: string;
  value: string | number;
}
```

### Specifikation
```
Bakgrund: bg-gradient-to-br from-chelsea-blue to-chelsea-blue-dark
Text: text-white
Bild: w-48 h-48 (desktop), w-32 h-32 (mobile), rounded-xl, object-cover
Stats: bg-white/10 backdrop-blur-sm rounded-lg p-4, text-center
Stat-värde: text-3xl font-bold text-gold
Stat-label: text-xs uppercase tracking-wide text-white/70
Padding: p-8 (mobile), p-12 (desktop)
Rounded: rounded-2xl
Layout: flex-col (mobile), flex-row gap-8 items-center (desktop)
```

---

## 9. Delade UI-komponenter

### Button
```
Varianter:
  primary:   bg-chelsea-blue text-white hover:bg-chelsea-blue-dark
  secondary: bg-white text-chelsea-blue border-chelsea-blue hover:bg-chelsea-blue/5
  gold:      bg-gold text-chelsea-blue-dark hover:bg-gold-light shadow-gold
  ghost:     text-chelsea-blue hover:bg-chelsea-blue/5
  danger:    bg-error text-white hover:bg-red-700

Storlekar:
  sm: text-sm px-3 py-1.5 rounded
  md: text-base px-4 py-2 rounded-md (default)
  lg: text-lg px-6 py-3 rounded-md

States:
  disabled: opacity-50 cursor-not-allowed
  loading:  spinner-ikon, pointer-events-none
```

### Badge
```
Varianter: default, success, warning, error, gold
Stil: inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-semibold
```

### Input
```
Stil: w-full rounded-md border border-gray-200 px-3 py-2 text-base
Focus: ring-2 ring-chelsea-blue/20 border-chelsea-blue
Error: border-error ring-error/20
```

### Card (bas)
```
bg-white rounded-lg border border-gray-200 overflow-hidden
hover: shadow-md transition-base
```

### SectionHeader
```
Överrubrik: text-xs uppercase tracking-widest text-gold font-semibold
Rubrik: text-3xl font-bold text-gray-900
Undertext: text-lg text-gray-500 max-w-2xl
Alignment: text-center (default), text-left
```

### SocialBar
```
Horisontell rad med sociala ikon-länkar
Ikoner: 20px, text-white/70 hover:text-white
Gap: gap-4
```

---

## 10. Komponenthierarki

```
Layout
├── NavBar
├── main
│   ├── Hero (variant: home | page)
│   ├── Section
│   │   ├── SectionHeader
│   │   ├── MatchCard (upcoming, live, result)
│   │   ├── NewsCard (featured, default, compact)
│   │   ├── EventCard (default, compact, featured)
│   │   ├── PlayerSpotlight
│   │   └── MembershipCTA (banner, sidebar, inline)
│   └── MembershipCTA (sticky, visas vid scroll)
└── Footer
```
