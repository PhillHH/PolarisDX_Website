// Definition der Struktur für ein Testimonial (Kundenstimme)
export interface Testimonial {
  id: string; // Eindeutige ID für den Zugriff auf Übersetzungen (testimonials:<id>.text)
  role: string; // Rolle oder Beruf (kann statisch sein oder übersetzt werden)
  name: string; // Name der Person
  title: string; // Titel oder Position / Firma
  focus: string; // Fokus-Thema des Testimonials (z.B. "Schnelligkeit", "Prävention")
  text: string; // Der eigentliche Text (leer, da via i18n geladen)
  avatar?: string; // Optionales Bild (Dateiname in assets)
}

// Liste der Testimonials
// Dient als Gerüst für die Slider-Komponente. Inhalte werden dynamisch geladen.
export const testimonials: Testimonial[] = [
  {
    id: "richard_pollock",
    role: "Zahnarzt (Echte Rezension)",
    name: "Richard Pollock",
    title: "Biological Dentist and Implant Surgeon / Chelsea Dental Clinic",
    focus: "Fast On-Site Health Checks (Prävention, Vitamin D)",
    text: "", // Wird dynamisch befüllt
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
