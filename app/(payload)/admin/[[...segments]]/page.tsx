/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '@/payload.config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'
import type { Metadata } from 'next'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams } as any)

const Page = async ({ params, searchParams }: Args) =>
  RootPage({ config, importMap, params, searchParams } as any)

export default Page
