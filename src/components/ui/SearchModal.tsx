import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { X, Search as SearchIcon, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { articles } from '../../data/articles'

interface SearchResult {
  title: string
  description: string
  path: string
  type: 'page' | 'article' | 'service'
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation(['common', 'home', 'services', 'about', 'articles'])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('search-input')
        if (input) input.focus()
      }, 100)
    }
  }, [isOpen])

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchTerm = query.toLowerCase()
    const found: SearchResult[] = []

    // 1. Search Static Pages
    const pages = [
      {
        title: t('nav.home', 'Startseite'),
        path: '/',
        keywords: t('common:search.keywords.home', 'home startseite igloo widget diagnostic')
      },
      {
        title: t('nav.about', 'Über uns'),
        path: '/about',
        keywords: t('common:search.keywords.about', 'team doctors polarisdx')
      },
      {
        title: t('nav.service', 'Leistungen'),
        path: '/services',
        keywords: t('common:search.keywords.services', 'services leistungen dental beauty longevity')
      },
      {
        title: t('nav.contact', 'Kontakt'),
        path: '/contact',
        keywords: t('common:search.keywords.contact', 'contact kontakt email phone address')
      },
      {
        title: t('nav.casestudies', 'Case Study'),
        path: '/casestudys/32reasons',
        keywords: t('common:search.keywords.casestudies', 'case study 32reasons polaris dx dentistry')
      },
      {
        title: t('nav.terms', 'AGB'),
        path: '/terms',
        keywords: t('common:search.keywords.terms', 'legal terms agb recht')
      }
    ]

    pages.forEach(page => {
      if (page.title.toLowerCase().includes(searchTerm) || page.keywords.toLowerCase().includes(searchTerm)) {
        found.push({
          title: page.title,
          description: t('common:readMore', 'Mehr erfahren'),
          path: page.path,
          type: 'page'
        })
      }
    })

    // 2. Search Services (Localized list mapped to routes)
    const services = [
      {
        id: 'dental',
        title: 'Dental',
        desc: t('common:search.services.dental', 'Zahnmedizinische Diagnostik')
      },
      {
        id: 'beauty',
        title: 'Beauty',
        desc: t('common:search.services.beauty', 'Dermatologische Analysen')
      },
      {
        id: 'longevity',
        title: 'Longevity',
        desc: t('common:search.services.longevity', 'Gesundheit und Langlebigkeit')
      },
      {
        id: 'sports',
        title: 'Sports',
        desc: t('common:search.services.sports', 'Leistungsdiagnostik für Sportler')
      }
    ]

    services.forEach(service => {
        if (service.title.toLowerCase().includes(searchTerm) || service.desc.toLowerCase().includes(searchTerm)) {
            found.push({
                title: service.title,
                description: service.desc,
                path: `/services/${service.id}`,
                type: 'service'
            })
        }
    })


    // 3. Search Articles
    // The articles.ts file does NOT contain titles. They are in the translation files 'articles.json'.
    // We must fetch the translation for each article ID.
    articles.forEach(article => {
        const titleKey = `articles:${article.id}.title`;
        const excerptKey = `articles:${article.id}.excerpt`;

        const title = t(titleKey);
        const excerpt = t(excerptKey);

        // If the key is returned (meaning translation missing), we might skip or show it anyway.
        // Assuming if t() returns the key, it's missing.
        const actualTitle = title !== titleKey ? title : article.slug;

        const titleMatch = actualTitle.toLowerCase().includes(searchTerm);
        const excerptMatch = excerpt && excerpt !== excerptKey && excerpt.toLowerCase().includes(searchTerm);

        if (titleMatch || excerptMatch) {
            found.push({
                title: actualTitle,
                description: (excerpt && excerpt !== excerptKey) ? excerpt : '',
                path: `/articles/${article.slug}`,
                type: 'article'
            })
        }
    })

    setResults(found)

  }, [query, t])

  if (!isOpen) return null

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
            placeholder={t('common:searchPlaceholder', 'Suche...')}
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
            {query && results.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                    {t('common:noResults', 'Keine Ergebnisse gefunden.')}
                </div>
            )}

            {!query && (
                <div className="py-10 text-center text-gray-400 text-sm">
                    {t('common:startTyping', 'Tippen Sie, um zu suchen...')}
                </div>
            )}

            {results.length > 0 && (
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
                                    <span className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded
                                        ${result.type === 'article' ? 'bg-purple-100 text-purple-700' : ''}
                                        ${result.type === 'service' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${result.type === 'page' ? 'bg-gray-100 text-gray-600' : ''}
                                    `}>
                                        {result.type}
                                    </span>
                                    <span className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                        {result.title}
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 line-clamp-1 ml-1">
                                    {result.description}
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-primary" />
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
