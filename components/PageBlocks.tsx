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

/** Panelrubrik — samma etikettstil som faktarutan i artikelspalten. */
const PANEL_HEADING =
  'text-[10px] font-bold uppercase leading-none tracking-[0.17em] text-[rgb(var(--color-muted))]'

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
          <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-[rgb(var(--color-paper-deep))]">
            <Image
              src={url}
              alt={alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {block.caption && (
            <figcaption className="font-serif pt-3 text-[13px] italic leading-[1.5] text-[rgb(var(--color-ink-2))]">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'factsBlock':
      return (
        <div className="rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6 py-[22px]">
          <h2 className={`${PANEL_HEADING} border-b border-[rgb(var(--color-rule))] pb-3.5`}>
            {block.heading}
          </h2>
          <dl>
            {(block.items ?? []).map((item) => (
              <div
                key={item.id ?? item.label}
                className="flex justify-between gap-6 border-t border-[rgb(var(--color-rule))] py-[13px] first:border-t-0"
              >
                <dt className="text-[12px] font-medium text-[rgb(var(--color-muted))]">
                  {item.label}
                </dt>
                <dd className="text-right text-[12.5px] font-semibold text-[rgb(var(--color-text))]">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )

    case 'ctaBlock':
      return (
        <div className="flex flex-col gap-8 rounded-lg bg-[rgb(var(--color-chelsea-blue))] px-7 py-10 text-white sm:px-12 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display max-w-[620px] text-[26px] font-bold leading-[1.08] tracking-[-0.005em] sm:text-[34px]">
              {block.heading}
            </h2>
            {block.body && (
              <p className="font-serif mt-3 max-w-[560px] text-[15.5px] leading-[1.6] text-white/[0.82]">
                {block.body}
              </p>
            )}
          </div>
          <Link
            href={ctaHref(locale, block.buttonUrl)}
            className="inline-flex min-h-[44px] flex-none items-center justify-center self-start rounded-md bg-[rgb(var(--color-gold))] px-[26px] py-4 text-[13px] font-bold uppercase leading-none tracking-[0.08em] text-[rgb(var(--color-chelsea-blue-dark))] transition-colors hover:bg-[rgb(var(--color-gold-light))] lg:self-auto"
          >
            {block.buttonLabel}
          </Link>
        </div>
      )

    case 'faqBlock':
      return (
        <div>
          {block.heading && (
            <h2 className="font-display mb-6 border-b-2 border-[rgb(var(--color-text))] pb-[22px] text-[22px] font-bold uppercase leading-none tracking-[0.06em] text-[rgb(var(--color-text))] sm:text-[26px]">
              {block.heading}
            </h2>
          )}
          <div className="rounded-md border border-[rgb(var(--color-rule))] bg-[rgb(var(--color-card))] px-6">
            {(block.items ?? []).map((item) => (
              <details
                key={item.id ?? item.question}
                className="group border-t border-[rgb(var(--color-rule))] first:border-t-0"
              >
                <summary className="font-display flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-5 py-[15px] text-[16px] font-semibold leading-[1.25] text-[rgb(var(--color-text))] transition-colors marker:hidden hover:text-[rgb(var(--color-chelsea-blue))]">
                  {item.question}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0 text-[rgb(var(--color-chelsea-blue))] transition-transform duration-200 group-open:rotate-45"
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
                <p className="font-serif whitespace-pre-line pb-5 text-[16px] leading-[1.7] text-[rgb(var(--color-ink-2))]">
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
    <div className="space-y-10">
      {blocks.map((block, i) => (
        <Reveal key={block.id ?? `${block.blockType}-${i}`} delay={Math.min(i, 4) * 60}>
          <BlockContent locale={locale} block={block} />
        </Reveal>
      ))}
    </div>
  )
}
