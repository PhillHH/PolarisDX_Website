# CONTEXT-INDEX — kanonische Kontext-Routing-Matrix

**Zweck:** Diese Datei sagt einem Agenten, **welche Dokumente er für den aktuellen Primärtask lesen muss** —
und welche nicht.

Sie enthält **kein** Projektwissen. Sie dupliziert weder Scope noch Decisions noch Contract-Inhalte.
Sie ist ausschließlich eine Routing-Matrix.

**Kernregel:** Ein normaler Primärtask liest **nicht** pauschal alle `building-docs`.
Er liest `ALWAYS_READ` + den `Required context` seines Arbeitspakets. Alles Weitere nur bei konkretem Bedarf.

---

## 1. Pipeline

```text
GLOBAL RULES            AGENT-CONTRACT.md
      ↓
PROJECT DECISIONS       PROJECT-CONSTRAINTS.md
      ↓
MASTER SCOPE            scope/MASTER-SCOPE.md   (relevante Abschnitte)
      ↓
CURRENT WORK PACKAGE    work-packages/<CURRENT_AP>.md
      ↓
GLOBAL AP STATE         state/AP-STATE.md
      ↓
ONLY RELEVANT CONTRACTS siehe Matrix in §4
      ↓
CURRENT PRIMARY TASK    der konkrete PT-Prompt
```

---

## 2. ALWAYS_READ

Für **jeden** Primärtask, in dieser Reihenfolge:

```text
building-docs/AGENT-CONTRACT.md
building-docs/PROJECT-CONSTRAINTS.md
building-docs/scope/MASTER-SCOPE.md
building-docs/work-packages/<CURRENT_AP>.md
building-docs/state/AP-STATE.md
```

### 2.1 MASTER-SCOPE gezielt lesen

`scope/MASTER-SCOPE.md` ist ~2.300 Zeilen und wird **nicht** bei jedem Task Wort für Wort neu verarbeitet.

Pflichtabschnitte für jeden Primärtask:

| Abschnitt                    | Inhalt                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| `§0.2` / `§0.2.1` / `§0.2.2` | Decision Lock, „nicht wieder öffnen", Backlog-Abgrenzung   |
| `§1`                         | Projektleitplanken                                         |
| `§2`                         | Globale Definition of Done                                 |
| `# AP<xx>`                   | der Abschnitt des **aktuellen** Arbeitspakets, vollständig |
| `§7`                         | kritische Abhängigkeitslogik                               |
| `§8`                         | Launch-Gates, soweit das aktuelle AP eines berührt         |

Optional nach Bedarf: `§3` Phasenmodell · `§4` Querschnittsmatrix · `§5` Altlasten ·
`§6` Ausführungsreihenfolge · `§9` Ticket-Template · `§10` Projektartefakte.

Unterstützt das Werkzeug gezieltes Lesen nach Überschrift oder Zeilenbereich, ist dieses zu bevorzugen
(`grep -n '^#' scope/MASTER-SCOPE.md`, dann `sed -n '<von>,<bis>p'`).

---

## 3. Autoritätsreihenfolge

```text
1. AGENT-CONTRACT.md
   Sicherheits-/Execution-Regeln

2. PROJECT-CONSTRAINTS.md
   bestätigte Product-/Decision Locks

3. scope/MASTER-SCOPE.md
   projektweiter Scope und Delivery-Ziel

4. work-packages/APxx.md
   operative Detailanforderungen des Arbeitspakets

5. fachlich relevante *-CONTRACT.md
   technische Invarianten

6. state/AP-STATE.md
   aktueller serieller Handoff

7. aktueller PT-Prompt
   konkret auszuführender Arbeitsschritt

8. Repository-Evidenz
   bestimmt den Ist-Zustand
```

**Regeln dazu:**

- **Repository-Evidenz darf eine bestätigte Product Decision nicht überschreiben.** Sie kann nur zeigen,
  dass der Ist-Zustand der Entscheidung noch nicht entspricht.
- **Ein AP-Dokument darf den Master-Scope nicht stillschweigend erweitern oder reduzieren.**
- Ein Contract darf einen Decision Lock nicht aufweichen; kollidieren beide, ist das ein
  `BLOCKED_DECISION_CONFLICT` und wird dokumentiert, nicht geraten.
- `state/AP-STATE.md` ist Zustand, keine Autorität.
- Die inhaltliche Quellenhierarchie (Master-Scope › Constraints › Repo-Evidenz › Branch-Map ›
  Repo-Baseline › historische Doku) steht unverändert in `PROJECT-CONSTRAINTS.md`.

---

## 4. CONTRACT_READ — Matrix AP00–AP33

Zusätzlich zu `ALWAYS_READ`. Kurznamen ohne `.md`; alle Dateien liegen im Root von `building-docs/`.

| AP       | Titel                                                      | Required context                                                                                                                 | Optional context                                                                                    | Grund                                                                                               |
| -------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **AP00** | Programmsteuerung, Scope Lock, Delivery Governance         | _(nur ALWAYS_READ)_                                                                                                              | REPO-BASELINE · QUALITY-GATES                                                                       | Reine Governance, kein Code-Fußabdruck; Contracts werden nur referenziert, nicht angewendet.        |
| **AP01** | Repository-Baseline, Branch-Reconciliation, Import-Hygiene | REPO-BASELINE · BRANCH-RECONCILIATION-MAP · QUALITY-GATES · ROUTING-CONTRACT · RUNTIME-CONTRACT                                  | DEPLOYMENT-CONTRACT · NETWORK-ALLOWLIST                                                             | Selektive Imports dürfen Baseline-Route-, Runtime- und Gate-Härtungen nicht regressieren.           |
| **AP02** | Zielarchitektur: SSR, Routing, Lead Platform, Betrieb      | RUNTIME-CONTRACT · ROUTING-CONTRACT · BACKEND-API-CONTRACT · LEAD-DATA-CONTRACT · DEPLOYMENT-CONTRACT · CONTENT-ASSET-CONTRACT   | SEO-CONTRACT · CRM-INTEGRATION · LEAD-DELIVERY-CONTRACT · REPO-BASELINE                             | Zielbild muss alle vier Architekturachsen konsistent zu den bestehenden Invarianten festschreiben.  |
| **AP03** | Informationsarchitektur und Seiteninventar                 | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · IA-INVENTORY                                                                   | REPO-BASELINE · QUALITY-GATES                                                                       | Inventar, Seitentypen und Navigation hängen an Route-Registry, Canonical-Regeln und 10 Sprachen.    |
| **AP04** | Content-Strategie, Content-Modell, Launch-Readiness        | I18N-CONTRACT · SEO-CONTRACT · CONTENT-ASSET-CONTRACT                                                                            | QUALITY-GATES · ROUTING-CONTRACT · IA-INVENTORY                                                     | Content-Typen und Readiness sind an Sprach- und Metadaten-Parität gebunden.                         |
| **AP05** | Sales-Machine Design-System, Light-Theme                   | QUALITY-GATES                                                                                                                    | BRANCH-RECONCILIATION-MAP · REPO-BASELINE · I18N-CONTRACT                                           | Visual-Regression-/A11y-Gates; `redesign/preview` liefert nur art-direction-neutrale Patterns.      |
| **AP06** | App Shell, Header, Footer, globale Navigation              | ROUTING-CONTRACT · I18N-CONTRACT · QUALITY-GATES                                                                                 | SEO-CONTRACT · BRANCH-RECONCILIATION-MAP · IA-INVENTORY                                             | Header/Footer sind G3-Hotspots mit Route- und Sprachspiegelungen.                                   |
| **AP07** | Suche und interne Findability                              | ROUTING-CONTRACT · I18N-CONTRACT · SEO-CONTRACT                                                                                  | QUALITY-GATES · IA-INVENTORY                                                                        | Suchindex und interne Links müssen Routen- und Sprachwahrheit abbilden.                             |
| **AP08** | Internationalisierung, 10 Sprachen                         | I18N-CONTRACT · SEO-CONTRACT · ROUTING-CONTRACT                                                                                  | QUALITY-GATES · RUNTIME-CONTRACT · CONTENT-ASSET-CONTRACT                                           | Namespace-/Key-Parität, hreflang und Sprachrouten sind manuell gespiegelt.                          |
| **AP09** | SEO-Plattformgrundlagen                                    | SEO-CONTRACT · ROUTING-CONTRACT · I18N-CONTRACT · RUNTIME-CONTRACT                                                               | QUALITY-GATES                                                                                       | SEOHead, Sitemap und Structured Data hängen an Route-Registry und SSR-Semantik.                     |
| **AP10** | Redirect-, URL- und HTTP-Semantik                          | ROUTING-CONTRACT · SEO-CONTRACT · RUNTIME-CONTRACT · QUALITY-GATES                                                               | DEPLOYMENT-CONTRACT · REPO-BASELINE                                                                 | Status-Codes und `KNOWN_PATHS` sind zwischen App und Server gespiegelt.                             |
| **AP11** | Startseite                                                 | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · LEAD-DATA-CONTRACT · TRACKING-CONTRACT                                         | CONSENT-CONTRACT · QUALITY-GATES · BRANCH-RECONCILIATION-MAP                                        | Primary- und Secondary-Conversion inklusive Event-Taxonomie; Garantie-Band darf nicht zurückkehren. |
| **AP12** | Diagnostik-Hub `/diagnostics`                              | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT                                                                                  | TRACKING-CONTRACT · QUALITY-GATES                                                                   | Hub-IA, interne Links und Canonical-Struktur.                                                       |
| **AP13** | Service-Detailseiten (9)                                   | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · LEAD-DATA-CONTRACT                                                             | QUALITY-GATES · TRACKING-CONTRACT                                                                   | Gemeinsames Template mit CTA-/Anfragepfad über alle 9 Seiten und 10 Sprachen.                       |
| **AP14** | IglooPro Produktstrecke                                    | SEO-CONTRACT · I18N-CONTRACT · ROUTING-CONTRACT · LEAD-DATA-CONTRACT                                                             | TRACKING-CONTRACT · QUALITY-GATES · CONTENT-ASSET-CONTRACT                                          | Product Structured Data und Conversion; der CV-Claim steht als Lock in PROJECT-CONSTRAINTS.         |
| **AP15** | Epigenetik als eigenständige Geschäftssäule                | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · LEAD-DATA-CONTRACT · CONSENT-CONTRACT · BRANCH-RECONCILIATION-MAP              | LEAD-DELIVERY-CONTRACT · CRM-INTEGRATION · QUALITY-GATES                                            | Eigene IA + eigene Inquiry-Strecke; PT15.2 importiert selektiv aus `main`.                          |
| **AP16** | Musterbefunde (6 × 10 Sprachen)                            | ROUTING-CONTRACT · I18N-CONTRACT · SEO-CONTRACT · QUALITY-GATES                                                                  | TRACKING-CONTRACT · CONTENT-ASSET-CONTRACT                                                          | Datenmodell/Routing × 10 Sprachen plus A11y-Anforderungen an Charts.                                |
| **AP17** | Artikel-/Knowledge-Bereich                                 | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT                                                                                  | QUALITY-GATES · CONTENT-ASSET-CONTRACT                                                              | Slug-/ID-/Canonical-Konsistenz und Article Structured Data.                                         |
| **AP18** | Events                                                     | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · TRACKING-CONTRACT                                                              | LEAD-DATA-CONTRACT · CONSENT-CONTRACT · CONTENT-ASSET-CONTRACT                                      | Event Structured Data plus Anmelde-/CTA-Messung.                                                    |
| **AP19** | Downloads, Resource Center, Lead-Magnet-Auslieferung       | LEAD-DATA-CONTRACT · LEAD-DELIVERY-CONTRACT · BACKEND-API-CONTRACT · CRM-INTEGRATION · CONSENT-CONTRACT · CONTENT-ASSET-CONTRACT | I18N-CONTRACT · ROUTING-CONTRACT · SEO-CONTRACT · RUNTIME-CONTRACT · IA-INVENTORY                   | Gating ist nur wirksam, wenn Asset-Auslieferung, Persistenz und CRM-Handoff zusammenpassen.         |
| **AP20** | About, Contact, Support, Legal                             | ROUTING-CONTRACT · I18N-CONTRACT · LEAD-DATA-CONTRACT · CONSENT-CONTRACT · SEO-CONTRACT                                          | BACKEND-API-CONTRACT · TRACKING-CONTRACT                                                            | Formularpflichtige Seiten mit eigener Indexierungs-/Datenschutzregel.                               |
| **AP21** | Consumer-Landingpages × 10 Sprachen                        | ROUTING-CONTRACT · SEO-CONTRACT · I18N-CONTRACT · LEAD-DATA-CONTRACT · QUALITY-GATES                                             | CONSENT-CONTRACT · TRACKING-CONTRACT · BACKEND-API-CONTRACT · CONTENT-ASSET-CONTRACT · IA-INVENTORY | Indexierbar (kein `noindex`), sehr hohe Performance-/SEO-Anforderung, Ordering-Pfad.                |
| **AP22** | Lead Platform, Formulare, CRM, Backend-APIs                | BACKEND-API-CONTRACT · LEAD-DATA-CONTRACT · LEAD-DELIVERY-CONTRACT · CRM-INTEGRATION · DEPLOYMENT-CONTRACT · CONSENT-CONTRACT    | NETWORK-ALLOWLIST · RUNTIME-CONTRACT · I18N-CONTRACT · TRACKING-CONTRACT                            | Persistenz, Queue/Retry, CRM-Handoff und `DRY_RUN` hängen unmittelbar zusammen.                     |
| **AP23** | Consent, GTM/GA4, Analytics                                | CONSENT-CONTRACT · TRACKING-CONTRACT · NETWORK-ALLOWLIST · QUALITY-GATES                                                         | RUNTIME-CONTRACT · DEPLOYMENT-CONTRACT                                                              | Vor Consent darf keine Netzaktivität entstehen — messbar nur gegen die Allowlist.                   |
| **AP24** | Accessibility / WCAG                                       | QUALITY-GATES                                                                                                                    | I18N-CONTRACT · ROUTING-CONTRACT                                                                    | AA-Kriterien und automatisierte A11y-Checks.                                                        |
| **AP25** | Performance und Core Web Vitals                            | QUALITY-GATES · RUNTIME-CONTRACT                                                                                                 | NETWORK-ALLOWLIST · DEPLOYMENT-CONTRACT · TRACKING-CONTRACT                                         | Budgets, Rendering-Pfad und Third-Party-Last.                                                       |
| **AP26** | Security Hardening                                         | NETWORK-ALLOWLIST · RUNTIME-CONTRACT · DEPLOYMENT-CONTRACT · BACKEND-API-CONTRACT                                                | CONSENT-CONTRACT · TRACKING-CONTRACT · CRM-INTEGRATION · QUALITY-GATES                              | CSP und Header hängen an der erlaubten Domainmenge und an API-/Secret-Grenzen.                      |
| **AP27** | Teststrategie, Regression, Quality Gates                   | QUALITY-GATES · ROUTING-CONTRACT · SEO-CONTRACT · CONSENT-CONTRACT · TRACKING-CONTRACT                                           | I18N-CONTRACT · RUNTIME-CONTRACT · LEAD-DATA-CONTRACT                                               | Die Gates testen genau diese Verträge; ohne sie ist kein Assert formulierbar.                       |
| **AP28** | Docker/Compose, Environments, Deployment                   | DEPLOYMENT-CONTRACT · RUNTIME-CONTRACT · NETWORK-ALLOWLIST · CRM-INTEGRATION · LEAD-DELIVERY-CONTRACT                            | BACKEND-API-CONTRACT · QUALITY-GATES · REPO-BASELINE                                                | Secrets, Persistenz, Rollback und Zustellwege sind Betriebsverträge.                                |
| **AP29** | SEO-/Content-Migration vor Go-live                         | SEO-CONTRACT · ROUTING-CONTRACT · I18N-CONTRACT · QUALITY-GATES                                                                  | RUNTIME-CONTRACT · DEPLOYMENT-CONTRACT                                                              | Crawl, finale Redirect Map, Sitemap/Robots und Content Freeze.                                      |
| **AP30** | Pre-Launch QA und Release Candidate                        | QUALITY-GATES · ROUTING-CONTRACT · SEO-CONTRACT · CONSENT-CONTRACT · TRACKING-CONTRACT                                           | I18N-CONTRACT · DEPLOYMENT-CONTRACT · LEAD-DATA-CONTRACT                                            | RC-Abnahme prüft funktionale und nonfunktionale Verträge gemeinsam.                                 |
| **AP31** | Go-live, Cutover, Rollback                                 | DEPLOYMENT-CONTRACT · RUNTIME-CONTRACT · ROUTING-CONTRACT · SEO-CONTRACT · CONSENT-CONTRACT · TRACKING-CONTRACT                  | NETWORK-ALLOWLIST · CRM-INTEGRATION · LEAD-DELIVERY-CONTRACT                                        | Runbook, Smoke-Test und Livechecks decken Betrieb, SEO und Consent ab.                              |
| **AP32** | Post-Launch Monitoring und Stabilisierung                  | DEPLOYMENT-CONTRACT · TRACKING-CONTRACT · SEO-CONTRACT · RUNTIME-CONTRACT                                                        | CONSENT-CONTRACT · QUALITY-GATES · CRM-INTEGRATION                                                  | Monitoring misst Betrieb, Analytics und Indexierung gegen die zugesagten Verträge.                  |
| **AP33** | Dokumentation, Wartbarkeit, Betriebsübergabe               | DEPLOYMENT-CONTRACT · RUNTIME-CONTRACT · QUALITY-GATES · I18N-CONTRACT                                                           | jeder Contract, der dokumentiert wird · CRM-INTEGRATION · BACKEND-API-CONTRACT                      | Übergabe beschreibt bestehende Verträge; sie darf keine neuen erfinden.                             |

**Abdeckung: 34/34 (AP00–AP33).**

### 4.1 Regeln zur Matrix

- `Required context` ist die **Obergrenze des Normalfalls**, nicht ein Minimum, das beliebig erweitert wird.
- `Optional context` wird **nur bei konkretem Anlass** geladen — nicht vorsorglich.
- Braucht ein Primärtask nachweislich ein hier nicht gelistetes Dokument, wird es geladen **und** die
  Abweichung unter `Required Context for Next PT` in `state/AP-STATE.md` vermerkt.
- `IA-INVENTORY.md` ist seit **AP03 PT03.1** das kanonische IA-Hauptartefakt (Seiten-/Routeninventar,
  später Seitentypen, Journeys und Findability). Es ist **IA-Wahrheit, keine zweite Routing-Wahrheit** —
  Pfade, Locale-Policy und Status bleiben `ROUTING-CONTRACT.md`. Nur laden, wo IA-Information gebraucht
  wird; kein globaler Pflichtkontext.
- `CONTENT-ASSET-CONTRACT.md` ist seit **AP02 PT02.3** der kanonische Content-/Asset-Vertrag
  (Schichten Code ↔ i18n ↔ Content-JSON ↔ Assets, sprachabhängige Assets, PUBLIC/GATED). Sprachmenge und
  Key-Parität bleiben in `I18N-CONTRACT.md`, Route-Existenz in `ROUTING-CONTRACT.md`.
- `REPO-BASELINE.md` und `BRANCH-RECONCILIATION-MAP.md` sind **Evidenz**, keine Entscheidung.
- `BRANCH-RECONCILIATION-MAP.md` ist bei **jedem** branch-abgeleiteten Schritt Pflicht, auch wenn die
  AP-Zeile sie nur als optional führt (`AGENT-CONTRACT.md` §2).
- Bei einem G2-/G3-Hotspot gilt zusätzlich die Hotspot-Regel aus `AGENT-CONTRACT.md` §5.

---

## 5. Beispiel-Bootstraps

### AP00 / PT00.1

```text
building-docs/AGENT-CONTRACT.md
building-docs/PROJECT-CONSTRAINTS.md
building-docs/scope/MASTER-SCOPE.md   → §0.2, §0.2.1, §0.2.2, §1, §2, AP00, §7, §8
building-docs/work-packages/AP00.md
building-docs/state/AP-STATE.md
+ PT00.1-Prompt
```

### AP23 / Tracking-PT (z. B. PT23.3)

```text
building-docs/AGENT-CONTRACT.md
building-docs/PROJECT-CONSTRAINTS.md
building-docs/scope/MASTER-SCOPE.md   → §0.2, §1, §2, AP23, §7, Gate 2
building-docs/work-packages/AP23.md
building-docs/state/AP-STATE.md
building-docs/CONSENT-CONTRACT.md
building-docs/TRACKING-CONTRACT.md
building-docs/NETWORK-ALLOWLIST.md
building-docs/QUALITY-GATES.md
+ PT23.3-Prompt
```

Nicht geladen: `REPO-BASELINE`, `BRANCH-RECONCILIATION-MAP`, `I18N-CONTRACT`, `SEO-CONTRACT`,
`ROUTING-CONTRACT`, `BACKEND-API-CONTRACT`, `LEAD-*`, `CRM-INTEGRATION`, `DEPLOYMENT-CONTRACT`.
