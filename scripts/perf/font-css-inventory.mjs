// PT25.4 — Font- und CSS-Inventar je Route und Viewport.
// Startet einen Produktionsserver auf dem Build, misst ungedrosselt:
//  - Font-Requests (URL, Start/Ende, extern?), preload-Hinweise im HTML, geladene FontFaces
//  - Status der Fallback-Schrift ('Inter Fallback'), Schrift je Textknoten (computed font-family)
//  - FCP, CLS kalt normal und mit um PERF_FONT_DELAY ms verzoegerten woff2 (nur Fonts abgefangen)
//  - CSS-Coverage (benutzte Bytes des Stylesheets) je Route
// Aufruf: node scripts/perf/font-css-inventory.mjs <buildDir> <out.json> [port]
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const buildDir = process.argv[2] || 'node_modules/.cache/pt25.3'
const outFile = process.argv[3] || 'node_modules/.cache/pt25.4/inventory.json'
const port = Number(process.argv[4] || 3990)
const DELAY = Number(process.env.PERF_FONT_DELAY || 2000)
const ROUTES = (
  process.env.PERF_ROUTES ||
  '/de/,/de/contact,/de/diagnostics,/de/epigenetics,/de/epigenetics/musterbefund/metabolic-health,/de/articles/die-gruene-praxis,/pl/,/cs/consumer/inside-out-duo'
).split(',')
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, dpr: 3, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 1, mobile: false },
]
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const server = spawn('npm', ['run', 'start'], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(port),
    POLARIS_CLIENT_DIST_DIR: `${buildDir}/client`,
    POLARIS_SERVER_DIST_DIR: `${buildDir}/server`,
  },
  stdio: 'ignore',
  detached: true,
})
for (let i = 0; i < 120; i++) {
  try {
    if ((await fetch(`http://127.0.0.1:${port}/robots.txt`)).status < 500) break
  } catch {
    /* startet */
  }
  await sleep(500)
}
await sleep(1500)

const OBSERVE = () => {
  const s = { cls: 0, shifts: [], fontsDone: null }
  window.__f = s
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      if (e.hadRecentInput) return
      s.cls += e.value
      if (e.value > 0.0005)
        s.shifts.push({
          t: Math.round(e.startTime),
          v: Number(e.value.toFixed(4)),
          nodes: e.sources.map((x) =>
            x.node
              ? `${x.node.tagName}.${String(x.node.className || '').slice(0, 50)} „${(x.node.textContent || '').trim().slice(0, 30)}“`
              : null,
          ),
        })
    }),
  ).observe({ type: 'layout-shift', buffered: true })
  document.fonts.addEventListener('loadingdone', () => {
    if (s.fontsDone === null) s.fontsDone = Math.round(performance.now())
  })
}

const browser = await chromium.launch()
const rows = []
for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    for (const mode of ['normal', 'font-delayed']) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
        isMobile: vp.mobile,
        hasTouch: vp.mobile,
      })
      await ctx.addInitScript(OBSERVE)
      const page = await ctx.newPage()
      if (mode === 'font-delayed') {
        await page.route('**/*.woff2', async (r) => {
          await sleep(DELAY)
          await r.continue()
        })
      }
      const t0 = Date.now()
      const fontReq = []
      page.on('request', (r) => {
        if (r.resourceType() === 'font' || /\.(woff2?|ttf|otf)(\?|$)/.test(r.url()))
          fontReq.push({ url: r.url(), start: Date.now() - t0 })
      })
      page.on('requestfinished', (r) => {
        const f = fontReq.find((x) => x.url === r.url() && x.end === undefined)
        if (f) f.end = Date.now() - t0
      })
      let css = null
      if (mode === 'normal') await page.coverage.startCSSCoverage()
      const res = await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'load' })
      const html = await res.text()
      await sleep(mode === 'font-delayed' ? DELAY + 1500 : 1500)
      if (mode === 'normal') {
        const cov = await page.coverage.stopCSSCoverage()
        // AP25 PT25.4: Stylesheet kann extern (`/assets/index-*.css`) oder inline im Dokument liegen.
        // Inline-Eintraege haben die Dokument-URL; das App-Stylesheet ist dort der mit Abstand groesste.
        css = cov
          .filter(
            (c) =>
              /\/assets\/index-.*\.css/.test(c.url) ||
              (c.text.length > 20000 && !/\.css(\?|$)/.test(c.url)),
          )
          .map((c) => ({
            url: /\.css(\?|$)/.test(c.url) ? c.url.replace(/^https?:\/\/[^/]+/, '') : 'inline',
            total: c.text.length,
            used: c.ranges.reduce((n, r) => n + (r.end - r.start), 0),
          }))
      }
      const data = await page.evaluate(() => {
        const paint = performance
          .getEntriesByType('paint')
          .find((p) => p.name === 'first-contentful-paint')
        const faces = [...document.fonts].map((f) => ({
          family: f.family,
          status: f.status,
          weight: f.weight,
          range: f.unicodeRange.slice(0, 16),
        }))
        const fallbackCheck = document.fonts.check('16px "Inter Fallback"')
        const probe = document.querySelector('h1, h2, p')
        return {
          fcp: paint ? Math.round(paint.startTime) : null,
          faces,
          fallbackFaceStatus: faces
            .filter((f) => f.family.replace(/"/g, '') === 'Inter Fallback')
            .map((f) => f.status),
          fallbackCheck,
          probeFamily: probe ? getComputedStyle(probe).fontFamily : null,
          store: window.__f,
        }
      })
      const preloads = [...html.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)].map(
        (m) => /href="([^"]+)"/.exec(m[0])?.[1],
      )
      rows.push({
        viewport: vp.name,
        route,
        mode,
        fcp: data.fcp,
        fontsDone: data.store.fontsDone,
        cls: Number(data.store.cls.toFixed(4)),
        shifts: data.store.shifts,
        fontRequests: fontReq.map((f) => ({
          file: f.url.split('/').pop(),
          external: !f.url.includes(`127.0.0.1:${port}`),
          start: f.start,
          end: f.end ?? null,
        })),
        preloads,
        loadedFaces: data.faces
          .filter((f) => f.status === 'loaded')
          .map((f) => `${f.family.replace(/"/g, '')} ${f.weight} ${f.range}`),
        fallbackFaceStatus: data.fallbackFaceStatus,
        fallbackCheck: data.fallbackCheck,
        probeFamily: data.probeFamily,
        css,
      })
      const fr = fontReq
        .map(
          (f) =>
            `${f.url
              .split('/')
              .pop()
              .replace(/-[\w-]{8}\.woff2$/, '')}@${f.start}-${f.end ?? '?'}`,
        )
        .join(' ')
      console.error(
        `${vp.name.padStart(4)} ${mode.padEnd(12)} ${route.padEnd(46)} FCP ${String(data.fcp).padStart(4)} fontsDone ${String(data.store.fontsDone).padStart(5)} CLS ${data.store.cls.toFixed(4)} | ${fr} | fallback ${data.fallbackFaceStatus.join(',')} check=${data.fallbackCheck}${css?.[0] ? ` | css ${css[0].url === 'inline' ? 'inline' : 'extern'} used ${Math.round(css[0].used / 1024)}/${Math.round(css[0].total / 1024)} KB` : ''}`,
      )
      await ctx.close()
    }
  }
}
await browser.close()
try {
  process.kill(-server.pid, 'SIGTERM')
} catch {
  /* weg */
}
writeFileSync(
  outFile,
  JSON.stringify({ buildDir, delay: DELAY, measuredAt: new Date().toISOString(), rows }, null, 2),
)
process.exit(0)
