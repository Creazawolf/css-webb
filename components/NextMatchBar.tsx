'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Route } from 'next'

import type { MatchData } from '@/lib/chelsea-matches'

type NextMatchBarProps = {
  locale: string
  match: MatchData | null
}

type Remaining = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(target: number, now: number): Remaining | null {
  const ms = target - now
  if (ms <= 0) return null
  const totalSeconds = Math.floor(ms / 1000)
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}


function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="tabular font-display text-lg font-bold leading-none text-white sm:text-xl">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/65">
        {label}
      </span>
    </div>
  )
}

/**
 * Smal rad direkt under menyn med nästa match och en levande nedräkning.
 *
 * Nedräkningen räknas först på klienten — servern och klienten skulle annars
 * rendera olika sekundvärden och React skulle klaga på hydreringsfel.
 */
export default function NextMatchBar({ locale, match }: NextMatchBarProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!match) return

    const target = new Date(match.isoDate).getTime()
    if (Number.isNaN(target)) return

    const tick = () => {
      const next = diff(target, Date.now())
      setRemaining(next)
      setStarted(next === null)
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [match])

  if (!match) return null

  const isHome = match.homeTeam.toLowerCase().includes('chelsea')
  const opponent = isHome ? match.awayTeam : match.homeTeam

  return (
    <div className="border-b border-white/5 bg-[#022B5C]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Etikett */}
        <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#D4A843]">
          {started ? (
            <>
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
              Matchdags
            </>
          ) : (
            'Nästa match'
          )}
        </span>

        {/* Lagen */}
        <div className="flex min-w-0 items-center gap-2 text-[13px] font-semibold text-white">
          <span className="truncate">
            {isHome ? 'Chelsea' : opponent}
            <span className="mx-1.5 text-white/30">–</span>
            {isHome ? opponent : 'Chelsea'}
          </span>
          <span className="hidden rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/70 sm:inline-block">
            {isHome ? 'Hemma' : 'Borta'}
          </span>
        </div>

        {/* Avspark */}
        <span className="hidden text-[12px] text-white/70 md:inline">
          {match.date} · {match.league}
        </span>

        {/* Nedräkning */}
        <div className="ml-auto flex items-center gap-3">
          {remaining ? (
            <div className="flex items-center gap-3">
              {remaining.days > 0 && <Unit value={remaining.days} label="dgr" />}
              <Unit value={remaining.hours} label="tim" />
              <Unit value={remaining.minutes} label="min" />
              <Unit value={remaining.seconds} label="sek" />
            </div>
          ) : (
            /* Innan klienten hunnit räkna, och när matchen har startat */
            <span className="text-[12px] font-semibold text-white/75">
              {started ? 'Pågår nu' : match.date}
            </span>
          )}

          <Link
            href={`/${locale}/motesplatser` as Route}
            className="hidden shrink-0 rounded-md bg-[#D4A843] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.06em] text-[#022B5C] transition-colors hover:bg-[#E8C96A] sm:inline-block"
          >
            Se matchen med oss
          </Link>
        </div>
      </div>
    </div>
  )
}
