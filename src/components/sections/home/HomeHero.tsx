import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Clock3 } from 'lucide-react'
import { Button } from '~/design-system'

/**
 * HomeHero — „Clarity Hero" der NEWLOOK-Startseite (§NEWLOOK-HOME §3).
 *
 * Fotografie-forward nach Philips-Vorbild: ein GROSSES, echtes Dokumentarfoto
 * (eigene Praxis-/Beratungsaufnahme) dominiert ~60 % above-the-fold; daneben ein
 * ruhiger, weißer Textblock mit großer Display-H1, EINEM Satz Subline und genau
 * EINEM Primär-CTA (+ leiser Sekundär-Textlink) sowie einer schlanken Trust-Zeile.
 * Kein Slider, keine Einstiegsanimation. Auf lg blutet das Foto bis zum
 * Viewport-Rand (volle Bildwirkung), mobil steht es als großes Bild unter dem Text.
 *
 * Bilder sind EIGENE Assets (public/images, web-optimiertes webp). LCP: H1 + Foto
 * sofort sichtbar (fetchPriority="high").
 */
const HERO_PHOTO = '/images/clinic-consultation.webp'
const DOCTOR_THUMB = '/images/doctor-igloopro.webp'

const HomeHero = () => {
  const { t } = useTranslation('home')

  const photoAlt = t(
    'hero.image_alt',
    'Ärztin und Pflegekraft im Patientengespräch in einer modernen Praxis',
  )
  const chipValue = t('spotlight.spec1_value', '3 Min')
  const chipLabel = t('spotlight.spec1_label', 'Ergebnis am Behandlungsstuhl')

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden bg-surface"
    >
      {/* lg: großflächiges Dokumentarfoto, randvoll bis zum Viewport-Rand. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50vw] lg:block xl:w-[52vw]">
        <img
          src={HERO_PHOTO}
          alt={photoAlt}
          width={1280}
          height={1280}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[60%_center]"
        />
        {/* Sanfter Verlauf links für nahtlosen Übergang ins Weiß (rein dekorativ). */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent"
        />
      </div>

      <div className="relative mx-auto max-w-container px-4 lg:px-0">
        <div className="grid items-center gap-10 lg:min-h-[660px] lg:grid-cols-2 lg:gap-0 xl:min-h-[720px]">
          {/* Textspalte */}
          <div className="max-w-2xl pt-28 sm:pt-32 lg:py-24 lg:pr-12 xl:pr-16">
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

          {/* Mobil/Tablet: großes Foto unter dem Text (lg von der Bleed-Fläche ersetzt). */}
          <div className="relative pb-12 lg:hidden">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-2 ring-1 ring-border sm:aspect-[16/10]">
              <img
                src={HERO_PHOTO}
                alt={photoAlt}
                width={1024}
                height={768}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <HeroChip thumbAlt={photoAlt} value={chipValue} label={chipLabel} />
          </div>
        </div>
      </div>

      {/* lg: schwebende Ergebnis-Kachel über dem Bleed-Foto (eigenes Foto als Avatar). */}
      <div className="pointer-events-none absolute bottom-10 right-6 hidden lg:block xl:right-[calc((100vw-1200px)/2+1.5rem)]">
        <HeroChip thumbAlt={photoAlt} value={chipValue} label={chipLabel} />
      </div>
    </section>
  )
}

/** Premium-Credibility-Kachel: eigenes Ärztin-/Gerätefoto + „Ergebnis in 3 Min". */
const HeroChip = ({
  thumbAlt,
  value,
  label,
}: {
  thumbAlt: string
  value: string
  label: string
}) => (
  <div className="pointer-events-auto inline-flex items-center gap-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-2 backdrop-blur">
    <img
      src={DOCTOR_THUMB}
      alt={thumbAlt}
      width={44}
      height={44}
      loading="lazy"
      decoding="async"
      className="h-11 w-11 rounded-xl bg-bg-subtle object-cover object-top"
    />
    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy/5 text-brand-blue">
      <Clock3 className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
    </span>
    <div className="leading-tight">
      <p className="text-sm font-semibold text-fg-heading">{value}</p>
      <p className="text-xs text-fg-muted">{label}</p>
    </div>
  </div>
)

export default HomeHero
