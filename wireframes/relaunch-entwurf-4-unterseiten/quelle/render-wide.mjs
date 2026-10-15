import { chromium } from 'playwright'
const dir = new URL('.', import.meta.url).pathname
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1.5 })
await p.goto(`file://${dir}${process.argv[2]}.html`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready)
await p.screenshot({ path: `${dir}out/${process.argv[2]}.png`, fullPage: true }); await b.close()
