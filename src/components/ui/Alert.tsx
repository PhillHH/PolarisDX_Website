import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

const alertVariants = cva('relative w-full rounded-lg border p-4 flex gap-3 items-start', {
  variants: {
    variant: {
      default: 'bg-surface-overlay border-line text-ink',
      destructive: 'bg-red-950/40 border-red-800/50 text-red-200',
      success: 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200',
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

export const Alert = ({ className, variant, title, children, ...props }: AlertProps) => {
  const Icon = variant === 'success' ? CheckCircle : AlertCircle

  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1">
        {title && <h5 className="mb-1 font-medium leading-none tracking-tight">{title}</h5>}
        {children && <div className="text-sm opacity-90">{children}</div>}
      </div>
    </div>
  )
}
