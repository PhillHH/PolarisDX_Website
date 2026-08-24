# RUNTIME-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Dateien ändert, folgt zwingend der Kontextpflicht
in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> Der heutige Betrieb weicht in mehreren Punkten vom Zielbild ab (§6). **Dieser Vertrag beschreibt das
> SOLL** und ist kein Beleg dafür, dass es hergestellt ist.

---

## 1. Purpose

Dieser Vertrag beantwortet: **Welche Laufzeit-Topologie und welche Prozess-Invarianten müssen gelten?**

Er definiert die logische Dienstestruktur, die Trennung zwischen Quelle und Build-Artefakt, die
Toolchain-Zusage, die SSR-Invarianten, Netzexposition, Umgebungsmodell, Gesundheitsbegriff und
Beobachtbarkeit.

Wie diese Laufzeit gebaut, befördert, ausgerollt und zurückgerollt wird, regelt
`DEPLOYMENT-CONTRACT.md`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`REST-01`** (Docker/Compose, Reverse Proxy davor, persistente Daten separat und
backupfähig, Secrets außerhalb Images, Healthchecks, Restart Policies, Monitoring, image-basiertes
Rollback), **AP02 PT02.1** (SSR-/Rendering-Zielbild), **AP02 PT02.5** (Produktionsbetriebs-Zielbild),
**AP28** (Umsetzung).

**Mitbetroffene APs:** AP01 PT01.5.3 (Node-/Paketmanager-Pinning), AP09/AP10 (SSR-abhängige Semantik),
AP22 (API-/Worker-Rolle), AP23 (Consent-Ladeverhalten), AP25 (TTFB, Hydration, Assets),
AP26 (Header, Exposition), AP27 (Nachweise), AP32 (Betriebsmetriken), AP33 PT33.1.1.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                                                                  | Rolle                                                                                                                                        | Guard  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `server.ts`                                                            | Web/SSR-Dienst: Locale-301s, Sitemap, `KNOWN_PATHS`/echte 404, Security-Header/CSP, `no-store`, `/api/*`-Proxy, SSR-Render aus `dist/server` | **G3** |
| `src/entry-server.tsx` / `src/entry-client.tsx`                        | SSR- und Hydrationseinstiege                                                                                                                 | **G3** |
| `server/server.js`                                                     | Backend/API-Dienst (eigenes npm-Paket, Express 4)                                                                                            | **G3** |
| `dist/client`, `dist/server`                                           | **Build-Artefakte** — Produktion serviert daraus, **nicht** aus `src`                                                                        | **G3** |
| `vite.config.ts`                                                       | Client-/SSR-Build, SSR-Externals, Dev-Proxy                                                                                                  | G2     |
| `docker-compose.yml`                                                   | zwei Services, Netz, Restart Policies; **kein Worker, kein `volumes:`**                                                                      | **G3** |
| `Dockerfile`                                                           | zweistufig, **Node 22-alpine**, `HEALTHCHECK`                                                                                                | **G3** |
| `server/Dockerfile`                                                    | **Node 20**, kein `HEALTHCHECK`                                                                                                              | **G3** |
| `docs/deploy-preview.md`                                               | Preview-Runbook (detachter Host-Prozess)                                                                                                     | G1     |
| `nginx.conf`, `vercel.json`, `Dockerfile.dev`, `scripts/prerender.mjs` | **Altlast**, wirken aktiv (§6)                                                                                                               | G1     |

---

## 4. Target Invariants

### Artefakt und Quelle

**RT-01 · Die Laufzeit entspricht der Architektur, die gebaut und geprüft wurde.** Produktion serviert
niemals einen veralteten oder unbeabsichtigten Quell- bzw. Build-Zustand.

**RT-02 · Eine Quelländerung ist erst ausgerollt, wenn ein reproduzierbares Build-Artefakt sie enthält.**
Der Arbeitsbaum sagt nichts über den Live-Zustand aus.

**RT-03 · Build-Output ist abgeleitet, nicht Quelle der Wahrheit.** `dist/**` wird erzeugt, nie
gepflegt, nie von Hand korrigiert.

**RT-04 · Jedes Artefakt ist identifizierbar** und auf einen Git-SHA zurückführbar
(`DEPLOYMENT-CONTRACT.md` DEP-04).

**RT-05 · Client- und SSR-Artefakt gehören zusammen.** Beide entstehen aus demselben Build; eine
Mischung verschiedener Stände ist unzulässig — sie erzeugt Hydration-Fehler und falsche Asset-Hashes.

**RT-06 · Schutz gegen veraltetes `dist`.** Der Betrieb macht erkennbar, welcher Stand ausgeliefert wird;
ein Deploy ersetzt das Artefakt vollständig statt es zu überschreiben.
_(vgl. `DEPLOYMENT-CONTRACT.md` DEP-03)_

### Topologie

**RT-07 · Die logische Kette ist:**
`Browser → externer Reverse Proxy/nginx → Web/SSR-Dienst → API-Dienst → Persistenz/Worker/Integrationen (soweit erforderlich)`.
Das ist die **logische** Struktur; konkrete Netzadressen und Container-DNS-Namen entscheidet AP28.

**RT-08 · Die Dienstgrenzen sind eindeutig:**

| Dienst          | Zuständig für                                                                                                                                        | Nicht zuständig für                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Web/SSR**     | React/Express-SSR, Ausliefern der gebauten Client-Assets, Routing-/Status-/SEO-Antwortverhalten, Weiterleiten von API-Anfragen gemäß Zielarchitektur | Geschäftsverarbeitung, Persistenz               |
| **Backend/API** | Validierung und Persistenz von Lead-/Geschäftsanfragen, Backend-Geschäftslogik                                                                       | Rendering, SEO-Kopf, Browser-seitige Persistenz |
| **Worker**      | asynchrone Zustell-/Retry-Jobs, wo die Zielarchitektur sie verlangt                                                                                  | Beantwortung von HTTP-Anfragen                  |
| **Persistenz**  | dauerhafte Daten                                                                                                                                     | —                                               |

**RT-09 · Persistente Daten liegen außerhalb des verwerfbaren Anwendungscontainer-Dateisystems.**
_(`REST-01`, AP28 PT28.5.5)_

### Toolchain

**RT-10 · Es gilt genau eine unterstützte Node-Major-/Laufzeitzusage** für lokale Ausführung, CI, Build
und Container. **AP01 PT01.5.3 besitzt die endgültige Festlegung.**

**RT-11 · Der Paketmanager ist ausdrücklich gepinnt.** _(AP01 PT01.5.3)_

**RT-12 · Toolchain-Drift ist nach dem Pinning ein Gate-Versagen.** _(`QUALITY-GATES.md` QG-03)_

> **Evidenz, keine neue Entscheidung:** Gemessen laufen CI (`ci.yml`) und der Frontend-`Dockerfile` auf
> **Node 22**, der Backend-`server/Dockerfile` auf **Node 20**, die lokale Ausführung auf **20.19.6**;
> `package.json` deklariert weder `engines` noch `packageManager`. Das ist der **Ist-Zustand**, den AP01
> zu vereinheitlichen hat — dieser Vertrag wählt keine Version.

### SSR

**RT-13 · SSR bleibt der SEO-kritische Standard.** Consumer und Epigenetik eingeschlossen.
_(AP02 PT02.1.1/.5)_

**RT-14 · Die Hydrierung entspricht der SSR-Ausgabe.** Kein zustandsabhängiges Markup im
Server-Output, das der Client anders rendert — insbesondere nichts Consent- oder
`localStorage`-Abhängiges. _(`CONSENT-CONTRACT.md` C-22)_

**RT-15 · Der SEO-Kopf wird serverseitig gerendert.** _(AP02 PT02.1.4, `SEO-CONTRACT.md`)_

**RT-16 · Echte 404-Semantik bleibt erhalten**, einschließlich des Handshakes zwischen `SEOHead notFound`
und dem Server-Marker. _(`ROUTING-CONTRACT.md` R-05/R-06, `SEO-CONTRACT.md` S-04/S-05)_

**RT-17 · Redirect-Semantik bleibt erhalten** — echte 301, ein Hop. _(`ROUTING-CONTRACT.md` R-03/R-04)_

**RT-18 · HTML wird nicht gecacht** (`no-store`), solange dieser Vertrag nichts anderes festlegt; die
Begründung ist die Kopplung an gehashte Assets. **Gehashte Assets dürfen langzeit-cachebar bleiben.**

**RT-19 · Die Sitemap-Auslieferung folgt dem SEO-Vertrag** und wird nicht durch eine statische Datei
beschattet. _(`SEO-CONTRACT.md` S-06)_

**RT-20 · API-Pfade fallen nicht in den SSR-Catch-all.** Der Proxy/die Weiterleitung greift vorher.

**RT-21 · Statische Assets werden nicht sprachumgeleitet.** Die Locale-Weiche gilt für Dokumente, nicht
für Assets, Locales-Dateien oder `/api/*`.

### Netz und Exposition

**RT-22 · Web- und API-Dienste sind nicht unbeabsichtigt direkt öffentlich erreichbar.**

**RT-23 · Bindung und Adresse entsprechen der beabsichtigten Reverse-Proxy-/Container-Topologie** —
nicht einer aus einem anderen Betriebsmodell übernommenen Annahme.

> **Ausdrücklich:** Die heutige Host-Preview bindet auf `127.0.0.1` hinter einem Host-nginx. Das ist für
> **dieses** Modell richtig und wird **nicht** als universelle Zielvorgabe fortgeschrieben — in einem
> Container-Netz kann eine andere Bindung nötig sein, damit der Dienst intern erreichbar ist.
> **AP28 entscheidet und verifiziert die konkreten Bind-Adressen gegen die tatsächliche
> Compose-Topologie.**

**RT-24 · Der Reverse Proxy ist die öffentliche Eingangsgrenze.** TLS, HSTS und öffentliche Ingress-Regeln
gehören dorthin. _(`REST-01`, AP26 PT26.1.2)_

**RT-25 · Interne Exposition folgt Least Privilege.** Ein Dienst ist nur für die erreichbar, die ihn
brauchen.

**RT-26 · Ausgehende Verbindungen folgen `NETWORK-ALLOWLIST.md`.**

### Umgebungen

**RT-27 · Drei Umgebungen mit eigener Identität:** `local/dev`, `preview/staging`, `production`.
Die Umgebung ist zur Laufzeit erkennbar. _(AP28 PT28.1)_

**RT-28 · Endpunkte und Secrets sind umgebungsspezifisch.** Keine Secret-Werte in Repository oder Image.
_(`REST-01`, AP28 PT28.3)_

**RT-29 · Preview/Staging erzeugen keine produktiven Nebenwirkungen** — nicht bei CRM, Mail oder Queue.
Der Isolationsvertrag aus `LEAD-DELIVERY-CONTRACT.md` LDV-16 und `CRM-INTEGRATION.md` CRM-18 gilt.

**RT-30 · Keine produktiven Kundendaten in Test- oder Entwicklungsumgebungen.**
_(`LEAD-DATA-CONTRACT.md` LD-23/LD-24)_

### Gesundheit

**RT-31 · „Der Prozess läuft" ist keine Gesundheit.** Ein Gesundheitsnachweis ist anwendungsnah:

| Dienst         | Gesund heißt                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Web/SSR**    | Prozess lebt · SSR antwortet auf eine repräsentative Route · gebaute Assets erreichbar · Health-Route/-Prüfung positiv |
| **API**        | Prozess lebt · Anfrageverarbeitung verfügbar · kritische Abhängigkeiten angemessen abgebildet                          |
| **Worker**     | Prozess lebt · Queue-Verbindung/Bereitschaft gegeben                                                                   |
| **Persistenz** | dauerhafter Speicher verfügbar, wo erforderlich                                                                        |

**RT-32 · Bereitschaft und Lebendigkeit werden unterschieden**, wo es das Deployment braucht: „läuft"
ist nicht „kann Verkehr annehmen".

### Beobachtbarkeit

**RT-33 · Korrelationskennungen sind durchgängig**, wo anwendbar — `request_id` und `lead_id` verbinden
HTTP, Job, Zustellung und Log. _(`BACKEND-API-CONTRACT.md` API-12)_

**RT-34 · Logs sind ausreichend strukturiert**, um Fehler, Latenz und Verlauf auswertbar zu machen.

**RT-35 · PII wird in Logs redigiert.** Keine rohen Nutzlasten, keine Provider-Antwortkörper, keine
Secrets. _(`LEAD-DELIVERY-CONTRACT.md` LDV-21/LDV-22)_

**RT-36 · Betriebssignale sind vorhanden:** 5xx-/Fehlerraten, Latenz/TTFB, Container-/Prozess-Neustarts;
Queue-, CRM- und Mail-Signale über die jeweiligen Verträge.

**RT-37 · Marketing-Analytics ist keine Laufzeit-Observability** und niemals die alleinige Quelle für
Betriebsalarme. _(`TRACKING-CONTRACT.md` T-18, `CONSENT-CONTRACT.md` C-23)_

---

## 5. Target Model

### 5.1 Logische Topologie

```
                     ┌───────────────────────────┐
   Browser ────────► │ Reverse Proxy / nginx     │  ← öffentliche Eingangsgrenze (RT-24)
                     │ TLS · HSTS · Ingress      │
                     └────────────┬──────────────┘
                                  ▼
                     ┌───────────────────────────┐
                     │ Web / SSR                 │  server.ts
                     │ · SSR aus dist/server     │  Routing · Status · SEO-Kopf
                     │ · Assets aus dist/client  │  no-store HTML · gehashte Assets cachebar
                     └────────────┬──────────────┘
                                  │ /api/*  (RT-20)
                                  ▼
                     ┌───────────────────────────┐
                     │ Backend / API             │  Validierung · Persistenz
                     └───────┬─────────┬─────────┘
                             ▼         ▼
                  ┌────────────┐  ┌──────────────────┐
                  │ Persistenz │  │ Worker           │  asynchrone Zustellung/Retry
                  │ (separat)  │  │ (wo erforderlich)│
                  └────────────┘  └────────┬─────────┘
                                           ▼
                                  CRM · Mail (Adapter)
```

Adressen, Container-Namen und Bindungen: **AP28** (RT-23).

### 5.2 Quelle → Artefakt → Laufzeit

```
Git-SHA
  └─► reproduzierbarer Build ──► dist/client + dist/server (RT-05)
                                     └─► Image/Artefakt, SHA-rückführbar (RT-04)
                                            └─► Laufzeit serviert ausschließlich daraus (RT-02)
```

**Folgerung für Verifikation:** Ein Blick in `src` beweist nichts über den Live-Zustand. Wer prüfen will,
was ausgeliefert wird, prüft das Artefakt bzw. den laufenden Dienst.

### 5.3 Umgebungsmatrix

| Aspekt                     | local/dev                   | preview/staging                           | production   |
| -------------------------- | --------------------------- | ----------------------------------------- | ------------ |
| Identität                  | erkennbar                   | erkennbar                                 | erkennbar    |
| Quelle                     | Quelle/Dev-Server möglich   | **Artefakt**                              | **Artefakt** |
| Secrets                    | lokal, getrennt             | eigene                                    | eigene       |
| CRM/Mail/Queue             | Test-Adapter / abgeschaltet | **isoliert, keine produktiven Wirkungen** | produktiv    |
| Kundendaten                | keine                       | keine                                     | produktiv    |
| Öffentliche Erreichbarkeit | keine                       | begrenzt, nicht indexierbar               | öffentlich   |

---

## 6. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**.

| ID        | Schuld                                                                                                                                                                                                               | Verletzt                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **RD-1**  | **Preview weicht vom Zielmodell ab** — laut Runbook ein detachter Host-Prozess (`npx tsx server.ts`) hinter Host-nginx, kein Container                                                                               | RT-07, RT-27                |
| **RD-2**  | **Aktiv wirkende Alt-Konfiguration** — `nginx.conf` (statisches SPA-Setup mit `try_files`), `vercel.json` (SPA-Rewrite), `Dockerfile.dev`, `scripts/prerender.mjs`; keine davon beschreibt den tatsächlichen Betrieb | RT-01; Cleanup: AP28 PT28.7 |
| **RD-3**  | **Produktion serviert `dist`, nicht `src`** — richtig, aber unzureichend abgesichert: eine Quelländerung ist bis zum Build unsichtbar, und der Host-`dist` kann vom HEAD-Stand abweichen                             | RT-02, RT-06                |
| **RD-4**  | **Toolchain-Drift, dreifach** — lokal Node **20.19.6**, CI **22**, Frontend-Image **22**, **Backend-Image `FROM node:20`**; kein `engines`, kein `packageManager`                                                    | RT-10, RT-11                |
| **RD-5**  | **Gesundheitsmodell unvollständig** — der Frontend-`Dockerfile` hat einen `HEALTHCHECK`, `server/Dockerfile` **keinen**; `docker-compose.yml` deklariert für keinen Service einen Healthcheck                        | RT-31, RT-32                |
| **RD-6**  | **Keine persistente Speicherung** — `docker-compose.yml` hat **keine `volumes:`-Sektion**; es gibt keinen Worker-Service                                                                                             | RT-08, RT-09                |
| **RD-7**  | **Monitoring fehlt** — keine Metriken, keine Alarme; Fehler existieren nur als stdout-Zeilen                                                                                                                         | RT-34, RT-36                |
| **RD-8**  | **PII in Logs** — E-Mail-Adressen im Klartext an zwei Stellen, rohe Provider-Antwortkörper an vier                                                                                                                   | RT-35                       |
| **RD-9**  | **Stale Laufzeitdokumentation** — `DOCS.md` beschreibt einen nginx-ausgelieferten SPA und ein nicht existierendes `backend/`-CMS                                                                                     | RT-01; AP01 PT01.4.4        |
| **RD-10** | **Kein `/api/monitoring/*`-Ziel** — der Import-Kandidat für Web-Vitals sendet an Endpunkte, die es nirgends gibt                                                                                                     | RT-36                       |

---

## 7. Modification Rules

**M-01 — Laufzeitverhalten wird am Artefakt geprüft, nicht an der Quelle.** Wer eine Änderung
verifiziert, baut und prüft — oder prüft den laufenden Dienst.

**M-02 — `server.ts` und `server/server.js` nie als Datei aus `main` übernehmen** (**N1** in
`BRANCH-RECONCILIATION-MAP.md`). Nur Hunks.

**M-03 — Bind-Adressen werden nie aus einem anderen Betriebsmodell übernommen.** Jede Änderung wird gegen
die tatsächliche Topologie verifiziert (RT-23, AP28).

**M-04 — SSR-Invarianten sind gemeinsam zu prüfen.** Wer Rendering, Status oder Header anfasst, prüft
`ROUTING-CONTRACT.md` und `SEO-CONTRACT.md` mit.

**M-05 — Ein neuer Dienst bringt Gesundheitsdefinition, Restart-Verhalten und Signale mit.** Ohne die
drei ist er nicht betriebsreif.

**M-06 — Umgebungsabhängiges Verhalten ist explizit deklariert**, nicht aus dem Vorhandensein einer
Variablen erraten. **Keine Flags erfinden** — Deklaration über AP22/AP28.

**M-07 — Alt-Konfiguration wird entfernt oder eindeutig als Archiv markiert**, sobald sie dem Zielbild
widerspricht (AP28 PT28.7).

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `server.ts`, `src/entry-{server,client}.tsx`,
`server/server.js`, `vite.config.ts`, den Dockerfiles oder `docker-compose.yml`:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP02**, bei Betrieb **AP28**)
4. **`building-docs/RUNTIME-CONTRACT.md`** (dieses Dokument)
5. `building-docs/ROUTING-CONTRACT.md`
6. `building-docs/SEO-CONTRACT.md` — wo SSR/Status betroffen sind
7. `building-docs/BACKEND-API-CONTRACT.md` — wo die API-Topologie betroffen ist
8. `building-docs/state/AP-STATE.md`
9. die aktuellen Laufzeitdateien aus §3
10. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Proof

| #          | Prüfung              | Erwartung                                                                             |
| ---------- | -------------------- | ------------------------------------------------------------------------------------- |
| **RT-T1**  | SSR-Antwort          | repräsentative Route liefert servergerendertes Markup und den SEO-Kopf                |
| **RT-T2**  | Statussemantik       | echte 200/301/404 gemäß `ROUTING-CONTRACT.md`; exakte Codes (`QUALITY-GATES.md` §5.3) |
| **RT-T3**  | Cache-Header         | HTML `no-store`; gehashte Assets langzeit-cachebar                                    |
| **RT-T4**  | API-Pfade            | `/api/*` fällt **nicht** in den SSR-Catch-all                                         |
| **RT-T5**  | Statische Assets     | keine Sprachumleitung für Assets, Locales, `/api/*`                                   |
| **RT-T6**  | Hydration            | keine Hydration-Warnung auf repräsentativen Routen                                    |
| **RT-T7**  | Artefaktherkunft     | ausgelieferter Stand ist einem SHA zuordenbar (`DEPLOYMENT-CONTRACT.md` DEP-04)       |
| **RT-T8**  | Client-/SSR-Kohärenz | beide Artefakte stammen aus demselben Build                                           |
| **RT-T9**  | Gesundheit je Dienst | anwendungsnaher Nachweis nach RT-31, nicht „Prozess existiert"                        |
| **RT-T10** | Exposition           | kein Dienst unbeabsichtigt öffentlich; Bindung passt zur Topologie                    |
| **RT-T11** | Umgebungsisolation   | Preview erzeugt keine produktiven CRM-/Mail-/Queue-Wirkungen                          |
| **RT-T12** | Logredaktion         | keine rohen Nutzlasten, keine Provider-Körper, keine Secrets                          |
| **RT-T13** | Toolchain            | Laufzeitversion entspricht der gepinnten Zusage (nach AP01)                           |

_(Ausführung und Verankerung: `QUALITY-GATES.md` §9)_

---

## 10. Forbidden Regressions

- ❌ **Aus dem Arbeitsbaum auf den Live-Zustand schließen**
- ❌ **Veraltetes `dist` unbemerkt ausliefern**
- ❌ Quelle deployen, ohne dass ein reproduzierbares Build-Artefakt sie enthält
- ❌ Client- und SSR-Artefakt aus verschiedenen Ständen mischen
- ❌ `dist/**` von Hand bearbeiten
- ❌ **Persistente Daten im verwerfbaren Anwendungscontainer ablegen**
- ❌ Echte 404-, 301- oder `no-store`-Semantik verlieren
- ❌ Consent- oder `localStorage`-abhängiges Markup im SSR-Output erzeugen
- ❌ `/api/*` in den SSR-Catch-all fallen lassen
- ❌ Assets oder Locales-Dateien sprachumleiten
- ❌ **Eine Bind-Adresse aus einem anderen Betriebsmodell als universell richtig übernehmen**
- ❌ Einen Dienst unbeabsichtigt öffentlich exponieren
- ❌ Secrets in Image oder Repository legen
- ❌ Aus Preview/Staging produktive Wirkungen erzeugen
- ❌ Rohe Nutzlasten, Provider-Körper oder Secrets protokollieren
- ❌ **Nach AP01-Pinning Toolchain-Drift wieder einführen**
- ❌ **Marketing-Analytics als Laufzeit-Observability verwenden**
- ❌ „Prozess läuft" als Gesundheitsnachweis akzeptieren
- ❌ `server.ts` oder `server/server.js` als Datei aus `main` übernehmen

---

## 11. AP Ownership / Lifecycle

| Phase                 | AP                 | Ergebnis                                                                                               |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| **Zielbild/Eigentum** | **AP02 PT02.1**    | SSR-/Rendering-Zielbild, 404-/Error-Verhalten, Head zentral                                            |
| Betriebszielbild      | **AP02 PT02.5**    | Docker/Compose, Reverse Proxy, Container, Persistenz, Secrets, Health, Monitoring, Rollback, `DRY_RUN` |
| Toolchain             | **AP01 PT01.5.3**  | **Node-/Paketmanager-Pinning**                                                                         |
| Semantik              | **AP09**, **AP10** | Status-, Redirect-, SEO-Verhalten, das die Laufzeit erhalten muss                                      |
| API/Worker            | **AP22**           | Backend-Rolle, Worker-Bedarf                                                                           |
| Performance           | **AP25 PT25.2**    | SSR-TTFB, Hydrationskosten, Chunk-Verhalten                                                            |
| Security              | **AP26 PT26.1**    | Header, HSTS am produktiven Origin, Exposition                                                         |
| **Umsetzung**         | **AP28**           | Environment-Modell, Compose-Stack, Healthchecks, Persistenz, Monitoring, Legacy-Cleanup (PT28.7)       |
| Nachweise             | **AP27**           | Laufzeitnachweise in CI/Deploy-Gate                                                                    |
| Betrieb               | **AP32 PT32.1**    | 5xx, TTFB, Container-Health, CSP-Reports                                                               |
| Doku                  | **AP33 PT33.1.1**  | Architektur/Runtime dokumentiert                                                                       |

**Änderungen an diesem Vertrag** verantwortet AP02 gemeinsam mit AP28. Decision Locks werden hier nie
geändert.
