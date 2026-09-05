import type { CollectionConfig } from 'payload'

import { getSiteUrl } from '../../lib/env'

import {
  defaultToCurrentUser,
  defineCollection,
  isAdminOrEditor,
  readPublishedOrPrivileged,
  richTextToPlainText,
  seoField,
  setPublishedAtOnPublish,
  slugField,
  truncateAtWord,
} from './_shared'
import { revalidatePost, revalidatePostAfterDelete } from '../hooks/revalidate'

/**
 * Artiklar — matchreferat, spelarbetyg, inför-texter, krönikor och klubbnytt.
 *
 * Målet med den här konfigurationen är att en redaktör utan teknisk vana ska
 * kunna skriva och publicera med bara två fält ifyllda: rubrik och text.
 * Allt annat (slug, ingress, författare, datum, SEO) fylls i automatiskt och
 * kan finjusteras efteråt av den som vill.
 */
export const Posts = defineCollection({
  slug: 'posts',
  labels: {
    singular: 'Artikel',
    plural: 'Artiklar',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'articleType', 'publishedAt', '_status'],
    description: 'Nyheter, matchreferat, spelarbetyg och krönikor.',
    group: 'Innehåll',
    listSearchableFields: ['title', 'excerpt'],
    preview: (doc) => {
      if (typeof doc?.slug !== 'string' || !doc.slug) return null
      const base = getSiteUrl()
      return `${base}/sv/artiklar/${doc.slug}`
    },
  },
  // Utkast + autospar. Redaktörer kan spara halvfärdigt utan att något syns
  // publikt, och en felredigering går alltid att återställa från versionerna.
  versions: {
    drafts: {
      autosave: { interval: 1500 },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
  access: {
    create: isAdminOrEditor,
    read: readPublishedOrPrivileged,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [setPublishedAtOnPublish],
    afterChange: [revalidatePost],
    afterDelete: [revalidatePostAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Rubrik',
      required: true,
      maxLength: 140,
      admin: {
        placeholder: 'T.ex. "Spelarbetyg: Chelsea – Arsenal"',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 5) {
          return 'Rubriken måste vara minst 5 tecken.'
        }
        return true
      },
    },

    // Flikar håller formuläret kort: redaktören ser "Innehåll" och behöver
    // aldrig öppna resten om hen inte vill.
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Innehåll',
          description: 'Det här är allt du behöver för att publicera.',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: 'Artikeltext',
              required: true,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Huvudbild',
              admin: {
                description:
                  'Visas överst i artikeln och i alla listor. Dra och släpp en bild här — du kan ladda upp direkt.',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              label: 'Ingress',
              maxLength: 320,
              admin: {
                description:
                  'Kort sammanfattning som visas i listor. Lämnar du fältet tomt skapas en ingress automatiskt från artikelns första stycke.',
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (typeof value === 'string' && value.trim().length > 0) {
                      return value
                    }
                    const plain = richTextToPlainText(data?.content)
                    if (!plain) return value
                    return truncateAtWord(plain, 260)
                  },
                ],
              },
            },
          ],
        },
        {
          label: 'Sortering',
          description: 'Hjälper läsarna att hitta rätt. Kan lämnas som det är.',
          fields: [
            {
              name: 'articleType',
              type: 'select',
              label: 'Typ av artikel',
              defaultValue: 'nyhet',
              admin: {
                description:
                  'Styr hur artikeln märks upp i listorna. Samma indelning som vi använt på SvenskaFans.',
              },
              options: [
                { label: 'Nyhet', value: 'nyhet' },
                { label: 'Inför match', value: 'infor' },
                { label: 'Matchreferat', value: 'referat' },
                { label: 'Spelarbetyg', value: 'spelarbetyg' },
                { label: 'Krönika', value: 'kronika' },
                { label: 'Föreningsnytt', value: 'foreningen' },
                { label: 'Intervju', value: 'intervju' },
              ],
            },
            {
              name: 'category',
              type: 'relationship',
              relationTo: 'categories',
              label: 'Kategori',
              admin: {
                description: 'Valfritt. Används för filtrering på nyhetssidan.',
              },
            },
            {
              name: 'relatedMatch',
              type: 'relationship',
              relationTo: 'matches',
              label: 'Hör till match',
              admin: {
                description:
                  'Koppla ett referat, spelarbetyg eller inför-text till rätt match, så dyker artikeln upp i matchcentret.',
              },
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Taggar',
              labels: { singular: 'Tagg', plural: 'Taggar' },
              maxRows: 10,
              admin: {
                description: 'Valfritt. T.ex. spelarnamn eller motståndare.',
              },
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                  required: true,
                  validate: (value: unknown) => {
                    if (typeof value !== 'string' || value.trim().length < 2) {
                      return 'Taggen måste vara minst 2 tecken.'
                    }
                    return true
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Sökmotorer',
          fields: [seoField()],
        },
      ],
    },

    // --- Sidopanel ---
    slugField('title'),
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Skribent',
      admin: {
        position: 'sidebar',
        description: 'Sätts till dig automatiskt. Ändra om någon annan skrivit texten.',
      },
      hooks: {
        beforeValidate: [defaultToCurrentUser],
      },
    },
    {
      name: 'byline',
      type: 'text',
      label: 'Ursprunglig skribent',
      maxLength: 120,
      admin: {
        position: 'sidebar',
        description:
          'För texter som flyttats hit utifrån. Visas som skribent när personen inte har ett konto här. Lämna tom för egna texter.',
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Ursprunglig länk',
      admin: {
        position: 'sidebar',
        description: 'Var texten publicerades först. Visas som en källhänvisning under artikeln.',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publiceringsdatum',
      admin: {
        position: 'sidebar',
        description: 'Fylls i automatiskt när du publicerar.',
        date: {
          pickerAppearance: 'dayAndTime',
          displayFormat: 'yyyy-MM-dd HH:mm',
        },
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Toppa på startsidan',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Lyfter artikeln till den stora puffen högst upp.',
      },
    },
  ],
} satisfies CollectionConfig)
