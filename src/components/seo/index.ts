/**
 * SEO Components
 *
 * Export all SEO-related components and utilities.
 */

export { SEOHead, type SEOHeadProps } from './SEOHead'
export {
  PUBLIC_SEO_ORIGIN,
  SEO_INDEXABILITY_STATES,
  SEO_ROUTE_SOURCE,
  hreflangUrls,
  publicSeoUrl,
  resolveCanonicalUrl,
  type SEOIndexabilityState,
} from './seoRouteSource'

// Structured data helpers
export {
  organizationSchema,
  medicalBusinessSchema,
  websiteSchema,
  iglooProProductSchema,
  localBusinessSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  createArticleSchema,
  createServiceSchema,
  createEventSchema,
  createReviewSchema,
  type BreadcrumbItem,
  type FAQItem,
  type ArticleSchemaOptions,
  type ServiceSchemaOptions,
  type EventSchemaOptions,
  type ReviewSchemaOptions,
} from './structuredData'

// Re-export HelmetProvider for convenience
export { HelmetProvider } from 'react-helmet-async'
