type StatItemProps = {
  value: string
  suffix?: string
  label: string
}

const StatItem = ({ value, suffix, label }: StatItemProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {value}
        </span>
        {suffix && (
          <span className="text-2xl font-medium text-secondary">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-sm font-normal text-white/80">{label}</p>
    </div>
  )
}

export default StatItem


