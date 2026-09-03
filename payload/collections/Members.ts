import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin } from './_shared'

/**
 * Medlemsregister.
 *
 * GDPR: minimalt med uppgifter — inga personnummer, ingen känslig data.
 * Registret får bara läsas av administratörer.
 *
 * Ansökningar från webbformuläret skapas via en server action som använder
 * Payload Local API med `overrideAccess`. Publik `create` är avstängd här, så
 * ingen kan skriva direkt mot REST-API:t.
 */
export const Members = defineCollection({
  slug: 'members',
  labels: {
    singular: 'Medlem',
    plural: 'Medlemmar',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'city', 'status', 'membershipType', 'joinedAt'],
    description:
      'GDPR: minimalt medlemsregister. Inga personnummer eller känsliga uppgifter — lägg aldrig till sådana fält.',
    group: 'Föreningen',
  },
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Ny ansökan', value: 'pending' },
        { label: 'Aktiv medlem', value: 'active' },
        { label: 'Utgången', value: 'expired' },
        { label: 'Avslutad', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Nya ansökningar från webbformuläret hamnar som "Ny ansökan".',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Namn',
          required: true,
          maxLength: 120,
          admin: { width: '50%' },
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 2) {
              return 'Namnet måste vara minst 2 tecken.'
            }
            return true
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'E-post',
          required: true,
          unique: true,
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Telefon',
          admin: { width: '50%', description: 'Valfritt.' },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Telefonnumret måste vara text.'
            if (!/^[+]?[0-9\s-]{7,20}$/.test(value)) {
              return 'Ange ett giltigt telefonnummer.'
            }
            return true
          },
        },
        {
          name: 'city',
          type: 'text',
          label: 'Ort',
          maxLength: 80,
          admin: { width: '50%', description: 'Hjälper oss ordna träffar på rätt ställen.' },
        },
      ],
    },
    {
      name: 'membershipType',
      type: 'select',
      label: 'Medlemstyp',
      required: true,
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Familj', value: 'familj' },
        { label: 'Ungdom', value: 'ungdom' },
        { label: 'Hedersmedlem', value: 'heders' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Meddelande från ansökan',
      maxLength: 1000,
      admin: {
        readOnly: true,
        description: 'Fritext som personen skrev i ansökningsformuläret.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'joinedAt',
          type: 'date',
          label: 'Medlem sedan',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { width: '50%', date: { displayFormat: 'yyyy-MM-dd' } },
        },
        {
          name: 'expiresAt',
          type: 'date',
          label: 'Giltigt till',
          admin: {
            width: '50%',
            description: 'Fylls i när medlemsavgiften betalats.',
            date: { displayFormat: 'yyyy-MM-dd' },
          },
          validate: (value: unknown, { siblingData }: { siblingData: Record<string, unknown> }) => {
            if (!value) return true
            if (!siblingData?.joinedAt) return true

            const joined = new Date(String(siblingData.joinedAt))
            const expires = new Date(String(value))

            if (Number.isNaN(joined.valueOf()) || Number.isNaN(expires.valueOf())) {
              return 'Ogiltigt datumformat.'
            }
            if (expires <= joined) {
              return 'Giltighetsdatumet måste vara efter startdatumet.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'newsletter',
      type: 'checkbox',
      label: 'Vill ha nyhetsbrev',
      defaultValue: false,
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Interna anteckningar',
      maxLength: 1000,
      admin: {
        description: 'Syns bara här i admin. Skriv aldrig känsliga uppgifter.',
      },
    },
  ],
} satisfies CollectionConfig)
