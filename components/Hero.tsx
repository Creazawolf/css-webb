import Link from 'next/link'

type HeroProps = {
  locale: string
}

export default function Hero({ locale }: HeroProps) {
  return (
    <section className="min-h-[60vh] w-full bg-gradient-to-r from-[#022B5C] via-[#034694] to-[#0A5BB5] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col justify-center gap-6">
        <p className="inline-flex w-fit rounded-full border border-[#D4A843]/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#E8C96A]">
          Chelsea Blue i Sverige
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          Chelsea Supporters Sweden
        </h1>
        <p className="max-w-2xl text-base text-blue-100 sm:text-lg">
          Vi samlar svenska Chelsea-supportrar för matchkvällar, resor och gemenskap. Följ senaste nytt,
          hitta nästa träff och var med i vår växande förening.
        </p>
        <div>
          <Link
            href={`/${locale}/medlemskap`}
            className="inline-flex items-center rounded-md bg-[#D4A843] px-6 py-3 text-sm font-bold text-[#022B5C] shadow-[0_4px_14px_rgba(212,168,67,0.25)] transition hover:bg-[#E8C96A]"
          >
            Bli medlem
          </Link>
        </div>
      </div>
    </section>
  )
}
