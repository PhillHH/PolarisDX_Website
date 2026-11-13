import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { serviceDetailGeneralSalesTarget } from '../../data/serviceDetail'
import type { ArticleImageAsset } from '../../assets/articleImages'
import {
  PILLAR_DIAGNOSTICS_IMAGE,
  PILLAR_SAMPLE_IMAGE,
  STAGE_CAPILLARY_IMAGE,
  STAGE_PRAXIS_IMAGE,
} from '../../assets/home/homeImages'
import StageImage from '../sub/StageImage'
import SubStage from '../sub/SubStage'
import type { ServiceDetailViewModel } from './model'

/**
 * Bühnenbild je Leistung — nur vorhandene Fotos der Startseite und nur dort, wo das Motiv zur
 * Leistung passt: Zahnarztpraxis (Dental), IglooPro auf dem Tresen (POC-Systemlösungen),
 * Vorbereitung der Probe (Präventions-Checks), Kapillarblut an der Fingerkuppe (Stoffwechsel &
 * Herz, die Seite nennt die Probe). Ohne passendes Motiv bleibt die Bühne typografisch.
 * `focus` ist der waagerechte Bildausschnitt im Hochformat-Rahmen.
 */
const STAGE_IMAGES: Partial<Record<string, { image: ArticleImageAsset; focus: string }>> = {
  dental: { image: STAGE_PRAXIS_IMAGE, focus: '60%' },
  'poc-systemloesungen': { image: PILLAR_DIAGNOSTICS_IMAGE, focus: '66%' },
  'praeventions-checks': { image: PILLAR_SAMPLE_IMAGE, focus: '36%' },
  'stoffwechsel-herz': { image: STAGE_CAPILLARY_IMAGE, focus: '50%' },
}

/** SC-028: Bühne der Leistungs-Detailseiten im Stil der Startseite. */
export function ServiceDetailHero({ model }: { model: ServiceDetailViewModel }) {
  const { content, entry, labels } = model
  const values = (content.hero.valueChips || []).slice(0, 3)
  const stage = STAGE_IMAGES[entry.service.id]
  return (
    <SubStage
      breadcrumbs={[
        { label: labels.home, href: '/' },
        { label: labels.diagnostics, href: '/diagnostics' },
        { label: content.hero.title },
      ]}
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      lead={content.hero.subtitle ? <p>{content.hero.subtitle}</p> : undefined}
      chips={content.hero.chips}
      actions={
        <Link
          to={serviceDetailGeneralSalesTarget}
          className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          data-cta-intent="GENERAL_SALES"
          data-cta-source="service_detail"
          data-cta-journey="general_sales"
          data-cta-section="hero"
          data-service-family={entry.service.id}
        >
          {labels.primaryCta}
          <ArrowRight aria-hidden="true" />
        </Link>
      }
      fold
      aside={
        stage ? (
          /* Schmuckbild: der Rahmen wiederholt nur die Kennzeile, deshalb ohne Alternativtext. */
          <div
            className="sc028-frame"
            aria-hidden="true"
            style={{ ['--sc028-focus' as string]: stage.focus }}
          >
            <StageImage image={stage.image} desktopSizes="800px" mobileSizes="100vw" />
            {content.hero.eyebrow && <span>{content.hero.eyebrow}</span>}
          </div>
        ) : values.length > 0 ? (
          <dl className="sc028-aside-list">
            {values.map((chip) => (
              <div key={chip.label}>
                <dt>{chip.label}</dt>
                <dd>{chip.value}</dd>
              </div>
            ))}
          </dl>
        ) : undefined
      }
    />
  )
}

export default ServiceDetailHero
