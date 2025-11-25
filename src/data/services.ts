export type Service = {
  id: string
  title: string
  description: string
}

export const services: Service[] = [
  {
    id: 'poc-systemloesungen',
    title: 'POC-Systemlösungen',
    description:
      'Ihre Schaltzentrale für die Diagnostik. Mobile Analysegeräte, die laborgenaue Ergebnisse in wenigen Minuten direkt am Ort der Behandlung liefern (z.B. Igloo Pro).',
  },
  {
    id: 'praeventions-checks',
    title: 'Präventive Gesundheits-Checks',
    description:
      'Vorsorge neu gedacht. Schnelle Bestimmung wichtiger Biomarker (z.B. Vitamin D, CRP, HbA1c) zur frühzeitigen Risikoerkennung und individuellen Gesundheitsberatung.',
  },
  {
    id: 'infektion-entzuendung',
    title: 'Infektion & Entzündungsmarker',
    description:
      'Schnelle Antworten in kritischen Fällen. Sofortige Analyse von Entzündungswerten (CRP, PCT, IL-6) und Infektionskrankheiten – essenziell für die Akutversorgung und Triage.',
  },
  {
    id: 'stoffwechsel-herz',
    title: 'Stoffwechsel & Herzgesundheit',
    description:
      'Wichtige Indikatoren im Blick. Präzise Messung von HbA1c, Cholesterinprofilen und kardialen Markern (z.B. D-Dimer) zur Überwachung chronischer Erkrankungen.',
  },
  {
    id: 'hormon-tests',
    title: 'Hormon- & Endokrinologie-Tests',
    description:
      'Spezialdiagnostik leicht gemacht. Breites Spektrum an Tests für Schilddrüsen- und Reproduktionshormone (TSH, AMH) für spezialisierte Praxen und Apotheken.',
  },
  {
    id: 'kompatibilitaet-integration',
    title: 'Herstellerübergreifende Kompatibilität',
    description:
      'Maximale Flexibilität. Unsere Geräte werten dank universeller Technologie 90% aller auf dem Markt befindlichen Lateral-Flow-Tests aus. Investitionssicherheit durch Offenheit.',
  },
]