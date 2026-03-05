/**
 * Seed script: creates categories, a system user, placeholder images,
 * and mock news posts based on recent Chelsea FC news (Feb–Mar 2026).
 *
 * Run: npx tsx scripts/seed-news.ts
 */
import { getPayload } from 'payload'
import config from '../payload.config'

async function downloadPlaceholder(
  width: number,
  height: number,
  seed: number,
): Promise<{ data: Buffer; name: string }> {
  const url = `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`
  const res = await fetch(url, { redirect: 'follow' })
  if (!res.ok) throw new Error(`Failed to download image: ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return {
    data: Buffer.from(arrayBuffer),
    name: `placeholder-${seed}.jpg`,
  }
}

async function seed() {
  const payload = await getPayload({ config })

  // 1. Ensure we have an author user
  const existingUsers = await payload.find({
    collection: 'users',
    limit: 1,
    overrideAccess: true,
  })

  let authorId: number
  if (existingUsers.docs.length > 0) {
    authorId = existingUsers.docs[0]!.id
    console.log(`Using existing user: ${existingUsers.docs[0]!.email} (id: ${authorId})`)
  } else {
    const user = await payload.create({
      collection: 'users',
      overrideAccess: true,
      draft: false,
      data: {
        email: 'redaktion@chelseafc.se',
        password: 'CssAdmin2026!',
        name: 'CSS Redaktionen',
        role: 'admin',
      },
    })
    authorId = user.id
    console.log(`Created user: ${user.email} (id: ${authorId})`)
  }

  // 2. Create categories
  const categoryNames = ['Nyheter', 'Matcher', 'Resor', 'Evenemang', 'Transfers']
  const categoryMap = new Map<string, number>()

  for (const name of categoryNames) {
    const existing = await payload.find({
      collection: 'categories',
      where: { name: { equals: name } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      categoryMap.set(name, existing.docs[0]!.id)
      console.log(`Category "${name}" exists (id: ${existing.docs[0]!.id})`)
    } else {
      const cat = await payload.create({
        collection: 'categories',
        overrideAccess: true,
        draft: false,
        data: { name, slug: name.toLowerCase().replace(/[åä]/g, 'a').replace(/ö/g, 'o').replace(/\s+/g, '-') },
      })
      categoryMap.set(name, cat.id)
      console.log(`Created category: "${name}" (id: ${cat.id})`)
    }
  }

  // 3. Download placeholder images and create media entries
  console.log('\nDownloading placeholder images...')
  const mediaIds: number[] = []
  const imageAlts = [
    'Arsenal vs Chelsea på Emirates Stadium',
    'Liam Rosenior på presskonferens',
    'Chelsea i Champions League',
    'IFS sponsor Chelsea tröja',
    'CSS-resa till London',
    'Premier League tabell',
    'Pubkväll med CSS i Stockholm',
    'Chelsea transfernyheter',
    'Rosenior Chelsea debut',
  ]

  for (let i = 0; i < 9; i++) {
    const img = await downloadPlaceholder(800, 600, 100 + i)
    const media = await payload.create({
      collection: 'media',
      overrideAccess: true,
      draft: false,
      data: {
        alt: imageAlts[i]!,
      },
      file: {
        data: img.data,
        mimetype: 'image/jpeg',
        name: img.name,
        size: img.data.length,
      },
    })
    mediaIds.push(media.id)
    console.log(`Created media: "${imageAlts[i]}" (id: ${media.id})`)
  }

  // 4. Create posts
  const posts = [
    {
      title: 'Arsenal 2–1 Chelsea: Bittert derby på Emirates',
      excerpt:
        'Chelsea föll mot Arsenal på Emirates Stadium efter två hörnmål av Timber och Saliba. Pedro Neto fick rött kort — lagets sjunde utvisning i ligan denna säsong.',
      category: 'Matcher',
      publishedAt: '2026-03-01T22:00:00.000Z',
      seo: {
        metaTitle: 'Arsenal 2–1 Chelsea: Matchreferat från Emirates',
        metaDescription:
          'Chelsea föll mot Arsenal på Emirates Stadium. Timber och Saliba avgjorde med hörnmål. Läs hela matchreferatet från London-derbyt.',
      },
    },
    {
      title: 'Rosenior: "Vi måste förbättra disciplinen"',
      excerpt:
        'Chelsea-managern Liam Rosenior pekar ut två nyckelfaktorer som laget måste förbättra — disciplin och försvar vid fasta situationer — för att hänga med i topp fyra-racet.',
      category: 'Nyheter',
      publishedAt: '2026-03-01T18:30:00.000Z',
      seo: {
        metaTitle: 'Rosenior kräver bättre disciplin av Chelsea',
        metaDescription:
          'Liam Rosenior identifierar disciplin och fasta situationer som nyckelområden inför vårsäsongen. Liverpool leder med tre poäng.',
      },
    },
    {
      title: 'Champions League: Chelsea ställs mot PSG i åttondelen',
      excerpt:
        'Chelsea har lottats mot titelhållarna Paris Saint-Germain i Champions League-slutspelet. Rosenior har erfarenhet av PSG från sin tid i Strasbourg.',
      category: 'Matcher',
      publishedAt: '2026-02-28T14:00:00.000Z',
      seo: {
        metaTitle: 'Chelsea möter PSG i Champions League-åttondelen',
        metaDescription:
          'Lottningen är klar: Chelsea ställs mot titelhållarna PSG i Champions League. Rosenior slog PSG med Strasbourg i Ligue 1.',
      },
    },
    {
      title: 'IFS ny huvudsponsor — loggan på tröjan resten av säsongen',
      excerpt:
        'Chelsea presenterar ett flerårigt globalt partnerskap med teknikföretaget IFS. Logotypen syns på herrlagets och damlagets tröjor från och med nu.',
      category: 'Nyheter',
      publishedAt: '2026-02-20T10:00:00.000Z',
      seo: {
        metaTitle: 'IFS blir Chelseas nya huvudsponsor resten av säsongen',
        metaDescription:
          'Chelsea har ingått ett flerårigt avtal med AI-företaget IFS som ny tröjsponsor för resten av 2025/26-säsongen.',
      },
    },
    {
      title: 'Resegrupp till London: PSG-matchen i mars',
      excerpt:
        'CSS ordnar resa till Stamford Bridge för Champions League-åttondelsfinalen mot PSG. Begränsat antal platser — anmäl dig senast 10 mars.',
      category: 'Resor',
      publishedAt: '2026-02-27T08:00:00.000Z',
      seo: {
        metaTitle: 'CSS-resa till Chelsea vs PSG i Champions League',
        metaDescription:
          'Boka din plats på CSS-resan till Stamford Bridge för Chelsea mot PSG. Begränsat antal platser, anmälan stänger 10 mars.',
      },
    },
    {
      title: 'Topp fyra-racet: Så ser tabellsituationen ut',
      excerpt:
        'Liverpool leder med tre poäng före Chelsea, medan Aston Villa och Manchester United ligger ytterligare tre poäng framför. Vi analyserar slutspurten.',
      category: 'Nyheter',
      publishedAt: '2026-02-26T16:00:00.000Z',
      seo: {
        metaTitle: 'Premier League: Chelseas väg till topp fyra',
        metaDescription:
          'Vi analyserar tabellsituationen i Premier League. Liverpool, Aston Villa och Man United är Chelseas största konkurrenter om CL-platserna.',
      },
    },
    {
      title: 'Pubkväll på The Aston i Stockholm — Chelsea vs PSG',
      excerpt:
        'CSS bjuder in till pubkväll för att se Champions League-åttondelen mot PSG. Vi ses på The Aston, Norrlandsgatan 21, onsdagen den 12 mars.',
      category: 'Evenemang',
      publishedAt: '2026-02-25T12:00:00.000Z',
      seo: {
        metaTitle: 'Pubkväll: Chelsea vs PSG med CSS i Stockholm',
        metaDescription:
          'Se Champions League med Chelsea Supporters Sweden på The Aston i Stockholm. Chelsea möter PSG den 12 mars.',
      },
    },
    {
      title: 'Transferfönstret: Chalobah kan lämna — Nmecha intresserar',
      excerpt:
        'Chelsea uppges vara öppna för att sälja Trevoh Chalobah i sommar. Samtidigt fortsätter intresset för Dortmunds Felix Nmecha och målvakten Bart Verbruggen.',
      category: 'Transfers',
      publishedAt: '2026-02-22T09:00:00.000Z',
      seo: {
        metaTitle: 'Chelsea-transfers: Chalobah ut, Nmecha in kanske',
        metaDescription:
          'Chelsea kan sälja Trevoh Chalobah i sommar. Felix Nmecha och Bart Verbruggen finns på önskelistan. Senaste transfernyheterna.',
      },
    },
    {
      title: 'Rosenior hyllas efter starten: "Bästa sedan Conte"',
      excerpt:
        'Liam Rosenior inledde sitt Chelsea-äventyr med en 5–1-seger mot Charlton i FA-cupen — den bästa debuten sedan Antonio Conte 2016. Vi sammanfattar hans första veckor.',
      category: 'Nyheter',
      publishedAt: '2026-02-18T11:00:00.000Z',
      seo: {
        metaTitle: 'Roseniors Chelsea-start den bästa sedan Conte',
        metaDescription:
          'Liam Rosenior öppnade med 5-1 mot Charlton i FA-cupen — första Chelsea-managern att vinna debuten sedan Conte. Läs om hans första veckor.',
      },
    },
  ]

  let created = 0
  for (let i = 0; i < posts.length; i++) {
    const postData = posts[i]!
    // Check if a post with same title already exists
    const existing = await payload.find({
      collection: 'posts',
      where: { title: { equals: postData.title } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.docs.length > 0) {
      console.log(`Post already exists: "${postData.title}"`)
      continue
    }

    const catId = categoryMap.get(postData.category)
    if (!catId) {
      console.warn(`Category "${postData.category}" not found, skipping "${postData.title}"`)
      continue
    }

    await payload.create({
      collection: 'posts',
      overrideAccess: true,
      draft: false,
      data: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: postData.excerpt, version: 1 }],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
        featuredImage: mediaIds[i]!,
        category: catId,
        author: authorId,
        status: 'published',
        publishedAt: postData.publishedAt,
        seo: postData.seo,
      } as any,
    })
    created++
    console.log(`Created post: "${postData.title}"`)
  }

  console.log(`\nDone! Created ${created} posts, ${mediaIds.length} media, ${categoryMap.size} categories.`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
