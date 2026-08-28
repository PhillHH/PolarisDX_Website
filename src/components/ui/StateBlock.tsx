import * as React from 'react'
import { AlertTriangle, Inbox, RotateCw } from 'lucide-react'
import { cn } from '../../lib/utils'
import { LoadingSpinner } from './LoadingSpinner'

/**
 * Die drei Zustaende, die jede datengetriebene Flaeche braucht: laedt,
 * ist leer, ist kaputt.
 *
 * Sie liegen bewusst zusammen, weil sie dieselbe Buehne teilen (zentriert,
 * gleiche Abstaende, gleiche Typo-Rollen) und sich nur in Absicht und
 * Ansage unterscheiden:
 *
 *  - LOADING  `role="status"` + `aria-live="polite"` — der Screenreader sagt
 *    an, dass gearbeitet wird, ohne den Nutzer zu unterbrechen.
 *  - EMPTY    keine Live-Region. Leer ist kein Ereignis, sondern ein Inhalt.
 *  - ERROR    `role="alert"` — unterbricht bewusst, weil etwas schiefging.
 *
 * ABGRENZUNG: Hier steckt keinerlei Route-, Fetch- oder Fehlerklassenlogik.
 * Was ein erholbarer Fehler ist, wann neu geladen wird und was ein harter
 * 404 ist, entscheiden die spaeteren APs (AP10 Status-Semantik, AP22
 * Lead-Pfad). Diese Datei liefert nur die Darstellung und die Ansage.
 */

const shell = 'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center'

export type LoadingStateProps = {
  /** Sichtbare und angesagte Beschriftung. */
  label: string
  /** Beschriftung nur fuer Screenreader zeigen. */
  hideLabel?: boolean
  className?: string
}

export const LoadingState = ({ label, hideLabel = false, className }: LoadingStateProps) => (
  <div role="status" aria-live="polite" className={cn(shell, className)}>
    <LoadingSpinner aria-hidden="true" />
    <span className={hideLabel ? 'sr-only' : 't-small'}>{label}</span>
  </div>
)

export type EmptyStateProps = {
  title: string
  description?: string
  /** Optionale Handlung, z. B. „Filter zuruecksetzen". */
  action?: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

export const EmptyState = ({ title, description, action, icon, className }: EmptyStateProps) => (
  <div className={cn(shell, className)}>
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent-strong">
      {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
    </span>
    <h3 className="t-h3">{title}</h3>
    {description && <p className="t-small max-w-[46ch]">{description}</p>}
    {action}
  </div>
)

export type ErrorStateProps = {
  title: string
  description?: string
  /**
   * Gesetzt = erholbarer Fehler: es erscheint ein Wiederholen-Knopf.
   * Nicht gesetzt = nicht erholbar; dann traegt `action` den Ausweg
   * (z. B. ein Link zurueck zur Startseite).
   */
  onRetry?: () => void
  retryLabel?: string
  action?: React.ReactNode
  className?: string
}

export const ErrorState = ({
  title,
  description,
  onRetry,
  retryLabel = 'Erneut versuchen',
  action,
  className,
}: ErrorStateProps) => (
  <div role="alert" className={cn(shell, className)}>
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
      <AlertTriangle className="h-5 w-5" aria-hidden="true" />
    </span>
    <h3 className="t-h3">{title}</h3>
    {description && <p className="t-small max-w-[46ch]">{description}</p>}
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-brand-deep px-5 py-3 text-sm font-medium text-white transition hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
      >
        <RotateCw className="h-4 w-4" aria-hidden="true" />
        {retryLabel}
      </button>
    )}
    {action}
  </div>
)

export type SkeletonProps = {
  className?: string
  /** Screenreader ignorieren Platzhalter — die Ansage macht `LoadingState`. */
  count?: number
}

export const Skeleton = ({ className, count = 1 }: SkeletonProps) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        aria-hidden="true"
        className={cn('animate-pulse rounded-md bg-gray-100 motion-reduce:animate-none', className)}
      />
    ))}
  </>
)
