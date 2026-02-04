import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-ui-border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-ui-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-ui-border text-gray-900',
        error: 'border-red-500 text-red-900 focus-visible:ring-red-500',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string
  error?: string | boolean
  helperText?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, state, label, error, helperText, id, disabled, ...props }, ref) => {
    const generatedId = React.useId()
    const textareaId = id || generatedId
    const helperId = helperText ? `${textareaId}-helper` : undefined
    const errorId = error ? `${textareaId}-error` : undefined

    const finalState = error ? 'error' : (state || 'default')

    return (
      <div className={cn("grid w-full gap-1.5", disabled && "opacity-50 cursor-not-allowed")}>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "text-sm font-medium leading-none text-gray-900",
              disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}

        <textarea
          className={cn(textareaVariants({ state: finalState, className }))}
          ref={ref}
          id={textareaId}
          disabled={disabled}
          aria-describedby={helperId || errorId ? cn(helperId, errorId) : undefined}
          aria-invalid={!!error}
          {...props}
        />

        {error && typeof error === 'string' && (
          <p id={errorId} className="text-sm font-medium text-red-500">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={helperId} className="text-sm text-ui-text-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
