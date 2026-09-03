import Link from 'next/link'
import type { Route } from 'next'

import ArticleCard from '@/components/ArticleCard'
import Reveal from '@/components/Reveal'
import type { ArticleCard as ArticleCardData } from '@/lib/posts'

type ArticleGridProps = {
  locale: string
  articles: ArticleCardData[]
  emptyMessage?: string
  /** Länk som visas när listan är tom. */
  emptyAction?: { label: string; href: Route }
}

export default function ArticleGrid({
  locale,
  articles,
  emptyMessage = 'Inga artiklar publicerade ännu.',
  emptyAction,
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
        <p className="text-[14px] text-slate-500">{emptyMessage}</p>
        {emptyAction && (
          <Link
            href={emptyAction.href}
            className="mt-4 inline-block rounded-md bg-[#034694] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#022B5C]"
          >
            {emptyAction.label}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <Reveal key={article.id} delay={Math.min(i, 5) * 60}>
          <ArticleCard locale={locale} article={article} priority={i < 3} />
        </Reveal>
      ))}
    </div>
  )
}
