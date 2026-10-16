interface RevealProps {
  children: React.ReactNode
  width?: 'fit-content' | '100%'
  className?: string
  /** Historisch (JS-Stagger). Der Eintritt folgt seit SC-006 der Scrollposition; Wert wird angenommen und ignoriert. */
  delay?: number
  /** Historisch. Siehe `delay`. */
  duration?: number
  /** Historisch. Siehe `delay`. */
  yOffset?: number
}

/**
 * Stagger-Schritt (Sekunden) zwischen Geschwistern einer Gruppe — aus Kompatibilitaet
 * exportiert; seit SC-006 staffelt die Scrollposition selbst (jedes Element tritt ein,
 * sobald es den unteren Rand ueberschreitet).
 */
export const REVEAL_STAGGER = 0.06

/**
 * Reveal — Eintritt beim Hineinscrollen, seit SC-006 (2026-10-16) reines CSS.
 *
 * Vorher: IntersectionObserver + Inline-Transition in JavaScript (eigener Chunk fuer
 * jede Route ohne Startseite, ~0,6 KB gzip je Route — gemessen im Perf-Budget, als die
 * Startseite ihre Huellen abgab). Jetzt: die Klasse `rv` aus `src/index.css`
 * (`animation-timeline: view()`, hinter `@supports` und `prefers-reduced-motion:
 * no-preference`) — dieselbe Bewegung wie auf der Startseite, ohne JavaScript.
 *
 * SEO/SSR: der Inhalt steht immer vollstaendig im DOM; ohne Scroll-Timeline, ohne
 * JavaScript und bei Bewegungsreduktion ist er sofort sichtbar. `width` bleibt als
 * Layout-Eigenschaft der Huelle erhalten (fit-content vs. 100 %).
 */
const Reveal = ({ children, width = 'fit-content', className = '' }: RevealProps) => (
  <div style={{ width }} className={className}>
    <div className="rv">{children}</div>
  </div>
)

export default Reveal
