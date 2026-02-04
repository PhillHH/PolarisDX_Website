## PolarisDX / IglooPro – React SPA (Deutsch)

Dieses Projekt ist eine **Single-Page-Application (SPA)** für eine medizinische Landingpage mit Shop‑Charakter rund um **PolarisDX / IglooPro Point‑of‑Care‑Diagnostik**.  
Technische Basis: **React + TypeScript + Vite + Tailwind CSS**, Routing über **react‑router‑dom**.

---

## 1. Technischer Überblick

- **Framework**: React 19 mit TypeScript
- **Bundler/Dev‑Server**: Vite
- **Routing**: `react-router-dom` (Client‑Side‑Routing)
- **Styling**: Tailwind CSS (Utility‑Klassen in JSX)
- **Qualität**: TypeScript‑Build, ESLint
- **Containerisierung**: Docker + Nginx‑Setup vorhanden

Die App besteht aus:

- einer **Startseite** mit mehreren inhaltlichen Sektionen,
- einem **Artikelbereich** (fachliche/marketingorientierte Texte),
- einem **Demo‑Shop** für medizinische Produkte,
- sowie einer **Kontaktseite** mit Termin‑Formular.

---

## 2. Projektstruktur (abstrahiert)

Wichtige Verzeichnisse:

- **`src/`** – gesamter React‑Code
  - **`main.tsx`** – Einstiegspunkt, bindet React an `#root` und setzt den Router auf.
  - **`App.tsx`** – zentrale Routen‑Definition und Einbindung des Layouts.
  - **`routes/`** – Seiten (Home, Shop, Produktdetails, Artikel, Kontakt).
  - **`components/`** – Layout‑, Section‑ und UI‑Komponenten.
  - **`data/`** – zentrale Datenquellen (Produkte, Services, Artikel, Testimonials, Social Links).
  - **`assets/`** – Bilder/Logos.
- **`public/`** – statische Dateien, die direkt vom Webserver ausgeliefert werden.
- **`vite.config.ts`** – Vite‑Konfiguration (inkl. `~`‑Alias und Docker‑freundlichem Dev‑Server).
- **`tailwind.config.js`** – Tailwind‑Konfiguration (Design‑System).

Zu fast jedem dieser Verzeichnisse existiert eine eigene `README.de.md` mit Detailbeschreibung.

---

## 3. Build, Start & Entwicklung

Voraussetzung: **Node.js** (LTS empfohlen) und **npm**.

### Entwicklung

```bash
npm install
npm run dev
```

- Standard‑Dev‑Server: `http://localhost:5173/`  
- HMR (Hot Module Replacement) ist aktiviert.

### Produktion

```bash
npm run build
npm run preview
```

- `npm run build` erzeugt den Produktionsbuild in `dist/`.
- `npm run preview` startet einen lokalen Server, der den Build ausliefert.

### Docker (vereinfacht)

- **Dev‑Container**: nutzt den Vite‑Dev‑Server (`server.host = 0.0.0.0`, HMR über `clientPort: 3000`).
- **Prod‑Container**: baut das Projekt und dient statische Assets über Nginx aus (siehe `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `nginx.conf`).

Details zur genauen Docker‑Konfiguration können je nach Setup angepasst werden.

---

## 4. App‑Architektur

### 4.1 Einstieg & Routing

- **`src/main.tsx`**
  - Rendert `<App />` in `#root`.
  - Wrappt alles in `<BrowserRouter>` für Client‑Side‑Routing.
  - Lädt globale Styles (`index.css`), die Tailwind initialisieren.

- **`src/App.tsx`**
  - Definiert Routen:
    - `/` → `HomePage`
    - `/articles/:slug` → `ArticlePage`
    - `/contact` → `ContactPage`
    - `/shop` → `ShopPage`
    - `/shop/:slug` → `ProductPage`
  - Alle Seiten werden in das `Layout` eingebettet (`Header` + `Footer`).

### 4.2 Layout

- **`components/layout/Layout.tsx`**
  - Gemeinsam genutzte Seitenschale:
    - Header oben, Footer unten, Seiteninhalt in der Mitte.
  - Verantwortlich für Hintergrundfarbe und Mindesthöhe (`min-h-screen`).

- **`components/layout/Header.tsx`**
  - Fixierte Navigationsleiste oben mit:
    - Logo,
    - Hauptnavigation (Anker‑Links auf Sektionen + Route zur Shop‑Seite),
    - CTA‑Button „Contact Us“ (Route `/contact`),
    - Mobile‑Menü für kleine Bildschirme.
  - Reagiert auf Scroll‑Position, um Schatten und Transparenz anzupassen.

- **`components/layout/Footer.tsx`**
  - Footer mit:
    - PolarisDX‑Logo,
    - Kurzbeschreibung,
    - Link‑Spalten (Schnellnavigation, „Explore“),
    - Social‑Icons (aus `data/social.tsx`).

---

## 5. Seiten (Routes)

Detaildokumentation siehe `src/routes/README.de.md`. Kurzüberblick:

- **HomePage**
  - Aggregiert mehrere Sections (Hero, About, Services, Doctors, Testimonials, Blog).
  - Zeigt einen Shop‑Teaser mit ausgewählten Produkten.

- **ShopPage**
  - Listet alle Produkte aus `data/products.ts` als Karten.

- **ProductPage**
  - Detailansicht eines Produkts, basierend auf dem URL‑`slug`.
  - Stellt Features, technische Daten und Lieferumfang dar.

- **ArticlePage**
  - Detailansicht eines Blog-/Fachartikels.
  - Nutzt die Struktur aus `data/articles.ts` (Sections mit Überschriften, Text, Listen).

- **ContactPage**
  - Kontakt- und Terminformular (rein UI, keine echte Formular‑Verarbeitung).

---

## 6. Komponenten & UI‑Bausteine

Siehe ausführlich in:

- `src/components/README.de.md`
- `src/components/layout/README.de.md`
- `src/components/sections/README.de.md`
- `src/components/ui/README.de.md`

Grundidee:

- **Sections** sind größere inhaltliche Blöcke (z. B. Hero, About, Services, Blog, Testimonials, CTA).
- **UI‑Komponenten** (z. B. `PrimaryButton`, `SectionHeader`, `ProductCard`) sind kleine, wiederverwendbare Bausteine.
- **Layout‑Komponenten** (Header, Footer, Layout) bilden die Rahmenstruktur jeder Seite.

---

## 7. Datenquellen

Ausführliche Beschreibung in `src/data/README.de.md`. Kurz:

- **`products.ts`**
  - Enthält Produktdefinitionen (Name, Preis, Kategorie, Texte, technische Daten).
  - Wird in Shop‑Übersicht und Produktdetailseite verwendet.

- **`articles.ts`**
  - Enthält strukturierte Artikel mit Abschnitten, Texten, Listen und optional Bildern.
  - Grundlage für `ArticlePage` und `blogPosts.ts`.

- **`blogPosts.ts`**
  - Leitet Blog‑Teaser‑Daten direkt aus `articles` ab (kein doppelter Content).

- **`services.ts`**
  - Liste diagnostischer Services/Schwerpunkte für die Services‑Sektion.

- **`testimonials.ts`**
  - Kundenstimmen/Referenzen für die Testimonials‑Sektion.

- **`social.tsx`**
  - Social‑Media‑Links (Label, URL, Icon) für den Footer.

---

## 8. Erweiterung des Projekts

Typische Erweiterungen erfolgen **datengetrieben**:

- **Neues Produkt hinzufügen**
  - In `src/data/products.ts` einen neuen Eintrag im `products`‑Array ergänzen.
  - Erscheint automatisch im Shop und über `/shop/<slug>` in der Detailseite.

- **Neuen Artikel hinzufügen**
  - In `src/data/articles.ts` einen neuen `Article` hinzufügen.
  - Teaser wird automatisch in `blogPosts.ts` generiert.
  - Detailansicht über `/articles/<slug>`.

- **Neuen Service hinzufügen**
  - `src/data/services.ts` erweitern.
  - Karte wird automatisch in der Services‑Sektion angezeigt.

- **Neues Testimonial**
  - `src/data/testimonials.ts` erweitern.
  - Slider zeigt das Testimonial automatisch mit an.

---

## 9. Zielbild / Abstraktion

Dieses Projekt ist so strukturiert, dass **Inhalt (Daten)** und **Darstellung (Komponenten)** weitgehend getrennt sind.  
Neue Inhalte können ohne tiefgreifende Codeänderungen über die Dateien im Verzeichnis `src/data/` eingepflegt werden.  
Das Layout folgt einem konsistenten Designsystem auf Basis von Tailwind CSS, wodurch sich das UI leicht an Corporate‑Design‑Vorgaben anpassen lässt.


