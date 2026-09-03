import type { CollectionConfig } from 'payload'

import { Categories } from './Categories'
import { Events } from './Events'
import { Matches } from './Matches'
import { Media } from './Media'
import { Members } from './Members'
import { Pages } from './Pages'
import { Posts } from './Posts'
import { Users } from './Users'
import { Venues } from './Venues'

export { Categories } from './Categories'
export { Events } from './Events'
export { Matches } from './Matches'
export { Media } from './Media'
export { Members } from './Members'
export { Pages } from './Pages'
export { Posts } from './Posts'
export { Users } from './Users'
export { Venues } from './Venues'

export const allCollections: CollectionConfig[] = [
  Users,
  Media,
  Categories,
  Posts,
  Matches,
  Events,
  Venues,
  Members,
  Pages,
]
