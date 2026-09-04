'use client'

import { useState } from 'react'
import type { StandingRow } from '@/lib/chelsea-matches'

/** Formkurvan från Chelseas tabell: nyaste matchen först. */
const FORM_TONES: Record<string, string> = {
  W: 'bg-[#16a34a]',
  D: 'bg-[#94a3b8]',
  L: 'bg-[#dc2626]',
}
const FORM_LABELS: Record<string, string> = { W: 'vinst', D: 'oavgjort', L: 'förlust' }

const TH =
  'pb-3 pt-[18px] text-[9.5px] font-bold uppercase leading-none tracking-[0.14em] text-[rgb(var(--color-muted))]'

const TD = 'border-t border-[rgb(var(--color-rule))] py-[13px]'

const ABBR = 'cursor-help no-underline'

type FullTableProps = {
  herrar: StandingRow[] | null
  damer: StandingRow[] | null
}

export default function FullTable({ herrar, damer }: FullTableProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')

  const standings = activeTeam === 'herrar' ? herrar : damer
  const leagueName = activeTeam === 'herrar' ? 'Premier League' : 'Women’s Super League'

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

      <h2 className="font-display mt-8 border-b-2 border-[rgb(var(--color-text))] pb-[22px] text-[22px] font-bold uppercase leading-none tracking-[0.06em] text-[rgb(var(--color-text))] sm:text-[26px]">
        {leagueName}
      </h2>

      {!standings || standings.length === 0 ? (
        <p className="font-serif py-10 text-[15px] leading-[1.6] text-[rgb(var(--color-muted))]">
          Tabellen är inte tillgänglig just nu. Den fylls i så fort omgången är spelad.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[13.5px] font-medium">
            <caption className="caption-top pt-5 text-left text-[12px] font-medium text-[rgb(var(--color-muted))]">
              Tabellställning
            </caption>
            <thead>
              <tr>
                <th scope="col" className={`${TH} w-[34px]`}>
                  <abbr className={ABBR} title="Placering">
                    #
                  </abbr>
                </th>
                <th scope="col" className={TH}>
                  Lag
                </th>
                <th scope="col" className={`${TH} w-12 text-center`}>
                  <abbr className={ABBR} title="Spelade">
                    S
                  </abbr>
                </th>
                <th scope="col" className={`${TH} w-12 text-center`}>
                  <abbr className={ABBR} title="Vunna">
                    V
                  </abbr>
                </th>
                <th scope="col" className={`${TH} hidden w-12 text-center sm:table-cell`}>
                  <abbr className={ABBR} title="Oavgjorda">
                    O
                  </abbr>
                </th>
                <th scope="col" className={`${TH} hidden w-12 text-center sm:table-cell`}>
                  <abbr className={ABBR} title="Förlorade">
                    F
                  </abbr>
                </th>
                <th scope="col" className={`${TH} hidden w-[76px] text-center md:table-cell`}>
                  <abbr className={ABBR} title="Gjorda och insläppta mål">
                    Mål
                  </abbr>
                </th>
                <th scope="col" className={`${TH} w-14 text-center`}>
                  <abbr className={ABBR} title="Målskillnad">
                    +/&minus;
                  </abbr>
                </th>
                <th scope="col" className={`${TH} hidden w-[92px] md:table-cell`}>
                  Form
                </th>
                <th scope="col" className={`${TH} w-10 text-right`}>
                  <abbr className={ABBR} title="Poäng">
                    P
                  </abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => {
                const isChelsea = row.team.toLowerCase().includes('chelsea')
                const tone = isChelsea
                  ? 'font-bold text-[rgb(var(--color-chelsea-blue))]'
                  : 'text-[rgb(var(--color-ink-2))]'
                return (
                  <tr key={row.pos} className={isChelsea ? 'bg-[rgba(3,70,148,0.055)]' : ''}>
                    <td
                      className={`${TD} ${tone}`}
                      style={
                        isChelsea
                          ? { boxShadow: 'inset 3px 0 0 rgb(var(--color-chelsea-blue))' }
                          : undefined
                      }
                    >
                      {row.pos}
                    </td>
                    <td
                      className={`${TD} ${tone} whitespace-nowrap ${isChelsea ? '' : 'font-semibold'}`}
                    >
                      {row.team}
                    </td>
                    <td className={`${TD} ${tone} text-center`}>{row.played}</td>
                    <td className={`${TD} ${tone} text-center`}>{row.won}</td>
                    <td className={`${TD} ${tone} hidden text-center sm:table-cell`}>
                      {row.drawn}
                    </td>
                    <td className={`${TD} ${tone} hidden text-center sm:table-cell`}>
                      {row.lost}
                    </td>
                    <td
                      className={`${TD} ${tone} hidden whitespace-nowrap text-center md:table-cell`}
                    >
                      {row.goalsFor}&ndash;{row.goalsAgainst}
                    </td>
                    <td className={`${TD} ${tone} text-center`}>
                      {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                    </td>
                    <td className={`${TD} ${tone} hidden md:table-cell`}>
                      {row.form.length > 0 && (
                        <span className="inline-flex gap-[4px] align-middle">
                          {row.form.map((result, i) => (
                            <span
                              key={`${result}-${i}`}
                              aria-hidden="true"
                              className={`h-[7px] w-[7px] rounded-full ${
                                FORM_TONES[result] ?? 'bg-[rgb(var(--color-rule-2))]'
                              }`}
                            />
                          ))}
                          <span className="sr-only">
                            {row.form.map((r) => FORM_LABELS[r] ?? r).join(', ')}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className={`${TD} ${tone} text-right font-bold`}>{row.points}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
