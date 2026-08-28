import { SaxesParser } from 'saxes'
import { BEFUND_ORDER } from '../../content/befunde/meta'
import { articles } from '../../data/articles'
import { services } from '../../data/services'
import { SEO_ROUTE_SOURCE } from './seoRouteSource'
import { CONSUMER_SITEMAP_PATHS, getSitemapRouteFamilies, type SitemapRouteFamily } from './sitemap'

const PUBLIC_ORIGIN = 'https://polarisdx.net'
const NOINDEX_PATHS = new Set(['/privacy', '/imprint', '/terms'])
const REDIRECT_SOURCE_PATHS = new Set(['/services', '/agb', '/s3-leitlinie'])

export interface SitemapGuardResult {
  routeFamilyCount: number
  urlCount: number
  uniqueUrlCount: number
  lastmodCount: number
}

function parseXmlOrThrow(xml: string): void {
  let parseError: Error | undefined
  const parser = new SaxesParser({ xmlns: true })
  parser.on('error', (error) => {
    parseError = error
  })
  parser.write(xml).close()
  if (parseError) throw parseError
}

function pathWithoutLocale(url: URL): { locale: string; path: string } {
  const [, locale, ...parts] = url.pathname.split('/')
  return { locale, path: parts.length === 0 ? '/' : `/${parts.join('/')}` }
}

function capture(block: string, pattern: RegExp): string | undefined {
  return pattern.exec(block)?.[1]
}

export function validateSitemapArtifact(
  xml: string,
  families: readonly SitemapRouteFamily[] = getSitemapRouteFamilies(),
): SitemapGuardResult {
  const errors: string[] = []
  try {
    parseXmlOrThrow(xml)
  } catch (error) {
    throw new Error(`Invalid sitemap XML: ${(error as Error).message}`)
  }

  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    errors.push('XML declaration must be UTF-8')
  }
  if (!xml.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
    errors.push('Missing sitemap namespace')
  }
  if (!xml.includes('xmlns:xhtml="http://www.w3.org/1999/xhtml"')) {
    errors.push('Missing XHTML namespace')
  }

  const familyPaths = new Set(families.map((family) => family.path))
  if (familyPaths.size !== families.length) errors.push('Duplicate route family')

  const expectedServices = new Set(services.map((service) => `/diagnostics/${service.id}`))
  const actualServices = new Set(
    families.filter((family) => family.kind === 'service').map((family) => family.path),
  )
  const expectedArticles = new Set(articles.map((article) => `/articles/${article.slug}`))
  const actualArticles = new Set(
    families.filter((family) => family.kind === 'article').map((family) => family.path),
  )
  const expectedBefunde = new Set(BEFUND_ORDER.map((slug) => `/epigenetics/musterbefund/${slug}`))
  const actualBefunde = new Set(
    families.filter((family) => family.kind === 'befund').map((family) => family.path),
  )
  const setEquals = (left: Set<string>, right: Set<string>) =>
    left.size === right.size && [...left].every((value) => right.has(value))
  if (!setEquals(expectedServices, actualServices)) errors.push('Service slug coverage drift')
  if (!setEquals(expectedArticles, actualArticles))
    errors.push('Published article slug coverage drift')
  if (!setEquals(expectedBefunde, actualBefunde)) errors.push('Musterbefund slug coverage drift')

  const blocks = xml.match(/<url>[^]*?<\/url>/g) ?? []
  const locs: string[] = []
  const alternateHrefs: string[] = []
  const coverage = new Map<string, Set<string>>()
  let lastmodCount = 0

  for (const block of blocks) {
    const loc = capture(block, /<loc>([^<]+)<\/loc>/)
    if (!loc) {
      errors.push('URL entry without loc')
      continue
    }
    locs.push(loc)

    let parsed: URL
    try {
      parsed = new URL(loc)
    } catch {
      errors.push(`Invalid absolute URL: ${loc}`)
      continue
    }
    if (parsed.origin !== PUBLIC_ORIGIN || parsed.protocol !== 'https:') {
      errors.push(`Non-public sitemap host: ${loc}`)
    }
    const { locale, path } = pathWithoutLocale(parsed)
    if (!(SEO_ROUTE_SOURCE.locales as readonly string[]).includes(locale)) {
      errors.push(`Unsupported sitemap locale: ${locale}`)
    }
    if (!familyPaths.has(path)) errors.push(`Unknown/404 sitemap path: ${path}`)
    if (NOINDEX_PATHS.has(path)) errors.push(`Noindex path in sitemap: ${path}`)
    if (REDIRECT_SOURCE_PATHS.has(path) || path.startsWith('/services/') || path === '/services') {
      errors.push(`Redirect source in sitemap: ${path}`)
    }
    const localeSet = coverage.get(path) ?? new Set<string>()
    localeSet.add(locale)
    coverage.set(path, localeSet)

    const family = families.find((candidate) => candidate.path === path)
    const lastmods = [...block.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])
    lastmodCount += lastmods.length
    if (lastmods.length > 1) errors.push(`Multiple lastmod values: ${loc}`)
    if (lastmods[0] && !/^\d{4}-\d{2}-\d{2}$/.test(lastmods[0])) {
      errors.push(`Invalid lastmod: ${loc}`)
    }
    if ((family?.lastmod ?? undefined) !== lastmods[0]) {
      errors.push(`Untrustworthy lastmod: ${loc}`)
    }

    const alternates = [...block.matchAll(/<xhtml:link\s+([^>]+)\/>/g)].map((match) => ({
      hreflang: capture(match[1], /hreflang="([^"]+)"/),
      href: capture(match[1], /href="([^"]+)"/),
    }))
    if (alternates.length !== SEO_ROUTE_SOURCE.locales.length + 1) {
      errors.push(`Wrong hreflang count: ${loc}`)
    }
    const languages = alternates.map((alternate) => alternate.hreflang)
    const expectedLanguages = [...SEO_ROUTE_SOURCE.locales, 'x-default']
    if (
      new Set(languages).size !== expectedLanguages.length ||
      expectedLanguages.some((language) => !languages.includes(language))
    ) {
      errors.push(`Hreflang language parity failure: ${loc}`)
    }
    const self = alternates.find((alternate) => alternate.hreflang === locale)
    if (self?.href !== loc) errors.push(`Missing hreflang self-reference: ${loc}`)
    const xDefault = alternates.find((alternate) => alternate.hreflang === 'x-default')
    if (xDefault?.href !== `${PUBLIC_ORIGIN}/de${path}`) {
      errors.push(`x-default is not German: ${loc}`)
    }
    for (const alternate of alternates) {
      if (!alternate.href?.startsWith(`${PUBLIC_ORIGIN}/`)) {
        errors.push(`Non-public hreflang target: ${alternate.href ?? 'missing'}`)
      } else {
        alternateHrefs.push(alternate.href)
      }
    }
  }

  const uniqueLocs = new Set(locs)
  if (uniqueLocs.size !== locs.length) errors.push('Duplicate sitemap URL')
  for (const alternateHref of alternateHrefs) {
    if (!uniqueLocs.has(alternateHref)) {
      errors.push(`Hreflang target is not a canonical sitemap URL: ${alternateHref}`)
    }
  }
  if (blocks.length !== families.length * SEO_ROUTE_SOURCE.locales.length) {
    errors.push('Sitemap URL count does not match route families × locales')
  }
  for (const family of families) {
    const locales = coverage.get(family.path) ?? new Set()
    if (
      locales.size !== SEO_ROUTE_SOURCE.locales.length ||
      SEO_ROUTE_SOURCE.locales.some((locale) => !locales.has(locale))
    ) {
      errors.push(`Missing locale expansion: ${family.path}`)
    }
  }
  for (const consumerPath of CONSUMER_SITEMAP_PATHS) {
    if (coverage.get(consumerPath)?.size !== SEO_ROUTE_SOURCE.locales.length) {
      errors.push(`Consumer x10 coverage failure: ${consumerPath}`)
    }
  }

  const allLocsHaveSameLastmod =
    lastmodCount === locs.length &&
    new Set([...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1])).size === 1
  if (locs.length > 0 && allLocsHaveSameLastmod) errors.push('Fake global lastmod detected')

  const previewPattern = /preview\.polarisdx\.net|localhost|127\.0\.0\.1|https?:\/\/[^/]+:\d+/i
  if (previewPattern.test(xml)) errors.push('Preview/dev host detected')

  if (errors.length > 0) throw new Error(errors.join('\n'))
  return {
    routeFamilyCount: families.length,
    urlCount: locs.length,
    uniqueUrlCount: uniqueLocs.size,
    lastmodCount,
  }
}
