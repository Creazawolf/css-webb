import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor } from './_shared'

export const Media = defineCollection({
  slug: 'media',
  labels: {
    singular: 'Bild',
    plural: 'Bilder',
  },
  admin: {
    description: 'Alla bilder som används på sajten.',
    group: 'Innehåll',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    // Redaktörer måste kunna ladda upp bilder — artiklar har huvudbild, och
    // tidigare kunde bara administratörer skapa media, vilket i praktiken
    // låste redaktörerna ute från att illustrera sina egna texter.
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    // Radering lämnas till administratörer: en borttagen bild försvinner från
    // alla artiklar som använder den.
    delete: isAdminOrEditor,
  },
  upload: {
    staticDir: 'media',
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'og', width: 1200, height: 630, position: 'centre' },
    ],
    mimeTypes: ['image/*'],
    // Beskär inte originalet — vi vill behålla full upplösning för framtiden.
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      label: 'Bildbeskrivning',
      type: 'text',
      required: true,
      admin: {
        description:
          'Beskriv kort vad bilden föreställer. Läses upp för synskadade besökare och visas om bilden inte laddar. T.ex. "Cole Palmer jublar efter mål".',
      },
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 3) {
          return 'Skriv en kort beskrivning av bilden (minst 3 tecken).'
        }
        return true
      },
    },
    {
      name: 'caption',
      label: 'Bildtext',
      type: 'text',
      maxLength: 180,
      admin: {
        description: 'Valfritt. Visas under bilden i artikeln.',
      },
    },
    {
      name: 'credit',
      label: 'Fotograf / källa',
      type: 'text',
      maxLength: 140,
      admin: {
        description: 'Valfritt, men ange alltid källa för bilder du inte tagit själv.',
      },
    },
  ],
} satisfies CollectionConfig)
