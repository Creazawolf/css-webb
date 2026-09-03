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
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide text-[#022B5C] sm:text-4xl">
        {page.title}
      </h1>

      {page.intro && (
        <p className="mt-4 text-lg font-medium leading-relaxed text-slate-600">
          {page.intro}
        </p>
      )}

      {heroUrl && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
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

      <div className="mt-9">
        <PageBlocks locale={locale} blocks={page.content} />
      </div>
    </div>
  )
}
