import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  SERVICE_DETAIL_ROUTE_ID,
  getServiceDetailEntryById,
  serviceDetailEntries,
  serviceDetailGeneralSalesTarget,
} from '../../data/serviceDetail'
import ServiceDetailHero from './ServiceDetailHero'
import ServiceDetailSalesCta from './ServiceDetailSalesCta'
import ServiceDetailSections from './ServiceDetailSections'
import { createServiceDetailStructuredData } from './structuredData'
import type { ServiceDetailViewModel } from './model'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const
const serviceKeys = [
  'dental',
  'beauty',
  'longevity',
  'poc_systemloesungen',
  'praeventions_checks',
  'infektion_entzuendung',
  'stoffwechsel_herz',
  'hormon_tests',
  'kompatibilitaet_integration',
] as const

const localeModules = import.meta.glob('/public/locales/*/services.json', {
  eager: true,
  import: 'default',
}) as Record<string, Record<string, unknown>>

const createModel = (withOptional = true): ServiceDetailViewModel => ({
  entry: getServiceDetailEntryById('beauty'),
  labels: {
    home: 'Start',
    diagnostics: 'Diagnostik',
    primaryCta: 'Angebot anfragen',
    helpTitle: 'Passende Lösung finden',
    helpText: 'Sprechen Sie mit unserem Team.',
    introEyebrow: 'Überblick',
    parametersLabel: 'Parameter',
    detailEyebrow: 'Im Detail',
    conclusionEyebrow: 'Fazit',
  },
  stats: [],
  sidebarWidgets: [],
  content: {
    hero: { title: 'Beauty Diagnostik', subtitle: 'Ein evidenzbewusster Einstieg.' },
    problem: {
      id: 'problem',
      heading: 'Einordnung',
      paragraphs: ['Sichtbare, freigegebene Einordnung.'],
    },
    audiences: withOptional
      ? { id: 'audiences', heading: 'Einsatzgebiete', items: ['Praxis'] }
      : undefined,
    questions: withOptional
      ? { id: 'questions', heading: 'Fragestellungen', items: ['Reale Frage'] }
      : undefined,
    parameters: withOptional
      ? { id: 'parameters', heading: 'Parameter', items: ['Realer Marker'] }
      : undefined,
    workflow: withOptional
      ? { heading: 'Ablauf', steps: [{ title: 'Anwendung' }, { title: 'Einordnung' }] }
      : undefined,
    proof: withOptional
      ? { heading: 'Evidenz', items: [{ label: 'Freigegebener Nachweis' }] }
      : undefined,
    faq: withOptional
      ? {
          title: 'Häufige Fragen',
          items: [{ question: 'Sichtbare Frage?', answer: 'Sichtbare Antwort.' }],
        }
      : undefined,
    related: withOptional
      ? [{ id: 'diagnostics', label: 'Zum Hub', to: '/diagnostics' }]
      : undefined,
    disclaimer: withOptional
      ? { id: 'disclaimer', heading: 'Hinweis', content: 'Realer Hinweis.' }
      : undefined,
    seo: { title: 'Beauty Diagnostik', description: 'Sichtbare Beschreibung.' },
  },
})

describe('PT13.1 common service-detail template', () => {
  it('projects exactly nine canonical services onto the AP10 route family', () => {
    expect(serviceDetailEntries).toHaveLength(9)
    expect(new Set(serviceDetailEntries.map(({ service }) => service.id))).toHaveLength(9)
    expect(new Set(serviceDetailEntries.map(({ route }) => route.path))).toHaveLength(9)
    for (const { service, route } of serviceDetailEntries) {
      expect(route.familyId).toBe(SERVICE_DETAIL_ROUTE_ID)
      expect(route.sourceId).toBe(service.id)
      expect(route.path).toBe(`/diagnostics/${service.id}`)
      expect(route.path).not.toMatch(/^\/services(?:\/|$)/)
    }
    expect(serviceDetailGeneralSalesTarget).toBe('/contact?intent=quote#kontaktformular')
  })

  it('renders required and optional section combinations with semantic heading and workflow order', () => {
    render(
      <MemoryRouter>
        <ServiceDetailSections model={createModel()} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Einordnung', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Einsatzgebiete', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Fragestellungen', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parameter', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ablauf', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Evidenz', level: 2 })).toBeInTheDocument()
    expect(screen.getAllByRole('list').some((list) => list.tagName === 'OL')).toBe(true)
    expect(screen.getByRole('navigation', { name: 'Im Detail' })).toBeInTheDocument()
  })

  it('omits optional sections honestly instead of rendering dummy content', () => {
    render(
      <MemoryRouter>
        <ServiceDetailSections model={createModel(false)} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Einordnung' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Parameter' })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Evidenz' })).not.toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.queryByText(/placeholder|coming soon|dummy/i)).not.toBeInTheDocument()
  })

  it('emits FAQ schema only when the same visible FAQ model exists', () => {
    const withFaq = createServiceDetailStructuredData(createModel(), 'fr')
    const withoutFaq = createServiceDetailStructuredData(createModel(false), 'fr')
    expect(withFaq.map((schema) => schema['@type'])).toEqual([
      'Service',
      'BreadcrumbList',
      'FAQPage',
    ])
    expect(withoutFaq.map((schema) => schema['@type'])).toEqual(['Service', 'BreadcrumbList'])
    expect(JSON.stringify(withFaq)).not.toMatch(/Product|Offer|Rating|Review/)
  })

  it('renders one hero H1 and deterministic GENERAL_SALES links with keyboard focus', () => {
    const model = createModel()
    render(
      <MemoryRouter>
        <ServiceDetailHero model={model} />
        <ServiceDetailSalesCta model={model} />
      </MemoryRouter>,
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const actions = screen.getAllByRole('link', { name: 'Angebot anfragen' })
    expect(actions).toHaveLength(2)
    for (const action of actions) {
      expect(action).toHaveAttribute('href', serviceDetailGeneralSalesTarget)
      expect(action).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')
      expect(action).toHaveAttribute('data-cta-source', 'service_detail')
      expect(action).toHaveAttribute('data-service-family', 'beauty')
      action.focus()
      expect(action).toHaveFocus()
    }
  })

  it('keeps the existing services namespace complete for ten locales and nine families', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      expect(module).toBeDefined()
      for (const key of serviceKeys) {
        const service = module[key] as Record<string, unknown>
        expect(service).toBeDefined()
        expect(String(service.title || '')).not.toHaveLength(0)
        const seo = service.seo as Record<string, unknown>
        expect(String(seo.title || '')).not.toHaveLength(0)
        expect(String(seo.description || '')).not.toHaveLength(0)
      }
    }
    const de = localeModules['/public/locales/de/services.json'] as Record<string, unknown>
    const overview = de.overview as { hero: { entry: { primary_cta: string } } }
    expect(overview.hero.entry.primary_cta).toBe('Angebot anfragen')
  })

  it('provides the normalized Dental model in all ten locales without fallback placeholders', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const dental = module.dental as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          crosslinks: { implantology: unknown; igloo: unknown }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(dental.detail.hero.title).not.toHaveLength(0)
      expect(dental.detail.hero.subtitle).not.toHaveLength(0)
      expect(dental.detail.problem.paragraphs).not.toHaveLength(0)
      expect(dental.detail.audiences.items).toHaveLength(3)
      expect(dental.detail.questions.items).toHaveLength(3)
      expect(dental.detail.parameters.items).toHaveLength(4)
      expect(dental.detail.workflow.steps).toHaveLength(3)
      expect(dental.detail.faq.items).toHaveLength(3)
      expect(dental.detail.crosslinks).toHaveProperty('implantology')
      expect(dental.detail.crosslinks).toHaveProperty('igloo')
      expect(dental.detail.cta.title).not.toHaveLength(0)
      expect(dental.detail.cta.text).not.toHaveLength(0)
      expect(dental.detail.disclaimer.content).not.toHaveLength(0)
      expect(dental.detail.seo.title).not.toHaveLength(0)
      expect(dental.detail.seo.description).not.toHaveLength(0)
      expect(dental.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(dental.detail)).not.toMatch(/services:[a-z0-9_.-]+|coming soon/i)
    }
  })

  it('provides the claim-safe normalized Beauty model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const beauty = module.beauty as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          crosslinks: { igloo: unknown }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(beauty.detail.hero.title).not.toHaveLength(0)
      expect(beauty.detail.hero.subtitle).not.toHaveLength(0)
      expect(beauty.detail.problem.paragraphs).not.toHaveLength(0)
      expect(beauty.detail.audiences.items).toHaveLength(3)
      expect(beauty.detail.questions.items).toHaveLength(3)
      expect(beauty.detail.parameters.items).toHaveLength(4)
      expect(beauty.detail.workflow.steps).toHaveLength(3)
      expect(beauty.detail.faq.items).toHaveLength(3)
      expect(beauty.detail.crosslinks).toHaveProperty('igloo')
      expect(beauty.detail.cta.title).not.toHaveLength(0)
      expect(beauty.detail.cta.text).not.toHaveLength(0)
      expect(beauty.detail.disclaimer.content).not.toHaveLength(0)
      expect(beauty.detail.seo.title).not.toHaveLength(0)
      expect(beauty.detail.seo.description).not.toHaveLength(0)
      expect(beauty.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(beauty.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|anti-aging guarantee/i,
      )
    }
  })

  it('provides the longitudinal, claim-safe Longevity model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const longevity = module.longevity as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          crosslinks: { epigenetics: unknown }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(longevity.detail.hero.title).not.toHaveLength(0)
      expect(longevity.detail.hero.subtitle).not.toHaveLength(0)
      expect(longevity.detail.problem.paragraphs).not.toHaveLength(0)
      expect(longevity.detail.audiences.items).toHaveLength(3)
      expect(longevity.detail.questions.items).toHaveLength(3)
      expect(longevity.detail.parameters.items).toHaveLength(5)
      expect(longevity.detail.workflow.steps).toHaveLength(3)
      expect(longevity.detail.faq.items).toHaveLength(3)
      expect(longevity.detail.crosslinks).toHaveProperty('epigenetics')
      expect(longevity.detail.cta.title).not.toHaveLength(0)
      expect(longevity.detail.cta.text).not.toHaveLength(0)
      expect(longevity.detail.disclaimer.content).not.toHaveLength(0)
      expect(longevity.detail.seo.title).not.toHaveLength(0)
      expect(longevity.detail.seo.description).not.toHaveLength(0)
      expect(longevity.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(longevity.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|life extension guarantee/i,
      )
    }
  })

  it('provides the workflow-safe normalized POC system model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const poc = module.poc_systemloesungen as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          crosslinks: { igloo: unknown }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(poc.detail.hero.title).not.toHaveLength(0)
      expect(poc.detail.hero.subtitle).not.toHaveLength(0)
      expect(poc.detail.problem.paragraphs).not.toHaveLength(0)
      expect(poc.detail.audiences.items).toHaveLength(3)
      expect(poc.detail.questions.items).toHaveLength(3)
      expect(poc.detail.parameters.items).toHaveLength(4)
      expect(poc.detail.workflow.steps).toHaveLength(3)
      expect(poc.detail.faq.items).toHaveLength(3)
      expect(poc.detail.crosslinks).toHaveProperty('igloo')
      expect(poc.detail.cta.title).not.toHaveLength(0)
      expect(poc.detail.cta.text).not.toHaveLength(0)
      expect(poc.detail.disclaimer.content).not.toHaveLength(0)
      expect(poc.detail.seo.title).not.toHaveLength(0)
      expect(poc.detail.seo.description).not.toHaveLength(0)
      expect(poc.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(poc.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|seamless integration|automatic integration promise/i,
      )
    }
  })

  it('provides the claim-safe normalized preventive-check model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const prevention = module.praeventions_checks as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(prevention.detail.hero.title).not.toHaveLength(0)
      expect(prevention.detail.hero.subtitle).not.toHaveLength(0)
      expect(prevention.detail.problem.paragraphs).not.toHaveLength(0)
      expect(prevention.detail.audiences.items).toHaveLength(3)
      expect(prevention.detail.questions.items).toHaveLength(3)
      expect(prevention.detail.parameters.items).toHaveLength(6)
      expect(prevention.detail.workflow.steps).toHaveLength(3)
      expect(prevention.detail.faq.items).toHaveLength(3)
      expect(prevention.detail.cta.title).not.toHaveLength(0)
      expect(prevention.detail.cta.text).not.toHaveLength(0)
      expect(prevention.detail.disclaimer.content).not.toHaveLength(0)
      expect(prevention.detail.seo.title).not.toHaveLength(0)
      expect(prevention.detail.seo.description).not.toHaveLength(0)
      expect(prevention.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(prevention.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|61%|80%|turnkey|schlüsselfertig/i,
      )
    }
  })

  it('provides the claim-safe infection and inflammation model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const infection = module.infektion_entzuendung as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(infection.detail.hero.title).not.toHaveLength(0)
      expect(infection.detail.hero.subtitle).not.toHaveLength(0)
      expect(infection.detail.problem.paragraphs).not.toHaveLength(0)
      expect(infection.detail.audiences.items).toHaveLength(3)
      expect(infection.detail.questions.items).toHaveLength(3)
      expect(infection.detail.parameters.items).toHaveLength(4)
      expect(infection.detail.workflow.steps).toHaveLength(3)
      expect(infection.detail.faq.items).toHaveLength(3)
      expect(infection.detail.cta.title).not.toHaveLength(0)
      expect(infection.detail.cta.text).not.toHaveLength(0)
      expect(infection.detail.disclaimer.content).not.toHaveLength(0)
      expect(infection.detail.seo.title).not.toHaveLength(0)
      expect(infection.detail.seo.description).not.toHaveLength(0)
      expect(infection.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(infection.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|40\s?mg|under 5 minutes|unter 5 minuten|lab(?:oratory|or) level/i,
      )
    }
  })

  it('provides the risk-safe metabolic and cardiac model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const metabolism = module.stoffwechsel_herz as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(metabolism.detail.hero.title).not.toHaveLength(0)
      expect(metabolism.detail.hero.subtitle).not.toHaveLength(0)
      expect(metabolism.detail.problem.paragraphs).not.toHaveLength(0)
      expect(metabolism.detail.audiences.items).toHaveLength(3)
      expect(metabolism.detail.questions.items).toHaveLength(3)
      expect(metabolism.detail.parameters.items).toHaveLength(3)
      expect(metabolism.detail.workflow.steps).toHaveLength(3)
      expect(metabolism.detail.faq.items).toHaveLength(3)
      expect(metabolism.detail.cta.title).not.toHaveLength(0)
      expect(metabolism.detail.cta.text).not.toHaveLength(0)
      expect(metabolism.detail.disclaimer.content).not.toHaveLength(0)
      expect(metabolism.detail.seo.title).not.toHaveLength(0)
      expect(metabolism.detail.seo.description).not.toHaveLength(0)
      expect(metabolism.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(metabolism.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|5[.,]7\s?%|6[.,]5\s?%|troponin|nt-probnp|labor(?:atory|vergleich)|additional revenue|zusatzumsatz/i,
      )
    }
  })

  it('provides the claim-safe hormone test model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const hormones = module.hormon_tests as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(hormones.detail.hero.title).not.toHaveLength(0)
      expect(hormones.detail.hero.subtitle).not.toHaveLength(0)
      expect(hormones.detail.problem.paragraphs).not.toHaveLength(0)
      expect(hormones.detail.audiences.items).toHaveLength(3)
      expect(hormones.detail.questions.items).toHaveLength(3)
      expect(hormones.detail.parameters.items).toEqual(['TSH', 'AMH'])
      expect(hormones.detail.workflow.steps).toHaveLength(3)
      expect(hormones.detail.faq.items).toHaveLength(3)
      expect(hormones.detail.cta.title).not.toHaveLength(0)
      expect(hormones.detail.cta.text).not.toHaveLength(0)
      expect(hormones.detail.disclaimer.content).not.toHaveLength(0)
      expect(hormones.detail.seo.title).not.toHaveLength(0)
      expect(hormones.detail.seo.description).not.toHaveLength(0)
      expect(hormones.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(hormones.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|cortisol|testosteron|progesteron|\bFSH\b|fT3|fT4|l-thyro|IVDR|laboratory quality|laboratory-comparable|laborvergleich|laborgenauigkeit|few minutes|wenigen minuten/i,
      )
    }
  })

  it('provides the claim-safe compatibility and integration model in all ten locales', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const compatibility = module.kompatibilitaet_integration as {
        detail: {
          hero: { title: string; subtitle: string }
          problem: { paragraphs: string[] }
          audiences: { items: string[] }
          questions: { items: string[] }
          parameters: { items: string[] }
          workflow: { steps: Array<{ title: string; text: string }> }
          faq: { items: Array<{ question: string; answer: string }> }
          cta: { title: string; text: string }
          disclaimer: { content: string }
          seo: { title: string; description: string; imageAlt: string }
        }
      }
      expect(compatibility.detail.hero.title).not.toHaveLength(0)
      expect(compatibility.detail.hero.subtitle).not.toHaveLength(0)
      expect(compatibility.detail.problem.paragraphs).not.toHaveLength(0)
      expect(compatibility.detail.audiences.items).toHaveLength(3)
      expect(compatibility.detail.questions.items).toHaveLength(3)
      expect(compatibility.detail.parameters.items).toHaveLength(4)
      expect(compatibility.detail.workflow.steps).toHaveLength(3)
      expect(compatibility.detail.faq.items).toHaveLength(3)
      expect(compatibility.detail.cta.title).not.toHaveLength(0)
      expect(compatibility.detail.cta.text).not.toHaveLength(0)
      expect(compatibility.detail.disclaimer.content).not.toHaveLength(0)
      expect(compatibility.detail.seo.title).not.toHaveLength(0)
      expect(compatibility.detail.seo.description).not.toHaveLength(0)
      expect(compatibility.detail.seo.imageAlt).not.toHaveLength(0)
      expect(JSON.stringify(compatibility.detail)).not.toMatch(
        /services:[a-z0-9_.-]+|coming soon|90\s?%|USB-C|Wi-Fi|Bluetooth|10[., ]?000|DX365|LIS\/HIS|3.?5 (?:working days|werktage)|universal adapters|universelle adapter/i,
      )
    }
  })

  it('keeps all nine structured service models differentiated in every locale', () => {
    for (const locale of locales) {
      const module = localeModules[`/public/locales/${locale}/services.json`]
      const details = serviceKeys.map((key) => {
        const service = module[key] as {
          detail: {
            hero: { title: string; subtitle: string }
            audiences: { items: string[] }
            questions: { items: string[] }
            workflow: { heading: string; steps: Array<{ title: string; text: string }> }
            seo: { title: string; description: string; imageAlt: string }
          }
        }
        return service.detail
      })

      expect(details).toHaveLength(9)
      expect(new Set(details.map(({ hero }) => hero.title))).toHaveLength(9)
      expect(new Set(details.map(({ hero }) => hero.subtitle))).toHaveLength(9)
      expect(new Set(details.map(({ audiences }) => JSON.stringify(audiences.items)))).toHaveLength(
        9,
      )
      expect(new Set(details.map(({ questions }) => JSON.stringify(questions.items)))).toHaveLength(
        9,
      )
      expect(new Set(details.map(({ workflow }) => JSON.stringify(workflow.steps)))).toHaveLength(9)
      expect(new Set(details.map(({ seo }) => seo.title))).toHaveLength(9)
      expect(new Set(details.map(({ seo }) => seo.description))).toHaveLength(9)
      for (const detail of details) {
        expect(detail.audiences.items.length).toBeGreaterThan(0)
        expect(detail.workflow.steps.length).toBeGreaterThan(0)
        expect(detail.seo.imageAlt).not.toHaveLength(0)
      }
    }
  })
})
