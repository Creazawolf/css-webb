import Image from 'next/image'

import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import type { ChelseaNewsItem } from '@/lib/chelsea-news'

type ChelseaNewsProps = {
  items: ChelseaNewsItem[]
}

function CrestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2.6 20 5.4v6.1c0 4.6-3.1 8.4-8 9.9-4.9-1.5-8-5.3-8-9.9V5.4l8-2.8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M12 7.4c1.9 0 3.4 1.4 3.4 3.2S13.9 13.8 12 13.8s-3.4-1.4-3.4-3.2S10.1 7.4 12 7.4Z"
        fill="currentColor"
        opacity="0.9"
      />
    </svg>
  )
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

/**
 * Senaste nyheterna direkt från chelseafc.com.
 *
 * Vi visar rubrik, kategori och bild — brödtexten läses alltid hos Chelsea,
 * så varje kort är en extern länk. Första kortet är stort, resten en lista.
 */
export default function ChelseaNews({ items }: ChelseaNewsProps) {
  if (items.length === 0) return null

  const [lead, ...rest] = items
  const list = rest.slice(0, 5)

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading title="Från Chelsea FC" badge="chelseafc.com">
        <a
          href="https://www.chelseafc.com/en/news"
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline ml-auto inline-flex shrink-0 items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.06em] text-[#034694] transition-colors hover:text-[#022B5C]"
        >
          Alla nyheter
          <ExternalIcon className="h-3.5 w-3.5" />
        </a>
      </SectionHeading>

      <Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          {/* Huvudnyhet */}
          {lead && (
            <a
              href={lead.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group card-lift relative flex min-h-[260px] items-end overflow-hidden rounded-xl bg-[#022B5C] shadow-[var(--shadow-card)] lg:col-span-3 lg:min-h-[340px]"
            >
              {lead.imageUrl ? (
                <Image
                  src={lead.imageUrl}
                  alt=""
                  fill
                  className="media-zoom object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
              )}
              <div className="hero-overlay absolute inset-0" aria-hidden="true" />

              <div className="relative z-10 p-5 sm:p-7">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-[#D4A843] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#022B5C]">
                  <CrestIcon className="h-3 w-3" />
                  {lead.category}
                </span>
                <h3 className="font-display text-xl font-bold leading-tight text-white sm:text-2xl lg:text-[1.75rem]">
                  {lead.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#D4A843]">
                  Läs på chelseafc.com
                  <ExternalIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </a>
          )}

          {/* Lista */}
          <ul className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[var(--shadow-card)] lg:col-span-2">
            {list.map((item, i) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-3 p-3 transition-colors hover:bg-slate-50 ${
                    i < list.length - 1 ? 'border-b border-slate-100' : ''
                  }`}
                >
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt=""
                        fill
                        className="media-zoom object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#034694] to-[#022B5C]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#034694]">
                      {item.category}
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-[13px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-[#034694]">
                      {item.title}
                    </p>
                  </div>

                  <ExternalIcon className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-[#D4A843]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <p className="mt-3 text-[11px] text-slate-400">
        Rubriker och bilder hämtas automatiskt från Chelsea FC:s officiella
        webbplats. Alla länkar öppnas hos chelseafc.com.
      </p>
    </section>
  )
}
