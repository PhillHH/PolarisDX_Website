import { test, expect, type Page, type CDPSession } from '@playwright/test'
import { mkdirSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
// @ts-expect-error — reines ESM-Messmodul ohne Typdeklaration
import { ROUTES } from '../scripts/perf/routes.mjs'

/**
 * PT25.1 — Performance-Baseline (Browser-Collector) und Mess-Integritaet.
 *
 * Dieser Lauf OPTIMIERT nichts. Er haelt je Route fest, was ein echter Browser
 * sieht: LCP-Element, CLS-Quellen, Long Tasks, Hydrationszeitpunkt, Request-
 * Wasserfall, Bild- und Fontnutzung — und prueft nebenbei, dass die Messung
 * selbst belastbar ist (HTTP-Wahrheit, SSR-Inhalt, 0 Provider-Requests ohne
 * Consent, keine Hydration-Fehler).
 *
 * Profile:
 *   mobile  — 412x823, DPR 1.75, CDP-Drosselung 4x CPU, 150 ms RTT, 1,6 Mbit/s
 *             (angewandt, nicht simuliert; entspricht Lighthouse-Mobile-Eckwerten)
 *   desktop — 1350x940, DPR 1, ohne Drosselung
 *
 * Alles hier ist LAB bzw. PREVIEW. Nichts davon ist Field/RUM, nichts davon ist INP:
 * die gemessene Interaktion ist ein Lab-Surrogat mit genau einem Klick.
 */

type Route = { id: string; label: string; path: string; expect: number }
const ENV = process.env.PERF_ENV ?? (process.env.PERF_ORIGIN ? 'PREVIEW' : 'LAB')
// PT25.2+: `PERF_OUT` trennt Vorher-/Nachher-Laeufe, ohne die PT25.1-Baseline zu ueberschreiben.
const OUT = process.env.PERF_OUT ?? 'node_modules/.cache/pt25.1/results'
const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|hihuman\.co\.uk|facebook\.(net|com)|hotjar|clarity\.ms|linkedin\.com\/px|analytics\.google/i
const PROFILES = {
  mobile: {
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    isMobile: true,
    hasTouch: true,
    throttle: true,
  },
  desktop: {
    viewport: { width: 1350, height: 940 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    throttle: false,
  },
} as const

const head = (() => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
  } catch {
    return 'unbekannt'
  }
})()

/** Laeuft VOR jedem Seitenskript: sammelt LCP, CLS, Long Tasks und den Hydrationszeitpunkt. */
const COLLECTOR = () => {
  const w = window as unknown as Record<string, unknown>
  const store = {
    lcp: [] as unknown[],
    shifts: [] as unknown[],
    longtasks: [] as unknown[],
    events: [] as unknown[],
    hydrationStart: null as number | null,
    hydrationEnd: null as number | null,
  }
  w.__pt251 = store
  const describe = (el: Element | null) => {
    if (!el) return null
    const img = el as HTMLImageElement
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: (el.getAttribute('class') || '').slice(0, 80),
      src: img.currentSrc || img.src || null,
      loading: el.getAttribute('loading'),
      fetchpriority: el.getAttribute('fetchpriority'),
      text: el.tagName === 'IMG' ? null : (el.textContent || '').trim().slice(0, 60),
    }
  }
  try {
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        const x = e as PerformanceEntry & {
          element: Element | null
          size: number
          url: string
          renderTime: number
          loadTime: number
        }
        store.lcp.push({
          t: Math.round(x.startTime),
          size: x.size,
          url: x.url,
          element: describe(x.element),
        })
      }),
    ).observe({ type: 'largest-contentful-paint', buffered: true })
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        const x = e as PerformanceEntry & {
          value: number
          hadRecentInput: boolean
          sources: { node: Element | null }[]
        }
        if (!x.hadRecentInput)
          store.shifts.push({
            t: Math.round(x.startTime),
            value: x.value,
            sources: (x.sources || []).map((s) => describe(s.node)),
          })
      }),
    ).observe({ type: 'layout-shift', buffered: true })
    new PerformanceObserver((l) =>
      l
        .getEntries()
        .forEach((e) =>
          store.longtasks.push({ t: Math.round(e.startTime), d: Math.round(e.duration) }),
        ),
    ).observe({ type: 'longtask', buffered: true })
    new PerformanceObserver((l) =>
      l.getEntries().forEach((e) => {
        const x = e as PerformanceEntry & {
          processingStart: number
          processingEnd: number
          interactionId: number
        }
        store.events.push({
          name: e.name,
          d: Math.round(e.duration),
          input: Math.round(x.processingStart - e.startTime),
          proc: Math.round(x.processingEnd - x.processingStart),
          id: x.interactionId,
        })
      }),
    ).observe({ type: 'event', buffered: true, durationThreshold: 16 } as PerformanceObserverInit)
  } catch {
    /* aeltere Engines: Felder bleiben leer und werden als nicht gemessen ausgewiesen */
  }
  // Hydration: hydrateRoot() markiert den Container sofort (Start); React haengt
  // Props-Schluessel an DOM-Knoten erst, wenn es sie hydriert hat. Der Footer ist
  // der letzte grosse SSR-Knoten — sein Props-Schluessel ist der Endpunkt-Proxy.
  const poll = () => {
    const root = document.getElementById('root')
    if (
      root &&
      store.hydrationStart === null &&
      Object.keys(root).some((k) => k.startsWith('__reactContainer'))
    )
      store.hydrationStart = Math.round(performance.now())
    const footer = document.querySelector('footer')
    if (
      footer &&
      store.hydrationEnd === null &&
      Object.keys(footer).some((k) => k.startsWith('__reactProps'))
    )
      store.hydrationEnd = Math.round(performance.now())
    if (store.hydrationEnd === null) requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

async function throttle(cdp: CDPSession) {
  await cdp.send('Network.enable')
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1638.4 * 1024) / 8,
    uploadThroughput: (675 * 1024) / 8,
  })
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
}

async function collect(
  page: Page,
  route: Route,
  t0Requests: {
    url: string
    type: string
    start: number
    end: number
    bytes: number
    status: number
  }[],
) {
  // Ruhephase: Hydration startet erst NACH allen Locale-JSONs (entry-client wartet
  // auf i18nReady). Unter Mobil-Drosselung liegt das deutlich hinter `load` —
  // deshalb auf den Hydrations-Endpunkt warten, dann 2 s fuer spaete Shifts.
  await page.waitForLoadState('load')
  const hydrated = await page
    .waitForFunction(
      () =>
        (window as unknown as { __pt251?: { hydrationEnd: number | null } }).__pt251
          ?.hydrationEnd != null,
      undefined,
      { timeout: 30_000, polling: 100 },
    )
    .then(() => true)
    .catch(() => false)
  await page.waitForTimeout(2000)
  const data = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = Object.fromEntries(
      performance.getEntriesByType('paint').map((p) => [p.name, Math.round(p.startTime)]),
    )
    const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
    const vw = window.innerWidth
    const vh = window.innerHeight
    const dpr = window.devicePixelRatio
    const images = [...document.images].map((img) => {
      const r = img.getBoundingClientRect()
      const entry = res.find((e) => e.name === img.currentSrc)
      return {
        src: (img.currentSrc || img.src).replace(location.origin, ''),
        loading: img.getAttribute('loading'),
        fetchpriority: img.getAttribute('fetchpriority'),
        hasWH: img.hasAttribute('width') && img.hasAttribute('height'),
        srcset: img.hasAttribute('srcset') || !!img.closest('picture'),
        natural: [img.naturalWidth, img.naturalHeight],
        rendered: [Math.round(r.width), Math.round(r.height)],
        oversize: r.width ? Number((img.naturalWidth / (r.width * dpr)).toFixed(2)) : null,
        aboveFold: r.top < vh && r.bottom > 0 && r.width > 0,
        loaded: img.complete && img.naturalWidth > 0,
        bytes: entry ? entry.encodedBodySize : null,
      }
    })
    const fonts = [...document.fonts]
      .filter((f) => f.status === 'loaded')
      .map((f) => `${f.family} ${f.weight} ${f.unicodeRange.slice(0, 20)}`)
    return {
      w: vw,
      h: vh,
      dpr,
      ttfb: Math.round(nav.responseStart),
      domInteractive: Math.round(nav.domInteractive),
      dcl: Math.round(nav.domContentLoadedEventEnd),
      load: Math.round(nav.loadEventEnd),
      htmlTransfer: nav.transferSize,
      htmlDecoded: nav.decodedBodySize,
      paint,
      images,
      fonts,
      store: (window as unknown as { __pt251: unknown }).__pt251,
      resourcesByType: res.reduce<Record<string, { n: number; transfer: number; decoded: number }>>(
        (acc, e) => {
          const k = e.initiatorType
          acc[k] = acc[k] || { n: 0, transfer: 0, decoded: 0 }
          acc[k].n++
          acc[k].transfer += e.transferSize
          acc[k].decoded += e.decodedBodySize
          return acc
        },
        {},
      ),
    }
  })
  const store = data.store as {
    lcp: { t: number; size: number; url: string; element: unknown }[]
    shifts: { t: number; value: number; sources: unknown[] }[]
    longtasks: { t: number; d: number }[]
    hydrationStart: number | null
    hydrationEnd: number | null
  }
  // CLS nach Session-Windows (1 s Luecke, 5 s Fenster) wie in der CWV-Definition.
  let cls = 0,
    win = 0,
    winStart = -1,
    last = -1
  for (const s of store.shifts) {
    if (winStart < 0 || s.t - last > 1000 || s.t - winStart > 5000) {
      win = 0
      winStart = s.t
    }
    win += s.value
    last = s.t
    cls = Math.max(cls, win)
  }
  const lcpLast = store.lcp.at(-1) ?? null
  const localeJson = t0Requests.filter((r) => r.url.includes('/locales/'))
  return {
    ...data,
    store: undefined,
    lcp: lcpLast,
    lcpCandidates: store.lcp.length,
    cls: Number(cls.toFixed(4)),
    shiftSources: store.shifts.filter((s) => s.value > 0.001).slice(0, 5),
    longTasks: {
      n: store.longtasks.length,
      totalMs: store.longtasks.reduce((a, b) => a + b.d, 0),
      maxMs: Math.max(0, ...store.longtasks.map((x) => x.d)),
      tbtLike: store.longtasks.reduce((a, b) => a + Math.max(0, b.d - 50), 0),
    },
    hydration: {
      start: store.hydrationStart,
      end: store.hydrationEnd,
      observedWithin30s: hydrated,
    },
    localeJson: localeJson.map((r) => ({ url: r.url, start: r.start, end: r.end })),
    requests: t0Requests,
  }
}

const results: Record<string, unknown>[] = []

/**
 * Eine Datei je Umgebung UND Profil: nach einem fehlgeschlagenen Test startet
 * Playwright den Worker neu, das Modul (und `results`) beginnt leer — eine
 * gemeinsame Datei wuerde das andere Profil still ueberschreiben.
 */
function persist(profile: string) {
  mkdirSync(OUT, { recursive: true })
  const rows = results.filter((r) => r.profile === profile)
  writeFileSync(
    `${OUT}/pw-${ENV}-${profile}.json`,
    JSON.stringify(
      {
        env: ENV,
        profile,
        head,
        measuredAt: new Date().toISOString(),
        tool: 'Playwright + CDP (Chromium)',
        rows,
      },
      null,
      2,
    ),
  )
}

for (const profileName of ['mobile', 'desktop'] as const) {
  test(`PT25.1 ${ENV} ${profileName}: Collector ueber die Routenmatrix`, async ({ browser }) => {
    const profile = PROFILES[profileName]
    const failures: string[] = []
    for (const route of ROUTES as Route[]) {
      const context = await browser.newContext({
        viewport: profile.viewport,
        deviceScaleFactor: profile.deviceScaleFactor,
        isMobile: profile.isMobile,
        hasTouch: profile.hasTouch,
      })
      await context.addInitScript(COLLECTOR)
      const page = await context.newPage()
      const cdp = await context.newCDPSession(page)
      if (profile.throttle) await throttle(cdp)
      const version = browser.version()
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text().slice(0, 200))
      })
      page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 200)))

      for (const cache of ['cold', 'warm'] as const) {
        const requests: {
          url: string
          type: string
          start: number
          end: number
          bytes: number
          status: number
        }[] = []
        const base = Date.now()
        const starts = new Map<string, number>()
        page.on('request', (r) => starts.set(r.url() + '#' + cache, Date.now() - base))
        const onFinish = async (r: import('@playwright/test').Request) => {
          const resp = await r.response().catch(() => null)
          const sizes = await r
            .sizes()
            .catch(() => ({ responseBodySize: 0, responseHeadersSize: 0 }))
          requests.push({
            url: r
              .url()
              .replace(/^https?:\/\/[^/]+/, (h) =>
                h.includes('127.0.0.1') || h.includes('preview.polarisdx.net') ? '' : h,
              ),
            type: r.resourceType(),
            start: starts.get(r.url() + '#' + cache) ?? -1,
            end: Date.now() - base,
            bytes: sizes.responseBodySize + sizes.responseHeadersSize,
            status: resp?.status() ?? 0,
          })
        }
        page.on('requestfinished', onFinish)
        const response = await page.goto(route.path, { waitUntil: 'commit' })
        const status = response?.status() ?? 0
        const row = await collect(page, route, requests)
        page.off('requestfinished', onFinish)
        const provider = requests.filter((r) => PROVIDER.test(r.url)).map((r) => r.url)
        const ssrFilled =
          cache === 'cold'
            ? /<div id="root">(?:<!--\$-->)*\s*<[a-z]/i.test((await response?.text()) ?? '')
            : null
        const hydrationErrors = errors.filter((e) => /hydrat|#418|#423|#425|did not match/i.test(e))

        if (status !== route.expect)
          failures.push(`${route.id} ${cache}: HTTP ${status} statt ${route.expect}`)
        if (cache === 'cold' && !ssrFilled) failures.push(`${route.id}: SSR-Root leer`)
        if (provider.length)
          failures.push(`${route.id} ${cache}: ${provider.length} Provider-Requests ohne Consent`)
        if (hydrationErrors.length)
          failures.push(`${route.id} ${cache}: Hydration-Fehler ${hydrationErrors[0]}`)

        results.push({
          env: ENV,
          head,
          browser: version,
          profile: profileName,
          cache,
          id: route.id,
          path: route.path,
          status,
          ssrFilled,
          providerRequests: provider.length,
          consoleErrors: errors.length,
          hydrationErrors: hydrationErrors.length,
          ...row,
        })
        errors.length = 0
      }

      // Lab-Interaktions-Surrogat (KEIN INP): ein Klick auf das erste sichtbare
      // Header-Steuerelement der Startseite, Dauer aus der Event Timing API.
      if (route.id === 'home') {
        const trigger =
          profileName === 'mobile'
            ? page.locator('header button[aria-expanded]').first()
            : page.locator('header button[aria-expanded]').first()
        if (await trigger.isVisible().catch(() => false)) {
          await trigger.click()
          await page.waitForTimeout(600)
          const events = await page.evaluate(() =>
            (
              window as unknown as {
                __pt251: {
                  events: { name: string; d: number; input: number; proc: number; id: number }[]
                }
              }
            ).__pt251.events.filter((e) => e.id > 0),
          )
          results.push({
            env: ENV,
            head,
            profile: profileName,
            id: 'lab-interaction-proxy',
            path: route.path,
            kind: 'LAB_INTERACTION_SURROGATE_NOT_INP',
            target: await trigger.getAttribute('aria-label'),
            maxDurationMs: Math.max(0, ...events.map((e) => e.d)),
            events,
          })
        }
      }
      await context.close()
    }
    persist(profileName)
    expect(failures, failures.join('\n')).toEqual([])
  })
}
