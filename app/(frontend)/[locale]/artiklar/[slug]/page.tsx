import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import type { Route } from 'next'

import ArticleCard from '@/components/ArticleCard'
import Reveal from '@/components/Reveal'
import { formatDateSv } from '@/lib/format-date'
import {
  ARTICLE_TYPE_LABELS,
  getAllPostSlugs,
  getPostBySlug,
  getPosts,
  isCategory,
  isMedia,
  isUser,
  mediaUrl,
} from '@/lib/posts'

export const revalidate = 600

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

/**
 * Förrendera publicerade artiklar vid bygget. Nya artiklar renderas vid första
 * besöket och cachas därefter (ISR).
 */
export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map(({ slug }) => ({ slug }))
  } catch {
    // Ingen databas vid bygget — låt sidorna renderas på begäran istället.
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)
  if (!post) return {}

  const title = post.seo?.metaTitle || post.title
  const description = post.seo?.metaDescription || post.excerpt || undefined
  const image = mediaUrl(post.seo?.ogImage, 'og') ?? mediaUrl(post.featuredImage, 'og')

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/${locale}/artiklar/${slug}` },
    openGraph: {
      type: 'article',
      title,
      ...(description ? { description } : {}),
      publishedTime: post.publishedAt ?? post.createdAt,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      ...(description ? { description } : {}),
    },
  }
}

export default async function ArtikelPage({ params }: Props) {
  const { slug, locale } = await params
  const post = await getPostBySlug(slug, locale)

  if (!post) notFound()

  const categoryName = isCategory(post.category) ? post.category.name : null
  const typeLabel = ARTICLE_TYPE_LABELS[post.articleType ?? 'nyhet'] ?? null
  const author = isUser(post.author) ? post.author : null
  const date = post.publishedAt ?? post.createdAt

  const imageUrl = mediaUrl(post.featuredImage, 'og')
  const imageAlt = isMedia(post.featuredImage) ? (post.featuredImage.alt ?? '') : ''
  const caption = isMedia(post.featuredImage) ? post.featuredImage.caption : null
  const credit = isMedia(post.featuredImage) ? post.featuredImage.credit : null

  // Fler artiklar av samma typ, den aktuella borträknad.
  const { articles: related } = await getPosts({
    limit: 3,
    locale,
    ...(post.articleType ? { articleType: post.articleType } : {}),
    excludeIds: [post.id],
  })

  return (
    <>
      <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/artiklar` as Route}
          className="text-[12px] font-semibold text-[#034694] hover:underline"
        >
          ← Alla artiklar
        </Link>

        {/* Metarad */}
        <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
          {typeLabel && (
            <span className="rounded-sm bg-[#034694] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white">
              {typeLabel}
            </span>
          )}
          {categoryName && (
            <span className="rounded-sm border border-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
              {categoryName}
            </span>
          )}
          <time className="text-[13px] text-slate-500" dateTime={date}>
            {formatDateSv(date)}
          </time>
        </div>

        <h1 className="font-display mt-4 text-3xl font-bold leading-[1.15] text-[#022B5C] sm:text-4xl lg:text-[2.75rem]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg font-medium leading-relaxed text-slate-600">
            {post.excerpt}
          </p>
        )}

        {/* Skribent */}
        {author && (
          <div className="mt-6 flex items-center gap-3 border-y border-slate-200 py-4">
            {mediaUrl(author.avatar, 'thumbnail') ? (
              <Image
                src={mediaUrl(author.avatar, 'thumbnail')!}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#034694] text-[13px] font-bold text-white">
                {author.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-[13px] font-bold text-slate-800">{author.name}</p>
              {author.title && (
                <p className="text-[12px] text-slate-500">{author.title}</p>
              )}
            </div>
          </div>
        )}

        {/* Huvudbild */}
        {imageUrl && (
          <figure className="mt-8">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
            {(caption || credit) && (
              <figcaption className="mt-2 text-center text-[12px] text-slate-500">
                {caption}
                {caption && credit ? ' · ' : ''}
                {credit && <span className="text-slate-400">Foto: {credit}</span>}
              </figcaption>
            )}
          </figure>
        )}

        <div className="article-content mt-9">
          <RichText data={post.content} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
            {post.tags.map((t) => (
              <span
                key={t.id ?? t.tag}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
              >
                {t.tag}
              </span>
            ))}
          </div>
        )}
      </article>

      {/* Fler artiklar */}
      {related.length > 0 && (
        <section className="mx-auto w-full max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="section-marker" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#022B5C]">
              Fler artiklar
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((article, i) => (
              <Reveal key={article.id} delay={i * 60}>
                <ArticleCard locale={locale} article={article} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  )
}
