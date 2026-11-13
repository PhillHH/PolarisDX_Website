import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import type { HeroValueChip } from '../sections/SubpageHero'
import SubPage from '../sub/SubPage'
import SubStage from '../sub/SubStage'

/**
 * LegalLayout — geteilte Hülle für reine Rechts-/Utility-Seiten (Impressum,
 * Datenschutz, AGB). Reicher Navy-`SubpageHero` (Breadcrumbs, Teal-Eyebrow,
 * EINZIGE <h1>, Icon-Spotlight-Visual) über einem lesbaren, prosa-artigen
 * Content-Container.
 *
 * Rechtsseiten sind bewusst schlicht (kein Conversion-Design, keine Final-CTA),
 * aber konsistent mit dem Sales-Machine-System: der Hero trägt dasselbe reiche
 * Icon-Visual (Puls-Ring + optionale schwebende Karten) wie die übrigen
 * Unterseiten. Footer kommt global über das Layout und wird hier nicht dupliziert.
 * SSR-sicher (kein window/localStorage/document).
 */
export type LegalLayoutProps = {
  breadcrumbs: BreadcrumbItem[]
  eyebrow?: string
  /** Wird von der Bühne als einzige <h1> der Seite gerendert. */
  title: string
  subtitle?: string
  /** Optionaler Meta-Hinweis über dem Text (z. B. „Stand: Dezember 2025"). */
  meta?: string
  /** Früheres Hero-Symbol; die Bühne zeigt keines mehr (Angabe bleibt erlaubt). */
  icon?: ReactNode
  /** Kennwerte der Seite — stehen als Eckdaten unter der Lichtlinie der Bühne. */
  valueChips?: HeroValueChip[]
  children: ReactNode
}

export function LegalLayout({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  meta,
  valueChips,
  children,
}: LegalLayoutProps) {
  return (
    <SubPage>
      {/* SC-028: Rechtstexte bekommen nur Rahmen und Typografie — Bühne im Stil der Startseite,
          darunter die Lesespalte mit unverändertem Inhalt. `.legal-hero` bleibt der Haken für die
          Silbentrennung der H1 (index.css). */}
      <SubStage
        className="legal-hero"
        breadcrumbs={breadcrumbs}
        eyebrow={eyebrow}
        title={title}
        lead={subtitle ? <p>{subtitle}</p> : undefined}
        facts={valueChips?.map((chip) => ({ label: chip.label, value: chip.value }))}
      />
      <div className="sc025-s" data-sub-section>
        <div className="sc025-inner sc028-narrow sc028-body">
          {meta && <p className="sc028-label sc028-meta-top">{meta}</p>}
          <div className="space-y-8 leading-relaxed text-gray-700">{children}</div>
        </div>
      </div>
    </SubPage>
  )
}

export default LegalLayout
