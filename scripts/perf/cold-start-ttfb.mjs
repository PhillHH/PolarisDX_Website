// PT25.2 — Kaltstart-TTFB ueber den echten Produktionsstart (`npm run start` = tsx server.ts):
// startet einen frischen Server, fragt jede Route der Matrix GENAU EINMAL an (erster Request je
// Route = Lazy-Import + Retry-Schleife in server.ts) und danach noch einmal (warm).
// Aufruf: node scripts/perf/cold-start-ttfb.mjs <buildDir> [port] [label]
import { spawn } from 'node:child_process'
import http from 'node:http'
import { ROUTES } from './routes.mjs'

const buildDir = process.argv[2] || 'node_modules/.cache/pt25.1'
const port = Number(process.argv[3] || 3963)
const label = process.argv[4] || buildDir
// `--wait-warmup`: erst messen, wenn server.ts den SSR-Warm-up gemeldet hat (AP25 PT25.2).
// Ohne Flag misst das Skript den schlechtesten Fall: Requests unmittelbar nach `listen`.
const waitWarmup = process.argv.includes('--wait-warmup')

const server = spawn('npm', ['run', 'start'], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
    POLARIS_CLIENT_DIST_DIR: `${buildDir}/client`,
    POLARIS_SERVER_DIST_DIR: `${buildDir}/server`,
  },
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
})
const stop = () => {
  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {
    /* bereits beendet */
  }
}
process.on('exit', stop)
let warmupLine = ''
server.stdout.on('data', (chunk) => {
  const line = /\[ssr-warmup\][^\n]*/.exec(chunk.toString())
  if (line) warmupLine = line[0]
})

const hit = (path) =>
  new Promise((resolve, reject) => {
    const t0 = performance.now()
    let ttfb = 0
    const req = http.get({ host: '127.0.0.1', port, path }, (res) => {
      let bytes = 0
      let title = ''
      res.once('data', () => (ttfb = performance.now() - t0))
      res.on('data', (c) => {
        bytes += c.length
        if (!title) title = /<title[^>]*>([^<]*)<\/title>/.exec(c.toString())?.[1] ?? ''
      })
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          ttfb: Math.round(ttfb),
          total: Math.round(performance.now() - t0),
          bytes,
        }),
      )
    })
    req.on('error', reject)
  })

// Bereitschaft ueber einen Pfad, der NICHT in der Matrix steht, damit keine Matrix-Route vorgewaermt wird.
for (let i = 0; i < 120; i++) {
  try {
    const r = await hit('/robots.txt')
    if (r.status && r.status < 500) break
  } catch {
    /* Server startet noch */
  }
  await new Promise((r) => setTimeout(r, 500))
}

if (waitWarmup) {
  for (let i = 0; i < 120 && !warmupLine; i++) await new Promise((r) => setTimeout(r, 250))
}

const rows = []
for (const route of ROUTES) {
  const cold = await hit(route.path)
  const warm = await hit(route.path)
  rows.push({
    id: route.id,
    path: route.path,
    status: cold.status,
    coldTtfbMs: cold.ttfb,
    warmTtfbMs: warm.ttfb,
    htmlBytes: cold.bytes,
  })
}
stop()
console.log(
  JSON.stringify(
    { label, buildDir, waitWarmup, warmupLine, measuredAt: new Date().toISOString(), rows },
    null,
    2,
  ),
)
for (const r of rows)
  console.error(
    `${r.id.padEnd(17)} ${r.status} kalt ${String(r.coldTtfbMs).padStart(5)} ms  warm ${String(r.warmTtfbMs).padStart(4)} ms  ${r.htmlBytes} B`,
  )
process.exit(0)
