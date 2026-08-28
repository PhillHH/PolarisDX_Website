import * as React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { SearchResult } from '../../hooks/useSearch'
import SearchModal from './SearchModal'

const searchState = vi.hoisted(() => ({
  results: [] as SearchResult[],
  isSearching: false,
  error: null as Error | null,
}))

vi.mock('../../hooks/useSearch', async (importOriginal) => {
  const original = await importOriginal<typeof import('../../hooks/useSearch')>()
  return { ...original, useSearch: () => searchState }
})

const pageResult: SearchResult = {
  id: 'about',
  title: 'Über PolarisDX',
  description: 'Unternehmen und Team',
  path: '/about',
  type: 'page',
  typeLabel: 'page',
  priority: 80,
}

const serviceResult: SearchResult = {
  id: 'service-dental',
  title: 'Dentaldiagnostik',
  description: 'Diagnostik für die Zahnarztpraxis',
  path: '/diagnostics/dental',
  type: 'service',
  typeLabel: 'service',
  priority: 90,
}

const renderModal = (props: Partial<React.ComponentProps<typeof SearchModal>> = {}) => {
  const onClose = vi.fn()
  return {
    onClose,
    ...render(
      <MemoryRouter>
        <SearchModal isOpen onClose={onClose} {...props} />
      </MemoryRouter>,
    ),
  }
}

beforeEach(() => {
  searchState.results = []
  searchState.isSearching = false
  searchState.error = null
})

afterEach(cleanup)

describe('SearchModal — Dialog und Fokus', () => {
  it('ist ein benannter modaler Dialog mit beschriftetem Suchfeld', () => {
    renderModal()
    const dialog = screen.getByRole('dialog', { name: 'search.modal.title' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getByRole('searchbox', { name: 'search.modal.label' })).toHaveAttribute(
      'placeholder',
      'search.modal.placeholder',
    )
  })

  it('setzt den initialen Fokus ohne Timer in das Suchfeld', () => {
    renderModal()
    expect(screen.getByRole('searchbox', { name: 'search.modal.label' })).toHaveFocus()
  })

  it('faengt Tab und Shift+Tab innerhalb des Dialogs', () => {
    searchState.results = [serviceResult]
    renderModal()
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Dental' } })

    const dialog = screen.getByRole('dialog')
    const close = within(dialog).getByRole('button', { name: 'search.modal.close' })
    const result = within(dialog).getByRole('link', { name: /Dentaldiagnostik/ })

    result.focus()
    fireEvent.keyDown(document, { key: 'Tab' })
    expect(close).toHaveFocus()

    close.focus()
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(result).toHaveFocus()
  })

  it('schliesst per Escape und setzt den transienten Suchbegriff zurueck', () => {
    const Harness = () => {
      const [open, setOpen] = React.useState(false)
      return (
        <MemoryRouter>
          <button type="button" onClick={() => setOpen(true)}>
            Trigger
          </button>
          <SearchModal isOpen={open} onClose={() => setOpen(false)} />
        </MemoryRouter>
      )
    }

    render(<Harness />)
    const trigger = screen.getByRole('button', { name: 'Trigger' })
    trigger.focus()
    fireEvent.click(trigger)
    const input = screen.getByRole('searchbox')
    fireEvent.change(input, { target: { value: 'Dental' } })
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    fireEvent.click(trigger)
    expect(screen.getByRole('searchbox')).toHaveValue('')
  })

  it('schliesst ueber benannten Knopf und Backdrop', () => {
    const first = renderModal()
    fireEvent.click(screen.getByRole('button', { name: 'search.modal.close' }))
    expect(first.onClose).toHaveBeenCalledTimes(1)
    first.unmount()

    const second = renderModal()
    fireEvent.click(second.baseElement.querySelector('[aria-hidden="true"]')!)
    expect(second.onClose).toHaveBeenCalledTimes(1)
  })

  it('sperrt und restauriert den Hintergrundscroll', () => {
    document.body.style.overflow = 'scroll'
    const { unmount } = renderModal()
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('scroll')
    document.body.style.overflow = ''
  })
})

describe('SearchModal — Zustaende und Ergebnisse', () => {
  it('zeigt den lokalisierten initialen Zustand', () => {
    renderModal()
    expect(screen.getByRole('heading', { name: 'search.modal.initialTitle' })).toBeInTheDocument()
    expect(screen.getByText('search.modal.initialDescription')).toBeInTheDocument()
  })

  it('zeigt den AP05-Ladezustand', () => {
    searchState.isSearching = true
    renderModal()
    expect(screen.getByRole('status')).toHaveTextContent('search.modal.loading')
  })

  it('zeigt den AP05-Fehlerzustand', () => {
    searchState.error = new Error('technical detail')
    renderModal()
    expect(screen.getByRole('alert')).toHaveTextContent('search.modal.errorTitle')
    expect(screen.getByRole('alert')).toHaveTextContent('search.modal.errorDescription')
    expect(screen.queryByText('technical detail')).not.toBeInTheDocument()
  })

  it('zeigt Leerzustand und polite Ergebnisansage', () => {
    renderModal()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'unbekannt' } })
    expect(screen.getByRole('heading', { name: 'search.modal.emptyTitle' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('search.modal.results')
  })

  it('gruppiert nur vorhandene Typen und rendert je Treffer genau einen Link', () => {
    searchState.results = [serviceResult, pageResult]
    renderModal()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'diagnostik' } })

    expect(screen.getByRole('heading', { name: 'search.modal.groups.page' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'search.modal.groups.service' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'search.modal.groups.article' })).toBeNull()
    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Dentaldiagnostik/ })).toHaveAttribute(
      'href',
      '/diagnostics/dental',
    )
    for (const rawLiteral of ['page', 'article', 'service', 'Esc to close']) {
      expect(screen.queryByText(rawLiteral)).not.toBeInTheDocument()
    }
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite')
  })

  it('schliesst beim Aktivieren eines Ergebnislinks genau einmal', () => {
    searchState.results = [serviceResult]
    const { onClose } = renderModal()
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Dental' } })
    fireEvent.click(screen.getByRole('link', { name: /Dentaldiagnostik/ }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
