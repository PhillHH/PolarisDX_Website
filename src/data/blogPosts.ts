import { articles } from './articles'
import type { BlogPost } from '../types'

// derive blog teaser data from articles "DB"
export const blogPosts: BlogPost[] = articles.map((article) => ({
  id: article.id,
  slug: article.slug,
  image: article.sections && article.sections[0] ? article.sections[0].image : undefined,
}))
