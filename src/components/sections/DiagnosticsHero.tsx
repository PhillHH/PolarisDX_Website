import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import { diagnosticsGeneralSalesTarget } from '../../data/diagnosticsHub'
import SubStage from '../sub/SubStage'

/**
 * Registry-backed, SSR-first Diagnostics entry surface.
 * One real, dimensioned WebP is the sole Hero media candidate; there is no
 * carousel, direct tracking call or duplicated service/detail content.
 *
 * SC-028: Bühne im Stil der Startseite (SubStage). Reihenfolge im Dokument wie bisher:
 * Überschrift, Aktionen, Vertrauenssignale, dann das Bild. Das IglooPro-Bild bleibt das einzige
 * Vorrang-Bild (Desktop-LCP, 650×650); am Telefon steht es unter dem ersten Bildschirm
 * (gemessene Ausnahme PT25.3 für `eager` unter dem Falz).
 */
const DiagnosticsHero = () => {
  const { t } = useTranslation(['common', 'services'])
  const trustSignals = [
    t('services:overview.hero.entry.trust.services'),
    t('services:overview.hero.entry.trust.audience'),
    t('services:overview.hero.entry.trust.context'),
  ]

  return (
    <SubStage
      titleId="diagnostics-hero-title"
      data={{ 'data-diagnostics-hero': true }}
      breadcrumbLabel={t('services:overview.hero.entry.breadcrumb_label')}
      breadcrumbs={[
        { label: t('common:nav.home', 'Home'), href: '/' },
        { label: t('services:overview.hero.title', 'Diagnostik') },
      ]}
      eyebrow={t('services:overview.hero.entry.eyebrow')}
      title={t('services:overview.hero.entry.title')}
      lead={<p>{t('services:overview.hero.entry.description')}</p>}
      fold
      actions={
        <>
          <Link
            to={diagnosticsGeneralSalesTarget}
            data-cta-intent="GENERAL_SALES"
            data-cta-source="diagnostics"
            data-cta-journey="general_sales"
            data-cta-section="hero"
            className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          >
            {t('services:overview.hero.entry.primary_cta')}
            <ArrowRight aria-hidden="true" />
          </Link>
          <a
            href="#diagnostics-services"
            data-diagnostics-secondary-entry
            className="sc025-underlink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          >
            <span>{t('services:overview.hero.entry.secondary_cta')}</span>
          </a>
        </>
      }
      note={
        <aside
          aria-label={t('services:overview.hero.entry.trust_label')}
          data-diagnostics-hero-trust
        >
          <p>
            <b>{t('services:overview.hero.entry.trust_label')}</b>
          </p>
          <ul>
            {trustSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </aside>
      }
      aside={
        <figure data-diagnostics-hero-visual className="sc028-device">
          <img
            src={IglooProImage}
            alt={t('services:overview.hero.entry.visual.alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>
            <p className="sc025-label">{t('services:overview.hero.entry.visual.eyebrow')}</p>
            <b>{t('services:overview.hero.entry.visual.title')}</b>
            <p className="sc025-text">{t('services:overview.hero.entry.visual.text')}</p>
          </figcaption>
        </figure>
      }
    />
  )
}

export default DiagnosticsHero
