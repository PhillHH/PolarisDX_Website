## `src/` – Applikationskern

In `src/` liegt der gesamte **Client‑Code** der React‑Anwendung.  
Die wichtigsten Bereiche sind:

- **`main.tsx`** – Einstiegspunkt der App:
  - Bindet React an den HTML‑Root (`#root`).
  - Wrappt die gesamte App in einen `BrowserRouter`.
  - Lädt globale Styles (`index.css`), die Tailwind initialisieren.

- **`App.tsx`** – zentrale Routing‑ und Layout‑Schicht:
  - Definiert alle Routen (`/`, `/contact`, `/shop`, `/shop/:slug`, `/articles/:slug`).
  - Betten jede Route in das gemeinsame `Layout` ein (Header + Footer).

- **`index.css`** & **`App.css`**:
  - `index.css` enthält Tailwind‑Deklarationen und globale Basisstile (Body, Links etc.).
  - `App.css` ist aktuell leer, da Styling über Tailwind‑Utility‑Klassen im JSX erfolgt.

- **`assets/`** – Bilder und Logos, die in Komponenten eingebunden werden.
- **`components/`** – Layout‑, Section‑ und UI‑Komponenten (siehe dortige `README.de.md`).
- **`routes/`** – eigentliche Seiten (Home, Shop, Produkt, Artikel, Kontakt).
- **`data/`** – reine Datenquellen, die die UI füttern (Produkte, Artikel, Testimonials usw.).

Die Struktur verfolgt das Ziel, **Inhalt (Daten)**, **Darstellung (UI)** und **Seitenlogik (Routes)** klar voneinander zu trennen.


