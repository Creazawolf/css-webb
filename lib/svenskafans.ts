const RSS_URL = 'https://www.svenskafans.com/rss/team/149'

export type SvenskaFansArticle = {
  title: string
  description: string
  link: string
  date: string
  imageUrl: string | null
}

function parseRssItems(xml: string, count: number) {
  const items: { title: string; description: string; link: string; pubDate: string }[] = []
  const itemRegex = /<item>([\s\S]*?)<\/item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null && items.length < count) {
    const content = match[1] ?? ''
    const title = content.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1]
      ?? content.match(/<title>([\s\S]*?)<\/title>/)?.[1]
      ?? ''
    const description = content.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
      ?? content.match(/<description>([\s\S]*?)<\/description>/)?.[1]
      ?? ''
    const link = content.match(/<link>([\s\S]*?)<\/link>/)?.[1] ?? ''
    const pubDate = content.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] ?? ''

    if (title && link) {
      items.push({ title: title.trim(), description: description.trim(), link: link.trim(), pubDate: pubDate.trim() })
    }
  }

  return items
}

function formatDateSv(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  const months = [
    'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
    'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
  ]
  return `${date.getDate()} ${months[date.getMonth()]}`
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 1800 } })
    if (!res.ok) return null
    const html = await res.text()
    const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    return ogMatch?.[1] ?? null
  } catch {
    return null
  }
}

export async function getLatestArticles(count = 3): Promise<SvenskaFansArticle[]> {
  const res = await fetch(RSS_URL, { next: { revalidate: 1800 } })
  if (!res.ok) {
    throw new Error(`RSS fetch failed: ${res.status}`)
  }

  const xml = await res.text()
  const items = parseRssItems(xml, count)

  const articles = await Promise.all(
    items.map(async (item) => {
      const imageUrl = await fetchOgImage(item.link)
      return {
        title: item.title,
        description: item.description,
        link: item.link,
        date: formatDateSv(item.pubDate),
        imageUrl,
      }
    }),
  )

  return articles
}
