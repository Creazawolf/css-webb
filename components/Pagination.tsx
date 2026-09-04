import Link from 'next/link'
import type { Route } from 'next'

type PaginationProps = {
  currentPage: number
  totalPages: number
  /** Bas-URL utan sidparameter, t.ex. "/sv/artiklar". */
  basePath: string
}

function pageHref(basePath: string, page: number): Route {
  return (page <= 1 ? basePath : `${basePath}?sida=${page}`) as Route
}

/**
 * Sidnumrering som rena länkar — fungerar utan JavaScript och kan indexeras.
 */
export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  // Visa alltid första, sista och grannarna till aktuell sida.
  const pages: (number | 'gap')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap')
    }
  }

  const base =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md px-4 text-[12px] font-bold uppercase leading-none tracking-[0.08em] transition-colors'

  // Ramen på kontroller måste klara 3:1 mot papperstonen — därav rule-ctl.
  const link = `${base} border border-[rgb(var(--color-rule-ctl))] text-[rgb(var(--color-ink-2))] hover:border-[rgb(var(--color-chelsea-blue))] hover:text-[rgb(var(--color-chelsea-blue))]`

  return (
    <nav
      className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-[rgb(var(--color-rule))] pt-8"
      aria-label="Sidnumrering"
    >
      {currentPage > 1 && (
        <Link href={pageHref(basePath, currentPage - 1)} rel="prev" className={link}>
          Föregående
        </Link>
      )}

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span
            key={`gap-${i}`}
            className="px-1 text-[rgb(var(--color-muted))]"
            aria-hidden="true"
          >
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className={`${base} font-display bg-[rgb(var(--color-text))] text-[14px] tracking-[0.04em] text-white`}
          >
            {p}
          </span>
        ) : (
          <Link key={p} href={pageHref(basePath, p)} className={`${link} font-display text-[14px] tracking-[0.04em]`}>
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link href={pageHref(basePath, currentPage + 1)} rel="next" className={link}>
          Nästa
        </Link>
      )}
    </nav>
  )
}
