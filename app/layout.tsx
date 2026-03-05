import { Inter, Oswald } from 'next/font/google'
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
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>{children}</body>
    </html>
  )
}
