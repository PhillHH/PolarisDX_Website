// Typdefinition für eine Dienstleistung
export type Service = {
  id: string // Dient als URL-Parameter (Slug) und Identifikator
  title: string // Fallback-Titel (Primärtitel kommt aus Übersetzung)
  description: string // Veraltet, wird durch i18n ersetzt (kann ggf. entfernt werden)
  translationKey: string // Schlüssel für den Zugriff auf 'services.json' (z.B. 'poc_systemloesungen')
}

// Liste aller angebotenen Dienstleistungen
// Dient zur Generierung der Service-Karten und Routing.
export const services: Service[] = [
  {
    id: 'poc-systemloesungen',
    title: 'POC-Systemlösungen',
    description: '',
    translationKey: 'poc_systemloesungen'
  },
  {
    id: 'praeventions-checks',
    title: 'Präventive Gesundheits-Checks',
    description: '',
    translationKey: 'praeventions_checks'
  },
  {
    id: 'infektion-entzuendung',
    title: 'Infektion & Entzündungsmarker',
    description: '',
    translationKey: 'infektion_entzuendung'
  },
  {
    id: 'stoffwechsel-herz',
    title: 'Stoffwechsel & Herzgesundheit',
    description: '',
    translationKey: 'stoffwechsel_herz'
  },
  {
    id: 'hormon-tests',
    title: 'Hormon- & Endokrinologie-Tests',
    description: '',
    translationKey: 'hormon_tests'
  },
  {
    id: 'kompatibilitaet-integration',
    title: 'Herstellerübergreifende Kompatibilität',
    description: '',
    translationKey: 'kompatibilitaet_integration'
  },
]
