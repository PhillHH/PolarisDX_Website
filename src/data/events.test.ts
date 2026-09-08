// @vitest-environment node

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  EVENT_CALENDAR_TIME_ZONE,
  EVENT_CALENDAR_DECISION,
  EVENT_DATE_SEMANTICS,
  HIGHLIGHT_EVENT_ID,
  events,
  buildPastEventArchive,
  getEligibleHighlight,
  getEventPageProjection,
  getExternalEventLink,
  getEventStatus,
  getUpcomingEventPresentation,
  parseIsoDate,
  pastEvents,
  splitEventsByDate,
  toEventDay,
  validateEventInventory,
  type EventEntry,
} from './events'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

const baseEvent: EventEntry = {
  id: 'fixture',
  date: '2026-06-12',
  dateSemantics: EVENT_DATE_SEMANTICS,
  location: 'Berlin',
}

describe('event inventory validation', () => {
  it('keeps the measured five current and four historical stable IDs', () => {
    expect(events.map(({ id }) => id)).toEqual([
      'dentale_themenwelt',
      'dgi_summer_event',
      'nobel_biocare_dach_symposium',
      'kite_education',
      'dgi_jahreskongress',
    ])
    expect(pastEvents.map(({ id }) => id)).toEqual([
      'ids_cologne',
      'dgi_kongress_frankfurt',
      'dental_summer',
      'ids_innovation',
    ])
    expect(() => validateEventInventory(events, pastEvents, HIGHLIGHT_EVENT_ID)).not.toThrow()
  })

  it.each([
    ['invalid date', [{ ...baseEvent, date: '2026-02-30' }]],
    ['end before start', [{ ...baseEvent, endDate: '2026-06-11' }]],
    ['invalid URL', [{ ...baseEvent, link: 'javascript:alert(1)' }]],
  ])('hard-fails %s', (_label, records) => {
    expect(() => validateEventInventory(records, [], 'fixture')).toThrow()
  })

  it('hard-fails duplicate IDs', () => {
    expect(() => validateEventInventory([baseEvent, { ...baseEvent }], [], 'fixture')).toThrow(
      /Duplicate/,
    )
  })

  it('hard-fails a phantom highlight', () => {
    expect(() => validateEventInventory([baseEvent], [], 'missing')).toThrow(/highlight/)
  })
})

describe('date-only semantics and injected clock', () => {
  const single: EventEntry = { ...baseEvent, date: '2026-06-12' }
  const multi: EventEntry = { ...baseEvent, date: '2026-06-12', endDate: '2026-06-14' }

  it('strictly parses calendar dates without UTC timestamp conversion', () => {
    expect(parseIsoDate('2026-06-12')).toEqual({ year: 2026, month: 5, day: 12 })
    expect(() => parseIsoDate('2026-6-12')).toThrow()
    expect(() => parseIsoDate('not-a-date')).toThrow()
  })

  it('uses the explicit Europe/Berlin event day across midnight', () => {
    expect(EVENT_CALENDAR_TIME_ZONE).toBe('Europe/Berlin')
    expect(toEventDay(new Date('2026-09-01T21:59:59Z'))).toBe('2026-09-01')
    expect(toEventDay(new Date('2026-09-01T22:00:01Z'))).toBe('2026-09-02')
  })

  it.each([
    ['single day before', single, '2026-06-11', 'upcoming'],
    ['single same day', single, '2026-06-12', 'ongoing'],
    ['single day after', single, '2026-06-13', 'past'],
    ['multi day before', multi, '2026-06-11', 'upcoming'],
    ['multi start day', multi, '2026-06-12', 'ongoing'],
    ['multi middle day', multi, '2026-06-13', 'ongoing'],
    ['multi end day inclusive', multi, '2026-06-14', 'ongoing'],
    ['multi day after', multi, '2026-06-15', 'past'],
  ] as const)('%s', (_label, event, now, expected) => {
    expect(getEventStatus(event, now)).toBe(expected)
  })

  it('accepts an injected instant rather than reading the system clock', () => {
    expect(getEventStatus(single, new Date('2026-06-11T10:00:00Z'))).toBe('upcoming')
    expect(getEventStatus(single, new Date('2026-06-12T10:00:00Z'))).toBe('ongoing')
  })
})

describe('sorting and highlight eligibility', () => {
  it('sorts upcoming by start/ID and past by real end descending', () => {
    const sameDayB = { ...baseEvent, id: 'b' }
    const sameDayA = { ...baseEvent, id: 'a' }
    const laterEnd = { ...baseEvent, id: 'later', date: '2026-06-10', endDate: '2026-06-15' }
    const result = splitEventsByDate([sameDayB, laterEnd, sameDayA], '2026-06-20')
    expect(result.past.map(({ id }) => id)).toEqual(['later', 'a', 'b'])

    const future = splitEventsByDate([sameDayB, sameDayA], '2026-06-01')
    expect(future.upcoming.map(({ id }) => id)).toEqual(['a', 'b'])
  })

  it('uses only the configured real highlight while it is eligible', () => {
    expect(getEligibleHighlight(events, HIGHLIGHT_EVENT_ID, '2026-09-01')?.id).toBe(
      'dgi_jahreskongress',
    )
    expect(getEligibleHighlight(events, HIGHLIGHT_EVENT_ID, '2026-11-29')).toBeUndefined()
    expect(getEligibleHighlight(events, 'missing', '2026-09-01')).toBeUndefined()
  })

  it('projects the complete chronological list while featuring the same highlight record', () => {
    const presentation = getUpcomingEventPresentation(events, '2026-09-01')
    expect(presentation.upcoming.map(({ id }) => id)).toEqual([
      'kite_education',
      'dgi_jahreskongress',
    ])
    expect(presentation.highlight?.id).toBe('dgi_jahreskongress')
    expect(presentation.listEvents.map(({ id }) => id)).toEqual([
      'kite_education',
      'dgi_jahreskongress',
    ])
    expect(getEventStatus(presentation.listEvents[0], '2026-09-01')).toBe('ongoing')
  })

  it('renders no stale highlight and keeps later eligible events in the normal list', () => {
    const later = { ...baseEvent, id: 'later', date: '2026-12-10' }
    const presentation = getUpcomingEventPresentation(
      [...events, later],
      '2026-11-29',
      HIGHLIGHT_EVENT_ID,
    )
    expect(presentation.highlight).toBeUndefined()
    expect(presentation.listEvents.map(({ id }) => id)).toEqual(['later'])
  })

  it('exposes safe native external links only when real data contains one', () => {
    expect(getExternalEventLink(baseEvent)).toBeUndefined()
    expect(
      getExternalEventLink({ ...baseEvent, link: 'https://events.example.test/details' }),
    ).toEqual({
      href: 'https://events.example.test/details',
      target: '_blank',
      rel: 'noopener noreferrer',
    })
  })

  it('keeps calendar delivery consciously absent for the current insufficient dataset', () => {
    expect(EVENT_CALENDAR_DECISION).toBe('NOT_REQUIRED_OR_INSUFFICIENT_DATA')
    expect(events.every(({ dateSemantics }) => dateSemantics === 'DATE_ONLY_ALL_DAY')).toBe(true)
    expect(events.every(({ link }) => !link)).toBe(true)
  })
})

describe('past archive transition, merge and stable-ID dedupe', () => {
  const single: EventEntry = { ...baseEvent, id: 'single', date: '2026-06-12' }
  const multi: EventEntry = {
    ...baseEvent,
    id: 'multi',
    date: '2026-06-12',
    endDate: '2026-06-14',
  }

  it('keeps the end day current and transitions only on the following day', () => {
    expect(buildPastEventArchive([single], [], '2026-06-12')).toEqual([])
    expect(buildPastEventArchive([single], [], '2026-06-13').map(({ id }) => id)).toEqual([
      'single',
    ])
    expect(buildPastEventArchive([multi], [], '2026-06-14')).toEqual([])
    expect(buildPastEventArchive([multi], [], '2026-06-15').map(({ id }) => id)).toEqual(['multi'])
  })

  it('merges automatic past and static history while automatic truth wins the same ID', () => {
    const archive = buildPastEventArchive(
      [single],
      [
        { id: 'single', month: 5, year: 2026, location: 'Legacy place' },
        { id: 'static-only', month: 4, year: 2026, location: 'Köln' },
      ],
      '2026-06-13',
    )
    expect(archive.map(({ id }) => id)).toEqual(['single', 'static-only'])
    expect(archive.filter(({ id }) => id === 'single')).toHaveLength(1)
    expect(archive[0]).toMatchObject({ id: 'single', source: 'automatic' })
  })

  it('sorts by actual end newest-first and preserves unrelated same-date events', () => {
    const sameDate = { ...single, id: 'same-date' }
    const laterEnd = {
      ...multi,
      id: 'later-end',
      date: '2026-06-10',
      endDate: '2026-06-20',
    }
    expect(
      buildPastEventArchive([single, sameDate, laterEnd], [], '2026-06-21').map(({ id }) => id),
    ).toEqual(['later-end', 'same-date', 'single'])
  })

  it('covers empty, static-only, all-past and past-highlight edge states', () => {
    expect(buildPastEventArchive([], [], '2026-01-01')).toEqual([])
    expect(buildPastEventArchive([], pastEvents, '2026-01-01')).toHaveLength(4)
    expect(buildPastEventArchive(events, pastEvents, '2027-01-01')).toHaveLength(9)

    const afterHighlight = buildPastEventArchive(events, pastEvents, '2026-11-29')
    expect(afterHighlight.filter(({ id }) => id === HIGHLIGHT_EVENT_ID)).toHaveLength(1)
    expect(getEligibleHighlight(events, HIGHLIGHT_EVENT_ID, '2026-11-29')).toBeUndefined()
  })
})

describe('fixed-now full-page integration matrix', () => {
  it.each([
    ['before single-day', '2026-06-11', [], 5],
    ['same single-day', '2026-06-12', ['dentale_themenwelt', 'dgi_summer_event'], 5],
    ['after single-day', '2026-06-14', [], 3],
    ['before multi-day', '2026-07-31', [], 2],
    ['multi-day start', '2026-08-01', ['kite_education'], 2],
    ['multi-day middle', '2026-09-01', ['kite_education'], 2],
    ['multi-day end', '2026-09-04', ['kite_education'], 2],
    ['after multi-day', '2026-09-05', [], 1],
  ] as const)('%s', (_label, now, ongoingIds, upcomingCount) => {
    const projection = getEventPageProjection(events, pastEvents, now)
    expect(projection.upcoming).toHaveLength(upcomingCount)
    expect(
      projection.upcoming
        .filter((event) => getEventStatus(event, now) === 'ongoing')
        .map(({ id }) => id),
    ).toEqual(ongoingIds)
    expect(new Set(projection.archive.map(({ id }) => id)).size).toBe(projection.archive.length)
    expect(projection.highlight?.id).toBe('dgi_jahreskongress')
  })

  it('removes the expired real highlight from current UI and archives it once', () => {
    const projection = getEventPageProjection(events, pastEvents, '2026-11-29')
    expect(projection.upcoming).toEqual([])
    expect(projection.highlight).toBeUndefined()
    expect(projection.archive.filter(({ id }) => id === HIGHLIGHT_EVENT_ID)).toHaveLength(1)
  })
})

describe('event i18n identity parity', () => {
  it.each(locales)('%s has every current and historical stable ID', (locale) => {
    const document = JSON.parse(
      readFileSync(resolve(process.cwd(), `public/locales/${locale}/events.json`), 'utf8'),
    ) as {
      items: Record<string, { title?: string; tag?: string; description?: string }>
      past_items: Record<string, { title?: string; detail?: string; watermark?: string }>
    }

    expect(Object.keys(document.items).sort()).toEqual(events.map(({ id }) => id).sort())
    expect(Object.keys(document.past_items).sort()).toEqual(pastEvents.map(({ id }) => id).sort())
    for (const event of events) {
      expect(document.items[event.id]?.title?.trim()).toBeTruthy()
      expect(document.items[event.id]?.tag?.trim()).toBeTruthy()
      expect(document.items[event.id]?.description?.trim()).toBeTruthy()
    }
    for (const event of pastEvents) {
      expect(document.past_items[event.id]?.title?.trim()).toBeTruthy()
      expect(document.past_items[event.id]?.detail?.trim()).toBeTruthy()
      expect(document.past_items[event.id]?.watermark?.trim()).toBeTruthy()
    }
  })
})
