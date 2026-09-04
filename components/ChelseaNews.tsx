import Image from 'next/image'

import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import type { ChelseaNewsItem } from '@/lib/chelsea-news'

type ChelseaNewsProps = {
  items: ChelseaNewsItem[]
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

/**
 * Senaste nyheterna direkt från chelseafc.com.
 *
 * Vi visar rubrik, kategori och bild — brödtexten läses alltid hos Chelsea,
 * så varje kort är en extern länk. Bandet ligger på klubbens mörkblå för att
 * skilja klubbens ord från redaktionens egna.
 */
export default function ChelseaNews({ items }: ChelseaNewsProps) {
  if (items.length === 0) return null

  const cards = items.slice(0, 4)

  return (
    <section className="bg-[rgb(var(--color-chelsea-blue-dark))] text-white">
      <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          title="Från Chelsea FC"
          subtitle="Klubbens egna nyheter — vi länkar alltid vidare"
          tone="dark"
        >
          <a
            href="https://www.chelseafc.com/en/news"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex shrink-0 items-center gap-[7px] pb-1 text-[11.5px] font-bold uppercase leading-none tracking-[0.09em] text-[rgb(var(--color-gold))] transition-colors hover:text-[rgb(var(--color-gold-light))]"
          >
            chelseafc.com
            <ExternalIcon className="h-3 w-3" />
          </a>
        </SectionHeading>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((item, i) => (
            <Reveal key={item.id} className="h-full" delay={Math.min(i, 5) * 60}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-md border border-white/10 bg-white/[0.05] transition-colors duration-[250ms] ease-[var(--ease-out-soft)] hover:border-[rgb(var(--color-gold))] hover:bg-white/[0.09]"
              >
                <div className="relative aspect-[310/174] w-full overflow-hidden bg-[rgb(var(--color-night))]">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      className="media-zoom object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                    />
                  )}
                </div>

                <div className="px-[17px] pb-[18px] pt-4">
                  <span className="text-[9.5px] font-bold uppercase leading-none tracking-[0.15em] text-[rgb(var(--color-gold))]">
                    {item.category}
                  </span>
                  <h3 className="font-display mt-[9px] text-[16px] font-semibold leading-[1.3] text-white">
                    {item.title}
                  </h3>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 max-w-[560px] text-[11.5px] leading-[1.5] text-white/45">
          Rubriker och bilder hämtas automatiskt från Chelsea FC:s officiella
          webbplats. Alla länkar öppnas hos chelseafc.com.
        </p>
      </div>
    </section>
  )
}
