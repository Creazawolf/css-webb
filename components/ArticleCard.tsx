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
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-50"
      >
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
          {article.imageUrl ? (
            <Image
              src={article.imageUrl}
              alt={article.imageAlt}
              fill
              className="media-zoom object-cover"
              sizes="96px"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#034694]">
            {article.label}
          </span>
          <h3 className="mt-0.5 line-clamp-2 text-[14px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#034694]">
            {article.title}
          </h3>
          <p className="mt-1 text-[11px] text-slate-400">
            {formatDateSv(article.publishedAt)}
          </p>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="card-lift group flex flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[var(--shadow-card)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.imageAlt}
            fill
            priority={priority}
            className="media-zoom object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
        )}
        <span className="absolute left-3 top-3 rounded-sm bg-[#034694] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
          {article.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#034694]">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500">
            {article.excerpt}
          </p>
        )}
        <p className="mt-3 text-[12px] text-slate-400">
          {formatDateSv(article.publishedAt)}
        </p>
      </div>
    </Link>
  )
}
