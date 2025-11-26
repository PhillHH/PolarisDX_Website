## `src/components/` – Wiederverwendbare Bausteine

In diesem Verzeichnis liegen alle **präsentationsorientierten Komponenten** der Anwendung.  
Sie sind in drei Ebenen gegliedert:

- **`layout/`** – Rahmenkomponenten (Header, Footer, Layout).
- **`sections/`** – inhaltliche Seitenabschnitte (Hero, About, Services, Blog, Testimonials, CTA).
- **`ui/`** – kleine, generische UI‑Bausteine (Buttons, Cards, Headings, Statistiken).

Ziel: Inhalt und Darstellung sauber zu trennen und UI‑Elemente mehrfach wiederverwenden zu können.

---

### `layout/`

Siehe Details in `components/layout/README.de.md`.

- `Layout.tsx` – umschließt jede Seite mit Header und Footer.
- `Header.tsx` – feste Navigationsleiste oben, inkl. Mobile‑Menü, Logos und CTA.
- `Footer.tsx` – Footer mit Logo, Link‑Spalten und Social‑Icons.

---

### `sections/`

Siehe Details in `components/sections/README.de.md`.

- Jede Datei entspricht einem **größeren Inhaltsblock** der Startseite:
  - `HeroSection`, `AboutSection`, `ServicesSection`, `DoctorsSection`, `TestimonialsSection`,
  - `BlogSection`, `CtaSection` und ggf. weitere Pitch‑Sektionen.
- Sections kombinieren UI‑Bausteine (Buttons, Cards, Header) mit Texten und Bildern.

---

### `ui/`

Siehe Details in `components/ui/README.de.md`.

- Enthält **kleine, fokussierte Komponenten**, z. B.:
  - `PrimaryButton`, `SectionHeader`, `ProductCard`, `ServiceCard`, `BlogCard`, `StatItem`.
- Sie werden in Sections und Pages wiederverwendet und sind der wichtigste Hebel, um das Design konsistent zu halten.

---

### Erweiterung

- **Neue Section**:
  - Neue Komponente in `sections/` anlegen.
  - In der passenden Seite (z. B. `HomePage.tsx`) importieren und einfügen.

- **Neues UI‑Element**:
  - Kleine, generische Komponente in `ui/` anlegen.
  - In Sections, Routen oder Layouts verwenden.

- **Layout ändern**:
  - Anpassungen primär in `layout/` vornehmen (z. B. neue Navigationseinträge, Logos, Footer‑Links).


