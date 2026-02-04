import type { Article } from '../types'

export const articles: Article[] = [
  {
    id: 'green_practice',
    slug: 'die-gruene-praxis',
    category: 'Sustainability',
    author: 'PolarisDX Team',
    date: '28 Nov 2025',
    readTime: '6 min read',
    sections: [
      { image: 'green.png', paragraphs: [] }
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
        { image: 'homeclinic.png', paragraphs: [] }
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
        { image: 'makemoney.png', paragraphs: [] }
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
    id: 'rapid_setup_formula',
    slug: 'die-performance-formel-effizienz-in-der-poc-diagnostik',
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
