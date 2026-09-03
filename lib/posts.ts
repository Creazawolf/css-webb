import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'

import type { Category, Media, Post, User } from '@/payload-types'

export type Locale = 'sv' | 'en'

export const ARTICLE_TYPE_LABELS: Record<string, string> = {
  nyhet: 'Nyhet',
  infor: 'Inför match',
  referat: 'Matchreferat',
  spelarbetyg: 'Spelarbetyg',
  kronika: 'Krönika',
  foreningen: 'Föreningen',
  intervju: 'Intervju',
}

export type ArticleCard = {
  id: number
  title: string
  slug: string
  excerpt: string
  /** Etikett att visa på kortet — kategori om den finns, annars artikeltyp. */
  label: string
  articleType: string
  category: string
  categorySlug: string
  publishedAt: string
  imageUrl: string | null
  imageAlt: string
}

export function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function isCategory(value: number | Category | null | undefined): value is Category {
  return typeof value === 'object' && value !== null && 'name' in value
}

export function isUser(value: number | User | null | undefined): value is User {
  return typeof value === 'object' && value !== null && 'name' in value
}

/** Plockar den bästa tillgängliga bild-URL:en ur ett mediaobjekt. */
export function mediaUrl(
  value: number | Media | null | undefined,
  size: 'thumbnail' | 'card' | 'og' = 'card',
): string | null {
  if (!isMedia(value)) return null
  return value.sizes?.[size]?.url ?? value.url ?? null
}

export function toArticleCard(post: Post): ArticleCard {
  const category = isCategory(post.category) ? post.category.name : ''
  const categorySlug = (isCategory(post.category) ? post.category.slug : '') ?? ''
  const articleType = post.articleType ?? 'nyhet'

  return {
    id: post.id,
    title: post.title,
    slug: post.slug ?? '',
    excerpt: post.excerpt ?? '',
    label: category || ARTICLE_TYPE_LABELS[articleType] || 'Nyhet',
    articleType,
    category,
    categorySlug,
    publishedAt: post.publishedAt ?? post.createdAt,
    imageUrl: mediaUrl(post.featuredImage, 'card'),
    imageAlt: isMedia(post.featuredImage) ? (post.featuredImage.alt ?? '') : '',
  }
}

export async function getPostBySlug(
  slug: string,
  locale: string = 'sv',
): Promise<Post | null> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
    locale: locale as Locale,
  })

  return result.docs[0] ?? null
}

type GetPostsOptions = {
  limit?: number
  page?: number
  locale?: string
  /** Filtrera på kategorins slug. */
  category?: string
  /** Filtrera på artikeltyp, t.ex. 'referat'. */
  articleType?: string
  /** Bara artiklar markerade som "toppa på startsidan". */
  featuredOnly?: boolean
  /** Utelämna dessa id:n (t.ex. de som redan visas i toppuffen). */
  excludeIds?: number[]
}

export async function getPosts(options: GetPostsOptions = {}): Promise<{
  articles: ArticleCard[]
  totalPages: number
  totalDocs: number
}> {
  const {
    limit = 9,
    page = 1,
    locale = 'sv',
    category,
    articleType,
    featuredOnly,
    excludeIds,
  } = options

  const payload = await getPayload({ config })

  const where: Where = {
    _status: { equals: 'published' },
  }

  if (category) where['category.slug'] = { equals: category }
  if (articleType) where.articleType = { equals: articleType }
  if (featuredOnly) where.featured = { equals: true }
  if (excludeIds?.length) where.id = { not_in: excludeIds }

  const result = await payload.find({
    collection: 'posts',
    where,
    sort: '-publishedAt',
    limit,
    page,
    depth: 1,
    locale: locale as Locale,
  })

  return {
    articles: result.docs.map(toArticleCard),
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }
}

/** Bekvämlighetsfunktion för startsidan. */
export async function getLatestPosts(
  limit: number = 9,
  locale: string = 'sv',
): Promise<ArticleCard[]> {
  const { articles } = await getPosts({ limit, locale })
  return articles
}

/**
 * Artiklar till startsidans toppuff.
 *
 * Manuellt toppade artiklar kommer först; räcker de inte till fylls resten på
 * med de senaste, så att puffen aldrig står halvtom.
 */
export async function getHeroPosts(
  limit: number = 3,
  locale: string = 'sv',
): Promise<ArticleCard[]> {
  const { articles: featured } = await getPosts({ limit, locale, featuredOnly: true })

  if (featured.length >= limit) return featured.slice(0, limit)

  const { articles: latest } = await getPosts({
    limit: limit - featured.length,
    locale,
    excludeIds: featured.map((a) => a.id),
  })

  return [...featured, ...latest]
}

export async function getAllPostSlugs(): Promise<
  Array<{ slug: string; updatedAt: string }>
> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    limit: 1000,
    depth: 0,
    pagination: false,
    select: { slug: true, updatedAt: true },
  })

  return result.docs.flatMap((doc) =>
    typeof doc.slug === 'string' && doc.slug
      ? [{ slug: doc.slug, updatedAt: doc.updatedAt }]
      : [],
  )
}
