// PT25.2 — verschraenkter Server-TTFB-Vergleich zweier Builds ueber den echten Produktionsstart.
// Beide Server laufen gleichzeitig; je Route wechseln sich die Requests ab (A, B, A, B ...),
// damit Maschinenlast beide gleich trifft. Erst nach dem SSR-Warm-up beider Server gemessen.
// Aufruf: node scripts/perf/ttfb-interleaved.mjs <buildA> <buildB> [reps] > out.json
import { spawn } from 'node:child_process'
import http from 'node:http'
import { loadavg } from 'node:os'
import { ROUTES } from './routes.mjs'

const [buildA = 'node_modules/.cache/pt25.1', buildB = 'node_modules/.cache/pt25.2'] =
  process.argv.slice(2, 4)
const reps = Number(process.argv[4] || 30)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const start = (buildDir, port) => {
  const child = spawn('npm', ['run', 'start'], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      POLARIS_CLIENT_DIST_DIR: `${buildDir}/client`,
      POLARIS_SERVER_DIST_DIR: `${buildDir}/server`,
    },
    stdio: ['ignore', 'pipe', 'ignore'],
    detached: true,
  })
  child.warmup = ''
  child.stdout.on('data', (c) => {
    const line = /\[ssr-warmup\][^\n]*/.exec(c.toString())
    if (line) child.warmup = line[0]
  })
  return child
}

const hit = (port, path) =>
  new Promise((resolve, reject) => {
    const t0 = performance.now()
    const req = http.get({ host: '127.0.0.1', port, path }, (res) => {
      let ttfb = null
      res.once('data', () => (ttfb = performance.now() - t0))
      res.on('data', () => {})
      res.on('end', () => resolve({ status: res.statusCode, ttfb: ttfb ?? performance.now() - t0 }))
    })
    req.on('error', reject)
  })

const quantile = (a, q) => {
  const s = [...a].sort((x, y) => x - y)
  return s[Math.min(s.length - 1, Math.floor(q * s.length))]
}

const servers = [start(buildA, 3981), start(buildB, 3982)]
for (const port of [3981, 3982]) {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await hit(port, '/robots.txt')).status < 500) break
    } catch {
      /* startet */
    }
    await sleep(500)
  }
}
// Warm-up abwarten (Build ohne Warm-up-Meldung: fester Puffer) und jede Route einmal anfragen.
for (let i = 0; i < 40 && !servers.every((s) => s.warmup); i++) await sleep(250)
for (const route of ROUTES) {
  await hit(3981, route.path)
  await hit(3982, route.path)
}

const rows = []
const loadStart = loadavg()[0]
for (const route of ROUTES) {
  const a = []
  const b = []
  for (let i = 0; i < reps; i++) {
    const first = i % 2 === 0 ? [3981, a] : [3982, b]
    const second = i % 2 === 0 ? [3982, b] : [3981, a]
    first[1].push((await hit(first[0], route.path)).ttfb)
    second[1].push((await hit(second[0], route.path)).ttfb)
  }
  rows.push({
    id: route.id,
    path: route.path,
    aMedian: Number(quantile(a, 0.5).toFixed(1)),
    bMedian: Number(quantile(b, 0.5).toFixed(1)),
    aP90: Number(quantile(a, 0.9).toFixed(1)),
    bP90: Number(quantile(b, 0.9).toFixed(1)),
  })
}
for (const s of servers) {
  try {
    process.kill(-s.pid, 'SIGTERM')
  } catch {
    /* weg */
  }
}
console.log(
  JSON.stringify(
    {
      buildA,
      buildB,
      reps,
      measuredAt: new Date().toISOString(),
      warmup: servers.map((s) => s.warmup),
      load: [Number(loadStart.toFixed(2)), Number(loadavg()[0].toFixed(2))],
      rows,
    },
    null,
    2,
  ),
)
for (const r of rows)
  console.error(
    `${r.id.padEnd(17)} A ${String(r.aMedian).padStart(6)} (p90 ${String(r.aP90).padStart(6)})  B ${String(r.bMedian).padStart(6)} (p90 ${String(r.bP90).padStart(6)})`,
  )
process.exit(0)
