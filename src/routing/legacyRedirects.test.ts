import { describe, expect, it } from 'vitest'
import routingContract from '../../building-docs/ROUTING-CONTRACT.md?raw'
// The Vite `?raw` transform supplies the default string export; the static
// import resolver only sees the executable .mjs source and cannot infer it.
// eslint-disable-next-line import/default
import prerenderSource from '../../scripts/prerender.mjs?raw'
import { getSitemapRouteFamilies } from '../components/seo/sitemap'
import { articles } from '../data/articles'
import { services } from '../data/services'
import {
  getLegacyRedirectTarget,
  INTENTIONAL_404_PATHS,
  LEGACY_REDIRECT_MIGRATIONS,
} from './legacyRedirects'

describe('PT10.2 legacy URL migration map', () => {
  it('maps every current article ID to its real route slug', () => {
    for (const article of articles) {
      expect(getLegacyRedirectTarget(`/articles/${article.id}`)).toBe(`/articles/${article.slug}`)
    }
  })

  it('maps underscore service slugs directly from both known legacy namespaces', () => {
    const changed = services.filter((service) => service.translationKey !== service.id)
    expect(changed).toHaveLength(6)

    for (const service of changed) {
      expect(getLegacyRedirectTarget(`/diagnostics/${service.translationKey}`)).toBe(
        `/diagnostics/${service.id}`,
      )
      expect(getLegacyRedirectTarget(`/services/${service.translationKey}`)).toBe(
        `/diagnostics/${service.id}`,
      )
    }
  })

  it('has unique sources and only real canonical targets', () => {
    const sources = LEGACY_REDIRECT_MIGRATIONS.map((migration) => migration.sourcePath)
    expect(new Set(sources).size).toBe(sources.length)

    const canonicalTargets = new Set(getSitemapRouteFamilies().map((family) => family.path))
    canonicalTargets.add('/terms')
    for (const migration of LEGACY_REDIRECT_MIGRATIONS) {
      expect(canonicalTargets.has(migration.targetPath), migration.sourcePath).toBe(true)
      expect(sources).not.toContain(migration.targetPath)
      expect(migration.targetPath).not.toBe('/')
    }
  })

  it('classifies removed articles and locked backlog paths as intentional 404', () => {
    expect(INTENTIONAL_404_PATHS).toEqual([
      '/articles/first_checkup',
      '/articles/managing_diabetes',
      '/articles/home_care',
      '/consumer',
      '/shop',
      '/casestudys/32reasons',
      '/case-studies/32reasons',
      '/deal',
      '/voucher',
    ])
    expect(INTENTIONAL_404_PATHS).not.toContain('/')
  })

  it('classifies every active path in the stale prerender catalogue', () => {
    const routesBlock = prerenderSource.match(/const ROUTES = \[([\s\S]*?)\n\]/)?.[1]
    expect(routesBlock).toBeTruthy()

    const activePaths = [...(routesBlock ?? '').matchAll(/^\s*'([^']+)',/gm)].map(
      (match) => match[1],
    )
    const canonicalPaths = new Set(getSitemapRouteFamilies().map((family) => family.path))
    for (const legalPath of ['/privacy', '/imprint', '/terms']) canonicalPaths.add(legalPath)

    for (const stalePath of activePaths) {
      const classified =
        canonicalPaths.has(stalePath) ||
        getLegacyRedirectTarget(stalePath) !== null ||
        (INTENTIONAL_404_PATHS as readonly string[]).includes(stalePath)
      expect(classified, `unclassified prerender path: ${stalePath}`).toBe(true)
    }
  })

  it('records all four required decision statuses and the AP29 handoff in the contract', () => {
    for (const status of [
      'REDIRECT_301',
      'GONE_OR_404_INTENTIONAL',
      'CURRENT_CANONICAL',
      'DEFERRED_MIGRATION_DISCOVERY',
    ]) {
      expect(routingContract).toContain(status)
    }
    expect(routingContract).toMatch(/DEFERRED_MIGRATION_DISCOVERY[\s\S]*AP29/)
  })
})
