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
 * - die Kapitel der Seite: ab lg ein waagerechter Streifen, darunter ein
 *   Aufklapper, weil ein seitlich zu wischendes Band auf dem Telefon kaum zu
 *   treffen ist
 * - eine Handlungsaufforderung, damit sie nicht erst nach 33.000 px auftaucht
 *
 * Alles sind echte Links mit href — die Seite funktioniert damit auch ohne
 * JavaScript, und Tastaturbedienung sowie "Link in neuem Tab" bleiben heil.
 * JavaScript fuegt nur die aktive Markierung, den Lesefortschritt und die
 * Staffelung der Handlungsaufforderung hinzu.
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

/**
 * Ein Ziel auf dem Aktionsplatz der Leiste. Entweder ein Router-Ziel (`to`)
 * oder ein direktes `href` — letzteres fuer Sprungmarken innerhalb der Seite
 * und fuer den PDF-Download, den der Router nicht anfassen darf.
 */
export interface NavAction {
  label: string
  to?: string
  href?: string
  /** Nur zusammen mit href sinnvoll: Datei laden statt navigieren. */
  download?: boolean
  /**
   * Messung. Der Aktionsplatz ist laut Kommentar unten "pro Seite genau eine
   * Schaltflaeche als Primaeraufforderung" — er war bis hierher der einzige
   * Anfrageweg der Strecke, der kein Ereignis meldete.
   */
  onClick?: () => void
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
  /**
   * Der Aktionsplatz. Ein Eintrag steht fest; mehrere teilen die Lesestrecke
   * in gleich grosse Abschnitte — bei dreien also 0-33 / 33-66 / 66-100 %.
   * Wer oben steht, braucht Orientierung; wer unten angekommen ist, den Weg
   * zur Anfrage. Der letzte Eintrag ist der eigentliche Anfrageweg und traegt
   * als einziger die volle Akzentfarbe, damit pro Seite genau eine Schaltflaeche
   * als Primaeraufforderung auftritt.
   */
  actions?: NavAction[]
}

/** Kopfhoehe der Seite; die Leiste sitzt buendig darunter. */
const TOP = 'top-[68px] lg:top-[88px]'

/**
 * Totzone um die Stufengrenzen, in Prozentpunkten.
 *
 * Ohne sie flackert die Aufforderung, wenn der Leser genau auf einer Grenze
 * steht — ein einziges Rad-Rasten schiebt den Wert dort hin und her.
 */
const HYSTERESE = 3

const ChapterNav = ({ chapters, chaptersLabel, back, switcher, actions }: ChapterNavProps) => {
  const [active, setActive] = useState<string>(chapters[0]?.id ?? '')
  const [stufe, setStufe] = useState(0)
  // Der Streifen versteckt seinen Scrollbalken per CSS. Ohne sichtbare Kante
  // sieht man deshalb nicht, dass rechts noch Kapitel stehen — bei siebzehn
  // Kapiteln waren bei 1440px nur fuenf im Bild.
  const [ueberlauf, setUeberlauf] = useState({ links: false, rechts: false })
  const listRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDetailsElement>(null)
  // Spiegel der beiden Zustaende plus letzte Scrollposition. Der Scroll-Handler
  // laeuft pro Bild; ohne diese Refs muesste er den React-Zustand lesen und
  // haenge damit an einem Rendering, das genau nicht stattfinden soll.
  const activeRef = useRef(active)
  const stufeRef = useRef(0)
  const lastYRef = useRef(0)

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const messen = () => {
      const rest = el.scrollWidth - el.clientWidth - el.scrollLeft
      setUeberlauf({ links: el.scrollLeft > 4, rechts: rest > 4 })
    }
    messen()
    el.addEventListener('scroll', messen, { passive: true })
    const ro = new ResizeObserver(messen)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', messen)
      ro.disconnect()
    }
  }, [chapters.length])

  // Aktives Kapitel: das oberste, dessen Anfang bereits ueber der Lesemarke
  // liegt. Ein IntersectionObserver auf "sichtbar" waere hier unbrauchbar —
  // einzelne Abschnitte sind laenger als der Viewport und blieben dauerhaft
  // sichtbar.
  const stufen = actions?.length ?? 0
  useEffect(() => {
    if (chapters.length === 0) return
    let frame = 0
    const messen = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const line = window.innerHeight * 0.35
        let current = chapters[0].id
        for (const c of chapters) {
          const el = document.getElementById(c.id)
          if (el && el.getBoundingClientRect().top <= line) current = c.id
        }
        // Nur bei echtem Wechsel in den React-Zustand. Vorher lief bei jedem
        // Bild ein setState mit demselben Wert durch.
        if (current !== activeRef.current) {
          activeRef.current = current
          setActive(current)
        }

        // Die Hoehe wird in jedem Bild neu gemessen, nie gemerkt: die
        // Wertekapitel der Musterbefunde liegen in <details>. Klappt ein Leser
        // einen auf, waechst die Seite um Tausende Pixel — eine einmal
        // notierte Hoehe waere ab da falsch, und der Balken zeigte Unsinn.
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - window.innerHeight
        const pct = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0

        // Der Fortschritt geht als CSS-Variable direkt an den Knoten. Ueber
        // useState waere das ein React-Rendering pro Bild, also sechzig in der
        // Sekunde, nur damit ein Balken zwei Pixel breiter wird.
        barRef.current?.style.setProperty('--nav-progress', `${pct.toFixed(2)}%`)

        if (stufen > 1) {
          const breite = 100 / stufen
          let next = stufeRef.current
          while (next < stufen - 1 && pct >= (next + 1) * breite + HYSTERESE) next += 1
          // Zurueck nur, wenn der Leser wirklich nach oben rollt. Klappt er
          // einen Block auf, waechst die Seite unter ihm: derselbe Punkt ist
          // dann ein kleinerer Prozentwert. Ohne diese Sperre spraenge die
          // Aufforderung im Moment des Aufklappens eine Stufe zurueck, obwohl
          // sich der Leser keinen Pixel bewegt hat.
          if (y < lastYRef.current - 1) {
            while (next > 0 && pct < next * breite - HYSTERESE) next -= 1
          }
          if (next !== stufeRef.current) {
            stufeRef.current = next
            setStufe(next)
          }
        }
        lastYRef.current = y

        // Sprungziele muessen unter Seitenkopf UND Leiste landen. Beide Hoehen
        // sind je nach Viewport verschieden — deshalb gemessen statt geraten.
        //
        const bar = barRef.current
        const header = document.querySelector('header')
        if (bar && header) {
          const offset = Math.round(header.getBoundingClientRect().height + bar.offsetHeight + 8)
          document.documentElement.style.setProperty('--chapterbar-offset', `${offset}px`)
        }
      })
    }
    messen()
    window.addEventListener('scroll', messen, { passive: true })
    window.addEventListener('resize', messen)
    // <details> meldet sein Auf und Zu ueber toggle. Das Ereignis steigt nicht
    // auf, deshalb in der Erfassungsphase am Dokument. Ohne das bliebe der
    // Balken nach dem Aufklappen bis zur naechsten Scrollbewegung falsch.
    document.addEventListener('toggle', messen, true)
    return () => {
      window.removeEventListener('scroll', messen)
      window.removeEventListener('resize', messen)
      document.removeEventListener('toggle', messen, true)
      // Ohne das behielte eine Seite ohne Kapitelleiste den Abstand der
      // vorigen - und ScrollToHash rechnete dort mit einer Leiste, die es
      // nicht gibt.
      document.documentElement.style.removeProperty('--chapterbar-offset')
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [chapters, stufen])

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

  const aktivIndex = chapters.findIndex((c) => c.id === active)
  const aktivLabel = aktivIndex >= 0 ? chapters[aktivIndex].label : (chapters[0]?.label ?? '')
  const aktion = actions && actions.length > 0 ? actions[Math.min(stufe, actions.length - 1)] : null
  const istAnfrage = !!actions && stufe >= actions.length - 1
  // Der Anfrageweg traegt die Akzentfarbe, die Wegweiser davor bleiben ruhig.
  const aktionKlasse = `inline-flex h-9 min-w-0 shrink items-center rounded-full px-4 text-sm font-semibold transition-colors lg:shrink-0 ${
    istAnfrage
      ? 'bg-accent-strong text-white hover:brightness-110'
      : 'border border-slate-300 text-brand-deep hover:border-brand-primary hover:bg-slate-50'
  }`

  /** Nach der Auswahl schliesst sich das Kapitel-Sheet wieder. */
  const sheetSchliessen = () => {
    if (sheetRef.current) sheetRef.current.open = false
  }

  return (
    <div
      ref={barRef}
      // Marke fuer ScrollToHash in App.tsx: solange eine Leiste im Dokument
      // steht, aber --chapterbar-offset noch nicht geschrieben hat, darf kein
      // Ankersprung gerechnet werden — er landete sonst hinter der Leiste.
      data-chapterbar=""
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
              {/* Sichtbar steht hier nur der Name des aktuellen Befunds. Ohne
                  Zusatz meldet ein Screenreader ihn ohne jeden Hinweis darauf,
                  dass sich dahinter die Auswahl der anderen verbirgt. */}
              <span className="sr-only">{switcher.label}: </span>
              <span className="max-w-[9rem] truncate lg:max-w-none">{switcher.current}</span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-brand-primary motion-safe:transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            <div className="absolute left-0 top-full z-30 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-lg">
              <p className="px-4 pb-1 pt-1 text-xs font-medium text-gray-600">{switcher.label}</p>
              {/* Der aktuelle Befund faellt raus — er steht schon im Ausloeser.
                  Vorher stand er hier als hervorgehobener Eintrag: ein Klick
                  darauf fuehrte auf dieselbe Seite und liess das Menue offen.
                  Die Liste am Seitenende filtert ihn ohnehin schon heraus, die
                  beiden Inventare zeigten also 6 gegen 5 unter derselben
                  Ueberschrift "weitere Musterbefunde". */}
              {switcher.entries
                .filter((o) => o.slug !== switcher.currentSlug)
                .map((o) => (
                  <Link
                    key={o.slug}
                    to={switcher.hrefFor(o.slug)}
                    className="block px-4 py-2.5 text-base text-text-heading transition-colors hover:bg-slate-50"
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
          {/* Unter lg: ein Aufklapper ueber die volle Breite.
              Der waagerechte Streifen war hier kaum bedienbar — dreissig
              Zeichen breite Kapitelnamen in einem 360px-Fenster heisst, dass
              zwei Kapitel sichtbar sind und der Rest nur durch seitliches
              Wischen kommt, quer zur Leserichtung der Seite. Der Aufklapper
              zeigt stattdessen alle Kapitel untereinander, jedes mit voller
              Zeilenhoehe als Ziel. Wieder ein natives <details>: ohne
              JavaScript aufklappbar, tastaturbedienbar, ohne ARIA-Nachbau. */}
          <details ref={sheetRef} className="group lg:hidden">
            <summary className="flex h-11 cursor-pointer list-none items-center gap-2 rounded-full border border-slate-300 px-4 text-sm text-brand-deep [&::-webkit-details-marker]:hidden">
              <span className="shrink-0 font-semibold">{chaptersLabel}</span>
              <span className="min-w-0 flex-1 truncate text-left text-gray-600">{aktivLabel}</span>
              {chapters.length > 0 ? (
                <span className="shrink-0 text-xs font-medium tabular-nums text-gray-600">
                  {Math.max(aktivIndex, 0) + 1}/{chapters.length}
                </span>
              ) : null}
              <ChevronDown
                className="h-4 w-4 shrink-0 text-brand-primary motion-safe:transition-transform group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>
            {/* Absolut ueber dem Inhalt statt in der Leiste: sonst waechst die
                Leiste beim Aufklappen auf halbe Bildschirmhoehe und schoebe
                den Text weg, den der Leser gerade liest. */}
            <ul className="absolute inset-x-0 top-full z-30 max-h-[60vh] list-none overflow-y-auto border-b border-slate-200 bg-white p-2 shadow-lg">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={sheetSchliessen}
                    aria-current={active === c.id ? 'true' : undefined}
                    className={`flex min-h-[44px] items-center rounded-xl px-4 py-2 text-base ${
                      active === c.id
                        ? 'bg-brand-deep font-semibold text-white'
                        : 'text-text-heading hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>

          {/* Ab lg: der waagerechte Streifen. Hier passen sieben bis neun
              Kapitel ins Bild, und der Zeiger findet sie ohne Umweg. */}
          <div className="relative hidden lg:block">
            {ueberlauf.links ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-white to-transparent"
              />
            ) : null}
            {ueberlauf.rechts ? (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-white to-transparent"
              />
            ) : null}
            <div
              ref={listRef}
              className="flex gap-1 overflow-x-auto [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
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
          </div>
        </nav>

        {/* Der Aktionsplatz. Was hier steht, haengt an der Lesetiefe — siehe
            `actions`. Es bleibt eine einzige Schaltflaeche an einer festen
            Stelle; sie wechselt nur ihre Beschriftung und ihr Ziel. */}
        {aktion ? (
          aktion.to ? (
            <Link to={aktion.to} onClick={aktion.onClick} className={aktionKlasse}>
              {/* Eigener Knoten: text-overflow greift nicht auf einem
                  Flex-Container, die Beschriftung wuerde auf schmalen
                  Viewports hart abgeschnitten statt ausgelassen. */}
              <span className="truncate">{aktion.label}</span>
            </Link>
          ) : (
            <a
              href={aktion.href}
              download={aktion.download}
              onClick={aktion.onClick}
              className={aktionKlasse}
            >
              <span className="truncate">{aktion.label}</span>
            </a>
          )
        ) : null}
      </div>

      {/* Rein visuell. Als role=progressbar mit aria-valuenow, das der
          Scroll-Handler pro Bild neu setzt, meldet ein Screenreader den Wert
          ueber die gesamte Lesestrecke. Die Breite kommt aus --nav-progress,
          das der Handler direkt am Knoten setzt — ohne Uebergang, weil ein
          Uebergang bei sechzig Aktualisierungen je Sekunde ohnehin nie
          ankaeme und nur nachliefe. */}
      <div
        aria-hidden="true"
        className="h-0.5 bg-accent-strong"
        style={{ width: 'var(--nav-progress, 0%)' }}
      />
    </div>
  )
}

export default ChapterNav
