import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test, type BrowserContext, type Page } from '@playwright/test'

import {
  buildContentSecurityPolicy,
  CSP_THIRD_PARTY_SOURCES,
} from '../src/security/contentSecurityPolicy'
import { SAMPLE_BUNDLE_ASSET_ID } from '../src/content/resources/leadMagnetCandidates'
import { GTM_TEST_CONTAINER, PROVIDER_CACHE_DIR } from './pt26.2.config'

/**
 * AP26 PT26.2 — die Zielpolicy im Browser, durchgesetzt.
 *
 * Beweislast: ein Verstoss zeigt sich nur im Browser (`securitypolicyviolation`, Konsole).
 * Externe Anfragen werden protokolliert und abgebrochen; im Zustimmungsfall laufen der
 * veroeffentlichte Container und sein Google-Tag aus einer lokalen Kopie, damit gemessen wird,
 * was sie unter der Policy tatsaechlich anfragen — ohne dass ein Collect Google erreicht.
 */

const PROVIDER_DIR = fileURLToPath(new URL(PROVIDER_CACHE_DIR, import.meta.url))
const PRODUCTION_CONTAINER = 'GTM-TW6JFX7K'
const PRODUCTION_MEASUREMENT_ID = 'G-PLZNWGKW0P'
const providerFile = (name: string) => path.join(PROVIDER_DIR, name)
const PROVIDER_FILES = {
  gtm: {
    file: `gtm-${PRODUCTION_CONTAINER}.js`,
    url: `https://www.googletagmanager.com/gtm.js?id=${PRODUCTION_CONTAINER}`,
  },
  gtag: {
    file: `gtag-${PRODUCTION_MEASUREMENT_ID}.js`,
    url: `https://www.googletagmanager.com/gtag/js?id=${PRODUCTION_MEASUREMENT_ID}&l=dataLayer&cx=c`,
  },
}

const ROUTES = [
  '/de/',
  '/en/',
  '/pl/',
  '/de/contact',
  '/de/support',
  '/de/downloads',
  '/de/consumer/inside-out-duo',
  '/de/consumer/vitamin-d3-spray',
  '/de/epigenetics',
  '/de/epigenetics/musterbefund/metabolic-health',
  '/de/epigenetics/musterbefund/telomer-analyse',
  '/de/diagnostics',
  '/de/about',
  '/de/imprint',
  '/de/articles',
  '/de/events',
  '/de/gibt-es-nicht-pt262',
]

interface Capture {
  violations: string[]
  pageErrors: string[]
  external: string[]
}

/** Verstoesse, Seitenfehler und externe Ziele eines Kontexts mitschreiben. */
async function capture(context: BrowserContext, page: Page, grant = false): Promise<Capture> {
  const result: Capture = { violations: [], pageErrors: [], external: [] }
  await page.exposeFunction('__pt262Violation', (entry: string) => result.violations.push(entry))
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      const report = (window as unknown as { __pt262Violation: (entry: string) => void })
        .__pt262Violation
      report(`${event.effectiveDirective} ${event.blockedURI} @ ${location.pathname}`)
    })
  })
  page.on('console', (message) => {
    if (/Content Security Policy/i.test(message.text())) {
      result.violations.push(`console: ${message.text().slice(0, 160)}`)
    }
  })
  page.on('pageerror', (error) => result.pageErrors.push(error.message))
  await context.route(/^https?:\/\/(?!127\.0\.0\.1[:/])/, async (route) => {
    const url = route.request().url()
    result.external.push(url)
    if (grant && url.startsWith('https://www.googletagmanager.com/gtm.js')) {
      return route.fulfill({
        contentType: 'application/javascript',
        body: fs.readFileSync(providerFile(PROVIDER_FILES.gtm.file)),
      })
    }
    if (grant && url.startsWith('https://www.googletagmanager.com/gtag/js')) {
      return route.fulfill({
        contentType: 'application/javascript',
        body: fs.readFileSync(providerFile(PROVIDER_FILES.gtag.file)),
      })
    }
    return route.abort()
  })
  return result
}

async function visit(page: Page, routePath: string) {
  const response = await page.goto(routePath, { waitUntil: 'networkidle' })
  // Scrollen loest Reveal-Animationen, Lazy-Bilder und Kapitelnavigation aus.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
  })
  await page.waitForTimeout(250)
  return response
}

const origin = (url: string) => new URL(url).origin

// =============================================================================

test.describe('PT26.2 · Header', () => {
  test('durchgesetzte Policy auf SSR, 404, Redirect, API und Fehlerpfad — ohne Report-Only und ohne Empfaenger', async ({
    request,
  }) => {
    const page = await request.get('/de/')
    expect(page.status()).toBe(200)
    const html = await page.text()
    const inline = html.match(/<style data-inline-stylesheet="[^"]+">([\s\S]*?)<\/style>/)
    expect(inline, 'inline ausgeliefertes App-CSS (PT25.4)').not.toBeNull()
    const hash = createHash('sha256').update(inline![1], 'utf8').digest('base64')
    const headers = page.headersArray()
    expect(headers.filter((h) => /^content-security-policy$/i.test(h.name))).toHaveLength(1)
    expect(headers.filter((h) => /report-only/i.test(h.name))).toHaveLength(0)
    expect(page.headers()['content-security-policy']).toBe(
      buildContentSecurityPolicy({ styleHashes: [hash] }),
    )
    expect(page.headers()['content-security-policy']).not.toMatch(/report-uri|report-to/)

    const notFound = await request.get('/de/gibt-es-nicht-pt262')
    expect(notFound.status()).toBe(404)
    expect(notFound.headers()['content-security-policy']).toBe(
      buildContentSecurityPolicy({ styleHashes: [hash] }),
    )

    const base = buildContentSecurityPolicy()
    const redirect = await request.get('/', { maxRedirects: 0 })
    expect(redirect.status()).toBe(301)
    expect(redirect.headers()['content-security-policy']).toBe(base)

    const apiNotFound = await request.get('/api/pt262-unbekannt')
    expect(apiNotFound.status()).toBe(404)
    expect(apiNotFound.headers()['content-security-policy']).toBe(base)

    const brokenJson = await request.post('/api/contact', {
      headers: { 'Content-Type': 'application/json' },
      data: '{"kaputt":',
    })
    expect(brokenJson.status()).toBe(400)
    expect(brokenJson.headers()['content-security-policy']).toBe(base)
    expect(await brokenJson.text()).not.toMatch(/at .*\.js:\d+|node_modules|\/home\//)

    for (const res of [page, notFound, redirect, apiNotFound, brokenJson]) {
      expect(res.headers()['content-security-policy-report-only']).toBeUndefined()
    }
  })
})

test.describe('PT26.2 · Laufzeit vor der Einwilligung', () => {
  test('repraesentative Routen: 0 CSP-Verstoesse, 0 Seitenfehler, 0 externe Anfragen', async ({
    context,
    page,
  }) => {
    const seen = await capture(context, page)
    for (const routePath of ROUTES) {
      const response = await visit(page, routePath)
      expect(response?.headers()['content-security-policy'], routePath).toBeTruthy()
    }
    expect(seen.violations, seen.violations.join('\n')).toEqual([])
    expect(seen.pageErrors, seen.pageErrors.join('\n')).toEqual([])
    expect(seen.external, seen.external.join('\n')).toEqual([])
  })

  test('Formular, Honeypot, Gate-Anfrage und Download-Zustellung laufen unter der Policy', async ({
    context,
    page,
  }) => {
    const seen = await capture(context, page)

    await page.goto('/de/contact', { waitUntil: 'networkidle' })
    // Der Honeypot wird per SSR-`style`-Attribut versteckt — unter einer Policy ohne
    // `style-src-attr` stuende er sichtbar im Formular.
    const honeypotLeft = await page.evaluate(() => {
      const hidden = [...document.querySelectorAll<HTMLElement>('form [style]')].find((el) =>
        el.getAttribute('style')?.includes('-10000px'),
      )
      return hidden ? getComputedStyle(hidden).left : null
    })
    expect(honeypotLeft).toBe('-10000px')
    await page.locator('#name').fill('PT26.2 Praxis')
    await page.locator('#email').fill('pt262@praxis.example')
    await page.getByRole('button', { name: 'Dental' }).first().click()
    await page.locator('#requirements').fill('PT26.2: synthetische Anfrage unter CSP.')
    await page.locator('#consent').check()
    await page.getByRole('button', { name: 'Angebot anfragen' }).last().click()
    await expect(page.locator('form [role="status"]')).toBeVisible({ timeout: 15_000 })

    await page.goto('/de/downloads', { waitUntil: 'networkidle' })
    const trigger = page.locator(
      `[data-resource-id="${SAMPLE_BUNDLE_ASSET_ID}"] button[data-gate-asset]`,
    )
    await expect(async () => {
      if ((await page.locator('[data-gate-state]').count()) === 0) await trigger.click()
      await expect(page.locator('[data-gate-state="form"]')).toBeVisible({ timeout: 500 })
    }).toPass({ timeout: 20_000 })
    const gate = page.locator('[data-gate-state="form"]')
    await gate.locator('input[type="text"]').first().fill('Dr. PT Zweisechs')
    await gate.locator('input[type="email"]').fill('pt262-gate@praxis.example')
    await gate.locator('input[type="text"]').nth(1).fill('Praxis PT26.2')
    await gate.locator('input[type="checkbox"]').first().check()
    const gateResponse = page.waitForResponse(
      (response) =>
        response.url().endsWith('/api/content-download') && response.request().method() === 'POST',
    )
    await gate.locator('button[type="submit"]').click()
    const answered = await gateResponse
    expect(answered.status()).toBe(202)
    // Die Antwort traegt einen Download-Token: nie ausgeben, nur weiterreichen.
    const answer = (await answered.json()) as { data?: { downloadUrl?: string } }
    const downloadUrl = answer.data?.downloadUrl ?? ''
    expect(downloadUrl.startsWith(`/api/content-download/asset/${SAMPLE_BUNDLE_ASSET_ID}?`)).toBe(
      true,
    )
    // SEC-20 (in PT26.2 gefunden, in PT26.3 behoben): die Oberflaeche liest das Envelope und
    // zeigt den Erfolgszustand. Zusaetzlich wird der Zustellweg selbst gemessen, genau wie
    // `onDownload` ihn geht: same-origin fetch → Blob-URL → Anker-Klick.
    await expect(page.locator('[data-gate-state="success"]')).toBeVisible({ timeout: 20_000 })
    const gatedDownload = page.waitForEvent('download')
    const delivered = await page.evaluate(async (url) => {
      const response = await fetch(url, { credentials: 'same-origin' })
      if (!response.ok) return response.status
      const objectUrl = URL.createObjectURL(await response.blob())
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = ''
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      return response.status
    }, downloadUrl)
    expect(delivered).toBe(200)
    await gatedDownload

    // Offene Ressource: selbstgehostete PDF hinter einem relativen Link. Chromium zeigt PDFs an
    // statt sie herunterzuladen; gemessen wird deshalb der Abruf aus der Seite unter der Policy.
    const publicHref = await page
      .locator('a[href$="00_Portfolio_Uebersicht_PolarisDX.pdf"]')
      .first()
      .getAttribute('href')
    expect(publicHref).toMatch(/^\/downloads\//)
    const publicFile = await page.evaluate(async (href) => {
      const response = await fetch(href)
      return `${response.status} ${response.headers.get('content-type')}`
    }, publicHref as string)
    expect(publicFile).toBe('200 application/pdf')

    await visit(page, '/de/consumer/vitamin-d3-spray')
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible()

    expect(seen.violations, seen.violations.join('\n')).toEqual([])
    expect(seen.pageErrors, seen.pageErrors.join('\n')).toEqual([])
    expect(seen.external, seen.external.join('\n')).toEqual([])
  })
})

test.describe('PT26.2 · Consent-Netz unter der Policy', () => {
  test('Ablehnung: kein Provider, kein Verstoss — auch nach Reload und Navigation', async ({
    context,
    page,
  }) => {
    const seen = await capture(context, page)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    await page.getByRole('button', { name: /nur notwendige/i }).click()
    await page.reload({ waitUntil: 'networkidle' })
    await visit(page, '/de/contact')
    await visit(page, '/de/consumer/inside-out-duo')
    expect(seen.external, seen.external.join('\n')).toEqual([])
    expect(seen.violations, seen.violations.join('\n')).toEqual([])
  })

  test('Zustimmung: der veroeffentlichte Container laeuft ohne Verstoss, alle Ziele stehen in der Allowlist', async ({
    context,
    page,
  }) => {
    // Einmal lesend abrufen, falls die lokale Kopie fehlt (oeffentliche Skripte, kein Collect).
    fs.mkdirSync(PROVIDER_DIR, { recursive: true })
    for (const { file, url } of Object.values(PROVIDER_FILES)) {
      if (fs.existsSync(providerFile(file))) continue
      const response = await fetch(url)
      expect(response.status, url).toBe(200)
      fs.writeFileSync(providerFile(file), Buffer.from(await response.arrayBuffer()))
    }

    const seen = await capture(context, page, true)
    await page.goto('/de/', { waitUntil: 'networkidle' })
    expect(seen.external).toEqual([])
    await page.getByRole('button', { name: /alle akzeptieren/i }).click()
    await expect
      .poll(() => seen.external.filter((url) => /\/g\/collect/.test(url)).length, {
        timeout: 15_000,
      })
      .toBeGreaterThan(0)
    await visit(page, '/de/contact')
    await page.waitForTimeout(1500)

    const gtm = seen.external.filter((url) => url.includes('googletagmanager.com/gtm.js'))
    expect(gtm[0]).toContain(`id=${GTM_TEST_CONTAINER}`)
    expect(seen.external.some((url) => url.includes('googletagmanager.com/gtag/js'))).toBe(true)

    const allowed = new Set(CSP_THIRD_PARTY_SOURCES.map((source) => source.origin))
    const origins = [...new Set(seen.external.map(origin))].sort()
    expect(origins.filter((o) => !allowed.has(o))).toEqual([])
    // Jede Allowlist-Origin wurde tatsaechlich gebraucht — kein Eintrag ohne Verwender.
    expect(origins).toEqual([...allowed].sort())
    // Gewollt blockiert (SECURITY-CONTRACT §8.4): der gesampelte Diagnose-Beacon des Google-Tags
    // (`www.googletagmanager.com/a?…` als Bild). Er feuert nicht in jedem Lauf; ohne ihn bleibt die
    // Erfassung vollstaendig. Jeder andere Verstoss ist ein Befund.
    const diagnosticBeacon =
      /^(img-src https:\/\/www\.googletagmanager\.com\/a\?|console: Loading the image 'https:\/\/www\.googletagmanager\.com\/a\?)/
    const unexpected = seen.violations.filter((entry) => !diagnosticBeacon.test(entry))
    expect(unexpected, unexpected.join('\n')).toEqual([])
    expect(seen.pageErrors, seen.pageErrors.join('\n')).toEqual([])
  })
})
