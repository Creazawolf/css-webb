import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor, slugField } from './_shared'

/**
 * Evenemang med ett datum: pubkvällar, resor till London, årsmöten och träffar.
 * Platser som alltid gäller (t.ex. "vi ses alltid på The Bishops Arms i Malmö")
 * hör hemma i Mötesplatser istället.
 */
export const Events = defineCollection({
  slug: 'events',
  labels: {
    singular: 'Evenemang',
    plural: 'Evenemang',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'eventType', 'city', '_status'],
    description: 'Pubkvällar, resor, årsmöten och andra träffar.',
    group: 'Föreningen',
  },
  versions: {
    drafts: { autosave: { interval: 1500 } },
    maxPerDoc: 20,
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
      label: 'Rubrik',
      required: true,
      maxLength: 140,
      admin: { placeholder: 'T.ex. "Pubkväll: Chelsea – Arsenal"' },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 5) {
          return 'Rubriken måste vara minst 5 tecken.'
        }
        return true
      },
    },
    slugField('title'),
    {
      type: 'row',
      fields: [
        {
          name: 'date',
          type: 'date',
          label: 'Startar',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'yyyy-MM-dd HH:mm' },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'Slutar',
          admin: {
            width: '50%',
            description: 'Valfritt.',
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'yyyy-MM-dd HH:mm' },
          },
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (!value || !siblingData?.date) return true

            const start = new Date(String(siblingData.date))
            const end = new Date(String(value))
            if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
              return 'Ogiltigt datumformat.'
            }
            if (end < start) {
              return 'Sluttiden kan inte vara före starttiden.'
            }
            return true
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'eventType',
          type: 'select',
          label: 'Typ',
          required: true,
          defaultValue: 'pubkvall',
          admin: { width: '50%' },
          options: [
            { label: 'Pubkväll', value: 'pubkvall' },
            { label: 'Resa', value: 'resa' },
            { label: 'Årsmöte', value: 'arsmote' },
            { label: 'Träff', value: 'traff' },
            { label: 'Annat', value: 'annat' },
          ],
        },
        {
          name: 'city',
          type: 'text',
          label: 'Stad',
          admin: { width: '50%', placeholder: 'T.ex. Stockholm' },
        },
      ],
    },
    {
      name: 'location',
      type: 'text',
      label: 'Plats',
      required: true,
      admin: { description: 'Namn och gärna adress, t.ex. "The Bishops Arms, Vasagatan 1".' },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 3) {
          return 'Ange var evenemanget hålls.'
        }
        return true
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Beskrivning',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'maxAttendees',
          type: 'number',
          label: 'Max antal deltagare',
          min: 1,
          max: 10000,
          admin: { width: '50%', description: 'Valfritt.', step: 1 },
          validate: (value: unknown) => {
            if (value == null) return true
            if (typeof value !== 'number') return 'Ange ett tal.'
            if (!Number.isInteger(value)) return 'Ange ett heltal.'
            return true
          },
        },
        {
          name: 'registrationLink',
          type: 'text',
          label: 'Anmälningslänk',
          admin: { width: '50%', description: 'Valfritt. Full adress inklusive https://' },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Länken måste vara text.'
            try {
              const url = new URL(value)
              if (!['http:', 'https:'].includes(url.protocol)) {
                return 'Länken måste börja med http:// eller https://.'
              }
              return true
            } catch {
              return 'Ogiltig länk.'
            }
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Lyft på startsidan',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
} satisfies CollectionConfig)
