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

**Änderungen an diesem Vertrag** verantwortet AP28. Decision Locks werden hier nie geändert.

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
