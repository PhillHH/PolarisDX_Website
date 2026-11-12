import { services } from '../../data/services'
import { getCanonicalRouteEntries } from '../../routing'

const registryEntries = getCanonicalRouteEntries()

export function requireHomeTarget(routeId: string): string {
  const route = registryEntries.find((entry) => entry.id === routeId)
  if (!route) throw new Error(`Homepage target is missing from the Route Registry: ${routeId}`)
  return route.path
}

export const HOME_TARGETS = {
  contact: requireHomeTarget('contact'),
  diagnostics: requireHomeTarget('diagnostics'),
  igloo: requireHomeTarget('igloo-pro'),
  epigenetics: requireHomeTarget('epigenetics'),
  events: requireHomeTarget('events'),
  articles: requireHomeTarget('articles'),
} as const

export const CORE_SERVICES = (['dental', 'beauty', 'longevity'] as const).map((sourceId) => {
  const service = services.find(({ id }) => id === sourceId)
  if (!service) throw new Error(`Homepage core service is missing: ${sourceId}`)
  const routeId = `service-detail:${sourceId}`
  return { sourceId, routeId, path: requireHomeTarget(routeId) }
})
