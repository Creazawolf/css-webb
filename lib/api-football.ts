import { unstable_cache } from 'next/cache'
import { z } from 'zod'

// --- Constants ---

const API_BASE = 'https://v3.football.api-sports.io'

const CHELSEA_MEN_ID = 49
const CHELSEA_WOMEN_ID = 1853
const PREMIER_LEAGUE_ID = 39
const WSL_ID = 44

// ISR revalidation intervals (seconds)
// Conservative to stay within API-Football free tier (10 req/min, 100/day)
const REVALIDATE_FIXTURES = 7200    // 2 hours
const REVALIDATE_STANDINGS = 14400  // 4 hours
const REVALIDATE_STATS = 43200      // 12 hours

// --- Abbreviation lookup ---

const ABBREVIATIONS: Record<string, string> = {
  'Chelsea': 'CHE',
  'Chelsea W': 'CHE',
  'Arsenal': 'ARS',
  'Arsenal W': 'ARS',
  'Liverpool': 'LIV',
  'Liverpool W': 'LIV',
  'Manchester City': 'MCI',
  'Man City': 'MCI',
  'Manchester City W': 'MCI',
  'Manchester United': 'MUN',
  'Man United': 'MUN',
  'Manchester United W': 'MUN',
  'Tottenham': 'TOT',
  'Tottenham W': 'TOT',
  'Aston Villa': 'AVL',
  'Aston Villa W': 'AVL',
  'Newcastle': 'NEW',
  'Newcastle United': 'NEW',
  'Brighton': 'BHA',
  'Brighton W': 'BHA',
  'West Ham': 'WHU',
  'West Ham W': 'WHU',
  'Fulham': 'FUL',
  'Fulham W': 'FUL',
  'Bournemouth': 'BOU',
  'Crystal Palace': 'CRY',
  'Crystal Palace W': 'CRY',
  'Brentford': 'BRE',
  'Everton': 'EVE',
  'Everton W': 'EVE',
  'Wolverhampton': 'WOL',
  'Wolves': 'WOL',
  'Nottingham Forest': 'NFO',
  'Nottingham': 'NFO',
  'Leicester': 'LEI',
  'Leicester W': 'LEI',
  'Ipswich': 'IPS',
  'Southampton': 'SOU',
  'Leeds': 'LEE',
  'Bristol City W': 'BRC',
  'Reading W': 'REA',
}

// --- Domain types ---

export type MatchData = {
  homeTeam: string
  awayTeam: string
  homeAbbr: string
  awayAbbr: string
  homeLogo: string
  awayLogo: string
  homeGoals: number | null
  awayGoals: number | null
  date: string
  isoDate: string
  league: string
  venue: string
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
  points: number
}

export type PlayerStat = {
  name: string
  team: string
  value: number
}

export type MatchCenterData = {
  lastMatch: MatchData | null
  nextMatch: MatchData | null
  standings: StandingRow[]
  topScorers: PlayerStat[]
  topAssists: PlayerStat[]
}

// --- Zod schemas (only the fields we use) ---

const FixtureTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
  logo: z.string(),
})

const FixtureSchema = z.object({
  fixture: z.object({
    id: z.number(),
    date: z.string(),
    venue: z.object({
      name: z.string().nullable(),
    }),
  }),
  league: z.object({
    name: z.string(),
  }),
  teams: z.object({
    home: FixtureTeamSchema,
    away: FixtureTeamSchema,
  }),
  goals: z.object({
    home: z.number().nullable(),
    away: z.number().nullable(),
  }),
})

const FixturesResponseSchema = z.object({
  response: z.array(FixtureSchema),
})

const StandingTeamSchema = z.object({
  id: z.number(),
  name: z.string(),
})

const StandingEntrySchema = z.object({
  rank: z.number(),
  team: StandingTeamSchema,
  points: z.number(),
  all: z.object({
    played: z.number(),
    win: z.number(),
    draw: z.number(),
    lose: z.number(),
    goals: z.object({
      for: z.number(),
      against: z.number(),
    }),
  }),
})

const StandingsResponseSchema = z.object({
  response: z.array(
    z.object({
      league: z.object({
        standings: z.array(z.array(StandingEntrySchema)),
      }),
    }),
  ),
})

const PlayerStatEntrySchema = z.object({
  player: z.object({
    name: z.string(),
  }),
  statistics: z.array(
    z.object({
      team: z.object({
        name: z.string(),
      }),
      goals: z.object({
        total: z.number().nullable(),
        assists: z.number().nullable(),
      }),
    }),
  ),
})

const PlayersResponseSchema = z.object({
  response: z.array(PlayerStatEntrySchema),
})

// --- Core fetch helper ---

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Track last request time to enforce minimum gap between API calls
let lastRequestTime = 0
const MIN_REQUEST_GAP = 3000 // 3s between requests — with unstable_cache only uncached calls hit API

async function apiFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  schema: z.ZodType<T>,
  _revalidate: number,
): Promise<T> {
  const apiKey = process.env.API_FOOTBALL_KEY
  if (!apiKey) {
    throw new Error('Missing API_FOOTBALL_KEY environment variable')
  }

  // Enforce minimum gap between requests to avoid rate limiting
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_GAP) {
    await sleep(MIN_REQUEST_GAP - elapsed)
  }
  lastRequestTime = Date.now()

  const url = new URL(`${API_BASE}${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  const res = await fetch(url.toString(), {
    headers: { 'x-apisports-key': apiKey },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json() as { errors?: Record<string, string>; results?: number; response?: unknown[] }

  // API-Football returns 200 with errors in body for rate limits etc.
  const errors = data.errors
  const hasErrors = errors && (Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0)
  if (hasErrors) {
    console.error(`[api-football] ${endpoint} errors: ${JSON.stringify(errors)}`)
  }
  if (data.results === 0) {
    console.warn(`[api-football] ${endpoint} returned 0 results params=${JSON.stringify(params)}`)
  }

  return schema.parse(data)
}

// --- Helpers ---

const SV_MONTHS = [
  'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
  'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
] as const

function formatFixtureDate(iso: string): string {
  const d = new Date(iso)
  const day = d.getDate()
  const month = SV_MONTHS[d.getMonth()]
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month ?? ''}, ${hours}:${minutes}`
}

function abbreviate(name: string): string {
  return ABBREVIATIONS[name] ?? name.slice(0, 3).toUpperCase()
}

function getCurrentSeason(): number {
  const now = new Date()
  return now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1
}

function transformStandings(
  data: z.infer<typeof StandingsResponseSchema>,
  teamId: number,
): StandingRow[] {
  const firstResponse = data.response[0]
  if (!firstResponse) return []
  const standings = firstResponse.league.standings[0]
  if (!standings) return []

  const fullTable: StandingRow[] = standings.map((entry) => ({
    pos: entry.rank,
    team: entry.team.name,
    teamId: entry.team.id,
    played: entry.all.played,
    won: entry.all.win,
    drawn: entry.all.draw,
    lost: entry.all.lose,
    goalsFor: entry.all.goals.for,
    goalsAgainst: entry.all.goals.against,
    points: entry.points,
  }))

  // Find Chelsea's index and show 5 rows centered around it
  const idx = fullTable.findIndex((r) => r.teamId === teamId)
  if (idx === -1) return fullTable.slice(0, 5)

  let start = Math.max(0, idx - 2)
  const end = Math.min(fullTable.length, start + 5)
  // Adjust start if we're near the bottom
  start = Math.max(0, end - 5)

  return fullTable.slice(start, end)
}

function transformFixtureToMatch(
  fixture: z.infer<typeof FixtureSchema>,
): MatchData {
  return {
    homeTeam: fixture.teams.home.name,
    awayTeam: fixture.teams.away.name,
    homeAbbr: abbreviate(fixture.teams.home.name),
    awayAbbr: abbreviate(fixture.teams.away.name),
    homeLogo: fixture.teams.home.logo,
    awayLogo: fixture.teams.away.logo,
    homeGoals: fixture.goals.home,
    awayGoals: fixture.goals.away,
    date: formatFixtureDate(fixture.fixture.date),
    isoDate: fixture.fixture.date,
    league: fixture.league.name,
    venue: fixture.fixture.venue.name ?? '',
  }
}

function transformTopScorers(
  data: z.infer<typeof PlayersResponseSchema>,
): PlayerStat[] {
  return data.response.slice(0, 10).flatMap((entry) => {
    const firstStat = entry.statistics[0]
    if (!firstStat) return []
    const total = firstStat.goals.total
    if (total == null) return []
    return [{
      name: entry.player.name,
      team: firstStat.team.name,
      value: total,
    }]
  })
}

function transformTopAssists(
  data: z.infer<typeof PlayersResponseSchema>,
): PlayerStat[] {
  return data.response.slice(0, 10).flatMap((entry) => {
    const firstStat = entry.statistics[0]
    if (!firstStat) return []
    const assists = firstStat.goals.assists
    if (assists == null) return []
    return [{
      name: entry.player.name,
      team: firstStat.team.name,
      value: assists,
    }]
  })
}

// --- Cached individual API fetchers ---

const cachedLastFixture = unstable_cache(
  async (teamId: string) => {
    const data = await apiFetch('/fixtures', { team: teamId, last: '1' }, FixturesResponseSchema, 0)
    const fixture = data.response[0]
    return fixture ? transformFixtureToMatch(fixture) : null
  },
  ['api-football', 'last-fixture'],
  { revalidate: REVALIDATE_FIXTURES },
)

const cachedNextFixture = unstable_cache(
  async (teamId: string) => {
    const data = await apiFetch('/fixtures', { team: teamId, next: '1' }, FixturesResponseSchema, 0)
    const fixture = data.response[0]
    return fixture ? transformFixtureToMatch(fixture) : null
  },
  ['api-football', 'next-fixture'],
  { revalidate: REVALIDATE_FIXTURES },
)

const cachedStandings = unstable_cache(
  async (leagueId: string, season: string) =>
    apiFetch('/standings', { league: leagueId, season }, StandingsResponseSchema, 0),
  ['api-football', 'standings'],
  { revalidate: REVALIDATE_STANDINGS },
)

const cachedTopScorers = unstable_cache(
  async (leagueId: string, season: string) => {
    const data = await apiFetch('/players/topscorers', { league: leagueId, season }, PlayersResponseSchema, 0)
    return transformTopScorers(data)
  },
  ['api-football', 'topscorers'],
  { revalidate: REVALIDATE_STATS },
)

const cachedTopAssists = unstable_cache(
  async (leagueId: string, season: string) => {
    const data = await apiFetch('/players/topassists', { league: leagueId, season }, PlayersResponseSchema, 0)
    return transformTopAssists(data)
  },
  ['api-football', 'topassists'],
  { revalidate: REVALIDATE_STATS },
)

// --- Exported fetchers ---

async function getTeamData(
  teamId: number,
  leagueId: number,
): Promise<MatchCenterData> {
  const season = getCurrentSeason().toString()
  const tid = teamId.toString()
  const lid = leagueId.toString()

  // Priority: fixtures first, then standings — topscorers/assists are best-effort
  const lastMatch = await cachedLastFixture(tid)
  const nextMatch = await cachedNextFixture(tid)
  const standingsData = await cachedStandings(lid, season)

  // TopScorers and assists are non-critical — fetch but don't block on errors
  const scorersData = await cachedTopScorers(lid, season).catch(() => [] as PlayerStat[])
  const assistsData = await cachedTopAssists(lid, season).catch(() => [] as PlayerStat[])

  return {
    lastMatch,
    nextMatch,
    standings: transformStandings(standingsData, teamId),
    topScorers: scorersData,
    topAssists: assistsData,
  }
}

export async function getHerrarData(): Promise<MatchCenterData> {
  return getTeamData(CHELSEA_MEN_ID, PREMIER_LEAGUE_ID)
}

export async function getDamerData(): Promise<MatchCenterData> {
  return getTeamData(CHELSEA_WOMEN_ID, WSL_ID)
}

// --- Full standings (all rows) ---

function transformAllStandings(
  data: z.infer<typeof StandingsResponseSchema>,
): StandingRow[] {
  const firstResponse = data.response[0]
  if (!firstResponse) return []
  const standings = firstResponse.league.standings[0]
  if (!standings) return []

  return standings.map((entry) => ({
    pos: entry.rank,
    team: entry.team.name,
    teamId: entry.team.id,
    played: entry.all.played,
    won: entry.all.win,
    drawn: entry.all.draw,
    lost: entry.all.lose,
    goalsFor: entry.all.goals.for,
    goalsAgainst: entry.all.goals.against,
    points: entry.points,
  }))
}

async function getFullStandings(leagueId: number): Promise<StandingRow[]> {
  const season = getCurrentSeason().toString()
  const data = await cachedStandings(leagueId.toString(), season)
  return transformAllStandings(data)
}

export async function getHerrarStandings(): Promise<StandingRow[]> {
  return getFullStandings(PREMIER_LEAGUE_ID)
}

export async function getDamerStandings(): Promise<StandingRow[]> {
  return getFullStandings(WSL_ID)
}

// --- Full schedule (all season fixtures) ---

async function getSchedule(teamId: number): Promise<MatchData[]> {
  const season = getCurrentSeason().toString()
  const data = await apiFetch(
    '/fixtures',
    { team: teamId.toString(), season },
    FixturesResponseSchema,
    REVALIDATE_FIXTURES,
  )

  return data.response
    .sort((a, b) => new Date(a.fixture.date).getTime() - new Date(b.fixture.date).getTime())
    .map(transformFixtureToMatch)
}

export async function getHerrarSchedule(): Promise<MatchData[]> {
  return getSchedule(CHELSEA_MEN_ID)
}

export async function getDamerSchedule(): Promise<MatchData[]> {
  return getSchedule(CHELSEA_WOMEN_ID)
}
