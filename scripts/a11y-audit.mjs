// Phase 3/5 a11y gate (EXECUTION-PLAN §B Audit-Server, §1.15).
// Runs axe-core (WCAG 2.0/2.1/2.2 A+AA) against the running SSR server and asserts
// no horizontal overflow across breakpoints. Injects the installed axe-core source
// (no network). Usage: URL=http://localhost:3000 node scripts/a11y-audit.mjs
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')

const BASE = process.env.URL || 'http://localhost:3000'
const routes = [
  ['home', '/de/'],
  ['diagnostics', '/de/diagnostics'],
  ['articles', '/de/articles'],
  ['contact', '/de/contact'],
  ['imprint', '/de/imprint'],
  ['notfound', '/de/this-route-does-not-exist'],
]
const breakpoints = [
  { name: 'sm', width: 375, height: 800 },
  { name: 'xl', width: 1280, height: 900 },
]
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const browser = await chromium.launch()
const page = await browser.newPage()
let totalViolations = 0
const overflow = []

for (const [slug, path] of routes) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.addScriptTag({ content: axeSource })
  const results = await page.evaluate(
    async (tags) => await window.axe.run(document, { runOnly: { type: 'tag', values: tags } }),
    TAGS,
  )
  const critical = results.violations.filter(
    (v) => v.impact === 'critical' || v.impact === 'serious',
  )
  totalViolations += critical.length
  const line = critical.length
    ? `  VIOLATIONS:\n${critical.map((v) => `    [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} nodes)\n      e.g. ${v.nodes[0]?.target?.join(' ')}`).join('\n')}`
    : '  no critical/serious violations'
  console.log(`\n${slug} (${path}):\n${line}`)
}

// overflow assertion across breakpoints (Phase 4 DoD)
for (const bp of breakpoints) {
  const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height } })
  const p = await ctx.newPage()
  for (const [slug, path] of routes) {
    await p.goto(BASE + path, { waitUntil: 'networkidle' })
    const scrollW = await p.evaluate(() => document.documentElement.scrollWidth)
    if (scrollW > bp.width + 1) overflow.push(`${slug}@${bp.name}: ${scrollW} > ${bp.width}`)
  }
  await ctx.close()
}

await browser.close()
console.log(`\n=== SUMMARY ===`)
console.log(`axe critical/serious violations: ${totalViolations}`)
console.log(overflow.length ? `OVERFLOW:\n${overflow.join('\n')}` : 'no horizontal overflow')
process.exit(totalViolations > 0 || overflow.length > 0 ? 1 : 0)
