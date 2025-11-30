type StatItemProps = {
  value: string // Der Hauptwert der Statistik (z.B. "48h")
  suffix?: string // Optionales Suffix (z.B. "%", "Min")
  label: string // Beschriftung unter dem Wert
}

/**
 * StatItem Komponente.
 * Zeigt eine einzelne Statistik an, bestehend aus einem großen Wert und einem Label.
 * Wird typischerweise im Hero-Bereich oder in "Über Uns"-Sektionen verwendet.
 */
const StatItem = ({ value, suffix, label }: StatItemProps) => {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline gap-1">
        {/* Hauptwert in großer Schrift */}
        <span className="text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {value}
        </span>
        {/* Optionales Suffix, farblich abgehoben */}
        {suffix && (
          <span className="text-2xl font-medium text-secondary">
            {suffix}
          </span>
        )}
      </div>
      {/* Label/Beschreibung */}
      <p className="text-sm font-normal text-white/80">{label}</p>
    </div>
  )
}

export default StatItem
