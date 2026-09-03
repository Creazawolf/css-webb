import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
import { mediaUrl } from '@/lib/posts'
import { EVENT_TYPE_LABELS, getSiteConfig } from '@/lib/site'
import type { Event } from '@/payload-types'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'Evenemang',
  description:
    'Pubkvällar, resor och årsmöten med Chelsea Supporters Sweden.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

const WEEKDAYS_SV = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']
const MONTHS_SV = [
  'januari', 'februari', 'mars', 'april', 'maj', 'juni',
  'juli', 'augusti', 'september', 'oktober', 'november', 'december',
]
const MONTHS_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
]

function formatFull(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${WEEKDAYS_SV[d.getDay()]} ${d.getDate()} ${MONTHS_SV[d.getMonth()]}, ${time}`
}

async function getEvents(locale: string): Promise<{ upcoming: Event[]; past: Event[] }> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()

    const [upcoming, past] = await Promise.all([
      payload.find({
        collection: 'events',
        where: { _status: { equals: 'published' }, date: { greater_than_equal: now } },
        sort: 'date',
        limit: 50,
        depth: 1,
        locale: locale as 'sv' | 'en',
      }),
      payload.find({
        collection: 'events',
        where: { _status: { equals: 'published' }, date: { less_than: now } },
        sort: '-date',
        limit: 6,
        depth: 1,
        locale: locale as 'sv' | 'en',
      }),
    ])

    return { upcoming: upcoming.docs, past: past.docs }
  } catch {
    return { upcoming: [], past: [] }
  }
}

function EventRow({ event }: { event: Event }) {
  const d = new Date(event.date)
  const image = mediaUrl(event.featuredImage, 'card')

  return (
    <article className="card-lift group flex flex-col gap-4 overflow-hidden rounded-xl border border-slate-200/70 bg-white p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-5">
      {/* Datumblock */}
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-[#022B5C] text-white">
        <span className="font-display text-2xl font-bold leading-none">
          {Number.isNaN(d.getTime()) ? '–' : d.getDate()}
        </span>
        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#D4A843]">
          {Number.isNaN(d.getTime()) ? '' : MONTHS_SHORT[d.getMonth()]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#D4A843]">
          {EVENT_TYPE_LABELS[event.eventType] ?? 'Evenemang'}
          {event.city ? ` · ${event.city}` : ''}
        </span>
        <h3 className="font-display mt-1 text-lg font-bold leading-snug text-[#022B5C]">
          {event.title}
        </h3>
        <p className="mt-1 text-[13px] text-slate-500">
          {formatFull(event.date)} · {event.location}
        </p>
      </div>

      {image && (
        <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100 lg:block">
          <Image src={image} alt="" fill className="media-zoom object-cover" sizes="128px" />
        </div>
      )}

      {event.registrationLink && (
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-md bg-[#034694] px-4 py-2.5 text-center text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#022B5C]"
        >
          Anmäl dig
        </a>
      )}
    </article>
  )
}

export default async function EvenemangPage({ params }: PageProps) {
  const { locale } = await params
  const [{ upcoming, past }, site] = await Promise.all([
    getEvents(locale),
    getSiteConfig(locale),
  ])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Evenemang
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Pubkvällar, resor till London och årsmöten. Allt som händer i föreningen
          samlat på ett ställe.
        </p>
      </div>

      <section className="mt-9">
        <div className="mb-5 flex items-center gap-3">
          <span className="section-marker" aria-hidden="true" />
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#022B5C]">
            På gång
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
            <p className="text-[14px] text-slate-500">
              Inga evenemang är inplanerade just nu.
            </p>
            <p className="mt-2 text-[13px] text-slate-400">
              Vill du dra igång något i din stad? Mejla{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-[#034694] hover:underline"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i, 6) * 50}>
                <EventRow event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <span className="section-marker opacity-40" aria-hidden="true" />
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-slate-400">
              Tidigare
            </h2>
          </div>
          <div className="space-y-3 opacity-70">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
