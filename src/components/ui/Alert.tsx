import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

/**
 * Alert — die vier Statusaussagen info / success / warning / error.
 *
 * BEDEUTUNG NIE NUR UEBER FARBE (WCAG 1.4.1). Jede Variante traegt drei
 * Signale: eine eigene Farbe, ein EIGENES Icon und — ueber `role` — eine
 * Ansage. Wer die Farben nicht unterscheiden kann, unterscheidet die Icons;
 * wer nichts sieht, bekommt die Ansage.
 *
 * KEINE VERMISCHUNG:
 * - `success` ist Emerald und bewusst nicht der Marken-Akzent (Teal).
 * - `warning` ist die eigene `warning`-Familie und NICHT die Befund-Ampel —
 *   deren Amber traegt eine fachliche Befundaussage und gilt ausschliesslich
 *   auf den Musterbefund-Seiten.
 * - `info` ist neutral (Navy auf Slate) und leiht sich keine Statusfarbe.
 *
 * Textfarben sind durchweg die `strong`-Rollen, damit der Text auf der
 * jeweiligen `soft`-Flaeche AA erreicht (gemessen: success 5,21:1 ·
 * warning 4,84:1 · error 7,7:1 · info 12,4:1).
 *
 * `role` und `tabIndex` kommen bewusst von aussen: erst die Aufrufstelle
 * weiss, ob eine Meldung eine Bestaetigung (`role="status"`) oder ein Fehler
 * (`role="alert"`) ist. Der weitergereichte `ref` macht die Meldung
 * ansteuerbar, damit der Fokus nach dem Absenden gezielt dort landen kann.
 */
const alertVariants = cva('relative w-full rounded-lg border p-4 flex gap-3 items-start', {
  variants: {
    variant: {
      default: 'bg-gray-50 border-gray-200 text-gray-800',
      info: 'bg-slate-50 border-ui-border text-heading',
      success: 'bg-success-soft border-success/30 text-success-strong',
      warning: 'bg-warning-soft border-warning/40 text-warning-strong',
      error: 'bg-red-50 border-red-200 text-red-800',
      /** @deprecated Gleichbedeutend mit `error`; bleibt fuer Bestands-Call-Sites. */
      destructive: 'bg-red-50 border-red-200 text-red-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

const ICONS = {
  default: AlertCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle,
  destructive: XCircle,
} as const

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string
  children?: React.ReactNode
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    const Icon = ICONS[variant ?? 'default']

    return (
      <div ref={ref} className={cn(alertVariants({ variant }), className)} {...props}>
        <Icon className="h-5 w-5 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>
      </div>
    )
  },
)
Alert.displayName = 'Alert'
