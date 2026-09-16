import { test, expect, type Browser, type BrowserContext, type Page } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

import { ROUTES } from '../scripts/perf/routes.mjs'
import { SAMPLE_BUNDLE_ASSET_ID } from '../src/content/resources/leadMagnetCandidates'

/**
 * PT25.5 — Performance-Budgets und CI-Gate: breite Integrationspruefung.
 *
 *  1. Budget-Gate ist echt: der aktuelle Build besteht statisch; der PT25.1- und der
 *     PT25.3-Build sowie ein absichtlich zu knappes LCP-Budget scheitern mit einer Meldung,
 *     die Route, Geraet, Messwert und Budget nennt.
 *  2. SSR, HTTP und SEO ueber die ganze Routenmatrix (18 Routen) plus Redirect-Stichproben.
 *  3. Kerninteraktionen ohne Absenden: Navigation, Suche, Sprache, Consent-Ablehnung,
 *     Kontaktformular-Validierung, Resource-Gate, Consumer-Bestelldialog, Mobilmenue.
 *  4. Interaktions-Surrogat (LAB, CPU 4×): Event-Timing-Dauer der Kerninteraktionen.
 *     Das ist KEIN INP (kein Field-Sample, kein p75).
 *  5. AP24: axe serious/critical = 0 und sichtbarer erster Tastaturfokus (Matrix desktop, Kern mobil).
 *  6. Responsive: kein horizontaler Ueberlauf bei 390 / 768 / 1440 px ueber die Matrix.
 *  7. AP23-Grenze: ohne Consent keine Anbieter-, Metrik- oder Beacon-Requests, keine Metriken im dataLayer.
 *  8. Schwere Daten nicht global: fremde Seiten- und Befund-Chunks laden nicht auf der Startseite.
 */

type Route = { id: string; label: string; path: string; expect: number }
type Manifest = Record<string, { file: string; isEntry?: boolean; imports?: string[] }>

const MATRIX = ROUTES as Route[]
const BUILD = process.env.PERF_BUILD_DIR ?? 'node_modules/.cache/pt25.5'
const OUT = 'test-results/pt25.5'
const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|hihuman\.co\.uk|facebook\.(net|com)|hotjar|clarity\.ms|linkedin\.com\/px|analytics\.google/i
const require_ = createRequire(import.meta.url)
const AXE_SOURCE = readFileSync(require_.resolve('axe-core/axe.min.js'), 'utf8')
const CORE_MOBILE = [
  '/de/',
  '/de/contact',
  '/de/downloads',
  '/de/consumer/vitamin-d3-spray',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/pl/',
]

const count = (html: string, re: RegExp) => (html.match(re) || []).length
const tags = (html: string, name: string) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || []
const attr = (tag: string, key: string) => new RegExp(`\\s${key}="([^"]*)"`, 'i').exec(tag)?.[1]

const gate = (args: string[]) => {
  const run = spawnSync('node', ['scripts/perf/check-budgets.mjs', ...args], {
    encoding: 'utf8',
    timeout: 480_000,
  })
  return { status: run.status, out: `${run.stdout}\n${run.stderr}` }
}

/** Zaehlt in einem Kontext jeden Fremd-Request und jeden Nicht-GET-Request (nur Origin + Pfad). */
function guard(context: BrowserContext) {
  const seen = { external: [] as string[], nonGet: [] as string[], pageErrors: [] as string[] }
  context.on('request', (request) => {
    const url = new URL(request.url())
    if (!/^https?:$/.test(url.protocol)) return
    if (url.hostname !== '127.0.0.1') seen.external.push(url.origin + url.pathname)
    if (!['GET', 'HEAD'].includes(request.method()))
      seen.nonGet.push(`${request.method()} ${url.pathname}`)
  })
  context.on('page', (page) =>
    page.on('pageerror', (error) => seen.pageErrors.push(error.message.slice(0, 160))),
  )
  return seen
}

const HYDRATION_MARK = () => {
  const w = window as unknown as { __pt255: { hydrated: boolean; beacons: number } }
  w.__pt255 = { hydrated: false, beacons: 0 }
  if (navigator.sendBeacon) {
    const send = navigator.sendBeacon.bind(navigator)
    navigator.sendBeacon = (...args: Parameters<Navigator['sendBeacon']>) => {
      w.__pt255.beacons++
      return send(...args)
    }
  }
  const poll = () => {
    const footer = document.querySelector('footer')
    if (footer && Object.keys(footer).some((k) => k.startsWith('__reactProps'))) {
      w.__pt255.hydrated = true
      return
    }
    requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

async function hydrated(page: Page) {
  await page.waitForFunction(
    () => (window as unknown as { __pt255: { hydrated: boolean } }).__pt255.hydrated,
    undefined,
    { timeout: 45_000 },
  )
}

async function openContext(browser: Browser, mobile = false) {
  const context = await browser.newContext(
    mobile
      ? {
          viewport: { width: 412, height: 823 },
          deviceScaleFactor: 1.75,
          isMobile: true,
          hasTouch: true,
        }
      : { viewport: { width: 1350, height: 940 } },
  )
  await context.addInitScript(HYDRATION_MARK)
  return context
}

async function axeSeriousCritical(page: Page) {
  await page.addScriptTag({ content: AXE_SOURCE })
  return page.evaluate(async () => {
    const w = window as unknown as {
      axe: {
        run: (d: Document, o: unknown) => Promise<{ violations: { id: string; impact: string }[] }>
      }
    }
    const result = await w.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    })
    return result.violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => v.id)
  })
}

test.describe.serial('PT25.5', () => {
  test('1 Budget-Gate: aktueller Build besteht, Gegenproben scheitern mit klarer Meldung', async () => {
    const current = gate(['--build', BUILD, '--static-only'])
    expect(current.status, current.out).toBe(0)

    // CI-Zeitgrenzen sind die „gut"-Schwellen des Web-Vitals-Moduls — eine Quelle, kein zweiter Wert.
    const { WEB_VITAL_THRESHOLDS } = await import('../src/lib/monitoring/web-vitals')
    const budgetFile = JSON.parse(readFileSync('scripts/perf/budgets.json', 'utf8'))
    expect(budgetFile.runtime.timing.ci).toEqual({
      lcpMs: WEB_VITAL_THRESHOLDS.LCP[0],
      cls: WEB_VITAL_THRESHOLDS.CLS[0],
      ttfbMs: WEB_VITAL_THRESHOLDS.TTFB[0],
    })

    // PT25.1-Baseline: Entry mit Consumer-Seiten, Musterbefund mit allen Sprachen.
    const baseline = gate(['--build', 'node_modules/.cache/pt25.1', '--static-only'])
    expect(baseline.status, baseline.out).toBe(1)
    expect(baseline.out).toMatch(/statisch initialJsGzip: gemessen [\d.]+ KB, Budget hoechstens/)
    expect(baseline.out).toMatch(
      /statisch route musterbefund .* routeJsGzip|route musterbefund routeJsGzip/,
    )
    expect(baseline.out).toContain('consumer-d3 (src/pages/consumer/SprayPage.tsx)')

    // PT25.3-Stand: Fallback-Face ohne wirksame Arial-metrische Quellen (vor PT25.4).
    const beforeFonts = gate(['--build', 'node_modules/.cache/pt25.3', '--static-only'])
    expect(beforeFonts.status, beforeFonts.out).toBe(1)
    expect(beforeFonts.out).toContain('statisch fallbackFaces: gemessen 1, Budget genau 2')

    // Laufzeit: dieselbe Route einmal mit echtem und einmal mit absichtlich zu knappem LCP-Budget.
    const args = ['--build', BUILD, '--profile', 'lab', '--routes', 'contact']
    const common = [...args, '--profiles', 'mobile', '--runs', '3', '--port', '3981']
    const real = gate(common)
    expect(real.status, real.out).toBe(0)
    const budgets = JSON.parse(readFileSync('scripts/perf/budgets.json', 'utf8'))
    budgets.runtime.routes.contact.mobile.lcpMs = 100
    mkdirSync(OUT, { recursive: true })
    writeFileSync(`${OUT}/budgets-gegenprobe.json`, JSON.stringify(budgets))
    const tight = gate([...common, '--budgets', `${OUT}/budgets-gegenprobe.json`])
    expect(tight.status, tight.out).toBe(1)
    expect(tight.out).toMatch(
      /mobile contact \(\/de\/contact\) lcpMs: gemessen \d+ ms, Budget hoechstens 100 ms/,
    )
  })

  test('2 SSR, HTTP und SEO ueber die ganze Matrix (18 Routen) und Redirects', async ({
    request,
  }) => {
    for (const route of MATRIX) {
      const response = await request.get(route.path, { maxRedirects: 0 })
      const html = await response.text()
      const label = route.path
      const locale = route.path.split('/')[1]
      expect(response.status(), label).toBe(route.expect)
      expect(response.headers()['content-type'], label).toContain('text/html')
      expect(html, `${label}: SSR-Root leer`).toMatch(/<div id="root">\s*<(?!\/div>)/)
      expect(count(html, /<title[\s>]/g), `${label}: title`).toBe(1)
      expect(attr(tags(html, 'html')[0] ?? '', 'lang'), `${label}: html lang`).toBe(locale)
      expect(count(html, /<style data-inline-stylesheet=/g), `${label}: Inline-CSS`).toBe(1)
      expect(
        tags(html, 'link').filter((t) => attr(t, 'rel') === 'stylesheet'),
        `${label}: Stylesheet-Link`,
      ).toEqual([])
      expect(
        tags(html, 'link').filter((t) => attr(t, 'rel') === 'preload' && attr(t, 'as') === 'font')
          .length,
        `${label}: Font-Preload`,
      ).toBe(1)
      expect(html, `${label}: Render-Marke`).toContain('id="polaris-render-ready"')
      expect(html, `${label}: i18n-Zustand`).toContain('id="polaris-i18n-state"')
      expect(html, `${label}: Anbieter im SSR`).not.toMatch(PROVIDER)
      const metas = tags(html, 'meta')
      const description = metas.find((t) => attr(t, 'name') === 'description')
      expect((description && attr(description, 'content')) || '', `${label}: description`).toMatch(
        /.{20,}/,
      )
      const canonical = tags(html, 'link').filter((t) => attr(t, 'rel') === 'canonical')
      const robots = metas.find((t) => attr(t, 'name') === 'robots')
      if (route.expect === 200) {
        expect(canonical.length, `${label}: canonical`).toBe(1)
        expect(attr(canonical[0], 'href'), `${label}: canonical absolut`).toMatch(/^https:\/\//)
        expect(count(html, /hreflang="x-default"/gi), `${label}: x-default`).toBe(1)
        expect(robots ? attr(robots, 'content') : '', `${label}: noindex`).not.toMatch(/noindex/)
      } else {
        expect(canonical.length, `${label}: canonical auf 404`).toBe(0)
        expect(robots ? attr(robots, 'content') : '', `${label}: 404 ohne noindex`).toBe(
          'noindex, follow',
        )
      }
    }
    for (const [from, to] of [
      ['/', '/de/'],
      ['/contact', '/de/contact'],
      ['/epigenetics?utm_source=pt25_5', '/de/epigenetics?utm_source=pt25_5'],
    ]) {
      const response = await request.get(from, { maxRedirects: 0 })
      expect(response.status(), from).toBe(301)
      expect(response.headers().location, from).toBe(to)
    }
  })

  test('3 Kerninteraktionen ohne Absenden und ohne Fremd-Requests', async ({ browser }) => {
    // Desktop: Suche, clientseitige Navigation, Sprachumschalter.
    const desktop = await openContext(browser)
    const seenDesktop = guard(desktop)
    let page = await desktop.newPage()
    await page.goto('/de/')
    await hydrated(page)
    await page
      .getByRole('button', { name: /Suche öffnen/i })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.locator('#search-input').fill('vitamin')
    await expect(page.locator('[data-search-results] a').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await page.locator('header a[href="/de/epigenetics"]').first().click()
    await expect(page).toHaveURL(/\/de\/epigenetics$/)
    await expect(page.locator('h1').first()).toBeVisible()
    const language = page.getByRole('button', { name: /Sprache wählen/i }).first()
    await language.click()
    await page
      .getByRole('button', { name: /Polski/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/pl\/epigenetics$/)
    expect(seenDesktop).toEqual({ external: [], nonGet: [], pageErrors: [] })
    await desktop.close()

    // Frischer Kontext: Consent ablehnen, bleibt nach Reload abgelehnt; dann Formular und Gate.
    const fresh = await openContext(browser)
    const seen = guard(fresh)
    page = await fresh.newPage()
    await page.goto('/de/contact')
    await hydrated(page)
    const necessary = page.getByRole('button', { name: 'Nur notwendige' })
    await expect(necessary).toBeVisible()
    await necessary.click()
    await expect(necessary).toHaveCount(0)
    await page.reload()
    await hydrated(page)
    await page.waitForTimeout(1000)
    await expect(page.getByRole('button', { name: 'Nur notwendige' })).toHaveCount(0)

    // Kontaktformular: gueltige Felder ohne Verarbeitungs-Consent → sichtbare Fehlermeldung, kein Request.
    for (const [selector, value] of [
      ['#name', 'PT25.5 Budget-Gate'],
      ['#email', 'budget-gate@praxis.example'],
    ]) {
      await page.locator(selector).fill(value)
      if ((await page.locator(selector).inputValue()) !== value)
        await page.locator(selector).fill(value)
    }
    await page.getByRole('button', { name: 'Dental' }).first().click()
    await page.locator('#requirements').fill('PT25.5: nur Validierung, kein Absenden.')
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
    await expect(page.locator('#consent-error')).toBeVisible()

    // Resource-Gate: Formular oeffnet, wird nicht abgesendet; keine Datei-URL im Markup.
    await page.goto('/de/downloads')
    await hydrated(page)
    const trigger = page.locator(
      `[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"] button[data-gate-asset]`,
    )
    await expect(trigger).toBeVisible()
    await expect(async () => {
      if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
      await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    await expect(page.locator('[data-gate-state="form"] button[type="submit"]')).toBeVisible()
    expect(seen).toEqual({ external: [], nonGet: [], pageErrors: [] })
    await fresh.close()

    // Mobil: Menue und Consumer-Bestelldialog.
    const mobile = await openContext(browser, true)
    const seenMobile = guard(mobile)
    page = await mobile.newPage()
    await page.goto('/de/')
    await hydrated(page)
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
    await expect(burger).toBeFocused()
    await page.goto('/de/consumer/vitamin-d3-spray')
    await hydrated(page)
    await page
      .getByRole('button', { name: /Bestellen/i })
      .first()
      .click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    expect(seenMobile).toEqual({ external: [], nonGet: [], pageErrors: [] })
    await mobile.close()
  })

  test('4 Interaktions-Surrogat LAB (CPU 4×, Event Timing) — kein INP', async ({ browser }) => {
    const context = await openContext(browser, true)
    await context.addInitScript(() => {
      const w = window as unknown as { __events: number[] }
      w.__events = []
      new PerformanceObserver((list) =>
        list.getEntries().forEach((e) => {
          if ((e as PerformanceEventTiming).interactionId) w.__events.push(e.duration)
        }),
      ).observe({ type: 'event', durationThreshold: 16, buffered: true } as PerformanceObserverInit)
    })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    const measure = async (label: string, act: () => Promise<void>) => {
      await page.evaluate(() => ((window as unknown as { __events: number[] }).__events = []))
      await act()
      await page.waitForTimeout(600)
      const events = await page.evaluate(
        () => (window as unknown as { __events: number[] }).__events,
      )
      return { label, maxEventMs: events.length ? Math.max(...events) : 0, entries: events.length }
    }
    const results = []
    await page.goto('/de/')
    await hydrated(page)
    await page.waitForTimeout(1500)
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    results.push(await measure('Mobilmenue oeffnen', () => burger.click()))
    results.push(
      await measure('Mobilmenue schliessen (Escape)', () => page.keyboard.press('Escape')),
    )
    results.push(
      await measure('Consent ablehnen', () =>
        page.getByRole('button', { name: 'Nur notwendige' }).click(),
      ),
    )
    await page.goto('/de/consumer/vitamin-d3-spray')
    await hydrated(page)
    await page.waitForTimeout(1500)
    results.push(
      await measure('Bestelldialog oeffnen', () =>
        page
          .getByRole('button', { name: /Bestellen/i })
          .first()
          .click(),
      ),
    )
    mkdirSync(OUT, { recursive: true })
    writeFileSync(
      `${OUT}/interaction-surrogate.json`,
      JSON.stringify(
        {
          status: { INP_FIELD: 'NOT_AVAILABLE', INP_LAB: 'NOT_CLAIMED_AS_FIELD' },
          profile:
            'mobil 412×823, CPU 4×, ohne Netzdrosselung, Event Timing (durationThreshold 16 ms)',
          results,
        },
        null,
        2,
      ),
    )
    console.log(JSON.stringify(results))
    // Qualitaetsziel: Interaktion unter der CWV-Grenze „gut" (200 ms) — als LAB-Surrogat, nicht als INP.
    for (const r of results)
      expect(r.maxEventMs, `${r.label}: Event-Dauer`).toBeLessThanOrEqual(200)
    await context.close()
  })

  test('5 AP24: axe serious/critical = 0 und sichtbarer erster Tastaturfokus', async ({
    browser,
  }) => {
    const cases = [
      ...MATRIX.map((r) => ({ path: r.path, mobile: false })),
      ...CORE_MOBILE.map((path) => ({ path, mobile: true })),
    ]
    for (const c of cases) {
      const context = await openContext(browser, c.mobile)
      const page = await context.newPage()
      await page.goto(c.path)
      await hydrated(page)
      // Geprueft wird der sichtbare Endzustand: `Reveal` blendet Abschnitte erst beim Einscrollen
      // ein; davor misst axe Text mit Deckkraft 0 (gemessen PT25.5, 24 Faelle: ohne Scrollen 7 mit
      // `color-contrast` an Deckkraft-0-Knoten unter dem Falz, nach Scrollen 0, mit
      // `prefers-reduced-motion` 0 — identisch auf dem PT25.3-Build). Also durchscrollen, endliche
      // Animationen auslaufen lassen, dann axe.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += Math.round(window.innerHeight * 0.6)) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 120))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForFunction(
        () =>
          document
            .getAnimations()
            .filter((a) => a.effect?.getTiming().iterations !== Infinity)
            .every((a) => a.playState !== 'running'),
        undefined,
        { timeout: 15_000 },
      )
      await page.waitForTimeout(300)
      const label = `${c.path} ${c.mobile ? 'mobil' : 'desktop'}`
      expect(await axeSeriousCritical(page), `${label}: axe serious/critical`).toEqual([])
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        return cs.outlineStyle !== 'none' || cs.boxShadow !== 'none'
      })
      expect(focus, `${label}: erster Tabstopp ohne sichtbaren Fokus`).toBe(true)
      await context.close()
    }
  })

  test('6 Responsive: kein horizontaler Ueberlauf bei 390 / 768 / 1440 px', async ({ browser }) => {
    const overflow: string[] = []
    const noted1024: string[] = []
    for (const width of [390, 768, 1024, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 } })
      await context.addInitScript(HYDRATION_MARK)
      const page = await context.newPage()
      for (const route of MATRIX) {
        await page.goto(route.path)
        await hydrated(page)
        const wide = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth,
        )
        if (wide > 0)
          (width === 1024 ? noted1024 : overflow).push(`${route.path} @${width}: +${wide}px`)
      }
      await context.close()
    }
    // 1024 px ist `D-20` (AP27, offen): gemessen und protokolliert, nicht Gegenstand von AP25.
    test.info().annotations.push({
      type: 'D-20 1024px',
      description: noted1024.join('; ') || 'kein Ueberlauf',
    })
    console.log(`1024px (D-20, AP27): ${noted1024.join('; ') || 'kein Ueberlauf'}`)
    expect(overflow).toEqual([])
  })

  test('7 AP23-Grenze: ohne Consent keine Anbieter-, Metrik- oder Beacon-Requests', async ({
    browser,
  }) => {
    const context = await openContext(browser, true)
    const seen = guard(context)
    const metricLike: string[] = []
    context.on('request', (request) => {
      const { pathname } = new URL(request.url())
      if (/metric|telemetry|vitals|\/rum\b|beacon|\/collect\b/i.test(pathname))
        metricLike.push(pathname)
    })
    const page = await context.newPage()
    for (const route of MATRIX) {
      await page.goto(route.path)
      await hydrated(page)
      await page.waitForTimeout(1200)
      const state = await page.evaluate(() => {
        const w = window as unknown as {
          __pt255: { beacons: number }
          dataLayer?: unknown[]
        }
        return {
          beacons: w.__pt255.beacons,
          metricEntries: (w.dataLayer ?? [])
            .map((e) => JSON.stringify(e))
            .filter((s) => /web.?vital|\b(lcp|cls|inp|ttfb|fcp)\b|metric/i.test(s)),
        }
      })
      expect(state, `${route.path}: Beacons/Metriken im dataLayer`).toEqual({
        beacons: 0,
        metricEntries: [],
      })
    }
    expect(
      seen.external.filter((u) => PROVIDER.test(u)),
      'Anbieter ohne Consent',
    ).toEqual([])
    expect(seen.external, 'Fremd-Requests').toEqual([])
    expect(seen.nonGet, 'Nicht-GET-Requests').toEqual([])
    expect(metricLike, 'Metrik-Requests').toEqual([])
    await context.close()
  })

  test('8 Schwere Daten nicht global: fremde Seiten- und Befund-Chunks laden nicht auf der Startseite', async ({
    browser,
  }) => {
    const manifest = JSON.parse(
      readFileSync(`${BUILD}/client/.vite/manifest.json`, 'utf8'),
    ) as Manifest
    // Statischer Abschluss des Entry: diese Dateien laden auf jeder Seite und sind nicht „fremd".
    const initial = new Set<string>()
    const walk = (key: string) => {
      if (initial.has(key)) return
      initial.add(key)
      ;(manifest[key].imports ?? []).forEach(walk)
    }
    walk('index.html')
    const foreign = Object.entries(manifest)
      .filter(
        ([key]) =>
          /^src\/pages\//.test(key) && !/HomePage|NotFoundPage/.test(key) && !initial.has(key),
      )
      .map(([, v]) => v.file)
    const befund = Object.entries(manifest)
      .filter(([key]) => /src\/content\/befunde\/.*\.json$/.test(key))
      .map(([key, v]) => ({ key, file: v.file }))
    expect(foreign.length).toBeGreaterThan(10)
    expect(befund.length).toBeGreaterThan(10)
    for (const mobile of [false, true]) {
      const context = await openContext(browser, mobile)
      const page = await context.newPage()
      const scripts: string[] = []
      page.on('request', (r) => {
        if (r.resourceType() === 'script') scripts.push(new URL(r.url()).pathname.slice(1))
      })
      await page.goto('/de/')
      await hydrated(page)
      await page.waitForTimeout(2000)
      expect(
        scripts.filter((s) => foreign.includes(s)),
        'fremde Seiten-Chunks auf /de/',
      ).toEqual([])
      expect(
        scripts.filter((s) => befund.some((b) => b.file === s)),
        'Befund-Inhalte auf /de/',
      ).toEqual([])
      scripts.length = 0
      await page.goto('/de/epigenetics/musterbefund/metabolic-health')
      await hydrated(page)
      await page.waitForTimeout(1500)
      const loadedBefund = befund.filter((b) => scripts.includes(b.file)).map((b) => b.key)
      expect(loadedBefund, 'Musterbefund laedt genau einen Sprach-Inhalt').toEqual([
        expect.stringMatching(/metabolic-health\.de\.json$/),
      ])
      await context.close()
    }
  })
})
