'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

import type { MatchCenterData, MatchData, StandingRow } from '@/lib/chelsea-matches'

type MatchCenterProps = {
  locale: string
  herrar?: MatchCenterData | null | undefined
  damer?: MatchCenterData | null | undefined
}

const tableTabs = ['Tabell', 'Kommande'] as const
type TableTab = (typeof tableTabs)[number]

const EMPTY: MatchCenterData = {
  lastMatch: null,
  nextMatch: null,
  standings: [],
  upcoming: [],
  leagueName: '',
}

/** Samma spaltbredd som menyn och sidfoten, så kanterna ligger i linje. */
const WRAP = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'

const BTN_LINE =
  'inline-flex min-h-[44px] items-center justify-center rounded-[6px] border border-[rgb(var(--color-rule-ctl))] px-5 py-[13px] text-[12px] font-bold uppercase leading-none tracking-[0.08em] text-[rgb(var(--color-ink-2))] transition-colors hover:border-[rgb(var(--color-chelsea-blue))] hover:text-[rgb(var(--color-chelsea-blue))]'

const TH =
  'pb-3 pt-[18px] text-[9.5px] font-bold uppercase leading-none tracking-[0.14em] text-[rgb(var(--color-muted))]'

const TD = 'border-t border-[rgb(var(--color-rule))] py-[13px]'

const ABBR = 'cursor-help no-underline'

type Countdown = { d: string; h: string; m: string; s: string }

/**
 * Nedräkningen får bara räknas på klienten — servern och webbläsaren skulle
 * annars rendera olika sekundvärden och React klaga på hydreringsfel.
 */
function useCountdown(isoDate: string | null): Countdown | null {
  const [remaining, setRemaining] = useState<Countdown | null>(null)

  // Byts matchen ska nedräkningen nollas direkt. Justeras under render —
  // samma mönster som NavBar använder. En effekt hade orsakat en extra
  // renderingsvända innan den gamla siffran försvann.
  const [countingFor, setCountingFor] = useState(isoDate)
  if (countingFor !== isoDate) {
    setCountingFor(isoDate)
    setRemaining(null)
  }

  useEffect(() => {
    if (!isoDate) return

    const target = new Date(isoDate).getTime()
    if (Number.isNaN(target)) return

    const pad = (n: number) => String(n).padStart(2, '0')

    const tick = () => {
      const ms = target - Date.now()
      if (ms <= 0) {
        setRemaining(null)
        return
      }
      const total = Math.floor(ms / 1000)
      setRemaining({
        d: pad(Math.floor(total / 86400)),
        h: pad(Math.floor((total % 86400) / 3600)),
        m: pad(Math.floor((total % 3600) / 60)),
        s: pad(total % 60),
      })
    }

    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [isoDate])

  return remaining
}

/** Gemensam tomtext — matchdata kommer utifrån och kan saknas tillfälligt. */
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-serif py-10 text-[15px] leading-[1.6] text-[rgb(var(--color-muted))]">
      {children}
    </p>
  )
}

function BoardTeam({ logo, abbr, name }: { logo: string; abbr: string; name: string }) {
  const isChelsea = name.toLowerCase().includes('chelsea')

  return (
    <span className="flex w-[84px] flex-none flex-col items-center gap-[9px]">
      {logo ? (
        <Image
          src={logo}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 rounded-full object-contain"
        />
      ) : (
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold leading-none text-white ${
            isChelsea ? 'bg-[rgb(var(--color-chelsea-blue))]' : 'bg-white/15'
          }`}
        >
          {abbr}
        </span>
      )}
      <span className="text-center text-[11.5px] font-semibold leading-[1.25] text-white/[0.82]">
        {name}
      </span>
    </span>
  )
}

function BoardLabel({ text, live }: { text: string; live: boolean }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase leading-none tracking-[0.20em] text-[rgb(var(--color-gold))]">
      {live && (
        <span
          className="live-dot inline-block h-[7px] w-[7px] rounded-full bg-[rgb(var(--color-gold))]"
          aria-hidden="true"
        />
      )}
      {live ? 'Pågår nu' : text}
    </p>
  )
}

function BoardMeta({ match, children }: { match: MatchData; children?: React.ReactNode }) {
  return (
    <div className="min-w-0 border-white/[0.12] text-[12px] font-medium leading-[1.6] text-white/[0.58] sm:border-l sm:pl-[26px]">
      <p>
        {match.league}
        {match.league && <br />}
        <time dateTime={match.isoDate}>{match.date}</time>
        {match.venue ? ` · ${match.venue}` : ''}
      </p>
      {children}
    </div>
  )
}

function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <span className="text-center">
      <span className="font-display tabular block text-[24px] font-bold leading-none">
        {value}
      </span>
      <span className="mt-[5px] block text-[8.5px] font-semibold uppercase leading-none tracking-[0.16em] text-white/[0.45]">
        {label}
      </span>
    </span>
  )
}

/**
 * Resultattavlan: senaste resultatet och nästa avspark i ett mörkt band tvärs
 * över sidan. Saknas en av matcherna står tomtexten kvar i sin halva — vi
 * hittar aldrig på ett resultat.
 */
function ScoreBoard({ data }: { data: MatchCenterData }) {
  const { lastMatch, nextMatch } = data
  const countdown = useCountdown(nextMatch?.isoDate ?? null)

  if (!lastMatch && !nextMatch) {
    return (
      <div className="bg-[rgb(var(--color-night))] text-white">
        <div className={`${WRAP} py-7`}>
          <p className="font-serif text-[15px] leading-[1.6] text-white/[0.7]">
            Matchdata är inte tillgänglig just nu.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[rgb(var(--color-night))] text-white">
      <div className={`${WRAP} grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]`}>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-5 py-7">
          {lastMatch ? (
            <>
              <div className="flex-none">
                <BoardLabel text="Senaste match" live={lastMatch.isLive} />
                <div className="flex items-center gap-[22px]">
                  <BoardTeam
                    logo={lastMatch.homeLogo}
                    abbr={lastMatch.homeAbbr}
                    name={lastMatch.homeTeam}
                  />
                  {lastMatch.homeGoals !== null && lastMatch.awayGoals !== null ? (
                    <span className="font-display tabular text-[46px] font-bold leading-none tracking-[-0.035em]">
                      {lastMatch.homeGoals}
                      <span className="mx-[9px] text-white/[0.28]">&ndash;</span>
                      {lastMatch.awayGoals}
                    </span>
                  ) : (
                    <span className="font-display text-[16px] font-bold uppercase leading-none tracking-[0.16em] text-white/[0.32]">
                      vs
                    </span>
                  )}
                  <BoardTeam
                    logo={lastMatch.awayLogo}
                    abbr={lastMatch.awayAbbr}
                    name={lastMatch.awayTeam}
                  />
                </div>
              </div>
              <BoardMeta match={lastMatch}>
                {lastMatch.matchCentreUrl && (
                  <a
                    href={lastMatch.matchCentreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex min-h-[44px] items-center text-[11.5px] font-bold uppercase tracking-[0.09em] text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]"
                  >
                    Matchcenter på chelseafc.com
                  </a>
                )}
              </BoardMeta>
            </>
          ) : (
            <div>
              <BoardLabel text="Senaste match" live={false} />
              <p className="font-serif text-[15px] leading-[1.6] text-white/[0.7]">
                Ingen spelad match ännu.
              </p>
            </div>
          )}
        </div>

        <div className="hidden bg-white/[0.12] md:block" aria-hidden="true" />

        <div className="flex flex-wrap items-center gap-x-7 gap-y-5 border-t border-white/[0.12] py-7 md:border-t-0 md:pl-12">
          {nextMatch ? (
            <>
              <div className="flex-none">
                <BoardLabel text="Nästa match" live={nextMatch.isLive} />
                <div className="flex items-center gap-[22px]">
                  <BoardTeam
                    logo={nextMatch.homeLogo}
                    abbr={nextMatch.homeAbbr}
                    name={nextMatch.homeTeam}
                  />
                  <span className="font-display text-[16px] font-bold uppercase leading-none tracking-[0.16em] text-white/[0.32]">
                    vs
                  </span>
                  <BoardTeam
                    logo={nextMatch.awayLogo}
                    abbr={nextMatch.awayAbbr}
                    name={nextMatch.awayTeam}
                  />
                </div>
              </div>
              <BoardMeta match={nextMatch}>
                {countdown && (
                  <div className="mt-3 flex gap-[14px]">
                    <CountdownUnit value={countdown.d} label="dygn" />
                    <CountdownUnit value={countdown.h} label="tim" />
                    <CountdownUnit value={countdown.m} label="min" />
                    <CountdownUnit value={countdown.s} label="sek" />
                  </div>
                )}
              </BoardMeta>
            </>
          ) : (
            <div>
              <BoardLabel text="Nästa match" live={false} />
              <p className="font-serif text-[15px] leading-[1.6] text-white/[0.7]">
                Inga kommande matcher är inlagda ännu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Formkurvan från Chelseas tabell: nyaste matchen först. */
function Form({ form }: { form: string[] }) {
  if (form.length === 0) return null

  const tone: Record<string, string> = {
    W: 'bg-[#16a34a]',
    D: 'bg-[#94a3b8]',
    L: 'bg-[#dc2626]',
  }
  const label: Record<string, string> = { W: 'vinst', D: 'oavgjort', L: 'förlust' }

  return (
    <span className="inline-flex gap-[4px] align-middle">
      {form.map((result, i) => (
        <span
          key={`${result}-${i}`}
          aria-hidden="true"
          className={`h-[7px] w-[7px] rounded-full ${tone[result] ?? 'bg-[rgb(var(--color-rule-2))]'}`}
        />
      ))}
      <span className="sr-only">{form.map((r) => label[r] ?? r).join(', ')}</span>
    </span>
  )
}

function StandingsTable({
  standings,
  leagueName,
}: {
  standings: StandingRow[]
  leagueName: string
}) {
  if (standings.length === 0) {
    return (
      <EmptyState>
        Tabellen är inte tillgänglig just nu. Den fylls i så fort omgången är spelad.
      </EmptyState>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[13.5px] font-medium">
        <caption className="caption-top pt-5 text-left text-[12px] font-medium text-[rgb(var(--color-muted))]">
          {leagueName || 'Tabellställning'}
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
            <th scope="col" className={`${TH} hidden w-12 text-center sm:table-cell`}>
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
              <tr key={row.teamId} className={isChelsea ? 'bg-[rgba(3,70,148,0.055)]' : ''}>
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
                <td className={`${TD} ${tone} ${isChelsea ? '' : 'font-semibold'}`}>{row.team}</td>
                <td className={`${TD} ${tone} text-center`}>{row.played}</td>
                <td className={`${TD} ${tone} hidden text-center sm:table-cell`}>{row.won}</td>
                <td className={`${TD} ${tone} hidden text-center sm:table-cell`}>{row.drawn}</td>
                <td className={`${TD} ${tone} hidden text-center sm:table-cell`}>{row.lost}</td>
                <td className={`${TD} ${tone} text-center`}>
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className={`${TD} ${tone} hidden md:table-cell`}>
                  <Form form={row.form} />
                </td>
                <td className={`${TD} ${tone} text-right font-bold`}>{row.points}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function UpcomingList({ matches }: { matches: MatchData[] }) {
  if (matches.length === 0) {
    return <EmptyState>Inga kommande matcher är inlagda ännu.</EmptyState>
  }

  return (
    <ul className="mt-6">
      {matches.map((match) => (
        <li
          key={match.isoDate + match.awayTeam}
          className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[rgb(var(--color-rule))] py-4 first:border-t-0"
        >
          <time
            dateTime={match.isoDate}
            className="tabular w-[120px] flex-none text-[12.5px] font-semibold leading-[1.4] text-[rgb(var(--color-ink-2))]"
          >
            {match.date}
          </time>
          <span className="font-display min-w-0 flex-1 text-[16px] font-semibold leading-[1.25] text-[rgb(var(--color-text))]">
            {match.homeTeam} &ndash; {match.awayTeam}
          </span>
          <span className="flex-none text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
            {match.league}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Matchcenter: resultattavla, tabell och kommande matcher.
 *
 * All data kommer från Chelseas egen sajt (se lib/chelsea-matches.ts). Saknas
 * den visar vi en tydlig tomtext — aldrig påhittade resultat, som skulle vara
 * sämre än inget alls.
 */
export default function MatchCenter({ locale, herrar, damer }: MatchCenterProps) {
  const [activeTeam, setActiveTeam] = useState<'herrar' | 'damer'>('herrar')
  const [activeTab, setActiveTab] = useState<TableTab>('Tabell')

  const data = (activeTeam === 'herrar' ? herrar : damer) ?? EMPTY

  const teams = [
    { key: 'herrar' as const, label: 'Herrar' },
    { key: 'damer' as const, label: 'Damer' },
  ]

  return (
    <section>
      <div className={`${WRAP} flex flex-wrap items-end justify-between gap-4 pb-6`}>
        <div>
          <span className="flex items-center gap-3">
            <span
              className="block h-[3px] w-[30px] rounded-sm bg-[rgb(var(--color-gold))]"
              aria-hidden="true"
            />
            <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
              Matcher
            </span>
          </span>
          <h2 className="font-display mt-3 text-[26px] font-bold uppercase leading-none tracking-[0.06em] text-[rgb(var(--color-text))]">
            Matchcenter
          </h2>
        </div>
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

      <ScoreBoard data={data} />

      <div
        className={`${WRAP} grid grid-cols-1 items-start gap-14 py-14 lg:grid-cols-[minmax(0,1fr)_360px]`}
      >
        <div className="min-w-0">
          <div
            className="flex border-b-2 border-[rgb(var(--color-text))]"
            role="group"
            aria-label="Visa"
          >
            {tableTabs.map((tab) => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  aria-pressed={active}
                  className={`font-display relative flex min-h-[44px] items-end px-5 pb-4 text-[13px] font-bold uppercase leading-none tracking-[0.13em] transition-colors first:pl-0 ${
                    active
                      ? 'text-[rgb(var(--color-text))]'
                      : 'text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {tab}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 right-5 h-0.5 ${
                      active ? 'bg-[rgb(var(--color-gold))]' : 'bg-transparent'
                    }`}
                  />
                </button>
              )
            })}
          </div>

          {activeTab === 'Tabell' ? (
            <StandingsTable standings={data.standings} leagueName={data.leagueName} />
          ) : (
            <UpcomingList matches={data.upcoming} />
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/matcher/spelschema` as Route} className={BTN_LINE}>
              Hela spelschemat
            </Link>
            <Link href={`/${locale}/matcher/tabell` as Route} className={BTN_LINE}>
              Full tabell
            </Link>
          </div>
        </div>

        <aside className="min-w-0">
          <div className="rounded-[6px] bg-[rgb(var(--color-chelsea-blue-dark))] px-6 py-[22px] text-white">
            <p className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold))]">
              Mötesplatser
            </p>
            <h2 className="font-display mt-2.5 text-[19px] font-semibold leading-[1.3]">
              Var ses vi på matchdagen?
            </h2>
            <p className="font-serif mt-2 text-[14px] leading-[1.6] text-white/[0.78]">
              Föreningens mötesplatser visar Chelseas matcher runt om i landet. Hitta den
              närmaste.
            </p>
            <Link
              href={`/${locale}/motesplatser` as Route}
              className="mt-2 inline-flex min-h-[44px] items-center gap-[7px] text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]"
            >
              Se mötesplatser
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

          <p className="font-serif mt-[18px] rounded-[6px] border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-[18px] py-4 text-[14px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
            Tabell och matcher hämtas direkt från Chelsea FC och uppdateras löpande.
            {data.nextMatch?.matchCentreUrl && (
              <>
                {' '}
                <a
                  href={data.nextMatch.matchCentreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[rgb(var(--color-chelsea-blue))] underline underline-offset-[3px]"
                >
                  Se matchcentret för nästa match.
                </a>
              </>
            )}
          </p>
        </aside>
      </div>
    </section>
  )
}
