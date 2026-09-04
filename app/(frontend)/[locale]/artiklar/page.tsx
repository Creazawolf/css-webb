import Link from 'next/link'
import type { Metadata } from 'next'
import type { Route } from 'next'

import ArticleGrid from '@/components/ArticleGrid'
import Pagination from '@/components/Pagination'
import { ARTICLE_TYPE_LABELS, getPosts } from '@/lib/posts'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Artiklar',
  description:
    'Matchreferat, spelarbetyg, inför-texter och krönikor från Chelsea Supporters Sweden.',
}

const PER_PAGE = 12

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ sida?: string }>
}

/** Filterflikarna längs toppen — samma indelning som artikeltyperna. */
const TYPE_FILTERS = ['referat', 'spelarbetyg', 'infor', 'kronika'] as const

const CHIP =
  'inline-flex min-h-[44px] items-center whitespace-nowrap rounded-full px-4 text-[11.5px] font-semibold uppercase leading-none tracking-[0.06em] transition-colors'

export default async function ArtiklarPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { sida } = await searchParams

  const parsed = Number.parseInt(sida ?? '1', 10)
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

  // Faller tillbaka på en tom lista om databasen inte svarar — en listsida
  // ska visa "inga artiklar", aldrig ett 500-fel.
  const { articles, totalPages } = await getPosts({ limit: PER_PAGE, page, locale }).catch(
    () => ({ articles: [], totalPages: 0, totalDocs: 0 }),
  )

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-[680px]">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Redaktionen
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          Artiklar
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Allt vi skriver om Chelsea — referat, spelarbetyg, inför varje match och
          krönikor från medlemmarna.
        </p>
      </header>

      {/* Typfilter */}
      <div className="scrollbar-none mb-9 mt-9 flex gap-1.5 overflow-x-auto border-b border-[rgb(var(--color-rule))] pb-6">
        <span
          aria-current="page"
          className={`${CHIP} bg-[rgb(var(--color-text))] text-white`}
        >
          Alla
        </span>
        {TYPE_FILTERS.map((type) => (
          <Link
            key={type}
            href={`/${locale}/artiklar/typ/${type}` as Route}
            className={`${CHIP} border border-[rgb(var(--color-rule-ctl))] text-[rgb(var(--color-ink-2))] hover:border-[rgb(var(--color-chelsea-blue))] hover:text-[rgb(var(--color-chelsea-blue))]`}
          >
            {ARTICLE_TYPE_LABELS[type]}
          </Link>
        ))}
      </div>

      <ArticleGrid
        locale={locale}
        articles={articles}
        emptyMessage="Inga artiklar publicerade ännu. Logga in i adminpanelen för att skriva den första."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath={`/${locale}/artiklar`}
      />
    </section>
  )
}
