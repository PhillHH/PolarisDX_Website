import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from './Input'
import { Textarea } from './Textarea'

describe('Input', () => {
  it('verbindet Label und Feld', () => {
    render(<Input label="Firma" />)
    expect(screen.getByLabelText('Firma')).toBeInTheDocument()
  })

  it('verweist auf den Hilfstext', () => {
    render(<Input label="E-Mail" helperText="Geschäftliche Adresse" />)
    const field = screen.getByLabelText('E-Mail')
    const id = field.getAttribute('aria-describedby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).toHaveTextContent('Geschäftliche Adresse')
  })

  it('meldet den Fehlerzustand ueber aria-invalid und zeigt die Meldung', () => {
    render(<Input label="E-Mail" error="Ungültig" />)
    const field = screen.getByLabelText('E-Mail')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Ungültig')).toBeInTheDocument()
  })

  it('zeigt im Fehlerfall den Fehler statt des Hilfstexts', () => {
    render(<Input label="E-Mail" helperText="Hinweis" error="Ungültig" />)
    expect(screen.getByText('Ungültig')).toBeInTheDocument()
    expect(screen.queryByText('Hinweis')).not.toBeInTheDocument()
  })

  it('ist deaktiviert nicht bedienbar', () => {
    render(<Input label="Gesperrt" disabled />)
    expect(screen.getByLabelText('Gesperrt')).toBeDisabled()
  })

  it('nimmt Eingaben entgegen', () => {
    render(<Input label="Name" />)
    const field = screen.getByLabelText('Name') as HTMLInputElement
    fireEvent.change(field, { target: { value: 'Polaris' } })
    expect(field.value).toBe('Polaris')
  })

  it('reicht required durch', () => {
    render(<Input label="Pflicht" required />)
    expect(screen.getByLabelText('Pflicht')).toBeRequired()
  })
})

describe('Textarea', () => {
  it('verbindet Label und Feld', () => {
    render(<Textarea label="Nachricht" />)
    expect(screen.getByLabelText('Nachricht')).toBeInTheDocument()
  })

  it('meldet den Fehlerzustand', () => {
    render(<Textarea label="Nachricht" error="Zu kurz" />)
    expect(screen.getByLabelText('Nachricht')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Zu kurz')).toBeInTheDocument()
  })

  it('verweist auf den Hilfstext', () => {
    render(<Textarea label="Nachricht" helperText="Max. 500 Zeichen" />)
    const field = screen.getByLabelText('Nachricht')
    const id = field.getAttribute('aria-describedby')
    expect(document.getElementById(id!)).toHaveTextContent('Max. 500 Zeichen')
  })

  it('ist deaktiviert nicht bedienbar', () => {
    render(<Textarea label="Gesperrt" disabled />)
    expect(screen.getByLabelText('Gesperrt')).toBeDisabled()
  })
})
