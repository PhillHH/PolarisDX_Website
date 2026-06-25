import { Eyebrow } from '../core/eyebrow'
import { cn } from '../../lib/utils'

/**
 * SectionHeader — Molecule (§Phase 2.3).
 *
 * Komponiert das `Eyebrow`-Atom mit der Abschnitts-Headline (`<h2>`) zu einer
 * funktionalen Einheit (Single Responsibility). Single Source of Truth fuer den
 * Abschnitts-Kopf (Holy Grail §Phase 7.8) — App und Pattern-Library teilen diese
 * eine Definition.
 *
 * Token-rein (§1.7): der Default-Titel zieht Groesse/Line-Height/Farbe/Gap aus
 * `--section-header-*` bzw. `--eyebrow-*` — kein Roh-Hex, kein arbitrary-px in
 * der Komponente selbst. `titleClassName` bleibt als bewusster Escape-Hatch
 * (wie `className`) erhalten, damit die bestehenden Call-Sites byte-stabil
 * bleiben (§1.6) — Roh-Optik dort ist Sache der spaeteren Sektions-Migration.
 */
export interface SectionHeaderProps {
  id?: string
  /** Eyebrow-Text (Section-Label). */
  caption: string
  /** Abschnitts-Headline (rendert als `<h2>`). */
  title: string
  align?: 'left' | 'center'
  /** Optionaler Klassen-Override fuer den Titel (ersetzt den Default-Stil). */
  titleClassName?: string
  className?: string
}

const DEFAULT_TITLE =
  'text-[length:var(--section-header-title-size)] ' +
  'leading-[var(--section-header-title-leading)] font-medium tracking-tight ' +
  'text-[var(--section-header-title-color)]'

export function SectionHeader({
  id,
  caption,
  title,
  align = 'center',
  titleClassName,
  className,
}: SectionHeaderProps) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <div
      id={id}
      className={cn('flex flex-col gap-[var(--section-header-gap)]', alignment, className)}
    >
      <Eyebrow>{caption}</Eyebrow>
      <h2 className={titleClassName || DEFAULT_TITLE}>{title}</h2>
    </div>
  )
}
SectionHeader.displayName = 'SectionHeader'
