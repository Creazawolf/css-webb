'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { FocusEvent, KeyboardEvent } from 'react'
import type { Route } from 'next'

import type { NavItem } from '@/lib/site'

type NavBarProps = {
  locale: string
  items: NavItem[]
  siteName: string
  logoUrl: string | null
  forumUrl: string
  announcement: {
    enabled: boolean
    text: string
    linkLabel: string
    linkUrl: string
  } | null
}

/**
 * Forumet bor kvar på SvenskaFans. Adressen finns i SiteSettings, men
 * sidhuvudet får aldrig den propen — därför samma reserv som i lib/site.ts.
 */

/**
 * Korta beskrivningar i artikelpanelen. Nycklade på adress i stället för på
 * etikett, så att en rubrik som redaktionen skrivit i CMS:et aldrig skrivs
 * över — en okänd post visas hellre utan beskrivning än med fel.
 */
const TYPE_BLURBS: Record<string, string> = {
  '/artiklar': 'Allt vi publicerat, senast först',
  '/artiklar/typ/referat': 'Varje match, samma kväll',
  '/artiklar/typ/spelarbetyg': 'Hela laget betygsatt av redaktionen',
  '/artiklar/typ/infor': 'Laguppställning, form och odds',
  '/artiklar/typ/kronika': 'Längre texter av medlemmar',
  '/artiklar/typ/kronikor': 'Längre texter av medlemmar',
  '/artiklar/typ/intervju': 'Profiler i och utanför föreningen',
  '/artiklar/typ/foreningsnytt': 'Årsmöten, resor och beslut',
}

const PANEL_HEADING =
  'mb-[6px] border-b border-[rgb(var(--color-rule))] pb-[14px] text-[10px] font-bold uppercase tracking-[0.17em] text-[rgb(var(--color-muted))]'

const WRAP = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8'

function href(locale: string, item: NavItem): Route {
  if (item.external) return item.href as Route
  const path = item.href === '/' ? '' : item.href
  return `/${locale}${path}` as Route
}

function externalProps(item: NavItem) {
  return item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

/**
 * Panelen öppnas av en knapp, så sektionens egen sida skulle annars bli
 * onåbar. Ligger den inte redan bland barnen läggs den först i listan.
 */
function panelItems(item: NavItem): NavItem[] {
  const hasSelf = item.children.some((child) => child.href === item.href)
  return hasSelf ? item.children : [{ ...item, children: [] }, ...item.children]
}

/** Artikelsektionen får den breda redaktionella panelen, övriga en kompakt. */
function isEditorial(item: NavItem): boolean {
  return item.href === '/artiklar' || item.href.startsWith('/artiklar/')
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function NavBar({
  locale,
  items,
  siteName,
  logoUrl,
  forumUrl,
  announcement,
}: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [openMobileIndex, setOpenMobileIndex] = useState<number | null>(null)
  const [compact, setCompact] = useState(false)
  const headerRef = useRef<HTMLElement | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const burgerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)
  const pathname = usePathname()

  // Stäng menyn när man navigerar — annars ligger den kvar över nya sidan.
  // Justeras under render istället för i en effekt, så att menyn aldrig hinner
  // ritas öppen ovanpå den nya sidan.
  const [renderedPath, setRenderedPath] = useState(pathname)
  if (renderedPath !== pathname) {
    setRenderedPath(pathname)
    setIsOpen(false)
    setOpenIndex(null)
    setOpenMobileIndex(null)
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
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setIsOpen(false)
      burgerRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  // Lådan täcker hamburgaren, så fokus måste följa med in i den — och
  // tillbaka ut igen när den stängs.
  useEffect(() => {
    if (!isOpen) return
    closeRef.current?.focus()
  }, [isOpen])

  // Klick utanför sidhuvudet stänger undermenyn. Pekhändelsen räcker — allt
  // inuti panelen ligger innanför headern och påverkas inte.
  useEffect(() => {
    if (openIndex === null) return
    const onPointerDown = (e: PointerEvent) => {
      const el = headerRef.current
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpenIndex(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openIndex])

  // Raden krymper vid scroll.
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (item: NavItem): boolean => {
    if (item.external) return false
    const target = href(locale, item)
    if (item.href === '/') return pathname === `/${locale}`
    return pathname === target || pathname.startsWith(`${target}/`)
  }

  // Escape lämnar tillbaka fokus till knappen som öppnade panelen, annars
  // tappar tangentbordet sin plats i menyraden.
  const onHeaderKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Escape' || openIndex === null) return
    const trigger = triggerRefs.current[openIndex]
    setOpenIndex(null)
    trigger?.focus()
  }

  // Tabbar fokus ut ur sidhuvudet stängs panelen. Saknas relatedTarget är det
  // ett musklick — då sköter pekhändelsen ovan stängningen, och panelen får
  // inte försvinna innan klicket hunnit landa på länken.
  const onHeaderBlur = (e: FocusEvent<HTMLElement>) => {
    if (openIndex === null) return
    const next = e.relatedTarget as Node | null
    if (!next || e.currentTarget.contains(next)) return
    setOpenIndex(null)
  }

  const announcementHref = announcement?.linkUrl
    ? (announcement.linkUrl.startsWith('http')
        ? announcement.linkUrl
        : `/${locale}${announcement.linkUrl.startsWith('/') ? '' : '/'}${announcement.linkUrl}`)
    : null

  const renderMega = (item: NavItem, index: number) => {
    const entries = panelItems(item)
    const half = Math.ceil(entries.length / 2)
    const columns = [entries.slice(0, half), entries.slice(half)].filter(
      (column) => column.length > 0,
    )

    return (
      <div
        id={`undermeny-${index}`}
        className="animate-fade-in absolute inset-x-0 top-full z-30 hidden border-y border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] shadow-[0_20px_44px_rgba(2,32,69,0.13)] lg:block"
      >
        <div
          className={`${WRAP} grid gap-12 pb-[38px] pt-[34px] lg:grid-cols-[1fr_1fr_340px]`}
        >
          {columns.map((column, columnIndex) => (
            <div key={`kolumn-${columnIndex}`}>
              <h4 className={PANEL_HEADING}>
                {columnIndex === 0 ? item.label : 'Mer läsning'}
              </h4>
              <ul>
                {column.map((child) => {
                  const blurb = TYPE_BLURBS[child.href]
                  return (
                    <li key={`${child.label}-${child.href}`}>
                      <Link
                        href={href(locale, child)}
                        {...externalProps(child)}
                        className="flex min-h-[44px] flex-col justify-center py-[11px] transition-colors duration-150 hover:text-[rgb(var(--color-chelsea-blue))]"
                      >
                        <span className="font-display text-[16px] font-semibold leading-[1.2] tracking-[0.005em]">
                          {child.label}
                        </span>
                        {blurb && (
                          <span className="mt-1 block font-serif text-[12.5px] leading-[1.4] text-[rgb(var(--color-muted))]">
                            {blurb}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          <div>
            <h4 className={PANEL_HEADING}>Utvalt</h4>
            <Link
              href={href(locale, item)}
              className="group mt-3 block rounded-sm border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-paper))] p-5 transition-colors duration-200 hover:border-[rgb(var(--color-rule-ctl))]"
            >
              <span className="flex items-center gap-3">
                <span
                  className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
                  aria-hidden="true"
                />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
                  {item.label}
                </span>
              </span>
              <span className="font-display mt-3 block text-[19px] font-semibold leading-[1.24] text-[rgb(var(--color-text))] transition-colors duration-200 group-hover:text-[rgb(var(--color-chelsea-blue))]">
                Hela arkivet, senast först
              </span>
              <span className="mt-2 block font-serif text-[13px] leading-[1.5] text-[rgb(var(--color-muted))]">
                Referat, betyg, krönikor och föreningsnytt — samlat på ett ställe.
              </span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const renderDropdown = (item: NavItem, index: number) => (
    <div
      id={`undermeny-${index}`}
      className="animate-fade-in absolute left-0 top-full z-30 min-w-[230px] rounded-b-lg border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] p-2 shadow-[0_16px_34px_rgba(2,32,69,0.14)]"
    >
      {panelItems(item).map((child) => (
        <Link
          key={`${child.label}-${child.href}`}
          href={href(locale, child)}
          {...externalProps(child)}
          className="flex min-h-[44px] items-center whitespace-nowrap rounded-[5px] px-3 py-[10px] text-[13.5px] font-medium text-[rgb(var(--color-ink-2))] transition-colors duration-150 hover:bg-[rgb(var(--color-paper))] hover:text-[rgb(var(--color-chelsea-blue))]"
        >
          {child.label}
        </Link>
      ))}
    </div>
  )

  return (
    <header
      ref={headerRef}
      onKeyDown={onHeaderKeyDown}
      onBlur={onHeaderBlur}
      className={`sticky top-0 z-40 border-b border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] transition-shadow duration-200 ${
        compact ? 'shadow-[0_2px_14px_rgba(2,32,69,0.10)]' : ''
      }`}
    >
      {/* Meddelanderad */}
      {announcement?.enabled && announcement.text && (
        <div className="bg-[rgb(var(--color-gold))] text-[rgb(var(--color-chelsea-blue-dark))]">
          <div
            className={`${WRAP} flex items-center justify-center gap-2 py-1.5 text-[12px] font-semibold`}
          >
            <span>{announcement.text}</span>
            {announcementHref && announcement.linkLabel && (
              <Link href={announcementHref as Route} className="underline underline-offset-2">
                {announcement.linkLabel}
              </Link>
            )}
          </div>
        </div>
      )}

      <div
        className="h-[3px]"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--color-chelsea-blue-dark)), rgb(var(--color-chelsea-blue)) 55%, rgb(var(--color-gold)))',
        }}
      />

      <div
        className={`${WRAP} flex items-stretch gap-6 transition-[height] duration-200 lg:gap-10 ${
          compact ? 'h-[58px]' : 'h-[76px]'
        }`}
      >
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
            className={`shrink-0 rounded-full bg-[rgb(var(--color-chelsea-blue))] p-0.5 transition-all duration-200 ${
              compact ? 'h-8 w-8' : 'h-10 w-10'
            }`}
          />
          <span className="hidden sm:block">
            <span
              className={`font-display block font-bold uppercase leading-[1.05] tracking-[0.04em] text-[rgb(var(--color-chelsea-blue-dark))] ${
                compact ? 'text-[15px]' : 'text-[18px]'
              }`}
            >
              Chelsea Supporters
            </span>
            <span
              className={`mt-[3px] block font-bold uppercase text-[rgb(var(--color-gold-ink))] ${
                compact ? 'text-[8.5px] tracking-[0.24em]' : 'text-[9.5px] tracking-[0.28em]'
              }`}
            >
              Sweden
            </span>
          </span>
          <span className="font-display text-[15px] font-bold uppercase tracking-[0.05em] text-[rgb(var(--color-chelsea-blue-dark))] sm:hidden">
            CSS
          </span>
        </Link>

        {/* Desktopmeny */}
        <nav
          aria-label="Huvudmeny"
          className="hidden min-w-0 flex-1 items-stretch overflow-x-clip lg:flex"
        >
          {items.map((item, index) => {
            const active = isActive(item)
            const hasChildren = item.children.length > 0
            const open = openIndex === index
            const label = (
              <>
                {item.label}
                {hasChildren && (
                  <ChevronDown className="ml-[5px] h-[9px] w-[9px] opacity-45" />
                )}
                {active && (
                  <span
                    className="absolute inset-x-[13px] -bottom-px h-[2px] rounded-[2px] bg-[rgb(var(--color-gold))]"
                    aria-hidden="true"
                  />
                )}
              </>
            )
            const itemClass = `relative flex items-center px-[10px] font-semibold uppercase tracking-[0.09em] transition-colors duration-150 hover:text-[rgb(var(--color-chelsea-blue))] ${
              compact ? 'text-[11.5px]' : 'text-[12px]'
            } ${
              active || open
                ? 'text-[rgb(var(--color-chelsea-blue-dark))]'
                : 'text-[rgb(var(--color-ink-2))]'
            }`

            return (
              <div
                key={`${item.label}-${item.href}`}
                className={`flex items-stretch ${isEditorial(item) ? '' : 'relative'}`}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[index] = el
                    }}
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`undermeny-${index}`}
                    aria-haspopup="true"
                    {...(active ? { 'aria-current': 'page' as const } : {})}
                    className={itemClass}
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    href={href(locale, item)}
                    {...externalProps(item)}
                    className={itemClass}
                    {...(active ? { 'aria-current': 'page' as const } : {})}
                  >
                    {label}
                  </Link>
                )}

                {/* Den breda panelen spänner över hela sidhuvudet — därför är
                    omslaget runt artikelposten inte positionerat. */}
                {hasChildren &&
                  open &&
                  (isEditorial(item) ? renderMega(item, index) : renderDropdown(item, index))}
              </div>
            )
          })}
        </nav>

        {/* Höger sida */}
        <div className="ml-auto flex shrink-0 items-center gap-[14px] pl-3">
          <a
            href={forumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-[12px] font-semibold tracking-[0.06em] text-[rgb(var(--color-muted))] transition-colors duration-150 hover:text-[rgb(var(--color-chelsea-blue))] lg:inline-flex"
          >
            The Shed
            <ArrowOut className="h-[11px] w-[11px]" />
          </a>

          <Link
            href={`/${locale}/medlemskap` as Route}
            className="hidden min-h-[44px] items-center justify-center rounded-md bg-[rgb(var(--color-chelsea-blue))] px-5 py-[13px] text-[12px] font-bold uppercase tracking-[0.08em] text-white transition-colors duration-200 hover:bg-[rgb(var(--color-chelsea-blue-dark))] lg:inline-flex"
          >
            Bli medlem
          </Link>

          <button
            type="button"
            ref={burgerRef}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isOpen}
            aria-controls="mobilmeny"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-[rgb(var(--color-text))] lg:hidden"
          >
            <span className="relative h-[18px] w-[26px]" aria-hidden="true">
              <span
                className={`absolute left-0 top-0 h-[2px] w-[26px] rounded-[2px] bg-current transition-transform duration-300 ${isOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-2 h-[2px] w-[26px] rounded-[2px] bg-current transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 top-4 h-[2px] w-[26px] rounded-[2px] bg-current transition-transform duration-300 ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobilmeny */}
      {isOpen && (
        <div
          id="mobilmeny"
          className="fixed inset-0 z-[100] flex flex-col bg-[rgb(var(--color-night))] text-white lg:hidden"
        >
          <div className="flex h-[62px] shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
            <span className="flex items-center gap-[9px]">
              <Image
                src={logoUrl ?? '/images/logo-white.png'}
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-white/10 p-0.5"
              />
              <span className="font-display text-[15px] font-bold uppercase tracking-[0.05em]">
                Meny
              </span>
            </span>
            <button
              type="button"
              ref={closeRef}
              onClick={() => {
                setIsOpen(false)
                burgerRef.current?.focus()
              }}
              aria-label="Stäng meny"
              className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav
            className="flex-1 overflow-y-auto px-4 pb-8 pt-2 sm:px-6"
            aria-label="Mobilmeny"
          >
            <ul>
              {items.map((item, index) => {
                const hasChildren = item.children.length > 0
                const open = openMobileIndex === index

                return (
                  <li
                    key={`${item.label}-${item.href}`}
                    className="border-t border-white/10"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={href(locale, item)}
                        {...externalProps(item)}
                        className={`font-display flex min-h-[56px] flex-1 items-center py-[17px] text-[21px] font-semibold uppercase leading-none tracking-[0.04em] transition-colors duration-150 hover:text-[rgb(var(--color-gold))] ${
                          isActive(item) ? 'text-[rgb(var(--color-gold))]' : 'text-white'
                        }`}
                        {...(isActive(item) ? { 'aria-current': 'page' as const } : {})}
                      >
                        {item.label}
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => setOpenMobileIndex(open ? null : index)}
                          aria-expanded={open}
                          aria-controls={`mobil-undermeny-${index}`}
                          aria-label={`Visa undersidor för ${item.label}`}
                          className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[rgb(var(--color-gold))]"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                    </div>

                    {hasChildren && open && (
                      <ul id={`mobil-undermeny-${index}`} className="pb-3">
                        {item.children.map((child) => (
                          <li key={`${child.label}-${child.href}`}>
                            <Link
                              href={href(locale, child)}
                              {...externalProps(child)}
                              className="flex min-h-[44px] items-center py-2 text-[14px] font-medium text-white/70 transition-colors duration-150 hover:text-[rgb(var(--color-gold))]"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ul>

            <Link
              href={`/${locale}/medlemskap` as Route}
              className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-md bg-[rgb(var(--color-gold))] px-5 py-[13px] text-[12px] font-bold uppercase tracking-[0.08em] text-[rgb(var(--color-chelsea-blue-dark))] transition-colors duration-200 hover:bg-[rgb(var(--color-gold-light))]"
            >
              Bli medlem
            </Link>

            <a
              href={forumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex min-h-[44px] items-center justify-center gap-1.5 text-[12px] font-semibold text-white/60 transition-colors duration-150 hover:text-white"
            >
              The Shed
              <ArrowOut className="h-[11px] w-[11px]" />
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
