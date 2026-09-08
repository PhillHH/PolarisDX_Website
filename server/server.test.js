// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'

// server.js is CommonJS; require it from this ESM test file.
const require = createRequire(import.meta.url)
const { esc, resolveLeadAttribution } = require('./server')

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

describe('resolveLeadAttribution', () => {
  it('accepts only deterministic Homepage sales and ROI contexts', () => {
    expect(
      resolveLeadAttribution({ source: 'homepage', journey: 'general_sales', section: 'hero' }),
    ).toEqual({ source: 'homepage', journey: 'general_sales', section: 'hero' })
    expect(
      resolveLeadAttribution({ source: 'homepage', journey: 'roi_report', section: 'roi' }),
    ).toEqual({ source: 'homepage', journey: 'roi_report', section: 'roi' })
  })

  it('drops unknown or inconsistent URL attribution instead of forwarding it', () => {
    expect(
      resolveLeadAttribution({ source: 'homepage', journey: 'general_sales', section: 'unknown' }),
    ).toEqual({ source: '', journey: '', section: '' })
    expect(
      resolveLeadAttribution({ source: '<script>', journey: 'general_sales', section: 'hero' }),
    ).toEqual({ source: '', journey: '', section: '' })
  })
})
