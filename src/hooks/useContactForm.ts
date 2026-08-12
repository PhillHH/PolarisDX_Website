import { useState } from 'react'
import { sendContactEmail, type ContactFormData } from '../api/contact'

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

    // Compose a single rich message so the recipient sees intent + field even
    // though the server only renders the `message` body. `message` is always
    // non-empty (intent + field), which also satisfies the server's required
    // `message` check when the optional details are left blank.
    const message = [
      `Anliegen: ${s.intentLabel}`,
      `Bereich: ${s.fieldLabel || '-'}`,
      ...(s.source ? [`Herkunft: ${s.source}`] : []),
      '',
      s.requirements || '(keine weiteren Angaben)',
    ].join('\n')

    const data: ContactFormData = {
      name: s.name,
      email: s.email,
      company: s.company,
      phone: s.phone,
      area: s.fieldLabel || s.field || '-',
      requirements: s.requirements,
      message,
      // Consent is required + validated above, so it is always true when sent.
      consent: true,
      _hp: s._hp,
      // Extra structured context — the server safely ignores unknown fields.
      intent: s.intent,
      field: s.field,
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
