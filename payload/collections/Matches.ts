import type { CollectionConfig } from 'payload'

import { defineCollection, isAdminOrEditor } from './_shared'

/**
 * Matcher som föreningen själv vill lyfta — framför allt för att koppla ihop
 * inför-texter, referat och spelarbetyg, och för att peka ut var vi ses.
 *
 * Spelschema, resultat och tabell hämtas live från API-Football; den här
 * samlingen ersätter inte det, den lägger föreningens eget lager ovanpå.
 */
export const Matches = defineCollection({
  slug: 'matches',
  labels: {
    singular: 'Match',
    plural: 'Matcher',
  },
  admin: {
    useAsTitle: 'opponent',
    defaultColumns: ['opponent', 'date', 'competition', 'team', 'status'],
    description:
      'Föreningens egna matchsidor. Spelschema och tabell hämtas automatiskt — här lägger ni till referat, betyg och var vi ses.',
    group: 'Matcher',
  },
  access: {
    create: isAdminOrEditor,
    read: () => true,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
  defaultSort: '-date',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'opponent',
          type: 'text',
          label: 'Motståndare',
          required: true,
          maxLength: 120,
          admin: { width: '50%' },
          validate: (value: unknown) => {
            if (typeof value !== 'string' || value.trim().length < 2) {
              return 'Ange motståndare.'
            }
            return true
          },
        },
        {
          name: 'date',
          type: 'date',
          label: 'Avspark',
          required: true,
          admin: {
            width: '50%',
            date: { pickerAppearance: 'dayAndTime', displayFormat: 'yyyy-MM-dd HH:mm' },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'team',
          type: 'select',
          label: 'Lag',
          required: true,
          defaultValue: 'herrar',
          admin: { width: '33%' },
          options: [
            { label: 'Herrar', value: 'herrar' },
            { label: 'Damer', value: 'damer' },
            { label: 'Akademin', value: 'akademin' },
          ],
        },
        {
          name: 'homeOrAway',
          type: 'select',
          label: 'Hemma/borta',
          required: true,
          defaultValue: 'home',
          admin: { width: '33%' },
          options: [
            { label: 'Hemma', value: 'home' },
            { label: 'Borta', value: 'away' },
            { label: 'Neutral plan', value: 'neutral' },
          ],
        },
        {
          name: 'competition',
          type: 'select',
          label: 'Tävling',
          required: true,
          defaultValue: 'premier-league',
          admin: { width: '34%' },
          options: [
            { label: 'Premier League', value: 'premier-league' },
            { label: 'Champions League', value: 'champions-league' },
            { label: 'Europa League', value: 'europa-league' },
            { label: 'FA-cupen', value: 'fa-cup' },
            { label: 'Ligacupen', value: 'efl-cup' },
            { label: "Women's Super League", value: 'wsl' },
            { label: 'Träningsmatch', value: 'friendly' },
            { label: 'Annat', value: 'other' },
          ],
        },
      ],
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Arena',
      admin: { placeholder: 'T.ex. Stamford Bridge' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'upcoming',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Kommande', value: 'upcoming' },
        { label: 'Pågår', value: 'live' },
        { label: 'Avslutad', value: 'finished' },
      ],
    },
    {
      name: 'result',
      type: 'group',
      label: 'Resultat',
      admin: {
        description: 'Fylls i när matchen är slut. Alltid Chelseas mål först.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'chelseaGoals',
              type: 'number',
              label: 'Chelsea',
              min: 0,
              max: 30,
              admin: { width: '50%', step: 1 },
              validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
                if (data?.status === 'finished' && typeof value !== 'number') {
                  return 'Ange Chelseas mål när matchen är avslutad.'
                }
                return true
              },
            },
            {
              name: 'opponentGoals',
              type: 'number',
              label: 'Motståndaren',
              min: 0,
              max: 30,
              admin: { width: '50%', step: 1 },
              validate: (value: unknown, { data }: { data: Record<string, unknown> }) => {
                if (data?.status === 'finished' && typeof value !== 'number') {
                  return 'Ange motståndarens mål när matchen är avslutad.'
                }
                return true
              },
            },
          ],
        },
      ],
    },
    {
      name: 'watchAt',
      type: 'relationship',
      relationTo: 'venues',
      hasMany: true,
      label: 'Vi ses här',
      admin: {
        description: 'Vilka mötesplatser som visar den här matchen.',
      },
    },
    {
      name: 'tvChannel',
      type: 'text',
      label: 'Visas på',
      admin: { placeholder: 'T.ex. Viaplay' },
    },
  ],
} satisfies CollectionConfig)
