/**
 * Grundinnehåll för en ny installation.
 *
 * Skapar sajtinställningar, meny, kategorier och de fasta sidorna (Om oss,
 * Biljetter, Arenaguide, Reseguide, FPL) så att redaktörerna möts av något
 * att redigera istället för ett tomt CMS. Skriptet är idempotent — det
 * hoppar över allt som redan finns och skriver aldrig över befintlig text.
 *
 * Kör: pnpm seed
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from '../payload.config'

/** Bygger ett minimalt Lexical-dokument av vanliga textstycken. */
function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

const CATEGORIES = [
  { name: 'Herrar', description: 'Chelseas herrlag.' },
  { name: 'Damer', description: 'Chelsea Women.' },
  { name: 'Föreningen', description: 'Nytt från Chelsea Supporters Sweden.' },
  { name: 'Transfers', description: 'Övergångar och rykten.' },
  { name: 'Akademin', description: 'Talangerna från Cobham.' },
]

type SeedPage = {
  slug: string
  title: string
  intro: string
  paragraphs: string[]
}

const PAGES: SeedPage[] = [
  {
    slug: 'om-oss',
    title: 'Om oss',
    intro:
      'Chelsea Supporters Sweden är den officiella svenska supporterföreningen för Chelsea FC.',
    paragraphs: [
      'Chelsea Supporters Sweden samlar Chelsea-supportrar från hela Sverige. Vi ordnar pubkvällar, resor till London och träffar där vi ser matcherna tillsammans — och vi skriver om laget på svenska, av och för supportrar.',
      'Föreningen drivs helt ideellt. Allt du läser här är skrivet av medlemmar på fritiden, för att vi tycker att Chelsea förtjänar en egen svensk hemvist på nätet.',
      'Den här texten är en startpunkt — redigera den i adminpanelen under Innehåll → Sidor så att den berättar er historia med era egna ord.',
    ],
  },
  {
    slug: 'biljetter',
    title: 'Biljetter',
    intro:
      'Så funkar det när du vill se Chelsea på Stamford Bridge — via föreningen eller på egen hand.',
    paragraphs: [
      'Som medlem i Chelsea Supporters Sweden får du tillgång till föreningens biljettsläpp. Vi samlar in intresseanmälningar inför varje match och fördelar de biljetter vi får.',
      'Fyll på med aktuell information här: hur medlemmar anmäler intresse, vilka matcher som är öppna, priser och sista anmälningsdag.',
    ],
  },
  {
    slug: 'arenaguide',
    title: 'Arenaguide',
    intro: 'Allt du behöver veta inför ditt besök på Stamford Bridge.',
    paragraphs: [
      'Stamford Bridge ligger i Fulham i västra London. Närmaste tunnelbanestation är Fulham Broadway på District Line, ungefär fem minuters promenad från arenan.',
      'Skriv gärna ihop era bästa tips här: var man äter innan matchen, vilka pubar som är värda ett besök, hur man tar sig dit och vad man ska tänka på vid insläppet.',
    ],
  },
  {
    slug: 'reseguide',
    title: 'Reseguide',
    intro: 'Tips inför Londonresan — flyg, boende och att ta sig runt.',
    paragraphs: [
      'Att se Chelsea live är för många höjdpunkten på säsongen. Här samlar vi föreningens samlade erfarenhet av att resa till London.',
      'Fyll på med tips om flygbolag och avgångar, vilka områden som är bra att bo i, hur Oyster-kortet fungerar och vad en helg i London brukar kosta.',
    ],
  },
  {
    slug: 'fpl',
    title: 'CSS FPL-liga',
    intro: 'Föreningens egen liga i Fantasy Premier League.',
    paragraphs: [
      'Varje säsong kör vi en egen liga i Fantasy Premier League. Alla medlemmar är välkomna att vara med — det kostar inget och är öppet hela säsongen.',
      'Lägg in ligans kod och länk här, tillsammans med reglerna och vad vinnaren får.',
    ],
  },
]

const NAV_ITEMS = [
  { label: 'Löpsedel', link: '/', children: [] },
  {
    label: 'Artiklar',
    link: '/artiklar',
    children: [
      { label: 'Alla artiklar', link: '/artiklar' },
      { label: 'Matchreferat', link: '/artiklar/typ/referat' },
      { label: 'Spelarbetyg', link: '/artiklar/typ/spelarbetyg' },
      { label: 'Inför match', link: '/artiklar/typ/infor' },
      { label: 'Krönikor', link: '/artiklar/typ/kronika' },
    ],
  },
  {
    label: 'Matcher',
    link: '/matcher',
    children: [
      { label: 'Spelschema', link: '/matcher/spelschema' },
      { label: 'Tabell', link: '/matcher/tabell' },
    ],
  },
  {
    label: 'Föreningen',
    link: '/om-oss',
    children: [
      { label: 'Om oss', link: '/om-oss' },
      { label: 'Redaktionen', link: '/redaktionen' },
      { label: 'Evenemang', link: '/evenemang' },
      { label: 'Mötesplatser', link: '/motesplatser' },
      { label: 'Kontakt', link: '/kontakt' },
    ],
  },
  {
    label: 'Guider',
    link: '/biljetter',
    children: [
      { label: 'Biljetter', link: '/biljetter' },
      { label: 'Arenaguide', link: '/arenaguide' },
      { label: 'Reseguide', link: '/reseguide' },
      { label: 'FPL-ligan', link: '/fpl' },
    ],
  },
  { label: 'Podden', link: '/podden', children: [] },
  // Medlemskap ligger inte i menyraden — "Bli medlem"-knappen till höger går
  // till samma sida, och två ingångar bredvid varandra tar bara plats från de
  // poster som inte har någon annan väg in.
]

async function seedCategories(payload: Payload): Promise<void> {
  for (const category of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { name: { equals: category.name } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      console.log(`  – Kategori "${category.name}" finns redan`)
      continue
    }

    await payload.create({
      collection: 'categories',
      overrideAccess: true,
      data: category,
    })
    console.log(`  ✓ Kategori "${category.name}"`)
  }
}

async function seedPages(payload: Payload): Promise<void> {
  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    if (existing.docs.length > 0) {
      console.log(`  – Sidan "${page.title}" finns redan`)
      continue
    }

    await payload.create({
      collection: 'pages',
      overrideAccess: true,
      data: {
        title: page.title,
        slug: page.slug,
        intro: page.intro,
        _status: 'published',
        content: [
          {
            blockType: 'richTextBlock',
            body: richText(page.paragraphs),
          },
        ],
      },
    })
    console.log(`  ✓ Sidan "${page.title}"`)
  }
}

async function seedGlobals(payload: Payload): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

  if (settings?.siteName && settings.description) {
    console.log('  – Sajtinställningar redan ifyllda')
  } else {
    await payload.updateGlobal({
      slug: 'site-settings',
      overrideAccess: true,
      data: {
        siteName: 'Chelsea Supporters Sweden',
        tagline: 'Sveriges Chelsea-supportrar',
        description:
          'Chelsea Supporters Sweden är den svenska supporterföreningen för Chelsea FC. Matchreferat, spelarbetyg, podd, resor och pubkvällar i hela landet.',
        email: 'info@chelseasweden.se',
        showChelseaNews: true,
        showPodcast: true,
        showSvenskaFans: false,
        forumUrl: 'https://www.svenskafans.com/fotboll/lag/chelsea/forum',
        podcastUrl: 'https://open.spotify.com/show/5Jk5cKJ90z2QPlj0CDtWBK',
      },
    })
    console.log('  ✓ Sajtinställningar')
  }

  const nav = await payload.findGlobal({ slug: 'navigation', overrideAccess: true })

  if (nav?.items && nav.items.length > 0) {
    console.log('  – Menyn är redan ifylld')
  } else {
    await payload.updateGlobal({
      slug: 'navigation',
      overrideAccess: true,
      data: {
        items: NAV_ITEMS.map((item) => ({
          label: item.label,
          link: item.link,
          external: false,
          children: item.children.map((child) => ({
            label: child.label,
            link: child.link,
            external: false,
          })),
        })),
        footerColumns: [
          {
            title: 'Innehåll',
            links: [
              { label: 'Artiklar', link: '/artiklar', external: false },
              { label: 'Matchreferat', link: '/artiklar/typ/referat', external: false },
              { label: 'Spelarbetyg', link: '/artiklar/typ/spelarbetyg', external: false },
              { label: 'ChelseaPodden', link: '/podden', external: false },
            ],
          },
          {
            title: 'Matcher',
            links: [
              { label: 'Spelschema', link: '/matcher/spelschema', external: false },
              { label: 'Tabell', link: '/matcher/tabell', external: false },
              { label: 'Mötesplatser', link: '/motesplatser', external: false },
              { label: 'Biljetter', link: '/biljetter', external: false },
            ],
          },
          {
            title: 'Föreningen',
            links: [
              { label: 'Bli medlem', link: '/medlemskap', external: false },
              { label: 'Evenemang', link: '/evenemang', external: false },
              { label: 'Om oss', link: '/om-oss', external: false },
              { label: 'Redaktionen', link: '/redaktionen', external: false },
              { label: 'Kontakt', link: '/kontakt', external: false },
            ],
          },
        ],
      },
    })
    console.log('  ✓ Meny och sidfot')
  }
}

async function seed(): Promise<void> {
  const payload = await getPayload({ config })

  console.log('\nKategorier')
  await seedCategories(payload)

  console.log('\nSidor')
  await seedPages(payload)

  console.log('\nInställningar')
  await seedGlobals(payload)

  const users = await payload.count({ collection: 'users', overrideAccess: true })
  if (users.totalDocs === 0) {
    console.log(
      '\nInga användare finns ännu. Öppna /admin så får du skapa den första administratören.',
    )
  }

  console.log('\nKlart.\n')
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed misslyckades:', error)
  process.exit(1)
})
