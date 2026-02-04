## `src/components/ui/` – UI-Bausteine

Dieses Verzeichnis enthält **kleine, generische UI‑Komponenten**, die in Sections, Routen und Layouts wiederverwendet werden.  
Sie bilden das „Designsystem“ der Anwendung auf Komponentenebene.

---

### Buttons & Interaktion

- **`PrimaryButton.tsx`**
  - Universeller Button mit optionalem `as`‑Prop:
    - kann z. B. als `<button>`, `<a>` oder `Link` aus `react-router-dom` gerendert werden.
  - Varianten:
    - `primary` (Standard): Farbverlauf‑Rahmen mit weißem Inneren, ideal für Haupt‑CTAs.
    - `secondary`: gefüllter Button in Primärfarbe, z. B. auf hellen Hintergründen.
    - `outline-light`: transparenter Button mit heller Kontur, z. B. auf dunklen Hintergründen.
  - Enthält Fokus‑Styles (Focus‑Ring) zur Verbesserung der Zugänglichkeit.

---

### Abschnitts‑Header & Text

- **`SectionHeader.tsx`**
  - Standardisierte Kopfzeile für Sections:
    - `caption`: kleiner Kicker / Label (z. B. „DIAGNOSTIK-FOKUS“).
    - `title`: Hauptüberschrift (z. B. „Schlüsselbereiche der Präventivdiagnostik“).
    - `align`: `'left' | 'center'` – bestimmt Textausrichtung und Layout.
    - `id`: optional, erlaubt direkte Ansteuerung per Ankerlink (z. B. `#services`).
    - `titleClassName`: optionaler Override für die Titel‑Farbe (z. B. weißer Text im Primary‑Bereich).
  - Verwendet einen farbigen Gradient‑Rahmen um die Caption für konsistentes Look‑and‑Feel.

---

### Karten-Komponenten

- **`ProductCard.tsx`**
  - Präsentiert ein Produkt aus `data/products.ts`:
    - Name, Kategorie, Preis,
    - Kurzbeschreibung (auf 3 Zeilen begrenzt),
    - optionales Bild (über `image`‑Filename aus `assets/`),
    - Badge (z. B. „New“, „Popular“, „Limited“).
  - Link (`to`‑Prop) öffnet die entsprechende Produktdetailseite (`/shop/:slug`).

- **`ServiceCard.tsx`**
  - Darstellung eines diagnostischen Service‑Angebots:
    - optionales Icon,
    - Titel und Beschreibung,
    - „Read More“‑Button (stilistischer CTA ohne spezifische Logik).
  - Wird primär von `ServicesSection` genutzt.

- **`BlogCard.tsx`**
  - Teaser für einen Artikel:
    - Bild (optional),
    - Titel,
    - Auszugtext,
    - optionaler Link `to` zur Artikel‑Detailseite (`/articles/:slug`).
  - Verwendet in `BlogSection` sowie ggf. in anderen Artikel‑Teasern.

---

### Kennzahlen & Statistiken

- **`StatItem.tsx`**
  - Kleinere Statistik‑Komponente, z. B. für Kennzahlen im Hero:
    - `value`: Hauptwert (z. B. „48h“),
    - `suffix`: optionaler Zusatz (z. B. `%`),
    - `label`: erläuternder Text.
  - Nutzt große Schriftgröße und klare Typografie für KPI‑Darstellung.

---

### Rolle im Gesamtsystem

- UI‑Komponenten sorgen für:
  - **Konsistentes Design** über alle Seiten und Sections hinweg.
  - **Wiederverwendbarkeit**: Änderungen an einer UI‑Komponente (z. B. dem Button‑Design) wirken global.
- Neue visuelle Muster sollten nach Möglichkeit zuerst hier als eigenständige Komponenten implementiert und dann in Sections/Routen verwendet werden.


