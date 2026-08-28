/**
 * SEOHead Component
 *
 * Manages dynamic <head> meta tags for each page.
 * Uses react-helmet-async for SSR-safe head management.
 *
 * @example
 * <SEOHead
 *   title="IglooPro POC-Reader"
 *   description="Laborpräzise Diagnostik in 3-15 Minuten"
 * />
 */

import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { DEFAULT_LANGUAGE, normalizeLanguage, type SupportedLanguage } from '../../i18n'
import {
  PUBLIC_SEO_ORIGIN,
  SEO_ROUTE_SOURCE,
  hreflangUrls,
  publicSeoUrl,
  resolveCanonicalUrl,
  type SEOIndexabilityState,
} from './seoRouteSource'

// =============================================================================
// TYPES
// =============================================================================

export interface SEOHeadProps {
  /** Page title (without brand suffix) */
  title: string
  /** Meta description (150-160 characters recommended) */
  description: string
  /** Canonical URL override (auto-generated with lang prefix by default) */
  canonical?: string
  /** Real published locale set; defaults to the complete AP08 x10 contract. */
  alternateLocales?: readonly SupportedLanguage[]
  /** Open Graph image URL (defaults to /og-image.jpg) */
  ogImage?: string
  /** Open Graph type */
  ogType?: 'website' | 'article' | 'product'
  /** Set to true for pages that should not be indexed (e.g., legal pages) */
  noindex?: boolean
  /** Explicit SEO state; legacy noindex/notFound props remain supported. */
  indexability?: SEOIndexabilityState
  /**
   * Set to true when this render IS an error page (catch-all route, unknown
   * article slug). It does three things at once, because they only ever make
   * sense together:
   *   - robots becomes 'noindex, follow' (implies noindex, ignores that prop)
   *   - no canonical, no hreflang, no og:locale:alternate — an error page must
   *     not advertise itself as a valid URL in ten languages
   *   - emits <meta name="prerender-status-code" content="404">, which the SSR
   *     server (server.ts) reads to answer a real HTTP 404
   */
  notFound?: boolean
  /** Additional JSON-LD structured data */
  structuredData?: object | object[]
  /** Article-specific metadata */
  article?: {
    publishedTime?: string
    modifiedTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  /** Product-specific metadata */
  product?: {
    price?: string
    currency?: string
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
  }
  /** Keywords for meta keywords tag (optional, low SEO impact) */
  keywords?: string[]
  /** Critical images to preload for LCP optimization */
  preloadImages?: string[]
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SITE_NAME = 'PolarisDX'
const DEFAULT_OG_IMAGE = '/og-image.jpg'
const DEFAULT_LOCALE = 'de_DE'

// Supported languages with their locale codes
const LOCALE_MAP: Record<SupportedLanguage, string> = {
  de: 'de_DE',
  en: 'en_GB',
  pl: 'pl_PL',
  fr: 'fr_FR',
  it: 'it_IT',
  es: 'es_ES',
  pt: 'pt_PT',
  da: 'da_DK',
  nl: 'nl_NL',
  cs: 'cs_CZ',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function SEOHead({
  title,
  description,
  canonical,
  alternateLocales = SEO_ROUTE_SOURCE.locales,
  ogImage,
  ogType = 'website',
  noindex = false,
  notFound = false,
  indexability,
  structuredData,
  article,
  product,
  keywords,
}: SEOHeadProps) {
  const { i18n } = useTranslation()
  const location = useLocation()

  // Derived values
  const cleanTitle = title.trim()
  const cleanDescription = description.trim()
  const translationKeyPattern = /^[a-z][\w-]*(?::[\w-]+)?(?:\.[\w-]+)+$/i
  if (!cleanTitle || !cleanDescription) {
    throw new Error('SEOHead requires a non-empty title and description')
  }
  if (translationKeyPattern.test(cleanTitle) || translationKeyPattern.test(cleanDescription)) {
    throw new Error('SEOHead received a visible translation key')
  }

  const fullTitle = cleanTitle.endsWith(`| ${SITE_NAME}`)
    ? cleanTitle
    : `${cleanTitle} | ${SITE_NAME}`
  const currentLang = normalizeLanguage(i18n.resolvedLanguage || i18n.language)
  const locale = LOCALE_MAP[currentLang] || DEFAULT_LOCALE

  // location.pathname returns path WITHOUT lang prefix (BrowserRouter basename strips it)
  // Build canonical with lang prefix: https://polarisdx.net/de/about
  const path = location.pathname

  // An error page has no valid alternates in any language, so the list stays
  // empty for it — see the notFound prop.
  const legacyState: SEOIndexabilityState = notFound
    ? 'NOT_FOUND'
    : noindex
      ? 'NOINDEX_NOFOLLOW'
      : 'INDEX_FOLLOW'
  if (indexability && (notFound || noindex) && indexability !== legacyState) {
    throw new Error('SEOHead received contradictory indexability props')
  }
  const state = indexability || legacyState
  const isNotFound = state === 'NOT_FOUND'
  const hasCanonical = !['NOT_FOUND', 'REDIRECT_SOURCE', 'NON_PUBLIC'].includes(state)
  const hasAlternates = state === 'INDEX_FOLLOW'
  const publishedLocales = [...new Set(alternateLocales)]
  if (hasAlternates && publishedLocales.length !== alternateLocales.length) {
    throw new Error('SEOHead alternate locales must be unique')
  }
  if (
    hasAlternates &&
    (!publishedLocales.includes(currentLang) || !publishedLocales.includes(DEFAULT_LANGUAGE))
  ) {
    throw new Error('SEOHead alternates must include the current locale and German x-default')
  }
  const canonicalUrl = hasCanonical ? resolveCanonicalUrl(canonical, currentLang, path) : undefined

  const ogImageUrl = new URL(ogImage || DEFAULT_OG_IMAGE, PUBLIC_SEO_ORIGIN)
  if (ogImageUrl.origin !== PUBLIC_SEO_ORIGIN) {
    throw new Error(`SEO image must use ${PUBLIC_SEO_ORIGIN}`)
  }

  // Robots directive.
  //
  // An error page must never be indexed, but crawlers should still follow the
  // links leading out of it (home, popular pages, article index) — hence
  // 'noindex, follow' rather than the 'noindex, nofollow' the legal pages use.
  const robotsContent =
    state === 'INDEX_FOLLOW'
      ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      : state === 'NOINDEX_FOLLOW' || state === 'NOT_FOUND'
        ? 'noindex, follow'
        : 'noindex, nofollow'

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      {/* Read by server.ts to turn a rendered error page into a real 404
          response instead of a 200 that crawlers treat as a valid page. */}
      {isNotFound && <meta name="prerender-status-code" content="404" />}
      {hasCanonical && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {hasCanonical && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:image" content={ogImageUrl.toString()} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={cleanTitle} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Alternate locales for OG (none on error pages) */}
      {hasAlternates &&
        publishedLocales
          .filter((lang) => lang !== currentLang)
          .map((lang) => [lang, LOCALE_MAP[lang]] as const)
          .map(([, localeCode]) => (
            <meta key={localeCode} property="og:locale:alternate" content={localeCode} />
          ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      {hasCanonical && <meta name="twitter:url" content={canonicalUrl} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      <meta name="twitter:image" content={ogImageUrl.toString()} />
      <meta name="twitter:image:alt" content={cleanTitle} />

      {/* Article-specific meta tags */}
      {article && ogType === 'article' && (
        <>
          {article.publishedTime && (
            <meta property="article:published_time" content={article.publishedTime} />
          )}
          {article.modifiedTime && (
            <meta property="article:modified_time" content={article.modifiedTime} />
          )}
          {article.author && <meta property="article:author" content={article.author} />}
          {article.section && <meta property="article:section" content={article.section} />}
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Product-specific meta tags */}
      {product && ogType === 'product' && (
        <>
          {product.price && <meta property="product:price:amount" content={product.price} />}
          {product.currency && (
            <meta property="product:price:currency" content={product.currency} />
          )}
          {product.availability && (
            <meta property="product:availability" content={product.availability} />
          )}
        </>
      )}

      {/* Hreflang tags for the existing ten-language route contract. */}
      {hasAlternates &&
        hreflangUrls(path, publishedLocales).map(({ locale: lang, url }) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}

      {/* x-default hreflang (points to German as primary market) */}
      {hasAlternates && (
        <link rel="alternate" hrefLang="x-default" href={publicSeoUrl(DEFAULT_LANGUAGE, path)} />
      )}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(structuredData) ? structuredData : structuredData)}
        </script>
      )}

      {/* Note: preloadImages are NOT rendered inside <Helmet> because
          React 19 Float already auto-generates <link rel="preload"> for
          images encountered during renderToString(). The server strips
          these from inline output and moves them to <head>. */}
    </Helmet>
  )
}

export default SEOHead
