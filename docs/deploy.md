# Deployment-Runbook — Produktion und Preview (AP28)

**Vertrag:** `building-docs/DEPLOYMENT-CONTRACT.md` · **Werkzeug:** `./deploy.sh` · Stand 2026-10-16

Dieses Runbook ist der **einzige** produktive Zielpfad (DEP-02). Archivierte Alt-Konfiguration:
`_project-knowledge/deploy/archiv-ap28/`. Der frühere Host-Prozess der Preview ist in
`docs/deploy-preview.md` beschrieben und wird mit der Umstellung auf Container abgelöst.

## 1. Umgebungen

| Umgebung   | Compose                                             | Projekt             | Web (Host)       | API (Host)       | Secrets               | Zustellung                      |
| ---------- | --------------------------------------------------- | ------------------- | ---------------- | ---------------- | --------------------- | ------------------------------- |
| production | `docker-compose.yml`                                | `01polaris`         | `127.0.0.1:2026` | `127.0.0.1:5000` | `server/.env`         | live                            |
| preview    | `docker-compose.yml` + `docker-compose.preview.yml` | `polarisdx-preview` | `127.0.0.1:9100` | `127.0.0.1:5100` | `server/.env.preview` | Trockenlauf (`APP_ENV=preview`) |
| lokal      | `npm run dev` / Playwright-Configs                  | —                   | frei             | frei             | keine                 | Trockenlauf                     |

- Ports, Projektname und Ablageort sind über `WEB_HOST_PORT`, `API_HOST_PORT`, `PROD_PROJECT`,
  `PREVIEW_PROJECT`, `DEPLOY_STATE_DIR` überschreibbar (D-T25). Zwei Umgebungen teilen sich nie
  einen Port oder ein Volume.
- Der Host-nginx ist die öffentliche Grenze (TLS, HSTS, `X-Robots-Tag` der Preview). Die Container
  hören nur auf `127.0.0.1`.
- Der API-Port der Produktion ist veröffentlicht, weil der Host-nginx `/api/early-access` direkt an
  `127.0.0.1:5000` gibt (Early-Access-Seiten liegen außerhalb dieses Repos). Early-Access ist seit
  2026-10-16 stillgelegt (Owner, SC-004); sobald der nginx-Eintrag beim Cutover entfernt ist (§3),
  entfällt der Port (M-09).
- `server/.env*` ist nicht versioniert. `server/.env.preview` enthält **keinen** produktiven
  SendGrid-Schlüssel; ein Schlüssel dort bliebe trotzdem wirkungslos, weil `APP_ENV=preview` den
  Trockenlauf erzwingt.

## 2. Release-Ablauf (DEP-07)

```bash
# 0) Gates grün (QUALITY-GATES.md §12), Arbeitsbaum sauber, gewünschter Commit ausgecheckt
git status                                  # muss sauber sein

# 1) Einmal bauen — Tag = Git-SHA (12 Zeichen), Label org.opencontainers.image.revision
./deploy.sh build                           # gibt das Release aus, z. B. 3f2a9c1d0b7e

# 2) Erst Preview, dasselbe Image
./deploy.sh --env preview up 3f2a9c1d0b7e

# 3) Dann Produktion — nur mit Owner-Go
./deploy.sh up 3f2a9c1d0b7e
```

`up` macht in dieser Reihenfolge:

1. prüft, dass beide Images mit diesem Tag existieren (`up` baut nie);
2. Produktion: Sicherung der Lead-Daten samt Restore-Test (§4);
3. startet die Container mit `--no-build`;
4. **Health-Gate:** wartet, bis Backend (`/api/health`: Datenbank lesbar) und Web (SSR rendert
   `/de/`) `healthy` sind, höchstens `HEALTH_TIMEOUT` = 180 s;
5. **Identität:** das Revisions-Label beider laufenden Container entspricht dem Release (D-T2);
6. **Smoke** über den Host-Port, also denselben Weg wie nginx: Kernseiten 200, `/` 301,
   Unbekanntes 404, `sitemap.xml`/`robots.txt` 200, `/api/health` durch den SSR-Proxy 200,
   echtes Markup, in Produktion kein Verweis auf die Preview-Domain. **Kein POST, kein Lead,
   keine Mail** (DEP-48);
7. schreibt das Release in `.deploy/<env>/releases`.

Schlägt 4–6 fehl, gilt das Release als **nicht angenommen**. `deploy.sh` startet automatisch das
vorige Release und prüft es genauso.

## 3. Rollback (DEP-22..26)

```bash
./deploy.sh rollback               # auf das vorige Release aus .deploy/<env>/releases
./deploy.sh rollback 3f2a9c1d0b7e  # auf ein bestimmtes, noch vorhandenes Image
./deploy.sh status                 # laufendes Release, Health, Neustarts, Historie
```

- Ein Rollback tauscht **Images**. Kein `git checkout` und kein Bauen auf dem Host.
- Alte Images nicht mit `docker image prune -a` entfernen. Mindestens die letzten drei Releases
  bleiben liegen.
- **Auslöser** (DEP-23, vorab festgelegt): Health-Gate oder Smoke rot · 5xx auf Kernseiten ·
  Formulare antworten nicht mit `accepted` · Neustartschleife · falsche Canonicals oder Preview-Domain
  in der Produktion · Consent-Verstoß (Tracking vor Zustimmung).
- **Daten:** Ein Anwendungs-Rollback setzt keine Datenwiederherstellung voraus (DEP-21).
  Migrationen der Lead-Datenbank sind additiv (`server/lead-foundation/migrations`). Ein älteres
  Backend arbeitet auf einem neueren Schema nur, wenn keine Migration Spalten entfernt hat. Vor
  einem Release mit destruktiver Migration ist ein eigener Beschluss nötig (DEP-13).
- Nach jedem Rollback: Vorfall mit Zeit, Release, Auslöser und Wirkung in `building-docs/state/`
  dokumentieren (DEP-25).

### Erster Einsatz in der Produktion (einmalig)

Die heutige Produktion stammt noch aus dem `main`-Arbeitsbaum, ihre Images haben kein Tag
(`01polaris-frontend`, `01polaris-backend`). Vor dem ersten `up` werden sie als Release gesichert,
damit ein Rollback dorthin möglich ist:

```bash
./deploy.sh adopt main-2026-10                # taggt die laufenden Images, trägt sie in die Historie ein
```

**Achtung, Livegang-Blocker:** Das Produktions-Backend auf `main` bindet zusätzlich
`/var/lib/polaris-early` und `/var/lib/polaris-events` ein (Early-Access- und Event-Anmeldungen) und
beantwortet `POST /api/early-access`. Der Relaunch-Stand kennt beides nicht. Siehe
`building-docs/migration/MAIN-DELTA-2026-10.md`. **Entschieden am 2026-10-16 (Owner, SC-004):
Early-Access wird stillgelegt** (O2, Option A); im Relaunch ist `/early` eine 404.

#### Cutover-Checkliste Early-Access (vor dem ersten `up`, Operator)

**Stand 2026-10-16, 20:30: vorbereitet, Ausführung Operator** (Owner-Go erteilt, Protokoll
`building-docs/release/AP31-GO-LIVE.md`). Zielstand des vhost: `deploy/nginx/polarisdx.net.conf`;
Skript für Schritt 1–3 inklusive Sicherung: `sudo bash deploy/nginx/cutover-polarisdx.net.sh`
(bindet zugleich HSTS ein, OA-1). Reihenfolge einhalten:

1. Den Produktions-vhost (`sites-enabled/polarisdx.net`) vorher kopieren, damit der Rückbau
   umkehrbar ist.
2. Im 443-Block von `polarisdx.net` entfernen:
   - die `/early`- und `/<lang>/early`-Locations (11 Stück,
     `alias /home/phillip/01polaris/public/early/index.html`),
   - `location /early-assets/` (`alias /home/phillip/01polaris/public/early-assets/`),
   - die `/api/early-access`-Location(en) mit `proxy_pass` auf `127.0.0.1:5000`, einschließlich der
     Sperre für `/api/early-access/stats`.
3. `nginx -t`, dann nginx neu laden.
4. Nach dem Relaunch-`up` prüfen: `curl -sI https://polarisdx.net/early` liefert 404, und
   `/api/early-access` wird nicht mehr direkt an `127.0.0.1:5000` gegeben.
5. Erst danach die Publikation `127.0.0.1:5000` aus `docker-compose.yml` streichen (eigener Commit,
   DD-15/M-09).
6. **Daten nicht löschen:** `/var/lib/polaris-early/signups.jsonl` (personenbezogen) und
   `/var/lib/polaris-events` bleiben auf dem Host. Das Relaunch-Compose bindet sie nicht ein.
   Aufbewahrung/Löschung entscheidet der Owner mit dem Datenschutzbeauftragten (Vorschlag: Löschung
   nach dokumentiertem Export; Frist **offen**).
7. Danach `./deploy.sh adopt <name>` und das erste `./deploy.sh up <release>`.

**Besonderheiten des ersten `up` vom Altstand** (gemessen 2026-10-16):

- Das Alt-Backend hat kein `ops/backup.js` und keine Lead-Datenbank; `deploy.sh up` überspringt
  die Vor-Deploy-Sicherung dann mit Warnung statt abzubrechen (Altdaten liegen in den
  Host-Verzeichnissen, Punkt 6). Ab dem ersten AP28-Release wird wieder gesichert.
- Ein Rollback auf das übernommene Altbild (`main-2026-10`) besteht das Health-Gate **nicht**
  (kein `GET /api/health`, Compose-Healthcheck → `unhealthy`, Web startet nicht). Rückweg ist dann
  die alte Compose-Datei: `docker compose -p 01polaris -f /home/phillip/01polaris/docker-compose.yml up -d`
  plus vhost-Sicherung zurück (`AP31-GO-LIVE.md` §4).
- Beim `up` wird das Backend zuerst ersetzt (Health ≈ 30 s), dann das Web: Seitenausfall nur
  Sekunden, Formulare ≈ 45 s.

## 4. Sicherung und Wiederherstellung (PT28.5)

```bash
./deploy.sh backup                  # Datenbank (VACUUM INTO) + Support-Anhänge + Manifest, danach Restore-Test
./deploy.sh restore-test            # jüngste Sicherung im Wegwerf-Container prüfen
./deploy.sh restore .deploy/production/backups/20261016T031500Z
```

- **Umfang:** `describeBackupScope()`: die Lead-Datenbank (WAL-sicher über `VACUUM INTO`) und
  `SUPPORT_UPLOAD_DIR`. Nicht gesichert werden Secrets (gehören in die Secrets-Verwaltung) und
  Download-Token (nur als Hash gespeichert).
- **Manifest:** Release, Migrationsstand, Zeilen je Tabelle, SHA-256 der Datenbankdatei, Anzahl der
  Anhänge. Keine personenbezogenen Inhalte.
- **Restore-Test** (D-T6): startet das Backend-Image ohne Netz, hängt die Sicherung nur lesbar ein
  und prüft Prüfsumme, `integrity_check`, Fremdschlüssel, Migrationsstand, Zeilen und Anhänge gegen
  das Manifest. Eine Sicherung ohne grünen Restore-Test gilt nicht als wirksam (DEP-17). Der
  Zeitpunkt des letzten grünen Tests steht in `.deploy/<env>/last-restore-test`.
- **Restore:** prüft die Sicherung, sichert vorher den aktuellen Stand, stoppt Web und Backend,
  ersetzt Datenbank und Anhänge im Volume, startet und durchläuft Health-Gate und Smoke.
- **Aufbewahrung** (DEP-18): die jüngsten `BACKUP_KEEP` = 14 Sicherungen in `.deploy/<env>/backups`
  (Rechte `700`). Für die Produktion empfohlen: täglich per cron, z. B.
  `15 3 * * * cd /home/phillip/01polaris && ./deploy.sh backup >> .deploy/backup.log 2>&1`.
  Eine Kopie außerhalb des Servers ist eine Betreiberentscheidung (Owner).
- **RPO/RTO** (DEP-19, **vom Owner am 2026-10-16 bestätigt**, SC-004): RPO 24 h bei täglicher
  Sicherung (jede Anfrage geht zusätzlich als Mail ans Team und ist darüber rekonstruierbar), RTO
  30 min (Restore + Health-Gate). Voraussetzung ist der tägliche cron-Eintrag oben.

## 5. Betriebssignale (PT28.6)

| Signal                                    | Quelle                                                   | Prüfung                                        |
| ----------------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| Web/API-Gesundheit, Neustarts             | Docker-Healthchecks                                      | `./deploy.sh status`, `docker events`          |
| Warteschlange, Dead Letter, Zustellfehler | Backend-Job „alerts" alle 5 min ins Log (`[lead-alert]`) | `node scripts/lead-ops.mjs alerts` / `metrics` |
| Isolation (Preview im Trockenlauf)        | `lead-ops isolation`                                     | nach jedem Preview-Deploy                      |
| Sicherung                                 | `deploy.sh backup` (Exit-Code, Restore-Test)             | cron-Mail bei Exit ≠ 0                         |
| Logs                                      | `docker logs` (json-file, 5 × 10 MB je Dienst)           | `./deploy.sh logs`                             |

Externe Erreichbarkeitsprüfung und Alarmweg (Mail/Push) wählt der Betreiber (DEP-56). Ausgewertet
wird `/api/health` und `/de/` über `https://polarisdx.net`. Marketing-Analytics ist keine
Alarmquelle (DEP-36).

## 6. Bekannte Grenzen

- **Ein Image, zwei Umgebungen:** Vite backt `VITE_*` zur Bauzeit ein. Beide Umgebungen bauen
  heute mit demselben Profil (`VITE_APP_ENV=preview`, Preview-GTM), deshalb ist „einmal bauen,
  dann befördern" erfüllt. Sobald die Produktion einen eigenen GTM-Container bekommt (`CTC-04`,
  Owner), muss die Kennung zur Laufzeit gesetzt werden statt zur Bauzeit, sonst entstehen zwei
  Artefakte.
- **Kein Worker-Dienst:** Die Zustellung läuft als Dispatcher im Backend-Prozess (AP22). Ein
  getrennter Worker ist erst nötig, wenn die Last es verlangt.
- **Kein Image-Registry:** Images liegen lokal auf dem Host. Für einen zweiten Host oder eine
  Sicherung der Images wäre eine Registry nötig (Owner-Entscheidung).
