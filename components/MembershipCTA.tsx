import Link from 'next/link'

type MembershipCTAProps = {
  locale: string
}

const fordelar = ['Pubkvällar med andra supportrar', 'Rabatterade resor till London', 'Prioriterad info om events']

export default function MembershipCTA({ locale }: MembershipCTAProps) {
  return (
    <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#022B5C] via-[#034694] to-[#0A5BB5] px-6 py-8 sm:px-10 sm:py-10">
      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#D4A843]/10" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-[#D4A843]/5" />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            Bli medlem idag
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-blue-200/80">
            Gå med i Chelsea Supporters Sweden och bli en del av den blå gemenskapen i hela landet.
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[13px] font-medium text-white/80 sm:flex-row sm:gap-5">
            {fordelar.map((fordel) => (
              <li key={fordel} className="flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#D4A843]" />
                {fordel}
              </li>
            ))}
          </ul>
        </div>
        <div className="shrink-0">
          <Link
            href={`/${locale}/medlemskap`}
            className="inline-flex items-center rounded-md bg-[#D4A843] px-6 py-3 text-[13px] font-bold uppercase tracking-[0.06em] text-[#022B5C] shadow-lg shadow-[#D4A843]/20 transition-all hover:bg-[#E8C96A] hover:shadow-[#D4A843]/30"
          >
            Ansök om medlemskap
          </Link>
        </div>
      </div>
    </div>
  )
}
