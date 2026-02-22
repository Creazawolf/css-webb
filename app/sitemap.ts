import type { MetadataRoute } from 'next'

const LOCALES = ['sv', 'en'] as const
const BASE_PATHS = ['', '/nyheter', '/matcher', '/evenemang', '/medlemskap', '/om-oss', '/kontakt']

const resolveSiteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

type PostsResponse = {
  docs?: Array<{
    slug?: string
    updatedAt?: string
  }>
}

const getNyheter = async (siteUrl: string): Promise<MetadataRoute.Sitemap> => {
  try {
    const res = await fetch(
      `${siteUrl}/api/posts?limit=1000&depth=0&where[status][equals]=published&select[slug]=true&select[updatedAt]=true`,
      { cache: 'no-store' },
    )

    if (!res.ok) {
      return []
    }

    const data = (await res.json()) as PostsResponse

    return (data.docs ?? [])
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.length > 0)
      .flatMap((doc) =>
        LOCALES.map((locale) => ({
          url: `${siteUrl}/${locale}/nyheter/${doc.slug}`,
          lastModified: doc.updatedAt ? new Date(doc.updatedAt) : new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
      )
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = resolveSiteUrl()
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
    BASE_PATHS.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === '' ? 'daily' : 'weekly',
      priority: path === '' ? 1 : 0.8,
    })),
  )

  const nyheterPages = await getNyheter(siteUrl)

  return [...staticPages, ...nyheterPages]
}
