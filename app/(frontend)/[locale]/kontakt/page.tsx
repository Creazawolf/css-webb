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

export default async function KontaktPage({ params }: PageProps) {
  const { locale } = await params
  // En redaktör kan lägga upp en sida med slug "kontakt" för att fylla på
  // med eget innehåll under kontaktuppgifterna.
  const [site, page] = await Promise.all([
    getSiteConfig(locale),
    getPageBySlug('kontakt', locale),
  ])

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Kontakt
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          {page?.intro ??
            'Hör gärna av dig — vi är en ideell förening och svarar så fort vi hinner.'}
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <div className="rounded-xl bg-[#022B5C] p-6 text-white">
            <h2 className="font-display text-base font-bold uppercase tracking-wide">
              Skriv till oss
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 block text-[15px] font-semibold text-[#D4A843] transition-colors hover:text-[#E8C96A]"
            >
              {site.email}
            </a>

            {site.orgNumber && (
              <p className="mt-5 border-t border-white/10 pt-4 text-[12px] text-white/40">
                Organisationsnummer
                <br />
                <span className="text-white/70">{site.orgNumber}</span>
              </p>
            )}

            {site.socialLinks.length > 0 && (
              <div className="mt-5 border-t border-white/10 pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40">
                  Sociala medier
                </p>
                <ul className="mt-2 space-y-1.5">
                  {site.socialLinks.map((s) => (
                    <li key={s.url}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[13px] capitalize text-white/60 transition-colors hover:text-[#D4A843]"
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CONTACT_REASONS.map((reason, i) => (
              <Reveal key={reason.title} delay={i * 60}>
                <div className="h-full rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
                  <h2 className="text-[14px] font-bold text-slate-900">{reason.title}</h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                    {reason.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {page?.content && page.content.length > 0 && (
        <div className="mx-auto mt-12 max-w-3xl">
          <PageBlocks locale={locale} blocks={page.content} />
        </div>
      )}
    </div>
  )
}
