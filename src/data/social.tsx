import type { ReactNode } from 'react'

// Typdefinition für einen Social-Media-Link
export type SocialLink = {
  label: string // Name des Netzwerks (für Screenreader/Title)
  href: string // Ziel-URL
  icon: ReactNode // Icon-Komponente oder Element
}

// Liste der Social-Media-Links, die im Footer oder Kontaktbereich verwendet werden
export const socialLinks: SocialLink[] = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: <span className="text-xs font-semibold">in</span>, // Placeholder-Icon (Text)
  },
  {
    label: 'Twitter',
    href: '#',
    icon: <span className="text-xs font-semibold">tw</span>,
  },
  {
    label: 'Instagram',
    href: '#',
    icon: <span className="text-xs font-semibold">ig</span>,
  },
  {
    label: 'Facebook',
    href: '#',
    icon: <span className="text-xs font-semibold">fb</span>,
  },
]
