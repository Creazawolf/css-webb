import Link from 'next/link'

type MembershipCTAProps = {
  locale: string
}

const fordelar = ['Pubkvällar med andra supportrar', 'Rabatterade medlemsaktiviteter', 'Prioriterad info om resor och events']

export default function MembershipCTA({ locale }: MembershipCTAProps) {
  return (
    <section className="rounded-2xl bg-[#D4A843] px-6 py-8 text-[#022B5C] sm:px-8 sm:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Bli medlem idag</h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base">
            Gå med i Chelsea Supporters Sweden och bli en del av den blå gemenskapen i hela landet.
          </p>
          <ul className="mt-4 space-y-2 text-sm font-medium sm:text-base">
            {fordelar.map((fordel) => (
              <li key={fordel}>• {fordel}</li>
            ))}
          </ul>
        </div>
        <div>
          <Link
            href={`/${locale}/medlemskap`}
            className="inline-flex rounded-md bg-[#022B5C] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#034694]"
          >
            Ansök om medlemskap
          </Link>
        </div>
      </div>
    </section>
  )
}
