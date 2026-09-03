import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'

import MatchCenter from '@/components/MatchCenter'
import Reveal from '@/components/Reveal'
import { MatchCenterSkeleton } from '@/components/Skeletons'
import { getMatchCenterData } from '@/lib/api-football'
import { getPosts } from '@/lib/posts'
import ArticleCard from '@/components/ArticleCard'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Matcher',
  description:
    'Matchcenter för Chelsea — senaste och nästa match, spelschema och tabell för herrar och damer.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

async function CenterModule({ locale }: { locale: string }) {
  const { herrar, damer } = await getMatchCenterData()
  return <MatchCenter locale={locale} herrar={herrar} damer={damer} />
}

/** Referat och spelarbetyg från de senaste matcherna. */
async function MatchArticles({ locale }: { locale: string }) {
  const [referat, betyg] = await Promise.all([
    getPosts({ limit: 3, locale, articleType: 'referat' }).catch(() => null),
    getPosts({ limit: 3, locale, articleType: 'spelarbetyg' }).catch(() => null),
  ])

  const articles = [...(referat?.articles ?? []), ...(betyg?.articles ?? [])]
    .sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3)

  if (articles.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pb-10 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="section-marker" aria-hidden="true" />
        <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#022B5C]">
          Från matcherna
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <Reveal key={article.id} delay={i * 60}>
            <ArticleCard locale={locale} article={article} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const LINKS = [
  {
    slug: 'spelschema',
    title: 'Spelschema',
    description: 'Alla säsongens matcher med resultat och kommande möten.',
  },
  {
    slug: 'tabell',
    title: 'Tabell',
    description: 'Fullständig tabellställning för Premier League och WSL.',
  },
]

export default async function MatcherPage({ params }: PageProps) {
  const { locale } = await params

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px] px-4 pt-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Matchcenter
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Senaste och nästa match, tabell och skytteliga — för både herrar och
          damer. Uppdateras automatiskt.
        </p>
      </div>

      <Suspense fallback={<MatchCenterSkeleton />}>
        <CenterModule locale={locale} />
      </Suspense>

      <section className="mx-auto w-full max-w-[1200px] px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {LINKS.map((link, i) => (
            <Reveal key={link.slug} delay={i * 70}>
              <Link
                href={`/${locale}/matcher/${link.slug}` as Route}
                className="card-lift group block h-full rounded-xl border border-slate-200/70 bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <h2 className="font-display mb-1.5 text-lg font-bold text-[#022B5C] transition-colors group-hover:text-[#034694]">
                  {link.title}
                </h2>
                <p className="text-[13px] leading-relaxed text-slate-500">
                  {link.description}
                </p>
                <span className="mt-3 inline-block text-[12px] font-semibold text-[#034694]">
                  Öppna →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <Suspense fallback={null}>
        <MatchArticles locale={locale} />
      </Suspense>
    </>
  )
}
