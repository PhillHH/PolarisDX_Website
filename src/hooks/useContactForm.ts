import { useRef, useState } from 'react'
import { sendContactEmail, type ContactFormData } from '../api/contact'
import type { SupportedLanguage } from '../i18n'
import { track } from '../lib/tracking'

export interface ContactSubmission {
  intent: string
  intentLabel: string
  name: string
  company: string
  email: string
  phone: string
  field: string
  fieldLabel: string
  requirements: string
  /** Woher die Anfrage kam, z. B. "Epigenetik · Metabolic Health".
   *  Gehoert in die Nachricht, NICHT in `area` — dort steht der Bereich,
   *  den der Absender selbst gewaehlt hat. */
  source?: string
  /** Explicit journey/section values; never inferred from localized button text. */
  journey?: string
  section?: string
  /** Processing (Form) Consent — Pflicht, strikt getrennt vom Marketing-Consent. */
  consent: boolean
  /** Marketing Consent — optional; Ablehnung blockiert die Anfrage nicht. */
  marketingConsent?: boolean
  locale: SupportedLanguage
  /** Honeypot — forwarded raw so the server can drop bot submissions. */
  _hp: string
}

export type ContactSubmitStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'validation-error'
  | 'retryable-error'
  | 'terminal-error'

interface UseContactFormReturn {
  isSubmitting: boolean
  submitStatus: ContactSubmitStatus
  /** Serverseitig gemeldete Validierungsfelder (400). */
  serverFields: string[]
  submit: (submission: ContactSubmission) => Promise<{ ok: boolean; fields: string[] }>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useContactForm = (): UseContactFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<ContactSubmitStatus>('idle')
  const [serverFields, setServerFields] = useState<string[]>([])
  // Ein Key pro Formular-Instanz: Wiederholungen (Double-Click, Netzwerk-Retry)
  // sind damit idempotent — der Server dedupliziert auf denselben Lead.
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `contact-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )
  // In-Flight-Guard per Ref: Ein per State gefuehrter Guard laeuft beim
  // synchronen Double-Invoke (Double-Click/Retry vor Re-Render) in den
  // Stale-Closure-Fall und liess zwei Sends los.
  const inFlightRef = useRef(false)

  const submit = async (s: ContactSubmission): Promise<{ ok: boolean; fields: string[] }> => {
    if (inFlightRef.current) return { ok: false, fields: [] }
    inFlightRef.current = true
    setIsSubmitting(true)
    setSubmitStatus('submitting')
    setServerFields([])

    try {
      // Client-side gate: name, valid email and explicit processing consent are
      // mandatory. Die Servervalidierung bleibt autoritativ.
      if (s.name.length < 2 || !EMAIL_RE.test(s.email) || !s.consent) {
        setSubmitStatus('validation-error')
        const gateFields = [
          s.name.length < 2 ? 'name' : '',
          !EMAIL_RE.test(s.email) ? 'email' : '',
          !s.consent ? 'consent' : '',
        ].filter(Boolean)
        return { ok: false, fields: gateFields }
      }

      const data: ContactFormData = {
        name: s.name,
        email: s.email,
        company: s.company,
        phone: s.phone,
        area: s.fieldLabel || s.field || '-',
        requirements: s.requirements,
        message: s.requirements || `${s.intentLabel} — ${s.fieldLabel}`,
        processingConsent: true,
        marketingConsent: s.marketingConsent === true,
        consentAcceptedAt: new Date().toISOString(),
        _hp: s._hp,
        intent: s.intent,
        field: s.field,
        locale: s.locale,
        source: s.source,
        journey: s.journey,
        section: s.section,
      }

      try {
        const result = await sendContactEmail(data, idempotencyKeyRef.current)
        if (result.ok) {
          // 202 = Lead dauerhaft persistiert. Erst jetzt darf die UI Erfolg zeigen.
          setSubmitStatus('success')
          // ... und erst jetzt darf die Messung eine Konversion melden.
          track({ name: 'contact_submit' })
          return { ok: true, fields: [] }
        }
        if (!result.retryable) {
          setServerFields(result.fields ?? [])
          setSubmitStatus('validation-error')
          return { ok: false, fields: result.fields ?? [] }
        }
        setSubmitStatus('retryable-error')
        return { ok: false, fields: [] }
      } catch (error) {
        console.error('Submission error:', error)
        setSubmitStatus('retryable-error')
        return { ok: false, fields: [] }
      }
    } finally {
      inFlightRef.current = false
      setIsSubmitting(false)
    }
  }

  return { isSubmitting, submitStatus, serverFields, submit }
}
