import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { articles } from '../data/articles'
import { services } from '../data/services'
import { getSearchEligibleRouteEntries } from '../routing/routeRegistry'

export type SearchResultType =
  | 'page'
  | 'service'
  | 'article'
  | 'epigenetics'
  | 'befund'
  | 'resource'
  | 'event'
  | 'consumer'

export interface SearchResult {
  id: string
  title: string
  description: string
  path: string
  type: SearchResultType
  typeLabel: string
  priority: number
}

interface SearchMetadata {
  type: SearchResultType
  titleKey: string
  descriptionKey: string
  priority: number
}

/**
 * Search copy stays a Search concern; route paths and eligibility do not.
 * Keys are registry family IDs and G1 rejects missing/stale bindings.
 */
export const SEARCH_PAGE_METADATA: Readonly<Record<string, SearchMetadata>> = {
  home: {
    type: 'page',
    titleKey: 'home:seo.title',
    descriptionKey: 'home:seo.description',
    priority: 100,
  },
  diagnostics: {
    type: 'page',
    titleKey: 'services:overview.hero.title',
    descriptionKey: 'services:seo.overview_description',
    priority: 95,
  },
  'igloo-pro': {
    type: 'resource',
    titleKey: 'products:seo.title',
    descriptionKey: 'products:seo.description',
    priority: 94,
  },
  epigenetics: {
    type: 'epigenetics',
    titleKey: 'common:search.index.epigenetics.title',
    descriptionKey: 'common:search.index.epigenetics.description',
    priority: 93,
  },
  about: {
    type: 'page',
    titleKey: 'about:seo.title',
    descriptionKey: 'about:seo.description',
    priority: 80,
  },
  articles: {
    type: 'page',
    titleKey: 'articles:index.title',
    descriptionKey: 'articles:seo.index_description',
    priority: 79,
  },
  events: {
    type: 'event',
    titleKey: 'events:title',
    descriptionKey: 'events:seo_description',
    priority: 78,
  },
  downloads: {
    type: 'resource',
    titleKey: 'downloads:seo.title',
    descriptionKey: 'downloads:seo.description',
    priority: 77,
  },
  support: {
    type: 'page',
    titleKey: 'support:seo.title',
    descriptionKey: 'support:seo.description',
    priority: 76,
  },
  contact: {
    type: 'page',
    titleKey: 'contact:seo.title',
    descriptionKey: 'contact:seo.description',
    priority: 75,
  },
  'vitamin-d3-spray': {
    type: 'resource',
    titleKey: 'vitd3spray:seo.title',
    descriptionKey: 'vitd3spray:seo.description',
    priority: 70,
  },
  ...Object.fromEntries(
    (['grundlagen', 'studienlage', 'unterlagen'] as const).map((slug, index) => [
      `epigenetics-${slug}`,
      {
        type: 'epigenetics' as const,
        titleKey: `common:search.index.epigenetics-${slug}.title`,
        descriptionKey: `common:search.index.epigenetics-${slug}.description`,
        priority: 72 - index,
      },
    ]),
  ),
}

const TYPE_LABEL_KEYS: Record<SearchResultType, string> = {
  page: 'common:search.resultTypes.page',
  service: 'common:search.resultTypes.service',
  article: 'common:search.resultTypes.article',
  epigenetics: 'common:search.resultTypes.epigenetics',
  befund: 'common:search.resultTypes.befund',
  resource: 'common:search.resultTypes.resource',
  event: 'common:search.resultTypes.event',
  consumer: 'common:search.resultTypes.consumer',
}

export function createSearchIndex(t: TFunction): SearchResult[] {
  const index = getSearchEligibleRouteEntries().map((route): SearchResult => {
    if (route.familyId === 'service-detail') {
      const service = services.find((candidate) => candidate.id === route.sourceId)
      if (!service) throw new Error(`Search registry service source missing: ${route.sourceId}`)
      const sourceIndex = services.indexOf(service)
      return {
        id: `service-${service.id}`,
        title: t(`services:${service.translationKey}.seo.title`),
        description: t(`services:${service.translationKey}.seo.description`),
        path: route.path,
        type: 'service',
        typeLabel: t(TYPE_LABEL_KEYS.service),
        priority: 90 - sourceIndex,
      }
    }
    if (route.familyId === 'article-detail') {
      const article = articles.find((candidate) => candidate.id === route.sourceId)
      if (!article) throw new Error(`Search registry article source missing: ${route.sourceId}`)
      const sourceIndex = articles.indexOf(article)
      return {
        id: `article-${article.id}`,
        title: t(`common:search.index.article-${article.id}.title`),
        description: t(`common:search.index.article-${article.id}.description`),
        path: route.path,
        type: 'article',
        typeLabel: t(TYPE_LABEL_KEYS.article),
        priority: 60 - sourceIndex,
      }
    }
    if (route.familyId === 'report-detail') {
      const sourceIndex = getSearchEligibleRouteEntries()
        .filter((candidate) => candidate.familyId === 'report-detail')
        .findIndex((candidate) => candidate.sourceId === route.sourceId)
      return {
        id: `befund-${route.sourceId}`,
        // Die Suche teilt die freigegebene, familienbezogene Content-Wahrheit
        // mit der Seite. So kann die Search-Copy nicht wieder zu einem
        // generischen "Musterbefund <Panel>"-Spiegel driften.
        title: t(`epigenetics:befund.seo.${route.sourceId}.title`),
        description: t(`epigenetics:befund.seo.${route.sourceId}.description`),
        path: route.path,
        type: 'befund',
        typeLabel: t(TYPE_LABEL_KEYS.befund),
        priority: 68 - sourceIndex,
      }
    }

    const metadata = SEARCH_PAGE_METADATA[route.familyId]
    if (!metadata) throw new Error(`Search metadata missing for registry route ${route.familyId}`)
    return {
      id: route.familyId,
      path: route.path,
      ...metadata,
      title: t(metadata.titleKey),
      description: t(metadata.descriptionKey),
      typeLabel: t(TYPE_LABEL_KEYS[metadata.type]),
    }
  })

  return index.sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path))
}

export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
}

export function filterSearchIndex(index: readonly SearchResult[], query: string): SearchResult[] {
  const term = normalizeSearchText(query)
  if (!term) return []

  return index.filter((item) =>
    normalizeSearchText(`${item.title} ${item.description}`).includes(term),
  )
}

export const useSearch = (query: string) => {
  const { t } = useTranslation([
    'common',
    'home',
    'services',
    'about',
    'articles',
    'contact',
    'support',
    'events',
    'downloads',
    'products',
    'vitd3spray',
    'epigenetics',
  ])

  const index = useMemo(() => createSearchIndex(t), [t])
  const results = useMemo(() => filterSearchIndex(index, query), [index, query])

  return { results, isSearching: false, error: null as Error | null }
}
