import type { CollectionConfig } from 'payload'

import {
  defineCollection,
  isAdmin,
  readPublishedOrPrivileged,
  setPublishedAtOnPublish,
  slugField,
} from './_shared'

export const Pages = defineCollection({
  slug: 'pages',
  labels: {
    singular: 'Sida',
    plural: 'Sidor',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    read: readPublishedOrPrivileged,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [setPublishedAtOnPublish],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Titel måste vara minst 2 tecken.'
        }
        return true
      },
    },
    slugField('title'),
    {
      name: 'content',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: [
        {
          slug: 'richTextBlock',
          labels: {
            singular: 'Textblock',
            plural: 'Textblock',
          },
          fields: [
            {
              name: 'body',
              type: 'richText',
              required: true,
            },
          ],
        },
        {
          slug: 'imageBlock',
          labels: {
            singular: 'Bildblock',
            plural: 'Bildblock',
          },
          fields: [
            {
              name: 'image',
              type: 'relationship',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
              maxLength: 180,
            },
          ],
        },
      ],
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Publicerad', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          maxLength: 60,
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          maxLength: 160,
        },
        {
          name: 'ogImage',
          type: 'relationship',
          relationTo: 'media',
        },
      ],
    },
  ],
} satisfies CollectionConfig)
