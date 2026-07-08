import type { Event } from '../types'

export const events: Event[] = [
  {
    id: 1,
    title: 'Dentale Themenwelt',
    date: '2026-06-12',
    endDate: '2026-06-13',
    location: 'Stuttgart',
    description: 'Point-of-Care-Diagnostik trifft Dentalmedizin — live vor Ort in Stuttgart.',
    partner: 'Nobel Biocare',
    tag: 'Fortbildung',
  },
  {
    id: 2,
    title: 'DGI Summer Event',
    date: '2026-06-12',
    endDate: '2026-06-13',
    location: 'Düsseldorf',
    description: 'Sommer, Implantologie und Innovation — das DGI Summer Event in Düsseldorf.',
    partner: 'Nobel Biocare',
    tag: 'Kongress',
  },
  {
    id: 3,
    title: 'Nobel Biocare DACH-Symposium',
    date: '2026-06-18',
    endDate: '2026-06-20',
    location: 'München',
    description: 'Drei Tage intensiver Austausch auf dem DACH-Symposium von Nobel Biocare.',
    partner: 'Nobel Biocare',
    tag: 'Symposium',
  },
  {
    id: 4,
    title: 'Kite & Education',
    date: '2026-08-01',
    endDate: '2026-09-04',
    location: 'Sylt',
    description: 'Wind, Wellen und Wissen — Fortbildung trifft Lifestyle auf Sylt.',
    tag: 'Education',
  },
  {
    id: 5,
    title: 'DGI Jahreskongress',
    date: '2026-11-27',
    endDate: '2026-11-28',
    location: 'Hamburg',
    description: 'Der größte implantologische Fachkongress im deutschsprachigen Raum.',
    partner: 'Nobel Biocare',
    tag: 'Kongress',
  },
]

/** Title (or partial) of the flagship event featured prominently on /events. */
export const HIGHLIGHT_EVENT_TITLE = 'DGI Jahreskongress'

/**
 * Vergangene Events (Rückblick 2025) für den "Where we've been"-Abschnitt.
 * Rein visueller Rückblick — `detail` ist ein kurzes Label (Besucher/Format/Award),
 * `watermark` das große Hintergrund-Wort auf der Karte.
 */
export interface PastEvent {
  id: number
  /** 0-basierter Monat für die lokalisierte Kurzform. */
  month: number
  year: number
  title: string
  location: string
  detail: string
  watermark: string
}

export const pastEvents: PastEvent[] = [
  { id: 1, month: 10, year: 2025, title: 'IDS Cologne', location: 'Köln', detail: '1.200 Besucher', watermark: 'Köln 2025' },
  { id: 2, month: 8, year: 2025, title: 'DGI Kongress', location: 'Frankfurt', detail: 'Live-Demo', watermark: 'Frankfurt 2025' },
  { id: 3, month: 5, year: 2025, title: 'Dental Summer', location: 'Timmendorf', detail: 'Workshop', watermark: 'Timmendorf 2025' },
  { id: 4, month: 2, year: 2025, title: 'IDS Innovation', location: 'Köln', detail: 'Award', watermark: 'IDS 2025' },
]
