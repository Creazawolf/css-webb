/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
// @ts-expect-error — generated at build time by `payload generate:importmap`
import { importMap } from '../importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams } as any)

const Page = ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams } as any)

export default Page
