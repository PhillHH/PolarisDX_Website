import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'
import { LoadingState, EmptyState, ErrorState } from './StateBlock'

describe('Alert', () => {
  it('rendert Titel und Inhalt', () => {
    render(
      <Alert variant="success" title="Gesendet">
        Wir melden uns.
      </Alert>,
    )
    expect(screen.getByText('Gesendet')).toBeInTheDocument()
    expect(screen.getByText('Wir melden uns.')).toBeInTheDocument()
  })

  it('wird per role von aussen zur Ansage', () => {
    render(
      <Alert variant="error" role="alert">
        Fehlgeschlagen
      </Alert>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Fehlgeschlagen')
  })

  it('unterscheidet die vier Status nicht nur ueber Farbe, sondern ueber je ein eigenes Icon', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    const iconClasses = variants.map((variant) => {
      const { container, unmount } = render(<Alert variant={variant}>Text</Alert>)
      const svg = container.querySelector('svg')
      const cls = svg?.getAttribute('class') ?? ''
      unmount()
      return cls
    })

    // Jede Variante bringt ein anderes Icon mit -> vier verschiedene Klassen.
    expect(new Set(iconClasses).size).toBe(4)
  })

  it('haelt das Icon von der Vorlesereihenfolge fern', () => {
    const { container } = render(<Alert variant="warning">Achtung</Alert>)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('unterstuetzt die Bestands-Variante destructive weiterhin', () => {
    render(<Alert variant="destructive">Alt</Alert>)
    expect(screen.getByText('Alt')).toBeInTheDocument()
  })
})

describe('Loading / Empty / Error', () => {
  it('LoadingState sagt den Ladezustand hoeflich an', () => {
    render(<LoadingState label="Wird geladen" />)
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveTextContent('Wird geladen')
  })

  it('LoadingState kann die Beschriftung optisch verstecken, aber nicht fuer Screenreader', () => {
    render(<LoadingState label="Lädt" hideLabel />)
    expect(screen.getByRole('status')).toHaveTextContent('Lädt')
  })

  it('EmptyState ist Inhalt, keine Ansage', () => {
    render(<EmptyState title="Keine Treffer" description="Andere Suche versuchen." />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Keine Treffer' })).toBeInTheDocument()
  })

  it('ErrorState unterbricht bewusst', () => {
    render(<ErrorState title="Fehlgeschlagen" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Fehlgeschlagen')
  })

  it('ErrorState bietet nur bei erholbaren Fehlern einen Wiederholen-Knopf', () => {
    const { rerender } = render(<ErrorState title="Hart" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()

    rerender(<ErrorState title="Weich" onRetry={() => {}} retryLabel="Erneut versuchen" />)
    expect(screen.getByRole('button', { name: /Erneut versuchen/ })).toBeInTheDocument()
  })

  it('ErrorState meldet den Wiederholen-Wunsch', () => {
    let called = 0
    render(<ErrorState title="Weich" onRetry={() => (called += 1)} />)
    screen.getByRole('button').click()
    expect(called).toBe(1)
  })
})
