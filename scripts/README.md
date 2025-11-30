# Scripts Dokumentation

Dieses Verzeichnis enthält Hilfsskripte für Entwicklung und Wartung.

## Skripte

-   **`generate_translations.py`**:
    -   **Zweck:** Synchronisiert Übersetzungsdateien.
    -   **Funktion:** Nimmt die englische Datei (`en/common.json`) als Basis und füllt fehlende Schlüssel in anderen Sprachen auf. Bestehende Übersetzungen bleiben erhalten.
    -   **Nutzung:** `python3 scripts/generate_translations.py`
    -   *Hinweis:* Aktuell auf `common.json` konfiguriert, muss für andere Namespaces ggf. angepasst werden.
