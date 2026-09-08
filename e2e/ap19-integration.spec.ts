import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import { expect, test, type Page, type APIRequestContext } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'
import { RESOURCE_INVENTORY } from '../src/content/resources/resourceInventory'
import {
  buildResourceCenter,
  LAUNCH_VISIBLE_RESOURCES,
} from '../src/content/resources/resourceCenter'
import {
  LEAD_MAGNET_CANDIDATES,
  SAMPLE_BUNDLE_ASSET_ID,
} from '../src/content/resources/leadMagnetCandidates'

/**
 * AP19 PT19.5 — breites Integrationsgate.
 *
 * Gegen den vollen Produktionsbuild und den echten Backend. Was PT19.2–PT19.4
 * je fuer sich bewiesen haben, wird hier als EIN System geprueft: zehn
 * Sprachen, freier und gegateter Pfad, Sicherheitsnegative, Missbrauch,
 * Consent, SEO, A11y, Responsive und Performance.
 */

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const providerPattern =
  /(?:www\.googletagmanager\.com|(?:region1\.)?google-analytics\.com|stats\.g\.doubleclick\.net)/u
const previewHostPattern = /preview\.polarisdx\.net|127\.0\.0\.1|localhost/u

const gatedResource = RESOURCE_INVENTORY.find((r) => r.id === SAMPLE_BUNDLE_ASSET_ID)
if (!gatedResource) throw new Error('Aktiver Lead-Magnet fehlt im Inventar')
const gatedVariant = gatedResource.variants[0]
const freeResources = LAUNCH_VISIBLE_RESOURCES.filter((r) => r.deliveryClass === 'FREE_PUBLIC')

const bundle = (locale: string, ns: string): Record<string, unknown> =>
  JSON.parse(readFileSync(`public/locales/${locale}/${ns}.json`, 'utf8')) as Record<string, unknown>

const at = (source: unknown, pointer: string): string => {
  const value = pointer
    .replace(/\[(\d+)\]/gu, '.$1')
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

const translate = (locale: string, key: string): string => {
  const [ns, pointer] = key.includes(':') ? key.split(/:(.+)/u) : ['downloads', key]
  return at(bundle(locale, ns), pointer)
}

/** Idempotent: klickt nur, solange das Gate zu ist (SSR/Hydration-Rennen). */
async function openGate(page: Page, assetId: string) {
  const trigger = page.locator(`[data-resource-id="${assetId}"] button[data-gate-asset]`)
  await expect(trigger).toBeVisible()
  await expect(async () => {
    if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
    await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
  }).toPass({ timeout: 20_000 })
}

async function submitGate(page: Page, email: string, marketing = false) {
  await page.locator('[data-gate-state="form"] input[type="text"]').first().fill('Dr. Mila Nord')
  await page.locator('[data-gate-state="form"] input[type="email"]').fill(email)
  await page.locator('[data-gate-state="form"] input[type="text"]').nth(1).fill('Praxis Nord')
  const boxes = page.locator('[data-gate-state="form"] input[type="checkbox"]')
  await boxes.first().check()
  if (marketing) await boxes.nth(1).check()
  await page.locator('[data-gate-state="form"] button[type="submit"]').click()
  const success = page.locator('[data-gate-state="success"]')
  await expect(success).toBeVisible({ timeout: 20_000 })
  return success
}

/**
 * Wartet, bis nichts mehr halbtransparent ist.
 *
 * `Reveal` blendet Karten beim Hereinscrollen ein und legt die Deckkraft auf
 * einen VORFAHREN der Karte. Misst axe waehrenddessen, bekommt es eine
 * Mischfarbe (gemessen: #8da1b3 auf #fbfcfd), die der Leser nie zu sehen
 * bekommt. Beide Scrollpositionen werden abgewartet, weil das Zurueckspringen
 * nach oben weitere Einblendungen ausloest.
 */
async function settleAnimations(page: Page) {
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
  // Zweite Bestaetigung: eine Einblendung, die genau jetzt startet, wuerde die
  // erste Pruefung sonst passieren lassen.
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
        (violation) =>
          `${violation.id} :: ${violation.nodes[0]?.target.join(' ')} :: ${violation.nodes[0]?.failureSummary ?? ''}`,
      )
  })
}

const submit = (request: APIRequestContext, payload: unknown, key: string, ip = '198.51.100.1') =>
  request.post('/api/content-download', {
    headers: { 'Idempotency-Key': key, 'X-Forwarded-For': ip },
    data: payload,
  })

const gateBody = (overrides: Record<string, unknown> = {}) => ({
  name: 'Dr. Mila Nord',
  email: 'api@praxis.example',
  organization: 'Praxis Nord',
  locale: 'de',
  assetId: SAMPLE_BUNDLE_ASSET_ID,
  source: 'resource-center',
  originRoute: '/de/downloads',
  processingConsent: true,
  consentAcceptedAt: '2026-09-02T09:00:00.000Z',
  ...overrides,
})

test.describe('AP19 PT19.5 Integrationsgate', () => {
  // Eigene Absender-IP je Suite. Der Rate Limiter zaehlt pro IP; laufen mehrere
  // Browser-Suiten hintereinander, teilen sie sonst dasselbe Budget und die
  // spaeteren Einreichungen sterben an 429 statt an der Sache. Gemessen im
  // breiten PT19.5-Lauf.
  test.use({ extraHTTPHeaders: { 'X-Forwarded-For': '203.0.113.80' } })

  // ------------------------------------------------------------------ x10 UI
  test('Resource Center x10: HTTP 200, echte Kategorien, keine Vorschau-Hosts', async ({
    request,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const response = await request.get(`/${locale}/downloads`, { maxRedirects: 0 })
      expect(response.status(), locale).toBe(200)
      const html = await response.text()

      const groups = buildResourceCenter(locale)
      for (const group of groups) {
        expect(group.cards.length, `${locale}/${group.id}`).toBeGreaterThan(0)
        expect(html, `${locale}/${group.id}`).toContain(`resource-group-${group.id}`)
      }
      for (const resource of LAUNCH_VISIBLE_RESOURCES) {
        expect(html, `${locale}/${resource.id}`).toContain(`data-resource-id="${resource.id}"`)
      }
      // Kein Rest aus einer anderen Sprache und kein Vorschau-Host im SSR.
      expect(previewHostPattern.test(html), locale).toBe(false)
    }
    // `/downloads` ohne Praefix ist ein 301 auf die Default-Sprache.
    const bare = await request.get('/downloads', { maxRedirects: 0 })
    expect(bare.status()).toBe(301)
    expect(bare.headers().location).toBe('/de/downloads')
  })

  test('Asset-Sprachmatrix x10: kein stiller Fallback, jede Abweichung offengelegt', async ({
    page,
  }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      await page.goto(`/${locale}/downloads`)
      for (const card of buildResourceCenter(locale).flatMap((group) => group.cards)) {
        const node = page.locator(`[data-resource-id="${card.resource.id}"]`)

        // Erwartung aus dem Inventar, nicht aus der Seite.
        const expected =
          locale === 'de'
            ? 'de'
            : card.resource.variants.some((variant) => variant.language === 'en')
              ? 'en'
              : 'de'
        expect(card.variant.language, `${locale}/${card.resource.id}`).toBe(expected)

        await expect(node.locator('[data-resource-language]')).toHaveAttribute(
          'data-resource-language',
          expected,
        )
        const disclose = locale !== 'de' && expected !== 'en'
        await expect(node).toHaveAttribute('data-language-fallback', String(disclose))
        await expect(node.locator('[data-language-notice]')).toHaveCount(disclose ? 1 : 0)
        if (disclose) {
          expect(await node.innerText()).toContain(
            translate(locale, `assetLanguage.languages.${expected}`),
          )
        }
      }
    }
  })

  // ------------------------------------------------------------------- FREE
  test('FREE E2E: jede freie Ressource liefert die richtige Datei ohne Gate', async ({
    page,
    request,
  }) => {
    await page.goto('/de/downloads')
    const cards = buildResourceCenter('de')
      .flatMap((group) => group.cards)
      .filter((card) => card.resource.deliveryClass === 'FREE_PUBLIC')
    expect(cards).toHaveLength(freeResources.length)

    for (const card of cards) {
      const link = page.locator(`[data-resource-id="${card.resource.id}"] a[href^="/downloads/"]`)
      await expect(link, card.resource.id).toHaveCount(1)
      await expect(link).toHaveAttribute('hreflang', card.variant.language)
      // Kein Gate vor einer freien Ressource.
      await expect(
        page.locator(`[data-resource-id="${card.resource.id}"] [data-gate-asset]`),
      ).toHaveCount(0)

      const response = await request.get(card.href as string, { maxRedirects: 0 })
      expect(response.status(), card.href as string).toBe(200)
      expect(response.headers()['content-type']).toContain(
        card.variant.mime === 'application/zip' ? 'zip' : 'pdf',
      )
      const body = await response.body()
      expect(body.length, card.resource.id).toBe(card.variant.bytes)
      expect(createHash('sha256').update(body).digest('hex'), card.resource.id).toBe(
        card.variant.sha256,
      )
      // Der Dateiname bleibt der aus dem Inventar.
      expect(decodeURIComponent(card.href as string)).toBe(`/downloads/${card.variant.path}`)
    }
  })

  // ------------------------------------------------------------------ GATED
  test('GATED E2E: Gate → Persistenz → CRM → Entitlement → echte Datei', async ({
    page,
    request,
  }) => {
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    const success = await submitGate(page, 'integration@praxis.example', true)

    const href = (await success.locator('a[data-gate-download]').getAttribute('href')) as string
    expect(href).toContain(`/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}`)
    expect(href).not.toContain('.zip')

    const response = await request.get(href)
    expect(response.status()).toBe(200)
    const body = await response.body()
    expect(body.length).toBe(gatedVariant.bytes)
    expect(createHash('sha256').update(body).digest('hex')).toBe(gatedVariant.sha256)
    expect(response.headers()['content-disposition']).toContain('attachment')
    expect(response.headers()['cache-control']).toBe('no-store, private')
    expect(response.headers()['x-robots-tag']).toBe('noindex, nofollow')
    expect(response.headers()['referrer-policy']).toBe('no-referrer')
    expect(response.headers()['x-content-type-options']).toBe('nosniff')
  })

  // ----------------------------------------------------- Sicherheitsnegative
  test('Sicherheitsnegative: unbekannt, Bypass, Traversal, Token-Manipulation', async ({
    request,
  }) => {
    const accepted = await submit(
      request,
      gateBody({ email: 'neg@praxis.example' }),
      'pt195-neg',
      '198.51.100.10',
    )
    expect(accepted.status()).toBe(202)
    const url = new URL(
      ((await accepted.json()) as { downloadUrl: string }).downloadUrl,
      'http://x',
    )
    const entitlementId = url.searchParams.get('e') as string
    const token = url.searchParams.get('t') as string

    // Oeffentliche Umgehung.
    for (const candidate of [
      `/downloads/${gatedVariant.path}`,
      `/downloads/epigenetics/${gatedVariant.path.split('/').pop()}`,
      `/storage/protected/${gatedVariant.path}`,
      `/${gatedVariant.path}`,
    ]) {
      const response = await request.get(candidate, { maxRedirects: 0 })
      expect(response.status(), candidate).not.toBe(200)
    }

    // Traversal, kodiert und unkodiert, sowie Token-Manipulation.
    const base = '/api/content-download/asset'
    for (const [pathname, expected] of [
      [`${base}/${encodeURIComponent('../../etc/passwd')}?e=${entitlementId}&t=${token}`, 403],
      [`${base}/${encodeURIComponent('%2e%2e%2fetc%2fpasswd')}?e=${entitlementId}&t=${token}`, 403],
      [`${base}/rsc-epi-001?e=${entitlementId}&t=${token}`, 403],
      [`${base}/rsc-gibt-es-nicht?e=${entitlementId}&t=${token}`, 403],
      [`${base}/${SAMPLE_BUNDLE_ASSET_ID}?e=${entitlementId}&t=${'x'.repeat(43)}`, 403],
      [`${base}/${SAMPLE_BUNDLE_ASSET_ID}?e=nope&t=${token}`, 403],
      [`${base}/${SAMPLE_BUNDLE_ASSET_ID}`, 403],
    ] as Array<[string, number]>) {
      const response = await request.get(pathname, { maxRedirects: 0 })
      expect(response.status(), pathname).toBe(expected)
      const text = await response.text()
      expect(text).not.toContain('PK')
      expect(text, pathname).not.toContain(gatedVariant.path)
    }

    // Fehlerhafte Anfragen am Gate. Jede bekommt eine eigene Absender-IP: der
    // Limiter laesst fuenf Einreichungen je IP zu und raeumte im ersten Lauf
    // die letzten Faelle mit 429 ab, statt sie zu pruefen.
    const malformed: Array<[unknown, string]> = [
      [gateBody({ email: 'keine-mail' }), 'VALIDATION_FAILED'],
      [gateBody({ processingConsent: false }), 'PROCESSING_CONSENT_REQUIRED'],
      [gateBody({ consentAcceptedAt: 'gestern' }), 'INVALID_CONSENT_EVIDENCE'],
      [gateBody({ assetId: '../../etc/passwd' }), 'UNKNOWN_ASSET'],
      [gateBody({ assetId: 'rsc-epi-001' }), 'ASSET_NOT_GATED'],
      [{}, 'IDEMPOTENCY_KEY_REQUIRED'],
    ]
    for (const [index, [payload, code]] of malformed.entries()) {
      const response = await submit(
        request,
        payload,
        code === 'IDEMPOTENCY_KEY_REQUIRED' ? '' : `pt195-bad-${index}`,
        `198.51.100.${20 + index}`,
      )
      expect(response.status(), code).toBe(400)
      expect(((await response.json()) as { code: string }).code, code).toBe(code)
    }
  })

  test('Missbrauch: Doppel-Submit, Replay, Honeypot, Rate Limit', async ({ request }) => {
    const key = 'pt195-double'
    const first = await submit(
      request,
      gateBody({ email: 'dbl@praxis.example' }),
      key,
      '198.51.100.2',
    )
    const second = await submit(
      request,
      gateBody({ email: 'dbl@praxis.example' }),
      key,
      '198.51.100.2',
    )
    expect(first.status()).toBe(202)
    expect(second.status()).toBe(202)
    const a = (await first.json()) as { leadId: string; entitlementId: string }
    const b = (await second.json()) as { leadId: string; entitlementId: string }
    expect(b.leadId).toBe(a.leadId)
    expect(b.entitlementId).toBe(a.entitlementId)

    // Replay mit gleichem Key, anderem Inhalt.
    const conflict = await submit(
      request,
      gateBody({ email: 'dbl@praxis.example', organization: 'Andere' }),
      key,
      '198.51.100.2',
    )
    expect(conflict.status()).toBe(409)

    // Honeypot: angenommen, aber ohne Vorgang.
    const honeypot = await submit(
      request,
      gateBody({ email: 'bot@praxis.example', _hp: 'bot' }),
      'pt195-hp',
      '198.51.100.3',
    )
    expect(honeypot.status()).toBe(200)
    expect(await honeypot.json()).toEqual({ accepted: true })

    // Rate Limit auf einer eigenen IP.
    const statuses: number[] = []
    for (let attempt = 0; attempt < 12; attempt += 1) {
      statuses.push(
        (
          await submit(
            request,
            gateBody({ email: `rate${attempt}@praxis.example` }),
            `pt195-rate-${attempt}`,
            '198.51.100.99',
          )
        ).status(),
      )
    }
    expect(statuses).toContain(429)
  })

  // ------------------------------------------------------- Consent / Netzwerk
  test('Consent: der Ablauf funktioniert ohne Analytics, Provider-Requests = 0', async ({
    page,
  }) => {
    const providerRequests: string[] = []
    const assetRequests: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (providerPattern.test(url)) providerRequests.push(url)
      if (/\.(?:pdf|zip)(?:$|\?)/iu.test(url)) assetRequests.push(url)
    })

    await page.goto('/de/downloads')
    await page.waitForLoadState('networkidle')
    // Vor jeder Einwilligung: keine Nutzlast, kein Provider.
    expect(assetRequests).toEqual([])
    expect(providerRequests).toEqual([])

    // Und der Geschaeftsvorgang laeuft trotzdem vollstaendig durch.
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    await submitGate(page, 'consent@praxis.example')
    expect(providerRequests).toEqual([])
  })

  // ------------------------------------------------------------------- SEO
  test('SEO: Resource Center x10 indexierbar, geschuetzte URLs nicht', async ({ request }) => {
    for (const locale of SUPPORTED_LANGUAGES) {
      const html = await (await request.get(`/${locale}/downloads`)).text()
      expect(html).toContain(`rel="canonical" href="https://polarisdx.net/${locale}/downloads"`)
      for (const other of SUPPORTED_LANGUAGES) {
        expect(html).toContain(
          `hrefLang="${other}" href="https://polarisdx.net/${other}/downloads"`,
        )
      }
      expect(html).toContain('hrefLang="x-default" href="https://polarisdx.net/de/downloads"')
      expect(html).toContain(translate(locale, 'downloads:seo.title'))
    }

    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(sitemap).toContain(`https://polarisdx.net/${locale}/downloads`)
    }
    // Geschuetzte Auslieferung gehoert weder in die Sitemap noch in die Suche.
    expect(sitemap).not.toContain('/api/content-download')
    expect(sitemap).not.toContain(gatedVariant.path)

    const robots = await (await request.get('/robots.txt')).text()
    expect(robots).not.toContain(gatedVariant.path)
  })

  // ------------------------------------------------------------------ A11y
  test('A11y: Resource Center, geoeffnetes Gate und Erfolgsansicht', async ({ page }) => {
    await page.goto('/de/downloads')
    await settleAnimations(page)
    expect(await axeFindings(page), 'Resource Center').toEqual([])

    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    await settleAnimations(page)
    expect(await axeFindings(page), 'geoeffnetes Gate').toEqual([])

    // Tastatur: erster Download-Link und das Gate sind erreichbar.
    const firstLink = page.locator('[data-resource-id] a[href^="/downloads/"]').first()
    await firstLink.focus()
    await expect(firstLink).toBeFocused()

    await submitGate(page, 'a11y@praxis.example')
    await settleAnimations(page)
    expect(await axeFindings(page), 'Erfolgsansicht').toEqual([])
    const download = page.locator('[data-gate-download]')
    await download.focus()
    await expect(download).toBeFocused()
  })

  test('A11y: Fehlerzustand des Gates bleibt lesbar und angekuendigt', async ({ page }) => {
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    // Serverseitig abgelehnter Consent — der Fehlerpfad, nicht der Erfolgspfad.
    await page.locator('[data-gate-state="form"] input[type="text"]').first().fill('Dr. Ohne')
    await page.locator('[data-gate-state="form"] input[type="email"]').fill('fehler@praxis.example')
    await page.locator('[data-gate-state="form"] input[type="text"]').nth(1).fill('Praxis Ohne')
    await page.locator('[data-gate-state="form"] button[type="submit"]').click()

    await expect(page.locator('[data-gate-state="success"]')).toHaveCount(0)
    await expect(page.locator('[data-gate-state="form"]')).toBeVisible()
    await settleAnimations(page)
    expect(await axeFindings(page), 'Fehlerzustand').toEqual([])
  })

  // ------------------------------------------------------------- Responsive
  test('Responsive: 390/768/1440 in kurzen und langen Locales, Gate offen', async ({ page }) => {
    // `cs` und `pl` tragen die laengsten Consent-Saetze.
    for (const locale of ['de', 'cs', 'pl']) {
      for (const width of [390, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(`/${locale}/downloads`)
        await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflow, `${locale} @ ${width}px`).toBeLessThanOrEqual(0)
      }
    }
  })

  // ------------------------------------------------------------ Performance
  test('Performance: keine eager Nutzlast, kein neues Provider-SDK', async ({ page, request }) => {
    const heavy: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (/\.(?:pdf|zip)(?:$|\?)/iu.test(url) || providerPattern.test(url)) heavy.push(url)
    })
    await page.goto('/de/downloads')
    await openGate(page, SAMPLE_BUNDLE_ASSET_ID)
    await page.waitForLoadState('networkidle')
    expect(heavy).toEqual([])

    // Das SSR-Dokument bleibt leichtgewichtig: es traegt Metadaten, keine Assets.
    const html = await (await request.get('/de/downloads')).text()
    expect(html).not.toContain('base64,')
    expect(html.length).toBeLessThan(400_000)
  })

  // --------------------------------------------------------- Kandidatenmatrix
  test('Kandidatenmatrix deckt sich mit dem ausgelieferten System', async ({ page }) => {
    await page.goto('/de/downloads')
    for (const candidate of LEAD_MAGNET_CANDIDATES) {
      if (!candidate.assetId) continue
      const resource = RESOURCE_INVENTORY.find((entry) => entry.id === candidate.assetId)
      expect(resource, candidate.key).toBeTruthy()
      if (candidate.status !== 'GATED_LAUNCH_ACTIVE') continue

      const card = page.locator(`[data-resource-id="${candidate.assetId}"]`)
      await expect(card).toHaveAttribute('data-resource-access', 'GATED')
      await expect(card.locator('a[href^="/downloads/"]')).toHaveCount(0)
    }
    // Genau ein aktiver gegateter Kandidat, und er ist im DOM auch der einzige.
    expect(await page.locator('li[data-resource-access="GATED"]').count()).toBe(
      LAUNCH_VISIBLE_RESOURCES.filter((r) => r.deliveryClass === 'GATED').length,
    )
  })
})
