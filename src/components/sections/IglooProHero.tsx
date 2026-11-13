import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import IglooProImage from '../../assets/Igloo-pro-frontal.webp'
import SubStage from '../sub/SubStage'

/**
 * Claim-safe, SSR-first IglooPro product entry.
 *
 * The hero deliberately carries no specification or certification wall. The
 * real reader cutout is the only eager medium; intrinsic dimensions reserve
 * its layout on every viewport. Technical proof remains in the serial AP14
 * tasks that own its source verification.
 *
 * SC-028: Bühne im Stil der Startseite (SubStage). Das Gerät bleibt das einzige Vorrang-Bild
 * (LCP, 650×650) und steht am Telefon direkt unter dem Text im ersten Bildschirm — deshalb hier
 * ohne `fold` und ohne das Bildpaar von StageImage.
 */
export default function IglooProHero() {
  const { t } = useTranslation(['products', 'common'])

  return (
    <SubStage
      titleId="igloo-hero-title"
      data={{ 'data-igloo-hero': true }}
      breadcrumbs={[{ label: t('common:nav.home'), href: '/' }, { label: 'IglooPro' }]}
      eyebrow={t('products:hero.caption')}
      title={t('products:hero.title')}
      lead={<p>{t('products:hero.description')}</p>}
      actions={
        <Link
          to="/contact"
          data-cta-intent="GENERAL_SALES"
          className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
        >
          {t('products:hero.cta_order')}
          <ArrowRight aria-hidden="true" />
        </Link>
      }
      /* SC-023 (Owner 2026-11-03): ROI-Rechner-Knopf entfernt. */
      note={<p>{t('products:hero.subline')}</p>}
      aside={
        <figure data-igloo-hero-visual className="sc028-device">
          <img
            src={IglooProImage}
            alt={t('products:hero.visual.device_alt')}
            width={650}
            height={650}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="sr-only">{t('products:hero.visual.context')}</figcaption>
        </figure>
      }
    />
  )
}
