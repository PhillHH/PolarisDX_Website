// Accessibility-Audit-Geruest.
//
// Herkunft: adaptiert aus redesign/preview@5673b61:scripts/a11y-audit.mjs
// (AP01 PT01.3, Pattern-Gruppe P4).
//
// Faehrt axe-core (WCAG 2.0/2.1/2.2 A+AA) gegen einen LAUFENDEN SSR-Server und
// prueft zusaetzlich auf horizontalen Ueberlauf ueber zwei Breakpoints. Die
// axe-Quelle wird aus node_modules injiziert — kein Netzzugriff.
//
// WICHTIG — DIES IST KEIN ABGENOMMENES GATE. Ein Lauf ohne Befunde bedeutet
// NICHT "WCAG 2.2 AA erfuellt": axe deckt automatisiert nur einen Teil der
// Kriterien ab, die Routenliste ist eine Stichprobe, und es ist keine manuelle
// Pruefung erfolgt. Die Accessibility-Abnahme gehoert AP24, die Verdrahtung als
// CI-Gate AP27. AP01 stellt nur das Werkzeug bereit.
//
// ABWEICHUNG VON DER QUELLE: Routenliste auf Pfade dieser Linie umgestellt
// (einschliesslich der in AP01 PT01.2 aktivierten Epigenetik-Pfade).
//
// Aufruf: URL=http://127.0.0.1:<port> node scripts/a11y-audit.mjs
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
  ['epigenetics', '/de/epigenetics'],
  ['epigenetics-grundlagen', '/de/epigenetics/grundlagen'],
  ['musterbefund', '/de/epigenetics/musterbefund/metabolic-health'],
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
