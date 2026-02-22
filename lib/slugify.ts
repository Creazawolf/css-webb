/**
 * slugify — konverterar en sträng till en URL-säker slug.
 *
 * Hanterar svenska tecken (å→a, ä→a, ö→o) och normaliserar
 * till gemener med bindestreck.
 *
 * @example
 *   slugify('Matchrapport: Chelsea vs Arsenal!') // 'matchrapport-chelsea-vs-arsenal'
 *   slugify('Säsong 2024/25 – Öppningsdag')      // 'sasong-2024-25-oppningsdag'
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/é|è|ê|ë/g, 'e')
    .replace(/á|à|â/g, 'a')
    .replace(/ú|ù|û/g, 'u')
    .replace(/ó|ò|ô/g, 'o')
    .replace(/ı|ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')   // ta bort tecken utanför a-z, 0-9, mellanslag, bindestreck
    .trim()
    .replace(/[\s_]+/g, '-')         // ersätt mellanslag/understreck med bindestreck
    .replace(/-{2,}/g, '-')          // komprimera multipla bindestreck
    .replace(/^-|-$/g, '')           // ta bort inledande/avslutande bindestreck
}
