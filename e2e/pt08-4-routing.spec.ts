import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'

import { SUPPORTED_LANGUAGES, type SupportedLanguage } from '../src/i18n'

const BASE_URL = 'https://polarisdx.net'
const logicalRoutes = [
  '/',
  '/about',
  '/diagnostics',
  '/diagnostics/dental',
  '/articles',
  '/articles/die-gruene-praxis',
  '/epigenetics',
  '/epigenetics/grundlagen',
  '/epigenetics/musterbefund/metabolic-health',
  '/downloads',
  '/events',
  '/contact',
  '/support',
  '/consumer/vitamin-d3-spray',
  '/s3_leitlinie',
  '/vitamin-d3-implantologie',
] as const

const consumerRoutes = {
  '/consumer/vitamin-d3-spray': 'spray.copy_050',
  '/consumer/hydrating-masks': 'mask.copy_035',
  '/consumer/inside-out-duo': 'duo.copy_019',
} as const

const specialtyRoutes = {
  '/s3_leitlinie': 's3_leitlinie.copy_048',
  '/vitamin-d3-implantologie': 'vitamin_d3_implantology.copy_020',
} as const

const languageNames: Record<SupportedLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  pl: 'Polski',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  pt: 'Português',
  da: 'Dansk',
  nl: 'Nederlands',
  cs: 'Čeština',
}

function localeFile(locale: SupportedLanguage, namespace: 'common' | 'consumer' | 'specialty') {
  return JSON.parse(
    readFileSync(resolve(process.cwd(), `public/locales/${locale}/${namespace}.json`), 'utf8'),
  ) as Record<string, string | Record<string, string>>
}

function languageTrigger(locale: SupportedLanguage): string {
  const common = localeFile(locale, 'common') as { a11y: { select_language: string } }
  return common.a11y.select_language
}

async function switchLanguage(
  page: Page,
  sourceLocale: SupportedLanguage,
  targetLocale: SupportedLanguage,
) {
  await page
    .getByRole('button', { name: languageTrigger(sourceLocale) })
    .first()
    .click()
  await page.getByRole('button', { name: languageNames[targetLocale], exact: true }).click()
}

function canonicalFrom(html: string): string | undefined {
  return html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)?.[1]
}

function alternateFrom(html: string, locale: string): string | undefined {
  const expression = new RegExp(
    `<link[^>]+rel="alternate"[^>]+hrefLang="${locale}"[^>]+href="([^"]+)"`,
  )
  return html.match(expression)?.[1]
}

test.describe('PT08.4 direct SSR route matrix', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: representative logical routes stay on the requested locale`, async ({
      request,
    }) => {
      for (const route of logicalRoutes) {
        const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
        expect(response.status(), `${locale}${route}`).toBe(200)
        expect(new URL(response.url()).pathname, `${locale}${route}`).toBe(`/${locale}${route}`)

        const html = await response.text()
        expect(html, `${locale}${route}`).toMatch(new RegExp(`<html[^>]+lang=["']${locale}["']`))
        expect(html, `${locale}${route}`).not.toContain('_translationStatus')
      }
    })
  }
})

test.describe('PT08.4 Consumer and specialty content is genuinely x10-routed', () => {
  for (const locale of SUPPORTED_LANGUAGES) {
    test(`${locale}: Consumer and specialty routes render localized body copy`, async ({
      page,
    }) => {
      const consumer = localeFile(locale, 'consumer') as Record<string, string>
      const specialty = localeFile(locale, 'specialty') as Record<string, string>

      for (const [route, key] of Object.entries(consumerRoutes)) {
        const response = await page.goto(`/${locale}${route}`)
        expect(response?.status(), `${locale}${route}`).toBe(200)
        expect(new URL(page.url()).pathname).toBe(`/${locale}${route}`)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.getByText(consumer[key], { exact: true }).first()).toBeVisible()
      }

      for (const [route, key] of Object.entries(specialtyRoutes)) {
        const response = await page.goto(`/${locale}${route}`)
        expect(response?.status(), `${locale}${route}`).toBe(200)
        expect(new URL(page.url()).pathname).toBe(`/${locale}${route}`)
        await expect(page.locator('html')).toHaveAttribute('lang', locale)
        await expect(page.getByText(specialty[key], { exact: true }).first()).toBeVisible()
      }
    })
  }
})

test.describe('PT08.4 language switch', () => {
  for (const targetLocale of SUPPORTED_LANGUAGES.filter((locale) => locale !== 'de')) {
    test(`de → ${targetLocale}: keeps path, query and hash`, async ({ page }) => {
      await page.goto('/de/epigenetics?source=pt08-4#musterbefunde')
      await switchLanguage(page, 'de', targetLocale)
      await page.waitForURL(`**/${targetLocale}/epigenetics?source=pt08-4#musterbefunde`)
      expect(new URL(page.url()).pathname).toBe(`/${targetLocale}/epigenetics`)
      expect(new URL(page.url()).search).toBe('?source=pt08-4')
      expect(new URL(page.url()).hash).toBe('#musterbefunde')
      await expect(page.locator('html')).toHaveAttribute('lang', targetLocale)
    })
  }

  for (const [sourceLocale, targetLocale] of [
    ['fr', 'de'],
    ['pl', 'en'],
    ['cs', 'de'],
  ] as const) {
    test(`${sourceLocale} → ${targetLocale}: keeps a dynamic article slug`, async ({ page }) => {
      const route = '/articles/die-gruene-praxis'
      await page.goto(`/${sourceLocale}${route}`)
      await switchLanguage(page, sourceLocale, targetLocale)
      await page.waitForURL(`**/${targetLocale}${route}`)
      expect(new URL(page.url()).pathname).toBe(`/${targetLocale}${route}`)
    })
  }

  test('Consumer shell exposes the same x10 URL-based switch', async ({ page }) => {
    const route = '/consumer/vitamin-d3-spray'
    await page.goto(`/pl${route}?source=consumer#benefits`)
    await switchLanguage(page, 'pl', 'cs')
    await page.waitForURL(`**/cs${route}?source=consumer#benefits`)
    expect(new URL(page.url()).pathname).toBe(`/cs${route}`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'cs')
  })
})

test('PT08.4 redirect behavior is direct and loop-free', async ({ request }) => {
  const bareConsumer = await request.get('/consumer/vitamin-d3-spray?source=bare', {
    maxRedirects: 0,
  })
  expect(bareConsumer.status()).toBe(301)
  expect(bareConsumer.headers().location).toBe('/de/consumer/vitamin-d3-spray?source=bare')

  for (const locale of SUPPORTED_LANGUAGES) {
    for (const route of [...Object.keys(consumerRoutes), ...Object.keys(specialtyRoutes)]) {
      const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
      expect(response.status(), `${locale}${route}`).toBe(200)
      expect(response.headers().location).toBeUndefined()
    }
  }

  for (const [source, target] of [
    ['/en/s3-leitlinie?source=legacy', '/en/s3_leitlinie?source=legacy'],
    ['/s3-leitlinie', '/de/s3_leitlinie'],
    ['/agb', '/de/terms'],
  ] as const) {
    const response = await request.get(source, { maxRedirects: 0 })
    expect(response.status(), source).toBe(301)
    expect(response.headers().location, source).toBe(target)
    const finalResponse = await request.get(target, { maxRedirects: 0 })
    expect(finalResponse.status(), target).toBe(200)
  }
})

test('PT08.4 existing canonical/hreflang output follows runtime locale truth', async ({
  request,
}) => {
  for (const locale of ['de', 'pl', 'fr', 'cs'] as const) {
    for (const route of [
      '/consumer/vitamin-d3-spray',
      '/s3_leitlinie',
      '/vitamin-d3-implantologie',
      '/diagnostics/dental',
      '/epigenetics',
    ]) {
      const response = await request.get(`/${locale}${route}`, { maxRedirects: 0 })
      expect(response.status()).toBe(200)
      const html = await response.text()

      expect(canonicalFrom(html), `${locale}${route}`).toBe(`${BASE_URL}/${locale}${route}`)
      for (const alternateLocale of SUPPORTED_LANGUAGES) {
        expect(alternateFrom(html, alternateLocale), `${locale}${route}:${alternateLocale}`).toBe(
          `${BASE_URL}/${alternateLocale}${route}`,
        )
      }
      expect(alternateFrom(html, 'x-default'), `${locale}${route}:x-default`).toBe(
        `${BASE_URL}/de${route}`,
      )
    }
  }
})
