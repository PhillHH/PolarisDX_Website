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
