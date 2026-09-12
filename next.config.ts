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
        // Varje Blob-butik får en egen underdomän, så mönstret måste ha
        // jokertecken — annars blockeras bilderna av optimeraren.
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'imgk.svenskafans.com',
      },
      {
        protocol: 'https',
        hostname: 'clublogos.stadion.io',
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
    // Originalen är som störst 1000px breda (SvenskaFans og:image) och
    // kortbilden 800px. Standardlistan går upp till 3840, vilket bara ger
    // fler cacheposter av exakt samma bild — optimeraren skalar aldrig upp.
    // Färre bredder betyder att varje post träffas oftare, och kalla
    // förfrågningar är det som märks på en sajt med den här trafiken.
    deviceSizes: [640, 828, 1200],
    imageSizes: [256, 384],
  },
  // i18n handled via [locale] route segments + proxy (App Router)
  typedRoutes: true,

  async redirects() {
    // /nyheter hette så på den gamla sajten. Behåll länkarna vid liv.
    return [
      {
        source: '/:locale(sv|en)/nyheter',
        destination: '/:locale/artiklar',
        permanent: true,
      },
      {
        source: '/:locale(sv|en)/nyheter/:slug',
        destination: '/:locale/artiklar/:slug',
        permanent: true,
      },
    ]
  },
}

export default withPayload(nextConfig)
