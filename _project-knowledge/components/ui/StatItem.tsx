type Size = 'md' | 'sm'

type StatItemProps = {
  value: string
  suffix?: string
  label: string
  size?: Size
  className?: string
}

const sizeStyles: Record<Size, { value: string; suffix: string; label: string }> = {
  md: {
    value: 'text-3xl font-medium tracking-tight text-white sm:text-4xl',
    suffix: 'text-xl font-medium text-brand-secondary',
    label: 'text-xs font-normal text-white/80 sm:text-sm',
  },
  sm: {
    value: 'text-2xl font-medium tracking-tight text-white sm:text-3xl',
    suffix: 'text-lg font-medium text-brand-secondary',
    label: 'text-xxs font-normal text-white/80 sm:text-xs',
  },
}

const StatItem = ({ value, suffix, label, size = 'md', className = '' }: StatItemProps) => {
  const styles = sizeStyles[size]

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-baseline gap-1">
        <span className={styles.value}>
          {value}
        </span>
        {suffix && (
          <span className={styles.suffix}>
            {suffix}
          </span>
        )}
      </div>
      <p className={styles.label}>{label}</p>
    </div>
  )
}

export default StatItem
