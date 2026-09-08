import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import IglooCompatibilitySection from './IglooCompatibilitySection'
import IglooFeaturesSection from './IglooFeaturesSection'
import IglooProductFinalCta from './IglooProductFinalCta'
import IglooWorkflowSection from './IglooWorkflowSection'

const locales = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'] as const

type ProductResource = {
  product_story: {
    eyebrow: string
    title: string
    description: string
    items: Record<string, { title: string; text: string }>
  }
  workflow: {
    eyebrow: string
    title: string
    description: string
    steps: Record<string, { title: string; text: string }>
    boundary: string
  }
  compatibility: {
    eyebrow: string
    title: string
    description: string
    boundary: string
    items: Record<string, { title: string; text: string }>
    links_label: string
    links_title: string
    links: Record<string, string>
  }
  cta_bottom: { title: string; description: string; button: string; resources: string }
}

const localeModules = import.meta.glob('/public/locales/*/products.json', {
  eager: true,
  import: 'default',
}) as Record<string, ProductResource>

const renderJourney = () =>
  render(
    <MemoryRouter>
      <IglooFeaturesSection />
      <IglooWorkflowSection />
      <IglooCompatibilitySection />
      <IglooProductFinalCta />
    </MemoryRouter>,
  )

describe('PT14.3 IglooPro features, workflow and compatibility contract', () => {
  it('renders the evidence-bounded product journey without unsupported product details', () => {
    const { container } = renderJourney()

    expect(container.querySelectorAll('[data-product-characteristic]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-workflow-step]')).toHaveLength(3)
    expect(container.querySelectorAll('[data-compatibility-check]')).toHaveLength(4)

    const copy = container.textContent ?? ''
    expect(copy).not.toMatch(/CV\s*<|<\s*5\s*%|600\s*g|3.?15\s*(min|Min)|10[.,]000/i)
    expect(copy).not.toMatch(
      /IVDR|(?:^|[\s(/])CE(?:$|[\s),.])|LIS\/?HIS|Wi-?Fi|Bluetooth|\bUSB\b|\bLAN\b|\bAPI\b/i,
    )
    expect(copy).not.toMatch(/24\s*h|3.?5\s*(days|Tage)|lab[- ]grade|laborgenau/i)
  })

  it('derives every related link from an existing canonical route', () => {
    renderJourney()

    const expected = {
      'service-detail:poc-systemloesungen': '/diagnostics/poc-systemloesungen',
      'service-detail:kompatibilitaet-integration': '/diagnostics/kompatibilitaet-integration',
      downloads: '/downloads',
      support: '/support',
      contact: '/contact',
    }

    for (const [routeId, path] of Object.entries(expected)) {
      const link = document.querySelector(`[data-related-route-id="${routeId}"]`)
      expect(link, routeId).toHaveAttribute('href', path)
    }
  })

  it('keeps the real GENERAL_SALES journey and the live ROI calculator target', () => {
    renderJourney()

    const primary = screen.getByRole('link', { name: 'cta_bottom.button' })
    expect(primary).toHaveAttribute('href', '/contact')
    expect(primary).toHaveAttribute('data-cta-intent', 'GENERAL_SALES')

    const secondary = screen.getByRole('link', { name: 'cta_bottom.resources' })
    expect(secondary).toHaveAttribute('href', '/#roi-rechner')
    expect(secondary).not.toHaveAttribute('target')
  })

  it('provides complete and claim-safe journey content for exactly ten locales', () => {
    expect(Object.keys(localeModules)).toHaveLength(10)

    for (const locale of locales) {
      const resource = localeModules[`/public/locales/${locale}/products.json`]
      expect(resource, `missing ${locale} products resource`).toBeDefined()
      expect(Object.keys(resource.product_story.items)).toEqual(['reader', 'context', 'scope'])
      expect(Object.keys(resource.workflow.steps)).toEqual(['context', 'scope', 'decision'])
      expect(Object.keys(resource.compatibility.items)).toEqual([
        'portfolio',
        'setting',
        'data',
        'service',
      ])
      expect(Object.keys(resource.compatibility.links)).toEqual([
        'poc',
        'compatibility',
        'downloads',
        'support',
        'contact',
      ])

      const visibleValues = [
        resource.product_story.eyebrow,
        resource.product_story.title,
        resource.product_story.description,
        ...Object.values(resource.product_story.items).flatMap(({ title, text }) => [title, text]),
        resource.workflow.eyebrow,
        resource.workflow.title,
        resource.workflow.description,
        ...Object.values(resource.workflow.steps).flatMap(({ title, text }) => [title, text]),
        resource.workflow.boundary,
        resource.compatibility.eyebrow,
        resource.compatibility.title,
        resource.compatibility.description,
        resource.compatibility.boundary,
        ...Object.values(resource.compatibility.items).flatMap(({ title, text }) => [title, text]),
        resource.compatibility.links_label,
        resource.compatibility.links_title,
        ...Object.values(resource.compatibility.links),
        resource.cta_bottom.title,
        resource.cta_bottom.description,
        resource.cta_bottom.button,
        resource.cta_bottom.resources,
      ]

      for (const value of visibleValues) {
        expect(value.trim().length, `${locale} visible journey value`).toBeGreaterThan(0)
        expect(value, `${locale} untranslated key`).not.toMatch(
          /^(product_story|workflow|compatibility|cta_bottom)\./,
        )
      }

      const visibleCopy = visibleValues.join(' ')
      expect(visibleCopy, `${locale} unsupported specification`).not.toMatch(
        /CV\s*<|<\s*5\s*%|600\s*g|3.?15\s*(min|Min)|10[.,]000|LIS\/?HIS|Wi-?Fi|Bluetooth|\bUSB\b|\bLAN\b|\bAPI\b/i,
      )
      expect(visibleCopy, `${locale} unsupported proof or service promise`).not.toMatch(
        /\bIVDR\b|(?:^|[\s(/])CE(?:$|[\s),.])|24\s*h|3.?5\s*(days|Tage)|lab[- ]grade|laborgenau|guaranteed|garantiert/i,
      )
    }

    expect(localeModules['/public/locales/de/products.json'].cta_bottom.button).toBe(
      'Angebot anfragen',
    )
  })

  it('uses semantic lists and a labelled related-links navigation', () => {
    const { container } = renderJourney()

    expect(container.querySelector('[data-igloo-features] > div > ul')).toBeInTheDocument()
    expect(container.querySelector('[data-igloo-workflow] ol')).toBeInTheDocument()
    expect(container.querySelector('[data-igloo-compatibility] ul')).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'compatibility.links_label' }),
    ).toBeInTheDocument()
  })
})
