import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { fill } from '../../content/articles/was-ist-epigenetik'

/**
 * SC-033 (Owner 2026-11-19, Entwurf „Geführt": „die Elemente sollten viel mehr selbsterklärend
 * sein"): Jeder Baustein führt Schritt für Schritt. Der nächste Handgriff steht in der Hinweiszeile
 * und ist am Baustein markiert; ist er getan, zeigt die Zeile auf das Ergebnis, „Weiter" bringt den
 * nächsten Handgriff, am Ende steht der Merksatz.
 */

/** Ein Handgriff: welches Bedienelement markiert wird und wo danach etwas zu sehen ist. */
export type CoachStep = {
  /** Bedienelement, das markiert wird (Selektor innerhalb des Bausteins). */
  target: string
  /** Bereich, in dem sich danach etwas verändert. */
  watch?: string
  /** Schieberegler: Das Schildchen sagt „Hier ziehen" statt „Hier tippen". */
  drag?: boolean
  /** Wo das Schildchen sitzt, wenn es über dem Bedienelement etwas verdecken würde. */
  tag?: 'below' | 'right'
}

/** `do`: Handgriff steht an · `see`: Ergebnis ansehen · `learn`: Merksatz, frei weiterprobieren. */
export type CoachPhase = 'do' | 'see' | 'learn'
export type CoachTag = { x: number; y: number; place: 'above' | 'below' | 'right' }
/** Erklärtexte eines Bausteins: was er zeigt, die Handgriffe, der Merksatz. */
export type GuideTexts = { shows: string; steps: string[]; learn: string }

/** Setzt je Handgriff die echten Beschriftungen der Bedienelemente in den Anleitungstext ein. */
export const withLabels = (
  guide: GuideTexts,
  ...labels: Array<Record<string, string | number>>
): GuideTexts => ({
  ...guide,
  steps: guide.steps.map((text, index) => fill(text, labels[index] ?? {})),
})

/**
 * „Noch einmal von vorn": Der Rahmen (`CoachHost` in widgetParts) setzt den Baustein neu auf.
 * `run` zählt die Neustarts — ab dem ersten holt sich der neue Baustein den Fokus.
 */
export const CoachRestart = createContext<{ run: number; restart: () => void }>({
  run: 0,
  restart: () => {},
})

const FOCUSABLE = 'button, input, a[href], [tabindex]'
/** Abstand des Schildchens zum Rand des Bausteins. */
const EDGE = 8

/**
 * Führung eines Bausteins. Der Baustein meldet über `done`, welche Handgriffe erledigt sind (aus
 * seinem eigenen Zustand — gleich, ob getippt, gezogen oder die Tastatur benutzt wurde). Markiert
 * wird über Selektoren am fertigen Baustein.
 */
export const useCoach = (
  rootRef: RefObject<HTMLDivElement | null>,
  tagRef: RefObject<HTMLSpanElement | null>,
  steps: readonly CoachStep[],
  done: readonly boolean[],
) => {
  const { run, restart } = useContext(CoachRestart)
  const [phase, setPhase] = useState<CoachPhase>('do')
  const [index, setIndex] = useState(0)
  const [tag, setTag] = useState<CoachTag | null>(null)
  const placeRef = useRef(() => {})
  /** Nach „Weiter" und nach dem Neustart geht der Fokus zum nächsten Bedienelement. */
  const moveFocus = useRef(run > 0)
  const step = steps[Math.min(index, steps.length - 1)]
  const reached = done[index] === true

  // Der Baustein meldet den Handgriff als erledigt: Die Zeile wechselt zum Ergebnis (Anpassung
  // des Zustands beim Zeichnen — bleibt bestehen, auch wenn der Handgriff zurückgenommen wird).
  if (phase === 'do' && reached) setPhase('see')

  // Markierungen und Schildchen. Läuft nach jedem Zeichnen: React setzt `className` an den
  // Bedienelementen bei jeder Zustandsänderung neu, und das Schildchen folgt dem Layout.
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    const marked: Array<[Element, string]> = []
    const mark = (selector: string | undefined, name: string) => {
      const element = selector ? root.querySelector(selector) : null
      if (!element) return null
      element.classList.add(name)
      marked.push([element, name])
      return element
    }
    const target = phase === 'do' ? mark(step.target, 'is-coach') : null
    if (phase === 'see') mark(step.watch, 'is-watch')

    const place = () => {
      let next: CoachTag | null = null
      if (target?.isConnected) {
        const outer = root.getBoundingClientRect()
        const box = target.getBoundingClientRect()
        const top = box.top - outer.top
        // Breite des Schildchens: Übersetzungen sind länger als „Hier tippen".
        const width = tagRef.current?.offsetWidth ?? 112
        const fitsRight = box.right - outer.left + 14 + width <= outer.width - EDGE
        if (step.tag === 'right' && fitsRight) {
          next = { x: box.right - outer.left, y: top + box.height / 2, place: 'right' }
        } else {
          const half = width / 2 + EDGE
          const x = Math.max(
            half,
            Math.min(outer.width - half, box.left - outer.left + box.width / 2),
          )
          next =
            step.tag === 'below' || top < 46
              ? { x, y: box.bottom - outer.top, place: 'below' }
              : { x, y: top, place: 'above' }
        }
      }
      setTag((current) => {
        if (!next || !current) return next
        const same =
          current.place === next.place &&
          Math.abs(current.x - next.x) < 0.5 &&
          Math.abs(current.y - next.y) < 0.5
        return same ? current : next
      })
    }
    placeRef.current = place
    place()
    return () => marked.forEach(([element, name]) => element.classList.remove(name))
  })

  // Ändert der Baustein seine Größe (Drehen des Telefons, Umbruch), rückt das Schildchen nach.
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => placeRef.current())
    observer.observe(root)
    return () => observer.disconnect()
  }, [rootRef])

  // Tastatur und Vorleseprogramm: Der Knopf „Weiter" verschwindet beim Drücken — der Fokus geht
  // zum nächsten Bedienelement, am Ende zum Knopf „Noch einmal von vorn".
  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    const found = rootRef.current?.querySelector(
      phase === 'learn' ? '.xp-coach-a button' : step.target,
    )
    const to = found?.matches(FOCUSABLE) ? found : found?.querySelector(FOCUSABLE)
    ;(to as HTMLElement | SVGElement | null | undefined)?.focus()
  }, [phase, index, step.target, rootRef])

  const next = useCallback(() => {
    moveFocus.current = true
    if (index + 1 < steps.length) {
      setIndex(index + 1)
      setPhase('do')
    } else setPhase('learn')
  }, [index, steps.length])

  return { phase, index, step, tag, next, restart }
}
