import { expect, test } from '@playwright/test'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

test.describe('PT13.7 infection and inflammation service detail', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale} renders normalized infection-marker content and SEO`, async ({ page }) => {
      const response = await page.goto(`/${locale}/diagnostics/infektion-entzuendung`)
      expect(response?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
      await expect(page.locator('[data-service-detail-template="v1"]')).toHaveCount(1)
      await expect(page.locator('.rich-content')).toHaveCount(0)
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
      await expect(page.locator('[data-service-detail-sections] section')).toHaveCount(6)
      await expect(page.locator('[data-service-detail-sections] ol > li')).toHaveCount(3)
      await expect(page.locator('#faq button[aria-controls]')).toHaveCount(3)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://polarisdx.net/${locale}/diagnostics/infektion-entzuendung`,
      )
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(11)
      await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
        'href',
        'https://polarisdx.net/de/diagnostics/infektion-entzuendung',
      )
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index, follow/)
      await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute('content', /.+/)
      await expect(page.locator('body')).not.toContainText(/services:[a-z0-9_.-]+/i)
      expect(await page.locator('a[href*="/services/"]').count()).toBe(0)
    })
  }

  test('uses one real published article plus deterministic GENERAL_SALES', async ({ page }) => {
    await page.goto('/de/diagnostics/infektion-entzuendung')
    await expect(
      page.getByRole('link', { name: /Präzision im Point-of-Care/i }).first(),
    ).toHaveAttribute('href', '/de/articles/precision-in-point-of-care-the-key-to-patient-safety')
    const salesActions = page.locator('[data-cta-intent="GENERAL_SALES"]')
    await expect(salesActions).toHaveCount(2)
    for (let index = 0; index < 2; index += 1) {
      await expect(salesActions.nth(index)).toHaveAttribute(
        'href',
        '/de/contact?intent=quote#kontaktformular',
      )
      await expect(salesActions.nth(index)).toHaveAttribute(
        'data-service-family',
        'infektion-entzuendung',
      )
      await expect(salesActions.nth(index)).toHaveAttribute('data-cta-journey', 'general_sales')
      await expect(salesActions.nth(index)).toHaveText('Angebot anfragen')
    }
  })

  test('visible FAQ and FAQ schema are identical and keep clinical boundaries explicit', async ({
    page,
  }) => {
    await page.goto('/de/diagnostics/infektion-entzuendung')
    const visibleQuestions = (
      await page.locator('#faq button[aria-controls]').allTextContents()
    ).map((question) => question.trim())
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    const parsed = schemas.flatMap((schema) => {
      const value = JSON.parse(schema)
      return Array.isArray(value) ? value : [value]
    })
    const faq = parsed.find((schema) => schema['@type'] === 'FAQPage')
    expect(faq.mainEntity.map((entry: { name: string }) => entry.name)).toEqual(visibleQuestions)
    expect(JSON.stringify(parsed)).not.toMatch(/"@type":"(?:Product|Offer|Rating|Review)"/)
    const normalizedContent = await page.locator('[data-service-detail-template="v1"]').innerText()
    expect(normalizedContent).not.toMatch(
      /40\s?mg|unter 5 Minuten|Triage in Minuten|Laborniveau|maximale Geschwindigkeit|Therapieerfolg|Antibiotikatherapie früher beendet|Termin buchen|3-5 Werktage|Priority-Support/i,
    )
    expect(normalizedContent).toContain('Ein Marker ist keine Diagnose')
    expect(normalizedContent).toContain('ersetzen keine individuelle medizinische Beurteilung')
  })

  for (const viewport of [
    { label: 'mobile', width: 390, height: 844 },
    { label: 'desktop', width: 1440, height: 1000 },
  ]) {
    test(`${viewport.label} has no horizontal overflow and keeps focus visible`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/pl/diagnostics/infektion-entzuendung')
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true)
      const firstAction = page.locator('[data-cta-intent="GENERAL_SALES"]').first()
      await firstAction.focus()
      await expect(firstAction).toBeFocused()
      await expect(firstAction).toHaveClass(/focus-visible:ring/)
    })
  }
})
