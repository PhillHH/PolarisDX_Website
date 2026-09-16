// PT25.3 — gemessenes Bildinventar je Route und Viewport (390 / 768 / 1440).
// Startet einen Produktionsserver auf dem angegebenen Build, laedt jede Route ohne Drosselung,
// wartet auf `load` + Ruhephase (OHNE Scrollen: lazy Bilder unterhalb des Falzes bleiben ungeladen)
// und haelt fuer jedes <img> fest: Quelle, natuerliche/gerenderte Groesse, Uebergroesse (DPR-bewusst),
// loading/fetchpriority/decoding, srcset/sizes, width/height, alt, Falzlage, Bytes, Request-Start,
// LCP-Kandidat und CLS. Aufruf: node scripts/perf/image-inventory.mjs <buildDir> <out.json> [port]
import { spawn } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { chromium } from '@playwright/test'

const buildDir = process.argv[2] || 'node_modules/.cache/pt25.2'
const outFile = process.argv[3] || 'node_modules/.cache/pt25.3/inventory.json'
const port = Number(process.argv[4] || 3990)
const ROUTES = (
  process.env.PERF_ROUTES ||
  '/de/,/de/diagnostics,/de/diagnostics/dental,/de/igloo-pro,/de/epigenetics,/de/epigenetics/grundlagen,/de/epigenetics/musterbefund/metabolic-health,/de/articles,/de/articles/die-gruene-praxis,/de/events,/de/downloads,/de/contact,/de/about,/de/vitamin-d3-spray,/de/consumer/vitamin-d3-spray,/de/consumer/inside-out-duo,/de/consumer/hydrating-masks'
).split(',')
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, dpr: 3, mobile: true },
  { name: '768', width: 768, height: 1024, dpr: 2, mobile: true },
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
  const s = { lcp: null, cls: 0, shifts: [] }
  window.__img = s
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      const el = e.element
      s.lcp = {
        t: Math.round(e.startTime),
        size: e.size,
        tag: el ? el.tagName.toLowerCase() : null,
        src: el && el.tagName === 'IMG' ? el.currentSrc : null,
        text: el && el.tagName !== 'IMG' ? (el.textContent || '').trim().slice(0, 40) : null,
      }
    }),
  ).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      if (e.hadRecentInput) return
      s.cls += e.value
      if (e.value > 0.001)
        s.shifts.push({
          v: Number(e.value.toFixed(4)),
          img: e.sources.some(
            (x) => x.node && (x.node.tagName === 'IMG' || x.node.querySelector?.('img')),
          ),
          nodes: e.sources.map((x) =>
            x.node ? x.node.tagName + '.' + String(x.node.className || '').slice(0, 40) : null,
          ),
        })
    }),
  ).observe({ type: 'layout-shift', buffered: true })
}

const browser = await chromium.launch()
const rows = []
for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: vp.dpr,
      isMobile: vp.mobile,
      hasTouch: vp.mobile,
    })
    await ctx.addInitScript(OBSERVE)
    const page = await ctx.newPage()
    const t0 = Date.now()
    const imageRequests = []
    page.on('request', (r) => {
      if (r.resourceType() === 'image')
        imageRequests.push({ url: r.url().replace(/^https?:\/\/[^/]+/, ''), t: Date.now() - t0 })
    })
    await page.goto(`http://127.0.0.1:${port}${route}`, { waitUntil: 'load' })
    await sleep(2000)
    const data = await page.evaluate(() => {
      const res = performance.getEntriesByType('resource')
      const vh = window.innerHeight
      const dpr = window.devicePixelRatio
      const images = [...document.images].map((img) => {
        const r = img.getBoundingClientRect()
        const src = img.currentSrc || img.src
        const entry = res.find((e) => e.name === src)
        const picture =
          img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : null
        return {
          src: src.replace(location.origin, ''),
          alt: img.getAttribute('alt'),
          loading: img.getAttribute('loading'),
          fetchpriority: img.getAttribute('fetchpriority'),
          decoding: img.getAttribute('decoding'),
          widthAttr: img.getAttribute('width'),
          heightAttr: img.getAttribute('height'),
          srcset:
            img.getAttribute('srcset') ||
            (picture
              ? [...picture.querySelectorAll('source')]
                  .map((s) => s.getAttribute('srcset'))
                  .join(' | ')
              : null),
          sizes:
            img.getAttribute('sizes') ||
            (picture ? picture.querySelector('source')?.getAttribute('sizes') : null),
          natural: [img.naturalWidth, img.naturalHeight],
          rendered: [Math.round(r.width), Math.round(r.height)],
          oversize:
            r.width && img.naturalWidth
              ? Number((img.naturalWidth / (r.width * dpr)).toFixed(2))
              : null,
          top: Math.round(r.top + window.scrollY),
          aboveFold: r.width > 0 && r.top < vh && r.bottom > 0,
          visible: r.width > 0 && r.height > 0,
          loaded: img.complete && img.naturalWidth > 0,
          bytes: entry ? entry.encodedBodySize : null,
          reqStart: entry ? Math.round(entry.startTime) : null,
          aspectCss: getComputedStyle(img).aspectRatio,
        }
      })
      return { dpr, vh, images, store: window.__img }
    })
    rows.push({
      viewport: vp.name,
      route,
      lcp: data.store.lcp,
      cls: Number(data.store.cls.toFixed(4)),
      shifts: data.store.shifts,
      images: data.images,
      imageRequests,
    })
    const lcpTxt = data.store.lcp
      ? data.store.lcp.tag === 'img'
        ? 'img ' + String(data.store.lcp.src).split('/').pop()
        : data.store.lcp.tag + ' text'
      : '-'
    const imgBytes = data.images.reduce((n, i) => n + (i.bytes || 0), 0)
    console.error(
      `${vp.name.padStart(4)} ${route.padEnd(46)} LCP ${lcpTxt.slice(0, 44).padEnd(44)} CLS ${data.store.cls.toFixed(3)} imgs ${data.images.length} loaded ${data.images.filter((i) => i.loaded).length} ${Math.round(imgBytes / 1024)}KB`,
    )
    await ctx.close()
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
  JSON.stringify(
    { buildDir, measuredAt: new Date().toISOString(), viewports: VIEWPORTS, rows },
    null,
    2,
  ),
)
process.exit(0)
