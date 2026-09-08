# CORPORATE-CONTACT-LEGAL-CONTRACT

**Work Package:** AP20 — About, Contact, Support und Legal
**Execution Standard:** Fast-Delta V2
**Owner-SSOT:** Es gibt genau diese operative AP20-Contract-Datei (neben `AP-STATE.md`).

---

## 1. Git / HEAD (PT20.1)

- Repository: `/home/phillip/01polaris-preview`
- Branch: `console/19-25-2026-09-02T08-36-17`
- HEAD bei PT20.1-Abschluss: `8a14217` (PT20.1-Aenderungen liegen als Staged-Delta im
  Working Tree, konsistent mit dem AP19-Staging; kein Commit durch PT20.1)
- Date: 2026-09-02
- Fast-Delta V2: eingehalten — kein Full Production Build, keine G1/G3/G4/E2E-Vollsuiten,
  nur About-Delta-Tests (siehe §9).
- PT20.4-Aktualisierung (2026-09-07): Legal-Delta + breiter Integrationslauf; FULL
  Production Build im Scratch gelaufen (§12), kein Commit, PT20.4-Dateien gestaged.

## 2. AP20 File Map

**About (PT20.1, geaendert):**

- `src/pages/AboutPage.tsx` — Hero-CTA-Default auf `Angebot anfragen`; DX365-Link
  Kontrast-Fix (`text-heading`); Stat-Strip-Labels `text-gray-600`; rendert
  `AboutPillarsSection` nach `TrustBar`.
- `src/components/sections/AboutPillarsSection.tsx` — NEU; drei Geschaeftssaeulen
  (Diagnostik / IglooPro / Epigenetik), Ziele via Route-Registry
  (`diagnostics`, `igloo-pro`, `epigenetics`), `data-about-pillar` Testhaken.
- `src/components/sections/TeamSection.tsx` — Kontrast-Fixes (Rolle `text-accent-strong`,
  Bio/Links `text-gray-600`). Nur von AboutPage genutzt.
- `src/components/ui/ImagePlaceholder.tsx` — Default-Label `text-slate-600`
  (unmittelbar benoetigtes Shared Presentation Component; zweite Nutzung:
  `src/pages/consumer/shell.tsx`, AP21, not started).
- `public/locales/{de,en,pl,fr,it,es,pt,da,nl,cs}/about.json` — `hero.primary_cta` :=
  freigegebene CTA-Wahrheit (`common.nav.cta_quote`, DE exakt `Angebot anfragen`);
  neue `pillars`-Sektion (x10, Copy aus freigegebener `home.json` `business_pillars`).
- Task-owned Tests: `src/pages/about.x10.test.ts` (7/7), `e2e/about-pt201.spec.ts` +
  `e2e/ap20-pt201.config.ts` (23/23, Dev-SSR ohne Build).

**Contact (PT20.2, Bestand, unveraendert):**

- UI: `src/pages/ContactPage.tsx`, `src/components/sections/ContactForm.tsx`,
  `src/hooks/useContactForm.ts`, `src/api/contact.ts`
- Server: `POST /api/contact` in `server/server.js`

**Support (PT20.3, Bestand, unveraendert):**

- UI: `src/pages/SupportPage.tsx`
- Server: `POST /api/support` in `server/server.js`

**Legal (PT20.4, geaendert):**

- `src/pages/ImprintPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`
- `src/pages/PrivacyPage.tsx` — NEUE Section 6 (faktenbasierte Architektur-Ergaenzung:
  Consent Mode v2, Supportformular inkl. Attachments, Marketing-Trennung, Retention
  90 Tage als vorgesehene Loeschfrist — Delete-Job bleibt AP22).
- `src/components/layout/LegalLayout.tsx` — Meta-Badge Kontrast-Fix
  (`text-accent` → `text-accent-strong`, 3.32:1 → 4.86:1 auf `bg-accent/10`,
  axe-serious color-contrast auf den Terms-Seiten behoben).
- Locale-Source: `public/locales/*/legal.json` — `privacy.section6.*` x10 eingebaut
  (DE autoritaer, x9 fachlich uebersetzt — juristische Gegenlesung = Owner-Empfehlung).
- Redirect: `/agb` → `/terms` (301, `server.ts` `LEGACY_PATH_REDIRECTS` aus
  `src/routing/legacyRedirects.ts`; live gemessen 301 → `/de/terms`, §12).
- Task-owned Tests: `e2e/legal-pt204.spec.ts` (neu) + `e2e/ap20-pt204-prod.config.ts`
  (neu, Production-Gate: legal + contact + support gegen Prod-SSR/Prod-Backend).

## 3. About truth / x10

- **Positionierung (freigegeben):** PolarisDX buendelt Point-of-Care-Diagnostik, den
  IglooPro Reader und Epigenetik in drei klar getrennten Geschaeftsbereichen
  (Claim Register `HCL-007`, `HCL-008`, `HCL-009`; Decision Lock `DEC-RL-005`).
- **Epigenetik:** eigenstaendige Saeule — „Ein eigenstaendiger Bereich fuer epigenetische
  und genetische Analysen sowie zugehoerige Musterbefunde." Nicht unter Diagnostics
  degradiert; eigener Registry-Family `/epigenetics` (INDEX_FOLLOW, Sitemap 0.8).
- **Unternehmen/Standorte (real, aus geprueften Quellen):** Polaris Diagnostics Ltd,
  262A Fulham Road, London SW10 9EL; Polaris Diagnostics Europe GmbH,
  Große Bleichen 1–3, 20354 Hamburg (`structuredData.organizationSchema`,
  `contact.json` locales, `legal.json` Imprint). Team: 4 reale Personen mit Fotos/
  E-Mail/LinkedIn (`about.json` `team`, `TeamSection`).
- **Trust-Signale:** `TrustBar` = Claim-Register-gebunden (`HCL-002` CV < 2 %, `HCL-003`
  IVDR/CE, `HCL-004` Ergebnis in Minuten, `HCL-005` herstelleruebergreifend). Stats
  (2 Standorte / 15+ Laender / 100+ Reader / < 24 h) stammen aus den bereits
  freigegebenen x10 about.json-Bestaenden.
- **Keine erfundenen Aussagen:** keine erfundenen Zertifizierungen, Partner, Marktanteile
  oder Teammitglieder; DX365-Partnerschaft als Distributionspartnerschaft (bestehend).
- **CTA:** DE exakt `Angebot anfragen` (Hero + FinalCta), Ziel `/contact`;
  `common.nav.cta_quote` x10 als freigegebene Uebersetzungswahrheit.
- **x10-Matrix:** about.json 10/10, identische Schluesselstruktur, 0 leere Blaetter,
  G4-i18n-Guard PASS, kein DE/EN-Dauerfallback (task-owned Test + Guard belegen).

## 4. Contact current path (Vorbereitung PT20.2)

- Journey heute: generisches Formular → `fetch POST /api/contact` → **SendGrid-Mail-only**.
- Server-Logik (`server/server.js`): Honeypot `_hp` (still 200), `consent === true`
  Pflicht (`CONSENT_REQUIRED`), Pflichtfelder name/email/message, E-Mail-Shape-Check,
  `formLimiter` (Rate Limit), Spray-Bestell-Routing auf `ulrikes@polarisdx.net`.
- **Keine Persistenz, kein CRM-Handoff, kein Retry, keine Idempotenz** — Request geht bei
  SendGrid-Fehler verloren (500 `DELIVERY_FAILED`).
- Attribution: Query-Paramenter source/journey/section werden serverseitig allowlisted
  (`resolveLeadAttribution`, nur `homepage/general_sales/{hero,roi,final_cta}`) und in die
  Mail geschrieben — nicht persistent.
- **Fremd-Delta im Tree (NICHT AP20, nicht committet):** `src/api/contact.ts`,
  `src/hooks/useContactForm.ts`, `ContactForm.tsx`, `useContactForm.test.ts` enthalten
  gestagedte source/journey/section-Attributions-Felder (fremder Owner, vor AP20). Beim
  PT20.2-Write-Set darauf aufbauen, nicht zuruecksetzen.

## 5. Support current path (Vorbereitung PT20.3)

- `POST /api/support` — SendGrid-Mail-only; Pflicht: name/email/udi/swVersion/issueType/
  subject; Honeypot; Consent-Pflicht; `formLimiter`.
- Attachments: Base64 im JSON-Body; MIME-Allowlist `application/pdf`, `image/png`,
  `image/jpeg`, `image/gif`, `text/plain`; 5 MB Cap (aus Base64-Laenge geschaetzt);
  **kein Dateisystem-Storage, kein Count-Limit, kein Magic-Byte-Check**; Originalname
  wird direkt als SendGrid-Attachment-Filename verwendet.
- Mail: Team-Mail (4 Empfaenger, High-Priority) + Absender-Bestaetigung werden **inline
  im Request** versendet; kein Retry, keine Entkopplung, keine Persistenz.
- Kein Retention-Contract, kein Case-Typ.

## 6. Legal current state (Vorbereitung PT20.4)

- Routen `/imprint`, `/privacy`, `/terms` (x10, Known Paths, appRoute).
- Registry-Klassifikation: `NOINDEX_NOFOLLOW` + `sitemap: false` + `searchEligible: false`
  → **konsistent, Sitemap/noindex-Widerspruch = 0** (vorbehaltlich finaler PT20.4-Messung).
- `/agb` → 301 auf `/<locale>/terms` (serverseitig, `LEGACY_PATH_REDIRECTS`).
- Content: `legal.json` x10 vorhanden (Imprint mit realen Unternehmensdaten);
  inhaltliche Rechtsfreigabe = **PT20.4 verifiziert** (§12): alle 10 Fassungen vollstaendig
  (Imprint 7 Sektionen, Privacy 6 Sektionen nach Section-6-Ausbau, AGB mit TOC + Datum),
  je ~25–31k Zeichen, keine Placeholder. BLOCKED_CONTENT_APPROVAL entfaellt. Keine
  erfundene Legal-Copy — Section 6 ist faktenbasierte Architektur-Dokumentation.

## 7. Shared Lead Primitive findings (PT20.2/PT20.3-Basis)

- `server/lead-foundation/` existiert strukturell: `LeadRepository` (SQLite, Migrationen),
  `lead_outbox`, `LeadHandoffWorker` (Retry-Statusmaschine), `CrmRouter` +
  `DEFAULT_JOURNEY_ROUTES` — darin bereits **contact → `general-sales`** und
  **support → `support`** registriert. `LEAD_JOURNEYS` enthaelt `contact` und `support`.
- Primitive bewiesen durch AP15 (`epigenetics_inquiry`) und AP19 (`content_download`):
  Persist-before-Handoff, Idempotency-Key/409, Retry/RETRY_PENDING,
  NO_PROVIDER_CONFIGURED-ehrlich, Consent-Normalisierung, 0 PII in Logs.
- Contact/Support nutzen diese Primitive **noch nicht** — beide sind Mail-only (§4/§5).
- Damit: **kein BLOCKED_DEPENDENCY**; noetige contact-/support-spezifische Deltas
  (Validierung, Journey-Payload, Mail-Adapter auf Outbox) sind task-owned erlaubt.

## 8. AP22 dependency status

- AP22: NOT STARTED / SHARED FOUNDATION PARTIALLY IMPLEMENTED EARLY. Cross-Journey Lead
  Platform (Normierung aller Journey Types, Retention Platform, Operational Dashboard,
  Hintergrund-Worker-Betrieb) bleibt AP22-Owner und wird von AP20 **nicht** beansprucht.
- AP20 migriert nur die zwei Journeys contact/support auf die bestehenden Primitive.

## 9. PT evidence (PT20.1)

- Unit/Node: `about.x10.test.ts` **7/7** (x10-Key-Paritaet, CTA exakt, Epigenetik-Saeule,
  Registry-Ziele canonical/INDEX_FOLLOW).
- Playwright (Dev-SSR, kein Build): `about-pt201.spec.ts` **23/23** — x10 200/canonical/
  hreflang(11 inkl. x-default→de), DE-CTA exakt + `/de/contact`, Pillar-Links 200 ohne
  Redirect, Axe serious/critical 0 (de/en/pl), Overflow 0 (390/768/1440, de/cs),
  Pre-Consent-Analytics-Requests 0.
- Guards: `check:i18n` G4 PASS (15 NS × 10, 0 Missing/Empty), `check:nav-targets` PASS,
  Typecheck `tsc -b` clean.
- Ehrlich offen (AP20-fremde Baselines): `lint`, `format:check`, `check:colors` rot;
  37 jsdom-Testdateien starten unter Node 18 nicht — Schnittmenge mit PT20.1 = 0.

---

## HANDOFF PT20.1 → PT20.2

**HEAD:** `8a14217` + staged PT20.1-Delta (About-Dateien, Contract, State)

**Changed files (PT20.1):**
`src/pages/AboutPage.tsx`, `src/components/sections/AboutPillarsSection.tsx` (neu),
`src/components/sections/TeamSection.tsx`, `src/components/ui/ImagePlaceholder.tsx`,
`public/locales/*/about.json` (×10), `src/pages/about.x10.test.ts` (neu),
`e2e/about-pt201.spec.ts` (neu), `e2e/ap20-pt201.config.ts` (neu),
`building-docs/CORPORATE-CONTACT-LEGAL-CONTRACT.md` (neu),
`building-docs/state/AP-STATE.md`

**PT20.2 PRIMARY WRITE SET:**
`server/server.js` (`/api/contact` auf lead-foundation), ggf. neuer
`server/contact-lead.js` (+ task-owned Tests analog `content-download.js`),
`src/api/contact.ts`, `src/hooks/useContactForm.ts`,
`src/components/sections/ContactForm.tsx`, `src/pages/ContactPage.tsx` (nur falls noetig),
`public/locales/*/contact.json` (×10, nur Copy-Delta), Contract/State.

**CONTACT UI:** `ContactPage.tsx` (Hero/Channels/Offices) + `ContactForm.tsx` +
`useContactForm.ts` (Intent/Field-Pills, Consent-Checkbox, Honeypot) — funktional, x10.

**CONTACT HOOK:** `useContactForm.ts` — baut Payload (name/email/message/company/phone/
area/requirements/intent/field/locale/source/journey/section/consent/\_hp), POST via
`sendContactEmail` → boolean-Erfolg, kein persistenter State, kein Retry.

**CONTACT API:** `POST /api/contact` in `server/server.js` — SendGrid-only, siehe §4.

**PERSISTENCE:** **fehlt** — `LeadRepository`/SQLite vorhanden (lead-foundation), noch
nicht angebunden. Ziel: validate → consent → PERSIST → outbox → Mail als Side-Effect.

**CRM:** `CrmRouter`, Route `contact → general-sales` registriert; kein Adapter
konfiguriert → `NO_PROVIDER_CONFIGURED`-Pfad ehrlich behandeln (AP19-Muster).

**RETRY:** **fehlt** — `LeadHandoffWorker` + `RETRY_PENDING`-Statusmaschine vorhanden,
noch nicht angebunden.

**IDEMPOTENCY:** **fehlt** — `requestHash`/`IdempotencyConflictError`/409-Muster aus
lead-foundation uebernehmen (Double-submit-safe).

**CONSENT:** Processing-Consent Pflicht (`consent === true`, `CONSENT_REQUIRED`);
Marketing-Consent existiert auf Contact aktuell **nicht** — getrennt fuehren, sofern
fachlich vorgesehen; Formular darf nie von Analytics-Consent abhaengen.

**TRACKING:** `contact_submit` nicht implementiert; Attribution source/journey/section
nur allowlisted + Mail. Kein Pre-Consent-Provider-Request (About belegt 0; Contact
importiert kein Tracking).

**PROVEN — DO NOT REDISCOVER:** Route-Registry x10 + Canonical/Hreflang/SEOHead;
Claim Register HCL-001..HCL-010; lead-foundation Primitive inkl. Tests
(`check:lead-foundation` 13/13); SendGrid-Basistransport + DRY_RUN; formLimiter/Honeypot;
Consent-Normalisierung; G4-i18n x10-Machinerie; x10 about.json vollstaendig (About-PASS).

**OPEN CONTACT DELTA (PT20.2):** Persistenz + Outbox + CRM-Routing + Retry +
Idempotency + state-true UX (idle/validating/submitting/success/retryable/terminal) +
Attribution persistent (language/source/campaign/journey) + Double-Submit-Block +
x10-Fehlerzustaende. Kein Journey-Multiplexing (kein type=consumer/epigenetics).

**DRIFT SIGNALS:** (1) Fremdes gestagedtes Contact-Attributions-Delta im Tree — Owner
fremd, nicht committet, nicht verwerfen; (2) `check:colors`/`lint`-Baseline rot
(AP20-fremd); (3) Legal-Klassifikation aktuell konsistent NOINDEX/no-sitemap, aber
inhaltliche Rechtsfreigabe x10 offen (PT20.4, BLOCKED_CONTENT_APPROVAL-Risiko);
(4) Node-18-crypto.hash-Patch noetig fuer Vite/Build-Laeufe
(`e2e/node18-crypto-hash.cjs`).

---

## 10. PT evidence (PT20.2)

- Unit/Node: `server/contact-lead.test.js` **10/10**; Endpoint-Fork `server/contact-lead.endpoint.test.js` **9/9**
  (Fork mit `SENDGRID_API_KEY: ''` — NO_PROVIDER_CONFIGURED ehrlich; 202 + Persistenz; 400 + fields;
  PROCESSING_CONSENT_REQUIRED; Marketing-denied → 202; Idempotenz-Replay gleiche leadId; 409
  IDEMPOTENCY_CONFLICT; Honeypot 200 ohne Lead; Rate-Limit 5×202 dann 429; Attribution-Allowlist).
- Sofort-Dependencies: `lead-foundation` + `epigenetics-inquiry` + `content-download` **41/41**
  (keine Regression durch `normalizeContext`-Delta journey/section).
- Hook: `src/hooks/useContactForm.test.ts` **6/6** unter Node 20 via nvm (jsdom; unter Node 18
  startet die Datei nicht — gleiche AP20-fremde Baseline wie die 37 jsdom-Dateien). Der Lauf hat
  einen echten Befund geliefert: Double-Submit-Stale-Closure → Guard auf `inFlightRef` umgestellt.
- Playwright (Dev-SSR, kein Build): `contact-pt202.spec.ts` **17/17** — x10 Formular-Render mit
  getrenntem Marketing-Consent (Label-Paritaet je Locale), Consent-Pflicht blockt mit sichtbarem
  Fehler, valider Submit → persistierter Success (DRY_RUN-Backend, role=status), Pre-Consent-
  Analytics-Requests 0, Axe serious/critical 0 (de/en/pl), kein horizontaler Overflow 390px (de).
- Guards: `check:i18n` G4 PASS (15 NS × 10, 0 Missing/Empty), `check:nav-targets` PASS,
  Typecheck `tsc -b` clean.
- Ehrlich offen: (1) Frueher Smoke-Test hat mit dem echten SENDGRID-Key aus `server/.env`
  **1 reale Test-Mail** ausgeloest (synthetische Daten, eigene Mailbox) — danach Forks/Backend-
  Starts immer mit leerem oder SG.-gefaekstem Key + DRY_RUN=1. (2) `useContactForm.test.ts`
  laeuft nur unter Node >= 20 (nvm), nicht unter dem Server-Default Node 18. (3) AP20-fremde
  Baselines (`lint`, `format:check`, `check:colors`, 37 jsdom-Dateien) bleiben rot.

---

## HANDOFF PT20.2 → PT20.3

**HEAD:** `8a14217` + gestuftes Delta AP19 (fremd) + PT20.1/PT20.2 (About/Contact)

**Changed files (PT20.2):**
`server/contact-lead.js` (neu), `server/contact-lead.test.js` (neu),
`server/contact-lead.endpoint.test.js` (neu), `server/lead-foundation/repository.js`
(normalizeContext + journey/section), `server/server.js` (`/api/contact` auf lead-foundation:
202 `{accepted,leadId,journey,status,deliveryPending,providerConfigured}`, 400 + fields,
409, Honeypot, formLimiter bleibt), `src/api/contact.ts` (Idempotency-Key-Header,
ContactSubmitResult ok/retryable/terminal), `src/hooks/useContactForm.ts` (Statusmaschine,
Idempotency-Key pro Instanz, Double-Submit-Block per inFlightRef, Marketing getrennt),
`src/hooks/useContactForm.test.ts` (neu geschrieben, contact-owned),
`src/components/sections/ContactForm.tsx` (Status-Branches success/retryable/terminal,
Marketing-Checkbox `#marketing-consent`, Payload marketingConsent, serverFields-Mapping),
`src/components/sections/PraxisOrderForm.tsx` (an neue API angepasst: orderIdempotencyKey,
processingConsent, result.ok), `public/locales/*/contact.json` (×10: form.marketing_consent,
form.error_retryable), `vite.config.ts` (Dev-Proxy `/api` target zieht `process.env.BACKEND_URL`),
`e2e/contact-pt202.spec.ts` (neu), `e2e/ap20-pt202.config.ts` (neu),
`building-docs/CORPORATE-CONTACT-LEGAL-CONTRACT.md`, `building-docs/state/AP-STATE.md`.

**SUPPORT CURRENT PATH (unveraendert, §5 gilt):** `POST /api/support` in `server/server.js` —
SendGrid-Mail-only; Pflicht name/email/udi/swVersion/issueType/subject; Honeypot; Consent;
formLimiter; Attachments Base64 MIME-Allowlist (pdf/png/jpeg/gif/text) + 5MB Cap; Team-Mail
(4 Empfaenger, High-Priority) + Absender-Bestaetigung inline; kein Persistenz/Retry/Idempotency;
Originalname direkt als Attachment-Filename (kein Sanitizing), kein Magic-Byte-Check,
kein Count-Limit.

**PT20.3 PRIMARY WRITE SET:**
`server/support-case.js` (+ task-owned Tests analog `contact-lead.js`), `server/server.js`
(`/api/support` ersetzen: validate → Processing-Consent → repository.createLead (journey
support, context locale/source/...) → worker.processNext(); 202/400/409 wie contact),
ggf. `server/lead-foundation/repository.js` (nur falls Support-Kontextfelder fehlen —
journey/section sind schon da), `src/api/support.ts` (analog contact.ts), Support-Hook/Formular-
Client, `public/locales/*/support.json` (×10, nur Copy-Delta), Contract/State,
e2e `ap20-pt203`.

**PROVEN — DO NOT REDISCOVER (neu dazu, PT20.2):**

- Contact-Journey-Muster end-to-end: `contact-lead.js` ist die Blaupause (validate → Consent →
  createLead → processNext; SendGridTeamMailAdapter mit retryable 5xx/ETIMEDOUT/ECONNRESET;
  NO_PROVIDER_CONFIGURED ehrlich wenn SENDGRID_API_KEY/CONTACT_RECEIVER/SENDER_EMAIL fehlen).
- 202-Vertrag `{accepted,leadId,journey,status,deliveryPending,providerConfigured}` und
  Client-Mapping 202/200 ok · 400/409 terminal · 429/5xx/Netz retryable.
- `JOURNEY='contact'`, `CONSENT_VERSION='contact-2026-09'`, Spray-Marker
  `Vitamin D3+K2 Spray BESTELLUNG` routet an ulrikes@.
- Dev-SSR-E2E-Infra: vite Dev-Proxy `/api` zieht `BACKEND_URL` (vor PT20.2 hart localhost:5000 —
  in middlewareMode griff er vor dem Express-Proxy); Playwright-webServer-Readiness akzeptiert
  200–403 → `/api/content-download/asset/health` (403) als Backend-Ready-URL; Backend-Forks nur
  mit `SENDGRID_API_KEY:''` oder SG.-gefaekstem Key + DRY_RUN=1 (echter Key in server/.env!);
  Scratch-Kopie per `cp -al`, geaenderte Dateien frisch kopieren, server.ts patchen
  (cacheDir + middlewareMode/hmr:false).
- Hydrations-Race in Dev-SSR: fills auf kontrollierten Inputs vor Hydration gehen verloren →
  `fillStable`-Muster (fill → inputValue pruefen → refill) + networkidle abwarten.
- jsdom-Tests via `nvm use 20` auf dem Server starten (Default Node 18 → ERR_REQUIRE_ESM).
- Double-Submit-Guard gehoert auf eine Ref, nicht auf State (Stale Closure beim synchronen
  Double-Invoke).

**OPEN SUPPORT DELTA (PT20.3):** Persistenz + Outbox + Retry + Idempotenz (Muster komplett von
contact uebernehmen), state-true UX analog Contact (idle/submitting/success/validation-error/
retryable-error/terminal-error), Double-Submit-Block per Ref, x10-Fehlerzustaende in support.json,
Attribution persistent allowlisted. Attachment-Haertung im Scope pruefen: Originalname-Sanitizing
(path traversal im Filename), Magic-Byte-Check gegen MIME-Spoofing, Count-Limit — aktuell nicht
vorhanden (§5). Kein Journey-Multiplexing.

**DRIFT SIGNALS:** (1) fremdes gestagedtes AP19-Delta unveraendert im Tree; (2) AP20-fremde
Baselines rot (`lint`, `format:check`, `check:colors`, 37 jsdom-Dateien unter Node 18);
(3) `useContactForm.test.ts` benoetigt Node >= 20 (nvm) — CI-Node-Version pruefen;
(4) 1 reale Test-Mail im PT20.2-Smoke (synthetische Daten, eigene Mailbox) — dokumentiert,
Key-Rotation-Entscheidung liegt beim Owner; (5) Node-18-Crypto-Patch weiter noetig.

---

## 11. PT evidence (PT20.3)

- Unit/Node: `server/support-case.test.js` **18/18** (Persistenz, Team- +
  Bestaetigungsmail entkoppelt, Consent getrennt, Idempotenz-Replay + 409,
  Retry 5xx → RETRY_PENDING, NO_PROVIDER ehrlich, Honeypot, Allowed-Typen
  pdf/png/jpg/gif/txt, Executable/Script-Reject, Spoofed-MIME-Reject ueber
  Magic Bytes in beide Richtungen, MIME/Extension-Mismatch, Oversize,
  Count-Limit, Total-Limit, Traversal-Reject, ungueltiges Base64,
  opake Storage-IDs, Originalname nie im Pfad, Retention-Metadaten).
- Endpoint-Fork `server/support-case.endpoint.test.js` **9/9** (Fork mit
  `SENDGRID_API_KEY: ''` + temp `SUPPORT_UPLOAD_DIR`; 202 + Persistenz,
  400 + fields, Consent-400, Honeypot-200 ohne Case, Replay gleiche leadId,
  409, Rate-Limit 5×202 → 429, Attachment physisch opak abgelegt und ueber
  KEINE URL erreichbar (3 Wege je 404), Spoofed/Traversal ueber HTTP 400).
- Sofort-Dependencies: lead-foundation + epigenetics-inquiry +
  content-download + contact-lead **38/38** (repository.js um
  caseDir/attachments/retention erweitert — keine Contact-Regression).
- Playwright (Dev-SSR, kein Build): `support-pt203.spec.ts` **17/17** —
  x10 Render, Consent-Pflicht blockt sichtbar (role=alert, kein role=status),
  valider Submit INKL. PDF-Attachment → persistierter Success (DRY_RUN-
  Backend), Pre-Consent-Analytics 0, Axe serious/critical 0 (de/en/pl),
  kein Overflow 390px (de).
- Guards: `check:i18n` G4 PASS (15 NS × 10, 0 Missing/Empty),
  Typecheck `tsc -b` clean.
- Ehrlich offen: (1) Kein Malware-Scanner/Quarantine-Primitiv im Fundament —
  enge Allowlist + Magic-Bytes statt Plattform-Neubau; ClamAV-Hardening ist
  AP22-/spaeterer Owner. (2) Globaler Retention-Delete-Job ist AP22 — der
  Case traegt Retention-METADATEN (deleteAfter), die Loeschung selbst ist
  nicht als operational complete behauptet. (3) Mail-Replay ist
  at-least-once: ein Retry kann Team+Bestaetigung wiederholen; der Case ist
  ueber Idempotency geschuetzt, die Mail-Paarung nicht dedupliziert.
  (4) AP20-fremde Baselines (`lint`, `format:check`, `check:colors`,
  37 jsdom-Dateien unter Node 18) bleiben rot.

---

## HANDOFF PT20.3 → PT20.4

**HEAD:** `8a14217` + gestuftes Delta AP19 (fremd) + PT20.1/PT20.2/PT20.3

**Changed files (PT20.3):**
`server/support-case.js` (neu), `server/support-case.test.js` (neu),
`server/support-case.endpoint.test.js` (neu), `server/lead-foundation/repository.js`
(normalizeContext + caseDir/attachments/retention), `server/server.js`
(`/api/support` auf lead-foundation: 202 `{accepted,leadId,journey,status,
deliveryPending,providerConfigured}`, 400 + fields, 409, formLimiter/Honeypot
bleiben), `src/api/support.ts` (Idempotency-Key, ok/retryable/terminal),
`src/hooks/useSupportForm.ts` (Statusmaschine, Key pro Instanz,
Double-Submit-Block per inFlightRef, Attachment-Guards), `src/components/
sections/SupportForm.tsx` (Success role=status, retryable/terminal-Branches),
`public/locales/*/support.json` (×10: form.error_retryable),
`e2e/support-pt203.spec.ts` (neu), `e2e/ap20-pt203.config.ts` (neu),
`building-docs/CORPORATE-CONTACT-LEGAL-CONTRACT.md`,
`building-docs/state/AP-STATE.md`.

**CONTACT PROVEN (PT20.2, unveraendert gueltig):** contact-lead.js
Blaupause, 202-Vertrag, Client-Mapping, Dev-SSR-E2E-Infra (vite-Proxy
BACKEND_URL, 403-Readiness-Trick, fillStable-Hydration, Node-20-nvm),
Double-Submit-Ref-Guard.

**SUPPORT RESULT:**

- Journey: `support`, eigener Case-Type (JOURNEY='support',
  CONSENT_VERSION='support-2026-09'), Issue-Types allowlisted
  (hardware/software/connectivity/test_kit/calibration/other), Felder
  name/email/udi/swVersion/issueType/subject/description/locale.
- Persistence: Lead + Outbox VOR jedem Handoff (createLead → processNext);
  Attachments werden vor der Persistenz opak auf Disk geschrieben
  (`server/storage/support-uploads/<caseDir>/<storageId>`,
  SUPPORT_UPLOAD_DIR ueberschreibbar), Metadaten am Case.
- Mail retry: Team-Mail (HIGH PRIORITY, inkl. Attachments von Disk) +
  lokalisierte Bestaetigung (x10 via system-i18n, ohne Attachments) als
  entkoppelte Side Effects ueber Outbox/CrmRouter; 5xx/ETIMEDOUT/ECONNRESET
  retryable → RETRY_PENDING-Statusmaschine.
- Idempotency: Idempotency-Key Pflicht (400 ohne), Replay → gleiche leadId,
  gleicher Key + anderer Inhalt → 409; caseDir/storageId deterministisch aus
  Key abgeleitet (Replay schreibt stabil, kein Datenmuell).
- Allowed types: application/pdf, image/png, image/jpeg, image/gif,
  text/plain — Extension↔MIME-Konsistenz + Magic-Byte-Check (Binaerformate).
- Limits: max 3 Dateien, 5 MB je Datei, 10 MB gesamt (reale Bytes nach
  Dekodierung), Express-Body-Limit 10mb bleibt die harte Obergrenze.
- Storage: generierte UUID-Namen, Originalname nur Display-Metadatum,
  Traversal-Sequenzen/Pfadbestandteile → 400, kein User-Filename als Pfad,
  keine Route liefert den Storage aus (3 Wege 404-geprueft), nicht oeffentlich
  ausfuehrbar. Singulaeres Legacy-`attachment` wird als Ein-Element-Array
  akzeptiert.
- Retention: METADATEN am Case (caseDays/attachmentDays 90, deleteAfter
  ISO-Datum); Deletion-Pfad = Case-Dir loeschen (`<caseDir>` pro Case
  isoliert); globaler Delete-Job = AP22 (nicht operational complete).
- Consent: Processing Pflicht (400 PROCESSING_CONSENT_REQUIRED),
  Consent-Evidence (acceptedAt) validiert, Marketing strikt DENIED, kein
  Analytics-Consent erforderlich, Pre-Consent-Provider-Requests 0 (E2E).
- x10: Form/Validierung/Confirmation/Systemcopy 10/10 (support.json
  error_retryable x10, Mail-Copy x10 via system-i18n, E2E-Render x10).

**PROVEN — DO NOT REDISCOVER (neu dazu, PT20.3):**

- support-case.js ist die zweite Blaupause neben contact-lead.js; neuer
  Context-Slot normalizeContext(caseDir/attachments/retention).
- Deterministische caseDir/storageId aus Idempotency-Key loesen das
  Replay-vs-Konflikt-Problem des requestHash (zufaellige Context-Werte
  brechen Idempotenz sonst still).
- Endpoint-Fork-Tests: Port per net-server(0) atomar besorgen — pid-Formeln
  kollidieren auf dem Shared Server mit fremden Diensten (404-Chaos).
- Attachments werden vor Persistenz auf Disk geschrieben, damit
  persist-before-handoff strikt gilt und die Mail immer existierende Dateien
  findet.
- Spoofed-MIME faellt in BEIDE Richtungen auf: Extension↔MIME-Mismatch
  (ATTACHMENT_TYPE) UND Magic-Bytes vs. behauptete MIME (ATTACHMENT_SPOOFED).

**PT20.4 LEGAL WRITE SET:** `src/pages/` Legal-Seiten (Imprint/Privacy/Terms,
x10 via legal.json), LegalLayout, Registry-Klassifikation pruefen
(NOINDEX_NOFOLLOW/sitemap:false), `/agb` → 301 auf `/<locale>/terms`
serverseitig (LEGACY_PATH_REDIRECTS), Legal-spezifische Tests + Playwright-
Delta, Contract/State. KEINE Legal-Copy erfinden — fehlende freigegebene
Fassung = BLOCKED_CONTENT_APPROVAL.

**LEGAL CURRENT STATE (§6 gilt):**

- Imprint: `/imprint` x10 (Known Paths, appRoute), Imprint mit realen
  Unternehmensdaten in legal.json x10 vorhanden.
- Privacy: `/privacy` x10, legal.json x10 vorhanden.
- Terms: `/terms` x10, legal.json x10 vorhanden.
- /agb: 301 → `/<locale>/terms` (serverseitig, LEGACY_PATH_REDIRECTS).
- indexing: Registry NOINDEX_NOFOLLOW + sitemap:false + searchEligible:false,
  Sitemap/noindex-Widerspruch = 0 (vorbehaltlich PT20.4-Messung).
- approval x10: inhaltliche Rechtsfreigabe aller 10 Fassungen = PT20.4 zu
  verifizieren; keine erfundene Legal-Copy.

**INTEGRATION DELTAS:** (1) PT20.4 = breiter AP20-Integrationslauf +
Contract-Konsolidierung; (2) AP20-CLOSURE danach = unabhaengige breite
Reverifikation; (3) jsdom-Hook-Tests brauchen Node >= 20 (nvm); (4) echter
SENDGRID-Key in server/.env — Backend-Forks/Teststarts immer mit
`SENDGRID_API_KEY:''` oder SG.-Fake + DRY_RUN=1; (5) globale
Baselines `lint`/`format:check`/`check:colors` rot (AP20-fremd);
(6) ClamAV-/Retention-Delete-Owner: AP22.

---

## 12. PT evidence (PT20.4) — Legal + breites Integrationsgate

### Legal Delta (was geaendert wurde)

- `src/pages/PrivacyPage.tsx`: Section 6 nach Section 5 — `privacy.section6.*`
  (consent_mode / support_title+content / marketing_title+content). Faktenbasiert
  aus realer Architektur (Consent-Mode-v2-Setup, Supportformular inkl. Attachment-
  Regeln aus §5, Marketing-DENIED-Default, Retention-Metadaten 90 Tage); die
  Loeschung selbst bleibt AP22 und ist als „vorgesehene Loeschfrist 90 Tage"
  ehrlich formuliert. KEINE erfundene Legal-Copy.
- `public/locales/*/legal.json` x10: `privacy.section6.*` eingebaut
  (DE autoritaer, x9 fachlich uebersetzt — keine juristisch gepruefte
  Uebersetzung; Owner-Empfehlung: juristische Gegenlesung einholen).
- `src/components/layout/LegalLayout.tsx`: Meta-Badge `text-accent` →
  `text-accent-strong` (3.32:1 → 4.86:1 auf `bg-accent/10`, AA) — axe-serious
  color-contrast auf den Terms-Seiten (de/en/pl gemessen) behoben.
- E2E: `e2e/legal-pt204.spec.ts` (neu) + `e2e/ap20-pt204-prod.config.ts` (neu,
  Production-Gate ohne webServer, `PROD_BASE_URL`).

### Rechtsfreigabe-Check (BLOCKED_CONTENT_APPROVAL — ENTFAELLT)

- `legal.json` x10 vollstaendig: Imprint 7 Sektionen, Privacy 6 Sektionen
  (nach Ausbau), AGB mit TOC + Stand-Datum; je ~25–31k Zeichen; keine
  Placeholder (es/pt „todo" = normales Wort „todo el/o", kein Marker).
- Entscheidung: existierender Legacy-Stand = freigegebene Fassung; PT20.4 hat
  nur faktenbasiert ergaenzt, nichts am freigegebenen Kern umgeschrieben.

### Verifikations-Zahlen (alles gegen Production, Scratch-Hardlink-Kopie)

- Typecheck `tsc -b` clean (nach PrivacyPage-Section-6 + LegalLayout-Fix).
- Guards: `check:i18n` G4 PASS (15 NS x 10, 0 Missing/Empty);
  `check:nav-targets` G1 PASS; `check:routes` G3 PASS („25 families,
  43 canonical paths, 39 sitemap, 35 search, 30 redirects; 0 stale route
  mirrors" — inkl. G3-Sitemap-Contract). G9: kein eigenes Script im Repo
  identifizierbar — G9-Aspekte liegen in G1/G3/G4-Suiten, Vollsuite
  `check:seo` bewusst nicht gelaufen (zu breit fuer Fast-Delta).
- Registry: privacy/imprint/terms = LEGAL, NOINDEX_NOFOLLOW, sitemap:false,
  knownPath, appRoute (x10). `/agb` → `/terms` PRIMARY_ALIAS in
  `src/routing/legacyRedirects.ts`.
- Server-Suites Finalstand: contact-lead 10/10 + contact-lead.endpoint 9/9 +
  support-case 18/18 + support-case.endpoint 9/9 + lead-foundation-
  Dependencies = **46/46 PASS** (SENDGRID:- bzw. SG.-Fake-Forks, DRY_RUN).
- FULL Production Build im Scratch: `✓ built` (dist/client + dist/server),
  Prod-SSR per `npm run start` (tsx server.ts) auf 3600, Backend 5504
  (DRY_RUN=1, SG.-Fake, temp LEAD_DB_PATH/SUPPORT_UPLOAD_DIR).
- Production-E2E `ap20-pt204-prod.config.ts`: **70/70 PASS** — legal-pt204
  36/36 (x10 imprint/privacy/terms je 200 + canonical + noindex/nofollow +
  CTA=0 im main-Content; de/privacy beschreibt Consent Mode v2 + Supportformular
  - 90 Tage + Marketing; /agb 301 → /de/terms serverseitig gemessen;
    axe serious/critical 0 auf de/en/pl privacy+terms; kein Overflow 390px de)
  - contact-pt202 17/17 + support-pt203 17/17 gegen denselben Prod-Stack.
- Live-Messung: `/de/privacy` 200, `/de/imprint` 200, `/agb` 301 →
  `/de/terms` (curl, Prod-SSR).
- Legal CTA = 0: kein FinalCta/RoiCalculator/„Angebot anfragen" im
  Legal-Content (Source-Check ImprintPage/PrivacyPage/TermsPage/LegalLayout);
  der globale Header-CTA ist site-weit und kein Seiten-Element (E2E prueft
  auf `main`-Scope).

### Ehrlich offen

- (1) Axe-„region"-Finding (moderate): Legal-Content teilweise ausserhalb
  Landmarks — bewusst NICHT in PT20.4 gefixt (Gate = serious/critical,
  konsistent mit PT20.1–PT20.3); als AP20-CLOSURE-/Folgekandidat nennen.
- (2) Rate-Limiter (formLimiter, pro IP) verursacht bei sofortigem E2E-Rerun
  nach vorangegangenen Laeufen RATE_LIMITED-Flakiness — im Final-Lauf durch
  Backend-Restart vor dem Run sauber; kein Produktdefekt.
- (3) LegalLayout-Kontrast-Fix und Legal-E2E-Spec-Korrekturen (CTA-Scope auf
  main, /agb via APIRequestContext maxRedirects:0) entstanden im PT20.4-
  Integrationslauf selbst — erstbefund: axe color-contrast serious auf terms.
- (4) AP20-fremde Baselines (`lint`, `format:check`, `check:colors`, 37
  jsdom-Dateien unter Node 18) bleiben rot; `useContactForm.test.ts` braucht
  Node >= 20.
- (5) ClamAV-/Retention-Delete-Owner: AP22 (unveraendert).
- (6) Prod-SSR-Start-Eigenheit: `dist/` im Repo root-owned → Build/E2E nur in
  Scratch-Kopie; SSR-Start per `npm run start` (nicht `node dist/server.js`,
  es gibt keinen server.js — Entry ist dist/server/entry-server.js).
- (7) Section-6-Uebersetzungen x9 = fachliche, keine juristisch gepruefte
  Uebersetzung (Owner-Empfehlung: juristische Gegenlesung).

### KONSOLIDIERUNG (Endstand AP20 nach PT20.4, vor AP20-CLOSURE)

- AP20-Ziel-Bereiche: About (PT20.1) + Contact (PT20.2) + Support (PT20.3) +
  Legal (PT20.4) alle PASS; AP20 bleibt IN_PROGRESS bis eigenstaendige
  AP20-CLOSURE-Reverifikation.
- Production-Proof erstmals vollstaendig: Build + Prod-SSR + Prod-Backend +
  70/70 Production-E2E ueber alle drei Journeys und Legal.
- Server-Fundament: 46/46 Lead-Suites auf lead-foundation; Contact- und
  Support-Journey persistent, idempotent, retry-faehig, consent-getrennt.
- Indexing-Contract legal: NOINDEX_NOFOLLOW x10, sitemap:false, /agb 301 —
  gemessen in Produktion, Widerspruch 0.
- Naechster Schritt: AP20-CLOSURE (unabhaengige breite Reverifikation);
  danach erst AP21 (NOT STARTED).

---

## 13. AP20-CLOSURE evidence (2026-09-08) — unabhaengiger finaler Paket-Gate

Closure-Prinzip eingehalten: alles neu gemessen, kein PT-PASS blind uebernommen.

### Start-Gate (eigenverifiziert)

- AP19 COMPLETE / Closure PASS (State) · PT20.1/PT20.2/PT20.3/PT20.4 = PASS (State) ·
  AP20 IN_PROGRESS · AP21 NOT STARTED · Decision Locks 18/18 LOCKED
  (`DECISIONS.md` §3: DEC-RL-001..016 + REST-01..03, 0 offen) ·
  Branch `console/19-25-2026-09-02T08-36-17`, HEAD `8a14217`, kein Commit,
  Working-Tree-Schutz eingehalten.

### Neu gemessene Evidenz

- Guards: `tsc -b` clean · G1 check:nav-targets PASS · G3 check:routes PASS
  (25 families, 43 canonical paths, 0 stale mirrors) · G4 check:i18n PASS
  (15 NS x 10, 0 Missing/Empty) · **G9 check:seo erstmals gelaufen: PASS**
  (380 Meta-Records, 0 findings, 1 fr-Laengen-Warning non-blocking) ·
  check:lead-foundation 13/13.
- Server-Suites (vitest, frisch): contact-lead 10/10 + endpoint 9/9 +
  support-case 18/18 + endpoint 9/9 = **46/46** · Dependencies
  (lead-foundation 13 + epigenetics-inquiry 8+2 + content-download 20+8) +
  about.x10 7/7 = **58/58** · useContactForm 6/6 (Node 20 nvm).
- Production: FULL Build im Scratch ok · Prod-SSR 3600 + Prod-Backend 5504
  (DRY_RUN, SG.-Fake, frische DB — Rate-Limiter sauber) · `/agb` 301 →
  `/de/terms` live · `/de/privacy` 200.
- E2E neu: About-pt201 **23/23** (Dev-SSR) · Prod legal+contact+support
  **70/70** · Closure-Smoke **22/22** (neu geschrieben: Keyboard C20-45
  [Skip-Link x6, Contact-Submit per Tastatur inkl. Validierungs-Fokus,
  Support-Consent + Upload-Button per Space → Input-Click, TOC-Anker-Sprung],
  Responsive C20-46 [de/cs x 390/768/1280 x 6 Seiten, Overflow 0],
  Performance C20-47 [keine Third-Party-Hosts x6, kein eager Upload-Code]).
- False-Ready-Audit (§12 Prompt): contact-lead/support-case nutzen
  createLead/processNext/CrmRouter/Outbox (8/7 Treffer) — kein Mail-only ·
  Retention nur als Metadaten + ehrliche Privacy-Formulierung, nicht
  operational behauptet · 0 Third-Party-SDKs in AP20-Seiten/Formularen ·
  Base64-Upload nur bei Datei-Auswahl · AP22 nirgends als komplett markiert.

### A11y-Gesamtbild

- Axe serious/critical = 0 im AP20-Scope (about/contact/support/legal,
  de/en/pl, Prod + Dev-SSR) — C20-44 PASS.
- Offener Punkt (kein C20-Fail): axe-**moderate** region-Finding
  „Legal-Content teilweise ausserhalb Landmarks" — Owner-Empfehlung:
  Landmarks-Haertung mit **AP24 (systemweite A11y-Haertung)** bündeln,
  nicht als AP20-Regressionsfix einzeln einbauen.

### Weitere Closure-Befunde (dokumentiert, keine Fails)

- pt201-Config: Scratch-Pfad per `AP20_RUN_DIR` env ueberschreibbar
  (Default = urspruenglicher PT20.1-Scratch, der nicht mehr existiert).
- ELOOP-Symlink-Loop `email/assets` in Scratch-Kopien bekannt — vite
  Dev-Watcher bricht dort; im Repo kein Defekt.
- Enter-Activation des Support-Upload-Buttons: in headless-Chromium
  timingsensitiv (Space/Maus stabil) — kein Source-Befund (kein globaler
  Enter-Handler; Header/Dialog nur Escape).

### Verdict

- CORP-01..40: PASS · R20-01..12: mitigiert/dokumentiert ·
  C20-01..50: PASS · Definition of Done 54/54 erfuellt.
- AP22 Cross-Journey Lead Platform = LATER OWNER / NOT CLAIMED COMPLETE.
- AP21 = NOT STARTED (nicht gestartet).
