import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor, slugField } from './_shared'

/**
 * Mötesplatser — puben eller platsen där medlemmar i en viss stad ses och
 * tittar på matcherna tillsammans. Till skillnad från Evenemang har de inget
 * datum; de gäller tills vidare.
 */
export const Venues = defineCollection({
  slug: 'venues',
  labels: {
    singular: 'Mötesplats',
    plural: 'Mötesplatser',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'active'],
    description: 'Puben eller platsen där vi ses och ser matcherna, stad för stad.',
    group: 'Föreningen',
  },
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: 'city',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          label: 'Stad',
          required: true,
          admin: { width: '40%', placeholder: 'T.ex. Göteborg' },
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 2) {
              return 'Ange stad.'
            }
            return true
          },
        },
        {
          name: 'name',
          type: 'text',
          label: 'Namn på stället',
          required: true,
          admin: { width: '60%', placeholder: 'T.ex. The Bishops Arms' },
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 2) {
              return 'Ange vad stället heter.'
            }
            return true
          },
        },
      ],
    },
    slugField('name'),
    {
      name: 'address',
      type: 'text',
      label: 'Adress',
      admin: { placeholder: 'Gatuadress och postort' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Beskrivning',
      maxLength: 600,
      admin: {
        description:
          'Berätta kort hur det funkar — var ni brukar sitta, om det behövs bokning, vem man frågar efter.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'contactName',
          type: 'text',
          label: 'Kontaktperson',
          admin: { width: '50%' },
        },
        {
          name: 'contactEmail',
          type: 'email',
          label: 'Kontakt-e-post',
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'mapsUrl',
      type: 'text',
      label: 'Länk till karta',
      admin: { description: 'Valfritt. Klistra in en Google Maps-länk.' },
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
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Bild',
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktiv',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Avmarkera om stället inte längre gäller, istället för att radera.',
      },
    },
  ],
} satisfies CollectionConfig)
