import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const inputVariants = cva(
  'flex w-full rounded-md border border-ui-border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ui-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-ui-border text-gray-900',
        error: 'border-red-500 text-red-900 focus-visible:ring-red-500',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-8 px-2 text-xs',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: {
      state: 'default',
      size: 'default',
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  error?: string | boolean
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, state, size, type, label, error, helperText, leftIcon, rightIcon, id, disabled, ...props },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id || generatedId
    const helperId = helperText ? `${inputId}-helper` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    // Determine state based on error prop if not explicitly set
    const finalState = error ? 'error' : (state || 'default')

    return (
      <div className={cn("grid w-full gap-1.5", disabled && "opacity-50 cursor-not-allowed")}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium leading-none text-gray-900",
               disabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              inputVariants({ state: finalState, size, className }),
              leftIcon && "pl-10",
              rightIcon && "pr-10"
            )}
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={helperId || errorId ? cn(helperId, errorId) : undefined}
            aria-invalid={!!error}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

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
Input.displayName = 'Input'

export { Input, inputVariants }
