# CSS Webb — Content Model

**Chelsea Supporters Sweden (CSS)**  
Stack: Payload CMS 3.x · Next.js 15 · Neon Postgres · TypeScript strict  
Senast uppdaterat: 2026-02-22

---

## Innehållsförteckning

1. [Översikt](#översikt)
2. [Collections](#collections)
   - [Media](#media)
   - [Categories](#categories)
   - [Posts](#posts)
   - [Matches](#matches)
   - [Events](#events)
   - [Members](#members)
   - [Pages](#pages)
3. [Globals](#globals)
   - [SiteSettings](#sitesettings)
   - [Navigation](#navigation)
4. [Relationsdiagram](#relationsdiagram)
5. [Access Control](#access-control)
6. [Hooks & Automation](#hooks--automation)
7. [Editorial Workflow](#editorial-workflow)
8. [GDPR & Datasäkerhet](#gdpr--datasäkerhet)
9. [API-användning](#api-användning)
10. [Konfigurationsexempel](#konfigurationsexempel)

---

## Översikt

CSS Webb använder Payload CMS 3.x embedded i Next.js 15 (App Router). Databasen är Neon Postgres (serverless). Hela CMS-lagret är TypeScript strict-typat.

```
css-webb/
├── collections/
│   ├── index.ts            ← barrel export för payload.config.ts
│   ├── Categories.ts
│   ├── Events.ts
│   ├── Matches.ts
│   ├── Media.ts
│   ├── Members.ts
│   ├── Pages.ts
│   ├── Posts.ts
│   ├── globals/
│   │   ├── Navigation.ts
│   │   └── SiteSettings.ts
│   └── content-model.md    ← denna fil
├── lib/
│   └── slugify.ts          ← delad slug-hjälpare
└── payload.config.ts       ← refererar collections/index.ts
```

---

## Collections

### Media

**Slug:** `media`  
**Grupp:** System  
**Syfte:** Centralt bildbibliotek och mediafiler.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| filename | text | ✓ | Auto (Payload upload) |
| mimeType | text | ✓ | Auto (Payload upload) |
| filesize | number | ✓ | Auto (Payload upload) |
| alt | text | ✓ | Tillgänglighet + SEO. Max 250 tecken. |
| caption | text | — | Bildtext. Max 500 tecken. |
| credit | text | — | Fotograf/källa. Max 200 tecken. |

**Bildstorlekvar (auto-genererade):**

| Namn | Bredd | Höjd | Användning |
|------|-------|------|-----------|
| thumbnail | 400 | 300 | Admin-preview |
| card | 768 | 512 | Nyhets- och eventlistningar |
| hero | 1920 | 1080 | Hero-bilder |
| og | 1200 | 630 | Open Graph / sociala medier |

**Tillåtna MIME-typer:** `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml`, `image/gif`

---

### Categories

**Slug:** `categories`  
**Grupp:** Innehåll  
**Syfte:** Kategorier för nyheter/posts.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| name | text | ✓ | Max 100 tecken. |
| slug | text | ✓ | Auto-genereras från name. Unik. |
| description | textarea | — | Max 500 tecken. |

**Hook:** `beforeValidate` → auto-genererar slug från `name` om slug saknas.

---

### Posts

**Slug:** `posts`  
**Grupp:** Innehåll  
**Syfte:** Nyheter, matchrapporter, blogginlägg.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| title | text | ✓ | Max 200 tecken. |
| slug | text | ✓ | Auto-genereras från title. Unik. |
| status | select | ✓ | `draft` \| `published`. Default: `draft`. |
| publishedAt | date | — | Auto-sätts vid status→published. |
| featuredImage | upload → media | — | Omslagsbild. |
| category | relationship → categories | — | En kategori. |
| tags | array[{tag}] | — | Fri taggning. |
| author | relationship → users | — | Payload users collection. |
| excerpt | textarea | — | Ingress, max 500 tecken. |
| content | richText | ✓ | Artkelns brödtext (Slate/Lexical). |
| seo.metaTitle | text | — | Max 70 tecken. |
| seo.metaDescription | textarea | — | Max 160 tecken. |
| seo.ogImage | upload → media | — | 1200×630 px rekommenderat. |

**Versioner:** Drafts aktiverade med 30s autosave.

**Hooks:**
- `autoSlugHook` (beforeChange): Genererar slug från title vid create.
- `autoPublishedAtHook` (beforeChange): Sätter publishedAt = now() när status ändras till `published`.

**Public access:** Läsfilter `status: { equals: 'published' }` för icke-autentiserade requests.

**Preview URL:** `${NEXT_PUBLIC_SITE_URL}/nyheter/{slug}`

---

### Matches

**Slug:** `matches`  
**Grupp:** Chelsea FC  
**Syfte:** Matchkalender, resultat och matchrapporter.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| opponent | text | ✓ | Max 100 tecken. |
| date | date | ✓ | Datum + tid. |
| venue | text | — | Arena och stad. Max 150 tecken. |
| homeAway | select | ✓ | `home` \| `away` \| `neutral`. |
| competition | select | ✓ | Se enum nedan. |
| status | select | ✓ | `upcoming` \| `live` \| `finished` \| `postponed`. Default: `upcoming`. |
| result.chelseaGoals | number | — | Synlig när status = finished/live. |
| result.opponentGoals | number | — | Synlig när status = finished/live. |
| result.extraTime | checkbox | — | Avgörande i förlängning. |
| result.penalties | checkbox | — | Avgörande på straffar. |
| matchReport | richText | — | Inline matchrapport. |
| matchReportPost | relationship → posts | — | Länk till nyhetsartikel. |
| ticketLink | text | — | URL till biljettsida. |
| broadcastInfo | text | — | TV-info, t.ex. "Viaplay Sport 1". |

**Tävlingsenum:** `premier-league`, `champions-league`, `europa-league`, `conference-league`, `fa-cup`, `carabao-cup`, `community-shield`, `friendly`, `other`

---

### Events

**Slug:** `events`  
**Grupp:** Innehåll  
**Syfte:** Föreningsevent — pubkvällar, resor, möten.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| title | text | ✓ | Max 200 tecken. |
| eventType | select | ✓ | Se enum nedan. |
| date | date | ✓ | Startdatum + tid. |
| endDate | date | — | Slutdatum. Måste vara efter startdatum. |
| location | text | ✓ | Plats/adress. Max 300 tecken. |
| featuredImage | upload → media | — | Omslagsbild. |
| description | richText | ✓ | Detaljerad beskrivning. |
| maxAttendees | number | — | Max deltagarantal. Positivt heltal. |
| registrationLink | text | — | URL till anmälan. |
| isFree | checkbox | — | Gratis = true (default). |
| price | number | — | Pris i SEK. Visas om isFree = false. |
| relatedMatch | relationship → matches | — | Kopplad match. |

**Eventtypsenum:** `pub-night`, `away-trip`, `annual-meeting`, `board-meeting`, `family-event`, `charity`, `other`

---

### Members

**Slug:** `members`  
**Grupp:** Administration  
**Syfte:** Medlemsregister — **ADMIN-ONLY**.

| Fält | Typ | Obligatoriskt | GDPR-notering |
|------|-----|--------------|--------------|
| name | text | ✓ | Fullständigt namn. |
| email | email | ✓ | Primär kontakt. Unik. |
| phone | text | — | Valfritt. Internationellt format. |
| membershipType | select | ✓ | `standard` \| `premium` \| `ungdom` \| `honorary`. |
| active | checkbox | ✓ | Aktivt = true (default). |
| joinedAt | date | ✓ | Inträddesdatum. |
| expiresAt | date | — | Utgångsdatum. Tomt = livstid. |
| gdprConsent.consentGiven | checkbox | ✓ | Samtycke till behandling. |
| gdprConsent.consentDate | date | — | Datum för samtycke. |
| gdprConsent.newsletterConsent | checkbox | — | Samtycke till nyhetsbrev. |
| internalNotes | textarea | — | Ej synlig för medlemmen. |

**GDPR-regler:**
- Inga personnummer lagras.
- Minimal datainsamling (name, email, phone, type, dates, active).
- Ingen soft-delete — vid radering tas data bort permanent (rätten att bli glömd).
- Aldrig exponerat via public API (access: read kräver `role === 'admin'`).
- `consentGiven` måste vara `true` för att spara en post.

---

### Pages

**Slug:** `pages`  
**Grupp:** Innehåll  
**Syfte:** Statiska informationssidor med layout builder.

| Fält | Typ | Obligatoriskt | Notering |
|------|-----|--------------|---------|
| title | text | ✓ | Sidtitel. Max 200 tecken. |
| slug | text | ✓ | URL-path. "/" = startsidan. |
| status | select | ✓ | `draft` \| `published`. |
| featuredImage | upload → media | — | Hero-bild. |
| content | blocks | ✓ | Layout builder (se nedan). |
| seo.metaTitle | text | — | Max 70 tecken. |
| seo.metaDescription | textarea | — | Max 160 tecken. |
| seo.ogImage | upload → media | — | 1200×630 px. |
| seo.noIndex | checkbox | — | Dölj för sökmotorer. |

**Layout Builder-block:**

| Block slug | Fält | Beskrivning |
|------------|------|-------------|
| `richText` | content | Fritextblock med richText |
| `imageBlock` | image, caption, size | Bildblock med bildtext |
| `cta` | heading, text, buttonLabel, buttonLink, style | Call-to-action-block |
| `divider` | style | Horisontell avdelare |
| `embed` | url | YouTube/Twitter/Instagram-inbäddning |

**Versioner:** Drafts aktiverade med 30s autosave.

---

## Globals

### SiteSettings

**Slug:** `site-settings`  
**Grupp:** Administration

| Fält | Typ | Notering |
|------|-----|---------|
| siteName | text | Default: "Chelsea Supporters Sweden" |
| siteTagline | text | Slogan under logotypen. |
| logo | upload → media | PNG med transparens, 300×100 px. |
| favicon | upload → media | 32×32 px eller 64×64 px. |
| contactEmail | email | Visas på kontaktsidan. |
| socialLinks.facebook | text | URL |
| socialLinks.twitter | text | URL |
| socialLinks.instagram | text | URL |
| socialLinks.youtube | text | URL |
| socialLinks.tiktok | text | URL |
| footerText | richText | Copyright, adress, org.nr etc. |
| footerLinks | array[{label, url, openInNewTab}] | Footer-navigering. |
| nextMatchOverride.match | relationship → matches | Manuell "nästa match" override. |
| nextMatchOverride.enabled | checkbox | Aktivera override. |
| cookieConsent.enabled | checkbox | Visa cookie-banner. |
| cookieConsent.text | textarea | Banner-text. |
| cookieConsent.privacyPolicyLink | text | Länk till integritetspolicy. |

---

### Navigation

**Slug:** `navigation`  
**Grupp:** Administration

| Fält | Typ | Notering |
|------|-----|---------|
| items | array | Lista av menyval (se nedan). |
| mobileCta.enabled | checkbox | Aktivera CTA-knapp i mobilmeny. |
| mobileCta.label | text | Default: "Bli medlem". |
| mobileCta.url | text | URL för CTA-knapp. |

**Menyval-fält:**

| Fält | Typ | Notering |
|------|-----|---------|
| label | text | Menytext. Max 60 tecken. |
| linkType | select | `internal` \| `external` \| `none` |
| internalLink | relationship → pages | Visas om linkType = internal. |
| externalUrl | text | Visas om linkType = external. |
| openInNewTab | checkbox | Ny flik (external). |
| icon | text | Lucide-ikonnamn, t.ex. "home". |
| children | array | Undermeny (max 1 nivå). Samma fält-struktur (utan children). |

---

## Relationsdiagram

```
┌──────────────┐     category      ┌──────────────┐
│    Posts     │──────────────────▶│  Categories  │
│              │     author        │              │
│              │──────────────────▶│    Users     │
│              │   featuredImage   │              │
│              │──────────────────▶│    Media     │
│              │     seo.ogImage   │              │
│              │──────────────────▶│    Media     │
└──────────────┘                   └──────────────┘
        ▲
        │  matchReportPost
        │
┌──────────────┐   relatedMatch    ┌──────────────┐
│   Matches    │◀─────────────────│    Events    │
│              │                   │              │
│              │   featuredImage   │              │──▶ Media
└──────────────┘                   └──────────────┘

┌──────────────┐   nextMatchOverride.match
│ SiteSettings │────────────────────────────▶ Matches
│              │   logo, favicon ──────────▶ Media
└──────────────┘

┌──────────────┐   internalLink ──▶ Pages
│  Navigation  │
└──────────────┘
```

---

## Access Control

### Roller

Payload Users-collectionen (standard) utökas med ett `role`-fält:

```ts
{
  name: 'role',
  type: 'select',
  options: [
    { label: 'Admin', value: 'admin' },
    { label: 'Redaktör', value: 'editor' },
  ],
  defaultValue: 'editor',
  required: true,
}
```

### Behörighetsmatris

| Resurs | Public (ej inloggad) | Editor | Admin |
|--------|---------------------|--------|-------|
| Media | Läs | Läs, Skapa, Redigera | Fullt |
| Categories | Läs | Läs, Skapa, Redigera | Fullt |
| Posts (published) | Läs | Läs, Skapa, Redigera | Fullt |
| Posts (draft) | ✗ | Läs, Skapa, Redigera | Fullt |
| Matches | Läs | Läs, Skapa, Redigera | Fullt |
| Events | Läs | Läs, Skapa, Redigera | Fullt |
| Members | ✗ | ✗ | Fullt |
| Pages (published) | Läs | Läs, Skapa, Redigera | Fullt |
| Pages (draft) | ✗ | Läs, Skapa, Redigera | Fullt |
| SiteSettings | Läs | ✗ | Redigera |
| Navigation | Läs | ✗ | Redigera |

**Implementationsdetalj:** Public read-filter för Posts och Pages returnerar ett Payload access-filter-objekt:
```ts
return { status: { equals: 'published' } }
```
Detta appliceras direkt i databasfrågan och exponerar aldrig draft-innehåll via API.

---

## Hooks & Automation

### autoSlugHook (Posts, Pages, Categories)

Körs vid `beforeChange`/`beforeValidate`. Genererar en URL-säker slug från `title`/`name` om slug saknas.

```ts
// lib/slugify.ts hanterar:
// - Svenska tecken (å→a, ä→a, ö→o)
// - Gemener
// - Mellanslag → bindestreck
// - Specialtecken tas bort
```

**OBS:** Slug uppdateras INTE automatiskt vid title-ändringar efter skapande (för att undvika brutna URLs).

### autoPublishedAtHook (Posts)

Körs vid `beforeChange`. Sätter `publishedAt = new Date().toISOString()` när:
- `status` ändras från `draft` → `published`
- `publishedAt` är tomt (sätts aldrig om det redan finns ett datum)

Redaktörer kan override:a publishedAt manuellt för backdating.

---

## Editorial Workflow

### Nyheter (Posts)

```
Skapa utkast → Redigera → Preview → Publicera
      ↓              ↓         ↓         ↓
   status=draft  autosave  /nyheter/ status=published
                 30s       {slug}    publishedAt=now()
```

1. Redaktör skapar nytt inlägg — status = `draft`.
2. Auto-save var 30:e sekund.
3. Preview via `/nyheter/{slug}` (kräver Next.js draft mode).
4. Redaktör/Admin ändrar status till `published` → `publishedAt` sätts automatiskt.
5. Admin kan återkalla (sätta tillbaka till `draft`).

### Matcher

```
Skapa match (upcoming) → Live → Finished
                                    ↓
                           Lägg till resultat
                                    ↓
                           Länka matchrapport (Post)
```

### Sidor (Pages)

Layout Builder gör att redaktörer kan bygga sidor utan kod. Block-ordning är drag-and-drop. Sidor kräver Admin eller Editor för att publiceras.

---

## GDPR & Datasäkerhet

### Members-collectionen

- **Personnummer:** Lagras aldrig.
- **Minimalitetsprincipen:** Bara fält som behövs för föreningsverksamheten.
- **Åtkomst:** Strängt admin-only. REST API och Local API skyddas av access control.
- **Radering:** Hårdradering (no soft-delete). Payload-radering = permanent borttagning ur databasen.
- **Samtycke:** `gdprConsent.consentGiven` måste vara `true`.
- **Exporträtt:** Admin kan exportera en enskild members data via Payload Admin UI.

### Övriga collections

- Media, Posts, Events m.fl. innehåller ingen PII utöver det redaktörer manuellt lägger in.
- SiteSettings och Navigation innehåller ingen persondata.

---

## API-användning

### REST API (Payload auto-genererat)

```
GET  /api/posts              → lista publicerade posts (public)
GET  /api/posts/{id}         → enskild post (public om published)
POST /api/posts              → skapa (editor+)
GET  /api/matches            → alla matcher (public)
GET  /api/events             → alla event (public)
GET  /api/members            → 403 för alla utom admin
GET  /api/globals/site-settings  → global site-settings
GET  /api/globals/navigation     → navigation
```

### Local API (Server-side, Next.js App Router)

```ts
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config })

// Hämta senaste 5 nyheter (server component)
const posts = await payload.find({
  collection: 'posts',
  where: { status: { equals: 'published' } },
  sort: '-publishedAt',
  limit: 5,
})

// Hämta kommande matcher
const matches = await payload.find({
  collection: 'matches',
  where: { status: { equals: 'upcoming' } },
  sort: 'date',
})

// Hämta site-settings
const settings = await payload.findGlobal({ slug: 'site-settings' })
```

---

## Konfigurationsexempel

### payload.config.ts

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { allCollections, allGlobals } from './collections'

export default buildConfig({
  collections: allCollections,
  globals: allGlobals,
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— CSS Admin',
    },
  },
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'],
})
```

### Users-collection (tillägg)

Payload skapar `users` automatiskt. Lägg till `role`-fält i `payload.config.ts`:

```ts
// collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Administration',
  },
  access: {
    read: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    create: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    update: ({ req: { user } }) => Boolean(user?.role === 'admin'),
    delete: ({ req: { user } }) => Boolean(user?.role === 'admin'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Namn',
    },
    {
      name: 'role',
      type: 'select',
      label: 'Roll',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redaktör', value: 'editor' },
      ],
      access: {
        // Bara admins kan ändra roller
        update: ({ req: { user } }) => user?.role === 'admin',
      },
    },
  ],
}
```
