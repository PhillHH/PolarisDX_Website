import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
  className?: string
}

export function Breadcrumbs({ items, variant = 'light', className = '' }: BreadcrumbsProps) {
  const isDark = variant === 'dark'

  return (
    <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isDark ? 'text-white/50' : 'text-gray-400'}`} />
              )}
              {isLast || !item.href ? (
                <span
                  className={isDark ? 'text-white/70' : 'text-gray-500'}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className={isDark
                    ? 'text-white/70 transition-colors hover:text-brand-secondary'
                    : 'text-gray-500 transition-colors hover:text-brand-primary'
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
