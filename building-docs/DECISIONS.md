# DECISIONS — kanonische Decision-Baseline des PolarisDX Website Relaunch

**Dokumenttyp:** Decision Record / Spiegel der bestätigten Product-Owner-Entscheidungen
**Erzeugt durch:** `PT00.1` (AP00 — Programmsteuerung, Scope Lock und Delivery Governance)
**Stand:** 2026-08-24
**Repository-Baseline:** `feat/home-leadmagnet@961f65d`
**Kanonischer Scope:** `building-docs/scope/MASTER-SCOPE.md`

Dieses Dokument **spiegelt** Entscheidungen. Es erzeugt keine neuen, es interpretiert keine um und es
öffnet keine wieder. Quelle jeder Zeile ist `scope/MASTER-SCOPE.md` §0.2 / §0.2.1 / §0.2.2, kompakt
gefasst in `PROJECT-CONSTRAINTS.md`. Bei jeder Abweichung im Wortlaut gewinnt der Master-Scope.

Änderungen an diesem Dokument sind ausschließlich über den in `building-docs/SCOPE-CHANGELOG.md`
definierten Change-Control-Mechanismus zulässig.

---

## 1. Kanonische Scope-Identität

| Aspekt                         | Verbindliche Festlegung                                                                                    |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| Kanonischer Relaunch-Scope     | `building-docs/scope/MASTER-SCOPE.md` — genau ein Dokument, 34 Arbeitspakete (AP00–AP33), 178 Primärtasks. |
| Kanonische Decision Locks      | `building-docs/PROJECT-CONSTRAINTS.md` (agenten-lesbare Kurzfassung) + dieses Dokument (Decision Record).  |
| Kanonischer Ausführungsvertrag | `building-docs/AGENT-CONTRACT.md`                                                                          |
| Kanonischer Handoff-State      | `building-docs/state/AP-STATE.md` — genau eine State-Datei.                                                |
| Repository-Baseline            | **`feat/home-leadmagnet@961f65d`**                                                                         |

**Kein zweiter Master-Scope.** Root-Dateien wie `POLARISDX-RELAUNCH-MASTER-SCOPE(1).md` oder
`_project-knowledge/` sind historische Evidenz, kein Kanon. Historische Repository-Dokumentation
(`DOCS.md`, `AUDIT_I18N_ROUTING.md`, `SEO_STRATEGY.md`, `CHAT_INTEGRATION.md`, …) ist die schwächste
Quelle und darf einen Lock nicht überschreiben.

### 1.1 Autoritätsreihenfolge

```
1. building-docs/scope/MASTER-SCOPE.md
2. building-docs/PROJECT-CONSTRAINTS.md   (= dieses DECISIONS.md, deckungsgleich)
3. current repository evidence
4. building-docs/BRANCH-RECONCILIATION-MAP.md
5. building-docs/REPO-BASELINE.md
6. historical repository documentation
```

**Repository-Evidenz beschreibt den Ist-Zustand. Sie darf eine bestätigte Product Decision niemals
überschreiben** — sie kann nur zeigen, dass der Ist-Zustand der Entscheidung noch nicht entspricht.
Ein solcher Befund ist eine Ist-/Soll-Abweichung und wird als Arbeitsauftrag geführt, nicht als
Anlass, die Entscheidung neu zu bewerten.

---

## 2. Baseline und Branch-Rollen

### 2.1 Baseline

**`DEC-BASE-001` — Die Repository-Baseline ist exakt `feat/home-leadmagnet@961f65d`.**
Status: `LOCKED` · Herkunft: `Product Owner / confirmed`

- `main` ist **nicht** die Baseline.
- Ein „neuerer" Branch wird **nicht allein wegen des Zeitstempels** zur Baseline.
- Auch eine technisch attraktivere Alternative ist kein Anlass, die Baseline zu wechseln.
- Die Baseline enthält funktionierende 404-/SEO-/Cache-Härtung, die bei jedem selektiven Import
  erhalten bleiben muss.

### 2.2 Selektive Quellen (keine Gegenentwürfe)

| Ref                           | Rolle                      | Zulässiger Beitrag                                                                                                                                          |
| ----------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `main@d0fdf29`                | selektive Quelle           | Epigenetik-Unterseiten, `EpiSubpage`, Tokens/Metadaten, Musterbefund-Routenmodule.                                                                          |
| `redesign/preview@5673b61`    | selektive Quelle           | ausschließlich **art-direction-neutrale** Technik/QA-Patterns: Visual Regression, Error Boundaries, a11y-Audit, Metrics/Web-Vitals, CI-/Changelog-Patterns. |
| `feat/contact-joyful@ab373a3` | optionale selektive Quelle | einzelne Dateien/Hunks nach Positivliste.                                                                                                                   |

**Import-Regeln (aus `AGENT-CONTRACT.md` §2, hier nur referenziert):**

- Quell-Branches liefern **einzelne Dateien, Module oder Hunks** — nie eine Richtung, nie eine Architektur.
- **Kein** `git merge`, **kein** branchweiter `cherry-pick`, **kein** `git checkout <ref> -- <pfad>`
  für eine Datei, die auf der Baseline ebenfalls existiert.
- Vor **jedem** branch-abgeleiteten Schritt ist `building-docs/BRANCH-RECONCILIATION-MAP.md`
  verbindlich zu konsultieren (Positivliste IMPORT/REIMPLEMENT, Negativliste DO_NOT_IMPORT,
  Commit-Sicherheitsmatrix).
- Die operative Durchführung selektiver Imports gehört zu **AP01**, nicht zu AP00.

---

## 3. Decision Locks — Coverage 18/18

Alle folgenden Einträge haben Status **`LOCKED`** und Herkunft **`Product Owner / confirmed`**.
Keiner ist `TODO`, `TBD`, `ASSUMPTION`, `OPEN` oder `NEEDS DECISION`.

| ID             | Status   | Verbindliche Entscheidung                                                                                                                                                                                 | Scope-Konsequenz                                                                                                                                                                                                             |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DEC-RL-001** | `LOCKED` | Alle 10 Sprachen (`de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`) werden vollständig unterstützt; kein dauerhafter EN-Fallback für relevante Inhalte.                                         | Jede relevante Route, jedes Content-Set und jeder Systemtext ist 10-sprachig zu liefern; Key-/Namespace-Parität ist CI-messbar (Gate 1). Trifft AP08, AP03, AP04, AP16, AP21.                                                |
| **DEC-RL-002** | `LOCKED` | **Sales-Machine** aus `feat/home-leadmagnet` ist die Art Direction. `redesign/preview` liefert nur art-direction-neutrale Technik/QA-Patterns.                                                            | Design-System und alle Seiten folgen der Baseline-Art-Direction; aus `redesign/preview` werden ausschließlich neutrale Technik-Patterns übernommen. Trifft AP05, AP01, AP11.                                                 |
| **DEC-RL-003** | `LOCKED` | Main-Site bleibt **Light**; keine Dark-Theme-Arbeit.                                                                                                                                                      | Keine Dark-Theme-Tokens, kein Theme-Switch, keine Dark-Varianten in Komponenten oder Visual Regression. Trifft AP05, AP06.                                                                                                   |
| **DEC-RL-004** | `LOCKED` | GTM/GA4 bleiben, aber ausschließlich nach wirksamem Consent; kein Tracking und kein Event-Puffern vor Consent.                                                                                            | Consent-Fundament ist Vorbedingung jeder Tracking-Arbeit; Reject erzeugt keine Analytics-/Marketing-Requests (Gate 2). Trifft AP23, AP25, AP26.                                                                              |
| **DEC-RL-005** | `LOCKED` | Epigenetik ist eine **eigenständige Geschäftssäule** mit eigener IA, Navigation, Homepage-Rolle und Lead Journey.                                                                                         | Eigener Hub, eigene Hauptnavigations-Rolle, eigene Homepage-Präsenz; **nicht** als Unterpunkt der Diagnostik. Trifft AP15, AP06, AP11, AP16.                                                                                 |
| **DEC-RL-006** | `LOCKED` | Consumer-Landingpages bleiben öffentlich **indexierbar** und werden als vollwertige SEO-Seiten betrieben.                                                                                                 | Kein `noindex`, keine Basic-Auth; volle Canonical-/hreflang-/Sitemap-Behandlung und hohe Performance-Anforderung. Trifft AP21, AP09, AP29.                                                                                   |
| **DEC-RL-007** | `LOCKED` | **Kein Chat** im Relaunch; HiHuman, Chat-Loader, `/api/chat`-Mock und zugehörige produktive Reste werden entfernt.                                                                                        | Chat-Entfernung ist Vorbedingung der CSP-Finalisierung; keine Chat-Domain verbleibt in der Allowlist (Gate 5). Trifft AP26, AP01, AP06.                                                                                      |
| **DEC-RL-008** | `LOCKED` | IglooPro-Claim **`CV < 2 %`** bleibt bestehen; Produkt-/Content-Entscheidung, **keine unabhängige wissenschaftliche Validierung durch das Repo**.                                                         | Der Claim wird über Code, 10 Locales, Structured Data und relevante PDFs konsistent geführt; kein versehentlicher `<5 %`-Rollback (Gate 7). Das Repo behauptet keine wissenschaftliche Validierung. Trifft AP14, AP08, AP09. |
| **DEC-RL-009** | `LOCKED` | Leads werden **persistent verarbeitet und an ein CRM übergeben**; Mail-only ist nicht das Zielmodell.                                                                                                     | Persistenz, Retry, Dead-Letter, Idempotenz und Auditierbarkeit sind Pflicht; kein Lead geht bei normalen Fehlerfällen verloren (Gate 3). Trifft AP22, AP19, AP20, AP28.                                                      |
| **DEC-RL-010** | `LOCKED` | Formale Content-Governance ist **Backlog**, nicht Launch-Scope.                                                                                                                                           | Owner-/Review-/Freshness-/medizinische-Freigabe-Prozesse werden nicht als Launch-Blocker gebaut; Launch-Content-Readiness (AP04) bleibt davon unberührt.                                                                     |
| **DEC-RL-011** | `LOCKED` | Epigenetik erhält eine **eigene Inquiry-/Lead-Strecke** mit eigener Backend-/CRM-Zuordnung.                                                                                                               | Eigener Anfragepfad mit Panel-/Source-Kontext und eigener CRM-Zuordnung; hängt an der Epigenetik-IA (Gate 6). Trifft AP15, AP22.                                                                                             |
| **DEC-RL-012** | `LOCKED` | Das site-weite Band mit „garantierte Performance" wird **nicht** in den Relaunch übernommen und **nicht ersetzt**.                                                                                        | Weder Wiedereinführung noch Ersatzband zur Layout-Erhaltung; `main`-Importe dürfen es nicht zurückbringen (Gate 8). Trifft AP01, AP11, AP06.                                                                                 |
| **DEC-RL-013** | `LOCKED` | Standard-CTA des allgemeinen Anfragewegs: **„Angebot anfragen"**, lokalisiert in allen 10 Sprachen.                                                                                                       | Einheitliche CTA-Benennung site-weit; fachliche Ausnahmen (Support, Consumer Order) sind bewusst und benannt (Gate 9). Trifft AP11, AP13, AP20, AP08.                                                                        |
| **DEC-RL-014** | `LOCKED` | Zusätzlich zur direkten Anfrage gibt es mindestens einen **gated Lead-Magnet-/Secondary-Conversion-Pfad**.                                                                                                | Mindestens ein Pfad ist produktiv vollständig: Gate, Consent, Persistenz, CRM, Zustellung, Abuse Protection, Tracking, i18n, a11y (Gate 10). Trifft AP19, AP22, AP11.                                                        |
| **DEC-RL-015** | `LOCKED` | Deal/Voucher/Case Studies/Shop sind bewusst vertagt und gehören in den Backlog.                                                                                                                           | Diese Bereiche werden im Relaunch weder gebaut noch reaktiviert; ihre bloße Existenz im Repo ist kein Launch-Blocker.                                                                                                        |
| **REST-01**    | `LOCKED` | Produktionsbetrieb: **Docker/Compose**, Reverse Proxy/nginx davor; persistente Daten separat/backupfähig; Secrets außerhalb Images; Healthchecks, Restart Policies, Monitoring, image-basiertes Rollback. | Das Betriebszielbild ist entschieden; CRM-Betriebsarbeit hängt daran (Gate 12). Trifft AP28, AP02, AP26, AP31.                                                                                                               |
| **REST-02**    | `LOCKED` | Consent-Modell: **Basic Consent Mode v2 / vollständiger Ladeverzicht**. GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden erst nach Einwilligung.                                       | Vollständiger Ladeverzicht vor Consent — messbar gegen die Netz-Allowlist; Widerruf muss funktionieren (Gate 2). Trifft AP23, AP26.                                                                                          |
| **REST-03**    | `LOCKED` | **Alle Consumer-Landingpages in allen 10 Sprachen.**                                                                                                                                                      | Consumer × 10 ist Launch-Gate-relevant, nicht optional (Gate 1, Gate 4). Trifft AP21, AP08.                                                                                                                                  |

**Decision Coverage: 18/18 · alle `LOCKED` · 0 offen.**

---

## 4. Explizit nicht wieder öffnen

Die folgenden Fragen sind **geschlossen**. Ein Implementierungsagent darf sie nicht neu verhandeln,
nicht neu bewerten und nicht als offene Option behandeln — auch nicht, wenn Repository-Evidenz,
ältere Dokumentation oder ein Quell-Branch etwas anderes nahelegt.

| #   | Geschlossene Frage        | Geschlossen zugunsten von                                          | Bezug                   |
| --- | ------------------------- | ------------------------------------------------------------------ | ----------------------- |
| 1   | Sprachumfang              | **10 Sprachen vollständig** — keine Reduzierung auf DE/EN          | `DEC-RL-001`            |
| 2   | Consumer-Sprachumfang     | **Consumer × 10** — kein Consumer-EN-only                          | `REST-03`, `DEC-RL-001` |
| 3   | Art Direction             | **Sales-Machine** — keine alternative Art Direction                | `DEC-RL-002`            |
| 4   | Theme                     | **Light** — kein Dark Theme                                        | `DEC-RL-003`            |
| 5   | Chat                      | **Kein Chat** — keine Anbieterwahl, keine Wiedereinführung         | `DEC-RL-007`            |
| 6   | Consumer-Indexierung      | **Indexierbar** — kein `noindex`, keine Basic-Auth                 | `DEC-RL-006`            |
| 7   | Rolle der Epigenetik      | **Eigenständige Geschäftssäule** — nicht als Diagnostik-Unterpunkt | `DEC-RL-005`            |
| 8   | Epigenetik-Anfragepfad    | **Eigene Inquiry-/Lead-Strecke** mit eigener CRM-Zuordnung         | `DEC-RL-011`            |
| 9   | Lead-Zielmodell           | **Persistenz + CRM** — Mail-only ist nicht final                   | `DEC-RL-009`            |
| 10  | IglooPro-Claim            | **`CV < 2 %`** — keine Rückmigration auf `<5 %`                    | `DEC-RL-008`            |
| 11  | Garantie-CTA-Band         | **Entfällt ersatzlos** — keine Ersatzformulierung                  | `DEC-RL-012`            |
| 12  | Benennung des Anfrage-CTA | **„Angebot anfragen"** × 10 Sprachen                               | `DEC-RL-013`            |
| 13  | Secondary Conversion      | **Mindestens ein gated Lead-Magnet-Pfad**                          | `DEC-RL-014`            |
| 14  | Produktionsbetrieb        | **Docker/Compose hinter nginx/Reverse Proxy**                      | `REST-01`               |
| 15  | Tracking vor Consent      | **Vollständiger Ladeverzicht** — kein Puffern, kein Vorabladen     | `DEC-RL-004`, `REST-02` |

### 4.1 Umgang mit einem Konflikt zwischen Lock und Repository-Ist-Zustand

1. Der Lock bleibt gültig.
2. Die Abweichung wird als **Ist-/Soll-Delta** dokumentiert (Risk Register bzw. zuständiges AP).
3. Es wird **innerhalb** des Locks weitergearbeitet.
4. Nur ein echter, unauflösbarer Widerspruch zwischen zwei kanonischen Quellen wird als
   `BLOCKED_DECISION_CONFLICT` dokumentiert — er wird nicht geraten und nicht selbst entschieden.

**Hinweis zu `DEC-RL-008`:** Ob eine einzelne Repository-Stelle den Claim heute abweichend führt, ist
ausdrücklich eine spätere Ist-/Soll-Prüfung (AP14 / Gate 7). Sie ist **kein** Anlass, die Product
Decision `CV < 2 %` zu öffnen. Ebenso gilt: Das Repository behauptet an keiner Stelle eine
unabhängige wissenschaftliche Validierung dieses Claims.

---

## 5. Launch-Scope vs. Backlog

### 5.1 Backlog — ausdrücklich **kein** Launch-Blocker

| Backlog-Thema                                                                           | Begründung                                                                   | Bezug               |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------- |
| Formale Content-Governance (Owner-, Review-, Freshness-, medizinische Freigabeprozesse) | Bewusst vertagt; Launch hängt nicht daran.                                   | `DEC-RL-010`        |
| CMS-Pipeline-Governance                                                                 | Bewusst vertagt.                                                             | Master-Scope §0.2.2 |
| Deal/Voucher                                                                            | Bewusst vertagt.                                                             | `DEC-RL-015`        |
| Case Studies                                                                            | Bewusst vertagt.                                                             | `DEC-RL-015`        |
| Shop                                                                                    | Bewusst vertagt.                                                             | `DEC-RL-015`        |
| Tote/unschädliche Legacy-Artefakte                                                      | Nur solange sie **Launch, Security, Build oder Imports nicht beeinflussen**. | Master-Scope §0.2.2 |

**Regel:** Ein Agent, der auf ein Backlog-Thema stößt, **dokumentiert** es und arbeitet weiter.
Er baut es nicht und stuft es nicht zum Launch-Blocker hoch.

### 5.2 Grenzfall-Regel für Legacy-Artefakte

Ein Legacy-Artefakt verlässt den Backlog-Status **nur dann**, wenn es nachweisbar

- den Build bricht, **oder**
- eine Security-/CSP-/Secret-Grenze verletzt, **oder**
- einen selektiven Import verunreinigt, **oder**
- einen bestätigten Lock aktiv unterläuft (z. B. produktive Chat-Reste nach `DEC-RL-007`).

Der Nachweis ist zu dokumentieren. Ohne Nachweis bleibt es Backlog.

### 5.3 Launch-Scope

Launch-Scope ist der Inhalt von `scope/MASTER-SCOPE.md` AP00–AP33, gemessen an den 12 verbindlichen
Launch-Gates in §8 des Master-Scope (Language · Consent · CRM · SEO · Chat · Epigenetics ·
Content Claim · CTA · Naming · Lead-Magnet · Accessibility · Operations/Security).
Die operative Priorisierung (P0–P3) und die Hard Barriers werden in `PT00.2` festgeschrieben; die
Gate-Owner und Abnahmeregeln in `PT00.4`. **PT00.1 nimmt beides nicht vorweg.**

---

## 6. Änderungen an diesem Dokument

Dieses Dokument ist **abgeleitet**, nicht selbstständig. Es wird geändert, wenn

- der Master-Scope geändert wird (nur über bestätigte menschliche Entscheidung), **oder**
- ein Change gemäß `building-docs/SCOPE-CHANGELOG.md` formal angenommen wurde.

**Repository-Evidenz allein darf keinen Eintrag dieses Dokuments umschreiben.**
Jede Änderung erfordert einen Eintrag in `building-docs/SCOPE-CHANGELOG.md`.
