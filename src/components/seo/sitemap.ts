import { BEFUND_ORDER } from '../../content/befunde/meta'
import { articles } from '../../data/articles'
import { services } from '../../data/services'
import type { SupportedLanguage } from '../../i18n'
import { SEO_ROUTE_SOURCE, publicSeoUrl } from './seoRouteSource'

export type SitemapChangeFrequency = 'weekly' | 'monthly' | 'yearly'

export interface SitemapRouteFamily {
  path: string
  kind: 'static' | 'consumer' | 'service' | 'article' | 'befund'
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

/**
 * Existing sitemap-specific manual route mirror, pending DG09-01/AP10 PT10.3.
 * Dynamic routes are deliberately absent and are derived from their content
 * sources below. This replaces server.ts's prior SITEMAP_ROUTES table; it does
 * not add a fifth route list or attempt to become the central route registry.
 */
const MANUAL_SITEMAP_FAMILIES: readonly SitemapRouteFamily[] = [
  { path: '/', kind: 'static', priority: 1, changefreq: 'weekly' },
  { path: '/igloo-pro', kind: 'static', priority: 1, changefreq: 'monthly' },
  { path: '/diagnostics', kind: 'static', priority: 0.9, changefreq: 'monthly' },
  { path: '/about', kind: 'static', priority: 0.8, changefreq: 'monthly' },
  { path: '/contact', kind: 'static', priority: 0.8, changefreq: 'monthly' },
  { path: '/articles', kind: 'static', priority: 0.7, changefreq: 'weekly' },
  { path: '/epigenetics', kind: 'static', priority: 0.8, changefreq: 'monthly' },
  { path: '/epigenetics/grundlagen', kind: 'static', priority: 0.6, changefreq: 'monthly' },
  { path: '/epigenetics/studienlage', kind: 'static', priority: 0.6, changefreq: 'monthly' },
  { path: '/epigenetics/unterlagen', kind: 'static', priority: 0.6, changefreq: 'monthly' },
  { path: '/events', kind: 'static', priority: 0.6, changefreq: 'weekly' },
  { path: '/downloads', kind: 'static', priority: 0.6, changefreq: 'monthly' },
  { path: '/vitamin-d3-spray', kind: 'static', priority: 0.7, changefreq: 'monthly' },
  { path: '/s3_leitlinie', kind: 'static', priority: 0.7, changefreq: 'monthly' },
  {
    path: '/vitamin-d3-implantologie',
    kind: 'static',
    priority: 0.7,
    changefreq: 'monthly',
  },
  {
    path: '/consumer/vitamin-d3-spray',
    kind: 'consumer',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/consumer/hydrating-masks',
    kind: 'consumer',
    priority: 0.8,
    changefreq: 'weekly',
  },
  {
    path: '/consumer/inside-out-duo',
    kind: 'consumer',
    priority: 0.8,
    changefreq: 'weekly',
  },
]

/** Derived from the one existing manual sitemap subset, not a second route list. */
export const CONSUMER_SITEMAP_PATHS = MANUAL_SITEMAP_FAMILIES.filter(
  (family) => family.kind === 'consumer',
).map((family) => family.path)

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
}

function publishedDateToIso(value: string): string {
  const match = /^(\d{2}) ([A-Z][a-z]{2}) (\d{4})$/.exec(value)
  const month = match ? MONTHS[match[2]] : undefined
  if (!match || !month) {
    throw new Error(`Article publication date is not trustworthy: ${value}`)
  }
  return `${match[3]}-${month}-${match[1]}`
}

/**
 * Transitional AP09 sitemap route-source adapter. The manual subset replaces
 * the old server-local table; all dynamic slugs come from their canonical
 * content sources. AP10 PT10.3 will replace this aggregate via DG09-01.
 */
export function getSitemapRouteFamilies(): SitemapRouteFamily[] {
  return [
    ...MANUAL_SITEMAP_FAMILIES,
    ...services.map((service) => ({
      path: `/diagnostics/${service.id}`,
      kind: 'service' as const,
      priority: 0.8,
      changefreq: 'monthly' as const,
    })),
    ...articles.map((article) => ({
      path: `/articles/${article.slug}`,
      kind: 'article' as const,
      priority: 0.6,
      changefreq: 'yearly' as const,
      lastmod: publishedDateToIso(article.date),
    })),
    ...BEFUND_ORDER.map((slug) => ({
      path: `/epigenetics/musterbefund/${slug}`,
      kind: 'befund' as const,
      priority: 0.6,
      changefreq: 'yearly' as const,
    })),
  ]
}

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
