import { Button, GradientSurface } from '~/design-system'

/**
 * CtaBand — geteiltes dunkles Schluss-CTA-Band (§Konzept 5 „ein dunkles
 * Schluss-Band pro Seite", [FRO] keine Komponenten-Duplikate).
 *
 * Eine Quelle für das Navy-Gradient-Band mit Overline + Display-Titel + Subline
 * und genau einer Primär- plus optionaler Sekundäraktion. Token-rein, on-dark-
 * Tonalität (Overline teal-300, Subline 80 % Weiß, Fokus-Ring weiß via
 * `onDark`). Vorher inline dupliziert in HomePage (FinalCtaSection) und
 * IglooProPage — jetzt ein Bauteil, zwei Aufrufe.
 */
export interface CtaAction {
  label: string
  /** Interner Router-Link. */
  to?: string
  /** Externer/absoluter Link (z. B. PDF). */
  href?: string
  target?: string
  rel?: string
}

export interface CtaBandProps {
  /** Optionaler Section-Anker (z. B. `final-cta`). */
  id?: string
  caption: string
  title: string
  text: string
  primary: CtaAction
  secondary?: CtaAction
}

const CtaBand = ({ id, caption, title, text, primary, secondary }: CtaBandProps) => {
  return (
    <GradientSurface id={id} glowWidth="w-80">
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-8 px-4 py-20 text-center lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-overline text-accent-on-dark">
          {caption}
        </p>
        <h2 className="text-display-sm font-medium tracking-headline text-fg-on-dark">{title}</h2>
        <p className="max-w-2xl text-base leading-relaxed text-fg-on-dark/80 sm:text-lg">{text}</p>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          <Button
            to={primary.to}
            href={primary.href}
            target={primary.target}
            rel={primary.rel}
            variant="primary"
            size="lg"
            onDark
            className="w-full text-center sm:w-auto sm:whitespace-nowrap"
          >
            {primary.label}
          </Button>
          {secondary && (
            <Button
              to={secondary.to}
              href={secondary.href}
              target={secondary.target}
              rel={secondary.rel}
              variant="outline"
              size="lg"
              onDark
              className="w-full text-center sm:w-auto sm:whitespace-nowrap"
            >
              {secondary.label}
            </Button>
          )}
        </div>
      </div>
    </GradientSurface>
  )
}

export default CtaBand
