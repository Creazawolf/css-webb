'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Route } from 'next'

import type { NavItem } from '@/lib/site'

type NavBarProps = {
  locale: string
  items: NavItem[]
  siteName: string
  logoUrl: string | null
  announcement: {
    enabled: boolean
    text: string
    linkLabel: string
    linkUrl: string
  } | null
}

function href(locale: string, item: NavItem): Route {
  if (item.external) return item.href as Route
  const path = item.href === '/' ? '' : item.href
  return `/${locale}${path}` as Route
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export default function NavBar({
  locale,
  items,
  siteName,
  logoUrl,
  announcement,
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const pathname = usePathname()

  // Stäng menyn när man navigerar — annars ligger den kvar över nya sidan.
  // Justeras under render istället för i en effekt, så att menyn aldrig hinner
  // ritas öppen ovanpå den nya sidan.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setIsOpen(false)
    setOpenGroup(null)
  }

  // Lås bakgrundsscroll när mobilmenyn är öppen.
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Escape stänger mobilmenyn.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  const isActive = (item: NavItem): boolean => {
    if (item.external) return false
    const target = href(locale, item)
    if (item.href === '/') return pathname === `/${locale}`
    return pathname === target || pathname.startsWith(`${target}/`)
  }

  const announcementHref = announcement?.linkUrl
    ? (announcement.linkUrl.startsWith('http')
        ? announcement.linkUrl
        : `/${locale}${announcement.linkUrl.startsWith('/') ? '' : '/'}${announcement.linkUrl}`)
    : null

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_3px_rgba(2,32,69,0.08)]">
      {/* Meddelanderad */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-[#D4A843] text-[#022B5C]">
          <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-2 px-4 py-1.5 text-[12px] font-semibold sm:px-6 lg:px-8">
            <span>{announcement.text}</span>
            {announcementHref && announcement.linkLabel && (
              <Link href={announcementHref as Route} className="underline underline-offset-2">
                {announcement.linkLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="h-[3px] bg-gradient-to-r from-[#022B5C] via-[#034694] to-[#D4A843]" />

      <div className="mx-auto flex h-[70px] w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logotyp */}
        <Link
          href={`/${locale}` as Route}
          className="flex shrink-0 items-center gap-3"
          aria-label={`${siteName} — startsidan`}
        >
          <Image
            src={logoUrl ?? '/images/logo-white.png'}
            alt=""
            width={44}
            height={44}
            priority
            className="h-10 w-10 rounded-full bg-[#034694] p-0.5"
          />
          <div className="hidden sm:block">
            <span className="font-display block text-lg font-bold uppercase leading-tight tracking-wide text-[#022B5C]">
              Chelsea Supporters
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A843]">
              Sweden
            </span>
          </div>
          <span className="font-display text-lg font-bold uppercase tracking-wide text-[#022B5C] sm:hidden">
            CSS
          </span>
        </Link>

        {/* Desktopmeny */}
        <nav aria-label="Huvudmeny" className="hidden items-center lg:flex">
          {items.map((item) => {
            const active = isActive(item)
            const hasChildren = item.children.length > 0

            return (
              <div
                key={`${item.label}-${item.href}`}
                className="group relative"
                onMouseEnter={() => hasChildren && setOpenGroup(item.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <Link
                  href={href(locale, item)}
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`flex items-center gap-1 rounded-sm px-3 py-2 text-[13px] font-semibold tracking-[0.03em] transition-colors duration-150 ${
                    active
                      ? 'text-[#034694]'
                      : 'text-[#1e293b] hover:bg-[#034694]/5 hover:text-[#034694]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label.toUpperCase()}
                  {hasChildren && <ChevronDown className="h-3 w-3 opacity-50" />}
                </Link>

                {/* Guldstreck under aktiv flik */}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-[#D4A843]" />
                )}

                {/* Undermeny */}
                {hasChildren && (
                  <div
                    className={`absolute left-0 top-full z-50 min-w-[210px] origin-top rounded-lg border border-slate-100 bg-white p-1.5 shadow-[var(--shadow-card-hover)] transition-all duration-200 ${
                      openGroup === item.label
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-1 opacity-0'
                    }`}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={`${child.label}-${child.href}`}
                        href={href(locale, child)}
                        {...(child.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="block rounded-md px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#034694]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Höger sida */}
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/${locale}/medlemskap` as Route}
            className="hidden rounded-md bg-[#034694] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.06em] text-white transition-colors hover:bg-[#022B5C] xl:inline-block"
          >
            Bli medlem
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isOpen}
            aria-controls="mobilmeny"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1e293b] lg:hidden"
          >
            <span className="relative h-5 w-6" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? 'translate-y-[9px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[9px] h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? '-translate-y-[9px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobilmeny */}
      <div
        id="mobilmeny"
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`ml-auto flex h-full w-4/5 max-w-xs flex-col bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-[#022B5C]">
              Meny
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Stäng meny"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobilmeny">
            {items.map((item) => (
              <div key={`${item.label}-${item.href}`} className="border-b border-slate-50">
                <Link
                  href={href(locale, item)}
                  {...(item.external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className={`block px-2 py-3.5 text-[14px] font-semibold tracking-[0.02em] transition-colors ${
                    isActive(item) ? 'text-[#034694]' : 'text-[#1e293b]'
                  }`}
                >
                  {item.label}
                </Link>
                {item.children.length > 0 && (
                  <div className="pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={`${child.label}-${child.href}`}
                        href={href(locale, child)}
                        {...(child.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="block py-2 text-[13px] text-slate-500 transition-colors hover:text-[#034694]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <Link
              href={`/${locale}/medlemskap` as Route}
              className="block rounded-md bg-[#034694] px-4 py-3 text-center text-[13px] font-bold uppercase tracking-[0.06em] text-white"
            >
              Bli medlem
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
