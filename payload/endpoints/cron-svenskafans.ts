import { timingSafeEqual } from 'node:crypto'
import type { Endpoint, PayloadRequest } from 'payload'

import { importNewArticles } from '../../lib/svenskafans-import'

/**
 * Schemalagd hämtning av nya texter från SvenskaFans.
 *
 * Körs av Vercel Cron enligt schemat i vercel.json. Vercel skickar med
 * CRON_SECRET som Bearer-token, och samma adress går att anropa för hand med
 * IMPORT_SECRET — det är så en körning testas utan att vänta på schemat.
 *
 * Publiceringen sker genom Payload, så samlingens afterChange-hook rensar
 * cachen för löpsedeln och artikellistan. En ny text syns alltså direkt, inte
 * när ISR-fönstret råkar löpa ut.
 */
const matches = (given: string | undefined, expected: string | undefined): boolean => {
  // Utan hemlighet i miljön är vägen stängd. Den får aldrig stå öppen bara
  // för att en variabel glömts bort.
  if (!expected || !given) return false
  const a = Buffer.from(given.trim())
  const b = Buffer.from(expected.trim())
  return a.length === b.length && timingSafeEqual(a, b)
}

const isAuthorised = (req: PayloadRequest): boolean => {
  const bearer = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (matches(bearer, process.env.CRON_SECRET)) return true
  return matches(req.headers.get('x-import-secret') ?? undefined, process.env.IMPORT_SECRET)
}

export const cronSvenskaFans: Endpoint = {
  path: '/cron/svenskafans',
  method: 'get',
  handler: async (req) => {
    if (!isAuthorised(req)) {
      return Response.json({ error: 'Ej behörig.' }, { status: 401 })
    }

    try {
      const outcome = await importNewArticles(req.payload)
      const created = outcome.results.filter((r) => r.status === 'created').length

      if (created > 0) {
        req.payload.logger.info(
          `SvenskaFans: ${created} ny(a) artiklar av ${outcome.fresh} okända i flödet.`,
        )
      }

      return Response.json({ ok: true, created, ...outcome })
    } catch (err) {
      // Ett trasigt flöde ska synas i loggen, inte fälla schemat tyst.
      const message = (err as Error).message
      req.payload.logger.error(`SvenskaFans-hämtningen misslyckades: ${message}`)
      return Response.json({ ok: false, error: message }, { status: 502 })
    }
  },
}
