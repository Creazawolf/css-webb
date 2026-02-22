import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor } from './_shared'

export const Matches = defineCollection({
  slug: 'matches',
  labels: {
    singular: 'Match',
    plural: 'Matcher',
  },
  admin: {
    useAsTitle: 'opponent',
    defaultColumns: ['opponent', 'date', 'competition', 'status'],
  },
  access: {
    create: isAdminOrEditor,
    read: ({ req }) => {
      if (req.user?.role === 'admin' || req.user?.role === 'editor') return true
      return {
        status: {
          in: ['upcoming', 'live', 'finished'],
        },
      }
    },
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  fields: [
    {
      name: 'opponent',
      type: 'text',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Motståndare måste anges.'
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
      name: 'venue',
      type: 'text',
      required: true,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 3) {
          return 'Arena/plats måste anges.'
        }
        return true
      },
    },
    {
      name: 'competition',
      type: 'select',
      required: true,
      options: [
        { label: 'Premier League', value: 'premier-league' },
        { label: 'Champions League', value: 'champions-league' },
        { label: 'FA Cup', value: 'fa-cup' },
        { label: 'EFL Cup', value: 'efl-cup' },
        { label: 'Klubbvänskap', value: 'friendly' },
        { label: 'Annat', value: 'other' },
      ],
    },
    {
      name: 'result',
      type: 'group',
      fields: [
        {
          name: 'homeGoals',
          type: 'number',
          min: 0,
          max: 30,
          validate: (value: unknown, { data }) => {
            if (data?.status === 'finished' && typeof value !== 'number') {
              return 'Ange hemmamål när matchen är avslutad.'
            }
            return true
          },
        },
        {
          name: 'awayGoals',
          type: 'number',
          min: 0,
          max: 30,
          validate: (value: unknown, { data }) => {
            if (data?.status === 'finished' && typeof value !== 'number') {
              return 'Ange bortamål när matchen är avslutad.'
            }
            return true
          },
        },
      ],
    },
    {
      name: 'matchReport',
      type: 'richText',
    },
    {
      name: 'matchReportPost',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: false,
      admin: {
        description: 'Länka publicerat matchreferat från nyhetsflödet.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'upcoming',
      options: [
        { label: 'Kommande', value: 'upcoming' },
        { label: 'Live', value: 'live' },
        { label: 'Avslutad', value: 'finished' },
      ],
    },
  ],
} satisfies CollectionConfig)
