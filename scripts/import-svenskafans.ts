/**
 * Flyttar in föreningens egna texter från SvenskaFans till det egna CMS:et.
 *
 * RSS-flödet bär bara rubrik, länk och datum. Brödtexten, skribenten och
 * bilden hämtas därför från varje artikelsida: texten ur `#article-content`,
 * skribent och datum ur sidans JSON-LD, och bilden ur og:image.
 *
 * Skriptet är körbart om och om igen. Artiklar matchas på sin ursprungliga
 * länk, så en andra körning uppdaterar i stället för att skapa dubbletter.
 *
 *   DATABASE_URL=... pnpm tsx scripts/import-svenskafans.ts [antal]
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { slugify } from '../lib/slugify'
import { truncateAtWord } from '../payload/collections/_shared'

const RSS_URL = 'https://www.svenskafans.com/rss/team/149'
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'

type Feed = { title: string; link: string; pubDate: string }

type Article = {
  title: string
  link: string
  publishedAt: string
  byline: string
  imageUrl: string | null
  paragraphs: Paragraph[]
}

type Span = { text: string; bold: boolean; italic: boolean; href?: string }
type Paragraph = { spans: Span[] }

const fetchText = async (url: string): Promise<string> => {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: '*/*' } })
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.text()
}

const decode = (s: string): string =>
  s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&auml;/g, 'ä')
    .replace(/&ouml;/g, 'ö')
    .replace(/&aring;/g, 'å')
    .replace(/&Auml;/g, 'Ä')
    .replace(/&Ouml;/g, 'Ö')
    .replace(/&Aring;/g, 'Å')
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&[a-z]+;/gi, ' ')

function parseFeed(xml: string): Feed[] {
  const out: Feed[] = []
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const it = m[1] ?? ''
    const pick = (tag: string): string => {
      const hit = it.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))
      return decode((hit?.[1] ?? '').trim())
    }
    const link = pick('link')
    if (link) out.push({ title: pick('title'), link, pubDate: pick('pubDate') })
  }
  return out
}

/** Delar upp ett stycke i löpande text, fetstil, kursiv och länkar. */
function parseSpans(html: string): Span[] {
  const spans: Span[] = []
  let bold = 0
  let italic = 0
  let href: string | undefined
  let buf = ''

  const flush = () => {
    const text = decode(buf)
    if (text.trim() || (spans.length && text)) {
      spans.push({ text, bold: bold > 0, italic: italic > 0, ...(href ? { href } : {}) })
    }
    buf = ''
  }

  const tokens = html.split(/(<[^>]+>)/)
  for (const token of tokens) {
    if (!token.startsWith('<')) {
      buf += token
      continue
    }
    const tag = token.toLowerCase()
    if (/^<(strong|b)[\s>]/.test(tag) || tag === '<strong>' || tag === '<b>') {
      flush()
      bold += 1
    } else if (tag === '</strong>' || tag === '</b>') {
      flush()
      bold = Math.max(0, bold - 1)
    } else if (/^<(em|i)[\s>]/.test(tag) || tag === '<em>' || tag === '<i>') {
      flush()
      italic += 1
    } else if (tag === '</em>' || tag === '</i>') {
      flush()
      italic = Math.max(0, italic - 1)
    } else if (tag.startsWith('<a ')) {
      flush()
      href = token.match(/href="([^"]+)"/i)?.[1]
    } else if (tag === '</a>') {
      flush()
      href = undefined
    } else if (/^<br/.test(tag)) {
      buf += '\n'
    }
  }
  flush()
  return spans.filter((s) => s.text.length > 0)
}

function parseArticle(html: string, feed: Feed): Article | null {
  const body = html.match(/<div id="article-content">([\s\S]*?)<\/div>\s*<\/div>/)?.[1]
    ?? html.match(/<div id="article-content">([\s\S]*)/)?.[1]
  if (!body) return null

  const paragraphs: Paragraph[] = []
  for (const m of body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)) {
    const spans = parseSpans(m[1] ?? '')
    if (spans.some((s) => s.text.trim())) paragraphs.push({ spans })
  }
  if (paragraphs.length === 0) return null

  let byline = ''
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1] ?? '') as Record<string, unknown>
      const author = data.author as { name?: string } | undefined
      if (author?.name) byline = String(author.name).trim()
    } catch {
      /* sidan har flera JSON-LD-block; ett trasigt får inte stoppa importen */
    }
  }

  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? null
  const iso = new Date(feed.pubDate)

  return {
    title: feed.title,
    link: feed.link,
    publishedAt: (Number.isNaN(iso.getTime()) ? new Date() : iso).toISOString(),
    byline,
    imageUrl: ogImage,
    paragraphs,
  }
}

type ArticleType =
  | 'nyhet'
  | 'infor'
  | 'referat'
  | 'spelarbetyg'
  | 'kronika'
  | 'foreningen'
  | 'intervju'

/**
 * Rubriken avslöjar vilken sorts text det är. Mönstren är avlästa ur
 * föreningens eget flöde: referaten känns igen på utfallet ("vann", "föll",
 * "vidare i"), och de återkommande spalterna på sina prefix.
 */
function articleTypeOf(title: string): ArticleType {
  const t = title.toLowerCase()

  if (t.startsWith('spelarbetyg')) return 'spelarbetyg'
  if (t.startsWith('inför')) return 'infor'
  if (t.includes('intervju')) return 'intervju'

  if (/^biljettinfo|årsmöte|medlemskap|medlemsmöte|föreningen/.test(t)) return 'foreningen'

  if (/^taktisk analys|^#\d+\s*[-–]/.test(t)) return 'kronika'

  // Ett utfall i rubriken betyder att texten handlar om en spelad match.
  if (
    /\d\s*[-–]\s*\d/.test(title) ||
    /\b(vann|vinst|seger|segrade|förlust|förlorade|föll|kross|målfest|oavgjort|kryss|besegrade|utslagen|vidare i|avancerade)\b/.test(
      t,
    )
  ) {
    return 'referat'
  }

  return 'nyhet'
}

function toLexical(paragraphs: Paragraph[]) {
  const children = paragraphs.map((p) => ({
    type: 'paragraph',
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr' as const,
    textFormat: 0,
    children: p.spans.map((s) => {
      const node = {
        type: 'text',
        version: 1,
        detail: 0,
        format: (s.bold ? 1 : 0) | (s.italic ? 2 : 0),
        mode: 'normal',
        style: '',
        text: s.text,
      }
      if (!s.href) return node
      return {
        type: 'link',
        version: 3,
        format: '',
        indent: 0,
        direction: 'ltr' as const,
        fields: { linkType: 'custom' as const, url: s.href, newTab: true },
        children: [node],
      }
    }),
  }))

  return {
    root: {
      type: 'root',
      version: 1,
      format: '' as const,
      indent: 0,
      direction: 'ltr' as const,
      children,
    },
  }
}

async function main() {
  const limit = Number(process.argv[2] ?? '100')
  const payload = await getPayload({ config })

  console.log('Hämtar flödet …')
  const feed = parseFeed(await fetchText(RSS_URL)).slice(0, limit)
  console.log(`${feed.length} poster i flödet.`)

  let created = 0
  let updated = 0
  let skipped = 0

  for (const [i, item] of feed.entries()) {
    const label = `[${i + 1}/${feed.length}] ${item.title.slice(0, 58)}`
    let article: Article | null = null
    try {
      article = parseArticle(await fetchText(item.link), item)
    } catch (err) {
      console.log(`${label} — kunde inte hämtas (${(err as Error).message})`)
      skipped += 1
      continue
    }
    if (!article) {
      console.log(`${label} — hoppas över (poddavsnitt eller text utan stycken)`)
      skipped += 1
      continue
    }

    // Bilden laddas in i mediabiblioteket så att sajten inte blir beroende
    // av att SvenskaFans fortsätter serva den.
    let imageId: number | null = null
    if (article.imageUrl) {
      try {
        const existing = await payload.find({
          collection: 'media',
          where: { alt: { equals: article.title } },
          limit: 1,
        })
        if (existing.docs[0]) {
          imageId = existing.docs[0].id
        } else {
          const res = await fetch(article.imageUrl, { headers: { 'User-Agent': UA } })
          if (res.ok) {
            const buffer = Buffer.from(await res.arrayBuffer())
            const name = article.imageUrl.split('/').pop() ?? 'bild.jpg'
            const media = await payload.create({
              collection: 'media',
              data: { alt: article.title },
              file: {
                data: buffer,
                name,
                mimetype: res.headers.get('content-type') ?? 'image/jpeg',
                size: buffer.length,
              },
            })
            imageId = media.id
          }
        }
      } catch {
        /* en bild som inte går att hämta får inte stoppa artikeln */
      }
    }

    // Ingressen tas ur FÖRSTA stycket, inte ur hela texten. Det är den mening
    // skribenten själv skrev som ingång, och den bryts vid ordgräns med
    // sajtens egen funktion i stället för mitt i ett ord.
    // Spelarbetygen inleds med en rubrikrad ("Betygsskala"), så första stycket
    // duger inte alltid. Ta det första som faktiskt är en mening.
    const asText = (par: Paragraph): string =>
      par.spans
        .map((sp) => sp.text)
        .join('')
        .replace(/\s+/g, ' ')
        .trim()

    const lead =
      article.paragraphs.map(asText).find((text) => text.length >= 60) ??
      asText(article.paragraphs[0] ?? { spans: [] })

    const sourceId = article.link.match(/-(\d+)$/)?.[1] ?? ''
    const data = {
      title: article.title,
      excerpt: truncateAtWord(lead, 260),
      slug: [slugify(article.title).slice(0, 60), sourceId].filter(Boolean).join('-'),
      content: toLexical(article.paragraphs),
      articleType: articleTypeOf(article.title),
      byline: article.byline,
      sourceUrl: article.link,
      publishedAt: article.publishedAt,
      ...(imageId ? { featuredImage: imageId } : {}),
      _status: 'published' as const,
    }

    const already = await payload.find({
      collection: 'posts',
      where: { sourceUrl: { equals: article.link } },
      limit: 1,
      draft: true,
    })

    try {
      if (already.docs[0]) {
        await payload.update({ collection: 'posts', id: already.docs[0].id, data })
        updated += 1
        console.log(`${label} — uppdaterad`)
      } else {
        await payload.create({ collection: 'posts', data })
        created += 1
        console.log(
          `${label} — ${article.paragraphs.length} stycken, ${article.byline || 'okänd skribent'}`,
        )
      }
    } catch (err) {
      skipped += 1
      console.log(`${label} — kunde inte sparas (${(err as Error).message})`)
    }
  }

  console.log(`\nKlart. ${created} nya, ${updated} uppdaterade, ${skipped} överhoppade.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('Importen misslyckades:', err)
  process.exit(1)
})
