/**
 * EventPopup — Termin-Hinweis beim ersten Laden einer Seite (SC-020).
 *
 * Owner 2026-10-27: „einen Termin-Popup beim Laden der Startseite [oder] einer Unterseite".
 * Wann er erscheint, entscheidet `Layout` mit `lib/eventPopupState` (nächster belegter Termin,
 * einmal je Browsersitzung, nicht auf Termin-/Kontakt-/Supportseite, erst nach der Cookie-
 * Entscheidung, nie über einem anderen Dialog). Diese Datei ist nur der Inhalt und lädt als
 * eigener Chunk erst dann — kein SSR-HTML, kein Initial-JS. Dialog-Semantik, Fokus und Escape
 * kommen aus `ui/Dialog`.
 */
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import type { EventEntry } from '../../data/events'
import { formatEventRange } from '../../lib/eventDates'
import { rememberEventPopup } from '../../lib/eventPopupState'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

export interface EventPopupProps {
  event: EventEntry
  onClose: () => void
}

const EventPopup = ({ event, onClose }: EventPopupProps) => {
  const { t, i18n } = useTranslation(['common', 'events'])

  const close = () => {
    rememberEventPopup(event.id)
    onClose()
  }

  const short = t(`events:items.${event.id}.short`, '')
  const when = `${formatEventRange(i18n.language, event.date, event.endDate)} · ${event.location}${
    short ? ` · ${short}` : ''
  }`

  return (
    <Dialog
      open
      onClose={close}
      title={t(`events:items.${event.id}.title`)}
      description={when}
      closeLabel={t('common:event_popup.close')}
      className="max-w-lg"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/contact"
            onClick={close}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-paper-line px-6 py-3 text-sm font-semibold text-brand-deep hover:bg-paper"
          >
            {t('common:event_popup.meet')}
          </Link>
          <Button to="/events" variant="secondary" size="sm" onClick={close}>
            {t('common:event_popup.cta')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <p className="t-eyebrow">
        {t('common:event_popup.eyebrow')} · {t(`events:items.${event.id}.tag`, '')}
      </p>
      <p className="mt-3 leading-relaxed text-gray-700">
        {t(`events:items.${event.id}.description`, '')}
      </p>
    </Dialog>
  )
}

export default EventPopup
