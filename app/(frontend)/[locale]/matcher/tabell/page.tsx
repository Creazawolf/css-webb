import Link from 'next/link'
import { getHerrarStandings, getDamerStandings } from '@/lib/chelsea-matches'
import FullTable from '@/components/FullTable'

export const revalidate = 1800

export const metadata = {
  title: 'Tabell | Chelsea Supporters Sweden',
  description: 'Fullständig tabellställning för Premier League och Women’s Super League.',
}

export default async function TabellPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [herrar, damer] = await Promise.all([
    getHerrarStandings().catch(() => null),
    getDamerStandings().catch(() => null),
  ])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
      <nav
        aria-label="Brödsmulor"
        className="flex items-center gap-[9px] text-[11.5px] font-medium leading-none tracking-[0.06em] text-[rgb(var(--color-muted))]"
      >
        <Link
          href={`/${locale}/matcher` as `/${string}`}
          className="hover:text-[rgb(var(--color-chelsea-blue))]"
        >
          Matcher
        </Link>
        <span aria-hidden="true" className="text-[rgb(var(--color-rule-2))]">
          /
        </span>
        <span>Tabell</span>
      </nav>

      <div className="max-w-[820px] pb-10 pt-[26px]">
        <p className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Matcher
          </span>
        </p>
        <h1 className="font-display mt-[14px] text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[42px] lg:text-[50px]">
          Tabell
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Fullständig tabellställning för Premier League och Women’s Super League —
          hämtad direkt från Chelsea FC.
        </p>
      </div>

      <FullTable herrar={herrar} damer={damer} />
    </section>
  )
}
