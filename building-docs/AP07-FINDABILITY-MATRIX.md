# AP07-FINDABILITY-MATRIX — operative Such- und Findability-Evidenz

**Kanonischer Pfad:** `building-docs/AP07-FINDABILITY-MATRIX.md`

**Status dieses Dokuments:** **AP07 COMPLETE / Closure PASS (2026-08-26)**. Sections A–D enthalten
die operative Search-, Findability-, Deferred- und Closure-Evidenz aus `PT07.1`–`PT07.3` und
`AP07-CLOSURE`.

---

## 0. Zweck und Abgrenzung

Dieses Dokument ist das **eine** operative Artefakt von AP07 für:

| Abschnitt     | Inhalt                                      | Befüllt durch      |
| ------------- | ------------------------------------------- | ------------------ |
| **Section A** | Search Coverage Matrix                      | `PT07.1`           |
| **Section B** | Internal Findability Matrix                 | `PT07.3`           |
| **Section C** | Deferred Search / Link Integration Register | `PT07.1`, `PT07.3` |
| **Section D** | AP07 Closure Evidence Summary               | `AP07-CLOSURE`     |

### 0.1 Was dieses Dokument NICHT ist

**Es ist operative Such-/Findability-Evidenz — es ist keine Routing-SSOT.**

- **Keine Route Registry.** Route-Existenz, Pfad-Kanonizität, Locale-Policy und HTTP-Status bleiben
  `ROUTING-CONTRACT.md`; **Owner der Route Registry ist und bleibt AP10**. Die Spalte
  `Route exists` in Section A ist ein **abgelesener Messwert**, keine Definition. Weicht sie vom
  Routing-Vertrag ab, gewinnt der Routing-Vertrag und die Abweichung ist ein Befund, keine Korrektur
  dieses Dokuments.
- **Keine zweite IA-Wahrheit.** Seitentypen, Journeys und der Navigations-/Findability-Vertrag stehen in
  `IA-INVENTORY.md` §8–§10.
- **Keine zweite Sprach-Wahrheit.** Sprachmenge und Key-Parität stehen in `I18N-CONTRACT.md`.
  **Owner der i18n-Kernarchitektur ist AP08.**
- **Keine zweite Content-Wahrheit.** Launch-Content-Status steht in `CONTENT-MATRIX.md`.
- **Kein zweites Deferred-Gate-Modell.** Das Modell ist `work-packages/AP04.md` §11.0. Section C ist
  ein **AP07-eigenes Register nach diesem Modell**, kein konkurrierendes Modell.

### 0.2 Keine konkurrierenden Einzelwahrheiten

Für AP07 wird **genau dieses eine** Artefakt geführt. Ausdrücklich **nicht** anzulegen:

`SEARCH-MATRIX.md` · `FINDABILITY.md` · `SEARCH-COVERAGE.md` · `INTERNAL-LINKS.md` · `DEFERRED-SEARCH.md`

Kein Primärtask von AP07 erzeugt eine zusätzliche Matrix-Datei. `PT07.1` schreibt in Section A (und bei
Bedarf C), `PT07.2` schreibt **keine** Matrix-SSOT, `PT07.3` schreibt in Section B und C,
`AP07-CLOSURE` schreibt Section D.

---

## 1. Section A — Search Coverage Matrix

**Owner der Befüllung:** `PT07.1 — Suchindex`.

### 1.1 Pflichtspalten

| Spalte                          | Bedeutung                                                                    |
| ------------------------------- | ---------------------------------------------------------------------------- |
| `Route`                         | Pfad ohne Locale-Präfix, z. B. `/diagnostics/dental`                         |
| `Content Type`                  | Typ nach `CONTENT-MATRIX.md` §19–§21 (`CT-01`–`CT-10`)                       |
| `Route exists`                  | `YES` / `NO` — **gemessen**, nicht angenommen; Quelle bleibt AP10            |
| `Search classification`         | einer der fünf Werte aus §1.2                                                |
| `Search ID`                     | ID des Eintrags im Suchindex, oder `—`                                       |
| `Search Result Type`            | Ergebnisgruppe im SearchModal (z. B. Service, Artikel, Epigenetik, Download) |
| `Search Title x10 status`       | `10/10` · `n/10` · `—`                                                       |
| `Search Description x10 status` | `10/10` · `n/10` · `—`                                                       |
| `Search target`                 | Ziel-URL des Treffers                                                        |
| `Owner`                         | AP, der den offenen Anteil schließt (`AP07`, sofern nichts deferred ist)     |
| `Evidence`                      | wie gemessen (Datei:Zeile, HTTP-Status, Testname)                            |
| `Deferred Gate ID`              | `DSI-xx` aus Section C, falls vorhanden — sonst `—`                          |

### 1.2 Zulässige Klassifikationen

| Wert                          | Bedeutung                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| `SEARCH_REQUIRED`             | strategische Seite, muss suchbar sein                                                 |
| `SEARCH_OPTIONAL`             | suchbar zulässig, aber nicht verpflichtend                                            |
| `SEARCH_EXCLUDED_INTENTIONAL` | bewusst **nicht** suchbar; Grund und Entscheidungsbezug sind Pflicht                  |
| `SEARCH_DEFERRED_ROUTE_OWNER` | Route existiert (noch) nicht oder ist nicht kanonisch — Owner ist ein **späterer** AP |
| `SEARCH_DEFERRED_CONTENT`     | Route existiert, aber der indexierbare Inhalt fehlt in einem Teil der zehn Sprachen   |

Jede Zeile mit `SEARCH_DEFERRED_*` **muss** eine `DSI-xx` in Section C referenzieren. Deferred-Prosa
ohne ID ist unzulässig.

### 1.3 Harte Regeln für Section A

- **Kein toter Treffer.** Ein Suchindex-Eintrag, dessen Ziel HTTP 404 liefert, ist ein Fehler und kein
  Deferred Gate. Stand `AP07-PLANNING-FIX`: `src/hooks/useSearch.ts:87` führt `id: 'sports'` →
  `/diagnostics/sports`, das gemessen **404** liefert (`AP06-CLOSURE`, Negativkontrolle).
  `MASTER-SCOPE.md` AP07 PT07.1 §9 verlangt die Entfernung — sie ist **AP07-eigene** Arbeit, kein DSI.
- **Keine noch nicht existierende Route aktiv indexieren.** Existiert eine geplante Route nicht,
  ist sie `SEARCH_DEFERRED_ROUTE_OWNER` mit `DSI-xx` und Owner-AP — nicht mit einem Platzhalterziel
  in den Index geschrieben.
- **`Route exists` wird gemessen.** Zulässige Evidenz: HTTP-Status gegen den laufenden SSR-Server
  **oder** ein `path="…"` in der Routendefinition. Nicht zulässig: Übernahme aus Prosa.

### 1.4 PT07.1-Messung (2026-08-26)

`Route exists` wurde gegen `src/App.tsx` und für dynamische Ziele zusätzlich gegen die kanonischen
Datenquellen gemessen. `check:search-index` validiert denselben manuellen Spiegel maschinell in zehn
Locales. Ein Search Target ist präfixlos notiert, weil `BrowserRouter`/`StaticRouter` den aktiven
Locale-Basename (`/<lang>`) ergänzen; der Guard prüft daraus 10/10 locale-aware URLs.

| Route                                                                     | Content Type | Route exists | Search classification       | Search ID                             | Search Result Type                             | Search Title x10 status | Search Description x10 status | Search target                                                             | Owner       | Evidence                                                                     | Deferred Gate ID |
| ------------------------------------------------------------------------- | ------------ | ------------ | --------------------------- | ------------------------------------- | ---------------------------------------------- | ----------------------- | ----------------------------- | ------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------- | ---------------- |
| `/`                                                                       | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `home`                                | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/`                                                                       | AP07        | `useSearch.ts:42-49`; `App.tsx:360`; guard PASS                              | —                |
| `/about`                                                                  | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `about`                               | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/about`                                                                  | AP07        | `useSearch.ts:74-81`; `App.tsx:363-370`; guard PASS                          | —                |
| `/diagnostics`                                                            | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `diagnostics`                         | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/diagnostics`                                                            | AP07        | `useSearch.ts:50-57`; `App.tsx:387-394`; guard PASS                          | —                |
| `/igloo-pro`                                                              | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `igloo-pro`                           | Resource · `search.resultTypes.resource`       | 10/10                   | 10/10                         | `/igloo-pro`                                                              | AP07        | `useSearch.ts:58-65`; `App.tsx:451-458`; guard PASS                          | —                |
| `/articles`                                                               | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `articles`                            | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/articles`                                                               | AP07        | `useSearch.ts:82-89`; `App.tsx:371-378`; guard PASS                          | —                |
| `/events`                                                                 | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `events`                              | Event · `search.resultTypes.event`             | 10/10                   | 10/10                         | `/events`                                                                 | AP07        | `useSearch.ts:90-97`; `App.tsx:443-450`; guard PASS                          | —                |
| `/downloads`                                                              | CT-07        | YES          | SEARCH_REQUIRED             | `downloads`                           | Resource · `search.resultTypes.resource`       | 10/10                   | 10/10                         | `/downloads`                                                              | AP07        | `useSearch.ts:98-105`; `App.tsx:576-583`; guard PASS                         | —                |
| `/support`                                                                | CT-10        | YES          | SEARCH_REQUIRED             | `support`                             | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/support`                                                                | AP07        | `useSearch.ts:106-113`; `App.tsx:411-418`; guard PASS                        | —                |
| `/contact`                                                                | CT-10        | YES          | SEARCH_REQUIRED             | `contact`                             | Page · `search.resultTypes.page`               | 10/10                   | 10/10                         | `/contact`                                                                | AP07        | `useSearch.ts:114-121`; `App.tsx:403-410`; guard PASS                        | —                |
| `/vitamin-d3-spray`                                                       | CT-01/CT-03  | YES          | SEARCH_REQUIRED             | `vitamin-d3-spray`                    | Resource · `search.resultTypes.resource`       | 10/10                   | 10/10                         | `/vitamin-d3-spray`                                                       | AP07        | `useSearch.ts:122-129`; `App.tsx:479-486`; guard PASS                        | —                |
| `/diagnostics/dental`                                                     | CT-03        | YES          | SEARCH_REQUIRED             | `service-dental`                      | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/dental`                                                     | AP07        | `services.tsx:16-23`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/beauty`                                                     | CT-03        | YES          | SEARCH_REQUIRED             | `service-beauty`                      | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/beauty`                                                     | AP07        | `services.tsx:24-31`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/longevity`                                                  | CT-03        | YES          | SEARCH_REQUIRED             | `service-longevity`                   | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/longevity`                                                  | AP07        | `services.tsx:32-39`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/poc-systemloesungen`                                        | CT-03        | YES          | SEARCH_REQUIRED             | `service-poc-systemloesungen`         | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/poc-systemloesungen`                                        | AP07        | `services.tsx:41-53`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/praeventions-checks`                                        | CT-03        | YES          | SEARCH_REQUIRED             | `service-praeventions-checks`         | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/praeventions-checks`                                        | AP07        | `services.tsx:54-61`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/infektion-entzuendung`                                      | CT-03        | YES          | SEARCH_REQUIRED             | `service-infektion-entzuendung`       | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/infektion-entzuendung`                                      | AP07        | `services.tsx:62-69`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/stoffwechsel-herz`                                          | CT-03        | YES          | SEARCH_REQUIRED             | `service-stoffwechsel-herz`           | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/stoffwechsel-herz`                                          | AP07        | `services.tsx:70-77`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/hormon-tests`                                               | CT-03        | YES          | SEARCH_REQUIRED             | `service-hormon-tests`                | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/hormon-tests`                                               | AP07        | `services.tsx:78-85`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/diagnostics/kompatibilitaet-integration`                                | CT-03        | YES          | SEARCH_REQUIRED             | `service-kompatibilitaet-integration` | Service · `search.resultTypes.service`         | 10/10                   | 10/10                         | `/diagnostics/kompatibilitaet-integration`                                | AP07        | `services.tsx:86-93`; `useSearch.ts:167-175`; guard 9/9                      | —                |
| `/articles/die-gruene-praxis`                                             | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-green_practice`              | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/die-gruene-praxis`                                             | AP17 (Body) | `articles.ts:4-13`; slug guard 6/6; AP04 `DG-05`                             | DSI-03           |
| `/articles/der-unsichtbare-patient`                                       | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-invisible_patient`           | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/der-unsichtbare-patient`                                       | AP17 (Body) | `articles.ts:14-23`; slug guard 6/6; AP04 `DG-05`                            | DSI-03           |
| `/articles/die-5-minuten-diagnose`                                        | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-five_minute_diagnosis`       | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/die-5-minuten-diagnose`                                        | AP17 (Body) | `articles.ts:24-33`; slug guard 6/6; AP04 `DG-05`                            | DSI-03           |
| `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-ecosystem_of_rapid_tests`    | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | AP17 (Body) | `articles.ts:34-48`; slug guard 6/6; AP04 `DG-05`                            | DSI-03           |
| `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-rapid_setup_formula`         | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | AP17 (Body) | `articles.ts:49-58`; slug guard 6/6; AP04 `DG-05`                            | DSI-03           |
| `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | CT-03        | YES          | SEARCH_DEFERRED_CONTENT     | `article-precision_point_of_care`     | Article · `search.resultTypes.article`         | 10/10                   | 10/10                         | `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | AP17 (Body) | `articles.ts:59-68`; slug guard 6/6; AP04 `DG-05`                            | DSI-03           |
| `/epigenetics`                                                            | CT-01/CT-03  | YES          | SEARCH_DEFERRED_CONTENT     | `epigenetics`                         | Epigenetics · `search.resultTypes.epigenetics` | 10/10                   | 10/10                         | `/epigenetics`                                                            | AP15 (Body) | `App.tsx:487-494`; `useSearch.ts:66-73`; AP04 `DG-01`                        | DSI-01           |
| `/epigenetics/grundlagen`                                                 | CT-02/CT-03  | YES          | SEARCH_DEFERRED_CONTENT     | `epigenetics-grundlagen`              | Epigenetics · `search.resultTypes.epigenetics` | 10/10                   | 10/10                         | `/epigenetics/grundlagen`                                                 | AP15 (Body) | `App.tsx:495-502`; `useSearch.ts:130-137`; HTTP/guard PASS                   | DSI-01           |
| `/epigenetics/studienlage`                                                | CT-02/CT-03  | YES          | SEARCH_DEFERRED_CONTENT     | `epigenetics-studienlage`             | Epigenetics · `search.resultTypes.epigenetics` | 10/10                   | 10/10                         | `/epigenetics/studienlage`                                                | AP15 (Body) | `App.tsx:503-510`; `useSearch.ts:130-137`; HTTP/guard PASS                   | DSI-01           |
| `/epigenetics/unterlagen`                                                 | CT-07        | YES          | SEARCH_DEFERRED_CONTENT     | `epigenetics-unterlagen`              | Epigenetics · `search.resultTypes.epigenetics` | 10/10                   | 10/10                         | `/epigenetics/unterlagen`                                                 | AP15 (Body) | `App.tsx:511-518`; `useSearch.ts:130-137`; HTTP/guard PASS                   | DSI-01           |
| `/epigenetics/musterbefund/metabolic-health`                              | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-metabolic-health`             | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/metabolic-health`                              | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:519-526`; guard 6/6                                 | DSI-02           |
| `/epigenetics/musterbefund/healthy-aging`                                 | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-healthy-aging`                | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/healthy-aging`                                 | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:527-534`; guard 6/6                                 | DSI-02           |
| `/epigenetics/musterbefund/biologische-altersuhr`                         | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-biologische-altersuhr`        | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/biologische-altersuhr`                         | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:535-542`; guard 6/6                                 | DSI-02           |
| `/epigenetics/musterbefund/telomer-analyse`                               | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-telomer-analyse`              | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/telomer-analyse`                               | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:543-550`; guard 6/6                                 | DSI-02           |
| `/epigenetics/musterbefund/stress-monitor`                                | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-stress-monitor`               | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/stress-monitor`                                | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:551-558`; guard 6/6                                 | DSI-02           |
| `/epigenetics/musterbefund/healthy-sport`                                 | CT-02        | YES          | SEARCH_DEFERRED_CONTENT     | `befund-healthy-sport`                | Befund · `search.resultTypes.befund`           | 10/10                   | 10/10                         | `/epigenetics/musterbefund/healthy-sport`                                 | AP16 (Body) | `BEFUND_ORDER`; `App.tsx:559-566`; guard 6/6                                 | DSI-02           |
| `/consumer/vitamin-d3-spray`                                              | CT-01/CT-03  | YES          | SEARCH_DEFERRED_ROUTE_OWNER | —                                     | Consumer · `search.resultTypes.consumer`       | —                       | —                             | —                                                                         | AP21        | `App.tsx:330-337`; currently only EN canonical; IA §10.8 SEARCHABLE          | DSI-04           |
| `/consumer/hydrating-masks`                                               | CT-01/CT-03  | YES          | SEARCH_DEFERRED_ROUTE_OWNER | —                                     | Consumer · `search.resultTypes.consumer`       | —                       | —                             | —                                                                         | AP21        | `App.tsx:338-345`; currently only EN canonical; IA §10.8 SEARCHABLE          | DSI-04           |
| `/consumer/inside-out-duo`                                                | CT-01/CT-03  | YES          | SEARCH_DEFERRED_ROUTE_OWNER | —                                     | Consumer · `search.resultTypes.consumer`       | —                       | —                             | —                                                                         | AP21        | `App.tsx:346-353`; currently only EN canonical; IA §10.8 SEARCHABLE          | DSI-04           |
| `/privacy`                                                                | CT-08        | YES          | SEARCH_EXCLUDED_INTENTIONAL | —                                     | Page                                           | —                       | —                             | —                                                                         | AP20        | IA §10.9 excludes Legal; `App.tsx:419-426`                                   | —                |
| `/imprint`                                                                | CT-08        | YES          | SEARCH_EXCLUDED_INTENTIONAL | —                                     | Page                                           | —                       | —                             | —                                                                         | AP20        | IA §10.9 excludes Legal; `App.tsx:427-434`                                   | —                |
| `/terms`                                                                  | CT-08        | YES          | SEARCH_EXCLUDED_INTENTIONAL | —                                     | Page                                           | —                       | —                             | —                                                                         | AP20        | IA §10.9 excludes Legal; `App.tsx:435-442`; old active entry removed         | —                |
| `/vitamin-d3-implantologie`                                               | CT-03/CT-08  | YES          | SEARCH_OPTIONAL             | —                                     | Resource                                       | —                       | —                             | —                                                                         | AP08        | German-only locale policy; `App.tsx:459-468`; excluded from x10 active index | —                |
| `/s3_leitlinie`                                                           | CT-03/CT-08  | YES          | SEARCH_OPTIONAL             | —                                     | Resource                                       | —                       | —                             | —                                                                         | AP08        | German-only locale policy; `App.tsx:469-478`; excluded from x10 active index | —                |

**Bilanz PT07.1:** 35 aktive, route-validierte Ziele · 9/9 Services · 6/6 veröffentlichte Artikel ·
Epigenetik 1+3+6 · 10 strategische/Resource-Seiten einschließlich Downloads und Events · 0 Legal ·
0 Consumer bis zur x10-Routenfreigabe · 0 `/services*` · 0 `sports` · 0 Future-/Backlog-Ziele.

---

## 2. Section B — Internal Findability Matrix

**Owner der Befüllung:** `PT07.3 — Interne Verlinkung`.

### 2.1 Pflichtspalten

| Spalte                      | Bedeutung                                                                 |
| --------------------------- | ------------------------------------------------------------------------- |
| `Route`                     | Pfad ohne Locale-Präfix                                                   |
| `Content Type`              | Typ nach `CONTENT-MATRIX.md` §19–§21                                      |
| `Header/Footer Findability` | `YES` / `NO` — Stand nach AP06; Quelle ist die gebaute Shell, nicht Prosa |
| `Search Findability`        | `YES` / `NO` — abgeleitet aus Section A                                   |
| `Contextual Inlinks`        | Anzahl und Quelle der kontextuellen Links **auf** diese Seite             |
| `Contextual Outlinks`       | Anzahl und Ziel der kontextuellen Links **von** dieser Seite              |
| `Conversion Path`           | der vorgesehene Weg zur Anfrage/Conversion                                |
| `Current Findability State` | einer der vier Werte aus §2.2                                             |
| `Owner`                     | AP, der den offenen Anteil schließt                                       |
| `Deferred Gate ID`          | `DLI-xx` aus Section C, falls vorhanden — sonst `—`                       |
| `Evidence`                  | wie gemessen (Datei:Zeile, HTTP-Status, Testname)                         |

### 2.2 Zulässige States

| Wert                              | Bedeutung                                                                                |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `FINDABLE`                        | über mindestens einen bewussten, funktionierenden Pfad erreichbar                        |
| `INTENTIONAL_LIMITED_FINDABILITY` | bewusst eingeschränkt (z. B. unlisted); Grund und Entscheidungsbezug sind Pflicht        |
| `DEFERRED_ROUTE_OWNER`            | Route/Call-Site gehört einem späteren AP; `DLI-xx` in Section C ist Pflicht              |
| `UNINTENDED_DIRECT_URL_ONLY`      | **Defekt.** Seite ist faktisch nur per Direkt-URL erreichbar, ohne dass das gewollt wäre |

### 2.3 Closure-Ziel

Für **strategische, aktuell existente** Seiten gilt in Section D:

```text
UNINTENDED_DIRECT_URL_ONLY = 0
```

### 2.4 PT07.3-Messung (2026-08-26)

Die Werte wurden aus gebauter Header-/Footer-Navigation, den aktuellen React-Links, den kanonischen
Datenquellen und `check:internal-findability` erhoben. `YES` in der Globalspalte bedeutet: mindestens
Header **oder** Footer verlinkt das Ziel direkt. Ein Locale-Präfix steht nicht im Quellcode, weil der
Router den aktiven `/<lang>`-Basename ergänzt. Consumer bleibt EN-only und bewusst ohne B2B-Shell;
seine drei Seiten sind untereinander verlinkt, bis AP21 die x10-Routenfreigabe und den dezenten
B2B-Einstieg liefert (`DLI-01`).

| Route                                                                     | Content Type | Header/Footer Findability | Search Findability | Contextual Inlinks                                             | Contextual Outlinks                                              | Conversion Path                   | Current Findability State       | Owner                        | Deferred Gate ID | Evidence                                                                    |
| ------------------------------------------------------------------------- | ------------ | ------------------------- | ------------------ | -------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------- | ------------------------------- | ---------------------------- | ---------------- | --------------------------------------------------------------------------- |
| `/`                                                                       | CT-01/CT-03  | YES                       | YES                | Logo/Footer und direkte Rückwege                               | Diagnostik, IglooPro, Epigenetik, Artikel, About, Kontakt        | Contact + `#roi-rechner`          | FINDABLE                        | AP19 (Lead-Magnet-Ausbau)    | DLI-03           | `Header.tsx`; `Footer.tsx`; Homepage-Sections; Hash-Guard                   |
| `/about`                                                                  | CT-01/CT-03  | YES                       | YES                | Homepage + Footer/Header                                       | IglooPro + Kontakt/ROI                                           | Contact + ROI                     | FINDABLE                        | AP07                         | —                | `AboutSection.tsx`; `AboutPage.tsx`; Shell                                  |
| `/contact`                                                                | CT-10        | YES                       | YES                | globale CTA, Services, Events, Epigenetik, Artikel, Downloads  | Anfrageformular/Intent-Weiche                                    | GENERAL_SALES bzw. Source-Intent  | FINDABLE                        | AP07                         | —                | `Header.tsx`; `FinalCtaSection.tsx`; Seiten-CTAs                            |
| `/support`                                                                | CT-10        | YES                       | YES                | Header/Footer und Fachcontent                                  | Kontakt + ROI                                                    | SUPPORT → Formular                | FINDABLE                        | AP07                         | —                | `Footer.tsx`; `Header.tsx`; `SupportPage.tsx`                               |
| `/events`                                                                 | CT-01/CT-03  | YES                       | YES                | Footer/Content-Navigation                                      | aktuelle Termine → `/contact`                                    | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `Footer.tsx`; `EventsPage.tsx`; Guard                                       |
| `/downloads`                                                              | CT-07        | YES                       | YES                | Footer, Epigenetik, Vitamin-D-Spray-Breadcrumb                 | IglooPro, Diagnostik, Epigenetik, Vitamin-D3-Spray               | öffentliche Datei oder Contact    | FINDABLE                        | AP19 (finaler Gate-Einstieg) | DLI-03           | `DownloadsPage.tsx`; `EpigeneticsPage.tsx`; `VitaminD3SprayPage.tsx`        |
| `/articles`                                                               | CT-01/CT-03  | YES                       | YES                | Footer/Header + Artikel-Breadcrumbs                            | 6 veröffentlichte Artikel + DE-Wissensroute                      | Content → passende Leistung       | FINDABLE                        | AP07                         | —                | `ArticlesIndexPage.tsx`; `ArticlePage.tsx`                                  |
| `/igloo-pro`                                                              | CT-01/CT-03  | YES                       | YES                | Homepage, Downloads, Fachcontent                               | Flyer + Kontakt/ROI                                              | GENERAL_SALES + Resource          | FINDABLE                        | AP07                         | —                | `IglooProHero.tsx`; `IglooProductFinalCta.tsx`; `DownloadsPage.tsx`         |
| `/diagnostics`                                                            | CT-01/CT-03  | YES                       | YES                | Homepage, Downloads, 9 Service-Breadcrumbs/Rückwege            | 9 Services + Epigenetik + Kontakt                                | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `DiagnosticsSpecialtySection.tsx`; `DiagnosticsFocusSection.tsx`; Guard 9/9 |
| `/vitamin-d3-spray`                                                       | CT-01/CT-03  | NO                        | YES                | Downloads-Kontext                                              | Produktflyer, Implantologie, IglooPro, Kontakt                   | Order/Contact + Resource          | FINDABLE                        | AP07                         | —                | `DownloadsPage.tsx`; `VitaminD3SprayPage.tsx`                               |
| `/diagnostics/dental`                                                     | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + 2 Artikel                     | Hub + 8 Services + 2 Artikel + Epigenetik/Kontakt                | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/beauty`                                                     | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars                                 | Hub + 8 Services + Epigenetik/Kontakt                            | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/longevity`                                                  | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + Artikel + Epigenetik          | Hub + 8 Services + Artikel + Epigenetik/Kontakt                  | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; `EpigeneticsPage.tsx`                    |
| `/diagnostics/poc-systemloesungen`                                        | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + 4 Artikel                     | Hub + 8 Services + 4 Artikel + Epigenetik/Kontakt                | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/praeventions-checks`                                        | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + 2 Artikel                     | Hub + 8 Services + 2 Artikel + Epigenetik/Kontakt                | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/infektion-entzuendung`                                      | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + Artikel                       | Hub + 8 Services + Artikel + Epigenetik/Kontakt                  | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/stoffwechsel-herz`                                          | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars                                 | Hub + 8 Services + Epigenetik/Kontakt                            | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/hormon-tests`                                               | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars                                 | Hub + 8 Services + Epigenetik/Kontakt                            | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/diagnostics/kompatibilitaet-integration`                                | CT-03        | YES                       | YES                | Hub-Karte + 8 Service-Sidebars + Artikel                       | Hub + 8 Services + Artikel + Epigenetik/Kontakt                  | GENERAL_SALES                     | FINDABLE                        | AP07                         | —                | `services.tsx`; `ServicePage.tsx`; Guard                                    |
| `/articles/die-gruene-praxis`                                             | CT-03        | NO                        | YES                | Artikelindex + Dental/Longevity                                | Dental + Longevity + Contact/ROI                                 | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/articles/der-unsichtbare-patient`                                       | CT-03        | NO                        | YES                | Artikelindex + POC/Präventionschecks                           | POC-Systeme + Präventionschecks + Contact/ROI                    | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/articles/die-5-minuten-diagnose`                                        | CT-03        | NO                        | YES                | Artikelindex + POC/Dental                                      | POC-Systeme + Dental + Contact/ROI                               | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/articles/the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | CT-03        | NO                        | YES                | Artikelindex + Kompatibilität/POC                              | Kompatibilität + POC-Systeme + Contact/ROI                       | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/articles/die-performance-formel-effizienz-in-der-poc-diagnostik`        | CT-03        | NO                        | YES                | Artikelindex + POC-Systeme                                     | POC-Systeme + Contact/ROI                                        | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/articles/precision-in-point-of-care-the-key-to-patient-safety`          | CT-03        | NO                        | YES                | Artikelindex + Präventionschecks/Entzündung                    | Präventionschecks + Entzündungsmarker + Contact/ROI              | passende Leistung → GENERAL_SALES | FINDABLE                        | AP17 (Body)                  | —                | `articles.ts`; `ArticlePage.tsx`; reciprocal guard                          |
| `/epigenetics`                                                            | CT-01/CT-03  | YES                       | YES                | Header/Footer, Homepage, Diagnostik, 3 Vertiefungen, 6 Befunde | 3 Vertiefungen + 6 Befunde + reale Anchors + Downloads/Longevity | Source-Intent → Contact           | FINDABLE                        | AP15 (finale Inquiry)        | DLI-02           | `EpigeneticsPage.tsx`; `EpiSubpage.tsx`; Guard                              |
| `/epigenetics/grundlagen`                                                 | CT-02/CT-03  | YES                       | YES                | Hub + Footer + 2 Vertiefungen                                  | Hub + 2 Vertiefungen + Contact                                   | Source-Intent → Contact           | FINDABLE                        | AP15 (Body)                  | —                | `VERTIEFUNGEN`; `EpiSubpage.tsx`; HTTP/Guard                                |
| `/epigenetics/studienlage`                                                | CT-02/CT-03  | YES                       | YES                | Hub + Footer + 2 Vertiefungen                                  | Hub + 2 Vertiefungen + Contact                                   | Source-Intent → Contact           | FINDABLE                        | AP15 (Body)                  | —                | `VERTIEFUNGEN`; `EpiSubpage.tsx`; HTTP/Guard                                |
| `/epigenetics/unterlagen`                                                 | CT-07        | YES                       | YES                | Hub + Footer + 2 Vertiefungen                                  | Hub + 2 Vertiefungen + Contact + Assets                          | Source-Intent → Contact/Download  | FINDABLE                        | AP15 (Body)                  | —                | `VERTIEFUNGEN`; `EpiSubpage.tsx`; HTTP/Guard                                |
| `/epigenetics/musterbefund/metabolic-health`                              | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/epigenetics/musterbefund/healthy-aging`                                 | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/epigenetics/musterbefund/biologische-altersuhr`                         | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/epigenetics/musterbefund/telomer-analyse`                               | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/epigenetics/musterbefund/stress-monitor`                                | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/epigenetics/musterbefund/healthy-sport`                                 | CT-02        | NO                        | YES                | Hub-Karte + 5 Befund-Switcher                                  | Hub + 5 Befunde + Download + Contact                             | Panel-Intent → Contact            | FINDABLE                        | AP16 (Body)                  | —                | `EpigeneticsPanels.tsx`; `MusterbefundPage.tsx`; Guard 6/6                  |
| `/consumer/vitamin-d3-spray`                                              | CT-01/CT-03  | NO                        | NO                 | Mask + Duo (EN-Strecke)                                        | Duo + Order/Support-Mail                                         | Consumer Order                    | INTENTIONAL_LIMITED_FINDABILITY | AP21                         | DLI-01           | `MaskPage.tsx`; `DuoPage.tsx`; IA §10.8; server EN redirect                 |
| `/consumer/hydrating-masks`                                               | CT-01/CT-03  | NO                        | NO                 | Duo (EN-Strecke)                                               | Spray + Duo + Order                                              | Consumer Order                    | INTENTIONAL_LIMITED_FINDABILITY | AP21                         | DLI-01           | `DuoPage.tsx`; `MaskPage.tsx`; IA §10.8; server EN redirect                 |
| `/consumer/inside-out-duo`                                                | CT-01/CT-03  | NO                        | NO                 | Spray + Mask (EN-Strecke)                                      | Spray + Mask + Order                                             | Consumer Order                    | INTENTIONAL_LIMITED_FINDABILITY | AP21                         | DLI-01           | `SprayPage.tsx`; `MaskPage.tsx`; `DuoPage.tsx`; server EN redirect          |
| `/privacy`                                                                | CT-08        | YES                       | NO                 | Footer                                                         | Legal-/Home-Kontext                                              | keiner                            | FINDABLE                        | AP20                         | —                | `Footer.tsx`; IA §10.9 intentional Search exclusion                         |
| `/imprint`                                                                | CT-08        | YES                       | NO                 | Footer                                                         | Legal-/Home-Kontext                                              | keiner                            | FINDABLE                        | AP20                         | —                | `Footer.tsx`; IA §10.9 intentional Search exclusion                         |
| `/terms`                                                                  | CT-08        | YES                       | NO                 | Footer                                                         | Legal-/Home-Kontext                                              | keiner                            | FINDABLE                        | AP20                         | —                | `Footer.tsx`; IA §10.9 intentional Search exclusion                         |
| `/vitamin-d3-implantologie`                                               | CT-03/CT-08  | NO                        | NO                 | Artikelindex + Vitamin-D3-Spray + S3-Seite                     | Dental + IglooPro + Artikel + S3 + Contact                       | B2B Order/GENERAL_SALES           | FINDABLE                        | AP08 (Locale-Policy)         | —                | `ArticlesIndexPage.tsx`; `VitaminD3SprayPage.tsx`; `S3LeitliniePage.tsx`    |
| `/s3_leitlinie`                                                           | CT-03/CT-08  | NO                        | NO                 | Vitamin-D3-Implantologie                                       | Dental + IglooPro + Artikel + Contact                            | GENERAL_SALES                     | FINDABLE                        | AP08 (Locale-Policy)         | —                | `VitaminD3ImplantologyPage.tsx`; `S3LeitliniePage.tsx`                      |

**Bilanz PT07.3:** 43 strategische aktuelle Routen bewusst klassifiziert · 40 `FINDABLE` ·
3 `INTENTIONAL_LIMITED_FINDABILITY` (Consumer, EN-only und gegenseitig intern verlinkt) ·
0 `DEFERRED_ROUTE_OWNER` · **0 `UNINTENDED_DIRECT_URL_ONLY`**.

---

## 3. Section C — Deferred Search / Link Integration Register

**Dies ist der einzige zulässige Ort** für `DEFERRED_SEARCH_INTEGRATION` und
`DEFERRED_INTERNAL_LINK_INTEGRATION` in AP07. Ownerlose Deferred-Prosa außerhalb dieses Registers ist
ein Closure-Fehler (`C07-39`).

### 3.1 ID-Systematik

| Präfix   | Typ                                  | Beispiel |
| -------- | ------------------------------------ | -------- |
| `DSI-xx` | `DEFERRED_SEARCH_INTEGRATION`        | `DSI-01` |
| `DLI-xx` | `DEFERRED_INTERNAL_LINK_INTEGRATION` | `DLI-01` |

Fortlaufend zweistellig, **nie wiederverwendet**, auch nicht nach `RESOLVED`. Die Systematik folgt der
im Repository etablierten Konvention kurzer Präfix-IDs (`DG-xx`, `IAD-xx`, `QD-x`, `CD-x`, `ND-x`,
`DEC-RL-xxx`) und ergänzt sie, statt eine neue Form einzuführen.

### 3.2 Pflichtfelder je Eintrag

Jeder Eintrag führt **alle** Felder. Ein fehlendes Feld ist ein `C07-39`-Fehler:

```text
ID:                     DSI-xx | DLI-xx
Type:                   DEFERRED_SEARCH_INTEGRATION | DEFERRED_INTERNAL_LINK_INTEGRATION
Description:            was konkret fehlt
Source route:           von wo aus verlinkt/indexiert würde
Target route:           worauf
Current route existence: YES | NO  (gemessen)
Reason:                 warum AP07 es nicht selbst schließt
Owner AP:               genau ein AP
Required before:        das Gate, vor dem es geschlossen sein muss
Current safe state:     was heute stattdessen passiert — und warum das kein Defekt ist
Current findability:    der Section-B-State der Zielseite heute
Launch/owner gate:      Bezug zu RELEASE-ACCEPTANCE / QUALITY-GATES, falls vorhanden
AP07 closure blocker:   YES | NO
Evidence:               Datei:Zeile, HTTP-Status, Testname
Status:                 OPEN | READY_FOR_OWNER | RESOLVED
```

### 3.3 Status-Semantik

| Status            | Bedeutung                                                                                 |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `OPEN`            | Lücke besteht, Vorbedingung des Owners ist noch nicht erfüllt                             |
| `READY_FOR_OWNER` | Vorbedingung ist erfüllt, der Owner-AP kann die Integration jetzt ausführen               |
| `RESOLVED`        | Die Integration ist **real ausgeführt und belegt** — nicht „geplant", nicht „freigegeben" |

**`READY` allein ist als Status unzulässig.** Ein Deferred Gate, dessen Integration real noch fehlt,
ist niemals `READY` — das ist die False-Ready-Semantik, die `AP04-RECOVERY` ausgeschlossen hat
(`CONTEXT-INDEX.md` §4, Deferred-Gate-Modell: „Ein Deferred Gate ist nie `READY` und nie erledigt").

### 3.4 Forward-Dependency-Regel (Deadlock-Schutz)

Ein Deferred Gate darf AP07 **nicht** blockieren, wenn sein Owner ein **späterer** AP ist. Ein AP darf
sich nicht über einen späteren Owner-AP selbst blockieren — das erzeugt einen seriellen Zyklus
(`CONTEXT-INDEX.md` §4). Umgekehrt darf die Deferred-Regel **nicht** als Ausrede für AP07-eigene
Arbeit dienen; die Abgrenzung steht in §4.3.

### 3.5 PT07.1-Registereinträge

#### DSI-01

| Feld                    | Wert                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DSI-01`                                                                                                                                                |
| Type                    | `DEFERRED_SEARCH_INTEGRATION`                                                                                                                           |
| Description             | Epigenetik-Hub und drei Vertiefungen sind aktive Suchziele mit x10 Search Metadata; der Seitenkörper ist in acht Locales weiterhin englischer Fallback. |
| Source route            | globale Suche (`SearchModal`)                                                                                                                           |
| Target route            | `/epigenetics`, `/epigenetics/grundlagen`, `/epigenetics/studienlage`, `/epigenetics/unterlagen`                                                        |
| Current route existence | YES                                                                                                                                                     |
| Reason                  | Search Metadata gehört AP07; fachlich lokalisierter Body gehört AP15 und bleibt AP04 `DG-01`.                                                           |
| Owner AP                | AP15                                                                                                                                                    |
| Required before         | AP15 Closure / Launch Gate 1 und 6                                                                                                                      |
| Current safe state      | Treffer sind aktiv und kennzeichnen nur die Route; die bestehenden Seiten zeigen weiterhin die ehrliche FallbackNotice.                                 |
| Current findability     | FINDABLE                                                                                                                                                |
| Launch/owner gate       | AP04 `DG-01`; Language Gate 1; Epigenetics Gate 6                                                                                                       |
| AP07 closure blocker    | NO                                                                                                                                                      |
| Evidence                | `CONTENT-MATRIX.md` §24 `DG-01`; `useSearch.ts:66-73,130-137`; `check:search-index`                                                                     |
| Status                  | OPEN                                                                                                                                                    |

#### DSI-02

| Feld                    | Wert                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DSI-02`                                                                                                                        |
| Type                    | `DEFERRED_SEARCH_INTEGRATION`                                                                                                   |
| Description             | Sechs Musterbefunde sind aktive Suchziele mit x10 Search Metadata; die Body-JSONs existieren nur in DE/EN.                      |
| Source route            | globale Suche (`SearchModal`)                                                                                                   |
| Target route            | `/epigenetics/musterbefund/{metabolic-health,healthy-aging,biologische-altersuhr,telomer-analyse,stress-monitor,healthy-sport}` |
| Current route existence | YES                                                                                                                             |
| Reason                  | Search Metadata gehört AP07; Body-Datenmodell und acht fehlende Inhalte gehören AP16 und bleiben AP04 `DG-02`.                  |
| Owner AP                | AP16                                                                                                                            |
| Required before         | AP16 Closure / Launch Gate 1 und 6                                                                                              |
| Current safe state      | Treffer sind aktiv; die Seiten liefern für Nicht-DE weiterhin den bestehenden EN-Fallback samt FallbackNotice.                  |
| Current findability     | FINDABLE                                                                                                                        |
| Launch/owner gate       | AP04 `DG-02`; Language Gate 1; Epigenetics Gate 6                                                                               |
| AP07 closure blocker    | NO                                                                                                                              |
| Evidence                | `CONTENT-MATRIX.md` §24 `DG-02`; `meta.ts:26-33`; `check:search-index` 6/6                                                      |
| Status                  | OPEN                                                                                                                            |

#### DSI-03

| Feld                    | Wert                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| ID                      | `DSI-03`                                                                                                                                   |
| Type                    | `DEFERRED_SEARCH_INTEGRATION`                                                                                                              |
| Description             | Sechs veröffentlichte Artikel sind slug-basiert aktiv suchbar und besitzen x10 Search Metadata; Volltexte fehlen weiterhin in FR/PT/DA/NL. |
| Source route            | globale Suche (`SearchModal`)                                                                                                              |
| Target route            | sechs `/articles/<slug>` aus `src/data/articles.ts`                                                                                        |
| Current route existence | YES                                                                                                                                        |
| Reason                  | Search Metadata gehört AP07; freigegebene Artikelvolltexte gehören AP17 und bleiben AP04 `DG-05`.                                          |
| Owner AP                | AP17                                                                                                                                       |
| Required before         | AP17 Closure / Launch Gate 1                                                                                                               |
| Current safe state      | Treffer sind aktiv; Search-Titel/-Beschreibungen sind lokalisiert, ohne den Body als READY zu deklarieren.                                 |
| Current findability     | FINDABLE                                                                                                                                   |
| Launch/owner gate       | AP04 `DG-05`; Language Gate 1                                                                                                              |
| AP07 closure blocker    | NO                                                                                                                                         |
| Evidence                | `CONTENT-MATRIX.md` §24 `DG-05`; `articles.ts:3-69`; Slug-Guard 6/6                                                                        |
| Status                  | OPEN                                                                                                                                       |

#### DSI-04

| Feld                    | Wert                                                                                                                                                                                                            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DSI-04`                                                                                                                                                                                                        |
| Type                    | `DEFERRED_SEARCH_INTEGRATION`                                                                                                                                                                                   |
| Description             | Die drei laut IA `SEARCHABLE` Consumer-Landingpages werden noch nicht aktiv indexiert, weil neun Locale-URLs serverseitig auf `/en/consumer/*` umleiten.                                                        |
| Source route            | globale B2B-Suche (`SearchModal`)                                                                                                                                                                               |
| Target route            | `/consumer/vitamin-d3-spray`, `/consumer/hydrating-masks`, `/consumer/inside-out-duo`                                                                                                                           |
| Current route existence | YES                                                                                                                                                                                                             |
| Reason                  | Ein aktiver locale-aware Treffer wäre derzeit unehrlich; Consumer x10 Runtime/Body ist AP21-owned. AP07 baut keine Redirects und keine Consumer-i18n-Migration.                                                 |
| Owner AP                | AP21                                                                                                                                                                                                            |
| Required before         | AP21 PT21.1/PT21.6 Closure, vor Launch Gate 1 und 4                                                                                                                                                             |
| Current safe state      | Keine aktiven Consumer-Suchtreffer; die drei realen EN-Seiten sind organisch/direkt und innerhalb der Consumer-Strecke gegenseitig verlinkt, ohne Nutzer aus neun Locales auf eine Redirect-Quelle zu schicken. |
| Current findability     | INTENTIONAL_LIMITED_FINDABILITY — B2C/unlisted gemäß IA §10.8, mit realen Crosslinks innerhalb der EN-Strecke; x10 Search bleibt ownergebunden.                                                                 |
| Launch/owner gate       | `REST-03`, `DEC-RL-006`; Language Gate 1; SEO Gate 4                                                                                                                                                            |
| AP07 closure blocker    | NO — die spätere x10-Integration ist vollständig ownergebunden; `DLI-01` dokumentiert den fehlenden B2B-Kontexteinstieg.                                                                                        |
| Evidence                | `App.tsx:330-353`; `server.ts` Consumer-Redirectzweig; `SprayPage.tsx`, `MaskPage.tsx`, `DuoPage.tsx`; IA §10.8; AP04 `DG-03`                                                                                   |
| Status                  | OPEN                                                                                                                                                                                                            |

### DLI-01

| Feld                    | Wert                                                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DLI-01`                                                                                                                                                                              |
| Type                    | `DEFERRED_INTERNAL_LINK_INTEGRATION`                                                                                                                                                  |
| Description             | Dezenter B2B-Kontexteinstieg zu den drei Consumer-Produkten aus passendem Produkt-/Resource-Kontext und Footer fehlt bis zur locale-sicheren Consumer-Strecke.                        |
| Source route            | `/vitamin-d3-spray`, `/downloads`, globaler Footer                                                                                                                                    |
| Target route            | `/consumer/vitamin-d3-spray`, `/consumer/hydrating-masks`, `/consumer/inside-out-duo`                                                                                                 |
| Current route existence | YES — aktuell nur `/en/consumer/*` kanonisch; neun Locale-Varianten redirecten auf EN                                                                                                 |
| Reason                  | AP07 darf keine Redirect-Quelle verlinken und weder Consumer-Routing noch die hardcodierte Consumer-Strecke x10 migrieren; Runtime/Body und finale Consumer-Verknüpfung gehören AP21. |
| Owner AP                | AP21                                                                                                                                                                                  |
| Required before         | AP21 PT21.1/PT21.6 Closure, vor Launch Gate 1 und 4                                                                                                                                   |
| Current safe state      | Keine B2B-Links auf sprachwechselnde Redirect-Quellen; EN-Seiten bleiben organisch/direkt erreichbar und sind untereinander mit realen Links verbunden.                               |
| Current findability     | INTENTIONAL_LIMITED_FINDABILITY                                                                                                                                                       |
| Launch/owner gate       | `REST-03`, `DEC-RL-006`; Language Gate 1; SEO Gate 4                                                                                                                                  |
| AP07 closure blocker    | NO — die aktuellen Seiten sind nicht direct-URL-only; der locale-sichere B2B-Einstieg benötigt zuerst AP21.                                                                           |
| Evidence                | `server.ts:519-541`; `Footer.tsx:85-104`; `SprayPage.tsx`, `MaskPage.tsx`, `DuoPage.tsx`; IA §10.8                                                                                    |
| Status                  | OPEN                                                                                                                                                                                  |

### DLI-02

| Feld                    | Wert                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DLI-02`                                                                                                                                                              |
| Type                    | `DEFERRED_INTERNAL_LINK_INTEGRATION`                                                                                                                                  |
| Description             | Epigenetik besitzt heute einen source-/panel-aware Contact-Pfad; die finale spezialisierte Inquiry-Journey bleibt noch in der Epigenetik-Seitenstrecke auszuarbeiten. |
| Source route            | `/epigenetics`, drei Vertiefungen, sechs Musterbefunde                                                                                                                |
| Target route            | `/contact?intent=quote&source=epigenetics#kontaktformular`                                                                                                            |
| Current route existence | YES                                                                                                                                                                   |
| Reason                  | AP07 stellt Findability und reale CTA-Pfade her; fachliche Inquiry-Journey und ihre finale Seitenintegration gehören AP15.                                            |
| Owner AP                | AP15                                                                                                                                                                  |
| Required before         | AP15 Closure / Epigenetics Gate 6                                                                                                                                     |
| Current safe state      | Alle Epigenetik-Flächen führen mit Source- und ggf. Panel-Kontext in das reale Kontaktformular; kein Fake-Flow und kein toter CTA.                                    |
| Current findability     | FINDABLE                                                                                                                                                              |
| Launch/owner gate       | `IAD-11`; `DEC-RL-014`; Epigenetics Gate 6                                                                                                                            |
| AP07 closure blocker    | NO — der aktuelle GENERAL_SALES-Fallback ist funktional und kontextbehaftet.                                                                                          |
| Evidence                | `EpigeneticsPage.tsx`; `EpiSubpage.tsx`; `MusterbefundPage.tsx`; `ContactForm.tsx` Source-Intent                                                                      |
| Status                  | OPEN                                                                                                                                                                  |

### DLI-03

| Feld                    | Wert                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ID                      | `DLI-03`                                                                                                                                                                |
| Type                    | `DEFERRED_INTERNAL_LINK_INTEGRATION`                                                                                                                                    |
| Description             | Der sekundäre Lead-Magnet ist kontextuell als ROI-Rechner/Report verankert; eine finale gated Resource-/Delivery-Journey ist noch nicht vorhanden.                      |
| Source route            | `/`, Services, Artikel, IglooPro, Events, Support                                                                                                                       |
| Target route            | `/#roi-rechner`                                                                                                                                                         |
| Current route existence | YES — reale Hash-ID `roi-rechner`; finale Gate-/Delivery-Stufe noch nicht vorhanden                                                                                     |
| Reason                  | AP07 besitzt nur CTA-Findability; gated Resource-Seite und Content-/Gate-Modell gehören AP19.                                                                           |
| Owner AP                | AP19                                                                                                                                                                    |
| Required before         | AP19 Closure / Lead Gate 9                                                                                                                                              |
| Current safe state      | Reale locale-aware Links führen zum vorhandenen ROI-Rechner; dessen Report-CTA führt sicher zu `/contact`, ohne Download, Persistenz oder Mailzustellung vorzutäuschen. |
| Current findability     | FINDABLE                                                                                                                                                                |
| Launch/owner gate       | `IAD-07`; `DEC-RL-016`; Lead Gate 9                                                                                                                                     |
| AP07 closure blocker    | NO — der aktuelle Rechner- und Kontaktweg ist real; nur die finale Gate-Mechanik ist deferred.                                                                          |
| Evidence                | `RoiCalculatorSection.tsx:140,243-267`; `FinalCtaSection.tsx`; `ScrollToHash`; `CONTENT-MATRIX.md` AP19-Handoff                                                         |
| Status                  | OPEN                                                                                                                                                                    |

---

## 4. Regeln für sichtbare Linkbeschriftungen und i18n-Grenzen

### 4.1 x10-Regel für AP07-eigene Linklabels

Die pauschale Formulierung „x10 neue Linklabels" wird ersetzt durch:

> Alle innerhalb AP07 **technisch direkt implementierbaren** sichtbaren AP07-owned Linklabels sind
> x10 lokalisiert.
>
> Linkintegration an Call-Sites, die erst durch eine dokumentierte spätere **AP08/AP21-owned
> i18n-Migration** technisch möglich wird, darf ausschließlich als ownergebundenes
> `DEFERRED_INTERNAL_LINK_INTEGRATION` Gate offen bleiben.
>
> Deferred darf **nicht** zu `UNINTENDED_DIRECT_URL_ONLY` führen.

Diese Formulierung ist verbindlich und muss wortgleich in `PT07.3`, der AP07-DoD, den
AP07-Invarianten, der Closure-Matrix und dem `AP07-CLOSURE`-Prompt stehen.

### 4.2 Technische Ausnahme — kein AP07→AP08-Deadlock

Ist die notwendige **Quell-Call-Site** heute nicht `t()`-/i18n-fähig und gehört genau diese technische
Migration laut kanonischem Owner-Vertrag **AP08** und/oder **AP21**, dann gilt für `PT07.3`:

- den Link **nicht** in zehn hartkodierten Varianten hineinpatchen;
- die Consumer-Komponente **nicht** eigenmächtig i18n-fähig umbauen;
- **keine** AP08-owned Namespace-/`t()`-Migration ausführen;
- stattdessen ein `DLI-xx` in Section C anlegen, mit eindeutigem Owner, `Required before` und
  `Current safe state`.

### 4.3 Wann `PT07.3` mit einem solchen `DLI` trotzdem PASS ist

Alle sieben Bedingungen müssen gelten:

1. die technische Voraussetzung gehört nachweislich einem späteren Owner;
2. AP07 zieht diese Arbeit nicht vor;
3. das `DLI` ist vollständig nach §3.2 in Section C registriert;
4. der Owner ist eindeutig;
5. `Required before` ist eindeutig;
6. `Current safe state` ist dokumentiert;
7. die Zielseite ist **aktuell nicht** ungewollt `DIRECT_URL_ONLY`.

Zu (7): Die Seite muss heute über mindestens einen anderen bewussten, funktionierenden
Findability-Pfad erreichbar sein — Suche, ein bestehender interner Link oder ein anderer
scope-konformer aktueller Pfad. **Suche allein** ist als vorläufiger Safe State nur zulässig, wenn
Section B ausdrücklich dokumentiert, dass die kontextuelle Linkintegration wegen der späteren
technischen Call-Site-Ownership deferred ist.

### 4.4 Wann es ein echter `PT07.3`-Blocker bleibt

- die Seite bleibt ungewollt `DIRECT_URL_ONLY`;
- eine AP07-owned, bereits i18n-fähige Call-Site wäre vorhanden, AP07 ergänzt den Link aber nicht;
- kein Owner existiert;
- `Required before` fehlt;
- `Current safe state` fehlt;
- es entstünde ein toter Link;
- die Deferred-Regel wird als Ausrede für fehlende AP07-eigene Arbeit benutzt.

### 4.5 AP08-Grenze

AP07 **darf** Such-Metadaten (Titel/Beschreibungen) x10 erzeugen. AP07 darf **nicht** vorziehen:
i18n-Kern-Neuarchitektur · Consumer-`t()`-Migration · Epigenetics-Body x10 · Befund-Body x10.

---

## 5. Section D — AP07 Closure Evidence Summary

**Owner der Befüllung:** `AP07-CLOSURE`.

### 5.1 Closure-Messung (2026-08-26)

| Nachweis                           | Ergebnis                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| Search Coverage                    | PASS — 43/43 strategische Routen klassifiziert; 35 aktive Ziele                                   |
| Search Metadata x10                | PASS — 35/35 aktive Einträge mit Titel, Beschreibung und Result-Type-Label in 10/10 Sprachen      |
| Dead Search Targets                | 0; `/diagnostics/sports` absent und HTTP 404                                                      |
| Search Route Validation            | PASS — 350/350 locale-aware Search-URLs HTTP 200                                                  |
| SearchModal                        | PASS — AP05-Dialog, Semantik, Initialfokus, Fokusfalle/-rückgabe, Escape und Statusansagen        |
| Keyboard / Focus / Mobile          | PASS — 9/9 relevante E2E einschließlich 390-px- und Reduced-Motion-Smoke                          |
| Internal Findability               | PASS — 43/43 strategische Quellseiten, 2.538 Links, 115 eindeutige Ziele und 112 Hash-Links valid |
| `UNINTENDED_DIRECT_URL_ONLY`       | 0                                                                                                 |
| Deferred Register                  | PASS — 7 Einträge (`DSI-01`–`DSI-04`, `DLI-01`–`DLI-03`), IDs eindeutig, 15/15 Felder             |
| Owner-/Required-before-/Safe-State | PASS — 7/7 vollständig                                                                            |
| False-ready Entries                | 0                                                                                                 |
| Ownerlose Deferred-Prosa           | 0                                                                                                 |
| AP04 Deferred-Gate-Integrität      | PASS — spätere Body-/Runtime-/Asset-Gates bleiben offen                                           |
| C07 Closure                        | **PASS — 43/43 Gates**                                                                            |

### 5.2 `C07-38` — Direct-URL-Only-Schutz

`C07-38` prüft Section B.

**Ein Deferred Internal Link Gate allein genügt nicht**, um eine Seite von
`UNINTENDED_DIRECT_URL_ONLY` auf PASS zu setzen. Die Closure muss anhand Section B belegen, dass ein
**aktueller, bewusster, real funktionierender** Findability-Pfad existiert. Fehlt er, ist das Gate
FAIL — unabhängig davon, wie sauber das zugehörige `DLI` registriert ist.

### 5.3 `C07-39` — Deferred-Register-Integrität

`C07-39` prüft Section C. PASS nur wenn **alle** Punkte gelten:

- alle Deferred Search-/Link-Integrationen sind dort registriert;
- IDs sind eindeutig;
- `Type` ist vorhanden;
- `Owner AP` ist vorhanden und eindeutig;
- `Required before` ist vorhanden;
- `Current safe state` ist vorhanden;
- `Evidence` ist vorhanden;
- `Status` ist korrekt und nicht `READY`;
- keine noch nicht existierende Route ist fälschlich als aktiv geführt;
- kein Deferred Gate ist fälschlich `READY`/`RESOLVED`, obwohl die Integration real fehlt;
- außerhalb des Registers existiert keine ownerlose Deferred-Prosa.

### 5.4 Closure-Gate- und Invariantenbilanz

- `C07-01`–`C07-43`: **43/43 PASS**.
- `FIND-01`–`FIND-30`: **30/30 PASS**.
- Typecheck, 184/184 Unit-/Component-Tests, Production Build und 9/9 relevante E2E: **PASS**.
- Voller Lint bleibt mit 126 Findings und voller Prettier-Check mit 38 Dateien auf der dokumentierten
  Baseline; alle AP07-/Closure-berührten Dateien sind lint- und format-sauber.
- Die zunächst gefundenen Rich-Content-Altziele `/<locale>/blog/vitamin-d3-implantologie` und
  `/<locale>/case-studies/32reasons` sind in allen zehn Locales entfernt: der Implantologie-Link führt
  auf die reale Route `/<locale>/vitamin-d3-implantologie`, der Backlog-Case-Study-Text ist kein Link.

---

## 6. Owner-Grenzen im Überblick

| Grenze                       | Owner           | AP07 darf                                             | AP07 darf nicht                                          |
| ---------------------------- | --------------- | ----------------------------------------------------- | -------------------------------------------------------- |
| Route Registry / Redirects   | **AP10**        | Route-Existenz **ablesen** und als Evidenz führen     | Routen definieren, umbenennen, Redirects bauen           |
| i18n-Kern, `t()`-Migration   | **AP08**        | Such-Metadaten x10 erzeugen                           | Namespace-/`t()`-Migration, Body-Lokalisierung vorziehen |
| Consumer-Strecke             | **AP21**        | Consumer als Suchziel führen, sofern sinnvoll         | Consumer-Komponenten i18n-fähig umbauen                  |
| Epigenetik-Säule und -Inhalt | **AP15**        | vorhandene Epigenetik-Routen indexieren und verlinken | fehlende Inhalte selbst schreiben                        |
| Content-Status               | **AP04-Modell** | auf `CONTENT-MATRIX.md` verweisen                     | Content-Status hier zweitführen                          |

### 6.1 Hinweis zu den Epigenetik-Vertiefungsseiten

Der Planning-Fix hat den Ist-Zustand gemessen, weil eine ältere Planungsannahme sie als „noch nicht
existent" führte. **Gemessen am `AP06-CLOSURE`-Stand gilt:**

| Route                      | Route definiert   | HTTP | Intern verlinkt      |
| -------------------------- | ----------------- | ---- | -------------------- |
| `/epigenetics/grundlagen`  | `src/App.tsx:496` | 200  | ja — `Footer.tsx:68` |
| `/epigenetics/studienlage` | `src/App.tsx:504` | 200  | ja — `Footer.tsx:69` |
| `/epigenetics/unterlagen`  | `src/App.tsx:512` | 200  | ja — `Footer.tsx:70` |

Diese drei Routen sind **nicht** „nicht existent". `MASTER-SCOPE.md` AP07 PT07.1 §4 führt sie
ausdrücklich als zu indexierende Ziele. Sie gehören damit in Section A als reguläre Zeilen, **nicht**
als `SEARCH_DEFERRED_ROUTE_OWNER`.

Der reale AP15-Anteil ist ein **Inhalts-**, kein Routenthema: der Epigenetik-Content liegt nur in DE
und EN vollständig vor. Fehlt dadurch die x10-Such-Metadatenparität, ist das ein
`SEARCH_DEFERRED_CONTENT` mit `DSI-xx` und **Owner AP15**, nicht `SEARCH_DEFERRED_ROUTE_OWNER`.
Die generelle Regel bleibt unverändert gültig: **eine real nicht existierende Route wird weder aktiv
indexiert noch intern verlinkt** — sie wird als `DSI`/`DLI` mit Owner registriert, damit kein toter
Link und kein toter Treffer entsteht.

---

## 7. Änderungsregel

Dieses Dokument wird **nur** von AP07-Primärtasks und der AP07-Closure fortgeschrieben. Änderungen an
Owner-Grenzen (§6) oder an der x10-Regel (§4.1) sind Scope-Änderungen und laufen über
`SCOPE-CHANGELOG.md`, nicht über eine Bearbeitung hier.
