# Backend Dokumentation

Das `backend/`-Verzeichnis enthält die Server-seitigen Komponenten der PolarisDX-Plattform.
Aktuell besteht dies primär aus einem **Headless CMS**, das auf [Payload CMS](https://payloadcms.com) basiert.

## Struktur

-   **`cms/`**: Das eigentliche CMS-Projekt (Next.js + Payload).
    -   **`src/collections/`**: Datenmodelle (Datenbank-Schemas) für Inhalte wie `Users`, `Media`, `Posts`.
    -   **`src/payload.config.ts`**: Hauptkonfiguration des CMS.
-   **`docker-compose.yml`**: Definition der Docker-Services für das Backend.

## Installation & Start

Das Backend ist für den Betrieb in Containern ausgelegt.

```bash
cd backend
docker-compose up -d
```

## Entwicklung

Das CMS bietet ein Admin-Panel zur Verwaltung von Inhalten.
Die API-Endpunkte werden automatisch basierend auf den Collections generiert (REST & GraphQL).
