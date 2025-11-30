# Sections Komponenten

Dieses Verzeichnis enthält die **großen, wiederverwendbaren Inhaltsblöcke** (Sections), aus denen die Seiten (`src/routes/`) zusammengesetzt werden.

## Übersicht

-   **`HeroSection.tsx`**: Der obere Bereich der Startseite (Hero-Banner).
-   **`AboutSection.tsx`**: "Über uns"-Teaser mit Bild und Text.
-   **`ServicesSection.tsx`**: Grid-Ansicht der Dienstleistungen.
-   **`DoctorsSection.tsx`**: (Optional) Vorstellung von Ärzten oder Experten.
-   **`TeamSection.tsx`**: Detaillierte Team-Vorstellung (für die About-Page).
-   **`TestimonialsSection.tsx`**: Slider oder Grid mit Kundenstimmen.
-   **`BlogSection.tsx`**: Vorschau der neuesten Blog-Artikel.
-   **`CtaSection.tsx`**: Call-to-Action Bereich ("Kontaktieren Sie uns"), oft im Footer integriert.

## Verwendung

Sections werden direkt in den Page-Komponenten importiert und platziert:

```tsx
// Beispiel: HomePage.tsx
import HeroSection from '../components/sections/HeroSection'
import AboutSection from '../components/sections/AboutSection'

const HomePage = () => (
  <>
    <HeroSection />
    <AboutSection />
  </>
)
```

## Entwicklung

-   Jede Section sollte idealerweise responsive sein (Mobile First mit Tailwind Breakpoints).
-   Inhalte (Texte) sollten über `useTranslation` geladen werden.
-   Daten (z.B. Listen von Services) sollten aus `src/data/` importiert werden, um Logik und Darstellung zu trennen.
