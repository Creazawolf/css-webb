import { z } from 'zod'

/**
 * Senaste nyheterna från Chelseas officiella hemsida.
 *
 * chelseafc.com publicerar ingen RSS, men nyhetslistan på /en/news hämtas
 * från ett publikt JSON-API som sidan själv anropar. Listnings-ID:t nedan är
 * det som ligger inbäddat i /en/news och pekar på "Latest".
 *
 * Vi visar rubrik, kategori och bild, och länkar alltid vidare till artikeln
 * hos Chelsea — vi återpublicerar aldrig deras brödtext.
 */

const NEWS_LIST_ID = '7rJyiGvKIDGe6kNF0jRwJ5'
const API_BASE = `https://www.chelseafc.com/en/api/news/listing/${NEWS_LIST_ID}`
const SITE_BASE = 'https://www.chelseafc.com'

/** Chelseas Cloudinary-konto — används för att beställa mindre bilder. */
const CLOUDINARY_BASE = 'https://res.cloudinary.com/chelsea-production/image/upload'

export const REVALIDATE_CHELSEA_NEWS = 900 // 15 min

// --- Schemas (bara fälten vi faktiskt använder) ---

const ThumbnailSchema = z
  .object({
    file: z
      .object({
        url: z.string().optional(),
        urlObject: z
          .object({
            publicId: z.string().optional(),
          })
          .optional(),
      })
      .optional(),
  })
  .optional()
  .nullable()

const NewsItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  url: z.string(),
  category: z
    .object({
      title: z.string().optional(),
    })
    .optional()
    .nullable(),
  thumbnail: ThumbnailSchema,
})

const NewsResponseSchema = z.object({
  items: z.array(NewsItemSchema),
})

// --- Publik typ ---

export type ChelseaNewsItem = {
  id: string
  title: string
  /** "Article" | "Video" | "Gallery" */
  type: string
  /** Kategori hos Chelsea, översatt till svenska när vi känner igen den. */
  category: string
  /** Absolut länk till artikeln på chelseafc.com */
  href: string
  /** Optimerad bild-URL, eller null om artikeln saknar bild. */
  imageUrl: string | null
}

// --- Hjälpare ---

/** Chelseas egna kategorinamn på svenska. Okända namn skickas vidare orörda. */
const CATEGORY_SV: Record<string, string> = {
  "Men's Team": 'Herrar',
  "Women's Team": 'Damer',
  'Cobham Next Gen': 'Akademin',
  'Development Squad': 'Akademin',
  Academy: 'Akademin',
  Club: 'Klubben',
  Foundation: 'Foundation',
  Tickets: 'Biljetter',
  Commercial: 'Klubben',
}

const TYPE_SV: Record<string, string> = {
  Video: 'Video',
  Gallery: 'Bildspel',
}

/**
 * Bygger en optimerad bild-URL via Cloudinary.
 *
 * Originalbilderna är ofta över 1 MB. Med c_fill + q_auto + f_auto landar
 * samma bild på ~40 kB, vilket är hela skillnaden för Core Web Vitals.
 */
function buildImageUrl(
  thumbnail: z.infer<typeof ThumbnailSchema>,
  width: number,
  height: number,
): string | null {
  const publicId = thumbnail?.file?.urlObject?.publicId
  if (publicId) {
    const transform = `c_fill,g_auto,w_${width},h_${height},q_auto,f_auto`
    return `${CLOUDINARY_BASE}/${transform}/${publicId}`
  }

  // Fallback: rå fil-URL. Chelsea levererar den som http — tvinga https,
  // annars blockerar webbläsaren den som mixed content.
  const raw = thumbnail?.file?.url
  if (!raw) return null
  return raw.replace(/^http:\/\//, 'https://')
}

function toAbsolute(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${SITE_BASE}${url.startsWith('/') ? '' : '/'}${url}`
}

function transformItem(
  item: z.infer<typeof NewsItemSchema>,
  width: number,
  height: number,
): ChelseaNewsItem {
  const rawCategory = item.category?.title?.trim() ?? ''
  const category =
    CATEGORY_SV[rawCategory] ?? (rawCategory || TYPE_SV[item.type] || 'Chelsea FC')

  return {
    id: item.id,
    title: item.title,
    type: item.type,
    category,
    href: toAbsolute(item.url),
    imageUrl: buildImageUrl(item.thumbnail, width, height),
  }
}

// --- Hämtning ---

type GetChelseaNewsOptions = {
  /** Antal artiklar att hämta. Default 6. */
  limit?: number
  /** Bildbredd att beställa från Cloudinary. Default 640. */
  imageWidth?: number
  /** Bildhöjd att beställa från Cloudinary. Default 360. */
  imageHeight?: number
}

/**
 * Hämtar de senaste nyheterna från chelseafc.com.
 *
 * Kastar vid nätverks- eller parsningsfel — anropande sida ansvarar för att
 * fånga och rendera utan modulen, så att ett API-avbrott hos Chelsea aldrig
 * tar ner vår startsida.
 */
export async function getChelseaNews(
  options: GetChelseaNewsOptions = {},
): Promise<ChelseaNewsItem[]> {
  const { limit = 6, imageWidth = 640, imageHeight = 360 } = options

  const url = `${API_BASE}?page=1&pageSize=${limit}&type=Article`

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      // Utan en vanlig user agent svarar chelseafc.com med en utmaningssida.
      'User-Agent':
        'Mozilla/5.0 (compatible; ChelseaSupportersSweden/1.0; +https://chelseasweden.se)',
    },
    next: { revalidate: REVALIDATE_CHELSEA_NEWS },
  })

  if (!res.ok) {
    throw new Error(`Chelsea news API error: ${res.status} ${res.statusText}`)
  }

  const data = NewsResponseSchema.parse(await res.json())

  return data.items
    .slice(0, limit)
    .map((item) => transformItem(item, imageWidth, imageHeight))
}
