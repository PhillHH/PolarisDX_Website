## `src/components/sections/` – Inhalts-Sektionen

In diesem Verzeichnis liegen die **größeren Inhaltsblöcke**, die vor allem auf der Startseite (`HomePage`) eingesetzt werden.  
Jede Section ist konzeptionell ein eigener Abschnitt der Landingpage und nutzt UI‑Bausteine aus `components/ui/` sowie Bild‑Assets aus `assets/`.

---

### Wichtige Sections

- **`HeroSection.tsx`**
  - Oberer „Above the Fold“-Bereich.
  - Vermittelt statisch und SSR-first die B2B-Positionierung von PolarisDX für Praxen und
    medizinische Einrichtungen; keine Carousel-/Autoplay-Abhängigkeit.
  - Enthält:
    - locale-aware Kicker, genau eine H1 und einen kurzen Beschreibungstext,
    - dominanten `GENERAL_SALES`-CTA zum realen Kontaktformular,
    - getrennten Diagnostics-Discovery-Link,
    - das dimensionierte IglooPro-Produktvisual (`Igloo-pro-frontal.webp`) als einziges eager
      Hero-Medium.

- **`BusinessPillarsSection.tsx`**
  - Positioniert Diagnostik, IglooPro und Epigenetik als drei gleichgewichtete, eigenständige
    Geschäftssäulen.
  - Leitet alle Säulen- und Service-Ziele aus der zentralen Route Registry ab.
  - Priorisiert Dental, Beauty und Longevity als drei reale Service-Einstiege aus
    `src/data/services.tsx`, ohne die neun Diagnostics-Detailseiten zu duplizieren.
  - Nutzt ein responsives Drei-Spalten-Grid beziehungsweise einen klaren Mobile-Stack und enthält
    keine Bilder, Slider oder Tracking-Abhängigkeit.

- **`WhyPocSection.tsx`**
  - Erklärt den betrieblichen Point-of-Care-Nutzen über Informationszugang, Workflow-Einbindung und
    Gesprächsgrundlage.
  - Trennt Praxisnutzen semantisch vom Patienten-/Anwendernutzen und begrenzt die Rolle des Tests
    ausdrücklich auf eine Ergänzung der professionellen Beurteilung.
  - Enthält keine Umsatz-/Ergebnisgarantie, CTA, Bilder oder interaktive Elemente.

- **`StepsSection.tsx`**
  - Bildet den POC-Ablauf als echte geordnete Liste ab: Anwendung/Messung, Ergebnisverfügbarkeit,
    fachliche Einordnung.
  - Behält dieselbe DOM- und Leserichtung auf Desktop und Mobile; sichtbare Nummern machen die
    Reihenfolge unabhängig von Farbe oder Icons.
  - Automatisiert keine medizinische Entscheidung und greift der Conversion-Journey aus PT11.5 nicht
    vor.

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
  - Zeigt genau eine bestehende namentliche Praxisreferenz zum IglooPro-System.
  - Datenquelle: `testimonials` aus `src/data/testimonials.ts`.
  - Enthält:
    - semantische Struktur aus `figure`, `blockquote` und `figcaption`,
    - reales, dimensioniertes und lazy geladenes Portrait,
    - claim-reduzierten bestehenden Schulungs-/Support-Text,
    - keine Ratings, Sterne, Carousel-/Autoplay-Logik oder Proof-CTA.

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
