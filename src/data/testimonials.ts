import goranRezension from '../assets/Testimonials/goran_rezension.png'

export interface Testimonial {
  id: string // added ID for translation lookup
  role: string
  name: string
  title: string
  focus: string
  text: string
  avatar?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'goran_ndu',
    role: 'Biologischer Zahnarzt',
    name: 'Dr. Goran · NDU Clinic, London',
    title: 'Biologischer Zahnarzt / NDU Clinic, London',
    focus: 'Vitamin-D- & CRP-Analyse direkt am Behandlungsstuhl',
    text:
      'Als biologischer Zahnarzt bin ich zutiefst überzeugt, dass ganzheitliche Gesundheit immer auch bei den Zähnen beginnt.\n\nDas Igloo Pro ermöglicht mir, schnell und präzise diagnostische Entscheidungen zu treffen – genau dort, wo sie gebraucht werden: am Behandlungsstuhl.\n\nDurch die sofortige Vitamin-D- und CRP-Analyse kann ich Implantatsetzungen optimal planen und oft deutlich beschleunigen. So erhalten meine Patientinnen und Patienten eine sicherere und effizientere Behandlung.',
    avatar: goranRezension,
  },
  {
    id: 'richard_pollock',
    role: 'Zahnarzt (Echte Rezension)',
    name: 'Richard Pollock',
    title: 'Biological Dentist and Implant Surgeon / Chelsea Dental Clinic',
    focus: 'Fast On-Site Health Checks (Prävention, Vitamin D)',
    text: '',
  },
  {
    id: 'eva_schmidt',
    role: 'Apotheke',
    name: 'Dr. Eva Schmidt',
    title: 'Inhaberin / Löwen-Apotheke, Berlin',
    focus: 'Der nächste Schritt in der Präventionsberatung (Kundenbindung, Schnelligkeit)',
    text: '',
  },
  {
    id: 'martin_fischer',
    role: 'Allgemeinmediziner/Praxis',
    name: 'Dr. Martin Fischer',
    title: 'Facharzt für Innere Medizin / Internistische Praxis Dr. Fischer',
    focus: 'Sofortdiagnostik bei Akutpatienten (Effizienz, Therapieentscheidung)',
    text: '',
  },
  {
    id: 'julia_bergmann',
    role: 'Klinik/Labor',
    name: 'Prof. Dr. Julia Bergmann',
    title: 'Leiterin Labor & Diagnostik / Klinikum Nord',
    focus: 'System-Kompatibilität & Zuverlässigkeit (Flexibilität, Bündelung)',
    text: '',
  },
]
