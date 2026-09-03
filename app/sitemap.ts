import type { MetadataRoute } from 'next'

import { getAllPageSlugs } from '@/lib/pages'
import { getAllPostSlugs } from '@/lib/posts'

const LOCALES = ['sv', 'en'] as const

const BASE_PATHS = [
  '',
  '/artiklar',
  '/matcher',
  '/matcher/spelschema',
  '/matcher/tabell',
  '/evenemang',
  '/motesplatser',
  '/medlemskap',
  '/redaktionen',
  '/podden',
  '/kontakt',
]

const ARTICLE_TYPES = ['referat', 'spelarbetyg', 'infor', 'kronika']

const resolveSiteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

/**
 * Sitemap.
 *
 * Läser via Payloads Local API i samma process. Tidigare gjorde den ett
 * HTTP-anrop till sajtens eget REST-API, vilket både var långsammare och
 * kunde misslyckas under bygget innan servern svarade.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    BASE_PATHS.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? ('daily' as const) : ('weekly' as const),
      priority: path === '' ? 1 : 0.8,
    })),
  )

  const typePages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    ARTICLE_TYPES.map((type) => ({
      url: `${siteUrl}/${locale}/artiklar/typ/${type}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  )

  const [postSlugs, pageSlugs] = await Promise.all([
    getAllPostSlugs().catch(() => []),
    getAllPageSlugs().catch(() => []),
  ])

  const articlePages: MetadataRoute.Sitemap = postSlugs.flatMap((doc) =>
    LOCALES.map((locale) => ({
      url: `${siteUrl}/${locale}/artiklar/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  )

  const cmsPages: MetadataRoute.Sitemap = pageSlugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: `${siteUrl}/${locale}/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  )

  return [...staticPages, ...typePages, ...articlePages, ...cmsPages]
}
