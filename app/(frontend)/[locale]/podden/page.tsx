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
        <p className="font-serif mx-auto max-w-[1200px] px-4 text-center text-[15px] leading-[1.6] text-[rgb(var(--color-muted))] sm:px-6 lg:px-8">
          Kunde inte hämta avsnitten från Spotify just nu. Prova att öppna podden
          direkt i Spotify.
        </p>
      )}
    </>
  )
}

export default function PoddenPage() {
  return (
    <div className="py-12 sm:py-14">
      <header className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Podden
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          ChelseaPodden
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Föreningens egen podd om Chelsea — matcher, transferfönster, gäster och
          gott tugg i panelen. Nya avsnitt varannan vecka.
        </p>
      </header>

      <Suspense fallback={<PodcastSkeleton />}>
        <Podcast />
      </Suspense>
    </div>
  )
}
