/**
 * Structured Data Helpers
 *
 * Pre-built JSON-LD schemas for common use cases.
 * These can be passed to SEOHead's structuredData prop.
 */

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isValidLanguage } from '../../i18n'

// =============================================================================
// TYPES
// =============================================================================

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BASE_URL = 'https://polarisdx.net'

// =============================================================================
// NORMALISIERUNG (Datum + kanonische URL)
// =============================================================================

/**
 * Monatsnamen -> Monatszahl. Deutsche und englische Kurz- wie Langformen,
 * weil die Artikeldaten in src/data/articles.ts als "28 Nov 2025" gepflegt
 * sind und Redaktionstexte auch deutsche Schreibweisen liefern koennen.
 */
const MONTH_NUMBERS: Record<string, string> = {
  jan: '01',
  januar: '01',
  january: '01',
  feb: '02',
  februar: '02',
  february: '02',
  mar: '03',
  march: '03',
  mrz: '03',
  maerz: '03',
  apr: '04',
  april: '04',
  may: '05',
  mai: '05',
  jun: '06',
  june: '06',
  juni: '06',
  jul: '07',
  july: '07',
  juli: '07',
  aug: '08',
  august: '08',
  sep: '09',
  sept: '09',
  september: '09',
  oct: '10',
  okt: '10',
  october: '10',
  oktober: '10',
  nov: '11',
  november: '11',
  dec: '12',
  dez: '12',
  december: '12',
  dezember: '12',
}

/**
 * Bringt ein Datum auf ISO-8601 (YYYY-MM-DD).
 *
 * Google verwirft eine Datumsangabe im Rich Result, wenn sie nicht
 * ISO-8601 ist - "28 Nov 2025" wurde genau so verworfen.
 *
 * Laesst sich ein Wert nicht eindeutig zerlegen, bleibt er unveraendert:
 * lieber ein Rohwert im Markup als ein erfundenes Datum.
 */
function toIsoDate(value: string): string {
  const raw = (value || '').trim()
  if (!raw) return raw
  // Bereits ISO (reines Datum oder Datum + Zeit).
  if (/^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/.test(raw)) return raw
  // "28 Nov 2025", "2 Dec 2025", "28. November 2025"
  const match = raw.match(/^(\d{1,2})\.?\s+([^\s\d.]+)\.?\s+(\d{4})$/)
  if (match) {
    const month = MONTH_NUMBERS[match[2].toLowerCase()]
    if (month) return `${match[3]}-${month}-${match[1].padStart(2, '0')}`
  }
  return raw
}

/** Sprachpraefix am Pfadanfang - damit es nicht verdoppelt wird. */
const LANG_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGUAGES.join('|')})(?=/|$)`, 'i')

/**
 * Baut die kanonische, sprachpraefigierte Absolut-URL zu einem Seitenpfad.
 *
 * SEOHead setzt canonical auf `${BASE_URL}/${lang}${path}`. url und
 * mainEntityOfPage.@id im Article-JSON-LD muessen exakt dasselbe sagen -
 * ein prefixloses https://polarisdx.net/articles/<slug> neben einem
 * canonical https://polarisdx.net/de/articles/<slug> ist ein Widerspruch.
 */
function canonicalUrlFor(url: string, language?: string): string {
  const raw = (url || '').trim()
  if (/^https?:\/\//i.test(raw)) return raw

  const base = (language || DEFAULT_LANGUAGE).split('-')[0].toLowerCase()
  const lang = isValidLanguage(base) ? base : DEFAULT_LANGUAGE

  let path = raw.startsWith('/') ? raw : `/${raw}`
  path = path.replace(LANG_PREFIX_RE, '')
  if (path === '') path = '/'

  return `${BASE_URL}/${lang}${path}`
}

// =============================================================================
// MEDICAL BUSINESS (singleton - use on homepage)
// =============================================================================

export const medicalBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${BASE_URL}/#organization`,
  name: 'Polaris Diagnostics Europe GmbH',
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
}

// =============================================================================
// ORGANIZATION (legacy - kept for backwards compatibility)
// =============================================================================

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Polaris Diagnostics Europe GmbH',
  legalName: 'Polaris Diagnostics Europe GmbH',
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
}

// =============================================================================
// WEBSITE (singleton - use on homepage)
// =============================================================================

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  name: 'PolarisDX',
  url: BASE_URL,
  description: 'Point-of-Care Diagnostik für Zahnarztpraxen, Beauty-Center und Longevity-Kliniken',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  inLanguage: 'de-DE',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/articles?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// =============================================================================
// PRODUCT (IglooPro)
// =============================================================================

export const iglooProProductSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  '@id': `${BASE_URL}/igloo-pro#product`,
  name: 'IglooPro POC-Reader',
  description:
    'Point-of-Care Analysegerät für die patientennahe Sofortdiagnostik. Misst Vitamin D3, CRP, HbA1c, TSH und weitere Biomarker in 3–15 Minuten mit einer Präzision von CV < 2 %.',
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
}

// =============================================================================
// BREADCRUMB GENERATOR
// =============================================================================

/**
 * BreadcrumbList aus Seitenpfaden OHNE Sprachpraefix.
 *
 * `language` steuert das Praefix der item-URLs, damit sie exakt auf die Seiten
 * zeigen, auf denen der Breadcrumb steht: auf /en/articles/<slug> muss die
 * Stufe "Articles" auf /en/articles verweisen und nicht auf das prefixlose
 * /articles, das per 301 auf die DEUTSCHE Fassung laeuft.
 *
 * Ohne Angabe wird DEFAULT_LANGUAGE ('de') verwendet - dasselbe Muster wie in
 * createArticleSchema. Fuer deutschsprachige Aufrufer bleibt das Ergebnis
 * inhaltlich gleich, nur ohne den Redirect-Zwischenschritt.
 */
export function createBreadcrumbSchema(items: BreadcrumbItem[], language?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: canonicalUrlFor(item.url, language),
    })),
  }
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
  }
}

// =============================================================================
// ARTICLE SCHEMA GENERATOR
// =============================================================================

export interface ArticleAuthor {
  name: string
  type?: 'Person' | 'Organization'
  jobTitle?: string
  url?: string
}

export interface ArticleSchemaOptions {
  headline: string
  description: string
  image: string
  /** Seitenpfad ohne Sprachpraefix, z. B. '/articles/die-gruene-praxis'. */
  url: string
  /**
   * Aktive Sprache der Seite (z. B. 'en'). Steuert das Sprachpraefix in url
   * und mainEntityOfPage.@id, damit beide exakt dem canonical entsprechen.
   * Ohne Angabe wird DEFAULT_LANGUAGE ('de') verwendet - richtig fuer die
   * deutschsprachigen und die deutsch-only Seiten.
   */
  language?: string
  datePublished: string
  dateModified?: string
  authorName?: string
  author?: ArticleAuthor
  reviewedBy?: ArticleAuthor
  articleType?: 'Article' | 'MedicalWebPage'
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
      }

  // url und mainEntityOfPage.@id sind derselbe Wert und muessen dem canonical
  // aus SEOHead entsprechen.
  const canonicalUrl = canonicalUrlFor(options.url, options.language)

  return {
    '@context': 'https://schema.org',
    '@type': options.articleType || 'Article',
    headline: options.headline,
    description: options.description,
    image: options.image.startsWith('http') ? options.image : `${BASE_URL}${options.image}`,
    url: canonicalUrl,
    datePublished: toIsoDate(options.datePublished),
    dateModified: toIsoDate(options.dateModified || options.datePublished),
    author: authorData,
    ...(options.reviewedBy && {
      reviewedBy: {
        '@type': options.reviewedBy.type || 'Person',
        name: options.reviewedBy.name,
        ...(options.reviewedBy.jobTitle && { jobTitle: options.reviewedBy.jobTitle }),
      },
    }),
    /*
     * Der Verlagsknoten stand hier als blosse Referenz auf
     * <BASE_URL>/#organization. Dieser Knoten wird aber nur auf der Startseite
     * und auf /about ausgegeben — auf jeder Artikel- und Musterbefundseite
     * zeigte die Referenz damit ins Leere, und die Rich-Results-Pruefung
     * meldete einen Publisher ohne Namen. Die @id bleibt stehen, damit die
     * Verknuepfung dort greift, wo der Knoten existiert; Typ, Name und URL
     * stehen jetzt daneben, damit das Schema auch allein vollstaendig ist.
     */
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'PolarisDX',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
  }
}

// =============================================================================
// SERVICE SCHEMA GENERATOR
// =============================================================================

export interface ServiceSchemaOptions {
  name: string
  description: string
  /** Seitenpfad ohne Sprachpraefix, z. B. '/diagnostics/hormon-tests'. */
  url: string
  /**
   * Aktive Sprache der Seite. Steuert das Sprachpraefix in url, damit sie dem
   * canonical aus SEOHead entspricht - ohne sie zeigte die Service-URL auf
   * /en/diagnostics/<slug> auf das prefixlose /diagnostics/<slug>.
   * Ohne Angabe wird DEFAULT_LANGUAGE ('de') verwendet.
   */
  language?: string
  image?: string
  areaServed?: string[]
}

export function createServiceSchema(options: ServiceSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: options.name,
    description: options.description,
    url: canonicalUrlFor(options.url, options.language),
    provider: {
      '@id': `${BASE_URL}/#organization`,
    },
    areaServed: options.areaServed || ['DE', 'AT', 'CH'],
    ...(options.image && {
      image: options.image.startsWith('http') ? options.image : `${BASE_URL}${options.image}`,
    }),
  }
}

// =============================================================================
// EVENT SCHEMA GENERATOR
// =============================================================================

export interface EventSchemaOptions {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  /**
   * EXTERNE Detailseite des Veranstalters (src/data/events.ts, `link`) - kein
   * Pfad auf polarisdx.net. Sie wird deshalb bewusst unveraendert uebernommen
   * und bekommt KEIN Sprachpraefix: das Praefix waere auf einer fremden Domain
   * schlicht falsch.
   */
  url?: string
  image?: string
}

export function createEventSchema(options: EventSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BusinessEvent',
    name: options.name,
    description: options.description,
    startDate: options.startDate,
    ...(options.endDate && { endDate: options.endDate }),
    location: {
      '@type': 'Place',
      name: options.location,
      address: options.location,
    },
    organizer: {
      '@id': `${BASE_URL}/#organization`,
    },
    ...(options.url && { url: options.url }),
    ...(options.image && {
      image: options.image.startsWith('http') ? options.image : `${BASE_URL}${options.image}`,
    }),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  }
}

// =============================================================================
// REVIEW/TESTIMONIAL SCHEMA GENERATOR
// =============================================================================

export interface ReviewSchemaOptions {
  author: string
  reviewBody: string
  ratingValue?: number
  datePublished?: string
  jobTitle?: string
}

export function createReviewSchema(reviews: ReviewSchemaOptions[]) {
  return reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: {
      '@type': 'Person',
      name: review.author,
      ...(review.jobTitle && { jobTitle: review.jobTitle }),
    },
    reviewBody: review.reviewBody,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.ratingValue || 5,
      bestRating: 5,
    },
    ...(review.datePublished && { datePublished: review.datePublished }),
    // Knoten-Referenz auf iglooProProductSchema, KEINE Seiten-URL. Der Wert
    // muss zeichengleich zu dessen '@id' bleiben - ein Sprachpraefix wuerde die
    // Verknuepfung Review -> Product zerreissen.
    itemReviewed: {
      '@id': `${BASE_URL}/igloo-pro#product`,
    },
  }))
}

// =============================================================================
// LOCAL BUSINESS (for contact page)
// =============================================================================

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${BASE_URL}/#localbusiness`,
  name: 'Polaris Diagnostics Europe GmbH',
  image: `${BASE_URL}/favicon.png`,
  url: BASE_URL,
  telephone: '+44-7879-433019',
  email: 'contact@polarisdx.net',
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
}
