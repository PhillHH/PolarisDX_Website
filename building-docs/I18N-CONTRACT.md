# I18N-CONTRACT

**Guard-Level: G4.** Wer eine der in §3 genannten Kerndateien oder den Locale-Baum ändert, folgt
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

| Datei / Baum                                   | Rolle                                                                                                                                                                                                                                                                | Guard  |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `src/i18n.ts`                                  | Kanonische gemeinsame Konfiguration: `SUPPORTED_LANGUAGES` (10), `PRODUCTIVE_NAMESPACES`/`NAMESPACES` (15), explizite Legacy-/Backlog-/Deferred-Owner-Klassifikation, Default/Fallback, Normalisierung, Interpolation und React-Regeln. **Keine Browser-/Node-APIs** | **G4** |
| `src/i18n.server.ts`                           | SSR-Loader mit Cache; lädt Request-Locale und defensives EN getrennt vor dem Rendern und weist technische Fallback-/Missing-Namespaces aus; Produktion aus `dist/client/locales`, sonst `public/locales`                                                             | G2     |
| `src/i18n.client.ts`                           | HTTP-Backend, `loadPath: '/locales/{{lng}}/{{ns}}.json'`                                                                                                                                                                                                             | G2     |
| `public/locales/**`                            | **10 Sprachen × 17 Dateien = 170**; davon 15 produktive Namespaces sowie `casestudies` und `shop` als Backlog                                                                                                                                                        | **G4** |
| `public/locales/**/{consumer,specialty}.json`  | PT08.2-Copy: Consumer Shell/Produkte/Order/Price sowie S3-/Implantologie-Seiten; identische Keysets × 10, keine regulären Fallbacks                                                                                                                                  | **G3** |
| `src/lib/localeFormat.ts`                      | Kleine URL-/i18n-gebundene `Intl`-Abbildung für Zahl, Datum und EUR-Preis; keine zweite Sprachwahrheit                                                                                                                                                               | G1     |
| `server.ts`                                    | importiert die gemeinsame Sprachliste und URL-Präfix-Erkennung; direkte Locale-Routen bleiben in der angeforderten Sprache, historische Consumer-EN- und Spezialseiten-DE-Zwangsredirects sind entfernt                                                              | **G3** |
| `src/lib/translationStatus.ts`                 | erkennt ausschließlich den kanonischen `_translationStatus`-Fallbackmarker → begrenzte `lang="en"`-Auszeichnung                                                                                                                                                      | G1     |
| `src/components/ui/LanguageSwitcher.tsx`       | leitet seine zehn Optionen aus `SUPPORTED_LANGUAGES` ab; URL-Navigation erhält dieselbe logische Route sowie Query und Hash                                                                                                                                          | G1     |
| `src/components/ui/LanguageFallbackNotice.tsx` | defensiver Hinweis — **kein** Ersatz für Übersetzung                                                                                                                                                                                                                 | G1     |
| `src/components/seo/SEOHead.tsx`               | `LOCALE_MAP`, hreflang, `x-default`, `og:locale:alternate`                                                                                                                                                                                                           | **G3** |
| `public/downloads/**`                          | sprachabhängige Assets (PDFs)                                                                                                                                                                                                                                        | G2     |
| `server/system-i18n.js`                        | Kanonische x10-Copy für heute existierende nutzergerichtete Support- und ROI-Mail-/PDF-Ausgaben; Locale-Validierung gegen den gemeinsamen x10-Vertrag, defensiver Fallback `en`                                                                                      | **G3** |
| `server/server.js`                             | Bestehende Contact-, Support-, Consumer-Order- und ROI-Endpunkte; validierte Journey-Locale, strukturierte Fehlercodes sowie locale-aware Support-Autoresponder und ROI-Mail/PDF. Interne Team-Benachrichtigungen dürfen gemäß LDV-19 mono-sprachig bleiben.         | **G3** |
| `scripts/check-i18n.ts`                        | kanonischer G4-Prüfer für Namespace-/Key-/Befund-Parität, harte Fehler, EN-Duplikat-Heuristik und generierte Contract-Evidenz; über `npm run check:i18n` in CI                                                                                                       | **G4** |

---

## 4. Target Invariants

**I-01 · Genau zehn Sprachen, exakt diese:**

```
de  en  pl  fr  it  es  pt  da  nl  cs
```

Kanonisch in `src/i18n.ts`; `server.ts`, Client und LanguageSwitcher importieren diese Liste.
Erweiterung oder Reduktion ist eine Produktentscheidung, keine Implementierungsentscheidung.
_(`DEC-RL-001`)_

**I-02 · Default- und `x-default`-Sprache ist `de`.** _(`src/i18n.ts:56`, `SEOHead.tsx` x-default)_

**I-03 · `en` ist ausschließlich defensives Ausfallverhalten.** Ein englischer Fallback ist ein
**Fehlerzustand**, kein Zielzustand, und niemals ein Ersatz für Vollständigkeit. `FALLBACK_LANGUAGE = 'en'`
darf nie als „Sprache X ist fertig" interpretiert werden. _(`DEC-RL-001`, AP08 PT08.1.6)_

**I-04 · Die URL ist die einzige Sprachquelle.** Kein Browser-Language-Detector entscheidet über
Routing. Das Sprachpräfix bestimmt Inhalt, `lang`-Attribut, Canonical und hreflang.
_(Master-Scope §1.1, AP02 PT02.2.1)_

**I-05 · Jede Namespace-Datei ist klassifiziert.** Produktive Dateien stehen in `NAMESPACES`;
Legacy-, Backlog- und Deferred-Owner-Dateien sind explizit getrennt und werden nicht produktiv
geladen. Eine unklassifizierte Datei ist ein G4-Fehler. _(AP08 PT08.1.4/PT08.3)_

**I-06 · Key-Parität über alle zehn Sprachen.** Jeder produktive Namespace besitzt eine bewusst
gewählte Schemaquelle; `de` ist ausdrücklich nicht blind die Universalreferenz. Locale-spezifische
Pluralformen werden auf ihre semantische Basis normalisiert. Ein fehlender Pflicht-Key bleibt ein
harter Produktionsfehler. _(AP08 PT08.3, Gate 1)_

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

**I-12 · Heute existierende Formulare, nutzergerichtete Systemmails und Zustellungstexte × 10.**
Labels, Fehler und Success-Zustände sowie der bestehende Support-Autoresponder und die bestehende
ROI-Mail-/PDF-Zustellung folgen der Journey-Locale. Nicht existente Epigenetik-Inquiry-,
Lead-Magnet- oder persistente Order-Mail-Flows bleiben ownergebundene Verträge und dürfen nicht als
Runtime ausgegeben werden. Interne Team-Benachrichtigungen sind nach LDV-19 davon ausgenommen.
_(AP08 PT08.5)_

**I-13 · Sprachabhängige Assets sind vollständig oder sprachneutral gelöst.** hreflang darf nicht auf
ein Ziel verweisen, dessen Inhalt in dieser Sprache nicht existiert. _(AP08 PT08.6, SEO-Vertrag S-03)_

**I-14 · `FallbackNotice` ist ein Netz, kein Feature.** Sie erscheint nur im echten Fehlerfall; ein
dauerhafter produktiver Einsatz verletzt Gate 1. _(AP06 PT06.4.3, AP08 PT08.1.6)_

**I-15 · Sprachpräfix-Sonderfälle sind ausgewiesen und synchron.** Die früheren German-only-Seiten
(`/s3_leitlinie`, `/vitamin-d3-implantologie`) und Consumer-EN-Zwangsredirects sind nach verifizierter
x10-Lokalisierung in PT08.4 entfernt. Direkte Locale-Routen, SSR, Sprachwechsel, bestehende
Canonical-/hreflang-Ausgabe und `x-default=de` folgen derselben Routing-Wahrheit. Die historische
Sitemap-Ausgabe und die finale SEO-/Redirect-Plattform bleiben ausdrücklich AP09-/AP10-owned.

---

## 5. Current Known Debt

| ID        | Schuld                                                                                                                                                                                                                                                                           | Beleg                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **ID-1**  | ~~Consumer-Seiten vollständig hartkodiert und auf EN umgeleitet~~ — **RESOLVED PT08.2/PT08.4:** Spray, Masks, Duo, Shell, Order Form/Modal und Price UI verwenden `consumer` × 10; direkte Locale-Routen erzwingen kein EN mehr.                                                 | PT08.2/PT08.4, 2026-08-26  |
| **ID-2**  | ~~S3-Leitlinie und Vitamin-D3-Implantologie hartkodiert deutsch und DE-only geroutet~~ — **RESOLVED PT08.2/PT08.4:** beide Seiten verwenden `specialty` × 10 und behalten die angeforderte unterstützte Locale.                                                                  | PT08.2/PT08.4, 2026-08-26  |
| **ID-3**  | ~~Befundinhalte nur `de` und `en`~~ — **RESOLVED PT08.3:** sechs slugweise lazy geladene Befunde × 10 Sprachfassungen; kein globaler Eager-Load                                                                                                                                  | G4 + Build-Evidenz         |
| **ID-4**  | ~~Produktive Key-Paritätslücken~~ — **RESOLVED PT08.3:** G4 prüft alle produktiven Namespaces × 10 einschließlich Struktur, Pflichtwerten und Interpolation                                                                                                                      | `npm run check:i18n`       |
| **ID-5**  | `casestudies.json` und `shop.json` existieren × 10 und bleiben als `BACKLOG_NAMESPACES` unregistriert. Die frühere Artikel-UI aus `shop` liegt jetzt in `articles.ui`; weder Case Studies noch Shop wurden reaktiviert.                                                          | klassifiziert PT08.3       |
| **ID-6**  | ~~Nur ein unverdrahteter Home-Prüfer~~ — **RESOLVED PT08.3:** genau ein kanonischer G4-Guard läuft als Repository-Befehl und in der Relaunch-CI; `--self-test` belegt den harten Missing-Key-Fehler.                                                                             | `.github/workflows/ci.yml` |
| **ID-7**  | ~~Nutzergerichtete Systemmails hartkodiert deutsch~~ — **RESOLVED PT08.5:** Support-Bestätigung sowie ROI-Mail und Runtime-PDF sind x10, erhalten die validierte Journey-Locale und formatieren Währung locale-aware. Interne Team-Mails bleiben zulässig mono-sprachig.         | PT08.5 Tests + LDV-19      |
| **ID-8**  | **Asset-Asymmetrie, sicher offengelegt** — 17 deutsche gegen 9 englische Epigenetik-PDFs; PT08.6 wählt vorhandene Varianten deterministisch, kennzeichnet jede Fremdsprache sichtbar und erzeugt keine Fake-Datei. Die Herstellung fehlender Fachvarianten bleibt ownergebunden. | `npm run check:assets`     |
| **ID-9**  | ~~Sprachliste als Handspiegel über `src/i18n.ts` und `server.ts`~~ — **RESOLVED PT08.1:** Server, Client und Switcher importieren die gemeinsame Liste.                                                                                                                          | PT08.1, 2026-08-26         |
| **ID-10** | ~~Consumer-Zwangsredirect auf `/en/` in `server.ts`~~ — **RESOLVED PT08.4:** beide 301-Zweige entfernt; Consumer Spray, Masks und Duo sind je zehn unterstützten Locale-Routen direkt erreichbar.                                                                                | PT08.4, 2026-08-26         |

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
| `consumer`                             | AP08 PT08.2; spätere Produktpflege AP21       |
| `specialty`                            | AP08 PT08.2; spätere Seitenpflege AP20        |
| `common`                               | **AP08** (querschnittlich — Einzeleigentümer) |
| `shop`, `casestudies`                  | **niemand** — Backlog, nicht produktiv laden  |

**Merge-Verantwortung ist explizit zu benennen.** Wer einen Namespace besitzt, führt auch dessen Merge.
`src/i18n.ts` `NAMESPACES` ist **Einzeleigentum von AP08** — kein anderes AP ändert diese Liste.

**M-02 — Schemaquelle wird je Namespace bewusst gewählt.** Strukturreferenz und fachliche
Ausgangssprache sind getrennt. Neue produktive Keys werden im selben Arbeitspaket in allen zehn
Sprachen geliefert; Englisch-Fallback ersetzt keine Parität.

**M-03 — Lokalisierbar machen und übersetzen sind zwei Schritte.** Bei hartkodierten Flächen (ID-1,
ID-2) zuerst `t()`-fähig machen (AP08 PT08.2), dann die zehn Sprachen füllen. Umgekehrt geht es nicht.

**M-04 — Sprachliste nur in der gemeinsamen Konfiguration ändern.** `server.ts`, Client und
LanguageSwitcher importieren `SUPPORTED_LANGUAGES`; ein neuer Handspiegel ist verboten (I-01/ID-9).

**M-05 — `src/i18n.ts` bleibt frei von Browser- und Node-APIs.** Sie wird von Client **und** Server
importiert; ein `window`- oder `fs`-Zugriff bricht eine der beiden Seiten.

**M-06 — Locale-Änderungen sind erst nach `npm run build` sichtbar**, weil der SSR-Loader in Produktion
aus `dist/client/locales` liest (`src/i18n.server.ts`). Bei Verifikation berücksichtigen.

**M-07 — `main` ist keine Quelle für Locale-Dateien.** Die dortigen Namespaces sind gegenüber der
Baseline divergiert; selektive Übernahmen folgen `BRANCH-RECONCILIATION-MAP.md`, nicht dem Dateistand.

**M-08 — PT08.2-Formatierung verwendet die aktive i18n-Locale.** Consumer-Zahlen und EUR-Preise laufen
über `src/lib/localeFormat.ts`; feste `de-DE`-/`en-US`-Presentation-Locales und manuell montierte
Währungsstrings sind in den migrierten Flächen ausgeschlossen. Backend-Payload-Werte bleiben stabile,
nicht sichtbare technische Werte.

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

| #    | Prüfung                                   | Erwartung                                                                                                              | AP               |
| ---- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------- |
| T-1  | **Namespace-Klassifikation**              | jede Locale-Datei ist produktiv, Legacy, Backlog oder Deferred Owner; nur produktive Dateien werden registriert        | AP08 PT08.1/.3   |
| T-2  | **Key-Parität**                           | jede der zehn Sprachen trägt das bewusst gewählte, pluralnormalisierte Namespace-Schema; Missing/Extra/Empty sind hart | AP08 PT08.3.4–.5 |
| T-3  | **Gemeinsamer Sprachsatz**                | Server, Client und LanguageSwitcher importieren dieselben zehn Codes aus `src/i18n.ts`                                 | AP08 PT08.1.1    |
| T-4  | **Kein hartkodierter UI-Text**            | statische Prüfung auf nutzersichtbare Literale in `src/pages/**`, `src/components/**`                                  | AP08 PT08.2      |
| T-5  | **Sprachrouting × 10**                    | jede repräsentative Route in allen zehn Sprachen 200                                                                   | AP10 PT10.4.6    |
| T-6  | **Sprachwechsel hält die Seite**          | Wechsel führt auf dieselbe logische Route                                                                              | AP08 PT08.4.1    |
| T-7  | **`lang`-Attribut korrekt**               | `<html lang>` entspricht dem Präfix; Fallback-Bereiche sind `lang="en"` ausgezeichnet                                  | AP24 PT24.1      |
| T-8  | **Consumer × 10**                         | drei Produktseiten in allen zehn Sprachen, kein EN-Zwangsredirect                                                      | AP21, `REST-03`  |
| T-9  | **Epigenetik × 10**                       | Hub + 3 + 6 inklusive Befundinhalten                                                                                   | AP15 PT15.7.1    |
| T-10 | **Systemmails × 10**                      | Autoresponder und Zustelltexte in der Sprache des Absenders                                                            | AP08 PT08.5      |
| T-11 | **Asset-Parität**                         | kein hreflang-Ziel ohne Inhalt; sprachabhängige Downloads vorhanden oder sprachneutral gelöst                          | AP08 PT08.6.4    |
| T-12 | **Keine produktive Dauer-FallbackNotice** | Fallback nur im Fehlerfall                                                                                             | Gate 1           |

T-1 bis T-4 werden durch den kanonischen G4-Guard und gezielte Vitest-Prüfungen abgedeckt. Der stabile
Einstieg ist `npm run check:i18n`; `--self-test` belegt die harte Missing-Key-Fehlersemantik,
`check:i18n:contract` erzeugt die Evidenz in diesem Dokument. G4 läuft in der Relaunch-CI. T-5 bis
T-10 brauchen einen laufenden Server. T-11 wird durch `npm run check:assets` reproduzierbar geprüft;
fehlende echte Fachvarianten bleiben dabei bewusst ownergebunden und werden nicht durch stillen Fallback
oder Dateiduplikate simuliert.

---

## 9. Forbidden Regressions

- ❌ Die Sprachmenge reduzieren oder erweitern (`DEC-RL-001` — ausdrücklich „nicht wieder öffnen")
- ❌ Consumer auf EN beschränken oder auf `/en/` zwingen (`REST-03`, `DEC-RL-006`)
- ❌ **Einen englischen Fallback als erledigten Zielzustand behandeln**
- ❌ Eine Locale-Datei anlegen, ohne sie in `NAMESPACES` zu registrieren
- ❌ `NAMESPACES` außerhalb von AP08 ändern
- ❌ Eine zweite Sprachliste in Server, Client oder LanguageSwitcher einführen
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

---

## 11. PT08.5 System-/Mail-Flow-Vertrag

### 11.1 Aktuelle Runtime-Inventur

| Flow                  | Klassifikation                | Locale-Quelle               | x10-Zustand                                    | Mail-Runtime                                               |
| --------------------- | ----------------------------- | --------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| Contact               | `EXISTS_RUNTIME`              | URL-/Form-Locale im Request | UI, Validation, Loading, Success und Error x10 | nur interne Team-Mail; kein Nutzer-Autoresponder           |
| Support               | `EXISTS_RUNTIME`              | URL-/Form-Locale im Request | UI und Systemzustände x10                      | interne Team-Mail plus nutzergerichteter Autoresponder x10 |
| Consumer Order        | `EXISTS_RUNTIME`              | URL-/Form-Locale im Request | UI, Validation, Loading, Success und Error x10 | nur interne Team-Mail; keine Nutzer-Bestätigungsmail       |
| Praxis-Bestellanfrage | `EXISTS_RUNTIME` über Contact | URL-/Form-Locale im Request | Spray-/Implantologie-Form x10                  | nur interne Team-Mail                                      |
| ROI Report            | `EXISTS_RUNTIME`              | URL-/Form-Locale im Request | Formularzustände x10                           | nutzergerichtete Mail und Runtime-PDF x10                  |
| GENERAL_SALES         | `EXISTS_RUNTIME`              | aktive URL-Locale           | CTA-Copy x10, Intent `GENERAL_SALES`           | kein eigener Mailflow                                      |
| Epigenetics Inquiry   | `UI_ONLY` / `FUTURE_OWNER`    | derzeit Contact-Journey     | allgemeine Contact-UI x10                      | kein dedizierter Inquiry-Mailflow                          |
| Chat                  | `LEGACY` / nicht produktiv    | —                           | nicht registriert                              | keine produktive Runtime                                   |

Alle Request-Locales werden mit `normalizeLanguage` bzw. `resolveMailLocale` gegen den kanonischen
x10-Sprachsatz geprüft. Ungültige oder fehlende Werte fallen defensiv vollständig auf `en` zurück;
gültige Locales dürfen niemals durch Server-Defaults überschrieben werden. Strukturierte API-Codes
werden im Frontend lokalisiert, unbekannte Codes zeigen ausschließlich die locale-aware generische
Fehlermeldung. Provider-/Stack-Texte werden nicht nutzersichtbar ausgegeben. Consent- und
Tracking-Semantik wurden nicht verändert.

### 11.2 Ownergebundene Future-Flow-Verträge

| Feld                          | ROI-/Lead-Magnet-Gating                                                    | Dedizierte Epigenetics Inquiry                                      | Persistente Consumer-Order-Mailplattform                              |
| ----------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Flow                          | spätere gated ROI-/Download-Zustellung zusätzlich zur heutigen ROI-Runtime | dedizierte Inquiry-Journey                                          | persistente/queued Nutzerbestätigung                                  |
| Owner                         | AP19 / AP22                                                                | AP15 / AP22                                                         | AP21 / AP22                                                           |
| Required before               | AP19 Funnel- und AP22 Delivery-Vertrag                                     | AP15 Journey- und AP22 Delivery-Vertrag                             | AP21 Order- und AP22 Delivery-Vertrag                                 |
| Locale source                 | validierte Journey-Locale                                                  | validierte Journey-Locale                                           | validierte Order-Locale                                               |
| Supported locales             | exakt de, en, pl, fr, it, es, pt, da, nl, cs                               | exakt de, en, pl, fr, it, es, pt, da, nl, cs                        | exakt de, en, pl, fr, it, es, pt, da, nl, cs                          |
| Required translation contract | owner-spezifische Subject-, Text-/HTML-Body- und Delivery-State-Keys       | owner-spezifische Subject-, Text-/HTML-Body- und Inquiry-State-Keys | owner-spezifische Subject-, Text-/HTML-Body- und Order-State-Keys     |
| Fallback rule                 | invalid → defensiv `en`; Missing Key bleibt Gate-Fehler                    | invalid → defensiv `en`; Missing Key bleibt Gate-Fehler             | invalid → defensiv `en`; Missing Key bleibt Gate-Fehler               |
| Persistence expectation       | `locale` mit Lead/Delivery persistieren                                    | `locale` mit Inquiry persistieren                                   | `locale` mit Order/Message persistieren                               |
| Launch blocker                | ja, sobald dieser spätere Flow aktiviert wird                              | ja, sobald die dedizierte Journey aktiviert wird                    | ja, sobald eine Nutzerbestätigung versprochen wird                    |
| Current safe state            | heutige ungatete ROI-Runtime ist x10; keine Gating-Behauptung              | Contact-Journey x10; keine dedizierte Runtime-Behauptung            | Bestellanfrage-UI x10; keine E-Mail-/Rechnungsbestätigung versprochen |
| Status                        | `READY_FOR_OWNER`                                                          | `READY_FOR_OWNER`                                                   | `READY_FOR_OWNER`                                                     |
| Evidence                      | `server/server.js`, `server/system-i18n.js`, AP19/AP22 Ownership           | Contact-CTA/Flow, AP15/AP22 Ownership                               | Consumer/Praxis Order UI, AP21/AP22 Ownership                         |

`READY_FOR_OWNER` beschreibt ausschließlich den Integrationsvertrag. Keiner dieser drei Future-Flows
ist dadurch `READY`, `COMPLETE` oder `LIVE`.

---

## 12. PT08.6 Ressourcen-/Asset-Sprachvertrag

### 12.1 Produktives Inventar und technische Wahrheit

| Klasse                            |                            Bestand | Tatsächliche Sprache / Auswahl              | Sicherer Zustand                                                                                                 |
| --------------------------------- | ---------------------------------: | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Produktflyer                      |                             3 PDFs | IglooPro `de`; Vitamin-D3-Spray `de` + `en` | DE erhält DE; alle anderen Spray-Locales erhalten EN mit lokalisiertem Hinweis; IglooPro wird als DE ausgewiesen |
| Epigenetics Infoblätter           |                            18 PDFs | 9 fachliche Identitäten je `de` + `en`      | DE erhält DE, alle anderen Locales EN; jeder Einzel-/ZIP-Link nennt die reale Sprache                            |
| Epigenetics Zusatz-/Musterbefunde |                     8 PDFs + 1 ZIP | ausschließlich `de`                         | alle Locale-Seiten zeigen lokalisierten Deutsch-Hinweis und `hrefLang="de"`                                      |
| Epigenetics Infoblatt-Pakete      |                             2 ZIPs | `de` + `en`                                 | dieselbe deterministische Zuordnung wie bei den Einzelblättern                                                   |
| ROI Report                        | Runtime-PDF, keine statische Datei | x10 aus validierter Journey-Locale          | bereits PT08.5 PASS; keine statische Lead-Magnet-Datei behauptet                                                 |

Damit sind **32/32** physische Download-Assets produktiv klassifiziert: 22 Dateien gehören zu elf
realen DE/EN-Variantenpaaren, zehn Dateien sind ehrliche Single-Language-DE-Assets. Alle **32/32**
produktiven Referenzen sind auflösbar; Broken References = **0**. `src/content/downloads.json` hält
stabile Identität, Pfad, Sprache und Übersetzungsschlüssel für die drei Katalogressourcen. Es ist keine
zweite Asset-SSOT und kein AP19-DAM: Epigenetics behält bis AP19 seine bestehende Locale-Datenstruktur.

### 12.2 UI-Metadaten, Disclosure und Fallback

- `downloads.assets.*` und `downloads.assetLanguage.*` sind in allen zehn Locales vorhanden und
  G4-key-paritätisch. Titel, Beschreibung, Dateityp, Größe, locale-aware Datum und Sprachhinweis werden
  auf `/downloads` in der UI-Locale gerendert.
- `ResourceLanguageBadge` rendert den Hinweis in der UI-Locale; `hrefLang` kennzeichnet das verlinkte
  Dokument semantisch. Epigenetics-Sheets, ZIPs, Zusatzblätter, Musterbefunde, IglooPro und Spray
  verwenden denselben kleinen Vertrag.
- Asset-Fallback ist nur explizit zulässig: requested Locale → reale DE/EN-Datei → sichtbarer,
  lokalisierter Sprachhinweis. Ungesehener EN-/DE-Fallback ist verboten und durch
  `npm run check:assets` abgesichert.
- Musterbefund-Webcontent bleibt 6 × 10 lokalisiert; die sechs herunterladbaren Musterbefund-PDFs
  bleiben davon getrennt und sind real nur deutsch.

### 12.3 Sprachabhängige Bilder und Owner-Handoff

Die drei bestehenden 1200×630-Socialbilder (`og-image.jpg`, `og-epigenetics.jpg`,
`og-vitd3-spray.jpg`) enthalten deutsche bzw. gemischte DE/EN-Copy und sind daher
`SINGLE_LANGUAGE_DE / FUTURE_OWNER`, nicht language-neutral. PT08.6 erzeugt oder übersetzt keine
Designassets. Produktfotos einschließlich Verpackungsaufdruck werden als reale Produktdarstellung,
nicht als übersetzte UI-Copy klassifiziert. Consumer besitzt weiterhin keine drei produktspezifischen
OG-Varianten (`DG-08`).

| Offener realer Assetbedarf                                              | Owner            | Status / Safe State                                                                         |
| ----------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------- |
| weitere fachlich freigegebene Epigenetics-/Musterbefund-Sprachvarianten | AP15/AP16 + AP19 | `DEFERRED_OWNER`; bestehende DE/EN-Datei sichtbar deklariert                                |
| zentrales `assetByLanguage`-/Resource-Modell                            | AP19             | `READY_FOR_OWNER`; nicht durch PT08.6 vorgezogen                                            |
| Consumer-OG-/Produkt-Socialvarianten                                    | AP21 + AP09      | `DEFERRED_ASSET_GATE DG-08`; generische bestehende Ausgabe, keine Produktvariante behauptet |
| finale locale-aware OG-Auswahl für vorhandene DE-Bilder                 | AP09             | `DEFERRED_OWNER`; Assetsprachbefund dokumentiert, keine SEO-Plattform vorgezogen            |
| gated Lead-Magnet-Ressource/Delivery                                    | AP19/AP22        | keine heutige statische Ressource; keine Fake-Runtime/-Datei                                |

Reproduzierbare Evidenz: `npm run check:assets` (Existenz, Katalogmetadaten x10, Sprachmapping,
Disclosure-Integration, 32-Dateien-Inventar) plus G4 über `npm run check:i18n`.

---

<!-- G4:EVIDENCE:START -->

## G4 generated evidence

- Generated at: 2026-08-26T17:44:33.130Z
- Git HEAD: `6b0ed1363f08fa241a7b21d226c3a7dd4a6493bb`
- Guard command: `npm run check:i18n`
- Supported languages: de, en, pl, fr, it, es, pt, da, nl, cs (10/10)
- Default locale: `de`
- Defensive fallback locale: `en`
- Productive namespaces (15): `common`, `home`, `about`, `articles`, `contact`, `services`, `events`, `downloads`, `epigenetics`, `legal`, `products`, `support`, `vitd3spray`, `specialty`, `consumer`
- Legacy namespaces (0): none
- Backlog namespaces (2): `casestudies`, `shop`
- Deferred-owner namespaces (0): none
- Namespace file coverage: 150/150
- Namespace JSON/key parity: PASS
- Epigenetics coverage: 10/10; no regular `_translationStatus` marker
- Musterbefund coverage: 6/6 × 10/10; slug-local lazy route modules retained
- `befund.*` UI key parity: PASS
- `services.*.seo.*` parity: PASS (9 services × title/description × 10)
- Broad exact-English-copy heuristic: PASS
- Resource language truth: PASS (32/32 productive downloads classified; 0 broken; 0 silent asset-language fallbacks)
- Open owner-bound integrations: creation of missing Fach-/OG asset variants remains with AP15/AP16/AP19/AP21/AP09
- Asset asymmetry handoff: SAFE / OWNER-BOUND; PT08.6 supplies localized disclosure, not fake files
- Guard result: PASS

### Schema references

- `common`: schema `de`
- `home`: schema `de`
- `about`: schema `de`
- `articles`: schema `de`
- `contact`: schema `de`
- `services`: schema `de`
- `events`: schema `de`
- `downloads`: schema `de`
- `epigenetics`: schema `en`
- `legal`: schema `de`
- `products`: schema `de`
- `support`: schema `de`
- `vitd3spray`: schema `de`
- `specialty`: schema `de`
- `consumer`: schema `en`

The schema reference controls structure only. It does not declare that language to be the universal
editorial source, and it never licenses English fallback as production content.

<!-- G4:EVIDENCE:END -->
