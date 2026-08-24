# RELAUNCH-BACKLOG — Prioritäts- und Delivery-Index AP00–AP33

**Dokumenttyp:** Delivery-/Priorisierungsindex (kompakt, agentenlesbar)
**Erzeugt durch:** `PT00.2` (AP00 — Programmsteuerung, Scope Lock und Delivery Governance)
**Stand:** 2026-08-24
**Repository-Baseline:** `feat/home-leadmagnet@961f65d`
**Kanonischer Scope:** `building-docs/scope/MASTER-SCOPE.md`
**Kanonische Decisions:** `building-docs/DECISIONS.md` · `building-docs/PROJECT-CONSTRAINTS.md`

---

## 0. Was dieses Dokument ist — und was nicht

**Ist:** ein Index. Er sagt, **in welcher Reihenfolge und mit welchem Risiko** die 34 Arbeitspakete
angefasst werden und **was zwingend voreinander** liegt.

**Ist nicht:** eine zweite Anforderungsquelle. Requirements, Subtasks und Akzeptanzkriterien stehen
ausschließlich in `scope/MASTER-SCOPE.md` und im jeweiligen `work-packages/APxx.md`. Dieses Dokument
dupliziert sie nicht.

**Ist nicht:** eine Entscheidungsquelle. Es ändert keinen Decision Lock. Änderungen an Priorität,
Wellenzuordnung oder Backlog-Grenze, die einen Lock berühren, laufen über
`building-docs/SCOPE-CHANGELOG.md`.

> **Die AP-Nummer ist Scope-Struktur, keine Ausführungsreihenfolge.**
> Gearbeitet wird nach **Welle → Hard Barrier → Priorität**, nicht nach aufsteigender AP-Nummer.
> `AP28` (Betriebsbasis) liegt bewusst in Welle 2, `AP27` (Gates) startet bereits in Welle 1,
> `AP10` wird vor `AP07`/`AP08`/`AP09`-Expansion benötigt.

---

## 1. Prioritätsmodell

Genau vier Klassen. Keine weitere Klasse wird erfunden.

| Prio   | Bedeutung                 | Kriterium                                                                                                                                                                                                                                                                                                                                             |
| ------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0** | **Launch-Blocker**        | Mindestens eines trifft zu: ein bestätigter Decision Lock würde verletzt · ein Launch Gate kann kein `PASS` erreichen · normaler Lead-Verlust bleibt möglich · Consent-/Privacy-/Security-Grundvertrag bleibt verletzt · kritische HTTP-/Routing-/SEO-Semantik bleibt falsch · Produktion ist nicht sicher betreibbar, recoverbar oder rollbackfähig. |
| **P1** | **Launch-kritisch**       | Für einen vollständigen Relaunch vor Release notwendig, aber kein unmittelbarer Stop-the-line-Defekt.                                                                                                                                                                                                                                                 |
| **P2** | **Wichtig**               | Soll Bestandteil des Relaunchs sein; Verschiebung nur per **expliziter Release-Entscheidung** und nur, ohne einen bestätigten Decision Lock zu brechen.                                                                                                                                                                                               |
| **P3** | **Backlog / Optimierung** | Bewusst nachgelagert oder nicht launch-blockierend.                                                                                                                                                                                                                                                                                                   |

### 1.1 Lesehinweis zur P0-Dichte

23 von 34 Arbeitspaketen sind P0. Das ist **kein** Priorisierungsfehler, sondern eine direkte Folge der
12 verbindlichen Launch-Gates (Master-Scope §8): Jedes Gate hat ein besitzendes Arbeitspaket, und ohne
dessen Erledigung erreicht das Gate kein `PASS`.

P0 sagt daher **nicht** „zuerst machen", sondern **„vor Release nicht verhandelbar"**.
Die tatsächliche Reihenfolge liefern **Welle** (§2) und **Hard Barrier** (§4) — nicht die Priorität.

### 1.2 Gemischte Arbeitspakete

Einige APs sind nur teilweise P0. In diesen Fällen nennt die Spalte `P0-Treiber` den Anteil, der den
Launch blockiert; der Rest des AP ist P1. Ein gemischtes AP wird **nicht** insgesamt entschärft, nur
weil ein Teil davon P1 ist.

---

## 2. Delivery-Wellen (wortgetreu aus Master-Scope §6)

| Welle       | Bezeichnung                                 | Arbeitspakete                                                                                                                                           |
| ----------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Welle 0** | Decision Lock und Repo-Kontrolle            | AP00 · AP01 · AP02 · AP03 · AP04                                                                                                                        |
| **Welle 1** | Plattformfundament                          | AP05 · AP10 · AP08 · AP09 · AP27 (frühe CI-/Regression-Gates) · AP06 · AP07                                                                             |
| **Welle 2** | Betriebs- und Lead-Fundament                | AP28 (Environment-Basis früh) · AP22 (Datenmodell/Persistenz/CRM/Queue-Grundlage) · AP23 (Consent-Fundament) · AP26 (Secrets/API-/Integration-Security) |
| **Welle 3** | Kernseiten und Geschäftssäulen              | AP11 · AP12 · AP13 · AP14 · AP15 · AP16                                                                                                                 |
| **Welle 4** | Content-, Consumer- und Conversion-Strecken | AP17 · AP18 · AP19 · AP20 · AP21 · AP22 (Journey-Migration abschließen)                                                                                 |
| **Welle 5** | Nonfunctional Hardening                     | AP24 · AP25 · AP26 (abschließen) · AP27 (vollständige Gates/Visual Regression) · AP28 (Produktionsbetrieb finalisieren)                                 |
| **Welle 6** | Migration, RC und Launch                    | AP29 · AP30 · AP31 · AP32 · AP33                                                                                                                        |

**Mehrwellige Arbeitspakete:** `AP22` (W2 Fundament → W4 Migration), `AP26` (W2 Secrets → W5 Abschluss),
`AP27` (W1 frühe Gates → W5 vollständige Gates), `AP28` (W2 Environment-Basis → W5 Produktionsbetrieb).
Ihre Wellenaufteilung ist **verbindlich**: Der W2-Anteil darf nicht in W5 verschoben werden, weil
`HB-04`, `HB-05` und `HB-06` daran hängen.

---

## 3. Backlog-Index — AP-Abdeckung 34/34

**Legende Status:** `NOT_STARTED` · `IN_PROGRESS` · `BLOCKED` · `COMPLETE`
**PT-Referenz:** `PTxx.1–PTxx.n` verweist auf `scope/MASTER-SCOPE.md`, Abschnitt `# APxx`.
Die PTs werden hier **nicht dupliziert**; sie bleiben über AP-ID und PT-ID eindeutig erreichbar.
**Summe aller PT: 178.**

| AP       | Titel                                                            | PTs                   | Prio          | Welle                               | Hard Barriers                                                                             | Kritische Dependencies                                                 | Launch Gates                                                                     | Status        |
| -------- | ---------------------------------------------------------------- | --------------------- | ------------- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------- |
| **AP00** | Programmsteuerung, Scope Lock und Delivery Governance            | `PT00.1–PT00.4` (4)   | **P0**        | W0                                  | `HB-01` Producer                                                                          | —                                                                      | alle (definiert die Gate-Struktur)                                               | `IN_PROGRESS` |
| **AP01** | Repository-Baseline, Branch-Reconciliation und Import-Hygiene    | `PT01.1–PT01.5` (5)   | **P0**        | W0                                  | `HB-01` C · `HB-02` **Producer**                                                          | AP00                                                                   | Gate 8 · Gate 4 (404/Redirect/Cache-Härtung der Baseline)                        | `NOT_STARTED` |
| **AP02** | Zielarchitektur: SSR, Routing, Lead Platform und Betrieb         | `PT02.1–PT02.5` (5)   | **P0**        | W0                                  | `HB-01` C · `HB-03` **Producer**                                                          | AP00 · AP01                                                            | Gate 3 · Gate 4 · Gate 12 (Zielbild)                                             | `NOT_STARTED` |
| **AP03** | Informationsarchitektur und vollständiges Seiteninventar         | `PT03.1–PT03.4` (4)   | P1            | W0                                  | `HB-01` C · `HB-03` C                                                                     | AP02 (Route-Zielbild)                                                  | Gate 4 · Gate 6 (Inventar-Input)                                                 | `NOT_STARTED` |
| **AP04** | Content-Strategie, Content-Modell und Launch-Content-Readiness   | `PT04.1–PT04.4` (4)   | P1            | W0                                  | `HB-01` C · `HB-07` C                                                                     | AP03                                                                   | Gate 1 (Readiness-Input)                                                         | `NOT_STARTED` |
| **AP05** | Sales-Machine Design-System und Light-Theme-Grundlage            | `PT05.1–PT05.5` (5)   | P1            | W1                                  | `HB-01` C · `HB-02` C                                                                     | AP01 (neutrale QA-Patterns aus `redesign/preview`)                     | Gate 11 (Kontrast/Fokus-Basis)                                                   | `NOT_STARTED` |
| **AP06** | App Shell, Header, Footer und globale Navigation                 | `PT06.1–PT06.5` (5)   | **P0**        | W1                                  | `HB-01` C · `HB-02` C · `HB-03` C                                                         | AP05 · AP10 · AP08                                                     | Gate 6 (Epigenetik-Navigationsrolle) · Gate 8 (Band kehrt nicht zurück) · Gate 9 | `NOT_STARTED` |
| **AP07** | Suche und interne Findability                                    | `PT07.1–PT07.3` (3)   | P1            | W1                                  | `HB-03` **Consumer** · `HB-07` C                                                          | AP10 · AP08 · AP03                                                     | Gate 1 · Gate 4 (Index-Wahrheit)                                                 | `NOT_STARTED` |
| **AP08** | Internationalisierung und vollständige 10-Sprachen-Lokalisierung | `PT08.1–PT08.6` (6)   | **P0**        | W1                                  | `HB-03` C · `HB-07` **Producer** (`PT08.1`, `PT08.3`)                                     | AP10 (Sprachrouten) · AP02                                             | **Gate 1** · Gate 7 (Claim × 10) · Gate 9 (CTA × 10)                             | `NOT_STARTED` |
| **AP09** | SEO-Plattformgrundlagen                                          | `PT09.1–PT09.5` (5)   | **P0**        | W1                                  | `HB-03` **Consumer** · `HB-07` C                                                          | AP10 (Route Registry) · AP08 (hreflang)                                | **Gate 4**                                                                       | `NOT_STARTED` |
| **AP10** | Redirect-, URL- und HTTP-Semantik-System                         | `PT10.1–PT10.4` (4)   | **P0**        | W1                                  | `HB-03` **Producer** (`PT10.3`)                                                           | AP02 (`PT02.2` Route-Zielbild) · AP01                                  | **Gate 4**                                                                       | `NOT_STARTED` |
| **AP11** | Startseite                                                       | `PT11.1–PT11.6` (6)   | **P0**        | W3                                  | `HB-02` C · `HB-03` C · `HB-05` C                                                         | AP05 · AP06 · AP22 (Secondary Conversion)                              | Gate 6 (Homepage-Rolle) · **Gate 8** · **Gate 9** · Gate 10                      | `NOT_STARTED` |
| **AP12** | Diagnostik-Hub `/diagnostics`                                    | `PT12.1–PT12.5` (5)   | P1            | W3                                  | `HB-03` C · `HB-07` C                                                                     | AP03 · AP10 · AP08                                                     | Gate 4 (Hub-Canonicals)                                                          | `NOT_STARTED` |
| **AP13** | Service-Detailseiten (9 Stück)                                   | `PT13.1–PT13.10` (10) | P1            | W3                                  | `HB-03` C · `HB-05` C · `HB-07` C                                                         | AP12 · AP22 (Anfragepfad)                                              | Gate 9 (CTA über 9 Seiten × 10) · Gate 1                                         | `NOT_STARTED` |
| **AP14** | IglooPro Produktstrecke                                          | `PT14.1–PT14.6` (6)   | **P0**        | W3                                  | `HB-03` C · `HB-07` C                                                                     | AP08 (Locales) · AP09 (Product Structured Data)                        | **Gate 7** (`CV < 2 %` konsistent, kein `<5 %`-Rollback)                         | `NOT_STARTED` |
| **AP15** | Epigenetik als eigenständige Geschäftssäule                      | `PT15.1–PT15.7` (7)   | **P0**        | W3                                  | `HB-02` C (`PT15.2`) · `HB-05` C (`PT15.6`) · `HB-07` C · `HB-08` **Producer** (`PT15.1`) | AP01 · AP06 · AP22                                                     | **Gate 6** · Gate 1 · Gate 4                                                     | `NOT_STARTED` |
| **AP16** | Musterbefunde (6 × 10 Sprachen)                                  | `PT16.1–PT16.5` (5)   | **P0**        | W3                                  | `HB-03` C · `HB-07` **Consumer** · `HB-08` C                                              | AP15 (`PT15.1` IA) · AP08                                              | **Gate 6** · Gate 1 · Gate 11 (Chart-Alternativen)                               | `NOT_STARTED` |
| **AP17** | Artikel-/Knowledge-Bereich                                       | `PT17.1–PT17.4` (4)   | P1            | W4                                  | `HB-03` C · `HB-07` C                                                                     | AP10 · AP09 · AP08                                                     | Gate 4 · Gate 1                                                                  | `NOT_STARTED` |
| **AP18** | Events                                                           | `PT18.1–PT18.4` (4)   | P1            | W4                                  | `HB-03` C · `HB-04` C · `HB-07` C                                                         | AP10 · AP09 · AP23 (CTA-Messung)                                       | Gate 4 · Gate 2                                                                  | `NOT_STARTED` |
| **AP19** | Downloads, Resource Center und Lead-Magnet-Auslieferung          | `PT19.1–PT19.5` (5)   | **P0**        | W4                                  | `HB-04` C · `HB-05` **Consumer** · `HB-06` C · `HB-07` C                                  | AP22 (Persistenz/CRM) · AP23 (Consent) · AP28                          | **Gate 10** · Gate 1 · Gate 3                                                    | `NOT_STARTED` |
| **AP20** | About, Contact, Support und Legal                                | `PT20.1–PT20.4` (4)   | **P0** (Teil) | W4                                  | `HB-04` C · `HB-05` **Consumer** · `HB-07` C                                              | AP22 · AP23 · AP09                                                     | Gate 4 (Legal-Indexierungswiderspruch) · Gate 3 · Gate 9                         | `NOT_STARTED` |
| **AP21** | Consumer-Landingpages als 10-sprachiger SEO-Bereich              | `PT21.1–PT21.7` (7)   | **P0**        | W4                                  | `HB-03` **Consumer** · `HB-05` **Consumer** · `HB-07` **Consumer**                        | AP08 · AP09 · AP10 · AP22                                              | **Gate 1** · **Gate 4** · Gate 11                                                | `NOT_STARTED` |
| **AP22** | Lead Platform, Formulare, CRM und Backend-APIs                   | `PT22.1–PT22.8` (8)   | **P0**        | W2 (Fundament) + W4 (Migration)     | `HB-05` **Producer** (`PT22.1`–`PT22.4`) · `HB-06` C · `HB-04` C                          | AP02 (`PT02.4`) · AP28 (Betriebsbasis) · AP23 (Consent für Conversion) | **Gate 3** · **Gate 5** (`PT22.7`) · Gate 10                                     | `NOT_STARTED` |
| **AP23** | Consent, GTM/GA4 und Analytics                                   | `PT23.1–PT23.5` (5)   | **P0**        | W2                                  | `HB-04` **Producer** (`PT23.1`, `PT23.2`)                                                 | AP26 (Allowlist/CSP) · AP22 (Conversion-Kopplung)                      | **Gate 2**                                                                       | `NOT_STARTED` |
| **AP24** | Accessibility / WCAG                                             | `PT24.1–PT24.6` (6)   | **P0**        | W5                                  | `HB-03` C · `HB-07` C                                                                     | AP05 · AP06 · AP16 · AP27 (a11y-Automation)                            | **Gate 11**                                                                      | `NOT_STARTED` |
| **AP25** | Performance und Core Web Vitals                                  | `PT25.1–PT25.5` (5)   | P1            | W5                                  | `HB-04` C (Third-Party-Last)                                                              | AP23 · AP28 · AP21                                                     | Gate 2 (Netzlast) · Gate 4 (Consumer-Performance)                                | `NOT_STARTED` |
| **AP26** | Security Hardening                                               | `PT26.1–PT26.5` (5)   | **P0**        | W2 (Secrets/API) + W5 (Abschluss)   | `HB-04` C · `HB-06` C                                                                     | AP22 (`PT22.7` Chat-Entfernung vor CSP-Finalisierung) · AP28           | **Gate 5** · **Gate 12** · Gate 2                                                | `NOT_STARTED` |
| **AP27** | Teststrategie, Regression und Quality Gates                      | `PT27.1–PT27.6` (6)   | **P0**        | W1 (frühe Gates) + W5 (vollständig) | `HB-03` C · `HB-04` C · `HB-07` **Producer-Stütze** (CI-Paritätsguard)                    | AP10 · AP08 · AP23                                                     | **Gate 1** (CI-Guard grün) · **Gate 11** (a11y-Automation) · Gate 2 · Gate 4     | `NOT_STARTED` |
| **AP28** | Docker/Compose-Infrastruktur, Environments und Deployment        | `PT28.1–PT28.7` (7)   | **P0**        | W2 (Basis) + W5 (Finalisierung)     | `HB-06` **Producer** (`PT28.1`–`PT28.6`)                                                  | AP02 (`PT02.5`) · AP26 (Secrets)                                       | **Gate 12** · **Gate 3** (`DRY_RUN`, Backup, Monitoring)                         | `NOT_STARTED` |
| **AP29** | SEO-/Content-Migration vor Go-live                               | `PT29.1–PT29.4` (4)   | **P0**        | W6                                  | `HB-03` C · `HB-07` C                                                                     | AP09 · AP10 · AP21 · AP08                                              | **Gate 4** · Gate 1                                                              | `NOT_STARTED` |
| **AP30** | Pre-Launch QA und Release Candidate                              | `PT30.1–PT30.5` (5)   | **P0**        | W6                                  | alle (validiert `HB-01`–`HB-08`)                                                          | AP24 · AP25 · AP26 · AP27 · AP29                                       | alle 12 (RC-Abnahme)                                                             | `NOT_STARTED` |
| **AP31** | Go-live, Cutover und Rollback                                    | `PT31.1–PT31.5` (5)   | **P0**        | W6                                  | `HB-06` C                                                                                 | AP28 · AP30                                                            | **Gate 12** · Gate 2 · Gate 4                                                    | `NOT_STARTED` |
| **AP32** | Post-Launch Monitoring und Stabilisierung                        | `PT32.1–PT32.5` (5)   | P2            | W6                                  | `HB-06` C                                                                                 | AP31 · AP28                                                            | Gate 12 (Nachweisbetrieb) · Gate 4 (Indexierung)                                 | `NOT_STARTED` |
| **AP33** | Dokumentation, Wartbarkeit und Betriebsübergabe                  | `PT33.1–PT33.4` (4)   | P2            | W6                                  | —                                                                                         | AP31 · AP32                                                            | — (beschreibt bestehende Verträge, erfindet keine)                               | `NOT_STARTED` |

**Abdeckung: 34/34 · jedes AP exakt einmal · keine neuen AP-IDs · keine Umnummerierung.**
**PT-Referenzierbarkeit: 178/178** über `APxx` → `PTxx.n` in `scope/MASTER-SCOPE.md`.

### 3.1 Prioritätsverteilung

| Prio   | Anzahl | Arbeitspakete                                                                                                                                                  |
| ------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0** | 23     | AP00 · AP01 · AP02 · AP06 · AP08 · AP09 · AP10 · AP11 · AP14 · AP15 · AP16 · AP19 · AP20 · AP21 · AP22 · AP23 · AP24 · AP26 · AP27 · AP28 · AP29 · AP30 · AP31 |
| **P1** | 9      | AP03 · AP04 · AP05 · AP07 · AP12 · AP13 · AP17 · AP18 · AP25                                                                                                   |
| **P2** | 2      | AP32 · AP33                                                                                                                                                    |
| **P3** | —      | Auf AP-Ebene **keines**. P3 gilt auf Themenebene — siehe §5 und §6.                                                                                            |

### 3.2 P0-Treiber bei gemischten Arbeitspaketen

| AP       | P0-Treiber (launch-blockierend)                                                                                                                          | P1-Anteil                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **AP20** | Auflösung des Legal-Indexierungswiderspruchs (Gate 4) sowie Contact-/Support-Formulare auf dem gemeinsamen Persistenz-/Consent-Vertrag (Gate 3, Gate 2). | About-/Support-Redaktion und Detail-UX.                                   |
| **AP22** | `PT22.1`–`PT22.4` (Standard, Persistenz, CRM-Handoff, Queue/Retry) und `PT22.7` (Chat-Entfernung).                                                       | `PT22.6` neue Journeys, sofern nicht Gate-10-tragend.                     |
| **AP26** | CSP/Security-Header, Secrets außerhalb Images, Entfernung der Chat-Domains.                                                                              | vertiefendes Hardening in W5.                                             |
| **AP27** | CI-Guards, die Gate 1 und Gate 11 überhaupt erst nachweisbar machen.                                                                                     | Ausbau der Testtiefe.                                                     |
| **AP28** | `PT28.1`–`PT28.6` (Environment, Compose, Secrets, Deployment/Rollback, Backup/Recovery, Monitoring).                                                     | `PT28.7` Legacy-Konfigurationsbereinigung, soweit unschädlich → siehe §6. |
| **AP01** | Import-Hygiene, die Baseline-404-/Redirect-/Cache-Härtung und das entfernte Garantie-Band schützt.                                                       | `PT01.4` Klassifizierung harmloser Legacy-Konfiguration → siehe §6.       |

---

## 4. Hard Barriers

Ein Hard Barrier ist eine **erzwungene Serialisierung**: Der Consumer darf erst beginnen, wenn der
Producer den genannten Anteil geliefert hat. Barriers werden nicht künstlich erzeugt — jeder Eintrag
nennt seinen Grund und, ebenso verbindlich, **was trotzdem parallel laufen darf**.

### HB-01 — AP00 vor scope-abhängiger Arbeit

| Feld                 | Inhalt                                                                                                                                                                                                                                                                           |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP00` (`PT00.1`–`PT00.4` + Closure Gate)                                                                                                                                                                                                                                        |
| **Consumer**         | alle nachfolgenden scope-abhängigen Arbeitspakete (`AP01`–`AP33`)                                                                                                                                                                                                                |
| **Grund**            | Decision Locks, Prioritäten, Risiken und Abnahmemodell müssen kanonisch und file-basiert verfügbar sein, bevor ein Agent-Lauf Scope-Entscheidungen anwendet. Ohne diese Basis leitet ein späterer Lauf Entscheidungen aus historischer Dokumentation oder Session-Gedächtnis ab. |
| **Contracts/Gates**  | Grundlage aller 12 Launch-Gates; `AGENT-CONTRACT.md` §1, §6; `CONTEXT-INDEX.md`                                                                                                                                                                                                  |
| **Zwingend seriell** | AP00 Closure Gate `PASS` vor dem Start von AP01.                                                                                                                                                                                                                                 |
| **Parallel möglich** | Innerhalb AP00: nichts (`PT00.1`→`PT00.4` sind seriell). Read-only-Evidenzsichtung des Repos ist jederzeit erlaubt, solange sie nichts verändert und keine Decision umdeutet.                                                                                                    |

### HB-02 — AP01 vor branch-abgeleiteter Arbeit

| Feld                 | Inhalt                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP01` (`PT01.1` Baseline verifizieren, `PT01.2` `main`-Imports, `PT01.3` `redesign/preview`-Imports)                                                                                                                   |
| **Consumer**         | jede Arbeit, die selektiv aus `main@d0fdf29`, `redesign/preview@5673b61` oder `feat/contact-joyful@ab373a3` importiert — insbesondere `AP15` (`PT15.2`), `AP05`, `AP16`, `AP27`                                         |
| **Grund**            | Baseline- und Import-Hygiene muss vorher gesichert sein. Ein ungeprüfter Import kann die 404-/Redirect-/Cache-Härtung der Baseline regressieren oder das entfernte Garantie-Band zurückbringen.                         |
| **Contracts/Gates**  | `BRANCH-RECONCILIATION-MAP.md` (Pflicht bei **jedem** branch-abgeleiteten Schritt) · `REPO-BASELINE.md` · **Gate 8** · Gate 4 · `DEC-RL-002`, `DEC-RL-012`                                                              |
| **Zwingend seriell** | `PT01.1` vor jedem Import. Positiv-/Negativliste der Branch-Map vor jedem einzelnen Import konsultieren. Kein Merge, kein branchweiter Cherry-Pick, kein `git checkout <ref> -- <pfad>` für baseline-existente Dateien. |
| **Parallel möglich** | Arbeit, die **nicht** aus einem Quell-Branch importiert (Neuimplementierung, reine Baseline-Arbeit, Dokumentation), läuft parallel zu AP01 weiter.                                                                      |

### HB-03 — AP02 + AP10 vor routenlastiger Expansion

| Feld                 | Inhalt                                                                                                                                                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP02` (`PT02.2` Routing-Zielbild / Route Registry) + `AP10` (`PT10.3` Route Registry / Known Paths, `PT10.1` Redirects)                                                                                                                                                                                                    |
| **Consumer**         | `AP07` · `AP08` · `AP09` · `AP15` · `AP16` · `AP17` · `AP18` · `AP21` sowie jede weitere routing-/SEO-intensive Arbeit (`AP03`, `AP06`, `AP12`, `AP13`, `AP14`, `AP24`, `AP29`)                                                                                                                                             |
| **Grund**            | Route Registry, HTTP-Semantik, Known Paths, Sitemap, Suche und SEO dürfen nicht weiter auf **handgespiegelten Wahrheiten** wachsen. Die Spiegelung Route-Registry ↔ `KNOWN_PATHS` und die German-only-Pfade in `SEOHead.tsx` ↔ `server.ts` sind manuell — jede zusätzliche Route ohne Registry vergrößert die Fehlerfläche. |
| **Contracts/Gates**  | `ROUTING-CONTRACT.md` · `SEO-CONTRACT.md` · `RUNTIME-CONTRACT.md` · **Gate 4** · `AGENT-CONTRACT.md` §5 (Spiegelungsregel)                                                                                                                                                                                                  |
| **Zwingend seriell** | Registry-/Known-Paths-Wahrheit steht, bevor neue Routen oder Sprachrouten in Masse hinzukommen. Wer eine Seite der Spiegelung ändert, ändert die andere im selben Schritt.                                                                                                                                                  |
| **Parallel möglich** | `AP05` (Design-System) und `AP04` (Content-Modell) sind routenneutral und laufen parallel. Inhaltliche Vorarbeit an Seiten ohne neue Route ist ebenfalls unkritisch.                                                                                                                                                        |

### HB-04 — AP23 Consent-Fundament vor Tracking-Aktivierung

| Feld                 | Inhalt                                                                                                                                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP23` (`PT23.1` Basic Consent Mode v2, `PT23.2` Tracking-Fassade und Provider)                                                                                                                                                        |
| **Consumer**         | **jede** produktive Marketing-/Analytics-Tracking-Aktivierung — insbesondere `AP23` (`PT23.3`–`PT23.4`), `AP11`, `AP18`, `AP19`, `AP20`, `AP21`, `AP25`                                                                                |
| **Grund**            | `REST-02` und `DEC-RL-004` verlangen **vollständigen Ladeverzicht** vor Consent. Kein GTM/GA4 vor wirksamer Einwilligung, kein Event-Puffern. Ein nachträglich eingezogenes Consent-Fundament lässt bereits verdrahtete Events zurück. |
| **Contracts/Gates**  | `CONSENT-CONTRACT.md` · `TRACKING-CONTRACT.md` · `NETWORK-ALLOWLIST.md` · **Gate 2** · `REST-02`, `DEC-RL-004`                                                                                                                         |
| **Zwingend seriell** | Consent-Fassade und Ladeverzicht stehen und sind gegen die Allowlist messbar, bevor irgendein Marketing-/Analytics-Tag produktiv geladen wird. Reject erzeugt keine Analytics-/Marketing-Requests.                                     |
| **Parallel möglich** | Die **Definition** der Event-Taxonomie (`PT23.3`) darf parallel entworfen werden — nur nicht produktiv scharf geschaltet. Performance-/Web-Vitals-Monitoring (`PT23.5`) ist von Marketing-Tracking getrennt und blockiert nicht.       |

### HB-05 — AP22 Lead-Fundament vor produktivem Gating und breiter Formularmigration

| Feld                 | Inhalt                                                                                                                                                                                                                                                     |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP22` (`PT22.1` Formular-/API-Standard, `PT22.2` Persistenz-Datenmodell, `PT22.3` CRM-Handoff, `PT22.4` Queue/Retry/Dead-Letter)                                                                                                                          |
| **Consumer**         | `AP15` (`PT15.6` Epigenetik-Inquiry) · `AP19` (Lead Magnet) · `AP20` (Contact/Support) · `AP21` (Consumer-Ordering) · `AP11` (Secondary Conversion) · `AP13` (Anfragepfad)                                                                                 |
| **Grund**            | Persistenz, Idempotenz, Retry und CRM-Handoff müssen **vor** breiter Nutzung stabil sein. `DEC-RL-009` verlangt persistente Verarbeitung mit CRM-Übergabe; solange das Fundament fehlt, bleibt bei jeder migrierten Journey normaler Lead-Verlust möglich. |
| **Contracts/Gates**  | `LEAD-DATA-CONTRACT.md` · `BACKEND-API-CONTRACT.md` · `CRM-INTEGRATION.md` · `LEAD-DELIVERY-CONTRACT.md` · **Gate 3** · Gate 10 · `DEC-RL-009`, `DEC-RL-011`, `DEC-RL-014`                                                                                 |
| **Zwingend seriell** | Alle Journeys nutzen **denselben** Persistenz-/Retry-Vertrag. Kein produktives Gating eines Lead-Magnets, bevor Persistenz und Zustellung stehen — sonst ist das Gate über direkte öffentliche Asset-URLs umgehbar.                                        |
| **Parallel möglich** | UI, Copy, i18n und A11y der Formularstrecken werden parallel gebaut, solange sie noch nicht produktiv gegen CRM/Queue senden. `DRY_RUN` hält Preview/Staging frei von produktiven Side Effects.                                                            |

### HB-06 — AP28 Betriebsbasis vor produktiver CRM-/Queue-Inbetriebnahme

| Feld                 | Inhalt                                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP28` (`PT28.1` Environment-Modell, `PT28.2` Compose-Zielstack, `PT28.3` Secrets, `PT28.4` Deployment/Rollback, `PT28.5` Persistenz/Backup/Recovery, `PT28.6` Monitoring)                                                                                              |
| **Consumer**         | produktive CRM-/Queue-/Persistenz-Aktivierung — `AP22` (produktiver Betrieb), `AP19`, `AP26`, `AP31`, `AP32`                                                                                                                                                            |
| **Grund**            | `REST-01` verlangt Docker/Compose hinter Reverse Proxy/nginx, Secrets außerhalb Images, Healthchecks, Monitoring, backupfähige persistente Daten und image-basiertes Rollback. Ohne diese Basis ist eine CRM-/Queue-Inbetriebnahme weder recoverbar noch rollbackfähig. |
| **Contracts/Gates**  | `DEPLOYMENT-CONTRACT.md` · `RUNTIME-CONTRACT.md` · `CRM-INTEGRATION.md` · `LEAD-DELIVERY-CONTRACT.md` · `NETWORK-ALLOWLIST.md` · **Gate 12** · **Gate 3** · `REST-01`                                                                                                   |
| **Zwingend seriell** | Secrets-Handhabung, Persistenz-/Backup-Pfad und Rollback stehen, bevor echte Leads geschrieben oder an ein CRM übergeben werden. `DRY_RUN` ist vor der ersten CRM-Anbindung wirksam.                                                                                    |
| **Parallel möglich** | Entwicklung des Lead-Datenmodells und der CRM-Adapter läuft parallel — ausschließlich gegen lokale/Preview-Umgebungen mit `DRY_RUN`.                                                                                                                                    |

### HB-07 — i18n-Fundament vor breiter Übersetzungswelle

| Feld                 | Inhalt                                                                                                                                                                                                                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP08` (`PT08.1` i18n-Core, `PT08.3` Namespace-/Key-Parität) — gestützt durch `AP27` (CI-Paritätsguard)                                                                                                                                                                                           |
| **Consumer**         | Consumer × 10 (`AP21`, `REST-03`) · Epigenetik × 10 (`AP15`) · Musterbefunde × 10 (`AP16`) · jede weitere Content-Vervollständigung (`AP04`, `AP12`, `AP13`, `AP14`, `AP17`, `AP18`, `AP20`, `AP29`)                                                                                              |
| **Grund**            | Erst Struktur und **maschinelle** Paritätsprüfung, dann Massenlokalisierung. `DEC-RL-001` verbietet einen dauerhaften EN-Fallback; ohne Guard ist Vollständigkeit über 10 Sprachen nicht nachweisbar, und `PT08.2` (hartcodierten Content lokalisierbar machen) muss der Übersetzung vorausgehen. |
| **Contracts/Gates**  | `I18N-CONTRACT.md` · `SEO-CONTRACT.md` (hreflang) · `QUALITY-GATES.md` · **Gate 1** · Gate 7 · Gate 9 · `DEC-RL-001`, `REST-03`                                                                                                                                                                   |
| **Zwingend seriell** | `PT08.1` + `PT08.2` + `PT08.3` vor der Massenübersetzung. Sprachliste in `src/i18n.ts` und `server.ts` bleibt manuell gespiegelt — beide Seiten im selben Schritt ändern.                                                                                                                         |
| **Parallel möglich** | Quelltexte (DE/EN) und Content-Redaktion entstehen parallel. Sprachabhängige Assets (`PT08.6`) können vorbereitet werden, sobald die Namespace-Struktur steht.                                                                                                                                    |

### HB-08 — Epigenetik-IA vor Epigenetik-Inquiry

| Feld                 | Inhalt                                                                                                                                                                                                                                                                              |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Producer**         | `AP15` (`PT15.1` Hub-IA und Hauptnavigation, ergänzt um `PT15.3` Panels)                                                                                                                                                                                                            |
| **Consumer**         | die eigene Epigenetik-Inquiry-/CRM-Strecke (`PT15.6`), gekoppelt an `AP22` und `AP16`                                                                                                                                                                                               |
| **Grund**            | Panel-, Source-, Campaign- und Navigationskontext müssen stabil sein, bevor die eigene Anfragestrecke gebaut wird — `DEC-RL-011` verlangt eine eigene Backend-/CRM-Zuordnung, die genau diesen Kontext transportiert. Eine nachträglich geänderte IA invalidiert die CRM-Zuordnung. |
| **Contracts/Gates**  | `LEAD-DATA-CONTRACT.md` · `CRM-INTEGRATION.md` · `CONSENT-CONTRACT.md` · `ROUTING-CONTRACT.md` · **Gate 6** · Gate 3 · `DEC-RL-005`, `DEC-RL-011`                                                                                                                                   |
| **Zwingend seriell** | IA, Navigationsrolle und Panel-Struktur stehen vor der Inquiry-Implementierung. `HB-05` gilt zusätzlich: Das Lead-Fundament aus `AP22` muss ebenfalls stehen.                                                                                                                       |
| **Parallel möglich** | Musterbefunde (`AP16`) und Epigenetik-Content/Übersetzungen laufen parallel zur Inquiry-Entwicklung, solange sie die IA nicht verändern.                                                                                                                                            |

### 4.1 Barrier-Matrix (Kurzform)

| Barrier | Producer                      | Kern-Consumer                                               | Blockierendes Gate |
| ------- | ----------------------------- | ----------------------------------------------------------- | ------------------ |
| `HB-01` | AP00                          | alle                                                        | alle               |
| `HB-02` | AP01                          | branch-abgeleitete Arbeit (AP15 `PT15.2`, AP05, AP16, AP27) | Gate 8             |
| `HB-03` | AP02 `PT02.2` + AP10 `PT10.3` | AP07 · AP08 · AP09 · AP15 · AP16 · AP17 · AP18 · AP21       | Gate 4             |
| `HB-04` | AP23 `PT23.1`/`PT23.2`        | jede Tracking-Aktivierung                                   | Gate 2             |
| `HB-05` | AP22 `PT22.1`–`PT22.4`        | AP15 `PT15.6` · AP19 · AP20 · AP21 · AP11 · AP13            | Gate 3 · Gate 10   |
| `HB-06` | AP28 `PT28.1`–`PT28.6`        | produktive CRM-/Queue-Inbetriebnahme                        | Gate 12 · Gate 3   |
| `HB-07` | AP08 `PT08.1`/`PT08.3`        | Consumer × 10 · Epigenetik × 10 · Musterbefunde × 10        | Gate 1             |
| `HB-08` | AP15 `PT15.1`                 | Epigenetik-Inquiry `PT15.6`                                 | Gate 6             |

---

## 5. Sichere Parallelisierung

Parallel markiert ist ausschließlich, was **keinen** Contract-, File- oder Architektur-Hard-Barrier
verletzt. Im Zweifel gilt: seriell.

| Fenster  | Was parallel laufen darf                                   | Warum unkritisch                                                                                                                    |
| -------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **W1-A** | `AP05` (Design-System) neben `AP10` (Route-/HTTP-Semantik) | Design-System ist routenneutral; keine gemeinsamen Hotspot-Dateien außer `tailwind.config.js`, das AP10 nicht anfasst.              |
| **W1-B** | `AP08` i18n-Core neben `AP09` SEO-Fundament                | Berühren sich nur bei hreflang; beide hängen an AP10, nicht aneinander — die hreflang-Kopplung wird in `PT09.1` einmalig aufgelöst. |
| **W2-A** | `AP28` Environment-Basis neben `AP23` Consent-Fundament    | Disjunkte Dateimengen (Compose/Secrets vs. Consent-/Tracking-Fassade).                                                              |
| **W2-B** | `AP22` Datenmodell neben `AP26` Secrets-/API-Security      | Gemeinsamer Berührungspunkt sind nur Secret-**Namen**, keine Werte.                                                                 |
| **W3**   | `AP12` · `AP13` · `AP14` untereinander                     | Getrennte Seitenbäume auf gemeinsamem, dann bereits stabilem Template-/Route-Fundament.                                             |
| **W4**   | `AP17` · `AP18` neben `AP21`                               | Getrennte Content-Bereiche; gemeinsame Abhängigkeit ist nur das bereits gelieferte i18n-/SEO-Fundament.                             |
| **W5**   | `AP24` A11y neben `AP25` Performance                       | Unterschiedliche Messachsen; Konflikte nur bei Motion/Layout-Shift, dort gilt A11y.                                                 |

**Nicht parallelisierbar (Auszug):** alles, was gegen `HB-01`–`HB-08` läuft; jede gleichzeitige Änderung
beider Seiten einer manuellen Spiegelung durch verschiedene Läufe (Route-Registry ↔ `KNOWN_PATHS`;
`SEOHead.tsx` ↔ `server.ts`; `src/i18n.ts` ↔ `server.ts`); gleichzeitige Arbeit mehrerer Läufe an
denselben G2-/G3-Hotspot-Dateien (`AGENT-CONTRACT.md` §5).

---

## 6. Geschützte Backlog-Grenze (P3)

Die folgenden Themen sind per bestätigter Decision **Backlog** und bleiben es. Sie werden hier geführt,
damit ein späterer Lauf sie nicht versehentlich hochstuft.

| Thema                                            | Prio   | Lock                | Regel                                                                                                                   |
| ------------------------------------------------ | ------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Content Owner / Review-Zyklen / Freshness-Regeln | **P3** | `DEC-RL-010`        | Nicht P0, keine Relaunch-Voraussetzung.                                                                                 |
| Medizinisch/fachliche Freigabeprozesse (formal)  | **P3** | `DEC-RL-010`        | Regulatorische **Pflichthinweise auf Seiten** bleiben davon unberührt und sind Teil des Launch-Scope (`AP15` `PT15.4`). |
| Übersetzungsworkflow-Governance                  | **P3** | `DEC-RL-010`        | Die **technische** Paritätsprüfung (`HB-07`) ist P0 und nicht gemeint.                                                  |
| CMS-Pipeline-Governance                          | **P3** | Master-Scope §0.2.2 | Nicht Launch-Scope.                                                                                                     |
| Deal / Voucher                                   | **P3** | `DEC-RL-015`        | Weder bauen noch reaktivieren.                                                                                          |
| Case Studies                                     | **P3** | `DEC-RL-015`        | Weder bauen noch reaktivieren.                                                                                          |
| Shop                                             | **P3** | `DEC-RL-015`        | Weder bauen noch reaktivieren.                                                                                          |
| Tote/unschädliche Legacy-Artefakte               | **P3** | Master-Scope §0.2.2 | Nur solange sie Launch, Security, Build oder Imports **nicht** beeinflussen.                                            |

**Verbindliche Regeln:**

1. Diese Themen dürfen **nicht P0 werden**.
2. Sie dürfen **nicht als Relaunch-Voraussetzung** behandelt werden.
3. Sie dürfen **nicht stillschweigend reaktiviert** werden.
4. Eine Hochstufung erfordert einen `ACCEPTED`-Eintrag in `building-docs/SCOPE-CHANGELOG.md` mit
   bestätigender menschlicher Entscheidung. Repository-Evidenz allein genügt nicht.

### 6.1 Abgrenzung: technische Altlast ≠ Backlog-Thema

Eine technische Altlast verlässt den P3-Status und wird regulär priorisiert, sobald **nachweisbar**
mindestens eines zutrifft (Nachweis ist zu dokumentieren):

- sie bricht den Build;
- sie verletzt eine Security-/CSP-/Secret-Grenze;
- sie verunreinigt einen selektiven Import;
- sie unterläuft aktiv einen bestätigten Lock — z. B. produktive Chat-Reste gegen `DEC-RL-007`
  (dort P0 über `AP22` `PT22.7` und `AP26`, Gate 5).

Ohne diesen Nachweis bleibt sie P3. Betroffene Prüfstellen: `AP01` `PT01.4`, `AP28` `PT28.7`.

---

## 7. Arbeitsregel für spätere Läufe

1. **Welle** bestimmen (§2) — nicht die AP-Nummer.
2. **Hard Barriers** prüfen (§4): Ist jeder Producer für das geplante AP geliefert?
3. **Priorität** nur zur Konfliktlösung innerhalb einer Welle heranziehen (§3).
4. **Requirements** aus `scope/MASTER-SCOPE.md` + `work-packages/APxx.md` lesen — nicht aus diesem Dokument.
5. **Status** in der Tabelle §3 fortschreiben, wenn ein AP beginnt oder abschließt.
6. Prioritäts- oder Backlog-Änderungen mit Lock-Bezug: ausschließlich über `SCOPE-CHANGELOG.md`.

**Dieses Dokument ändert keine Decision.** Decision Locks `DEC-RL-001`–`DEC-RL-015` und
`REST-01`–`REST-03` bleiben unverändert `LOCKED` — siehe `building-docs/DECISIONS.md`.
