import type { SupportedLanguage } from '../../i18n'

export type ArticleTextSection = {
  type?: 'text'
  heading?: string
  paragraphs?: string[]
  listItems?: string[]
  image?: string
  imageAlt?: string
  imageCaption?: string
}
export type ArticleTableSection = {
  type: 'table'
  heading?: string
  headers: string[]
  rows: string[][]
  image?: string
  imageAlt?: string
  imageCaption?: string
}
export type ArticleInfoboxSection = {
  type: 'infobox'
  heading?: string
  content: string
  image?: string
  imageAlt?: string
  imageCaption?: string
}
export type ArticleKeyPointsSection = {
  type: 'key_points'
  heading?: string
  points: { title: string; description: string }[]
  image?: string
  imageAlt?: string
  imageCaption?: string
}
export type ArticleContentSection =
  | ArticleTextSection
  | ArticleTableSection
  | ArticleInfoboxSection
  | ArticleKeyPointsSection

export type ArticleLocaleContent = {
  sections: ArticleContentSection[]
  keyStats?: { value: string; label: string }[]
}

export type ArticleContentByLocale = Record<SupportedLanguage, ArticleLocaleContent>
