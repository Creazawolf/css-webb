import Link from 'next/link'
import type { Route } from 'next'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  title: string
  /** Liten etikett till höger om rubriken, t.ex. "Chelsea FC". */
  badge?: string
  /** Kursiv underrubrik under rubriken. */
  subtitle?: string
  /** Valfri "se mer"-länk längst till höger. */
  href?: Route
  linkLabel?: string
  /** Rubriknivå. Default h2. */
  as?: 'h1' | 'h2' | 'h3'
  /** Mörkt läge för sektioner på blå botten. */
  tone?: 'light' | 'dark'
  children?: ReactNode
}

function Chevron() {
  return (
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
  )
}

/**
 * Sektionshuvud: rubrik i versal Oswald över en kraftig linje, med plats för
 * en kursiv underrubrik och en länk längst till höger.
 *
 * Linjen under rubriken ersätter de skuggade korten som tidigare skilde
 * sektionerna åt — sidan ska läsa som en tidning, inte som ett gränssnitt.
 */
export default function SectionHeading({
  title,
  badge,
  subtitle,
  href,
  linkLabel = 'Se mer',
  as: Tag = 'h2',
  tone = 'light',
  children,
}: SectionHeadingProps) {
  const dark = tone === 'dark'

  const ruleClass = dark ? 'border-white/[0.22]' : 'border-[rgb(var(--color-text))]'
  const titleColor = dark ? 'text-white' : 'text-[rgb(var(--color-text))]'
  const subtitleColor = dark ? 'text-white/60' : 'text-[rgb(var(--color-muted))]'
  const badgeColor = dark ? 'text-white/55' : 'text-[rgb(var(--color-muted))]'
  const linkClass = dark
    ? 'text-[rgb(var(--color-gold))] hover:text-[rgb(var(--color-gold-light))]'
    : 'text-[rgb(var(--color-chelsea-blue))] hover:text-[rgb(var(--color-chelsea-blue-dark))]'

  return (
    <div
      className={`mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b-2 pb-[22px] ${ruleClass}`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Tag
            className={`font-display text-[22px] font-bold uppercase leading-none tracking-[0.06em] sm:text-[26px] ${titleColor}`}
          >
            {title}
          </Tag>
          {badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-[0.16em] ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className={`font-serif mt-[7px] text-[13px] italic leading-[1.4] ${subtitleColor}`}>
            {subtitle}
          </p>
        )}
      </div>

      {children}

      {href && (
        <Link
          href={href}
          className={`inline-flex shrink-0 items-center gap-[7px] pb-1 text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] transition-colors ${linkClass}`}
        >
          {linkLabel}
          <Chevron />
        </Link>
      )}
    </div>
  )
}
