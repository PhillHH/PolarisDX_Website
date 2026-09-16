import { useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { Alert } from '../ui/Alert'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import {
  submitEpigeneticsInquiry,
  type EpigeneticsInquiryData,
  type EpigeneticsInquiryResult,
} from '../../api/epigeneticsInquiry'
import { normalizeLanguage } from '../../i18n'
import {
  readEpigeneticsContext,
  readEpigeneticsInquirySource,
  type EpigeneticsPanel,
} from '../../lib/epigeneticsContext'
import { track } from '../../lib/tracking'

interface SampleItem {
  slug: EpigeneticsPanel
  panel: string
}

type FacilityType = EpigeneticsInquiryData['facilityType'] | ''
type Volume = EpigeneticsInquiryData['casesPerMonth']
type FieldError = 'name' | 'email' | 'organization' | 'facilityType' | 'processingConsent'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FACILITY_TYPES = ['practice', 'clinic', 'laboratory', 'consultancy', 'other'] as const
const VOLUMES = ['unspecified', '1-10', '11-25', '26-50', '51-plus'] as const

const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : [])

function newIdempotencyKey() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `epi-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export default function EpigeneticsInquiryForm() {
  const { t, i18n } = useTranslation(['epigenetics', 'contact'])
  const [searchParams] = useSearchParams()
  const initialContext = readEpigeneticsContext(searchParams)
  const inquirySource = readEpigeneticsInquirySource(searchParams)
  const panels = asArray<SampleItem>(t('samples.items', { returnObjects: true }))
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [facilityType, setFacilityType] = useState<FacilityType>('')
  const [casesPerMonth, setCasesPerMonth] = useState<Volume>('unspecified')
  const [panel, setPanel] = useState<EpigeneticsPanel | ''>(initialContext.panel ?? '')
  const [message, setMessage] = useState('')
  const [processingConsent, setProcessingConsent] = useState(false)
  const [hp, setHp] = useState('')
  const [errors, setErrors] = useState<Partial<Record<FieldError, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<EpigeneticsInquiryResult | null>(null)
  const idempotencyKey = useRef<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const clearError = (field: FieldError) =>
    setErrors((current) => ({ ...current, [field]: undefined }))

  const validate = () => {
    const next: Partial<Record<FieldError, string>> = {}
    if (name.trim().length < 2) next.name = t('inquiry.errors.name')
    if (!EMAIL_RE.test(email.trim())) next.email = t('inquiry.errors.email')
    if (organization.trim().length < 2) next.organization = t('inquiry.errors.organization')
    if (!facilityType) next.facilityType = t('inquiry.errors.facilityType')
    if (!processingConsent) next.processingConsent = t('inquiry.errors.consent')
    setErrors(next)
    return (Object.keys(next)[0] as FieldError | undefined) ?? null
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult(null)
    const firstError = validate()
    if (firstError) {
      const name = firstError === 'processingConsent' ? 'processingConsent' : firstError
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>(`[name="${name}"]`)?.focus()
      })
      return
    }
    setSubmitting(true)
    idempotencyKey.current ??= newIdempotencyKey()

    try {
      const response = await submitEpigeneticsInquiry(
        {
          name: name.trim(),
          email: email.trim(),
          organization: organization.trim(),
          facilityType: facilityType as EpigeneticsInquiryData['facilityType'],
          casesPerMonth,
          message: message.trim(),
          locale: normalizeLanguage(i18n.resolvedLanguage),
          source: inquirySource,
          campaign: searchParams.get('campaign')?.slice(0, 128) ?? '',
          panel,
          focus: initialContext.focus ?? '',
          originRoute:
            typeof window === 'undefined'
              ? `/${normalizeLanguage(i18n.resolvedLanguage)}/epigenetics`
              : `${window.location.pathname}${window.location.search}`,
          processingConsent,
          // No marketing opt-in is solicited in this journey. The shared
          // consent record therefore persists the separate state as DENIED.
          marketingConsent: false,
          consentAcceptedAt: new Date().toISOString(),
          _hp: hp,
        },
        idempotencyKey.current,
      )
      setResult(response)
      if (response.accepted) {
        // AP23 PT23.3 — `accepted` heisst: der Vorgang ist persistiert. Erst
        // dann eine Konversion. Es geht ausschliesslich der allowlistete
        // Panel-Slug mit — keine Vorgangsnummer, kein Kontaktdatum, kein
        // Freitext aus dem Nachrichtenfeld.
        track({ name: 'epigenetics_inquiry_submit', panel: panel || undefined })
      } else if (!response.retryable) {
        // AP26 PT26.3: nur eine endgueltige Ablehnung verwirft den Schluessel. Nach 429/5xx
        // kann der Vorgang schon gespeichert sein — ein neuer Schluessel waere ein zweiter Lead.
        idempotencyKey.current = null
      }
    } catch {
      setResult({ accepted: false, code: 'INQUIRY_UNAVAILABLE' })
      idempotencyKey.current = null
    } finally {
      setSubmitting(false)
      requestAnimationFrame(() => resultRef.current?.focus())
    }
  }

  const statusVariant = !result?.accepted
    ? 'error'
    : result.status === 'DELIVERED'
      ? 'success'
      : result.status === 'FAILED_TERMINAL'
        ? 'warning'
        : 'info'
  const statusKey = !result?.accepted
    ? 'error'
    : result.status === 'DELIVERED'
      ? 'delivered'
      : result.status === 'RETRY_PENDING'
        ? 'retryPending'
        : result.status === 'FAILED_TERMINAL'
          ? result.providerConfigured === false
            ? 'providerUnavailable'
            : 'manualReview'
          : 'recorded'

  return (
    <form ref={formRef} className="mt-10 space-y-6 text-left" onSubmit={handleSubmit} noValidate>
      <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="epigenetics-inquiry-hp">Website</label>
        <input
          id="epigenetics-inquiry-hp"
          name="_hp"
          tabIndex={-1}
          autoComplete="off"
          value={hp}
          onChange={(event) => setHp(event.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="epigenetics-inquiry-name"
          name="name"
          required
          autoComplete="name"
          label={t('inquiry.fields.name')}
          value={name}
          error={errors.name}
          onChange={(event) => {
            setName(event.target.value)
            clearError('name')
          }}
        />
        <Input
          id="epigenetics-inquiry-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          label={t('inquiry.fields.email')}
          value={email}
          error={errors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            clearError('email')
          }}
        />
        <Input
          id="epigenetics-inquiry-organization"
          name="organization"
          required
          autoComplete="organization"
          label={t('inquiry.fields.organization')}
          value={organization}
          error={errors.organization}
          onChange={(event) => {
            setOrganization(event.target.value)
            clearError('organization')
          }}
        />
        <div className="grid gap-1.5">
          <label htmlFor="epigenetics-inquiry-facility" className="t-label">
            {t('inquiry.fields.facilityType')}
          </label>
          <select
            id="epigenetics-inquiry-facility"
            name="facilityType"
            required
            value={facilityType}
            aria-invalid={errors.facilityType ? true : undefined}
            aria-describedby={errors.facilityType ? 'epigenetics-facility-error' : undefined}
            onChange={(event) => {
              setFacilityType(event.target.value as FacilityType)
              clearError('facilityType')
            }}
            className="h-10 rounded-md border border-ui-field bg-white px-3 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <option value="">{t('inquiry.fields.choose')}</option>
            {FACILITY_TYPES.map((value) => (
              <option key={value} value={value}>
                {t(`inquiry.facilityTypes.${value}`)}
              </option>
            ))}
          </select>
          {errors.facilityType ? (
            /* AP24 PT24.1: `role="alert"` wie in Input/Textarea/FormField —
               diese beiden handgebauten Fehler blieben sonst stumm. */
            <p id="epigenetics-facility-error" role="alert" className="t-error">
              {errors.facilityType}
            </p>
          ) : null}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="epigenetics-inquiry-panel" className="t-label">
            {t('inquiry.fields.panel')}
          </label>
          <select
            id="epigenetics-inquiry-panel"
            value={panel}
            onChange={(event) => setPanel(event.target.value as EpigeneticsPanel | '')}
            className="h-10 rounded-md border border-ui-field bg-white px-3 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            <option value="">{t('inquiry.fields.noPanel')}</option>
            {panels.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.panel}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="epigenetics-inquiry-volume" className="t-label">
            {t('inquiry.fields.volume')}
          </label>
          <select
            id="epigenetics-inquiry-volume"
            value={casesPerMonth}
            onChange={(event) => setCasesPerMonth(event.target.value as Volume)}
            className="h-10 rounded-md border border-ui-field bg-white px-3 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            {VOLUMES.map((value) => (
              <option key={value} value={value}>
                {t(`inquiry.volumes.${value}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Textarea
        id="epigenetics-inquiry-message"
        name="message"
        rows={5}
        maxLength={4000}
        label={t('inquiry.fields.message')}
        helperText={t('inquiry.fields.messageHint')}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />

      <div className="space-y-4">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-gray-700">
          <input
            type="checkbox"
            name="processingConsent"
            required
            checked={processingConsent}
            aria-invalid={errors.processingConsent ? true : undefined}
            aria-describedby={
              errors.processingConsent ? 'epigenetics-processing-consent-error' : undefined
            }
            onChange={(event) => {
              setProcessingConsent(event.target.checked)
              clearError('processingConsent')
            }}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
          />
          <span>
            {t('contact:contact.form.consent')}{' '}
            <Link to="/privacy" className="font-semibold text-accent-strong hover:underline">
              {t('contact:contact.form.privacy_link')}
            </Link>
            .
          </span>
        </label>
        {errors.processingConsent ? (
          <p id="epigenetics-processing-consent-error" role="alert" className="t-error">
            {errors.processingConsent}
          </p>
        ) : null}
      </div>

      {result ? (
        <Alert
          ref={resultRef}
          tabIndex={-1}
          role={result.accepted ? 'status' : 'alert'}
          variant={statusVariant}
          title={t(`inquiry.status.${statusKey}.title`)}
        >
          {t(`inquiry.status.${statusKey}.text`)}
        </Alert>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent-strong px-6 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-60"
      >
        {submitting ? t('inquiry.sending') : t('inquiry.submit')}
        {!submitting ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
      </button>
      <p className="text-center text-xs text-ui-field">{t('inquiry.analyticsIndependent')}</p>
    </form>
  )
}
