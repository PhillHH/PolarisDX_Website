# CONTENT-MATRIX

**Launch-Content-Status des PolarisDX-Relaunch. Kein Redaktionskalender, keine Content-Governance.**

**Angelegt:** AP04 PT04.1 — Content-Audit (2026-08-24)
**Kanonischer Pfad:** `building-docs/CONTENT-MATRIX.md` (`AP04.md` §5.1; `CONTEXT-INDEX.md` legt keinen
abweichenden Pfad fest)
**Erhebungsart:** read-only gegen `HEAD = cd2524e`, Branch `console/4-2026-08-24T14-54-30`.
Alle Zahlen sind ausgezählt, nicht geschätzt.

---

## 1. Zweck und Grenzen

Diese Matrix beantwortet genau eine Frage: **Welcher Inhalt ist launchfähig, welcher nicht — und warum
nicht?**

Sie ist nach `AP04.md` §5.2 **ausdrücklich nicht**: Redaktionskalender · dauerhafte Ownership-Governance ·
CMS-Workflow · medizinischer Approval-Prozess · Translation-Vendor-Workflow. Formale Content-Governance
bleibt Backlog (`DEC-RL-010`).

**Autorität.** Diese Datei ist **Content-Statuswahrheit**. Sie ist **keine** zweite Routing-Wahrheit
(`ROUTING-CONTRACT.md`), **keine** zweite IA-Wahrheit (`IA-INVENTORY.md`), **keine** zweite Sprachwahrheit
(`I18N-CONTRACT.md`) und **keine** zweite Asset-Architektur (`CONTENT-ASSET-CONTRACT.md`). Wo sie einen
Zustand nennt, den ein Vertrag als Schuld führt, referenziert sie dessen ID statt sie zu duplizieren.

**Kein Decision-Lock wird hier geöffnet.** Wo der Ist-Zustand einer Entscheidung widerspricht, ist das
eine Lücke gegen den Lock — nie ein Anlass, den Lock zu überdenken (`AGENT-CONTRACT.md` §1.3).

---

## 2. Statusmodell

| Status               | Bedeutung                                                                        |
| -------------------- | -------------------------------------------------------------------------------- |
| `READY`              | launchfähig im Zielsprachumfang, keine offene Content-Arbeit                     |
| `PARTIAL`            | vorhanden, aber unvollständig (Sprache, Copy, Metadaten)                         |
| `MISSING`            | Zielinhalt existiert nicht                                                       |
| `PLACEHOLDER`        | sichtbarer Text, der bewusst kein Endtext ist                                    |
| `MOCK`               | simulierte Funktion/Antwort, die produktiv nicht gelten darf                     |
| `OUTDATED`           | inhaltlich überholt oder zeitkritisch abgelaufen                                 |
| `REDUNDANT`          | doppelt geführte Aussage über zwei Quellen                                       |
| `SENSITIVE_REVIEW`   | medizinisch/regulatorisch — nur mit fachlicher Deckung änderbar                  |
| `LEGACY_REMOVE`      | Ist-Bestand, der **nicht** ins Ziel übernommen wird                              |
| `BACKLOG_NOT_LAUNCH` | vorhanden, aber ausdrücklich nicht Launch-Scope (`DEC-RL-015`, `DEC-RL-010`)     |
| `ASSET_BLOCKED`      | Content ist da, aber ein benötigtes Asset fehlt oder ist in der falschen Sprache |

Ein Eintrag kann genau **einen** Status tragen; zusätzliche Eigenschaften stehen in den Flag-Spalten.

**Zielsprachumfang** ist überall `10` (`de en pl fr it es pt da nl cs`, `DEC-RL-001`, `I-01`), einzige
Ausnahme die deklariert einsprachigen Seiten `C-24`/`C-25` (`S-17`, `IA-INVENTORY.md` §4.10).

### 2.1 Lesart der Spalte „Current Locale Coverage“

Zwei getrennte Größen, die nie vermischt werden:

- **Keys** — existiert der Schlüssel in der Sprache? (Key-Parität, `I-06`)
- **übersetzt** — trägt der Schlüssel eine echte Übersetzung oder denselben englischen String wie `en`?

`10/10 Keys · 2/10 übersetzt` heißt: die Datei ist strukturell vollständig, der Inhalt ist in acht
Sprachen englisch. **Ein EN-Fallback zählt nie als erledigt** (`I-03`, `CA-12`).

---

## 3. Messmethode und Evidenz

| Messung                  | Verfahren                                                                                            | Ergebnis                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Key-Parität              | Leaf-Key-Mengenvergleich je Namespace gegen `de`                                                     | §4.2, 21 fehlende Keys in 8 Sprachen   |
| Übersetzungsstand        | Wertevergleich gegen `en`; gezählt werden Sätze ≥ 30 Zeichen und ≥ 4 Wörtern, die wörtlich `en` sind | §4.2, bis zu 310 Sätze je Sprache      |
| Asset-Referenzintegrität | alle `*.pdf`/`*.zip`-Strings aus 150 Locale-Dateien gegen das Dateisystem aufgelöst                  | 29/29 auflösbar, 0 verwaist            |
| Hartkodierte Copy        | `useTranslation`-Vorkommen je Seitendatei                                                            | Consumer 0/7, `C-24`/`C-25` 0/2        |
| CTA-Bestand              | Wortlautsuche über 10 Locales + Quelltext-Defaults                                                   | §5                                     |
| Alt-Texte                | `alt=`-Vorkommen gegen `<img`-Vorkommen                                                              | 21 `alt=` bei 21 `<img>`, 7 über `t()` |

Locale-Änderungen werden erst nach `npm run build` wirksam sichtbar (`I18N-CONTRACT.md` M-06) — für
PT04.1 irrelevant, weil nichts geändert wurde, für PT04.3 zwingend zu beachten.

---

## 4. Content-Matrix

Ein Eintrag je launchrelevanter Content-Einheit bzw. Content-Familie. Die `IA-ID`-Spalte stellt die
Verbindung zu `IA-INVENTORY.md` §4 her; Seitentyp und CTA-Rolle stammen aus dessen §8.4 und werden hier
nicht neu entschieden.

### 4.1 Teil A — Identität, Status, Quelle, Sprache

| Content-ID | IA-ID       | Route / Seitenfamilie                              | Seitentyp | Content-Typ                   | Current Status       | Target Status | Quelle / Datei                                                     | Current Locale Coverage                             | Target |
| ---------- | ----------- | -------------------------------------------------- | --------- | ----------------------------- | -------------------- | ------------- | ------------------------------------------------------------------ | --------------------------------------------------- | ------ |
| **C-01**   | P-01        | `/`                                                | T1        | Hero · Proof · FAQ · CTA      | `PARTIAL`            | `READY`       | `public/locales/*/home.json` (243 Keys), 8 Home-Sections           | 10/10 Keys · 10/10 übersetzt, 4 EN-Sätze/Spr.       | 10     |
| **C-02**   | P-02        | `/about`                                           | T2        | Story · Proof · CTA           | `PARTIAL`            | `READY`       | `public/locales/*/about.json` (66)                                 | 10/10 Keys · 1–2 EN-Sätze/Spr.                      | 10     |
| **C-03**   | P-03        | `/contact`                                         | T8        | Form-/Success-/Error-Copy     | `PARTIAL`            | `READY`       | `public/locales/*/contact.json` (112)                              | 10/10 Keys · **2/10 übersetzt** (Formteil)          | 10     |
| **C-04**   | P-04        | `/support`                                         | T10       | Form · Help · Success         | `PARTIAL`            | `READY`       | `public/locales/*/support.json` (87)                               | 10/10 Keys · ~3 EN-Sätze/Spr.                       | 10     |
| **C-05**   | P-05        | `/events`                                          | T6        | Event-Liste · CTA             | `OUTDATED`           | `READY`       | `src/data/events.ts` + `public/locales/*/events.json` (55)         | 10/10 Keys · übersetzt                              | 10     |
| **C-06**   | P-06        | `/downloads`                                       | T2        | Download/Resource · CTA       | `PARTIAL`            | `READY`       | `src/content/downloads.json` (3) + `*/downloads.json` (27)         | 10/10 Keys · übersetzt                              | 10     |
| **C-07**   | P-07 · P-16 | `/articles`, `/articles/:slug`                     | T2 · T6   | Editorial · CTA               | `PARTIAL`            | `READY`       | `src/data/articles.ts` (6) + `*/articles.json` (272)               | 10/10 Keys · **6/10 übersetzt**                     | 10     |
| **C-08**   | P-08        | `/igloo-pro`                                       | T4        | Product · Proof · CTA         | `PARTIAL`            | `READY`       | `public/locales/*/products.json` (96)                              | 10/10 Keys · übersetzt, CTA divergent               | 10     |
| **C-09**   | P-09        | `/diagnostics`                                     | T2        | Hub · CTA                     | `PARTIAL`            | `READY`       | `public/locales/*/services.json` (356, Hub-Teil)                   | 10/10 Keys · übersetzt                              | 10     |
| **C-10**   | P-11        | `/diagnostics/:slug` (9)                           | T3        | Feature/Leistung · FAQ        | `PARTIAL`            | `READY`       | `src/data/services.tsx` (9) + `*/services.json`                    | 10/10 Keys **außer** 5 `seo.title` in 8 Spr.        | 10     |
| **C-11**   | P-10        | `/epigenetics`                                     | T2/T5     | Pillar-Hero · Proof · CTA     | `PARTIAL`            | `READY`       | `public/locales/*/epigenetics.json` (463)                          | 10/10 Keys · **2/10 übersetzt**                     | 10     |
| **C-12**   | P-12–P-14   | `/epigenetics/{grundlagen,studienlage,unterlagen}` | T5        | Feature · Evidence · Resource | `PARTIAL`            | `READY`       | `*/epigenetics.json` + `src/pages/Epigenetics*Page.tsx`            | 10/10 Keys · **2/10 übersetzt**                     | 10     |
| **C-13**   | P-15        | `/epigenetics/musterbefund/:slug` (6)              | T5        | Spezialisierte Content-Daten  | `PARTIAL`            | `READY`       | `src/content/befunde/*.{de,en}.json` (12)                          | **2/10** (`de`, `en`) — Inhalte fehlen ×8           | 10     |
| **C-14**   | P-18        | `/consumer/vitamin-d3-spray`                       | T7        | Consumer-Landing · Order      | `PARTIAL`            | `READY`       | `src/pages/consumer/SprayPage.tsx` + `shell.tsx` (hartkodiert)     | **1/10** (`en`), 0 × `useTranslation`               | 10     |
| **C-15**   | P-19        | `/consumer/hydrating-masks`                        | T7        | Consumer-Landing · Order      | `PARTIAL`            | `READY`       | `src/pages/consumer/MaskPage.tsx` (hartkodiert)                    | **1/10** (`en`)                                     | 10     |
| **C-16**   | P-20        | `/consumer/inside-out-duo`                         | T7        | Consumer-Landing · Order      | `PARTIAL`            | `READY`       | `src/pages/consumer/DuoPage.tsx` (hartkodiert)                     | **1/10** (`en`)                                     | 10     |
| **C-17**   | P-18–P-20   | Consumer Order Form                                | T7/T8     | Form-/Success-/Error-Copy     | `PARTIAL`            | `READY`       | `src/pages/consumer/OrderForm.tsx` · `OrderModal.tsx`              | **1/10** (`en`), Mengenoptionen als Freitext        | 10     |
| **C-18**   | P-21–P-23   | `/privacy`, `/imprint`, `/terms`                   | T10       | Legal / Regulatory Notice     | `PARTIAL`            | `READY`       | `public/locales/*/legal.json` (256)                                | 10/10 Keys · 2 EN-Sätze/Spr.                        | 10     |
| **C-19**   | P-26        | `/vitamin-d3-spray` (B2B)                          | T4        | Product · Disclaimer          | `PARTIAL`            | `READY`       | `public/locales/*/vitd3spray.json` (127)                           | 10/10 Keys · übersetzt inkl. Disclaimer             | 10     |
| **C-20**   | —           | Globale UI / Navigation / Errors                   | —         | System-/Shell-Copy            | `PARTIAL`            | `READY`       | `public/locales/*/common.json` (113)                               | 10/10 Keys **außer** 7 `errors.*` in 8 Spr.         | 10     |
| **C-21**   | —           | Artikel-UI (Breadcrumb, „Weiterlesen“)             | —         | System-Copy                   | `READY`              | `READY`       | `public/locales/*/shop.json` (7)                                   | 10/10 Keys · übersetzt                              | 10     |
| **C-22**   | P-01        | Homepage-Testimonials (5)                          | T1        | Proof                         | `PARTIAL`            | `READY`       | `src/data/testimonials.ts` + `*/home.json` `testimonials.*`        | 10/10 Keys · übersetzt                              | 10     |
| **C-23**   | P-06 · P-14 | Downloads-/Epigenetik-Dateien (32)                 | T9        | Download / Resource           | `ASSET_BLOCKED`      | `READY`       | `public/downloads/**`, Zuordnung in `*/epigenetics.json`           | `de` 17 · `en` 9 · **8 Sprachen ohne eigene Datei** | 10     |
| **C-24**   | P-24        | `/s3_leitlinie`                                    | T6        | Knowledge-Landing             | `PARTIAL`            | `READY`       | `src/pages/S3LeitliniePage.tsx` (1 010 Z., hartkodiert `de`)       | 1/1 (`de`, deklariert einsprachig)                  | 1      |
| **C-25**   | P-25        | `/vitamin-d3-implantologie`                        | T6        | Knowledge-Landing             | `PARTIAL`            | `READY`       | `src/pages/VitaminD3ImplantologyPage.tsx` (611 Z., hartkodiert)    | 1/1 (`de`, deklariert einsprachig)                  | 1      |
| **C-26**   | —           | Systemmails / Autoresponder                        | —         | System-/Zustell-Copy          | `PARTIAL`            | `READY`       | `server/server.js` (5 Mailstrecken, hartkodiert `de`)              | **1/10** (`de`)                                     | 10     |
| **C-27**   | —           | ROI-Report-PDF                                     | T9        | Download / Resource           | `PARTIAL`            | `READY`       | `server/server.js` PDF-Generator, `Intl.NumberFormat('de-DE')`     | **1/10** (`de`)                                     | 10     |
| **C-28**   | N-01        | 404 / Fehlerzustände                               | —         | System-Copy                   | `PARTIAL`            | `READY`       | `src/pages/NotFoundPage.tsx`, `common.json` `errors.*`             | 10/10 Keys **außer** 7 `errors.*` in 8 Spr.         | 10     |
| **C-29**   | —           | Chat-Copy (`common.chat.*`, 8 Keys)                | —         | Legacy                        | `LEGACY_REMOVE`      | entfernt      | `public/locales/*/common.json`, `src/components/ui/ChatWidget.tsx` | 10/10 vorhanden — **nicht** Zielinhalt              | —      |
| **C-30**   | —           | `/api/chat` Mock-Antworten                         | —         | Legacy / Mock                 | `MOCK`               | entfernt      | `server/server.js` 492–534                                         | 1/1 (`de`, hartkodiert)                             | —      |
| **C-31**   | —           | Case-Study-Copy `32reasons`                        | —         | Backlog                       | `BACKLOG_NOT_LAUNCH` | unverändert   | `public/locales/*/casestudies.json` (32) · `FeaturedCaseStudy.tsx` | 10/10 vorhanden, Namespace **unregistriert**        | —      |
| **C-32**   | P-17        | Gated Lead-Magnet-Copy                             | T9        | Lead-Magnet-Gate              | `MISSING`            | `READY`       | existiert nicht                                                    | 0/10                                                | 10     |
| **C-33**   | P-27        | Epigenetik-Inquiry-Copy                            | T8        | Form-/Success-/Error-Copy     | `PARTIAL`            | `READY`       | `*/epigenetics.json` `contact.*` + `*/contact.json`                | **2/10 übersetzt**                                  | 10     |

### 4.2 Teil B — Flags, CTA, Assets, Blocker, Owner

| Content-ID | CTA Status                                                                                | Asset Dependency                                    | Sensitive | Placeholder/Mock | Outdated/Redundant | Launch Blocker | Owner AP         | Notes                                                                                                                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------- | --------- | ---------------- | ------------------ | -------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **C-01**   | **abweichend** — 5 × `Beratung buchen` statt `QUOTE_REQUEST`                              | `above_the_fold`, `hero_device`, Testimonial-Bilder | ja        | nein             | nein               | **ja**         | AP04 · AP11      | `CV < 2 %` und IVDR/CE im Hero, FAQ und Trustbar; `hero.description` „…einsatzbereit – garantiert“                                                                                                                                      |
| **C-02**   | `CONTACT` — konform                                                                       | `polarisdx_logo`, Team-Bilder                       | teils     | nein             | nein               | nein           | AP04 · AP20      | IVDR/CE-Aussage in `about.ivdr`                                                                                                                                                                                                         |
| **C-03**   | `submit.consultation` = „Beratung buchen“ **abweichend**                                  | keine                                               | nein      | nein             | nein               | **ja**         | AP04 · AP20      | `success` = „Ihre Nachricht wurde gesendet“ → Mail-only-Semantik, verstößt gegen `DEC-RL-009` / `CNT-15`                                                                                                                                |
| **C-04**   | `hero.cta_primary` = „Beratung buchen“ — **Sales-CTA auf Support**                        | keine                                               | nein      | nein             | nein               | **ja**         | AP04 · AP20      | `IA-INVENTORY.md` §8.4 P-04: Support trägt **keinen** Sales-CTA; `en` sagt bereits „Send a request“                                                                                                                                     |
| **C-05**   | `EVENT_CONTACT` — konform                                                                 | keine                                               | nein      | nein             | **ja**             | **ja**         | AP04 · AP18      | 3 von 5 „upcoming“-Events liegen zum Stichtag in der Vergangenheit; `upcoming.eyebrow` = „Upcoming · 2026“                                                                                                                              |
| **C-06**   | 3 × „Beratung buchen“ **abweichend**                                                      | 3 PDFs (vorhanden)                                  | nein      | nein             | **ja**             | **ja**         | AP04 · AP19      | Kategorie `techBrochures` sichtbar, aber 0 Katalogeinträge (`CD-1`); Titel hartkodiert (`CD-6`)                                                                                                                                         |
| **C-07**   | **Einheits-CTA** „Beratung buchen“ auf jedem Artikel                                      | 4 Artikelbilder                                     | teils     | nein             | **ja**             | **ja**         | AP04 · AP17      | `IAD-13`; `date`/`readTime`/`category` als englische Anzeigetexte in Schicht A (`CD-4`)                                                                                                                                                 |
| **C-08**   | `hero.cta_order` de = „Angebot anfragen“, **pl/fr/it/es/pt/da/nl/cs = „Jetzt bestellen“** | Produktbilder                                       | ja        | nein             | nein               | **ja**         | AP04 · AP14      | CTA-Rolle kippt sprachabhängig von `QUOTE_REQUEST` auf `ORDER`; `CV < 2 %` mehrfach                                                                                                                                                     |
| **C-09**   | `VIEW_DETAIL` + `QUOTE_REQUEST` — konform                                                 | keine                                               | ja        | nein             | nein               | nein           | AP04 · AP12      | `CV < 2 %`-Chip                                                                                                                                                                                                                         |
| **C-10**   | `QUOTE_REQUEST` — konform                                                                 | keine                                               | **ja**    | nein             | nein               | **ja**         | AP04 · AP13      | „garantierte Performance“, „LFT-Kompatibilitäts-Garantie“, CV-Claims — 9 Services; **Präzisierung zu `CD-5`:** `description` ist 9 × Leerstring (totes Feld), `title` ist gefüllt und dient in `ServicePage.tsx:200` als `t()`-Fallback |
| **C-11**   | `EPIGENETICS_INQUIRY`; Label in 8 Sprachen englisch                                       | ZIP + 9 Sheets + OG-Bild                            | **ja**    | nein             | nein               | **ja**         | AP04 · AP15      | 196 EN-Sätze je Sprache; `_translationStatus`-Marker gesetzt                                                                                                                                                                            |
| **C-12**   | `EPIGENETICS_INQUIRY` / `DOWNLOAD_PUBLIC`                                                 | Evidence-PDF, Unterlagen-ZIP                        | **ja**    | nein             | nein               | **ja**         | AP04 · AP15/AP19 | Pflichthinweis „keine CE-gekennzeichneten In-vitro-Diagnostika“ in 8 Sprachen englisch                                                                                                                                                  |
| **C-13**   | `EPIGENETICS_INQUIRY`                                                                     | 6 Musterbefund-PDFs **nur `de`**                    | **ja**    | nein             | nein               | **ja**         | AP04 · AP16      | `IAD-03`; Befund-Disclaimer („Werte frei erfunden“) in 8 Sprachen englisch                                                                                                                                                              |
| **C-14**   | `ORDER` — konform, aber nur `en`                                                          | 2 Hero-JPEGs, **kein OG-Bild** (`CD-9`)             | teils     | nein             | **ja**             | **ja**         | AP04 · AP21      | `App.tsx` 243–246 dokumentiert „noindex, nicht in Sitemap, passwortgeschützt“ — widerspricht `DEC-RL-006`                                                                                                                               |
| **C-15**   | `ORDER` — konform, aber nur `en`                                                          | 1 Hero-JPEG, **kein OG-Bild**                       | teils     | nein             | nein               | **ja**         | AP04 · AP21      | Kosmetik-/Hautaussagen sind Health-Claim-nah                                                                                                                                                                                            |
| **C-16**   | `ORDER` — konform, aber nur `en`                                                          | 2 JPEGs, **kein OG-Bild**                           | teils     | nein             | **ja**             | **ja**         | AP04 · AP21      | `DuoPage.tsx:72` `TODO: confirm final meta title with Claire (Wave-2 review)` über dem `SEOHead`-Titel                                                                                                                                  |
| **C-17**   | `ORDER` — Submit/Success/Error nur `en`                                                   | keine                                               | nein      | nein             | nein               | **ja**         | AP04 · AP21/AP22 | Mengenoptionen sind zugleich Wert **und** Anzeigetext („1 pack (12 bottles)“) — Schicht-A/B-Vermischung                                                                                                                                 |
| **C-18**   | `NONE` — konform                                                                          | keine                                               | **ja**    | nein             | nein               | nein           | AP04 · AP20      | Gewährleistungs-/Export-Klauseln; Indexierungspolicy offen (`IAD-05`, AP20)                                                                                                                                                             |
| **C-19**   | `QUOTE_REQUEST` — konform                                                                 | `VITAMIND_D3_SPRAY.jpg`, `og-vitd3-spray.jpg`       | **ja**    | nein             | nein               | nein           | AP04 · AP14      | Pflicht-Disclaimer Nahrungsergänzung in allen 10 Sprachen vorhanden und übersetzt — **positiv geprüft**                                                                                                                                 |
| **C-20**   | Nav-Labels — konform                                                                      | Logo-Assets                                         | nein      | nein             | nein               | **ja**         | AP04 · AP08      | `errors.root.*` / `errors.segment.*` fehlen in 8 Sprachen → Key-String würde gerendert (`I-06`)                                                                                                                                         |
| **C-21**   | —                                                                                         | keine                                               | nein      | nein             | **ja**             | nein           | AP04 · AP08      | Namespace heißt `shop`, enthält aber Artikel-UI und **wird aktiv geladen** — irreführender Name, kein Shop                                                                                                                              |
| **C-22**   | `NONE`                                                                                    | 4 Avatarbilder; `martin_fischer` **ohne Avatar**    | teils     | nein             | nein               | nein           | AP04 · AP11      | `text: ''` in `testimonials.ts` ist totes Feld; echter Text liegt korrekt in Schicht B                                                                                                                                                  |
| **C-23**   | `DOWNLOAD_PUBLIC`                                                                         | 26 PDFs + 3 ZIPs + 3 Root-PDFs                      | **ja**    | nein             | **ja**             | **ja**         | AP04 · AP19/AP08 | `CD-2`: **8 Sprachen** tragen englische Dateinamen; `en` erhält den **deutschen** `Musterbefunde_DE.zip`                                                                                                                                |
| **C-24**   | `QUOTE_REQUEST` (3 × „Beratung buchen“ hartkodiert)                                       | 1 Bild                                              | **ja**    | nein             | nein               | **ja**         | AP04 · AP20      | S3-Leitlinien-/Vitamin-D-Aussagen; Abbau der Einsprachigkeit ist AP08 PT08.4.3 vorbehalten                                                                                                                                              |
| **C-25**   | `QUOTE_REQUEST`                                                                           | 1 Bild                                              | **ja**    | nein             | **ja**             | **ja**         | AP04 · AP20      | verlinkt auf Redirect-Quelle `/services/dental` statt `/diagnostics/dental` (`IAD-18`)                                                                                                                                                  |
| **C-26**   | —                                                                                         | keine                                               | nein      | nein             | nein               | **ja**         | AP04 · AP08/AP22 | Support-Autoresponder, ROI-Zustellung, Kontakt-, Bestell- und Betreffzeilen ausschließlich deutsch (`ID-7`)                                                                                                                             |
| **C-27**   | `DOWNLOAD_PUBLIC` / Gate-Kandidat                                                         | zur Laufzeit erzeugtes PDF                          | **ja**    | nein             | nein               | **ja**         | AP04 · AP19/AP22 | Fußzeile trägt `CV < 2 %`; `Intl.NumberFormat('de-DE')` fest verdrahtet                                                                                                                                                                 |
| **C-28**   | `NONE`                                                                                    | keine                                               | nein      | nein             | nein               | **ja**         | AP04 · AP08      | identische Ursache wie C-20                                                                                                                                                                                                             |
| **C-29**   | —                                                                                         | externes Widget-Skript                              | nein      | **PLACEHOLDER**  | **ja**             | **ja**         | AP04 · AP06/AP23 | `welcome_prototype`: „Unser Chatbot ist noch nicht aktiv“ — sichtbarer Platzhalter × 10 (`DEC-RL-007`)                                                                                                                                  |
| **C-30**   | —                                                                                         | keine                                               | nein      | **MOCK**         | **ja**             | **ja**         | AP22 · AP26      | Echo-Agent mit fest verdrahteten deutschen Antworten + Teams-/OpenAI-Roadmap-Kommentar                                                                                                                                                  |
| **C-31**   | —                                                                                         | 1 Bild                                              | nein      | nein             | nein               | nein           | — (Backlog)      | **nicht reaktivieren** (`DEC-RL-015`); `FeaturedCaseStudy.tsx` wird nirgends gerendert                                                                                                                                                  |
| **C-32**   | `GATE_SUBMIT` — existiert nicht                                                           | Ressource noch nicht bestimmt                       | nein      | nein             | nein               | **ja**         | AP19 · AP22      | `DEC-RL-014` verlangt mindestens einen gated Pfad; Copy entsteht erst mit AP19 PT19.4 (`IAD-07`)                                                                                                                                        |
| **C-33**   | `EPIGENETICS_INQUIRY`                                                                     | keine                                               | **ja**    | nein             | nein               | **ja**         | AP04 · AP15/AP22 | Strecke multiplext heute über `/api/contact` (`IAD-11`); Formcopy in 8 Sprachen englisch                                                                                                                                                |

---

## 5. CTA-Audit (`ST04.1.2`)

### 5.1 Gelockter Standard

`GENERAL_SALES` = **„Angebot anfragen“** (`DEC-RL-013`, `IA-07`, `IA-INVENTORY.md` §8.3
`QUOTE_REQUEST`). Spezialisierte Journey-CTAs werden **nicht** darauf normalisiert.

### 5.2 Ist-Bestand des allgemeinen Sales-CTA

**15 Vorkommen von „Beratung buchen“ in 6 `de`-Namespaces** gegen **7 Vorkommen von „Angebot anfragen“
in 3 Namespaces** — plus 10 hartkodierte Default-Argumente im Quelltext.

| Namespace     | Key                                | `de` heute                                | Zielrolle                 | Bewertung                                               |
| ------------- | ---------------------------------- | ----------------------------------------- | ------------------------- | ------------------------------------------------------- |
| `home`        | `hero.cta`                         | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `home`        | `igloo_widget.help_cta`            | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `home`        | `final_cta.cta_primary`            | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `home`        | `roi.cta_consult`                  | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `home`        | `steps.cta`                        | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `home`        | `seo.description` (Fließtext)      | „…jetzt Beratung buchen.“                 | —                         | **abweichend** — CTA-Wortlaut in Meta-Copy              |
| `home`        | `roi.hint` (Fließtext)             | „…Beratung buchen oder Report anfordern.“ | —                         | **abweichend**                                          |
| `articles`    | `index.hero_primary_cta`           | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `articles`    | `detail.primary_cta`               | Beratung buchen                           | kontextabhängig (§8.2 T6) | **abweichend + `IAD-13`**                               |
| `downloads`   | `hero_cta`                         | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `downloads`   | `link_contact`                     | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `downloads`   | `cta_button`                       | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `contact`     | `contact.form.submit.consultation` | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `products`    | `help.cta`                         | Beratung buchen                           | `QUOTE_REQUEST`           | **abweichend**                                          |
| `support`     | `support.hero.cta_primary`         | Beratung buchen                           | **`SUPPORT_REQUEST`**     | **Journey-Fehlzuordnung** — Support ist kein Sales-Lead |
| `contact`     | `contact.form.submit.quote`        | Angebot anfragen                          | `QUOTE_REQUEST`           | konform                                                 |
| `products`    | `hero.cta_order`                   | Angebot anfragen                          | `QUOTE_REQUEST`           | konform in `de`, **divergent in 8 Sprachen**            |
| `products`    | `cta_bottom.button`                | Angebot anfragen                          | `QUOTE_REQUEST`           | konform in `de`, **divergent in 8 Sprachen**            |
| `epigenetics` | `hero.ctaQuote`                    | Angebot anfragen                          | `EPIGENETICS_INQUIRY`     | `de` korrekt, **8 Sprachen englisch**                   |
| `epigenetics` | `contact.title`                    | Angebot anfragen                          | `EPIGENETICS_INQUIRY`     | wie oben                                                |
| `epigenetics` | `links.contact`                    | Angebot anfragen                          | `EPIGENETICS_INQUIRY`     | wie oben                                                |

### 5.3 Hartkodierte CTA-Defaults im Quelltext

`t()`-Defaults sind sichtbarer Text, sobald ein Key fehlt. Betroffen: `HeroSection.tsx:130` ·
`FinalCtaSection.tsx:74` · `IglooWidgetSection.tsx:122` · `StepsSection.tsx:97` ·
`DiagnosticsFocusSection.tsx:108` · `RoiCalculatorSection.tsx:268` · `ArticlePage.tsx:336` ·
`ArticlesIndexPage.tsx:89` · `ServicePage.tsx:298,486` — je „Beratung buchen“. Zusätzlich
**drei vollständig hartkodierte CTA-Buttons ohne `t()`** in `S3LeitliniePage.tsx:819,904,998`.

### 5.4 Sprachübergreifende CTA-Inkonsistenz

`products.hero.cta_order` trägt in `de` „Angebot anfragen“, in `pl` „Zamów teraz“, in `fr`
„Commander maintenant“, in `it` „Ordina ora“, in `es` „Pedir ahora“, in `pt` „Pedir agora“, in `da`
„Bestil nu“, in `nl` „Nu bestellen“, in `cs` „Objednat nyní“ — sämtlich **„Jetzt bestellen“**. Damit
wechselt die CTA-Rolle einer B2B-Produktseite sprachabhängig von `QUOTE_REQUEST` zu `ORDER`.
`cta_bottom.button` zeigt dasselbe Muster mit „Termin buchen“-Varianten.

**Konsequenz für PT04.3:** Die CTA-Normalisierung ist keine reine `de`-Aufgabe. Sie muss die
Zielrolle je Key festlegen und dann alle zehn Sprachen daran ausrichten.

### 5.5 Übrige CTA-Rollen — Ist-Bestand

| Rolle                 | Fundstelle                                                     | Bewertung                                    |
| --------------------- | -------------------------------------------------------------- | -------------------------------------------- |
| `ORDER`               | Consumer „Shop Duo“, „Shop the Duo“, „Order now“ (hartkodiert) | nur `en`, sonst rollenkonform                |
| `EPIGENETICS_INQUIRY` | `epigenetics.hero.ctaQuote`, `contact.title`, `links.contact`  | `de` konform, 8 Sprachen englisch            |
| `DOWNLOAD_PUBLIC`     | `downloads.downloadBtn`, Epigenetik-Sheet-Links                | konform × 10                                 |
| `SUPPORT_REQUEST`     | `support.hero.cta_primary`                                     | **`de` trägt Sales-CTA** — Fehlzuordnung     |
| `CONTACT`             | `about`-CTA                                                    | konform                                      |
| `ROI_CALCULATE`       | `home.hero.cta_roi`, `articles:detail` Sekundär-CTA            | konform                                      |
| `EVENT_CONTACT`       | `events`-CTA                                                   | konform                                      |
| `VIEW_SAMPLE_REPORT`  | `epigenetics.analyses.sampleBtn`, `befund.pdfCta`              | konform, aber `ASSET_BLOCKED` (nur `de`-PDF) |
| `GATE_SUBMIT`         | —                                                              | **existiert nicht** (`C-32`, `DEC-RL-014`)   |

---

## 6. Headlines und Kernbotschaften (`ST04.1.1`)

| Seitenfamilie      | H1 / Hero-Kernbotschaft (`de`)                                       | Befund                                                                                                                    |
| ------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Homepage           | „IglooPro: Point-of-Care. Perfekt. Sofort.“                          | Hero-Description endet auf „…einsatzbereit – **garantiert**“ → §11.1                                                      |
| Homepage-Slider    | 4 rotierende Slides (`speed`, `economics`, `compliance`, `segments`) | alle vier Titel/Descriptions stehen **doppelt**: als `t()`-Default in `useHeroSlider.ts` und in `home.json` → `REDUNDANT` |
| Diagnostics-Hub    | Leistungsüberblick + `CV < 2 %`-Chip                                 | konsistent                                                                                                                |
| Service-Detail × 9 | je eigene H1 aus `services.json`                                     | 5 von 9 fehlt `seo.title` in 8 Sprachen                                                                                   |
| IglooPro           | Produkt-Value-Proposition + Spezifikationen                          | CTA-Rollenbruch je Sprache (§5.4)                                                                                         |
| Epigenetik-Hub     | „Die Ebene, die ein Schnelltest nicht abbildet“                      | in 8 Sprachen **englisch ausgeliefert**                                                                                   |
| Musterbefund × 6   | Panel-Titel aus `src/content/befunde/`                               | nur `de`/`en` vorhanden                                                                                                   |
| Artikel × 6        | Titel aus `articles.json`                                            | `fr`, `pt`, `da`, `nl`: 94 Sätze englisch                                                                                 |
| Consumer × 3       | „Support from within…“, „Daily Vitamin D3+K2…“                       | vollständig hartkodiert englisch                                                                                          |
| About              | Unternehmens-Lead + IVDR/CE-Aussage                                  | konsistent                                                                                                                |
| Support            | Support-Hero mit **Sales-CTA**                                       | Journey-Fehlzuordnung (§5.2)                                                                                              |
| S3 / Implantologie | fachliche deutsche Landingpage-H1                                    | hartkodiert, keine `t()`-Fähigkeit                                                                                        |

**Widersprüche und Duplikate**

1. **Hero-Slider doppelt geführt** — dieselben vier Slide-Texte stehen in `useHeroSlider.ts` als
   `t()`-Defaults **und** in `home.json` unter `hero.speed|economics|compliance|segments`. Zwei
   Pflegeorte für denselben sichtbaren Text (`CA-02`). `hero.dental|beauty|longevity` sind davon
   getrennte Segment-Varianten und **nicht** Teil des Sliders.
2. **„garantiert“ neben „keine Garantie“** — `home.hero.description` verspricht garantierte
   Einsatzbereitschaft, `legal.json` § 5.5 schließt Garantien ausdrücklich aus. Kein juristischer
   Widerspruch im engeren Sinn, aber eine Tonalitätskollision, die §11.1 berührt.
3. **`shop`-Namespace enthält Artikel-UI** — irreführender Name, aktiv geladen (`C-21`).
4. **Consumer-Kommentar widerspricht dem Decision Lock** — `App.tsx` 243–246 beschreibt die
   Consumer-Seiten als „nicht in Navigation/Sitemap, noindex, serverseitig passwortgeschützt“.
   Der Ist-Zustand ist das Gegenteil (Sitemap-Einträge in `server.ts:248–250`, kein `noindex`,
   keine Basic Auth) und der Zielzustand nach `DEC-RL-006` erst recht. → `OUTDATED`.

---

## 7. Formulare, Hilfetexte, Success- und Error-Copy (`ST04.1.3`)

| Formularstrecke        | Quelle                          | Labels/Hints | Validation | Success                           | Error    | Befund                                                                                                                   |
| ---------------------- | ------------------------------- | ------------ | ---------- | --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| Kontakt / Angebot      | `contact.json` `contact.form.*` | × 10 Keys    | × 10 Keys  | „Ihre Nachricht wurde gesendet“   | × 10     | **Mail-only-Semantik**; Formteil in 8 Sprachen englisch                                                                  |
| Support                | `support.json` `support.form.*` | × 10         | × 10       | „…Support-Anfrage wurde gesendet“ | × 10     | dieselbe Semantikfrage; Hero-CTA fehlzugeordnet                                                                          |
| ROI-Report (Lead)      | `home.json` `roi.*`             | × 10         | × 10       | × 10                              | × 10     | `RoiCalculatorSection.tsx:108` trägt ein **stale TODO** („Endpoint noch nicht live“), obwohl `/api/roi-report` existiert |
| Consumer Order         | `OrderForm.tsx` hartkodiert     | **nur `en`** | nur `en`   | nur `en`                          | nur `en` | „Something went wrong — please try again.“ als Roh-Fallback                                                              |
| Epigenetik-Inquiry     | `epigenetics.json` `contact.*`  | × 10 Keys    | × 10 Keys  | × 10 Keys                         | × 10     | in 8 Sprachen englisch; Feldoptionen/Fehler laut `_translationStatus` explizit EN-Fallback                               |
| VitD3-Spray-Bestellung | `vitd3spray.json`               | × 10         | × 10       | × 10                              | × 10     | vollständig übersetzt — **positiv geprüft**                                                                              |

**Übergreifende Befunde**

- **`errors.root.*` / `errors.segment.*` fehlen in 8 Sprachen** (`common.json`). Diese Keys speisen die
  Error-Boundary. In `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`, `cs` würde im Fehlerfall der rohe
  Key-String erscheinen (`I-06`).
- **Kein Formular verweist auf Chat** — geprüft, negativ. Der einzige Chat-Verweis ist `C-29`.
- **Success-Semantik** — „gesendet“ beschreibt einen Mailversand. Zielmodell ist Persistenz + CRM
  (`DEC-RL-009`, `CNT-15`). Die Copy behauptet damit ein Modell, das der Relaunch ausdrücklich verlässt.
- **Consent-Copy** vorhanden und lokalisiert (Kontakt, Support, ROI, Consumer); Aufbewahrungsfrist
  „bis zu 12 Monate“ ist konsistent über Kontakt und Support.

---

## 8. Downloads und Resources (`ST04.1.4`)

### 8.1 Katalog `src/content/downloads.json`

| Resource-ID         | Titel (hartkodiert)                        | Datei                     | Sprache | Format | Zugangsklasse        | Version/Datum | Existenz | Befund                               |
| ------------------- | ------------------------------------------ | ------------------------- | ------- | ------ | -------------------- | ------------- | -------- | ------------------------------------ |
| `im-de-igloo-pro`   | „Igloo Pro System Flyer (DE)“              | `igloo-pro-flyer.pdf`     | `de`    | PDF    | **nicht deklariert** | `2025-01-20`  | ✅       | Titel statt Translation Key (`CD-6`) |
| `im-vitd3-spray-de` | „Vitamin D3+K2 Spray – Produktflyer (DE)“  | `vitamin-d3-spray-de.pdf` | `de`    | PDF    | **nicht deklariert** | `2025-01-20`  | ✅       | wie oben                             |
| `im-vitd3-spray-en` | „Vitamin D3+K2 Spray – Product Flyer (EN)“ | `vitamin-d3-spray-en.pdf` | `en`    | PDF    | **nicht deklariert** | `2025-01-20`  | ✅       | wie oben                             |

**Leere Kategorie:** Das UI führt `techBrochures` („Tech-Broschüren“) als sichtbare Kategorie; der
Katalog enthält **0** Einträge dafür. Die Kategorie entsteht durch fehlende Daten, nicht durch eine
bewusste Aussage (§5.6 `CONTENT-ASSET-CONTRACT.md`, `IAD-06`).

**Fehlende Sprachvarianten:** 8 von 10 Sprachen haben keinen eigenen Produktflyer. Der Katalog
modelliert das nicht als Lücke — er kennt nur drei Einträge mit fest verbautem Sprachsuffix im Titel.

### 8.2 Epigenetik-Unterlagen `public/downloads/epigenetics/**`

| Bestand    | Anzahl | Befund                                                                                      |
| ---------- | ------ | ------------------------------------------------------------------------------------------- |
| `de/` PDFs | **17** | vollständig: Portfolio, 6 Analysen, Konditionen, Evidenz, 6 Musterbefunde, Parameter, Werte |
| `en/` PDFs | **9**  | Portfolio, 6 Analysen, Terms, Evidence — **keine Musterbefunde, keine Parameter/Werte**     |
| ZIPs       | **3**  | `Unterlagen_DE`, `Unterlagen_EN`, `Musterbefunde_DE`                                        |
| Root-PDFs  | **3**  | Katalogeinträge aus §8.1                                                                    |
| **Summe**  | **32** | Referenzintegrität geprüft: **29/29 Locale-Referenzen auflösbar, 0 verwaiste Dateien**      |

**Sprachzuordnung (gemessen, alle 10 Locales):**

| Sprache                                | `downloads.zipFile`      | `evidence.file`       | `samples.zipFile`           | 9 × `sheets[].file` | 6 × `samples.items[].file` |
| -------------------------------------- | ------------------------ | --------------------- | --------------------------- | ------------------- | -------------------------- |
| `de`                                   | `…Unterlagen_DE.zip`     | `de/08_Evidenz…`      | `…Musterbefunde_DE.zip`     | `de/…` ✅           | `de/…` ✅                  |
| `en`                                   | `…Unterlagen_EN.zip`     | `en/08_Evidence…`     | **`…Musterbefunde_DE.zip`** | `en/…` ✅           | **`de/…`**                 |
| `pl fr it es pt da nl cs` (**alle 8**) | **`…Unterlagen_EN.zip`** | **`en/08_Evidence…`** | **`…Musterbefunde_DE.zip`** | **`en/…`**          | **`de/…`**                 |

Zwei getrennte stille Fremdsprach-Fallbacks (`CA-27`, `CA-28`, `CD-2`):

1. **EN-Fallback für acht Sprachen** — die englischen Dateinamen stehen als übersetzbare Strings in
   den Locale-Dateien und sehen maschinell aus wie eine vorgenommene Übersetzung.
2. **DE-Fallback für alle zehn Sprachen bei den Musterbefunden** — auch die englische Seite liefert
   deutsche Musterbefund-PDFs und das deutsche Musterbefunde-ZIP. **Eine englische Musterbefund-Datei
   existiert nicht.** Dieser Fall ist in `I18N-CONTRACT.md` `ID-8` und `CD-2` bisher nicht abgebildet.

### 8.3 Verwaiste und doppelte Dateien

- **Verwaiste Downloads: keine.** Alle 32 Dateien sind referenziert.
- **Doppelte Ablage:** `src/assets/downloads/` enthält drei PDFs, die `public/downloads/` inhaltlich
  doppeln (`igloo-pro-flyer.pdf` sowie zwei Vitamin-D-Flyer unter abweichenden Dateinamen mit
  Leerzeichen und `(8)` im Namen). Von keiner Content-Schicht referenziert → `CD-7`, Owner **AP04 PT04.4**.
- **Kein Gating.** Jede Datei unter `public/downloads/` ist über eine statische URL erreichbar; das
  Downloads-UI wirbt ausdrücklich mit „Kostenlos & ohne Anmeldung“. Konsistent mit `CD-8`, aber
  `DEC-RL-014` verlangt mindestens einen gegateten Pfad → `C-32`.

---

## 9. Artikel, Events, Testimonials (`ST04.1.5`)

### 9.1 Artikel (6)

| ID                         | Slug                                                            | Kategorie      | Datum         | Sprachstand    |
| -------------------------- | --------------------------------------------------------------- | -------------- | ------------- | -------------- |
| `green_practice`           | `die-gruene-praxis`                                             | Sustainability | `28 Nov 2025` | 6/10 übersetzt |
| `invisible_patient`        | `der-unsichtbare-patient`                                       | Telemedicine   | `30 Nov 2025` | 6/10           |
| `five_minute_diagnosis`    | `die-5-minuten-diagnose`                                        | Economics      | `02 Dec 2025` | 6/10           |
| `ecosystem_of_rapid_tests` | `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` | Health Article | `25 Nov 2025` | 6/10           |
| `rapid_setup_formula`      | `die-performance-formel-effizienz-in-der-poc-diagnostik`        | Health Article | `25 Nov 2025` | 6/10           |
| `precision_point_of_care`  | `precision-in-point-of-care-the-key-to-patient-safety`          | Health Article | `25 Nov 2025` | 6/10           |

- `date`, `readTime` und `category` sind **englische Anzeigetexte in Schicht A** statt strukturierter
  Werte (`CD-4`, `CA-07`). Owner AP17 PT17.4.
- `fr`, `pt`, `da`, `nl` liefern je **94 englische Volltextsätze** in `articles.json`.
- Jeder Artikel trägt denselben kommerziellen Primär-CTA (`IAD-13`).
- `rapid_setup_formula` und `precision_point_of_care` haben **kein `sections[].image`** — Bildlücke.

### 9.2 Events (5 kommend, 4 kuratiert vergangen)

| ID                             | Datum              | Ort        | Status zum Stichtag 2026-08-24 |
| ------------------------------ | ------------------ | ---------- | ------------------------------ |
| `dentale_themenwelt`           | 2026-06-12 → 06-13 | Stuttgart  | **vergangen**                  |
| `dgi_summer_event`             | 2026-06-12 → 06-13 | Düsseldorf | **vergangen**                  |
| `nobel_biocare_dach_symposium` | 2026-06-18 → 06-20 | München    | **vergangen**                  |
| `kite_education`               | 2026-08-01 → 09-04 | Sylt       | laufend                        |
| `dgi_jahreskongress`           | 2026-11-27 → 11-28 | Hamburg    | kommend                        |

`EventsPage.tsx` leitet kommend/vergangen **korrekt aus ISO-Daten** ab (`splitEventsByDate`) — das
Datenmodell ist sauber (`CONTENT-ASSET-CONTRACT.md` §5.5). Content-seitig bleibt aber: von fünf
gepflegten Terminen sind drei abgelaufen, und `events.upcoming.eyebrow` trägt die feste Jahreszahl
„Upcoming · 2026“. **Zeitkritisches Launch-Item**, Owner AP04 mit AP18.
Zusatzbefund: `pl` und `cs` tragen zwei zusätzliche Plural-Keys (`hero.chip_events_few|many`) — das ist
korrekte slawische Pluralisierung, **keine** Paritätsverletzung.

### 9.3 Testimonials (5)

Alle fünf tragen `text: ''` in `src/data/testimonials.ts`; der reale Text liegt korrekt lokalisiert in
`home.json` unter `testimonials.<id>.text` (× 10, übersetzt). Das leere Feld ist ein **totes Feld** wie
`CD-5`, kein Mock. `martin_fischer` hat **kein Avatarbild**. Namen und Praxisangaben sind reale Dritte —
`SENSITIVE_REVIEW` im Sinne von Personenbezug, nicht im medizinischen Sinn.

---

## 10. Sensible und regulatorische Aussagen (`ST04.1.7`)

**Regel: nichts davon wird durch AP04 fachlich umformuliert.** Erfasst wird der Ist-Text, seine Quelle
und ob er im Zielsprachumfang verfügbar ist. Kein medizinischer Freigabeprozess wird eingeführt
(`AP04.md` §6.2).

| ID       | Aussage / Pflichthinweis                                                                              | Quelle                                                                    | Route(n)                                        | Sprachen heute       | Flag                   | Review Needed                                          |
| -------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ----------------------------------------------- | -------------------- | ---------------------- | ------------------------------------------------------ |
| **S-01** | `CV < 2 %` Präzisionsclaim                                                                            | 10 Locales (17–18 ×) · 7 Quelldateien · `structuredData.ts:242` · ROI-PDF | Home, Diagnostics, Services, IglooPro, Articles | **10/10**            | gelockt (`DEC-RL-008`) | **nein** — Claim bleibt unverändert                    |
| **S-02** | IVDR/CE-Konformität                                                                                   | `home`, `products`, `about`, `contact`, `services`                        | mehrere                                         | 10/10                | `SENSITIVE_REVIEW`     | nein — Bestandsaussage                                 |
| **S-03** | „garantierte Performance“, „LFT-Kompatibilitäts-Garantie“, „Garantie für Investitionssicherheit“      | `services.json` (6 Stellen), `articles.json` (4)                          | `/diagnostics/*`, `/articles/*`                 | 10/10                | `SENSITIVE_REVIEW`     | **ja** — Abgrenzung zu `DEC-RL-012`, §11.1             |
| **S-04** | „Ihr IglooPro ist in 3-5 Werktagen einsatzbereit – garantiert“                                        | `home.json` `hero.description`, `hero.dental.description`                 | `/`                                             | 10/10                | `SENSITIVE_REVIEW`     | **ja** — §11.1                                         |
| **S-05** | „Beratungswerkzeug, keine Diagnose — die Analysen ersetzen keine ärztliche Abklärung“                 | `epigenetics.json` `principle`                                            | `/epigenetics*`                                 | **2/10** (`de`,`en`) | **Pflichthinweis**     | **ja** — Lokalisierung ×8                              |
| **S-06** | „keine CE-gekennzeichneten In-vitro-Diagnostika“                                                      | `epigenetics.json` `sheets`-Bereich                                       | `/epigenetics/unterlagen`                       | **2/10**             | **Pflichthinweis**     | **ja** — Lokalisierung ×8                              |
| **S-07** | „Alle sechs Dokumente sind Musterbefunde: Werte, Genotypen und Angaben zur Person sind frei erfunden“ | `epigenetics.json` `samples.note`                                         | `/epigenetics`, Musterbefunde                   | **2/10**             | **Pflichthinweis**     | **ja** — Lokalisierung ×8; erfüllt `CA-36`             |
| **S-08** | „Ersetzen die Analysen eine ärztliche Diagnostik? Nein.“ (FAQ)                                        | `epigenetics.json` `faq`                                                  | `/epigenetics`                                  | **2/10**             | **Pflichthinweis**     | **ja**                                                 |
| **S-09** | Nahrungsergänzungs-Disclaimer („Kein Ersatz für eine abwechslungsreiche Ernährung…“)                  | `vitd3spray.json` `disclaimer`                                            | `/vitamin-d3-spray`                             | **10/10 übersetzt**  | **Pflichthinweis**     | nein — vollständig                                     |
| **S-10** | Consumer-Produktaussagen zu Vitamin D3/K2, Haut und Regeneration                                      | `SprayPage.tsx`, `MaskPage.tsx`, `DuoPage.tsx` (hartkodiert)              | `/consumer/*`                                   | **1/10** (`en`)      | **Health-Claim-nah**   | **ja** — B2C-Claims ohne Disclaimer-Äquivalent zu S-09 |
| **S-11** | Biologisches Alter / Epigenetik-Altersuhr-Aussagen                                                    | `src/content/befunde/*.json`                                              | `/epigenetics/musterbefund/*`                   | **2/10**             | `SENSITIVE_REVIEW`     | **ja** — Lokalisierung ×8                              |
| **S-12** | Gewährleistungsausschluss § 5.5, Exportklausel § 12.4                                                 | `legal.json`                                                              | `/terms`                                        | 10/10                | **Pflichthinweis**     | nein                                                   |
| **S-13** | ROI-PDF-Fußzeile „Unverbindliche Beispielrechnung… Keine Zusage von Umsatz oder Gewinn“               | `server/server.js:627`                                                    | ROI-Zustellung                                  | **1/10** (`de`)      | **Pflichthinweis**     | **ja** — Lokalisierung ×9                              |
| **S-14** | S3-Leitlinien- und Vitamin-D-Implantologie-Aussagen                                                   | `S3LeitliniePage.tsx`, `VitaminD3ImplantologyPage.tsx`                    | `/s3_leitlinie`, `/vitamin-d3-implantologie`    | 1/1 (`de`)           | `SENSITIVE_REVIEW`     | nein — deklariert einsprachig                          |

**Der schwerwiegendste Befund dieses Abschnitts:** `S-05` bis `S-08` und `S-11` sind
**Pflicht-/Abgrenzungshinweise der Epigenetik-Säule und in acht der zehn Sprachen nur auf Englisch
verfügbar.** Nach `MASTER-SCOPE.md` §1.2/13 müssen regulatorische Pflichthinweise sichtbar bleiben;
ein englischer Hinweis auf einer polnischen Seite erfüllt das nicht. Das ist ein **Launch-Blocker**,
kein Nice-to-have.

**Nicht gefunden (negativ geprüft):** keine Rückmigration des Claims auf `CV < 5 %`; keine echten
Patienten-, Kunden- oder Leaddaten in Content oder Assets; keine Secrets in Content-Dateien.

---

## 11. Explizit nicht zu übernehmende Copy (`ST04.1.8`)

### 11.1 Garantie-/„garantierte Performance“-Band

**`DEC-RL-012`:** Das **site-weite Band** mit „garantierter Performance“ kehrt nicht zurück und wird
nicht ersetzt.

**Befund:** Auf der Baseline existiert **kein Band-Bauteil**. Es gibt keine Komponente
`*Band*`/`*Banner*` außer `CookieBanner.tsx`, und in `App.tsx`/`Layout` wird global nichts dergleichen
gerendert. Das Band ist auf `feat/home-leadmagnet` bereits nicht vorhanden.

**Was existiert, ist etwas anderes:** verstreute Garantie-**Formulierungen** in Fließtexten —
`S-03` (10 Stellen in `services.json`/`articles.json`) und `S-04` (2 Stellen in `home.json`), je × 10
Sprachen.

**Bewertung, ohne den Lock neu zu verhandeln:**

- Das **Band** ist nicht vorhanden → `DEC-RL-012` ist strukturell erfüllt. Kein Wiedereinführen.
- Die **Fließtext-Garantien** sind kein Band. Sie fallen nicht automatisch unter den Lock, sind aber
  `SENSITIVE_REVIEW` und stehen in Spannung zu `legal.json` § 5.5.
- **PT04.1 entscheidet das nicht.** Ob `S-03`/`S-04` umformuliert werden, ist eine Content-Entscheidung
  für PT04.3 in Abstimmung mit den Owner-APs (AP11/AP13/AP17) — und keine, die AP04 fachlich erfindet
  (`AP04.md` §3.1: kein neues Garantieversprechen formulieren).

**Kein neues Garantieversprechen wird formuliert. Kein Ersatzband wird gebaut.**

### 11.2 Chat-/HiHuman-Copy — `LEGACY_REMOVE`

| Fundstelle                             | Inhalt                                                                        | Zielzustand                |
| -------------------------------------- | ----------------------------------------------------------------------------- | -------------------------- |
| `common.json` `chat.*` (8 Keys × 10)   | „PolarisDX Concierge“, Status „Online“, Placeholder, Fehler-/Unavailable-Copy | nicht übernehmen           |
| `common.json` `chat.welcome_prototype` | **„Unser Chatbot ist noch nicht aktiv…“** — sichtbarer Platzhalter × 10       | nicht übernehmen           |
| `ChatWidget.tsx`                       | lädt `https://widget.hihuman.co.uk/bundle.js`, global in `App.tsx:225`        | Entfernung: AP06/AP23/AP26 |
| `server.ts` CSP 435–447                | HiHuman in `script-src`, `connect-src`, `frame-src`                           | Entfernung: AP26           |
| `server/server.js` 492–534             | `/api/chat` Echo-Mock mit deutschen Antworten + Teams-/OpenAI-Roadmap         | Entfernung: AP22           |

`DEC-RL-007`. **PT04.1 markiert, entfernt nicht.** Die Copy-Seite (`common.chat.*`) gehört zur
AP04-Zuständigkeit; Widget, CSP und Endpunkt gehören AP06/AP22/AP23/AP26 (`IAD-08`).

### 11.3 Backlog-Bestand — `BACKLOG_NOT_LAUNCH`, nicht reaktivieren

| Artefakt                              | Bestand                                   | Bewertung                                                                                                    |
| ------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `casestudies.json`                    | × 10 Sprachen, 32 Keys, **unregistriert** | wird nie geladen; nur `FeaturedCaseStudy.tsx` konsumiert sie, und die Komponente wird **nirgends gerendert** |
| `FeaturedCaseStudy.tsx`               | verlinkt `/casestudys/32reasons`          | tote Route; Komponente nicht eingebunden                                                                     |
| `Header.tsx:83`, `useSearch.ts:56–58` | auskommentierte Case-Study-Einträge       | bewusst deaktiviert, so belassen                                                                             |
| Deal-/Voucher-Copy                    | **nicht auffindbar**                      | negativ geprüft — existiert auf der Baseline nicht                                                           |
| Shop-Copy                             | **existiert nicht**                       | siehe Korrektur unten                                                                                        |

**Korrektur einer dokumentierten Schuld.** `CONTENT-ASSET-CONTRACT.md` `CD-10` und
`I18N-CONTRACT.md` `D-28` führen `shop.json` als „registriert, aber nie gelesen“. Die Messung
widerspricht dem: `shop.json` enthält **keine Shop-Copy**, sondern Artikel-UI-Strings (`shop.home`,
`shop.articles`, `shop.readMore`, `shop.articleNotFound`, `shop.backToArticles`) und wird von
`ArticlesIndexPage.tsx` (3 ×) und `ArticlePage.tsx` (4 ×) **aktiv geladen und gerendert**. Der
Namespace ist ein **Namens-Missverständnis, kein Shop-Backlog-Artefakt** — er darf weder entfernt noch
als reaktivierbarer Shop behandelt werden (`C-21`). Ein Umbenennen ist Namespace-Arbeit und damit
**Einzeleigentum von AP08** (`I18N-CONTRACT.md` M-01), nicht AP04.

`DEC-RL-015` bleibt unangetastet: nichts davon wird als Launch-Content aktiviert.

---

## 12. Consumer-x10-Gap (`ST04.1.13`)

**Ziel:** drei Familien × 10 Sprachen, indexierbar, ohne EN-Zwang (`DEC-RL-006`, `REST-03`, `I-10`, `S-09`).
**Ist:** drei Familien × **1** Sprache (`en`), vollständig hartkodiert.

| Content-Element             | Spray                                    | Masks            | Duo                         | Ist | Ziel |
| --------------------------- | ---------------------------------------- | ---------------- | --------------------------- | --- | ---- |
| Hero (Eyebrow, H1, Sub)     | hartkodiert `en`                         | hartkodiert `en` | hartkodiert `en`            | 1   | 10   |
| Value Proposition           | hartkodiert `en`                         | hartkodiert `en` | hartkodiert `en`            | 1   | 10   |
| Product Copy / Specs        | hartkodiert `en`                         | hartkodiert `en` | hartkodiert `en`            | 1   | 10   |
| Order-CTA-Labels            | „Order 12-pack“ / „Buy 12-pack“          | „Buy 5-pack“     | „Shop Duo“ / „Shop the Duo“ | 1   | 10   |
| Order-Form-Copy (10 Felder) | `OrderForm.tsx` `en`                     | dito             | dito                        | 1   | 10   |
| Mengenoptionen              | 4 englische Freitextwerte                | 4                | 4                           | 1   | 10   |
| Validation                  | `en`                                     | `en`             | `en`                        | 1   | 10   |
| Success / Error             | `en`, Roh-Fallback-Text                  | dito             | dito                        | 1   | 10   |
| FAQ                         | `en`                                     | `en`             | `en`                        | 1   | 10   |
| Legal / Hinweise            | **kein Disclaimer-Äquivalent zu `S-09`** | dito             | dito                        | 0   | 10   |
| SEO-Title / -Description    | hartkodiert `en` im `SEOHead`            | hartkodiert `en` | hartkodiert `en` **+ TODO** | 1   | 10   |
| OG-/Produktbild             | **fehlt** (`CD-9`)                       | **fehlt**        | **fehlt**                   | 0   | 3    |

**Umfang:** 7 Dateien, 2 884 Zeilen, **0 × `useTranslation`**. 27 fehlende Locale-Varianten
(3 Familien × 9 Sprachen).

**Reihenfolgeregel (`I18N-CONTRACT.md` M-03):** erst `t()`-fähig machen (**AP08 PT08.2**, mit AP21),
dann die zehn Sprachen füllen (**AP04 PT04.3.5**). Umgekehrt geht es nicht. PT04.3 kann die
Consumer-Sprachlücke daher **nicht allein durch Locale-Dateien schließen**, solange die Seiten
hartkodiert sind — das ist beim PT04.3-Gate zu berücksichtigen.

**Weitere Consumer-Blocker, andere Owner:** `/en/`-Zwangsredirect (`server.ts:522–534`, `IAD-01`, AP21/AP10) ·
Sitemap nur `/en/*` (`SD-3`, AP09) · keine interne Verlinkung (`IAD-19`, AP06/AP07) · veralteter
`App.tsx`-Kommentar (§6, `OUTDATED`).

---

## 13. Epigenetik-Gap (`ST04.1.14`)

| Bereich                    | Content-Sprachen                | Asset-Sprachen                        | Befund                                                                |
| -------------------------- | ------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| Hub `/epigenetics`         | 10/10 Keys · **2/10 übersetzt** | ZIP: `de`+`en`, 8 × EN-Fallback       | 196 englische Sätze je Nicht-`de`/`en`-Sprache                        |
| Grundlagen                 | wie Hub                         | —                                     | wie Hub                                                               |
| Studienlage                | wie Hub                         | Evidence-PDF: `de`+`en`, 8 × EN       | Pflichthinweis `S-06` englisch in 8 Sprachen                          |
| Unterlagen                 | wie Hub                         | 9 Sheets: `de`+`en`, 8 × EN           | zentrale Download-Seite der Säule                                     |
| Musterbefunde × 6 (Seiten) | **2/10** (`de`,`en`)            | 6 PDFs **nur `de`**                   | `IAD-03`; PDF-Fallback auf `de` **auch für `en`**                     |
| Befund-Metadaten           | `meta.ts` sprachneutral         | 12 Bilder (`@1x`/`@2x`) sprachneutral | Modell sauber; `BefundSprachen` ist **auf `de`/`en` typfixiert**      |
| Inquiry-Copy               | 10/10 Keys · 2/10 übersetzt     | —                                     | `_translationStatus`: „panel context, field options and field errors“ |
| Alt-/Asset-Metadaten       | `samples.imgAlt` über `t()`     | —                                     | einziger Epigenetik-Alt-Text ist lokalisiert — positiv                |

**Zwei Lücken, die keine reine Übersetzungsarbeit sind:**

1. **`BefundSprachen` ist strukturell zweisprachig.** `src/content/befunde/meta.ts` deklariert
   `interface BefundSprachen { de: Befund; en: Befund }`. Ein `pl`-Befund lässt sich damit nicht
   abbilden, ohne den Typ zu ändern. Das ist eine **Modell-**, keine Content-Lücke (`CA-18`) und
   gehört **AP16** — PT04.3 darf sie nicht durch Umtypisieren „nebenbei“ lösen.
2. **Es existieren keine englischen Musterbefund-PDFs.** Die Lücke lässt sich nicht durch Umhängen
   einer Referenz schließen; sie verlangt neue Assets → PT04.4 bzw. externe Erstellung.

---

## 14. Platzhalter, Mocks, Veraltetes, Redundanzen

### 14.1 Platzhalter und Mocks (`ST04.1.3`, Vorbereitung PT04.3.1)

| ID       | Fundstelle                                                                    | Art                  | Nutzersichtbar                                  | Zielzustand                                             |
| -------- | ----------------------------------------------------------------------------- | -------------------- | ----------------------------------------------- | ------------------------------------------------------- |
| **PM-1** | `common.json` `chat.welcome_prototype` × 10                                   | `PLACEHOLDER`        | **ja**                                          | entfernen mit der Chat-Copy (`DEC-RL-007`)              |
| **PM-2** | `server/server.js` `/api/chat` Echo-Agent                                     | `MOCK`               | **ja** (Antworttexte)                           | entfernen — AP22/AP26                                   |
| **PM-3** | `DuoPage.tsx:72` `TODO: confirm final meta title with Claire (Wave-2 review)` | `PLACEHOLDER`-Marker | nein (Kommentar), Titel darunter aber ungeklärt | Titel bestätigen, TODO auflösen — PT04.3                |
| **PM-4** | `RoiCalculatorSection.tsx:108` `TODO … Endpoint noch nicht live`              | veralteter Marker    | nein                                            | Kommentar auflösen — `/api/roi-report` existiert        |
| **PM-5** | `downloads.json` Kategorie `techBrochures` ohne Einträge                      | leere Kategorie      | **ja**                                          | Kategorie füllen oder als bewusst leer ausweisen — AP19 |
| **PM-6** | `OrderForm.tsx:175` `'Something went wrong — please try again.'`              | Roh-Fallback         | **ja**                                          | lokalisierbare Fehlercopy — AP21/AP04                   |
| **PM-7** | `services.tsx` `description: ''` (9 ×)                                        | totes Feld           | nein                                            | Feld entfernen — `CD-5` präzisiert, AP13                |
| **PM-8** | `testimonials.ts` `text: ''` (5 ×)                                            | totes Feld           | nein                                            | Feld entfernen — Text liegt korrekt in Schicht B        |

**Negativ geprüft:** kein „Lorem ipsum“, kein „Coming soon“, kein „TBD“, kein „Dummy“ in
`public/locales/**`. (Portugiesische Treffer auf `todos` = „alle“ sind Falschpositive.)

### 14.2 Veraltete und redundante Aussagen (`ST04.1.6`)

| ID       | Befund                                                                                                                           | Klasse             | Owner       |
| -------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| **OR-1** | `App.tsx` 243–246 beschreibt Consumer als „unlisted, noindex, passwortgeschützt“ — widerspricht `DEC-RL-006` und dem Ist-Zustand | `OUTDATED`         | AP04 · AP21 |
| **OR-2** | Hero-Slider-Texte doppelt in `useHeroSlider.ts` und `home.json`                                                                  | `REDUNDANT`        | AP04 · AP11 |
| **OR-3** | Drei von fünf „kommenden“ Events sind abgelaufen; `upcoming.eyebrow` mit fester Jahreszahl                                       | `OUTDATED`         | AP04 · AP18 |
| **OR-4** | Alter CTA-Wortlaut „Beratung buchen“ als Standard (15 × Locale + 10 × Quelltext-Default + 3 × hartkodiert)                       | `OUTDATED`         | AP04 · AP08 |
| **OR-5** | Legacy-Route `/services/dental` im Content von `VitaminD3ImplantologyPage.tsx` (`IAD-18`)                                        | `OUTDATED`         | AP10 · AP20 |
| **OR-6** | Tote Route `/casestudys/32reasons` in `FeaturedCaseStudy.tsx`                                                                    | `OUTDATED`         | Backlog     |
| **OR-7** | `RoiCalculatorSection.tsx:108` behauptet einen nicht existierenden Endpunkt-Zustand                                              | `OUTDATED`         | AP04        |
| **OR-8** | Doppelte PDF-Ablage `src/assets/downloads/` ↔ `public/downloads/` (`CD-7`)                                                       | `REDUNDANT`        | AP04 PT04.4 |
| **OR-9** | `shop`-Namespace trägt Artikel-UI unter irreführendem Namen                                                                      | `REDUNDANT` (Name) | AP08        |

---

## 15. Launch-Blocker aus PT04.1

Nach Owner sortiert. **AP04-eigene Blocker** sind in PT04.2–PT04.4 abzuarbeiten; die übrigen werden
übergeben, nicht vorgezogen.

### 15.1 AP04-eigene Blocker

| #         | Blocker                                                                                                     | Ziel-PT                                          |
| --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **LB-1**  | Epigenetik-Content in 8 Sprachen englisch (196 Sätze/Sprache) inkl. Pflichthinweisen                        | PT04.3.6                                         |
| **LB-2**  | Regulatorische Pflichthinweise `S-05`–`S-08`, `S-11` nur `de`/`en`                                          | PT04.3.3/.6                                      |
| **LB-3**  | 21 fehlende Keys in 8 Sprachen (`common` 7, `epigenetics` 9, `services` 5)                                  | PT04.3.4                                         |
| **LB-4**  | Artikel-Volltexte in `fr`, `pt`, `da`, `nl` englisch (je 94 Sätze)                                          | PT04.3.7                                         |
| **LB-5**  | Kontakt-/Inquiry-Formcopy in 8 Sprachen englisch                                                            | PT04.3.4                                         |
| **LB-6**  | CTA-Standard nicht hergestellt — 15 Locale-Stellen + 10 Quelltext-Defaults                                  | PT04.3.8                                         |
| **LB-7**  | CTA-Rollenbruch in 8 Sprachen bei `products.hero.cta_order` / `cta_bottom.button`                           | PT04.3.8                                         |
| **LB-8**  | Support-Seite trägt Sales-CTA statt `SUPPORT_REQUEST`                                                       | PT04.3.8                                         |
| **LB-9**  | Chat-Copy und Chat-Platzhalter × 10 in `common.json`                                                        | PT04.3.1                                         |
| **LB-10** | Success-Semantik „gesendet“ statt Persistenz-/CRM-Semantik                                                  | PT04.3.1/.9                                      |
| **LB-11** | Systemmail-/Autoresponder-Copy und ROI-PDF nur deutsch                                                      | PT04.3.9                                         |
| **LB-12** | Zeitkritische Event-Copy (3 abgelaufene Termine, feste Jahreszahl)                                          | PT04.3.1                                         |
| **LB-13** | Consumer-Content 1/10 Sprachen                                                                              | PT04.3.5 (nach AP08 PT08.2)                      |
| **LB-14** | Epigenetik-Asset-Sprachzuordnung: 8 × EN-Fallback, 10 × DE-Fallback bei Musterbefunden                      | PT04.4.5                                         |
| **LB-15** | Keine englischen Musterbefund-PDFs vorhanden                                                                | PT04.4.5 · ggf. `BLOCKED_CONTENT_ASSET_APPROVAL` |
| **LB-16** | Consumer ohne produktspezifische OG-Bilder                                                                  | PT04.4.3                                         |
| **LB-17** | 9 von 21 `alt`-Attributen als feste Literale, nicht lokalisierbar (7 × `t()`, 4 × dynamisch, 1 × dekorativ) | PT04.4.1                                         |
| **LB-18** | Doppelte PDF-Ablage `src/assets/downloads/`                                                                 | PT04.4.6                                         |
| **LB-19** | Downloads-Katalog ohne Sprachvarianten, mit leerer Kategorie                                                | PT04.3.10 · AP19                                 |

### 15.2 Übergabe-Blocker anderer Owner

`C-13` Befund-Typmodell auf `de`/`en` fixiert → **AP16** · Consumer-Hartkodierung `t()`-fähig machen →
**AP08 PT08.2** mit AP21 · `/en/`-Zwangsredirect → **AP21/AP10** (`IAD-01`) · Consumer-Sitemap ×10 →
**AP09** (`SD-3`) · Gating/Gate-Copy → **AP19 PT19.3/PT19.4**, **AP22** (`IAD-07`, `C-32`) ·
Epigenetik-Inquiry als eigene Strecke → **AP15/AP22** (`IAD-11`) · Chat-Widget, CSP, `/api/chat` →
**AP06/AP22/AP23/AP26** (`IAD-08`) · Legal-Indexierungspolicy → **AP20** (`IAD-05`) ·
Artikel-Datumsfelder → **AP17** (`CD-4`) · Service-Felder/Icon-JSX → **AP13** (`CD-5`) ·
`shop`-Namespace-Benennung → **AP08** · Structured-Data-Beschreibung fest deutsch → **AP09/AP14**.

---

## 16. Owner-AP-Zuordnung

| Owner         | Übernimmt aus dieser Matrix                                                           |
| ------------- | ------------------------------------------------------------------------------------- |
| **AP04**      | LB-1 … LB-19 — Content-, Locale- und Asset-Readiness                                  |
| **AP05**      | Design-System — **keine** Zeile dieser Matrix                                         |
| **AP06**      | Navigation, Chat-Widget-Entfernung, Footer-Einstiege                                  |
| **AP07**      | Suchindex-Abdeckung (`IAD-15`), toter `sports`-Treffer (`IAD-04`)                     |
| **AP08**      | i18n-Plattform, `NAMESPACES`, Consumer/German-only `t()`-fähig machen, Paritäts-Guard |
| **AP09**      | SEO-Ausgabe, Sitemap ×10, Structured Data, OG-Einbindung                              |
| **AP10**      | Route Registry, echte 301, Legacy-Link-Ziele                                          |
| **AP11**      | Homepage-Sections, Hero-Slider-Redundanz, ROI-Section                                 |
| **AP12/AP13** | Diagnostics-Hub und 9 Service-Detailseiten, `services.tsx`-Datenmodell                |
| **AP14**      | IglooPro-Strecke, `CV < 2 %` über alle Kanäle, PDF-Versionen                          |
| **AP15/AP16** | Epigenetik-Säule, Inquiry, Befund-Datenmodell und -Sprachen                           |
| **AP17**      | Artikel-Metadaten, Datumsfelder, kontextabhängiger Artikel-CTA                        |
| **AP18**      | Event-Datenmodell, Archivlogik                                                        |
| **AP19**      | Resource Center, ein Ressourcenmodell, Zugangsklassen, **Gating**                     |
| **AP20**      | About/Contact/Support/Legal, Legal-Indexierung, German-only-Seiten                    |
| **AP21**      | Consumer ×10, produktspezifische OG-Bilder, `/en/`-Zwang                              |
| **AP22**      | Lead-Plattform, Persistenz + CRM, `/api/chat`-Entfernung                              |
| **AP23**      | Consent/Tracking                                                                      |
| **AP26**      | CSP-Bereinigung, Secret-/Datenscan                                                    |
| **AP27**      | automatisierte Guards: Key-Parität, Asset-Existenz, CTA-Konsistenz, Placeholder-Scan  |

---

## 17. Was PT04.1 ausdrücklich nicht getan hat

- **Keine Datei außerhalb von `building-docs/` geändert.** Keine Quelldatei, keine Locale-Datei, kein
  Asset. Verifiziert über `git status --porcelain`.
- Keine Übersetzung erzeugt, keine Copy umgeschrieben, kein Asset produziert oder entfernt.
- Keine Content-Governance, kein Owner-/Review-Zyklus, kein CMS, kein Übersetzungs-Workflow.
- Keine Design-, Navigations-, Such-, Routing-, SEO-, Lead- oder Tracking-Implementierung.
- Keine medizinische oder regulatorische Aussage neu formuliert oder fachlich bewertet.
- Kein Decision Lock geöffnet, gelockert oder neu interpretiert.
- Keine zweite Content-Matrix, kein zweiter State, keine parallele ID-Systematik.

---

## 18. Was PT04.2 ausdrücklich nicht getan hat

- **Keine Datei außerhalb von `building-docs/` geändert** — 0 Änderungen an `src/**`, `public/**`,
  `server.ts`, `server/**`, `scripts/**` und jeder Konfiguration (§21.1).
- Kein Design-System, keine Komponenten-API, keine Varianten, kein Layout, kein Token — **AP05**
  bleibt unberührt und ungestartet.
- Keine Seitenlayouts, keine Routen, kein `SEOHead`-Umbau, kein Header/Footer, keine Suche.
- **Kein Gate, kein Entitlement, kein Lead-Backend** — `GATED` ist modelliert, nicht gebaut
  (`CT-09`, `AP19 PT19.3`/`AP22`).
- Kein CTA-Wortlaut geändert — §20.3 ist Sollzuordnung für PT04.3, keine Ausführung.
- Keine Übersetzung erzeugt, keine Copy umgeschrieben, kein Asset angefasst.
- Kein zweites CTA-Vokabular und keine zweite Rollen-Taxonomie — §20.1 gruppiert ausschließlich die
  bestehenden IA-Rollen aus `IA-INVENTORY.md` §8.3.
- Keine fachliche, medizinische oder regulatorische Aussage neu formuliert; kein Freigabeprozess,
  keine Content-Governance, kein CMS.
- Kein Decision Lock geöffnet oder neu interpretiert.

---

## 19. Content-Typen-Standard (AP04 PT04.2)

**Stand PT04.2 (2026-08-24).** Standardisiert wird **Content-Semantik** — welche Bestandteile ein
Content-Typ mindestens hat, welche Regeln für ihn gelten und woher seine Inhalte kommen dürfen.

**Ausdrücklich nicht standardisiert:** visuelle Darstellung, Komponenten-API, Layout, Spacing,
Typografie, Varianten-Props. Das ist **AP05** und wird hier nicht vorweggenommen. Ein Content-Typ
schreibt kein Bauteil vor; mehrere Bauteile dürfen denselben Content-Typ rendern.

**Zehn verbindliche Typen `CT-01`–`CT-10`** (Master-Scope AP04 PT04.2, `AP04.md` §8.2).

### 19.0 Für alle Content-Typen geltende Regeln

| Regel     | Inhalt                                                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CT-R1** | Jeder nutzersichtbare Text eines Content-Typs ist **lokalisierbar** und in allen zehn Zielsprachen abbildbar (`CA-11`, `I-07`).                   |
| **CT-R2** | Fachliche Identität, Reihenfolge, Dateinamen, Datums- und Zahlenwerte gehören **nicht** in den lokalisierten Text (`CA-10`).                      |
| **CT-R3** | Kein Content-Typ enthält **Garantieversprechen** oder ein Äquivalent zum entfernten Garantie-Band (`DEC-RL-012`).                                 |
| **CT-R4** | Kein Content-Typ enthält **Chat-Copy** oder verweist auf einen Chat-Kanal (`DEC-RL-007`).                                                         |
| **CT-R5** | Keine fachliche, medizinische oder regulatorische Aussage wird **neu erfunden**. Quelle ist ausschließlich vorhandener kanonischer Content (§10). |
| **CT-R6** | Jeder Content-Typ ist **einer Schicht** zuordenbar (`CA-01`): Text → B, Identität/Struktur → A, große Feature-Daten → C, Datei → D.               |
| **CT-R7** | Backlog-Bestand (`DEC-RL-015`) wird durch keinen Content-Typ reaktiviert.                                                                         |
| **CT-R8** | Ein Content-Typ **erzwingt keine Route**. Welche URL existiert, entscheidet `ROUTING-CONTRACT.md`.                                                |

---

### 19.1 `CT-01` — Hero

**Zweck:** Einstieg einer Seite: Wer ist angesprochen, worum geht es, was ist der nächste Schritt.

| Slot               | Pflicht  | Schicht | Regel                                                            |
| ------------------ | -------- | ------- | ---------------------------------------------------------------- |
| `eyebrow`          | optional | B       | Kategorie/Einordnung, kein zweiter Titel                         |
| `h1`               | **ja**   | B       | genau **eine** H1 je Seite                                       |
| `valueProposition` | **ja**   | B       | ein Satz: Nutzen für die benannte Zielgruppe                     |
| `supportingCopy`   | optional | B       | 1–3 Sätze Präzisierung                                           |
| `primaryCta`       | **ja**   | B + A   | genau **ein** `CT-06` mit dem CTA-Typ aus `IA-INVENTORY.md` §8.4 |
| `secondaryCta`     | optional | B + A   | höchstens **einer**                                              |
| `proof`            | optional | —       | Referenz auf `CT-02`, nicht eigener Freitext                     |
| `audience`         | **ja**   | A       | genau ein Wert aus `IA-INVENTORY.md` §8.3 Zielgruppen-Vokabular  |

**Regeln.** Keine Garantieformulierung (`CT-R3`). Keine drei gleichrangigen CTAs. Der Hero
wiederholt keine Proof-Kennzahl im Fließtext, die schon als `CT-02` geführt wird.

**Ist-Abgleich.** Homepage, Diagnostics, IglooPro, Epigenetik, Artikel-Index, Consumer und die beiden
deutschen Landingpages tragen bereits eine Hero-Struktur, die dieses Modell erfüllt. **Zwei Abweichungen:**
(a) `home.hero.description` enthält eine Garantieformulierung → `S-04`, `CT-R3`;
(b) die vier Slider-Slides führen ihre Hero-Texte doppelt (§6 Nr. 1) → `CT-R2`/`CA-02`.

---

### 19.2 `CT-02` — Nutzen (Benefit) und Beleg (Proof)

**Zwei getrennte Typen in einem Abschnitt, weil sie nie vermischt werden dürfen.**

| Teil        | Beantwortet                          | Pflichtslots                                     |
| ----------- | ------------------------------------ | ------------------------------------------------ |
| **Benefit** | _Was gewinnt der Nutzer?_            | `title`, `description`, `audience`               |
| **Proof**   | _Warum ist die Aussage glaubwürdig?_ | `claim`, `proofKind`, `source`, optional `value` |

**`proofKind` — geschlossenes Vokabular:**

`EVIDENCE` (Studien-/Evidenzbezug) · `METRIC` (Kennzahl) · `TESTIMONIAL` (namentliche Praxisstimme) ·
`PARTNER_CERT` (Partner, Zertifikat, Konformität) · `EXPLANATION` (fachliche Herleitung).

**Regeln.**

- **Ein Proof ohne `source` ist kein Proof.** `source` benennt die kanonische Herkunft (Datensatz,
  Dokument, Zertifikat, Testimonial-ID) — nicht „intern bekannt".
- `METRIC`-Werte liegen als strukturierter Wert in Schicht A und werden zur Laufzeit formatiert
  (`CA-07`). Ein vorformatierter Anzeigetext ist kein Metrikwert.
- **Keine neue wissenschaftliche Behauptung.** `CT-R5` gilt hier am striktesten.
- Ein Benefit darf keinen Proof behaupten, den es nicht gibt, und ein Proof wiederholt keinen Benefit.

**Ist-Abgleich.** Vorhandene Proofs und ihre Einordnung: `CV < 2 %` → `METRIC`, Quelle ist die gelockte
Produktentscheidung `DEC-RL-008` (`S-01`). IVDR/CE → `PARTNER_CERT` (`S-02`). Fünf Testimonials →
`TESTIMONIAL`, Quelle `src/data/testimonials.ts` + `home.testimonials.<id>` (§9.3). Epigenetik-Evidenz →
`EVIDENCE`, Quelle `08_Evidenz_Studienlage_PolarisDX.pdf` (`S-11`). **Nicht standardkonform:**
„garantierte Performance" und „LFT-Kompatibilitäts-Garantie" (`S-03`) — sie treten als Proof auf,
tragen aber keine `source` und kollidieren mit `CT-R3`; Klärung in PT04.3 mit AP13/AP17.

---

### 19.3 `CT-03` — Feature / Leistung

**Zweck:** beschreibt, **was** eine Leistung oder ein Produkt fachlich ist und kann — nicht, was der
Nutzer davon hat (`CT-02`) und nicht, was er tun soll (`CT-06`).

| Slot          | Pflicht  | Schicht | Regel                                                   |
| ------------- | -------- | ------- | ------------------------------------------------------- |
| `featureId`   | **ja**   | A       | stabil, übersetzungsunabhängig (`CA-05`)                |
| `title`       | **ja**   | B       | —                                                       |
| `description` | **ja**   | B       | fachliche Beschreibung                                  |
| `scope`       | optional | B       | was ausdrücklich **nicht** enthalten ist                |
| `specs[]`     | optional | A       | `{ key, value, unit }` **strukturiert**, nicht als Satz |
| `relations[]` | optional | A       | Verweise über IDs, nie über Titel oder Pfade (`CA-08`)  |

**Regeln.** Keine CTA- und keine Benefit-Duplikation im Feature-Text. Specs sind maschinenlesbar;
eine Angabe wie „3–15 Minuten" gehört als `{min:3, max:15, unit:'min'}` nach A und wird lokalisiert
dargestellt. Anwendbar auf die neun Diagnostics-Services, IglooPro, das Vitamin-D3-Spray und die sechs
Epigenetik-Analysen.

**Ist-Abgleich.** `src/data/services.tsx` erfüllt `featureId` und `relations[]` bereits (9 stabile IDs,
`relatedArticleIds`). Offen: `description: ''` ist ein totes Feld (`PM-7`), `specs[]` existiert nicht —
Spezifikationen stehen heute als Fließtext in `products.json`. **Beides Owner AP13/AP14**, nicht AP04.

---

### 19.4 `CT-04` — Prozess / Steps

| Slot          | Pflicht  | Schicht | Regel                                                    |
| ------------- | -------- | ------- | -------------------------------------------------------- |
| `processId`   | **ja**   | A       | eine Journey, ein Prozess                                |
| `order`       | **ja**   | A       | ganzzahlig, stabil — **nie** aus Übersetzungsreihenfolge |
| `stepTitle`   | **ja**   | B       | kurz                                                     |
| `description` | **ja**   | B       | —                                                        |
| `expectation` | optional | B + A   | Zeit-/Erwartungshinweis; Zeitwerte strukturiert in A     |

**Regeln.** **Kein erfundener Prozessschritt** — jeder Schritt entspricht einem real existierenden
Ablauf. Consumer-, B2B- und Epigenetik-Prozesse sind **bewusst verschieden** und werden nicht auf einen
gemeinsamen Ablauf gezwungen. Ein `expectation`-Wert wie „3–5 Werktage" ist eine Erwartung, **keine
Zusage** (`CT-R3`).

**Ist-Abgleich.** `home.steps.*` (B2B-Ablauf) und `epigenetics.workflow.*` (Probenweg) erfüllen das
Modell inhaltlich; die Reihenfolge ergibt sich heute aus der Array-Position im Locale-JSON statt aus
einem `order`-Feld in Schicht A. Kein Consumer-Prozess vorhanden.

---

### 19.5 `CT-05` — FAQ

| Slot       | Pflicht | Schicht | Regel                                              |
| ---------- | ------- | ------- | -------------------------------------------------- |
| `faqId`    | **ja**  | A       | stabil, für spätere Structured Data referenzierbar |
| `question` | **ja**  | B       | **echte Nutzerfrage**, keine Marketing-Überschrift |
| `answer`   | **ja**  | B       | vollständige Antwort, ohne CTA-Ersatz              |
| `scope`    | **ja**  | A       | zu welcher Seite/Familie die Frage gehört          |

**Regeln.** Eine FAQ-Antwort enthält **keine unbelegte regulatorische Aussage** (`CT-R5`) — regulatorische
Inhalte gehören nach `CT-08` und werden dort referenziert, nicht in der Antwort neu formuliert. Keine
versteckte H1. **Die spätere FAQ-Structured-Data-Ausgabe ist AP09** (`S-12`: kein FAQ-Schema ohne
sichtbare FAQ) — PT04.2 implementiert nichts davon.

**Ist-Abgleich.** FAQ-Bestände in `home.faq`, `services.*.faq`, `products`, `vitd3spray`,
`epigenetics.faq` (8 Fragen). Die epigenetische FAQ enthält mit `S-08` einen echten Pflichthinweis in
Antwortform — er ist zusätzlich als `CT-08` zu führen, damit er nicht mit der FAQ verschwindet.

---

### 19.6 `CT-06` — CTA

Siehe **§20** — die CTA-Taxonomie ist eigenständig, weil sie an Decision Locks gebunden ist.

| Slot      | Pflicht | Schicht | Regel                                                                       |
| --------- | ------- | ------- | --------------------------------------------------------------------------- |
| `ctaType` | **ja**  | A       | genau ein Wert aus §20.1                                                    |
| `label`   | **ja**  | B       | in allen zehn Sprachen dieselbe **Rolle**, nicht zwingend dieselbe Wortwahl |
| `target`  | **ja**  | A       | Route oder Anker; locale-sicher (`IA-INVENTORY.md` §10.14)                  |
| `role`    | **ja**  | A       | Conversion-Rolle aus `IA-INVENTORY.md` §8.3                                 |

**Kernregel `CT-06-K`.** Die **Rolle** eines CTA ist sprachinvariant. Ein Key, der in `de` eine
Angebotsanfrage auslöst, darf in keiner anderen Sprache eine Bestellung ankündigen. Verletzt in
`products.hero.cta_order` und `products.cta_bottom.button` (§5.4).

---

### 19.7 `CT-07` — Download / Resource

**Owner des technischen Ressourcenmodells ist AP19** (`CONTENT-ASSET-CONTRACT.md` §5.6). PT04.2 legt
fest, welche **Content-Merkmale** eine Ressource tragen muss, damit AP04 sie auf Launch-Readiness prüfen kann.

| Slot              | Pflicht  | Schicht | Regel                                                                           |
| ----------------- | -------- | ------- | ------------------------------------------------------------------------------- |
| `resourceId`      | **ja**   | A       | stabil, unabhängig von Dateiname, Sprache und Version (`CA-05`, `CA-25`)        |
| `titleKey`        | **ja**   | B-Ref   | Translation Key — **kein** hartkodierter Titel (`CA-10`)                        |
| `descriptionKey`  | **ja**   | B-Ref   | —                                                                               |
| `category`        | **ja**   | A       | leere Kategorien sind **deklariert**, nicht Datenmangel                         |
| `assetByLanguage` | **ja**   | A       | je beworbener Sprache **eine** Datei **oder** `languageNeutral: true` (`CA-26`) |
| `format`          | **ja**   | A       | PDF, ZIP, …                                                                     |
| `fileSize`        | optional | A       | **maschinell ermittelt**, nicht handgepflegt (`CA-29`)                          |
| `version`         | **ja**   | A       | Fassungen unterscheidbar (`CA-24`)                                              |
| `accessClass`     | **ja**   | A       | `PUBLIC` **oder** `GATED` (`CA-30`) — siehe §19.7.1                             |
| `cta`             | **ja**   | —       | `CT-06` mit `DOWNLOAD_PUBLIC` bzw. `GATE_SUBMIT`                                |

#### 19.7.1 `PUBLIC` und `GATED` — verbindliche Trennung

| Klasse     | Bedeutung                                                                            | Zulässige CTA     |
| ---------- | ------------------------------------------------------------------------------------ | ----------------- |
| **PUBLIC** | direkt abrufbar, kein Lead erforderlich, normale statische Auslieferung              | `DOWNLOAD_PUBLIC` |
| **GATED**  | Freigabe erst nach geprüfter Berechtigung; Auslieferung referenziert die Resource-ID | `GATE_SUBMIT`     |

**`CT-07-K1`:** Eine Ressource ohne geprüftes Gate ist `PUBLIC` — auch wenn sie unverlinkt ist
(`CA-31`, `CM-05`). **`CT-07-K2`:** Eine fehlende Sprachfassung ist eine **Lücke im Modell**, nie ein
eingetragener fremdsprachiger Dateiname (`CA-27`, `CA-28`).

**Ist-Abgleich.** **Alle 35 heutigen Ressourcen sind `PUBLIC`** — es existiert kein Gate (`CD-8`).
`resourceId` existiert nur für die drei Katalogeinträge; die 29 Epigenetik-Dateien haben keine
Ressourcen-Identität, nur Pfade in Übersetzungsdateien (`CD-2`). `titleKey`, `version`, `accessClass`
und `assetByLanguage` fehlen durchgehend. **Kein Gating wird hier implementiert** — `GATED` ist
modelliert und wartet auf **AP19 PT19.3/PT19.4** (`DEC-RL-014`, `C-32`).

---

### 19.8 `CT-08` — Disclaimer / Regulatory Notice

**Der strengste Content-Typ.** Er trägt Aussagen, die rechtlich oder fachlich gefordert sind.

| Slot         | Pflicht | Schicht | Regel                                                                                                      |
| ------------ | ------- | ------- | ---------------------------------------------------------------------------------------------------------- |
| `noticeId`   | **ja**  | A       | stabil und referenzierbar (Zuordnung zu §10 `S-xx`)                                                        |
| `text`       | **ja**  | B       | **in allen zehn Sprachen** — ein EN-Fallback erfüllt die Pflicht nicht                                     |
| `scope`      | **ja**  | A       | wo der Hinweis erscheinen **muss**, nicht wo er erscheinen darf                                            |
| `noticeKind` | **ja**  | A       | `MEDICAL_LIMITATION` · `REGULATORY_STATUS` · `SYNTHETIC_DATA` · `PRODUCT_LEGAL` · `CALCULATION_DISCLAIMER` |

**Regeln.**

- **`CT-08-K1` — sichtbar, nicht versteckt.** Ein Pflichthinweis ist normaler, lesbarer Seiteninhalt.
  Keine Nur-Tooltip-, Nur-Accordion- oder Kleinstschrift-Strategie. Er wird durch
  Conversion-Optimierung nicht verdrängt (`MASTER-SCOPE.md` §1.2 Nr. 13).
- **`CT-08-K2` — vom Marketingtext getrennt.** Ein Disclaimer steht nie als Nebensatz in einem
  Benefit- oder Hero-Text.
- **`CT-08-K3` — nur kanonische Inhalte.** Der Text stammt aus der vorhandenen Quelle. AP04 formuliert
  keine neue fachliche Aussage und richtet **keinen medizinischen Freigabeprozess** ein (`AP04.md` §6.2).
- **`CT-08-K4` — Sprachvollständigkeit ist Teil des Typs.** Ein Hinweis, der nur in `de`/`en` existiert,
  ist **nicht** erfüllt, sondern offen.

**Ist-Abgleich der bestehenden Pflichthinweise:**

| `noticeId` | Quelle (§10) | `noticeKind`             | Sprachen heute | Status                                              |
| ---------- | ------------ | ------------------------ | -------------- | --------------------------------------------------- |
| `RN-01`    | `S-05`       | `MEDICAL_LIMITATION`     | 2/10           | **offen** (`CT-08-K4`)                              |
| `RN-02`    | `S-06`       | `REGULATORY_STATUS`      | 2/10           | **offen**                                           |
| `RN-03`    | `S-07`       | `SYNTHETIC_DATA`         | 2/10           | **offen**                                           |
| `RN-04`    | `S-08`       | `MEDICAL_LIMITATION`     | 2/10           | **offen**                                           |
| `RN-05`    | `S-09`       | `PRODUCT_LEGAL`          | **10/10**      | **erfüllt** — Referenzfall                          |
| `RN-06`    | `S-12`       | `PRODUCT_LEGAL`          | 10/10          | erfüllt                                             |
| `RN-07`    | `S-13`       | `CALCULATION_DISCLAIMER` | 1/10           | **offen**                                           |
| `RN-08`    | `S-10`       | `PRODUCT_LEGAL`          | **0/10**       | **fehlt** — Consumer hat kein Äquivalent zu `RN-05` |

`RN-05` (`vitd3spray.disclaimer`) ist der Beleg, dass der Typ im Repository bereits sauber erfüllbar
ist: eigener Slot, vom Marketingtext getrennt, in zehn Sprachen übersetzt. Er ist das Muster für
`RN-01`–`RN-04`, `RN-07` und `RN-08` in PT04.3.

---

### 19.9 `CT-09` — Lead-Magnet-Gate

**Content-seitige Definition. Keine Gate-, Entitlement- oder Backend-Implementierung** — die gehört
**AP19 PT19.3** mit **AP22** (`CD-8`, `IAD-07`).

| Slot                  | Pflicht | Schicht | Regel                                                                                    |
| --------------------- | ------- | ------- | ---------------------------------------------------------------------------------------- |
| `resourceValue`       | **ja**  | B       | was der Nutzer bekommt — konkret, nicht „exklusive Insights"                             |
| `contentExpectation`  | **ja**  | B       | Umfang/Form des Dokuments                                                                |
| `fieldRationale`      | **ja**  | B       | warum die verlangten Felder nötig sind (Datenminimierung, `MASTER-SCOPE.md` §1.2 Nr. 17) |
| `consentNote`         | **ja**  | B       | Einwilligung getrennt von Marketing-Consent (`LEAD-DATA-CONTRACT.md` §5.2)               |
| `submitCta`           | **ja**  | —       | `CT-06` mit `GATE_SUBMIT`                                                                |
| `successCopy`         | **ja**  | B       | siehe `CT-10-K1`                                                                         |
| `errorCopy`           | **ja**  | B       | recoverable und non-recoverable getrennt                                                 |
| `deliveryExpectation` | **ja**  | B       | **was** wann **wie** ankommt                                                             |

**Regeln.**

- **`CT-09-K1` — kein Mail-only-Versprechen.** Die Copy behauptet nicht, ein Erfolg sei ein
  Mailversand. Fachlicher Erfolg ist die **persistente Annahme** des Leads (`DEC-RL-009`, `LD-01`).
- **`CT-09-K2` — kein Chat** als alternativer Kanal (`CT-R4`).
- **`CT-09-K3` — die Copy verspricht kein Gate, das es nicht gibt.** Solange keine geprüfte
  Berechtigung existiert, wird die Ressource nicht als „geschützt" beworben (`CA-31`, `CM-05`).
- **`CT-09-K4`** — der zugehörige Lead-Typ ist `content_download`; die **endgültige Benennung
  entscheidet AP22** (`LEAD-DATA-CONTRACT.md` §5.1). AP04 erfindet keinen Bezeichner.

**Ist-Abgleich.** `CT-09` existiert im Repository **nicht** (`C-32`, `MISSING`). Der ROI-Report ist die
einzige Strecke, die dem Muster schon nahekommt: Wertversprechen, Consent, Submit, Success, Zustellung —
sie ist heute aber `PUBLIC` ohne Gate. `DEC-RL-014` verlangt mindestens einen gegateten Pfad; **welche**
Ressource das wird, entscheidet AP19 PT19.4.

---

### 19.10 `CT-10` — Form- / Success- / Error-Copy

| Slot                  | Pflicht  | Schicht | Regel                                                      |
| --------------------- | -------- | ------- | ---------------------------------------------------------- |
| `label`               | **ja**   | B       | benennt das Feld, nicht die Aufgabe                        |
| `helpText`            | optional | B       | erklärt, **warum** oder **wie** — nicht das Label doppelt  |
| `placeholder`         | optional | B       | **nur** wenn er ein Format zeigt; **nie** als Label-Ersatz |
| `validation`          | **ja**   | B       | pro Regel eine konkrete, handlungsleitende Meldung         |
| `submit`              | **ja**   | —       | `CT-06` mit dem CTA-Typ der Journey                        |
| `loading`             | **ja**   | B       | —                                                          |
| `success`             | **ja**   | B       | siehe `CT-10-K1`                                           |
| `errorRecoverable`    | **ja**   | B       | sagt, **was der Nutzer tun kann**                          |
| `errorNonRecoverable` | **ja**   | B       | sagt, **wie es weitergeht** — kein Sackgassentext          |
| `privacyNote`         | **ja**   | B       | Zweck und Aufbewahrung; Marketing-Consent **separat**      |

**Regeln.**

- **`CT-10-K1` — Success beschreibt den fachlichen Systemzustand.** Nach `DEC-RL-009` und `LD-01` ist
  Erfolg die **persistente Annahme der Anfrage**, nicht ein Mailversand. Formulierungen der Art
  „Ihre Nachricht wurde gesendet" behaupten ein Mail-only-Modell, das der Relaunch ausdrücklich
  verlässt. Zulässige Semantik: **Anfrage angenommen und registriert** + Rückmeldeerwartung.
- **`CT-10-K2` — kein technischer Text im Nutzerkanal.** Keine Stacktraces, keine HTTP-Codes, kein
  roher englischer Fallback-Satz.
- **`CT-10-K3` — Fehler sind konkret.** „Etwas ist schiefgelaufen" ist nur als _non-recoverable_
  Ausnahme zulässig, nie als Standardvalidierung.
- **`CT-10-K4` — vollständig in zehn Sprachen**, einschließlich der Fehlerzustände der App-Shell
  (`common.errors.*`).

**Ist-Abgleich.** Sechs Formularstrecken (§7). `vitd3spray` ist vollständig lokalisiert und erfüllt den
Typ am nächsten. Offen: Success-Semantik in Kontakt und Support (`CT-10-K1`), `OrderForm.tsx:175`
roher englischer Fehlertext (`CT-10-K2`/`K4`), `common.errors.root|segment` fehlen in acht Sprachen
(`CT-10-K4`), Consumer-Formcopy einsprachig.

---

## 20. CTA-Taxonomie (AP04 PT04.2)

### 20.1 Die acht CTA-Content-Typen und ihre Bindung an die IA-Rollen

AP04 führt **kein zweites CTA-Vokabular** ein. Die acht vom Master-Scope geforderten CTA-Content-Typen
sind eine **Gruppierung** der zwölf CTA-Rollen aus `IA-INVENTORY.md` §8.3. Bei Abweichung gilt §8.3.

| CTA-Content-Typ           | IA-Rolle(n)                          | Standard-Wortlaut `de`       | Lead-Typ (`LEAD-DATA-CONTRACT.md` §5.1) | Lock             |
| ------------------------- | ------------------------------------ | ---------------------------- | --------------------------------------- | ---------------- |
| **`GENERAL_SALES`**       | `QUOTE_REQUEST`                      | **„Angebot anfragen"**       | `general_inquiry`                       | **`DEC-RL-013`** |
| **`ORDER`**               | `ORDER`                              | Bestell-Wortlaut je Produkt  | `consumer_order`                        | `DEC-RL-006`     |
| **`EPIGENETICS_INQUIRY`** | `EPIGENETICS_INQUIRY`                | eigener Inquiry-Wortlaut     | `epigenetics_inquiry`                   | **`DEC-RL-011`** |
| **`DOWNLOAD`**            | `DOWNLOAD_PUBLIC` · `GATE_SUBMIT`    | Download- bzw. Gate-Wortlaut | — bzw. `content_download`               | `DEC-RL-014`     |
| **`SUPPORT`**             | `SUPPORT_REQUEST`                    | Support-Wortlaut             | `support`                               | —                |
| **`CONTACT`**             | `CONTACT` · `EVENT_CONTACT`          | Kontakt-Wortlaut             | —                                       | —                |
| **`ROI`**                 | `ROI_CALCULATE`                      | ROI-Wortlaut                 | `roi_report`                            | —                |
| **`CONTENT_NEXT_STEP`**   | `VIEW_DETAIL` · `VIEW_SAMPLE_REPORT` | kontextabhängig              | —                                       | —                |

`NONE` (bewusst kein CTA) ist **kein** CTA-Content-Typ, sondern die dokumentierte Abwesenheit eines
solchen — gültig für Legal (`P-21`–`P-23`) und als Sekundär-CTA von Consumer und Support.

### 20.2 Verbindliche Regeln

| Regel        | Inhalt                                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`CTA-01`** | **`GENERAL_SALES` heißt „Angebot anfragen"** und wird in allen zehn Sprachen als _Angebotsanfrage_ lokalisiert (`DEC-RL-013`).                                                                  |
| **`CTA-02`** | **Spezialisierte Journeys werden nicht auf `GENERAL_SALES` normalisiert.** `ORDER`, `EPIGENETICS_INQUIRY`, `SUPPORT` und `DOWNLOAD` behalten ihren eigenen Wortlaut und ihren eigenen Lead-Typ. |
| **`CTA-03`** | **Consumer-Bestellung ist von der B2B-Anfrage getrennt** — eigener Typ, eigener Lead-Typ, eigene Journey (`DEC-RL-006`, `REST-03`).                                                             |
| **`CTA-04`** | **Epigenetik-Inquiry ist von `GENERAL_SALES` und von `CONTACT` getrennt** (`DEC-RL-011`); sie ist kein allgemeiner Contact-Lead.                                                                |
| **`CTA-05`** | **Support trägt keinen Sales-CTA** (`IA-INVENTORY.md` §8.4 P-04, `IA-06`).                                                                                                                      |
| **`CTA-06`** | **Ein CTA-Typ je Key.** Ein Schlüssel trägt in allen zehn Sprachen dieselbe Rolle (`CT-06-K`).                                                                                                  |
| **`CTA-07`** | **Ein primärer CTA je Seite.** Sekundär-CTAs sind zulässig, aber nachgeordnet und begrenzt.                                                                                                     |
| **`CTA-08`** | **Artikel erhalten keinen kommerziellen Einheits-CTA** — der nächste Schritt folgt dem Thema (`IA-INVENTORY.md` §8.2 T6, `IAD-13`).                                                             |
| **`CTA-09`** | **`GATE_SUBMIT` wird erst beworben, wenn ein Gate existiert** (`CT-09-K3`).                                                                                                                     |
| **`CTA-10`** | **Kein Chat-CTA** (`DEC-RL-007`) und **kein Garantie-CTA** (`DEC-RL-012`).                                                                                                                      |

### 20.3 Zielzuordnung je bestehendem CTA-Key

Verbindliche Sollzuordnung für PT04.3. Der Wortlaut wird in PT04.3 hergestellt, nicht hier.

| Key                                               | CTA-Typ (Soll)        | Ist                             | Handlung in PT04.3                         |
| ------------------------------------------------- | --------------------- | ------------------------------- | ------------------------------------------ |
| `home.hero.cta`                                   | `GENERAL_SALES`       | „Beratung buchen" ×10           | Wortlaut ×10 auf Angebotsanfrage           |
| `home.igloo_widget.help_cta`                      | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `home.final_cta.cta_primary`                      | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `home.roi.cta_consult`                            | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `home.steps.cta`                                  | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `home.seo.description`, `home.roi.hint`           | Fließtext             | enthält alten CTA-Wortlaut      | Wortlaut angleichen                        |
| `downloads.hero_cta`                              | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `downloads.link_contact`                          | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `downloads.cta_button`                            | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `products.help.cta`                               | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `contact.form.submit.consultation`                | `GENERAL_SALES`       | „Beratung buchen" ×10           | wie oben                                   |
| `contact.form.submit.quote`                       | `GENERAL_SALES`       | konform ×10                     | unverändert                                |
| `products.hero.cta_order`                         | `GENERAL_SALES`       | `de` konform, **8× `ORDER`**    | Rolle in 8 Sprachen korrigieren (`CTA-06`) |
| `products.cta_bottom.button`                      | `GENERAL_SALES`       | `de` konform, **8× abweichend** | wie oben                                   |
| `support.hero.cta_primary`                        | **`SUPPORT`**         | `de` Sales-CTA                  | auf Support-Rolle zurückführen (`CTA-05`)  |
| `articles.index.hero_primary_cta`                 | `CONTENT_NEXT_STEP`   | „Beratung buchen"               | kontextueller nächster Schritt (`CTA-08`)  |
| `articles.detail.primary_cta`                     | `CONTENT_NEXT_STEP`   | Einheits-Sales-CTA              | wie oben — mit AP17                        |
| `epigenetics.hero.ctaQuote`                       | `EPIGENETICS_INQUIRY` | `de`/`en` ok, **8× englisch**   | lokalisieren                               |
| `epigenetics.contact.title`                       | `EPIGENETICS_INQUIRY` | 8× englisch                     | lokalisieren                               |
| `epigenetics.links.contact`                       | `EPIGENETICS_INQUIRY` | 8× englisch                     | lokalisieren                               |
| `home.hero.cta_roi`, `articles.detail` sekundär   | `ROI`                 | konform                         | unverändert                                |
| `downloads.downloadBtn`, Epigenetik-Sheets        | `DOWNLOAD` (`PUBLIC`) | konform                         | unverändert                                |
| `epigenetics.analyses.sampleBtn`, `befund.pdfCta` | `CONTENT_NEXT_STEP`   | konform, Asset fehlt            | Asset in PT04.4                            |
| `events` CTA                                      | `CONTACT`             | konform                         | unverändert                                |
| `about` CTA                                       | `CONTACT`             | konform                         | unverändert                                |
| Consumer „Order/Buy/Shop"-Labels                  | `ORDER`               | nur `en`, hartkodiert           | lokalisierbar machen (AP08) + ×10          |
| `legal` Seiten                                    | `NONE`                | konform                         | unverändert                                |
| **kein Key**                                      | `GATE_SUBMIT`         | **existiert nicht**             | AP19 PT19.4 — **nicht** in AP04            |

**Kein CTA-Wortlaut wurde in PT04.2 geändert.** Die Tabelle ist Sollzuordnung, keine Ausführung.

---

## 21. Standardisierungsstatus je Content-Einheit (AP04 PT04.2)

Fortschreibung von §4 um die von PT04.2 geforderten Felder. **Standardization** bewertet, ob die
Einheit dem Typmodell aus §19 entspricht — **nicht**, ob ihr Inhalt launchfertig ist (das ist §4).

| Content-ID | Content-Typen (§19)                      | Standardization             | CTA-Typ (§20)                      | Public/Gated | Sensitive | Verbleibende Lücke                                                       | Owner AP         |
| ---------- | ---------------------------------------- | --------------------------- | ---------------------------------- | ------------ | --------- | ------------------------------------------------------------------------ | ---------------- |
| **C-01**   | CT-01, CT-02, CT-04, CT-05, CT-06        | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | ja        | Garantieformulierung `CT-R3`; Slider-Redundanz; CTA-Wortlaut             | AP04 · AP11      |
| **C-02**   | CT-01, CT-02                             | `STANDARDIZED`              | `CONTACT`                          | —            | teils     | 1–2 EN-Sätze                                                             | AP04 · AP20      |
| **C-03**   | CT-10, CT-06                             | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | nein      | `CT-10-K1` Success-Semantik; Formcopy 8× englisch                        | AP04 · AP20      |
| **C-04**   | CT-10, CT-06                             | `NOT_STANDARDIZED`          | **`SUPPORT`**                      | —            | nein      | `CTA-05` verletzt; `CT-10-K1`                                            | AP04 · AP20      |
| **C-05**   | CT-03, CT-06                             | `STANDARDIZED`              | `CONTACT`                          | —            | nein      | zeitkritische Inhalte, feste Jahreszahl                                  | AP04 · AP18      |
| **C-06**   | CT-07, CT-06                             | `NOT_STANDARDIZED`          | `DOWNLOAD` (`PUBLIC`)              | **PUBLIC**   | nein      | `resourceId`/`titleKey`/`version`/`accessClass`/`assetByLanguage` fehlen | AP04 · AP19      |
| **C-07**   | CT-01, CT-05, CT-06                      | `MODEL_OK_CONTENT_GAP`      | `CONTENT_NEXT_STEP`                | —            | teils     | `CTA-08` verletzt; Datum/Lesezeit unstrukturiert (`CD-4`)                | AP04 · AP17      |
| **C-08**   | CT-01, CT-02, CT-03, CT-05, CT-06        | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | ja        | `CT-06-K` Rollenbruch ×8; `specs[]` unstrukturiert                       | AP04 · AP14      |
| **C-09**   | CT-01, CT-02, CT-06                      | `STANDARDIZED`              | `CONTENT_NEXT_STEP`                | —            | ja        | keine                                                                    | AP04 · AP12      |
| **C-10**   | CT-03, CT-02, CT-05, CT-06               | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | **ja**    | Proof ohne `source` (`S-03`); 5 × `seo.title` fehlen                     | AP04 · AP13      |
| **C-11**   | CT-01, CT-02, CT-03, CT-05, CT-08, CT-06 | `MODEL_OK_CONTENT_GAP`      | `EPIGENETICS_INQUIRY`              | —            | **ja**    | `CT-08-K4` `RN-01`–`RN-04`; 196 EN-Sätze                                 | AP04 · AP15      |
| **C-12**   | CT-03, CT-02, CT-07, CT-08, CT-06        | `MODEL_OK_CONTENT_GAP`      | `EPIGENETICS_INQUIRY` · `DOWNLOAD` | **PUBLIC**   | **ja**    | `CT-08-K4`; `CT-07` Ressourcenmerkmale fehlen                            | AP04 · AP15/AP19 |
| **C-13**   | CT-02, CT-08, CT-06                      | `MODEL_OK_CONTENT_GAP`      | `EPIGENETICS_INQUIRY`              | **PUBLIC**   | **ja**    | Typmodell auf `de`/`en` fixiert → **AP16**; `RN-03` ×8                   | AP04 · AP16      |
| **C-14**   | CT-01, CT-02, CT-03, CT-05, CT-08, CT-06 | `NOT_STANDARDIZED`          | `ORDER`                            | —            | teils     | hartkodiert; **`RN-08` fehlt vollständig**                               | AP04 · AP21      |
| **C-15**   | wie C-14                                 | `NOT_STANDARDIZED`          | `ORDER`                            | —            | teils     | wie C-14                                                                 | AP04 · AP21      |
| **C-16**   | wie C-14                                 | `NOT_STANDARDIZED`          | `ORDER`                            | —            | teils     | wie C-14 + offener Meta-Titel (`PM-3`)                                   | AP04 · AP21      |
| **C-17**   | CT-10, CT-06                             | `NOT_STANDARDIZED`          | `ORDER`                            | —            | nein      | `CT-10-K2`/`K4`; Mengenoptionen Wert = Anzeigetext                       | AP04 · AP21      |
| **C-18**   | CT-08                                    | `STANDARDIZED`              | `NONE`                             | —            | **ja**    | 2 EN-Sätze                                                               | AP04 · AP20      |
| **C-19**   | CT-01, CT-03, CT-05, CT-08, CT-06        | **`STANDARDIZED`**          | `GENERAL_SALES`                    | —            | **ja**    | keine — `RN-05` ist der Referenzfall für `CT-08`                         | AP04 · AP14      |
| **C-20**   | CT-10, CT-06                             | `MODEL_OK_CONTENT_GAP`      | —                                  | —            | nein      | `common.errors.*` fehlen ×8 (`CT-10-K4`)                                 | AP04 · AP08      |
| **C-21**   | CT-10                                    | `STANDARDIZED`              | `CONTENT_NEXT_STEP`                | —            | nein      | irreführender Namespace-Name → AP08                                      | AP08             |
| **C-22**   | CT-02 (`TESTIMONIAL`)                    | `STANDARDIZED`              | `NONE`                             | —            | teils     | 1 fehlendes Avatar; `text:''` totes Feld                                 | AP04 · AP11      |
| **C-23**   | CT-07                                    | `NOT_STANDARDIZED`          | `DOWNLOAD` (`PUBLIC`)              | **PUBLIC**   | **ja**    | `CT-07-K2` verletzt (stille Fremdsprach-Fallbacks)                       | AP04 · AP19/AP08 |
| **C-24**   | CT-01, CT-02, CT-05, CT-06               | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | **ja**    | CTA hartkodiert ohne `t()`                                               | AP04 · AP20      |
| **C-25**   | CT-01, CT-02, CT-06                      | `MODEL_OK_CONTENT_GAP`      | `GENERAL_SALES`                    | —            | **ja**    | Legacy-Linkziel (`IAD-18`)                                               | AP04 · AP20      |
| **C-26**   | CT-10                                    | `NOT_STANDARDIZED`          | —                                  | —            | nein      | `CT-10-K1`/`K4`; nur `de`                                                | AP04 · AP08/AP22 |
| **C-27**   | CT-07, CT-08                             | `NOT_STANDARDIZED`          | `DOWNLOAD` (`PUBLIC`)              | **PUBLIC**   | **ja**    | `RN-07` nur `de`; Gate-Kandidat, heute ungegatet                         | AP04 · AP19/AP22 |
| **C-28**   | CT-10                                    | `MODEL_OK_CONTENT_GAP`      | `NONE`                             | —            | nein      | wie C-20                                                                 | AP04 · AP08      |
| **C-29**   | — (`LEGACY_REMOVE`)                      | **außerhalb der Taxonomie** | **keiner** (`CTA-10`)              | —            | nein      | Entfernung der Copy in PT04.3                                            | AP04 · AP06/AP23 |
| **C-30**   | — (`MOCK`)                               | **außerhalb der Taxonomie** | **keiner**                         | —            | nein      | Entfernung durch AP22/AP26                                               | AP22 · AP26      |
| **C-31**   | — (`BACKLOG_NOT_LAUNCH`)                 | **außerhalb der Taxonomie** | **keiner** (`CT-R7`)               | —            | nein      | unverändert lassen                                                       | — (Backlog)      |
| **C-32**   | **CT-09**, CT-07 (`GATED`), CT-10        | `MISSING`                   | `DOWNLOAD` (`GATE_SUBMIT`)         | **GATED**    | nein      | Typ definiert (§19.9), Ressource und Gate offen                          | AP19 · AP22      |
| **C-33**   | CT-10, CT-06                             | `MODEL_OK_CONTENT_GAP`      | `EPIGENETICS_INQUIRY`              | —            | **ja**    | 8× englisch; eigene Strecke offen (`IAD-11`)                             | AP04 · AP15/AP22 |

**Bilanz über 33 Einheiten.** `STANDARDIZED` **7** · `MODEL_OK_CONTENT_GAP` **13** ·
`NOT_STANDARDIZED` **9** · `MISSING` **1** · außerhalb der Taxonomie **3**.
`PUBLIC` **5** Ressourcen-Einheiten (`C-06`, `C-12`, `C-13`, `C-23`, `C-27`) · `GATED` **1** (geplant,
`C-32`) — die Trennung ist damit modelliert und maschinell benennbar, ohne dass ein Gate implementiert
wurde. **Alle zehn Content-Typen `CT-01`–`CT-10` sind definiert; jede der 33 Einheiten trägt eine
Typzuordnung oder ist ausdrücklich als außerhalb der Taxonomie geführt.**

### 21.1 Warum PT04.2 keine Schema-Mutation vorgenommen hat

`AP04.md` §8.13 **erlaubt** gezielte Content-/Datenstruktur-Änderungen, „wenn sie unmittelbar
erforderlich sind". Geprüft und bewusst **nicht** ausgeführt:

| Denkbare Mutation                                              | Warum nicht in PT04.2                                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Ressourcenschema mit `accessClass`/`assetByLanguage` einführen | Modell-Eigentum liegt bei **AP19 PT19.1/PT19.2** (`CONTENT-ASSET-CONTRACT.md` §5.6, `IAD-14`) |
| `specs[]` in `services.tsx`/`products` strukturieren           | Service-/Produktdatenmodell ist **AP13/AP14** (`CD-5`)                                        |
| Artikel-`date`/`readTime` auf ISO umstellen                    | **AP17 PT17.4** (`CD-4`)                                                                      |
| `BefundSprachen` auf zehn Sprachen erweitern                   | **AP16** (§13)                                                                                |
| Hero-Slider-Konstanten konsolidieren                           | berührt Homepage-Sections → **AP11**; Redundanz ist als `OR-2` dokumentiert                   |
| `shop`-Namespace umbenennen                                    | `NAMESPACES` ist **Einzeleigentum von AP08** (`I18N-CONTRACT.md` M-01)                        |
| Tote Felder `description: ''` / `text: ''` entfernen           | Datenschicht-Eigentum AP13 bzw. AP11; kein Launch-Effekt                                      |

Keine dieser Änderungen ist erforderlich, um die zehn Content-Typen **zu definieren** — nur um sie
später technisch zu erzwingen, und dieses Erzwingen gehört den genannten Owner-APs und **AP27**
(Guards). PT04.2 hätte sie nur unter Verletzung von `AGENT-CONTRACT.md` §1.6 vorziehen können.
**Ergebnis: 0 Änderungen an `src/**`, `public/**`, `server\*/**` und jeder Konfiguration.\*\*

---

## 22. Status dieses Dokuments

**Angelegt durch AP04 PT04.1** (2026-08-24), fortgeschrieben durch **PT04.2** (§18–§21,
Content-Typen), **PT04.3** (§23, Launch-Readiness) und **AP04-RECOVERY** (2026-08-25, §24
Deferred-Gate-Register).

**Stand nach der Recovery.** PT04.3 endete am 2026-08-24 mit `BLOCKED_CONTENT_APPROVAL` (§23.3). Die
Recovery hat die Ursache als **Vertragsfehler in `AP04.md`** identifiziert — AP04 führte den
AP08-Scope als eigene Closure-Voraussetzung — und die sechs Blocker in **acht Deferred Gates**
`DG-01`–`DG-07` mit eindeutigen Owner-APs überführt (§24). **Keiner der Blocker ist geschlossen oder
als erledigt markiert**; sie sind offen, ownergebunden und werden als Launch-Blocker weitergetragen.

**PT04.3 ist damit erneut ausführbar** und bleibt der nächste Task. `AP04.md` §11.0 hält das
Gate-Modell, §11.1 den Kurzindex.

**Lesereihenfolge bei Widerspruch:** §26 › §25 › §24 › §23 › §21 › §4.

**AP04 ist am 2026-08-25 abgeschlossen: Closure `PASS` (32/32, `C04-01`–`C04-32`).**
PT04.1–PT04.4 alle `PASS` (§23, §25, §26), AP04-RECOVERY `PASS` (§24).

### Was dieser Status bedeutet — und was nicht

**AP04 Closure `PASS` heißt NICHT, dass die Website in zehn Sprachen launchfertig ist.**

Es heißt: die **AP04-eigene** Content- und Asset-Readiness ist abgeschlossen, und **10 Deferred Gates**
(`DG-01`–`DG-09`, §24 und §26.8) bleiben **offen, ownergebunden und werden weitergetragen** — davon
**9 Launch-Blocker**. Sie sind ausdrücklich **keine** AP05-Aufgaben.

| Zielbereich | Target | Ist | Gate | Owner |
|---|---|---|---|---|
| Consumer × 10 | REQUIRED | **DEFERRED** | `DG-03`, `DG-06a` | AP08 PT08.2 · AP21 |
| Epigenetik × 10 | REQUIRED | **DEFERRED** | `DG-01` | Fachfreigabe · AP15 · AP08 PT08.3.1 |
| Musterbefunde × 10 | REQUIRED | **DEFERRED** | `DG-02` | AP16 · AP08 PT08.3.2 |
| Artikel × 10 | REQUIRED | **DEFERRED** | `DG-05` | Fachfreigabe · AP17 |
| Systemmail × 10 | REQUIRED | **DEFERRED** | `DG-04` | AP22 · AP08 PT08.5 |
| Sprachabhängige Assets | REQUIRED | **DEFERRED** | `DG-07`, `DG-08`, `DG-09` | AP08 PT08.6 · AP19 · AP21 · AP22 |
| Consumer-Pflichthinweis | zu klären | **DEFERRED** | `DG-06b` | AP20 / AP21 · Fachfreigabe |

**Keiner dieser Bereiche ist `READY`.** False-Ready-Aussagen: **0**.

**Historische Befunde bleiben erhalten, sind aber als historisch markiert:** §23.3 enthält die
`BLOCKED_CONTENT_APPROVAL`-Bewertung vom 2026-08-24. Sie ist durch §24 überholt und dort ausdrücklich
als reklassifiziert gekennzeichnet — sie beschreibt **nicht** den aktuellen Zustand. Der Statuswert einer Zeile darf nur
gegen **gemessene** Repository-Evidenz auf `READY` gesetzt werden — nie gegen eine Absicht.

## 23. PT04.3 — Launch-Content-Readiness: Ausführung und Ergebnis

**Stand PT04.3 (2026-08-24).** Wo dieser Abschnitt §4/§21 widerspricht, gilt er. **Ergebnis des Laufs
vom 2026-08-24: `BLOCKED_CONTENT_APPROVAL`** — Begründung in §23.3.

> **Nachtrag AP04-RECOVERY (2026-08-25):** Die Ausführung (§23.1) und die Verifikation (§23.2) sind
> unverändert gültig. Die **Gate-Bewertung** in §23.3 ist überholt: Die dortigen Blocker sind in §24 zu
> Deferred Gates mit späteren Owner-APs reklassifiziert. Bei Widerspruch gilt **§24**.

### 23.1 Ausgeführte Mutationen

| #    | Maßnahme                                                                                                                                                                       | Umfang                        | Grundlage                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ------------------------------------------- |
| M-1  | **Key-Parität hergestellt** — `common.errors.*` (7), `epigenetics.befund.*` (9 + slawische Pluralformen), `services.*.seo.title` (5)                                           | **172 Keys** in 8 Sprachen    | `I-06`, `LB-3`, ST04.3.4                    |
| M-2  | **Chat-Copy entfernt** — `common.chat.*` (8 Keys) aus allen 10 `common.json`                                                                                                   | 10 Dateien                    | `DEC-RL-007`, `LB-9`, ST04.3.1              |
| M-3  | **Garantie-Zusage entfernt** — `home.hero.description` und `hero.dental.description`                                                                                           | 2 Keys × 10                   | `DEC-RL-012`, `CT-R3`, `S-04`               |
| M-4  | **„garantierte Performance" bereinigt** — der wörtlich gesperrte Begriff in `services.json`                                                                                    | 10 Sprachen                   | `DEC-RL-012`, `S-03`                        |
| M-5  | **Success-Semantik korrigiert** — Kontakt und Support sagen nicht mehr „gesendet", sondern „erhalten und registriert"                                                          | 2 Keys × 10                   | `DEC-RL-009`, `LD-01`, `CT-10-K1`, `R04-12` |
| M-6  | **GENERAL_SALES normalisiert** — 13 Locale-Keys je Sprache auf die lokalisierte Entsprechung von „Angebot anfragen"                                                            | **130 Werte**                 | `DEC-RL-013`, `CTA-01`, `LB-6`              |
| M-7  | **CTA-Rollenbruch behoben** — `products.hero.cta_order` und `cta_bottom.button` trugen in 8 Sprachen einen Bestell-CTA auf einer B2B-Anfrageseite                              | 2 Keys × 8                    | `CT-06-K`, `CTA-06`, `LB-7`                 |
| M-8  | **Support-CTA zurückgeführt** — `support.hero.cta_primary` ist wieder `SUPPORT_REQUEST`, kein Sales-CTA                                                                        | 1 Key × 10                    | `CTA-05`, `IA-06`, `LB-8`                   |
| M-9  | **Artikel-Einheits-CTA aufgelöst** — `articles.index.hero_primary_cta` und `detail.primary_cta` sind `CONTENT_NEXT_STEP`                                                       | 2 Keys × 10                   | `CTA-08`, `IAD-13`                          |
| M-10 | **Epigenetik-Inquiry-CTA lokalisiert** — 3 Keys, vorher in 8 Sprachen englisch                                                                                                 | 3 Keys × 10                   | `DEC-RL-011`, `CTA-04`                      |
| M-11 | **CTA-Wortlaut im Fließtext angeglichen** — `home.seo.description`, `home.roi.payback_hint`                                                                                    | 2 Keys × 10                   | `CTA-01`                                    |
| M-12 | **contact.json übersetzt** — Validierungsfehler, Feld-Hints, Option und Panel-Kontext; `_translationStatus` entfernt                                                           | **80 Werte** in 8 Sprachen    | `I-03`, `LB-5`, `CT-10-K4`                  |
| M-13 | **Hartkodierte CTA-Copy im Quelltext** — 17 Vorkommen in 11 Dateien, davon 3 vollständig hartkodierte Buttons in `S3LeitliniePage.tsx`                                         | 11 Dateien                    | `AP04.md` §13.3, `CTA-01`, `R04-06`         |
| M-14 | **Veraltete Entwicklermarker entfernt** — `PM-3` (offener Meta-Titel) und `PM-4` (behauptet einen nicht existierenden Endpunkt-Zustand)                                        | 2 Dateien                     | ST04.3.1                                    |
| M-15 | **Korrupte tschechische Copy repariert** — zwei sichtbare Sätze in `cs/services.json` enthielten das Artefakt „3-5 pracovní dnyodinového" aus einer fehlgeschlagenen Ersetzung | 2 Sätze                       | ST04.3.1                                    |
| M-16 | **Schreibweise des gelockten Claims vereinheitlicht** — `CV < 2 %` statt gemischt `CV < 2%` / `CV <2%`                                                                         | **184 Vorkommen**, 29 Dateien | `DEC-RL-008`, ST04.3.2                      |

**Summe: 104 Dateien geändert** — 89 Locale-Dateien, 13 Quelldateien (ausschließlich Copy nach §13.3),
2 Dokumentationsdateien. **Keine Route, kein Layout, kein Design-Token, kein SEO-Mechanismus, kein
Lead-Backend, kein Tracking, kein Asset berührt.**

### 23.2 Verifikation

| Prüfung                   | Ergebnis                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| JSON parse                | **151/151 Dateien OK, 0 Duplicate Keys**                                                                                                                                          |
| Key-Parität gegen `de`    | **0 fehlende Keys** über alle 15 Namespaces × 9 Sprachen (vorher 21 in 8 Sprachen)                                                                                                |
| Namespace-Registrierung   | 14/15 registriert; **einzige Ausnahme `casestudies`** — dokumentiert und gewollt (`ID-5`, `DEC-RL-015`)                                                                           |
| Leere Werte               | 1 (`testimonials.goran_stojanovic.practice` × 10) — optionales Feld mit `''`-Default, kein Platzhalter                                                                            |
| Typecheck (`tsc -b`)      | **grün**                                                                                                                                                                          |
| Unit-Tests (`vitest run`) | **13/13 bestanden**; 5 jsdom-Umgebungsfehler (`ERR_REQUIRE_ESM` in `html-encoding-sniffer`) — **auf `cd2524e` reproduziert, also vorbestehend und nicht durch PT04.3 verursacht** |
| Production Build          | **grün** (Client + SSR)                                                                                                                                                           |
| SSR-Smoke                 | 12 Routen über 10 Sprachen **200**, unbekannte Route **echte 404**                                                                                                                |
| Gerenderte CTA-Stichprobe | `de` „Angebot anfragen" · `pl` „Poproś o ofertę" · `fr` „Demander un devis" · `cs` „Vyžádat nabídku" · `nl` „Offerte aanvragen"                                                   |
| Alte CTA-Copy im SSR-HTML | **0**                                                                                                                                                                             |
| Garantie-Copy im SSR-HTML | **0**                                                                                                                                                                             |
| Chat-Copy im SSR-HTML     | **0**                                                                                                                                                                             |
| Roh-Key-Rendering         | **0** — die neuen `errors.*`- und `befund.*`-Keys lösen in `pl`, `cs`, `nl` korrekt auf                                                                                           |
| `CV < 5 %`-Regression     | **0 Treffer**                                                                                                                                                                     |

### 23.3 Blocker — `BLOCKED_CONTENT_APPROVAL`

PT04.3 erreicht **kein PASS**. Vier Bereiche bleiben offen; zwei davon sind Freigabe-Blocker, zwei
sind Owner-Blocker. **Keiner davon wurde durch generierte Inhalte überdeckt.**

> **Reklassifiziert durch AP04-RECOVERY (2026-08-25).** Die folgenden Befunde bleiben inhaltlich
> gültig und vollständig — ihre **Gate-Art** ist in §24 korrigiert: `B-1`→`DG-01`, `B-2`→`DG-02`,
> `B-3`→`DG-03`, `B-4`→`DG-04`, `B-5`→`DG-05`, `B-6`→`DG-06a`/`DG-06b`, Asset-Lücke aus §23.5→`DG-07`.
> **Keiner davon ist mehr AP04-Closure-Blocker; alle bleiben Launch-Blocker.**

#### B-1 · Epigenetik-Webcontent in 8 Sprachen — `BLOCKED_CONTENT_APPROVAL`

**Messung:** 222 Volltextwerte je Sprache × 8 Sprachen = **1 776 Werte, rund 240 000 Zeichen**.
Betroffen sind `hero`, `principle`, `analyses`, `workflow`, `evidence`, `faq`, `samples`, `compare`,
`basics`, `sheets`, `consult` und `merk`.

**Warum nicht ausgeführt:**

1. Der Bestand enthält die **Pflichthinweise `RN-01`–`RN-04`** (§19.8) — medizinische
   Abgrenzung („Beratungswerkzeug, keine Diagnose"), regulatorischer Status („keine CE-gekennzeichneten
   In-vitro-Diagnostika"), Synthetik-Hinweis der Musterbefunde und die FAQ-Abgrenzung gegenüber
   ärztlicher Diagnostik. Deren Formulierung ist in acht EU-Rechtsräumen eine **fachliche und
   regulatorische Frage**, keine Übersetzungsfrage.
2. Dazu kommen Evidenz-, Methodik- und Biologisches-Alter-Aussagen (`S-11`).
3. **Das Repository hat diese Zurückstellung selbst dokumentiert:** alle acht Dateien tragen
   `_translationStatus: "English fallback — panel context, epigenetics field options and field errors"`.
   Die Eigentümer haben bewusst den Fallback-Mechanismus gesetzt statt zu übersetzen.
4. `AP04.md` §9.5 und §15 `R04-04` verlangen bei fehlender Freigabe ausdrücklich **blockieren statt
   erfinden**; §9.6 verbietet, bestehende Übersetzungsstände blind maschinell zu erzeugen.

**Was PT04.3 hier trotzdem geliefert hat:** die 9 fehlenden `befund.*`-UI-Keys sind in allen acht
Sprachen **echt übersetzt** (M-1) — sie sind reine Oberflächen-Mikrocopy ohne regulatorischen Gehalt und
haben vorher den Roh-Key gerendert (`I-06`). Ebenso die drei Inquiry-CTAs (M-10).

**Zur Auflösung nötig:** freigegebene Fachübersetzung der Epigenetik-Inhalte in `pl fr it es pt da nl cs`,
mit regulatorischer Prüfung der Pflichthinweise je Zielmarkt.

#### B-2 · Musterbefund-Inhalte in 8 Sprachen — `BLOCKED_CONTENT_APPROVAL` **und** Owner-Blocker AP16

**Messung:** `src/content/befunde/` führt 12 JSONs (**6 Panels × `de`/`en`**, ~322 KB). Ziel sind 10
Sprachen, es fehlen **48 Dateien**.

**Zwei unabhängige Blocker:**

1. **Inhaltlich:** vollständige medizinische Musterbefunde mit Messwerten, Genotypen, Referenz-
   bereichen und Interpretationen. Ohne fachliche Freigabe ist deren Erzeugung `R04-04`.
2. **Strukturell:** `src/content/befunde/meta.ts` deklariert `interface BefundSprachen { de: Befund; en: Befund }`.
   Das Modell kann eine neunte Sprache nicht abbilden. Die Erweiterung ist **AP16** (`CA-18`,
   `CONTENT-ASSET-CONTRACT.md` §5.2) — AP04 darf sie nicht vorziehen.

#### B-3 · Consumer × 10 — Owner-Blocker **AP08 PT08.2** mit **AP21**

`src/pages/consumer/**`: 7 Dateien, 2 884 Zeilen, **0 × `useTranslation`**. Die Copy liegt nicht in
einer Content-Schicht, sondern als JSX-Literal.

`I18N-CONTRACT.md` **M-03** ist eindeutig: _„Bei hartkodierten Flächen zuerst `t()`-fähig machen
(AP08 PT08.2), dann die zehn Sprachen füllen. **Umgekehrt geht es nicht.**"_

Der einzige Weg, den PT04.3 allein hätte gehen können, wäre ein neuer Consumer-Namespace gewesen —
und der scheitert an zwei Regeln zugleich: `NAMESPACES` in `src/i18n.ts` ist **Einzeleigentum von AP08**
(`I18N-CONTRACT.md` M-01), und ein nicht registrierter Namespace ist nach `I-05` und der PT04.3-Vorgabe
„keine unregistrierten Namespaces" unzulässig. Copy in einen fremden bestehenden Namespace zu legen
verstößt gegen `AP04.md` §9.6 („keine Copy in falschem Namespace verstecken").

**Zur Auflösung nötig:** AP08 PT08.2 macht die drei Consumer-Familien `t()`-fähig und registriert den
Namespace; danach kann die 10-sprachige Content-Basis gefüllt werden (`I18N-CONTRACT.md` §10,
Zeile „Content-Basis · AP04 PT04.3.4"). Der `/en/`-Zwangsredirect (`IAD-01`) bleibt separat AP21/AP10.

#### B-4 · Systemmail- und Autoresponder-Copy × 10 — Owner-Blocker **AP22**

`server/server.js` führt fünf Mailstrecken (Kontakt, Support-Intern, Support-Autoresponder,
Consumer-Bestellung, ROI-Report) **hartkodiert deutsch**, inklusive `Intl.NumberFormat('de-DE')` im
ROI-PDF und des Pflichthinweises `RN-07`.

**Der Blocker ist nicht die Copy, sondern der fehlende Sprachkontext:** keiner der fünf Endpunkte
empfängt eine Sprache — `req.body` trägt in allen Strecken **kein** `language`-Feld. `language` ist
nach `LEAD-DATA-CONTRACT.md` §5.2 ein Pflichtfeld der Journey-Kategorie, dessen Einführung **AP22**
verantwortet. PT04.3 dürfte es nicht ergänzen: das wäre eine Änderung des Lead-API-Vertrags und fällt
unter die ausdrücklich untersagte Lead-Plattform-Arbeit (`AP04.md` §13.2, PT04.3 §19).

Eine unverdrahtete 10-sprachige Copy-Ressource anzulegen wäre spekulativ — über die Struktur der
Lead-Journey entscheidet AP22 (`LEAD-DATA-CONTRACT.md` §5.1: „Über die endgültigen Lead-Typ-Bezeichner
entscheidet AP22; kein anderes AP erfindet sie.").

#### B-5 · Artikel-Volltexte in `fr`, `pt`, `da`, `nl` — `BLOCKED_CONTENT_APPROVAL` (nachrangig)

97 Volltextwerte je Sprache × 4 = **388 Werte, rund 61 000 Zeichen**. `pl`, `it`, `es`, `cs` sind
übersetzt — es gibt also einen freigegebenen Übersetzungsweg, nur nicht für diese vier Sprachen.

Die Artikel enthalten klinische Aussagen (Antibiotika-Entscheidungen, CRP-/HbA1c-Interpretation,
RiliBÄK-Qualitätskontrolle). Sie fallen damit unter dieselbe Regel wie B-1; die Dringlichkeit ist
geringer, weil kein Pflichthinweis betroffen ist.

#### B-6 · `RN-08` — Consumer-Pflichthinweis

`RN-05` (Nahrungsergänzungs-Disclaimer) existiert freigegeben in **10 Sprachen** und deckt dasselbe
Produkt ab, das die Consumer-Spray- und Duo-Seite verkaufen — er ist damit **wiederverwendbar, nicht
neu zu erfinden**. Umsetzbar wird das jedoch erst mit B-3.

Für die Maskenseite existiert **kein** freigegebener Hinweis. PT04.1 hat die Lücke benannt; ob für ein
kosmetisches Produkt ein Pflichthinweis erforderlich ist, ist eine fachlich-rechtliche Frage und wird
hier **nicht** entschieden und **nicht** erfunden. Prüfpunkt für **AP20/AP21**.

### 23.4 Aktualisierter Locale- und Statusstand

| Bereich                               | vor PT04.3                         | nach PT04.3                                   | Status                                   |
| ------------------------------------- | ---------------------------------- | --------------------------------------------- | ---------------------------------------- |
| Key-Parität (alle Namespaces)         | 21 fehlende Keys in 8 Sprachen     | **0**                                         | `READY`                                  |
| App-Shell-Fehlertexte (`C-20`/`C-28`) | 7 Keys fehlten ×8                  | **10/10 übersetzt**                           | `READY`                                  |
| Kontakt-Formcopy (`C-03`)             | 2/10 übersetzt, EN-Fallback-Marker | **10/10 übersetzt**, Marker entfernt          | `READY`                                  |
| Support (`C-04`)                      | Sales-CTA, Mail-Semantik           | **`SUPPORT_REQUEST`**, Annahme-Semantik       | `READY`                                  |
| Homepage (`C-01`)                     | Garantie-Copy, 5 abweichende CTA   | **garantiefrei, CTA normalisiert**            | `READY`                                  |
| IglooPro (`C-08`)                     | CTA-Rollenbruch ×8                 | **eine Rolle über alle 10 Sprachen**          | `READY`                                  |
| Downloads-Copy (`C-06`)               | 3 abweichende CTA                  | **normalisiert**                              | `PARTIAL` — Ressourcenmodell bleibt AP19 |
| Artikel-CTA (`C-07`)                  | Einheits-Sales-CTA                 | **`CONTENT_NEXT_STEP`**                       | `PARTIAL` — Volltexte B-5                |
| Diagnostics-Services (`C-10`)         | 5 `seo.title` fehlten ×8           | **10/10**, „garantierte Performance" entfernt | `READY`                                  |
| Chat-Copy (`C-29`)                    | 8 Keys ×10 aktiv                   | **entfernt**                                  | erledigt                                 |
| IglooPro-Claim (`S-01`)               | 3 Schreibweisen                    | **einheitlich `CV < 2 %`**, 184 Vorkommen     | `READY`                                  |
| Epigenetik-Webcontent (`C-11`/`C-12`) | 222 EN-Werte ×8                    | **unverändert 222 ×8**                        | **B-1**                                  |
| Musterbefund-Inhalte (`C-13`)         | 2/10                               | **unverändert 2/10**                          | **B-2**                                  |
| Consumer (`C-14`–`C-17`)              | 1/10, hartkodiert                  | **unverändert**                               | **B-3**                                  |
| Systemmail (`C-26`/`C-27`)            | 1/10                               | **unverändert**                               | **B-4**                                  |
| Artikel-Volltexte (`C-07`)            | 4 Sprachen englisch                | **unverändert**                               | **B-5**                                  |

### 23.5 Sichtbare sprachabhängige Download-Lücken (ST04.3.10)

PT04.3 durfte die Copy-Seite vorbereiten, nicht die Assets. Der Befund aus §8.2 bleibt unverändert und
wird als Launch-Item an PT04.4 übergeben:

- **Kein stiller Fallback ist repariert worden** — acht Sprachen zeigen weiterhin englische
  Dateinamen, alle zehn zeigen die deutschen Musterbefund-PDFs.
- **Die Copy behauptet keine falsche Verfügbarkeit**, weil die Sprachzuordnung nirgends benannt wird —
  genau das ist das Problem (`CA-27`). Eine ehrliche Kennzeichnung setzt das Ressourcenmodell mit
  `assetByLanguage` voraus (`CT-07`), und dessen Eigentum liegt bei **AP19**.
- Die Copy-seitige Vorbereitung ist damit auf das begrenzt, was ohne AP19-Modell möglich ist: die
  Lücke ist in §8.2 und §23.5 vollständig und maschinell nachvollziehbar dokumentiert.

### 23.6 Was PT04.3 ausdrücklich nicht getan hat

- **Keine medizinische, klinische oder regulatorische Aussage erzeugt, übersetzt oder umformuliert.**
- Keine Product Facts erfunden; die Sachaussage „3–5 Werktage" blieb erhalten, nur die Garantie-Zusage fiel.
- Den `CV < 2 %`-Claim **nicht** verschärft, relativiert oder entfernt — nur die Schreibweise vereinheitlicht.
- Keine Route, kein Redirect, kein `SEOHead`-Umbau, kein Header/Footer, keine Suche, kein Design-System.
- Kein Lead-Backend, kein CRM, keine Queue, kein Tracking, kein Consent, kein Deployment.
- **`NAMESPACES` in `src/i18n.ts` nicht angefasst** (`I18N-CONTRACT.md` M-01) und keinen unregistrierten
  Namespace angelegt.
- `casestudies`, `shop` und jeder andere Backlog-Bestand unverändert und nicht reaktiviert (`DEC-RL-015`).
- Kein Asset erzeugt, verschoben, umbenannt oder gelöscht — das ist PT04.4.
- Kein Decision Lock geöffnet oder neu interpretiert.

---

---

## 24. Deferred-Gate-Register (AP04-RECOVERY 2026-08-25)

**Kanonische Führung der Deferred Gates.** `AP04.md` §11.1 hält den Kurzindex; bei Abweichung gilt
diese Tabelle.

### 24.1 Warum dieses Register existiert

PT04.3 endete am 2026-08-24 mit `BLOCKED_CONTENT_APPROVAL` und blockierte damit AP05 und AP06 mit.
Die Ursache war kein Content-Problem, sondern ein **Vertragsfehler in `AP04.md`**: das Dokument führte
Arbeiten als AP04-Closure-Voraussetzung, die `MASTER-SCOPE.md` wörtlich späteren APs zuweist —
insbesondere `AP08 PT08.2` (Consumer `t()`-fähig machen), `AP08 PT08.3.1/.2` (Epigenetik und Befunde
× 10), `AP08 PT08.5` (Systemtexte × 10), `AP08 PT08.6` (sprachabhängige Assets), `AP16 PT16.1.6`
(10-sprachige Befundstruktur) und `AP22` (Sprachkontext im Leadflow).

Da AP08 in **Welle 1**, AP16 in **Welle 3** und AP21/AP22 in **Welle 4** liegen — sämtlich nach AP04
(**Welle 0**) — entstand ein serieller Zyklus. Das verletzte `CONTEXT-INDEX.md` §3:
*„Ein AP-Dokument darf den Master-Scope nicht stillschweigend erweitern oder reduzieren."*

**Die Recovery ändert keine Zielanforderung.** Sie korrigiert ausschließlich, **wann** und **durch
welchen AP** ein Gate geschlossen wird. Kein Gate wurde gelöscht, keines als erledigt markiert.

### 24.2 Gate-Typen

| Typ | Bedeutung | AP04 Closure Blocker |
|---|---|---|
| `DEFERRED_IMPLEMENTATION_GATE` | technische Voraussetzung gehört einem späteren Owner-AP | nein |
| `DEFERRED_CONTENT_APPROVAL_GATE` | fachliche/regulatorische Freigabe fehlt, Owner-AP liegt später | nein |
| `DEFERRED_ASSET_GATE` | Sprach-/Formatvariante eines Assets fehlt, Owner liegt später | nein |
| `AP04_CLOSURE_BLOCKER` | innerhalb AP04-Scope lösbar | **ja** |

### 24.3 Register

---

#### `DG-01` — Epigenetik-Webcontent × 10

| Feld | Inhalt |
|---|---|
| **Description** | Der launchrelevante Epigenetik-Webcontent liegt in acht Sprachen als englischer Fallback vor, einschließlich der Pflichthinweise `RN-01`–`RN-04`. |
| **Current state** | 222 Volltextwerte je Sprache × 8 Sprachen = **1 776 Werte, ~240 000 Zeichen**. Betroffen: `hero`, `principle`, `analyses`, `workflow`, `evidence`, `faq`, `samples`, `compare`, `basics`, `sheets`, `consult`, `merk`. |
| **Why AP04 cannot own completion** | (a) Die enthaltenen Pflichthinweise — medizinische Abgrenzung, regulatorischer Status („keine CE-gekennzeichneten IVD"), Synthetik-Hinweis — sind in acht EU-Rechtsräumen eine fachlich-regulatorische Frage; `AP04.md` §9.5 und `R04-04` verlangen *blockieren statt erfinden*. (b) Der technische Rollout ist wörtlich `AP08 PT08.3.1`. |
| **Gate type** | `DEFERRED_CONTENT_APPROVAL_GATE` + `DEFERRED_IMPLEMENTATION_GATE` |
| **Owner AP** | Fachfreigabe · **AP15** (Säulencontent) · **AP08 PT08.3.1** (Rollout) |
| **Required before** | Launch-Gate 1 (Language) · Launch-Gate 6 (Epigenetics) |
| **Safe current behavior** | Englischer Fallback wird ausgeliefert und ist über `_translationStatus` in allen acht Dateien deklariert; `I-08` zeichnet den Bereich als `lang="en"` aus. Keine falsche Verfügbarkeitszusage. |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | Messung §23.3 B-1; `_translationStatus: "English fallback — translation pending"` in acht `epigenetics.json`; `MASTER-SCOPE.md` AP08 PT08.3.1. |

**Von AP04 geliefert:** die 9 fehlenden `befund.*`-UI-Keys existieren jetzt in allen zehn Sprachen —
zuvor renderten sie in acht Sprachen den Roh-Key (`I-06`).

**Präzisierung aus dem PT04.3-Retry (2026-08-25) — Marker-Skopus.** Der Marker `_translationStatus` ist
für `epigenetics` **wurzel-skopiert**, und die vier Konsumenten (`EpigeneticsPage.tsx:213`,
`MusterbefundPage.tsx:380`, `EpiSubpage.tsx`, `EpigeneticsTeaserSection.tsx`) setzen daraufhin
`lang="en"` auf den **gesamten** Inhaltscontainer. Jede lokalisierte Zeichenkette innerhalb dieses
Containers würde von einem Screenreader mit englischer Phonetik vorgelesen — ein Verstoß gegen `I-08`
und WCAG 3.1.2, den `N13` ausdrücklich schützt.

Der erste PT04.3-Lauf hatte 12 Keys (9 × `befund.*`, 3 Inquiry-CTAs) in den acht Fallback-Sprachen
übersetzt und damit genau diese Inkohärenz erzeugt. Der Retry hat sie **auf den englischen
Namespace-Wert zurückgeführt** — die Keys bleiben vollständig vorhanden, es rendert kein Roh-Key mehr,
und der Marker sagt wieder die Wahrheit.

**Zusätzliche Owner-Aufgabe für AP08:** Soll die Epigenetik-Strecke teilweise übersetzt ausgeliefert
werden, muss der Marker auf Teilbäume umgehängt werden — wie es `contact.form` bereits vormacht. Das
verlangt Änderungen an den vier Konsumenten und ist **AP08 PT08.1.5/.6**; AP04 darf es nach `GM-05`
nicht vorziehen.

---

#### `DG-02` — Musterbefund-Inhalte × 10

| Feld | Inhalt |
|---|---|
| **Description** | Die sechs Musterbefunde existieren nur in `de`/`en`; das Sprachmodell ist strukturell zweisprachig. |
| **Current state** | `src/content/befunde/` führt 12 JSONs (6 Panels × 2 Sprachen, ~322 KB). Es fehlen **48 Dateien**. `meta.ts` deklariert `interface BefundSprachen { de: Befund; en: Befund }`. |
| **Why AP04 cannot own completion** | (a) **Strukturell:** das Modell kann keine neunte Sprache abbilden; seine Erweiterung ist `AP16 PT16.1.6` („10-sprachige Contentstruktur"), die inhaltliche Vervollständigung `AP08 PT08.3.2`. (b) **Inhaltlich:** vollständige medizinische Musterbefunde mit Messwerten, Genotypen und Interpretationen — ohne Freigabe ist deren Erzeugung `R04-04`. |
| **Gate type** | `DEFERRED_IMPLEMENTATION_GATE` + `DEFERRED_CONTENT_APPROVAL_GATE` |
| **Owner AP** | **AP16 PT16.1.6** (Modell) · **AP08 PT08.3.2** (Inhalte × 10) · Fachfreigabe |
| **Required before** | Launch-Gate 1 · Launch-Gate 6 |
| **Safe current behavior** | Die sechs Routen liefern `de`/`en`-Inhalte; die Befund-UI-Labels sind seit PT04.3 in allen zehn Sprachen vorhanden, sodass keine Roh-Keys mehr rendern. |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | `src/content/befunde/meta.ts`; §23.3 B-2; `IA-INVENTORY.md` `IAD-03`; `CONTENT-ASSET-CONTRACT.md` §5.2 („Owner: AP16"). |

---

#### `DG-03` — Consumer × 10

| Feld | Inhalt |
|---|---|
| **Description** | Die drei Consumer-Familien sind vollständig hartkodiert englisch und daher nicht lokalisierbar. |
| **Current state** | `src/pages/consumer/**`: 7 Dateien, 2 884 Zeilen, **0 × `useTranslation`**. Copy liegt als JSX-Literal, nicht in einer Content-Schicht. 27 fehlende Locale-Varianten (3 Familien × 9 Sprachen). |
| **Why AP04 cannot own completion** | `I18N-CONTRACT.md` **M-03**: *„Bei hartkodierten Flächen zuerst `t()`-fähig machen (AP08 PT08.2), dann die zehn Sprachen füllen. **Umgekehrt geht es nicht.**"* Ein eigener Namespace scheitert zusätzlich an **M-01** (`NAMESPACES` = AP08-Einzeleigentum) und `I-05`. Copy in einen fremden Namespace zu legen verstößt gegen `AP04.md` §9.6. |
| **Gate type** | `DEFERRED_IMPLEMENTATION_GATE` |
| **Owner AP** | **AP08 PT08.2.3–.7** (Spray, Masks, Duo, Shell, Order Form/Modal/Price UI) · **AP21** (Seitenabschluss × 10) |
| **Required before** | Launch-Gate 1 · Launch-Gate 4 (SEO/Consumer indexierbar) |
| **Safe current behavior** | Die Seiten liefern konsistentes Englisch. Kein Sprachversprechen wird gebrochen, weil keine lokalisierte Variante beworben wird. Der `/en/`-Zwangsredirect bleibt separat `IAD-01` (AP21/AP10). |
| **Launch blocker** | **ja** (`REST-03`, `DEC-RL-006`) |
| **AP04 closure blocker** | **nein** |
| **Evidence** | §12, §23.3 B-3; `MASTER-SCOPE.md` AP08 PT08.2.3–.7; `I18N-CONTRACT.md` M-01/M-03, `ID-1`. |

---

#### `DG-04` — Systemmail- und Autoresponder-Copy × 10

| Feld | Inhalt |
|---|---|
| **Description** | Fünf Mailstrecken sind hartkodiert deutsch; der Leadflow trägt keinen Sprachkontext. |
| **Current state** | `server/server.js`: Kontakt, Support-Intern, Support-Autoresponder, Consumer-Bestellung, ROI-Report — alle deutsch, inklusive `Intl.NumberFormat('de-DE')` im ROI-PDF und des Pflichthinweises `RN-07`. **Kein Endpunkt empfängt ein `language`-Feld.** |
| **Why AP04 cannot own completion** | `language` ist nach `LEAD-DATA-CONTRACT.md` §5.2 Pflichtfeld der Journey-Kategorie; §5.1: *„Über die endgültigen Lead-Typ-Bezeichner entscheidet AP22; kein anderes AP erfindet sie."* Das Feld einzuführen wäre eine Änderung des Lead-API-Vertrags und fällt unter die in `AP04.md` §13.2 untersagte Lead-Plattform-Arbeit. Eine unverdrahtete Copy-Ressource anzulegen wäre spekulativ. |
| **Gate type** | `DEFERRED_IMPLEMENTATION_GATE` |
| **Owner AP** | **AP22** (Sprachkontext im Leadflow) · **AP08 PT08.5.1–.5** (sprachliche Ausführung) |
| **Required before** | Launch-Gate 1 · Launch-Gate 3 (CRM) |
| **Safe current behavior** | Mails gehen konsistent deutsch heraus; die Absenderjourney ist eindeutig. Keine falsche Sprachzusage. Die Success-Copy im Frontend wurde in PT04.3 bereits auf die persistente Annahme umgestellt. |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | §23.3 B-4; `server/server.js` (kein `language` in `req.body`); `MASTER-SCOPE.md` AP08 PT08.5; `LEAD-DATA-CONTRACT.md` §5.1/§5.2. |

---

#### `DG-05` — Artikel-Volltexte in `fr`, `pt`, `da`, `nl`

| Feld | Inhalt |
|---|---|
| **Description** | Vier Sprachen tragen die Artikel-Volltexte als englischen Fallback. |
| **Current state** | 97 Volltextwerte je Sprache × 4 = **388 Werte, ~61 000 Zeichen**. `pl`, `it`, `es`, `cs` sind übersetzt. |
| **Why AP04 cannot own completion** | Die Artikel enthalten klinische Aussagen (Antibiotika-Entscheidungen, CRP-/HbA1c-Interpretation, RiliBÄK-Qualitätskontrolle). Für diese vier Sprachen fehlt der freigegebene Übersetzungsweg; §9.5 verlangt *blockieren statt erfinden*. Owner des Artikelcontents ist **AP17**. |
| **Gate type** | `DEFERRED_CONTENT_APPROVAL_GATE` |
| **Owner AP** | Fachfreigabe · **AP17** |
| **Required before** | Launch-Gate 1 |
| **Safe current behavior** | Englischer Fallback; die Artikel-Metadaten und die CTA-Rolle sind seit PT04.3 in allen zehn Sprachen korrekt. **Bekannte Einschränkung aus dem Retry:** `articles.json` trägt **keinen** `_translationStatus`-Marker, und `ArticlePage.tsx` liest keinen — der englische Volltext läuft in `fr`/`pt`/`da`/`nl` unter dem jeweiligen Sprach-`lang`-Attribut (`I-08`-Lücke). Einen inerten Marker ohne Konsumenten legt AP04 bewusst **nicht** an; die Verdrahtung ist **AP08 PT08.1.5** mit **AP17**. |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | §23.3 B-5; Messung §23.4; `CONTENT-ASSET-CONTRACT.md` §5.3 („Owner: AP17"). |

---

#### `DG-06a` — Consumer-Pflichthinweis, technischer Anteil

| Feld | Inhalt |
|---|---|
| **Description** | Der für die Consumer-Spray- und Duo-Seite passende Pflichthinweis kann nicht platziert werden. |
| **Current state** | `RN-05` (Nahrungsergänzungs-Disclaimer) existiert **freigegeben in 10 Sprachen** in `vitd3spray.json` und deckt dasselbe Produkt ab. Er ist **wiederverwendbar, nicht neu zu erfinden** — aber die Consumer-Seiten haben keine Content-Schicht. |
| **Why AP04 cannot own completion** | Direkte Folge von `DG-03`: ohne `t()`-Fähigkeit existiert kein Ort für den Hinweis. |
| **Gate type** | `DEFERRED_IMPLEMENTATION_GATE` |
| **Owner AP** | **AP08 PT08.2** · **AP21** |
| **Required before** | Launch-Gate 1 · Launch-Gate 4 |
| **Safe current behavior** | Der freigegebene Text `RN-05` existiert und ist referenzierbar; es wird kein abweichender oder erfundener Hinweis ausgeliefert. |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | §19.8 `RN-05`/`RN-08`; §23.3 B-6. |

---

#### `DG-06b` — Consumer-Pflichthinweis, fachlicher Anteil (Maskenseite)

| Feld | Inhalt |
|---|---|
| **Description** | Für das kosmetische Produkt der Maskenseite existiert **kein** freigegebener Pflichthinweis in irgendeiner Sprache. |
| **Current state** | 0/10. PT04.1 hat die Lücke als Prüfpunkt benannt, **nicht** als belegte Rechtspflicht. |
| **Why AP04 cannot own completion** | Ob ein kosmetisches Produkt hier einen Pflichthinweis benötigt, ist eine fachlich-rechtliche Frage. AP04 formuliert keine neue regulatorische Aussage (`CT-08-K3`, §9.5, `R04-04`). |
| **Gate type** | `DEFERRED_CONTENT_APPROVAL_GATE` |
| **Owner AP** | **AP20** (Legal) / **AP21** (Consumer) · Fachfreigabe |
| **Required before** | Launch-Gate 4 |
| **Safe current behavior** | Es wird **kein** erfundener Hinweis ausgeliefert. Der Zustand ist als offener Prüfpunkt dokumentiert, nicht als erledigt. |
| **Launch blocker** | **zu klären** — erst mit der fachlichen Bewertung entscheidbar |
| **AP04 closure blocker** | **nein** |
| **Evidence** | §10 `S-10`, `RN-08`; §23.3 B-6. |

---

#### `DG-07` — Sprachabhängige Download-Assets

| Feld | Inhalt |
|---|---|
| **Description** | Acht Sprachen haben keine eigenen Epigenetik-PDF-Varianten; die sechs Musterbefund-PDFs existieren nur auf Deutsch. |
| **Current state** | `public/downloads/epigenetics/`: `de` **17** Dateien, `en` **9**, acht Sprachen **0**. Die Sprachzuordnung steht als übersetzbarer String in `epigenetics.json`; acht Sprachen tragen englische Dateinamen, **alle zehn** verweisen für die Musterbefunde auf die deutschen Dateien. **Referenzintegrität: 29/29 auflösbar, 0 verwaist.** |
| **Why AP04 cannot own completion** | Die Dateien existieren nicht und lassen sich nicht durch Umhängen einer Referenz erzeugen. Der Owner sichtbarer Asset-Sprachlücken ist `AP08 PT08.6.2`; das Ressourcenmodell mit `assetByLanguage` gehört **AP19** (`CONTENT-ASSET-CONTRACT.md` §5.6, `CD-2`). |
| **Gate type** | `DEFERRED_ASSET_GATE` + `DEFERRED_CONTENT_APPROVAL_GATE` |
| **Owner AP** | **AP08 PT08.6** · **AP19** · Fachfreigabe für neue medizinische PDFs |
| **Required before** | Launch-Gate 1 · Launch-Gate 6 |
| **Safe current behavior** | Es wird eine existierende Datei ausgeliefert, kein toter Link (`CA-21` erfüllt). **Präzisierung aus dem Retry:** Der Fallback ist **nicht durchgehend still** — `samples.badge` („PDF in German") und `downloads.samplesText` („… — in German.") deklarieren die deutschen Musterbefund-PDFs in `en` und in den acht Fallback-Sprachen; die `compare.cta`/`basics.cta`-Labels tragen seit dem Retry ebenfalls den Hinweis „(German)" in allen zehn Sprachen (`CA-28`). Für die englischsprachigen Sheets deckt der namespace-weite FallbackNotice die Erwartung ab. **Die eigentliche Lücke ist das Fehlen der Sprachvarianten selbst**, nicht eine falsche Verfügbarkeitszusage. |
| **Launch blocker** | **ja** (`CA-27`, `CA-28`, `I-13`, `S-03`) |
| **AP04 closure blocker** | **nein** — mit einer Ausnahme: eine **gebrochene aktive Referenz** oder ein von AP04 auflösbares Duplikat (`CD-7`) bleibt ein echter PT04.4-Blocker. |
| **Evidence** | §8.2, §8.3, §23.5; `MASTER-SCOPE.md` AP08 PT08.6.2; `CONTENT-ASSET-CONTRACT.md` `CD-2`, `CD-7`. |

---

### 24.4 Bilanz

| Kennzahl | Wert |
|---|---|
| Deferred Gates gesamt | **8** (`DG-01`–`DG-07`, davon `DG-06` zweigeteilt) |
| davon `DEFERRED_IMPLEMENTATION_GATE` | 4 (`DG-02`, `DG-03`, `DG-04`, `DG-06a`) |
| davon `DEFERRED_CONTENT_APPROVAL_GATE` | 4 (`DG-01`, `DG-02`, `DG-05`, `DG-06b`) |
| davon `DEFERRED_ASSET_GATE` | 1 (`DG-07`) |
| **AP04 Closure Blocker** | **0** |
| **Launch Blocker weitergetragen** | **7** (`DG-06b` zu klären) |
| als `READY` markiert | **0** — `GM-02` |
| ohne eindeutigen Owner | **0** — `GM-04` |
| unklassifizierte Lücken | **0** — `GM-03` |

**Owner-Verteilung:** AP08 trägt 6 der 8 Gates ganz oder teilweise — das ist erwartbar, denn AP08 ist
laut Master-Scope der Eigentümer des 10-Sprachen-Rollouts. AP15, AP16, AP17, AP19, AP20, AP21 und AP22
tragen je einen fachlichen oder plattformseitigen Anteil.

**Keines dieser Gates ist geschlossen. Keines ist erledigt. Alle sind offen und werden weitergetragen.**
Die Recovery hat ausschließlich ihre Gate-Art und ihren Zeitpunkt korrigiert.

---

## 25. PT04.3 — Retry unter dem korrigierten Gate-Modell (2026-08-25)

**Ergebnis: `PASS`.** Dieser Abschnitt ist der aktuellste Stand für PT04.3; wo er §23 widerspricht,
gilt er.

### 25.1 Einordnung

Der Lauf vom 2026-08-24 (§23) hat die AP04-eigene Content-Arbeit hergestellt, endete aber
`BLOCKED_CONTENT_APPROVAL`, weil `AP04.md` Arbeiten späterer Owner-APs als eigene Voraussetzung führte.
Die AP04-RECOVERY hat das korrigiert (§24). Dieser Retry hat **nicht neu begonnen**: die 104 Dateien
aus §23.1 sind unverändert erhalten und wurden gegen die neue Gate-Semantik verifiziert.

### 25.2 Verifikation des Bestands (nicht übernommen, neu gemessen)

| Prüfung | Ergebnis |
|---|---|
| JSON parse · Duplicate Keys | **163 Dateien OK · 0 Duplicate Keys** |
| Key-Parität gegen `de` | **0 fehlende Keys** über 15 Namespaces × 9 Sprachen |
| Namespace-Registrierung | 14/15; einzige Ausnahme `casestudies` — dokumentiert und gewollt (`ID-5`, `DEC-RL-015`) |
| Leere Werte | 1 (`testimonials.goran_stojanovic.practice` × 10) — optionales Feld, `TestimonialsSection.tsx:124` rendert es konditional; **kein Platzhalter** |
| Chat-Copy in Locales | **0** — kein `chat`-Objekt, kein Chatbot/Concierge/HiHuman |
| Garantie-Copy | **0** — kein „garantierte Performance"-Äquivalent, keine Hero-Garantiezusage, keine Band-Komponente |
| GENERAL_SALES | **einheitlich in 10/10 Sprachen über 13 Keys** · alter Wortlaut „Beratung buchen" **0 ×** in Locales und Quelltext |
| Spezialisierte CTA-Rollen | `SUPPORT`, `CONTENT_NEXT_STEP` (Artikel) und `EPIGENETICS_INQUIRY` in **10/10** Sprachen von GENERAL_SALES getrennt |
| IglooPro-Claim | **184 × einheitlich `CV < 2 %`**, 0 × `< 5 %`, in allen 10 Locales präsent |
| Placeholder/Mock | **0** — kein Lorem/Coming-soon/TBD/Dummy/Prototype in Locales, 0 TODO/FIXME/HACK in `src/**` |
| Success-Semantik | **0** Mail-only-Formulierungen in Success-Keys; Kontakt und Support sagen „erhalten und registriert" |
| Hartkodierte sichtbare Strings | außerhalb der AP08-eigenen Flächen nur Firmennamen und Postanschriften im Footer — korrekt sprachneutral |

### 25.3 Im Retry geschlossene Klasse-A-Lücken

| # | Befund | Korrektur |
|---|---|---|
| **A-1** | **Inkohärenter EN-Fallback-Namespace.** Der erste Lauf hatte 12 Keys (9 × `befund.*`, 3 Inquiry-CTAs) in acht Sprachen übersetzt. Der Marker `_translationStatus` ist für `epigenetics` aber **wurzel-skopiert**; die Seiten setzen daraufhin `lang="en"` auf den gesamten Inhaltscontainer. Die 12 lokalisierten Strings wären mit englischer Phonetik vorgelesen worden — Verstoß gegen `I-08`, WCAG 3.1.2 und `N13`. | **100 Werte in 8 Sprachen** auf den englischen Namespace-Wert zurückgeführt. Die Keys bleiben vollständig vorhanden — der `I-06`-Defekt (Roh-Key-Rendering) bleibt behoben. Marker-Umhängung auf Teilbäume ist **AP08 PT08.1.5/.6** und wurde nach `GM-05` nicht vorgezogen. |
| **A-2** | **Fehlender Sprachhinweis (`CA-28`).** `compare.cta` und `basics.cta` verlinken deutschsprachige PDFs (`de/16_…`, `de/17_…`). Die englische Fassung trägt den Hinweis „(German)", die acht Fallback-Sprachen trugen ihn **nicht** — ein stiller Fremdsprach-Download ohne Kennzeichnung. | **16 Werte in 8 Sprachen** auf die englische Fassung **mit** Sprachhinweis angeglichen. |

**SSR-Nachweis nach der Korrektur:** `/pl/epigenetics` liefert genau **einen** `lang="en"`-Container,
den FallbackNotice und **0** lokalisierte Rest-Strings darin. `/pl/epigenetics/musterbefund/metabolic-health`
rendert **0** `befund.*`-Roh-Keys und zeigt das englische Label.

### 25.4 Klasse-B/C-Prüfung: nichts vorgezogen

Geprüft und **bewusst nicht** implementiert — jeweils registriert in §24:

| Gate | Nicht getan | Owner |
|---|---|---|
| `DG-01` | Epigenetik-Fachtexte übersetzt · Marker auf Teilbäume umgehängt | Fachfreigabe · AP15 · AP08 PT08.3.1 / PT08.1.5 |
| `DG-02` | `BefundSprachen` umtypisiert · Befundinhalte erzeugt | AP16 PT16.1.6 · AP08 PT08.3.2 |
| `DG-03` | Consumer `t()`-fähig gemacht · Consumer-Namespace angelegt | AP08 PT08.2.3–.7 · AP21 |
| `DG-04` | `language` in den Lead-Payload aufgenommen · Mail-Templates lokalisiert | AP22 · AP08 PT08.5 |
| `DG-05` | Artikel-Volltexte übersetzt · inerten Fallback-Marker angelegt | Fachfreigabe · AP17 · AP08 PT08.1.5 |
| `DG-06a/b` | Consumer-Pflichthinweis platziert · Maskenhinweis formuliert | AP08/AP21 · AP20 · Fachfreigabe |
| `DG-07` | Sprachvarianten der PDFs erzeugt · Ressourcenmodell gebaut | AP08 PT08.6 · AP19 |

`NAMESPACES` in `src/i18n.ts` ist unverändert. **Keine medizinische oder regulatorische Aussage
erzeugt, übersetzt oder umformuliert.**

### 25.5 Zielstatus je Bereich — ehrlich ausgewiesen

| Bereich | Target | Current runtime readiness | Owner | AP04 Closure Blocker |
|---|---|---|---|---|
| Consumer × 10 | **REQUIRED** | **DEFERRED** — 1/10, 0 × `useTranslation` | AP08 PT08.2 · AP21 | nein |
| Epigenetik × 10 | **REQUIRED** | **DEFERRED** — Namespace uniform EN-Fallback, Marker gesetzt | Fachfreigabe · AP15 · AP08 PT08.3.1 | nein |
| Musterbefunde × 10 | **REQUIRED** | **DEFERRED** — 2/10, Sprachmodell zweisprachig | AP16 · AP08 PT08.3.2 | nein |
| Systemmail × 10 | **REQUIRED** | **DEFERRED** — 1/10, kein `language` im Leadflow | AP22 · AP08 PT08.5 | nein |
| Artikel × 10 | **REQUIRED** | **DEFERRED** — 6/10 übersetzt | Fachfreigabe · AP17 | nein |
| Key-Parität | REQUIRED | **READY** — 0 Lücken | AP04 | — |
| CTA-Standard | REQUIRED | **READY** — 10/10 | AP04 | — |
| Chat-/Garantie-Copy | REQUIRED | **READY** — 0 Treffer | AP04 | — |
| Success-Semantik | REQUIRED | **READY** — 10/10 | AP04 | — |
| IglooPro-Claim | REQUIRED | **READY** — 184 × einheitlich | AP04 | — |

**False-ready gaps: 0.** Kein Deferred Gate ist als `READY` ausgewiesen.

### 25.6 Qualitätsgates

`tsc -b` **grün** · Production Build (Client + SSR) **grün** · SSR-Smoke **13 Routen über 10 Sprachen 200**,
unbekannte Route **echte 404** · Unit-Tests **13/13 bestanden**.

Die 5 vitest-Fehler sind ein `ERR_REQUIRE_ESM` in `node_modules/html-encoding-sniffer` (jsdom-Umgebung)
und wurden im Retry erneut **auf `cd2524e` in einem separaten Worktree reproduziert** (dort 7/7 Tests,
dieselben 5 Fehler). **Vorbestehend, keine PT04.3-Regression** — Owner der Testumgebung ist **AP27**.

---

## 26. PT04.4 — Asset-Readiness (2026-08-25)

**Ergebnis: `PASS`.** Aktuellster Stand für die Asset-Seite; wo dieser Abschnitt §8 oder §23.5
widerspricht, gilt er.

### 26.1 Asset-Inventar

| Klasse | Bestand | Ergebnis |
|---|---|---|
| Downloads `public/downloads/**` | **32 Dateien** — 3 Produkt-PDFs, `epigenetics/de` 17, `epigenetics/en` 9, 3 ZIPs | vollständig inventarisiert |
| OG-/Social-Bilder `public/` | 3 (`og-image`, `og-epigenetics`, `og-vitd3-spray`), je **1200 × 630**, 80–84 KB | korrekte Social-Dimensionen |
| Favicons/Manifest-Icons `public/` | 11 | unverändert |
| Gebündelte Bilder `src/assets/**` | **51** nach der CD-7-Bereinigung (13 Epigenetik, 5 Consumer, 8 Testimonials, 25 sonstige) | inventarisiert |
| `<img>`-Elemente im Quelltext | **21** | siehe §26.4 |

**Referenzquellen geprüft:** 29 PDF/ZIP-Referenzen aus 150 Locale-Dateien · 3 Katalogeinträge ·
3 `public/`-Pfade im Quelltext · 36 Bundler-Importe.

### 26.2 Broken References

| Messung | Ergebnis |
|---|---|
| Broken references **vor** PT04.4 | **0** |
| Broken references **nach** PT04.4 | **0** |
| Download-Smoke gegen laufendes SSR | **16/16 gerenderte Download-`href` liefern HTTP 200** mit realer Content-Length |
| Absolute lokale Pfade / Casing-Fehler | 0 |

### 26.3 `CD-7` — Asset-Duplikat aufgelöst (AP04-owned)

**Der Befund war schwerwiegender als dokumentiert.** `CD-7` war in
`CONTENT-ASSET-CONTRACT.md` §6 als „veraltete/verwaiste Reste" geführt. Die Messung zeigt etwas
anderes: die drei PDFs unter `src/assets/downloads/` waren **byte-identisch** (md5 verifiziert) mit
`public/downloads/`, aber **nicht verwaist** — fünf Produktionskomponenten importierten sie und
lieferten dieselben Dokumente unter einer **zweiten, bundle-gehashten URL** aus:

| Datei | zweite Auslieferung durch |
|---|---|
| `igloo-pro-flyer.pdf` | `IglooProHero.tsx:5` · `IglooSpecsSection.tsx:3` · `IglooProductFinalCta.tsx:3` |
| `Polaris Vitamin D Spray  A4zuA5_DE_2025-01-20.pdf` | `VitaminD3SprayPage.tsx:25` |
| `Polaris Vitamin D Spray  A4zuA5_EN(8).pdf` | `VitaminD3SprayPage.tsx:26` |

Dasselbe Dokument hatte damit **zwei Identitäten und zwei URLs** — Verstoß gegen `CA-19`
(eine fachliche Asset-Identität) und `CA-22` (keine zweite Fassung in einem parallelen Baum). Die
Bundle-URL trug zusätzlich Leerzeichen und `(8)` im Dateinamen.

**Auflösung.** Kanonische Identität ist der Download-Katalog `src/content/downloads.json` — dort hängen
Resource-ID, Version/Datum und die Sprachdeklaration. Die vier Komponenten referenzieren jetzt die
Katalog-URL `/downloads/<file>`; danach war `src/assets/downloads/` nachweislich unreferenziert und
wurde entfernt.

| Nachweis | Ergebnis |
|---|---|
| Code-Referenzen auf `src/assets/downloads` nach Umstellung | **0** |
| Backlog-Bestand (Deal/Voucher/Case-Study/Shop) im entfernten Verzeichnis | **0** |
| kanonisches Evidence-/Source-Artefakt | nein — reine Produktflyer, im Katalog geführt |
| Typecheck / Build nach Entfernung | **grün** |
| Bundle-gehashte PDF-Duplikate in `dist/client/assets/` | vorher **3**, nachher **0** |
| Download-Smoke der drei Produkt-PDFs | **200** · 494 862 / 1 045 006 / 1 014 799 Bytes |

**~2,4 MB doppelte Auslieferung entfernt.** `LB-18` und `OR-8` sind damit geschlossen.

### 26.4 Alt-Texte

| Kategorie | Anzahl | Bewertung |
|---|---|---|
| fehlend | **0** | — |
| lokalisiert über `t()` | 7 | konform |
| dynamisch (`{title}`, `{name}`, `{image.alt}`) | 4 | konform |
| dekorativ (`alt=""`) | 1 | konform |
| Literal | 9 | siehe unten |

Die neun Literale sind **kein** AP04-Defekt:

- **2** auf `S3LeitliniePage` und `VitaminD3ImplantologyPage` — deklariert einsprachige `de`-Seiten
  (`S-17`), deutsches Alt ist korrekt;
- **4** auf `consumer/**` — vollständig hartkodierte Fläche, Owner **AP08 PT08.2** (`DG-03`);
- **1** `VitaminD3SprayPage.tsx:165` = `"PolarisDX Vitamin D3+K2 Sublingual Spray"` — Produktname,
  sprachneutral wie die Firmennamen im Footer;
- **2** in `DoctorsSection.tsx` und `FeaturedCaseStudy.tsx` — **beide Komponenten werden nirgends
  gerendert** (0 Render-Stellen), also kein ausgelieferter Text. `FeaturedCaseStudy` ist zudem
  Backlog (`DEC-RL-015`) und bleibt unangetastet.

Der vollständige Accessibility-Audit bleibt **AP24**.

### 26.5 Sprachtransparenz der Downloads (`CA-28`)

**Zwei undeklarierte Fremdsprach-Downloads gefunden und geschlossen (AP04-owned, Klasse A):**

| Fund | Vorher | Jetzt |
|---|---|---|
| `/igloo-pro` liefert `igloo-pro-flyer.pdf` — laut Katalog **„(DE)"** — in **allen 10** Locales aus | Labels wie „Karta danych (PDF)", „Datový list (PDF)" ohne jeden Hinweis | **3 Keys × 9 Nicht-DE-Locales** tragen die Kennzeichnung: „Karta danych (PDF, DE)" |
| `/vitamin-d3-spray` wählt DE nur für `de`, sonst **EN** (`VitaminD3SprayPage.tsx:35`) | „Pobierz PDF", „Stáhnout PDF" ohne Hinweis | **2 Keys × 8 Locales**: „Pobierz PDF (EN)" |

**43 Werte** angepasst. Die Konvention folgt dem kanonischen Katalog, der für genau diese drei Dateien
bereits „(DE)"/„(EN)" verwendet.

**Verifizierter Bestand — keine Nacharbeit nötig:**

| Ressource | Offenlegung | Status |
|---|---|---|
| 6 Musterbefund-PDFs (nur `de`) | `samples.badge` = „PDF in German" in `en` **und allen 8 Fallback-Locales** | **bestätigt** — die PT04.3-Aussage trifft zu |
| `compare.cta` / `basics.cta` → `de/16_`, `de/17_` | „… (German)" in allen 10 Locales | bestätigt (in PT04.3 geschlossen) |
| Epigenetik-Sheets/ZIP (`en/…`) in 8 Locales | namespace-weiter `LanguageFallbackNotice` + `lang="en"` | ausreichend erkennbar |
| `/downloads`-Katalogseite | Titel tragen „(DE)"/„(EN)" | bestätigt |

**Damit gilt: kein Nutzer erhält in einer nichtdeutschen Locale einen fremdsprachigen Download, ohne
dass dessen Sprache vorher erkennbar ist.**

### 26.6 Download-Katalog, Versionierung, Public/Gated

| Prüfung | Ergebnis |
|---|---|
| Katalogeintrag ohne Datei | **0** |
| Datei ohne Katalogeintrag (`public/downloads/` Wurzel) | **0** |
| Dateigröße deklariert vs. real | 0,5/1,0/1,0 MB gegen 0,47/1,00/0,97 MB — plausibel gerundet |
| Version/Datum | alle drei `2025-01-20`, nachvollziehbar |
| Dateinamen | nach der CD-7-Auflösung durchgehend ohne Leerzeichen/Sonderzeichen |
| Leere Kategorie `tech` | **bestätigt** — UI zeigt „Tech-Broschüren", Katalog hat 0 Einträge · Owner **AP19** (`IAD-06`) |
| Zugangsklasse im Katalog | **nicht vorhanden** · Owner **AP19 PT19.1/PT19.2** (`IAD-14`) |
| Gating-Mechanismus im Repository | **0 Treffer** — alle Ressourcen sind faktisch `PUBLIC` (`CD-8`) · Owner **AP19 PT19.3** mit **AP22** |

**Keine Gating-Implementierung vorgenommen.** Der aktuelle sichere Zustand ist: alle Downloads sind
öffentlich und werden auch als öffentlich beworben („Kostenlos & ohne Anmeldung") — es besteht keine
falsche Schutzzusage (`CM-05`).

### 26.7 Orphan- und Legacy-Assets — klassifiziert, nicht gelöscht

| Asset | Größe | Klasse | Begründung |
|---|---|---|---|
| `src/assets/hero_device.webp` | 17 KB | `INTENTIONAL UNUSED` | Hero-Variante; Homepage-Owner **AP11** |
| `src/assets/igloo_explode.webp` | 15 KB | `INTENTIONAL UNUSED` | Produktrender; Owner **AP14** |
| `src/assets/igloo_front.webp` | 15 KB | `INTENTIONAL UNUSED` | Produktrender; Owner **AP14** |
| `src/assets/landingpages-consumer/spray-hero-office-single.jpeg` | 231 KB | `INTENTIONAL UNUSED` | Consumer-Bildvariante; Owner **AP21** (`DG-03`) |
| `src/assets/polarisdx_logo.webp` | 11 KB | `INTENTIONAL UNUSED` | Markenasset-Variante |
| 6 × PNG-Master (`green`, `homeclinic`, `makemoney`, `Testbild1`, `above_the_fold`, `Igloo-pro-frontal`) | 6,9 MB | `SOURCE MASTER` | **werden nicht ausgeliefert** — `articleImages.ts` importiert ausschließlich die `.webp`-Ableitungen (18–67 KB); die `.png`-Namen sind nur Map-**Schlüssel**. Als Quellmaster für eine spätere Bildpipeline relevant · Owner **AP25** |
| `DoctorsSection.tsx`, `FeaturedCaseStudy.tsx` | — | `INTENTIONAL UNUSED` / `BACKLOG` | 0 Render-Stellen; Case Study ist `DEC-RL-015` |

**0 Löschungen außer der belegten CD-7-Auflösung.** Kein Backlog-Asset aktiviert oder entfernt.

### 26.8 Deferred Asset Gates

`DG-07` bleibt bestehen und wird um zwei Einträge ergänzt:

---

#### `DG-08` — Consumer OG-/Produktbilder

| Feld | Inhalt |
|---|---|
| **Asset** | OG-/Social-Bild je Consumer-Familie |
| **Current locale/state** | **0 von 3** Consumer-Seiten übergeben `SEOHead` ein `ogImage`; sie fallen auf das generische `og-image.jpg` zurück (`CD-9`) |
| **Missing locale/variant** | drei produktspezifische OG-Bilder (1200 × 630) |
| **Reason** | Fünf Consumer-Produktfotos existieren bereits unter `src/assets/landingpages-consumer/`, aber die OG-Verdrahtung ist SEO-Ausgabe und Seiten-Owner-Arbeit — der PT04.4-Prompt §7 stellt sie ausdrücklich AP09/AP21 zu |
| **Gate type** | `DEFERRED_ASSET_GATE` |
| **Owner** | **AP21 PT21.6.5** mit **AP09** |
| **Required before** | Launch-Gate 4 (SEO) |
| **Safe current behavior** | Generisches Marken-OG-Bild in korrekten Dimensionen; **kein totes Bild, keine falsche Produktdarstellung** |
| **User-facing disclosure** | entfällt — betrifft nur Social-Vorschauen |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | `grep ogImage src/pages/consumer/**` = 0 Treffer; `CONTENT-ASSET-CONTRACT.md` `CD-9` |

---

#### `DG-09` — ROI-Report-PDF nur deutsch

| Feld | Inhalt |
|---|---|
| **Asset** | zur Laufzeit erzeugtes ROI-Report-PDF (`server/server.js`) |
| **Current locale/state** | **1/10** — deutsch, inklusive `Intl.NumberFormat('de-DE')` und des Pflichthinweises `RN-07` |
| **Missing locale/variant** | neun Sprachfassungen |
| **Reason** | Das PDF entsteht im Lead-Flow, der **keinen Sprachkontext** empfängt — identische Ursache wie `DG-04` |
| **Gate type** | `DEFERRED_ASSET_GATE` + `DEFERRED_IMPLEMENTATION_GATE` |
| **Owner** | **AP22** (Sprachkontext) mit **AP08 PT08.5.3** (ROI-Zustellung × 10) |
| **Required before** | Launch-Gate 1 · Launch-Gate 3 |
| **Safe current behavior** | Zustellung per Mail, nicht als beworbener Download; keine Sprachzusage im UI |
| **User-facing disclosure** | derzeit keine — das UI verspricht keine Sprachwahl |
| **Launch blocker** | **ja** |
| **AP04 closure blocker** | **nein** |
| **Evidence** | `server/server.js` ROI-PDF-Generator; §24 `DG-04` |

---

### 26.9 Bilanz PT04.4

| Kennzahl | Wert |
|---|---|
| Aktive Broken References | **0** |
| AP04-eigene Asset-Fixes | **2** — CD-7 (Duplikat/Doppel-URL) · CA-28 (43 Sprachlabels) |
| Unsichere Löschungen | **0** |
| Gelöschte Dateien | 3 (nachweislich unreferenzierte, byte-identische Duplikate) |
| Deferred Asset Gates | **3** — `DG-07`, `DG-08`, `DG-09` |
| Deferred Gates gesamt (AP04) | **10** |
| AP04-Closure-Blocker | **0** |
| Launch-Blocker weitergetragen | **9** (`DG-06b` fachlich zu klären) |
| False-Ready-Aussagen | **0** |
| Backlog-Assets aktiviert | **0** |
