import { useEffect } from 'react'

import { OUTBOUND_DOMAINS, track, type OutboundDomain } from './tracking'

/**
 * AP23 PT23.3 — Klicks auf Ziele ausserhalb der Website.
 *
 * Bewusst EIN Listener am Dokument statt eines Handlers an jedem externen
 * Link: die externen Links stehen verstreut in Impressum, Ueber-uns und
 * Fusszeile, teils aus uebersetztem HTML erzeugt (`<a href=…>` im
 * Rechtstext). Jeden einzelnen anzufassen hiesse, den naechsten zu vergessen.
 *
 * Gemeldet wird ausschliesslich die DOMAIN, und auch die nur, wenn sie in der
 * Allowlist steht. Kein Pfad, keine Parameter, kein vollstaendiger Link: ein
 * externer Link kann einen Termin, ein geteiltes Dokument oder eine Kennung
 * tragen, die eine Person beschreibt. Eine unbekannte Domain wird verworfen,
 * nicht gemeldet — sonst waere die Allowlist nur eine Empfehlung.
 */

/** `www.` und Subdomains auf die registrierbare Domain zurueckfuehren. */
function bekannteDomain(href: string): OutboundDomain | null {
  let host: string
  try {
    host = new URL(href, window.location.origin).hostname.toLowerCase()
  } catch {
    return null
  }
  return OUTBOUND_DOMAINS.find((domain) => host === domain || host.endsWith(`.${domain}`)) ?? null
}

export function useOutboundTracking(): void {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      // Nur echte Fremdziele. Interne Links und Anker gehen den Router an.
      if (anchor.origin === window.location.origin) return

      const domain = bekannteDomain(anchor.href)
      if (!domain) return
      track({ name: 'outbound_click', domain })
    }

    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
}
