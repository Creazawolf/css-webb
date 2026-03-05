import Link from 'next/link'
import { getHerrarSchedule, getDamerSchedule } from '@/lib/api-football'
import Schedule from '@/components/Schedule'

export const metadata = {
  title: 'Spelschema | Chelsea Supporters Sweden',
  description: 'Fullständigt spelschema för Chelsea herrar och damer.',
}

export default async function SpelschemaPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [herrar, damer] = await Promise.all([
    getHerrarSchedule().catch(() => null),
    getDamerSchedule().catch(() => null),
  ])

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href={`/${locale}/matcher` as `/${string}`}
          className="text-[12px] font-semibold text-[#034694] hover:underline"
        >
          &larr; Matcher
        </Link>
      </div>
      <h1 className="font-display mb-6 text-2xl font-bold tracking-tight text-slate-900">
        Spelschema
      </h1>
      <Schedule locale={locale} herrar={herrar} damer={damer} />
    </section>
  )
}
