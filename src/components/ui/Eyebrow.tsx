/**
 * Eyebrow — das eine Sektions-Label.
 *
 * Ein Stil, zwei Toene: auf hellem Grund `accent-strong` (Kontrast 5,5:1),
 * auf Navy `accent-on-dark` (6,9:1). Beides erfuellt AA fuer Kleintext — die
 * frueheren Varianten nicht (text-accent auf Weiss 3,6:1, text-accent-line
 * 2,5:1, text-gray-400 2,4:1).
 *
 * Die SEKTIONS-Eyebrow bleibt ein Hierarchie-Signal — hoechstens eine je Sektion.
 * Versale Karten-Labels (Nutzen-Karten, Artikel-Kicker, Produktkarte) tragen seit
 * SC-006 dieselbe Rolle `t-eyebrow`/`t-eyebrow-dark` statt eigener Klassenketten;
 * Meta-Angaben (Datum, Rolle, Bildunterschrift) bleiben ruhig ohne Versalien.
 */
import type { ReactNode } from 'react'

export const EYEBROW_LIGHT = 't-eyebrow'
export const EYEBROW_DARK = 't-eyebrow-dark'

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
