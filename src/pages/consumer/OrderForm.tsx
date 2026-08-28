/**
 * Consumer order intake form + matching section wrapper
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

import { sendConsumerOrder, type ConsumerOrderProduct } from '../../api/consumerOrder'
import type { ConsumerPage } from './tracking'
import { normalizeLanguage } from '../../i18n'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// =============================================================================
// PRODUCT METADATA
// =============================================================================

const getQuantityOptions = (
  t: TFunction,
): Record<ConsumerOrderProduct, { value: string; label: string }[]> => ({
  spray: [
    { value: '1 pack (12 bottles)', label: t('order_form.copy_001') },
    { value: '2 packs (24 bottles)', label: t('order_form.copy_002') },
    { value: '3 packs (36 bottles)', label: t('order_form.copy_003') },
    { value: 'More — please advise', label: t('order_form.copy_004') },
  ],
  masks: [
    { value: '1 box (5 masks)', label: t('order_form.copy_005') },
    { value: '2 boxes (10 masks)', label: t('order_form.copy_006') },
    { value: '3 boxes (15 masks)', label: t('order_form.copy_007') },
    { value: 'More — please advise', label: t('order_form.copy_004') },
  ],
  duo: [
    { value: '1 Duo set', label: t('order_form.copy_008') },
    { value: '2 Duo sets', label: t('order_form.copy_009') },
    { value: '3 Duo sets', label: t('order_form.copy_010') },
    { value: 'More — please advise', label: t('order_form.copy_004') },
  ],
})

// =============================================================================
// INPUT PRIMITIVES (light styling, brand-aligned focus ring)
// =============================================================================

const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-heading placeholder:text-gray-400 transition-colors focus:border-accent-line focus:outline-none focus:ring-2 focus:ring-accent-line/30 disabled:bg-slate-100'

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
  const [quantity, setQuantity] = useState(QUANTITY_OPTIONS[product][0].value)
  const [message, setMessage] = useState('')
  // Consent + spam
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('') // honeypot — must stay empty

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return
    if (!name.trim()) {
      setErrorMsg(t('order_form.name_required'))
      setStatus('error')
      return
    }
    if (!EMAIL_RE.test(email.trim())) {
      setErrorMsg(t('order_form.email_invalid'))
      setStatus('error')
      return
    }
    if (!consent) {
      setErrorMsg(t('order_form.consent_required'))
      setStatus('error')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    const res = await sendConsumerOrder({
      product,
      quantity,
      quantityLabel:
        QUANTITY_OPTIONS[product].find((option) => option.value === quantity)?.label || quantity,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      street: street.trim() || undefined,
      postcode: postcode.trim() || undefined,
      city: city.trim() || undefined,
      country: country.trim() || undefined,
      message: message.trim() || undefined,
      consent,
      _hp: hp,
      locale: normalizeLanguage(i18n.resolvedLanguage),
    })

    if (res.ok) {
      setStatus('success')
      // GTM dataLayer — conversion event for the team to wire up
      if (typeof window !== 'undefined') {
        // Existing AP23-owned tracking path; PT08 only adds locale propagation
        // and must not change its consent/event semantics.
        // eslint-disable-next-line react-hooks/immutability
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'consumer_order_submit',
          consumer_page: page,
          product,
          quantity,
        })
      }
      onSubmitted?.()
    } else {
      setStatus('error')
      const errorKey =
        res.code === 'CONSENT_REQUIRED'
          ? 'order_form.consent_required'
          : res.code === 'INVALID_EMAIL'
            ? 'order_form.email_invalid'
            : res.code === 'REQUIRED_FIELDS'
              ? 'order_form.required_fields'
              : 'order_form.error_default'
      setErrorMsg(t(errorKey))
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
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClass}
          >
            {QUANTITY_OPTIONS[product].map((o) => (
              <option key={o.value} value={o.value}>
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
          className="mt-1 h-4 w-4 flex-none rounded border-slate-300 text-accent focus:ring-accent-line"
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
      <p className="mt-2 pl-7 text-xs text-gray-500">{t('order_form.copy_032')}</p>

      {status === 'error' && errorMsg && (
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
          disabled={status === 'submitting'}
          data-gtm-event="consumer_order_submit"
          data-gtm-page={page}
          data-gtm-product={product}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-deep px-7 py-3.5 text-base font-semibold tracking-tight text-white transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting'
            ? t('order_form.sending')
            : submitLabel || t('order_form.submit')}
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
