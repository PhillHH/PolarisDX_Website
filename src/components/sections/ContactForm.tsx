import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { cn } from '../../lib/utils'
import { useContactForm } from '../../hooks/useContactForm'

const INTENT_KEYS = ['consultation', 'quote', 'product', 'support', 'other'] as const
const FIELD_KEYS = ['dental', 'beauty', 'longevity', 'pharmacy', 'other'] as const

type IntentKey = (typeof INTENT_KEYS)[number]
type FieldKey = (typeof FIELD_KEYS)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Joyful, single-page contact form with a live completion meter, intent /
 * field pills, contextual encouragement and a submit label that adapts to
 * the selected intent. Fully controlled so the meter + checkmarks stay live. */
export const ContactForm = () => {
  const { t } = useTranslation('contact')
  const { isSubmitting, submitStatus, submit } = useContactForm()

  const [intent, setIntent] = useState<IntentKey>('consultation')
  const [field, setField] = useState<FieldKey | ''>('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [requirements, setRequirements] = useState('')
  const [consent, setConsent] = useState(false)
  const [hp, setHp] = useState('')
  const [showFieldError, setShowFieldError] = useState(false)

  const nameValid = name.trim().length >= 2
  const emailValid = EMAIL_RE.test(email.trim())
  const companyFilled = company.trim().length > 0
  const fieldSelected = field !== ''

  // Five joyful"steps" that fill the progress meter. Intent is pre-selected
  // (it always has a value), so it drives the button label, not the meter.
  const steps = [nameValid, companyFilled, emailValid, fieldSelected, consent]
  const done = steps.filter(Boolean).length
  const total = steps.length
  const remaining = total - done
  const pct = Math.round((done / total) * 100)

  const progressMessage =
    done === 0
      ? t('contact.form.progress.start')
      : remaining === 0
        ? t('contact.form.progress.done')
        : remaining === 1
          ? t('contact.form.progress.almost')
          : t('contact.form.progress.going', { count: remaining })

  const fieldHint = fieldSelected ? t(`contact.form.field.hints.${field}`) : ''

  const resetForm = () => {
    setIntent('consultation')
    setField('')
    setName('')
    setCompany('')
    setEmail('')
    setPhone('')
    setRequirements('')
    setConsent(false)
    setHp('')
    setShowFieldError(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!fieldSelected) {
      setShowFieldError(true)
      return
    }

    const success = await submit({
      intent,
      intentLabel: t(`contact.form.intent.options.${intent}`),
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      field,
      fieldLabel: t(`contact.form.field.options.${field}`),
      requirements: requirements.trim(),
      consent,
      _hp: hp,
    })

    if (success) resetForm()
  }

  const pillClass = (active: boolean) =>
    cn(
      'rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      active
        ? 'border-accent bg-accent-soft text-accent-strong'
        : 'border-ui-border bg-white text-gray-700 hover:border-accent/60 hover:text-accent-strong',
    )

  const validIcon = <Check className="h-4 w-4 text-accent" aria-hidden />

  return (
    <form className="space-y-8" onSubmit={handleSubmit} noValidate>
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
        <label htmlFor="contact-hp">
          {t('common:a11y.honeypot', 'Dieses Feld bitte leer lassen')}
        </label>
        <input
          id="contact-hp"
          name="_hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
      </div>

      {/* Progress meter */}
      <div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={done}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">{progressMessage}</span>
          <span className="text-gray-400">
            <span className="font-semibold text-heading">{done}</span>/{total}
          </span>
        </div>
      </div>

      {/* Intent */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-heading">
          {t('contact.form.intent.label')}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {INTENT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setIntent(key)}
              aria-pressed={intent === key}
              className={pillClass(intent === key)}
            >
              {t(`contact.form.intent.options.${key}`)}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Contact details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-heading">{t('contact.form.who')}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            label={t('contact.form.name')}
            placeholder={t('contact.form.name_placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={cn(nameValid && 'border-accent bg-accent-soft/40 focus-visible:ring-accent')}
            rightIcon={nameValid ? validIcon : undefined}
          />
          <Input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            label={t('contact.form.company_label')}
            placeholder={t('contact.form.company_placeholder')}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            label={t('contact.form.email')}
            placeholder={t('contact.form.email_placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={cn(
              emailValid && 'border-accent bg-accent-soft/40 focus-visible:ring-accent',
            )}
            rightIcon={emailValid ? validIcon : undefined}
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            label={`${t('contact.form.phone')} (${t('contact.form.optional')})`}
            placeholder={t('contact.form.phone_placeholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Field */}
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-heading">
          {t('contact.form.field.label')}
        </legend>
        <div className="flex flex-wrap gap-2.5">
          {FIELD_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setField(key)
                setShowFieldError(false)
              }}
              aria-pressed={field === key}
              className={pillClass(field === key)}
            >
              {t(`contact.form.field.options.${key}`)}
            </button>
          ))}
        </div>
        {fieldHint && (
          <div className="flex items-start gap-2 rounded-lg bg-accent-soft px-4 py-3 text-sm text-accent-strong">
            <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{fieldHint}</span>
          </div>
        )}
        {showFieldError && !fieldSelected && (
          <p className="text-sm font-medium text-red-500">{t('contact.form.field_required')}</p>
        )}
      </fieldset>

      {/* Message */}
      <Textarea
        id="requirements"
        name="requirements"
        rows={4}
        label={`${t('contact.form.prepare_label')} (${t('contact.form.optional')})`}
        placeholder={t('contact.form.prepare_placeholder')}
        value={requirements}
        onChange={(e) => setRequirements(e.target.value)}
      />

      {submitStatus === 'success' && <Alert variant="success">{t('contact.form.success')}</Alert>}
      {submitStatus === 'error' && <Alert variant="destructive">{t('contact.form.error')}</Alert>}

      {/* Consent + submit */}
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-gray-600">
            {t('contact.form.consent')}{' '}
            <Link to="/privacy" className="font-medium text-accent-strong hover:underline">
              {t('contact.form.privacy_link')}
            </Link>
            .
          </label>
        </div>

        <div className="space-y-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-strong px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {isSubmitting ? t('contact.form.sending') : t(`contact.form.submit.${intent}`)}
            {!isSubmitting && <ArrowRight className="h-4 w-4" aria-hidden />}
          </button>
          <p className="text-xs text-gray-400">{t('contact.form.microcopy')}</p>
        </div>
      </div>
    </form>
  )
}
