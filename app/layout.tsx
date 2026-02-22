import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Chelsea Supporters Sweden',
    template: '%s | Chelsea Supporters Sweden',
  },
  description: 'Officiell webbplats for Chelsea Supporters Sweden.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
