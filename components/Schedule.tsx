'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import type { MatchData } from '@/lib/chelsea-matches'

const SV_MONTH_NAMES = [
  'Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni',
  'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December',
] as const

const TH =
  'pb-3 pt-[18px] text-[9.5px] font-bold uppercase leading-none tracking-[0.14em] text-[rgb(var(--color-muted))]'

const TD = 'border-t border-[rgb(var(--color-rule))] py-[13px]'

type ScheduleProps = {
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

function TeamCell({ name, logo, align }: { name: string; logo: string; align: 'left' | 'right' }) {
  const isChelsea = name.toLowerCase().includes('chelsea')

  return (
    <span
      className={`flex items-center gap-2.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}
    >
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6 flex-none rounded-full object-contain"
        />
      ) : (
        <span
          className={`flex h-6 w-6 flex-none items-center justify-center rounded-full text-[8px] font-bold leading-none text-white ${
            isChelsea
              ? 'bg-[rgb(var(--color-chelsea-blue))]'
              : 'bg-[rgb(var(--color-rule-2))]'
          }`}
        >
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
      <span
        className={`font-display whitespace-nowrap text-[15px] leading-[1.25] ${
          isChelsea
            ? 'font-bold text-[rgb(var(--color-chelsea-blue))]'
            : 'font-semibold text-[rgb(var(--color-text))]'
        }`}
      >
        {name}
      </span>
    </span>
  )
}

export default function Schedule({ herrar, damer }: ScheduleProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')

  const matches = activeTeam === 'herrar' ? herrar : damer
  const grouped = useMemo(() => (matches ? groupByMonth(matches) : []), [matches])

  const teams = [
    { key: 'herrar' as const, label: 'Herrar' },
    { key: 'damer' as const, label: 'Damer' },
  ]

  return (
    <div>
      <div className="flex justify-end">
        <div
          className="inline-flex flex-none rounded-full border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-paper-deep))] p-1"
          role="group"
          aria-label="Välj lag"
        >
          {teams.map((team) => {
            const active = activeTeam === team.key
            return (
              <button
                key={team.key}
                type="button"
                onClick={() => setActiveTeam(team.key)}
                aria-pressed={active}
                className={`min-h-[44px] rounded-full px-6 text-[12px] font-bold uppercase leading-none tracking-[0.10em] transition-colors ${
                  active
                    ? 'bg-[rgb(var(--color-text))] text-white'
                    : 'text-[rgb(var(--color-ink-2))] hover:text-[rgb(var(--color-chelsea-blue))]'
                }`}
              >
                {team.label}
              </button>
            )
          })}
        </div>
      </div>

      {!matches || matches.length === 0 ? (
        <p className="font-serif py-10 text-[15px] leading-[1.6] text-[rgb(var(--color-muted))]">
          Spelschemat är inte tillgängligt just nu.
        </p>
      ) : (
        <div className="mt-8 space-y-12">
          {grouped.map((group) => (
            <section key={group.label}>
              <h2 className="font-display border-b-2 border-[rgb(var(--color-text))] pb-4 text-[13px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-text))]">
                {group.label}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13.5px] font-medium">
                  <caption className="sr-only">Matcher i {group.label}</caption>
                  <thead>
                    <tr>
                      <th scope="col" className={`${TH} w-[130px]`}>
                        Datum
                      </th>
                      <th scope="col" className={`${TH} text-right`}>
                        Hemma
                      </th>
                      <th scope="col" className={`${TH} w-[86px] text-center`}>
                        Resultat
                      </th>
                      <th scope="col" className={TH}>
                        Borta
                      </th>
                      <th scope="col" className={`${TH} hidden sm:table-cell`}>
                        Tävling
                      </th>
                      <th scope="col" className={`${TH} hidden md:table-cell`}>
                        Arena
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.matches.map((match, i) => {
                      const isPlayed = match.homeGoals !== null && match.awayGoals !== null
                      return (
                        <tr key={`${match.isoDate}-${i}`}>
                          <td className={`${TD} text-[rgb(var(--color-ink-2))]`}>
                            <time
                              dateTime={match.isoDate}
                              className="tabular whitespace-nowrap text-[12.5px] font-semibold leading-[1.4]"
                            >
                              {match.date}
                            </time>
                          </td>
                          <td className={`${TD} text-right`}>
                            <TeamCell
                              name={match.homeTeam}
                              logo={match.homeLogo}
                              align="right"
                            />
                          </td>
                          <td className={`${TD} text-center`}>
                            {isPlayed ? (
                              <span className="font-display tabular text-[17px] font-bold leading-none tracking-[-0.02em] text-[rgb(var(--color-text))]">
                                {match.homeGoals}
                                <span className="mx-1.5 text-[rgb(var(--color-rule-2))]">
                                  &ndash;
                                </span>
                                {match.awayGoals}
                              </span>
                            ) : (
                              <span className="font-display text-[13px] font-bold uppercase leading-none tracking-[0.14em] text-[rgb(var(--color-rule-2))]">
                                vs
                              </span>
                            )}
                          </td>
                          <td className={TD}>
                            <TeamCell
                              name={match.awayTeam}
                              logo={match.awayLogo}
                              align="left"
                            />
                          </td>
                          <td
                            className={`${TD} hidden whitespace-nowrap text-[11.5px] text-[rgb(var(--color-muted))] sm:table-cell`}
                          >
                            {match.league}
                          </td>
                          <td
                            className={`${TD} hidden whitespace-nowrap text-[11.5px] text-[rgb(var(--color-muted))] md:table-cell`}
                          >
                            {match.venue}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
