import Image from 'next/image'
import type { PodcastEpisode } from '@/lib/spotify'

const SPOTIFY_SHOW_URL = 'https://open.spotify.com/show/5Jk5cKJ90z2QPlj0CDtWBK'

const FALLBACK_DESCRIPTION =
  'En podd om Chelsea FC på svenska, med intressanta gäster och gott tugg i panelen.'

const FALLBACK_EPISODES: PodcastEpisode[] = [
  {
    nummer: 326,
    titel: 'Försvara är sekundärt',
    datum: '18 feb',
    tid: '1 tim 7 min',
    spotifyUrl: 'https://open.spotify.com/episode/4YxTnE1eDcMMhwPy8whfEn',
  },
  {
    nummer: 325,
    titel: 'Optimismens ögon',
    datum: '5 feb',
    tid: '1 tim 24 min',
    spotifyUrl: 'https://open.spotify.com/episode/65ApxYG0QZ5KvsVFruUxqp',
  },
  {
    nummer: 324,
    titel: 'Det är mycket nu!',
    datum: '25 jan',
    tid: '1 tim 23 min',
    spotifyUrl: 'https://open.spotify.com/episode/6BvsK4AD4E7DV0xhIhOu92',
  },
  {
    nummer: 323,
    titel: 'Talangpanikköp',
    datum: '20 jan',
    tid: '1 tim 29 min',
    spotifyUrl: 'https://open.spotify.com/episode/4rvpAyhsKD3jMa6hfWLyL1',
  },
]

type PodcastSectionProps = {
  locale: string
  description?: string | undefined
  episodes?: PodcastEpisode[] | undefined
  showUrl?: string | undefined
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02Zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3Z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function HeadphonesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5ZM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5Z" />
    </svg>
  )
}

export default function PodcastSection({
  locale,
  description,
  episodes,
  showUrl,
}: PodcastSectionProps) {
  const displayEpisodes = episodes ?? FALLBACK_EPISODES
  const displayDescription = description ?? FALLBACK_DESCRIPTION
  const displayShowUrl = showUrl ?? SPOTIFY_SHOW_URL

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-[#022B5C]">
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="h-5 w-5 text-[#D4A843]" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wide text-white">
              ChelseaPodden
            </h2>
            <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white/60 sm:inline-block">
              by CSS
            </span>
          </div>
          <a
            href={displayShowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#1DB954] px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#1ed760]"
          >
            <SpotifyIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Lyssna på Spotify</span>
            <span className="sm:hidden">Spotify</span>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left: Featured / Cover area */}
          <div className="relative flex flex-col items-center justify-center border-b border-white/10 px-6 py-8 lg:col-span-2 lg:border-b-0 lg:border-r">
            {/* Podcast cover */}
            <div className="relative mb-5 h-40 w-40 overflow-hidden rounded-xl shadow-2xl sm:h-48 sm:w-48">
              <Image
                src="/images/podden-logo.png"
                alt="ChelseaPodden by CSS"
                fill
                className="object-cover"
              />
            </div>

            <p className="max-w-xs text-center text-[13px] leading-relaxed text-white/50">
              {displayDescription}
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-[#D4A843]">&#9733;</span>
              <span className="text-[13px] font-semibold text-white/70">4.9</span>
              <span className="text-[12px] text-white/30">(209 betyg)</span>
            </div>
          </div>

          {/* Right: Episode list */}
          <div className="lg:col-span-3">
            <div className="border-b border-white/10 px-5 py-3 sm:px-7">
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30">
                Senaste avsnitt
              </span>
            </div>

            <ul>
              {displayEpisodes.map((ep, i) => (
                <li key={ep.spotifyUrl}>
                  <a
                    href={ep.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5 sm:px-7 ${
                      i < displayEpisodes.length - 1 ? 'border-b border-white/5' : ''
                    }`}
                  >
                    {/* Play button */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-[#1DB954]">
                      <PlayIcon className="h-5 w-5 text-white" />
                    </div>

                    {/* Episode info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-white transition-colors group-hover:text-[#D4A843]">
                        {ep.nummer != null ? `#${ep.nummer}. ` : ''}{ep.titel}
                      </p>
                      <p className="mt-0.5 text-[12px] text-white/35">
                        {ep.datum} &middot; {ep.tid}
                      </p>
                    </div>

                    {/* Spotify icon */}
                    <SpotifyIcon className="hidden h-4 w-4 shrink-0 text-white/20 transition-colors group-hover:text-[#1DB954] sm:block" />
                  </a>
                </li>
              ))}
            </ul>

            {/* Show all link */}
            <div className="border-t border-white/10 px-5 py-3 sm:px-7">
              <a
                href={displayShowUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[12px] font-semibold text-[#D4A843] transition-colors hover:text-[#E8C96A]"
              >
                Alla avsnitt &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
