/**
 * routing/ErrorBoundary.tsx — generische React-Fehlergrenze (Phase 5 §5.9).
 *
 * Hinweis zur Architektur: Diese App rendert über `<Routes>`/`<Route>` mit
 * Static-/BrowserRouter (SSR via renderToString), NICHT über einen RR7-
 * Data-Router (`createBrowserRouter`). Damit steht `route.errorElement` /
 * `useRouteError` NICHT zur Verfügung — ein Wechsel hieße, den kompletten
 * SSR-Renderpfad (entry-server/entry-client + Helmet + i18n) umzubauen.
 * Stattdessen liefern klassische Error-Boundaries dieselbe Garantie:
 * pro Segment isoliertes Auffangen von Render-Fehlern + Klartext-Fallback.
 *
 * ASSUMPTION — needs human confirmation (§1.17): Klassen-Boundaries statt
 * RR7-Data-Router-`errorElement`. Bewusst gewählt, um den bewährten SSR-Pfad
 * nicht zu destabilisieren; Migration auf den Data-Router bleibt optional.
 *
 * (Fehlergrenzen MÜSSEN Klassenkomponenten sein — React bietet keinen Hook.)
 */

import { Component, type ErrorInfo, type ReactNode } from 'react'
import { reportError } from '../lib/monitoring'

export interface ErrorBoundaryProps {
  /** Eindeutiger Name fürs Monitoring, z. B. 'root' | 'segment:articles'. */
  readonly boundary: string
  /** Render-Funktion für den Fehlerzustand (Klartext, kein Stacktrace). */
  readonly fallback: (reset: () => void) => ReactNode
  readonly children: ReactNode
}

interface ErrorBoundaryState {
  readonly hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Details (Stacktrace) gehen NUR ans serverseitige Monitoring,
    // nie in die UI (§5.10).
    reportError(error, {
      boundary: this.props.boundary,
      componentStack: info.componentStack ?? undefined,
    })
  }

  reset = (): void => {
    this.setState({ hasError: false })
  }

  render(): ReactNode {
    if (this.state.hasError) return this.props.fallback(this.reset)
    return this.props.children
  }
}
