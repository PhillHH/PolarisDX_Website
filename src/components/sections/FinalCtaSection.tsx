import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'
import { getHomepageSalesTarget, type HomepageSalesSection } from '../../lib/homepageConversion'

/**
 * FinalCtaSection — Full-width dunkle Schluss-CTA (B2B-Abschluss der HomePage).
 * Eyebrow (Teal) + grosse H2 + Untertitel, dann zwei CTAs nebeneinander:
 * Primaer (Teal)"Angebot anfragen" -> /contact, Sekundaer (Outline)"ROI-Rechner" -> /#roi-rechner.
 * SSR-sicher (kein window/localStorage). i18n-NS 'home', alle Texte via t().
 *
 * SC-006 (Editorial Motion): der Inhalt tritt als EIN Block mit `rv` ein (Scroll-
 * Eintritt, ein positionierter Wrapper ueber dem Punktring). Kein `aurora` hier —
 * `brand-ring` nutzt bereits ::before.
 */

/**
 * Sprachpraefix, das der Router selbst setzt: BrowserRouter (Client) und
 * StaticRouter (SSR) laufen mit basename="/<lang>". Ein hereingereichtes
 * Praefix wuerde sonst verdoppelt: /de/en/#roi-rechner.
 */
/** SC-023 (Owner 2026-11-03): ROI-Rechner von der Startseite und aus allen Knoepfen entfernt. */
const FinalCtaSection = ({
  homepageSalesSection,
}: {
  homepageSalesSection?: HomepageSalesSection
}) => {
  const { t } = useTranslation('home')
  const primaryTarget = homepageSalesSection
    ? getHomepageSalesTarget(homepageSalesSection)
    : '/contact'
  const homepageAttribution = homepageSalesSection
    ? {
        'data-cta-intent': 'GENERAL_SALES',
        'data-cta-source': 'homepage',
        'data-cta-journey': 'general_sales',
        'data-cta-section': homepageSalesSection,
      }
    : {}

  return (
    <section
      id="los-gehts"
      className="scroll-mt-[124px] lg:scroll-mt-[148px] bg-paper px-4 pb-20 text-white lg:px-0 lg:pb-24"
    >
      <div className="brand-ring mx-auto max-w-container rounded-band bg-brand-deep px-6 py-20 text-center sm:px-12 lg:py-24">
        <div className="rv relative">
          <p className="t-eyebrow-dark">{t('final_cta.caption', 'Bereit loszulegen')}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance font-semibold tracking-[-0.035em] text-white text-[clamp(30px,5vw,52px)] leading-[1.05]">
            {t('final_cta.title', 'Bereit für laborgenaue Diagnostik in Ihrer Praxis?')}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {t(
              'final_cta.subtitle',
              'Sprechen Sie mit unserem Team über eine passende Point-of-Care-Lösung für Ihre Praxis.',
            )}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button to={primaryTarget} variant="light" {...homepageAttribution}>
              {t('final_cta.cta_primary', 'Angebot anfragen')}
            </Button>
          </div>
          <div className="mt-8 hidden flex-wrap justify-center gap-3 sm:flex">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              <Check size={13} className="text-accent-on-dark" aria-hidden />
              {t('final_cta.chips.free', 'Unverbindliche Anfrage')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              <Check size={13} className="text-accent-on-dark" aria-hidden />
              {t('final_cta.chips.reply', 'Persönliche Beratung')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
              <Check size={13} className="text-accent-on-dark" aria-hidden />
              {t('final_cta.chips.delivery', 'In 10 Sprachen verfügbar')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCtaSection
