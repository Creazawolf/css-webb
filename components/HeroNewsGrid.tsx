import Image from 'next/image'
import Link from 'next/link'
import type { ArticleCard } from '@/lib/posts'
import { formatDateSv } from '@/lib/format-date'

type HeroNewsGridProps = {
  locale: string
  articles: ArticleCard[]
}

export default function HeroNewsGrid({ locale, articles }: HeroNewsGridProps) {
  if (articles.length === 0) return null

  const main = articles[0]!
  const side = articles.slice(1, 3)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 pt-5 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-[6px] overflow-hidden rounded-xl lg:grid-cols-5 lg:grid-rows-2" style={{ minHeight: '420px' }}>
        {/* Main featured article — spans left 3 cols, both rows */}
        <Link
          href={`/${locale}/nyheter/${main.slug}`}
          className="group relative col-span-1 flex items-end overflow-hidden lg:col-span-3 lg:row-span-2"
          style={{ minHeight: '280px' }}
        >
          {main.imageUrl ? (
            <Image
              src={main.imageUrl}
              alt={main.imageAlt}
              fill
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
          )}
          <div className="hero-overlay absolute inset-0" />
          <div className="relative z-10 p-5 sm:p-7">
            <span className="mb-2 inline-block rounded-sm bg-[#D4A843] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#022B5C]">
              {main.category}
            </span>
            <h2 className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-[2rem]">
              {main.title}
            </h2>
            <p className="mt-2 text-[13px] text-white/60">{formatDateSv(main.publishedAt)}</p>
          </div>
        </Link>

        {/* Side articles — right 2 cols, one per row */}
        {side.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/nyheter/${article.slug}`}
            className="group relative flex items-end overflow-hidden lg:col-span-2"
            style={{ minHeight: '140px' }}
          >
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.imageAlt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
            )}
            <div className="hero-overlay-sm absolute inset-0" />
            <div className="relative z-10 p-4 sm:p-5">
              <span className="mb-1.5 inline-block rounded-sm bg-[#D4A843] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#022B5C]">
                {article.category}
              </span>
              <h3 className="font-display text-base font-bold leading-snug text-white sm:text-lg">
                {article.title}
              </h3>
              <p className="mt-1 text-[12px] text-white/60">{formatDateSv(article.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
