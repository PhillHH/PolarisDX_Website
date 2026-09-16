/**
 * Consumer order intake form + matching section wrapper
 *
 * AP21 PT21.5 — Consumer Ordering laeuft ueber die geteilte Lead-Foundation:
 * `useConsumerOrderForm` haelt die Statusmaschine, sendet einen stabilen
 * Idempotency-Key und meldet Erfolg erst, wenn der Server die Anfrage
 * dauerhaft persistiert hat. Produkt, Variante und Menge gehen als
 * allowlistete IDs raus, nie als freie Labels.
 *
 * GDPR-friendly:
 *   - Explicit, separate consent checkbox (NOT pre-ticked) with a clear
 * purpose statement and the legal basis (Art. 6(1)(b) GDPR).
 *   - Only the fields actually needed for the order intake are collected
 *     (data minimisation). Shipping address / payment details are
 * collected by sales later, when they confirm price + delivery.
 *   - Link to the privacy policy.
 *   - Honeypot field to silently absorb spam bots — no tracking cookies.
 *
 * Submits to `/api/consumer-order` (server/server.js). Recipients are
 * pinned server-side (ulrikes / inesr / adrianoz / contact @polarisdx.net).
 */

import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { TFunction } from 'i18next'

import type {
  ConsumerOrderProduct,
  ConsumerOrderQuantity,
  ConsumerOrderVariant,
} from '../../api/consumerOrder'
import { CONSUMER_PRODUCTS } from '../../content/consumer/products'
import { useConsumerOrderForm } from '../../hooks/useConsumerOrderForm'
import { trackConsumerOrderSubmit, type ConsumerPage } from './tracking'
import { normalizeLanguage } from '../../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// =============================================================================
// PRODUCT METADATA
// =============================================================================

/**
 * Die Menge ist eine ALLOWLISTETE Kennung, kein freier Text. Bis PT21.4
 * ging hier ein englischer Satz wie `'1 pack (12 bottles)'` ungeprueft an
 * den Server und von dort direkt in die Mail. Jetzt gehen 1/2/3 oder der
 * ausdrueckliche Beratungsfall raus; das Gebinde steckt in der Variante.
 * Die sichtbaren Labels bleiben die freigegebene x10-Copy.
 */
const getQuantityOptions = (
  t: TFunction,
): Record<ConsumerOrderProduct, { value: ConsumerOrderQuantity; label: string }[]> => ({
  spray: [
    { value: 1, label: t('order_form.copy_001') },
    { value: 2, label: t('order_form.copy_002') },
    { value: 3, label: t('order_form.copy_003') },
    { value: 'MORE', label: t('order_form.copy_004') },
  ],
  masks: [
    { value: 1, label: t('order_form.copy_005') },
    { value: 2, label: t('order_form.copy_006') },
    { value: 3, label: t('order_form.copy_007') },
    { value: 'MORE', label: t('order_form.copy_004') },
  ],
  duo: [
    { value: 1, label: t('order_form.copy_008') },
    { value: 2, label: t('order_form.copy_009') },
    { value: 3, label: t('order_form.copy_010') },
    { value: 'MORE', label: t('order_form.copy_004') },
  ],
})

const parseQuantity = (raw: string): ConsumerOrderQuantity =>
  raw === 'MORE' ? 'MORE' : (Number(raw) as 1 | 2 | 3)

// =============================================================================
// INPUT PRIMITIVES (light styling, brand-aligned focus ring)
// =============================================================================

// AP24 PT24.3: der Fokusring war `accent-line/30` — Teal-500 bei 30 Prozent
// Deckkraft auf Weiss, gemessen rund 1,3:1. Zusammen mit `outline-none` blieb
// vom Fokus praktisch nichts uebrig. `accent-strong` liegt bei 5,47:1 auf
// Weiss und ist derselbe Ton, den die Consumer-Flaeche ohnehin als Akzent
// traegt.
const inputClass =
  'w-full rounded-md border border-ui-field bg-white px-4 py-3 text-heading placeholder:text-ui-field transition-colors focus:border-accent-strong focus:outline-none focus:ring-2 focus:ring-accent-strong disabled:bg-slate-100'

const labelClass = 'mb-1.5 block text-sm font-semibold text-heading'

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: ReactNode
  required?: boolean
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 mb-4 first:mt-0">
      <span className="inline-block text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">
        {children}
      </span>
      <span aria-hidden className="ml-3 inline-block h-px w-8 align-middle bg-accent-border" />
    </div>
  )
}

// =============================================================================
// ORDER FORM
// =============================================================================

interface OrderFormProps {
  product: ConsumerOrderProduct
  /** Which consumer page (for tracking submit event). */
  page: ConsumerPage
  /** Optional submit button label override. */
  submitLabel?: string
  /** Called once the form has been submitted successfully (e.g. so a
   * hosting modal can mark this session as"submitted"). */
  onSubmitted?: () => void
}

export function OrderForm({ product, page, submitLabel, onSubmitted }: OrderFormProps) {
  const { t, i18n } = useTranslation('consumer')
  const QUANTITY_OPTIONS = getQuantityOptions(t)
  // Contact
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  // Company
  const [company, setCompany] = useState('')
  // Shipping address
  const [street, setStreet] = useState('')
  const [postcode, setPostcode] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  // Order
  const [quantity, setQuantity] = useState<ConsumerOrderQuantity>(
    QUANTITY_OPTIONS[product][0].value,
  )
  const [message, setMessage] = useState('')
  // Consent + spam — Verarbeitung ist Pflicht, Marketing strikt getrennt.
  const [consent, setConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [hp, setHp] = useState('') // honeypot — must stay empty

  const { isSubmitting, status, orderReference, submit } = useConsumerOrderForm()
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isSubmitting) return
    if (!name.trim()) return setErrorMsg(t('order_form.name_required'))
    if (!EMAIL_RE.test(email.trim())) return setErrorMsg(t('order_form.email_invalid'))
    if (!consent) return setErrorMsg(t('order_form.consent_required'))
    setErrorMsg('')

    const res = await submit({
      product,
      variant: CONSUMER_PRODUCTS[product].orderVariant as ConsumerOrderVariant,
      quantity,
      name,
      email,
      phone,
      company,
      street,
      postcode,
      city,
      country,
      message,
      consent,
      marketingConsent,
      locale: normalizeLanguage(i18n.resolvedLanguage),
      _hp: hp,
    })

    if (res.ok) {
      // Tracking erst NACH bestaetigter Persistenz und nur mit
      // Analytics-Einwilligung. Ohne Consent wird nichts gepusht — die
      // Bestellung selbst haengt daran an keiner Stelle.
      trackConsumerOrderSubmit(page, product, quantity)
      onSubmitted?.()
    } else {
      setErrorMsg(
        t(
          res.retryable
            ? 'order_form.error_retryable'
            : res.fields.includes('email')
              ? 'order_form.email_invalid'
              : res.fields.includes('name') || res.fields.length > 0
                ? 'order_form.required_fields'
                : 'order_form.error_default',
        ),
      )
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-white p-7 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/15 text-accent-strong">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-7 w-7"
            aria-hidden
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-semibold text-heading">{t('order_form.copy_011')}</h3>
        <p className="mx-auto mt-3 max-w-md text-gray-600">{t('order_form.copy_012')}</p>
        {orderReference && (
          <p className="mx-auto mt-4 max-w-md text-sm text-gray-600">
            {t('order_form.reference_label')}{' '}
            <span className="font-semibold text-heading">{orderReference}</span>
          </p>
        )}
        <p className="mx-auto mt-4 max-w-md text-xs text-gray-600">
          {t('order_form.success_not_purchase')}
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-white p-7 sm:p-7 md:p-10"
      data-gtm-form="consumer-order"
      data-gtm-product={product}
      data-gtm-page={page}
    >
      {/* Honeypot — visually & semantically hidden; bots tend to fill it */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          height: 1,
          width: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="consumer-hp">{t('order_form.copy_013')}</label>
        <input
          id="consumer-hp"
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <SectionLabel>{t('order_form.copy_014')}</SectionLabel>
      <div className="grid gap-6 sm:grid-cols-2">
        <Field id="order-name" label={t('order_form.copy_015')} required>
          <input
            id="order-name"
            type="text"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="order-email" label={t('order_form.copy_016')} required>
          <input
            id="order-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field id="order-phone" label={t('order_form.copy_017')}>
          <input
            id="order-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>

      <SectionLabel>{t('order_form.copy_018')}</SectionLabel>
      <Field id="order-company" label={t('order_form.copy_019')}>
        <input
          id="order-company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
          placeholder={t('order_form.copy_020')}
        />
      </Field>

      <SectionLabel>{t('order_form.copy_021')}</SectionLabel>
      <p className="-mt-2 mb-4 text-xs text-gray-500">{t('order_form.copy_022')}</p>
      <div className="grid gap-6">
        <Field id="order-street" label={t('order_form.copy_023')}>
          <input
            id="order-street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-6 sm:grid-cols-[1fr_2fr_1.4fr]">
          <Field id="order-postcode" label={t('order_form.copy_024')}>
            <input
              id="order-postcode"
              type="text"
              autoComplete="postal-code"
              inputMode="text"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field id="order-city" label={t('order_form.copy_025')}>
            <input
              id="order-city"
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field id="order-country" label={t('order_form.copy_026')}>
            <input
              id="order-country"
              type="text"
              autoComplete="country-name"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <SectionLabel>{t('order_form.copy_027')}</SectionLabel>
      <div className="grid gap-6">
        <Field id="order-quantity" label={t('order_form.copy_028')} required>
          <select
            id="order-quantity"
            required
            value={String(quantity)}
            onChange={(e) => setQuantity(parseQuantity(e.target.value))}
            className={inputClass}
          >
            {QUANTITY_OPTIONS[product].map((o) => (
              <option key={String(o.value)} value={String(o.value)}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id="order-message" label={t('order_form.copy_029')}>
          <textarea
            id="order-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t(
              product === 'spray'
                ? 'order_form.message_placeholder_spray'
                : 'order_form.message_placeholder_default',
            )}
            className={inputClass}
          />
        </Field>
      </div>

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 flex-none rounded border-ui-field text-accent focus:ring-accent-strong"
        />
        <span className="text-sm leading-relaxed text-gray-600">
          {t('order_form.copy_030')}{' '}
          <Link
            to="/privacy"
            className="font-medium text-accent-strong underline hover:text-brand-deep"
          >
            {t('order_form.copy_031')}
          </Link>
          .
        </span>
      </label>
      <p className="mt-2 pl-7 text-xs text-gray-600">{t('order_form.copy_032')}</p>

      {/* Marketing-Consent — ausdruecklich OPTIONAL und getrennt von der
          Verarbeitung. Eine Ablehnung blockiert die Bestellanfrage nicht. */}
      <label className="mt-4 flex items-start gap-3">
        <input
          type="checkbox"
          checked={marketingConsent}
          onChange={(e) => setMarketingConsent(e.target.checked)}
          className="mt-1 h-4 w-4 flex-none rounded border-ui-field text-accent focus:ring-accent-strong"
        />
        <span className="text-sm leading-relaxed text-gray-600">
          {t('order_form.marketing_consent')}
        </span>
      </label>

      {status === 'terminal-error' && (
        <div
          role="alert"
          className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {t('order_form.error_terminal')}
        </div>
      )}

      {status !== 'terminal-error' && errorMsg && (
        <div
          role="alert"
          className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {errorMsg}
        </div>
      )}

      <div className="mt-7">
        <button
          type="submit"
          disabled={isSubmitting}
          data-gtm-event="consumer_order_submit"
          data-gtm-page={page}
          data-gtm-product={product}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-deep px-7 py-3.5 text-base font-semibold tracking-tight text-white transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-strong focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? t('order_form.sending') : submitLabel || t('order_form.submit')}
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-500">{t('order_form.copy_033')}</p>
    </form>
  )
}

// =============================================================================
// ORDER SECTION — dark navy intro band + form card (page-level wrapper)
// =============================================================================

export function OrderSection({
  id = 'order',
  page,
  product,
  title,
  body,
  submitLabel,
}: {
  id?: string
  page: ConsumerPage
  product: ConsumerOrderProduct
  title: string
  body: string
  submitLabel?: string
}) {
  return (
    <section id={id} className="relative overflow-hidden bg-brand-deep py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-line/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center text-white sm:px-6 lg:px-0">
        <span
          aria-hidden
          className="mx-auto mb-6 block h-[3px] w-12 rounded-full bg-accent-on-dark"
        />
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">{body}</p>
      </div>
      <div className="relative mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-0">
        <OrderForm product={product} page={page} submitLabel={submitLabel} />
      </div>
    </section>
  )
}
