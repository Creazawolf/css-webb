import type { GlobalConfig } from 'payload'

import { Navigation } from './Navigation'
import { SiteSettings } from './SiteSettings'

export { Navigation } from './Navigation'
export { SiteSettings } from './SiteSettings'

export const allGlobals: GlobalConfig[] = [SiteSettings, Navigation]
