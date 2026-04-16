import { Loader2 } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const spinnerVariants = cva(
  "animate-spin text-brand-primary",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface LoadingSpinnerProps
  extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export const LoadingSpinner = ({ className, size }: LoadingSpinnerProps) => {
  return (
    <Loader2 className={cn(spinnerVariants({ size, className }))} />
  )
}
