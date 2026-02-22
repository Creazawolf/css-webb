import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor } from './_shared'

export const Events = defineCollection({
  slug: 'events',
  labels: {
    singular: 'Event',
    plural: 'Event',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'eventType', 'location'],
  },
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
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
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
        if (!value) return true
        if (!siblingData?.date) return true

        const start = new Date(String(siblingData.date))
        const end = new Date(String(value))
        if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
          return 'Ogiltigt datumformat.'
        }

        if (end < start) {
          return 'Sluttid kan inte vara före starttid.'
        }

        return true
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 3) {
          return 'Plats måste anges.'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Pubkväll', value: 'pubkvall' },
        { label: 'Resa', value: 'resa' },
        { label: 'Årsmöte', value: 'arsmote' },
        { label: 'Annat', value: 'annat' },
      ],
    },
    {
      name: 'maxAttendees',
      type: 'number',
      min: 1,
      max: 10000,
      validate: (value: unknown) => {
        if (value == null) return true
        if (typeof value !== 'number') return 'Max antal deltagare måste vara ett nummer.'
        if (!Number.isInteger(value)) return 'Max antal deltagare måste vara ett heltal.'
        return true
      },
    },
    {
      name: 'registrationLink',
      type: 'text',
      validate: (value: unknown) => {
        if (!value) return true
        if (typeof value !== 'string') return 'Registreringslänk måste vara text.'
        try {
          const url = new URL(value)
          if (!['http:', 'https:'].includes(url.protocol)) {
            return 'Länken måste börja med http:// eller https://.'
          }
          return true
        } catch {
          return 'Ogiltig URL.'
        }
      },
    },
    {
      name: 'featuredImage',
      type: 'relationship',
      relationTo: 'media',
    },
  ],
} satisfies CollectionConfig)
