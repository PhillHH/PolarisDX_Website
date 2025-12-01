export type ArticleSection = {
  heading?: string
  paragraphs: string[]
  listItems?: string[]
  image?: string
}

export type Article = {
  id: string
  slug: string
  // title: string // Removed, use t(`articles.${id}.title`)
  category: string // key: category.health_article etc.
  // excerpt: string // Removed, use t(`articles.${id}.excerpt`)
  author: string
  date: string
  readTime: string
  sections: ArticleSection[] // Only structural info (images), text via translation
}

export const articles: Article[] = [
  {
    id: 'green_practice',
    slug: 'die-gruene-praxis',
    category: 'Sustainability',
    author: 'PolarisDX Team',
    date: '28 Nov 2025',
    readTime: '6 min read',
    sections: [
      { image: 'Testbild1.png', paragraphs: [] }
    ],
  },
  {
    id: 'invisible_patient',
    slug: 'der-unsichtbare-patient',
    category: 'Telemedicine',
    author: 'PolarisDX Team',
    date: '30 Nov 2025',
    readTime: '8 min read',
    sections: [
        { image: 'Testbild1.png', paragraphs: [] }
    ],
  },
  {
    id: 'five_minute_diagnosis',
    slug: 'die-5-minuten-diagnose',
    category: 'Economics',
    author: 'PolarisDX Team',
    date: '02 Dec 2025',
    readTime: '7 min read',
    sections: [
        { image: 'Testbild1.png', paragraphs: [] }
    ],
  },
  // Keeping original articles for now if needed, or commenting them out if they are obsolete.
  // User said "Artikel Hart reincoden", implies replacing or adding.
  // I will append them to the top and keep old ones for fallback/demo.
  {
    id: 'ecosystem_of_rapid_tests',
    slug: 'the-ecosystem-of-rapid-tests-why-compatibility-creates-safety',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '8 min read',
    sections: [
      {
        image: 'Testbild1.png',
        paragraphs: [],
      },
    ],
  },
  {
    id: '48_hour_formula',
    slug: 'the-48-hour-formula-efficiency-in-poc-diagnostics',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '7 min read',
    sections: [],
  },
  {
    id: 'precision_point_of_care',
    slug: 'precision-in-point-of-care-the-key-to-patient-safety',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '9 min read',
    sections: [],
  },
]

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
