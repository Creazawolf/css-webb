# Setup Guide — CSS Webb

Denna guide sätter upp projektet lokalt och på Vercel med Neon Postgres.

## 1) Förkrav

- Node.js 20+
- pnpm 9+
- Neon-konto + databas
- Vercel-konto

Verifiera:

```bash
node -v
pnpm -v
```

---

## 2) Skapa grundprojekt (Payload + Next.js)

Rekommenderad bootstrap:

```bash
pnpm create payload-app@latest css-webb
```

Välj:
- Database: **Postgres**
- TypeScript: **Yes**
- App Router: **Yes**

Gå in i projektet:

```bash
cd css-webb
```

Byt sedan ut/uppdatera filer enligt scaffolden i denna leverans (`package.json`, `payload.config.ts`, etc.).

---

## 3) Neon-anslutning (DATABASE_URL)

1. Skapa project i Neon
2. Skapa databas, t.ex. `css_webb`
3. Kopiera connection string

Exempel:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.eu-central-1.aws.neon.tech/css_webb?sslmode=require
```

Sätt miljövariabler:

```bash
cp .env.example .env
# fyll i PAYLOAD_SECRET + DATABASE_URL
```

Generera ny hemlighet:

```bash
openssl rand -base64 48
```

---

## 4) Installera dependencies

```bash
pnpm install
```

Kör migration/typer:

```bash
pnpm payload:migrate
pnpm payload:types
```

---

## 5) Starta lokalt

```bash
pnpm dev
```

Öppna:
- Webb: `http://localhost:3000`
- Payload admin: `http://localhost:3000/admin`

Skapa första admin-user via Payload onboarding.

---

## 6) Vercel deploy-konfiguration

### A) Koppla repo
- Push projekt till GitHub
- Importera repo i Vercel

### B) Build settings
- Framework: Next.js
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`

(`vercel.json` i projektet sätter samma defaults + regions/functions)

### C) Environment variables i Vercel
Lägg in minst:
- `PAYLOAD_SECRET`
- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL` (din prod-url)
- `REVALIDATE_SECRET`

Deploya sedan `main`.

---

## 7) Environment variables — översikt

Se `.env.example` för full lista. Viktiga nycklar:

- `PAYLOAD_SECRET`: signering/session
- `DATABASE_URL`: Neon Postgres
- `NEXT_PUBLIC_SITE_URL`: canonical URL/SEO
- `SMTP_*`: lösenordsåterställning/inbjudningar
- `REVALIDATE_SECRET`: skyddad ISR-invalidering

---

## 8) Development workflow (team)

1. **Branch-per-feature**
2. Implementera schema/UI
3. Kör lokalt:
   - `pnpm typecheck`
   - `pnpm lint`
   - `pnpm build`
4. PR + review
5. Merge till `main` → auto deploy i Vercel

Rekommenderad branch-konvention:
- `feat/cms-news`
- `feat/frontend-home`
- `chore/infrastructure`

---

## 9) SEO-baseline (måste på plats direkt)

Skapa tidigt i `app/`:
- `layout.tsx` med global metadata-template
- `sitemap.ts`
- `robots.ts`

Princip:
- metadata hämtas från Payload där tillgängligt
- fallback-värden från Site Settings

---

## 10) i18n-baseline

- Default locale `sv`
- Förbered `en`
- Publicera initialt allt på `sv`, översättning iterativt

Routingrekommendation:
- `/sv/...` och `/en/...` (alternativt default utan prefix men med locale state)

---

## 11) Produktionschecklista

Före launch:
- [ ] `PAYLOAD_SECRET` är stark och unik
- [ ] Neon har backup/PITR aktiverat
- [ ] Vercel env vars satta för Production + Preview
- [ ] Sitemap/robots verifierade
- [ ] Grundläggande monitorering aktiverad (Vercel + ev. Sentry)
- [ ] Admin-konton med minst privilege-princip
