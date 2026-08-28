import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Layout from './Layout'
import { MAIN_CONTENT_ID } from './SkipLink'
import MobileCallButton from '../ui/MobileCallButton'

/**
 * Globale Hilfselemente der Shell (AP06 PT06.4).
 *
 * Ein Teil der Zusicherungen ist bewusst **quelltextbasiert**: ob der
 * produktive Baum ein Chat-Widget laedt, laesst sich nicht zuverlaessig am
 * gerenderten DOM ablesen — ein Loader, der erst in einem Effect ein <script>
 * anhaengt, taucht dort je nach Timing gar nicht auf. Die Datei zu lesen ist
 * hier die ehrlichere Pruefung.
 */
/**
 * Quelltexte ueber `import.meta.glob` statt ueber `node:fs`.
 *
 * Vite liest sie zur Buildzeit ein; der Test braucht damit keine Node-Typen
 * und laeuft in derselben Umgebung wie die Anwendung. Praktischer Nebeneffekt:
 * die Abwesenheit einer Datei ist einfach ein fehlender Schluessel — genau
 * das, was fuer die entfernte Chat-Datei geprueft werden soll.
 */
const SOURCES = import.meta.glob('/src/**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const SERVER = import.meta.glob('/{server.ts,server/server.js}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const ALL = { ...SOURCES, ...SERVER }

const src = (file: string) => {
  const key = file.startsWith('/') ? file : `/${file}`
  const found = ALL[key]
  if (found === undefined) throw new Error(`Quelltext nicht gefunden: ${key}`)
  return found
}

/**
 * Quelltext OHNE Kommentare.
 *
 * Noetig, weil genau die Stellen, die eine Entfernung begruenden, den
 * entfernten Namen erwaehnen — ein Kommentar "hier stand bis PT06.4 ein
 * ChatWidget" darf einen Test, der danach sucht, nicht ausloesen. Geprueft
 * werden soll Code, nicht Prosa.
 */
const stripComments = (text: string) =>
  text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const code = (file: string) => stripComments(src(file))

const renderShell = () =>
  render(
    <HelmetProvider>
      <MemoryRouter>
        <Layout>
          <p>Seiteninhalt</p>
        </Layout>
      </MemoryRouter>
    </HelmetProvider>,
  )

describe('Skip Link', () => {
  it('ist das erste fokussierbare Element im Dokument', () => {
    const { container } = renderShell()
    const focusable = container.querySelectorAll('a[href], button, input, select, textarea')
    expect(focusable[0]).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`)
  })

  it('traegt eine lokalisierte Beschriftung', () => {
    renderShell()
    expect(screen.getByRole('link', { name: 'a11y.skip_to_content' })).toBeInTheDocument()
  })

  it('zeigt sich erst bei Fokus, bleibt aber im Tabfluss', () => {
    renderShell()
    const link = screen.getByRole('link', { name: 'a11y.skip_to_content' })
    // sr-only blendet optisch aus, ohne aus dem Accessibility-Tree zu nehmen;
    // display:none oder tabindex=-1 waeren hier ein Fehler.
    expect(link.className).toContain('sr-only')
    expect(link.className).toContain('focus:not-sr-only')
    expect(link).not.toHaveAttribute('tabindex', '-1')
  })

  it('zeigt auf ein existierendes, fokussierbares Ziel', () => {
    const { container } = renderShell()
    const main = container.querySelector(`#${MAIN_CONTENT_ID}`)
    expect(main).not.toBeNull()
    expect(main?.tagName).toBe('MAIN')
    // Ohne tabindex scrollt der Browser nur, statt den Fokus zu setzen.
    expect(main).toHaveAttribute('tabindex', '-1')
  })
})

describe('Shell-Komposition', () => {
  it('rendert genau ein <main>', () => {
    const { container } = renderShell()
    expect(container.querySelectorAll('main')).toHaveLength(1)
  })

  it('rendert Header und Footer je einmal', () => {
    const { container } = renderShell()
    expect(container.querySelectorAll('header')).toHaveLength(1)
    expect(container.querySelectorAll('footer')).toHaveLength(1)
  })

  it('bindet den CookieBanner genau einmal und global ein — nicht im Layout', () => {
    const app = src('src/App.tsx')
    expect(app.match(/<CookieBanner\s*\/>/g) ?? []).toHaveLength(1)
    // Im Layout darf er nicht stecken, sonst renderte er pro Shell erneut.
    expect(src('src/components/layout/Layout.tsx')).not.toContain('CookieBanner')
  })
})

describe('MobileCallButton', () => {
  it('waehlt eine echte tel:-Nummer und ist benannt', () => {
    const { container } = render(
      <MemoryRouter>
        <MobileCallButton />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: 'contact.call_us_button' })).toBeInTheDocument()
    // Der Quelltext haelt die Nummer; im eingeklappten Zustand ist der
    // tel:-Link noch nicht gerendert.
    expect(src('src/components/ui/MobileCallButton.tsx')).toContain('tel:')
    expect(container.querySelector('[style*="cookie-banner-height"]')).not.toBeNull()
  })

  it('haengt nur in der B2B-Shell, nicht in der Consumer-Shell', () => {
    const app = src('src/App.tsx')
    expect(app).toContain('<MobileCallButton />')
    expect(src('src/pages/consumer/shell.tsx')).not.toContain('MobileCallButton')
  })
})

describe('Chat ist aus dem produktiven Frontend entfernt (DEC-RL-007)', () => {
  it('rendert kein Chat-Element in der Shell', () => {
    const { container } = renderShell()
    expect(container.querySelector('[id*="chat" i]')).toBeNull()
    expect(container.querySelector('[class*="chat" i]')).toBeNull()
  })

  it('importiert und rendert ChatWidget nirgends im produktiven Baum', () => {
    const app = code('src/App.tsx')
    expect(app).not.toMatch(/import\s+ChatWidget/)
    expect(app).not.toMatch(/<ChatWidget\s*\/>/)
  })

  it('die Frontend-Datei existiert nicht mehr', () => {
    expect(Object.keys(SOURCES)).not.toContain('/src/components/ui/ChatWidget.tsx')
  })

  it('laedt nirgends im produktiven Frontend einen HiHuman-Loader', () => {
    // Der GESAMTE ausgelieferte Quellbaum, nicht nur die Shell.
    const hits = Object.entries(SOURCES)
      .filter(([path]) => !/\.test\.tsx?$/.test(path))
      .filter(([, text]) => /hihuman/i.test(stripComments(text)))
      .map(([path]) => path)
    expect(hits).toEqual([])
  })
})

describe('Ownership-Grenzen bleiben gewahrt', () => {
  it('das Backend /api/chat ist unveraendert (Owner AP22)', () => {
    // AP06 darf es nicht entfernen — die Zusicherung haelt fest, dass es noch da ist.
    expect(src('server/server.js')).toMatch(/api\/chat/)
  })

  it('die CSP fuehrt die HiHuman-Domains weiterhin (Owner AP26)', () => {
    expect(src('server.ts')).toContain('widget.hihuman.co.uk')
  })

  it('AP06 hat keine Consent-Logik angefasst (Owner AP23)', () => {
    const banner = src('src/components/ui/CookieBanner.tsx')
    // Consent Mode und GTM-Gating bleiben, wo sie sind.
    expect(banner).toMatch(/consent/i)
  })
})

describe('Kein Garantie-Band in der Shell', () => {
  it('rendert keine Garantie-/Performance-Zusage', () => {
    const { container } = renderShell()
    expect(container.textContent).not.toMatch(/garant|guarantee/i)
  })
})
