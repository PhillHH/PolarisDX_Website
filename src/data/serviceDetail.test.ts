// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  SERVICE_DETAIL_ROUTE_ID,
  getServiceDetailEntryById,
  getServiceDetailStaticRoute,
  serviceDetailContextRoutes,
  serviceDetailEntries,
  serviceDetailGeneralSalesTarget,
} from './serviceDetail'
import { services } from './services'

describe('PT13.1 service-detail registry projection', () => {
  it('derives nine unique detail targets from the canonical services and AP10 Registry', () => {
    expect(serviceDetailEntries).toHaveLength(9)
    expect(serviceDetailEntries.map(({ service }) => service)).toEqual(services)
    expect(new Set(serviceDetailEntries.map(({ route }) => route.path))).toHaveLength(9)
    for (const { service, route } of serviceDetailEntries) {
      expect(route.familyId).toBe(SERVICE_DETAIL_ROUTE_ID)
      expect(route.sourceId).toBe(service.id)
      expect(route.path).toBe(`/diagnostics/${service.id}`)
      expect(route.path).not.toContain('/services/')
    }
  })

  it('keeps context and conversion targets registry-backed', () => {
    expect(serviceDetailContextRoutes.home.path).toBe('/')
    expect(serviceDetailContextRoutes.diagnostics.path).toBe('/diagnostics')
    expect(serviceDetailContextRoutes.contact.path).toBe('/contact')
    expect(serviceDetailGeneralSalesTarget).toBe('/contact?intent=quote#kontaktformular')
    expect(getServiceDetailEntryById('hormon-tests').route.path).toBe('/diagnostics/hormon-tests')
    expect(getServiceDetailStaticRoute('epigenetics').path).toBe('/epigenetics')
  })
})
