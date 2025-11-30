# Public Assets & Locales

Dieses Verzeichnis wird vom Build-Tool (Vite) **unverändert** in das Ausgabeverzeichnis (`dist/`) kopiert.
Es enthält statische Dateien, die direkt über den Browser abgerufen werden können.

## Inhalt

-   **`locales/`**: Enthält die JSON-Dateien für die Internationalisierung (i18next).
    -   Struktur: `locales/{sprache}/{namespace}.json`
    -   Beispiel: `locales/de/common.json`
    -   Wird zur Laufzeit asynchron geladen.
-   **`favicon.png`**: Das Favicon der Seite.
-   **`browser.png`**: Browser-Vorschau oder ähnliches Asset.
