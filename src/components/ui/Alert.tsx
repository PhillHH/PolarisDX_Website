import { cva, type VariantProps } from 'class-variance-authority'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import React from 'react'

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 flex gap-3 items-start",
  {
    variants: {
      variant: {
        default: "bg-gray-50 border-gray-200 text-gray-800",
        destructive: "bg-red-50 border-red-200 text-red-800",
        success: "bg-green-50 border-green-200 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
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
