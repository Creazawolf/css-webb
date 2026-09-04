import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Route } from 'next'

import ArticleGrid from '@/components/ArticleGrid'
import Pagination from '@/components/Pagination'
import { ARTICLE_TYPE_LABELS, getPosts } from '@/lib/posts'

export const revalidate = 300

const PER_PAGE = 12

const VALID_TYPES = Object.keys(ARTICLE_TYPE_LABELS)

const TYPE_DESCRIPTIONS: Record<string, string> = {
  referat: 'Våra referat från Chelseas matcher.',
  spelarbetyg: 'Betyg på spelarna, match för match.',
  infor: 'Inför varje match — läget, laget och vad vi väntar oss.',
  kronika: 'Krönikor och tyckande från föreningens skribenter.',
  nyhet: 'Nyheter om Chelsea och föreningen.',
  foreningen: 'Nytt från Chelsea Supporters Sweden.',
  intervju: 'Intervjuer med profiler, spelare och medlemmar.',
}

type PageProps = {
  params: Promise<{ locale: string; type: string }>
  searchParams: Promise<{ sida?: string }>
}

export async function generateStaticParams() {
  return VALID_TYPES.map((type) => ({ type }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params
  const label = ARTICLE_TYPE_LABELS[type]
  if (!label) return {}

  return {
    title: label,
    description: TYPE_DESCRIPTIONS[type] ?? `${label} från Chelsea Supporters Sweden.`,
  }
}

export default async function ArtikeltypPage({ params, searchParams }: PageProps) {
  const { locale, type } = await params
  const { sida } = await searchParams

  const label = ARTICLE_TYPE_LABELS[type]
  if (!label) notFound()

  const parsed = Number.parseInt(sida ?? '1', 10)
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

  const { articles, totalPages } = await getPosts({
    limit: PER_PAGE,
    page,
    locale,
    articleType: type,
  }).catch(() => ({ articles: [], totalPages: 0, totalDocs: 0 }))

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <nav aria-label="Brödsmulor">
        <Link
          href={`/${locale}/artiklar` as Route}
          className="text-[11.5px] font-medium uppercase leading-none tracking-[0.06em] text-[rgb(var(--color-muted))] transition-colors hover:text-[rgb(var(--color-chelsea-blue))]"
        >
          Alla artiklar
        </Link>
      </nav>

      <header className="mt-6 max-w-[680px]">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Artiklar
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          {label}
        </h1>
        {TYPE_DESCRIPTIONS[type] && (
          <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
            {TYPE_DESCRIPTIONS[type]}
          </p>
        )}
      </header>

      <div className="mb-9 mt-9 border-b border-[rgb(var(--color-rule))]" />

      {/* Korttitlarna är h3. Utan den här nivån emellan hoppar sidan från
          h1 direkt till h3, vilket gör rubrikträdet ogenomträngligt för
          den som navigerar med skärmläsare. */}
      <h2 className="sr-only">{label}</h2>

      <ArticleGrid
        locale={locale}
        articles={articles}
        emptyMessage={`Inga artiklar av typen "${label}" ännu.`}
        emptyAction={{ label: 'Alla artiklar', href: `/${locale}/artiklar` as Route }}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${locale}/artiklar/typ/${type}`}
      />
    </section>
  )
}
