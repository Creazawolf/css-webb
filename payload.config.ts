import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'

import { allCollections } from './payload/collections'
import { allGlobals } from './payload/globals'
import { Users } from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.DATABASE_URL_DIRECT
const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
const allowedOrigins = Array.from(
  new Set(
    [
      'http://localhost:3000',
      siteURL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    ].filter((origin): origin is string => Boolean(origin)),
  ),
)

if (!databaseURL) {
  throw new Error(
    'Missing Postgres connection string. Set DATABASE_URL (or POSTGRES_URL) in .env.local.'
  )
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? 'unsafe-dev-secret-change-me',
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),
  plugins: [
    vercelBlobStorage({
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN ?? '',
    }),
  ],
  collections: allCollections,
  globals: allGlobals,
  localization: {
    locales: [
      { label: 'Svenska', code: 'sv' },
      { label: 'English', code: 'en' },
    ],
    defaultLocale: 'sv',
    fallback: true,
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
