import type { Route } from 'next'

import ArticleCard from '@/components/ArticleCard'
import Reveal from '@/components/Reveal'
import SectionHeading from '@/components/SectionHeading'
import type { ArticleCard as ArticleCardData } from '@/lib/posts'

type NewsSectionProps = {
  locale: string
  articles: ArticleCardData[]
}

/**
 * Föreningens egna artiklar på startsidan.
 *
 * Detta är en serverkomponent — den tidigare klientversionen filtrerade i
 * webbläsaren, vilket krävde att all JavaScript laddades innan något visades.
 * Filtrering finns istället på /artiklar, som riktiga länkar.
 */
export default function NewsSection({ locale, articles }: NewsSectionProps) {
  if (articles.length === 0) return null

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <SectionHeading
        title="Från redaktionen"
        href={`/${locale}/artiklar` as Route}
        linkLabel="Alla artiklar"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => (
          <Reveal key={article.id} delay={Math.min(i, 5) * 60}>
            <ArticleCard locale={locale} article={article} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
