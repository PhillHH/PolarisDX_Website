import type { Article } from '../types'
import { articles } from './articles'
import { getServiceDetailStaticRoute, serviceDetailEntries } from './serviceDetail'

/** Derived from the explicit reciprocal Article↔Service taxonomy, never random. */
export function getRelatedArticles(article: Article, limit = 2): Article[] {
  const serviceIds = new Set(article.relatedServiceIds ?? [])
  return articles
    .filter((candidate) => candidate.id !== article.id)
    .map((candidate) => ({
      candidate,
      overlap: (candidate.relatedServiceIds ?? []).filter((id) => serviceIds.has(id)).length,
    }))
    .filter(({ overlap }) => overlap > 0)
    .sort((left, right) => right.overlap - left.overlap)
    .slice(0, limit)
    .map(({ candidate }) => candidate)
}

export function getRelatedServiceEntries(article: Article) {
  const serviceIds = new Set(article.relatedServiceIds ?? [])
  return serviceDetailEntries.filter(({ service }) => serviceIds.has(service.id))
}

/** Only a taxonomy-backed Epigenetics relation becomes an Epigenetics link. */
export function getRelatedEpigeneticsRoute(article: Article) {
  const hasEpigeneticsRelation = getRelatedServiceEntries(article).some(({ service }) =>
    service.detailCrosslinks?.some(({ routeId }) => routeId === 'epigenetics'),
  )
  return hasEpigeneticsRelation ? getServiceDetailStaticRoute('epigenetics') : undefined
}
