import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/** SC-028: Abschluss der Produktseite — eine Aufforderung, mittig auf Nacht-Navy. */
export default function IglooProductFinalCta() {
  const { t } = useTranslation('products')

  return (
    <section
      aria-labelledby="igloo-final-cta-title"
      data-igloo-final-cta
      className="sc025-s sc025-dark sc028-final"
    >
      <div className="sc025-inner">
        <h2 id="igloo-final-cta-title" className="sc025-h2">
          {t('cta_bottom.title', 'Bereit, den IglooPro in Ihre Praxis zu holen?')}
        </h2>
        <p className="sc025-text">{t('cta_bottom.description')}</p>
        <div className="sc028-actions">
          <Link
            to="/contact"
            data-cta-intent="GENERAL_SALES"
            className="sc025-button focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-on-dark focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
          >
            {t('cta_bottom.button', 'Angebot anfragen')}
            <ArrowRight aria-hidden="true" />
          </Link>
          {/* SC-023 (Owner 2026-11-03): ROI-Rechner-Knopf entfernt. */}
        </div>
      </div>
    </section>
  )
}
