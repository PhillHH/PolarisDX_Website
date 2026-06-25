/**
 * Consumer order intake form + matching section wrapper
 *
 * GDPR-friendly:
 *   - Explicit, separate consent checkbox (NOT pre-ticked) with a clear
 *     purpose statement and the legal basis (Art. 6(1)(b) GDPR).
 *   - Only the fields actually needed for the order intake are collected
 *     (data minimisation). Shipping address / payment details are
 *     collected by sales later, when they confirm price + delivery.
 *   - Link to the privacy policy.
 *   - Honeypot field to silently absorb spam bots — no tracking cookies.
 *
 * Submits to `/api/consumer-order` (server/server.js). Recipients are
 * pinned server-side (ulrikes / inesr / adrianoz / contact @polarisdx.net).
 */

import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { sendConsumerOrder, type ConsumerOrderProduct } from '../../api/consumerOrder'
import type { ConsumerPage } from './tracking'

// =============================================================================
// PRODUCT METADATA
// =============================================================================

const QUANTITY_OPTIONS: Record<ConsumerOrderProduct, { value: string; label: string }[]> = {
  spray: [
    { value: '1 pack (12 bottles)', label: '1 pack (12 bottles)' },
    { value: '2 packs (24 bottles)', label: '2 packs (24 bottles)' },
    { value: '3 packs (36 bottles)', label: '3 packs (36 bottles)' },
    { value: 'More — please advise', label: 'More — please advise' },
  ],
  masks: [
    { value: '1 box (5 masks)', label: '1 box (5 masks)' },
    { value: '2 boxes (10 masks)', label: '2 boxes (10 masks)' },
    { value: '3 boxes (15 masks)', label: '3 boxes (15 masks)' },
    { value: 'More — please advise', label: 'More — please advise' },
  ],
  duo: [
    { value: '1 Duo set', label: '1 Duo set' },
    { value: '2 Duo sets', label: '2 Duo sets' },
    { value: '3 Duo sets', label: '3 Duo sets' },
    { value: 'More — please advise', label: 'More — please advise' },
  ],
}

const DEFAULT_SUBMIT_LABEL: Record<ConsumerOrderProduct, string> = {
  spray: 'Send order request',
  masks: 'Send order request',
  duo: 'Send order request',
}

// =============================================================================
// INPUT PRIMITIVES (light styling, brand-aligned focus ring)
// =============================================================================

const inputClass =
  'w-full rounded-md border border-[var(--color-border-strong)] bg-surface px-4 py-3 text-fg-heading placeholder:text-fg-muted transition-colors focus:border-accent-line focus:outline-none focus:ring-2 focus:ring-accent-line/30 disabled:bg-bg-subtle'

const labelClass = 'mb-1.5 block text-sm font-semibold text-fg-heading'

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: ReactNode
  required?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-[var(--color-danger-fg)]">
          {error}
        </p>
      )}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-7 mb-4 first:mt-0">
      <span className="inline-block text-xs font-semibold uppercase tracking-overline text-accent-strong">
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
   *  hosting modal can mark this session as "submitted"). */
  onSubmitted?: () => void
  /** Reports whether the form holds unsaved input, so a hosting modal can
   *  guard against accidental data loss on close. */
  onDirtyChange?: (dirty: boolean) => void
}

// Pragmatic email shape check — intentionally lenient (the server is the
// source of truth); we only catch obviously-wrong input before submit.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function OrderForm({
  product,
  page,
  submitLabel,
  onSubmitted,
  onDirtyChange,
}: OrderFormProps) {
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
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({})

  // Tell the host modal whether there's unsaved input worth guarding.
  useEffect(() => {
    if (!onDirtyChange) return
    const dirty =
      status !== 'success' &&
      Boolean(name || email || phone || company || street || postcode || city || country || message)
    onDirtyChange(dirty)
  }, [onDirtyChange, status, name, email, phone, company, street, postcode, city, country, message])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'submitting') return

    // Inline client-side validation (plain-text errors, no data loss).
    const nextFieldErrors: { name?: string; email?: string } = {}
    if (!name.trim()) {
      nextFieldErrors.name = 'Please enter a contact name.'
    }
    if (!email.trim()) {
      nextFieldErrors.email = 'Please enter an email address so we can reply.'
    } else if (!EMAIL_RE.test(email.trim())) {
      nextFieldErrors.email = 'Please enter a valid email address (e.g. name@example.com).'
    }
    if (nextFieldErrors.name || nextFieldErrors.email) {
      setFieldErrors(nextFieldErrors)
      setStatus('error')
      setErrorMsg('')
      const firstInvalid = nextFieldErrors.name ? 'order-name' : 'order-email'
      document.getElementById(firstInvalid)?.focus()
      return
    }
    setFieldErrors({})

    if (!consent) {
      setErrorMsg('Please confirm consent to data processing before sending your order.')
      setStatus('error')
      return
    }
    setStatus('submitting')
    setErrorMsg('')

    const res = await sendConsumerOrder({
      product,
      quantity,
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
    })

    if (res.ok) {
      setStatus('success')
      // GTM dataLayer — conversion event for the team to wire up
      if (typeof window !== 'undefined') {
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
      setErrorMsg(res.error || 'Something went wrong — please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl bg-surface p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-accent-strong">
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
        <h3 className="mt-5 text-2xl font-bold text-fg-heading">
          Thank you — your order request is in.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-fg">
          We'll be in touch within two working days with pricing, shipping and payment details. No
          spam, no newsletters — only the follow-up on this order.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl bg-surface p-6 shadow-card sm:p-8 md:p-10"
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
        <label htmlFor="consumer-hp">Leave this field blank</label>
        <input
          id="consumer-hp"
          type="text"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <SectionLabel>Contact person</SectionLabel>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="order-name" label="Contact name" required error={fieldErrors.name}>
          <input
            id="order-name"
            type="text"
            required
            autoComplete="name"
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? 'order-name-error' : undefined}
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }))
            }}
            className={inputClass}
          />
        </Field>
        <Field id="order-email" label="Email" required error={fieldErrors.email}>
          <input
            id="order-email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? 'order-email-error' : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }))
            }}
            className={inputClass}
          />
        </Field>
        <Field id="order-phone" label="Phone (optional)">
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

      <SectionLabel>Company (optional)</SectionLabel>
      <Field id="order-company" label="Company / team">
        <input
          id="order-company"
          type="text"
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
          placeholder="If this is a business order — staff kitchen, gym, studio…"
        />
      </Field>

      <SectionLabel>Shipping address (optional)</SectionLabel>
      <p className="-mt-2 mb-4 text-xs text-fg-muted">
        Leave blank if you'd rather discuss shipping with us first — we'll ask when we confirm price
        and delivery.
      </p>
      <div className="grid gap-5">
        <Field id="order-street" label="Street + house number">
          <input
            id="order-street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={inputClass}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-[1fr_2fr_1.4fr]">
          <Field id="order-postcode" label="Postcode">
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
          <Field id="order-city" label="City">
            <input
              id="order-city"
              type="text"
              autoComplete="address-level2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field id="order-country" label="Country">
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

      <SectionLabel>Order</SectionLabel>
      <div className="grid gap-5">
        <Field id="order-quantity" label="Quantity" required>
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
        <Field id="order-message" label="Notes / context (optional)">
          <textarea
            id="order-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              product === 'spray'
                ? 'e.g. shared workplace order, delivery preferences…'
                : 'Anything we should know before getting back to you?'
            }
            className={inputClass}
          />
        </Field>
      </div>

      <label className="mt-6 flex items-start gap-3">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 flex-none rounded border-[var(--color-border-strong)] text-accent focus:ring-accent-line"
        />
        <span className="text-sm leading-relaxed text-fg">
          I consent to PolarisDX processing the data above for the sole purpose of handling this
          order request. Details on storage, retention and your rights are in our{' '}
          <Link
            to="/privacy"
            className="font-medium text-accent-strong underline hover:text-accent-fg"
          >
            privacy policy
          </Link>
          .
        </span>
      </label>
      <p className="mt-2 pl-7 text-xs text-fg-muted">
        Legal basis: Art. 6 (1) (b) GDPR — performance of a contract / pre-contractual measures.
      </p>

      {status === 'error' && errorMsg && (
        <div
          role="alert"
          className="mt-5 rounded-md border border-[var(--color-danger-border)] bg-[var(--color-danger-soft)] px-4 py-3 text-sm text-[var(--color-danger-fg)]"
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
          className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-deep px-7 py-3.5 text-base font-semibold tracking-tight text-fg-on-dark shadow-1 transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-line focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {status === 'submitting' ? 'Sending…' : submitLabel || DEFAULT_SUBMIT_LABEL[product]}
        </button>
      </div>

      <p className="mt-4 text-xs text-fg-muted">
        Pricing and shipping confirmed by our team — no payment is taken on this form.
      </p>
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
    <section id={id} className="relative overflow-hidden bg-brand-deep py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-line/20 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center text-fg-on-dark sm:px-6 lg:px-0">
        <span
          aria-hidden
          className="mx-auto mb-6 block h-[3px] w-12 rounded-full bg-accent-bright"
        />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-fg-on-dark/80">{body}</p>
      </div>
      <div className="relative mx-auto mt-12 max-w-3xl px-4 sm:px-6 lg:px-0">
        <OrderForm product={product} page={page} submitLabel={submitLabel} />
      </div>
    </section>
  )
}
