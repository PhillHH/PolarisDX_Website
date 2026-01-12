import { useState } from 'react'
import { sendContactEmail, type ContactFormData } from '../api/contact'

interface UseContactFormReturn {
  isSubmitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
  submit: (formData: FormData) => Promise<boolean>
}

export const useContactForm = (): UseContactFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const company = formData.get('company')
    const name = formData.get('name')
    const phone = formData.get('phone')
    const email = formData.get('email')
    const area = formData.get('area')
    const requirements = formData.get('requirements')
    const consent = formData.get('consent')

    // Basic validation
    if (
      typeof company !== 'string' ||
      typeof name !== 'string' ||
      typeof phone !== 'string' ||
      typeof email !== 'string' ||
      typeof area !== 'string' ||
      typeof requirements !== 'string' ||
      !consent
    ) {
      console.error('Invalid form data types')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    const data: ContactFormData = {
      company,
      name,
      phone,
      email,
      area,
      requirements,
      message: requirements
    }

    try {
      const success = await sendContactEmail(data)
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
