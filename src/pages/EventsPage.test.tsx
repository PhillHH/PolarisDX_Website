import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { describe, expect, it, vi } from 'vitest'
import { EventsPage } from './EventsPage'

// Die SEO-Schicht verlangt sichtbare Texte; der Test-i18n liefert Schluessel. Hier geht es um
// Highlight, Details und Lageplan — nicht um Structured Data (eigene Tests in components/seo).
vi.mock('../components/seo', () => ({
  SEOHead: () => null,
  createBreadcrumbSchema: () => ({}),
}))

// Echte deutsche Termin-Texte statt Schluessel: Details und Lageplan haengen an `returnObjects`.
vi.mock('react-i18next', async () => {
  const de = (await import('../../public/locales/de/events.json')).default as Record<
    string,
    unknown
  >
  const t = (key: string, opts?: { returnObjects?: boolean; defaultValue?: unknown } | string) => {
    const o = typeof opts === 'string' ? { defaultValue: opts } : opts
    if (!key.startsWith('events:'))
      return typeof o?.defaultValue === 'string' ? o.defaultValue : key
    let node: unknown = de
    for (const part of key.slice(7).split('.')) {
      node = node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined
    }
    if (node === undefined) return o?.defaultValue ?? key
    return typeof node === 'string' || o?.returnObjects ? node : key
  }
  return {
    useTranslation: () => ({
      t,
      i18n: { language: 'de', changeLanguage: () => Promise.resolve() },
    }),
    Trans: ({ children }: { children: React.ReactNode }) => children,
    initReactI18next: { type: '3rdParty', init: () => {} },
  }
})

/**
 * SC-019 — die Terminseite mit injizierter Uhr (die E2E-Specs PT18.2 brauchen den
 * AP18-Fixed-Clock-Server; hier derselbe Vertrag ohne Browser).
 */
const mount = (now: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <EventsPage now={new Date(now)} />
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('EventsPage highlight (SC-019)', () => {
  it('zeigt vor der MEDICA das MEDICA-Highlight mit Details und Lageplan', () => {
    mount('2026-10-28T12:00:00+01:00')
    const highlight = document.querySelector('[data-event-highlight]') as HTMLElement
    expect(highlight).toHaveAttribute('data-event-id', 'medica_2026')
    expect(highlight).toHaveAttribute('data-event-status', 'upcoming')
    expect(within(highlight).getAllByRole('definition')).toHaveLength(3)
    const plan = within(highlight).getByRole('img')
    expect(plan).toHaveAttribute('src', '/events/medica-2026-standplan.svg')
    expect(plan).toHaveAttribute('loading', 'lazy')
    expect(highlight.querySelector('a[data-event-external]')).toBeNull()

    const list = screen.getAllByRole('listitem').filter((li) => li.hasAttribute('data-event-id'))
    expect(list.map((li) => li.getAttribute('data-event-id'))).toEqual([
      'medica_2026',
      'dgi_jahreskongress',
    ])
  })

  it('rueckt nach der MEDICA den DGI-Kongress als Highlight nach — ohne Details und Lageplan', () => {
    mount('2026-11-21T12:00:00+01:00')
    const highlight = document.querySelector('[data-event-highlight]') as HTMLElement
    expect(highlight).toHaveAttribute('data-event-id', 'dgi_jahreskongress')
    expect(within(highlight).queryAllByRole('definition')).toHaveLength(0)
    expect(within(highlight).queryByRole('img')).toBeNull()
  })

  it('archiviert die MEDICA nach Ablauf und laesst das Highlight leer, wenn nichts ansteht', () => {
    mount('2026-12-01T12:00:00+01:00')
    expect(document.querySelector('[data-event-highlight]')).toBeNull()
    expect(document.querySelector('[data-past-event-id="medica_2026"]')).not.toBeNull()
  })
})
