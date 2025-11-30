# Routes Dokumentation

Dieses Verzeichnis enthält die **Page-Komponenten**, die direkt vom Router (`src/App.tsx`) angesteuert werden. Jede Datei repräsentiert eine vollständige Seite der Anwendung.

## Struktur

Jede Page-Komponente ist in der Regel wie folgt aufgebaut:

1.  **Imports:** Einbinden von Sektionen (`src/components/sections`), UI-Elementen und Hooks.
2.  **Datenbeschaffung:** Laden von statischen Daten (z.B. Produkte, Artikel) oder Nutzung von `useTranslation` für Texte.
3.  **Meta-Tags:** (Optional) Setzen von SEO-relevanten Tags (Title, Description) via `react-helmet-async` (falls implementiert).
4.  **Rendering:** Zusammenfügen der Sektionen (z.B. `<HeroSection />`, `<ServicesSection />`) zu einer Seite.

## Vorhandene Routen

-   **`HomePage.tsx`** (`/`): Die Startseite. Aggregiert die wichtigsten Sektionen (Hero, Services-Vorschau, Blog-Vorschau).
-   **`AboutPage.tsx`** (`/about`): "Über uns"-Seite. Zeigt Informationen zum Team und Unternehmen.
-   **`ContactPage.tsx`** (`/contact`): Kontaktformular und Adressdaten.
-   **`ShopPage.tsx`** (`/shop`): Übersicht aller Produkte.
-   **`ProductPage.tsx`** (`/shop/:slug`): Detailseite eines einzelnen Produkts. Nutzt den URL-Parameter `slug` zur Identifikation.
-   **`ServicePage.tsx`** (`/services/:slug`): Detailseite einer Dienstleistung. Zeigt den Hauptinhalt und oft eine Sidebar mit relevanten Artikeln.
-   **`DownloadsPage.tsx`** (`/downloads`): Download-Bereich für Broschüren und Preislisten.
-   **`ArticlePage.tsx`** (`/articles/:slug`): Blog-Artikel oder News-Detailansicht.

## Entwicklungshinweise

-   Neue Routen müssen in `src/App.tsx` registriert werden.
-   Verwende für interne Verlinkungen immer die `Link`-Komponente aus `react-router-dom`, um Full-Page-Reloads zu vermeiden.
-   Seiten sollten möglichst wenig eigene Styling-Logik enthalten und stattdessen Sektionen und UI-Komponenten komponieren.
