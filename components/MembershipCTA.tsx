import Link from 'next/link'
import type { Route } from 'next'

type MembershipCTAProps = {
  locale: string
  membershipFee?: string
}

const FORDELAR = [
  'Pubkvällar och möten i hela landet',
  'Rabatterade resor till London',
  'Medlemspris på biljetter till Stamford Bridge',
]

export default function MembershipCTA({ locale, membershipFee }: MembershipCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#022B5C] via-[#034694] to-[#0A5BB5] px-6 py-9 sm:px-10 sm:py-11">
      <div
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4A843]/10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#D4A843]/5"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Bli medlem i CSS
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-blue-100/80">
            Gå med i Chelsea Supporters Sweden och bli en del av den blå
            gemenskapen — från Malmö till Luleå.
            {membershipFee ? ` Medlemskapet kostar ${membershipFee}.` : ''}
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[13px] font-medium text-white/80 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {FORDELAR.map((fordel) => (
              <li key={fordel} className="flex items-center gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#D4A843]"
                  aria-hidden="true"
                />
                {fordel}
              </li>
            ))}
          </ul>
        </div>

        <div className="shrink-0">
          <Link
            href={`/${locale}/medlemskap` as Route}
            className="inline-flex items-center rounded-md bg-[#D4A843] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#022B5C] shadow-lg shadow-[#D4A843]/20 transition-all duration-200 hover:bg-[#E8C96A] hover:shadow-[#D4A843]/30"
          >
            Ansök om medlemskap
          </Link>
        </div>
      </div>
    </div>
  )
}
