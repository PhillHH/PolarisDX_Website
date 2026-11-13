import { ArrowRight, Dna, MonitorSmartphone } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { diagnosticsContextTargets, diagnosticsFocusAreas } from '../../data/diagnosticsHub'
import SubHead from '../sub/SubHead'

const DiagnosticsUseCasesSection = () => {
  const { t } = useTranslation(['home', 'services'])

  return (
    <section
      aria-labelledby="diagnostics-focus-title"
      data-diagnostics-focus-areas
      data-sub-section
      className="sc025-s"
    >
      <div className="sc025-inner">
        <SubHead
          kicker={t('services:overview.focus.eyebrow')}
          title={t('services:overview.focus.title')}
          titleId="diagnostics-focus-title"
          lead={t('services:overview.focus.intro')}
        />

        <div
          data-diagnostics-focus-grid
          className="sc028-cols grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3"
        >
          {diagnosticsFocusAreas.map(({ id, entry, requiredTag }) => {
            const title = t(`home:services.${entry.service.translationKey}.title`)
            return (
              <article
                key={id}
                data-diagnostics-focus-area={id}
                data-focus-service={entry.service.id}
                data-focus-tag={requiredTag}
              >
                <span className="sc028-tile-icon" aria-hidden="true">
                  {entry.service.icon}
                </span>
                <h3>{title}</h3>
                <p className="sc025-text">
                  {t(`services:overview.ia.cards.${entry.service.translationKey}`)}
                </p>
                <Link
                  to={entry.route.path}
                  data-focus-link
                  data-route-id={entry.route.id}
                  className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  <span>{t('services:overview.ia.card_cta')}</span>
                  <ArrowRight aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>

        <div
          data-diagnostics-context-boundaries
          className="sc028-cols sc028-bounds grid gap-12 lg:grid-cols-2"
        >
          <article data-diagnostics-boundary="igloo">
            <MonitorSmartphone aria-hidden="true" />
            <h3 className="sc025-mid">{t('home:business_pillars.pillars.igloo.title')}</h3>
            <p className="sc025-text">{t('home:business_pillars.pillars.igloo.text')}</p>
            <Link
              to={diagnosticsContextTargets.igloo.path}
              data-context-link="igloo"
              data-route-id={diagnosticsContextTargets.igloo.id}
              className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span>{t('home:business_pillars.pillars.igloo.cta')}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>

          <article data-diagnostics-boundary="epigenetics">
            <Dna aria-hidden="true" />
            <h3 className="sc025-mid">{t('home:business_pillars.pillars.epigenetics.title')}</h3>
            <p className="sc025-text">{t('home:business_pillars.pillars.epigenetics.text')}</p>
            <Link
              to={diagnosticsContextTargets.epigenetics.path}
              data-context-link="epigenetics"
              data-route-id={diagnosticsContextTargets.epigenetics.id}
              className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
            >
              <span>{t('home:business_pillars.pillars.epigenetics.cta')}</span>
              <ArrowRight aria-hidden="true" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}

export default DiagnosticsUseCasesSection
