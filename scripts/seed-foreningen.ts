/**
 * Föreningens eget innehåll: de fem fasta sidorna, sajtinställningarna,
 * mötesplatserna och de kommande evenemangen.
 *
 * Skriptet är till för att styrelsen ska kunna se sajten med riktig struktur i
 * — därför skrivs texterna på de fem sidorna över vid varje körning, till
 * skillnad från `pnpm seed` som bara fyller tomrum. Kör det alltså innan
 * redaktionen börjat skriva i CMS:et, inte efter.
 *
 * Allt som inte går att veta utifrån står som platshållare inom hakparenteser
 * ([MEDLEMSAVGIFT], [SWISH], [PUBENS NAMN] …). De är avsiktliga: föreningen
 * uppger uppgifterna själv, och en gissning som råkar bli publicerad under
 * föreningens namn är värre än ett tomrum som syns.
 *
 * Kör: pnpm seed:foreningen
 */
import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from '../payload.config'
import type { Event, Page } from '../payload-types'

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

/**
 * Demodatum räknas fram från körningen istället för att skrivas in fast, så
 * att evenemangen alltid ligger i framtiden — annars hamnar de under "Tidigare"
 * på /evenemang och styrelsen ser en tom lista.
 */
function inDays(days: number, hour: number, minute = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

type PageBlocks = NonNullable<Page['content']>

type SeedPage = {
  slug: string
  title: string
  intro: string
  content: PageBlocks
}

const PAGES: SeedPage[] = [
  {
    slug: 'om-oss',
    title: 'Om oss',
    intro:
      'Chelsea Supporters Sweden är den officiella svenska supporterföreningen för Chelsea FC.',
    content: [
      {
        blockType: 'richTextBlock',
        body: richText([
          'Vi finns för att det ska vara enkelt att följa Chelsea från Sverige — tillsammans med andra och på svenska. Föreningen är öppen för alla, oavsett hur länge du hållit på laget.',
          'I praktiken gör vi tre saker. Vi ses och ser matcherna: mötesplatserna finns stad för stad och är öppna även för den som inte är medlem. Vi reser till London inför enskilda matcher, och söker biljetter till Stamford Bridge genom klubben. Och vi skriver om laget — referat, spelarbetyg och krönikor, allt av medlemmar på fritiden.',
          'Föreningen drivs helt ideellt. Styrelsen väljs på årsmötet och består av [STYRELSENS NAMN OCH ROLLER]. Verksamhetsåret löper [VERKSAMHETSÅRETS START OCH SLUT].',
        ]),
      },
      {
        blockType: 'factsBlock',
        heading: 'Föreningen i korthet',
        items: [
          { label: 'Bildad', value: '[ÅRTAL]' },
          { label: 'Organisationsnummer', value: '[ORGANISATIONSNUMMER]' },
          { label: 'Säte', value: '[FÖRENINGENS SÄTE]' },
          { label: 'Antal medlemmar', value: '[ANTAL MEDLEMMAR]' },
          { label: 'Medlemsavgift', value: '[MEDLEMSAVGIFT]' },
          { label: 'Status', value: 'Officiell supporterklubb till Chelsea FC' },
        ],
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Som medlem kan du söka biljetter genom föreningen, följa med på resorna, och rösta på årsmötet. Utöver det ingår [ÖVRIGA MEDLEMSFÖRMÅNER].',
          'Medlemsavgiften är [MEDLEMSAVGIFT] per år och betalas med Swish till [SWISH] eller bankgiro [BANKGIRO]. Pengarna går tillbaka in i verksamheten: arrangemang, biljettarbete och driften av den här sajten.',
          'Diskussionerna om laget lever kvar i forumet The Shed på SvenskaFans, som du når via länken i sidfoten. Har du en fråga som inte besvaras här når du oss enklast på e-post.',
        ]),
      },
      {
        blockType: 'ctaBlock',
        heading: 'Bli medlem',
        body: 'Ansökan tar en minut. Vi hör av oss med betalningsuppgifter och lägger till dig i medlemsregistret.',
        buttonLabel: 'Ansök om medlemskap',
        buttonUrl: '/sv/medlemskap',
      },
    ],
  },
  {
    slug: 'biljetter',
    title: 'Biljetter',
    intro: 'Så söker du biljett till Stamford Bridge — genom föreningen eller på egen hand.',
    content: [
      {
        blockType: 'richTextBlock',
        body: richText([
          'Som officiell supporterklubb kan Chelsea Supporters Sweden söka biljetter till hemmamatcher. Hur många vi får varierar från match till match och beror på motstånd, tävling och hur tidigt släppet ligger.',
          'Inför varje släpp samlar vi in intresseanmälningar från medlemmarna. Anmälan görs [SÅ HÄR ANMÄLER MAN SIG] och ska vara inne senast [SISTA ANMÄLNINGSDAG]. Är vi fler sökande än vi har biljetter fördelas de enligt [FÖRDELNINGSPRINCIP].',
          'Vill du köpa på egen hand går det genom chelseafc.com. Hemmabiljetter kräver oftast ett medlemskap i klubben, och de mest efterfrågade matcherna säljs i flera steg efter hur länge du varit medlem. Bortabiljetter i Premier League kostar aldrig mer än 30 pund — ligan har ett pristak — men de fördelas efter lojalitetspoäng och är svåra att få som tillresande.',
        ]),
      },
      {
        blockType: 'factsBlock',
        heading: 'Inför biljettsläppet',
        items: [
          { label: 'Vem kan söka', value: 'Medlemmar i Chelsea Supporters Sweden' },
          { label: 'Anmälan', value: '[SÅ HÄR ANMÄLER MAN SIG]' },
          { label: 'Sista anmälningsdag', value: '[SISTA ANMÄLNINGSDAG]' },
          { label: 'Pris', value: '[BILJETTPRIS] plus [EVENTUELL SERVICEAVGIFT]' },
          { label: 'Betalning', value: 'Swish [SWISH]' },
          { label: 'Frågor', value: '[BILJETTANSVARIG]' },
        ],
      },
      {
        blockType: 'faqBlock',
        heading: 'Vanliga frågor om biljetter',
        items: [
          {
            question: 'Måste jag vara medlem för att söka?',
            answer:
              'Ja. Biljetterna vi får går till medlemmar i föreningen. Medlemsavgiften är [MEDLEMSAVGIFT] per år och ansökan görs på sidan Medlemskap.',
          },
          {
            question: 'Hur många biljetter kan jag söka?',
            answer: '[ANTAL BILJETTER PER MEDLEM].',
          },
          {
            question: 'När får jag besked?',
            answer:
              'Vi hör av oss till alla som anmält sig, senast [BESKED SENAST]. Klubben släpper ofta biljetterna sent, så räkna med besked ganska kort inpå match.',
          },
          {
            question: 'Kan jag boka resa innan jag vet att jag fått biljett?',
            answer:
              'Undvik bokningar som inte går att avboka. Avsparkstiderna sätts av tv-bolagen och flyttas ofta med några veckors varsel — en lördagsmatch kan bli söndag eller måndag.',
          },
          {
            question: 'Vad gör jag om jag inte kan gå?',
            answer:
              'Hör av dig direkt till [BILJETTANSVARIG] så går biljetten vidare till nästa i kön. Biljetten är personlig och får inte säljas vidare.',
          },
          {
            question: 'Gäller samma sak för Chelsea Women?',
            answer:
              'Damlagets matcher har egna släpp och spelas på [ARENA FÖR DAMLAGETS MATCHER]. [SÅ FUNKAR DET FÖR DAMLAGET].',
          },
        ],
      },
      {
        blockType: 'ctaBlock',
        heading: 'Inte medlem än?',
        body: 'Biljettsläppen går till medlemmar. Ansök nu så är du med redan vid nästa släpp.',
        buttonLabel: 'Bli medlem',
        buttonUrl: '/sv/medlemskap',
      },
    ],
  },
  {
    slug: 'arenaguide',
    title: 'Arenaguide',
    intro: 'Hitta dit, hitta rätt läktare och vet vad som gäller som besökande supporter.',
    content: [
      {
        blockType: 'richTextBlock',
        body: richText([
          'Stamford Bridge ligger vid Fulham Road i västra London och tar ungefär 40 000 åskådare. Arenan har legat på samma plats sedan 1877 och ligger inklämd mellan bostadskvarter — det finns ingen parkering att tala om, och inget behov av bil.',
          'Närmaste tunnelbanestation är Fulham Broadway på District line, ungefär fem minuters promenad från arenan. Efter slutsignal är stationen kraftigt belastad. West Brompton och Imperial Wharf ligger båda inom en kvarts promenad och är oftast lugnare, och flera busslinjer går längs Fulham Road.',
        ]),
      },
      {
        blockType: 'factsBlock',
        heading: 'Stamford Bridge',
        items: [
          { label: 'Adress', value: 'Fulham Road, London SW6' },
          { label: 'Kapacitet', value: 'Cirka 40 000' },
          { label: 'Invigd', value: '1877' },
          { label: 'Närmaste tunnelbana', value: 'Fulham Broadway (District line), zon 2' },
          { label: 'Läktare', value: 'Matthew Harding, Shed End, East Stand, West Stand' },
          { label: 'Från centrala London', value: 'Cirka 20–30 minuter med tunnelbana' },
        ],
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Läktarna: Matthew Harding Stand är arenans mest ljudliga sida och det är därifrån mycket av sången kommer. Shed End är den gamla ståplatsläktaren — sittplats som allt annat i Premier League i dag — och där ligger också bortasektionen. East Stand är den höga sidan i tre nivåer, och West Stand är huvudläktaren med de dyrare platserna.',
          'Sikten är god från de flesta håll, men de främsta raderna ligger lågt och nära planen. Vill du se spelet snarare än känna det bör du sitta en bit upp.',
        ]),
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Som besökande supporter: räkna med att biljetten är personlig, och ta med legitimation. Kom i god tid — grindarna öppnar en bra stund före avspark och köerna växer ju närmare avspark du kommer. Öppningstiden för just din match står på chelseafc.com.',
          'Kontrollera väskreglerna innan du åker; de ändras över tid och stora väskor brukar inte släppas in. [KOLLA AKTUELLA VÄSKREGLER PÅ CHELSEAFC.COM INFÖR MATCHEN]. Ta med kort — kontanter används sällan på arenan. Går du ut släpps du normalt inte in igen.',
          'Sitter du på en hemmasektion, håll motståndarlagets färger hemma. Det är regel på de flesta engelska arenor och tas på allvar.',
          'Och kom ihåg att avsparkstiden kan flyttas för tv-sändning. Boka inget som inte går att ändra förrän tiden är spikad.',
        ]),
      },
      {
        blockType: 'ctaBlock',
        heading: 'Ska du åka?',
        body: 'Reseguiden tar vid där arenaguiden slutar — flyg, boende och att ta sig runt i London.',
        buttonLabel: 'Läs reseguiden',
        buttonUrl: '/sv/reseguide',
      },
    ],
  },
  {
    slug: 'reseguide',
    title: 'Reseguide',
    intro: 'Flyg, tåg, boende och matchdag — det föreningen lärt sig av att åka till London.',
    content: [
      {
        blockType: 'richTextBlock',
        body: richText([
          'Flyget tar ungefär två timmar från Sverige och det finns direktavgångar från flera städer. Fem flygplatser räknas som Londons: Heathrow, Gatwick, Stansted, Luton och City. Heathrow ligger på Piccadilly line och tar dig in till centrum utan byte. Från Gatwick går Gatwick Express till Victoria, från Stansted går Stansted Express till Liverpool Street.',
          'Den billigaste biljetten är sällan billigast när transfern in till stan är inräknad — jämför alltid totalpris och restid, särskilt om du landar sent på kvällen.',
        ]),
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Inne i London reser du enklast med kontaktlöst bankkort eller mobil direkt i spärren; något särskilt resekort behöver du inte skaffa i förväg. Det finns ett tak för hur mycket du betalar per dygn, så du behöver sällan räkna på enskilda resor.',
          'Stamford Bridge ligger i zon 2 och nås med District line till Fulham Broadway. Håll koll på helgavstängningar — District line stängs regelbundet av i delar för underhåll, och det märks först när du står på perrongen.',
        ]),
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Boende: de flesta som reser med föreningen bor antingen nära arenan eller centralt. Fulham och Earl’s Court ligger inom promenadavstånd eller några minuters tunnelbana. Hammersmith, Victoria och Pimlico ger fler hotell att välja på och kort resa längs District line. Bor du mitt i stan får du räkna med att åka västerut på matchdagen.',
          'Föreningens egna boendetips: [FÖRENINGENS HOTELLTIPS]. Reser du med oss ordnar vi [SÅ HÄR FUNKAR BOENDET PÅ FÖRENINGENS RESOR].',
        ]),
      },
      {
        blockType: 'factsBlock',
        heading: 'Bra att veta',
        items: [
          { label: 'Valuta', value: 'Brittiskt pund (GBP)' },
          { label: 'Tidsskillnad', value: 'En timme efter svensk tid' },
          { label: 'Betalning', value: 'Kontaktlöst kort fungerar överallt, även i tunnelbanan' },
          { label: 'Inresa', value: 'Pass krävs — kontrollera aktuella krav, t.ex. ETA, på gov.uk' },
          { label: 'Flygtid', value: 'Cirka två timmar från Sverige' },
          { label: 'Frågor om resorna', value: '[RESEANSVARIG]' },
        ],
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'På matchdagen: avsparkstiden sätts av tv-bolagen och kan flyttas med några veckors varsel, så boka flexibelt tills matchen är spikad. Var i området i god tid, ät innan du går mot arenan och räkna med trängsel vid Fulham Broadway efter slutsignal — att gå tio minuter till West Brompton eller Imperial Wharf går ofta fortare än att vänta in perrongen.',
          'Åker du på en av föreningens resor får du ett eget schema med tider och samlingsplats. Vi brukar ses [SÅ HÄR SAMLAS VI PÅ MATCHDAGEN].',
        ]),
      },
      {
        blockType: 'ctaBlock',
        heading: 'Följ med på nästa resa',
        body: 'Resorna annonseras under Evenemang så snart matchdatumet är bekräftat.',
        buttonLabel: 'Se kommande evenemang',
        buttonUrl: '/sv/evenemang',
      },
    ],
  },
  {
    slug: 'fpl',
    title: 'FPL-ligan',
    intro: 'Föreningens egen liga i Fantasy Premier League — öppen för alla medlemmar, hela säsongen.',
    content: [
      {
        blockType: 'richTextBlock',
        body: richText([
          'Varje säsong kör vi en egen liga i Fantasy Premier League. Du spelar med samma lag som i alla andra ligor du är med i — det enda du behöver göra är att gå med i vår med ligakoden nedan.',
          'Ligan löper över hela säsongen, men vi utser också vinnare månad för månad. [SÅ FUNKAR MÅNADSTÄVLINGEN]. Priset till den som vinner totalt är [PRIS TILL VINNAREN].',
        ]),
      },
      {
        blockType: 'factsBlock',
        heading: 'Så går du med',
        items: [
          { label: 'Ligakod', value: '[LIGAKOD]' },
          { label: 'Direktlänk', value: '[LÄNK TILL LIGAN]' },
          { label: 'Kostnad', value: '[KOSTNAD ATT DELTA]' },
          { label: 'Sista dag att gå med', value: '[SISTA DAG ATT GÅ MED]' },
          { label: 'Frågor', value: '[ANSVARIG FÖR FPL-LIGAN]' },
        ],
      },
      {
        blockType: 'richTextBlock',
        body: richText([
          'Reglerna är Fantasy Premier Leagues egna, med två tillägg: ett lag per medlem, och lagnamnet ska gå att koppla till dig så att vi vet vem som ligger etta. [ÖVRIGA REGLER].',
          'Du kan gå med när som helst under säsongen — poängen räknas då från den omgång du gick med, så ju tidigare desto bättre.',
        ]),
      },
      {
        blockType: 'ctaBlock',
        heading: 'Gå med i ligan',
        body: 'Skapa ett lag på fantasy.premierleague.com och gå sedan med i vår liga med koden [LIGAKOD].',
        buttonLabel: 'Till Fantasy Premier League',
        buttonUrl: 'https://fantasy.premierleague.com/',
      },
    ],
  },
]

/**
 * Mötesplatserna. Städerna är riktiga, men vilka ställen som faktiskt visar
 * Chelseamatcherna vet bara medlemmarna på plats — namn och adress står därför
 * som platshållare. Att peka ut en verklig krog som föreningens mötesplats
 * utan att fråga vore ett påstående om någon annan.
 */
const VENUES = [
  {
    slug: 'motesplats-stockholm',
    city: 'Stockholm',
    name: '[PUBENS NAMN I STOCKHOLM]',
    address: '[ADRESS], Stockholm',
    contactName: '[KONTAKTPERSON I STOCKHOLM]',
    description:
      'Stockholmsgänget ses här på matchdagar. Vi brukar sitta [VAR I LOKALEN] och matchen går på [SKÄRM ELLER PROJEKTOR] med svenskt ljud. Vid stormatcher blir det fullt — kom [ANTAL] minuter före avspark, eller hör av dig till [KONTAKTPERSON] om ni är fler än fyra så bokar vi bord.',
  },
  {
    slug: 'motesplats-goteborg',
    city: 'Göteborg',
    name: '[PUBENS NAMN I GÖTEBORG]',
    address: '[ADRESS], Göteborg',
    contactName: '[KONTAKTPERSON I GÖTEBORG]',
    description:
      'Göteborgsmedlemmarna ses här. Stället visar [VILKA MATCHER SOM VISAS] och vi håller till [VAR I LOKALEN]. Du behöver inte vara medlem för att komma — säg bara till i dörren att du ska till Chelsea-bordet.',
  },
  {
    slug: 'motesplats-malmo',
    city: 'Malmö',
    name: '[PUBENS NAMN I MALMÖ]',
    address: '[ADRESS], Malmö',
    contactName: '[KONTAKTPERSON I MALMÖ]',
    description:
      'Malmö och Öresundsregionen ses här inför matcherna. Vi samlas [HUR LÅNG TID FÖRE AVSPARK] och sitter kvar en stund efteråt. Kommer du från Köpenhamn tar du dig hit på [RESTID FRÅN KÖPENHAMN].',
  },
  {
    slug: 'motesplats-uppsala',
    city: 'Uppsala',
    name: '[PUBENS NAMN I UPPSALA]',
    address: '[ADRESS], Uppsala',
    contactName: '[KONTAKTPERSON I UPPSALA]',
    description:
      'Uppsalagruppen ses främst på helgmatcherna. [SÅ HÄR VET MAN OM DET BLIR NÅGON SAMLING] — vardagsmatcher med sen avspark blir det oftast ingen samling av.',
  },
  {
    slug: 'motesplats-linkoping',
    city: 'Linköping',
    name: '[PUBENS NAMN I LINKÖPING]',
    address: '[ADRESS], Linköping',
    contactName: '[KONTAKTPERSON I LINKÖPING]',
    description:
      'En mindre grupp som ses på de större matcherna. Vill du vara med, hör av dig till [KONTAKTPERSON] så får du veta när nästa samling blir av.',
  },
  {
    slug: 'motesplats-umea',
    city: 'Umeå',
    name: '[PUBENS NAMN I UMEÅ]',
    address: '[ADRESS], Umeå',
    contactName: '[KONTAKTPERSON I UMEÅ]',
    description:
      'Norrlands mötesplats. Vi ses [HUR OFTA] och är en liten grupp — desto lättare att lära känna varandra. [SÅ HÄR GÖR DU FÖR ATT VARA MED].',
  },
]

/**
 * Evenemangen är demoinnehåll: de visar hur listan ser ut, men motståndare,
 * platser och exakta tider måste styrelsen fylla i. Datumen räknas fram vid
 * körning, så de ligger alltid i framtiden.
 */
const EVENTS: {
  slug: string
  title: string
  date: string
  endDate?: string
  eventType: Event['eventType']
  city: string
  location: string
  paragraphs: string[]
  featured: boolean
}[] = [
  {
    slug: 'pubkvall-stockholm',
    title: 'Pubkväll i Stockholm: Chelsea – [MOTSTÅNDARE]',
    date: inDays(12, 17, 30),
    eventType: 'pubkvall',
    city: 'Stockholm',
    location: '[PUBENS NAMN], [ADRESS], Stockholm',
    featured: true,
    paragraphs: [
      'Vi ses en stund före avspark, tar en bit mat och ser matchen tillsammans. Öppet för alla — du behöver inte vara medlem.',
      'Avsparkstiden är preliminär tills tv-tiderna är spikade. [BEKRÄFTA DATUM OCH AVSPARKSTID]. Är ni fler än fyra, hör av er till [KONTAKTPERSON] så bokar vi bord.',
    ],
  },
  {
    slug: 'pubkvall-goteborg',
    title: 'Pubkväll i Göteborg: Chelsea – [MOTSTÅNDARE]',
    date: inDays(26, 15, 0),
    eventType: 'pubkvall',
    city: 'Göteborg',
    location: '[PUBENS NAMN], [ADRESS], Göteborg',
    featured: false,
    paragraphs: [
      'Göteborgsgänget samlas som vanligt. Vi håller till [VAR I LOKALEN] och sitter kvar efter slutsignal.',
      'Datum och tid är preliminära och bekräftas när matchen fått sin tv-tid. [BEKRÄFTA DATUM OCH AVSPARKSTID].',
    ],
  },
  {
    slug: 'resa-till-stamford-bridge',
    title: 'Föreningsresa till Stamford Bridge: Chelsea – [MOTSTÅNDARE]',
    date: inDays(58, 8, 0),
    endDate: inDays(61, 20, 0),
    eventType: 'resa',
    city: 'London',
    location: 'Stamford Bridge, Fulham Road, London SW6',
    featured: true,
    paragraphs: [
      'Föreningens resa till London över en helg: match på Stamford Bridge, gemensam samling före avspark och tid över att se staden.',
      'Pris: [PRIS FÖR RESAN], vilket inkluderar [DETTA INGÅR]. Flyg och boende bokar du [SJÄLV ELLER GENOM FÖRENINGEN]. Antal platser: [ANTAL PLATSER].',
      'Anmälan görs [SÅ HÄR ANMÄLER MAN SIG] senast [SISTA ANMÄLNINGSDAG]. Biljetterna är beroende av vad vi tilldelas av klubben — boka inget som inte går att avboka förrän du fått besked. Frågor: [RESEANSVARIG].',
    ],
  },
  {
    slug: 'arsmote',
    title: 'Årsmöte i Chelsea Supporters Sweden',
    date: inDays(96, 18, 0),
    eventType: 'arsmote',
    city: '[STAD]',
    location: '[LOKAL], [ADRESS], [STAD]',
    featured: false,
    paragraphs: [
      'Årsmötet är föreningens högsta beslutande organ. Vi går igenom verksamhetsberättelse och ekonomi, väljer styrelse och beslutar om medlemsavgiften för kommande år.',
      'Datum och plats är preliminära: [BEKRÄFTA DATUM OCH LOKAL]. Kallelse med dagordning och handlingar skickas till alla medlemmar senast [ANTAL] veckor före mötet.',
      'Motioner ska vara styrelsen tillhanda senast [SISTA DAG FÖR MOTIONER] på [E-POST FÖR MOTIONER]. Rösträtt har den som betalat medlemsavgiften för [VERKSAMHETSÅR]. Deltagande på distans: [GÄLLER DET ELLER INTE].',
    ],
  },
  {
    slug: 'traff-for-nya-medlemmar',
    title: 'Träff för nya medlemmar',
    date: inDays(40, 18, 0),
    eventType: 'traff',
    city: 'Malmö',
    location: '[PUBENS NAMN], [ADRESS], Malmö',
    featured: false,
    paragraphs: [
      'En kväll för dig som är ny i föreningen, eller funderar på att gå med. Vi berättar hur biljettsökningen fungerar, vad resorna kostar och vilka som skriver på sajten.',
      'Ingen anmälan behövs. Kom när du kan — vi är på plats från [KLOCKSLAG]. Kontakt: [KONTAKTPERSON].',
    ],
  },
]

async function seedPages(payload: Payload): Promise<void> {
  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    const data = {
      title: page.title,
      slug: page.slug,
      intro: page.intro,
      _status: 'published' as const,
      content: page.content,
    }

    const current = existing.docs[0]

    if (current) {
      await payload.update({
        collection: 'pages',
        id: current.id,
        overrideAccess: true,
        draft: false,
        data,
      })
      console.log(`  ↻ Sidan "${page.title}" uppdaterad`)
      continue
    }

    await payload.create({
      collection: 'pages',
      overrideAccess: true,
      draft: false,
      data,
    })
    console.log(`  ✓ Sidan "${page.title}"`)
  }
}

async function seedVenues(payload: Payload): Promise<void> {
  for (const venue of VENUES) {
    const existing = await payload.find({
      collection: 'venues',
      where: { slug: { equals: venue.slug } },
      limit: 1,
      overrideAccess: true,
    })

    const data = {
      city: venue.city,
      name: venue.name,
      slug: venue.slug,
      address: venue.address,
      description: venue.description,
      contactName: venue.contactName,
      active: true,
    }

    const current = existing.docs[0]

    if (current) {
      await payload.update({
        collection: 'venues',
        id: current.id,
        overrideAccess: true,
        data,
      })
      console.log(`  ↻ Mötesplats i ${venue.city} uppdaterad`)
      continue
    }

    await payload.create({ collection: 'venues', overrideAccess: true, data })
    console.log(`  ✓ Mötesplats i ${venue.city}`)
  }
}

async function seedEvents(payload: Payload): Promise<void> {
  for (const event of EVENTS) {
    const existing = await payload.find({
      collection: 'events',
      where: { slug: { equals: event.slug } },
      limit: 1,
      overrideAccess: true,
      draft: true,
    })

    const data = {
      title: event.title,
      slug: event.slug,
      date: event.date,
      ...(event.endDate ? { endDate: event.endDate } : {}),
      eventType: event.eventType,
      city: event.city,
      location: event.location,
      description: richText(event.paragraphs),
      featured: event.featured,
      _status: 'published' as const,
    }

    const current = existing.docs[0]

    if (current) {
      await payload.update({
        collection: 'events',
        id: current.id,
        overrideAccess: true,
        draft: false,
        data,
      })
      console.log(`  ↻ Evenemanget "${event.title}" uppdaterat`)
      continue
    }

    await payload.create({
      collection: 'events',
      overrideAccess: true,
      draft: false,
      data,
    })
    console.log(`  ✓ Evenemanget "${event.title}"`)
  }
}

async function seedSettings(payload: Payload): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true })

  /**
   * Kontaktuppgifterna skrivs bara om de saknas. En riktig siffra som styrelsen
   * redan fyllt i ska aldrig ersättas av en platshållare vid nästa körning.
   */
  const placeholders = {
    ...(settings?.orgNumber ? {} : { orgNumber: '[ORG.NUMMER]' }),
    ...(settings?.membershipFee ? {} : { membershipFee: '[MEDLEMSAVGIFT]' }),
    ...(settings?.swish ? {} : { swish: '[SWISH]' }),
    ...(settings?.bankgiro ? {} : { bankgiro: '[BANKGIRO]' }),
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      siteName: 'Chelsea Supporters Sweden',
      // Ingen grundarårtal i sloganen — vilket år föreningen bildades vet bara styrelsen.
      tagline: 'Sveriges Chelsea-supportrar',
      description:
        'Chelsea Supporters Sweden är den officiella svenska supporterföreningen för Chelsea FC. Matchreferat, spelarbetyg, podd, resor till London och pubkvällar i hela landet.',
      email: 'info@chelseasweden.se',
      showChelseaNews: true,
      showPodcast: true,
      // Arkivet på SvenskaFans är avstängt: artiklarna importeras hit separat.
      showSvenskaFans: false,
      announcement: {
        // Avstängd men ifylld, så att styrelsen ser hur raden fungerar innan den slås på.
        enabled: false,
        text: 'Årsmötet hålls [DATUM] i [STAD] — anmäl dig senast [SISTA ANMÄLNINGSDAG].',
        linkLabel: 'Läs mer',
        linkUrl: '/sv/evenemang',
      },
      ...placeholders,
    },
  })

  console.log('  ✓ Sajtinställningar')
  const filled = Object.keys(placeholders).length
  if (filled === 0) {
    console.log('  – Kontaktuppgifterna var redan ifyllda och lämnades orörda')
  }
}

async function seed(): Promise<void> {
  const payload = await getPayload({ config })

  console.log('\nSidor')
  await seedPages(payload)

  console.log('\nMötesplatser')
  await seedVenues(payload)

  console.log('\nEvenemang')
  await seedEvents(payload)

  console.log('\nInställningar')
  await seedSettings(payload)

  console.log(
    '\nKlart. Sök efter hakparenteser i adminpanelen — allt inom [ ] är sådant föreningen\nmåste fylla i själv innan sajten går live.\n',
  )
  process.exit(0)
}

seed().catch((error) => {
  console.error('Seed misslyckades:', error)
  process.exit(1)
})
