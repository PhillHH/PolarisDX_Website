## `src/components/sections/` – Inhalts-Sektionen

In diesem Verzeichnis liegen die **größeren Inhaltsblöcke**, die vor allem auf der Startseite (`HomePage`) eingesetzt werden.  
Jede Section ist konzeptionell ein eigener Abschnitt der Landingpage und nutzt UI‑Bausteine aus `components/ui/` sowie Bild‑Assets aus `assets/`.

---

### Wichtige Sections

- **`HeroSection.tsx`**
  - Oberer „Above the Fold“-Bereich.
  - Vermittelt Kernbotschaft: IglooPro als Point‑of‑Care‑Lösung mit 48‑Stunden‑Einsatzversprechen.
  - Enthält:
    - Kicker‑Text („Point-of-care Performance“),
    - große Überschrift und kurzen Beschreibungstext,
    - primären CTA‑Button zur Kontaktseite,
    - KPI‑Darstellung (`StatItem`) und Arzt‑Visual (`hero_doctor.png`).

- **`AboutSection.tsx`**
  - Stellt den Performance‑Anspruch und die 48‑Stunden‑Setup‑Garantie in den Vordergrund.
  - Bild-/Text‑Layout mit:
    - Bild „above the fold“ (`above_the_fold.png`) mit Farbflächen,
    - `SectionHeader` (Caption + Titel),
    - zwei erklärenden Absätzen,
    - CTA‑Button, der zurück zum Hero (`#hero`) führt.

- **`ServicesSection.tsx`**
  - Zeigt zentrale diagnostische Schwerpunkte (POC‑Systeme, Prävention, Infektion, Stoffwechsel, Hormone, Kompatibilität).
  - Nutzt:
    - `SectionHeader` zur Einleitung,
    - `services` aus `src/data/services.ts`,
    - `ServiceCard` zur Darstellung einzelner Services.

- **`DoctorsSection.tsx`** (falls eingebunden)
  - Dient typischerweise der Darstellung medizinischer Expertise / Ärzteteams.
  - Aufbau analog zu anderen Sections mit Grid‑Layout und Cards.

- **`TestimonialsSection.tsx`**
  - Kundenstimmen / Referenzen zum Igloo Pro System.
  - Datenquelle: `testimonials` aus `src/data/testimonials.ts`.
  - Enthält:
    - `SectionHeader` („KUNDENSTIMMEN“),
    - automatischen Slider (Wechsel alle 8 Sekunden) mit Zitaten, Name, Rolle und Titel,
    - Navigations‑Dots zur manuellen Auswahl,
    - zusammenfassende Kennzahlen („4.9 Overall Rating“, „99% Positive Review“).

- **`BlogSection.tsx`**
  - Zeigt Teaser für Blog-/Fachartikel.
  - Nutzt:
    - `SectionHeader` („Blog & News“),
    - `blogPosts` aus `src/data/blogPosts.ts`,
    - `BlogCard` zur Darstellung einzelner Teaser inkl. Bild und Auszug.

- **`CtaSection.tsx`**
  - Prominenter Call‑to‑Action am Ende der Seite.
  - Fokus: unverbindliche Beratung zu diagnostischen Lösungen / POCT‑Systemen.
  - Enthält:
    - Überschrift und Beschreibungstext,
    - CTA‑Button zur Kontaktseite (`/contact`),
    - zusätzliche Visitenkarten‑artige Box mit Telefonnummer und Reaktionszeit.

---

### Rollenverständnis

- Sections:
  - bündeln **konkrete Inhalte** (Texte, Bilder, Daten) zu einem thematischen Block,
  - nutzen **UI‑Komponenten** (Buttons, Cards, Header) als Bausteine,
  - werden von Seiten (z. B. `HomePage`) orchestriert.
- Änderungen am Aufbau der Landingpage passieren hauptsächlich durch:
  - Einfügen/Entfernen/Umsortieren von Sections in `HomePage.tsx`,
  - Anpassen der Texte/Bilder innerhalb der jeweiligen Section‑Komponenten.


