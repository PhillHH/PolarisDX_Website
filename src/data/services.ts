export type Service = {
  id: string
  title: string // Now used as key suffix if needed, or we iterate and construct key
  description: string // Removed or kept as key?
  translationKey: string
}

export const services: Service[] = [
  {
    id: 'poc-systemloesungen',
    title: 'POC-Systemlösungen', // Kept for reference or fallback, but component should use key
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
