import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useArticles } from './useArticles'

interface SearchResult {
  title: string
  description: string
  path: string
  type: 'page' | 'article' | 'service'
}

export const useSearch = (query: string) => {
  const { t } = useTranslation(['common', 'home', 'services', 'about', 'articles'])
  const { articles } = useArticles() // Fetch articles for searching
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // UseMemo for static pages and services to avoid re-creating arrays on every render
  // though they depend on 't' which changes on language switch
  const staticPages = useMemo(() => [
    {
      title: t('nav.home', 'Startseite'),
      path: '/',
      keywords: t('common:search.keywords.home', 'home startseite igloo widget diagnostic')
    },
    {
      title: t('nav.about', 'Über uns'),
      path: '/about',
      keywords: t('common:search.keywords.about', 'team doctors polarisdx')
    },
    {
      title: t('nav.service', 'Leistungen'),
      path: '/services',
      keywords: t('common:search.keywords.services', 'services leistungen dental beauty longevity')
    },
    {
      title: t('nav.contact', 'Kontakt'),
      path: '/contact',
      keywords: t('common:search.keywords.contact', 'contact kontakt email phone address')
    },
    // Case study temporarily disabled
    // {
    //   title: t('nav.casestudies', 'Case Study'),
    //   path: '/casestudys/32reasons',
    //   keywords: t('common:search.keywords.casestudies', 'case study 32reasons polaris dx dentistry')
    // },
    {
      title: t('nav.terms', 'AGB'),
      path: '/terms',
      keywords: t('common:search.keywords.terms', 'legal terms agb recht')
    }
  ], [t])

  const services = useMemo(() => [
    {
      id: 'dental',
      title: 'Dental',
      desc: t('common:search.services.dental', 'Zahnmedizinische Diagnostik')
    },
    {
      id: 'beauty',
      title: 'Beauty',
      desc: t('common:search.services.beauty', 'Dermatologische Analysen')
    },
    {
      id: 'longevity',
      title: 'Longevity',
      desc: t('common:search.services.longevity', 'Gesundheit und Langlebigkeit')
    },
    {
      id: 'sports',
      title: 'Sports',
      desc: t('common:search.services.sports', 'Leistungsdiagnostik für Sportler')
    }
  ], [t])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const searchTerm = query.toLowerCase()
    const found: SearchResult[] = []

    // 1. Search Static Pages
    staticPages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm) || page.keywords.toLowerCase().includes(searchTerm)) {
        found.push({
          title: page.title,
          description: t('common:readMore', 'Mehr erfahren'),
          path: page.path,
          type: 'page'
        })
      }
    })

    // 2. Search Services
    services.forEach(service => {
      if (service.title.toLowerCase().includes(searchTerm) || service.desc.toLowerCase().includes(searchTerm)) {
        found.push({
          title: service.title,
          description: service.desc,
          path: `/services/${service.id}`,
          type: 'service'
        })
      }
    })

    // 3. Search Articles
    articles.forEach(article => {
      const titleKey = `articles:${article.id}.title`
      const excerptKey = `articles:${article.id}.excerpt`

      const title = t(titleKey)
      const excerpt = t(excerptKey)

      // If translation missing (returns key), fallback to slug or empty
      const actualTitle = title !== titleKey ? title : article.slug

      const titleMatch = actualTitle.toLowerCase().includes(searchTerm)
      const excerptMatch = excerpt && excerpt !== excerptKey && excerpt.toLowerCase().includes(searchTerm)

      if (titleMatch || excerptMatch) {
        found.push({
          title: actualTitle,
          description: (excerpt && excerpt !== excerptKey) ? excerpt : '',
          path: `/articles/${article.slug}`,
          type: 'article'
        })
      }
    })

    setResults(found)
    setIsSearching(false)
    // No actual error handling logic here as it's client-side,
    // but structure is ready for future API integration
    setError(null)
  }, [query, t, articles, staticPages, services])

  return { results, isSearching, error }
}
