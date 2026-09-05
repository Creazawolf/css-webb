/**
 * Kommandoradsvarianten av föreningsseedningen.
 *
 * Innehållet och logiken ligger i lib/seed-foreningen.ts, som också används av
 * den skyddade endpointen.
 *
 *   DATABASE_URL=... pnpm seed:foreningen
 */
import { getPayload } from 'payload'

import config from '../payload.config'
import { seedForeningen } from '../lib/seed-foreningen'

async function main(): Promise<void> {
  const payload = await getPayload({ config })
  await seedForeningen(payload)
  console.log(
    '\nKlart. Sök efter hakparenteser i adminpanelen — allt inom [ ] är sådant\nföreningen måste fylla i själv innan sajten går live.\n',
  )
  process.exit(0)
}

main().catch((error) => {
  console.error('Seed misslyckades:', error)
  process.exit(1)
})
