export interface Testimonial {
  id: string; // added ID for translation lookup
  role: string;
  name: string;
  title: string;
  focus: string;
  text: string;
  avatar?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "richard_pollock",
    role: "Zahnarzt (Echte Rezension)",
    name: "Richard Pollock",
    title: "Biological Dentist and Implant Surgeon / Chelsea Dental Clinic",
    focus: "Fast On-Site Health Checks (Prävention, Vitamin D)",
    text: "",
  },
  {
    id: "eva_schmidt",
    role: "Apotheke",
    name: "Dr. Eva Schmidt",
    title: "Inhaberin / Löwen-Apotheke, Berlin",
    focus: "Der nächste Schritt in der Präventionsberatung (Kundenbindung, Schnelligkeit)",
    text: "",
  },
  {
    id: "martin_fischer",
    role: "Allgemeinmediziner/Praxis",
    name: "Dr. Martin Fischer",
    title: "Facharzt für Innere Medizin / Internistische Praxis Dr. Fischer",
    focus: "Sofortdiagnostik bei Akutpatienten (Effizienz, Therapieentscheidung)",
    text: "",
  },
  {
    id: "julia_bergmann",
    role: "Klinik/Labor",
    name: "Prof. Dr. Julia Bergmann",
    title: "Leiterin Labor & Diagnostik / Klinikum Nord",
    focus: "System-Kompatibilität & Zuverlässigkeit (Flexibilität, Bündelung)",
    text: "",
  },
];
