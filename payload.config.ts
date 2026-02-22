import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'

import { allCollections } from './payload/collections'
import { allGlobals } from './payload/globals'
import { Users } from './payload/collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
      connectionString: process.env.DATABASE_URL,
    },
  }),
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
  cors: [process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'],
  csrf: [process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
