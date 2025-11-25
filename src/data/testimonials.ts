export interface Testimonial {
  role: string;
  name: string;
  title: string;
  focus: string;
  text: string;
  avatar?: string; // Optional avatar image
}

export const testimonials: Testimonial[] = [
  {
    role: "Zahnarzt (Echte Rezension)",
    name: "Richard Pollock",
    title: "Biological Dentist and Implant Surgeon / Chelsea Dental Clinic",
    focus: "Fast On-Site Health Checks (Prävention, Vitamin D)",
    text: "Carrying out analysis of Vitamin D levels and other key health indicators on-site cannot be underestimated. The Igloo Pro enables me to perform a simple capillary blood test, to ascertain patients’ needs and to then guide them as to which additional supplements they might require to optimise treatment. This capability is proving transformative in terms of patient outcomes.",
  },
  {
    role: "Apotheke",
    name: "Dr. Eva Schmidt",
    title: "Inhaberin / Löwen-Apotheke, Berlin",
    focus: "Der nächste Schritt in der Präventionsberatung (Kundenbindung, Schnelligkeit)",
    text: "Seit wir das Igloo Pro System einsetzen, hat sich unsere Rolle als Gesundheitsberater extrem gestärkt. Kunden schätzen es ungemein, bei uns in Minuten wichtige Werte wie CRP oder Cholesterin bestimmen zu lassen, anstatt wochenlang auf Termine warten zu müssen. Eine echte Win-Win-Situation für Kundenbindung und Servicequalität.",
  },
  {
    role: "Allgemeinmediziner/Praxis",
    name: "Dr. Martin Fischer",
    title: "Facharzt für Innere Medizin / Internistische Praxis Dr. Fischer",
    focus: "Sofortdiagnostik bei Akutpatienten (Effizienz, Therapieentscheidung)",
    text: "Die Möglichkeit, Entzündungsmarker wie CRP sofort in der Praxis zu bestimmen, hat unseren Behandlungsablauf revolutioniert. Wir können bei Patienten mit unklaren Infekten schneller entscheiden, ob eine Antibiotika-Therapie nötig ist, und verhindern unnötige Überweisungen. Das spart uns Zeit und erhöht die Patientenzufriedenheit deutlich.",
  },
  {
    role: "Klinik/Labor",
    name: "Prof. Dr. Julia Bergmann",
    title: "Leiterin Labor & Diagnostik / Klinikum Nord",
    focus: "System-Kompatibilität & Zuverlässigkeit (Flexibilität, Bündelung)",
    text: "Das Igloo Pro ist das flexibelste Point-of-Care-Gerät, das wir je evaluiert haben. Die herstellerübergreifende Kompatibilität für Lateral-Flow-Tests ist ein enormer Vorteil, der uns erlaubt, unsere POC-Geräte zu standardisieren und Kosten zu sparen, ohne auf die bewährte Zuverlässigkeit der Ergebnisse verzichten zu müssen.",
  },
];
