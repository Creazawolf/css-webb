/**
 * Kontrollerar importen mot källan.
 *
 * Läser in ett antal artiklar och jämför sedan det som hamnat i databasen med
 * vad SvenskaFans själva anger i sina og-taggar: ingressen mot og:description
 * och bilden mot og:image. Finns för att fel som "fel ingress på varenda
 * spelarbetyg" ska fångas här och inte av någon som läser sajten.
 *
 *   DATABASE_URL=... pnpm tsx scripts/verify-import.ts [antal]
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { fetchFeed, importArticle } from '../lib/svenskafans-import'

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

const og = (html: string, property: string): string => {
  const hit = html.match(new RegExp(`<meta property="og:${property}" content="([^"]*)"`))
  return (hit?.[1] ?? '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  const limit = Number(process.argv[2] ?? '12')
  const payload = await getPayload({ config })

  const feed = await fetchFeed(limit)
  let checked = 0
  let badLead = 0
  let badImage = 0

  for (const item of feed) {
    const result = await importArticle(payload, item)
    if (result.status === 'skipped') continue

    const html = await (await fetch(item.link, { headers: { 'User-Agent': UA } })).text()
    const wantLead = og(html, 'description')
    const wantImage = (og(html, 'image').split('/').pop() ?? '').trim()

    const found = await payload.find({
      collection: 'posts',
      where: { sourceUrl: { equals: item.link } },
      depth: 1,
      limit: 1,
      draft: true,
    })
    const post = found.docs[0]
    if (!post) continue

    checked += 1

    // Ingressen kortas vid ordgräns, så jämförelsen görs på början.
    const gotLead = (post.excerpt ?? '').replace(/\s+/g, ' ').trim()
    const leadOk = wantLead.length === 0 || wantLead.slice(0, 60) === gotLead.slice(0, 60)

    const media = typeof post.featuredImage === 'object' ? post.featuredImage : null
    const gotImage = media?.filename ?? ''
    // Payload lägger på "-1" när ett filnamn krockar.
    const imageOk =
      wantImage.length === 0 || gotImage.replace(/-\d+(?=\.\w+$)/, '') === wantImage

    if (!leadOk) {
      badLead += 1
      console.log(`INGRESS  ${post.title}`)
      console.log(`  är     ${gotLead.slice(0, 80)}`)
      console.log(`  borde  ${wantLead.slice(0, 80)}`)
    }
    if (!imageOk) {
      badImage += 1
      console.log(`BILD     ${post.title}`)
      console.log(`  är     ${gotImage}`)
      console.log(`  borde  ${wantImage}`)
    }
  }

  console.log(`\nKontrollerade ${checked}. Fel ingress: ${badLead}. Fel bild: ${badImage}.`)
  process.exit(badLead + badImage > 0 ? 1 : 0)
}

void main()
