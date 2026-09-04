import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'

import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
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
    <article className="card-lift group flex flex-col gap-5 overflow-hidden rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] p-5 sm:flex-row sm:items-center">
      {/* Datumblock */}
      <div className="flex h-[68px] w-[68px] shrink-0 flex-col items-center justify-center rounded-md bg-[rgb(var(--color-night))] text-white">
        <span className="font-display tabular text-[26px] font-bold leading-none">
          {Number.isNaN(d.getTime()) ? '–' : d.getDate()}
        </span>
        <span className="mt-1.5 text-[9.5px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold))]">
          {Number.isNaN(d.getTime()) ? '' : MONTHS_SHORT[d.getMonth()]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
          {EVENT_TYPE_LABELS[event.eventType] ?? 'Evenemang'}
          {event.city ? ` · ${event.city}` : ''}
        </span>
        <h3 className="font-display mt-2.5 text-[20px] font-semibold leading-[1.24] tracking-[0.005em] text-[rgb(var(--color-text))]">
          {event.title}
        </h3>
        <p className="mt-2 text-[11.5px] font-medium leading-[1.4] text-[rgb(var(--color-muted))]">
          {formatFull(event.date)} · {event.location}
        </p>
      </div>

      {image && (
        <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-md bg-[rgb(var(--color-chelsea-blue-dark))] lg:block">
          <Image src={image} alt="" fill className="media-zoom object-cover" sizes="128px" />
        </div>
      )}

      {event.registrationLink && (
        <a
          href={event.registrationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-md bg-[rgb(var(--color-chelsea-blue))] px-5 py-3 text-center text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-white transition-colors hover:bg-[rgb(var(--color-chelsea-blue-dark))]"
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
          Evenemang
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Pubkvällar, resor till London och årsmöten. Allt som händer i föreningen
          samlat på ett ställe.
        </p>
      </header>

      <section className="mt-12">
        <SectionHeading title="På gång" />

        {upcoming.length === 0 ? (
          <div className="rounded-md border border-dashed border-[rgb(var(--color-rule-ctl))] bg-[rgb(var(--color-card))] px-6 py-14 text-center">
            <p className="font-serif text-[16px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
              Inga evenemang är inplanerade just nu.
            </p>
            <p className="font-serif mx-auto mt-2 max-w-lg text-[15px] leading-[1.6] text-[rgb(var(--color-muted))]">
              Vill du dra igång något i din stad? Mejla{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-[rgb(var(--color-chelsea-blue))] underline underline-offset-[3px] hover:text-[rgb(var(--color-chelsea-blue-dark))]"
              >
                {site.email}
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((event, i) => (
              <Reveal key={event.id} delay={Math.min(i, 6) * 50}>
                <EventRow event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-14">
          <SectionHeading title="Tidigare" />
          <div className="space-y-4">
            {past.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
