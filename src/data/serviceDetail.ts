import { getCanonicalRouteEntries, type CanonicalRouteEntry } from '../routing/routeRegistry'
import type { Service, ServiceId } from '../types'
import { services } from './services'

export const SERVICE_DETAIL_ROUTE_ID = 'service-detail' as const

const registryEntries = getCanonicalRouteEntries()
const serviceRoutes = registryEntries.filter((route) => route.familyId === SERVICE_DETAIL_ROUTE_ID)

/**
 * AP13 projection of the canonical service source onto the AP10 Route Registry.
 * It deliberately owns neither the nine slugs nor their route paths.
 */
export const serviceDetailEntries = services.map((service) => {
  const route = serviceRoutes.find((candidate) => candidate.sourceId === service.id)
  if (!route) throw new Error(`Service detail route missing from Route Registry: ${service.id}`)
  return { service, route }
})

export type ServiceDetailEntry = (typeof serviceDetailEntries)[number]

function requireStaticRoute(id: 'home' | 'diagnostics' | 'contact'): CanonicalRouteEntry {
  const route = registryEntries.find((candidate) => candidate.id === id)
  if (!route) throw new Error(`Service detail context route missing from Route Registry: ${id}`)
  return route
}

export const serviceDetailContextRoutes = {
  home: requireStaticRoute('home'),
  diagnostics: requireStaticRoute('diagnostics'),
  contact: requireStaticRoute('contact'),
}

export function getServiceDetailStaticRoute(id: 'implantology' | 'igloo-pro' | 'epigenetics') {
  const route = registryEntries.find((candidate) => candidate.id === id)
  if (!route) throw new Error(`Service detail crosslink missing from Route Registry: ${id}`)
  return route
}

export function getServiceDetailArticleRoute(articleId: string) {
  const route = registryEntries.find(
    (candidate) => candidate.familyId === 'article-detail' && candidate.sourceId === articleId,
  )
  if (!route) throw new Error(`Service detail article missing from Route Registry: ${articleId}`)
  return route
}

export const serviceDetailGeneralSalesTarget = `${serviceDetailContextRoutes.contact.path}?intent=quote#kontaktformular`

export function getServiceDetailEntry(slug?: string): ServiceDetailEntry | undefined {
  return serviceDetailEntries.find(({ service }) => service.id === slug)
}

export function getServiceDetailEntryById(id: ServiceId): ServiceDetailEntry {
  const entry = getServiceDetailEntry(id)
  if (!entry) throw new Error(`Unknown canonical service detail: ${id}`)
  return entry
}

export function isCanonicalService(service: Service): boolean {
  return serviceDetailEntries.some(({ service: candidate }) => candidate === service)
}
