import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const declared = [4560, 1700, 3820, 1900, 2200]
const names = ['Löpsedel', 'Matchcenter', 'Artikelsida', 'Navigation', 'Mobil']
const warns = new Map()
const b = await chromium.launch({ args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } })
p.on('console', m => {
  const t = m.text()
  const hit = t.match(/\[dc-runtime\] (\w+):/)
  if (hit) warns.set(hit[1], (warns.get(hit[1]) || 0) + 1)
})
p.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0, 200)))
await p.goto('http://127.0.0.1:8799/matchtidningen.html', { waitUntil: 'load', timeout: 60000 })
await p.waitForTimeout(8000)
for (const x of [600, 1200, 1800, 2400]) { await p.mouse.move(800, 500); await p.mouse.wheel(x, 0); await p.waitForTimeout(2200) }
await p.waitForTimeout(8000)
const frames = p.frames().slice(1)
for (let i = 0; i < frames.length; i++) {
  try { await frames[i].waitForFunction(() => document.body && document.body.scrollHeight > 200, null, { timeout: 15000 }) } catch {}
  const r = await frames[i].evaluate(() => {
    const root = document.body.firstElementChild
    const rw = root ? root.getBoundingClientRect().width : 0
    let over = 0
    document.querySelectorAll('*').forEach(el => { if (el.getBoundingClientRect().width > rw + 1) over++ })
    return { w: Math.round(rw), h: Math.round(document.body.scrollHeight), over,
             txt: document.body.innerText.replace(/\s+/g, ' ').slice(0, 90) }
  }).catch(() => ({ w: 0, h: 0, over: 0, txt: 'ERR' }))
  console.log(`${names[i].padEnd(12)} ${String(r.w).padStart(4)}×${String(r.h).padStart(4)} ram=${declared[i]} ` +
    `${r.h > declared[i] ? 'KLIPPS' : 'ok    '} överbredd=${r.over}`)
}
console.log('--- oupplösta hål per artboard ---')
console.log(warns.size === 0 ? 'inga' : [...warns].map(([k, v]) => `${k}: ${v}`).join(', '))
await b.close()
