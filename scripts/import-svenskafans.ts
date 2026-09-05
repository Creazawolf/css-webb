/**
 * Kommandoradsvarianten av SvenskaFans-importen.
 *
 * Själva arbetet ligger i lib/svenskafans-import.ts, som också används av den
 * skyddade endpointen. Den här filen är bara slingan och utskrifterna.
 *
 *   DATABASE_URL=... pnpm tsx scripts/import-svenskafans.ts [antal]
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { fetchFeed, importArticle } from '../lib/svenskafans-import'

async function main() {
  const limit = Number(process.argv[2] ?? '100')
  const payload = await getPayload({ config })

  console.log('Hämtar flödet …')
  const feed = await fetchFeed(limit)
  console.log(`${feed.length} poster i flödet.`)

  const tally = { created: 0, updated: 0, skipped: 0 }

  for (const [i, item] of feed.entries()) {
    const result = await importArticle(payload, item)
    tally[result.status] += 1
    const label = `[${i + 1}/${feed.length}] ${result.title.slice(0, 58)}`
    console.log(
      result.status === 'skipped'
        ? `${label} — hoppas över (${result.reason})`
        : `${label} — ${result.status === 'created' ? 'inläst' : 'uppdaterad'}`,
    )
  }

  console.log(
    `\nKlart. ${tally.created} nya, ${tally.updated} uppdaterade, ${tally.skipped} överhoppade.`,
  )
  process.exit(0)
}

main().catch((err) => {
  console.error('Importen misslyckades:', err)
  process.exit(1)
})
