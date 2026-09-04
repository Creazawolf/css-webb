import { notFound } from 'next/navigation'
import { Suspense } from 'react'

import ChelseaNews from '@/components/ChelseaNews'
import EventsStrip from '@/components/EventsStrip'
import HeroNewsGrid from '@/components/HeroNewsGrid'
import MatchCenter from '@/components/MatchCenter'
import MembershipCTA from '@/components/MembershipCTA'
import NewsSection from '@/components/NewsSection'
import PodcastSection from '@/components/PodcastSection'
import Reveal from '@/components/Reveal'
import SvenskaFansSlider from '@/components/SvenskaFansSlider'
import {
  ChelseaNewsSkeleton,
  HeroSkeleton,
  MatchCenterSkeleton,
  NewsGridSkeleton,
  PodcastSkeleton,
} from '@/components/Skeletons'
import { getMatchCenterData } from '@/lib/chelsea-matches'
import { getChelseaNews } from '@/lib/chelsea-news'
import { getHeroPosts, getPosts } from '@/lib/posts'
import { getSiteConfig, getUpcomingEvents } from '@/lib/site'
import { getShowWithEpisodes } from '@/lib/spotify'
import { getLatestArticles } from '@/lib/svenskafans'

/**
 * Startsidan revalideras var femte minut. Varje modul hämtar dessutom sin egen
 * data med sin egen livslängd, och strömmas in via Suspense — sidhuvudet och
 * layouten når läsaren direkt även om en extern tjänst är långsam.
 */
export const revalidate = 300

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

// --- Moduler (var och en hämtar sin egen data) ---

async function HeroModule({ locale }: { locale: string }) {
  const articles = await getHeroPosts(3, locale).catch(() => [])
  return <HeroNewsGrid locale={locale} articles={articles} />
}

async function MatchCenterModule({ locale }: { locale: string }) {
  const { herrar, damer } = await getMatchCenterData()
  return <MatchCenter locale={locale} herrar={herrar} damer={damer} />
}

async function NewsModule({ locale }: { locale: string }) {
  // Hoppa över de tre som redan ligger i toppuffen.
  const hero = await getHeroPosts(3, locale).catch(() => [])
  const { articles } = await getPosts({
    limit: 6,
    locale,
    excludeIds: hero.map((a) => a.id),
  }).catch(() => ({ articles: [], totalPages: 0, totalDocs: 0 }))

  return <NewsSection locale={locale} articles={articles} />
}

async function ChelseaNewsModule() {
  const items = await getChelseaNews({ limit: 6 }).catch(() => [])
  return <ChelseaNews items={items} />
}

async function PodcastModule() {
  const data = await getShowWithEpisodes().catch(() => null)
  return (
    <PodcastSection
      description={data?.description}
      episodes={data?.episodes}
      showUrl={data?.showUrl}
    />
  )
}

async function EventsModule({ locale }: { locale: string }) {
  const events = await getUpcomingEvents(3, locale)
  return <EventsStrip locale={locale} events={events} />
}

async function SvenskaFansModule() {
  const articles = await getLatestArticles(3).catch(() => [])
  if (articles.length === 0) return null
  return <SvenskaFansSlider articles={articles} />
}

// --- Sidan ---

export default async function Startsida({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
  }

  const site = await getSiteConfig(locale)

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroModule locale={locale} />
      </Suspense>

      <Suspense fallback={<MatchCenterSkeleton />}>
        <MatchCenterModule locale={locale} />
      </Suspense>

      <Suspense fallback={<NewsGridSkeleton />}>
        <NewsModule locale={locale} />
      </Suspense>

      {site.showChelseaNews && (
        <Suspense fallback={<ChelseaNewsSkeleton />}>
          <ChelseaNewsModule />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <EventsModule locale={locale} />
      </Suspense>

      {site.showPodcast && (
        <Suspense fallback={<PodcastSkeleton />}>
          <PodcastModule />
        </Suspense>
      )}

      {site.showSvenskaFans && (
        <Suspense fallback={null}>
          <SvenskaFansModule />
        </Suspense>
      )}

      <section className="mx-auto w-full max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-8">
        <Reveal>
          <MembershipCTA locale={locale} membershipFee={site.membershipFee} />
        </Reveal>
      </section>
    </>
  )
}
