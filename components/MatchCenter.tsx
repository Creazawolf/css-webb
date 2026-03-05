'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { MatchCenterData, MatchData, PlayerStat, StandingRow } from '@/lib/api-football'

// --- Fallback data (current hardcoded values) ---

const FALLBACK_HERRAR: MatchCenterData = {
  lastMatch: {
    homeTeam: 'Chelsea',
    awayTeam: 'Arsenal',
    homeAbbr: 'CHE',
    awayAbbr: 'ARS',
    homeLogo: '',
    awayLogo: '',
    homeGoals: 2,
    awayGoals: 1,
    date: '22 feb, 18:30',
    isoDate: '2026-02-22T18:30:00+00:00',
    league: 'Premier League',
    venue: 'Stamford Bridge',
  },
  nextMatch: {
    homeTeam: 'Chelsea',
    awayTeam: 'Aston Villa',
    homeAbbr: 'CHE',
    awayAbbr: 'AVL',
    homeLogo: '',
    awayLogo: '',
    homeGoals: null,
    awayGoals: null,
    date: '1 mar, 17:30',
    isoDate: '2026-03-01T17:30:00+00:00',
    league: 'Premier League',
    venue: 'Stamford Bridge',
  },
  standings: [
    { pos: 1, team: 'Liverpool', teamId: 40, played: 26, won: 19, drawn: 6, lost: 1, goalsFor: 58, goalsAgainst: 22, points: 63 },
    { pos: 2, team: 'Arsenal', teamId: 42, played: 26, won: 17, drawn: 5, lost: 4, goalsFor: 52, goalsAgainst: 24, points: 56 },
    { pos: 3, team: 'Nottingham Forest', teamId: 65, played: 26, won: 15, drawn: 6, lost: 5, goalsFor: 42, goalsAgainst: 26, points: 51 },
    { pos: 4, team: 'Chelsea', teamId: 49, played: 26, won: 14, drawn: 6, lost: 6, goalsFor: 50, goalsAgainst: 30, points: 48 },
    { pos: 5, team: 'Manchester City', teamId: 50, played: 26, won: 14, drawn: 5, lost: 7, goalsFor: 49, goalsAgainst: 29, points: 47 },
  ],
  topScorers: [
    { name: 'M. Salah', team: 'Liverpool', value: 18 },
    { name: 'A. Isak', team: 'Newcastle', value: 15 },
    { name: 'E. Haaland', team: 'Man City', value: 14 },
    { name: 'C. Palmer', team: 'Chelsea', value: 13 },
    { name: 'B. Saka', team: 'Arsenal', value: 12 },
  ],
  topAssists: [
    { name: 'M. Salah', team: 'Liverpool', value: 13 },
    { name: 'C. Palmer', team: 'Chelsea', value: 8 },
    { name: 'B. Saka', team: 'Arsenal', value: 8 },
    { name: 'N. Jackson', team: 'Chelsea', value: 7 },
    { name: 'T. Alexander-Arnold', team: 'Liverpool', value: 7 },
  ],
}

const FALLBACK_DAMER: MatchCenterData = {
  lastMatch: null,
  nextMatch: null,
  standings: [],
  topScorers: [],
  topAssists: [],
}

// --- Types ---

type MatchCenterProps = {
  locale: string
  herrar?: MatchCenterData | null | undefined
  damer?: MatchCenterData | null | undefined
}

type TeamBadgeProps = {
  logo: string
  abbr: string
  name: string
}

const tableTabs = ['Tabell', 'Målskyttar', 'Assist'] as const
type TableTab = (typeof tableTabs)[number]

// --- Sub-components ---

function TeamBadge({ logo, abbr, name }: TeamBadgeProps) {
  const isChelsea = name.toLowerCase().includes('chelsea')
  const bgColor = isChelsea ? 'bg-[#034694]' : 'bg-slate-400'

  return (
    <div className="flex flex-col items-center gap-2">
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-contain"
        />
      ) : (
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor}`}>
          <span className="font-display text-sm font-bold text-white">{abbr}</span>
        </div>
      )}
      <span className="text-[12px] font-semibold text-slate-700">{name}</span>
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
  if (!match) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-display mb-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
          {label}
        </h3>
        <p className="py-8 text-center text-sm text-slate-400">Ingen matchdata</p>
      </div>
    )
  }

  const isPlayed = match.homeGoals !== null && match.awayGoals !== null

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="font-display mb-4 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
        {label}
      </h3>
      <p className="mb-3 text-center text-[11px] text-slate-400">
        {match.date} &middot; {match.league}
      </p>

      <div className="flex items-center justify-center gap-5">
        <TeamBadge logo={match.homeLogo} abbr={match.homeAbbr} name={match.homeTeam} />

        {isPlayed ? (
          <div className="score-display text-4xl font-bold text-[#022B5C]">
            {match.homeGoals}<span className="mx-1 text-slate-300">:</span>{match.awayGoals}
          </div>
        ) : (
          <span className="font-display text-2xl font-bold text-slate-300">VS</span>
        )}

        <TeamBadge logo={match.awayLogo} abbr={match.awayAbbr} name={match.awayTeam} />
      </div>

      <div className="mt-5 text-center">
        {isPlayed ? (
          <Link
            href={`/${locale}/matcher`}
            className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-600 transition-colors hover:border-[#034694] hover:text-[#034694]"
          >
            Matchcenter
          </Link>
        ) : (
          <div className="inline-flex items-center gap-3 text-[12px] text-slate-400">
            <span>{match.venue}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function StandingsTable({ standings }: { standings: StandingRow[] }) {
  return (
    <table className="w-full text-left text-[12px]">
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
          <th className="pb-2 font-semibold">#</th>
          <th className="pb-2 font-semibold">Lag</th>
          <th className="pb-2 text-center font-semibold">S</th>
          <th className="pb-2 text-center font-semibold">V</th>
          <th className="pb-2 text-center font-semibold">O</th>
          <th className="pb-2 text-right font-semibold">P</th>
        </tr>
      </thead>
      <tbody>
        {standings.map((row) => {
          const isChelsea = row.team.toLowerCase().includes('chelsea')
          return (
            <tr
              key={row.pos}
              className={`border-t border-slate-50 ${isChelsea ? 'table-row-highlight font-bold text-[#034694]' : 'text-slate-600'}`}
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

function PlayerStatsTable({
  players,
  label,
}: {
  players: PlayerStat[]
  label: string
}) {
  if (players.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-400">Ingen data tillgänglig</p>
  }

  return (
    <table className="w-full text-left text-[12px]">
      <thead>
        <tr className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
          <th className="pb-2 font-semibold">#</th>
          <th className="pb-2 font-semibold">Spelare</th>
          <th className="pb-2 font-semibold">Lag</th>
          <th className="pb-2 text-right font-semibold">{label}</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, i) => {
          const isChelsea = player.team.toLowerCase().includes('chelsea')
          return (
            <tr
              key={`${player.name}-${player.team}`}
              className={`border-t border-slate-50 ${isChelsea ? 'font-bold text-[#034694]' : 'text-slate-600'}`}
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

// --- Main component ---

export default function MatchCenter({ locale, herrar, damer }: MatchCenterProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')
  const [activeTab, setActiveTab] = useState<TableTab>('Tabell')

  const data =
    activeTeam === 'herrar'
      ? (herrar ?? FALLBACK_HERRAR)
      : (damer ?? FALLBACK_DAMER)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Team selector pills */}
      <div className="mb-5 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTeam('herrar')}
          className={`rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors ${
            activeTeam === 'herrar'
              ? 'bg-[#034694] text-white'
              : 'border border-slate-200 bg-white text-slate-500 hover:border-[#034694] hover:text-[#034694]'
          }`}
        >
          Herrar
        </button>
        <button
          type="button"
          onClick={() => setActiveTeam('damer')}
          className={`rounded-full px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.06em] transition-colors ${
            activeTeam === 'damer'
              ? 'bg-[#034694] text-white'
              : 'border border-slate-200 bg-white text-slate-500 hover:border-[#034694] hover:text-[#034694]'
          }`}
        >
          Damer
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Last match */}
        <MatchCard match={data.lastMatch} label="Senaste Match" locale={locale} />

        {/* Next match */}
        <MatchCard match={data.nextMatch} label="Nästa Match" locale={locale} />

        {/* League table / stats */}
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          {/* Table tabs */}
          <div className="mb-4 flex border-b border-slate-100">
            {tableTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 pb-2.5 text-[12px] font-semibold tracking-[0.02em] transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-[#034694] text-[#034694]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'Tabell' && <StandingsTable standings={data.standings} />}
          {activeTab === 'Målskyttar' && (
            <PlayerStatsTable players={data.topScorers} label="Mål" />
          )}
          {activeTab === 'Assist' && (
            <PlayerStatsTable players={data.topAssists} label="Assist" />
          )}

          <div className="mt-3 flex items-center justify-end gap-3">
            <Link
              href={`/${locale}/matcher/spelschema` as `/${string}`}
              className="text-[11px] font-semibold text-[#034694] hover:underline"
            >
              Spelschema
            </Link>
            <Link
              href={`/${locale}/matcher/tabell` as `/${string}`}
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
