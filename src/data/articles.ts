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
    id: 'ecosystem_of_rapid_tests', // Changed from hyphen to underscore to match key style if consistent
    slug: 'the-ecosystem-of-rapid-tests-why-compatibility-creates-safety',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '8 min read',
    sections: [
      {
        image: 'Testbild1.png',
        paragraphs: [], // Placeholders or removed
      },
      // ... structural sections if needed for images, but simpler to just store image map?
      // Actually, since sections are now in translation, we don't know the structure here unless we mirror it.
      // But images are not in translation.
      // So we need a way to map images to sections.
      // For now, let's assume images are handled by index or we put image filename in translation (hacky but works).
      // Or we keep sections here just for the image property.
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
  {
    id: 'first_checkup',
    slug: 'how-to-prepare-for-your-first-medical-checkup',
    category: 'Health Article',
    author: 'MedHealth Team',
    date: '24 Feb 2025',
    readTime: '7 min read',
    sections: [],
  },
  {
    id: 'managing_diabetes',
    slug: 'managing-diabetes-with-daily-routines',
    category: 'Chronic Care',
    author: 'Dr. Amelia Carter',
    date: '12 Jan 2025',
    readTime: '8 min read',
    sections: [],
  },
  {
    id: 'home_care',
    slug: 'benefits-of-professional-home-care',
    category: 'Home Care',
    author: 'MedHealth Homecare',
    date: '3 Dec 2024',
    readTime: '6 min read',
    sections: [],
  },
]

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
