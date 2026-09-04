import Image from 'next/image'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { getSiteConfig, getVenues } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Mötesplatser',
  description:
    'Här ses Chelsea Supporters Sweden och ser matcherna tillsammans — stad för stad.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

function MapPin({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export default async function MotesplatserPage({ params }: PageProps) {
  const { locale } = await params
  const [venues, site] = await Promise.all([getVenues(locale), getSiteConfig(locale)])

  // Gruppera per stad så listan blir lätt att skanna.
  const byCity = venues.reduce<Record<string, typeof venues>>((acc, venue) => {
    const city = venue.city || 'Övriga'
    ;(acc[city] ??= []).push(venue)
    return acc
  }, {})

  const cities = Object.keys(byCity).sort((a, b) => a.localeCompare(b, 'sv'))

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-[680px]">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Föreningen
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          Mötesplatser
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Matcher är roligare tillsammans. Här är ställena där medlemmar i CSS ses
          och ser Chelsea — dyk upp, alla är välkomna.
        </p>
      </header>

      {venues.length === 0 ? (
        <div className="mt-12 rounded-md border border-dashed border-[rgb(var(--color-rule-ctl))] bg-[rgb(var(--color-card))] px-6 py-14 text-center">
          <p className="font-serif text-[16px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
            Inga mötesplatser är inlagda ännu.
          </p>
          <p className="font-serif mx-auto mt-2 max-w-lg text-[15px] leading-[1.6] text-[rgb(var(--color-muted))]">
            Ses ni någonstans i din stad? Hör av er till{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-[rgb(var(--color-chelsea-blue))] underline underline-offset-[3px] hover:text-[rgb(var(--color-chelsea-blue-dark))]"
            >
              {site.email}
            </a>{' '}
            så lägger vi upp det här.
          </p>
        </div>
      ) : (
        <div className="mt-12 space-y-14">
          {cities.map((city) => (
            <section key={city}>
              <SectionHeading title={city} />

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {byCity[city]!.map((venue, i) => (
                  <Reveal key={venue.id} className="h-full" delay={Math.min(i, 4) * 60}>
                    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))]">
                      {venue.imageUrl && (
                        <div className="relative aspect-[416/260] w-full overflow-hidden bg-[rgb(var(--color-chelsea-blue-dark))]">
                          <Image
                            src={venue.imageUrl}
                            alt=""
                            fill
                            className="media-zoom object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col px-5 pb-[22px] pt-5">
                        <h3 className="font-display text-[20px] font-semibold leading-[1.24] tracking-[0.005em] text-[rgb(var(--color-text))]">
                          {venue.name}
                        </h3>
                        {venue.address && (
                          <p className="mt-2 flex items-start gap-1.5 text-[11.5px] font-medium leading-[1.4] text-[rgb(var(--color-muted))]">
                            <MapPin className="mt-px h-3.5 w-3.5 shrink-0 text-[rgb(var(--color-gold-ink))]" />
                            {venue.address}
                          </p>
                        )}
                        {venue.description && (
                          <p className="font-serif mt-3 flex-1 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
                            {venue.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 border-t border-[rgb(var(--color-rule))] pt-4 text-[11.5px] font-medium">
                          {venue.contactName && (
                            <span className="text-[rgb(var(--color-muted))]">
                              Fråga efter{' '}
                              <span className="font-semibold text-[rgb(var(--color-ink-2))]">
                                {venue.contactName}
                              </span>
                            </span>
                          )}
                          {venue.mapsUrl && (
                            <a
                              href={venue.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold uppercase tracking-[0.09em] text-[rgb(var(--color-chelsea-blue))] transition-colors hover:text-[rgb(var(--color-chelsea-blue-dark))]"
                            >
                              Visa på karta
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
