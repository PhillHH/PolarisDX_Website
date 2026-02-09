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
    relatedServiceIds: ['dental', 'longevity'],
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
    relatedServiceIds: ['poc-systemloesungen', 'praeventions-checks'],
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
    relatedServiceIds: ['poc-systemloesungen', 'dental'],
  },
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
    relatedServiceIds: ['kompatibilitaet-integration', 'poc-systemloesungen'],
  },
  {
    id: 'rapid_setup_formula',
    slug: 'die-performance-formel-effizienz-in-der-poc-diagnostik',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '7 min read',
    sections: [],
    relatedServiceIds: ['poc-systemloesungen'],
  },
  {
    id: 'precision_point_of_care',
    slug: 'precision-in-point-of-care-the-key-to-patient-safety',
    category: 'Health Article',
    author: 'PolarisDX Team',
    date: '25 Nov 2025',
    readTime: '9 min read',
    sections: [],
    relatedServiceIds: ['praeventions-checks', 'infektion-entzuendung'],
  },
]

export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
