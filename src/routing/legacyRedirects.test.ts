import { describe, expect, it } from 'vitest'
import routingContract from '../../building-docs/ROUTING-CONTRACT.md?raw'
import prerenderSource from '../../scripts/prerender.mjs?raw'
import { articles } from '../data/articles'
import { services } from '../data/services'
import { getCanonicalRouteEntries } from './routeRegistry'
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

    const canonicalTargets = new Set(getCanonicalRouteEntries().map((route) => route.path))
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

  it('keeps the obsolete prerender script disabled and non-authoritative', () => {
    expect(prerenderSource).toContain('LEGACY_NON_AUTHORITATIVE')
    expect(prerenderSource).not.toMatch(/const\s+ROUTES\s*=/)
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
