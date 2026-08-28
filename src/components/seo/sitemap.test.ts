import { describe, expect, it } from 'vitest'
import { articles } from '../../data/articles'
import { services } from '../../data/services'
import { SEO_ROUTE_SOURCE } from './seoRouteSource'
import { generateSitemapXml, getSitemapRouteFamilies, getSitemapUrlEntries } from './sitemap'
import { validateSitemapArtifact } from './sitemapGuard'

const families = getSitemapRouteFamilies()
const entries = getSitemapUrlEntries(families)
const xml = generateSitemapXml(entries)

describe('PT09.2 sitemap contract', () => {
  it('emits 39 real route families as 390 unique public URLs', () => {
    expect(families).toHaveLength(39)
    expect(entries).toHaveLength(390)
    expect(new Set(entries.map((entry) => entry.loc)).size).toBe(390)
    expect(entries.every((entry) => entry.loc.startsWith('https://polarisdx.net/'))).toBe(true)
  })

  it('expands every family over exactly the shared ten locales', () => {
    for (const family of families) {
      const familyEntries = entries.filter((entry) => entry.family.path === family.path)
      expect(familyEntries.map((entry) => entry.locale)).toEqual(SEO_ROUTE_SOURCE.locales)
    }
  })

  it('covers all three consumer routes x10 without EN-only behavior', () => {
    const consumerEntries = entries.filter((entry) => entry.family.kind === 'consumer')
    expect(consumerEntries).toHaveLength(30)
    expect(new Set(consumerEntries.map((entry) => entry.family.path)).size).toBe(3)
  })

  it('covers the Epigenetics hub, three deepening routes and six Befunde x10', () => {
    const epigeneticsPaths = [
      '/epigenetics',
      '/epigenetics/grundlagen',
      '/epigenetics/studienlage',
      '/epigenetics/unterlagen',
    ]
    for (const path of epigeneticsPaths) {
      expect(entries.filter((entry) => entry.family.path === path)).toHaveLength(10)
    }
    expect(entries.filter((entry) => entry.family.kind === 'befund')).toHaveLength(60)
  })

  it('derives service and article slugs from their content sources', () => {
    expect(
      families.filter((family) => family.kind === 'service').map((family) => family.path),
    ).toEqual(services.map((service) => `/diagnostics/${service.id}`))
    expect(
      families.filter((family) => family.kind === 'article').map((family) => family.path),
    ).toEqual(articles.map((article) => `/articles/${article.slug}`))
  })

  it('emits ten hreflang alternates, German x-default and a self-reference per URL', () => {
    for (const entry of entries) {
      expect(entry.alternates).toHaveLength(11)
      expect(entry.alternates.find((alternate) => alternate.hreflang === entry.locale)?.href).toBe(
        entry.loc,
      )
      expect(entry.alternates.find((alternate) => alternate.hreflang === 'x-default')?.href).toBe(
        `https://polarisdx.net/de${entry.family.path}`,
      )
    }
  })

  it('excludes legal noindex, support utility, redirect sources and unknown routes', () => {
    const paths = new Set(families.map((family) => family.path))
    for (const excluded of [
      '/privacy',
      '/imprint',
      '/terms',
      '/support',
      '/services',
      '/services/dental',
      '/unknown',
    ]) {
      expect(paths.has(excluded)).toBe(false)
    }
  })

  it('uses article publication metadata and omits lastmod without a trustworthy date', () => {
    const articleEntries = entries.filter((entry) => entry.family.kind === 'article')
    const nonArticleEntries = entries.filter((entry) => entry.family.kind !== 'article')
    expect(articleEntries).toHaveLength(60)
    expect(
      articleEntries.every((entry) => /^2025-\d{2}-\d{2}$/.test(entry.family.lastmod ?? '')),
    ).toBe(true)
    expect(nonArticleEntries.every((entry) => entry.family.lastmod === undefined)).toBe(true)
    expect(xml).not.toContain(new Date().toISOString().slice(0, 10))
  })

  it('produces namespace-correct, parseable XML accepted by G3', () => {
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
    expect(xml).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"')
    expect(validateSitemapArtifact(xml, families)).toEqual({
      routeFamilyCount: 39,
      urlCount: 390,
      uniqueUrlCount: 390,
      lastmodCount: 60,
    })
  })

  it.each([
    [
      'duplicate URL',
      xml.replace('</urlset>', `${xml.match(/[ ]{2}<url>[^]*?[ ]{2}<\/url>\n/)?.[0]}</urlset>`),
    ],
    ['preview host', xml.replace('https://polarisdx.net', 'https://preview.polarisdx.net')],
    ['invalid XML', xml.replace('</urlset>', '')],
    ['noindex target', xml.replaceAll('/about', '/privacy')],
  ])('fails hard for %s', (_name, invalidXml) => {
    expect(() => validateSitemapArtifact(invalidXml, families)).toThrow()
  })
})
