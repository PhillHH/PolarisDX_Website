import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')
const PUBLIC_ORIGIN = 'https://polarisdx.net'

type HomeResource = {
  seo: { title: string; description: string; social_image_alt: string }
  faq: {
    title: string
    items: Array<{ question: string; answer: string }>
  }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/home.json`), 'utf8'),
    ) as HomeResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], HomeResource>

async function faqSchema(page: Page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => {
    const schemas = scripts.flatMap((script) => {
      const parsed = JSON.parse(script.textContent || 'null') as unknown
      return Array.isArray(parsed) ? parsed : [parsed]
    }) as Array<Record<string, unknown>>
    return schemas.find((schema) => schema['@type'] === 'FAQPage')
  })
}

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT11.6 ${locale} FAQ, metadata, headings and core links share the page truth`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`)
    expect(response?.status()).toBe(200)

    const expectedCanonical = `${PUBLIC_ORIGIN}/${locale}/`
    await expect(page).toHaveTitle(resources[locale].seo.title)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      resources[locale].seo.description,
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedCanonical)
    await expect(page.locator('link[rel="alternate"]')).toHaveCount(11)
    for (const alternate of SUPPORTED_LANGUAGES) {
      await expect(page.locator(`link[rel="alternate"][hreflang="${alternate}"]`)).toHaveAttribute(
        'href',
        `${PUBLIC_ORIGIN}/${alternate}/`,
      )
    }
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      'href',
      `${PUBLIC_ORIGIN}/de/`,
    )

    for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) {
      await expect(page.locator(selector)).toHaveAttribute('content', resources[locale].seo.title)
    }
    for (const selector of [
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      await expect(page.locator(selector)).toHaveAttribute(
        'content',
        resources[locale].seo.description,
      )
    }
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      expectedCanonical,
    )
    await expect(page.locator('meta[name="twitter:url"]')).toHaveAttribute(
      'content',
      expectedCanonical,
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      `${PUBLIC_ORIGIN}/og-image.jpg`,
    )
    await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
      'content',
      resources[locale].seo.social_image_alt,
    )
    await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
      'content',
      resources[locale].seo.social_image_alt,
    )
    expect(await page.content()).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

    await expect(page.locator('main h1')).toHaveCount(1)
    const headingLevels = await page
      .locator('main h1, main h2, main h3, main h4, main h5, main h6')
      .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))))
    expect(headingLevels[0]).toBe(1)
    expect(headingLevels.filter((level) => level === 1)).toHaveLength(1)
    expect(
      headingLevels.every((level, index) => index === 0 || level <= headingLevels[index - 1] + 1),
    ).toBe(true)

    const faq = page.locator('#faq')
    await expect(faq.getByRole('heading', { level: 2 })).toHaveText(resources[locale].faq.title)
    const questions = faq.getByRole('button')
    await expect(questions).toHaveCount(resources[locale].faq.items.length)
    for (const [index, item] of resources[locale].faq.items.entries()) {
      const question = questions.nth(index)
      await expect(question).toHaveText(item.question)
      await expect(question).toHaveAttribute('aria-expanded', 'false')
      await question.click()
      await expect(question).toHaveAttribute('aria-expanded', 'true')
      await expect(faq.getByRole('region', { name: item.question })).toHaveText(item.answer)
    }

    const schema = (await faqSchema(page)) as {
      inLanguage: string
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>
    }
    expect(schema.inLanguage).toBe(locale)
    expect(
      schema.mainEntity.map(({ name, acceptedAnswer }) => ({
        question: name,
        answer: acceptedAnswer.text,
      })),
    ).toEqual(resources[locale].faq.items)

    for (const path of ['/diagnostics', '/igloo-pro', '/epigenetics'] as const) {
      await expect(page.locator(`main a[href="/${locale}${path}"]`).first()).toBeVisible()
      expect((await page.request.get(`/${locale}${path}`)).status()).toBe(200)
    }
    await expect(page.locator('body')).not.toContainText(/(?:home|common):[\w.-]+/)
  })
}

test('PT11.6 page-level accessibility and performance structure stay regression-free', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/pl/', { waitUntil: 'networkidle' })

  await expect(page.locator('header')).toHaveCount(1)
  await expect(page.locator('main')).toHaveCount(1)
  await expect(page.locator('footer')).toHaveCount(1)
  await expect(page.locator('main img:not([alt])')).toHaveCount(0)
  await expect(page.locator('[data-home-hero] img')).toHaveAttribute('loading', 'eager')
  await expect(page.locator('[data-home-hero] img')).toHaveAttribute('width', '650')
  await expect(page.locator('[data-home-hero] img')).toHaveAttribute('height', '650')
  await expect(page.locator('main img[loading="eager"]')).toHaveCount(1)

  const firstQuestion = page.locator('#faq button').first()
  await firstQuestion.scrollIntoViewIfNeeded()
  await firstQuestion.focus()
  await expect(firstQuestion).toBeFocused()
  await expect
    .poll(() =>
      firstQuestion.evaluate((element) => {
        let current: HTMLElement | null = element
        while (current) {
          if (Number(getComputedStyle(current).opacity) < 1) return false
          current = current.parentElement
        }
        return true
      }),
    )
    .toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )

  await page.addScriptTag({ path: axePath })
  const seriousViolations = await page.evaluate(async () => {
    const result = await window.axe.run(
      { include: [['main']] },
      { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } },
    )
    return result.violations
      .filter(({ impact }) => impact === 'serious' || impact === 'critical')
      .map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map((node) => node.target) }))
  })
  expect(seriousViolations).toEqual([])

  const foreignResources = await page.evaluate(() =>
    performance
      .getEntriesByType('resource')
      .map(({ name }) => new URL(name).hostname)
      .filter((host) => host !== window.location.hostname),
  )
  const existingConsentFacadeHosts = new Set([
    'www.googletagmanager.com',
    'region1.google-analytics.com',
  ])
  expect(foreignResources.filter((host) => !existingConsentFacadeHosts.has(host))).toEqual([])
})

for (const visual of [
  { locale: 'de', name: 'desktop-wide', width: 1440, height: 900 },
  { locale: 'pl', name: 'desktop-normal', width: 1280, height: 800 },
  { locale: 'de', name: 'desktop-compact', width: 1024, height: 768 },
  { locale: 'de', name: 'tablet', width: 768, height: 1024 },
  { locale: 'pl', name: 'mobile', width: 390, height: 844 },
  { locale: 'pl', name: 'mobile-compact', width: 360, height: 800 },
] as const) {
  test(`PT11.6 visual QA ${visual.name} ${visual.locale}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: visual.width, height: visual.height })
    await page.goto(`/${visual.locale}/`, { waitUntil: 'networkidle' })
    const sections = page.locator('main section')
    for (let index = 0; index < (await sections.count()); index += 1) {
      await sections.nth(index).scrollIntoViewIfNeeded()
    }
    const faqButton = page.locator('#faq button').first()
    await faqButton.scrollIntoViewIfNeeded()
    await faqButton.hover()
    await faqButton.focus()
    await faqButton.click()
    await page.screenshot({
      path: testInfo.outputPath(`${visual.name}-${visual.locale}.png`),
      fullPage: true,
      animations: 'disabled',
    })
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}
