import RichardPollockAvatar from '../assets/Testimonials/Richard-Pollock-Biological-Dentist-Internal (1).png'
import GoranAvatar from '../assets/Testimonials/goran_rezension.png'
import BastianAvatar from '../assets/Testimonials/Bastian Foto.jpeg'
import KristianGrimmAvatar from '../assets/Testimonials/Dr. Kristian Grimm.jpg'

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
    avatar: RichardPollockAvatar,
  },
  {
    id: "kristian_grimm",
    role: "Zahnarzt (Echte Rezension)",
    name: "Dr. Kristian Grimm",
    title: "32reasons Zahnteam / Hamburg",
    focus: "Prävention, Vitamin D, HbA1c, Systemische Gesundheit",
    text: "",
    avatar: KristianGrimmAvatar,
  },
  {
    id: "goran_stojanovic",
    role: "Zahnarzt (Echte Rezension)",
    name: "Goran Stojanovic",
    title: "Biological Dentist / Principal Dentist & Owner",
    focus: "Sofortdiagnostik für Implantatplanung (Vitamin D, CRP)",
    text: "",
    avatar: GoranAvatar,
  },
  {
    id: "bastian_wessing",
    role: "Ärztlicher Leiter",
    name: "Dr. Bastian Wessing",
    title: "MVZ Zahnkultur Berlin Brandenburg GmbH",
    focus: "Sofortdiagnostik für Parodontologie & Implantologie (Vitamin D, HbA1c, Cholesterin, CRP)",
    text: "",
    avatar: BastianAvatar,
  },
  {
    id: "martin_fischer",
    role: "Allgemeinmediziner/Praxis",
    name: "Dr. Martin Fischer",
    title: "Facharzt für Innere Medizin / Internistische Praxis Dr. Fischer",
    focus: "Sofortdiagnostik bei Akutpatienten (Effizienz, Therapieentscheidung)",
    text: "",
  },
];
