import { useMemo } from 'react'
import { articles as allArticles, getArticleBySlug } from '../data/articles'
import type { Article } from '../types'

export interface UseArticlesReturn {
  articles: Article[]
  article: Article | undefined
  loading: boolean
  error: Error | null
}

/**
 * useArticles — SSR-sicher: die Artikeldaten sind lokal/synchron verfügbar,
 * daher werden sie via useMemo BEIM ERSTEN RENDER (Server UND Client) berechnet.
 * Kein künstliches setTimeout/loading mehr — sonst rendert der Server nur den
 * LoadingSpinner und Titel/H1/Body/structuredData fehlen im initialen HTML.
 */
export const useArticles = (slug?: string): UseArticlesReturn => {
  const data = useMemo(() => {
    if (slug) {
      const found = getArticleBySlug(slug)
      const others = allArticles.filter((a) => a.slug !== slug)
      return { articles: others, article: found }
    }
    return { articles: allArticles, article: undefined as Article | undefined }
  }, [slug])

  return { ...data, loading: false, error: null }
}
