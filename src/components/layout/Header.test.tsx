import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './Header'
import { services } from '../../data/services'

/**
 * Header-Vertrag (AP06 PT06.1, Raster-Kopfzeile seit SC-021).
 *
 * Die Tests pruefen Rollen, Ziele und Zustaende — nicht Tailwind-Klassen.
 * `src/test/setup.ts` mockt `react-i18next` so, dass `t(key)` den Key
 * zurueckgibt; sichtbare Beschriftungen werden deshalb ueber ihren Key
 * geprueft. Genau das deckt die Regel „keine hartkodierten sichtbaren
 * Strings" mit ab: stuende im Markup deutscher Klartext, fiele er hier auf.
 */
const renderHeader = (initialPath = '/') =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Header />
      </MemoryRouter>
    </HelmetProvider>,
  )

const mainNav = () => screen.getByRole('navigation', { name: 'a11y.main_nav' })
const serviceNav = () => screen.getByRole('navigation', { name: 'a11y.secondary_nav' })
const menuToggle = () => within(mainNav()).getByRole('button', { name: 'a11y.toggle_nav' })

/** Oeffnet die Inhaltsuebersicht — ein Knopf fuer alle Breiten (SC-021). */
const openMenu = (initialPath = '/') => {
  renderHeader(initialPath)
  const toggle = menuToggle()
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  fireEvent.click(toggle)
  expect(toggle).toHaveAttribute('aria-expanded', 'true')
  return toggle
}

describe('Header — Grundgeruest', () => {
  it('rendert eine benannte Hauptnavigation und eine benannte Service-Navigation', () => {
    renderHeader()
    expect(mainNav()).toBeInTheDocument()
    expect(serviceNav()).toBeInTheDocument()
  })

  it('das Logo fuehrt auf die Startseite und traegt einen Namen', () => {
    renderHeader('/about')
    const logo = screen.getByRole('link', { name: 'logo.alt' })
    // Das Sprachpraefix setzt der Router ueber `basename` — ein hier fest
    // verdrahtetes /de/ waere die Default-Locale-Falle.
    expect(logo).toHaveAttribute('href', '/')
  })
})

describe('Header — Informationsarchitektur', () => {
  it('traegt die drei Saeulen und die Termine in der Leiste', () => {
    renderHeader()
    const nav = within(mainNav())
    for (const [key, href] of [
      ['nav.service', '/diagnostics'],
      ['nav.epigenetics', '/epigenetics'],
      ['nav.iglooPro', '/igloo-pro'],
      ['nav.events', '/events'],
    ]) {
      expect(nav.getByRole('link', { name: key })).toHaveAttribute('href', href)
    }
  })

  it('Blog, Support und Kontakt stehen in der Service-Zeile', () => {
    renderHeader()
    const nav = within(serviceNav())
    expect(nav.getByRole('link', { name: 'nav.blog' })).toHaveAttribute('href', '/articles')
    expect(nav.getByRole('link', { name: 'nav.support' })).toHaveAttribute('href', '/support')
    expect(nav.getByRole('link', { name: 'nav.contact' })).toHaveAttribute('href', '/contact')
  })

  it('verlinkt keine Redirect-Quelle unter /services', () => {
    const { container } = renderHeader()
    const services = [...container.querySelectorAll('a[href]')].filter((a) =>
      (a.getAttribute('href') || '').startsWith('/services'),
    )
    expect(services).toHaveLength(0)
  })
})

describe('Header — Messe-Zeile (SC-021)', () => {
  it('nennt den naechsten belegten Termin und fuehrt zu Termin und Kontakt', () => {
    const { container } = renderHeader()
    const strip = container.querySelector('[data-event-strip]') as HTMLElement
    expect(within(strip).getByText('a11y.event_strip:')).toBeInTheDocument()
    expect(
      within(strip).getByRole('link', { name: /events:items\.[a-z0-9_]+\.title/ }),
    ).toHaveAttribute('href', '/events')
    expect(within(strip).getByRole('link', { name: 'event_popup.meet' })).toHaveAttribute(
      'href',
      '/contact',
    )
  })
})

describe('Header — Shops (SC-021)', () => {
  it('fuehrt beide Shops mit Namen in der Leiste', () => {
    renderHeader()
    const nav = within(mainNav())
    expect(nav.getAllByRole('link', { name: /nav\.shop_practice/ })[0]).toHaveAttribute(
      'data-shop',
      'practice',
    )
    expect(nav.getAllByRole('link', { name: /nav\.shop_epigenetics/ })[0]).toHaveAttribute(
      'data-shop',
      'panels',
    )
  })
})

describe('Header — General Sales CTA', () => {
  it('traegt den GENERAL_SALES-CTA mit dem CTA-Key, nicht mit der Nav-Beschriftung', () => {
    renderHeader()
    const cta = screen.getAllByRole('link', { name: 'nav.cta_quote' })[0]
    expect(cta).toHaveAttribute('href', '/contact')
    expect(cta).toHaveAttribute('data-cta-role', 'GENERAL_SALES')
  })

  it('der Kontakt-Link ist ein Service-Link, kein CTA', () => {
    renderHeader()
    expect(screen.getByRole('link', { name: 'nav.contact' })).not.toHaveAttribute('data-cta-role')
  })
})

describe('Header — Suche und Sprache', () => {
  it('bietet einen benannten Such-Trigger', () => {
    renderHeader()
    expect(screen.getAllByRole('button', { name: 'a11y.search' }).length).toBeGreaterThan(0)
  })

  it('oeffnet die bestehende Suchflaeche', () => {
    const { baseElement } = renderHeader()
    expect(baseElement.querySelector('#search-input')).toBeNull()

    fireEvent.click(screen.getAllByRole('button', { name: 'a11y.search' })[0])
    // Geprueft wird die INTEGRATION: der Trigger oeffnet die bestehende
    // SearchModal. Deren Dialog-Semantik, Tastatur-UX und Ergebnisgruppen
    // gehoeren AP07 und werden hier bewusst nicht zugesichert.
    expect(baseElement.querySelector('#search-input')).not.toBeNull()
  })

  it('bietet einen benannten Sprachumschalter', () => {
    renderHeader()
    expect(screen.getAllByRole('button', { name: 'a11y.select_language' }).length).toBeGreaterThan(
      0,
    )
  })
})

describe('Header — Aktive Zustaende', () => {
  it('markiert die exakte Seite mit aria-current="page"', () => {
    renderHeader('/epigenetics')
    expect(within(mainNav()).getByRole('link', { name: 'nav.epigenetics' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('behandelt einen Anker als dieselbe Seite', () => {
    renderHeader('/epigenetics#musterbefunde')
    expect(within(mainNav()).getByRole('link', { name: 'nav.epigenetics' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('markiert den Parent, wenn eine Unterseite aktiv ist — aber nicht als "page"', () => {
    renderHeader('/diagnostics/dental')
    const parent = within(mainNav()).getByRole('link', { name: 'nav.service' })
    expect(parent).toHaveAttribute('aria-current', 'true')
  })

  it('markiert nichts, wenn keine Saeule aktiv ist', () => {
    renderHeader('/imprint')
    const current = within(mainNav())
      .getAllByRole('link')
      .filter((a) => a.getAttribute('aria-current'))
    expect(current).toHaveLength(0)
  })

  it('faerbt die Diagnostik NICHT aktiv, wenn nur der Epigenetik-Querverweis passt', () => {
    renderHeader('/epigenetics')
    const parent = within(mainNav()).getByRole('link', { name: 'nav.service' })
    expect(parent).not.toHaveAttribute('aria-current')
  })
})

/**
 * Inhaltsuebersicht (SC-021; Diagnostik-Spalten seit AP06 PT06.2).
 *
 * Die neun kanonischen Services stammen aus `src/data/services.tsx`; der Test
 * liest sie DORT und nicht aus einer im Test wiederholten Liste — sonst
 * bestaetigte er nur seine eigene Kopie und uebersaehe genau den Fall, dass ein
 * Service im Menue fehlt.
 */
describe('Header — Inhaltsuebersicht', () => {
  it('oeffnet und schliesst ueber den Menue-Knopf — kein Hover-Zwang', () => {
    const toggle = openMenu()
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('macht ALLE neun kanonischen Services direkt erreichbar', () => {
    openMenu()
    const hrefs = within(mainNav())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))

    expect(services).toHaveLength(9)
    for (const service of services) {
      expect(hrefs).toContain(`/diagnostics/${service.id}`)
    }
  })

  it('bietet den Hub als eigenen Einstieg an', () => {
    openMenu()
    expect(within(mainNav()).getByRole('link', { name: /nav.diagnostics_all/ })).toHaveAttribute(
      'href',
      '/diagnostics',
    )
  })

  it('gruppiert die Services in drei fachliche Spalten', () => {
    openMenu()
    const nav = within(mainNav())
    expect(nav.getByText('nav.group_fields')).toBeInTheDocument()
    expect(nav.getByText('nav.group_analysis')).toBeInTheDocument()
    expect(nav.getByText('nav.group_system')).toBeInTheDocument()
  })

  it('fuehrt Epigenetik als abgesetzten Querverweis, nicht als Servicegruppe', () => {
    openMenu()
    const nav = within(mainNav())
    // Als Querverweis gekennzeichnet ...
    expect(nav.getByText(/nav.group_crosslink/)).toBeInTheDocument()
    // ... und niemals als Diagnostik-Route modelliert.
    const hrefs = nav.getAllByRole('link').map((a) => a.getAttribute('href') || '')
    expect(hrefs).not.toContain('/diagnostics/epigenetics')
    expect(hrefs.filter((h) => h === '/epigenetics').length).toBeGreaterThan(1)
  })

  it('zeigt das Geraet als Vorschau mit einem Ziel', () => {
    openMenu()
    expect(within(mainNav()).getByRole('link', { name: /nav.iglooPro_more/ })).toHaveAttribute(
      'href',
      '/igloo-pro',
    )
  })

  it('haelt die vier Hauptpunkte, beide Shops und den CTA auch in der Uebersicht bereit', () => {
    openMenu()
    const nav = within(mainNav())
    // Leiste und Uebersicht rendern beide — mindestens zwei Treffer je Ziel.
    expect(nav.getAllByRole('link', { name: 'nav.epigenetics' }).length).toBeGreaterThan(1)
    expect(
      nav
        .getAllByRole('link', { name: 'nav.service' })
        .filter((a) => a.getAttribute('href') === '/diagnostics').length,
    ).toBeGreaterThan(1)
    expect(nav.getAllByRole('link', { name: /nav\.shop_practice/ }).length).toBeGreaterThan(1)
    expect(nav.getAllByRole('link', { name: /nav\.shop_epigenetics/ }).length).toBeGreaterThan(1)
    expect(screen.getAllByRole('link', { name: 'nav.cta_quote' }).length).toBeGreaterThan(1)
    expect(nav.getByRole('link', { name: 'nav.downloads' })).toHaveAttribute('href', '/downloads')
    expect(nav.getByRole('link', { name: 'nav.about' })).toHaveAttribute('href', '/about')
  })

  it('schliesst mit Escape und gibt den Fokus an den Knopf zurueck', () => {
    const toggle = openMenu()
    toggle.focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(toggle)
  })

  it('haelt die geschlossene Uebersicht aus dem DOM heraus', () => {
    renderHeader()
    const nav = within(mainNav())
    expect(nav.queryByRole('link', { name: 'nav.hormonTests' })).not.toBeInTheDocument()
  })

  it('zielt auf keine Redirect-Quelle und keinen toten Slug', () => {
    openMenu()
    const hrefs = within(mainNav())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') || '')
    expect(hrefs.filter((h) => h.startsWith('/services'))).toHaveLength(0)
    expect(hrefs).not.toContain('/diagnostics/sports')
  })
})

describe('Header — Ausgeschlossenes', () => {
  it('enthaelt keinen Chat-Trigger', () => {
    const { container } = renderHeader()
    expect(container.textContent).not.toMatch(/chat/i)
    expect(container.querySelector('[href*="chat"]')).toBeNull()
  })

  it('enthaelt kein Garantie-/Performance-Band', () => {
    const { container } = renderHeader()
    expect(container.textContent).not.toMatch(/garant|guarantee/i)
  })
})
