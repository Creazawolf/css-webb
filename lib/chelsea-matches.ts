import { z } from 'zod'

/**
 * Matchdata från Chelsea FC:s egna sajt.
 *
 * chelseafc.com renderar sina matchsidor mot ett publikt JSON-API på
 * `/en/api/...`. Det kräver ingen nyckel, ingen registrering och har inga
 * anropskvoter — samma väg som `lib/chelsea-news.ts` redan använder för
 * nyhetsflödet. Endpointerna hittades i klubbens egen webbklient
 * (`/assets/<version>/main.js`), där tjänstelagret bygger dem som
 * `${apiUrl}/fixtures/upcoming`, `${apiUrl}/fixtures/results` och
 * `${apiUrl}/fixtures/league-table`.
 *
 * Fördelen mot ett tredjeparts-API: det är klubbens egen sanning, det täcker
 * damlaget lika bra som herrlaget (WSL saknas i de flesta gratisplaner), och
 * det kan inte stängas av för att ett abonnemang tar slut.
 *
 * Det enda vi behöver hålla reda på är sidornas ID:n nedan. De är
 * Contentful-poster och byts inte mellan säsonger — `seasonId` är valfritt och
 * utelämnat, så API:t svarar alltid med innevarande säsong.
 */

const API_BASE = 'https://www.chelseafc.com/en/api'
const HOMEPAGE_URL = 'https://www.chelseafc.com/en'

/** Contentful-ID för "Fixtures & Results"-sidorna på chelseafc.com. */
const PAGE_ID_MEN = '30EGwHPO9uwBCc75RQY6kg'
const PAGE_ID_WOMEN = 'NFFa1rMz6sNIHsRi7Hbpb'

/** Klubbens tider anges i brittisk lokaltid; vi visar svensk. */
const SOURCE_TIMEZONE = 'Europe/London'
const DISPLAY_TIMEZONE = 'Europe/Stockholm'

export const REVALIDATE_FIXTURES = 900 // 15 min
export const REVALIDATE_STANDINGS = 1800 // 30 min

export const TAG_ALL = 'chelsea-matches'
export const TAG_FIXTURES = 'chelsea-matches:fixtures'
export const TAG_STANDINGS = 'chelsea-matches:standings'

// --- Domäntyper ---

export type MatchData = {
  homeTeam: string
  awayTeam: string
  homeAbbr: string
  awayAbbr: string
  homeLogo: string
  awayLogo: string
  homeGoals: number | null
  awayGoals: number | null
  /** Färdigformaterad svensk datumsträng, t.ex. "lör 6 sep 17:30". */
  date: string
  isoDate: string
  league: string
  venue: string
  /** Länk till Chelseas eget matchcenter, om klubben publicerat en. */
  matchCentreUrl: string | null
  isLive: boolean
  isResult: boolean
}

export type StandingRow = {
  pos: number
  team: string
  teamId: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  /** Senaste matcherna, nyast först: "W" | "D" | "L". */
  form: string[]
  crest: string
}

export type MatchCenterData = {
  lastMatch: MatchData | null
  nextMatch: MatchData | null
  standings: StandingRow[]
  /** Kommande matcher, tidigast först. */
  upcoming: MatchData[]
  leagueName: string
}

// --- Scheman (bara fälten vi faktiskt läser) ---

const SideSchema = z.object({
  clubName: z.string(),
  clubShortName: z.string().optional(),
  clubCrestUrl: z.string().optional(),
  score: z.number().nullable().optional(),
})

const FixtureSchema = z.object({
  id: z.string(),
  isResult: z.boolean().optional(),
  isLive: z.boolean().optional(),
  postponed: z.boolean().optional(),
  matchUp: z.object({
    home: SideSchema,
    away: SideSchema,
  }),
  venue: z.string().optional(),
  competition: z.string().optional(),
  kickoffDate: z.string().optional(),
  kickoffTime: z.string().optional(),
  ctas: z
    .object({
      matchCentreLink: z.object({ url: z.string() }).optional(),
    })
    .optional(),
})

const FixtureListSchema = z.object({
  items: z.array(
    z.object({
      month: z.number(),
      year: z.number(),
      items: z.array(FixtureSchema),
    }),
  ),
})

const StandingsSchema = z.object({
  items: z.array(
    z.object({
      competitionDetails: z.object({ title: z.string() }).optional(),
      standings: z.object({
        tables: z.array(
          z.object({
            rows: z.array(
              z.object({
                position: z.number(),
                clubId: z.number(),
                clubName: z.string(),
                clubShortName: z.string().optional(),
                crestUrl: z.string().optional(),
                played: z.number(),
                won: z.number(),
                drawn: z.number(),
                lost: z.number(),
                goalsFor: z.number(),
                goalsAgainst: z.number(),
                points: z.number(),
                recentForm: z.array(z.string()).optional(),
              }),
            ),
          }),
        ),
      }),
    }),
  ),
})

// --- Hämtning ---

async function apiFetch<T>(
  path: string,
  params: Record<string, string>,
  schema: z.ZodType<T>,
  revalidate: number,
  tag: string,
): Promise<T> {
  const url = `${API_BASE}${path}?${new URLSearchParams(params).toString()}`

  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
    next: { revalidate, tags: [TAG_ALL, tag] },
  })

  if (!res.ok) {
    throw new Error(`Chelsea match API ${res.status} för ${path}`)
  }

  return schema.parse(await res.json())
}

// --- Tid ---

/** Europe/Londons UTC-offset i minuter vid en given tidpunkt. */
function offsetMinutes(timeZone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(at)

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? '0')
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour') % 24,
    get('minute'),
    get('second'),
  )

  return (asUtc - at.getTime()) / 60000
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
}

/**
 * Klubben skickar ingen tidsstämpel, bara "Sun 06 Sept 2026" och "16:30" i
 * brittisk tid. Matchcenterlänken slutar däremot på ett ISO-datum
 * ("...-2026-09-06"), vilket är den säkraste källan när den finns.
 */
function toIsoDate(
  kickoffDate: string | undefined,
  kickoffTime: string | undefined,
  matchCentreUrl: string | null,
  fallbackYear: number,
  fallbackMonth: number,
): string | null {
  let year: number | null = null
  let month: number | null = null
  let day: number | null = null

  const fromUrl = matchCentreUrl?.match(/(\d{4})-(\d{2})-(\d{2})$/)
  if (fromUrl) {
    year = Number(fromUrl[1])
    month = Number(fromUrl[2]) - 1
    day = Number(fromUrl[3])
  } else if (kickoffDate) {
    const m = kickoffDate.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
    if (m) {
      const monthIndex = MONTHS[m[2]!.slice(0, 3).toLowerCase()]
      if (monthIndex !== undefined) {
        day = Number(m[1])
        month = monthIndex
        year = Number(m[3])
      }
    }
  }

  if (year === null || month === null || day === null) {
    // Sista utväg: månadsrubriken vi grupperades under, utan exakt dag.
    year = fallbackYear
    month = fallbackMonth - 1
    day = 1
  }

  const [hourRaw, minuteRaw] = (kickoffTime ?? '').split(':')
  const hour = Number(hourRaw)
  const minute = Number(minuteRaw)
  const hasTime = Number.isFinite(hour) && Number.isFinite(minute)

  const naive = Date.UTC(year, month, day, hasTime ? hour : 12, hasTime ? minute : 0)
  // Två pass räcker för att landa rätt även dygnet då sommartiden växlar.
  let instant = naive
  for (let i = 0; i < 2; i += 1) {
    instant = naive - offsetMinutes(SOURCE_TIMEZONE, new Date(instant)) * 60000
  }

  const date = new Date(instant)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const dateFormatter = new Intl.DateTimeFormat('sv-SE', {
  timeZone: DISPLAY_TIMEZONE,
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
})

function formatSwedish(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate)).replace(/\./g, '')
}

// --- Omvandling ---

function abbreviate(name: string): string {
  const cleaned = name.replace(/\bWomen\b/i, '').trim()
  const words = cleaned.split(/\s+/).filter(Boolean)
  if (words.length >= 3) return words.map((w) => w[0]).join('').slice(0, 3).toUpperCase()
  return cleaned.slice(0, 3).toUpperCase()
}

type RawFixture = z.infer<typeof FixtureSchema>

function toMatch(fixture: RawFixture, year: number, month: number): MatchData | null {
  const { home, away } = fixture.matchUp
  const matchCentreUrl = fixture.ctas?.matchCentreLink?.url
    ? `https://www.chelseafc.com${fixture.ctas.matchCentreLink.url}`
    : null

  const isoDate = toIsoDate(
    fixture.kickoffDate,
    fixture.kickoffTime,
    matchCentreUrl,
    year,
    month,
  )
  if (!isoDate) return null

  const isResult = fixture.isResult === true
  const homeName = home.clubShortName || home.clubName
  const awayName = away.clubShortName || away.clubName

  return {
    homeTeam: homeName,
    awayTeam: awayName,
    homeAbbr: abbreviate(homeName),
    awayAbbr: abbreviate(awayName),
    homeLogo: home.clubCrestUrl ?? '',
    awayLogo: away.clubCrestUrl ?? '',
    homeGoals: isResult ? home.score ?? null : null,
    awayGoals: isResult ? away.score ?? null : null,
    date: formatSwedish(isoDate),
    isoDate,
    league: fixture.competition?.trim() ?? '',
    venue: fixture.venue ?? '',
    matchCentreUrl,
    isLive: fixture.isLive === true,
    isResult,
  }
}

function flatten(list: z.infer<typeof FixtureListSchema>): MatchData[] {
  return list.items
    .flatMap((group) => group.items.map((f) => toMatch(f, group.year, group.month)))
    .filter((m): m is MatchData => m !== null)
    .sort((a, b) => a.isoDate.localeCompare(b.isoDate))
}

// --- Klubbens startsida som komplement ---

/**
 * `fixtures/results` släpar ibland flera dygn efter senaste matchen — den
 * 30 augusti 2026 (Chelsea–Brighton 4–3) saknades t.ex. i både `results` och
 * `upcoming` medan tabellen redan räknat den. Chelseas startsida serverrenderar
 * däremot senaste och nästa match per lag i en `data-props`-blob, och den är
 * alltid färsk. Vi läser den som komplement och lägger ihop listorna.
 *
 * Blir startsidan otillgänglig eller ändrar form faller vi tillbaka på
 * endpointerna — därför kastar den här funktionen aldrig vidare.
 */
const HomepageSchema = z.object({
  tabs: z.array(
    z.object({
      team: z.object({
        team: z.string().optional(),
        fixturesResults: z.array(FixtureSchema),
      }),
    }),
  ),
})

type HomepageMatches = { men: MatchData[]; women: MatchData[] }

async function fetchHomepageMatches(): Promise<HomepageMatches> {
  const empty: HomepageMatches = { men: [], women: [] }

  try {
    const res = await fetch(HOMEPAGE_URL, {
      headers: {
        // Utan en webbläsarlik User-Agent svarar sajten med en utmaningssida.
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        Accept: 'text/html',
      },
      next: { revalidate: REVALIDATE_FIXTURES, tags: [TAG_ALL, TAG_FIXTURES] },
    })
    if (!res.ok) return empty

    const html = await res.text()
    const now = new Date()

    for (const match of html.matchAll(/data-props="([^"]*)"/g)) {
      const raw = match[1]
      if (!raw || !raw.includes('fixturesResults')) continue

      const parsed = HomepageSchema.safeParse(JSON.parse(decodeHtmlEntities(raw)))
      if (!parsed.success) continue

      for (const tab of parsed.data.tabs) {
        const label = (tab.team.team ?? '').toLowerCase()
        const bucket = label.startsWith("women") ? 'women' : label.startsWith("men") ? 'men' : null
        if (!bucket) continue

        empty[bucket] = tab.team.fixturesResults
          .map((f) => toMatch(f, now.getUTCFullYear(), now.getUTCMonth() + 1))
          .filter((m): m is MatchData => m !== null)
      }
      break
    }
  } catch {
    return empty
  }

  return empty
}

/** Minimal avkodning — attributet innehåller bara dessa fem entiteter. */
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

function matchKey(match: MatchData): string {
  return `${match.isoDate.slice(0, 10)}|${match.homeTeam}|${match.awayTeam}`
}

/** Slår ihop listor och låter den första källan vinna vid dubbletter. */
function mergeMatches(...lists: MatchData[][]): MatchData[] {
  const seen = new Map<string, MatchData>()
  for (const list of lists) {
    for (const match of list) {
      const key = matchKey(match)
      const existing = seen.get(key)
      // En spelad match slår alltid en oskriven — resultatet är det färska.
      if (!existing || (match.isResult && !existing.isResult)) seen.set(key, match)
    }
  }
  return Array.from(seen.values()).sort((a, b) => a.isoDate.localeCompare(b.isoDate))
}

// --- Publika hämtare ---

async function fetchFixtures(pageId: string, type: 'upcoming' | 'results'): Promise<MatchData[]> {
  const data = await apiFetch(
    `/fixtures/${type}`,
    { pageId },
    FixtureListSchema,
    REVALIDATE_FIXTURES,
    TAG_FIXTURES,
  )
  return flatten(data)
}

async function fetchStandings(
  pageId: string,
): Promise<{ rows: StandingRow[]; leagueName: string }> {
  const data = await apiFetch(
    '/fixtures/league-table',
    { entryId: pageId },
    StandingsSchema,
    REVALIDATE_STANDINGS,
    TAG_STANDINGS,
  )

  const table = data.items[0]
  const rows = table?.standings.tables[0]?.rows ?? []

  return {
    leagueName: table?.competitionDetails?.title?.trim() ?? '',
    rows: rows.map((row) => ({
      pos: row.position,
      team: row.clubShortName || row.clubName,
      teamId: row.clubId,
      played: row.played,
      won: row.won,
      drawn: row.drawn,
      lost: row.lost,
      goalsFor: row.goalsFor,
      goalsAgainst: row.goalsAgainst,
      goalDifference: row.goalsFor - row.goalsAgainst,
      points: row.points,
      form: (row.recentForm ?? []).slice(-5).reverse(),
      crest: row.crestUrl ?? '',
    })),
  }
}

type Team = 'men' | 'women'

const PAGE_IDS: Record<Team, string> = {
  men: PAGE_ID_MEN,
  women: PAGE_ID_WOMEN,
}

async function getTeamData(team: Team): Promise<MatchCenterData> {
  const pageId = PAGE_IDS[team]

  const [upcoming, results, standings, homepage] = await Promise.all([
    fetchFixtures(pageId, 'upcoming').catch(() => [] as MatchData[]),
    fetchFixtures(pageId, 'results').catch(() => [] as MatchData[]),
    fetchStandings(pageId).catch(() => ({ rows: [] as StandingRow[], leagueName: '' })),
    fetchHomepageMatches(),
  ])

  const extra = homepage[team]
  const played = mergeMatches(
    extra.filter((m) => m.isResult),
    results,
  )
  const coming = mergeMatches(
    upcoming,
    extra.filter((m) => !m.isResult),
  )

  return {
    lastMatch: played.at(-1) ?? null,
    nextMatch: coming[0] ?? null,
    upcoming: coming.slice(0, 6),
    standings: standings.rows,
    leagueName: standings.leagueName,
  }
}

export async function getHerrarData(): Promise<MatchCenterData> {
  return getTeamData('men')
}

export async function getDamerData(): Promise<MatchCenterData> {
  return getTeamData('women')
}

export async function getMatchCenterData(): Promise<{
  herrar: MatchCenterData | null
  damer: MatchCenterData | null
}> {
  const [herrar, damer] = await Promise.all([
    getHerrarData().catch(() => null),
    getDamerData().catch(() => null),
  ])
  return { herrar, damer }
}

/** Nästa match för herrlaget — används i matchbaren högst upp på sajten. */
export async function getNextFixture(): Promise<MatchData | null> {
  try {
    const [upcoming, homepage] = await Promise.all([
      fetchFixtures(PAGE_ID_MEN, 'upcoming').catch(() => [] as MatchData[]),
      fetchHomepageMatches(),
    ])
    const coming = mergeMatches(upcoming, homepage.men.filter((m) => !m.isResult))
    return coming[0] ?? null
  } catch {
    return null
  }
}

export async function getHerrarStandings(): Promise<StandingRow[]> {
  return (await fetchStandings(PAGE_ID_MEN)).rows
}

export async function getDamerStandings(): Promise<StandingRow[]> {
  return (await fetchStandings(PAGE_ID_WOMEN)).rows
}

/** Hela säsongen i kronologisk ordning, spelade matcher först. */
async function fetchSeason(team: Team): Promise<MatchData[]> {
  const pageId = PAGE_IDS[team]

  const [results, upcoming, homepage] = await Promise.all([
    fetchFixtures(pageId, 'results'),
    fetchFixtures(pageId, 'upcoming'),
    fetchHomepageMatches(),
  ])

  return mergeMatches(homepage[team], results, upcoming)
}

export async function getHerrarSchedule(): Promise<MatchData[]> {
  return fetchSeason('men')
}

export async function getDamerSchedule(): Promise<MatchData[]> {
  return fetchSeason('women')
}
