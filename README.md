# PolarisDX Website

Dies ist das offizielle Repository für die PolarisDX Website. Das Projekt basiert auf React, TypeScript und Vite und nutzt Tailwind CSS für das Styling.

## Projektstruktur

-   **`src/`**: Quellcode der Frontend-Anwendung.
    -   **`components/`**: Wiederverwendbare UI-Komponenten (`layout`, `sections`, `ui`).
    -   **`routes/`**: Seiten-Komponenten für das Routing.
    -   **`data/`**: Statische Datendefinitionen und Typen.
    -   **`assets/`**: Bilder und statische Ressourcen.
-   **`backend/`**: Backend-Dienste und CMS (Payload CMS).
-   **`public/`**: Öffentliche Assets und Übersetzungsdateien (`locales`).
-   **`scripts/`**: Hilfsskripte (z.B. für Übersetzungsmanagement).

## Erste Schritte

### Voraussetzungen

-   Node.js (Version 18+ empfohlen)
-   npm

### Installation

Abhängigkeiten installieren:

```bash
npm install
```

### Entwicklungsserver starten

Startet den lokalen Entwicklungsserver unter `http://localhost:5173`:

```bash
npm run dev
```

### Produktion-Build erstellen

Erstellt eine optimierte Version im `dist/`-Ordner:

```bash
npm run build
```

## Dokumentation

Detaillierte technische Informationen finden sich in der Datei [DOCS.md](./DOCS.md).
Jedes größere Unterverzeichnis enthält zudem eine eigene `README.md` mit spezifischen Informationen.

## Lizenz

© PolarisDX. Alle Rechte vorbehalten.
