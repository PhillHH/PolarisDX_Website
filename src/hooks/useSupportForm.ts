import { useState } from 'react'
import { sendSupportEmail, type SupportFormData } from '../api/support'

interface UseSupportFormReturn {
  isSubmitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
  submit: (formData: FormData) => Promise<boolean>
}

export const useSupportForm = (): UseSupportFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

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

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof udi !== 'string' ||
      typeof swVersion !== 'string' ||
      typeof issueType !== 'string' ||
      typeof subject !== 'string' ||
      typeof description !== 'string' ||
      !consent
    ) {
      console.error('Invalid form data types')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    const data: SupportFormData = {
      name,
      email,
      udi,
      swVersion,
      issueType,
      subject,
      description,
      // Consent is required + validated above, so it is always true when sent.
      consent: true,
      // Honeypot — forwarded raw so the server can drop bot submissions.
      _hp: typeof hp === 'string' ? hp : '',
    }

    // Client-side guard mirroring the server's 5 MB per-attachment cap, so the
    // user gets immediate feedback instead of a 400 after the upload.
    const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      console.error('Attachment exceeds 5 MB limit')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    // Client-side guard mirroring the server's MIME allowlist, so an unsupported
    // attachment (e.g. video, .doc/.docx, HEIC/webp photo) is rejected with the
    // visible form error instead of a silent 400 from the backend.
    const ALLOWED_ATTACHMENT_TYPES = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/gif',
      'text/plain',
    ]
    if (file && file.size > 0 && !ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
      console.error(`Unsupported attachment type: ${file.type || 'unknown'}`)
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    // Convert file to base64 if present
    if (file && file.size > 0) {
      try {
        const buffer = await file.arrayBuffer()
        const base64 = btoa(
          new Uint8Array(buffer).reduce((str, byte) => str + String.fromCharCode(byte), ''),
        )
        data.attachment = {
          filename: file.name,
          content: base64,
          type: file.type,
        }
      } catch (err) {
        console.error('Error reading file:', err)
      }
    }

    try {
      const success = await sendSupportEmail(data)
      setIsSubmitting(false)
      if (success) {
        setSubmitStatus('success')
        return true
      } else {
        setSubmitStatus('error')
        return false
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }
  }

  return { isSubmitting, submitStatus, submit }
}
