# SEO-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

---

## 1. Purpose

Dieser Vertrag legt fest, welche Zusagen die Site gegenüber Suchmaschinen macht — Canonical, hreflang,
Indexierbarkeit, Sitemap, Structured Data — und welche davon niemals gebrochen werden dürfen.

**Der Leitsatz:** _Routing-Wahrheit speist SEO-Wahrheit._ Kein SEO-Artefakt darf eine zweite,
eigenständige Vorstellung davon haben, welche URLs existieren. Der Routenvertrag ist
`ROUTING-CONTRACT.md`; dieser Vertrag beschreibt, was daraus abgeleitet wird.

Er ist **kein Audit**; Messungen stehen in `QUALITY-BASELINE-LIVE.md` §13.3.

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

| Datei                                  | Rolle                                                                                                                                                                                                                                                                                                            | Guard  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `src/components/seo/SEOHead.tsx`       | Title/Description, **Canonical**, **hreflang + x-default**, robots, OG/Twitter, `og:locale:alternate`, `notFound` → `prerender-status-code`, `GERMAN_ONLY_PATHS`                                                                                                                                                 | **G3** |
| `server.ts`                            | `generateSitemap()`, `SITEMAP_ROUTES`, `CONSUMER_SITEMAP_ROUTES`, `GERMAN_ONLY_SITEMAP_ROUTES`, `NOT_FOUND_MARKER`, HTTP-Status                                                                                                                                                                                  | **G3** |
| `src/components/seo/structuredData.ts` | 18 Exporte: `organizationSchema`, `websiteSchema`, `medicalBusinessSchema`, `localBusinessSchema`, `iglooProProductSchema` + 6 Builder (`createBreadcrumbSchema`, `createFAQSchema`, `createArticleSchema`, `createServiceSchema`, `createEventSchema`, `createReviewSchema`) sowie Datumsnormalisierung und NAP | G2     |
| `src/components/seo/index.ts`          | Barrel — jeder neue Builder muss hier exportiert werden                                                                                                                                                                                                                                                          | G1     |
| `index.html`                           | statische Meta-Fallbacks, die `server.ts` bei echtem Helmet-Titel entfernt                                                                                                                                                                                                                                       | **G3** |
| `public/robots.txt`                    | Crawler-Policy, Sitemap-Zeiger, Consumer-Indexierbarkeit                                                                                                                                                                                                                                                         | G1     |
| `src/data/*`, `src/content/befunde/*`  | Slug-Quellen für dynamische SEO-Ziele                                                                                                                                                                                                                                                                            | G2     |

24 Dateien importieren `SEOHead` — jede Seite ist Konsument dieses Vertrags.

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

**S-17 · German-only-Seiten bewerben genau eine URL.** `GERMAN_ONLY_PATHS` ist in `SEOHead.tsx:103` und
`server.ts:141` **identisch** zu halten; Abbau nur unter AP08 PT08.4.3.

---

## 5. Current Known Debt

| ID       | Schuld                                                                                                                                                       | Beleg                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- |
| **SD-1** | **`lastmod` ist für alle 335 URLs derselbe Wert** — das jeweils heutige Datum (`server.ts:322` `new Date()`), verletzt S-07                                  | `QUALITY-BASELINE-LIVE.md` §13.3 F          |
| **SD-2** | **30 Legal-Einträge** (`/privacy`, `/imprint`, `/terms` × 10) stehen in der Sitemap, während die Seiten `noindex={true}` setzen — verletzt S-08              | gemessen; Master-Scope §5 Altlast 4         |
| **SD-3** | **Consumer nur einsprachig** in `CONSUMER_SITEMAP_ROUTES` (`/en/*`), dazu ein 301-Zwang auf `/en/` — verletzt S-09 und `REST-03`                             | `server.ts`, AP21 PT21.1.8                  |
| **SD-4** | **`GERMAN_ONLY_PATHS` ist ein Handspiegel** über zwei Dateien; ein einseitiger Edit erzeugt zehn Beinahe-Duplikate oder falsche Alternates                   | `IMPLEMENTATION-HOTSPOTS.md` §6             |
| **SD-5** | **Kein einziger SEO-Test.** Weder Canonical, hreflang, Sitemap-Abdeckung noch robots werden geprüft                                                          | `QUALITY-BASELINE-LIVE.md` §16 (SEO = NONE) |
| **SD-6** | **Meta-Description-Guard nicht verdrahtet.** `scripts/check-meta-descriptions.mjs` existiert, ist in keinem npm-Script und in keinem CI-Schritt referenziert | `QUALITY-BASELINE-LIVE.md` §17              |
| **SD-7** | **Sitemap-Kommentar veraltet** — `server.ts` nennt „27 routes × 10 = 270 URLs", gemessen sind **335 `<loc>`** und 3 630 hreflang-Attribute                   | gemessen                                    |
| **SD-8** | **Asset-Asymmetrie** — 17 deutsche gegen 9 englische Epigenetik-PDFs; hreflang darf auf fehlende Assets nicht verweisen (S-03)                               | gemessen                                    |

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

**M-04 — Änderungen an `GERMAN_ONLY_PATHS` immer in beiden Dateien im selben Commit.**

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
