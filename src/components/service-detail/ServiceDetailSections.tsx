import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import Reveal, { REVEAL_STAGGER } from '../ui/Reveal'
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

function TextSection({ section, index }: { section: ServiceDetailTextSection; index?: number }) {
  const paragraphs = section.paragraphs || (section.content ? [section.content] : [])
  return (
    <section
      aria-labelledby={section.heading ? `${section.id}-title` : undefined}
      className="rounded-xl border border-slate-200 bg-white p-7"
    >
      {section.heading && (
        <div className="flex items-start gap-4">
          {typeof index === 'number' && (
            <span
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-base font-semibold text-accent"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          <h2
            id={`${section.id}-title`}
            className="mt-1 text-xl font-medium tracking-tight text-heading lg:text-2xl"
          >
            {stripLeadingNumber(section.heading)}
          </h2>
        </div>
      )}
      {paragraphs.length > 0 && (
        <div className="mt-4 space-y-4">
          {paragraphs.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex} className="leading-relaxed text-gray-700">
              {renderServiceText(paragraph)}
            </p>
          ))}
        </div>
      )}
      {section.items && section.items.length > 0 && (
        <ul className="mt-5 space-y-3">
          {section.items.map((item) => (
            <li key={item} className="flex gap-3 leading-relaxed text-gray-700">
              <Check className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{renderServiceText(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function WorkflowSection({ workflow }: { workflow: ServiceDetailWorkflow }) {
  return (
    <section
      aria-labelledby="service-workflow-title"
      className="rounded-xl border border-slate-200 bg-white p-7"
    >
      <h2
        id="service-workflow-title"
        className="text-xl font-medium tracking-tight text-heading lg:text-2xl"
      >
        {workflow.heading}
      </h2>
      <ol className="mt-5 space-y-4">
        {workflow.steps.map((step, index) => (
          <li key={`${index}-${step.title}`} className="grid grid-cols-[2.75rem_1fr] gap-4">
            <span
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 font-semibold text-accent"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-heading">{step.title}</h3>
              {step.text && <p className="mt-1 leading-relaxed text-gray-700">{step.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function ProofSection({ proof }: { proof: ServiceDetailProof }) {
  return (
    <section
      aria-labelledby="service-proof-title"
      className="rounded-xl border border-accent/20 bg-accent/5 p-7"
    >
      <h2
        id="service-proof-title"
        className="text-xl font-medium tracking-tight text-heading lg:text-2xl"
      >
        {proof.heading}
      </h2>
      {proof.intro && <p className="mt-3 leading-relaxed text-gray-700">{proof.intro}</p>}
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {proof.items.map((item) => (
          <li key={`${item.value || ''}-${item.label}`} className="rounded-lg bg-white p-4">
            {item.value && <strong className="block text-xl text-heading">{item.value}</strong>}
            <span className="font-medium text-heading">{item.label}</span>
            {item.text && <p className="mt-1 text-sm leading-relaxed text-gray-700">{item.text}</p>}
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ServiceDetailSections({ model }: { model: ServiceDetailViewModel }) {
  const { content, labels, stats } = model
  const namedSections = [
    content.problem,
    content.audiences,
    content.questions,
    content.parameters,
  ].filter((section): section is ServiceDetailTextSection => Boolean(section))

  return (
    <div className="space-y-8" data-service-detail-sections>
      {content.legacyRichContent ? (
        <Reveal width="100%">
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: content.legacyRichContent }}
          />
        </Reveal>
      ) : (
        <>
          {namedSections.map((section) => (
            <Reveal key={section.id} width="100%">
              <TextSection section={section} />
            </Reveal>
          ))}

          {stats.length > 0 && (
            <ul
              className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200 sm:grid-cols-4"
              aria-label={labels.introEyebrow}
            >
              {stats.map((stat) => (
                <li key={stat.label} className="bg-white p-5 text-center">
                  <strong className="block text-2xl font-medium tracking-tight text-heading lg:text-3xl">
                    {stat.value}
                  </strong>
                  <span className="mt-1 block text-xs leading-snug text-gray-600">
                    {stat.label}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {content.detailSections?.map((section, index) => (
            <Reveal key={section.id} width="100%" delay={index * REVEAL_STAGGER}>
              <TextSection section={section} index={index} />
            </Reveal>
          ))}
          {content.workflow && <WorkflowSection workflow={content.workflow} />}
          {content.proof && <ProofSection proof={content.proof} />}
          {content.conclusion && <TextSection section={content.conclusion} />}
          {content.disclaimer && <TextSection section={content.disclaimer} />}
        </>
      )}

      {Boolean(content.related?.length || content.crosslinks?.length) && (
        <nav aria-label={labels.detailEyebrow} className="grid gap-4 sm:grid-cols-2">
          {[...(content.related || []), ...(content.crosslinks || [])].map((link) => (
            <Link
              key={link.id}
              to={link.to}
              className="rounded-xl border border-slate-200 bg-white p-5 font-semibold text-heading transition hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              {link.label}
              {link.description && (
                <span className="mt-2 block text-sm font-normal leading-relaxed text-gray-700">
                  {link.description}
                </span>
              )}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}

export default ServiceDetailSections
