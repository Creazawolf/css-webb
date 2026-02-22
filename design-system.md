# Chelsea Supporters Sweden — Design System

> Version 1.0 | 2026-02-22
> Stack: Next.js 15 · Payload CMS · Neon Postgres · Vercel · Tailwind CSS 4

---

## 1. Färgpalett

### Primära färger
| Token | Hex | Användning |
|-------|-----|-----------|
| `chelsea-blue` | `#034694` | Primär varumärkesfärg, headers, knappar, nav |
| `chelsea-blue-dark` | `#022B5C` | Hover-states, footer, mörka sektioner |
| `chelsea-blue-light` | `#0A5BB5` | Länkar, aktiva states |

### Accentfärger
| Token | Hex | Användning |
|-------|-----|-----------|
| `gold` | `#D4A843` | CTA-accenter, badges, ikoner, highlights |
| `gold-light` | `#E8C96A` | Hover på guld-element |
| `gold-dark` | `#B8912E` | Text på ljus bakgrund (accessibility) |

### Neutrala
| Token | Hex | Användning |
|-------|-----|-----------|
| `white` | `#FFFFFF` | Bakgrund, text på mörkt |
| `gray-50` | `#F8FAFC` | Sektion-bakgrund (alternating) |
| `gray-100` | `#F1F5F9` | Kort-bakgrund, input-fält |
| `gray-200` | `#E2E8F0` | Borders, dividers |
| `gray-300` | `#CBD5E1` | Placeholder-text |
| `gray-500` | `#64748B` | Sekundär text, metadata |
| `gray-700` | `#334155` | Brödtext |
| `gray-900` | `#0F172A` | Rubriker, primär text |

### Semantiska färger
| Token | Hex | Användning |
|-------|-----|-----------|
| `success` | `#16A34A` | Vinst, bekräftelser |
| `warning` | `#EAB308` | Varningar, oavgjort |
| `error` | `#DC2626` | Förlust, felmeddelanden |
| `info` | `#0EA5E9` | Info-banners |

### Matchresultat-färger
| Token | Hex | Kontext |
|-------|-----|---------|
| `match-win` | `#16A34A` | Grön badge vid vinst |
| `match-draw` | `#EAB308` | Gul badge vid oavgjort |
| `match-loss` | `#DC2626` | Röd badge vid förlust |
| `match-live` | `#DC2626` | Pulserande live-indikator |

---

## 2. Typografi

System fonts — inga externa beroenden, snabb laddning.

### Font-stack

```css
--font-heading: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
```

> **Inter** laddas via `next/font/google` (variabel font, subsettad till latin). Fallback till system-ui.

### Typskala

| Token | Storlek | Line-height | Vikt | Användning |
|-------|---------|-------------|------|-----------|
| `text-xs` | 12px / 0.75rem | 1.5 | 400 | Metadata, badges |
| `text-sm` | 14px / 0.875rem | 1.5 | 400 | Hjälptext, fotnoter |
| `text-base` | 16px / 1rem | 1.625 | 400 | Brödtext |
| `text-lg` | 18px / 1.125rem | 1.6 | 400 | Lead-text, ingress |
| `text-xl` | 20px / 1.25rem | 1.5 | 600 | Kort-rubriker |
| `text-2xl` | 24px / 1.5rem | 1.4 | 700 | Sektionsrubriker (H3) |
| `text-3xl` | 30px / 1.875rem | 1.3 | 700 | Sidrubriker (H2) |
| `text-4xl` | 36px / 2.25rem | 1.2 | 800 | Huvudrubriker (H1) |
| `text-5xl` | 48px / 3rem | 1.1 | 800 | Hero-rubriker |
| `text-6xl` | 60px / 3.75rem | 1.0 | 800 | Hero desktop |

### Responsiv typografi
- **Mobile (< 640px):** H1 = `text-4xl`, H2 = `text-2xl`, body = `text-base`
- **Tablet (640–1024px):** H1 = `text-5xl`, H2 = `text-3xl`
- **Desktop (> 1024px):** H1 = `text-6xl`, H2 = `text-3xl`

### Letter-spacing
| Kontext | Spacing |
|---------|---------|
| Rubriker (H1–H2) | `-0.025em` (tight) |
| Brödtext | `0` (normal) |
| Versaler / badges | `0.05em` (wide) |
| Nav-länkar | `0.01em` |

---

## 3. Spacing-skala

Baserad på 4px-grid med Tailwind-standard:

| Token | Värde | Användning |
|-------|-------|-----------|
| `0.5` | 2px | Micro-gap |
| `1` | 4px | Ikon-padding, tight spacing |
| `1.5` | 6px | Badge-padding |
| `2` | 8px | Mellan ikon och text, inre kort-padding |
| `3` | 12px | Liten gap mellan element |
| `4` | 16px | Standard padding, gap i kort |
| `5` | 20px | Medium padding |
| `6` | 24px | Sektions-padding (mobile) |
| `8` | 32px | Sektions-padding (tablet) |
| `10` | 40px | Stor padding |
| `12` | 48px | Sektionsgap (mobile) |
| `16` | 64px | Sektionsgap (desktop) |
| `20` | 80px | Hero-padding |
| `24` | 96px | Topp-sektioner |
| `32` | 128px | Hero vertikal padding (desktop) |

### Container
| Breakpoint | Max-width | Padding |
|-----------|-----------|---------|
| Default | 100% | 16px (px-4) |
| `sm` (640px) | 640px | 24px (px-6) |
| `md` (768px) | 768px | 24px |
| `lg` (1024px) | 1024px | 32px (px-8) |
| `xl` (1280px) | 1200px | 32px |

---

## 4. Border Radius

| Token | Värde | Användning |
|-------|-------|-----------|
| `rounded-sm` | 4px | Badges, tags |
| `rounded` | 6px | Inputs, små knappar |
| `rounded-md` | 8px | Kort, knappar |
| `rounded-lg` | 12px | Modaler, stora kort |
| `rounded-xl` | 16px | Hero-kort, featured-sektioner |
| `rounded-2xl` | 20px | Bild-containers |
| `rounded-full` | 9999px | Avatarer, pill-badges |

---

## 5. Shadows

| Token | Värde | Användning |
|-------|-------|-----------|
| `shadow-sm` | `0 1px 2px rgba(3,70,148,0.05)` | Subtila kort |
| `shadow` | `0 1px 3px rgba(3,70,148,0.08), 0 1px 2px rgba(3,70,148,0.04)` | Standard-kort |
| `shadow-md` | `0 4px 6px rgba(3,70,148,0.07), 0 2px 4px rgba(3,70,148,0.04)` | Hover-state kort |
| `shadow-lg` | `0 10px 15px rgba(3,70,148,0.08), 0 4px 6px rgba(3,70,148,0.03)` | Modaler, dropdowns |
| `shadow-xl` | `0 20px 25px rgba(3,70,148,0.10), 0 8px 10px rgba(3,70,148,0.04)` | Hero-element |
| `shadow-gold` | `0 4px 14px rgba(212,168,67,0.25)` | CTA-knappar (guld-glow) |
| `shadow-inner` | `inset 0 2px 4px rgba(0,0,0,0.06)` | Inputs (fokus) |

> Notera: Blå tint i shadows (rgba med chelsea-blue) ger varumärkeskänsla.

---

## 6. Breakpoints

| Token | Värde | Enhet |
|-------|-------|-------|
| `sm` | 640px | Stor mobil / liten tablet |
| `md` | 768px | Tablet |
| `lg` | 1024px | Liten desktop / stor tablet |
| `xl` | 1280px | Desktop |
| `2xl` | 1536px | Stor desktop |

### Mobile-first grid
- **Mobile (default):** 1 kolumn, full bredd
- **sm:** 2 kolumner för kort-grid
- **md:** 2 kolumner, sidebar börjar synas
- **lg:** 3 kolumner för kort, full sidebar
- **xl:** Max container 1200px, centrerad

---

## 7. Ikoner

- **Bibliotek:** Lucide React (tree-shakeable, konsistent stil)
- **Storlekar:** 16px (inline), 20px (navigation), 24px (feature), 32px (hero)
- **Stroke:** 1.5px (matchar Inter:s vikt)
- **Färg:** Ärver text-färg via `currentColor`

---

## 8. Bildformat

| Kontext | Ratio | Storlek (min) |
|---------|-------|--------------|
| Hero-bild | 16:9 | 1920×1080 |
| Nyhetskort | 16:9 | 640×360 |
| Nyhetsartikel (featured) | 2:1 | 1200×600 |
| Matchkort-logotyp | 1:1 | 64×64 |
| Profilbild / avatar | 1:1 | 128×128 |
| Event-bild | 3:2 | 600×400 |
| OG Image | 1.91:1 | 1200×630 |

> Alla bilder via `next/image` med blur placeholder. WebP/AVIF automatiskt.

---

## 9. Animationer & Transitions

| Token | Värde | Användning |
|-------|-------|-----------|
| `transition-fast` | `150ms ease-out` | Hover-states, färgändringar |
| `transition-base` | `200ms ease-in-out` | Knappar, kort |
| `transition-slow` | `300ms ease-in-out` | Modaler, menyer |
| `transition-spring` | `500ms cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce-effekter |

### Specifika animationer
- **Kort-hover:** `translateY(-2px)` + shadow-md, 200ms
- **Live-puls:** `@keyframes pulse` med match-live-färg, 2s infinite
- **Fade-in:** `opacity 0→1`, 300ms, för lazy-loaded content
- **Slide-up:** `translateY(20px) → 0` + fade-in, för scroll-triggered sektioner
- **Nav-dropdown:** `opacity + translateY(-8px → 0)`, 200ms
- **Hamburger → X:** CSS-transition på spans, 300ms

---

## 10. Z-index-skala

| Token | Värde | Användning |
|-------|-------|-----------|
| `z-base` | 0 | Default |
| `z-raised` | 10 | Kort, sticky-element |
| `z-dropdown` | 20 | Dropdowns, tooltips |
| `z-sticky` | 30 | Sticky nav |
| `z-overlay` | 40 | Bakgrund bakom modal |
| `z-modal` | 50 | Modal-dialog |
| `z-toast` | 60 | Notifikationer, toasts |
| `z-max` | 100 | Hamburger-meny overlay |
