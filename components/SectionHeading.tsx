import Link from 'next/link'
import type { Route } from 'next'
import type { ReactNode } from 'react'

type SectionHeadingProps = {
  title: string
  /** Liten etikett till höger om rubriken, t.ex. "Chelsea FC". */
  badge?: string
  /** Valfri "se mer"-länk längst till höger. */
  href?: Route
  linkLabel?: string
  /** Rubriknivå. Default h2. */
  as?: 'h1' | 'h2' | 'h3'
  /** Mörkt läge för sektioner på blå botten. */
  tone?: 'light' | 'dark'
  children?: ReactNode
}

/**
 * Enhetlig sektionsrubrik: guldmarkör, versal rubrik och en valfri länk.
 * Används av alla moduler på startsidan så att rytmen blir densamma.
 */
export default function SectionHeading({
  title,
  badge,
  href,
  linkLabel = 'Se mer',
  as: Tag = 'h2',
  tone = 'light',
  children,
}: SectionHeadingProps) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-[#022B5C]'
  const badgeClass =
    tone === 'dark'
      ? 'bg-white/10 text-white/60'
      : 'bg-[#022B5C]/[0.07] text-[#022B5C]/60'
  const linkClass =
    tone === 'dark'
      ? 'text-[#D4A843] hover:text-[#E8C96A]'
      : 'text-[#034694] hover:text-[#022B5C]'

  return (
    <div className="mb-5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="section-marker" aria-hidden="true" />
        <Tag
          className={`font-display text-xl font-bold uppercase tracking-wide sm:text-2xl ${titleColor}`}
        >
          {title}
        </Tag>
        {badge && (
          <span
            className={`hidden rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] sm:inline-block ${badgeClass}`}
          >
            {badge}
          </span>
        )}
      </div>

      {children}

      {href && (
        <Link
          href={href}
          className={`link-underline shrink-0 text-[12px] font-semibold uppercase tracking-[0.06em] transition-colors ${linkClass}`}
        >
          {linkLabel}
        </Link>
      )}
    </div>
  )
}
