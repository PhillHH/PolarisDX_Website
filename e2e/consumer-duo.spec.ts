import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { DUO_PRODUCT } from '../src/content/consumer/products'

/**
 * AP21 PT21.4 — was die Duo-Seite wirklich ausliefert.
 *
 * Der Inhaltstest prueft die Quelle; hier zaehlt das gerenderte Dokument:
 * Schema-Wahrheit, die Bundle-Zusammensetzung, der EINE belegte Paketpreis und
 * dass daraus kein Rabatt- oder Verfuegbarkeitsversprechen wird. Ueberlauf und
 * Kontrast werden gemessen, nicht angenommen.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const ROUTE = `/consumer/${DUO_PRODUCT.slug}`

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

test.describe('PT21.4 Inside-Out Care Duo', () => {
  test('Produktschema nennt den Produktnamen und kein erfundenes Angebot', async ({ request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const copy = bundle(locale)
      const product = jsonLd(html).find((entry) => entry['@type'] === 'Product')
      expect(product, `${locale}: Product-Schema`).toBeTruthy()

      expect(product?.name, `${locale}: Product.name`).toBe(copy[DUO_PRODUCT.nameKey])
      expect(product?.name).not.toBe(copy[DUO_PRODUCT.headlineKey])
      expect(String(product?.url)).toBe(`https://polarisdx.net/${locale}${ROUTE}`)
      expect(String(product?.image)).toContain('duo-hero')

      // Auch ein belegter Preis gehoert nicht als `offers` ins Schema, solange
      // Verfuegbarkeit und Konditionen nicht belegt sind.
      for (const forbidden of ['offers', 'aggregateRating', 'review', 'gtin', 'sku', 'price']) {
        expect(Object.keys(product ?? {}), `${locale}: ${forbidden}`).not.toContain(forbidden)
      }
      const crumbs = jsonLd(html).find((entry) => entry['@type'] === 'BreadcrumbList')
      const last = (crumbs?.itemListElement as Array<{ name: string }>).at(-1)
      expect(last?.name, `${locale}: Breadcrumb`).toBe(copy[DUO_PRODUCT.nameKey])
    }
  })

  test('zeigt genau den belegten Paketpreis und kein Rabattversprechen', async ({ request }) => {
    const amount = DUO_PRODUCT.listPrice!.amount
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const body = html.slice(html.indexOf('<div id="root">'))

      // Der Betrag erscheint — er ist durch `duo.copy_016` x10 gedeckt.
      const digits = body.replace(/&nbsp;|\s/gu, '')
      expect(digits, `${locale}: Paketpreis sichtbar`).toMatch(/49[.,]90/u)

      // Kein zweiter, abweichender Betrag: ausser dem Paketpreis und dem
      // monatlichen Zusatzbetrag darf keine weitere Euro-Zahl auftauchen.
      // `formatCurrency` kuerzt ganze Betraege: der Zusatzbetrag erscheint als
      // "2 €" (mit geschuetztem Leerzeichen), nicht als "2,00 €".
      const euros = [
        ...body.matchAll(/(\d+(?:[.,]\d{2})?)(?:&nbsp;|\s)*€|€(?:&nbsp;|\s)*(\d+(?:[.,]\d{2})?)/gu),
      ]
        .map((match) => Number((match[1] ?? match[2]).replace(',', '.')))
        .filter((value) => Number.isFinite(value))
      const unique = [...new Set(euros)].sort((a, b) => a - b)
      expect(unique, `${locale}: Betraege`).toEqual([2, amount])

      // Und nirgends ein Rabatt-, Ersparnis- oder Verfuegbarkeitsversprechen.
      expect(body, `${locale}`).not.toMatch(
        /\b(rabatt|discount|ersparnis|savings?|sconto|descuento|korting|sleva|réduction|in stock|auf lager|lieferzeit|delivery time)\b/iu,
      )
      expect(body, `${locale}: Bewertung`).not.toMatch(/\b(aggregateRating|\d[.,]\d\s*\/\s*5)\b/u)
    }
  })

  test('beschreibt das Bundle als 1 Spray + 5 Masken, nicht als 12er-Pack', async ({ page }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}${ROUTE}`)
      const copy = bundle(locale)
      const main = await page.locator('main#main-content').innerText()

      // Die Kennzahl und die Bestandteile stehen sichtbar auf der Seite.
      expect(main, `${locale}: Kennzahl`).toContain(copy['duo.stats.bundle_value'])
      for (const component of DUO_PRODUCT.components) {
        expect(main, `${locale}: ${component.labelKey}`).toContain(copy[component.labelKey])
      }
      // `copy_004` ist eine FAQ-Antwort und steckt in einem zugeklappten
      // <details>; sichtbarer Text erfasst sie nicht, der DOM-Text schon.
      const domText = await page.locator('main#main-content').evaluate((node) => node.textContent)
      expect(domText, `${locale}: Zusammensetzung`).toContain(copy['duo.copy_004'])
    }
  })

  test('x10 sichtbarer Inhalt: eine H1, Sicherheitshinweise, FAQ', async ({ page }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}${ROUTE}`)
      const copy = bundle(locale)

      await expect(page.locator('h1'), `${locale}: eine H1`).toHaveCount(1)
      await expect(page.locator('h1')).toContainText(copy[DUO_PRODUCT.headlineKey])

      const main = await page.locator('main#main-content').innerText()
      const domText = await page.locator('main#main-content').evaluate((node) => node.textContent)
      // `copy_008` ist eine FAQ-Antwort in einem zugeklappten <details>.
      expect(domText, `${locale}: Sicherheitsantwort`).toContain(copy['duo.copy_008'])
      expect(main, `${locale}: Disclaimer`).toContain(copy['duo.copy_059'])
      const faqCount = await page.locator('main details').count()
      expect(faqCount, `${locale}: FAQ`).toBeGreaterThanOrEqual(4)
    }
  })

  test('Bestellkontext traegt die allowlistete Produkt-ID, keinen freien Namen', async ({
    page,
  }) => {
    await page.goto(`/de${ROUTE}`)
    const trigger = page.locator('main [data-gtm-page="duo"]').first()
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
    expect(payload!.product, 'stabile Bestell-ID').toBe(DUO_PRODUCT.orderId)
    expect(String(payload!.product), 'kein freier Produktname').not.toContain(' ')
  })

  test('kein horizontaler Ueberlauf bei 390/768/1440 (gemessen)', async ({ page }) => {
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

  test('A11y: Axe serious/critical 0 auf der ganzen Seite (gemessen)', async ({ page }) => {
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

  test('Performance: Hero eager, uebrige Bilder lazy, Alternativtexte gesetzt', async ({
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
    expect(hero.src).toContain('duo-hero')
    expect(hero.loading, 'Hero eager').toBe('eager')
    expect(hero.alt.trim(), 'Hero-Alternativtext').not.toBe('')
    for (const image of images.slice(1)) {
      expect(image.loading, `${image.src} lazy`).toBe('lazy')
      expect(image.alt.trim(), `${image.src} Alternativtext`).not.toBe('')
    }
  })
})
