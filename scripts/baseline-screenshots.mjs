// Phase 0 baseline screenshots (EXECUTION-PLAN Task 9, §7.4).
// Captures sm/md/lg/xl full-page screenshots of key routes against the running SSR server.
// Usage: URL=http://localhost:3000 node scripts/baseline-screenshots.mjs
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = process.env.URL || 'http://localhost:3000'
const OUT = 'docs/baseline-screenshots'
const breakpoints = [
  { name: 'sm', width: 375, height: 800 },
  { name: 'md', width: 768, height: 1024 },
  { name: 'lg', width: 1024, height: 800 },
  { name: 'xl', width: 1280, height: 900 },
]
const routes = [
  ['home', '/de/'],
  ['diagnostics', '/de/diagnostics'],
  ['articles', '/de/articles'],
  ['contact', '/de/contact'],
  ['notfound', '/de/this-route-does-not-exist'],
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()
let count = 0
const overflow = []
for (const bp of breakpoints) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height } })
  const page = await ctx.newPage()
  for (const [slug, path] of routes) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    await page.screenshot({ path: `${OUT}/${slug}-${bp.name}.png`, fullPage: true })
    // overflow assertion: document wider than viewport => horizontal scroll
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth)
    if (scrollW > bp.width + 1) overflow.push(`${slug}@${bp.name}: scrollWidth ${scrollW} > ${bp.width}`)
    count++
  }
  await ctx.close()
}
await browser.close()
console.log(`captured ${count} screenshots -> ${OUT}`)
console.log(overflow.length ? `OVERFLOW:\n${overflow.join('\n')}` : 'no horizontal overflow detected')
