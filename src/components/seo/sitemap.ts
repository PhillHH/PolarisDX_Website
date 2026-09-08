import type { SupportedLanguage } from '../../i18n'
import {
  getSitemapEligibleRouteEntries,
  type SitemapChangeFrequency,
  type SitemapRouteKind,
} from '../../routing/routeRegistry'
import { SEO_ROUTE_SOURCE, publicSeoUrl } from './seoRouteSource'

export interface SitemapRouteFamily {
  path: string
  kind: SitemapRouteKind
  priority: number
  changefreq: SitemapChangeFrequency
  /** An honest, persistent content date. Omitted when no such source exists. */
  lastmod?: string
}

export interface SitemapUrlEntry {
  loc: string
  locale: SupportedLanguage
  family: SitemapRouteFamily
  alternates: ReadonlyArray<{ hreflang: SupportedLanguage | 'x-default'; href: string }>
}

export function getSitemapRouteFamilies(): SitemapRouteFamily[] {
  return getSitemapEligibleRouteEntries().map((route) => {
    if (!route.sitemap) throw new Error(`Registry sitemap policy missing for ${route.path}`)
    return { path: route.path, ...route.sitemap, lastmod: route.lastmod }
  })
}

export const CONSUMER_SITEMAP_PATHS = getSitemapRouteFamilies()
  .filter((family) => family.kind === 'consumer')
  .map((family) => family.path)

export function getSitemapUrlEntries(
  families: readonly SitemapRouteFamily[] = getSitemapRouteFamilies(),
): SitemapUrlEntry[] {
  return families.flatMap((family) =>
    SEO_ROUTE_SOURCE.locales.map((locale) => ({
      loc: publicSeoUrl(locale, family.path),
      locale,
      family,
      alternates: [
        ...SEO_ROUTE_SOURCE.locales.map((alternateLocale) => ({
          hreflang: alternateLocale,
          href: publicSeoUrl(alternateLocale, family.path),
        })),
        {
          hreflang: 'x-default' as const,
          href: publicSeoUrl(SEO_ROUTE_SOURCE.defaultLocale, family.path),
        },
      ],
    })),
  )
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export function generateSitemapXml(
  entries: readonly SitemapUrlEntry[] = getSitemapUrlEntries(),
): string {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ]

  for (const entry of entries) {
    lines.push('  <url>', `    <loc>${escapeXml(entry.loc)}</loc>`)
    if (entry.family.lastmod) {
      lines.push(`    <lastmod>${escapeXml(entry.family.lastmod)}</lastmod>`)
    }
    lines.push(
      `    <changefreq>${entry.family.changefreq}</changefreq>`,
      `    <priority>${entry.family.priority.toFixed(1)}</priority>`,
    )
    for (const alternate of entry.alternates) {
      lines.push(
        `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`,
      )
    }
    lines.push('  </url>')
  }

  lines.push('</urlset>', '')
  return lines.join('\n')
}
