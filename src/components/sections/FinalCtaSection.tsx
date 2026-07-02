import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import { Button } from '../ui/Button'

/**
 * FinalCtaSection — Full-width dunkle Schluss-CTA (B2B-Abschluss der HomePage).
 * Eyebrow (Teal) + grosse H2 + Untertitel, dann zwei CTAs nebeneinander:
 * Primaer (Teal) "Beratung buchen" -> /contact, Sekundaer (Outline) "ROI-Rechner" -> #roi-rechner.
 * SSR-sicher (kein window/localStorage). i18n-NS 'home', alle Texte via t().
 */
const FinalCtaSection = ({ roiHref = '#roi-rechner' }: { roiHref?: string }) => {
  const { t } = useTranslation('home')

  return (
    <section id="los-gehts" className="bg-brand-deep text-white">
      <div className="mx-auto max-w-container px-4 py-24 lg:py-28 lg:px-0 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
          {t('final_cta.caption', 'Bereit loszulegen')}
        </p>
        <h2 className="mx-auto mt-4 max-w-3xl font-medium tracking-[-0.02em] text-white text-[clamp(28px,5vw,48px)] leading-[clamp(34px,5.6vw,56px)]">
          {t('final_cta.title', 'Bereit für laborgenaue Diagnostik in Ihrer Praxis?')}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          {t(
            'final_cta.subtitle',
            'Sprechen Sie mit unserem Team oder berechnen Sie Ihr Einsparpotenzial — herstellerübergreifend, IVDR/CE-konform und in 3–5 Werktagen einsatzbereit.',
          )}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button
            to="/contact"
            variant="secondary"
            className="!bg-accent !shadow-accent/20 hover:!bg-accent-strong focus-visible:!ring-accent"
          >
            {t('final_cta.cta_primary', 'Beratung buchen')}
          </Button>
          <Button href={roiHref} variant="outline">
            {t('final_cta.cta_secondary', 'ROI-Rechner')}
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.free', 'Kostenlos & unverbindlich')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.reply', 'Antwort < 24 h')}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/15">
            <Check size={13} className="text-accent-line" aria-hidden />
            {t('final_cta.chips.delivery', 'Lieferung in 3–5 Werktagen')}
          </span>
        </div>
      </div>
    </section>
  )
}

export default FinalCtaSection
