'use client'

import Link from 'next/link'
import { useState } from 'react'

type NavBarProps = {
  locale: string
}

const navItems: Array<{ href: string; label: string }> = [
  { href: '/nyheter', label: 'Nyheter' },
  { href: '/matcher', label: 'Matcher' },
  { href: '/evenemang', label: 'Evenemang' },
  { href: '/medlemskap', label: 'Medlemskap' },
  { href: '/om-oss', label: 'Om oss' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function NavBar({ locale }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-[30] border-b border-white/10 bg-[#034694] text-white shadow-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="text-base font-bold tracking-tight sm:text-lg">
          Chelsea Supporters Sweden
        </Link>

        <nav aria-label="Huvudnavigation" className="hidden items-center gap-6 text-sm sm:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="transition-colors duration-150 hover:text-[#D4A843]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
          aria-expanded={isOpen}
          aria-controls="mobilmeny"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/30 sm:hidden"
        >
          <span className="sr-only">Meny</span>
          <span className="relative h-5 w-6">
            <span
              className={`absolute left-0 top-0 h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'translate-y-[9px] rotate-45' : ''}`}
            />
            <span
              className={`absolute left-0 top-[9px] h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <span
              className={`absolute left-0 top-[18px] h-0.5 w-6 bg-white transition-all duration-300 ${isOpen ? '-translate-y-[9px] -rotate-45' : ''}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobilmeny"
        className={`fixed inset-0 z-[100] bg-[#022B5C]/95 backdrop-blur-sm transition-all duration-300 sm:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className={`ml-auto h-full w-4/5 max-w-xs bg-[#022B5C] p-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="mb-6 flex items-center justify-between">
            <p className="font-semibold">Meny</p>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-white/30 px-3 py-1 text-sm"
            >
              Stäng
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-base" aria-label="Mobilnavigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-2 transition-colors duration-150 hover:text-[#D4A843]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
