import type { Metadata } from 'next'

import PodcastSection from '@/components/PodcastSection'
import { PodcastSkeleton } from '@/components/Skeletons'
import { getShowWithEpisodes } from '@/lib/spotify'
import { Suspense } from 'react'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'ChelseaPodden',
  description:
    'ChelseaPodden by CSS — en podd om Chelsea FC på svenska, från Chelsea Supporters Sweden.',
}

async function Podcast() {
  const data = await getShowWithEpisodes({ limit: 12 }).catch(() => null)

  return (
    <>
      <PodcastSection
        description={data?.description}
        episodes={data?.episodes}
        showUrl={data?.showUrl}
      />
      {!data && (
        <p className="mx-auto max-w-[1200px] px-4 text-center text-[13px] text-slate-400 sm:px-6 lg:px-8">
          Kunde inte hämta avsnitten från Spotify just nu. Prova att öppna podden
          direkt i Spotify.
        </p>
      )}
    </>
  )
}

export default function PoddenPage() {
  return (
    <div className="py-6">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          ChelseaPodden
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          Föreningens egen podd om Chelsea — matcher, transferfönster, gäster och
          gott tugg i panelen. Nya avsnitt varannan vecka.
        </p>
      </div>

      <Suspense fallback={<PodcastSkeleton />}>
        <Podcast />
      </Suspense>
    </div>
  )
}
