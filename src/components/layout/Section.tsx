import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

/**
 * Section / Container / CardGrid — das Layoutgeruest der Sales-Machine.
 *
 * Die Werte sind aus dem Bestand GEMESSEN, nicht neu gesetzt: die
 * Containerbreite ist `max-w-container` (1200px), die Gutter sind `px-4` und
 * fallen ab `lg` weg (`lg:px-0`), und der vertikale Rhythmus ist in genau
 * drei Stufen unterwegs — `py-16 lg:py-24` (dominant, 12x), `py-24` (7x) und
 * `py-12 lg:py-16` (3x). Genau diese drei sind hier `default`, `lg`
 * und `compact`. Es kommt keine vierte Stufe dazu.
 *
 * CONTAINED vs FULL-BLEED ist die Trennung, die diese beiden Bausteine
 * ueberhaupt rechtfertigt:
 *   `Section`   traegt die FLAECHE (Hintergrund, dunkle Baender) und geht
 *               immer ueber die volle Breite;
 *   `Container` traegt den INHALT und ist immer eingerueckt.
 * Ein Hintergrund gehoert nie an den Container, sonst endet die Flaeche an
 * 1200px und die Sektion zerfaellt auf breiten Schirmen.
 *
 * `surface="navy"` ist eine dunkle Flaeche im Light Theme, kein Dark Mode
 * (DESIGN-SYSTEM-CONTRACT §2). Auf ihr gilt `accent.on-dark`.
 */

const sectionVariants = cva('', {
  variants: {
    surface: {
      /** Standardflaeche. */
      white: 'bg-white',
      /** Ruhige Absetzung zwischen zwei weissen Sektionen. */
      soft: 'bg-slate-50',
      /** Navy-Kontrastband: Hero, Final-CTA, Beweisstrecken. */
      navy: 'relative overflow-hidden bg-brand-deep text-white',
      /** Erbt die Flaeche des Elternelements. */
      none: '',
    },
  },
  defaultVariants: { surface: 'white' },
})

const containerVariants = cva('mx-auto max-w-container px-4 lg:px-0', {
  variants: {
    rhythm: {
      /** Dominanter Sektionsrhythmus. */
      default: 'py-16 lg:py-24',
      /** Grosse Sektionen, Hero-nahe Bloecke. */
      lg: 'py-24',
      /** Dichte Sektionen, Zwischenbaender. */
      compact: 'py-12 lg:py-16',
      /** Kein vertikaler Rhythmus — der Aufrufer setzt ihn selbst. */
      none: '',
    },
  },
  defaultVariants: { rhythm: 'default' },
})

export type SectionProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof sectionVariants> & {
    /**
     * Anker fuer die Kapitelnavigation. Setzt zusaetzlich `scroll-mt-28`,
     * damit die Sticky-Leiste die Ueberschrift beim Sprung nicht verdeckt —
     * siehe ChapterNav-Vertrag im DESIGN-SYSTEM-CONTRACT §6.5.
     */
    anchorId?: string
    as?: 'section' | 'div' | 'article' | 'aside'
  }

export const Section = ({
  className,
  surface,
  anchorId,
  as: Tag = 'section',
  children,
  ...props
}: SectionProps) => (
  <Tag
    {...(anchorId ? { id: anchorId } : {})}
    className={cn(sectionVariants({ surface }), anchorId && 'scroll-mt-28', className)}
    {...props}
  >
    {children}
  </Tag>
)

export type ContainerProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof containerVariants>

export const Container = ({ className, rhythm, children, ...props }: ContainerProps) => (
  <div className={cn(containerVariants({ rhythm }), className)} {...props}>
    {children}
  </div>
)

/**
 * CardGrid — die Spaltenkonventionen der Sales-Machine.
 *
 * Mobil ist IMMER eine Spalte; das ist keine Option, sondern die Grundlage
 * dafuer, dass Karten auf 360px lesbar bleiben. `gap-8` ist der Regelabstand
 * (dominant im Bestand), `gap-6` die dichte Variante.
 *
 * `equalHeight` streckt die Karten einer Reihe auf gleiche Hoehe. Das ist nur
 * sinnvoll, wenn die Karten eine gemeinsame Grundlinie brauchen (z. B. ein
 * CTA am unteren Rand). `Card` bringt dafuer bereits `h-full flex-col` mit —
 * die Kombination `equalHeight` + `Card` ist der Normalfall.
 */
const cardGridVariants = cva('grid', {
  variants: {
    columns: {
      2: 'sm:grid-cols-2',
      3: 'md:grid-cols-2 lg:grid-cols-3',
      4: 'sm:grid-cols-2 lg:grid-cols-4',
    },
    gap: {
      default: 'gap-8',
      sm: 'gap-6',
    },
    equalHeight: {
      true: 'items-stretch',
      false: '',
    },
  },
  defaultVariants: { columns: 3, gap: 'default', equalHeight: true },
})

export type CardGridProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardGridVariants>

export const CardGrid = ({
  className,
  columns,
  gap,
  equalHeight,
  children,
  ...props
}: CardGridProps) => (
  <div className={cn(cardGridVariants({ columns, gap, equalHeight }), className)} {...props}>
    {children}
  </div>
)
