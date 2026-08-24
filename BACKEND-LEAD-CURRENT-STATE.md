# PolarisDX Relaunch — Backend & Lead Current State

> **CURRENT STATE audit, 2026-08-21**, gegen die gesperrte Baseline `feat/home-leadmagnet@961f65d`.
> Dieses Dokument beschreibt **ausschließlich den Ist-Zustand**. Der Soll-Zustand steht in
> `building-docs/scope/MASTER-SCOPE.md`; die Abweichung ist in §18 getrennt ausgewiesen und nirgends
> mit dem Ist-Zustand vermischt.
>
> Read-only. Es wurde nichts an Anwendungs- oder Backend-Quellcode, Konfiguration, Dependencies,
> Lockfiles, Environment-Dateien, Branches, Commits, Diensten, Datenbanken, Deployments oder an den
> kanonischen `building-docs/`-Dokumenten geändert. Nichts wurde gestaged, committet oder gepusht.
> Es wurde keine E-Mail versendet, kein CRM aufgerufen und kein externer Side Effect ausgelöst.
> **Keine Secret-Werte werden wiedergegeben — ausschließlich Variablennamen.**
> Fest im Code stehende interne Empfängeradressen werden **redigiert** und nur nach Rolle/Quelle beschrieben.

---

## 1. Executive Summary

**Sechs aktive Frontend-Submission-Journeys** treffen auf **fünf Backend-Endpunkte**. Ein sechster
Endpunkt-Kandidat (`/api/chat`) existiert serverseitig, hat aber **keinen Aufrufer im Frontend**.

| Kernfrage                     | Antwort (Ist)                                    | Evidenz                                                                                                                              |
| ----------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ------- | --------- | ------- | ------------------ | ---- | ------- | ---------------------------------- |
| Persistente Lead-Speicherung? | **NEIN — für alle sechs Journeys**               | keine DB-/ORM-/Queue-Dependency in `server/package.json`; kein `fs`-Schreibzugriff in `server/server.js`; Grep über beide Trees leer |
| Queue / Retry / Dead-Letter?  | **NEIN**                                         | Grep nach `queue                                                                                                                     | worker  | retry     | backoff | dlq                | cron | attempt | replay`in`server/server.js` → leer |
| Server-seitige Idempotenz?    | **NEIN**                                         | Grep nach `idempotency                                                                                                               | orderId | requestId | uuid    | randomUUID` → leer |
| Externe Zustellung            | **SendGrid, synchron im HTTP-Request-Lifecycle** | `await sgMail.send(...)` bzw. `await Promise.all([...])` vor jedem `res.status(200)`                                                 |
| CRM-Anbindung                 | **NEIN — existiert nicht**                       | keine CRM-Library, kein Adapter, kein Outbound-Call außer SendGrid                                                                   |

**Die betriebswirtschaftliche Kernaussage:** Ein Lead existiert heute genau so lange wie der HTTP-Request.
Schlägt SendGrid fehl, antwortet der Server `500`, der Nutzer sieht einen Fehler — und **die eingegebenen
Daten sind unwiederbringlich verloren**. Es gibt keine Stelle im System, an der die Anfrage vor dem
externen Handoff festgehalten wird. Das betrifft alle sechs Journeys gleichermaßen.

**Fünf Befunde, die über diese Grundaussage hinausgehen:**

1. **`POST /api/consumer-order` hat keinen Rate Limiter** — verifiziert, nicht angenommen (`server/server.js:338`, ohne `formLimiter`, im Gegensatz zu `:66`, `:143`, `:636`).
2. **`ChatWidget.tsx` ist kein Mock.** Die Komponente lädt unbedingt und **ohne jede Consent-Prüfung** ein Drittanbieter-Skript von `https://widget.hihuman.co.uk/bundle.js` auf **jeder** Seite der B2B-Shell. Ältere Repository-Dokumentation beschreibt das Chat-Feature als „Mock-Echo" — das trifft auf den **Endpunkt** `/api/chat` zu, nicht auf das Widget.
3. **Zwei Endpunkte loggen E-Mail-Adressen im Klartext** (`:480`, `:713`), und in allen fünf Endpunkten kann `console.error(error.response.body)` den SendGrid-Fehlerkörper samt Nachrichteninhalt ausgeben.
4. **Backend-Testabdeckung: eine einzige Funktion.** `server/server.test.js` prüft ausschließlich `esc()`. **Kein einziger Endpunkt** hat einen Test — kein Erfolgsfall, keine Validierung, kein Provider-Fehler, kein Rate Limit.
5. **Alle ausgehenden E-Mails sind hartcodiert deutsch**, auch der Support-Autoresponder an den Nutzer und der ROI-Report — bei einer Site, die zehn Sprachen ausliefert.

**Klassifikation: BACKEND_BASELINE_READY_WITH_WARNINGS** (§22). Der Ist-Zustand ist vollständig und
belegbar erfasst; die Warnungen betreffen den Zustand selbst, nicht die Erfassung.

---

## 2. Scope and Authority

Gelesen in dieser Reihenfolge (`building-docs/PROJECT-CONSTRAINTS.md`, Autoritätsreihenfolge):

1. `building-docs/AGENT-CONTRACT.md` — insbesondere Regel 16 (keine Secret-Werte), Regel 18 (keine produktiven Side Effects), Regel 12/13 (Git-Sicherheit).
2. `building-docs/PROJECT-CONSTRAINTS.md` — `DEC-RL-004` (Consent), `DEC-RL-009` (Persistenz + CRM), `DEC-RL-011` (eigene Epigenetik-Strecke), `DEC-RL-014` (gated Lead-Magnet), `REST-01`, `REST-02`.
3. `building-docs/scope/MASTER-SCOPE.md` — AP02 (PT02.4), AP11 (PT11.5), AP14 (PT14.6), AP15 (PT15.6), AP19 (PT19.3), AP20 (PT20.2–PT20.4), AP21 (PT21.5), AP22 (PT22.1–PT22.8), AP23 (PT23.1–PT23.3), AP26 (PT26.3–PT26.4), AP27 (PT27.2), AP28 (PT28.1, PT28.5), AP30–AP33 wo Betriebsverhalten berührt ist.
4. Aktuelle Repository-Evidenz — jede Aussage unten ist mit Datei und Zeile belegt.
5. `building-docs/BRANCH-RECONCILIATION-MAP.md`, `building-docs/REPO-BASELINE.md`, `IMPLEMENTATION-HOTSPOTS.md`.

**Trennung Ist/Soll:** §3–§16 beschreiben ausschließlich den Ist-Zustand. §17 listet die aktuellen
Journeys; **geplante, aber heute nicht existierende Journeys stehen dort in einer getrennten Tabelle
und sind ausdrücklich als nicht vorhanden gekennzeichnet.** §18 stellt Ist gegen Soll.

**Ausgeführte Kommandos mit Nebenwirkungspotenzial:** ein `node -e`-Aufruf, der `server/server.js`
importiert, um `esc()` deterministisch zu prüfen (§16). Der Import startet **keinen** Listener — die
Datei ist mit `if (require.main === module)` (`server/server.js:726`) geschützt. Kein Mailversand, kein
Netzwerk-Call. Der auf `127.0.0.1:5000` beobachtete Listener ist der **vorbestehende** Backend-Dienst und
wurde nicht von dieser Analyse gestartet oder verändert.

---

## 3. Current Architecture

```
Browser
  │
  │  fetch('/api/…', POST, application/json)
  ▼
Express-5-SSR-Server  (server.ts, Port 3000, bind 127.0.0.1)
  │  http-proxy-middleware:  /api/*  →  BACKEND_URL
  ▼
Express-4-Mail-Service  (server/server.js, Port 5000, bind LISTEN_HOST ?? 0.0.0.0)
  │
  ├─ cors(origin: FRONTEND_URL)          server/server.js:17-23
  ├─ express.json({ limit: '10mb' })     :24
  ├─ formLimiter (15 min / 5 pro IP)     :28-35   ← nur an 3 von 4 Formularrouten
  ├─ app.set('trust proxy', 1)           :13
  │
  ▼
SendGrid (@sendgrid/mail 8.x)  ──► E-Mail an interne Empfänger + ggf. an den Absender
                                    synchron, im Request-Lifecycle, ohne Retry
```

**Was in dieser Kette NICHT existiert:** keine Datenbank, kein Dateispeicher, keine Queue, kein Worker,
kein Retry, kein Dead-Letter, kein CRM, kein Idempotenzschlüssel, kein Webhook-Rückkanal.

Zwei Instanzen laufen laut `docs/deploy-preview.md` und `docker-compose.yml`:
Produktion `127.0.0.1:5000` (ohne `DRY_RUN`) und Preview `127.0.0.1:5001` (mit `DRY_RUN=1`).
`DRY_RUN` ersetzt `sgMail.send` global durch einen Logger-Stub (`server/server.js:56-63`) — der einzige
existierende Schutz gegen produktive Side Effects aus Preview.

---

## 4. Frontend Submission Journeys

**Sechs aktive Journeys.** Die Felder sind bis in den Request-Body verfolgt, nicht aus Labels abgeleitet.
Vier `fetch(`-Aufrufe existieren im gesamten `src/`-Baum (`src/api/contact.ts:22`, `src/api/support.ts:22`,
`src/api/consumerOrder.ts:40`, `src/components/sections/RoiCalculatorSection.tsx:110`); zwei weitere
Journeys teilen sich `src/api/contact.ts`.

### J1 — General Contact

| Aspekt                            | Ist                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Seite/Komponente                  | `src/pages/ContactPage.tsx` → `src/components/sections/ContactForm.tsx`                                                                                                        |
| Client/Helper                     | `src/hooks/useContactForm.ts` → `src/api/contact.ts` `sendContactEmail`                                                                                                        |
| Endpoint / Methode / Content-Type | `POST /api/contact` · `application/json`                                                                                                                                       |
| Gesendete Felder                  | `name`, `email`, `company`, `phone`, `area`, `requirements`, `message`, `consent`, `_hp`, **`intent`**, **`field`** (`useContactForm.ts:60-75`)                                |
| Pflicht (Client)                  | `name.length ≥ 2`, gültige E-Mail, `consent === true` (`useContactForm.ts:41`)                                                                                                 |
| Besonderheit                      | `message` wird **client-seitig komponiert**: `Anliegen: …`, `Bereich: …`, optional `Herkunft: …`, dann Freitext (`useContactForm.ts:53-59`). Der Server rendert nur `message`. |
| Herkunft/Kampagne                 | `?source=epigenetics` + `?panel=…` aus der URL → `submissionSource`, als `Herkunft:`-Zeile in `message` (`ContactForm.tsx` Zeilen um `:74`/`:206`)                             |
| Submit-Prevention                 | Kein `if (isSubmitting) return` am Funktionsanfang; nur `disabled`-Attribut am Button                                                                                          |
| Loading/Success/Error             | `isSubmitting` / `submitStatus` aus dem Hook; Fokus wandert auf Success- bzw. Error-Region (`ContactForm.tsx:166-167`)                                                         |
| Retry                             | keiner                                                                                                                                                                         |
| Sprache                           | Payload-Werte sind übersetzte Labels (`t(...)`); Antwortmail ist deutsch                                                                                                       |
| Consent-Feld                      | `consent: true` — client-seitig erzwungen, dann hart gesetzt (`useContactForm.ts:70`)                                                                                          |
| Tracking                          | **keines in dieser Komponente**                                                                                                                                                |

### J2 — Praxis Order (kontextuelle Contact-Variante)

| Aspekt            | Ist                                                                                                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seite/Komponente  | `src/components/sections/PraxisOrderForm.tsx` (u. a. Vitamin-D3-Spray-Strecke)                                                                                                                |
| Client/Helper     | **direkt** `sendContactEmail` — umgeht `useContactForm` (`PraxisOrderForm.tsx:110`)                                                                                                           |
| Endpoint          | `POST /api/contact` — **derselbe Endpunkt wie J1**                                                                                                                                            |
| Gesendete Felder  | `name` (aus `ansprechpartner`), `email`, `phone`, `company` (aus `praxisName`), `area`, `message`, `consent: true` (`:111-119`)                                                               |
| Besonderheit      | `message` enthält `BESTELLUNG <orderName>`, Menge, Lieferadresse und Anmerkungen als **Freitext**. `area` trägt den Marker, den das Backend zur Empfängerumleitung auswertet (§5, R-Contact). |
| Consent           | **hart `consent: true` gesetzt, ohne Nutzer-Checkbox** — der Kommentar begründet das mit „Submitting this order constitutes the agreement to be contacted" (`:117-118`)                       |
| Submit-Prevention | keine Eingangs-Guard; `isSubmitting`-State existiert                                                                                                                                          |
| Tracking          | keines                                                                                                                                                                                        |

### J3 — Support

| Aspekt              | Ist                                                                                                                                                                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seite/Komponente    | `src/pages/SupportPage.tsx` → `src/components/sections/SupportForm.tsx`                                                                                                                                                                            |
| Client/Helper       | `src/hooks/useSupportForm.ts` → `src/api/support.ts` `sendSupportEmail`                                                                                                                                                                            |
| Endpoint            | `POST /api/support` · `application/json`                                                                                                                                                                                                           |
| Gesendete Felder    | `name`, `email`, `udi`, `swVersion`, `issueType`, `subject`, `description`, `consent: true`, `_hp`, optional `attachment{filename, content(base64), type}`                                                                                         |
| Eingabequelle       | natives `FormData` → Typprüfung auf String (`useSupportForm.ts:29-42`)                                                                                                                                                                             |
| Client-Validierung  | alle sieben Textfelder `required` im Markup (`SupportForm.tsx:53,62,72,87,104,124,175`); Anhang ≤ 5 MB (`useSupportForm.ts:62`); MIME-Allowlist gespiegelt (`:73-83`); `accept=".pdf,image/png,image/jpeg,image/gif,.txt"` (`SupportForm.tsx:158`) |
| Anhang-Verarbeitung | `arrayBuffer()` → `btoa(...)` Base64 im Browser (`useSupportForm.ts:88-95`)                                                                                                                                                                        |
| Sprache             | Antwort-/Bestätigungsmail hartcodiert deutsch                                                                                                                                                                                                      |
| Tracking            | keines                                                                                                                                                                                                                                             |

### J4 — Consumer Order

| Aspekt                  | Ist                                                                                                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seite/Komponente        | `src/pages/consumer/{SprayPage,MaskPage,DuoPage}.tsx` → `OrderModal.tsx` → `OrderForm.tsx`                                                                        |
| Client/Helper           | `src/api/consumerOrder.ts` `sendConsumerOrder` (`OrderForm.tsx:144`)                                                                                              |
| Endpoint                | `POST /api/consumer-order` · `application/json`                                                                                                                   |
| Gesendete Felder        | `product`, `quantity`, `name`, `email`, `phone?`, `company?`, `street?`, `postcode?`, `city?`, `country?`, `message?`, `consent`, `_hp` (`OrderForm.tsx:144-158`) |
| Normalisierung (Client) | `.trim()`, leere Optionalfelder → `undefined` (also nicht im JSON)                                                                                                |
| Client-Validierung      | nur `consent` wird explizit geprüft (`OrderForm.tsx:136-140`); Rest über HTML-`required`                                                                          |
| Submit-Prevention       | **einzige Journey mit Eingangs-Guard**: `if (status === 'submitting') return` (`OrderForm.tsx:135`) — plus `submittedRef` im Modal (`OrderModal.tsx:100,128`)     |
| Sprache                 | Seiten sind hartcodiertes Englisch (0 × `useTranslation`); Fehlermeldungen englische String-Literale (`OrderForm.tsx:137`, `:172`)                                |
| Tracking                | **ja** — `window.dataLayer.push({event:'consumer_order_submit', consumer_page, product, quantity})` (`OrderForm.tsx:162-168`), ohne Consent-Prüfung               |

### J5 — ROI Report (Lead-Magnet, ungegated)

| Aspekt             | Ist                                                                                                                                                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seite/Komponente   | `src/pages/HomePage.tsx` → `src/components/sections/RoiCalculatorSection.tsx` (`#roi-rechner`)                                                                                                                                                    |
| Client/Helper      | **kein** `src/api/`-Client — `fetch` steht inline (`:110`)                                                                                                                                                                                        |
| Endpoint           | `POST /api/roi-report` · `application/json`                                                                                                                                                                                                       |
| Gesendete Felder   | `email`, `area`, `practice`, `consent`, `_hp`, `inputs{testsPerMonth, pricePerTest, materialCostPerTest, minutesPerTest, staffCostPerHour, deviceInvestment}`, `outputs{dbPerTest, dbPerMonth, dbPerYear, revenuePerMonth, payback}` (`:113-127`) |
| Client-Validierung | E-Mail-Regex, `consent === true`, `hp === ''` (`:101-104`)                                                                                                                                                                                        |
| Besonderheit       | Ein **veralteter TODO-Kommentar** direkt über dem `fetch` behauptet, der Endpunkt sei „noch nicht live" (`:108`) — er ist live (`server/server.js:636`)                                                                                           |
| Zustellung         | Nutzer erhält PDF-Report, Team erhält Lead-Mail (§10)                                                                                                                                                                                             |
| Tracking           | keines                                                                                                                                                                                                                                            |

### J6 — Chat Widget (Drittanbieter-Skript)

| Aspekt     | Ist                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Komponente | `src/components/ui/ChatWidget.tsx` (28 Zeilen), eingehängt in `src/App.tsx` `MainLayout`                                                                |
| Verhalten  | injiziert `<script src="https://widget.hihuman.co.uk/bundle.js">` mit hartcodierter Bot-ID-Konstante in `document.body`, **beim Mount, ohne Bedingung** |
| Endpoint   | **keiner** — die Komponente ruft `/api/chat` nicht auf; `fetch`/`axios` kommen darin nicht vor                                                          |
| Consent    | **keine Prüfung** — der Request an den Drittanbieter entsteht vor jeder Einwilligung                                                                    |
| Rendert    | `null` (die UI kommt aus dem Fremdskript)                                                                                                               |

> **Wichtige Korrektur an älterer Repository-Dokumentation:** `projektverzeichnis/10-befunde.md` §10
> beschreibt „das Chat-Widget" als Mock. Das gilt für den **Endpunkt** `/api/chat`, der feste Strings
> zurückgibt und **keinen Aufrufer hat**. Das **Widget** dagegen lädt ein echtes Drittanbieter-Skript.
> Beide Reste sind vorhanden und voneinander unabhängig.

**Nicht gefunden:** kein Newsletter-Flow, kein Download-Gate, kein Inquiry-Flow außerhalb von J1,
kein `axios`, kein `FormData`-POST, keine weitere `/api/`-Referenz im gesamten `src/`-Baum.

---

## 5. Backend Endpoint Inventory

Vollständig; fünf Endpunkte, alle `POST`, alle in `server/server.js`.

| #   | Route                 | Zeile  | Rate Limiter     | Honeypot | Consent-Pflicht             | Frontend-Aufrufer |
| --- | --------------------- | ------ | ---------------- | -------- | --------------------------- | ----------------- |
| E1  | `/api/contact`        | `:66`  | ✅ `formLimiter` | ✅ `_hp` | ✅ `consent !== true` → 400 | J1, J2            |
| E2  | `/api/support`        | `:143` | ✅ `formLimiter` | ✅ `_hp` | ✅                          | J3                |
| E3  | `/api/consumer-order` | `:338` | ❌ **keiner**    | ✅ `_hp` | ✅                          | J4                |
| E4  | `/api/chat`           | `:503` | ❌ keiner        | ❌       | ❌                          | **keiner**        |
| E5  | `/api/roi-report`     | `:636` | ✅ `formLimiter` | ✅ `_hp` | ✅                          | J5                |

Globale Middleware: `app.set('trust proxy', 1)` (`:13`, mit dokumentierter Begründung für die
Vertrauenswürdigkeit von `req.ip`), `cors({origin: FRONTEND_URL, methods:['POST','OPTIONS'], allowedHeaders:['Content-Type']})` (`:17-23`), `express.json({limit:'10mb'})` (`:24`).
`formLimiter`: `windowMs` 15 min, `max` 5 pro IP, `standardHeaders: true`, Antwort `{success:false, error:'Too many requests, please try later.'}` (`:28-35`).

### E1 `/api/contact`

- **Akzeptiert:** `name, email, message, company, phone, area, requirements, consent, _hp` (`:67-68`). **`intent` und `field` werden vom Client gesendet, aber nicht destrukturiert — sie fallen still weg.**
- **Pflicht:** `consent === true`; `name`, `email`, `message`; E-Mail-Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
- **Normalisierung:** keine (kein `trim`, keine Längenbegrenzung). Sanitisierung nur im HTML-Zweig über `esc()`; **der `text`-Zweig bleibt unescaped** (bei text/plain unkritisch).
- **Generierte IDs:** keine.
- **Empfängerlogik:** enthält `area` die Zeichenkette `Vitamin D3+K2 Spray BESTELLUNG`, geht die Mail an eine **hartcodierte** Einzeladresse statt an `CONTACT_RECEIVER` (`:91-94`). Der Marker stammt aus einem vom Client kontrollierten Feld.
- **Erfolg:** `200 {success:true}`. **Honeypot ebenfalls `200 {success:true}`** ohne Versand (`:72-76`).
- **Fehler:** `400 {error:'Consent required.'}` · `400 {error:'Name, email, and message are required.'}` · `400 {error:'Invalid email.'}` · `500 {success:false, error:'Failed to send email'}`.
- **Side Effect:** eine SendGrid-Mail, synchron.
- **Logging:** `:73` Honeypot, `:130` `'Email sent successfully'`, `:134/:136` Fehler + SendGrid-Body.
- **Tests:** keine.

### E2 `/api/support`

- **Akzeptiert:** `name, email, udi, swVersion, issueType, subject, description, attachment, consent, _hp` (`:145-157`).
- **Pflicht:** `consent`; `name, email, udi, swVersion, issueType, subject` (**`description` ist nicht Pflicht**, obwohl im Markup `required`).
- **Anhang-Validierung** (`:239-263`): `content` und `filename` müssen nichtleere Strings sein; `type` muss in `['application/pdf','image/png','image/jpeg','image/gif','text/plain']` liegen; Größe wird aus der Base64-Länge geschätzt (`Math.floor(len*3/4)`, bewusst überschätzend) und auf 5 MB begrenzt. Verstoß → `400 {error:'Invalid attachment.'}`.
- **Erfolg:** `200 {success:true}` nach **zwei** Mails via `Promise.all` (`:290`).
- **Fehler:** `400` (Consent / Pflichtfelder / E-Mail / Anhang) · `500 {success:false, error:'Failed to send support email'}`.
- **Side Effects:** interne Team-Mail an `CONTACT_RECEIVER` **plus drei hartcodierte interne Adressen** (redigiert, §10) mit `X-Priority: 1`; **Bestätigungsmail an den Nutzer**.
- **Tests:** keine.

### E3 `/api/consumer-order`

- **Akzeptiert:** `product, quantity, name, email, phone, company, street, postcode, city, country, message, consent, _hp` (`:340-359`).
- **Pflicht:** `consent`; `product` muss Schlüssel von `CONSUMER_PRODUCT_LABELS` sein (`spray|masks|duo`) — sonst `400 {error:'Unknown product.'}`; `name`, `email`, `quantity`; E-Mail-Regex.
- **Empfänger:** vier **hartcodierte** interne Adressen als Modulkonstante (`:414-419`); ausdrücklich nicht aus dem Body, „to prevent the form being used as a relay" (`:404-405`).
- **Erfolg:** `200 {success:true}`. **Fehler:** `400` (drei Varianten) · `500 {success:false, error:'Failed to send order'}`.
- **Rate Limit:** **keines** — `app.post('/api/consumer-order', async (req,res) …)` ohne Limiter-Argument (`:338`).
- **Logging:** `:480` `[consumer-order] sent: product=… qty=… from=<E-MAIL>` — **loggt die E-Mail-Adresse**.
- **Tests:** keine.

### E4 `/api/chat`

- **Akzeptiert:** `message` (`:505`). Keine Validierung, kein Consent, kein Honeypot, kein Limiter.
- **Verhalten:** 1 000 ms künstliche Verzögerung (`:508`), dann Rückgabe eines von vier festen deutschen Strings anhand von Substring-Prüfungen (`:511-521`).
- **Erfolg:** `200 {reply: string}`. **Fehler:** `500 {error:'Chat service error'}`.
- **Robustheit:** fehlt `message`, wirft `message.toLowerCase()` einen `TypeError`, der im `catch` landet ⇒ **`500` statt `400`** bei fehlerhaftem Payload.
- **Side Effects:** keine. **Aufrufer:** keiner.
- **Tests:** keine.

### E5 `/api/roi-report`

- **Akzeptiert:** `email, area, practice, consent, _hp, inputs = {}, outputs = {}` (`:638`).
- **Pflicht:** `consent`; `email` + Regex. **`inputs`/`outputs` werden nicht validiert** — beliebige Struktur wird in PDF und Mail übernommen (zahlenformatiert über `eur()`, das nicht-numerische Werte zu `0 €` macht, bzw. HTML-escaped über `esc()`).
- **PDF:** `buildRoiPdf()` (`:589-634`) erzeugt mit `pdfkit` ein A4-Dokument im Speicher. Schlägt es fehl, wird der Fehler geloggt und die Mail **ohne Anhang** versendet (`:672-681`) — bewusst best-effort.
- **Erfolg:** `200 {success:true}` nach **zwei** Mails via `Promise.all` (`:712`).
- **Fehler:** `400 {error:'Consent required.'}` · `400 {error:'Invalid email.'}` · `500 {success:false, error:'Failed to process ROI report'}`.
- **Side Effects:** Lead-Mail an vier hartcodierte interne Adressen (`:575-580`, redigiert) + Report-Mail mit PDF an den Anfragenden.
- **Logging:** `:713` `[roi-report] processed lead from <E-MAIL> (area=…)` — **loggt die E-Mail-Adresse**.
- **Opt-in-Modell:** der Kommentar (`:564-567`) hält ausdrücklich fest, dass **Single-Opt-in** implementiert ist und Double-Opt-in „einen persistenten Token-Store" bräuchte und deshalb bewusst fehlt.
- **Tests:** keine.

---

## 6. Exact Request / Response Contracts

### C1 — General Contact (J1 → E1)

**Frontend-Payload** (`useContactForm.ts:60-75`):

```json
{
  "name": "…",
  "email": "…",
  "company": "…",
  "phone": "…",
  "area": "<fieldLabel|field|'-'>",
  "requirements": "…",
  "message": "Anliegen: …\nBereich: …\n[Herkunft: …]\n\n<Freitext>",
  "consent": true,
  "_hp": "",
  "intent": "quote",
  "field": "dental"
}
```

**Backend erwartet** (`server/server.js:67-68`):

```json
{ "name","email","message","company","phone","area","requirements","consent","_hp" }
```

**Erfolg:** `HTTP 200 {"success": true}` · **Fehler:** `400 {"error":"Consent required."}` · `400 {"error":"Name, email, and message are required."}` · `400 {"error":"Invalid email."}` · `429` (Limiter) · `500 {"success":false,"error":"Failed to send email"}`

**Mismatches:**

- **M1** `intent` und `field` werden gesendet, aber nie destrukturiert → **stiller Datenverlust**. Der Client kommentiert das als beabsichtigt („the server safely ignores unknown fields", `useContactForm.ts:73`), fachlich geht die strukturierte Absicht dennoch verloren und existiert nur noch als Prosa in `message`.
- **M2** Der Client wertet nur `response.ok` und `result.success === true` aus (`api/contact.ts:31-36`) — **die `error`-Strings der 400er werden verworfen.** Der Nutzer sieht bei jedem Fehler dieselbe generische Meldung.
- **M3** `429` ist client-seitig nicht von `500` unterscheidbar.

### C2 — Praxis Order (J2 → E1)

**Frontend-Payload** (`PraxisOrderForm.tsx:110-120`): `{name, email, phone, company, area, message, consent:true}` — **ohne `_hp`**, ohne `requirements`.
**Erfolg/Fehler:** wie C1.
**Mismatches:**

- **M4** Kein Honeypot-Feld → J2 verzichtet als einzige Contact-Variante auf den Spam-Schutz, den der Endpunkt anbietet.
- **M5** Bestell-Semantik reist als Freitext in `message`; Menge, Produkt und Lieferadresse sind serverseitig **nicht strukturiert verfügbar**.
- **M6** Die Empfängerumleitung hängt an einem Substring in `area` (`:92`), also an einem vom Client gelieferten Wert.

### C3 — Support (J3 → E2)

**Frontend-Payload:** `{name, email, udi, swVersion, issueType, subject, description, consent:true, _hp, attachment?{filename, content, type}}`
**Erfolg:** `200 {"success":true}` · **Fehler:** `400 {"error":"Consent required."|"Required fields are missing."|"Invalid email."|"Invalid attachment."}` · `429` · `500`
**Mismatch:**

- **M7** `description` ist im Markup `required`, serverseitig aber optional — die Validierungen sind asymmetrisch.
- **M8** Base64-Erweiterung: eine 5-MB-Datei wird zu ~6,7 MB Base64. Zusammen mit dem Rest bleibt das unter `express.json({limit:'10mb'})`, aber der Abstand beträgt weniger als 3 MB und ist an keiner Stelle als Invariante dokumentiert.

### C4 — Consumer Order (J4 → E3)

**Frontend-Payload:** `{product, quantity, name, email, phone?, company?, street?, postcode?, city?, country?, message?, consent, _hp}` — Optionalfelder werden bei leerem Wert **weggelassen** (`undefined` ⇒ nicht im JSON).
**Erfolg:** `200 {"success":true}` · **Fehler:** `400 {"error":"Consent required."|"Unknown product."|"Required fields are missing."|"Invalid email."}` · `500 {"success":false,"error":"Failed to send order"}`
**Besonderheit:** Der Client **liest die `error`-Strings tatsächlich aus** (`consumerOrder.ts:43-52`) und zeigt sie an — als einzige der vier Journeys. Die Strings sind englisch und untranslatiert.
**Mismatch:**

- **M9** Kein `429` möglich, weil kein Limiter existiert.

### C5 — ROI Report (J5 → E5)

**Frontend-Payload:** `{email, area, practice, consent, _hp, inputs{…6 Felder}, outputs{…5 Felder}}`
**Erfolg:** `200 {"success":true}` · **Fehler:** `400 {"error":"Consent required."|"Invalid email."}` · `429` · `500`
**Mismatches:**

- **M10** Der Client prüft nur `res.ok` und wirft sonst `new Error('request failed')` (`RoiCalculatorSection.tsx:130-133`) — Fehlerdetails verfallen.
- **M11** `outputs` wird vom Client berechnet und ungeprüft übernommen: **die im PDF und in der Lead-Mail gedruckten Ergebniszahlen sind Client-Eingaben**, keine Serverberechnung.

### C6 — Chat (E4, ohne Aufrufer)

**Erwartet:** `{message: string}` · **Erfolg:** `200 {"reply": string}` · **Fehler:** `500 {"error":"Chat service error"}`.
**Mismatch:** **M12** kein Frontend-Aufrufer; der Endpunkt ist verwaist.

---

## 7. Persistence

**Ergebnis: `NO_PERSISTENCE` für alle sechs Journeys.**

Evidenz, drei unabhängige Prüfungen:

1. **Dependency-Manifest** — `server/package.json` `dependencies`: `@sendgrid/mail`, `cors`, `dotenv`, `express`, `express-rate-limit`, `pdfkit`. Keine Datenbank-, ORM-, Queue- oder Cache-Bibliothek.
2. **Root-Manifest** — Filter über `dependencies` + `devDependencies` nach `sql|postgres|mysql|mongo|redis|prisma|knex|sequelize|typeorm|bull|amqp|rabbit|sqs|kafka|queue|lowdb|nedb` → **leeres Ergebnis**.
3. **Quellcode** — Grep über `server/` und `src/` nach denselben Begriffen → leer. Grep in `server/server.js` nach `require('fs')|writeFile|appendFile|createWriteStream|fs.` → **leer**.

| Journey            | Klassifikation                            |
| ------------------ | ----------------------------------------- |
| J1 General Contact | **NO_PERSISTENCE**                        |
| J2 Praxis Order    | **NO_PERSISTENCE**                        |
| J3 Support         | **NO_PERSISTENCE**                        |
| J4 Consumer Order  | **NO_PERSISTENCE**                        |
| J5 ROI Report      | **NO_PERSISTENCE**                        |
| J6 Chat Widget     | **NO_PERSISTENCE** (kein Backend-Kontakt) |

Der einzige Ort, an dem Daten dauerhaft landen, ist das **Postfach der Empfänger** — und das PDF des
ROI-Reports, das im Speicher erzeugt, als Base64 angehängt und danach verworfen wird (`server/server.js:672-681`).

> **E-Mail-Zustellung ist keine Persistenz.** SendGrid ist ein Zustelldienst ohne Rückkanal in diese
> Anwendung: es gibt keinen Webhook, keinen Status-Callback und keine Möglichkeit, aus dem System heraus
> festzustellen, ob eine Nachricht angekommen ist.

---

## 8. Queue, Retry and Delivery

**Ergebnis: keine Queue, kein Retry, kein Dead-Letter, kein Replay.** Grep über `server/server.js`,
`src/api/`, `src/hooks/use*Form.ts` nach `queue|worker|retry|backoff|dead-letter|dlq|cron|setInterval|attempt|replay|idempoten` → leer.

| Side Effect                | Sync/Async                                | Retry  | Timeout                               | Fehlerbehandlung                       | Request wiederherstellbar? | Doppelzustellung möglich? | Manueller Replay |
| -------------------------- | ----------------------------------------- | ------ | ------------------------------------- | -------------------------------------- | -------------------------- | ------------------------- | ---------------- |
| E1 Kontakt-Mail            | **synchron** `await sgMail.send` (`:129`) | keiner | keiner gesetzt (SendGrid-SDK-Default) | `catch` → `500`                        | **nein — Daten verworfen** | ja (Nutzer sendet erneut) | keiner           |
| E2 Team-Mail + Bestätigung | **synchron**, `Promise.all` (`:290`)      | keiner | keiner                                | `catch` → `500`                        | **nein**                   | ja                        | keiner           |
| E3 Bestell-Mail            | **synchron** (`:479`)                     | keiner | keiner                                | `catch` → `500`                        | **nein**                   | ja                        | keiner           |
| E5 PDF-Erzeugung           | **synchron**, im Request (`:673`)         | keiner | keiner                                | eigener `catch` → Mail **ohne** Anhang | teilweise (Mail geht raus) | —                         | —                |
| E5 Lead-Mail + Report-Mail | **synchron**, `Promise.all` (`:712`)      | keiner | keiner                                | `catch` → `500`                        | **nein**                   | ja                        | keiner           |

**Teilzustellung, unbehandelt:** `Promise.all` bei E2 und E5 bedeutet — scheitert die zweite Mail, während
die erste bereits versendet ist, wird die gesamte Anfrage als `500` gemeldet. Der Nutzer sendet erneut,
und die **erste** Mail geht ein zweites Mal hinaus. Es gibt keine Kompensationslogik.

**PDF im Request-Lifecycle:** `buildRoiPdf` läuft synchron innerhalb des Handlers. Die Antwortzeit von
`/api/roi-report` schließt PDF-Erzeugung **und** zwei SendGrid-Roundtrips ein.

---

## 9. Idempotency and Duplicate Handling

| Journey            | Klassifikation                            | Evidenz                                                                                                                                               |
| ------------------ | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| J1 General Contact | **NO_IDEMPOTENCY**                        | kein Key, kein Dedupe; kein Eingangs-Guard vor `submit()` (`ContactForm.tsx:196`) — nur `disabled`-Attribut                                           |
| J2 Praxis Order    | **NO_IDEMPOTENCY**                        | kein Guard, kein Key                                                                                                                                  |
| J3 Support         | **NO_IDEMPOTENCY**                        | kein Guard, kein Key                                                                                                                                  |
| J4 Consumer Order  | **CLIENT_DOUBLE_SUBMIT_PROTECTION** (nur) | `if (status === 'submitting') return` (`OrderForm.tsx:135`) + `submittedRef` (`OrderModal.tsx:100,128`). **Serverseitig weiterhin keinerlei Dedupe.** |
| J5 ROI Report      | **NO_IDEMPOTENCY**                        | kein Guard, kein Key                                                                                                                                  |

- **SERVER_IDEMPOTENCY:** existiert nirgends. Kein `Idempotency-Key`-Header wird gesendet oder gelesen; keine generierte Order-/Request-ID (Grep nach `idempotency|orderId|requestId|uuid|randomUUID|nanoid` → leer).
- **DELIVERY_IDEMPOTENCY:** existiert nicht. SendGrid wird ohne Deduplizierungsmerkmal aufgerufen; identische Nachrichten werden mehrfach zugestellt.
- **Praktische Folge:** ein Doppelklick auf J1, J2, J3 oder J5 erzeugt zwei vollständige Zustellungen. Nur die `disabled`-Attribute am Button verhindern das teilweise — sie greifen erst, nachdem React neu gerendert hat.

---

## 10. SendGrid / Email / PDF Side Effects

**Bibliothek:** `@sendgrid/mail` ^8.1.6 (`server/package.json`).
**Initialisierung:** `require('@sendgrid/mail')` (`server/server.js:2`); `sgMail.setApiKey(process.env.SENDGRID_API_KEY)` nur wenn die Variable gesetzt ist (`:51-53`).
**Startprüfung:** `['SENDGRID_API_KEY','CONTACT_RECEIVER','SENDER_EMAIL']` werden geprüft; fehlen sie, wird **gewarnt, aber der Start nicht abgebrochen** (`:38-45`) — der Dienst läuft dann an und scheitert erst beim Versand.

**`DRY_RUN`-Kill-Switch** (`:56-63`): bei `DRY_RUN=1`/`true` wird `sgMail.send` global durch einen Stub
ersetzt, der Empfänger und Betreff loggt und `[{statusCode:202},{}]` zurückgibt. Laut `docs/deploy-preview.md`
läuft die Preview-Instanz auf `:5001` damit; Produktion auf `:5000` ohne. **`docker-compose.yml` setzt
`DRY_RUN` nicht** — der Backend-Service bezieht seine Umgebung ausschließlich über `env_file: ./server/.env`.

**Absender:** `process.env.SENDER_EMAIL` in allen Mails; muss ein in SendGrid verifizierter Sender sein (`:99`).

**Empfänger — redigiert, nach Rolle beschrieben:**

| Endpunkt            | Empfängerquelle                                                                                                                    | Anzahl          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| E1 Standardfall     | `process.env.CONTACT_RECEIVER`                                                                                                     | 1, konfiguriert |
| E1 Spray-Bestellung | **eine hartcodierte persönliche `@polarisdx.net`-Adresse** (Vertrieb), Modulkonstante `SPRAY_ORDER_RECIPIENT` (`:91`)              | 1, im Code      |
| E2 Support-Team     | `CONTACT_RECEIVER` **plus drei hartcodierte persönliche `@polarisdx.net`-Adressen** (`:211-216`)                                   | 4               |
| E3 Consumer Order   | **vier hartcodierte Adressen** — drei persönliche + ein Funktionspostfach, Modulkonstante `CONSUMER_ORDER_RECIPIENTS` (`:414-419`) | 4               |
| E5 ROI Lead         | **vier hartcodierte Adressen**, Modulkonstante `ROI_REPORT_RECIPIENTS` (`:575-580`)                                                | 4               |
| E2/E5 an den Nutzer | `email` aus dem Request-Body                                                                                                       | 1               |

> Insgesamt **zwölf hartcodierte Empfängereinträge** über vier Modulkonstanten. Personelle Änderungen
> erfordern einen Code-Deploy. Die konkreten Adressen sind hier bewusst nicht wiedergegeben.

**Betreffkonstruktion** (alle deutsch, alle mit Nutzerdaten interpoliert):
`Neue Kontaktanfrage von ${name}` · `[HIGH PRIORITY] Support-Anfrage: ${subject}` ·
`Ihre Support-Anfrage wurde empfangen: ${subject}` · `Neue Bestellung — ${productLabel} (${quantity}x)` ·
`Neuer ROI-Report-Lead — ${area} (${email})` · `Ihr IglooPro ROI-Report`.
**Der ROI-Lead-Betreff enthält die E-Mail-Adresse des Anfragenden im Klartext** (`:686`).

**HTML/Text-Erzeugung:** jede Mail wird in `text` **und** `html` gebaut. Im HTML-Zweig läuft jeder
Nutzerwert durch `esc()` (`:424-431`) — fünf Zeichen, `&` zuerst; Zeilenumbrüche werden erst **nach**
dem Escaping zu `<br>`. **Der `text`-Zweig ist nicht escaped** (bei `text/plain` ohne Wirkung).

**Autoresponder / Bestätigungsmails:** nur E2 (Support-Bestätigung, `:265-287`) und E5 (Report an den
Anfragenden, `:695-709`). E1, E2-Praxis-Variante, E3 senden **keine** Empfangsbestätigung.
**Alle Autoresponder sind hartcodiert deutsch** — auch für Nutzer, die die Site auf Englisch, Polnisch
oder Tschechisch bedienen. Der Support-Autoresponder enthält zusätzlich eine hartcodierte Telefonnummer
und eine Kontaktadresse in Text und HTML.

**Anhänge:** E2 reicht den vom Client gelieferten Base64-Anhang nach Allowlist- und Größenprüfung durch.
E5 erzeugt sein PDF selbst.

**PDF-Erzeugung (E5):** `pdfkit` ^0.15.0. `buildRoiPdf()` (`:589-634`) baut ein A4-Dokument im Speicher
(Chunks → `Buffer.concat`), mit Praxisname, Fachrichtung, sechs Eingabewerten und fünf Ergebniswerten,
Beträge über `Intl.NumberFormat('de-DE', {currency:'EUR'})` — **fest deutsch formatiert**. Der Fußtext
enthält den Claim `CV < 2 %` (`:626-630`). Schlägt die Erzeugung fehl, wird geloggt und **ohne Anhang**
weiter versendet (`:678-680`).

**Provider-Fehlerbehandlung:** jeder Endpunkt hat ein `try/catch`, das `console.error(...)` schreibt,
bei vorhandenem `error.response` zusätzlich `console.error(error.response.body)`, und `500` antwortet.
**Kein Retry, kein Timeout, kein Circuit Breaker, keine Unterscheidung zwischen 4xx und 5xx des Providers.**

**Antwort auf die Kernfrage:** **Ja — der Mailversand findet vollständig innerhalb des
HTTP-Request-Lifecycles statt.** In allen fünf versendenden Endpunkten steht das `await` auf `sgMail.send`
vor dem `res.status(200)`.

---

## 11. Personal Data Field Map

Feldweise, pro Journey. „Extern" = SendGrid + Empfängerpostfach. „Logged?" ist nur dort `JA`, wo eine
konkrete `console.*`-Zeile den Wert ausgibt.

| Field                                   | Journey        | Required?              | Backend Use                                                      | External Destination                 | Logged?                             |
| --------------------------------------- | -------------- | ---------------------- | ---------------------------------------------------------------- | ------------------------------------ | ----------------------------------- |
| `name`                                  | J1, J2, J3     | ja                     | Betreff + Mail-Body                                              | SendGrid + Empfänger                 | NEIN                                |
| `name`                                  | J4             | ja                     | Mail-Body                                                        | SendGrid + 4 Empfänger               | NEIN                                |
| `email`                                 | J1, J2         | ja                     | `replyTo` + Body                                                 | SendGrid + Empfänger                 | NEIN                                |
| `email`                                 | J3             | ja                     | `replyTo` + Body + **Empfänger der Bestätigung**                 | SendGrid + Empfänger + Nutzer        | NEIN                                |
| `email`                                 | J4             | ja                     | `replyTo` + Body                                                 | SendGrid + 4 Empfänger               | **JA** (`:480`)                     |
| `email`                                 | J5             | ja                     | `replyTo` + **Betreff** + Body + Empfänger des Reports           | SendGrid + 4 Empfänger + Nutzer      | **JA** (`:713`)                     |
| `phone`                                 | J1, J2, J4     | nein                   | Body                                                             | SendGrid + Empfänger                 | NEIN                                |
| `company` / `praxisName`                | J1, J2, J4     | nein                   | Body                                                             | SendGrid + Empfänger                 | NEIN                                |
| `practice`                              | J5             | nein                   | Body + **PDF-Kopf**                                              | SendGrid + 4 Empfänger + PDF         | NEIN                                |
| `street`, `postcode`, `city`, `country` | J4             | nein                   | Body + Adresszusammenfassung                                     | SendGrid + 4 Empfänger               | NEIN                                |
| Lieferadresse als Freitext              | J2             | ja (in `message`)      | Body                                                             | SendGrid + Empfänger                 | NEIN                                |
| `message` / `requirements` (Freitext)   | J1, J2, J4     | J1 ja / sonst nein     | Body                                                             | SendGrid + Empfänger                 | NEIN                                |
| `description` (Freitext)                | J3             | Client ja, Server nein | Body                                                             | SendGrid + 4 Empfänger               | NEIN                                |
| `area` / `field` / `intent`             | J1             | `area` ja              | `area` steuert **Empfängerwahl**; `field`/`intent` **verworfen** | SendGrid + Empfänger                 | NEIN                                |
| `area` (Fachrichtung)                   | J5             | nein                   | Betreff + Body + PDF                                             | SendGrid + 4 Empfänger + PDF         | **JA** (`:713`)                     |
| `product`, `quantity`                   | J4             | ja                     | Betreff + Body                                                   | SendGrid + 4 Empfänger               | **JA** (`:480`, ohne PII)           |
| `udi` (Geräte-UDI)                      | J3             | ja                     | Body + Bestätigung                                               | SendGrid + 4 Empfänger + Nutzer      | NEIN                                |
| `swVersion`, `issueType`, `subject`     | J3             | ja                     | Body + **Betreff**                                               | SendGrid + 4 Empfänger + Nutzer      | NEIN                                |
| `attachment` (Datei)                    | J3             | nein                   | Anhang, durchgereicht                                            | SendGrid + 4 Empfänger               | NEIN (nur Typ bei Client-Ablehnung) |
| `inputs`/`outputs` (Praxiskennzahlen)   | J5             | nein                   | PDF + **`JSON.stringify` in der Lead-Mail** (`:685`)             | SendGrid + 4 Empfänger + PDF         | NEIN                                |
| `consent`                               | alle           | ja (≠ J2)              | Gate; **nicht gespeichert**                                      | nur als Prosa-Hinweis (J4)           | NEIN                                |
| `_hp` (Honeypot)                        | J1, J3, J4, J5 | nein                   | Drop-Gate                                                        | —                                    | nur „triggered"                     |
| `source` / `panel` (Kampagne)           | J1             | nein                   | als `Herkunft:`-Zeile in `message`                               | SendGrid + Empfänger                 | NEIN                                |
| IP-Adresse                              | alle           | implizit               | `req.ip` für `formLimiter` (in-memory)                           | —                                    | UNKNOWN                             |
| `consumer_page`, `product` (Tracking)   | J4             | —                      | **nicht ans Backend** — nur `window.dataLayer`                   | GTM/GA4 nach Container-Konfiguration | —                                   |

**Gesundheits-/medizinische Daten:** Keine Journey erhebt Patientendaten. Die medizinnächsten Felder sind
`issueType`/`description` (Gerätestörung, J3) und `area`/`field` (Fachrichtung der Praxis). Beides sind
**B2B-Betriebsdaten**, keine Gesundheitsdaten von Betroffenen. Ohne Gegenbeleg wird hier **nicht** als
Art.-9-Kategorie klassifiziert.

**Technische Metadaten:** kein User-Agent, kein Referrer, keine Session-ID, kein Zeitstempel wird
erhoben oder mitgesendet. Es gibt keine Server-seitige Anreicherung.

---

## 12. Consent and Privacy Semantics

Vier Konzepte, die im Ist-Zustand **strikt getrennte Mechanismen** sind:

| Typ                                      | Wo implementiert                                                                                            | Speicherort                                    | Erreicht das Backend? |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | --------------------- |
| **A — Cookie-/Tracking-Consent**         | `index.html:27-68` (Consent Mode v2 Defaults), `src/components/ui/CookieBanner.tsx`                         | `localStorage['cookie-consent']` (nur Browser) | **NEIN**              |
| **B — Formular-Datenschutz-Bestätigung** | Checkbox je Formular → `consent: boolean` im Payload                                                        | **nirgends** — nur als Gate ausgewertet        | **JA**, als Boolean   |
| **C — Marketing-Consent**                | **existiert nicht** als eigenes Feld                                                                        | —                                              | nein                  |
| **D — Vertrags-/Bestellabwicklung**      | nur als **Prosa** in der Consumer-Order-Mail: „DSGVO Art. 6 Abs. 1 lit. b" (`server/server.js:463`, `:499`) | —                                              | nein                  |

**Zentrale Feststellungen:**

1. **Cookie-Consent wird niemals zu Formular-Consent.** Es gibt keinen Code-Pfad, der `localStorage['cookie-consent']` liest und in einen Request-Body schreibt. Die beiden Systeme berühren sich nicht.
2. **Kein Endpunkt erhält Consent-Evidence.** Was ankommt, ist ein nacktes `consent === true`. Es gibt **keinen Zeitstempel, keine Textversion, keinen Umfang, keine IP, keine Kennung** — und nichts davon wird gespeichert (§7). Nach dem Versand existiert kein Nachweis mehr, dass eingewilligt wurde, außer dem Vorhandensein der Mail.
3. **J2 (Praxis Order) hat keine Consent-Checkbox.** `consent: true` wird hartcodiert gesetzt (`PraxisOrderForm.tsx:119`) mit der Begründung, die Bestellung selbst sei die Zustimmung. Das ist eine **Rechtsauffassung im Code**, keine erhobene Einwilligung — hier als Ist-Zustand vermerkt, nicht bewertet.
4. **Marketing- und Formular-Consent sind nicht getrennt.** J5 (ROI Report) verwendet dasselbe einzelne `consent`-Flag für eine transaktionale Zustellung **und** für die Lead-Weitergabe ans Vertriebsteam. Der Kommentar (`:564-567`) beschreibt das als bewusstes Single-Opt-in.
5. **Zwei Tracking-Pfade feuern ohne Consent-Prüfung:** `OrderForm.tsx:162-168` und `src/pages/consumer/tracking.ts:33-37` pushen direkt in `window.dataLayer`. Ob daraus ein Request wird, entscheidet allein die GTM-Container-Konfiguration.
6. **`ChatWidget.tsx` lädt ein Drittanbieter-Skript ohne jede Consent-Bedingung** (§4, J6). Das ist im Ist-Zustand der einzige Fall, in dem **die Anwendung selbst** vor der Einwilligung einen Drittanbieter kontaktiert.

---

## 13. Rate Limiting and Abuse Protection

| Endpunkt                 | Limiter      | Fenster / Limit   | Honeypot | Payload-Limit | Feldlängen | Anhänge                  | CAPTCHA | Origin-Prüfung |
| ------------------------ | ------------ | ----------------- | -------- | ------------- | ---------- | ------------------------ | ------- | -------------- |
| E1 `/api/contact`        | ✅           | 15 min / 5 pro IP | ✅       | 10 MB         | **keine**  | —                        | nein    | CORS           |
| E2 `/api/support`        | ✅           | 15 min / 5 pro IP | ✅       | 10 MB         | **keine**  | ✅ 5 MB + MIME-Allowlist | nein    | CORS           |
| E3 `/api/consumer-order` | ❌ **fehlt** | —                 | ✅       | 10 MB         | **keine**  | —                        | nein    | CORS           |
| E4 `/api/chat`           | ❌           | —                 | ❌       | 10 MB         | keine      | —                        | nein    | CORS           |
| E5 `/api/roi-report`     | ✅           | 15 min / 5 pro IP | ✅       | 10 MB         | **keine**  | —                        | nein    | CORS           |

**Verifikation des `/api/consumer-order`-Befunds** (nicht angenommen): die Zeile lautet
`app.post('/api/consumer-order', async (req, res) => {` (`server/server.js:338`) — ein zweites Argument
fehlt, während E1/E2/E5 `formLimiter` als zweites Argument führen (`:66`, `:143`, `:636`). **Der Befund
aus der vorherigen Analyse ist bestätigt.**

**`trust proxy`:** auf `1` gesetzt (`:13`) mit ausführlicher Begründung — genau ein Proxy-Hop wird
angenommen. Der Kommentar warnt ausdrücklich: ohne vorgelagerten Proxy könnte ein gefälschter
`X-Forwarded-For` den Limiter umgehen. Das Compose-Setup stellt den SSR-Server bzw. nginx davor, die
Annahme ist dort erfüllt.

**Limiter-Zustand ist In-Memory.** `express-rate-limit` verwendet ohne konfigurierten Store den
Default-MemoryStore. Der Zähler überlebt keinen Container-Neustart und wird bei mehreren Instanzen
**nicht geteilt**.

**CORS:** `origin: FRONTEND_URL || 'http://localhost:3000'`, nur `POST`/`OPTIONS`, nur `Content-Type`
(`:17-23`). Da alle Aufrufe über den SSR-Proxy gehen, ist CORS praktisch keine wirksame Abwehr gegen
direkte Server-zu-Server-Aufrufe.

**CSRF:** kein Token, keine SameSite-Betrachtung. Relevanz ist gering, weil die Endpunkte weder Cookies
noch Sessions verwenden und rein `application/json` annehmen — ein klassisches Cross-Site-Formular kann
keinen JSON-Content-Type ohne Preflight setzen.

**XSS/Injection:** `esc()` (`:424-431`) escapt fünf Zeichen im HTML-Zweig aller Mails; die Reihenfolge
(`&` zuerst) und das Muster „escape, dann `\n → <br>`" sind durch Unit-Tests abgesichert (§16).

**Informationsleck in Fehlern:** die Antwortkörper sind generisch (`'Failed to send email'` usw.) und
enthalten keine Interna. **Die Logs jedoch schon** (§14).

**Fehlend über alle Endpunkte:** kein CAPTCHA, keine Feldlängenbegrenzung, kein Schema-Validator, keine
Abuse-Erkennung jenseits Honeypot + IP-Limiter, kein Blocklisting, keine Anomalieerkennung.

---

## 14. Logging / PII Exposure

22 `console.*`-Stellen in `server/server.js`. Klassifikation:

| Zeile                                  | Inhalt                                                            | Klassifikation                                                                               |
| -------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `:41`                                  | Warnung über fehlende Env-Variablen — **nur Namen**               | PII_SAFE                                                                                     |
| `:59`                                  | `[DRY_RUN] email suppressed → to=<EMPFÄNGER> subject="<BETREFF>"` | **PII_RISK** — Betreff enthält je nach Endpunkt Namen bzw. E-Mail-Adresse                    |
| `:62`                                  | `[DRY_RUN] active`                                                | PII_SAFE                                                                                     |
| `:73`, `:160`, `:363`, `:641`          | Honeypot ausgelöst, ohne Werte                                    | PII_SAFE                                                                                     |
| `:130`                                 | `'Email sent successfully'`                                       | PII_SAFE                                                                                     |
| `:291`                                 | `'Support emails sent successfully (team + confirmation)'`        | PII_SAFE                                                                                     |
| `:480`                                 | `[consumer-order] sent: product=… qty=… from=<E-MAIL>`            | **PII_RISK** — E-Mail im Klartext                                                            |
| `:679`                                 | PDF-Fehlschlag, nur `e.message`                                   | PII_SAFE                                                                                     |
| `:713`                                 | `[roi-report] processed lead from <E-MAIL> (area=…)`              | **PII_RISK** — E-Mail im Klartext                                                            |
| `:134`, `:295`, `:483`, `:531`, `:716` | `console.error('…', error)` — Error-Objekt                        | **UNKNOWN** — abhängig davon, ob das SDK Payload-Fragmente in die Message aufnimmt           |
| `:136`, `:297`, `:485`, `:717`         | `console.error(error.response.body)` — **SendGrid-Antwortkörper** | **PII_RISK** — kann bei Ablehnungen die beanstandete Adresse bzw. Nachrichtenteile enthalten |
| `:728`                                 | Startmeldung mit Port                                             | PII_SAFE                                                                                     |

**Zusammenfassung:** 4 Stellen sicher PII_RISK, 4 weitere PII_RISK über den Provider-Fehlerkörper,
5 UNKNOWN, 9 PII_SAFE. **Es gibt keine Redaction-Funktion und keinen strukturierten Logger** — alle
Ausgaben gehen unstrukturiert nach stdout/stderr. Im Preview-Betrieb landen sie laut
`docs/deploy-preview.md` in `preview.log` im Repository-Verzeichnis.

**Vollständige Request-Bodies werden nirgends geloggt** — kein `JSON.stringify(req.body)`,
kein Body-Dump. Das ist der wesentliche mildernde Umstand.

**Frontend:** 10 `console.error`-Stellen in den Submission-Pfaden. Sie geben Statuscodes, Fehlerobjekte
und im Fall von `useSupportForm.ts:80` den **MIME-Typ** der abgelehnten Datei aus — Dateinamen und
Inhalte nicht. Klassifikation: überwiegend PII_SAFE, `:80` grenzwertig.

---

## 15. Environment and Configuration Contract

**Ausschließlich Variablennamen. `server/.env` wurde nicht gelesen; nur die Schlüsselnamen wurden
verglichen, keine Werte gelesen oder wiedergegeben.**

### Backend (`server/server.js`)

| Name               | Rolle                       | Status                                  | Default im Code         | In `.env.example`?    | In `.env` vorhanden? | In Compose?                         |
| ------------------ | --------------------------- | --------------------------------------- | ----------------------- | --------------------- | -------------------- | ----------------------------------- |
| `SENDGRID_API_KEY` | SendGrid-Authentifizierung  | **erforderlich** (geprüft, nur Warnung) | —                       | ❌ **fehlt**          | ✅                   | via `env_file`                      |
| `CONTACT_RECEIVER` | Primärer interner Empfänger | **erforderlich** (geprüft)              | —                       | ❌ **fehlt**          | ✅                   | via `env_file`                      |
| `SENDER_EMAIL`     | Verifizierter Absender      | **erforderlich** (geprüft)              | —                       | ❌ **fehlt**          | ✅                   | via `env_file`                      |
| `FRONTEND_URL`     | CORS-Origin                 | optional                                | `http://localhost:3000` | ✅                    | ✅                   | via `env_file`                      |
| `PORT`             | Listen-Port                 | optional                                | `5000`                  | ✅                    | ✅                   | via `env_file`                      |
| `DRY_RUN`          | Mail-Kill-Switch            | optional                                | aus                     | ❌ **undokumentiert** | ❌                   | ❌ — nur beim Preview-Start gesetzt |
| `LISTEN_HOST`      | Bind-Adresse                | optional                                | `0.0.0.0`               | ❌ **undokumentiert** | ❌                   | ❌                                  |

### Frontend-SSR (`server.ts`)

| Name          | Rolle                   | Status   | Default                 | In Compose?                         |
| ------------- | ----------------------- | -------- | ----------------------- | ----------------------------------- |
| `NODE_ENV`    | Modus                   | optional | dev                     | ✅ `production` (+ `Dockerfile:51`) |
| `PORT`        | Listen-Port             | optional | `3000`                  | ✅ `3000` (+ `Dockerfile:52`)       |
| `BACKEND_URL` | Proxy-Ziel für `/api/*` | optional | `http://localhost:5000` | ✅ `http://backend:5000`            |

### Befunde

- **Drei erforderliche Backend-Variablen fehlen in `server/.env.example`.** Die Vorlage dokumentiert nur `FRONTEND_URL` und `PORT`; die drei, ohne die kein Mailversand funktioniert, sind nicht genannt. Eine aus der Vorlage aufgesetzte Umgebung startet — mit Warnung — und scheitert erst beim ersten Versand.
- **`DRY_RUN` ist nirgends deklariert.** Es ist der einzige Schutz gegen produktive Side Effects aus Preview und existiert nur als Startparameter in `docs/deploy-preview.md`. Ein Neustart ohne diesen Parameter macht die Preview-Instanz **still produktiv**.
- **`LISTEN_HOST` ist undokumentiert.** Ohne ihn bindet das Backend auf `0.0.0.0`; im Compose-Netz ist das gewollt, außerhalb wäre es eine Exposition.
- **Obsolet:** keine. Alle referenzierten Namen werden verwendet.
- **`docker-compose.yml`** setzt für den Backend-Service **ausschließlich** `env_file: ./server/.env` (`:30-31`), keine expliziten `environment`-Einträge.

---

## 16. Test Coverage

### Vorhandene Tests

| Datei                                    | Umfang                                                                                                                                                                                          |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/server.test.js`                  | **6 Testfälle, ausschließlich `esc()`** — Escaping aller fünf Zeichen, `&`-zuerst-Reihenfolge, Nullish-Sicherheit, Nicht-String-Coercion, Script-Neutralisierung, Escape-dann-`<br>`-Invariante |
| `src/**/*.test.tsx`                      | `Header`, `Footer`, `Alert`, `Button`, `SectionHeader` — **keine Formular- oder API-Tests**                                                                                                     |
| `src/content/befunde/panelNames.test.ts` | Inhaltsprüfung, ohne Bezug zu Journeys                                                                                                                                                          |
| `e2e/url-smoke.spec.ts`                  | ruft `/contact` und `/support` **nur als Seiten** auf (Statuscode < 400) — **kein Submit, kein Payload, keine Response-Prüfung**                                                                |

### Ausgeführte Kommandos

```
$ npx vitest run server/server.test.js --reporter=basic
→ Fehlschlag beim Start: ERR_LOAD_URL / RunnerError beim Laden des Reporters.
  Bestätigt die bekannte Sandbox-Einschränkung (jsdom/vitest blockiert, Playwright/Chromium nicht).

$ node -e "const {esc}=require('./server/server.js'); …7 Fälle…"
→ esc() direct check: 7 pass, 0 fail
```

Der zweite Lauf importiert `server/server.js` nur; der Guard `if (require.main === module)`
(`server/server.js:726`) verhindert das Starten eines Listeners, und es wurde keine Mail versendet und
kein Netzwerk-Call ausgelöst. Der auf `127.0.0.1:5000` beobachtete Listener ist der vorbestehende Dienst.

### Abdeckung je Flow

| Flow                  | Erfolg | Validierungsfehler | Provider-Fehler | Rate Limit | Doppel-Submit | Retry | Lokalisierung | Malformed | Oversized | **Klassifikation**                     |
| --------------------- | ------ | ------------------ | --------------- | ---------- | ------------- | ----- | ------------- | --------- | --------- | -------------------------------------- |
| J1 General Contact    | ❌     | ❌                 | ❌              | ❌         | ❌            | n/a   | ❌            | ❌        | ❌        | **NONE**                               |
| J2 Praxis Order       | ❌     | ❌                 | ❌              | ❌         | ❌            | n/a   | ❌            | ❌        | ❌        | **NONE**                               |
| J3 Support            | ❌     | ❌                 | ❌              | ❌         | ❌            | n/a   | ❌            | ❌        | ❌        | **NONE**                               |
| J4 Consumer Order     | ❌     | ❌                 | ❌              | n/a        | ❌            | n/a   | ❌            | ❌        | ❌        | **NONE**                               |
| J5 ROI Report         | ❌     | ❌                 | ❌              | ❌         | ❌            | n/a   | ❌            | ❌        | ❌        | **NONE**                               |
| J6 Chat Widget        | ❌     | —                  | —               | —          | —             | —     | —             | —         | —         | **NONE**                               |
| `esc()`-Hilfsfunktion | ✅     | ✅                 | —               | —          | —             | —     | —             | ✅        | —         | **PARTIAL** (Funktion, nicht Endpunkt) |

**Kein einziger der fünf Endpunkte hat einen Test.** Die gesamte belegte Backend-Abdeckung besteht aus
sechs Testfällen für eine 7-zeilige Escaping-Funktion.

---

## 17. Current Journey Matrix

### Aktuell existierende Journeys

| Journey                | Endpoint                   | Persistence    | Queue | Retry  | Idempotency                     | Rate Limit    | External Side Effect                              | Test Coverage |
| ---------------------- | -------------------------- | -------------- | ----- | ------ | ------------------------------- | ------------- | ------------------------------------------------- | ------------- |
| **J1 General Contact** | `POST /api/contact`        | NO_PERSISTENCE | keine | keiner | NO_IDEMPOTENCY                  | ✅ 5/15 min   | 1 SendGrid-Mail                                   | NONE          |
| **J2 Praxis Order**    | `POST /api/contact`        | NO_PERSISTENCE | keine | keiner | NO_IDEMPOTENCY                  | ✅ 5/15 min   | 1 SendGrid-Mail (ggf. Sonderempfänger)            | NONE          |
| **J3 Support**         | `POST /api/support`        | NO_PERSISTENCE | keine | keiner | NO_IDEMPOTENCY                  | ✅ 5/15 min   | 2 SendGrid-Mails (Team + Nutzer), ggf. Anhang     | NONE          |
| **J4 Consumer Order**  | `POST /api/consumer-order` | NO_PERSISTENCE | keine | keiner | CLIENT_DOUBLE_SUBMIT_PROTECTION | ❌ **keiner** | 1 SendGrid-Mail an 4 Empfänger + `dataLayer`-Push | NONE          |
| **J5 ROI Report**      | `POST /api/roi-report`     | NO_PERSISTENCE | keine | keiner | NO_IDEMPOTENCY                  | ✅ 5/15 min   | PDF-Erzeugung + 2 SendGrid-Mails                  | NONE          |
| **J6 Chat Widget**     | **keiner**                 | NO_PERSISTENCE | —     | —      | —                               | —             | **Drittanbieter-Skript-Load, ohne Consent**       | NONE          |

`POST /api/chat` existiert serverseitig, hat aber keinen Aufrufer — als **verwaister Endpunkt** geführt,
nicht als Journey.

### Geplante Journeys — **existieren heute NICHT**

| Geplante Journey                                                             | Quelle im Scope                          | Ist-Zustand                                                                                                                                                                                                                                                                                                             |
| ---------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Epigenetik-Inquiry** (eigener Flow, eigener Lead-Typ, eigenes CRM-Routing) | `DEC-RL-011`, AP15 PT15.6, AP22 PT22.6.1 | **NICHT VORHANDEN.** Es gibt keinen eigenen Endpunkt und kein eigenes Formular. Was heute existiert, ist J1 mit URL-Parametern `?source=epigenetics&panel=…`, deren Werte als **Prosa-Zeile `Herkunft:`** in `message` landen (`useContactForm.ts:56`).                                                                 |
| **Gated Lead-Magnet / geschützter Download**                                 | `DEC-RL-014`, AP19 PT19.3                | **NICHT VORHANDEN.** Kein Gate-Formular, kein Entitlement, kein Token, kein geschützter Auslieferungspfad. PDFs liegen als statische Dateien unter `public/downloads/` und sind frei abrufbar. J5 (ROI Report) ist der nächstliegende Fall, aber **ungegated**: das Asset wird ohne Zugriffsschutz per Mail zugestellt. |

---

## 18. Gap to Final Master Scope

Ist gegen Soll. `PRESENT` · `PARTIAL` · `ABSENT` · `CONFLICTING_CURRENT_IMPLEMENTATION`.

| Soll-Anforderung                                                                                                                                                                                                          | Quelle                                   | Status                                 | Ist-Befund                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Einheitliches API-Fehlerformat + Validierung                                                                                                                                                                              | AP02 PT02.4.1, AP22 PT22.1.2             | **PARTIAL**                            | Form ist konsistent (`{error}` bei 4xx, `{success,error}` bei 5xx), aber es gibt kein Schema, keine Fehlercodes; drei von vier Clients verwerfen die `error`-Strings (M2, M10)                           |
| Persistentes Lead-Datenmodell mit Journey-/Source-/Language-Kontext                                                                                                                                                       | AP02 PT02.4.2, AP22 PT22.2               | **ABSENT**                             | keine Persistenz (§7); `source` existiert nur als Prosa; `language` wird nirgends erhoben                                                                                                                |
| CRM-Handoff mit Idempotenz                                                                                                                                                                                                | AP02 PT02.4.3, AP22 PT22.3               | **ABSENT**                             | kein CRM, keine Adaptergrenze, kein Idempotenzschlüssel                                                                                                                                                  |
| Queue/Retry + Dead-Letter                                                                                                                                                                                                 | AP02 PT02.4.4, AP22 PT22.4               | **ABSENT**                             | §8                                                                                                                                                                                                       |
| Deduplication-Strategie                                                                                                                                                                                                   | AP02 PT02.4.5, AP22 PT22.2.7             | **ABSENT**                             | §9                                                                                                                                                                                                       |
| Retention / Löschung / Auskunft                                                                                                                                                                                           | AP02 PT02.4.6, AP22 PT22.8.1–.2          | **ABSENT**                             | ohne Speicher kein Retention-Objekt; Daten liegen ausschließlich in Postfächern                                                                                                                          |
| Mailzustellung vom Request-Lifecycle entkoppeln                                                                                                                                                                           | AP02 PT02.4.7                            | **ABSENT**                             | alle Sends synchron vor `res` (§10)                                                                                                                                                                      |
| Auditierbarkeit von Consent und Zustellung                                                                                                                                                                                | AP02 PT02.4.8, AP22 PT22.2.5             | **ABSENT**                             | `consent` ist ein Boolean-Gate ohne Zeitstempel/Version/Umfang und wird nicht gespeichert (§12)                                                                                                          |
| Kein Chat-Backend im Zielbild                                                                                                                                                                                             | AP02 PT02.4.9, AP22 PT22.7, `DEC-RL-007` | **CONFLICTING_CURRENT_IMPLEMENTATION** | `/api/chat` existiert (`:503`) **und** `ChatWidget.tsx` lädt ein Drittanbieter-Skript **und** die CSP führt die HiHuman-Domains                                                                          |
| Eigene Epigenetik-Inquiry, eigener Backend-Pfad/Lead-Typ, eigenes CRM-Routing                                                                                                                                             | AP15 PT15.6, `DEC-RL-011`                | **ABSENT**                             | §17; heute Prosa-Multiplexing über `/api/contact`                                                                                                                                                        |
| Gated Lead-Magnet: Gate, Lead-Typ `content_download`, Persistenz+CRM+Queue, geschützte Auslieferung, Entitlement-Link                                                                                                     | AP19 PT19.3, `DEC-RL-014`                | **ABSENT**                             | §17; Assets sind frei erratbar unter `/downloads/`                                                                                                                                                       |
| Contact: persistenter Lead + CRM-Handoff, Source/Language-Attribution                                                                                                                                                     | AP20 PT20.2.3–.4                         | **ABSENT**                             | §7                                                                                                                                                                                                       |
| **Keine Sonderfälle heimlich über Textparameter multiplexen, wenn eigene Journeys existieren**                                                                                                                            | AP20 PT20.2.8                            | **CONFLICTING_CURRENT_IMPLEMENTATION** | genau das geschieht: Epigenetik-Kontext (`Herkunft:`) und Praxis-Bestellungen (`BESTELLUNG …`) reisen als Freitext in `message`; die Spray-Empfängerumleitung hängt an einem Substring in `area` (`:92`) |
| Support: Persistenz/Case-Typ, entkoppelte + retryfähige Mails, Retention, 10-sprachige Bestätigung                                                                                                                        | AP20 PT20.3                              | **ABSENT**                             | Bestätigung ist hartcodiert deutsch (`:270`); keine Persistenz, kein Retry                                                                                                                               |
| Consumer Order: Rate Limit, Idempotenz/Order-ID, Persistenz + CRM/Order-Routing, retryfähige Zustellung, 10-sprachige Texte                                                                                               | AP21 PT21.5                              | **ABSENT**                             | Rate Limit fehlt (§13); keine Order-ID; Texte englisch hartcodiert                                                                                                                                       |
| Gemeinsamer Formular-/API-Standard: Double-Submit, Idempotency Key, Honeypot, Rate Limit, Consent getrennt, Language/Source/Campaign                                                                                      | AP22 PT22.1                              | **PARTIAL**                            | Honeypot 4/5 ✅; Rate Limit 3/4 ✅; Double-Submit 1/5; Idempotency 0/5; Consent-Trennung 0/5; Language 0/5                                                                                               |
| Bestehende Journeys migrieren (`/api/contact`, `/api/support`, `/api/consumer-order`, `/api/roi-report`), PraxisOrder sauber typisieren, SendGrid in retryfähigen Ablauf integrieren, deutsche Autoresponder lokalisieren | AP22 PT22.5                              | **ABSENT**                             | alle vier Endpunkte im Ausgangszustand; PraxisOrder untypisiert (M5); Autoresponder deutsch                                                                                                              |
| `/api/chat` entfernen, Mock-/Roadmap-Kommentare bereinigen                                                                                                                                                                | AP22 PT22.7                              | **ABSENT**                             | Endpunkt plus ~25 Zeilen Teams-Integrations-Roadmap-Kommentar (`:535-559`) vorhanden                                                                                                                     |
| Preview/Staging isolieren, `DRY_RUN`                                                                                                                                                                                      | AP22 PT22.8.4, AP28 PT28.1.5             | **PARTIAL**                            | `DRY_RUN` existiert und funktioniert (`:56-63`), ist aber **in keiner Konfigurationsdatei deklariert** — nur ein Startparameter (§15)                                                                    |
| Consent-Evidence serverseitig speichern, wo Lead-/Marketingzweck es erfordert; keine Event-Queue vor Consent                                                                                                              | AP23 PT23.1.8–.9                         | **ABSENT / CONFLICTING**               | keine Evidence gespeichert; zwei `dataLayer`-Pushes ohne Consent-Prüfung; `ChatWidget` lädt vor Consent                                                                                                  |
| Rate Limits **inkl. Consumer Order**, Input-Schema je Endpoint, Payload-/Attachment-Limits, Idempotenz, Fehlerantworten ohne Interna                                                                                      | AP26 PT26.3                              | **PARTIAL**                            | Attachment-Limits ✅; Payload-Limit ✅; Fehlerantworten ✅; **Rate Limit fehlt bei E3**; kein Schema; keine Idempotenz                                                                                   |
| Secrets außerhalb Repo/Images, PII-Redaction in Logs, Least Privilege                                                                                                                                                     | AP26 PT26.4                              | **PARTIAL**                            | Secrets korrekt via `env_file` (`server/.env` ist gitignored); **keine PII-Redaction** (§14)                                                                                                             |
| Persistente Daten separat/backupfähig, nicht im vergänglichen App-Container                                                                                                                                               | AP28 PT28.5, `REST-01`                   | **ABSENT**                             | es gibt keine persistenten Daten — der Punkt ist mangels Objekt nicht erfüllbar                                                                                                                          |
| Monitoring: Queue-Tiefe, CRM-Fehler, Mailzustellungsfehler sichtbar                                                                                                                                                       | AP28 PT28.6.2–.4                         | **ABSENT**                             | keine Metriken; Fehler existieren nur als stdout-Zeilen                                                                                                                                                  |

**Bilanz:** 0 × PRESENT · 5 × PARTIAL · 16 × ABSENT · 3 × CONFLICTING_CURRENT_IMPLEMENTATION.

---

## 19. Risks

### CRITICAL

**R1 — Lead-Verlust bei Provider-Fehler, alle Journeys.**
Es gibt keinen Punkt, an dem eine Anfrage vor dem externen Handoff festgehalten wird (§7). Scheitert
`sgMail.send`, antwortet der Server `500` und die Daten sind verloren — ohne Spur, ohne Wiedervorlage,
ohne Kenntnis darüber, wie viele Leads betroffen waren. _Evidenz:_ `server/server.js:129-140`, `:290-300`,
`:479-489`, `:712-719`; kein Persistenz-Layer (§7). _Verletzt:_ `DEC-RL-009`, AP22 Gate 3.

**R2 — `ChatWidget` lädt einen Drittanbieter ohne Consent.**
`src/components/ui/ChatWidget.tsx` injiziert unbedingt `https://widget.hihuman.co.uk/bundle.js` auf jeder
Seite der B2B-Shell, eingehängt in `src/App.tsx` `MainLayout`. Es gibt keine Consent-Prüfung. Damit
entsteht ein Drittanbieter-Request vor jeder Einwilligung. _Verletzt:_ `REST-02`, `DEC-RL-004`,
`DEC-RL-007`, Launch-Gate 2 und Gate 5.

**R3 — `POST /api/consumer-order` ohne Rate Limit.**
Verifiziert an `server/server.js:338`. Der einzige öffentlich erreichbare Bestellendpunkt auf bezahlten
Kampagnenseiten hat als einzige Formularroute keinen Limiter; einziger Schutz ist der Honeypot, den ein
gezielter Angreifer trivial umgeht. Jeder Aufruf löst eine Mail an vier interne Empfänger aus.
_Verletzt:_ AP26 PT26.3.2, AP21 PT21.5.2.

### HIGH

**R4 — Keine Idempotenz, Doppelzustellung strukturell möglich.**
Vier von fünf Journeys haben nicht einmal einen Client-Guard (§9). Bei E2 und E5 kommt hinzu: scheitert
die zweite Mail im `Promise.all`, während die erste versandt ist, meldet der Server `500`, der Nutzer
sendet erneut — und die erste Mail geht doppelt hinaus. _Evidenz:_ `:290`, `:712`.

**R5 — PII in Logs, ohne Redaction.**
Zwei Endpunkte loggen E-Mail-Adressen im Klartext (`:480`, `:713`), vier weitere geben den
SendGrid-Fehlerkörper aus (`:136`, `:297`, `:485`, `:717`), der `DRY_RUN`-Stub loggt Empfänger und
Betreff (`:59`) — und ROI-Betreffe enthalten die Adresse des Anfragenden. Kein strukturierter Logger,
keine Redaction-Funktion. _Verletzt:_ AP26 PT26.4.4.

**R6 — Autoresponder und Systemmails ausschließlich deutsch.**
Support-Bestätigung (`:270-286`) und ROI-Report (`:698-708`) sind hartcodiert deutsch, das PDF zusätzlich
mit `Intl.NumberFormat('de-DE')`. Bei einer Site mit zehn Sprachen erhält jeder nicht-deutschsprachige
Nutzer eine Antwort in einer Sprache, die er nicht gewählt hat. _Verletzt:_ `DEC-RL-001`, AP08 PT08.5.

**R7 — Semantik reist als Freitext; Empfängerlogik hängt an einem Client-String.**
Bestellungen (J2) und Epigenetik-Kontext (J1) werden in `message` einkomponiert; die
Spray-Empfängerumleitung wertet einen Substring in `area` aus (`:91-94`), also einen vom Client
gelieferten Wert. Strukturierte Auswertung, Routing oder spätere CRM-Zuordnung sind so nicht möglich —
und wer den Payload kontrolliert, wählt den Empfänger mit. _Verletzt:_ AP20 PT20.2.8.

**R8 — Keine Endpunkt-Tests.**
Fünf Endpunkte, null Tests (§16). Weder Erfolgsfall noch Validierung, Provider-Fehler, Rate Limit oder
fehlerhafte Payloads sind abgesichert. Jede Änderung an `server/server.js` ist ungeschützt.
_Verletzt:_ AP27 PT27.2.

### MEDIUM

**R9 — Zwölf hartcodierte Empfängeradressen.** Vier Modulkonstanten (`:91`, `:211-216`, `:414-419`,
`:575-580`); personelle Änderungen erfordern einen Code-Deploy. Nur E1 im Standardfall nutzt eine
konfigurierbare Adresse.

**R10 — `DRY_RUN` in keiner Konfigurationsdatei deklariert.** Der einzige Schutz gegen produktive
Side Effects aus Preview existiert nur als Startparameter in `docs/deploy-preview.md`. Ein Neustart ohne
ihn macht Preview still produktiv. _Verletzt:_ AP28 PT28.1.5, AGENT-CONTRACT Regel 18.

**R11 — Drei erforderliche Env-Variablen fehlen in `.env.example`.** `SENDGRID_API_KEY`,
`CONTACT_RECEIVER`, `SENDER_EMAIL` sind nicht dokumentiert; die Startprüfung warnt nur, bricht nicht ab.

**R12 — Consent ohne Evidenz.** Ein Boolean ohne Zeitstempel, Version, Umfang — und nirgends gespeichert
(§12). Ein Nachweis der Einwilligung existiert nach dem Versand nicht mehr.

**R13 — Synchrone PDF-Erzeugung im Request.** `buildRoiPdf` läuft im Handler (`:673`); die Antwortzeit
umfasst PDF-Bau plus zwei SendGrid-Roundtrips. Bei Last blockiert das den Event-Loop.

**R14 — ROI-Ergebniszahlen sind ungeprüfte Client-Eingaben.** `outputs` wird ohne Validierung in PDF und
Lead-Mail übernommen (`:638`, `:685`) — die als Berechnung präsentierten Zahlen stammen vom Browser.

**R15 — Rate-Limiter-Zustand nur im Speicher.** `express-rate-limit` ohne konfigurierten Store: der
Zähler überlebt keinen Neustart und wird über mehrere Instanzen nicht geteilt.

### LOW

**R16 — Verwaister `/api/chat`-Endpunkt** plus ~25 Zeilen Teams-Roadmap-Kommentar (`:535-559`); wirft bei
fehlendem `message` `500` statt `400`.
**R17 — Veralteter TODO** in `RoiCalculatorSection.tsx:108` behauptet, der Endpunkt sei „noch nicht live".
**R18 — Asymmetrische Validierung** J3: `description` ist im Markup `required`, serverseitig optional.
**R19 — Keine Feldlängenbegrenzung** an keinem Endpunkt; einzige Schranke ist `express.json({limit:'10mb'})`.
**R20 — Base64-Anhang-Reserve undokumentiert:** 5 MB Datei ≈ 6,7 MB Base64 gegen ein 10-MB-Body-Limit.

---

## 20. Recommended Stable Contracts for building-docs

**Nur Empfehlungen — es wird hier nichts erstellt.** Bewertet gegen den bereits existierenden
`building-docs/`-Baum und die Artefaktliste des Master-Scope §10.

| Dokument                                             | Lohnt sich?                | Frühestes AP | Inhalt und Begründung                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------- | -------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`LEAD-DATA-CONTRACT.md`**                          | **Ja — höchste Priorität** | AP22 PT22.2  | Der Master-Scope fordert es wörtlich (§10 Nr. 8). Muss festlegen: Lead-/Journey-Typen (heute sechs faktische, aber nur vier Endpunkt-Formen), Feldkanon je Typ, **Consent-Evidence-Struktur** (Zeitpunkt, Version, Umfang — heute nur ein Boolean), Idempotenzschlüssel, Statusmodell, Dedup-Merkmale, Retention. **Barriere S4 aus `IMPLEMENTATION-HOTSPOTS.md` bleibt HART, bis dieses Dokument existiert.** Dieses Audit liefert die Ist-Feldbasis (§11). |
| **`BACKEND-API-CONTRACT.md`**                        | **Ja**                     | AP22 PT22.1  | Die exakten Request-/Response-Verträge (§6) als verbindliche Spezifikation statt als Audit-Momentaufnahme: Schema je Endpunkt, Fehlercode-Katalog, Statusmatrix, Pflicht-/Optionalfelder. Muss die zwölf dokumentierten Mismatches M1–M12 auflösen und festlegen, ob `intent`/`field` echte Felder werden. Deckt zugleich AP27 PT27.2 (Integrationstests) mit einem prüfbaren Ziel ein.                                                                      |
| **`LEAD-DELIVERY-CONTRACT.md`**                      | **Ja**                     | AP22 PT22.4  | Zustellsemantik getrennt vom Datenmodell: synchron vs. asynchron, Retry-Policy, Backoff, Dead-Letter, Replay-Sicherheit, Teilzustellungs-Kompensation (heute unbehandelt, §8), `DRY_RUN`-Verhalten je Environment, Zustellstatus-Rückkanal. Der heute fehlende Rückkanal ist der Grund, warum §7 „E-Mail ist keine Persistenz" betonen muss.                                                                                                                 |
| **`CRM-INTEGRATION.md`**                             | **Ja, aber später**        | AP22 PT22.3  | Master-Scope §10 Nr. 9. Sinnvoll erst, wenn die Adaptergrenze aus PT22.3.1 gezogen ist — der Anbieter ist laut Master-Scope §13 bewusst offen. Bis dahin würde das Dokument Annahmen zementieren. Inhalt dann: Handoff-Idempotenz, Journey-Routing, Feldabbildung, Timeout/Retry, Fehlerklassifikation, Secret-Handling, PII-Regeln in Logs.                                                                                                                 |
| _`CONSENT-CONTRACT.md`_                              | bereits empfohlen          | AP23         | In `IMPLEMENTATION-HOTSPOTS.md` §14 vorgeschlagen. Dieses Audit ergänzt eine Anforderung: das Dokument muss **A/B/C/D aus §12 explizit trennen** und festlegen, welche Evidenz das Backend erhält und speichert.                                                                                                                                                                                                                                             |
| _`OPERATIONS-RUNBOOK.md` / `DEPLOYMENT-CONTRACT.md`_ | bereits empfohlen          | AP28         | Ergänzung aus diesem Audit: **`DRY_RUN` und `LISTEN_HOST` müssen dort deklariert werden** — beide sind heute in keiner Konfigurationsdatei vorhanden (§15).                                                                                                                                                                                                                                                                                                  |

**Nicht empfohlen:** ein separates „Email-Contract"-Dokument. Der Mailversand ist im Zielbild nur ein
Zustellkanal unter mehreren; er gehört in `LEAD-DELIVERY-CONTRACT.md`, nicht in ein eigenes Artefakt.

---

## 21. Evidence Gaps

**G1 — Produktives Log-Ziel unbekannt.** Ob stdout/stderr des Backend-Containers in ein persistentes
Log-System fließen, wer darauf Zugriff hat und wie lange Einträge aufbewahrt werden, ist aus dem
Repository nicht feststellbar. `docker-compose.yml` konfiguriert keinen Logging-Treiber. Damit ist die
**Reichweite** von R5 nicht bestimmbar — nur die Tatsache, dass PII in die Logs gelangt.

**G2 — SendGrid-Kontokonfiguration außerhalb des Repositories.** Ob Suppression-Listen, Sandbox-Modus,
IP-Pools, Webhooks oder Aufbewahrungsfristen konfiguriert sind, ist von hier nicht prüfbar. Insbesondere
lässt sich nicht ausschließen, dass ein Event-Webhook existiert, der außerhalb dieser Anwendung
Zustellstatus erfasst.

**G3 — Tatsächliches Preview-Startkommando nicht verifizierbar.** `docs/deploy-preview.md` dokumentiert
`DRY_RUN=1` für die Instanz auf `:5001`. Ob der aktuell laufende Prozess damit gestartet wurde, ließe
sich nur über `/proc/<pid>/environ` feststellen — das wurde bewusst **nicht** gelesen, da es Werte
offenlegen würde. R10 beschreibt damit ein strukturelles Risiko, keinen bestätigten Fehlzustand.

**G4 — `req.ip`-Logging durch Middleware nicht ausgeschlossen.** `express-rate-limit` selbst loggt nicht;
ob ein vorgelagerter nginx oder der SSR-Proxy Zugriffe mit IP protokolliert, ist außerhalb dieses
Repositories konfiguriert. In §11 daher als `UNKNOWN` geführt.

**G5 — `vitest` in dieser Umgebung nicht lauffähig.** Der Lauf scheiterte beim Reporter-Laden
(`ERR_LOAD_URL`, §16), bestätigend zur bekannten Sandbox-Einschränkung. Die vorhandenen `esc()`-Tests
wurden ersatzweise direkt über Node verifiziert (7/7 bestanden); die fünf Frontend-Komponententests
konnten **nicht** ausgeführt werden. Ihre Existenz ist belegt, ihr Zustand nicht.

**G6 — Historische Zustellfehlerrate unbekannt.** Ohne Persistenz und ohne Monitoring gibt es keine Daten
darüber, wie oft R1 in der Vergangenheit eingetreten ist. Die Schwere von R1 ist strukturell begründet,
nicht empirisch.

---

## 22. Final Classification

## BACKEND_BASELINE_READY_WITH_WARNINGS

**Warum READY.** Der Ist-Zustand ist vollständig und belegbar erfasst:

- **Alle fünf tatsächlich existierenden Endpunkte** wurden vollständig gelesen — Middleware, Validierung, Empfängerlogik, Antwortformen, Fehlerpfade, Logging.
- **Alle Frontend-Submission-Aufrufer wurden verfolgt.** Vier `fetch(`-Aufrufe existieren im gesamten `src/`-Baum; zwei weitere Journeys teilen sich `src/api/contact.ts`. Die Suche umfasste `fetch`, `axios`, `/api/`, `submit`, `onSubmit`, `FormData` und die geforderten Domänenbegriffe; es wurden keine weiteren Pfade gefunden.
- **Felder sind bis in den Request-Body verfolgt**, nicht aus Labels abgeleitet — dabei wurden zwölf konkrete Frontend/Backend-Mismatches (M1–M12) belegt, darunter zwei Felder, die gesendet und still verworfen werden.
- **Die drei Kernfragen sind dreifach unabhängig beantwortet**: keine Persistenz, keine Queue, keine Idempotenz — belegt über Dependency-Manifeste, Quellcode-Grep und die Abwesenheit jedes Dateisystem-Schreibzugriffs.
- **Keine geplante Journey wird als existierend dargestellt.** Epigenetik-Inquiry und Gated Lead-Magnet stehen in §17 in einer getrennten Tabelle mit ausdrücklichem `NICHT VORHANDEN`.
- **Der `/api/consumer-order`-Befund wurde verifiziert, nicht übernommen** (§13).

**Warum WITH WARNINGS.** Vier Bedingungen begleiten dieses Baseline-Dokument:

1. **Der Ist-Zustand erfüllt keine einzige der geprüften Zielanforderungen vollständig** (§18: 0 × PRESENT, 5 × PARTIAL, 16 × ABSENT, 3 × CONFLICTING). Für AP19, AP22 und die Epigenetik-Inquiry ist das kein Refactoring, sondern ein Neubau: es gibt keine Persistenzschicht, an die sich etwas anschließen ließe.
2. **Drei CRITICAL-Risiken bestehen im laufenden Betrieb** — struktureller Lead-Verlust (R1), ein Drittanbieter-Skript ohne Consent (R2) und ein unlimitierter öffentlicher Bestellendpunkt (R3). R2 und R3 sind unabhängig vom Relaunch-Zeitplan wirksam.
3. **Es gibt keinen Endpunkt-Test.** Die gesamte Backend-Abdeckung besteht aus sechs Testfällen für eine Escaping-Funktion. Jede Änderung an `server/server.js` ist ungeschützt — was die Migration in AP22 zusätzlich riskant macht.
4. **Sechs Evidenzlücken bleiben offen** (§21), alle außerhalb des Repositories: Log-Ziel und -Aufbewahrung, SendGrid-Kontokonfiguration, tatsächliche Preview-Startumgebung, IP-Protokollierung vorgelagerter Dienste, Zustand der Frontend-Tests und die historische Fehlerrate. Sie begrenzen die **Quantifizierung** einzelner Risiken, nicht deren Feststellung.

Keine dieser Warnungen blockiert die Planung. Alle vier bestimmen mit, in welcher Reihenfolge und mit
welchen Schutzmaßnahmen die Lead-Plattform gebaut werden muss.

---

_Erstellt durch read-only Inspektion am 2026-08-21 gegen `feat/home-leadmagnet@961f65d`. Geändert wurde
ausschließlich diese Datei. Kein Anwendungs- oder Backend-Quellcode, keine Konfiguration, keine
Dependencies, keine Lockfiles, keine Environment-Dateien, keine Branches, keine Commits, keine Dienste,
keine Datenbanken, kein Deployment und kein kanonisches `building-docs/`-Dokument wurde verändert.
Nichts wurde gestaged, committet oder gepusht. Es wurde keine E-Mail versendet und kein CRM aufgerufen.
`server/.env` wurde nicht gelesen — es wurden ausschließlich Schlüsselnamen verglichen. Keine
Secret-Werte und keine persönlichen Empfängeradressen sind wiedergegeben._
