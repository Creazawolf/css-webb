'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { MatchData } from '@/lib/api-football'

const SV_MONTH_NAMES = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
] as const

type ScheduleProps = {
  locale: string
  herrar: MatchData[] | null
  damer: MatchData[] | null
}

type GroupedFixtures = { label: string; matches: MatchData[] }[]

function groupByMonth(matches: MatchData[]): GroupedFixtures {
  const groups: Map<string, MatchData[]> = new Map()

  for (const match of matches) {
    const d = new Date(match.isoDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = `${SV_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push({ ...match, _label: label } as MatchData & { _label: string })
  }

  return Array.from(groups.entries()).map(([, items]) => {
    const d = new Date(items[0]!.isoDate)
    return {
      label: `${SV_MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`,
      matches: items,
    }
  })
}

function TeamCell({ name, logo }: { name: string; logo: string }) {
  const isChelsea = name.toLowerCase().includes('chelsea')
  return (
    <div className="flex items-center gap-2">
      {logo ? (
        <Image
          src={logo}
          alt={name}
          width={24}
          height={24}
          className="h-6 w-6 rounded-full object-contain"
        />
      ) : (
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isChelsea ? 'bg-[#034694]' : 'bg-slate-300'}`}>
          <span className="text-[8px] font-bold text-white">{name.slice(0, 3).toUpperCase()}</span>
        </div>
      )}
      <span className={`text-[12px] whitespace-nowrap ${isChelsea ? 'font-bold text-[#034694]' : 'text-slate-700'}`}>
        {name}
      </span>
    </div>
  )
}

export default function Schedule({ locale, herrar, damer }: ScheduleProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')

  const matches = activeTeam === 'herrar' ? herrar : damer
  const grouped = useMemo(() => (matches ? groupByMonth(matches) : []), [matches])

  return (
    <div>
      {/* Team selector pills */}
      <div className="mb-6 flex items-center gap-2">
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

      {!matches || matches.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <p className="text-center text-sm text-slate-400">Inget spelschema tillgängligt</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.label}>
              <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-[0.1em] text-slate-500">
                {group.label}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-[12px]">
                  <tbody>
                    {group.matches.map((match, i) => {
                      const isPlayed = match.homeGoals !== null && match.awayGoals !== null
                      return (
                        <tr
                          key={`${match.isoDate}-${i}`}
                          className="border-t border-slate-50 first:border-t-0"
                        >
                          <td className="py-3 pl-4 pr-2 text-[11px] text-slate-400 whitespace-nowrap">
                            {match.date}
                          </td>
                          <td className="py-3 px-2">
                            <TeamCell name={match.homeTeam} logo={match.homeLogo} />
                          </td>
                          <td className="py-3 px-2 text-center">
                            {isPlayed ? (
                              <span className="score-display font-bold text-[#022B5C]">
                                {match.homeGoals} &ndash; {match.awayGoals}
                              </span>
                            ) : (
                              <span className="font-bold text-slate-300">VS</span>
                            )}
                          </td>
                          <td className="py-3 px-2">
                            <TeamCell name={match.awayTeam} logo={match.awayLogo} />
                          </td>
                          <td className="py-3 px-2 text-[11px] text-slate-400 whitespace-nowrap hidden sm:table-cell">
                            {match.league}
                          </td>
                          <td className="py-3 pl-2 pr-4 text-[11px] text-slate-400 whitespace-nowrap hidden md:table-cell">
                            {match.venue}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
