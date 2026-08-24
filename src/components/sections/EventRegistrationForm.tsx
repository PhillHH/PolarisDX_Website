import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Alert } from '../ui/Alert'
import { useEventRegistration } from '../../hooks/useEventRegistration'
import { trackEvent } from '../../lib/tracking'

/**
 * Anmeldeformular fuer Veranstaltungen. Aufbau und Verhalten folgen dem
 * Kontaktformular (ContactForm.tsx): eigene Feldfehler statt Browser-Blasen,
 * Fokus auf das oberste fehlerhafte Feld, Honeypot, Einwilligung als Pflicht.
 *
 * Die Texte liegen im Namensraum `events` unter `<textKey>.form` — so kann
 * eine zweite Veranstaltung dasselbe Formular mit eigenen Formulierungen
 * nutzen. Die Empfaenger der Anmeldung kennt nur das Backend.
 */
interface EventRegistrationFormProps {
  /** Slug der Veranstaltung, wie ihn server/server.js kennt. */
  eventSlug: string
  /** i18n-Pfad (Namensraum `events`) zum Block mit `form.*`. */
  textKey: string
  /** Sprache des Formulartexts, falls er nur als englischer Platzhalter vorliegt. */
  lang?: string
}

const ERROR_ORDER = ['name', 'email', 'attendance', 'consent'] as const
type ErrorKey = (typeof ERROR_ORDER)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PERSON_OPTIONS = [1, 2, 3, 4, 5] as const

const selectClass =
  'flex h-10 w-full rounded-md border border-ui-field bg-white px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

export const EventRegistrationForm = ({ eventSlug, textKey, lang }: EventRegistrationFormProps) => {
  const { t } = useTranslation('events')
  const { isSubmitting, submitStatus, submit } = useEventRegistration(eventSlug)
  const f = (key: string, options?: Record<string, unknown>) => t(`${textKey}.form.${key}`, options)

  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({})

  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const attendanceRef = useRef<HTMLSelectElement>(null)
  const consentRef = useRef<HTMLInputElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)

  const clearError = (key: ErrorKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))

  useEffect(() => {
    if (submitStatus === 'success') successRef.current?.focus()
    if (submitStatus === 'error') errorRef.current?.focus()
  }, [submitStatus])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const value = (key: string) => String(formData.get(key) ?? '').trim()

    const next: Partial<Record<ErrorKey, string>> = {}
    if (value('name').length < 2) next.name = f('errors.name')
    if (!EMAIL_RE.test(value('email'))) next.email = f('errors.email')
    if (!value('attendance')) next.attendance = f('errors.attendance')
    if (!formData.get('consent')) next.consent = f('errors.consent')
    setErrors(next)

    const firstInvalid = ERROR_ORDER.find((key) => next[key])
    if (firstInvalid) {
      const target =
        firstInvalid === 'name'
          ? nameRef.current
          : firstInvalid === 'email'
            ? emailRef.current
            : firstInvalid === 'attendance'
              ? attendanceRef.current
              : consentRef.current
      target?.focus()
      return
    }

    const success = await submit(formData)
    if (success) {
      trackEvent('event_registration_submit', {
        event: eventSlug,
        attendance: value('attendance'),
        persons: value('persons'),
      })
      form.reset()
      setErrors({})
    }
  }

  const alertFocusClass =
    'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2'

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate lang={lang}>
      {/* Honeypot — fuer Menschen unsichtbar, Bots fuellen es aus. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          height: 1,
          width: 1,
          overflow: 'hidden',
        }}
      >
        <label htmlFor="event-hp">Leave this field blank</label>
        <input id="event-hp" name="_hp" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="event-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          ref={nameRef}
          error={errors.name}
          onChange={() => clearError('name')}
          label={`${f('name')} *`}
          placeholder={f('name_placeholder')}
        />
        <Input
          id="event-company"
          name="company"
          type="text"
          autoComplete="organization"
          label={f('company')}
          placeholder={f('company_placeholder')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="event-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          ref={emailRef}
          error={errors.email}
          onChange={() => clearError('email')}
          label={`${f('email')} *`}
          placeholder={f('email_placeholder')}
        />
        <Input
          id="event-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          label={f('phone')}
          placeholder={f('phone_placeholder')}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="grid gap-1.5">
          <label
            htmlFor="event-attendance"
            className="text-sm font-medium leading-none text-gray-900"
          >
            {f('attendance')} *
          </label>
          <select
            id="event-attendance"
            name="attendance"
            required
            ref={attendanceRef}
            defaultValue=""
            onChange={() => clearError('attendance')}
            aria-invalid={errors.attendance ? true : undefined}
            aria-describedby={errors.attendance ? 'event-attendance-error' : undefined}
            className={`${selectClass} ${errors.attendance ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          >
            <option value="" disabled>
              {f('attendance_placeholder')}
            </option>
            <option value="full">{f('attendance_full')}</option>
            <option value="programme">{f('attendance_programme')}</option>
          </select>
          {errors.attendance && (
            <p id="event-attendance-error" className="text-sm font-medium text-red-600">
              {errors.attendance}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="event-persons" className="text-sm font-medium leading-none text-gray-900">
            {f('persons')} *
          </label>
          <select id="event-persons" name="persons" defaultValue="1" className={selectClass}>
            {PERSON_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {f('persons', { count: n })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="flex h-6 items-center">
          <input
            id="event-cme"
            name="cme"
            type="checkbox"
            value="1"
            className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
          />
        </div>
        <label htmlFor="event-cme" className="text-sm text-gray-600">
          {f('cme')}
        </label>
      </div>

      <Textarea
        id="event-message"
        name="message"
        rows={3}
        label={f('message')}
        placeholder={f('message_placeholder')}
      />

      {submitStatus === 'success' && (
        <Alert
          ref={successRef}
          role="status"
          tabIndex={-1}
          className={alertFocusClass}
          variant="success"
        >
          {f('success')}
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          className={alertFocusClass}
          variant="destructive"
        >
          {f('error')}
        </Alert>
      )}

      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3">
          <div className="flex h-6 items-center">
            <input
              id="event-consent"
              name="consent"
              type="checkbox"
              required
              ref={consentRef}
              onChange={() => clearError('consent')}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? 'event-consent-error' : undefined}
              className="h-4 w-4 rounded border-gray-300 text-brand-secondary focus:ring-brand-secondary"
            />
          </div>
          <label htmlFor="event-consent" className="text-sm text-gray-600">
            {f('consent')}{' '}
            <Link to="/privacy" className="font-medium text-brand-primary hover:underline">
              {f('privacy_link')}
            </Link>
            . *
          </label>
        </div>
        {errors.consent && (
          <p id="event-consent-error" className="text-sm font-medium text-red-600">
            {errors.consent}
          </p>
        )}

        {/* Eigener Knopf statt <Button variant="secondary">: dessen
            nachgestelltes `text-inherit` gewinnt gegen `text-white`, der Text
            stand navy auf navy. Gleiche Form wie die Seiten-CTAs. */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-deep px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-deep/20 transition-colors hover:bg-brand-navy-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 md:w-auto"
        >
          {isSubmitting ? f('sending') : f('submit')}
        </button>
      </div>
    </form>
  )
}
