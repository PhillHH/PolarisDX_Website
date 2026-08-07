import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'

/**
 * SSR-safe interaktive ROI-Rechner-Sektion (#roi-rechner).
 * Client-State via useState; SSR rendert mit sichtbaren Default-Werten.
 * HWG/WAHRHEIT: Alle Ergebnisse folgen AUSSCHLIESSLICH aus Nutzereingaben — keine
 * PolarisDX-Zahl fliesst in die Formel ein. Unverbindliche Beispielrechnung.
 * SSR-sicher: kein window/localStorage im Render; fetch nur im Submit-Handler.
 */

// Liefert eine nicht-negative Zahl aus beliebiger Eingabe (leer/ungueltig -> 0).
const num = (v: string | number) => Math.max(0, parseFloat(String(v)) || 0)

const eur = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const RoiCalculatorSection = () => {
  const { t } = useTranslation('home')

  // --- Eingaben (Beispielwerte; deviceInvestment optional/leer) ---
  const [testsPerMonth, setTestsPerMonth] = useState('40')
  const [pricePerTest, setPricePerTest] = useState('35')
  const [materialCostPerTest, setMaterialCostPerTest] = useState('8')
  const [minutesPerTest, setMinutesPerTest] = useState('5')
  const [staffCostPerHour, setStaffCostPerHour] = useState('30')
  const [deviceInvestment, setDeviceInvestment] = useState('')

  // --- Capture-Form ---
  const [showForm, setShowForm] = useState(false)
  const [email, setEmail] = useState('')
  const [area, setArea] = useState('dental')
  const [practice, setPractice] = useState('')
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  // --- Berechnung (nur aus Nutzereingaben) ---
  const personalPerTest = (num(minutesPerTest) / 60) * num(staffCostPerHour)
  const dbPerTest = num(pricePerTest) - num(materialCostPerTest) - personalPerTest
  const revenuePerMonth = num(testsPerMonth) * num(pricePerTest)
  const dbPerMonth = num(testsPerMonth) * dbPerTest
  const dbPerYear = dbPerMonth * 12
  const payback =
    num(deviceInvestment) > 0 && dbPerMonth > 0
      ? Math.ceil(num(deviceInvestment) / dbPerMonth)
      : null

  const isNegative = dbPerTest < 0

  const inputs = [
    {
      id: 'roi-tests',
      label: t('roi.input.tests', 'Tests pro Monat'),
      value: testsPerMonth,
      onChange: setTestsPerMonth,
    },
    {
      id: 'roi-price',
      label: t('roi.input.price', 'Preis pro Test (€)'),
      value: pricePerTest,
      onChange: setPricePerTest,
    },
    {
      id: 'roi-material',
      label: t('roi.input.material', 'Materialkosten pro Test (€)'),
      value: materialCostPerTest,
      onChange: setMaterialCostPerTest,
    },
    {
      id: 'roi-minutes',
      label: t('roi.input.minutes', 'Minuten pro Test'),
      value: minutesPerTest,
      onChange: setMinutesPerTest,
    },
    {
      id: 'roi-staff',
      label: t('roi.input.staff', 'Personalkosten pro Stunde (€)'),
      value: staffCostPerHour,
      onChange: setStaffCostPerHour,
    },
    {
      id: 'roi-investment',
      label: t('roi.input.investment', 'Geräteinvestition (€, optional)'),
      value: deviceInvestment,
      onChange: setDeviceInvestment,
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validierung: E-Mail-Format + Consent + leeres Honeypot
    if (!EMAIL_RE.test(email) || consent !== true || hp !== '') {
      setStatus('error')
      return
    }

    setStatus('submitting')

    // TODO Backend POST /api/roi-report (Double-Opt-in + PDF) – Folge-Task, Endpoint noch nicht live.
    try {
      const res = await fetch('/api/roi-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          area,
          practice,
          consent,
          _hp: hp,
          inputs: {
            testsPerMonth,
            pricePerTest,
            materialCostPerTest,
            minutesPerTest,
            staffCostPerHour,
            deviceInvestment,
          },
          outputs: { dbPerTest, dbPerMonth, dbPerYear, revenuePerMonth, payback },
        }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        throw new Error('request failed')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="roi-rechner" className="bg-slate-50">
      <div className="mx-auto max-w-container px-4 py-24 lg:py-24 lg:px-0">
        {/* Kopf */}
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {t('roi.caption', 'ROI-Rechner')}
          </p>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-heading sm:text-4xl">
            {t('roi.title', 'Was bringt POC-Diagnostik Ihrer Praxis?')}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            {t(
              'roi.intro',
              'In unter einer Minute sehen, welches Selbstzahler-Potenzial chairside Diagnostik in Ihrer Praxis hat.',
            )}
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* LINKS: Eingabe-Karte */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7">
            <div className="grid gap-6 sm:grid-cols-2">
              {inputs.map((field) => (
                <div key={field.id} className="flex flex-col">
                  <label htmlFor={field.id} className="text-sm font-medium text-heading">
                    {field.label}
                  </label>
                  <input
                    id={field.id}
                    type="number"
                    min="0"
                    inputMode="decimal"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-heading focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">
              {t('roi.input.hint', 'Beispielwerte – bitte an Ihre Praxis anpassen.')}
            </p>
          </div>

          {/* RECHTS: Ergebnis-Karte */}
          <div className="rounded-2xl bg-brand-deep p-7 text-white">
            {/* Grosse Kennzahl */}
            <p className="text-sm text-white/70">{t('roi.out.month', 'Deckungsbeitrag / Monat')}</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">
              {eur.format(dbPerMonth)}
            </p>

            {isNegative ? (
              <div className="mt-5 rounded-lg bg-white/10 px-4 py-3 text-sm text-white ring-1 ring-white/15">
                {t(
                  'roi.warn_negative',
                  'Bei diesen Werten ist der Deckungsbeitrag negativ – bitte Preise/Kosten prüfen.',
                )}
              </div>
            ) : (
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-white/70">
                    {t('roi.out.revenue', 'Selbstzahler-Umsatz / Monat')}
                  </dt>
                  <dd className="font-medium">{eur.format(revenuePerMonth)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-white/70">{t('roi.out.year', 'Deckungsbeitrag / Jahr')}</dt>
                  <dd className="font-medium">{eur.format(dbPerYear)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-white/70">
                    {t('roi.out.per_test', 'Deckungsbeitrag je Test')}
                  </dt>
                  <dd className="font-medium">{eur.format(dbPerTest)}</dd>
                </div>
                {payback != null ? (
                  <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3">
                    <dt className="text-white/70">
                      {t('roi.out.payback', 'Amortisation (Monate)')}
                    </dt>
                    <dd className="font-medium">{payback}</dd>
                  </div>
                ) : (
                  <div className="border-t border-white/10 pt-3 text-white/70">
                    {t(
                      'roi.payback_hint',
                      'Für Ihre individuelle Amortisation: Beratung buchen oder Report anfordern.',
                    )}
                  </div>
                )}
              </dl>
            )}

            <div className="mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowForm((s) => !s)}
                aria-expanded={showForm}
                className="!bg-accent-strong !text-white hover:!bg-brand-deep focus-visible:!ring-accent"
              >
                {t('roi.cta_report', 'Vollständigen ROI-Report erhalten')}
              </Button>
              <p className="mt-2 text-xs text-white/60">
                {t('roi.report_hint', 'Als PDF an Ihre E-Mail')}
              </p>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-white/50">
              {t(
                'roi.disclaimer',
                'Unverbindliche Beispielrechnung auf Basis Ihrer Eingaben. Keine Zusage von Umsatz oder Gewinn.',
              )}
            </p>
          </div>
        </div>

        {/* CTAs unter der Ergebniskarte (heller Grund) */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            to="/contact"
            variant="secondary"
            size="sm"
            className="!bg-accent-strong !text-white hover:!bg-brand-deep focus-visible:!ring-accent"
          >
            {t('roi.cta_consult', 'Beratung buchen')}
          </Button>
        </div>

        {/* CAPTURE-FORM (Toggle) */}
        {showForm && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-7">
            {status === 'success' ? (
              <div className="rounded-lg bg-accent/10 px-4 py-3 text-sm text-heading ring-1 ring-accent-line">
                {t('roi.form.success', 'Danke! Wir senden Ihnen den Report in Kürze.')}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor="roi-email" className="text-sm font-medium text-heading">
                      {t('roi.form.email', 'E-Mail-Adresse')}
                    </label>
                    <input
                      id="roi-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-heading focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="roi-area" className="text-sm font-medium text-heading">
                      {t('roi.form.field', 'Fachrichtung')}
                    </label>
                    <select
                      id="roi-area"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-heading focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      <option value="dental">{t('roi.form.opt_dental', 'Dental')}</option>
                      <option value="beauty">{t('roi.form.opt_beauty', 'Beauty')}</option>
                      <option value="longevity">{t('roi.form.opt_longevity', 'Longevity')}</option>
                      <option value="other">{t('roi.form.opt_other', 'Andere')}</option>
                    </select>
                  </div>
                  <div className="flex flex-col sm:col-span-2">
                    <label htmlFor="roi-practice" className="text-sm font-medium text-heading">
                      {t('roi.form.practice', 'Praxisname (optional)')}
                    </label>
                    <input
                      id="roi-practice"
                      type="text"
                      value={practice}
                      onChange={(e) => setPractice(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-heading focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>
                </div>

                {/* Honeypot – fuer Menschen unsichtbar */}
                <input
                  type="text"
                  name="_hp"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                />

                <label className="flex items-start gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-accent focus:ring-accent"
                  />
                  <span>
                    {t(
                      'roi.form.consent',
                      'Ich willige ein, dass meine Angaben zur Zusendung des Reports und zur Kontaktaufnahme verarbeitet werden.',
                    )}{' '}
                    <Link to="/privacy" className="text-accent underline hover:text-accent-strong">
                      {t('roi.form.privacy', 'Datenschutzerklärung')}
                    </Link>
                  </span>
                </label>

                {status === 'error' && (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {t(
                      'roi.form.error',
                      'Aktuell nicht möglich – bitte buchen Sie direkt eine Beratung.',
                    )}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="secondary"
                  size="sm"
                  disabled={status === 'submitting'}
                  className="!bg-accent-strong hover:!bg-brand-deep focus-visible:!ring-accent"
                >
                  {status === 'submitting'
                    ? t('roi.form.sending', 'Wird gesendet …')
                    : t('roi.form.submit', 'Report anfordern')}
                </Button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default RoiCalculatorSection
