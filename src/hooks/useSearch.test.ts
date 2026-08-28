// @vitest-environment node
import type { TFunction } from 'i18next'
import { describe, expect, it } from 'vitest'
import { articles } from '../data/articles'
import { services } from '../data/services'
import { BEFUND_ORDER } from '../content/befunde/meta'
import { createSearchIndex, filterSearchIndex, normalizeSearchText } from './useSearch'

const translate = ((key: string) => key.replaceAll(':', ' ')) as TFunction

describe('search index', () => {
  const index = createSearchIndex(translate)
  const paths = new Set(index.map((item) => item.path))

  it('covers the canonical service source without the dead sports target', () => {
    expect(index.filter((item) => item.type === 'service')).toHaveLength(services.length)
    for (const service of services) expect(paths).toContain(`/diagnostics/${service.id}`)
    expect(paths).not.toContain('/diagnostics/sports')
  })

  it('uses every published article slug and never its internal id as the route', () => {
    expect(index.filter((item) => item.type === 'article')).toHaveLength(articles.length)
    for (const article of articles) {
      expect(paths).toContain(`/articles/${article.slug}`)
      if (article.id !== article.slug) expect(paths).not.toContain(`/articles/${article.id}`)
    }
  })

  it('covers the epigenetics hub, three deepening routes and all six reports', () => {
    for (const path of [
      '/epigenetics',
      '/epigenetics/grundlagen',
      '/epigenetics/studienlage',
      '/epigenetics/unterlagen',
      ...BEFUND_ORDER.map((slug) => `/epigenetics/musterbefund/${slug}`),
    ]) {
      expect(paths).toContain(path)
    }
  })

  it('contains no legacy services or future/backlog target', () => {
    expect([...paths].some((path) => path === '/services' || path.startsWith('/services/'))).toBe(
      false,
    )
    expect(
      [...paths].some((path) => /casestud|case-stud|shop|deal|voucher|api\/chat/.test(path)),
    ).toBe(false)
  })

  it('matches case, whitespace and diacritics deterministically', () => {
    expect(normalizeSearchText('  ÜBER   uns ')).toBe('uber uns')
    const fixture = [
      { ...index[0], title: 'Über uns', description: 'PolarisDX' },
      { ...index[1], title: 'Diagnostik', description: 'Praxis' },
    ]
    expect(filterSearchIndex(fixture, ' UBER   UNS ')).toEqual([fixture[0]])
    expect(filterSearchIndex(fixture, 'praxis')).toEqual([fixture[1]])
  })
})
