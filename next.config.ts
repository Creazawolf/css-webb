import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
    ],
  },
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
  },
  experimental: {
    typedRoutes: true,
  },
}

export default withPayload(nextConfig)
