import { articles } from './articles'

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  slug: string
}

// derive blog teaser data from articles "DB"
export const blogPosts: BlogPost[] = articles.map((article) => ({
  id: article.id,
  title: article.title,
  excerpt: article.excerpt,
  slug: article.slug,
}))


