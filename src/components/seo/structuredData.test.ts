import { describe, expect, it } from 'vitest'

import {
  createArticleSchema,
  createBreadcrumbSchema,
  createEventSchema,
  createFAQSchema,
  createProductSchema,
  createWebsiteSchema,
  organizationSchema,
  serializeStructuredData,
  toIsoDate,
  validateStructuredData,
} from './structuredData'

describe('PT09.4 Structured Data contract', () => {
  it('keeps one verified Organization and a locale-aware WebSite without fake SearchAction', () => {
    expect(organizationSchema).toMatchObject({
      '@type': 'Organization',
      '@id': 'https://polarisdx.net/de/#organization',
      url: 'https://polarisdx.net/de/',
      email: 'contact@polarisdx.net',
    })
    expect(organizationSchema).not.toHaveProperty('openingHoursSpecification')
    expect(organizationSchema).not.toHaveProperty('priceRange')

    const website = createWebsiteSchema('pl')
    expect(website).toMatchObject({
      '@type': 'WebSite',
      url: 'https://polarisdx.net/pl/',
      inLanguage: 'pl',
    })
    expect(website).not.toHaveProperty('potentialAction')
  })

  it('builds locale-aware breadcrumbs without redirect-source or invented parents', () => {
    const schema = createBreadcrumbSchema(
      [
        { name: 'Start', url: '/' },
        { name: 'Diagnostik', url: '/diagnostics' },
        { name: 'Dental', url: '/diagnostics/dental' },
      ],
      'fr',
    )
    expect(schema.itemListElement.map((item) => item.item)).toEqual([
      'https://polarisdx.net/fr/',
      'https://polarisdx.net/fr/diagnostics',
      'https://polarisdx.net/fr/diagnostics/dental',
    ])
    expect(() => createBreadcrumbSchema([{ name: 'Only', url: '/' }])).toThrow()
  })

  it('keeps Product markup minimal and rejects non-public product assets', () => {
    const schema = createProductSchema({
      name: 'Inside-Out Care Duo',
      description: 'Visible localized product description.',
      image: '/assets/duo.jpeg',
      url: '/consumer/inside-out-duo',
      language: 'pl',
    })
    expect(schema).toMatchObject({
      '@type': 'Product',
      '@id': 'https://polarisdx.net/pl/consumer/inside-out-duo#product',
      image: 'https://polarisdx.net/assets/duo.jpeg',
      url: 'https://polarisdx.net/pl/consumer/inside-out-duo',
      inLanguage: 'pl',
    })
    for (const forbidden of ['offers', 'sku', 'gtin', 'aggregateRating', 'review']) {
      expect(schema).not.toHaveProperty(forbidden)
    }
    expect(() =>
      createProductSchema({
        name: 'Product',
        description: 'Visible description.',
        image: 'https://preview.polarisdx.net/fake.jpg',
        url: '/product',
      }),
    ).toThrow()
  })

  it('emits FAQ only from non-empty visible input', () => {
    expect(createFAQSchema([{ question: 'Visible?', answer: 'Visible.' }], 'cs')).toMatchObject({
      '@type': 'FAQPage',
      inLanguage: 'cs',
    })
    expect(() => createFAQSchema([])).toThrow()
  })

  it('normalizes real article dates without inventing modified dates, authors or reviewers', () => {
    const schema = createArticleSchema({
      headline: 'A published article',
      description: 'Visible article summary.',
      url: '/articles/a-published-article',
      language: 'nl',
      datePublished: '28 Nov 2025',
      authorName: 'PolarisDX Team',
    })
    expect(schema).toMatchObject({
      '@type': 'Article',
      url: 'https://polarisdx.net/nl/articles/a-published-article',
      datePublished: '2025-11-28',
      author: { name: 'PolarisDX Team' },
      inLanguage: 'nl',
    })
    expect(schema).not.toHaveProperty('dateModified')
    expect(schema).not.toHaveProperty('reviewedBy')
    expect(toIsoDate('2026-02-01')).toBe('2026-02-01')
    expect(() => toIsoDate('31 Feb 2026')).toThrow()
  })

  it('uses real event data without inventing status, mode, offers or prices', () => {
    const schema = createEventSchema({
      name: 'DGI Jahreskongress',
      description: 'Visible event description.',
      startDate: '2026-11-27',
      endDate: '2026-11-28',
      location: 'Hamburg',
      url: '/events',
      language: 'da',
    })
    expect(schema).toMatchObject({
      '@type': 'BusinessEvent',
      url: 'https://polarisdx.net/da/events',
      startDate: '2026-11-27',
      endDate: '2026-11-28',
    })
    for (const forbidden of ['eventStatus', 'eventAttendanceMode', 'offers', 'price']) {
      expect(schema).not.toHaveProperty(forbidden)
    }
  })

  it('rejects preview hosts and duplicate entity ids in the central renderer guard', () => {
    expect(() =>
      validateStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Article',
        url: 'https://preview.polarisdx.net/de/article',
      }),
    ).toThrow()
    expect(() =>
      validateStructuredData({
        '@context': 'https://schema.org',
        '@type': 'Event',
        url: 'https://example.com/unverified-event',
      }),
    ).toThrow()
    expect(() => validateStructuredData([organizationSchema, organizationSchema])).toThrow()
    expect(
      serializeStructuredData({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        text: '</script>',
      }),
    ).toContain('\\u003c/script>')
  })
})
