// Typdefinition für die Struktur eines Artikel-Abschnitts (vor allem für Bilder wichtig)
// Die eigentlichen Texte (Überschrift, Paragraphen, Listen) werden aus den JSON-Übersetzungsdateien geladen.
export type ArticleSection = {
  heading?: string // Optional: Kann als Fallback oder Struktur-Referenz dienen
  paragraphs: string[] // Optional
  listItems?: string[] // Optional
  image?: string // WICHTIG: Bildpfad in src/assets/ (Dateiname)
}

// Typdefinition für einen Artikel
export type Article = {
  id: string // Identifikator für den Zugriff auf Übersetzungen (z.B. articles:id.title)
  slug: string // URL-freundlicher Name für die Route /articles/:slug
  category: string // Kategorie-Schlüssel, der via common:category.<category> übersetzt wird
  author: string // Autor des Artikels (statisch oder übersetzbar, hier als String)
  date: string // Veröffentlichungsdatum
  readTime: string // Geschätzte Lesezeit
  sections: ArticleSection[] // Definiert primär die Struktur und Bilder. Texte kommen aus i18n.
}

/**
 * Liste aller Blog-Artikel und News.
 * Dient als "Datenbank" für die Anwendung.
 */
export const articles: Article[] = [
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
        paragraphs: [], // Platzhalter, Inhalt wird dynamisch geladen
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

/**
 * Sucht einen Artikel anhand seines Slugs.
 * @param slug - Der URL-Slug des gesuchten Artikels.
 * @returns Das gefundene Artikel-Objekt oder undefined.
 */
export const getArticleBySlug = (slug: string) =>
  articles.find((article) => article.slug === slug)
