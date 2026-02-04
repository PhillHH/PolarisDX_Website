import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, Search as SearchIcon, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearch } from '../../hooks/useSearch'
import { useScrollLock } from '../../hooks/useScrollLock'
import { LoadingSpinner } from './LoadingSpinner'
import { Alert } from './Alert'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const { results, isSearching, error } = useSearch(query)

  // Use generic hook to lock body scroll
  useScrollLock(isOpen)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('search-input')
        if (input) input.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset query on close
  useEffect(() => {
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  if (!isOpen) return null

  // SSR Guard: document.body is not available on server
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-900/60 backdrop-blur-sm pt-20 sm:pt-32 px-4">

      {/* Modal Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">

        {/* Header / Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 p-4">
          <SearchIcon className="h-5 w-5 text-gray-400" />
          <input
            id="search-input"
            type="text"
            className="flex-1 text-lg outline-none placeholder:text-gray-400 text-gray-900"
            placeholder={t('searchPlaceholder', 'Suche...')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-2">
            {/* Loading State */}
            {isSearching && (
              <div className="py-10 flex justify-center text-gray-400">
                <LoadingSpinner />
              </div>
            )}

            {/* Error State */}
            {!isSearching && error && (
              <div className="p-4">
                <Alert variant="destructive">
                  {error.message || t('error', 'Ein Fehler ist aufgetreten.')}
                </Alert>
              </div>
            )}

            {/* No Results */}
            {!isSearching && !error && query && results.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                    {t('noResults', 'Keine Ergebnisse gefunden.')}
                </div>
            )}

            {/* Start Typing */}
            {!query && !error && (
                <div className="py-10 text-center text-gray-400 text-sm">
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
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 group transition-colors"
                        >
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className={`text-xxs uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
                                        ${result.type === 'article' ? 'bg-purple-100 text-purple-700' : ''}
                                        ${result.type === 'service' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${result.type === 'page' ? 'bg-gray-100 text-gray-600' : ''}
                                    `}>
                                        {result.type}
                                    </span>
                                    <span className="font-medium text-gray-900 group-hover:text-brand-primary transition-colors">
                                        {result.title}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 line-clamp-1 ml-1">
                                    {result.description}
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-brand-primary" />
                        </Link>
                    ))}
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-xs text-center text-gray-400 border-t border-gray-100">
             Esc to close
        </div>

      </div>
    </div>,
    document.body
  )
}

export default SearchModal
