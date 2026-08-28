import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const spinnerVariants = cva('animate-spin text-brand-primary', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface LoadingSpinnerProps
  extends VariantProps<typeof spinnerVariants>, React.SVGAttributes<SVGSVGElement> {
  className?: string
}

/**
 * Reiner Spinner ohne eigene Ansage. Ein Spinner ist ein Bild, kein Text —
 * die Ansage macht die Huelle (`LoadingState` in `StateBlock.tsx`) ueber
 * `role="status"`. Wer ihn einzeln einsetzt, gibt ihm entweder ein
 * `aria-label` oder daneben sichtbaren Text; ohne beides bleibt er fuer
 * Screenreader stumm — und genau das ist hier der richtige Standard,
 * weil sonst jede Seite ein doppeltes „Wird geladen" ansagt.
 *
 * `motion-reduce:animate-none` respektiert die Bewegungsreduktion; das
 * globale Sicherheitsnetz in `src/index.css` greift zusaetzlich.
 */
export const LoadingSpinner = ({ className, size, ...props }: LoadingSpinnerProps) => {
  return (
    <Loader2
      className={cn(spinnerVariants({ size, className }), 'motion-reduce:animate-none')}
      {...props}
    />
  )
}
