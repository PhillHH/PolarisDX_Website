export type Product = {
  id: string
  slug: string
  name: string
  category: string
  price: number
  shortDescription: string
  features: string[]
  badge?: 'New' | 'Popular' | 'Limited'
}

export const products: Product[] = [
  {
    id: 'bp-monitor',
    slug: 'digital-blood-pressure-monitor',
    name: 'Digital Blood Pressure Monitor',
    category: 'Diagnostics',
    price: 79,
    shortDescription:
      'Accurate, easy-to-use blood pressure monitor for home use with memory function.',
    features: [
      'Upper-arm cuff with adjustable size',
      'Stores up to 60 readings',
      'Irregular heartbeat detection',
    ],
    badge: 'Popular',
  },
  {
    id: 'thermometer',
    slug: 'contactless-forehead-thermometer',
    name: 'Contactless Forehead Thermometer',
    category: 'Diagnostics',
    price: 49,
    shortDescription:
      'Fast, hygienic temperature readings without skin contact — ideal for families.',
    features: ['1-second measurement', 'Fever alarm indicator', 'Backlit display'],
    badge: 'New',
  },
  {
    id: 'pulse-oximeter',
    slug: 'finger-pulse-oximeter',
    name: 'Finger Pulse Oximeter',
    category: 'Monitoring',
    price: 39,
    shortDescription: 'Measure blood oxygen saturation and pulse rate within seconds.',
    features: ['SpO₂ and pulse rate display', 'Compact and portable', 'Auto power-off'],
  },
  {
    id: 'home-care-kit',
    slug: 'home-care-starter-kit',
    name: 'Home Care Starter Kit',
    category: 'Home Care',
    price: 129,
    shortDescription:
      'Essential tools for daily home care, including monitoring and first-aid basics.',
    features: [
      'Digital thermometer and BP monitor',
      'Basic wound care supplies',
      'Compact storage bag',
    ],
    badge: 'Limited',
  },
  {
    id: 'diabetes-kit',
    slug: 'diabetes-monitoring-kit',
    name: 'Diabetes Monitoring Kit',
    category: 'Chronic Care',
    price: 99,
    shortDescription:
      'Everything you need to monitor blood glucose levels at home comfortably.',
    features: [
      'Glucose meter with test strips',
      'Lancing device and lancets',
      'Carrying case for travel',
    ],
  },
  {
    id: 'n95-mask-pack',
    slug: 'n95-respirator-mask-pack',
    name: 'N95 Respirator Mask Pack (10 pcs)',
    category: 'Protection',
    price: 29,
    shortDescription: 'Certified N95 masks for reliable respiratory protection.',
    features: ['Adjustable nose clip', 'Comfortable ear loops', 'Individually packed'],
  },
  {
    id: 'hand-sanitizer',
    slug: 'antibacterial-hand-sanitizer',
    name: 'Antibacterial Hand Sanitizer (500 ml)',
    category: 'Hygiene',
    price: 12,
    shortDescription: 'Fast-drying sanitizer with moisturizing ingredients.',
    features: ['Kills 99.9% of germs', 'Non-sticky formula', 'Fresh, clean scent'],
  },
  {
    id: 'compression-socks',
    slug: 'medical-compression-socks',
    name: 'Medical Compression Socks',
    category: 'Recovery',
    price: 35,
    shortDescription: 'Support circulation during long days on your feet or recovery.',
    features: ['Graduated compression', 'Breathable fabric', 'Multiple sizes available'],
  },
  {
    id: 'first-aid-kit',
    slug: 'compact-first-aid-kit',
    name: 'Compact First Aid Kit',
    category: 'Emergency',
    price: 45,
    shortDescription: 'A compact kit with essentials for minor injuries and emergencies.',
    features: ['Bandages and dressings', 'Antiseptic wipes', 'Instruction leaflet'],
  },
  {
    id: 'online-consult',
    slug: 'online-doctor-consultation',
    name: 'Online Doctor Consultation (30 min)',
    category: 'Service',
    price: 59,
    shortDescription: 'Book a 30-minute video consultation with one of our doctors.',
    features: [
      'Flexible scheduling options',
      'Secure video platform',
      'Summary report after the session',
    ],
    badge: 'Popular',
  },
]

export const getProductBySlug = (slug: string) =>
  products.find((product) => product.slug === slug)



