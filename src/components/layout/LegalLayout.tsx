import type { ReactNode } from 'react'
import { FileText } from 'lucide-react'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import SubpageHero, { type HeroValueChip } from '../sections/SubpageHero'
import Reveal from '../ui/Reveal'

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
  /** Wird von SubpageHero als einzige <h1> der Seite gerendert. */
  title: string
  subtitle?: string
  /** Optionaler Meta-Hinweis über dem Text (z. B. „Stand: Dezember 2025"). */
  meta?: string
  /** Hero-Visual-Icon (default FileText). */
  icon?: ReactNode
  /** Optionale schwebende Live-Wert-Karten am Hero-Visual. */
  valueChips?: HeroValueChip[]
  children: ReactNode
}

export function LegalLayout({
  breadcrumbs,
  eyebrow,
  title,
  subtitle,
  meta,
  icon,
  valueChips,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <SubpageHero
        breadcrumbs={breadcrumbs}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        icon={icon ?? <FileText />}
        valueChips={valueChips}
      />
      <div className="bg-white">
        <div className="mx-auto max-w-[61ch] px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            {meta && (
              <p className="mb-8 inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                {meta}
              </p>
            )}
            <div className="space-y-8 leading-relaxed text-gray-700">{children}</div>
          </Reveal>
        </div>
      </div>
    </>
  )
}

export default LegalLayout
