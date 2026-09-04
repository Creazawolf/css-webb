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
    <span className="flex items-baseline">
      <span className="font-display tabular text-[17px] font-bold leading-none tracking-[0.02em] text-white">
        {String(value).padStart(2, '0')}
      </span>
      <span className="ml-px text-[9px] font-semibold uppercase leading-none tracking-[0.14em] text-white/50">
        {label}
      </span>
    </span>
  )
}

function Dot({ className = '' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`h-[5px] w-[5px] flex-none rounded-full bg-white/[0.28] ${className}`}
    />
  )
}

/**
 * Smalt band direkt under menyn: nästa match och en levande nedräkning.
 *
 * Nedräkningen räknas bara på klienten — servern och webbläsaren skulle annars
 * rendera olika sekundvärden och React klaga på hydreringsfel. Samma mönster
 * som Matchcenter använder.
 */
export default function NextMatchBar({ locale, match }: NextMatchBarProps) {
  const [remaining, setRemaining] = useState<Remaining | null>(null)
  const [started, setStarted] = useState(false)

  // Byts matchen ska nedräkningen nollas direkt. Justeras under render — en
  // effekt hade gett en extra renderingsvända med den gamla siffran kvar.
  const isoDate = match?.isoDate ?? null
  const [countingFor, setCountingFor] = useState(isoDate)
  if (countingFor !== isoDate) {
    setCountingFor(isoDate)
    setRemaining(null)
    setStarted(false)
  }

  useEffect(() => {
    if (!isoDate) return

    const target = new Date(isoDate).getTime()
    if (Number.isNaN(target)) return

    const tick = () => {
      const next = diff(target, Date.now())
      setRemaining(next)
      setStarted(next === null)
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [isoDate])

  if (!match) return null

  const isHome = match.homeTeam.toLowerCase().includes('chelsea')
  const opponent = isHome ? match.awayTeam : match.homeTeam
  const live = started || match.isLive

  return (
    <div className="bg-[rgb(var(--color-night))] text-white">
      <div className="mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-x-7 gap-y-2 px-4 py-3 sm:px-6 lg:min-h-[62px] lg:flex-nowrap lg:gap-x-7 lg:py-0 lg:px-8">
        <span className="flex flex-none items-center gap-2 text-[10px] font-bold uppercase leading-none tracking-[0.20em] text-[rgb(var(--color-gold))]">
          {live && (
            <span
              className="live-dot inline-block h-[7px] w-[7px] rounded-full bg-[rgb(var(--color-gold))]"
              aria-hidden="true"
            />
          )}
          {live ? 'Pågår nu' : 'Nästa match'}
        </span>

        <span className="flex min-w-0 items-center gap-3 text-[14px] font-semibold leading-none">
          {match.league && (
            <>
              <span className="hidden whitespace-nowrap text-white/[0.62] xl:inline">
                {match.league}
              </span>
              <Dot className="hidden xl:block" />
            </>
          )}
          <span className="whitespace-nowrap">
            {isHome ? 'Chelsea' : opponent}
            <span className="mx-2 text-white/40">&ndash;</span>
            {isHome ? opponent : 'Chelsea'}
          </span>
          {match.venue && (
            <>
              <Dot className="hidden xl:block" />
              <span className="hidden whitespace-nowrap text-white/[0.62] xl:inline">
                {match.venue}
              </span>
            </>
          )}
          <Dot className="hidden sm:block" />
          <time
            dateTime={match.isoDate}
            className="hidden flex-none text-white/[0.62] sm:inline"
          >
            {match.date}
          </time>
        </span>

        <span className="ml-auto flex flex-none items-baseline gap-[5px]">
          {remaining ? (
            <>
              <Unit value={remaining.days} label="dygn" />
              <Unit value={remaining.hours} label="tim" />
              <Unit value={remaining.minutes} label="min" />
              <Unit value={remaining.seconds} label="sek" />
            </>
          ) : (
            /* Innan klienten hunnit räkna, och när matchen har startat. */
            <time
              dateTime={match.isoDate}
              className="text-[12px] font-semibold leading-none text-white/75"
            >
              {match.date}
            </time>
          )}
        </span>

        <Link
          href={`/${locale}/motesplatser` as Route}
          className="ml-1 hidden min-h-[44px] flex-none items-center gap-[7px] border-l border-white/[0.14] pl-7 text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-gold))] transition-colors hover:text-[rgb(var(--color-gold-light))] sm:inline-flex"
        >
          Se matchen med oss
          <svg
            viewBox="0 0 24 24"
            className="h-3 w-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
