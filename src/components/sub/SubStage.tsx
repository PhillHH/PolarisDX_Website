import type { ReactNode } from 'react'
import { Breadcrumbs, type BreadcrumbItem } from '../ui/Breadcrumbs'

export type SubStageFact = { label?: string; value: string }

type SubStageProps = {
  breadcrumbs?: BreadcrumbItem[]
  eyebrow?: string
  /** Wird als einzige <h1> der Seite gerendert. */
  title: string
  titleId?: string
  lead?: ReactNode
  actions?: ReactNode
  chips?: string[]
  /** Eckdaten unter der Lichtlinie der Bühne. */
  facts?: SubStageFact[]
  factsLabel?: string
  /**
   * Eckdaten ohne Lichtlinie — wenn die rechte Spalte selbst eine trägt (Gerät mit Lichtstrahl).
   * Die Linie durch die Seite beginnt dann am Fuß der Bühne.
   */
  plainFacts?: boolean
  /** Rechte Spalte: Bild (StageImage), Kennzahlen oder Karte. */
  aside?: ReactNode
  /**
   * Am Telefon füllt der Text den ersten Bildschirm; Chips und Aktionen stehen an dessen Fuß, die
   * rechte Spalte beginnt darunter. Pflicht, wenn die rechte Spalte ein Bild ist (es lädt dort
   * `lazy`, das größte Element oben bleibt Text). Zugleich fängt der freie Raum den Zeilenumbruch
   * der Einleitung beim Schriftwechsel ab — ohne ihn rutscht alles darunter um eine Zeile (CLS).
   */
  fold?: boolean
  className?: string
}

/**
 * SC-028: dunkle Bühne der Unterseiten — Pfad, Kennzeile, dünne große H1, Einleitung, Aktionen
 * und darunter die Lichtlinie mit den Eckdaten. Der Abstand nach oben kommt aus den
 * Kopfzeilen-Token (`pt-page-top`), damit die Bühne jeder Kopfzeilenhöhe folgt.
 */
const SubStage = ({
  breadcrumbs,
  eyebrow,
  title,
  titleId,
  lead,
  actions,
  chips,
  facts,
  factsLabel,
  plainFacts = false,
  aside,
  fold = false,
  className = '',
}: SubStageProps) => (
  <section
    aria-labelledby={titleId}
    data-sub-stage
    className={`sc025-dark sc028-stage ${className}`}
  >
    <div className="sc025-inner pt-page-top xl:pt-page-top-xl">
      <div
        className={`sc028-stage-grid ${aside ? '' : 'sc028-stage-solo'} ${
          fold ? 'sc028-stage-fold' : ''
        }`}
      >
        <div>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Breadcrumbs variant="dark" items={breadcrumbs} />
          )}
          {eyebrow && <p className="sc025-kicker">{eyebrow}</p>}
          <h1 id={titleId} className="sc028-h1">
            {title}
          </h1>
          {lead && <div className="sc028-stage-lead">{lead}</div>}
          {chips && chips.length > 0 && (
            <ul className="sc028-chips">
              {chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          )}
          {actions && <div className="sc028-actions">{actions}</div>}
        </div>
        {aside}
      </div>
      {(!facts || facts.length === 0) && (
        <div className="sc028-line" data-sub-line aria-hidden="true" />
      )}
      {facts && facts.length > 0 && (
        <dl
          aria-label={factsLabel}
          className={`sc028-facts ${plainFacts ? 'sc028-facts-plain' : ''}`}
          data-sub-line={plainFacts ? undefined : true}
          style={{ ['--sc028-n' as string]: facts.length }}
        >
          {facts.map((fact) => (
            <div key={`${fact.label ?? ''}${fact.value}`}>
              {fact.label && <dt>{fact.label}</dt>}
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  </section>
)

export default SubStage
