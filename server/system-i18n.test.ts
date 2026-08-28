// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SUPPORTED_LANGUAGES } from '../src/i18n'

const require = createRequire(import.meta.url)
const { MAIL_COPY, resolveMailLocale, getMailCopy, formatMailCurrency } = require('./system-i18n')
const { buildRoiPdf } = require('./server')

function leafPaths(value: unknown, prefix = ''): string[] {
  if (typeof value === 'string') return [prefix]
  if (!value || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, child]) =>
    leafPaths(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('PT08.5 system and mail i18n', () => {
  it('uses exactly the canonical ten project locales with one key schema', () => {
    expect(Object.keys(MAIL_COPY)).toEqual([...SUPPORTED_LANGUAGES])
    const schema = leafPaths(MAIL_COPY.de)
    for (const locale of SUPPORTED_LANGUAGES) {
      expect(leafPaths(MAIL_COPY[locale])).toEqual(schema)
      for (const path of schema) {
        const value = path.split('.').reduce((node, key) => node[key], MAIL_COPY[locale])
        expect(value.trim(), `${locale}:${path}`).not.toBe('')
      }
    }
  })

  it('contains genuine target-language support subjects and ROI copy', () => {
    expect(MAIL_COPY.pl.support.subject).toContain('zgłoszenie')
    expect(MAIL_COPY.fr.roi.cta).toContain('consultation')
    expect(MAIL_COPY.es.support.received).toContain('Hemos recibido')
    expect(MAIL_COPY.nl.roi.disclaimer).toContain('voorbeeldberekening')
    expect(MAIL_COPY.cs.support.team).toContain('podpory')
    for (const locale of SUPPORTED_LANGUAGES.filter((language) => language !== 'en')) {
      expect(MAIL_COPY[locale].support.received).not.toBe(MAIL_COPY.en.support.received)
      expect(MAIL_COPY[locale].roi.disclaimer).not.toBe(MAIL_COPY.en.roi.disclaimer)
    }
  })

  it('keeps valid locales and falls back defensively to English for invalid input', () => {
    expect(resolveMailLocale('pl')).toEqual({ locale: 'pl', requested: 'pl', didFallback: false })
    expect(resolveMailLocale('xx')).toEqual({ locale: 'en', requested: 'xx', didFallback: true })
    expect(getMailCopy('xx')).toBe(MAIL_COPY.en)
  })

  it('formats ROI currency with the journey locale', () => {
    expect(formatMailCurrency(1234, 'de')).toMatch(/1\.234/)
    expect(formatMailCurrency(1234, 'en')).toMatch(/1,234/)
    expect(formatMailCurrency(1234, 'pl')).toBe('1234 €')
  })

  it.each(SUPPORTED_LANGUAGES)('builds the existing ROI PDF safely for %s', async (locale) => {
    const pdf = await buildRoiPdf({
      practice: 'Test Practice',
      area: 'Test',
      locale,
      outputs: { dbPerMonth: 1234, revenuePerMonth: 2345, dbPerYear: 14808, dbPerTest: 12 },
    })
    expect(Buffer.isBuffer(pdf)).toBe(true)
    expect(pdf.subarray(0, 4).toString()).toBe('%PDF')
  })

  it('uses structured public error codes and never returns provider text', () => {
    const source = readFileSync(resolve(process.cwd(), 'server/server.js'), 'utf8')
    expect(source).toContain('code: ERROR_CODES.rateLimited')
    for (const legacyText of [
      'Consent required.',
      'Required fields are missing.',
      'Invalid email.',
      'Failed to send support email',
      'Failed to send order',
      'Failed to process ROI report',
    ]) {
      expect(source).not.toContain(legacyText)
    }
    expect(source).not.toContain("Intl.NumberFormat('de-DE'")
  })
})
