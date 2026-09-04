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
  description?: string | undefined
  episodes?: PodcastEpisode[] | undefined
  showUrl?: string | undefined
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02Zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3Z" />
    </svg>
  )
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

/**
 * Podden på papper, inte i en egen mörk låda: avsnitten är en lista med
 * hårfina linjer, precis som artiklarna i högerspalten. Den mörka ytan på
 * startsidan är reserverad för Chelseas eget nyhetsband.
 */
export default function PodcastSection({
  description,
  episodes,
  showUrl,
}: PodcastSectionProps) {
  const displayEpisodes = episodes ?? FALLBACK_EPISODES
  const displayDescription = description ?? FALLBACK_DESCRIPTION
  const displayShowUrl = showUrl ?? SPOTIFY_SHOW_URL

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="relative h-[132px] w-[132px] overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-chelsea-blue-dark))]">
            <Image
              src="/images/podden-logo.png"
              alt="ChelseaPodden by CSS"
              fill
              className="object-cover"
              sizes="132px"
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span
              className="block h-[3px] w-6 rounded-sm bg-[rgb(var(--color-gold))]"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
              Podd
            </span>
          </div>

          <h2 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.01em] text-[rgb(var(--color-text))] sm:text-[40px]">
            ChelseaPodden
          </h2>

          <p className="font-serif mt-3.5 max-w-[300px] text-[15px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
            {displayDescription}
          </p>

          <p className="mt-3.5 flex items-center gap-1.5 text-[12px] font-medium text-[rgb(var(--color-muted))]">
            <span aria-hidden="true" className="text-[rgb(var(--color-gold-ink))]">
              &#9733;
            </span>
            <span className="text-[rgb(var(--color-ink-2))]">4.9</span>
            <span>(209 betyg)</span>
          </p>

          <a
            href={displayShowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[rgb(var(--color-chelsea-blue))] px-5 py-[13px] text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-white transition-colors duration-[250ms] ease-[var(--ease-out-soft)] hover:bg-[rgb(var(--color-chelsea-blue-dark))]"
          >
            <SpotifyIcon className="h-4 w-4" />
            Lyssna på Spotify
          </a>
        </div>

        <div className="lg:border-l lg:border-[rgb(var(--color-rule))] lg:pl-14">
          <p className="text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-[rgb(var(--color-muted))]">
            Senaste avsnitt
          </p>

          <ul className="mt-4">
            {displayEpisodes.map((ep) => (
              <li
                key={ep.spotifyUrl}
                className="border-t border-[rgb(var(--color-rule))] first:border-[rgb(var(--color-rule-2))]"
              >
                <a
                  href={ep.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 py-[18px]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] text-[rgb(var(--color-chelsea-blue))] transition-colors duration-[250ms] ease-[var(--ease-out-soft)] group-hover:border-[rgb(var(--color-chelsea-blue))] group-hover:bg-[rgb(var(--color-chelsea-blue))] group-hover:text-white">
                    <PlayIcon className="h-[18px] w-[18px]" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="font-display block text-[19px] font-semibold leading-[1.22] tracking-[0.005em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
                      {ep.nummer != null ? `#${ep.nummer}. ` : ''}
                      {ep.titel}
                    </span>
                    <span className="mt-2 block text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
                      {ep.datum} · {ep.tid}
                    </span>
                  </span>

                  <SpotifyIcon className="hidden h-4 w-4 shrink-0 text-[rgb(var(--color-rule-2))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))] sm:block" />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={displayShowUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-[44px] items-center gap-[7px] text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-chelsea-blue))] transition-colors hover:text-[rgb(var(--color-chelsea-blue-dark))]"
          >
            Alla avsnitt
            <ExternalIcon className="h-3 w-3" />
          </a>
        </div>
      </div>
    </section>
  )
}
