// PT25.2 — kontrollierter Variantenvergleich (mobil, CDP-Drosselung wie PT25.1-Collector, kalt).
// Startet alle Varianten gleichzeitig (eigene Ports, optional gzip-Proxy) und misst je Route
// n verschraenkte Wiederholungen in neuen Browser-Kontexten; Ausgabe: Mediane.
// Aufruf: node scripts/perf/variant-compare.mjs <variants.json> <out.json> [reps]
//   variants.json: [{ "name": "...", "buildDir": "...", "env": { ... }, "gzip": true }]
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'
import { loadavg, cpus } from 'node:os'

const variants = JSON.parse(readFileSync(process.argv[2], 'utf8'))
const outFile = process.argv[3]
const reps = Number(process.argv[4] || 3)
const ROUTES = (
  process.env.PERF_ROUTES ||
  '/de/,/de/contact,/de/epigenetics/musterbefund/metabolic-health,/pl/,/de/consumer/vitamin-d3-spray,/de/pt25-baseline-gibt-es-nicht'
).split(',')
// `PERF_PROFILE=desktop`: 1350x940 ohne Drosselung (wie PT25.1-Collector); Standard mobil gedrosselt.
const DESKTOP = process.env.PERF_PROFILE === 'desktop'
const PORT = 3965
const PROXY = 3975
const median = (a) => {
  const s = a.filter((x) => x != null).sort((x, y) => x - y)
  return s.length ? s[Math.floor(s.length / 2)] : null
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const COLLECT = () => {
  const s = { lcp: 0, lcpEl: '', cls: 0, lt: [], hydStart: null, hydEnd: null, shifts: [] }
  window.__v = s
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      s.lcp = e.startTime
      s.lcpEl = e.element ? e.element.tagName : ''
    }),
  ).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      if (!e.hadRecentInput) {
        s.cls += e.value
        if (e.value > 0.01)
          s.shifts.push({
            t: Math.round(e.startTime),
            v: +e.value.toFixed(3),
            n: e.sources.map((x) =>
              x.node
                ? x.node.tagName + '.' + (x.node.getAttribute('class') || '').slice(0, 50)
                : null,
            ),
          })
      }
    }),
  ).observe({ type: 'layout-shift', buffered: true })
  new PerformanceObserver((l) => l.getEntries().forEach((e) => s.lt.push(e.duration))).observe({
    type: 'longtask',
    buffered: true,
  })
  const poll = () => {
    const root = document.getElementById('root')
    if (
      root &&
      s.hydStart === null &&
      Object.keys(root).some((k) => k.startsWith('__reactContainer'))
    )
      s.hydStart = performance.now()
    const f = document.querySelector('footer')
    if (f && s.hydEnd === null && Object.keys(f).some((k) => k.startsWith('__reactProps')))
      s.hydEnd = performance.now()
    if (s.hydEnd === null) requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

const waitUp = async (port) => {
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/robots.txt`)
      if (r.status < 500) return
    } catch {
      /* startet */
    }
    await sleep(500)
  }
  throw new Error('server not up')
}

const browser = await chromium.launch()
const results = []

// Alle Varianten gleichzeitig starten (eigene Ports) und die Wiederholungen VERSCHRAENKEN:
// Rep 1 aller Varianten, dann Rep 2 aller Varianten ... Laufzeit-Drift der Maschine trifft so
// jede Variante gleich, statt eine ganze Variante einseitig (gemessen in PT25.2).
const running = []
for (const [index, v] of variants.entries()) {
  const port = PORT + index
  // Optional `serverScript`: anderer Server-Einstiegspunkt (z. B. eine Messkopie mit Vorher-Verhalten),
  // gestartet wie `npm run start` (tsx + tsconfig.app.json). Ohne Angabe: `npm run start`.
  const serverEnv = {
    ...process.env,
    ...v.env,
    NODE_ENV: 'production',
    PORT: String(port),
    POLARIS_CLIENT_DIST_DIR: `${v.buildDir}/client`,
    POLARIS_SERVER_DIST_DIR: `${v.buildDir}/server`,
    TSX_TSCONFIG_PATH: 'tsconfig.app.json',
  }
  const server = v.serverScript
    ? spawn('npx', ['tsx', v.serverScript], { env: serverEnv, stdio: 'ignore', detached: true })
    : spawn('npm', ['run', 'start'], { env: serverEnv, stdio: 'ignore', detached: true })
  await waitUp(port)
  let proxy = null
  if (v.gzip) {
    proxy = spawn('node', ['scripts/perf/gzip-proxy.mjs', String(PROXY + index), String(port)], {
      stdio: 'ignore',
      detached: true,
    })
    await waitUp(PROXY + index)
  }
  const origin = `http://127.0.0.1:${v.gzip ? PROXY + index : port}`
  // Server-Kaltstart ist nicht Teil dieses Vergleichs: jede Route einmal serverseitig anfragen.
  for (const r of ROUTES) await fetch(origin + r).then((x) => x.text())
  running.push({ v, server, proxy, origin, runs: Object.fromEntries(ROUTES.map((r) => [r, []])) })
}
await sleep(3000)

const measure = async (origin, route) => {
  const ctx = await browser.newContext(
    DESKTOP
      ? { viewport: { width: 1350, height: 940 }, deviceScaleFactor: 1 }
      : {
          viewport: { width: 412, height: 823 },
          deviceScaleFactor: 1.75,
          isMobile: true,
          hasTouch: true,
        },
  )
  await ctx.addInitScript(COLLECT)
  const page = await ctx.newPage()
  const cdp = await ctx.newCDPSession(page)
  if (!DESKTOP) {
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1638.4 * 1024) / 8,
      uploadThroughput: (675 * 1024) / 8,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  let bytes = 0
  page.on('requestfinished', async (rq) => {
    const s = await rq.sizes().catch(() => null)
    if (s) bytes += s.responseBodySize + s.responseHeadersSize
  })
  // `PERF_REPEAT=1`: Wiederholungsansicht — erst normal laden (Cache fuellen), dann dieselbe
  // Route erneut im selben Kontext laden und NUR diesen zweiten Aufruf messen (AP25 PT25.4).
  if (process.env.PERF_REPEAT === '1') {
    await page.goto(origin + route, { waitUntil: 'load' })
    await sleep(3000)
  }
  await page.goto(origin + route, { waitUntil: 'load' })
  await page
    .waitForFunction(() => window.__v.hydEnd !== null, undefined, { timeout: 40000 })
    .catch(() => {})
  await sleep(2500)
  const m = await page.evaluate(() => {
    const n = performance.getEntriesByType('paint').find((p) => p.name === 'first-contentful-paint')
    return {
      fcp: n ? n.startTime : null,
      ...window.__v,
      ltSum: window.__v.lt.reduce((a, b) => a + b, 0),
      ltN: window.__v.lt.length,
    }
  })
  await ctx.close()
  return { ...m, bytes }
}

const loads = []
for (let i = 0; i < reps; i++) {
  for (const route of ROUTES) {
    for (const entry of running) entry.runs[route].push(await measure(entry.origin, route))
  }
  // Maschinenlast je Wiederholung festhalten: fremde Last kontaminiert Lab-Werte (PT25.2 gemessen).
  loads.push(Number(loadavg()[0].toFixed(2)))
  console.error(
    `Wiederholung ${i + 1}/${reps} fertig, Load1 ${loads.at(-1)} auf ${cpus().length} Kernen`,
  )
}

for (const { v, runs } of running) {
  for (const route of ROUTES) {
    const r = runs[route]
    const row = {
      variant: v.name,
      route,
      reps,
      fcp: median(r.map((x) => x.fcp)),
      lcp: median(r.map((x) => x.lcp)),
      hydStart: median(r.map((x) => x.hydStart)),
      hydEnd: median(r.map((x) => x.hydEnd)),
      cls: median(r.map((x) => x.cls)),
      clsMax: Math.max(...r.map((x) => x.cls)),
      ltSum: median(r.map((x) => x.ltSum)),
      kb: Math.round(median(r.map((x) => x.bytes)) / 1024),
      shifts: r.flatMap((x) => x.shifts).slice(0, 4),
    }
    results.push(row)
    console.error(
      `${v.name.padEnd(24)} ${route.padEnd(48)} FCP ${Math.round(row.fcp)} LCP ${Math.round(row.lcp)} hyd ${Math.round(row.hydStart)}→${Math.round(row.hydEnd)} CLS ${row.cls.toFixed(3)} (max ${row.clsMax.toFixed(3)}) LT ${Math.round(row.ltSum)} ${row.kb}KB`,
    )
  }
}

for (const { server, proxy } of running) {
  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch {
    /* weg */
  }
  if (proxy)
    try {
      process.kill(-proxy.pid, 'SIGTERM')
    } catch {
      /* weg */
    }
}
await browser.close()
writeFileSync(
  outFile,
  JSON.stringify(
    {
      measuredAt: new Date().toISOString(),
      reps,
      routes: ROUTES,
      interleaved: true,
      loadPerRep: loads,
      cores: cpus().length,
      results,
    },
    null,
    2,
  ),
)
process.exit(0)
