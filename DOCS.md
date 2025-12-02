# Technische Dokumentation

## Architektur

Das Projekt folgt einer entkoppelten Architektur, die für den Produktionsbetrieb über Docker Compose orchestriert wird.

### Komponenten

1.  **Frontend (React/Vite)**
    *   **Build-Prozess:** Multi-Stage Docker Build.
        *   *Stage 1 (Builder):* Node.js Container kompiliert TypeScript/React zu statischen HTML/CSS/JS Dateien.
        *   *Stage 2 (Runner):* Nginx Alpine Image serviert die statischen Dateien.
    *   **Serving:** Nginx ist konfiguriert als Webserver und Reverse Proxy.
    *   **Routing:** Da es sich um eine Single Page Application (SPA) handelt, leitet Nginx alle unbekannten Anfragen an die `index.html` weiter (`try_files $uri /index.html`).

2.  **Backend (Node.js/Express)**
    *   Ein leichtgewichtiger Service (`server/`) ausschließlich für den E-Mail-Versand via Microsoft 365 SMTP.
    *   **Sicherheit:** Validiert Eingaben und nutzt Environment-Variablen für Credentials.
    *   **Networking:** Lauscht im Docker-Netzwerk auf Port 5000.

3.  **Payload CMS (`backend/`)**
    *   Ein separates CMS-System, das aktuell entwickelt wird. Es ist im aktuellen `docker-compose.yml` Setup für die Hauptseite *nicht* aktiv eingebunden, um Ressourcen zu sparen und Stabilität zu gewährleisten, bis es fertiggestellt ist.

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

*   **Gzip Komprimierung:** Aktiviert für Text-basierte Assets (HTML, CSS, JS). Dies reduziert die Übertragungsgröße drastisch.
*   **Browser Caching:** Statische Assets (Bilder, Fonts, JS-Bundles) erhalten `Cache-Control` Header für langfristiges Caching (1 Jahr), da sich deren Dateinamen bei Änderungen (durch Vite-Hashing) ohnehin ändern.
*   **Reverse Proxy:** API-Calls laufen über Nginx. Dies vermeidet CORS-Preflight-Requests (da Same-Origin) und vereinfacht die SSL-Konfiguration (SSL muss nur am Nginx terminiert werden).

## Wartung & Skalierung

*   **Shop Deaktivierung:** Der Shop-Code ist vorhanden, aber die Routen (`App.tsx`) und Links (`Header.tsx`) sind auskommentiert. Um den Shop zu reaktivieren, müssen lediglich diese Kommentare entfernt werden.
*   **Übersetzungen:** Werden über `i18next-http-backend` aus `public/locales/` geladen.
