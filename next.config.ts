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
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'imgk.svenskafans.com',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
      },
      {
        // Chelseas officiella nyhetsbilder
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'img.chelseafc.com',
      },
    ],
    // Bilderna från externa CDN:er ändras sällan — låt Next cacha dem länge.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  // i18n handled via [locale] route segments + middleware (App Router)
  typedRoutes: true,
}

export default withPayload(nextConfig)
