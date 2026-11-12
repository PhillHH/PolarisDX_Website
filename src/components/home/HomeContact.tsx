import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { InfoCallLink } from '../sections/FinalCtaSection'
import { getNextHomeEvent } from '../../data/events'
import { formatEventRange } from '../../lib/eventDates'
import { panelsUrl, shopUrl } from '../../lib/shop'
import { CORE_SERVICES, HOME_TARGETS } from './homeTargets'
import { Card } from '../ui/Card'
import Eyebrow from '../ui/Eyebrow'

const HomeContact = () => {
  const { t, i18n } = useTranslation(['home', 'common', 'events'])
  const nextEvent = getNextHomeEvent()

  return (
    <section
      id="los-gehts"
      aria-labelledby="home-contact-title"
      data-home-contact
      data-home-section
      className="sc025-contact sc025-dark"
    >
      <div className="sc025-inner">
        <Eyebrow tone="dark" className="sc025-label">
          {t('sc025.contact.eyebrow')}
        </Eyebrow>
        <h2 id="home-contact-title" className="sc025-contact-lead">
          {t('sc025.contact.lead')}
        </h2>
        <div className="sc025-four">
          {CORE_SERVICES.map(({ sourceId, routeId }) => (
            <Card
              key={sourceId}
              to={HOME_TARGETS.contact}
              data-core-service={sourceId}
              data-route-id={routeId}
              className="sc025-pick bg-transparent"
            >
              <h3>{t(`segments.${sourceId}.title`)}</h3>
              <p>{t(`segments.${sourceId}.bio`)}</p>
              <span className="sc025-pick-footer">
                {t('hero.cta_secondary')}
                <i>
                  <ArrowRight aria-hidden="true" />
                </i>
              </span>
            </Card>
          ))}
          {nextEvent && (
            <Card
              to={HOME_TARGETS.contact}
              data-home-event-card={nextEvent.id}
              className="sc025-pick bg-transparent"
            >
              <h3>{t('sc025.contact.visitor')}</h3>
              <p>
                {t(`events:items.${nextEvent.id}.title`)} ·{' '}
                {formatEventRange(i18n.language, nextEvent.date, nextEvent.endDate)} ·{' '}
                {t(`events:items.${nextEvent.id}.short`, '')} · {t('sc025.contact.live')}
              </p>
              <span className="sc025-pick-footer">
                {t('common:event_popup.meet')}
                <i>
                  <ArrowRight aria-hidden="true" />
                </i>
              </span>
            </Card>
          )}
        </div>
        <p className="sc025-direct">
          {t('sc025.contact.direct')}{' '}
          <InfoCallLink to={HOME_TARGETS.contact} label={t('hero.cta_secondary')} /> ·{' '}
          <a
            href={shopUrl(i18n.language)}
            target="_blank"
            rel="noopener noreferrer"
            data-shop="practice"
          >
            {t('common:nav.shop')}
          </a>{' '}
          ·{' '}
          <a
            href={panelsUrl(i18n.language)}
            target="_blank"
            rel="noopener noreferrer"
            data-shop="panels"
          >
            {t('shop_teaser.cta_panels')}
          </a>
        </p>
      </div>
    </section>
  )
}

export default HomeContact
