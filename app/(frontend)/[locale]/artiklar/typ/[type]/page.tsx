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
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/${locale}/artiklar` as Route}
        className="text-[12px] font-semibold text-[#034694] hover:underline"
      >
        ← Alla artiklar
      </Link>

      <div className="mb-6 mt-4">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C]">
          {label}
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-slate-500">
          {TYPE_DESCRIPTIONS[type]}
        </p>
      </div>

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
