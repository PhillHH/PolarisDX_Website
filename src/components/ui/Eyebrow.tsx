/**
 * Eyebrow — das eine Sektions-Label.
 *
 * Ein Stil, zwei Toene: auf hellem Grund `accent-strong` (Kontrast 5,5:1),
 * auf Navy `accent-on-dark` (6,9:1). Beides erfuellt AA fuer Kleintext — die
 * frueheren Varianten nicht (text-accent auf Weiss 3,6:1, text-accent-line
 * 2,5:1, text-gray-400 2,4:1).
 *
 * Karten-Labels und Meta-Angaben nutzen bewusst NICHT diesen Stil, sondern
 * eine ruhige Form ohne Versalien und Sperrung. Nur so bleibt die Eyebrow ein
 * Hierarchie-Signal — max. eine je Sektion.
 */
import type { ReactNode } from 'react'

export const EYEBROW_LIGHT = 'text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong'
export const EYEBROW_DARK = 'text-xs font-semibold uppercase tracking-[0.16em] text-accent-on-dark'

type EyebrowProps = {
  children: ReactNode
  /** Untergrund der Sektion — entscheidet ueber den Ton. */
  tone?: 'light' | 'dark'
  /** Layout-Passthrough (z. B. mb-4). */
  className?: string
}

const Eyebrow = ({ children, tone = 'light', className }: EyebrowProps) => {
  const base = tone === 'dark' ? EYEBROW_DARK : EYEBROW_LIGHT
  return <p className={className ? `${base} ${className}` : base}>{children}</p>
}

export default Eyebrow
