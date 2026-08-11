/**
 * Kapitelleiste fuer lange Seiten.
 *
 * Gemessen auf /epigenetics: 17.600 px auf dem Desktop, 35.200 px auf dem
 * Telefon — knapp 40 Bildschirme. Bis zum Kontaktabschnitt sind es 33.000 px.
 * Ohne Leiste ist das eine Endlosrolle, und die Handlungsaufforderung am Ende
 * erreicht niemand.
 *
 * Die Leiste klemmt unter dem fixierten Seitenkopf und traegt bis zu vier
 * Dinge, jedes davon optional:
 * - einen Rueckweg
 * - einen Umschalter (auf den Befundseiten: das jeweils andere Panel)
 * - die Kapitel der Seite, waagerecht scrollbar
 * - eine Handlungsaufforderung, damit sie nicht erst nach 33.000 px auftaucht
 *
 * Alles sind echte Links mit href — die Seite funktioniert damit auch ohne
 * JavaScript, und Tastaturbedienung sowie "Link in neuem Tab" bleiben heil.
 * JavaScript fuegt nur die aktive Markierung und den Lesefortschritt hinzu.
 */

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown } from 'lucide-react'

export interface Chapter {
  id: string
  label: string
}

interface SwitcherEntry {
  slug: string
  panel: string
}

interface ChapterNavProps {
  chapters: Chapter[]
  chaptersLabel: string
  /** Rueckweg — nur auf Unterseiten sinnvoll. */
  back?: { to: string; label: string }
  /** Umschalter zwischen gleichrangigen Seiten. */
  switcher?: {
    current: string
    currentSlug: string
    entries: SwitcherEntry[]
    label: string
    hrefFor: (slug: string) => string
  }
  /** Handlungsaufforderung, die sonst am Seitenende steht. */
  action?: { to: string; label: string }
}

/** Kopfhoehe der Seite; die Leiste sitzt buendig darunter. */
const TOP = 'top-[68px] lg:top-[88px]'

const ChapterNav = ({ chapters, chaptersLabel, back, switcher, action }: ChapterNavProps) => {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? '')
  const [progress, setProgress] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)

  // Aktives Kapitel: das oberste, dessen Anfang bereits ueber der Lesemarke
  // liegt. Ein IntersectionObserver auf "sichtbar" waere hier unbrauchbar —
  // einzelne Abschnitte sind laenger als der Viewport und blieben dauerhaft
  // sichtbar.
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

        // Sprungziele muessen unter Seitenkopf UND Leiste landen. Beide Hoehen
        // sind je nach Viewport verschieden — deshalb gemessen statt geraten.
        const bar = barRef.current
        const header = document.querySelector('header')
        if (bar && header) {
          const offset = Math.round(header.getBoundingClientRect().height + bar.offsetHeight + 8)
          document.documentElement.style.setProperty('--chapterbar-offset', `${offset}px`)
        }
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
  // steht die Markierung bei langen Seiten ausserhalb.
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
      ref={barRef}
      className={`sticky ${TOP} z-20 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80`}
    >
      {/* Auf schmalen Viewports bekommen die Kapitel eine eigene Zeile — zu
          dritt in einer Reihe bleibt fuer sie ein Spalt von Zentimetern. */}
      <div className="mx-auto flex max-w-page flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 lg:flex-nowrap lg:gap-4 lg:px-10 lg:py-2">
        {back ? (
          <Link
            to={back.to}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-2 text-sm font-medium text-brand-deep transition-colors hover:bg-slate-100"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{back.label}</span>
            <span className="sr-only sm:hidden">{back.label}</span>
          </Link>
        ) : null}

        {switcher ? (
          // Natives details statt Menue-Nachbau — Tastatur und Screenreader
          // koennen das ohne Zutun.
          <details className="group relative shrink-0">
            <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-300 px-3 text-sm font-semibold text-text-heading transition-colors hover:border-brand-primary">
              <span className="max-w-[9rem] truncate lg:max-w-none">{switcher.current}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-brand-primary transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
              <p className="px-4 pb-1 pt-1 text-xs font-medium text-gray-500">{switcher.label}</p>
              {switcher.entries.map((o) => (
                <Link
                  key={o.slug}
                  to={switcher.hrefFor(o.slug)}
                  aria-current={o.slug === switcher.currentSlug ? 'page' : undefined}
                  className={`block px-4 py-2.5 text-base transition-colors hover:bg-slate-50 ${
                    o.slug === switcher.currentSlug
                      ? 'font-semibold text-brand-primary'
                      : 'text-text-heading'
                  }`}
                >
                  {o.panel}
                </Link>
              ))}
            </div>
          </details>
        ) : null}

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

        {action ? (
          <Link
            to={action.to}
            className="inline-flex h-9 shrink-0 items-center rounded-full bg-accent-strong px-4 text-sm font-semibold text-white transition-colors hover:brightness-110"
          >
            {action.label}
          </Link>
        ) : null}
      </div>

      {/* Rein visuell. Als role=progressbar mit aria-valuenow, das der
          Scroll-Handler pro Bild neu setzt, meldet ein Screenreader den Wert
          ueber die gesamte Lesestrecke. */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-accent-strong transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ChapterNav
