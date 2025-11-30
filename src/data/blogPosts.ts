import { articles } from './articles'

export type BlogPost = {
  id: string
  slug: string
  image?: string
}

// Leitet Blog-Teaser-Daten aus der zentralen 'articles'-Liste ab.
// Wird verwendet, um Vorschauen auf der Startseite oder im Blog-Bereich anzuzeigen.
export const blogPosts: BlogPost[] = articles.map((article) => ({
  id: article.id,
  slug: article.slug,
  // Nimmt das Bild des ersten Abschnitts als Vorschaubild, falls vorhanden
  image: article.sections && article.sections[0] ? article.sections[0].image : undefined,
}))
