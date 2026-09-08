import ArticlePage from '../ArticlePage'
import type { ArticleContentByLocale } from '../../content/articles/model'
import { articles } from '../../data/articles'
import { SUPPORTED_LANGUAGES } from '../../i18n'

export function createArticleRoute(articleId: string, source: unknown) {
  const article = articles.find((candidate) => candidate.id === articleId)
  if (!article) throw new Error(`${articleId}: published article inventory entry missing`)
  const content = source as ArticleContentByLocale
  const locales = Object.keys(content)
  if (
    locales.length !== SUPPORTED_LANGUAGES.length ||
    locales.some((locale) => !SUPPORTED_LANGUAGES.some((supported) => supported === locale))
  ) {
    throw new Error(`${articleId}: lazy content locale contract mismatch`)
  }
  for (const locale of SUPPORTED_LANGUAGES) {
    const localized = content[locale]
    if (!Array.isArray(localized.sections) || localized.sections.length === 0) {
      throw new Error(`${articleId}/${locale}: invalid lazy article content`)
    }
  }
  return function ArticleRoute() {
    return (
      <ArticlePage articleId={articleId} articleSlug={article.slug} contentByLocale={content} />
    )
  }
}
