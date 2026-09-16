import { useState } from 'react'
import { Send, CheckCircle, Check, ShoppingBag } from 'lucide-react'
import { Button } from '../ui/Button'
import { sendPracticeOrder, type PracticeOrderProduct } from '../../api/practiceOrder'
import { useTranslation } from 'react-i18next'
import { normalizeLanguage } from '../../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * PraxisOrderForm — EINE geteilte Bestell-Sektion für die Produkt-Seiten
 * (VitaminD3ImplantologyPage & VitaminD3SprayPage). Ersetzt das zuvor pro Seite
 * duplizierte Markup.
 *
 * Sales-Machine-System: flache weiße Karte, Teal-Eyebrow, gefüllter Teal-Submit
 * (Button variant="secondary" + !bg-accent-Override), Friction-Killer-Microcopy.
 * AP22 PT22.5: sendet über die eigene Journey `practice_order` statt über
 * das Kontaktformular. Vorher entschied ein Freitext im Feld `area` über den
 * Mailempfänger.
 *
 * Vollständig prop-gesteuert (kein internes i18n), damit jede Seite ihre eigene
 * bestehende Copy (Spray = i18n, Implantologie = inline) unverändert weiterreicht.
 * SSR-sicher: State erst nach Interaktion, kein window/localStorage im Render-Pfad.
 */

export type PraxisOrderFormTexts = {
  caption: string
  title: string
  description: string
  quantityLabel: string
  addressHeading: string
  practiceLabel: string
  practicePlaceholder: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  messageLabel: string
  messagePlaceholder: string
  submit: string
  submitting: string
  submitNote: string
  /** Friction-Killer, z. B."Kostenlos & unverbindlich · Antwort < 24 h". */
  reassurance: string
  errorText: string
  /** AP22 PT22.5: Zustellproblem statt Eingabefehler — eigener Text x10. */
  errorRetryableText: string
  successTitle: string
  successText: string
}

export type PraxisOrderFormProps = {
  /** Anker-Id der Sektion (Sprungziel der Bestell-CTAs). */
  id?: string
  texts: PraxisOrderFormTexts
  quantityOptions: Array<{ value: string; label: string }>
  defaultQuantity: string
  /**
   * AP22 PT22.5: die serverseitig allowlistete Produkt-ID. Vorher stand hier
   * `area` — ein deutscher Freitext, an dem der Mailempfaenger hing.
   */
  product: PracticeOrderProduct
  messageNoneLabel: string
}

export function PraxisOrderForm({
  id = 'bestellformular',
  texts,
  quantityOptions,
  defaultQuantity,
  product,
  messageNoneLabel,
}: PraxisOrderFormProps) {
  const { i18n } = useTranslation()
  const [formData, setFormData] = useState({
    praxisName: '',
    ansprechpartner: '',
    email: '',
    phone: '',
    quantity: defaultQuantity,
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'retryable'>(
    'idle',
  )
  // Idempotency-Key: einmal pro Formular-Instanz, bleibt ueber Retries gleich.
  const [orderIdempotencyKey] = useState(() =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : 'order-' + String(Date.now()) + '-' + Math.random().toString(36).slice(2),
  )

  const inputClass =
    'w-full rounded-md border border-ui-field px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent'

  return (
    <section id={id} className="scroll-mt-24">
      <div className="rounded-2xl border border-accent/20 bg-white p-7 sm:p-7">
        <div className="mb-6">
          <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ShoppingBag className="h-5 w-5" aria-hidden />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
            {texts.caption}
          </p>
          <h2 className="text-2xl font-medium tracking-tight text-heading">{texts.title}</h2>
          <p className="mt-2 text-sm text-gray-700">{texts.description}</p>
        </div>

        {submitStatus === 'success' ? (
          /* AP24 PT24.1: die Bestaetigung ersetzt das Formular, wurde aber
             nicht angesagt — der Bereich wechselte fuer einen Screenreader
             stumm den Inhalt. `role="status"` meldet ihn hoeflich. */
          <div role="status" className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-accent" aria-hidden />
            <h3 className="mb-2 text-lg font-medium text-heading">{texts.successTitle}</h3>
            <p className="text-sm text-gray-700">{texts.successText}</p>
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (
                !formData.praxisName.trim() ||
                !formData.ansprechpartner.trim() ||
                !EMAIL_RE.test(formData.email.trim())
              ) {
                setSubmitStatus('error')
                return
              }
              setIsSubmitting(true)
              setSubmitStatus('idle')

              // AP20 PT20.2: derselbe Key pro Formular-Instanz haelt
              // Wiederholungen idempotent; Ergebnis ist ein SubmitResult.
              // AP22 PT22.5: eigene Journey statt Kontaktformular mit Magic
              // String. Produkt und Menge sind IDs; der Empfaenger haengt an
              // der Journey, nicht mehr an einem Freitextfeld.
              const result = await sendPracticeOrder(
                {
                  product,
                  quantity: Number(formData.quantity),
                  organization: formData.praxisName,
                  name: formData.ansprechpartner,
                  email: formData.email,
                  phone: formData.phone,
                  message: formData.message || messageNoneLabel,
                  orgType: 'praxis',
                  processingConsent: true,
                  consentAcceptedAt: new Date().toISOString(),
                  locale: normalizeLanguage(i18n.resolvedLanguage),
                },
                orderIdempotencyKey,
              )

              setIsSubmitting(false)
              // Ein Zustellproblem ist kein Eingabefehler: der Server sagt,
              // ob eine Wiederholung sicher ist.
              setSubmitStatus(result.ok ? 'success' : result.retryable ? 'retryable' : 'error')
            }}
            className="space-y-4"
            noValidate
          >
            <div>
              <label htmlFor="quantity" className="mb-1 block text-sm font-medium text-gray-700">
                {texts.quantityLabel} *
              </label>
              {/* AP24 PT24.1: Das Label trug ein Sternchen, das Bedienelement
                  selbst war nicht als Pflichtfeld ausgezeichnet — die Angabe
                  existierte nur optisch. Das Formular traegt `noValidate`, das
                  Attribut aendert also nur den Accessibility-Zustand, nicht das
                  Absendeverhalten. */}
              <select
                id="quantity"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full rounded-md border border-ui-field px-3 py-2.5 text-sm font-medium focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {quantityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-sm font-medium text-heading">{texts.addressHeading}</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="praxisName" className="mb-1 block text-sm text-gray-600">
                    {texts.practiceLabel} *
                  </label>
                  <input
                    type="text"
                    id="praxisName"
                    required
                    value={formData.praxisName}
                    onChange={(e) => setFormData({ ...formData, praxisName: e.target.value })}
                    className={inputClass}
                    placeholder={texts.practicePlaceholder}
                  />
                </div>
                <div>
                  <label htmlFor="ansprechpartner" className="mb-1 block text-sm text-gray-600">
                    {texts.nameLabel} *
                  </label>
                  <input
                    type="text"
                    id="ansprechpartner"
                    required
                    value={formData.ansprechpartner}
                    onChange={(e) => setFormData({ ...formData, ansprechpartner: e.target.value })}
                    className={inputClass}
                    placeholder={texts.namePlaceholder}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm text-gray-600">
                      {texts.emailLabel} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder={texts.emailPlaceholder}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm text-gray-600">
                      {texts.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder={texts.phonePlaceholder}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-1 block text-sm text-gray-600">
                {texts.messageLabel}
              </label>
              <textarea
                id="message"
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={inputClass}
                placeholder={texts.messagePlaceholder}
              />
            </div>

            {/* AP24 PT24.1: Die Meldung erscheint nach dem Absenden und ist
                der einzige Hinweis darauf, dass nichts passiert ist.
                `role="alert"` unterbricht bewusst. */}
            {(submitStatus === 'error' || submitStatus === 'retryable') && (
              <p role="alert" className="text-sm text-red-600">
                {submitStatus === 'retryable' ? texts.errorRetryableText : texts.errorText}
              </p>
            )}

            <Button
              type="submit"
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              className="w-full !bg-accent-strong !text-white hover:!brightness-110 focus-visible:!ring-accent"
            >
              {isSubmitting ? (
                texts.submitting
              ) : (
                <>
                  {texts.submit}
                  <Send className="h-4 w-4" aria-hidden />
                </>
              )}
            </Button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium text-accent-strong">
              <Check className="h-4 w-4 flex-shrink-0" aria-hidden />
              {texts.reassurance}
            </p>

            <p className="text-center text-xs text-gray-500">{texts.submitNote}</p>
          </form>
        )}
      </div>
    </section>
  )
}

export default PraxisOrderForm
