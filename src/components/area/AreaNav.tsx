import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

/**
 * AP34 PT34.2a (SC-003) — die Bereichsleiste.
 *
 * Seitwaerts im Bereich: echte Seitenziele statt Kapitel-Chips. NN/g rät von
 * Chip-Optik fuer Navigation ab (wirkt wie Filter); deshalb Unterstrich-Tabs.
 * Die Leiste klebt unter der festen Kopfzeile und schreibt — wie zuvor
 * ChapterNav — `--chapterbar-offset` an das Wurzelelement, damit
 * ScrollToHash (App.tsx) Sprungziele unter beiden Leisten landen laesst.
 *
 * Unter lg ist sie waagerecht scrollbar; der aktive Eintrag wird beim
 * Laden in den sichtbaren Bereich geschoben. Die Aktionen (Merkliste,
 * Anfrage) stehen nur ab lg — mobil traegt sie die MobileActionBar.
 */
export interface AreaNavItem {
  key: string
  to: string
  label: string
  count?: number
}

interface AreaNavProps {
  label: string
  items: AreaNavItem[]
  currentKey: string
  actions?: ReactNode
}

const AreaNav = ({ label, items, currentKey, actions }: AreaNavProps) => {
  const barRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Kopf und Leiste haben feste Hoehen je Breakpoint; der Versatz fuer
  // Sprungziele muss nur beim Laden und bei Groessenwechseln neu stehen.
  useEffect(() => {
    const root = document.documentElement
    const messen = () => {
      const header = document.querySelector('header')
      const bar = barRef.current
      if (header && bar)
        root.style.setProperty(
          '--chapterbar-offset',
          `${Math.round(header.getBoundingClientRect().height + bar.offsetHeight + 8)}px`,
        )
    }
    messen()
    window.addEventListener('resize', messen)
    return () => {
      window.removeEventListener('resize', messen)
      root.style.removeProperty('--chapterbar-offset')
    }
  }, [])

  useEffect(() => {
    const list = listRef.current
    const current = list?.querySelector<HTMLElement>('[aria-current="page"]')
    if (list && current && list.scrollWidth > list.clientWidth) {
      list.scrollLeft = Math.max(0, current.offsetLeft - 16)
    }
  }, [currentKey])

  return (
    <div
      ref={barRef}
      data-area-nav
      className="sticky top-[68px] z-20 border-b border-paper-line bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 lg:top-[88px]"
    >
      <div className="mx-auto flex max-w-container items-center gap-4 lg:px-0">
        <nav aria-label={label} className="flex min-w-0 flex-1 items-center gap-4">
          <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600 lg:block">
            {label}
          </span>
          <ul
            ref={listRef}
            className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-2 [scrollbar-width:none] lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => {
              const current = item.key === currentKey
              return (
                <li key={item.key} className="shrink-0">
                  <Link
                    to={item.to}
                    aria-current={current ? 'page' : undefined}
                    className={`inline-flex h-14 items-center gap-2 border-b-2 px-3 pt-0.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent ${
                      current
                        ? 'border-accent text-heading'
                        : 'border-transparent text-gray-600 hover:text-heading'
                    }`}
                  >
                    {item.label}
                    {item.count !== undefined ? (
                      <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent-strong">
                        {item.count}
                      </span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        {actions ? (
          <div className="hidden shrink-0 items-center gap-3 lg:flex">{actions}</div>
        ) : null}
      </div>
    </div>
  )
}

export default AreaNav
