import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['sv', 'en'] as const
const DEFAULT_LOCALE = 'sv'

// Paths that should NOT be locale-prefixed
const PUBLIC_PATHS = ['/admin', '/api', '/robots.txt', '/sitemap.xml', '/_next', '/favicon.ico', '/images']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip public paths
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if pathname already has a locale
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  // Redirect root and non-locale paths to default locale
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
