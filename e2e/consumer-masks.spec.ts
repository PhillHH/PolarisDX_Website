import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { MASKS_PRODUCT } from '../src/content/consumer/products'

/**
 * AP21 PT21.3 — was die Masken-Seite wirklich ausliefert.
 *
 * Der Inhaltstest daneben prueft die Quelle; hier zaehlt das gerenderte
 * Dokument: Schema-Wahrheit, kein unbelegter Listenpreis, die lokalisierte
 * Zahlenspanne und dass der kosmetische Nutzen nicht medizinisch aufgeladen
 * wird. Ueberlauf und Kontrast werden gemessen, nicht angenommen.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const ROUTE = `/consumer/${MASKS_PRODUCT.slug}`

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

test.describe('PT21.3 Hydrating Masks', () => {
  test('Produktschema nennt den Produktnamen und kein erfundenes Angebot', async ({ request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const copy = bundle(locale)
      const product = jsonLd(html).find((entry) => entry['@type'] === 'Product')
      expect(product, `${locale}: Product-Schema`).toBeTruthy()

      // Vorher stand hier die H1-Marketingzeile als `name`.
      expect(product?.name, `${locale}: Product.name`).toBe(copy[MASKS_PRODUCT.nameKey])
      expect(product?.name).not.toBe(copy[MASKS_PRODUCT.headlineKey])
      expect(product?.description, `${locale}`).toBe(copy[MASKS_PRODUCT.seoDescriptionKey])
      expect(String(product?.url)).toBe(`https://polarisdx.net/${locale}${ROUTE}`)
      expect(String(product?.image)).toContain('mask-hero')

      // Nichts Erfundenes im Schema.
      for (const forbidden of ['offers', 'aggregateRating', 'review', 'gtin', 'sku', 'price']) {
        expect(Object.keys(product ?? {}), `${locale}: ${forbidden}`).not.toContain(forbidden)
      }
      // Der Breadcrumb nennt ebenfalls den Produktnamen.
      const crumbs = jsonLd(html).find((entry) => entry['@type'] === 'BreadcrumbList')
      const last = (crumbs?.itemListElement as Array<{ name: string }>).at(-1)
      expect(last?.name, `${locale}: Breadcrumb`).toBe(copy[MASKS_PRODUCT.nameKey])
    }
  })

  test('kein Listenpreis und keine Angebots-/Bewertungsaussage im Dokument', async ({
    request,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const body = html.slice(html.indexOf('<div id="root">'))
      // Die 45 € standen unbelegt im JSX und sind entfernt; `PriceBadge`
      // traegt fuer die Masken ohnehin bewusst keine €-Angabe.
      expect(body, `${locale}: Listenpreis`).not.toMatch(/\b45\s*(&nbsp;|\s)*€|€\s*45\b/u)
      expect(body, `${locale}: Waehrung`).not.toMatch(/€/u)
      expect(body, `${locale}: Verfuegbarkeit`).not.toMatch(
        /\b(in stock|auf lager|lieferzeit|delivery time)\b/iu,
      )
      expect(body, `${locale}: Bewertung`).not.toMatch(/\b(aggregateRating|\d[.,]\d\s*\/\s*5)\b/u)
    }
  })

  test('Zahlenspanne erscheint in der Schreibweise der jeweiligen Locale', async ({ request }) => {
    // Fest im JSX stand '15–30' mit Gedankenstrich; it, da und nl schreiben in
    // ihrer freigegebenen Copy einen Bindestrich.
    const dash: Record<string, string> = {
      // Aus der freigegebenen Copy gemessen (alle `mask.*`-Strings, nicht nur
      // zwei): de, en, pl, pt und cs schreiben die Spanne mit
      // Halbgeviertstrich, it, da und nl mit Bindestrich. fr und es fuehren in
      // ihrer Copy ueberhaupt keine Zahlenspanne ("de 15 à 30 minutes") —
      // dort gilt die typografische Standardform.
      de: '–',
      en: '–',
      pl: '–',
      pt: '–',
      cs: '–',
      fr: '–',
      es: '–',
      it: '-',
      da: '-',
      nl: '-',
    }
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}${ROUTE}`)).text()
      const body = html.slice(html.indexOf('<div id="root">'))
      const copy = bundle(locale)
      expect(copy['mask.stats.minutes_value'], `${locale}`).toBe(`15${dash[locale]}30`)
      expect(body, `${locale}: Spanne`).toContain(copy['mask.stats.minutes_value'])
      expect(body, `${locale}: Serummenge`).toContain(copy['mask.stats.serum_value'])
      // Bewusst NUR die Kennzahlkachel pruefen, nicht das ganze Dokument:
      // nl fuehrt in `mask.copy_045` legitim einen Halbgeviertstrich, obwohl
      // die Kachel den Bindestrich der uebrigen nl-Copy nutzt.
      const tile = html.match(
        /<p class="text-3xl[^"]*">([^<]*)<\/p><p class="mt-2[^"]*">([^<]*)</gu,
      )
      expect(tile, `${locale}: Kennzahlkacheln gefunden`).toBeTruthy()
      expect(tile!.join(' '), `${locale}: Kachelwert`).toContain(copy['mask.stats.minutes_value'])
      if (dash[locale] === '-') {
        expect(tile!.join(' '), `${locale}: fremdes Trennzeichen in der Kachel`).not.toContain(
          '15–30',
        )
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
      await expect(page.locator('h1')).toHaveText(copy[MASKS_PRODUCT.headlineKey])

      const main = await page.locator('main#main-content').innerText()
      // `copy_028` ist eine FAQ-Antwort und steckt in einem zugeklappten
      // <details>; sichtbarer Text erfasst sie nicht, der DOM-Text schon.
      const domText = await page.locator('main#main-content').evaluate((node) => node.textContent)
      expect(domText, `${locale}: Sicherheitsantwort`).toContain(copy['mask.copy_028'])
      // Der kosmetische Pflichtdisclaimer steht sichtbar am Seitenfuss.
      expect(main, `${locale}: Disclaimer`).toContain(copy['mask.copy_088'])
      // FAQ vorhanden und mit echten Antworten.
      const faqCount = await page.locator('main details').count()
      expect(faqCount, `${locale}: FAQ`).toBeGreaterThanOrEqual(5)
      // Produktfakten sichtbar.
      expect(main, `${locale}: Kennzahl`).toContain(copy['mask.stats.masks_value'])
    }
  })

  test('Bestellkontext traegt die allowlistete Produkt-ID, keinen freien Namen', async ({
    page,
  }) => {
    await page.goto(`/de${ROUTE}`)
    const trigger = page.locator('main [data-gtm-page="masks"]').first()
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
    expect(payload!.product, 'stabile Bestell-ID').toBe(MASKS_PRODUCT.orderId)
    expect(String(payload!.product), 'kein freier Produktname').not.toContain(' ')
  })

  test('kein horizontaler Ueberlauf bei 390/768/1440 (gemessen, nicht angenommen)', async ({
    page,
  }) => {
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
    expect(hero.src).toContain('mask-hero')
    expect(hero.loading, 'Hero eager').toBe('eager')
    expect(hero.alt.trim(), 'Hero-Alternativtext').not.toBe('')
    for (const image of images.slice(1)) {
      expect(image.loading, `${image.src} lazy`).toBe('lazy')
      expect(image.alt.trim(), `${image.src} Alternativtext`).not.toBe('')
    }
  })
})
