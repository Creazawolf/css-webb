import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { buildConfig } from 'payload'
import { en } from '@payloadcms/translations/languages/en'
import { sv } from '@payloadcms/translations/languages/sv'
import sharp from 'sharp'

import { allCollections } from './payload/collections'
import { allGlobals } from './payload/globals'
import { Users } from './payload/collections/Users'
import { envString, getAllowedOrigins } from './lib/env'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const databaseURL =
  envString('DATABASE_URL') ??
  envString('POSTGRES_URL') ??
  envString('POSTGRES_PRISMA_URL') ??
  envString('POSTGRES_URL_NON_POOLING') ??
  envString('DATABASE_URL_DIRECT')
const allowedOrigins = getAllowedOrigins()

if (!databaseURL) {
  throw new Error(
    'Missing Postgres connection string. Set DATABASE_URL (or POSTGRES_URL) in .env.local.'
  )
}

export default buildConfig({
  // Utan sharp genereras inga bildstorlekar alls — Media-samlingen definierar
  // thumbnail/card/og och frontend läser dem, så den måste skickas in här.
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — CSS Admin',
    },
    // Redaktörerna är svensktalande; admin-gränssnittet ska vara det också.
    dateFormat: 'yyyy-MM-dd HH:mm',
  },
  i18n: {
    supportedLanguages: { sv, en },
    fallbackLanguage: 'sv',
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
