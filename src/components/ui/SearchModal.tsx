import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, Search as SearchIcon, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../hooks/useSearch'
import { useScrollLock } from '../../hooks/useScrollLock'
import { Alert, EmptyState, Spinner } from '~/design-system'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const { results, isSearching, error } = useSearch(query)

  const dialogRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Use generic hook to lock body scroll
  useScrollLock(isOpen)

  // Focus input on open; restore focus to the trigger (search button) on close.
  // A11y (WCAG 2.2 — 2.4.3 Focus Order): an aria-modal dialog must return focus
  // to the element that invoked it once it is dismissed.
  useEffect(() => {
    if (!isOpen) return
    triggerRef.current = document.activeElement as HTMLElement | null
    const focusTimer = setTimeout(() => {
      document.getElementById('search-input')?.focus()
    }, 100)
    return () => {
      clearTimeout(focusTimer)
      triggerRef.current?.focus?.()
    }
  }, [isOpen])

  // A11y (WCAG 2.2 — 2.1.2 No Keyboard Trap): keep Tab focus inside the dialog
  // while it is open by cycling between the first and last focusable elements.
  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !dialog.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  // Reset query on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  // Close on Escape (the footer promises "Esc to close").
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // SSR Guard: document.body is not available on server
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('searchPlaceholder', 'Suche...')}
      className="fixed inset-0 z-50 flex items-start justify-center bg-brand-navy/60 backdrop-blur-sm pt-20 sm:pt-32 px-4"
    >
      {/* Backdrop — click outside the card to close */}
      <button
        type="button"
        aria-label={t('close', 'Schließen')}
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-3 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header / Input */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] p-4">
          <SearchIcon className="h-5 w-5 text-fg-muted" />
          <input
            id="search-input"
            type="text"
            className="flex-1 text-lg bg-transparent outline-none placeholder:text-fg-muted text-fg-heading rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
            placeholder={t('searchPlaceholder', 'Suche...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            aria-label={t('close', 'Schließen')}
            className="flex h-[var(--tap-target-min)] w-[var(--tap-target-min)] items-center justify-center rounded-full hover:bg-bg-subtle transition-colors text-fg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-offset-2"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-2">
          {/* Loading State */}
          {isSearching && (
            <div className="py-10 flex justify-center text-fg-muted">
              <Spinner />
            </div>
          )}

          {/* Error State */}
          {!isSearching && error && (
            <div className="p-4">
              <Alert variant="danger">
                {error.message || t('error', 'Ein Fehler ist aufgetreten.')}
              </Alert>
            </div>
          )}

          {/* No Results */}
          {!isSearching && !error && query && results.length === 0 && (
            <EmptyState title={t('noResults', 'Keine Ergebnisse gefunden.')} />
          )}

          {/* Start Typing */}
          {!query && !error && (
            <div className="py-10 text-center text-fg-muted text-sm">
              {t('startTyping', 'Tippen Sie, um zu suchen...')}
            </div>
          )}

          {/* Results List */}
          {!isSearching && !error && results.length > 0 && (
            <div className="flex flex-col gap-1">
              {results.map((result, idx) => (
                <Link
                  key={`${result.path}-${idx}`}
                  to={result.path}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-bg-subtle group transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] focus-visible:ring-inset"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xxs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
                                        ${result.type === 'article' ? 'bg-accent-soft text-accent-strong' : ''}
                                        ${result.type === 'service' ? 'bg-[rgb(var(--brand-blue-rgb)/0.12)] text-brand-blue' : ''}
                                        ${result.type === 'page' ? 'bg-bg-subtle text-fg' : ''}
                                    `}
                      >
                        {result.type}
                      </span>
                      <span className="font-medium text-fg-heading group-hover:text-brand-primary transition-colors">
                        {result.title}
                      </span>
                    </div>
                    <span className="text-sm text-fg-muted line-clamp-1 ml-1">
                      {result.description}
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-fg-muted group-hover:text-brand-primary" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-bg-subtle p-3 text-xs text-center text-fg border-t border-[var(--color-border)]">
          Esc to close
        </div>
      </div>
    </div>,
    document.body,
  )
}

export default SearchModal
