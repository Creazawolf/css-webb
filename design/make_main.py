# -*- coding: utf-8 -*-
from parts import *

CSS = HEADER_CSS + FOOTER_CSS + """
  .wrap{max-width:1440px;margin:0 auto;padding:0 64px}
  .sec{padding-top:var(--secpad,64px);padding-bottom:var(--secpad,64px)}

  /* --- Matchband --- */
  .mb{background:var(--night);color:#fff}
  .mb-in{max-width:1440px;margin:0 auto;padding:0 64px;height:62px;
         display:flex;align-items:center;gap:28px}
  .mb-lab{font:700 10px/1 var(--sans);letter-spacing:.20em;text-transform:uppercase;
          color:var(--gold);flex:none}
  .mb-fix{display:flex;align-items:center;gap:12px;font:600 14px/1 var(--sans)}
  .mb-dot{width:5px;height:5px;border-radius:999px;background:rgba(255,255,255,.28)}
  .mb-cd{display:flex;align-items:baseline;gap:5px;margin-left:auto}
  .mb-u{font:700 17px/1 var(--disp);font-variant-numeric:tabular-nums;
        letter-spacing:.02em}
  .mb-us{font:600 9px/1 var(--sans);letter-spacing:.14em;text-transform:uppercase;
         color:rgba(255,255,255,.5);margin-left:1px}
  .mb-cta{font:700 11.5px/1 var(--sans);letter-spacing:.09em;text-transform:uppercase;
     color:var(--gold);display:inline-flex;align-items:center;gap:7px;
     padding-left:28px;border-left:1px solid rgba(255,255,255,.14);margin-left:4px}
  .mb-cta:hover{color:var(--gold-lt)}

  /* --- Löpsedel --- */
  .hero{display:grid;grid-template-columns:884px 380px;gap:48px;align-items:start}
  .lead-h{font-family:var(--disp);font-weight:700;font-size:52px;line-height:1.0;
          letter-spacing:-.012em;color:var(--ink);margin-top:14px}
  .lead-s{font-family:var(--serif);font-weight:400;font-size:20px;line-height:1.55;
          color:var(--ink-2);margin-top:16px;max-width:740px;text-wrap:pretty}
  .byl{display:flex;align-items:center;gap:10px;margin-top:22px;padding-top:16px;
       border-top:1px solid var(--rule);font:500 12px/1 var(--sans);color:var(--muted)}
  .byl b{color:var(--ink-2);font-weight:600}

  .rail-h{display:flex;align-items:center;gap:12px;padding-bottom:16px}
  .rail-t{font:700 13px/1 var(--disp);letter-spacing:.16em;text-transform:uppercase;
          color:var(--ink)}
  .rail li{padding:18px 0;border-top:1px solid var(--rule)}
  .rail li:first-child{border-top:1px solid var(--rule-2)}
  .rail-k{font:700 10px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
          color:var(--blue)}
  .rail-n{font:600 19px/1.22 var(--disp);letter-spacing:.005em;color:var(--ink);
          margin-top:8px;display:block}
  .rail-m{font:500 11.5px/1 var(--sans);color:var(--muted);margin-top:8px}

  /* --- Sektionshuvud --- */
  .sh{display:flex;align-items:flex-end;justify-content:space-between;
      gap:24px;padding-bottom:22px;margin-bottom:28px;border-bottom:2px solid var(--ink)}
  .sh-t{font:700 26px/1 var(--disp);letter-spacing:.06em;text-transform:uppercase;
        color:var(--ink)}
  .sh-s{font:400 13px/1.4 var(--serif);color:var(--muted);font-style:italic;
        margin-top:7px}
  .chips{display:flex;gap:6px;flex-wrap:wrap}
  .chip{font:600 11.5px/1 var(--sans);letter-spacing:.06em;text-transform:uppercase;
        display:inline-flex;align-items:center;min-height:44px;padding:0 16px;
        border-radius:999px;cursor:pointer;border:1px solid var(--rule-ctl);
        background:transparent;color:var(--ink-2);transition:all .18s var(--ease)}
  .chip:hover{border-color:var(--blue);color:var(--blue)}

  /* --- Kort --- */
  .grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
  .card{background:var(--card);border:1px solid var(--rule);border-radius:6px;
        overflow:hidden;display:flex;flex-direction:column;height:100%}
  .card-b{padding:20px 20px 22px;display:flex;flex-direction:column;flex:1}
  .card-k{font:700 10px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
          color:var(--blue)}
  .card-t{font:600 20px/1.24 var(--disp);letter-spacing:.005em;margin-top:10px;
          color:var(--ink)}
  .card-e{font:400 14px/1.6 var(--serif);color:var(--ink-2);margin-top:10px}
  .card-m{font:500 11.5px/1 var(--sans);color:var(--muted);margin-top:auto;
          padding-top:16px}

  /* --- Matchcenterband --- */
  .mc{background:var(--paper-deep);border-top:1px solid var(--rule);
      border-bottom:1px solid var(--rule)}
  .mc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
  .panel{background:var(--card);border:1px solid var(--rule);border-radius:6px;
         padding:22px 24px}
  .panel-h{font:700 10px/1 var(--sans);letter-spacing:.17em;text-transform:uppercase;
           color:var(--muted);padding-bottom:16px;margin-bottom:16px;
           border-bottom:1px solid var(--rule)}
  .score{display:flex;align-items:center;justify-content:center;gap:18px;padding:6px 0 10px}
  .score-n{font:700 40px/1 var(--disp);font-variant-numeric:tabular-nums;
           letter-spacing:-.03em;color:var(--blue-dk)}
  .team{display:flex;flex-direction:column;align-items:center;gap:8px;width:78px}
  .team span:last-child{font:600 11.5px/1.25 var(--sans);text-align:center;color:var(--ink-2)}
  .tbl{width:100%;border-collapse:collapse;font:500 12.5px/1 var(--sans)}
  .tbl th{font:700 9.5px/1 var(--sans);letter-spacing:.13em;text-transform:uppercase;
          color:var(--muted);text-align:left;padding-bottom:10px;font-weight:700}
  .tbl td{padding:9px 0;border-top:1px solid var(--rule);color:var(--ink-2)}
  .tbl tr.me td{color:var(--blue);font-weight:700;background:rgba(3,70,148,.05)}
  .dot{display:inline-block;width:6px;height:6px;border-radius:999px;margin-right:3px}

  /* --- Chelsea officiellt --- */
  .cfc{background:var(--blue-dk);color:#fff}
  .cfc .sh{border-bottom-color:rgba(255,255,255,.22)}
  .cfc .sh-t{color:#fff}
  .cfc .sh-s{color:rgba(255,255,255,.6)}
  .grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
  .ncard{border-radius:6px;overflow:hidden;background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.10);transition:border-color .25s var(--ease),
    background-color .25s var(--ease)}
  .ncard:hover{border-color:var(--gold);background:rgba(255,255,255,.09)}
  .ncard-b{padding:16px 17px 18px}
  .ncard-k{font:700 9.5px/1 var(--sans);letter-spacing:.15em;text-transform:uppercase;
           color:var(--gold)}
  .ncard-t{font:600 16px/1.3 var(--disp);color:#fff;margin-top:9px}

  /* --- Podd --- */
  .pod{display:grid;grid-template-columns:340px 1fr;gap:56px;align-items:center}
  .wave{display:flex;align-items:flex-end;gap:3px;height:34px}
  .wave i{display:block;width:3px;border-radius:2px;background:var(--blue);opacity:.35}

  /* --- Medlemskap --- */
  .cta{background:var(--blue);color:#fff;border-radius:8px;padding:48px 56px;
       display:flex;align-items:center;justify-content:space-between;gap:48px}
"""

# ---------------------------------------------------------------- markup

def rail_item(kick, title, meta):
    return ('<li><a class="gz" href="#" style="display:block">'
            '<span class="rail-k">%s</span>'
            '<span class="rail-n hl">%s</span>'
            '<span class="rail-m">%s</span></a></li>' % (kick, title, meta))

def card(idx, kick, title, excerpt, meta, ratio='416 / 260'):
    return ('<div style="display:{{v%d}}">'
            '<a class="card lift gz" href="#" style="display:flex">'
            '<span class="ph" style="aspect-ratio:%s;display:block">'
            '<span class="zoom" style="position:absolute;inset:0">%s</span></span>'
            '<span class="card-b">'
            '<span class="card-k">%s</span>'
            '<span class="card-t hl">%s</span>'
            '<span class="card-e">%s</span>'
            '<span class="card-m">%s</span>'
            '</span></a></div>'
            % (idx, ratio, mono(52), kick, title, excerpt, meta))

def ncard(kick, title):
    return ('<a class="ncard gz" href="#" target="_blank" style="display:block">'
            '<span class="ph" style="aspect-ratio:310 / 174;display:block">'
            '<span class="zoom" style="position:absolute;inset:0">%s</span></span>'
            '<span class="ncard-b"><span class="ncard-k">%s</span>'
            '<span class="ncard-t">%s</span></span></a>' % (mono(46), kick, title))

def trow(pos, team, pl, gd, pts, form, me=False):
    dots = ''.join('<span class="dot" style="background:%s"></span>'
                   % ('#16a34a' if f == 'V' else '#94a3b8' if f == 'O' else '#f43f5e')
                   for f in form)
    return ('<tr class="%s"><td style="width:26px">%s</td><td>%s</td>'
            '<td style="text-align:center;width:34px">%s</td>'
            '<td style="text-align:center;width:40px">%s</td>'
            '<td style="width:44px">%s</td>'
            '<td style="text-align:right;width:30px;font-weight:700">%s</td></tr>'
            % ('me' if me else '', pos, team, pl, gd, dots, pts))

BODY = (
'<div style="width:1440px;background:var(--paper);--secpad:{{pad}}px">'
+ header('Löpsedel', '{{accent}}') +

# --- Matchband -------------------------------------------------------------
"""
<div class="mb">
  <div class="mb-in">
    <span class="mb-lab">Nästa match</span>
    <span class="mb-fix">
      <span style="color:rgba(255,255,255,.62)">Premier League</span>
      <span class="mb-dot"></span>
      <span>Arsenal <span style="color:rgba(255,255,255,.4);margin:0 8px">–</span> Chelsea</span>
      <span class="mb-dot"></span>
      <span style="color:rgba(255,255,255,.62)">Emirates Stadium</span>
      <span class="mb-dot"></span>
      <span style="color:rgba(255,255,255,.62)">sön 6 sep 17:30</span>
    </span>
    <span class="mb-cd">
      <span class="mb-u">{{cd.d}}<span class="mb-us">dygn</span></span>
      <span class="mb-u">{{cd.h}}<span class="mb-us">tim</span></span>
      <span class="mb-u">{{cd.m}}<span class="mb-us">min</span></span>
      <span class="mb-u">{{cd.s}}<span class="mb-us">sek</span></span>
    </span>
    <a class="mb-cta" href="#">Se matchen med oss
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"
           aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></a>
  </div>
</div>
"""

# --- Löpsedel --------------------------------------------------------------
'<section class="wrap sec"><h1 class="sr-only" style="position:absolute;'
'width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">'
'Chelsea Supporters Sweden — senaste nytt</h1>'
'<div class="hero">'

  # lead
  '<article>'
    '<a class="gz" href="#" style="display:block">'
      '<span class="ph" style="aspect-ratio:884 / 497;display:block;border-radius:6px">'
        '<span class="zoom" style="position:absolute;inset:0">' + mono(88) + '</span></span>'
      '<span style="display:flex;align-items:center;gap:12px;margin-top:22px">'
        + gold_rule(30, '{{accent}}') +
        '<span class="kick" style="color:var(--gold-ink)">Krönika</span>'
      '</span>'
      '<h2 class="lead-h hl">Sju mål på Stamford Bridge — och ändå är det '
      'försvaret vi pratar om</h2>'
    '</a>'
    '<p class="lead-s">Chelsea vann med 4–3 mot Brighton. Det var underhållande, '
    'det var nervöst, och det var precis den sortens match som avgör hur den '
    'här säsongen kommer att kännas när vi tittar tillbaka i mars.</p>'
    '<p class="byl"><b>Redaktionen</b><span style="color:var(--rule-2)">·</span>'
    '31 augusti 2026<span style="color:var(--rule-2)">·</span>6 min läsning</p>'
  '</article>'

  # rail
  '<aside>'
    '<div class="rail-h">' + gold_rule(20, '{{accent}}') +
      '<span class="rail-t">Senaste</span></div>'
    '<ul class="rail">'
    + rail_item('Inför match', 'Inför Arsenal borta: tre frågor före derbyt', '4 sep · Redaktionen')
    + rail_item('Föreningsnytt', 'Bussen till London i november är fullbokad', '2 sep · Styrelsen')
    + rail_item('Spelarbetyg', 'Spelarbetyg: Chelsea – Brighton', '31 aug · Redaktionen')
    + rail_item('Matchreferat', 'Fyra framåt, tre bakåt och tre poäng kvar i London', '30 aug · Redaktionen')
    + '</ul>'
    '<a href="#" style="display:inline-flex;align-items:center;gap:7px;margin-top:22px;'
    'font:700 11.5px/1 var(--sans);letter-spacing:.09em;text-transform:uppercase;'
    'color:var(--blue)">Alla artiklar'
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="m9 6 6 6-6 6"/></svg></a>'
  '</aside>'
'</div></section>'

# --- Från redaktionen ------------------------------------------------------
'<section class="wrap" style="padding-bottom:64px">'
  '<div class="sh">'
    '<div><h2 class="sh-t">Från redaktionen</h2>'
    '<p class="sh-s">Referat, betyg och krönikor skrivna av medlemmar</p></div>'
    '<div class="chips">'
      '<button type="button" class="chip" style="{{f0.style}}" onClick="{{f0.pick}}" aria-pressed="{{f0.on}}">Alla</button>'
      '<button type="button" class="chip" style="{{f1.style}}" onClick="{{f1.pick}}" aria-pressed="{{f1.on}}">Matchreferat</button>'
      '<button type="button" class="chip" style="{{f2.style}}" onClick="{{f2.pick}}" aria-pressed="{{f2.on}}">Spelarbetyg</button>'
      '<button type="button" class="chip" style="{{f3.style}}" onClick="{{f3.pick}}" aria-pressed="{{f3.on}}">Krönika</button>'
      '<button type="button" class="chip" style="{{f4.style}}" onClick="{{f4.pick}}" aria-pressed="{{f4.on}}">Intervju</button>'
      '<button type="button" class="chip" style="{{f5.style}}" onClick="{{f5.pick}}" aria-pressed="{{f5.on}}">Inför match</button>'
    '</div>'
  '</div>'
  '<div class="grid3">'
  + card(1, 'Matchreferat', 'Chelsea 2–0 Luton: en cupkväll utan dramatik',
         'Aldrig hotat, aldrig direkt spännande — och precis så man vill ha en cupkväll i augusti.',
         '28 aug · 4 min')
  + card(2, 'Intervju', 'Möt gänget som drog igång CSS Göteborg',
         'Fyra personer, en pub och ett beslut att sluta titta på matcherna ensamma hemma.',
         '27 aug · 7 min')
  + card(3, 'Krönika', 'Damlaget förtjänar mer än en notis längst ner',
         'Vi bevakar Chelsea Women som om det vore en bisak. Det säger mer om oss än om laget.',
         '26 aug · 5 min')
  + card(4, 'Spelarbetyg', 'Spelarbetyg: Fulham – Chelsea',
         'En trea i botten och en åtta på mittfältet. Hela laget betygsatt av redaktionen.',
         '25 aug · 3 min')
  + card(5, 'Inför match', 'Inför Leeds hemma: vem får chansen i cupen?',
         'Roterar vi hela laget igen, och vem får chansen mellan stolparna?',
         '3 sep · 4 min')
  + card(6, 'Matchreferat', 'Fulham 2–3 Chelsea: sent, snålt och skönt',
         'Ett västlondonderby som svängde tre gånger innan det landade rätt.',
         '24 aug · 5 min')
  + '</div>'
'</section>'
)

BODY += (
# --- Matchcenterband -------------------------------------------------------
'<section class="mc"><div class="wrap sec">'
  '<div class="sh">'
    '<div><h2 class="sh-t">Matchcenter</h2>'
    '<p class="sh-s">Direkt från Chelsea FC — uppdateras automatiskt</p></div>'
    '<a href="#" style="font:700 11.5px/1 var(--sans);letter-spacing:.09em;'
    'text-transform:uppercase;color:var(--blue);display:inline-flex;align-items:center;'
    'gap:7px;padding-bottom:4px">Hela matchcentret'
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="m9 6 6 6-6 6"/></svg></a>'
  '</div>'
  '<div class="mc-grid">'

    # senaste
    '<div class="panel">'
      '<p class="panel-h">Senaste match · Premier League</p>'
      '<div class="score">'
        '<span class="team">' + crest('CHE', '#034694', '#fff', 40, 12) + '<span>Chelsea</span></span>'
        '<span class="score-n">4<span style="color:var(--rule-2);margin:0 8px">–</span>3</span>'
        '<span class="team">' + crest('BHA', '#0057B8', '#fff', 40, 12) + '<span>Brighton</span></span>'
      '</div>'
      '<p style="text-align:center;font:500 11.5px/1.5 var(--sans);color:var(--muted);'
      'padding-top:10px;border-top:1px solid var(--rule);margin-top:8px">'
      'sön 30 aug · Stamford Bridge</p>'
    '</div>'

    # nästa
    '<div class="panel">'
      '<p class="panel-h">Nästa match · Premier League</p>'
      '<div class="score">'
        '<span class="team">' + crest('ARS', '#C81326', '#fff', 40, 12) + '<span>Arsenal</span></span>'
        '<span style="font:700 15px/1 var(--disp);letter-spacing:.14em;color:var(--rule-2)">VS</span>'
        '<span class="team">' + crest('CHE', '#034694', '#fff', 40, 12) + '<span>Chelsea</span></span>'
      '</div>'
      '<p style="text-align:center;font:500 11.5px/1.5 var(--sans);color:var(--muted);'
      'padding-top:10px;border-top:1px solid var(--rule);margin-top:8px">'
      'sön 6 sep 17:30 · Emirates Stadium</p>'
    '</div>'

    # tabell
    '<div class="panel">'
      '<p class="panel-h">Premier League</p>'
      '<table class="tbl">'
        '<caption style="position:absolute;width:1px;height:1px;overflow:hidden;'
        'clip:rect(0,0,0,0)">Tabellställning, topp fem</caption>'
        '<thead><tr><th scope="col">#</th><th scope="col">Lag</th>'
        '<th scope="col" style="text-align:center">S</th>'
        '<th scope="col" style="text-align:center">+/−</th>'
        '<th scope="col">Form</th>'
        '<th scope="col" style="text-align:right">P</th></tr></thead>'
        '<tbody>'
        + trow(1, 'Man City', 2, '+4', 6, ['V', 'V'])
        + trow(2, 'Arsenal', 2, '+4', 6, ['V', 'V'])
        + trow(3, 'Hull City', 2, '+3', 6, ['V', 'V'])
        + trow(4, 'Chelsea', 2, '+2', 6, ['V', 'V'], me=True)
        + trow(5, 'Brentford', 2, '+3', 4, ['V', 'O'])
        + '</tbody></table>'
    '</div>'

  '</div></div></section>'

# --- Chelsea officiellt ----------------------------------------------------
'<section class="cfc"><div class="wrap sec">'
  '<div class="sh">'
    '<div><h2 class="sh-t">Från Chelsea FC</h2>'
    '<p class="sh-s">Klubbens egna nyheter — vi länkar alltid vidare</p></div>'
    '<a href="#" target="_blank" style="font:700 11.5px/1 var(--sans);letter-spacing:.09em;'
    'text-transform:uppercase;color:var(--gold);display:inline-flex;align-items:center;'
    'gap:7px;padding-bottom:4px">chelseafc.com'
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
    '<path d="M7 17 17 7M9 7h8v8"/></svg></a>'
  '</div>'
  '<div class="grid4">'
  + ncard("Women's Team", 'An open letter to Chelsea supporters from captain Erin Cuthbert')
  + ncard("Men's Team", 'Carabao Cup ticket news: sales opening for members')
  + ncard('Video', "Vote for your Men's Goal of the Month")
  + ncard('Video', 'Full Match: Chelsea vs Luton Town')
  + '</div>'
'</div></section>'

# --- Podden ----------------------------------------------------------------
'<section class="wrap sec"><div class="pod">'
  '<div>'
    '<div style="display:flex;align-items:center;gap:12px;margin-bottom:14px">'
    + gold_rule(24, '{{accent}}') +
    '<span class="kick" style="color:var(--gold-ink)">Podd</span></div>'
    '<h2 style="font:700 40px/.98 var(--disp);letter-spacing:-.01em;color:var(--ink)">'
    'Chelsea<br>Podden</h2>'
    '<p style="font:400 15px/1.6 var(--serif);color:var(--ink-2);margin-top:14px;'
    'max-width:300px">Varje vecka, i din poddspelare. Inför, efter och allt '
    'däremellan.</p>'
    '<a class="btn btn-blue" href="#" style="margin-top:20px">Lyssna på Spotify</a>'
  '</div>'
  '<div style="border-left:1px solid var(--rule);padding-left:56px">'
    '<p style="font:700 10px/1 var(--sans);letter-spacing:.17em;text-transform:uppercase;'
    'color:var(--muted)">Senaste avsnittet</p>'
    '<h3 style="font:600 28px/1.2 var(--disp);color:var(--ink);margin-top:12px;'
    'max-width:560px">Efter Brighton: sju mål, noll lugn och en '
    'försvarslinje att prata om</h3>'
    '<div style="display:flex;align-items:center;gap:20px;margin-top:20px">'
      '<span style="width:46px;height:46px;border-radius:999px;background:var(--blue);'
      'display:flex;align-items:center;justify-content:center;flex:none">'
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">'
      '<path d="M8 5v14l11-7z"/></svg></span>'
      '<span class="wave" aria-hidden="true">'
      + ''.join('<i style="height:%dpx"></i>' % h for h in
                [8,15,26,19,32,12,22,30,17,9,24,34,20,13,27,16,10,21,29,14,
                 8,18,25,11,31,17,9,23,15,7])
      + '</span>'
      '<span style="font:500 12px/1 var(--sans);color:var(--muted);flex:none">[LÄNGD]</span>'
    '</div>'
  '</div>'
'</div></section>'

# --- Medlemskap ------------------------------------------------------------
'<section class="wrap" style="padding-bottom:72px"><div class="cta">'
  '<div>'
    '<p class="kick" style="color:var(--gold-lt)">Bli medlem</p>'
    '<h2 style="font:700 34px/1.08 var(--disp);letter-spacing:-.005em;margin-top:12px;'
    'max-width:620px">Sitt inte ensam framför matchen i höst</h2>'
    '<p style="font:400 15.5px/1.6 var(--serif);color:rgba(255,255,255,.82);'
    'margin-top:12px;max-width:560px">Medlemskap i Chelsea Supporters Sweden ger '
    'dig mötesplatser i hela landet, resor till Stamford Bridge och förtur till '
    'biljetter. [MEDLEMSAVGIFT] kronor om året.</p>'
  '</div>'
  '<a class="btn btn-gold" href="#" style="flex:none;padding:16px 26px;font-size:13px;'
  'background:{{accent}}">Ansök om medlemskap</a>'
'</div></section>'

+ footer() +
'</div>'
)

LOGIC = """
class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { filter: 0, cd: { d: '00', h: '00', m: '00', s: '00' } };
  }
  componentDidMount() {
    this.update();
    this.timer = setInterval(() => this.update(), 1000);
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
  /* Avspark mot Arsenal: söndag 6 september 2026, 17:30 svensk tid = 15:30 UTC. */
  update() {
    let ms = Date.UTC(2026, 8, 6, 15, 30, 0) - Date.now();
    if (ms < 0) ms = 0;
    const t = Math.floor(ms / 1000);
    const p = (n) => (n < 10 ? '0' : '') + n;
    this.setState({
      cd: {
        d: p(Math.floor(t / 86400)),
        h: p(Math.floor((t % 86400) / 3600)),
        m: p(Math.floor((t % 3600) / 60)),
        s: p(t % 60),
      },
    });
  }
  renderVals() {
    const accent = this.props.accent || '#D4A843';
    const vals = {
      accent,
      pad: this.props.density === 'Kompakt' ? 40 : 64,
      cd: this.state.cd,
    };

    /* Filterknapparna. Kortens text ligger som vanlig HTML så att den går att
       skriva om direkt i canvasen — bara synligheten styrs härifrån. */
    const wanted = [null, 'Matchreferat', 'Spelarbetyg', 'Krönika', 'Intervju', 'Inför match'];
    wanted.forEach((_, i) => {
      const on = this.state.filter === i;
      vals['f' + i] = {
        pick: () => this.setState({ filter: i }),
        style: on ? 'background:#101B2B;border-color:#101B2B;color:#ffffff' : '',
        on: on ? 'true' : 'false',
      };
    });

    const cards = ['Matchreferat', 'Intervju', 'Krönika', 'Spelarbetyg', 'Inför match', 'Matchreferat'];
    const want = wanted[this.state.filter];
    cards.forEach((type, i) => {
      vals['v' + (i + 1)] = want === null || want === type ? 'block' : 'none';
    });

    return vals;
  }
}
"""

PROPS = ('{"accent":{"editor":"color","default":"#D4A843",'
         '"options":["#D4A843","#E8C96A","#B8912F","#C9A227"],"section":"Tema"},'
         '"density":{"editor":"enum","options":["Luftig","Kompakt"],'
         '"default":"Luftig","section":"Tema"},'
         '"$preview":{"width":1440,"height":4560}}')

if __name__ == '__main__':
    write('Main.dc.html', CSS, BODY, LOGIC, PROPS)
