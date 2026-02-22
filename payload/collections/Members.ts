import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin } from './_shared'

export const Members = defineCollection({
  slug: 'members',
  labels: {
    singular: 'Medlem',
    plural: 'Medlemmar',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'membershipType', 'active', 'expiresAt'],
    description: 'GDPR: Minimalt medlemsregister, inga personnummer eller känslig data.',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
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
          return 'Namn måste vara minst 2 tecken.'
        }
        return true
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || !value.includes('@')) {
          return 'Ange en giltig e-postadress.'
        }
        return true
      },
    },
    {
      name: 'phone',
      type: 'text',
      validate: (value: unknown) => {
        if (!value) return true
        if (typeof value !== 'string') return 'Telefonnummer måste vara text.'
        if (!/^[+]?[0-9\s-]{7,20}$/.test(value)) {
          return 'Ange ett giltigt telefonnummer.'
        }
        return true
      },
    },
    {
      name: 'membershipType',
      type: 'select',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Premium', value: 'premium' },
        { label: 'Ungdom', value: 'ungdom' },
      ],
    },
    {
      name: 'joinedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'expiresAt',
      type: 'date',
      required: true,
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return 'Utgångsdatum måste anges.'

        const joined = new Date(String(siblingData?.joinedAt))
        const expires = new Date(String(value))

        if (Number.isNaN(joined.valueOf()) || Number.isNaN(expires.valueOf())) {
          return 'Ogiltigt datumformat.'
        }

        if (expires <= joined) {
          return 'Utgångsdatum måste vara efter startdatum.'
        }

        return true
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      required: true,
      defaultValue: true,
    },
  ],
} satisfies CollectionConfig)
