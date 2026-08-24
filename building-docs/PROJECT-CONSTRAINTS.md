# PROJECT-CONSTRAINTS — PolarisDX Website Relaunch

**Quelle:** ausschließlich der Decision Lock aus `building-docs/scope/MASTER-SCOPE.md`, Abschnitt 0.2 / 0.2.1 / 0.2.2.
**Stand der Quelle:** 2026-08-21 · Status FINAL / Decision-Locked / ausführungsbereit.
**Repository-Baseline:** `feat/home-leadmagnet@961f65d`.

Dieses Dokument ist eine kompakte, agenten-lesbare Fassung. Es fügt **nichts hinzu** und **interpretiert nichts**.
Im Zweifel und bei jeder Abweichung gilt der Wortlaut in `building-docs/scope/MASTER-SCOPE.md`.

---

## AUTORITÄTSREIHENFOLGE

```
1. building-docs/scope/MASTER-SCOPE.md
2. building-docs/PROJECT-CONSTRAINTS.md
3. current repository evidence
4. building-docs/BRANCH-RECONCILIATION-MAP.md
5. building-docs/REPO-BASELINE.md
6. historical repository documentation
```

**Kollidiert eine niedrigere Quelle mit einer höheren, gewinnt die höhere Quelle.**

Praktische Folgerungen:

- Repository-Evidenz (3) beschreibt den **Ist-Zustand**. Sie darf eine Entscheidung aus (1) oder (2) niemals überschreiben — sie kann nur zeigen, dass der Ist-Zustand noch nicht der Entscheidung entspricht.
- `REPO-BASELINE.md` (5) enthält in §11 eine Baseline-Empfehlung, die **nicht autoritativ** ist; die Baseline steht in (1).
- Historische Repository-Dokumentation (6) — u. a. `DOCS.md`, `_project-knowledge/`, `AUDIT_I18N_ROUTING.md`, `SEO_STRATEGY.md`, `CHAT_INTEGRATION.md` — ist die schwächste Quelle und in Teilen nachweislich veraltet.

---

## DECISION LOCKS — DEC-RL-001 bis DEC-RL-015

| ID             | Verbindliche Entscheidung                                                                                                                                         |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **DEC-RL-001** | Alle 10 Sprachen (`de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`) werden vollständig unterstützt; kein dauerhafter EN-Fallback für relevante Inhalte. |
| **DEC-RL-002** | **Sales-Machine** aus `feat/home-leadmagnet` ist die Art Direction. `redesign/preview` liefert nur art-direction-neutrale Technik/QA-Patterns.                    |
| **DEC-RL-003** | Main-Site bleibt **Light**; keine Dark-Theme-Arbeit.                                                                                                              |
| **DEC-RL-004** | GTM/GA4 bleiben, aber ausschließlich nach wirksamem Consent; kein Tracking und kein Event-Puffern vor Consent.                                                    |
| **DEC-RL-005** | Epigenetik ist eine **eigenständige Geschäftssäule** mit eigener IA, Navigation, Homepage-Rolle und Lead Journey.                                                 |
| **DEC-RL-006** | Consumer-Landingpages bleiben öffentlich **indexierbar** und werden als vollwertige SEO-Seiten betrieben.                                                         |
| **DEC-RL-007** | **Kein Chat** im Relaunch; HiHuman, Chat-Loader, `/api/chat`-Mock und zugehörige produktive Reste werden entfernt.                                                |
| **DEC-RL-008** | IglooPro-Claim **`CV < 2 %`** bleibt bestehen; Produkt-/Content-Entscheidung, keine unabhängige wissenschaftliche Validierung durch das Repo.                     |
| **DEC-RL-009** | Leads werden **persistent verarbeitet und an ein CRM übergeben**; Mail-only ist nicht das Zielmodell.                                                             |
| **DEC-RL-010** | Formale Content-Governance ist **Backlog**, nicht Launch-Scope.                                                                                                   |
| **DEC-RL-011** | Epigenetik erhält eine **eigene Inquiry-/Lead-Strecke** mit eigener Backend-/CRM-Zuordnung.                                                                       |
| **DEC-RL-012** | Das site-weite Band mit „garantierte Performance" wird **nicht** in den Relaunch übernommen und nicht ersetzt.                                                    |
| **DEC-RL-013** | Standard-CTA des allgemeinen Anfragewegs: **„Angebot anfragen"**, lokalisiert in allen 10 Sprachen.                                                               |
| **DEC-RL-014** | Zusätzlich zur direkten Anfrage gibt es mindestens einen **gated Lead-Magnet-/Secondary-Conversion-Pfad**.                                                        |
| **DEC-RL-015** | Deal/Voucher/Case Studies/Shop sind bewusst vertagt und gehören in den Backlog.                                                                                   |

---

## GESCHLOSSENE RESTENTSCHEIDUNGEN — REST-01 bis REST-03

| ID          | Verbindliche Entscheidung                                                                                                                                                                                 |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **REST-01** | Produktionsbetrieb: **Docker/Compose**, Reverse Proxy/nginx davor; persistente Daten separat/backupfähig; Secrets außerhalb Images; Healthchecks, Restart Policies, Monitoring, image-basiertes Rollback. |
| **REST-02** | Consent-Modell: **Basic Consent Mode v2 / vollständiger Ladeverzicht**. GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden erst nach Einwilligung.                                       |
| **REST-03** | **Alle Consumer-Landingpages in allen 10 Sprachen**.                                                                                                                                                      |

---

## EXPLIZIT NICHT WIEDER ÖFFNEN (Master-Scope §0.2.1)

- Sprachreduzierung auf DE/EN oder Consumer-EN-only.
- Alternative Art Direction oder Dark Theme.
- Chat-Anbieterwahl.
- Consumer `noindex`/Basic-Auth.
- Epigenetik nur als Diagnostik-Unterpunkt.
- Mail-only als finales Lead-Modell.
- Rückmigration des IglooPro-Claims auf `<5 %`.
- Ersatzformulierung für das entfernte Garantie-CTA-Band.

**Ein Implementierungsagent darf keinen dieser Punkte neu verhandeln, neu bewerten oder als offene Option behandeln** — auch nicht, wenn Repository-Evidenz, ältere Dokumentation oder ein Quell-Branch etwas anderes nahelegt.

---

## BACKLOG, NICHT LAUNCH-BLOCKER (Master-Scope §0.2.2)

- formale Content-Owner-/Review-/Freshness-/medizinische Freigabe-Governance;
- CMS-Pipeline-Governance;
- Deal/Voucher/Case Studies/Shop;
- tote/unschädliche Legacy-Artefakte, sofern sie Launch, Security, Build oder Imports nicht beeinflussen.

Diese Punkte sind **nicht** Teil des Relaunch-Scope. Ein Agent, der auf sie stößt, dokumentiert sie und arbeitet weiter — er baut sie nicht.
