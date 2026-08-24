# PolarisDX Relaunch — Consent, Tracking & Network Baseline

> **CURRENT-STATE-Audit, 2026-08-21**, gegen die gesperrte Baseline `feat/home-leadmagnet@961f65d`.
> Beschreibt **ausschließlich den Ist-Zustand**. Der Soll-Zustand steht in
> `building-docs/scope/MASTER-SCOPE.md` (AP23) und in `REST-02`; die Abweichung ist in §16 und §19
> getrennt ausgewiesen.
>
> Read-only. Es wurde nichts an Quellcode, Konfiguration, Dependencies, Lockfiles, Environment-Dateien,
> Branches, Commits, Diensten, Deployments oder an den kanonischen `building-docs/`-Dokumenten geändert.
> Nichts wurde gestaged, committet oder gepusht. **Es wurde kein Analytics-Ereignis an einen realen
> Provider gesendet** — die Laufzeitbeobachtung in §15 hat jede externe Anfrage abgebrochen, bevor sie
> das Netz verlassen konnte. Keine Secret-Werte werden wiedergegeben.

---

## 1. Executive Summary

**Die Leitfrage — „Welche externe und analyse-bezogene Netzaktivität kann vor einer Einwilligung
entstehen?" — ist statisch und per Laufzeitbeobachtung eindeutig beantwortet:**

> **Zwei nicht-essenzielle Drittanbieter-Origins werden bei jedem Seitenaufruf angefordert, bevor der
> Nutzer irgendetwas entschieden hat — und eine ausdrückliche Ablehnung ändert daran nichts.**

| Origin                             | Zweck               | Vor Consent angefordert?              | Nach „Nur notwendige"? |
| ---------------------------------- | ------------------- | ------------------------------------- | ---------------------- |
| `https://www.googletagmanager.com` | ANALYTICS/MARKETING | **JA** — nachgewiesen                 | **JA — unverändert**   |
| `https://widget.hihuman.co.uk`     | CHAT                | **JA** — nachgewiesen (nur B2B-Shell) | **JA — unverändert**   |

**Der zentrale Konstruktionsfehler:** `index.html` setzt Consent-Mode-v2-Signale korrekt auf `denied`
(`:27-35`) — und lädt den GTM-Container unmittelbar danach **bedingungslos** (`:71-81`). Das ist genau
die Unterscheidung, die `REST-02` verlangt: _„Consent-Signale stehen auf denied"_ ist nicht dasselbe wie
_„das Provider-Skript ist nicht geladen"_. Der Ist-Zustand erfüllt das erste und verfehlt das zweite.

**Fünf Tracking-/Netz-Systeme koexistieren** (§7), mit gegensätzlicher Philosophie:

| #   | System                                                                  | Consent-Gate               | Netzwirkung heute                                                                    |
| --- | ----------------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------ |
| 1   | `index.html` GTM-Loader                                                 | **keines**                 | lädt `gtm.js` bei jedem Aufruf                                                       |
| 2   | `index.html` `noscript`-iframe                                          | **keines**                 | lädt `ns.html` ohne JS                                                               |
| 3   | `src/components/analytics/GtmPageview.tsx`                              | **keines**                 | `gtag('event','page_view')` + `dataLayer`-Push je SPA-Navigation                     |
| 4   | `src/pages/consumer/tracking.ts` (+ `OrderForm`, `OrderModal`, `shell`) | **keines**                 | direkte `dataLayer`-Pushes                                                           |
| 5   | `src/lib/tracking.ts` — die **kanonische** Fassade                      | **zwei Sperren, beide zu** | **null** — `setTrackingProvider`/`setTrackingConsent` werden **nirgends aufgerufen** |

Das einzige System mit korrektem Consent-Gate ist damit zugleich das einzige, das **nichts tut**. Seine
beiden Aufrufer (`EpigeneticsPage.tsx:41`, `BefundBlocks.tsx:27`) senden in einen dauerhaften No-Op.

**Weitere Kernbefunde:**

- **Kein Widerruf-Weg existiert.** Nach gespeicherter Entscheidung rendert der Banner `null`; es gibt
  keinen Wiederöffnen-Knopf und keinen Link, der `cookie-consent` zurücksetzt (§17).
- **„Nur notwendige" entlädt nichts.** Kein Skript wird entfernt, keine Cookies werden gelöscht, kein
  Reload erfolgt — es werden nur `gtag('consent','update', … denied)` und ein `consent_update`-Event
  gesendet (§5).
- **Die CSP ist `Report-Only`** und erlaubt neben den benötigten Domains auch drei Origins ohne aktive
  Verwendung sowie ein pauschales `https:` in fünf Direktiven, das jede Allowlist praktisch aufhebt (§10).
- **`consumer_page_view` feuert vor jeder Einwilligung** — auf den Consumer-Seiten nachgewiesen (§15, F).

**Laufzeitbeweis: RUN** (§15) — fünf Szenarien gegen den existierenden `dist/client`-Build, alle externen
Anfragen protokolliert und abgebrochen.

**Klassifikation: CONSENT_BASELINE_READY_WITH_WARNINGS** (§23). **REST-02-Status: NON_COMPLIANT.**

---

## 2. Scope and Authority

Gelesen in der Reihenfolge aus `building-docs/PROJECT-CONSTRAINTS.md`:

1. `building-docs/AGENT-CONTRACT.md` — Regel 16 (keine Secret-Werte), Regel 18 (keine produktiven Side Effects), Regel 19 (Hotspot-Regel für `index.html`, `src/lib/tracking.ts`, `server.ts`).
2. `building-docs/PROJECT-CONSTRAINTS.md` — **`REST-02`** (_„Basic Consent Mode v2 / vollständiger Ladeverzicht. GTM/GA4 und andere nicht notwendige Marketing-/Analytics-Tags laden erst nach Einwilligung."_) und **`DEC-RL-004`** (_„kein Tracking und kein Event-Puffern vor Consent"_), ergänzend `DEC-RL-007` (kein Chat im Relaunch).
3. `building-docs/scope/MASTER-SCOPE.md` — **AP23 vollständig** (PT23.1–PT23.5), AP06 PT06.4 (Chat entfernen), AP11 PT11.5.7, AP15 PT15.5.4/PT15.6.10, AP19 PT19.3.10, AP21 PT21.1.4/PT21.5.9, AP22 PT22.1.7–.8/PT22.7, AP25 PT25.1, AP26 PT26.2, AP27 PT27.4, AP30 PT30.4.
4. Aktuelle Repository-Evidenz — jede Aussage mit Datei und Zeile belegt.
5. `building-docs/BRANCH-RECONCILIATION-MAP.md` (**N9**, **A18**, **A19**, **A20**), `building-docs/REPO-BASELINE.md`, `IMPLEMENTATION-HOTSPOTS.md` (§4.6, §4.8, CONSENT_CONTRACT), `BACKEND-LEAD-CURRENT-STATE.md` (§12, R2).

**Ist/Soll-Trennung:** §3–§15 und §17–§18 beschreiben ausschließlich den Ist-Zustand. §16 und §19
vergleichen mit `REST-02` bzw. AP23.

**Sicherheitsrahmen der Beobachtung (§15):** kein Build wurde erzeugt (`dist/` blieb unangetastet), kein
bestehender Dienst wurde gestartet oder verändert, kein Formular abgesendet, und **jede** Anfrage an einen
externen Host wurde protokolliert und dann abgebrochen (`route.abort()`), bevor sie das Netz erreichte.

---

## 3. Current Tracking Architecture

```
DOKUMENT-BOOTSTRAP  (index.html — läuft vor React, vor jeder Nutzerentscheidung)
  ├─ :19-35   dataLayer[] + gtag() + gtag('consent','default', …ALLE denied…, wait_for_update:500)
  ├─ :37-67   localStorage['cookie-consent'] lesen → ggf. gtag('consent','update', …granted…)
  └─ :71-81   GTM-Loader  →  https://www.googletagmanager.com/gtm.js?id=GTM-TW6JFX7K
                              ▲ BEDINGUNGSLOS — kein Consent-Guard
  └─ :188-201 <noscript><iframe src="…/ns.html?id=GTM-TW6JFX7K">   ▲ ebenfalls bedingungslos

REACT-SHELL  (src/App.tsx)
  ├─ <GtmPageview/>   → gtag('event','page_view') + dataLayer.push('virtual_pageview')  [kein Guard]
  ├─ <CookieBanner/>  → schreibt localStorage, sendet gtag consent updates              [Entscheidungspunkt]
  └─ <MainLayout>
        └─ <ChatWidget/> → injiziert <script src="https://widget.hihuman.co.uk/bundle.js">
                            ▲ BEDINGUNGSLOS — kein Consent-Guard   (nur B2B-Shell)

CONSUMER-SHELL  (src/pages/consumer/*, AUSSERHALB von MainLayout)
  └─ consumer/tracking.ts → dataLayer.push(consumer_page_view | consumer_cta_click)     [kein Guard]
     OrderForm.tsx        → dataLayer.push(consumer_order_submit)                        [kein Guard]
     OrderModal.tsx       → dataLayer.push(consumer_order_modal_*)                       [kein Guard]

KANONISCHE FASSADE  (src/lib/tracking.ts)
  └─ track(ereignis) → provider?.(…)   nur wenn provider ≠ null UND einwilligung === true
     ▲ setTrackingProvider() und setTrackingConsent() werden NIRGENDS aufgerufen
       ⇒ dauerhaft No-Op; Aufrufer: EpigeneticsPage.tsx, BefundBlocks.tsx, useScrollDepth.ts
```

**Selbstgehostete Schriften:** `@fontsource-variable/inter` wird als Modul importiert
(`src/entry-client.tsx:23`); **keine** Google-Fonts-CDN-Abhängigkeit zur Laufzeit — trotz entsprechender
CSP-Einträge (§10).

---

## 4. index.html Bootstrap Timeline

Zeilengenau, in Ausführungsreihenfolge. „Netz" = mögliche Anfrage an dieser Stelle.

| T      | Zeile        | Was geschieht                                                                                                                                                                                                                                          | Netz                                                      |
| ------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------- |
| **T0** | `:1-14`      | HTML-Parse beginnt; `charset`, `viewport`, `google-site-verification`-Meta (**inert**, kein Request)                                                                                                                                                   | keins                                                     |
| **T1** | `:19-24`     | `window.dataLayer = window.dataLayer \|\| []`; `function gtag(){dataLayer.push(arguments)}` — **dataLayer wird angelegt, bevor irgendetwas entschieden ist**                                                                                           | keins                                                     |
| **T2** | `:26-35`     | `gtag('consent','default', {analytics_storage:'denied', ad_storage:'denied', ad_user_data:'denied', ad_personalization:'denied', functionality_storage:'granted', personalization_storage:'denied', security_storage:'granted', wait_for_update:500})` | keins (nur Array-Push)                                    |
| **T3** | `:37-67`     | IIFE liest `localStorage['cookie-consent']`; findet sie die Kategorien `analytics`/`marketing` mit `enabled:true`, folgen `gtag('consent','update', …granted…)`. `try/catch` schluckt Storage-Fehler                                                   | keins                                                     |
| **T4** | **`:71-81`** | **GTM-Loader.** Erzeugt `<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-TW6JFX7K">` und fügt ihn vor dem ersten `<script>` ein. Pusht zuvor `{'gtm.start':…, event:'gtm.js'}`                                                       | **JA — `www.googletagmanager.com`. Ohne jede Bedingung.** |
| **T5** | `:84-183`    | Statische Meta-/OG-/Twitter-Tags, Favicons, `site.webmanifest`, `theme-color`                                                                                                                                                                          | nur eigene Origin                                         |
| **T6** | `:185`       | `<!--helmet-head-->` — SSR-Platzhalter, den `server.ts` ersetzt                                                                                                                                                                                        | keins                                                     |
| **T7** | `:188-201`   | `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TW6JFX7K" …>` — **greift genau dann, wenn JavaScript deaktiviert ist, also wenn kein Consent-Dialog laufen kann**                                                              | **JA (ohne JS) — `www.googletagmanager.com`**             |
| **T8** | `:204`       | `<div id="root"><!--ssr-outlet--></div>`                                                                                                                                                                                                               | keins                                                     |
| **T9** | `:206`       | `<script type="module" src="/src/entry-client.tsx">` (im Build: `/assets/index-*.js`) → React hydriert, `GtmPageview` und `ChatWidget` montieren                                                                                                       | eigene Origin, danach `widget.hihuman.co.uk`              |

### Die entscheidende Unterscheidung

`REST-02` verlangt **„vollständiger Ladeverzicht"**. Die beiden Zustände sind zu trennen:

| Aussage                                 | Ist-Zustand              | `REST-02` verlangt                |
| --------------------------------------- | ------------------------ | --------------------------------- |
| „Consent-Signale stehen auf `denied`"   | ✅ **erfüllt** (T2)      | notwendig, aber nicht hinreichend |
| „Das Provider-Skript ist nicht geladen" | ❌ **verfehlt** (T4, T7) | **das ist die Anforderung**       |

Bei T4 ist bereits eine Verbindung zu `www.googletagmanager.com` aufgebaut: DNS, TLS, HTTP-Request mit
Referrer und User-Agent, Container-Auslieferung. `wait_for_update:500` verzögert lediglich das _Feuern
von Tags_ um 500 ms — es verhindert **nicht** das Laden des Containers.

---

## 5. CookieBanner Behaviour

`src/components/ui/CookieBanner.tsx` (371 Zeilen).

**Kategoriemodell** (`:246-273`): drei Kategorien — `necessary` (`required:true, enabled:true`),
`marketing` (`required:false, enabled:false`), `analytics` (`required:false, enabled:false`).
Nicht-notwendige Kategorien sind standardmäßig **aus**.

**Speicherung:** Schlüssel `cookie-consent` in `localStorage`; Format ist das **vollständige
`CookieCategory[]`-Array als JSON** (inklusive `nameKey`/`descriptionKey`), nicht die kompaktere
`ConsentPreferences`-Form. `index.html:41-44` liest genau dieses Array-Format.

**Initialisierung** (`:142-169`): der Wert wird **erst nach der Hydrierung** gelesen — bewusst, weil der
Server `localStorage` nicht kennt und sonst ein anderer Zustand ausgeliefert würde. Ohne gespeicherten
Wert wird der Banner sichtbar; mit Wert werden die Kategorien geladen und der Banner bleibt aus. Der
Kommentar hält fest: _„Consent is already updated in index.html on page load."_

**UI-Aktion → Zustandsänderung → Netzfolge:**

| Aktion                               | Zustandsänderung                                | `gtag`-Aufrufe                                                                                                             | `dataLayer`      | Skript entladen? | Cookies gelöscht? | Reload?  |
| ------------------------------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- | ---------------- | ----------------- | -------- |
| **„Alle akzeptieren"** (`:229-233`)  | alle `enabled:true`, `localStorage` geschrieben | `consent update` analytics `granted`; ad_storage/ad_user_data/ad_personalization `granted`; **einmalig `event page_view`** | `consent_update` | nein             | nein              | nein     |
| **„Nur notwendige"** (`:235-243`)    | nur `required` bleibt an                        | `consent update` analytics `denied`; alle ad\_\* `denied`                                                                  | `consent_update` | **nein**         | **nein**          | **nein** |
| **„Auswahl speichern"** (`:245-247`) | je Umschalter                                   | wie oben, gemischt                                                                                                         | `consent_update` | nein             | nein              | nein     |
| **„Einstellungen"** (`:303-311`)     | nur UI-Ausklappen                               | —                                                                                                                          | —                | —                | —                 | —        |

**`updateGTMConsent`** (`:36-88`) — der einzige Ort, an dem der Banner den Provider erreicht:

1. Guard `if (!window.gtag) return` — bei geblocktem GTM passiert nichts.
2. Bei Analytics-Zustimmung: `gtag('consent','update',{analytics_storage:'granted'})` **plus ein einmaliger Nach-Feuer-`page_view`** (`:53-62`), abgesichert durch `window.__pvOnGrantFired` gegen Doppelzählung. Der Kommentar begründet das mit dem `wait_for_update:500`-Fenster und dem Cross-Page-Edge-Case.
3. Bei Ablehnung: `analytics_storage:'denied'` bzw. alle `ad_*:'denied'`.
4. In **jedem** Fall: `dataLayer.push({event:'consent_update', consent_analytics, consent_marketing})`.

**Was der Banner nicht tut:** er entfernt keinen `<script>`-Knoten, löscht keine Cookies und keinen
Storage, ruft `setTrackingConsent()` der kanonischen Fassade **nicht** auf und erzwingt keinen Reload.
Er ist ein reiner Signalgeber an einen bereits geladenen Provider.

**Nebenaufgabe (nicht consent-bezogen):** der Banner misst seine Höhe und setzt
`--cookie-banner-height` sowie `body { padding-bottom }` (`:171-214`), damit er keine Schluss-CTAs verdeckt.

---

## 6. Canonical Tracking Facade

`src/lib/tracking.ts` (192 Zeilen, 13 Exporte) — die von **AP23 PT23.2.1** geforderte providerneutrale Fassade.

**Ereignisvokabular** (`:51-102`), vier typisierte Ereignisse:

| Ereignis         | Nutzlast         | Wertebereich                                                   |
| ---------------- | ---------------- | -------------------------------------------------------------- |
| `chapter_toggle` | `{panel}`        | nur bekannte `MerkSlug`                                        |
| `scroll_depth`   | `{seite, stufe}` | `seite`: `'landing'` \| `MerkSlug`; `stufe`: `25\|50\|75\|100` |
| `panel_select`   | `{panel}`        | nur `MerkSlug`                                                 |
| `quote_request`  | `{panels[]}`     | jeder Eintrag `MerkSlug`                                       |

**Provider-Registrierung** (`:132-134`): `setTrackingProvider(next|null)`. Ohne Aufruf bleibt `track` ein
No-Op; `null` entfernt den Provider wieder — laut Kommentar _„der Weg, den ein Widerruf nimmt"_.

**Consent-Registrierung** (`:142-144`): `setTrackingConsent(erteilt)`. Ausgangswert `false`, **bewusst
nirgends persistiert** — _„er lebt nur im Speicher dieses Tabs"_.

**Sendepfad** (`:183-192`): drei Bedingungen, alle müssen erfüllt sein — Browser-Kontext, `provider !== null`,
`einwilligung === true`. Danach `nutzlastIstSauber()` (`:162-175`), das jeden Slug gegen `MERK_SLUGS` prüft:
_„Ein aus der URL oder aus localStorage stammender Fremdwert wuerde sonst als frei waehlbarer Text in einer
fremden Auswertung landen."_ Provider-Fehler werden geschluckt.

**Verifikation „kein Puffer vor Consent":** **bestätigt.** `track()` enthält kein Array, keine Queue und
keinen Aufschub — bei fehlender Einwilligung endet die Funktion mit `return`, das Ereignis ist verworfen.
Der Modulkopf begründet das ausdrücklich: _„ein Puffer waere bereits eine Vorratsdatenhaltung."_ Damit
erfüllt genau dieses Modul `DEC-RL-004` und `AP23 PT23.1.9`.

**Der entscheidende Befund:** `grep` über den gesamten `src/`-Baum nach `setTrackingProvider|setTrackingConsent`
außerhalb des Moduls selbst liefert **kein Ergebnis**. Beide Schalter werden nie betätigt.
⇒ **`trackingAktiv()` ist dauerhaft `false`; die Fassade sendet nie etwas.**

**Aufrufer:** `src/pages/EpigeneticsPage.tsx:41`, `src/components/befund/BefundBlocks.tsx:27` und indirekt
`src/lib/useScrollDepth.ts`. Letzterer meldet Lesetiefen in vier Stufen, je Seitenaufruf höchstens einmal
pro Stufe, und verwirft Musterbefunde ohne bekannten Slug — _„lieber eine Luecke in der Messung als ein
Wert, der sich keiner Seite zuordnen laesst."_ Sein Kopfkommentar hält korrekt fest, dass der Hook
gefahrlos auf jeder Seite laufen darf, weil ohne Provider und Einwilligung nichts geschieht.

**Verhalten nach Widerruf:** modellhaft vorgesehen (`setTrackingConsent(false)` bzw.
`setTrackingProvider(null)`), praktisch nie ausgelöst, weil niemand die Schalter bedient.

---

## 7. Parallel / Bypass Tracking Systems

Fünf Systeme; die kanonische Fassade ist das einzige mit Consent-Gate — und das einzige ohne Netzwirkung.

| System                                             | Consent Gate                                                     | Provider                                                    | Direct Network Potential                                            | Buffer             | Callers                                                                   |
| -------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| **A · `src/lib/tracking.ts`**                      | **✅ zwei Sperren** (`provider !== null` **und** `einwilligung`) | keiner registriert                                          | **keine**                                                           | **nein** (bewusst) | `EpigeneticsPage.tsx:41`, `BefundBlocks.tsx:27`, `useScrollDepth.ts`      |
| **B · `src/pages/consumer/tracking.ts`**           | ❌ keines                                                        | `window.dataLayer` direkt (`:33-37`)                        | **ja** — GTM verarbeitet den Push, sobald der Container geladen ist | nein               | `SprayPage.tsx:163`, `MaskPage.tsx:138`, `DuoPage.tsx:69`, `shell.tsx:93` |
| **C · `src/components/analytics/GtmPageview.tsx`** | ❌ keines                                                        | **`gtag()` direkt** (`:84`) **plus** `dataLayer` (`:88-89`) | **ja** — direkter GA4-Event-Aufruf                                  | nein               | `src/App.tsx:23` (site-weit, über B2B **und** Consumer)                   |
| **D · `src/pages/consumer/OrderForm.tsx`**         | ❌ keines                                                        | `window.dataLayer` inline (`:164-168`)                      | ja                                                                  | nein               | Consumer-Bestellformular                                                  |
| **E · `src/pages/consumer/OrderModal.tsx`**        | ❌ keines                                                        | `window.dataLayer` inline (`:82-86`)                        | ja                                                                  | nein               | Consumer-Bestellmodal                                                     |

**Umgehungspfade an der kanonischen Fassade vorbei:** vier von fünf Systemen (B–E) schreiben unmittelbar
in `window.dataLayer` bzw. rufen `gtag()` auf, ohne den Consent-Zustand zu prüfen. System C ist dabei das
schwerwiegendste, weil es als einziges einen **echten GA4-Event-Aufruf** (`gtag('event','page_view', …)`)
absetzt statt nur ein Container-Event zu hinterlegen — und weil es site-weit eingehängt ist.

**Bemerkenswert:** `GtmPageview.tsx` dokumentiert im Kopf sorgfältig die Vermeidung von Doppelzählung
(Initial-Load wird übersprungen, `send_to` deterministisch, rAF-Verzögerung für den Helmet-Titel) — die
Frage der Einwilligung kommt im gesamten Kommentar nicht vor.

**Zweite Doppelzählungsquelle:** `CookieBanner.updateGTMConsent` feuert bei Analytics-Zustimmung einen
zusätzlichen `page_view` (`:53-62`). Der Guard `__pvOnGrantFired` schützt nur innerhalb derselben Session
gegen Wiederholung, nicht gegen Überschneidung mit dem von GTM selbst ausgelösten Initial-Pageview.

---

## 8. HiHuman / Chat Network Behaviour

**Unabhängig verifiziert.** Der Befund aus `BACKEND-LEAD-CURRENT-STATE.md` (§4 J6, R2) wird bestätigt und
um den Laufzeitbeweis ergänzt.

**Die Komponente** `src/components/ui/ChatWidget.tsx` — 28 Zeilen, vollständig:

- `:3` Modulkonstante mit der Skript-URL `https://widget.hihuman.co.uk/bundle.js`.
- `:4` Modulkonstante mit einer 64-stelligen Bot-ID (hier bewusst nicht wiedergegeben).
- `:7-23` `useEffect` ohne Bedingung: prüft nur, ob `#custom_chat_widget` bereits existiert, erzeugt sonst
  `document.createElement('script')`, setzt `src`, `id`, das Attribut `bot-id` und `async = true`, und hängt
  den Knoten an `document.body`.
- Cleanup entfernt den Knoten beim Unmount — **das entlädt das bereits ausgeführte Fremdskript nicht.**
- `:25` gibt `null` zurück; die gesamte Oberfläche kommt aus dem Fremdskript.

**Mount-Zeitpunkt und Reichweite:** eingehängt in `src/App.tsx` `MainLayout` (`:35` Import, `:208`
Verwendung), also auf **jeder Seite der B2B-Shell**. Die drei Consumer-Routen liegen **außerhalb** von
`MainLayout` (`src/App.tsx:232`, `:240`, `:248`) und erhalten das Widget deshalb nicht — im Laufzeittest
bestätigt (§15, Szenario F: kein `widget.hihuman.co.uk`).

**Consent-Prüfung:** **keine.** Weder `localStorage['cookie-consent']` noch `window.gtag` noch die
kanonische Fassade werden konsultiert. Der Effekt läuft beim ersten Mount nach der Hydrierung.

**Folgeverbindungen:** das geladene Bundle ist Fremdcode; welche weiteren Verbindungen es aufbaut, ist aus
diesem Repository **nicht bestimmbar** (§22, G2). Die CSP lässt es breit zu: `connect-src` erlaubt
`https://widget.hihuman.co.uk` **und** `https://*.hihuman.co.uk`, `frame-src` erlaubt die Hauptdomain —
die Wildcard in `connect-src` deutet darauf hin, dass Rückkanäle auf Subdomains erwartet werden.

**CSP-Erlaubnis:** ausdrücklich in drei Direktiven — `script-src` (`server.ts:437`), `connect-src`
(`:438`, inkl. Wildcard), `frame-src` (`:442`). Der Kommentar darüber (`:430`) nennt HiHuman als einen der
_„tatsächlich genutzten Drittanbieter"_ — im Ist-Zustand zutreffend.

**Die entscheidende Frage — würde das Entfernen von `/api/chat` allein genügen?**
**Nein.** Es sind drei voneinander unabhängige Reste:

| Rest                                       | Ort                     | Netzwirkung                        | Entfernt durch `/api/chat`-Löschung? |
| ------------------------------------------ | ----------------------- | ---------------------------------- | ------------------------------------ |
| Mock-Endpunkt `POST /api/chat`             | `server/server.js:503`  | **keine** — kein Frontend-Aufrufer | ✅                                   |
| `ChatWidget.tsx` + Einhängung in `App.tsx` | Client                  | **die gesamte Exposition**         | ❌                                   |
| CSP-Einträge für HiHuman                   | `server.ts:437,438,442` | erlaubt die Verbindung             | ❌                                   |

Der Endpunkt ist der einzige der drei, der **nichts** bewirkt; die beiden wirksamen Reste blieben bestehen.
Das entspricht der Reihenfolge in Master-Scope §7: _„Chat-Entfernung → CSP-Finalisierung."_

---

## 9. Third-Party Origin Inventory

Alle im aktiven Code referenzierten externen Origins, getrennt nach tatsächlicher Laufzeitwirkung.

| Origin                                 | Source File                                                                 | Purpose                         | Essential?                       | Can Load Pre-Consent? | Evidence                                                                         |
| -------------------------------------- | --------------------------------------------------------------------------- | ------------------------------- | -------------------------------- | --------------------- | -------------------------------------------------------------------------------- |
| `https://www.googletagmanager.com`     | `index.html:79` (gtm.js), `index.html:190` (ns.html)                        | ANALYTICS/MARKETING             | **NON_ESSENTIAL**                | **YES**               | §15 A–F: in **allen fünf** Szenarien angefordert                                 |
| `https://widget.hihuman.co.uk`         | `src/components/ui/ChatWidget.tsx:3`                                        | CHAT                            | **NON_ESSENTIAL** (`DEC-RL-007`) | **YES**               | §15 A–D: angefordert; F: nicht (andere Shell)                                    |
| `https://www.google-analytics.com`     | nur CSP `server.ts:437,438`                                                 | ANALYTICS                       | NON_ESSENTIAL                    | **CONDITIONAL**       | kein Quellcode-Bezug; Ziel von GTM-verwalteten Tags                              |
| `https://region1.google-analytics.com` | nur CSP `server.ts:438`                                                     | ANALYTICS                       | NON_ESSENTIAL                    | **CONDITIONAL**       | dito                                                                             |
| `https://ssl.google-analytics.com`     | nur CSP `server.ts:437`                                                     | ANALYTICS                       | NON_ESSENTIAL                    | **CONDITIONAL**       | dito, veraltete GA-Domain                                                        |
| `https://stats.g.doubleclick.net`      | nur CSP `server.ts:438`                                                     | MARKETING                       | NON_ESSENTIAL                    | **CONDITIONAL**       | dito                                                                             |
| `https://*.hihuman.co.uk`              | nur CSP `server.ts:438`                                                     | CHAT                            | NON_ESSENTIAL                    | **CONDITIONAL**       | Wildcard für Rückkanäle des Bundles                                              |
| `https://fonts.googleapis.com`         | nur CSP `server.ts:440`                                                     | FONT                            | —                                | **NO**                | **keine** Laufzeitverwendung — Fonts sind selbstgehostet (`entry-client.tsx:23`) |
| `https://fonts.gstatic.com`            | nur CSP `server.ts:441`                                                     | FONT                            | —                                | **NO**                | dito                                                                             |
| `https://www.linkedin.com`             | `Footer.tsx:32`, `TeamSection.tsx:23,29,35,41`, `structuredData.ts:168,204` | SOCIAL                          | NON_ESSENTIAL                    | **NO**                | ausschließlich `href`-Links und `sameAs`-Schema — **keine** Subressource         |
| `https://www.instagram.com`            | `Footer.tsx:41`                                                             | SOCIAL                          | NON_ESSENTIAL                    | **NO**                | `href`-Link                                                                      |
| `https://ec.europa.eu`                 | `ImprintPage.tsx:145`                                                       | OTHER (OS-Plattform, rechtlich) | ESSENTIAL (rechtlich)            | **NO**                | `href`-Link                                                                      |
| `https://dx365.world`                  | `AboutPage.tsx:245`                                                         | OTHER (Partner)                 | NON_ESSENTIAL                    | **NO**                | `href`-Link                                                                      |
| `https://polarisdx.net`                | `SEOHead.tsx:73`, `structuredData.ts`, `robots.txt`                         | API/SELF                        | ESSENTIAL                        | **NO**                | eigene Kanonische URLs                                                           |
| `https://schema.org`                   | `structuredData.ts` (14×)                                                   | OTHER                           | —                                | **NO**                | `@context`-Bezeichner in JSON-LD, **kein** Netzaufruf                            |

**Bilanz:** **zwei** nicht-essenzielle Origins werden vor Consent tatsächlich angefordert
(`googletagmanager.com`, `widget.hihuman.co.uk`). **Fünf** weitere sind konditional erreichbar, sobald der
GTM-Container Tags ausliefert. **Zwei** Font-Origins stehen in der CSP ohne jede Verwendung.
Alle Social-/Partner-/Rechts-Origins sind reine Navigationsziele.

**Klassifikation der statischen Treffer** (§3 der Aufgabenstellung):

| Klasse           | Beispiele                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ACTIVE_RUNTIME` | `index.html` GTM-Block, `ChatWidget.tsx`, `GtmPageview.tsx`, `CookieBanner.tsx`, `consumer/tracking.ts`, `OrderForm.tsx`, `OrderModal.tsx`, `server.ts` CSP |
| `DEAD_CODE`      | `src/lib/tracking.ts` + `useScrollDepth.ts` (funktionsfähig, aber ohne registrierten Provider wirkungslos); `POST /api/chat` (kein Aufrufer)                |
| `HISTORICAL_DOC` | `CHAT_INTEGRATION.md`, `_project-knowledge/**`, `public/locales/da/legal.json` (`gtag`-Erwähnung im Rechtstext)                                             |
| `TEST_ONLY`      | keine — es existiert kein Consent-/Tracking-Test                                                                                                            |
| `UNKNOWN`        | Verhalten des HiHuman-Bundles nach dem Laden                                                                                                                |

---

## 10. CSP Allowlist

Aktiv in `server.ts:432-444`, gesetzt als **`Content-Security-Policy-Report-Only`** (`:444`) — die Policy
**blockiert nichts**, sie meldet nur. Es ist kein `report-uri`/`report-to` konfiguriert, also gehen die
Meldungen ins Leere.

| Direktive         | Wert                                                              | Externe Domains                                                                                                      |
| ----------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `default-src`     | `'self'`                                                          | —                                                                                                                    |
| `base-uri`        | `'self'`                                                          | —                                                                                                                    |
| `object-src`      | `'none'`                                                          | —                                                                                                                    |
| `frame-ancestors` | `'self'`                                                          | —                                                                                                                    |
| `script-src`      | `'self' 'unsafe-inline' 'unsafe-eval'` + 4 Domains + **`https:`** | googletagmanager, google-analytics, ssl.google-analytics, widget.hihuman                                             |
| `connect-src`     | `'self'` + 6 Domains + **`https:`**                               | googletagmanager, google-analytics, region1.google-analytics, stats.g.doubleclick, widget.hihuman, `*.hihuman.co.uk` |
| `img-src`         | `'self' data:` + **`https:`**                                     | — (offen)                                                                                                            |
| `style-src`       | `'self' 'unsafe-inline'` + fonts.googleapis + **`https:`**        | fonts.googleapis                                                                                                     |
| `font-src`        | `'self' data:` + fonts.gstatic + **`https:`**                     | fonts.gstatic                                                                                                        |
| `frame-src`       | `'self'` + 2 Domains + **`https:`**                               | googletagmanager, widget.hihuman                                                                                     |

**Domain-Klassifikation:**

| Domain                         | Direktiven             | Klassifikation                | Begründung                                                                                             |
| ------------------------------ | ---------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------ |
| `www.googletagmanager.com`     | script, connect, frame | **USED_BUT_FORBIDDEN_TARGET** | heute aktiv genutzt, aber `REST-02`/`DEC-RL-004` verlangen, dass es **vor Consent** nicht geladen wird |
| `widget.hihuman.co.uk`         | script, connect, frame | **USED_BUT_FORBIDDEN_TARGET** | aktiv genutzt; `DEC-RL-007` verbietet Chat im Relaunch vollständig                                     |
| `*.hihuman.co.uk`              | connect                | **USED_BUT_FORBIDDEN_TARGET** | Wildcard-Rückkanal desselben verbotenen Anbieters                                                      |
| `www.google-analytics.com`     | script, connect        | **UNKNOWN**                   | kein Quellcode-Bezug; Ziel GTM-verwalteter Tags — Container-Konfiguration nicht einsehbar              |
| `region1.google-analytics.com` | connect                | **UNKNOWN**                   | dito                                                                                                   |
| `ssl.google-analytics.com`     | script                 | **STALE_ALLOWLIST**           | historische GA-Domain, von GA4 nicht mehr verwendet                                                    |
| `stats.g.doubleclick.net`      | connect                | **UNKNOWN**                   | Ads-Remarketing-Ziel; nur bei Marketing-Consent relevant                                               |
| `fonts.googleapis.com`         | style                  | **STALE_ALLOWLIST**           | Fonts sind selbstgehostet (`@fontsource-variable/inter`)                                               |
| `fonts.gstatic.com`            | font                   | **STALE_ALLOWLIST**           | dito                                                                                                   |

**Der gravierendste Befund der Allowlist:** das pauschale **`https:`** in `script-src`, `connect-src`,
`img-src`, `style-src`, `font-src` und `frame-src`. Damit ist **jede** HTTPS-Origin erlaubt und die
namentliche Aufzählung praktisch bedeutungslos. Zusammen mit `'unsafe-inline'` und `'unsafe-eval'` in
`script-src` wäre diese Policy auch im Enforce-Modus keine wirksame Netzbegrenzung. Der Kommentar nennt
das _„bewusst permissiv"_ — Master-Scope AP26 PT26.2.5 fordert _„keine unnötigen Wildcards"_.

---

## 11. Initial Load / Hydration / SPA Pageview Flow

**Initialer SSR-Load.** Der Express-SSR-Server rendert React zu HTML; **serverseitig läuft kein Tracking**
(`server.ts` enthält keinen Analytics-Code, nur die CSP-Header). Ausgeliefert wird `index.html` mit
eingesetztem Markup — inklusive des unveränderten GTM-Blocks. Im Browser laufen dann T1–T9 aus §4.
**Netzanfragen: `www.googletagmanager.com` (T4), danach `widget.hihuman.co.uk` (T9, nur B2B).**

**Erste Hydrierung.** `entry-client.tsx` hydriert; `GtmPageview` montiert und **überspringt den ersten
Mount bewusst** (`isFirst.current`, `:51-56`), weil das von GTM geladene Google-Tag die Landingpage bereits
zählt. `CookieBanner` liest `localStorage` und entscheidet über seine Sichtbarkeit. `ChatWidget` injiziert
sein Skript. `useConsumerPageView` feuert auf Consumer-Seiten sofort `consumer_page_view`.

**Clientseitiger Routenwechsel** (`GtmPageview.tsx:47-101`):

1. Referrer wird synchron festgehalten, bevor der rAF-Callback läuft (Schutz gegen Desynchronisation bei schnellen Navigationen).
2. In `requestAnimationFrame` (damit `react-helmet-async` den Titel committet hat) wird gelesen: `page_location`, `page_path`, `page_title`, `page_language`, `page_referrer`, dazu `send_to: 'G-PLZNWGKW0P'`.
3. `if (typeof w.gtag === 'function') w.gtag('event','page_view', params)` — **die einzige Prüfung ist, ob `gtag` existiert, nicht ob eingewilligt wurde.**
4. Zusätzlich `dataLayer.push({event:'virtual_pageview', ...params})`.

Bewusst wird `window.location` statt der Router-Location gelesen, weil der `BrowserRouter` ein
`basename=/${lang}` trägt und das Sprachpräfix sonst fehlen würde.

**`gtag` existiert unabhängig von der Einwilligung** — es wird in `index.html:22` definiert, bevor
irgendetwas entschieden ist. Die Existenzprüfung in Schritt 3 ist damit **immer wahr**, sobald das
Bootstrap-Skript lief.

**Nach „Alle akzeptieren":** `consent update` auf `granted`, ein einmaliger Nach-`page_view`, ein
`consent_update`-Event. Der Container war bereits geladen — **es wird nichts nachgeladen**, es wird
lediglich freigeschaltet.

**Nach „Nur notwendige":** `consent update` auf `denied`, ein `consent_update`-Event. **Der Container
bleibt geladen, das HiHuman-Bundle bleibt geladen und aktiv.** Im Laufzeittest (§15, Szenario B) ist die
Menge der angeforderten Origins identisch zum Zustand ohne Entscheidung.

**Nach Widerruf:** siehe §17 — es existiert kein Weg dorthin.

---

## 12. Consumer Tracking Flow

Die Consumer-Seiten haben eine **eigene Shell außerhalb von `MainLayout`** (`src/App.tsx:232,240,248`).
Das ändert die Consent-Lage in vier Punkten:

| Element              | B2B-Shell          | Consumer-Shell                                  | Beleg                                             |
| -------------------- | ------------------ | ----------------------------------------------- | ------------------------------------------------- |
| `CookieBanner`       | ✅ in `MainLayout` | **❌ nicht vorhanden**                          | `shell.tsx` enthält keine `CookieBanner`-Referenz |
| `GtmPageview`        | ✅                 | ✅ — hängt in `App.tsx` **über** beiden Zweigen | `App.tsx:23`                                      |
| `ChatWidget`         | ✅                 | ❌                                              | §15 F: kein `widget.hihuman.co.uk`                |
| Eigenes Event-System | ❌                 | ✅ `consumer/tracking.ts`                       | §7 System B                                       |

**Die schwerwiegendste Folge:** auf den Consumer-Seiten läuft GTM, es laufen `consumer_page_view`,
`consumer_cta_click`, `consumer_order_*` — **aber es gibt keinen Banner, über den ein Nutzer
widersprechen könnte.** Wer eine Consumer-Landingpage direkt aus einer Kampagne heraus aufruft, sieht
keinen Consent-Dialog und bekommt dennoch GTM geladen und Events in den dataLayer geschrieben.
Master-Scope AP21 PT21.1.4 fordert genau deshalb _„CookieBanner/Consent site-weit"_.

**Direkte `dataLayer`-Pushes an jedem Consent-Gate vorbei:**

| Push                        | Datei:Zeile                                                           | Auslöser                  |
| --------------------------- | --------------------------------------------------------------------- | ------------------------- |
| `consumer_page_view`        | `tracking.ts:57-58` via `SprayPage:163`, `MaskPage:138`, `DuoPage:69` | Mount der Seite           |
| `consumer_cta_click`        | `tracking.ts:44-49` via `shell.tsx:93`                                | Klick auf Hero-/Final-CTA |
| `consumer_order_modal_open` | `OrderModal.tsx:82-86`                                                | Öffnen des Bestellmodals  |
| `consumer_order_submit`     | `OrderForm.tsx:164-168`                                               | erfolgreiche Bestellung   |

Keiner dieser vier Pfade prüft `localStorage['cookie-consent']`, `window.gtag`-Consent-Zustand oder die
kanonische Fassade. Der Modulkopf von `consumer/tracking.ts` begründet die Architektur damit, dass
_„GTM (GTM-TW6JFX7K) und Consent Mode v2 … bereits in index.html verdrahtet"_ seien — was für die
**Signale** stimmt, für den **Ladeverzicht** aber nicht.

---

## 13. Complete Current Event Inventory

**CURRENT** — was heute tatsächlich existiert.

| Event                        | Caller                                         | Event System             | Payload                                                                                 | Consent Checked?                   | PII Risk                                                       |
| ---------------------------- | ---------------------------------------------- | ------------------------ | --------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| `consent:default` (gtag-Arg) | `index.html:27`                                | Bootstrap                | 8 Consent-Signale, alle nicht-essenziellen `denied`                                     | n/a (ist der Consent selbst)       | PII_SAFE_BY_TYPE                                               |
| `consent:update` (gtag-Arg)  | `index.html:52,57`; `CookieBanner:43,65,72,78` | Bootstrap / Banner       | Consent-Signale                                                                         | n/a                                | PII_SAFE_BY_TYPE                                               |
| `gtm.js`                     | `index.html:73`                                | Bootstrap                | `{gtm.start: <ts>}`                                                                     | **NEIN**                           | PII_SAFE_BY_TYPE                                               |
| `page_view` (Initial)        | GTM-Container selbst                           | GTM                      | Container-abhängig                                                                      | **NEIN** (Container ist geladen)   | **UNKNOWN** — Containerkonfiguration nicht einsehbar           |
| `page_view` (SPA)            | `GtmPageview.tsx:84`                           | **direkter gtag-Aufruf** | `page_location`, `page_path`, `page_title`, `page_language`, `page_referrer`, `send_to` | **NEIN**                           | **PII_RISK** — `page_location` trägt die volle URL inkl. Query |
| `virtual_pageview`           | `GtmPageview.tsx:89`                           | dataLayer                | identisch zu oben                                                                       | **NEIN**                           | **PII_RISK** (dito)                                            |
| `page_view` (Nach-Feuer)     | `CookieBanner.tsx:57`                          | direkter gtag-Aufruf     | `page_location`, `page_path`, `page_title`, `page_language`, `send_to`                  | ja — feuert **nur** bei Zustimmung | **PII_RISK** (dito)                                            |
| `consent_update`             | `CookieBanner.tsx:87`                          | dataLayer                | `consent_analytics`, `consent_marketing`                                                | n/a                                | PII_SAFE_BY_TYPE                                               |
| `consumer_page_view`         | `consumer/tracking.ts:58`                      | dataLayer                | `consumer_page` (`spray\|masks\|duo`)                                                   | **NEIN**                           | PII_SAFE_BY_TYPE                                               |
| `consumer_cta_click`         | `consumer/tracking.ts:44`                      | dataLayer                | `cta_label`, `consumer_page`, `cta_location?`                                           | **NEIN**                           | PII_SAFE_BY_TYPE                                               |
| `consumer_order_modal_open`  | `OrderModal.tsx:82`                            | dataLayer                | Produkt-/Seitenkontext                                                                  | **NEIN**                           | PII_SAFE_BY_TYPE                                               |
| `consumer_order_submit`      | `OrderForm.tsx:165`                            | dataLayer                | `consumer_page`, `product`, `quantity`                                                  | **NEIN**                           | PII_SAFE_BY_TYPE — **keine** Bestellerdaten im Event           |
| `chapter_toggle`             | `BefundBlocks.tsx`                             | **Fassade A**            | `{panel: MerkSlug}`                                                                     | **✅ JA**                          | PII_SAFE_BY_TYPE (Slug-Allowlist)                              |
| `scroll_depth`               | `useScrollDepth.ts`                            | **Fassade A**            | `{seite, stufe}`                                                                        | **✅ JA**                          | PII_SAFE_BY_TYPE                                               |
| `panel_select`               | `EpigeneticsPage.tsx`                          | **Fassade A**            | `{panel: MerkSlug}`                                                                     | **✅ JA**                          | PII_SAFE_BY_TYPE                                               |
| `quote_request`              | `EpigeneticsPage.tsx`                          | **Fassade A**            | `{panels: MerkSlug[]}`                                                                  | **✅ JA**                          | PII_SAFE_BY_TYPE                                               |

**Die vier Fassaden-Ereignisse erreichen heute keinen Provider** (§6) — sie sind spezifiziert, typgesichert
und wirkungslos.

**PLANNED (Master-Scope AP23 PT23.3) — heute NICHT vorhanden:** `contact_submit`, `support_submit`,
`roi_report_request`, `epigenetics_inquiry_submit`, `lead_magnet_submit`, `download_delivered`.
Von der geforderten Taxonomie existiert heute allein `consumer_order_submit` (PT23.3.4).
Insbesondere feuert **keine** der fünf Lead-Journeys aus `BACKEND-LEAD-CURRENT-STATE.md` ein
Conversion-Event — außer der Consumer-Bestellung.

---

## 14. Storage and Cookie Inventory

Suche über den aktiven Baum nach `localStorage`, `sessionStorage`, `document.cookie`, `indexedDB`.

| Key                                     | Ort                                         | Zweck                                            | Klassifikation                                | Verhindert Ablehnung die Anlage?                                            |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------- |
| `cookie-consent`                        | `CookieBanner.tsx:145,217`; `index.html:41` | speichert das `CookieCategory[]`-Array           | **ESSENTIAL** (Consent-Nachweis)              | **nein — und das ist korrekt**: die Ablehnung _ist_ der gespeicherte Inhalt |
| `merkliste` (Panel-Merkliste)           | `src/lib/merkliste.ts`                      | fachliche Nutzerpräferenz der Epigenetik-Strecke | **PREFERENCES**                               | nein — funktional, kein Tracking                                            |
| `window.__pvOnGrantFired`               | `CookieBanner.tsx:52`                       | In-Memory-Guard gegen Doppel-Pageview            | **OTHER** (kein Storage, nur Fenstervariable) | n/a                                                                         |
| GA4-/GTM-Cookies (`_ga`, `_ga_*` o. ä.) | vom Container gesetzt                       | Analytics                                        | **ANALYTICS**                                 | **UNKNOWN** — siehe unten                                                   |
| HiHuman-Storage/Cookies                 | vom Fremdbundle gesetzt                     | Chat                                             | **OTHER**                                     | **UNKNOWN** — Fremdcode                                                     |

**`sessionStorage`, `document.cookie`, `indexedDB`:** im Anwendungscode **nicht verwendet**. Alle
Cookie-Setzungen stammen ausschließlich von Drittanbieter-Skripten.

**Zur `UNKNOWN`-Einstufung der GA4-Cookies:** in der Laufzeitbeobachtung (§15) wurden in **keinem**
Szenario Cookies gesetzt — aber das ist ein **Artefakt der Messmethode**: der GTM-Container wurde
abgebrochen und konnte deshalb gar nichts setzen. Ob Consent Mode v2 mit `analytics_storage:'denied'`
die Cookie-Setzung im realen Betrieb tatsächlich unterbindet, hängt an der Container-Konfiguration und
war hier bewusst nicht prüfbar (§22, G1).

---

## 15. Runtime Network Proof

**NETWORK_RUNTIME_PROOF = RUN.**

### Methode

Ein Wegwerf-Node-Skript (im Scratchpad, nicht im Repository) hat den **bereits existierenden**
`dist/client`-Build unverändert auf `127.0.0.1:8899` ausgeliefert und ihn mit Playwright 1.57/Chromium
geladen. **Es wurde nichts gebaut** (`dist/` blieb unberührt, Stand 2026-08-18 12:41 = Baseline-HEAD),
**kein bestehender Dienst gestartet oder verändert**, **kein Formular abgesendet**.

Jede Anfrage lief durch `ctx.route('**', …)`: Ziel `127.0.0.1`/`data:`/`blob:` → `continue()`;
**jedes andere Ziel → protokollieren und `abort()`**. Damit ist der Nachweis, welche Origins die Seite
_anfordert_, exakt — und **kein einziges Byte hat einen realen Provider erreicht**.

Konsequenz für die Aussagekraft: die Beobachtung beweist **Anforderungsversuche**, nicht die Folgewirkung
des Providers (keine GA4-Cookies, keine HiHuman-Folgeverbindungen — beides konnte nicht entstehen).

Einschränkung: statisch ausgeliefert, daher ohne SSR-Markup und **ohne die CSP-Header aus `server.ts`**.
Für die Frage „welche Origins werden angefordert" ist das ohne Belang, weil die CSP ohnehin `Report-Only` ist.

### Beobachtungen

| Szenario                                     | `cookie-consent`                         | Externe Origins **angefordert**                    | `gtag` def. | dataLayer-Events                                      | ChatWidget-Tag    |
| -------------------------------------------- | ---------------------------------------- | -------------------------------------------------- | ----------- | ----------------------------------------------------- | ----------------- |
| **A · frischer Storage, keine Einwilligung** | —                                        | **`googletagmanager.com`, `widget.hihuman.co.uk`** | ✅          | `consent:default`, `gtm.js`                           | **✅ injiziert**  |
| **B · ausdrückliche Ablehnung gespeichert**  | gesetzt, alle nicht-essenziellen `false` | **`googletagmanager.com`, `widget.hihuman.co.uk`** | ✅          | `consent:default`, `gtm.js`                           | **✅ injiziert**  |
| **C · Analytics akzeptiert**                 | analytics `true`                         | `googletagmanager.com`, `widget.hihuman.co.uk`     | ✅          | `consent:default`, **`consent:update`**, `gtm.js`     | ✅                |
| **D · Alle akzeptiert**                      | alle `true`                              | `googletagmanager.com`, `widget.hihuman.co.uk`     | ✅          | `consent:default`, **`consent:update` ×2**, `gtm.js`  | ✅                |
| **F · Consumer-Seite, keine Einwilligung**   | —                                        | **`googletagmanager.com`**                         | ✅          | `consent:default`, `gtm.js`, **`consumer_page_view`** | ❌ (andere Shell) |

In allen Szenarien: `script[src]`-Hosts im DOM = `www.googletagmanager.com`, eigene Origin, und
(außer F) `widget.hihuman.co.uk`. Cookies: in keinem Szenario welche — Artefakt der Blockade (§14).

### Auswertung

1. **A vs. B ist der entscheidende Vergleich.** Die Menge der angeforderten Origins ist **identisch**.
   Eine ausdrückliche Ablehnung ändert am Ladeverhalten **nichts**; sie ändert nur Consent-Signale
   innerhalb eines bereits geladenen Providers.
2. **A beweist die `REST-02`-Verletzung direkt:** ohne jede Entscheidung des Nutzers werden zwei
   nicht-essenzielle Drittanbieter kontaktiert.
3. **F beweist zweierlei:** die Consumer-Shell lädt HiHuman nicht (bestätigt §8/§12), **und** sie schreibt
   `consumer_page_view` vor jeder Einwilligung in den dataLayer (bestätigt §12).
4. **C/D zeigen**, dass Zustimmung nur `consent:update`-Einträge hinzufügt — es wird **nichts nachgeladen**,
   weil bereits alles geladen war.

**Nicht beobachtbar — Szenario E (Widerruf):** es existiert kein Widerruf-Weg in der Anwendung (§17). Ein
Test hätte nur ein manuelles Löschen von `localStorage` nachgestellt, was keine Produktfunktion abbildet.
Deshalb bewusst nicht als Szenario ausgeführt.

Der Scratch-Server wurde beendet; `127.0.0.1:8899` ist wieder frei, kein Prozess blieb zurück.

---

## 16. REST-02 Compliance Matrix

`REST-02`: _„Basic Consent Mode v2 / vollständiger Ladeverzicht. GTM/GA4 und andere nicht notwendige
Marketing-/Analytics-Tags laden erst nach Einwilligung."_

| Provider / Mechanismus                       | Status                                           | Evidenz                                                                                                                                                                                                                                                                       |
| -------------------------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GTM-Skript (`gtm.js`)**                    | **NON_COMPLIANT**                                | `index.html:71-81` lädt bedingungslos; §15 A und B: in beiden Fällen angefordert                                                                                                                                                                                              |
| **GTM-`noscript`-iframe (`ns.html`)**        | **NON_COMPLIANT**                                | `index.html:188-201`; greift bei deaktiviertem JS, also genau dann, wenn kein Consent-Dialog laufen kann. AP23 PT23.1.2 fordert ausdrücklich die Entfernung                                                                                                                   |
| **GA4 / gtag**                               | **PARTIAL**                                      | Consent-Mode-Signale korrekt `denied` (`:27-35`) ⇒ Datenübertragung sollte unterbleiben; **aber** `gtag` ist global definiert und `GtmPageview.tsx:84` ruft `gtag('event','page_view')` ungeprüft auf. Ob daraus ein Request wird, entscheidet der Container — nicht der Code |
| **dataLayer-Erzeugung**                      | **NON_COMPLIANT** _(im Sinne des Ladeverzichts)_ | `index.html:20` legt das Array vor jeder Entscheidung an. Für sich genommen keine Netzwirkung — als Übergabepunkt an den bereits geladenen Container jedoch wirksam                                                                                                           |
| **dataLayer-Events vor Consent**             | **NON_COMPLIANT**                                | `gtm.js`, `virtual_pageview`, `consumer_page_view`, `consumer_cta_click`, `consumer_order_*` — alle ohne Guard (§13)                                                                                                                                                          |
| **Kanonische Fassade `src/lib/tracking.ts`** | **COMPLIANT**                                    | zwei Sperren, kein Puffer, PII-Typschranke (§6). Erfüllt PT23.1.9 und PT23.2 vollständig — ist aber nie aktiviert                                                                                                                                                             |
| **`GtmPageview`**                            | **NON_COMPLIANT**                                | einzige Prüfung ist `typeof gtag === 'function'` (`:83`), die immer wahr ist                                                                                                                                                                                                  |
| **Consumer-Tracking**                        | **NON_COMPLIANT**                                | vier ungeschützte Push-Pfade (§12); zusätzlich fehlt auf der Consumer-Shell der Banner ganz                                                                                                                                                                                   |
| **HiHuman / ChatWidget**                     | **NON_COMPLIANT**                                | bedingungslose Skript-Injektion (§8); §15 A/B: in beiden Fällen angefordert. Zusätzlich `DEC-RL-007`-Verstoß                                                                                                                                                                  |
| **Google Fonts**                             | **NOT_APPLICABLE**                               | zur Laufzeit nicht verwendet (selbstgehostet); nur veraltete CSP-Einträge                                                                                                                                                                                                     |
| **Sonstige Drittanbieter**                   | **NOT_APPLICABLE**                               | keine weiteren Subressourcen-Origins im aktiven Code (§9)                                                                                                                                                                                                                     |

**Gesamtstatus REST-02: NON_COMPLIANT.**
Von zehn bewerteten Punkten: 1 × COMPLIANT (die inaktive Fassade), 1 × PARTIAL, **6 × NON_COMPLIANT**,
2 × NOT_APPLICABLE.

---

## 17. Withdrawal Behaviour

| Frage                                     | Ist-Zustand                                                                                                                                                                                                                                                                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Existiert überhaupt ein Widerruf-Weg?** | **Nein.** Nach gespeicherter Entscheidung gibt `CookieBanner` `null` zurück (`:277`). Es gibt keinen Wiederöffnen-Knopf, keinen Footer-Link und keine Route, die `cookie-consent` zurücksetzt. `grep` über `src/` nach `removeItem('cookie` / `withdraw` / `revoke` / „Cookie-Einstellungen" liefert **nichts** außer dem Aufklapp-Knopf im Banner selbst |
| Werden Consent-Signale zurückgesetzt?     | technisch möglich über den Weg „Einstellungen → abwählen → speichern" — **aber nur, solange der Banner noch sichtbar ist**, also vor der ersten Entscheidung                                                                                                                                                                                              |
| Wird der Tracking-Provider abgemeldet?    | **Nein.** `setTrackingProvider(null)` existiert als Funktion (`tracking.ts:132`) und wird nie aufgerufen                                                                                                                                                                                                                                                  |
| Werden geladene Skripte entfernt?         | **Nein.** Weder `gtm.js` noch das HiHuman-Bundle werden entladen. `ChatWidget`s Cleanup entfernt den `<script>`-Knoten beim Unmount, was bereits ausgeführten Code nicht rückgängig macht                                                                                                                                                                 |
| Sind Netzverbindungen umkehrbar?          | **Nein** — eine erfolgte Anfrage ist nicht widerrufbar                                                                                                                                                                                                                                                                                                    |
| Werden Cookies gelöscht?                  | **Nein.** Kein `document.cookie`-Zugriff im gesamten Anwendungscode                                                                                                                                                                                                                                                                                       |
| Sind gepufferte Ereignisse vorhanden?     | **Nein** — die kanonische Fassade puffert bewusst nicht (§6); die dataLayer-Pfade puffern ebenfalls nicht, sie senden sofort                                                                                                                                                                                                                              |
| Wird `dataLayer` geleert?                 | **Nein.** Das Array bleibt bestehen; GTM hat die Einträge bereits verarbeitet                                                                                                                                                                                                                                                                             |
| Ändert ein Reload das Verhalten?          | **Teilweise.** Nach Reload liest `index.html:37-67` den gespeicherten Zustand und setzt die Signale entsprechend — **der Container wird aber erneut geladen** (T4). Das Ladeverhalten ist reload-invariant                                                                                                                                                |

**Vergleich mit AP23 PT23.1.6 („Widerruf"):** die Anforderung ist **ABSENT**. Es gibt keinen
Nutzerpfad, um eine einmal getroffene Entscheidung zu ändern — weder zur Erweiterung noch zur
Zurücknahme. Der einzige Weg wäre das manuelle Löschen von `localStorage` in den Browser-Entwicklertools.

---

## 18. PII / Privacy Analysis

| Payload-Feld                                                        | Ereignis(se)                                                    | Klassifikation       | Begründung                                                                                                                                                                                                                                                              |
| ------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `page_location` (volle URL inkl. Query)                             | `page_view` (SPA), `virtual_pageview`, `page_view` (Nach-Feuer) | **PII_RISK**         | die Kontakt-Strecke trägt Kontext in der Query: `?source=epigenetics`, `?panel=…`, `?topic=epigenetik`, `?intent=quote`. Das sind heute keine personenbezogenen Werte, aber die URL wird ungefiltert übertragen — jeder künftige Query-Parameter landet automatisch mit |
| `page_path`, `page_title`, `page_language`, `page_referrer`         | dieselben                                                       | **PII_SAFE_BY_TYPE** | Seitenmetadaten; `page_referrer` kann jedoch eine fremde URL mit deren Parametern tragen → grenzwertig                                                                                                                                                                  |
| `consumer_page`, `product`, `quantity`, `cta_label`, `cta_location` | Consumer-Events                                                 | **PII_SAFE_BY_TYPE** | feste Aufzählungswerte bzw. UI-Beschriftungen                                                                                                                                                                                                                           |
| `consent_analytics`, `consent_marketing`                            | `consent_update`                                                | **PII_SAFE_BY_TYPE** | `granted`/`denied`                                                                                                                                                                                                                                                      |
| `panel`, `seite`, `stufe`, `panels[]`                               | Fassaden-Ereignisse                                             | **PII_SAFE_BY_TYPE** | durch `nutzlastIstSauber()` gegen `MERK_SLUGS` geprüft (`tracking.ts:162-175`) — die einzige aktive PII-Typschranke im Repository                                                                                                                                       |
| GTM-Container-Parameter                                             | Initial-`page_view`                                             | **UNKNOWN**          | Containerkonfiguration nicht einsehbar (§22, G1)                                                                                                                                                                                                                        |
| HiHuman-Bundle-Payloads                                             | —                                                               | **UNKNOWN**          | Fremdcode (§22, G2)                                                                                                                                                                                                                                                     |

**Schnittstelle zu den Lead-Journeys** (Querbezug zu `BACKEND-LEAD-CURRENT-STATE.md`): von den sechs
Submission-Journeys feuert **genau eine** ein Tracking-Ereignis — J4 Consumer Order mit
`consumer_order_submit` (`OrderForm.tsx:165`). Dessen Payload enthält **keine** Bestellerdaten: nur
`consumer_page`, `product`, `quantity`. Name, E-Mail, Telefon und Lieferadresse gehen ausschließlich an
das Backend, nicht in den dataLayer. **Das ist im Ist-Zustand korrekt gelöst.** Die übrigen fünf Journeys
(Contact, Praxis Order, Support, ROI Report, Chat) senden überhaupt kein Ereignis.

**Kein PII-Leck über Event-Payloads festgestellt.** Das einzige strukturelle Risiko ist die ungefilterte
Übertragung der vollständigen URL.

---

## 19. Gap to Master Scope AP23

| Anforderung                                                                      | Status                                 | Ist-Befund                                                                                                                                                                                     |
| -------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PT23.1.1** GTM/GA4 nicht initial laden                                         | **ABSENT**                             | `index.html:71-81` lädt bedingungslos; §15 A/B                                                                                                                                                 |
| **PT23.1.2** `noscript`-iframe vor Consent entfernen/unterbinden                 | **ABSENT**                             | `index.html:188-201` unverändert vorhanden                                                                                                                                                     |
| **PT23.1.3** Provider erst nach Einwilligung dynamisch laden                     | **ABSENT**                             | es gibt keinen dynamischen Ladepfad — alles lädt im Bootstrap                                                                                                                                  |
| **PT23.1.4** Default-Zustand ohne Provider-Request                               | **ABSENT**                             | zwei Requests im Default-Zustand nachgewiesen                                                                                                                                                  |
| **PT23.1.5** Consent persistieren                                                | **PRESENT**                            | `localStorage['cookie-consent']`, beim Bootstrap zurückgelesen                                                                                                                                 |
| **PT23.1.6** Widerruf                                                            | **ABSENT**                             | kein Widerruf-Weg (§17)                                                                                                                                                                        |
| **PT23.1.7** Kategorien sauber modellieren                                       | **PARTIAL**                            | drei Kategorien vorhanden, nicht-essenzielle default aus. **Aber**: `necessary` ist ein reines Label ohne technische Wirkung, und `marketing`/`analytics` steuern nur Signale, keinen Ladepfad |
| **PT23.1.8** Consent-Evidence serverseitig, wo Lead-/Marketingzweck es erfordert | **ABSENT**                             | das Backend erhält ein nacktes `consent === true` ohne Zeitstempel/Version/Umfang und speichert nichts (`BACKEND-LEAD-CURRENT-STATE.md` §12)                                                   |
| **PT23.1.9** keine Event-Queue vor Consent                                       | **PRESENT**                            | verifiziert für alle fünf Systeme — keines puffert (§6, §7)                                                                                                                                    |
| **PT23.2.1** providerneutrale Fassade als Kern                                   | **PARTIAL**                            | die Fassade existiert und ist gut gebaut — ist aber **nicht der Kern**, sondern der einzige inaktive Pfad                                                                                      |
| **PT23.2.2** `setTrackingProvider`/`setTrackingConsent` bewusst registrieren     | **ABSENT**                             | werden nirgends aufgerufen (§6)                                                                                                                                                                |
| **PT23.2.3** direkte `dataLayer`-Aufrufstellen nicht blind übernehmen            | **CONFLICTING_CURRENT_IMPLEMENTATION** | vier solcher Stellen existieren bereits auf der Baseline (§7 B, D, E; §12) — unabhängig von `main`                                                                                             |
| **PT23.2.4** typisierte Events                                                   | **PARTIAL**                            | nur in der Fassade; die dataLayer-Pfade sind untypisiert                                                                                                                                       |
| **PT23.2.5** keine PII                                                           | **PARTIAL**                            | Fassade mit Slug-Allowlist; `page_location` überträgt die volle URL (§18)                                                                                                                      |
| **PT23.2.6** Consent-Guard zentral                                               | **ABSENT**                             | vier von fünf Systemen umgehen jeden Guard                                                                                                                                                     |
| **PT23.3** Conversion-Taxonomie (9 Punkte)                                       | **PARTIAL**                            | von den geforderten Ereignissen existiert allein `consumer_order_submit`; `page_view` existiert, jedoch mit **zwei** Doppelzählungsquellen (§7)                                                |
| **PT23.4** GTM/GA4-Container-Konfiguration                                       | **UNKNOWN**                            | Container nicht einsehbar (§22, G1)                                                                                                                                                            |
| **PT23.5** Performance-Monitoring getrennt                                       | **ABSENT**                             | kein Web-Vitals-Sammler im aktiven Code; Reconciliation-Map **B2** ist ein Import-Kandidat, dessen Senke `/api/monitoring/*` nicht existiert                                                   |

**Bilanz gegen AP23:** 2 × PRESENT · 6 × PARTIAL · 9 × ABSENT · 1 × CONFLICTING · 1 × UNKNOWN.
**DoD AP23** („Vor Consent entstehen keine GTM-/GA4-Marketing-/Analytics-Requests") ist **nicht erfüllt**.

---

## 20. Risks

### CRITICAL

**R1 — GTM lädt vor jeder Einwilligung, Ablehnung ändert nichts.**
`index.html:71-81` lädt den Container bedingungslos; §15 zeigt identische Origin-Mengen für „keine
Entscheidung" und „ausdrücklich abgelehnt". Damit entsteht bei jedem Seitenaufruf eine Verbindung zu
Google mit IP, User-Agent und Referrer, bevor der Nutzer gefragt wurde. Die `denied`-Signale begrenzen,
was der Container _tut_ — nicht, dass er _geladen_ wird. _Verletzt:_ `REST-02`, `DEC-RL-004`, AP23 PT23.1.1/.4, Launch-Gate 2.

**R2 — HiHuman-Bundle wird ohne Consent-Prüfung injiziert.**
`ChatWidget.tsx:7-23` hängt auf jeder Seite der B2B-Shell ein Fremdskript ein; §15 A/B bestätigen den
Ladeversuch mit und ohne Ablehnung. Das Verhalten des Bundles nach dem Laden ist nicht kontrollierbar,
und die CSP erlaubt ihm `connect-src` auf `*.hihuman.co.uk`. _Verletzt:_ `REST-02`, `DEC-RL-007`, Gates 2 und 5.

**R3 — Consumer-Seiten tracken ohne jede Widerspruchsmöglichkeit.**
Die Consumer-Shell liegt außerhalb von `MainLayout` und enthält **keinen** `CookieBanner` (§12), während
GTM lädt und vier Event-Pfade ungeprüft in den dataLayer schreiben. Kampagnen-Traffic landet damit auf
Seiten, die messen, aber keine Einwilligung einholen. _Verletzt:_ `REST-02`, AP21 PT21.1.4.

### HIGH

**R4 — `noscript`-iframe umgeht den Consent-Mechanismus vollständig.**
`index.html:188-201` lädt `ns.html` genau dann, wenn JavaScript deaktiviert ist — also wenn weder Banner
noch Consent-Mode laufen können. Es gibt keinen Zustand, in dem dieser Pfad geprüft würde.
_Verletzt:_ AP23 PT23.1.2.

**R5 — `GtmPageview` sendet GA4-Events ohne Consent-Prüfung.**
`GtmPageview.tsx:84` ruft `gtag('event','page_view', …)` bei jeder SPA-Navigation; die einzige Bedingung
(`typeof gtag === 'function'`) ist immer erfüllt, weil `gtag` im Bootstrap definiert wird. Die Komponente
hängt site-weit über B2B **und** Consumer.

**R6 — Kein Widerruf möglich.**
Nach der ersten Entscheidung existiert kein Nutzerpfad zurück (§17). Das betrifft beide Richtungen: wer
abgelehnt hat, kann nicht zustimmen; wer zugestimmt hat, kann nicht widerrufen.
_Verletzt:_ AP23 PT23.1.6.

**R7 — Die kanonische Fassade ist tot.**
`setTrackingProvider`/`setTrackingConsent` werden nie aufgerufen (§6). Vier sorgfältig typisierte
Ereignisse aus der Epigenetik-Strecke laufen ins Leere, während vier ungesicherte dataLayer-Pfade
tatsächlich senden. Der Zustand ist die exakte Umkehrung der Zielarchitektur aus PT23.2.

**R8 — Doppelzählung von `page_view` aus zwei Quellen.**
`GtmPageview.tsx:84` bei jeder Navigation **und** `CookieBanner.tsx:57` beim Zustimmen, zusätzlich zum
Initial-`page_view` des Containers. `__pvOnGrantFired` schützt nur gegen Wiederholung innerhalb der
Session. Der Kopfkommentar von `GtmPageview` warnt selbst vor genau diesem Muster, falls ein
GTM-Trigger auf `virtual_pageview` hinzukäme. _Verletzt:_ AP23 PT23.3.10.

### MEDIUM

**R9 — CSP ist `Report-Only` mit pauschalem `https:`.** Sechs Direktiven enden auf `https:`, was die
namentliche Allowlist bedeutungslos macht; dazu `'unsafe-inline'` und `'unsafe-eval'` in `script-src`
(§10). Kein `report-uri` konfiguriert, die Meldungen gehen ins Leere. _Verletzt:_ AP26 PT26.2.3/.5.

**R10 — Drei veraltete CSP-Domains.** `ssl.google-analytics.com` (von GA4 nicht mehr genutzt),
`fonts.googleapis.com` und `fonts.gstatic.com` (Fonts sind selbstgehostet). Sie erweitern die
Angriffsfläche ohne Nutzen.

**R11 — Volle URL in Analytics-Payloads.** `page_location` überträgt Query-Parameter ungefiltert;
heute unkritisch (`source`, `panel`, `intent`), aber jeder künftige Parameter reist automatisch mit (§18).

**R12 — Consent-Zustand ohne Evidenz und ohne Versionierung.** Gespeichert wird ein Kategorien-Array
ohne Zeitstempel und ohne Textversion. Eine spätere Textänderung ist nicht von einer Alt-Zustimmung
unterscheidbar. _Verletzt:_ AP23 PT23.1.8.

**R13 — `necessary` ist ein Label ohne Wirkung.** Die Kategorie ist `required:true` und wird nie
ausgewertet; sie steuert keinen technischen Pfad.

### LOW

**R14 — Verwaister `POST /api/chat`** (`server/server.js:503`) mit ~25 Zeilen Teams-Roadmap-Kommentar —
ohne Netzwirkung, aber irreführend.
**R15 — `gtag`-Erwähnung in `public/locales/da/legal.json`** — der dänische Rechtstext beschreibt das
Tracking-Verhalten; muss bei einer Umstellung mitgezogen werden.
**R16 — Kein einziger Consent-/Tracking-Test.** Weder Unit noch E2E; AP27 PT27.4 fordert genau diese
vier Szenarien.

---

## 21. Recommended Stable Contracts for building-docs

**Nur Empfehlungen — hier wird nichts erstellt.** Bewertet gegen den existierenden `building-docs/`-Baum
und die bereits in `IMPLEMENTATION-HOTSPOTS.md` §14 ausgesprochenen Empfehlungen.

| Dokument                   | Lohnt sich?                | Frühestes AP       | Inhalt und Begründung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | -------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`CONSENT-CONTRACT.md`**  | **Ja — höchste Priorität** | AP23 PT23.1        | Bereits in `IMPLEMENTATION-HOTSPOTS.md` §14 vorgeschlagen; dieses Audit schärft den Inhalt. Muss festlegen: (a) **welche Origins vor Consent kontaktiert werden dürfen — im Zielbild: keine**; (b) den Ladepfad je Kategorie (dynamisches Nachladen statt Bootstrap-Load); (c) die vier Consent-Typen A–D aus `BACKEND-LEAD-CURRENT-STATE.md` §12 und ihre Trennung; (d) das Speicherformat inklusive **Zeitstempel und Textversion** (heute fehlend, R12); (e) die Widerruf-Semantik: was entladen, was gelöscht, ob Reload (heute alles ungeklärt, §17); (f) das Verhalten der Consumer-Shell. **Barriere S3 aus `IMPLEMENTATION-HOTSPOTS.md` bleibt HART, bis dieses Dokument existiert.** |
| **`TRACKING-CONTRACT.md`** | **Ja**                     | AP23 PT23.2–PT23.3 | Deckt ab, was der Consent-Vertrag nicht regelt: die **eine** verbindliche Event-API (heute fünf Systeme, §7), die vollständige Taxonomie aus PT23.3 mit Payload-Schemata, die PII-Regeln (Slug-Allowlist als Vorbild, `page_location` als offene Frage), die Doppelzählungsregeln (R8) und die Zuordnung Journey → Event, die heute für fünf von sechs Lead-Journeys leer ist (§18). Entspricht Scope §10 Nr. 7 (`TRACKING-PLAN.md`).                                                                                                                                                                                                                                                         |
| **`NETWORK-ALLOWLIST.md`** | **Ja**                     | AP26 PT26.2        | Die Origin-Tabelle aus §9 als **verbindliche Liste** statt als Momentaufnahme: erlaubte Origins je Direktive, je Consent-Kategorie und je Umgebung, mit Begründung und Ablaufdatum. Muss die drei veralteten Domains (R10) und das pauschale `https:` (R9) auflösen und den Weg von `Report-Only` zu `Enforce` festhalten. Eignet sich als **generierter** Gegenpart zu einem CI-Guard, der die tatsächlich angeforderten Origins gegen die Liste prüft — die Methode aus §15 ist dafür direkt wiederverwendbar.                                                                                                                                                                              |

**Verhältnis zu den bereits empfohlenen Dokumenten:** `LEAD-DATA-CONTRACT.md` (aus
`BACKEND-LEAD-CURRENT-STATE.md` §20) muss die **Consent-Evidence-Struktur** definieren; sie ist der
Berührungspunkt zwischen Lead- und Consent-Vertrag und sollte in genau einem der beiden Dokumente
normativ stehen — Empfehlung: im `CONSENT-CONTRACT.md`, mit Verweis aus dem Lead-Vertrag.

**Nicht empfohlen:** ein separates „Cookie-Policy"-Dokument. Die Kategorien und ihre technische Wirkung
gehören in `CONSENT-CONTRACT.md`; der juristische Text gehört in die Datenschutzerklärung (AP20 PT20.4).

---

## 22. Evidence Gaps

**G1 — GTM-Container-Konfiguration nicht einsehbar.** Welche Tags im Container `GTM-TW6JFX7K` liegen,
auf welche Trigger sie reagieren, ob sie an Consent-Bedingungen geknüpft sind und welche GA4-Parameter
sie senden, ist außerhalb dieses Repositories konfiguriert. Deshalb sind in §16 der GA4-Punkt als
`PARTIAL` und in §13 der Initial-`page_view` als `UNKNOWN` geführt. **Konsequenz:** ob im realen Betrieb
trotz `analytics_storage:'denied'` Cookies gesetzt oder Daten übertragen werden, ist von hier **nicht**
feststellbar — nur, dass der Container geladen wird.

**G2 — Verhalten des HiHuman-Bundles nach dem Laden.** Das Skript ist Fremdcode; welche Verbindungen,
Cookies oder Storage-Einträge es erzeugt, wurde nicht ermittelt. Ein Laden hätte einen realen
Drittanbieter-Request bedeutet und war deshalb ausgeschlossen. In §9 und §14 als `UNKNOWN` geführt.

**G3 — Cookie-Setzung konnte nicht beobachtet werden.** In §15 wurden alle externen Anfragen abgebrochen;
GA4 und HiHuman konnten deshalb keine Cookies setzen. Die Beobachtung „keine Cookies in allen Szenarien"
ist ein **Artefakt der Messmethode** und darf nicht als Beleg für Cookie-Freiheit gelesen werden.

**G4 — Beobachtung ohne SSR und ohne CSP-Header.** Der Test lief gegen den statisch ausgelieferten
`dist/client`-Build, nicht gegen den SSR-Server. Für die Frage der angeforderten Origins ist das ohne
Belang (die CSP ist ohnehin `Report-Only`), für ein späteres Enforce-Szenario wäre eine Wiederholung
gegen den echten Server nötig.

**G5 — Beobachteter Build ist einen Tag älter als HEAD.** `dist/client` datiert auf 2026-08-18 12:41,
eine Minute nach dem HEAD-Commit `961f65d`. Er enthält damit **nicht** die uncommittete Änderung an
`src/pages/EpigeneticsPage.tsx`. Für Consent und Tracking ist diese Änderung ohne Bedeutung (sie betrifft
eine Tabellenkopfzeile), der Unterschied ist aber vermerkt.

**G6 — Szenario E (Widerruf) nicht ausführbar.** Es existiert kein Widerruf-Weg in der Anwendung (§17);
ein Test hätte nur manuelles Storage-Löschen nachgestellt und keine Produktfunktion abgebildet.

---

## 23. Final Classification

## CONSENT_BASELINE_READY_WITH_WARNINGS

**Warum READY.** Der Ist-Zustand ist vollständig, belegt und **zusätzlich empirisch bestätigt**:

- **Alle fünf aktiven Tracking-/Netz-Systeme wurden inspiziert** (§7) — einschließlich zweier, die die vorherige Analyse nur summarisch kannte (`OrderForm`, `OrderModal` als eigenständige Push-Stellen).
- **Alle laufzeitfähigen externen Origins sind inventarisiert** (§9), getrennt nach tatsächlicher Subressource, konditionalem Ziel und reinem Navigationslink — 15 Origins, davon 2 vor Consent tatsächlich angefordert.
- **`ChatWidget` wurde unabhängig nachverfolgt** (§8): 28 Zeilen vollständig gelesen, Mount-Punkt in `App.tsx` bestätigt, Reichweite auf die B2B-Shell eingegrenzt, CSP-Erlaubnis in drei Direktiven belegt, und die Frage „genügt das Entfernen von `/api/chat`?" mit **Nein** beantwortet und begründet.
- **Das Consumer-Tracking wurde separat verfolgt** (§12) — inklusive des Befunds, dass der Consumer-Shell der `CookieBanner` vollständig fehlt.
- **`REST-02` wurde provider-für-provider bewertet** (§16), nicht pauschal — 10 Einzelbewertungen.
- **Ein deterministischer Laufzeitbeweis liegt vor** (§15, `NETWORK_RUNTIME_PROOF = RUN`): fünf Szenarien gegen den existierenden Build, jede externe Anfrage protokolliert und abgebrochen. Der Vergleich A gegen B — „keine Entscheidung" gegen „ausdrücklich abgelehnt" — liefert **identische Origin-Mengen** und beweist die Kernaussage unmittelbar.

**Warum WITH WARNINGS.** Vier Bedingungen begleiten dieses Dokument:

1. **`REST-02` ist NON_COMPLIANT, und zwar an sechs von zehn Punkten** (§16). Das ist kein Detailmangel: die Grundarchitektur lädt Provider im Dokument-Bootstrap und regelt danach nur noch Signale. Der Umbau nach AP23 PT23.1.1–.4 betrifft `index.html`, `CookieBanner.tsx`, `GtmPageview.tsx`, den gesamten Consumer-Zweig und `ChatWidget.tsx` gleichzeitig.
2. **Drei CRITICAL-Risiken sind im laufenden Betrieb wirksam** — GTM vor Consent (R1), HiHuman ohne Consent-Prüfung (R2), Consumer-Tracking ohne Widerspruchsmöglichkeit (R3). Alle drei sind unabhängig vom Relaunch-Zeitplan aktiv.
3. **Die Zielarchitektur existiert bereits — und ist abgeschaltet.** `src/lib/tracking.ts` erfüllt PT23.1.9 und PT23.2 vollständig, wird aber von niemandem aktiviert, während vier ungesicherte Pfade tatsächlich senden (R7). Das ist eine günstige Ausgangslage für AP23, aber der heutige Zustand ist die Umkehrung des Ziels.
4. **Sechs Evidenzlücken bleiben offen** (§22), alle außerhalb des Repositories oder methodisch bedingt: Container-Konfiguration, Fremdcode-Verhalten, Cookie-Setzung (durch die Blockade nicht beobachtbar), fehlende CSP im Test, ein einen Tag älterer Build und der nicht existierende Widerruf-Pfad. Sie begrenzen die **Quantifizierung** einzelner Punkte, nicht die Feststellung der Kernbefunde.

Keine dieser Warnungen blockiert die Planung. Alle vier bestimmen mit, in welcher Reihenfolge AP23
ausgeführt werden muss — und sie belegen, warum Serialisierungsbarriere S3 aus
`IMPLEMENTATION-HOTSPOTS.md` HART bleibt, bis die Consent-Entscheidung dokumentiert ist.

---

_Erstellt durch read-only Inspektion am 2026-08-21 gegen `feat/home-leadmagnet@961f65d`. Geändert wurde
ausschließlich diese Datei. Kein Quellcode, keine Konfiguration, keine Dependencies, keine Lockfiles,
keine Environment-Dateien, keine Branches, keine Commits, keine Dienste, kein Deployment und kein
kanonisches `building-docs/`-Dokument wurde verändert. `dist/` wurde nicht neu gebaut. Nichts wurde
gestaged, committet oder gepusht. Es wurde kein Formular abgesendet und **kein Analytics-Ereignis an
einen realen Provider gesendet** — jede externe Anfrage der Laufzeitbeobachtung wurde vor dem Verlassen
des Rechners abgebrochen. Keine Secret-Werte, keine Bot-IDs und keine personenbezogenen Daten sind
wiedergegeben._
