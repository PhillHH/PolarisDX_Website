# ROUTING-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

---

## 1. Purpose

Dieser Vertrag legt fest, wie URLs in der PolarisDX-Relaunch-Site funktionieren müssen — welche
Zusagen niemals gebrochen werden dürfen, welche Dateien heute daran beteiligt sind, und welche
Prüfungen eine Routing-Änderung bestehen muss.

Er ist **kein Audit**. Die zugrundeliegenden Messungen stehen in `QUALITY-BASELINE-LIVE.md` §13.3 und
`IMPLEMENTATION-HOTSPOTS.md` §4.1/§4.2/§6; hier steht nur, was daraus als Regel folgt.

---

## 2. Authority

Verbindlich in dieser Reihenfolge (`PROJECT-CONSTRAINTS.md`):
`scope/MASTER-SCOPE.md` → `PROJECT-CONSTRAINTS.md` → Repository-Evidenz → `BRANCH-RECONCILIATION-MAP.md`
→ `REPO-BASELINE.md` → historische Dokumentation.

**Zuständige APs:** **AP10** (Eigentümer), AP02 PT02.2 (Zielbild), AP03 (IA/Inventar), AP06 (Shell-Links),
AP07 (Such-Index), AP09 (SEO-Ableitung), AP15/AP16 (Epigenetik-Routen), AP17/AP18 (Artikel/Events),
AP20 (Legal/Contact), AP21 (Consumer × 10), AP27 (Guards), AP29 (Migration), AP30 (RC-Abnahme).

**Stand AP02 PT02.2 (2026-08-24):** Das Routing-Zielbild ist festgeschrieben — Ist-Erhebung in **§3.1**,
Zielinvarianten **R-17 bis R-53** (URL-/Locale-Vertrag, Route-Klassen, Route Registry, dynamische
Ressourcen, Redirects, Status, Canonical/hreflang, Konsumenten, Consumer × 10, Epigenetik), Schulden
**RD-8 bis RD-14**, Regeln **M-06 bis M-08**, Nachweise **T-11 bis T-20** mit RTG-Zuordnung, Owner-Grenzen
**§10.1**. PT02.2 ist ein reiner **Dokumentationsschritt**: keine Quell-, Laufzeit-, Konfigurations- oder
Abhängigkeitsdatei wurde geändert, **keine Route Registry implementiert**, keine AP03-/AP06-/AP07-/AP09-/
AP10-/AP15-/AP16-/AP21-/AP27-Arbeit vorgezogen. Der SSR-/Rendering-Vertrag aus **AP02 PT02.1**
(`RUNTIME-CONTRACT.md` RT-38–RT-70) gilt unverändert und wird hier nicht neu verhandelt.

**Baseline:** `feat/home-leadmagnet@961f65d`. **Decision Locks unverändert** — dieser Vertrag setzt
`DEC-RL-001` (10 Sprachen), `DEC-RL-006` (Consumer indexierbar) und `REST-03` (Consumer × 10) um, er
verhandelt sie nicht.

---

## 3. Current Participating Files

**Die vier Handspiegel** — heute führt jede von ihnen einen Teil der Routenwahrheit:

| Datei                            | Rolle                                                                                                                                                                                       | Guard  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `src/App.tsx`                    | einzige Route-Registry (22 `<Route>`), Layout-Zuordnung, Lazy-Grenzen, `ScrollToHash`, `GermanOnlyPage`, `ServicesRedirect`, Catch-all                                                      | **G3** |
| `server.ts`                      | `SITEMAP_ROUTES`, `CONSUMER_SITEMAP_ROUTES`, `GERMAN_ONLY_SITEMAP_ROUTES`, `LEGACY_PATH_REDIRECTS`, `EXTRA_KNOWN_PATHS`, `KNOWN_PATHS`, `isKnownPath`, `NOT_FOUND_MARKER`, Locale-301-Kette | **G3** |
| `src/hooks/useSearch.ts`         | Such-Index (`staticPages`, `services`) — **vierter Spiegel**                                                                                                                                | G2     |
| `src/components/seo/SEOHead.tsx` | `GERMAN_ONLY_PATHS`, Canonical-/hreflang-Ableitung, `notFound` → `prerender-status-code`                                                                                                    | **G3** |

**Mitbeteiligt:**
`e2e/url-smoke.spec.ts` (einziger Routen-Guard) · `src/components/layout/Header.tsx` (`navItems`) ·
`src/components/layout/Footer.tsx` (hartkodierte Links) · `src/data/services.tsx` (9 Service-IDs) ·
`src/data/articles.ts` (6 Artikel-Slugs) · `src/content/befunde/index.ts` (6 Panel-Slugs) ·
`src/content/befunde/legacyAnchors.ts` (Alt-Anker) · `public/robots.txt`.

### 3.1 Ist-Zustand Routing (AP02 PT02.2, read-only erhoben 2026-08-24)

**Gemessener IST-Zustand, nicht das SOLL.** Er begründet die Zielinvarianten in §4 und die Schulden
`RD-8`–`RD-14` in §5, ist **keine** Freigabe und **kein** zulässiges Zielverhalten. Erhebung durch
Quelllesung ohne Änderung.

**Die Routing-Wahrheit wird heute an acht Stellen von Hand geführt** — §3 nennt vier, gezählt sind es
acht:

| #     | Spiegel                  | Datei                            | Ist-Befund                                                                                                                                                                                                          |
| ----- | ------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A** | React Router             | `src/App.tsx`                    | **37 `<Route>`-Elemente**, 33 konkrete Pfadmuster plus Catch-all `*`; explizite Pfade stehen korrekt vor ihren `:slug`-Auffangpfaden; `/services` und `/services/:slug` lösen ein clientseitiges `<Navigate>` aus   |
| **B** | Known Paths / 404-Status | `server.ts`                      | `KNOWN_PATHS = SITEMAP_ROUTES ∪ EXTRA_KNOWN_PATHS`; `EXTRA_KNOWN_PATHS` hat **6 Handausnahmen + 2 German-only**; `isKnownPath` lässt `/services/<x>` zusätzlich per Pattern durch; Soft-404 über `NOT_FOUND_MARKER` |
| **C** | Sitemap                  | `server.ts`                      | **drei** Handtabellen: `SITEMAP_ROUTES` (**36 Pfade**, × 10 Sprachen), `CONSUMER_SITEMAP_ROUTES` (**3, nur `/en/`**), `GERMAN_ONLY_SITEMAP_ROUTES` (**2, nur `/de/`**)                                              |
| **D** | Search-Index             | `src/hooks/useSearch.ts`         | **6 handgeschriebene statische Pfade**, ein auskommentierter `/casestudys/32reasons`, vier Service-IDs — darunter **`sports`, für das keine Route existiert**; Artikel werden aus `articles.ts` abgeleitet          |
| **E** | Redirects                | `server.ts`                      | `LEGACY_PATH_REDIRECTS` (`/agb`, `/s3-leitlinie`), Locale-Canonicalization-Kette, **zwei Consumer-Zweige, die alles auf `/en/…` zwingen**, German-only auf `/de/…`; `/services*` **nicht** auf HTTP-Ebene           |
| **F** | Canonical/hreflang       | `src/components/seo/SEOHead.tsx` | eigene Kopie von `GERMAN_ONLY_PATHS`, Canonical aus der URL-Sprache, hreflang über die Sprachliste, `notFound`-Unterdrückung — kennt die Routenmenge selbst nicht                                                   |
| **G** | Navigation               | `Header.tsx`, `Footer.tsx`       | `navItems` von Hand, **Epigenetik als Kind des `/diagnostics`-Menüpunkts**, ein Ziel mit Fragment (`/epigenetics#musterbefunde`), zwei tote auskommentierte Einträge; Footer mit **17 hartkodierten Links**         |
| **H** | Tests                    | `e2e/url-smoke.spec.ts`          | **15 statische + 2 dynamische Routen + 2 Redirects** von Hand; Zusicherung `status < 400` bzw. „URL enthält Ziel" — ein 301 statt 200 und eine Soft-404 bestünden den Guard                                         |

**Strukturell entscheidender Befund:** `KNOWN_PATHS` wird **aus der Sitemap abgeleitet**. Damit ist
_„nicht in der Sitemap = unbekannte Route"_ heute die tatsächliche Architektur — notdürftig repariert
durch acht Handausnahmen in `EXTRA_KNOWN_PATHS`. Genau diese Annahme verbietet das Zielbild (R-40, R-48).

**Weitere Ist-Fakten:**

- Dynamische Slugs sind **doppelt geführt**: 9 Services (`src/data/services.tsx`), 6 Artikel
  (`src/data/articles.ts`) und 6 Musterbefunde (`src/content/befunde/`) existieren als Datensätze **und**
  noch einmal als Handzeilen in `SITEMAP_ROUTES`.
- Musterbefund-Inhalte liegen als JSON nur in **`de` und `en`** vor, während die Routen × 10 in der
  Sitemap stehen.
- Epigenetik ist **routenseitig** bereits eine eigene Familie (Hub + 3 Vertiefungen + 6 Musterbefunde +
  `:slug`-Auffang) — die Unterordnung besteht nur in der Navigation.
- Consumer-Routen existieren dreimal in `App.tsx` und sind eager importiert (`RUNTIME-CONTRACT.md` §3.1),
  werden aber serverseitig auf `/en/` gezwungen.

---

## 4. Target Invariants

**R-01 · Sprachpräfix ist Pflicht.** Jede öffentliche URL trägt genau ein Präfix aus
`de en pl fr it es pt da nl cs`. Kein Inhalt ist ohne Präfix erreichbar. _(AP02 PT02.2.1)_

**R-02 · Default-Locale ist `de`.** Unpräfixierte URLs existieren ausschließlich als **301-Ziel**, nie
als auslieferbare Seite. _(AP02 PT02.2.2, AP10 PT10.1.1)_

**R-03 · Redirects sind echte HTTP 301.** Kein 302, kein clientseitiger `<Navigate>` als Ersatz für eine
Migrationszusage. _(AP10 PT10.1, AP27 PT27.5.1)_

**R-04 · Ein Hop.** Jede Alt-URL erreicht ihr Ziel in genau einer Umleitung. Keine Ketten, keine
Schleifen. _(AP10 PT10.1.4)_

**R-05 · Unbekannte Pfade antworten echt 404.** Statisch unbekannte Pfade **und** unbekannte dynamische
Slugs. Keine Soft-404. _(AP10 PT10.4, AP09 PT09.1.6)_

**R-06 · Der 404-Handshake bleibt intakt.** `SEOHead notFound` emittiert
`<meta name="prerender-status-code" content="404">`; `server.ts` liest genau diesen String über
`NOT_FOUND_MARKER`. **Beide Seiten sind byte-identisch zu halten.** _(Baseline-Härtung, `N2`/`N1`)_

**R-07 · Route Registry wird die einzige Wahrheit.** Ab AP10 PT10.3 leiten sich App-Routen, Known Paths,
Sitemap, Search, Redirects, SEOHead und Tests **aus derselben Quelle** ab. Danach ist jede parallele
Handtabelle verboten.

**R-08 · Explizite Slugs vor Catch-all.** In `App.tsx` stehen konkrete Pfade **vor** ihrem
`:slug`-Auffangpfad, sonst fängt der Catch-all sie ab. _(AP16 PT16.1.3)_

**R-09 · Consumer-Routen in allen 10 Sprachen, indexierbar.** `/[lang]/consumer/{vitamin-d3-spray,
hydrating-masks, inside-out-duo}`. **Kein EN-Zwangsredirect.** Kein `noindex`, keine Basic Auth.
_(`REST-03`, `DEC-RL-006`, AP21 PT21.1.8/PT21.6)_

**R-10 · Epigenetik ist eine eigene Routenfamilie.** Hub `/[lang]/epigenetics`, drei Vertiefungsseiten
`…/grundlagen|studienlage|unterlagen`, sechs Musterbefunde
`…/musterbefund/{metabolic-health, healthy-aging, biologische-altersuhr, telomer-analyse,
stress-monitor, healthy-sport}` — alle × 10 Sprachen. _(`DEC-RL-005`, AP15 PT15.7.1, AP16)_

**R-11 · Dynamische Slugs stammen aus genau einer Datenquelle.** Services aus `src/data/services.tsx`
(9), Artikel aus `src/data/articles.ts` (6), Musterbefunde aus `src/content/befunde/` (6). Ein Slug
ohne Datensatz **muss** 404 liefern. _(AP02 PT02.3.2)_

**R-12 · Legacy-Pfade bleiben bedient.** `/agb` → `/[lang]/terms`; `/s3-leitlinie` → `/de/s3_leitlinie`.
Beide in einem Hop. Entfernen ist nur nach AP29 PT29.2 zulässig. _(AP10 PT10.2)_

**R-13 · `/services*` wird eine echte serverseitige 301-Brücke** auf `/[lang]/diagnostics*`.
_(AP10 PT10.1.2, Master-Scope §5 Altlast 1)_

**R-14 · Historische Anker bleiben erreichbar.** `src/content/befunde/legacyAnchors.ts` bildet alte,
aus übersetzten Überschriften erzeugte Sprungmarken auf feste IDs ab. Nicht ersatzlos entfernen.
_(AP16 PT16.3.7)_

**R-15 · German-only-Sonderfälle sind synchron zu halten.** `GERMAN_ONLY_PATHS`
(`/s3_leitlinie`, `/vitamin-d3-implantologie`) steht identisch in `server.ts:141` **und**
`SEOHead.tsx:103`. Der Abbau dieser Sonderlogik ist **AP08 PT08.4.3 vorbehalten** — nicht eigenmächtig.

**R-16 · Jede navigierbare Seite hat einen Einstieg.** Eine Route ohne Eintrag in Navigation, Footer
oder Suche ist nur per Direkt-URL erreichbar; das schließt AP07 DoD aus. Bewusste Ausnahmen werden im
Code begründet (Vorbild: `/support` in `EXTRA_KNOWN_PATHS`).

### URL- und Locale-Vertrag (AP02 PT02.2)

**R-17 · Die Sprachmenge ist abschließend:** `de`, `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs`.
Sie ist Decision Lock (`DEC-RL-001`), keine Konfigurationsfrage. Eine elfte Sprache oder eine reduzierte
Menge ist eine Scope-Änderung über `SCOPE-CHANGELOG.md`, nicht eine Routing-Entscheidung.

**R-18 · Die Locale ist deterministisch aus der URL ableitbar** — aus dem Präfix und aus nichts sonst.
Weder `Accept-Language` noch Cookie, `localStorage` oder ein Geo-Signal erzeugt eine zweite
Routing-Wahrheit. _(`MASTER-SCOPE.md` §1.1, `RUNTIME-CONTRACT.md` RT-45)_

**R-19 · Default- und `x-default`-Locale ist `de`**, solange `SEO-CONTRACT.md` S-02 nichts anderes
festlegt. _(präzisiert R-02)_

**R-20 · Unpräfixierte Seiten-URLs sind ausschließlich Redirect-Einstiegspunkte.** Sie sind kein zweiter
Content-Origin, keine kanonische URL, kein Sitemap-Eintrag und kein Canonical- oder hreflang-Ziel.
_(präzisiert R-02)_

**R-21 · Route-Identität ist Locale + Pfadmuster + aufgelöste dynamische Parameter.** Query-String und
Fragment gehören **nicht** zur Route-Identität: sie erzeugen keine zweite Route, keinen eigenen
Canonical und keinen eigenen Sitemap-Eintrag. Wie ein Redirect Query und Fragment behandelt, ist eine
ausdrückliche Regel des Redirect-Vertrags (R-35), keine Nebenwirkung.

**R-22 · Seitenrouten, technische Pfade und Assets sind eindeutig unterscheidbar.** `/api/*`, statische
Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` und Health-/Monitoring-Pfade sind keine Seitenrouten:
keine Locale-Weiche, kein Präfixzwang, kein Seiten-404-Handshake, kein Canonical.
_(`RUNTIME-CONTRACT.md` RT-20/RT-21)_

### Route-Klassen (AP02 PT02.2)

**R-23 · Jede Route gehört genau einer Klasse an, und die Klasse bestimmt ihre Policies.** Eine Route
ohne Klasse ist keine beschlossene Route.

| #      | Klasse                           | Pfadform (Ist-Beispiel)                                       | Locale-Policy                 | Sitemap                                | Status                        |
| ------ | -------------------------------- | ------------------------------------------------------------- | ----------------------------- | -------------------------------------- | ----------------------------- |
| **1**  | reguläre B2B-Seite               | `/[lang]/about`, `/[lang]/diagnostics`                        | 10                            | ja                                     | 200                           |
| **2**  | dynamische Service-Route         | `/[lang]/diagnostics/:slug`                                   | 10                            | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **3**  | Artikel-Route                    | `/[lang]/articles/:slug`                                      | 10 (Umfang AP08/AP17)         | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **4**  | Epigenetik-Hub                   | `/[lang]/epigenetics`                                         | 10                            | ja                                     | 200                           |
| **5**  | Epigenetik-Vertiefung            | `/[lang]/epigenetics/{grundlagen,studienlage,unterlagen}`     | 10                            | ja                                     | 200                           |
| **6**  | Musterbefund                     | `/[lang]/epigenetics/musterbefund/:slug`                      | 10                            | ja, aus der Slug-Quelle                | 200 · **404** bei unbek. Slug |
| **7**  | Consumer-Landingpage             | `/[lang]/consumer/:produkt`                                   | **10** (`REST-03`)            | ja, × 10                               | 200                           |
| **8**  | Legal                            | `/[lang]/{privacy,imprint,terms}`                             | 10                            | folgt der Indexierbarkeits-Policy      | 200                           |
| **9**  | Support-/sonstige bekannte Seite | `/[lang]/support`                                             | 10                            | **bewusst nein** — bleibt trotzdem 200 | 200                           |
| **10** | sprachgebundene Sonderseite      | `/de/s3_leitlinie`, `/de/vitamin-d3-implantologie`            | **single-locale**, deklariert | einmalig, ohne Alternates              | 200                           |
| **11** | Legacy Redirect Source           | `/agb`, `/s3-leitlinie`, `/services`, `/services/:slug`       | n/a                           | **nie**                                | **301**                       |
| **12** | technischer Nicht-Seitenpfad     | `/api/*`, Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` | n/a                           | **nie**                                | eigene Semantik               |
| **13** | unbekannter Pfad                 | alles übrige                                                  | n/a                           | **nie**                                | **404**                       |

Zu Klasse **8**: ob Legal indexierbar ist, ist eine offene Produktentscheidung — der heutige Widerspruch
(Sitemap-Eintrag bei gesetztem `noindex`) ist `SEO-CONTRACT.md` SD-2, Owner **AP20 PT20.4.8**. PT02.2
verlangt nur, dass die Policy **deklariert** ist und Sitemap und Indexierbarkeit ihr gemeinsam folgen.

Zu Klasse **10**: die Sonderlogik besteht heute als Pfadliste in zwei Dateien (R-15, `SEO-CONTRACT.md`
S-17). Im Zielmodell ist sie eine deklarierte Locale-Policy der Route (R-45). Ihr Abbau bleibt
**AP08 PT08.4.3** vorbehalten — PT02.2 entscheidet ihn nicht.

### Route Registry als Single Source of Truth (AP02 PT02.2)

**R-24 · Es gibt genau eine kanonische Routing-Wahrheit.** Sie beantwortet, welche Routen existieren,
in welchen Sprachen und mit welchen Policies. _(schärft R-07)_

**R-25 · Pflichtkonsumenten leiten ab, sie pflegen nicht mit.** Aus derselben Wahrheit stammen
mindestens: React-Router-Routen · serverseitige Known-Path-/404-Entscheidung · Sitemap ·
Canonical/hreflang · Search-Index · Redirect-Mapping · Validierung der Navigations-Linkziele ·
Route-/Status-Tests. **Kein Konsument führt eine eigene Vorstellung davon, welche URLs existieren.**

**R-26 · Ableitung heißt nicht Generierung aus einer Datei.** Ein Konsument darf eigene
Darstellungsdaten führen — Sitemap-Priorität und `changefreq`, Suchgewicht und Snippet, Menütitel und
Reihenfolge, Testauswahl. Verbindlich geprüft wird die **Pfad- und Locale-Menge**, nicht die Form der
Konfiguration.

**R-27 · Die Registry führt mindestens diese konzeptionellen Felder.** Es sind **Architekturfelder,
keine Property-Namen**; die konkrete Form entscheidet **AP10 PT10.3**.

| Feld                         | Beantwortet                                                                  |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Route-ID                     | stabile Identität, unabhängig von Übersetzung und Pfadkosmetik               |
| Pfadmuster                   | die präfixlose Form, inklusive dynamischer Parameter                         |
| Route-Klasse / Seitentyp     | welche Policies gelten (R-23)                                                |
| Locale-Policy                | in welchen der zehn Sprachen die Route existiert                             |
| Indexierbarkeit              | ob Suchmaschinen sie indexieren sollen                                       |
| Sitemap-Teilnahme            | ob sie in die Sitemap gehört — **getrennt** von Existenz und Indexierbarkeit |
| Canonical-Policy             | wie die kanonische URL gebildet wird                                         |
| hreflang-Policy              | welche Alternates beworben werden dürfen                                     |
| Status-Semantik              | erwarteter Statuscode und Not-Found-Verhalten                                |
| Redirect-Semantik            | ob die Route Redirect-Quelle oder -Ziel ist, mit Status                      |
| Search-Eignung               | ob sie ein Suchziel sein darf                                                |
| Navigations-Eignung          | ob sie überhaupt navigierbar ist — **nicht**, wo sie im Menü steht           |
| Quelle dynamischer Parameter | welche fachliche Datenquelle die gültigen Slugs besitzt                      |
| Test-/Smoke-Relevanz         | ob die Route in die automatisierte Statusmatrix gehört                       |

**R-28 · Die Route Registry ist keine Content-Datenbank.** Sie kennt Existenz und Policy einer Route,
nicht deren Inhalt. Die fachlichen Datenquellen — Services, Artikel, Musterbefunde, Events und weitere
dynamische Inhalte — bleiben Eigentümer ihrer Datensätze **und ihrer gültigen Slugs**. Die Registry
**referenziert** die Quelle, sie kopiert sie nicht.

**R-29 · Es entsteht keine zentrale Mega-Konfigurationsdatei als Selbstzweck.** Verbindlich ist die
**Ableitbarkeit und die Prüfbarkeit der Drift**, nicht ein bestimmtes Dateilayout. Ob die Wahrheit ein
Modul, mehrere domänennahe Module mit einem gemeinsamen Aggregat oder ein generiertes Manifest ist,
entscheidet **AP10**.

### Dynamische Ressourcen (AP02 PT02.2)

**R-30 · Ein Pattern-Treffer ist keine Ressourcen-Existenz.** Dass `/[lang]/articles/:slug` matcht, sagt
nichts darüber, ob dieser Slug existiert.

**R-31 · Ein dynamischer Slug ohne Datensatz erzeugt eine echte 404** — auf HTTP-Ebene, nicht nur als
sichtbare Fehlerseite. _(schärft R-05, R-11)_

**R-32 · Die Parameterauflösung gehört zur Routenauflösung, nicht zur Seitendarstellung.** Die
Statusentscheidung darf nicht davon abhängen, ob und wann die Seitenkomponente gerendert hat.
_(`RUNTIME-CONTRACT.md` RT-52/RT-56 und `RD-12` dort)_

**R-33 · Jede dynamische Route benennt genau eine Slug-Quelle.** Zwei Quellen für dieselbe Route — etwa
eine Datendatei **und** eine Handliste in der Sitemap — sind verboten. _(schärft R-11)_

### Redirect-Vertrag (AP02 PT02.2)

**R-34 · Redirects gehören genau einer Klasse an:**

| Klasse | Zweck                        | Beispiel (Ist)                        |
| ------ | ---------------------------- | ------------------------------------- |
| **A**  | Locale-Canonicalization      | `/about` → `/de/about`                |
| **B**  | Legacy Route Migration       | `/agb` → `/[lang]/terms`              |
| **C**  | Alias-/Schreibweisen-URL     | `/s3-leitlinie` → `/de/s3_leitlinie`  |
| **D**  | Struktur-Brücke              | `/services*` → `/[lang]/diagnostics*` |
| **E**  | sprachpolitischer Sonderfall | German-only-Seiten → `/de/…`          |

Klasse **E** besteht nur, solange der Master-Scope den Sonderfall trägt; der Consumer-Zwang auf `/en/`
gehört **nicht** dazu und ist im Zielmodell unzulässig (R-52).

**R-35 · Jeder Redirect deklariert Quelle, Ziel, Status und das Verhalten für Query und Fragment
ausdrücklich.** Kein implizites Verschlucken, kein implizites Anhängen.

**R-36 · Jedes Redirect-Ziel ist eine bekannte kanonische Route der Registry** — und ist selbst keine
Redirect-Quelle. Damit sind Ketten und Schleifen strukturell ausgeschlossen. _(stützt R-04)_

**R-37 · Redirect-Quellen sind keine kanonischen Seiten.** Sie tragen keinen Canonical, kein hreflang,
keinen Sitemap-Eintrag und keinen Search-Treffer — und sie antworten nicht 404, sondern mit ihrem
Redirect-Status.

**R-38 · `/services*` ist eine echte serverseitige 301-Brücke.** `/services` → `/[lang]/diagnostics`,
`/services/:slug` → `/[lang]/diagnostics/:slug`: auf HTTP-Ebene, in **einem** Hop, ohne
200-Zwischenzustand, ohne clientseitiges `<Navigate>` als Ersatz. Die Locale der Anfrage bleibt
erhalten. Ob das Ziel existiert, entscheidet danach die Zielroute (R-30/R-31) — die Brücke selbst prüft
keinen Slug. Die Brücke muss aus der zentralen Routing-Wahrheit prüfbar sein. _(schärft R-13; Owner
**AP10 PT10.1.2**)_

### 404- und Status-Vertrag (AP02 PT02.2)

**R-39 · Die Statusmatrix ist verbindlich:**

| Situation                                           | Status  | Canonical/hreflang | Sitemap |
| --------------------------------------------------- | ------- | ------------------ | ------- |
| bekannte Route, Ressource vorhanden                 | **200** | ja                 | policy  |
| bekannte Route, bewusst nicht in der Sitemap        | **200** | ja                 | nein    |
| bekannte dynamische Route, Slug unbekannt           | **404** | **keine**          | nein    |
| unbekannter statischer Pfad                         | **404** | **keine**          | nein    |
| Redirect-Quelle                                     | **301** | am Ziel            | nein    |
| bekannte Route, Verarbeitung/Rendering schlägt fehl | **5xx** | —                  | —       |

**R-40 · Route-Existenz ist unabhängig von Sitemap-, Search- und Navigations-Teilnahme.** Es sind vier
getrennte Eigenschaften: **Existenz** · **Indexierbarkeit/Sitemap** · **Auffindbarkeit in der Suche** ·
**Navigationsplatzierung**. Ausdrücklich ausgeschlossen sind die Architekturannahmen
_„nicht in der Sitemap = unbekannte Route"_ und _„nicht in der Navigation = unbekannte Route"_.

**R-41 · Ein Laufzeitfehler einer bekannten Route wird nicht als 404 ausgewiesen.**
_(`RUNTIME-CONTRACT.md` RT-57/RT-58; die Fehlerklassen-Tabelle dort §5.5 gilt unverändert)_

**R-42 · Eine neue Route antwortet nicht deshalb 404, weil ein Spiegel vergessen wurde.** Nach der
Registry ist dieser Fehlerfall strukturell ausgeschlossen; bis dahin gilt die Spiegelpflicht M-01/M-06.

### Canonical- und hreflang-Ableitung (AP02 PT02.2)

**R-43 · Canonical entsteht aus Route-Identität und Locale-Policy** — nicht aus einer zweiten
Routentabelle in der SEO-Schicht. _(`SEO-CONTRACT.md` S-01)_

**R-44 · hreflang bewirbt genau die Locale-Varianten, die die Locale-Policy der Route zusagt und die
tatsächlich ausgeliefert werden.** _(`SEO-CONTRACT.md` S-02/S-03)_

**R-45 · Sprachliche Sonderfälle sind deklarierte Policies, keine implizite Sonderlogik.** Eine
einsprachige Route trägt eine erklärte Locale-Policy — nicht eine Pfadliste, die in zwei Dateien
synchron gehalten werden muss. _(löst konzeptionell R-15 / `SEO-CONTRACT.md` S-17 ab; Abbau der heutigen
Liste bleibt AP08 PT08.4.3)_

**R-46 · 404-Antworten und Redirect-Quellen publizieren keinen Canonical und kein hreflang.**
_(`SEO-CONTRACT.md` S-04, hier R-37)_

**R-47 · Die SEO-Schicht pflegt keine eigene Routenwahrheit.** Sie erhält Route-Identität und
Locale-Policy aus der Registry und leitet daraus ab. Owner der Umsetzung: **AP09** mit **AP10**.

### Konsumenten: Sitemap, Search, Navigation (AP02 PT02.2)

**R-48 · Die Sitemap ist Konsument, nicht Quelle.** Sie ist keine separate Liste existierender Seiten.
**Insbesondere dürfen Known Paths niemals aus der Sitemap abgeleitet werden** — das ist die heutige
Richtung und im Zielmodell verboten (`RD-8`).

**R-49 · Die Sitemap enthält ausschließlich indexierbare kanonische Ziel-URLs.** Keine Redirect-Quellen,
keine 404, keine `noindex`-Seiten (`SEO-CONTRACT.md` S-08). Dynamische Einträge entstehen aus
Routendefinition **und** realer Datenquelle. Consumer × 10 muss abbildbar sein; die hreflang-Angaben der
Sitemap entsprechen der Locale-Policy der Route.

**R-50 · Search ist Konsument.** Kein eigener Pfadkatalog, keine erfundenen Ziele: jeder Treffer zeigt
auf eine bekannte Route in der aktiven Locale. Search darf eigene Metadaten führen — Gewichtung,
Snippet, Synonyme, Gruppierung — aber keine eigenen Pfade. Tote Treffer sind durch Ableitung strukturell
verhinderbar. Owner: **AP07**.

**R-51 · Navigation ist Konsument und nicht die Registry.** Header, Footer und Kapitelnavigationen
konfigurieren Auswahl, Reihenfolge und Beschriftung; ihre Linkziele müssen gegen die Routing-Wahrheit
validierbar sein (Fragment abgetrennt geprüft, R-21). **Nicht jede Route muss navigierbar sein**, und
Navigationszugehörigkeit begründet keine Route. Hierarchie und Platzierung entscheiden **AP03** und
**AP06**; die Registry entscheidet Existenz und Policy. _(bestehendes R-16 bleibt gültig)_

### Consumer und Epigenetik (AP02 PT02.2)

**R-52 · Consumer × 10 ist das Routing-Zielbild.** `/[lang]/consumer/{vitamin-d3-spray,
hydrating-masks, inside-out-duo}` in **allen zehn Sprachen**: öffentlich indexierbar, im Canonical-,
hreflang- und Sitemap-Modell, ohne Basic Auth, ohne `noindex`, ohne eigenen SPA-Router und ohne
Sonderarchitektur. `/en/consumer/*` ist **eine Sprachvariante unter zehn**. Eine Regel, die alle
Consumer-Sprachen nach `/en/` zwingt, ist im Zielmodell unzulässig. Es gelten die normalen 404-, Status-
und SSR-Verträge. _(`REST-03`, `DEC-RL-006`; schärft R-09; `RUNTIME-CONTRACT.md` RT-67/RT-68; Owner
**AP21** mit AP08/AP09/AP10)_

**R-53 · Epigenetik ist routenseitig eine eigenständige Säule, keine Untergruppe von `/diagnostics`.**
Eigene Routenfamilie — Hub, drei Vertiefungsseiten, sechs Musterbefunde, alle × 10 —, eigene
SEO-Identität, eigene Findability, dieselben SSR-, 404-, Canonical- und hreflang-Verträge wie jede
andere Seite. Eine Modellierung als Diagnostik-Unterpunkt ist ausgeschlossen. _(`DEC-RL-005`; stützt
R-10; `RUNTIME-CONTRACT.md` RT-69; Owner **AP15**/**AP16**, IA-Seite **AP03**/**AP06**)_

---

## 5. Current Known Debt

| ID       | Schuld                                                                                                                                                                                            | Beleg                              |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| **RD-1** | **Vier manuelle Routenspiegel** ohne Erzwingung: `App.tsx` ↔ `server.ts` ↔ `useSearch.ts` ↔ `SEOHead.tsx`. `server.ts:287` sagt selbst _„MIRRORS src/App.tsx"_                                    | `IMPLEMENTATION-HOTSPOTS.md` §6    |
| **RD-2** | **`/services*` ist keine echte Brücke.** Gemessen: `/services` → 301 `/de/services` → **200**; die Umleitung nach `/diagnostics` macht ein clientseitiges `<Navigate>` (`App.tsx:414-415`)        | `QUALITY-BASELINE-LIVE.md` §13.3 C |
| **RD-3** | **E2E prüft Statussemantik nicht verlässlich.** `toBeLessThan(400)` akzeptiert Redirects als Erfolg; der 404-Test prüft **Text**, nicht Status — eine Soft-404 mit HTTP 200 bestünde ihn          | `QUALITY-BASELINE-LIVE.md` §13.4   |
| **RD-4** | **`reuseExistingServer: !process.env.CI`** in `playwright.config.ts`: auf jeder Maschine mit Dienst auf Port 3000 läuft die Suite gegen eine fremde Anwendung — auf dem Analyse-Host nachgewiesen | `QUALITY-BASELINE-LIVE.md` §13.2   |
| **RD-5** | **Such-Index unvollständig und mit totem Ziel.** `useSearch.ts` führt 6 statische Pfade gegen 38 Sitemap-Pfade und den Service `sports` (`:87`), den `services.tsx` nicht kennt                   | AP07 PT07.1.9                      |
| **RD-6** | **Consumer wird auf `/en/` zwangsumgeleitet** (`server.ts`, zwei 301-Zweige) und steht nur einsprachig in der Sitemap — gegen `REST-03`                                                           | AP21 PT21.1.8                      |
| **RD-7** | **Veralteter Codekommentar:** `server.ts` spricht von _„27 routes × 10 = 270 URLs"_; gemessen sind **335 `<loc>`**                                                                                | `QUALITY-BASELINE-LIVE.md` §13.3 F |

Diese Schulden sind **Ist-Zustand**, kein erlaubtes Zielverhalten. Sie werden von AP10 (RD-1, RD-2, RD-7),
AP07 (RD-5), AP21/AP08 (RD-6) und AP27 (RD-3, RD-4) aufgelöst.

### 5.1 Routing-Schulden aus AP02 PT02.2 (erhoben 2026-08-24)

Ist-Zustand aus §3.1. **Kein zulässiges Zielverhalten**; in PT02.2 bewusst **nicht** repariert.

| ID        | Schuld                                                                                                                                                                                                                                                                                   | Verletzt           | Owner                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------- |
| **RD-8**  | **Known Paths werden aus der Sitemap abgeleitet** — `KNOWN_PATHS = SITEMAP_ROUTES ∪ EXTRA_KNOWN_PATHS`. „Nicht in der Sitemap = unbekannte Route" ist damit die reale Architektur, geflickt durch acht Handausnahmen. Der Kommentar in `server.ts` sagt selbst _„MIRRORS src/App.tsx"_.  | R-40, R-48, R-24   | **AP10 PT10.3**                 |
| **RD-9**  | **Dynamische Slugs sind doppelt geführt** — 9 Services, 6 Artikel und 6 Musterbefunde existieren als Datensätze **und** noch einmal als Handzeilen in `SITEMAP_ROUTES`; dazu zwei Sondertabellen (`CONSUMER_SITEMAP_ROUTES`, `GERMAN_ONLY_SITEMAP_ROUTES`).                              | R-33, R-49         | **AP09 PT09.2** mit AP10 PT10.3 |
| **RD-10** | **Acht Routenspiegel statt vier** — zu `App.tsx`, `server.ts`, `useSearch.ts` und `SEOHead.tsx` (`RD-1`) kommen die drei Sitemap-Tabellen, `Header.tsx`/`Footer.tsx` und `e2e/url-smoke.spec.ts`. Eine neue Route verlangt heute bis zu acht koordinierte Handeingriffe.                 | R-24, R-25         | **AP10** mit AP06/AP07/AP27     |
| **RD-11** | **Epigenetik hängt navigatorisch unter Diagnostik** — `Header.tsx` führt `/epigenetics` und `/epigenetics#musterbefunde` als Kinder des `/diagnostics`-Menüpunkts. Die **Routen** sind bereits eigenständig; der Widerspruch zu `DEC-RL-005` besteht auf IA-/Navigationsebene.           | R-53, `DEC-RL-005` | **AP03**/**AP06** mit AP15      |
| **RD-12** | **Search führt einen eigenen Pfadkatalog** — sechs handgeschriebene statische Pfade, ein auskommentierter `/casestudys/32reasons` und der tote Service `sports` ohne Route (bereits `RD-5`).                                                                                             | R-50               | **AP07 PT07.1**                 |
| **RD-13** | **Der einzige Routen-Guard prüft keine Statuscodes** — `e2e/url-smoke.spec.ts` listet 15 statische, 2 dynamische Routen und 2 Redirects von Hand und sichert `status < 400` bzw. „URL enthält Ziel" zu. Ein 301 statt 200 und eine Soft-404 bestünden ihn (verschärft `RD-3`).           | R-25, T-11         | **AP27 PT27.5**                 |
| **RD-14** | **Musterbefund-Daten decken die beworbene Locale-Menge nicht** — `src/content/befunde/` führt sechs Panels in **`de` und `en`**, während die sechs Routen × 10 in der Sitemap stehen und hreflang × 10 tragen. Locale-Policy und Datenlage weichen auseinander (`SEO-CONTRACT.md` S-03). | R-44, `DEC-RL-001` | **AP08**/**AP16**               |

Auch diese Schulden sind **Ist-Zustand**, kein erlaubtes Zielverhalten. `RD-2` (`/services*` ist keine
echte HTTP-Brücke) und `RD-6` (Consumer-Zwang auf `/en/`) bleiben unverändert bestehen und sind mit
R-38 bzw. R-52 nun ausdrücklich als Zielverletzung benannt.

---

## 6. Modification Rules

**M-01 — Die Kerninvariante.** _Eine Route darf niemals in nur einem der Spiegel angelegt werden._
Bis AP10 PT10.3 die Registry etabliert, erfordert **jede** Routing-Änderung die koordinierte Prüfung von:

```
src/App.tsx
server.ts
src/hooks/useSearch.ts
src/components/seo/SEOHead.tsx
e2e/url-smoke.spec.ts
```

und, sofern der Pfad einen dynamischen Slug trägt, zusätzlich:

```
src/data/services.tsx      (Services)
src/data/articles.ts       (Artikel)
src/content/befunde/index.ts (Musterbefunde)
```

**M-02 — Checkliste beim Anlegen einer Route.** `<Route>` in `App.tsx` · Eintrag in `SITEMAP_ROUTES`
**oder** `EXTRA_KNOWN_PATHS` · Such-Index, falls strategisch relevant · Navigations-/Footer-Einstieg
oder begründete Ausnahme · Testeintrag · korrekte Reihenfolge gegenüber `:slug`-Catch-alls.

**M-03 — Beim Entfernen einer Route** dieselben Stellen rückbauen **und** eine Redirect-Entscheidung
treffen (AP29 PT29.2). Eine entfernte Route, die in der Sitemap bleibt, erzeugt eine gecrawlte Soft-404.

**M-04 — `server.ts` und `App.tsx` niemals aus `main` übernehmen.** `BRANCH-RECONCILIATION-MAP.md`
**N1** und **N12**: `main`s Fassungen verlieren `isKnownPath`, `NOT_FOUND_MARKER`, `no-store`, die
Legacy-Redirects und den `GermanOnlyPage`-Guard. Nur Hunks, nie Dateien.

**M-05 — Nach AP10 PT10.3 sind parallele Handtabellen verboten.** Wer dann noch eine zweite Routenliste
anlegt, verletzt R-07.

**M-06 — Die Spiegelliste aus M-01 ist unvollständig.** Bis die Registry existiert, gehören zusätzlich
zu den dort genannten fünf Dateien auch die drei Sitemap-Tabellen in `server.ts`, `Header.tsx`,
`Footer.tsx` und `e2e/url-smoke.spec.ts` in jede Routing-Änderung (`RD-10`, §3.1).

**M-07 — Eine Route wird nicht über die Sitemap „bekannt gemacht".** Wer heute eine Route ergänzt, trägt
sie bewusst in die Known-Path-Wahrheit ein **und** entscheidet die Sitemap-Teilnahme getrennt. Existenz
und Indexierbarkeit sind zwei Entscheidungen, nicht eine (R-40, `RD-8`).

**M-08 — Redirect-Ziele werden gegen die Routenwahrheit geprüft, nicht angenommen.** Ein Ziel, das keine
bekannte kanonische Route ist, ist ein Fehler — auch wenn der Redirect „funktioniert" (R-36).

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `App.tsx`, `server.ts`, `SEOHead.tsx` oder
`useSearch.ts` liest ein Agent in dieser Reihenfolge:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. den zuständigen AP-Abschnitt in `building-docs/scope/MASTER-SCOPE.md` (mindestens AP10)
4. **diesen Vertrag**
5. `building-docs/state/AP-STATE.md`
6. die aktuellen Quell- und Testdateien aus §3
7. `git diff -- <Datei>` **vor** der Änderung
8. danach: gezielte Regressionstests aus §8

Zusätzlich bei branch-abgeleiteter Arbeit: `building-docs/BRANCH-RECONCILIATION-MAP.md`
(**A4**, **A5**, **A9**, **A10**, **N1**, **N12**).

---

## 8. Required Tests / Guards

Mindestumfang, den eine Routing-Änderung bestehen muss. Bis die Guards existieren, gilt derselbe Umfang
als **manuelle** Abnahmepflicht (Vorbild: `QUALITY-BASELINE-LIVE.md` §13.3).

| #    | Prüfung                  | Erwartung                                                                                               | AP            |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------- | ------------- |
| T-1  | **Registry-Parität**     | jede `<Route>` hat Known-Path-Eintrag und umgekehrt; Such-Index enthält nur existierende Ziele          | AP10 PT10.3   |
| T-2  | **200 für reale Seiten** | alle Sitemap-Pfade × alle Sprachen                                                                      | AP10 PT10.4.1 |
| T-3  | **301 für Migrationen**  | `/services`, `/services/:slug`, `/agb`, `/s3-leitlinie`, Präfix-Einfügung — Status **explizit** geprüft | AP10 PT10.4.2 |
| T-4  | **Ein-Hop-Nachweis**     | kein Ziel löst eine weitere Umleitung aus                                                               | AP10 PT10.1.4 |
| T-5  | **Echte 404**            | unbekannter statischer Pfad **und** unbekannter dynamischer Slug ⇒ `status === 404`                     | AP10 PT10.4.3 |
| T-6  | **Keine Soft-404**       | keine unbekannte URL antwortet 200; 404-Seiten tragen keinen Canonical                                  | AP10 PT10.4.5 |
| T-7  | **10-Sprachen-Matrix**   | repräsentative Routen × 10                                                                              | AP10 PT10.4.6 |
| T-8  | **Consumer × 10**        | alle drei Produkte in allen zehn Sprachen erreichbar und indexierbar                                    | AP21 PT21.6   |
| T-9  | **Sitemap-Abdeckung**    | jeder Registry-Pfad steht in der Sitemap und umgekehrt                                                  | AP09 PT09.2.8 |
| T-10 | **Epigenetik-Familie**   | Hub + 3 Vertiefungen + 6 Musterbefunde × 10                                                             | AP15 PT15.7   |

**Ausführungshinweis:** Vitest ist in dieser Umgebung nutzbar (`QUALITY-BASELINE-LIVE.md` §9.2 —
die frühere Blockade-Annahme war ein Aufrufparameterfehler). Guards, die einen echten Server brauchen
(T-2 bis T-9), gehören dennoch nach Playwright; reine Struktur-Guards (T-1) laufen als Node-Skript oder
Vitest. Vor jeder Playwright-Nutzung ist **RD-4** zu beachten.

### 8.1 Zielnachweise aus AP02 PT02.2

| #        | Prüfung                      | Erwartung                                                                                                                                                            | AP                        |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| **T-11** | **Konsumenten-Ableitung**    | die Pfad-/Locale-Menge jedes Konsumenten (App-Routen, Known Paths, Sitemap, Search, Navigation, Tests) ist aus der Routing-Wahrheit ableitbar; Drift bricht das Gate | AP10 PT10.3 · AP27 PT27.5 |
| **T-12** | **Sitemap ist nicht Quelle** | Known Paths werden **nicht** aus der Sitemap abgeleitet; eine bekannte, bewusst nicht gelistete Route antwortet 200                                                  | AP10 PT10.3               |
| **T-13** | **Query/Fragment**           | dieselbe Route mit Query oder Fragment erzeugt keinen zweiten Canonical und keinen zweiten Sitemap-Eintrag                                                           | AP09 PT09.1 · AP10        |
| **T-14** | **Technische Pfade**         | `/api/*`, Assets, Locale-Dateien, `robots.txt`, `sitemap.xml` unterliegen keiner Locale-Weiche und keinem Seiten-404-Handshake                                       | AP10 PT10.4               |
| **T-15** | **`/services*`-Brücke**      | `/services` und `/services/:slug` liefern **serverseitig 301** auf `/[lang]/diagnostics*`, ein Hop, kein 200-Zwischenzustand                                         | AP10 PT10.1.2             |
| **T-16** | **Redirect-Ziel-Integrität** | jedes Redirect-Ziel ist eine bekannte kanonische Route; kein Ziel ist selbst Redirect-Quelle                                                                         | AP10 PT10.1.4             |
| **T-17** | **Search-Integrität**        | jeder Suchtreffer zeigt auf eine bekannte Route in der aktiven Locale; **keine toten Ziele**                                                                         | AP07 PT07.1 · AP27        |
| **T-18** | **Navigations-Integrität**   | jedes Header-, Footer- und ChapterNav-Ziel ist eine bekannte Route (Fragment abgetrennt geprüft)                                                                     | AP06 PT06.5 · AP27        |
| **T-19** | **Fehlerklassen-Trennung**   | ein Laufzeitfehler einer bekannten Route liefert 5xx, nie 404 (Gegenstück zu `RUNTIME-CONTRACT.md` RT-T20)                                                           | AP10 PT10.4 · AP27        |
| **T-20** | **Locale-Determinismus**     | `Accept-Language`, Cookie oder gespeicherter Sprachwunsch ändern weder Zielroute noch Status                                                                         | AP08 PT08.4 · AP10 PT10.4 |

### 8.2 Zuordnung der PT02.2-Zielinvarianten

Die Aufgabenstellung von PT02.2 nennt Invarianten als `RTG-xx`. Dieser Vertrag führt **keine parallele
ID-Systematik** ein; die Zuordnung auf die bestehende `R-`/`T-`-Konvention ist:

| RTG        | Inhalt                                                  | hier                                      |
| ---------- | ------------------------------------------------------- | ----------------------------------------- |
| **RTG-01** | jede kanonische Seiten-URL hat eine gültige Locale      | R-01, R-17, R-18 · T-7                    |
| **RTG-02** | unpräfixierte URL liefert Redirect statt parallelem 200 | R-02, R-20 · T-3                          |
| **RTG-03** | jede gerenderte Route ist serverseitig bekannt          | R-24, R-25, R-42 · T-1, T-11              |
| **RTG-04** | jede Sitemap-URL ist bekannte indexierbare Route        | R-48, R-49 · T-9, T-12                    |
| **RTG-05** | jeder Search-Link zeigt auf eine bekannte Route         | R-50 · T-17                               |
| **RTG-06** | jedes Redirect-Target ist bekannte kanonische Route     | R-36 · T-16                               |
| **RTG-07** | unbekannter statischer Pfad liefert 404                 | R-05, R-39 · T-5                          |
| **RTG-08** | unbekannter dynamischer Slug liefert 404                | R-30, R-31, R-39 · T-5                    |
| **RTG-09** | Runtime Error wird nicht als 404 maskiert               | R-41 · T-19                               |
| **RTG-10** | 404 erzeugt keinen Canonical-/hreflang-Surface          | R-46 · T-6                                |
| **RTG-11** | `/services*` wird serverseitig permanent umgeleitet     | R-13, R-38 · T-3, T-15                    |
| **RTG-12** | Consumer besitzt zehn Locale-Varianten                  | R-09, R-52 · T-8                          |
| **RTG-13** | Epigenetik ist routenseitig eigenständige Säule         | R-10, R-53 · T-10                         |
| **RTG-14** | Navigation/Sitemap/Search erfinden keine Pfade          | R-25, R-48, R-50, R-51 · T-11, T-17, T-18 |

---

## 9. Forbidden Regressions

- ❌ `isKnownPath`, `KNOWN_PATHS`, `NOT_FOUND_MARKER` oder `Cache-Control: no-store` entfernen oder umbenennen
- ❌ Den `prerender-status-code`-String auf einer der beiden Seiten ändern, ohne die andere mitzuändern
- ❌ `server.ts` oder `App.tsx` als Datei aus `main` übernehmen (**N1**, **N12**)
- ❌ `GermanOnlyPage` entfernen außerhalb von AP08 PT08.4.3
- ❌ Eine Route nur in `App.tsx` anlegen (rendert, antwortet 404)
- ❌ Einen `:slug`-Catch-all **vor** seine expliziten Pfade stellen
- ❌ Consumer-Routen auf `/en/` zwingen, `noindex` setzen oder mit Basic Auth schützen (`DEC-RL-006`, `REST-03`)
- ❌ Eine clientseitige `<Navigate>` als Ersatz für eine zugesagte 301
- ❌ Redirect-Ketten oder -Schleifen erzeugen
- ❌ `legacyAnchors.ts` ersatzlos löschen
- ❌ Nach AP10 PT10.3 eine parallele Routentabelle anlegen

**Aus AP02 PT02.2 zusätzlich:**

- ❌ **Known Paths aus der Sitemap ableiten** — oder umgekehrt Route-Existenz an einen Sitemap-Eintrag binden
- ❌ **„Nicht in der Sitemap" oder „nicht in der Navigation" als „unbekannte Route" behandeln**
- ❌ Eine unpräfixierte Seiten-URL als zweite kanonische URL, Sitemap-Eintrag oder Canonical-Ziel führen
- ❌ Die Locale aus `Accept-Language`, Cookie oder gespeichertem Wunsch statt aus der URL ableiten
- ❌ Query-String oder Fragment zum Bestandteil der Route-Identität machen
- ❌ Eine Seiten-Locale-Weiche oder den Seiten-404-Handshake auf `/api/*`, Assets oder Locale-Dateien anwenden
- ❌ Einen dynamischen Slug allein deshalb mit 200 beantworten, weil das Pfadmuster passt
- ❌ Die Statusentscheidung davon abhängig machen, ob die Seitenkomponente gerendert hat
- ❌ **Für dieselbe dynamische Route zwei Slug-Quellen führen**
- ❌ Ein Redirect-Ziel setzen, das keine bekannte kanonische Route ist oder selbst Redirect-Quelle ist
- ❌ Einer Redirect-Quelle einen Canonical, ein hreflang, einen Sitemap-Eintrag oder einen Search-Treffer geben
- ❌ Die Route Registry zur Content-Datenbank machen oder Slug-Listen aus ihrer fachlichen Quelle abschreiben
- ❌ Einen sprachlichen Sonderfall als implizite Pfadliste in zwei Dateien statt als deklarierte Locale-Policy führen
- ❌ **Epigenetik routenseitig oder IA-seitig als Untergruppe von `/diagnostics` modellieren** (`DEC-RL-005`)
- ❌ Eine Navigationsentscheidung als Routen-Existenzentscheidung behandeln

---

## 10. AP Ownership / Lifecycle

| Phase                  | AP                                  | Ergebnis                                                                                                                                               |
| ---------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Definition             | **AP02 PT02.2**                     | Routing-Zielbild, Registry als Single Source of Truth — **festgeschrieben 2026-08-24** (§3.1, R-17–R-53, §5.1 RD-8–RD-14, M-06–M-08, §8.1/§8.2, §10.1) |
| Inventar               | **AP03 PT03.1**                     | vollständiges Seiten-/Routeninventar                                                                                                                   |
| **Umsetzung/Eigentum** | **AP10**                            | Registry (PT10.3), Redirects (PT10.1), Alt-URL-Migration (PT10.2), Statusmatrix (PT10.4)                                                               |
| Konsum                 | AP06, AP07, AP09, AP11–AP21         | Navigation, Suche, SEO-Artefakte, Seiten leiten sich ab                                                                                                |
| Absicherung            | **AP27 PT27.5**                     | Route-/Statusregression in CI                                                                                                                          |
| Migration              | **AP29 PT29.2**                     | finale Redirect Map vor Go-live                                                                                                                        |
| Abnahme                | **AP30 PT30.1**, **AP31 PT31.2–.3** | Funktions-QA und Produktions-Smoke                                                                                                                     |
| Wartungsregeln         | **AP33 PT33.3.1**                   | „neue Route" als dauerhafte Prozedur                                                                                                                   |

### 10.1 Owner-Grenzen des Routing-Zielbilds (AP02 PT02.2)

PT02.2 legt **Architektur** fest und implementiert sie **nicht**. Die Umsetzung liegt bei:

| Owner-AP      | Verantwortet                                                                                                                  | Bezug                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **AP03**      | Informationsarchitektur, Seitentypen, Navigationskontext — welche Route wo im IA-Modell steht                                 | R-23, R-51, `RD-11`                    |
| **AP06**      | Header, Footer und globale Navigation als Konsument der Routenwahrheit                                                        | R-51 · T-18                            |
| **AP07**      | Suche und interne Findability als Konsument; Beseitigung toter Suchziele                                                      | R-50 · T-17 · `RD-12`                  |
| **AP08**      | Locale-Auflösung, 10-Sprachen-Parität, Abbau der German-only-Sonderlogik (PT08.4.3)                                           | R-17, R-18, R-45 · `RD-14`             |
| **AP09**      | SEO-Plattform: Canonical, hreflang, Sitemap aus der Registry                                                                  | R-43–R-49 · T-9, T-12, T-13            |
| **AP10**      | **Eigentümer der Umsetzung** — Route Registry (PT10.3), Redirects (PT10.1), Alt-URL-Migration (PT10.2), Statusmatrix (PT10.4) | R-24–R-42 · T-11–T-16, T-19, T-20      |
| **AP15/AP16** | Epigenetik-Säule und Musterbefunde als Nutzer der Routing-Plattform                                                           | R-53 · T-10                            |
| **AP21**      | Consumer × 10, Auflösung des `/en/`-Zwangs                                                                                    | R-52 · T-8 · `RD-6`                    |
| **AP20**      | Indexierbarkeits-Policy der Legal-Seiten (PT20.4.8)                                                                           | R-23 Klasse 8 · `SEO-CONTRACT.md` SD-2 |
| **AP27**      | automatisierte Guards und CI-Verankerung aller Nachweise aus §8/§8.1                                                          | T-11–T-20 · `RD-13`                    |
| **AP29**      | finale Redirect Map vor Go-live                                                                                               | R-34–R-37                              |

**Änderungen an diesem Vertrag** verantwortet AP10; jede Anpassung braucht einen Beleg aus dem
Master-Scope. Decision Locks werden hier nie geändert.
