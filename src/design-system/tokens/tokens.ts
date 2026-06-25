/**
 * design-system/tokens/tokens.ts — typsichere Spiegelung (CSS-first, §3.4)
 *
 * SINGLE SOURCE OF TRUTH der Design-Werte ist `tokens.css`. Diese Datei
 * spiegelt NUR Werte, die JS/TS fuer Logik/Props braucht (Varianten-Unions,
 * Breakpoint-Zahlen). KEINE Farb-/Spacing-Rohwerte duplizieren — dafuer die
 * CSS-Variablennamen referenzieren (siehe `cssVar`).
 */

/** Breakpoints (px) — gespiegelt aus --breakpoint-* (CSS Custom Properties
 *  funktionieren nicht in @media-Bedingungen, daher bewusster Parallelwert, §3.3). */
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
export type Breakpoint = keyof typeof breakpoints

/** Komponenten-Varianten-Unions (von Atoms/Molecules als Prop-Typen genutzt). */
export const buttonVariants = ['primary', 'secondary', 'tertiary'] as const
export type ButtonVariant = (typeof buttonVariants)[number]

export const sizes = ['sm', 'md', 'lg'] as const
export type Size = (typeof sizes)[number]

/** Helper: typsicherer Zugriff auf eine CSS-Variable als `var(--name)`-String. */
export const cssVar = (name: string): string => `var(--${name})`
