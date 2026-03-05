import { notFound } from 'next/navigation'

import HeroNewsGrid from '@/components/HeroNewsGrid'
import MatchCenter from '@/components/MatchCenter'
import MembershipCTA from '@/components/MembershipCTA'
import NewsSection from '@/components/NewsSection'
import PodcastSection from '@/components/PodcastSection'
import SvenskaFansSlider from '@/components/SvenskaFansSlider'
import { getHerrarData, getDamerData } from '@/lib/api-football'
import { getLatestPosts } from '@/lib/posts'
import { getShowWithEpisodes } from '@/lib/spotify'
import { getLatestArticles } from '@/lib/svenskafans'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Startsida({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
  }

  // Fetch non-API-Football data in parallel
  const [podcastData, sfArticles, cmsPosts] = await Promise.all([
    getShowWithEpisodes().catch(() => null),
    getLatestArticles(3).catch(() => []),
    getLatestPosts(9, locale).catch(() => []),
  ])

  // Fetch API-Football data sequentially to avoid rate limits
  const herrarData = await getHerrarData().catch(() => null)
  const damerData = await getDamerData().catch(() => null)

  const heroPosts = cmsPosts.slice(0, 3)
  const newsPosts = cmsPosts.slice(3, 9)

  return (
    <>
      <HeroNewsGrid locale={locale} articles={heroPosts} />
      <MatchCenter locale={locale} herrar={herrarData} damer={damerData} />
      <NewsSection locale={locale} articles={newsPosts} />
      {sfArticles.length > 0 && <SvenskaFansSlider articles={sfArticles} />}
      <PodcastSection
        locale={locale}
        description={podcastData?.description}
        episodes={podcastData?.episodes}
        showUrl={podcastData?.showUrl}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 pb-10 sm:px-6 lg:px-8">
        <MembershipCTA locale={locale} />
      </section>
    </>
  )
}
