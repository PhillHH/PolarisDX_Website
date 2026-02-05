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
// MEDICAL BUSINESS (singleton - use on homepage)
// =============================================================================

export const medicalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${BASE_URL}/#organization`,
  name: 'PolarisDX Europe UG',
  alternateName: 'PolarisDX',
  url: BASE_URL,
  logo: `${BASE_URL}/favicon.png`,
  description:
    'Partner für Point-of-Care Diagnostik in Europa. Geräte, Schnelltests, Beratung und Begleitung für Dental, Longevity und Beauty.',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'Große Bleichen 1-3',
      addressLocality: 'Hamburg',
      postalCode: '20354',
      addressCountry: 'DE',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '262A Fulham Road',
      addressLocality: 'London',
      postalCode: 'SW10 9EL',
      addressCountry: 'GB',
    },
  ],
  email: 'contact@polarisdx.net',
  telephone: '+49 151 75011699',
  foundingLocation: 'Hamburg, Germany',
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 48.5,
      longitude: 10.5,
    },
    geoRadius: '1000 km',
    description: 'DACH-Region (Deutschland, Österreich, Schweiz)',
  },
  sameAs: ['https://www.linkedin.com/company/polarisdx'],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '250',
    bestRating: '5',
  },
};

// =============================================================================
// ORGANIZATION (legacy - kept for backwards compatibility)
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
    'Point-of-Care Analysegerät für die patientennahe Sofortdiagnostik. Misst Vitamin D3, CRP, HbA1c, TSH und weitere Biomarker in 3–15 Minuten mit einer Präzision von CV < 2%.',
  brand: {
    '@type': 'Brand',
    name: 'PolarisDX',
  },
  manufacturer: {
    '@type': 'Organization',
    name: 'DX365 GmbH',
  },
  category: 'Point-of-Care Diagnostik',
  url: `${BASE_URL}/igloo-pro`,
  image: `${BASE_URL}/og-image.jpg`,
  weight: {
    '@type': 'QuantitativeValue',
    value: '600',
    unitCode: 'GRM',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '250',
    bestRating: '5',
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

export interface ArticleAuthor {
  name: string;
  type?: 'Person' | 'Organization';
  jobTitle?: string;
  url?: string;
}

export interface ArticleSchemaOptions {
  headline: string;
  description: string;
  image: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  author?: ArticleAuthor;
  reviewedBy?: ArticleAuthor;
  articleType?: 'Article' | 'MedicalWebPage';
}

export function createArticleSchema(options: ArticleSchemaOptions) {
  const authorData = options.author
    ? {
        '@type': options.author.type || 'Organization',
        name: options.author.name,
        ...(options.author.jobTitle && { jobTitle: options.author.jobTitle }),
        ...(options.author.url && { url: options.author.url }),
      }
    : {
        '@type': 'Organization',
        name: options.authorName || 'PolarisDX',
        url: BASE_URL,
      };

  return {
    '@context': 'https://schema.org',
    '@type': options.articleType || 'Article',
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
    author: authorData,
    ...(options.reviewedBy && {
      reviewedBy: {
        '@type': options.reviewedBy.type || 'Person',
        name: options.reviewedBy.name,
        ...(options.reviewedBy.jobTitle && { jobTitle: options.reviewedBy.jobTitle }),
      },
    }),
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
