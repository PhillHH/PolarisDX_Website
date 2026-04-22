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
