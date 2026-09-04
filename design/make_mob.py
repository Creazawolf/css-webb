# -*- coding: utf-8 -*-
from parts import *

CSS = """
  .mbar{display:flex;align-items:center;justify-content:space-between;padding:0 18px;
        height:60px;background:var(--card);border-bottom:1px solid var(--rule)}
  .band{background:var(--night);color:#fff;padding:11px 18px;display:flex;
        align-items:center;gap:9px}
  .pad{padding:0 18px}
  .kickrow{display:flex;align-items:center;gap:10px;margin-top:16px}
  .h2{font:700 28px/1.03 var(--disp);letter-spacing:-.012em;color:var(--ink);margin-top:10px}
  .stand{font:400 15.5px/1.55 var(--serif);color:var(--ink-2);margin-top:10px}
  .meta{font:500 11.5px/1 var(--sans);color:var(--muted);margin-top:14px;
        padding-top:12px;border-top:1px solid var(--rule)}
  .sh{display:flex;align-items:flex-end;justify-content:space-between;
      padding-bottom:14px;border-bottom:2px solid var(--ink);margin-bottom:2px}
  .sh-t{font:700 17px/1 var(--disp);letter-spacing:.11em;text-transform:uppercase}
  .sh-l{font:700 10.5px/1 var(--sans);letter-spacing:.09em;text-transform:uppercase;
        color:var(--blue)}
  .row{padding:15px 0;border-top:1px solid var(--rule);display:flex;gap:14px;
       align-items:flex-start}
  .row:first-child{border-top:0}
  .row-k{font:700 9.5px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
         color:var(--blue)}
  .row-t{font:600 17px/1.22 var(--disp);color:var(--ink);margin-top:7px;display:block}
  .row-m{font:500 11px/1 var(--sans);color:var(--muted);margin-top:7px}
  .panel{background:var(--card);border:1px solid var(--rule);border-radius:6px;
         padding:18px 18px 16px;margin-top:16px}
  .team{display:flex;flex-direction:column;align-items:center;gap:7px;width:74px}
  .team span:last-child{font:600 11px/1.2 var(--sans);text-align:center;color:var(--ink-2)}
  .rail{display:flex;gap:14px;overflow:hidden;padding-right:18px}
  .ncard{width:214px;flex:none;border-radius:6px;overflow:hidden;
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12)}
"""

BODY = (
'<div style="width:390px;background:var(--paper);min-height:100%">'

'<div class="mbar">'
  '<span style="display:flex;align-items:center;gap:9px">'
    '<span style="width:32px;height:32px;border-radius:999px;background:var(--blue);'
    'display:flex;align-items:center;justify-content:center">'
    + mono(18).replace('class="phm"', '').replace('position:absolute', '') + '</span>'
    '<span style="font:700 15px/1 var(--disp);letter-spacing:.05em;'
    'text-transform:uppercase;color:var(--blue-dk)">CSS</span></span>'
  '<span style="display:flex;align-items:center;gap:16px">'
    '<span style="font:700 10.5px/1 var(--sans);letter-spacing:.08em;'
    'text-transform:uppercase;color:var(--blue)">Bli medlem</span>'
    '<span style="display:block;width:24px" aria-hidden="true">'
    '<span style="display:block;height:2px;background:var(--ink);border-radius:2px"></span>'
    '<span style="display:block;height:2px;background:var(--ink);border-radius:2px;'
    'margin-top:6px"></span>'
    '<span style="display:block;height:2px;background:var(--ink);border-radius:2px;'
    'margin-top:6px"></span></span>'
  '</span>'
'</div>'

'<div class="band">'
  '<span style="font:700 9px/1 var(--sans);letter-spacing:.18em;text-transform:uppercase;'
  'color:var(--gold);flex:none">Nästa</span>'
  '<span style="font:600 12.5px/1 var(--sans)">Arsenal — Chelsea</span>'
  '<span style="margin-left:auto;font:600 12px/1 var(--disp);'
  'font-variant-numeric:tabular-nums;color:rgba(255,255,255,.72);flex:none">'
  'sön 17:30</span>'
'</div>'

'<div class="pad" style="padding-top:18px">'
  '<span class="ph" style="aspect-ratio:354 / 208;display:block;border-radius:6px">'
  + mono(58) + '</span>'
  '<span class="kickrow">' + gold_rule(22)
  + '<span class="kick" style="color:var(--gold-ink)">Krönika</span></span>'
  '<h2 class="h2">Sju mål på Stamford Bridge — och ändå är det försvaret '
  'vi pratar om</h2>'
  '<p class="stand">Chelsea vann med 4–3 mot Brighton. Underhållande, nervöst, '
  'och precis den sortens match som avgör hur säsongen känns i mars.</p>'
  '<p class="meta">Redaktionen · 31 aug · 6 min läsning</p>'
'</div>'

'<div class="pad" style="padding-top:30px">'
  '<div class="sh"><span class="sh-t">Senaste</span>'
  '<span class="sh-l">Alla →</span></div>'
  + ''.join(
      '<a class="row" href="#"><span style="flex:1">'
      '<span class="row-k">%s</span><span class="row-t">%s</span>'
      '<span class="row-m">%s</span></span>'
      '<span class="ph" style="width:76px;height:76px;border-radius:5px;flex:none;'
      'margin-top:2px">%s</span></a>' % (k, t, m, mono(26))
      for k, t, m in [
        ('Spelarbetyg', 'Spelarbetyg: Chelsea – Brighton', '31 aug'),
        ('Matchreferat', 'Fyra framåt, tre bakåt och tre poäng kvar i London', '30 aug'),
        ('Inför match', 'Inför Arsenal borta: tre frågor före derbyt', '4 sep'),
      ])
+ '</div>'

'<div class="pad" style="padding-top:30px">'
  '<div class="sh"><span class="sh-t">Matchcenter</span>'
  '<span class="sh-l">Öppna →</span></div>'
  '<div class="panel">'
    '<p style="font:700 9.5px/1 var(--sans);letter-spacing:.16em;'
    'text-transform:uppercase;color:var(--muted)">Senaste · Premier League</p>'
    '<div style="display:flex;align-items:center;justify-content:center;gap:16px;'
    'padding:14px 0 12px">'
      '<span class="team">' + crest('CHE', '#034694', '#fff', 36, 11)
      + '<span>Chelsea</span></span>'
      '<span style="font:700 34px/1 var(--disp);font-variant-numeric:tabular-nums;'
      'letter-spacing:-.03em;color:var(--blue-dk)">4'
      '<span style="color:var(--rule-2);margin:0 5px">:</span>3</span>'
      '<span class="team">' + crest('BHA', '#0057B8', '#fff', 36, 11)
      + '<span>Brighton</span></span>'
    '</div>'
    '<p style="text-align:center;font:500 11px/1 var(--sans);color:var(--muted);'
    'padding-top:11px;border-top:1px solid var(--rule)">sön 30 aug · Stamford Bridge</p>'
  '</div>'
'</div>'

'<div style="background:var(--blue-dk);color:#fff;margin-top:30px;padding:26px 0 28px">'
  '<div class="pad" style="display:flex;align-items:flex-end;'
  'justify-content:space-between;padding-bottom:14px;'
  'border-bottom:2px solid rgba(255,255,255,.22);margin-bottom:16px">'
    '<span class="sh-t" style="color:#fff">Från Chelsea FC</span>'
    '<span class="sh-l" style="color:var(--gold)">chelseafc.com ↗</span>'
  '</div>'
  '<div class="pad"><div class="rail">'
    + ''.join(
      '<span class="ncard"><span class="ph" style="aspect-ratio:214 / 120;'
      'display:block">%s</span>'
      '<span style="display:block;padding:13px 14px 15px">'
      '<span style="font:700 9px/1 var(--sans);letter-spacing:.15em;'
      'text-transform:uppercase;color:var(--gold)">%s</span>'
      '<span style="display:block;font:600 15px/1.28 var(--disp);color:#fff;'
      'margin-top:8px">%s</span></span></span>' % (mono(38), k, t)
      for k, t in [
        ("Women's Team", 'An open letter to Chelsea supporters from captain Erin Cuthbert'),
        ("Men's Team", 'Carabao Cup ticket news: sales opening for members'),
      ])
  + '</div></div>'
'</div>'

'<div class="pad" style="padding-top:30px;padding-bottom:34px">'
  '<div style="background:var(--blue);color:#fff;border-radius:8px;padding:26px 22px">'
    '<p class="kick" style="color:var(--gold)">Bli medlem</p>'
    '<p style="font:700 25px/1.08 var(--disp);letter-spacing:-.005em;margin-top:10px">'
    'Sitt inte ensam framför matchen i höst</p>'
    '<p style="font:400 14.5px/1.6 var(--serif);color:rgba(255,255,255,.82);'
    'margin-top:10px">Mötesplatser i hela landet, resor till Stamford Bridge '
    'och förtur till biljetter.</p>'
    '<a class="btn btn-gold" href="#" style="margin-top:18px;width:100%;'
    'justify-content:center">Ansök om medlemskap</a>'
  '</div>'
'</div>'

'<div style="background:var(--night);color:rgba(255,255,255,.6);padding:22px 18px;'
'font:400 11.5px/1.7 var(--sans);text-align:center">'
  '© 2026 Chelsea Supporters Sweden<br>info@chelseasweden.se'
'</div>'

'</div>'
)

PROPS = '{"$preview":{"width":390,"height":2200}}'

if __name__ == '__main__':
    write('Mobil.dc.html', CSS, BODY, 'class Component extends DCLogic {}', PROPS)
