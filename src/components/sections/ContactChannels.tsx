import { InfoItem } from '~/design-system'

/**
 * ContactChannels — Section-Molecule (REST-Konsolidierung, Plan E2/E3).
 *
 * Single Source of Truth fuer die offiziellen Kontakt-Kanaele. Zuvor standen
 * E-Mail und Telefon **doppelt** je Seite (Formular-Bereich **und** Sidebar) und
 * damit vierfach ueber `ContactPage` + `SupportPage` als rohe Literale. Die
 * geschuetzten Werte (`contact@polarisdx.net`, `+49 151 75011699`) leben jetzt
 * **einmal** hier; beide Seiten rendern den Block an genau **einer** Stelle
 * (persistente Sidebar-Kontaktbox). Labels bleiben Aufrufer-spezifisch
 * (z. B. „Support-Hotline" vs. „Priority-Line") und werden durchgereicht.
 *
 * SCHUTZ: Die Kontaktwerte sind Fakten — wortwoertlich, nicht uebersetzt.
 */
export const CONTACT_EMAIL = 'contact@polarisdx.net'
export const CONTACT_PHONE = '+49 151 75011699'

export interface ContactChannelsProps {
  emailLabel: string
  phoneLabel: string
  className?: string
}

export const ContactChannels = ({ emailLabel, phoneLabel, className }: ContactChannelsProps) => (
  <div className={className}>
    <InfoItem icon="✉" label={emailLabel}>
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="rounded-sm transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
      >
        {CONTACT_EMAIL}
      </a>
    </InfoItem>
    <InfoItem icon="☎" label={phoneLabel} className="mt-3">
      <a
        href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`}
        className="rounded-sm transition-colors hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)]"
      >
        {CONTACT_PHONE}
      </a>
    </InfoItem>
  </div>
)
