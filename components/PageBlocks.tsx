import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Route } from 'next'

import Reveal from '@/components/Reveal'
import { isMedia, mediaUrl } from '@/lib/posts'
import type { Page } from '@/payload-types'

type Blocks = NonNullable<Page['content']>
type Block = Blocks[number]

type PageBlocksProps = {
  locale: string
  blocks: Blocks | null | undefined
}

function ctaHref(locale: string, url: string): Route {
  if (/^https?:\/\//.test(url) || url.startsWith('mailto:')) return url as Route
  return `/${locale}${url.startsWith('/') ? '' : '/'}${url}` as Route
}

function BlockContent({ locale, block }: { locale: string; block: Block }) {
  switch (block.blockType) {
    case 'richTextBlock':
      return (
        <div className="article-content">
          <RichText data={block.body} />
        </div>
      )

    case 'imageBlock': {
      const url = mediaUrl(block.image, 'og')
      if (!url) return null
      const alt = isMedia(block.image) ? (block.image.alt ?? '') : ''

      return (
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={url}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-center text-[12px] text-slate-500">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'factsBlock':
      return (
        <div className="rounded-xl border border-slate-200/70 bg-white p-5 shadow-[var(--shadow-card)] sm:p-6">
          <h2 className="font-display mb-4 text-base font-bold uppercase tracking-wide text-[#022B5C]">
            {block.heading}
          </h2>
          <dl className="divide-y divide-slate-100">
            {(block.items ?? []).map((item) => (
              <div key={item.id ?? item.label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-[13px] text-slate-500">{item.label}</dt>
                <dd className="text-right text-[13px] font-semibold text-slate-800">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'ctaBlock':
      return (
        <div className="overflow-hidden rounded-xl bg-gradient-to-r from-[#022B5C] to-[#034694] px-6 py-8 sm:px-8">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide text-white">
            {block.heading}
          </h2>
          {block.body && (
            <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-blue-100/80">
              {block.body}
            </p>
          )}
          <Link
            href={ctaHref(locale, block.buttonUrl)}
            className="mt-5 inline-block rounded-md bg-[#D4A843] px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.06em] text-[#022B5C] transition-colors hover:bg-[#E8C96A]"
          >
            {block.buttonLabel}
          </Link>
        </div>
      )

    case 'faqBlock':
      return (
        <div>
          {block.heading && (
            <h2 className="font-display mb-4 text-xl font-bold uppercase tracking-wide text-[#022B5C]">
              {block.heading}
            </h2>
          )}
          <div className="space-y-2.5">
            {(block.items ?? []).map((item) => (
              <details
                key={item.id ?? item.question}
                className="group rounded-lg border border-slate-200/70 bg-white px-4 py-3 shadow-[var(--shadow-card)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-slate-800 marker:hidden">
                  {item.question}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[#034694] transition-transform duration-200 group-open:rotate-45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </summary>
                <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-slate-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )

    default:
      return null
  }
}

/**
 * Renderar innehållsblocken som en redaktör satt ihop i CMS:et.
 * Okända blocktyper hoppas tyst över, så en gammal sida aldrig kraschar.
 */
export default function PageBlocks({ locale, blocks }: PageBlocksProps) {
  if (!blocks || blocks.length === 0) return null

  return (
    <div className="space-y-8">
      {blocks.map((block, i) => (
        <Reveal key={block.id ?? `${block.blockType}-${i}`} delay={Math.min(i, 4) * 60}>
          <BlockContent locale={locale} block={block} />
        </Reveal>
      ))}
    </div>
  )
}
