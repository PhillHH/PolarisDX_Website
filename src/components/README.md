# UI-Komponenten

In diesem Verzeichnis liegen alle **präsentationsorientierten Komponenten** der Anwendung.
Sie sind in drei Ebenen gegliedert:

-   **`layout/`** – Rahmenkomponenten (Header, Footer, Layout).
-   **`sections/`** – Inhaltliche Seitenabschnitte (Hero, About, Services, Blog, Testimonials, CTA).
-   **`ui/`** – Kleine, generische UI‑Bausteine (Buttons, Cards, Headings, Statistiken).

## Ziel
Inhalt und Darstellung sollen sauber getrennt werden. UI‑Elemente sollen mehrfach wiederverwendbar sein, um Konsistenz zu gewährleisten.

---

### `layout/`
Enthält Komponenten, die den Rahmen der Seite bilden.
-   `Layout.tsx`: Wrapper für jede Seite.
-   `Header.tsx`: Navigation.
-   `Footer.tsx`: Seitenabschluss.

### `sections/`
Enthält größere Inhaltsblöcke, die auf Seiten (`src/routes/`) zusammengesetzt werden.
Jede Sektion ist oft eine in sich geschlossene Einheit (z.B. "Über uns"-Teaser auf der Startseite).

### `ui/`
Enthält die kleinsten Bausteine (Atoms/Molecules).
Diese sind generisch und sollten keine business-spezifische Logik (wie API-Calls) enthalten, sondern rein über Props gesteuert werden.

---

## Erweiterung

-   **Neue Sektion**: Neue Komponente in `sections/` anlegen und in Pages importieren.
-   **Neues UI‑Element**: Generische Komponente in `ui/` anlegen.
