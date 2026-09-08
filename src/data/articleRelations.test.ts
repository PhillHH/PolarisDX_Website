/// <reference types="node" />
// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { articles } from './articles'
import {
  getRelatedArticles,
  getRelatedEpigeneticsRoute,
  getRelatedServiceEntries,
} from './articleRelations'

describe('PT17.2 real related-content graph', () => {
  it('derives article and service targets only from reciprocal published metadata', () => {
    for (const article of articles) {
      const relatedArticles = getRelatedArticles(article)
      const relatedServices = getRelatedServiceEntries(article)

      expect(relatedArticles.length).toBeGreaterThan(0)
      expect(new Set(relatedArticles.map(({ id }) => id)).size).toBe(relatedArticles.length)
      expect(relatedArticles).not.toContain(article)
      for (const related of relatedArticles) {
        expect(
          related.relatedServiceIds?.some((id) => article.relatedServiceIds?.includes(id)),
        ).toBe(true)
      }
      expect(relatedServices.map(({ service }) => service.id).sort()).toEqual(
        [...(article.relatedServiceIds ?? [])].sort(),
      )
      for (const { route } of relatedServices) expect(route.path).toMatch(/^\/diagnostics\//)
    }
  })

  it('shows Epigenetics only where the existing service taxonomy links it', () => {
    const greenPractice = articles.find(({ id }) => id === 'green_practice')!
    const fiveMinute = articles.find(({ id }) => id === 'five_minute_diagnosis')!

    expect(getRelatedEpigeneticsRoute(greenPractice)?.path).toBe('/epigenetics')
    expect(getRelatedEpigeneticsRoute(fiveMinute)).toBeUndefined()
  })
})
