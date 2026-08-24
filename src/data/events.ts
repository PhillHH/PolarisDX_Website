import type { Event } from '../types'

/**
 * Future Forum Berlin — eigene Seite mit Anmeldung unter `link`. Der Slug im
 * Link ist auch der Schluessel, den das Mail-Backend (server/server.js,
 * EVENTS) kennt; beide muessen zusammenpassen.
 */
export const FUTURE_FORUM_BERLIN: Event = {
  id: 6,
  title: 'Future Forum Berlin – The Future Patient',
  date: '2026-10-02',
  location: 'Berlin · NIO House',
  description:
    'Diagnostics × AI × Implantology: systemische Risiken sichtbar machen, mit KI planen, früher handeln – live im NIO House am Kurfürstendamm. Mit Anmeldung.',
  partner: 'Nobel Biocare',
  tag: 'Future Forum',
  link: '/events/future-forum-berlin-2026',
}

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
  FUTURE_FORUM_BERLIN,
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
