import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, type SupportedLanguage } from '../../i18n'

/** The only public origin that productive SEO output may claim. */
export const PUBLIC_SEO_ORIGIN = 'https://polarisdx.net'

/**
 * Transitional AP09 route-source boundary.
 *
 * It deliberately contains no route table. Route matching remains in App.tsx
 * and server.ts until AP10 PT10.3. SEO consumes only the pathname of the route
 * React actually matched and the shared AP08 locale contract.
 */
export const SEO_ROUTE_SOURCE = {
  locales: SUPPORTED_LANGUAGES,
  defaultLocale: DEFAULT_LANGUAGE,
} as const

export const SEO_INDEXABILITY_STATES = {
  INDEX_FOLLOW: 'INDEX_FOLLOW',
  NOINDEX_FOLLOW: 'NOINDEX_FOLLOW',
  NOINDEX_NOFOLLOW: 'NOINDEX_NOFOLLOW',
  NOT_FOUND: 'NOT_FOUND',
  REDIRECT_SOURCE: 'REDIRECT_SOURCE',
  NON_PUBLIC: 'NON_PUBLIC',
} as const

export type SEOIndexabilityState = keyof typeof SEO_INDEXABILITY_STATES

function normalizedPath(pathname: string): string {
  const path = pathname.trim() || '/'
  return path.startsWith('/') ? path : `/${path}`
}

export function publicSeoUrl(locale: SupportedLanguage, pathname: string): string {
  return `${PUBLIC_SEO_ORIGIN}/${locale}${normalizedPath(pathname)}`
}

/**
 * Canonical overrides are an escape hatch, not permission to publish another
 * host. Relative overrides and absolute URLs on the public origin are valid;
 * preview/dev/foreign origins fail closed.
 */
export function resolveCanonicalUrl(
  override: string | undefined,
  locale: SupportedLanguage,
  pathname: string,
): string {
  if (!override) return publicSeoUrl(locale, pathname)

  const candidate = new URL(override, PUBLIC_SEO_ORIGIN)
  if (candidate.origin !== PUBLIC_SEO_ORIGIN) {
    throw new Error(`SEO canonical override must use ${PUBLIC_SEO_ORIGIN}`)
  }
  if (candidate.search || candidate.hash) {
    throw new Error('SEO canonical override must not contain a query string or fragment')
  }

  return candidate.toString()
}

export function hreflangUrls(
  pathname: string,
  locales: readonly SupportedLanguage[] = SEO_ROUTE_SOURCE.locales,
) {
  return locales.map((locale) => ({ locale, url: publicSeoUrl(locale, pathname) }))
}
