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
