import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Clock3 } from 'lucide-react'
import { Button } from '~/design-system'
import heroDoctor from '../../../assets/hero_doctor.webp'

/**
 * HomeHero — „Clarity Hero" der NEWLOOK-Startseite (§NEWLOOK-HOME §3).
 *
 * Ruhig, groß, glaubwürdig: weißer Grund mit weichem Blau-Wash, eine
 * selbstbewusste Aussage (H1) statt des bisherigen Navy-Sliders. Links Value-
 * Proposition + genau ein Primär-CTA + Sekundär-Textlink + schlanke Trust-Stats;
 * rechts das freigestellte Praxisfoto (Ärztin + IglooPro) auf einer hellen
 * Panel-Fläche. LCP: H1 + Bild sofort sichtbar (fetchPriority high), keine
 * Einstiegsanimation.
 */
const HomeHero = () => {
  const { t } = useTranslation('home')

  return (
    <section id="hero" className="relative overflow-hidden bg-surface">
      {/* Dekorativer Blau-Wash rechts + zarter Raster — reine Atmosphäre (a11y: hidden). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[640px] w-[640px] rounded-full bg-brand-blue/10 blur-3xl" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-brand-blue/5 to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-[0.04]" />
      </div>

      <div className="relative mx-auto max-w-container px-4 pb-16 pt-28 sm:pt-32 lg:px-0 lg:pb-28 lg:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Inhalt */}
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-overline text-brand-blue-bright sm:text-sm">
              <span aria-hidden="true" className="h-px w-8 bg-brand-blue-bright/50" />
              {t('hero.caption', 'Point-of-Care-Diagnostik')}
            </span>

            <h1 className="mt-6 text-display font-semibold tracking-headline text-fg-heading">
              {t('hero.title', 'Laborergebnisse in 3 Minuten — direkt in Ihrer Praxis.')}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg sm:text-lg">
              {t(
                'hero.description',
                'Sichern Sie sich das Performance-Paket: Ihr IglooPro ist in 3–5 Werktagen einsatzbereit – garantiert.',
              )}
            </p>

            <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
              <Button to="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                {t('hero.cta', 'Termin buchen')}
              </Button>
              <Link
                to="/downloads"
                className="group inline-flex min-h-[var(--tap-target-min)] items-center justify-center gap-2 rounded-md px-2 text-base font-semibold text-fg-heading transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] sm:justify-start"
              >
                {t('hero.cta_downloads', 'Infomaterialien herunterladen')}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>
            </div>

            {/* Trust-Stats (schlank, mit Divider) */}
            <dl className="mt-12 flex flex-wrap items-start gap-x-10 gap-y-6 border-t border-border pt-8">
              <div>
                <dt className="sr-only">
                  {t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
                </dt>
                <dd className="text-2xl font-semibold tracking-tight text-fg-heading sm:text-3xl">
                  {t('hero.stat1.value', '3–5 Werktage')}
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  {t('hero.stat1.label', 'Einsatzbereit nach Bestellung')}
                </p>
              </div>
              <div className="hidden h-12 w-px self-center bg-border sm:block" aria-hidden="true" />
              <div>
                <dt className="sr-only">
                  {t('hero.stat2.label', 'Präzision über den gesamten Messbereich')}
                </dt>
                <dd className="text-2xl font-semibold tracking-tight text-fg-heading sm:text-3xl">
                  {t('hero.stat2.value', 'CV < 2%')}
                </dd>
                <p className="mt-1 text-sm text-fg-muted">
                  {t('hero.stat2.label', 'Präzision über den gesamten Messbereich')}
                </p>
              </div>
            </dl>
          </div>

          {/* Bild — freigestelltes Praxisfoto auf heller Panel-Fläche */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-blue/15 via-bg-subtle to-surface shadow-2 ring-1 ring-brand-blue/10">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue/15 blur-2xl"
              />
              <img
                src={heroDoctor}
                alt="Ärztin mit dem IglooPro POC-Reader in der Praxis"
                width={520}
                height={650}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-x-0 bottom-0 mx-auto h-[108%] w-auto max-w-none object-contain object-bottom drop-shadow-xl"
              />
            </div>

            {/* Schwebende Ergebnis-Kachel (premium, ruhig) */}
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-2 backdrop-blur sm:left-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-blue">
                <Clock3 className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-fg-heading">
                  {t('spotlight.spec1_value', '3 Min')}
                </p>
                <p className="text-xs text-fg-muted">
                  {t('spotlight.spec1_label', 'Ergebnis am Behandlungsstuhl')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
