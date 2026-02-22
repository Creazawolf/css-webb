import { notFound } from 'next/navigation'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Startsida({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
  }

  return (
    <section className="bg-[#034694] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <p className="inline-flex w-fit rounded-full border border-[#D4A843] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4A843]">
          Chelsea Supporters Sweden
        </p>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">Valkommen till var nya webbplats</h1>
        <p className="max-w-2xl text-base text-blue-100 sm:text-lg">
          Har kommer nyheter, matcher, evenemang och medlemsinformation samlas. Strukturen ar pa plats och
          innehall fylls pa lopande.
        </p>
      </div>
    </section>
  )
}
