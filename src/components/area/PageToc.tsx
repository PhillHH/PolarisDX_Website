import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * AP34 PT34.2a (SC-003) — „Auf dieser Seite".
 *
 * Ab lg eine klebende linke Spalte mit aktivem Abschnitt und Lesefortschritt
 * (NN/g: ein klebendes Inhaltsverzeichnis gehoert in eine Seitenspalte). Unter
 * lg ein natives <details> am Anfang des Inhalts — NICHT klebend: zugeklappte
 * klebende Verzeichnisse werden laut NN/g uebersehen. Linktexte entsprechen
 * den Abschnittsueberschriften. Der Scroll-Spy laedt nach (tocSpy.ts).
 */
export interface TocChapter {
  id: string
  label: string
}

interface PageTocProps {
  chapters: TocChapter[]
  label: string
}

export const PageToc = ({ chapters, label }: PageTocProps) => {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    let stop: (() => void) | undefined
    let alive = true
    import('./tocSpy').then(({ watchToc }) => {
      if (alive && ref.current) stop = watchToc(ref.current)
    })
    return () => {
      alive = false
      stop?.()
    }
  }, [chapters])

  return (
    <nav ref={ref} aria-label={label} className="sticky top-44 hidden lg:block">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-gray-600">
        {label}
      </p>
      <ul className="border-l-2 border-paper-line">
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            <a
              href={`#${chapter.id}`}
              className="block border-l-2 border-transparent py-2 pl-4 text-[15px] leading-snug text-gray-600 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {chapter.label}
            </a>
          </li>
        ))}
      </ul>
      <div aria-hidden="true" className="mt-5 h-1 overflow-hidden rounded-full bg-paper-line">
        <div data-toc-progress className="h-full w-0 rounded-full bg-accent" />
      </div>
    </nav>
  )
}

export const PageTocMobile = ({ chapters, label }: PageTocProps) => (
  <details className="group mb-10 rounded-2xl border border-paper-line bg-white lg:hidden">
    <summary className="flex min-h-[52px] cursor-pointer list-none items-center gap-3 px-4 text-[15px] font-semibold text-heading [&::-webkit-details-marker]:hidden">
      <span className="flex-1">{label}</span>
      <span className="text-sm font-normal text-gray-600">{chapters.length}</span>
      <ChevronDown
        className="h-4 w-4 shrink-0 text-accent-strong group-open:rotate-180"
        aria-hidden="true"
      />
    </summary>
    <ul className="border-t border-paper-line p-2">
      {chapters.map((chapter) => (
        <li key={chapter.id}>
          <a
            href={`#${chapter.id}`}
            className="block rounded-xl p-3 text-base text-heading hover:bg-paper"
          >
            {chapter.label}
          </a>
        </li>
      ))}
    </ul>
  </details>
)
