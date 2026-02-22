import type {
  Access,
  CollectionBeforeChangeHook,
  CollectionConfig,
  Field,
  GlobalConfig,
} from 'payload'

export type UserRole = 'admin' | 'editor' | 'member'

type ReqUser = {
  role?: UserRole
} | null

const hasRole = (user: ReqUser, roles: UserRole[]): boolean => {
  if (!user?.role) return false
  return roles.includes(user.role)
}

export const isAdmin: Access = ({ req }) => hasRole((req.user as ReqUser) ?? null, ['admin'])

export const isAdminOrEditor: Access = ({ req }) =>
  hasRole((req.user as ReqUser) ?? null, ['admin', 'editor'])

export const readPublishedOrPrivileged: Access = ({ req }) => {
  if (hasRole((req.user as ReqUser) ?? null, ['admin', 'editor'])) return true

  return {
    status: {
      equals: 'published',
    },
  }
}

export const defineCollection = <T extends CollectionConfig>(config: T): T => config

export const defineGlobal = <T extends GlobalConfig>(config: T): T => config

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const slugField = (sourceField: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length < 2) {
      return 'Slug måste vara minst 2 tecken.'
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Slug får bara innehålla gemener, siffror och bindestreck.'
    }

    return true
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return slugify(value)
        }

        const source = data?.[sourceField]
        if (typeof source === 'string' && source.trim().length > 0) {
          return slugify(source)
        }

        return value
      },
    ],
  },
})

export const setPublishedAtOnPublish: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const nextStatus = data?.status
  const prevStatus = originalDoc?.status

  if (nextStatus === 'published' && prevStatus !== 'published' && !data?.publishedAt) {
    return {
      ...data,
      publishedAt: new Date().toISOString(),
    }
  }

  return data
}
