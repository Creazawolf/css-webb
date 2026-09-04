# Designcanvas — "Matchtidningen"

Källfilerna till designcanvasen för redesignen av sajten. Den publicerade
canvasen ligger som en Artifact; den här mappen är det som bygger den.

Riktning: **redaktionell matchtidning**. Klubbfärgerna och Oswald/Inter är
kvar från sajten. Nytt är den varma papperstonen `#F4F2EE`, Newsreader som
brödtextserif, ett vidare typografiskt spann och hårfina linjer i stället för
skuggade kort.

## Filer

| Fil | Vad |
| --- | --- |
| `parts.py` | Designtokens, header och sidfot — delas av alla artboards |
| `make_main.py` | Löpsedeln |
| `make_mc.py` | Matchcentret |
| `make_art.py` | Artikelsidan |
| `make_nav.py` | Navigationen i fyra tillstånd |
| `make_mob.py` | Löpsedeln på mobil |
| `canvas.json` | Placering på canvasen, sidnoteringar och startvy |
| `*.dc.html` | Genererade artboards — bygg om dem, redigera dem inte för hand |

## Bygga om

```bash
cd design
for f in make_main make_mc make_art make_nav make_mob; do python3 $f.py; done
python3 checkhtml.py *.dc.html          # taggbalans och mallhål
bash verify.sh                          # seedar om, renderar och mäter
node interact2.mjs                      # klickar igenom alla interaktioner
```

`verify.sh` behöver en lokal server på port 8799:
`npx http-server -p 8799 -s .`

Publicera sedan om den seedade `matchtidningen.html` till samma Artifact-URL.

## Fällor som redan kostat tid

- **`sc-for` får inte ligga i en `<tbody>`.** HTML-parsern flyttar okända
  element ut ur tabellen, mallen blir trasig och komponenten monterar aldrig —
  alla hål renderas tomma utan felmeddelande. Matchcentret bygger därför
  tabellerna som vanlig HTML och låter logiken bara styra vad som syns. Det
  gör dessutom texten redigerbar direkt i canvasen.
- **Satser på toppnivå före `class Component` körs inte.** Allt måste ligga
  inuti klassen.
- **`.sec` får inte sätta `padding` med kortform** — den skriver då över
  `.wrap`:s sidmarginal, och sektionen går ut i kanten.
- Ramhöjderna i `canvas.json` måste rymma innehållet; `verify.sh` mäter och
  säger till. Överskjutande yta målas bara i bakgrundsfärgen, klippning är
  det enda som är fel.
