import { useState } from 'react'
import { sendContactEmail, type ContactFormData } from '../api/contact'
import type { SupportedLanguage } from '../i18n'

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
  consent: boolean
  locale: SupportedLanguage
  /** Honeypot — forwarded raw so the server can drop bot submissions. */
  _hp: string
}

interface UseContactFormReturn {
  isSubmitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
  submit: (submission: ContactSubmission) => Promise<boolean>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const useContactForm = (): UseContactFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = async (s: ContactSubmission) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    // Client-side gate: name, valid email and explicit consent are mandatory.
    if (s.name.length < 2 || !EMAIL_RE.test(s.email) || !s.consent) {
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    const data: ContactFormData = {
      name: s.name,
      email: s.email,
      company: s.company,
      phone: s.phone,
      area: s.fieldLabel || s.field || '-',
      requirements: s.requirements,
      message: s.requirements || `${s.intentLabel} — ${s.fieldLabel}`,
      // Consent is required + validated above, so it is always true when sent.
      consent: true,
      _hp: s._hp,
      // Extra structured context — the server safely ignores unknown fields.
      intent: s.intent,
      field: s.field,
      locale: s.locale,
    }

    try {
      const success = await sendContactEmail(data)
      setIsSubmitting(false)
      if (success) {
        setSubmitStatus('success')
        return true
      }
      setSubmitStatus('error')
      return false
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }
  }

  return { isSubmitting, submitStatus, submit }
}
