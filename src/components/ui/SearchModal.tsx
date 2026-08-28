import * as React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Search as SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearch, type SearchResult, type SearchResultType } from '../../hooks/useSearch'
import { Dialog } from './Dialog'
import { EmptyState, ErrorState, LoadingState } from './StateBlock'
import { Input } from './Input'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const GROUP_ORDER: readonly SearchResultType[] = [
  'page',
  'service',
  'article',
  'epigenetics',
  'befund',
  'resource',
  'event',
  'consumer',
]

const groupResults = (results: readonly SearchResult[]) =>
  GROUP_ORDER.map((type) => ({
    type,
    results: results.filter((result) => result.type === type),
  })).filter((group) => group.results.length > 0)

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation('common')
  const [query, setQuery] = React.useState('')
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { results, isSearching, error } = useSearch(query)
  const normalizedQuery = query.trim()
  const groups = React.useMemo(() => groupResults(results), [results])

  const handleClose = React.useCallback(() => {
    setQuery('')
    onClose()
  }, [onClose])

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={t('search.modal.title')}
      closeLabel={t('search.modal.close')}
      initialFocusRef={inputRef}
      className="mb-[env(safe-area-inset-bottom)] mt-[env(safe-area-inset-top)] max-h-[calc(100dvh-2rem-env(safe-area-inset-top)-env(safe-area-inset-bottom))] max-w-2xl sm:max-h-[85vh]"
      footer={<span className="t-helper">{t('search.modal.escapeHint')}</span>}
    >
      <div className="sticky top-0 z-10 bg-white pb-4">
        <Input
          ref={inputRef}
          id="search-input"
          type="search"
          size="lg"
          label={t('search.modal.label')}
          placeholder={t('search.modal.placeholder')}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoComplete="off"
          leftIcon={<SearchIcon className="h-5 w-5" aria-hidden="true" />}
        />
      </div>

      {isSearching && <LoadingState label={t('search.modal.loading')} />}

      {!isSearching && error && (
        <ErrorState
          title={t('search.modal.errorTitle')}
          description={t('search.modal.errorDescription')}
        />
      )}

      {!isSearching && !error && !normalizedQuery && (
        <EmptyState
          title={t('search.modal.initialTitle')}
          description={t('search.modal.initialDescription')}
          icon={<SearchIcon className="h-5 w-5" aria-hidden="true" />}
        />
      )}

      {!isSearching && !error && normalizedQuery && results.length === 0 && (
        <EmptyState
          title={t('search.modal.emptyTitle')}
          description={t('search.modal.emptyDescription', { query: normalizedQuery })}
          icon={<SearchIcon className="h-5 w-5" aria-hidden="true" />}
        />
      )}

      {!isSearching && !error && normalizedQuery && (
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {t('search.modal.results', { count: results.length })}
        </p>
      )}

      {!isSearching && !error && results.length > 0 && (
        <div className="space-y-6" data-search-results>
          {groups.map((group) => {
            const headingId = `search-group-${group.type}`
            return (
              <section key={group.type} aria-labelledby={headingId}>
                <h3 id={headingId} className="t-label mb-2 text-heading">
                  {t(`search.modal.groups.${group.type}`)}
                </h3>
                <ul className="space-y-1">
                  {group.results.map((result) => (
                    <li key={result.id}>
                      <Link
                        to={result.path}
                        onClick={handleClose}
                        className="group flex min-h-[44px] items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors duration-hover hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium text-heading transition-colors duration-hover group-hover:text-brand-primary motion-reduce:transition-none">
                            {result.title}
                          </span>
                          <span className="mt-0.5 block text-sm text-ui-field">
                            {result.description}
                          </span>
                        </span>
                        <ChevronRight
                          className="h-4 w-4 shrink-0 text-ui-field"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </Dialog>
  )
}

export default SearchModal
