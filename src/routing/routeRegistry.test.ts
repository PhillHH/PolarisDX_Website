import { describe, expect, it } from 'vitest'
import { BEFUND_ORDER } from '../content/befunde/meta'
import { articles } from '../data/articles'
import { services } from '../data/services'
import {
  DYNAMIC_ROUTE_DEFINITIONS,
  ROUTE_REGISTRY,
  getCanonicalRouteEntries,
  getDynamicSourceRecords,
  getRedirectRegistryEntries,
  getRouteTestMatrix,
  getSearchEligibleRouteEntries,
  getSitemapEligibleRouteEntries,
  isKnownCanonicalPath,
  resolveCanonicalRoute,
} from './routeRegistry'

describe('G1 route registry truth', () => {
  it('has unique family IDs, patterns and expanded canonical paths', () => {
    const ids = ROUTE_REGISTRY.map((route) => route.id)
    const patterns = ROUTE_REGISTRY.map((route) => route.pathPattern)
    const paths = getCanonicalRouteEntries().map((route) => route.path)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(patterns).size).toBe(patterns.length)
    expect(new Set(paths).size).toBe(paths.length)
  })

  it('expands dynamic slugs exclusively from real domain sources', () => {
    expect(getDynamicSourceRecords('SERVICES').map((entry) => entry.slug)).toEqual(
      services.map((service) => service.id),
    )
    expect(getDynamicSourceRecords('ARTICLES').map((entry) => entry.slug)).toEqual(
      articles.map((article) => article.slug),
    )
    expect(getDynamicSourceRecords('BEFUNDE').map((entry) => entry.slug)).toEqual(BEFUND_ORDER)
  })

  it('resolves concrete valid paths and rejects patterns, redirect sources and unknown slugs', () => {
    for (const route of getCanonicalRouteEntries()) {
      expect(resolveCanonicalRoute(route.path)?.id).toBe(route.id)
      expect(isKnownCanonicalPath(route.path)).toBe(true)
    }
    for (const invalid of [
      ...DYNAMIC_ROUTE_DEFINITIONS.map((route) => route.pathPattern),
      '/services',
      '/services/dental',
      '/diagnostics/not-real',
      '/articles/not-real',
      '/consumer',
    ]) {
      expect(isKnownCanonicalPath(invalid), invalid).toBe(false)
    }
  })

  it('derives sitemap, search, redirect and noindex matrices from the same metadata', () => {
    const matrix = getRouteTestMatrix()
    expect(matrix.sitemapEligible).toEqual(getSitemapEligibleRouteEntries())
    expect(matrix.searchEligible).toEqual(getSearchEligibleRouteEntries())
    expect(matrix.redirectSources).toEqual(getRedirectRegistryEntries())
    expect(matrix.sitemapEligible).toHaveLength(39)
    expect(matrix.searchEligible).toHaveLength(35)
    expect(matrix.noindex.map((route) => route.path).sort()).toEqual(
      ['/imprint', '/privacy', '/terms'].sort(),
    )
    expect(isKnownCanonicalPath(matrix.unknownStatic404)).toBe(false)
    expect(matrix.unknownDynamic404).toHaveLength(DYNAMIC_ROUTE_DEFINITIONS.length)
    for (const route of matrix.unknownDynamic404) {
      expect(isKnownCanonicalPath(route.path), route.path).toBe(false)
    }
  })

  it('classifies every redirect source and points directly to a canonical registry target', () => {
    const canonicalPaths = new Set(getCanonicalRouteEntries().map((route) => route.path))
    const redirects = getRedirectRegistryEntries()
    expect(new Set(redirects.map((route) => route.sourcePath)).size).toBe(redirects.length)
    for (const redirect of redirects) {
      expect(redirect.status).toBe(301)
      expect(canonicalPaths.has(redirect.targetPath), redirect.sourcePath).toBe(true)
      expect(redirect.targetPath).not.toBe(redirect.sourcePath)
    }
  })
})
