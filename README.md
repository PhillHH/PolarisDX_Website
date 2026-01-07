# PolarisDX / IglooPro – Gesamtdokumentation (DE)

Dieses Repository enthält
- das **React-Frontend** (SPA) für die PolarisDX / IglooPro Landingpage,
- den **Mail-Service** (Node/Express) für das Kontaktformular,
- ein optionales **Payload CMS** (derzeit nicht im Haupt-Deployment aktiv).

Alle Teile sind dockerisiert und können gemeinsam per `docker-compose` gestartet werden.

---

## Inhalt
- [Überblick & Architektur](#überblick--architektur)
- [Projektstruktur](#projektstruktur)
- [Voraussetzungen](#voraussetzungen)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Schnellstart mit Docker](#schnellstart-mit-docker)
- [Lokale Entwicklung ohne Docker](#lokale-entwicklung-ohne-docker)
- [Build, Test & Qualität](#build-test--qualität)
- [Übersetzungen & Inhalte](#übersetzungen--inhalte)
- [Deployment-Hinweise](#deployment-hinweise)
- [Troubleshooting](#troubleshooting)
- [Weiterführende Doku](#weiterführende-doku)

---

## Überblick & Architektur
- **Frontend (React/Vite, `src/`)**  
  SPA mit Tailwind, i18n, Routing via `react-router-dom`. Wird als statischer Build über Nginx ausgeliefert.
- **Mail-Service (`server/`)**  
  Leichtgewichtiger Express-Service für Kontaktanfragen. Sendet über SendGrid (`/api/contact`) und enthält einen Mock-Chat (`/api/chat`).
- **Optionales Payload CMS (`backend/`)**  
  Liegt getrennt, ist im Standard-Compose nicht aktiv. Kann später für redaktionelle Inhalte genutzt werden.
- **Reverse Proxy (Nginx)**  
  Bedient das Frontend und proxyt `/api/*` an den Mail-Service. Konfig in `nginx.conf`.

Netzwerkfluss (Docker Prod):
```
[Browser] -> Nginx (Port 80)
   |-- statische Assets -> /usr/share/nginx/html
   |-- /api/* -> Mail-Service (Port 5000) -> SendGrid SMTP
```

---

## Projektstruktur
- `src/` – Frontend (React/Vite, Komponenten, Routen, Daten, Assets)
- `public/` – Statische Assets & Übersetzungen (`public/locales/*`)
- `server/` – Mail-Service (Express, SendGrid)
- `backend/` – Payload CMS (nicht aktiv angebunden)
- `docker-compose.yml` – Startet Frontend + Mail-Service + Nginx
- `Dockerfile`, `Dockerfile.dev`, `nginx.conf` – Container-/Proxy-Setup
- `translations/`, `scripts` (`update_*.py/.cjs`) – Hilfen für Übersetzungen/Content

Details zu Teilbereichen liegen in den jeweiligen `README.de.md` Dateien unter `src/`.

---

## Voraussetzungen
- **Docker** & **Docker Compose** (empfohlen)
- Alternativ: **Node.js LTS** + **npm** für lokale Entwicklung ohne Docker

---

## Umgebungsvariablen
### Root / Docker (.env)
```env
# Frontend-URL (für CORS im Mail-Service)
FRONTEND_URL=http://localhost

# Mail-Service (SendGrid)
SENDGRID_API_KEY=...
CONTACT_RECEIVER=empfaenger@beispiel.com
SENDER_EMAIL=verifizierter-sender@beispiel.com
```

**Hinweis:** Die früheren M365-Variablen werden nicht mehr genutzt; der Mail-Service verwendet SendGrid.

### Mail-Service lokal (`server/.env`, falls separat gestartet)
Gleiche Variablen wie oben; bei Bedarf zusätzlich `PORT=5000`.

### Payload CMS (`backend/`)
Nicht im Standard-Setup aktiv. Siehe `backend/cms/.env.example` (Mongo/S3), falls benötigt.

---

## Schnellstart mit Docker
```bash
docker-compose up --build -d
```
Danach:
- Frontend: `http://localhost`
- API: `http://localhost/api`

Logs ansehen:
```bash
docker-compose logs -f
```

Stoppen:
```bash
docker-compose down
```

---

## Lokale Entwicklung ohne Docker
### 1) Frontend
```bash
npm install
npm run dev
# http://localhost:5173
```

### 2) Mail-Service
```bash
cd server
npm install
npm run dev
# http://localhost:5000
```

Stellen Sie sicher, dass das Frontend Requests gegen `http://localhost:5000/api` schickt (`FRONTEND_URL` für CORS setzen).

---

## Build, Test & Qualität
Frontend (Root):
```bash
npm run lint     # ESLint
npm run build    # TypeScript + Vite Build (Output: dist/)
npm run preview  # Build lokal ausliefern
```

Mail-Service:
```bash
cd server
npm run dev      # Node --watch
npm start        # Prod-Modus
```

Visuelle/Playwright-Tests: Siehe `test-results/verify_changes-verify-frontend-changes` und `verify_changes.spec.ts` (manuell anstoßen, falls benötigt).

---

## Übersetzungen & Inhalte
- i18n-Resourcen liegen in `public/locales/<lang>/*.json`.
- Start-/Routen-Content ist überwiegend in `src/data/*.ts` gepflegt (Produkte, Services, Artikel, Testimonials, Social Links).
- Sprachumschaltung erfolgt clientseitig (i18next). Flag-Icons stammen aus `flag-icons`.
- Für Content-Updates ohne Codeänderung eignen sich die `translations/` JSONs und die Datenfiles in `src/data/`.

---

## Deployment-Hinweise
- Empfohlen: Docker Compose auf Ziel-Server.
- Nginx (siehe `nginx.conf`) erledigt:
  - Gzip & Asset-Caching (lange `Cache-Control` Header, hashed Filenamen)
  - SPA-Fallback auf `index.html` (`try_files`)
  - Proxying von `/api` an den Mail-Service
- Für HTTPS: TLS/Let’s Encrypt am Nginx terminieren.

---

## Troubleshooting
- **CORS-Probleme beim Formular**: `FRONTEND_URL` korrekt setzen (inkl. Protokoll/Port).
- **Mails kommen nicht an**: `SENDGRID_API_KEY`, `SENDER_EMAIL` (verifiziert) und `CONTACT_RECEIVER` prüfen; Logs im `server`-Container ansehen.
- **i18n lädt nicht**: Pfade in `public/locales` prüfen; Netzwerk-Tab auf 404/403 checken.
- **Build schlägt fehl**: `npm run lint` für Hinweise; TypeScript-Fehler in Konsole.

---

## Weiterführende Doku
- `README.de.md` – Detailbeschreibung der SPA-Architektur
- `DOCS.md` – Technische Architektur (Docker/Nginx/Proxy)
- `src/**/README.de.md` – Komponentenspezifische Beschreibungen (Layout, Sections, UI, Routes, Data)
