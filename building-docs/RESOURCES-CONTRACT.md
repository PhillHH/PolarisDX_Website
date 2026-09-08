# RESOURCES-CONTRACT

**Guard-Level: G2.** Wer eine Resource-Metadatenquelle, eine Asset-Datei unter `public/downloads/**`
oder `storage/protected/**`, einen sichtbaren Download-Link oder den Gate-Pfad ändert, führt
`npm run check:resource-inventory`, `check:resource-center`, `check:content-download` und
`check:lead-magnets` aus.

**Stand:** AP19-CLOSURE (2026-09-02, konsolidiert und unabhängig reverifiziert) · **Branch:** `console/19-25-2026-09-02T08-36-17` ·
**HEAD:** `8a142173a5e2f89de09af2e76a1ce28ea243782e`

> ## Geltungsbereich
>
> Dieser Vertrag ist die **Ist-Wahrheit** des Ressourcenbestands und der gegateten Auslieferung.
> Jede Zahl darin ist gemessen und wird von einem Guard gegen Dateisystem, Registry und alle zehn
> Locale-Dateien nachgewiesen. Er beschreibt **kein Zielbild** und behauptet **keine** vollständige
> Cross-Journey-Lead-Plattform — die bleibt **AP22** (§11).

---

## 1. Zweck

Der Vertrag beantwortet fünf Fragen, und nur diese:

1. **Welche Ressourcen gibt es wirklich** — nicht welche behauptet werden?
2. **Wie heißt eine Ressource technisch**, unabhängig von Pfad, Sprache und Titel?
3. **In welchen Sprachen liegt sie real vor** — und wo endet die Sprachparität?
4. **Wie wird sie ausgeliefert** — frei, gegated oder gar nicht launchsichtbar?
5. **Wie funktioniert der gegatete Pfad** — und wie ist er gegen Umgehung gesichert?

Was eine Route ist, regelt `ROUTING-CONTRACT.md`. Welche Content-Schicht welche Verantwortung
trägt, regelt `CONTENT-ASSET-CONTRACT.md`. Dieser Vertrag dupliziert beides nicht.

---

## 2. Kanonische Quellen

| Rolle                                      | Datei                                                                                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Kanonische Resource-/Asset-Wahrheit**    | `src/content/resources/resourceInventory.ts`                                                                                                            |
| Darstellung des Resource Centers           | `src/content/resources/resourceCenter.ts`                                                                                                               |
| Lead-Magnet-Kandidatenmatrix               | `src/content/resources/leadMagnetCandidates.ts`                                                                                                         |
| **Abgeleitete** Server-Registry (CommonJS) | `server/resource-registry.json` · `npm run build:resource-registry`                                                                                     |
| Öffentliche Ablage                         | `public/downloads/**`                                                                                                                                   |
| Geschützte Ablage                          | `storage/protected/**` (außerhalb `public/`, kein Static-Handler)                                                                                       |
| Guards                                     | `check:resource-inventory` · `check:resource-center` · `check:content-download` · `check:lead-magnets` · `check:assets` · `check:epigenetics-resources` |

**RI-01** — Es gibt **genau eine** Resource-Metadatenquelle. Der frühere Parallelkatalog
`src/content/downloads.json` ist in PT19.5 **entfallen**; `check:resource-inventory` und
`check:resource-center` lassen den Build scheitern, wenn er zurückkehrt.

**RI-02** — `server/resource-registry.json` ist eine **Ableitung**, weil der Express-Server
CommonJS ist und die TS-Quelle nicht importieren kann. `check:content-download` regeneriert sie
im Speicher und bricht bei jeder Abweichung ab. RI-01 bleibt damit gültig.

---

## 3. Stabile Asset-ID

**RI-03** — Jede sichtbare Ressource trägt eine `id` der Form `rsc-<domain>-<nnn>`: eindeutig
(21 Ressourcen, 0 Kollisionen), stabil, **pfadunabhängig** und **sprach- und titelunabhängig**.
Sprachvarianten sind Varianten _einer_ ID, nicht eigene IDs. Der Guard weist Pfad- und
Titelableitung aktiv zurück. Frühere Katalog-IDs (`im-vitd3-spray-de`, `im-vitd3-spray-en`,
`im-de-igloo-pro`) sind als `legacyCatalogIds` geführt und **nicht kanonisch**.

---

## 4. Assetinventar

32 physische Dateien (31 öffentlich, 1 geschützt), 32 Varianten, 21 Ressourcen. Vollständig —
kein unklassifizierter Rest in beiden Ablagen.

| Asset-ID    | Kategorie            | Sprache | Sprachbeleg | Pfad                                                                 | Ablage    | Größe     | Seiten | Datum      | Auslieferung       | Bestand        |
| ----------- | -------------------- | ------- | ----------- | -------------------------------------------------------------------- | --------- | --------- | ------ | ---------- | ------------------ | -------------- |
| rsc-epi-001 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/00_Portfolio_Uebersicht_PolarisDX.pdf`               | public    | 80798 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-001 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/00_Portfolio_Overview_PolarisDX.pdf`                 | public    | 80231 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-002 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/01_Metabolic_Health_PolarisDX.pdf`                   | public    | 82637 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-002 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/01_Metabolic_Health_PolarisDX.pdf`                   | public    | 81560 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-003 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/02_Healthy_Aging_PolarisDX.pdf`                      | public    | 75500 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-003 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/02_Healthy_Aging_PolarisDX.pdf`                      | public    | 74331 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-004 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/03_Biologisches_Alter_PolarisDX.pdf`                 | public    | 81378 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-004 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/03_Biological_Age_PolarisDX.pdf`                     | public    | 80636 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-005 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/04_Telomer_Analyse_PolarisDX.pdf`                    | public    | 74794 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-005 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/04_Telomere_Analysis_PolarisDX.pdf`                  | public    | 74037 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-006 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/05_Stress_Monitor_PolarisDX.pdf`                     | public    | 80758 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-006 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/05_Stress_Monitor_PolarisDX.pdf`                     | public    | 80126 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-007 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/06_Healthy_Sport_PolarisDX.pdf`                      | public    | 82939 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-007 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/06_Healthy_Sport_PolarisDX.pdf`                      | public    | 82076 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-008 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/07_Konditionen_Anfrage_PolarisDX.pdf`                | public    | 71642 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-008 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/07_Terms_Enquiry_PolarisDX.pdf`                      | public    | 71358 B   | 2      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-009 | INFO_SHEET           | de      | gemessen    | `epigenetics/de/08_Evidenz_Studienlage_PolarisDX.pdf`                | public    | 81339 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-009 | INFO_SHEET           | en      | gemessen    | `epigenetics/en/08_Evidence_Base_PolarisDX.pdf`                      | public    | 79858 B   | 3      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-010 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/10_Musterbefund_Metabolic_Health_PolarisDX.pdf`      | public    | 1018990 B | 15     | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-011 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/11_Musterbefund_Healthy_Aging_PolarisDX.pdf`         | public    | 725693 B  | 9      | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-012 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/12_Musterbefund_Biologische_Altersuhr_PolarisDX.pdf` | public    | 699325 B  | 10     | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-013 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/13_Musterbefund_Telomer_Analyse_PolarisDX.pdf`       | public    | 640247 B  | 9      | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-014 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/14_Musterbefund_Stress_Monitor_PolarisDX.pdf`        | public    | 716851 B  | 9      | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-015 | SAMPLE_REPORT        | de      | gemessen    | `epigenetics/de/15_Musterbefund_Healthy_Sport_PolarisDX.pdf`         | public    | 842658 B  | 12     | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-016 | PARAMETER_GUIDE      | de      | gemessen    | `epigenetics/de/16_Parameteruebersicht_PolarisDX.pdf`                | public    | 322248 B  | 2      | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-017 | VALUES_GUIDE         | de      | gemessen    | `epigenetics/de/17_Werte_verstehen_PolarisDX.pdf`                    | public    | 400320 B  | 5      | 2026-08-10 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-018 | INFO_SHEET_BUNDLE    | de      | gemessen    | `epigenetics/PolarisDX_Unterlagen_DE.zip`                            | public    | 603986 B  | —      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-018 | INFO_SHEET_BUNDLE    | en      | gemessen    | `epigenetics/PolarisDX_Unterlagen_EN.zip`                            | public    | 595985 B  | —      | 2026-08-05 | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-epi-019 | SAMPLE_REPORT_BUNDLE | de      | gemessen    | `epigenetics/PolarisDX_Musterbefunde_DE.zip`                         | protected | 4262171 B | —      | 2026-08-10 | GATED              | ACTIVE_VISIBLE |
| rsc-prd-001 | PRODUCT_FLYER        | de      | behauptet   | `vitamin-d3-spray-de.pdf`                                            | public    | 1045006 B | 2      | —          | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-prd-001 | PRODUCT_FLYER        | en      | behauptet   | `vitamin-d3-spray-en.pdf`                                            | public    | 1014799 B | 2      | —          | FREE_PUBLIC        | ACTIVE_VISIBLE |
| rsc-prd-002 | PRODUCT_FLYER        | de      | behauptet   | `igloo-pro-flyer.pdf`                                                | public    | 494862 B  | 2      | —          | NOT_LAUNCH_VISIBLE | LEGACY_ORPHAN  |

**RI-04 — Metadatenwahrheit.** Größe, SHA-256, MIME und Seitenzahl sind gemessen. Datum stammt aus
dem PDF-`CreationDate` (26×) oder dem ZIP-Central-Directory (3×). **Kein Asset deklariert eine
Version** — `version` ist ausnahmslos `null` und wird nicht erfunden.

**RI-05 — Drei Assets ohne Datumsbeleg.** `vitamin-d3-spray-de.pdf`, `vitamin-d3-spray-en.pdf`
und `igloo-pro-flyer.pdf` sind bildbasierte PDFs ohne eingebettete Metadaten (`date: null`). Das
im früheren Katalog behauptete `2025-01-20` ist **nicht belegbar** und wird nicht übernommen; die
Karte zeigt deshalb kein Datum. Owner: AP04.

**RI-17 — Sichtbare Größen-/Seitenangaben.** 17 Meta-Schlüssel × 10 Locales = **170 sichtbare
Angaben** decken sich mit der jeweils ausgelieferten Datei. Toleranz: eine Einheit an der
angegebenen Nachkommastelle, dezimale und binäre Lesart zulässig.

---

## 5. Sprachmatrix

**RI-06** — Real existierende Sprachen je Ressource. Die zehn UI-Locales sind davon **unabhängig**:
Web-x10 bedeutet **nicht** Asset-x10.

| Asset-ID    | Reale Sprachen | Offenlegungspflicht (nur DE) | Sichtbares Label                                                    | Gerendert von                                                                                             |
| ----------- | -------------- | ---------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| rsc-epi-001 | de, en         | nein                         | `epigenetics:sheets[0].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-002 | de, en         | nein                         | `epigenetics:sheets[1].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-003 | de, en         | nein                         | `epigenetics:sheets[2].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-004 | de, en         | nein                         | `epigenetics:sheets[3].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-005 | de, en         | nein                         | `epigenetics:sheets[4].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-006 | de, en         | nein                         | `epigenetics:sheets[5].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-007 | de, en         | nein                         | `epigenetics:sheets[6].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-008 | de, en         | nein                         | `epigenetics:sheets[7].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-009 | de, en         | nein                         | `epigenetics:sheets[8].title`                                       | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx` · `pages/EpigeneticsEvidencePage.tsx`       |
| rsc-epi-010 | de             | ja                           | `epigenetics:samples.items[0].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-011 | de             | ja                           | `epigenetics:samples.items[1].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-012 | de             | ja                           | `epigenetics:samples.items[2].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-013 | de             | ja                           | `epigenetics:samples.items[3].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-014 | de             | ja                           | `epigenetics:samples.items[4].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-015 | de             | ja                           | `epigenetics:samples.items[5].panel`                                | `pages/MusterbefundPage.tsx` · `components/befund/BefundBlocks.tsx`                                       |
| rsc-epi-016 | de             | ja                           | `epigenetics:compare.cta`                                           | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-017 | de             | ja                           | `epigenetics:basics.cta`                                            | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-018 | de, en         | nein                         | `epigenetics:downloads.zipLabel`                                    | `pages/EpigeneticsPage.tsx` · `pages/EpigeneticsDocsPage.tsx`                                             |
| rsc-epi-019 | de             | ja                           | `epigenetics:samples.zipLabel`                                      | `pages/DownloadsPage.tsx` · `pages/EpigeneticsDocsPage.tsx` · `components/sections/EpigeneticsPanels.tsx` |
| rsc-prd-001 | de, en         | nein                         | `downloads:assets.vitd3De.title` · `downloads:assets.vitd3En.title` | `pages/DownloadsPage.tsx` · `pages/VitaminD3SprayPage.tsx`                                                |
| rsc-prd-002 | de             | ja                           | —                                                                   | —                                                                                                         |

**RI-07 — Auflösungsregel.** Locale `de` erhält die DE-Variante. Die neun übrigen Locales
erhalten die EN-Variante, **sofern eine existiert**; sonst die DE-Variante mit sichtbarer
Sprachkennzeichnung (`ResourceLanguageBadge` plus `downloads:languageNotice`). Ein stiller
Fallback ist ausgeschlossen: **falsche Sprachzuordnung über 10 Locales = 0**, im PT19.5-Browserlauf
für jede sichtbare Ressource × 10 Locales einzeln geprüft.

**RI-08 — Sprachbeleg.** 29 Varianten sind `TEXT_VERIFIED`: der extrahierte PDF-Textinhalt wurde
gegen deutsche und englische Funktionswörter ausgewertet, mit eindeutigem Ergebnis (DE-Dateien:
0 EN-Treffer; EN-Dateien: 0 DE-Treffer). Die drei bildbasierten Flyer enthalten keinen
extrahierbaren Text; ihre Sprache ist `CATALOG_ASSERTED` und wird **nicht** als belegt
ausgewiesen. Die SHA-256-Pins halten die Messung gültig.

**RI-09 — Keine falsche Parität.** 11 der 21 Ressourcen liegen zweisprachig (de/en) vor, 10 nur auf
Deutsch. Für keine Ressource wird eine Sprache behauptet, für die keine reale Datei existiert.

---

## 6. Free / Gated / Not-Launch-Visible

**RI-10** — Jede Ressource trägt **genau eine** Auslieferungsklasse.

| Klasse               | Anzahl | Bedeutung                                                    |
| -------------------- | ------ | ------------------------------------------------------------ |
| `FREE_PUBLIC`        | 19     | Frei abrufbar, ohne Anmeldung, statisch unter `/downloads/…` |
| `GATED`              | 1      | `rsc-epi-019` — nur über Asset-ID und gültiges Entitlement   |
| `NOT_LAUNCH_VISIBLE` | 1      | `rsc-prd-002` (IglooPro-Flyer), bewusst entlinkt             |

**RI-11 — `DEC-RL-014` ist erfüllt.** Es existiert ein realer, produktiv funktionierender gegateter
Secondary-Conversion-Pfad (§9). Zuvor war er offen; PT19.4 hat ihn geschlossen.

**RI-12 — Kopplung erzwungen.** `GATED` verlangt `storage: 'PROTECTED'`, und eine geschützt
abgelegte Datei verlangt `GATED`. Beide Richtungen brechen den Build. Ein Formular vor einer
weiterhin öffentlichen Datei kann so nicht als Gating durchgehen.

---

## 7. Bestand, Ablage und verwaiste Assets

**RI-13 — Ablage.** 31 Varianten `PUBLIC_STATIC`, 1 `PROTECTED`. `storage/protected/` liegt
außerhalb von `public/` und wird von keinem Static-Handler ausgeliefert; Ablageort über
`POLARIS_PROTECTED_ASSET_DIR` überschreibbar. Der Inhalt ist **versioniert** — ein aus der
Versionierung genommenes Asset wäre beim ersten Deploy verloren; der Schutz liegt im Ablageort,
nicht in der Abwesenheit.

**RI-14 — Bestandsklassifikation.** Vollständig, ohne `UNKNOWN_REVIEW_REQUIRED`:
`ACTIVE_VISIBLE` 20 · `ACTIVE_HIDDEN` 0 · `LEGACY_ORPHAN` 1 (`rsc-prd-002`, `OWNER_BOUND_AP14`) ·
`REPLACED` 0 · `UNKNOWN_REVIEW_REQUIRED` 0.

**RI-15 — Sichtbare kaputte Links = 0.** Über alle zehn Locales löst jeder sichtbare Download-Link
auf eine existierende Datei auf; im PT19.5-Lauf zusätzlich mit Byte-Länge und SHA-256 gegen das
Inventar geprüft.

**RI-16 — Inerte Referenzen entfernt.** `epigenetics:analyses.items[*].file` und
`epigenetics:contact.overviewFile` benannten Dateien, ohne je einen Link zu erzeugen. Sie sind in
PT19.5 aus allen zehn Locales entfernt; ebenso die ungenutzten `downloads:techBrochures` und
`downloads:infoMaterials`.

---

## 8. Resource Center

**RC-01** — `/{locale}/downloads` × 10 rendert **20 von 20** launchsichtbaren Ressourcen aus dem
Inventar. Die Seite führt keine eigene Liste.

**RC-02 — Gruppen aus realem Bestand.** Sieben reale Kategorien, vier Anzeigegruppen:
`info-sheets` 10 · `sample-reports` 7 · `guides` 2 · `product-flyers` 1. Eine Gruppe ohne Treffer
wird nicht gerendert; der Guard prüft das an einem synthetischen Datensatz, weil der heutige
Bestand keine leere Gruppe erzeugt.

**RC-03** — Filter/Sortierung: `NOT_REQUIRED_CURRENT_RESOURCE_VOLUME`. 20 Ressourcen in vier
benannten Gruppen sind ohne Filter überschaubar. Neu zu bewerten, sobald eine Gruppe zweistellig
**und** heterogen wird.

**RC-04** — Jede Karte trägt ihre Zugangsangabe **als Text und Symbol**, nicht nur als Farbe, und
nennt die Sprache der ausgelieferten Datei.

**RC-05** — Eine `GATED` Ressource bekommt **keine** `href` auf die Datei. Zwei unabhängige
Schichten sichern das: `freeResourceHref` gibt für alles außer `FREE_PUBLIC` `null` zurück, und die
Karte rendert den Datei-Link nur im Free-Zweig.

**RC-06 — SEO.** Canonical, 10× hreflang, `x-default` = de, Sitemap und Suchindex; kein
Vorschau-Host im SSR. Geschützte URLs stehen **nicht** in Sitemap, Suche oder robots.txt und
antworten mit `X-Robots-Tag: noindex, nofollow`.

---

## 9. Gegatete Auslieferung (`content_download`)

**CD-01 — Reihenfolge.** `validieren → Asset aus der Allowlist auflösen → Consent → PERSISTIEREN →
CRM/Outbox → Entitlement → Status`. Persistenz kommt vor jedem externen Handoff; der Test greift
den Lead **im Provider-Aufruf** aus der Datenbank und prüft die Audit-Spur
(`LEAD_RECEIVED`/`LEAD_PERSISTED`/`HANDOFF_PENDING`/`HANDOFF_ATTEMPT`). Der Guard erzwingt die
Reihenfolge zusätzlich im Quelltext.

**CD-02 — Der Download hängt nicht am CRM.** Ein temporärer Providerfehler hält den Lead in
`RETRY_PENDING`, liefert dem Leser trotzdem den Link und wird beim nächsten Worker-Lauf
`DELIVERED`. Ohne Provider wird `NO_PROVIDER_CONFIGURED` gemeldet statt Erfolg behauptet.

**CD-03 — Geteilte Foundation, keine zweite Plattform.** `LeadRepository`, `lead_outbox`,
`lead_events`, `LeadHandoffWorker` und `CrmRouter` sind unverändert die vorhandenen Primitive; das
CRM-Ziel `resources` war bereits registriert. Kontext trägt `assetId`, `requestedLanguage` und
`deliveredLanguage` getrennt.

**CD-04 — Kein Pfad aus dem Request.** Der Client nennt eine **Asset-ID**; der Server schlägt sie in
der Registry nach und baut den Pfad selbst. Traversal ist strukturell unmöglich, nicht gefiltert:
`../`, prozentkodiert, absolut, Backslash, Nullbyte, führendes Leerzeichen, ID+Pfad und der echte
Dateiname enden alle in `UNKNOWN_ASSET`.

**CD-05 — Kein öffentlicher Weg am Gate vorbei.** Eine Datei zu einem `GATED` Asset darf nicht
zusätzlich unter `public/downloads/` liegen — Guard-erzwungen und im Browser über sieben URL-Formen
geprüft, von denen keine 200 oder ZIP-Bytes liefert.

**CD-06 — Entitlement.** An Lead **und** Asset gebunden. Das Klartext-Token existiert genau einmal
(Rückgabewert von `issue()`); gespeichert wird nur `sha256(token)` — der Test liest die
SQLite-Datei binär und weist nach, dass das Token nicht darin vorkommt. Ablauf, Verbrauch,
Widerruf und Nebenläufigkeit werden serverseitig geprüft; ein wiederholter Submit **rotiert** das
Token, sodass es pro Lead und Asset immer genau einen lebenden Link gibt.

**CD-07 — Keine Token in Logs.** Die Auslieferungsroute protokolliert nur Fehlerklasse und
Asset-ID. Die Sicherheitsheader `Cache-Control: no-store, private`, `Referrer-Policy: no-referrer`,
`X-Content-Type-Options: nosniff` und `X-Robots-Tag: noindex, nofollow` werden **vor** der
Verzweigung gesetzt und gelten damit auch für Ablehnungen (403/410) — die URL trägt ein Geheimnis,
und eine cachebare Fehlerantwort wäre ein unnötiger Verbreitungsweg. Der Erfolgsfall ergänzt
`Content-Type` und `Content-Disposition: attachment`.

**CD-08 — Missbrauch.** Rate Limit pro IP (Einreichung 5, Abruf 30 je 15 min), Honeypot ohne
Persistenz, Idempotency-Key (Doppel-Submit = 1 Lead/Outbox/Handoff/Anspruch, abweichender
Wiederholer 409), Worker-Replay ohne zweite Zustellung.

**CD-09 — Consent.** `processingConsent` ist Pflicht und wird getrennt von `marketingConsent`
persistiert. **Analytics-Consent ist an keiner Stelle Voraussetzung**; das Gate importiert kein
Tracking-Modul, und pre-consent Provider-Requests sind 0.

---

## 10. Lead-Magnet-Kandidaten

| Kandidat               | Asset-ID          | Status                  | Delivery             | CRM                            | Bypass                |
| ---------------------- | ----------------- | ----------------------- | -------------------- | ------------------------------ | --------------------- |
| Musterbefund-Paket     | `rsc-epi-019`     | **GATED_LAUNCH_ACTIVE** | `PROTECTED_LINK`     | `content_download → resources` | `PROTECTED_NO_BYPASS` |
| Infoblatt-Paket        | `rsc-epi-018`     | `READY_NOT_ACTIVE`      | `PUBLIC_STATIC`      | bei Aktivierung                | —                     |
| Epigenetik-Infoblätter | `rsc-epi-001` ff. | `FREE_LAUNCH_ACTIVE`    | `PUBLIC_STATIC`      | keiner                         | —                     |
| Musterbefunde einzeln  | `rsc-epi-010` ff. | `FREE_LAUNCH_ACTIVE`    | `PUBLIC_STATIC`      | keiner                         | —                     |
| Parameterübersicht     | `rsc-epi-016`     | `FREE_LAUNCH_ACTIVE`    | `PUBLIC_STATIC`      | keiner                         | —                     |
| „Werte verstehen"      | `rsc-epi-017`     | `FREE_LAUNCH_ACTIVE`    | `PUBLIC_STATIC`      | keiner                         | —                     |
| Vitamin-D3-Flyer       | `rsc-prd-001`     | `FREE_LAUNCH_ACTIVE`    | `PUBLIC_STATIC`      | keiner                         | —                     |
| IglooPro-Flyer         | `rsc-prd-002`     | `DEFERRED`              | `NONE`               | keiner                         | —                     |
| ROI-Report             | **kein Asset**    | `DEFERRED`              | `TRANSACTIONAL_MAIL` | keiner                         | `PUBLIC_BY_DESIGN`    |

**LM-01 — Warum das Musterbefund-Paket.** Es ist der einzige Kandidat, bei dem ein Gate **nichts
wegnimmt**: alle acht im ZIP enthaltenen Dokumente bleiben einzeln `FREE_PUBLIC` und frei abrufbar.
Gegatet ist die Bequemlichkeit eines einzigen Downloads, nicht die Information. Höchster Fachwert
im Bestand (4,2 MB, acht vollständige Dokumente) und nur auf Deutsch — damit prüft der Pfad die
Sprachoffenlegung an einem echten Fall.

**LM-02 — ROI-Report.** Existiert real als `/api/roi-report`, erzeugt aber **kein statisches
Asset**: das PDF entsteht je Eingabe und geht per Mail raus. Es hat keine Asset-ID und passt nicht
in die `content_download`-Journey. Bereits e-mail-gegatet, aber ohne durable Persistenz, Outbox und
Retry — die Umstellung ist eine Journey-Migration und gehört zu **AP22**.

**LM-03 — Ein Kandidat wird gegatet, indem — und nur indem:** die Datei nach
`storage/protected/<variant.path>` wandert **und** unter `public/downloads/` entfernt wird; im
Inventar `deliveryClass: 'GATED'` und je Variante `storage: 'PROTECTED'` gesetzt wird;
`npm run build:resource-registry` läuft; `check:content-download` und `check:lead-magnets` grün
sind. Ein Schritt ohne den anderen lässt beide Guards scheitern.

**LM-04 — Ein Gate-Einstieg, drei Orte.** `ResourceGateTrigger` steht im Resource Center, auf
`/epigenetics/unterlagen` und auf `/epigenetics`. Der Aufrufer übergibt nur die Asset-ID; die
Komponente rendert **nichts**, wenn das Asset nicht gegatet ist.

---

## 11. AP22-Grenze

**AP-01** — AP19 liefert **einen** Journey-Slice (`content_download`) auf der geteilten Lead
Foundation. Es wurde **keine** zweite Lead-Plattform gebaut, keine Contact-/Support-Migration
angefasst und kein Asset-eigenes Backend angelegt.

**AP-02 — Ausdrücklich NICHT erledigt und nicht behauptet:** Cross-Journey-Vereinheitlichung,
Dashboard, Retention, gemeinsame Plattform-Oberfläche, Hintergrund-Worker für `RETRY_PENDING`,
Registrierung eines echten CRM-Adapters und die Migration der Legacy-Mailendpunkte
(Contact/Support/ROI). Owner ist **AP22**.

**AP-03 — Wiederverwendbar übergeben:** `LEAD_JOURNEYS`, `LeadRepository`, `lead_outbox`,
`lead_events`, `LeadHandoffWorker`, `CrmRouter`, `EntitlementRepository`, `ResourceGateForm`,
`ResourceGateTrigger` und der Registry-gestützte Asset-Resolver.

---

## 12. Nachweise PT19.5 (breites Integrationsgate)

**Produktionsbuild.** `check:befunde` plus Client- und SSR-Build mit der Produktionskonfiguration.
`dist/client/assets` gehört auf dieser Maschine `root` (Rest eines früheren Laufs als anderer
Benutzer); Vite kann das Verzeichnis nicht leeren. Der Build lief deshalb in ein schreibbares
Verzeichnis, das `server.ts` über `POLARIS_*_DIST_DIR` ohnehin unterstützt. Fremde Artefakte wurden
nicht angefasst.

**Integrationsgate 13/13** gegen diesen Build und den echten Backend: Resource Center x10 (HTTP 200,
Kategorien, keine Vorschau-Hosts, `/downloads` → 301 `/de/downloads`) · Asset-Sprachmatrix für jede
sichtbare Ressource × 10 Locales · FREE E2E über **alle 19** freien Ressourcen mit Byte-Länge und
SHA-256 · GATED E2E mit echter 4.262.171-Byte-Datei · Sicherheitsnegative (Bypass, Traversal,
kodierte Traversal, Token-Manipulation, fremdes Asset, fehlerhafte Anfragen) · Missbrauch
(Doppel-Submit, Replay, Honeypot, Rate Limit) · Consent (0 Provider-Requests, Ablauf funktioniert
ohne Analytics) · SEO x10 und noindex-Grenzen · A11y (Resource Center, geöffnetes Gate,
Erfolgsansicht, Fehlerzustand — Axe serious/critical 0) · Responsive 390/768/1440 in de/cs/pl mit
offenem Gate · Performance (0 eager Nutzlast, kein neues Provider-SDK) · Kandidatenmatrix gegen das
ausgelieferte System.

**Breiter Regressionslauf 190/190** über 21 Suiten: Epigenetik-Strecke, Musterbefunde, IglooPro,
Findability, Navigation, Sitemap, SEO-Head, i18n-Core, Consent, URL-Smoke, Resource Center und
Lead-Magnet.

**AP15-Golden-Path 1/1** mit seinem eigenen Harness (`server/pt15.7-e2e-server.js`) — er braucht
einen CRM-Empfänger und eine Beweisdatei; gegen den normalen Backend zu laufen würde nichts
beweisen.

**Unit/Node 204/204** in 24 Testdateien, darunter alle 47 AP19-Servertests.

**Guards grün:** `check:routes` (G1) · `check:seo` (G3) · `check:i18n` (G4, 15 Namespaces × 10) ·
`check:search-index` · `check:internal-findability` (G9) · `check:assets` ·
`check:epigenetics-resources` · `check:resource-inventory` · `check:resource-center` ·
`check:content-download` · `check:lead-magnets` · `check:befunde` · `check:befunde-seo` ·
`check:shell-i18n` · `check:ds-changelog` · `check-igloo-claim-contract` · `typecheck`.

**Guard-Negativnachweise, kumuliert:** `check:resource-inventory` 10 Mutationen ·
`check:resource-center` 9 · `check:content-download` 8 · `check:lead-magnets` 7 — alle erkannt,
Baum jeweils unverändert wiederhergestellt.

### 12.1 Vorbestehende, AP19-fremde Baseline-Befunde

Diese drei sind **nicht** von AP19 verursacht; kein einziger betroffener Pfad liegt in einer von
AP19 geänderten Datei (per `comm` gegen die Änderungsliste geprüft):

| Befund                     | Umfang                                                                                                    | Nachweis                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `npm run lint` rot         | 55 Dateien, überwiegend `_project-knowledge/` (archivierter Snapshot) plus 7 vorbestehende `src/`-Dateien | Schnittmenge mit AP19-Änderungen: **leer** |
| `npm run format:check` rot | 34 Dateien: `wireframes/`, `docs/`, `.archon/`, `_project-knowledge/`                                     | Schnittmenge mit AP19-Änderungen: **leer** |
| `npm run check:colors` rot | 2 `rgba(13,42,55,…)`-Schatten in `HeroSection.tsx` und `IglooProHero.tsx`                                 | beide Dateien von AP19 nicht angefasst     |

Zusätzlich lassen sich **37 jsdom-Testdateien** in dieser Umgebung nicht starten:
`html-encoding-sniffer` `require()`t unter Node 18 ein ES-Modul (`ERR_REQUIRE_ESM`). Das betrifft
jede Komponententestdatei im Repository unabhängig von AP19; keine davon gehört zu AP19, dessen
Tests alle `@vitest-environment node` oder Playwright nutzen. Die betroffene Oberfläche ist über
den Browserlauf abgedeckt.

### 12.2 In PT19.5 gefundene und behobene Testdefekte

| Befund                                        | Ursache                                                                               | Behebung                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Gate-Klick ging verloren                      | Interaktion vor der Hydration                                                         | zustandsabhängige, idempotente Öffnungsschleife            |
| Zwei Navigationstests flaky                   | dieselbe Hydrationsrennbedingung auf der Startseite, sichtbar erst unter Last         | gleiche Schleife, Produktcode unverändert                  |
| Axe meldete Kontrastfehler                    | Messung **mitten in der `Reveal`-Einblendung** gegen eine halbtransparente Mischfarbe | Messung im Ruhezustand, beide Scrollpositionen abgewartet  |
| Sicherheitsnegative bekamen 429               | mehrere Fälle teilten eine Absender-IP; der Limiter räumte die späteren ab            | eigene IP je Fall und je Browser-Suite                     |
| AP15-Golden-Path brach beim Start ab          | lief gegen den falschen Backend und ohne Beweispfade                                  | separater Lauf mit dem AP15-Harness                        |
| `check-igloo-claim-contract.mjs` startete nie | `import.meta.dirname` gibt es erst ab Node 20.11                                      | URL-basierte Auflösung; der Guard läuft jetzt und ist grün |

---

## 13. Offene, ownergebundene Punkte

| ID        | Sachverhalt                                                                                                                                                                                                          | Owner                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `CD-15`   | Mail-Zustellung des geschützten Links nicht angeschlossen; die Erfolgsansicht liefert ihn. Bewusst nicht in AP19 gebaut: eine Transaktionsmail wäre ein zweiter Zustellkanal mit eigenem Retry- und Bounce-Verhalten | AP22 / Betrieb         |
| `CD-16`   | Kein CRM-Adapter registriert — `NO_PROVIDER_CONFIGURED` ist der ehrliche Ist-Zustand                                                                                                                                 | AP22 / Betrieb         |
| `CD-17`   | Der Worker läuft synchron im Request; ein Hintergrundlauf für `RETRY_PENDING` fehlt                                                                                                                                  | AP22                   |
| `LM-05`   | ROI-Report auf die geteilte Foundation migrieren                                                                                                                                                                     | AP22                   |
| `LM-06`   | Deployment der geschützten Ablage: `POLARIS_PROTECTED_ASSET_DIR` setzen und `storage/protected/**` mit ausrollen; ohne beides liefert der Gate-Pfad `ASSET_FILE_MISSING`                                             | Betrieb                |
| `RES-03`  | Katalogdatum der Vitamin-D3-Flyer bleibt unbelegt; die Karte zeigt kein Datum                                                                                                                                        | AP04                   |
| `RES-04`  | Sprache der drei bildbasierten Flyer maschinell nicht belegbar                                                                                                                                                       | AP04                   |
| `RES-05`  | `rsc-prd-002` bleibt `OWNER_BOUND_AP14` bis ein freigegebener Ersatz existiert                                                                                                                                       | AP14                   |
| `BASE-01` | `lint`, `format:check` und `check:colors` sind im Baseline rot (§12.1)                                                                                                                                               | jeweiliger Datei-Owner |
| `BASE-02` | 37 jsdom-Testdateien starten unter Node 18 nicht (§12.1)                                                                                                                                                             | Toolchain / AP22       |

---

## 14. AP19-CLOSURE — unabhängige Reverifikation (2026-09-02)

Closure vertraut keinem PT-PASS. Alles Folgende wurde **neu gemessen**, teils mit eigenen Werkzeugen
statt mit den Guards des Projekts.

### 14.1 Unabhängige Messungen

| Prüfung                   | Methode                                                                                                               | Ergebnis                                                                                                                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Inventar                  | Dateisystem beider Ablagen unabhängig gehasht und mit dem Inventar verglichen                                         | 32/32 Dateien, **0 Abweichungen** bei Größe, SHA-256, MIME, Seitenzahl, Datum                                                                                                             |
| Stabile IDs               | Formprüfung und Kollisionstest                                                                                        | 21 IDs, 0 Kollisionen, 0 Formverstöße                                                                                                                                                     |
| Sprachwahrheit            | PDF-Textinhalt neu extrahiert (ASCII85+Flate sowie ToUnicode-CMaps) und gegen Sprachmarker gescort                    | **26/26 erwartungsgemäß, 0 Konflikte**                                                                                                                                                    |
| Locale→Asset              | alle Dateireferenzen aus den zehn Locale-Dateien gegen die Registry aufgelöst                                         | **0 Abweichungen**, kein stiller Fallback                                                                                                                                                 |
| Public Bypass             | 10 URL-Formen live gegen den Produktionsserver                                                                        | **0× HTTP 200**, 0 ZIP-Bytes                                                                                                                                                              |
| Resolver                  | 12 Angriffsformen (Dateiname, `../`, einfach/doppelt kodiert, absolut, Backslash, Nullbyte, Case, ID+Pfad, unbekannt) | 403/404, **0 Byte Dateizugriff**                                                                                                                                                          |
| Entitlement               | falsches/leeres Token, fremder Anspruch, fremdes Asset                                                                | 403 `INVALID_TOKEN` bzw. `ASSET_MISMATCH`                                                                                                                                                 |
| Ablauf/Widerruf/Verbrauch | Datenbank manipuliert, Link erneut abgerufen                                                                          | 410 `ENTITLEMENT_EXPIRED` · 403 `ENTITLEMENT_REVOKED` · 410 `ENTITLEMENT_EXHAUSTED`                                                                                                       |
| Persistenz                | SQLite nach dem Lauf direkt gelesen                                                                                   | 7 Leads / 7 Outbox-Zeilen (1:1), vollständiger Kontext, Ereigniskette `LEAD_RECEIVED → LEAD_PERSISTED → HANDOFF_PENDING → HANDOFF_ATTEMPT → HANDOFF_FAILED_TERMINAL → ENTITLEMENT_ISSUED` |
| Idempotenz                | gleicher Key zweimal, dann abweichender Inhalt                                                                        | identische `leadId` **und** `entitlementId`; Konflikt 409                                                                                                                                 |
| Abuse                     | Honeypot, fehlender Consent, Rate Limit                                                                               | 200 ohne Vorgang · 400 · 5×202 dann 429                                                                                                                                                   |
| Log-Audit                 | vollständiges Backend- und SSR-Log durchsucht                                                                         | **0 Treffer** für Token, Entitlement-ID, E-Mail, Idempotency-Key, Authorization                                                                                                           |
| Zustellung                | echter Abruf                                                                                                          | 200, 4.262.171 Byte, SHA-256 identisch zum Inventar                                                                                                                                       |

### 14.2 Ein Befund, in Closure behoben

`X-Robots-Tag`, `Cache-Control`, `Referrer-Policy` und `X-Content-Type-Options` wurden nur auf dem
**Erfolgspfad** gesetzt. Eine abgelehnte Anfrage (403/410) antwortete ohne sie. Die Header stehen
jetzt vor der Verzweigung und gelten für beide Pfade (CD-07). Danach erneut verifiziert:
Ablehnung **und** Erfolg tragen alle vier.

### 14.3 Reverifizierte Läufe

Integrationsgate **13/13** gegen einen frischen Produktionsbuild · breiter Regressionslauf
**190/190** über 21 Suiten · AP15-Golden-Path **1/1** mit eigenem Harness · Unit/Node **204/204** ·
17 Guards grün · ESLint und Prettier auf allen 86 AP19-Dateien grün.

### 14.4 False-Ready-Audit

| Prüfpunkt                                | Ergebnis                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| GATED-Datei noch öffentlich              | nein                                                                                |
| x10-UI mit falschsprachiger Datei        | nein                                                                                |
| „persistent" ohne dauerhaften Speicher   | nein — SQLite nach dem Lauf gelesen                                                 |
| CRM-Erfolg aus Mail-Versand/DRY_RUN      | nein — der Pfad berührt SendGrid nicht (0 Treffer)                                  |
| Retry nur clientseitig                   | nein — Outbox mit `available_at`/`attempts`; das Formular hat keine Retry-Logik     |
| Idempotenz ohne Backend-Schutz           | nein — `UNIQUE(idempotency_key)`, `UNIQUE(token_hash)`, `UNIQUE(lead_id, asset_id)` |
| Endpunkt akzeptiert Dateipfad            | nein                                                                                |
| Token in Logs                            | nein                                                                                |
| Analytics-Consent für den Download nötig | nein — 0 Tracking-Referenzen im Gate-Pfad                                           |
| Erfolg vor dauerhaftem Zustand           | nein — `createLead` (Z. 179) vor `processNext` (Z. 197) vor `issue` (Z. 199)        |
| AP22 als vollständig behauptet           | nein — 0 Treffer in Vertrag und State                                               |

**False-ready = 0.**
