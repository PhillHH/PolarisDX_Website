import { createRequire } from 'node:module'
import fs from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

test('PT14.6 keeps both real conversion targets available in all ten locales', async ({
  request,
}) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    const product = JSON.parse(
      fs.readFileSync(`public/locales/${locale}/products.json`, 'utf8'),
    ) as {
      hero: { cta_order: string; cta_secondary: string }
      cta_bottom: { button: string; resources: string }
    }
    const productPath = `/${locale}/igloo-pro`
    const productResponse = await request.get(productPath, { maxRedirects: 0 })
    expect(productResponse.status(), productPath).toBe(200)
    expect(productResponse.headers().location, productPath).toBeUndefined()

    const html = (await productResponse.text()).replaceAll('&amp;', '&')
    expect(html, `${productPath} primary label`).toContain(product.hero.cta_order)
    expect(html, `${productPath} final primary label`).toContain(product.cta_bottom.button)
    expect(html, `${productPath} ROI label`).toContain(product.hero.cta_secondary)
    expect(html, `${productPath} final ROI label`).toContain(product.cta_bottom.resources)
    expect(html, `${productPath} primary target`).toContain(`href="/${locale}/contact"`)
    expect(html, `${productPath} ROI target`).toContain(`href="/${locale}#roi-rechner"`)
    expect(html, `${productPath} support target`).toContain(`href="/${locale}/support"`)
    expect(html, `${productPath} fake product resource`).not.toMatch(
      /href="[^"]*igloo-pro-(?:flyer|brochure|datasheet)/i,
    )

    const contactPath = `/${locale}/contact`
    const contactResponse = await request.get(contactPath, { maxRedirects: 0 })
    expect(contactResponse.status(), contactPath).toBe(200)
    expect(contactResponse.headers().location, contactPath).toBeUndefined()
    expect(await contactResponse.text(), `${contactPath} form`).toContain('id="kontaktformular"')

    const roiPath = `/${locale}/`
    const roiResponse = await request.get(roiPath, { maxRedirects: 0 })
    expect(roiResponse.status(), roiPath).toBe(200)
    expect(roiResponse.headers().location, roiPath).toBeUndefined()
    expect(await roiResponse.text(), `${roiPath} ROI runtime`).toContain('id="roi-rechner"')
  }
})

test('PT14.6 returns a real 404 for an unknown IglooPro variant', async ({ request }) => {
  for (const locale of ['de', 'en', 'cs']) {
    const path = `/${locale}/igloo-pro-unknown`
    expect((await request.get(path, { maxRedirects: 0 })).status(), path).toBe(404)
  }
})

test('PT14.6 all ten locale renders remain complete without mobile overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const locale of SUPPORTED_LANGUAGES) {
    await page.goto(`/${locale}/igloo-pro`)
    await expect(page.locator('[data-igloo-hero]')).toBeVisible()
    await expect(page.locator('[data-igloo-features]')).toBeVisible()
    await expect(page.locator('[data-igloo-workflow]')).toBeVisible()
    await expect(page.locator('[data-igloo-specification]')).toBeVisible()
    await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveCount(2)
    const horizontalOverflow = await page.evaluate(
      () =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
        window.innerWidth,
    )
    expect(horizontalOverflow, locale).toBeLessThanOrEqual(1)
  }
})

test('AP14 remediation leaves both the product and linked contact form Axe-clean', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/en/igloo-pro')
  await page.addScriptTag({ path: axePath })

  const productViolations = await page.evaluate(async () => {
    const axe = (
      window as Window & {
        axe: {
          run: (
            context: string,
            options: Record<string, unknown>,
          ) => Promise<{
            violations: Array<{
              id: string
              impact: string | null
              nodes: Array<{ target: string[]; html: string; failureSummary?: string }>
            }>
          }>
        }
      }
    ).axe
    const result = await axe.run('main', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })
    return result.violations
      .filter(({ impact }) => impact === 'serious' || impact === 'critical')
      .map(({ id, impact, nodes }) => ({ id, impact, nodes }))
  })
  expect(productViolations).toEqual([])

  await page.goto('/en/contact')
  await page.addScriptTag({ path: axePath })
  await expect(page.locator('#kontaktformular form')).toBeVisible()
  const formViolations = await page.evaluate(async () => {
    const axe = (
      window as Window & {
        axe: {
          run: (
            context: string,
            options: Record<string, unknown>,
          ) => Promise<{
            violations: Array<{
              id: string
              impact: string | null
              nodes: Array<{ target: string[]; html: string; failureSummary?: string }>
            }>
          }>
        }
      }
    ).axe
    const result = await axe.run('#kontaktformular', {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
    })
    return result.violations
      .filter(({ impact }) => impact === 'serious' || impact === 'critical')
      .map(({ id, impact, nodes }) => ({ id, impact, nodes }))
  })
  expect(formViolations).toEqual([])
})

test('PT14.6 introduces no product-local tracking or synthetic attribution', () => {
  const sources = [
    'src/components/sections/IglooProHero.tsx',
    'src/components/sections/IglooProductFinalCta.tsx',
    'src/pages/IglooProPage.tsx',
  ].map((path) => fs.readFileSync(path, 'utf8'))
  const productSource = sources.join('\n')

  expect(productSource).not.toMatch(/dataLayer|gtag\s*\(|trackEvent|analytics\./)
  expect(productSource).not.toMatch(/[?&](?:utm_|source=|campaign=)/)
})
