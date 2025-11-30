# Technische Dokumentation

Diese Datei beschreibt die technische Architektur, den Datenfluss und wichtige Implementierungsdetails der **PolarisDX Website**. Sie dient Entwicklern als Leitfaden, um sich im Projekt zurechtzufinden.

## Inhaltsverzeichnis

1.  [Projektüberblick](#projektüberblick)
2.  [Technologie-Stack](#technologie-stack)
3.  [Architektur & Struktur](#architektur--struktur)
4.  [Datenfluss & State Management](#datenfluss--state-management)
5.  [Internationalisierung (i18n)](#internationalisierung-i18n)
6.  [Routing](#routing)
7.  [Backend & CMS](#backend--cms)
8.  [Build & Deployment](#build--deployment)

---

## Projektüberblick

Die PolarisDX Website ist eine moderne, responsive Webanwendung, die als primäre Präsenz für die PolarisDX Unternehmensgruppe dient. Sie unterstützt Mehrsprachigkeit (10 Sprachen), dynamisches Routing und ein entkoppeltes CMS-Backend.

## Technologie-Stack

-   **Frontend:** React 18, TypeScript
-   **Build Tool:** Vite
-   **Styling:** Tailwind CSS
-   **Routing:** React Router DOM v6
-   **Internationalisierung:** i18next, react-i18next, i18next-http-backend
-   **Icons:** Lucide React, flag-icons
-   **CMS / Backend:** Payload CMS (Node.js) – *siehe `backend/` Verzeichnis*

## Architektur & Struktur

Der Quellcode ist im `src/`-Verzeichnis organisiert und folgt einer komponentenbasierten Architektur:

-   **`src/components/`**: Enthält alle UI-Komponenten.
    -   `layout/`: Globale Rahmenkomponenten (Header, Footer).
    -   `sections/`: Große Seitenabschnitte (Hero, About, Services), die auf Pages verwendet werden.
    -   `ui/`: Wiederverwendbare Basis-Elemente (Buttons, Cards).
-   **`src/routes/`**: Definiert die Seiten-Komponenten (Page-Level), die vom Router geladen werden.
-   **`src/data/`**: Statische Daten (Produkte, Services) und Typ-Definitionen. *Hinweis: Textinhalte werden oft über i18n geladen, während hier strukturelle Daten (IDs, Bilder) liegen.*
-   **`src/assets/`**: Statische Ressourcen (Bilder, Icons).

## Datenfluss & State Management

Die Anwendung nutzt primär lokalen React-State und Prop-Drilling für UI-Zustände.
Globale Daten wie die aktuelle Sprache werden über den i18n-Kontext verwaltet.

### Datenquellen

1.  **Statische Daten (`src/data/`)**: Definieren Strukturen wie Produkt-IDs, Bildpfade und Slugs.
2.  **Übersetzungsdateien (`public/locales/`)**: Enthalten alle Texte. Schlüssel werden oft dynamisch anhand der IDs aus den statischen Daten generiert (z.B. `t(products:${productId}.title)`).

## Internationalisierung (i18n)

Die Mehrsprachigkeit ist ein Kernbestandteil der Architektur.
Konfiguriert in `src/i18n.ts`.

-   **Backend-Plugin:** Lädt JSON-Dateien asynchron von `/public/locales/{lang}/{ns}.json`.
-   **Namespaces:** Inhalte sind in Namespaces unterteilt (`common`, `home`, `about`, `services`, etc.), um Ladezeiten zu optimieren.
-   **Spracherkennung:** `i18next-browser-languagedetector` ermittelt die Sprache anhand von URL, Cookies oder Browser-Einstellungen.

## Routing

Das Routing erfolgt client-seitig via `react-router-dom`.
Die Hauptkonfiguration befindet sich in `src/App.tsx`.

-   **Interne Links:** Müssen die `<Link>`-Komponente verwenden.
-   **Anker-Links:** Links zu Sektionen auf der Startseite (z.B. `#services`) müssen als absolute Pfade mit Hash (`/#services`) definiert werden, um von Unterseiten korrekt zu funktionieren.

## Backend & CMS

Das Backend befindet sich im Ordner `backend/cms` und basiert auf **Payload CMS**.
Es dient zur Verwaltung von dynamischen Inhalten (sofern angebunden) und stellt APIs bereit.
*Für Details siehe `backend/README.md`.*

## Build & Deployment

Das Projekt wird mit Vite gebaut.

-   **Entwicklung:** `npm run dev` (startet Dev-Server mit HMR).
-   **Build:** `npm run build` (führt `tsc` zur Typ-Prüfung und `vite build` zur Bundling aus).
-   **Docker:** `Dockerfile` und `docker-compose.yml` sind für Container-basiertes Deployment vorhanden.
