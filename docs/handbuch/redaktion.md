# Redaktionsdokumentation (PT33.2)

Schritt-für-Schritt-Anleitungen für Redaktion **mit Repository-Zugang**. Es gibt kein CMS: Inhalte
liegen als Code-Stammdaten (`src/data/`, `src/content/`) und Übersetzungsdateien
(`public/locales/<lang>/<namespace>.json`). Jede Änderung geht als Commit durch dieselben Gates wie
Code.

## 0. Vor jeder Änderung

- [ ] `git status` sauber oder nur eigene Änderungen; fremde Änderungen nicht anfassen.
- [ ] Zuständigen Contract kurz lesen (in jedem Abschnitt genannt) und die Namespace-Zuständigkeit
      in `I18N-CONTRACT.md` §6 M-01 beachten.
- [ ] **Alle 10 Sprachen** (`de en pl fr it es pt da nl cs`) im selben Change. Ein fehlender oder
      leerer Wert lässt `npm run check:i18n` scheitern; Englisch als Platzhalter ist verboten.
- [ ] **Keine erfundenen Aussagen.** Zahlen, Zeiten, Zertifizierungen, Garantien nur mit Beleg im
      Claim-Register (`HOMEPAGE-CONTRACT.md` §9, `HCL-*`; Produkt-Claim `CV < 2 %` laut `DEC-RL-008`).
      Fachliche Claim-Entscheidungen je Service: `SERVICE-DETAIL-CONTRACT.md` §7.
- [ ] Ansehen: `npm run dev`, dann `http://localhost:3000/de/…` (siehe `README.md` §4). Produktiv
      werden Übersetzungen erst nach einem Build sichtbar.

Prüfbefehle, die fast immer passen:

```bash
npm run check:i18n          # Key-Parität, leere Werte, Platzhalter, EN-/DE-Kopien, Interpolation
npm run check:seo           # Title/Description, Sitemap, robots, Structured Data
npm run format:check        # oder: npx prettier --write <dateien>
```

## 1. Service ändern

**Contract:** `SERVICE-DETAIL-CONTRACT.md` · **Seite:** `/<lang>/diagnostics/<id>` (9 Services).

| Was                                | Wo                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Texte (Hero, Abschnitte, FAQ, CTA) | `public/locales/<lang>/services.json` → `<translationKey>.*`, z. B. `dental.detail.problem`, `dental.faq`                  |
| Meta                               | `<translationKey>.seo.title`, `<translationKey>.seo.description`                                                           |
| Zuordnungen                        | `src/data/services.tsx`: `relatedArticleIds`, `detailCrosslinks` (Registry-IDs, keine Pfade), `hubCategory`, `hubPriority` |

`translationKey` ≠ URL-Slug: z. B. Slug `poc-systemloesungen`, Key `poc_systemloesungen`
(Tabelle in `SERVICE-DETAIL-CONTRACT.md` §2).

1. Text in `public/locales/de/services.json` ändern, dieselbe Struktur in allen neun weiteren
   Dateien übersetzen. Optionale Abschnitte (`parameters`, `proof`, `faq`, `crosslinks`,
   `disclaimer`) nur befüllen, wenn es echte Inhalte gibt — ein leerer Abschnitt wird nicht gerendert.
2. Verwandten Artikel ergänzen? In `src/data/services.tsx` die Artikel-ID in `relatedArticleIds`
   **und** in `src/data/articles.ts` die Service-ID in `relatedServiceIds` des Artikels eintragen
   (Gegenseitigkeit prüft `npm run check:internal-findability`).
3. Prüfen: `npm run check:i18n && npm run check:seo && npm run check:internal-findability`,
   dann `npm run test:component` (u. a. `ServiceDetailTemplate.test.tsx`).

Einen **neuen** Service anlegen ist Entwicklungsarbeit → `wartung.md` §3.

## 2. Artikel anlegen

**Contract:** `ARTICLES-CONTRACT.md` · Kanonische URL `/<lang>/articles/<slug>`; die interne ID ist nie
öffentlich, `/articles/<id>` wird automatisch per 301 auf den Slug geleitet.

1. **ID und Slug festlegen:** ID `snake_case` (z. B. `vitamin_d_dental`), Slug `kebab-case`.
2. **Stammdaten** in `src/data/articles.ts` → `articleInventory` ergänzen: `id`, `slug`,
   `status: 'DRAFT_OR_NON_PUBLIC'` (bis zur Freigabe; nur `PUBLISHED_LAUNCH` erscheint in Index,
   Suche und Sitemap), `category`, `author`, `datePublished: 'YYYY-MM-DD'` (wird `lastmod` der
   Sitemap), `readTime`, `sections` (erstes `image` = Titelbild, optional), `relatedServiceIds`
   (mindestens ein Service, gegenseitig in `src/data/services.tsx` → `relatedArticleIds`).
3. **Body** als `src/content/articles/<slug>.json` anlegen — ein Objekt je Sprache (`de` … `cs`) mit
   nicht leerem `sections`-Array. Abschnittstypen laut `src/content/articles/model.ts`: `text`
   (`heading`, `paragraphs`, `listItems`), `table` (`headers`, `rows`), `infobox` (`content`),
   `key_points` (`points[].title/description`); optional `keyStats`.
4. **Routenmodul** `src/pages/articles/<slug>.tsx` nach Vorbild `die-gruene-praxis.tsx`:
   `createArticleRoute('<id>', content)`. Es bricht, wenn eine Sprache fehlt.
5. **Einbindung** in `src/App.tsx` (G3-Datei, Entwicklung hinzuziehen): `lazy(() => import(…))` und
   Eintrag in `ARTICLE_ROUTE_ELEMENTS`.
6. **Meta und Teaser** in allen 10 `public/locales/<lang>/articles.json`: `<id>.title`,
   `<id>.excerpt` (= Meta-Description), `<id>.seo.title`.
7. **Suchtreffer** in allen 10 `public/locales/<lang>/common.json`:
   `search.index.article-<id>.title` und `.description`.
8. **Bild** (optional) siehe §8; Artikel ohne Bild sind ausdrücklich erlaubt.
9. Freigabe: `status: 'PUBLISHED_LAUNCH'`, dann `src/data/articles.test.ts` (Anzahl) anpassen.
10. Prüfen: `npm run check:routes && npm run check:search-index && npm run check:seo &&
npm run check:i18n && npm run check:internal-findability && npm test`.
11. Inventartabelle in `ARTICLES-CONTRACT.md` und Status in `CONTENT-MATRIX.md` nachtragen.

## 3. Event anlegen

**Contract:** `EVENTS-CONTRACT.md` · Seite `/<lang>/events` (keine Event-Detailseiten).

1. In `src/data/events.ts` → `eventRecords` einen Eintrag ergänzen:
   `id` (`snake_case`, zugleich i18n-Key), `date: 'YYYY-MM-DD'`, optional `endDate` (inklusiver
   letzter Tag), `dateSemantics: EVENT_DATE_SEMANTICS`, `location` (realer Ort), optional `partner`,
   optional `link` (nur echte `https://`-Seite). Keine Uhrzeit erfinden — es gibt nur ganztägige
   Termine (Zeitzone `Europe/Berlin`).
2. In allen 10 `public/locales/<lang>/events.json` → `items.<id>`: `title`, `tag`, `description`.
3. Optional als Highlight: `HIGHLIGHT_EVENT_ID` in `src/data/events.ts` (nur ein realer, kommender
   Termin; nach Ablauf bleibt das Highlight leer).
4. Vergangene Termine wandern automatisch in den Rückblick. `past_items` ist nur für historische
   Termine ohne Tagesdatum (`month` 0-basiert, `year`, `location`; Texte `title`, `detail`,
   `watermark`).
5. Prüfen: `npm run test:unit` (`src/data/events.test.ts` pinnt die ID-Liste — dort ergänzen; der
   Import-Guard `validateEventInventory` meldet falsches Datum, `endDate < date`, fehlenden Ort,
   ungültigen Link), `npm run check:i18n`.
6. Inventartabelle in `EVENTS-CONTRACT.md` nachtragen. Einen Termin entfernen, der eine eigene URL
   hatte? → Redirect-Entscheidung (`wartung.md` §9).

## 4. Download ergänzen

**Contract:** `RESOURCES-CONTRACT.md` · Wahrheit: `src/content/resources/resourceInventory.ts`.

1. Datei ablegen: frei abrufbar unter `public/downloads/…` (Epigenetik: `public/downloads/epigenetics/<de|en>/`);
   gegatet (nur gegen Formular) ausschließlich unter `storage/protected/…` — nie beides.
2. Inventareintrag ergänzen: neue ID `rsc-<domain>-<nnn>` (eindeutig, nie aus Pfad/Titel ableiten),
   `domain`, `category`, `deliveryClass` (`FREE_PUBLIC` | `GATED` | `NOT_LAUNCH_VISIBLE`),
   `lifecycle: 'ACTIVE_VISIBLE'`, `labelKeys`/`descriptionKeys`/`referenceKeys`, `visibleFrom`, und je
   Sprachdatei eine `variant` mit **gemessenen** Werten: `bytes` (`stat -c %s <datei>`), `sha256`
   (`sha256sum <datei>`), `pages`, `mime`, `date` (nur wenn in der Datei belegt, sonst `null` mit
   `dateEvidence: 'NONE'`), `languageEvidence`.
3. Titel/Beschreibung unter den genannten Keys in allen 10 Locale-Dateien. Liegt die Datei nur auf
   Deutsch vor, bleibt das so — die Karte legt die Sprache offen; keine Datei duplizieren.
4. Server-Ableitung neu erzeugen: `npm run build:resource-registry` (schreibt
   `server/resource-registry.json`).
5. Prüfen: `npm run test:guards:content` (Inventar gegen Dateisystem, Größen-/Seitenangaben im Text,
   Resource Center, Gate-Bypass, Lead-Magnet-Matrix). Sichtbar unter `/<lang>/downloads`.

## 5. Übersetzung ergänzen

**Contract:** `I18N-CONTRACT.md` (Guard G4, Verbote §9).

1. Den Key in **allen zehn** `public/locales/<lang>/<namespace>.json` an derselben Stelle anlegen.
   Struktur folgt der Schemareferenz des Namespaces (meist `de`, für `epigenetics` und `consumer` `en`).
2. Platzhalter wie `{{count}}` exakt übernehmen; in `epigenetics` und den Musterbefunden müssen
   Zahlen und URLs in jeder Sprache identisch sein („Zahlen-/URL-Abweichung“).
3. Echte Übersetzung: lange Texte, die wörtlich der EN- bzw. DE-Fassung entsprechen, werden ab einer
   Schwelle als Kopie gemeldet. Marken- und Eigennamen (`IglooPro`) dürfen gleich bleiben.
4. Keine Werte wie `TODO`, `TBD`, `Lorem ipsum`, keine Keys als Wert (`home.hero.title`).
5. Neuer Namespace (neue Datei)? Das ist AP08-Eigentum (`src/i18n.ts` `PRODUCTIVE_NAMESPACES`) →
   Entwicklung, `wartung.md` §2.
6. Prüfen: `npm run check:i18n` (bei Kopf-/Fußzeile zusätzlich `npm run check:shell-i18n`).

## 6. Musterbefund pflegen

**Contract:** `BEFUNDE-CONTRACT.md` · 6 Befunde × 10 Sprachen = 60 JSON-Dateien.

| Teil                                 | Datei                                                                                |
| ------------------------------------ | ------------------------------------------------------------------------------------ |
| Reihenfolge, Panelnamen, Radar-Werte | `src/content/befunde/meta.ts` (`BEFUND_ORDER`, `BEFUND_PANEL_NAMES`, `RADAR_VALUES`) |
| Inhalt je Sprache                    | `src/content/befunde/<slug>.<lang>.json` (`slug`, `panel`, `blocks`)                 |
| Meta/Suche                           | `public/locales/<lang>/epigenetics.json` → `befund.seo.<slug>.title/description`     |
| PDF (nur Deutsch)                    | `public/downloads/epigenetics/de/1x_Musterbefund_<Panel>_PolarisDX.pdf`              |
| Paket (gegatet)                      | `storage/protected/epigenetics/PolarisDX_Musterbefunde_DE.zip`                       |

1. JSON in allen zehn Sprachen gleich ändern. `slug` nie ändern; Blocktypen und Pflichtfelder laut
   `src/content/befunde/model.ts`. Werte, Skalen, Schwellen nicht neu schätzen — die Radar-Vektoren
   sind aus der freigegebenen Quelle rekonstruiert (§5 des Contracts).
2. PDF ersetzt? Dann auch das ZIP neu packen (Inhalt muss den Einzeldateien entsprechen) und im
   Inventar `bytes`/`sha256`/`pages` beider Dateien nachziehen, dann `npm run build:resource-registry`.
3. Prüfen: `npm run check:befunde` (läuft auch vor jedem `npm run build`), `npm run check:befunde-seo`,
   `npm run check:i18n`, `npm run test:guards:content`, `npm run check:claims`.

## 7. Meta-Daten pflegen

| Seite             | Title                                                                                          | Description                      |
| ----------------- | ---------------------------------------------------------------------------------------------- | -------------------------------- |
| Startseite        | `home:seo.title`                                                                               | `home:seo.description`           |
| Service           | `services:<key>.seo.title`                                                                     | `services:<key>.seo.description` |
| Artikel           | `articles:<id>.seo.title` (sonst `title`)                                                      | `articles:<id>.excerpt`          |
| Artikel-Übersicht | `articles:seo.index_title`                                                                     | `articles:seo.index_description` |
| Termine           | `events:seo_title`                                                                             | `events:seo_description`         |
| Downloads         | `downloads:seo.title`                                                                          | `downloads:seo.description`      |
| Musterbefund      | `epigenetics:befund.seo.<slug>.title`                                                          | `…description`                   |
| andere Seiten     | im Seitenmodul `src/pages/<Seite>.tsx` die Keys an `<SEOHead title=… description=…>` nachsehen |                                  |

Regeln (durchgesetzt von `scripts/check-meta-descriptions.mjs` und `SEOHead`):

- Title **ohne** `| PolarisDX` schreiben — der Suffix wird angehängt.
- Description 50–200 Zeichen (außerhalb Warnung; unter 20 oder über 500 Fehler).
- Keine Platzhalterwörter (`lorem ipsum`, `tbd`, `placeholder`, `preview copy`, `coming soon`),
  keine `preview.polarisdx.net`-/`localhost`-Adressen, keine sichtbaren Keys.
- Canonical, hreflang, `robots` und Sitemap **nie** von Hand setzen — sie folgen der Route Registry.
- Share-Bilder: `public/og-*.jpg`; die Standardkarte `public/og-image.jpg` erzeugt
  `node scripts/make-og-card.mjs` aus `scripts/og-image-template.html` und Texten aus `home.json`.
- Prüfen: `npm run check:seo && npm run check:i18n`.

## 8. Bilder optimieren

**Contracts:** `PERFORMANCE-CONTRACT.md` (Budgets), `DESIGN-SYSTEM-CONTRACT.md` §6.3, `work-packages/AP34.md`.

**Inhaltliche Regeln zuerst:**

- Nur echte Fotos und echte Produktrenders mit geklärter Lizenz (Startseite: Unsplash-Lizenz,
  vermerkt in `src/assets/home/homeImages.ts`). **Keine KI-generierten oder nachgebauten
  Produktbilder, keine erfundenen Wortmarken, keine Messwerte im Bild.** Belege, warum: der
  verformte IglooPro-Nachbau und die erfundene „DX“-Wortmarke wurden aus den Artikeln entfernt
  (`ARTICLES-CONTRACT.md`, 2026-10-16); die alte Share-Karte trug den erfundenen Wert „45.2 ng/mL“
  (`DESIGN-SYSTEM-CHANGELOG.md`).
- Kein Bild ist besser als ein falsches: Artikel und Erklärsektionen dürfen bildlos bleiben.
- Je Seitenbühne höchstens ein Foto; nur dieses trägt `fetchpriority="high"`, alles darunter lazy.

**Technik:**

| Bildart                    | Generator / Prüfung                                                                                                                                                                                      | Modul                            |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Artikel- und Produktbilder | Quelle in `ARTICLE_IMAGE_SOURCES` (`scripts/build-article-images.mjs`) eintragen, `npm run build:article-images`, Varianten in `src/assets/articleImages.ts` importieren, `npm run check:article-images` | `src/assets/articleImages.ts`    |
| Consumer-Seiten            | `npm run build:consumer-images`, `npm run check:consumer-images`                                                                                                                                         | `src/content/consumer/images.ts` |
| Startseite                 | Varianten liegen fertig in `src/assets/home/` (kein Generator im Repo; Breiten laut Kopfkommentar)                                                                                                       | `src/assets/home/homeImages.ts`  |

1. Original unkomprimiert nach `src/assets/` legen.
2. Breiten aus der Darstellung ableiten (CSS-Breite × DPR 1–3), nicht raten.
3. AVIF als erste Quelle, WebP als Rückfall (Artikel-Generator: AVIF q60, WebP q80); gerendert über `ResponsivePicture` mit
   festen `width`/`height`.
4. **Falle `assetsInlineLimit`:** Vite schreibt Dateien unter 4 KB als Base64 ins JavaScript. Kleine
   AVIF-Stufen zählen dann gegen das Initial-JS-Budget (gemessen +4,3 KB bzw. +11 KB gzip).
   `vite.config.ts` nimmt deshalb `src/assets/home/` und `src/assets/article-hero-*` aus. Liegt ein
   neues kleines Bild woanders, die Ausnahme dort erweitern — nach Messung.
5. Budget messen, nie lockern: `npm run perf:budget:build && npm run check:perf-budget`.
