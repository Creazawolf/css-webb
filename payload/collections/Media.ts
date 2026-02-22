import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin } from './_shared'

export const Media = defineCollection({
  slug: 'media',
  labels: {
    singular: 'Mediafil',
    plural: 'Media',
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
      },
      {
        name: 'card',
        width: 800,
        height: 600,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
      },
    ],
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt text',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 5) {
          return 'Alt text måste vara minst 5 tecken.'
        }
        return true
      },
    },
    {
      name: 'caption',
      type: 'text',
      maxLength: 180,
    },
    {
      name: 'credit',
      type: 'text',
      maxLength: 140,
    },
  ],
} satisfies CollectionConfig)
