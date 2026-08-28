import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Button } from './Button'

const wrap = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Button', () => {
  it('rendert eine echte Schaltflaeche und meldet Klicks', () => {
    const onClick = vi.fn()
    wrap(<Button onClick={onClick}>Klick</Button>)

    const button = screen.getByRole('button', { name: 'Klick' })
    expect(button).toHaveAttribute('type', 'button')

    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('wird zum Link, sobald `to` gesetzt ist', () => {
    wrap(<Button to="/kontakt">Kontakt</Button>)

    const link = screen.getByRole('link', { name: 'Kontakt' })
    expect(link).toHaveAttribute('href', '/kontakt')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('kennzeichnet externe Ziele mit target und rel', () => {
    wrap(<Button href="https://example.org">Extern</Button>)

    const link = screen.getByRole('link', { name: 'Extern' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('behandelt interne Anker nicht als extern', () => {
    wrap(<Button href="#roi">Anker</Button>)

    const link = screen.getByRole('link', { name: 'Anker' })
    expect(link).not.toHaveAttribute('target')
  })

  it('loest im Ladezustand nicht aus und meldet aria-busy', () => {
    const onClick = vi.fn()
    wrap(
      <Button loading onClick={onClick}>
        Senden
      </Button>,
    )

    const button = screen.getByRole('button', { name: /Senden/ })
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('behaelt den zugaenglichen Namen waehrend des Ladens', () => {
    wrap(<Button loading>Angebot anfragen</Button>)
    expect(screen.getByRole('button', { name: /Angebot anfragen/ })).toBeInTheDocument()
  })

  it('macht einen deaktivierten Link unbenutzbar', () => {
    const onClick = vi.fn()
    wrap(
      <Button to="/kontakt" disabled onClick={onClick}>
        Gesperrt
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Gesperrt' })
    expect(link).toHaveAttribute('aria-disabled', 'true')
    expect(link).toHaveAttribute('tabindex', '-1')

    fireEvent.click(link)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('traegt bei Icon-Schaltflaechen den Namen aus aria-label', () => {
    wrap(<Button size="icon" aria-label="Menü öffnen" />)
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toBeInTheDocument()
  })

  it('deaktiviert per disabled und verhindert den Klick', () => {
    const onClick = vi.fn()
    wrap(
      <Button disabled onClick={onClick}>
        Aus
      </Button>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Aus' }))
    expect(onClick).not.toHaveBeenCalled()
  })
})
