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
      <div className="rounded-md border border-dashed border-[rgb(var(--color-rule-ctl))] bg-[rgb(var(--color-card))] px-6 py-14 text-center">
        <p className="font-serif text-[16px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
          {emptyMessage}
        </p>
        {emptyAction && (
          <Link
            href={emptyAction.href}
            className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[rgb(var(--color-chelsea-blue))] px-5 py-3 text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[rgb(var(--color-chelsea-blue-dark))]"
          >
            {emptyAction.label}
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <Reveal key={article.id} delay={Math.min(i, 5) * 60}>
          <ArticleCard locale={locale} article={article} priority={i < 3} />
        </Reveal>
      ))}
    </div>
  )
}
