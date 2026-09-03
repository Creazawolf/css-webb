'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'

import type { ApplicationState } from '@/lib/membership-form'

/**
 * Tar emot medlemsansökningar från formuläret.
 *
 * Members-samlingen har `create: isAdmin`, så inget kan skrivas via det
 * publika REST-API:t. Den här serveråtgärden är den enda vägen in, och den
 * använder `overrideAccess` medvetet efter att ha validerat indata.
 */

const ApplicationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Skriv ditt namn.')
    .max(120, 'Namnet är för långt.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Kontrollera e-postadressen.')
    .max(200),
  phone: z
    .string()
    .trim()
    .max(20)
    .regex(/^[+]?[0-9\s-]{7,20}$/, 'Kontrollera telefonnumret.')
    .optional()
    .or(z.literal('')),
  city: z.string().trim().max(80).optional().or(z.literal('')),
  membershipType: z.enum(['standard', 'familj', 'ungdom']),
  message: z.string().trim().max(1000).optional().or(z.literal('')),
  newsletter: z.boolean(),
  // Honungsfälla: en dold input som människor lämnar tom men bottar fyller i.
  website: z.string().max(0, 'Ogiltig ansökan.').optional().or(z.literal('')),
})

export async function submitMembershipApplication(
  _prev: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const parsed = ApplicationSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    city: formData.get('city') ?? '',
    membershipType: formData.get('membershipType') ?? 'standard',
    message: formData.get('message') ?? '',
    newsletter: formData.get('newsletter') === 'on',
    website: formData.get('website') ?? '',
  })

  if (!parsed.success) {
    const errors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !errors[key]) {
        errors[key] = issue.message
      }
    }
    return {
      status: 'error',
      message: 'Kontrollera uppgifterna nedan.',
      errors,
    }
  }

  const data = parsed.data

  try {
    const payload = await getPayload({ config })

    // Redan medlem eller redan ansökt? Svara som om det gick bra — vi ska inte
    // avslöja vilka adresser som finns i registret.
    const existing = await payload.find({
      collection: 'members',
      where: { email: { equals: data.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'members',
        overrideAccess: true,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          city: data.city || null,
          membershipType: data.membershipType,
          message: data.message || null,
          newsletter: data.newsletter,
          status: 'pending',
          joinedAt: new Date().toISOString(),
        },
      })
    }

    return {
      status: 'success',
      message:
        'Tack! Din ansökan är mottagen. Vi hör av oss till din e-post med betalningsinformation.',
      errors: {},
    }
  } catch (error) {
    console.error('[medlemskap] Kunde inte spara ansökan:', error)
    return {
      status: 'error',
      message:
        'Något gick fel när ansökan skulle sparas. Försök igen, eller mejla oss direkt.',
      errors: {},
    }
  }
}
