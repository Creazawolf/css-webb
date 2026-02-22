import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin } from './_shared'

export const Users = defineCollection({
  slug: 'users',
  labels: {
    singular: 'Anvandare',
    plural: 'Anvandare',
  },
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
  },
  access: {
    create: isAdmin,
    read: ({ req }) => Boolean(req.user),
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Namn maste vara minst 2 tecken.'
        }

        return true
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Redaktor', value: 'editor' },
      ],
      access: {
        create: isAdmin,
        update: isAdmin,
      },
    },
  ],
} satisfies CollectionConfig)
