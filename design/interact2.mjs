import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const b = await chromium.launch({ args: ['--no-sandbox'] })
const p = await b.newPage({ viewport: { width: 1600, height: 1000 } })
await p.goto('http://127.0.0.1:8799/matchtidningen.html', { waitUntil: 'load', timeout: 60000 })
await p.waitForTimeout(8000)
for (const x of [600, 1200, 1800, 2400]) { await p.mouse.move(800,500); await p.mouse.wheel(x,0); await p.waitForTimeout(2000) }
await p.waitForTimeout(9000)

const find = async (sel) => {
  for (let tries = 0; tries < 20; tries++) {
    for (const fr of p.frames()) {
      const n = await fr.evaluate(s => document.querySelectorAll(s).length, sel).catch(() => 0)
      if (n) return fr
    }
    await p.mouse.move(800, 500); await p.mouse.wheel(-400, 0)
    await p.waitForTimeout(1500)
    await p.mouse.wheel(400, 0); await p.waitForTimeout(1500)
  }
  throw new Error('hittade ingen ram med ' + sel)
}
const mc = await find('.seg button')
const nav = await find('.navbtn')
const main = await find('.chip')
const art = await find('.prose')

const mcState = () => mc.evaluate(() => {
  const vis = el => getComputedStyle(el).display !== 'none'
  const caps = [...document.querySelectorAll('.lt')].filter(t => vis(t.closest('div'))).map(t => t.querySelector('caption').textContent.split('·')[0].trim())
  return {
    tavlor: [...document.querySelectorAll('.board')].filter(vis).length,
    tabeller: caps,
    kommande: [...document.querySelectorAll('.fx')].filter(u => vis(u.closest('div'))).length,
    nedrakning: [...document.querySelectorAll('.board')].filter(vis).flatMap(bd => [...bd.querySelectorAll('.cdn')].map(e => e.textContent)).join(':'),
    hojd: document.body.scrollHeight,
  }
})
const clickIn = (fr, sel, i = 0) => fr.evaluate(([s, n]) => {
  document.querySelectorAll(s)[n].click()
}, [sel, i])

console.log('MC start            ', JSON.stringify(await mcState()))
await clickIn(mc, '.seg button', 1); await p.waitForTimeout(1400)
console.log('MC efter DAMER      ', JSON.stringify(await mcState()))
await clickIn(mc, '.tabs button', 1); await p.waitForTimeout(1200)
console.log('MC efter KOMMANDE   ', JSON.stringify(await mcState()))
await clickIn(mc, '.seg button', 0); await p.waitForTimeout(1200)
console.log('MC efter HERRAR     ', JSON.stringify(await mcState()))

const navState = () => nav.evaluate(() => ({
  mega: getComputedStyle(document.querySelector('.mega')).visibility,
  lada: getComputedStyle(document.querySelector('.mdraw').parentElement).display,
}))
console.log('NAV start           ', JSON.stringify(await navState()))
await clickIn(nav, '.navbtn'); await p.waitForTimeout(900)
await clickIn(nav, '.burger'); await p.waitForTimeout(900)
console.log('NAV efter klick     ', JSON.stringify(await navState()))

const mainState = () => main.evaluate(() => ({
  kort: [...document.querySelectorAll('.grid3 > div')].filter(d => getComputedStyle(d).display !== 'none').length,
  aktiv: [...document.querySelectorAll('.chip')].filter(c => (c.getAttribute('style')||'').includes('101B2B')).map(c=>c.textContent).join(','),
  nedrakning: [...document.querySelectorAll('.mb-u')].map(e=>e.textContent).join(' '),
}))
console.log('LÖPSEDEL start      ', JSON.stringify(await mainState()))
await clickIn(main, '.chip', 2); await p.waitForTimeout(900)
console.log('LÖPSEDEL Spelarbetyg', JSON.stringify(await mainState()))

console.log('ARTIKEL             ', await art.evaluate(() => getComputedStyle(document.querySelector('.prose')).fontSize))
await clickIn(art, '.tool-row button', 2); await p.waitForTimeout(800)
console.log('ARTIKEL efter A+    ', await art.evaluate(() => getComputedStyle(document.querySelector('.prose')).fontSize))
await b.close()
