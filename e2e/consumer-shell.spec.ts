import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

/**
 * AP21 PT21.1 — die gemeinsame Consumer-Shell.
 *
 * Vor dieser Aufgabe hatte keine der drei Landingpages ein `<main>` und keinen
 * Sprunglink (gemessen: 0/30 im SSR-Dokument). Geprueft wird deshalb genau
 * das Geruest — Produkt- und Bestellinhalte sind ausdruecklich PT21.2+.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const SLUGS = ['vitamin-d3-spray', 'hydrating-masks', 'inside-out-duo'] as const
const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u

const common = (locale: string): Record<string, unknown> =>
  JSON.parse(readFileSync(`public/locales/${locale}/common.json`, 'utf8')) as Record<
    string,
    unknown
  >

const at = (source: unknown, pointer: string): string => {
  const value = pointer
    .split('.')
    .reduce<unknown>(
      (current, part) =>
        current && typeof current === 'object'
          ? (current as Record<string, unknown>)[part]
          : undefined,
      source,
    )
  return typeof value === 'string' ? value : ''
}

async function settle(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const settled = () =>
    page.waitForFunction(() =>
      [...document.querySelectorAll('body *')].every((node) => {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity)
        return opacity === 1 || opacity === 0
      }),
    )
  await settled()
  await page.evaluate(() => window.scrollTo(0, 0))
  await settled()
  await settled()
}

async function axeFindings(page: Page) {
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
      .map(
        (v) => `${v.id} :: ${v.nodes[0]?.target.join(' ')} :: ${v.nodes[0]?.failureSummary ?? ''}`,
      )
  })
}

test.describe('PT21.1 Consumer-Shell', () => {
  test('30 Routen: genau ein <main> und ein Sprunglink als erstes Element', async ({ request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const slug of SLUGS) {
        const response = await request.get(`/${locale}/consumer/${slug}`, { maxRedirects: 0 })
        expect(response.status(), `${locale}/${slug}`).toBe(200)
        const html = await response.text()

        expect(html.match(/<main/gu) ?? [], `${locale}/${slug}: genau ein main`).toHaveLength(1)
        expect(html, `${locale}/${slug}`).toContain('<main id="main-content"')
        expect(html, `${locale}/${slug}`).toContain('href="#main-content"')
        // Der Sprunglink muss VOR dem Header stehen, sonst springt er ins Leere.
        expect(
          html.indexOf('href="#main-content"'),
          `${locale}/${slug}: Sprunglink vor Header`,
        ).toBeLessThan(html.indexOf('<header'))
      }
    }
  })

  test('SSR-Head im ersten Response: Canonical, hreflang x10, x-default de', async ({
    request,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const slug of SLUGS) {
        const html = await (await request.get(`/${locale}/consumer/${slug}`)).text()
        expect(html).toContain(
          `rel="canonical" href="https://polarisdx.net/${locale}/consumer/${slug}"`,
        )
        for (const other of SUPPORTED_LANGUAGES) {
          expect(html).toContain(
            `hrefLang="${other}" href="https://polarisdx.net/${other}/consumer/${slug}"`,
          )
        }
        expect(html).toContain(
          `hrefLang="x-default" href="https://polarisdx.net/de/consumer/${slug}"`,
        )
        // Head steht im ERSTEN Response, nicht erst nach Hydration.
        expect(html.indexOf('rel="canonical"')).toBeLessThan(html.indexOf('<div id="root">'))
      }
    }
  })

  test('keine EN-Zwangsredirects, Consumer-Hub bleibt NOT_REQUIRED', async ({ request }) => {
    for (const slug of SLUGS) {
      // Ohne Praefix: 301 auf die Default-Sprache de — niemals auf en.
      const bare = await request.get(`/consumer/${slug}`, { maxRedirects: 0 })
      expect(bare.status()).toBe(301)
      expect(bare.headers().location, slug).toBe(`/de/consumer/${slug}`)

      // Jede gueltige Locale antwortet direkt mit 200, ohne Umleitung.
      for (const locale of SUPPORTED_LANGUAGES) {
        const response = await request.get(`/${locale}/consumer/${slug}`, { maxRedirects: 0 })
        expect(response.status(), `${locale}/${slug}`).toBe(200)
        expect(response.headers().location, `${locale}/${slug}`).toBeUndefined()
      }
    }
    // Kein erfundener Hub.
    expect((await request.get('/consumer', { maxRedirects: 0 })).status()).toBe(404)
    expect((await request.get('/de/consumer', { maxRedirects: 0 })).status()).toBe(404)
  })

  test('Sprachumschalter 10/10 und der Produkt-Slug bleibt erhalten', async ({ page }) => {
    await page.goto('/de/consumer/vitamin-d3-spray')
    const trigger = page.getByRole('button', { name: at(common('de'), 'a11y.select_language') })
    await expect(trigger).toBeVisible()

    // Der siteweite Umschalter arbeitet mit Buttons und `changeLanguage`, nicht
    // mit `<a href>`. Geprueft wird deshalb, dass alle zehn Sprachen als
    // bedienbare Optionen dastehen — und dass der Wechsel den Produkt-Slug
    // behaelt. Ein Klick vor der Hydration ginge verloren, daher die
    // zustandsabhaengige, idempotente Schleife.
    const options = page.locator('header div.absolute button')
    await expect(async () => {
      if ((await options.count()) === 0) await trigger.click()
      await expect(options).toHaveCount(SUPPORTED_LANGUAGES.length, { timeout: 1000 })
    }).toPass({ timeout: 20_000 })

    const labels = await options.allInnerTexts()
    expect(labels.filter((label) => label.trim().length > 0)).toHaveLength(
      SUPPORTED_LANGUAGES.length,
    )

    // Polnisch waehlen: derselbe Slug, andere Sprache, Shell weiter intakt.
    await options.nth(SUPPORTED_LANGUAGES.indexOf('pl')).click()
    await expect(page).toHaveURL(/\/pl\/consumer\/vitamin-d3-spray$/u)
    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.locator('a[href="#main-content"]')).toHaveCount(1)
  })

  test('Sprunglink setzt den Fokus wirklich in den Hauptinhalt', async ({ page }) => {
    await page.goto('/de/consumer/vitamin-d3-spray')
    await page.keyboard.press('Tab')
    const focused = page.locator(':focus')
    await expect(focused).toHaveAttribute('href', '#main-content')
    await page.keyboard.press('Enter')
    // Ohne tabIndex=-1 am <main> wuerde nur gescrollt und der Fokus bliebe oben.
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('main-content')
  })

  test('Consent-Banner und Legal-Zugang auf der Consumer-Strecke', async ({ page }) => {
    const providerRequests: string[] = []
    page.on('request', (request) => {
      if (providerPattern.test(request.url())) providerRequests.push(request.url())
    })

    await page.context().clearCookies()
    await page.goto('/de/consumer/vitamin-d3-spray')
    await page.evaluate(() => localStorage.removeItem('cookie-consent'))
    await page.reload()

    // Der Banner haengt siteweit in App.tsx — er muss auch hier erscheinen.
    // Er traegt keine Dialogrolle und kein Testattribut; angesprochen wird
    // deshalb seine reale, x10 vorhandene Ueberschrift.
    await expect(page.getByRole('heading', { name: at(common('de'), 'cookie.title') })).toBeVisible(
      { timeout: 15_000 },
    )
    // Vor der Einwilligung darf kein Provider kontaktiert werden.
    expect(providerRequests).toEqual([])

    // Legal ist ohne Umweg erreichbar.
    for (const path of ['/de/imprint', '/de/privacy', '/de/terms']) {
      await expect(page.locator(`a[href="${path}"]`).first(), path).toHaveCount(1)
    }
  })

  test('A11y der Shell: Axe serious/critical 0 auf allen drei Seiten', async ({ page }) => {
    // Gemessen wird die SHELL. Der Produktinhalt bringt einen eigenen
    // Kontrastfehler mit (`<p class="mt-8 text-center text-sm text-gray-500">`
    // mit dem Dosierungshinweis, 3,22:1 auf `slate-50`); der ist vorbestehend
    // und gehoert zu PT21.2. Fuer diese Messung wird der Inhalt deshalb
    // ausgeblendet — uebrig bleiben Sprunglink, Header, `<main>` und Footer.
    for (const slug of SLUGS) {
      await page.goto(`/de/consumer/${slug}`)
      await settle(page)
      await page.evaluate(() => {
        for (const child of document.querySelectorAll('main#main-content > *')) {
          ;(child as HTMLElement).style.display = 'none'
        }
      })
      expect(await axeFindings(page), slug).toEqual([])
    }
    // Und der Sprunglink im sichtbaren Zustand — `sr-only` allein waere ein
    // Sprunglink, den niemand sieht.
    await page.goto('/de/consumer/vitamin-d3-spray')
    await page.keyboard.press('Tab')
    await settle(page)
    await page.evaluate(() => {
      for (const child of document.querySelectorAll('main#main-content > *')) {
        ;(child as HTMLElement).style.display = 'none'
      }
    })
    expect(await axeFindings(page), 'Sprunglink fokussiert').toEqual([])
  })

  test('Responsive: die Shell selbst laeuft in 390/768/1440 nicht ueber', async ({ page }) => {
    // PT21.1 verantwortet das Geruest, nicht den Produktinhalt. Der Inhalt
    // laeuft bei 390px messbar um 26px ueber — Hero-Dekoration und eine
    // Spezifikationstabelle in `section.py-24`. Das ist vorbestehend und
    // unabhaengig vom `<main>`-Layout reproduzierbar (mit `display:block` am
    // `<main>` derselbe Wert); Owner ist PT21.2/PT21.7.
    //
    // Damit die Shell trotzdem pruefbar bleibt, wird der Produktinhalt fuer
    // die Messung ausgeblendet: uebrig bleiben Sprunglink, Header, die
    // `<main>`-Box und der Footer — genau das, was diese Aufgabe liefert.
    for (const locale of ['de', 'pl', 'cs']) {
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}/consumer/vitamin-d3-spray`)
        const overflow = await page.evaluate(() => {
          for (const child of document.querySelectorAll('main#main-content > *')) {
            ;(child as HTMLElement).style.display = 'none'
          }
          const root = document.documentElement
          return {
            document: root.scrollWidth - root.clientWidth,
            boxes: ['a[href="#main-content"]', 'header', 'main#main-content', 'footer'].map(
              (selector) => {
                const el = document.querySelector(selector)
                return {
                  selector,
                  missing: !el,
                  over: el ? Math.round(el.getBoundingClientRect().right - root.clientWidth) : 0,
                }
              },
            ),
          }
        })
        expect(overflow.document, `${locale} @ ${width}px: Shell-Dokument`).toBeLessThanOrEqual(0)
        for (const box of overflow.boxes) {
          expect(box.missing, `${locale} @ ${width}px: ${box.selector} fehlt`).toBe(false)
          expect(box.over, `${locale} @ ${width}px: ${box.selector}`).toBeLessThanOrEqual(0)
        }
      }
    }
  })
})
