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

---

## 10. AP Ownership / Lifecycle

| Phase                  | AP                                  | Ergebnis                                                                                 |
| ---------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| Definition             | **AP02 PT02.2**                     | Routing-Zielbild, Registry als Single Source of Truth beschlossen                        |
| Inventar               | **AP03 PT03.1**                     | vollständiges Seiten-/Routeninventar                                                     |
| **Umsetzung/Eigentum** | **AP10**                            | Registry (PT10.3), Redirects (PT10.1), Alt-URL-Migration (PT10.2), Statusmatrix (PT10.4) |
| Konsum                 | AP06, AP07, AP09, AP11–AP21         | Navigation, Suche, SEO-Artefakte, Seiten leiten sich ab                                  |
| Absicherung            | **AP27 PT27.5**                     | Route-/Statusregression in CI                                                            |
| Migration              | **AP29 PT29.2**                     | finale Redirect Map vor Go-live                                                          |
| Abnahme                | **AP30 PT30.1**, **AP31 PT31.2–.3** | Funktions-QA und Produktions-Smoke                                                       |
| Wartungsregeln         | **AP33 PT33.3.1**                   | „neue Route" als dauerhafte Prozedur                                                     |

**Änderungen an diesem Vertrag** verantwortet AP10; jede Anpassung braucht einen Beleg aus dem
Master-Scope. Decision Locks werden hier nie geändert.
