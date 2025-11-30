type SectionHeaderProps = {
  id?: string // Optionale ID für Anker
  caption: string // Kleiner Über-Titel (Kicker/Badge)
  title: string // Haupt-Überschrift
  align?: 'left' | 'center' // Textausrichtung (Standard: center)
  titleClassName?: string // Zusätzliche Klassen für den Titel
  className?: string // Zusätzliche Klassen für den Container
}

/**
 * SectionHeader Komponente.
 * Standardisierte Überschrift für Seitenabschnitte.
 * Besteht aus einem kleinen Kicker (Caption) mit Gradient-Border und einer großen Hauptüberschrift.
 */
const SectionHeader = ({
  id,
  caption,
  title,
  align = 'center',
  titleClassName,
  className = '',
}: SectionHeaderProps) => {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div id={id} className={`flex flex-col gap-2 ${alignment} ${className}`}>
      {/* Caption mit Gradient-Border-Effekt */}
      <div className="inline-block rounded p-[1px] bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
        <div className="rounded-sm bg-slate-50 px-3 py-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-900">
            {caption}
          </span>
        </div>
      </div>

      {/* Haupttitel */}
      <h2
        className={`text-[40px] leading-[47px] font-medium tracking-tight lg:text-[44px] lg:leading-[52px] ${
          titleClassName || 'text-gray-900'
        }`}
      >
        {title}
      </h2>
    </div>
  )
}

export default SectionHeader
