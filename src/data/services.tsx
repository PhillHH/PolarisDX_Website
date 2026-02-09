import { MonitorSmartphone, ShieldCheck, Flame, HeartPulse, Dna, Puzzle, Sparkles, Activity, Smile } from 'lucide-react'
import type { Service } from '../types'

export const services: Service[] = [
  // New areas (Widgets)
  {
    id: 'dental',
    title: 'Dental',
    description: '',
    translationKey: 'dental',
    icon: <Smile className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['green_practice', 'five_minute_diagnosis'],
  },
  {
    id: 'beauty',
    title: 'Beauty',
    description: '',
    translationKey: 'beauty',
    icon: <Sparkles className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: [],
  },
  {
    id: 'longevity',
    title: 'Longevity',
    description: '',
    translationKey: 'longevity',
    icon: <Activity className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['green_practice'],
  },
  // Existing Services
  {
    id: 'poc-systemloesungen',
    title: 'POC-Systemlösungen',
    description: '',
    translationKey: 'poc_systemloesungen',
    icon: <MonitorSmartphone className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['invisible_patient', 'five_minute_diagnosis', 'ecosystem_of_rapid_tests', 'rapid_setup_formula'],
  },
  {
    id: 'praeventions-checks',
    title: 'Präventive Gesundheits-Checks',
    description: '',
    translationKey: 'praeventions_checks',
    icon: <ShieldCheck className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['invisible_patient', 'precision_point_of_care'],
  },
  {
    id: 'infektion-entzuendung',
    title: 'Infektion & Entzündungsmarker',
    description: '',
    translationKey: 'infektion_entzuendung',
    icon: <Flame className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['precision_point_of_care'],
  },
  {
    id: 'stoffwechsel-herz',
    title: 'Stoffwechsel & Herzgesundheit',
    description: '',
    translationKey: 'stoffwechsel_herz',
    icon: <HeartPulse className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: [],
  },
  {
    id: 'hormon-tests',
    title: 'Hormon- & Endokrinologie-Tests',
    description: '',
    translationKey: 'hormon_tests',
    icon: <Dna className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: [],
  },
  {
    id: 'kompatibilitaet-integration',
    title: 'Herstellerübergreifende Kompatibilität',
    description: '',
    translationKey: 'kompatibilitaet_integration',
    icon: <Puzzle className="h-8 w-8" strokeWidth={1.5} />,
    relatedArticleIds: ['ecosystem_of_rapid_tests'],
  },
]
