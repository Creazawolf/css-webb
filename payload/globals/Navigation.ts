import type { GlobalConfig } from 'payload'

import { defineGlobal, isAdminOrEditor } from '../collections/_shared'

const linkValidation = (value: unknown): true | string => {
  if (typeof value !== 'string' || value.trim().length < 1) {
    return 'Ange en länk.'
  }

  if (value.startsWith('/')) return true

  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Bara interna länkar (som /matcher) eller http/https är tillåtna.'
    }
    return true
  } catch {
    return 'Ogiltig länk.'
  }
}

const linkFields = [
  {
    name: 'label',
    type: 'text' as const,
    label: 'Text i menyn',
    required: true,
    maxLength: 60,
    validate: (value: unknown) => {
      if (typeof value !== 'string' || value.trim().length < 1) {
        return 'Ange en text.'
      }
      return true
    },
  },
  {
    name: 'link',
    type: 'text' as const,
    label: 'Länk',
    required: true,
    admin: {
      description: 'Intern sida skrivs som /matcher. Extern länk med full https://-adress.',
    },
    validate: linkValidation,
  },
  {
    name: 'external',
    type: 'checkbox' as const,
    label: 'Öppna i ny flik',
    defaultValue: false,
  },
]

export const Navigation = defineGlobal({
  slug: 'navigation',
  label: 'Meny',
  admin: {
    description: 'Huvudmenyn högst upp på sajten. Dra raderna för att ändra ordning.',
    group: 'Inställningar',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Menyval',
      labels: { singular: 'Menyval', plural: 'Menyval' },
      maxRows: 20,
      admin: {
        description:
          'Lämnas listan tom används sajtens standardmeny. Ett menyval kan ha undermeny.',
        initCollapsed: true,
        components: {
          RowLabel: '@/payload/components/NavRowLabel#NavRowLabel',
        },
      },
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          label: 'Undermeny',
          labels: { singular: 'Undersida', plural: 'Undersidor' },
          maxRows: 20,
          admin: { initCollapsed: true },
          fields: linkFields,
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Kolumner i sidfoten',
      labels: { singular: 'Kolumn', plural: 'Kolumner' },
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Rubrik',
          required: true,
          maxLength: 40,
        },
        {
          name: 'links',
          type: 'array',
          label: 'Länkar',
          labels: { singular: 'Länk', plural: 'Länkar' },
          maxRows: 10,
          fields: linkFields,
        },
      ],
    },
  ],
} satisfies GlobalConfig)
