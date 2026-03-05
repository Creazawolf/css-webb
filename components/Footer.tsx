import Image from 'next/image'
import Link from 'next/link'

type FooterProps = {
  locale: string
}

const linkColumns = [
  {
    title: 'Nyheter',
    links: [
      { href: '/nyheter', label: 'Alla nyheter' },
      { href: '/matcher', label: 'Matchreferat' },
    ],
  },
  {
    title: 'Matcher',
    links: [
      { href: '/matcher', label: 'Spelschema' },
      { href: '/matcher', label: 'Resultat' },
      { href: '/matcher', label: 'Tabell' },
    ],
  },
  {
    title: 'Föreningen',
    links: [
      { href: '/medlemskap', label: 'Bli medlem' },
      { href: '/evenemang', label: 'Evenemang' },
      { href: '/om-oss', label: 'Om oss' },
      { href: '/kontakt', label: 'Kontakt' },
    ],
  },
]

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-[#011428]">
      {/* Social bar */}
      <div className="border-b border-white/5">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/30">
            Följ oss
          </span>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-white/40 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-white/40 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M13.2 21v-8.1h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.3H7.5v3.1h2.6V21h3.1Z" />
              </svg>
            </a>
            <a href="#" aria-label="X" className="text-white/40 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M18.9 3h2.9l-6.3 7.2L23 21h-5.9l-4.6-6-5.2 6H4.4l6.8-7.7L1 3h6l4.2 5.5L18.9 3Zm-1 16.2h1.6L6.2 4.7H4.5l13.4 14.5Z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="text-white/40 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M23 12s0-3.85-.46-5.57a2.87 2.87 0 0 0-2-2C18.88 4 12 4 12 4s-6.88 0-8.54.43a2.87 2.87 0 0 0-2 2C1 8.15 1 12 1 12s0 3.85.46 5.57a2.87 2.87 0 0 0 2 2C5.12 20 12 20 12 20s6.88 0 8.54-.43a2.87 2.87 0 0 0 2-2C23 15.85 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* Brand column */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/images/logo-white.png" alt="CSS Logo" width={40} height={40} className="h-9 w-9 rounded-full bg-white/10 p-0.5" />
            <div>
              <span className="font-display block text-sm font-bold uppercase tracking-wide text-white">
                Chelsea Supporters
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D4A843]">
                Sweden
              </span>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-white/40">
            Svensk supporterförening för alla som älskar Chelsea FC. Matchkvällar, resor och gemenskap sedan 2003.
          </p>
        </div>

        {/* Link columns */}
        {linkColumns.map((col) => (
          <div key={col.title}>
            <h3 className="font-display mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-white/50">
              {col.title}
            </h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="text-[13px] text-white/40 transition-colors hover:text-[#D4A843]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] text-white/25">
            &copy; {new Date().getFullYear()} Chelsea Supporters Sweden. Alla rättigheter förbehållna.
          </p>
          <p className="text-[11px] text-white/25">
            info@chelseasweden.se
          </p>
        </div>
      </div>
    </footer>
  )
}
