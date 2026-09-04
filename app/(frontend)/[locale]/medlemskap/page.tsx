import type { Metadata } from 'next'

import MembershipForm from '@/components/MembershipForm'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import { getSiteConfig } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Bli medlem',
  description:
    'Gå med i Chelsea Supporters Sweden — pubkvällar, resor, biljetter och gemenskap med Chelsea-supportrar i hela Sverige.',
}

const FORDELAR = [
  {
    title: 'Biljetter till Stamford Bridge',
    body: 'Som medlem får du tillgång till föreningens biljettsläpp och hjälp att komma in på matcherna.',
  },
  {
    title: 'Pubkvällar i hela landet',
    body: 'Vi ses och ser matcherna tillsammans — från Malmö till Luleå.',
  },
  {
    title: 'Resor till London',
    body: 'Föreningen ordnar gemensamma resor med rabatterade priser för medlemmar.',
  },
  {
    title: 'Podden och forumet',
    body: 'ChelseaPodden, The Shed och vår FPL-liga — allt som gör supporterlivet roligare mellan matcherna.',
  },
]

const PANEL = 'rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6 py-[22px]'

const PANEL_HEADING =
  'text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-[rgb(var(--color-muted))]'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function MedlemskapPage({ params }: PageProps) {
  const { locale } = await params
  const site = await getSiteConfig(locale)

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
          Bli medlem i CSS
        </h1>
        <p className="font-serif mt-3 text-[16px] leading-[1.55] text-[rgb(var(--color-ink-2))]">
          Chelsea Supporters Sweden är till för alla som håller på Chelsea. Som
          medlem blir du en del av gemenskapen — och du gör det möjligt för oss
          att fortsätta ordna träffar, resor och innehåll på svenska.
          {site.membershipFee ? ` Medlemskapet kostar ${site.membershipFee}.` : ''}
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
        {/* Formulär */}
        <div className="lg:col-span-3">
          <SectionHeading title="Ansökan" />
          <div className="rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] p-6 sm:p-8">
            <MembershipForm />
          </div>
        </div>

        {/* Förmåner och betalning */}
        <aside className="space-y-6 lg:col-span-2">
          <Reveal>
            <div className={PANEL}>
              <h2 className={`${PANEL_HEADING} border-b border-[rgb(var(--color-rule))] pb-3.5`}>
                Detta får du
              </h2>
              <ul>
                {FORDELAR.map((f) => (
                  <li
                    key={f.title}
                    className="flex gap-3 border-t border-[rgb(var(--color-rule))] py-4 first:border-t-0"
                  >
                    <span
                      className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--color-gold))]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="font-display text-[16px] font-semibold leading-[1.25] text-[rgb(var(--color-text))]">
                        {f.title}
                      </p>
                      <p className="font-serif mt-1.5 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
                        {f.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {(site.swish || site.bankgiro) && (
            <Reveal delay={80}>
              <div className="rounded-md bg-[rgb(var(--color-night))] px-6 py-[22px] text-white">
                <h2 className="border-b border-white/[0.12] pb-3.5 text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-white/60">
                  Så betalar du
                </h2>
                <p className="font-serif py-4 text-[14px] leading-[1.6] text-white/[0.78]">
                  Skicka in ansökan först — vi bekräftar via e-post och skickar
                  betalningsinformation.
                </p>
                <dl>
                  {site.swish && (
                    <div className="flex justify-between gap-6 border-t border-white/[0.12] py-[13px]">
                      <dt className="text-[12px] font-medium text-white/60">Swish</dt>
                      <dd className="text-right text-[12.5px] font-semibold">{site.swish}</dd>
                    </div>
                  )}
                  {site.bankgiro && (
                    <div className="flex justify-between gap-6 border-t border-white/[0.12] py-[13px]">
                      <dt className="text-[12px] font-medium text-white/60">Bankgiro</dt>
                      <dd className="text-right text-[12.5px] font-semibold">{site.bankgiro}</dd>
                    </div>
                  )}
                  {site.membershipFee && (
                    <div className="flex justify-between gap-6 border-t border-white/[0.12] py-[13px]">
                      <dt className="text-[12px] font-medium text-white/60">Avgift</dt>
                      <dd className="text-right text-[12.5px] font-semibold text-[rgb(var(--color-gold-light))]">
                        {site.membershipFee}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          )}

          <Reveal delay={140}>
            <p className="font-serif border-t border-[rgb(var(--color-rule))] pt-6 text-[14px] leading-[1.6] text-[rgb(var(--color-ink-2))]">
              Frågor om medlemskapet? Mejla oss på{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-[rgb(var(--color-chelsea-blue))] underline underline-offset-[3px] hover:text-[rgb(var(--color-chelsea-blue-dark))]"
              >
                {site.email}
              </a>
              .
            </p>
          </Reveal>
        </aside>
      </div>
    </div>
  )
}
