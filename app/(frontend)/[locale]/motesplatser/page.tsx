import Image from 'next/image'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
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
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Mötesplatser
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Matcher är roligare tillsammans. Här är ställena där medlemmar i CSS ses
          och ser Chelsea — dyk upp, alla är välkomna.
        </p>
      </div>

      {venues.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
          <p className="text-[14px] text-slate-500">
            Inga mötesplatser är inlagda ännu.
          </p>
          <p className="mt-2 text-[13px] text-slate-400">
            Ses ni någonstans i din stad? Hör av er till{' '}
            <a
              href={`mailto:${site.email}`}
              className="font-semibold text-[#034694] hover:underline"
            >
              {site.email}
            </a>{' '}
            så lägger vi upp det här.
          </p>
        </div>
      ) : (
        <div className="mt-9 space-y-10">
          {cities.map((city) => (
            <section key={city}>
              <div className="mb-4 flex items-center gap-3">
                <span className="section-marker" aria-hidden="true" />
                <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#022B5C]">
                  {city}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {byCity[city]!.map((venue, i) => (
                  <Reveal key={venue.id} delay={Math.min(i, 4) * 60}>
                    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[var(--shadow-card)]">
                      {venue.imageUrl && (
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={venue.imageUrl}
                            alt=""
                            fill
                            className="media-zoom object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-5">
                        <h3 className="font-display text-lg font-bold text-[#022B5C]">
                          {venue.name}
                        </h3>
                        {venue.address && (
                          <p className="mt-1 flex items-start gap-1.5 text-[13px] text-slate-500">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#D4A843]" />
                            {venue.address}
                          </p>
                        )}
                        {venue.description && (
                          <p className="mt-3 flex-1 text-[13px] leading-relaxed text-slate-600">
                            {venue.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[12px]">
                          {venue.contactName && (
                            <span className="text-slate-500">
                              Fråga efter{' '}
                              <span className="font-semibold text-slate-700">
                                {venue.contactName}
                              </span>
                            </span>
                          )}
                          {venue.mapsUrl && (
                            <a
                              href={venue.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#034694] hover:underline"
                            >
                              Visa på karta →
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
