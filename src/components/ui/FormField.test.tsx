import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'
import { Input } from './Input'
import { Checkbox, Radio, Select } from './Choice'

describe('FormField', () => {
  it('verbindet Label und Bedienelement', () => {
    render(<FormField label="E-Mail">{(props) => <input type="email" {...props} />}</FormField>)
    // getByLabelText findet das Feld nur, wenn htmlFor/id wirklich greifen.
    expect(screen.getByLabelText('E-Mail')).toHaveAttribute('type', 'email')
  })

  it('verweist mit aria-describedby auf Hilfstext UND Fehler', () => {
    render(
      <FormField label="E-Mail" description="Geschäftliche Adresse" error="Bitte prüfen">
        {(props) => <input {...props} />}
      </FormField>,
    )

    const field = screen.getByLabelText('E-Mail')
    const describedBy = field.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(describedBy).toHaveLength(2)

    const texts = describedBy.map((id) => document.getElementById(id)?.textContent)
    expect(texts).toContain('Geschäftliche Adresse')
    expect(texts).toContain('Bitte prüfen')
  })

  it('setzt aria-invalid nur bei einem Fehler', () => {
    const { rerender } = render(
      <FormField label="Name">{(props) => <input {...props} />}</FormField>,
    )
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid')

    rerender(
      <FormField label="Name" error="Pflichtfeld">
        {(props) => <input {...props} />}
      </FormField>,
    )
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true')
  })

  it('meldet den Fehler als alert', () => {
    render(
      <FormField label="Name" error="Pflichtfeld">
        {(props) => <input {...props} />}
      </FormField>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Pflichtfeld')
  })

  it('macht Pflicht ueber das Attribut kenntlich, nicht nur ueber das Sternchen', () => {
    render(
      <FormField label="Name" required>
        {(props) => <input {...props} />}
      </FormField>,
    )
    const field = screen.getByLabelText(/Name/)
    expect(field).toBeRequired()
    expect(field).toHaveAttribute('aria-required', 'true')
  })

  it('rendert Gruppen als fieldset mit legend', () => {
    render(
      <FormField as="group" label="Anrede">
        {() => (
          <>
            <Radio name="anrede" label="Frau" />
            <Radio name="anrede" label="Herr" />
          </>
        )}
      </FormField>,
    )
    expect(screen.getByRole('group', { name: 'Anrede' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Frau' })).toBeInTheDocument()
  })

  it('traegt eine von aussen gesetzte Id', () => {
    render(
      <FormField label="Firma" id="company">
        {(props) => <input {...props} />}
      </FormField>,
    )
    expect(screen.getByLabelText('Firma')).toHaveAttribute('id', 'company')
  })

  it('arbeitet mit dem Input-Primitive zusammen', () => {
    render(<FormField label="Telefon">{(props) => <Input {...props} />}</FormField>)
    expect(screen.getByLabelText('Telefon')).toBeInTheDocument()
  })
})

describe('Choice controls', () => {
  it('Checkbox laesst sich ueber ihre Beschriftung bedienen', () => {
    render(<Checkbox label="Newsletter" />)
    const box = screen.getByRole('checkbox', { name: 'Newsletter' })
    expect(box).not.toBeChecked()
    screen.getByText('Newsletter').click()
    expect(box).toBeChecked()
  })

  it('Radio-Gruppe schaltet exklusiv', () => {
    render(
      <>
        <Radio name="g" label="A" />
        <Radio name="g" label="B" />
      </>,
    )
    const a = screen.getByRole('radio', { name: 'A' })
    const b = screen.getByRole('radio', { name: 'B' })
    b.click()
    expect(b).toBeChecked()
    expect(a).not.toBeChecked()
  })

  it('markiert einen ungueltigen Zustand fuer Screenreader', () => {
    render(<Checkbox label="AGB" invalid />)
    expect(screen.getByRole('checkbox', { name: 'AGB' })).toHaveAttribute('aria-invalid', 'true')
  })

  it('deaktivierte Choice-Controls sind nicht bedienbar', () => {
    render(<Checkbox label="Gesperrt" disabled />)
    expect(screen.getByRole('checkbox', { name: 'Gesperrt' })).toBeDisabled()
  })

  it('Select bietet seine Optionen an', () => {
    render(
      <FormField label="Anliegen">
        {(props) => (
          <Select {...props}>
            <option value="hw">Hardware</option>
            <option value="sw">Software</option>
          </Select>
        )}
      </FormField>,
    )
    const select = screen.getByLabelText('Anliegen')
    expect(select).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Hardware' })).toBeInTheDocument()
  })
})
