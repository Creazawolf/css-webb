'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

type NavBarProps = {
  locale: string
}

const navItems: Array<{ href: string; label: string }> = [
  { href: '/nyheter', label: 'NYHETER' },
  { href: '/matcher', label: 'MATCHER' },
  { href: '/evenemang', label: 'EVENEMANG' },
  { href: '/medlemskap', label: 'MEDLEMSKAP' },
  { href: '/om-oss', label: 'OM OSS' },
  { href: '/kontakt', label: 'KONTAKT' },
]

export default function NavBar({ locale }: NavBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {/* Top accent line */}
      <div className="h-[3px] bg-gradient-to-r from-[#022B5C] via-[#034694] to-[#D4A843]" />

      <div className="mx-auto flex h-[70px] w-full max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + name */}
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image
            src="/images/logo-white.png"
            alt="CSS Logo"
            width={44}
            height={44}
            className="h-10 w-10 rounded-full bg-[#034694] p-0.5"
          />
          <div className="hidden sm:block">
            <span className="font-display block text-lg font-bold uppercase leading-tight tracking-wide text-[#022B5C]">
              Chelsea Supporters
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A843]">
              Sweden
            </span>
          </div>
          <span className="font-display text-lg font-bold uppercase tracking-wide text-[#022B5C] sm:hidden">
            CSS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Huvudnavigation" className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="rounded-sm px-3 py-2 text-[13px] font-semibold tracking-[0.04em] text-[#1e293b] transition-colors duration-150 hover:bg-[#034694]/5 hover:text-[#034694]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side: search + mobile button */}
        <div className="flex items-center gap-2">
          {/* Search icon */}
          <button
            type="button"
            aria-label="Sök"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-slate-100 hover:text-[#034694] sm:flex"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" />
            </svg>
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
            aria-expanded={isOpen}
            aria-controls="mobilmeny"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#1e293b] lg:hidden"
          >
            <span className="relative h-5 w-6">
              <span
                className={`absolute left-0 top-0 h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? 'translate-y-[9px] rotate-45' : ''}`}
              />
              <span
                className={`absolute left-0 top-[9px] h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
              />
              <span
                className={`absolute left-0 top-[18px] h-[2px] w-6 rounded-full bg-current transition-all duration-300 ${isOpen ? '-translate-y-[9px] -rotate-45' : ''}`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobilmeny"
        className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm transition-all duration-300 lg:hidden ${
          isOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`ml-auto h-full w-4/5 max-w-xs bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <span className="font-display text-sm font-bold uppercase tracking-wide text-[#022B5C]">Meny</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <nav className="flex flex-col p-4" aria-label="Mobilnavigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsOpen(false)}
                className="border-b border-slate-50 px-2 py-3.5 text-[13px] font-semibold tracking-[0.04em] text-[#1e293b] transition-colors duration-150 hover:text-[#034694]"
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
