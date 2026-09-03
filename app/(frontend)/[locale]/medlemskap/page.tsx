import type { Metadata } from 'next'

import MembershipForm from '@/components/MembershipForm'
import Reveal from '@/components/Reveal'
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

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function MedlemskapPage({ params }: PageProps) {
  const { locale } = await params
  const site = await getSiteConfig(locale)

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
          Bli medlem i CSS
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-slate-600">
          Chelsea Supporters Sweden är till för alla som håller på Chelsea. Som
          medlem blir du en del av gemenskapen — och du gör det möjligt för oss
          att fortsätta ordna träffar, resor och innehåll på svenska.
          {site.membershipFee ? ` Medlemskapet kostar ${site.membershipFee}.` : ''}
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Formulär */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)] sm:p-7">
            <h2 className="font-display mb-5 text-lg font-bold uppercase tracking-wide text-[#022B5C]">
              Ansökan
            </h2>
            <MembershipForm />
          </div>
        </div>

        {/* Förmåner och betalning */}
        <aside className="space-y-4 lg:col-span-2">
          <Reveal>
            <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)]">
              <h2 className="font-display mb-4 text-base font-bold uppercase tracking-wide text-[#022B5C]">
                Detta får du
              </h2>
              <ul className="space-y-4">
                {FORDELAR.map((f) => (
                  <li key={f.title} className="flex gap-3">
                    <span
                      className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A843]"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-[13px] font-bold text-slate-800">{f.title}</p>
                      <p className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
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
              <div className="rounded-xl bg-[#022B5C] p-5 text-white">
                <h2 className="font-display mb-3 text-base font-bold uppercase tracking-wide">
                  Så betalar du
                </h2>
                <p className="text-[13px] leading-relaxed text-blue-100/70">
                  Skicka in ansökan först — vi bekräftar via e-post och skickar
                  betalningsinformation.
                </p>
                <dl className="mt-4 space-y-2 text-[13px]">
                  {site.swish && (
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <dt className="text-white/50">Swish</dt>
                      <dd className="font-semibold">{site.swish}</dd>
                    </div>
                  )}
                  {site.bankgiro && (
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <dt className="text-white/50">Bankgiro</dt>
                      <dd className="font-semibold">{site.bankgiro}</dd>
                    </div>
                  )}
                  {site.membershipFee && (
                    <div className="flex justify-between">
                      <dt className="text-white/50">Avgift</dt>
                      <dd className="font-semibold text-[#D4A843]">
                        {site.membershipFee}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </Reveal>
          )}

          <Reveal delay={140}>
            <div className="rounded-xl border border-slate-200/70 bg-white p-5 text-[13px] leading-relaxed text-slate-500 shadow-[var(--shadow-card)]">
              Frågor om medlemskapet? Mejla oss på{' '}
              <a
                href={`mailto:${site.email}`}
                className="font-semibold text-[#034694] hover:underline"
              >
                {site.email}
              </a>
              .
            </div>
          </Reveal>
        </aside>
      </div>
    </div>
  )
}
