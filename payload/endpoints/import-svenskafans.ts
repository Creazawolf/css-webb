import { timingSafeEqual } from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'

import { seedForeningen } from '../../lib/seed-foreningen'
import { fetchFeed, importArticle } from '../../lib/svenskafans-import'

/**
 * Kör SvenskaFans-importen från serversidan.
 *
 * Behövs eftersom databasen bara går att nå inifrån driftmiljön. Importen
 * körs i småbitar med offset och limit, för att varje anrop ska hinna klart
 * innan Vercels tidsgräns slår till. Svaret talar om var nästa bit börjar,
 * så anroparen kan gå vidare tills done är sant.
 */
const isAuthorised = (req: PayloadRequest): boolean => {
  const expected = process.env.IMPORT_SECRET?.trim()
  // Utan hemlighet i miljön är endpointen stängd. Den får aldrig stå öppen
  // bara för att en variabel glömts bort.
  if (!expected) return false

  const given = req.headers.get('x-import-secret')?.trim()
  if (!given) return false

  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * Demoartiklarna från `pnpm seed:news`. Rubriker och citat i dem är påhittade
 * — de duger som utfyllnad medan sajten byggs, men får inte ligga kvar när
 * föreningen visar upp den. Slugarna räknas upp här i stället för att matchas
 * på ett mönster, så att rensningen omöjligt kan råka ta en riktig artikel.
 */
const DEMO_SLUGS = [
  'arsenal-21-chelsea-bittert-derby-pa-emirates',
  'rosenior-vi-maste-forbattra-disciplinen',
  'champions-league-chelsea-stalls-mot-psg-i-attondelen',
  'ifs-ny-huvudsponsor-loggan-pa-trojan-resten-av-sasongen',
  'resegrupp-till-london-psg-matchen-i-mars',
  'topp-fyra-racet-sa-ser-tabellsituationen-ut',
  'pubkvall-pa-the-aston-i-stockholm-chelsea-vs-psg',
  'transferfonstret-chalobah-kan-lamna-nmecha-intresserar',
  'rosenior-hyllas-efter-starten-basta-sedan-conte',
]

export const importSvenskaFans: Endpoint = {
  path: '/import-svenskafans',
  method: 'post',
  handler: async (req) => {
    if (!isAuthorised(req)) {
      return Response.json({ error: 'Ej behörig.' }, { status: 401 })
    }

    const url = new URL(req.url ?? '', 'http://localhost')

    // Föreningens sidor, mötesplatser, evenemang och inställningar. Går på en
    // enda vända — det är för lite arbete för att behöva delas upp.
    if (url.searchParams.get('task') === 'foreningen') {
      await seedForeningen(req.payload)
      return Response.json({ done: true, task: 'foreningen' })
    }

    // Tar bort menyvalet Medlemskap. "Bli medlem"-knappen går till samma sida,
    // och den dubbletten tar plats från de poster som inte har någon annan väg
    // in. Bara den posten rörs — resten av menyn lämnas som redaktionen satt
    // den.
    if (url.searchParams.get('task') === 'meny') {
      const nav = await req.payload.findGlobal({ slug: 'navigation', depth: 0 })
      const items = Array.isArray(nav.items) ? nav.items : []
      const kept = items.filter((item) => item?.link !== '/medlemskap')

      if (kept.length !== items.length) {
        await req.payload.updateGlobal({
          slug: 'navigation',
          data: { items: kept },
          overrideAccess: true,
        })
      }

      return Response.json({
        done: true,
        task: 'meny',
        removed: items.length - kept.length,
        items: kept.map((item) => item?.label),
      })
    }

    // Rensar bort demoartiklarna. Bara texter som saknar ursprungslänk kan
    // träffas, så en importerad artikel med samma slug står kvar.
    if (url.searchParams.get('task') === 'rensa-demo') {
      const deleted = await req.payload.delete({
        collection: 'posts',
        where: {
          and: [{ slug: { in: DEMO_SLUGS } }, { sourceUrl: { exists: false } }],
        },
      })
      return Response.json({
        done: true,
        task: 'rensa-demo',
        deleted: deleted.docs.map((doc) => doc.slug),
        errors: deleted.errors,
      })
    }

    const num = (key: string, fallback: number): number =>
      Number(url.searchParams.get(key) ?? String(fallback)) || fallback

    const offset = Math.max(0, num('offset', 0))
    const limit = Math.min(10, Math.max(1, num('limit', 5)))
    const total = Math.min(100, num('total', 100))

    const feed = await fetchFeed(total)
    const slice = feed.slice(offset, offset + limit)

    const results = []
    for (const item of slice) {
      results.push(await importArticle(req.payload, item))
    }

    const next = offset + slice.length
    return Response.json({
      done: next >= feed.length,
      offset,
      next,
      total: feed.length,
      results,
    })
  },
}
