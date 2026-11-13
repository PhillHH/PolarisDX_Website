import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Reveal, { REVEAL_STAGGER } from '../ui/Reveal'
// SC-009: eigenes Stylesheet statt Inline-App-CSS auf jeder Seite (siehe Dateikopf).
import richContentHref from '../../styles/rich-content.css?url'
import type {
  ServiceDetailProof,
  ServiceDetailTextSection,
  ServiceDetailViewModel,
  ServiceDetailWorkflow,
} from './model'

const linkPattern = /\[\[([^\]|]+)\|([^\]]+)\]\]/g

function renderServiceText(text: string): ReactNode {
  const parts: ReactNode[] = []
  let cursor = 0
  let match: RegExpExecArray | null
  linkPattern.lastIndex = 0
  while ((match = linkPattern.exec(text))) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index))
    parts.push(
      <Link
        key={`${match.index}-${match[2]}`}
        to={match[2]}
        className="rounded-sm font-semibold text-brand-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        {match[1]}
      </Link>,
    )
    cursor = match.index + match[0].length
  }
  if (cursor < text.length) parts.push(text.slice(cursor))
  return parts.length ? parts : text
}

const stripLeadingNumber = (heading: string) => heading.replace(/^\s*\d+\s*[.)]\s*/, '')

/**
 * SC-028: Abschnitte im Raster der Startseite. Jeder Textblock bleibt eine eigene <section> mit
 * H2; `lead` setzt Überschrift und Fließtext nebeneinander (Auftakt), `rows` zeigt die Punkte in
 * großer Schrift (Parameter auf Nacht-Navy).
 */
function TextSection({
  section,
  index,
  variant,
}: {
  section: ServiceDetailTextSection
  index?: number
  variant?: 'lead' | 'rows' | 'note'
}) {
  const paragraphs = section.paragraphs || (section.content ? [section.content] : [])
  const heading = section.heading && (
    <h2
      id={`${section.id}-title`}
      className={variant === 'lead' || variant === 'rows' ? 'sc025-h2' : 'sc028-h2s'}
    >
      {typeof index === 'number' && (
        <span className="sc028-n" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      {stripLeadingNumber(section.heading)}
    </h2>
  )
  const text = paragraphs.length > 0 && (
    <div className="sc028-prose">
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={paragraphIndex}>{renderServiceText(paragraph)}</p>
      ))}
    </div>
  )
  return (
    <section
      aria-labelledby={section.heading ? `${section.id}-title` : undefined}
      className={variant === 'note' ? 'sc028-notebox' : undefined}
    >
      {variant === 'lead' ? (
        <div className="sc025-head">
          {heading}
          {text}
        </div>
      ) : (
        <>
          {heading}
          {text}
        </>
      )}
      {section.items && section.items.length > 0 && (
        <ul className={variant === 'rows' ? 'sc028-prows' : 'sc028-flat'}>
          {section.items.map((item) => (
            <li key={item}>{renderServiceText(item)}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

function WorkflowSection({ workflow }: { workflow: ServiceDetailWorkflow }) {
  return (
    <section aria-labelledby="service-workflow-title">
      <div className="sc025-head">
        <h2 id="service-workflow-title" className="sc025-h2">
          {workflow.heading}
        </h2>
      </div>
      <ol className="sc028-steps">
        {workflow.steps.map((step, index) => (
          <li key={`${index}-${step.title}`}>
            <span className="sc028-n" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <h3>{step.title}</h3>
              {step.text && <p className="sc025-text">{step.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProofSection({ proof }: { proof: ServiceDetailProof }) {
  return (
    <section aria-labelledby="service-proof-title">
      <div className="sc025-head">
        <h2 id="service-proof-title" className="sc025-h2">
          {proof.heading}
        </h2>
        {proof.intro && <p>{proof.intro}</p>}
      </div>
      <ul className="sc028-proof">
        {proof.items.map((item) => (
          <li key={`${item.value || ''}-${item.label}`}>
            {item.value && <strong>{item.value}</strong>}
            <span>{item.label}</span>
            {item.text && <p className="sc025-text">{item.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ServiceDetailSections({ model }: { model: ServiceDetailViewModel }) {
  const { content, labels, stats } = model
  const lists = [content.audiences, content.questions].filter(
    (section): section is ServiceDetailTextSection => Boolean(section),
  )
  const details = content.detailSections || []
  const notes = [content.conclusion, content.disclaimer].filter(
    (section): section is ServiceDetailTextSection => Boolean(section),
  )
  const links = [...(content.related || []), ...(content.crosslinks || [])]
  const hasMiddle = details.length > 0 || Boolean(content.workflow)
  // Fazit und Fachhinweis schließen den letzten vorhandenen Inhaltsabschnitt ab (Reihenfolge wie bisher).
  const notesAt = content.proof ? 'proof' : hasMiddle ? 'middle' : 'intro'
  const noteBlocks = notes.map((section) => (
    <TextSection key={section.id} section={section} variant="note" />
  ))

  return (
    <div data-service-detail-sections>
      {content.legacyRichContent ? (
        // Altinhalt-Rueckfall (SC-009): keine der 90 Dienstseiten rendert ihn derzeit, alle
        // haben strukturierte Inhalte. Das Stylesheet steht direkt davor (ohne `precedence`,
        // routeJsGzip-Budget); der Browser zeichnet den folgenden Inhalt erst, wenn es geladen
        // ist. Ohne Reveal aus demselben Grund.
        <div className="sc025-s" data-sub-section>
          <div className="sc025-inner">
            <link rel="stylesheet" href={richContentHref} />
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{ __html: content.legacyRichContent }}
            />
          </div>
        </div>
      ) : (
        <>
          {(content.problem || lists.length > 0 || stats.length > 0 || notesAt === 'intro') && (
            <div className="sc025-s" data-sub-section>
              <div className="sc025-inner">
                {content.problem && (
                  <Reveal width="100%">
                    <TextSection section={content.problem} variant="lead" />
                  </Reveal>
                )}
                {lists.length > 0 && (
                  <div className="sc028-two">
                    {lists.map((section, index) => (
                      <Reveal key={section.id} width="100%" delay={index * REVEAL_STAGGER}>
                        <TextSection section={section} />
                      </Reveal>
                    ))}
                  </div>
                )}
                {stats.length > 0 && (
                  <ul className="sc028-stats" aria-label={labels.introEyebrow}>
                    {stats.map((stat) => (
                      <li key={stat.label}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {notesAt === 'intro' && noteBlocks}
              </div>
            </div>
          )}
          {content.parameters && (
            <div className="sc025-s sc025-dark" data-sub-section>
              <div className="sc025-inner">
                <Reveal width="100%">
                  <TextSection section={content.parameters} variant="rows" />
                </Reveal>
              </div>
            </div>
          )}
          {hasMiddle && (
            <div className="sc025-s sc025-tint" data-sub-section>
              <div className="sc025-inner sc028-stack">
                {details.map((section, index) => (
                  <Reveal key={section.id} width="100%" delay={index * REVEAL_STAGGER}>
                    <TextSection section={section} index={index} />
                  </Reveal>
                ))}
                {content.workflow && <WorkflowSection workflow={content.workflow} />}
                {notesAt === 'middle' && noteBlocks}
              </div>
            </div>
          )}
          {content.proof && (
            <div className="sc025-s" data-sub-section>
              <div className="sc025-inner">
                <ProofSection proof={content.proof} />
                {noteBlocks}
              </div>
            </div>
          )}
        </>
      )}
      {links.length > 0 && (
        <div className="sc025-s sc028-related" data-sub-section>
          <nav aria-label={labels.detailEyebrow} className="sc025-inner sc028-rel">
            {links.map((link) => (
              <Link key={link.id} to={link.to}>
                {link.label}
                {link.description && <span className="sc025-text">{link.description}</span>}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}

export default ServiceDetailSections
