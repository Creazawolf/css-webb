# -*- coding: utf-8 -*-
from parts import *

CSS = HEADER_CSS + FOOTER_CSS + """
  .wrap{max-width:1440px;margin:0 auto;padding:0 64px}

  .crumbs{font:500 11.5px/1 var(--sans);letter-spacing:.06em;color:var(--muted);
          padding:26px 0 0;display:flex;gap:9px;align-items:center}
  .crumbs a:hover{color:var(--blue)}

  .ahead{padding:26px 0 40px;max-width:960px}
  .atitle{font:700 60px/.96 var(--disp);letter-spacing:-.018em;color:var(--ink);
          margin-top:18px;text-wrap:balance}
  .astand{font:400 22px/1.5 var(--serif);color:var(--ink-2);margin-top:20px;
          max-width:820px;text-wrap:pretty}
  .abyl{display:flex;align-items:center;gap:16px;margin-top:30px;padding:16px 0;
        border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
        max-width:820px}
  .abyl-n{font:600 13.5px/1.3 var(--sans);color:var(--ink)}
  .abyl-m{font:500 11.5px/1.3 var(--sans);color:var(--muted);margin-top:3px}

  figure figcaption{display:flex;gap:14px;padding-top:12px;
    font:500 11.5px/1.5 var(--sans);color:var(--muted);max-width:960px}
  figcaption em{font-family:var(--serif);font-size:13px;font-style:italic;
                color:var(--ink-2);flex:1}

  .abody{display:grid;grid-template-columns:196px 720px 1fr;gap:48px;
         padding:56px 0 24px;align-items:start}

  .tools{position:sticky;top:24px}
  .tools p{font:700 9.5px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
           color:var(--muted);margin-bottom:12px}
  .tool-row{display:flex;gap:8px}
  .tool{width:44px;height:44px;border-radius:999px;border:1px solid var(--rule-ctl);
    background:transparent;color:var(--ink-2);cursor:pointer;display:flex;
    align-items:center;justify-content:center;font:600 12px/1 var(--sans);
    transition:border-color .18s var(--ease),color .18s var(--ease),
               background-color .18s var(--ease)}
  .tool:hover{border-color:var(--blue);color:var(--blue)}

  .prose{font-family:var(--serif);font-weight:400;line-height:1.78;color:#1A2433}
  .prose p+p,.prose ul,.prose h2,.prose blockquote,.prose figure{margin-top:1.5em}
  .prose h2{font:600 30px/1.18 var(--disp);letter-spacing:.002em;color:var(--ink);
            margin-top:2em}
  .prose ul{padding-left:1.15em;list-style:disc}
  .prose li+li{margin-top:.45em}
  .prose a{color:var(--blue);text-decoration:underline;text-underline-offset:3px;
           text-decoration-thickness:1px}
  .prose a:hover{color:var(--gold-ink)}
  .dropcap::first-letter{float:left;font-family:var(--disp);font-weight:700;
    font-size:4.1em;line-height:.82;padding:.06em .12em 0 0;color:var(--blue)}
  .pull{border-top:3px solid var(--gold);border-bottom:1px solid var(--rule);
        padding:24px 0 26px}
  .pull q{font:600 27px/1.25 var(--disp);letter-spacing:-.005em;color:var(--blue-dk);
          quotes:none;display:block}

  .rail{position:sticky;top:24px}
  .fact{background:var(--card);border:1px solid var(--rule);border-radius:6px;
        padding:22px 24px}
  .fact h3{font:700 10px/1 var(--sans);letter-spacing:.17em;text-transform:uppercase;
    color:var(--muted);padding-bottom:14px;border-bottom:1px solid var(--rule);margin:0}
  .fact dl{display:grid;grid-template-columns:auto 1fr;gap:0;margin:0}
  .fact dt{font:500 12px/1 var(--sans);color:var(--muted);padding:13px 0;
           border-top:1px solid var(--rule)}
  .fact dd{font:600 12.5px/1 var(--sans);color:var(--ink);padding:13px 0;margin:0;
           text-align:right;border-top:1px solid var(--rule)}
  .fact dt:first-of-type,.fact dd:first-of-type{border-top:0}

  .also{margin-top:24px}
  .also h3{font:700 10px/1 var(--sans);letter-spacing:.17em;text-transform:uppercase;
    color:var(--muted);padding-bottom:14px;border-bottom:1px solid var(--rule);margin:0}
  .also li{padding:15px 0;border-top:1px solid var(--rule)}
  .also li:first-child{border-top:0}
  .also-k{font:700 9.5px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
          color:var(--blue)}
  .also-t{font:600 16px/1.25 var(--disp);color:var(--ink);margin-top:7px;display:block}

  .authorcard{display:flex;gap:20px;align-items:center;max-width:964px;
    margin:8px 0 0 244px;padding:26px 0;border-top:2px solid var(--ink);
    border-bottom:1px solid var(--rule)}

  .sh{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;
      padding-bottom:22px;margin-bottom:28px;border-bottom:2px solid var(--ink)}
  .sh-t{font:700 26px/1 var(--disp);letter-spacing:.06em;text-transform:uppercase}
  .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
  .card{background:var(--card);border:1px solid var(--rule);border-radius:6px;
        overflow:hidden;display:flex;flex-direction:column;height:100%}
  .card-b{padding:20px 20px 22px;display:flex;flex-direction:column;flex:1}
  .card-k{font:700 10px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
          color:var(--blue)}
  .card-t{font:600 20px/1.24 var(--disp);margin-top:10px;color:var(--ink)}
  .card-m{font:500 11.5px/1 var(--sans);color:var(--muted);margin-top:auto;padding-top:16px}
"""

def card(kick, title, meta):
    return ('<a class="card lift gz" href="#">'
            '<span class="ph" style="aspect-ratio:416 / 260;display:block">'
            '<span class="zoom" style="position:absolute;inset:0">%s</span></span>'
            '<span class="card-b"><span class="card-k">%s</span>'
            '<span class="card-t hl">%s</span>'
            '<span class="card-m">%s</span></span></a>' % (mono(50), kick, title, meta))

def share(path, label):
    return ('<button type="button" class="tool" aria-label="%s">'
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
            ' stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"'
            ' aria-hidden="true">%s</svg></button>' % (label, path))

BODY = (
'<div style="width:1440px;background:var(--paper);--fs:{{fs}}px">'
+ header('Artiklar', 'var(--gold)') +

'<div class="wrap">'
  '<nav class="crumbs" aria-label="Brödsmulor">'
    '<a href="#">Artiklar</a>'
    '<span aria-hidden="true" style="color:var(--rule-2)">/</span>'
    '<a href="#">Krönika</a>'
  '</nav>'

  '<header class="ahead">'
    '<div style="display:flex;align-items:center;gap:12px">'
    + gold_rule(30) + '<span class="kick" style="color:var(--gold-ink)">Krönika</span></div>'
    '<h1 class="atitle">Sju mål på Stamford Bridge — och ändå är det '
    'försvaret vi pratar om</h1>'
    '<p class="astand">Chelsea vann med 4–3 mot Brighton. Det var underhållande, '
    'det var nervöst, och det var precis den sortens match som avgör hur den här '
    'säsongen kommer att kännas när vi tittar tillbaka i mars.</p>'
    '<div class="abyl">'
      + crest('R', '#022B5C', '#fff', 40, 14) +
      '<div style="flex:1">'
        '<p class="abyl-n">Redaktionen</p>'
        '<p class="abyl-m">Publicerad 31 augusti 2026 · 6 min läsning</p>'
      '</div>'
      '<a href="#" style="font:700 11px/1 var(--sans);letter-spacing:.09em;'
      'text-transform:uppercase;color:var(--blue)">Dela</a>'
    '</div>'
  '</header>'

  '<figure>'
    '<span class="ph" style="aspect-ratio:1312 / 590;display:block;border-radius:6px">'
    + mono(110) + '</span>'
    '<figcaption><em>Stamford Bridge, söndag eftermiddag. [BILDTEXT]</em>'
    '<span style="flex:none">Foto: [FOTOGRAF]</span></figcaption>'
  '</figure>'

  '<div class="abody">'

    # verktygsspalt
    '<div class="tools">'
      '<p>Textstorlek</p>'
      '<div class="tool-row">'
        '<button type="button" class="tool" style="{{s0.style}}" onClick="{{s0.pick}}" aria-pressed="{{s0.on}}" '
        'aria-label="Mindre text">A</button>'
        '<button type="button" class="tool" style="{{s1.style}}; font-size:14px" '
        'onClick="{{s1.pick}}" aria-pressed="{{s1.on}}" aria-label="Normal text">A</button>'
        '<button type="button" class="tool" style="{{s2.style}}; font-size:17px" '
        'onClick="{{s2.pick}}" aria-pressed="{{s2.on}}" aria-label="Större text">A</button>'
      '</div>'
      '<p style="margin-top:28px">Dela</p>'
      '<div class="tool-row">'
      + share('<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>'
              '<path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/>', 'Dela länk')
      + share('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/>'
              '<circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
              'Dela i sociala medier')
      + share('<path d="M4 4h16v12H8l-4 4z"/>', 'Diskutera i The Shed')
      + '</div>'
    '</div>'

    # brödtext
    '<article class="prose" style="font-size:var(--fs)">'
      '<p class="dropcap">Det dröjde en stund innan den här matchen bestämde sig '
      'för vad den skulle vara. Fram till dess hade den varit prydlig, '
      'kontrollerad och lite trist. Sedan öppnade sig ytorna, och de stängdes '
      'aldrig igen.</p>'
      '<p>Fyra–tre låter som en bra dag. Och på ett sätt var det en bra dag: tre '
      'poäng, fullsatt arena och en publik som gick hem med benen skakiga. Men '
      'den som satt kvar en stund efter slutsignalen och tittade på hur de tre '
      'baklängesmålen kom till hade svårt att komma ifrån känslan av att vi '
      'sett den här filmen förut.</p>'

      '<h2>Det som fungerade</h2>'
      '<p>Framåt finns det inte mycket att klaga på. Rörelsen mellan leden var '
      'den bästa hittills den här säsongen, och för första gången såg mittfältet '
      'ut att veta vem som skulle göra vad när bollen vanns högt. Fyra mål mot '
      'ett lag som brukar hålla tätt är ingen slump.</p>'
      '<ul>'
        '<li>Presspelet höll långt in i andra halvlek, längre än mot Fulham.</li>'
        '<li>Kantspelet hittade fram, och inläggen nådde faktiskt en blå tröja.</li>'
        '<li>Efter paus vann vi de flesta av närkamperna på mittplan.</li>'
      '</ul>'

      '<blockquote class="pull"><q>Ett lag som gör fyra mål varje match behöver '
      'inte vara perfekt bakåt. Men det behöver vara förutsägbart.</q></blockquote>'

      '<h2>Det som oroar</h2>'
      '<p>Alla tre baklängesmålen kom i situationer där vi hade numerärt '
      'överläge. Det är inte ett problem med spelarna, det är ett problem med '
      'vem som bestämmer. Någon måste äga straffområdet, och just nu turas fyra '
      'personer om att göra det.</p>'
      '<p>Nästa söndag väntar Arsenal borta. Det är den match där den här sortens '
      'oreda blir dyr. Läs gärna <a href="#">inför-texten</a> och '
      '<a href="#">spelarbetygen</a> innan avspark.</p>'
    '</article>'

    # faktaruta
    '<aside class="rail">'
      '<div class="fact">'
        '<h3>Matchfakta</h3>'
        '<dl>'
          '<dt>Turnering</dt><dd>Premier League</dd>'
          '<dt>Datum</dt><dd>sön 30 aug 2026</dd>'
          '<dt>Arena</dt><dd>Stamford Bridge</dd>'
          '<dt>Resultat</dt><dd>Chelsea 4–3 Brighton</dd>'
          '<dt>Målskyttar</dt><dd>[MÅLSKYTTAR]</dd>'
        '</dl>'
      '</div>'
      '<div class="also">'
        '<h3>Läs också</h3>'
        '<ul>'
          '<li><a class="gz" href="#" style="display:block">'
          '<span class="also-k">Spelarbetyg</span>'
          '<span class="also-t hl">Spelarbetyg: Chelsea – Brighton</span></a></li>'
          '<li><a class="gz" href="#" style="display:block">'
          '<span class="also-k">Matchreferat</span>'
          '<span class="also-t hl">Fyra framåt, tre bakåt och tre poäng kvar '
          'i London</span></a></li>'
          '<li><a class="gz" href="#" style="display:block">'
          '<span class="also-k">Inför match</span>'
          '<span class="also-t hl">Inför Arsenal borta: tre frågor före '
          'derbyt</span></a></li>'
        '</ul>'
      '</div>'
    '</aside>'
  '</div>'

  '<div class="authorcard">'
    + crest('R', '#022B5C', '#fff', 52, 17) +
    '<div style="flex:1">'
      '<p style="font:600 15px/1.3 var(--sans);color:var(--ink)">Redaktionen</p>'
      '<p style="font:400 14px/1.6 var(--serif);color:var(--ink-2);margin-top:6px;'
      'max-width:560px">Chelsea Supporters Sweden skrivs av medlemmar. '
      'Vill du vara med? Hör av dig till redaktionen.</p>'
    '</div>'
    '<a class="btn btn-line" href="#" style="flex:none">Skriv för oss</a>'
  '</div>'
'</div>'

'<section class="wrap" style="padding-top:64px;padding-bottom:72px">'
  '<div class="sh"><h2 class="sh-t">Mer från redaktionen</h2>'
  '<a href="#" style="font:700 11.5px/1 var(--sans);letter-spacing:.09em;'
  'text-transform:uppercase;color:var(--blue);padding-bottom:4px">Alla artiklar</a></div>'
  '<div class="grid3">'
  + card('Matchreferat', 'Chelsea 2–0 Luton: rutinerat värre i cupen', '28 aug · 4 min')
  + card('Intervju', 'Möt gänget som drog igång CSS Göteborg', '27 aug · 7 min')
  + card('Krönika', 'Damlaget förtjänar mer än en notis längst ner', '26 aug · 5 min')
  + '</div>'
'</section>'

+ footer() +
'</div>'
)

LOGIC = """
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { size: 1 };
  }
  renderVals() {
    const sizes = [17, 19, 21];
    const vals = { fs: sizes[this.state.size] };
    sizes.forEach((_, i) => {
      vals['s' + i] = {
        pick: () => this.setState({ size: i }),
        style: this.state.size === i
          ? 'background:#101B2B;border-color:#101B2B;color:#ffffff'
          : '',
        on: this.state.size === i ? 'true' : 'false',
      };
    });
    return vals;
  }
}
"""

PROPS = '{"$preview":{"width":1440,"height":3820}}'

if __name__ == '__main__':
    write('Artikel.dc.html', CSS, BODY, LOGIC, PROPS)
