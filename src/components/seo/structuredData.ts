/** Canonical, claim-safe JSON-LD builders. */

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES, isValidLanguage } from '../../i18n'

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

const BASE_URL = 'https://polarisdx.net'
const ORGANIZATION_ID = `${BASE_URL}/de/#organization`
const TRANSLATION_KEY_RE = /^[a-z][\w-]*(?::[\w-]+)?(?:\.[\w-]+)+$/i
const LANG_PREFIX_RE = new RegExp(`^/(?:${SUPPORTED_LANGUAGES.join('|')})(?=/|$)`, 'i')

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

function requiredText(value: string, field: string): string {
  const clean = value.trim()
  if (!clean || TRANSLATION_KEY_RE.test(clean)) {
    throw new Error(`Structured Data requires visible ${field}`)
  }
  return clean
}

function normalizedLanguage(language?: string): string {
  const base = (language || DEFAULT_LANGUAGE).split('-')[0].toLowerCase()
  return isValidLanguage(base) ? base : DEFAULT_LANGUAGE
}

export function toIsoDate(value: string): string {
  const raw = value.trim()
  let result = raw
  const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})(T.*)?$/)
  if (!isoMatch) {
    const displayMatch = raw.match(/^(\d{1,2})\.?\s+([^\s\d.]+)\.?\s+(\d{4})$/)
    const month = displayMatch && MONTH_NUMBERS[displayMatch[2].toLowerCase()]
    if (!displayMatch || !month) throw new Error(`Invalid Structured Data date: ${value}`)
    result = `${displayMatch[3]}-${month}-${displayMatch[1].padStart(2, '0')}`
  }

  const datePart = result.slice(0, 10)
  const date = new Date(`${datePart}T00:00:00Z`)
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== datePart) {
    throw new Error(`Invalid Structured Data date: ${value}`)
  }
  return result
}

export function canonicalUrlFor(url: string, language?: string): string {
  const raw = requiredText(url, 'URL')
  let path = raw
  if (/^https?:\/\//i.test(raw)) {
    const parsed = new URL(raw)
    if (parsed.origin !== BASE_URL) throw new Error(`Structured Data URL must use ${BASE_URL}`)
    path = `${parsed.pathname}${parsed.hash}`
  }
  if (!path.startsWith('/')) path = `/${path}`
  path = path.replace(LANG_PREFIX_RE, '') || '/'
  return `${BASE_URL}/${normalizedLanguage(language)}${path}`
}

function publicAssetUrl(value: string): string {
  const raw = requiredText(value, 'image URL')
  const parsed = new URL(raw, BASE_URL)
  if (parsed.origin !== BASE_URL) throw new Error(`Structured Data image must use ${BASE_URL}`)
  return parsed.toString()
}

const organizationReference = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'PolarisDX',
  url: `${BASE_URL}/de/`,
}

/** One verified global entity; no inferred medical subtype, opening hours or geo claims. */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Polaris Diagnostics Europe GmbH',
  legalName: 'Polaris Diagnostics Europe GmbH',
  alternateName: 'PolarisDX',
  url: `${BASE_URL}/de/`,
  logo: {
    '@type': 'ImageObject',
    url: `${BASE_URL}/favicon.png`,
    width: 512,
    height: 512,
  },
  email: 'contact@polarisdx.net',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Große Bleichen 1–3',
    addressLocality: 'Hamburg',
    postalCode: '20354',
    addressCountry: 'DE',
  },
  sameAs: ['https://www.linkedin.com/company/polarisdx'],
}

export function createWebsiteSchema(language?: string) {
  const lang = normalizedLanguage(language)
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/${lang}/#website`,
    name: 'PolarisDX',
    url: `${BASE_URL}/${lang}/`,
    publisher: organizationReference,
    inLanguage: lang,
  }
}

export interface ProductSchemaOptions {
  name: string
  description: string
  image: string
  url: string
  language?: string
  brand?: string
  manufacturer?: string
}

export function createProductSchema(options: ProductSchemaOptions) {
  const url = canonicalUrlFor(options.url, options.language)
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: requiredText(options.name, 'product name'),
    description: requiredText(options.description, 'product description'),
    image: publicAssetUrl(options.image),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: normalizedLanguage(options.language),
    ...(options.brand && {
      brand: { '@type': 'Brand', name: requiredText(options.brand, 'brand') },
    }),
    ...(options.manufacturer && {
      manufacturer: {
        '@type': 'Organization',
        name: requiredText(options.manufacturer, 'manufacturer'),
      },
    }),
  }
}

export function createBreadcrumbSchema(items: BreadcrumbItem[], language?: string) {
  if (items.length < 2) throw new Error('BreadcrumbList requires a real hierarchy')
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    inLanguage: normalizedLanguage(language),
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: requiredText(item.name, 'breadcrumb name'),
      item: canonicalUrlFor(item.url, language),
    })),
  }
}

export function createFAQSchema(items: FAQItem[], language?: string) {
  if (!items.length) throw new Error('FAQPage requires visible questions')
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: normalizedLanguage(language),
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: requiredText(item.question, 'FAQ question'),
      acceptedAnswer: { '@type': 'Answer', text: requiredText(item.answer, 'FAQ answer') },
    })),
  }
}

export interface ArticleAuthor {
  name: string
  type?: 'Person' | 'Organization'
  jobTitle?: string
  url?: string
}

export interface ArticleSchemaOptions {
  headline: string
  description: string
  image?: string
  url: string
  language?: string
  datePublished: string
  dateModified?: string
  authorName?: string
  author?: ArticleAuthor
  reviewedBy?: ArticleAuthor
  articleType?: 'Article' | 'MedicalWebPage'
}

function schemaPerson(value: ArticleAuthor, language?: string) {
  return {
    '@type': value.type || 'Organization',
    name: requiredText(value.name, 'author/reviewer name'),
    ...(value.jobTitle && { jobTitle: requiredText(value.jobTitle, 'job title') }),
    ...(value.url && { url: canonicalUrlFor(value.url, language) }),
  }
}

export function createArticleSchema(options: ArticleSchemaOptions) {
  const url = canonicalUrlFor(options.url, options.language)
  const author = options.author || (options.authorName ? { name: options.authorName } : undefined)
  return {
    '@context': 'https://schema.org',
    '@type': options.articleType || 'Article',
    headline: requiredText(options.headline, 'article headline'),
    description: requiredText(options.description, 'article description'),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: normalizedLanguage(options.language),
    datePublished: toIsoDate(options.datePublished),
    ...(options.dateModified && { dateModified: toIsoDate(options.dateModified) }),
    ...(options.image && { image: publicAssetUrl(options.image) }),
    ...(author && { author: schemaPerson(author, options.language) }),
    ...(options.reviewedBy && { reviewedBy: schemaPerson(options.reviewedBy, options.language) }),
    publisher: organizationReference,
  }
}

export interface ServiceSchemaOptions {
  name: string
  description: string
  url: string
  language?: string
  image?: string
  areaServed?: string[]
}

export function createServiceSchema(options: ServiceSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: requiredText(options.name, 'service name'),
    description: requiredText(options.description, 'service description'),
    url: canonicalUrlFor(options.url, options.language),
    inLanguage: normalizedLanguage(options.language),
    provider: organizationReference,
    ...(options.areaServed?.length && { areaServed: options.areaServed }),
    ...(options.image && { image: publicAssetUrl(options.image) }),
  }
}

export interface EventSchemaOptions {
  name: string
  description: string
  startDate: string
  endDate?: string
  location: string
  url: string
  language?: string
  image?: string
  eventStatus?: string
  eventAttendanceMode?: string
}

export function createEventSchema(options: EventSchemaOptions) {
  const url = canonicalUrlFor(options.url, options.language)
  return {
    '@context': 'https://schema.org',
    '@type': 'BusinessEvent',
    name: requiredText(options.name, 'event name'),
    description: requiredText(options.description, 'event description'),
    startDate: toIsoDate(options.startDate),
    ...(options.endDate && { endDate: toIsoDate(options.endDate) }),
    location: {
      '@type': 'Place',
      name: requiredText(options.location, 'event location'),
      address: requiredText(options.location, 'event location'),
    },
    organizer: organizationReference,
    url,
    inLanguage: normalizedLanguage(options.language),
    ...(options.image && { image: publicAssetUrl(options.image) }),
    ...(options.eventStatus && { eventStatus: options.eventStatus }),
    ...(options.eventAttendanceMode && { eventAttendanceMode: options.eventAttendanceMode }),
  }
}

const FORBIDDEN_HOSTS = /(?:preview\.polarisdx\.net|localhost|127\.0\.0\.1)(?=[:/]|$)/i
const ALLOWED_EXTERNAL_IDENTITY_URLS = new Set(['https://www.linkedin.com/company/polarisdx'])

/** Runtime guard for the single SEOHead renderer. */
export function validateStructuredData(value: object | object[]): void {
  const schemas = Array.isArray(value) ? value : [value]
  const identities = new Set<string>()
  JSON.stringify(schemas, (key, item) => {
    if (typeof item === 'string' && FORBIDDEN_HOSTS.test(item)) {
      throw new Error(`Structured Data contains a non-public host in ${key}`)
    }
    if (
      typeof item === 'string' &&
      /^https?:\/\//i.test(item) &&
      !item.startsWith(`${BASE_URL}/`) &&
      !item.startsWith('https://schema.org') &&
      !ALLOWED_EXTERNAL_IDENTITY_URLS.has(item)
    ) {
      throw new Error(`Structured Data contains a non-canonical URL in ${key}`)
    }
    return item
  })
  for (const schema of schemas as Array<Record<string, unknown>>) {
    if (schema['@context'] !== 'https://schema.org' || typeof schema['@type'] !== 'string') {
      throw new Error('Structured Data requires schema.org context and type')
    }
    const identity = `${schema['@type']}:${String(schema['@id'] || '')}`
    if (schema['@id'] && identities.has(identity)) {
      throw new Error(`Duplicate Structured Data entity: ${identity}`)
    }
    identities.add(identity)
  }
}

export function serializeStructuredData(value: object | object[]): string {
  validateStructuredData(value)
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
