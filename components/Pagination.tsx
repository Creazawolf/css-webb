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

  const linkBase =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-[13px] font-semibold transition-colors'

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5" aria-label="Sidnumrering">
      {currentPage > 1 && (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          rel="prev"
          className={`${linkBase} border border-slate-200 bg-white text-slate-600 hover:border-[#034694] hover:text-[#034694]`}
        >
          Föregående
        </Link>
      )}

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-slate-400" aria-hidden="true">
            …
          </span>
        ) : p === currentPage ? (
          <span
            key={p}
            aria-current="page"
            className={`${linkBase} bg-[#034694] text-white`}
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className={`${linkBase} border border-slate-200 bg-white text-slate-600 hover:border-[#034694] hover:text-[#034694]`}
          >
            {p}
          </Link>
        ),
      )}

      {currentPage < totalPages && (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          rel="next"
          className={`${linkBase} border border-slate-200 bg-white text-slate-600 hover:border-[#034694] hover:text-[#034694]`}
        >
          Nästa
        </Link>
      )}
    </nav>
  )
}
