import { describe, expect, it } from 'vitest'
import { articles } from '../data/articles'
import { services } from '../data/services'

describe('PT07.3 internal findability', () => {
  it('maps every published article to current services and keeps the relationship reciprocal', () => {
    const serviceIds = new Set(services.map(({ id }) => id))

    for (const article of articles) {
      expect(article.relatedServiceIds?.length).toBeGreaterThan(0)
      for (const serviceId of article.relatedServiceIds ?? [])
        expect(serviceIds.has(serviceId)).toBe(true)
    }

    for (const service of services) {
      for (const articleId of service.relatedArticleIds ?? []) {
        expect(articles.find(({ id }) => id === articleId)?.relatedServiceIds).toContain(service.id)
      }
    }
  })
})
