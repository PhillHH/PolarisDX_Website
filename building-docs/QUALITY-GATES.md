# QUALITY-GATES

**Guard-Level: G3.** Wer eine der in §3 genannten Dateien ändert, folgt zwingend der Kontextpflicht
in §8. Blindes Editieren ist untersagt.

> ## ⚠ Gemessener Ist-Zustand (2026-08-21) — **das Repository ist NICHT vollständig grün**
>
> | Kommando               | Ergebnis                                              |
> | ---------------------- | ----------------------------------------------------- |
> | `npm run typecheck`    | **PASS** — 0 Fehler                                   |
> | `npm test`             | **PASS — 18/18 Tests, 7 Dateien**                     |
> | `npm run build`        | **PASS** — Client + SSR, 0 Warnungen                  |
> | `npm run check:colors` | **PASS** — 0 Verstöße                                 |
> | `npm run lint`         | **FAIL** — 129 Probleme (125 Fehler, 4 Warnungen)     |
> | `npm run format:check` | **FAIL** — 58 Dateien                                 |
> | `npm run test:e2e`     | **ENVIRONMENT-BLOCKED** — Portkonflikt, siehe §3.5/§6 |
>
> **Vitest funktioniert.** Der früher berichtete `ERR_LOAD_URL` entstand durch ein ungültiges
> Argument `--reporter=basic` (dieser Reporter existiert in Vitest 4 nicht) — **nicht** durch die
> Umgebung. Jede ältere Aussage, Vitest sei blockiert, ist überholt und darf nicht fortgeschrieben werden.
>
> **E2E ist nicht „kaputt", sondern war nicht ausführbar.** Die Ersatzmessungen per HTTP sind
> **Evidenz**, kein Ersatz für ein deterministisches E2E-Harness.

---

## 1. Purpose

Dieser Vertrag beantwortet eine Frage: **Was gilt als Beweis, dass eine Änderung, ein Arbeitspaket oder
ein Release sicher ist?**

Er definiert die Prüfkategorien, den Umgang mit vorhandener Altlast, die Testsemantik, die
CI-Abdeckung und die Zuordnung der zwölf Launch-Gates. Er ist **kein Audit** — Messungen stehen in
`QUALITY-BASELINE-LIVE.md`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.
**`QUALITY-BASELINE-LIVE.md` ist für gemessenes Qualitätsverhalten autoritativer als ältere Audits.**

**Zielautorität:** **AP27** (Eigentümer, PT27.1–PT27.6), Master-Scope **§2 Globale Definition of Done**,
**§8 die zwölf Launch-Gates**, **AP30** (Release Candidate), **AP31** (Go-live).

**Mitbetroffene APs:** AP01 PT01.5 (Toolchain), AP05 PT05.1.9/PT05.5 (Token-Guard, Visual Regression),
AP08 PT08.3.5 (i18n-Guard), AP09 PT09.1.8/PT09.2.8 (SEO), AP10 PT10.3/PT10.4 (Route/Status),
AP22 PT22.1.10 (E2E je Journey), AP23 PT23.1 (Consent), AP24 PT24.6 (a11y), AP25 PT25.5 (Budgets),
AP26 PT26.5 (Security-QA), AP28 PT28.2/PT28.4 (Health/Deploy), AP29 (Migration), AP32, AP33 PT33.1.9.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                                                                | Rolle                                                                                               | Guard  |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| `.github/workflows/ci.yml`                                           | einziger Job `quality`; **Trigger nur auf `main`**; Node 22                                         | **G3** |
| `lefthook.yml`                                                       | pre-commit: prettier `--write` + eslint `--fix` auf staged files, `tsc -b --noEmit`, `check:colors` | **G3** |
| `vitest.config.ts`                                                   | jsdom, `include: src/**` + `server/**`                                                              | **G3** |
| `playwright.config.ts`                                               | `baseURL: localhost:3000`, `reuseExistingServer: !process.env.CI`                                   | **G3** |
| `eslint.config.js`                                                   | flat config, `globalIgnores(['dist'])`, TS-Resolver auf `tsconfig.app.json`                         | **G3** |
| `package.json`                                                       | Qualitäts-Scripts; **kein `engines`, kein `packageManager`**                                        | **G3** |
| `e2e/url-smoke.spec.ts`                                              | 4 Blöcke → 19 Prüfungen, 5 `expect()`                                                               | **G3** |
| `scripts/check-color-tokens.mjs`                                     | Farb-/Token-Guard — grün, **nur pre-commit**                                                        | G2     |
| `scripts/check-i18n-home.mjs`, `scripts/check-meta-descriptions.mjs` | vorhanden, **nirgends verdrahtet**                                                                  | G2     |

---

## 4. Target Invariants

### Beweiskraft

**QG-01 · Ein grünes Ergebnis gilt nur, wenn tatsächlich das beabsichtigte Repository bzw. die
beabsichtigte Anwendung unter der beabsichtigten Konfiguration geprüft wurde.**
**Ein falsches Grün ist ein Gate-Versagen** — schwerwiegender als ein Rot, weil es Vertrauen erzeugt,
das nicht gedeckt ist.

**QG-02 · Ein CI-Ergebnis gehört zu genau einem Git-SHA** und ist diesem zuzuordnen. Ein Ergebnis ohne
SHA-Bezug ist kein Beweis.

**QG-03 · Die Toolchain ist repository-gepinnt.** CI, lokale Ausführung und Container laufen auf der in
`RUNTIME-CONTRACT.md` RT-09 festgelegten Version. Drift ist nach AP01-Pinning ein Gate-Versagen.

**QG-04 · Jede Prüfung ist reproduzierbar und deterministisch.** Kein Gate hängt an einer
Zufallsressource, einem freien Port oder einem fremden Prozess.

### Semantik

**QG-05 · Zusicherungen sind exakt, nicht ungefähr.** Wo der Vertrag einen bestimmten Statuscode
verlangt, wird dieser geprüft — **niemals `status < 400`**. Details in §5.3.

**QG-06 · Eine Prüfung belegt das, was der Vertrag zusagt** — nicht ein Symptom davon. Sichtbarer
404-Text ist kein Beleg für HTTP 404; eine 200-Antwort ist kein Beleg für Lead-Persistenz.

### Umfang

**QG-07 · Qualitätswerkzeuge unterscheiden aktive Produkt-/Build-Quellen von archiviertem Material.**
Ausschlüsse sind **explizit und begründet**, nie pauschal.

**QG-08 · Lebender Quellcode wird nie durch breite Ignore-Muster grün gemacht.** Ein Ausschluss, der
aktive Anwendungsdateien mit erfasst, ist unzulässig.

**QG-09 · `building-docs/**` und operative Dokumentation sind keine Quellcode-Lint-Ziele.\*\* Welche
Dokumentationsqualitätspolitik gilt, entscheidet AP27 ausdrücklich — sie wird nicht stillschweigend aus
den Code-Gates abgeleitet.

### Abdeckung

**QG-10 · Die aktive Relaunch-Integrationslinie und jeder für sie bestimmte PR durchlaufen die
erforderlichen Gates vor dem Merge.** Der konkrete Branchname wird von der Implementierung entschieden,
nicht hier festgeschrieben.

**QG-11 · Erforderliche Checks sind als solche erzwungen** (Branch Protection oder gleichwertig), nicht
nur vorhanden.

**QG-12 · Lokale Hooks und CI dürfen einander nicht widersprechen.** Der heutige Zustand — lokal wird
repariert und nachgestaged, in CI wird nur geprüft — ist zulässig, aber die geprüfte Menge muss
deckungsgleich sein.

### E2E-Identität

**QG-13 · E2E prüft niemals stillschweigend einen beliebigen bereits laufenden HTTP-Server.**
Details in §5.2. **Ein fremder Server erzeugt einen harten Fehlschlag, niemals eine grüne Suite.**

### Release

**QG-14 · Vor dem Release Candidate (AP30) sind alle erforderlichen Launch-Gates grün** — oder es liegt
ein ausdrücklich im Master-Scope vorgesehener manueller Nachweis vor, wo Automatisierung nicht anwendbar
ist. **Es gibt keine undokumentierte „wir hatten schon immer Fehler"-Ausnahme.**

**QG-15 · Ein Gate ohne Nachweis gilt als nicht erfüllt.** Eine Behauptung im Ticket ist kein Nachweis.

---

## 5. Target Model

### 5.1 Prüfkategorien

| Kategorie                             | Zweck                                                                                                                         | Eigentümer-AP                          | Heute                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------- |
| **TypeScript**                        | Typkorrektheit                                                                                                                | AP27 PT27.6.7                          | ✅ PASS                     |
| **ESLint**                            | Codequalität, a11y-Statik, Hook-Regeln                                                                                        | AP27 PT27.6.7                          | ❌ FAIL (§6)                |
| **Prettier**                          | Formatkonsistenz                                                                                                              | AP27 PT27.6.7                          | ❌ FAIL (§6)                |
| **Unit-Tests**                        | Route-Registry, SEOHead, i18n-Helfer, Lead-/Consent-Domänenlogik, CRM-/Queue-Adapter mit Doubles, UI-Muster                   | AP27 PT27.1                            | ✅ 18/18, Umfang zu gering  |
| **Integrationstests**                 | SSR+Head, 200/301/404, Sitemap/hreflang, Formular→Persistenz→Queue→CRM-Testadapter, Retry/Dead-Letter, gated Asset, `DRY_RUN` | AP27 PT27.2                            | ❌ keine                    |
| **Build**                             | reproduzierbares Artefakt                                                                                                     | AP27 PT27.6.7                          | ✅ PASS                     |
| **Design-/Token-Guard**               | eine Navy, ein Teal, kein Raw-Hex                                                                                             | AP05 PT05.1.9 / AP27 PT27.6.4          | ✅ PASS, **nicht in CI**    |
| **i18n-Parität**                      | Namespace-Registrierung, Key-Parität × 10                                                                                     | AP08 PT08.3.5 / AP27 PT27.6.5          | ❌ nicht verdrahtet         |
| **SEO-/Meta-Guards**                  | Canonical, hreflang, Sitemap, `lastmod`, Meta-Descriptions                                                                    | AP09 PT09.1.8/PT09.2.8 / AP27 PT27.6.6 | ❌ keine                    |
| **Route-/Status-Tests**               | 200/301/404, ein Hop, 10 Sprachen                                                                                             | AP10 PT10.4 / AP27 PT27.5              | ❌ schwach (§6)             |
| **Consent-/Netz-Tests**               | keine Provider-Requests vor Consent                                                                                           | AP23 PT23.1 / AP27 PT27.4              | ❌ keine                    |
| **Accessibility**                     | axe/Playwright über Kernrouten + manuelle Checkliste                                                                          | AP24 PT24.6                            | ❌ nur Statik im roten Lint |
| **Visual Regression**                 | unbeabsichtigte visuelle Änderungen                                                                                           | AP05 PT05.5.4 / AP27 PT27.6.1          | ❌ keine                    |
| **Performance/Lighthouse**            | CWV-Budgets, Schwellenwerte                                                                                                   | AP25 PT25.5                            | ❌ keine                    |
| **Security-/Dependency-/Secret-Scan** | Advisories, Secrets, Image-Scan                                                                                               | AP26 PT26.5                            | ❌ keine                    |
| **Docker-/Health-Validierung**        | Image baut, Container wird healthy                                                                                            | AP28 PT28.2/PT28.4                     | ❌ keine                    |

### 5.2 E2E-Server-Identität — kritisch

Der heutige `reuseExistingServer: !process.env.CI` kann Playwright an einen **fremden** Prozess hängen,
der Port 3000 belegt. Gemessen: dort läuft ein unbeteiligtes Projekt, das auf `/` mit `200` antwortet —
Teile der Suite wären **fälschlich grün** geworden.

**Erforderliche Eigenschaften** (die konkrete Umsetzung entscheidet AP27 PT27.3/PT27.6):

| #   | Eigenschaft                                                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| E-1 | Die Suite verifiziert **vor** dem ersten Test, dass der erreichte Server **diese** Anwendung ist                                         |
| E-2 | Die Identitätsprüfung ist eindeutig — eine Health-/Identitätsmarke oder eine gleichwertig belastbare Signatur, nicht „antwortet mit 200" |
| E-3 | Schlägt die Identitätsprüfung fehl, **bricht der Lauf hart ab**; er wird niemals grün                                                    |
| E-4 | Der Testlauf besitzt seinen Server selbst **oder** läuft gegen eine deterministisch bereitgestellte Umgebung                             |
| E-5 | Die Portwahl kollidiert nicht unkontrolliert — fester bekannter freier Port, zugewiesener Port oder testeigener Prozess                  |
| E-6 | Das Verhalten ist lokal und in CI identisch; kein umgebungsabhängiger Zweig, der lokal etwas anderes tut                                 |

**Erlaubt** sind u. a. dedizierter/zugewiesener Port, testeigener Serverprozess, Health-/Identitätsmarke,
erwartete Anwendungssignatur, CI-eigene deterministische Umgebung — **einzeln oder kombiniert**.
Vorgeschrieben ist die **Eigenschaft**, nicht der Mechanismus.

### 5.3 Testsemantik

| Domäne         | Erforderliche Zusicherung                            | Unzulässig               |
| -------------- | ---------------------------------------------------- | ------------------------ |
| **Redirect**   | `301` **und** `Location`-Ziel **und** ein Hop        | „URL hat sich geändert"  |
| **404**        | `response.status() === 404`                          | sichtbarer NotFound-Text |
| **200**        | genau `200` **und** Anwendungsidentität              | `status < 400`           |
| **Consent**    | An-/Abwesenheit konkreter Netzanfragen               | „Banner sichtbar"        |
| **Lead**       | Datensatz existiert und trägt den erwarteten Zustand | HTTP-Erfolg              |
| **Zustellung** | Kanalstatus im Datensatz                             | „kein Fehler geworfen"   |
| **Deployment** | Health des exakten Image/SHA                         | „Container läuft"        |
| **i18n**       | Key-Mengen-Gleichheit gegen `de`                     | Stichprobe               |
| **SEO**        | Canonical/hreflang/Sitemap-Inhalt                    | Seite lädt               |

### 5.4 CI-Abdeckung

| Aspekt                   | Ziel                                                                                                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trigger                  | PR **und** Push auf die aktive Integrationslinie; Branchname von der Implementierung gewählt (QG-10)                                                    |
| Branch Protection        | erforderliche Checks erzwungen (QG-11)                                                                                                                  |
| Required Checks          | typecheck, lint, format, unit, integration, build, route/status, SEO, i18n, consent, a11y, visual, security — nach Reifegrad gestaffelt                 |
| Fail-Fast vs. unabhängig | schnelle Struktur-Gates zuerst; teure Gates (Playwright, Lighthouse, Image-Scan) unabhängig, damit ein Fehlschlag die übrigen Ergebnisse nicht verdeckt |
| Artefakte                | Playwright-Traces/Reports, Lighthouse-Berichte, Visual-Diffs, Build-Logs — Aufbewahrung nach AP27                                                       |
| Toolchain                | repository-gepinnt (QG-03)                                                                                                                              |
| SHA-Bezug                | jedes Ergebnis dem geprüften SHA zugeordnet (QG-02)                                                                                                     |

**AP27 PT27.6 besitzt die endgültige Gate-Integration.**

---

## 6. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**.

### 6.1 Altlast-Klassifikation

| Klasse                | Bedeutung                                              | Regel                                                      |
| --------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| **BASELINE_DEBT**     | bestand vor dem AP und liegt außerhalb seines Auftrags | darf **nicht wachsen**                                     |
| **NEW_REGRESSION**    | vom AP neu eingeführt                                  | **immer unzulässig**                                       |
| **TASK_TOUCHED_DEBT** | in einer Datei, die das AP anfasst                     | **nicht schlechter** hinterlassen als vorgefunden          |
| **LAUNCH_BLOCKER**    | Gate, das AP30 fordert                                 | vor dem RC **grün oder ausdrücklich manuell nachgewiesen** |

**Regeln:**

1. Ein AP erhöht die Fehlerzahl eines Gates nicht.
2. Dateien, die ein AP ändert, verlassen es mit gleich vielen oder weniger relevanten Befunden.
3. Ist ein AP ausdrücklich für eine Altlastkategorie zuständig, **reduziert oder schließt** es sie.
4. Vor AP30 sind alle erforderlichen Launch-Gates grün — oder es liegt der im Master-Scope vorgesehene
   manuelle Nachweis vor.
5. **Keine undokumentierte Bestandsausnahme beim Launch.**

Diese Klassifikation **ersetzt die globale DoD nicht**. Master-Scope §2 verlangt weiterhin _„Keine neuen
TypeScript-, ESLint- oder Prettier-Fehler"_ — die Klassifikation regelt ausschließlich den Umgang mit dem
**vorgefundenen** Bestand.

### 6.2 Gemessene Altlast

| ID        | Schuld                                                                                                                                                                                                                                                                                                             | Klasse                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| **QD-1**  | **ESLint rot: 129 Probleme.** **111 (86 %) in `_project-knowledge/`** — dem archivierten Snapshot, den `eslint.config.js` nicht ignoriert; `tsconfig.app.json` schließt nur `["src"]` ein, daher 92 × `import/no-unresolved`. **Im aktiven Code nur 18 Befunde** (17 `src/`, 1 `server.ts`), davon 3 a11y-relevant | BASELINE_DEBT; a11y-Anteil → AP24 |
| **QD-2**  | **Prettier rot: 58 Dateien.** 36 getrackt (20 `wireframes/`, 5 `docs/`, 3 `_project-knowledge/`, 2 `scripts/`, 2 `.archon/`, **4 echter Quellcode**), 22 untracked (Analysedokumente + `projektverzeichnis/`)                                                                                                      | BASELINE_DEBT                     |
| **QD-3**  | **CI triggert nur auf `main`**; `feat/home-leadmagnet` ist nicht auf `origin` und war **nie** automatisch gegatet                                                                                                                                                                                                  | LAUNCH_BLOCKER-Voraussetzung      |
| **QD-4**  | **E2E-Fremdserver-Risiko** — `reuseExistingServer` kann an ein fremdes Projekt binden                                                                                                                                                                                                                              | LAUNCH_BLOCKER                    |
| **QD-5**  | **E2E-Semantik zu schwach** — `toBeLessThan(400)`; 404 nur per Text; 15 von 38 Sitemap-Pfaden; ohne `/epigenetics`, Musterbefunde, `/consumer/*`                                                                                                                                                                   | LAUNCH_BLOCKER                    |
| **QD-6**  | **`check:colors` nicht in CI** — nur pre-commit, per `--no-verify` überspringbar                                                                                                                                                                                                                                   | BASELINE_DEBT                     |
| **QD-7**  | **Zwei fertige Guard-Skripte nicht verdrahtet** — `check-i18n-home.mjs`, `check-meta-descriptions.mjs`                                                                                                                                                                                                             | BASELINE_DEBT                     |
| **QD-8**  | **Kein Endpunkt-Test** — die gesamte Backend-Abdeckung sind 6 Fälle für `esc()`                                                                                                                                                                                                                                    | LAUNCH_BLOCKER (Gate 3)           |
| **QD-9**  | **Zehn Prüfkategorien vollständig ohne Automatisierung** (§5.1)                                                                                                                                                                                                                                                    | LAUNCH_BLOCKER je Gate            |
| **QD-10** | **Keine `engines`/`packageManager`-Pins**; lokal Node 20, CI 22, Frontend-Image 22, **Backend-Image 20**                                                                                                                                                                                                           | BASELINE_DEBT → AP01              |

### 6.3 Archiv-Politik

`_project-knowledge/**` ist laut `AGENT-CONTRACT.md` Regel 4 **archivierter Quellcode-Schnappschuss und
keine Live-Quelle**. Es **darf** deshalb aus den Anwendungs-Gates ausgeschlossen werden — **weil es formal
als Archiv/Nicht-Laufzeit klassifiziert ist**, nicht um eine Zahl zu senken. Der Ausschluss ist explizit
zu begründen und darf keine aktive Quelle mit erfassen (QG-07, QG-08). **Die Konfiguration wird hier
nicht geändert** — AP01 PT01.4.4 und AP27 PT27.6 setzen das um.

---

## 7. Modification Rules

**M-01 — Ein Gate wird nicht abgeschwächt, um grün zu werden.** Wer eine Zusicherung lockert, ändert den
Vertrag, nicht den Test.

**M-02 — Ausschlüsse sind explizit, begründet und minimal.** Kein Ignore-Muster ohne Kommentar, der die
Klassifikation nennt.

**M-03 — Neue Guards landen in CI, nicht nur im Hook.** Ein Guard, der nur lokal läuft, ist per
`--no-verify` überspringbar.

**M-04 — Ein neues Gate bringt seinen Nachweis mit.** Ein Gate ohne ausführbaren Nachweis erfüllt QG-15
nicht.

**M-05 — Guards, die den Zielzustand prüfen, werden bewusst rot eingeführt**, wo der Ist-Zustand ihn
verletzt (z. B. Chat-Guard, Pre-Consent-Guard), und mit der Umsetzung grün.

**M-06 — Toolchain-Änderungen laufen über AP01.** Nach dem Pinning ist Drift ein Gate-Versagen (QG-03).

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `.github/workflows/**`, `playwright.config.ts`,
`vitest.config.ts`, `eslint.config.js`, `lefthook.yml`, den Qualitäts-Scripts in `package.json`,
`e2e/**` oder einem Guard-Skript:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP27**)
4. **`building-docs/QUALITY-GATES.md`** (dieses Dokument)
5. der/die geprüfte(n) Produktvertrag/-verträge — Routing, SEO, I18N, Consent, Tracking, Network, Lead-Data, Backend-API, CRM, Lead-Delivery, Runtime, Deployment
6. `building-docs/state/AP-STATE.md`
7. die aktuelle Test-/CI-Konfiguration aus §3
8. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Proof

### 9.1 Beweismatrix

| Contract/Domäne   | Beweistyp                                                                                               | Eigentümer-AP                                      | CI/Manuell                               | Launch-blockierend? |
| ----------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------- | ------------------- |
| **Routing**       | Route-Registry-Parität; 200/301/404 exakt; ein Hop; 10 Sprachen                                         | AP10 PT10.3/PT10.4                                 | CI                                       | **ja** (Gate 4)     |
| **SEO**           | Canonical, hreflang + `x-default`, Sitemap-Abdeckung, ehrliches `lastmod`, Index-Konsistenz             | AP09 PT09.1.8/PT09.2.8                             | CI                                       | **ja** (Gate 4)     |
| **i18n**          | Namespace-Registrierung, Key-Parität × 10, Sprachrouting, `lang`-Attribut                               | AP08 PT08.3.5                                      | CI                                       | **ja** (Gate 1)     |
| **Consent**       | keine Provider-Requests vor Consent; Reject request-frei; Widerruf wirksam; kein Puffer                 | AP23 PT23.1 / AP27 PT27.4                          | CI                                       | **ja** (Gate 2)     |
| **Tracking**      | ein kanonischer Pfad; keine direkten `dataLayer`/`gtag`-Schreibzugriffe; keine Doppelzählung; keine PII | AP23 PT23.2/PT23.3                                 | CI                                       | **ja** (Gate 2)     |
| **Lead/API**      | Schema, Fehler-Envelope, Idempotenz, Rate Limit, Persistenz vor Zustellung                              | AP22 PT22.1/PT22.2                                 | CI                                       | **ja** (Gate 3)     |
| **CRM/Queue**     | Fake-Adapter, transient/permanent, Retry, Dead-Letter, Replay ohne Duplikat, `DRY_RUN`                  | AP22 PT22.3/PT22.4                                 | CI                                       | **ja** (Gate 3)     |
| **Accessibility** | axe über Kernrouten, Tastatur, Fokus, Skip-Link, `<main>`, Chart-Textalternative                        | AP24 PT24.6                                        | CI + manuelle Screenreader-Checkliste    | **ja** (Gate 11)    |
| **Performance**   | CWV-Budgets, Lighthouse-Schwellen                                                                       | AP25 PT25.5                                        | CI                                       | **ja**              |
| **Security**      | Header/CSP, Rate-Limit/Abuse, Dependency-Audit, Secret-Scan, Image-Scan                                 | AP26 PT26.5                                        | CI                                       | **ja** (Gate 12)    |
| **Runtime**       | SSR-Verhalten, Statussemantik, Artefaktherkunft, Health                                                 | AP28 / `RUNTIME-CONTRACT.md`                       | CI + Deploy-Gate                         | **ja** (Gate 12)    |
| **Deployment**    | Image-Build, Healthcheck, Backup/Restore, Rollback                                                      | AP28 PT28.4/PT28.5                                 | Deploy-Gate + manueller Restore-Test     | **ja** (Gate 12)    |
| **Content-Claim** | `CV < 2 %` über Code, 10 Locales, Schema, PDF                                                           | AP14 PT14.4                                        | CI (Code/Locales/Schema) + manuell (PDF) | **ja** (Gate 7)     |
| **CTA/Chat**      | kein Garantie-Band, kein ChatWidget, `/api/chat` entfernt, CSP ohne Chat-Domains                        | AP06 PT06.3.8/PT06.4.6, AP22 PT22.7, AP26 PT26.2.1 | CI                                       | **ja** (Gates 5, 8) |

### 9.2 Mindest-Reihenfolge der Einführung

**Ohne CI auf der Integrationslinie wirkt kein Guard.** Deshalb zuerst:
**(1)** CI auf die aktive Linie ausdehnen → **(2)** E2E-Server-Identität herstellen (§5.2) →
**(3)** E2E-Abdeckung auf alle Routen erweitern → **(4)** exakte Statussemantik (§5.3) →
**(5)** die übrigen Guards nach Gate-Priorität. _(AP27 PT27.6, in Welle 1 vorgezogen)_

---

## 10. Forbidden Regressions

- ❌ **Eine E2E-Suite gegen einen fremden Prozess laufen lassen und das Ergebnis als grün werten**
- ❌ Exakte HTTP-Statuszusicherungen zu `status < 400` o. ä. abschwächen
- ❌ Ein 404 über sichtbaren Text statt über den Statuscode prüfen
- ❌ **CI so belassen, dass sie nur einen unbeteiligten Branch schützt**
- ❌ **Lebenden Quellcode ignorieren, um Lint grün zu machen**
- ❌ Ein Ignore-Muster ohne explizite Begründung setzen
- ❌ `building-docs/**` stillschweigend zu einem Quellcode-Lint-Ziel machen
- ❌ Ein Gate nur im pre-commit-Hook verankern
- ❌ Ein erforderliches Gate vor AP30 ohne dokumentierten manuellen Nachweis offenlassen
- ❌ Eine „wir hatten schon immer Fehler"-Ausnahme beim Launch geltend machen
- ❌ Die Fehlerzahl eines Gates durch ein AP erhöhen
- ❌ **Behaupten, Vitest sei umgebungsblockiert** — es funktioniert (18/18)
- ❌ Ersatz-HTTP-Messungen als Ersatz für ein deterministisches E2E-Harness ausgeben
- ❌ Nach AP01-Pinning Toolchain-Drift wieder einführen
- ❌ Ein CI-Ergebnis ohne SHA-Bezug als Nachweis werten

---

## 11. AP Ownership / Lifecycle

| Phase                         | AP                                | Ergebnis                                                                                |
| ----------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| Toolchain                     | **AP01 PT01.5**                   | Node-/Paketmanager-Pinning, Lockfile-Konsistenz, Clean-Build-Baseline                   |
| Archiv-Klassifikation         | **AP01 PT01.4.4**                 | `_project-knowledge/` und stale Doku formal markiert                                    |
| Token-Guard                   | **AP05 PT05.1.9**                 | `check:colors` in CI                                                                    |
| Visual Regression             | **AP05 PT05.5.4**                 | Baseline-Snapshots                                                                      |
| i18n-Guard                    | **AP08 PT08.3.5**                 | Parität in CI — Gate 1                                                                  |
| SEO-Guards                    | **AP09 PT09.1.8/PT09.2.8**        | SEOHead-, Sitemap-Tests — Gate 4                                                        |
| Route/Status                  | **AP10 PT10.3/PT10.4**            | Registry-Parität, Statusmatrix                                                          |
| Lead/CRM                      | **AP22 PT22.1.10**                | E2E je Journey — Gate 3                                                                 |
| Consent                       | **AP23 PT23.1** / **AP27 PT27.4** | Pre-Consent-Nachweis — Gate 2                                                           |
| a11y                          | **AP24 PT24.6**                   | axe + manuelle Checkliste — Gate 11                                                     |
| Performance                   | **AP25 PT25.5**                   | Budgets/Schwellen                                                                       |
| Security                      | **AP26 PT26.5**                   | Audit, Secret-Scan, Header-/CSP-Tests, Image-Scan — Gate 12                             |
| **Gate-Integration/Eigentum** | **AP27 PT27.6**                   | alle Gates in CI verankert                                                              |
| Deployment-Health             | **AP28 PT28.2/PT28.4**            | Healthchecks, Health-Gate nach Deploy                                                   |
| Migration                     | **AP29 PT29.1**                   | Crawl-Vergleich vor Go-live                                                             |
| **Release Candidate**         | **AP30 PT30.5**                   | SHA einfrieren, Artefakte, Nachweislage — **kein RC ohne die erforderlichen Nachweise** |
| Go-live                       | **AP31**                          | genau das eingefrorene RC-Artefakt deployen                                             |
| Betrieb                       | **AP32**                          | Nachlauf-Monitoring                                                                     |
| Doku                          | **AP33 PT33.1.9**                 | Tests/Launch-Gates dokumentiert                                                         |

**Änderungen an diesem Vertrag** verantwortet AP27. Decision Locks werden hier nie geändert.

---

## 12. Launch Gate Matrix

Die zwölf Launch-Gates aus Master-Scope §8, kanonisch verdichtet.

| #      | Gate                    | Beweisdomäne                                                                                                                                                                                  | Eigentümer     | Heute                |
| ------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------- |
| **1**  | **Language**            | alle relevanten Seiten × 10; Consumer × 10; Epigenetik × 10; Musterbefunde × 10; keine produktive Dauer-FallbackNotice; Key-/Namespace-Guard grün; sprachabhängige Mails/Assets               | AP08           | ❌                   |
| **2**  | **Consent**             | GTM/GA4 und nicht notwendige Tags laden **erst nach Consent**; Reject request-frei; kein Pre-Consent-Puffer; Widerruf funktioniert; Doku konsistent                                           | AP23           | ❌ **NON_COMPLIANT** |
| **3**  | **CRM**                 | Lead vor/innerhalb des Handoffs persistent; Retry/Dead-Letter/Recovery getestet; Idempotenz und Dedup getestet; `DRY_RUN` wirksam; Monitoring aktiv; Backup/Recovery definiert                | AP22           | ❌ Greenfield        |
| **4**  | **SEO**                 | Consumer × 10 indexierbar; Canonical/hreflang/Sitemap korrekt; `/services*` echte 301; echte 404 ohne falschen Canonical; Legal-Widerspruch gelöst; ehrliches `lastmod`; keine Preview-Domain | AP09/AP10      | ❌ teilweise         |
| **5**  | **Chat**                | kein ChatWidget/HiHuman lädt; `/api/chat` entfernt; CSP ohne Chat-Domains; keine produktive Chat-Abhängigkeit                                                                                 | AP06/AP22/AP26 | ❌                   |
| **6**  | **Epigenetics**         | eigenständige Hauptnavigation/Homepage-Rolle; Hub + 3 + 6 × 10; eigene Inquiry Journey; CRM-/Source-/Panel-Kontext; E2E Golden Path                                                           | AP15/AP16      | ❌                   |
| **7**  | **Content Claim**       | `CV < 2 %` über Code, 10 Locales, Structured Data und relevante PDFs; Risk-Register-Vermerk; kein `<5 %`-Rollback                                                                             | AP14           | ⚠ ungeprüft          |
| **8**  | **CTA**                 | kein „garantierte Performance"-Band; `main`-Import bringt es nicht zurück; kein Ersatzband zur Layout-Erhaltung                                                                               | AP06           | ⚠ ungeprüft          |
| **9**  | **Naming**              | allgemeiner Anfrage-CTA „Angebot anfragen"; lokalisiert × 10; fachliche Ausnahmen bewusst                                                                                                     | AP04/AP08      | ⚠ ungeprüft          |
| **10** | **Lead-Magnet**         | mindestens ein gated Pfad vollständig; Gate, Consent, Persistenz, CRM, Zustellung, Abuse, Tracking, i18n, a11y getestet; Asset nicht trivial am Gate vorbei                                   | AP19           | ❌ Greenfield        |
| **11** | **Accessibility**       | WCAG 2.2 AA für Kernpfade; Skip-Link und `<main>`; Dialog/Fokus/Tastatur; Charts mit Textalternative; automatisierte a11y-Prüfung grün                                                        | AP24           | ❌                   |
| **12** | **Operations/Security** | Docker/Compose health-geprüft; Secrets außerhalb Images/Repo; HSTS/Header/CSP produktionsreif; Backup-Restore nachgewiesen; image-basiertes Rollback getestet; CRM/Queue/Mail-Fehler sichtbar | AP26/AP28      | ❌                   |

**AP30 erzeugt keinen Release Candidate, solange ein erforderliches Gate weder grün noch ausdrücklich
manuell nachgewiesen ist. AP31 deployt ausschließlich das eingefrorene RC-Artefakt.**
