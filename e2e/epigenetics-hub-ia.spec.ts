import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

type EpigeneticsResource = {
  hero: { title: string; ctaQuote: string }
}

type CommonResource = {
  nav: { epigenetics: string }
}

type HomeResource = {
  business_pillars: {
    pillars: { epigenetics: { title: string; cta: string } }
  }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    {
      epigenetics: JSON.parse(
        readFileSync(`public/locales/${locale}/epigenetics.json`, 'utf8'),
      ) as EpigeneticsResource,
      common: JSON.parse(
        readFileSync(`public/locales/${locale}/common.json`, 'utf8'),
      ) as CommonResource,
      home: JSON.parse(readFileSync(`public/locales/${locale}/home.json`, 'utf8')) as HomeResource,
    },
  ]),
) as Record<
  (typeof SUPPORTED_LANGUAGES)[number],
  { epigenetics: EpigeneticsResource; common: CommonResource; home: HomeResource }
>

const leafPaths = (value: unknown, prefix = ''): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((entry, index) => leafPaths(entry, `${prefix}.${index}`))
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, entry]) =>
      leafPaths(entry, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

test('PT15.1 exposes the standalone hub through Header, Footer and Homepage in all locales', async ({
  request,
}) => {
  const canonicalKeys = leafPaths(resources.de.epigenetics).sort()
  for (const locale of SUPPORTED_LANGUAGES) {
    expect(leafPaths(resources[locale].epigenetics).sort(), `${locale}: key parity`).toEqual(
      canonicalKeys,
    )
    expect(
      '_translationStatus' in resources[locale].epigenetics,
      `${locale}: no fallback marker`,
    ).toBe(false)
    if (locale !== 'de' && locale !== 'en') {
      expect(resources[locale].epigenetics.hero, `${locale}: no English hero fallback`).not.toEqual(
        resources.en.epigenetics.hero,
      )
      expect(resources[locale].epigenetics.hero, `${locale}: no German hero fallback`).not.toEqual(
        resources.de.epigenetics.hero,
      )
    }

    const hubPath = `/${locale}/epigenetics`
    const hub = await request.get(hubPath, { maxRedirects: 0 })
    expect(hub.status(), hubPath).toBe(200)
    expect(hub.headers().location, hubPath).toBeUndefined()

    const hubHtml = await hub.text()
    expect(hubHtml, `${locale}: html lang`).toContain(`<html lang="${locale}"`)
    expect(hubHtml, `${locale}: hub marker`).toContain('data-epigenetics-hub="true"')
    expect(hubHtml, `${locale}: route id`).toContain('data-route-id="epigenetics"')
    expect(hubHtml, `${locale}: translated H1`).toContain(resources[locale].epigenetics.hero.title)
    expect(hubHtml, `${locale}: translated CTA`).toContain(
      resources[locale].epigenetics.hero.ctaQuote,
    )
    expect(hubHtml, `${locale}: own Header entry`).toContain(`href="/${locale}/epigenetics"`)
    expect(hubHtml, `${locale}: no Diagnostics classification`).not.toContain(
      `href="/${locale}/diagnostics/epigenetics"`,
    )
    expect(hubHtml, `${locale}: no legacy target`).not.toMatch(
      new RegExp(`href="/${locale}/services(?:/|")`),
    )

    const homePath = `/${locale}/`
    const home = await request.get(homePath, { maxRedirects: 0 })
    expect(home.status(), homePath).toBe(200)
    const homeHtml = await home.text()
    expect(homeHtml, `${locale}: Homepage pillar`).toContain(
      resources[locale].home.business_pillars.pillars.epigenetics.title,
    )
    expect(homeHtml, `${locale}: Homepage target`).toContain(`href="/${locale}/epigenetics"`)
    expect(
      resources[locale].common.nav.epigenetics.trim().length,
      `${locale}: nav label`,
    ).toBeGreaterThan(0)
  }
})

test('PT15.1 hub preserves the orientation journey and canonical crosslinks', async ({ page }) => {
  await page.goto('/de/epigenetics')

  await expect(page.locator('main h1')).toHaveCount(1)
  const orderedStages = await page.locator('main').evaluate((main) => {
    const ids = ['vergleich', 'analysen', 'ablauf', 'fragen', 'downloads', 'inquiry']
    return ids.map((id) => {
      const element = main.querySelector(`#${id}`)
      return element ? { id, top: element.getBoundingClientRect().top + window.scrollY } : null
    })
  })
  expect(orderedStages.every(Boolean)).toBe(true)
  expect(orderedStages.map((stage) => stage!.top)).toEqual(
    [...orderedStages].map((stage) => stage!.top).sort((a, b) => a - b),
  )

  await expect(page.locator('#analysen a[href^="/de/epigenetics/musterbefund/"]')).toHaveCount(6)
  for (const path of ['grundlagen', 'studienlage', 'unterlagen']) {
    await expect(page.locator(`main a[href="/de/epigenetics/${path}"]`)).toBeVisible()
  }
  await expect(
    page.locator('main a[href="/de/epigenetics?source=epigenetics#inquiry"]'),
  ).toHaveCount(1)
  await expect(page.locator('#inquiry form')).toBeVisible()
  await expect(page.locator('main a[href="/de/diagnostics/longevity"]')).toBeVisible()
})

test('PT15.1 hub and standalone navigation are keyboard-safe and Axe-clean', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/cs/epigenetics')
  await page.waitForLoadState('networkidle')

  const menu = page.getByRole('button', { name: /navig/i }).first()
  await menu.click()
  const epigeneticsEntry = page.locator('header a[href="/cs/epigenetics"]:visible')
  await expect(epigeneticsEntry).toBeVisible()
  await epigeneticsEntry.focus()
  await expect(epigeneticsEntry).toBeFocused()
  await menu.click()

  const overflow = await page.evaluate(
    () => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)

  // PageTransition/Reveal use opacity while entering. Axe must measure the
  // settled foreground colors rather than their transient blended state.
  await page.waitForTimeout(1200)
  await page.addScriptTag({ path: axePath })
  const violations = await page.evaluate(async () => {
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
      .map(({ id, impact, nodes }) => ({
        id,
        impact,
        nodes: nodes.map(({ target, html, failureSummary }) => ({
          target,
          html,
          failureSummary,
        })),
      }))
  })
  expect(violations).toEqual([])
})
