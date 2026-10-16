import type { ReactNode } from 'react'
import { Breadcrumbs } from '../ui/Breadcrumbs'

/**
 * AP34 PT34.2a (SC-003) — Buehne der Bereichs- und Leseseiten.
 *
 * Klassen bewusst aus dem Bestand (initialCss-Budget §29): keine eigenen
 * Verlaeufe, keine freien Rasterbreiten.
 *
 * Ruhige Navy-Flaeche statt eines Fotos: die Routen
 * Epigenetik, Vertiefung, Musterbefund und Service-Detail haben im
 * Perf-Vertrag ein LCP-Bild-Budget von 0 Byte (scripts/perf/budgets.json).
 * Ein Buehnenfoto waere dort das groesste Element und damit das LCP-Bild —
 * das Budget wird nicht gelockert, also bleibt die Buehne bildfrei. Auch der
 * Punktring (`.brand-ring`, ein SVG-Hintergrund) bleibt hier weg: gemessen
 * wertet Chrome ihn als LCP-Bild (2,1 KB > 0). Er steht weiter auf den
 * Abschlusskaesten unterhalb des Falzes.
 *
 * Reihenfolge im DOM wie auf der Startseite: Pfad → Kicker → H1 → Lead →
 * Aktionen → Zusatz (`children`, z. B. Schrittanzeige). Text vor Visual.
 *
 * SC-006 (Editorial Motion): `aurora` legt den langsam driftenden Akzent-
 * Lichtschein auf die Flaeche — ein CSS-Verlauf, kein LCP-Kandidat (anders als
 * Foto oder Punktring). `enter` staffelt Kicker, H1, Lead und Aktionen; der Pfad
 * ist das erste Kind und bleibt ohne Eintritt.
 */
export interface AreaStageProps {
  breadcrumbs: { label: string; href?: string }[]
  eyebrow: string
  title: string
  lead?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  /** Rechte Spalte ab lg (dekorativ oder ergaenzend), z. B. Befund-Deckblatt. */
  aside?: ReactNode
  /** Mehr Platz unten, wenn eine Kennzahlen-Leiste die Buehne ueberlappt. */
  overlap?: boolean
  /** id der H1 fuer aria-labelledby der Section. */
  titleId?: string
}

const AreaStage = ({
  breadcrumbs,
  eyebrow,
  title,
  lead,
  actions,
  children,
  aside,
  overlap = false,
  titleId = 'area-stage-title',
}: AreaStageProps) => (
  <section aria-labelledby={titleId} className="aurora bg-brand-deep text-white">
    <div
      className={`mx-auto grid max-w-container gap-10 px-4 pt-28 sm:px-6 lg:px-0 lg:pt-32 ${
        overlap ? 'pb-24 lg:pb-28' : 'pb-14 lg:pb-20'
      } ${aside ? 'lg:grid-cols-2 lg:items-center' : ''}`}
    >
      <div className="min-w-0">
        <Breadcrumbs variant="dark" className="mb-8" items={breadcrumbs} />
        <p className="enter inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-semibold ring-1 ring-inset ring-white/25">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent-line" />
          {eyebrow}
        </p>
        <h1 id={titleId} className="enter mt-6 max-w-3xl t-stage-h1">
          {title}
        </h1>
        {lead ? (
          <div className="enter mt-6 max-w-[60ch] text-pretty text-lg leading-relaxed text-white/85 lg:text-xl lg:leading-relaxed">
            {lead}
          </div>
        ) : null}
        {actions ? (
          <div className="enter mt-9 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-5">
            {actions}
          </div>
        ) : null}
        {children}
      </div>
      {aside ? <div className="min-w-0">{aside}</div> : null}
    </div>
  </section>
)

export default AreaStage
