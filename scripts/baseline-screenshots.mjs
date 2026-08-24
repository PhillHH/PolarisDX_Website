// Visual-Regression-/Baseline-Screenshot-Geruest.
//
// Herkunft: adaptiert aus redesign/preview@5673b61:scripts/baseline-screenshots.mjs
// (AP01 PT01.3, Pattern-Gruppen P1 und P4).
//
// Was es leistet: deterministische Viewports, ganzseitige Aufnahmen fester
// Routen gegen einen LAUFENDEN SSR-Server, plus eine Overflow-Zusicherung
// (Dokument breiter als der Viewport => horizontaler Scroll).
//
// WICHTIG — das hier ist ein WERKZEUG, keine visuelle Soll-Vorgabe. Die
// Aufnahmen dieses Laufs sind der Ist-Stand DIESER Linie. Screenshots oder
// Designzustaende aus redesign/preview sind ausdruecklich NICHT die visuelle
// Baseline des Relaunchs — Art Direction bleibt Sales-Machine (DEC-RL-002),
// das Theme bleibt hell (DEC-RL-003).
//
// ABWEICHUNG VON DER QUELLE: die Routenliste der Quelle stammt aus dem
// Redesign-Programm. Sie ist auf Routen umgestellt, die auf DIESER Linie
// existieren, einschliesslich der in AP01 PT01.2 aktivierten Epigenetik-Pfade.
//
// Die vollstaendige Visual-Regression-Abdeckung aller Routen ist AP27; die
// Verdrahtung als Gate ebenfalls. AP01 stellt nur das Geruest.
//
// Aufruf: URL=http://127.0.0.1:<port> node scripts/baseline-screenshots.mjs
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
  ['epigenetics', '/de/epigenetics'],
  ['epigenetics-grundlagen', '/de/epigenetics/grundlagen'],
  ['musterbefund', '/de/epigenetics/musterbefund/metabolic-health'],
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
    if (scrollW > bp.width + 1)
      overflow.push(`${slug}@${bp.name}: scrollWidth ${scrollW} > ${bp.width}`)
    count++
  }
  await ctx.close()
}
await browser.close()
console.log(`captured ${count} screenshots -> ${OUT}`)
console.log(
  overflow.length ? `OVERFLOW:\n${overflow.join('\n')}` : 'no horizontal overflow detected',
)
