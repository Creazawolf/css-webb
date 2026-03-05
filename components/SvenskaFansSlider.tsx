'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { SvenskaFansArticle } from '@/lib/svenskafans'

type SvenskaFansSliderProps = {
  articles: SvenskaFansArticle[]
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

export default function SvenskaFansSlider({ articles }: SvenskaFansSliderProps) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % articles.length)
  }, [articles.length])

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + articles.length) % articles.length)
  }, [articles.length])

  useEffect(() => {
    if (paused || articles.length <= 1) return
    const timer = setInterval(next, 6000)
    return () => clearInterval(timer)
  }, [paused, next, articles.length])

  if (articles.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-5 w-1 rounded-full bg-[#D4A843]" />
          <h2 className="font-display text-lg font-bold uppercase tracking-wide text-[#022B5C]">
            SvenskaFans
          </h2>
          <span className="hidden rounded-full bg-[#022B5C]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#022B5C]/60 sm:inline-block">
            Chelsea
          </span>
        </div>
        <a
          href="https://www.svenskafans.com/fotboll/chelsea"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] font-semibold text-[#D4A843] transition-colors hover:text-[#E8C96A]"
        >
          Alla artiklar &rarr;
        </a>
      </div>

      {/* Slider */}
      <div
        className="group relative overflow-hidden rounded-lg bg-[#022B5C]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* All slides stacked, fade in/out */}
        {articles.map((article, i) => (
          <a
            key={article.link}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col transition-opacity duration-700 ease-in-out sm:flex-row ${
              i === current
                ? 'relative z-[1] opacity-100'
                : 'pointer-events-none absolute inset-0 z-0 opacity-0'
            }`}
            aria-hidden={i !== current}
            tabIndex={i === current ? 0 : -1}
          >
            {/* Image */}
            <div className="relative aspect-[16/9] w-full shrink-0 sm:aspect-auto sm:h-[280px] sm:w-[420px]">
              {article.imageUrl ? (
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, 420px"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#034694]">
                  <span className="text-4xl font-bold text-white/10">SF</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-center p-5 sm:p-7">
              <span className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30">
                {article.date}
              </span>
              <h3 className="font-display text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#D4A843] sm:text-2xl">
                {article.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-white/50">
                {article.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#D4A843]">
                Läs på SvenskaFans
                <ExternalLinkIcon className="h-3.5 w-3.5" />
              </span>
            </div>
          </a>
        ))}

        {/* Navigation arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); prev() }}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/70 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 hover:text-white group-hover:opacity-100"
              aria-label="Föregående artikel"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); next() }}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/70 opacity-0 backdrop-blur-sm transition-opacity hover:bg-black/60 hover:text-white group-hover:opacity-100"
              aria-label="Nästa artikel"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {articles.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-auto sm:right-7 sm:top-5 sm:left-auto sm:translate-x-0">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); setCurrent(i) }}
                className={`h-2 rounded-full transition-all ${
                  i === current
                    ? 'w-6 bg-[#D4A843]'
                    : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Artikel ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
