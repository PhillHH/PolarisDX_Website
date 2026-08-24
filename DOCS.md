# Technische Dokumentation

> **⚠ NICHT KANONISCH — historischer Stand.**
> Dieses Dokument beschreibt eine Architektur, die das Repository **nicht mehr hat**: es nennt einen
> Nginx-ausgelieferten Single-Page-Build und ein `backend/`-Payload-CMS. Gemessen (AP01 PT01.4):
> `backend/` existiert nicht, `nginx.conf` wird von keiner aktiven Konfiguration referenziert, und
> die Produktion serviert **SSR** aus `server.ts` (`Dockerfile` → `npx tsx server.ts`, dahinter ein
> externer Reverse Proxy).
>
> **Kanonischer Einstieg für Menschen und Agenten:** [`building-docs/README.md`](building-docs/README.md)
> → `CONTEXT-INDEX.md` → `AGENT-CONTRACT.md` → `PROJECT-CONSTRAINTS.md` → `scope/MASTER-SCOPE.md`
> → aktuelles Arbeitspaket → `state/AP-STATE.md`.
> Der Ist-Zustand der Laufzeit steht in `building-docs/RUNTIME-CONTRACT.md`.
>
> Der folgende Text bleibt als historische Evidenz unverändert stehen.

---

## Architektur

Das Projekt folgt einer entkoppelten Architektur, die für den Produktionsbetrieb über Docker Compose orchestriert wird.

### Komponenten

1.  **Frontend (React/Vite)**
    - **Build-Prozess:** Multi-Stage Docker Build.
      - _Stage 1 (Builder):_ Node.js Container kompiliert TypeScript/React zu statischen HTML/CSS/JS Dateien.
      - _Stage 2 (Runner):_ Nginx Alpine Image serviert die statischen Dateien.
    - **Serving:** Nginx ist konfiguriert als Webserver und Reverse Proxy.
    - **Routing:** Da es sich um eine Single Page Application (SPA) handelt, leitet Nginx alle unbekannten Anfragen an die `index.html` weiter (`try_files $uri /index.html`).

2.  **Backend (Node.js/Express)**
    - Ein leichtgewichtiger Service (`server/`) ausschließlich für den E-Mail-Versand via Microsoft 365 SMTP.
    - **Sicherheit:** Validiert Eingaben und nutzt Environment-Variablen für Credentials.
    - **Networking:** Lauscht im Docker-Netzwerk auf Port 5000.

3.  **Payload CMS (`backend/`)**
    - Ein separates CMS-System, das aktuell entwickelt wird. Es ist im aktuellen `docker-compose.yml` Setup für die Hauptseite _nicht_ aktiv eingebunden, um Ressourcen zu sparen und Stabilität zu gewährleisten, bis es fertiggestellt ist.

### Netzwerkfluss (Produktion/Docker)

```
[Browser] -> [Port 80: Nginx Container]
                    |
                    +-- (Statische Assets) --> /usr/share/nginx/html
                    |
                    +-- (/api/*) --> [Port 5000: Backend Container] --> [SMTP Office365]
```

## Performance-Optimierungen

### Nginx Konfiguration (`nginx.conf`)

Um die Performance auf dem Debian-Server zu verbessern, wurden folgende Maßnahmen getroffen:

- **Gzip Komprimierung:** Aktiviert für Text-basierte Assets (HTML, CSS, JS). Dies reduziert die Übertragungsgröße drastisch.
- **Browser Caching:** Statische Assets (Bilder, Fonts, JS-Bundles) erhalten `Cache-Control` Header für langfristiges Caching (1 Jahr), da sich deren Dateinamen bei Änderungen (durch Vite-Hashing) ohnehin ändern.
- **Reverse Proxy:** API-Calls laufen über Nginx. Dies vermeidet CORS-Preflight-Requests (da Same-Origin) und vereinfacht die SSL-Konfiguration (SSL muss nur am Nginx terminiert werden).

## Wartung & Skalierung

- **Shop Deaktivierung:** Der Shop-Code ist vorhanden, aber die Routen (`App.tsx`) und Links (`Header.tsx`) sind auskommentiert. Um den Shop zu reaktivieren, müssen lediglich diese Kommentare entfernt werden.
- **Übersetzungen:** Werden über `i18next-http-backend` aus `public/locales/` geladen.
