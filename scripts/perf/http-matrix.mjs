// PT25.1 — HTTP-Wahrheit + Server-TTFB + SSR-HTML-Groesse je Route.
// Aufruf: node scripts/perf/http-matrix.mjs <origin> [wiederholungen] [label]
// Misst mit node:http(s) ohne Browser: TTFB = Zeit bis zum ersten Antwortbyte,
// "kalt" = erster Abruf, "warm" = Median der Folgeabrufe. Keine Cookies, kein Consent.
import http from 'node:http'
import https from 'node:https'
import { gzipSync, gunzipSync, brotliDecompressSync } from 'node:zlib'
import { ROUTES } from './routes.mjs'

const origin = process.argv[2] || 'http://127.0.0.1:3960'
const reps = Number(process.argv[3] || 5)
const label = process.argv[4] || origin

const hit = (url) =>
  new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http
    const t0 = performance.now()
    let ttfb = 0
    const req = mod.get(
      url,
      { headers: { 'accept-encoding': 'gzip, br', 'user-agent': 'polaris-pt25.1-baseline' } },
      (res) => {
        const chunks = []
        res.once('data', () => (ttfb = performance.now() - t0))
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const body = Buffer.concat(chunks)
          resolve({
            status: res.statusCode,
            ttfb: ttfb || performance.now() - t0,
            total: performance.now() - t0,
            bytes: body.length,
            enc: res.headers['content-encoding'] || 'identity',
            cache: res.headers['cache-control'] || '',
            body,
          })
        })
      },
    )
    req.on('error', reject)
    req.setTimeout(30000, () => req.destroy(new Error('timeout')))
  })

const median = (a) => {
  const s = [...a].sort((x, y) => x - y)
  return s[Math.floor(s.length / 2)]
}
const out = []
let bad = 0
for (const r of ROUTES) {
  const runs = []
  for (let i = 0; i < reps; i++) runs.push(await hit(origin + r.path))
  const first = runs[0]
  const warm = runs.slice(1).map((x) => x.ttfb)
  const ok = runs.every((x) => x.status === r.expect)
  if (!ok) bad++
  // Komprimierte Antworten (Preview/nginx) fuer die Inhaltspruefung entpacken; wireBytes bleibt Transfergroesse.
  const raw =
    first.enc === 'gzip'
      ? gunzipSync(first.body)
      : first.enc === 'br'
        ? brotliDecompressSync(first.body)
        : first.body
  const html = raw.toString('utf8')
  out.push({
    id: r.id,
    path: r.path,
    expect: r.expect,
    status: [...new Set(runs.map((x) => x.status))].join('/'),
    ok,
    ttfbColdMs: Math.round(first.ttfb),
    ttfbWarmMedianMs: warm.length ? Math.round(median(warm)) : null,
    wireBytes: first.bytes,
    htmlBytes: raw.length,
    encoding: first.enc,
    htmlGzipBytes: html ? gzipSync(Buffer.from(html)).length : null,
    ssrRootFilled: html ? /<div id="root">(?:<!--\$-->)*\s*<[a-z]/i.test(html) : null,
    modulepreloads: html ? (html.match(/rel="modulepreload"/g) || []).length : null,
    preloads: html ? (html.match(/rel="preload"/g) || []).length : null,
    gtmInHtml: html ? /googletagmanager\.com\/gtm\.js/.test(html) : null,
    cache: first.cache,
  })
}
console.log(
  JSON.stringify(
    { label, origin, reps, measuredAt: new Date().toISOString(), routes: out },
    null,
    2,
  ),
)
console.error(
  `\n${label}: ${ROUTES.length - bad}/${ROUTES.length} Routen mit erwarteter HTTP-Wahrheit`,
)
for (const o of out)
  console.error(
    `  ${String(o.status).padEnd(4)} ${o.ok ? 'OK ' : 'BAD'} cold ${String(o.ttfbColdMs).padStart(5)} ms  warm~ ${String(o.ttfbWarmMedianMs).padStart(5)} ms  ${String(o.wireBytes).padStart(7)} B ${o.encoding.padEnd(8)} html ${o.htmlBytes} gz~${o.htmlGzipBytes}  ssr=${o.ssrRootFilled} mp=${o.modulepreloads} pl=${o.preloads}  ${o.path}`,
  )
process.exitCode = bad ? 1 : 0
