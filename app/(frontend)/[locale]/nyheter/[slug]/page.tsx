import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Metadata } from 'next'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPostBySlug, isMedia, isCategory, isUser } from '@/lib/posts'
import { formatDateSv } from '@/lib/format-date'

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}

  const ogImage = isMedia(post.seo.ogImage)
    ? post.seo.ogImage.url
    : isMedia(post.featuredImage)
      ? post.featuredImage.sizes?.og?.url ?? post.featuredImage.url
      : undefined

  return {
    title: post.seo.metaTitle || post.title,
    description: post.seo.metaDescription || post.excerpt,
    openGraph: {
      title: post.seo.metaTitle || post.title,
      description: post.seo.metaDescription || post.excerpt,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function NyhetPage({ params }: Props) {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)

  if (!post) notFound()

  const categoryName = isCategory(post.category) ? post.category.name : null
  const authorName = isUser(post.author) ? post.author.name : null
  const date = post.publishedAt ?? post.createdAt

  const hasImage = isMedia(post.featuredImage)
  const imageUrl = hasImage
    ? (post.featuredImage as { sizes?: { card?: { url?: string | null } }; url?: string | null }).sizes?.card?.url ??
      (post.featuredImage as { url?: string | null }).url
    : null
  const imageAlt = hasImage ? (post.featuredImage as { alt?: string }).alt ?? '' : ''

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        {categoryName && (
          <span className="rounded-full bg-[#034694] px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white">
            {categoryName}
          </span>
        )}
        <time className="text-slate-500" dateTime={date}>
          {formatDateSv(date)}
        </time>
        {authorName && (
          <>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">{authorName}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl">
        {post.title}
      </h1>

      {/* Excerpt */}
      <p className="mt-4 text-lg font-medium leading-relaxed text-slate-700">
        {post.excerpt}
      </p>

      {/* Hero image */}
      {imageUrl && (
        <figure className="mt-8">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
              priority
            />
          </div>
          {imageAlt && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {imageAlt}
            </figcaption>
          )}
        </figure>
      )}

      {/* Article body */}
      <div className="article-content mt-10">
        <RichText data={post.content} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
          {post.tags.map((t) => (
            <span
              key={t.id ?? t.tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {t.tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
