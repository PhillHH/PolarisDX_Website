// Typ für technische Spezifikationen (z.B. für Tabellen auf der Produktseite)
export type TechSpec = {
  parameter: string
  specification: string
}

// Typdefinition für ein Produkt
export type Product = {
  id: string // Eindeutige ID (wird für Übersetzungsschlüssel verwendet)
  slug: string // URL-Segment für Routing
  // name: Wird übersetzt via `products.<id>.name`
  category: string // Kategorie, übersetzt via `category.<category>`
  price: number // Preis (statisch, Währungssymbol wird in Komponente hinzugefügt)

  // Die folgenden Felder werden nicht direkt hier definiert, sondern dynamisch aus i18n geladen:
  // - shortDescription: `products.<id>.shortDescription`
  // - detailedDescription: `products.<id>.detailedDescription`
  // - features: `products.<id>.features`
  // - techSpecs: `products.<id>.techSpecs`
  // - deliveryScope: `products.<id>.deliveryScope`
  // - note: `products.<id>.note`

  badge?: 'New' | 'Popular' | 'Limited' // Badge für Produktkarten (übersetzt via `badge.<badge>`)
  image?: string // Dateiname des Produktbildes in src/assets/
}

// Liste der verfügbaren Produkte
export const products: Product[] = [
  {
    id: 'igloo-reader-pro',
    slug: 'igloo-reader-pro-poct-analyzer',
    category: 'Diagnostics',
    price: 479,
    badge: 'New',
    image: 'Igloo-pro-frontal.png',
  },
  {
    id: 'bp-monitor',
    slug: 'digital-blood-pressure-monitor',
    category: 'Diagnostics',
    price: 79,
    badge: 'Popular',
  },
  {
    id: 'thermometer',
    slug: 'contactless-forehead-thermometer',
    category: 'Diagnostics',
    price: 49,
    badge: 'New',
  },
  {
    id: 'pulse-oximeter',
    slug: 'finger-pulse-oximeter',
    category: 'Monitoring',
    price: 39,
  },
  {
    id: 'home-care-kit',
    slug: 'home-care-starter-kit',
    category: 'Home Care',
    price: 129,
    badge: 'Limited',
  },
  {
    id: 'diabetes-kit',
    slug: 'diabetes-monitoring-kit',
    category: 'Chronic Care',
    price: 99,
  },
  {
    id: 'n95-mask-pack',
    slug: 'n95-respirator-mask-pack',
    category: 'Protection',
    price: 29,
  },
  {
    id: 'hand-sanitizer',
    slug: 'antibacterial-hand-sanitizer',
    category: 'Hygiene',
    price: 12,
  },
  {
    id: 'compression-socks',
    slug: 'medical-compression-socks',
    category: 'Recovery',
    price: 35,
  },
  {
    id: 'first-aid-kit',
    slug: 'compact-first-aid-kit',
    category: 'Emergency',
    price: 45,
  },
  {
    id: 'online-consult',
    slug: 'online-doctor-consultation',
    category: 'Service',
    price: 59,
    badge: 'Popular',
  },
]

/**
 * Findet ein Produkt anhand seines Slugs.
 * @param slug Der gesuchte Slug
 * @returns Das Produkt-Objekt oder undefined
 */
export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug)
