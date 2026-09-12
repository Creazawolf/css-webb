/**
 * Taggar för Next datacache.
 *
 * Ligger i en egen fil utan beroenden med flit. Både `lib/posts.ts` och
 * `payload/hooks/revalidate.ts` behöver dem, och hookarna når annars
 * payload-konfigurationen via posts.ts — en cirkel som gör att konstanten kan
 * vara oinitierad beroende på i vilken ordning modulerna laddas.
 */

/** Artikellistorna. Rensas när en artikel publiceras, ändras eller tas bort. */
export const POSTS_TAG = 'posts'
