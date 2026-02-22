import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'

import '../../globals.css'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type Locale = (typeof SUPPORTED_LOCALES)[number]

type FrontendLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const isLocale = (locale: string): locale is Locale =>
  SUPPORTED_LOCALES.includes(locale as Locale)

export default async function FrontendLayout({ children, params }: FrontendLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <NavBar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </div>
  )
}
