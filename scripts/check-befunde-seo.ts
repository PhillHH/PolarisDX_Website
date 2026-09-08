#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { TFunction } from 'i18next'
import { createServer, type ViteDevServer } from 'vite'
import { getSitemapUrlEntries } from '../src/components/seo/sitemap'
import { BEFUND_ORDER } from '../src/content/befunde/meta'
import { createSearchIndex } from '../src/hooks/useSearch'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../src/i18n'
import { getBefundRouteEntries, isKnownCanonicalPath } from '../src/routing/routeRegistry'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://polarisdx.net'
const FORBIDDEN_HOST = /preview\.polarisdx\.net|https?:\/\/(?:localhost|127\.0\.0\.1)/i
const FORBIDDEN_SCHEMA_TYPES = new Set([
  'MedicalTest',
  'MedicalCondition',
  'Product',
  'Offer',
  'Review',
])
const FORBIDDEN_SCHEMA_FIELDS = new Set([
  'offers',
  'price',
  'priceCurrency',
  'availability',
  'aggregateRating',
  'review',
  'diagnosis',
  'treatment',
])

type LocaleJson = Record<string, unknown>
type RenderResult = {
  html: string
  helmet: {
    title: { toString(): string }
    meta: { toString(): string }
    link: { toString(): string }
    script: { toString(): string }
  }
}

function readLocale(locale: string, namespace: string): LocaleJson {
  return JSON.parse(
    fs.readFileSync(path.join(ROOT, `public/locales/${locale}/${namespace}.json`), 'utf8'),
  ) as LocaleJson
}

function valueAt(source: LocaleJson, dottedPath: string): unknown {
  return dottedPath.split('.').reduce<unknown>((value, segment) => {
    if (!value || typeof value !== 'object') return undefined
    return (value as LocaleJson)[segment]
  }, source)
}

function requiredLocaleText(source: LocaleJson, key: string, label: string): string {
  const value = valueAt(source, key)
  if (typeof value !== 'string' || !value.trim() || value === key) {
    throw new Error(`${label}: missing visible locale text at ${key}`)
  }
  return value.trim()
}

function translatorFor(locale: string): TFunction {
  const namespaces = new Map<string, LocaleJson>()
  return ((key: string) => {
    const separator = key.indexOf(':')
    const namespace = separator === -1 ? 'common' : key.slice(0, separator)
    const nestedKey = separator === -1 ? key : key.slice(separator + 1)
    if (!namespaces.has(namespace)) namespaces.set(namespace, readLocale(locale, namespace))
    const value = valueAt(namespaces.get(namespace)!, nestedKey)
    return typeof value === 'string' ? value : key
  }) as TFunction
}

function tags(source: string, tagName: string): Array<Record<string, string>> {
  return [...source.matchAll(new RegExp(`<${tagName}\\b([^>]*)>`, 'gi'))].map((match) => {
    const attributes: Record<string, string> = {}
    for (const attribute of match[1].matchAll(/([:\w-]+)="([^"]*)"/g)) {
      attributes[attribute[1].toLowerCase()] = attribute[2]
    }
    return attributes
  })
}

function metaContent(source: string, attribute: 'name' | 'property', key: string): string {
  const matches = tags(source, 'meta').filter((tag) => tag[attribute] === key)
  if (matches.length !== 1 || !matches[0].content) {
    throw new Error(`Expected exactly one ${attribute}=${key}, got ${matches.length}`)
  }
  return matches[0].content
}

function assertSchemaSafety(value: unknown, context: string): void {
  if (Array.isArray(value)) {
    for (const child of value) assertSchemaSafety(child, context)
    return
  }
  if (!value || typeof value !== 'object') return
  const record = value as Record<string, unknown>
  if (typeof record['@type'] === 'string' && FORBIDDEN_SCHEMA_TYPES.has(record['@type'])) {
    throw new Error(`${context}: forbidden schema type ${record['@type']}`)
  }
  for (const [key, child] of Object.entries(record)) {
    if (FORBIDDEN_SCHEMA_FIELDS.has(key)) {
      throw new Error(`${context}: forbidden schema field ${key}`)
    }
    assertSchemaSafety(child, context)
  }
}

async function renderWithHead(
  render: (url: string, locale: string) => Promise<RenderResult>,
  url: string,
  locale: string,
): Promise<RenderResult> {
  let result = await render(url, locale)
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (/<title[^>]*>\s*[^<\s]/i.test(result.helmet.title.toString())) return result
    await new Promise<void>((resolve) => setTimeout(resolve, 25))
    result = await render(url, locale)
  }
  throw new Error(`${locale}${url}: SSR lazy head did not resolve`)
}

async function createSsrLoader(): Promise<{
  vite: ViteDevServer
  render: (url: string, locale: string) => Promise<RenderResult>
}> {
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'polaris-pt164-vite-'))
  const vite = await createServer({
    configFile: false,
    root: ROOT,
    cacheDir,
    esbuild: { jsx: 'automatic' },
    resolve: { alias: { '~': path.join(ROOT, 'src') } },
    ssr: { noExternal: ['react-helmet-async'] },
    server: {
      middlewareMode: true,
      hmr: false,
      watch: { ignored: ['**/email/**', '**/dist/**'] },
    },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true },
  })
  const module = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
    render: (url: string, locale: string) => Promise<RenderResult>
  }
  return { vite, render: module.render }
}

async function main(): Promise<void> {
  const reportRoutes = getBefundRouteEntries()
  if (reportRoutes.length !== BEFUND_ORDER.length) {
    throw new Error(`Registry exposes ${reportRoutes.length} instead of six report families`)
  }
  for (const slug of BEFUND_ORDER) {
    const pathName = `/epigenetics/musterbefund/${slug}`
    const route = reportRoutes.find((candidate) => candidate.sourceId === slug)
    if (!route || route.path !== pathName || !route.searchEligible || !route.sitemap) {
      throw new Error(`${slug}: registry SEO/search/sitemap contract is incomplete`)
    }
  }

  const sitemapEntries = getSitemapUrlEntries().filter((entry) => entry.family.kind === 'befund')
  if (sitemapEntries.length !== BEFUND_ORDER.length * SUPPORTED_LANGUAGES.length) {
    throw new Error(`Sitemap report matrix is ${sitemapEntries.length}/60`)
  }

  const expectedByLocale = new Map<string, Map<string, { title: string; description: string }>>()
  for (const locale of SUPPORTED_LANGUAGES) {
    const messages = readLocale(locale, 'epigenetics')
    const familyMetadata = new Map<string, { title: string; description: string }>()
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const slug of BEFUND_ORDER) {
      const title = requiredLocaleText(messages, `befund.seo.${slug}.title`, `${locale}/${slug}`)
      const description = requiredLocaleText(
        messages,
        `befund.seo.${slug}.description`,
        `${locale}/${slug}`,
      )
      if (FORBIDDEN_HOST.test(`${title} ${description}`)) {
        throw new Error(`${locale}/${slug}: preview/dev host in metadata`)
      }
      titles.add(title)
      descriptions.add(description)
      familyMetadata.set(slug, { title, description })
    }
    if (titles.size !== BEFUND_ORDER.length || descriptions.size !== BEFUND_ORDER.length) {
      throw new Error(`${locale}: report title/description search intents are not sixfold distinct`)
    }
    expectedByLocale.set(locale, familyMetadata)

    const searchReports = createSearchIndex(translatorFor(locale)).filter(
      (item) => item.type === 'befund',
    )
    if (searchReports.length !== BEFUND_ORDER.length) {
      throw new Error(`${locale}: Search exposes ${searchReports.length}/6 reports`)
    }
    for (const report of searchReports) {
      const slug = report.id.replace(/^befund-/, '')
      const expected = familyMetadata.get(slug)
      if (
        !expected ||
        report.path !== `/epigenetics/musterbefund/${slug}` ||
        report.title !== expected.title ||
        report.description !== expected.description
      ) {
        throw new Error(`${locale}/${slug}: Search metadata does not share report SEO truth`)
      }
    }
  }

  const { vite, render } = await createSsrLoader()
  try {
    for (const locale of SUPPORTED_LANGUAGES) {
      for (const slug of BEFUND_ORDER) {
        const relativePath = `/epigenetics/musterbefund/${slug}`
        const requestPath = `/${locale}${relativePath}`
        const canonical = `${ORIGIN}${requestPath}`
        const expected = expectedByLocale.get(locale)!.get(slug)!
        const result = await renderWithHead(render, requestPath, locale)
        const titleHtml = result.helmet.title.toString()
        const metaHtml = result.helmet.meta.toString()
        const linkHtml = result.helmet.link.toString()
        const scriptHtml = result.helmet.script.toString()
        const completeHead = `${titleHtml}${metaHtml}${linkHtml}${scriptHtml}`

        if (!titleHtml.includes(`${expected.title} | PolarisDX`)) {
          throw new Error(`${locale}/${slug}: SSR title does not match locale source`)
        }
        if (metaContent(metaHtml, 'name', 'description') !== expected.description) {
          throw new Error(`${locale}/${slug}: SSR description does not match locale source`)
        }
        if (!metaContent(metaHtml, 'name', 'robots').startsWith('index, follow')) {
          throw new Error(`${locale}/${slug}: report is not indexable`)
        }

        const canonicalLinks = tags(linkHtml, 'link').filter((tag) => tag.rel === 'canonical')
        if (canonicalLinks.length !== 1 || canonicalLinks[0].href !== canonical) {
          throw new Error(`${locale}/${slug}: self canonical failed`)
        }
        const alternates = tags(linkHtml, 'link').filter((tag) => tag.rel === 'alternate')
        if (alternates.length !== SUPPORTED_LANGUAGES.length + 1) {
          throw new Error(`${locale}/${slug}: hreflang matrix is ${alternates.length}/11`)
        }
        for (const alternateLocale of SUPPORTED_LANGUAGES) {
          const alternate = alternates.find((tag) => tag.hreflang === alternateLocale)
          if (alternate?.href !== `${ORIGIN}/${alternateLocale}${relativePath}`) {
            throw new Error(`${locale}/${slug}: bad hreflang ${alternateLocale}`)
          }
        }
        if (
          alternates.find((tag) => tag.hreflang === 'x-default')?.href !==
          `${ORIGIN}/${DEFAULT_LANGUAGE}${relativePath}`
        ) {
          throw new Error(`${locale}/${slug}: x-default is not German`)
        }

        for (const [attribute, key, expectedValue] of [
          ['property', 'og:type', 'article'],
          ['property', 'og:url', canonical],
          ['property', 'og:title', `${expected.title} | PolarisDX`],
          ['property', 'og:description', expected.description],
          ['property', 'og:image:alt', expected.title],
          ['name', 'twitter:url', canonical],
          ['name', 'twitter:title', `${expected.title} | PolarisDX`],
          ['name', 'twitter:description', expected.description],
          ['name', 'twitter:image:alt', expected.title],
        ] as const) {
          if (metaContent(metaHtml, attribute, key) !== expectedValue) {
            throw new Error(`${locale}/${slug}: ${key} drifted from visible truth`)
          }
        }
        const ogImage = metaContent(metaHtml, 'property', 'og:image')
        const twitterImage = metaContent(metaHtml, 'name', 'twitter:image')
        if (ogImage !== twitterImage || !ogImage.includes(`befund-${slug}@2x`)) {
          throw new Error(`${locale}/${slug}: social image is not the real family asset`)
        }

        const jsonLdMatch = scriptHtml.match(
          /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i,
        )
        if (!jsonLdMatch) throw new Error(`${locale}/${slug}: JSON-LD missing`)
        const schemas = JSON.parse(jsonLdMatch[1]) as Array<Record<string, unknown>>
        if (
          schemas.length !== 2 ||
          schemas[0]['@type'] !== 'Article' ||
          schemas[1]['@type'] !== 'BreadcrumbList'
        ) {
          throw new Error(`${locale}/${slug}: schema must be Article + BreadcrumbList only`)
        }
        assertSchemaSafety(schemas, `${locale}/${slug}`)
        if (
          schemas[0].url !== canonical ||
          schemas[0].inLanguage !== locale ||
          schemas[0].headline !== expected.title ||
          schemas[0].description !== expected.description ||
          schemas[0].image !== ogImage
        ) {
          throw new Error(`${locale}/${slug}: Article schema does not match visible metadata`)
        }
        if (FORBIDDEN_HOST.test(completeHead)) {
          throw new Error(`${locale}/${slug}: preview/dev leakage in SSR head`)
        }

        const sitemapEntry = sitemapEntries.find((entry) => entry.loc === canonical)
        if (!sitemapEntry || sitemapEntry.alternates.length !== SUPPORTED_LANGUAGES.length + 1) {
          throw new Error(`${locale}/${slug}: sitemap membership/alternates failed`)
        }
      }
    }

    const unknownPath = '/de/epigenetics/musterbefund/not-a-real-report'
    if (isKnownCanonicalPath('/epigenetics/musterbefund/not-a-real-report')) {
      throw new Error('Unknown report slug leaked into Known Paths')
    }
    const unknown = await renderWithHead(render, unknownPath, 'de')
    const unknownMeta = unknown.helmet.meta.toString()
    const unknownLinks = unknown.helmet.link.toString()
    if (!/name="prerender-status-code" content="404"/.test(unknownMeta)) {
      throw new Error('Unknown report slug does not emit the HTTP 404 marker')
    }
    if (metaContent(unknownMeta, 'name', 'robots') !== 'noindex, follow') {
      throw new Error('Unknown report slug does not emit noindex, follow')
    }
    if (tags(unknownLinks, 'link').some((tag) => ['canonical', 'alternate'].includes(tag.rel))) {
      throw new Error('Unknown report slug emits canonical/hreflang')
    }
    if (unknown.helmet.script.toString().includes('application/ld+json')) {
      throw new Error('Unknown report slug emits a valid report schema entity')
    }
  } finally {
    await vite.close()
  }

  console.log(
    'PT16.4 report SEO guard PASS: 6 families x 10 locales = 60/60 SSR heads; ' +
      'family-specific metadata/search/social images, canonical, hreflang x10 + x-default de, ' +
      'sitemap 60/60, Article + BreadcrumbList claim safety, preview leakage 0, unknown slug 404 SEO PASS.',
  )
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
