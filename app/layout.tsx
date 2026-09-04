import { Inter, Newsreader, Oswald } from 'next/font/google'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

/**
 * Brödtextserif. Oswald bär rubrikerna och Inter gränssnittet, men ingen av
 * dem är gjord för att läsa en krönika i — därför en tredje.
 */
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Chelsea Supporters Sweden',
    template: '%s | Chelsea Supporters Sweden',
  },
  description: 'Officiell webbplats för Chelsea Supporters Sweden.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sv">
      <body
        className={`${inter.variable} ${oswald.variable} ${newsreader.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
