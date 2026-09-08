import { expect, test, type Page } from '@playwright/test'
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { findResource } from '../src/content/resources/resourceInventory'
import { SAMPLE_BUNDLE_ASSET_ID } from '../src/content/resources/leadMagnetCandidates'

/**
 * PT19.4 — der aktive Lead-Magnet durch die echte Oberflaeche.
 *
 * Der Browser klickt, das Formular geht an den echten Express-Backend, der
 * Lead landet in einer echten SQLite-Datei und der Link liefert die echte
 * 4,2-MB-Datei aus der geschuetzten Ablage. Kein Mock in der Kette.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const resource = findResource(SAMPLE_BUNDLE_ASSET_ID)
if (!resource) throw new Error(`Lead-Magnet ${SAMPLE_BUNDLE_ASSET_ID} fehlt im Inventar`)
const variant = resource.variants[0]

const bundle = (locale: string, ns: string): Record<string, unknown> =>
  JSON.parse(readFileSync(`public/locales/${locale}/${ns}.json`, 'utf8')) as Record<string, unknown>

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

/**
 * Oeffnet das Gate.
 *
 * Der Klick muss die Hydration abwarten: die Karte kommt aus dem SSR, der
 * Umschalter lebt erst danach. Ein einzelner frueher Klick ging im ersten
 * Entwurf verloren und der Test lief neunzig Sekunden ins Leere. Deshalb wird
 * nur geklickt, solange das Formular NICHT offen ist — die Schleife ist damit
 * idempotent und kann das Gate nicht versehentlich wieder schliessen.
 */
async function openGate(page: Page, assetId: string) {
  const trigger = page.locator(`[data-resource-id="${assetId}"] button[data-gate-asset]`)
  await expect(trigger).toBeVisible()
  await expect(async () => {
    if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
    await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
  }).toPass({ timeout: 20_000 })
}

/** Fuellt das Gate aus und sendet ab. Gibt den Erfolgsbereich zurueck. */
async function submitGate(page: Page, email: string) {
  await page.locator('[data-gate-state="form"] input[type="text"]').first().fill('Dr. Mila Nord')
  await page.locator('[data-gate-state="form"] input[type="email"]').fill(email)
  await page.locator('[data-gate-state="form"] input[type="text"]').nth(1).fill('Praxis Nord')
  await page.locator('[data-gate-state="form"] input[type="checkbox"]').first().check()
  await page.locator('[data-gate-state="form"] button[type="submit"]').click()
  const success = page.locator('[data-gate-state="success"]')
  await expect(success).toBeVisible({ timeout: 20_000 })
  return success
}

test.describe('PT19.4 aktiver Lead-Magnet', () => {
  // Eigene Absender-IP je Suite. Der Rate Limiter zaehlt pro IP; laufen mehrere
  // Browser-Suiten hintereinander, teilen sie sonst dasselbe Budget und die
  // spaeteren Einreichungen sterben an 429 statt an der Sache. Gemessen im
  // breiten PT19.5-Lauf.
  test.use({ extraHTTPHeaders: { 'X-Forwarded-For': '203.0.113.70' } })

  test('Resource Center: gegatete Karte ohne Datei-URL, mit Gate-Kontext', async ({ page }) => {
    await page.goto('/de/downloads')

    const card = page.locator(`[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"]`)
    await expect(card).toHaveAttribute('data-resource-access', 'GATED')
    await expect(card.locator('a[href^="/downloads/"]')).toHaveCount(0)
    await expect(card.locator('[data-gate-asset]')).toHaveAttribute(
      'data-gate-asset',
      SAMPLE_BUNDLE_ASSET_ID,
    )
    await expect(card.locator('[data-gate-locale]')).toHaveAttribute('data-gate-locale', 'de')

    // Der Dateiname taucht nirgends im Markup auf.
    expect(await page.content()).not.toContain(variant.path.split('/').pop() as string)
  })

  test('vollstaendiger Pfad im Browser: Gate → Submit → geschuetzter Download', async ({
    page,
    request,
  }) => {
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)

    const success = await submitGate(page, 'browser@praxis.example')
    const link = success.locator('a[data-gate-download]')
    await expect(link).toBeVisible()

    const href = (await link.getAttribute('href')) as string
    expect(href).toContain(`/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}`)
    expect(href).not.toContain('.zip')

    // Der Link liefert die echte Datei — Groesse und Hash aus dem Inventar.
    const response = await request.get(href)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('zip')
    expect(response.headers()['cache-control']).toBe('no-store, private')
    expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow')
    const body = await response.body()
    expect(body.length).toBe(variant.bytes)
    expect(createHash('sha256').update(body).digest('hex')).toBe(variant.sha256)
  })

  test('ohne Verarbeitungs-Consent kein Download', async ({ page }) => {
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)

    await page.locator('[data-gate-state="form"] input[type="text"]').first().fill('Dr. Ohne')
    await page.locator('[data-gate-state="form"] input[type="email"]').fill('ohne@praxis.example')
    await page.locator('[data-gate-state="form"] input[type="text"]').nth(1).fill('Praxis Ohne')
    await page.locator('[data-gate-state="form"] button[type="submit"]').click()

    await expect(page.locator('[data-gate-state="success"]')).toHaveCount(0)
    await expect(page.locator('[data-gate-state="form"]')).toBeVisible()
  })

  test('Sprache: passendes und nicht passendes Locale, beide offengelegt', async ({ page }) => {
    // Deutsch — Asset und Oberflaeche stimmen ueberein.
    await page.goto('/de/downloads')
    const de = page.locator(`[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"]`)
    await expect(de).toHaveAttribute('data-language-fallback', 'false')
    expect(await de.innerText()).toContain(
      at(bundle('de', 'downloads'), 'assetLanguage.languages.de'),
    )

    // Polnisch — es gibt keine polnische Datei. Die Karte sagt es.
    await page.goto('/pl/downloads')
    const pl = page.locator(`[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"]`)
    await expect(pl).toHaveAttribute('data-language-fallback', 'true')
    await expect(pl.locator('[data-language-notice]')).toHaveText(
      at(bundle('pl', 'downloads'), 'languageNotice'),
    )
    expect(await pl.innerText()).toContain(
      at(bundle('pl', 'downloads'), 'assetLanguage.languages.de'),
    )

    // Und die Auslieferung folgt derselben Wahrheit.
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    const success = await submitGate(page, 'pl@praxis.example')
    await expect(success.locator('a[data-gate-download]')).toHaveAttribute('hreflang', 'de')
  })

  test('kein oeffentlicher Weg an dem Gate vorbei', async ({ request }) => {
    const filename = variant.path.split('/').pop() as string
    const candidates = [
      `/downloads/${variant.path}`,
      `/downloads/epigenetics/${filename}`,
      `/${variant.path}`,
      `/storage/protected/${variant.path}`,
      `/de/downloads/${filename}`,
      `/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}`,
      `/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}?e=x&t=${'y'.repeat(43)}`,
    ]
    for (const candidate of candidates) {
      const response = await request.get(candidate, { maxRedirects: 0 })
      expect(response.status(), candidate).not.toBe(200)
      const text = await response.text().catch(() => '')
      expect(text).not.toContain('PK')
    }
  })

  test('Gate x10: Titel, Consent-Texte und Absenden in allen zehn Locales', async ({ page }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}/downloads`)
      await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
      const form = page.locator('[data-gate-state="form"]')
      const text = (await form.innerText()).replace(/\s+/gu, ' ')
      const copy = bundle(locale, 'downloads')
      for (const key of [
        'gate.title',
        'gate.processingConsent',
        'gate.marketingConsent',
        'gate.submit',
      ]) {
        const expected = at(copy, key)
        expect(expected, `${locale}:${key}`).not.toBe('')
        expect(text, `${locale}:${key}`).toContain(expected)
      }
    }
  })

  test('Epigenetik-Strecke nutzt dasselbe Gate statt eines Dateilinks', async ({ page }) => {
    for (const route of ['/de/epigenetics/unterlagen', '/de/epigenetics']) {
      await page.goto(route)
      const trigger = page.locator(`[data-gate-trigger="${SAMPLE_BUNDLE_ASSET_ID}"]`)
      await expect(trigger, route).toHaveCount(1)
      await expect(trigger.locator('[data-resource-access="GATED"]')).toHaveCount(1)
      expect(await page.content(), route).not.toContain(variant.path.split('/').pop() as string)
    }
  })

  test('A11y des Gates: Axe serious/critical 0', async ({ page }) => {
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)

    // Kontrast wird im Ruhezustand geprueft, nicht mitten in der Einblendung.
    // `Reveal` legt die Deckkraft auf einen VORFAHREN der Karte, nicht auf sie
    // selbst — gemessen wurde deshalb erst eine halbtransparente Mischfarbe
    // (#91a5b6 auf #fbfcfd), die der Leser nie zu sehen bekommt. Also: alles
    // einmal einblenden lassen, dann warten, bis nichts mehr transparent ist.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForFunction(() =>
      [...document.querySelectorAll('body *')].every((node) => {
        const opacity = Number.parseFloat(getComputedStyle(node).opacity)
        return opacity === 1 || opacity === 0
      }),
    )
    await page.evaluate(() => window.scrollTo(0, 0))

    await page.addScriptTag({ path: axePath })
    const violations = await page.evaluate(async () => {
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
          (violation) =>
            `${violation.id} :: ${violation.nodes[0]?.target.join(' ')} :: ${violation.nodes[0]?.failureSummary ?? ''}`,
        )
    })
    expect(violations).toEqual([])
  })
})
