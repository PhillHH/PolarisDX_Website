/**
 * Event-Stammdaten für /events.
 *
 * WICHTIG: Hier stehen ausschließlich sprachunabhängige Daten — Datum, Ort,
 * Partner, Link. Alle Texte (Titel, Beschreibung, Tag, Detail-Label,
 * Wasserzeichen) liegen in public/locales/<lang>/events.json unter
 * `items.<id>` bzw. `past_items.<id>` und werden über t() geholt — gleiches
 * Muster wie die Testimonials in home.json.
 *
 * Die `id` ist damit zugleich der i18n-Schlüssel und muss stabil bleiben:
 * Wer sie ändert, muss sie in allen zehn Sprachdateien mit ändern.
 */

/** Ein Termin im Kalender. */
export interface EventEntry {
  /** Stabiler Schlüssel, zugleich i18n-Key (events:items.<id>.*). */
  id: string
  /** ISO-Startdatum, Format YYYY-MM-DD. */
  date: string
  /** ISO-Enddatum, Format YYYY-MM-DD. Fehlt es, gilt der Termin als eintägig. */
  endDate?: string
  /** Eigenname (Stadt) — bleibt in allen Sprachen unübersetzt. */
  location: string
  /** Optionale externe Detailseite. */
  link?: string
  /** Eigenname (Partnerfirma) — bleibt in allen Sprachen unübersetzt. */
  partner?: string
}

export const events: EventEntry[] = [
  {
    id: 'dentale_themenwelt',
    date: '2026-06-12',
    endDate: '2026-06-13',
    location: 'Stuttgart',
    partner: 'Nobel Biocare',
  },
  {
    id: 'dgi_summer_event',
    date: '2026-06-12',
    endDate: '2026-06-13',
    location: 'Düsseldorf',
    partner: 'Nobel Biocare',
  },
  {
    id: 'nobel_biocare_dach_symposium',
    date: '2026-06-18',
    endDate: '2026-06-20',
    location: 'München',
    partner: 'Nobel Biocare',
  },
  {
    id: 'kite_education',
    date: '2026-08-01',
    endDate: '2026-09-04',
    location: 'Sylt',
  },
  {
    id: 'dgi_jahreskongress',
    date: '2026-11-27',
    endDate: '2026-11-28',
    location: 'Hamburg',
    partner: 'Nobel Biocare',
  },
]

/** id des Flaggschiff-Termins, der auf /events prominent gezeigt wird. */
export const HIGHLIGHT_EVENT_ID = 'dgi_jahreskongress'

/**
 * Kuratierter Rückblick für den "Where we've been"-Abschnitt.
 * Rein visuell — Titel, `detail` (kurzes Label) und `watermark` (großes
 * Hintergrund-Wort) kommen aus events.json unter `past_items.<id>`.
 *
 * Abgelaufene Einträge aus `events` landen automatisch ebenfalls in diesem
 * Abschnitt, dafür ist hier nichts zu pflegen.
 */
export interface PastEventEntry {
  /** Stabiler Schlüssel, zugleich i18n-Key (events:past_items.<id>.*). */
  id: string
  /** 0-basierter Monat für die lokalisierte Kurzform. */
  month: number
  year: number
  /** Eigenname (Stadt) — bleibt in allen Sprachen unübersetzt. */
  location: string
}

export const pastEvents: PastEventEntry[] = [
  { id: 'ids_cologne', month: 10, year: 2025, location: 'Köln' },
  { id: 'dgi_kongress_frankfurt', month: 8, year: 2025, location: 'Frankfurt' },
  { id: 'dental_summer', month: 5, year: 2025, location: 'Timmendorf' },
  { id: 'ids_innovation', month: 2, year: 2025, location: 'Köln' },
]

// =============================================================================
// DATUMS-HELFER
// =============================================================================

/**
 * Heutiger Tag als ISO-Datum (YYYY-MM-DD) in UTC.
 *
 * Bewusst UTC und bewusst als Parameter statt Modul-Konstante:
 * - UTC, damit Server-Render und Browser-Hydration zum selben Ergebnis kommen,
 *   egal in welcher Zeitzone der Besucher sitzt.
 * - Kein Modul-Level-Snapshot, sonst friert ein tagelang laufender SSR-Prozess
 *   das Datum auf seinen Startzeitpunkt ein.
 */
export function toIsoDay(now: Date): string {
  return now.toISOString().slice(0, 10)
}

/** Ein Termin ist vorbei, wenn sein Enddatum VOR dem heutigen Tag liegt. */
export function isEventPast(event: EventEntry, today: string): boolean {
  return (event.endDate ?? event.date) < today
}

/** Teilt die Termine anhand des übergebenen Tages in "kommend" und "vorbei". */
export function splitEventsByDate(
  list: EventEntry[],
  today: string,
): { upcoming: EventEntry[]; past: EventEntry[] } {
  const upcoming = list
    .filter((e) => !isEventPast(e, today))
    .sort((a, b) => a.date.localeCompare(b.date))
  const past = list
    .filter((e) => isEventPast(e, today))
    .sort((a, b) => b.date.localeCompare(a.date))
  return { upcoming, past }
}

/**
 * Zerlegt ein ISO-Datum ohne `new Date()`.
 *
 * `new Date('2026-06-12')` wird als UTC-Mitternacht geparst und kippt in
 * westlichen Zeitzonen auf den Vortag — das ergibt im Browser ein anderes
 * Datum als beim Server-Render.
 *
 * @returns Jahr, 0-basierter Monat und Tag.
 */
export function parseIsoDate(iso: string): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split('-').map((part) => Number.parseInt(part, 10))
  return { year: year || 0, month: (month || 1) - 1, day: day || 1 }
}

/** Notnagel-Label, falls für eine id keine Übersetzung existiert. */
export function humanizeEventId(id: string): string {
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
