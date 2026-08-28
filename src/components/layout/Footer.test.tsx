import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Footer from './Footer'
import { services } from '../../data/services'

/**
 * Footer-Vertrag (AP06 PT06.3).
 *
 * `src/test/setup.ts` mockt `react-i18next` so, dass `t(key)` den Key
 * zurueckgibt. Sichtbare Beschriftungen werden deshalb ueber ihren Key
 * geprueft — stuende im Markup deutscher Klartext, fiele er hier auf.
 */
const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )

const hrefs = (root: HTMLElement) =>
  [...root.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '')

describe('Footer — Grundgeruest', () => {
  it('rendert eine benannte Fusszeilen-Navigation', () => {
    renderFooter()
    expect(screen.getByRole('navigation', { name: 'footer.nav_label' })).toBeInTheDocument()
  })

  it('fuehrt die Unternehmens-, Support- und Kontaktwege', () => {
    renderFooter()
    const nav = within(screen.getByRole('navigation', { name: 'footer.nav_label' }))
    expect(nav.getByRole('link', { name: 'nav.about' })).toHaveAttribute('href', '/about')
    expect(nav.getByRole('link', { name: 'nav.contact' })).toHaveAttribute('href', '/contact')
    // Support fehlte im Bestand vollstaendig (IAD-16).
    expect(nav.getByRole('link', { name: 'nav.support' })).toHaveAttribute('href', '/support')
  })
})

describe('Footer — Diagnostik', () => {
  it('fuehrt den Hub', () => {
    const { container } = renderFooter()
    expect(hrefs(container)).toContain('/diagnostics')
  })

  it('fuehrt ALLE neun kanonischen Services — keine Teilmenge mehr (IAD-17)', () => {
    const { container } = renderFooter()
    const all = hrefs(container)
    expect(services).toHaveLength(9)
    for (const service of services) {
      expect(all).toContain(`/diagnostics/${service.id}`)
    }
  })
})

describe('Footer — Epigenetik', () => {
  it('hat einen eigenen sichtbaren Einstieg, nicht nur ueber Diagnostik (IAD-16)', () => {
    const { container } = renderFooter()
    const nav = within(screen.getByRole('navigation', { name: 'footer.nav_label' }))

    // Eigene Spaltenueberschrift — Epigenetik ist damit sichtbar ein eigener
    // Bereich und keine Zeile in der Diagnostik-Liste.
    expect(nav.getByRole('heading', { name: 'nav.epigenetics' })).toBeInTheDocument()

    // Und der Hub ist direkt erreichbar, ohne Umweg ueber /diagnostics.
    expect(hrefs(container)).toContain('/epigenetics')
  })

  it('verlinkt Hub, Vertiefungen und Musterbefunde', () => {
    const { container } = renderFooter()
    const all = hrefs(container)
    expect(all).toContain('/epigenetics')
    expect(all).toContain('/epigenetics/grundlagen')
    expect(all).toContain('/epigenetics/studienlage')
    expect(all).toContain('/epigenetics/unterlagen')
    expect(all).toContain('/epigenetics#musterbefunde')
  })

  it('modelliert Epigenetik nie als Diagnostik-Route', () => {
    const { container } = renderFooter()
    expect(hrefs(container)).not.toContain('/diagnostics/epigenetics')
  })
})

describe('Footer — Produkt, Wissen und Consumer', () => {
  it('fuehrt IglooPro, Artikel und Downloads', () => {
    const { container } = renderFooter()
    const all = hrefs(container)
    expect(all).toContain('/igloo-pro')
    expect(all).toContain('/articles')
    expect(all).toContain('/downloads')
  })

  it('zieht keinen globalen Consumer-Footer-Einstieg vor', () => {
    const { container } = renderFooter()
    // PT08.4 macht die Route locale-sicher. Ob Consumer global im Footer
    // beworben wird, bleibt davon getrennte IA-/Journey-Owner-Arbeit.
    expect(hrefs(container).filter((h) => h.startsWith('/consumer/'))).toHaveLength(0)
  })
})

describe('Footer — Standorte und Social', () => {
  it('nennt beide Standorte', () => {
    renderFooter()
    expect(screen.getByText('footer.london')).toBeInTheDocument()
    expect(screen.getByText('footer.hamburg')).toBeInTheDocument()
  })

  it('verlinkt Social extern und sicher', () => {
    renderFooter()
    for (const name of ['LinkedIn', 'Instagram']) {
      const link = screen.getByRole('link', { name })
      expect(link.getAttribute('href')).toMatch(/^https:\/\//)
      expect(link).toHaveAttribute('target', '_blank')
      // noopener schliesst den Zugriff des Ziels auf window.opener aus.
      expect(link.getAttribute('rel')).toContain('noopener')
    }
  })

  it('bindet keine Drittanbieter-Skripte oder iframes fuer Social ein', () => {
    const { container } = renderFooter()
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('iframe')).toBeNull()
  })
})

describe('Footer — Legal', () => {
  it('fuehrt Impressum, Datenschutz und AGB', () => {
    const { container } = renderFooter()
    const all = hrefs(container)
    expect(all).toContain('/imprint')
    expect(all).toContain('/privacy')
    expect(all).toContain('/terms')
  })
})

describe('Footer — Ausgeschlossenes', () => {
  it('verlinkt keine Redirect-Quelle unter /services', () => {
    const { container } = renderFooter()
    expect(hrefs(container).filter((h) => h.startsWith('/services'))).toHaveLength(0)
  })

  it('enthaelt keinen Chat-Einstieg', () => {
    const { container } = renderFooter()
    expect(container.textContent).not.toMatch(/chat/i)
    expect(hrefs(container).filter((h) => /chat|hihuman/i.test(h))).toHaveLength(0)
  })

  it('enthaelt kein Garantie-/Performance-Band', () => {
    const { container } = renderFooter()
    expect(container.textContent).not.toMatch(/garant|guarantee/i)
  })

  it('reaktiviert keine Backlog-Bereiche', () => {
    const { container } = renderFooter()
    const all = hrefs(container)
    for (const backlog of ['/shop', '/casestudys', '/case-studies', '/deal', '/voucher']) {
      expect(all.filter((h) => h.startsWith(backlog))).toHaveLength(0)
    }
  })

  it('zeigt keinen sichtbaren Text ohne i18n-Key ausser Markennamen', () => {
    renderFooter()
    const nav = screen.getByRole('navigation', { name: 'footer.nav_label' })
    const headings = within(nav)
      .getAllByRole('heading')
      .map((h) => h.textContent || '')
    // Jede Spaltenueberschrift ist ein Key (der Mock gibt Keys zurueck).
    for (const heading of headings) {
      expect(heading).toMatch(/^(footer|nav)\./)
    }
  })
})
