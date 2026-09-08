import { expect, test } from '@playwright/test'
import { services } from '../src/data/services'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

for (const serviceId of ['dental', 'beauty', 'kompatibilitaet-integration'] as const) {
  test(`PT13.1 ${serviceId} uses the common template with canonical semantics`, async ({
    page,
  }) => {
    const response = await page.goto(`/de/diagnostics/${serviceId}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('[data-service-detail-template="v1"]')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.getByRole('navigation', { name: 'Breadcrumb' })).toHaveCount(1)

    const actions = page.locator('[data-cta-intent="GENERAL_SALES"][data-service-family]')
    await expect(actions).toHaveCount(2)
    for (let index = 0; index < 2; index += 1) {
      await expect(actions.nth(index)).toHaveAttribute(
        'href',
        '/de/contact?intent=quote#kontaktformular',
      )
      await expect(actions.nth(index)).toHaveAttribute('data-service-family', serviceId)
      await expect(actions.nth(index)).toHaveAttribute('data-cta-journey', 'general_sales')
    }

    const canonical = page.locator('link[rel="canonical"]')
    await expect(canonical).toHaveAttribute(
      'href',
      `https://polarisdx.net/de/diagnostics/${serviceId}`,
    )
    expect(await page.locator('a[href*="/services/"]').count()).toBe(0)
  })
}

test('PT13.10 all families use normalized slots', async ({ page }) => {
  await page.goto('/de/diagnostics/dental')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Diagnostische Informationen im Dental-Workflow' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/beauty')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Messwerte fachlich statt kosmetisch einordnen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/longevity')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Verläufe beobachten, ohne Outcomes zu versprechen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/poc-systemloesungen')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Mehr als ein einzelnes Analysegerät' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/praeventions-checks')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Fragestellung vor Check-Paket' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/infektion-entzuendung')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Ein Marker ist keine Diagnose' })).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/stoffwechsel-herz')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Messwerte beantworten unterschiedliche Fragen' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/hormon-tests')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', { name: 'Hormondiagnostik braucht Kontext und klare Zuständigkeit' }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)

  await page.goto('/de/diagnostics/kompatibilitaet-integration')
  await expect(page.locator('.rich-content')).toHaveCount(0)
  await expect(
    page.getByRole('heading', {
      name: 'Integration beginnt mit einer belegten Systemkombination',
    }),
  ).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
})

test('PT13.1 visible FAQ and FAQPage schema stay in parity', async ({ page }) => {
  await page.goto('/fr/diagnostics/beauty')
  const visibleQuestions = await page.locator('#faq button[aria-controls]').allTextContents()
  expect(visibleQuestions.length).toBeGreaterThan(0)

  const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
  const parsed = schemas.flatMap((schema) => {
    const value = JSON.parse(schema)
    return Array.isArray(value) ? value : [value]
  })
  const faq = parsed.find((schema) => schema['@type'] === 'FAQPage')
  expect(faq).toBeDefined()
  expect(faq.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(
    visibleQuestions.map((question) => question.trim()),
  )
  expect(JSON.stringify(parsed)).not.toMatch(/"@type":"(?:Product|Offer|Rating|Review)"/)
})

test('PT13.1 one real family renders through the same template in all ten locales', async ({
  request,
}) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    const response = await request.get(`/${locale}/diagnostics/beauty`, { maxRedirects: 0 })
    expect(response.status(), locale).toBe(200)
    const html = await response.text()
    expect(html).toContain('data-service-detail-template="v1"')
    expect(html).toContain(`<html lang="${locale}"`)
    expect(html).not.toMatch(/services:[a-z0-9_.-]+/i)
  }
})

for (const viewport of [
  { label: 'mobile', width: 390, height: 844 },
  { label: 'desktop', width: 1440, height: 1000 },
]) {
  test(`PT13.1 ${viewport.label} template has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/pl/diagnostics/beauty')
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}

test('PT13.1 canonical source still contains exactly nine families', () => {
  expect(services).toHaveLength(9)
  expect(new Set(services.map(({ id }) => id)).size).toBe(9)
})

test('PT13.1 unknown service slug remains a real noindex HTTP 404', async ({ request }) => {
  const response = await request.get('/de/diagnostics/kein-kanonischer-service', {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(404)
  const html = await response.text()
  expect(html).toContain('name="robots" content="noindex, follow"')
  expect(html).not.toContain('rel="canonical"')
})
