import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
  className?: string
  /**
   * Nur setzen, wenn ein Kontext wirklich einen abweichenden Namen braucht.
   * Ohne Angabe kommt der lokalisierte Standardname aus `common:a11y.breadcrumb`.
   */
  ariaLabel?: string
}

export function Breadcrumbs({
  items,
  variant = 'light',
  className = '',
  ariaLabel,
}: BreadcrumbsProps) {
  const { t } = useTranslation('common')
  const isDark = variant === 'dark'

  // AP24 PT24.1: die Voreinstellung war das feste englische 'Breadcrumb'.
  // Der Name eines Landmarks wird vorgelesen — auf allen Routen mit
  // Brotkruemelpfad stand er damit in neun von zehn Sprachen sprachfremd da.
  const label = ariaLabel ?? t('a11y.breadcrumb', 'Brotkrümelnavigation')

  return (
    <nav aria-label={label} className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className={`h-3.5 w-3.5 shrink-0 ${isDark ? 'text-white/50' : 'text-gray-400'}`}
                  aria-hidden="true"
                />
              )}
              {isLast || !item.href ? (
                <span
                  className={isDark ? 'text-white/70' : 'text-gray-700'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={
                    isDark
                      ? 'rounded-sm text-white/70 transition-colors hover:text-brand-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep'
                      : 'rounded-sm text-gray-700 transition-colors hover:text-brand-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2'
                  }
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
