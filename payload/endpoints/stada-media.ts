import { timingSafeEqual } from 'node:crypto'
import type { Endpoint, PayloadRequest, Payload } from 'payload'

/**
 * Städar mediabiblioteket.
 *
 * Den första SvenskaFans-importen kände igen en redan hämtad bild på artikelns
 * rubrik. Två artiklar med olika rubriker men samma bild laddade därför ned var
 * sin kopia, och biblioteket fick 104 filer där 55 räcker. Dessutom ligger nio
 * platshållarbilder kvar sedan demoartiklarna togs bort.
 *
 * Körningen är en torrkörning som standard. Först med `&utfor=ja` ändras något.
 */
const isAuthorised = (req: PayloadRequest): boolean => {
  const expected = process.env.IMPORT_SECRET?.trim()
  // Utan hemlighet i miljön är endpointen stängd.
  if (!expected) return false
  const given = req.headers.get('x-import-secret')?.trim()
  if (!given) return false
  const a = Buffer.from(given)
  const b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Fältnamn som håller en bildreferens någonstans i innehållet. */
const IMAGE_KEYS = new Set(['featuredImage', 'heroImage', 'image', 'logo', 'avatar', 'ogImage'])

type Ref = { collection: string; id: number | string; path: string[] }

/**
 * Går igenom ett dokument och plockar ut varje bildreferens med sin väg.
 *
 * Letar på fältnamn och på Lexicals uppladdningsnoder i stället för på alla tal
 * i dokumentet — ett id till en kategori eller en skribent ser likadant ut som
 * ett bild-id, och att förväxla dem vore att peka om fel fält.
 */
function collectRefs(
  node: unknown,
  collection: string,
  id: number | string,
  path: string[],
  out: Map<number, Ref[]>,
): void {
  if (Array.isArray(node)) {
    node.forEach((item, i) => collectRefs(item, collection, id, [...path, String(i)], out))
    return
  }
  if (!node || typeof node !== 'object') return

  const record = node as Record<string, unknown>

  // Lexical bäddar in bilder som en uppladdningsnod.
  if (record.type === 'upload' && record.relationTo === 'media') {
    const value = typeof record.value === 'object' && record.value !== null
      ? (record.value as { id?: number }).id
      : record.value
    if (typeof value === 'number') {
      out.set(value, [...(out.get(value) ?? []), { collection, id, path: [...path, 'value'] }])
    }
  }

  for (const [key, value] of Object.entries(record)) {
    if (IMAGE_KEYS.has(key)) {
      const mediaId = typeof value === 'object' && value !== null
        ? (value as { id?: number }).id
        : value
      if (typeof mediaId === 'number') {
        out.set(mediaId, [...(out.get(mediaId) ?? []), { collection, id, path: [...path, key] }])
        continue
      }
    }
    collectRefs(value, collection, id, [...path, key], out)
  }
}

const COLLECTIONS = ['posts', 'pages', 'events', 'venues', 'users'] as const

async function buildReferenceMap(payload: Payload): Promise<Map<number, Ref[]>> {
  const refs = new Map<number, Ref[]>()

  for (const collection of COLLECTIONS) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 0,
      pagination: false,
      draft: true,
      overrideAccess: true,
    })
    for (const doc of result.docs) {
      collectRefs(doc, collection, (doc as { id: number }).id, [], refs)
    }
  }

  const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
  collectRefs(settings, 'site-settings', 0, [], refs)

  return refs
}

/** Sätter ett värde djupt i ett objekt längs en väg. */
function setAtPath(root: Record<string, unknown>, path: string[], value: number): void {
  let node: Record<string, unknown> = root
  for (const step of path.slice(0, -1)) {
    const next = node[step]
    if (!next || typeof next !== 'object') return
    node = next as Record<string, unknown>
  }
  const last = path[path.length - 1]
  if (last !== undefined) node[last] = value
}

const stemOf = (filename: string): string => filename.replace(/-\d+(?=\.\w+$)/, '')

export const stadaMedia: Endpoint = {
  path: '/stada-media',
  method: 'post',
  handler: async (req) => {
    if (!isAuthorised(req)) {
      return Response.json({ error: 'Ej behörig.' }, { status: 401 })
    }

    const url = new URL(req.url ?? '', 'http://localhost')
    const execute = url.searchParams.get('utfor') === 'ja'

    const media = await req.payload.find({
      collection: 'media',
      depth: 0,
      limit: 0,
      pagination: false,
      overrideAccess: true,
    })
    const refs = await buildReferenceMap(req.payload)

    // Bara filer som är identiska slås ihop: samma namn, samma storlek, samma
    // mått. De nio platshållarna heter likadant men är nio olika bilder, och
    // att slå ihop dem vore att byta ut innehåll, inte att städa.
    const groups = new Map<string, Array<{ id: number; filename: string }>>()
    for (const doc of media.docs) {
      const filename = typeof doc.filename === 'string' ? doc.filename : ''
      if (!filename) continue
      const key = `${stemOf(filename)}|${doc.filesize}|${doc.width}|${doc.height}`
      groups.set(key, [...(groups.get(key) ?? []), { id: doc.id, filename }])
    }

    const repoints: Array<{ from: number; to: number; ref: Ref }> = []
    const mergeAway: number[] = []

    for (const copies of groups.values()) {
      if (copies.length < 2) continue
      const sorted = [...copies].sort((a, b) => a.id - b.id)
      const canonical = sorted[0]
      if (!canonical) continue
      for (const copy of sorted.slice(1)) {
        mergeAway.push(copy.id)
        for (const ref of refs.get(copy.id) ?? []) {
          repoints.push({ from: copy.id, to: canonical.id, ref })
        }
      }
    }

    // Platshållarna kom med demoartiklarna, som är borttagna. De tas bort bara
    // om ingenting pekar på dem — en bild som någon faktiskt använder får stå
    // kvar även om den heter placeholder.
    const orphans = media.docs
      .filter((doc) => {
        const filename = typeof doc.filename === 'string' ? doc.filename : ''
        return filename.startsWith('placeholder') && (refs.get(doc.id) ?? []).length === 0
      })
      .map((doc) => doc.id)

    const plan = {
      media: media.docs.length,
      slasSamman: mergeAway.length,
      pekasOm: repoints.length,
      platshallare: orphans.length,
      kvarEfterat: media.docs.length - mergeAway.length - orphans.length,
    }

    if (!execute) {
      return Response.json({
        torrkorning: true,
        plan,
        exempel: repoints.slice(0, 8).map((r) => `${r.ref.collection}#${r.ref.id} ${r.ref.path.join('.')}: ${r.from} → ${r.to}`),
      })
    }

    // Peka om först. Ingen fil tas bort förrän allt som pekade på den pekar
    // någon annanstans — annars står en artikel utan bild om något går fel
    // halvvägs.
    const touched = new Map<string, Record<string, unknown>>()
    for (const { to, ref } of repoints) {
      const cacheKey = `${ref.collection}:${ref.id}`
      let doc = touched.get(cacheKey)
      if (!doc) {
        doc = ref.collection === 'site-settings'
          ? ((await req.payload.findGlobal({ slug: 'site-settings', depth: 0 })) as unknown as Record<string, unknown>)
          : ((await req.payload.findByID({
              collection: ref.collection as (typeof COLLECTIONS)[number],
              id: ref.id,
              depth: 0,
              draft: true,
              overrideAccess: true,
            })) as unknown as Record<string, unknown>)
        touched.set(cacheKey, doc)
      }
      setAtPath(doc, ref.path, to)
    }

    const written: string[] = []
    for (const [cacheKey, doc] of touched) {
      const [collection, rawId] = cacheKey.split(':') as [string, string]
      if (collection === 'site-settings') {
        await req.payload.updateGlobal({ slug: 'site-settings', data: doc, overrideAccess: true })
      } else {
        await req.payload.update({
          collection: collection as (typeof COLLECTIONS)[number],
          id: Number(rawId),
          data: doc,
          overrideAccess: true,
        })
      }
      written.push(cacheKey)
    }

    const removed: number[] = []
    for (const id of [...mergeAway, ...orphans]) {
      try {
        await req.payload.delete({ collection: 'media', id, overrideAccess: true })
        removed.push(id)
      } catch (err) {
        req.payload.logger.error(`Kunde inte ta bort media ${id}: ${(err as Error).message}`)
      }
    }

    return Response.json({ torrkorning: false, plan, uppdaterade: written.length, borttagna: removed.length })
  },
}
