'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { ArticleCard } from '@/lib/posts'
import { formatDateSv } from '@/lib/format-date'

type NewsSectionProps = {
  locale: string
  articles: ArticleCard[]
}

export default function NewsSection({ locale, articles }: NewsSectionProps) {
  if (articles.length === 0) return null

  const categories = useMemo(() => {
    const unique = Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))
    return ['Alla', ...unique]
  }, [articles])

  const [active, setActive] = useState('Alla')

  const filtered = active === 'Alla' ? articles : articles.filter((a) => a.category === active)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Header row */}
      <div className="mb-5 flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-[#022B5C]">
          Nyheter
        </h2>
        <Link
          href={`/${locale}/nyheter`}
          className="rounded-md border border-slate-200 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-slate-500 transition-colors hover:border-[#034694] hover:text-[#034694]"
        >
          Se mer
        </Link>
      </div>

      {/* Category tabs */}
      <div className="mb-6 flex gap-0 overflow-x-auto border-b border-slate-200">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`whitespace-nowrap px-4 pb-3 text-[13px] font-semibold tracking-[0.02em] transition-colors ${
              active === cat
                ? 'border-b-[3px] border-[#034694] text-[#034694]'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((article) => (
          <Link
            key={article.slug}
            href={`/${locale}/nyheter/${article.slug}`}
            className="group overflow-hidden rounded-lg border border-slate-100 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
          >
            {/* Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.imageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
              )}
              <span className="absolute left-3 top-3 rounded-sm bg-[#034694] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                {article.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-[#034694]">
                {article.title}
              </h3>
              <p className="mt-2 text-[12px] text-slate-400">{formatDateSv(article.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
