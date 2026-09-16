# CONSUMER-CONTRACT

**Guard-Level: G2.** Wer die Consumer-Shell, eine der drei Landingpages, den Bestellpfad oder die
Consumer-Routen ändert, prüft mit `npx playwright test --config e2e/pt21.1.config.ts`.

**Stand:** AP21 PT21.1 (2026-09-08) · **Branch:** `console/19-25-2026-09-02T08-36-17` ·
**HEAD:** `e6a8b700dcf3191409401640f05c57c98925076e`

> ## Geltungsbereich
>
> Dieser Vertrag ist die **Ist-Wahrheit** der Consumer-Strecke. PT21.1 liefert das gemeinsame
> Gerüst; Produktinhalte (PT21.2–PT21.4), das SEO-Gate (PT21.6) und der Runtime-Gate (PT21.7) sind
> **nicht** Gegenstand dieses Stands und werden hier ausdrücklich nicht als fertig behauptet.

---

## 1. Route-Baseline

**CR-01 — 30 Routen.** Drei Produktfamilien × zehn Locales, alle live mit HTTP 200 gemessen.

| Familie             | Pfadmuster                            | Registry-ID                 |
| ------------------- | ------------------------------------- | --------------------------- |
| Vitamin D3+K2 Spray | `/{locale}/consumer/vitamin-d3-spray` | `consumer-vitamin-d3-spray` |
| Hydrating Masks     | `/{locale}/consumer/hydrating-masks`  | `consumer-hydrating-masks`  |
| Inside-Out Care Duo | `/{locale}/consumer/inside-out-duo`   | `consumer-inside-out-duo`   |

Locales exakt: `de, en, pl, fr, it, es, pt, da, nl, cs`. Registry:
`src/routing/routeRegistry.ts` — `routeType: 'CONSUMER_PRODUCT'`, `localeBehavior: x10`,
`indexability: 'INDEX_FOLLOW'`, `sitemap: consumer/0.8/weekly`, `searchEligible: false`,
`shell: 'CONSUMER'`.

**CR-02 — Keine EN-Zwangsredirects.** Jede der zehn gültigen Locales antwortet **direkt mit 200**,
ohne `Location`-Header. Ohne Präfix gilt genau ein 301 auf die Default-Sprache:
`/consumer/<slug>` → `/de/consumer/<slug>`. Gemessen für alle drei Slugs.

**CR-03 — `CONSUMER_HUB = NOT_REQUIRED`.** `/consumer` und `/de/consumer` antworten mit
**404**. `/consumer` steht als bewusster `INTENTIONAL_404_PATH` in
`src/routing/legacyRedirects.ts`. Es wurde kein Hub erfunden; eine Änderung braucht eine neue
kanonische IA-Decision.

---

## 2. Shell

**CS-01 — Eigene, schlanke Consumer-Chrome.** Die Consumer-Strecke läuft bewusst **nicht** in der
B2B-Shell (`MainLayout`), sondern in `ConsumerShell` (`src/pages/consumer/shell.tsx`).
`App.tsx` rendert die drei Routen außerhalb von `<MainLayout>`.

**CS-02 — Was PT21.1 hergestellt hat.** Vor dieser Aufgabe setzte jede der drei Seiten ihr Gerüst
selbst zusammen. Gemessen am gebauten SSR-Dokument fehlte dabei auf **allen 30 Routen**:

| Marker                            | vorher   | nachher                               |
| --------------------------------- | -------- | ------------------------------------- |
| `<main>`                          | **0/30** | 30/30 (genau eines)                   |
| Sprunglink `href="#main-content"` | **0/30** | 30/30, als erstes Element im Dokument |

`ConsumerShell` stellt beides genau einmal her und übernimmt zusätzlich den Footer, damit der
Legal-Zugang nicht mehr Sache jeder einzelnen Seite ist.

| Element                                  | Quelle                                                                                           | Status                                               |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| Layout                                   | `ConsumerShell` in `src/pages/consumer/shell.tsx`                                                | neu (PT21.1)                                         |
| `<main id="main-content" tabIndex={-1}>` | `ConsumerShell`                                                                                  | 30/30                                                |
| Sprunglink                               | `components/layout/SkipLink` (geteiltes Sprungziel, x10-Schlüssel `common:a11y.skip_to_content`) | 30/30, Fokus landet nachweislich auf `#main-content` |
| Header                                   | `ConsumerHeader` (gleiche Datei)                                                                 | vorhanden                                            |
| Footer / Legal                           | `components/layout/Footer` → `/{locale}/imprint`, `/privacy`, `/terms`                           | 30/30                                                |
| Consent                                  | `CookieBanner` **siteweit** in `App.tsx` (nicht doppelt in der Shell)                            | erscheint auf der Consumer-Strecke                   |
| Sprachumschalter                         | `components/ui/LanguageSwitcher` im Header                                                       | 10/10 Optionen, Slug bleibt erhalten                 |
| SSR-Head                                 | `SEOHead` je Seite, im **ersten** Response vor `<div id="root">`                                 | 30/30                                                |

**CS-03 — Sprachumschalter.** Er arbeitet mit Buttons und `changeLanguage`, nicht mit
`<a href>`; `buildLanguageSwitchUrl` erhält Pfad, Query und Hash und damit den Produkt-Slug.
Zugänglicher Name: `common:a11y.select_language` (x10). **Beobachtung für PT21.6:** weil die
zehn Ziele keine Links sind, sind sie für Crawler keine Signale — die hreflang-Angaben im Head
tragen diese Aufgabe.

**CS-04 — Ein Consent-Banner.** Bewusst **nicht** zusätzlich in der Shell gerendert; zwei Banner
wären schlechter als keiner.

---

## 3. Produktquellen

| Familie             | Seite                              | Umfang     | i18n-Aufrufe | Medien                                                   |
| ------------------- | ---------------------------------- | ---------- | ------------ | -------------------------------------------------------- |
| Vitamin D3+K2 Spray | `src/pages/consumer/SprayPage.tsx` | 425 Zeilen | 113          | `spray-hero-12pack-office.jpeg`, `spray-still-life.jpeg` |
| Hydrating Masks     | `src/pages/consumer/MaskPage.tsx`  | 396 Zeilen | 101          | `mask-hero-botanical.jpeg`                               |
| Inside-Out Care Duo | `src/pages/consumer/DuoPage.tsx`   | 275 Zeilen | 62           | `duo-hero-products-together.jpeg`                        |

Copy-Quelle: `public/locales/<locale>/consumer.json` — **345 Schlüssel in allen zehn Locales**,
identische Zahl, also gleiche Struktur. Ob es sich um echte Übersetzungen oder um kopierte
Fallbacks handelt, ist **nicht** Gegenstand von PT21.1 und ausdrücklich in PT21.2–PT21.4 zu prüfen.

Safety-/FAQ-Inhalte liegen in denselben Locale-Dateien und werden über die `FAQ`- und
`Disclaimer`-Primitive der Shell gerendert. Schema: `createProductSchema`,
`createBreadcrumbSchema`, `createFAQSchema` — **ohne** Preis-, Offer-, Availability-, Rating-,
GTIN- oder SKU-Angaben.

---

## 4. Bestellpfad — Ist-Zustand

**CO-01 — Der Bestellpfad läuft NICHT auf der Shared Lead Foundation.** Das ist der wichtigste
Befund dieser Discovery und der Kern von PT21.4/PT21.5.

| Aspekt            | Ist-Zustand                                                                                   | Bewertung                          |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| UI                | `OrderModal.tsx` + `OrderForm.tsx` (Name, E-Mail, Telefon, Firma, Adresse, Menge, Nachricht)  | vorhanden                          |
| Client-API        | `src/api/consumerOrder.ts` → `POST /api/consumer-order`                                       | vorhanden                          |
| Endpunkt          | `server/server.js:325`                                                                        | **Legacy-Mailendpunkt**            |
| Persistenz        | **keine** — 0 Aufrufe von `LeadRepository`/`createLead` im Endpunkt                           | **fehlt**                          |
| CRM/Outbox        | **keine** — Zustellung ausschließlich per `sgMail.send`                                       | **fehlt**                          |
| Retry             | **keiner**                                                                                    | **fehlt**                          |
| Idempotency       | **keine** — kein `Idempotency-Key`, kein Unique-Constraint                                    | **fehlt**                          |
| Rate Limit        | **keiner** — der Endpunkt ist ohne `formLimiter` montiert                                     | **fehlt**                          |
| Honeypot          | vorhanden (`_hp`, stilles 200)                                                                | vorhanden                          |
| Consent           | `consent !== true` → 400; **keine** Trennung von Processing und Marketing                     | **unvollständig**                  |
| Produkt-Allowlist | serverseitig über `CONSUMER_PRODUCT_LABELS`                                                   | vorhanden                          |
| Mengen-Allowlist  | **keine** — `quantity`/`quantityLabel` kommen ungeprüft aus dem Client und landen in der Mail | **fehlt**                          |
| Tracking          | `src/pages/consumer/tracking.ts` schreibt direkt in `window.dataLayer`                        | **nicht consent-gebunden geprüft** |

**CO-02 — Die Journey existiert bereits in der Foundation.** `consumer_order` steht in
`server/lead-foundation/constants.js` (`LEAD_JOURNEYS`) und hat in
`server/lead-foundation/crm.js` das CRM-Ziel `consumer`. Der Endpunkt benutzt beides nicht.
PT21.4/PT21.5 konsumieren die vorhandene Foundation — **keine zweite Plattform bauen**, AP22 bleibt
Owner der Cross-Journey-Vereinheitlichung.

---

## 5. SEO-Baseline

| Aspekt        | Ist-Zustand                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registry      | 3 Familien × x10, `INDEX_FOLLOW`, `shell: 'CONSUMER'`                                                                                                                                             |
| Canonical     | 30/30 korrekt: `https://polarisdx.net/{locale}/consumer/{slug}`                                                                                                                                   |
| hreflang      | 30/30 mit 10 Sprachen + `x-default`                                                                                                                                                               |
| x-default     | 30/30 auf `de`                                                                                                                                                                                    |
| Sitemap       | über `sitemap.ts`, `kind: 'consumer'`, Priorität 0.8, weekly                                                                                                                                      |
| Suche         | `searchEligible: false` — die Consumer-Strecke ist bewusst nicht im internen Suchindex                                                                                                            |
| Schema        | Product + Breadcrumb + FAQ, ohne Preis/Offer/Rating/GTIN                                                                                                                                          |
| Social        | `ogType="product"`, produkteigenes `ogImage` mit Maßen und Alt-Text                                                                                                                               |
| Interne Links | **keine produktiven Verweise** aus dem übrigen Web-Auftritt auf die drei Seiten (nur Tests referenzieren die Pfade). Hauptmenü-Aufnahme ist laut AP21-Regeln **kein** DoD; Findability ist PT21.6 |

---

## 6. In PT21.1 gefundene, bewusst NICHT behobene Defekte

Beide liegen im **Produktinhalt** und damit außerhalb dieser Aufgabe. Sie sind mit Messwert und
Ort dokumentiert, damit der zuständige PT sie nicht neu suchen muss.

| ID      | Befund                                                           | Messung                                                                                                                                                                                                                | Owner           |
| ------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `CD-01` | Horizontaler Überlauf bei 390px auf `/consumer/vitamin-d3-spray` | 26px; Verursacher: Hero-Dekoration in `section#top` und eine Spezifikationstabelle (`div.flex.gap-6.px-8.py-5`) in `section.py-24`. **Unabhängig vom `<main>`-Layout** — mit `display:block` am `<main>` derselbe Wert | PT21.2 / PT21.7 |
| `CD-02` | Kontrast unter 4,5:1 im Dosierungshinweis                        | `<p class="mt-8 text-center text-sm text-gray-500">`, 3,22:1 (`#868c98` auf `#f8fafc`) bei 14px                                                                                                                        | PT21.2          |

**In der Shell behoben (PT21.1-Scope):** vier `text-gray-500`-Stellen in `shell.tsx`
(Hero-Preiseinheit 3,37:1, Floating-Stat, `Stats`-Label, `Disclaimer` 3,08:1) auf
`text-gray-600`; sowie ein **Header-Überlauf von 15px bei genau 768px** — dort schalten
Navigation und Desktop-CTA gleichzeitig zu, während der Burger verschwindet. Behoben über
`min-w-0` und `gap-5 lg:gap-8` an der Navigation plus `shrink-0` an der rechten Gruppe;
nachgemessen bei 390/640/768/900/1024/1440 → Überlauf 0.

---

## 7. Nachweise PT21.1

`npx playwright test --config e2e/pt21.1.config.ts` → **8/8** gegen einen isolierten Client-/
SSR-Build (kein voller Produktionsbuild; `dist/` unberührt):

30 Routen mit genau einem `<main>` und dem Sprunglink als erstem Element · SSR-Head im ersten
Response mit Canonical, 10× hreflang und `x-default` = de · keine EN-Zwangsredirects und
`/consumer` weiterhin 404 · Sprachumschalter 10/10 mit erhaltenem Produkt-Slug · Sprunglink setzt
den Fokus nachweislich auf `#main-content` · Consent-Banner und Legal-Zugang auf der
Consumer-Strecke mit 0 Provider-Requests vor der Einwilligung · Axe serious/critical 0 im
Shell-Scope auf allen drei Seiten und mit fokussiertem Sprunglink · Shell ohne Überlauf bei
390/768/1440 in de/pl/cs.

Ohne Regression: `check:routes` · `check:i18n` · `check:seo` · `check:colors` ·
`check:search-index` · `typecheck` · ESLint und Prettier auf den geänderten Dateien ·
Unit/Node 257/257 · direkte Abhängigkeitssuiten (`seo-head`, `pt08-4-routing`, `url-smoke`,
`consumer-shell`) **102/102**.

**Ein Testdefekt behoben:** `switchLanguage` in `e2e/pt08-4-routing.spec.ts` klickte den
Umschalter vor der Hydration; unter Last lief der Folgeklick zweimal in den Timeout, in
Einzelläufen nie. Jetzt zustandsabhängig und idempotent — Produktcode unverändert.

---

## 8. Handoff PT21.2 — Vitamin-Produktinhalt

**Primary Write Set:** `src/pages/consumer/SprayPage.tsx` ·
`public/locales/<10>/consumer.json` (Namensraum `spray.*`) ·
ggf. `src/pages/consumer/shell.tsx` **nur** für Darstellungsprimitive · PT21.2-eigene Tests.

**Direkt zu konsumieren, nicht neu erheben:** Route-Baseline (§1) · Shell inklusive `<main>`,
Sprunglink, Consent, Legal, Sprachumschalter und SSR-Head (§2) · Produktquellenkarte (§3) ·
SEO-Baseline (§5).

**Offenes PT21.2-Delta:** echte x10-Fassung von Body, Safety und FAQ statt kopierter Fallbacks
prüfen und herstellen · `CD-01` (26px Überlauf bei 390px) · `CD-02` (Kontrast im
Dosierungshinweis) · keine erfundenen Preise, Offers, Availability, Reviews, Ratings, GTIN/SKU
oder Medical Claims.

**Drift-Signale, bei denen neu zu messen ist:** Änderungen an `routeRegistry.ts`,
`legacyRedirects.ts`, `App.tsx`, `LanguageSwitcher`, `CookieBanner` oder `Footer`.

---

## 9. Delta PT21.2 — Vitamin D3+K2 Spray ×10 (2026-09-08)

**HEAD:** `f569989a715aea6289d11e140706410a32b2b093` · Branch `console/19-25-2026-09-02T08-36-17`

### 9.1 Ausgangsmessung

`spray.*` umfasst **109 Schlüssel in allen zehn Locales**, identische Struktur, und **0 Strings
identisch mit der deutschen Fassung**. In den Locale-Dateien gab es also **keinen** kopierten
Fallback. Die Lücke lag woanders — im Code.

### 9.2 Was gefunden und behoben wurde

| ID      | Befund                                                                                                                                                                                                                                                                             | Behebung                                                                                                         |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `SP-01` | `'1000 IU Vitamin D3 + 25 µg Vitamin K2'` stand als Literal im JSX und wurde damit in **allen zehn Locales englisch** ausgeliefert — obwohl die freigegebene Copy die Einheit lokalisiert (`copy_061`: IE, UI, j.m, IU)                                                            | Wert in i18n überführt: `spray.facts.dosage_value` × 10, Einheit je Locale aus der freigegebenen Copy abgeleitet |
| `SP-02` | Dieselbe feste Einheit in der Kennzahlenreihe (`'1000 IU'`), dazu `'12'`, `'71'`, `'25 µg'` als Literale                                                                                                                                                                           | `spray.stats.*` × 10; die Reihe kommt jetzt aus dem Produktmodell                                                |
| `SP-03` | **Listenpreis 169 € im JSX ohne jeden Beleg** — die Zahl kommt in keiner der zehn Locale-Dateien vor, und `PriceBadge` hält für diese Strecke ausdrücklich fest: _"No list price is rendered in the DOM"_; die CONFIRM-Flags dort fragen den finalen 12er-Pack-Listenpreis noch ab | Entfernt. `SPRAY_PRODUCT.listPrice = null` — kein Platzhalter, keine Schätzung                                   |
| `SP-04` | `Product.name` im Schema war `copy_050` = die H1-Marketingzeile ("Tägliche Unterstützung mit Vitamin D3+K2 leicht gemacht."), nicht der Produktname                                                                                                                                | Schema und Breadcrumb nennen jetzt `copy_049` = "Vitamin D3+K2-Spray"                                            |
| `CD-01` | 26px horizontaler Überlauf bei 390px (aus PT21.1 übergeben)                                                                                                                                                                                                                        | Spezifikationstabelle stapelt unter `sm`, schmaleres Padding; gemessen 0 bei 390/768/1440 in de/pl/cs            |
| `CD-02` | Kontrast 3,22:1 im Dosierungshinweis (aus PT21.1 übergeben)                                                                                                                                                                                                                        | `text-gray-600`; Axe serious/critical 0 auf der **ganzen** Seite                                                 |

### 9.3 Gemeinsames Produktmodell

Neu: `src/content/consumer/products.ts` — erste Produktmigration, ausdrücklich für PT21.3/PT21.4
wiederverwendbar. Es trennt drei Dinge, die vorher im JSX vermischt waren:

- **Identität:** `slug: 'vitamin-d3-spray'` (Route) und `orderId: 'spray'` (Bestellpfad).
- **Medien:** `width`/`height` **aus der Datei gemessen** (1122×1402), nicht geschätzt; der
  Inhaltstest liest die Maße zur Laufzeit aus dem JPEG.
- **Fakten:** ausschließlich i18n-Schlüssel, weil Zahlen lokalisierte Einheiten tragen.

**Provenienz je Zahl** wird ausgewiesen — `APPROVED_LOCALE_COPY` oder
`CODE_ONLY_UNVERIFIED`. Zwei Werte sind ehrlich als ungedeckt markiert:

| Wert                                         | Status                 | Bemerkung                                                                                                               |
| -------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| 1000 IE/IU/UI/j.m                            | `APPROVED_LOCALE_COPY` | durch `spray.copy_061` in allen zehn Locales gedeckt                                                                    |
| 25 µg K2 (`spray.stats.k2_value`)            | `CODE_ONLY_UNVERIFIED` | stand nur im Quelltext; **weiter sichtbar**, weil bestehender Bestand und keine Erfindung von PT21.2 — aber owner-bound |
| Dosierungszeile (`spray.facts.dosage_value`) | `CODE_ONLY_UNVERIFIED` | enthält den K2-Wert und erbt dessen Status                                                                              |

**Preis, Angebot, Verfügbarkeit, Lieferzeit, Bewertung, GTIN/SKU und Zertifikat stehen bewusst
nicht im Modell.** `createProductSchema` gibt konstruktionsbedingt keine `offers`,
`aggregateRating`, `review`, `gtin` oder `sku` aus.

### 9.4 Claim-Sicherheit

Alle 109 Schlüssel × 10 Locales wurden gegen Muster für Heilaussagen, Vorbeugung, Krankheit,
Immunwirkung, Garantie, Preis/Angebot, Bewertung, Verfügbarkeit und Zertifikat geprüft:
**0 echte Treffer**. Drei Regex-Treffer waren Fehlalarme (italienisch "centri benessere",
französisch "sauf avis contraire") und keine Aussagen im Sinne der Regel.

### 9.5 Bestellkontext

Der Client sendet `product: 'spray'` — eine **stabile, serverseitig in
`CONSUMER_PRODUCT_LABELS` allowlistete Kennung**, kein freier Produktname. Der Browsertest
fängt den echten Request ab und prüft die Nutzlast.

**Bekannte Abweichung, bewusst nicht angefasst:** die Bestell-ID (`spray`) unterscheidet sich vom
Route-Slug (`vitamin-d3-spray`). Ein Angleich würde die Server-Allowlist ändern und gehört damit
zum Bestell-Backend — **PT21.4/PT21.5**, hier ausdrücklich out of scope.

### 9.6 Nachweise

`npx vitest run src/content/consumer/products.test.ts` → **8/8**: Schlüsselvollständigkeit ×10 ·
identische Struktur ×10 · kein DE-Fallback · lokalisierte Dosierungseinheit gegen die freigegebene
Copy · kein Preis/Angebot/Verfügbarkeit/Bewertung · stabile Identität und allowlistete Bestell-ID ·
Medienmaße aus dem JPEG gelesen · ungedeckte Zahlen als solche ausgewiesen.

`npx playwright test --config e2e/pt21.2.config.ts` → **8/8** gegen einen isolierten Client-/
SSR-Build: Schema nennt den Produktnamen und kein erfundenes Angebot (×10) · kein Listenpreis im
Dokument (×10) · Einheiten lokalisiert (×10) · sichtbarer Inhalt ×10 mit einer H1, Dosierungshinweis,
Disclaimer und acht FAQ-Einträgen · Bestellkontext mit abgefangenem Request · CD-01 behoben ·
CD-02 und Axe serious/critical 0 · Hero eager, Galerie lazy, Alternativtexte gesetzt.

Ohne Regression: PT21.1-Shell-Suite 8/8 · direkte Abhängigkeitssuiten 102/102 · Unit/Node 265/265 ·
`check:routes` · `check:i18n` · `check:seo` (G3: Consumer 3×10) · `check:colors` ·
`check:search-index` · `check:internal-findability` · `typecheck` · ESLint · Prettier.
**Kein voller Produktionsbuild.**

**Ein Guard nachgezogen:** `scripts/check-seo.ts` prüfte die OG-Maße als Literal
`ogImageWidth={1122}`. Die Spray-Seite bezieht sie jetzt aus dem Modell; der Marker ist deshalb
pro Seite überschreibbar. Die Aussage bleibt dieselbe und ist zusätzlich durch die Messung am
JPEG gedeckt. Masks und Duo behalten unverändert die Literalprüfung. Kontrolliert: alle drei
Hero-Bilder sind tatsächlich 1122×1402.

### 9.7 Offene, ownergebundene Punkte

| ID      | Sachverhalt                                                                                                                                                                                | Owner                 |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| `SP-05` | Listenpreis fehlt jetzt sichtbar. Sobald Marketing den finalen 12er-Pack-Preis freigibt, kommt er als `listPrice` ins Produktmodell — nicht zurück ins JSX                                 | Marketing / PT21.7    |
| `SP-06` | 25 µg Vitamin K2 ist durch keine freigegebene Copy gedeckt (`CODE_ONLY_UNVERIFIED`)                                                                                                        | Marketing / Produkt   |
| `SP-07` | Die CONFIRM-Flags in `PriceBadge.tsx` ("< €1" gegen den finalen Listenpreis) sind weiterhin offen                                                                                          | Marketing             |
| `SP-08` | `contact@polarisdx.net` ist in vier Seiten dupliziert, ohne zentrale Konstante — Konfiguration, kein Produktinhalt                                                                         | AP-übergreifend       |
| `SP-09` | Die Schlüsselnamen `spray.copy_0xx` sind bedeutungsfrei. Eine Umbenennung über 109 Schlüssel × 10 Locales ist ein eigenes Vorhaben mit Übersetzungsrisiko und war nicht Teil der Akzeptanz | PT21.6 / eigener Task |

### 9.8 Handoff PT21.3 — Hydrating Masks

**Primary Write Set:** `src/pages/consumer/MaskPage.tsx` ·
`public/locales/<10>/consumer.json` (Namensraum `mask.*`, 88 Schlüssel) ·
`src/content/consumer/products.ts` (`MASKS_PRODUCT` ergänzen) · PT21.3-eigene Tests.

**Direkt zu konsumieren, nicht neu erheben:** Route-Baseline (§1) · Shell (§2) · SEO-Baseline (§5) ·
das Produktmodell und sein Provenienzschema (§9.3) · das Testmuster aus
`products.test.ts` und `consumer-spray.spec.ts`.

**Offenes Masks-Delta, das nach dem Spray-Muster zu prüfen ist:** Literale im JSX von
`MaskPage.tsx` (Zahlen, Einheiten, Preise) · `Product.name` gegen die H1-Headline · Media-Maße
gegen die Datei · Claim-Scan über `mask.*` × 10 · Überlauf und Kontrast messen, nicht annehmen.
`PriceBadge` trägt für Masks **bewusst keine €-Angabe** — das ist so dokumentiert und beizubehalten.

**Drift-Signale:** Änderungen an `shell.tsx`, `products.ts`, `check-seo.ts` oder
`CONSUMER_PRODUCT_LABELS`.

---

## 10. Delta PT21.3 — Hydrating Masks ×10 (2026-09-08)

**HEAD:** `4785baf18402f0882f5bbf2f571739b8400fd557` · Branch `console/19-25-2026-09-02T08-36-17`

### 10.1 Ausgangsmessung

`mask.*` umfasst **89 Schlüssel in allen zehn Locales**, identische Struktur. Genau **ein** String
ist identisch mit der deutschen Fassung: `mask.copy_055` = "Reinigen" — im Niederländischen
dasselbe Wort wie im Deutschen. Die übrigen 88 nl-Strings unterscheiden sich, es ist also ein
echtes Kognat und **kein Fallback**. Die Lücke lag wie beim Spray im Code.

### 10.2 Was gefunden und behoben wurde

| ID      | Befund                                                                                                                                                                                                                                     | Behebung                                                                               |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| `MK-01` | **Listenpreis 45 € im JSX ohne jeden Beleg** — die Zahl kommt in keiner der zehn Locale-Dateien vor. `PriceBadge` trägt für die Masken laut Kopfkommentar **bewusst gar keine €-Angabe**; ein Hero-Preis widersprach dieser Haltung direkt | entfernt, `MASKS_PRODUCT.listPrice = null`                                             |
| `MK-02` | `Product.name` im Schema war `copy_035` = die H1-Marketingzeile ("Intensive Feuchtigkeitsversorgung für die Haut, die Komfort und Pflege benötigt"), nicht der Produktname                                                                 | Schema und Breadcrumb nennen jetzt `copy_034` = "Feuchtigkeitsspendende Hyaluronmaske" |
| `MK-03` | `'5'`, `'15 ml'` und `'15–30'` standen als Literale im JSX. Die **Zahlenspanne** wird in der freigegebenen Copy nicht überall gleich geschrieben — it, da und nl nutzen einen Bindestrich, de/en/pl/pt/cs einen Halbgeviertstrich          | `mask.stats.*` × 10, Trennzeichen je Locale aus der Copy gemessen                      |
| `MK-04` | Kontrast 3,22:1 im Anwendungshinweis (`text-gray-500` auf `slate-50`) — derselbe Befund wie CD-02 auf der Spray-Seite                                                                                                                      | `text-gray-600`; Axe serious/critical 0 auf der ganzen Seite                           |
| `MK-05` | OG-Maße als Literale `1122`/`1402`                                                                                                                                                                                                         | aus dem Produktmodell, gegen die Datei gemessen                                        |

**Gemessen, nicht angenommen** (der Handoff verlangte das ausdrücklich): horizontaler Überlauf bei
390/768/1440 in de/pl/cs = **0**, ohne dass etwas zu ändern war — anders als bei der Spray-Seite,
wo eine Spezifikationstabelle 26px überlief. Die Masken-Seite führt keine solche Tabelle.

### 10.3 Produktmodell erweitert

`MASKS_PRODUCT` in `src/content/consumer/products.ts` nach dem in PT21.2 bewiesenen Muster.
Ein Unterschied ist ausgewiesen statt kaschiert: `specs: []`, weil die Masken-Seite keine
Spezifikationstabelle führt — eine leere Liste ist hier die Wahrheit, kein Platzhalter.

**Provenienz:** **alle** Masken-Zahlen sind `APPROVED_LOCALE_COPY` — 5 aus `copy_038`
(5er-Pack), 15 ml aus `copy_032`/`serum_mask`, 15–30 aus `copy_036`. Anders als beim Spray
(25 µg K2) gibt es hier **nichts owner-bound zu melden**; ein Test hält das ausdrücklich fest.

### 10.4 Claim-Sicherheit — kosmetisch bleibt kosmetisch

Alle 89 Schlüssel × 10 wurden gegen medizinische Wirkung, Krankheit/Diagnose, Vorbeugung,
klinische Prüfung, Preis/Angebot, Bewertung, Verfügbarkeit, GTIN/SKU/Zertifikat und Garantie
geprüft.

**Alle medizinischen Begriffe stehen ausschließlich in den beiden Pflichthinweisen
`mask.copy_028` und `mask.copy_088` — und dort verneinen sie ihre eigene Anwendung**
("nicht zur Diagnose, Behandlung oder Vorbeugung von Hautkrankheiten"). Das ist die korrekte
kosmetische Absicherung, das Gegenteil eines Heilversprechens. Der Test prüft beides: außerhalb
dieser zwei Schlüssel darf kein medizinischer Begriff stehen, und die zwei Hinweise müssen in
allen zehn Locales vorhanden sein.

**Sprachbewusste Prüfung:** ein gemeinsames Regex-Muster erzeugte zwei Fehlalarme — italienisch
"cure" ist der Plural von "cura" (**Pflege**) und steht in "bisognosa di cure visibili" für
sichtbare Pflege, nicht für das englische Verb "to cure". Das Muster ist deshalb je Sprache
definiert. Ebenso war "sku" ein Treffer innerhalb des polnischen "skupiająca".

### 10.5 Bestellkontext

Der Client sendet `product: 'masks'` — stabil und serverseitig in `CONSUMER_PRODUCT_LABELS`
allowlistet, kein freier Produktname. Der Browsertest fängt den echten Request ab. Die bekannte
Abweichung zwischen Bestell-ID (`masks`) und Route-Slug (`hydrating-masks`) bleibt wie beim
Spray **PT21.4/PT21.5** und wurde hier nicht angefasst.

### 10.6 Nachweise

`npx vitest run src/content/consumer/products.test.ts` → **17/17** (8 Spray + 9 Masks):
Schlüsselvollständigkeit ×10 · identische Struktur · kein DE-Fallback (mit dokumentiertem
nl-Kognat) · Zahlenspanne in der Schreibweise der jeweiligen Locale, Zahlen gegen die freigegebene
Copy belegt · kein Preis/Angebot/Verfügbarkeit/Bewertung · **kosmetisch bleibt kosmetisch** ·
stabile Identität und allowlistete Bestell-ID · Medienmaße aus dem JPEG gelesen · keine ungedeckte
Produktzahl.

`npx playwright test --config e2e/pt21.3.config.ts` → **8/8**, zweimal hintereinander stabil:
Schema mit Produktnamen und ohne erfundenes Angebot ×10 · kein Listenpreis und **kein €-Zeichen**
im Dokument ×10 · Zahlenspanne je Locale in der Kennzahlkachel · sichtbarer Inhalt ×10 mit einer
H1, Sicherheitsantwort, Pflichtdisclaimer und FAQ · Bestellkontext mit abgefangenem Request ·
Überlauf 0 · Axe serious/critical 0 · Hero eager, Galerie lazy, Alternativtexte gesetzt.

Ohne Regression: PT21.2-Spray-Suite 8/8 · PT21.1-Shell-Suite 8/8 · Unit/Node **274/274** ·
`check:routes` · `check:i18n` · `check:seo` (G3: Consumer 3×10) · `check:colors` ·
`check:search-index` · `typecheck` · ESLint · Prettier. **Kein voller Produktionsbuild.**

**Ein Testdefekt behoben:** der Sprunglink-Test aus PT21.1 drückte Tab und Enter, bevor die Seite
hydriert war; unter Last verlor er den Fokuswechsel, in Einzelläufen nie. Der Fokus wird jetzt vor
jedem Versuch zurückgesetzt, die Schleife ist damit idempotent. Produktcode unverändert.

### 10.7 Offene, ownergebundene Punkte

| ID      | Sachverhalt                                                                                                                                                           | Owner              |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `MK-06` | Listenpreis fehlt jetzt sichtbar. Sobald Marketing den 5er-Pack-Preis freigibt, kommt er als `listPrice` ins Produktmodell                                            | Marketing / PT21.7 |
| `MK-07` | Die Marken-Angabe im Schema ist `De Legende Kosmetik`, nicht PolarisDX — real und belegt durch `copy_037`, aber die Markenführung der Consumer-Strecke gehört geprüft | Marketing / PT21.6 |

### 10.8 Handoff PT21.4 — Inside-Out Care Duo

**Primary Write Set:** `src/pages/consumer/DuoPage.tsx` ·
`public/locales/<10>/consumer.json` (Namensraum `duo.*`, 61 Schlüssel) ·
`src/content/consumer/products.ts` (`DUO_PRODUCT` ergänzen) · `scripts/check-seo.ts`
(Marker der Duo-Seite) · PT21.4-eigene Tests.

**Direkt zu konsumieren, nicht neu erheben:** Route-Baseline (§1) · Shell (§2) · SEO-Baseline (§5) ·
Produktmodell samt Provenienzschema (§9.3) · das zweifach bewiesene Testmuster aus
`products.test.ts` und `consumer-spray.spec.ts`/`consumer-masks.spec.ts`.

**Erwartetes Duo-Delta nach dem gleichen Muster — jeweils zu MESSEN, nicht anzunehmen:**
Literale im JSX von `DuoPage.tsx` (die Duo-Seite rendert laut PT21.1-Discovery ebenfalls eine
`price`-Angabe) · `Product.name` gegen die H1-Headline (bei Spray und Masks war es beidemal die
Marketingzeile) · Media-Maße gegen die Datei · Claim-Scan über `duo.*` × 10 **mit
sprachbewusstem Muster** · Überlauf und Kontrast messen. `PriceBadge` führt für das Duo eine
`< €2`-Positionierung mit offenem CONFIRM-Flag — beibehalten, nicht in einen Listenpreis
umdeuten.

**Besonderheit:** das Duo bündelt Spray und Masken. Aussagen über Packungsinhalt müssen mit den
in PT21.2/PT21.3 belegten Zahlen zusammenpassen (12er-Pack Spray, 5er-Pack Masken); ein
Widerspruch wäre ein Wahrheitsfehler, kein Formulierungsproblem.

**Drift-Signale:** Änderungen an `shell.tsx`, `products.ts`, `check-seo.ts` oder
`CONSUMER_PRODUCT_LABELS`.

---

## 11. Delta PT21.4 — Inside-Out Care Duo ×10 (2026-09-08)

**HEAD:** `ebf4380146d6cd3b57c4a62a466004e71ff7c5be` · Branch `console/19-25-2026-09-02T08-36-17`

### 11.1 Ausgangsmessung

`duo.*` umfasst **61 Schlüssel in allen zehn Locales**, identische Struktur. Sechs Strings sind in
einzelnen Sprachen mit dem Deutschen identisch — jeder einzeln geprüft und begründet:

| Schlüssel                            | Locales    | Grund                                                         |
| ------------------------------------ | ---------- | ------------------------------------------------------------- |
| `copy_002` "Routine"                 | en, fr, it | dasselbe Wort in allen vier Sprachen                          |
| `copy_017` "Shop Duo"                | en, da     | "Shop" ist im Deutschen und Dänischen gebräuchliches Lehnwort |
| `copy_028` "1 × Vitamin D3+K2 Spray" | en, da     | Ziffer plus Produktname                                       |

Kein Fallback. Die Lücke lag wie bei Spray und Masken im Code.

### 11.2 Was gefunden und behoben wurde

| ID      | Befund                                                                                                                                                                                 | Behebung                                                                          |
| ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `DU-01` | `Product.name` war `copy_019` = die H1-Marketingzeile ("Unterstützung von innen. Feuchtigkeitsspendende Pflege von außen.") — **zum dritten Mal dasselbe Muster** nach Spray und Masks | Schema und Breadcrumb nennen `copy_018` = "Inside-Out-Pflege-Duo"                 |
| `DU-02` | `formatCurrency(49.9)` und `formatCurrency(2)` standen als Literale im JSX                                                                                                             | beide aus dem Produktmodell, jeweils mit Beleg bzw. ausdrücklicher Nicht-Belegung |
| `DU-03` | `'1 + 5'` als Literal in der Kennzahl                                                                                                                                                  | `duo.stats.bundle_value` × 10                                                     |
| `DU-04` | OG-Maße als Literale `1122`/`1402`                                                                                                                                                     | aus dem Modell, gegen die Datei gemessen (duo-hero: 1122×1402)                    |

**Gemessen, nicht angenommen:** horizontaler Überlauf bei 390/768/1440 in de/pl/cs = **0** und Axe
serious/critical = **0** — beides war bereits in Ordnung und musste nicht geändert werden.

### 11.3 Der erste belegte Preis der Consumer-Strecke

Anders als bei Spray (169 €) und Masks (45 €), wo der Preis **nur** im Quelltext stand und deshalb
entfernt wurde, ist der Duo-Paketpreis **echt belegt**: **49,90 € stehen in `duo.copy_016` in
allen zehn Locales** — derselbe Text dient als SEO-Beschreibung.

Das Produktmodell wurde deshalb erweitert: `listPrice` war bis PT21.3 schlicht der Typ `null`,
weil es keinen belegten Preis gab. Jetzt trägt jeder Preis seinen Nachweis mit sich
(`ConsumerPrice` mit `evidence` und `evidenceKey`). Der Test prüft, dass der Betrag aus dem
Modell **tatsächlich in der freigegebenen Copy jeder Locale vorkommt**.

**Ehrlich als ungedeckt geführt — `DUO_MONTHLY_ADD_ON` (2 €/Monat):** dieser Betrag füllt
`duo.bundle_lead` ("… für nur {{price}} pro Monat") und stammt **ausschließlich aus dem
Quelltext**. Zwei Stellen im Repository flaggen ihn selbst als offen: der CONFIRM-Kommentar in
`PriceBadge.tsx\* ("final figure for the Duo add-on per month?") und ein
`{/_ CONFIRM: €2/month … _/}`direkt über dem Abschnitt in`DuoPage.tsx`.

Er wird **weiter angezeigt** — er ist bestehender Bestand und keine Erfindung dieses Tasks —, ist
aber im Modell als `CODE_ONLY_UNVERIFIED` markiert und owner-bound. Ein Test hält beides fest:
die Markierung und dass das CONFIRM-Flag noch offen steht.

**Kein `offers` im Schema.** Auch der belegte Preis wandert nicht in `Product.offers`, solange
Verfügbarkeit und Konditionen nicht belegt sind — ein `offers`-Block ohne `availability` wäre
eine Aussage, die niemand deckt.

### 11.4 Bundle-Wahrheit

Das Duo enthält **1 Spray-Flasche** (nicht den 12er-Pack) **+ 1 Box mit 5 Masken**. Diese Aussage
ist an drei unabhängigen Stellen deckungsgleich:

- freigegebene Copy: `copy_004`, `copy_025`, `copy_058`
- Server-Allowlist: `CONSUMER_PRODUCT_LABELS.duo = 'Inside-Out Care Duo (1 spray + 5 masks)'`
- Produktmodell: `components: [{ of: 'spray', quantity: 1 }, { of: 'masks', quantity: 5 }]`

Das Modell wurde dafür um `ConsumerBundleComponent` erweitert (erlaubter Delta: "small shared
product model delta if bundle semantics require it"). Jeder Bestandteil verweist auf die
**Produktkennung**, aus der er stammt — damit eine Aussage über den Packungsinhalt nicht der
Wahrheit des Einzelprodukts widersprechen kann. Der Test prüft zusätzlich, dass die sichtbare
Zusammensetzung **keinen 12er-Pack** als Bundle-Inhalt behauptet; `copy_014` erwähnt den 12er-Pack
korrekt nur als **separat bestellbare** Alternative.

### 11.5 Claim-Sicherheit

Alle 61 Schlüssel × 10 geprüft: **kein Rabatt, keine Ersparnis, keine Verfügbarkeits- oder
Lieferzusage, keine Bewertung, kein GTIN/SKU** — und keine medizinische Aussage außerhalb der zwei
Pflichthinweise `duo.copy_008` und `duo.copy_059`, die dort ihre eigene Anwendung verneinen.
Das Prüfmuster ist wie in PT21.3 sprachbewusst.

### 11.6 Bestellkontext

Der Client sendet `product: 'duo'` — stabil und serverseitig allowlistet. Die bekannte Abweichung
zwischen Bestell-ID (`duo`) und Route-Slug (`inside-out-duo`) bleibt **PT21.5**.

### 11.7 Nachweise

`npx vitest run src/content/consumer/products.test.ts` → **26/26** (8 Spray + 9 Masks + 9 Duo):
Vollständigkeit ×10 · Struktur · kein DE-Fallback mit drei begründeten Kognaten · **Bundle
deckungsgleich mit Einzelprodukten und Server-Allowlist** · belegter Paketpreis gegen die Copy jeder
Locale · ungedeckter Zusatzbetrag ehrlich markiert · keine medizinische Aussage außerhalb der
Pflichthinweise · stabile Identität · Medienmaße aus dem JPEG.

`npx playwright test --config e2e/pt21.4.config.ts` → **8/8**: Schema ×10 ohne `offers` ·
**genau zwei Euro-Beträge im Dokument** (49,90 € und 2 €), kein Rabatt-/Verfügbarkeitsversprechen ·
Bundle sichtbar als 1 + 5 ×10 · sichtbarer Inhalt ×10 · Bestellkontext mit abgefangenem Request ·
Überlauf 0 · Axe 0 · Hero eager, übrige Bilder lazy.

Ohne Regression: Spray-Suite 8/8 · Masks-Suite 8/8 · Shell-Suite 8/8 · Unit/Node **283/283** ·
`check:routes` · `check:i18n` · `check:seo` (G3: Consumer 3×10) · `check:colors` ·
`check:search-index` · `typecheck` · ESLint · Prettier. **Kein voller Produktionsbuild.**

### 11.8 Offene, ownergebundene Punkte

| ID      | Sachverhalt                                                                                                                                                                                                                                                                                                                                                                                    | Owner               |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `DU-05` | **2 €/Monat Zusatzbetrag unbelegt** — zwei CONFIRM-Flags im Repository stehen offen                                                                                                                                                                                                                                                                                                            | Marketing           |
| `DU-06` | `duo.copy_016` schreibt "49,90 €" in **allen** Locales, während die Oberfläche über `Intl` lokal formatiert (en "€49.90", pt/nl "€ 49,90"). Auf derselben Seite erscheinen dadurch in en/pt/nl zwei Schreibweisen desselben Betrags. Der **Betrag** ist identisch und belegt; nur die Schreibweise divergiert — eine Copy-Korrektur über zehn Locales gehört dem Copy-Owner, nicht diesem Task | Copy-Owner / PT21.6 |

### 11.9 Handoff PT21.5 — Consumer Ordering

**Primary Write Set:** `server/server.js` (`/api/consumer-order`) · `server/lead-foundation/**` ·
`src/api/consumerOrder.ts` · `src/pages/consumer/OrderForm.tsx` / `OrderModal.tsx` ·
`src/content/consumer/products.ts` (Varianten-/Mengen-Allowlist) · PT21.5-eigene Tests.

**ORDERING CURRENT PATH — Ist-Zustand (aus PT21.1 §4, unverändert gültig):**

| Aspekt            | Ist                                                                    | Bewertung                 |
| ----------------- | ---------------------------------------------------------------------- | ------------------------- |
| UI                | `OrderModal` + `OrderForm`                                             | vorhanden                 |
| Client-API        | `src/api/consumerOrder.ts` → `POST /api/consumer-order`                | vorhanden                 |
| Endpunkt          | `server/server.js`                                                     | **Legacy-Mailendpunkt**   |
| Persistenz        | **keine** — 0 Aufrufe von `LeadRepository`/`createLead`                | **fehlt**                 |
| CRM/Outbox        | **keine** — nur `sgMail.send`                                          | **fehlt**                 |
| Retry             | **keiner**                                                             | **fehlt**                 |
| Idempotency       | **keine** — kein `Idempotency-Key`                                     | **fehlt**                 |
| Rate Limit        | **keiner** — ohne `formLimiter` montiert                               | **fehlt**                 |
| Honeypot          | `_hp`, stilles 200                                                     | vorhanden                 |
| Consent           | `consent !== true` → 400; **keine** Trennung Processing/Marketing      | **unvollständig**         |
| Produkt-Allowlist | `CONSUMER_PRODUCT_LABELS` (spray/masks/duo)                            | vorhanden                 |
| Mengen-Allowlist  | **keine** — `quantity`/`quantityLabel` kommen ungeprüft aus dem Client | **fehlt**                 |
| Tracking          | `tracking.ts` schreibt direkt in `window.dataLayer`                    | **nicht consent-geprüft** |

**Die Journey existiert bereits in der Foundation:** `consumer_order` steht in
`LEAD_JOURNEYS` und hat in `crm.js` das CRM-Ziel `consumer`. Der Endpunkt benutzt beides
nicht. **Konsumieren, nicht neu bauen** — AP22 bleibt Owner der Cross-Journey-Plattform.

**Direkt zu konsumieren, nicht neu erheben:** Route-Baseline (§1) · Shell (§2) · SEO-Baseline (§5) ·
Produktmodell samt Preis-, Provenienz- und Bundle-Semantik (§9.3, §11.3, §11.4) · die drei
bewiesenen Produkt-Suiten.

**Offenes PT21.5-Delta:** Persistenz vor externem Handoff · durable Idempotency · Retry/Outbox ·
Rate Limit · **Mengen-/Varianten-Allowlist serverseitig** · Processing- getrennt von
Marketing-Consent · Ordering ohne Analytics-Consent lauffähig · pre-consent Provider-Requests 0 ·
Bestell-ID vs. Route-Slug entscheiden (`spray`/`masks`/`duo` gegen `vitamin-d3-spray`/
`hydrating-masks`/`inside-out-duo`).

**Drift-Signale:** Änderungen an `products.ts`, `CONSUMER_PRODUCT_LABELS`,
`server/lead-foundation/**` oder `check-seo.ts`.

---

## 12. Delta PT21.5 — Consumer Ordering (2026-09-08)

### 12.1 Ausgangsbefund

Der Handoff aus PT21.1 §4 (`CO-01`) war unverändert gültig und wurde am Code
nachgemessen: `POST /api/consumer-order` war ein **Legacy-Mailendpunkt**. Ohne
Persistenz, ohne Idempotency, ohne Retry, ohne Rate Limit. Ein SendGrid-Fehler
hat die Bestellanfrage **ersatzlos verloren** — es gab keine zweite Kopie.
`quantity`/`quantityLabel` kamen als Freitext aus dem Client und landeten
ungeprüft in der Mail. Die Journey `consumer_order` stand seit AP19 in
`LEAD_JOURNEYS` und hatte in `crm.js` das Ziel `consumer`; der Endpunkt hat
beides nicht benutzt.

### 12.2 Was gebaut wurde

`server/consumer-order.js` — ein Journey-Slice auf der geteilten
Lead-Foundation, gebaut nach dem Muster von `contact-lead.js` und
`support-case.js`. **Keine zweite Lead-Plattform**; AP22 bleibt Owner der
Cross-Journey-Vereinheitlichung.

Reihenfolge, gemessen und nicht nur behauptet:

```
validieren → Produkt/Variante/Menge allowlisten → Processing-Consent
→ PERSISTIEREN (Lead + Outbox, eine Transaktion) → CRM-Handoff → Status
```

| Befund   | Sachverhalt                                                    | Behebung                                                                 |
| -------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `CO-01a` | keine Persistenz — Bestellung ging bei Providerfehler verloren | `LeadRepository.createLead`, Journey `consumer_order`, Kanal `CRM`       |
| `CO-01b` | keine Idempotency                                              | `Idempotency-Key` Pflicht; Replay → derselbe Lead, Konflikt → 409        |
| `CO-01c` | kein Retry                                                     | `lead_outbox` + `LeadHandoffWorker`, 5xx/Timeout retryfähig              |
| `CO-01d` | **kein Rate Limit** — der Endpunkt lief völlig ungebremst      | `formLimiter` (5 / 15 min / IP), wie Contact und Support                 |
| `CO-01e` | keine Mengen-Allowlist                                         | 1–3 oder ausdrücklicher Beratungsfall; alles andere 400                  |
| `CO-01f` | Processing- und Marketing-Consent vermischt                    | getrennt, mit Zeitstempel als Nachweis, Version `consumer-order-2026-09` |
| `CO-01g` | Tracking schrieb ungefragt in `window.dataLayer`               | `pushConsumerEvent` mit Consent-Gate; ohne Einwilligung 0 Einträge       |

### 12.3 Produkt-, Varianten- und Mengen-Allowlist

`PRODUCT_ALLOWLIST` in `server/consumer-order.js` ist die einzige Autorität für
Bestellidentitäten. Sie lag vorher als `CONSUMER_PRODUCT_LABELS` in
`server/server.js`; die vier Drift-Tests in `products.test.ts` zeigen jetzt auf
die neue Stelle und requiren sie, statt Quelltext zu greppen.

**Entscheidung zur offenen Frage Bestell-ID vs. Route-Slug (Handoff §11.9):**
Der **Route-Slug ist kanonisch** (`vitamin-d3-spray`, `hydrating-masks`,
`inside-out-duo`) — er ist die öffentliche, in AP21 festgeschriebene
Produktidentität. Die kurze Bestell-ID (`spray`/`masks`/`duo`) bleibt als
**gebundener Alias** zugelassen und wird serverseitig auf den Slug normalisiert.
Beides sind feste Kennungen; keine davon ist ein freier Name. Der Client sendet
weiter die kurze ID, wodurch die drei bewiesenen Produkt-Suiten unverändert
messen, was sie vorher gemessen haben.

| Produkt (kanonisch) | Alias   | Variante  | Menge                           |
| ------------------- | ------- | --------- | ------------------------------- |
| `vitamin-d3-spray`  | `spray` | `pack-12` | 1–3 oder `MORE` (Beratungsfall) |
| `hydrating-masks`   | `masks` | `box-5`   | 1–3 oder `MORE`                 |
| `inside-out-duo`    | `duo`   | `set`     | 1–3 oder `MORE`                 |

Die Varianten kommen aus dem Produktmodell (`orderVariant`) und spiegeln die
Bundle-Wahrheit aus PT21.4: `set` ist ein Duo-Set, **nicht** der 12er-Pack.
Eine fremde Variante (`spray` + `box-5`) wird **abgelehnt**, nicht still auf die
Standardvariante gefaltet. Der Beratungsfall behauptet keine Menge — er
persistiert `quantity: 0` mit `quantityMode: 'ADVISE'`.

### 12.4 Datenminimierung

Der Lead trägt exakt vierzehn Felder; alles Übrige aus dem Request fällt weg.
Ein mitgeschickter `to`-Wert landet nirgends — die Empfänger sind serverseitig
fest verdrahtet, das Formular ist kein Relay. Alle Textfelder sind längenbegrenzt.

### 12.5 Wahrheit im Status

Das hier ist eine **Bestellanfrage**, kein Kaufvertrag. Die Antwort enthält kein
`purchased`/`paid`, die Erfolgsansicht nennt die Vorgangsnummer und den
ausdrücklichen Hinweis `order_form.success_not_purchase` ×10. Ohne
konfigurierten Provider meldet der Status ehrlich `NO_PROVIDER_CONFIGURED` —
die Bestellanfrage ist trotzdem dauerhaft gespeichert. Ein Provider-Timeout wird
als `PROVIDER_RESULT_UNKNOWN` markiert und **nicht blind nachgespielt**.

### 12.6 Vorgangsnummer

`PDX-XXXXXXXX`, deterministisch als `sha256('consumer_order:' + key)[0..8]`.
Ein Replay nennt dieselbe Nummer, ohne zweiten Schreibvorgang.

### 12.7 Consent und Tracking

Verarbeitungs-Consent ist Pflicht (mit Zeitstempel), Marketing-Consent ist eine
zweite, optionale Checkbox — eine Ablehnung blockiert die Bestellung nicht.
Eine **Analytics-Einwilligung ist an keiner Stelle Voraussetzung**: der
Bestellpfad enthält nachweislich kein `dataLayer`, `gtag`, `analytics_storage`
oder `hasAnalyticsConsent` (Test prüft den Quelltext). Umgekehrt läuft jedes
Consumer-Analytics-Event über `pushConsumerEvent` und passiert nur mit
Einwilligung — kein Buffering, kein Nachsenden nach späterem Opt-in.
Gemessen: Bestellung ohne jede Consent-Entscheidung geht durch, dabei
**0 Provider-Requests und 0 dataLayer-Einträge**.

### 12.8 Foundation-Delta

`normalizeContext` um vier journey-neutrale, streng gebounded Felder erweitert:
`reference`, `productId`, `variant`, `quantity`. Für alle anderen Journeys
bleiben sie leer bzw. 0. Keine Änderung an Repository-Semantik, Worker, Router
oder Migrationen. `MAIL_COPY` um den Abschnitt `consumerOrder` ×10 (13 Schlüssel)
erweitert; die Bestätigungsmail geht in der Sprache der Bestellung raus.

### 12.9 Nachweise

`npx vitest run server/consumer-order.test.js` → **23/23**: alle drei Familien
unter Slug und Alias · unbekanntes Produkt, fremde Variante, zehn ungültige
Mengen · Datenminimierung samt Relay-Versuch · Consent getrennt · Persistenz vor
Handoff (der **Datenbankzustand im Moment des Providerkontakts** wird gemessen)
· Double-Click/Browser-Retry/API-Replay/Worker-Replay → ein Vorgang, eine
Zustellung · 409-Konflikt · deterministische Vorgangsnummer · transienter
Providerfehler → Retry → zugestellt · Timeout → `PROVIDER_RESULT_UNKNOWN` ·
`NO_PROVIDER_CONFIGURED` ehrlich · Team- und Bestätigungsmail mit fixen
Empfängern und cs-Copy.

`npx vitest run server/consumer-order.endpoint.test.js` → **5/5**: 202 +
persistierter Lead mit kanonischem Slug · 400 für vier Ablehnungsgründe · 409 ·
Honeypot 200 ohne Persistenz · **429 pro IP**, fremde IP unberührt.

`npx playwright test --config e2e/pt21.5.config.ts` → **11/11**: allowlistete
Nutzlast für alle drei Familien (kein `quantityLabel` mehr) · Idempotency-Key
als Header · Doppelklick → genau eine Anfrage · **Bestellung ohne Consent läuft
durch, 0 Provider-Requests, 0 Events** · Erfolgsmeldung mit Vorgangsnummer und
ohne Kaufbehauptung · retryfähiger vs. terminaler Fehler getrennt · kein Request
ohne Verarbeitungs-Consent · Systemcopy ×10 ohne DE-Fallback · Formular ×10 ·
Axe serious/critical 0.

**Mutationsproben** (Guard entfernt → Test fällt): Mengengrenzen → 1 Fehlschlag ·
Varianten-Allowlist → 1 · `formLimiter` → 1 · Consent-Gate im Tracking → 1 ·
Adapteraufruf vor der Persistenz → 1. Die erste Fassung der
Persistenz-Reihenfolge-Probe schlug **nicht** an; der Test überschrieb den
erfassten Zustand beim zweiten, korrekten Providerlauf. Nach der Korrektur
(nur der erste Kontakt zählt) greift er.

Ohne Regression: Spray 8/8 · Masks 8/8 · Duo 8/8 · Inhaltstest 26/26 ·
Server-/Node-Suiten 207/207 · `check:routes` · `check:i18n` · `check:seo` ·
`check:colors` · `check:search-index` · `check:shell-i18n` ·
`check:lead-foundation` 13/13 · `typecheck` · ESLint · Prettier.
**Kein voller Produktionsbuild** (Fast-Delta V2 §7).

### 12.10 Offene, ownergebundene Punkte

| ID      | Sachverhalt                                                                                                                                                                   | Owner       |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `CO-03` | Kein Hintergrund-Worker: die Outbox wird nur beim nächsten eingehenden Request weitergedreht. Ein `RETRY_PENDING` bleibt liegen, bis jemand bestellt. Gilt für alle Journeys. | AP22        |
| `CO-04` | Keine Retention-Frist für Bestell-Leads (Support hat 90 Tage als Metadaten). Der Löschjob fehlt journeyübergreifend.                                                          | AP22        |
| `CO-05` | Der CRM-Adapter ist eine Team-Mail, kein echtes CRM. Ehrlich als `consumer`-Route abgebildet; ein echter Adapter ersetzt ihn ohne Änderung am Journey-Slice.                  | AP22        |
| `CO-06` | Die Lieferadresse bleibt optional erhoben. Sie ist für eine Bestellanfrage nicht zwingend — eine Entscheidung darüber ist Fachfrage, nicht Technik.                           | Datenschutz |

### 12.11 Handoff PT21.6 — breiter SEO-Gate

**Bewiesen, nicht erneut erheben:** Route-Baseline (§1) · Shell (§2) ·
Produktmodell samt Preis-, Provenienz- und Bundle-Semantik (§9.3, §11.3, §11.4) ·
die drei Produkt-Suiten · die vollständige Bestellstrecke (§12).

**PT21.6-SEO-Deltas aus PT21.5:** keine. Es wurden keine Routen, kein
`SEOHead`, keine Meta-Daten, keine Sitemap-Einträge und keine strukturierten
Daten verändert. `check:seo` (G3: Consumer 3×10) läuft unverändert grün. Neue
`order_form.*`-Schlüssel sind Formularcopy und erscheinen in keinem Meta-Feld.

**Weiterhin offen für PT21.6:** `DU-06` (Preisschreibweise en/pt/nl,
Copy-Owner) · `MK-06`/`MK-07` · `SP-05`–`SP-09`.

**Drift-Signale:** Änderungen an `server/consumer-order.js`,
`server/lead-foundation/**`, `products.ts` oder `scripts/check-seo.ts`.

---

## 13. Delta PT21.6 — breiter Consumer-SEO-Gate (2026-09-08)

### 13.1 Was dieser Task ist — und was er nicht ist

PT21.6 ist der **Messtask**, nicht der Umbautask. Die SEO-Architektur der
Consumer-Strecke stammt aus PT21.1 und war laut §5 bereits korrekt. Fast-Delta
V2 §9 verlangt hier den breiten 30-Routen-Gate und verbietet ausdrücklich,
die Architektur ohne echte Regression neu zu bauen.

**Ergebnis: es gab nichts zu reparieren.** PT21.6 hat deshalb **keine einzige
Produktivdatei verändert** — nur zwei neue Testdateien, die den Zustand breit
messen und dauerhaft festnageln. Alle 30 Routen wurden einzeln geprüft, keine
Locale aus einer anderen hochgerechnet.

### 13.2 Die 30-Routen-Matrix — gemessen an der rohen Serverantwort

Gemessen wurde das, was ein Crawler **ohne JavaScript** im ersten Byte sieht,
gegen einen vollständigen Produktionsbuild (Client + SSR).

| Prüfung              | Ergebnis                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| HTTP                 | **30/30 = 200**, direkt, ohne Weiterleitung                                                      |
| Basic Auth / Preview | 0 — kein `WWW-Authenticate`, kein `X-Robots-Tag: noindex`                                        |
| Redirects            | `/consumer/{slug}` → **301 → `/de/...`**; 0/30 gültige Locales umgeleitet                        |
| EN-Zwangsredirect    | **0** — keine Locale wird nach EN gedrängt                                                       |
| Indexierbarkeit      | **30/30** `index, follow` in `robots` **und** `googlebot`                                        |
| Registry-Abgleich    | **30/30** — Registry `INDEX_FOLLOW` deckt sich mit dem Ausgelieferten                            |
| Canonical            | **30/30** genau ein Self-Canonical; `og:url` identisch                                           |
| hreflang             | **30/30** je zehn Alternativen, reziprok                                                         |
| x-default            | **30/30** auf `de`                                                                               |
| SSR-Head             | **30/30** Title, Description, Canonical, hreflang, OG, JSON-LD und H1 bereits im ersten Response |
| Sitemap              | 390 URLs gesamt, davon **exakt 30 Consumer**, dublettenfrei, jede mit 200                        |
| robots.txt           | 200, **kein** `Disallow` auf `/consumer`                                                         |

### 13.3 Social

Pro Produktfamilie **genau ein** eigenes OG-Bild, die drei sind verschieden,
alle absolut und mit 200 erreichbar, Maße gesetzt. `og:type=product`,
`twitter:card=summary_large_image`, `twitter:title` deckungsgleich mit
`og:title`. `og:locale` steht korrekt im OpenGraph-Format `sprache_TERRITORIUM`
(`de_DE`, `en_GB`, `cs_CZ` …) — meine erste Prüfung erwartete fälschlich den
blossen Sprachcode und war der Fehler, nicht die Seite.

**Keine falsche Locale-Behauptung:** die Bildpfade enthalten kein Sprachsegment.
Das Bild ist sprachneutral und gibt sich auch nicht als lokalisierte Fassung
aus; lokalisiert ist der `og:image:alt`, und der ist es in allen zehn Sprachen.

### 13.4 Strukturierte Daten

30/30 tragen Product + BreadcrumbList + FAQPage, `Product.url` gleich Canonical.
Kein `offers`, `price`, `priceCurrency`, `availability`, `aggregateRating`,
`review`, `gtin`, `sku` oder `mpn` — auch nicht verschachtelt.

Bemerkenswert und im Mutationstest sichtbar geworden: `createProductSchema` in
`structuredData.ts` kann diese Felder **strukturell gar nicht** erzeugen; es gibt
keinen Codepfad dorthin. Der Versuch, an der Aufrufstelle ein `offers` zu
injizieren, blieb wirkungslos. Der Test ist damit eine Regressionssperre, die
eigentliche Garantie liegt im zentralen Builder.

### 13.5 Interne Verlinkung — der ehrliche Befund

Innerhalb des Consumer-Clusters ist die Verlinkung vollständig und sauber:

```
vitamin-d3-spray  ←  hydrating-masks, inside-out-duo
hydrating-masks   ←  inside-out-duo
inside-out-duo    ←  vitamin-d3-spray, hydrating-masks
```

Jedes Produkt hat in **jeder** der zehn Locales mindestens einen eingehenden
Link. Alle Links tragen das Sprachpräfix, sind also **keine Redirect-Quellen**.
270 distinkte interne Links über alle 30 Seiten geprüft: **0 tot, 0 umgeleitet**.

**Was fehlt, und das steht hier ausdrücklich:** von den 36 nicht-Consumer-Seiten
der DE-Sitemap verlinkt **keine einzige** auf die Consumer-Strecke. Der Cluster
ist intern gut vernetzt, aber vom übrigen Web-Auftritt aus nur über die Sitemap
erreichbar. Das ist gemessen (`0/36`), nicht geschätzt.

Ich habe das **nicht behoben**, und zwar aus einem Grund, nicht aus Bequemlichkeit:
die AP21-Regeln schliessen beide dafür verfügbaren Mechanismen namentlich aus —
`CONSUMER_HUB = NOT_REQUIRED` und „Hauptmenü-Aufnahme ist kein künstliches DoD".
Einen Einstiegspunkt zu erfinden wäre eine IA-Entscheidung, die dieser Task nicht
treffen darf. Die PT21.6-Akzeptanz („All 3 products have deliberate canonical
inlinks") ist erfüllt; die Sichtbarkeitsfrage ist als `SEO-01` owner-gebunden.

### 13.6 Nachweise

`npx playwright test --config e2e/pt21.6.config.ts` → **12/12** gegen einen
vollständigen Produktionsbuild (`dist/` unberührt, isolierter outDir).

Repo-Guards, alle grün: `check:routes` (G1: 25 Familien, 43 Pfade, 39 Sitemap,
30 Redirects) · `check:nav-targets` · `check:i18n` (G4: 15 Namespaces × 10) ·
`check:seo` (G3: 39 Familien, 390 URLs, Consumer 3×10, Structured Data,
robots/meta/host) · `check:internal-findability` · `check:search-index` ·
`check:befunde-seo` (60/60).

**Mutationsproben:** Registry-Route auf `NOINDEX_NOFOLLOW` und ein erfundenes
`offers` im zentralen Schema-Builder → **7 der 12 Tests fallen**. Zwei eigene
Fehler dabei gefunden und behoben:

1. Die erste Fassung prüfte `<title>` ohne Attribute und meldete 30 Fehlbefunde —
   react-helmet setzt `data-rh`. Mein Regex, nicht das Produkt.
2. Die erste Mutationsprobe deckte eine **echte Lücke im Gate** auf: bei
   Registry-`NOINDEX` kollabierte das Canonical, während die Seite weiter
   `index, follow` auslieferte. Registry und gerenderter Head sind zwei Quellen,
   und ich hatte nur die zweite gemessen. Der Abgleich beider ist jetzt ein
   eigener Test — genau die Divergenz, die im Betrieb unsichtbar bliebe.
   Ausserdem lief der Gate zunächst im `serial`-Modus und brach nach dem ersten
   Fehlschlag ab; ein Gate muss alle Befunde zeigen, der Modus ist raus.

### 13.7 Offene, ownergebundene Punkte

| ID       | Sachverhalt                                                                                                                                                                                                                | Owner               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `SEO-01` | 0 von 36 nicht-Consumer-Seiten verlinken in den Cluster. Kein SEO-Defekt der 30 Routen, aber ohne Einstiegspunkt aus dem Hauptauftritt. Hub und Menü sind per AP21-Regel ausgeschlossen — es braucht eine IA-Entscheidung. | IA / AP24           |
| `SEO-02` | `searchEligible: false` — die Consumer-Strecke steht bewusst nicht im internen Suchindex. Bestandsentscheidung aus PT21.1, hier nur bestätigt.                                                                             | bestätigt, kein Fix |
| `DU-06`  | Preisschreibweise en/pt/nl (`duo.copy_016` vs. `Intl`) — Copy-Frage, kein SEO-Befund                                                                                                                                       | Copy-Owner          |

### 13.8 Handoff PT21.7 — Consumer Runtime / A11y / Performance / Ordering

**Bewiesen, nicht erneut erheben:** die vollständige 30-Routen-SEO-Matrix (§13.2)
· Social (§13.3) · strukturierte Daten (§13.4) · interne Verlinkung (§13.5) ·
Route-Baseline (§1) · Shell (§2) · Produktmodell (§9.3, §11.3, §11.4) · die
Bestellstrecke (§12).

**PT21.7-Integrationsdeltas:** PT21.6 hat **keine Produktivdatei angefasst** —
es gibt aus diesem Task kein Runtime-, A11y- oder Performance-Delta. PT21.7
startet auf demselben Code, den PT21.5 hinterlassen hat.

Für PT21.7 offen und noch nicht breit gemessen: Axe über alle 30 Routen (bisher
je Produkt eine Locale plus das Bestellformular) · Überlauf über alle zehn
Locales (bisher de/pl/cs) · Ladeverhalten der 30 Routen · die Bestellstrecke
gegen ein **echtes** Backend statt gegen abgefangene Requests.

**Drift-Signale:** Änderungen an `routeRegistry.ts`, `SEOHead.tsx`,
`structuredData.ts`, `sitemap.ts` oder den Consumer-Seiten.

---

## 14. Delta PT21.7 — breiter Consumer-Integrationsgate (2026-09-08)

### 14.1 Was hier zum ersten Mal gemessen wurde

PT21.2–PT21.4 haben je Produkt eine Handvoll Locales geprüft, PT21.6 die SEO-Ebene
aller 30 Routen. PT21.7 misst die **Laufzeit** breit: alle 30 Seiten im echten
Browser gegen einen **vollen Produktionsbuild** (Client + SSR) und — zum ersten
Mal — die Bestellstrecke gegen ein **echtes Backend** statt gegen abgefangene
Requests. Genau das hatte der PT21.6-Handoff als offen vermerkt.

### 14.2 Der Befund: die Produktbilder

Die Consumer-Bilder kamen später ins Repository als der Rest und sind nie durch
`optimize-images.mjs` gelaufen: 33 WebP-Geschwister im übrigen `src/assets`,
**keines** im Consumer-Ordner. Gemessen, nicht vermutet:

| Befund    | Messwert                                                                                              |
| --------- | ----------------------------------------------------------------------------------------------------- |
| `PERF-01` | Heros mit 1122px nativ in ein 358–570px breites Feld — **Faktor 2,0× bis 3,1×**                       |
| `PERF-02` | Kein `srcset`, kein WebP, **keine `width`/`height`** (Layoutsprung), kein `fetchPriority` am LCP-Bild |

Behoben durch `scripts/build-consumer-images.mjs` (drei WebP-Breiten je Bild,
aus der gemessenen Darstellung abgeleitet), das Modul
`src/content/consumer/images.ts` als einzige Bildquelle und die Komponente
`ConsumerPicture` in `shell.tsx`. Die JPEG-Originale bleiben — als
`<picture>`-Fallback **und** als `og:image`, weil Social-Crawler bei WebP
unzuverlässig sind.

**Ergebnis, mit derselben Methode vorher und nachher gemessen:**

| Produkt | erster Bildschirm @390px | @1440px     | Überdimensionierung |
| ------- | ------------------------ | ----------- | ------------------- |
| Spray   | 332 KB → **36 KB**       | 332 → 76 KB | 3,1× → **1,1×**     |
| Masken  | 206 KB → **24 KB**       | 206 → 42 KB | 2,7× → **0,9×**     |
| Duo     | 279 KB → **29 KB**       | 279 → 56 KB | 2,7× → **1,0×**     |

817 KB → 89 KB auf dem Handy über die drei Einstiegsseiten. Das Budget von
120 KB je Produkt ist als Test festgeschrieben, nicht als Absichtserklärung.

### 14.3 Was ausdrücklich NICHT gelöscht wurde

`spray-hero-office-single.jpeg` (237 KB) wird von keiner Produktivdatei
importiert. Es landet damit in **keinem Bundle** und kostet zur Laufzeit
**null Bytes** — es ist Repository-Hygiene, kein Performanceproblem. Ich habe
es deshalb nicht entfernt, sondern als `PERF-03` vermerkt: eine Datei zu
löschen, die jemand anderes als Rohmaterial abgelegt hat, ist nicht die
Entscheidung dieses Tasks.

### 14.4 Die 3×10-Laufzeitmatrix

| Prüfung             | Ergebnis                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Rendering           | 30/30 HTTP 200, genau eine H1 mit der freigegebenen Zeile                                                                            |
| Kein DE-Leck        | 30/30 — in den neun anderen Sprachen ist die H1 nie die deutsche Fassung                                                             |
| Rohe i18n-Schlüssel | 0 im sichtbaren Text                                                                                                                 |
| Hydrierungsfehler   | 0 (React 418/421/423/425 und `pageerror` mitgeschnitten)                                                                             |
| Recht/Consent       | 30/30 Datenschutz-Link und Consent-Banner vorhanden                                                                                  |
| Sprachwechsel       | **30 Wechsel** über den echten Umschalter — jeder landet auf demselben Produkt in der Zielsprache, keiner auf EN oder der Startseite |

### 14.5 Barrierefreiheit

- **Axe serious/critical = 0 auf allen 30 Seiten** und zusätzlich im geöffneten
  Bestelldialog je Produkt.
- 30/30: Skip-Link ist das **erste** Tab-Ziel und zeigt auf `#main-content`;
  genau ein `<main>` mit `tabindex="-1"`; keine übersprungene
  Überschriftenebene.
- Bestellformular: **kein** Feld ohne verknüpfte Beschriftung, Dialog mit
  `aria-modal` und `aria-labelledby`, Fehler als `role="alert"`-Live-Region,
  Absendeknopf per Tastatur erreichbar.
- Umbruch: 3 Produkte × 4 lange Locales × 3 Breiten = **36 Kombinationen**,
  0px Überlauf. Der Dialog bleibt bei 390px bedienbar, Touch-Ziel ≥ 44px.

### 14.6 Ordering gegen ein echtes Backend

Voller Weg: Browser → SSR-Proxy → `server/server.js` → SQLite. Danach wurde die
Datenbank direkt gelesen.

- Alle drei Produkte: Vorgang wirklich persistiert, mit kanonischem Slug,
  allowlisteter Variante, Menge und `PDX-`-Vorgangsnummer.
- Ereignisfolge `LEAD_RECEIVED → LEAD_PERSISTED → HANDOFF_PENDING` **vor** dem
  Handoff; Outbox-Zeile auf Kanal `CRM` vorhanden.
- Ohne Provider ehrlich `FAILED_TERMINAL` / `NO_PROVIDER_CONFIGURED` — und die
  Oberfläche behauptet trotzdem keinen Kauf.
- Replay mit identischem Rumpf → derselbe Vorgang; abweichender Rumpf unter
  demselben Schlüssel → **409**.
- Honeypot 200 ohne Persistenz, Allowlist-Ablehnungen 400, **429 pro Absender**.
- Bestellung ohne jede Consent-Entscheidung läuft durch: **0 Provider-Requests,
  0 dataLayer-Einträge**.

### 14.7 Nachweise

`npx playwright test --config e2e/pt21.7.config.ts` → **17/17** gegen vollen
Produktionsbuild und echtes Backend.

Ohne Regression, alle mit eigenem Build: Shell 8/8 · Spray 8/8 · Masken 8/8 ·
Duo 8/8 · Ordering-Client 11/11 · **SEO 12/12** (die SEO-Rebestätigung aus
§13 läuft unverändert — `og:image` ist weiterhin das JPEG).

Guards: `check:consumer-images` (neu) · `check:routes` · `check:i18n` ·
`check:seo` · `check:colors` · `check:search-index` ·
`check:internal-findability` · `check:shell-i18n` · `check:nav-targets` ·
`check:lead-foundation` · `typecheck` · ESLint · Prettier. Node-Suiten
**207/207**.

**Mutationsproben:** WebP-Variante entfernt → Guard fällt · Quellbild ohne
Neugenerierung geändert → Guard fällt · Hero verliert WebP-Quelle und Vorrang →
3 von 4 Performancetests fallen.

**Fünf eigene Testdefekte gefunden und behoben** — keiner davon ein Produktfehler:

1. Axe meldete Kontrastfehler an 26 Stellen. **Nachgemessen: `#0f766e` auf
   `#f8fafc` = 5,23:1**, Opazität 1, kein transparenter Vorfahr — sauber. Die
   Ursache war meine Warteschleife: sie akzeptierte `opacity === 0` als
   „fertig", und genau das ist der Zustand **vor** einer Einblendung. Für die
   Messung werden Übergänge jetzt abgeschaltet.
2. Mein Schlüssel-Regex lief mit `i`-Flag und traf Fließtext („…Duo" +
   „Entdecken…", die beim Auslesen von `textContent` aneinanderstoßen).
3. Der Sprachumschalter wurde über einen Namensregex gesucht — `/de/` traf auch
   „Nederlands". Jetzt strukturell über den Code im Auslöser.
4. `page.setExtraHTTPHeaders` wirkt **nicht** auf `page.request`; alle
   Direktaufrufe teilten sich einen Limiter-Eimer und liefen ab dem fünften in 429. Absender wird jetzt explizit gesetzt.
5. Mein Replay-Helfer erzeugte je Aufruf einen neuen Consent-Zeitstempel, also
   einen anderen Rumpf. Der Server meldete zu Recht 409 — der Test hätte
   Idempotenz geprüft, wo er Konflikterkennung maß.

### 14.8 Offene, ownergebundene Punkte

| ID                               | Sachverhalt                                                                                                                               | Owner             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `PERF-03`                        | `spray-hero-office-single.jpeg` unbenutzt — 0 Bytes zur Laufzeit, reine Repository-Hygiene                                                | Content           |
| `SEO-01`                         | 0 von 36 nicht-Consumer-Seiten verlinken in den Cluster; Hub und Menü sind per AP21-Regel ausgeschlossen, es braucht eine IA-Entscheidung | IA / AP24         |
| `CO-03`                          | Kein Hintergrund-Worker: die Outbox dreht nur bei eingehenden Requests weiter                                                             | AP22              |
| `CO-04`                          | Keine Retention-Frist für Bestell-Leads                                                                                                   | AP22              |
| `CO-05`                          | CRM ist eine Team-Mail, kein echtes CRM — ehrlich als `consumer`-Route abgebildet                                                         | AP22              |
| `CO-06`                          | Optionale Lieferadresse — Fachfrage                                                                                                       | Datenschutz       |
| `DU-05`                          | 2 €/Monat unbelegt, zwei CONFIRM-Flags offen                                                                                              | Marketing         |
| `DU-06`                          | Preisschreibweise en/pt/nl                                                                                                                | Copy-Owner        |
| `MK-06`/`MK-07`, `SP-05`–`SP-09` | aus PT21.2/PT21.3 unverändert offen                                                                                                       | siehe §9.7, §10.7 |

### 14.9 AP21-Gesamtstand für die Closure

| Bereich        | Stand                                                                                                             | Beleg        |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ------------ |
| Shell          | Skip-Link, `<main>`, Consent, Recht, x10-Umschalter, SSR-Head                                                     | §2, §14.5    |
| Produktinhalt  | 3 Familien × 10 echte Fassungen, keine erfundenen Zahlen, claim-sicher                                            | §9, §10, §11 |
| Bestellstrecke | eigene Journey auf der geteilten Foundation, persistent, idempotent, retryfähig, abuse-sicher, consent-unabhängig | §12, §14.6   |
| SEO            | 30/30 index/follow, canonical, hreflang, Sitemap, Social, Schema                                                  | §13          |
| Laufzeit/A11y  | 30/30 gerendert, Axe 0, 36 Umbruchkombinationen, Budgets                                                          | §14.4–§14.5  |
| Performance    | responsive WebP, 817 KB → 89 KB mobil                                                                             | §14.2        |
| AP22-Grenze    | Shared Foundation **konsumiert**, nicht erweitert; AP22 unverändert NOT STARTED                                   | §12.8        |

**Nicht behauptet:** kein Shop, kein Warenkorb, kein Checkout, keine Zahlung,
kein Abo, keine Gutscheine. Kein echtes CRM. Kein Hintergrund-Worker. Keine
Löschfristen. Die Consumer-Strecke hat keinen Einstiegspunkt aus dem
Hauptauftritt (`SEO-01`).

### 14.10 Handoff AP21-CLOSURE

**Vollständig belegt, aber von der Closure bewusst unabhängig neu zu messen:**
alles aus §13 und §14. Die Closure traut laut ihrem eigenen Auftrag keinem
PT-PASS blind — die Belege hier sagen, **wo** gemessen wurde und **womit**,
nicht, dass die Messung übersprungen werden darf.

**Reproduktion:** `e2e/pt21.6.config.ts` (SEO, 12) · `e2e/pt21.7.config.ts`
(Integration + Ordering live, 17) · `e2e/pt21.1–21.5.config.ts` (51) ·
`npm run check:consumer-images` · Node-Suiten 207.

**Bekannte Baselines, Schnittmenge mit dem AP21-Delta leer:** 35 Prettier-Dateien,
ein jsdom-Testfile unter Node 18, ein `react-refresh`-Lintfund in
`OrderModal.tsx` (identisch auf HEAD).

---

## 15. AP21-CLOSURE — unabhängige Reverifikation (2026-09-08)

### 15.1 Wie unabhängig gemessen wurde

Die Closure hat die PT-Testliste **nicht wiederholt**, sondern den Zustand neu
hergeleitet. Drei Entscheidungen machen das aus:

1. Die 30 Routen kommen aus `STATIC_ROUTE_DEFINITIONS` (Filter
   `routeType === 'CONSUMER_PRODUCT'`) × `SUPPORTED_LANGUAGES` — nicht aus
   einer im Test gepflegten Liste. Eine Registry-Regression fällt damit auf,
   statt am Test vorbeizulaufen.
2. Die Bestellstrecke lief gegen ein echtes Backend mit **frischer**
   Datenbank; danach wurde die Datenbank gelesen, nicht die Antwort geglaubt.
3. Der Claim-Audit sucht aktiv nach dem, was **nicht** dastehen darf — und hat
   eine Gegenprobe, dass der Pflichthinweis auf jeder der 30 Seiten wirklich
   steht. Ein Audit, der nur Verbotenes sucht, würde eine leere Seite
   durchwinken.

Belege: `e2e/ap21-closure.spec.ts` (**21/21**, voller Produktionsbuild +
echtes Backend) · `server/ap21-closure.test.js` (**9/9**, Provider-Ausfälle
gegen echte SQLite).

### 15.2 Was die Closure selbst gemessen hat

| Bereich     | Messung                                                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routen      | 30/30 HTTP 200, kein Basic Auth, kein Header-`noindex`; präfixloser Pfad 301 → `/de/`, **0 EN-Zwangsredirects**                                                                   |
| Shell       | 30/30 genau ein `<main>` mit `tabindex="-1"`, Skip-Link als **erstes** Tab-Ziel, Consent-Banner, alle drei Rechtsseiten verlinkt                                                  |
| SSR-Head    | 30/30 Title, Description, Canonical, 11 hreflang, absolutes `og:image`, gerenderte H1 — und der **freigegebene SEO-Titel dieser Locale**                                          |
| Inhalt      | 30/30 Headline, Pflichthinweis, ≥5 FAQ-Einträge, Bestell-CTA mit allowlisteter ID, Hero-Alt der Locale                                                                            |
| DE-Fallback | 0 — alle Prosa-Strings ≥25 Zeichen je Locale gegen DE geprüft, mit 11 einzeln begründeten Kognaten                                                                                |
| Claims      | 0 — pro Sprache eigenes medizinisches Vokabular, Negationserkennung, plus Gegenprobe auf den Pflichthinweis                                                                       |
| Schema      | 30/30 Product+Breadcrumb+FAQ, `Product.name` = Produktname der Locale, kein `offers`/`price`/`availability`/`rating`/`review`/`gtin`/`sku`/`mpn`                                  |
| SEO         | 30/30 index/follow in `robots` **und** `googlebot`, Self-Canonical, hreflang×10 + x-default `de`, Sitemap exakt 30, `robots.txt` ohne Disallow                                    |
| Social      | je Familie genau ein erreichbares Bild, `og:locale` als `de_DE`/`en_GB`, `og:image:alt` in der Sprache der Seite, kein Sprachsegment im Bildpfad                                  |
| Verlinkung  | jedes Produkt in **jeder** Locale mit eingehenden Links, alle mit Sprachpräfix, 0 tote/umgeleitete Links                                                                          |
| Ordering    | 3/3 Familien persistiert, Ereignisfolge vor dem Handoff, Outbox `CRM`, ehrlich `NO_PROVIDER_CONFIGURED`                                                                           |
| Missbrauch  | Idempotenz, 409-Konflikt, Honeypot ohne Persistenz, **10** Ablehnungsfälle (inkl. `product` als Objekt), 429 je Absender                                                          |
| Consent     | drei Zustände geprüft — **vor** der Entscheidung, **abgelehnt**, **erteilt**: Bestellung läuft in allen dreien, 0 Provider-Requests, 0 dataLayer-Einträge vor Einwilligung        |
| A11y        | Axe serious/critical **0** auf allen 30 Seiten und im Bestelldialog je Produkt; kein unbeschriftetes Feld                                                                         |
| Responsive  | 36 Kombinationen (3 × 4 lange Locales × 3 Breiten), 0px Überlauf                                                                                                                  |
| Performance | Bildbudget je Produkt eingehalten, Hero WebP + `eager` + `fetchpriority=high` + feste Maße                                                                                        |
| Provider    | Retry bis zur Zustellung · ehrliches Aufgeben nach der letzten Wiederholung · Timeout als `PROVIDER_RESULT_UNKNOWN` **ohne** blinden Replay · Worker-Replay ohne Doppelzustellung |

### 15.3 Drei Fehlbefunde — alle in meiner Messung, keiner im Produkt

Der erste Closure-Lauf meldete 3 Befunde. Alle drei habe ich am Objekt
nachgemessen und aufgelöst:

1. **„Heilversprechen: cure"** auf `/en/consumer/hydrating-masks`. Der Satz
   lautet: „It is **not intended to** diagnose, treat, **cure** or prevent any
   skin disease." Das ist der kosmetische **Pflichthinweis** — das Gegenteil
   eines Claims. Italienisch „cure"/„cura" ist das Substantiv _Pflege_
   („Cura idratante", „bisognosa di cure"), derselbe Fehlalarm wie in PT21.3.
   Behoben durch **sprachspezifische** medizinische Vokabulare plus
   Negationserkennung im Satz — ein sprachübergreifendes Muster ist für
   falsche Freunde untauglich.
2. **`og:image:alt` „nicht lokalisiert"** auf `/it/consumer/vitamin-d3-spray`.
   Der italienische Alt-Text enthält `dell'ufficio`; im Attribut steht
   `dell&#39;ufficio`. Mein Vergleich war unmaskiert. Behoben durch
   Entity-Dekodierung — dieselbe Ursache traf auch den SEO-Titel-Vergleich.
3. Ein von mir selbst in der Korrektur eingefügtes `cura(?:no)?` löste 14
   weitere Fehlalarme aus und wurde wieder entfernt.

**Mutationsproben der neuen Detektoren:** ein künstlich eingesetzter
DE-Fallback und ein echtes italienisches Heilversprechen („guarisce") lassen
genau die beiden zuständigen Tests fallen — während die harmlosen
„cura"-Stellen weiterhin nicht anschlagen.

### 15.4 False-Ready-Audit — 0 Befunde

| Verdacht                              | Messung                                                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EN-Body-Fallback als x10 ausgegeben   | `fallbackLng: 'en'` existiert global, aber alle zehn Consumer-Namespaces sind **vollständig** (0 fehlende Keys) — der Fallback hat nichts zu tun; zusätzlich 0 DE-identische Prosa |
| gültige Locale → EN                   | 0 Vorkommen von `redirect(301, '/en…')`; Default ist `de`                                                                                                                          |
| Mail-only als Persistenz              | 0 — `createLead` vor `processNext`, am Quelltext geprüft                                                                                                                           |
| Erfolg vor Persistenz                 | `createLead` (Zeile 407) steht vor `processNext` (426)                                                                                                                             |
| fehlende Idempotenz                   | Schlüssel Pflicht, 409 bei Konflikt                                                                                                                                                |
| fehlendes Rate Limit                  | `formLimiter` am Endpunkt, 429 gemessen                                                                                                                                            |
| Analytics-Consent für Ordering nötig  | 0 Treffer für `dataLayer`/`gtag`/`analytics_storage`/`hasAnalyticsConsent` im gesamten Bestellpfad                                                                                 |
| Client-Produktname als Serverwahrheit | Server löst ausschließlich über `PRODUCT_ALLOWLIST` auf                                                                                                                            |
| erfundene Schema-Preise/Reviews       | `structuredData.ts` hat **keinen Codepfad** zu `offers`/`price`/`rating`                                                                                                           |
| englische Social-Copy als lokalisiert | `og:image:alt` ist in allen 30 Fällen die Copy der jeweiligen Sprache                                                                                                              |
| Shop/Payment-Scope eingeschleppt      | 0 — die einzigen Treffer sind Kommentare, die den Ausschluss dokumentieren, und ein bestehender `/voucher`-Legacy-Redirect                                                         |
| AP22 als complete markiert            | 0 — AP22 steht auf `NOT STARTED`                                                                                                                                                   |

### 15.5 AP22-Grenze

Fünf Journey-Slices (`contact`, `support`, `consumer_order`,
`content_download`, `epigenetics_inquiry`) rufen alle `createLead` derselben
Foundation auf. `LEAD_JOURNEYS` hat genau fünf Einträge — AP21 hat keine
sechste erfunden. Der Test prüft zusätzlich, dass **keine** Tabelle mit
`consumer`/`order` im Namen existiert: es gibt keine zweite Plattform, nur
`leads`, `lead_outbox`, `lead_events`. AP22 bleibt Owner der
Cross-Journey-Vereinheitlichung.

### 15.6 Ehrlich offen

| ID                               | Sachverhalt                                                                                                                                                                                                                                                                               | Owner             |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `SEO-01`                         | 0 von 36 nicht-Consumer-Seiten verlinken in den Cluster. Kein Defekt der 30 Routen; Hub und Menü sind per AP21-Regel ausgeschlossen — IA-Entscheidung nötig                                                                                                                               | IA / AP24         |
| `PERF-03`                        | `spray-hero-office-single.jpeg` unbenutzt, 0 Bytes zur Laufzeit                                                                                                                                                                                                                           | Content           |
| `CO-03`                          | Kein Hintergrund-Worker — die Outbox dreht nur bei eingehenden Requests weiter. Journeyübergreifend                                                                                                                                                                                       | AP22              |
| `CO-04`                          | Keine Retention-Frist für Bestell-Leads                                                                                                                                                                                                                                                   | AP22              |
| `CO-05`                          | Der CRM-Adapter ist eine Team-Mail, kein echtes CRM — ehrlich als `consumer`-Route abgebildet                                                                                                                                                                                             | AP22              |
| `CO-06`                          | Optionale Lieferadresse — Fachfrage                                                                                                                                                                                                                                                       | Datenschutz       |
| `DU-05`                          | 2 €/Monat unbelegt, zwei CONFIRM-Flags offen                                                                                                                                                                                                                                              | Marketing         |
| `DU-06`                          | Preisschreibweise en/pt/nl                                                                                                                                                                                                                                                                | Copy-Owner        |
| `FLAKE-01`                       | Ein einzelner, **nicht reproduzierbarer** Fehlschlag in einem PT21.7-Batchlauf. Vier folgende Läufe — darunter die exakte Batch-Reihenfolge — waren 17/17 sauber. Der Testname wurde im gekürzten Batch-Report nicht erfasst; die Ursache ist damit **unbekannt** und wird nicht erfunden | AP27              |
| `MK-06`/`MK-07`, `SP-05`–`SP-09` | aus PT21.2/PT21.3 unverändert offen                                                                                                                                                                                                                                                       | siehe §9.7, §10.7 |

### 15.7 Bekannte Baselines

35 Prettier-Dateien, ein jsdom-Testfile unter Node 18
(`server/pt08-2-i18n.test.ts`, von AP21 unberührt), ein
`react-refresh`-Lintfund in `OrderModal.tsx` (identisch auf HEAD). Die
Schnittmenge mit dem AP21-Delta ist per `comm` geprüft **leer**.

### 15.8 Handoff AP22

AP22 übernimmt eine **konsumierte**, nicht erweiterte Shared Lead Foundation
mit fünf Journeys. Konkret offen und namentlich benannt: Hintergrund-Worker
(`CO-03`), Retention/Löschjob (`CO-04`), echter CRM-Adapter (`CO-05`). Nichts
davon wird als erledigt behauptet.
