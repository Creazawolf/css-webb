import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { Route } from 'next'

import MatchCenter from '@/components/MatchCenter'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { MatchCenterSkeleton } from '@/components/Skeletons'
import { getMatchCenterData } from '@/lib/chelsea-matches'
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

/** Samma spaltbredd som menyn och sidfoten, så kanterna ligger i linje. */
const WRAP = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'

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
    <section className={`${WRAP} pb-16`}>
      <SectionHeading
        title="Från matcherna"
        subtitle="Referat och spelarbetyg skrivna av medlemmar"
        href={`/${locale}/artiklar` as Route}
        linkLabel="Alla artiklar"
      />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className={`${WRAP} pt-12`}>
        <p className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Matcher
          </span>
        </p>
        <h1 className="font-display mt-[14px] text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[42px] lg:text-[50px]">
          Matchcenter
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Senaste och nästa match, tabell och kommande möten — för både herrar och
          damer. Hämtat direkt från Chelsea FC.
        </p>
      </div>

      <div className="pt-10">
        <Suspense fallback={<MatchCenterSkeleton />}>
          <CenterModule locale={locale} />
        </Suspense>
      </div>

      <section className={`${WRAP} pb-14`}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LINKS.map((link, i) => (
            <Reveal key={link.slug} delay={i * 70}>
              <Link
                href={`/${locale}/matcher/${link.slug}` as Route}
                className="card-lift group flex h-full flex-col rounded-[6px] border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] p-6"
              >
                <h2 className="font-display text-[20px] font-semibold leading-[1.24] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
                  {link.title}
                </h2>
                <p className="font-serif mt-2 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-[7px] text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-chelsea-blue))]">
                  Öppna
                  <svg
                    viewBox="0 0 24 24"
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 6 6 6-6 6" />
                  </svg>
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
