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
    const hp = formData.get('_hp')
    const herkunft = formData.get('herkunft')

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
      // Die Herkunft haengt hinten an der Nachricht statt in einem eigenen
      // Feld: das Backend nimmt nur die bekannten Felder entgegen, und eine
      // Anfrage, der man nicht ansieht, aus welcher Strecke sie kam, ist fuer
      // den Vertrieb halb so viel wert. Der vorbelegte Freitext allein trug
      // sie nicht — wer ihn ueberschrieb, loeschte die einzige Spur.
      message:
        typeof herkunft === 'string' && herkunft
          ? `${requirements}\n\nHerkunft: ${herkunft}`
          : requirements,
      // Consent is required + validated above, so it is always true when sent.
      consent: true,
      // Honeypot — forwarded raw so the server can drop bot submissions.
      _hp: typeof hp === 'string' ? hp : '',
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
