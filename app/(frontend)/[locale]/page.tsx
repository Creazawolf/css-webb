import { notFound } from 'next/navigation'

import Hero from '@/components/Hero'
import MatchCard from '@/components/MatchCard'
import MembershipCTA from '@/components/MembershipCTA'
import NewsCard from '@/components/NewsCard'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type PageProps = {
  params: Promise<{ locale: string }>
}

const newsItems: Array<{ titel: string; ingress: string; datum: string }> = [
  {
    titel: 'Supporterträff i Borås inför stormatchen',
    ingress: 'Vi laddar upp tillsammans med blå stämning, quiz och matchsnack innan avspark.',
    datum: '22 februari 2026',
  },
  {
    titel: 'Nya medlemsförmåner för säsongen 2026',
    ingress: 'Medlemmar får tillgång till fler event, bättre erbjudanden och exklusiva supporterkvällar.',
    datum: '20 februari 2026',
  },
  {
    titel: 'Resegrupp till London öppnar anmälan',
    ingress: 'Anmäl ditt intresse för vår nästa resa till Stamford Bridge och upplev matchen på plats.',
    datum: '18 februari 2026',
  },
]

export default async function Startsida({ params }: PageProps) {
  const { locale } = await params

  if (!SUPPORTED_LOCALES.includes(locale as (typeof SUPPORTED_LOCALES)[number])) {
    notFound()
  }

  return (
    <>
      <Hero locale={locale} />

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-[#022B5C]">Nästa match</h2>
          <MatchCard motstandare="Arsenal" datum="Söndag 1 mars 2026" tid="17:30" tavling="Premier League" />
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-[#022B5C]">Senaste nyheter</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsItems.map((article) => (
              <NewsCard key={article.titel} titel={article.titel} ingress={article.ingress} datum={article.datum} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-[1200px]">
          <MembershipCTA locale={locale} />
        </div>
      </section>
    </>
  )
}
