export type TechSpec = {
  parameter: string
  specification: string
}

export type Product = {

  id: string

  slug: string

  name: string

  category: string

  price: number

  shortDescription: string

  detailedDescription?: string[]

  features: string[]

  techSpecs?: TechSpec[]

  deliveryScope?: string[]

  note?: string

  badge?: 'New' | 'Popular' | 'Limited'
  image?: string

}

export const products: Product[] = [
  {
    id: 'igloo-reader-pro',
    slug: 'igloo-reader-pro-poct-analyzer',
    name: 'Igloo Reader Pro',
    category: 'Diagnostics',
    price: 479, // Placeholder
    badge: 'New',
    image: 'Igloo-pro-frontal.png',
    shortDescription: 'Der Igloo Reader Pro ist ein kompakter, hochmoderner All-in-One-Analysator für die Point-of-Care-Diagnostik (POCT). Er kombiniert Laborgenauigkeit mit den Anforderungen dezentraler Umgebungen. Unterstützt Lateral Flow, Microarray, Fluoreszenz und mehr – die ideale Lösung für schnelle, zuverlässige quantitative und qualitative Testergebnisse.',
    detailedDescription: [
      'Der Igloo Reader Pro definiert die mobile Diagnostik neu. Dieses vielseitige Analysegerät wurde speziell für professionelle Umgebungen und dezentrale Point-of-Care-Anwendungen entwickelt und ermöglicht eine schnelle und zuverlässige qualitative und quantitative Testung.',
      'Der Reader unterstützt eine breite Palette an diagnostischen Tests – von der Infektionskrankheitenvorsorge über kardiale Marker und Hormonprofile bis hin zu Drogenmissbrauchs- und Allergie-Panels. Dank automatisierter Kalibrierung, Cloud-Integration und digitalem Datenexport liefert der Igloo Reader Pro Laborqualität direkt dorthin, wo sie benötigt wird. Er ermöglicht es medizinischem Fachpersonal, schnelle und verlässliche Ergebnisse überall zu erzielen.'
    ],
    features: [
      'Universelle Testplattform: Unterstützt Microarray, Lateral Flow, Kolorimetrie, Fluoreszenz, Dry Chemistry und Mikrofluidik.',
      'Laborgenauigkeit im POCT-Format: Hohe Präzision durch automatische Selbstkalibrierung vor jeder Messung (CV < 2 % Inter-Reader, CV < 3 % Intra-Reader).',
      'Kompakt & Mobil: Leichtes Design mit einer Akkulaufzeit von bis zu 24 Stunden ununterbrochener Testung.',
      'Volle Konnektivität: Integriertes Wi-Fi, Bluetooth und USB-C für nahtlose Datensynchronisation und API-/LIMS-Integration.',
      'Sichere Cloud-Integration (Dx365 Cloud): Für Test-Updates, Kalibrierungsmanagement und verschlüsselte Datenspeicherung.',
      'Vielseitige Probenarten: Kompatibel mit Vollblut, Kapillarblut, Serum, Plasma, Urin, Stuhl, Speichel und Haar.'
    ],
    techSpecs: [
      { parameter: 'Geräteabmessungen (L × B × H)', specification: '87,5 × 87,5 × 91 mm' },
      { parameter: 'Gewicht', specification: 'ca. 270 g' },
      { parameter: 'Messdauer', specification: 'Wenige Sekunden (exkl. Inkubationszeit)' },
      { parameter: 'Unterstützte Testmethoden', specification: 'Microarray, Kolorimetrie, Fluoreszenz, Dry Chemistry, Quantum Dots, Mikrofluidik' },
      { parameter: 'Probenarten', specification: 'Vollblut, Kapillarblut, Serum, Plasma, Urin, Stuhl, Speichel, Haar' },
      { parameter: 'Ergebnisspeicher', specification: 'Bis zu 10.000 Ergebnisse' },
      { parameter: 'Batterie', specification: 'Wiederaufladbarer Lithium-Akku, bis zu 24 Stunden kontinuierlicher Testbetrieb' },
      { parameter: 'Konnektivität', specification: 'USB-C, Wi-Fi (802.11 b/g/n), Bluetooth, API/LIMS-Integration' },
      { parameter: 'Zertifizierung', specification: 'CE-Kennzeichnung, RoHS-konform' }
    ],
    deliveryScope: [
      '1 × Igloo Reader Pro Analysegerät',
      '1 × USB-A auf USB-C Kabel',
      'Elektronisches Benutzerhandbuch'
    ],
    note: 'Wichtiger Hinweis: Adapter und QC-Testkits sind separat erhältlich und nicht im Standardlieferumfang enthalten.'
  },
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



