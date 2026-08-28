import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Header from './Header'

/**
 * Header-Vertrag (AP06 PT06.1).
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

describe('Header — Grundgeruest', () => {
  it('rendert eine benannte Hauptnavigation', () => {
    renderHeader()
    expect(mainNav()).toBeInTheDocument()
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
  it('traegt die strategischen Saeulen aus der IA', () => {
    renderHeader()
    const nav = within(mainNav())
    for (const key of [
      'nav.service',
      'nav.epigenetics',
      'nav.iglooPro',
      'nav.blog',
      'nav.events',
      'nav.about',
      'nav.support',
    ]) {
      expect(nav.getByRole('link', { name: key })).toBeInTheDocument()
    }
  })

  it('Epigenetik ist ein eigener Hauptnavigationspunkt, kein Kind der Diagnostik', () => {
    renderHeader()
    const epi = within(mainNav()).getByRole('link', { name: 'nav.epigenetics' })
    expect(epi).toHaveAttribute('href', '/epigenetics')
  })

  it('Diagnostik bleibt ein eigener Parent mit eigener Bereichsseite', () => {
    renderHeader()
    expect(within(mainNav()).getByRole('link', { name: 'nav.service' })).toHaveAttribute(
      'href',
      '/diagnostics',
    )
  })

  it('IglooPro ist sichtbar und nicht in der Diagnostik versteckt', () => {
    renderHeader()
    expect(within(mainNav()).getByRole('link', { name: 'nav.iglooPro' })).toHaveAttribute(
      'href',
      '/igloo-pro',
    )
  })

  it('verlinkt keine Redirect-Quelle unter /services', () => {
    const { container } = renderHeader()
    const services = [...container.querySelectorAll('a[href]')].filter((a) =>
      (a.getAttribute('href') || '').startsWith('/services'),
    )
    expect(services).toHaveLength(0)
  })
})

describe('Header — General Sales CTA', () => {
  it('traegt den GENERAL_SALES-CTA mit dem CTA-Key, nicht mit der Nav-Beschriftung', () => {
    renderHeader()
    const cta = screen.getAllByRole('link', { name: 'nav.cta_quote' })[0]
    expect(cta).toHaveAttribute('href', '/contact')
    expect(cta).toHaveAttribute('data-cta-role', 'GENERAL_SALES')
  })

  it('nutzt nicht mehr die alte Kontakt-Beschriftung', () => {
    renderHeader()
    expect(screen.queryByRole('link', { name: 'nav.contact' })).not.toBeInTheDocument()
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
})

describe('Header — Untermenue mit der Tastatur', () => {
  it('das Untermenue ist nicht hover-only, sondern per Knopf bedienbar', () => {
    renderHeader()
    // Der i18n-Mock gibt den Key zurueck; der zugaengliche Name ist deshalb
    // der Key selbst. Im Desktop-Menue hat nur die Diagnostik Kinder.
    const toggle = within(mainNav()).getByRole('button', { name: 'a11y.toggle_submenu' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(within(mainNav()).getByRole('link', { name: 'nav.dental' })).toHaveAttribute(
      'href',
      '/diagnostics/dental',
    )
  })
})

describe('Header — Mobile Navigation', () => {
  const openMobile = () => {
    renderHeader()
    const burger = screen.getByRole('button', { name: 'a11y.toggle_nav' })
    expect(burger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'true')
    return burger
  }

  it('oeffnet und schliesst ueber den Burger', () => {
    const burger = openMobile()
    fireEvent.click(burger)
    expect(burger).toHaveAttribute('aria-expanded', 'false')
  })

  it('macht Epigenetik auch mobil zu einem eigenen Punkt', () => {
    openMobile()
    // Desktop- und Mobilnavigation rendern beide — mindestens zwei Treffer.
    expect(screen.getAllByRole('link', { name: 'nav.epigenetics' }).length).toBeGreaterThan(1)
  })

  it('haelt den Diagnostik-Parent mobil als Link erreichbar', () => {
    openMobile()
    const links = screen
      .getAllByRole('link', { name: 'nav.service' })
      .filter((a) => a.getAttribute('href') === '/diagnostics')
    expect(links.length).toBeGreaterThan(1)
  })

  it('bietet mobil den General-Sales-CTA', () => {
    openMobile()
    expect(screen.getAllByRole('link', { name: 'nav.cta_quote' }).length).toBeGreaterThan(1)
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

/**
 * Diagnostik-Mega-Menue (AP06 PT06.2).
 *
 * Die neun kanonischen Services stammen aus `src/data/services.tsx`; der Test
 * liest sie DORT und nicht aus einer im Test wiederholten Liste — sonst
 * bestaetigte er nur seine eigene Kopie und uebersaehe genau den Fall, dass ein
 * Service im Menue fehlt.
 */
import { services } from '../../data/services'

const openMega = () => {
  renderHeader()
  const toggle = within(mainNav()).getByRole('button', { name: 'a11y.toggle_submenu' })
  fireEvent.click(toggle)
  return toggle
}

describe('Diagnostik-Mega-Menue', () => {
  it('oeffnet und schliesst ueber den Trigger', () => {
    const toggle = openMega()
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('macht ALLE neun kanonischen Services direkt erreichbar', () => {
    openMega()
    const hrefs = within(mainNav())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))

    expect(services).toHaveLength(9)
    for (const service of services) {
      expect(hrefs).toContain(`/diagnostics/${service.id}`)
    }
  })

  it('bietet den Hub als eigenen Einstieg an', () => {
    openMega()
    expect(within(mainNav()).getByRole('link', { name: /nav.diagnostics_all/ })).toHaveAttribute(
      'href',
      '/diagnostics',
    )
  })

  it('gruppiert die Services in drei fachliche Spalten', () => {
    openMega()
    const nav = within(mainNav())
    expect(nav.getByText('nav.group_fields')).toBeInTheDocument()
    expect(nav.getByText('nav.group_analysis')).toBeInTheDocument()
    expect(nav.getByText('nav.group_system')).toBeInTheDocument()
  })

  it('fuehrt Epigenetik als abgesetzten Querverweis, nicht als Servicegruppe', () => {
    openMega()
    const nav = within(mainNav())
    // Als Querverweis gekennzeichnet ...
    expect(nav.getByText(/nav.group_crosslink/)).toBeInTheDocument()
    // ... und niemals als Diagnostik-Route modelliert.
    const hrefs = nav.getAllByRole('link').map((a) => a.getAttribute('href') || '')
    expect(hrefs).not.toContain('/diagnostics/epigenetics')
    expect(hrefs.filter((h) => h === '/epigenetics').length).toBeGreaterThan(0)
  })

  it('faerbt die Diagnostik NICHT aktiv, wenn nur der Epigenetik-Querverweis passt', () => {
    renderHeader('/epigenetics')
    const parent = within(mainNav()).getByRole('link', { name: 'nav.service' })
    expect(parent).not.toHaveAttribute('aria-current')
  })

  it('schliesst mit Escape und gibt den Fokus an den Trigger zurueck', () => {
    const toggle = openMega()
    toggle.focus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(document.activeElement).toBe(toggle)
  })

  it('haelt geschlossene Menuepunkte aus dem DOM heraus', () => {
    renderHeader()
    const nav = within(mainNav())
    expect(nav.queryByRole('link', { name: 'nav.hormonTests' })).not.toBeInTheDocument()
  })

  it('zielt auf keine Redirect-Quelle und keinen toten Slug', () => {
    openMega()
    const hrefs = within(mainNav())
      .getAllByRole('link')
      .map((a) => a.getAttribute('href') || '')
    expect(hrefs.filter((h) => h.startsWith('/services'))).toHaveLength(0)
    expect(hrefs).not.toContain('/diagnostics/sports')
  })

  it('macht alle neun Services auch mobil erreichbar', () => {
    renderHeader()
    fireEvent.click(screen.getByRole('button', { name: 'a11y.toggle_nav' }))
    const toggles = screen.getAllByRole('button', { name: 'a11y.toggle_submenu' })
    // Der letzte Trigger gehoert der Mobilnavigation.
    fireEvent.click(toggles[toggles.length - 1])

    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    for (const service of services) {
      expect(hrefs).toContain(`/diagnostics/${service.id}`)
    }
  })
})
