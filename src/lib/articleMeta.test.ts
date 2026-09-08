/// <reference types="node" />
// @vitest-environment node

import { describe, expect, it } from 'vitest'
import {
  articleDateIso,
  calculateArticleReadMinutes,
  countArticleWords,
  formatArticleDate,
  parseArticleDate,
} from './articleMeta'

describe('PT17.2 article metadata truth', () => {
  it('keeps the stored ISO publication date stable while formatting by locale', () => {
    expect(articleDateIso('2025-11-28')).toBe('2025-11-28')
    expect(formatArticleDate('2025-11-28', 'de')).toContain('2025')
    expect(formatArticleDate('2025-11-28', 'fr')).toContain('2025')
    expect(parseArticleDate('build time')).toBeNull()
    expect(() => articleDateIso('build time')).toThrow('Invalid article ISO date')
  })

  it('derives reading time deterministically from visible prose only', () => {
    const twoHundredOneWords = Array.from({ length: 201 }, (_, index) => `wort-${index}`).join(' ')
    const sections = [
      { type: 'text', image: 'not-reading-copy.webp', paragraphs: [twoHundredOneWords] },
    ]

    expect(countArticleWords('Lead copy', sections)).toBe(203)
    expect(calculateArticleReadMinutes('Lead copy', sections)).toBe(2)
    expect(calculateArticleReadMinutes('one short sentence')).toBe(1)
  })
})
