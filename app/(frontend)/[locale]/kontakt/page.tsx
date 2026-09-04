import type { Metadata } from 'next'

import PageBlocks from '@/components/PageBlocks'
import Reveal from '@/components/Reveal'
import { getPageBySlug } from '@/lib/pages'
import { getSiteConfig } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Kontakta Chelsea Supporters Sweden.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

const CONTACT_REASONS = [
  {
    title: 'Medlemsfrågor',
    body: 'Frågor om ditt medlemskap, betalning eller medlemsnummer.',
  },
  {
    title: 'Biljetter och resor',
    body: 'Vill du med på en resa, eller har du frågor om biljettsläpp?',
  },
  {
    title: 'Skriva eller podda',
    body: 'Vill du bidra med texter, bilder eller vara med i podden? Hör av dig.',
  },
  {
    title: 'Starta en mötesplats',
    body: 'Saknas det ett ställe att se matcherna på i din stad? Vi hjälper till.',
  },
]

const DARK_PANEL_HEADING =
  'text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-white/60'

export default async function KontaktPage({ params }: PageProps) {
  const { locale } = await params
  // En redaktör kan lägga upp en sida med slug "kontakt" för att fylla på
  // med eget innehåll under kontaktuppgifterna.
  const [site, page] = await Promise.all([
    getSiteConfig(locale),
    getPageBySlug('kontakt', locale),
  ])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-[680px]">
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Föreningen
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          Kontakt
        </h1>
        <p className="font-serif mt-3 max-w-[520px] text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          {page?.intro ??
            'Hör gärna av dig — vi är en ideell förening och svarar så fort vi hinner.'}
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <div className="rounded-md bg-[rgb(var(--color-night))] px-6 py-[22px] text-white">
            <h2 className={`${DARK_PANEL_HEADING} border-b border-white/[0.12] pb-3.5`}>
              Skriv till oss
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[rgb(var(--color-gold-light))] transition-colors hover:text-[rgb(var(--color-gold))]"
            >
              {site.email}
            </a>

            {site.orgNumber && (
              <div className="mt-2 border-t border-white/[0.12] pt-4">
                <p className={DARK_PANEL_HEADING}>Organisationsnummer</p>
                <p className="mt-2 text-[12.5px] font-semibold text-white/[0.85]">
                  {site.orgNumber}
                </p>
              </div>
            )}

            {site.socialLinks.length > 0 && (
              <div className="mt-5 border-t border-white/[0.12] pt-4">
                <p className={DARK_PANEL_HEADING}>Sociala medier</p>
                <ul className="mt-1">
                  {site.socialLinks.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center text-[13px] font-medium capitalize text-white/[0.78] transition-colors hover:text-[rgb(var(--color-gold-light))]"
                      >
                        {s.platform}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {CONTACT_REASONS.map((reason, i) => (
              <Reveal key={reason.title} className="h-full" delay={i * 60}>
                <div className="h-full rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-5 pb-[22px] pt-5">
                  <h2 className="font-display text-[19px] font-semibold leading-[1.22] tracking-[0.005em] text-[rgb(var(--color-text))]">
                    {reason.title}
                  </h2>
                  <p className="font-serif mt-2.5 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
                    {reason.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {page?.content && page.content.length > 0 && (
        <div className="mx-auto mt-16 max-w-3xl">
          <PageBlocks locale={locale} blocks={page.content} />
        </div>
      )}
    </div>
  )
}
