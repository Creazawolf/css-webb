import config from '@/payload.config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'

type Params = Promise<{ segments?: string[] }>
type SearchParams = Promise<Record<string, string | string[] | undefined>>

export const generateMetadata = async ({ params }: { params: Params }): Promise<Metadata> =>
  generatePageMetadata({ config, params })

const Page = async ({ params, searchParams }: { params: Params; searchParams: SearchParams }) =>
  RootPage({ config, params, searchParams })

export default Page
