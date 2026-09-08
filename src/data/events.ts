/**
 * Sprachunabhängige Event-Stammdaten für /events.
 *
 * Die stabile `id` ist zugleich der i18n-Key unter `events:items.<id>` bzw.
 * `events:past_items.<id>`. Titel und Beschreibungen bleiben in den zehn
 * Locale-Dateien; hier stehen ausschließlich belegte Stammdaten.
 */

export const EVENT_DATE_SEMANTICS = 'DATE_ONLY_ALL_DAY' as const
export const EVENT_CALENDAR_TIME_ZONE = 'Europe/Berlin' as const
export const EVENT_CALENDAR_DECISION = 'NOT_REQUIRED_OR_INSUFFICIENT_DATA' as const

export type EventStatus = 'upcoming' | 'ongoing' | 'past'

export interface EventEntry {
  /** Stabiler Schlüssel, zugleich i18n-Key. */
  id: string
  /** Lokaler Kalendertag im strikten Format YYYY-MM-DD. */
  date: string
  /** Inklusiver letzter Kalendertag; fehlt bei eintägigen Events. */
  endDate?: string
  /** Der aktuelle Bestand enthält ausschließlich ganztägige Datumsangaben. */
  dateSemantics: typeof EVENT_DATE_SEMANTICS
  /** Reale Ortsbezeichnung; kein lokalisierter UI-Text. */
  location: string
  /** Optionale reale externe Detailseite. */
  link?: string
  /** Optionaler realer Partner-Eigenname. */
  partner?: string
}

export interface PastEventEntry {
  /** Stabiler Schlüssel, zugleich i18n-Key. */
  id: string
  /** 0-basierter Monat für die lokalisierte Kurzform. */
  month: number
  year: number
  /** Reale Ortsbezeichnung; kein lokalisierter UI-Text. */
  location: string
}

export type PastArchiveEntry =
  | {
      id: string
      source: 'automatic'
      event: EventEntry
      /** Reales Ende (oder Start bei eintägigen Events) als Sortierwahrheit. */
      effectiveDate: string
    }
  | {
      id: string
      source: 'static'
      event: PastEventEntry
      /** Historische Quellen besitzen bewusst nur Monats-/Jahrespräzision. */
      effectiveYear: number
      effectiveMonth: number
    }

const eventRecords = [
  {
    id: 'dentale_themenwelt',
    date: '2026-06-12',
    endDate: '2026-06-13',
    dateSemantics: EVENT_DATE_SEMANTICS,
    location: 'Stuttgart',
    partner: 'Nobel Biocare',
  },
  {
    id: 'dgi_summer_event',
    date: '2026-06-12',
    endDate: '2026-06-13',
    dateSemantics: EVENT_DATE_SEMANTICS,
    location: 'Düsseldorf',
    partner: 'Nobel Biocare',
  },
  {
    id: 'nobel_biocare_dach_symposium',
    date: '2026-06-18',
    endDate: '2026-06-20',
    dateSemantics: EVENT_DATE_SEMANTICS,
    location: 'München',
    partner: 'Nobel Biocare',
  },
  {
    id: 'kite_education',
    date: '2026-08-01',
    endDate: '2026-09-04',
    dateSemantics: EVENT_DATE_SEMANTICS,
    location: 'Sylt',
  },
  {
    id: 'dgi_jahreskongress',
    date: '2026-11-27',
    endDate: '2026-11-28',
    dateSemantics: EVENT_DATE_SEMANTICS,
    location: 'Hamburg',
    partner: 'Nobel Biocare',
  },
] as const satisfies readonly EventEntry[]

/** Reales Flaggschiff-Event; wird nach Ablauf nicht automatisch ersetzt. */
export const HIGHLIGHT_EVENT_ID = 'dgi_jahreskongress'

const historicalRecords = [
  { id: 'ids_cologne', month: 10, year: 2025, location: 'Köln' },
  { id: 'dgi_kongress_frankfurt', month: 8, year: 2025, location: 'Frankfurt' },
  { id: 'dental_summer', month: 5, year: 2025, location: 'Timmendorf' },
  { id: 'ids_innovation', month: 2, year: 2025, location: 'Köln' },
] as const satisfies readonly PastEventEntry[]

const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/
const ALLOWED_LINK_PROTOCOLS = new Set(['https:', 'http:'])

export interface CalendarDateParts {
  year: number
  /** 0-basierter Monat für bestehende Darstellungshelfer. */
  month: number
  day: number
}

/**
 * Parst und validiert einen Date-only-Wert ohne `new Date('YYYY-MM-DD')`.
 * Damit bleibt der Wert ein Kalendertag und wird nie als UTC-Mitternacht
 * fehlinterpretiert.
 */
export function parseIsoDate(iso: string): CalendarDateParts {
  const match = ISO_DATE_PATTERN.exec(iso)
  if (!match) throw new Error(`Invalid event date: ${iso}`)

  const year = Number(match[1])
  const monthNumber = Number(match[2])
  const day = Number(match[3])
  const check = new Date(Date.UTC(year, monthNumber - 1, day))
  if (
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== monthNumber - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error(`Invalid event date: ${iso}`)
  }

  return { year, month: monthNumber - 1, day }
}

/** Liefert den lokalen Kalendertag des injizierten Zeitpunkts in der Event-Zone. */
export function toEventDay(now: Date, timeZone: string = EVENT_CALENDAR_TIME_ZONE): string {
  if (Number.isNaN(now.getTime())) throw new Error('Invalid event clock value')
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value
  return `${value('year')}-${value('month')}-${value('day')}`
}

/** Rückwärtskompatibler Name; jetzt mit expliziter Event-Zonen-Semantik. */
export function toIsoDay(now: Date): string {
  return toEventDay(now)
}

export function getEventStatus(event: EventEntry, now: Date | string): EventStatus {
  const today = typeof now === 'string' ? now : toEventDay(now)
  parseIsoDate(today)
  if (today < event.date) return 'upcoming'
  if (today > (event.endDate ?? event.date)) return 'past'
  return 'ongoing'
}

export function isEventPast(event: EventEntry, today: string): boolean {
  return getEventStatus(event, today) === 'past'
}

/**
 * Kommende/laufende Events: Start aufsteigend, dann stabile ID.
 * Vergangene Events: reales Ende absteigend, dann Start/ID.
 */
export function splitEventsByDate(
  list: readonly EventEntry[],
  now: Date | string,
): { upcoming: EventEntry[]; past: EventEntry[] } {
  const upcoming = list
    .filter((event) => getEventStatus(event, now) !== 'past')
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
  const past = list
    .filter((event) => getEventStatus(event, now) === 'past')
    .sort(
      (a, b) =>
        (b.endDate ?? b.date).localeCompare(a.endDate ?? a.date) ||
        b.date.localeCompare(a.date) ||
        a.id.localeCompare(b.id),
    )
  return { upcoming, past }
}

/** Liefert nur das konfigurierte Highlight, solange es nicht abgelaufen ist. */
export function getEligibleHighlight(
  list: readonly EventEntry[],
  highlightId: string,
  now: Date | string,
): EventEntry | undefined {
  const highlight = list.find((event) => event.id === highlightId)
  return highlight && getEventStatus(highlight, now) !== 'past' ? highlight : undefined
}

/** UI-Projektion ohne zweite Status-/Sortierlogik in der React-Seite. */
export function getUpcomingEventPresentation(
  list: readonly EventEntry[],
  now: Date | string,
  highlightId: string = HIGHLIGHT_EVENT_ID,
): {
  upcoming: EventEntry[]
  past: EventEntry[]
  highlight: EventEntry | undefined
  listEvents: EventEntry[]
} {
  const { upcoming, past } = splitEventsByDate(list, now)
  const highlight = getEligibleHighlight(upcoming, highlightId, now)
  return {
    upcoming,
    past,
    highlight,
    // Die vollständige chronologische Liste bleibt erhalten; das Highlight ist
    // lediglich eine zweite Präsentation desselben kanonischen Datensatzes.
    listEvents: upcoming,
  }
}

/** Eine gemeinsame, clock-injizierbare Projektion für die komplette Eventseite. */
export function getEventPageProjection(
  current: readonly EventEntry[],
  historical: readonly PastEventEntry[],
  now: Date | string,
  highlightId: string = HIGHLIGHT_EVENT_ID,
) {
  return {
    ...getUpcomingEventPresentation(current, now, highlightId),
    archive: buildPastEventArchive(current, historical, now),
  }
}

/**
 * Führt automatisch abgelaufene Termine und belegte statische Historie zusammen.
 *
 * Die stabile Event-ID ist die einzige Dedupe-Wahrheit. Ein automatisch
 * abgelaufener Datensatz gewinnt bei gleicher ID, weil er das belegte genaue
 * Start-/Enddatum enthält. Ähnliche Titel oder Daten werden nie unscharf
 * zusammengeführt. Statische Monatsquellen erhalten keinen erfundenen Tag.
 */
export function buildPastEventArchive(
  current: readonly EventEntry[],
  historical: readonly PastEventEntry[],
  now: Date | string,
): PastArchiveEntry[] {
  const archive = new Map<string, PastArchiveEntry>()

  for (const event of current) {
    if (getEventStatus(event, now) !== 'past') continue
    archive.set(event.id, {
      id: event.id,
      source: 'automatic',
      event,
      effectiveDate: event.endDate ?? event.date,
    })
  }

  for (const event of historical) {
    if (archive.has(event.id)) continue
    archive.set(event.id, {
      id: event.id,
      source: 'static',
      event,
      effectiveYear: event.year,
      effectiveMonth: event.month,
    })
  }

  return [...archive.values()].sort((a, b) => {
    const aParts =
      a.source === 'automatic'
        ? parseIsoDate(a.effectiveDate)
        : { year: a.effectiveYear, month: a.effectiveMonth, day: -1 }
    const bParts =
      b.source === 'automatic'
        ? parseIsoDate(b.effectiveDate)
        : { year: b.effectiveYear, month: b.effectiveMonth, day: -1 }

    return (
      bParts.year - aParts.year ||
      bParts.month - aParts.month ||
      bParts.day - aParts.day ||
      a.id.localeCompare(b.id)
    )
  })
}

/**
 * Sichere native Linkattribute für einen belegten externen Eventlink.
 * Navigation bleibt unabhängig von Tracking und Analytics-Consent.
 */
export function getExternalEventLink(event: EventEntry):
  | {
      href: string
      target: '_blank'
      rel: 'noopener noreferrer'
    }
  | undefined {
  return event.link ? { href: event.link, target: '_blank', rel: 'noopener noreferrer' } : undefined
}

export function validateEventInventory(
  current: readonly EventEntry[],
  historical: readonly PastEventEntry[],
  highlightId: string,
): void {
  const ids = new Set<string>()
  for (const event of current) {
    if (!event.id.trim() || ids.has(event.id))
      throw new Error(`Duplicate or empty event id: ${event.id}`)
    ids.add(event.id)
    parseIsoDate(event.date)
    if (event.endDate) {
      parseIsoDate(event.endDate)
      if (event.endDate < event.date) throw new Error(`Event ${event.id} ends before it starts`)
    }
    if (event.dateSemantics !== EVENT_DATE_SEMANTICS) {
      throw new Error(`Unsupported date semantics for event ${event.id}`)
    }
    if (!event.location.trim()) throw new Error(`Missing location for event ${event.id}`)
    if (event.link) {
      let url: URL
      try {
        url = new URL(event.link)
      } catch {
        throw new Error(`Invalid event URL for ${event.id}`)
      }
      if (!ALLOWED_LINK_PROTOCOLS.has(url.protocol)) {
        throw new Error(`Invalid event URL protocol for ${event.id}`)
      }
    }
  }

  const historicalIds = new Set<string>()
  for (const event of historical) {
    if (!event.id.trim() || historicalIds.has(event.id)) {
      throw new Error(`Duplicate or empty historical event id: ${event.id}`)
    }
    historicalIds.add(event.id)
    if (!Number.isInteger(event.month) || event.month < 0 || event.month > 11) {
      throw new Error(`Invalid historical event month for ${event.id}`)
    }
    if (!Number.isInteger(event.year) || event.year < 1900) {
      throw new Error(`Invalid historical event year for ${event.id}`)
    }
    if (!event.location.trim()) throw new Error(`Missing historical location for ${event.id}`)
  }

  if (!ids.has(highlightId)) throw new Error(`Unknown highlight event id: ${highlightId}`)
}

validateEventInventory(eventRecords, historicalRecords, HIGHLIGHT_EVENT_ID)

export const events: readonly EventEntry[] = eventRecords
export const pastEvents: readonly PastEventEntry[] = historicalRecords

export function humanizeEventId(id: string): string {
  return id
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
