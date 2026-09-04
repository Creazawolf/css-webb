# -*- coding: utf-8 -*-
from parts import *

CSS = HEADER_CSS + """
  .stage{padding:44px 64px 56px}
  .lab{display:flex;align-items:baseline;gap:14px;margin-bottom:20px}
  .lab-n{font:700 10px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;
         color:var(--gold-ink)}
  .lab-t{font:700 20px/1 var(--disp);letter-spacing:.05em;text-transform:uppercase;
         color:var(--ink)}
  .lab-s{font:400 13px/1.4 var(--serif);font-style:italic;color:var(--muted)}
  .band{border-top:1px solid var(--rule);background:var(--paper-deep)}
  .frame{border:1px solid var(--rule);border-radius:8px;overflow:hidden;
         background:var(--card);box-shadow:0 1px 2px rgba(2,32,69,.04)}

  /* --- Megapanel --- */
  .mega{position:absolute;left:0;right:0;top:100%;background:var(--card);
    border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);
    box-shadow:0 20px 44px rgba(2,32,69,.13);z-index:30;
    transition:opacity .2s var(--ease),transform .2s var(--ease)}
  .mega-in{max-width:1440px;margin:0 auto;padding:34px 64px 38px;
    display:grid;grid-template-columns:1fr 1fr 380px;gap:48px}
  .mega h4{font:700 10px/1 var(--sans);letter-spacing:.17em;text-transform:uppercase;
    color:var(--muted);padding-bottom:14px;border-bottom:1px solid var(--rule);
    margin-bottom:6px}
  .mega li a{display:block;padding:11px 0;font:600 16px/1.2 var(--disp);
    letter-spacing:.005em;color:var(--ink);transition:color .16s var(--ease)}
  .mega li a:hover{color:var(--blue)}
  .mega li a small{display:block;font:400 12.5px/1.4 var(--serif);color:var(--muted);
    margin-top:4px}

  .drop{position:absolute;left:0;top:100%;min-width:230px;background:var(--card);
    border:1px solid var(--rule);border-radius:0 0 8px 8px;padding:8px;z-index:30;
    box-shadow:0 16px 34px rgba(2,32,69,.14);
    transition:opacity .18s var(--ease),transform .18s var(--ease)}
  .drop a{display:block;padding:10px 12px;border-radius:5px;
    font:500 13.5px/1 var(--sans);color:var(--ink-2);
    transition:background-color .15s var(--ease),color .15s var(--ease)}
  .drop a:hover{background:var(--paper);color:var(--blue)}

  /* --- Kompakt --- */
  .hdr.mini .hdr-in{height:58px}
  .hdr.mini .nav a{padding:19px 13px;font-size:11.5px}
  .hdr.mini .brand-mark{width:32px;height:32px}
  .hdr.mini .brand-name{font-size:15px}
  .hdr.mini .brand-sub{font-size:8.5px;letter-spacing:.24em}
  .hdr.mini{box-shadow:0 2px 14px rgba(2,32,69,.10)}

  /* --- Mobil --- */
  .phone{width:390px;border:1px solid var(--rule-2);border-radius:14px;
         overflow:hidden;background:var(--paper);flex:none;
         box-shadow:0 10px 30px rgba(2,32,69,.10)}
  .mbar{display:flex;align-items:center;justify-content:space-between;
        padding:0 18px;height:62px;background:var(--card);
        border-bottom:1px solid var(--rule)}
  .burger{width:26px;height:18px;position:relative;border:0;background:transparent;
          cursor:pointer;padding:0}
  .burger i{position:absolute;left:0;height:2px;width:26px;border-radius:2px;
    background:var(--ink);transition:transform .3s var(--ease),opacity .3s var(--ease)}
  .mdraw{background:var(--night);color:#fff;padding:8px 22px 26px}
  .mdraw li{border-top:1px solid rgba(255,255,255,.10)}
  .mdraw li a{display:flex;align-items:center;justify-content:space-between;
    padding:17px 0;font:600 21px/1 var(--disp);letter-spacing:.04em;
    text-transform:uppercase;color:#fff}
  .mdraw li a:hover{color:var(--gold)}
  .mhero{padding:20px 18px}
"""


NAVBTN_CSS = """
  .nav .navbtn{position:relative;padding:26px 13px;font:600 12px/1 var(--sans);
    letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2);border:0;
    background:transparent;cursor:pointer;display:inline-flex;align-items:center;
    transition:color .18s var(--ease)}
  .nav .navbtn:hover{color:var(--blue)}
"""
CSS += NAVBTN_CSS

CARET = ('<svg class="nav-caret" width="9" height="9" viewBox="0 0 24 24" fill="none" '
         'stroke="currentColor" stroke-width="3" stroke-linecap="round" '
         'stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>')

def links(active=None, button=None):
    out = []
    for label in NAV:
        has = label in ('Artiklar', 'Matcher', 'Föreningen', 'Guider')
        mark = ('<span class="nav-mark" style="background:var(--gold)"></span>'
                if label == active else '')
        cur = ' aria-current="page"' if label == active else ''
        if label == button:
            out.append('<button type="button" class="navbtn" style="{{o.style}}" '
                       'onClick="{{o.toggle}}" aria-expanded="{{o.expanded}}">'
                       + label + CARET + mark + '</button>')
        else:
            out.append('<a href="#"%s>%s%s%s</a>' % (cur, label, CARET if has else '', mark))
    return ''.join(out)

def bar(active=None, button=None, mini=False, cta=True):
    right = ('<div class="hdr-cta">'
             '<a class="shed" href="#">The Shed'
             '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"'
             ' stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'
             ' aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></a>'
             '<a class="btn btn-blue" href="#">Bli medlem</a></div>') if cta else ''
    m = mono(22).replace('class="phm"', '').replace('position:absolute', '')
    return ('<header class="hdr' + (' mini' if mini else '') + '">'
            '<div class="rule3"></div>'
            '<div class="hdr-in">'
            '<a class="brand" href="#" aria-label="Chelsea Supporters Sweden — startsidan">'
            '<span class="brand-mark">' + m + '</span>'
            '<span><span class="brand-name">Chelsea Supporters</span>'
            '<span class="brand-sub">Sweden</span></span></a>'
            '<nav class="nav" aria-label="Huvudmeny">' + links(active, button) + '</nav>'
            + right + '</div></header>')

def label(n, t, s):
    return ('<div class="lab"><span class="lab-n">%s</span>'
            '<span class="lab-t">%s</span><span class="lab-s">%s</span></div>' % (n, t, s))

MEGA = (
'<div class="mega" style="opacity:{{o.opacity}};transform:translateY({{o.y}}px);'
'visibility:{{o.vis}}">'
  '<div class="mega-in">'
    '<div><h4>Efter typ</h4><ul>'
      '<li><a href="#">Matchreferat<small>Varje match, samma kväll</small></a></li>'
      '<li><a href="#">Spelarbetyg<small>Hela laget, satt av redaktionen</small></a></li>'
      '<li><a href="#">Inför match<small>Laguppställning, form och oddsen</small></a></li>'
    '</ul></div>'
    '<div><h4>Läsning</h4><ul>'
      '<li><a href="#">Krönikor<small>Längre texter av medlemmar</small></a></li>'
      '<li><a href="#">Intervjuer<small>Profiler i och utanför föreningen</small></a></li>'
      '<li><a href="#">Föreningsnytt<small>Årsmöten, resor och beslut</small></a></li>'
    '</ul></div>'
    '<div>'
      '<h4>Senast publicerat</h4>'
      '<a class="gz" href="#" style="display:block;padding-top:6px">'
        '<span class="ph" style="aspect-ratio:380 / 200;display:block;border-radius:6px">'
        '<span class="zoom" style="position:absolute;inset:0">' + mono(52) + '</span></span>'
        '<span style="display:block;font:700 10px/1 var(--sans);letter-spacing:.15em;'
        'text-transform:uppercase;color:var(--blue);margin-top:14px">Krönika</span>'
        '<span class="hl" style="display:block;font:600 19px/1.24 var(--disp);'
        'color:var(--ink);margin-top:8px">Sju mål på Stamford Bridge — och ändå '
        'är det försvaret vi pratar om</span>'
      '</a>'
    '</div>'
  '</div>'
'</div>'
)

MATCHBAND = (
'<div style="background:var(--night);color:#fff">'
  '<div style="max-width:1440px;margin:0 auto;padding:0 64px;height:62px;'
  'display:flex;align-items:center;gap:24px">'
    '<span style="font:700 10px/1 var(--sans);letter-spacing:.20em;'
    'text-transform:uppercase;color:var(--gold)">Nästa match</span>'
    '<span style="font:600 14px/1 var(--sans)">Arsenal '
    '<span style="color:rgba(255,255,255,.4);margin:0 6px">—</span> Chelsea</span>'
    '<span style="width:5px;height:5px;border-radius:999px;'
    'background:rgba(255,255,255,.28)"></span>'
    '<span style="font:500 13px/1 var(--sans);color:rgba(255,255,255,.62)">'
    'sön 6 sep 17:30 · Emirates Stadium</span>'
    '<span style="margin-left:auto;font:700 11.5px/1 var(--sans);letter-spacing:.09em;'
    'text-transform:uppercase;color:var(--gold)">Se matchen med oss →</span>'
  '</div>'
'</div>'
)

PHONE_NAV = (
'<div class="mbar">'
  '<span style="display:flex;align-items:center;gap:9px">'
    '<span style="width:32px;height:32px;border-radius:999px;background:var(--blue);'
    'display:flex;align-items:center;justify-content:center">'
    + mono(18).replace('class="phm"', '').replace('position:absolute', '') + '</span>'
    '<span style="font:700 15px/1 var(--disp);letter-spacing:.05em;'
    'text-transform:uppercase;color:var(--blue-dk)">CSS</span>'
  '</span>'
  '<button type="button" class="burger" onClick="{{m.toggle}}" '
  'aria-label="Öppna meny" aria-expanded="{{m.expanded}}">'
    '<i style="top:0;transform:{{m.t1}}"></i>'
    '<i style="top:8px;opacity:{{m.o2}}"></i>'
    '<i style="top:16px;transform:{{m.t3}}"></i>'
  '</button>'
'</div>'
)

BODY = (
'<div style="width:1440px;background:var(--paper)">'

# 1
'<section class="stage">'
  + label('01', 'Standard', 'Vit rad, guldmarkör under aktiv flik, matchbandet under')
  + '<div class="frame">' + bar('Löpsedel') + MATCHBAND + '</div>'
'</section>'

# 2
'<section class="band"><div class="stage">'
  + label('02', 'Undermeny', 'Klicka på Artiklar — panelen visar typerna och senaste texten')
  + '<div class="frame" style="position:relative;padding-bottom:{{o.pad}}px">'
  + bar(None, button='Artiklar') + MEGA + '</div>'
  '</div>'
'</section>'

# 3
'<section class="stage">'
  + label('03', 'Vid scroll', 'Raden krymper till 58 px och lägger på en skugga')
  + '<div class="frame">' + bar('Matcher', mini=True) + '</div>'
'</section>'

# 4
'<section class="band"><div class="stage">'
  + label('04', 'Mobil', 'Klicka på hamburgaren i vänstra telefonen')
  + '<div style="display:flex;gap:40px;align-items:flex-start">'
    '<div class="phone">'
      + PHONE_NAV +
      '<div style="display:{{m.showDraw}}">'
        '<nav class="mdraw" aria-label="Meny"><ul>'
          '<li><a href="#">Löpsedel</a></li>'
          '<li><a href="#">Artiklar<span style="color:var(--gold);font-size:15px">+</span></a></li>'
          '<li><a href="#">Matcher<span style="color:var(--gold);font-size:15px">+</span></a></li>'
          '<li><a href="#">Föreningen<span style="color:var(--gold);font-size:15px">+</span></a></li>'
          '<li><a href="#">Guider<span style="color:var(--gold);font-size:15px">+</span></a></li>'
          '<li><a href="#">Podden</a></li>'
        '</ul>'
        '<a class="btn btn-gold" href="#" style="margin-top:24px;width:100%;'
        'justify-content:center">Bli medlem</a>'
        '<a href="#" style="display:block;text-align:center;margin-top:16px;'
        'font:600 12px/1 var(--sans);color:rgba(255,255,255,.6)">The Shed ↗</a>'
        '</nav>'
      '</div>'
      '<div style="display:{{m.showHero}}">'
        '<div style="background:var(--night);color:#fff;padding:12px 18px;'
        'display:flex;align-items:center;gap:10px">'
          '<span style="font:700 9px/1 var(--sans);letter-spacing:.18em;'
          'text-transform:uppercase;color:var(--gold)">Nästa</span>'
          '<span style="font:600 12.5px/1 var(--sans)">Arsenal — Chelsea</span>'
          '<span style="margin-left:auto;font:500 11.5px/1 var(--sans);'
          'color:rgba(255,255,255,.6)">sön 17:30</span>'
        '</div>'
        '<div class="mhero">'
          '<span class="ph" style="aspect-ratio:354 / 210;display:block;'
          'border-radius:6px">' + mono(50) + '</span>'
          '<span style="display:flex;align-items:center;gap:10px;margin-top:16px">'
          + gold_rule(22) + '<span class="kick" style="color:var(--gold-ink)">Krönika</span>'
          '</span>'
          '<h2 style="font:700 27px/1.04 var(--disp);letter-spacing:-.01em;'
          'color:var(--ink);margin-top:10px">Sju mål på Stamford Bridge — och '
          'ändå är det försvaret vi pratar om</h2>'
          '<p style="font:400 15px/1.55 var(--serif);color:var(--ink-2);'
          'margin-top:10px">Chelsea vann med 4–3 mot Brighton. Det var '
          'underhållande, och det var nervöst.</p>'
          '<p style="font:500 11.5px/1 var(--sans);color:var(--muted);'
          'margin-top:14px;padding-top:12px;border-top:1px solid var(--rule)">'
          'Redaktionen · 31 aug · 6 min</p>'
        '</div>'
      '</div>'
    '</div>'

    '<div style="max-width:360px;padding-top:8px">'
      '<h3 style="font:700 14px/1 var(--disp);letter-spacing:.14em;'
      'text-transform:uppercase;color:var(--ink);padding-bottom:14px;'
      'border-bottom:2px solid var(--ink)">Regler</h3>'
      '<ul style="margin-top:6px">'
      + ''.join('<li style="padding:14px 0;border-top:1px solid var(--rule);'
                'font:400 14.5px/1.6 var(--serif);color:var(--ink-2)">'
                '<b style="font-family:var(--sans);font-size:12.5px;font-weight:600;'
                'color:var(--ink);display:block;margin-bottom:3px">%s</b>%s</li>' % (h, b)
                for h, b in [
                  ('Träffytor', 'Allt klickbart är minst 44 px högt, även på mobil.'),
                  ('Guld betyder en sak', 'Guld markerar var du är och en enda '
                   'uppmaning per vy. Aldrig dekoration.'),
                  ('Undermenyer öppnas', 'Panelen öppnas på klick, inte hover — '
                   'det fungerar likadant med tangentbord och pekskärm.'),
                  ('The Shed ligger kvar', 'Forumet bor på SvenskaFans och '
                   'länkas alltid ut med en tydlig ikon.'),
                ])
      + '</ul>'
    '</div>'
  '</div>'
'</div></section>'

'</div>'
)

LOGIC = """
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { open: false, mob: false };
  }
  renderVals() {
    const open = this.state.open;
    const mob = this.state.mob;
    return {
      o: {
        toggle: () => this.setState({ open: !open }),
        expanded: open ? 'true' : 'false',
        opacity: open ? 1 : 0,
        y: open ? 0 : -8,
        vis: open ? 'visible' : 'hidden',
        pad: open ? 300 : 0,
        style: open ? 'color:#034694' : '',
      },
      m: {
        toggle: () => this.setState({ mob: !mob }),
        expanded: mob ? 'true' : 'false',
        showDraw: mob ? 'block' : 'none',
        showHero: mob ? 'none' : 'block',
        t1: mob ? 'translateY(8px) rotate(45deg)' : 'none',
        t3: mob ? 'translateY(-8px) rotate(-45deg)' : 'none',
        o2: mob ? 0 : 1,
      },
    };
  }
}
"""

PROPS = '{"$preview":{"width":1440,"height":1900}}'

if __name__ == '__main__':
    write('Navigation.dc.html', CSS, BODY, LOGIC, PROPS)
