import { cn } from '../../../lib/utils'

/**
 * SectionIntro — Section-Kopf der NEWLOOK-Startseite (§NEWLOOK-HOME §2 Typo).
 *
 * Bewusst cleaner/Philips-artig: Eyebrow als **reiner** Uppercase-Text mit kurzer
 * Akzent-Linie (kein Gradient-Pill wie das alte `Eyebrow`-Atom), darunter die
 * große Display-Headline. Token-rein, AA-Kontrast (Eyebrow = brand-blue, Titel =
 * fg-heading). Optionale Subline für Fließtext unter der Headline.
 *
 * Genau eine H2 pro Aufruf (Hero rendert seine H1 separat). Align links/zentriert.
 */
export interface SectionIntroProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
  /** Tone der Akzent-/Textfarben — `light` für helle Bänder (Default), `dark` auf Navy. */
  tone?: 'light' | 'dark'
}

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  className,
  tone = 'light',
}: SectionIntroProps) {
  const isCenter = align === 'center'
  const dark = tone === 'dark'

  return (
    <div
      className={cn(
        'flex flex-col',
        isCenter ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-overline',
          dark ? 'text-accent-on-dark' : 'text-brand-blue-bright',
        )}
      >
        <span
          aria-hidden="true"
          className={cn('h-px w-8', dark ? 'bg-accent-on-dark/60' : 'bg-brand-blue-bright/50')}
        />
        {eyebrow}
      </span>
      <h2
        className={cn(
          'mt-5 max-w-3xl text-display-sm font-semibold tracking-headline',
          dark ? 'text-fg-on-dark' : 'text-fg-heading',
          isCenter && 'mx-auto',
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed sm:text-lg',
            dark ? 'text-fg-on-dark/80' : 'text-fg-muted',
            isCenter && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionIntro
