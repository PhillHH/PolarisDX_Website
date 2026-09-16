// PT25.5 — Performance-Budget-Gate (AP25). Ein Befehl fuer CI und die lokale LAB-Pruefung.
//
//   node scripts/perf/check-budgets.mjs --build <dir> [--profile ci|lab] [--static-only]
//        [--runs 3] [--routes home,contact] [--profiles mobile,desktop]
//        [--budgets scripts/perf/budgets.json] [--json out.json] [--report-only] [--port 3997]
//
// <dir> ist ein Produktionsbuild MIT Manifest (`npm run perf:budget:build` →
// node_modules/.cache/perf-budget/{client,server}). Geprueft wird:
//   statisch — Initial-JS, CSS, Route-JS je Matrix-Route, Schriftschnitte und Fallback-Faces.
//   Laufzeit — jede Route der Matrix (scripts/perf/routes.mjs), mobil gedrosselt und desktop, kalt,
//              hinter dem gzip-Proxy: LCP/FCP/CLS/TTFB (LAB), HTML-/JS-/Bild-/Font-Bytes,
//              Font-Requests und -Preloads, LCP-Bild nicht lazy, fetchpriority, Bilddimensionen,
//              eager unter dem Falz, uebergrosse Bilder, Fremd-Requests ohne Consent, Beacons,
//              Hydration- und Laufzeitfehler, HTTP-Status und SSR-Inhalt.
// Profile: `ci` prueft Zeiten gegen die CWV-Qualitaetsziele (Runner-Hardware ist nicht die
// Kalibrierumgebung), `lab` gegen die kalibrierten Regressionsbudgets (PERFORMANCE-CONTRACT §29).
// Bytes, Anzahlen und Strukturregeln haengen nicht von der Hardware ab und gelten in beiden Profilen.
// Alle Werte sind LAB-Werte, keine Field-/RUM-Werte (INP_FIELD = NOT_AVAILABLE, kein p75).
// Es wird nie Consent erteilt, nichts abgesendet, und der Browser loest keine fremden Hosts auf —
// nichts verlaesst die Maschine; jeder Versuch wird gezaehlt (nur Origin + Pfad, keine Query).
// Exit: 0 alle Budgets gehalten · 1 Budget verletzt · 2 Messung oder Umgebung unvollstaendig.
import { spawn } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { cpus, loadavg } from 'node:os'
import { gzipSync } from 'node:zlib'
import { chromium } from '@playwright/test'
import { ROUTES } from './routes.mjs'

const argv = process.argv.slice(2)
const arg = (k, d) => {
  const i = argv.indexOf('--' + k)
  return i > -1 ? argv[i + 1] : d
}
const has = (k) => argv.includes('--' + k)
const abort = (message) => {
  console.error(`MESSUNG UNVOLLSTAENDIG: ${message}`)
  process.exit(2)
}

const buildDir = arg('build', 'node_modules/.cache/perf-budget').replace(/\/$/, '')
const profile = arg('profile', 'ci')
const runs = Number(arg('runs', 3))
const onlyRoutes = arg('routes', '')
const onlyDevices = arg('profiles', 'mobile,desktop').split(',')
const budgetsFile = arg('budgets', 'scripts/perf/budgets.json')
const jsonOut = arg('json', null)
const reportOnly = has('report-only')
const staticOnly = has('static-only')
const port = Number(arg('port', 3997))
const proxyPort = port + 1
if (!['ci', 'lab'].includes(profile)) abort('--profile muss ci oder lab sein')
if (!Number.isInteger(runs) || runs < 1) abort('--runs muss eine positive ganze Zahl sein')

const budgets = reportOnly ? null : JSON.parse(readFileSync(budgetsFile, 'utf8'))
const clientDir = `${buildDir}/client`
const manifestFile = `${clientDir}/.vite/manifest.json`
if (!existsSync(manifestFile))
  abort(`Manifest fehlt: ${manifestFile} — zuerst "npm run perf:budget:build"`)
if (!existsSync(`${buildDir}/server`)) abort(`SSR-Build fehlt: ${buildDir}/server`)

const KB = (n) => `${(n / 1024).toFixed(1)} KB`
const format = (value, unit) =>
  unit === 'bytes'
    ? KB(value)
    : unit === 'ms'
      ? `${Math.round(value)} ms`
      : unit === 'cls'
        ? Number(value).toFixed(4)
        : String(value)
const median = (values) => {
  const sorted = values.filter((v) => v != null).sort((a, b) => a - b)
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : null
}

const checks = []
const violations = []
const missing = []
/** Vergleicht einen Messwert mit seinem Budget; ohne Budget (Report-Modus) wird nur protokolliert. */
const check = (scope, key, actual, budget, unit = 'count', cmp = '<=') => {
  if (reportOnly) return checks.push({ scope, key, actual, unit })
  if (budget == null) return missing.push(`${scope} ${key}`)
  const ok = cmp === '==' ? actual === budget : actual <= budget
  checks.push({ scope, key, actual, budget, unit, cmp, ok })
  if (!ok)
    violations.push(
      `${scope} ${key}: gemessen ${format(actual, unit)}, Budget ${cmp === '==' ? 'genau' : 'hoechstens'} ${format(budget, unit)}`,
    )
}

// ---------------------------------------------------------------- statisch (Manifest + Dateien)
const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'))
const gzip9 = (file) => gzipSync(readFileSync(`${clientDir}/${file}`), { level: 9 }).length
const entryKey = Object.keys(manifest).find((k) => manifest[k].isEntry)
if (!entryKey) abort('kein Entry im Manifest')
const initial = new Set()
const initialCss = new Set()
const walk = (key) => {
  if (initial.has(key)) return
  initial.add(key)
  ;(manifest[key].css || []).forEach((file) => initialCss.add(file))
  ;(manifest[key].imports || []).forEach(walk)
}
walk(entryKey)

// Seitenmodul je Matrix-Route. Route-JS = Seitenmodul + dessen nicht initiale statische Imports
// (dieselbe Definition wie scripts/perf/bundle-report.mjs und Vertrag §13).
const PAGE_MODULE = {
  home: 'src/pages/HomePage.tsx',
  'diagnostics-hub': 'src/pages/ServicesOverviewPage.tsx',
  'service-detail': 'src/pages/ServicePage.tsx',
  'igloo-pro': 'src/pages/IglooProPage.tsx',
  'epigenetics-hub': 'src/pages/EpigeneticsPage.tsx',
  'epigenetics-deep': 'src/pages/EpigeneticsBasicsPage.tsx',
  musterbefund: 'src/pages/musterbefund/metabolic-health.tsx',
  'articles-index': 'src/pages/ArticlesIndexPage.tsx',
  'article-detail': 'src/pages/articles/die-gruene-praxis.tsx',
  events: 'src/pages/EventsPage.tsx',
  downloads: 'src/pages/DownloadsPage.tsx',
  contact: 'src/pages/ContactPage.tsx',
  'consumer-d3': 'src/pages/consumer/SprayPage.tsx',
  'consumer-duo': 'src/pages/consumer/DuoPage.tsx',
  'not-found': 'src/pages/NotFoundPage.tsx',
}
const routeJsGzip = {}
const pagesMissingInManifest = []
for (const [id, module] of Object.entries(PAGE_MODULE)) {
  if (!manifest[module]) {
    // Home ist bewusst statisch importiert (Entry-Chunk). Jede andere Seite ohne eigenen
    // Manifest-Eintrag ist umbenannt oder wieder statisch im Entry — beides muss auffallen.
    if (id !== 'home') pagesMissingInManifest.push(`${id} (${module})`)
    routeJsGzip[id] = 0
    continue
  }
  const seen = new Set()
  const visit = (key) => {
    if (seen.has(key) || initial.has(key)) return
    seen.add(key)
    ;(manifest[key].imports || []).forEach(visit)
  }
  visit(module)
  routeJsGzip[id] = [...seen].reduce((sum, key) => sum + gzip9(manifest[key].file), 0)
}

const initialJsGzip = [...initial].reduce((sum, key) => sum + gzip9(manifest[key].file), 0)
const cssFiles = [...initialCss]
if (cssFiles.length !== 1)
  abort(`erwartet genau ein initiales Stylesheet, gefunden ${cssFiles.length}`)
const cssText = readFileSync(`${clientDir}/${cssFiles[0]}`, 'utf8')
const faces = cssText.match(/@font-face\{[^}]*\}/g) || []
const interFaces = faces.filter((f) => /font-family:"?Inter Variable"?/.test(f))
const fallbackFaces = faces.filter((f) => /Inter Fallback/.test(f) && /size-adjust:/.test(f))
const template = readFileSync(`${clientDir}/index.html`, 'utf8')
const externalFontSources =
  (cssText.match(/url\((["']?)(https?:)?\/\//g) || []).length +
  (template.match(/fonts\.(googleapis|gstatic)\.com|use\.typekit\.net|fonts\.bunny\.net/g) || [])
    .length
const fontFilesBytes = readdirSync(`${clientDir}/assets`)
  .filter((f) => f.endsWith('.woff2'))
  .reduce((sum, f) => sum + readFileSync(`${clientDir}/assets/${f}`).length, 0)

const staticMeasured = {
  initialJsGzip,
  initialCssGzip: gzip9(cssFiles[0]),
  initialCssRaw: Buffer.byteLength(cssText),
  maxRouteJsGzip: Math.max(...Object.values(routeJsGzip)),
  routeJsGzip,
  interFontFaces: interFaces.length,
  interFontFacesWithoutSwap: interFaces.filter((f) => !/font-display:swap/.test(f)).length,
  fallbackFaces: fallbackFaces.length,
  externalFontSources,
  fontFilesBytes,
}
const sb = budgets?.static ?? {}
check('statisch', 'initialJsGzip', initialJsGzip, sb.initialJsGzip, 'bytes')
check('statisch', 'initialCssGzip', staticMeasured.initialCssGzip, sb.initialCssGzip, 'bytes')
check('statisch', 'initialCssRaw', staticMeasured.initialCssRaw, sb.initialCssRaw, 'bytes')
check('statisch', 'maxRouteJsGzip', staticMeasured.maxRouteJsGzip, sb.maxRouteJsGzip, 'bytes')
for (const [id, bytes] of Object.entries(routeJsGzip))
  check(`statisch route ${id}`, 'routeJsGzip', bytes, sb.routeJsGzip?.[id], 'bytes')
check('statisch', 'interFontFaces', interFaces.length, sb.interFontFaces, 'count', '==')
check('statisch', 'interFontFacesWithoutSwap', staticMeasured.interFontFacesWithoutSwap, 0)
check('statisch', 'fallbackFaces', fallbackFaces.length, sb.fallbackFaces, 'count', '==')
check('statisch', 'externalFontSources', externalFontSources, 0)
check('statisch', 'fontFilesBytes', fontFilesBytes, sb.fontFilesBytes, 'bytes')
if (!reportOnly && pagesMissingInManifest.length)
  violations.push(
    `statisch Seitenmodule ohne eigenen Chunk (umbenannt oder wieder statisch im Entry): ${pagesMissingInManifest.join(', ')}`,
  )
staticMeasured.pagesMissingInManifest = pagesMissingInManifest

console.log(
  `PT25.5 Budget-Gate · Profil ${profile} · Build ${buildDir} · LAB (kein Field, kein p75) · ${reportOnly ? 'Report-Modus ohne Budgets' : `Budgets ${budgetsFile}`}`,
)
console.log(
  `statisch: Initial-JS ${KB(initialJsGzip)} gzip · CSS ${KB(staticMeasured.initialCssRaw)} roh / ${KB(staticMeasured.initialCssGzip)} gzip · groesstes Route-JS ${KB(staticMeasured.maxRouteJsGzip)} · Inter-Faces ${interFaces.length} · Fallback-Faces ${fallbackFaces.length} · Fontdateien ${KB(fontFilesBytes)}`,
)

// ---------------------------------------------------------------- Laufzeit
const DEVICES = {
  // Wie PT25.1-Collector und PT25.2–PT25.4-Vergleiche: Moto-G-Power-Viewport, CDP-Drosselung.
  mobile: {
    context: {
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: 1.75,
      isMobile: true,
      hasTouch: true,
    },
    throttle: true,
    settleMs: 2500,
  },
  desktop: {
    context: { viewport: { width: 1350, height: 940 }, deviceScaleFactor: 1 },
    throttle: false,
    settleMs: 1500,
  },
}
const HYDRATION =
  /hydrat|did not match|server rendered HTML|Minified React error #(418|419|421|422|423|425)/i
const IMAGE = /\.(avif|webp|png|jpe?g|gif|svg|ico)$/i

const COLLECT = () => {
  const s = { lcp: null, shifts: [], hydratedAt: null, beacons: 0 }
  window.__budget = s
  new PerformanceObserver((list) =>
    list.getEntries().forEach((e) => {
      const el = e.element
      s.lcp = {
        t: e.startTime,
        url: e.url || '',
        tag: el ? el.tagName.toLowerCase() : null,
        loading: el && el.tagName === 'IMG' ? el.getAttribute('loading') : null,
      }
    }),
  ).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((list) =>
    list.getEntries().forEach((e) => {
      if (!e.hadRecentInput) s.shifts.push({ t: e.startTime, v: e.value })
    }),
  ).observe({ type: 'layout-shift', buffered: true })
  if (navigator.sendBeacon) {
    const send = navigator.sendBeacon.bind(navigator)
    navigator.sendBeacon = (...args) => {
      s.beacons++
      return send(...args)
    }
  }
  // Hydration-Ende: React-Props am Footer (Methode PT25.1/PT25.2).
  const poll = () => {
    const footer = document.querySelector('footer')
    if (footer && Object.keys(footer).some((k) => k.startsWith('__reactProps'))) {
      s.hydratedAt = performance.now()
      return
    }
    requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

const SNAPSHOT = () => {
  const s = window.__budget
  const toPath = (u) => {
    try {
      const x = new URL(u, location.href)
      return x.origin === location.origin ? x.pathname : x.origin + x.pathname
    } catch {
      return ''
    }
  }
  const nav = performance.getEntriesByType('navigation')[0]
  const paint = performance
    .getEntriesByType('paint')
    .find((p) => p.name === 'first-contentful-paint')
  const resources = performance
    .getEntriesByType('resource')
    .map((r) => ({ path: toPath(r.name), bytes: r.encodedBodySize }))
  // CLS nach CWV-Definition: groesstes Session-Fenster (Luecke < 1 s, Fenster <= 5 s).
  let cls = 0
  let current = 0
  let first = 0
  let previous = 0
  for (const e of s.shifts) {
    if (current && (e.t - previous >= 1000 || e.t - first >= 5000)) current = 0
    if (!current) first = e.t
    current += e.v
    previous = e.t
    cls = Math.max(cls, current)
  }
  const images = [...document.images].map((img) => {
    const r = img.getBoundingClientRect()
    return {
      path: toPath(img.currentSrc || img.src),
      loading: img.getAttribute('loading'),
      fetchpriority: img.getAttribute('fetchpriority'),
      dims: !!(img.getAttribute('width') && img.getAttribute('height')),
      visible: r.width > 0 && r.height > 0,
      top: r.top,
      natural: img.naturalWidth,
      needed: r.width * window.devicePixelRatio,
    }
  })
  return {
    ttfb: nav ? nav.responseStart : null,
    htmlBytes: nav ? nav.encodedBodySize : null,
    fcp: paint ? paint.startTime : null,
    lcp: s.lcp ? s.lcp.t : null,
    lcpTag: s.lcp ? s.lcp.tag : null,
    lcpPath: s.lcp && s.lcp.url ? toPath(s.lcp.url) : null,
    lcpLoading: s.lcp ? s.lcp.loading : null,
    cls,
    hydratedAt: s.hydratedAt,
    beacons: s.beacons,
    resources,
    images,
    viewportHeight: window.innerHeight,
    fontPreloads: document.querySelectorAll('link[rel="preload"][as="font"]').length,
    stylesheetLinks: document.querySelectorAll('link[rel="stylesheet"]').length,
    inlineStylesheets: document.querySelectorAll('style[data-inline-stylesheet]').length,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
  }
}

const exceptionFor = (routeId, device, path) =>
  (budgets?.exceptions?.eagerBelowFold ?? []).find(
    (e) => e.route === routeId && e.device === device && path.includes(e.image),
  )

async function measureOnce(browser, origin, route, device) {
  const spec = DEVICES[device]
  const context = await browser.newContext(spec.context)
  await context.addInitScript(COLLECT)
  const page = await context.newPage()
  if (spec.throttle) {
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 150,
      downloadThroughput: (1638.4 * 1024) / 8,
      uploadThroughput: (675 * 1024) / 8,
    })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  }
  const external = []
  const posts = []
  const hydrationErrors = []
  const pageErrors = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (!/^https?:$/.test(url.protocol)) return
    if (url.hostname !== '127.0.0.1') external.push(url.origin + url.pathname)
    if (request.method() !== 'GET' && request.method() !== 'HEAD') posts.push(url.pathname)
  })
  page.on('console', (message) => {
    if (message.type() === 'error' && HYDRATION.test(message.text()))
      hydrationErrors.push(message.text().slice(0, 160))
  })
  page.on('pageerror', (error) => pageErrors.push(String(error.message).slice(0, 160)))

  const response = await page.goto(origin + route.path, { waitUntil: 'load', timeout: 90_000 })
  const html = response ? await response.text() : ''
  const hydrated = await page
    .waitForFunction(() => window.__budget.hydratedAt !== null, undefined, { timeout: 45_000 })
    .then(
      () => true,
      () => false,
    )
  await page.waitForTimeout(spec.settleMs)
  const snap = await page.evaluate(SNAPSHOT)
  await context.close()

  const sum = (re) => snap.resources.filter((r) => re.test(r.path)).reduce((n, r) => n + r.bytes, 0)
  const fonts = snap.resources.filter((r) => r.path.endsWith('.woff2'))
  const visible = snap.images.filter((i) => i.visible)
  const above = new Set(visible.filter((i) => i.top < snap.viewportHeight).map((i) => i.path))
  const lcpIsImage = snap.lcpTag === 'img' || (snap.lcpPath && IMAGE.test(snap.lcpPath))
  const bytesOf = (path) => snap.resources.find((r) => r.path === path)?.bytes ?? 0
  return {
    status: response ? response.status() : null,
    ssrRootFilled: /<div id="root">\s*<(?!\/div>)/.test(html),
    hydrated,
    ttfb: snap.ttfb,
    fcp: snap.fcp,
    lcp: snap.lcp,
    cls: snap.cls,
    lcpElement: lcpIsImage ? `img ${snap.lcpPath}` : snap.lcpTag,
    htmlBytes: snap.htmlBytes,
    jsBytes: sum(/\.js$/),
    imageBytes: sum(IMAGE),
    lcpImageBytes: lcpIsImage ? bytesOf(snap.lcpPath) : 0,
    fontRequests: fonts.length,
    fontBytes: fonts.reduce((n, r) => n + r.bytes, 0),
    fontFiles: fonts.map((f) =>
      f.path
        .split('/')
        .pop()
        .replace(/-[\w]{8}\.woff2$/, ''),
    ),
    fontPreloads: snap.fontPreloads,
    stylesheetLinks: snap.stylesheetLinks,
    inlineStylesheets: snap.inlineStylesheets,
    externalRequests: external,
    nonGetRequests: posts,
    beacons: snap.beacons,
    hydrationErrors,
    pageErrors,
    fetchpriorityHigh: snap.images.filter((i) => i.fetchpriority === 'high').length,
    imagesWithoutDimensions: visible.filter((i) => !i.dims).map((i) => i.path),
    lazyLcpImage: lcpIsImage && snap.lcpLoading === 'lazy' ? 1 : 0,
    eagerBelowFold: visible
      .filter(
        (i) =>
          i.top >= snap.viewportHeight &&
          i.loading !== 'lazy' &&
          !above.has(i.path) &&
          !exceptionFor(route.id, device, i.path),
      )
      .map((i) => `${i.path.split('/').pop()} top=${Math.round(i.top)}`),
    // Mehr als doppelte benoetigte Pixelbreite und > 10 KB (Befundgrenze PT25.1 §15.2/§21 B10/B11).
    oversizedImages: visible
      .filter((i) => i.natural > 2 * i.needed && i.needed > 0 && bytesOf(i.path) > 10 * 1024)
      .map((i) => `${i.path.split('/').pop()} ${(i.natural / i.needed).toFixed(2)}x`),
    horizontalOverflow: snap.horizontalOverflow ? 1 : 0,
  }
}

const rows = []
const loads = []
let serverProcess = null
let proxyProcess = null
const stopAll = () => {
  for (const child of [proxyProcess, serverProcess])
    if (child)
      try {
        process.kill(-child.pid, 'SIGTERM')
      } catch {
        /* bereits beendet */
      }
}
process.on('exit', stopAll)
process.on('SIGINT', () => process.exit(2))
process.on('SIGTERM', () => process.exit(2))

if (!staticOnly) {
  const routes = ROUTES.filter((r) => !onlyRoutes || onlyRoutes.split(',').includes(r.id))
  if (!routes.length) abort(`keine Route passt zu --routes ${onlyRoutes}`)
  const devices = onlyDevices.filter((d) => DEVICES[d])
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
  const up = async (p) => {
    for (let i = 0; i < 240; i++) {
      try {
        if ((await fetch(`http://127.0.0.1:${p}/robots.txt`)).status < 500) return true
      } catch {
        /* startet noch */
      }
      await sleep(500)
    }
    return false
  }
  let serverLog = ''
  serverProcess = spawn('npm', ['run', 'start'], {
    env: {
      ...process.env,
      NODE_ENV: 'production',
      PORT: String(port),
      POLARIS_CLIENT_DIST_DIR: clientDir,
      POLARIS_SERVER_DIST_DIR: `${buildDir}/server`,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    detached: true,
  })
  serverProcess.stdout.on('data', (d) => (serverLog = (serverLog + d).slice(-4000)))
  serverProcess.stderr.on('data', (d) => (serverLog = (serverLog + d).slice(-4000)))
  if (!(await up(port))) abort(`Produktionsserver auf :${port} startet nicht\n${serverLog}`)
  for (let i = 0; i < 120 && !serverLog.includes('[ssr-warmup]'); i++) await sleep(500)
  proxyProcess = spawn('node', ['scripts/perf/gzip-proxy.mjs', String(proxyPort), String(port)], {
    stdio: 'ignore',
    detached: true,
  })
  if (!(await up(proxyPort))) abort(`gzip-Proxy auf :${proxyPort} startet nicht`)
  const origin = `http://127.0.0.1:${proxyPort}`
  // Server-Kaltstart ist nicht Gegenstand des Gates: jede Route einmal serverseitig anfragen.
  for (const route of routes) await fetch(origin + route.path).then((r) => r.text())

  let browser
  try {
    browser = await chromium.launch({
      channel: 'chromium',
      // Fremde Hosts sind nicht aufloesbar: auch eine Regression kann nichts nach aussen senden.
      args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1'],
    })
  } catch (error) {
    abort(`Chromium startet nicht (npx playwright install chromium): ${error.message}`)
  }
  const raw = Object.fromEntries(
    routes.flatMap((r) => devices.map((d) => [`${d} ${r.id}`, { route: r, device: d, runs: [] }])),
  )
  // Laeufe verschraenkt: Lauf 1 aller Routen, dann Lauf 2 … (Maschinendrift trifft alle gleich).
  for (let i = 0; i < runs; i++) {
    for (const route of routes)
      for (const device of devices) {
        try {
          raw[`${device} ${route.id}`].runs.push(await measureOnce(browser, origin, route, device))
        } catch (error) {
          abort(`${device} ${route.path} Lauf ${i + 1}: ${error.message}`)
        }
      }
    loads.push(Number(loadavg()[0].toFixed(2)))
    console.log(`Lauf ${i + 1}/${runs} fertig · Load1 ${loads.at(-1)} auf ${cpus().length} Kernen`)
  }
  await browser.close()

  for (const { route, device, runs: list } of Object.values(raw)) {
    const scope = `${device} ${route.id} (${route.path})`
    const pick = (key) => median(list.map((r) => r[key]))
    const worst = (key) =>
      Math.max(...list.map((r) => (Array.isArray(r[key]) ? r[key].length : r[key])))
    const detail = (key) => [...new Set(list.flatMap((r) => r[key]))].slice(0, 4).join(', ')
    const row = {
      id: route.id,
      path: route.path,
      device,
      runs: list.length,
      status: [...new Set(list.map((r) => r.status))],
      lcp: pick('lcp'),
      fcp: pick('fcp'),
      ttfb: pick('ttfb'),
      cls: pick('cls'),
      clsMax: Math.max(...list.map((r) => r.cls)),
      lcpElement: list.map((r) => r.lcpElement),
      htmlBytes: pick('htmlBytes'),
      jsBytes: pick('jsBytes'),
      imageBytes: pick('imageBytes'),
      lcpImageBytes: pick('lcpImageBytes'),
      fontRequests: worst('fontRequests'),
      fontBytes: pick('fontBytes'),
      fontFiles: [...new Set(list.flatMap((r) => r.fontFiles))],
      spread: Object.fromEntries(
        ['lcp', 'fcp', 'ttfb', 'cls', 'htmlBytes', 'jsBytes', 'imageBytes', 'fontBytes'].map(
          (k) => [k, [Math.min(...list.map((r) => r[k])), Math.max(...list.map((r) => r[k]))]],
        ),
      ),
      structure: Object.fromEntries(
        [
          'externalRequests',
          'nonGetRequests',
          'beacons',
          'hydrationErrors',
          'pageErrors',
          'fetchpriorityHigh',
          'imagesWithoutDimensions',
          'lazyLcpImage',
          'eagerBelowFold',
          'oversizedImages',
          'horizontalOverflow',
          'fontPreloads',
          'stylesheetLinks',
          'inlineStylesheets',
        ].map((k) => [k, worst(k)]),
      ),
      details: {
        externalRequests: detail('externalRequests'),
        eagerBelowFold: detail('eagerBelowFold'),
        oversizedImages: detail('oversizedImages'),
        imagesWithoutDimensions: detail('imagesWithoutDimensions'),
        hydrationErrors: detail('hydrationErrors'),
        pageErrors: detail('pageErrors'),
      },
      hydratedAll: list.every((r) => r.hydrated),
      ssrRootFilledAll: list.every((r) => r.ssrRootFilled),
    }
    rows.push(row)
    console.log(
      `${device.padEnd(7)} ${route.id.padEnd(16)} LCP ${Math.round(row.lcp)} FCP ${Math.round(row.fcp)} TTFB ${Math.round(row.ttfb)} CLS ${row.cls.toFixed(4)} · HTML ${KB(row.htmlBytes)} JS ${KB(row.jsBytes)} Bild ${KB(row.imageBytes)} (LCP-Bild ${KB(row.lcpImageBytes)}) Font ${row.fontRequests}/${KB(row.fontBytes)} · extern ${row.structure.externalRequests} eager↓ ${row.structure.eagerBelowFold} high ${row.structure.fetchpriorityHigh} gross ${row.structure.oversizedImages} · ${row.lcpElement[0]}`,
    )

    // Struktur: gilt fuer jeden Lauf und jedes Profil (Worst Case ueber die Laeufe).
    const must = (key, actual, expected, cmp = '==', note = '') => {
      check(scope, key, actual, expected, 'count', cmp)
      if (!reportOnly && note && checks.at(-1) && !checks.at(-1).ok)
        violations[violations.length - 1] += ` — ${note}`
    }
    if (row.status.length !== 1 || row.status[0] !== route.expect)
      violations.push(`${scope} HTTP-Status ${row.status.join('/')} statt ${route.expect}`)
    if (!row.ssrRootFilledAll) violations.push(`${scope} SSR-Root leer`)
    if (!row.hydratedAll) violations.push(`${scope} Hydration nicht abgeschlossen (45 s)`)
    const rb = budgets?.runtime?.all ?? {}
    must('externalRequests', row.structure.externalRequests, 0, '==', row.details.externalRequests)
    must('nonGetRequests', row.structure.nonGetRequests, 0)
    must('beacons', row.structure.beacons, 0)
    must('hydrationErrors', row.structure.hydrationErrors, 0, '==', row.details.hydrationErrors)
    must('pageErrors', row.structure.pageErrors, 0, '==', row.details.pageErrors)
    must('fontPreloads', row.structure.fontPreloads, rb.fontPreloads, '==')
    must('stylesheetLinks', row.structure.stylesheetLinks, 0)
    must('inlineStylesheets', row.structure.inlineStylesheets, 1)
    must('fetchpriorityHigh', row.structure.fetchpriorityHigh, rb.fetchpriorityHigh, '<=')
    must(
      'imagesWithoutDimensions',
      row.structure.imagesWithoutDimensions,
      0,
      '==',
      row.details.imagesWithoutDimensions,
    )
    must('lazyLcpImage', row.structure.lazyLcpImage, 0)
    must('eagerBelowFold', row.structure.eagerBelowFold, 0, '==', row.details.eagerBelowFold)
    must('oversizedImages', row.structure.oversizedImages, 0, '==', row.details.oversizedImages)
    must('horizontalOverflow', row.structure.horizontalOverflow, 0)

    // Bytes und Anzahlen: umgebungsunabhaengig, je Route und Geraet.
    const b = budgets?.runtime?.routes?.[route.id]?.[device] ?? {}
    check(scope, 'htmlBytes', row.htmlBytes, b.htmlBytes, 'bytes')
    check(scope, 'jsBytes', row.jsBytes, b.jsBytes, 'bytes')
    check(scope, 'imageBytes', row.imageBytes, b.imageBytes, 'bytes')
    check(scope, 'lcpImageBytes', row.lcpImageBytes, b.lcpImageBytes, 'bytes')
    check(scope, 'fontRequests', row.fontRequests, b.fontRequests)
    check(scope, 'fontBytes', row.fontBytes, b.fontBytes, 'bytes')

    // Zeiten und CLS (LAB): `ci` gegen CWV-Qualitaetsziele, `lab` gegen kalibrierte Budgets.
    const t = profile === 'ci' ? (budgets?.runtime?.timing?.ci ?? {}) : b
    check(scope, 'lcpMs', row.lcp, t.lcpMs, 'ms')
    check(scope, 'cls', row.cls, t.cls, 'cls')
    check(scope, 'ttfbMs', row.ttfb, t.ttfbMs, 'ms')
    if (profile === 'lab') check(scope, 'fcpMs', row.fcp, t.fcpMs, 'ms')
  }
}

const report = {
  gate: 'PT25.5 performance budget gate',
  measuredAt: new Date().toISOString(),
  profile,
  buildDir,
  budgetsFile: reportOnly ? null : budgetsFile,
  runs: staticOnly ? 0 : runs,
  loadPerRun: loads,
  cores: cpus().length,
  node: process.version,
  cwv: {
    LCP_LAB: 'MEASURED',
    CLS_LAB: 'MEASURED',
    TTFB_LAB: 'MEASURED',
    INP_FIELD: 'NOT_AVAILABLE',
    INP_LAB: 'NOT_CLAIMED_AS_FIELD',
  },
  static: staticMeasured,
  rows,
  checks: checks.length,
  violations,
  missingBudgets: missing,
}
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(report, null, 2))

if (reportOnly) {
  console.log(`Report-Modus: ${checks.length} Messwerte, keine Budgetpruefung.`)
  process.exit(0)
}
if (missing.length) {
  console.error(`MESSUNG UNVOLLSTAENDIG: ${missing.length} Messwerte ohne Budget (${budgetsFile}):`)
  for (const m of missing.slice(0, 20)) console.error(`  - ${m}`)
  process.exit(2)
}
if (violations.length) {
  console.error(
    `\nBUDGET VERLETZT: ${violations.length} von ${checks.length} Pruefungen (Vertrag §29):`,
  )
  for (const v of violations) console.error(`  ✗ ${v}`)
  process.exit(1)
}
console.log(`\nBUDGETS GEHALTEN: ${checks.length} Pruefungen, Profil ${profile}, LAB.`)
process.exit(0)
