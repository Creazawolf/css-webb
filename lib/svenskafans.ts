const RSS_URL = 'https://www.svenskafans.com/rss/team/149'

/**
 * SvenskaFans blockerar anrop utan webbläsarlik user agent (CloudFront svarar
 * 403). Vi identifierar oss ärligt men måste se ut som en riktig klient.
 */
const REQUEST_HEADERS: HeadersInit = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'application/rss+xml, application/xml, text/xml, text/html;q=0.9, */*;q=0.8',
  'Accept-Language': 'sv-SE,sv;q=0.9',
}

export const REVALIDATE_SVENSKAFANS = 1800 // 30 min

export type SvenskaFansArticle = {
  title: string
  description: string
  link: string
  date: string
  imageUrl: string | null
}

type RssItem = {
  title: string
  description: string
  link: string
  pubDate: string
}

function parseRssItems(xml: string, count: number): RssItem[] {
  const items: RssItem[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match: RegExpExecArray | null

  while ((match = itemRegex.exec(xml)) !== null && items.length < count) {
    const content = match[1] ?? ''
    const title =
      content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ??
      content.match(/<title>([\s\S]*?)<\/title>/)?.[1] ??
      ''
    const description =
      content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] ??
      content.match(/<description>([\s\S]*?)<\/description>/)?.[1] ??
      ''
    const link = content.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ''
    const pubDate = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ''

    if (title && link) {
      items.push({
        title: title.trim(),
        description: description.trim(),
        link: link.trim(),
        pubDate: pubDate.trim(),
      })
    }
  }

  return items
}

const MONTHS_SV = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
]

function formatDateSv(dateStr: string): string {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getDate()} ${MONTHS_SV[date.getMonth()]}`
}

const OG_IMAGE_PATTERNS = [
  /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
]

/**
 * Hämtar og:image för en artikel.
 *
 * Artikelsidorna är ~600 kB, men og:image ligger i <head>. Vi läser därför
 * strömmen bit för bit och avbryter så snart vi passerat </head> — i praktiken
 * laddas bara några kB per artikel istället för hela sidan.
 */
async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: REQUEST_HEADERS,
      next: { revalidate: 60 * 60 * 24 }, // bilden byts i praktiken aldrig
    })
    if (!res.ok || !res.body) return null

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (buffer.length < 120_000) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        for (const pattern of OG_IMAGE_PATTERNS) {
          const found = buffer.match(pattern)
          if (found?.[1]) return found[1]
        }

        // Passerat </head> utan träff — då finns ingen og:image.
        if (/<\/head>/i.test(buffer)) return null
      }
    } finally {
      // Stäng strömmen så att anslutningen inte hålls öppen i onödan.
      await reader.cancel().catch(() => {})
    }

    return null
  } catch {
    return null
  }
}

/**
 * Senaste artiklarna från föreningens sida på SvenskaFans.
 *
 * Kastar vid nätverksfel — anropande sida får fånga och rendera utan modulen.
 */
export async function getLatestArticles(count = 3): Promise<SvenskaFansArticle[]> {
  const res = await fetch(RSS_URL, {
    headers: REQUEST_HEADERS,
    next: { revalidate: REVALIDATE_SVENSKAFANS },
  })

  if (!res.ok) {
    throw new Error(`SvenskaFans RSS fetch failed: ${res.status}`)
  }

  const xml = await res.text()
  const items = parseRssItems(xml, count)

  return Promise.all(
    items.map(async (item) => ({
      title: item.title,
      description: item.description,
      link: item.link,
      date: formatDateSv(item.pubDate),
      imageUrl: await fetchOgImage(item.link),
    })),
  )
}
