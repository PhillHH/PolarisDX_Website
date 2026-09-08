// @vitest-environment node

import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { getSitemapRouteFamilies } from '../components/seo/sitemap'
import { articles } from '../data/articles'
import { createSearchIndex } from '../hooks/useSearch'
import { INTENTIONAL_404_PATHS } from './legacyRedirects'
import {
  getArticleRouteEntries,
  getRedirectRegistryEntries,
  resolveCanonicalRoute,
} from './routeRegistry'

const translate = ((key: string) => key) as TFunction
const retiredLocaleRecords = ['first_checkup', 'managing_diabetes', 'home_care'] as const

describe('PT17.3 article slug and internal-ID truth', () => {
  it('publishes exactly the canonical slugs and keeps internal IDs non-canonical', () => {
    const routes = getArticleRouteEntries()

    expect(routes).toHaveLength(articles.length)
    expect(routes.map(({ path }) => path)).toEqual(articles.map(({ slug }) => `/articles/${slug}`))
    for (const article of articles) {
      expect(resolveCanonicalRoute(`/articles/${article.slug}`)?.sourceId).toBe(article.id)
      expect(resolveCanonicalRoute(`/articles/${article.id}`)).toBeUndefined()
    }
  })

  it('keeps each evidenced ID migration one-hop and outside canonical targets', () => {
    const redirects = getRedirectRegistryEntries()

    for (const article of articles) {
      const sourcePath = `/articles/${article.id}`
      const targetPath = `/articles/${article.slug}`
      const migration = redirects.find((redirect) => redirect.sourcePath === sourcePath)

      expect(migration).toMatchObject({ sourcePath, targetPath, status: 301 })
      expect(resolveCanonicalRoute(targetPath)?.sourceId).toBe(article.id)
      expect(redirects.some((redirect) => redirect.sourcePath === targetPath)).toBe(false)
    }
  })

  it('derives Search and Sitemap article targets only from canonical slugs', () => {
    const searchPaths = createSearchIndex(translate)
      .filter(({ type }) => type === 'article')
      .map(({ path }) => path)
    const sitemapPaths = getSitemapRouteFamilies()
      .filter(({ kind }) => kind === 'article')
      .map(({ path }) => path)
    const canonicalPaths = articles.map(({ slug }) => `/articles/${slug}`)

    expect(searchPaths).toEqual(canonicalPaths)
    expect(sitemapPaths).toEqual(canonicalPaths)
    for (const article of articles) {
      expect(searchPaths).not.toContain(`/articles/${article.id}`)
      expect(sitemapPaths).not.toContain(`/articles/${article.id}`)
    }
  })

  it('keeps locale-only retired records as direct 404 rather than invented migrations', () => {
    const redirects = getRedirectRegistryEntries()

    for (const id of retiredLocaleRecords) {
      const path = `/articles/${id}`
      expect(INTENTIONAL_404_PATHS).toContain(path)
      expect(redirects.some((redirect) => redirect.sourcePath === path)).toBe(false)
      expect(resolveCanonicalRoute(path)).toBeUndefined()
    }
  })
})
