import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'

import { formatDateSv } from '@/lib/format-date'
import type { ArticleCard } from '@/lib/posts'

type HeroNewsGridProps = {
  locale: string
  articles: ArticleCard[]
}

/**
 * Löpsedeln: ett stort uppslag till vänster och en rail med de senaste
 * artiklarna till höger.
 *
 * Rubriken ligger under bilden i stället för ovanpå den — texten behöver
 * ingen mörkläggning för att gå att läsa, och bilden slipper bli bakgrund.
 *
 * Bilden i uppslaget är sidans LCP-element och laddas därför med priority,
 * medan railen får ladda som vanligt.
 */
export default function HeroNewsGrid({ locale, articles }: HeroNewsGridProps) {
  if (articles.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-10 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-[rgb(var(--color-chelsea-blue))] px-6 py-14 text-center sm:px-10">
          <h1 className="font-display text-3xl font-bold uppercase leading-[1.08] tracking-[0.02em] text-white sm:text-[34px]">
            Chelsea Supporters Sweden
          </h1>
          <p className="font-serif mx-auto mt-3 max-w-xl text-[15.5px] leading-[1.6] text-white/80">
            Här samlar vi allt om Chelsea på svenska — referat, spelarbetyg, podden
            och var vi ses på matcherna.
          </p>
          <Link
            href={`/${locale}/medlemskap` as Route}
            className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-md bg-[rgb(var(--color-gold))] px-[26px] py-4 text-[13px] font-bold uppercase tracking-[0.08em] text-[rgb(var(--color-chelsea-blue-dark))] transition-colors hover:bg-[rgb(var(--color-gold-light))]"
          >
            Bli medlem
          </Link>
        </div>
      </section>
    )
  }

  const main = articles[0]!
  const rail = articles.slice(1)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <h1 className="sr-only">Chelsea Supporters Sweden — senaste nytt</h1>

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        {/* Uppslaget */}
        <article>
          <Link href={`/${locale}/artiklar/${main.slug}` as Route} className="group block">
            <span className="relative block aspect-[884/497] overflow-hidden rounded-md bg-[rgb(var(--color-chelsea-blue-dark))]">
              {main.imageUrl && (
                <Image
                  src={main.imageUrl}
                  alt={main.imageAlt}
                  fill
                  priority
                  className="media-zoom object-cover"
                  sizes="(max-width: 1024px) 100vw, 860px"
                />
              )}
            </span>

            <span className="mt-[22px] flex items-center gap-3">
              <span
                className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
                aria-hidden="true"
              />
              <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
                {main.label}
              </span>
            </span>

            <h2 className="font-display mt-3.5 text-[32px] font-bold leading-[1.02] tracking-[-0.012em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))] sm:text-[42px] lg:text-[52px] lg:leading-none">
              {main.title}
            </h2>
          </Link>

          {main.excerpt && (
            <p className="font-serif mt-4 max-w-[740px] text-[18px] leading-[1.55] text-pretty text-[rgb(var(--color-ink-2))] sm:text-[20px]">
              {main.excerpt}
            </p>
          )}

          <p className="mt-[22px] flex items-center gap-2.5 border-t border-[rgb(var(--color-rule))] pt-4 text-[12px] font-medium leading-none text-[rgb(var(--color-muted))]">
            {formatDateSv(main.publishedAt)}
          </p>
        </article>

        {/* Railen */}
        {rail.length > 0 && (
          <aside>
            <div className="flex items-center gap-3 pb-4">
              <span
                className="block h-[3px] w-5 rounded-[2px] bg-[rgb(var(--color-gold))]"
                aria-hidden="true"
              />
              <h2 className="font-display text-[13px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-text))]">
                Senaste
              </h2>
            </div>

            <ul>
              {rail.map((article) => (
                <li
                  key={article.id}
                  className="border-t border-[rgb(var(--color-rule))] py-[18px] first:border-[rgb(var(--color-rule-2))]"
                >
                  <Link
                    href={`/${locale}/artiklar/${article.slug}` as Route}
                    className="group block"
                  >
                    <span className="block text-[10px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-chelsea-blue))]">
                      {article.label}
                    </span>
                    <span className="font-display mt-2 block text-[19px] font-semibold leading-[1.22] tracking-[0.005em] text-[rgb(var(--color-text))] transition-colors group-hover:text-[rgb(var(--color-chelsea-blue))]">
                      {article.title}
                    </span>
                    <span className="mt-2 block text-[11.5px] font-medium leading-none text-[rgb(var(--color-muted))]">
                      {formatDateSv(article.publishedAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href={`/${locale}/artiklar` as Route}
              className="mt-[22px] inline-flex items-center gap-[7px] text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-chelsea-blue))] transition-colors hover:text-[rgb(var(--color-chelsea-blue-dark))]"
            >
              Alla artiklar
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
            </Link>
          </aside>
        )}
      </div>
    </section>
  )
}
