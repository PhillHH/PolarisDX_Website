export interface Event {
  id: number;
  title: string;
  date: string;
  endDate?: string;
  location: string;
  description?: string;
  link?: string;
}

export const events: Event[] = [
  {
    id: 1,
    title: "Medica 2025",
    date: "2025-11-17",
    endDate: "2025-11-20",
    location: "Düsseldorf, Germany",
    description: "Besuchen Sie uns auf dem Weltforum der Medizin. Wir präsentieren unsere neuesten Point-of-Care-Lösungen.",
    link: "https://www.medica.de"
  }
];
