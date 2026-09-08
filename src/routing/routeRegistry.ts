import { BEFUND_ORDER, type BefundSlug } from '../content/befunde/meta'
export type { BefundSlug } from '../content/befunde/meta'
import { articles } from '../data/articles'
import { services } from '../data/services'
import { INTENTIONAL_404_PATHS, LEGACY_REDIRECT_MIGRATIONS } from './legacyRedirects'

export type RouteLocaleBehavior = 'LOCALIZED_X10'
export type RouteIndexability = 'INDEX_FOLLOW' | 'NOINDEX_NOFOLLOW'
export type RouteShell = 'B2B' | 'CONSUMER'
export type RouteType =
  | 'PAGE'
  | 'HUB'
  | 'SERVICE'
  | 'ARTICLE'
  | 'PRODUCT'
  | 'CONSUMER_PRODUCT'
  | 'EPIGENETICS'
  | 'REPORT'
  | 'EVENT'
  | 'RESOURCE'
  | 'SUPPORT'
  | 'LEGAL'
export type DynamicRouteSource = 'SERVICES' | 'ARTICLES' | 'BEFUNDE'
export type SitemapRouteKind = 'static' | 'consumer' | 'service' | 'article' | 'befund'
export type SitemapChangeFrequency = 'weekly' | 'monthly' | 'yearly'

export interface SitemapPolicy {
  kind: SitemapRouteKind
  priority: number
  changefreq: SitemapChangeFrequency
}

export interface StaticRouteDefinition {
  id: string
  pathPattern: string
  routeType: RouteType
  localeBehavior: RouteLocaleBehavior
  indexability: RouteIndexability
  sitemap: SitemapPolicy | false
  searchEligible: boolean
  knownPath: true
  appRoute: true
  shell: RouteShell
}

export interface DynamicRouteDefinition extends StaticRouteDefinition {
  dynamicSource: DynamicRouteSource
}

const x10 = 'LOCALIZED_X10' as const

/**
 * Central routing metadata for concrete application pages.
 *
 * Content remains in its domain sources. Dynamic slugs are expanded from
 * services, articles and Befund metadata below rather than copied here.
 */
export const STATIC_ROUTE_DEFINITIONS = [
  {
    id: 'home',
    pathPattern: '/',
    routeType: 'PAGE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 1, changefreq: 'weekly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'about',
    pathPattern: '/about',
    routeType: 'PAGE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.8, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'articles',
    pathPattern: '/articles',
    routeType: 'HUB',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.7, changefreq: 'weekly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'diagnostics',
    pathPattern: '/diagnostics',
    routeType: 'HUB',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.9, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'contact',
    pathPattern: '/contact',
    routeType: 'PAGE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.8, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'support',
    pathPattern: '/support',
    routeType: 'SUPPORT',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: false,
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'privacy',
    pathPattern: '/privacy',
    routeType: 'LEGAL',
    localeBehavior: x10,
    indexability: 'NOINDEX_NOFOLLOW',
    sitemap: false,
    searchEligible: false,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'imprint',
    pathPattern: '/imprint',
    routeType: 'LEGAL',
    localeBehavior: x10,
    indexability: 'NOINDEX_NOFOLLOW',
    sitemap: false,
    searchEligible: false,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'terms',
    pathPattern: '/terms',
    routeType: 'LEGAL',
    localeBehavior: x10,
    indexability: 'NOINDEX_NOFOLLOW',
    sitemap: false,
    searchEligible: false,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'events',
    pathPattern: '/events',
    routeType: 'EVENT',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.6, changefreq: 'weekly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'igloo-pro',
    pathPattern: '/igloo-pro',
    routeType: 'PRODUCT',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 1, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'implantology',
    pathPattern: '/vitamin-d3-implantologie',
    routeType: 'PAGE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.7, changefreq: 'monthly' },
    searchEligible: false,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 's3-guideline',
    pathPattern: '/s3_leitlinie',
    routeType: 'PAGE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.7, changefreq: 'monthly' },
    searchEligible: false,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'vitamin-d3-spray',
    pathPattern: '/vitamin-d3-spray',
    routeType: 'RESOURCE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.7, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  {
    id: 'epigenetics',
    pathPattern: '/epigenetics',
    routeType: 'EPIGENETICS',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.8, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  ...(['grundlagen', 'studienlage', 'unterlagen'] as const).map((slug) => ({
    id: `epigenetics-${slug}` as const,
    pathPattern: `/epigenetics/${slug}` as const,
    routeType: 'EPIGENETICS' as const,
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW' as const,
    sitemap: { kind: 'static' as const, priority: 0.6, changefreq: 'monthly' as const },
    searchEligible: true,
    knownPath: true as const,
    appRoute: true as const,
    shell: 'B2B' as const,
  })),
  {
    id: 'downloads',
    pathPattern: '/downloads',
    routeType: 'RESOURCE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'static', priority: 0.6, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
  },
  ...(['vitamin-d3-spray', 'hydrating-masks', 'inside-out-duo'] as const).map((slug) => ({
    id: `consumer-${slug}` as const,
    pathPattern: `/consumer/${slug}` as const,
    routeType: 'CONSUMER_PRODUCT' as const,
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW' as const,
    sitemap: { kind: 'consumer' as const, priority: 0.8, changefreq: 'weekly' as const },
    searchEligible: false,
    knownPath: true as const,
    appRoute: true as const,
    shell: 'CONSUMER' as const,
  })),
] as const satisfies readonly StaticRouteDefinition[]

export const DYNAMIC_ROUTE_DEFINITIONS = [
  {
    id: 'service-detail',
    pathPattern: '/diagnostics/:slug',
    routeType: 'SERVICE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'service', priority: 0.8, changefreq: 'monthly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
    dynamicSource: 'SERVICES',
  },
  {
    id: 'article-detail',
    pathPattern: '/articles/:slug',
    routeType: 'ARTICLE',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'article', priority: 0.6, changefreq: 'yearly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
    dynamicSource: 'ARTICLES',
  },
  {
    id: 'report-detail',
    pathPattern: '/epigenetics/musterbefund/:slug',
    routeType: 'REPORT',
    localeBehavior: x10,
    indexability: 'INDEX_FOLLOW',
    sitemap: { kind: 'befund', priority: 0.6, changefreq: 'yearly' },
    searchEligible: true,
    knownPath: true,
    appRoute: true,
    shell: 'B2B',
    dynamicSource: 'BEFUNDE',
  },
] as const satisfies readonly DynamicRouteDefinition[]

export type StaticRouteId = (typeof STATIC_ROUTE_DEFINITIONS)[number]['id']
export type DynamicRouteId = (typeof DYNAMIC_ROUTE_DEFINITIONS)[number]['id']
export type RouteDefinition =
  | (typeof STATIC_ROUTE_DEFINITIONS)[number]
  | (typeof DYNAMIC_ROUTE_DEFINITIONS)[number]
export const ROUTE_REGISTRY: readonly RouteDefinition[] = [
  ...STATIC_ROUTE_DEFINITIONS,
  ...DYNAMIC_ROUTE_DEFINITIONS,
]

interface DynamicSourceRecord {
  slug: string
  sourceId: string
  lastmod?: string
}

export function getDynamicSourceRecords(source: DynamicRouteSource): DynamicSourceRecord[] {
  if (source === 'SERVICES') {
    return services.map((service) => ({ slug: service.id, sourceId: service.id }))
  }
  if (source === 'ARTICLES') {
    return articles.map((article) => ({
      slug: article.slug,
      sourceId: article.id,
      lastmod: article.datePublished,
    }))
  }
  return BEFUND_ORDER.map((slug) => ({ slug, sourceId: slug }))
}

export interface CanonicalRouteEntry {
  id: string
  familyId: StaticRouteId | DynamicRouteId
  path: string
  pathPattern: string
  routeType: RouteType
  localeBehavior: RouteLocaleBehavior
  indexability: RouteIndexability
  sitemap: SitemapPolicy | false
  searchEligible: boolean
  shell: RouteShell
  sourceId?: string
  dynamicSource?: DynamicRouteSource
  lastmod?: string
}

export function getCanonicalRouteEntries(): CanonicalRouteEntry[] {
  const staticEntries: CanonicalRouteEntry[] = STATIC_ROUTE_DEFINITIONS.map((route) => ({
    ...route,
    id: route.id,
    familyId: route.id,
    path: route.pathPattern,
  }))
  const dynamicEntries = DYNAMIC_ROUTE_DEFINITIONS.flatMap((route) =>
    getDynamicSourceRecords(route.dynamicSource).map((record) => ({
      ...route,
      id: `${route.id}:${record.sourceId}`,
      familyId: route.id,
      path: route.pathPattern.replace(':slug', record.slug),
      sourceId: record.sourceId,
      lastmod: record.lastmod,
    })),
  )
  return [...staticEntries, ...dynamicEntries]
}

export function normalizeRoutePath(pathname: string): string {
  const withoutQueryOrHash = pathname.split(/[?#]/, 1)[0]
  const withSlash = withoutQueryOrHash.startsWith('/')
    ? withoutQueryOrHash
    : `/${withoutQueryOrHash}`
  return withSlash.replace(/\/+$/, '') || '/'
}

export function resolveCanonicalRoute(pathname: string): CanonicalRouteEntry | undefined {
  const path = normalizeRoutePath(pathname)
  return getCanonicalRouteEntries().find((route) => route.path === path)
}

export function isKnownCanonicalPath(pathname: string): boolean {
  return resolveCanonicalRoute(pathname) !== undefined
}

export function getSitemapEligibleRouteEntries(): CanonicalRouteEntry[] {
  return getCanonicalRouteEntries().filter(
    (route) => route.indexability === 'INDEX_FOLLOW' && route.sitemap !== false,
  )
}

export function getSearchEligibleRouteEntries(): CanonicalRouteEntry[] {
  return getCanonicalRouteEntries().filter((route) => route.searchEligible)
}

export function getStaticAppRoutes(shell?: RouteShell) {
  return STATIC_ROUTE_DEFINITIONS.filter((route) => !shell || route.shell === shell)
}

export function getDynamicAppRoutes() {
  return DYNAMIC_ROUTE_DEFINITIONS
}

export type BefundRouteEntry = CanonicalRouteEntry & {
  familyId: 'report-detail'
  sourceId: BefundSlug
}

export type ArticleRouteEntry = CanonicalRouteEntry & {
  familyId: 'article-detail'
  sourceId: string
}

export function getArticleRouteEntries(): ArticleRouteEntry[] {
  return getCanonicalRouteEntries().filter(
    (route): route is ArticleRouteEntry =>
      route.familyId === 'article-detail' && typeof route.sourceId === 'string',
  )
}

export function getBefundRouteEntries(): BefundRouteEntry[] {
  return getCanonicalRouteEntries().filter(
    (route): route is BefundRouteEntry =>
      route.familyId === 'report-detail' &&
      typeof route.sourceId === 'string' &&
      BEFUND_ORDER.includes(route.sourceId as BefundSlug),
  )
}

export interface RedirectRegistryEntry {
  id: string
  sourcePath: string
  targetPath: string
  routeType: 'REDIRECT_SOURCE'
  status: 301
  localeBehavior: RouteLocaleBehavior
  evidence: string
}

export function getRedirectRegistryEntries(): RedirectRegistryEntry[] {
  return [
    {
      id: 'redirect-services-hub',
      sourcePath: '/services',
      targetPath: '/diagnostics',
      routeType: 'REDIRECT_SOURCE',
      status: 301,
      localeBehavior: x10,
      evidence: 'SERVICES_HARD_MIGRATION',
    },
    ...services.map((service) => ({
      id: `redirect-service:${service.id}`,
      sourcePath: `/services/${service.id}`,
      targetPath: `/diagnostics/${service.id}`,
      routeType: 'REDIRECT_SOURCE' as const,
      status: 301 as const,
      localeBehavior: x10,
      evidence: 'SERVICES_HARD_MIGRATION',
    })),
    ...LEGACY_REDIRECT_MIGRATIONS.map((migration) => ({
      id: `redirect-legacy:${migration.sourcePath}`,
      sourcePath: migration.sourcePath,
      targetPath: migration.targetPath,
      routeType: 'REDIRECT_SOURCE' as const,
      status: 301 as const,
      localeBehavior: x10,
      evidence: migration.evidence,
    })),
  ]
}

export function getRegistryRedirectTarget(pathname: string): string | null {
  const path = normalizeRoutePath(pathname)
  return getRedirectRegistryEntries().find((entry) => entry.sourcePath === path)?.targetPath ?? null
}

export interface RouteTestMatrix {
  static200: CanonicalRouteEntry[]
  dynamic200: CanonicalRouteEntry[]
  sitemapEligible: CanonicalRouteEntry[]
  searchEligible: CanonicalRouteEntry[]
  redirectSources: RedirectRegistryEntry[]
  noindex: CanonicalRouteEntry[]
  intentional404: readonly string[]
  unknownStatic404: string
  unknownDynamic404: Array<{
    familyId: DynamicRouteId
    path: string
  }>
}

export function getRouteTestMatrix(): RouteTestMatrix {
  const canonical = getCanonicalRouteEntries()
  const unknownSlug = '__pt10-4-unknown-slug__'
  return {
    static200: canonical.filter((route) => !route.dynamicSource),
    dynamic200: canonical.filter((route) => route.dynamicSource),
    sitemapEligible: getSitemapEligibleRouteEntries(),
    searchEligible: getSearchEligibleRouteEntries(),
    redirectSources: getRedirectRegistryEntries(),
    noindex: canonical.filter((route) => route.indexability !== 'INDEX_FOLLOW'),
    intentional404: INTENTIONAL_404_PATHS,
    unknownStatic404: '/__pt10-4-unknown-static__',
    unknownDynamic404: DYNAMIC_ROUTE_DEFINITIONS.map((route) => ({
      familyId: route.id,
      path: route.pathPattern.replace(':slug', unknownSlug),
    })),
  }
}
