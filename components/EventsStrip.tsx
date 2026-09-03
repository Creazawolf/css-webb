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
    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-[#022B5C] text-white">
      <span className="font-display text-xl font-bold leading-none">{d.getDate()}</span>
      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#D4A843]">
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
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading
        title="På gång"
        href={`/${locale}/evenemang` as Route}
        linkLabel="Alla evenemang"
      />

      <Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/${locale}/evenemang` as Route}
              className="card-lift flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white p-4 shadow-[var(--shadow-card)]"
            >
              <DateBlock iso={event.date} />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#D4A843]">
                  {EVENT_TYPE_LABELS[event.eventType] ?? 'Evenemang'}
                </span>
                <h3 className="mt-0.5 line-clamp-1 text-[14px] font-bold text-slate-900">
                  {event.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-500">
                  {formatWhen(event.date)} · {event.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Reveal>
    </section>
  )
}
