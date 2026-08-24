# RUNTIME-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Dateien ändert, folgt zwingend der Kontextpflicht
in §8. Blindes Editieren ist untersagt.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> Der heutige Betrieb weicht in mehreren Punkten vom Zielbild ab (§6). **Dieser Vertrag beschreibt das
> SOLL** und ist kein Beleg dafür, dass es hergestellt ist.

---

## 1. Purpose

Dieser Vertrag beantwortet: **Welche Laufzeit-Topologie und welche Prozess-Invarianten müssen gelten?**

Er definiert die logische Dienstestruktur, die Trennung zwischen Quelle und Build-Artefakt, die
Toolchain-Zusage, die SSR-Invarianten, Netzexposition, Umgebungsmodell, Gesundheitsbegriff und
Beobachtbarkeit.

Wie diese Laufzeit gebaut, befördert, ausgerollt und zurückgerollt wird, regelt
`DEPLOYMENT-CONTRACT.md`.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`REST-01`** (Docker/Compose, Reverse Proxy davor, persistente Daten separat und
backupfähig, Secrets außerhalb Images, Healthchecks, Restart Policies, Monitoring, image-basiertes
Rollback), **AP02 PT02.1** (SSR-/Rendering-Zielbild), **AP02 PT02.5** (Produktionsbetriebs-Zielbild),
**AP28** (Umsetzung).

**Stand AP02 PT02.1 (2026-08-24):** Der SSR-/Rendering-Zielvertrag ist festgeschrieben — Ist-Erhebung in
**§3.1**, Zielinvarianten **RT-38 bis RT-70**, Zielmodell **§5.4/§5.5**, Schulden **RD-11 bis RD-16**,
Nachweise **RT-T14 bis RT-T22**. PT02.1 ist ein reiner **Dokumentationsschritt**: keine Quell-, Laufzeit-,
Konfigurations- oder Abhängigkeitsdatei wurde geändert, keine Implementierung aus AP09, AP10, AP21, AP25
oder AP27 vorgezogen. Dieser Vertrag trifft **keine** neue Framework- oder Hosting-Entscheidung — es
bleibt bei React + Express-SSR (`MASTER-SCOPE.md` §1.1) und `REST-01`.

**Mitbetroffene APs:** AP01 PT01.5.3 (Node-/Paketmanager-Pinning), AP09/AP10 (SSR-abhängige Semantik),
AP22 (API-/Worker-Rolle), AP23 (Consent-Ladeverhalten), AP25 (TTFB, Hydration, Assets),
AP26 (Header, Exposition), AP27 (Nachweise), AP32 (Betriebsmetriken), AP33 PT33.1.1.

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Current State

| Datei                                                                  | Rolle                                                                                                                                        | Guard  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| `server.ts`                                                            | Web/SSR-Dienst: Locale-301s, Sitemap, `KNOWN_PATHS`/echte 404, Security-Header/CSP, `no-store`, `/api/*`-Proxy, SSR-Render aus `dist/server` | **G3** |
| `src/entry-server.tsx` / `src/entry-client.tsx`                        | SSR- und Hydrationseinstiege                                                                                                                 | **G3** |
| `server/server.js`                                                     | Backend/API-Dienst (eigenes npm-Paket, Express 4)                                                                                            | **G3** |
| `dist/client`, `dist/server`                                           | **Build-Artefakte** — Produktion serviert daraus, **nicht** aus `src`                                                                        | **G3** |
| `vite.config.ts`                                                       | Client-/SSR-Build, SSR-Externals, Dev-Proxy                                                                                                  | G2     |
| `docker-compose.yml`                                                   | zwei Services, Netz, Restart Policies; **kein Worker, kein `volumes:`**                                                                      | **G3** |
| `Dockerfile`                                                           | zweistufig, **Node 22-alpine**, `HEALTHCHECK`                                                                                                | **G3** |
| `server/Dockerfile`                                                    | **Node 20**, kein `HEALTHCHECK`                                                                                                              | **G3** |
| `docs/deploy-preview.md`                                               | Preview-Runbook (detachter Host-Prozess)                                                                                                     | G1     |
| `nginx.conf`, `vercel.json`, `Dockerfile.dev`, `scripts/prerender.mjs` | **Altlast**, wirken aktiv (§6)                                                                                                               | G1     |

### 3.1 Ist-Zustand Rendering (AP02 PT02.1, read-only erhoben 2026-08-24)

**Dies ist der gemessene IST-Zustand, nicht das SOLL.** Er begründet die Zielinvarianten in §4 und die
Schulden `RD-11`–`RD-16` in §6, ist aber **keine** Freigabe und **kein** zulässiges Zielverhalten.

Erhebungsmethode: Quelllesung ohne Änderung, dazu ein SSR-Smoke gegen das vorhandene
Build-Artefakt (`dist/**`, erzeugt nach dem letzten Quellcommit dieser Linie) auf isolierten freien
Ports mit `BACKEND_URL` auf einem toten Port — ohne produktive Nebenwirkungen (`RT-29`).

| Aspekt                      | Ist-Fakt                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SSR-Entry**               | `src/entry-server.tsx` exportiert `render(url, lang)`: `renderToString`, `StaticRouter` mit `basename=/${lang}`, **pro Request eine eigene i18n-Instanz**, `HelmetProvider` mit Kontextobjekt, **genau eine** `<Suspense>`-Grenze um `<App />`. **Keine Fehlergrenze im SSR-Baum** — bewusst (AP01 PT01.3), damit ein Renderfehler ein echter HTTP 500 bleibt.                                                  |
| **Client-Hydration**        | `src/entry-client.tsx` hydriert **erst nach** `i18nReady`; `hydrateRoot` mit `StrictMode`, `HelmetProvider`, `BrowserRouter basename=/${lang}`, `RootErrorBoundary` und demselben Suspense-Fallback. Die Sprache stammt aus `window.location.pathname` — dieselbe Quelle wie im SSR.                                                                                                                            |
| **Express-SSR-Pfad**        | `server.ts`: Locale-, Legacy- und Consumer-301s laufen **vor** dem SSR-Catch-all; Produktion importiert `dist/server/entry-server.js`. Statusentscheidung: `isNotFound` aus `isKnownPath` **oder** dem gerenderten `NOT_FOUND_MARKER`. React-19-„Float"-Preload-Links werden aus dem Body-Anfang in den Head verschoben. Antwort trägt `no-store`.                                                              |
| **Head-Injektion**          | Helmet-Tags werden an `<!--helmet-head-->` eingesetzt. Die statischen `title`/`meta`/Root-Canonical aus `index.html` werden **nur dann** entfernt, wenn Helmet einen **nichtleeren** Titel geliefert hat — sonst bleiben die statischen Defaults in der Antwort stehen.                                                                                                                                         |
| **Code-Splitting**          | Rund 30 Seiten über `React.lazy`, gemeinsamer Wrapper `LazyRoute` = `<Suspense fallback={null}>`. **Die drei Consumer-Seiten sind bewusst eager importiert**; der Quellkommentar begründet das genau damit, dass sonst der Lazy-Fallback ausgeliefert würde und der Head auf den statischen `index.html`-Defaults stehen bliebe.                                                                                |
| **Cold-Render-Verhalten**   | **Gemessen:** die **erste** SSR-Anfrage je Lazy-Route und Prozess liefert Layout **ohne Seiteninhalt** und mit **leerem Helmet-Head**; ab der zweiten Anfrage derselben Route ist dieselbe Seite vollständig. Beleg `/de/diagnostics/dental`: `<main>` **1 030 → 64 041** Zeichen, Titel und Canonical erst beim zweiten Aufruf. Eager-Routen (`/de/`, `/en/consumer/*`) sind ab dem ersten Aufruf vollständig. |
| **404-/Status-Handshake**   | Echte 404 für unbekannte statische Pfade **und** unbekannte dynamische Slugs (gemessen). Der Marker `prerender-status-code` **fehlt beim Cold Render** — dort trägt die 404-Entscheidung allein über `isKnownPath`. `SEOHead notFound` unterdrückt Canonical, hreflang und `og:locale:alternate` und setzt robots `noindex, follow`.                                                                            |
| **Runtime-Error-Verhalten** | Ein SSR-Fehler geht über `next(error)` in den Express-Error-Handler: Produktion **HTTP 500** mit Klartext, Entwicklung 500 mit Stacktrace-HTML. `RootErrorBoundary` existiert **nur im Client-Baum**; im SSR gibt es keine Grenze, die einen 500 in eine 200-Antwort verwandeln könnte.                                                                                                                         |
| **Head-/SEO-Rendering**     | Genau ein Pfad: `SEOHead` (react-helmet-async) → Helmet-Kontext → Injektion in `server.ts`. Ein zweiter Head-Mechanismus existiert im Quellbaum nicht.                                                                                                                                                                                                                                                          |
| **Consumer-Routen**         | Drei Routen (`/consumer/{vitamin-d3-spray,hydrating-masks,inside-out-duo}`), eager, **ohne `noindex`**, mit eigenem Head. `server.ts` erzwingt jedoch 301 auf `/en/…` für alle Consumer-Pfade, und die Sitemap führt sie nur unter `/en/`. Der **Kopfkommentar in `src/App.tsx`** beschreibt sie weiterhin als „unlisted", `noindex` und Basic-Auth-geschützt — das ist **veraltet**.                           |
| **Epigenetik-Routen**       | Hub, drei Vertiefungsseiten und sechs Musterbefunde plus `musterbefund/:slug`-Auffangpfad, alle lazy; SSR 200 belegt (`AP01-RECONCILIATION-RESULT.md` §9.5), unbekannter Slug → 404.                                                                                                                                                                                                                            |

---

## 4. Target Invariants

### Artefakt und Quelle

**RT-01 · Die Laufzeit entspricht der Architektur, die gebaut und geprüft wurde.** Produktion serviert
niemals einen veralteten oder unbeabsichtigten Quell- bzw. Build-Zustand.

**RT-02 · Eine Quelländerung ist erst ausgerollt, wenn ein reproduzierbares Build-Artefakt sie enthält.**
Der Arbeitsbaum sagt nichts über den Live-Zustand aus.

**RT-03 · Build-Output ist abgeleitet, nicht Quelle der Wahrheit.** `dist/**` wird erzeugt, nie
gepflegt, nie von Hand korrigiert.

**RT-04 · Jedes Artefakt ist identifizierbar** und auf einen Git-SHA zurückführbar
(`DEPLOYMENT-CONTRACT.md` DEP-04).

**RT-05 · Client- und SSR-Artefakt gehören zusammen.** Beide entstehen aus demselben Build; eine
Mischung verschiedener Stände ist unzulässig — sie erzeugt Hydration-Fehler und falsche Asset-Hashes.

**RT-06 · Schutz gegen veraltetes `dist`.** Der Betrieb macht erkennbar, welcher Stand ausgeliefert wird;
ein Deploy ersetzt das Artefakt vollständig statt es zu überschreiben.
_(vgl. `DEPLOYMENT-CONTRACT.md` DEP-03)_

### Topologie

**RT-07 · Die logische Kette ist:**
`Browser → externer Reverse Proxy/nginx → Web/SSR-Dienst → API-Dienst → Persistenz/Worker/Integrationen (soweit erforderlich)`.
Das ist die **logische** Struktur; konkrete Netzadressen und Container-DNS-Namen entscheidet AP28.

**RT-08 · Die Dienstgrenzen sind eindeutig:**

| Dienst          | Zuständig für                                                                                                                                        | Nicht zuständig für                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| **Web/SSR**     | React/Express-SSR, Ausliefern der gebauten Client-Assets, Routing-/Status-/SEO-Antwortverhalten, Weiterleiten von API-Anfragen gemäß Zielarchitektur | Geschäftsverarbeitung, Persistenz               |
| **Backend/API** | Validierung und Persistenz von Lead-/Geschäftsanfragen, Backend-Geschäftslogik                                                                       | Rendering, SEO-Kopf, Browser-seitige Persistenz |
| **Worker**      | asynchrone Zustell-/Retry-Jobs, wo die Zielarchitektur sie verlangt                                                                                  | Beantwortung von HTTP-Anfragen                  |
| **Persistenz**  | dauerhafte Daten                                                                                                                                     | —                                               |

**RT-09 · Persistente Daten liegen außerhalb des verwerfbaren Anwendungscontainer-Dateisystems.**
_(`REST-01`, AP28 PT28.5.5)_

### Toolchain

**RT-10 · Es gilt genau eine unterstützte Node-Major-/Laufzeitzusage** für lokale Ausführung, CI, Build
und Container. **AP01 PT01.5.3 besitzt die endgültige Festlegung.**

**RT-11 · Der Paketmanager ist ausdrücklich gepinnt.** _(AP01 PT01.5.3)_

**RT-12 · Toolchain-Drift ist nach dem Pinning ein Gate-Versagen.** _(`QUALITY-GATES.md` QG-03)_

> **Evidenz, keine neue Entscheidung:** Gemessen laufen CI (`ci.yml`) und der Frontend-`Dockerfile` auf
> **Node 22**, der Backend-`server/Dockerfile` auf **Node 20**, die lokale Ausführung auf **20.19.6**;
> `package.json` deklariert weder `engines` noch `packageManager`. Das ist der **Ist-Zustand**, den AP01
> zu vereinheitlichen hat — dieser Vertrag wählt keine Version.

### SSR

> **RT-13 bis RT-21 sind die Basiszusagen.** Der ausformulierte SSR-/Rendering-Zielvertrag aus
> **AP02 PT02.1** steht direkt darunter: Rendering-Standard, Hydration, Lazy Loading, 404 vs.
> Laufzeitfehler, Head-/SEO-Rendering, Consumer und Epigenetik (**RT-38 bis RT-70**).

**RT-13 · SSR bleibt der SEO-kritische Standard.** Consumer und Epigenetik eingeschlossen.
_(AP02 PT02.1.1/.5)_

**RT-14 · Die Hydrierung entspricht der SSR-Ausgabe.** Kein zustandsabhängiges Markup im
Server-Output, das der Client anders rendert — insbesondere nichts Consent- oder
`localStorage`-Abhängiges. _(`CONSENT-CONTRACT.md` C-22)_

**RT-15 · Der SEO-Kopf wird serverseitig gerendert.** _(AP02 PT02.1.4, `SEO-CONTRACT.md`)_

**RT-16 · Echte 404-Semantik bleibt erhalten**, einschließlich des Handshakes zwischen `SEOHead notFound`
und dem Server-Marker. _(`ROUTING-CONTRACT.md` R-05/R-06, `SEO-CONTRACT.md` S-04/S-05)_

**RT-17 · Redirect-Semantik bleibt erhalten** — echte 301, ein Hop. _(`ROUTING-CONTRACT.md` R-03/R-04)_

**RT-18 · HTML wird nicht gecacht** (`no-store`), solange dieser Vertrag nichts anderes festlegt; die
Begründung ist die Kopplung an gehashte Assets. **Gehashte Assets dürfen langzeit-cachebar bleiben.**

**RT-19 · Die Sitemap-Auslieferung folgt dem SEO-Vertrag** und wird nicht durch eine statische Datei
beschattet. _(`SEO-CONTRACT.md` S-06)_

**RT-20 · API-Pfade fallen nicht in den SSR-Catch-all.** Der Proxy/die Weiterleitung greift vorher.

**RT-21 · Statische Assets werden nicht sprachumgeleitet.** Die Locale-Weiche gilt für Dokumente, nicht
für Assets, Locales-Dateien oder `/api/*`.

### Rendering-Standard (AP02 PT02.1)

**RT-38 · SSR ist der Standard für jede indexierbare HTML-Seite.** Was indexiert werden soll, wird
serverseitig gerendert. Es gibt keine indexierbare Seite, deren Inhalt erst im Browser entsteht.
_(präzisiert RT-13)_

**RT-39 · Der initiale HTTP-Response enthält semantisch ausreichendes HTML** — die Überschriftenebene,
den für Verständnis und Bewertung der Seite nötigen Textinhalt und die SEO-kritischen Head-Daten. Eine
Layout-Shell, ein Platzhalter oder ein leerer Inhaltsbereich erfüllt diese Zusage **nicht**.

**RT-40 · SSR ist nicht aufwärm- oder zustandsabhängig.** Dieselbe URL liefert dasselbe semantisch
vollständige Markup, unabhängig davon, wie oft der Prozess sie zuvor gerendert hat, in welcher
Reihenfolge Anfragen eintreffen und wie lange der Dienst läuft. „Erst ab dem zweiten Aufruf vollständig"
ist eine **Verletzung**, keine Optimierung.

**RT-41 · SSR wird nicht durch eine SPA-only-Architektur ersetzt.** Kein späterer AP ersetzt den
Express-SSR-Pfad durch reines Client-Rendering, einen statischen SPA-Fallback oder einen
Prerender-Ersatz.

**RT-42 · Performance- und Code-Splitting-Arbeit darf SSR nicht stillschweigend entfernen oder
aushöhlen.** Wer den Rendering-Pfad anfasst, weist die Invarianten dieses Abschnitts erneut nach (§9).
Die Optimierung selbst gehört **AP25** und ist nicht Bestandteil dieses Vertrags.

### Hydration (AP02 PT02.1)

**RT-43 · Server- und Client-Markup stimmen deterministisch überein.** Für dieselbe URL, dieselbe Locale
und denselben Serverzustand erzeugen SSR und Hydration denselben Markup-Baum.

**RT-44 · Browser-only-APIs nur in client-sicheren Pfaden.** `window`, `document`, `localStorage`,
`matchMedia`, `navigator` sowie Zeit- und Zufallsquellen gehören in Effekte, Event-Handler oder
ausdrücklich client-only gekennzeichnete Bereiche — nie in den initialen Renderpfad einer SSR-Seite.

**RT-45 · URL und Locale werden im Client identisch interpretiert wie im SSR.** Die URL ist die einzige
Sprachquelle (`MASTER-SCOPE.md` §1.1); weder ein Browser-Language-Detector noch ein gespeicherter
Sprachwunsch noch ein Header darf die Locale bei der Hydration anders auflösen als der Server.

**RT-46 · Keine SSR-relevante Rendering-Entscheidung hängt von unpersistiertem Client-Zustand ab.**
Consent-Zustand, `localStorage`, Cookies ohne Serversicht, Viewport oder Feature-Detection dürfen keinen
anderen initialen Markup-Zweig erzeugen als den servergerenderten. _(verschärft RT-14,
`CONSENT-CONTRACT.md` C-22)_

**RT-47 · Hydration-Warnungen und Hydration-Mismatches sind Regressionen**, kein akzeptierter
Betriebsmodus — auf repräsentativen Routen in jeder der zehn Sprachen.

**RT-48 · Hydration ersetzt korrektes SSR-Markup nicht unnötig und lässt es nicht flackern.** Ein
Suspense-Fallback, eine Fehlergrenze oder eine clientseitige Navigation darf servergerenderten,
korrekten Inhalt nicht durch leeren oder Platzhalterinhalt austauschen.

### Lazy Loading und Code-Splitting (AP02 PT02.1)

**RT-49 · Lazy Loading bleibt zulässig, solange SSR den korrekten sichtbaren Initialzustand liefert.**
Code-Splitting ist eine Auslieferungsoptimierung, keine Rendering-Strategie.

**RT-50 · SEO-kritischer Inhalt entsteht nie ausschließlich nach der Hydration.** Hauptinhalt,
Überschriftenstruktur und Head-Daten stehen im initialen Response — unabhängig davon, in welchem Chunk
die Seitenkomponente liegt.

**RT-51 · Ein Suspense-Fallback ist im SSR kein zulässiger Auslieferungszustand einer indexierbaren
Seite.** Ist die Seitenkomponente zur SSR-Zeit nicht verfügbar, ist das ein Fehlerfall des
Rendering-Pfads, keine hinnehmbare Antwort.

**RT-52 · Route-Chunks verschlucken die HTTP-Status-/404-Logik nicht.** Der Statuscode einer Antwort ist
unabhängig davon, ob der Chunk der Seite zur Renderzeit aufgelöst war. Insbesondere darf eine
Not-Found-Situation nicht deshalb als HTTP 200 ausgeliefert werden, weil das entscheidende Signal erst
nach Chunk-Auflösung entsteht.

**RT-53 · Neue Seiten folgen dem etablierten SSR-kompatiblen Pattern.** Wer eine Route ergänzt,
übernimmt das im Repository gültige Rendering-, Suspense- und Head-Muster und erfindet keinen zweiten
Renderpfad. Eine bewusste Abweichung wird im Code begründet — heutiges Vorbild: die eager importierten
Consumer-Seiten (§3.1).

### Nicht gefunden vs. Laufzeitfehler (AP02 PT02.1)

**RT-54 · „Nicht gefunden" und „Verarbeitung fehlgeschlagen" sind zwei getrennte Antwortklassen** und
werden nie vermischt. Die Zuordnung ist je Antwort eindeutig.

**RT-55 · NOT FOUND heißt: die Ressource oder Route existiert fachlich nicht** — unbekannter Pfad oder
unbekannter dynamischer Slug. Antwort: echter **HTTP 404**, **kein** Canonical, **kein** hreflang,
robots `noindex, follow`, Not-Found-Marker gesetzt. Der `SEOHead`-/`NOT_FOUND_MARKER`-Handshake bleibt
konzeptionell erhalten. _(RT-16, `ROUTING-CONTRACT.md` R-05/R-06, `SEO-CONTRACT.md` S-04/S-05)_

**RT-56 · Die 404-Entscheidung hängt nicht an einem einzelnen render-abhängigen Signal.** Solange ein
gerenderter Marker das einzige Signal für einen fachlichen Slug-404 ist, muss er unter **allen**
Renderbedingungen entstehen; andernfalls braucht die Statusentscheidung eine renderunabhängige Quelle.
Owner der renderunabhängigen Wahrheit: **AP10** über die Route Registry
(`ROUTING-CONTRACT.md` R-07/R-11).

**RT-57 · RUNTIME/RENDERING ERROR heißt: die Route ist bekannt, die technische Verarbeitung oder das
Rendering schlägt fehl.** Das ist ein Betriebsereignis, kein Aussage über die Existenz der Ressource.

**RT-58 · Ein technischer Fehler wird nie als 404 maskiert.** Weder Server noch Client dürfen eine
bekannte Route bei einem Verarbeitungsfehler als „existiert nicht" ausweisen — das wäre eine falsche
Deindexierungszusage gegenüber Suchmaschinen.

**RT-59 · Eine Fehlergrenze ersetzt kein Route-NotFound und keinen Statuscode.** `RootErrorBoundary` und
`SegmentErrorBoundary` sind Client-Resilienz. Sie sind nie das Mittel, mit dem eine Route ihre
Nichtexistenz oder ihren Fehlerstatus ausdrückt; insbesondere darf keine Fehlergrenze so in den SSR-Baum
wandern, dass ein echter 5xx zu einer 200-Antwort mit Fehlerseite wird.

**RT-60 · Die Fehlerstrategie bleibt testbar.** Je Antwort sind Fehlerklasse (fachlich nicht vorhanden /
technischer Fehler), HTTP-Status (404 / 5xx), Indexierungswirkung und Korrelationskennung (RT-33)
eindeutig bestimmbar. Die konkrete 5xx-Seite, die Retry-/Fallback-Politik und die Fehlerseiten-UX
gehören **AP10** (Statussemantik) und **AP27** (Nachweis) — PT02.1 implementiert sie nicht.

### Head-/SEO-Rendering (AP02 PT02.1)

**RT-61 · Genau ein kanonischer Head-/SEO-Pfad.** Alle Head-Daten laufen über die eine
SEO-Head-Komponente und deren serverseitige Injektion. Kein zweiter Mechanismus: kein direktes
DOM-Head-Schreiben, keine routeeigene Meta-Logik, kein paralleles Head-Framework.

**RT-62 · SSR-kompatibel sind: Title, Description, Canonical, hreflang inklusive `x-default`, Robots und
Structured Data.** Alle stehen im initialen Response. _(RT-15, `SEO-CONTRACT.md` S-01/S-02)_

**RT-63 · Head-Daten sind deterministisch aus URL- und Locale-Kontext ableitbar.** Dieselbe URL erzeugt
denselben Head — unabhängig von Client-Zustand, Prozess-Aufwärmzustand oder Anfragereihenfolge.

**RT-64 · Server und Client erzeugen keine konkurrierenden Head-Wahrheiten.** Statische Fallbacks aus
`index.html` und die gerenderten Werte stehen nicht nebeneinander: genau ein `<title>` und genau eine
`<meta name="description">` je ausgelieferter Seite. _(`SEO-CONTRACT.md` S-16)_

**RT-65 · NotFound publiziert keinen falschen Canonical und keinen falschen hreflang-Surface** — auch
dann nicht, wenn der Head aus einem Fallback-Zweig stammt. _(`SEO-CONTRACT.md` S-04)_

**RT-66 · Der Head ist nicht consent- oder client-zustandsabhängig.** _(RT-14, RT-46)_

> **Owner-Grenze:** **AP09** besitzt die SEO-Plattformimplementierung — SEOHead-Konsolidierung, Sitemap,
> Structured Data, Robots. PT02.1 legt ausschließlich die **Rendering-Anforderung** an den Head fest und
> zieht keine AP09-Arbeit vor.

### Consumer- und Epigenetik-Rendering (AP02 PT02.1)

**RT-67 · Consumer-Landingpages sind Bestandteil des normalen SSR-Vertrags.** Öffentlich indexierbar,
kein `noindex`, keine Basic Auth, keine SPA-only-Sonderarchitektur, kein eigener Renderpfad.
_(`DEC-RL-006`)_

**RT-68 · Die Zielarchitektur trägt Consumer in allen zehn Sprachen** — `de`, `en`, `pl`, `fr`, `it`,
`es`, `pt`, `da`, `nl`, `cs`. Kein EN-only-Zielbild, kein Sprachzwang-Redirect als Zielzustand.
_(`REST-03`, `DEC-RL-001`; Umsetzung **AP21** mit AP08/AP09/AP10)_

**RT-69 · Epigenetik rendert als eigenständige Geschäftssäule innerhalb der kanonischen
Runtime-Verträge.** Hub, Vertiefungsseiten und Musterbefunde sind SSR-fähig; für sie gelten dieselben
404-, Status-, Hydration- und Head-Verträge wie für jede andere Seite. _(`DEC-RL-005`)_

**RT-70 · Für keinen der beiden Bereiche entsteht eine Sonderarchitektur außerhalb dieses Vertrags.**
Eine bereichsspezifische Abweichung ist nur als dokumentierte, begründete Ausnahme im Code zulässig und
darf keine Invariante dieses Abschnitts brechen.

### Netz und Exposition

**RT-22 · Web- und API-Dienste sind nicht unbeabsichtigt direkt öffentlich erreichbar.**

**RT-23 · Bindung und Adresse entsprechen der beabsichtigten Reverse-Proxy-/Container-Topologie** —
nicht einer aus einem anderen Betriebsmodell übernommenen Annahme.

> **Ausdrücklich:** Die heutige Host-Preview bindet auf `127.0.0.1` hinter einem Host-nginx. Das ist für
> **dieses** Modell richtig und wird **nicht** als universelle Zielvorgabe fortgeschrieben — in einem
> Container-Netz kann eine andere Bindung nötig sein, damit der Dienst intern erreichbar ist.
> **AP28 entscheidet und verifiziert die konkreten Bind-Adressen gegen die tatsächliche
> Compose-Topologie.**

**RT-24 · Der Reverse Proxy ist die öffentliche Eingangsgrenze.** TLS, HSTS und öffentliche Ingress-Regeln
gehören dorthin. _(`REST-01`, AP26 PT26.1.2)_

**RT-25 · Interne Exposition folgt Least Privilege.** Ein Dienst ist nur für die erreichbar, die ihn
brauchen.

**RT-26 · Ausgehende Verbindungen folgen `NETWORK-ALLOWLIST.md`.**

### Umgebungen

**RT-27 · Drei Umgebungen mit eigener Identität:** `local/dev`, `preview/staging`, `production`.
Die Umgebung ist zur Laufzeit erkennbar. _(AP28 PT28.1)_

**RT-28 · Endpunkte und Secrets sind umgebungsspezifisch.** Keine Secret-Werte in Repository oder Image.
_(`REST-01`, AP28 PT28.3)_

**RT-29 · Preview/Staging erzeugen keine produktiven Nebenwirkungen** — nicht bei CRM, Mail oder Queue.
Der Isolationsvertrag aus `LEAD-DELIVERY-CONTRACT.md` LDV-16 und `CRM-INTEGRATION.md` CRM-18 gilt.

**RT-30 · Keine produktiven Kundendaten in Test- oder Entwicklungsumgebungen.**
_(`LEAD-DATA-CONTRACT.md` LD-23/LD-24)_

### Gesundheit

**RT-31 · „Der Prozess läuft" ist keine Gesundheit.** Ein Gesundheitsnachweis ist anwendungsnah:

| Dienst         | Gesund heißt                                                                                                           |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Web/SSR**    | Prozess lebt · SSR antwortet auf eine repräsentative Route · gebaute Assets erreichbar · Health-Route/-Prüfung positiv |
| **API**        | Prozess lebt · Anfrageverarbeitung verfügbar · kritische Abhängigkeiten angemessen abgebildet                          |
| **Worker**     | Prozess lebt · Queue-Verbindung/Bereitschaft gegeben                                                                   |
| **Persistenz** | dauerhafter Speicher verfügbar, wo erforderlich                                                                        |

**RT-32 · Bereitschaft und Lebendigkeit werden unterschieden**, wo es das Deployment braucht: „läuft"
ist nicht „kann Verkehr annehmen".

### Beobachtbarkeit

**RT-33 · Korrelationskennungen sind durchgängig**, wo anwendbar — `request_id` und `lead_id` verbinden
HTTP, Job, Zustellung und Log. _(`BACKEND-API-CONTRACT.md` API-12)_

**RT-34 · Logs sind ausreichend strukturiert**, um Fehler, Latenz und Verlauf auswertbar zu machen.

**RT-35 · PII wird in Logs redigiert.** Keine rohen Nutzlasten, keine Provider-Antwortkörper, keine
Secrets. _(`LEAD-DELIVERY-CONTRACT.md` LDV-21/LDV-22)_

**RT-36 · Betriebssignale sind vorhanden:** 5xx-/Fehlerraten, Latenz/TTFB, Container-/Prozess-Neustarts;
Queue-, CRM- und Mail-Signale über die jeweiligen Verträge.

**RT-37 · Marketing-Analytics ist keine Laufzeit-Observability** und niemals die alleinige Quelle für
Betriebsalarme. _(`TRACKING-CONTRACT.md` T-18, `CONSENT-CONTRACT.md` C-23)_

---

## 5. Target Model

### 5.1 Logische Topologie

```
                     ┌───────────────────────────┐
   Browser ────────► │ Reverse Proxy / nginx     │  ← öffentliche Eingangsgrenze (RT-24)
                     │ TLS · HSTS · Ingress      │
                     └────────────┬──────────────┘
                                  ▼
                     ┌───────────────────────────┐
                     │ Web / SSR                 │  server.ts
                     │ · SSR aus dist/server     │  Routing · Status · SEO-Kopf
                     │ · Assets aus dist/client  │  no-store HTML · gehashte Assets cachebar
                     └────────────┬──────────────┘
                                  │ /api/*  (RT-20)
                                  ▼
                     ┌───────────────────────────┐
                     │ Backend / API             │  Validierung · Persistenz
                     └───────┬─────────┬─────────┘
                             ▼         ▼
                  ┌────────────┐  ┌──────────────────┐
                  │ Persistenz │  │ Worker           │  asynchrone Zustellung/Retry
                  │ (separat)  │  │ (wo erforderlich)│
                  └────────────┘  └────────┬─────────┘
                                           ▼
                                  CRM · Mail (Adapter)
```

Adressen, Container-Namen und Bindungen: **AP28** (RT-23).

### 5.2 Quelle → Artefakt → Laufzeit

```
Git-SHA
  └─► reproduzierbarer Build ──► dist/client + dist/server (RT-05)
                                     └─► Image/Artefakt, SHA-rückführbar (RT-04)
                                            └─► Laufzeit serviert ausschließlich daraus (RT-02)
```

**Folgerung für Verifikation:** Ein Blick in `src` beweist nichts über den Live-Zustand. Wer prüfen will,
was ausgeliefert wird, prüft das Artefakt bzw. den laufenden Dienst.

### 5.3 Umgebungsmatrix

| Aspekt                     | local/dev                   | preview/staging                           | production   |
| -------------------------- | --------------------------- | ----------------------------------------- | ------------ |
| Identität                  | erkennbar                   | erkennbar                                 | erkennbar    |
| Quelle                     | Quelle/Dev-Server möglich   | **Artefakt**                              | **Artefakt** |
| Secrets                    | lokal, getrennt             | eigene                                    | eigene       |
| CRM/Mail/Queue             | Test-Adapter / abgeschaltet | **isoliert, keine produktiven Wirkungen** | produktiv    |
| Kundendaten                | keine                       | keine                                     | produktiv    |
| Öffentliche Erreichbarkeit | keine                       | begrenzt, nicht indexierbar               | öffentlich   |

### 5.4 Rendering-Pfad (Zielbild)

```
Request /<lang>/<path>
  │
  ├─ Locale-/Legacy-/Alt-URL-Weiche ──────────► echte 301, ein Hop        (RT-17, R-03/R-04)
  │
  ├─ /api/*  ─────────────────────────────────► Proxy, nie SSR-Catch-all  (RT-20)
  │
  └─ SSR-Render
       │  Routenwahrheit (Registry, AP10) + Locale aus der URL
       │
       ├─ Route bekannt, Rendering erfolgreich
       │     └─► 200 · vollständiges Markup · vollständiger Head · no-store
       │           (RT-38/39/40 · RT-50/51 · RT-61…RT-66 · RT-18)
       │
       ├─ Route oder Slug fachlich unbekannt
       │     └─► 404 · kein Canonical · kein hreflang · robots noindex, follow · Marker
       │           (RT-55/RT-56 · S-04/S-05 · R-05/R-06)
       │
       └─ Route bekannt, Verarbeitung/Rendering schlägt fehl
             └─► 5xx · nie 404 · nie 200 mit Fehlerseite · korrelierbar
                   (RT-57…RT-60 · RT-33)
```

Der Client hydriert diesen Zustand deterministisch (RT-43…RT-48). Lazy Loading verändert die
Auslieferung der Chunks, **nicht** den semantischen Inhalt des initialen Response (RT-49…RT-53).

### 5.5 Antwortklassen — verbindliche Abgrenzung

| Situation                                                   | Klasse                   | HTTP  | Canonical/hreflang | Robots            | Marker | Nicht zulässig                         |
| ----------------------------------------------------------- | ------------------------ | ----- | ------------------ | ----------------- | ------ | -------------------------------------- |
| Pfad existiert nicht                                        | **Not Found**            | 404   | keine              | `noindex, follow` | ja     | Soft-404 mit 200                       |
| Dynamischer Slug ohne Datensatz                             | **Not Found**            | 404   | keine              | `noindex, follow` | ja     | Soft-404 mit 200                       |
| Route bekannt, Datenquelle/Render/Abhängigkeit schlägt fehl | **Runtime Error**        | 5xx   | —                  | —                 | nein   | 404-Maskierung, 200 mit Fehlerseite    |
| Route bekannt, Chunk zur Renderzeit nicht aufgelöst         | **Rendering-Fehlerfall** | 5xx\* | —                  | —                 | nein   | 200 mit Layout-Shell und Fallback-Head |
| Alt-URL oder fehlendes Sprachpräfix                         | **Redirect**             | 301   | am Ziel            | am Ziel           | nein   | 302, clientseitiges `<Navigate>`       |

\* Die konkrete Ausprägung — eigene Fehlerantwort, Retry oder ein Renderpfad, in dem dieser Fall gar
nicht entstehen kann — entscheidet der Owner-AP (**AP25** Rendering-Pfad, **AP10** Statussemantik,
**AP27** Nachweis). Verbindlich ist hier nur: **keine 200-Antwort mit unvollständigem Markup und
Fallback-Head.**

---

## 6. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**.

| ID        | Schuld                                                                                                                                                                                                               | Verletzt                    |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| **RD-1**  | **Preview weicht vom Zielmodell ab** — laut Runbook ein detachter Host-Prozess (`npx tsx server.ts`) hinter Host-nginx, kein Container                                                                               | RT-07, RT-27                |
| **RD-2**  | **Aktiv wirkende Alt-Konfiguration** — `nginx.conf` (statisches SPA-Setup mit `try_files`), `vercel.json` (SPA-Rewrite), `Dockerfile.dev`, `scripts/prerender.mjs`; keine davon beschreibt den tatsächlichen Betrieb | RT-01; Cleanup: AP28 PT28.7 |
| **RD-3**  | **Produktion serviert `dist`, nicht `src`** — richtig, aber unzureichend abgesichert: eine Quelländerung ist bis zum Build unsichtbar, und der Host-`dist` kann vom HEAD-Stand abweichen                             | RT-02, RT-06                |
| **RD-4**  | **Toolchain-Drift, dreifach** — lokal Node **20.19.6**, CI **22**, Frontend-Image **22**, **Backend-Image `FROM node:20`**; kein `engines`, kein `packageManager`                                                    | RT-10, RT-11                |
| **RD-5**  | **Gesundheitsmodell unvollständig** — der Frontend-`Dockerfile` hat einen `HEALTHCHECK`, `server/Dockerfile` **keinen**; `docker-compose.yml` deklariert für keinen Service einen Healthcheck                        | RT-31, RT-32                |
| **RD-6**  | **Keine persistente Speicherung** — `docker-compose.yml` hat **keine `volumes:`-Sektion**; es gibt keinen Worker-Service                                                                                             | RT-08, RT-09                |
| **RD-7**  | **Monitoring fehlt** — keine Metriken, keine Alarme; Fehler existieren nur als stdout-Zeilen                                                                                                                         | RT-34, RT-36                |
| **RD-8**  | **PII in Logs** — E-Mail-Adressen im Klartext an zwei Stellen, rohe Provider-Antwortkörper an vier                                                                                                                   | RT-35                       |
| **RD-9**  | **Stale Laufzeitdokumentation** — `DOCS.md` beschreibt einen nginx-ausgelieferten SPA und ein nicht existierendes `backend/`-CMS                                                                                     | RT-01; AP01 PT01.4.4        |
| **RD-10** | **Kein `/api/monitoring/*`-Ziel** — der Import-Kandidat für Web-Vitals sendet an Endpunkte, die es nirgends gibt                                                                                                     | RT-36                       |

### 6.1 Rendering-Schulden (AP02 PT02.1, gemessen 2026-08-24)

Ist-Zustand aus §3.1. **Kein zulässiges Zielverhalten**; in PT02.1 bewusst **nicht** repariert.

| ID        | Schuld                                                                                                                                                                                                                                                                                                                  | Verletzt                          | Owner                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------ |
| **RD-11** | **Cold-Render-Lücke** — die erste SSR-Anfrage je Lazy-Route und Prozess liefert Layout ohne Seiteninhalt und mit leerem Head; die statischen `index.html`-Defaults (Titel, Description, Root-Canonical) bleiben stehen. Ab der zweiten Anfrage derselben Route ist die Seite vollständig. Betrifft rund 30 Lazy-Routen. | RT-39, RT-40, RT-50, RT-51, RT-63 | **AP25** (Rendering-Pfad) mit AP09; Nachweis **AP27**  |
| **RD-12** | **Render-abhängige Soft-404-Erkennung** — der Not-Found-Marker fehlt beim Cold Render; die Statusentscheidung trägt dort allein über `isKnownPath`. Ein Not-Found-Fall, der ausschließlich am Marker hinge, käme beim ersten Aufruf als HTTP 200 heraus.                                                                | RT-52, RT-56                      | **AP10** (Route Registry als renderunabhängige Quelle) |
| **RD-13** | **Consumer-Sprachzwang** — `server.ts` leitet alle Consumer-Pfade per 301 auf `/en/…`; die Sitemap führt sie nur einsprachig. Bereits geführt als `ROUTING-CONTRACT.md` RD-6 und `SEO-CONTRACT.md` SD-3; hier nur der Rendering-/Zielbildbezug.                                                                         | RT-68, `REST-03`                  | **AP21** mit AP08/AP09                                 |
| **RD-14** | **Widersprüchliche Consumer-Beschreibung im Quellcode** — der Kopfkommentar von `src/App.tsx` führt die Consumer-Seiten als „unlisted", `noindex` und Basic-Auth-geschützt; die Seiten selbst, die Sitemap und `DEC-RL-006` sagen das Gegenteil. Kein Laufzeitfehler, aber ein Irreführungsrisiko für spätere APs.      | RT-67, `DEC-RL-006`               | **AP21** mit AP03                                      |
| **RD-15** | **Zwei Head-Wahrheiten im Fallback-Zweig** — liefert Helmet keinen nichtleeren Titel, behält die Antwort Titel, Description und Root-Canonical aus `index.html`. Als Notbehelf gegen eine titellose Seite nachvollziehbar, aber genau der von RT-64 verbotene Zustand; er entfällt mit der Auflösung von `RD-11`.       | RT-64, `SEO-CONTRACT.md` S-16     | **AP09**, nach `RD-11`                                 |
| **RD-16** | **Keine Rendering-Regressionstests** — SSR-Vollständigkeit, Cold-Render-Verhalten, Hydration und Head-Herkunft sind durch keinen automatisierten Test abgesichert (`QUALITY-GATES.md` §5.1: Integrationstests „keine", SEO-Guards „keine").                                                                             | RT-T14 bis RT-T22                 | **AP27** PT27.2/PT27.5                                 |

---

## 7. Modification Rules

**M-01 — Laufzeitverhalten wird am Artefakt geprüft, nicht an der Quelle.** Wer eine Änderung
verifiziert, baut und prüft — oder prüft den laufenden Dienst.

**M-02 — `server.ts` und `server/server.js` nie als Datei aus `main` übernehmen** (**N1** in
`BRANCH-RECONCILIATION-MAP.md`). Nur Hunks.

**M-03 — Bind-Adressen werden nie aus einem anderen Betriebsmodell übernommen.** Jede Änderung wird gegen
die tatsächliche Topologie verifiziert (RT-23, AP28).

**M-04 — SSR-Invarianten sind gemeinsam zu prüfen.** Wer Rendering, Status oder Header anfasst, prüft
`ROUTING-CONTRACT.md` und `SEO-CONTRACT.md` mit.

**M-05 — Ein neuer Dienst bringt Gesundheitsdefinition, Restart-Verhalten und Signale mit.** Ohne die
drei ist er nicht betriebsreif.

**M-06 — Umgebungsabhängiges Verhalten ist explizit deklariert**, nicht aus dem Vorhandensein einer
Variablen erraten. **Keine Flags erfinden** — Deklaration über AP22/AP28.

**M-07 — Alt-Konfiguration wird entfernt oder eindeutig als Archiv markiert**, sobald sie dem Zielbild
widerspricht (AP28 PT28.7).

**M-08 — Rendering-Änderungen werden gegen einen kalten Prozess geprüft.** Wer SSR, Suspense-Grenzen,
Lazy-Zuschnitt oder Head-Injektion anfasst, misst mindestens eine bis dahin **nicht** angeforderte Route
auf einem **frisch gestarteten** Dienst (RT-40, RT-T15). Eine Messung auf einem warmgelaufenen Prozess
beweist nichts.

**M-09 — Rendering und Statuslogik werden gemeinsam geprüft.** Wer den Renderpfad ändert, prüft die
Abgrenzung 404 vs. 5xx nach RT-54…RT-60 mit — zusammen mit `ROUTING-CONTRACT.md` und `SEO-CONTRACT.md`
(ergänzt M-04).

**M-10 — Eine Fehlergrenze wandert nicht in den SSR-Baum.** Der Verzicht in `src/entry-server.tsx` ist
Vertrag, nicht Versehen (§3.1). Eine Änderung setzt eine ausdrückliche Statusstrategie nach RT-58/RT-59
voraus.

**M-11 — Eine neue Route kommt nicht ohne Head- und Statusvertrag.** SSR-fähiger Head, Locale-Ableitung
aus der URL und definiertes Not-Found-Verhalten gehören zur Route, nicht in eine spätere Nacharbeit
(RT-53, RT-61).

---

## 8. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an `server.ts`, `src/entry-{server,client}.tsx`,
`server/server.js`, `vite.config.ts`, den Dockerfiles oder `docker-compose.yml`:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP02**, bei Betrieb **AP28**)
4. **`building-docs/RUNTIME-CONTRACT.md`** (dieses Dokument)
5. `building-docs/ROUTING-CONTRACT.md`
6. `building-docs/SEO-CONTRACT.md` — wo SSR/Status betroffen sind
7. `building-docs/BACKEND-API-CONTRACT.md` — wo die API-Topologie betroffen ist
8. `building-docs/state/AP-STATE.md`
9. die aktuellen Laufzeitdateien aus §3
10. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Proof

| #          | Prüfung              | Erwartung                                                                             |
| ---------- | -------------------- | ------------------------------------------------------------------------------------- |
| **RT-T1**  | SSR-Antwort          | repräsentative Route liefert servergerendertes Markup und den SEO-Kopf                |
| **RT-T2**  | Statussemantik       | echte 200/301/404 gemäß `ROUTING-CONTRACT.md`; exakte Codes (`QUALITY-GATES.md` §5.3) |
| **RT-T3**  | Cache-Header         | HTML `no-store`; gehashte Assets langzeit-cachebar                                    |
| **RT-T4**  | API-Pfade            | `/api/*` fällt **nicht** in den SSR-Catch-all                                         |
| **RT-T5**  | Statische Assets     | keine Sprachumleitung für Assets, Locales, `/api/*`                                   |
| **RT-T6**  | Hydration            | keine Hydration-Warnung auf repräsentativen Routen                                    |
| **RT-T7**  | Artefaktherkunft     | ausgelieferter Stand ist einem SHA zuordenbar (`DEPLOYMENT-CONTRACT.md` DEP-04)       |
| **RT-T8**  | Client-/SSR-Kohärenz | beide Artefakte stammen aus demselben Build                                           |
| **RT-T9**  | Gesundheit je Dienst | anwendungsnaher Nachweis nach RT-31, nicht „Prozess existiert"                        |
| **RT-T10** | Exposition           | kein Dienst unbeabsichtigt öffentlich; Bindung passt zur Topologie                    |
| **RT-T11** | Umgebungsisolation   | Preview erzeugt keine produktiven CRM-/Mail-/Queue-Wirkungen                          |
| **RT-T12** | Logredaktion         | keine rohen Nutzlasten, keine Provider-Körper, keine Secrets                          |
| **RT-T13** | Toolchain            | Laufzeitversion entspricht der gepinnten Zusage (nach AP01)                           |

### 9.1 Rendering-Nachweise (AP02 PT02.1)

| #          | Prüfung                    | Erwartung                                                                                                                         | Owner          |
| ---------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| **RT-T14** | **SSR-Vollständigkeit**    | repräsentative Route je Seitentyp liefert Hauptinhalt und Überschriftenebene im initialen HTML — keine reine Layout-Shell         | AP27 mit AP25  |
| **RT-T15** | **Cold Render**            | auf einem frisch gestarteten Dienst ist die **erste** Antwort je Route so vollständig wie jede spätere — Inhalt, Titel, Canonical | AP27 mit AP25  |
| **RT-T16** | **Kein Fallback-Head**     | kein ausgelieferter Head stammt aus den statischen `index.html`-Defaults; genau ein `<title>`, genau eine Description             | AP09/AP27      |
| **RT-T17** | **Hydration je Sprache**   | keine Hydration-Warnung auf repräsentativen Routen in allen zehn Sprachen (erweitert RT-T6)                                       | AP27           |
| **RT-T18** | **Locale-Determinismus**   | der Client leitet dieselbe Locale ab wie der SSR; kein Detector- oder Speichereinfluss                                            | AP08/AP27      |
| **RT-T19** | **Lazy vs. Status**        | unbekannter dynamischer Slug liefert echte 404 **auch beim ersten Aufruf** nach Prozessstart                                      | AP10/AP27      |
| **RT-T20** | **Fehlerklassen-Trennung** | erzwungener Renderfehler auf bekannter Route → 5xx, nie 404; unbekannte Route → 404, nie 5xx                                      | AP10/AP27      |
| **RT-T21** | **Consumer-SSR × 10**      | jede Consumer-Route in jeder der zehn Sprachen servergerendert, indexierbar, mit eigenem Head                                     | AP21/AP27      |
| **RT-T22** | **Epigenetik-SSR**         | Hub, drei Vertiefungsseiten und sechs Musterbefunde servergerendert mit eigenem Head; unbekannter Slug → 404                      | AP15/AP16/AP27 |

_(Ausführung und Verankerung: `QUALITY-GATES.md` §9)_

---

## 10. Forbidden Regressions

- ❌ **Aus dem Arbeitsbaum auf den Live-Zustand schließen**
- ❌ **Veraltetes `dist` unbemerkt ausliefern**
- ❌ Quelle deployen, ohne dass ein reproduzierbares Build-Artefakt sie enthält
- ❌ Client- und SSR-Artefakt aus verschiedenen Ständen mischen
- ❌ `dist/**` von Hand bearbeiten
- ❌ **Persistente Daten im verwerfbaren Anwendungscontainer ablegen**
- ❌ Echte 404-, 301- oder `no-store`-Semantik verlieren
- ❌ Consent- oder `localStorage`-abhängiges Markup im SSR-Output erzeugen
- ❌ `/api/*` in den SSR-Catch-all fallen lassen
- ❌ Assets oder Locales-Dateien sprachumleiten
- ❌ **Eine Bind-Adresse aus einem anderen Betriebsmodell als universell richtig übernehmen**
- ❌ Einen Dienst unbeabsichtigt öffentlich exponieren
- ❌ Secrets in Image oder Repository legen
- ❌ Aus Preview/Staging produktive Wirkungen erzeugen
- ❌ Rohe Nutzlasten, Provider-Körper oder Secrets protokollieren
- ❌ **Nach AP01-Pinning Toolchain-Drift wieder einführen**
- ❌ **Marketing-Analytics als Laufzeit-Observability verwenden**
- ❌ „Prozess läuft" als Gesundheitsnachweis akzeptieren
- ❌ `server.ts` oder `server/server.js` als Datei aus `main` übernehmen

**Aus AP02 PT02.1 zusätzlich:**

- ❌ **Eine indexierbare Seite ausliefern, deren Inhalt erst nach der Hydration entsteht**
- ❌ **Eine Layout-Shell oder einen Suspense-Fallback als SSR-Antwort einer indexierbaren Seite akzeptieren**
- ❌ **Ein Rendering-Ergebnis akzeptieren, das vom Aufwärmzustand des Prozesses abhängt**
- ❌ SSR durch eine SPA-only-Architektur, einen statischen SPA-Fallback oder einen Prerender-Ersatz ablösen
- ❌ SSR im Zuge einer Performance- oder Code-Splitting-Maßnahme stillschweigend aushöhlen
- ❌ Browser-only-APIs im initialen Renderpfad einer SSR-Seite verwenden
- ❌ Locale im Client anders auflösen als im SSR (Detector, gespeicherter Wunsch, Header)
- ❌ Hydration-Warnungen als Betriebsmodus hinnehmen
- ❌ Korrektes SSR-Markup durch einen Fallback ersetzen oder flackern lassen
- ❌ **Einen technischen Fehler als 404 ausweisen**
- ❌ **Eine Fehlergrenze als Ersatz für Route-NotFound oder Statuscode verwenden**
- ❌ Eine Fehlergrenze so in den SSR-Baum ziehen, dass ein echter 5xx zu einer 200-Antwort wird
- ❌ Die 404-Entscheidung allein an einem render-abhängigen Signal aufhängen
- ❌ **Einen zweiten Head-/SEO-Pfad einführen** oder Head-Werte am kanonischen Pfad vorbei setzen
- ❌ Statische `index.html`-Head-Defaults neben gerenderten Head-Werten stehen lassen
- ❌ Auf einer NotFound-Antwort Canonical oder hreflang publizieren
- ❌ **Consumer auf eine Sprache zwingen, `noindex` setzen oder mit Basic Auth schützen** (`DEC-RL-006`, `REST-03`)
- ❌ Für Consumer oder Epigenetik eine Sonderarchitektur außerhalb dieser Verträge bauen

---

## 11. AP Ownership / Lifecycle

| Phase                 | AP                 | Ergebnis                                                                                                                                                |
| --------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zielbild/Eigentum** | **AP02 PT02.1**    | SSR-/Rendering-Zielbild, 404-/Error-Verhalten, Head zentral — **festgeschrieben 2026-08-24** (§3.1, RT-38–RT-70, §5.4/§5.5, RD-11–RD-16, RT-T14–RT-T22) |
| Betriebszielbild      | **AP02 PT02.5**    | Docker/Compose, Reverse Proxy, Container, Persistenz, Secrets, Health, Monitoring, Rollback, `DRY_RUN`                                                  |
| Toolchain             | **AP01 PT01.5.3**  | **Node-/Paketmanager-Pinning**                                                                                                                          |
| Semantik              | **AP09**, **AP10** | Status-, Redirect-, SEO-Verhalten, das die Laufzeit erhalten muss                                                                                       |
| API/Worker            | **AP22**           | Backend-Rolle, Worker-Bedarf                                                                                                                            |
| Performance           | **AP25 PT25.2**    | SSR-TTFB, Hydrationskosten, Chunk-Verhalten                                                                                                             |
| Security              | **AP26 PT26.1**    | Header, HSTS am produktiven Origin, Exposition                                                                                                          |
| **Umsetzung**         | **AP28**           | Environment-Modell, Compose-Stack, Healthchecks, Persistenz, Monitoring, Legacy-Cleanup (PT28.7)                                                        |
| Nachweise             | **AP27**           | Laufzeitnachweise in CI/Deploy-Gate                                                                                                                     |
| Betrieb               | **AP32 PT32.1**    | 5xx, TTFB, Container-Health, CSP-Reports                                                                                                                |
| Doku                  | **AP33 PT33.1.1**  | Architektur/Runtime dokumentiert                                                                                                                        |

### 11.1 Owner-Grenzen des SSR-/Rendering-Vertrags (AP02 PT02.1)

PT02.1 legt **Architektur** fest und implementiert sie **nicht**. Die Umsetzung der hier festgeschriebenen
Invarianten liegt bei:

| Owner-AP      | Verantwortet                                                                                        | Bezug                      |
| ------------- | --------------------------------------------------------------------------------------------------- | -------------------------- |
| **AP09**      | SEO-Plattform: SEOHead-Konsolidierung, Sitemap, Structured Data, Robots                             | RT-61…RT-66, RD-15         |
| **AP10**      | Routing, HTTP-Status, Redirects und die Route Registry als renderunabhängige Routenwahrheit         | RT-52, RT-55, RT-56, RD-12 |
| **AP21**      | Consumer-Landingpages × 10, Indexierbarkeit, Auflösung des Sprachzwangs                             | RT-67, RT-68, RD-13, RD-14 |
| **AP25**      | Rendering-Pfad, TTFB, Hydrationskosten, Chunk-Verhalten — inklusive Auflösung der Cold-Render-Lücke | RT-42, RT-49…RT-53, RD-11  |
| **AP27**      | Tests und CI-Gates für alle Nachweise aus §9.1                                                      | RT-T14…RT-T22, RD-16       |
| **AP08**      | Sprachauflösung und 10-Sprachen-Parität, soweit sie die Hydration betrifft                          | RT-45, RT-68               |
| **AP15/AP16** | Epigenetik-IA und Musterbefunde innerhalb der kanonischen Rendering-Verträge                        | RT-69, RT-T22              |
| **AP28**      | Betrieb, Artefakt- und Umgebungsseite des Rendering-Pfads                                           | RT-01…RT-09, §5.2          |

**Änderungen an diesem Vertrag** verantwortet AP02 gemeinsam mit AP28. Decision Locks werden hier nie
geändert.
