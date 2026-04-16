import { type ReactNode, type ElementType } from 'react'
import { cn } from '../../lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  as?: ElementType
}

const PageContainer = ({
  children,
  className,
  as: Component = 'div'
}: PageContainerProps) => {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Component>
  )
}

export default PageContainer
