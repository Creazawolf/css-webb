/**
 * Läsning av miljövariabler.
 *
 * Värden som klistras in i en dashboard får ofta med sig ett radbrytnings-
 * eller mellanslagstecken på slutet. Det syns inte, men det förstör allt som
 * jämför strängen exakt — t.ex. Payloads CSRF-lista, där en osynlig \n gör
 * att webbläsarens Origin aldrig matchar och varje sparning i admin nekas
 * med "You are not allowed to perform this action".
 *
 * Därför läses alla miljövariabler genom `envString`, som trimmar och
 * behandlar tom sträng som "inte satt".
 *
 * Modulen laddas även av Payload-CLI:t, så den får inte importera något
 * Next-specifikt.
 */

/** Läser en miljövariabel, trimmad. Tom sträng behandlas som saknad. */
export function envString(name: string): string | undefined {
  const raw = process.env[name]
  if (typeof raw !== 'string') return undefined
  const trimmed = raw.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

/** Normaliserar en URL: trimmar och tar bort avslutande snedstreck. */
export function normalizeUrl(value: string): string {
  return value.trim().replace(/\/+$/, '')
}

const DEFAULT_SITE_URL = 'http://localhost:3000'

/**
 * Sajtens publika adress, utan avslutande snedstreck.
 *
 * Faller tillbaka på Vercels egen produktionsdomän när NEXT_PUBLIC_SITE_URL
 * saknas, så att sitemap, metadata och förhandsvisningslänkar pekar rätt även
 * på en nyuppsatt miljö.
 */
export function getSiteUrl(): string {
  const explicit = envString('NEXT_PUBLIC_SITE_URL')
  if (explicit) return normalizeUrl(explicit)

  const production = envString('VERCEL_PROJECT_PRODUCTION_URL')
  if (production) return normalizeUrl(`https://${production}`)

  return DEFAULT_SITE_URL
}

/**
 * Origins som får skicka inloggade, muterande anrop (Payloads cors/csrf).
 *
 * Tar med Vercels systemvariabler utöver den inställda adressen:
 * VERCEL_PROJECT_PRODUCTION_URL är den riktiga produktionsdomänen, medan
 * VERCEL_URL bara är den unika adressen för en enskild deploy. Utan
 * produktionsdomänen i listan går det inte att spara i admin på den adress
 * redaktörerna faktiskt använder.
 */
export function getAllowedOrigins(): string[] {
  const hosts = [
    envString('VERCEL_PROJECT_PRODUCTION_URL'),
    envString('VERCEL_URL'),
    envString('VERCEL_BRANCH_URL'),
  ]
    .filter((host): host is string => Boolean(host))
    .map((host) => normalizeUrl(`https://${host}`))

  return Array.from(new Set([DEFAULT_SITE_URL, getSiteUrl(), ...hosts]))
}
