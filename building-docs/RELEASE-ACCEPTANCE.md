# RELEASE-ACCEPTANCE — Abnahmevertrag und Launch-Gate-Verantwortung

**Dokumenttyp:** Release-Abnahmevertrag (kanonisch)
**Erzeugt durch:** `PT00.4` (AP00 — Programmsteuerung, Scope Lock und Delivery Governance)
**Stand:** 2026-08-24
**Repository-Baseline:** `feat/home-leadmagnet@961f65d`
**Kanonischer Scope:** `building-docs/scope/MASTER-SCOPE.md` §8 (die zwölf Launch-Gates)
**Technische Gate-Kriterien:** `building-docs/QUALITY-GATES.md` §12 (Launch Gate Matrix)
**Decisions:** `building-docs/DECISIONS.md` · **Risiken:** `building-docs/RISK-REGISTER.md`

---

## 0. Was dieser Vertrag regelt — und was nicht

**Regelt:** _wer_ welchen Teil des Releases abnimmt, _welche Evidenz_ als Nachweis zählt, _wann_ ein
Gate `PASS`, `FAIL` oder `BLOCKED` ist, wie mit Ausnahmen umgegangen wird und wer final zeichnet.

**Regelt nicht:** _wie_ ein Gate technisch implementiert wird. AP00 **implementiert keine Gates**.
Die technischen Kriterien stehen in `MASTER-SCOPE.md` §8 und `QUALITY-GATES.md` §12; die Implementierung
liegt bei den jeweiligen Arbeitspaketen, die Gate-Integration bei **AP27 `PT27.6`**.

**Kein zweites Gate-Register.** Dieses Dokument dupliziert die Kriterienlisten nicht, es referenziert sie.
Bei jeder Abweichung im Wortlaut gilt `MASTER-SCOPE.md` §8.

### 0.1 Aktueller Stand — ehrliche Ausgangslage

**Kein Gate ist heute abgenommen.** Alle zwölf stehen auf `NOT_RUN` (siehe §7). `QUALITY-GATES.md` §12
weist den heutigen technischen Ist-Zustand aus: neun Gates `❌`, drei `⚠ ungeprüft`. Dieser Vertrag
definiert den Weg zur Abnahme — er stellt **keine** Abnahme fest und nimmt keine vorweg.

### 0.2 Zwei verschiedene Eigentümerschaften

| Begriff                    | Bedeutung                                                                           | Steht wo                                          |
| -------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Eigentümer-AP**          | Das Arbeitspaket, das die Fähigkeit **liefert** und den Nachweis **baut**.          | `QUALITY-GATES.md` §12 · `RELAUNCH-BACKLOG.md` §3 |
| **Accountable Owner Role** | Die Rolle, die den Nachweis **prüft und abnimmt** und für die Freigabe geradesteht. | dieses Dokument                                   |

Beides ist nicht dasselbe und darf nicht vermischt werden. Wer liefert, nimmt nicht ab.

---

## 1. Rollenmodell

Ausschließlich Rollen, keine Personennamen. Genau eine **accountable** Rolle je Gate; unterstützende
Rollen liefern Fachurteil, tragen aber nicht die Freigabe.

| Rolle                             | Kürzel | Verantwortet                                                                     |
| --------------------------------- | ------ | -------------------------------------------------------------------------------- |
| **Product / Business Owner**      | `PBO`  | Scope- und Decision-Treue, Journeys, Claims, Benennung, Geschäftssäulen.         |
| **Technical Owner / Engineering** | `TOE`  | Build, SSR, Routing/HTTP, Persistenz/CRM/Queue, technische Fehlerpfade, Tests.   |
| **SEO / Technical SEO Approver**  | `SEO`  | Sitemap, Canonical, hreflang, Indexierungslogik, Statussemantik im SEO-Surface.  |
| **Privacy / Tracking Approver**   | `PTA`  | Consent-Wirksamkeit, Tag-Ladeverhalten, Event-Taxonomie, Netz-Allowlist.         |
| **Legal / Privacy Approver**      | `LPA`  | Rechtmäßigkeit neuer Datenflüsse, Retention, Betroffenenrechte, Pflichthinweise. |
| **QA / Accessibility Approver**   | `QAA`  | Teststufen, Regressionsnachweis, WCAG 2.2 AA, Nachweisqualität.                  |
| **Operations / Technical Owner**  | `OTO`  | Produktionsstack, Secrets, Backup/Restore, Monitoring, Rollback, Isolation.      |

**Regel:** Eine Rolle kann in Personalunion besetzt sein — die **Abnahmeschritte bleiben trotzdem
getrennt und einzeln dokumentiert**. Personalunion ist kein Grund, einen Nachweis zu überspringen.

### 1.1 Warum `PBO` sechs Gates accountable führt

Die Gates 1, 6, 7, 8, 9 und 10 formulieren **Geschäftszusagen** (Sprachumfang, Geschäftssäule,
Produktclaim, entferntes Band, CTA-Benennung, gated Conversion). Ihre technische Herstellung liegt bei
Engineering, ihre **Wahrheit gegenüber Markt und Kunde** bei `PBO`. Deshalb prüft `TOE` dort die
Evidenz und `PBO` nimmt ab.

---

## 2. Abnahmedomänen

Sieben Domänen. Jede hat genau eine accountable Rolle und speist bestimmte Gates.

### DOMAIN-A — Product / Business

**Accountable:** `PBO` · **Speist Gates:** 1 · 6 · 7 · 8 · 9 · 10 (+ zuliefernd 4, 5)

Abzunehmen:

- Scope- und Decision Locks respektiert (`DECISIONS.md` §3, 18/18);
- Kernjourneys vorhanden und begehbar;
- Standard-CTA „Angebot anfragen" korrekt und lokalisiert;
- Epigenetik als eigenständige Geschäftssäule (eigene IA, Navigation, Homepage-Rolle, Lead Journey);
- Consumer als vollwertiger 10-sprachiger SEO-Bereich;
- kein Chat;
- kein site-weites „garantierte Performance"-Band und **kein Ersatzband**;
- gated Secondary-Conversion-/Lead-Magnet-Pfad vorhanden;
- IglooPro-Claim gemäß `DEC-RL-008` konsistent umgesetzt.

> **Verbindliche Einschränkung zu `CV < 2 %`:** Diese Abnahme bestätigt **Konsistenz der Ausspielung**
> einer bestätigten Produkt-/Content-Entscheidung. Sie ist **keine** unabhängige wissenschaftliche
> Validierung und darf in keinem Protokoll, Report oder Artefakt als solche beschrieben werden
> (`DEC-RL-008`, `RISK-001`).

### DOMAIN-B — Engineering / Architecture

**Accountable:** `TOE` · **Speist Gates:** 3 · 4 · 5 · 12 (+ zuliefernd alle übrigen)

Abzunehmen:

- reproduzierbarer Build; SSR funktioniert;
- Routing-/HTTP-Verträge erfüllt; echte 301, echte 404;
- Lead-Persistenz, CRM-Handoff, Queue/Retry, Idempotenz;
- technische Error Paths definiert und getestet;
- Docker/Compose-Zielarchitektur, Healthchecks, Rollback;
- technische Tests und CI-Gates lauffähig und aussagekräftig.

### DOMAIN-C — SEO

**Accountable:** `SEO` · **Speist Gates:** 4 (+ zuliefernd 1, 6, 7, 10)

Abzunehmen:

- Sitemap, Canonical, hreflang, Indexierungslogik;
- echte 301 (`/services*`), echte 404 ohne falschen Canonical;
- Consumer-SEO und Epigenetics-SEO;
- Structured Data;
- **keine** Preview-/Staging-URLs im produktiven SEO-Surface;
- **keine** widersprüchlichen `noindex`-/Sitemap-Zustände (inkl. Legal-Indexierungswiderspruch);
- relevante interne Verlinkung; ehrliches `lastmod`.

### DOMAIN-D — Consent / Tracking / Privacy

**Accountable:** `PTA` · **Speist Gates:** 2 · 5 (+ zuliefernd 10, 12)

Abzunehmen:

- GTM/GA4 laden **nicht** vor wirksamem Consent;
- **kein** Event-Puffern vor Consent;
- Analytics-/Marketing-Provider erst nach Einwilligung aktiviert;
- Widerruf funktioniert; Consent-State korrekt umgesetzt;
- **keine unzulässige PII** im Tracking;
- direkte Bypass-Tracking-Pfade entfernt oder korrekt gegatet;
- HiHuman / Chat-Drittanbieter entfernt;
- Netz-Allowlist korrekt und geprüft.

`REST-02` ist verbindlich: Basic Consent Mode v2 / **vollständiger Ladeverzicht**.

### DOMAIN-E — Legal / Privacy neuer Datenflüsse

**Accountable:** `LPA` · **Speist Gates:** 3 · 10 (+ zuliefernd 2, 4, 6, 12)

Abzunehmen:

- Lead-Persistenz und CRM-Handoff als Verarbeitung dokumentiert;
- Retention-Fristen; Löschung und Auskunft umsetzbar;
- Consent Evidence nachweisbar;
- Lead Magnet, Consumer Order, Epigenetics Inquiry als eigene Verarbeitungspfade;
- Mail-/CRM-/Queue-Datenflüsse beschrieben;
- Datenschutzdokumentation für **jeden neuen** Verarbeitungspfad;
- regulatorische Pflichthinweise vorhanden und sichtbar (`RISK-015`).

> **Keine juristische Freigabe wird erfunden, angenommen oder vorweggenommen.** Wo eine tatsächliche
> menschliche Legal-Abnahme erforderlich ist, bleibt das betroffene Gate **`BLOCKED`**, bis sie
> vorliegt — ein technisch grüner Nachweis ersetzt sie nicht.

### DOMAIN-F — Quality / Accessibility

**Accountable:** `QAA` · **Speist Gates:** 11 (+ zuliefernd alle Gates als Nachweisqualität)

Abzunehmen:

- WCAG 2.2 AA für relevante Kernpfade;
- Tastaturbedienung, Fokusmanagement, Dialoge/Modals, Skip-Links, semantische Struktur;
- Formulare zugänglich; Reduced Motion respektiert;
- Visual Regression; Unit-, Integrations- und E2E-Tests; CI-Gates;
- **keine unbegründeten „alles grün"-Claims** (`QUALITY-GATES.md` QG-15).

### DOMAIN-G — Operations

**Accountable:** `OTO` · **Speist Gates:** 12 (+ zuliefernd 3, 10)

Abzunehmen:

- Docker/Compose Health; Reverse Proxy;
- Secrets außerhalb Images und Repository;
- persistente Daten separat und backupfähig; Backup **und** Restore nachgewiesen;
- Monitoring, Logging, Alerting; Restart Policies;
- Deployment und image-basiertes Rollback getestet;
- Environment-Isolation; `DRY_RUN` für nicht-produktive Umgebungen;
- CRM-/Queue-/Mail-Isolation in Preview/Staging.

`REST-01` ist verbindlich.

---

## 3. Evidenzvertrag — was als Nachweis zählt

### 3.1 Maschinelle Evidenz

Ein automatisierter, **reproduzierbarer und deterministischer** Lauf, dessen Artefakt aufbewahrt wird
und der eindeutig einem Commit-SHA zugeordnet ist.

### 3.2 Manuelle Evidenz

Eine dokumentierte menschliche Prüfung mit Datum, Rolle, geprüftem Gegenstand, Ergebnis und —
wo sinnvoll — einem Beleg (Screenshot, Protokoll, Checkliste). Zulässig **nur**, wo Automatisierung
nicht anwendbar ist oder wo eine fachliche/juristische Bewertung verlangt wird.

### 3.3 Was ausdrücklich **kein** Nachweis ist

- „Sieht gut aus" · „läuft bei mir" · eine Behauptung im Ticket oder in der Dokumentation;
- ein erfolgreicher Build allein;
- ein grüner CI-Lauf **ohne SHA-Bezug**;
- ein Testlauf, der stillschweigend gegen einen fremden bereits laufenden Server lief
  (`QUALITY-GATES.md` QG-13);
- ein Gate-Ergebnis aus einem früheren, inzwischen überholten Stand;
- die Aussage einer liefernden Rolle über ihr eigenes Gate ohne prüfbares Artefakt.

**`QG-15` gilt unverändert: Ein Gate ohne Nachweis gilt als nicht erfüllt.**
**`M-04` gilt unverändert: Ein neues Gate bringt seinen Nachweis mit.**

### 3.4 Bindung an einen Stand

Jeder Nachweis nennt den **Commit-SHA**, gegen den er erhoben wurde. Ändert sich der Stand in einer
Weise, die den Gate-Gegenstand berührt, verliert der Nachweis seine Gültigkeit und das Gate fällt auf
`NOT_RUN` zurück. Für den Release Candidate friert `AP30 PT30.5` den SHA ein.

---

## 4. Ergebnissemantik

| Ergebnis      | Bedeutung                                                                      | Voraussetzung                                                                         |
| ------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| **`NOT_RUN`** | Noch nicht geprüft. **Standard.** Nicht dasselbe wie `PASS`.                   | —                                                                                     |
| **`PASS`**    | Alle Kriterien erfüllt, Evidenz vollständig, accountable Rolle hat gezeichnet. | maschinelle **und** geforderte manuelle Evidenz liegen vor und sind SHA-gebunden      |
| **`FAIL`**    | Mindestens ein Kriterium nachweislich nicht erfüllt.                           | Befund ist reproduzierbar und dokumentiert                                            |
| **`BLOCKED`** | Prüfung nicht durchführbar oder Abnahme steht extern aus.                      | fehlende Vorbedingung, fehlende Umgebung, ausstehende menschliche/juristische Abnahme |

**Abgrenzung `FAIL` vs. `BLOCKED`:** `FAIL` heißt „geprüft und nicht erfüllt". `BLOCKED` heißt
„nicht prüfbar" oder „Entscheidung liegt außerhalb des Teams". Ein `BLOCKED` darf **nie** zu `PASS`
umgedeutet werden, weil die Zeit drängt.

**Ein `FAIL` oder `BLOCKED` in einem Gate blockiert den Release Candidate** (`QUALITY-GATES.md` QG-14),
sofern kein wirksamer Waiver nach §5 vorliegt.

---

## 5. Waiver-Politik

Ein Waiver ist eine **bewusst getragene, befristete Ausnahme** — kein stilles Übergehen.

### 5.1 Voraussetzungen

Ein Waiver ist nur wirksam, wenn **alle** Punkte erfüllt sind:

1. **ID und Datum** (`WV-00x`, ISO-Datum);
2. **betroffenes Gate** und exakt benanntes Kriterium;
3. **Begründung**, warum die Anforderung zum Release-Zeitpunkt nicht erfüllt ist;
4. **Restrisiko** benannt und in `RISK-REGISTER.md` als Eintrag geführt oder verlinkt;
5. **Kompensierende Maßnahme** (Monitoring, manuelle Kontrolle, eingeschränkter Rollout);
6. **Befristung** mit konkretem Zieltermin oder Ziel-AP — ein Waiver ist nie unbefristet;
7. **Bestätigung durch die accountable Rolle des Gates** _und_ durch `PBO`;
8. bei rechtlich relevanten Punkten zusätzlich durch `LPA`.

### 5.2 Was nicht waivable ist

| Nicht waivable                                                        | Grund                                                                                     |
| --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Tracking vor wirksamem Consent (Gate 2)                               | `REST-02`/`DEC-RL-004`; rechtlicher Grundvertrag.                                         |
| Fehlende Legal-Abnahme für einen neuen Verarbeitungspfad (Gate 3, 10) | Eine ausstehende juristische Abnahme kann nicht durch Projektentscheidung ersetzt werden. |
| Secrets in Images oder im Repository (Gate 12)                        | `AGENT-CONTRACT.md` §4; Sicherheitsgrenze.                                                |
| Normaler Lead-Verlust im Regelbetrieb (Gate 3)                        | `DEC-RL-009`; Kern der Zielarchitektur.                                                   |
| Rückkehr des Garantie-Bands oder ein Ersatzband (Gate 8)              | `DEC-RL-012`; ausdrücklich nicht wieder zu öffnen.                                        |
| Rückmigration des Claims auf `<5 %` (Gate 7)                          | `DEC-RL-008`; ausdrücklich nicht wieder zu öffnen.                                        |
| Ein Waiver, der faktisch einen Decision Lock ändert                   | Das ist ein Scope Change und läuft über `SCOPE-CHANGELOG.md`, nicht über einen Waiver.    |

### 5.3 Abgrenzung Waiver ↔ Scope Change

Ein **Waiver** verschiebt die _Erfüllung_ einer weiterhin gültigen Anforderung.
Ein **Scope Change** ändert die _Anforderung selbst_ und erfordert einen `ACCEPTED`-Eintrag in
`SCOPE-CHANGELOG.md` mit bestätigender menschlicher Entscheidung. Wer das verwechselt, umgeht die
Change Control.

### 5.4 Waiver-Register

Wirksame Waiver werden in §8 dieses Dokuments geführt. **Derzeit: keine.**

---

## 6. Die zwölf Launch-Gates — Evidence Contracts

Gate-IDs, Namen und technische Kriterien sind aus `MASTER-SCOPE.md` §8 und `QUALITY-GATES.md` §12
kanonisch übernommen. **Kriterien werden hier nicht neu formuliert.**

---

### Gate 1 — Language Gate

| Feld                       | Inhalt                                                                                                                              |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass alle relevanten Inhalte in allen zehn Sprachen vollständig vorliegen und kein dauerhafter Fallback produktiv wird. |
| **Accountable Owner Role** | `PBO`                                                                                                                               |
| **Supporting Roles**       | `TOE` (Paritätsguard) · `SEO` (hreflang/Meta) · `QAA` (Nachweisqualität)                                                            |
| **Relevant Decisions**     | `DEC-RL-001` · `REST-03`                                                                                                            |
| **Relevant APs**           | AP08 (Eigentümer) · AP04 · AP21 · AP15 · AP16 · AP27 · AP29                                                                         |
| **Relevant PTs**           | `PT08.1` · `PT08.3` · `PT08.5` · `PT08.6` · `PT21.5` · `PT15.7` · `PT27.6`                                                          |
| **Prerequisites**          | `HB-07` erfüllt (i18n-Core und Paritätsguard vor der Übersetzungswelle); `HB-03` erfüllt (Sprachrouten stehen).                     |
| **Relevante Risiken**      | `RISK-005` (primär) · `RISK-008` · `RISK-013`                                                                                       |

**Machine Evidence**

- Key-/Namespace-Paritätsguard über alle 10 Locales, grün, SHA-gebunden;
- automatisierter Check: keine produktive Dauer-FallbackNotice auf Kernrouten;
- Route-/Sprach-Abdeckungsreport (Consumer × 10, Epigenetik × 10, Musterbefunde × 10).

**Manual Evidence**

- stichprobenhafte fachliche Sichtung der Übersetzungsqualität je Sprache durch `PBO`;
- Prüfung sprachabhängiger Assets und Systemmails/Autoresponder (Versand in der erwarteten Sprache);
- bewusste Ausnahmen (falls vorhanden) benannt und begründet.

**Expected Artifacts**

- Guard-Report (Maschinenlauf, SHA); Abdeckungsmatrix Sprache × Strecke; Asset-/Mail-Matrix;
  Sichtungsprotokoll mit Datum und Rolle.

**PASS** — Guard grün über 10/10 Sprachen · keine produktive Dauer-Fallback-Ausgabe · sprachabhängige
Assets und Systemmails korrekt · fachliche Sichtung dokumentiert · `PBO` gezeichnet.

**FAIL** — Guard meldet fehlende Keys/Namespaces · eine relevante Strecke fehlt in einer Sprache ·
eine Dauer-FallbackNotice erscheint produktiv · ein sprachabhängiges Asset oder eine Systemmail fehlt.

**BLOCKED** — Paritätsguard existiert noch nicht oder ist nicht reproduzierbar · Übersetzungen liegen
zur Prüfung nicht vor · Testumgebung erlaubt keinen Mailversand-Nachweis.

**Waiver Policy** — Nur für **einzelne, klar benannte** nicht-kritische Inhalte mit befristeter
Nachlieferung und sichtbarem Kompensationsweg. **Nicht waivable:** eine ganze Sprache, eine ganze
Strecke oder Consumer × 10 (`REST-03`).

**Verification Timing** — laufend in CI ab `AP08`; verbindliche Abnahme im Release Candidate (`AP30 PT30.5`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA)

---

### Gate 2 — Consent Gate

| Feld                       | Inhalt                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Purpose**                | Nachweisen, dass vor wirksamer Einwilligung keinerlei nicht notwendige Marketing-/Analytics-Aktivität stattfindet. |
| **Accountable Owner Role** | `PTA`                                                                                                              |
| **Supporting Roles**       | `LPA` (Rechtmäßigkeit) · `TOE` (Implementierung) · `QAA` (E2E-Nachweis)                                            |
| **Relevant Decisions**     | `DEC-RL-004` · `REST-02`                                                                                           |
| **Relevant APs**           | AP23 (Eigentümer) · AP26 · AP27 · AP25                                                                             |
| **Relevant PTs**           | `PT23.1` · `PT23.2` · `PT23.4` · `PT23.5` · `PT27.4`                                                               |
| **Prerequisites**          | `HB-04` erfüllt (Consent-Fundament vor jeder Tracking-Aktivierung); Netz-Allowlist definiert.                      |
| **Relevante Risiken**      | `RISK-006` (primär) · `RISK-008`                                                                                   |

**Machine Evidence**

- Netzwerk-E2E im Zustand _kein Consent_: **null** Requests an Analytics-/Marketing-Domains;
- Netzwerk-E2E im Zustand _Reject_: request-frei;
- Nachweis, dass **kein** Event vor Consent gepuffert und nach Consent nachgesendet wird;
- Widerrufs-E2E: nach Widerruf keine weiteren Requests;
- Abgleich aller beobachteten Domains gegen `NETWORK-ALLOWLIST.md`.

**Manual Evidence**

- `PTA` prüft die Consent-Oberfläche auf Wirksamkeit und Verständlichkeit;
- `LPA` prüft Konsistenz zwischen Consent-Text, Datenschutzdokumentation und tatsächlichem Verhalten;
- Prüfung auf unzulässige PII in der Event-Taxonomie.

**Expected Artifacts**

- Playwright-Netzwerk-Traces je Zustand (kein Consent / Accept / Reject / Widerruf), SHA-gebunden;
- Allowlist-Abgleichsreport; Prüfprotokoll `PTA` und `LPA`.

**PASS** — kein Request an eine nicht notwendige Drittanbieter-Domain vor Consent · Reject request-frei ·
kein Pre-Consent-Puffer · Widerruf wirksam · keine unzulässige PII · Doku konsistent · `PTA` gezeichnet.

**FAIL** — mindestens ein Analytics-/Marketing-Request vor Consent oder nach Reject · Events werden
gepuffert · Widerruf ohne Wirkung · PII im Tracking · Doku widerspricht dem Verhalten.

**BLOCKED** — Netzwerk-E2E-Harness fehlt oder ist nicht deterministisch · Allowlist nicht final ·
`LPA`-Bewertung steht aus.

**Waiver Policy** — **Nicht waivable.** Tracking vor wirksamem Consent ist ein rechtlicher
Grundvertrag (`REST-02`), keine Qualitätsstufe.

**Verification Timing** — ab `AP23` in CI; erneut im RC (`AP30`) und als Livecheck nach Go-live (`AP31`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PTA`, Datum, SHA)

---

### Gate 3 — CRM Gate

| Feld                       | Inhalt                                                                                                                  |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass kein Lead bei normalen technischen Fehlerfällen verloren geht und der CRM-Handoff belastbar ist.       |
| **Accountable Owner Role** | `TOE`                                                                                                                   |
| **Supporting Roles**       | `OTO` (Betrieb/Monitoring) · `LPA` (Verarbeitung) · `PBO` (Lead-Qualität)                                               |
| **Relevant Decisions**     | `DEC-RL-009` · `DEC-RL-011` · `REST-01`                                                                                 |
| **Relevant APs**           | AP22 (Eigentümer) · AP28 · AP19 · AP20 · AP21 · AP15 · AP27                                                             |
| **Relevant PTs**           | `PT22.2` · `PT22.3` · `PT22.4` · `PT22.5` · `PT22.8` · `PT28.5` · `PT28.6` · `PT27.2`                                   |
| **Prerequisites**          | `HB-05` erfüllt (Lead-Fundament vor breiter Migration); `HB-06` erfüllt (Betriebsbasis vor produktiver Inbetriebnahme). |
| **Relevante Risiken**      | `RISK-004` (primär) · `RISK-009` · `RISK-011` · `RISK-012`                                                              |

**Machine Evidence**

- Integrationstest: Formular → Persistenz → Queue → CRM-Testadapter, vollständig;
- Retry-, Dead-Letter- und Recovery-Test mit erzwungenem Ausfall der CRM-Stufe;
- Idempotenz- und Dedup-Test (identische Einreichung erzeugt genau einen Lead);
- Nachweis, dass `DRY_RUN` in nicht-produktiven Umgebungen **keinen** echten Side Effect erzeugt;
- Monitoring-/Alert-Auslösung im Fehlerfall verifiziert.

**Manual Evidence**

- `OTO` bestätigt Backup-/Recovery-Definition für die Lead-Persistenz;
- `LPA` nimmt Verarbeitung, Retention und Betroffenenrechte ab;
- `PBO` prüft, dass die im CRM ankommenden Felder fachlich brauchbar sind (Source-/Panel-Kontext).

**Expected Artifacts**

- Integrations- und Fehlerfall-Testreports (SHA-gebunden); Dead-Letter-Nachweis; `DRY_RUN`-Beleg;
  Monitoring-Screenshot/Alert-Protokoll; Legal-Abnahmevermerk.

**PASS** — jeder relevante Lead wird vor oder innerhalb des Handoffs persistent erfasst ·
Retry/Dead-Letter/Recovery getestet · Idempotenz und Dedup getestet · `DRY_RUN` wirksam ·
Monitoring aktiv · Backup/Recovery definiert · `LPA` liegt vor · `TOE` gezeichnet.

**FAIL** — ein Lead geht in einem simulierten Normalfehler verloren · Doppelleads bei identischer
Einreichung · Preview erzeugt echte CRM-/Mail-Side-Effects · Dead-Letter ohne Recovery-Pfad.

**BLOCKED** — CRM-Testadapter oder Persistenz noch nicht vorhanden · Betriebsbasis (`HB-06`) fehlt ·
**Legal-Abnahme steht aus** — dann bleibt das Gate `BLOCKED`, unabhängig vom technischen Ergebnis.

**Waiver Policy** — **Nicht waivable** für normalen Lead-Verlust und für die fehlende Legal-Abnahme.
Waivable allenfalls für nachrangige Komfortfunktionen (z. B. Detailtiefe des Monitorings), befristet
und mit manueller Kontrolle.

**Verification Timing** — ab `AP22` in CI; verbindlich im RC (`AP30`); Betriebsnachweis erneut in `AP31`.

**Result:** `NOT_RUN` — **Sign-off:** offen (`TOE`, Datum, SHA · Legal-Vermerk `LPA`)

---

### Gate 4 — SEO Gate

| Feld                       | Inhalt                                                                                     |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| **Purpose**                | Nachweisen, dass URL-, Status-, Canonical- und Indexierungssemantik durchgängig wahr sind. |
| **Accountable Owner Role** | `SEO`                                                                                      |
| **Supporting Roles**       | `TOE` (HTTP/Routing) · `LPA` (Legal-Indexierung) · `PBO` (Consumer-Sichtbarkeit)           |
| **Relevant Decisions**     | `DEC-RL-006` · `REST-03` · `DEC-RL-001`                                                    |
| **Relevant APs**           | AP09 · AP10 (Eigentümer) · AP21 · AP29 · AP20 · AP27                                       |
| **Relevant PTs**           | `PT09.1` · `PT09.2` · `PT09.5` · `PT10.1` · `PT10.3` · `PT10.4` · `PT29.2` · `PT27.5`      |
| **Prerequisites**          | `HB-03` erfüllt (Route Registry und Known Paths stehen vor routenlastiger Expansion).      |
| **Relevante Risiken**      | `RISK-002` · `RISK-013` (primär) · `RISK-007`                                              |

**Machine Evidence**

- HTTP-Status-Regression: `/services*` echte 301, echte 404 ohne falschen Canonical, 200 wo erwartet;
- Sitemap-Vollständigkeit und -Korrektheit; `lastmod` gegen tatsächliche Änderung geprüft;
- Canonical-/hreflang-Konsistenz über alle 10 Sprachen;
- Abgleich Route Registry ↔ `KNOWN_PATHS` (Divergenz = Fehlschlag);
- Scan auf Preview-/Staging-Domains im produktiven SEO-Surface;
- Scan auf widersprüchliche `noindex`-/Sitemap-Zustände.

**Manual Evidence**

- `SEO` prüft Indexierungslogik und interne Verlinkung stichprobenhaft;
- `LPA` bestätigt die Auflösung des Legal-Indexierungswiderspruchs;
- Structured Data manuell gegen die ausgelieferte Realität geprüft.

**Expected Artifacts**

- Status-Matrix je Route; Sitemap-Diff; hreflang-/Canonical-Report; Crawl-Report vor Go-live
  (`AP29`); Legal-Vermerk.

**PASS** — Consumer × 10 korrekt indexierbar · Canonical/hreflang/Sitemap korrekt · `/services*` echte
301 · echte 404 ohne falsche Canonicals · Legal-Widerspruch gelöst · `lastmod` ehrlich · keine
Preview-Domains · Registry und `KNOWN_PATHS` deckungsgleich · `SEO` gezeichnet.

**FAIL** — Soft-404 · falscher Canonical auf einer Fehlerseite · fehlende oder überzählige
Sitemap-Einträge · Preview-Domain im Surface · `noindex` bei gleichzeitiger Sitemap-Listung ·
Registry-Divergenz.

**BLOCKED** — Route Registry noch nicht kanonisch · Crawl-Umgebung nicht verfügbar · Legal-Bewertung
zur Indexierung steht aus.

**Waiver Policy** — Waivable nur für **nachrangige** Einzelrouten mit befristetem Fix und ohne
Indexierungsschaden. **Nicht waivable:** Consumer-Indexierbarkeit (`DEC-RL-006`), echte 301/404,
Preview-Domains im Surface.

**Verification Timing** — laufend ab `AP10`; vollständiger Crawl in `AP29`; Livecheck nach Go-live (`AP31`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`SEO`, Datum, SHA)

---

### Gate 5 — Chat Gate

| Feld                       | Inhalt                                                                                                                    |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass keine produktive Chat-Abhängigkeit mehr existiert — weder im Code noch im Netzverhalten noch in der CSP. |
| **Accountable Owner Role** | `TOE`                                                                                                                     |
| **Supporting Roles**       | `PTA` (Netzverhalten) · `OTO` (CSP/Betrieb) · `PBO` (Produktentscheidung)                                                 |
| **Relevant Decisions**     | `DEC-RL-007`                                                                                                              |
| **Relevant APs**           | AP22 · AP26 · AP06 (Eigentümer laut `QUALITY-GATES.md` §12) · AP27                                                        |
| **Relevant PTs**           | `PT22.7` · `PT26.2` · `PT06.4` · `PT27.4`                                                                                 |
| **Prerequisites**          | Chat-Entfernung abgeschlossen **vor** CSP-Finalisierung (Master-Scope §7).                                                |
| **Relevante Risiken**      | `RISK-006`                                                                                                                |

**Machine Evidence**

- Netzwerk-E2E: kein Request an eine Chat-Drittanbieter-Domain in irgendeinem Consent-Zustand;
- statischer Scan: kein ChatWidget-/HiHuman-Loader im Bundle;
- Routen-Check: `/api/chat` liefert keine produktive Antwort mehr (entfernt);
- CSP-Diff: keine Chat-Domain in der ausgelieferten Policy.

**Manual Evidence**

- `PBO` bestätigt, dass kein Chat-Einstiegspunkt in der Oberfläche verbleibt;
- `OTO` bestätigt die produktive CSP.

**Expected Artifacts**

- Bundle-Scan-Report; Netzwerk-Trace; CSP-Header-Dump aus der Zielumgebung; Routen-Statusnachweis.

**PASS** — kein ChatWidget/HiHuman lädt · `/api/chat` entfernt · CSP ohne Chat-Domains · keine
produktive Chat-Abhängigkeit · `TOE` gezeichnet.

**FAIL** — ein Chat-Skript lädt (auch nur bedingt) · `/api/chat` antwortet produktiv · eine Chat-Domain
steht noch in der CSP oder Allowlist.

**BLOCKED** — CSP noch nicht finalisiert · Zielumgebung für den Header-Nachweis nicht verfügbar.

**Waiver Policy** — **Nicht waivable.** `DEC-RL-007` ist ein Decision Lock; eine Ausnahme wäre ein
Scope Change über `SCOPE-CHANGELOG.md`.

**Verification Timing** — nach `PT22.7`; erneut bei CSP-Finalisierung (`AP26`) und im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`TOE`, Datum, SHA)

---

### Gate 6 — Epigenetics Gate

| Feld                       | Inhalt                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass Epigenetik als eigenständige Geschäftssäule mit eigener Journey und eigener CRM-Zuordnung existiert. |
| **Accountable Owner Role** | `PBO`                                                                                                                 |
| **Supporting Roles**       | `TOE` (Inquiry/CRM) · `SEO` (IA/Canonical) · `LPA` (Pflichthinweise) · `QAA` (E2E)                                    |
| **Relevant Decisions**     | `DEC-RL-005` · `DEC-RL-011` · `DEC-RL-001`                                                                            |
| **Relevant APs**           | AP15 · AP16 (Eigentümer) · AP06 · AP22 · AP11                                                                         |
| **Relevant PTs**           | `PT15.1` · `PT15.3` · `PT15.4` · `PT15.6` · `PT15.7` · `PT16.4` · `PT06.1` · `PT22.6`                                 |
| **Prerequisites**          | `HB-08` erfüllt (IA vor Inquiry); `HB-05` erfüllt (Lead-Fundament); `HB-02` erfüllt (`PT15.2`-Import).                |
| **Relevante Risiken**      | `RISK-011` (primär) · `RISK-015` (primär) · `RISK-005`                                                                |

**Machine Evidence**

- Routen-/Abdeckungscheck: Hub + drei Vertiefungen + sechs Musterbefunde × 10 Sprachen;
- E2E Golden Path der Epigenetik-Inquiry bis zum CRM-Testadapter;
- Nachweis, dass Source-/Panel-/Campaign-Kontext im Lead ankommt und nicht leer ist;
- Navigationscheck: eigenständiger Haupt-Navigationseintrag und Homepage-Rolle vorhanden.

**Manual Evidence**

- `PBO` nimmt die Säulen-Wirkung ab (Navigation, Homepage-Rolle, Journey-Verständlichkeit);
- `LPA` prüft die regulatorischen Pflichthinweise auf allen Panels und Vertiefungen, in allen Sprachen;
- `SEO` prüft Hub-Canonicals und interne Verlinkung.

**Expected Artifacts**

- Abdeckungsmatrix Seite × Sprache; E2E-Trace des Golden Path; CRM-Feldnachweis;
  Pflichthinweis-Checkliste mit Legal-Vermerk.

**PASS** — eigenständige Hauptnavigation und Homepage-Rolle · Hub + 3 + 6 × 10 vollständig · eigene
Inquiry Journey lauffähig · CRM-/Source-/Panel-Kontext korrekt · E2E Golden Path grün ·
Pflichthinweise vollständig · `PBO` gezeichnet.

**FAIL** — Epigenetik erscheint als Diagnostik-Unterpunkt · eine Vertiefung oder ein Musterbefund fehlt
in einer Sprache · Inquiry ohne eigene CRM-Zuordnung · Panel-/Source-Kontext leer · ein Pflichthinweis
fehlt.

**BLOCKED** — IA noch nicht stabil (`HB-08` offen) · Lead-Fundament fehlt · Legal-Prüfung der Hinweise
steht aus.

**Waiver Policy** — Waivable nur für **einzelne nachrangige** Inhaltsdetails, befristet. **Nicht
waivable:** die Eigenständigkeit der Säule (`DEC-RL-005`), die eigene Inquiry (`DEC-RL-011`) und
fehlende regulatorische Pflichthinweise.

**Verification Timing** — nach `AP15`/`AP16`; verbindlich im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA · Legal-Vermerk `LPA`)

---

### Gate 7 — Content Claim Gate

| Feld                       | Inhalt                                                                                                |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass der Produktclaim `CV < 2 %` über alle Ausgabekanäle **konsistent** ausgespielt wird. |
| **Accountable Owner Role** | `PBO`                                                                                                 |
| **Supporting Roles**       | `TOE` (Konsistenz-Guard) · `SEO` (Structured Data) · `LPA` (Claim-Darstellung)                        |
| **Relevant Decisions**     | `DEC-RL-008`                                                                                          |
| **Relevant APs**           | AP14 (Eigentümer) · AP04 · AP08 · AP09 · AP27                                                         |
| **Relevant PTs**           | `PT14.4` · `PT08.3` · `PT09.4` · `PT27.5`                                                             |
| **Prerequisites**          | i18n-Parität (`HB-07`) für die Locale-Prüfung.                                                        |
| **Relevante Risiken**      | `RISK-001` (primär, `ACCEPTED`) · `RISK-015`                                                          |

> **Verbindliche Klarstellung:** Dieses Gate prüft **Konsistenz der Ausspielung**, nicht die
> Richtigkeit des Claims. `CV < 2 %` ist eine bestätigte Produkt-/Content-Entscheidung. Ein `PASS`
> bedeutet **nicht** und darf nicht so dargestellt werden, dass das Repository, ein Test oder dieses
> Gate den Claim wissenschaftlich validiert oder unabhängig bestätigt hätte.

**Machine Evidence**

- Konsistenz-Guard über **Code · alle 10 Locales · Structured Data**: identischer Wert;
- Negativcheck: kein `<5 %`-Rollback an irgendeiner Fundstelle;
- Schreibweisen-Check (einheitliche Darstellung des Claims).

**Manual Evidence**

- `PBO` prüft die relevanten PDFs und generierten Dokumente (maschinell nur eingeschränkt prüfbar);
- `LPA` prüft, dass die Claim-Darstellung keine Validierungsbehauptung enthält;
- Bestätigung, dass der Risk-Register-Vermerk (`RISK-001`) erhalten ist.

**Expected Artifacts**

- Fundstellen-Report über alle vier Ausgabekanäle; Negativcheck-Report; PDF-Prüfprotokoll;
  Verweis auf `RISK-001`.

**PASS** — `CV < 2 %` identisch in Code, 10 Locales, Structured Data und relevanten PDFs ·
Risk-Register-Vermerk vorhanden · kein `<5 %`-Rollback · keine Validierungsbehauptung ·
`PBO` gezeichnet.

**FAIL** — abweichender Wert in einem Kanal · ein `<5 %`-Vorkommen im produktiven Surface · ein Artefakt
stellt den Claim als wissenschaftlich validiert dar.

**BLOCKED** — PDFs liegen in der Prüffassung nicht vor · Konsistenz-Guard existiert noch nicht.

**Waiver Policy** — Waivable **nicht** für die Wertkonsistenz. Waivable allenfalls für rein
typografische Vereinheitlichung, befristet und ohne Bedeutungsunterschied.

**Verification Timing** — ab `AP14`; erneut bei jedem PDF-Austausch; verbindlich im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA)

---

### Gate 8 — CTA Gate

| Feld                       | Inhalt                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass das entfernte site-weite „garantierte Performance"-Band nicht zurückkehrt — auch nicht als Ersatz. |
| **Accountable Owner Role** | `PBO`                                                                                                               |
| **Supporting Roles**       | `TOE` (Negativcheck) · `QAA` (Visual Regression)                                                                    |
| **Relevant Decisions**     | `DEC-RL-012`                                                                                                        |
| **Relevant APs**           | AP06 (Eigentümer) · AP01 · AP11 · AP27 · AP30                                                                       |
| **Relevant PTs**           | `PT06.3` · `PT01.2` · `PT11.5` · `PT27.5`                                                                           |
| **Prerequisites**          | `HB-02` erfüllt (Import-Hygiene steht, bevor aus `main` importiert wird).                                           |
| **Relevante Risiken**      | `RISK-003` (primär) · `RISK-002`                                                                                    |

**Machine Evidence**

- Negativcheck im Build/Bundle auf das Band-Markup und dessen Textbausteine;
- Visual Regression auf Header-/Footer-/Homepage-Bereichen gegen die freigegebene Referenz;
- Import-Diff-Prüfung bei jedem `main`-Import (bringt der Import Band-Markup zurück?).

**Manual Evidence**

- `PBO` bestätigt, dass **kein Ersatzband** mit vergleichbarer Zusage eingeführt wurde —
  die maschinelle Prüfung erkennt Neuformulierungen nicht zuverlässig;
- Sichtprüfung der Layoutlösung an der Stelle des entfernten Bands.

**Expected Artifacts**

- Negativcheck-Report; Visual-Diff-Artefakte; Import-Review-Vermerk; Sichtprüfungsprotokoll.

**PASS** — das alte site-weite Band wird nicht ausgeliefert · `main`-Import bringt es nicht zurück ·
kein Ersatzband zur Layout-Erhaltung · `PBO` gezeichnet.

**FAIL** — das Band ist wieder im Surface · ein neues site-weites Zusagen-Band ist eingeführt ·
ein Import hat Band-Markup reaktiviert.

**BLOCKED** — Visual-Regression-Referenz fehlt · Negativcheck noch nicht implementiert.

**Waiver Policy** — **Nicht waivable.** `DEC-RL-012` schließt sowohl Rückkehr als auch Ersatz aus.

**Verification Timing** — bei **jedem** `main`-Import; laufend in CI; verbindlich im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA)

---

### Gate 9 — Naming Gate

| Feld                       | Inhalt                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass der allgemeine Anfrageweg site-weit und in allen Sprachen einheitlich „Angebot anfragen" heißt. |
| **Accountable Owner Role** | `PBO`                                                                                                            |
| **Supporting Roles**       | `TOE` (i18n-Umsetzung) · `SEO` (Sichtbarkeit) · `QAA`                                                            |
| **Relevant Decisions**     | `DEC-RL-013` · `DEC-RL-001`                                                                                      |
| **Relevant APs**           | AP04 · AP08 (Eigentümer) · AP11 · AP13 · AP20                                                                    |
| **Relevant PTs**           | `PT08.5` · `PT11.5` · `PT13.4` · `PT20.2`                                                                        |
| **Prerequisites**          | i18n-Fundament (`HB-07`); CTA-Inventar aus `AP04` vorhanden.                                                     |
| **Relevante Risiken**      | `RISK-005`                                                                                                       |

**Machine Evidence**

- Inventar aller CTA-Beschriftungen im Surface, gruppiert nach Ziel-Journey;
- Locale-Check: lokalisierte Entsprechung in allen 10 Sprachen vorhanden und gepflegt;
- Abweichungsliste gegen den definierten Standard-CTA.

**Manual Evidence**

- `PBO` bestätigt jede **fachliche Ausnahme** (z. B. Support, Consumer Order) einzeln und begründet —
  eine Ausnahme ist zulässig, aber nie stillschweigend;
- sprachliche Angemessenheit der Lokalisierungen stichprobenhaft geprüft.

**Expected Artifacts**

- CTA-Inventar mit Soll/Ist; Ausnahmeliste mit Begründung und Freigabevermerk; Locale-Abdeckungsreport.

**PASS** — allgemeiner Anfrage-CTA heißt „Angebot anfragen" · lokalisiert × 10 · fachliche Ausnahmen
bewusst benannt und freigegeben · `PBO` gezeichnet.

**FAIL** — abweichende Benennung des allgemeinen Anfragewegs · fehlende Lokalisierung in einer Sprache ·
eine undokumentierte Ausnahme.

**BLOCKED** — CTA-Inventar liegt nicht vor · Übersetzungen fehlen zur Prüfung.

**Waiver Policy** — Waivable nur für **einzelne** nachrangige Oberflächen mit befristeter Korrektur.
Nicht waivable für die primären Conversion-Pfade.

**Verification Timing** — nach `AP08`/`AP11`; verbindlich im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA)

---

### Gate 10 — Lead-Magnet Gate

| Feld                       | Inhalt                                                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass mindestens ein gated Secondary-Conversion-Pfad produktiv vollständig und nicht trivial umgehbar ist. |
| **Accountable Owner Role** | `PBO`                                                                                                                 |
| **Supporting Roles**       | `TOE` (Auslieferung/Gating) · `PTA` (Consent) · `LPA` (Verarbeitung) · `OTO` (Zustellung)                             |
| **Relevant Decisions**     | `DEC-RL-014` · `DEC-RL-009` · `REST-02`                                                                               |
| **Relevant APs**           | AP19 (Eigentümer) · AP22 · AP26 · AP11 · AP27                                                                         |
| **Relevant PTs**           | `PT19.1` · `PT19.3` · `PT19.4` · `PT19.5` · `PT22.1` · `PT11.5`                                                       |
| **Prerequisites**          | `HB-05` (Lead-Fundament) · `HB-04` (Consent) · `HB-06` (Betrieb) erfüllt.                                             |
| **Relevante Risiken**      | `RISK-012` (primär) · `RISK-004`                                                                                      |

**Machine Evidence**

- E2E des gesamten gated Pfads: Gate → Consent → Persistenz → CRM → Zustellung;
- **Umgehungstest**: das gegatete Asset ist nicht über eine direkte öffentliche URL abrufbar;
- Abuse-Protection-Test (Rate Limiting / Missbrauchsschutz greift);
- Tracking-Nachweis: Conversion-Event erst nach Consent;
- i18n- und a11y-Prüfung der Gate-Strecke.

**Manual Evidence**

- `PBO` legt fest und bestätigt, **welche** Assets gegated sind und welche bewusst öffentlich bleiben;
- `LPA` nimmt den Verarbeitungspfad des Lead Magnets ab;
- Zustellung (Mail/Download) manuell verifiziert.

**Expected Artifacts**

- E2E-Trace des Golden Path; Umgehungstest-Report; Download-Inventar mit Gating-Status;
  Zustellnachweis; Legal-Vermerk.

**PASS** — mindestens ein gated Pfad produktiv vollständig · Gate, Consent, Persistenz, CRM,
Zustellung, Abuse Protection, Tracking, i18n und a11y getestet · Asset nicht trivial am Gate vorbei
abrufbar · `PBO` gezeichnet.

**FAIL** — das Asset ist über eine direkte URL erreichbar · Consent wird umgangen · der Lead wird nicht
persistiert · Zustellung schlägt fehl · kein Missbrauchsschutz.

**BLOCKED** — Lead-Plattform noch nicht vorhanden · **Legal-Abnahme des Verarbeitungspfads steht aus**.

**Waiver Policy** — **Nicht waivable** für die Umgehbarkeit des Gates und für die fehlende
Legal-Abnahme. Waivable für den Umfang des Asset-Portfolios (weniger gegatete Assets), sofern
mindestens ein vollständiger Pfad steht (`DEC-RL-014`).

**Verification Timing** — nach `AP19`; verbindlich im RC (`AP30`); Zustellnachweis erneut nach Go-live.

**Result:** `NOT_RUN` — **Sign-off:** offen (`PBO`, Datum, SHA · Legal-Vermerk `LPA`)

---

### Gate 11 — Accessibility Gate

| Feld                       | Inhalt                                                                            |
| -------------------------- | --------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen — nicht behaupten — dass WCAG 2.2 AA für die Kernpfade erfüllt ist.    |
| **Accountable Owner Role** | `QAA`                                                                             |
| **Supporting Roles**       | `TOE` (Umsetzung) · `PBO` (Kernpfad-Definition)                                   |
| **Relevant Decisions**     | keiner direkt — eigenständige Qualitätszusage (`MASTER-SCOPE.md` §1.2 Prinzip 20) |
| **Relevant APs**           | AP24 (Eigentümer) · AP27 · AP16 · AP06 · AP05                                     |
| **Relevant PTs**           | `PT24.6` · `PT27.6` · `PT16.4` · `PT06.5` · `PT05.5`                              |
| **Prerequisites**          | Kernpfade definiert (`AP03`); Design-System stabil (`AP05`).                      |
| **Relevante Risiken**      | `RISK-014` (primär) · `RISK-008`                                                  |

**Machine Evidence**

- automatisierte a11y-Prüfung (axe/Playwright) über die Kernrouten, grün, SHA-gebunden;
- Struktur-Checks: Skip-Link vorhanden, genau ein `<main>`, Heading-Hierarchie;
- Kontrast-Prüfung gegen die Design-Tokens.

**Manual Evidence**

- Tastatur-Durchlauf der Kernpfade inkl. Dialoge/Modals (Fokusfalle, Fokusrückgabe, Escape);
- Screenreader-Basisprüfung;
- Charts der Musterbefunde: textliche Alternative inhaltlich geprüft (nicht nur vorhanden);
- Reduced-Motion-Verhalten geprüft.

**Expected Artifacts**

- axe-/Playwright-Report; manuelle A11y-Checkliste mit Datum und Rolle; Befundliste mit Schweregrad.

**PASS** — WCAG 2.2 AA für Kernpfade nachgewiesen · Skip-Link und `<main>` · Dialog/Fokus/Tastatur
korrekt · Charts mit inhaltlich tragfähiger Textalternative · automatisierte Prüfung grün · keine
bekannten kritischen A11y-Blocker · `QAA` gezeichnet.

**FAIL** — die automatisierte Prüfung ist rot · ein kritischer Blocker auf einem Kernpfad ·
eine Fokusfalle · ein Chart ohne Textalternative.

**BLOCKED** — a11y-Automation existiert nicht oder ist nicht reproduzierbar · Kernpfade nicht definiert.

**Waiver Policy** — Waivable nur für **einzelne nicht-kritische** AA-Befunde auf nachrangigen Seiten,
befristet, mit dokumentiertem Restrisiko. **Nicht waivable:** kritische Blocker auf Kernpfaden und ein
fehlender automatisierter Nachweis.

**Verification Timing** — laufend in CI ab `AP24`; verbindlich im RC (`AP30`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`QAA`, Datum, SHA)

---

### Gate 12 — Operations/Security Gate

| Feld                       | Inhalt                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Purpose**                | Nachweisen, dass der Produktionsstack sicher betreibbar, überwachbar, wiederherstellbar und rollbackfähig ist. |
| **Accountable Owner Role** | `OTO`                                                                                                          |
| **Supporting Roles**       | `TOE` (Stack/Build) · `PTA` (CSP/Allowlist) · `LPA` (Datenhaltung)                                             |
| **Relevant Decisions**     | `REST-01` · `DEC-RL-009` · `DEC-RL-007` (CSP ohne Chat-Domains)                                                |
| **Relevant APs**           | AP26 · AP28 (Eigentümer) · AP31 · AP32                                                                         |
| **Relevant PTs**           | `PT28.2` · `PT28.3` · `PT28.4` · `PT28.5` · `PT28.6` · `PT26.3` · `PT31.3`                                     |
| **Prerequisites**          | `HB-06` erfüllt; Zielumgebung verfügbar.                                                                       |
| **Relevante Risiken**      | `RISK-009` (primär) · `RISK-007` (primär) · `RISK-004`                                                         |

**Machine Evidence**

- Healthcheck-Status aller Services im Compose-Stack;
- Security-Header-/CSP-Dump aus der Zielumgebung (HSTS, CSP produktionsreif);
- automatisierter Scan: **keine Secret-Werte** in Images, Logs oder Repository;
- Deployment- und Rollback-Lauf gegen ein früheres Image, protokolliert;
- Monitoring-/Alert-Auslösung bei simuliertem CRM-/Queue-/Mail-Fehler.

**Manual Evidence**

- **Backup-Restore tatsächlich durchgeführt** und durch `OTO` bestätigt — eine definierte Prozedur
  ohne durchgeführten Restore genügt nicht;
- Bestätigung der Environment-Isolation und der `DRY_RUN`-Wirksamkeit in Preview/Staging;
- `LPA` bestätigt die Datenhaltung persistenter Lead-Daten.

**Expected Artifacts**

- Healthcheck-Ausgabe; Header-/CSP-Dump; Restore-Protokoll mit Zeitstempel; Rollback-Protokoll;
  Alert-Nachweis; Secret-Scan-Report.

**PASS** — Docker/Compose-Stack health-geprüft · Secrets außerhalb Images und Repo ·
HSTS/Security-Header/CSP produktionsreif · Backup-Restore **nachgewiesen** · image-basiertes Rollback
getestet · CRM-/Queue-/Mail-Fehler sichtbar · `OTO` gezeichnet.

**FAIL** — ein Healthcheck bleibt rot · ein Secret liegt im Image, Log oder Repository · Restore
schlägt fehl · Rollback nicht durchführbar · Fehler bleiben unsichtbar.

**BLOCKED** — Zielumgebung nicht verfügbar · Backup-Ziel nicht eingerichtet · Rollback-Image fehlt.

**Waiver Policy** — **Nicht waivable:** Secrets außerhalb Images, nachgewiesener Restore, getestetes
Rollback. Waivable allenfalls die Ausbaustufe des Monitorings, befristet und mit manueller Kontrolle.

**Verification Timing** — ab `AP28`; verbindlich im RC (`AP30`); erneut beim Cutover (`AP31`) und in
der Stabilisierung (`AP32`).

**Result:** `NOT_RUN` — **Sign-off:** offen (`OTO`, Datum, SHA)

---

## 7. Abnahmeübersicht und finaler Sign-off

### 7.1 Gate-Status

| #   | Gate                | Accountable | Domäne | Result    | Sign-off |
| --- | ------------------- | ----------- | ------ | --------- | -------- |
| 1   | Language            | `PBO`       | A      | `NOT_RUN` | offen    |
| 2   | Consent             | `PTA`       | D      | `NOT_RUN` | offen    |
| 3   | CRM                 | `TOE`       | B · E  | `NOT_RUN` | offen    |
| 4   | SEO                 | `SEO`       | C      | `NOT_RUN` | offen    |
| 5   | Chat                | `TOE`       | B · D  | `NOT_RUN` | offen    |
| 6   | Epigenetics         | `PBO`       | A      | `NOT_RUN` | offen    |
| 7   | Content Claim       | `PBO`       | A      | `NOT_RUN` | offen    |
| 8   | CTA                 | `PBO`       | A      | `NOT_RUN` | offen    |
| 9   | Naming              | `PBO`       | A      | `NOT_RUN` | offen    |
| 10  | Lead-Magnet         | `PBO`       | A · E  | `NOT_RUN` | offen    |
| 11  | Accessibility       | `QAA`       | F      | `NOT_RUN` | offen    |
| 12  | Operations/Security | `OTO`       | G      | `NOT_RUN` | offen    |

**Gates: 12/12 · Accountable Roles: 12/12 · abgenommen: 0/12.**

### 7.2 Domänen-Sign-off

| Domäne                                   | Accountable | Status |
| ---------------------------------------- | ----------- | ------ |
| DOMAIN-A Product/Business                | `PBO`       | offen  |
| DOMAIN-B Engineering/Architecture        | `TOE`       | offen  |
| DOMAIN-C SEO                             | `SEO`       | offen  |
| DOMAIN-D Consent/Tracking/Privacy        | `PTA`       | offen  |
| DOMAIN-E Legal/Privacy neuer Datenflüsse | `LPA`       | offen  |
| DOMAIN-F Quality/Accessibility           | `QAA`       | offen  |
| DOMAIN-G Operations                      | `OTO`       | offen  |

### 7.3 Finale Release-Freigabe

**Verantwortlich für den finalen Sign-off:** `PBO` — auf Grundlage der sieben Domänen-Abnahmen.

`PBO` darf **nicht** über eine fehlende Domänen-Abnahme hinweg freigeben. Insbesondere ersetzt die
Freigabe durch `PBO` **keine** ausstehende Abnahme durch `LPA`.

Die Freigabe erfordert:

1. alle zwölf Gates auf `PASS` — oder mit einem nach §5 wirksamen Waiver;
2. alle sieben Domänen abgenommen;
3. **kein** offener `BLOCKED`-Zustand;
4. eingefrorener Commit-SHA des Release Candidate (`AP30 PT30.5`);
5. Rollback-Fähigkeit nachgewiesen (Gate 12).

**Freigabevermerk:** Rolle · Datum · Release-SHA · Liste wirksamer Waiver · Unterschrift/Bestätigung.

---

## 8. Waiver-Register

**Derzeit keine wirksamen Waiver.**

Neue Einträge nach der Struktur aus §5.1:

```md
### WV-00X — <Gate n> · <Kriterium>

- Datum · Gate · betroffenes Kriterium
- Begründung
- Restrisiko (Verweis auf RISK-ID)
- Kompensierende Maßnahme
- Befristung (Zieltermin oder Ziel-AP)
- Bestätigt durch: <accountable Rolle des Gates> + PBO [+ LPA bei Rechtsbezug]
```

---

## 9. Pflege dieses Dokuments

1. **Ergebnisfelder fortschreiben**, sobald ein Gate geprüft wurde — inklusive SHA und Datum.
2. **Ein Gate fällt auf `NOT_RUN` zurück**, wenn sich der geprüfte Gegenstand nach der Prüfung ändert.
3. **Kriterien werden hier nicht geändert.** Sie stehen in `MASTER-SCOPE.md` §8 und
   `QUALITY-GATES.md` §12; eine Änderung dort ist ein Scope Change (`SCOPE-CHANGELOG.md`).
4. **Rollen bleiben Rollen.** Keine Personennamen in diesem Dokument.
5. **Kein Gate wird durch Zeitdruck umgedeutet.** `BLOCKED` bleibt `BLOCKED`, bis die Vorbedingung
   oder die externe Abnahme vorliegt.
6. **Keine Gate-Implementierung gilt als erledigt, solange ihr Ergebnisfeld `NOT_RUN` ist** — auch
   dann nicht, wenn das zuständige AP als abgeschlossen gemeldet wurde.
