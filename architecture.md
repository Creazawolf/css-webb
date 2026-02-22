# CSS Webb — Arkitektur (Next.js 15 + Payload 3 + Neon)

## 1) Målbild
Detta projekt är byggt för Chelsea Supporters Sweden (CSS) med fokus på:
- snabb publik webb (RSC + cache)
- enkel redaktionell hantering (Payload admin)
- låg driftfriktion (Vercel + Neon serverless)
- tydlig separation mellan innehållsmodell och presentation

Stack:
- **Next.js 15** (App Router)
- **Payload CMS 3.x** (embedded i Next.js-projektet)
- **Neon Postgres** (serverless)
- **Vercel** (deploy)
- **TypeScript strict**
- **Tailwind CSS 4**
- **pnpm**

---

## 2) Föreslagen mappstruktur

```txt
css-webb/
├── app/
│   ├── (frontend)/
│   │   ├── [locale]/
│   │   │   ├── page.tsx
│   │   │   ├── nyheter/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   └── om-oss/page.tsx
│   ├── (payload)/
│   │   ├── admin/[[...segments]]/page.tsx
│   │   └── api/[...slug]/route.ts
│   ├── sitemap.ts
│   ├── robots.ts
│   └── layout.tsx
├── payload/
│   ├── collections/
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── Pages.ts
│   │   └── News.ts
│   ├── globals/
│   │   └── SiteSettings.ts
│   └── access/
│       └── isAdmin.ts
├── components/
│   ├── ui/
│   ├── layout/
│   ├── news/
│   └── richtext/
├── lib/
│   ├── payload/
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── seo/
│   │   ├── metadata.ts
│   │   └── structured-data.ts
│   ├── i18n/
│   │   └── config.ts
│   └── cache/
│       └── tags.ts
├── payload.config.ts
├── next.config.ts
├── tailwind.config.ts
└── vercel.json
```

Notera: i scaffolden ligger collection-definitions direkt i `payload.config.ts` för snabb start. När projektet växer flyttas de till `payload/collections/*` enligt ovan.

---

## 3) Data flow

### Primärt flöde
1. **Redaktör uppdaterar innehåll i Payload admin**
2. **Payload skriver till Neon Postgres**
3. **Next.js RSC hämtar data** via:
   - Payload Local API (server-side, snabbast internt)
   - Payload REST API (vid behov av externa integrationer)
4. **RSC renderar HTML på servern**
5. **Client components hydreras endast där interaktivitet krävs**

### Viktig princip
- **Server först**: innehåll läses primärt i Server Components.
- **Client minimalt**: endast för t.ex. filter, toggles, live UI.

---

## 4) Auth-strategi

### Nu (implementerat)
- **Payload built-in auth** för adminanvändare (`users` collection)
- Roller: `admin`, `editor`
- Admin-routes skyddas av Payload session/cookies

### Senare (TBD)
- **Separat medlemsauth** för supporters (ej i Payload admin-domänen)
- Rekommendation: NextAuth/Clerk/Supabase Auth som separat bounded context
- Medlemsdomän bör inte återanvända Payload admin sessions

---

## 5) Caching-strategi

### Nyheter (`/nyheter`, `/nyheter/[slug]`)
- **ISR** med `revalidate` (exempel: 60–300 sek)
- Tag-baserad revalidering vid publicering/uppdatering från Payload hooks
- Mål: snabb publik läsning + nära realtidsuppdatering

### Informationssidor (`/om-oss`, `/kontakt`, etc.)
- **Statisk rendering** (build-time) där innehållet ändras sällan
- Manuell eller webhook-baserad revalidate vid behov

### Edge-kompatibilitet
- Frontend-routes kan köras Edge där beroenden tillåter
- Payload API/admin + DB-koppling kör i praktiken Node.js runtime

---

## 6) API-design

### Payload REST API
- Endpoint-bas: `/api/*`
- För externa system/integrationer
- Stabilt och standardiserat (CRUD, auth-aware)

### Payload Local API
- Används inne i Next.js serverkod
- Fördelar:
  - lägre overhead
  - typat och snabbare intern access
  - ingen extra HTTP-hop mellan app och CMS-lager

### Rekommenderad användning
- **Frontend RSC**: Local API
- **Externa integrationer**: REST API

---

## 7) SEO-arkitektur

- Metadata byggs via Next.js App Router metadata API
- `app/sitemap.ts` genererar dynamisk sitemap baserat på publicerade sidor + nyheter
- `app/robots.ts` exponerar robots policy
- Open Graph/Twitter cards från SEO-fält i Payload (`seo.metaTitle`, `seo.metaDescription`, `seo.ogImage`)
- Canonical URL härleds från `NEXT_PUBLIC_SITE_URL`

---

## 8) Media- och bildstrategi

- Bilder lagras i Payload `media` collection
- Derivat (`thumbnail`, `card`, `hero`) genereras i Payload upload pipeline
- Publicering med `next/image` för responsiv leverans och optimering
- Vercel Blob kan aktiveras senare utan ändring i innehållsmodell

---

## 9) Internationalisering

Förberett för:
- default locale: **sv**
- sekundär locale: **en**

I Payload:
- `localization` aktiverat med `sv` + `en`

I Next.js:
- `i18n` i `next.config.ts`
- routingstruktur med locale-segment rekommenderas (`/[locale]/...`)

---

## 10) Arkitekturbeslut (ADR-light)

1. **Payload embedded i Next.js**
   - färre deploy-ytor, enklare DX
2. **Neon Postgres serverless**
   - bra fit för Vercel + låg ops
3. **RSC + Local API som default data path**
   - snabb rendering + låg latency
4. **ISR för nyheter, static för infosidor**
   - optimerad balans mellan färskhet och kostnad
5. **Separat medlemsauth senare**
   - minskar coupling mellan redaktion och medlemsdomän
