import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import '../../globals.css'

const SUPPORTED_LOCALES = ['sv', 'en'] as const

type Locale = (typeof SUPPORTED_LOCALES)[number]

type FrontendLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const navItems: Array<{ href: string; label: string }> = [
  { href: '/nyheter', label: 'Nyheter' },
  { href: '/matcher', label: 'Matcher' },
  { href: '/evenemang', label: 'Evenemang' },
  { href: '/medlemskap', label: 'Medlemskap' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/kontakt', label: 'Kontakt' },
]

const isLocale = (locale: string): locale is Locale =>
  SUPPORTED_LOCALES.includes(locale as Locale)

export default async function FrontendLayout({ children, params }: FrontendLayoutProps) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-[#034694] text-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={`/${locale}`} className="text-lg font-bold tracking-tight">
            Chelsea Supporters Sweden
          </Link>
          <nav aria-label="Huvudnavigation" className="hidden gap-6 text-sm sm:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={`/${locale}${item.href}`} className="transition hover:text-[#D4A843]">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-slate-200 bg-[#022B5C] text-sm text-slate-100">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 sm:px-6 lg:px-8">
          <p className="font-medium">Chelsea Supporters Sweden</p>
          <p className="text-slate-300">Svenska officiella supporterforeningen for Chelsea FC.</p>
        </div>
      </footer>
    </div>
  )
}
