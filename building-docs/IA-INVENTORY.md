# IA-INVENTORY

**Kanonisches IA-Hauptartefakt des PolarisDX Website Relaunchs.** Es gibt genau dieses eine.
Erzeugt von **AP03 PT03.1**; PT03.2–PT03.4 ergänzen dasselbe Dokument.

> ## ⚠ IA-Wahrheit, nicht Routing-Wahrheit
>
> Die technische Routenwahrheit steht in `ROUTING-CONTRACT.md` (R-01–R-53) und wird hier **nicht**
> ersetzt oder dupliziert. Dieses Dokument beschreibt Nutzerrolle, Aufgabe, CTA, Navigationskontext,
> Journey-Rolle und bewusste Sichtbarkeit. Pfad-, Locale- und Existenzangaben sind aus dem
> Routing-Contract **abgeleitet** und müssen zu ihm konsistent bleiben (`AP03.md` §5.3).

---

## 1. Zweck und Autorität

**Zweck:** Welche logischen Seiten, Seitenfamilien, dynamischen Ressourcen, Redirect-Familien und
Sonderzustände gehören zum Relaunch?

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **AP03** (Eigentümer). **Mitbetroffen:** AP04 (Content-Readiness), AP06
(Navigation), AP07 (Search), AP08 (10 Sprachen), AP09 (SEO), AP10 (Route Registry/Redirects/Status),
AP11–AP21 (Seitenumsetzung je Familie), AP22 (Lead-Plattform), AP27 (Guards).

**Abgeleitet aus:** `ROUTING-CONTRACT.md` (Pfade, Locale-Policy, Status), `SEO-CONTRACT.md`
(Indexierbarkeit, Sitemap), `I18N-CONTRACT.md` (Sprachmenge), `RUNTIME-CONTRACT.md` (SSR-Fähigkeit),
`CONTENT-ASSET-CONTRACT.md` (dynamische Slug-Quellen, PUBLIC/GATED).

**Stand AP03 PT03.1 (2026-08-24):** Inventar vollständig (§4–§7).
**Stand AP03 PT03.2 (2026-08-24):** Seitentyp-Taxonomie und Rollenmodell vollständig (§8) — zehn
primäre Seitentypen, Rollenmatrix über alle 27 logischen Seiten, kontrollierte Vokabulare, vorläufige
Findability- und Indexierungsrollen.
**Stand AP03 PT03.3 (2026-08-24):** Die sieben Kernjourneys sind vollständig modelliert (§9), inklusive
Startpunkten, Zwischenstationen, Conversions, Lead-Typen, Consent-Grenze und Sackgassenanalyse (§9.4).
**Stand AP03 PT03.4 (2026-08-24):** Der Navigations- und Findability-Vertrag ist festgeschrieben (§10):
Header-IA, Diagnostik-/Mega-Menü-Rolle, Epigenetik als eigener Hauptnavigationspunkt, IglooPro-Einstiege,
Footer-IA, Consumer-Findability, Search-, Breadcrumb-, ChapterNav- und Crosslink-Policy, CTA-Findability,
locale-sichere Verlinkung sowie die **finale** Klassifikationsmatrix §10.15 über alle 27 Seitenfamilien.

**AP03 ist damit inhaltlich vollständig**; es folgt ausschließlich der Closure-Lauf.

Beide Primärtasks sind reine **Dokumentationsschritte**: keine Route, Navigation, Suche, Breadcrumb,
ChapterNav, SEO-, Content-, i18n- oder Lead-Änderung; keine Anwendungsdatei berührt.

---

## 2. Lesart des Inventars

### 2.1 Statuswerte

| Status              | Bedeutung                                                                       |
| ------------------- | ------------------------------------------------------------------------------- |
| **PRESENT**         | existiert heute als reale Route/Seite im Repository                             |
| **PARTIAL**         | existiert, erfüllt den Zielzustand aber nachweislich nicht (z. B. Sprachumfang) |
| **PLANNED**         | scope-verbindlich gefordert, heute noch **keine** Route/Seite                   |
| **LEGACY**          | Repository-Artefakt ohne Zielrolle im Relaunch                                  |
| **REDIRECT_SOURCE** | Einstiegspfad, der auf eine kanonische Route umleitet — **keine Inhaltsseite**  |
| **TECHNICAL**       | technischer Nicht-Seitenpfad, keine IA-Seite                                    |
| **NOT_FOUND**       | Statusfall für unbekannte Pfade — keine reguläre Inhaltsseite                   |

### 2.2 Logische Seitenfamilie ≠ Locale-Variante

Eine Seitenfamilie ist **eine** fachliche Entscheidung mit bis zu zehn Locale-Varianten — nicht zehn
Entscheidungen. Die URL-Abdeckung wird je Familie rechnerisch ausgewiesen (§7), das Inventar bleibt
fachlich lesbar (`AP03.md` §6.4).

### 2.3 Route Pattern ≠ Ressource

Ein Pfadmuster wie `/[lang]/articles/:slug` sagt **nicht**, dass ein beliebiger Slug existiert. Die
gültigen Slugs besitzt die fachliche Datenquelle (`ROUTING-CONTRACT.md` R-30/R-33,
`CONTENT-ASSET-CONTRACT.md` R-28-Grenze). Unbekannte Slugs liefern echte 404 (R-31).

### 2.4 Entscheidungsstand

Mit **PT03.4 sind alle IA-Klassifikationen final**; es bleibt kein `TBD`-Marker offen. Die
PT03.1-Platzhalter sind mit §8 aufgelöst, die vorläufigen Findability-Rollen mit **§10.15**.

Maßgebliche Quellen: **§8.4** für Seitentyp, Zielgruppe, Aufgabe und CTA · **§10.15** für Main Nav,
Footer, Search, Breadcrumb, ChapterNav, Direct/SEO-Entry und Crosslink · **§4** bleibt die Inventarsicht.

Wo eine Entscheidung ausdrücklich einem anderen AP gehört — etwa die Indexierbarkeit der Legal-Seiten
(`IAD-05`, AP20 PT20.4.8) — ist sie als solche benannt und nicht hier getroffen.

---

## 3. Sprach- und Indexierungsgrundlage

**Zielsprachmenge (alle Familien, sofern nicht ausdrücklich anders ausgewiesen):**
`de` `en` `pl` `fr` `it` `es` `pt` `da` `nl` `cs` — zehn Locales, `DEC-RL-001`,
`ROUTING-CONTRACT.md` R-17, `I18N-CONTRACT.md` I-01. Default und `x-default`: `de`.

**Indexierbarkeit** folgt ausschließlich `SEO-CONTRACT.md` (S-01–S-17) und `ROUTING-CONTRACT.md`
(R-23 Klassenpolicy, R-43–R-47). Dieses Dokument trifft **keine** eigene Indexierungsentscheidung.

---

## 4. Inventar — Seitenfamilien

Alle Pfade ohne Sprachpräfix notiert; die kanonische URL ist `/[lang]<pfad>`
(`ROUTING-CONTRACT.md` R-01/R-17). Spalten: **Ziel-Locales** = Zielzustand · **Ist-Locales** =
heutiger Stand.

### 4.1 Hauptseiten

| IA-ID    | Seitenfamilie        | Pfad           | Status      | Ziel-Locales | Ist-Locales | Zielgruppe         | Primäre Aufgabe                                  | Primärer CTA (vorläufig)          | Owner-AP |
| -------- | -------------------- | -------------- | ----------- | ------------ | ----------- | ------------------ | ------------------------------------------------ | --------------------------------- | -------- |
| **P-01** | Homepage             | `/`            | **PRESENT** | 10           | 10          | B2B-Praxis/Labor   | Einstieg, Leistungsüberblick, Primary Conversion | „Angebot anfragen"                | AP11     |
| **P-02** | About                | `/about`       | **PRESENT** | 10           | 10          | B2B, Presse        | Unternehmens- und Vertrauenskontext              | „Angebot anfragen"                | AP20     |
| **P-03** | Contact              | `/contact`     | **PRESENT** | 10           | 10          | B2B-Interessent    | allgemeine Anfrage aufnehmen                     | „Angebot anfragen"                | AP20     |
| **P-04** | Support              | `/support`     | **PRESENT** | 10           | 10          | **Bestandskunde**  | Supportfall melden — **kein** Sales-Lead         | Support-Anfrage (eigene Rolle)    | AP20     |
| **P-05** | Events               | `/events`      | **PRESENT** | 10           | 10          | B2B, Fachpublikum  | Messe-/Terminpräsenz, Kontaktanlass              | `EVENT_CONTACT` (§8.4)            | AP18     |
| **P-06** | Downloads / Resource | `/downloads`   | **PRESENT** | 10           | 10          | B2B, Bestandskunde | Materialien auffindbar und beziehbar machen      | Download (frei) · Gate (gated)    | AP19     |
| **P-07** | Article Index        | `/articles`    | **PRESENT** | 10           | 10          | B2B, Recherche     | Editorial-Einstieg und Themenüberblick           | `VIEW_DETAIL` (§8.4)              | AP17     |
| **P-08** | IglooPro (Produkt)   | `/igloo-pro`   | **PRESENT** | 10           | 10          | B2B-Entscheider    | Produktstrecke, Spezifikation, Anfrage           | „Angebot anfragen" · ROI/Download | AP14     |
| **P-09** | Diagnostics Hub      | `/diagnostics` | **PRESENT** | 10           | 10          | B2B-Praxis         | Einstieg in die neun Leistungsbereiche           | „Angebot anfragen"                | AP12     |
| **P-10** | **Epigenetik-Hub**   | `/epigenetics` | **PRESENT** | 10           | 10          | B2B + Fachanwender | Einstieg der **eigenständigen Geschäftssäule**   | Epigenetik-Inquiry (eigene Rolle) | AP15     |

Anmerkung zu **P-08**: Der ROI-Rechner ist heute eine **Section der Homepage**
(`src/components/sections/RoiCalculatorSection.tsx` in `HomePage.tsx`), keine eigene Seite. Ob er eine
eigene Route oder eine IglooPro-Section wird, entscheiden **AP11/AP14**; als CTA-Rolle ist er in §8.3
als `ROI_CALCULATE` geführt und in §8.4 P-01/P-08 als sekundärer CTA verankert. Der Claim
**`CV < 2 %`** ist gelockte Produktentscheidung (`DEC-RL-008`) und wird hier weder validiert noch
verändert.

### 4.2 Diagnostik-Services — dynamische Familie

| IA-ID    | Familie        | Pfadmuster           | Status      | Ressourcenquelle        | Ziel-Locales | Owner-AP |
| -------- | -------------- | -------------------- | ----------- | ----------------------- | ------------ | -------- |
| **P-11** | Service-Detail | `/diagnostics/:slug` | **PRESENT** | `src/data/services.tsx` | 10           | AP13     |

**Neun kanonische Service-Ressourcen** (Repository und Master-Scope stimmen überein — 9/9):

| #   | Service-ID                    | Pfad                                       | Status      |
| --- | ----------------------------- | ------------------------------------------ | ----------- |
| 1   | `dental`                      | `/diagnostics/dental`                      | **PRESENT** |
| 2   | `beauty`                      | `/diagnostics/beauty`                      | **PRESENT** |
| 3   | `longevity`                   | `/diagnostics/longevity`                   | **PRESENT** |
| 4   | `poc-systemloesungen`         | `/diagnostics/poc-systemloesungen`         | **PRESENT** |
| 5   | `praeventions-checks`         | `/diagnostics/praeventions-checks`         | **PRESENT** |
| 6   | `infektion-entzuendung`       | `/diagnostics/infektion-entzuendung`       | **PRESENT** |
| 7   | `stoffwechsel-herz`           | `/diagnostics/stoffwechsel-herz`           | **PRESENT** |
| 8   | `hormon-tests`                | `/diagnostics/hormon-tests`                | **PRESENT** |
| 9   | `kompatibilitaet-integration` | `/diagnostics/kompatibilitaet-integration` | **PRESENT** |

Ein Slug ohne Datensatz ist **keine** Seite und liefert echte 404 (`ROUTING-CONTRACT.md` R-30/R-31).
Der im Suchindex geführte Service `sports` besitzt **keine** Ressource — siehe Debt `IAD-04`.

### 4.3 Epigenetik — eigenständige Geschäftssäule

> **Verbindlich (`DEC-RL-005`, `ROUTING-CONTRACT.md` R-53, `RUNTIME-CONTRACT.md` RT-69):**
> Epigenetik ist eine **eigenständige Geschäftssäule** mit eigener IA, eigener SEO-Identität, eigener
> Findability und eigener Lead-Strecke — **keine Unterkategorie von `/diagnostics`**. Die heutige
> Navigationsunterordnung ist Ist-Zustand und Debt (`IAD-02`), **nicht** Zielarchitektur.

| IA-ID    | Seitenfamilie            | Pfad                       | Status      | Ziel-Locales | Ist-Locales | Primäre Aufgabe                         | Owner-AP  |
| -------- | ------------------------ | -------------------------- | ----------- | ------------ | ----------- | --------------------------------------- | --------- |
| **P-10** | Epigenetik-Hub           | `/epigenetics`             | **PRESENT** | 10           | 10          | Säulen-Einstieg, Panelüberblick         | AP15      |
| **P-12** | Vertiefung — Grundlagen  | `/epigenetics/grundlagen`  | **PRESENT** | 10           | 10          | fachliche Einordnung, Methodik          | AP15      |
| **P-13** | Vertiefung — Studienlage | `/epigenetics/studienlage` | **PRESENT** | 10           | 10          | Evidenzdarstellung                      | AP15      |
| **P-14** | Vertiefung — Unterlagen  | `/epigenetics/unterlagen`  | **PRESENT** | 10           | 10          | Unterlagen-/Download-Einstieg der Säule | AP15/AP19 |

### 4.4 Musterbefunde — dynamische Familie

| IA-ID    | Familie      | Pfadmuster                        | Status      | Ressourcenquelle       | Ziel-Locales | Ist-Locales    | Owner-AP |
| -------- | ------------ | --------------------------------- | ----------- | ---------------------- | ------------ | -------------- | -------- |
| **P-15** | Musterbefund | `/epigenetics/musterbefund/:slug` | **PARTIAL** | `src/content/befunde/` | 10           | **2** (de, en) | AP16     |

**Sechs kanonische Musterbefund-Ressourcen** — je eine explizite Route **vor** dem `:slug`-Auffangpfad
(`ROUTING-CONTRACT.md` R-08):

| #   | Slug                    | Pfad                                              | Status      |
| --- | ----------------------- | ------------------------------------------------- | ----------- |
| 1   | `metabolic-health`      | `/epigenetics/musterbefund/metabolic-health`      | **PRESENT** |
| 2   | `healthy-aging`         | `/epigenetics/musterbefund/healthy-aging`         | **PRESENT** |
| 3   | `biologische-altersuhr` | `/epigenetics/musterbefund/biologische-altersuhr` | **PRESENT** |
| 4   | `telomer-analyse`       | `/epigenetics/musterbefund/telomer-analyse`       | **PRESENT** |
| 5   | `stress-monitor`        | `/epigenetics/musterbefund/stress-monitor`        | **PRESENT** |
| 6   | `healthy-sport`         | `/epigenetics/musterbefund/healthy-sport`         | **PRESENT** |

Musterbefunde sind **Einstiegspunkte der Epigenetik-Säule** (`MASTER-SCOPE.md` §1.2/8), keine
Diagnostik-Unterseiten. Inhaltsdaten liegen heute nur in `de`/`en` — Debt `IAD-03`.

### 4.5 Artikel — dynamische Familie

| IA-ID    | Familie        | Pfadmuster        | Status      | Ressourcenquelle       | Ziel-Locales | Owner-AP |
| -------- | -------------- | ----------------- | ----------- | ---------------------- | ------------ | -------- |
| **P-16** | Artikel-Detail | `/articles/:slug` | **PRESENT** | `src/data/articles.ts` | 10           | AP17     |

**Sechs reale Artikel-Ressourcen.** Fachliche `id` und URL-`slug` sind getrennte Konzepte
(`CONTENT-ASSET-CONTRACT.md` CA-06) — die ID ist **nie** die URL:

| #   | Fachliche ID               | URL-Slug                                                        |
| --- | -------------------------- | --------------------------------------------------------------- |
| 1   | `green_practice`           | `die-gruene-praxis`                                             |
| 2   | `invisible_patient`        | `der-unsichtbare-patient`                                       |
| 3   | `five_minute_diagnosis`    | `die-5-minuten-diagnose`                                        |
| 4   | `ecosystem_of_rapid_tests` | `the-ecosystem-of-rapid-tests-why-compatibility-creates-safety` |
| 5   | `rapid_setup_formula`      | `die-performance-formel-effizienz-in-der-poc-diagnostik`        |
| 6   | `precision_point_of_care`  | `precision-in-point-of-care-the-key-to-patient-safety`          |

Historische Artikel-IDs aus Legacy-Skripten sind **keine** Relaunch-Ressourcen und werden hier nicht
geführt (AP17 PT17.3.4).

### 4.6 Events — Seite und Ressourcen

| IA-ID    | Familie     | Pfad      | Status      | Ressourcenquelle     | Ziel-Locales | Owner-AP |
| -------- | ----------- | --------- | ----------- | -------------------- | ------------ | -------- |
| **P-05** | Event-Seite | `/events` | **PRESENT** | `src/data/events.ts` | 10           | AP18     |

**Neun Event-Datensätze** existieren als **Inhalt der Seite**, nicht als eigene Routen — es gibt kein
`/events/:slug`. Ein Event ist damit eine **Ressource**, keine Seitenfamilie. Ob einzelne Events je
eine eigene Route erhalten, ist **nicht** entschieden und gehört AP18; PT03.1 erfindet dafür keine
Route.

### 4.7 Downloads und Resources

| IA-ID    | Familie                         | Pfad         | Status      | Ziel-Locales | Owner-AP  |
| -------- | ------------------------------- | ------------ | ----------- | ------------ | --------- |
| **P-06** | Downloads-/Resource-Hub         | `/downloads` | **PRESENT** | 10           | AP19      |
| **P-17** | **Gated Resource / Gate-Rolle** | —            | **PLANNED** | 10           | AP19/AP22 |

**P-17** ist heute **keine Route**: es existiert **kein** Gating-Mechanismus
(`CONTENT-ASSET-CONTRACT.md` `CD-8`). `DEC-RL-014` verlangt jedoch **mindestens einen** gated
Secondary-Conversion-Pfad. Welche Ressource gegated wird und in welcher Form die Gate-Seite/-Rolle
entsteht, entscheidet **AP19 PT19.3/PT19.4** — PT03.1 legt weder Route noch Asset fest.

Ressourcenlage heute: `src/content/downloads.json` führt **3** Einträge; die **26** Epigenetik-PDFs und
**3** ZIPs unter `public/downloads/` erscheinen dort nicht (Debt `IAD-06`).

### 4.8 Consumer — drei Seitenfamilien × 10 Locales

> **Verbindlich (`DEC-RL-006`, `REST-03`, `ROUTING-CONTRACT.md` R-52, `RUNTIME-CONTRACT.md`
> RT-67/RT-68, `SEO-CONTRACT.md` S-09):** Consumer ist ein **öffentlich indexierbarer, vollwertiger
> SEO-Bereich in allen zehn Sprachen**. Kein `noindex`, keine Basic Auth, kein EN-only-Zielbild, keine
> SPA-Sonderarchitektur. Der heutige `/en/`-Zwang ist Ist-Zustand und Debt (`IAD-01`), **nicht** Ziel.

| IA-ID    | Seitenfamilie             | Pfad                         | Status      | Ziel-Locales | Ist-Locales | Primäre Aufgabe                       | Primärer CTA       | Owner-AP |
| -------- | ------------------------- | ---------------------------- | ----------- | ------------ | ----------- | ------------------------------------- | ------------------ | -------- |
| **P-18** | Consumer Vitamin-D3-Spray | `/consumer/vitamin-d3-spray` | **PARTIAL** | **10**       | **1** (en)  | Produkt erklären, Bestellung auslösen | Bestellung (Order) | AP21     |
| **P-19** | Consumer Hydrating Masks  | `/consumer/hydrating-masks`  | **PARTIAL** | **10**       | **1** (en)  | wie oben                              | Bestellung (Order) | AP21     |
| **P-20** | Consumer Inside-Out Duo   | `/consumer/inside-out-duo`   | **PARTIAL** | **10**       | **1** (en)  | Bundle erklären, Bestellung auslösen  | Bestellung (Order) | AP21     |

Consumer ist **B2C** und damit eine andere Zielgruppe als der übrige B2B-Bestand. Eine Aufnahme in die
B2B-Hauptnavigation ist **nicht** automatisch erforderlich (AP21 PT21.6.9); die interne Findability
wird bewusst in **PT03.4** festgelegt (`IA-12`).

Ein **`/consumer`-Hub** ist **nicht beschlossen** (AP09 PT09.3.6 stellt ihn ausdrücklich unter
Vorbehalt) und wird hier **nicht** als Seite geführt.

### 4.9 Legal

| IA-ID    | Seitenfamilie | Pfad       | Status      | Ziel-Locales | Ist-Locales | Indexierbarkeit                    | Owner-AP |
| -------- | ------------- | ---------- | ----------- | ------------ | ----------- | ---------------------------------- | -------- |
| **P-21** | Privacy       | `/privacy` | **PRESENT** | 10           | 10          | **offene Policy** — siehe `IAD-05` | AP20     |
| **P-22** | Imprint       | `/imprint` | **PRESENT** | 10           | 10          | **offene Policy** — siehe `IAD-05` | AP20     |
| **P-23** | Terms         | `/terms`   | **PRESENT** | 10           | 10          | **offene Policy** — siehe `IAD-05` | AP20     |

Weitere kanonische Legal-Routen existieren nicht. Die Indexierbarkeit ist eine offene Entscheidung von
**AP20 PT20.4.8** (`SEO-CONTRACT.md` SD-2) — PT03.1 entscheidet sie nicht.

### 4.10 Spezialseiten

| IA-ID    | Seitenfamilie              | Pfad                        | Status      | Ziel-Locales                           | Ist-Locales | Rolle                                  | Owner-AP  |
| -------- | -------------------------- | --------------------------- | ----------- | -------------------------------------- | ----------- | -------------------------------------- | --------- |
| **P-24** | S3-Leitlinie               | `/s3_leitlinie`             | **PRESENT** | **single-locale `de`**, solange gültig | 1 (de)      | fachliche Landingpage, deutscher Markt | AP08/AP20 |
| **P-25** | Vitamin D3 & Implantologie | `/vitamin-d3-implantologie` | **PRESENT** | **single-locale `de`**, solange gültig | 1 (de)      | fachliche Landingpage, deutscher Markt | AP08/AP20 |
| **P-26** | Vitamin D3 Spray (**B2B**) | `/vitamin-d3-spray`         | **PRESENT** | 10                                     | 10          | B2B-Pendant zur Consumer-Produktseite  | AP14/AP20 |

**P-24/P-25** tragen heute eine deklarierte Einsprachigkeit (`GERMAN_ONLY_PATHS`,
`ROUTING-CONTRACT.md` R-15/R-45, `SEO-CONTRACT.md` S-17). Der **Abbau** dieser Sonderlogik ist
**AP08 PT08.4.3 vorbehalten** — PT03.1 stuft sie weder zu Kernseiten hoch noch entscheidet sie um.

**P-26** ist eine reguläre B2B-Seite und **nicht** identisch mit der Consumer-Familie **P-18**; sie ist
bewusst nicht in der Sitemap geführt, aber als bekannte Route erreichbar (`EXTRA_KNOWN_PATHS`).

### 4.11 Geplante Rollen ohne heutige Route

| IA-ID    | Rolle                        | Status      | Begründung                                                                                            | Owner-AP  |
| -------- | ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------------- | --------- |
| **P-17** | Gated Resource / Lead-Magnet | **PLANNED** | `DEC-RL-014` verlangt mindestens einen gated Pfad; heute existiert keiner                             | AP19/AP22 |
| **P-27** | **Epigenetik-Inquiry**       | **PLANNED** | `DEC-RL-011` verlangt eine **eigene** Inquiry-/Lead-Strecke; heute multiplext sie über `/api/contact` | AP15/AP22 |

Ob **P-27** eine eigene Route, ein Abschnitt des Hubs oder ein wiederverwendbarer Formularkontext wird,
entscheidet **AP15**; die Rolle ist in §8.4 als `T8` / `epigenetics-inquiry` festgeschrieben (P-27). Verbindlich ist nur: die Strecke ist **eigenständig** und wird
nicht als allgemeiner Contact-Lead behandelt (`LEAD-DATA-CONTRACT.md` §5.1,
`CRM-INTEGRATION.md` §5.2).

---

## 5. Redirect Sources — keine Inhaltsseiten

> **`IA-23`:** Eine Redirect Source ist **keine** Inhaltsseite. Sie trägt keinen Canonical, kein
> hreflang, keinen Sitemap-Eintrag, keinen Search-Treffer und keinen eigenen CTA
> (`ROUTING-CONTRACT.md` R-37).

| IA-ID    | Quelle                    | Ziel                        | Klasse                  | Status heute                                             | Owner-AP                                         |
| -------- | ------------------------- | --------------------------- | ----------------------- | -------------------------------------------------------- | ------------------------------------------------ | --------- |
| **X-01** | `/services`               | `/[lang]/diagnostics`       | Struktur-Brücke         | **PARTIAL** — clientseitiges `<Navigate>`, kein HTTP-301 | AP10                                             |
| **X-02** | `/services/:slug`         | `/[lang]/diagnostics/:slug` | Struktur-Brücke         | **PARTIAL** — clientseitig                               | AP10                                             |
| **X-03** | `/agb`                    | `/[lang]/terms`             | Legacy-Migration        | **PRESENT** — echte 301, ein Hop                         | AP10                                             |
| **X-04** | `/s3-leitlinie`           | `/de/s3_leitlinie`          | Alias/Schreibweise      | **PRESENT** — echte 301, ein Hop                         | AP10                                             |
| **X-05** | unpräfixierte Seiten-URLs | `/de<pfad>`                 | Locale-Canonicalization | **PRESENT** — echte 301                                  | AP10                                             |
| **X-06** | `/de                      | /<lang>/consumer/\*`        | `/en/consumer/*`        | **kein Ziel** — Debt                                     | **LEGACY** — Sprachzwang, widerspricht `REST-03` | AP21/AP10 |

**X-01/X-02** müssen im Ziel eine **echte serverseitige 301-Brücke** in einem Hop sein
(`ROUTING-CONTRACT.md` R-38, `MASTER-SCOPE.md` AP10 PT10.1.2). **X-06** ist **keine** zulässige
Redirect-Klasse im Zielbild (`ROUTING-CONTRACT.md` R-34/R-52) und wird als Debt `IAD-01` geführt.

Historische Sprungmarken der Epigenetik-Strecke (`src/content/befunde/legacyAnchors.ts`) bleiben
erhalten (`ROUTING-CONTRACT.md` R-14); sie sind Anker, keine Seiten.

---

## 6. Sonderzustände und technische Nicht-Seiten

### 6.1 Not Found

| IA-ID    | Zustand   | Pfad                  | Status        | Verbindlich                                                                                                                                  |
| -------- | --------- | --------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **N-01** | Not Found | jeder unbekannte Pfad | **NOT_FOUND** | echter HTTP 404 · **kein** Canonical · **kein** hreflang · robots `noindex, follow` · **nicht** in der Sitemap · **kein** regulärer CTA-Pfad |

Grundlage: `ROUTING-CONTRACT.md` R-05/R-39/R-46, `RUNTIME-CONTRACT.md` RT-55, `SEO-CONTRACT.md` S-04.
404 gilt für unbekannte statische Pfade **und** unbekannte dynamische Slugs. Ein **Laufzeitfehler**
einer bekannten Route ist ausdrücklich **kein** 404 (`RUNTIME-CONTRACT.md` RT-57/RT-58) und damit auch
kein IA-Zustand.

### 6.2 Technische Nicht-Seitenpfade

Keine IA-Seiten; hier nur zur Abgrenzung geführt (`ROUTING-CONTRACT.md` R-22):

| IA-ID    | Pfadklasse                 | Rolle                                | Keine IA-Seite, weil                                            |
| -------- | -------------------------- | ------------------------------------ | --------------------------------------------------------------- |
| **T-01** | `/api/*`                   | Backend-/Formularschnittstelle       | keine Locale-Weiche, kein Seiten-404                            |
| **T-02** | gebaute Assets             | Bilder, Skripte, Styles              | Auslieferungsartefakt                                           |
| **T-03** | Locale-Ressourcen          | Übersetzungsdateien                  | Datenquelle, keine Seite                                        |
| **T-04** | `sitemap.xml`              | SEO-Artefakt                         | abgeleitet, keine Inhaltsseite                                  |
| **T-05** | `robots.txt`               | Crawler-Policy                       | Konfiguration                                                   |
| **T-06** | statische Download-Dateien | PDFs, ZIPs unter `public/downloads/` | Assets — Zugangsklasse regelt `CONTENT-ASSET-CONTRACT.md` CA-30 |

---

## 7. Abdeckung und Zählung

| Kategorie                                  | Familien/Ressourcen | URL-Abdeckung im Ziel (ohne Redirects/technische Pfade) |
| ------------------------------------------ | ------------------- | ------------------------------------------------------- |
| Hauptseiten (P-01–P-10)                    | 10 Familien         | 10 × 10 = **100**                                       |
| Diagnostik-Services (P-11)                 | 9 Ressourcen        | 9 × 10 = **90**                                         |
| Epigenetik-Vertiefungen (P-12–P-14)        | 3 Familien          | 3 × 10 = **30**                                         |
| Musterbefunde (P-15)                       | 6 Ressourcen        | 6 × 10 = **60**                                         |
| Artikel (P-16)                             | 6 Ressourcen        | 6 × 10 = **60**                                         |
| Consumer (P-18–P-20)                       | 3 Familien          | 3 × 10 = **30**                                         |
| Legal (P-21–P-23)                          | 3 Familien          | 3 × 10 = **30**                                         |
| Spezialseiten (P-24–P-26)                  | 3 Familien          | 1 + 1 + 10 = **12**                                     |
| **Summe indexierbarer Zielkandidaten**     | —                   | **412** (Policy je Route entscheidet AP09/AP20)         |
| Geplante Rollen ohne Route (P-17, P-27)    | 2                   | offen — AP19/AP15                                       |
| Redirect Sources (X-01–X-06)               | 6                   | **keine** Seiten-URLs                                   |
| Not Found (N-01) · technische Pfade (T-\*) | 1 + 6               | **keine** Seiten-URLs                                   |

Die Zahl ist eine **Zielabdeckungsrechnung**, kein Sitemap-Sollwert: welche URL tatsächlich in die
Sitemap gehört, entscheidet die Route-Policy (`ROUTING-CONTRACT.md` R-49, `SEO-CONTRACT.md` S-08).
Zum Vergleich der Ist-Stand: `SITEMAP_ROUTES` führt heute 36 Pfade × 10 Sprachen plus 3 Consumer-
Einträge (nur `/en/`) und 2 einsprachige Sonderseiten.

---

## 8. Seitentypen und Rollen (AP03 PT03.2)

**Stand PT03.2 (2026-08-24):** Taxonomie und Rollenmodell festgeschrieben. Jede logische Inhaltsseite
aus §4 besitzt **genau einen** primären Seitentyp; keine Seite bleibt `UNCLASSIFIED`. Journeys
(PT03.3) und die finale Findability-Strategie (PT03.4) sind in §8.6 reserviert und **nicht**
vorweggenommen.

> **Seitentyp ≠ Template-Zwang.** Der Typ beschreibt fachliche und IA-seitige Rolle. Er schreibt kein
> Layout, keine Komponente und keine Design-Entscheidung vor — die gehören AP05 und den jeweiligen
> Seiten-APs.

### 8.1 Primäre Seitentypen

Die zehn Typen aus `MASTER-SCOPE.md` AP03 PT03.2. Technische Pfade erhalten **keinen** dieser Typen
(§8.5).

| ID      | Seitentyp            | Kernaufgabe                                        | Zulässige Sekundärrollen                                          |
| ------- | -------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **T1**  | **HOMEPAGE**         | zentraler Einstieg, Positionierung, Weiterleitung  | `conversion-entry`                                                |
| **T2**  | **HUB_OVERVIEW**     | Orientierung, Auswahl, Vergleich, Weiterleitung    | `corporate` · `resource-hub` · `editorial-index` · `pillar-entry` |
| **T3**  | **SERVICE_DETAIL**   | diagnostische Leistung verstehen und bewerten      | `decision-support` · `proof`                                      |
| **T4**  | **PRODUCT_PAGE**     | Produktverständnis, Specs, Proof, Entscheidung     | `decision-support` · `proof`                                      |
| **T5**  | **EPIGENETICS_PAGE** | Entscheidung, Panel-Verständnis, Evidenz der Säule | `decision-support` · `evidence` · `panel-sample` · `resource`     |
| **T6**  | **EDITORIAL**        | fachliche Information, Relevanz, Vertrauen         | `article` · `event` · `knowledge-landing`                         |
| **T7**  | **CONSUMER_LANDING** | Consumer-Produkt verstehen und bestellen           | `transactional`                                                   |
| **T8**  | **FORM_LEAD**        | qualifizierte Nutzerhandlung ermöglichen           | `general-inquiry` · `epigenetics-inquiry` · `gate-form`           |
| **T9**  | **RESOURCE**         | Ressource bereitstellen bzw. gegen Gate ausliefern | `public-resource` · `gated-lead-magnet`                           |
| **T10** | **LEGAL_SUPPORT**    | rechtliche Information **oder** Hilfe/Service      | `legal` · `support`                                               |

**Zu T10:** Der Master-Scope führt Legal und Support als **einen** Seitentyp. Dieses Dokument hält sie
über **zwei verbindlich getrennte Sekundärrollen** auseinander: `legal` hat typischerweise CTA `NONE`,
`support` hat eine **eigene** Support-CTA-Rolle und ist **kein** Sales-Lead (§8.2, `IA-06`).

### 8.2 Rollenmodell je Seitentyp

| Typ     | Hauptzielgruppe                                           | Primäre Nutzerabsicht                                    | Hauptaufgabe                     | Primärer CTA (Rolle)                         | Zulässige sekundäre CTA-Rollen                              | Typische Einstiege                         | Typischer nächster Schritt                       | Conversion-Rolle                     | Owner-AP              |
| ------- | --------------------------------------------------------- | -------------------------------------------------------- | -------------------------------- | -------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------ | ------------------------------------ | --------------------- |
| **T1**  | `B2B_PROSPECT`                                            | `orient`                                                 | Orientierung                     | `QUOTE_REQUEST`                              | `ROI_CALCULATE` · `GATE_SUBMIT` · `VIEW_DETAIL`             | Direkt, Marke, Kampagne                    | Hub, Produkt, Säule oder Anfrage                 | `PRIMARY_CONVERSION`                 | AP11                  |
| **T2**  | `B2B_PROSPECT`                                            | `orient` / `compare`                                     | Orientierung                     | `VIEW_DETAIL`                                | `QUOTE_REQUEST` · `DOWNLOAD_PUBLIC` · `EPIGENETICS_INQUIRY` | Homepage, Navigation, Suche                | Detailseite der jeweiligen Familie               | `ASSISTING`                          | je Familie            |
| **T3**  | `B2B_PROSPECT`                                            | `evaluate`                                               | Entscheidung                     | `QUOTE_REQUEST`                              | `DOWNLOAD_PUBLIC` · `VIEW_DETAIL`                           | Hub, Suche, Artikel-Crosslink              | Anfrage oder verwandte Leistung                  | `PRIMARY_CONVERSION`                 | AP13                  |
| **T4**  | `B2B_PROSPECT`                                            | `evaluate`                                               | Entscheidung                     | `QUOTE_REQUEST`                              | `ROI_CALCULATE` · `DOWNLOAD_PUBLIC`                         | Homepage, Navigation, Suche                | Anfrage, ROI oder Unterlagen                     | `PRIMARY_CONVERSION`                 | AP14                  |
| **T5**  | `PROFESSIONAL_AUDIENCE`                                   | `understand` / `read_evidence` / `inspect_sample_report` | fachliche Erklärung bzw. Proof   | `EPIGENETICS_INQUIRY`                        | `VIEW_SAMPLE_REPORT` · `DOWNLOAD_PUBLIC` · `VIEW_DETAIL`    | Epigenetik-Hub, Suche, Direkt-URL          | weitere Vertiefung, Musterbefund oder Inquiry    | `ASSISTING`                          | AP15 / AP16           |
| **T6**  | `B2B_PROSPECT` · `PROFESSIONAL_AUDIENCE`                  | `understand`                                             | fachliche Erklärung              | **kontextabhängig**                          | `QUOTE_REQUEST` · `VIEW_DETAIL` · `EVENT_CONTACT`           | Index, Suche, Crosslink, extern            | fachlich passende Lösung — **kein Einheits-CTA** | `ASSISTING`                          | AP17 / AP18           |
| **T7**  | `CONSUMER`                                                | `order`                                                  | Bestellung                       | `ORDER`                                      | `NONE`                                                      | Suchmaschine, Kampagne, Social             | Bestellabschluss                                 | `PRIMARY_CONVERSION`                 | AP21 / AP22           |
| **T8**  | je Journey                                                | `request_quote` / `contact`                              | Conversion                       | journeyspezifisch                            | `NONE` — **kein Einheitsformular**                          | Seite der jeweiligen Journey               | Bestätigung und Nachverfolgung                   | `PRIMARY_CONVERSION`                 | AP20/AP15/AP19 + AP22 |
| **T9**  | `B2B_PROSPECT` · `EXISTING_CUSTOMER`                      | `download`                                               | Download                         | `DOWNLOAD_PUBLIC` **oder** `GATE_SUBMIT`     | `VIEW_DETAIL`                                               | Resource-Hub, Säulenseite, Artikel         | weitere Ressource oder Anfrage                   | `ASSISTING` / `SECONDARY_CONVERSION` | AP19 / AP22           |
| **T10** | `GENERAL_VISITOR` (legal) · `EXISTING_CUSTOMER` (support) | `understand` / `get_support`                             | rechtliche Information / Support | `NONE` (legal) · `SUPPORT_REQUEST` (support) | `NONE`                                                      | Footer (legal), Navigation/Suche (support) | legal: keiner · support: Fallbearbeitung         | `NONE` / `PRIMARY_CONVERSION`        | AP20 / AP22           |

**Informationshierarchie** ist je Typ eine Design-/Content-Frage und bleibt AP04/AP05 und den
Seiten-APs; PT03.2 legt sie nicht fest.

### 8.3 Kontrollierte Vokabulare

Klein und konsistent gehalten — keine Persona-Erfindung, keine Intent-Synonyme.

**Zielgruppen:** `B2B_PROSPECT` · `EXISTING_CUSTOMER` · `CONSUMER` · `PROFESSIONAL_AUDIENCE`
(fachlich/klinisch qualifiziertes Publikum, insbesondere der Epigenetik-Säule) · `GENERAL_VISITOR`.

**Nutzerabsichten:** `orient` · `compare` · `understand` · `evaluate` · `read_evidence` ·
`inspect_sample_report` · `request_quote` · `order` · `download` · `get_support` · `contact`.

**Primäre Aufgaben:** Orientierung · Entscheidung · fachliche Erklärung · Proof · Conversion ·
Bestellung · Download · Support · rechtliche Information.

**CTA-Rollen:**

| Rolle                 | Bedeutung                                                 | Bezug                             |
| --------------------- | --------------------------------------------------------- | --------------------------------- |
| `QUOTE_REQUEST`       | **allgemeiner B2B-Sales-Anfrageweg — „Angebot anfragen"** | `DEC-RL-013`, `IA-07`             |
| `ORDER`               | Consumer-Bestellhandlung                                  | `consumer_order`                  |
| `EPIGENETICS_INQUIRY` | eigene Anfrage der Epigenetik-Säule                       | `DEC-RL-011`                      |
| `SUPPORT_REQUEST`     | Supportfall melden — **kein** Sales-Lead                  | AP20 PT20.3                       |
| `GATE_SUBMIT`         | Gate-Formular eines gegateten Assets                      | `DEC-RL-014`, `content_download`  |
| `DOWNLOAD_PUBLIC`     | frei zugängliche Ressource beziehen                       | `CONTENT-ASSET-CONTRACT.md` CA-30 |
| `ROI_CALCULATE`       | ROI-Rechner nutzen                                        | AP11/AP14                         |
| `VIEW_SAMPLE_REPORT`  | Musterbefund ansehen                                      | AP16                              |
| `VIEW_DETAIL`         | in die passende Detailseite wechseln                      | —                                 |
| `EVENT_CONTACT`       | Terminbezogener Kontakt                                   | AP18                              |
| `CONTACT`             | allgemeiner Kontakt ohne Angebotsabsicht                  | AP20                              |
| `NONE`                | bewusst kein CTA                                          | —                                 |

**Conversion-Rollen:** `PRIMARY_CONVERSION` · `SECONDARY_CONVERSION` · `ASSISTING` · `NONE`,
jeweils mit dem AP02-Lead-Typ aus `LEAD-DATA-CONTRACT.md` §5.1, wo einer entsteht. Das Lead-Ziel ist
**Persistenz + CRM** (`DEC-RL-009`) — **kein Mail-only-Modell**.

### 8.4 Rollenmatrix je logischer Seite — Zweck und CTA

Alle 27 logischen Seiten aus §4. **Keine Seite ist `UNCLASSIFIED`.**

| IA-ID    | Seite                      | Typ     | Sekundärrolle         | Zielgruppe                                    | Absicht                 | Hauptaufgabe           | Primärer CTA                       | Sekundärer CTA                              | Conversion-Rolle · Lead-Typ                     |
| -------- | -------------------------- | ------- | --------------------- | --------------------------------------------- | ----------------------- | ---------------------- | ---------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| **P-01** | Homepage                   | **T1**  | `conversion-entry`    | `B2B_PROSPECT`                                | `orient`                | Orientierung           | `QUOTE_REQUEST`                    | `ROI_CALCULATE` · `GATE_SUBMIT`             | `PRIMARY_CONVERSION` · `general_inquiry`        |
| **P-02** | About                      | **T2**  | `corporate`           | `B2B_PROSPECT` · `GENERAL_VISITOR`            | `understand`            | Vertrauen              | `CONTACT`                          | `NONE`                                      | `ASSISTING` · —                                 |
| **P-03** | Contact                    | **T8**  | `general-inquiry`     | `B2B_PROSPECT`                                | `request_quote`         | Conversion             | `QUOTE_REQUEST`                    | `NONE`                                      | `PRIMARY_CONVERSION` · `general_inquiry`        |
| **P-04** | Support                    | **T10** | `support`             | `EXISTING_CUSTOMER`                           | `get_support`           | Support                | `SUPPORT_REQUEST`                  | `NONE` — **kein Sales-CTA**                 | `PRIMARY_CONVERSION` · `support`                |
| **P-05** | Events                     | **T6**  | `event`               | `B2B_PROSPECT` · `PROFESSIONAL_AUDIENCE`      | `orient`                | fachliche Erklärung    | `EVENT_CONTACT`                    | `QUOTE_REQUEST`                             | `ASSISTING` · —                                 |
| **P-06** | Downloads-/Resource-Hub    | **T2**  | `resource-hub`        | `B2B_PROSPECT` · `EXISTING_CUSTOMER`          | `download`              | Orientierung           | `DOWNLOAD_PUBLIC`                  | `GATE_SUBMIT`                               | `ASSISTING` · —                                 |
| **P-07** | Article Index              | **T2**  | `editorial-index`     | `B2B_PROSPECT`                                | `orient`                | Orientierung           | `VIEW_DETAIL`                      | `NONE`                                      | `ASSISTING` · —                                 |
| **P-08** | IglooPro                   | **T4**  | `decision-support`    | `B2B_PROSPECT`                                | `evaluate`              | Entscheidung           | `QUOTE_REQUEST`                    | `ROI_CALCULATE` · `DOWNLOAD_PUBLIC`         | `PRIMARY_CONVERSION` · `general_inquiry`        |
| **P-09** | Diagnostics Hub            | **T2**  | —                     | `B2B_PROSPECT`                                | `compare`               | Orientierung           | `VIEW_DETAIL`                      | `QUOTE_REQUEST`                             | `ASSISTING` · —                                 |
| **P-10** | **Epigenetik-Hub**         | **T2**  | `pillar-entry`        | `PROFESSIONAL_AUDIENCE` · `B2B_PROSPECT`      | `orient`                | Orientierung           | `EPIGENETICS_INQUIRY`              | `VIEW_SAMPLE_REPORT` · `VIEW_DETAIL`        | `PRIMARY_CONVERSION` · `epigenetics_inquiry`    |
| **P-11** | Service-Detail (× 9)       | **T3**  | `decision-support`    | `B2B_PROSPECT`                                | `evaluate`              | Entscheidung           | `QUOTE_REQUEST`                    | `DOWNLOAD_PUBLIC` · `VIEW_DETAIL`           | `PRIMARY_CONVERSION` · `general_inquiry`        |
| **P-12** | Epigenetik — Grundlagen    | **T5**  | `decision-support`    | `PROFESSIONAL_AUDIENCE`                       | `understand`            | fachliche Erklärung    | `EPIGENETICS_INQUIRY`              | `VIEW_SAMPLE_REPORT`                        | `ASSISTING` · —                                 |
| **P-13** | Epigenetik — Studienlage   | **T5**  | `evidence`            | `PROFESSIONAL_AUDIENCE`                       | `read_evidence`         | Proof                  | `EPIGENETICS_INQUIRY`              | `DOWNLOAD_PUBLIC`                           | `ASSISTING` · —                                 |
| **P-14** | Epigenetik — Unterlagen    | **T5**  | `resource`            | `PROFESSIONAL_AUDIENCE` · `EXISTING_CUSTOMER` | `download`              | Download               | `DOWNLOAD_PUBLIC`                  | `EPIGENETICS_INQUIRY`                       | `ASSISTING` · — _(Gate-Kandidat, AP19)_         |
| **P-15** | Musterbefund (× 6)         | **T5**  | `panel-sample`        | `PROFESSIONAL_AUDIENCE`                       | `inspect_sample_report` | Proof                  | `EPIGENETICS_INQUIRY`              | `VIEW_DETAIL`                               | `ASSISTING` · —                                 |
| **P-16** | Artikel-Detail (× 6)       | **T6**  | `article`             | `B2B_PROSPECT`                                | `understand`            | fachliche Erklärung    | `VIEW_DETAIL` _(fachlich passend)_ | `QUOTE_REQUEST` _(wo inhaltlich begründet)_ | `ASSISTING` · —                                 |
| **P-17** | **Gated Resource**         | **T9**  | `gated-lead-magnet`   | `B2B_PROSPECT`                                | `download`              | Conversion             | `GATE_SUBMIT`                      | `NONE`                                      | **`SECONDARY_CONVERSION`** · `content_download` |
| **P-18** | Consumer Vitamin-D3-Spray  | **T7**  | `transactional`       | `CONSUMER`                                    | `order`                 | Bestellung             | `ORDER`                            | `NONE`                                      | `PRIMARY_CONVERSION` · `consumer_order`         |
| **P-19** | Consumer Hydrating Masks   | **T7**  | `transactional`       | `CONSUMER`                                    | `order`                 | Bestellung             | `ORDER`                            | `NONE`                                      | `PRIMARY_CONVERSION` · `consumer_order`         |
| **P-20** | Consumer Inside-Out Duo    | **T7**  | `transactional`       | `CONSUMER`                                    | `order`                 | Bestellung             | `ORDER`                            | `NONE`                                      | `PRIMARY_CONVERSION` · `consumer_order`         |
| **P-21** | Privacy                    | **T10** | `legal`               | `GENERAL_VISITOR`                             | `understand`            | rechtliche Information | **`NONE`**                         | `NONE`                                      | `NONE` · —                                      |
| **P-22** | Imprint                    | **T10** | `legal`               | `GENERAL_VISITOR`                             | `understand`            | rechtliche Information | **`NONE`**                         | `NONE`                                      | `NONE` · —                                      |
| **P-23** | Terms                      | **T10** | `legal`               | `GENERAL_VISITOR`                             | `understand`            | rechtliche Information | **`NONE`**                         | `NONE`                                      | `NONE` · —                                      |
| **P-24** | S3-Leitlinie               | **T6**  | `knowledge-landing`   | `PROFESSIONAL_AUDIENCE`                       | `understand`            | fachliche Erklärung    | `QUOTE_REQUEST`                    | `VIEW_DETAIL`                               | `ASSISTING` · —                                 |
| **P-25** | Vitamin D3 & Implantologie | **T6**  | `knowledge-landing`   | `PROFESSIONAL_AUDIENCE`                       | `understand`            | fachliche Erklärung    | `QUOTE_REQUEST`                    | `VIEW_DETAIL`                               | `ASSISTING` · —                                 |
| **P-26** | Vitamin D3 Spray (**B2B**) | **T4**  | —                     | `B2B_PROSPECT`                                | `evaluate`              | Entscheidung           | `QUOTE_REQUEST`                    | `DOWNLOAD_PUBLIC`                           | `PRIMARY_CONVERSION` · `general_inquiry`        |
| **P-27** | **Epigenetik-Inquiry**     | **T8**  | `epigenetics-inquiry` | `PROFESSIONAL_AUDIENCE`                       | `request_quote`         | Conversion             | `EPIGENETICS_INQUIRY`              | `NONE`                                      | `PRIMARY_CONVERSION` · `epigenetics_inquiry`    |

**Verbindliche Lesarten dieser Matrix:**

- **P-24/P-25 sind bewusst nicht `T3`.** Sie sind fachliche Wissens-Landingpages, keine
  Diagnostik-Leistungsseiten; die historische URL-Struktur begründet keinen Seitentyp (`AP03.md` §7.5).
- **P-26 ist bewusst `T4`, nicht `T7`.** Es ist das B2B-Pendant, nicht die Consumer-Familie.
- **P-16 erhält keinen Einheits-CTA.** Der nächste Schritt folgt dem Artikelthema; ein pauschaler
  kommerzieller CTA auf jedem Artikel ist ausdrücklich nicht das Ziel (`IAD-12`).
- **P-04 trägt keinen Sales-CTA.** Support ist eine eigene Journey mit eigenem Lead-Typ.
- **P-14 ist heute `public-resource`.** Ob es zum gated Pfad wird, entscheidet **AP19 PT19.4** — PT03.2
  legt kein Asset fest.

### 8.5 Technische Klassifikation — keine Inhaltsseiten

Redirect Sources, Not Found und technische Pfade erhalten **keinen** Seitentyp aus §8.1 und **keine**
Zielgruppen-, Aufgaben- oder CTA-Rolle.

| Klasse           | IA-IDs        | Klassifikation    | CTA | Conversion | Indexierbarkeit                  |
| ---------------- | ------------- | ----------------- | --- | ---------- | -------------------------------- |
| Redirect Sources | `X-01`–`X-06` | `REDIRECT_SOURCE` | —   | —          | **keine Inhaltsseite** (`IA-23`) |
| Not Found        | `N-01`        | `NOT_FOUND`       | —   | —          | **nicht indexierbar** (`IA-24`)  |
| Technische Pfade | `T-01`–`T-06` | `TECHNICAL_PATH`  | —   | —          | nicht anwendbar                  |

### 8.6 Findability- und Indexierungsrollen

**Diese Rollen sind seit PT03.4 final und stehen in §10.15.** PT03.2 hatte sie vorläufig klassifiziert;
die Tabelle wurde nicht dupliziert, um Drift zu vermeiden — **§10.15 ist die einzige Rollenquelle für
Main Nav, Footer, Search, Breadcrumb, ChapterNav, Direct/SEO-Entry und Crosslink**.

Die **Indexierbarkeit** bleibt davon getrennt und folgt ausschließlich `SEO-CONTRACT.md` und
`ROUTING-CONTRACT.md`: reguläre Seiten indexierbar · **Consumer indexierbar × 10** (S-09,
`DEC-RL-006`) · Epigenetik vollständig indexierbar (S-10) · Legal mit offener Policy (`IAD-05`,
AP20 PT20.4.8) · `P-24`/`P-25` einsprachig `de` (S-17) · `P-26` bekannt, bewusst nicht in der Sitemap ·
Redirect-Quellen, 404 und technische Pfade nie (§8.5).

**Ziel-Sprachumfang** je Familie: **10 Locales**, einzige Ausnahme die deklariert einsprachigen
`P-24`/`P-25` (§4.10).

### 8.7 Fortschreibung durch spätere Primärtasks

| Abschnitt                                                             | Primärtask | Status                                        |
| --------------------------------------------------------------------- | ---------- | --------------------------------------------- |
| Kernjourneys, Sackgassen-Analyse                                      | PT03.3     | **erledigt — §9** (`IA-16`, `IA-21`, `IA-22`) |
| Navigation, Footer, Search, Breadcrumb, ChapterNav — finale Strategie | PT03.4     | **erledigt — §10** (`IA-09`, `IA-17`–`IA-19`) |

Die vorläufigen Rollen aus §8.6 sind mit **§10.15** final; bei Abweichung gilt §10.15.

---

## 9. Kernjourneys (AP03 PT03.3)

**Stand PT03.3 (2026-08-24):** Die **sieben** Kernjourneys aus `MASTER-SCOPE.md` AP03 PT03.3 sind
vollständig modelliert (§9.2), inklusive Startpunkten, Zwischenstationen, Conversions, CTA-Naming,
Lead-Typ, Consent-Grenze, Success-/Failure-State und Crosslinks. Die Sackgassenanalyse steht in §9.4.

> **Journey ≠ Implementierung.** PT03.3 beschreibt die Journey-Logik. Formulare, CTAs, Navigation,
> Tracking und Lead-Verarbeitung bauen später die Owner-APs (§9.5).

### 9.1 Gemeinsame Journey-Regeln

**Lead-Ziel.** Jede Journey, die einen Lead erzeugt, endet im **persistenten Lead-Modell mit
CRM-Handoff** (`DEC-RL-009`, `LEAD-DATA-CONTRACT.md` LD-01/LD-03). **Mail-only ist kein
Journey-Abschluss.** Der Erfolgszustand einer Lead-Journey ist die **dauerhafte Annahme**
(`BACKEND-API-CONTRACT.md` API-01) — nicht die Zustellung an CRM oder Mail (`IA-16`).

**Consent-Grenze.** Kein Journey-Schritt setzt Marketing-/Analytics-Tracking vor wirksamer Einwilligung
voraus (`DEC-RL-004`, `REST-02`). Die fachliche Datenschutzbestätigung eines Formulars ist **nicht**
Marketing-Consent (`LEAD-DATA-CONTRACT.md` LD-12/LD-13). Messbarkeit ist ein späterer AP23-Gegenstand;
PT03.3 nimmt keine Event-Taxonomie vorweg.

**Sprachumfang.** Alle Journeys laufen in **zehn Locales** (`DEC-RL-001`); Consumer ausdrücklich
eingeschlossen (`REST-03`). Einzige Ausnahme sind die deklariert einsprachigen Spezialseiten `P-24`/
`P-25` (§4.10), deren Abbau AP08 PT08.4.3 vorbehalten bleibt.

**CTA-Naming.** Der allgemeine B2B-Sales-Weg heißt **„Angebot anfragen"** (`DEC-RL-013`, CTA-Rolle
`QUOTE_REQUEST`, §8.3). Spezialisierte Journeys behalten eigene CTAs. **Kein Chat** ist Journey-Station
(`DEC-RL-007`), **kein Garantie-CTA-Band** kehrt zurück (`DEC-RL-012`).

**Failure-/Fallback-Zustände** sind konzeptionell: Validierungsfehler (`400`, feldbezogen), Ratenbegrenzung
(`429`), Serverfehler (`5xx`) — jeweils mit lokalisierbarem Fehlercode statt fertiger Prosa
(`BACKEND-API-CONTRACT.md` API-08–API-10). Ein Providerfehler nach Annahme verliert **keinen** Lead
(`LEAD-DELIVERY-CONTRACT.md` LDV-01).

### 9.2 Die sieben Kernjourneys

#### J-01 — B2B → Diagnostik → Service → Angebot

| Feld                  | Wert                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `B2B_PROSPECT`                                                                                                                           |
| Primäre Nutzerabsicht | `evaluate` — passende diagnostische Leistung finden und bewerten                                                                         |
| Startpunkte           | Homepage (`P-01`) · Hauptnavigation Diagnostics · Search · organische Suche auf Service-Detail · Artikel-Crosslink                       |
| Zwischenstationen     | Diagnostics Hub (`P-09`) → Service-Detail (`P-11`, 9 Ressourcen)                                                                         |
| Seitenfamilien        | `P-01`, `P-09`, `P-11`, optional `P-16`, `P-06`                                                                                          |
| Primäre Conversion    | **„Angebot anfragen"** (`QUOTE_REQUEST`) → `P-03`                                                                                        |
| Sekundäre Conversion  | `DOWNLOAD_PUBLIC` aus dem Resource-Kontext                                                                                               |
| Lead-Typ (AP02)       | `general_inquiry`                                                                                                                        |
| Success State         | Lead dauerhaft angenommen, Bestätigung in der Locale des Nutzers                                                                         |
| Failure/Fallback      | Validierungsfehler feldbezogen · Rate-Limit · Serverfehler — Lead geht nicht verloren                                                    |
| Crosslinks            | Service ↔ verwandte Services · Service → Artikel · Service → IglooPro (wo fachlich passend) · Service → Epigenetik (wo fachlich passend) |
| Sprachumfang          | 10                                                                                                                                       |
| Owner-APs             | AP12 (Hub), AP13 (Details), AP20 + AP22 (Anfrage), AP06/AP07 (Findability)                                                               |

Ein Direkteinstieg auf das Service-Detail ist ein **gleichwertiger** Startpunkt; der Hub ist Orientierung,
keine Pflichtstation.

#### J-02 — IglooPro → Nutzen/Specs → Anfrage / ROI / Download

| Feld                  | Wert                                                                                                  |
| --------------------- | ----------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `B2B_PROSPECT` (Entscheider)                                                                          |
| Primäre Nutzerabsicht | `evaluate` — Produkt bewerten und Wirtschaftlichkeit einschätzen                                      |
| Startpunkte           | Homepage · Hauptnavigation · Search · organische Produktsuche · Artikel-Crosslink                     |
| Zwischenstationen     | Produktseite (`P-08`) → Nutzen/Spezifikation → ROI oder Unterlagen                                    |
| Seitenfamilien        | `P-08`, `P-01`, optional `P-06`, `P-26`                                                               |
| Primäre Conversion    | **„Angebot anfragen"** (`QUOTE_REQUEST`)                                                              |
| Sekundäre Conversion  | `ROI_CALCULATE` (ROI-Report) · `DOWNLOAD_PUBLIC` / `GATE_SUBMIT`                                      |
| Lead-Typ (AP02)       | `general_inquiry`; ROI-Anforderung als eigener Vorgang (`roi_report`)                                 |
| Success State         | Anfrage angenommen **oder** ROI-Report angefordert und zugestellt                                     |
| Failure/Fallback      | Report-Erzeugung darf die Lead-Annahme nicht gefährden (`LEAD-DELIVERY-CONTRACT.md` LDV-23)           |
| Crosslinks            | IglooPro → Services · IglooPro → Resources · Artikel → IglooPro                                       |
| Sprachumfang          | 10                                                                                                    |
| Owner-APs             | AP14 (Produkt), AP11 (ROI-Kontext heute Homepage), AP19 (Resources), AP22 (Lead)                      |
| Hinweis               | Der Claim **`CV < 2 %`** ist gelockte Produktentscheidung (`DEC-RL-008`) und wird hier nicht bewertet |

#### J-03 — Epigenetik → Hub → Panel/Musterbefund → eigene Inquiry

| Feld                  | Wert                                                                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Zielgruppe            | `PROFESSIONAL_AUDIENCE`, ergänzend `B2B_PROSPECT`                                                                                                            |
| Primäre Nutzerabsicht | `understand` → `inspect_sample_report` → Entscheidung über ein Panel                                                                                         |
| Startpunkte           | **eigener Hauptnavigationspunkt** (Ziel, `IA-09`) · Homepage-Säulenpräsenz · Search · organische Suche auf Vertiefung oder Musterbefund                      |
| Zwischenstationen     | Hub (`P-10`) → Vertiefung (`P-12`–`P-14`) und/oder Musterbefund (`P-15`, 6 Ressourcen)                                                                       |
| Seitenfamilien        | `P-10`, `P-12`, `P-13`, `P-14`, `P-15`, `P-27`                                                                                                               |
| Primäre Conversion    | **Epigenetik-Inquiry** (`EPIGENETICS_INQUIRY`) → `P-27`                                                                                                      |
| Sekundäre Conversion  | `DOWNLOAD_PUBLIC` (Unterlagen `P-14`) · `VIEW_SAMPLE_REPORT`                                                                                                 |
| Lead-Typ (AP02)       | **`epigenetics_inquiry`** — eigener Typ mit eigenem CRM-Routing (`DEC-RL-011`)                                                                               |
| Success State         | Inquiry mit Panel-/Einrichtungskontext dauerhaft angenommen                                                                                                  |
| Failure/Fallback      | wie J-01; Panel-Kontext bleibt als strukturiertes Feld erhalten                                                                                              |
| Crosslinks            | Hub → 3 Vertiefungen · Hub → 6 Musterbefunde · Vertiefung → Musterbefund · Vertiefung → Inquiry · Musterbefund → Epigenetik-Kontext · Musterbefund → Inquiry |
| Sprachumfang          | 10 (Befundinhalte heute nur `de`/`en` — `IAD-03`)                                                                                                            |
| Owner-APs             | AP15 (Säule/Inquiry), AP16 (Musterbefunde), AP22 (Lead), AP06 (eigener Navigationspunkt)                                                                     |

**Verbindlich:** Diese Journey ist **nicht** über den allgemeinen Contact-Lead abzuwickeln, und
Epigenetik ist **nicht** als zehnter Diagnostik-Service modelliert (`DEC-RL-005`, `IA-08`).

#### J-04 — Content → relevante Lösung → CTA

| Feld                  | Wert                                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `B2B_PROSPECT`, ergänzend `PROFESSIONAL_AUDIENCE`                                                                                        |
| Primäre Nutzerabsicht | `understand` — Fachthema verstehen, Relevanz für die eigene Praxis erkennen                                                              |
| Startpunkte           | organische Suche auf Artikel · Article Index (`P-07`) · Search · Homepage-Teaser · Events (`P-05`)                                       |
| Zwischenstationen     | Artikel (`P-16`) bzw. Event (`P-05`) → fachlich passende Lösung                                                                          |
| Seitenfamilien        | `P-07`, `P-16`, `P-05`, Ziel: `P-11`, `P-08`, `P-10`, `P-06`                                                                             |
| Primäre Conversion    | **kontextabhängig** — der nächste Schritt folgt dem Thema, kein Einheits-CTA (§8.2 T6)                                                   |
| Sekundäre Conversion  | `QUOTE_REQUEST`, wo inhaltlich begründet · `EVENT_CONTACT` bei Events                                                                    |
| Lead-Typ (AP02)       | ergibt sich aus der Zielseite; die Content-Seite selbst ist `ASSISTING`                                                                  |
| Success State         | Nutzer erreicht die thematisch passende Lösungsseite                                                                                     |
| Failure/Fallback      | Content ohne passenden nächsten Schritt ist eine **Sackgasse** → §9.4                                                                    |
| Crosslinks            | Artikel → Service/IglooPro/Epigenetik · Artikel → verwandte Artikel · Event → Anfrage/Kontakt · Resource → passende Produkt-/Servicseite |
| Sprachumfang          | 10                                                                                                                                       |
| Owner-APs             | AP17 (Artikel), AP18 (Events), AP04 (Content-Readiness), AP07 (Findability)                                                              |

#### J-05 — Resource / Lead-Magnet → Gate → CRM → Asset-Zustellung

| Feld                  | Wert                                                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `B2B_PROSPECT`, ergänzend `EXISTING_CUSTOMER`                                                                          |
| Primäre Nutzerabsicht | `download` — eine fachliche Ressource beziehen                                                                         |
| Startpunkte           | Resource-Hub (`P-06`) · Produkt-/Service-/Epigenetikseite · Artikel-Crosslink · Search · organische Suche              |
| Zwischenstationen     | Ressourcen-Einstieg → **Gate** (`P-17`) → kontrollierte Asset-Freigabe                                                 |
| Seitenfamilien        | `P-06`, `P-17`, `P-14` (Gate-Kandidat), Quellseiten des Crosslinks                                                     |
| Primäre Conversion    | **Gate-Absendung** (`GATE_SUBMIT`) — **`SECONDARY_CONVERSION`** im Site-Modell                                         |
| Sekundäre Conversion  | `QUOTE_REQUEST` im Anschluss, wo fachlich sinnvoll                                                                     |
| Lead-Typ (AP02)       | **`content_download`** mit Asset-ID, Sprache und Source                                                                |
| Success State         | Lead angenommen **und** Asset kontrolliert zugestellt bzw. freigegeben                                                 |
| Failure/Fallback      | Zustellfehler verliert weder Lead noch Berechtigung; Wiederholung erzeugt **kein** zweites Entitlement (LDV-08/LDV-11) |
| Crosslinks            | Resource → passende Produkt-/Service-/Epigenetikseite · Produktseite → Resource                                        |
| Sprachumfang          | 10 — sprachpassendes Asset, **kein stiller Fremdsprach-Fallback** (`CONTENT-ASSET-CONTRACT.md` CA-28)                  |
| Owner-APs             | AP19 (Resource Center/Gate), AP22 (Lead/Entitlement), AP04/AP08 (Assets × 10)                                          |

**Verbindlich:** Der Weg ist **Resource Entry → Gate → Asset**. Eine Navigation direkt auf eine
geschützte Asset-URL ist kein zulässiger Journey-Pfad (`CONTENT-ASSET-CONTRACT.md` CA-31,
`IA-15`). `DEC-RL-014` verlangt mindestens **einen** solchen Pfad; heute existiert keiner (`IAD-07`).

#### J-06 — Consumer → SEO-Landingpage → Bestellung

| Feld                  | Wert                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `CONSUMER` (B2C)                                                                                                                              |
| Primäre Nutzerabsicht | `order` — Produkt verstehen und bestellen                                                                                                     |
| Startpunkte           | **organische Suche** (primärer Discovery-Kanal) · bezahlte Kampagne/Social · Direkt-URL · interne Crosslinks aus fachlich passenden Kontexten |
| Zwischenstationen     | Consumer-Landingpage (`P-18`–`P-20`) → Produktinformation → Bestellformular                                                                   |
| Seitenfamilien        | `P-18`, `P-19`, `P-20`; ergänzend Legal (`P-21`–`P-23`) für Pflichtinformationen                                                              |
| Primäre Conversion    | **Bestellung** (`ORDER`) — ausdrücklich **nicht** „Angebot anfragen"                                                                          |
| Sekundäre Conversion  | `NONE`                                                                                                                                        |
| Lead-Typ (AP02)       | **`consumer_order`** — eigener Business-Vorgang, nicht mit dem allgemeinen Contact-Lead vermischt                                             |
| Success State         | Bestellung dauerhaft angenommen, Bestätigung in der Locale des Nutzers                                                                        |
| Failure/Fallback      | Validierung, Rate-Limit und Abuse-Schutz je Endpunkt; Idempotenz gegen Doppelbestellung                                                       |
| Crosslinks            | Consumer → Bestellung · Consumer → passende Informations-/Support-Seiten, wo die Journey profitiert                                           |
| Sprachumfang          | **10** (`REST-03`) — heute 1 (`en`), Debt `IAD-01`                                                                                            |
| Owner-APs             | AP21 (Consumer × 10), AP22 (Order/Lead), AP09 (SEO), AP06/AP07 (interne Findability)                                                          |

Consumer ist **öffentlich indexierbar** (`DEC-RL-006`) und braucht **keinen** Platz in der
B2B-Hauptnavigation (`IA-12`) — wohl aber eine bewusst definierte Findability.

#### J-07 — Bestandskunde → Support / Downloads

| Feld                  | Wert                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| Zielgruppe            | `EXISTING_CUSTOMER`                                                                                |
| Primäre Nutzerabsicht | `get_support` bzw. `download` — Hilfe erhalten oder Unterlagen beziehen                            |
| Startpunkte           | Support-Einstieg in Navigation/Footer · Search · Produkt-/Serviceseite · Resource-Hub · Direkt-URL |
| Zwischenstationen     | Support (`P-04`) mit Supportformular **oder** Resource-Hub (`P-06`)                                |
| Seitenfamilien        | `P-04`, `P-06`, ergänzend `P-08`/`P-11` als Einstieg                                               |
| Primäre Conversion    | **Support-Anfrage** (`SUPPORT_REQUEST`) bzw. Download                                              |
| Sekundäre Conversion  | `NONE` — **kein** aufgedrängter Sales-CTA                                                          |
| Lead-Typ (AP02)       | **`support`** — eigener Typ; ggf. Case-/Ticket-Objekt statt Marketing-Lead                         |
| Success State         | Supportfall dauerhaft angenommen bzw. Unterlage bezogen                                            |
| Failure/Fallback      | Anhangsfehler feldbezogen; Providerfehler verliert den Fall nicht                                  |
| Crosslinks            | Produkt/Service → Support · Produkt/Service → Unterlagen · Support → Resource-Hub                  |
| Sprachumfang          | 10, inklusive Systemmails (`I18N-CONTRACT.md` I-12)                                                |
| Owner-APs             | AP20 (Support), AP19 (Resources), AP22 (Lead/Case)                                                 |

**Verbindlich:** Supportdaten werden **nicht** automatisch als Marketing-Lead behandelt
(`LEAD-DATA-CONTRACT.md` LD-07/LD-12), und **Chat ist kein Support-Ersatz** (`DEC-RL-007`).

### 9.3 Journey-Übersicht

| ID       | Journey                           | Zielgruppe              | Primäre Conversion    | Lead-Typ                          | Conversion-Rolle           | Sprachen |
| -------- | --------------------------------- | ----------------------- | --------------------- | --------------------------------- | -------------------------- | -------- |
| **J-01** | Diagnostik → Service → Angebot    | `B2B_PROSPECT`          | `QUOTE_REQUEST`       | `general_inquiry`                 | `PRIMARY_CONVERSION`       | 10       |
| **J-02** | IglooPro → Anfrage/ROI/Download   | `B2B_PROSPECT`          | `QUOTE_REQUEST`       | `general_inquiry` (+`roi_report`) | `PRIMARY_CONVERSION`       | 10       |
| **J-03** | Epigenetik → Panel → Inquiry      | `PROFESSIONAL_AUDIENCE` | `EPIGENETICS_INQUIRY` | `epigenetics_inquiry`             | `PRIMARY_CONVERSION`       | 10       |
| **J-04** | Content → Lösung → CTA            | `B2B_PROSPECT`          | kontextabhängig       | aus der Zielseite                 | `ASSISTING`                | 10       |
| **J-05** | Resource → Gate → Asset           | `B2B_PROSPECT`          | `GATE_SUBMIT`         | `content_download`                | **`SECONDARY_CONVERSION`** | 10       |
| **J-06** | Consumer → Landingpage → Order    | `CONSUMER`              | `ORDER`               | `consumer_order`                  | `PRIMARY_CONVERSION`       | **10**   |
| **J-07** | Bestandskunde → Support/Downloads | `EXISTING_CUSTOMER`     | `SUPPORT_REQUEST`     | `support`                         | `PRIMARY_CONVERSION`       | 10       |

Alle sieben Master-Scope-Kernjourneys sind damit abgedeckt (`IA-21`); jede Lead-Journey referenziert das
persistente Lead-/CRM-Zielmodell (`IA-16`).

### 9.4 Sackgassenanalyse

Geprüft je Journey: sinnvoller nächster Schritt · Exit vorhanden · CTA-Ziel existiert · Search-Ziele
gültig · gated Flow vorhanden · kein Chat-only-Schritt · Epigenetik nicht versteckt · Consumer nicht
nur per Direkt-URL. Ergebnis (`IA-22`):

| Journey  | Sackgasse (Ist)                                                                                                           | Ursache                        | Debt                         | Owner-AP       |
| -------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------- | -------------- |
| **J-01** | intakt — Hub und Service-Details erreichbar, Anfrage-CTA vorhanden                                                        | —                              | CTA-Wortlaut `IAD-12`        | AP04/AP08      |
| **J-02** | intakt; ROI-Einstieg liegt heute auf der Homepage statt auf der Produktseite                                              | ROI ist HomePage-Section       | offen in §4.1                | AP11/AP14      |
| **J-03** | **Einstieg verengt** — Epigenetik ist nur über den Diagnostics-Menüpunkt erreichbar; **Inquiry fehlt** als eigene Strecke | Navigation + fehlende Inquiry  | `IAD-02`, `IAD-11`           | AP06/AP15/AP22 |
| **J-04** | **Einheits-CTA** — jeder Artikel endet im selben kommerziellen CTA statt im thematisch passenden Schritt                  | Artikel-Template               | `IAD-13`                     | AP17           |
| **J-05** | **Journey existiert nicht** — kein Gate, kein Entitlement, Ressourcen ohne Zugangsklasse                                  | Gating fehlt vollständig       | `IAD-07`, `IAD-14`, `IAD-06` | AP19/AP22      |
| **J-06** | **Sprachlich blockiert** — Consumer wird auf `/en/` gezwungen; interne Findability nicht definiert                        | Sprachzwang + Navigation offen | `IAD-01`                     | AP21/AP08      |
| **J-07** | Support-Strecke intakt und vom Sales getrennt; Unterlagen sind jedoch über zwei getrennte Kataloge verstreut              | zwei Download-Welten           | `IAD-06`                     | AP19           |

Zusätzlich journeyübergreifend: der tote Suchtreffer `sports` (`IAD-04`) kann J-01 in eine 404 führen,
und der clientseitige `/services*`-Redirect (`IAD-10`) ist kein zulässiges Journey-Ziel.

**Keine dieser Sackgassen wird von PT03.3 behoben** — jede ist als Debt mit Owner-AP geführt (§10).

### 9.5 Owner-APs je Journey

| Journey  | Seitenumsetzung  | Conversion/Lead | Findability      | Sprache |
| -------- | ---------------- | --------------- | ---------------- | ------- |
| **J-01** | AP12, AP13       | AP20, AP22      | AP06, AP07       | AP08    |
| **J-02** | AP14, AP11       | AP22, AP19      | AP06, AP07       | AP08    |
| **J-03** | AP15, AP16       | AP22            | AP06, AP07       | AP08    |
| **J-04** | AP17, AP18, AP04 | AP22            | AP07             | AP08    |
| **J-05** | AP19             | AP22            | AP07             | AP08    |
| **J-06** | AP21             | AP22            | AP06, AP07, AP09 | AP08    |
| **J-07** | AP20, AP19       | AP22            | AP06, AP07       | AP08    |

Messbarkeit der Journeys ist **AP23**; PT03.3 legt keine Event-Namen fest und nimmt keine
Tracking-Entscheidung vorweg.

---

## 10. Navigation und interne Findability (AP03 PT03.4)

**Stand PT03.4 (2026-08-24):** Der Navigations- und Findability-Vertrag ist festgeschrieben. §10.15 ist
die **finale** Klassifikationsmatrix und löst die vorläufigen Werte aus §8.6 ab. Es sind **keine**
`FINALIZE_PT03.4`-Werte offen geblieben.

> **PT03.4 legt IA-Rollen fest, kein visuelles Design und keine Implementierung.** Header, Mega-Menü,
> Footer, Search, Breadcrumb, ChapterNav und Crosslinks bauen später AP06, AP07 und die Seiten-APs.

### 10.1 Drei getrennte Mengen

| Menge              | Zweck                                             | Wahrheitsquelle               |
| ------------------ | ------------------------------------------------- | ----------------------------- |
| **Route Registry** | welche URLs **existieren** und mit welcher Policy | `ROUTING-CONTRACT.md` (R-24)  |
| **Sitemap**        | Crawler-Discovery                                 | `SEO-CONTRACT.md` (S-06/S-08) |
| **Navigation**     | welche bekannten Routen **sichtbar** sind         | dieses Dokument, §10          |
| **Search**         | Nutzer-Findability                                | dieses Dokument, §10.9        |

**Verbindlich:** Nicht jede Route gehört ins Menü. Navigation erfindet **keine** Pfade
(`ROUTING-CONTRACT.md` R-51). Aus einer Menge folgt **nicht** automatisch eine andere — Legal darf
existieren, im Footer stehen und trotzdem aus Search ausgeschlossen sein.

### 10.2 Ist-Zustand Navigation (read-only erhoben 2026-08-24)

**Gemessener IST-Zustand, nicht das SOLL.**

| Kanal            | Ist-Befund                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Header**       | `navItems`: Home · Events · About (Kind: Terms) · **Service** (`/diagnostics`) mit zwei Gruppen — `group_poc` (4 Services) und `group_lab` (**Epigenetik + Musterbefunde**) · Blog · Support. Zusätzlich `LanguageSwitcher`, `SearchModal`, CTA → `/contact`. Zwei auskommentierte Backlog-Einträge (Case Studies, Shop)            |
| **Epigenetik**   | erscheint **ausschließlich als Kind des Diagnostics-Menüpunkts**; ein Ziel trägt ein Fragment (`/epigenetics#musterbefunde`). Es gibt **keinen** eigenen Hauptnavigationspunkt                                                                                                                                                      |
| **Footer**       | 17 Links: Home, About, Articles, Contact, Diagnostics + **6 von 9** Services, Downloads, Events, IglooPro, Imprint, Privacy, Terms. **Kein Epigenetik-Link, kein Support-Link, kein Consumer-Link**                                                                                                                                 |
| **Search**       | `useSearch.ts`: 6 handgeschriebene statische Pfade (Home, About, Diagnostics, Epigenetics-Hub, Contact, Terms) + Services + Artikel. **0 Treffer** für Consumer, die drei Epigenetik-Vertiefungen, Musterbefunde, Downloads, Events, Support. Enthält den toten Service `sports` und einen auskommentierten `/casestudys/32reasons` |
| **Breadcrumbs**  | `src/components/ui/Breadcrumbs.tsx` nimmt **explizite `items`** entgegen — **kein** URL-Parser. Eingesetzt auf ~11 Seiten inkl. Service-Detail, Artikel, Musterbefund und `EpiSubpage`. **Consumer: keine**                                                                                                                         |
| **ChapterNav**   | `src/components/ui/ChapterNav.tsx` existiert und wird auf den Epigenetik-Seiten (Hub, drei Vertiefungen über `EpiSubpage`) und auf `MusterbefundPage` verwendet                                                                                                                                                                     |
| **Consumer**     | **keine internen Links** auf `/consumer/*` außerhalb der Consumer-Seiten selbst — nur Direkt-URL und organische Suche                                                                                                                                                                                                               |
| **Legacy-Links** | `src/pages/VitaminD3ImplantologyPage.tsx` verlinkt intern auf **`/services/dental`** — eine Redirect-Quelle statt des kanonischen `/diagnostics/dental`                                                                                                                                                                             |
| **Chat**         | `ChatWidget` wird global in `App.tsx` gerendert                                                                                                                                                                                                                                                                                     |
| **Positiv**      | Die Homepage besitzt eine `EpigeneticsTeaserSection`; Epigenetik ist außerdem aus Downloads, `PageSidebar` und Musterbefund verlinkt                                                                                                                                                                                                |

Diese Befunde sind als `IAD-15`–`IAD-19` in §11 geführt.

### 10.3 Header-IA (Zielbild)

Der Header ist **fokussiert**: wenige, klar unterscheidbare Säulen statt einer Menüliste aller Routen.
Die konkrete Anordnung, Beschriftung und visuelle Form entscheidet **AP06**.

| Slot                   | Rolle                                                             | Ziel            |
| ---------------------- | ----------------------------------------------------------------- | --------------- |
| **Diagnostik**         | B2B-Leistungsbereich mit Mega-Menü über die neun Services         | `P-09` + `P-11` |
| **Epigenetik**         | **eigene Geschäftssäule, eigener Punkt** (`IA-09`)                | `P-10`          |
| **IglooPro / Produkt** | Produktstrecke sichtbar, nicht in Diagnostik versteckt            | `P-08`          |
| **Content**            | Wissen/Artikel und Events                                         | `P-07`, `P-05`  |
| **Unternehmen**        | About und zugehörige Corporate-Inhalte                            | `P-02`          |
| **Support**            | Bestandskunden-Einstieg, **nicht** hinter Sales versteckt         | `P-04`          |
| **Sales-CTA**          | **„Angebot anfragen"** als erkennbarer, eigenständiger Header-CTA | → `P-03`        |
| **Search**             | eigener Findability-Kanal, kein Menüpunkt                         | §10.9           |
| **Language Switcher**  | Locale-Wechsel, **keine** Hierarchieebene                         | §10.14          |

**Ausgeschlossen:** Chat (`DEC-RL-007`) · Garantie-CTA-Band (`DEC-RL-012`) · Deal/Voucher, Case Studies,
Shop (`DEC-RL-015`) · Redirect-Quellen als Menüziel · Consumer als Pflicht-Hauptpunkt (§10.8).

### 10.4 Diagnostik-Navigation und Mega-Menü

Diagnostik ist ein **eigenständiger B2B-Leistungsbereich**: Hub als Orientierung (`P-09`), darunter die
**neun** Services (`P-11`).

Das Mega-Menü **darf**: Services fachlich gruppieren · direkt auf Service-Details verlinken · einen
Hub-Einstieg anbieten · kontextuell ergänzende Links führen.

Es **darf nicht**: eigene Routen erfinden · `/services*` als Ziel verwenden (kanonisch ist
`/[lang]/diagnostics*`) · **Epigenetik als Service-Untergruppe modellieren** · Backlog-Angebote führen ·
auf tote Slugs zeigen. Jedes Ziel muss gegen die Route Registry validierbar sein (`ROUTING-CONTRACT.md`
R-51).

Die Gruppierung der neun Services ist fachlich zu begründen; die Spalten-/Layoutform ist **AP06**, nicht
PT03.4. Alle neun Services gehören erreichbar — Hub **und** Mega-Menü.

### 10.5 Epigenetik als eigener Hauptnavigationspunkt (`IA-09`)

**Verbindlich:** Epigenetik ist im Zielbild **direkt** aus dem Header erreichbar — als eigene Säule,
nicht als Kind von Diagnostik.

```
Header → Epigenetik → Hub (P-10)
                       ├─ Vertiefungen (P-12, P-13, P-14)
                       ├─ Musterbefunde (P-15, 6 Ressourcen)
                       └─ Epigenetik-Inquiry (P-27)
```

Ein fachlicher Crosslink **Diagnostik ↔ Epigenetik** ist ausdrücklich erlaubt und erwünscht. **Nicht**
zulässig als Zielmodell ist der Pfad „Diagnostik → Services → Epigenetik" als **einziger oder primärer**
Zugang. Der heutige Zustand entspricht genau dem und ist Debt `IAD-02` (Owner AP06 mit AP15).

### 10.6 IglooPro-Findability

IglooPro ist **nicht versteckt**. Verbindliche Mindest-Einstiege: Hauptnavigation (Produkt-/Lösungsslot)
· Homepage · Search · Content-Crosslinks aus fachlich passenden Artikeln und Services · Footer. Die
Journey `J-02` bleibt damit vollständig erreichbar, inklusive der sekundären Conversion über ROI oder
Unterlagen. Die genaue Header-Position entscheidet **AP06**.

### 10.7 Footer-IA

Der Footer ist der **zweite globale Findability-Kanal** und trägt bewusst mehr Breite als der Header.

| Bereich            | Inhalt                                        | Pflicht                           |
| ------------------ | --------------------------------------------- | --------------------------------- |
| **Unternehmen**    | About, Kontakt                                | ja                                |
| **Diagnostik**     | Hub und Services                              | ja                                |
| **Produkt**        | IglooPro                                      | ja                                |
| **Epigenetik**     | Hub, Vertiefungen, Musterbefunde              | **ja** — heute fehlend (`IAD-16`) |
| **Wissen/Content** | Artikel, Events                               | ja                                |
| **Ressourcen**     | Downloads/Resource-Hub                        | ja                                |
| **Support**        | Support-Einstieg                              | **ja** — heute fehlend (`IAD-16`) |
| **Legal**          | Privacy, Imprint, Terms                       | ja                                |
| **Sprache**        | nur, soweit die bestehende Shell das vorsieht | optional                          |

**Verbindlich:** eigener Epigenetik-Einstieg · Support auffindbar · Legal auffindbar · **kein** Chat ·
**keine** Backlog-Bereiche · **keine** toten oder Legacy-Ziele, insbesondere **kein `/services*`** ·
Consumer wird gesondert entschieden (§10.8). Ob der Footer alle neun Services oder nur den Hub führt,
ist eine Umfangsentscheidung von **AP06** — die heutige Teilmenge von 6 aus 9 ist als `IAD-17` erfasst.

### 10.8 Consumer-Findability (`IA-12`)

Consumer ist B2C, öffentlich, indexierbar und in **zehn** Locales (`DEC-RL-006`, `REST-03`). Es ist eine
**andere Zielgruppe** als der übrige B2B-Bestand — daher gilt bewusst:

| Kanal                  | Entscheidung                 | Begründung                                                       |
| ---------------------- | ---------------------------- | ---------------------------------------------------------------- |
| **Main Nav (B2B)**     | **`INTENTIONALLY_NONE`**     | anderes Publikum; die B2B-Shell bleibt fokussiert                |
| **Footer**             | **`INDIRECT`**               | ein dezenter Produkt-/Shop-Einstieg genügt, kein Hauptbereich    |
| **Search**             | **`SEARCHABLE`**             | interne Suchende sollen die Produkte finden — kein toter Bereich |
| **Organische Suche**   | **primärer Discovery-Kanal** | SEO-Landingpages × 10 (`SEO-CONTRACT.md` S-09)                   |
| **Direkteinstieg**     | zulässig und erwartet        | Kampagnen-, Social- und Direct-Traffic                           |
| **Interne Crosslinks** | **`OPTIONAL_CONTEXTUAL`**    | aus fachlich passenden Kontexten (§10.12)                        |

**Verbindlich:** „nicht im Hauptmenü" bedeutet **nicht** „nirgendwo auffindbar". Consumer hat mit
Footer, Search, organischer Suche und kontextuellen Crosslinks **vier** benannte Kanäle. Alle Ziele
müssen in **allen zehn Locales** korrekt sein — ein Zwang nach `/en/` ist ausgeschlossen (`IAD-01`).

### 10.9 Search-Policy (`IA-17`)

**Zielumfang.** Search soll mindestens finden: Hauptseiten · Diagnostik-Hub · **neun** Services ·
IglooPro · Epigenetik-Hub · **drei** Vertiefungen · **sechs** Musterbefunde · Artikel · Events ·
Downloads/Resources · **Consumer** (§10.8) · Support. **Legal ist ausgeschlossen** — dort besteht kein
Suchnutzen, der Zugang läuft über den Footer.

**Verbindlich:**

- Search **erfindet keine Route-Wahrheit**; jedes Ziel ist eine kanonische Route
  (`ROUTING-CONTRACT.md` R-50).
- **Keine toten Ziele.** Ein Treffer ohne Ressource ist ein Fehler, kein leeres Ergebnis (`IAD-04`).
- **Redirect-Quellen sind keine primären Suchziele**; Search zeigt auf das kanonische Ziel.
- Treffer respektieren die **aktive Locale** (§10.14).
- Search ist weder Sitemap noch Hauptnavigation (§10.1).

**Ergebnis-Kategorien** (konzeptionell, keine Datenstruktur, kein Ranking): `Page` · `Service` ·
`Product` · `Epigenetics` · `Sample Report` · `Article` · `Event` · `Resource` · `Support` · `Consumer`.
Owner: **AP07**.

### 10.10 Breadcrumb-Policy (`IA-18`)

**Kerninvariante:** Der Breadcrumb bildet die **fachliche** IA-Hierarchie ab und wird **nicht** durch
Splitten des Pfads an `/` erzeugt. Das ist besonders wichtig bei Alias-/Redirect-Pfaden, lokalisierten
Routen, dynamischen Ressourcen, Consumer und Epigenetik. Die vorhandene Komponente nimmt bereits
**explizite Items** entgegen und ist damit zielkonform.

| Seitenfamilie                         | Hierarchie                       |
| ------------------------------------- | -------------------------------- |
| Service-Detail (`P-11`)               | Home → Diagnostik → Service      |
| Epigenetik-Vertiefung (`P-12`–`P-14`) | Home → Epigenetik → Vertiefung   |
| Musterbefund (`P-15`)                 | Home → Epigenetik → Musterbefund |
| Artikel (`P-16`)                      | Home → Wissen/Artikel → Artikel  |
| Ressourcen (`P-06`)                   | Home → Ressourcen                |
| Wissens-Landingpages (`P-24`, `P-25`) | Home → Wissen → Seite            |

**Verbindlich:** Breadcrumb-Ziele sind kanonische Routen · Redirect-Quellen erhalten **keinen** normalen
Breadcrumb · **404 erhält keinen Seiten-Breadcrumb** · die Locale bleibt über die gesamte Kette
konsistent · sichtbare Hierarchie und spätere Structured-Data-Hierarchie stimmen semantisch überein
(Owner **AP09**).

**Consumer (`P-18`–`P-20`): `NO_VISIBLE_BREADCRUMB`.** Bewusste Entscheidung — Consumer ist ein eigener,
flacher SEO-/Conversion-Bereich ohne B2B-Elternhierarchie. Ein Breadcrumb „Home → Diagnostik → Consumer"
wäre fachlich falsch. Der heutige Zustand (keine Breadcrumbs auf Consumer) entspricht dem Ziel.

### 10.11 ChapterNav-Policy (`IA-19`)

**`CANDIDATE`**, wenn alle Kriterien zutreffen: lange Seite · mehrere eigenständige
Informationsabschnitte · Sprungnavigation verbessert die Orientierung · stabile Abschnitts-IDs möglich ·
mobile Nutzung sinnvoll.

**`NOT_APPLICABLE`** bei: kurzen Landingpages · Formularseiten · Übersichtsseiten mit wenigen Blöcken ·
Legal-Seiten, sofern deren Struktur nicht ausdrücklich davon profitiert.

Kandidaten: Epigenetik-Hub · die drei Vertiefungsseiten · Musterbefunde · IglooPro · umfangreiche
Service-Details · die beiden Wissens-Landingpages. **Nicht** pauschal für Artikel.

**Technische Leitplanken** (Umsetzung AP06/AP24/AP25): stabile Anker-IDs · Fragmente zerstören das
Routing nicht und sind nicht Teil der Route-Identität (`ROUTING-CONTRACT.md` R-21) · Tastatur- und
Screenreader-Nutzung muss möglich sein · Sticky-Verhalten verdeckt keinen Inhalt · aktive
Abschnittsanzeige als Progressive Enhancement. **Keine** Scroll-/Observer-Implementierung in PT03.4.

### 10.12 Crosslink-Policy

Crosslinks entstehen aus **Nutzerrelevanz, Journey-Logik und fachlichem Zusammenhang** — nicht aus
Linkdichte. **Keine SEO-Linkfarm:** „jede Seite verlinkt auf möglichst viele andere" ist ausdrücklich
kein IA-Ziel.

| Von               | Nach                                                   | Verbindlichkeit       |
| ----------------- | ------------------------------------------------------ | --------------------- |
| Diagnostik-Hub    | die neun Services                                      | `REQUIRED_CONTEXTUAL` |
| Service           | verwandte Services                                     | `OPTIONAL_CONTEXTUAL` |
| Service           | relevante Artikel                                      | `OPTIONAL_CONTEXTUAL` |
| Service           | IglooPro, wo fachlich passend                          | `OPTIONAL_CONTEXTUAL` |
| Service           | Epigenetik, wo fachlich passend                        | `OPTIONAL_CONTEXTUAL` |
| Epigenetik-Hub    | drei Vertiefungen · sechs Musterbefunde                | `REQUIRED_CONTEXTUAL` |
| Vertiefung        | Musterbefund · Inquiry                                 | `REQUIRED_CONTEXTUAL` |
| Musterbefund      | Epigenetik-Kontext · Inquiry                           | `REQUIRED_CONTEXTUAL` |
| IglooPro          | Anfrage · ROI/Resource                                 | `REQUIRED_CONTEXTUAL` |
| Artikel           | fachlich passende Lösung (Service/IglooPro/Epigenetik) | `REQUIRED_CONTEXTUAL` |
| Event             | Anfrage/Kontakt                                        | `OPTIONAL_CONTEXTUAL` |
| Resource          | passende Produkt-/Service-/Epigenetikseite             | `REQUIRED_CONTEXTUAL` |
| Produkt/Service   | Support · Unterlagen                                   | `OPTIONAL_CONTEXTUAL` |
| Consumer          | Bestellung · passende Informations-/Support-Seiten     | `OPTIONAL_CONTEXTUAL` |
| relevante Inhalte | Consumer, nur wo fachlich sinnvoll                     | `OPTIONAL_CONTEXTUAL` |

**Gated Ressourcen** verlinken auf den **Gate-Einstieg**, nie auf eine geschützte Asset-URL
(`CONTENT-ASSET-CONTRACT.md` CA-31).

### 10.13 CTA-Findability

Der allgemeine B2B-Sales-CTA **„Angebot anfragen"** ist gut sichtbar, konsistent benannt und **nicht**
mit Support, Bestellung oder Download vermischt. Mögliche globale Präsenz: Header-CTA · relevante
Seiten · Kontakt-/Footer-Kontext.

Spezialisierte Journeys behalten ihre eigenen CTAs: Consumer → **Bestellung** · Resource →
**Download/Gate** · Epigenetik → **eigene Inquiry** · Support → **Support-Anfrage** · IglooPro → **ROI**
als sekundäre Aktion. Die heutige Wortlaut-Abweichung ist `IAD-12`.

### 10.14 Locale-sichere interne Verlinkung

Verbindliche IA-Invariante für alle später implementierten internen Links, Search-Treffer,
Breadcrumb-Ziele und Crosslinks:

- Die **aktive Locale** wird respektiert; kein unnötiger Rückfall auf die Default-Locale.
- Das Ziel ist die **kanonische Route** der Zielsprache (`ROUTING-CONTRACT.md` R-18/R-51).
- **Consumer wird nicht nach `/en/` gezwungen** (`REST-03`).
- **Epigenetik wird nicht in eine falsche Locale geschickt.**
- Der **Language Switcher** wechselt die Locale **derselben logischen Seitenidentität**, soweit die Route
  dort existiert. Er ist **keine** Navigation, **keine** Sitemap und **kein** Ersatzmechanismus für
  fehlenden Inhalt. Owner: **AP08**/**AP10**.

### 10.15 Finale Findability-Matrix (bewusste Nicht-Verlinkung, `IA-20`)

**Diese Matrix ist final.** Sie ersetzt die vorläufigen Werte aus §8.6. Es bleiben **keine**
`FINALIZE_PT03.4`-Werte offen.

| IA-ID             | Seitenfamilie               | Main Nav                     | Footer         | Search                       | Breadcrumb     | ChapterNav      | Direct/SEO Entry | Crosslink             |
| ----------------- | --------------------------- | ---------------------------- | -------------- | ---------------------------- | -------------- | --------------- | ---------------- | --------------------- |
| **P-01**          | Homepage                    | `DIRECT`                     | `DIRECT`       | `SEARCHABLE`                 | `NONE`         | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-02**          | About                       | `DIRECT`                     | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `OPTIONAL_CONTEXTUAL` |
| **P-03**          | Contact                     | `DIRECT` (CTA)               | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-04**          | Support                     | `DIRECT`                     | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-05**          | Events                      | `INDIRECT` (Content)         | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `OPTIONAL_CONTEXTUAL` |
| **P-06**          | Downloads/Resource-Hub      | `INDIRECT`                   | `DIRECT`       | `SEARCHABLE`                 | `REQUIRED`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-07**          | Article Index               | `DIRECT` (Content)           | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-08**          | IglooPro                    | `DIRECT`                     | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | **`CANDIDATE`** | YES              | `REQUIRED_CONTEXTUAL` |
| **P-09**          | Diagnostik-Hub              | `DIRECT`                     | `DIRECT`       | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-10**          | **Epigenetik-Hub**          | **`DIRECT` — eigener Punkt** | **`DIRECT`**   | `SEARCHABLE`                 | `OPTIONAL`     | **`CANDIDATE`** | YES              | `REQUIRED_CONTEXTUAL` |
| **P-11**          | Service-Detail (× 9)        | `DIRECT` (Mega-Menü)         | `DIRECT`       | `SEARCHABLE`                 | **`REQUIRED`** | **`CANDIDATE`** | YES              | `REQUIRED_CONTEXTUAL` |
| **P-12**–**P-14** | Epigenetik-Vertiefungen     | `INDIRECT`                   | `DIRECT`       | `SEARCHABLE`                 | **`REQUIRED`** | **`CANDIDATE`** | YES              | `REQUIRED_CONTEXTUAL` |
| **P-15**          | Musterbefund (× 6)          | `INDIRECT`                   | `INDIRECT`     | `SEARCHABLE`                 | **`REQUIRED`** | **`CANDIDATE`** | YES              | `REQUIRED_CONTEXTUAL` |
| **P-16**          | Artikel-Detail (× 6)        | `INDIRECT`                   | `INDIRECT`     | `SEARCHABLE`                 | **`REQUIRED`** | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-17**          | Gated Resource (Gate)       | `INTENTIONALLY_NONE`         | `INDIRECT`     | `SEARCHABLE` (Gate-Seite)    | `OPTIONAL`     | `NONE`          | YES              | `REQUIRED_CONTEXTUAL` |
| **P-18**–**P-20** | Consumer (3 Familien)       | **`INTENTIONALLY_NONE`**     | **`INDIRECT`** | **`SEARCHABLE`**             | **`NONE`**     | `NONE`          | **YES — primär** | `OPTIONAL_CONTEXTUAL` |
| **P-21**–**P-23** | Legal (3)                   | `INTENTIONALLY_NONE`         | `DIRECT`       | **`INTENTIONALLY_EXCLUDED`** | `OPTIONAL`     | `NONE`          | YES              | `NONE`                |
| **P-24**–**P-25** | Wissens-Landingpages (`de`) | `INTENTIONALLY_NONE`         | `INDIRECT`     | `SEARCHABLE`                 | `OPTIONAL`     | **`CANDIDATE`** | YES              | `OPTIONAL_CONTEXTUAL` |
| **P-26**          | Vitamin D3 Spray (B2B)      | `INTENTIONALLY_NONE`         | `INDIRECT`     | `SEARCHABLE`                 | `OPTIONAL`     | `NONE`          | YES              | `OPTIONAL_CONTEXTUAL` |
| **P-27**          | Epigenetik-Inquiry          | `INDIRECT`                   | `INDIRECT`     | `INTENTIONALLY_EXCLUDED`     | `OPTIONAL`     | `NONE`          | NO               | `REQUIRED_CONTEXTUAL` |

`INDIRECT` heißt: über Hub, Mega-Menü, Crosslink oder Search erreichbar — **bewusst** nicht als eigener
globaler Menüeintrag. Keine Zeile ist unklassifiziert; keine Entscheidung wurde offengelassen.

### 10.16 Redirect-Quellen und 404 in der Findability

**Redirect-Quellen (`X-01`–`X-06`):** nicht in der Hauptnavigation · nicht als primäres Footer-Ziel ·
nicht als Search-Ziel · nicht als Breadcrumb-Zielseite · nicht als Content-Eintrag in der Sitemap.
Interne Links zeigen **direkt auf das kanonische Ziel**, nicht auf die Redirect-Quelle — der heutige
`/services/dental`-Link ist genau diese Verletzung (`IAD-18`).

**404 (`N-01`):** kein Navigationseintrag · kein Search-Ziel · kein Sitemap-Eintrag · kein normaler
Crosslink · kein Findability-Ziel (`IA-24`). Eine 404-Seite darf hilfreiche Ausstiege anbieten; das
macht sie nicht zu einem IA-Ziel.

**Technische Pfade (`T-01`–`T-06`):** in keinem Findability-Kanal.

---

## 11. Bekannte IA-Schulden (Ist-Zustand)

**Kein zulässiges Zielverhalten.** In PT03.1 bewusst **nicht** repariert. Sprachliche und routing-
seitige Schulden sind in `I18N-CONTRACT.md` §5 und `ROUTING-CONTRACT.md` §5/§5.1 geführt und werden
hier referenziert statt dupliziert.

| ID         | Schuld (belegt)                                                                                                                                                                      | Current                      | Target                                     | Owner-AP            | Launch-Relevanz            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------------------------------------------ | ------------------- | -------------------------- |
| **IAD-01** | **Consumer wird auf `/en/` gezwungen** — zwei 301-Zweige in `server.ts`; Sitemap führt Consumer nur einsprachig; die drei Seiten sind vollständig hartkodiert (0 × `useTranslation`) | EN-only                      | **10 Locales, indexierbar**                | AP21 mit AP08/AP09  | **Gate 1 + Gate 4**        |
| **IAD-02** | **Epigenetik hängt navigatorisch unter Diagnostik** — `Header.tsx` führt `/epigenetics` und `/epigenetics#musterbefunde` als Kinder des `/diagnostics`-Menüpunkts                    | Unterpunkt der Diagnostik    | **eigener Hauptnavigationspunkt**          | AP03 PT03.4 / AP06  | **Gate 6**                 |
| **IAD-03** | **Musterbefund-Inhalte nur `de`/`en`** — 6 Panels × 2 Sprachen, während die Routen × 10 beworben werden                                                                              | 2 Locales                    | **10 Locales**                             | AP08/AP16           | **Gate 1**                 |
| **IAD-04** | **Toter Suchtreffer** — `useSearch.ts` führt den Service `sports`, den `services.tsx` nicht kennt; dazu ein auskommentierter `/casestudys/32reasons`-Eintrag                         | Treffer ohne Ressource → 404 | nur kanonisch existierende Ziele (`IA-17`) | AP07 PT07.1         | Findability                |
| **IAD-05** | **Legal-Indexierungswiderspruch** — `/privacy`, `/imprint`, `/terms` setzen `noindex={true}`, stehen aber je 10× in der Sitemap                                                      | widersprüchlich              | **eine deklarierte Policy**                | AP20 PT20.4.8       | **Gate 4**                 |
| **IAD-06** | **Zwei Download-Welten** — `downloads.json` führt 3 Einträge; die 26 Epigenetik-PDFs und 3 ZIPs erscheinen nicht im Resource-Hub                                                     | getrennte Kataloge           | ein Ressourcenmodell                       | AP19 PT19.1         | Resource Center            |
| **IAD-07** | **Kein gated Pfad vorhanden** — weder Gate noch Entitlement existieren, obwohl `DEC-RL-014` mindestens einen verlangt                                                                | keiner                       | **mindestens ein gated Pfad**              | AP19/AP22           | **Gate 10**                |
| **IAD-08** | **Chat-Reste im Produkt** — `ChatWidget.tsx` wird global in `App.tsx` gerendert, `/api/chat` existiert weiter                                                                        | Chat vorhanden               | **kein Chat** (`DEC-RL-007`)               | AP06/AP22/AP23/AP26 | **Gate 5**                 |
| **IAD-09** | **Backlog-Artefakte im Repository** — `casestudies.json` und `shop.json` in allen 10 Locales, zwei auskommentierte Navigationseinträge                                               | Artefakte vorhanden, inaktiv | **bleiben Backlog** (`DEC-RL-015`)         | AP08/AP27           | keine — nicht reaktivieren |
| **IAD-10** | **`/services*` ist keine echte 301-Brücke** — die Umleitung macht ein clientseitiges `<Navigate>`; `/services` steht als bekannte Route auf 200                                      | Client-Redirect              | **echte serverseitige 301, ein Hop**       | AP10 PT10.1.2       | **Gate 4**                 |
| **IAD-11** | **Epigenetik-Inquiry ist nicht eigenständig** — die Strecke multiplext über `/api/contact`, ohne eigenen Lead-Typ oder CRM-Routing                                                   | als Contact-Lead behandelt   | **eigene Inquiry-Strecke** (`DEC-RL-011`)  | AP15/AP22           | **Gate 6 + Gate 3**        |

**Neu aus AP03 PT03.2 (Rollen- und Taxonomie-Schulden, gemessen 2026-08-24):**

| ID         | Schuld (belegt)                                                                                                                                                                                                                                                      | Current                                 | Target                                                                         | Owner-AP                                       | Launch-Relevanz |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------- | --------------- |
| **IAD-12** | **Der allgemeine Sales-CTA heißt heute überwiegend nicht „Angebot anfragen"** — in den `de`-Namespaces steht „Beratung buchen" **15×** in sechs Dateien (`home`, `products`, `contact`, `articles`, `downloads`, `support`), „Angebot anfragen" nur **7×** in dreien | zwei konkurrierende Sales-CTA-Wortlaute | **ein Standard: „Angebot anfragen"** (`IA-07`, `DEC-RL-013`)                   | **AP04**/**AP08** mit AP11/AP13/AP14/AP17/AP19 | **Gate 9**      |
| **IAD-13** | **Artikel tragen einen pauschalen kommerziellen Einheits-CTA** — `ArticlePage.tsx` zeigt auf **jedem** Artikel denselben Primär-CTA plus ROI-Rechner, unabhängig vom Thema                                                                                           | Einheits-CTA je Artikel                 | **kontextabhängiger nächster Schritt** (§8.2 T6)                               | **AP17** mit AP04                              | IA-Qualität     |
| **IAD-14** | **Ressourcen tragen keine Zugangsklasse** — die Einträge in `src/content/downloads.json` führen weder ein `public`/`gated`-Merkmal noch eine Entitlement-Referenz; die Rolle `public-resource` vs. `gated-lead-magnet` ist heute nicht auslesbar                     | keine Klassifikation                    | **deklarierte Zugangsklasse je Ressource** (`CONTENT-ASSET-CONTRACT.md` CA-30) | **AP19 PT19.1/PT19.2**                         | **Gate 10**     |

**Neu aus AP03 PT03.4 (Findability-Schulden, gemessen 2026-08-24):**

| ID         | Schuld (belegt)                                                                                                                                                                                 | Current                                | Target                                                       | Betroffen                    | Owner-AP                   | Launch-Relevanz |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------ | ---------------------------- | -------------------------- | --------------- |
| **IAD-15** | **Search-Index deckt große Teile der IA nicht ab** — `useSearch.ts` kennt **0** Einträge für Consumer, die drei Epigenetik-Vertiefungen, die sechs Musterbefunde, Downloads, Events und Support | 6 statische Pfade + Services + Artikel | Zielumfang nach §10.9                                        | J-03, J-04, J-05, J-06, J-07 | **AP07 PT07.1**            | Findability     |
| **IAD-16** | **Footer ohne Epigenetik- und Support-Einstieg** — beide Bereiche fehlen vollständig; Consumer ebenfalls nicht vertreten                                                                        | 17 Links ohne diese Bereiche           | Footer-Bereiche nach §10.7, Consumer `INDIRECT`              | J-03, J-06, J-07             | **AP06 PT06.3**            | **Gate 6**      |
| **IAD-17** | **Footer führt nur 6 der 9 Services** — es fehlen `infektion-entzuendung`, `stoffwechsel-herz`, `kompatibilitaet-integration`                                                                   | 6/9                                    | vollständige oder bewusst begründete Auswahl (§10.7)         | J-01                         | **AP06 PT06.3**            | Findability     |
| **IAD-18** | **Interner Link auf eine Redirect-Quelle** — `VitaminD3ImplantologyPage.tsx` verlinkt auf `/services/dental` statt auf `/diagnostics/dental`                                                    | Legacy-Ziel im Content                 | kanonisches Ziel (§10.16, `ROUTING-CONTRACT.md` R-37)        | J-01                         | **AP10**/**AP20**          | **Gate 4**      |
| **IAD-19** | **Consumer ist intern nirgends verlinkt** — außerhalb der Consumer-Seiten existiert **kein** interner Link auf `/consumer/*`; erreichbar nur per Direkt-URL und organischer Suche               | keine interne Findability              | Footer `INDIRECT` + Search + kontextuelle Crosslinks (§10.8) | J-06                         | **AP06**/**AP07**/**AP21** | **Gate 1/4**    |

`IAD-14` ist die **IA-Sicht** auf denselben Sachverhalt, den `CONTENT-ASSET-CONTRACT.md` `CD-6`/`CD-8`
aus der Content-/Asset-Sicht führen; er wird hier nicht dupliziert, sondern als Rollenlücke benannt.

Keine dieser Schulden ist PT03.1- oder PT03.2-blockierend; jede hat einen Owner-AP. **Aus keiner Schuld
wird eine neue Product Decision abgeleitet.**

---

## 12. Owner-AP-Mapping

| Owner-AP | Verantwortet im IA-Kontext                                                 | Betroffene IA-IDs                         |
| -------- | -------------------------------------------------------------------------- | ----------------------------------------- |
| **AP04** | Content-/Asset-Readiness der inventarisierten Seiten                       | alle Seitenfamilien                       |
| **AP06** | Header, Footer, globale Navigation                                         | `IAD-02`, PT03.4-Werte                    |
| **AP07** | Search und interne Findability                                             | `IAD-04`, PT03.4-Werte                    |
| **AP08** | 10-Sprachen-Lokalisierung, Abbau der Single-Locale-Sonderfälle             | P-18–P-20, P-24, P-25, `IAD-01`, `IAD-03` |
| **AP09** | SEO-Plattform, Sitemap, Canonical/hreflang, Indexierbarkeit                | alle indexierbaren Familien               |
| **AP10** | Route Registry, Redirects, HTTP-Status                                     | X-01–X-06, N-01                           |
| **AP11** | Homepage                                                                   | P-01                                      |
| **AP12** | Diagnostik-Hub                                                             | P-09                                      |
| **AP13** | Service-Detailseiten                                                       | P-11 (9 Ressourcen)                       |
| **AP14** | IglooPro-Produktstrecke                                                    | P-08, P-26                                |
| **AP15** | Epigenetik-Säule und Inquiry                                               | P-10, P-12–P-14, P-27                     |
| **AP16** | Musterbefunde                                                              | P-15 (6 Ressourcen)                       |
| **AP17** | Artikel                                                                    | P-07, P-16                                |
| **AP18** | Events                                                                     | P-05                                      |
| **AP19** | Downloads, Resource Center, Lead-Magnet/Gating                             | P-06, P-17, `IAD-06`, `IAD-07`            |
| **AP20** | About, Contact, Support, Legal                                             | P-02–P-04, P-21–P-23, `IAD-05`            |
| **AP21** | Consumer × 10                                                              | P-18–P-20, `IAD-01`                       |
| **AP22** | Lead-Plattform hinter allen Conversion-Pfaden                              | P-03, P-04, P-17, P-27                    |
| **AP27** | automatisierte Guards für Route-, Search-, Sitemap- und Paritätskonsistenz | `IAD-04`, `IAD-09`, `IAD-15`, `IAD-18`    |

**Findability-Owner aus PT03.4:** Header, Mega-Menü und Footer → **AP06** · Search → **AP07** ·
locale-sichere Labels und Link-Ziele → **AP08** · Breadcrumb-Structured-Data → **AP09** · kanonische
Link-Ziele und Redirects → **AP10** · Consumer-Findability → **AP21** mit AP06/AP07 · ChapterNav-Technik
und Accessibility → **AP06** mit **AP24**/**AP25** · automatisierte Link-/Route-Guards → **AP27**.

---

## 13. IA-Invarianten

Die kanonische Systematik `IA-01`–`IA-25` stammt aus `AP03.md` §10 und wird hier **nicht** erweitert.

### 13.1 Durch PT03.1–PT03.4 abgedeckt

| ID        | Invariante                                                                       | Nachweis in diesem Dokument                                       |
| --------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **IA-01** | Jede scope-verbindliche Seitenfamilie ist im kanonischen Inventar erfasst        | §4 (P-01–P-27), §7 Abdeckung                                      |
| **IA-02** | Keine IA-Seite behauptet einen Pfad gegen den Routing-Vertrag                    | §2.3, §3, §4 — alle Pfade aus `ROUTING-CONTRACT.md` abgeleitet    |
| **IA-03** | Jede logische Inhaltsseite besitzt genau einen primären Seitentyp                | §8.1 Taxonomie, §8.4 Matrix — 27/27, keine `UNCLASSIFIED`         |
| **IA-04** | Jede logische Inhaltsseite besitzt eine definierte primäre Zielgruppe            | §8.3 Vokabular, §8.4 Spalte „Zielgruppe" — 27/27                  |
| **IA-05** | Jede logische Inhaltsseite besitzt eine definierte primäre Aufgabe               | §8.3 Vokabular, §8.4 Spalte „Hauptaufgabe" — 27/27                |
| **IA-06** | Jede logische Inhaltsseite besitzt einen primären CTA oder explizit `NONE`       | §8.4 — 24 mit CTA-Rolle, 3 Legal-Seiten explizit `NONE`           |
| **IA-07** | Der allgemeine B2B-Sales-Anfrageweg verwendet „Angebot anfragen"                 | §8.3 `QUOTE_REQUEST`; Ist-Abweichung als `IAD-12` geführt         |
| **IA-12** | Consumer muss nicht automatisch in der B2B-Hauptnavigation erscheinen            | §8.6 (P-18–P-20 `INTENTIONALLY_NONE`); finale Findability PT03.4  |
| **IA-15** | Mindestens eine gated Secondary Conversion ist IA-seitig vorgesehen              | §8.4 P-17 `SECONDARY_CONVERSION` · `content_download`             |
| **IA-20** | Findability ist je Seitenfamilie bewusst klassifiziert                           | §10.15 — finale Matrix über alle 27 Familien, keine offenen Werte |
| **IA-16** | Lead-Journeys referenzieren das persistente Lead-/CRM-Zielmodell, kein Mail-only | §9.1, §9.2 — jede Lead-Journey mit AP02-Lead-Typ                  |
| **IA-21** | Alle sieben Master-Scope-Kernjourneys sind vollständig modelliert                | §9.2 `J-01`–`J-07`, Übersicht §9.3                                |
| **IA-22** | Strategisch wichtige Seiten ohne sinnvollen nächsten Schritt sind Debt + Owner   | §9.4 Sackgassenanalyse je Journey                                 |
| **IA-09** | Epigenetik besitzt im Zielbild einen eigenen Hauptnavigationspunkt               | §10.3, §10.5, §10.15 (P-10 `DIRECT`)                              |
| **IA-17** | Search zeigt nur auf kanonisch existierende Zielrouten                           | §10.9 · Ist-Verstoß `IAD-04`                                      |
| **IA-18** | Breadcrumb-Hierarchie ist fachlich begründet, nicht URL-abgeleitet               | §10.10 — explizite Items statt Pfad-Segmentierung                 |
| **IA-19** | ChapterNav nur auf dafür geeigneten langen Seiten                                | §10.11 Eignungskriterien · §10.15 Spalte ChapterNav               |
| **IA-08** | Epigenetik ist als eigenständige Geschäftssäule modelliert                       | §4.3 Kopfhinweis, §4.4                                            |
| **IA-10** | Jede Consumer-Familie unterstützt im Ziel alle zehn Locales                      | §4.8 (P-18–P-20, Ziel-Locales = 10)                               |
| **IA-11** | Consumer ist als indexierbarer SEO-Bereich klassifiziert                         | §4.8 Kopfhinweis                                                  |
| **IA-13** | Deal/Voucher/Case Studies/Shop sind nicht Teil der Launch-IA                     | §14, `IAD-09`                                                     |
| **IA-14** | Chat ist kein Navigations-, Support- oder Conversion-Pfad des Zielbilds          | §15, `IAD-08`                                                     |
| **IA-23** | Redirect Sources sind keine normalen Inhaltsseiten                               | §5 Kopfhinweis                                                    |
| **IA-24** | 404 ist keine reguläre indexierbare Inhaltsseite                                 | §6.1                                                              |
| **IA-25** | AP03 verändert keine Navigation, Routes, Search oder Anwendungskomponenten       | §1 Stand, Scope-Nachweis im PT03.1-Report                         |

### 13.2 Offen — spätere Primärtasks

`IA-09`, `IA-17`, `IA-18`, `IA-19` (eigener Epigenetik-Navigationspunkt, Search-Validität,
Breadcrumb-Intent, ChapterNav-Intent) → **PT03.4**. Sie sind hier **nicht** vorweggenommen.

Mit PT03.4 sind `IA-09`, `IA-17`, `IA-18`, `IA-19` und `IA-20` abgedeckt; **alle 25 IA-Invarianten aus
`AP03.md` §10 sind damit adressiert.** Verbleibende Umsetzungslücken sind als Debt mit Owner-AP geführt
(§11), nicht als offene Klassifikation.

---

## 14. Backlog-Abgrenzung

`DEC-RL-015`: **Deal/Voucher, Case Studies und Shop bleiben Backlog.** Vorhandene Repository-Artefakte
— `casestudies.json` und `shop.json` in allen zehn Locales, zwei auskommentierte Navigationseinträge in
`Header.tsx`, ein auskommentiertes Suchziel — sind **Legacy-/Backlog-Artefakte** (`IAD-09`).

Sie sind **keine** aktive Relaunch-Seite, gehören **nicht** in die Navigation, werden **nicht**
reaktiviert und erweitern den Scope **nicht**. Eine Hochstufung liefe ausschließlich über einen
`ACCEPTED`-Eintrag in `SCOPE-CHANGELOG.md`.

---

## 15. Chat ist kein IA-Pfad

`DEC-RL-007`: **Kein Chat im Relaunch.** Der heutige Bestand — `ChatWidget.tsx`, global in `App.tsx`
gerendert, sowie `POST /api/chat` — ist ausschließlich **CURRENT DEBT / LEGACY** (`IAD-08`).

Chat ist **kein** Navigationspunkt, **kein** Support-Kanal, **kein** Conversion-Pfad und **keine**
Journey-Station des Zielbilds. Die Entfernung gehört AP06, AP22, AP23 und AP26; PT03.1 entfernt nichts.

---

## 16. Status dieses Dokuments

Dies ist **IA-Wahrheit**, keine Routing-, Scope- oder Decision-Wahrheit.

Bei Widerspruch gewinnen `MASTER-SCOPE.md` und `PROJECT-CONSTRAINTS.md`; bei Pfad-, Locale- oder
Statusfragen gewinnt `ROUTING-CONTRACT.md`, bei Indexierung `SEO-CONTRACT.md`, bei Sprachumfang
`I18N-CONTRACT.md`. Dieses Dokument ist dann falsch und wird korrigiert.

Die Rollenquelle für Seitentyp, Zielgruppe, Aufgabe und CTA ist **§8.4/§8.6**; §4 bleibt die
Inventarsicht. Bei Abweichung zwischen beiden gilt §8.

**Änderungen** verantwortet AP03; nach AP03-Closure die jeweils betroffenen Owner-APs aus §12.
Decision Locks werden hier nie geändert.
