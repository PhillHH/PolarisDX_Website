// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { SUPPORTED_LANGUAGES } from '../../i18n'
import {
  getBefundRouteEntries,
  isKnownCanonicalPath,
  resolveCanonicalRoute,
} from '../../routing/routeRegistry'
import { BEFUND_ORDER } from './meta'

describe('Befund route basis', () => {
  it('derives exactly six registry-backed report families', () => {
    const routes = getBefundRouteEntries()
    expect(routes.map((route) => route.sourceId)).toEqual([...BEFUND_ORDER])
    expect(routes.every((route) => route.familyId === 'report-detail')).toBe(true)
    expect(routes.every((route) => route.path.startsWith('/epigenetics/musterbefund/'))).toBe(true)
  })

  it('derives 60 unique locale routes without a separate route list', () => {
    const matrix = getBefundRouteEntries().flatMap((route) =>
      SUPPORTED_LANGUAGES.map((locale) => `/${locale}${route.path}`),
    )
    expect(matrix).toHaveLength(60)
    expect(new Set(matrix)).toHaveLength(60)
  })

  it('does not recognize an unknown report slug as canonical content', () => {
    const unknown = '/epigenetics/musterbefund/not-a-real-report'
    expect(resolveCanonicalRoute(unknown)).toBeUndefined()
    expect(isKnownCanonicalPath(unknown)).toBe(false)
  })
})
