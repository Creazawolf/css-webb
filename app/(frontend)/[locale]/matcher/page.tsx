import Link from 'next/link'

export const metadata = {
  title: 'Matcher | Chelsea Supporters Sweden',
  description: 'Matchcenter med spelschema och tabellställning.',
}

export default async function MatcherPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const links = [
    {
      href: `/${locale}/matcher/spelschema`,
      title: 'Spelschema',
      description: 'Alla säsongens matcher med resultat och kommande möten.',
    },
    {
      href: `/${locale}/matcher/tabell`,
      title: 'Tabell',
      description: 'Fullständig tabellställning för Premier League och WSL.',
    },
  ]

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display mb-8 text-3xl font-bold tracking-tight text-slate-900">
        Matcher
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href as `/${string}`}
            className="group rounded-lg border border-slate-200 bg-white p-6 transition-colors hover:border-[#034694]"
          >
            <h2 className="font-display mb-2 text-lg font-bold text-slate-900 group-hover:text-[#034694]">
              {link.title}
            </h2>
            <p className="text-sm text-slate-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
