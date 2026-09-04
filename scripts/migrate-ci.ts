/**
 * Kör migreringar vid deploy.
 *
 * Varför inte bara `payload migrate`?
 *
 * Har någon kört `pnpm dev` mot databasen lägger Payload in en rad i
 * payload_migrations med batch = -1. Nästa `payload migrate` ställer då en
 * ja/nej-fråga i terminalen. I ett bygge finns ingen terminal: frågan avbryts,
 * Payload anropar process.exit(0) — och bygget fortsätter som om allt gick
 * bra, fast ingen migrering kördes.
 *
 * Det är exakt så produktionen hamnade på gammalt schema medan bygget
 * rapporterade grönt. Det här skriptet gör samma jobb utan frågan, loggar
 * tydligt vad det gör, och avslutar med felkod om något går snett — ett
 * misslyckat bygge är alltid bättre än en sajt som tyst kör mot fel schema.
 */
import { getPayload } from 'payload'

import config from '../payload.config'

const DEV_PUSH_BATCH = -1

async function main(): Promise<void> {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'payload-migrations',
    limit: 0,
    sort: '-name',
    overrideAccess: true,
  })

  const applied = existing.docs.filter((doc) => doc.batch !== DEV_PUSH_BATCH)
  const devMarkers = existing.docs.filter((doc) => doc.batch === DEV_PUSH_BATCH)

  console.log(`Redan körda migreringar: ${applied.length}`)
  for (const doc of applied) console.log(`  · ${doc.name}`)

  if (devMarkers.length > 0) {
    // Markeringen är bokföring från en dev-session, inte en riktig migrering.
    // Den får inte blockera deployen — men den ska synas i loggen.
    console.warn(
      `\nDatabasen har ${devMarkers.length} dev-markering(ar) från en tidigare ` +
        '`pnpm dev`-körning. Tar bort dem så att migreringarna kan köras.',
    )
    for (const marker of devMarkers) {
      await payload.delete({
        collection: 'payload-migrations',
        id: marker.id,
        overrideAccess: true,
      })
    }
  }

  console.log('\nKör migreringar…')
  await payload.db.migrate()
  console.log('Migreringar klara.')

  process.exit(0)
}

main().catch((error) => {
  console.error('\nMigreringen misslyckades — bygget avbryts.\n')
  console.error(error)
  // Avsluta med felkod så att Vercel markerar bygget som misslyckat i stället
  // för att skeppa en app som förväntar sig ett schema databasen inte har.
  process.exit(1)
})
