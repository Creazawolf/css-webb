import { getPayload } from 'payload'
import config from '@payload-config'

import type { Page } from '@/payload-types'

/**
 * Sidor som har en egen route i appen och därför inte får fångas upp av
 * den generella [slug]-routen.
 */
export const RESERVED_SLUGS = new Set([
  'artiklar',
  'matcher',
  'evenemang',
  'medlemskap',
  'motesplatser',
  'redaktionen',
  'podden',
  'kontakt',
  'nyheter',
])

export async function getPageBySlug(
  slug: string,
  locale: string = 'sv',
): Promise<Page | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      depth: 2,
      limit: 1,
      locale: locale as 'sv' | 'en',
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

export async function getAllPageSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 200,
      depth: 0,
      pagination: false,
      select: { slug: true },
    })

    return result.docs.flatMap((doc) =>
      typeof doc.slug === 'string' && doc.slug && !RESERVED_SLUGS.has(doc.slug)
        ? [doc.slug]
        : [],
    )
  } catch {
    return []
  }
}
