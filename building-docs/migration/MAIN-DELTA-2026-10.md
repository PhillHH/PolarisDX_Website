# Main-Delta 2026-10 — `main`-Commits, die dem Relaunch fehlen (AP29 PT29.4 „letzte Content-Deltas")

> Read-only-Analyse vom 2026-10-16 im Worktree `/home/phillip/01polaris-preview`.
> Relaunch-Stand: `console/24-25-2026-09-16T09-52-24@f3ddaf0` (Linie `feat/home-leadmagnet`).
> Quelle: `main@3031841` (live auf https://polarisdx.net). Gemeinsame Basis: `f2d5da4`
> (`git merge-base HEAD main`). Gegenstand: die 16 Commits aus `git log HEAD..main`
> (`48e6235` … `3031841`, 2026-08-25 … 2026-10-07).
> Methode und Format nach `BRANCH-RECONCILIATION-MAP.md` §1–§5 und §19: **kein Merge, kein
> Cherry-Pick, keine ganze Datei, die auf beiden Linien existiert.** Übernehmbar sind nur neue
> Dateien (`IMPORT`) oder eng umrissene Hunks, gegen den Relaunch neu geschrieben (`REIMPLEMENT`).
> Kein File außer diesem wurde geändert, nichts gebaut, nichts committet.

Entscheidungsklassen: `IMPORT` (neue Datei) · `REIMPLEMENT` (Hunk gegen Relaunch) ·
`ALREADY_COVERED` (Relaunch hat Äquivalent) · `OBSOLETE` (auf `main` selbst überholt/zurückgenommen)
· `OWNER_DECISION` (kollidiert mit Relaunch-Vertrag/Decision Lock).
Risiko: **P0** = Go-live-Blocker · **P1** = vor Go-live erledigen, sonst sichtbarer Verlust ·
**P2** = Aufräumen/Nachzug.

---

## 1. Kurzfassung

| #   | Commit    | Datum      | Thema                                                           | Entscheidung                                            | Risiko      |
| --- | --------- | ---------- | --------------------------------------------------------------- | ------------------------------------------------------- | ----------- |
| M1  | `48e6235` | 2026-08-25 | Future Forum: DE-Deck-Stand, Änderungen Dr. Wessing             | `OBSOLETE`                                              | —           |
| M2  | `887c0db` | 2026-08-25 | Future Forum: nur Englisch, kanonisch `/en/`                    | `OBSOLETE`                                              | —           |
| M3  | `75aedf2` | 2026-09-02 | Future Forum: Shop-Gutschein FUTURE20 in Anmeldemail            | `OBSOLETE` (Ops-Hinweis §8)                             | —           |
| M4  | `e66a562` | 2026-09-07 | Shop-Menüpunkt (shop.polarisdx.net) + Startseiten-Ankündigung   | `OWNER_DECISION` (DEC-RL-015)                           | **P1**      |
| M5  | `ad5073e` | 2026-09-07 | Early-Access `/early`: Landingpage, `/api/early-access`, Ablage | `OWNER_DECISION` (SEC-17/OA-9)                          | **P0**      |
| M6  | `c821b38` | 2026-09-07 | Early-Access: Testadressen erhalten Willkommensmail             | `OWNER_DECISION` (folgt M5)                             | P0 (mit M5) |
| M7  | `8b273d9` | 2026-09-10 | Epigenetik: ndu Clinic als Zeile im Kontaktkapitel              | `OBSOLETE` (durch M8 ersetzt)                           | —           |
| M8  | `41e158b` | 2026-09-10 | Epigenetik: ndu Clinic als Karte (Bezugsweg Einzelpersonen)     | `REIMPLEMENT`                                           | **P1**      |
| M9  | `6908b61` | 2026-09-10 | Nachgebaute Marke, gemaltes Gerät, erfundene Zahlen entfernt    | `REIMPLEMENT` (Teile `IMPORT`, Teile `ALREADY_COVERED`) | **P0**      |
| M10 | `3847fa4` | 2026-09-21 | Future Forum: Schluss 20 Uhr, nur X-Guide, zweisprachig         | `OBSOLETE`                                              | —           |
| M11 | `8e1085b` | 2026-09-21 | Future Forum: Kartenhöhe, Nobel-Biocare-Session                 | `OBSOLETE`                                              | —           |
| M12 | `1d44f6c` | 2026-09-21 | Generische B2B-Karte („garantierte Performance") aus dem Footer | `ALREADY_COVERED`                                       | —           |
| M13 | `6166e46` | 2026-09-25 | Future Forum: Anmeldemail bestätigt Teilnahme                   | `OBSOLETE`                                              | —           |
| M14 | `40a7c72` | 2026-10-01 | Impressum: Willy-Brandt-Straße 49, 20457 Hamburg                | `REIMPLEMENT`                                           | **P0**      |
| M15 | `faa24b1` | 2026-10-07 | Footer, Datenschutz, JSON-LD: neue Hamburger Adresse            | `REIMPLEMENT` (Footer-Teil `ALREADY_COVERED`)           | **P0**      |
| M16 | `3031841` | 2026-10-07 | Future Forum entfernt; alte URL 301 → `/<lang>/events`          | `REIMPLEMENT` (nur der 301; Rest `ALREADY_COVERED`)     | **P1**      |

Zählung: `REIMPLEMENT` 5 Commits (M8, M9, M14, M15, M16; M14/M15 als ein Paket) · `IMPORT` 3 Dateien
(aus M9: `article-hero-igloopro.webp`, `og-vitd3-spray.jpg`, `brand/polarisdx-logo-white.png`) ·
`ALREADY_COVERED` 1 (M12) · `OBSOLETE` 7 (M1–M3, M7, M10, M11, M13; dazu der Future-Forum-Teil von
M16) · `OWNER_DECISION` 3 Commits / 2 Themen (M4; M5+M6).

**Live-Abgleich 2026-10-16 (nur GET/HEAD):** Produktion liefert `/de/events/future-forum-berlin-2026`
→ 301 `/de/events`, `/early` → 200, `/og-image.svg` → 301 (Datei gelöscht), Startseite verlinkt
`shop.polarisdx.net` zweimal. Preview `:9100` (Relaunch) liefert für alle drei Future-Forum-URLs
**404**, für `/early` **404**, für `/og-image.svg` **200** (die Fake-Karte).

---

## 2. Rahmen aus den Relaunch-Verträgen

- `BRANCH-RECONCILIATION-MAP.md` §2/§5: `server.ts`, `SEOHead.tsx`, `index.html`, `App.tsx`,
  `Header.tsx`, `Footer.tsx`, `structuredData.ts`, `tailwind.config.js` auf `main` sind **älter** →
  nur Hunks neu schreiben. Decision Locks: 8 (keine Garantie-Band-CTA), 9 / `DEC-RL-015` (Shop vertagt).
- `I18N-CONTRACT.md` / `DEC-RL-001`: jeder neue Schlüssel in **allen 10 Locales**, kein dauerhafter
  EN-Fallback; Epigenetik ist im Relaunch 10/10 echt übersetzt (kein `_translationStatus`-Marker) —
  `main` führt die ndu-Texte in 8 Sprachen nur englisch.
- `HOMEPAGE-CONTRACT.md` Claim Register `HCL-001`–`HCL-014`: neue Startseiten-Aussagen brauchen einen
  HCL-Eintrag.
- `ROUTING-CONTRACT.md`: Redirects ausschließlich über `src/routing/legacyRedirects.ts` → Route
  Registry → `server.ts` (`getRegistryRedirectTarget`), einstufig, Ziel muss kanonische Route sein;
  `src/routing/routeResolution.test.ts:162` pinnt derzeit **30** Redirect-Quellen. `/shop` ist
  `INTENTIONAL_404`.
- `SECURITY-CONTRACT.md` SEC-17/OA-9: `/api/early-access` läuft in Produktion „außerhalb des Repos".
  **Befund dieser Analyse:** der Code liegt seit `ad5073e` (2026-09-07) **auf `main`**
  (`server/earlyAccess.js`, `server/eventStore.js`, `server/registrations.js`,
  `public/early/index.html`, `public/early-assets/*`) — nur nicht auf der Relaunch-Linie.
- `src/lib/tracking.ts` `OUTBOUND_DOMAINS` (Allowlist): `instagram.com`, `linkedin.com`, `dx365.world`,
  `ec.europa.eu`. Neue externe Ziele (ndu Clinic, Shop) werden sonst still verworfen; `main` nutzt
  stattdessen ein freies Ereignis `epigenetics_partner`, das die Relaunch-Taxonomie nicht kennt.
- `scripts/check-color-tokens.mjs`: prüft `public/og-image.svg` und `scripts/og-image-template.html`
  gegen `PALETTE_HEX` (SC-002: Navy `#083358`, Akzent `#1b67b1`, Linie `#02a6e3`).

---

## 3. Einzelbefunde

### M1–M3, M10, M11, M13 — Future Forum Berlin (Seite, Mails, FUTURE20) → `OBSOLETE`

- **Inhalt:** Event-Seite `EventFutureForumBerlinPage.tsx`, `EventTeaserSection`, Anmeldeformular,
  `futureForum`-Block in 10 × `events.json`, Backend `/api/event-registration` mit Bestätigungs- und
  Teammail, Ablage `server/eventStore.js` (JSONL unter `/var/lib/polaris-events`), CLI
  `server/registrations.js`, Gutschein FUTURE20, OG-Bild `public/og-future-forum-berlin.jpg`,
  `SEOHead`-`singleLanguage`, `ENGLISH_ONLY_PATHS`.
- **Warum obsolet:** `3031841` entfernt Seite, Teaser, Termin, Sitemap-Eintrag und Prerender-Route auf
  `main` selbst; das Event (2026-10-02) ist vorbei. Auf `main` verbleiben nur noch tote Reste
  (`/api/event-registration` mit `EVENTS['future-forum-berlin-2026']`, `EventRegistrationForm.tsx`,
  `useEventRegistration.ts`, `og-future-forum-berlin.jpg`, `events.details_register`) — **nichts davon
  übernehmen.**
- **Relaunch:** kein Future-Forum-Artefakt (`git grep -i future.forum HEAD` außerhalb `building-docs`
  leer); `EVENTS-CONTRACT.md` verlangt ohnehin „0 eventbezogene Registration-CTAs".
- **Einzige Folge:** der 301 aus M16 (siehe dort) und die Datenschutz-/Ops-Punkte in §8.
- `BRANCH-RECONCILIATION-MAP.md` §19 A26 (`f2d5da4`, „OFFEN — nicht übernommen") ist damit
  **erledigt als OBSOLETE**; der Nachtrag sollte auf dieses Dokument verweisen.

### M4 — `e66a562` Online-Shop: Menüpunkt „Shop" + Startseiten-Ankündigung → `OWNER_DECISION` · P1

- **Inhalt:** neues `src/lib/shop.ts` (`SHOP_ORIGIN = https://shop.polarisdx.net`, `de` → Wurzel,
  alle anderen Sprachen → `/en`), Header-Eintrag als externes `<a>` mit Badge `nav.badge_new`
  (Desktop + mobil), neue `ShopTeaserSection.tsx` (Bild `igloo_front.webp`, CTAs „Zum Shop" und
  „Testkits ansehen" → `/collections/test-kits`), Block `home.shop_teaser`
  (`badge, eyebrow, title, text, cta, cta_secondary, note`) in 10 × `home.json`. Auf `main` **nicht**
  zurückgenommen, live.
- **Relaunch:** kein Shop-Link, kein Teaser; `nav.shop` und `nav.badge_new` existieren bereits 10/10
  in `common.json`. `DEC-RL-015` / Lock 9 „Shop vertagt", `RELAUNCH-BACKLOG.md` „Weder bauen noch
  reaktivieren", `/shop` = `INTENTIONAL_404`. `AP-STATE.md` PT27.3/PT23.2 führt „Shopify-Domain
  unbekannt, wird nicht erfunden" (CTC-14) — `main` belegt die Domain jetzt (`shop.polarisdx.net`).
- **Konflikt:** owner-freigegebene Live-Funktion gegen einen Relaunch-Decision-Lock aus der Zeit vor
  dem Shopify-Start. Beim Go-live verschwindet der Shop-Zugang ersatzlos.
- **Teaser-Claims** („zu Nettopreisen", „Fachkreis-Bestellportal", „Alle Preise netto zzgl. MwSt.")
  haben keinen HCL-Eintrag.
- **Falls Owner „behalten":** siehe §4 Schritt 9.

### M5 + M6 — `ad5073e`, `c821b38` Early-Access `/early` → `OWNER_DECISION` · P0 (Cutover)

- **Inhalt:** statische Landingpage `public/early/index.html` (EN, „Your Biology, In Greater
  Resolution", Formular → `POST /api/early-access`), Assets `public/early-assets/{inter.woff2,
logo.webp, logo-white.webp, mark.svg, mark-dark.svg}`, Backend `server/earlyAccess.js` (JSONL unter
  `/var/lib/polaris-early`, Warteschlange, Willkommens- und Team-Sammelmail, `EARLY_ACCESS_*`-Env,
  `/api/early-access/stats`), eigener Rate-Limiter in `server/server.js`, `docker-compose.yml`
  Bind-Mounts `/var/lib/polaris-early` und `/var/lib/polaris-events`. M6: Testadressen
  (`EARLY_ACCESS_TEST_ADDRESSES`) mit 60-s-Sperre. M9 ändert zusätzlich die Mail-Kopfzeile auf
  `public/brand/polarisdx-logo-white.png`.
- **Produktion heute:** Host-nginx `sites-enabled/polarisdx.net` liefert `/early` und
  `/<lang>/early` (11 Locations) per `alias /home/phillip/01polaris/public/early/index.html`,
  `/early-assets/` per `alias /home/phillip/01polaris/public/early-assets/`, proxied
  `/api/early-access` → `127.0.0.1:5000`, sperrt `/stats`.
- **Relaunch:** Backend kennt `/api/early-access` nicht (Routen: `epigenetics-inquiry`,
  `content-download`, `contact`, `support`, `consumer-order`, `roi-report`, `practice-order`;
  Unbekanntes → `404 {accepted:false, code:'NOT_FOUND'}`); `public/early*` fehlt;
  `docker-compose.yml` hält Port 5000 nur „solange der nginx-Eintrag existiert" (Kommentar M-09/DD-15).
- **Folge beim Cutover:** (a) wird `/home/phillip/01polaris` auf den Relaunch-Stand gebracht,
  fehlen die nginx-Alias-Ziele → `/early` 404; (b) das Formular bekommt vom Relaunch-Backend 404 →
  jede Anmeldung schlägt fehl; (c) bereits zugestellte Willkommensmails verlinken das Logo unter
  `https://polarisdx.net/brand/polarisdx-logo-white.png` (Relaunch-Preview: 301 → `/de/brand/…`
  → HTML).
- **Nutzungsindiz:** `/var/log/nginx/early.log` ist seit 2026-09-15 leer; letzte rotierte Datei
  `early.log.1` vom 2026-09-14 (Podcast-Kampagne 05./06.09.). Anmeldedaten liegen in
  `/var/lib/polaris-early/signups.jsonl` (personenbezogen, nicht im Repo).
- **Optionen für den Owner:**
  - **A — Stilllegen (empfohlen bei fehlender Nutzung):** nginx-Locations `/early*` auf 301
    `/<lang>/` oder 410 umstellen, `/api/early-access*` aus nginx entfernen, Port-5000-Publikation
    in `docker-compose.yml` streichen (laut Kommentar), SEC-17/OA-9 als „stillgelegt" schließen,
    Aufbewahrung/Löschung der Signups festlegen. Nur `public/brand/polarisdx-logo-white.png`
    importieren (bereits versandte Mails).
  - **B — Weiterbetreiben:** `public/early/**` + `public/early-assets/**` als neue Dateien
    `IMPORT` (Hamburger Adresse im Footer der Seite dabei auf Willy-Brandt-Straße korrigieren —
    `main` hat sie dort **nicht** nachgezogen), `server/earlyAccess.js` gegen das Relaunch-Backend
    `REIMPLEMENT` (Lead-Foundation/Persist-before-send, `SECURITY-CONTRACT.md` §6.2-Prüfung,
    Test-Suite aus `server/server.test.js` von `main` portieren), Bind-Mount
    `/var/lib/polaris-early` in Relaunch-Compose, `EARLY_ACCESS_*` in `server/.env`, nginx
    unverändert.

### M7 — `8b273d9` ndu Clinic als Zeile → `OBSOLETE`

Durch M8 vollständig ersetzt (Schlüssel `partnerLabel/partnerName/partnerPerson` gelöscht).

### M8 — `41e158b` ndu Clinic als Karte im Epigenetik-Kontaktkapitel → `REIMPLEMENT` · P1

- **Inhalt (Endstand `main`):** in `/epigenetics` direkt nach den Kontaktknöpfen eine Karte
  „Test machen lassen / ndu Clinic · London" mit Text, Adresse „22 Harley Street, London W1G 9PL ·
  Dr. Goran D. Stojanovic" und Umrissknopf „Zur ndu Clinic" → `https://www.nduclinic.com/`
  (`target=_blank`, `rel=noopener noreferrer`, `ArrowUpRight`); darunter unverändert der
  abgestimmte Rechts-/Laborhinweis. Neue Schlüssel `epigenetics.contact.partnerCaption`,
  `partnerTitle`, `partnerText`, `partnerMeta`, `partnerCta` in 10 Locales (**de/en echt, 8 nur
  englisch**). Tracking `trackEvent('epigenetics_partner', {practice, source})`.
- **Relaunch:** `public/locales/*/epigenetics.json` `contact` endet bei `lab`; keine Karte in
  `src/pages/EpigeneticsPage.tsx`.
- **Vertragsreibung (bekannt, auf `main` vom Owner so freigegeben):** `contact.sub` sagt
  „ausschließlich an Fachanwenderinnen und Fachanwender", die Karte adressiert Einzelpersonen;
  `EPIGENETICS-CONTRACT.md` Shell `B2B`, Zeile „Laboratory partner — No external laboratory partner is
  named" (ndu ist Anwenderpraxis, kein Labor → kein Verstoß, aber Vertrag muss die Praxis nennen).
- **Edits:** siehe §4 Schritt 6.

### M9 — `6908b61` Nachgebaute Marke, gemaltes Gerät, erfundene Zahlen → `REIMPLEMENT` · P0

Auslöser auf `main`: Telegram-Vorschau beim Kunden zeigte die selbstgezeichnete IglooPro-Karte mit
erfundenem Messwert „45.2 ng/mL Vitamin D". Aufgeteilt nach Teilbefund:

| Teil | Inhalt `main`                                                                                                                | Relaunch-Stand (Beleg)                                                                                                                                                                                                                                                                                                                                                                                                                                           | Entscheidung                                      | Risiko |
| ---- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------ |
| 9a   | `public/og-image.jpg` neu aus echtem Logo + `Igloo-pro-frontal.png`                                                          | **Fake-Karte aktiv** (Blob `7adae6f`, in AP34 `cfa7070` sogar neu gerendert): getippte Wortmarke „PolarisDX", gezeichnetes Gerät, „45.2 ng/mL Vitamin D", „INSERT TEST CASSETTE". Standard-`og:image` jeder Seite ohne eigenes Bild (Startseite, Artikel, …), `index.html`, `SEOHead` `DEFAULT_OG_IMAGE`                                                                                                                                                         | `REIMPLEMENT` (neu rendern in SC-002-Palette)     | **P0** |
| 9b   | `public/og-image.svg` gelöscht                                                                                               | vorhanden, Preview liefert 200; enthält `45.2` / `ng/mL Vitamin D` (Zeilen 114–118)                                                                                                                                                                                                                                                                                                                                                                              | `REIMPLEMENT` (löschen)                           | **P0** |
| 9c   | Generator `scripts/make-og-cards.mjs` (neu), alter Generator gelöscht                                                        | `scripts/convert-og-image.mjs` + `scripts/og-image-template.html` (erzeugen die Fake-Karte), Guard scannt das Template                                                                                                                                                                                                                                                                                                                                           | `REIMPLEMENT` (neue Datei, aber Farben anpassen)  | P0     |
| 9d   | `public/og-vitd3-spray.jpg` mit echtem Logo statt getipptem „POLARISDX"                                                      | Relaunch-Blob `47864bd` = `main`-Vorstand (unverändert seit Abzweig) → getippte Wortmarke                                                                                                                                                                                                                                                                                                                                                                        | `IMPORT` (Binärersatz, kein Relaunch-Verlust)     | P1     |
| 9e   | `og-consumer-{duo,spray,mask}.jpg` + `ogImage` auf Consumer-Seiten                                                           | Consumer-Seiten setzen bereits eigenes `ogImage` = Hero-Foto (`DuoPage.tsx:97`, `SprayPage.tsx:191`, `MaskPage.tsx:164`)                                                                                                                                                                                                                                                                                                                                         | `ALREADY_COVERED`                                 | —      |
| 9f   | Startseiten-Hero `hero_doctor.webp` (KI-Ärztin, Fantasiegerät) → Produktrender                                               | AP34-Hero ist echtes Bühnenfoto (`src/assets/home/hero-*`), `hero_doctor.webp` nirgends importiert (nur `scripts/optimize-images.mjs:32`); `email/assets/hero_doctor.png` unreferenziert                                                                                                                                                                                                                                                                         | `ALREADY_COVERED` (+ Aufräumen P2)                | P2     |
| 9g   | Artikel „Ecosystem of Rapid Tests": `Testbild1.*` (Fake-„DX"-Marke, Wasserzeichen) → `article-hero-igloopro.webp` (1600×600) | `src/data/articles.ts:55` nutzt `Testbild1.png`; gerendert in `/articles`-Index, Artikel-Hero, verwandten Artikeln, JSON-LD `image`                                                                                                                                                                                                                                                                                                                              | `IMPORT` (Asset) + `REIMPLEMENT` (Verweise)       | **P0** |
| 9h   | Artikel „Die grüne Praxis": `green.*` (verformter IglooPro-Nachbau) entfernt, Artikel bildlos                                | `src/data/articles.ts:20` nutzt `green.png` (+ AVIF/WebP-Varianten)                                                                                                                                                                                                                                                                                                                                                                                              | `REIMPLEMENT`                                     | **P0** |
| 9i   | `above_the_fold.*` (Wasserzeichen, „Vitamin D3 / 36 / Optimal") gelöscht                                                     | Dateien vorhanden, in `articleImages.ts` importiert/exportiert, von keinem Artikel genutzt                                                                                                                                                                                                                                                                                                                                                                       | `REIMPLEMENT` (löschen)                           | P1     |
| 9j   | Bildlose Artikelkarte statt grauem Kasten                                                                                    | Relaunch rendert bildlose Records bereits mit Kategorie-Icon (`ARTICLES-CONTRACT.md` Index/Body)                                                                                                                                                                                                                                                                                                                                                                 | `ALREADY_COVERED`                                 | —      |
| 9k   | `ArticlePage` og:image aus totem Dateinamen                                                                                  | Relaunch: kein Artikel-`ogImage` (→ Default-Karte, wird mit 9a korrekt), JSON-LD `image` über Vite-Import                                                                                                                                                                                                                                                                                                                                                        | `ALREADY_COVERED`                                 | —      |
| 9l   | Startseite „4.9 Gesamtbewertung / 250+ Rezensionen", „100 % positiv"; Locale-Schlüssel entfernt                              | UI entfernt (PT11.2, `TestimonialsSection.tsx:11`), **Strings aber noch in 10 Locales** und öffentlich unter `/locales/*/…json` abrufbar: `home.testimonials.ratingLabel`, `.positiveLabel`, `.stats.{ratingValue,ratingLabel,positiveValue,positiveLabel,reviewsValue,reviewsLabel}` (de: `4.9`, `100 %`, `250+`), `common.testimonials.positiveLabel`, `contact.contact.trust.{rating,reviews}` (de: `4,9`, `250+ Praxis-Bewertungen`) — kein Code-Verbraucher | `REIMPLEMENT` (Schlüssel löschen, 10 Locales)     | P1     |
| 9m   | `aggregateRating` aus Produkt-JSON-LD, `reviewRating` nur bei echter Bewertung                                               | Relaunch-`structuredData.ts` hat weder `aggregateRating` noch `review*`                                                                                                                                                                                                                                                                                                                                                                                          | `ALREADY_COVERED`                                 | —      |
| 9n   | `scripts/i18n/update_home.py` ohne Rating-Einträge                                                                           | Relaunch-Version enthält 12 Treffer `rating`/`positive`                                                                                                                                                                                                                                                                                                                                                                                                          | `REIMPLEMENT` (Einträge raus oder Skript löschen) | P2     |
| 9o   | `public/brand/polarisdx-logo-white.png` (stabile Logo-URL für Mails)                                                         | fehlt; Preview 301 → HTML                                                                                                                                                                                                                                                                                                                                                                                                                                        | `IMPORT`                                          | P2     |
| 9p   | `server/earlyAccess.js` Mail-Kopf                                                                                            | siehe M5                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `OWNER_DECISION` (mit M5)                         | —      |

**Nicht Teil der „erfundenen Zahlen":** „15+ Länder / 100+ Geräte" (`about.json` 10/10, Stats
`2 Standorte / 15+ Länder / 100+ Reader / < 24 h`) entfernt `6908b61` **nicht**; `main` verwendet sie
weiter (`AboutPage.tsx:19` Meta-Description „100+ Geräte in 15+ Ländern", `vitd3spray.json`
„Über 100 Praxen in 15+ Ländern"). `CORPORATE-CONTACT-LEGAL-CONTRACT.md` §3 führt sie als
freigegebenen Bestand → **kein Delta**. Ebenfalls bewusst unverändert auf `main`: Testimonial
Dr. Fischer, CEO-Platzhalter auf `/about`, Sterne an Einzelzitaten (Relaunch hat Rating-UI ohnehin
entfernt).

### M12 — `1d44f6c` Generische B2B-Karte aus dem Footer → `ALREADY_COVERED`

`main` nimmt `<CtaSection />` („Sie suchen nach garantierter Performance und POC-Expertise?") aus
`Footer.tsx`. Relaunch hatte die Karte nie: kein `CtaSection.tsx`, kein `cta_section` in
`common.json`, Decision Lock 8, `BRANCH-RECONCILIATION-MAP.md` N5/N6. Abschlüsse laufen über
`FinalCtaSection` je Seite. Nichts zu tun.

### M14 + M15 — `40a7c72`, `faa24b1` Hamburger Adresse → `REIMPLEMENT` · P0

- **Inhalt `main`:** „Große Bleichen 1 - 3, 20354/20097 Hamburg" → „Willy-Brandt-Straße 49,
  20457 Hamburg" in Impressum (Firmensitz + redaktionell Verantwortlicher), Datenschutz
  (Verantwortliche Stelle) 10 Locales, `Footer.tsx`, `structuredData.ts` (`medicalBusinessSchema`,
  `organizationSchema`, `localBusinessSchema` inkl. Geo 53.5469 / 9.9961).
- **Relaunch (alt, 42 Strings + 2 Code-Stellen):**
  - `public/locales/de/legal.json`: `imprint.section1.hamburg.address[0..1]`,
    `imprint.section5.content[1..2]`, `privacy.section3.responsible.address[1..2]` (6 Strings; PLZ
    teils `20354`, teils `20097`).
  - `public/locales/{en,fr,it,es,pt,nl,pl,cs,da}/legal.json`: je
    `imprint.section1.hamburg.address[0..1]` und `privacy.section3.responsible.address[1..2]`
    (4 Strings, PLZ `20097` mit lokalisiertem Ortsnamen: Hambourg, Amburgo, Hamburgo, Hamburk,
    Hamborg, sonst Hamburg).
  - `src/components/seo/structuredData.ts:135–137` `organizationSchema.address`
    (`Große Bleichen 1–3`, `20354`). Relaunch hat keine `medical/localBusinessSchema` → Geo entfällt.
  - `src/pages/ContactPage.tsx:47` Standortkarte Hamburg (`'Große Bleichen 1 – 3', '20354 Hamburg'`)
    — auf `main` nicht betroffen (andere Seite), im Relaunch sichtbar.
  - Footer zeigt im Relaunch nur Städtenamen (`footer.hamburg` = „Hamburg") → `ALREADY_COVERED`.
- **Weitere Fundstellen, die auch `main` nicht geändert hat:** 60 × `src/content/befunde/*.json`
  (Musterbefund-Rubrik „Vertrieb"; auf `main` 12 Dateien de/en), `email/vitamin-d3-k2-spray.html:410`,
  `docs/global-fixes.md`, `public/early/index.html` + `server/earlyAccess.js` (nur `main`).
  Musterbefunde spiegeln PDF-Dokumente → siehe §5 O4.
- Keine Test-/Guard-Pins auf die alte Adresse (`grep` in `src`, `e2e`, `server` leer).
- **Edits:** siehe §4 Schritt 1.

### M16 — `3031841` Future Forum entfernt, 301 → `/<lang>/events` → `REIMPLEMENT` (nur 301) · P1

- **Inhalt `main`:** Entfernung aller Future-Forum-Teile (Relaunch hat keine → `ALREADY_COVERED`)
  plus `server.ts`-Middleware: `/events/future-forum-berlin-2026` → 301 `/de/events`,
  `/<lang>/events/future-forum-berlin-2026` → 301 `/<lang>/events`, Query bleibt.
- **Warum nötig:** URL stand in Einladungen, Sitemap (10 Sprachen nach `3847fa4`) und war ab
  2026-08-24 indexierbar; Relaunch antwortet heute 404 (Preview gemessen).
- **Relaunch-konforme Umsetzung:** nicht als Sonderfall in `server.ts`, sondern als Eintrag in
  `src/routing/legacyRedirects.ts` → wirkt über `getRegistryRedirectTarget` für alle Locales und
  ohne Präfix (`langPrefix || DEFAULT_LANGUAGE`), einstufig, Query erhalten. Ziel `/events` ist
  `INDEX_FOLLOW` x10.
- **Edits:** siehe §4 Schritt 4.

---

## 4. Geordnete Umsetzungsliste (IMPORT / REIMPLEMENT)

Reihenfolge nach Risiko, dann nach Abhängigkeit. Jeder Schritt ein eigener Commit gegen den
Relaunch; nichts per `git checkout main -- …` außer den ausdrücklich als `IMPORT` markierten,
auf dem Relaunch **nicht existierenden** Dateien.

1. **Adresse Hamburg (M14/M15, P0)**
   - 10 × `public/locales/<l>/legal.json`: `"Große Bleichen 1 - 3"` → `"Willy-Brandt-Straße 49"`;
     `"20354 Hamburg"` / `"20097 <Ort>"` → `"20457 <Ort>"` (Ortsname je Locale beibehalten) an den
     in §3 M14/M15 genannten Pfaden — de 6 Strings, übrige 9 Locales je 4 (Summe 42).
   - `src/components/seo/structuredData.ts` `organizationSchema.address`:
     `streetAddress: 'Willy-Brandt-Straße 49'`, `postalCode: '20457'`.
   - `src/pages/ContactPage.tsx` Location `hamburg.lines`: `'Willy-Brandt-Straße 49'`,
     `'20457 Hamburg'`.
   - `email/vitamin-d3-k2-spray.html:410` gleich ziehen (P2, gleicher Commit sinnvoll).
   - `CORPORATE-CONTACT-LEGAL-CONTRACT.md` §3 „Unternehmen/Standorte" auf neue Adresse; Legal-Freigabe
     für PT29.4 Punkt 4 vermerken.
   - Gate: `check:i18n` (G4), `structuredData.test.ts`, Legal-E2E x10.
2. **Fake-Share-Karte ersetzen (M9 9a–9c, P0)**
   - `scripts/make-og-cards.mjs` als **neue** Datei nach `main`-Vorlage anlegen, aber Farben auf
     SC-002 (`#083358`, `#0d527f`, Linie `#1b67b1`→`#02a6e3`; kein Teal `#0d9488/#0f766e/#f0fdfa`,
     kein `#38bdf8/#06223c/#040a18/#0b193c` außerhalb `PALETTE_HEX`), Logo `polaris_white.webp`,
     Gerät `Igloo-pro-frontal.png`, Texte nur aus dem Claim Register (`HCL-002` CV < 2 %,
     `HCL-004` Ergebnis in Minuten; „Laborpräzise"/„Perfekt" nicht ungeprüft übernehmen);
     Consumer-Karten weglassen (9e covered).
   - `public/og-image.jpg` neu rendern (1200×630, Größe/Typ für `e2e/seo-head.spec.ts:40` und
     `home-faq-seo-integration.spec.ts:88` unverändert).
   - Löschen: `public/og-image.svg`, `scripts/convert-og-image.mjs`, `scripts/og-image-template.html`.
   - `scripts/check-color-tokens.mjs`: Dateiliste — `public/og-image.svg` und Template raus,
     `scripts/make-og-cards.mjs` rein; Kopfkommentar anpassen.
   - `DESIGN-SYSTEM-CHANGELOG.md`/`SEO-CONTRACT.md`: Share-Karte = echtes Logo + echter Produktrender.
3. **Fake-Artikelbilder entfernen (M9 9g–9i, P0)**
   - `IMPORT` `src/assets/article-hero-igloopro.webp` (neu, 1600×600) und mit
     `scripts/build-article-images.mjs` responsive AVIF/WebP-Varianten erzeugen (Eintrag
     `{ base: 'article-hero-igloopro', … }` statt `Testbild1`/`green`).
   - `src/data/articles.ts`: `ecosystem_of_rapid_tests` → `image: 'article-hero-igloopro.png'`
     (Schlüsselkonvention `.png` beibehalten); `green_practice` → `sections: [{ paragraphs: [] }]`
     ohne `image`.
   - `src/assets/articleImages.ts`: Imports/Map-Einträge/Exporte für `green*`, `Testbild1*`,
     `above_the_fold*` entfernen, `article-hero-igloopro` mit gemessenen Maßen ergänzen.
   - Dateien löschen: `src/assets/{green,Testbild1,above_the_fold}.{png,webp}` und alle
     `green-*`/`Testbild1-*`-Varianten.
   - Tests/Verträge: `src/data/articles.test.ts:116` `toHaveLength(4)` → 3, Liste bildloser Artikel
     um `green_practice` ergänzen; `scripts/check-article-images.mjs`, `e2e/articles-*.spec.ts`
     prüfen; `ARTICLES-CONTRACT.md` Tabelle (Zeile 30 `Testbild1.png`) und „Four … images" → three,
     „two image-free records" → three.
4. **301 Future Forum (M16, P1)**
   - `src/routing/legacyRedirects.ts`: neuer Eintrag
     `{ sourcePath: '/events/future-forum-berlin-2026', targetPath: '/events', evidence: 'RETIRED_EVENT' }`
     (Evidenztyp im Union-Typ ergänzen; alternativ `PRIMARY_ALIAS`, falls kein neuer Typ gewünscht).
   - `src/routing/routeResolution.test.ts:162` `toHaveLength(30)` → 31; `e2e/url-smoke.spec.ts`
     Fall `/en/events/future-forum-berlin-2026?x=1` → 301 `/en/events?x=1` und präfixlos → `/de/events`.
   - `ROUTING-CONTRACT.md` Redirect-Map (+1 Zeile, „30 redirects" → 31), Owner AP29 PT29.2.
5. **Rating-Strings löschen (M9 9l, 9n, P1)**
   - 10 × `home.json`: `testimonials.ratingLabel`, `testimonials.positiveLabel`, ganzer Block
     `testimonials.stats`.
   - 10 × `common.json`: Block `testimonials` (enthält nur `positiveLabel`).
   - 10 × `contact.json`: `contact.trust.rating`, `contact.trust.reviews` (ganzer `trust`-Block ist
     ohne Verbraucher; `trust.direct` mitnehmen oder als tot vermerken).
   - `scripts/i18n/update_home.py`: Rating-Einträge entfernen (oder Skript als Altlast löschen,
     Relaunch nutzt `sync-home-from-de.mjs`).
   - Gate: `check:i18n` G4 (Parität bleibt, da in allen 10 gelöscht), `TrustProof.test.tsx`.
6. **ndu Clinic (M8, P1)**
   - 10 × `public/locales/<l>/epigenetics.json`, Block `contact` nach `lab`: `partnerCaption`,
     `partnerTitle`, `partnerText`, `partnerMeta`, `partnerCta`. de/en wörtlich von `main`;
     fr/it/es/pt/nl/pl/cs/da **neu übersetzen** (auf `main` nur Englisch; Relaunch-Epigenetik ist
     10/10 übersetzt, `DEC-RL-001`). `partnerTitle`/`partnerMeta` sind Eigennamen/Adresse und bleiben
     gleich.
   - `src/pages/EpigeneticsPage.tsx`: Karte nach den Kontakt-CTAs, vor dem Rechtshinweis, mit
     Relaunch-Tokens/Button-Variante (Umriss/sekundär, nicht primär), `target="_blank"`,
     `rel="noopener noreferrer"`, sichtbarer Hinweis auf neuen Tab (Icon + `sr-only`), 44-px-Ziel.
   - Tracking **nicht** `epigenetics_partner`: stattdessen `nduclinic.com` in
     `src/lib/tracking.ts` `OUTBOUND_DOMAINS` aufnehmen (zählt dann automatisch über
     `useOutboundTracking`); `trackingTaxonomy.test.ts` ergänzen.
   - `EPIGENETICS-CONTRACT.md`: Anwenderpraxis ndu Clinic als einziger externer Bezugsweg für
     Einzelpersonen; Claim-Guard `scripts/check-epigenetics-claim-contract.mjs` gegen neue Texte
     laufen lassen.
7. **`og-vitd3-spray.jpg` (M9 9d, P1)** — Binärersatz durch die `main`-Datei (Relaunch-Blob ist
   identisch mit dem `main`-Vorstand, daher kein Verlust); optional mit dem neuen Generator aus
   Schritt 2 erzeugen, dann Akzent `#38bdf8` → Palette.
8. **Aufräumen (M9 9f, 9o, P2)**
   - `IMPORT` `public/brand/polarisdx-logo-white.png` (stabile URL aus bereits versandten Mails;
     unabhängig von der Early-Access-Entscheidung).
   - `src/assets/hero_doctor.webp`, `email/assets/hero_doctor.png` löschen; Muster in
     `scripts/optimize-images.mjs:32` entfernen.
9. **Nur falls Owner bei M4 „Shop behalten" entscheidet (P1)** — _entschieden und umgesetzt
   (2026-10-16, `f7b5db3`); abweichend schmales Band ohne Bild und ohne „Testkits ansehen"_
   - `IMPORT` `src/lib/shop.ts` (Kommentar zu FUTURE20 streichen).
   - `src/components/layout/Header.tsx`: externer Nav-Eintrag `nav.shop` + Badge `nav.badge_new`
     (Schlüssel existieren 10/10) im Relaunch-Header-Muster neu schreiben (Navy-Kopfzeile AP34,
     44-px-Ziele, Fokusringe), Desktop + mobil.
   - Neu `src/components/sections/ShopTeaserSection.tsx` im Relaunch-Design + Block
     `home.shop_teaser` (7 Schlüssel) in 10 × `home.json` (Übersetzungen liegen auf `main` 10/10 vor).
   - `HOMEPAGE-CONTRACT.md`: Position in der Sektionsfolge + HCL-015 ff. für „Nettopreise /
     Fachkreis-Bestellportal"; `DECISIONS.md` `DEC-RL-015` ändern; `RELAUNCH-BACKLOG.md`;
     `OUTBOUND_DOMAINS` + `shop.polarisdx.net` (schließt CTC-14); `/shop` bleibt `INTENTIONAL_404`.
10. **Nur falls Owner bei M5 „Early-Access weiterbetreiben" entscheidet (P0 zum Cutover)** — Option B
    aus §3 M5. _Entfällt: Owner hat am 2026-10-16 Option A gewählt._

---

## 5. Owner-Entscheidungen

**Entschieden am 2026-10-16:** Der Owner hat alle Empfehlungen dieser Tabelle angenommen („Alle ja",
`SCOPE-CHANGELOG.md` SC-004). Code-Umsetzung `f7b5db3` (Preview-Release `f7b5db3e2433`), Produktion
unverändert.

| ID  | Thema                                   | Frage                                                                                                                                     | Empfehlung                                                                                                | Frist                | Entscheidung 2026-10-16                                                                                                                                                                                                                                                                                                       |
| --- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| O1  | Shop (M4)                               | Shop-Menüpunkt + Startseiten-Ankündigung im Relaunch behalten? Dann `DEC-RL-015` aufheben, HCL-Einträge freigeben.                        | Behalten (live, owner-freigegeben, Verkauf läuft über Shopify) — sonst sichtbarer Rückbau am Go-live-Tag  | vor PT29.4-Freeze    | **Behalten — umgesetzt.** Kopfzeilen-Eintrag „Shop" (externer Link, „Neu" nur mobil), schmales Band `ShopTeaserSection` nach den Säulen (ohne Bild und zweiten Knopf, HTML-Budget), `HCL-015`, `DEC-RL-015` geändert, `shop.polarisdx.net` in `OUTBOUND_DOMAINS` (CTC-14 geschlossen)                                         |
| O2  | Early-Access `/early` (M5/M6)           | Stilllegen (Option A) oder in den Relaunch portieren (Option B)? Aufbewahrung/Löschung der Signups?                                       | A: seit 2026-09-15 kein Zugriff im `early.log`; Kampagne beendet                                          | vor Cutover (P0)     | **A — stilllegen.** `/early` ist `INTENTIONAL_404` (nicht 301 auf die Startseite, Routing-Vertrag). nginx-Rückbau beim Cutover **offen** (Operator, `docs/deploy.md` §3). Signups und Event-Daten bleiben auf dem Host; Aufbewahrung/Löschung **offen** (Owner/DSB, Vorschlag: nach Export löschen)                           |
| O3  | ndu Clinic (M8)                         | Bestätigen, dass die Karte für Einzelpersonen neben „ausschließlich an Fachanwender" stehen darf; Übersetzungen 8 Sprachen.               | Umsetzen wie auf `main`, Vertrag nachziehen                                                               | vor PT29.4           | **Bestätigt — umgesetzt.** Karte im Kontaktkapitel, Umrissknopf, neuer Tab, 10 Sprachen (8 neu übersetzt), `nduclinic.com` in `OUTBOUND_DOMAINS`; EPIGENETICS-CONTRACT nennt die Anwenderpraxis                                                                                                                               |
| O4  | Adresse in Musterbefunden + PDFs (M15+) | Sollen die 60 Musterbefund-JSONs („Vertrieb") und die zugehörigen PDF-Downloads die neue Adresse tragen? (`main` hat sie nicht geändert.) | Ja, gemeinsam mit neuen PDF-Ständen (PT29.4 Punkt 6 Checksums); sonst bewusst als Dokumentstand vermerken | P2, vor Asset-Freeze | **Ja.** 60 JSONs: Willy-Brandt-Straße 49, 20457 Hamburg, eine Telefonnummer `+49 151 75011699`. **Offen:** PDFs `public/downloads/epigenetics/{de,en}/*.pdf` und `storage/protected/epigenetics/PolarisDX_Musterbefunde_DE.zip` tragen noch den alten Stand (extern erzeugt, keine Quelle im Repo) → neue Fassungen vom Owner |
| O5  | Share-Karten-Text (M9 9a)               | Text der neuen Standardkarte nur aus Claim Register oder `main`-Wortlaut („Laborpräzise Diagnostik in 3–15 Minuten")?                     | Claim-Register-Wortlaut                                                                                   | mit Schritt 2        | **Claim-Register-Wortlaut — erledigt** (`a7ff705`, `scripts/make-og-card.mjs`)                                                                                                                                                                                                                                                |

Weitere am selben Tag angenommene Punkte aus `release/AP30-RC1.md` §5: eine Telefonnummer
site-weit, Impressum „§ 5 DDG", Bereichsleiste/„Nächster Schritt" auf Diagnostik/Service/IglooPro,
RPO 24 h / RTO 30 min, AP34-Abnahme. Titel/Description-Deltas gegen Search Console (Crawl F3) sind
angenommen, brauchen aber GSC-Zugang → Operator/Owner nach dem Go-live.

---

## 6. Auswirkungen auf Verträge, Tests, Guards

| Datei                                                                | Änderung                                                           | Schritt |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| `building-docs/CORPORATE-CONTACT-LEGAL-CONTRACT.md` §3               | neue Hamburger Adresse                                             | 1       |
| `scripts/check-color-tokens.mjs`                                     | Dateiliste OG-Quellen                                              | 2       |
| `building-docs/SEO-CONTRACT.md`, `DESIGN-SYSTEM-CHANGELOG.md`        | Share-Karte aus echten Assets                                      | 2       |
| `src/data/articles.test.ts:116`, `ARTICLES-CONTRACT.md`              | 4 → 3 Artikelbilder, 3 bildlose Records                            | 3       |
| `src/routing/routeResolution.test.ts:162`, `ROUTING-CONTRACT.md`     | 30 → 31 Redirects                                                  | 4       |
| `src/lib/tracking.ts` `OUTBOUND_DOMAINS`, `trackingTaxonomy.test.ts` | `nduclinic.com` (+ ggf. `shop.polarisdx.net`)                      | 6 / 9   |
| `building-docs/EPIGENETICS-CONTRACT.md`                              | ndu Clinic als Bezugsweg                                           | 6       |
| `building-docs/HOMEPAGE-CONTRACT.md`, `DECISIONS.md`                 | nur bei O1 = behalten                                              | 9       |
| `building-docs/SECURITY-CONTRACT.md` SEC-17/OA-9                     | Quelle liegt auf `main@ad5073e…3031841`; Ergebnis von O2 eintragen | O2      |
| `docker-compose.yml` (Port 5000-Kommentar)                           | bei O2 = A Port-Publikation streichen                              | O2      |
| `BRANCH-RECONCILIATION-MAP.md` §19 A26                               | Status „OBSOLETE, siehe MAIN-DELTA-2026-10.md"                     | —       |

---

## 7. Ops- und Datenschutz-Hinweise (außerhalb des Repos)

- **Event-Anmeldungen Future Forum:** personenbezogene JSONL unter `/var/lib/polaris-events`
  (Bind-Mount nur in `main`-Compose). Relaunch-Backend mountet das Verzeichnis nicht; Daten bleiben
  auf dem Host. Löschfrist nach Veranstaltung festlegen.
- **Early-Access-Signups:** `/var/lib/polaris-early/signups.jsonl`, `welcomed.log` — siehe O2.
- **FUTURE20:** Rabattcode lebt im Shopify-Backend, nicht im Repo; ggf. dort deaktivieren.
- **nginx-Aliase** zeigen fest auf `/home/phillip/01polaris/public/early*` (Checkout von `main`).
  Jeder Cutover, der dieses Verzeichnis auf den Relaunch-Stand bringt, muss O2 vorher umgesetzt haben.
- **`/api/early-access/stats`** ist in nginx gesperrt (live 403); bei Option A die gesamte
  `/api/early-access*`-Location entfernen, bei Option B behalten.
