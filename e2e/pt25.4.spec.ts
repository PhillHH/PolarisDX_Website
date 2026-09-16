import { test, expect, type Browser, type Page } from '@playwright/test'
import { readFileSync, readdirSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import sharp from 'sharp'

/**
 * PT25.4 — Fonts und CSS. Vorher = PT25.3 (:3992), nachher = PT25.4 (:3993).
 */
const BEFORE = 'http://127.0.0.1:3992'
const AFTER = 'http://127.0.0.1:3993'
const AFTER_DIR = process.env.PT254_AFTER_DIR ?? 'node_modules/.cache/pt25.4'
const BEFORE_DIR = process.env.PT254_BEFORE_DIR ?? 'node_modules/.cache/pt25.3'
const VP = {
  mobile: { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
} as const
const ROUTES = [
  '/de/',
  '/de/contact',
  '/de/diagnostics',
  '/de/articles/die-gruene-praxis',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/pl/',
  '/cs/consumer/inside-out-duo',
] as const
const EXTERNAL_FONT =
  /fonts\.googleapis\.com|fonts\.gstatic\.com|use\.typekit|fonts\.bunny|fontawesome|cdn\.jsdelivr\.net\/npm\/@fontsource/i
const require_ = createRequire(import.meta.url)
const AXE_SOURCE = readFileSync(require_.resolve('axe-core/axe.min.js'), 'utf8')
const SHOTS = 'test-results/pt25.4-visual'
mkdirSync(SHOTS, { recursive: true })
const cssFile = (dir: string) =>
  `${dir}/client/assets/${readdirSync(`${dir}/client/assets`).find((f) => /^index-.*\.css$/.test(f))}`

async function context(browser: Browser, kind: keyof typeof VP) {
  const v = VP[kind]
  return browser.newContext({
    viewport: { width: v.width, height: v.height },
    deviceScaleFactor: v.deviceScaleFactor,
    isMobile: v.isMobile,
    hasTouch: v.hasTouch,
  })
}

const CLS_OBSERVER = () => {
  const s = { cls: 0 }
  ;(window as unknown as { __cls: typeof s }).__cls = s
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      const x = e as PerformanceEntry & { value: number; hadRecentInput: boolean }
      if (!x.hadRecentInput) s.cls += x.value
    }),
  ).observe({ type: 'layout-shift', buffered: true })
}

async function fontRequests(page: Page, url: string) {
  const requests: string[] = []
  page.on('request', (r) => {
    if (r.resourceType() === 'font' || /\.(woff2?|ttf|otf)(\?|$)/i.test(r.url()))
      requests.push(r.url())
  })
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(1500)
  return requests
}

test.describe.serial('PT25.4', () => {
  test('1 Font-Requests: nur eigene Inter-Subsets, keine Duplikate, keine externen Quellen, genau ein Preload', async ({
    browser,
  }) => {
    for (const kind of ['mobile', 'desktop'] as const) {
      for (const route of ROUTES) {
        const ctx = await context(browser, kind)
        const page = await ctx.newPage()
        const html = await (await page.request.get(AFTER + route)).text()
        const requests = await fontRequests(page, AFTER + route)
        const label = `${route} @${kind}`
        expect(
          requests.filter((u) => EXTERNAL_FONT.test(u)),
          `${label}: externe Fontquelle`,
        ).toEqual([])
        expect(
          requests.every((u) =>
            /^http:\/\/127\.0\.0\.1:3993\/assets\/inter-[\w-]+-wght-normal-[\w-]+\.woff2$/.test(u),
          ),
          `${label}: fremde Fontdatei ${requests.join(', ')}`,
        ).toBe(true)
        expect(new Set(requests).size, `${label}: Font doppelt angefragt`).toBe(requests.length)
        const subsets = requests.map((u) => /inter-([\w-]+?)-wght/.exec(u)![1]).sort()
        const expected = [
          'latin',
          ...(/^\/(pl|cs)\//.test(route) ? ['latin-ext'] : []),
          ...(/metabolic-health/.test(route) ? ['greek'] : []),
        ].sort()
        expect(subsets, `${label}: Subsets`).toEqual(expected)
        const preloads = [
          ...html.matchAll(/<link rel="preload" as="font"[^>]*href="([^"]+)"/g),
        ].map((m) => m[1])
        expect(preloads, `${label}: Font-Preloads`).toHaveLength(1)
        expect(preloads[0]).toMatch(/inter-latin-wght-normal/)
        expect(
          requests.some((u) => u.endsWith(preloads[0])),
          `${label}: Preload nicht genutzt`,
        ).toBe(true)
        expect(EXTERNAL_FONT.test(html), `${label}: externe Fontquelle im HTML`).toBe(false)
        await ctx.close()
      }
    }
  })

  test('2 Fallback-Schrift: zwei gemessene Faces aktiv, Werte wie dokumentiert', async ({
    browser,
  }) => {
    const ctx = await context(browser, 'desktop')
    const page = await ctx.newPage()
    await page.goto(AFTER + '/de/', { waitUntil: 'load' })
    await page.evaluate(() =>
      document.fonts
        .load('400 16px "Inter Fallback"')
        .then(() => document.fonts.load('600 16px "Inter Fallback"')),
    )
    const faces = await page.evaluate(() =>
      [...document.fonts]
        .filter((f) => f.family.replace(/"/g, '') === 'Inter Fallback')
        .map((f) => ({ weight: f.weight, status: f.status })),
    )
    expect(faces.map((f) => f.weight).sort()).toEqual(['100 549', '550 900'])
    expect(
      faces.every((f) => f.status === 'loaded'),
      `Fallback-Faces nicht geladen: ${JSON.stringify(faces)}`,
    ).toBe(true)
    const css = readFileSync(cssFile(AFTER_DIR), 'utf8')
    expect(css).toMatch(
      /font-weight:100 549;size-adjust:107\.12%;ascent-override:90\.55%;descent-override:22\.4%/,
    )
    expect(css).toMatch(
      /font-weight:550 900;size-adjust:101\.36%;ascent-override:95\.7%;descent-override:23\.68%/,
    )
    expect(css.match(/font-display:swap/g)?.length, 'font-display:swap je Inter-Subset').toBe(7)
    await ctx.close()
  })

  test('3 CSS: inline im SSR-Kopf, bytegleich zur Build-Datei, kein CSS-Request; Groessen protokolliert', async ({
    browser,
    request,
  }) => {
    const afterCss = readFileSync(cssFile(AFTER_DIR), 'utf8')
    const beforeCss = readFileSync(cssFile(BEFORE_DIR), 'utf8')
    console.log(
      `CSS vorher ${beforeCss.length} B, nachher ${afterCss.length} B (Delta ${afterCss.length - beforeCss.length} B)`,
    )
    for (const route of ['/de/', '/pl/', '/de/gibt-es-nicht-pt254']) {
      const html = await (await request.get(AFTER + route)).text()
      const styles = [
        ...html.matchAll(/<style data-inline-stylesheet="[^"]+">([\s\S]*?)<\/style>/g),
      ]
      expect(styles, `${route}: genau ein inline Stylesheet`).toHaveLength(1)
      expect(styles[0][1], `${route}: inline CSS weicht von der Build-Datei ab`).toBe(afterCss)
      expect(
        html.indexOf('<style data-inline-stylesheet'),
        `${route}: Stylesheet nicht im Kopf`,
      ).toBeLessThan(html.indexOf('</head>'))
      expect(html, `${route}: externer Stylesheet-Link`).not.toMatch(
        /<link rel="stylesheet"[^>]*\/assets\/index-/,
      )
      const beforeHtml = await (await request.get(BEFORE + route)).text()
      expect(beforeHtml).toMatch(/<link rel="stylesheet"[^>]*\/assets\/index-/)
    }
    // Desktop: der Link liegt im sichtbaren Hauptmenue (mobil steckt er im eingeklappten Menue).
    const ctx = await context(browser, 'desktop')
    const page = await ctx.newPage()
    const cssRequests: string[] = []
    page.on('request', (r) => {
      if (r.resourceType() === 'stylesheet' || /\.css(\?|$)/.test(r.url()))
        cssRequests.push(r.url())
    })
    await page.goto(AFTER + '/de/', { waitUntil: 'load' })
    await page.locator('a[href="/de/diagnostics"]').filter({ visible: true }).first().click()
    await page.waitForURL(/\/de\/diagnostics$/)
    await page.waitForTimeout(1000)
    expect(cssRequests, 'CSS-Datei wird trotz Inline noch angefragt').toEqual([])
    await ctx.close()
  })

  test('4 Erster Frame: CSS angewandt (kein FOUC), SSR-Inhalt sichtbar; nach Laden visuell gleich vorher/nachher', async ({
    browser,
  }) => {
    for (const kind of ['mobile', 'desktop'] as const) {
      for (const route of ['/de/', '/de/contact', '/pl/']) {
        const ctx = await context(browser, kind)
        await ctx.addInitScript(() => {
          const first = { done: false } as Record<string, unknown>
          ;(window as unknown as { __first: typeof first }).__first = first
          const tick = () => {
            const header = document.querySelector('header')
            const h1 = document.querySelector('h1')
            if (!header || !h1) return requestAnimationFrame(tick)
            first.headerPosition = getComputedStyle(header).position
            first.bodyMargin = getComputedStyle(document.body).margin
            first.h1Visible = h1.getBoundingClientRect().height > 0
            first.rootFilled = (document.getElementById('root')?.children.length ?? 0) > 0
            first.done = true
          }
          requestAnimationFrame(tick)
        })
        const page = await ctx.newPage()
        await page.goto(AFTER + route, { waitUntil: 'load' })
        const first = await page.evaluate(
          () => (window as unknown as { __first: Record<string, unknown> }).__first,
        )
        const label = `${route} @${kind}`
        expect(first.done, `${label}: erster Frame nicht erfasst`).toBe(true)
        expect(first.headerPosition, `${label}: Header ohne CSS im ersten Frame (FOUC)`).toBe(
          'fixed',
        )
        expect(first.bodyMargin, `${label}: Preflight fehlt im ersten Frame`).toBe('0px')
        expect(
          first.h1Visible && first.rootFilled,
          `${label}: SSR-Inhalt im ersten Frame nicht sichtbar`,
        ).toBe(true)
        await ctx.close()
      }
    }
    // Visueller Vergleich nach dem Laden (Schrift geladen): oberer Bildschirm vorher/nachher.
    const results: string[] = []
    for (const kind of ['mobile', 'desktop'] as const) {
      for (const route of ['/de/', '/de/contact', '/pl/']) {
        const shots: Buffer[] = []
        for (const origin of [BEFORE, AFTER]) {
          const ctx = await context(browser, kind)
          const page = await ctx.newPage()
          await page.emulateMedia({ reducedMotion: 'reduce' })
          await page.goto(origin + route, { waitUntil: 'load' })
          await page.evaluate(() => document.fonts.ready)
          await page.waitForTimeout(800)
          shots.push(await page.screenshot({ animations: 'disabled' }))
          await ctx.close()
        }
        const a = await sharp(shots[0]).removeAlpha().raw().toBuffer({ resolveWithObject: true })
        const b = await sharp(shots[1]).removeAlpha().raw().toBuffer({ resolveWithObject: true })
        expect([b.info.width, b.info.height]).toEqual([a.info.width, a.info.height])
        let mse = 0
        for (let i = 0; i < a.data.length; i++) mse += (a.data[i] - b.data[i]) ** 2
        mse /= a.data.length
        const psnr = mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse)
        const name = `${SHOTS}/${route.replace(/\W+/g, '_')}-${kind}`
        await sharp(shots[0]).toFile(`${name}-vorher.png`)
        await sharp(shots[1]).toFile(`${name}-nachher.png`)
        results.push(`${route} @${kind} ${psnr.toFixed(1)} dB`)
        expect(
          psnr,
          `${route} @${kind}: sichtbarer Unterschied nach dem Laden (${psnr.toFixed(1)} dB)`,
        ).toBeGreaterThanOrEqual(35)
      }
    }
    console.log(results.join('\n'))
  })

  test('5 Font-Swap-CLS mit 2 s verzoegerter Schrift: nachher deutlich kleiner, keine Route schlechter', async ({
    browser,
  }) => {
    // Je Route/Viewport/Stand 3 Laeufe, Bewertung ueber den Median: Einzellaeufe im Testkontext
    // schwankten nachweislich (siehe PERFORMANCE-CONTRACT §28.6); alle Einzelwerte werden protokolliert.
    const median = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)]
    const rows: string[] = []
    const failures: string[] = []
    let sumBefore = 0
    let sumAfter = 0
    for (const kind of ['mobile', 'desktop'] as const) {
      for (const route of ROUTES) {
        const runs: number[][] = [[], []]
        for (let rep = 0; rep < 3; rep++) {
          for (const [index, origin] of [BEFORE, AFTER].entries()) {
            const ctx = await context(browser, kind)
            await ctx.addInitScript(CLS_OBSERVER)
            const page = await ctx.newPage()
            await page.route('**/*.woff2', async (r) => {
              await new Promise((res) => setTimeout(res, 2000))
              await r.continue()
            })
            await page.goto(origin + route, { waitUntil: 'load' })
            await page.waitForTimeout(3500)
            runs[index].push(
              await page.evaluate(
                () => (window as unknown as { __cls: { cls: number } }).__cls.cls,
              ),
            )
            await ctx.close()
          }
        }
        const before = median(runs[0])
        const after = median(runs[1])
        sumBefore += before
        sumAfter += after
        rows.push(
          `${route} @${kind}: vorher ${runs[0].map((x) => x.toFixed(4)).join('/')} -> nachher ${runs[1].map((x) => x.toFixed(4)).join('/')} (Median ${before.toFixed(4)} -> ${after.toFixed(4)})`,
        )
        // Einheitlich fuer alle Routen: Messrauschen im Testkontext ist deterministisch (3 identische Laeufe),
        // 0,001 fangen nur Rundungsunterschiede ab. Keine Routen-Ausnahme mehr (PERFORMANCE-CONTRACT §28.2).
        const tolerance = 0.001
        if (after > before + tolerance)
          failures.push(
            `${route} @${kind}: Median nachher ${after.toFixed(4)} > vorher ${before.toFixed(4)}`,
          )
      }
    }
    console.log(
      rows.join('\n') + `\nSumme Mediane ${sumBefore.toFixed(4)} -> ${sumAfter.toFixed(4)}`,
    )
    expect(failures, failures.join('\n')).toEqual([])
    expect(sumAfter, 'Font-Swap-CLS gesamt nicht mindestens halbiert').toBeLessThan(sumBefore * 0.5)
  })

  test('6 Tastaturfokus sofort sichtbar (auch vor dem Laden der Schrift) und Reduced Motion wirksam', async ({
    browser,
  }) => {
    for (const kind of ['mobile', 'desktop'] as const) {
      for (const route of ['/de/', '/de/contact']) {
        const ctx = await context(browser, kind)
        const page = await ctx.newPage()
        await page.route('**/*.woff2', async (r) => {
          await new Promise((res) => setTimeout(res, 3000))
          await r.continue()
        })
        await page.goto(AFTER + route, { waitUntil: 'domcontentloaded' })
        await page.keyboard.press('Tab')
        const focus = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null
          if (!el || el === document.body) return null
          const cs = getComputedStyle(el)
          return {
            tag: el.tagName,
            outline: cs.outlineStyle,
            shadow: cs.boxShadow,
            notSrOnly: el.getBoundingClientRect().width > 1,
          }
        })
        const label = `${route} @${kind}`
        expect(focus, `${label}: erster Tab ohne Ziel`).not.toBeNull()
        expect(
          focus!.outline !== 'none' || focus!.shadow !== 'none',
          `${label}: Fokus nicht sichtbar ${JSON.stringify(focus)}`,
        ).toBe(true)
        expect(focus!.notSrOnly, `${label}: fokussierter Skiplink bleibt unsichtbar`).toBe(true)
        await ctx.close()
      }
    }
    const ctx = await context(browser, 'desktop')
    const page = await ctx.newPage()
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(AFTER + '/de/', { waitUntil: 'load' })
    const motion = await page.evaluate(() => {
      const el = document.querySelector('a, button, section') as HTMLElement
      const cs = getComputedStyle(el)
      return {
        matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
        animationDuration: cs.animationDuration,
        transitionDuration: cs.transitionDuration,
      }
    })
    expect(motion.matches).toBe(true)
    expect(
      parseFloat(motion.animationDuration),
      `Reduced Motion: animation-duration ${motion.animationDuration}`,
    ).toBeLessThanOrEqual(0.01)
    expect(
      parseFloat(motion.transitionDuration),
      `Reduced Motion: transition-duration ${motion.transitionDuration}`,
    ).toBeLessThanOrEqual(0.01)
    await ctx.close()
  })

  test('7 Render-Marke: Kopf-Link + Marke vorhanden; Wiederholungsaufruf ohne Hero-Shift', async ({
    browser,
    request,
  }) => {
    for (const route of ['/de/', '/de/epigenetics', '/de/gibt-es-nicht-pt254']) {
      const html = await (await request.get(AFTER + route)).text()
      expect(html, `${route}: rel=expect fehlt`).toMatch(
        /<link rel="expect" href="#polaris-render-ready" blocking="render"/,
      )
      expect(
        html.indexOf('id="polaris-render-ready"'),
        `${route}: Marke nicht hinter #root`,
      ).toBeGreaterThan(html.lastIndexOf('<div id="root">'))
    }
    const worst: string[] = []
    for (const route of ['/de/', '/de/epigenetics']) {
      for (let rep = 0; rep < 3; rep++) {
        const ctx = await browser.newContext({
          viewport: { width: 412, height: 823 },
          deviceScaleFactor: 1.75,
          isMobile: true,
          hasTouch: true,
        })
        await ctx.addInitScript(CLS_OBSERVER)
        const page = await ctx.newPage()
        const cdp = await ctx.newCDPSession(page)
        await cdp.send('Network.enable')
        await cdp.send('Network.emulateNetworkConditions', {
          offline: false,
          latency: 150,
          downloadThroughput: (1638.4 * 1024) / 8,
          uploadThroughput: (675 * 1024) / 8,
        })
        await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
        await page.goto(AFTER + route, { waitUntil: 'load' })
        await page.waitForTimeout(6000)
        await page.goto(AFTER + route, { waitUntil: 'load' })
        await page.waitForTimeout(2500)
        const cls = await page.evaluate(
          () => (window as unknown as { __cls: { cls: number } }).__cls.cls,
        )
        worst.push(`${route} #${rep + 1} ${cls.toFixed(4)}`)
        expect(cls, `${route} Wiederholungsaufruf #${rep + 1}: CLS ${cls.toFixed(4)}`).toBeLessThan(
          0.05,
        )
        await ctx.close()
      }
    }
    console.log(worst.join('\n'))
  })

  test('8 AP24 axe + SSR-Sanity auf beruehrten Seiten', async ({ browser, request }) => {
    const notFound = await request.get(AFTER + '/de/gibt-es-nicht-pt254', { maxRedirects: 0 })
    expect(notFound.status()).toBe(404)
    for (const route of ['/de/', '/de/contact', '/pl/']) {
      const html = await (await request.get(AFTER + route)).text()
      expect(html, `${route}: SSR-Root leer`).toMatch(/<div id="root">(?:<!--\$-->)*\s*<[a-z]/i)
      expect(html, `${route}: i18n-Zustand fehlt`).toMatch(/id="polaris-i18n-state"/)
      const ctx = await context(browser, 'desktop')
      const page = await ctx.newPage()
      const errors: string[] = []
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text())
      })
      await page.goto(AFTER + route, { waitUntil: 'load' })
      await page.waitForTimeout(1200)
      expect(
        errors.filter((e) => /hydrat|#418|#423|#425|did not match/i.test(e)),
        `${route}: Hydration-Fehler`,
      ).toEqual([])
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
      expect(violations, `${route}: axe serious/critical`).toEqual([])
      await ctx.close()
    }
  })
})
