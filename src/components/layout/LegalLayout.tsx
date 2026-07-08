import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '../ui/Breadcrumbs'
import SubpageHero from '../sections/SubpageHero'
import Reveal from '../ui/Reveal'

/**
 * LegalLayout — geteilte Hülle für reine Rechts-/Utility-Seiten (Impressum,
 * Datenschutz, AGB). Navy-`SubpageHero` (Breadcrumbs, Teal-Eyebrow, EINZIGE <h1>)
 * über einem lesbaren, prosa-artigen Content-Container.
 *
 * Kein Conversion-Design: keine Final-CTA, keine Deko — nur konsistent und lesbar.
 * Footer kommt global über das Layout und wird hier nicht dupliziert.
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
  children: ReactNode
}

export function LegalLayout({ breadcrumbs, eyebrow, title, subtitle, meta, children }: LegalLayoutProps) {
  return (
    <>
      <SubpageHero breadcrumbs={breadcrumbs} eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-16 lg:px-0 lg:py-24">
          <Reveal width="100%">
            {meta && <p className="mb-8 text-sm text-gray-500">{meta}</p>}
            <div className="space-y-8 leading-relaxed text-gray-700">{children}</div>
          </Reveal>
        </div>
      </div>
    </>
  )
}

export default LegalLayout
