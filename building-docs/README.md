# building-docs — kanonischer Agenten-Kontext für den PolarisDX Website Relaunch

## START HERE

```text
START HERE
  ↓
CONTEXT-INDEX.md            welche Dokumente braucht mein Primärtask?
  ↓
AGENT-CONTRACT.md           Sicherheits- und Ausführungsregeln
PROJECT-CONSTRAINTS.md      bestätigte Decision Locks
scope/MASTER-SCOPE.md       projektweiter Scope (nur relevante Abschnitte)
  ↓
work-packages/APxx.md       operativer Vertrag des aktuellen Arbeitspakets
  ↓
state/AP-STATE.md           serieller Handoff, wo die Arbeit steht
  ↓
relevante *-CONTRACT.md     nur die für dieses AP gelisteten
  ↓
aktueller PT-Prompt
```

**Ein Primärtask liest nicht alle `building-docs`.** Welche Dokumente er lädt, steht in
[`CONTEXT-INDEX.md`](CONTEXT-INDEX.md) — dort auch die vollständige Matrix AP00–AP33.

**Gesperrte Baseline: `feat/home-leadmagnet@961f65d`.** Alle anderen Branches sind selektive Quellen.

---

## Wozu dieses Verzeichnis existiert

`building-docs/` ist die **einzige verbindliche Kontextquelle** für Coding-Agenten, die am Relaunch arbeiten.

Es wurde angelegt, um genau einen Fehlerfall zu verhindern, der bereits eingetreten ist: Während der
Hotspot-Analyse war der vollständige Master-Scope (AP00–AP33) nirgends im Repository auffindbar. Ein
`grep` über alle `*.md` fand AP-Bezeichner ausschließlich in den Analyse-Dokumenten dieser Kette selbst,
und die Git-Historie enthielt kein Scope-Dokument. Die Folge: nur ein Teil der AP-Struktur konnte
rekonstruiert werden, 18 von 34 AP-Slots blieben unbelegt, und betroffene Bereiche mussten als
`AP-UNMAPPED` markiert werden.

**Damit das nicht wieder passiert, gilt: Der Scope lebt im Repository, nicht in einem Chatverlauf.**
Jeder Primärtask muss in einer **frischen** Agent-Session ausführbar sein — ohne vorherigen Chat-Kontext.

---

## Kanonische Dateien

### Steuerung

| Datei                    | Rolle                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------- |
| `README.md`              | Dieses Dokument. Einstieg und Landkarte.                                                                    |
| `CONTEXT-INDEX.md`       | **Routing-Matrix.** Welcher AP braucht welche Dokumente? Kein eigenes Projektwissen.                        |
| `AGENT-CONTRACT.md`      | Operativer Vertrag: was ein Agent tun muss, darf und nie tun darf. Enthält den Canonical Context Bootstrap. |
| `PROJECT-CONSTRAINTS.md` | Kompakte Fassung des Decision Lock (`DEC-RL-001`–`015`, `REST-01`–`03`) + Autoritätsreihenfolge.            |

### Scope, Arbeitspakete, Zustand

| Pfad                    | Rolle                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `scope/MASTER-SCOPE.md` | **Die Scope-Autorität.** FINALER Master-Scope, Stand 2026-08-21, 34 Arbeitspakete AP00–AP33, 178 Primärtasks. Wortgleiche Kopie. |
| `work-packages/APxx.md` | Operativer Vertrag je Arbeitspaket. Detailliert nur sein AP, erweitert den Scope nicht. Siehe `work-packages/README.md`.         |
| `state/AP-STATE.md`     | **Die einzige** globale State-Datei. Serieller Handoff zwischen Primärtasks. Zustand, keine Autorität.                           |

### Fachliche Contracts (technische Invarianten)

| Datei                       | Rolle                                                                                                         |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `BACKEND-API-CONTRACT.md`   | API-Oberfläche, Request-/Response-Verträge, Fehlersemantik.                                                   |
| `CONSENT-CONTRACT.md`       | Consent-Modell (Basic Consent Mode v2), was vor Einwilligung nicht passieren darf.                            |
| `CRM-INTEGRATION.md`        | CRM-Handoff, Feldabbildung, `DRY_RUN`-Verhalten.                                                              |
| `DEPLOYMENT-CONTRACT.md`    | Docker/Compose, Environments, Secrets, Rollback, Persistenz.                                                  |
| `DESIGN-SYSTEM-CONTRACT.md` | Sales-Machine-Art-Direction, Light-Theme-Regel, Tokenrollen, Alias-Politik, Motion-Tokens, Guard-Verankerung. |
| `I18N-CONTRACT.md`          | 10 Sprachen, Namespaces, Key-Parität, Sprachrouten.                                                           |
| `LEAD-DATA-CONTRACT.md`     | Lead-Datenmodell und Persistenzvertrag.                                                                       |
| `LEAD-DELIVERY-CONTRACT.md` | Zustellung, Queue/Retry/Dead-Letter, gated Asset-Auslieferung.                                                |
| `NETWORK-ALLOWLIST.md`      | Erlaubte Drittanbieter-Domains; Grundlage für CSP und Pre-Consent-Prüfung.                                    |
| `QUALITY-GATES.md`          | Test-, A11y-, Performance- und CI-Gates.                                                                      |
| `ROUTING-CONTRACT.md`       | Route Registry, `KNOWN_PATHS`, Redirects, HTTP-Status-Semantik.                                               |
| `RUNTIME-CONTRACT.md`       | SSR-/Server-Verhalten, Rendering- und Laufzeitinvarianten.                                                    |
| `SEO-CONTRACT.md`           | Canonical/hreflang, Sitemap, Robots, Structured Data.                                                         |
| `TRACKING-CONTRACT.md`      | Tracking-Fassade, Event-/Conversion-Taxonomie.                                                                |

### Evidenz (kein Entscheidungsdokument)

| Datei                          | Rolle                                                                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `REPO-BASELINE.md`             | Repository-Ist-Zustand vom 2026-08-21. §11 dort ist ausdrücklich **nicht** autoritativ.                                                        |
| `BRANCH-RECONCILIATION-MAP.md` | Selektive Import-/Nicht-Import-Landkarte für `main`, `redesign/preview`, `feat/contact-joyful`. Pflicht vor jedem branch-abgeleiteten Schritt. |

---

## Autoritätsreihenfolge

Die Ausführungs-/Bootstrap-Reihenfolge steht in [`CONTEXT-INDEX.md`](CONTEXT-INDEX.md) §3.
Die inhaltliche Quellenhierarchie lautet:

```
1. building-docs/scope/MASTER-SCOPE.md
2. building-docs/PROJECT-CONSTRAINTS.md
3. current repository evidence
4. building-docs/BRANCH-RECONCILIATION-MAP.md
5. building-docs/REPO-BASELINE.md
6. historical repository documentation
```

Kollidiert eine niedrigere Quelle mit einer höheren, **gewinnt die höhere Quelle**.
Repository-Evidenz beschreibt den Ist-Zustand — sie überschreibt keine bestätigte Product Decision.

---

## Kontextmodi

### NEW AP BOOTSTRAP

Zu Beginn eines neuen Arbeitspakets: Canonical Context Bootstrap nach `AGENT-CONTRACT.md` §6 —
`CONTEXT-INDEX.md` konsultieren, `ALWAYS_READ` frisch laden, dann den `Required context` des AP.
Zusätzlich `git status`, aktuellen Branch und `HEAD` prüfen.

### SAME-AP CONTINUATION

Innerhalb eines laufenden Arbeitspakets genügt:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. Der AP-Abschnitt aus `building-docs/scope/MASTER-SCOPE.md` + `work-packages/APxx.md`
4. `building-docs/state/AP-STATE.md`
5. Die direkt betroffenen Quell- und Testdateien
6. Aktuellen `HEAD` verifizieren

Nicht wiederholt das gesamte Repository neu lesen.

### Abweichungsregel

**Weicht `HEAD` unerwartet von dem in `state/AP-STATE.md` vermerkten Stand ab, wird der vollständige
Bootstrap-Kontext neu geladen, bevor weitergearbeitet wird.** Ein unerwarteter HEAD bedeutet, dass
zwischenzeitlich jemand oder etwas anderes gearbeitet hat — der zwischengespeicherte Kontext ist dann
nicht mehr belastbar.

---

## Noch nicht angelegt (bewusst)

- `APxx.md` für AP01–AP33 — werden erzeugt, sobald das jeweilige Arbeitspaket vorbereitet wird.
- Governance-Artefakte von AP00 (`DECISIONS.md`, `SCOPE-CHANGELOG.md`, `RELAUNCH-BACKLOG.md`,
  `RISK-REGISTER.md`, `RELEASE-ACCEPTANCE.md`) — sie entstehen in `PT00.1`–`PT00.4`.

Das vorhandene `projektverzeichnis/` wird **nicht** nach `building-docs/` dupliziert. Es bleibt an
seinem Ort unverändert und wird nicht gelöscht, verschoben oder gestaged.
