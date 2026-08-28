import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'
import { articles } from '../data/articles'
import { services } from '../data/services'
import { BEFUND_ORDER } from '../content/befunde/meta'

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

interface SearchDefinition {
  id: string
  path: string
  type: SearchResultType
  titleKey: string
  descriptionKey: string
  priority: number
}

/**
 * Temporary, controlled route mirror for search. AP10 owns the future central
 * route registry; until then every target here is checked by check:search-index.
 */
export const SEARCH_PAGE_DEFINITIONS: readonly SearchDefinition[] = [
  {
    id: 'home',
    path: '/',
    type: 'page',
    titleKey: 'home:seo.title',
    descriptionKey: 'home:seo.description',
    priority: 100,
  },
  {
    id: 'diagnostics',
    path: '/diagnostics',
    type: 'page',
    titleKey: 'services:overview.hero.title',
    descriptionKey: 'services:seo.overview_description',
    priority: 95,
  },
  {
    id: 'igloo-pro',
    path: '/igloo-pro',
    type: 'resource',
    titleKey: 'products:seo.title',
    descriptionKey: 'products:seo.description',
    priority: 94,
  },
  {
    id: 'epigenetics',
    path: '/epigenetics',
    type: 'epigenetics',
    titleKey: 'common:search.index.epigenetics.title',
    descriptionKey: 'common:search.index.epigenetics.description',
    priority: 93,
  },
  {
    id: 'about',
    path: '/about',
    type: 'page',
    titleKey: 'about:seo.title',
    descriptionKey: 'about:seo.description',
    priority: 80,
  },
  {
    id: 'articles',
    path: '/articles',
    type: 'page',
    titleKey: 'articles:index.title',
    descriptionKey: 'articles:seo.index_description',
    priority: 79,
  },
  {
    id: 'events',
    path: '/events',
    type: 'event',
    titleKey: 'events:title',
    descriptionKey: 'events:seo_description',
    priority: 78,
  },
  {
    id: 'downloads',
    path: '/downloads',
    type: 'resource',
    titleKey: 'downloads:seo.title',
    descriptionKey: 'downloads:seo.description',
    priority: 77,
  },
  {
    id: 'support',
    path: '/support',
    type: 'page',
    titleKey: 'support:seo.title',
    descriptionKey: 'support:seo.description',
    priority: 76,
  },
  {
    id: 'contact',
    path: '/contact',
    type: 'page',
    titleKey: 'contact:seo.title',
    descriptionKey: 'contact:seo.description',
    priority: 75,
  },
  {
    id: 'vitamin-d3-spray',
    path: '/vitamin-d3-spray',
    type: 'resource',
    titleKey: 'vitd3spray:seo.title',
    descriptionKey: 'vitd3spray:seo.description',
    priority: 70,
  },
  ...(['grundlagen', 'studienlage', 'unterlagen'] as const).map((slug, index) => ({
    id: `epigenetics-${slug}`,
    path: `/epigenetics/${slug}`,
    type: 'epigenetics' as const,
    titleKey: `common:search.index.epigenetics-${slug}.title`,
    descriptionKey: `common:search.index.epigenetics-${slug}.description`,
    priority: 72 - index,
  })),
  ...BEFUND_ORDER.map((slug, index) => ({
    id: `befund-${slug}`,
    path: `/epigenetics/musterbefund/${slug}`,
    type: 'befund' as const,
    titleKey: `common:search.index.befund-${slug}.title`,
    descriptionKey: `common:search.index.befund-${slug}.description`,
    priority: 68 - index,
  })),
]

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
  const pages = SEARCH_PAGE_DEFINITIONS.map((item) => ({
    ...item,
    title: t(item.titleKey),
    description: t(item.descriptionKey),
    typeLabel: t(TYPE_LABEL_KEYS[item.type]),
  }))

  const serviceResults = services.map((service, index) => ({
    id: `service-${service.id}`,
    title: t(`services:${service.translationKey}.seo.title`),
    description: t(`services:${service.translationKey}.seo.description`),
    path: `/diagnostics/${service.id}`,
    type: 'service' as const,
    typeLabel: t(TYPE_LABEL_KEYS.service),
    priority: 90 - index,
  }))

  const articleResults = articles.map((article, index) => ({
    id: `article-${article.id}`,
    title: t(`common:search.index.article-${article.id}.title`),
    description: t(`common:search.index.article-${article.id}.description`),
    path: `/articles/${article.slug}`,
    type: 'article' as const,
    typeLabel: t(TYPE_LABEL_KEYS.article),
    priority: 60 - index,
  }))

  return [...pages, ...serviceResults, ...articleResults].sort(
    (a, b) => b.priority - a.priority || a.path.localeCompare(b.path),
  )
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
  ])

  const index = useMemo(() => createSearchIndex(t), [t])
  const results = useMemo(() => filterSearchIndex(index, query), [index, query])

  return { results, isSearching: false, error: null as Error | null }
}
