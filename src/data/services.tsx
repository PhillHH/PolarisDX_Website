import { MonitorSmartphone, ShieldCheck, Flame, HeartPulse, Dna, Puzzle, Sparkles, Activity, Smile } from 'lucide-react'

export type Service = {
  id: string
  title: string
  description: string
  translationKey: string
  icon?: React.ReactNode
}

export const services: Service[] = [
  // New areas (Widgets)
  {
    id: 'dental',
    title: 'Dental',
    description:
      'Optimierte Implantologie. Sofortige Analyse von Vitamin D für bessere Wundheilung und Entzündungsmarker zur Risikominimierung direkt am Behandlungsstuhl.',
    translationKey: 'dental',
    icon: <Smile className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'beauty',
    title: 'Beauty',
    description:
      'Schönheit von innen. Hautgesundheit, Hormonstatus und Mikronährstoffe messen, um ästhetische Behandlungen fundiert zu begleiten.',
    translationKey: 'beauty',
    icon: <Sparkles className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'longevity',
    title: 'Longevity',
    description:
      'Proaktives Alternsmanagement. Monitoring von HbA1c, Lipiden und Entzündungswerten für ein längeres, gesünderes Leben.',
    translationKey: 'longevity',
    icon: <Activity className="h-8 w-8" strokeWidth={1.5} />,
  },
  // Existing Services
  {
    id: 'poc-systemloesungen',
    title: 'POC-Systemlösungen',
    description: '',
    translationKey: 'poc_systemloesungen',
    icon: <MonitorSmartphone className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'praeventions-checks',
    title: 'Präventive Gesundheits-Checks',
    description: '',
    translationKey: 'praeventions_checks',
    icon: <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'infektion-entzuendung',
    title: 'Infektion & Entzündungsmarker',
    description: '',
    translationKey: 'infektion_entzuendung',
    icon: <Flame className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'stoffwechsel-herz',
    title: 'Stoffwechsel & Herzgesundheit',
    description: '',
    translationKey: 'stoffwechsel_herz',
    icon: <HeartPulse className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'hormon-tests',
    title: 'Hormon- & Endokrinologie-Tests',
    description: '',
    translationKey: 'hormon_tests',
    icon: <Dna className="h-8 w-8" strokeWidth={1.5} />,
  },
  {
    id: 'kompatibilitaet-integration',
    title: 'Herstellerübergreifende Kompatibilität',
    description: '',
    translationKey: 'kompatibilitaet_integration',
    icon: <Puzzle className="h-8 w-8" strokeWidth={1.5} />,
  },
]
