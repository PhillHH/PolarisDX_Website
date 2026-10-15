import { chromium } from 'playwright'
const dir = new URL('.', import.meta.url).pathname
const pages = process.argv.slice(2)
const b = await chromium.launch()
for (const spec of pages) {
  const [name, q=''] = spec.split('?')
  for (const [vp, w, h, dpr] of [['desktop', 1440, 900, 1], ['mobile', 390, 844, 2]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr })
    const p = await ctx.newPage()
    await p.goto(`file://${dir}${name}.html${q ? '?' + q : ''}`, { waitUntil: 'networkidle' })
    await p.evaluate(() => document.fonts.ready)
    await p.waitForTimeout(300)
    await p.evaluate(() => document.body.classList.add('shot'))
    const tag = q ? '-' + q : ''
    await p.screenshot({ path: `${dir}out/${name}${tag}-${vp}.png`, fullPage: true })
    if (vp === 'mobile') { await p.evaluate(() => document.body.classList.remove('shot')); await p.screenshot({ path: `${dir}out/${name}${tag}-${vp}-top.png` }); const t = await p.$('[data-mshot]'); if (t) { await p.evaluate(() => { const e = document.querySelector('[data-mshot]'); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 70) }); await p.waitForTimeout(150); await p.screenshot({ path: `${dir}out/${name}${tag}-${vp}-scroll.png` }) } }
    await ctx.close()
  }
  console.log('ok', spec)
}
await b.close()
