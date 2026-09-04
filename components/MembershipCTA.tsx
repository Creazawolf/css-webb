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

/**
 * Sidans enda starka uppmaning. Guldknappen förekommer därför ingen
 * annanstans på löpsedeln — blir guldet en vanlig etikett slutar det betyda
 * "gör det här".
 */
export default function MembershipCTA({ locale, membershipFee }: MembershipCTAProps) {
  return (
    <div className="flex flex-col gap-8 rounded-lg bg-[rgb(var(--color-chelsea-blue))] px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-14 lg:py-12">
      <div>
        <p className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-light))]">
          Medlemskap
        </p>
        <h2 className="font-display mt-3 max-w-[620px] text-[28px] font-bold leading-[1.08] tracking-[-0.005em] sm:text-[34px]">
          Bli medlem i CSS
        </h2>
        <p className="font-serif mt-3 max-w-[560px] text-[15.5px] leading-[1.6] text-white/[0.82]">
          Gå med i Chelsea Supporters Sweden och bli en del av den blå
          gemenskapen — från Malmö till Luleå.
          {membershipFee ? ` Medlemskapet kostar ${membershipFee}.` : ''}
        </p>
        <ul className="mt-6 flex flex-col gap-2.5 text-[12.5px] font-medium text-white/70 sm:flex-row sm:flex-wrap sm:gap-x-6">
          {FORDELAR.map((fordel) => (
            <li key={fordel} className="flex items-center gap-2">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[rgb(var(--color-gold))]"
                aria-hidden="true"
              />
              {fordel}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/${locale}/medlemskap` as Route}
        className="inline-flex min-h-[44px] shrink-0 items-center justify-center self-start rounded-md bg-[rgb(var(--color-gold))] px-[26px] py-4 text-[13px] font-bold uppercase leading-none tracking-[0.08em] text-[rgb(var(--color-chelsea-blue-dark))] transition-colors duration-[250ms] ease-[var(--ease-out-soft)] hover:bg-[rgb(var(--color-gold-light))] lg:self-auto"
      >
        Ansök om medlemskap
      </Link>
    </div>
  )
}
