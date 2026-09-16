import { useRef, useState } from 'react'
import { sendSupportEmail, type SupportFormData } from '../api/support'
import type { SupportedLanguage } from '../i18n'
import { track } from '../lib/tracking'

export type SupportSubmitStatus =
  | 'idle'
  | 'submitting'
  | 'success'
  | 'validation-error'
  | 'retryable-error'
  | 'terminal-error'

interface UseSupportFormReturn {
  isSubmitting: boolean
  submitStatus: SupportSubmitStatus
  /** Serverseitig gemeldete Validierungsfelder (400). */
  serverFields: string[]
  submit: (
    formData: FormData,
    locale: SupportedLanguage,
    issueTypeLabel: string,
  ) => Promise<{ ok: boolean; fields: string[] }>
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024
const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'text/plain',
]

/**
 * AP20 PT20.3 — Support-Hook: Statusmaschine analog Contact, Idempotency-Key
 * pro Formular-Instanz, Double-Submit-Block per Ref (Stale-Closure-sicher),
 * Processing-Consent Pflicht, Attachment-Guards spiegeln die Server-Politik
 * (UX-Feedback; autoritativ bleibt der Server).
 */
export const useSupportForm = (): UseSupportFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<SupportSubmitStatus>('idle')
  const [serverFields, setServerFields] = useState<string[]>([])
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `support-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  )
  const inFlightRef = useRef(false)

  const submit = async (
    formData: FormData,
    locale: SupportedLanguage,
    issueTypeLabel: string,
  ): Promise<{ ok: boolean; fields: string[] }> => {
    if (inFlightRef.current) return { ok: false, fields: [] }
    inFlightRef.current = true
    setIsSubmitting(true)
    setSubmitStatus('submitting')
    setServerFields([])

    try {
      const name = formData.get('name')
      const email = formData.get('email')
      const udi = formData.get('udi')
      const swVersion = formData.get('swVersion')
      const issueType = formData.get('issueType')
      const subject = formData.get('subject')
      const description = formData.get('description')
      const consent = formData.get('consent')
      const hp = formData.get('_hp')
      const file = formData.get('attachment') as File | null

      const gateFields: string[] = []
      if (typeof name !== 'string' || name.trim().length < 2) gateFields.push('name')
      if (typeof email !== 'string' || !EMAIL_RE.test(email)) gateFields.push('email')
      if (typeof udi !== 'string' || !udi.trim()) gateFields.push('udi')
      if (typeof swVersion !== 'string' || !swVersion.trim()) gateFields.push('swVersion')
      if (typeof issueType !== 'string' || !issueType) gateFields.push('issueType')
      if (typeof subject !== 'string' || !subject.trim()) gateFields.push('subject')
      if (!consent) gateFields.push('consent')

      if (gateFields.length > 0) {
        setSubmitStatus('validation-error')
        return { ok: false, fields: gateFields }
      }

      // Client-Guards spiegeln die Server-Caps (sofortiges Feedback statt 400).
      if (file && file.size > MAX_ATTACHMENT_BYTES) {
        setSubmitStatus('validation-error')
        return { ok: false, fields: ['attachment'] }
      }
      if (file && file.size > 0 && !ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
        setSubmitStatus('validation-error')
        return { ok: false, fields: ['attachment'] }
      }

      // Gate oben stellt typeof string fuer alle Pflichtfelder sicher.
      const data: SupportFormData = {
        name: (name as string).trim(),
        email: (email as string).trim(),
        udi: (udi as string).trim(),
        swVersion: (swVersion as string).trim(),
        issueType: issueType as string,
        subject: (subject as string).trim(),
        description: typeof description === 'string' ? description.trim() : '',
        issueTypeLabel,
        locale,
        // Consent is required + validated above, so it is always true when sent.
        processingConsent: true,
        consentAcceptedAt: new Date().toISOString(),
        // Honeypot — forwarded raw so the server can drop bot submissions.
        _hp: typeof hp === 'string' ? hp : '',
      }

      if (file && file.size > 0) {
        try {
          const buffer = await file.arrayBuffer()
          const base64 = btoa(
            new Uint8Array(buffer).reduce((str, byte) => str + String.fromCharCode(byte), ''),
          )
          data.attachments = [{ filename: file.name, content: base64, type: file.type }]
        } catch (error) {
          console.error('Error reading file:', error)
          setSubmitStatus('validation-error')
          return { ok: false, fields: ['attachment'] }
        }
      }

      try {
        const result = await sendSupportEmail(data, idempotencyKeyRef.current)
        if (result.ok) {
          // 202 = Case dauerhaft persistiert. Erst jetzt darf die UI Erfolg zeigen.
          setSubmitStatus('success')
          track({ name: 'support_submit' })
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
