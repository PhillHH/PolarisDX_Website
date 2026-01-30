/**
 * Structured Data Helpers
 *
 * Pre-built JSON-LD schemas for common use cases.
 * These can be passed to SEOHead's structuredData prop.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_URL = 'https://polarisdx.net';

// =============================================================================
// ORGANIZATION (singleton - use on all pages)
// =============================================================================

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'PolarisDX Europe UG',
  legalName: 'Polaris Diagnostics Europe UG (haftungsbeschränkt)',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/favicon.png`,
    width: 512,
    height: 512,
  },
  description:
    'PolarisDX ist Ihr Partner für Point-of-Care Diagnostik. Wir liefern den IglooPro POC-Reader für laborpräzise Sofortdiagnostik.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Große Bleichen 1-3',
    addressLocality: 'Hamburg',
    postalCode: '20354',
    addressCountry: 'DE',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+44-7879-433019',
    contactType: 'sales',
    availableLanguage: ['German', 'English'],
    areaServed: ['DE', 'AT', 'CH', 'GB'],
  },
  sameAs: ['https://www.linkedin.com/company/polarisdx'],
};

// =============================================================================
// WEBSITE (singleton - use on homepage)
// =============================================================================

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'PolarisDX',
  url: BASE_URL,
  description:
    'Point-of-Care Diagnostik für Zahnarztpraxen, Beauty-Center und Longevity-Kliniken',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: 'de-DE',
};

// =============================================================================
// PRODUCT (IglooPro)
// =============================================================================

export const iglooProProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${BASE_URL}/igloo-pro#product`,
  name: 'IglooPro POC-Reader',
  description:
    'Der IglooPro ist ein hochpräziser Point-of-Care Diagnostik-Reader für die sofortige Analyse von Biomarkern wie Vitamin D, CRP, HbA1c, TSH und mehr.',
  brand: {
    '@type': 'Brand',
    name: 'PolarisDX',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'DX365',
  },
  category: 'Medizinische Geräte > Point-of-Care Diagnostik',
  url: `${BASE_URL}/igloo-pro`,
  image: `${BASE_URL}/og-image.jpg`,
  offers: {
    '@type': 'Offer',
    url: `${BASE_URL}/contact`,
    availability: 'https://schema.org/InStock',
    priceCurrency: 'EUR',
    seller: {
      '@type': 'Organization',
      name: 'PolarisDX Europe UG',
    },
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '250',
    bestRating: '5',
    worstRating: '1',
  },
};

// =============================================================================
// BREADCRUMB GENERATOR
// =============================================================================

export function createBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

// =============================================================================
// FAQ SCHEMA GENERATOR
// =============================================================================

export function createFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// =============================================================================
// ARTICLE SCHEMA GENERATOR
// =============================================================================

export interface ArticleSchemaOptions {
  headline: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}

export function createArticleSchema(options: ArticleSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    description: options.description,
    image: options.image.startsWith('http')
      ? options.image
      : `${BASE_URL}${options.image}`,
    url: options.url.startsWith('http')
      ? options.url
      : `${BASE_URL}${options.url}`,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Organization',
      name: options.authorName || 'PolarisDX',
      url: BASE_URL,
    },
    publisher: {
      '@id': `${BASE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url.startsWith('http')
        ? options.url
        : `${BASE_URL}${options.url}`,
    },
  };
}

// =============================================================================
// SERVICE SCHEMA GENERATOR
// =============================================================================

export interface ServiceSchemaOptions {
  name: string;
  description: string;
  url: string;
  image?: string;
  areaServed?: string[];
}

export function createServiceSchema(options: ServiceSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: options.url.startsWith('http')
      ? options.url
      : `${BASE_URL}${options.url}`,
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: options.areaServed || ['DE', 'AT', 'CH'],
    ...(options.image && {
      image: options.image.startsWith('http')
        ? options.image
        : `${BASE_URL}${options.image}`,
    }),
  };
}

// =============================================================================
// LOCAL BUSINESS (for contact page)
// =============================================================================

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'PolarisDX Europe UG',
  image: `${BASE_URL}/favicon.png`,
  url: BASE_URL,
  telephone: '+44-7879-433019',
  email: 'info@polarisdx.net',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Große Bleichen 1-3',
    addressLocality: 'Hamburg',
    postalCode: '20354',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 53.5534,
    longitude: 9.9891,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },
  priceRange: '€€€',
  areaServed: ['DE', 'AT', 'CH'],
};
