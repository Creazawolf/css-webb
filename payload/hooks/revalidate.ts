import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import type { GlobalAfterChangeHook } from 'payload'

/**
 * Rensar Next-cachen när innehåll ändras i CMS:et.
 *
 * Utan det här skulle en redaktör publicera en artikel och sedan undra varför
 * den inte syns — sidorna är cachade i 5–60 minuter. Nu slår ändringen
 * igenom direkt, samtidigt som besökare fortsätter få cachade svar.
 */

const LOCALES = ['sv', 'en'] as const

function revalidateForAllLocales(paths: string[]): void {
  for (const locale of LOCALES) {
    for (const path of paths) {
      revalidatePath(`/${locale}${path}`)
    }
  }
}

/** Startsidan och listorna påverkas av nästan allt innehåll. */
function revalidateCommon(): void {
  revalidateForAllLocales(['', '/artiklar'])
}

export const revalidatePost: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  revalidateCommon()

  if (typeof doc?.slug === 'string' && doc.slug) {
    revalidateForAllLocales([`/artiklar/${doc.slug}`])
  }

  // Bytte artikeln slug? Rensa även den gamla adressen.
  if (
    typeof previousDoc?.slug === 'string' &&
    previousDoc.slug &&
    previousDoc.slug !== doc?.slug
  ) {
    revalidateForAllLocales([`/artiklar/${previousDoc.slug}`])
  }

  if (typeof doc?.articleType === 'string') {
    revalidateForAllLocales([`/artiklar/typ/${doc.articleType}`])
  }

  return doc
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateCommon()
  if (typeof doc?.slug === 'string' && doc.slug) {
    revalidateForAllLocales([`/artiklar/${doc.slug}`])
  }
  return doc
}

export const revalidatePage: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  if (typeof doc?.slug === 'string' && doc.slug) {
    revalidateForAllLocales([`/${doc.slug}`])
  }
  if (
    typeof previousDoc?.slug === 'string' &&
    previousDoc.slug &&
    previousDoc.slug !== doc?.slug
  ) {
    revalidateForAllLocales([`/${previousDoc.slug}`])
  }
  return doc
}

export const revalidateEvents: CollectionAfterChangeHook = ({ doc }) => {
  revalidateForAllLocales(['', '/evenemang'])
  return doc
}

export const revalidateVenues: CollectionAfterChangeHook = ({ doc }) => {
  revalidateForAllLocales(['/motesplatser'])
  return doc
}

export const revalidateUsers: CollectionAfterChangeHook = ({ doc }) => {
  revalidateForAllLocales(['/redaktionen'])
  return doc
}

/** Meny och sajtinställningar ligger i layouten — allt måste rensas. */
export const revalidateEverything: GlobalAfterChangeHook = ({ doc }) => {
  // Meny och inställningar renderas i layouten, så hela trädet måste bort.
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`, 'layout')
  }
  return doc
}

/**
 * Tvingar fram ny matchdata. Rensar sidorna snarare än fetch-taggarna:
 * Next 16 kräver en cache-profil till revalidateTag, och sidorna är ändå
 * det som besökaren ser.
 */
export function revalidateFootballData(): void {
  revalidateForAllLocales(['', '/matcher', '/matcher/spelschema', '/matcher/tabell'])
}
