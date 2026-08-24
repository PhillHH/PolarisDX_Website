# I18N-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien oder den Locale-Baum ändert, folgt
zwingend der Kontextpflicht in §7. Blindes Editieren ist untersagt.

---

## 1. Purpose

Dieser Vertrag legt fest, wie Mehrsprachigkeit in der PolarisDX-Relaunch-Site funktioniert: welche
Sprachen gelten, woher die Sprache einer Seite kommt, was Vollständigkeit bedeutet — und wie mehrere
Agenten gleichzeitig am Locale-Baum arbeiten können, ohne einander zu überschreiben.

Er ist **kein Audit**; Messungen stehen in `IMPLEMENTATION-HOTSPOTS.md` §4.3 und
`QUALITY-BASELINE-LIVE.md` §16.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zuständige APs:** **AP08** (Eigentümer), AP02 PT02.3 (Content-/Asset-Architektur), AP04 (Launch-Content),
AP06 PT06.1.7/PT06.4.3 (Sprachumschalter, FallbackNotice), AP07 PT07.1.8 (Such-Index × 10),
AP09 (Canonical/hreflang-Kopplung), AP10 PT10.1/PT10.4.6 (Sprachpräfix-Routing),
AP15/AP16 (Epigenetik/Musterbefunde × 10), AP17/AP18 (Artikel/Events),
AP20 PT20.3–PT20.4 (Systemmails, Legal), **AP21** (Consumer × 10), AP24 (Sprachauszeichnung/WCAG 3.1.2),
AP27 PT27.6.5 (CI-Guard), AP30 PT30.1.3 (QA Sprachwechsel), AP33 PT33.3.2 (Wartungsregel).

**Relevante Decision Locks:** **`DEC-RL-001`** (alle 10 Sprachen, **kein dauerhafter EN-Fallback**),
**`REST-03`** (**alle Consumer-Landingpages in allen 10 Sprachen**). **Baseline:**
`feat/home-leadmagnet@961f65d`. Keine Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files

| Datei / Baum                                   | Rolle                                                                                                                                                                                             | Guard  |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `src/i18n.ts`                                  | `SUPPORTED_LANGUAGES` (10), `NAMESPACES` (14), `DEFAULT_LANGUAGE`, `FALLBACK_LANGUAGE`, `DEFAULT_NS`, `FALLBACK_NS`, gemeinsame Konfiguration. **Darf weder Browser- noch Node-APIs importieren** | **G3** |
| `src/i18n.server.ts`                           | SSR-Loader mit Cache; liest in Produktion aus `dist/client/locales`, sonst aus `public/locales`                                                                                                   | G2     |
| `src/i18n.client.ts`                           | HTTP-Backend, `loadPath: '/locales/{{lng}}/{{ns}}.json'`                                                                                                                                          | G2     |
| `public/locales/**`                            | **10 Sprachen × 15 Dateien = 150**                                                                                                                                                                | **G3** |
| `server.ts`                                    | eigene `SUPPORTED_LANGUAGES`-Liste (**Handspiegel**), Sprachpräfix-301s, `GERMAN_ONLY_PATHS`, Consumer-Redirect                                                                                   | **G3** |
| `src/lib/translationStatus.ts`                 | erkennt den `_translationStatus`-Marker → `lang="en"`-Auszeichnung                                                                                                                                | G1     |
| `src/components/ui/LanguageSwitcher.tsx`       | Sprachumschalter (Desktop/Mobil)                                                                                                                                                                  | G1     |
| `src/components/ui/LanguageFallbackNotice.tsx` | defensiver Hinweis — **kein** Ersatz für Übersetzung                                                                                                                                              | G1     |
| `src/components/seo/SEOHead.tsx`               | `LOCALE_MAP`, hreflang, `x-default`, `og:locale:alternate`                                                                                                                                        | **G3** |
| `public/downloads/**`                          | sprachabhängige Assets (PDFs)                                                                                                                                                                     | G2     |
| `server/server.js`                             | Systemmail-Texte — heute hartkodiert deutsch                                                                                                                                                      | **G3** |
| `scripts/check-i18n-home.mjs`                  | vorhandener Prüfer, **nirgends verdrahtet**                                                                                                                                                       | G1     |

---

## 4. Target Invariants

**I-01 · Genau zehn Sprachen, exakt diese:**

```
de  en  pl  fr  it  es  pt  da  nl  cs
```

Identisch in `src/i18n.ts:38-49` **und** `server.ts:57`. Erweiterung oder Reduktion ist eine
Produktentscheidung, keine Implementierungsentscheidung. _(`DEC-RL-001`)_

**I-02 · Default- und `x-default`-Sprache ist `de`.** _(`src/i18n.ts:56`, `SEOHead.tsx` x-default)_

**I-03 · `en` ist ausschließlich defensives Ausfallverhalten.** Ein englischer Fallback ist ein
**Fehlerzustand**, kein Zielzustand, und niemals ein Ersatz für Vollständigkeit. `FALLBACK_LANGUAGE = 'en'`
darf nie als „Sprache X ist fertig" interpretiert werden. _(`DEC-RL-001`, AP08 PT08.1.6)_

**I-04 · Die URL ist die einzige Sprachquelle.** Kein Browser-Language-Detector entscheidet über
Routing. Das Sprachpräfix bestimmt Inhalt, `lang`-Attribut, Canonical und hreflang.
_(Master-Scope §1.1, AP02 PT02.2.1)_

**I-05 · Jede Namespace-Datei ist registriert.** Eine Datei unter `public/locales/<lang>/` ohne Eintrag
in `NAMESPACES` (`src/i18n.ts:66`) wird **nie geladen** und fällt still aus. Registrierung und Datei
gehören in denselben Commit. _(AP08 PT08.1.4)_

**I-06 · Key-Parität über alle zehn Sprachen.** Das Keyset jeder Sprache entspricht dem von `de`.
Ein fehlender Key rendert den Key-String — ein sichtbarer Produktionsfehler, kein „graceful degradation".
_(AP08 PT08.3, Gate 1)_

**I-07 · Kein hartkodierter nutzersichtbarer Text** in Komponenten, Seiten oder Systemmails. Auch
Zahlen-, Datums- und Währungsformate folgen der Locale (`Intl.*`), nicht einer festen Sprache.
_(AP08 PT08.2.8)_

**I-08 · Das `lang`-Attribut stimmt mit dem tatsächlichen Text überein.** Läuft ein Namespace auf
Englisch, wird der Bereich als `lang="en"` ausgezeichnet — sonst liest ein Screenreader englischen Text
mit fremder Phonetik (WCAG 3.1.2 AA). Der bestehende `_translationStatus`-Mechanismus ist zu erhalten.
_(AP24 PT24.1, AP08 PT08.1.5)_

**I-09 · Der Sprachwechsel hält die logische Seite.** `/de/diagnostics` → `/en/diagnostics`, nicht zur
Startseite. _(AP08 PT08.4.1)_

**I-10 · Consumer-Landingpages in allen zehn Sprachen.** Alle drei Produktseiten vollständig
lokalisiert, **ohne EN-Zwangsredirect**, indexierbar je Locale. _(`REST-03`, AP21, AP08 PT08.4.2)_

**I-11 · Epigenetik vollständig × 10** — Hub, drei Vertiefungsseiten, sechs Musterbefunde inklusive
Befundinhalten und Pflichthinweisen. _(AP08 PT08.3.1–.2, AP15 PT15.7.1, AP16)_

**I-12 · Formulare, Systemmails und Zustellungstexte × 10.** Labels, Fehler, Success-Zustände,
Support-Autoresponder, ROI-/Lead-Magnet-Zustellung, Epigenetik-Inquiry, Consumer-Order.
_(AP08 PT08.5)_

**I-13 · Sprachabhängige Assets sind vollständig oder sprachneutral gelöst.** hreflang darf nicht auf
ein Ziel verweisen, dessen Inhalt in dieser Sprache nicht existiert. _(AP08 PT08.6, SEO-Vertrag S-03)_

**I-14 · `FallbackNotice` ist ein Netz, kein Feature.** Sie erscheint nur im echten Fehlerfall; ein
dauerhafter produktiver Einsatz verletzt Gate 1. _(AP06 PT06.4.3, AP08 PT08.1.6)_

**I-15 · Sprachpräfix-Sonderfälle sind ausgewiesen und synchron.** German-only-Seiten
(`/s3_leitlinie`, `/vitamin-d3-implantologie`) sind heute in `server.ts:141` und `SEOHead.tsx:103`
gespiegelt; ihr Abbau nach vollständiger Lokalisierung ist **AP08 PT08.4.3 vorbehalten**.

---

## 5. Current Known Debt

| ID        | Schuld                                                                                                                                                                                                                                                                                                                                             | Beleg                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **ID-1**  | **Consumer-Seiten vollständig hartkodiert** — `src/pages/consumer/**`, 2 884 Zeilen, **0 × `useTranslation`** in `SprayPage.tsx`, `shell.tsx`, `OrderForm.tsx`. Größte Einzelaufgabe gegen `REST-03`                                                                                                                                               | gemessen                            |
| **ID-2**  | **`S3LeitliniePage.tsx` (1 010 Z.) und `VitaminD3ImplantologyPage.tsx` (611 Z.) hartkodiert deutsch** — 0 × `useTranslation`; heute über `GERMAN_ONLY_PATHS` abgesichert                                                                                                                                                                           | gemessen                            |
| **ID-3**  | **Befundinhalte nur `de` und `en`** — `src/content/befunde/*.{de,en}.json`; acht Sprachen fehlen vollständig                                                                                                                                                                                                                                       | gemessen                            |
| **ID-4**  | **Key-Paritätslücke** — `de`/`en` je 2 305 Leaf-Keys, `cs`/`pl` je 2 295 (10 Keys Rückstand); weitere Sprachen sind zu prüfen                                                                                                                                                                                                                      | gemessen                            |
| **ID-5**  | **`casestudies.json` existiert in allen 10 Sprachen, ist aber nicht in `NAMESPACES` registriert** und wird nie geladen. **Backlog-bezogen** (`DEC-RL-015`) — dieser Vertrag entscheidet **nicht** über eine Reaktivierung, sondern verlangt nur, dass der Paritäts-Guard den Fall bewusst behandelt (registrieren **oder** dokumentiert ausnehmen) | gemessen                            |
| **ID-6**  | **Nur ein Home-Prüfer, und der ist nicht verdrahtet.** `scripts/check-i18n-home.mjs` deckt einen Namespace ab und läuft weder als npm-Script noch in CI. Für 2 305 Keys × 10 Sprachen ist das unzureichend                                                                                                                                         | `QUALITY-BASELINE-LIVE.md` §17      |
| **ID-7**  | **Systemmails hartkodiert deutsch** — Support-Bestätigung und ROI-Report inklusive `Intl.NumberFormat('de-DE')` im PDF                                                                                                                                                                                                                             | `BACKEND-LEAD-CURRENT-STATE.md` §10 |
| **ID-8**  | **Asset-Asymmetrie** — 17 deutsche gegen 9 englische Epigenetik-PDFs                                                                                                                                                                                                                                                                               | gemessen                            |
| **ID-9**  | **Sprachliste als Handspiegel** über `src/i18n.ts` und `server.ts`                                                                                                                                                                                                                                                                                 | `IMPLEMENTATION-HOTSPOTS.md` §6     |
| **ID-10** | **Consumer-Zwangsredirect auf `/en/`** in `server.ts` (zwei 301-Zweige) — verletzt I-10                                                                                                                                                                                                                                                            | AP21 PT21.1.8                       |

**Ausdrücklich nicht entschieden:** Ob Case Studies oder Shop reaktiviert werden. Beide bleiben nach
`DEC-RL-015` vertagt; ID-5 ist ein reines Registrierungs-/Guard-Thema.

---

## 6. Modification Rules

**M-01 — Namespace-Partitionierung ist Pflicht bei paralleler Arbeit.**
Mehrere Agenten dürfen `public/locales/**` gleichzeitig bearbeiten **nur**, wenn die Zuständigkeit
**nach Namespace / Inhaltsdomäne** aufgeteilt ist — **niemals nach Sprache**. Sprachweise Aufteilung
führt dazu, dass zwei Agenten dieselbe Datei anfassen; namespaceweise Aufteilung nicht.

| Namespace                              | Eigentümer-AP                                 |
| -------------------------------------- | --------------------------------------------- |
| `home`                                 | AP11                                          |
| `services`                             | AP12, AP13                                    |
| `products`, `vitd3spray`               | AP14                                          |
| `epigenetics`                          | AP15, AP16 (interne PT-Abstimmung nötig)      |
| `articles`                             | AP17                                          |
| `events`                               | AP18                                          |
| `downloads`                            | AP19                                          |
| `about`, `contact`, `support`, `legal` | AP20                                          |
| Consumer-Namespace (neu)               | AP21                                          |
| `common`                               | **AP08** (querschnittlich — Einzeleigentümer) |
| `shop`, `casestudies`                  | **niemand** — Backlog, nicht anfassen         |

**Merge-Verantwortung ist explizit zu benennen.** Wer einen Namespace besitzt, führt auch dessen Merge.
`src/i18n.ts` `NAMESPACES` ist **Einzeleigentum von AP08** — kein anderes AP ändert diese Liste.

**M-02 — Neue Sprachschlüssel entstehen zuerst in `de`.** `de` ist die Quellsprache; die übrigen neun
folgen im selben Arbeitspaket oder werden als offene Paritätslücke im AP-State vermerkt.

**M-03 — Lokalisierbar machen und übersetzen sind zwei Schritte.** Bei hartkodierten Flächen (ID-1,
ID-2) zuerst `t()`-fähig machen (AP08 PT08.2), dann die zehn Sprachen füllen. Umgekehrt geht es nicht.

**M-04 — Sprachlisten immer in beiden Dateien im selben Commit** (`src/i18n.ts`, `server.ts`, I-01/ID-9).

**M-05 — `src/i18n.ts` bleibt frei von Browser- und Node-APIs.** Sie wird von Client **und** Server
importiert; ein `window`- oder `fs`-Zugriff bricht eine der beiden Seiten.

**M-06 — Locale-Änderungen sind erst nach `npm run build` sichtbar**, weil der SSR-Loader in Produktion
aus `dist/client/locales` liest (`src/i18n.server.ts`). Bei Verifikation berücksichtigen.

**M-07 — `main` ist keine Quelle für Locale-Dateien.** Die dortigen Namespaces sind gegenüber der
Baseline divergiert; selektive Übernahmen folgen `BRANCH-RECONCILIATION-MAP.md`, nicht dem Dateistand.

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `src/i18n.ts`, `i18n.server.ts`, `i18n.client.ts`,
`public/locales/**`, der Sprachliste in `server.ts` oder an Systemmail-Texten:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP08**; bei Routen zusätzlich AP10, bei SEO AP09)
4. **diesen Vertrag** — insbesondere §6 M-01 (Namespace-Eigentum)
5. `building-docs/state/AP-STATE.md` — welcher Namespace gerade wem gehört
6. die aktuellen Quell-/Locale-Dateien und der jeweils aktuelle Paritätsstand
7. `git diff -- <Datei>` **vor** der Änderung
8. danach: gezielte Regressionstests aus §8

---

## 8. Required Tests / Guards

| #    | Prüfung                                   | Erwartung                                                                                                                                 | AP               |
| ---- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| T-1  | **Namespace-Registrierung**               | jede Datei unter `public/locales/<lang>/` hat einen `NAMESPACES`-Eintrag **oder** eine dokumentierte Ausnahme (fängt heute `casestudies`) | AP08 PT08.1.4    |
| T-2  | **Key-Parität**                           | jede der zehn Sprachen trägt das `de`-Keyset (fängt heute die 10-Key-Lücke in `cs`/`pl`)                                                  | AP08 PT08.3.4–.5 |
| T-3  | **Sprachlisten-Spiegel**                  | `src/i18n.ts` und `server.ts` führen dieselben zehn Codes                                                                                 | AP08 PT08.1.1    |
| T-4  | **Kein hartkodierter UI-Text**            | statische Prüfung auf nutzersichtbare Literale in `src/pages/**`, `src/components/**`                                                     | AP08 PT08.2      |
| T-5  | **Sprachrouting × 10**                    | jede repräsentative Route in allen zehn Sprachen 200                                                                                      | AP10 PT10.4.6    |
| T-6  | **Sprachwechsel hält die Seite**          | Wechsel führt auf dieselbe logische Route                                                                                                 | AP08 PT08.4.1    |
| T-7  | **`lang`-Attribut korrekt**               | `<html lang>` entspricht dem Präfix; Fallback-Bereiche sind `lang="en"` ausgezeichnet                                                     | AP24 PT24.1      |
| T-8  | **Consumer × 10**                         | drei Produktseiten in allen zehn Sprachen, kein EN-Zwangsredirect                                                                         | AP21, `REST-03`  |
| T-9  | **Epigenetik × 10**                       | Hub + 3 + 6 inklusive Befundinhalten                                                                                                      | AP15 PT15.7.1    |
| T-10 | **Systemmails × 10**                      | Autoresponder und Zustelltexte in der Sprache des Absenders                                                                               | AP08 PT08.5      |
| T-11 | **Asset-Parität**                         | kein hreflang-Ziel ohne Inhalt; sprachabhängige Downloads vorhanden oder sprachneutral gelöst                                             | AP08 PT08.6.4    |
| T-12 | **Keine produktive Dauer-FallbackNotice** | Fallback nur im Fehlerfall                                                                                                                | Gate 1           |

T-1 bis T-4 und T-11 sind reine Struktur-Guards und laufen als Node-Skript oder Vitest — **Vitest ist
verfügbar** (`QUALITY-BASELINE-LIVE.md` §9.2). T-5 bis T-10 brauchen einen laufenden Server.
Der vorhandene `scripts/check-i18n-home.mjs` ist Ausgangspunkt für T-1/T-2, deckt aber nur `home` ab
(ID-6) und muss in CI verdrahtet werden (AP27 PT27.6.5).

---

## 9. Forbidden Regressions

- ❌ Die Sprachmenge reduzieren oder erweitern (`DEC-RL-001` — ausdrücklich „nicht wieder öffnen")
- ❌ Consumer auf EN beschränken oder auf `/en/` zwingen (`REST-03`, `DEC-RL-006`)
- ❌ **Einen englischen Fallback als erledigten Zielzustand behandeln**
- ❌ Eine Locale-Datei anlegen, ohne sie in `NAMESPACES` zu registrieren
- ❌ `NAMESPACES` außerhalb von AP08 ändern
- ❌ Die Sprachliste nur in einer der beiden Dateien ändern
- ❌ Browser- oder Node-APIs in `src/i18n.ts` importieren
- ❌ Nutzersichtbaren Text hartkodieren — auch nicht „nur vorläufig"
- ❌ `de-DE`-feste Zahlen-/Datumsformate für andere Sprachen verwenden
- ❌ Den `_translationStatus`-Mechanismus oder `LanguageFallbackNotice` ersatzlos entfernen (**N13**)
- ❌ hreflang auf eine Sprache setzen, deren Inhalt oder Asset fehlt
- ❌ **Case Studies oder Shop reaktivieren** — beide sind nach `DEC-RL-015` vertagt; `casestudies` ist ausschließlich ein Registrierungs-/Guard-Thema
- ❌ `public/locales/**` parallel ohne Namespace-Partitionierung bearbeiten (§6 M-01)

---

## 10. AP Ownership / Lifecycle

| Phase                  | AP                                   | Ergebnis                                                                                                                                                           |
| ---------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Architektur            | **AP02 PT02.3**                      | Grenzen Code ↔ i18n ↔ Content-JSON ↔ Assets                                                                                                                        |
| Content-Basis          | **AP04 PT04.3.4**                    | alle relevanten Inhalte in zehn Sprachen bereitgestellt                                                                                                            |
| **Fundament/Eigentum** | **AP08**                             | i18n-Core (PT08.1), Hartkodiertes lokalisierbar machen (PT08.2), Parität + CI-Guard (PT08.3), Routen/Sprachwechsel (PT08.4), Systemtexte (PT08.5), Assets (PT08.6) |
| Konsum                 | AP06, AP07, AP11–AP21                | Shell, Suche, Seiten füllen ihre Namespaces                                                                                                                        |
| Kopplung               | AP09, AP10                           | Canonical/hreflang und Sprachpräfix-Routing leiten sich ab                                                                                                         |
| Barrierefreiheit       | **AP24 PT24.1**                      | `lang`-Auszeichnung, Fallback-Kennzeichnung                                                                                                                        |
| Absicherung            | **AP27 PT27.6.5**                    | i18n-Guard in CI — Voraussetzung für Gate 1                                                                                                                        |
| Abnahme                | **AP30 PT30.1.3**, **AP31 PT31.2.1** | Sprachwechsel-QA, 10-Sprachen-Route-Matrix live                                                                                                                    |
| Wartungsregeln         | **AP33 PT33.3.2**                    | „neuer Sprach-Key" als dauerhafte Prozedur                                                                                                                         |

**Änderungen an diesem Vertrag** verantwortet AP08. `NAMESPACES` und die Sprachliste sind
Einzeleigentum von AP08. Decision Locks werden hier nie geändert.
