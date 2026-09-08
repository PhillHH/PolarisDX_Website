import { createRequire } from 'node:module'
import fs from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const viewports = [
  { locale: 'de', name: 'mobile', width: 360, height: 800 },
  { locale: 'pl', name: 'tablet', width: 768, height: 1024 },
  { locale: 'en', name: 'desktop', width: 1280, height: 900 },
  { locale: 'fr', name: 'desktop', width: 1280, height: 900 },
  { locale: 'cs', name: 'wide', width: 1920, height: 1080 },
] as const

for (const viewport of viewports) {
  test(`PT14.2 Hero visual smoke: ${viewport.locale} ${viewport.name}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await page.addInitScript(() => {
      window.__iglooCls = 0
      new PerformanceObserver((entries) => {
        for (const entry of entries.getEntries()) {
          const shift = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number }
          if (!shift.hadRecentInput) window.__iglooCls += shift.value ?? 0
        }
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(`/${viewport.locale}/igloo-pro`)

    const hero = page.locator('[data-igloo-hero]')
    await expect(hero).toBeVisible()
    await expect(hero.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(hero.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveAttribute(
      'href',
      `/${viewport.locale}/contact`,
    )
    await expect(hero.locator('[data-igloo-hero-secondary]')).toHaveAttribute(
      'href',
      `/${viewport.locale}#roi-rechner`,
    )
    await expect(hero.getByRole('img')).toBeVisible()
    await expect(page.locator('[data-igloo-proof] [data-proof-signal]')).toHaveCount(3)

    const visibleCopy = `${await hero.innerText()} ${await page.locator('[data-igloo-proof]').innerText()}`
    expect(visibleCopy).not.toMatch(/CV\s*<|<\s*5\s*%|600\s*g|3.?15\s*min|IVDR|LIS\/HIS/i)
    expect(visibleCopy).not.toMatch(/products:hero|proof\.items/)

    const horizontalOverflow = await page.evaluate(
      () =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
        window.innerWidth,
    )
    expect(horizontalOverflow).toBeLessThanOrEqual(1)
    expect(await page.evaluate(() => window.__iglooCls)).toBeLessThan(0.1)

    await page.screenshot({
      path: testInfo.outputPath(`igloo-${viewport.locale}-${viewport.name}.png`),
      fullPage: true,
      animations: 'disabled',
    })
  })
}

test('PT14.2 Hero and proof are productive in all ten SSR locales', async ({ request }) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    const resource = JSON.parse(
      fs.readFileSync(`public/locales/${locale}/products.json`, 'utf8'),
    ) as { hero: { title: string; cta_order: string }; proof: { title: string } }
    const path = `/${locale}/igloo-pro`
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)

    const html = await response.text()
    const decodedHtml = html.replaceAll('&#x27;', "'").replaceAll('&amp;', '&')
    expect(html, `${path} Hero`).toContain('data-igloo-hero="true"')
    expect(html, `${path} proof`).toContain('data-igloo-proof="true"')
    expect(decodedHtml, `${path} title`).toContain(resource.hero.title)
    expect(decodedHtml, `${path} CTA`).toContain(resource.hero.cta_order)
    expect(decodedHtml, `${path} proof title`).toContain(resource.proof.title)
    expect(html, `${path} localized contact`).toContain(`href="/${locale}/contact"`)
    expect(html, `${path} localized ROI calculator`).toContain(`href="/${locale}#roi-rechner"`)
  }
})

test('PT14.2 Hero has no serious or critical accessibility violations', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/en/igloo-pro')
  await page.addScriptTag({ path: axePath })

  const violations = await page.evaluate(async () => {
    const result = await window.axe.run('[data-igloo-hero], [data-igloo-proof]', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })
    return result.violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map(({ id, impact, help, nodes }) => ({ id, impact, help, nodes: nodes.length }))
  })

  expect(violations).toEqual([])
})

declare global {
  interface Window {
    __iglooCls: number
    axe: {
      run: (
        context: string,
        options: Record<string, unknown>,
      ) => Promise<{
        violations: Array<{
          id: string
          impact: string | null
          help: string
          nodes: unknown[]
        }>
      }>
    }
  }
}
