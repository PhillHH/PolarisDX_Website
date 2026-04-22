## Empfehlung

App.lazy.tsx als Single Source of Truth verwenden. entry-server.tsx soll ebenfalls App.lazy.tsx importieren — `renderToString` ignoriert `React.lazy()` und löst die Imports synchron auf, da alle Chunks im SSR-Bundle gebündelt sind. Damit entfällt die Pflicht, zwei Dateien synchron zu halten.

## Begründung

Die aktiven Routen sind bereits identisch; der einzige Unterschied sind tote auskommentierte Blöcke in App.tsx. Ein einzelner Tree eliminiert die Drift-Gefahr, die den S3-Leitlinie-Fix erzwungen hat.

## Risiken

- **Hydration-Regression:** Falls `renderToString` bei einem lazy-Import nicht den vollständigen HTML-String liefert, entsteht ein Hydration-Mismatch — vor dem Merge auf Staging mit allen Routen testen.
- **Suspense-Fallback im SSR:** `<Suspense fallback={null}>` darf serverseitig keinen leeren String erzeugen; validieren, dass React 19 + renderToString die lazy-Komponenten inline auflöst.
- **Build-Größe:** Der SSR-Bundle enthält nach Konsolidierung die gleichen manualChunks-Splits nicht — irrelevant, da SSR-Bundles nicht an den Client gehen, aber Build-Zeit kann leicht steigen.

## main.tsx

Löschen — wird von keinem Build-Pfad referenziert und erzeugt nur Verwirrung darüber, welcher Entry aktiv ist.

## /s3_leitlinie Slug

301-Redirect von `/s3-leitlinie` (kebab) auf `/s3_leitlinie` einrichten, langfristig den Canonical auf die Kebab-Variante umstellen, sobald Google die neue URL indexiert hat.
