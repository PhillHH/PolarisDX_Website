/**
 * Anmeldung zu einer Veranstaltung (z. B. Future Forum Berlin).
 *
 * Der Weg ist derselbe wie beim Kontaktformular: relativer Pfad unter /api,
 * den der SSR-Server an den Mail-Service (server/server.js) durchreicht. Die
 * Empfaenger stehen fest im Backend — das Formular kann keine Adressen
 * mitschicken.
 */
export type EventAttendance = 'full' | 'programme'

export interface EventRegistrationData {
  /** Slug der Veranstaltung — das Backend kennt nur eine feste Liste. */
  event: string
  name: string
  email: string
  company?: string
  phone?: string
  attendance: EventAttendance
  persons: number
  /** Interesse an Fortbildungspunkten (KZV). */
  cme?: boolean
  message?: string
  /** Explizite DSGVO-Einwilligung — muss true sein. */
  consent: true
  /** Honeypot — bleibt bei Menschen leer. */
  _hp?: string
}

export const sendEventRegistration = async (data: EventRegistrationData): Promise<boolean> => {
  try {
    const response = await fetch('/api/event-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      console.error('Event registration failed with status:', response.status)
      return false
    }

    const result = await response.json()
    return result.success === true
  } catch (error) {
    console.error('Error sending event registration:', error)
    return false
  }
}
