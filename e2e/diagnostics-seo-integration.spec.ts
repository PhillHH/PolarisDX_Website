import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test } from '@playwright/test'
import { diagnosticsRelatedArticles } from '../src/data/diagnosticsHub'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

const PUBLIC_ORIGIN = 'https://polarisdx.net'

type ServicesResource = {
  seo: { overview_title: string; overview_description: string }
  overview: { related: { title: string } }
}

const resources = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((locale) => [
    locale,
    JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/services.json`), 'utf8'),
    ) as ServicesResource,
  ]),
) as Record<(typeof SUPPORTED_LANGUAGES)[number], ServicesResource>

function attribute(html: string, tagPattern: RegExp, name: string): string | undefined {
  return html.match(tagPattern)?.[0]?.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1]
}

for (const locale of SUPPORTED_LANGUAGES) {
  test(`PT12.5 ${locale} Hub SEO, deep links and published knowledge remain aligned`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/diagnostics`)
    expect(response?.status()).toBe(200)
    const html = await response!.text()
    const canonical = `${PUBLIC_ORIGIN}/${locale}/diagnostics`

    await expect(page).toHaveTitle(`${resources[locale].seo.overview_title} | PolarisDX`)
    expect(attribute(html, /<meta[^>]+name="description"[^>]*>/i, 'content')).toBe(
      resources[locale].seo.overview_description,
    )
    expect(attribute(html, /<meta[^>]+name="robots"[^>]*>/i, 'content')).toMatch(/^index, follow/)
    expect(attribute(html, /<link[^>]+rel="canonical"[^>]*>/i, 'href')).toBe(canonical)
    expect(html.match(/<link[^>]+rel="alternate"[^>]*>/gi)).toHaveLength(11)
    expect(
      attribute(html, /<link[^>]+rel="alternate"[^>]+hreflang="x-default"[^>]*>/i, 'href'),
    ).toBe(`${PUBLIC_ORIGIN}/de/diagnostics`)
    expect(attribute(html, /<meta[^>]+property="og:url"[^>]*>/i, 'content')).toBe(canonical)
    expect(attribute(html, /<meta[^>]+property="og:image"[^>]*>/i, 'content')).toMatch(
      /^https:\/\/polarisdx\.net\/assets\/Igloo-pro-frontal-/,
    )
    expect(attribute(html, /<meta[^>]+property="og:image:alt"[^>]*>/i, 'content')).toBeTruthy()
    expect(html).not.toMatch(/<meta[^>]+name="keywords"/i)
    expect(html).not.toMatch(/preview\.polarisdx\.net|localhost|127\.0\.0\.1/)

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')))
    const breadcrumb = structuredData.find((entry) => entry['@type'] === 'BreadcrumbList')
    expect(breadcrumb?.itemListElement).toHaveLength(2)
    expect(breadcrumb?.itemListElement.at(-1)?.item).toBe(canonical)
    expect(structuredData.some((entry) => String(entry['@type']).startsWith('Medical'))).toBe(false)

    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('[data-diagnostics-card]')).toHaveCount(9)
    await expect(page.locator('[data-diagnostics-related-article]')).toHaveCount(3)
    await expect(
      page.locator('[data-diagnostics-related-articles]').getByRole('heading', { level: 2 }),
    ).toHaveText(resources[locale].overview.related.title)
    for (const { article, route } of diagnosticsRelatedArticles) {
      await expect(
        page.locator(`[data-diagnostics-related-article="${article.id}"] a`),
      ).toHaveAttribute('href', `/${locale}${route.path}`)
    }
    await expect(page.locator('[data-diagnostics-knowledge-link]')).toHaveAttribute(
      'href',
      `/${locale}/articles`,
    )
    await expect(page.locator('[data-cta-intent="GENERAL_SALES"]')).toHaveAttribute(
      'href',
      `/${locale}/contact?intent=quote#kontaktformular`,
    )
    await expect(page.locator('main a[href*="/services"]')).toHaveCount(0)
  })
}

test('PT12.5 sitemap and bidirectional internal findability use real canonical targets', async ({
  request,
}) => {
  const sitemapResponse = await request.get('/sitemap.xml')
  expect(sitemapResponse.status()).toBe(200)
  const sitemap = await sitemapResponse.text()
  for (const locale of SUPPORTED_LANGUAGES) {
    expect(sitemap).toContain(`<loc>${PUBLIC_ORIGIN}/${locale}/diagnostics</loc>`)
  }

  for (const path of [
    '/de/',
    '/de/articles/die-gruene-praxis',
    '/de/articles/der-unsichtbare-patient',
    '/de/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety',
    '/de/igloo-pro',
  ]) {
    const response = await request.get(path, { maxRedirects: 0 })
    expect(response.status(), path).toBe(200)
    expect(await response.text(), path).toMatch(/href="\/de\/diagnostics(?:\/[^"#?]+)?"/)
  }

  for (const { route } of diagnosticsRelatedArticles) {
    expect((await request.get(`/de${route.path}`, { maxRedirects: 0 })).status()).toBe(200)
  }
})

for (const scenario of [
  { locale: 'de', width: 390, height: 844, columns: 1 },
  { locale: 'en', width: 768, height: 1024, columns: 2 },
  { locale: 'pl', width: 1024, height: 900, columns: 3 },
  { locale: 'fr', width: 1280, height: 900, columns: 3 },
  { locale: 'cs', width: 1440, height: 1000, columns: 3 },
] as const) {
  test(`PT12.5 ${scenario.locale} ${scenario.width}px visual integration remains stable`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: scenario.width, height: scenario.height })
    await page.goto(`/${scenario.locale}/diagnostics`)
    const section = page.locator('[data-diagnostics-related-articles]')
    await section.scrollIntoViewIfNeeded()
    await expect(section.locator('[data-diagnostics-related-article]')).toHaveCount(3)
    expect(
      await section
        .locator('[data-diagnostics-related-article]')
        .first()
        .evaluate((element) => {
          const grid = element.parentElement!
          return getComputedStyle(grid).gridTemplateColumns.split(' ').filter(Boolean).length
        }),
    ).toBe(scenario.columns)
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true)
  })
}

test('PT12.5 related-content links expose visible keyboard focus in DOM order', async ({
  page,
}) => {
  await page.goto('/de/diagnostics')
  const links = page.locator(
    '[data-diagnostics-related-articles] [data-related-article-link], [data-diagnostics-knowledge-link]',
  )
  await expect(links).toHaveCount(4)
  await links.first().focus()
  for (let index = 0; index < 4; index += 1) {
    await expect(links.nth(index)).toBeFocused()
    expect(
      await links.nth(index).evaluate((element) => getComputedStyle(element).boxShadow !== 'none'),
    ).toBe(true)
    if (index < 3) await page.keyboard.press('Tab')
  }
})
