import Link from 'next/link'

type FooterProps = {
  locale: string
}

const quickLinks: Array<{ href: string; label: string }> = [
  { href: '/nyheter', label: 'Nyheter' },
  { href: '/matcher', label: 'Matcher' },
  { href: '/evenemang', label: 'Evenemang' },
  { href: '/medlemskap', label: 'Medlemskap' },
]

export default function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-[#022B5C] text-white">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A843]">Om oss</h3>
          <p className="text-sm text-white/80">
            Chelsea Supporters Sweden är en svensk supporterförening för alla som älskar Chelsea FC.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A843]">Snabblänkar</h3>
          <ul className="space-y-2 text-sm text-white/80">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={`/${locale}${link.href}`} className="transition-colors hover:text-[#D4A843]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#D4A843]">Kontakt</h3>
          <p className="text-sm text-white/80">info@chelseasweden.se</p>
          <p className="text-sm text-white/80">Borås, Sverige</p>
          <div className="mt-4 flex items-center gap-3">
            <a href="#" aria-label="Instagram" className="text-white/80 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" aria-label="Facebook" className="text-white/80 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M13.2 21v-8.1h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.3H7.5v3.1h2.6V21h3.1Z" />
              </svg>
            </a>
            <a href="#" aria-label="X" className="text-white/80 transition-colors hover:text-[#D4A843]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M18.9 3h2.9l-6.3 7.2L23 21h-5.9l-4.6-6-5.2 6H4.4l6.8-7.7L1 3h6l4.2 5.5L18.9 3Zm-1 16.2h1.6L6.2 4.7H4.5l13.4 14.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/60 sm:px-6 lg:px-8">
        © {new Date().getFullYear()} Chelsea Supporters Sweden. Alla rättigheter förbehållna.
      </div>
    </footer>
  )
}
