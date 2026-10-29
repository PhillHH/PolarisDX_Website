import { lazy, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import SkipLink, { MAIN_CONTENT_ID } from './SkipLink'
import AreaShellProvider from '../area/AreaShellProvider'
import type { EventEntry } from '../../data/events'
import { CONSENT_CHANGED_EVENT, hasConsentDecision } from '../../lib/consentState'
import {
  EVENT_POPUP_DELAY_MS,
  anotherDialogOpen,
  eventPopupCandidate,
} from '../../lib/eventPopupState'

// SC-020: Termin-Hinweis beim ersten Laden — der Chunk lädt erst, wenn er wirklich erscheint.
const EventPopup = lazy(() => import('../events/EventPopup'))

interface LayoutProps {
  children: ReactNode
}

/**
 * Entscheidet im Browser, ob und wann der Termin-Hinweis erscheint: nächster belegter Termin,
 * einmal je Sitzung, nicht auf Termin-/Kontakt-/Supportseite, erst nach der Cookie-Entscheidung
 * (sonst lägen zwei Ebenen übereinander) und nie über einem anderen offenen Dialog.
 */
function useEventPopupOffer(pathname: string): [EventEntry | undefined, () => void] {
  const [offer, setOffer] = useState<EventEntry | undefined>(undefined)

  useEffect(() => {
    const candidate = eventPopupCandidate(pathname)
    if (!candidate) return
    let timer: number | undefined
    const schedule = () => {
      timer = window.setTimeout(() => {
        if (!anotherDialogOpen()) setOffer(candidate)
      }, EVENT_POPUP_DELAY_MS)
    }
    if (hasConsentDecision()) schedule()
    else window.addEventListener(CONSENT_CHANGED_EVENT, schedule, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(CONSENT_CHANGED_EVENT, schedule)
    }
  }, [pathname])

  return [offer, () => setOffer(undefined)]
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation()
  const [popupEvent, closePopup] = useEventPopupOffer(pathname)
  return (
    <div className="flex min-h-screen flex-col bg-paper text-heading">
      {/* Erstes fokussierbares Element im Dokument — sonst greift der Sprung
          ins Leere (WCAG 2.4.1). */}
      <SkipLink />
      <ScrollToTop />
      <Header />
      {/*
        flex-grow ensures the main content takes up the available space
        and pushes the footer to the bottom.
      */}
      {/* `tabIndex={-1}`: ohne ihn setzt der Browser den Fokus beim Sprung
          NICHT auf das <main>, sondern scrollt nur — die naechste Tab-Taste
          landete dann wieder oben in der Navigation. */}
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="flex flex-grow flex-col focus:outline-none"
      >
        <AreaShellProvider>{children}</AreaShellProvider>
      </main>
      <Footer />
      {popupEvent && (
        <Suspense fallback={null}>
          <EventPopup event={popupEvent} onClose={closePopup} />
        </Suspense>
      )}
    </div>
  )
}

export default Layout
