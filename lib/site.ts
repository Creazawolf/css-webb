import { getPayload } from 'payload'
import config from '@payload-config'

import type { Event, Navigation, SiteSetting, Venue } from '@/payload-types'

import { mediaUrl } from './posts'

export type NavItem = {
  label: string
  href: string
  external: boolean
  children: NavItem[]
}

/**
 * Standardmenyn.
 *
 * Speglar den meny föreningen har på SvenskaFans, så att medlemmarna känner
 * igen sig. Används tills någon fyllt i Meny-globalen i admin.
 */
export const DEFAULT_NAV: NavItem[] = [
  { label: 'Löpsedel', href: '/', external: false, children: [] },
  {
    label: 'Artiklar',
    href: '/artiklar',
    external: false,
    children: [
      { label: 'Alla artiklar', href: '/artiklar', external: false, children: [] },
      { label: 'Matchreferat', href: '/artiklar/typ/referat', external: false, children: [] },
      { label: 'Spelarbetyg', href: '/artiklar/typ/spelarbetyg', external: false, children: [] },
      { label: 'Inför match', href: '/artiklar/typ/infor', external: false, children: [] },
      { label: 'Krönikor', href: '/artiklar/typ/kronika', external: false, children: [] },
    ],
  },
  {
    label: 'Matcher',
    href: '/matcher',
    external: false,
    children: [
      { label: 'Spelschema', href: '/matcher/spelschema', external: false, children: [] },
      { label: 'Tabell', href: '/matcher/tabell', external: false, children: [] },
    ],
  },
  {
    label: 'Föreningen',
    href: '/om-oss',
    external: false,
    children: [
      { label: 'Om oss', href: '/om-oss', external: false, children: [] },
      { label: 'Redaktionen', href: '/redaktionen', external: false, children: [] },
      { label: 'Evenemang', href: '/evenemang', external: false, children: [] },
      { label: 'Mötesplatser', href: '/motesplatser', external: false, children: [] },
      { label: 'Kontakt', href: '/kontakt', external: false, children: [] },
    ],
  },
  {
    label: 'Guider',
    href: '/biljetter',
    external: false,
    children: [
      { label: 'Biljetter', href: '/biljetter', external: false, children: [] },
      { label: 'Arenaguide', href: '/arenaguide', external: false, children: [] },
      { label: 'Reseguide', href: '/reseguide', external: false, children: [] },
      { label: 'FPL-ligan', href: '/fpl', external: false, children: [] },
    ],
  },
  { label: 'Podden', href: '/podden', external: false, children: [] },
]

export type SiteConfig = {
  siteName: string
  tagline: string
  description: string
  email: string
  membershipFee: string
  swish: string
  bankgiro: string
  orgNumber: string
  socialLinks: Array<{ platform: string; url: string }>
  showChelseaNews: boolean
  showPodcast: boolean
  showSvenskaFans: boolean
  announcement: {
    enabled: boolean
    text: string
    linkLabel: string
    linkUrl: string
  } | null
  forumUrl: string
  podcastUrl: string
  fplLeagueUrl: string
  logoUrl: string | null
}

const FALLBACK_SITE: SiteConfig = {
  siteName: 'Chelsea Supporters Sweden',
  tagline: 'Sveriges Chelsea-supportrar',
  description:
    'Chelsea Supporters Sweden är den svenska supporterföreningen för Chelsea FC — matchkvällar, resor och gemenskap.',
  email: 'info@chelseasweden.se',
  membershipFee: '',
  swish: '',
  bankgiro: '',
  orgNumber: '',
  socialLinks: [],
  showChelseaNews: true,
  showPodcast: true,
  showSvenskaFans: false,
  announcement: null,
  forumUrl: 'https://www.svenskafans.com/fotboll/lag/chelsea/forum',
  podcastUrl: 'https://open.spotify.com/show/5Jk5cKJ90z2QPlj0CDtWBK',
  fplLeagueUrl: '',
  logoUrl: null,
}

/**
 * Läser sajtinställningarna.
 *
 * Faller alltid tillbaka på rimliga värden — sajten ska fungera direkt efter
 * en tom installation, innan någon hunnit fylla i globalen.
 */
export async function getSiteConfig(locale: string = 'sv'): Promise<SiteConfig> {
  try {
    const payload = await getPayload({ config })
    const settings = (await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      locale: locale as 'sv' | 'en',
    })) as SiteSetting

    const announcement = settings.announcement?.enabled
      ? {
          enabled: true,
          text: settings.announcement.text ?? '',
          linkLabel: settings.announcement.linkLabel ?? '',
          linkUrl: settings.announcement.linkUrl ?? '',
        }
      : null

    return {
      siteName: settings.siteName || FALLBACK_SITE.siteName,
      tagline: settings.tagline || FALLBACK_SITE.tagline,
      description: settings.description || FALLBACK_SITE.description,
      email: settings.email || FALLBACK_SITE.email,
      membershipFee: settings.membershipFee ?? '',
      swish: settings.swish ?? '',
      bankgiro: settings.bankgiro ?? '',
      orgNumber: settings.orgNumber ?? '',
      socialLinks: (settings.socialLinks ?? []).map((s) => ({
        platform: s.platform,
        url: s.url,
      })),
      showChelseaNews: settings.showChelseaNews ?? true,
      showPodcast: settings.showPodcast ?? true,
      showSvenskaFans: settings.showSvenskaFans ?? false,
      announcement,
      forumUrl: settings.forumUrl || FALLBACK_SITE.forumUrl,
      podcastUrl: settings.podcastUrl || FALLBACK_SITE.podcastUrl,
      fplLeagueUrl: settings.fplLeagueUrl ?? '',
      logoUrl: mediaUrl(settings.logo, 'thumbnail'),
    }
  } catch {
    return FALLBACK_SITE
  }
}

type NavLinkSource = {
  label: string
  link: string
  external?: boolean | null
}

function toNavItem(source: NavLinkSource, children: NavItem[] = []): NavItem {
  return {
    label: source.label,
    href: source.link,
    external: Boolean(source.external) || /^https?:\/\//.test(source.link),
    children,
  }
}

export type FooterColumn = {
  title: string
  links: NavItem[]
}

export async function getNavigation(locale: string = 'sv'): Promise<{
  items: NavItem[]
  footerColumns: FooterColumn[]
}> {
  try {
    const payload = await getPayload({ config })
    const nav = (await payload.findGlobal({
      slug: 'navigation',
      depth: 0,
      locale: locale as 'sv' | 'en',
    })) as Navigation

    const items = (nav.items ?? []).map((item) =>
      toNavItem(item, (item.children ?? []).map((child) => toNavItem(child))),
    )

    const footerColumns: FooterColumn[] = (nav.footerColumns ?? []).map((col) => ({
      title: col.title,
      links: (col.links ?? []).map((link) => toNavItem(link)),
    }))

    return {
      items: items.length > 0 ? items : DEFAULT_NAV,
      footerColumns,
    }
  } catch {
    return { items: DEFAULT_NAV, footerColumns: [] }
  }
}

// --- Evenemang ---

export type EventCard = {
  id: number
  title: string
  slug: string
  date: string
  endDate: string | null
  location: string
  city: string
  eventType: string
  registrationLink: string | null
  imageUrl: string | null
}

export const EVENT_TYPE_LABELS: Record<string, string> = {
  pubkvall: 'Pubkväll',
  resa: 'Resa',
  arsmote: 'Årsmöte',
  traff: 'Träff',
  annat: 'Evenemang',
}

function toEventCard(event: Event): EventCard {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug ?? '',
    date: event.date,
    endDate: event.endDate ?? null,
    location: event.location,
    city: event.city ?? '',
    eventType: event.eventType,
    registrationLink: event.registrationLink ?? null,
    imageUrl: mediaUrl(event.featuredImage, 'card'),
  }
}

/** Kommande evenemang, närmast först. */
export async function getUpcomingEvents(
  limit = 4,
  locale: string = 'sv',
): Promise<EventCard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'events',
      where: {
        _status: { equals: 'published' },
        date: { greater_than_equal: new Date().toISOString() },
      },
      sort: 'date',
      limit,
      depth: 1,
      locale: locale as 'sv' | 'en',
    })
    return result.docs.map(toEventCard)
  } catch {
    return []
  }
}

// --- Mötesplatser ---

export type VenueCard = {
  id: number
  name: string
  city: string
  address: string
  description: string
  contactName: string
  contactEmail: string
  mapsUrl: string
  imageUrl: string | null
}

export async function getVenues(locale: string = 'sv'): Promise<VenueCard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'venues',
      where: { active: { equals: true } },
      sort: 'city',
      limit: 200,
      depth: 1,
      locale: locale as 'sv' | 'en',
    })

    return result.docs.map((venue: Venue) => ({
      id: venue.id,
      name: venue.name,
      city: venue.city,
      address: venue.address ?? '',
      description: venue.description ?? '',
      contactName: venue.contactName ?? '',
      contactEmail: venue.contactEmail ?? '',
      mapsUrl: venue.mapsUrl ?? '',
      imageUrl: mediaUrl(venue.image, 'card'),
    }))
  } catch {
    return []
  }
}
