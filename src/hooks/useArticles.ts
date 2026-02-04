import { useState, useEffect } from 'react'
import { articles as allArticles, getArticleBySlug, } from '../data/articles'
import type { Article } from '../types'

export interface UseArticlesReturn {
  articles: Article[]
  article: Article | undefined
  loading: boolean
  error: Error | null
}

export const useArticles = (slug?: string) => {
  const [data, setData] = useState<{ articles: Article[]; article: Article | undefined }>({
    articles: [],
    article: undefined
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    // Simulate network delay
    const timer = setTimeout(() => {
      if (!mounted) return

      try {
        if (slug) {
          const found = getArticleBySlug(slug)
          // Also return other articles for sidebar, filtering out the current one
          const others = allArticles.filter(a => a.slug !== slug)
          setData({ articles: others, article: found })
        } else {
          setData({ articles: allArticles, article: undefined })
        }
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
        setLoading(false)
      }
    }, 300)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [slug])

  return { ...data, loading, error }
}
