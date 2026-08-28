import * as React from 'react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Dialog } from './Dialog'

afterEach(cleanup)

const open = (overrides: Partial<React.ComponentProps<typeof Dialog>> = {}) => {
  const onClose = vi.fn()
  const utils = render(
    <Dialog open onClose={onClose} title="Angebot anfragen" {...overrides}>
      <input aria-label="Feld A" />
      <button type="button">Aktion</button>
    </Dialog>,
  )
  return { onClose, ...utils }
}

describe('Dialog', () => {
  it('rendert geschlossen nichts in den DOM', () => {
    render(
      <Dialog open={false} onClose={() => {}} title="Unsichtbar">
        Inhalt
      </Dialog>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText('Inhalt')).not.toBeInTheDocument()
  })

  it('traegt die Dialog-Semantik und wird vom Titel benannt', () => {
    open()
    const dialog = screen.getByRole('dialog', { name: 'Angebot anfragen' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('verweist mit aria-describedby auf die Beschreibung', () => {
    open({ description: 'Wir melden uns werktags.' })
    const dialog = screen.getByRole('dialog')
    const id = dialog.getAttribute('aria-describedby')
    expect(id).toBeTruthy()
    expect(document.getElementById(id!)).toHaveTextContent('Wir melden uns werktags.')
  })

  it('setzt den Fokus beim Oeffnen in den Dialog', () => {
    open()
    const dialog = screen.getByRole('dialog')
    expect(dialog.contains(document.activeElement)).toBe(true)
  })

  it('setzt den Fokus auf ein angegebenes primaeres Bedienelement', () => {
    const PrimaryFocus = () => {
      const inputRef = React.useRef<HTMLInputElement>(null)
      return (
        <Dialog open onClose={() => {}} title="Dialog" initialFocusRef={inputRef}>
          <button type="button">Erste DOM-Aktion</button>
          <input ref={inputRef} aria-label="Primaeres Feld" />
        </Dialog>
      )
    }

    render(<PrimaryFocus />)
    expect(screen.getByRole('textbox', { name: 'Primaeres Feld' })).toHaveFocus()
  })

  it('schliesst bei Escape', () => {
    const { onClose } = open()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('schliesst ueber den Schliessen-Knopf, der einen Namen hat', () => {
    const { onClose } = open({ closeLabel: 'Schließen' })
    fireEvent.click(screen.getByRole('button', { name: 'Schließen' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('sperrt den Hintergrund-Scroll und gibt ihn beim Schliessen frei', () => {
    const { unmount } = open()
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('gibt den Fokus an das ausloesende Element zurueck', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Öffnen'
    document.body.appendChild(trigger)
    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    const { unmount } = render(
      <Dialog open onClose={() => {}} title="Dialog">
        <button type="button">Drin</button>
      </Dialog>,
    )
    expect(document.activeElement).not.toBe(trigger)

    unmount()
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('haelt den Fokus im Dialog (Tab am Ende springt an den Anfang)', () => {
    open()
    const dialog = screen.getByRole('dialog')
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea'),
    )
    const last = focusables[focusables.length - 1]
    last.focus()

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(focusables[0])
  })

  it('haelt den Fokus im Dialog (Shift+Tab am Anfang springt ans Ende)', () => {
    open()
    const dialog = screen.getByRole('dialog')
    const focusables = Array.from(
      dialog.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,textarea'),
    )
    focusables[0].focus()

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(focusables[focusables.length - 1])
  })

  it('schliesst per Backdrop-Klick, wenn erlaubt', () => {
    const { onClose, container } = open()
    const backdrop = container.querySelector('[aria-hidden="true"]')!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('schliesst NICHT per Backdrop-Klick, wenn abgeschaltet', () => {
    const { onClose, container } = open({ closeOnBackdrop: false })
    const backdrop = container.querySelector('[aria-hidden="true"]')!
    fireEvent.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('entfernt den Escape-Listener nach dem Schliessen', () => {
    const { onClose, unmount } = open()
    unmount()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).not.toHaveBeenCalled()
  })

  it('rendert die Drawer-Variante mit derselben Semantik', () => {
    open({ variant: 'drawer' })
    expect(screen.getByRole('dialog', { name: 'Angebot anfragen' })).toHaveAttribute(
      'aria-modal',
      'true',
    )
  })
})
