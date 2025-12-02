# PolarisDX Website & Mail Service

Dieses Repository enthält den Quellcode für die PolarisDX-Website (React) und den zugehörigen E-Mail-Service (Node.js).

## Projektstruktur

- `src/`: React Frontend-Anwendung.
- `server/`: Node.js Backend-Service für Kontaktformulare.
- `public/`: Statische Assets und Übersetzungsdateien.
- `backend/`: Payload CMS (aktuell in Entwicklung, getrennt vom Haupt-Deployment).

## Voraussetzungen

- Docker & Docker Compose
- Node.js (für lokale Entwicklung ohne Docker)

## Installation & Start (Docker - Empfohlen für Prod & Dev)

Das Projekt ist vollständig dockerisiert, um eine konsistente Umgebung zu gewährleisten.

### 1. Umgebungsvariablen setzen

Erstellen Sie eine `.env` Datei im Root-Verzeichnis (oder stellen Sie sicher, dass die Variablen im Environment gesetzt sind):

```env
M365_EMAIL_USER=deine-email@beispiel.com
M365_PASSWORD=dein-passwort
CONTACT_RECEIVER=empfaenger@beispiel.com
FRONTEND_URL=http://localhost  # oder Ihre Domain in Produktion
```

### 2. Starten mit Docker Compose

```bash
docker-compose up --build -d
```

Die Anwendung ist nun erreichbar unter:
- Frontend: `http://localhost` (Port 80)
- Backend API: `http://localhost/api` (via Nginx Proxy)

## Lokale Entwicklung (ohne Docker)

### Frontend
```bash
npm install
npm run dev
```
Läuft auf `http://localhost:5173`.

### Backend (Mail Service)
```bash
cd server
npm install
npm run dev
```
Läuft auf `http://localhost:5000`.

*Hinweis: Bei lokaler Entwicklung ohne Docker müssen Sie sicherstellen, dass das Frontend das Backend unter der korrekten URL (Port 5000) erreicht.*

## Deployment

Für das Deployment auf einem Server (z.B. Debian):

1. Repository klonen.
2. `.env` Datei mit Produktions-Zugangsdaten erstellen.
3. `docker-compose up --build -d` ausführen.

Nginx kümmert sich um:
- Auslieferung der statischen React-Dateien.
- Gzip-Komprimierung für bessere Performance.
- Caching von Assets.
- Proxying von `/api/*` Anfragen an den Backend-Container.

## Dokumentation

Weitere technische Details finden Sie in `DOCS.md`.
