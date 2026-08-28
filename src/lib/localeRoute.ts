import { getLanguageFromPathname, type SupportedLanguage } from '../i18n'

export interface LocaleRouteLocation {
  pathname: string
  search?: string
  hash?: string
}

/**
 * Builds the hard-navigation target for a language change.
 *
 * React Router normally supplies a pathname without its basename, but the
 * helper also accepts a full locale-prefixed pathname. This keeps the URL as
 * the sole locale truth without duplicating a prefix and preserves the current
 * logical path, query string and fragment verbatim.
 */
export function buildLanguageSwitchUrl(
  location: LocaleRouteLocation,
  targetLanguage: SupportedLanguage,
): string {
  const currentPrefix = getLanguageFromPathname(location.pathname)
  const pathWithoutLocale = currentPrefix
    ? location.pathname.slice(`/${currentPrefix}`.length) || '/'
    : location.pathname || '/'
  const pathname = pathWithoutLocale.startsWith('/') ? pathWithoutLocale : `/${pathWithoutLocale}`

  return `/${targetLanguage}${pathname}${location.search || ''}${location.hash || ''}`
}
