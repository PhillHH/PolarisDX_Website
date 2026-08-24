import { useState } from 'react'
import {
  sendEventRegistration,
  type EventAttendance,
  type EventRegistrationData,
} from '../api/eventRegistration'

interface UseEventRegistrationReturn {
  isSubmitting: boolean
  submitStatus: 'idle' | 'success' | 'error'
  submit: (formData: FormData) => Promise<boolean>
}

const ATTENDANCE: readonly EventAttendance[] = ['full', 'programme']

/**
 * Spiegelt useContactForm: nimmt das FormData des Anmeldeformulars, prueft die
 * Typen und schickt es an /api/event-registration. Die fachliche Validierung
 * (Pflichtfelder, Fehlermeldungen je Feld) liegt im Formular selbst.
 */
export const useEventRegistration = (eventSlug: string): UseEventRegistrationReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = async (formData: FormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const str = (key: string) => {
      const value = formData.get(key)
      return typeof value === 'string' ? value.trim() : ''
    }

    const attendance = str('attendance')
    const persons = Number.parseInt(str('persons'), 10)
    const consent = formData.get('consent')

    if (
      !str('name') ||
      !str('email') ||
      !ATTENDANCE.includes(attendance as EventAttendance) ||
      !Number.isFinite(persons) ||
      !consent
    ) {
      console.error('Invalid event registration data')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }

    const data: EventRegistrationData = {
      event: eventSlug,
      name: str('name'),
      email: str('email'),
      company: str('company') || undefined,
      phone: str('phone') || undefined,
      attendance: attendance as EventAttendance,
      persons,
      cme: Boolean(formData.get('cme')),
      message: str('message') || undefined,
      consent: true,
      _hp: str('_hp'),
    }

    try {
      const success = await sendEventRegistration(data)
      setSubmitStatus(success ? 'success' : 'error')
      setIsSubmitting(false)
      return success
    } catch (error) {
      console.error('Event registration error:', error)
      setSubmitStatus('error')
      setIsSubmitting(false)
      return false
    }
  }

  return { isSubmitting, submitStatus, submit }
}
