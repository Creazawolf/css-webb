# -*- coding: utf-8 -*-
"""Delade byggstenar för designcanvasen. Alla artboards är fristående —
   inget delas i körtid — så tokens, header och sidfot dupliceras in i varje fil."""

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Oswald:wght@400;500;600;700&amp;'
         'family=Inter:wght@400;500;600;700&amp;'
         'family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;'
         '0,6..72,600;1,6..72,400&amp;display=swap">')

TOKENS = """
  :root{
    --paper:#F4F2EE; --paper-deep:#EBE7E0; --card:#FFFFFF;
    --ink:#101B2B; --ink-2:#3D4757; --muted:#5C6673;
    --rule:#DFDAD2; --rule-2:#C8C1B5; --rule-ctl:#8B8474;
    --blue:#034694; --blue-dk:#022B5C; --blue-lt:#0A5BB5; --night:#01142C;
    --gold:#D4A843; --gold-lt:#E8C96A; --gold-ink:#8A6A1E;
    --ease:cubic-bezier(.22,1,.36,1);
    --sans:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
    --disp:'Oswald',system-ui,'Arial Narrow',sans-serif;
    --serif:'Newsreader',Georgia,'Times New Roman',serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--paper);color:var(--ink);
       font-family:var(--sans);-webkit-font-smoothing:antialiased}
  a{color:inherit;text-decoration:none}
  a:hover{color:var(--blue)}
  h1,h2,h3,h4,p,ul,ol,figure{margin:0}
  ul{padding:0;list-style:none}

  .kick{font:700 11px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase}
  .disp{font-family:var(--disp);font-weight:700;letter-spacing:-.005em}
  .num{font-family:var(--disp);font-variant-numeric:tabular-nums;letter-spacing:-.02em}

  /* Platshållare för bild — medvetet grafisk, inte ett försök till foto */
  .ph{position:relative;background:var(--blue-dk);overflow:hidden}
  .ph::before{content:'';position:absolute;inset:0;
    background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 1px,transparent 1px 10px)}
  .phm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.20}

  .lift{transition:transform .25s var(--ease),box-shadow .25s var(--ease),
        border-color .25s var(--ease)}
  .lift:hover{transform:translateY(-3px);
    box-shadow:0 4px 12px rgba(2,32,69,.09),0 14px 32px rgba(2,32,69,.10)}
  .zoom{transition:transform .6s var(--ease)}
  .gz:hover .zoom{transform:scale(1.045)}
  .gz:hover .hl{color:var(--blue)}
  .hl{transition:color .2s var(--ease)}

  .rule3{height:3px;background:linear-gradient(90deg,var(--blue-dk),var(--blue) 55%,var(--gold))}
  .hr{height:1px;background:var(--rule);border:0}

  .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;font:700 12px/1 var(--sans);
       letter-spacing:.08em;text-transform:uppercase;border-radius:6px;
       padding:13px 20px;transition:background-color .2s var(--ease),color .2s var(--ease)}
  .btn-gold{background:var(--gold);color:var(--blue-dk)}
  .btn-gold:hover{background:var(--gold-lt);color:var(--blue-dk)}
  .btn-blue{background:var(--blue);color:#fff}
  .btn-blue:hover{background:var(--blue-dk);color:#fff}
  .btn-line{border:1px solid var(--rule-ctl);color:var(--ink-2);background:transparent}
  .btn-line:hover{border-color:var(--blue);color:var(--blue)}

  ::selection{background:var(--gold);color:var(--blue-dk)}
"""

def mono(size=64, color="#FFFFFF"):
    """Diskret CSS-monogram som markerar en bildplatshållare."""
    return (
        '<svg class="phm" width="%d" height="%d" viewBox="0 0 64 64" fill="none" '
        'aria-hidden="true">'
        '<circle cx="32" cy="32" r="30" stroke="%s" stroke-width="1.5"/>'
        '<path d="M32 12v40M12 32h40" stroke="%s" stroke-width="1"/>'
        '<circle cx="32" cy="32" r="12" stroke="%s" stroke-width="1.5"/>'
        '</svg>' % (size, size, color, color, color)
    )

def crest(initials, bg="#022B5C", fg="#FFFFFF", size=28, fs=10):
    return (
        '<span style="display:inline-flex;align-items:center;justify-content:center;'
        'width:%dpx;height:%dpx;border-radius:999px;background:%s;color:%s;'
        'font:700 %dpx/1 \'Inter\',sans-serif;letter-spacing:.02em;flex:none">%s</span>'
        % (size, size, bg, fg, fs, initials)
    )

def gold_rule(w=28, accent="var(--gold)"):
    return ('<span style="display:block;width:%dpx;height:3px;background:%s;'
            'border-radius:2px" aria-hidden="true"></span>' % (w, accent))


NAV = ['Löpsedel', 'Artiklar', 'Matcher', 'Föreningen', 'Guider', 'Podden']

HEADER_CSS = """
  .hdr{background:var(--card);border-bottom:1px solid var(--rule);
       position:relative;z-index:20}
  .hdr-in{max-width:1440px;margin:0 auto;padding:0 64px;height:76px;
          display:flex;align-items:center;gap:40px}
  .brand{display:flex;align-items:center;gap:12px;flex:none}
  .brand-mark{width:40px;height:40px;border-radius:999px;background:var(--blue);
    display:flex;align-items:center;justify-content:center;flex:none}
  .brand-name{font:700 18px/1.05 var(--disp);letter-spacing:.04em;
    text-transform:uppercase;color:var(--blue-dk);display:block}
  .brand-sub{font:700 9.5px/1 var(--sans);letter-spacing:.28em;
    text-transform:uppercase;color:var(--gold-ink);display:block;margin-top:3px}
  .nav{display:flex;align-items:center;gap:2px;flex:1}
  .nav a{position:relative;padding:26px 13px;font:600 12px/1 var(--sans);
    letter-spacing:.11em;text-transform:uppercase;color:var(--ink-2);
    transition:color .18s var(--ease)}
  .nav a:hover{color:var(--blue)}
  .nav a[aria-current]{color:var(--blue-dk)}
  .nav-mark{position:absolute;left:13px;right:13px;bottom:-1px;height:2px;border-radius:2px}
  .nav-caret{margin-left:5px;opacity:.45}
  .hdr-cta{display:flex;align-items:center;gap:14px;flex:none}
  .shed{font:600 12px/1 var(--sans);letter-spacing:.06em;color:var(--muted);
    display:inline-flex;align-items:center;gap:6px;transition:color .18s var(--ease)}
  .shed:hover{color:var(--blue)}
"""

def header(active='Löpsedel', accent='var(--gold)'):
    items = []
    for label in NAV:
        cur = ' aria-current="page"' if label == active else ''
        caret = ('<svg class="nav-caret" width="9" height="9" viewBox="0 0 24 24" '
                 'fill="none" stroke="currentColor" stroke-width="3" '
                 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
                 '<path d="m6 9 6 6 6-6"/></svg>'
                 ) if label in ('Artiklar', 'Matcher', 'Föreningen', 'Guider') else ''
        mark = ('<span class="nav-mark" style="background:%s"></span>' % accent) if label == active else ''
        items.append('<a href="#"%s>%s%s%s</a>' % (cur, label, caret, mark))
    return """
<header class="hdr">
  <div class="rule3"></div>
  <div class="hdr-in">
    <a class="brand" href="#" aria-label="Chelsea Supporters Sweden — startsidan">
      <span class="brand-mark">""" + mono(22) .replace('class="phm"','').replace('position:absolute','') + """</span>
      <span>
        <span class="brand-name">Chelsea Supporters</span>
        <span class="brand-sub">Sweden</span>
      </span>
    </a>
    <nav class="nav" aria-label="Huvudmeny">""" + ''.join(items) + """</nav>
    <div class="hdr-cta">
      <a class="shed" href="#">The Shed
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 17 17 7M9 7h8v8"/></svg>
      </a>
      <a class="btn btn-blue" href="#">Bli medlem</a>
    </div>
  </div>
</header>"""


FOOTER_CSS = """
  .ft{background:var(--night);color:#fff;padding:64px 64px 0}
  .ft-in{max-width:1440px;margin:0 auto}
  .ft-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;
           padding-bottom:56px}
  .ft h4{font:700 11px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;
         color:rgba(255,255,255,.55);margin-bottom:18px}
  .ft li+li{margin-top:11px}
  .ft li a{font:400 13.5px/1.4 var(--sans);color:rgba(255,255,255,.78);
           transition:color .18s var(--ease)}
  .ft li a:hover{color:var(--gold-lt)}
  .ft-bot{border-top:1px solid rgba(255,255,255,.10);padding:20px 0;
    display:flex;justify-content:space-between;align-items:center;
    font:400 11.5px/1 var(--sans);color:rgba(255,255,255,.52)}
"""

def footer():
    cols = [
        ('Innehåll', ['Löpsedel', 'Artiklar', 'Matchreferat', 'Spelarbetyg', 'ChelseaPodden']),
        ('Matcher', ['Matchcenter', 'Spelschema', 'Tabell', 'Mötesplatser', 'Biljetter']),
        ('Föreningen', ['Bli medlem', 'Evenemang', 'Om oss', 'Redaktionen', 'Kontakt']),
    ]
    out = []
    for title, links in cols:
        lis = ''.join('<li><a href="#">%s</a></li>' % l for l in links)
        out.append('<div><h4>%s</h4><ul>%s</ul></div>' % (title, lis))
    return """
<footer class="ft">
  <div class="ft-in">
    <div class="ft-grid">
      <div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="width:40px;height:40px;border-radius:999px;
                background:rgba(255,255,255,.09);display:flex;align-items:center;
                justify-content:center">""" + mono(22).replace('class="phm"','').replace('position:absolute','') + """</span>
          <span>
            <span style="font:700 15px/1.05 var(--disp);letter-spacing:.04em;
                  text-transform:uppercase;display:block">Chelsea Supporters</span>
            <span style="font:700 9px/1 var(--sans);letter-spacing:.28em;
                  text-transform:uppercase;color:var(--gold);display:block;
                  margin-top:3px">Sweden</span>
          </span>
        </div>
        <p style="margin-top:18px;max-width:280px;font:400 13.5px/1.65 var(--sans);
                  color:rgba(255,255,255,.68)">
          Sveriges supporterförening för Chelsea FC. Matchkvällar, resor,
          referat och gemenskap sedan [GRUNDAT ÅR].
        </p>
        <a href="#" style="margin-top:18px;display:inline-flex;align-items:center;gap:7px;
           font:600 12.5px/1 var(--sans);color:var(--gold)">
          Diskutera i The Shed
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
               aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      </div>""" + ''.join(out) + """
    </div>
    <div class="ft-bot">
      <span>© 2026 Chelsea Supporters Sweden · Org.nr [ORGANISATIONSNUMMER]</span>
      <span>info@chelseasweden.se</span>
    </div>
  </div>
</footer>"""


def doc(css, body, logic=None, props=None):
    """Bygger en komplett .dc.html. Head-raden med support.js måste stå kvar
       exakt som den är — editorn byter ut den mot sin körtid vid rendering."""
    head = ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n'
            '  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n'
            '<helmet>\n  ' + FONTS + '\n  <style>' + TOKENS + css + '\n  </style>\n</helmet>\n')
    tail = '</x-dc>\n'
    if logic is not None:
        attr = ''
        if props:
            attr = " data-props='" + props.replace('&', '&amp;').replace("'", '&#39;') + "'"
        tail += '<script data-dc-script' + attr + '>\n' + logic + '\n</script>\n'
    return head + body + '\n' + tail + '</body>\n</html>\n'


def write(name, css, body, logic=None, props=None):
    import io
    src = doc(css, body, logic, props)
    io.open(name, 'w', encoding='utf-8').write(src)
    print('%-22s %6d tecken' % (name, len(src)))
