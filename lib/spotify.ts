import { z } from 'zod'

const SPOTIFY_SHOW_ID = '5Jk5cKJ90z2QPlj0CDtWBK'
const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const API_BASE = 'https://api.spotify.com/v1'

// In-memory token cache (survives across requests within the same server process)
let tokenCache: { token: string; expiresAt: number } | null = null

async function getSpotifyToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET')
  }

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) {
    throw new Error(`Spotify token request failed: ${res.status}`)
  }

  const data = await res.json()
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }

  return tokenCache.token
}

// --- Zod schemas ---

const SpotifyEpisodeSchema = z.object({
  name: z.string(),
  release_date: z.string(),
  duration_ms: z.number(),
  external_urls: z.object({ spotify: z.string() }),
})

const SpotifyShowSchema = z.object({
  description: z.string(),
  external_urls: z.object({ spotify: z.string() }),
  episodes: z.object({
    items: z.array(SpotifyEpisodeSchema),
  }),
})

// --- Public types ---

export type PodcastEpisode = {
  nummer: number | null
  titel: string
  datum: string
  tid: string
  spotifyUrl: string
}

export type SpotifyShowData = {
  description: string
  showUrl: string
  episodes: PodcastEpisode[]
}

// --- Helpers ---

function formatDuration(ms: number): string {
  const totalMinutes = Math.round(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours} tim ${minutes} min`
  }
  return `${minutes} min`
}

function formatDateSv(dateStr: string): string {
  const date = new Date(dateStr)
  const months = [
    'jan', 'feb', 'mar', 'apr', 'maj', 'jun',
    'jul', 'aug', 'sep', 'okt', 'nov', 'dec',
  ]
  return `${date.getUTCDate()} ${months[date.getUTCMonth()]}`
}

function parseEpisodeNumber(name: string): { nummer: number | null; titel: string } {
  // Matches "326. Title", "#326 Title", "326 - Title", "326 – Title"
  const match = name.match(/^#?(\d+)[.\s\-–—]+\s*(.+)$/)
  if (match && match[1] && match[2]) {
    return { nummer: parseInt(match[1], 10), titel: match[2] }
  }
  return { nummer: null, titel: name }
}

// --- Main fetch ---

export async function getShowWithEpisodes(): Promise<SpotifyShowData> {
  const token = await getSpotifyToken()

  const res = await fetch(
    `${API_BASE}/shows/${SPOTIFY_SHOW_ID}?market=SE`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 1800 },
    },
  )

  if (!res.ok) {
    throw new Error(`Spotify API error: ${res.status}`)
  }

  const raw = await res.json()
  const show = SpotifyShowSchema.parse(raw)

  const episodes: PodcastEpisode[] = show.episodes.items.slice(0, 4).map((ep) => {
    const { nummer, titel } = parseEpisodeNumber(ep.name)
    return {
      nummer,
      titel,
      datum: formatDateSv(ep.release_date),
      tid: formatDuration(ep.duration_ms),
      spotifyUrl: ep.external_urls.spotify,
    }
  })

  return {
    description: show.description,
    showUrl: show.external_urls.spotify,
    episodes,
  }
}
