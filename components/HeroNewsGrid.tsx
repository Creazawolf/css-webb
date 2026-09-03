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
 * Löpsedeln: en stor puff och två mindre bredvid.
 *
 * Bilden i den stora puffen är sidans LCP-element och laddas därför med
 * priority, medan de mindre får ladda som vanligt.
 */
export default function HeroNewsGrid({ locale, articles }: HeroNewsGridProps) {
  if (articles.length === 0) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#022B5C] via-[#034694] to-[#0A5BB5] px-6 py-16 text-center sm:px-10">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#D4A843]/10" />
          <h1 className="font-display relative text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl">
            Chelsea Supporters Sweden
          </h1>
          <p className="relative mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-blue-100/80">
            Här samlar vi allt om Chelsea på svenska — referat, spelarbetyg, podden
            och var vi ses på matcherna.
          </p>
          <Link
            href={`/${locale}/medlemskap` as Route}
            className="relative mt-6 inline-block rounded-md bg-[#D4A843] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#022B5C] transition-colors hover:bg-[#E8C96A]"
          >
            Bli medlem
          </Link>
        </div>
      </section>
    )
  }

  const main = articles[0]!
  const side = articles.slice(1, 3)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-6 sm:px-6 lg:px-8">
      <h1 className="sr-only">Chelsea Supporters Sweden — senaste nytt</h1>

      <div className="grid grid-cols-1 gap-[6px] overflow-hidden rounded-xl lg:min-h-[440px] lg:grid-cols-5 lg:grid-rows-2">
        {/* Huvudpuff */}
        <Link
          href={`/${locale}/artiklar/${main.slug}` as Route}
          className="group relative col-span-1 flex min-h-[300px] items-end overflow-hidden lg:col-span-3 lg:row-span-2"
        >
          {main.imageUrl ? (
            <Image
              src={main.imageUrl}
              alt={main.imageAlt}
              fill
              priority
              className="media-zoom object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
          )}
          <div className="hero-overlay absolute inset-0" aria-hidden="true" />

          <div className="relative z-10 p-5 sm:p-7">
            <span className="mb-2.5 inline-block rounded-sm bg-[#D4A843] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#022B5C]">
              {main.label}
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2.1rem]">
              {main.title}
            </h2>
            {main.excerpt && (
              <p className="mt-2 hidden max-w-xl text-[14px] leading-relaxed text-white/80 sm:block">
                {main.excerpt}
              </p>
            )}
            <p className="mt-2.5 text-[12px] text-white/75">
              {formatDateSv(main.publishedAt)}
            </p>
          </div>
        </Link>

        {/* Sidopuffar */}
        {side.map((article) => (
          <Link
            key={article.id}
            href={`/${locale}/artiklar/${article.slug}` as Route}
            className="group relative flex min-h-[180px] items-end overflow-hidden lg:col-span-2"
          >
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                className="media-zoom object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
            )}
            <div className="hero-overlay-sm absolute inset-0" aria-hidden="true" />

            <div className="relative z-10 p-4 sm:p-5">
              <span className="mb-1.5 inline-block rounded-sm bg-[#D4A843] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#022B5C]">
                {article.label}
              </span>
              <h3 className="font-display text-base font-bold leading-snug text-white sm:text-lg">
                {article.title}
              </h3>
              <p className="mt-1 text-[12px] text-white/75">
                {formatDateSv(article.publishedAt)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
