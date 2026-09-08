import { createRequire } from 'node:module'
import fs from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

const viewports = [
  { locale: 'de', name: 'mobile', width: 360, height: 800 },
  { locale: 'pl', name: 'tablet', width: 768, height: 1024 },
  { locale: 'fr', name: 'desktop', width: 1280, height: 900 },
  { locale: 'cs', name: 'wide', width: 1920, height: 1080 },
] as const

for (const viewport of viewports) {
  test(`PT14.3 product journey visual smoke: ${viewport.locale} ${viewport.name}`, async ({
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

    await expect(page.locator('[data-igloo-features] [data-product-characteristic]')).toHaveCount(3)
    await expect(page.locator('[data-igloo-workflow] [data-workflow-step]')).toHaveCount(3)
    await expect(page.locator('[data-igloo-compatibility] [data-compatibility-check]')).toHaveCount(
      4,
    )
    await expect(page.locator('[data-igloo-compatibility] [data-related-route-id]')).toHaveCount(5)
    await expect(page.locator('[data-igloo-specification]')).toHaveCount(1)
    await expect(page.locator('[data-igloo-specification] tbody tr')).toHaveCount(1)
    await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveCount(2)

    const expectedTargets = [
      `/diagnostics/poc-systemloesungen`,
      `/diagnostics/kompatibilitaet-integration`,
      '/downloads',
      '/support',
      '/contact',
    ]
    const links = page.locator('[data-igloo-compatibility] [data-related-route-id]')
    for (let index = 0; index < expectedTargets.length; index += 1) {
      await expect(links.nth(index)).toHaveAttribute(
        'href',
        `/${viewport.locale}${expectedTargets[index]}`,
      )
    }

    const visibleCopy = await page.locator('main').innerText()
    expect(visibleCopy.match(/CV < 2 %/g)).toHaveLength(1)
    expect(visibleCopy).not.toMatch(
      /CV\s*<\s*5|600\s*g|3.?15\s*min|10[.,]000|IVDR|LIS\/?HIS|Wi-?Fi|Bluetooth/i,
    )
    expect(visibleCopy).not.toMatch(/product_story\.|workflow\.steps|compatibility\.items/)
    expect(await page.locator('main a[href="/downloads/igloo-pro-flyer.pdf"]').count()).toBe(0)

    const horizontalOverflow = await page.evaluate(
      () =>
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) -
        window.innerWidth,
    )
    expect(horizontalOverflow).toBeLessThanOrEqual(1)
    expect(await page.evaluate(() => window.__iglooCls)).toBeLessThan(0.1)

    await page.screenshot({
      path: testInfo.outputPath(`igloo-journey-${viewport.locale}-${viewport.name}.png`),
      fullPage: true,
      animations: 'disabled',
    })
  })
}

test('PT14.3 feature, workflow and compatibility content is productive in all ten SSR locales', async ({
  request,
}) => {
  for (const locale of SUPPORTED_LANGUAGES) {
    const resource = JSON.parse(
      fs.readFileSync(`public/locales/${locale}/products.json`, 'utf8'),
    ) as {
      product_story: { title: string }
      workflow: { title: string }
      compatibility: { title: string }
      specification: { title: string; value: string; context: string }
      cta_bottom: { button: string }
    }
    const path = `/${locale}/igloo-pro`
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)

    const html = await response.text()
    const decodedHtml = html.replaceAll('&#x27;', "'").replaceAll('&amp;', '&')
    expect(html, `${path} features`).toContain('data-igloo-features="true"')
    expect(html, `${path} workflow`).toContain('data-igloo-workflow="true"')
    expect(html, `${path} compatibility`).toContain('data-igloo-compatibility="true"')
    expect(html, `${path} specification`).toContain('data-igloo-specification="true"')
    expect(decodedHtml, `${path} product story`).toContain(resource.product_story.title)
    expect(decodedHtml, `${path} workflow title`).toContain(resource.workflow.title)
    expect(decodedHtml, `${path} compatibility title`).toContain(resource.compatibility.title)
    expect(decodedHtml, `${path} specification title`).toContain(resource.specification.title)
    expect(decodedHtml.match(/CV &lt; 2 %|CV < 2 %/g), `${path} canonical claim`).toHaveLength(1)
    expect(decodedHtml, `${path} specification context`).toContain(resource.specification.context)
    expect(decodedHtml, `${path} stale claim`).not.toMatch(/CV\s*(?:&lt;|<)\s*5/)
    expect(decodedHtml, `${path} CTA`).toContain(resource.cta_bottom.button)
    expect(html, `${path} contact target`).toContain(`href="/${locale}/contact"`)
    expect(html, `${path} support target`).toContain(`href="/${locale}/support"`)
  }
})

test('PT14.3 related targets resolve and the journey has no serious accessibility findings', async ({
  page,
  request,
}) => {
  for (const path of [
    '/en/diagnostics/poc-systemloesungen',
    '/en/diagnostics/kompatibilitaet-integration',
    '/en/downloads',
    '/en/support',
    '/en/contact',
  ]) {
    expect((await request.get(path)).status(), path).toBe(200)
  }

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/en/igloo-pro')
  await page.addScriptTag({ path: axePath })

  const violations = await page.evaluate(async () => {
    const result = await window.axe.run(
      '[data-igloo-features], [data-igloo-workflow], [data-igloo-compatibility], [data-igloo-specification], [data-igloo-final-cta]',
      { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] } },
    )
    return result.violations
      .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
      .map(({ id, impact, help, nodes }) => ({
        id,
        impact,
        help,
        nodes: nodes.map(({ target, html, failureSummary }) => ({
          target,
          html,
          failureSummary,
        })),
      }))
  })

  expect(violations).toEqual([])
})
