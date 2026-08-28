import { describe, expect, it } from 'vitest'

import { formatCurrency, formatDate, formatNumber, getIntlLocale } from './localeFormat'

describe('PT08.2 locale formatting', () => {
  it('maps every project language to its regional Intl locale', () => {
    expect([
      'de-DE',
      'en-GB',
      'pl-PL',
      'fr-FR',
      'it-IT',
      'es-ES',
      'pt-PT',
      'da-DK',
      'nl-NL',
      'cs-CZ',
    ]).toEqual(['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'].map(getIntlLocale))
  })

  it('formats prices and numbers from the active locale', () => {
    expect(formatCurrency(49.9, 'de')).toMatch(/^49,90.*€$/)
    expect(formatCurrency(49.9, 'en')).toBe('€49.90')
    expect(formatNumber(1234.5, 'de')).toBe('1.234,5')
    expect(formatNumber(1234.5, 'en')).toBe('1,234.5')
  })

  it('formats dates from the active locale without a fixed DE/US override', () => {
    expect(formatDate('2026-02-01T12:00:00Z', 'de')).toContain('Februar')
    expect(formatDate('2026-02-01T12:00:00Z', 'en')).toContain('February')
  })
})
