import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin, slugField } from './_shared'

export const Categories = defineCollection({
  slug: 'categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategorier',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    read: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      maxLength: 60,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Kategori måste vara minst 2 tecken.'
        }
        return true
      },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      maxLength: 240,
    },
  ],
} satisfies CollectionConfig)
