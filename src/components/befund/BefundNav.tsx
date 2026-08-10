/**
 * Kapitelleiste der Musterbefund-Seiten.
 *
 * Ein Befund ist bis zu 24.000 px lang — ohne Navigation ist das eine
 * Endlosrolle. Die Leiste klemmt unter dem fixierten Seitenkopf und leistet
 * drei Dinge: zeigen, wo man ist; jedes Kapitel in einem Klick erreichbar
 * machen; ohne Umweg zu einem anderen Befund wechseln.
 *
 * Alles sind echte Links mit href — die Seite funktioniert damit auch ohne
 * JavaScript, und Tastaturbedienung sowie "Link in neuem Tab" bleiben heil.
 * JavaScript fuegt nur zwei Annehmlichkeiten hinzu: die aktive Markierung und
 * den Lesefortschritt.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'

export interface Chapter {
  id: string
  label: string
}

interface BefundNavProps {
  chapters: Chapter[]
  panel: string
  slug: string
  others: { slug: string; panel: string }[]
  backLabel: string
  othersLabel: string
  chaptersLabel: string
  progressLabel: string
}

/** Kopfhoehe der Seite; die Leiste sitzt buendig darunter. */
const TOP = 'top-[68px] lg:top-[88px]'

const BefundNav = ({
  chapters,
  panel,
  slug,
  others,
  backLabel,
  othersLabel,
  chaptersLabel,
  progressLabel,
}: BefundNavProps) => {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? '')
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  // Aktives Kapitel: das oberste, dessen Anfang bereits ueber der Mitte liegt.
  // Ein reiner IntersectionObserver auf "sichtbar" waere bei sehr langen
  // Abschnitten unbrauchbar — die fuellen den Viewport komplett.
  useEffect(() => {
    if (chapters.length === 0) return
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const line = window.innerHeight * 0.35
        let current = chapters[0].id
        for (const c of chapters) {
          const el = document.getElementById(c.id)
          if (el && el.getBoundingClientRect().top <= line) current = c.id
        }
        setActive(current)

        const max = document.documentElement.scrollHeight - window.innerHeight
        setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [chapters])

  // Das aktive Kapitel in den sichtbaren Bereich der Leiste holen — sonst
  // steht die Markierung bei langen Befunden ausserhalb.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const el = list.querySelector<HTMLElement>(`[data-chapter="${active}"]`)
    if (!el) return
    const l = list.getBoundingClientRect()
    const e = el.getBoundingClientRect()
    if (e.left < l.left || e.right > l.right) {
      list.scrollTo({ left: el.offsetLeft - list.clientWidth / 2 + el.clientWidth / 2 })
    }
  }, [active])

  return (
    <div
      className={`sticky ${TOP} z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80`}
    >
      {/* Auf schmalen Viewports bekommen die Kapitel eine eigene Zeile — zu
          dritt in einer Reihe bleibt fuer sie nur ein Spalt uebrig. */}
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 lg:flex-nowrap lg:gap-4 lg:px-10 lg:py-2">
        <Link
          to="/epigenetics#musterbefunde"
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-2 text-sm font-medium text-brand-deep transition-colors hover:bg-slate-100"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{backLabel}</span>
          <span className="sr-only sm:hidden">{backLabel}</span>
        </Link>

        {/* Befundwechsel: natives details statt Menue-Nachbau — Tastatur und
            Screenreader koennen das ohne Zutun. */}
        <details className="group relative shrink-0">
          <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-300 px-3 text-sm font-semibold text-text-heading transition-colors hover:border-brand-primary">
            <span className="max-w-[9rem] truncate lg:max-w-none">{panel}</span>
            <ChevronDown
              className="h-4 w-4 shrink-0 text-brand-primary transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
            <p className="px-4 pb-1 pt-1 text-xs font-medium text-gray-500">{othersLabel}</p>
            {others.map((o) => (
              <Link
                key={o.slug}
                to={`/epigenetics/musterbefund/${o.slug}`}
                className={`block px-4 py-2.5 text-base transition-colors hover:bg-slate-50 ${
                  o.slug === slug
                    ? 'font-semibold text-brand-primary'
                    : 'text-text-heading'
                }`}
              >
                {o.panel}
              </Link>
            ))}
          </div>
        </details>

        <nav
          aria-label={chaptersLabel}
          className="order-last min-w-0 basis-full pb-1 lg:order-none lg:flex-1 lg:basis-auto lg:pb-0"
        >
          <div
            ref={listRef}
            className="flex gap-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {chapters.map((c) => (
              <a
                key={c.id}
                href={`#${c.id}`}
                data-chapter={c.id}
                aria-current={active === c.id ? 'true' : undefined}
                className={`inline-flex h-9 items-center whitespace-nowrap rounded-full px-3 text-sm transition-colors ${
                  active === c.id
                    ? 'bg-brand-deep font-semibold text-white'
                    : 'text-gray-600 hover:bg-slate-100 hover:text-brand-deep'
                }`}
              >
                {c.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div
        className="h-0.5 bg-accent-strong transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-label={progressLabel}
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  )
}

export default BefundNav
