// PT25.2 — isolierte Server-Render-Kosten ohne HTTP: ruft `render(url, lang)` des gebauten
// SSR-Entrys direkt auf. Misst den ersten Aufruf je Route in einem frischen Prozess ("kalt",
// inklusive Lazy-Import-Wartezeit wie im server.ts-Retry) und den Median von n Folgeaufrufen.
// Aufruf: NODE_ENV=production POLARIS_CLIENT_DIST_DIR=<client> node scripts/perf/ssr-render-cost.mjs <serverDir> [n]
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { ROUTES } from './routes.mjs'

const serverDir = process.argv[2] || 'node_modules/.cache/pt25.1/server'
const reps = Number(process.argv[3] || 20)
const { render } = await import(pathToFileURL(resolve(serverDir, 'entry-server.js')).href)

const hasTitle = (helmet) => /<title[^>]*>[^<]+<\/title>/.test(helmet.title.toString())
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)]

const rows = []
for (const route of ROUTES) {
  const lang = route.path.split('/')[1]
  // Kalt: wie server.ts — rendern, bis Helmet einen echten Titel hat (Lazy-Chunk geladen).
  const t0 = performance.now()
  let attempts = 0
  let result = await render(route.path, lang)
  while (!hasTitle(result.helmet) && attempts < 80) {
    attempts++
    await new Promise((r) => setTimeout(r, 25))
    result = await render(route.path, lang)
  }
  const cold = performance.now() - t0
  const warm = []
  for (let i = 0; i < reps; i++) {
    const t = performance.now()
    result = await render(route.path, lang)
    warm.push(performance.now() - t)
  }
  rows.push({
    id: route.id,
    path: route.path,
    coldMs: Number(cold.toFixed(1)),
    coldRetries: attempts,
    warmMedianMs: Number(median(warm).toFixed(2)),
    warmMaxMs: Number(Math.max(...warm).toFixed(2)),
    appHtmlBytes: Buffer.byteLength(result.html),
  })
}
console.log(
  JSON.stringify(
    { serverDir, reps, measuredAt: new Date().toISOString(), node: process.version, rows },
    null,
    2,
  ),
)
for (const r of rows)
  console.error(
    `${r.id.padEnd(17)} kalt ${String(r.coldMs).padStart(7)} ms (${r.coldRetries} Retries)  warm~ ${String(r.warmMedianMs).padStart(6)} ms  max ${String(r.warmMaxMs).padStart(6)}  html ${r.appHtmlBytes}`,
  )
