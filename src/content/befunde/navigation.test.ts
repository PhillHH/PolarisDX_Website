// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { BEFUND_ORDER, getBefundNeighbors } from './meta'

describe('Musterbefund navigation order', () => {
  it('derives a stable non-wrapping previous/next pair for every family', () => {
    expect(BEFUND_ORDER.map((slug) => [slug, getBefundNeighbors(slug)])).toEqual([
      ['metabolic-health', { previous: null, next: 'healthy-aging' }],
      ['healthy-aging', { previous: 'metabolic-health', next: 'biologische-altersuhr' }],
      ['biologische-altersuhr', { previous: 'healthy-aging', next: 'telomer-analyse' }],
      ['telomer-analyse', { previous: 'biologische-altersuhr', next: 'stress-monitor' }],
      ['stress-monitor', { previous: 'telomer-analyse', next: 'healthy-sport' }],
      ['healthy-sport', { previous: 'stress-monitor', next: null }],
    ])
  })

  it('always yields exactly the other five siblings without a self-link', () => {
    for (const slug of BEFUND_ORDER) {
      const siblings = BEFUND_ORDER.filter((candidate) => candidate !== slug)
      expect(siblings).toHaveLength(5)
      expect(siblings).not.toContain(slug)
      expect(new Set(siblings).size).toBe(5)
    }
  })
})
