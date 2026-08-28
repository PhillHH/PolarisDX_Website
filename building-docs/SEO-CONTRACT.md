# SEO-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

---

## 1. Purpose

Dieser Vertrag ist die kanonische AP09-Regel- und Evidence-Datei. Er legt fest, welche Zusagen die Site
gegenüber Suchmaschinen macht — Canonical, hreflang, Indexierbarkeit, Sitemap, Structured Data — und
welche davon niemals gebrochen werden dürfen.

**Der Leitsatz:** _Routing-Wahrheit speist SEO-Wahrheit._ Kein SEO-Artefakt darf eine zweite,
eigenständige Vorstellung davon haben, welche URLs existieren. Der Routenvertrag ist
`ROUTING-CONTRACT.md`; dieser Vertrag beschreibt, was daraus abgeleitet wird.

Er ist keine Route Registry, Content-SSOT, Redirect Map oder manuell gepflegte Sitemap-Wahrheit.
Historische Baseline-Messungen stehen weiterhin in `QUALITY-BASELINE-LIVE.md`; aktuelle AP09-Evidenz
steht in §11 dieses Vertrags.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zuständige APs:** **AP09** (Eigentümer), AP02 PT02.1.4 (Head zentral), AP10 (Routenwahrheit),
AP13/AP14 (Service-/Produkt-Schema), AP15/AP16 (Epigenetik/Musterbefunde), AP17/AP18 (Article/Event),
AP20 PT20.4.8 (Legal-Indexierung), AP21 PT21.6 (Consumer-SEO), AP24 (a11y-Überschneidung),
AP27 PT27.5 (Regression), AP29 (Migration), AP30/AP31 (Abnahme, Live-Check).

**Relevante Decision Locks:** `DEC-RL-001` (10 Sprachen), `DEC-RL-006` (**Consumer indexierbar**),
`DEC-RL-008` (**IglooPro `CV < 2 %`**), `REST-03` (Consumer × 10). **Baseline:**
`feat/home-leadmagnet@961f65d`. Keine Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files

| Datei                                  | Rolle                                                                                                                                                                                                           | Guard  |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `src/components/seo/SEOHead.tsx`       | Eindeutige Meta-Ausgabeschicht: Title/Description, Canonical, hreflang + x-default, robots, OG/Twitter, `og:locale:alternate`, `notFound` → `prerender-status-code`                                             | **G3** |
| `src/components/seo/seoRouteSource.ts` | Pfadlistenfreie AP09-Adaptergrenze: öffentlicher Host, gemeinsamer AP08-Sprachsatz, URL-/hreflang-Builder, Override-Host-Guard, Indexability-Vokabular; **keine Route Registry**                                | **G3** |
| `src/components/seo/sitemap.ts`        | Sitemap-spezifischer AP09-Übergangsadapter: ersetzt die bisherige Server-Tabelle, leitet dynamische Slugs aus Services, Articles und Befund-Metadaten ab und expandiert x10; **keine zentrale Route Registry**  | **G3** |
| `src/components/seo/sitemapGuard.ts`   | Kanonische G3-Validierung für XML, Host, Unique URLs, x10-/Content-Coverage, Indexability, Redirect-/404-Ausschluss, hreflang und ehrliches `lastmod`                                                           | **G3** |
| `server.ts`                            | Bestehender `NOT_FOUND_MARKER`-/HTTP-Status-Handshake; eng begrenzter Head-Render-Retry; liefert die von `sitemap.ts` erzeugte Sitemap und nutzt deren Familien für den bestehenden Known-Path-Spiegel bis AP10 | **G3** |
| `src/components/seo/structuredData.ts` | Bestehende globale Schemata und Builder plus der PT09.3-eigene minimale `createProductSchema`-Builder; Consumer-Markup übernimmt nur sichtbare Produktwahrheit und erfindet keine kommerziellen Felder          | G2     |
| `src/components/seo/index.ts`          | Barrel — jeder neue Builder muss hier exportiert werden                                                                                                                                                         | G1     |
| `index.html`                           | statische Meta-Fallbacks, die `server.ts` bei echtem Helmet-Titel entfernt                                                                                                                                      | **G3** |
| `public/robots.txt`                    | Crawler-Policy, Sitemap-Zeiger, Consumer-Indexierbarkeit                                                                                                                                                        | G1     |
| `src/data/*`, `src/content/befunde/*`  | Slug-Quellen für dynamische SEO-Ziele                                                                                                                                                                           | G2     |

Produktive Seiten importieren ausschließlich `SEOHead`; eine zweite React-/Helmet-Meta-Komponente
existiert nicht. Die statischen `index.html`-Werte sind ausschließlich SSR-Fallback und werden durch
`server.ts` entfernt, sobald der begrenzt abgesicherte Helmet-Render einen echten Title liefert.

---

## 4. Target Invariants

**S-01 · Genau ein Canonical je URL**, abgeleitet aus der **URL-Sprache**, nicht aus der
i18n-Fallback-Sprache. Form: `https://polarisdx.net/<lang><path>`. _(AP09 PT09.1.3)_

**S-02 · hreflang deckt exakt die Sprachmenge ab, in der die Seite existiert.** Für reguläre Seiten
alle zehn; für bewusst einsprachige Seiten genau eine. Zusätzlich immer **ein `x-default`**, das auf
die **deutsche** Fassung zeigt. _(AP09 PT09.1.4)_

**S-03 · Kein hreflang auf eine nicht existierende Übersetzung.** Eine Sprachalternative wird erst
beworben, wenn die Seite in dieser Sprache tatsächlich ausgeliefert wird. _(AP08 PT08.6.4)_

**S-04 · Fehlerseiten bewerben sich nicht.** Bei `notFound`: robots `noindex, follow`, **kein**
Canonical, **kein** hreflang, **kein** `og:locale:alternate` — und der Marker
`<meta name="prerender-status-code" content="404">`. _(AP09 PT09.1.6)_

**S-05 · Der 404-Handshake ist beidseitig zu erhalten.** `SEOHead` schreibt den Marker, `server.ts`
liest ihn über `NOT_FOUND_MARKER`. Umbenennen nur gleichzeitig auf beiden Seiten. _(Baseline-Härtung)_

**S-06 · Sitemap entsteht aus der Route Registry.** Nach AP10 PT10.3 keine handgepflegte Parallelliste
mehr. Jeder Registry-Pfad steht in der Sitemap, jeder Sitemap-Eintrag ist eine reale Route.
_(AP09 PT09.2.1)_

**S-07 · `lastmod` ist ehrlich.** Ein Datum spiegelt eine tatsächliche Änderung dieser URL wider.
Ein pauschaler „heute"-Wert für alle Einträge ist verboten. _(AP09 PT09.2.7)_

**S-08 · Indexierung und Sitemap widersprechen sich nie.** Eine `noindex`-Seite steht nicht in der
Sitemap; eine Sitemap-Seite trägt kein `noindex`. Betrifft insbesondere Legal.
_(AP09 PT09.2.5, AP20 PT20.4.8)_

**S-09 · Consumer-Seiten sind indexierbar — in allen zehn Sprachen.** Canonical je Locale, hreflang × 10,
produktspezifische OG-/Twitter-Bilder, Sitemap-Eintrag je Sprache. **Keine `noindex`-, keine
Basic-Auth-Logik.** _(`DEC-RL-006`, `REST-03`, AP21 PT21.6)_

**S-10 · Epigenetik ist vollständig indexierbar.** Hub + drei Vertiefungsseiten + sechs Musterbefunde,
je × 10, mit eigenen Titles/Descriptions und passendem Structured Data. _(AP15 PT15.2.5, AP16 PT16.4)_

**S-11 · Dynamische Routen tragen individuelle Metadaten.** Artikel, Services und Musterbefunde erhalten
je eigene Title/Description; ein unbekannter Slug fällt auf S-04 zurück. _(AP16 PT16.4.1)_

**S-12 · Structured Data behauptet nie mehr als die sichtbare, freigegebene Seite.** Kein FAQ-Schema
ohne sichtbare FAQ, kein medizinischer Typ ohne fachliche Deckung, keine Verstärkung nicht freigegebener
Aussagen. _(AP09 PT09.4.4–.5, AP11 PT11.6.2)_

**S-13 · `CV < 2 %` bleibt über alle Kanäle konsistent** — Code, zehn Locales, Product-Schema und
sichtbare PDFs. Keine Rückmigration auf `<5 %`. _(`DEC-RL-008`, AP14 PT14.4)_

**S-14 · robots.txt bleibt konsistent zur Realität.** Technische Pfade gesperrt, Assets erlaubt,
Consumer **nicht** gesperrt, gültiger Sitemap-Zeiger, keine Preview-Domain. _(AP09 PT09.5, AP29 PT29.3)_

**S-15 · Keine Preview-/Staging-Domain in produktiven SEO-Artefakten** — weder Canonical noch Sitemap
noch OG-URL. _(AP29 PT29.3.3, AP31 PT31.3.7)_

**S-16 · Ein `<title>`, eine `<meta description>` je Seite.** Statische Fallbacks aus `index.html`
werden entfernt, sobald Helmet echte Werte liefert — das bestehende Verhalten in `server.ts` bleibt.
_(Baseline-Härtung, **N3**)_

**S-17 · Keine historische Locale-Zwangslogik.** Consumer, S3-Leitlinie und
Vitamin-D3-Implantologie folgen nach AP08 der aktuellen x10-URL-Locale. `GERMAN_ONLY_PATHS`,
`GermanOnlyPage` und Consumer-EN-Zwang sind aus der Runtime entfernt und dürfen nicht zurückkehren.

---

## 5. Current Known Debt

| ID       | Schuld                                                                                                                                                           | Beleg                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **SD-1** | **RESOLVED PT09.2:** kein Request-/Build-Datum; 60 Article-URLs nutzen reale Publikationsdaten, 330 URLs ohne belastbare Änderungsmetadaten lassen `lastmod` weg | `sitemap.ts`, G3                       |
| **SD-2** | **RESOLVED PT09.2:** `privacy`, `imprint`, `terms` bleiben produktiv `noindex` und sind vollständig aus der Sitemap ausgeschlossen; Widersprüche 0               | G3 + Production SSR                    |
| **SD-3** | **RESOLVED PT09.2:** Consumer, S3-Leitlinie und Vitamin-D3-Implantologie sind gemäß AP08-Runtime jeweils x10 in der Sitemap; keine Single-Language-Blöcke        | `sitemap.ts`, G3                       |
| **SD-4** | **RESOLVED PT09.1:** `GERMAN_ONLY_PATHS`/`GermanOnlyPage` und Consumer-EN-Zwang sind entfernt; SEOHead folgt x10 ohne Sondertabelle                              | AP08 Closure + PT09.1 Tests            |
| **SD-5** | **RESOLVED PT09.1 für SEOHead/404:** fokussierte Unit- und Production-SSR-Regressionstests vorhanden; Sitemap-/Robots-Breitengates bleiben PT09.2/PT09.5         | `SEOHead.test.tsx`, `seo-head.spec.ts` |
| **SD-6** | **Meta-Description-Guard nicht verdrahtet.** `scripts/check-meta-descriptions.mjs` existiert, ist in keinem npm-Script und in keinem CI-Schritt referenziert     | `QUALITY-BASELINE-LIVE.md` §17         |
| **SD-7** | **RESOLVED PT09.2:** aktuelle Messung und Server-Kommentar nennen 39 Route Families × 10 = 390 eindeutige URLs                                                   | G3 + Production SSR                    |
| **SD-8** | **Asset-Asymmetrie** — 17 deutsche gegen 9 englische Epigenetik-PDFs; hreflang darf auf fehlende Assets nicht verweisen (S-03)                                   | gemessen                               |

Positiv festzuhalten: **Canonical, hreflang, x-default, `no-store`, echte 404 und die Report-Only-CSP
funktionieren heute** (`QUALITY-BASELINE-LIVE.md` §13.3 D/F/G). Diese Baseline-Härtung ist zu **schützen**,
nicht neu zu bauen.

---

## 6. Modification Rules

**M-01 — SEO-Artefakte werden abgeleitet, nie parallel gepflegt.** Wer eine Route ändert, ändert die
Sitemap über die Registry, nicht daneben. Vor AP10 PT10.3 gilt die Spiegelpflicht aus
`ROUTING-CONTRACT.md` §6 M-01.

**M-02 — `SEOHead.tsx` und `server.ts` nie aus `main` übernehmen.** `BRANCH-RECONCILIATION-MAP.md`
**N2**: `main` löscht das `notFound`-Prop und die German-only-Behandlung. **N1**: `main`s `server.ts`
verliert die 404-/Redirect-/Cache-Härtung. Nur Hunks.

**M-03 — `structuredData.ts` nur additiv.** Neue Builder ergänzen und im Barrel `seo/index.ts`
exportieren. **N14**: `main`s Fassung verliert die Datumsnormalisierung, von der `createArticleSchema`
abhängt. Import-Kandidat **A11** (`createItemListSchema`) ist additiv und erlaubt.

**M-04 — Historische Sprachzwänge nicht reaktivieren.** Es gibt keine produktive
`GERMAN_ONLY_PATHS`-Spiegelung mehr. Consumer, S3 und Implantology bleiben x10.

**M-05 — Neue Structured-Data-Typen brauchen eine sichtbare Entsprechung** auf der Seite und, bei
fachlichen Aussagen, eine Freigabe. Im Zweifel weglassen.

**M-06 — Indexierungsänderungen sind Produktentscheidungen.** `noindex` setzen oder entfernen berührt
`DEC-RL-006`; für Consumer ist es ausgeschlossen. Für andere Bereiche über AP09/AP20 dokumentieren.

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `SEOHead.tsx`, `server.ts` (SEO-Teile),
`structuredData.ts`, `index.html` oder `robots.txt`:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP09**; bei Routen zusätzlich AP10)
4. **diesen Vertrag** und `building-docs/ROUTING-CONTRACT.md`
5. `building-docs/state/AP-STATE.md`
6. die aktuellen Quell- und Testdateien aus §3
7. `git diff -- <Datei>` **vor** der Änderung
8. danach: gezielte Regressionstests aus §8

Bei branch-abgeleiteter Arbeit zusätzlich `BRANCH-RECONCILIATION-MAP.md` (**A11**, **A15**, **N1**,
**N2**, **N3**, **N14**).

---

## 8. Required Tests / Guards

| #    | Prüfung                         | Erwartung                                                                               | AP            |
| ---- | ------------------------------- | --------------------------------------------------------------------------------------- | ------------- |
| T-1  | **Canonical**                   | genau einer je Seite, aus der URL-Sprache, absolut auf `polarisdx.net`                  | AP09 PT09.1.8 |
| T-2  | **hreflang-Vollständigkeit**    | Alternates = tatsächliche Sprachmenge; genau ein `x-default` auf `/de/…`                | AP09 PT09.1.4 |
| T-3  | **404-Semantik**                | Fehlerseite ohne Canonical/hreflang, robots `noindex, follow`, Marker gesetzt, HTTP 404 | AP10 PT10.4.4 |
| T-4  | **Sitemap-Abdeckung**           | Registry ↔ Sitemap in beide Richtungen; XML valide                                      | AP09 PT09.2.8 |
| T-5  | **`lastmod`-Plausibilität**     | nicht alle Einträge identisch; Werte spiegeln reale Änderungen                          | AP09 PT09.2.7 |
| T-6  | **Index-Konsistenz**            | keine `noindex`-Seite in der Sitemap und umgekehrt                                      | AP20 PT20.4.8 |
| T-7  | **Consumer-SEO × 10**           | 10 Sprachen indexierbar, Canonical je Locale, OG-Bild je Produkt                        | AP21 PT21.6   |
| T-8  | **Epigenetik-SEO × 10**         | Hub + 3 + 6 mit eigenen Titles/Descriptions                                             | AP16 PT16.4   |
| T-9  | **Structured-Data-Validität**   | JSON-LD parst; keine Pflichtfelder leer; kein Schema ohne sichtbaren Inhalt             | AP09 PT09.4.6 |
| T-10 | **Claim-Konsistenz `CV < 2 %`** | Code, 10 Locales und Product-Schema tragen denselben Wert                               | AP14 PT14.4   |
| T-11 | **robots.txt**                  | erreichbar, Sitemap-Zeiger gültig, Consumer nicht gesperrt                              | AP09 PT09.5   |
| T-12 | **Meta-Descriptions**           | `scripts/check-meta-descriptions.mjs` verdrahten und grün halten                        | AP27 PT27.6.6 |
| T-13 | **Keine Preview-Domain**        | in Canonical, Sitemap, OG                                                               | AP29 PT29.3.3 |

Guards, die einen echten Server brauchen (T-1 bis T-8, T-11, T-13), gehören nach Playwright; reine
Struktur-/Inhalts-Guards (T-9, T-10, T-12) laufen als Node-Skript oder Vitest — Vitest ist verfügbar
(`QUALITY-BASELINE-LIVE.md` §9.2).

---

## 9. Forbidden Regressions

- ❌ Das `notFound`-Prop aus `SEOHead` entfernen oder den `prerender-status-code`-String einseitig ändern
- ❌ `SEOHead.tsx`, `server.ts` oder `structuredData.ts` als Datei aus `main` übernehmen (**N1**, **N2**, **N14**)
- ❌ **Nach Etablierung der Route Registry eine parallele Sitemap-Tabelle von Hand pflegen**
- ❌ **Canonical aus der i18n-Fallback-Sprache statt aus der URL-Sprache ableiten**
- ❌ **hreflang auf eine nicht existierende Übersetzung setzen**
- ❌ **Das heutige Datum als universelles `lastmod` verwenden**
- ❌ **Schema-Aussagen stärker machen als der sichtbare, freigegebene Seiteninhalt**
- ❌ Consumer `noindex` setzen, mit Basic Auth schützen oder auf eine Sprache zwingen (`DEC-RL-006`, `REST-03`)
- ❌ `CV < 2 %` in einem Kanal ändern, ohne die anderen drei mitzuziehen (`DEC-RL-008`)
- ❌ Eine Preview-Domain in ein produktives SEO-Artefakt schreiben
- ❌ Den globalen `meta keywords`-Block aus `index.html` wieder einführen (**N3**)
- ❌ Die Datumsnormalisierung in `structuredData.ts` verlieren

---

## 10. AP Ownership / Lifecycle

| Phase         | AP                                                                                     | Ergebnis                                                                                                |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Fundament     | **AP09** (Eigentümer)                                                                  | SEOHead konsolidiert (PT09.1), Sitemap aus Registry (PT09.2), Structured Data (PT09.4), robots (PT09.5) |
| Voraussetzung | **AP10**                                                                               | Routenwahrheit, aus der S-06 ableitet                                                                   |
| Konsum        | AP11–AP21                                                                              | je Seitentyp Metadaten und passendes Schema                                                             |
| Sonderfälle   | **AP20 PT20.4.8** (Legal), **AP21 PT21.6** (Consumer), **AP14 PT14.5** (Product/Claim) | Widersprüche auflösen                                                                                   |
| Absicherung   | **AP27 PT27.5**                                                                        | SEO-/Route-Regression in CI                                                                             |
| Migration     | **AP29 PT29.1–PT29.3**                                                                 | Crawl-Vergleich, Redirect Map, finale Sitemap/robots                                                    |
| Abnahme       | **AP30 PT30.4.4**, **AP31 PT31.3**                                                     | Nonfunctional-QA und SEO-Livecheck                                                                      |
| Betrieb       | **AP32 PT32.2**                                                                        | Coverage, Soft-404, Canonical-/hreflang-Fehler beobachten                                               |

**Änderungen an diesem Vertrag** verantwortet AP09, bei Routenbezug gemeinsam mit AP10. Decision Locks
werden hier nie geändert.

---

## 11. PT09.1 — aktueller SEOHead-Regel-/Evidence-Stand

### 11.1 Git- und Verification Context

- Verifiziert am: 2026-08-27
- Branch: `console/ap09-2026-08-27T08-46-17`
- HEAD zu PT09.1-Start und Verifikation: `6b0ed1363f08fa241a7b21d226c3a7dd4a6493bb`
- Working Tree: umfangreiche bereits bestehende gestagte AP05–AP08-Basis; PT09.1 arbeitet additiv und
  überschreibt keine fremden Änderungen
- Predecessor: AP08 COMPLETE / Closure PASS (50/50)
- Decision Locks: 18/18 LOCKED

### 11.2 Canonical Host, Locales und x-default

- Canonical/Public SEO Host: exakt `https://polarisdx.net`
- Supported Locales: exakt `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`
- Quelle der Sprachmenge: `src/i18n.ts` (`SUPPORTED_LANGUAGES`), keine zweite Sprachliste
- `x-default`: deterministisch `de`
- Relative OG-/Twitter-Bilder werden gegen `https://polarisdx.net` aufgelöst; absolute Fremd-,
  Preview-, localhost- oder HTTP-URLs werden abgewiesen

### 11.3 Indexability States

| State              | Robots                               | Canonical / URL Claim | hreflang / OG Alternates | 404 Marker |
| ------------------ | ------------------------------------ | --------------------- | ------------------------ | ---------- |
| `INDEX_FOLLOW`     | `index, follow` + Preview-Direktiven | ja                    | x10 + `x-default=de`     | nein       |
| `NOINDEX_FOLLOW`   | `noindex, follow`                    | ja                    | nein                     | nein       |
| `NOINDEX_NOFOLLOW` | `noindex, nofollow`                  | ja                    | nein                     | nein       |
| `NOT_FOUND`        | `noindex, follow`                    | nein                  | nein                     | ja         |
| `REDIRECT_SOURCE`  | `noindex, nofollow`                  | nein                  | nein                     | nein       |
| `NON_PUBLIC`       | `noindex, nofollow`                  | nein                  | nein                     | nein       |

`notFound` bleibt der bestehende, servergekoppelte Compatibility-Prop; `noindex` bildet die vorhandene
Legal-Semantik auf `NOINDEX_NOFOLLOW` ab. Ein widersprüchlicher Mix mit `indexability` schlägt fehl.

### 11.4 SEOHead-, Title- und Description-Vertrag

- `SEOHead` bleibt die einzige produktive Meta-Ausgabekomponente; keine zweite Komponente angelegt.
- Title und Description sind Pflicht, werden getrimmt und dürfen weder leer noch sichtbare
  Translation Keys sein.
- Der Brand-Suffix lautet exakt `| PolarisDX` und wird nicht verdoppelt, wenn ein bewusster Call-Site-
  Title ihn bereits enthält.
- Pro vollständig gerendertem SSR-Response entstehen genau ein Title und genau eine Description.
- Ein eng begrenzter, ausschließlich durch einen leeren Helmet-Title ausgelöster SSR-Retry verhindert,
  dass der erste Lazy-Request statische Root-Meta parallel zu leerem Helmet ausliefert.
- Finale spätere Page-Copy bleibt bei AP11–AP21; PT09.1 erfindet keine Meta-Claims.

### 11.5 Robots-, Canonical- und hreflang-Vertrag

- `robots` und `googlebot` erhalten denselben aus genau einem Indexability State abgeleiteten Wert.
- Indexierbare Seiten besitzen genau einen absoluten Canonical auf dem Public Host, aktueller URL-Locale
  und real gematchtem pathname.
- Canonical-Overrides akzeptieren nur relative Pfade oder absolute URLs auf dem Public Host, ohne Query
  oder Fragment. Fremd-/Preview-/Dev-Hosts schlagen fehl.
- Aktuell existieren **0 explizite Canonical-Override-Call-Sites**. Klassifikation: REQUIRED 0,
  REDUNDANT 0, STALE 0, INVALID 0; entfernt 0, verbleibend 0.
- x10-indexierbare Seiten emittieren exakt zehn Sprachlinks plus `x-default`; die aktuelle Locale ist
  Self-Reference. Eine bewusst kleinere reale Veröffentlichungsmenge kann explizit übergeben werden,
  muss eindeutig sein und aktuelle Locale plus deutsches x-default enthalten; dadurch werden keine
  fehlenden Alternates erfunden. Nicht indexierbare Zustände emittieren keine Alternates.
- AP08-Evidenz bestätigt Consumer 3×10, S3 1×10 und Implantology 1×10 als HTTP 200 ohne Locale-Zwang.

### 11.6 Open Graph und Twitter

- OG: `type`, kanonische `url`, locale-aware Title/Description, absolutes Image, Image Alt, Site Name,
  aktuelle Locale und neun reale Locale-Alternates auf x10-indexierbaren Seiten.
- Twitter: `summary_large_image`, kanonische URL, derselbe Title-/Description-Vertrag, absolutes Image
  und Image Alt.
- 404, Redirect Sources und Non-Public-Zustände emittieren keinen valid-page `og:url`- oder
  `twitter:url`-Claim. 404 emittiert auch keine `og:locale:alternate`.

### 11.7 404 Contract und SSR-Handshake

- `SEOHead notFound` emittiert weiterhin exakt
  `<meta name="prerender-status-code" content="404">`.
- `server.ts` liest unverändert denselben `NOT_FOUND_MARKER` und kombiniert ihn mit `isKnownPath`.
- Production-SSR-Evidenz für eine echte unbekannte FR-Route: HTTP 404; robots `noindex, follow`;
  Canonical 0; hreflang 0; x-default 0; OG-Locale-Alternates 0; `og:url` 0.
- Der Head-Retry ist kein neuer 404-Mechanismus und keine Route Registry; er lässt nur den bereits
  gestarteten Lazy-Import vor der bestehenden Marker-/Template-Auswertung begrenzt auflösen.

### 11.8 Aktuelle Route-Source-Mechanik

`seoRouteSource.ts` ist die klar abgegrenzte AP09-Übergangsschnittstelle. Sie konsumiert:

1. den von React Router tatsächlich gematchten `location.pathname`,
2. die URL-/i18n-Locale des aktuellen Requests,
3. den gemeinsamen AP08-Sprachsatz aus `src/i18n.ts`.

Sie enthält **keine Pfadliste, keine Redirects, keine Known Paths und keine Sitemap-Tabelle**. Sie ist
damit keine fünfte Route Registry. AP10 kann ihre URL-/Locale-Konsumenten an die zentrale Registry
anschließen, ohne SEOHead neu zu schreiben.

### 11.9 DG09-01 — ROUTE_REGISTRY_INTEGRATION

- Type: `CROSS_AP_ARCHITECTURE_INTEGRATION`
- Owner: AP10 PT10.3
- Created by: AP09
- Required before: Launch / AP29 final crawl / AP31 launch closure
- AP09 Closure blocker: NO, wenn alle AP09-eigenen SEO-Gates PASS sind
- Launch blocker: YES
- Safe current state: SEOHead nutzt eine konsistente, regressionsgetestete, pfadlistenfreie AP09-
  Route-Source-Schnittstelle; keine neue Route Registry wurde gebaut.
- Target state: SEOHead, Sitemap, Search, Known Paths, App Routes und Tests konsumieren die zentrale
  AP10 Route Registry.
- Status nach PT09.1/AP09: `READY_FOR_OWNER`
- Resolved by: AP10 PT10.3 nach realer Umschaltung und Guard-Nachweis

### 11.10 PT09.1 Tests und Host-Evidenz

- Typecheck: PASS
- taskbezogener ESLint: PASS
- taskbezogenes Prettier: PASS
- SEOHead Unit/Regression: 7/7 PASS unter Node 22
- Production SSR/404/Locale SEO: 12/12 PASS unter Node 22 (`--repeat-each=2`; 30
  Consumer-/S3-/Implantology-Responses plus zwei echte unbekannte 404-Responses)
- Production Build: PASS (Client + SSR)
- Repräsentative Locale-Matrix: DE/EN/PL/FR/CS; pure URL-/hreflang-Tests decken x10 ab
- Preview-/Dev-Host im produktiven PT09.1-Output: 0
- Aktueller lokaler Default Node 18 kann Vitest/jsdom wegen einer vorbestehenden ESM/CJS-
  Toolchain-Asymmetrie nicht starten; der State-/CI-Vertrag verwendet Node 22. Unter Node 22 sind die
  Tests grün. Dies ist keine PT09.1-Produktregression.

### 11.11 Bekannte spätere Owner-Handoffs

- PT09.2: abgeschlossen; aktueller Evidence-Stand in §12
- PT09.3: Consumer-SEO abgeschlossen (aktueller Stand §13); sprachneutrale/x10 Social-Crops und die
  finale Produktstrecke bleiben AP21
- PT09.4: Structured-Data-Plattform/Coverage; `structuredData.ts` in PT09.1 unverändert
- PT09.5: robots.txt, Bot-Policy und breiter Meta-/OG-Alt-Audit; nicht vorgezogen
- AP10 PT10.3: zentrale Route Registry und Auflösung von DG09-01
- AP11–AP21: finale Page-Metadaten und sichtbare Fach-/Produktinhalte

---

## 12. PT09.2 — aktueller Sitemap-/G3-Evidence-Stand

### 12.1 Generator und Route Source

- Produktiver Endpoint: `GET /sitemap.xml` in `server.ts`; XML-Generator:
  `src/components/seo/sitemap.ts`.
- Route Source: bestehende sitemap-spezifische statische Spiegelung als eng begrenzter AP09-
  Übergangsadapter; dynamische Slugs werden direkt aus `src/data/services.tsx`,
  `src/data/articles.ts` und `src/content/befunde/meta.ts` gelesen.
- Der alte `SITEMAP_ROUTES`-, Consumer-EN- und German-only-Block in `server.ts` wurde ersetzt. Es
  entstand weder eine zentrale Route Registry noch eine zusätzliche fünfte Route-Liste.
- `scripts/prerender.mjs` ist historischer, nicht produktiv-authoritativer Altbestand und bleibt
  ausdrücklich keine Sitemap- oder Route-SSOT. Seine Bereinigung ist nicht PT09.2-Scope.

### 12.2 Abdeckung und aktuelle Messung

- Unterstützte Locales: exakt `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`; Quelle
  bleibt `src/i18n.ts`. `x-default` zeigt für jede Family deterministisch auf `de`.
- Route Families: **39**; Sitemap URLs: **390**; eindeutige URLs: **390**; Duplikate: **0**.
- Statische indexierbare Families: **15** — Home, IglooPro, Diagnostics, About, Contact, Articles,
  Epigenetics Hub + drei Vertiefungen, Events, Downloads, Vitamin-D3-Spray, S3-Leitlinie und
  Vitamin-D3-Implantologie.
- Consumer: **3 Families × 10 = 30 URLs**; reale Slugs `vitamin-d3-spray`, `hydrating-masks`,
  `inside-out-duo`; keine EN-only-Ausnahme.
- Epigenetics: Hub + Grundlagen + Studienlage + Unterlagen jeweils x10. Musterbefunde: **6 Families ×
  10 = 60 URLs** aus `BEFUND_ORDER`.
- Services: **9 Families × 10 = 90 URLs**, ausschließlich `/diagnostics/<service.id>` aus der
  aktuellen Service-Datenquelle.
- Articles: **6 aktuell veröffentlichte Datensätze × 10 = 60 URLs**, ausschließlich reale `slug`-
  Werte; die Datenquelle besitzt derzeit keinen Draft-Status und alle sechs Datensätze sind produktiv
  geroutet.

### 12.3 Indexability und Ausschlüsse

- Legal: `/privacy`, `/imprint`, `/terms` sind technisch `NOINDEX_NOFOLLOW` und deshalb aus der
  Sitemap ausgeschlossen. Sitemap/noindex-Widersprüche: **0**. Fachliche Endentscheidung bleibt bei
  AP20 PT20.4.8.
- Support: `INDEXABLE_EXCLUDED_INTENTIONAL` — öffentliche 200-Seite ohne `noindex`, als Utility-/
  Support-Ziel bewusst nicht in der Sitemap. Eine spätere Strategieänderung bleibt ownergebunden.
- Redirect Sources: `/services`, `/services/*`, `/agb`, `/s3-leitlinie` ausgeschlossen; vollständige
  Redirect-Architektur bleibt AP10-owned.
- Verifizierte produktive Sitemap-Ziele: **0** 404, **0** Redirect Sources, **0** noindex, **0**
  Legacy-`/services*`, **0** Preview-/Dev-Hosts.

### 12.4 `lastmod` und XML/hreflang

- Kein `new Date()`, kein Build-/Request-Datum und keine Filesystem-/Git-Mtime.
- Article-Detailseiten nutzen das persistente Publikationsdatum aus `articles.ts`, streng nach
  `YYYY-MM-DD` normalisiert: **60 URL-Einträge mit ehrlichem `lastmod`**.
- Statische, Consumer-, Service- und Befundseiten besitzen keine belastbaren Änderungsmetadaten:
  **330 URLs ohne `lastmod`** statt Fake-Aktualität.
- XML: UTF-8-Deklaration, ein `urlset`, Sitemap- und XHTML-Namespace, absolute HTTPS-`loc`, korrekt
  escapte Werte. Jede URL besitzt zehn reale Locale-Alternates plus deutsches `x-default` und eine
  Self-Reference; hreflang parity PASS.

### 12.5 Guard G3 und CI

- Kanonischer Guard: `src/components/seo/sitemapGuard.ts`; stabiler Befehl: `npm run check:seo`.
- G3 prüft XML-Parse, Namespace, Public Host, Eindeutigkeit, 39×10-Coverage, Consumer 3×10,
  Epigenetics/Befunde, dynamische Service-/Article-/Befund-Slugs, Legal/noindex, 404-/Redirect-
  Quellen, `/services*`, hreflang, x-default de, Self-Reference, `lastmod` und Preview-Hosts.
- Hard-Failure-Self-Test: PASS für Duplicate URL, Missing Locale/Consumer Locale, 404 URL, noindex URL,
  Preview Host, invalides XML und globales Fake-`lastmod`; echte Fehler liefern Non-Zero Exit.
- Unit/Regression: Sitemap **13/13 PASS**; gemeinsam mit SEOHead **20/20 PASS** unter Node 22.
- Gesamte Unit-Suite unter dem dokumentierten `NODE_ENV=test`-/Node-22-Vertrag: **277/277 PASS**.
- Production SSR: **390/390 Sitemap-Ziele HTTP 200**, indexierbar, self-canonical und ohne Preview-
  Host; fokussierte SEO/404-Suite zusammen **7/7 PASS**.
- Taskbezogener ESLint/Prettier-Dateisatz: PASS. Der globale, außerhalb PT09.2 liegende Bestand bleibt
  bei ESLint 120 Errors/4 Warnings und Prettier 35 Dateien; keine PT09.2-Datei trägt einen Befund.
- CI: `.github/workflows/ci.yml` führt `npm run check:seo` sowie
  `e2e/seo-head.spec.ts e2e/sitemap.spec.ts` aus. Pull Requests und Pushes auf `console/**` erreichen
  beide Schritte; damit deckt der aktuelle Relaunch-Branch den G3-Pfad real ab.

### 12.6 DG09-01 und spätere Owner

- `DG09-01 — ROUTE_REGISTRY_INTEGRATION`: **READY_FOR_OWNER**.
- Owner: **AP10 PT10.3**; AP09 Closure blocker: **NO** bei grünen AP09-Gates; Launch blocker: **YES**.
- Target bleibt unverändert: Sitemap, Search, SEOHead, Known Paths, App Routes und Tests konsumieren
  nach AP10 die zentrale Route Registry. PT09.2 schließt dieses Gate nicht.
- PT09.3 Consumer-Detail-SEO ist inzwischen in §13 abgeschlossen; PT09.4 Structured Data und PT09.5
  Robots-/Meta-Gesamtaudit wurden nicht vorgezogen. Nächster Task: **PT09.4**.

---

## 13. PT09.3 — Consumer SEO / aktueller 3×10-Evidence-Stand

### 13.1 Produkt- und Locale-Matrix

| Product Family   | Kanonischer Pfad             | Locale Coverage | HTTP / Indexability | Canonical / hreflang     | Sitemap | Social / Alt                  | Product Schema      | Interne Findability        |
| ---------------- | ---------------------------- | --------------- | ------------------- | ------------------------ | ------- | ----------------------------- | ------------------- | -------------------------- |
| Vitamin-D3 Spray | `/consumer/vitamin-d3-spray` | 10/10           | 10/10 200, index    | self / 10 + de-x-default | 10/10   | eigenes reales Hero / x10 Alt | minimal, claim-safe | Inlink aus Masks und Duo   |
| Hydrating Masks  | `/consumer/hydrating-masks`  | 10/10           | 10/10 200, index    | self / 10 + de-x-default | 10/10   | eigenes reales Hero / x10 Alt | minimal, claim-safe | Inlink aus Duo             |
| Inside-Out Duo   | `/consumer/inside-out-duo`   | 10/10           | 10/10 200, index    | self / 10 + de-x-default | 10/10   | eigenes reales Hero / x10 Alt | minimal, claim-safe | Inlink aus Spray und Masks |

- Locale-Set: exakt `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`; Matrix:
  **30/30 PASS**. Jede Antwort bleibt auf ihrer angeforderten Locale, liefert HTTP 200 und besitzt
  genau ein absolutes Self-Canonical auf `https://polarisdx.net`.
- Pro Seite: robots `index, follow`; zehn reale Locale-Alternates, Self-Reference und genau ein
  `x-default` auf `de`; ungültige Alternate Targets **0**, EN-only Canonical-/Redirect-Regressions
  **0**, noindex-Regressions **0**.
- Sitemap: 3 Families × 10 = **30/30** kanonische Consumer-URLs; Duplikate, Redirect Sources, 404 und
  Sitemap/noindex-Widersprüche jeweils **0**. `public/robots.txt` blockiert `/consumer` nicht.
- `server.ts` enthält keine Consumer-spezifische Basic-Auth- oder EN-Zwangslogik. Preview-/Staging-
  Zugangsschutz bleibt davon getrennte Deployment-Verantwortung; produktive Consumer-Routen werden
  technisch öffentlich und indexierbar behandelt.

### 13.2 Title, Description und Social Metadata

- Alle drei Families beziehen Title und Description aus ihren produktspezifischen `consumer`-Keys;
  alle zehn Locale-Dateien besitzen aufgelöste, locale-aware Werte. Der erweiterte G3 schlägt bei
  fehlenden Keys, EN-Rückfall oder identischen Metadaten der drei Produkte hart fehl.
- `SEOHead` ist weiterhin die einzige Meta-Ausgabeschicht. Consumer setzt `og:type=product`, eigene
  URL/Title/Description, `og:locale` plus neun Alternates sowie äquivalente Twitter-Metadaten.
- Reale produktbezogene Assets: `spray-hero-12pack-office.jpeg`, `mask-hero-botanical.jpeg` und
  `duo-hero-products-together.jpeg`, jeweils **1122×1402**, Build-/SSR-erreichbar und zugleich sichtbar
  auf der jeweiligen Produktseite. Die alte öffentliche Spray-OG-Datei mit abweichender Dosierung
  und das IglooPro-Fallback sind bewusst **nicht** verwendet; Fake-Assets: **0**, Fallbacks: **0**.
- OG-/Twitter-Alt verwendet je Produkt den lokalisierten sichtbaren Hero-Alt: **30/30 nicht leer**.
  Die drei vorhandenen Hero-Dateien enthalten englische eingebettete Copy und sind deshalb als
  produktbezogene, aber **nicht locale-spezifische** Bestandsassets klassifiziert. Sprache-neutrale
  oder zehn freigegebene Social-Crops bleiben ein ownergebundenes Asset-Upgrade für **AP21**; PT09.3
  behauptet keine französische/polnische/etc. Bildvariante.

### 13.3 Consumer Product Schema

- `createProductSchema` bildet ausschließlich sichtbaren Namen, locale-aware Beschreibung, reales
  sichtbares Produktbild, self-canonical URL, `inLanguage`, `mainEntityOfPage` und – nur wo eindeutig –
  die reale Marke ab. Spray: PolarisDX; Masks: De Legende Kosmetik; beim markenübergreifenden Duo wird
  bewusst keine einzelne Brand behauptet.
- Product-Markup: **3/3 Families × 10**. Price/priceCurrency, Offer, Availability, SKU, GTIN, Rating,
  Review und Review Count: **nicht ausgegeben**. Damit entstehen weder stale Preise noch erfundene
  Verfügbarkeit/Angebote/Identifikatoren/Testimonials. Medizinische Claim-Verstärkung: **0**.
- Dies ist ausschließlich die Consumer-spezifische PT09.3-Integration in den bestehenden Helper.
  Organization/WebSite/Breadcrumb/FAQ/Article/Event/Medical-Coverage und die globale Structured-Data-
  Plattform bleiben PT09.4.

### 13.4 Findability und Consumer-Hub

- Jede der drei Produktseiten besitzt mindestens einen realen locale-aware Inlink aus der bestehenden
  Consumer-Familie; zusammen bilden Spray, Masks und Duo in allen zehn Locales einen geschlossenen,
  toten-link-freien Produktkontext. Legacy-`/services*`-Consumer-Links: **0**. Sitemap-Coverage bleibt
  30/30; unbeabsichtigte Direct-URL-only-Seiten: **0**.
- Die AP07-Search-Integration `DSI-04` bleibt unverändert **OPEN / Owner AP21**; PT09.3 erfindet keine
  Search-Content-Quelle und meldet sie nicht false-ready. Aktueller Safe State sind die realen
  gegenseitigen Inlinks plus Sitemap-Coverage.
- **`CONSUMER_HUB = NOT_REQUIRED`.** Es existiert kein `/consumer`-Hub. Bei drei bestehenden, bereits
  gegenseitig erschlossenen Landingpages würde ein neuer x10-Hub neue IA-/Content-Pflege und damit
  AP21-Scope vorziehen, ohne einen belegten zusätzlichen Nutzen. AP21 darf diese Entscheidung mit der
  finalen Produktstrecke neu bewerten; PT09.3 erzeugt keine Thin-/Dummy-Seite.

### 13.5 Guard, CI und Owner-Grenzen

- Der bestehende G3 (`npm run check:seo`) prüft zusätzlich drei reale Families, alle zehn Locale-
  Metadatensätze, produktspezifische Titles/Descriptions, reale Social-Assets, Product-Schema-
  Integration, robots und das Fehlen von EN-only-Serverlogik. Ergebnis: **PASS**.
- Die bereits von der Relaunch-CI ausgeführte `e2e/seo-head.spec.ts` enthält die parametrische
  30-Fälle-Runtime-Matrix: HTTP/robots, Canonical, hreflang/x-default, Sitemap, OG/Twitter, Asset 200,
  Product JSON-LD, verbotene kommerzielle Felder, Preview-Host und locale-aware Inlinks. Zusammen mit
  `e2e/sitemap.spec.ts`: **8/8 PASS**, alle 390 Sitemap-Ziele weiter 200/self-canonical/indexierbar.
- `DG09-01 — ROUTE_REGISTRY_INTEGRATION` bleibt **READY_FOR_OWNER**, Owner **AP10 PT10.3**. Es wurde
  keine Route Registry gebaut. PT09.4, PT09.5, AP10 und AP21 wurden nicht vorgezogen.

---

## 14. PT09.4 — Structured Data / aktueller Claim-Safety-Evidence-Stand

### 14.1 Kanonische Helper- und Entity-Wahrheit

- Einzige produktive Helper-Schicht: `src/components/seo/structuredData.ts`; einziger Renderer:
  `SEOHead`, der jeden Block vor dem serialisierten JSON-LD zentral validiert und `<` sicher escaped.
  Seitenlokale parallele Product-, Review-, Breadcrumb- oder FAQ-Plattformen existieren nicht.
- Die globale Entity ist genau eine konservative `Organization` mit stabiler `@id`, verifiziertem
  Namen, öffentlicher DE-URL, Logo, E-Mail, dem sichtbaren Sitz der Europe GmbH und realem LinkedIn-
  Profil. Die getrennte Londoner Ltd wird nicht fälschlich als Adresse der Europe GmbH angehängt.
  Widersprüchliche `MedicalBusiness`-/`LocalBusiness`-Blöcke, unbelegte
  Öffnungszeiten, Geo-Radien, Preisbereiche und inkonsistente Telefon-/Adresskombinationen wurden
  entfernt. `MedicalBusiness` ist bewusst **NOT USED** bis eine fachlich belastbare Typisierung und
  Local-Business-Wahrheit ownerseitig vorliegt.
- `WebSite` ist pro aktueller Locale an deren öffentliche Startseiten-URL gebunden und referenziert
  dieselbe Organization. `SearchAction = NOT USED`: die reale Suche ist ein Modal ohne öffentlich
  adressierbare Suchergebnis-URL; `/articles?q=…` wäre eine fiktive Funktion.
- Erlaubte produktive URL-Hosts: `https://polarisdx.net` sowie `https://schema.org` für Kontext und
  kontrollierte Schema-Enums; reales `sameAs` bleibt als externer Identitätslink zulässig.
  Preview-, localhost- und 127.0.0.1-Leakage im produktiven JSON-LD: **0**.

### 14.2 Seitentyp-Verträge

- `BreadcrumbList` bildet nur reale Route-/Inhaltshierarchien ab. Diagnostics nutzt
  `/diagnostics`, nie die Redirect-Quelle `/services`; Consumer Product nutzt Home → Produkt ohne
  erfundenen `/consumer`-Hub; alle Item-URLs sind locale-aware. Sichtbare Breadcrumbs bleiben die
  semantische Quelle, eine neue globale Breadcrumb-UI wurde nicht gebaut.
- `Product` ist selektiv auf IglooPro, der sichtbaren B2B-Spray-Produktseite und den drei Consumer-
  Produkten aktiv. Es spiegelt Name, sichtbare locale-aware Description, reales Bild, URL und nur
  eindeutig belegte Marke. Offers, Preise, Währung, Availability, SKU/GTIN, Rating und Review werden
  nicht erzeugt. Der sichtbare IglooPro-Claim `CV < 2 %` wird nicht erweitert, garantiert oder in
  zusätzliche Schemafelder übertragen.
- `FAQPage` wird ausschließlich aus denselben Arrays erzeugt, die der sichtbare FAQ-Block rendert:
  Home, Support, Service, Epigenetics, S3, Implantology, B2B Spray und die drei Consumer-Produkte.
  Seiten ohne sichtbares FAQ erhalten keinen FAQ-Block; globale FAQ-Injection gibt es nicht.
- `Article` wird für die sechs real veröffentlichten Article-Datensätze und die erklärenden
  Musterbefunde genutzt. `MedicalWebPage` bleibt nur auf den sichtbaren fachlichen S3-/Implantology-
  Seiten aktiv. Publikationsdaten werden streng ISO-validiert; `dateModified`, Autor und Reviewer
  werden nur mit realer Quelle ausgegeben. Artikelbilder stammen, soweit vorhanden, aus der realen
  Article-Asset-Map; ein fehlendes Bild wird nicht erfunden.
- `BusinessEvent` wird nur aus den zum Request-Zeitpunkt aktuellen Event-Stammdaten erzeugt. Name,
  Beschreibung, Start/Ende und Ort stammen aus sichtbarer Locale-UI bzw. `events.ts`; URL ist die
  reale locale-aware Eventseite. EventStatus, AttendanceMode, Offer, Preis und Availability werden
  mangels belastbarer Quelle nicht behauptet. Abgelaufene Events erhalten kein Event-Markup.
- Medical-/Health-Typen bleiben defensiv. Keine Diagnostics-Seite wird als Product und kein
  Download als Product/Article markiert. Das frühere seitenlokale HowTo mit unbelegter Dauer wurde
  entfernt. Testimonials sind keine Product Reviews. Claim Amplification: **0**.

### 14.3 SCHEMA-COVERAGE-MATRIX

Diese Matrix klassifiziert Seitentypen; sie ist ausdrücklich keine Route Registry.

| Seitentyp          | Allowed Schema Types             | Required                     | Optional                                  | Explicitly Not Used                                                | Aktuelle Implementation / Evidenz          | Claim-Safety / spätere Owner                                                |
| ------------------ | -------------------------------- | ---------------------------- | ----------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| Home               | Organization, WebSite, FAQPage   | Organization, WebSite        | FAQPage bei sichtbarem Block              | Product, Review, MedicalBusiness, SearchAction                     | `HomePage`, zentrale Helper                | Kein Testimonial-Rating; SearchAction erst bei realer öffentlicher Such-URL |
| About/Company      | Organization, BreadcrumbList     | Organization, BreadcrumbList | –                                         | MedicalBusiness                                                    | `AboutPage`, verifizierte Entity           | Branchen-Spezialtyp nicht inferiert                                         |
| Diagnostics Hub    | BreadcrumbList                   | BreadcrumbList               | –                                         | Product, MedicalEntity                                             | `ServicesOverviewPage`                     | Keine Service→Product-Umdeutung                                             |
| Service            | Service, BreadcrumbList, FAQPage | Service, BreadcrumbList      | FAQPage sichtbar-only                     | Product, Review                                                    | `ServicePage`, `services.tsx`              | Locale-aware; `areaServed` nicht pauschal erfunden                          |
| IglooPro           | Product, BreadcrumbList          | Product, BreadcrumbList      | –                                         | Offer, Rating, Review                                              | `IglooProPage`, reales Produktbild/Copy    | `CV < 2 %` nicht verstärkt; finale Produktarbeit AP14                       |
| Epigenetics        | BreadcrumbList, FAQPage          | BreadcrumbList               | FAQPage sichtbar-only                     | Product, MedicalEntity                                             | Hub und Deepening Pages                    | Kein Diagnose-/Therapieversprechen; Fachcontent AP15                        |
| Musterbefund       | Article, BreadcrumbList          | Article, BreadcrumbList      | –                                         | MedicalWebPage, Product                                            | `MusterbefundPage`, reale Befund-Metadaten | Beispielwerte nicht als medizinische Auskunft typisiert; AP16               |
| Article            | Article, BreadcrumbList          | Article, BreadcrumbList      | Image bei realem Asset                    | Reviewer, Rating                                                   | `ArticlePage`, `articles.ts`, Asset-Map    | Kein erfundener Reviewer/modified-Wert; Plattform AP17                      |
| Event              | BusinessEvent, BreadcrumbList    | BreadcrumbList               | BusinessEvent nur für aktuelle Stammdaten | Offer, Price, erfundener Status/Mode                               | `EventsPage`, `events.ts`                  | Keine Upcoming-Manipulation; Plattform AP18                                 |
| Consumer Product   | Product, BreadcrumbList, FAQPage | Product, BreadcrumbList      | FAQPage sichtbar-only                     | Offer, Price, Availability, Rating, Review                         | drei PT09.3-Pages ×10                      | PT09.3 visible truth erhalten; finale Strecke/Assets AP21                   |
| Downloads/Resource | BreadcrumbList                   | BreadcrumbList               | –                                         | Product, Article                                                   | `DownloadsPage`                            | Keine Lead-Magnet- oder Produktbehauptung; AP19                             |
| Contact            | Organization, BreadcrumbList     | BreadcrumbList               | Organization                              | MedicalBusiness, LocalBusiness hours/geo                           | `ContactPage`, reale Standorte             | Fachliche Local-Business-Typisierung später ownerseitig                     |
| Support            | BreadcrumbList, FAQPage          | BreadcrumbList               | FAQPage sichtbar-only                     | LocalBusiness, MedicalBusiness                                     | `SupportPage`, sichtbarer FAQ-Block        | Keine aggressive Entity-Anreicherung                                        |
| Legal              | BreadcrumbList                   | BreadcrumbList               | –                                         | Product, Service, MedicalEntity                                    | Legal Pages, noindex                       | Fachliche Endarbeit AP20                                                    |
| 404                | keine page-level Content-Entity  | keine                        | –                                         | Product, Article, Event, FAQPage, BreadcrumbList, Canonical-Entity | `NotFoundPage`, kein JSON-LD               | Keine gültige Content-Wahrheit für Fehler-URL                               |

### 14.4 Qualität, Guard und Owner-Grenzen

- JSON-LD-Unit-Vertrag prüft Organization/WebSite, fehlende SearchAction, locale-aware Breadcrumbs,
  selektives Product, sichtbares FAQ, strikt valide Article-Daten, optionale Author/Modified-Felder,
  reale Eventdaten, fehlende kommerzielle Felder, Preview-Host-Hard-Failure, Entity-Duplikate und
  sichere Serialisierung.
- Der bestehende G3 (`npm run check:seo`) wurde erweitert: zentrale Helper-/Renderer-Evidenz,
  verbotene alte Medical/Local/Review/SearchAction-Quellen, keine seitenlokale HowTo-Annahme,
  Preview-/Dev-Host-Scan und Vorhandensein dieser Coverage Matrix. Die bestehende Relaunch-CI führt
  G3 und die SEO/SSR-E2E-Dateien weiterhin auf PRs und `console/**`-Pushes aus; keine neue Guard- oder
  CI-Plattform entstand.
- Organization/WebSite-Konflikte: **0**; offensichtliche widersprüchliche Schema-Duplikate: **0**;
  unbelegte Offers/Prices/Ratings/Reviews: **0**; Claim Amplification: **0**.
- `DG09-01 — ROUTE_REGISTRY_INTEGRATION` bleibt unverändert **READY_FOR_OWNER**, Owner **AP10
  PT10.3**. Diese Matrix und die Helper sind keine Route Registry. PT09.5, AP10 und spätere
  Page-/Content-APs wurden nicht vorgezogen.

---

## 15. PT09.5 — Robots-/Bot-Policy und Meta-Quality-Evidence

### 15.1 Robots- und Crawl-Vertrag

- `public/robots.txt` ist die einzige produktive Robots-Datei. Die Sitemap-Direktive zeigt exakt auf
  `https://polarisdx.net/sitemap.xml`; Preview-, Localhost- oder relative Sitemap-Ziele: **0**.
- Der reale technische Präfix `/api` ist in der Wildcard- sowie jeder spezifischen Bot-Gruppe als
  Crawlfläche ausgeschlossen. Das ist ausschließlich Crawl Guidance, **keine** Authentifizierungs-
  oder Security-Maßnahme. Die aktuellen Anwendungspfade `/api/contact`, `/api/support`,
  `/api/consumer-order`, `/api/chat` und `/api/roi-report` fallen deterministisch unter diese Regel.
- Renderkritische `/assets/`- und `/locales/`-Ressourcen bleiben ausdrücklich crawlbar. Es gibt kein
  globales Asset-, JavaScript-, CSS-, Bild- oder Consumer-Disallow.
- Consumer bleibt für `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl` und `cs` vollständig
  crawlbar. Der Runtime-Gate bestätigt weiterhin 3 Families × 10, `index, follow`, Self-Canonical,
  Sitemap-Mitgliedschaft und keine EN-Zwangskanonisierung.

### 15.2 Bot-spezifischer Policy-Intent

- Die vor PT09.5 vorhandenen **39 spezifischen User Agents** wurden vollständig erhalten und nur in
  technisch konsistente Gruppen zusammengeführt: **12 SEARCH_ENGINE**, **9 SOCIAL_PREVIEW bzw.
  user-triggered fetch** und **18 AI_CRAWLER**. Hinzu kommt die Wildcard-Gruppe.
- Der vorhandene Allow-Intent für Search-, Social- und AI/LLM-Crawler bleibt unverändert; zugleich
  gilt `/api` nun aufgrund der Regeln in jeder spezifischen Gruppe konsistent auch für diese Bots.
  Agent-Inventar vorher/nachher: **39/39, hinzugefügt 0, entfernt 0**.
- PT09.5 trifft keine neue strategische Unternehmensentscheidung zu AI-/LLM-Crawling. Eine spätere
  Änderung dieses Allow-Intents benötigt eine explizite Owner-Entscheidung; aktuell besteht keine
  technische Policy-Ambiguität und daraus kein AP09-Closure-Blocker.

### 15.3 Meta-, Social-Alt- und Host-Guards

- Kanonischer Befehl bleibt `npm run check:seo`. Er führt zuerst den erweiterten bestehenden
  `scripts/check-meta-descriptions.mjs` und danach G3 (`scripts/check-seo.ts`) aus; es entstand kein
  paralleles Guard-System.
- Der statische Meta-Guard entdeckt die expliziten SEO-Title-/Description-Paare aus allen zehn
  Locale-Bäumen. Aktuelle Messung: **290 Records**, Missing 0, Empty 0, Translation Keys 0,
  Placeholder/Preview Copy 0, problematische exakte Locale-Duplikate 0 und bekannte DE-/EN-
  Sprachkopien 0. Längen sind eine Heuristik: eine bestehende natürliche französische Article-Index-
  Description mit 216 Zeichen ist eine Warnung, kein Hard Failure; harte groteske Grenzen bleiben
  regressionsgesichert.
- Die CI-aktive Runtime-Matrix prüft zusätzlich alle **390** indexierbaren Sitemap-Seiten auf genau
  einen nicht leeren Title und eine nicht leere Description, Translation-Key-/Placeholder-Freiheit,
  unpassende gleiche Locale-Duplikate sowie bekannte DE-/EN-Kopierregressionen.
- Dieselben 390 Seiten besitzen ein öffentliches OG-Bild sowie einen nicht leeren,
  nicht dateinamenartigen `og:image:alt`; `twitter:image:alt` ist vorhanden und konsistent.
  Missing OG Alts, Filename-only Alts und falsche Host-Ziele: jeweils **0**.
- G3 führt einen produktiven Host-Sweep über robots, `index.html`, SEO-Konfiguration/Helper,
  **42** produktive Source-/Page-Dateien und die generierte Sitemap aus. Preview-, localhost-,
  127.0.0.1- und Dev-Port-Leakage in Canonical, hreflang, Sitemap, OG/Twitter, Structured Data und
  robots Sitemap: **0**. Eindeutig abgegrenzte Testfixtures sind keine produktiven Treffer.

### 15.4 Hard Failures, CI und Regressionsevidenz

- Non-Zero-Hard-Failures umfassen missing/empty Required Title oder Description, sichtbare
  Translation Keys/Placeholder, produktive Preview-/Dev-Hosts, ungültigen Canonical-/Sitemap-Host,
  Consumer noindex/robots block, fehlenden produktiven Social Alt und Robots-/Bot-Gruppen-Drift.
  Die reine Längenheuristik bleibt bewusst Warning-Semantik.
- `.github/workflows/ci.yml` erreicht auf Pull Requests sowie Pushes nach `main`,
  `feat/home-leadmagnet` und `console/**` den bestehenden `npm run check:seo`-Schritt und danach
  `e2e/seo-head.spec.ts e2e/sitemap.spec.ts`. PT09.5 verändert die CI-Plattform nicht; die neuen
  Prüfungen liegen in bereits erreichbaren Befehlen/Dateien.
- PT09.5-Evidence unter Node 22: Typecheck PASS; Meta-Guard **290/290** ohne Hard Finding; G3 PASS;
  Production Build PASS; SEO/robots/404/Structured-Data/Consumer plus vollständige Sitemap-Runtime-
  Matrix **10/10 PASS**, darin **390/390** öffentliche Seiten.
- `DG09-01 — ROUTE_REGISTRY_INTEGRATION` bleibt **READY_FOR_OWNER**, Owner **AP10 PT10.3**. PT09.5
  baute keine Route Registry und zog weder AP27 noch spätere Page-/Content-Arbeit vor.

---

## 16. AP09-CLOSURE — aktuelle unabhängige Evidence

### 16.1 Git-, Source- und CI-Kontext

- Verifiziert am: **2026-08-28**; Branch: `console/10-15-2026-08-28T08-18-27`; Closure-Start-HEAD:
  `bbfb3bd71cc5bd12fc9281e8d5f2558f034fa19c`; Working Tree am Start vollständig clean; keine
  Merge-/Rebase-/Cherry-Pick-/Revert-Situation.
- Produktion verwendet **27 `SEOHead`-Call-Sites in 24 Page-/Epigenetics-Dateien**. Genau eine Datei,
  `src/components/seo/SEOHead.tsx`, rendert direkt `<Helmet>`; konkurrierende Meta-Layer: **0**.
- `.github/workflows/ci.yml` triggert für Pull Requests und Pushes auf `main`,
  `feat/home-leadmagnet` und `console/**`. Der unabhängige Job `AP09 SEO gates` führt
  `npm run check:seo`, die SEOHead-/Sitemap-/Structured-Data-Unit-Suiten, den Production Build und
  `e2e/seo-head.spec.ts e2e/sitemap.spec.ts` aus. Damit bleiben diese Gates auch bei den separat hart
  fehlschlagenden dokumentierten globalen Lint-/Format-Baselines real erreichbar; kein Gate wurde
  abgeschwächt oder ignoriert.

### 16.2 Aktuelle Route-, Meta- und Sitemap-Messung

- Locale-Quelle: exakt `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`; Default und
  `x-default`: `de`; öffentlicher Host: exakt `https://polarisdx.net`.
- Indexierbare öffentliche Menge: **40 Route Families / 400 Locale-URLs**. Davon stehen bewusst
  **39 Families / 390 URLs** in der Sitemap; `/support` ist die zehnfach verifizierte indexierbare,
  aber bewusst nicht sitemap-geführte Utility-Familie. Explizite noindex-Menge: **3 Legal Families /
  30 Locale-URLs** (`privacy`, `imprint`, `terms`).
- Frisch erzeugte Sitemap: valides namespace-korrektes XML; **390 URLs, 390 unique, 0 duplicates,
  39 x10 Families**. Consumer **30**, Epigenetics gesamt **100** (Hub/Vertiefungen **40** plus
  Musterbefunde **60**), Services **90** aus 9 realen IDs, Articles **60** aus 6 realen Slugs,
  `lastmod` **60** ausschließlich aus realen Article-Publikationsdaten.
- Produktions-SSR-Audit über alle 390 Sitemap-URLs: Status-/Redirect-, Canonical-, robots-,
  hreflang-, `x-default`-, Self-Reference-, OG-URL-, Social-Alt-, Host- und Schema-Host-Anomalien:
  jeweils **0**. Sitemap-404-, Redirect-Source-, noindex- und Preview-Ziele: jeweils **0**.
- Vier neu gemessene unbekannte statische/dynamische Locale-URLs antworten HTTP 404 mit
  `noindex, follow`, Canonical **0**, hreflang **0**, `x-default` **0**, Content-Schema **0** und
  Preview-/Dev-Host **0**.
- Meta-Quality: **290/290** explizite Locale-Records ohne Hard Finding; alle **390/390** Sitemap-
  Seiten besitzen genau einen Title, eine Description, ein öffentliches OG-Bild sowie nicht leeren,
  nicht dateinamenartigen OG-/Twitter-Alt. Eine natürliche französische Article-Index-Description
  mit 216 Zeichen bleibt eine dokumentierte weiche Warnung.

### 16.3 Structured Data, Robots und Scope

- Coverage Matrix: **15/15 Seitentypen**. Repräsentativer Runtime-Gate deckt Organization/WebSite,
  Breadcrumb, IglooPro/Consumer Product, sichtbares FAQ und Nicht-FAQ, Article, Event,
  Epigenetics/Musterbefund, Download, Contact, Support und 404 ab. Claim-/Commercial-Erfindungen,
  widersprüchliche Entity-Duplikate und Preview-/Dev-URLs: jeweils **0**.
- Robots: parsebar, produktive Sitemap-Direktive korrekt; `/api` ist in Wildcard und allen
  spezifischen Gruppen keine Indexfläche; `/assets/`, `/locales/` und Consumer bleiben crawlbar.
  Alle 39 spezifischen Bot-Agents und deren bestehender Allow-Intent wurden erhalten.
- Central Route Registry in AP09: **NO**. Der bestehende Sitemap-Adapter ist registry-ready;
  `DG09-01` bleibt `CROSS_AP_ARCHITECTURE_INTEGRATION`, Owner **AP10 PT10.3**, Status
  **READY_FOR_OWNER**, AP09-Closure-Blocker **NO**, Launch-Blocker **YES**.
- Scope Audit: keine AP10-/AP11–AP23-/AP27-/AP29-/AP31-Großarbeit, kein finaler Crawl und keine
  Backlog-Reaktivierung; False-ready Claims: **0**.

### 16.4 Closure Gates, Invarianten und Risiken

- Closure Matrix: **C09-01 bis C09-50 = 50/50 PASS**, einzeln gegen Repository-, Guard- und
  Runtime-Evidenz geprüft.
- SEO-Invarianten: **SEO-01 bis SEO-40 = 40/40 PASS**, einzeln geprüft; nicht nur die Anzahl wurde
  verglichen.
- Risikoklassifikation: `R09-01 ACCEPTED_OWNER_BOUND`; `R09-02`–`R09-09 MITIGATED`;
  `R09-10 ACCEPTED_OWNER_BOUND`; `R09-11`–`R09-12 MITIGATED`. AP09-eigene kritische Blocker: **0**.
- Quality: Typecheck PASS; Unit **285/285**; SEOHead **8/8**; Sitemap **13/13**; Structured Data
  **7/7**; G3/Meta-Guard PASS; Production Client/SSR Build PASS; SEO-Playwright **10/10**;
  unabhängiger HTTP-Audit **390/390** plus vier 404-Fälle PASS.
- Repositoryweiter ESLint-/Prettier-Lauf bleibt als vorbestehende, außerhalb AP09 liegende Baseline
  non-zero: ESLint **120 Errors / 3 Warnings** (aktiv: 11/1), Prettier **34 Dateien**. Der
  AP09-relevante Satz ist lint-/format-sauber; der eine Befund in `AboutPage.tsx` liegt unverändert
  seit vor AP09 in einem nicht von AP09 geänderten Anchor-Hunk. AP09 hat die Baseline nicht erhöht.
- Closure-Fix: Die zuvor im seriellen `quality`-Job hinter diesen Baseline-Gates liegenden
  AP09-Schritte wurden ohne Semantikänderung in den unabhängigen `seo`-Job verschoben. Dadurch ist
  `G3 / CI ACTIVE` eine reale Job-Ausführung und keine bloße vorhandene, aber unerreichbare YAML-Zeile.
