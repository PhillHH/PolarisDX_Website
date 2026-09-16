import { test, expect, type Page, type Request } from '@playwright/test'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
// @ts-expect-error — reines ESM-Messmodul ohne Typdeklaration
import { ROUTES } from '../scripts/perf/routes.mjs'

/**
 * PT25.2 — fokussierte Regressionstests fuer die Render-/Hydration-Aenderungen:
 *
 *  1. Kaltstart-SSR der jetzt lazy geladenen Consumer-Seiten und der Befundseiten
 *     (Modul-`await`): echter Titel, genau ein <title>/Canonical, Inhalt im HTML.
 *  2. SSR-Routen-Smoke ueber die PT25.1-Matrix inkl. i18n-Zustandsblock.
 *  3. 404-/Redirect-Sanity.
 *  4. Hydration-Smoke: keine Hydration-Fehler, kein Root-Fallback, SSR-Text bleibt,
 *     vor der Hydration nur die SSR-Namespaces, keine Fallback-Sprache, keine
 *     Doppel-Requests.
 *  5. Kern-Interaktionen: Suche, Mobilmenue, Sprachumschalter, Bestell-Modal,
 *     clientseitige Navigation direkt nach der Hydration.
 *  6. AP23: 0 Analytics-/Marketing-Provider-Requests ohne Consent.
 *  7. AP24: axe (serious/critical = 0) und Tastatur-Fokus auf den beruehrten Seiten.
 */

type Route = { id: string; label: string; path: string; expect: number }
type I18nState = {
  lng: string
  ns: string[]
  fallback: Record<string, Record<string, unknown>> | null
}

const NAMESPACES = [
  'common',
  'home',
  'about',
  'articles',
  'contact',
  'services',
  'events',
  'downloads',
  'epigenetics',
  'legal',
  'products',
  'support',
  'vitd3spray',
  'specialty',
  'consumer',
]
const PROVIDER =
  /googletagmanager\.com|google-analytics\.com|doubleclick\.net|hihuman\.co\.uk|facebook\.(net|com)|hotjar|clarity\.ms|linkedin\.com\/px|analytics\.google/i
const STATIC_TITLE = /<title>([^<]*)<\/title>/.exec(readFileSync('index.html', 'utf8'))![1]
const require_ = createRequire(import.meta.url)
const AXE_SOURCE = readFileSync(require_.resolve('axe-core/axe.min.js'), 'utf8')

const readState = (html: string): I18nState | null => {
  const m = /<script type="application\/json" id="polaris-i18n-state">([\s\S]*?)<\/script>/.exec(
    html,
  )
  return m ? (JSON.parse(m[1]) as I18nState) : null
}
const count = (html: string, re: RegExp) => (html.match(re) || []).length

/** Init-Skript: Hydrationszeitpunkt + Erkennung, ob der Root-Suspense-Fallback je sichtbar wurde. */
const OBSERVER = () => {
  const w = window as unknown as Record<string, unknown>
  const store = { hydratedAt: null as number | null, rootFallbackSeen: false }
  w.__pt252 = store
  const check = () => {
    const root = document.getElementById('root')
    if (root) {
      const only = root.children.length === 1 ? root.firstElementChild : null
      if (only && only.className === 'min-h-screen bg-slate-50' && only.childElementCount === 0)
        store.rootFallbackSeen = true
      const footer = document.querySelector('footer')
      if (
        store.hydratedAt === null &&
        footer &&
        Object.keys(footer).some((k) => k.startsWith('__reactProps'))
      )
        store.hydratedAt = performance.now()
    }
  }
  new MutationObserver(check).observe(document, { childList: true, subtree: true })
  const poll = () => {
    check()
    if (store.hydratedAt === null) requestAnimationFrame(poll)
  }
  requestAnimationFrame(poll)
}

async function trackRequests(page: Page) {
  const requests: { url: string; t: number }[] = []
  const t0 = Date.now()
  page.on('request', (r: Request) => requests.push({ url: r.url(), t: Date.now() - t0 }))
  return requests
}

async function waitHydrated(page: Page) {
  await page.waitForFunction(
    () =>
      (window as unknown as { __pt252: { hydratedAt: number | null } }).__pt252.hydratedAt !== null,
    undefined,
    { timeout: 30_000 },
  )
}

test.describe.serial('PT25.2', () => {
  test('1 Kaltstart: lazy Consumer-Seiten und Befundseiten liefern beim ersten Request den echten Kopf', async ({
    request,
  }) => {
    const cold = [
      ['/de/consumer/vitamin-d3-spray', /Vitamin D3/i],
      ['/pl/consumer/hydrating-masks', /./],
      ['/cs/consumer/inside-out-duo', /./],
      ['/de/epigenetics/musterbefund/telomer-analyse', /Telomer/i],
      ['/cs/epigenetics/musterbefund/healthy-sport', /./],
    ] as const
    for (const [path, h1] of cold) {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status(), path).toBe(200)
      const html = await res.text()
      const title = /<title[^>]*>([^<]*)<\/title>/.exec(html)?.[1] ?? ''
      expect(count(html, /<title[\s>]/g), `${path}: genau ein <title>`).toBe(1)
      expect(title.trim(), `${path}: Titel leer`).not.toBe('')
      expect(title, `${path}: statischer IglooPro-Titel statt Seitentitel`).not.toBe(STATIC_TITLE)
      expect(count(html, /<link[^>]*rel="canonical"/g), `${path}: genau ein Canonical`).toBe(1)
      expect(html, `${path}: og:title fehlt`).toMatch(/property="og:title"/)
      const h1Text = /<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1]?.replace(/<[^>]+>/g, '') ?? ''
      expect(h1Text, `${path}: h1 fehlt im SSR-HTML`).toMatch(h1)
    }
  })

  test('2 SSR-Routen-Smoke: Status, SSR-Inhalt, i18n-Zustand im Kopf, keine Namespace-Preloads', async ({
    request,
  }) => {
    for (const route of ROUTES as Route[]) {
      const res = await request.get(route.path, { maxRedirects: 0 })
      expect(res.status(), route.path).toBe(route.expect)
      const html = await res.text()
      expect(html, `${route.path}: SSR-Root leer`).toMatch(
        /<div id="root">(?:<!--\$-->)*\s*<[a-z]/i,
      )
      expect(count(html, /<title[\s>]/g), `${route.path}: <title>-Anzahl`).toBe(1)
      const lang = route.path.split('/')[1]
      const state = readState(html)
      expect(state, `${route.path}: i18n-Zustandsblock fehlt`).not.toBeNull()
      expect(state!.lng).toBe(lang)
      expect(state!.ns).toEqual(expect.arrayContaining(['home', 'common']))
      for (const ns of state!.ns)
        expect(NAMESPACES, `${route.path}: unbekannter NS ${ns}`).toContain(ns)
      expect(state!.ns.length, `${route.path}: Namespaces doppelt`).toBe(new Set(state!.ns).size)
      if (lang === 'en') expect(state!.fallback).toBeNull()
      else {
        expect(Object.keys(state!.fallback!).sort()).toEqual([...NAMESPACES].sort())
        // Paritaet ist gemessen (0 fehlende Schluessel) — jede Abweichung muss hier auffallen.
        for (const ns of NAMESPACES)
          expect(state!.fallback![ns], `${route.path}: Fallback-Delta ${ns}`).toEqual({})
      }
      // PT25.2-Entscheidung: keine Namespace-Preloads (FCP/CLS gemessen, siehe Vertrag §26).
      expect(html, `${route.path}: unerwarteter Namespace-Preload`).not.toMatch(
        /rel="preload" as="fetch"[^>]*\/locales\//,
      )
      expect(
        html.indexOf('id="polaris-i18n-state"'),
        `${route.path}: Zustand nicht im Kopf`,
      ).toBeLessThan(html.indexOf('</head>'))
      if (route.expect === 404) expect(html).toMatch(/name="robots"[^>]*noindex/)
    }
  })

  test('3 404- und Redirect-Sanity', async ({ request }) => {
    const root = await request.get('/', { maxRedirects: 0 })
    expect(root.status()).toBe(301)
    expect(root.headers()['location']).toBe('/de/')
    const unprefixed = await request.get('/diagnostics', { maxRedirects: 0 })
    expect(unprefixed.status()).toBe(301)
    expect(unprefixed.headers()['location']).toBe('/de/diagnostics')
    const legacy = await request.get('/de/agb', { maxRedirects: 0 })
    expect([301, 308]).toContain(legacy.status())
    expect(legacy.headers()['location']).toMatch(/\/de\/terms$/)
    for (const path of [
      '/de/gibt-es-nicht-pt252',
      '/pl/epigenetics/musterbefund/gibt-es-nicht',
      '/de/articles/gibt-es-nicht',
    ]) {
      const res = await request.get(path, { maxRedirects: 0 })
      expect(res.status(), path).toBe(404)
    }
  })

  const HYDRATION_ROUTES = [
    '/de/',
    '/en/',
    '/de/epigenetics',
    '/de/epigenetics/musterbefund/metabolic-health',
    '/pl/epigenetics/musterbefund/metabolic-health',
    '/cs/epigenetics/musterbefund/stress-monitor',
    '/de/consumer/vitamin-d3-spray',
    '/de/contact',
    '/de/gibt-es-nicht-pt252',
  ]

  test('4 Hydration-Smoke: keine Fehler, kein Root-Fallback, SSR-Text bleibt, keine Fallback-Sprache, keine Doppel-Requests', async ({
    browser,
  }) => {
    for (const path of HYDRATION_ROUTES) {
      const context = await browser.newContext({
        viewport: { width: 412, height: 823 },
        isMobile: true,
        hasTouch: true,
      })
      await context.addInitScript(OBSERVER)
      const page = await context.newPage()
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text())
      })
      page.on('pageerror', (e) => errors.push(e.message))
      const requests = await trackRequests(page)
      const response = await page.goto(path)
      const html = (await response!.text()) ?? ''
      expect(readState(html), `${path}: i18n-Zustandsblock fehlt`).not.toBeNull()
      const ssrH1 =
        /<h1[^>]*>([\s\S]*?)<\/h1>/
          .exec(html)?.[1]
          ?.replace(/<[^>]+>/g, '')
          .trim() ?? ''
      await waitHydrated(page)
      await page.waitForLoadState('load')
      await page.waitForTimeout(1500)

      expect(
        errors.filter((e) => /hydrat|#418|#423|#425|did not match/i.test(e)),
        `${path}: Hydration-Fehler`,
      ).toEqual([])
      expect(
        errors.filter((e) => !/Failed to load resource.*404/.test(e)),
        `${path}: Konsolenfehler`,
      ).toEqual([])
      const store = await page.evaluate(
        () => (window as unknown as { __pt252: { rootFallbackSeen: boolean } }).__pt252,
      )
      expect(store.rootFallbackSeen, `${path}: Root-Suspense-Fallback wurde sichtbar`).toBe(false)
      if (ssrH1)
        await expect(
          page.locator('h1').first(),
          `${path}: h1 nach Hydration anders als im SSR-HTML`,
        ).toHaveText(ssrH1)

      const lang = path.split('/')[1]
      const locale = requests.filter((r) => r.url.includes('/locales/'))
      const byUrl = new Map<string, number>()
      for (const r of locale) byUrl.set(r.url, (byUrl.get(r.url) ?? 0) + 1)
      for (const [url, n] of byUrl) expect(n, `${path}: ${url} doppelt angefragt `).toBe(1)
      if (lang !== 'en')
        expect(
          locale.filter((r) => r.url.includes('/locales/en/')),
          `${path}: Fallback-Sprache geladen`,
        ).toEqual([])
      // Nach Leerlauf: alle 15 Namespaces der Sprache genau einmal, sonst nichts.
      await expect
        .poll(() => new Set(locale.map((r) => r.url)).size, { timeout: 15_000 })
        .toBe(NAMESPACES.length)
      expect([...byUrl.keys()].every((u) => u.includes(`/locales/${lang}/`))).toBe(true)
      await context.close()
    }
  })

  test('4b Vor der Hydration werden nur die SSR-Namespaces geladen', async ({ browser }) => {
    // Seitenuhr statt Node-Uhr: Resource Timing (`startTime`) und der Hydrationszeitpunkt
    // stammen beide aus `performance.now()` der Seite. Eine Flagge auf Node-Seite zaehlte die
    // Leerlauf-Nachladungen mit, die Millisekunden nach `load` starten (Round-Trip-Verzug).
    for (const [path, profile] of [
      ['/de/', 'desktop'],
      ['/de/epigenetics/musterbefund/metabolic-health', 'desktop'],
      ['/pl/', 'desktop'],
      ['/pl/', 'mobile'],
    ] as const) {
      const context =
        profile === 'mobile'
          ? await browser.newContext({
              viewport: { width: 412, height: 823 },
              isMobile: true,
              hasTouch: true,
            })
          : await browser.newContext()
      await context.addInitScript(OBSERVER)
      const page = await context.newPage()
      const res = await page.goto(path)
      const state = readState(await res!.text())!
      await waitHydrated(page)
      await page.waitForLoadState('load')
      await page.waitForTimeout(3000)
      const { beforeHydration, afterHydration } = await page.evaluate(() => {
        const hydratedAt = (window as unknown as { __pt252: { hydratedAt: number } }).__pt252
          .hydratedAt
        const locale = (
          performance.getEntriesByType('resource') as PerformanceResourceTiming[]
        ).filter((e) => e.name.includes('/locales/'))
        return {
          beforeHydration: locale
            .filter((e) => e.startTime < hydratedAt)
            .map((e) => new URL(e.name).pathname),
          afterHydration: locale
            .filter((e) => e.startTime >= hydratedAt)
            .map((e) => new URL(e.name).pathname),
        }
      })
      const expected = state.ns.map((ns) => `/locales/${state.lng}/${ns}.json`).sort()
      expect(
        beforeHydration.sort(),
        `${path} ${profile}: Locale-Requests vor der Hydration`,
      ).toEqual(expected)
      // Danach genau die restlichen Namespaces der Sprache, keine Fallback-Sprache.
      expect(
        new Set([...beforeHydration, ...afterHydration]).size,
        `${path} ${profile}: Namespaces gesamt`,
      ).toBe(NAMESPACES.length)
      expect(afterHydration.every((u) => u.startsWith(`/locales/${state.lng}/`))).toBe(true)
      await context.close()
    }
  })

  test('5 Kern-Interaktionen direkt nach der Hydration', async ({ browser }) => {
    // Desktop: Suche, Sprachumschalter, clientseitige Navigation vor dem Leerlauf-Nachladen.
    const desktop = await browser.newContext({ viewport: { width: 1350, height: 940 } })
    await desktop.addInitScript(OBSERVER)
    let page = await desktop.newPage()
    await page.goto('/de/')
    await waitHydrated(page)
    await page
      .getByRole('button', { name: /Suche öffnen/i })
      .first()
      .click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await page.locator('#search-input').fill('vitamin')
    await expect(dialog.getByRole('status')).toHaveText(/\d/)
    await expect(page.locator('[data-search-results] a').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)

    // Clientseitige Navigation auf eine Seite mit Namespaces, die das SSR-HTML der Startseite nicht hatte.
    await page.locator('a[href="/de/epigenetics"]').first().click()
    await expect(page).toHaveURL(/\/de\/epigenetics$/)
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.locator('h1').first()).not.toHaveText(/^[a-z_]+\.[a-z_.]+$/)
    await page.locator('a[href^="/de/epigenetics/musterbefund/"]').first().click()
    await expect(page).toHaveURL(/\/de\/epigenetics\/musterbefund\//)
    await expect(page.locator('h1').first()).toBeVisible()
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { __pt252: { rootFallbackSeen: boolean } }).__pt252
            .rootFallbackSeen,
      ),
    ).toBe(false)

    const lang = page.getByRole('button', { name: /Sprache wählen/i }).first()
    await lang.click()
    await expect(lang).toHaveAttribute('aria-expanded', 'true')
    await page
      .getByRole('button', { name: /Polski/i })
      .first()
      .click()
    await expect(page).toHaveURL(/\/pl\//)
    await desktop.close()

    // Mobil: Menue auf und zu, Fokus zurueck.
    const mobile = await browser.newContext({
      viewport: { width: 412, height: 823 },
      isMobile: true,
      hasTouch: true,
    })
    await mobile.addInitScript(OBSERVER)
    page = await mobile.newPage()
    await page.goto('/de/')
    await waitHydrated(page)
    const burger = page.getByRole('button', { name: /Navigation umschalten/i })
    await burger.click()
    await expect(burger).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(burger).toHaveAttribute('aria-expanded', 'false')
    await expect(burger).toBeFocused()

    // Consumer: Bestell-Modal (Seite ist jetzt lazy).
    await page.goto('/de/consumer/vitamin-d3-spray')
    await waitHydrated(page)
    const cta = page.getByRole('button', { name: /Bestellen/i }).first()
    await cta.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await mobile.close()
  })

  test('6 AP23: ohne Consent 0 Provider-Requests (Routen + Interaktionen)', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    const provider: string[] = []
    page.on('request', (r) => {
      if (PROVIDER.test(r.url())) provider.push(r.url())
    })
    for (const path of [
      '/de/',
      '/de/consumer/vitamin-d3-spray',
      '/de/consumer/inside-out-duo',
      '/de/epigenetics/musterbefund/metabolic-health',
      '/pl/epigenetics/musterbefund/metabolic-health',
      '/de/contact',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('load')
      await page.waitForTimeout(2500)
    }
    await expect(page.getByRole('button', { name: /Einstellungen/i }).first()).toBeVisible()
    expect(provider).toEqual([])
    await context.close()
  })

  test('7 AP24: axe serious/critical = 0 und sichtbarer Tastaturfokus auf beruehrten Seiten', async ({
    browser,
  }) => {
    // AP26 PT26.2: die durchgesetzte CSP blockt Inline-Skripte — auch das per `addScriptTag`
    // eingespritzte axe. Nur dieser Audit-Kontext umgeht die CSP; das Messwerkzeug ist nicht Teil
    // der Seite. Die CSP selbst misst `e2e/pt26.2.spec.ts`.
    const context = await browser.newContext({ bypassCSP: true })
    const page = await context.newPage()
    for (const path of [
      '/de/',
      '/de/consumer/vitamin-d3-spray',
      '/de/consumer/inside-out-duo',
      '/de/epigenetics/musterbefund/metabolic-health',
      '/pl/epigenetics/musterbefund/metabolic-health',
    ]) {
      await page.goto(path)
      await page.waitForLoadState('load')
      await page.waitForTimeout(800)
      await page.addScriptTag({ content: AXE_SOURCE })
      const violations = await page.evaluate(async () => {
        const w = window as unknown as {
          axe: {
            run: (
              d: Document,
              o: unknown,
            ) => Promise<{ violations: { id: string; impact: string }[] }>
          }
        }
        const r = await w.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
          },
        })
        return r.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => v.id)
      })
      expect(violations, `${path}: axe serious/critical`).toEqual([])
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null
        if (!el || el === document.body) return null
        const cs = getComputedStyle(el)
        return {
          tag: el.tagName,
          visible:
            cs.outlineStyle !== 'none' ||
            cs.boxShadow !== 'none' ||
            el.classList.contains('focus:not-sr-only'),
        }
      })
      expect(focus, `${path}: erster Tab trifft kein Element`).not.toBeNull()
      expect(focus!.visible, `${path}: erster Tabstopp ohne sichtbaren Fokus`).toBe(true)
    }
    await context.close()
  })
})
