# PolarisDX Preview — Globale Defekte (seitenübergreifend, mit Fundstellen)

> Defekte, die viele Seiten betreffen — mit `Datei:Zeile`-Belegen (Branch `feat/home-leadmagnet`,
> Pfade relativ zum Repo-Root `/home/phillip/01polaris-preview`). Reihenfolge = Prioritäts-Vorschlag.
> **Wichtig:** Bei G1 weicht die Repo-Realität von der Spec ab (Guardrail „Repo gewinnt") — siehe unten.

---

## G1 — Cookie-Banner: ~~Position~~ **GESTRICHEN** (empirisch verifiziert). Nur Styling un-migriert.
**Status:** ✅ **G1 gestrichen** — kein Positions-/z-index-Fix. Nur optionaler Restyle (out of Slice-1-Scope).

**Empirische Verifikation (2026-07-08, Live-Preview, echtes Scrollen — kein Full-Page-Shot):** Auf
`/de/diagnostics/dental` bleibt der Banner bei scrollY 0 / 7838 / 14775 konstant bei `position:fixed`,
`z-index:70`, `rectBottom == 900` (= Viewport-Höhe). Er **klebt am Viewport-Boden und liegt NICHT im
Content**. → Die Spec-Behauptung „liegt mitten im Content" war ein Full-Page-Screenshot-Artefakt.
**Kein Fix in Slice 1.** (Rest: generisches `blue-600`/`gray-900`-Styling — spätere, separate Kosmetik.)

Der Banner ist **korrekt als fixed Overlay** implementiert, NICHT inline im Content-Flow:
- `src/components/ui/CookieBanner.tsx:208` → `className="fixed bottom-0 left-0 right-0 z-[70] p-4 bg-white border-t border-gray-200 shadow-lg …"`
- Einbindung site-weit außerhalb `<Routes>`: `src/App.tsx:314` (`<CookieBanner />`), Import `App.tsx:32`.
- **z-index-Stack:** CookieBanner `z-[70]` > MobileCallButton `z-50` (`ui/MobileCallButton.tsx:12`) >
  Header `z-30` (`layout/Header.tsx:63`). Banner liegt also **über** allem.

→ **Die Aussage „Cookie-Banner liegt mitten im Content (z-index/position)" ist im aktuellen Code
FALSCH.** Zwei mögliche Erklärungen für den Eindruck aus den Screenshots:
1. **Full-Page-Screenshot-Artefakt:** `position: fixed` wird beim Full-Page-Shot je nach Engine an der
   Scroll-0-Position „eingefroren" und erscheint dadurch mitten in der langen Seite — reines
   Screenshot-Artefakt, kein Live-Defekt.
2. **Reales Rest-Problem (unabhängig von Position):** Der Banner ist **stilistisch NICHT migriert** —
   er nutzt generische Tailwind-Farben statt Brand-Tokens:
   `bg-blue-600`/`hover:bg-blue-700` (Accept, `:247`), `bg-blue-50 text-blue-600` (Icon, `:213`),
   `bg-gray-900` (Save, `:291`), `ring-blue-500`. Sollte auf Navy `brand-deep` + Teal `accent` umgestellt
   werden. Reject/Settings sind schwache graue Outline-Buttons (`:232`,`:238`).

**Empfehlung:** Vor dem „Fix" **empirisch verifizieren** (Live-Seite scrollen, nicht Full-Page-Shot). Falls
tatsächlich ein Stacking-Kontext auf einer bestimmten Seite den Banner einschließt, dort gezielt beheben;
ansonsten reiner Restyle auf Brand-Farben. **Kein pauschaler z-index-Fix nötig.**

---

## G2 — Schwache Outline-CTAs + uneinheitliche CTA-Benennung
**Priorität:** hoch (Konversion, seitenweit).

**Outline-Variante ist white-on-transparent** (nur auf dunklem Grund sichtbar, sonst quasi unsichtbar):
- `src/components/ui/Button.tsx:15-16` → `outline: 'border border-white/80 bg-transparent text-white hover:bg-white/10 …'`

Fundstellen `variant="outline"` (Sekundär-CTAs):
- `src/components/sections/HeroSection.tsx:112` (Sekundär „ROI-Rechner")
- `src/components/sections/FinalCtaSection.tsx:37` (Sekundär „ROI-Rechner")
- **Header-CTA** `src/components/layout/Header.tsx:141,250` → `variant={isScrolled ? 'primary' : 'outline'}`
  (oben transparente Outline, gescrollt Gradient — **nie gefülltes Teal**).

**Uneinheitliche Benennung derselben Aktion (Beratung/Termin):**
- „Beratung buchen": `HeroSection.tsx:108` (`hero.cta`), `StepsSection.tsx:97` (`steps.cta`),
  `RoiCalculatorSection.tsx:272` (`roi.cta_consult`), `FinalCtaSection.tsx:35` (`final_cta.cta_primary`).
- „Termin wählen": `IglooWidgetSection.tsx:122` (`igloo_widget.help_cta`),
  `DiagnosticsFocusSection.tsx:100` (`home:igloo_widget.help_cta`).
- Locale-Defaults zusätzlich als „Termin buchen"-Äquivalent (z. B. `scripts/i18n/update_home.py`:
  it „Prenota appuntamento", pl „Umów wizytę", nl „Afspraak boeken", pt „Agendar consulta").

→ **Fix:** einheitliches Label (Vorschlag „Beratung buchen") in allen 10 Locales; Sekundär-CTAs von
white-Outline auf sichtbare Variante; Primär-CTAs durchgehend gefüllt Teal (`!bg-accent`, → D2).
Kein `btn--outline`-CSS im Repo — alles läuft über die CVA-`outline`-Variante.

---

## G3 — Duplizierte rechte Sidebar (Copy-Paste statt Komponente)
**Priorität:** hoch (eine Baustelle, viele Seiten — Kandidat für Slice 1).

**Keine gemeinsame Komponente** — identisches Markup mehrfach kopiert. Insbesondere die
„Need help right now?"-Kontaktbox ist wörtlich dupliziert:
- `src/pages/ServicePage.tsx:289-362` — `<aside className="space-y-8 lg:sticky lg:top-32">`:
  „Key Areas" (`:295`) · „Unsere Artikel" (`:327`) · „Need help right now?" (`:349-359`).
- `src/pages/ArticlePage.tsx:383-456` — **identische** `<aside>`-Klasse:
  „More articles" (`:389`) · „Passende Diagnostik" (`:417`) · **identische** „Need help"-Box (`:443-453`).
- Gleicher i18n-Key `shop:shop.needHelp` / `shop:shop.contactText`, aber **inkonsistenter Button-Default**:
  `ServicePage.tsx:358` `'Contact Us'` vs `ArticlePage.tsx:452` `'Kontakt aufnehmen'` (gleicher Key
  `common:nav.contact`).
- Weitere eigenständige Sidebars (andere Inhalte, gleiches Muster): `S3LeitliniePage.tsx:867`,
  `VitaminD3ImplantologyPage.tsx:649`, `VitaminD3SprayPage.tsx:549`, `SupportPage.tsx:105`, `TermsPage.tsx:70`.
- Überschrift „Schlüsselbereiche der Präventivdiagnostik" (`home:services.title`) doppelt gerendert:
  `DiagnosticsFocusSection.tsx:40` und `ServicesSection.tsx:14`.

→ **Fix:** EIN Sidebar-Modul (`RelatedServicesWidget` + `RelatedArticlesWidget` + `ContactCard`) mit
konsistenten Defaults; überall wiederverwenden (siehe migration-map T2).

---

## G4 — i18n-Lecks
**Priorität:** hoch (Qualität/Vertrauen; Guardrail „0 fehlende Strings in 10 Locales").

**a) Deutscher Text in `public/locales/en/*.json`:**
- **Ganzer Artikel unübersetzt (Deutsch) im EN-File:** `public/locales/en/articles.json:442-479`, z. B.
  `:442` „Die Entscheidung für neue Point-of-Care (POC)-Diagnostikgeräte …",
  `:447` „1. Das Effizienzdilemma: Warum herkömmliche Integration scheitert",
  `:477` „Fazit: Investition in Zeit und Sicherheit" (durchgehend DE 442–479).
- Deutsche Rollen in EN: `public/locales/en/home.json:177` `"role": "Facharzt für Innere Medizin"`,
  `:184` `"role": "Ärztlicher Leiter"`.
- (Legitim, **keine** Lecks: Adressen `en/legal.json:24,110` „Große Bleichen", Fachbegriffe
  RiliBÄK/GOÄ/Eigennamen in `en/services.json` & `en/articles.json`.)

**b) „(Echte Rezension)" hartkodiert (erscheint in ALLEN Sprachen):**
- `src/data/testimonials.ts:10,19,28` → je `role: 'Zahnarzt (Echte Rezension)'`. **Nicht** via i18n →
  sprachunabhängig sichtbar. Kein Vorkommen in `public/locales/`.

**c) Englische Testimonial-Titel auf /de (hartkodiert):**
- `src/data/testimonials.ts` — `text`-Felder alle leer (`:14,23,32,42,51`), es werden also keine Zitate
  gerendert; aber `title`-Felder englisch: `:12` „Biological Dentist and Implant Surgeon / Chelsea Dental
  Clinic", `:30` „Biological Dentist / Principal Dentist & Owner". Ganze Datei ist hartkodiert (kein i18n).

**d) Locales-Vollständigkeit:** `de, en, pl, fr, it, es, pt, da, nl, cs` — **alle 10 vorhanden, keine fehlt.**

→ **Fix:** `en/articles.json:442-479` + `en/home.json`-Rollen echt übersetzen; Testimonial-Rollen/Titel
i18n-fähig machen und „(Echte Rezension)" entfernen/lokalisieren.

---

## G5 — Widerspruch CV < 2 % vs. CV < 5 % (IglooPro-Spezifikation)
**Priorität:** OFFENE FACHFRAGE — **nicht eigenmächtig vereinheitlichen** (DX365/Datenblatt bestätigen).

Widerspruch **innerhalb** `public/locales/de/products.json`:
- `:60` `"accuracy_value": "CV < 5%"` (Feld „Genauigkeit", Technische Daten)
- `:122` „… Immunfluoreszenz, CV < 5 %, 600 g portabel." (Meta-Description)
- **aber** `:16` `"cv_val": "CV < 2 %"`, `:73` `"cv_value": "CV < 2 %"` (Highlights, „Inter-Reader-Präzision")

Gleicher Widerspruch in weiteren Sprachen:
- `public/locales/fr/products.json:60` „CV < 2% (Inter-Reader), CV < 3% (Intra-Reader)" vs `:122` „… CV < 5 %".
- `public/locales/pl/products.json:60` „CV < 2%" vs `:122` „… CV < 5 %".

Überall sonst durchgängig **CV < 2 %**, u. a.:
- `public/locales/de/home.json:18,42,85,257`; `de/services.json:187,281,404,490` („Variationskoeffizient
  (CV) von unter 2%"); `src/hooks/useHeroSlider.ts:54,58`; `src/components/seo/structuredData.ts:145`
  („Präzision von CV < 2%"); en/fr/pl/pt services & home.

→ **Kernwiderspruch:** Produkt-Datenblatt-Felder (Genauigkeit/Meta) sagen **CV < 5 %**, während Chips,
Homepage-Stats und alle Marketing-Texte **CV < 2 %** angeben. **Fachlich klären**, welcher Wert der
dokumentierte ist (evtl. Inter-Reader < 2 % vs. Intra-/Gesamt < 5 %), dann konsistent setzen.
`structuredData.ts` nur nach expliziter Freigabe anfassen (Guardrail).

---

## G6 — Platzhalter / kaputte Bilder
**Priorität:** mittel (nach den Template-Slices).

- **Tim Ritson (About/Team) — externer Fake-Platzhalter:** `src/components/sections/TeamSection.tsx:14`
  → `id: 'tim_ritson', image: 'https://placehold.co/400x400'` (externer 400×400-Graukasten; die 3 anderen
  Team-Mitglieder nutzen echte lokale `.webp`, `:20,26,32`). Gerendert als 300×400 `<img>` (`:53-61`).
  ⚠️ Zusätzlich externe Bildquelle (CSP/Datenschutz) — besser lokaler `ImagePlaceholder` mit Label.
- **Consumer-Seiten — „Bildplatzhalter"-Boxen:** `src/pages/consumer/shell.tsx:336,550`
  („Bildplatzhalter — …") → betrifft `consumer/{SprayPage,MaskPage,DuoPage}.tsx` (T8-Track).
- **Weitere intentionale Platzhalter (kein Bruch, aber Kunden-Assets ausstehend):**
  `WhyPocSection.tsx:10,101` („Play-Platzhalter, kein echtes Video"),
  `TestimonialsSection.tsx:28,97` (Personen-Icon, `t('testimonials.photo_placeholder','Kundenbild')`),
  `AboutSection.tsx:60` (Geräte-„Puck").
- **`ImagePlaceholder.tsx`** ist die saubere, sprach-neutrale Lösung (`border-dashed`, `role="img"`,
  Label) — für „Anwendungsbild"/„Kundenbild" verwenden.
- **Offene TODOs:** `consumer/DuoPage.tsx:59` (Meta-Titel mit Claire bestätigen),
  `RoiCalculatorSection.tsx:108` (`// TODO Backend POST /api/roi-report` — Endpoint noch nicht live).
- **NICHT gefunden:** wörtliches „400×400" außer TeamSection; kein „coming soon"; kein „Silhouette" im Code.

→ **Fix:** Tim-Ritson auf lokalen `ImagePlaceholder`/echtes Foto; Consumer-Bildplatzhalter im T8-Track;
intentionale Platzhalter beibehalten, aber sauber beschriftet (Designkey erlaubt das).

---

## Priorisierte Reihenfolge (Vorschlag, deckt sich mit Phase-2-Plan)
1. **G3 Sidebar-Modul** + **G2 CTA-Vereinheitlichung/Teal** + **G1 Cookie-Restyle** — eine Baustelle,
   ~alle Seiten (globale Quick-Wins).
2. **G4 i18n-Lecks** — parallel, da unabhängig von Layout.
3. **G5 CV** — blockiert auf Fachentscheidung (nicht raten).
4. **G6 Platzhalter** — im Zuge der jeweiligen Template-Slices (About→T4, Consumer→T8).
