# PAYLOAD-3 — Empfehlung

## Empfehlung

**Option A: Komplett löschen.** Das CMS ist ein nicht-funktionaler Scaffold ohne Frontend-Anbindung, mit gebrochenem Import und widersprüchlicher DB-Konfiguration — es liefert keinen Wert und verschmutzt das Repo.

## Aufwand

- Option A (Löschen): 15 min
- Option B (Richtig anschließen): 5–8 Tage (DB-Setup, Schema-Migration, Fetching-Layer, i18n-Umzug für 10 Sprachen)
- Option C (Separates Repo): 30 min

## Risiko bei Löschung

Keines. Der Code ist in der Git-History erhalten und in 5 min wiederherstellbar. `npx create-payload-app` erzeugt dasselbe Scaffold in unter 2 min — sauberer und aktueller.

## Abhängigkeit zu Sprint-Plan

Wave 6 stellt die CMS-Frage ohnehin strategisch neu. Bis dahin blockiert der tote Folder nur Reviews und verwirrt neue Contributor — jetzt löschen, in Wave 6 bewusst entscheiden.
