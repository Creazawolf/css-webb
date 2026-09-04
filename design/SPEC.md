# Designspecifikation — "Matchtidningen"

Riktningen är **redaktionell matchtidning**: papperston i stället för kylig grå,
stort typografiskt spann, hårfina linjer i stället för skuggade kort överallt,
guld bara där det betyder något.

Referensen är artboardsen i `design/*.dc.html`. Läs den som hör till din uppgift.
Där finns exakt markup och exakta värden. Kopiera värdena, avrunda dem inte.

## Tokens (finns redan i `app/globals.css` efter grundpasset)

| Token | Värde | Används till |
| --- | --- | --- |
| `--color-paper` | `244 242 238` (#F4F2EE) | sidans bakgrund |
| `--color-paper-deep` | `235 231 224` (#EBE7E0) | avvikande sektionsband |
| `--color-card` | `255 255 255` | kort och paneler |
| `--color-text` | `16 27 43` (#101B2B) | brödtext och rubriker |
| `--color-ink-2` | `61 71 87` (#3D4757) | ingresser, sekundär text |
| `--color-muted` | `92 102 115` (#5C6673) | metadata (klarar AA mot papper) |
| `--color-rule` | `223 218 210` (#DFDAD2) | hårfina avdelare |
| `--color-rule-2` | `200 193 181` (#C8C1B5) | dekorativa linjer |
| `--color-rule-ctl` | `139 132 116` (#8B8474) | ramar på kontroller (3:1) |
| `--color-chelsea-blue` | `3 70 148` | oförändrad |
| `--color-chelsea-blue-dark` | `2 43 92` | oförändrad |
| `--color-night` | `1 20 44` | sidfot, mörka band |
| `--color-gold` | `212 168 67` | fyllningar, aldrig text på blått |
| `--color-gold-light` | `232 201 106` | guldtext på blå botten |
| `--color-gold-ink` | `138 106 30` (#8A6A1E) | guldtonad text på papper |

Radier oförändrade. Kort använder `--radius-sm` (6px), inte `--radius-lg`.

## Typografi

Tre typsnitt. Oswald och Inter finns redan; **Newsreader** är ny.

- `.font-display` → Oswald. Rubriker, siffror, resultat.
- Standard (`body`) → Inter. Gränssnitt, metadata, knappar, navigation.
- `.font-serif` → Newsreader, fallback `Georgia, 'Times New Roman', serif`.
  Brödtext, ingresser, citat, korta beskrivningar.

Skala:

| Roll | Värde |
| --- | --- |
| Löpsedelsrubrik | Oswald 700, 52px/1.0, `letter-spacing:-.012em` |
| Sidrubrik (h1) | Oswald 700, 50px/.98, `-.012em` |
| Artikelrubrik | Oswald 700, 60px/.96, `-.018em` |
| Sektionsrubrik | Oswald 700, 26px/1, `letter-spacing:.06em`, versaler |
| Kortrubrik | Oswald 600, 20px/1.24 |
| Listrubrik i spalt | Oswald 600, 19px/1.22 |
| Kicker | Inter 700, 11px, `letter-spacing:.16em`, versaler |
| Ingress | Newsreader 400, 20–22px/1.5 |
| Brödtext | Newsreader 400, 19px/1.78 |
| Gränssnitt | Inter 500/600, 12–13.5px |
| Metadata | Inter 500, 11.5–12px |

## Återkommande mönster

- **Sektionshuvud**: `border-bottom:2px solid var(--color-text)`, `padding-bottom:22px`,
  `margin-bottom:28px`. Rubriken till vänster, en underrubrik i kursiv serif under
  den, en länk längst till höger.
- **Kicker med guldstreck**: 30×3px guldstreck, 12px mellanrum, sedan kickertexten
  i `--color-gold-ink`.
- **Kort**: vit botten, `1px solid var(--color-rule)`, 6px radie, ingen skugga i
  viloläge. `.card-lift` vid hover som förut.
- **Guld används till**: aktiv flik i menyn, kickerstreck, en enda uppmaning per vy,
  live-markering. Inte till varje etikett.
- **Artikeltyper heter**: Matchreferat, Spelarbetyg, Inför match, Krönika, Intervju,
  Föreningsnytt. Samma ord i kickers, filter och menyer.
- **Tankstreck** (–) mellan lagnamn och i resultat. Aldrig kolon, aldrig bindestreck.
- **Nedräkning**: enheterna heter `dygn`, `tim`, `min`, `sek`.
- **Läsningstid**: skrivs `6 min läsning`.

## Tillgänglighet (ska hålla)

- Träffytor minst 44px höga för knappar och menyrader, aldrig under 24px.
- Aktivt tillstånd på växlar signaleras med `aria-pressed`, inte bara med färg.
- Formkurvor och andra färgkodade signaler har text för skärmläsare.
- Kolumnförkortningar i tabeller får `<abbr title="...">`.
- Rubriknivåer i ordning, en `h1` per sida.

## Regler som gäller i den här kodbasen

- Grundstilar måste ligga i `@layer base` i `globals.css`. Olagrad CSS slår
  Tailwinds utilities oavsett specificitet.
- `exactOptionalPropertyTypes` är på: skriv `...(x ? { k: x } : {})`.
- Serverkomponenter som standard. Lägg inte till `'use client'` där det inte finns.
- Rör inte datalagret (`lib/`), Payload-konfigurationen eller `lib/chelsea-matches.ts`.
- Ändra inte texter som kommer från CMS:et — bara presentationen.
