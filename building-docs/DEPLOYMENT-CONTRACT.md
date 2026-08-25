# DEPLOYMENT-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Dateien ändert, folgt zwingend der Kontextpflicht
in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> Der heutige Stack erfüllt mehrere Kernanforderungen noch nicht (§6): keine persistente Speicherung,
> kein Worker, keine Image-Versionierung, kein Health-Gate nach dem Deploy.
> **Dieser Vertrag beschreibt das SOLL.**

---

## 1. Purpose

Dieser Vertrag beantwortet: **Wie wird die Laufzeit gebaut, befördert, ausgerollt, gesundheitsgeprüft,
gesichert und sicher zurückgerollt?**

Was die Laufzeit selbst sein muss, regelt `RUNTIME-CONTRACT.md`; womit ein Release als bewiesen gilt,
regelt `QUALITY-GATES.md`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Primäre Zielautorität:**

- **`REST-01`** — _„Produktionsbetrieb: **Docker/Compose**, Reverse Proxy/nginx davor; persistente Daten separat/backupfähig; Secrets außerhalb Images; Healthchecks, Restart Policies, Monitoring, image-basiertes Rollback."_
- **AP28** (Eigentümer), **AP30** (Release Candidate), **AP31** (Go-live/Rollback), **AP32** (Stabilisierung).

**Mitbetroffene APs:** AP01 PT01.5 (Toolchain), AP22 (Persistenz, Worker, `DRY_RUN`), AP26 (Secrets,
Image-Scan, Header), AP27 (Gates), AP29 (Migration vor Go-live), AP33 PT33.1.10 (Runbook).

**Stand AP02 PT02.5 (2026-08-24):** Der Produktionsbetriebsvertrag ist präzisiert — Ist-Erhebung in
**§3.1**, ergänzende Zielinvarianten **DEP-37 bis DEP-57** (Netz und Exposition, Reverse Proxy im Detail,
Gesundheit und Bereitschaft, Logs und Korrelation, Umfang und Abgrenzung), Ausfallmodi **§5.6**, Schulden
**DD-15 bis DD-17**, Regeln **M-09/M-10**, Nachweise **D-T16 bis D-T22** mit Zuordnung der
PT02.5-Anforderungen, Owner-Grenzen **§11.1**. PT02.5 ist ein reiner **Dokumentationsschritt**: keine
Docker-, Compose-, nginx-, Runtime-, Backend-, Environment- oder Abhängigkeitsdatei geändert, **kein
Deployment ausgeführt, kein Dienst gestartet oder gestoppt, kein Image gebaut**. **`REST-01` bleibt
unverändert die Zielautorität; es wird kein alternatives Produktionsmodell eingeführt.**

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.
**Es wird kein neuer Infrastruktur-Anbieter gewählt.**

---

## 3. Current Participating Files / Current State

| Datei                                                                  | Rolle                                                                                                                                                                                      | Guard  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| `docker-compose.yml`                                                   | zwei Services (`frontend`, `backend`), Bridge-Netz, `restart: unless-stopped`, `depends_on`; **keine `volumes:`-Sektion**, **kein Worker**, **kein `healthcheck:`**, **kein `image:`-Tag** | **G3** |
| `Dockerfile`                                                           | zweistufig, **Node 22-alpine**, `npm pkg delete scripts.prepare`, `HEALTHCHECK` per curl, `CMD npx tsx server.ts`                                                                          | **G3** |
| `server/Dockerfile`                                                    | **`FROM node:20`**, `npm install`, **kein `HEALTHCHECK`**                                                                                                                                  | **G3** |
| `deploy.sh`                                                            | `build \| up \| test \| logs \| down` über `docker compose`; baut mit `--no-cache frontend`                                                                                                | **G3** |
| `docs/deploy-preview.md`                                               | Preview-Runbook (detachter Host-Prozess auf `:9100`)                                                                                                                                       | G1     |
| `nginx.conf`, `vercel.json`, `Dockerfile.dev`, `scripts/prerender.mjs` | **Altlast**, wirken aktiv (§6)                                                                                                                                                             | G1     |
| `server/.env`                                                          | Secrets, gitignored, via `env_file` eingebunden                                                                                                                                            | **G3** |

### 3.1 Ist-Zustand Produktionsbetrieb (AP02 PT02.5, read-only erhoben 2026-08-24)

**Gemessener IST-Zustand, nicht das SOLL.** Erhebung durch Lesen der Konfigurationsdateien —
**kein Dienst gestartet oder gestoppt, kein Container gebaut, kein Deployment, keine produktive
Verbindung**. `server/.env` wurde **nicht** geöffnet; erfasst sind ausschließlich die im Code
referenzierten Variablen**namen**.

| Aspekt                    | Ist-Befund                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Produktionsmodell**     | `docker-compose.yml` mit **zwei** Services (`frontend`, `backend`), Bridge-Netz `app-network`, `restart: unless-stopped` bei beiden. **Keine `volumes:`-Sektion, kein Datenbankdienst, kein Worker, kein `healthcheck:`, kein `image:`-Tag**                                                                                                                                                                           |
| **Exposition**            | beide Services publizieren **auf `127.0.0.1`** — `frontend` `127.0.0.1:2026→3000`, `backend` `127.0.0.1:5000→5000`. Ein **externer Host-nginx** liegt davor; die Container sind **nicht** direkt öffentlich erreichbar                                                                                                                                                                                                 |
| **Interne Kommunikation** | `frontend` erreicht das Backend über den Compose-DNS-Namen (`BACKEND_URL=http://backend:5000`) — der zusätzlich veröffentlichte Host-Port des Backends wird dafür **nicht** benötigt                                                                                                                                                                                                                                   |
| **Abhängigkeiten**        | `depends_on: backend` **ohne Bedingung** — reine Startreihenfolge, keine Readiness-Prüfung                                                                                                                                                                                                                                                                                                                             |
| **Images**                | Frontend-`Dockerfile` zweistufig auf **Node 22-alpine** mit `HEALTHCHECK`; `server/Dockerfile` **`FROM node:20`, ohne `HEALTHCHECK`**. Compose baut lokal ohne Tag → **keine SHA-rückführbare Release-Identität**                                                                                                                                                                                                      |
| **Deployskript**          | `deploy.sh`: `build` baut mit `--no-cache frontend` **am Zielort**, `up` startet und wartet fest `sleep 5`; `test` prüft danach per `curl` Startseite, Titel und Sitemap sowie `docker inspect …State.Health.Status`. **Kein Health-Gate vor der Annahme**                                                                                                                                                             |
| **Preview**               | laut `docs/deploy-preview.md` ein **detachter Host-Prozess** (`npx tsx server.ts` auf `127.0.0.1:9100`, Node 20.19.6 via nvm) hinter Host-nginx, mit eigenem Backend auf `:5001`. **Kein Container, kein systemd** — bewusst dokumentiert, aber nicht das Zielmodell                                                                                                                                                   |
| **`DRY_RUN`**             | existiert als Startparameter der isolierten Preview-Backendinstanz und wirkt **ausschließlich auf den Mailversand**; in **keiner** Konfigurationsdatei deklariert                                                                                                                                                                                                                                                      |
| **Persistenz**            | **keine.** Kein Volume, kein Datenbankdienst, kein Storage-Scope — folglich auch kein Backup, kein Restore, kein Restore-Test                                                                                                                                                                                                                                                                                          |
| **Monitoring**            | **keins.** Keine Metriken, keine Alarme; Betriebsfehler existieren nur als stdout-Zeilen der Container                                                                                                                                                                                                                                                                                                                 |
| **Rollback**              | **nicht möglich** im Sinne von `REST-01` — ohne Image-Tag/Digest gibt es keinen identifizierbaren Vorgängerstand                                                                                                                                                                                                                                                                                                       |
| **CI**                    | genau ein Workflow (`.github/workflows/ci.yml`) — **kein** Build-, Image-, Scan- oder Deployment-Schritt                                                                                                                                                                                                                                                                                                               |
| **Alt-Konfiguration**     | `nginx.conf` ist ein **statisches SPA-Setup** (`root /usr/share/nginx/html`, `try_files $uri /index.html`, `proxy_pass http://backend:5000/api/`, `expires 1y` für Assets, **kein `no-store` für HTML**) — es würde SSR vollständig ersetzen. `vercel.json` enthält SPA-Rewrite und die `/services*`-301s. `Dockerfile.dev` ist von nichts referenziert, `scripts/prerender.mjs` nur über `build:prerender` erreichbar |
| **Konfigurationsnamen**   | im Code referenziert: `NODE_ENV`, `PORT`, `LISTEN_HOST`, `BACKEND_URL`, `FRONTEND_URL`, `DRY_RUN`, `CONTACT_RECEIVER`, `SENDER_EMAIL`, `SENDGRID_API_KEY`. **Keine Werte gelesen oder wiedergegeben**                                                                                                                                                                                                                  |

**Bewertung:** Der heutige Stand erfüllt von `REST-01` die Punkte **Docker/Compose**, **Reverse Proxy
davor**, **Restart Policies** und **Secrets außerhalb des Images** (`env_file`); er erfüllt **nicht**
persistente Daten, Backupfähigkeit, vollständige Healthchecks, Monitoring und image-basiertes Rollback.
Diese Messung bestätigt `DD-1`–`DD-14` und ergänzt drei neue Befunde (`DD-15`–`DD-17`, §6).

---

## 4. Target Invariants

### Grundzusage

**DEP-01 · Produktionsdeployment ist artefaktbasiert, reproduzierbar, gesundheitsgeprüft, rollbackfähig
— und legt persistente Daten niemals in verwerfbare Anwendungscontainer.** _(`REST-01`)_

**DEP-02 · Es gibt genau einen dokumentierten produktiven Zielpfad.** Zwei widersprüchliche
Konfigurationen dürfen nicht gleichermaßen produktiv-autoritativ erscheinen. _(AP28 PT28.7)_

### Artefakt

**DEP-03 · Einmal bauen, dann befördern.** Dasselbe Artefakt wandert zwischen den vorgesehenen
Umgebungen; während des Produktions-Cutover wird **kein anderer Code neu gebaut**.
_(AP28 PT28.4.2)_

**DEP-04 · Artefakte sind unveränderlich und identifizierbar** — versioniert bzw. per SHA benannt.
Die Herkunft eines Images ist bis zum Git-SHA nachvollziehbar. _(AP28 PT28.4.1)_

**DEP-05 · Kein unversioniertes Produktionsartefakt.** Ein lokal gebautes, namenloses Image ist kein
Releasegegenstand.

**DEP-06 · Der Build ist reproduzierbar** und nutzt die gepinnte Toolchain aus
`RUNTIME-CONTRACT.md` RT-10/RT-11.

### Ablauf

**DEP-07 · Die Reihenfolge ist verbindlich** (§5.2): SHA validieren → Gates grün → Artefakt bauen →
Backup-/Migrationsbereitschaft → deployen → Health-Gate → Smoke → annehmen oder zurückrollen.

**DEP-08 · Ein Deployment ist nicht erfolgreich, weil Container gestartet sind.** Erforderlich ist ein
**anwendungsnaher** Nachweis (§5.3). _(AP28 PT28.4.4)_

**DEP-09 · Schlägt eine launchkritische Gesundheitsprüfung fehl, gilt das Deployment als nicht
angenommen** und der Rollbackpfad greift.

### Daten

**DEP-10 · Persistente Daten liegen außerhalb des verwerfbaren Anwendungscontainers**, in separatem,
sicherbarem Speicher. _(`REST-01`, AP28 PT28.5.5)_

**DEP-11 · Migrationen sind versioniert** und in ihrer Reihenfolge nachvollziehbar. _(AP28 PT28.4.3)_

**DEP-12 · Migrationsverträglichkeit wird vor dem Deploy bewertet.** Ist ein Rollback vorgesehen, muss
das Schema vorwärts **und** rückwärts verträglich sein — oder der Rollbackpfad ist ausdrücklich anders
definiert. _(AP28 PT28.4.7)_

**DEP-13 · Destruktive Migrationen brauchen ausdrückliche Behandlung** — eigener Beschluss, Backup davor,
und ein definierter Weg zurück. Sie laufen nicht beiläufig mit einem Deploy.

**DEP-14 · Ein Anwendungs-Rollback setzt nicht blind Schemakompatibilität voraus.**

**DEP-15 · Backup und Restore existieren, bevor eine riskante Migration ausgeführt wird.**
_(AP28 PT28.5.1–.2)_

**DEP-16 · Kundendaten liegen nie ausschließlich in der beschreibbaren Containerschicht.**
_(`LEAD-DATA-CONTRACT.md` LD-01, `REST-01`)_

### Sicherung

**DEP-17 · Der Lead-/Datenbestand ist sicherbar**, mit dokumentierter Wiederherstellungsprozedur und
**mindestens einem durchgeführten Restore-Test**. _(AP28 PT28.5.2, Gate 3/12)_

**DEP-18 · Eine Aufbewahrungsregel für Sicherungen existiert.** _(AP28 PT28.5.3)_

**DEP-19 · RPO und RTO werden pragmatisch unter AP28 PT28.5.4 festgelegt.** **Dieser Vertrag erfindet
keine Zahlen.**

**DEP-20 · Der Zustand der Sicherung ist beobachtbar** — ein stiller Backup-Fehlschlag ist unzulässig.

**DEP-21 · Anwendungs-Rollback und Datenwiederherstellung sind getrennte Konzepte** und werden nie
gleichgesetzt.

### Rollback

**DEP-22 · Die vorherige Version ist identifizierbar und schnell startbar.** _(AP28 PT28.4.5–.6)_

**DEP-23 · Rollback-Auslösekriterien sind vorab definiert** und nicht im Vorfall zu erfinden.
_(AP31 PT31.5.2)_

**DEP-24 · Nach einem Rollback läuft ein Smoke-Test.** _(AP31 PT31.5.4)_

**DEP-25 · Jeder Vorfall wird dokumentiert.** _(AP31 PT31.5.5)_

**DEP-26 · Rollback erfolgt niemals durch Bearbeiten oder Auschecken von Quellcode auf dem
Produktionshost.** Ein Rollback tauscht ein Artefakt.

### Umgebungen

**DEP-27 · Preview/Staging sind betrieblich isoliert** — keine echten CRM-Schreibvorgänge, keine
unbeabsichtigten produktiven Mails an Kunden, keine produktiven Queue-Mutationen.
_(AP28 PT28.1.6, `LEAD-DELIVERY-CONTRACT.md` LDV-16)_

**DEP-28 · Getrennte Secrets, Zugangsdaten und Endpunkte je Umgebung.** _(AP28 PT28.1.4/PT28.3)_

**DEP-29 · `DRY_RUN` bzw. Testadapter greifen in Preview/Staging, wo Nebenwirkungen möglich wären.**
Der Schalter ist **deklariert**, nicht implizit. **Keine Flags erfinden** — Deklaration über AP22/AP28.

**DEP-30 · Eine Preview-Umgebung ist als solche erkennbar** und nicht indexierbar.
_(`SEO-CONTRACT.md` S-15)_

### Netz und Exposition (AP02 PT02.5)

**DEP-37 · Dienst-zu-Dienst-Verkehr läuft über ein privates, isoliertes Netz.** Web/SSR, Backend/API,
Persistenz und Worker erreichen einander über ein Compose-internes oder funktional gleichwertiges Netz,
nicht über den öffentlichen Weg. _(`RUNTIME-CONTRACT.md` RT-25)_

**DEP-38 · App-Container müssen nicht direkt öffentlich erreichbar sein.** Öffentlich ist der Reverse
Proxy. Was ein Dienst auf dem Host veröffentlicht, ist eine bewusste Entscheidung mit Begründung — nicht
ein Nebenprodukt der Compose-Datei. _(`RUNTIME-CONTRACT.md` RT-22)_

**DEP-39 · Ein Port wird nur veröffentlicht, wenn er tatsächlich gebraucht wird.** Erreicht ein Dienst
seinen Nachbarn bereits über das private Netz, ist eine zusätzliche Host-Veröffentlichung überflüssige
Angriffsfläche und wird entfernt oder begründet. _(Least Privilege, RT-25)_

**DEP-40 · Keine Debug-, Dev-Server- oder Diagnoseports im produktiven Betrieb.** Ein Entwicklungsserver
ist kein Produktionsstandard. _(AP26)_

### Reverse Proxy im Detail (AP02 PT02.5)

**DEP-41 · Der öffentliche Origin endet am Reverse Proxy.** TLS-Terminierung und der öffentliche
HTTPS-Einstieg liegen vor den Anwendungscontainern; dahinter läuft interner Verkehr. _(präzisiert DEP-32)_

**DEP-42 · Das Weiterleitungsziel folgt der Anwendungsstruktur:** Dokument-/SSR-Verkehr an den
Web/SSR-Dienst, die kanonischen API-Pfade kontrolliert an den Backend/API-Dienst. Der Proxy erfindet
keine eigene Routenwahrheit. _(`ROUTING-CONTRACT.md` R-24, `RUNTIME-CONTRACT.md` RT-20)_

**DEP-43 · Forwarded-Header werden deterministisch und vertrauenswürdig behandelt.** Host, Protokoll und
Client-Adresse sind hinter dem Proxy eindeutig rekonstruierbar — sie werden vom Proxy gesetzt und
stromabwärts nur aus vertrauenswürdiger Quelle übernommen. Davon hängen SSR-Ausgabe, Canonical,
Redirect-Ziele und die Belastbarkeit der Ratenbegrenzung ab. _(`SEO-CONTRACT.md` S-01,
`BACKEND-API-CONTRACT.md` API-16)_

**DEP-44 · Proxy-Caching darf den Runtime-Cache-Vertrag nicht brechen.** Solange HTML `no-store` trägt
(`RUNTIME-CONTRACT.md` RT-18), darf keine Zwischenschicht es dennoch zwischenspeichern. **Gehashte
Assets dürfen langzeit-cachebar bleiben**; technische Ressourcen wie Sitemap oder `robots.txt` erhalten
eine eigene, ausdrücklich festgelegte Policy. Performance-Optimierung selbst ist **AP25**.

**DEP-45 · Keine statische SPA-Konfiguration ersetzt die SSR-Laufzeit.** Eine Proxy-Konfiguration, die
Dokumentanfragen auf eine `index.html` umschreibt, ist mit dem Rendering-Vertrag unvereinbar und niemals
produktive Wahrheit. _(`RUNTIME-CONTRACT.md` RT-38/RT-41, DEP-02)_

### Gesundheit und Bereitschaft (AP02 PT02.5)

**DEP-46 · Gesundheit ist anwendungsnah, je Dienst.** Web/SSR: Anfragen werden angenommen und der
Renderpfad trägt. Backend/API: Anfrageverarbeitung ist verfügbar und kritische Abhängigkeiten sind
erreichbar. Worker: Prozess lebt und die Arbeitsschleife läuft. Persistenz: Speicher ist erreichbar.
_(präzisiert DEP-34, `RUNTIME-CONTRACT.md` RT-31)_

**DEP-47 · Bereitschaft und Lebendigkeit sind unterscheidbar.** Ein laufender Prozess ist nicht
zwangsläufig bereit, Verkehr anzunehmen. Wo das Deployment die Unterscheidung braucht, wird sie
getroffen. _(`RUNTIME-CONTRACT.md` RT-32)_

**DEP-48 · Eine Gesundheitsprüfung erzeugt keine produktiven Nebenwirkungen** — kein echter Lead, keine
echte Mail, kein echter CRM-Datensatz, keine Zustandsänderung. Sie legt außerdem **keine Secrets und
keine internen sensiblen Diagnosedaten** offen.

**DEP-49 · Startreihenfolge ist kein Bereitschaftsnachweis.** `depends_on` bzw. eine gleichwertige
Reihenfolgeangabe sagt nichts darüber, ob der Nachbardienst arbeitsfähig ist. Jeder Dienst muss entweder
auf echte Bereitschaft reagieren oder mit vorübergehender Nichtverfügbarkeit robust umgehen — das gilt
für Backend vor Datenbank, Worker vor Queue, Web vor Backend und für zeitweise nicht erreichbare externe
Provider. Die konkrete Umsetzung entscheidet **AP28** mit **AP22**.

### Logs und Korrelation (AP02 PT02.5)

**DEP-50 · Logs sind strukturiert und maschinell auswertbar** — mindestens Zeitpunkt, Umgebung, Dienst,
Schweregrad, Fehlerkategorie und, wo zutreffend, die Korrelationskennung.
_(`RUNTIME-CONTRACT.md` RT-34)_

**DEP-51 · Container-Logs über `stdout`/`stderr` bleiben die technische Grundlage** und müssen
dienstübergreifend einsammelbar sowie rotier- und aufbewahrungsfähig sein. Welche Senke das übernimmt,
entscheidet **AP28**; dieser Vertrag wählt **kein** Log-Produkt.

**DEP-52 · Logs enthalten keine Secrets und keine unnötigen personenbezogenen Nutzlasten.** Keine
vollständigen Lead-, Support- oder Bestellinhalte, keine rohen Provider-Antwortkörper. Eine Diagnose muss
ohne sie möglich sein. _(`RUNTIME-CONTRACT.md` RT-35, `LEAD-DELIVERY-CONTRACT.md` LDV-21/LDV-22)_

**DEP-53 · Ein Produktionsproblem ist zuordenbar** zu Release/Image, Dienst, Umgebung, Zeitpunkt,
Fehlerklasse und — bei Lead-/Zustellvorgängen — zur technischen Referenz des Vorgangs, ohne dafür
personenbezogene Nutzlast zu protokollieren. _(`RUNTIME-CONTRACT.md` RT-33, `LEAD-DATA-CONTRACT.md` LD-20)_

### Umfang und Abgrenzung (AP02 PT02.5)

**DEP-54 · Die bloße Existenz einer Datei im Repository macht sie nicht zur produktiven Wahrheit.** Eine
Konfiguration ist erst dann produktiv autoritativ, wenn dieser Vertrag sie als solche ausweist. Veraltete
Vercel-, SPA- und Prerender-Pfade überschreiben `REST-01` nicht. Ihre physische Bereinigung ist
**AP28 PT28.7** — PT02.5 löscht nichts. _(stützt DEP-02, DEP-45)_

**DEP-55 · Docker/Compose bleibt der Produktionsstandard.** Dieser Vertrag verlangt **keine** Orchestrierung
darüber hinaus: keine Cluster-Plattform, kein Blue-Green-, Canary- oder Multi-Region-Verfahren als
Pflicht. Gefordert sind kontrollierte Deployments, reproduzierbare Releases, Gesundheitsprüfung vor der
Annahme und möglichst geringe ungeplante Ausfallzeit. _(`REST-01`, `MASTER-SCOPE.md` §0.2.1)_

**DEP-56 · Der Betrieb bleibt anbieterneutral.** Datenbank-, Queue-, Monitoring-, Log- und
Secret-Manager-Technologie werden hier **nicht** gewählt; festgelegt sind nur die Eigenschaften, die sie
erfüllen müssen. Die Wahl treffen **AP22**/**AP28** auf kanonischer Grundlage.
_(`LEAD-DATA-CONTRACT.md` LD-32, `CRM-INTEGRATION.md` CRM-02)_

**DEP-57 · Ausgehende Verbindungen produktiver Container folgen `NETWORK-ALLOWLIST.md`.** Ein Dienst
erreicht nur die extern notwendigen Anbieter; jede Verbindung ist bewusst registriert. Ein pauschales
„alles nach außen erlaubt" ist kein zulässiges Zielbild. **Chat-/HiHuman-Netzpfade gehören nicht zum
Relaunch-Ziel** (`DEC-RL-007`); CRM-, Mail- und Monitoring-Verbindungen werden von ihren Owner-APs
registriert. _(`RUNTIME-CONTRACT.md` RT-26, AP26)_

### Sicherheit

**DEP-31 · Keine Secrets in Images oder im Repository.** Injektion zur Laufzeit, Least Privilege,
dokumentierte Rotation. _(`REST-01`, AP28 PT28.3)_

**DEP-32 · Der Reverse Proxy ist die öffentliche Eingangsgrenze;** TLS und HSTS gehören dorthin.
_(`RUNTIME-CONTRACT.md` RT-24, AP26 PT26.1.2)_

**DEP-33 · Images werden gescannt**, Abhängigkeiten geprüft. _(AP26 PT26.5.1/.5)_

### Betrieb

**DEP-34 · Restart Policies und Healthchecks sind für jeden Dienst deklariert** — auch für Backend und
Worker, nicht nur für das Web. _(`REST-01`, AP28 PT28.2.7–.8)_

**DEP-35 · Betriebssignale sind vorhanden** (§5.5) und alarmierbar. _(AP28 PT28.6)_

**DEP-36 · Marketing-Analytics ist keine Quelle für Betriebsalarme.**
_(`RUNTIME-CONTRACT.md` RT-37)_

---

## 5. Target Model

### 5.1 Zielstack (`REST-01` / AP28 PT28.2)

| Komponente                        | Rolle                                           | Pflicht                                    |
| --------------------------------- | ----------------------------------------------- | ------------------------------------------ |
| **Reverse Proxy / nginx**         | öffentliche Eingangsgrenze, TLS, HSTS           | ja                                         |
| **Web/SSR-Container**             | SSR + gebaute Assets                            | ja                                         |
| **Backend/API-Container**         | Validierung, Persistenz, Geschäftslogik         | ja                                         |
| **Worker**                        | asynchrone Zustellung/Retry                     | ja, sobald die Zustellschicht ihn verlangt |
| **Persistente Datenbank/Storage** | **separat**, mit Volume- bzw. Managed-Strategie | ja                                         |
| **Internes Netz**                 | Dienst-zu-Dienst                                | ja                                         |
| **Healthchecks**                  | je Dienst                                       | ja                                         |
| **Restart Policies**              | je Dienst                                       | ja                                         |

Konkrete Adressen, DNS-Namen und Bindungen: AP28, gegen die tatsächliche Topologie verifiziert
(`RUNTIME-CONTRACT.md` RT-23).

### 5.2 Deploymentablauf

```
1. SHA validieren            beabsichtigter Commit, eingefroren durch AP30
2. Qualitäts-Gates grün      QUALITY-GATES.md §12 — sonst kein Deploy
3. Artefakt bauen            unveränderlich, SHA-rückführbar (DEP-04)
4. Backup-/Migrations-       Sicherung aktuell, Migration bewertet (DEP-11/-12/-15)
   bereitschaft
5. Deployen                  dasselbe Artefakt in die Zielumgebung
6. Health-Gate               anwendungsnah, je Dienst (§5.3) — sonst Abbruch
7. Smoke-Tests               kritische Routen/Status, API-Bereitschaft
8. Annehmen ODER zurückrollen
```

Die konkreten Skripte entstehen in AP28; verbindlich ist die **Reihenfolge**.

### 5.3 Health-Gate

Ein Deployment gilt erst als angenommen, wenn **alle** zutreffenden Nachweise vorliegen:

| Nachweis                            | Inhalt                                                                             |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| **Web/SSR**                         | Prozess lebt, SSR beantwortet eine repräsentative Route, gebaute Assets erreichbar |
| **API**                             | Prozess lebt, Anfrageverarbeitung verfügbar, kritische Abhängigkeiten bereit       |
| **Worker** _(falls vorhanden)_      | Prozess lebt, Queue-Bereitschaft                                                   |
| **Persistenz**                      | dauerhafter Speicher erreichbar                                                    |
| **Repräsentative SSR-Anfrage**      | echtes Markup, kein Fehlerbild                                                     |
| **Repräsentative API-Bereitschaft** | Endpunkt antwortet erwartungsgemäß, **ohne** produktive Nebenwirkung               |
| **Kritische Route/Status**          | Statuscodes gemäß `ROUTING-CONTRACT.md`                                            |
| **Artefaktidentität**               | der laufende Dienst entspricht dem erwarteten Image/SHA (DEP-04)                   |

### 5.4 Umgebungsbeförderung

```
build (einmal, aus dem eingefrorenen SHA)
   └─► preview/staging   isoliert, DRY_RUN/Testadapter, nicht indexierbar
          └─► production dasselbe Artefakt, produktive Secrets und Endpunkte
```

Zwischen den Stufen wird **nicht neu gebaut** (DEP-03).

### 5.5 Betriebssignale (AP28 PT28.6 / AP32)

Web-/API-/Worker-Health · 5xx-/Fehlerraten · Queue-Tiefe · Retry-/Dead-Letter-Zugänge · CRM-Fehler ·
Mailzustellfehler · CPU/RAM/Disk, soweit relevant · Container-Neustarts · **Backup-Fehlschläge**.

**Alarmwürdig** mindestens: wachsendes Dead-Letter, anhaltende Kanalfehler, gestoppte Verarbeitung,
Neustartschleifen, fehlgeschlagene Sicherung.

### 5.6 Ausfallmodi (AP02 PT02.5)

Der Betriebsvertrag muss diese Fälle tragen. Verbindlich ist **je Zeile**: erkennen · sichtbar machen ·
Datenverlust vermeiden, soweit architektonisch möglich · wiederherstellen. Die Runbooks selbst entstehen
in **AP31/AP32**.

| Ausfall                                    | Erkennung                               | Erwartete Antwort der Architektur                                                               |
| ------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Web/SSR-Prozess fällt aus**              | Healthcheck, Verfügbarkeitssignal       | Restart Policy greift; Neustartschleife wird sichtbar (DEP-34, DEP-46)                          |
| **Backend/API fällt aus**                  | Healthcheck, 5xx-Rate                   | Restart; Web bleibt lieferfähig, Formularwege melden kontrollierte Fehler                       |
| **Persistenter Storage fällt aus**         | Health der Persistenz, API-Bereitschaft | **keine Annahme ohne Persistenz** (`LEAD-DATA-CONTRACT.md` LD-01); Wiederanlauf, ggf. Restore   |
| **Queue fällt aus**                        | Queue-Signal, Verarbeitungsstillstand   | Leads bleiben persistiert; Zustellung wird nachgeholt (`LEAD-DELIVERY-CONTRACT.md` LDV-01)      |
| **Worker fällt aus**                       | Worker-Health, Warteschlangentiefe      | Aufträge bleiben erhalten, Lease läuft ab, Auftrag wird erneut übernommen (LDV-13)              |
| **CRM fällt aus**                          | Kanalfehlerrate, Dead-Letter-Zugänge    | transient ⇒ Wiederholung mit Backoff; permanent ⇒ manuelle Prüfung (LDV-05/LDV-07)              |
| **Mailprovider fällt aus**                 | Kanalfehlerrate                         | wie CRM; **kein Leadverlust** (LDV-01, LDV-18)                                                  |
| **Proxy erreicht Upstream nicht**          | Proxy-Fehlerrate, Verfügbarkeitssignal  | kontrollierte Fehlerantwort, kein stiller Fallback auf statische Auslieferung (DEP-45)          |
| **Neues Image ist defekt**                 | Health-Gate nach dem Deploy             | Deployment gilt als nicht angenommen; Rollback auf die Vorgängerversion (DEP-09, DEP-22)        |
| **Migration ist fehlerhaft**               | Migrationsergebnis, Health-Gate         | Backup vorher vorhanden; Rollbackpfad definiert; destruktive Fälle vorab klassifiziert (DEP-13) |
| **Backup schlägt fehl**                    | Backup-Statussignal                     | sichtbar und alarmierbar — ein stiller Fehlschlag ist unzulässig (DEP-20)                       |
| **Restore-Test überfällig/fehlgeschlagen** | Teststatus                              | als Betriebsrisiko sichtbar; Sicherung ohne belegten Restore gilt nicht als wirksam (DEP-17)    |

---

## 6. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**.

| ID        | Schuld                                                                                                                                                                                                                                                                                                                            | Verletzt       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **DD-1**  | **Keine persistente Speicherung** — `docker-compose.yml` hat **keine `volumes:`-Sektion** und keinen Datenbankdienst                                                                                                                                                                                                              | DEP-10, DEP-16 |
| **DD-2**  | **Kein Worker-Service**                                                                                                                                                                                                                                                                                                           | §5.1           |
| **DD-3**  | **Keine Image-Versionierung** — Compose baut unversionierte lokale Images; kein `image:`-Tag, keine SHA-Rückführbarkeit                                                                                                                                                                                                           | DEP-04, DEP-05 |
| **DD-4**  | **Kein „einmal bauen, dann befördern"** — `deploy.sh build` baut mit `--no-cache frontend` direkt am Zielort                                                                                                                                                                                                                      | DEP-03         |
| **DD-5**  | **Kein Health-Gate nach dem Deploy** — `deploy.sh up` startet und wartet fest 5 s                                                                                                                                                                                                                                                 | DEP-08, DEP-09 |
| **DD-6**  | **Healthchecks unvollständig** — nur der Frontend-`Dockerfile` hat einen `HEALTHCHECK`; `server/Dockerfile` **keinen**; `docker-compose.yml` deklariert für **keinen** Service einen                                                                                                                                              | DEP-34         |
| **DD-7**  | **Toolchain-Drift auch im Deployment** — Frontend-Image **Node 22-alpine**, Backend-Image **`FROM node:20`**                                                                                                                                                                                                                      | DEP-06; AP01   |
| **DD-8**  | **Kein Backup, kein Restore, kein Restore-Test** — mangels Persistenz gibt es kein Objekt dafür                                                                                                                                                                                                                                   | DEP-15, DEP-17 |
| **DD-9**  | **Kein image-basiertes Rollback** — ohne Versionierung existiert kein identifizierbarer Vorgängerstand                                                                                                                                                                                                                            | DEP-22, DEP-26 |
| **DD-10** | **Widersprüchliche, aktiv wirkende Alt-Konfiguration** — `nginx.conf` (statisches SPA-Setup, passt weder zum SSR-Container noch zur Preview), `vercel.json` (SPA-Rewrite aus der Vercel-Zeit), `Dockerfile.dev` (von nichts referenziert), `scripts/prerender.mjs` (nur über `build:prerender` erreichbar, veraltete Routenliste) | DEP-02         |
| **DD-11** | **Preview weicht vom Zielmodell ab** — detachter Host-Prozess statt Container; `DRY_RUN` nur als Startparameter, in keiner Konfigurationsdatei deklariert                                                                                                                                                                         | DEP-27, DEP-29 |
| **DD-12** | **Kein Monitoring, keine Alarme**                                                                                                                                                                                                                                                                                                 | DEP-35         |
| **DD-13** | **Kein Image-/Dependency-Scan in CI**                                                                                                                                                                                                                                                                                             | DEP-33         |
| **DD-14** | **Kein HSTS am produktiven Origin**                                                                                                                                                                                                                                                                                               | DEP-32         |

**Neu aus AP02 PT02.5 (gemessen 2026-08-24):**

| ID        | Schuld                                                                                                                                                                                                                                                                | Verletzt       | Owner             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------- |
| **DD-15** | **Backend-Port ohne Bedarf auf dem Host veröffentlicht** — `backend` publiziert `127.0.0.1:5000`, obwohl der Frontend-Container ihn über den Compose-DNS-Namen `http://backend:5000` erreicht. Loopback-gebunden und damit nicht öffentlich, aber überflüssige Fläche | DEP-39         | **AP28** mit AP26 |
| **DD-16** | **`depends_on` ohne Bedingung** — reine Startreihenfolge; es gibt keine Bereitschaftsprüfung zwischen `frontend` und `backend`                                                                                                                                        | DEP-49         | **AP28 PT28.2**   |
| **DD-17** | **Kein Deployment- oder Image-Schritt in CI** — `.github/workflows/ci.yml` ist der einzige Workflow und kennt weder Build-Artefakt, Image-Tag, Scan noch Deploy; damit existiert keine Stelle, an der Release-Identität entstünde                                     | DEP-04, DEP-33 | **AP27**/**AP28** |

**Neu aus einem realen Deployment-Versuch (gemessen 2026-08-25, nach AP04-Closure):**

| ID        | Schuld                                                                                                                                                                                                                                                                                                                                                                                                                     | Verletzt                | Owner           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | --------------- |
| **DD-18** | **Der SSR-Dienst der Relaunch-Linie ist nicht containerfähig** — `server.ts:775` bindet hart auf `app.listen(PORT, '127.0.0.1', …)`. In einem Compose-Bridge-Netz ist der Prozess damit hinter dem Portmapping **unerreichbar**; der Container wird `healthy` gemeldet und liefert trotzdem `502`. Der Backend-Dienst macht es bereits richtig (`server/server.js:727` → `process.env.LISTEN_HOST \|\| '0.0.0.0'`). | DEP-08, DEP-38, DEP-42 | **AP28 PT28.2** |
| **DD-19** | **Der Preview-Port der Compose-Datei kollidiert mit der Produktion** — `docker-compose.yml` bindet `frontend` fest auf `127.0.0.1:2026`, und genau dorthin proxyt der produktive `polarisdx.net`-vhost. Ein `docker compose up` aus einem zweiten Arbeitsbaum trifft damit den Live-Port. Der Port ist nicht über eine Umgebungsvariable parametrisiert.                                                                    | DEP-27, DEP-29, DEP-38 | **AP28 PT28.4** |

### 6.1 Belege zu DD-18 / DD-19

**DD-18 — Messung.** Ein Container aus `Dockerfile` (Node 22-alpine, `CMD npx tsx server.ts`) startet,
gibt das SSR-Banner aus und meldet `healthy`. Im Container:

```
tcp  0  0  127.0.0.1:3000  0.0.0.0:*  LISTEN
```

Von außen: `curl http://127.0.0.1:9100/de` → `000` (kein Verbindungsaufbau), über den Reverse Proxy
`502`. **Der Healthcheck verdeckt den Fehler**, weil er im Container gegen `127.0.0.1` läuft — das ist
zugleich ein konkreter Beleg für `DEP-08` („Ein Deployment ist nicht erfolgreich, weil Container
gestartet sind").

**Linienvergleich.** Der Bind-Host unterscheidet die beiden Produktlinien:

| Linie                                                   | `server.ts`                              | containerfähig |
| ------------------------------------------------------- | ---------------------------------------- | -------------- |
| Relaunch (`feat/home-leadmagnet`, Baseline `961f65d`)   | `app.listen(PORT, '127.0.0.1', …)`       | **nein**       |
| `main`                                                   | `app.listen(PORT, …)` → bindet `0.0.0.0` | ja             |
| Backend `server/server.js` (beide Linien)               | `process.env.LISTEN_HOST \|\| '0.0.0.0'` | ja             |

Eingeführt mit `dbe992b` (*feat(contact): Multi-Intent-Kontaktformular*) — die Bindung an `127.0.0.1`
ist dort ein Nebeneffekt, keine Betriebsentscheidung. Dass die produktive Seite heute läuft, liegt
allein daran, dass das aktive Image aus der `main`-Linie stammt.

**Erwartetes Zielverhalten (AP28).** Der Bind-Host wird parametrisiert, mit demselben Muster, das das
Backend bereits verwendet — Vorschlag, nicht Vorwegnahme:

```ts
app.listen(PORT, process.env.LISTEN_HOST || '0.0.0.0', () => { … })
```

Damit bleibt die lokale Entwicklung auf Wunsch loopback-gebunden, und der Container ist hinter dem
Reverse Proxy erreichbar, ohne `network_mode: host` zu benötigen. **`server.ts` ist ein G3-Hotspot** —
die Änderung folgt der Kontextpflicht aus `RUNTIME-CONTRACT.md` und wird nicht nebenbei vorgenommen.

**Zwischenlösung, die den Befund nicht auflöst.** Der Preview auf `preview.polarisdx.net` läuft
derzeit mit `network_mode: host` und `PORT=9100` über einen Override **außerhalb** des Repositories.
Das ist eine Umgehung, kein Zielzustand: es verletzt `DEP-37` (privates Dienstnetz) und ist
ausdrücklich **nicht** als Vorlage für den Produktionsbetrieb zu verwenden.

**DD-19 — Messung.** `docker-compose.yml` → `ports: ['127.0.0.1:2026:3000']`;
`/etc/nginx/sites-enabled/polarisdx.net` → `proxy_pass http://127.0.0.1:2026`. Der produktive
Container `01polaris-frontend-1` hält diesen Port. Ein zweiter Arbeitsbaum, der dieselbe Compose-Datei
verwendet, konkurriert unmittelbar um die Live-Fläche. Zielzustand nach `DEP-27`/`DEP-29`: Umgebungen
unterscheiden sich über Konfiguration, nicht über eine geteilte, fest verdrahtete Portnummer.

**Positiv zu erhalten:** `restart: unless-stopped` für beide Dienste · Secrets über `env_file` außerhalb
des Images · `npm pkg delete scripts.prepare` in beiden Build-Stufen (ohne das bricht der Docker-Build) ·
der bestehende `HEALTHCHECK` im Frontend-Image · das Preview-Runbook `docs/deploy-preview.md` als einzige
zutreffende Betriebsbeschreibung.

---

## 7. Modification Rules

**M-01 — Es gibt genau einen produktiven Zielpfad.** Wer eine Konfiguration hinzufügt, entfernt oder
kennzeichnet die widersprüchliche (DEP-02, AP28 PT28.7).

**M-02 — Kein Deploy ohne grüne Gates.** Die Gate-Liste besitzt `QUALITY-GATES.md`; dieser Vertrag
verweist darauf und definiert sie nicht neu.

**M-03 — Persistenz wird eingeführt, bevor der erste produktive Lead sie braucht.** Master-Scope §7:
_„Docker/Compose-Environment → CRM-Betriebsarbeit."_

**M-04 — `npm pkg delete scripts.prepare` bleibt in beiden Build-Stufen.** Ohne das scheitert der
Docker-Build, weil lefthook kein `.git` im Build-Kontext findet.

**M-05 — Ein neuer Dienst bringt Healthcheck, Restart Policy und Signale mit** (DEP-34, DEP-35).

**M-06 — Migrationen werden gemeinsam mit dem Rollbackpfad geplant** (DEP-12/-14).

**M-07 — Secrets werden nie ins Image gebacken**, auch nicht „nur für den Build" (DEP-31).

**M-08 — Es wird kein neuer Infrastruktur-Anbieter gewählt.** Der Rahmen ist `REST-01`; konkrete
Detailtechnik (Datenbankprodukt, Queue-Technik) entscheidet AP22/AP28 innerhalb dieses Rahmens.

**M-09 — Ein veröffentlichter Port ist eine Entscheidung, keine Gewohnheit.** Wer einen Host-Port
hinzufügt oder behält, begründet ihn gegen DEP-38/DEP-39; erreicht der Nachbardienst ihn bereits über das
private Netz, entfällt er.

**M-10 — Wer eine Betriebsdatei ändert, prüft die Nachbarverträge mit.** Rendering und Cache über
`RUNTIME-CONTRACT.md`, Status und Routen über `ROUTING-CONTRACT.md`, Zustellung und `DRY_RUN` über
`LEAD-DELIVERY-CONTRACT.md`, ausgehende Ziele über `NETWORK-ALLOWLIST.md`.

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `docker-compose.yml`, `Dockerfile`,
`server/Dockerfile`, `deploy.sh`, an Reverse-Proxy-Konfiguration oder an Deploy-/Runbook-Dokumentation:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP28**)
4. **`building-docs/DEPLOYMENT-CONTRACT.md`** (dieses Dokument)
5. `building-docs/RUNTIME-CONTRACT.md`
6. `building-docs/LEAD-DATA-CONTRACT.md`
7. `building-docs/LEAD-DELIVERY-CONTRACT.md`
8. `building-docs/CRM-INTEGRATION.md`
9. `building-docs/NETWORK-ALLOWLIST.md` — wo Ingress oder CSP betroffen sind
10. `building-docs/state/AP-STATE.md`
11. die aktuellen Deployment-/Konfigurationsdateien aus §3
12. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Proof

| #         | Prüfung                | Erwartung                                                                                                    |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **D-T1**  | Image-Build            | reproduzierbar aus dem beabsichtigten SHA, gepinnte Toolchain                                                |
| **D-T2**  | Artefaktidentität      | laufender Dienst entspricht dem erwarteten Image/SHA                                                         |
| **D-T3**  | Health-Gate            | jeder Dienst nach §5.3 gesund — **nicht** „Container gestartet"                                              |
| **D-T4**  | Persistenzbereitschaft | dauerhafter Speicher erreichbar und **außerhalb** des App-Containers                                         |
| **D-T5**  | Backup                 | Sicherung erzeugbar, Zustand beobachtbar                                                                     |
| **D-T6**  | **Restore-Test**       | Wiederherstellung nachgewiesen, nicht nur beschrieben                                                        |
| **D-T7**  | Migration              | versioniert; Verträglichkeit vor dem Deploy bewertet                                                         |
| **D-T8**  | **Rollback**           | Vorgängerversion identifizierbar, startbar, danach Smoke grün                                                |
| **D-T9**  | Secrets                | keine im Image, keine im Repository; Injektion zur Laufzeit                                                  |
| **D-T10** | Image-/Dependency-Scan | ausgeführt, Befunde bewertet                                                                                 |
| **D-T11** | Preview-Isolation      | keine echten CRM-Schreibvorgänge, keine Kundenmails, keine Queue-Mutationen                                  |
| **D-T12** | Preview-Kennzeichnung  | erkennbar und nicht indexierbar                                                                              |
| **D-T13** | Betriebssignale        | Health, Fehlerraten, Queue-Tiefe, Dead-Letter, Backup-Fehlschläge sichtbar                                   |
| **D-T14** | Produktions-Smoke      | kritische Routen/Status, SEO-Artefakte, Consent-Verhalten, API-Bereitschaft **ohne** produktive Nebenwirkung |
| **D-T15** | Einzelner Zielpfad     | keine zwei widersprüchlichen produktiv-autoritativen Konfigurationen                                         |

_(Verankerung: `QUALITY-GATES.md` §9 und §12 Gate 12)_

### 9.1 Ergänzende Nachweise aus AP02 PT02.5

| #         | Prüfung                           | Erwartung                                                                                                     | Owner-AP    |
| --------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| **D-T16** | **Private Netzgrenze**            | Dienst-zu-Dienst läuft über das interne Netz; kein App-Container ist unbeabsichtigt öffentlich erreichbar     | AP28 · AP26 |
| **D-T17** | **Keine überflüssigen Ports**     | jeder veröffentlichte Host-Port ist begründet; nicht benötigte Veröffentlichungen existieren nicht            | AP28 PT28.2 |
| **D-T18** | **Proxy-Cache-Verträglichkeit**   | HTML bleibt hinter dem Proxy `no-store`; gehashte Assets bleiben langzeit-cachebar                            | AP28 · AP25 |
| **D-T19** | **Forwarded-Header**              | Host, Protokoll und Client-Adresse sind hinter dem Proxy korrekt rekonstruierbar (Canonical, Redirect, Limit) | AP28 · AP26 |
| **D-T20** | **Readiness ≠ Startreihenfolge**  | ein noch nicht bereiter Nachbardienst führt nicht zu einem als „gesund" geltenden Deployment                  | AP28 PT28.2 |
| **D-T21** | **Healthcheck ohne Nebenwirkung** | eine Gesundheitsprüfung erzeugt keinen Lead, keine Mail, keinen CRM-Datensatz und gibt keine Secrets aus      | AP28 · AP27 |
| **D-T22** | **Logdatensparsamkeit**           | Betriebsdiagnose ist ohne vollständige Lead-/Bestellnutzlast und ohne Secrets möglich                         | AP26 PT26.5 |
| **D-T23** | **Container-Erreichbarkeit**      | jeder Dienst ist aus seinem Netz heraus tatsächlich erreichbar — nicht nur gestartet. Der Bind-Host ist konfigurierbar und nicht auf Loopback festverdrahtet (`DD-18`)                     | **AP28 PT28.2** |
| **D-T24** | **Healthcheck prüft von außen**   | die Gesundheitsprüfung erreicht den Dienst auf demselben Weg wie der Reverse Proxy. Ein Container, der nur intern gegen `127.0.0.1` antwortet, gilt **nicht** als gesund (`DD-18`, DEP-08) | **AP28 PT28.2** |
| **D-T25** | **Umgebungsportfreiheit**         | keine zwei Umgebungen konkurrieren um denselben Host-Port; der veröffentlichte Port stammt aus der Umgebungskonfiguration, nicht aus einer festverdrahteten Compose-Zeile (`DD-19`)        | **AP28 PT28.4** |

### 9.2 Zuordnung der PT02.5-Betriebsanforderungen

Die Aufgabenstellung von PT02.5 nennt Betriebsinvarianten in einer eigenen `DEP-01`-bis-`DEP-30`-Zählung.
Dieser Vertrag führt bereits eine kanonische `DEP-`-Systematik mit **abweichender** Bedeutung; es wird
**keine zweite ID-Welt** eingeführt. Die Zuordnung der geforderten Semantik auf die hier gültigen IDs:

| Geforderte Semantik                                 | Hier gültig                                 |
| --------------------------------------------------- | ------------------------------------------- |
| Produktion über Docker/Compose                      | DEP-01, **DEP-55**, §5.1                    |
| Public Traffic über Reverse Proxy                   | DEP-32, **DEP-41**                          |
| Web/SSR als reproduzierbares Image                  | DEP-03–DEP-06, §5.1                         |
| Backend/API als reproduzierbares Image              | DEP-03–DEP-06, §5.1                         |
| Persistente Daten außerhalb flüchtiger Layer        | DEP-10, DEP-16                              |
| Secrets weder im Repo noch im Image                 | DEP-31, DEP-28                              |
| Preview/Production isolierbar                       | DEP-27–DEP-29                               |
| Healthcheck Web/SSR                                 | DEP-34, **DEP-46**                          |
| Healthcheck Backend/API                             | DEP-34, **DEP-46**                          |
| Restart Policies definiert                          | DEP-34                                      |
| Startreihenfolge ≠ Readiness                        | **DEP-49** · D-T20                          |
| Logs ohne Secrets/PII                               | **DEP-52** · D-T22                          |
| Betriebliche Korrelierbarkeit                       | **DEP-50**, **DEP-53**                      |
| Web-/API-Ausfälle monitorbar                        | DEP-35, §5.5, **§5.6**                      |
| Queue-/Retry-/DLQ-Zustände monitorbar               | DEP-35, §5.5                                |
| CRM-/Mail-Handoff-Fehler monitorbar                 | DEP-35, §5.5                                |
| Definierter Backup-Scope                            | DEP-17, DEP-18                              |
| Testbarer Restore-Pfad                              | DEP-17, DEP-21 · D-T9                       |
| Release ↔ Image-/Source-Version                     | DEP-04, DEP-05                              |
| Rollback auf immutable Version                      | DEP-22, DEP-26                              |
| Rollback unabhängig vom lokalen Arbeitsbaum         | DEP-26, DEP-03                              |
| Migrationen rollbackbewusst                         | DEP-11–DEP-14                               |
| Preview-Smokes ohne echte Leads                     | DEP-27, DEP-29 · **DEP-48**                 |
| Produktive Side Effects serverseitig verhinderbar   | DEP-29 · `LEAD-DELIVERY-CONTRACT.md` LDV-16 |
| Legacy-Vercel/SPA/Prerender ist keine Zielwahrheit  | DEP-02, **DEP-45**, **DEP-54**              |
| Genau ein kanonischer Deployment-Vertrag            | DEP-02, **DEP-54**                          |
| Produktionsdaten nicht in Git/Images                | DEP-16 · `LEAD-DATA-CONTRACT.md` LD-23      |
| App-Container nicht zwingend öffentlich             | **DEP-38**, **DEP-39** · D-T16              |
| Betriebs-Monitoring vom Marketing-Tracking trennbar | DEP-36 (`RUNTIME-CONTRACT.md` RT-37)        |
| Healthchecks ohne produktive Side Effects           | **DEP-48** · D-T21                          |

---

## 10. Forbidden Regressions

- ❌ **Quelle deployen, ohne dass ein reproduzierbares Build-Artefakt sie enthält**
- ❌ **Während des Cutover anderen Code neu bauen**
- ❌ **Ein unversioniertes Produktionsartefakt ausliefern**
- ❌ Ein Artefakt ohne Rückführbarkeit auf einen Git-SHA verwenden
- ❌ **Ein Deployment als erfolgreich werten, weil Container gestartet sind**
- ❌ **Persistente Lead-Daten in einem verwerfbaren Anwendungscontainer ablegen**
- ❌ Eine riskante Migration ohne vorherige Sicherung ausführen
- ❌ Ein Anwendungs-Rollback ausführen und Schemakompatibilität blind voraussetzen
- ❌ **Rollback durch Bearbeiten oder Auschecken von Quellcode auf dem Produktionshost**
- ❌ Anwendungs-Rollback mit Datenwiederherstellung gleichsetzen
- ❌ **Secrets in Image oder Repository backen**
- ❌ **Aus Preview/Staging produktive CRM- oder Mail-Wirkungen erzeugen**
- ❌ Einen Dienst ohne Healthcheck und Restart Policy betreiben
- ❌ `npm pkg delete scripts.prepare` aus einer Build-Stufe entfernen
- ❌ **Zwei widersprüchliche Konfigurationen gleichermaßen produktiv-autoritativ stehen lassen**
- ❌ **Marketing-Analytics als Quelle für Betriebsalarme verwenden**
- ❌ Einen neuen Infrastruktur-Anbieter außerhalb von `REST-01` wählen
- ❌ RPO/RTO-Zahlen ohne AP28-Beschluss festschreiben

**Aus AP02 PT02.5 zusätzlich:**

- ❌ **Eine statische SPA-Proxy-Konfiguration als produktiven Auslieferungsweg verwenden** (DEP-45)
- ❌ Eine Alt-Konfiguration allein wegen ihrer Existenz im Repository als produktiv autoritativ behandeln (DEP-54)
- ❌ Ein alternatives Produktionsmodell — Vercel, statische SPA, Host-Prozess, Quellbaum als Release — als gleichwertige Option führen (`REST-01`)
- ❌ Einen Host-Port veröffentlichen, der über das private Netz bereits erreichbar ist (DEP-39)
- ❌ Einen App-Container unbeabsichtigt öffentlich exponieren oder Debug-/Dev-Ports produktiv offenlassen (DEP-38, DEP-40)
- ❌ HTML hinter dem Proxy zwischenspeichern, solange der Runtime-Vertrag `no-store` verlangt (DEP-44)
- ❌ Forwarded-Header aus nicht vertrauenswürdiger Quelle übernehmen (DEP-43)
- ❌ **Startreihenfolge als Bereitschaftsnachweis behandeln** (DEP-49)
- ❌ Eine Gesundheitsprüfung bauen, die produktive Nebenwirkungen erzeugt oder Secrets offenlegt (DEP-48)
- ❌ Vollständige Lead-, Support- oder Bestellnutzlasten bzw. Secrets protokollieren (DEP-52)
- ❌ Eine Cluster-Plattform, Blue-Green- oder Multi-Region-Pflicht erfinden, die der Master-Scope nicht verlangt (DEP-55)
- ❌ Datenbank-, Queue-, Log-, Monitoring- oder Secret-Manager-Produkte ohne kanonische Grundlage festlegen (DEP-56)
- ❌ Produktiven Containern pauschal beliebige ausgehende Ziele erlauben (DEP-57)

---

## 11. AP Ownership / Lifecycle

| Phase                  | AP                     | Ergebnis                                                                                                                                                                                   |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Betriebszielbild       | **AP02 PT02.5**        | Docker/Compose, Proxy, Persistenz, Secrets, Health, Monitoring, Rollback, `DRY_RUN`                                                                                                        |
| Toolchain              | **AP01 PT01.5.3**      | gepinnte Versionen für Build und Container                                                                                                                                                 |
| **Umsetzung/Eigentum** | **AP28**               | Environment-Modell (PT28.1), Compose-Stack (PT28.2), Secrets (PT28.3), Deployment/Rollback (PT28.4), Persistenz/Backup/Recovery (PT28.5), Monitoring (PT28.6), **Legacy-Cleanup (PT28.7)** |
| Persistenz-Bedarf      | **AP22 PT22.4/PT22.8** | Worker, Queue, `DRY_RUN`-Ausweitung                                                                                                                                                        |
| Security               | **AP26 PT26.4/PT26.5** | Secrets, Image-Scan, Header                                                                                                                                                                |
| Gates                  | **AP27 PT27.6**        | Deploy-relevante Nachweise in CI                                                                                                                                                           |
| Migration              | **AP29**               | Redirect Map und Content-Freeze vor Go-live                                                                                                                                                |
| **Release Candidate**  | **AP30 PT30.5**        | SHA einfrieren, Artefakte erzeugen, Nachweislage                                                                                                                                           |
| **Go-live**            | **AP31**               | Runbook, Deploy des eingefrorenen Artefakts, Smoke, SEO-/Consent-Livecheck, Rollback (PT31.5)                                                                                              |
| Stabilisierung         | **AP32**               | Monitoring, Incidents, Priorisierung                                                                                                                                                       |
| Doku                   | **AP33 PT33.1.10**     | Deployment/Backup/Rollback im Runbook                                                                                                                                                      |

### 11.1 Owner-Grenzen des Produktionsbetriebs-Zielbilds (AP02 PT02.5)

PT02.5 legt **Architektur** fest und implementiert sie **nicht**:

| Owner-AP | Verantwortet                                                                                                                                                   | Bezug                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| **AP22** | persistente Lead-/Queue-/Worker-Komponenten, `DRY_RUN`-Ausweitung auf CRM und Queue                                                                            | DEP-10, DEP-29, §5.6          |
| **AP25** | Performance, Cache-Strategie der Assets                                                                                                                        | DEP-44                        |
| **AP26** | Security Hardening, HSTS/Header, Image- und Dependency-Scan, Netzexposition                                                                                    | DEP-32, DEP-33, DEP-38–DEP-40 |
| **AP27** | Quality Gates und Nachweise in CI, inklusive Image-/Deploy-Schritt                                                                                             | §9, §9.1, `DD-17`             |
| **AP28** | **Eigentümer der Umsetzung** — Compose-Zielstack, Persistenz, Backup/Restore, Secrets, Healthchecks, Monitoring, Release/Rollback, Legacy-Bereinigung (PT28.7) | DEP-01–DEP-57                 |
| **AP29** | Migration vor Go-live                                                                                                                                          | DEP-11–DEP-13                 |
| **AP30** | Release Candidate, eingefrorener SHA                                                                                                                           | DEP-07, §12.2                 |
| **AP31** | Go-live, Smoke, Rollback-Ausführung                                                                                                                            | DEP-22–DEP-26, §12.3/§12.4    |
| **AP32** | Monitoring, Alarme, Stabilisierung, Incident-Runbooks                                                                                                          | DEP-35, §5.5, §5.6            |
| **AP33** | Betriebsdokumentation und Übergabe                                                                                                                             | §12                           |

**Änderungen an diesem Vertrag** verantwortet AP28, bei Betriebszielbild-Fragen gemeinsam mit AP02.
Decision Locks werden hier nie geändert.

---

## 12. Release / Rollback Lifecycle

### 12.1 Harte Barrieren

```
AP27  vollständige Gates
        │   ← keine RC-Erzeugung, solange ein erforderliches Gate weder grün
        ▼      noch ausdrücklich manuell nachgewiesen ist (QUALITY-GATES.md QG-14)
AP30  Release Candidate — SHA eingefroren, Artefakt erzeugt, Nachweise vollständig
        │   ← Go-live deployt ausschließlich genau dieses Artefakt (DEP-03)
        ▼
AP31  Go-live — Deploy, Health-Gate, Smoke, SEO-/Consent-Livecheck
        │   ← Annahme oder Rollback nach vorab definierten Kriterien (DEP-23)
        ▼
AP32  Stabilisierung — Monitoring, Incidents, Folgearbeiten
```

### 12.2 AP30 — Release Candidate

| Pflicht        | Inhalt                                                                        |
| -------------- | ----------------------------------------------------------------------------- |
| SHA einfrieren | genau ein Commit, festgehalten (PT30.5.1)                                     |
| Artefakt       | aus diesem SHA gebaut, unveränderlich, identifizierbar (PT30.5.2)             |
| Nachweise      | Launch-Gates aus `QUALITY-GATES.md` §12 grün oder ausdrücklich manuell belegt |
| Restpunkte     | bekannte offene Punkte benannt, keine unbekannten P0/P1                       |
| Unterlagen     | Changelog und Go/No-Go-Grundlage (PT30.5.3–.5)                                |

### 12.3 AP31 — Go-live

| Schritt                      | Inhalt                                                                                                                                                      |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runbook                      | Verantwortliche, Zeitpunkt, Sicherung des aktuellen Stands, Schritte, Rollback-Trigger, Kommunikationsweg (PT31.1)                                          |
| Deploy                       | **genau das eingefrorene Artefakt**                                                                                                                         |
| Health-Gate                  | §5.3 vollständig                                                                                                                                            |
| Produktions-Smoke            | repräsentative Locales plus automatisierte 10-Sprachen-Route-Matrix, Kernseiten, Sitemap/robots, API-Formulartest **ohne** produktive Nebenwirkung (PT31.2) |
| SEO-Livecheck                | Canonical, hreflang, 301s, 404s, Sitemap/robots erreichbar, keine Preview-Canonicals (PT31.3)                                                               |
| Consent-/Analytics-Livecheck | Denied bleibt request-frei; nach Zustimmung Pageview/Event; keine PII (PT31.4)                                                                              |
| Entscheidung                 | annehmen **oder** zurückrollen                                                                                                                              |

### 12.4 Rollback

| Schritt      | Inhalt                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| Auslöser     | vorab definierte Kriterien (DEP-23)                                                       |
| Ziel         | identifizierbare Vorgängerversion, schnell startbar (DEP-22)                              |
| Datenlage    | Schema-/Datenverträglichkeit geprüft (DEP-12/-14)                                         |
| Nachweis     | Smoke nach dem Rollback (DEP-24)                                                          |
| Nacharbeit   | Vorfall dokumentiert (DEP-25)                                                             |
| **Verboten** | Rollback durch Quellcode-Bearbeitung oder `git checkout` auf dem Produktionshost (DEP-26) |
