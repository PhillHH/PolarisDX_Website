import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { SPRAY_PRODUCT } from '../src/content/consumer/products'

/**
 * AP21 PT21.2 — was die Vitamin-Seite wirklich ausliefert.
 *
 * Der Inhaltstest daneben (`src/content/consumer/products.test.ts`) prueft die
 * Quelle; hier zaehlt das gerenderte Dokument: Schema-Wahrheit, keine
 * erfundenen Angebote, lokalisierte Einheiten und die beiden aus PT21.1
 * uebergebenen Defekte CD-01 und CD-02.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const ROUTE = `/consumer/${SPRAY_PRODUCT.slug}`

const bundle = (locale: string): Record<string, string> =>
  JSON.parse(readFileSync(`public/locales/${locale}/consumer.json`, 'utf8')) as Record<
    string,
    string
  >

const jsonLd = (html: string): Record<string, unknown>[] =>
  [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>(.*?)<\/script>/gsu)].flatMap(
    (match) => {
      const parsed = JSON.parse(match[1].replace(/&quot;/gu, '"')) as unknown
      return Array.isArray(parsed)
        ? (parsed as Record<string, unknown>[])
        : [parsed as Record<string, unknown>]
    },
  )

async function settle(page: Page) {
  const settled = () =>
    page.waitForFunction(() =>
      [...document.querySelectorAll('body *')].every((node) => {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity)
        return opacity === 1 || opacity === 0
      }),
    )
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await settled()
  await page.evaluate(() => window.scrollTo(0, 0))
  await settled()
  await settled()
}

test.describe('PT21.2 Vitamin D3 Spray', () => {
  test('Produktschema nennt den Produktnamen und kein erfundenes Angebot', async ({ request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const copy = bundle(locale)
      const product = jsonLd(html).find((entry) => entry['@type'] === 'Product')
      expect(product, `${locale}: Product-Schema`).toBeTruthy()

      // Vorher stand hier die H1-Marketingzeile als `name`.
      expect(product?.name, `${locale}: Product.name`).toBe(copy[SPRAY_PRODUCT.nameKey])
      expect(product?.name).not.toBe(copy[SPRAY_PRODUCT.headlineKey])
      expect(product?.description, `${locale}`).toBe(copy[SPRAY_PRODUCT.seoDescriptionKey])
      expect(String(product?.url)).toBe(`https://polarisdx.net/${locale}${ROUTE}`)
      expect(String(product?.image)).toContain('spray-hero')

      // Nichts Erfundenes im Schema.
      for (const forbidden of ['offers', 'aggregateRating', 'review', 'gtin', 'sku', 'price']) {
        expect(Object.keys(product ?? {}), `${locale}: ${forbidden}`).not.toContain(forbidden)
      }
      // Der Breadcrumb nennt ebenfalls den Produktnamen.
      const crumbs = jsonLd(html).find((entry) => entry['@type'] === 'BreadcrumbList')
      const last = (crumbs?.itemListElement as Array<{ name: string }>).at(-1)
      expect(last?.name, `${locale}: Breadcrumb`).toBe(copy[SPRAY_PRODUCT.nameKey])
    }
  })

  test('kein Listenpreis und keine Angebots-/Bewertungsaussage im Dokument', async ({
    request,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const body = html.slice(html.indexOf('<div id="root">'))
      // Die 169 € standen unbelegt im JSX und sind entfernt.
      expect(body, `${locale}: Listenpreis`).not.toMatch(/169\s*(&nbsp;|\s)*€|€\s*169/u)
      expect(body, `${locale}: Verfuegbarkeit`).not.toMatch(
        /\b(in stock|auf lager|lieferzeit|delivery time)\b/iu,
      )
      expect(body, `${locale}: Bewertung`).not.toMatch(/\b(aggregateRating|\d[.,]\d\s*\/\s*5)\b/u)
    }
  })

  test('Einheiten erscheinen lokalisiert, nicht fest englisch', async ({ request }) => {
    const units: Record<string, string> = {
      de: 'IE',
      en: 'IU',
      pl: 'j.m',
      fr: 'UI',
      it: 'UI',
      es: 'UI',
      pt: 'UI',
      da: 'IE',
      nl: 'IE',
      cs: 'IU',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const body = html.slice(html.indexOf('<div id="root">'))
      const copy = bundle(locale)
      expect(body, `${locale}: Dosierungszeile`).toContain(copy['spray.facts.dosage_value'])
      expect(body, `${locale}: Stat-Wert`).toContain(copy['spray.stats.d3_value'])
      expect(copy['spray.stats.d3_value'], `${locale}: Einheit`).toContain(units[locale])
      if (units[locale] !== 'IU') {
        expect(body, `${locale}: fremde Einheit IU`).not.toContain('1000 IU')
      }
    }
  })

  test('x10 sichtbarer Inhalt: Ueberschrift, Fakten, Sicherheitshinweis, acht FAQ', async ({
    page,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}${ROUTE}`)
      const copy = bundle(locale)

      await expect(page.locator('h1'), `${locale}: eine H1`).toHaveCount(1)
      await expect(page.locator('h1')).toHaveText(copy[SPRAY_PRODUCT.headlineKey])

      const main = await page.locator('main#main-content').innerText()
      // Sicherheitshinweise: Dosierungshinweis und Pflichtdisclaimer.
      expect(main, `${locale}: Dosierungshinweis`).toContain(copy['spray.copy_082'])
      expect(main, `${locale}: Disclaimer`).toContain(copy['spray.copy_101'])
      // FAQ: acht Fragen, alle mit echter Antwort.
      await expect(page.locator('main details'), `${locale}: FAQ`).toHaveCount(8)
      for (const index of [30, 32, 34, 36, 38, 40, 42, 44]) {
        const key = `spray.copy_0${index}`
        expect(main, `${locale}: ${key}`).toContain(copy[key])
      }
      // Produktfakten sichtbar.
      expect(main, `${locale}: Herkunft`).toContain(copy['spray.copy_055'])
    }
  })

  test('Bestellkontext traegt die allowlistete Produkt-ID, keinen freien Namen', async ({
    page,
  }) => {
    await page.goto(`/de${ROUTE}`)
    const trigger = page.locator('main [data-gtm-page="spray"]').first()
    await expect(trigger).toBeVisible()

    let payload: Record<string, unknown> | null = null
    await page.route('**/api/consumer-order', async (route) => {
      payload = route.request().postDataJSON() as Record<string, unknown>
      await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) })
    })

    await expect(async () => {
      if ((await page.locator('form input[type="email"]').count()) === 0) await trigger.click()
      await expect(page.locator('form input[type="email"]')).toHaveCount(1)
    }).toPass({ timeout: 20_000 })

    const form = page.locator('form').filter({ has: page.locator('input[type="email"]') })
    await form.locator('input[type="text"]').first().fill('Testkundin')
    await form.locator('input[type="email"]').fill('kundin@example.com')
    for (const field of await form.locator('input[type="text"]').all()) {
      if ((await field.inputValue()) === '') await field.fill('Test')
    }
    await form.locator('input[type="checkbox"]').first().check()
    await form.locator('button[type="submit"]').click()

    await expect.poll(() => payload, { timeout: 20_000 }).not.toBeNull()
    expect(payload!.product, 'stabile Bestell-ID').toBe(SPRAY_PRODUCT.orderId)
    expect(String(payload!.product), 'kein freier Produktname').not.toContain(' ')
  })

  test('CD-01: kein horizontaler Ueberlauf mehr bei 390/768/1440', async ({ page }) => {
    for (const locale of ['de', 'pl', 'cs']) {
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}${ROUTE}`)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${locale} @ ${width}px`).toBeLessThanOrEqual(0)
      }
    }
  })

  test('CD-02 und A11y: Axe serious/critical 0 auf der ganzen Seite', async ({ page }) => {
    await page.goto(`/de${ROUTE}`)
    await settle(page)
    await page.addScriptTag({ path: axePath })
    const findings = await page.evaluate(async () => {
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
        .map((v) => `${v.id} :: ${v.nodes[0]?.target.join(' ')} :: ${v.nodes[0]?.failureSummary}`)
    })
    expect(findings).toEqual([])
  })

  test('Performance: Hero eager, Galerie lazy, keine ueberdimensionierten Vorabladungen', async ({
    page,
  }) => {
    await page.goto(`/de${ROUTE}`)
    const images = await page.locator('main img').evaluateAll((nodes) =>
      nodes.map((node) => ({
        src: node.getAttribute('src') ?? '',
        loading: node.getAttribute('loading'),
        alt: node.getAttribute('alt') ?? '',
      })),
    )
    expect(images.length).toBeGreaterThan(0)
    const hero = images[0]
    expect(hero.src).toContain('spray-hero')
    expect(hero.loading, 'Hero eager').toBe('eager')
    expect(hero.alt.trim(), 'Hero-Alternativtext').not.toBe('')
    for (const image of images.slice(1)) {
      expect(image.loading, `${image.src} lazy`).toBe('lazy')
      expect(image.alt.trim(), `${image.src} Alternativtext`).not.toBe('')
    }
  })
})
