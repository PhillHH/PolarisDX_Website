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
