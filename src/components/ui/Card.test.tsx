import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Card } from './Card'

const wrap = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>)

describe('Card', () => {
  it('ist ohne Ziel eine reine Flaeche — kein Link, kein Tabstop', () => {
    wrap(<Card>Inhalt</Card>)
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
    expect(screen.getByText('Inhalt')).toBeInTheDocument()
  })

  it('wird mit `to` zu genau EINEM Link ueber die ganze Karte', () => {
    wrap(
      <Card to="/diagnostics">
        <h3>Diagnostik</h3>
        <p>Beschreibung</p>
      </Card>,
    )
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(1)
    expect(links[0]).toHaveAttribute('href', '/diagnostics')
    expect(links[0]).toHaveTextContent('Diagnostik')
  })

  it('kennzeichnet externe Ziele mit target und rel', () => {
    wrap(<Card href="https://example.org">Extern</Card>)
    const link = screen.getByRole('link', { name: 'Extern' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('behandelt relative hrefs nicht als extern', () => {
    wrap(<Card href="/downloads/datenblatt.pdf">PDF</Card>)
    expect(screen.getByRole('link', { name: 'PDF' })).not.toHaveAttribute('target')
  })

  it('ist als Link per Tastatur erreichbar', () => {
    wrap(<Card to="/kontakt">Kontakt</Card>)
    const link = screen.getByRole('link', { name: 'Kontakt' })
    link.focus()
    expect(document.activeElement).toBe(link)
  })

  it('reicht zusaetzliche Attribute durch', () => {
    wrap(
      <Card aria-label="Kennzahlen" role="group">
        Zahlen
      </Card>,
    )
    expect(screen.getByRole('group', { name: 'Kennzahlen' })).toBeInTheDocument()
  })
})
