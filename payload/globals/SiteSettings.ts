import type { GlobalConfig } from 'payload'

import { defineGlobal, isAdmin } from '../collections/_shared'

export const SiteSettings = defineGlobal({
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      maxLength: 80,
      defaultValue: 'Chelsea Supporters Sweden',
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 3) {
          return 'Site-namn maste vara minst 3 tecken.'
        }
        return true
      },
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'socialLinks',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'X', value: 'x' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Annat', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: unknown) => {
            if (typeof value !== 'string') return 'URL maste vara text.'
            try {
              const url = new URL(value)
              if (!['http:', 'https:'].includes(url.protocol)) {
                return 'Lank maste borja med http:// eller https://.'
              }
              return true
            } catch {
              return 'Ogiltig URL.'
            }
          },
        },
      ],
    },
    {
      name: 'footerText',
      type: 'textarea',
      required: true,
      maxLength: 400,
    },
    {
      name: 'nextMatchOverride',
      type: 'relationship',
      relationTo: 'matches',
      admin: {
        description: 'Om satt, anvands denna match istallet for automatisk nasta match.',
      },
    },
  ],
} satisfies GlobalConfig)
