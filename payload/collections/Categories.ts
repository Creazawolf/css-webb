import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor, slugField } from './_shared'

export const Categories = defineCollection({
  slug: 'categories',
  labels: {
    singular: 'Kategori',
    plural: 'Kategorier',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'updatedAt'],
    description: 'Ämnen att sortera artiklar under.',
    group: 'Innehåll',
  },
  access: {
    // Redaktörer måste kunna skapa en kategori i farten när de skriver —
    // annars fastnar de och får vänta på en administratör.
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Namn',
      required: true,
      unique: true,
      maxLength: 60,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Namnet måste vara minst 2 tecken.'
        }
        return true
      },
    },
    slugField('name'),
    {
      name: 'description',
      type: 'textarea',
      label: 'Beskrivning',
      maxLength: 240,
      admin: {
        description: 'Valfritt. Visas överst på kategorisidan.',
      },
    },
  ],
} satisfies CollectionConfig)
