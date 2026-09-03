import type { CollectionConfig } from 'payload'

import {
  defineCollection,
  isAdminOrEditor,
  readPublishedOrPrivileged,
  seoField,
  setPublishedAtOnPublish,
  slugField,
} from './_shared'
import { revalidatePage } from '../hooks/revalidate'

/**
 * Fristående sidor: Om oss, Biljettinfo, Arenaguide, Reseguide, FPL-ligan
 * och liknande. Innehållet byggs av block så att en redaktör kan sätta ihop
 * en sida utan att skriva kod.
 */
export const Pages = defineCollection({
  slug: 'pages',
  labels: {
    singular: 'Sida',
    plural: 'Sidor',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Fasta sidor som Om oss, Biljetter, Arenaguide och Reseguide.',
    group: 'Innehåll',
    preview: (doc) => {
      if (typeof doc?.slug !== 'string' || !doc.slug) return null
      const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
      return `${base}/sv/${doc.slug}`
    },
  },
  versions: {
    drafts: { autosave: { interval: 1500 } },
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
    afterChange: [revalidatePage],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Rubrik',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Rubriken måste vara minst 2 tecken.'
        }
        return true
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Innehåll',
          fields: [
            {
              name: 'intro',
              type: 'textarea',
              label: 'Ingress',
              maxLength: 320,
              admin: { description: 'Valfri kort text som visas under rubriken.' },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Toppbild',
            },
            {
              name: 'content',
              type: 'blocks',
              label: 'Innehållsblock',
              labels: { singular: 'Block', plural: 'Block' },
              admin: {
                description:
                  'Bygg sidan genom att lägga till block. Du kan dra dem för att ändra ordning.',
              },
              blocks: [
                {
                  slug: 'richTextBlock',
                  labels: { singular: 'Text', plural: 'Textblock' },
                  fields: [
                    { name: 'body', type: 'richText', label: 'Text', required: true },
                  ],
                },
                {
                  slug: 'imageBlock',
                  labels: { singular: 'Bild', plural: 'Bildblock' },
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Bild',
                      required: true,
                    },
                    { name: 'caption', type: 'text', label: 'Bildtext', maxLength: 180 },
                  ],
                },
                {
                  slug: 'factsBlock',
                  labels: { singular: 'Faktaruta', plural: 'Faktarutor' },
                  fields: [
                    { name: 'heading', type: 'text', label: 'Rubrik', required: true },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Rader',
                      labels: { singular: 'Rad', plural: 'Rader' },
                      minRows: 1,
                      fields: [
                        { name: 'label', type: 'text', label: 'Etikett', required: true },
                        { name: 'value', type: 'text', label: 'Värde', required: true },
                      ],
                    },
                  ],
                },
                {
                  slug: 'ctaBlock',
                  labels: { singular: 'Knapp', plural: 'Knappar' },
                  fields: [
                    { name: 'heading', type: 'text', label: 'Rubrik', required: true },
                    { name: 'body', type: 'textarea', label: 'Text', maxLength: 240 },
                    { name: 'buttonLabel', type: 'text', label: 'Knapptext', required: true },
                    {
                      name: 'buttonUrl',
                      type: 'text',
                      label: 'Knapplänk',
                      required: true,
                      admin: { description: 'Intern länk som /sv/medlemskap, eller full https://-adress.' },
                    },
                  ],
                },
                {
                  slug: 'faqBlock',
                  labels: { singular: 'Frågor och svar', plural: 'Frågor och svar' },
                  fields: [
                    { name: 'heading', type: 'text', label: 'Rubrik' },
                    {
                      name: 'items',
                      type: 'array',
                      label: 'Frågor',
                      labels: { singular: 'Fråga', plural: 'Frågor' },
                      minRows: 1,
                      fields: [
                        { name: 'question', type: 'text', label: 'Fråga', required: true },
                        { name: 'answer', type: 'textarea', label: 'Svar', required: true },
                      ],
                    },
                  ],
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
    slugField('title'),
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Publicerad',
      admin: {
        position: 'sidebar',
        date: { displayFormat: 'yyyy-MM-dd' },
      },
    },
  ],
} satisfies CollectionConfig)
