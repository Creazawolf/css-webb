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

export default async function ArtiklarPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { sida } = await searchParams

  const parsed = Number.parseInt(sida ?? '1', 10)
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

  const { articles, totalPages } = await getPosts({ limit: PER_PAGE, page, locale })

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C]">
          Artiklar
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-500">
          Allt vi skriver om Chelsea — referat, spelarbetyg, inför varje match och
          krönikor från medlemmarna.
        </p>
      </div>

      {/* Typfilter */}
      <div className="scrollbar-none mb-7 flex gap-2 overflow-x-auto pb-1">
        <span className="whitespace-nowrap rounded-full bg-[#034694] px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-white">
          Alla
        </span>
        {TYPE_FILTERS.map((type) => (
          <Link
            key={type}
            href={`/${locale}/artiklar/typ/${type}` as Route}
            className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] text-slate-500 transition-colors hover:border-[#034694] hover:text-[#034694]"
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
