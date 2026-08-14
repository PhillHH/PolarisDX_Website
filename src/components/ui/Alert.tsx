import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

const alertVariants = cva('relative w-full rounded-lg border p-4 flex gap-3 items-start', {
  variants: {
    variant: {
      default: 'bg-gray-50 border-gray-200 text-gray-800',
      destructive: 'bg-red-50 border-red-200 text-red-800',
      success: 'bg-success-soft border-success/30 text-success-strong',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
  title?: string
  children?: React.ReactNode
}

/**
 * `role` und `tabIndex` kommen bewusst von aussen: erst die Aufrufstelle weiss,
 * ob eine Meldung eine Bestaetigung (`role="status"`) oder ein Fehler
 * (`role="alert"`) ist. Der weitergereichte `ref` macht die Meldung
 * ansteuerbar, damit der Fokus nach dem Absenden gezielt dort landen kann.
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, children, ...props }, ref) => {
    const Icon = variant === 'success' ? CheckCircle : AlertCircle

    return (
      <div ref={ref} className={cn(alertVariants({ variant }), className)} {...props}>
        <Icon className="h-5 w-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>
      </div>
    )
  },
)
Alert.displayName = 'Alert'
