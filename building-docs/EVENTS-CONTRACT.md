# EVENTS-CONTRACT — AP18 Event truth

Kanonischer Integrations- und Evidenzvertrag für die bestehende `/events`-Strecke. Die operative
Eventdaten-SSOT bleibt `src/data/events.ts`; dieses Dokument spiegelt Inventar und Regeln, führt
aber keine zweite ausführbare Eventliste ein.

## Stand

- Task: **AP18-CLOSURE — unabhängige Reverification**
- Repository: `/home/phillip/01polaris-preview`
- Branch: `console/10-15-2026-08-28T08-18-27`
- HEAD-Basis: `8a142173a5e2f89de09af2e76a1ce28ea243782e`
- Evidence date: `2026-09-01`
- Predecessor: **AP17-CLOSURE PASS / AP17 COMPLETE**
- Decision Locks: **18/18 LOCKED**

## Operative Quellen und Identität

- Stammdaten: `src/data/events.ts`
- lokalisierte aktuelle Copy: `public/locales/<locale>/events.json` → `items.<id>`
- lokalisierte Historien-Copy: `public/locales/<locale>/events.json` → `past_items.<id>`
- Eventseite: `src/pages/EventsPage.tsx`
- IDs bleiben stabil und sind weiterhin zugleich i18n-Keys.
- Es gibt nur die Registry-Route `/events`; PT18.1 erzeugt keine Eventdetailroute.

## Gemessenes aktuelles Inventar

| ID                             | Start      | Ende inkl. | Ort        | Partner       | Link | Status am 2026-09-01 |
| ------------------------------ | ---------- | ---------- | ---------- | ------------- | ---- | -------------------- |
| `dentale_themenwelt`           | 2026-06-12 | 2026-06-13 | Stuttgart  | Nobel Biocare | –    | past                 |
| `dgi_summer_event`             | 2026-06-12 | 2026-06-13 | Düsseldorf | Nobel Biocare | –    | past                 |
| `nobel_biocare_dach_symposium` | 2026-06-18 | 2026-06-20 | München    | Nobel Biocare | –    | past                 |
| `kite_education`               | 2026-08-01 | 2026-09-04 | Sylt       | –             | –    | ongoing              |
| `dgi_jahreskongress`           | 2026-11-27 | 2026-11-28 | Hamburg    | Nobel Biocare | –    | upcoming             |

Es existieren keine realen Uhrzeiten, Zeitzonenfelder oder externen Eventlinks. Deshalb gilt für
den gesamten aktuellen Bestand bewusst `DATE_ONLY_ALL_DAY`; PT18.1 erfindet keine Uhrzeit und keine
Registrierungs-URL.

## Gemessenes historisches Inventar

| ID                       | Monat (0-basiert) | Jahr | Ort        |
| ------------------------ | ----------------: | ---: | ---------- |
| `ids_cologne`            |                10 | 2025 | Köln       |
| `dgi_kongress_frankfurt` |                 8 | 2025 | Frankfurt  |
| `dental_summer`          |                 5 | 2025 | Timmendorf |
| `ids_innovation`         |                 2 | 2025 | Köln       |

Aktuelle und historische IDs überschneiden sich im gemessenen Produktivbestand nicht. Die
PT18.3-Archivprojektion dedupliziert trotzdem strikt über stabile IDs und ist damit auch für den
späteren automatischen Übergang eines bereits historisch erfassten Events sicher.

## Datenmodell und Validierung

`EventEntry` besitzt `id`, `date`, optional `endDate`, den diskriminierenden
`dateSemantics = DATE_ONLY_ALL_DAY`, `location`, optional `partner` und optional `link`.
`PastEventEntry` besitzt `id`, 0-basierten `month`, `year` und `location`.

Der beim Modulimport aktive Guard `validateEventInventory` bricht hart ab bei:

- leerer oder doppelter ID;
- nicht strengem oder unmöglichem `YYYY-MM-DD`;
- `endDate < date`;
- unbekannter Date-Semantik;
- fehlendem Ort;
- syntaktisch ungültigem oder nicht HTTP(S)-Link;
- ungültigem historischen Monat/Jahr;
- unbekannter Highlight-ID.

Negative Fixtures verbleiben ausschließlich in `src/data/events.test.ts` und werden nicht produktiv
exportiert.

## Date-only-, Zeitzonen- und Clock-Vertrag

- `YYYY-MM-DD` ist ein lokaler Kalendertag und wird nie über `new Date('YYYY-MM-DD')` klassifiziert.
- Der Current-Day-Bezug für den realen DACH-Bestand ist explizit `Europe/Berlin`.
- `toEventDay(now, timeZone)` leitet den Kalendertag aus einem injizierten Zeitpunkt ab.
- `getEventStatus(event, now)` akzeptiert einen fixierten `Date`-Zeitpunkt oder einen validierten
  Kalendertag. Kein Helper liest intern `Date.now()`.
- SSR und Client verwenden damit denselben expliziten Zonenvertrag statt Browser-Lokalzeit.
- Echte Uhrzeiten existieren nicht; datetime-/Kalenderexport-Logik bleibt bewusst unimplementiert.

Statusalgorithmus:

- vor Start: `upcoming`;
- Start bis Ende einschließlich: `ongoing`;
- nach Ende: `past`.

Die Boundary-Matrix deckt eintägig vor/am/nach dem Tag sowie mehrtägig vor/Start/Mitte/Ende/Folgetag
und den Berlin-Mitternachtswechsel ab.

## Sortierung und Highlight

- Upcoming/Ongoing: Startdatum aufsteigend, bei Gleichstand stabile ID aufsteigend.
- Past: reales Ende absteigend, danach Start absteigend und stabile ID aufsteigend.
- `HIGHLIGHT_EVENT_ID = dgi_jahreskongress` verweist auf einen realen Datensatz.
- `getEligibleHighlight` liefert ihn nur `upcoming`/`ongoing`; nach Ablauf oder bei unbekannter ID
  bleibt das Highlight leer. Es wird kein Ersatztermin erfunden.

## x10-Parität

Unterstützte Locales exakt: `de,en,pl,fr,it,es,pt,da,nl,cs`.

- 5/5 aktuelle IDs × 10 besitzen nichtleere `title`, `tag`, `description`.
- 4/4 historische IDs × 10 besitzen nichtleere `title`, `detail`, `watermark`.
- Partner und Orte verbleiben als reale Eigennamen in der Stammdatenquelle.
- G4: PASS — 15 Namespaces × 10, 0 Missing/Empty Keys.

## PT18.1 Evidence

- `src/data/events.test.ts`: **29/29 PASS**
- Typecheck: PASS
- ESLint Delta: PASS
- Prettier Delta: PASS
- G1 Navigation Target Subset: PASS
- G4 i18n: PASS
- Route-/SEO-/Sitemap- und Consent-Code: durch PT18.1 nicht verändert

## PT18.2 Upcoming-/Ongoing-UI

- Die React-Seite konsumiert ausschließlich `getUpcomingEventPresentation`; sie implementiert keine
  zweite Datums-, Status- oder Sortierlogik.
- Am fixierten Referenztag `2026-09-01` enthält Upcoming genau zwei kanonische Datensätze:
  `kite_education` (`ongoing`) gefolgt von `dgi_jahreskongress` (`upcoming`).
- Die vollständige Liste bleibt chronologisch. Das reale `dgi_jahreskongress`-Objekt wird zusätzlich
  prominent präsentiert, aber nicht als zweite Datenkopie angelegt.
- Wenn das konfigurierte Highlight vergangen ist, bleibt die Highlightfläche leer; ein späteres
  reales Event verbleibt in der normalen chronologischen Liste. Es gibt keinen Phantom-Fallback.
- Jede List Card ist semantisch `li > article` und zeigt lokalisierten Titel, reale Beschreibung,
  Date-only-Zeitraum, Ort, optional realen Partner und textuellen Status.
- Highlight- und Ongoing-Status sind ausgeschrieben und nicht nur über Farbe erkennbar.
- Partner/Orte stammen unverändert aus `src/data/events.ts`; Logos, Beziehungen, Geodaten und Maps
  wurden nicht ergänzt.

### External-Link- und Kalenderentscheidung

- Der aktuelle Bestand enthält **0 reale externe Eventlinks**. Deshalb rendert die Eventfläche
  **0 eventbezogene External-/Registration-CTAs** statt generischer „Buchen“-Links.
- Bei künftig belegtem `event.link` erzeugt `getExternalEventLink` einen nativen Link mit
  `target="_blank"` und `rel="noopener noreferrer"`; es gibt keinen Tracking-Callback als
  Navigationsvoraussetzung.
- Kalenderentscheidung: **`NOT_REQUIRED_OR_INSUFFICIENT_DATA`**. Alle Events sind zwar
  `DATE_ONLY_ALL_DAY`, aber es gibt weder Eventdetail-/Registrierungs-URL noch einen freigegebenen
  Kalenderproduktentscheid. PT18.2 erzeugt daher keinen ICS-/SDK-/Kalenderlink und erfindet keine
  Uhrzeit oder Zeitzone.
- Allgemeine Seiten-Navigation und Final CTA bleiben native bestehende Links und funktionieren ohne
  Analytics-Consent.

### x10, A11y, Responsive und Performance

- 10/10 Locale-Routen zeigen die beiden realen Upcoming/Ongoing-Datensätze mit den jeweiligen
  nichtleeren `items.<id>`-Texten; DE-/EN-Fallback wurde nicht verwendet.
- Axe serious/critical: **0** im PT18.2 Upcoming-/Highlight-Scope bei 390/768/1440 px.
- Horizontal overflow: **0** bei 390 px Czech, 768 px Polish und 1440 px German.
- Native Semantik, `<time datetime>`, sichtbare Fokusindikatoren und Mindesthöhe 44 px gelten für
  künftig reale externe Links.
- Pre-consent Google-/Analytics-Providerrequests: **0**.
- Keine Calendar-, Map- oder Analytics-SDKs und kein Third-Party-Widget wurden ergänzt.
- PT18.2 Tests: Eventmodell/Projection **33/33 PASS**, Browser **4/4 PASS**, Typecheck, scoped
  ESLint/Prettier, G1 und G4 PASS.

## PT18.3 Automatischer Rückblick

- `buildPastEventArchive(current, historical, now)` ist die zentrale Archivprojektion. Sie nimmt
  ausschließlich Current-Datensätze mit Status `past` auf und führt sie mit der statischen Historie
  zusammen; die React-Seite enthält keine zweite Übergangs-, Dedupe- oder Sortierlogik.
- Der reale Endtag ist inklusive: eintägige Events wechseln am Folgetag, mehrtägige Events erst am
  Tag nach `endDate` in den Rückblick. Alle Tests verwenden feste Kalenderdaten/Clock-Injection.
- Dedupe erfolgt ausschließlich über die stabile Event-ID. Bei gleicher ID gewinnt der automatische
  Datensatz mit seinem belegten genauen Start-/Enddatum. Titel-/Datumsähnlichkeit löst ausdrücklich
  kein Fuzzy-Dedupe aus; verschiedene Events mit identischem Datum bleiben erhalten.
- Sortierung ist newest-first nach realem Ende. Statische Quellen werden nach ihrem belegten
  Jahr/Monat eingeordnet und behalten genau diese Präzision; es wird kein öffentlicher Tag ergänzt.
  Bei Gleichstand gilt die stabile ID aufsteigend.
- Die bisherige UI-Grenze von acht Einträgen wurde entfernt. Bei `2026-09-01` erscheinen alle sieben
  realen Archivdatensätze: drei automatisch abgelaufene Events, gefolgt von vier statischen
  historischen Events. Doppelte IDs: **0**.
- Ein abgelaufenes Highlight wird durch `getEligibleHighlight` vollständig aus Highlight/Upcoming
  entfernt und erscheint genau einmal im Archiv. Es wird kein Ersatz-Highlight erfunden.
- Der Rückblick ist eine semantische Liste aus `li > article` mit `<time>`; der unbelegte
  „Event recaps & photos“-Kontaktlink wurde entfernt. Es werden keine Recaps/Assets behauptet.
- x10 Runtime: **10/10 PASS**, jeweils sieben Karten mit lokaler `items`-/`past_items`-Copy;
  Eigennamen für Partner und Orte bleiben datengetrieben unverändert.
- Axe serious/critical: **0** bei 390/768/1440 px. Horizontal overflow: **0**. Die für diesen Scope
  kontrastkritische Reveal-Opacity wurde am Archiv entfernt, sodass zugängliche Farben ab erstem
  Paint stabil sind.
- PT18.3 Evidence: Eventmodell/Archiv **37/37 PASS**, Browser **4/4 PASS**, Typecheck, scoped
  ESLint/Prettier, G1 und G4 PASS.

## PT18.4 SEO-, Consent- und Integrations-Evidence

- Eine gemeinsame `getEventPageProjection(..., now)` liefert Upcoming/Ongoing, Highlight,
  deduplizierte Listenansicht und Rückblick aus derselben injizierten Clock. Die feste Matrix prüft
  vor/am/nach einem eintägigen Event sowie vor/Start/Mitte/Ende/nach einem mehrtägigen Event und
  den Ablauf des realen Highlights: **9/9 PASS**.
- `/events` bleibt die einzige registry-valid Eventroute und wird in allen zehn Locales serverseitig
  mit HTTP 200, lokalem H1, individueller Meta, Self-Canonical auf `https://polarisdx.net`, zehn
  hreflang-Alternates plus `x-default=de`, OG/Twitter-URL und Sitemap-Eintrag ausgegeben.
  `/de/events/phantom-event` liefert HTTP 404; Eventdetailrouten wurden nicht erzeugt.
- Search und Sitemap konsumieren unverändert die AP10-Registry: G1 **25 Families / 43 Paths PASS**,
  G3 **39 Families / 390 URLs PASS**, G4 **15 Namespaces × 10 PASS**, Search **35 Targets PASS** und
  Internal Findability PASS.
- Event Structured Data ist bewusst **`NOT_REQUIRED_OR_INSUFFICIENT_TRUTH`**. Der reale Bestand
  belegt Teilnahme/Partnerbezug, aber keine Veranstalterrolle, genaue Anschrift, Attendance Mode oder
  kanonische Eventdetail-URL. Runtime/SSR emittiert deshalb ausschließlich das wahrheitsgemäße
  `BreadcrumbList`-Schema und **0 `BusinessEvent`-Entities**.
- Reale eventbezogene Outbound-/Kalenderaktionen im aktuellen Inventar: **0/0**. Eine neue
  Tracking-Eventtaxonomie wäre deshalb spekulativ und bleibt **`NOT_REQUIRED_CURRENT_ZERO_ACTION_INVENTORY`**;
  Komponenten enthalten keine Providercalls. AP23s bestehende Consent-/Tracking-Fassade wurde nicht
  erweitert oder umgangen.
- Fresh und explizit denied: Google-/Analytics-/Marketing-Providerrequests **0**. Allgemeine native
  Kontakt-/Navigationslinks funktionieren denied ohne Providertraffic. Nach explizitem Analytics-
  Grant startet der bestehende GTM-Bootstrap genau einmal; Navigation hängt nicht am Tracking.
- Page-level Axe serious/critical: **0** bei 390 px Czech, 768 px Polish und 1440 px German;
  Horizontal Overflow: **0**. Ein gemessener Kontrastfehler im gemeinsamen Footer-Hinweis wurde von
  `text-white/40` auf `text-white/70` korrigiert.
- Der Eventseiten-Chunk ist im isolierten Production Build **15,005 Bytes**. Keine Map-, Calendar-
  oder neue Analytics-SDK-Abhängigkeit und kein Event-PDF-/Third-Party-Prefetch wurden ergänzt.
- Quality Evidence: Typecheck PASS; scoped ESLint/Prettier PASS; Event/Schema/Consent Unit
  **55/55 PASS**; vollständige production-like Browser-/SSR-/G3-Suite **23/23 PASS**; isolierter Client-
  und SSR-Production-Build PASS. Das isolierte Buildziel liegt im gitignorierten
  `node_modules/.cache/polaris-pt18-4`, damit der geschützte bestehende `dist/`-Baum unangetastet
  bleibt; der Production-Server behält seine bisherigen Defaultpfade.

## AP18-CLOSURE — unabhängige aktuelle Evidence

- Das Start-Gate wurde am aktuellen Working Tree neu gemessen: AP17 ist COMPLETE / Closure PASS,
  PT18.1–PT18.4 sind PASS, AP18 war vor Closure IN_PROGRESS, AP19 ist NOT STARTED und die 18/18
  Decision Locks sind unverändert. Der breite bestehende Working Tree wurde weder bereinigt noch
  neu gestaged; keine Git-Sequencer-Operation ist aktiv.
- Die unabhängige Inventur bestätigt unverändert genau fünf aktuelle und vier statische historische
  Event-IDs. Alle fünf aktuellen IDs besitzen in allen zehn Locales vollständige `title`-, `tag`-
  und `description`-Keys; alle vier History-IDs besitzen x10 `title`, `detail` und `watermark`.
  Exakte DE-/EN-Dokument- oder Current-Description-Fallbacks in fremden Locales: **0**.
- Positive und negative Datenvalidierung ist erneut PASS. Ungültige Daten, umgekehrte Bereiche,
  Duplicate IDs, unsichere URLs und Phantom-Highlights brechen reproduzierbar hart ab. Direkte
  `new Date('YYYY-MM-DD')`- oder verstreute `Date.now()`-Klassifikation existiert im Eventflow nicht.
- Die Closure hat die Produktions-SSR-/Hydration-Grenzen unabhängig mit einer ausschließlich im
  Testprozess fixierten Clock geprüft. Zehn feste Zeitpunkte von vor/Start/Ende/Folgetag der realen
  Single-/Multi-Day-Fälle bis nach dem Highlight bestehen **10/10**; SSR-Projektion und hydratisierter
  Client stimmen jeweils exakt überein, einschließlich Berlin-Mitternachtswechsel.
- Unit-/Component-/Validation-/Schema-/Consent-Evidence: **55/55 PASS**. Der breite production-like
  Browser-/SSR-/SEO-/Consent-/A11y-Lauf ist **23/23 PASS**. G1, G3, G4, Search, Sitemap, Internal
  Findability, Typecheck, scoped ESLint/Prettier sowie isolierter Client- und SSR-Production-Build
  sind PASS.
- Runtime/SSR emittiert weiterhin genau Breadcrumb-Schema und **0 Event-Entities**. Diese bewusste
  Entscheidung bleibt `NOT_REQUIRED_OR_INSUFFICIENT_TRUTH`: Veranstalterrolle, genaue Anschrift,
  Attendance Mode, Eventdetail-URL und Uhrzeiten sind nicht belegt und werden nicht erfunden.
- Reale Event-Outbound-/Kalenderaktionen bleiben **0/0**. Deshalb ist Eventtracking
  `NOT_REQUIRED_CURRENT_ZERO_ACTION_INVENTORY`; Komponenten enthalten keine Provideraufrufe.
  Fresh und denied erzeugen **0** Analytics-/Marketing-Providerrequests, granted bootstrapt die
  vorhandene GTM-Fassade genau einmal, und native Navigation funktioniert consent-unabhängig.
- Axe serious/critical: **0**. Automatisierte 390/768/1440-Viewport-Prüfungen sowie manuell gesichtete
  Desktop-DE- und Mobile-CS-Screenshots zeigen keinen horizontalen Overflow oder abgeschnittene
  Highlight-, Upcoming-, Past-, Partner-/Ort- oder CTA-Inhalte.
- Der Eventseiten-Chunk bleibt **15,005 Bytes**. Map-, Calendar- oder neue Analytics-SDKs,
  Event-PDF-Prefetch und unnötige Third-Party-Payloads sind nicht vorhanden.
- False-ready-Audit: **0 Findings**. Keine zu frühe Endtag-Archivierung, UTC-Date-only-Konversion,
  stale Highlights, Past-Duplikate, umbenannte IDs, Fake-x10-Fallbacks, erfundene Calendar-/Schema-
  Felder, pre-consent Tracking oder Phantom-Eventdetailrouten wurden gefunden.
- Scope-Integrität: kein AP19/AP20/AP21/AP22/AP23/AP24/AP25/AP27/AP29/AP31-, Event-CMS- oder
  Eventdetailseiten-Pull-forward. AP23 bleibt Owner der globalen Tracking-Governance; Schema,
  Kalender und Event-Outbound-Tracking bleiben bei künftig belegter Daten-/Aktionswahrheit bedingt.
- Closure-Gesamtergebnis: **EVT-01–EVT-40 = 40/40 PASS**, **C18-01–C18-50 = 50/50 PASS** und die
  AP18 Definition of Done ist erfüllt. Offene AP18-owned kritische Blocker: **0**.

## Abgrenzung / offene spätere Owner-Arbeit

- PT18.2 Upcoming-/Ongoing-Darstellung: **PASS**.
- PT18.3 automatisches History-Merge, Dedupe und Rückblick-Darstellung: **PASS**.
- PT18.4 SEO, bewusste Schema-Entscheidung, Consent-/Network-Prüfung und breites Build/SSR/E2E-Gate:
  **PASS**.
- AP18-CLOSURE ist **PASS**; AP18 ist **COMPLETE**. Nächstes Arbeitspaket ist AP19, bleibt aber
  **NOT STARTED**.
- AP23 bleibt Owner der globalen Tracking-/Consent-Governance.
- AP19 bleibt **NOT STARTED**; keine Resource-/Gating-Plattform wurde vorgezogen.
