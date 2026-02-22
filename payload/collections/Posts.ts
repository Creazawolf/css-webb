import type { CollectionConfig } from 'payload'

import {
  defineCollection,
  isAdminOrEditor,
  readPublishedOrPrivileged,
  setPublishedAtOnPublish,
  slugField,
} from './_shared'

export const Posts = defineCollection({
  slug: 'posts',
  labels: {
    singular: 'Inlägg',
    plural: 'Inlägg',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedAt', 'updatedAt'],
  },
  access: {
    create: isAdminOrEditor,
    read: readPublishedOrPrivileged,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  hooks: {
    beforeChange: [setPublishedAtOnPublish],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 140,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 5) {
          return 'Titel måste vara minst 5 tecken.'
        }
        return true
      },
    },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 320,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 30) {
          return 'Ingress måste vara minst 30 tecken.'
        }
        return true
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'tags',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 2) {
              return 'Tagg måste vara minst 2 tecken.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
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
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          required: true,
          maxLength: 60,
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 20) {
              return 'Meta title bör vara minst 20 tecken.'
            }
            return true
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          required: true,
          maxLength: 160,
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 50) {
              return 'Meta description bör vara minst 50 tecken.'
            }
            return true
          },
        },
        {
          name: 'ogImage',
          type: 'relationship',
          relationTo: 'media',
          required: false,
        },
      ],
    },
  ],
} satisfies CollectionConfig)
