import { getCanonicalRouteEntries } from '../routing/routeRegistry'
import type { DiagnosticsHubCategory, DiagnosticsSpecialtyTag, ServiceId } from '../types'
import { articles } from './articles'
import { services } from './services'

const serviceRoutes = getCanonicalRouteEntries().filter(
  (route) => route.familyId === 'service-detail',
)

const contactRoute = getCanonicalRouteEntries().find((route) => route.id === 'contact')

if (!contactRoute) {
  throw new Error('Diagnostics Hub sales route missing from Route Registry: contact')
}

/** Registry-backed GENERAL_SALES destination; the existing Contact runtime owns the form. */
export const diagnosticsGeneralSalesTarget = `${contactRoute.path}?intent=quote#kontaktformular`

/**
 * Hub projection of the canonical service source and AP10 Route Registry.
 * It deliberately owns neither service slugs nor route paths.
 */
export const diagnosticsHubServices = services.map((service) => {
  const route = serviceRoutes.find((candidate) => candidate.sourceId === service.id)
  if (!route) {
    throw new Error(`Diagnostics Hub route missing from Route Registry: ${service.id}`)
  }

  return { service, route }
})

export type DiagnosticsHubService = (typeof diagnosticsHubServices)[number]

type DiagnosticsFocusAreaId =
  | 'dental'
  | 'beauty'
  | 'longevity'
  | 'prevention'
  | 'system-solutions'
  | 'integration'

type DiagnosticsFocusAreaDefinition = {
  id: DiagnosticsFocusAreaId
  serviceId: ServiceId
  requiredTag: DiagnosticsSpecialtyTag
}

const focusAreaDefinitions: readonly DiagnosticsFocusAreaDefinition[] = [
  { id: 'dental', serviceId: 'dental', requiredTag: 'DENTAL' },
  { id: 'beauty', serviceId: 'beauty', requiredTag: 'BEAUTY' },
  { id: 'longevity', serviceId: 'longevity', requiredTag: 'LONGEVITY' },
  { id: 'prevention', serviceId: 'praeventions-checks', requiredTag: 'PREVENTION' },
  {
    id: 'system-solutions',
    serviceId: 'poc-systemloesungen',
    requiredTag: 'SYSTEM_SOLUTION',
  },
  {
    id: 'integration',
    serviceId: 'kompatibilitaet-integration',
    requiredTag: 'INTEGRATION',
  },
]

export const diagnosticsFocusAreas = focusAreaDefinitions.map((definition) => {
  const entry = diagnosticsHubServices.find(({ service }) => service.id === definition.serviceId)
  if (!entry || !entry.service.specialtyTags.includes(definition.requiredTag)) {
    throw new Error(`Diagnostics focus mapping invalid: ${definition.id}`)
  }

  return { ...definition, entry }
})

function requireContextRoute(id: 'igloo-pro' | 'epigenetics' | 'articles') {
  const route = getCanonicalRouteEntries().find((candidate) => candidate.id === id)
  if (!route) throw new Error(`Diagnostics context route missing from Route Registry: ${id}`)
  return route
}

export const diagnosticsContextTargets = {
  igloo: requireContextRoute('igloo-pro'),
  epigenetics: requireContextRoute('epigenetics'),
  articles: requireContextRoute('articles'),
}

const diagnosticsRelatedArticleIds = [
  'green_practice',
  'invisible_patient',
  'ecosystem_of_rapid_tests',
] as const

export const diagnosticsRelatedArticles = diagnosticsRelatedArticleIds.map((id) => {
  const article = articles.find((candidate) => candidate.id === id)
  const route = getCanonicalRouteEntries().find(
    (candidate) => candidate.id === `article-detail:${id}`,
  )
  if (!article || !article.relatedServiceIds?.length || !route) {
    throw new Error(`Diagnostics related article is not published and Registry-backed: ${id}`)
  }

  return { article, route }
})

export function getDiagnosticsHubServices(category: DiagnosticsHubCategory) {
  return diagnosticsHubServices.filter(({ service }) => service.hubCategory === category)
}
