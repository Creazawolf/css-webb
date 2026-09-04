import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import PageBlocks from '@/components/PageBlocks'
import { getAllPageSlugs, getPageBySlug, RESERVED_SLUGS } from '@/lib/pages'
import { mediaUrl } from '@/lib/posts'

export const revalidate = 3600

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (RESERVED_SLUGS.has(slug)) return {}

  const page = await getPageBySlug(slug, locale)
  if (!page) return {}

  const title = page.seo?.metaTitle || page.title
  const description = page.seo?.metaDescription || page.intro || undefined
  const image = mediaUrl(page.seo?.ogImage, 'og') ?? mediaUrl(page.heroImage, 'og')

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical: `/${locale}/${slug}` },
    openGraph: {
      title,
      ...(description ? { description } : {}),
      ...(image ? { images: [{ url: image }] } : {}),
    },
  }
}

/**
 * Generell sida ur CMS:et — Om oss, Kontakt, Biljetter, Arenaguide,
 * Reseguide, FPL-ligan och allt annat redaktörerna lägger upp.
 */
export default async function CmsPage({ params }: Props) {
  const { locale, slug } = await params

  // Sidor med egen route ska aldrig fångas här.
  if (RESERVED_SLUGS.has(slug)) notFound()

  const page = await getPageBySlug(slug, locale)
  if (!page) notFound()

  const heroUrl = mediaUrl(page.heroImage, 'og')

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
      <header>
        <div className="flex items-center gap-3">
          <span
            className="block h-[3px] w-[30px] rounded-[2px] bg-[rgb(var(--color-gold))]"
            aria-hidden="true"
          />
          <span className="text-[11px] font-bold uppercase leading-none tracking-[0.16em] text-[rgb(var(--color-gold-ink))]">
            Chelsea Supporters Sweden
          </span>
        </div>
        <h1 className="font-display mt-3.5 text-[34px] font-bold leading-[0.98] tracking-[-0.012em] text-[rgb(var(--color-text))] sm:text-[50px]">
          {page.title}
        </h1>

        {page.intro && (
          <p className="font-serif mt-5 text-[19px] leading-[1.5] text-pretty text-[rgb(var(--color-ink-2))] sm:text-[22px]">
            {page.intro}
          </p>
        )}
      </header>

      {heroUrl && (
        <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-md bg-[rgb(var(--color-chelsea-blue-dark))]">
          <Image
            src={heroUrl}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      <div className="mt-12 border-t border-[rgb(var(--color-rule))] pt-12">
        <PageBlocks locale={locale} blocks={page.content} />
      </div>
    </div>
  )
}
