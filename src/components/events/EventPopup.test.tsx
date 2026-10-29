import { act, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import EventPopup from './EventPopup'
import { events } from '../../data/events'
import {
  anotherDialogOpen,
  eventPopupCandidate,
  isEventPopupDismissed,
  popupStorageKey,
  rememberEventPopup,
} from '../../lib/eventPopupState'

const medica = events.find((event) => event.id === 'medica_2026')!
const before = new Date('2026-10-28T12:00:00+01:00')

describe('EventPopup (SC-020)', () => {
  beforeEach(() => {
    window.sessionStorage.clear()
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(before)
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('bietet den naechsten Termin an — nicht auf Termin-, Kontakt- und Supportseite, nicht nach dem Schliessen', () => {
    expect(eventPopupCandidate('/', before)?.id).toBe('medica_2026')
    expect(eventPopupCandidate('/epigenetics', before)?.id).toBe('medica_2026')
    for (const path of ['/events', '/contact', '/support']) {
      expect(eventPopupCandidate(path, before)).toBeUndefined()
    }
    rememberEventPopup('medica_2026')
    expect(isEventPopupDismissed('medica_2026')).toBe(true)
    expect(window.sessionStorage.getItem(popupStorageKey('medica_2026'))).toBe('1')
    expect(eventPopupCandidate('/', before)).toBeUndefined()
    // Nach allen Terminen gibt es nichts anzubieten.
    expect(eventPopupCandidate('/', new Date('2026-12-01T12:00:00+01:00'))).toBeUndefined()
  })

  it('erkennt einen anderen offenen Dialog', () => {
    expect(anotherDialogOpen()).toBe(false)
    const other = document.createElement('div')
    other.setAttribute('role', 'dialog')
    document.body.appendChild(other)
    try {
      expect(anotherDialogOpen()).toBe(true)
    } finally {
      other.remove()
    }
  })

  it('rendert den Termin als Dialog mit beiden Wegen und merkt sich das Schliessen', async () => {
    const onClose = vi.fn()
    render(
      <MemoryRouter>
        <EventPopup event={medica} onClose={onClose} />
      </MemoryRouter>,
    )
    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('events:items.medica_2026.title')
    expect(dialog).toHaveTextContent('Düsseldorf')
    expect(screen.getByRole('link', { name: /event_popup.cta/ })).toHaveAttribute('href', '/events')
    expect(screen.getByRole('link', { name: /event_popup.meet/ })).toHaveAttribute(
      'href',
      '/contact',
    )
    await act(async () => {
      screen.getByRole('button', { name: 'common:event_popup.close' }).click()
    })
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(isEventPopupDismissed('medica_2026')).toBe(true)
  })
})
