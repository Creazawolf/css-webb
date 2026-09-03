import type { CollectionConfig } from 'payload'

import { defineCollection, isAdmin, isAdminField, isLoggedIn } from './_shared'

/**
 * Redaktionen. Rollen styr vad man kommer åt:
 *  - admin    — allt, inklusive medlemsregister och inbjudningar
 *  - editor   — skriva, publicera och ladda upp bilder
 */
export const Users = defineCollection({
  slug: 'users',
  labels: {
    singular: 'Användare',
    plural: 'Användare',
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 7,
    verify: false,
    maxLoginAttempts: 10,
    lockTime: 10 * 60 * 1000,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'showInTeam'],
    description: 'Redaktörer och administratörer som kan logga in.',
    group: 'Föreningen',
  },
  access: {
    create: isAdmin,
    read: isLoggedIn,
    update: isAdmin,
    delete: isAdmin,
    // Låt redaktörer uppdatera sin egen profil via kontosidan i admin.
    admin: ({ req }) => {
      const role = (req.user as { role?: string } | null)?.role
      return role === 'admin' || role === 'editor'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Namn',
      required: true,
      maxLength: 120,
      validate: (value: unknown) => {
        if (typeof value !== 'string' || value.trim().length < 2) {
          return 'Namnet måste vara minst 2 tecken.'
        }
        return true
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Behörighet',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administratör', value: 'admin' },
        { label: 'Redaktör', value: 'editor' },
      ],
      admin: {
        description:
          'Redaktörer kan skriva, publicera och ladda upp bilder. Administratörer kan dessutom bjuda in fler och se medlemsregistret.',
      },
      access: {
        create: isAdminField,
        update: isAdminField,
      },
    },

    // --- Presentation på sidan "Redaktionen" ---
    {
      name: 'showInTeam',
      type: 'checkbox',
      label: 'Visa på sidan Redaktionen',
      defaultValue: true,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Roll i föreningen',
      maxLength: 80,
      admin: {
        description: 'T.ex. "Ordförande", "Skribent" eller "Poddredaktör".',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      label: 'Kort presentation',
      maxLength: 400,
      admin: {
        description: 'Visas på sidan Redaktionen och under dina artiklar.',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Porträttbild',
    },
    {
      name: 'supporterSince',
      type: 'number',
      label: 'Chelsea-supporter sedan',
      min: 1905,
      max: 2100,
      admin: {
        description: 'Årtal, t.ex. 1997.',
        step: 1,
      },
    },
  ],
} satisfies CollectionConfig)
