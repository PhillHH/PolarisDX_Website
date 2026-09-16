import { test, expect, type Browser, type Page } from '@playwright/test'
import { mkdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import sharp from 'sharp'

/**
 * PT25.3 — Bilder und LCP-Medien. Vergleicht den PT25.2-Stand (vorher, :3992) mit PT25.3
 * (nachher, :3993). Die Asset-Groessen- und Dimensions-Guards laufen separat ueber
 * `npm run check:article-images`.
 */

const BEFORE = 'http://127.0.0.1:3992'
const AFTER = 'http://127.0.0.1:3993'
const VIEWPORTS = [
  { name: '390', width: 390, height: 844, dpr: 3, mobile: true },
  { name: '768', width: 768, height: 1024, dpr: 2, mobile: true },
  { name: '1440', width: 1440, height: 900, dpr: 1, mobile: false },
] as const
/** Beruehrte Seiten (Artikelbilder, Produktbild) plus die Startseite mit BlogCard. */
const TOUCHED = [
  '/de/articles',
  '/de/articles/die-gruene-praxis',
  '/de/vitamin-d3-spray',
  '/de/',
  '/de/diagnostics',
] as const
const require_ = createRequire(import.meta.url)
const AXE_SOURCE = readFileSync(require_.resolve('axe-core/axe.min.js'), 'utf8')
const SHOTS = 'test-results/pt25.3-visual'
mkdirSync(SHOTS, { recursive: true })

const LCP_OBSERVER = () => {
  const s = {
    lcpSrc: null as string | null,
    lcpTag: null as string | null,
    shifts: [] as { v: number; img: boolean }[],
  }
  ;(window as unknown as { __pt253: typeof s }).__pt253 = s
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      const el = (e as PerformanceEntry & { element: Element | null }).element
      s.lcpTag = el ? el.tagName.toLowerCase() : null
      s.lcpSrc = el && el.tagName === 'IMG' ? (el as HTMLImageElement).currentSrc : null
    }),
  ).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => {
      const x = e as PerformanceEntry & {
        value: number
        hadRecentInput: boolean
        sources: { node: Element | null }[]
      }
      if (x.hadRecentInput) return
      s.shifts.push({
        v: x.value,
        img: x.sources.some(
          (src) =>
            !!src.node &&
            (src.node.tagName === 'IMG' ||
              src.node.tagName === 'PICTURE' ||
              !!src.node.querySelector?.('img')),
        ),
      })
    }),
  ).observe({ type: 'layout-shift', buffered: true })
}

async function open(
  browser: Browser,
  origin: string,
  path: string,
  vp: (typeof VIEWPORTS)[number],
) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.dpr,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
  })
  await context.addInitScript(LCP_OBSERVER)
  const page = await context.newPage()
  const imageRequests: { url: string; t: number }[] = []
  const t0 = Date.now()
  page.on('request', (r) => {
    if (r.resourceType() === 'image') imageRequests.push({ url: r.url(), t: Date.now() - t0 })
  })
  await page.goto(origin + path, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  return { context, page, imageRequests }
}

async function scrollThrough(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += Math.round(window.innerHeight * 0.6)) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 120))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(800)
}

const contentImages = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('main img, article img, section img')]
      .filter(
        (img) =>
          !/polaris_white|Igloo-pro-frontal|Testimonials|%20Foto|befund-|landingpages-consumer/.test(
            (img as HTMLImageElement).src,
          ),
      )
      .map((node) => {
        const img = node as HTMLImageElement
        const r = img.getBoundingClientRect()
        const picture = img.parentElement?.tagName === 'PICTURE' ? img.parentElement : null
        return {
          src: img.src.replace(location.origin, ''),
          currentSrc: img.currentSrc.replace(location.origin, ''),
          alt: img.getAttribute('alt'),
          loading: img.getAttribute('loading'),
          fetchpriority: img.getAttribute('fetchpriority'),
          width: img.getAttribute('width'),
          height: img.getAttribute('height'),
          sources: picture
            ? [...picture.querySelectorAll('source')].map((s) => ({
                type: s.getAttribute('type'),
                srcset: s.getAttribute('srcset'),
                sizes: s.getAttribute('sizes'),
              }))
            : [],
          rendered: [r.width, r.height],
          top: r.top + window.scrollY,
          natural: img.naturalWidth,
          complete: img.complete && img.naturalWidth > 0,
          dpr: window.devicePixelRatio,
          vh: window.innerHeight,
        }
      }),
  )

test.describe.serial('PT25.3', () => {
  test('1 DOM: AVIF/WebP-Quellen, srcset, sizes, width/height, alt auf allen beruehrten Seiten', async ({
    browser,
  }) => {
    for (const path of TOUCHED) {
      const { context, page } = await open(browser, AFTER, path, VIEWPORTS[2])
      await scrollThrough(page)
      const images = await contentImages(page)
      if (path !== '/de/')
        expect(images.length, `${path}: keine Inhaltsbilder gefunden`).toBeGreaterThan(0)
      for (const img of images) {
        const label = `${path} ${img.src}`
        expect(
          img.sources.map((s) => s.type),
          `${label}: Quellen`,
        ).toEqual(['image/avif', 'image/webp'])
        for (const source of img.sources) {
          expect(
            (source.srcset ?? '').split(',').length,
            `${label}: ${source.type} hat < 2 Kandidaten`,
          ).toBeGreaterThanOrEqual(2)
          expect(source.sizes, `${label}: sizes fehlt`).toBeTruthy()
        }
        expect(
          Number(img.width) > 0 && Number(img.height) > 0,
          `${label}: width/height fehlt`,
        ).toBe(true)
        expect(img.alt, `${label}: alt-Attribut fehlt`).not.toBeNull()
      }
      await context.close()
    }
  })

  test('2 LCP: Artikelbild ist LCP, nicht lazy, mit Vorrang, AVIF, frueh und genau einmal geladen', async ({
    browser,
  }) => {
    const cases = [
      { path: '/de/articles/die-gruene-praxis', viewports: ['390', '768', '1440'] },
      { path: '/de/articles', viewports: ['768', '1440'] },
    ]
    for (const c of cases) {
      for (const vp of VIEWPORTS.filter((v) => c.viewports.includes(v.name))) {
        const { context, page, imageRequests } = await open(browser, AFTER, c.path, vp)
        const lcp = await page.evaluate(
          () =>
            (window as unknown as { __pt253: { lcpSrc: string | null; lcpTag: string | null } })
              .__pt253,
        )
        const label = `${c.path} @${vp.name}`
        expect(lcp.lcpTag, `${label}: LCP ist kein Bild`).toBe('img')
        expect(lcp.lcpSrc, `${label}: LCP nicht AVIF`).toMatch(/green-\d+w-[\w-]+\.avif$/)
        const attrs = await page.evaluate((src) => {
          const img = [...document.images].find((i) => i.currentSrc === src)!
          return {
            loading: img.getAttribute('loading'),
            fetchpriority: img.getAttribute('fetchpriority'),
          }
        }, lcp.lcpSrc)
        expect(attrs.loading, `${label}: LCP-Bild lazy`).toBe('eager')
        expect(attrs.fetchpriority, `${label}: LCP-Bild ohne Vorrang`).toBe('high')
        const green = imageRequests.filter((r) => /\/green[-.]/.test(r.url))
        expect(
          green.map((r) => r.url.replace(/^https?:\/\/[^/]+/, '')),
          `${label}: LCP-Bild mehrfach/in mehreren Formaten geladen`,
        ).toHaveLength(1)
        const firstOther = imageRequests.find((r) => !/polaris_white|\/green[-.]/.test(r.url))
        if (firstOther)
          expect(
            green[0].t,
            `${label}: LCP-Bild startet nach ${firstOther.url}`,
          ).toBeLessThanOrEqual(firstOther.t)
        // Nur ein Bild der Seite hat fetchpriority=high.
        expect(
          await page.locator('img[fetchpriority="high"]').count(),
          `${label}: mehr als ein Bild mit Vorrang`,
        ).toBe(1)
        await context.close()
      }
    }
  })

  /**
   * Ausnahmen mit Messbeleg (PT25.3): der Diagnostics-Hero ist ab 768 px das LCP-Element und liegt
   * bei 390 px 117 px unter dem Falz. Verschraenkt gemessen (gzip, je 9 Laeufe) aendert
   * `fetchpriority` dort nichts (mobil FCP/LCP 1.092 vs. 1.104 ms, desktop LCP 144 vs. 140 ms);
   * `loading="eager"` bleibt fuer das Desktop-LCP noetig. Ebenso die erste Artikelkarte (s. u.).
   * Keine Distanz-Toleranz.
   */
  test('3 Kein eager Bild unterhalb des Falzes (Ausnahmen: bereits geladene URL, gemessene LCP-Kandidaten groesserer Viewports)', async ({
    browser,
  }) => {
    const LCP_AT_LARGER_VIEWPORT: Record<string, RegExp> = {
      '/de/diagnostics': /Igloo-pro-frontal/,
      // Erste Artikelkarte: LCP bei 768 und 1440 px, bei 390 px 29 px unter dem Falz; mobil
      // gedrosselt FCP/LCP 1.044 → 1.088 ms (Rauschbereich, LCP dort Text), Bildbytes 194 → 151 KB.
      '/de/articles': /\/green-\d+w-/,
    }
    for (const vp of VIEWPORTS) {
      for (const path of TOUCHED) {
        const { context, page } = await open(browser, AFTER, path, vp)
        const all = await page.evaluate(() =>
          [...document.images].map((img) => {
            const r = img.getBoundingClientRect()
            return {
              url: img.currentSrc || img.src,
              loading: img.getAttribute('loading'),
              top: r.top,
              bottom: r.bottom,
              visible: r.width > 0,
              vh: window.innerHeight,
            }
          }),
        )
        const aboveUrls = new Set(all.filter((i) => i.visible && i.top < i.vh).map((i) => i.url))
        const offenders = all.filter(
          (i) =>
            i.visible &&
            i.top >= i.vh &&
            i.loading !== 'lazy' &&
            !aboveUrls.has(i.url) &&
            !(vp.name === '390' && LCP_AT_LARGER_VIEWPORT[path]?.test(i.url)),
        )
        expect(
          offenders.map((o) => `${o.url.split('/').pop()} top=${Math.round(o.top)}`),
          `${path} @${vp.name}: eager unterhalb des Falzes`,
        ).toEqual([])
        await context.close()
      }
    }
  })

  test('4 Responsive: gewaehlte Kandidaten passen zur Darstellung (390 / 768 / 1440)', async ({
    browser,
  }) => {
    for (const vp of VIEWPORTS) {
      for (const path of TOUCHED) {
        const { context, page } = await open(browser, AFTER, path, vp)
        await scrollThrough(page)
        const images = (await contentImages(page)).filter((i) => i.complete && i.rendered[0] > 0)
        for (const img of images) {
          const needed = img.rendered[0] * img.dpr
          const chosenWidth = Number(/-(\d+)w-/.exec(img.currentSrc)?.[1] ?? img.natural)
          const label = `${path} @${vp.name} ${img.currentSrc.split('/').pop()} (css ${Math.round(img.rendered[0])} × DPR ${img.dpr})`
          expect(/\.(avif|webp)$/.test(img.currentSrc), `${label}: kein responsiver Kandidat`).toBe(
            true,
          )
          // Nicht mehr als ~2 × des Bedarfs (naechstgroessere Stufe), ausser es gibt keine kleinere.
          expect(
            chosenWidth <= Math.max(needed * 2.1, 400),
            `${label}: ueberdimensioniert (${chosenWidth}w)`,
          ).toBe(true)
        }
        await context.close()
      }
    }
  })

  test('5 CLS: keine bildbedingten Shifts, kalt und nach Scrollen (390 / 768 / 1440)', async ({
    browser,
  }) => {
    for (const vp of VIEWPORTS) {
      for (const path of TOUCHED) {
        const { context, page } = await open(browser, AFTER, path, vp)
        await scrollThrough(page)
        const shifts = await page.evaluate(
          () =>
            (window as unknown as { __pt253: { shifts: { v: number; img: boolean }[] } }).__pt253
              .shifts,
        )
        const imageCls = shifts.filter((s) => s.img).reduce((n, s) => n + s.v, 0)
        expect(imageCls, `${path} @${vp.name}: bildbedingter CLS`).toBeLessThan(0.001)
        await context.close()
      }
    }
  })

  test('6 Visuell: jedes geaenderte Bild vorher/nachher gleich (PSNR >= 30 dB), Screenshots abgelegt', async ({
    browser,
  }) => {
    const shots: string[] = []
    for (const vp of [VIEWPORTS[0], VIEWPORTS[2]]) {
      for (const path of [
        '/de/articles',
        '/de/articles/die-gruene-praxis',
        '/de/vitamin-d3-spray',
      ] as const) {
        const grabs: Buffer[][] = []
        for (const origin of [BEFORE, AFTER]) {
          const { context, page } = await open(browser, origin, path, vp)
          await scrollThrough(page)
          const locator = page
            .locator('main img')
            .filter({ hasNot: page.locator('[src*="polaris_white"]') })
          const count = Math.min(await locator.count(), 3)
          const list: Buffer[] = []
          for (let i = 0; i < count; i++) {
            const el = locator.nth(i)
            await el.scrollIntoViewIfNeeded()
            await page.waitForFunction(
              (node) => (node as HTMLImageElement).complete,
              await el.elementHandle(),
              { timeout: 10_000 },
            )
            list.push(await el.screenshot({ animations: 'disabled' }))
          }
          grabs.push(list)
          await context.close()
        }
        expect(grabs[1].length, `${path} @${vp.name}: Bildanzahl vorher/nachher`).toBe(
          grabs[0].length,
        )
        for (let i = 0; i < grabs[0].length; i++) {
          // Auf den gemeinsamen Ausschnitt oben links zuschneiden statt skalieren: die responsive
          // Variante kann durch Rundung des natuerlichen Seitenverhaeltnisses 1 px niedriger sein
          // (800 × 533 statt 1200 × 800) — Skalieren wuerde jede Zeile subpixelweise verschieben.
          const [ma, mb] = await Promise.all([
            sharp(grabs[0][i]).metadata(),
            sharp(grabs[1][i]).metadata(),
          ])
          const w = Math.min(ma.width!, mb.width!)
          const h = Math.min(ma.height!, mb.height!)
          expect(
            Math.abs(ma.height! - mb.height!) <= 1 && Math.abs(ma.width! - mb.width!) <= 1,
            `${path} @${vp.name} Bild ${i}: Groesse ${ma.width}x${ma.height} → ${mb.width}x${mb.height}`,
          ).toBe(true)
          const a = await sharp(grabs[0][i])
            .extract({ left: 0, top: 0, width: w, height: h })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
          const b = await sharp(grabs[1][i])
            .extract({ left: 0, top: 0, width: w, height: h })
            .removeAlpha()
            .raw()
            .toBuffer({ resolveWithObject: true })
          let mse = 0
          for (let p = 0; p < a.data.length; p++) mse += (a.data[p] - b.data[p]) ** 2
          mse /= a.data.length
          const psnr = mse === 0 ? 99 : 10 * Math.log10((255 * 255) / mse)
          const name = `${SHOTS}/${path.replace(/\W+/g, '_')}-${vp.name}-${i}`
          await sharp(grabs[0][i]).toFile(`${name}-vorher.png`)
          await sharp(grabs[1][i]).toFile(`${name}-nachher.png`)
          shots.push(`${name} ${psnr.toFixed(1)} dB`)
          expect(
            psnr,
            `${path} @${vp.name} Bild ${i}: PSNR ${psnr.toFixed(1)} dB`,
          ).toBeGreaterThanOrEqual(30)
        }
      }
    }
    console.log(shots.join('\n'))
  })

  test('7 SEO/OG: og:image, twitter:image und JSON-LD-Bild unveraendert, Ziel erreichbar', async ({
    request,
  }) => {
    const pick = (html: string) => ({
      og: [...html.matchAll(/<meta[^>]*property="og:image(?::width|:height|:alt)?"[^>]*>/g)]
        .map((m) => m[0])
        .sort(),
      twitter: [...html.matchAll(/<meta[^>]*name="twitter:image[^"]*"[^>]*>/g)]
        .map((m) => m[0])
        .sort(),
      jsonLdImages: [...html.matchAll(/"image":\s*("[^"]*"|\{[^}]*\})/g)].map((m) => m[1]).sort(),
    })
    for (const path of [
      ...TOUCHED,
      '/de/consumer/vitamin-d3-spray',
      '/de/epigenetics/musterbefund/metabolic-health',
    ]) {
      const before = pick(await (await request.get(BEFORE + path)).text())
      const after = pick(await (await request.get(AFTER + path)).text())
      expect(after, `${path}: OG/Social/Structured-Data-Bilder veraendert`).toEqual(before)
      for (const tag of after.og.filter((t) => /property="og:image"/.test(t))) {
        const url = /content="([^"]+)"/.exec(tag)![1]
        const res = await request.get(
          url.startsWith('http') ? AFTER + new URL(url).pathname : AFTER + url,
        )
        expect(res.status(), `${path}: og:image ${url} nicht erreichbar`).toBe(200)
      }
    }
  })

  test('8 AP24: axe serious/critical = 0 und alt-Texte vorher = nachher', async ({ browser }) => {
    for (const path of TOUCHED) {
      const alts: string[][] = []
      for (const origin of [BEFORE, AFTER]) {
        const { context, page } = await open(browser, origin, path, VIEWPORTS[2])
        alts.push(
          await page.evaluate(() => [...document.images].map((i) => `${i.getAttribute('alt')}`)),
        )
        if (origin === AFTER) {
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
        }
        await context.close()
      }
      expect(alts[1], `${path}: alt-Texte veraendert`).toEqual(alts[0])
    }
  })

  test('9 Bytes: Bildtransfer je Seite nach vollstaendigem Scrollen nachher <= vorher', async ({
    browser,
  }) => {
    const rows: string[] = []
    for (const vp of VIEWPORTS) {
      for (const path of TOUCHED) {
        const totals: number[] = []
        for (const origin of [BEFORE, AFTER]) {
          const { context, page } = await open(browser, origin, path, vp)
          await scrollThrough(page)
          totals.push(
            await page.evaluate(() =>
              (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
                .filter(
                  (e) => e.initiatorType === 'img' || /\.(avif|webp|jpe?g|png)(\?|$)/.test(e.name),
                )
                .reduce((n, e) => n + e.encodedBodySize, 0),
            ),
          )
          await context.close()
        }
        rows.push(
          `${vp.name} ${path} ${Math.round(totals[0] / 1024)} KB -> ${Math.round(totals[1] / 1024)} KB`,
        )
        expect(totals[1], `${path} @${vp.name}: Bildbytes gestiegen`).toBeLessThanOrEqual(totals[0])
      }
    }
    console.log(rows.join('\n'))
  })
})
