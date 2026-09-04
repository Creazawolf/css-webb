import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import NextMatchBar from '@/components/NextMatchBar'
import { getNextFixture } from '@/lib/chelsea-matches'
import { getSiteUrl } from '@/lib/env'
import { getNavigation, getSiteConfig } from '@/lib/site'

import '../../globals.css'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type Locale = (typeof SUPPORTED_LOCALES)[number]

type FrontendLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const isLocale = (locale: string): locale is Locale =>
  SUPPORTED_LOCALES.includes(locale as Locale)

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const site = await getSiteConfig(locale)
  const base = getSiteUrl()

  return {
    metadataBase: new URL(base),
    title: {
      default: site.siteName,
      template: `%s | ${site.siteName}`,
    },
    description: site.description,
    openGraph: {
      siteName: site.siteName,
      locale: locale === 'sv' ? 'sv_SE' : 'en_GB',
      type: 'website',
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        sv: '/sv',
        en: '/en',
      },
    },
  }
}

/**
 * Nästa match hämtas i en egen komponent så att den kan strömmas in.
 * Skulle API-Football vara långsamt eller nere ritas resten av sidan ändå.
 */
async function MatchBar({ locale }: { locale: string }) {
  const match = await getNextFixture()
  return <NextMatchBar locale={locale} match={match} />
}

export default async function FrontendLayout({ children, params }: FrontendLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  const [site, nav] = await Promise.all([getSiteConfig(locale), getNavigation(locale)])

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8fa] text-slate-900">
      {/*
        Talar om för CSS:en att JavaScript kör, innan sidan målas första
        gången. Utan den här flaggan visas allt reveal-innehåll direkt
        istället för att bli osynligt i väntan på en animation som aldrig
        kommer.
      */}
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.setAttribute('data-js','on')",
        }}
      />

      <a
        href="#innehall"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[#034694] focus:px-4 focus:py-2 focus:text-white"
      >
        Hoppa till innehållet
      </a>

      <NavBar
        locale={locale}
        items={nav.items}
        siteName={site.siteName}
        logoUrl={site.logoUrl}
        announcement={site.announcement}
      />

      <Suspense fallback={null}>
        <MatchBar locale={locale} />
      </Suspense>

      <main id="innehall" className="flex-1">
        {children}
      </main>

      <Footer locale={locale} site={site} columns={nav.footerColumns} />
    </div>
  )
}
