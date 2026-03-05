import { getPayload } from 'payload'
import config from '@payload-config'
import type { Category, Media, Post, User } from '@/payload-types'

export type ArticleCard = {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  categorySlug: string
  publishedAt: string
  imageUrl: string | null
  imageAlt: string
}

export function isMedia(value: number | Media | null | undefined): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function isCategory(value: number | Category): value is Category {
  return typeof value === 'object' && value !== null && 'name' in value
}

export function isUser(value: number | User): value is User {
  return typeof value === 'object' && value !== null && 'name' in value
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
      status: { equals: 'published' },
    },
    depth: 2,
    limit: 1,
    locale: locale as 'sv' | 'en',
  })

  return result.docs[0] ?? null
}

export async function getLatestPosts(
  limit: number = 9,
  locale: string = 'sv',
): Promise<ArticleCard[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'posts',
    where: {
      status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit,
    depth: 1,
    locale: locale as 'sv' | 'en',
  })

  return result.docs.map((post) => {
    let imageUrl: string | null = null
    let imageAlt = ''

    if (isMedia(post.featuredImage)) {
      imageUrl = post.featuredImage.sizes?.card?.url ?? post.featuredImage.url ?? null
      imageAlt = post.featuredImage.alt ?? ''
    }

    let category = ''
    let categorySlug = ''

    if (isCategory(post.category)) {
      category = post.category.name
      categorySlug = post.category.slug
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category,
      categorySlug,
      publishedAt: post.publishedAt ?? post.createdAt,
      imageUrl,
      imageAlt,
    }
  })
}
