import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary } from './ErrorBoundary'
import { RootErrorBoundary } from './RootErrorBoundary'
import { SegmentErrorBoundary } from './SegmentErrorBoundary'

vi.mock('../lib/monitoring', () => ({ reportError: vi.fn() }))
import { reportError } from '../lib/monitoring'

/** Wirft beim ersten Render, danach nicht mehr — so laesst sich `reset` pruefen. */
let shouldThrow = true
const Boom = () => {
  if (shouldThrow) throw new Error('geheimer Stacktrace-Text-12345')
  return <p>Wieder da</p>
}

// React schreibt gefangene Fehler zusaetzlich auf die Konsole. Das ist
// erwartetes Verhalten und wuerde die Testausgabe nur zumuellen.
let consoleError: ReturnType<typeof vi.spyOn>
beforeEach(() => {
  shouldThrow = true
  vi.clearAllMocks()
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})
afterEach(() => consoleError.mockRestore())

describe('ErrorBoundary', () => {
  it('faengt den Renderfehler und zeigt den Fallback statt eines weissen Bildschirms', () => {
    render(
      <ErrorBoundary boundary="test" fallback={() => <p>Fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Fallback')).toBeInTheDocument()
  })

  it('meldet den Fehler ans Monitoring, nicht an die Oberflaeche', () => {
    render(
      <ErrorBoundary boundary="test" fallback={() => <p>Fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    )
    expect(reportError).toHaveBeenCalledTimes(1)
    // Der Stacktrace-Text darf nirgends im DOM auftauchen.
    expect(document.body.textContent).not.toContain('geheimer Stacktrace-Text-12345')
  })

  it('kann sich ueber reset erholen', () => {
    render(
      <ErrorBoundary
        boundary="test"
        fallback={(reset) => (
          <button type="button" onClick={reset}>
            Neu versuchen
          </button>
        )}
      >
        <Boom />
      </ErrorBoundary>,
    )
    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: 'Neu versuchen' }))
    expect(screen.getByText('Wieder da')).toBeInTheDocument()
  })
})

describe('RootErrorBoundary', () => {
  it('zeigt eine Fehleroberflaeche des Design-Systems mit Ansage und Ausweg', () => {
    render(
      <RootErrorBoundary>
        <Boom />
      </RootErrorBoundary>,
    )
    // `role="alert"` kommt aus dem ErrorState-Baustein — eine Fehleroberflaeche,
    // nicht zwei parallele Markup-Varianten.
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /errors.root.retry/ })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /errors.root.home/ })).toHaveAttribute('href', '/')
  })

  it('zeigt niemals einen Stacktrace', () => {
    render(
      <RootErrorBoundary>
        <Boom />
      </RootErrorBoundary>,
    )
    expect(document.body.textContent).not.toContain('geheimer Stacktrace-Text-12345')
    expect(document.body.textContent).not.toMatch(/at .*\.tsx/)
  })

  it('erholt sich ueber den Wiederholen-Knopf', () => {
    render(
      <RootErrorBoundary>
        <Boom />
      </RootErrorBoundary>,
    )
    shouldThrow = false
    fireEvent.click(screen.getByRole('button', { name: /errors.root.retry/ }))
    expect(screen.getByText('Wieder da')).toBeInTheDocument()
  })
})

describe('SegmentErrorBoundary', () => {
  it('degradiert nur das Segment und bietet einen Neuversuch', () => {
    render(
      <div>
        <p>Kopfbereich bleibt</p>
        <SegmentErrorBoundary name="articles">
          <Boom />
        </SegmentErrorBoundary>
      </div>,
    )
    // Der Rest der Seite ueberlebt.
    expect(screen.getByText('Kopfbereich bleibt')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /errors.segment.retry/ })).toBeInTheDocument()
  })

  it('benennt die Grenze fuers Monitoring', () => {
    render(
      <SegmentErrorBoundary name="articles">
        <Boom />
      </SegmentErrorBoundary>,
    )
    expect(reportError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ boundary: 'segment:articles' }),
    )
  })
})
