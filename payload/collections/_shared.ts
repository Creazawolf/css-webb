import type {
  Access,
  CollectionBeforeChangeHook,
  CollectionConfig,
  Field,
  FieldAccess,
  FieldHook,
  GlobalConfig,
} from 'payload'

export type UserRole = 'admin' | 'editor' | 'member'

type ReqUser = {
  id?: number | string
  role?: UserRole
} | null

const hasRole = (user: ReqUser, roles: UserRole[]): boolean => {
  if (!user?.role) return false
  return roles.includes(user.role)
}

export const isAdmin: Access = ({ req }) => hasRole((req.user as ReqUser) ?? null, ['admin'])

export const isAdminOrEditor: Access = ({ req }) =>
  hasRole((req.user as ReqUser) ?? null, ['admin', 'editor'])

/** Inloggad över huvud taget — används där redaktörer måste kunna läsa. */
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Fältnivåvariant av `isAdmin` (fältåtkomst har en annan signatur). */
export const isAdminField: FieldAccess = ({ req }) =>
  hasRole((req.user as ReqUser) ?? null, ['admin'])

export const readPublishedOrPrivileged: Access = ({ req }) => {
  if (hasRole((req.user as ReqUser) ?? null, ['admin', 'editor'])) return true

  return {
    _status: {
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
    // Svenska tecken translittereras innan diakritiker strippas, annars
    // blir "ö" till "o" via NFD men "å"/"ä" tappar sin betydelse olika.
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Slug som fylls i automatiskt från titeln.
 *
 * Fältet är avsiktligt *inte* obligatoriskt i formuläret — det räknas fram i
 * beforeValidate innan Payload validerar, så en redaktör behöver aldrig röra
 * det. Den som vill kan fortfarande skriva en egen slug.
 */
export const slugField = (sourceField: string = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'Webbadress (slug)',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description:
      'Fylls i automatiskt från rubriken. Ändra bara om du vet vad du gör — en publicerad artikel som byter slug tappar sina gamla länkar.',
  },
  validate: (value: unknown) => {
    if (typeof value !== 'string' || value.trim().length < 2) {
      return 'Webbadressen kunde inte skapas. Skriv en längre rubrik eller fyll i fältet manuellt.'
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
      return 'Webbadressen får bara innehålla gemener, siffror och bindestreck.'
    }

    return true
  },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (typeof value === 'string' && value.trim().length > 0) {
          return slugify(value)
        }

        const source = data?.[sourceField] ?? originalDoc?.[sourceField]
        if (typeof source === 'string' && source.trim().length > 0) {
          return slugify(source)
        }

        return value
      },
    ],
  },
})

/**
 * Sätter fältet till den inloggade användaren när det lämnas tomt.
 * Används för `author`, så att redaktörer slipper välja sig själva i en lista.
 */
export const defaultToCurrentUser: FieldHook = ({ value, req }) => {
  if (value) return value
  const user = req.user as ReqUser
  return user?.id ?? value
}

/**
 * Plockar ut ren text ur ett Lexical-dokument.
 * Används för att autogenerera ingress och metabeskrivning.
 */
export const richTextToPlainText = (content: unknown): string => {
  if (!content || typeof content !== 'object') return ''

  const parts: string[] = []

  const walk = (node: unknown): void => {
    if (!node || typeof node !== 'object') return
    const n = node as { type?: string; text?: string; children?: unknown[] }

    if (typeof n.text === 'string') {
      parts.push(n.text)
    }

    if (Array.isArray(n.children)) {
      for (const child of n.children) walk(child)
      // Blocknivåelement ska separeras med mellanslag, inte klistras ihop.
      if (n.type === 'paragraph' || n.type === 'heading') parts.push(' ')
    }
  }

  const root = (content as { root?: unknown }).root
  walk(root ?? content)

  return parts.join('').replace(/\s+/g, ' ').trim()
}

/** Klipper text vid närmaste ordgräns istället för mitt i ett ord. */
export const truncateAtWord = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  const base = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${base.replace(/[.,;:!?–-]+$/, '')}…`
}

export const setPublishedAtOnPublish: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const nextStatus = data?._status
  const prevStatus = originalDoc?._status

  if (nextStatus === 'published' && prevStatus !== 'published' && !data?.publishedAt) {
    return {
      ...data,
      publishedAt: new Date().toISOString(),
    }
  }

  return data
}

/**
 * Gemensamt SEO-fält.
 *
 * Inget här är obligatoriskt. Lämnas fälten tomma härleds de från rubrik och
 * ingress när sidan renderas, så en redaktör kan publicera utan att ens öppna
 * fliken. Den som vill finjustera kan göra det.
 */
export const seoField = (): Field => ({
  name: 'seo',
  type: 'group',
  label: 'Sökmotorer och delning',
  admin: {
    description:
      'Valfritt. Lämnar du fälten tomma används rubriken och ingressen automatiskt.',
  },
  fields: [
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Titel i Google',
      maxLength: 70,
      admin: {
        description: 'Max ca 60 tecken. Tomt = artikelns rubrik används.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Beskrivning i Google',
      maxLength: 200,
      admin: {
        description: 'Max ca 160 tecken. Tomt = ingressen används.',
      },
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Delningsbild',
      admin: {
        description: 'Tomt = huvudbilden används när någon delar artikeln.',
      },
    },
  ],
})
