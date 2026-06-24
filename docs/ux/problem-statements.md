# Problem Statements (v2, kundenfokussiert) — Phase 0

> Je Router-Segment ein kundenfokussiertes Problem-Statement nach v2-Template:
> **Wer** (Nutzer/Kontext) braucht **was** (Aufgabe/Outcome), **weil** (Motivation);
> heute scheitert das an **Hürde** — messbar an **Signal**.
> Stand **2026-06-24**. Hypothesen sind als `ASSUMPTION — needs human confirmation` markiert,
> wo sie eine Produktannahme vorwegnehmen (§1.17). Validierung → `docs/ux/insights.md`,
> `docs/ux/user-testing.md` (Phase 6).

## Segment `/` (Home)

**Wer:** Zahnärzt:innen/Praxisbetreiber, die Polaris zum ersten Mal besuchen.
**Was:** in <30 s verstehen, was Polaris diagnostisch leistet und ob es zur Praxis passt.
**Weil:** sie zwischen vielen Anbietern vergleichen und wenig Zeit haben.
**Hürde:** mehrere konkurrierende Sektionen ohne **ein** dominantes Element/CTA (Phase 3).
**Signal:** Scroll-Tiefe bis Primär-CTA, CTA-Click-Rate. `ASSUMPTION`.

## Segment `/about`

**Wer:** Interessent, der Vertrauen/Seriosität prüft.
**Was:** Team, Mission, Glaubwürdigkeit schnell erfassen.
**Weil:** Medizinprodukt-Kauf ist vertrauensgetrieben.
**Hürde:** Team-Darstellung dupliziert (DoctorsSection/TeamSection), uneinheitlich.
**Signal:** Verweildauer, Weiterklick zu Kontakt.

## Segment `/diagnostics` + `/diagnostics/:slug`

**Wer:** fachlich Suchende mit konkretem diagnostischem Bedarf.
**Was:** passenden Service finden und Detailnutzen/Anwendung verstehen.
**Weil:** Kaufentscheidung hängt an Indikation/Workflow-Fit.
**Hürde:** Service-Karten nicht von Blog-Karten differenziert; kein klarer Aufgaben-CTA.
**Signal:** Übergang Overview→Detail, Detail→Kontakt.

## Segment `/articles` + `/articles/:slug`

**Wer:** Recherchierende Fachpersonen (SEO-Einstieg).
**Was:** fundierte Inhalte lesen, verwandte Services entdecken.
**Weil:** Content baut Autorität und Lead-Vertrauen auf.
**Hürde:** Lesebreite nicht begrenzt (Phase 4 Reading-Width), Loading-State auf Index fehlt.
**Signal:** Lesetiefe, Klick auf related Service.

## Segment `/contact` + `/support`

**Wer:** kaufnahe oder bestehende Kund:innen mit Anliegen.
**Was:** schnell und fehlerfrei eine Anfrage absenden.
**Weil:** Reibung hier kostet direkt Leads/Zufriedenheit.
**Hürde:** Zwei nahezu identische Formulare (Duplikat), Fehlerzustände/Inline-Validierung unvollständig (Phase 6).
**Signal:** Formular-Abschlussrate, Fehler-Abbruchrate.

## Segment `/events`, `/downloads`

**Wer:** bestehende Interessenten, die Ressourcen/Termine suchen.
**Was:** relevante Datei/Veranstaltung schnell finden.
**Weil:** Self-Service spart Support-Aufwand.
**Hürde:** kein Empty-State bei leerer Liste; keine Filterung.
**Signal:** Download-/Anmelde-Klicks.

## Produkt-/Themenseiten `/igloo-pro`, `/vitamin-d3-implantologie`, `/s3_leitlinie`, `/vitamin-d3-spray`

**Wer:** Fachpublikum mit spezifischem Produkt-/Themeninteresse.
**Was:** Evidenz + Nutzen + nächster Schritt.
**Weil:** hochspezifische, evidenzbasierte Entscheidung.
**Hürde:** Roh-px/Hex in mehreren dieser Seiten (Phase 3), kein einheitliches Section-Grid (Phase 4).
**Signal:** Verweildauer, CTA zu Kontakt/Bestellung.

## Legal `/privacy`, `/imprint`, `/terms`

**Wer:** Nutzer mit Compliance-/Rechtsbedarf.
**Was:** Pflichtinformation rechtssicher finden.
**Weil:** gesetzliche Pflicht (DSGVO/Impressumspflicht).
**Hürde:** lange Fließtexte ohne Reading-Width.
**Signal:** Auffindbarkeit (Footer-Link-Klicks).

## Routing-States `*` (404) / error / loading

**Wer:** Nutzer mit defektem Link, Fehler oder langsamer Verbindung.
**Was:** verstehen, was passiert, und einen Ausweg haben.
**Weil:** Sackgassen erzeugen Absprung.
**Hürde:** **kein** `errorElement`/`useRouteError`, `Suspense fallback={null}` ohne Skeleton (Phase 5).
**Signal:** 404-Bounce-Rate, Fehlerrate je Route.

## Consumer `/consumer/*` (Tabu §5 — nur dokumentiert)

**Wer:** Endverbraucher aus Paid-Traffic.
**Was:** Produkt verstehen und bestellen.
**Weil:** direkte Conversion.
**Hürde:** —(Checkout-Flow unangetastet, §5).
**Signal:** `consumer_order_submit` (siehe Analytics-Audit).
