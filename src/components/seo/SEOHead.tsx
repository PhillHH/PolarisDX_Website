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

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

export interface SEOHeadProps {
  /** Page title (without brand suffix) */
  title: string;
  /** Meta description (150-160 characters recommended) */
  description: string;
  /** Canonical URL (defaults to current URL) */
  canonical?: string;
  /** Open Graph image URL (defaults to /og-image.jpg) */
  ogImage?: string;
  /** Open Graph type */
  ogType?: 'website' | 'article' | 'product';
  /** Set to true for pages that should not be indexed (e.g., legal pages) */
  noindex?: boolean;
  /** Additional JSON-LD structured data */
  structuredData?: object | object[];
  /** Alternate language versions for hreflang tags */
  alternateLanguages?: Array<{
    lang: string;
    url: string;
  }>;
  /** Article-specific metadata */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  /** Product-specific metadata */
  product?: {
    price?: string;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  };
  /** Keywords for meta keywords tag (optional, low SEO impact) */
  keywords?: string[];
  /** Critical images to preload for LCP optimization */
  preloadImages?: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SITE_NAME = 'PolarisDX';
const BASE_URL = 'https://polarisdx.net';
const DEFAULT_OG_IMAGE = '/og-image.jpg';
const DEFAULT_LOCALE = 'de_DE';

// Supported languages with their locale codes
const LOCALE_MAP: Record<string, string> = {
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
};

// =============================================================================
// COMPONENT
// =============================================================================

export function SEOHead({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData,
  alternateLanguages,
  article,
  product,
  keywords,
}: SEOHeadProps) {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Derived values
  const fullTitle = `${title} | ${SITE_NAME}`;
  const currentLang = i18n.language?.split('-')[0] || 'de';
  const locale = LOCALE_MAP[currentLang] || DEFAULT_LOCALE;
  const canonicalUrl = canonical || `${BASE_URL}${location.pathname}`;
  const ogImageUrl = ogImage?.startsWith('http')
    ? ogImage
    : `${BASE_URL}${ogImage || DEFAULT_OG_IMAGE}`;

  // Robots directive
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={currentLang} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Alternate locales for OG */}
      {Object.entries(LOCALE_MAP)
        .filter(([lang]) => lang !== currentLang)
        .map(([, localeCode]) => (
          <meta
            key={localeCode}
            property="og:locale:alternate"
            content={localeCode}
          />
        ))}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      <meta name="twitter:image:alt" content={title} />

      {/* Article-specific meta tags */}
      {article && ogType === 'article' && (
        <>
          {article.publishedTime && (
            <meta
              property="article:published_time"
              content={article.publishedTime}
            />
          )}
          {article.modifiedTime && (
            <meta
              property="article:modified_time"
              content={article.modifiedTime}
            />
          )}
          {article.author && (
            <meta property="article:author" content={article.author} />
          )}
          {article.section && (
            <meta property="article:section" content={article.section} />
          )}
          {article.tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Product-specific meta tags */}
      {product && ogType === 'product' && (
        <>
          {product.price && (
            <meta property="product:price:amount" content={product.price} />
          )}
          {product.currency && (
            <meta property="product:price:currency" content={product.currency} />
          )}
          {product.availability && (
            <meta
              property="product:availability"
              content={product.availability}
            />
          )}
        </>
      )}

      {/* Hreflang tags for alternate language versions */}
      {alternateLanguages?.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}

      {/* x-default hreflang (points to German as default) */}
      {alternateLanguages && alternateLanguages.length > 0 && (
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
      )}

      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(structuredData)
              ? structuredData
              : structuredData
          )}
        </script>
      )}

      {/* Note: preloadImages are NOT rendered inside <Helmet> because
          React 19 Float already auto-generates <link rel="preload"> for
          images encountered during renderToString(). The server strips
          these from inline output and moves them to <head>. */}
    </Helmet>
  );
}

export default SEOHead;
