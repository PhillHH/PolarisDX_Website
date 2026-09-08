import { useId, useRef, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Lock } from 'lucide-react'
import { submitContentDownload, type ContentDownloadResult } from '../../api/contentDownload'
import type { ResourceAssetLanguage } from '../../content/resources/resourceInventory'

/**
 * Wiederverwendbares Gate fuer gegatete Ressourcen (AP19 PT19.3).
 *
 * Es haengt an keiner Seite und an keinem Asset: wer eine gegatete Ressource
 * anbietet, uebergibt Asset-ID, Sprache und Herkunft — mehr braucht es nicht.
 *
 * DREI DINGE, die hier bewusst so sind:
 *
 *  1. Der Verarbeitungs-Consent ist Pflicht und steht getrennt vom Marketing-
 *     Consent. Analytics-Einwilligung ist an keiner Stelle Voraussetzung; das
 *     Formular kennt keinen Tracking-Aufruf.
 *  2. Der Idempotency-Key entsteht EINMAL beim Oeffnen. Ein zweiter Klick auf
 *     "Absenden" erzeugt deshalb keinen zweiten Lead — der Server erkennt den
 *     Wiederholer und gibt denselben Vorgang zurueck.
 *  3. Der Erfolgszustand zeigt den Link, den der Server geliefert hat. Es gibt
 *     keinen vorab gebauten Pfad und keine Erfolgsmeldung ohne Link.
 */

export interface ResourceGateFormProps {
  assetId: string
  /** Sprache der Datei, die der Server voraussichtlich ausliefert. */
  assetLanguage: ResourceAssetLanguage
  /** Sichtbarer Name der Ressource — kommt vom Aufrufer, nicht aus dem Gate. */
  resourceLabel: string
  originRoute: string
  campaign?: string
  onClose?: () => void
}

type Phase = 'form' | 'sending' | 'done'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ResourceGateForm = ({
  assetId,
  assetLanguage,
  resourceLabel,
  originRoute,
  campaign = '',
  onClose,
}: ResourceGateFormProps) => {
  const { t, i18n } = useTranslation('downloads')
  const fieldId = useId()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [organization, setOrganization] = useState('')
  const [processingConsent, setProcessingConsent] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [phase, setPhase] = useState<Phase>('form')
  const [invalid, setInvalid] = useState<string[]>([])
  const [result, setResult] = useState<ContentDownloadResult | null>(null)
  const [errorCode, setErrorCode] = useState<string | null>(null)

  /**
   * Einmal je Formular, nicht je Klick — und bewusst im Ereignishandler
   * erzeugt, nicht beim Rendern: ein Zufallswert waehrend des Renderns waere
   * bei jedem erneuten Rendern ein anderer und damit gerade kein
   * Idempotency-Key.
   */
  const idempotencyKey = useRef<string | null>(null)
  const ensureIdempotencyKey = () => {
    if (!idempotencyKey.current) {
      idempotencyKey.current =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${assetId}-${Date.now()}-${Math.random().toString(36).slice(2)}`
    }
    return idempotencyKey.current
  }

  const validate = () => {
    const fields: string[] = []
    if (name.trim().length < 2) fields.push('name')
    if (!EMAIL_RE.test(email.trim())) fields.push('email')
    if (organization.trim().length < 2) fields.push('organization')
    if (!processingConsent) fields.push('processingConsent')
    return fields
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (phase === 'sending') return

    // Clientseitige Pruefung ist Komfort. Massgeblich ist die Serverpruefung —
    // deshalb wird unten dieselbe Fehlerstruktur wieder eingelesen.
    const fields = validate()
    setInvalid(fields)
    if (fields.length) return

    setPhase('sending')
    setErrorCode(null)
    const response = await submitContentDownload(
      {
        name: name.trim(),
        email: email.trim(),
        organization: organization.trim(),
        locale: i18n.language,
        assetId,
        source: 'resource-center',
        campaign,
        originRoute,
        processingConsent,
        marketingConsent,
        consentAcceptedAt: new Date().toISOString(),
        _hp: honeypot,
      },
      ensureIdempotencyKey(),
    )

    if (!response.accepted || !response.downloadUrl) {
      setInvalid(response.fields ?? [])
      setErrorCode(response.code ?? 'CONTENT_DOWNLOAD_UNAVAILABLE')
      setPhase('form')
      return
    }
    setResult(response)
    setPhase('done')
  }

  const invalidClass = (field: string) =>
    invalid.includes(field) ? 'border-red-500' : 'border-slate-300'

  if (phase === 'done' && result?.downloadUrl) {
    return (
      <div data-gate-state="success" className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-medium text-heading">{t('gate.successTitle')}</h3>
        <p className="mt-2 text-sm leading-6 text-gray-600">{t('gate.successText')}</p>
        <a
          href={result.downloadUrl}
          data-gate-download
          hrefLang={result.deliveredLanguage ?? assetLanguage}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          <Download className="h-4 w-4" aria-hidden />
          {t('gate.downloadCta')}
          <span className="sr-only"> — {resourceLabel}</span>
        </a>
        {result.expiresAt && (
          <p className="mt-3 text-xs text-gray-600">
            {t('gate.expiryNote', {
              date: new Date(result.expiresAt).toLocaleDateString(i18n.language),
            })}
          </p>
        )}
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      data-gate-state={phase}
      data-gate-asset={assetId}
      className="rounded-xl border border-slate-200 bg-white p-6"
    >
      <h3 className="flex items-center gap-2 text-lg font-medium text-heading">
        <Lock className="h-4 w-4" aria-hidden />
        {t('gate.title')}
      </h3>
      <p className="mt-2 text-sm leading-6 text-gray-600">
        {t('gate.intro', { resource: resourceLabel })}
      </p>

      {/* Honeypot: unsichtbar, aber nicht display:none — Bots fuellen ihn. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${fieldId}-hp`}>Fax</label>
        <input
          id={`${fieldId}-hp`}
          name="fax"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <div className="mt-5 space-y-4">
        {(
          [
            ['name', name, setName, 'text', 'name'],
            ['email', email, setEmail, 'email', 'email'],
            ['organization', organization, setOrganization, 'text', 'organization'],
          ] as const
        ).map(([field, value, setValue, type, autoComplete]) => (
          <div key={field}>
            <label
              htmlFor={`${fieldId}-${field}`}
              className="block text-sm font-medium text-heading"
            >
              {t(`gate.${field}`)}
            </label>
            <input
              id={`${fieldId}-${field}`}
              type={type}
              autoComplete={autoComplete}
              required
              value={value}
              onChange={(event) => setValue(event.target.value)}
              aria-invalid={invalid.includes(field)}
              className={`mt-1 w-full rounded-lg border ${invalidClass(field)} px-3 py-2 text-sm text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
            />
          </div>
        ))}

        {/* Verarbeitung und Marketing sind zwei getrennte Entscheidungen. */}
        <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
          <input
            type="checkbox"
            required
            checked={processingConsent}
            onChange={(event) => setProcessingConsent(event.target.checked)}
            aria-invalid={invalid.includes('processingConsent')}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <span>{t('gate.processingConsent')}</span>
        </label>
        <label className="flex items-start gap-3 text-sm leading-6 text-gray-600">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(event) => setMarketingConsent(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
          <span>{t('gate.marketingConsent')}</span>
        </label>
      </div>

      {errorCode && (
        <p role="alert" data-gate-error={errorCode} className="mt-4 text-sm text-red-600">
          {t(
            errorCode === 'PROCESSING_CONSENT_REQUIRED'
              ? 'gate.errorConsent'
              : errorCode === 'VALIDATION_FAILED'
                ? 'gate.errorValidation'
                : 'gate.errorGeneric',
          )}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={phase === 'sending'}
          className="inline-flex items-center justify-center rounded-lg bg-accent-strong px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {t(phase === 'sending' ? 'gate.submitting' : 'gate.submit')}
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {t('gate.close')}
          </button>
        )}
      </div>
    </form>
  )
}

export default ResourceGateForm
