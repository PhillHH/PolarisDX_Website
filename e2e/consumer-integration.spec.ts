import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { CONSUMER_PRODUCTS, type ConsumerProductKey } from '../src/content/consumer/products'

/**
 * AP21 PT21.7 — der breite Consumer-Integrationsgate (Fast-Delta V2 §10).
 *
 * PT21.2–PT21.4 haben je Produkt eine Handvoll Locales gemessen, PT21.6 die
 * SEO-Ebene aller 30 Routen. Hier wird die LAUFZEIT breit gemessen: alle 30
 * Seiten im echten Browser gegen einen vollen Produktionsbuild — Rendering,
 * Sprachwechsel, Barrierefreiheit, Umbruchverhalten und Ladeverhalten.
 *
 * Kein Stichprobenschluss: wo "30/30" steht, wurden 30 Seiten angefasst.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const PRODUCTS: ConsumerProductKey[] = ['spray', 'masks', 'duo']
const ROUTES = PRODUCTS.flatMap((product) =>
  SUPPORTED_LANGUAGES.map((locale) => ({
    product,
    locale,
    slug: CONSUMER_PRODUCTS[product].slug,
    path: `/${locale}/consumer/${CONSUMER_PRODUCTS[product].slug}`,
  })),
)

/** Die Beschriftungen der Sprachliste — jeweils in der Sprache selbst. */
const LANGUAGE_NAMES: Record<string, string> = {
  de: 'Deutsch',
  en: 'English',
  pl: 'Polski',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  da: 'Dansk',
  nl: 'Nederlands',
  cs: 'Čeština',
}

/** Die laengsten Locales — hier bricht Layout zuerst. */
const LONG_LOCALES = ['de', 'pl', 'cs', 'nl']
const VIEWPORTS = [
  { name: 'mobil', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const bundle = (locale: string): Record<string, string> =>
  JSON.parse(readFileSync(`public/locales/${locale}/consumer.json`, 'utf8')) as Record<
    string,
    string
  >

/**
 * Bringt die Seite in ihren ENDZUSTAND, bevor gemessen wird.
 *
 * Die frueher hier benutzte Warteschleife ("jede Opazitaet ist 0 oder 1")
 * war fehlerhaft: 0 ist genau der Zustand VOR einer `Reveal`-Einblendung.
 * Die Bedingung war damit sofort erfuellt, waehrend Elemente kurz darauf
 * durch 0,x liefen — Axe meldete dann Kontrastfehler an Knoten, die in
 * Wahrheit sauber sind (nachgemessen: `#0f766e` auf `#f8fafc` = 5,23:1).
 *
 * Deshalb werden Uebergaenge fuer die Messung abgeschaltet. Gemessen wird
 * die Darstellung, die die Nutzerin am Ende sieht — nicht ein Zwischenbild.
 */
async function settle(page: Page) {
  await page.addStyleTag({
    content: `*, *::before, *::after {
      transition: none !important;
      animation: none !important;
      opacity: 1 !important;
    }`,
  })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForFunction(() => document.fonts.status === 'loaded')
}

async function axeFindings(page: Page): Promise<string[]> {
  await page.addScriptTag({ path: axePath })
  return page.evaluate(async () => {
    const results = await (
      window as unknown as { axe: { run: (o: unknown) => Promise<{ violations: unknown[] }> } }
    ).axe.run({ resultTypes: ['violations'] })
    return (
      results.violations as Array<{
        id: string
        impact: string
        nodes: Array<{ target: string[]; failureSummary?: string }>
      }>
    )
      .filter((violation) => ['serious', 'critical'].includes(violation.impact))
      .map((v) => `${v.id} :: ${v.nodes[0]?.target.join(' ')}`)
  })
}

/** Oeffnet das Bestellformular ueber die erste CTA der Seite. */
async function openOrderForm(page: Page, product: ConsumerProductKey) {
  const trigger = page.locator(`main [data-gtm-page="${product}"]`).first()
  await expect(trigger).toBeVisible()
  await expect(async () => {
    if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
    await expect(page.locator('form input[type="email"]')).toHaveCount(1)
  }).toPass({ timeout: 20_000 })
  return page.locator('form').filter({ has: page.locator('input[type="email"]') })
}

test.describe('PT21.7 — 3x10 Runtime-Matrix', () => {
  test('30/30 rendern echten Produktinhalt, ohne Fallback-Leck und ohne Hydrierungsfehler', async ({
    page,
  }) => {
    const findings: string[] = []
    const de = bundle('de')

    for (const route of ROUTES) {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(`${route.path}: ${error.message}`))
      page.on('console', (message) => {
        const text = message.text()
        if (
          message.type() === 'error' &&
          /hydrat|did not match|Minified React error #(418|421|423|425)/iu.test(text)
        ) {
          errors.push(`${route.path}: ${text.slice(0, 120)}`)
        }
      })

      const response = await page.goto(route.path)
      if (response?.status() !== 200) findings.push(`${route.path}: HTTP ${response?.status()}`)

      const copy = bundle(route.locale)
      const product = CONSUMER_PRODUCTS[route.product]

      // Genau eine H1, und sie traegt die freigegebene Marketingzeile.
      const h1 = page.locator('main h1')
      if ((await h1.count()) !== 1) findings.push(`${route.path}: ${await h1.count()} H1`)
      else {
        const text = (await h1.innerText()).trim()
        if (text !== copy[product.headlineKey]) {
          findings.push(`${route.path}: H1 "${text.slice(0, 40)}"`)
        }
        // Kein DE-Leck in den neun anderen Sprachen.
        if (route.locale !== 'de' && text === de[product.headlineKey]) {
          findings.push(`${route.path}: H1 ist die DE-Fassung`)
        }
      }

      // Rechtliches und Consent sind auf jeder Seite erreichbar.
      const main = page.locator('main#main-content')
      if ((await main.count()) !== 1) findings.push(`${route.path}: kein eindeutiges <main>`)
      if ((await page.locator('a[href$="/privacy"]').count()) === 0) {
        findings.push(`${route.path}: kein Datenschutz-Link`)
      }
      if ((await page.getByRole('heading', { name: copy['cookie.title'] }).count()) === 0) {
        findings.push(`${route.path}: kein Consent-Banner`)
      }

      // Keine untranslatierten Schluessel im sichtbaren Text.
      const body = (await main.evaluate((node) => node.textContent)) ?? ''
      // Ohne `i`-Flag und nur mit echter Schluesselform: sonst matcht der
      // Ausdruck Fliesstext wie "…Duo" + "Entdecken…", der beim Auslesen von
      // `textContent` ohne Trennzeichen aneinanderstoesst.
      const rawKeys =
        body.match(/\b(?:spray|mask|duo|order_form|shell)\.[a-z0-9_]+(?:\.[a-z0-9_]+)*/gu) ?? []
      if (rawKeys.length) findings.push(`${route.path}: roher i18n-Schluessel ${rawKeys[0]}`)

      findings.push(...errors)
      page.removeAllListeners('pageerror')
      page.removeAllListeners('console')
    }
    expect(findings, '3x10 Runtime').toEqual([])
    expect(ROUTES).toHaveLength(30)
  })

  test('der Sprachwechsel behaelt das Produkt — 30 Wechsel, kein Sprung auf EN oder die Startseite', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      // Zielsprache: die naechste in der Liste, damit jede Kombination drankommt.
      const index = SUPPORTED_LANGUAGES.indexOf(route.locale)
      const target = SUPPORTED_LANGUAGES[(index + 1) % SUPPORTED_LANGUAGES.length]

      await page.goto(route.path)
      // Der Ausloeser traegt den aktuellen Sprachcode in einem `span.uppercase`;
      // die Eintraege der Liste tragen den Sprachnamen in der Sprache selbst.
      // Beides ist stabil, ein Namensregex ueber die Zielsprache war es nicht
      // (`/de/` traf z. B. auch "Nederlands").
      const trigger = page
        .locator('header button')
        .filter({
          has: page.locator('span.uppercase', { hasText: new RegExp(`^${route.locale}$`, 'iu') }),
        })
        .first()
      await expect(trigger, `${route.path}: Sprachumschalter`).toBeVisible({ timeout: 15_000 })
      await trigger.click()
      const option = page.getByRole('button', { name: LANGUAGE_NAMES[target], exact: true }).first()
      await expect(option, `${route.path}: Eintrag ${target}`).toBeVisible({ timeout: 10_000 })
      await option.click()
      await page.waitForURL(new RegExp(`/${target}/consumer/`), { timeout: 15_000 }).catch(() => {})
      const url = new URL(page.url())
      if (url.pathname !== `/${target}/consumer/${route.slug}`) {
        findings.push(`${route.path} → ${target}: landet auf ${url.pathname}`)
      }
    }
    expect(findings, 'Sprachwechsel').toEqual([])
  })
})

test.describe('PT21.7 — Barrierefreiheit', () => {
  test('Axe serious/critical = 0 auf allen 30 Seiten', async ({ page }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      await page.goto(route.path)
      await settle(page)
      const violations = await axeFindings(page)
      if (violations.length) findings.push(`${route.path}: ${violations.join(' | ')}`)
    }
    expect(findings, 'Axe 30 Routen').toEqual([])
  })

  test('Axe serious/critical = 0 im geoeffneten Bestelldialog — je Produkt', async ({ page }) => {
    const findings: string[] = []
    for (const product of PRODUCTS) {
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`)
      await openOrderForm(page, product)
      await settle(page)
      const violations = await axeFindings(page)
      if (violations.length) findings.push(`${product}: ${violations.join(' | ')}`)
    }
    expect(findings, 'Axe Bestelldialog').toEqual([])
  })

  test('Skip-Link, Landmark und Ueberschriftenhierarchie tragen auf allen 30 Seiten', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const route of ROUTES) {
      await page.goto(route.path)

      // Skip-Link ist das erste fokussierbare Element und springt in <main>.
      await page.keyboard.press('Tab')
      const focus = await page.evaluate(() => {
        const active = document.activeElement as HTMLAnchorElement | null
        return { tag: active?.tagName, href: active?.getAttribute('href') }
      })
      if (focus.tag !== 'A' || focus.href !== '#main-content') {
        findings.push(`${route.path}: erstes Tab-Ziel ${focus.tag}/${focus.href}`)
      }

      // Genau ein <main> mit der Zielkennung, und es ist programmatisch fokussierbar.
      const mainAttrs = await page.locator('main#main-content').evaluate((node) => ({
        tabIndex: node.getAttribute('tabindex'),
        count: document.querySelectorAll('main').length,
      }))
      if (mainAttrs.count !== 1) findings.push(`${route.path}: ${mainAttrs.count}x <main>`)
      if (mainAttrs.tabIndex !== '-1') findings.push(`${route.path}: main ohne tabindex=-1`)

      // Keine uebersprungene Ueberschriftenebene im Hauptbereich.
      const levels = await page
        .locator('main :is(h1,h2,h3,h4,h5,h6)')
        .evaluateAll((nodes) => nodes.map((node) => Number(node.tagName.slice(1))))
      for (let i = 1; i < levels.length; i += 1) {
        if (levels[i] - levels[i - 1] > 1) {
          findings.push(`${route.path}: H${levels[i - 1]} → H${levels[i]}`)
          break
        }
      }
    }
    expect(findings, 'Skip-Link / Landmark / Hierarchie').toEqual([])
  })

  test('das Bestellformular ist per Tastatur bedienbar und meldet Fehler zugaenglich', async ({
    page,
  }) => {
    await page.goto('/de/consumer/inside-out-duo')
    const form = await openOrderForm(page, 'duo')

    // Jedes Eingabefeld hat eine programmatisch verknuepfte Beschriftung.
    const unlabelled = await form
      .locator('input:not([type="hidden"]), select, textarea')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => {
            const id = node.getAttribute('id')
            const labelled =
              (id && document.querySelector(`label[for="${id}"]`)) ||
              node.closest('label') ||
              node.getAttribute('aria-label') ||
              node.getAttribute('aria-labelledby')
            return !labelled
          })
          .map((node) => node.getAttribute('id') ?? node.getAttribute('name') ?? node.tagName),
      )
    expect(unlabelled, 'Felder ohne Beschriftung').toEqual([])

    // Der Dialog ist als solcher ausgezeichnet.
    const dialog = page.locator('[role="dialog"]')
    if (await dialog.count()) {
      await expect(dialog).toHaveAttribute('aria-modal', 'true')
      await expect(dialog).toHaveAttribute('aria-labelledby', /.+/u)
    }

    // Fehler erscheinen als Live-Region, nicht nur farblich.
    await form.locator('button[type="submit"]').click()
    const alert = page.locator('[role="alert"]')
    await expect(alert).toBeVisible({ timeout: 15_000 })
    await expect(alert).toHaveText(bundle('de')['order_form.name_required'])

    // Und die Tastatur erreicht den Absendeknopf.
    await form.locator('#order-name').focus()
    const reachable = await page.evaluate(() => {
      const focusable = [
        ...document.querySelectorAll<HTMLElement>(
          'form a[href], form button, form input:not([type="hidden"]), form select, form textarea',
        ),
      ].filter((node) => node.tabIndex >= 0 && node.offsetParent !== null)
      return focusable.some((node) => node.getAttribute('type') === 'submit')
    })
    expect(reachable, 'Absendeknopf per Tastatur erreichbar').toBe(true)
  })
})

test.describe('PT21.7 — Umbruchverhalten', () => {
  test('kein horizontaler Ueberlauf: 3 Produkte x 4 lange Locales x 3 Breiten', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const product of PRODUCTS) {
      for (const locale of LONG_LOCALES) {
        for (const viewport of VIEWPORTS) {
          await page.setViewportSize({ width: viewport.width, height: viewport.height })
          await page.goto(`/${locale}/consumer/${CONSUMER_PRODUCTS[product].slug}`)
          const overflow = await page.evaluate(
            (width) => document.documentElement.scrollWidth - width,
            viewport.width,
          )
          if (overflow > 1) {
            findings.push(`${locale}/${product} @ ${viewport.name}: ${overflow}px zu breit`)
          }
        }
      }
    }
    expect(findings, 'Ueberlauf').toEqual([])
  })

  test('der Bestelldialog bleibt auf dem Handy bedienbar', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/pl/consumer/hydrating-masks')
    const form = await openOrderForm(page, 'masks')

    // Der Dialog laeuft nicht aus dem Bildschirm.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - 390)
    expect(overflow, 'Dialog-Ueberlauf bei 390px').toBeLessThanOrEqual(1)

    // Und der Absendeknopf ist durch Scrollen im Dialog erreichbar.
    const submit = form.locator('button[type="submit"]')
    await submit.scrollIntoViewIfNeeded()
    await expect(submit).toBeInViewport()
    // Touch-Ziel gross genug.
    const box = await submit.boundingBox()
    expect(box!.height, 'Hoehe des Absendeknopfs').toBeGreaterThanOrEqual(44)
  })
})

test.describe('PT21.7 — Ladeverhalten', () => {
  test('Produktbilder werden responsiv und in der passenden Groesse ausgeliefert', async ({
    page,
  }) => {
    const findings: string[] = []
    for (const product of PRODUCTS) {
      for (const width of [390, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`)
        // Die Bilder unterhalb des ersten Bildschirms sind bewusst `lazy`.
        // Einmal ans Seitenende zu springen reicht nicht — jedes Bild wird
        // gezielt in den Blick geholt und abgewartet, sonst misst der Test
        // eine Quelle, die es noch gar nicht gibt.
        const all = page.locator('main img')
        for (let i = 0; i < (await all.count()); i += 1) {
          await all.nth(i).scrollIntoViewIfNeeded()
          await all.nth(i).evaluate((node: HTMLImageElement) =>
            node.complete && node.naturalWidth > 0
              ? undefined
              : new Promise((resolve) => {
                  node.addEventListener('load', () => resolve(undefined), { once: true })
                  node.addEventListener('error', () => resolve(undefined), { once: true })
                }),
          )
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        const images = await all.evaluateAll((nodes) =>
          nodes.map((node) => ({
            current: (node as HTMLImageElement).currentSrc.split('/').pop() ?? '',
            css: Math.round(node.getBoundingClientRect().width),
            natural: (node as HTMLImageElement).naturalWidth,
            width: node.getAttribute('width'),
            height: node.getAttribute('height'),
            loading: node.getAttribute('loading'),
          })),
        )
        for (const image of images) {
          // Ein Bild, das trotz Scrollen nicht geladen wurde, kann nicht
          // beurteilt werden — das waere eine Behauptung ohne Messwert.
          if (!image.current || image.natural === 0) {
            findings.push(`${product} @ ${width}px: Bild ${image.width}x${image.height} lud nicht`)
            continue
          }
          const label = `${product} @ ${width}px ${image.current}`
          // Feste Abmessungen gegen Layoutspruenge.
          if (!image.width || !image.height) findings.push(`${label}: ohne width/height`)
          // WebP statt JPEG-Original.
          if (!image.current.endsWith('.webp')) findings.push(`${label}: kein WebP`)
          // Und keine grob ueberdimensionierte Auslieferung mehr.
          if (image.natural > 0 && image.css > 0 && image.natural / image.css > 2.2) {
            findings.push(
              `${label}: ${image.natural}px fuer ${image.css}px (Faktor ${(image.natural / image.css).toFixed(1)})`,
            )
          }
        }
      }
    }
    expect(findings, 'Bildauslieferung').toEqual([])
  })

  test('Hero eager mit Vorrang, alles darunter lazy', async ({ page }) => {
    const findings: string[] = []
    for (const product of PRODUCTS) {
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`)
      const images = await page.locator('main img').evaluateAll((nodes) =>
        nodes.map((node, index) => ({
          index,
          loading: node.getAttribute('loading'),
          priority: node.getAttribute('fetchpriority'),
          alt: node.getAttribute('alt') ?? '',
        })),
      )
      const [hero, ...rest] = images
      if (hero.loading !== 'eager') findings.push(`${product}: Hero loading=${hero.loading}`)
      if (hero.priority !== 'high') findings.push(`${product}: Hero fetchpriority=${hero.priority}`)
      for (const image of rest) {
        if (image.loading !== 'lazy') findings.push(`${product}: Bild ${image.index} nicht lazy`)
      }
      for (const image of images) {
        if (image.alt.trim().length < 3) findings.push(`${product}: Bild ${image.index} ohne Alt`)
      }
    }
    expect(findings, 'Ladeprioritaet').toEqual([])
  })

  test('Bild-Budget: der erste Bildschirm bleibt unter 120 KB je Produkt', async ({ page }) => {
    const report: string[] = []
    const findings: string[] = []
    for (const product of PRODUCTS) {
      await page.setViewportSize({ width: 390, height: 844 })
      const bytes = new Map<string, number>()
      page.on('response', (response) => {
        if (/\.(jpe?g|png|webp|avif)(\?|$)/iu.test(response.url())) {
          bytes.set(response.url(), Number(response.headers()['content-length'] ?? 0))
        }
      })
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`, {
        waitUntil: 'networkidle',
      })
      const total = [...bytes.values()].reduce((sum, value) => sum + value, 0)
      report.push(`${product}: ${(total / 1024).toFixed(0)} KB`)
      if (total > 120 * 1024) findings.push(`${product}: ${(total / 1024).toFixed(0)} KB > 120 KB`)
      page.removeAllListeners('response')
    }
    expect(findings, `Bild-Budget (gemessen: ${report.join(', ')})`).toEqual([])
  })

  test('kein doppelt geladenes Tracking-SDK und keine Vorab-Providerverbindung', async ({
    page,
  }) => {
    const external: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (!url.startsWith('http://127.0.0.1') && !url.startsWith('data:')) external.push(url)
    })
    for (const product of PRODUCTS) {
      await page.goto(`/de/consumer/${CONSUMER_PRODUCTS[product].slug}`, {
        waitUntil: 'networkidle',
      })
    }
    // Ohne Einwilligung darf ueberhaupt nichts nach draussen gehen.
    expect(external, 'externe Requests ohne Consent').toEqual([])

    // Und das GTM-Snippet liegt genau einmal im Dokument.
    const snippets = await page.evaluate(
      () =>
        [...document.querySelectorAll('script')].filter((node) =>
          /googletagmanager|gtag\(/u.test(node.textContent ?? node.src ?? ''),
        ).length,
    )
    expect(snippets, 'GTM-Einbindungen').toBeLessThanOrEqual(1)
  })
})
