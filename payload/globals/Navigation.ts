import type { GlobalConfig } from 'payload'

import { defineGlobal, isAdmin } from '../collections/_shared'

const linkValidation = (value: unknown): true | string => {
  if (typeof value !== 'string' || value.trim().length < 1) {
    return 'Lank maste anges.'
  }

  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Endast relativa lankar eller http/https ar tillatna.'
    }
    return true
  } catch {
    return 'Ogiltig lank.'
  }
}

export const Navigation = defineGlobal({
  slug: 'navigation',
  label: 'Navigation',
  access: {
    read: () => true,
    update: isAdmin,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 20,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          maxLength: 60,
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 1) {
              return 'Label maste anges.'
            }
            return true
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          validate: linkValidation,
        },
        {
          name: 'children',
          type: 'array',
          minRows: 0,
          maxRows: 20,
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              maxLength: 60,
            },
            {
              name: 'link',
              type: 'text',
              required: true,
              validate: linkValidation,
            },
          ],
        },
      ],
    },
  ],
} satisfies GlobalConfig)
