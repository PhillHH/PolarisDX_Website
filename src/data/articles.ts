import type { Article } from '../types'

/**
 * Complete structured article inventory.
 *
 * Public consumers must use `articles`, the published-only projection below.
 * Keeping the status beside the canonical ID/slug makes a later draft unable
 * to leak into Registry, Search, Sitemap or the index merely by being added to
 * this file.
 */
export const articleInventory: Article[] = [
  {
    id: 'green_practice',
    slug: 'die-gruene-praxis',
    status: 'PUBLISHED_LAUNCH',
    category: 'Sustainability',
    author: 'PolarisDX Team',
    datePublished: '2025-11-28',
    readTime: '6 min read',
    sections: [{ image: 'green.png', paragraphs: [] }],
    relatedServiceIds: ['dental', 'longevity'],
  },
  {
    id: 'invisible_patient',
    slug: 'der-unsichtbare-patient',
    status: 'PUBLISHED_LAUNCH',
    category: 'Telemedicine',
    author: 'PolarisDX Team',
    datePublished: '2025-11-30',
    readTime: '8 min read',
    sections: [{ image: 'homeclinic.png', paragraphs: [] }],
    relatedServiceIds: ['poc-systemloesungen', 'praeventions-checks'],
  },
  {
    id: 'five_minute_diagnosis',
    slug: 'die-5-minuten-diagnose',
    status: 'PUBLISHED_LAUNCH',
    category: 'Economics',
    author: 'PolarisDX Team',
    datePublished: '2025-12-02',
    readTime: '7 min read',
    sections: [{ image: 'makemoney.png', paragraphs: [] }],
    relatedServiceIds: ['poc-systemloesungen', 'dental'],
  },
  {
    id: 'ecosystem_of_rapid_tests',
    slug: 'the-ecosystem-of-rapid-tests-why-compatibility-creates-safety',
    status: 'PUBLISHED_LAUNCH',
    category: 'Health Article',
    author: 'PolarisDX Team',
    datePublished: '2025-11-25',
    readTime: '8 min read',
    sections: [
      {
        image: 'Testbild1.png',
        paragraphs: [],
      },
    ],
    relatedServiceIds: ['kompatibilitaet-integration', 'poc-systemloesungen'],
  },
  {
    id: 'rapid_setup_formula',
    slug: 'die-performance-formel-effizienz-in-der-poc-diagnostik',
    status: 'PUBLISHED_LAUNCH',
    category: 'Health Article',
    author: 'PolarisDX Team',
    datePublished: '2025-11-25',
    readTime: '7 min read',
    sections: [],
    relatedServiceIds: ['poc-systemloesungen'],
  },
  {
    id: 'precision_point_of_care',
    slug: 'precision-in-point-of-care-the-key-to-patient-safety',
    status: 'PUBLISHED_LAUNCH',
    category: 'Health Article',
    author: 'PolarisDX Team',
    datePublished: '2025-11-25',
    readTime: '9 min read',
    sections: [],
    relatedServiceIds: ['praeventions-checks', 'infektion-entzuendung'],
  },
]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function validIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value
}

/**
 * PT17.4 launch-metadata guard. It validates source truth without manufacturing
 * optional reviewer, modification or source records merely to fill schema.
 */
export function validateArticleMetadata(records: readonly Article[]): void {
  for (const article of records) {
    if (!article.author.trim()) throw new Error(`${article.id}: author is required`)
    if (!validIsoDate(article.datePublished)) {
      throw new Error(`${article.id}: invalid ISO datePublished ${article.datePublished}`)
    }
    if (article.dateModified) {
      if (!validIsoDate(article.dateModified)) {
        throw new Error(`${article.id}: invalid ISO dateModified ${article.dateModified}`)
      }
      if (article.dateModified < article.datePublished) {
        throw new Error(`${article.id}: dateModified precedes datePublished`)
      }
    }
    if (article.reviewer !== undefined && !article.reviewer.trim()) {
      throw new Error(`${article.id}: reviewer must be omitted rather than empty`)
    }
    if (article.sources !== undefined) {
      if (article.sources.length === 0) {
        throw new Error(`${article.id}: sources must be omitted rather than empty`)
      }
      for (const source of article.sources) {
        if (!source.title.trim()) throw new Error(`${article.id}: source title is required`)
        if (source.url) {
          const parsed = new URL(source.url)
          if (!['http:', 'https:'].includes(parsed.protocol)) {
            throw new Error(`${article.id}: source URL must use HTTP(S)`)
          }
        }
      }
    }
  }
}

validateArticleMetadata(articleInventory)

/** Published-only launch source consumed by Registry, Search, Sitemap and UI. */
export const articles = articleInventory.filter(
  (article): article is Article & { status: 'PUBLISHED_LAUNCH' } =>
    article.status === 'PUBLISHED_LAUNCH',
)

export const getArticleBySlug = (slug: string) => articles.find((article) => article.slug === slug)
