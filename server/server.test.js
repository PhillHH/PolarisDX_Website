// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'

// server.js is CommonJS; require it from this ESM test file.
const require = createRequire(import.meta.url)
const { esc, parseEventRegistration } = require('./server')

describe('esc', () => {
  it('escapes all five HTML-sensitive characters', () => {
    expect(esc(`<b>&"'`)).toBe('&lt;b&gt;&amp;&quot;&#39;')
  })

  it('escapes & before other entities (no double-escaping of produced entities)', () => {
    expect(esc('<')).toBe('&lt;') // not &amp;lt;
    expect(esc('&lt;')).toBe('&amp;lt;') // literal input text preserved verbatim
  })

  it('null-safes nullish input to empty string', () => {
    expect(esc(null)).toBe('')
    expect(esc(undefined)).toBe('')
  })

  it('coerces non-string input without throwing', () => {
    expect(esc(42)).toBe('42')
    expect(esc(true)).toBe('true')
  })

  it('neutralises a script payload so it cannot render as live markup', () => {
    const out = esc('<script>alert(1)</script>')
    expect(out).not.toMatch(/<script>/)
    expect(out).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('preserves the escape-then-linebreak invariant used at message sinks', () => {
    // Mirrors `esc(value).replace(/\n/g, '<br>')`: user markup is neutralised
    // first, so only the intended <br> stays live.
    const rendered = esc('<i>hi</i>\nworld').replace(/\n/g, '<br>')
    expect(rendered).toBe('&lt;i&gt;hi&lt;/i&gt;<br>world')
  })
})

describe('parseEventRegistration', () => {
  const valid = {
    event: 'future-forum-berlin-2026',
    name: 'Dr. Erika Musterfrau',
    email: 'erika@praxis.de',
    company: 'Praxis Musterfrau',
    phone: '+49 30 1234567',
    attendance: 'full',
    persons: '2',
    cme: true,
    message: 'Mit Kollegin.',
    consent: true,
  }

  it('drops honeypot submissions silently', () => {
    expect(parseEventRegistration({ ...valid, _hp: 'x' })).toEqual({ honeypot: true })
  })

  it('requires explicit consent', () => {
    expect(parseEventRegistration({ ...valid, consent: 'yes' }).error.status).toBe(400)
    expect(parseEventRegistration({ ...valid, consent: undefined }).error.status).toBe(400)
  })

  it('rejects unknown events so the form cannot forge subjects', () => {
    expect(parseEventRegistration({ ...valid, event: 'anything' }).error.message).toBe(
      'Unknown event.',
    )
    expect(parseEventRegistration({ ...valid, event: { toString: () => 'x' } }).error).toBeTruthy()
  })

  it('validates name, email, attendance and persons', () => {
    expect(parseEventRegistration({ ...valid, name: 'A' }).error).toBeTruthy()
    expect(parseEventRegistration({ ...valid, email: 'nope' }).error.message).toBe('Invalid email.')
    expect(parseEventRegistration({ ...valid, attendance: 'vip' }).error).toBeTruthy()
    expect(parseEventRegistration({ ...valid, persons: '0' }).error).toBeTruthy()
    expect(parseEventRegistration({ ...valid, persons: '6' }).error).toBeTruthy()
    expect(parseEventRegistration({ ...valid, persons: 'abc' }).error).toBeTruthy()
  })

  it('returns sanitised data with resolved labels', () => {
    const { data } = parseEventRegistration({ ...valid, name: '  Dr. Erika Musterfrau  ' })
    expect(data.name).toBe('Dr. Erika Musterfrau')
    expect(data.persons).toBe(2)
    expect(data.cme).toBe(true)
    expect(data.attendanceLabel).toBe('Fachprogramm + After Hours')
    expect(data.event.venue).toBe('NIO House Berlin')
    expect(data.eventSlug).toBe('future-forum-berlin-2026')
  })

  it('clips oversized free text and tolerates missing optionals', () => {
    const { data } = parseEventRegistration({
      ...valid,
      company: undefined,
      phone: undefined,
      message: 'x'.repeat(5000),
      cme: 'yes',
    })
    expect(data.company).toBe('')
    expect(data.phone).toBe('')
    expect(data.message).toHaveLength(4000)
    expect(data.cme).toBe(false)
  })
})
