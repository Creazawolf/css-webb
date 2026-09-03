import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

import type { FooterColumn, SiteConfig } from '@/lib/site'

type FooterProps = {
  locale: string
  site: SiteConfig
  columns: FooterColumn[]
}

const DEFAULT_COLUMNS: FooterColumn[] = [
  {
    title: 'Innehåll',
    links: [
      { label: 'Löpsedel', href: '/', external: false, children: [] },
      { label: 'Artiklar', href: '/artiklar', external: false, children: [] },
      { label: 'Matchreferat', href: '/artiklar/typ/referat', external: false, children: [] },
      { label: 'ChelseaPodden', href: '/podden', external: false, children: [] },
    ],
  },
  {
    title: 'Matcher',
    links: [
      { label: 'Spelschema', href: '/matcher/spelschema', external: false, children: [] },
      { label: 'Tabell', href: '/matcher/tabell', external: false, children: [] },
      { label: 'Mötesplatser', href: '/motesplatser', external: false, children: [] },
      { label: 'Biljetter', href: '/biljetter', external: false, children: [] },
    ],
  },
  {
    title: 'Föreningen',
    links: [
      { label: 'Bli medlem', href: '/medlemskap', external: false, children: [] },
      { label: 'Evenemang', href: '/evenemang', external: false, children: [] },
      { label: 'Om oss', href: '/om-oss', external: false, children: [] },
      { label: 'Redaktionen', href: '/redaktionen', external: false, children: [] },
      { label: 'Kontakt', href: '/kontakt', external: false, children: [] },
    ],
  },
]

const SOCIAL_PATHS: Record<string, { label: string; path: string }> = {
  facebook: {
    label: 'Facebook',
    path: 'M13.2 21v-8.1h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.3H7.5v3.1h2.6V21h3.1Z',
  },
  x: {
    label: 'X',
    path: 'M18.9 3h2.9l-6.3 7.2L23 21h-5.9l-4.6-6-5.2 6H4.4l6.8-7.7L1 3h6l4.2 5.5L18.9 3Zm-1 16.2h1.6L6.2 4.7H4.5l13.4 14.5Z',
  },
  youtube: {
    label: 'YouTube',
    path: 'M23 12s0-3.85-.46-5.57a2.87 2.87 0 0 0-2-2C18.88 4 12 4 12 4s-6.88 0-8.54.43a2.87 2.87 0 0 0-2 2C1 8.15 1 12 1 12s0 3.85.46 5.57a2.87 2.87 0 0 0 2 2C5.12 20 12 20 12 20s6.88 0 8.54-.43a2.87 2.87 0 0 0 2-2C23 15.85 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z',
  },
  spotify: {
    label: 'Spotify',
    path: 'M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0Zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02Zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2Zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3Z',
  },
}

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const known = SOCIAL_PATHS[platform]
  const label = known?.label ?? platform

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/40 transition-colors duration-200 hover:text-[#D4A843]"
    >
      {known ? (
        <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
          <path d={known.path} />
        </svg>
      ) : platform === 'instagram' ? (
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      ) : (
        <span className="text-[12px] font-semibold">{label}</span>
      )}
    </a>
  )
}

function linkHref(locale: string, href: string, external: boolean): Route {
  if (external) return href as Route
  const path = href === '/' ? '' : href
  return `/${locale}${path}` as Route
}

export default function Footer({ locale, site, columns }: FooterProps) {
  const cols = columns.length > 0 ? columns : DEFAULT_COLUMNS

  return (
    <footer className="mt-6 bg-[#011428]">
      {/* Sociala medier */}
      {site.socialLinks.length > 0 && (
        <div className="border-b border-white/5">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">
              Följ oss
            </span>
            <div className="flex items-center gap-4">
              {site.socialLinks.map((s) => (
                <SocialIcon key={s.url} platform={s.platform} url={s.url} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image
              src={site.logoUrl ?? '/images/logo-white.png'}
              alt=""
              width={40}
              height={40}
              className="h-9 w-9 rounded-full bg-white/10 p-0.5"
            />
            <div>
              <span className="font-display block text-sm font-bold uppercase tracking-wide text-white">
                Chelsea Supporters
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A843]">
                Sweden
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/40">
            {site.description}
          </p>
          {site.forumUrl && (
            <a
              href={site.forumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#D4A843] transition-colors hover:text-[#E8C96A]"
            >
              Diskutera i The Shed →
            </a>
          )}
        </div>

        {cols.map((col) => (
          <div key={col.title}>
            <h2 className="font-display mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              {col.title}
            </h2>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={`${col.title}-${link.label}-${link.href}`}>
                  <Link
                    href={linkHref(locale, link.href, link.external)}
                    {...(link.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="text-[13px] text-white/40 transition-colors duration-200 hover:text-[#D4A843]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} {site.siteName}
            {site.orgNumber ? ` · Org.nr ${site.orgNumber}` : ''}
          </p>
          <p className="text-[11px] text-white/25">
            <a href={`mailto:${site.email}`} className="transition-colors hover:text-white/50">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
