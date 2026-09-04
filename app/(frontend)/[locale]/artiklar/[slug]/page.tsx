import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import type { Route } from 'next'

import { formatDateSv } from '@/lib/format-date'
import { getSiteUrl } from '@/lib/env'
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

/** Samma spaltbredd som menyn och sidfoten, så kanterna ligger i linje. */
const WRAP = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'

const RAIL_HEADING =
  'border-b border-[rgb(var(--color-rule))] pb-3.5 text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-[rgb(var(--color-muted))]'

const TOOL =
  'flex h-11 w-11 items-center justify-center rounded-full border border-[rgb(var(--color-rule-ctl))] text-[rgb(var(--color-ink-2))] transition-colors hover:border-[rgb(var(--color-chelsea-blue))] hover:text-[rgb(var(--color-chelsea-blue))]'

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

/**
 * Lästiden räknas ur Lexical-trädet i stället för ur den renderade texten:
 * orden ligger i `text`-fält på godtyckligt djup, och trädet finns redan här.
 */
function countWords(node: unknown): number {
  if (Array.isArray(node)) {
    return node.reduce<number>((sum, child) => sum + countWords(child), 0)
  }
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>
    const own =
      typeof record.text === 'string'
        ? record.text.trim().split(/\s+/).filter(Boolean).length
        : 0
    return own + countWords(Object.values(record))
  }
  return 0
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="border-t border-[rgb(var(--color-rule))] py-[13px] text-[12px] font-medium leading-none text-[rgb(var(--color-muted))] first-of-type:border-t-0">
        {label}
      </dt>
      <dd className="border-t border-[rgb(var(--color-rule))] py-[13px] text-right text-[12.5px] font-semibold leading-none text-[rgb(var(--color-text))] first-of-type:border-t-0">
        {value}
      </dd>
    </>
  )
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

  const kicker = typeLabel ?? categoryName
  const readingMinutes = Math.max(1, Math.round(countWords(post.content) / 200))
  const avatarUrl = author ? mediaUrl(author.avatar, 'thumbnail') : null

  const shareUrl = `${getSiteUrl()}/${locale}/artiklar/${slug}`
  const mailtoHref = `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(shareUrl)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`

  // Fler artiklar av samma typ, den aktuella borträknad.
  const { articles: related } = await getPosts({
    limit: 3,
    locale,
    ...(post.articleType ? { articleType: post.articleType } : {}),
    excludeIds: [post.id],
  })

  return (
    <div className={WRAP}>
      <nav
        aria-label="Brödsmulor"
        className="flex items-center gap-[9px] pt-[26px] text-[11.5px] font-medium leading-none tracking-[0.06em] text-[rgb(var(--color-muted))]"
      >
        <Link
          href={`/${locale}/artiklar` as Route}
          className="hover:text-[rgb(var(--color-chelsea-blue))]"
        >
          Artiklar
        </Link>
        {typeLabel && post.articleType && (
          <>
            <span aria-hidden="true" className="text-[rgb(var(--color-rule-2))]">
              /
            </span>
            <Link
              href={`/${locale}/artiklar/typ/${post.articleType}` as Route}
              className="hover:text-[rgb(var(--color-chelsea-blue))]"
            >
              {typeLabel}
            </Link>
          </>
        )}
      </nav>

      <header className="max-w-[960px] pb-10 pt-[26px]">
        {kicker && (
          <p className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            />
            <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
              {kicker}
            </span>
          </p>
        )}

        <h1 className="font-display mt-[18px] text-[34px] font-bold leading-[0.98] tracking-[-0.018em] text-balance text-[rgb(var(--color-text))] sm:text-[46px] lg:text-[60px] lg:leading-[0.96]">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="font-serif mt-5 max-w-[820px] text-[20px] leading-[1.5] text-pretty text-[rgb(var(--color-ink-2))] lg:text-[22px]">
            {post.excerpt}
          </p>
        )}

        <div className="mt-[30px] flex max-w-[820px] flex-wrap items-center gap-4 border-y border-[rgb(var(--color-rule))] py-4">
          {author &&
            (avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 flex-none rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[rgb(var(--color-chelsea-blue-dark))] text-[14px] font-bold leading-none text-white">
                {author.name.slice(0, 1).toUpperCase()}
              </span>
            ))}
          <div className="min-w-0 flex-1">
            {author && (
              <p className="text-[13.5px] font-semibold leading-[1.3] text-[rgb(var(--color-text))]">
                {author.name}
              </p>
            )}
            <p className="mt-[3px] text-[11.5px] font-medium leading-[1.3] text-[rgb(var(--color-muted))]">
              Publicerad <time dateTime={date}>{formatDateSv(date)}</time> ·{' '}
              {readingMinutes} min läsning
              {author?.title ? ` · ${author.title}` : ''}
            </p>
          </div>
        </div>
      </header>

      {imageUrl && (
        <figure>
          <div className="relative aspect-[1312/590] overflow-hidden rounded-[6px] bg-[rgb(var(--color-paper-deep))]">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
            />
          </div>
          {(caption || credit) && (
            <figcaption className="flex max-w-[960px] flex-wrap gap-x-[14px] gap-y-1 pt-3 text-[11.5px] font-medium leading-[1.5] text-[rgb(var(--color-muted))]">
              {caption && (
                <em className="font-serif flex-1 text-[13px] italic text-[rgb(var(--color-ink-2))]">
                  {caption}
                </em>
              )}
              {credit && <span className="flex-none">Foto: {credit}</span>}
            </figcaption>
          )}
        </figure>
      )}

      <div className="grid grid-cols-1 items-start gap-y-10 pb-6 pt-10 lg:grid-cols-[44px_minmax(0,720px)_minmax(220px,1fr)] lg:gap-x-10 lg:pt-14">
        <div className="lg:sticky lg:top-6">
          <p className="text-[9.5px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-muted))]">
            Dela
          </p>
          <div className="mt-3 flex gap-2 lg:flex-col">
            <a href={mailtoHref} className={TOOL} aria-label="Dela via e-post">
              <svg
                viewBox="0 0 24 24"
                className="h-[15px] w-[15px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3.5 6.5 8.5 6 8.5-6" />
              </svg>
            </a>
            <a
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              className={TOOL}
              aria-label="Dela på Facebook"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[15px] w-[15px]"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63c-.29-.04-1.27-.13-2.41-.13-2.38 0-4 1.45-4 4.12V9.9H7.6V13h2.7v8h3.2z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="min-w-0">
          <div className="article-content">
            <RichText data={post.content} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-[rgb(var(--color-rule))] pt-6">
              {post.tags.map((t) => (
                <span
                  key={t.id ?? t.tag}
                  className="rounded-full border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-3 py-1.5 text-[11.5px] font-medium leading-none text-[rgb(var(--color-ink-2))]"
                >
                  {t.tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <aside className="min-w-0 lg:sticky lg:top-6">
          <div className="rounded-[6px] border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6 py-[22px]">
            <h2 className={RAIL_HEADING}>Om artikeln</h2>
            <dl className="grid grid-cols-[auto_1fr]">
              {typeLabel && <FactRow label="Typ" value={typeLabel} />}
              {categoryName && <FactRow label="Kategori" value={categoryName} />}
              <FactRow label="Publicerad" value={formatDateSv(date)} />
              {author && <FactRow label="Skribent" value={author.name} />}
              <FactRow label="Lästid" value={`${readingMinutes} min läsning`} />
            </dl>
          </div>

          {related.length > 0 && (
            <div className="mt-6">
              <h2 className={RAIL_HEADING}>Läs också</h2>
              <ul>
                {related.map((article) => (
                  <li
                    key={article.id}
                    className="border-t border-[rgb(var(--color-rule))] py-[15px] first:border-t-0"
                  >
                    <Link
                      href={`/${locale}/artiklar/${article.slug}` as Route}
                      className="group block"
                    >
                      <span className="block text-[9.5px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
                        {article.label}
                      </span>
                      <span className="font-display mt-[7px] block text-[16px] font-semibold leading-[1.25] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
                        {article.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
