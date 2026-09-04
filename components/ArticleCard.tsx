import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

import { formatDateSv } from '@/lib/format-date'
import type { ArticleCard as ArticleCardData } from '@/lib/posts'

type ArticleCardProps = {
  locale: string
  article: ArticleCardData
  /** 'grid' = bild överst, 'row' = liten bild till vänster. */
  variant?: 'grid' | 'row'
  /** Prioritera bildladdning (bara för det som syns direkt). */
  priority?: boolean
}

export default function ArticleCard({
  locale,
  article,
  variant = 'grid',
  priority = false,
}: ArticleCardProps) {
  const href = `/${locale}/artiklar/${article.slug}` as Route

  if (variant === 'row') {
    return (
      <Link href={href} className="group flex items-center gap-3.5 py-3.5">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-[rgb(var(--color-chelsea-blue-dark))]">
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              className="media-zoom object-cover"
              sizes="96px"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
            {article.label}
          </span>
          <h3 className="font-display mt-2 line-clamp-2 text-[17px] font-semibold leading-[1.22] tracking-[0.005em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
            {article.title}
          </h3>
          <p className="mt-2 text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
            {formatDateSv(article.publishedAt)}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="card-lift group flex h-full flex-col overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))]"
    >
      <div className="relative aspect-[416/260] w-full overflow-hidden bg-[rgb(var(--color-chelsea-blue-dark))]">
        {article.imageUrl && (
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            priority={priority}
            className="media-zoom object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 pb-[22px] pt-5">
        <span className="text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
          {article.label}
        </span>
        <h3 className="font-display mt-2.5 text-[20px] font-semibold leading-[1.24] tracking-[0.005em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="font-serif mt-2.5 line-clamp-3 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
            {article.excerpt}
          </p>
        )}
        <p className="mt-auto pt-4 text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
          {formatDateSv(article.publishedAt)}
        </p>
      </div>
    </Link>
  )
}
