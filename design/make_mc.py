# -*- coding: utf-8 -*-
from parts import *

CSS = HEADER_CSS + FOOTER_CSS + """
  .wrap{max-width:1440px;margin:0 auto;padding:0 64px}

  .head{padding:52px 0 40px;display:flex;align-items:flex-end;
        justify-content:space-between;gap:40px}
  .h1{font:700 50px/.98 var(--disp);letter-spacing:-.012em;color:var(--ink)}
  .h1s{font:400 16px/1.55 var(--serif);color:var(--ink-2);margin-top:12px;max-width:520px}
  .seg{display:inline-flex;padding:4px;background:var(--paper-deep);border-radius:999px;
       border:1px solid var(--rule);flex:none}
  .seg button{font:700 12px/1 var(--sans);letter-spacing:.10em;text-transform:uppercase;
    min-height:44px;padding:0 24px;border-radius:999px;border:0;cursor:pointer;background:transparent;
    color:var(--ink-2);transition:background-color .2s var(--ease),color .2s var(--ease)}
  .seg button:hover{color:var(--blue)}

  /* --- Resultattavla --- */
  .board{background:var(--night);color:#fff}
  .board-in{max-width:1440px;margin:0 auto;padding:0 64px;
            display:grid;grid-template-columns:1fr 1px 1fr}
  .bcell{padding:28px 0;display:flex;align-items:center;gap:28px}
  .bcell:last-child{padding-left:48px}
  .bsep{background:rgba(255,255,255,.12)}
  .blab{font:700 10px/1 var(--sans);letter-spacing:.20em;text-transform:uppercase;
        color:var(--gold);margin-bottom:12px}
  .bteam{display:flex;flex-direction:column;align-items:center;gap:9px;width:84px;flex:none}
  .bteam span:last-child{font:600 11.5px/1.25 var(--sans);text-align:center;
                         color:rgba(255,255,255,.82)}
  .bscore{font:700 46px/1 var(--disp);font-variant-numeric:tabular-nums;
          letter-spacing:-.035em}
  .bmeta{font:500 12px/1.6 var(--sans);color:rgba(255,255,255,.58)}
  .cd{display:flex;gap:14px}
  .cdu{text-align:center}
  .cdn{font:700 24px/1 var(--disp);font-variant-numeric:tabular-nums;display:block}
  .cdl{font:600 8.5px/1 var(--sans);letter-spacing:.16em;text-transform:uppercase;
       color:rgba(255,255,255,.45);display:block;margin-top:5px}

  /* --- Innehåll --- */
  .cols{display:grid;grid-template-columns:1fr 396px;gap:56px;padding:56px 0 72px;
        align-items:start}
  .tabs{display:flex;gap:0;border-bottom:2px solid var(--ink);margin-bottom:4px}
  .tabs button{font:700 13px/1 var(--disp);letter-spacing:.13em;text-transform:uppercase;
    padding:0 20px 16px;border:0;background:transparent;cursor:pointer;color:var(--muted);
    position:relative;transition:color .2s var(--ease)}
  .tabs button:first-child{padding-left:0}
  .tabs button:hover{color:var(--ink)}
  .tabmark{position:absolute;left:0;right:20px;bottom:-2px;height:2px}
  .tabs button:first-child .tabmark{left:0;right:20px}

  .lt{width:100%;border-collapse:collapse;font:500 13.5px/1 var(--sans)}
  .lt th{font:700 9.5px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;
         color:var(--muted);text-align:left;padding:18px 0 12px}
  .lt td{padding:13px 0;border-top:1px solid var(--rule);color:var(--ink-2)}
  .lt tr.me td{color:var(--blue);font-weight:700;background:rgba(3,70,148,.055)}
  .lt tr.me td:first-child{box-shadow:inset 3px 0 0 var(--blue)}
  .dot{display:inline-block;width:7px;height:7px;border-radius:999px;margin-right:4px}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);
      white-space:nowrap}
  abbr{text-decoration:none;border:0;cursor:help}

  .fx li{display:flex;align-items:center;gap:20px;padding:16px 0;
         border-top:1px solid var(--rule)}
  .fx li:first-child{border-top:0}
  .fx-d{font:600 12.5px/1.4 var(--sans);color:var(--ink-2);width:120px;flex:none;
        font-variant-numeric:tabular-nums}
  .fx-t{font:600 16px/1.25 var(--disp);color:var(--ink);flex:1}
  .fx-c{font:500 11.5px/1 var(--sans);color:var(--muted);flex:none}

  .side-h{font:700 13px/1 var(--disp);letter-spacing:.16em;margin:0;text-transform:uppercase;
          color:var(--ink);padding-bottom:16px;border-bottom:2px solid var(--ink)}
  .side li{padding:18px 0;border-top:1px solid var(--rule)}
  .side li:first-child{border-top:0}
  .side-k{font:700 10px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
          color:var(--blue)}
  .side-t{font:600 18px/1.24 var(--disp);color:var(--ink);margin-top:8px;display:block}
  .side-m{font:500 11.5px/1 var(--sans);color:var(--muted);margin-top:8px}
  .note{margin-top:18px;padding:16px 18px;border:1px solid var(--rule);
        border-radius:6px;background:var(--card);
        font:400 14px/1.55 var(--serif);color:var(--ink-2)}
"""

# --- byggstenar -----------------------------------------------------------

def team_cell(tag, name, bg):
    return ('<span class="bteam">'
            '<span style="display:inline-flex;align-items:center;justify-content:center;'
            'width:44px;height:44px;border-radius:999px;background:%s;color:#fff;'
            'font:700 13px/1 var(--sans)">%s</span><span>%s</span></span>' % (bg, tag, name))

def board(show_hole, cd, last, nxt):
    """Resultattavla. last/nxt = (hemma, borta, komp, meta) där lagen är
       (tag, namn, färg) och hemmalaget kan ha ett mål."""
    (lh, la, lscore, lcomp, lmeta) = last
    (nh, na, ncomp, nmeta) = nxt
    units = ''.join('<span class="cdu"><span class="cdn">{{%s.%s}}</span>'
                    '<span class="cdl">%s</span></span>' % (cd, k, l)
                    for k, l in [('d', 'dygn'), ('h', 'tim'), ('m', 'min'), ('s', 'sek')])
    return (
      '<div class="board" style="display:%s"><div class="board-in">'
        '<div class="bcell"><div style="flex:none">'
          '<p class="blab">Senaste match</p>'
          '<div style="display:flex;align-items:center;gap:22px">'
          + team_cell(*lh) +
          '<span class="bscore">%s</span>' % lscore
          + team_cell(*la) +
          '</div></div>'
          '<p class="bmeta" style="border-left:1px solid rgba(255,255,255,.12);'
          'padding-left:26px">%s<br>%s</p>' % (lcomp, lmeta) +
        '</div>'
        '<div class="bsep"></div>'
        '<div class="bcell"><div style="flex:none">'
          '<p class="blab">Nästa match</p>'
          '<div style="display:flex;align-items:center;gap:22px">'
          + team_cell(*nh) +
          '<span style="font:700 16px/1 var(--disp);letter-spacing:.16em;'
          'color:rgba(255,255,255,.32)">VS</span>'
          + team_cell(*na) +
          '</div></div>'
          '<div style="border-left:1px solid rgba(255,255,255,.12);padding-left:26px">'
          '<p class="bmeta" style="margin-bottom:12px">%s<br>%s</p>' % (ncomp, nmeta)
          + '<div class="cd">' + units + '</div></div>'
        '</div>'
      '</div></div>') % show_hole

def score(a, b):
    return ('%s<span style="color:rgba(255,255,255,.28);margin:0 9px">–</span>%s' % (a, b))

FORM = {'V': '#16a34a', 'O': '#94a3b8', 'F': '#f43f5e'}
FORM_ORD = {'V': 'vinst', 'O': 'oavgjort', 'F': 'förlust'}

def trow(pos, team, pl, w, dr, lo, gd, pts, form, me=False):
    dots = ''.join('<span class="dot" style="background:%s" title="%s"></span>'
                   % (FORM[f], FORM_ORD[f]) for f in form)
    if form:
        dots += ('<span class="sr">%s</span>'
                 % ', '.join(FORM_ORD[f] for f in form))
    return ('<tr class="%s"><td>%s</td><td style="font-weight:600">%s</td>'
            '<td style="text-align:center">%s</td><td style="text-align:center">%s</td>'
            '<td style="text-align:center">%s</td><td style="text-align:center">%s</td>'
            '<td style="text-align:center">%s</td>'
            '<td><span style="display:inline-flex">%s</span></td>'
            '<td style="text-align:right;font-weight:700">%s</td></tr>'
            % ('me' if me else '', pos, team, pl, w, dr, lo, gd, dots, pts))

def table(show_hole, caption, rows, note=None):
    cols = [('S', 'Spelade'), ('V', 'Vunna'), ('O', 'Oavgjorda'), ('F', 'Förlorade')]
    mid = ''.join('<th scope="col" style="text-align:center;width:48px">'
                  '<abbr title="%s">%s</abbr></th>' % (long, short) for short, long in cols)
    head = ('<thead><tr><th scope="col" style="width:34px">'
            '<abbr title="Placering">#</abbr></th><th scope="col">Lag</th>' + mid +
            '<th scope="col" style="text-align:center;width:56px">'
            '<abbr title="Målskillnad">+/−</abbr></th>'
            '<th scope="col" style="width:92px">Form</th>'
            '<th scope="col" style="text-align:right;width:40px">'
            '<abbr title="Poäng">P</abbr></th></tr></thead>')
    cap = ('<caption style="caption-side:top;text-align:left;font:500 12px/1 var(--sans);'
           'color:var(--muted);padding:20px 0 0">%s</caption>' % caption)
    body = '<tbody>' + ''.join(rows) + '</tbody>'
    extra = ('<p class="note">%s</p>' % note) if note else ''
    return ('<div style="display:%s"><table class="lt">%s%s%s</table>%s</div>'
            % (show_hole, cap, head, body, extra))

def fixtures(show_hole, rows):
    lis = ''.join('<li><span class="fx-d">%s</span><span class="fx-t">%s</span>'
                  '<span class="fx-c">%s</span></li>' % r for r in rows)
    return ('<div style="display:%s"><ul class="fx" style="margin-top:24px">%s</ul></div>'
            % (show_hole, lis))

CHE = ('CHE', 'Chelsea', '#034694')
CHEW = ('CHE', 'Chelsea Women', '#034694')

BODY = (
'<div style="width:1440px;background:var(--paper)">'
+ header('Matcher', 'var(--gold)') +

'<section class="wrap"><div class="head">'
  '<div>'
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'
    + gold_rule(30) + '<span class="kick" style="color:var(--gold-ink)">Matcher</span></div>'
    '<h1 class="h1">Matchcenter</h1>'
    '<p class="h1s">Senaste och nästa match, tabell och kommande möten — '
    'hämtat direkt från Chelsea FC.</p>'
  '</div>'
  '<div class="seg" role="group" aria-label="Välj lag">'
    '<button type="button" style="{{t0.style}}" onClick="{{t0.pick}}" aria-pressed="{{t0.on}}">Herrar</button>'
    '<button type="button" style="{{t1.style}}" onClick="{{t1.pick}}" aria-pressed="{{t1.on}}">Damer</button>'
  '</div>'
'</div></section>'

+ board('{{boardH}}', 'cdH',
        (CHE, ('BHA', 'Brighton', '#0057B8'), score(4, 3),
         'Premier League', 'söndag 30 augusti · Stamford Bridge'),
        (('ARS', 'Arsenal', '#C81326'), CHE,
         'Premier League', 'söndag 6 september 17:30 · Emirates Stadium'))

+ board('{{boardD}}', 'cdD',
        (('RSO', 'Real Sociedad', '#0067B1'), CHEW, score(0, 1),
         'Women’s Champions League – kval',
         'onsdag 2 september · Estadio Izan · 6–2 sammanlagt'),
        (CHEW, ('AVL', 'Aston Villa', '#670E36'),
         'Barclays Women’s Super League',
         'lördag 5 september 13:30 · Stamford Bridge'))

+ '<section class="wrap"><div class="cols"><div>'
  '<div class="tabs" role="group" aria-label="Visa">'
    '<button type="button" style="{{b0.style}}" onClick="{{b0.pick}}" aria-pressed="{{b0.on}}">Tabell'
    '<span class="tabmark" style="background:{{b0.mark}}"></span></button>'
    '<button type="button" style="{{b1.style}}" onClick="{{b1.pick}}" aria-pressed="{{b1.on}}">Kommande'
    '<span class="tabmark" style="background:{{b1.mark}}"></span></button>'
  '</div>'

+ table('{{tblH}}', 'Premier League · 2026/27', [
    trow(1, 'Man City', 2, 2, 0, 0, '+4', 6, 'VV'),
    trow(2, 'Arsenal', 2, 2, 0, 0, '+4', 6, 'VV'),
    trow(3, 'Hull City', 2, 2, 0, 0, '+3', 6, 'VV'),
    trow(4, 'Chelsea', 2, 2, 0, 0, '+2', 6, 'VV', me=True),
    trow(5, 'Brentford', 2, 1, 1, 0, '+3', 4, 'OV'),
    trow(6, 'Newcastle', 2, 1, 1, 0, '+2', 4, 'VO'),
    trow(7, 'Everton', 2, 1, 1, 0, '+2', 4, 'OV'),
    trow(8, 'Leeds', 2, 1, 1, 0, '+1', 4, 'OV'),
  ])

+ table('{{tblD}}', 'Barclays Women’s Super League · 2026/27', [
    trow(1, 'Arsenal Women', 0, 0, 0, 0, '0', 0, ''),
    trow(2, 'Aston Villa Women', 0, 0, 0, 0, '0', 0, ''),
    trow(3, 'Birmingham City Women', 0, 0, 0, 0, '0', 0, ''),
    trow(4, 'Brighton Women', 0, 0, 0, 0, '0', 0, ''),
    trow(5, 'Chelsea Women', 0, 0, 0, 0, '0', 0, '', me=True),
    trow(6, 'Everton Women', 0, 0, 0, 0, '0', 0, ''),
    trow(7, 'Leicester City Women', 0, 0, 0, 0, '0', 0, ''),
    trow(8, 'Liverpool Women', 0, 0, 0, 0, '0', 0, ''),
  ], note='Serien har inte startat än. Tabellen fylls i så fort den första '
          'omgången är spelad.')

+ fixtures('{{fxH}}', [
    ('sön 6 sep 17:30', 'Arsenal – Chelsea', 'Premier League'),
    ('ons 9 sep 21:00', 'Chelsea – Leeds United', 'Carabao Cup'),
    ('lör 12 sep 15:00', 'Chelsea – Hull City', 'Premier League'),
    ('fre 18 sep 20:00', 'Brentford – Chelsea', 'Premier League'),
    ('lör 10 okt 15:00', 'Chelsea – Bournemouth', 'Premier League'),
  ])

+ fixtures('{{fxD}}', [
    ('lör 5 sep 13:30', 'Chelsea Women – Aston Villa Women', 'WSL'),
    ('sön 13 sep 13:00', 'Man United Women – Chelsea Women', 'WSL'),
    ('lör 19 sep 13:45', 'Chelsea Women – Birmingham City Women', 'WSL'),
    ('sön 27 sep 17:30', 'Chelsea Women – Arsenal Women', 'WSL'),
    ('sön 4 okt 15:00', 'West Ham Women – Chelsea Women', 'WSL'),
  ])

+ '<div style="display:flex;gap:12px;margin-top:32px">'
    '<a class="btn btn-line" href="#">Hela spelschemat</a>'
    '<a class="btn btn-line" href="#">Full tabell</a>'
  '</div>'
  '</div>'

  '<aside>'
    '<h2 class="side-h">Från matcherna</h2>'
    '<ul class="side">'
      '<li><a class="gz" href="#" style="display:block">'
      '<span class="side-k">Spelarbetyg</span>'
      '<span class="side-t hl">Spelarbetyg: Chelsea – Brighton</span>'
      '<span class="side-m">31 aug · Redaktionen</span></a></li>'
      '<li><a class="gz" href="#" style="display:block">'
      '<span class="side-k">Matchreferat</span>'
      '<span class="side-t hl">Fyra framåt, tre bakåt och tre poäng kvar i London</span>'
      '<span class="side-m">30 aug · Redaktionen</span></a></li>'
      '<li><a class="gz" href="#" style="display:block">'
      '<span class="side-k">Inför match</span>'
      '<span class="side-t hl">Inför Arsenal borta: tre frågor före derbyt</span>'
      '<span class="side-m">4 sep · Redaktionen</span></a></li>'
    '</ul>'
    '<div style="margin-top:28px;padding:22px 24px;background:var(--blue-dk);'
    'border-radius:6px;color:#fff">'
      '<p class="kick" style="color:var(--gold)">Mötesplatser</p>'
      '<h2 style="font:600 19px/1.3 var(--disp);margin-top:10px">Var ses vi på söndag?</h2>'
      '<p style="font:400 14px/1.6 var(--serif);color:rgba(255,255,255,.78);'
      'margin-top:8px">[ANTAL] pubar i landet visar Arsenal–Chelsea. Hitta den närmaste.</p>'
      '<a href="#" style="display:inline-flex;align-items:center;gap:7px;margin-top:14px;'
      'font:700 11.5px/1 var(--sans);letter-spacing:.09em;text-transform:uppercase;'
      'color:var(--gold)">Se mötesplatser'
      '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
      'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      '<path d="m9 6 6 6-6 6"/></svg></a>'
    '</div>'
  '</aside>'
'</div></section>'

+ footer() +
'</div>'
)

LOGIC = """
/* Ingen sc-for och ingen sc-if: allt innehåll ligger som vanlig HTML, och
   logiken styr bara VAD som syns. Det gör texten redigerbar direkt i canvasen
   och håller mallen ur vägen för HTML-parserns tabellregler. */
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.kickoff = [
      Date.UTC(2026, 8, 6, 15, 30, 0),  /* Arsenal–Chelsea, 17:30 svensk tid */
      Date.UTC(2026, 8, 5, 11, 30, 0)   /* Chelsea Women–Aston Villa, 13:30 */
    ];
    this.state = {
      team: 0,
      tab: 0,
      cd: [{ d: '00', h: '00', m: '00', s: '00' }, { d: '00', h: '00', m: '00', s: '00' }]
    };
  }
  componentDidMount() {
    this.update();
    this.timer = setInterval(() => this.update(), 1000);
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
  split(target) {
    let ms = target - Date.now();
    if (ms < 0) ms = 0;
    const t = Math.floor(ms / 1000);
    const p = (n) => (n < 10 ? '0' : '') + n;
    return {
      d: p(Math.floor(t / 86400)),
      h: p(Math.floor((t % 86400) / 3600)),
      m: p(Math.floor((t % 3600) / 60)),
      s: p(t % 60)
    };
  }
  update() {
    this.setState({ cd: [this.split(this.kickoff[0]), this.split(this.kickoff[1])] });
  }
  renderVals() {
    const on = 'background:#101B2B;color:#ffffff';
    const team = this.state.team;
    const tab = this.state.tab;
    const show = (yes) => (yes ? 'block' : 'none');
    return {
      cdH: this.state.cd[0],
      cdD: this.state.cd[1],
      boardH: show(team === 0),
      boardD: show(team === 1),
      tblH: show(team === 0 && tab === 0),
      tblD: show(team === 1 && tab === 0),
      fxH: show(team === 0 && tab === 1),
      fxD: show(team === 1 && tab === 1),
      t0: { pick: () => this.setState({ team: 0 }), style: team === 0 ? on : '', on: team === 0 ? 'true' : 'false' },
      t1: { pick: () => this.setState({ team: 1 }), style: team === 1 ? on : '', on: team === 1 ? 'true' : 'false' },
      b0: {
        pick: () => this.setState({ tab: 0 }),
        style: tab === 0 ? 'color:#101B2B' : '',
        mark: tab === 0 ? '#D4A843' : 'transparent',
        on: tab === 0 ? 'true' : 'false'
      },
      b1: {
        pick: () => this.setState({ tab: 1 }),
        style: tab === 1 ? 'color:#101B2B' : '',
        mark: tab === 1 ? '#D4A843' : 'transparent',
        on: tab === 1 ? 'true' : 'false'
      }
    };
  }
}
"""

PROPS = '{"$preview":{"width":1440,"height":1700}}'

if __name__ == '__main__':
    write('Matchcenter.dc.html', CSS, BODY, LOGIC, PROPS)
