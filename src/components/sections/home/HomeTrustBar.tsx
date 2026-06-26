import { useTranslation } from 'react-i18next'

/**
 * HomeTrustBar — schlanke Credibility-Leiste auf hellem Grund (§NEWLOOK-HOME §4.2).
 *
 * Vier ruhige Kennzahlen als Glaubwürdigkeits-Anker direkt unter dem Hero.
 * Inhalt aus bestehenden Claims (Präzision, Lieferzeit, Kompatibilität,
 * Rezensionen) — keine erfundenen Fakten. Reine Daten-Definitionsliste, AA-Kontrast.
 */
const HomeTrustBar = () => {
  const { t } = useTranslation('home')

  const stats = [
    { value: t('trust.cv_value', 'CV < 2 %'), label: t('trust.cv_label', 'Präzision über den gesamten Messbereich') },
    { value: t('trust.ready_value', '3–5 Werktage'), label: t('trust.ready_label', 'Einsatzbereit nach Bestellung') },
    { value: t('trust.compat_value', '90 %'), label: t('trust.compat_label', 'der Lateral-Flow-Tests kompatibel') },
    { value: t('trust.reviews_value', '250+'), label: t('trust.reviews_label', 'Bewertungen aus dem Praxisalltag') },
  ]

  return (
    <section aria-label={t('trust.title', 'Worauf Praxen sich verlassen')} className="border-y border-border bg-bg-subtle/60">
      <div className="mx-auto max-w-container px-4 py-10 lg:px-0 lg:py-12">
        <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="border-l-2 border-brand-blue/30 pl-4">
              <dd className="text-3xl font-semibold tracking-tight text-fg-heading sm:text-4xl">
                {s.value}
              </dd>
              <dt className="mt-2 text-sm leading-snug text-fg-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export default HomeTrustBar
