'use client'

import { useState } from 'react'
import type { StandingRow } from '@/lib/chelsea-matches'

/** Formkurvan från Chelseas tabell: nyaste matchen först. */
const FORM_TONES: Record<string, string> = {
  W: 'bg-emerald-500',
  D: 'bg-slate-300',
  L: 'bg-rose-400',
}
const FORM_LABELS: Record<string, string> = { W: 'vinst', D: 'oavgjort', L: 'förlust' }

type FullTableProps = {
  herrar: StandingRow[] | null
  damer: StandingRow[] | null
}

export default function FullTable({ herrar, damer }: FullTableProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')

  const standings = activeTeam === 'herrar' ? herrar : damer
  const leagueName = activeTeam === 'herrar' ? 'Premier League' : 'Women\u2019s Super League'

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

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <h2 className="font-display mb-1 text-lg font-bold text-slate-900">{leagueName}</h2>
        <p className="mb-4 text-[11px] text-slate-400">Tabellställning {new Date().getFullYear()}/{(new Date().getFullYear() + 1).toString().slice(-2)}</p>

        {!standings || standings.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">Ingen tabelldata tillgänglig</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-[0.1em] text-slate-400">
                  <th className="pb-2 pr-2 font-semibold">#</th>
                  <th className="pb-2 pr-4 font-semibold">Lag</th>
                  <th className="pb-2 text-center font-semibold">S</th>
                  <th className="pb-2 text-center font-semibold">V</th>
                  <th className="pb-2 text-center font-semibold">O</th>
                  <th className="pb-2 text-center font-semibold">F</th>
                  <th className="pb-2 text-center font-semibold">Mål</th>
                  <th className="pb-2 text-center font-semibold">+/&minus;</th>
                  <th className="pb-2 text-center font-semibold">Form</th>
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
                      <td className="py-2 pr-2">{row.pos}</td>
                      <td className="py-2 pr-4 font-semibold whitespace-nowrap">{row.team}</td>
                      <td className="py-2 text-center">{row.played}</td>
                      <td className="py-2 text-center">{row.won}</td>
                      <td className="py-2 text-center">{row.drawn}</td>
                      <td className="py-2 text-center">{row.lost}</td>
                      <td className="py-2 text-center whitespace-nowrap">{row.goalsFor}&minus;{row.goalsAgainst}</td>
                      <td className="py-2 text-center">
                        {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                      </td>
                      <td className="py-2 text-center">
                        <span className="inline-flex gap-[3px]">
                          {row.form.map((result, i) => (
                            <span
                              key={`${result}-${i}`}
                              title={FORM_LABELS[result] ?? result}
                              className={`h-1.5 w-1.5 rounded-full ${FORM_TONES[result] ?? 'bg-slate-200'}`}
                            />
                          ))}
                          <span className="sr-only">
                            {row.form.map((r) => FORM_LABELS[r] ?? r).join(', ')}
                          </span>
                        </span>
                      </td>
                      <td className="py-2 text-right font-bold">{row.points}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
