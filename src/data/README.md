# Data Layer Dokumentation

Dieses Verzeichnis enthält **statische Datendefinitionen** und **TypeScript-Typen**, die in der Anwendung verwendet werden.

## Konzept

Die eigentlichen Textinhalte (Titel, Beschreibungen, Artikeltexte) werden **nicht** hier gespeichert, sondern über das i18n-System (`public/locales/`) geladen.

Die Dateien in `src/data/` dienen dazu:
1.  **Strukturen zu definieren:** Welche IDs gibt es? Welche Bilder gehören zu welcher ID? Welcher Slug wird verwendet?
2.  **Referenzen herzustellen:** Komponenten iterieren über diese Listen (z.B. `products.ts`), um Cards zu rendern, und nutzen die `id` oder einen `translationKey`, um den passenden Text aus den JSON-Dateien zu holen.
3.  **Typ-Sicherheit zu gewährleisten:** Exportierte Interfaces definieren die Form der Datenobjekte.

## Dateien

-   **`products.ts`**: Liste der Produkte im Shop. Enthält ID, Bildpfad, Preis, Kategorie und Slug.
-   **`services.ts`**: Dienstleistungen. Definiert die verfügbaren Services, ihre IDs (für Routing) und Translation-Keys.
-   **`articles.ts`**: Blog-Artikel. Enthält Metadaten (Autor, Datum, Lesezeit, Kategorie) und Strukturinformationen für die Detailansicht.
-   **`testimonials.ts`**: Kundenstimmen. Definiert Autor, Rolle und Bild. Der Textinhalt wird via i18n geladen.
-   **`social.tsx`**: Definition der Social-Media-Links und Icons (enthält JSX für Icons).
-   **`blogPosts.ts`**: (Legacy/Alternative) Ggf. eine andere Struktur für Blog-Posts, prüfen ob redundant zu `articles.ts`.

## Erweiterung

Um ein neues Element (z.B. Produkt) hinzuzufügen:
1.  Eintrag in der entsprechenden `.ts`-Datei (z.B. `products.ts`) hinzufügen.
2.  Passende Übersetzungen in den JSON-Dateien unter `public/locales/{lang}/{namespace}.json` ergänzen.
3.  Bild in `src/assets/` ablegen und referenzieren.
