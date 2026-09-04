import Link from 'next/link'
import type { Route } from 'next'

import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { EVENT_TYPE_LABELS, type EventCard } from '@/lib/site'

type EventsStripProps = {
  locale: string
  events: EventCard[]
}

const WEEKDAYS_SV = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']
const MONTHS_SHORT = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
]

function DateBlock({ iso }: { iso: string }) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null

  return (
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-paper-deep))]">
      <span className="font-display text-[22px] font-bold leading-none tracking-[-0.02em] text-[rgb(var(--color-chelsea-blue-dark))]">
        {d.getDate()}
      </span>
      <span className="mt-1 text-[9.5px] font-bold uppercase leading-none tracking-[0.13em] text-[rgb(var(--color-muted))]">
        {MONTHS_SHORT[d.getMonth()]}
      </span>
    </div>
  )
}

function formatWhen(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return `${WEEKDAYS_SV[d.getDay()]} ${time}`
}

/**
 * Kommande evenemang på startsidan. Visas bara när det faktiskt finns något
 * inbokat — en tom "inga evenemang"-ruta gör startsidan sämre, inte bättre.
 */
export default function EventsStrip({ locale, events }: EventsStripProps) {
  if (events.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading
        title="På gång"
        href={`/${locale}/evenemang` as Route}
        linkLabel="Alla evenemang"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event, i) => (
          <Reveal key={event.id} className="h-full" delay={Math.min(i, 5) * 60}>
            <Link
              href={`/${locale}/evenemang` as Route}
              className="card-lift group flex h-full items-center gap-4 rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-5 py-[18px]"
            >
              <DateBlock iso={event.date} />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
                  {EVENT_TYPE_LABELS[event.eventType] ?? 'Evenemang'}
                </span>
                <h3 className="font-display mt-2 line-clamp-2 text-[17px] font-semibold leading-[1.22] tracking-[0.005em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
                  {event.title}
                </h3>
                <p className="mt-2 line-clamp-1 text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
                  {formatWhen(event.date)} · {event.location}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
