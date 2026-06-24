# Projekt-Entscheidungen (vor dem ersten Archon-Lauf ausfüllen)

Das Playbook stoppt an mehreren Stellen mit „**Nachfrage-Schwelle**" (Marke, Schrift, Tonalität,
Markt, Feature-Streichung). Ein autonomer Swarm kann dich nicht mitten im Lauf fragen — er würde
raten und thrashen. **Lege diese Punkte hier einmal verbindlich fest;** der Swarm liest sie als
gegebene Fakten. Felder mit `TODO` blockieren die betroffene Aufgabe, bis sie gefüllt sind.

> **Status (2026-06-24):** Alle `TODO` sind mit **begründeten Defaults** gefüllt. Defaults, die
> aus dem realen Code/IST-Zustand ableitbar sind, gelten als **bestätigt**. Defaults, die eine
> echte Produktentscheidung vorwegnehmen, sind als **`ASSUMPTION — needs human confirmation`**
> markiert (§1.17): Der Swarm arbeitet damit weiter, trägt denselben Marker aber in den
> Code-Kommentar **und** den PR-Text, damit ein Mensch sie bestätigen/korrigieren kann.

## 1. Marke & Farbe `[FIL][BUD]`

- **Primärfarbe (Aktion/Brand):** `#083358` (`--brand-navy`, CTA-Hintergrund) — abgeleitet aus
  `tokens.css` (Wave-2: „cta = Navy"). **bestätigt aus Code.**
- **Sekundär-/Akzentfarbe(n):** Sekundär `#0d527f` (`--brand-blue`); Consumer-Akzent `teal-600`
  (`#0d9488`, `--teal-600`). **bestätigt aus Code** (tailwind.config `brand.*` + `accent.*`).
- **Neutral-Palette (Grau-Range):** Slate-basiert (`slate-50…900`, „cold greys"), bereits in
  `tokens.css` als `--neutral-*`. **bestätigt aus Code.**
- **Status-Farben:** Defaults beibehalten — success `#10b981`/Text `#065f46`, danger `#dc2626`/Text
  `#991b1b`, warning `#f59e0b`. Bereits tokenisiert. **bestätigt aus Code.**
- **Light/Dark/Brand-Themes:** Main-Site = **Dark als Default** (`surface/ink/line/brand.sky`),
  Consumer/`*` bleibt **Light/Teal**. Beide über `[data-theme]`, identische Token-Namen, kein FOUC
  (Anti-Flash-Script). `ASSUMPTION — needs human confirmation` (gestützt auf Projekt-Fakt
  „main-site-dark-theme-split"; expliziter UI-Theme-Toggle ist Nachfrage-Schwelle §1.17).

## 2. Typografie `[FIL]`

- **Schriftfamilie(n)** (max. 2): **Inter Variable** (genau **ein** Typeface). **bestätigt aus Code**
  (`@fontsource-variable/inter` installiert; `--font-family-sans` referenziert den Stack).
- **Bezug:** self-hosted via `@fontsource-variable/inter` (Side-Effect-Import in
  `src/entry-client.tsx`, vor `index.css`), **kein** Google-Fonts-CDN (DSGVO). **bestätigt aus Code.**
- **Type-Scale-Ratio:** **Keine Ratio-Formel** — handgebaute Skala (§3.1 überschreibt das
  Ratio-Feld bewusst), ~9 Stufen um Basis 16, bereits in `tokens.css` (`--font-size-100…900`).
  **bestätigt aus Code/Spec.**
- **Body-Mindestgröße:** ≥16px (fix; `--font-size-300 = 1rem`). **bestätigt aus Code.**

## 3. Layout & Breakpoints `[FIL]`

- **Grid:** 12 Spalten (Default). **bestätigt.**
- **Breakpoints:** sm/md/lg/xl = 640/768/1024/1280 (Default; `tokens.css --breakpoint-*`). **bestätigt.**
- **Reading-/Form-Container-Breite:** **68ch** (`--reading-width`, im 50–75ch-Korridor). **bestätigt aus Code.**

## 4. Sprache, Markt & Inhalt `[NOR][BEC]`

- **Ziel-Locales / Märkte:** `de` (primär, de-DE), `en`, `pl`, `fr`, `it`, `es`, `pt`, `da`, `nl`,
  `cs`. **bestätigt aus Code** (`server.ts SUPPORTED_LANGUAGES` + `public/locales/*`). URL-Prefix
  `/<lang>/…`.
- **Tonalität / Voice:** Main-Site (B2B Dental/Medizin) = **sachlich-vertrauensvoll, fachlich**;
  Consumer-LPs = **direkter, nutzennah/wärmer**. Voice konstant, Tone szenarioabhängig (ernster bei
  Fehler/Recht/Geld). `ASSUMPTION — needs human confirmation`.
- **Quelle echter Inhalte/Texte:** `src/content/` + `public/locales/<lang>/<namespace>.json`
  (i18next); redaktionelle SEO-Artikel in `docs/content/`. **bestätigt aus Code.**
- **Rechtliches/Pflichtseiten:** Impressum (`ImprintPage`), Datenschutz (`PrivacyPage`),
  AGB/Terms (`TermsPage`) vorhanden. **bestätigt aus Code.**

## 5. Scope & Feature-Entscheidungen `[BEC]` (Product Graveyard)

- **Features/Seiten, die DEFINITIV bleiben:** alle aktuellen Routen — Home, ServicesOverview/Service,
  Articles-Index/Article, VitaminD3-Implantology/-Spray, S3-Leitlinie, IglooPro, Events, Downloads,
  Contact, Support, Consumer-LPs (Spray/Duo/Mask), Legal (Imprint/Privacy/Terms). `ASSUMPTION — needs human confirmation`.
- **Kandidaten zum Streichen/Zusammenlegen:** Swarm darf vorschlagen (leere Used-by-Lineage §Phase 2.11,
  0-Klick-Analytics) → `docs/GRAVEYARD.md` + Nachfrage-Schwelle (§1.17). **Niemals ohne Freigabe entfernen.**
- **Nicht anfassen / Tabu-Bereiche:** Consumer Order-/Checkout-Flow (`pages/consumer/OrderForm`,
  `OrderModal`, `tracking.ts`), Chat-Integration (`ChatWidget`/`CHAT_INTEGRATION`), i18n-Routing-Infra
  (`server.ts` Language-/Redirect-Handling), **gesamte Infra/Deployment** (`Dockerfile*`,
  `docker-compose.yml`, `nginx.conf`, `vercel.json`, `deploy.sh`, `server/`, CSP/Security-Header).
  `ASSUMPTION — needs human confirmation` (deckt zugleich „keine Infra/kein Deployment ändern" ab).

## 6. Technische Leitplanken `[§]`

- **Styling-Ansatz:** Tailwind (+ cva/clsx/tailwind-merge). **bestätigt aus Code.**
- **Token-Setup:** **CSS-first (§3.0 A)** — `tokens.css` = Single Source, `tokens.ts` spiegelt nur
  Logik-Werte, `tailwind.config.js` referenziert nur `var(--token)`. **bestätigt aus Code.**
- **Performance-Budget je Route (First-Load-JS):** ≤ **Phase-0-Baseline**; Zielkorridor **<100 KB gz/Route**;
  Regression = CI-rot, Überschreitung nur mit dokumentierter Begründung. `ASSUMPTION — needs human confirmation`.
- **Audit-URL (lokal/staging):** lokal gebaute SSR-Instanz **`http://localhost:3000`**
  (`npm run build` → `npm run start`, `PORT=3000`). **bestätigt aus Code** (`server.ts`).
- **Darf der Swarm auf `main` pushen oder nur Feature-Branch + PR?** **Nur Feature-Branch + PR**
  (aktuell `archon/thread-*`), niemals direkt auf `main`. **bestätigt/Empfehlung.**

> Solange ein für eine Aufgabe relevantes Feld `TODO` ist, **diese Aufgabe nicht raten** —
> als offene Frage queuen und an der Stelle pausieren (siehe `ARCHON-README.md` › Betriebs-Hinweise).
> Es sind aktuell **keine** `TODO`-Felder mehr offen; die mit `ASSUMPTION` markierten Defaults sind
> vom Menschen zu bestätigen, blockieren den Lauf aber nicht.
