'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

import type { MatchCenterData, MatchData, PlayerStat, StandingRow } from '@/lib/api-football'

type MatchCenterProps = {
  locale: string
  herrar?: MatchCenterData | null | undefined
  damer?: MatchCenterData | null | undefined
}

const tableTabs = ['Tabell', 'Målskyttar', 'Assist'] as const
type TableTab = (typeof tableTabs)[number]

const EMPTY: MatchCenterData = {
  lastMatch: null,
  nextMatch: null,
  standings: [],
  topScorers: [],
  topAssists: [],
}

/** Gemensam tomtext — matchdata kommer utifrån och kan saknas tillfälligt. */
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-8 text-center">
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-slate-300"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
      </svg>
      <p className="max-w-[15rem] text-[13px] leading-relaxed text-slate-500">{children}</p>
    </div>
  )
}

function TeamBadge({ logo, abbr, name }: { logo: string; abbr: string; name: string }) {
  const isChelsea = name.toLowerCase().includes('chelsea')

  return (
    <div className="flex flex-col items-center gap-2">
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-contain"
        />
      ) : (
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isChelsea ? 'bg-[#034694]' : 'bg-slate-400'
          }`}
        >
          <span className="font-display text-sm font-bold text-white">{abbr}</span>
        </div>
      )}
      <span className="max-w-[6rem] text-center text-[12px] font-semibold leading-tight text-slate-700">
        {name}
      </span>
    </div>
  )
}

function MatchCard({
  match,
  label,
  locale,
}: {
  match: MatchData | null
  label: string
  locale: string
}) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
      <h3 className="font-display mb-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </h3>

      {!match ? (
        <EmptyState>Matchdata är inte tillgänglig just nu.</EmptyState>
      ) : (
        <>
          <p className="mb-3 text-center text-[11px] text-slate-500">
            {match.date} &middot; {match.league}
          </p>

          <div className="flex items-center justify-center gap-5">
            <TeamBadge logo={match.homeLogo} abbr={match.homeAbbr} name={match.homeTeam} />

            {match.homeGoals !== null && match.awayGoals !== null ? (
              <div className="score-display text-4xl font-bold text-[#022B5C]">
                {match.homeGoals}
                <span className="mx-1 text-slate-300">:</span>
                {match.awayGoals}
              </div>
            ) : (
              <span className="font-display text-2xl font-bold text-slate-300">VS</span>
            )}

            <TeamBadge logo={match.awayLogo} abbr={match.awayAbbr} name={match.awayTeam} />
          </div>

          <div className="mt-auto pt-5 text-center">
            {match.venue ? (
              <span className="text-[12px] text-slate-500">{match.venue}</span>
            ) : (
              <Link
                href={`/${locale}/matcher/spelschema` as Route}
                className="text-[12px] font-semibold text-[#034694] hover:underline"
              >
                Hela spelschemat
              </Link>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StandingsTable({ standings }: { standings: StandingRow[] }) {
  if (standings.length === 0) {
    return <EmptyState>Tabellen är inte tillgänglig just nu.</EmptyState>
  }

  return (
    <table className="w-full text-left text-[12px]">
      <caption className="sr-only">Tabellställning</caption>
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
          <th scope="col" className="pb-2 font-semibold">#</th>
          <th scope="col" className="pb-2 font-semibold">Lag</th>
          <th scope="col" className="pb-2 text-center font-semibold" title="Spelade">S</th>
          <th scope="col" className="pb-2 text-center font-semibold" title="Vunna">V</th>
          <th scope="col" className="pb-2 text-center font-semibold" title="Oavgjorda">O</th>
          <th scope="col" className="pb-2 text-right font-semibold" title="Poäng">P</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((row) => {
          const isChelsea = row.team.toLowerCase().includes('chelsea')
          return (
            <tr
              key={row.teamId}
              className={`border-t border-slate-100 ${
                isChelsea ? 'table-row-highlight font-bold text-[#034694]' : 'text-slate-700'
              }`}
            >
              <td className="py-2">{row.pos}</td>
              <td className="py-2 font-semibold">{row.team}</td>
              <td className="py-2 text-center">{row.played}</td>
              <td className="py-2 text-center">{row.won}</td>
              <td className="py-2 text-center">{row.drawn}</td>
              <td className="py-2 text-right font-bold">{row.points}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

function PlayerStatsTable({ players, label }: { players: PlayerStat[]; label: string }) {
  if (players.length === 0) {
    return <EmptyState>Statistiken är inte tillgänglig just nu.</EmptyState>
  }

  return (
    <table className="w-full text-left text-[12px]">
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.1em] text-slate-500">
          <th scope="col" className="pb-2 font-semibold">#</th>
          <th scope="col" className="pb-2 font-semibold">Spelare</th>
          <th scope="col" className="pb-2 font-semibold">Lag</th>
          <th scope="col" className="pb-2 text-right font-semibold">{label}</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, i) => {
          const isChelsea = player.team.toLowerCase().includes('chelsea')
          return (
            <tr
              key={`${player.name}-${player.team}`}
              className={`border-t border-slate-100 ${
                isChelsea ? 'font-bold text-[#034694]' : 'text-slate-700'
              }`}
            >
              <td className="py-2">{i + 1}</td>
              <td className="py-2 font-semibold">{player.name}</td>
              <td className="py-2">{player.team}</td>
              <td className="py-2 text-right font-bold">{player.value}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

/**
 * Matchcenter: senaste och nästa match plus tabell och skytteliga.
 *
 * All data kommer från API-Football. Saknas den visar vi en tydlig tomtext —
 * aldrig påhittade resultat, som skulle vara sämre än inget alls.
 */
export default function MatchCenter({ locale, herrar, damer }: MatchCenterProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')
  const [activeTab, setActiveTab] = useState<TableTab>('Tabell')

  const data = (activeTeam === 'herrar' ? herrar : damer) ?? EMPTY

  const pill = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors ${
      active
        ? 'bg-[#034694] text-white'
        : 'border border-slate-200 bg-white text-slate-600 hover:border-[#034694] hover:text-[#034694]'
    }`

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center gap-2" role="group" aria-label="Välj lag">
        <button
          type="button"
          onClick={() => setActiveTeam('herrar')}
          aria-pressed={activeTeam === 'herrar'}
          className={pill(activeTeam === 'herrar')}
        >
          Herrar
        </button>
        <button
          type="button"
          onClick={() => setActiveTeam('damer')}
          aria-pressed={activeTeam === 'damer'}
          className={pill(activeTeam === 'damer')}
        >
          Damer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <MatchCard match={data.lastMatch} label="Senaste match" locale={locale} />
        <MatchCard match={data.nextMatch} label="Nästa match" locale={locale} />

        <div className="flex flex-col rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex border-b border-slate-100">
            {tableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                aria-pressed={activeTab === tab}
                className={`px-3 pb-2.5 text-[12px] font-semibold tracking-[0.02em] transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#034694] text-[#034694]'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {activeTab === 'Tabell' && <StandingsTable standings={data.standings} />}
            {activeTab === 'Målskyttar' && (
              <PlayerStatsTable players={data.topScorers} label="Mål" />
            )}
            {activeTab === 'Assist' && (
              <PlayerStatsTable players={data.topAssists} label="Assist" />
            )}
          </div>

          <div className="mt-4 flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
            <Link
              href={`/${locale}/matcher/spelschema` as Route}
              className="text-[11px] font-semibold text-[#034694] hover:underline"
            >
              Spelschema
            </Link>
            <Link
              href={`/${locale}/matcher/tabell` as Route}
              className="text-[11px] font-semibold text-[#034694] hover:underline"
            >
              Full tabell
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
