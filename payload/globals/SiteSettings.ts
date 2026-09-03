import type { GlobalConfig } from 'payload'

import { defineGlobal, isAdminOrEditor } from '../collections/_shared'

const urlValidation = (value: unknown): true | string => {
  if (typeof value !== 'string') return 'Adressen måste vara text.'
  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) {
      return 'Länken måste börja med http:// eller https://.'
    }
    return true
  } catch {
    return 'Ogiltig länk.'
  }
}

export const SiteSettings = defineGlobal({
  slug: 'site-settings',
  label: 'Sajtinställningar',
  admin: {
    description: 'Namn, kontaktuppgifter, sociala medier och vilka moduler som visas.',
    group: 'Inställningar',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Allmänt',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              label: 'Sajtens namn',
              required: true,
              maxLength: 80,
              defaultValue: 'Chelsea Supporters Sweden',
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Slogan',
              maxLength: 140,
              defaultValue: 'Sveriges Chelsea-supportrar sedan 1991',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Beskrivning',
              maxLength: 300,
              admin: {
                description: 'Används av Google och när sajten delas i sociala medier.',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logotyp',
            },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'email',
              type: 'email',
              label: 'E-post',
              defaultValue: 'info@chelseasweden.se',
            },
            {
              name: 'orgNumber',
              type: 'text',
              label: 'Organisationsnummer',
              maxLength: 20,
            },
            {
              name: 'membershipFee',
              type: 'text',
              label: 'Medlemsavgift',
              maxLength: 80,
              admin: { description: 'T.ex. "250 kr per år". Visas på medlemssidan.' },
            },
            {
              name: 'swish',
              type: 'text',
              label: 'Swish-nummer',
              maxLength: 30,
              admin: { description: 'Visas i instruktionerna för att betala medlemsavgiften.' },
            },
            {
              name: 'bankgiro',
              type: 'text',
              label: 'Bankgiro',
              maxLength: 30,
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Sociala medier',
              labels: { singular: 'Länk', plural: 'Länkar' },
              maxRows: 10,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  label: 'Kanal',
                  required: true,
                  options: [
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'X', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Discord', value: 'discord' },
                    { label: 'Spotify', value: 'spotify' },
                    { label: 'Annat', value: 'other' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Adress',
                  required: true,
                  validate: urlValidation,
                },
              ],
            },
          ],
        },
        {
          label: 'Startsidan',
          description: 'Slå av och på modulerna på startsidan.',
          fields: [
            {
              name: 'showChelseaNews',
              type: 'checkbox',
              label: 'Visa nyheter från chelseafc.com',
              defaultValue: true,
            },
            {
              name: 'showPodcast',
              type: 'checkbox',
              label: 'Visa ChelseaPodden',
              defaultValue: true,
            },
            {
              name: 'showSvenskaFans',
              type: 'checkbox',
              label: 'Visa våra äldre artiklar från SvenskaFans',
              defaultValue: false,
              admin: {
                description:
                  'Under övergången kan vi visa arkivet från SvenskaFans. Slå av den här när allt innehåll flyttat hit.',
              },
            },
            {
              name: 'announcement',
              type: 'group',
              label: 'Meddelanderad',
              admin: {
                description: 'En rad högst upp på sajten, t.ex. inför en resa eller ett årsmöte.',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Visa meddelanderaden',
                  defaultValue: false,
                },
                {
                  name: 'text',
                  type: 'text',
                  label: 'Text',
                  maxLength: 160,
                },
                {
                  name: 'linkLabel',
                  type: 'text',
                  label: 'Länktext',
                  maxLength: 40,
                },
                {
                  name: 'linkUrl',
                  type: 'text',
                  label: 'Länk',
                  admin: { description: 'Intern länk som /sv/evenemang eller full https://-adress.' },
                },
              ],
            },
          ],
        },
        {
          label: 'Externt',
          fields: [
            {
              name: 'forumUrl',
              type: 'text',
              label: 'Länk till forumet (The Shed)',
              defaultValue: 'https://www.svenskafans.com/fotboll/lag/chelsea/forum',
              validate: urlValidation,
            },
            {
              name: 'podcastUrl',
              type: 'text',
              label: 'ChelseaPodden på Spotify',
              defaultValue: 'https://open.spotify.com/show/5Jk5cKJ90z2QPlj0CDtWBK',
              validate: urlValidation,
            },
            {
              name: 'fplLeagueUrl',
              type: 'text',
              label: 'Länk till FPL-ligan',
              admin: { description: 'Valfritt. Länk till Fantasy Premier League-ligan.' },
              validate: (value: unknown) => (value ? urlValidation(value) : true),
            },
          ],
        },
      ],
    },
  ],
} satisfies GlobalConfig)
