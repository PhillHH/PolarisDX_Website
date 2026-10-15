# Startseiten-Varianten A–D — UX-Bewertung und Rahmen (2026-10-15)

Status: Entwurf, nur PNG/HTML. Keine Umsetzung, kein Code geändert. Owner wählt eine Variante.

## Rahmen, der für alle vier Varianten gilt

- Sektionsreihenfolge unverändert nach `HOMEPAGE-CONTRACT.md` und `src/pages/HomePage.tsx`:
  Hero → TrustBar → drei Geschäftssäulen + drei Fachbereich-Einstiege → Why POC → POC-Prozess →
  Praxisreferenz → ROI → Blog → FAQ → Final CTA.
- Hero: genau zwei CTAs („Angebot anfragen" primär, „Diagnostik entdecken" sekundär), DOM-/Mobile-
  Reihenfolge Caption → H1 → Nutzen → CTAs → Visual, kein Karussell. Produktbild bleibt das einzige
  LCP-Bild.
- TrustBar: genau die vier belegten Signale HCL-002..005, Strings byte-gleich zu `home.json`.
- Genau drei `GENERAL_SALES`-Einstiege (Hero, ROI, Final CTA). Praxisreferenz nur Dr. Wessing mit dem
  claim-reduzierten Auszug (HCL-006), keine Sterne/Bewertungs-UI.
- Navigation wie im Header-Code: Diagnostik ▾, Epigenetik, IglooPro, Blog, Termine, Über uns, Support,
  Suche, Sprachumschalter, CTA. Alle Texte sind die produktiven DE-Texte.
- Kopfzeile und Footer Navy (#083358), Akzente aus dem Logo-Blauspektrum (Royal #1b67b1, Cyan
  #02a6e3), Inter als Schrift.

## Was an Entwurf 2 (Vortag) UX-seitig nicht Best Practice war

1. Struktur gebrochen: „Fachbereiche" als eigene Sektion eingefügt, Why POC und FAQ/Blog entfernt,
   Produktband neu. Damit wären Claim-Register, Tests und Deep-Link-Matrix hinfällig gewesen.
2. Redundanz above the fold: IVDR/CE und CV < 2 % standen dreimal (Pill, Micro-Zeile, TrustBar).
3. Zu viele schwebende Elemente im Hero (Foto, Produktkarte, zwei Chips, Caption) — kein klarer
   Blickpfad, Überlappungen auf Mobile.
4. Stock-Porträt mit Namensschild und Tattoo als Hero-Motiv: wirkt austauschbar und ist nicht die
   Zielgruppe (Praxisinhaber:innen).
5. Vier statt zwei Hero-CTAs über die Seite verteilt, Sekundär-CTA „IglooPro kennenlernen" statt dem
   vertraglich fixierten „Diagnostik entdecken".
6. Weiße Kopfzeile: schwache Markenerkennung; die bestehende Seite und die Shop-Seite werden über Navy
   erkannt.
7. Sternebewertung „4,9 / 5" ohne Quelle — nicht claim-sicher.

## Was die vier Varianten unterscheidet

| | A Navy-Bühne | B Papier + Navy-Stage | C Editorial-Foto | D Klinisches Panel |
|---|---|---|---|---|
| Hero-Fläche | Navy-Verlauf, Produkt mit Glow | Papier, Produkt in Navy-Karte | Vollflächiges Praxisfoto mit Navy-Overlay | Weiß mit Punktraster, Produkt + Messwert-Karte |
| Stimmung | Kontinuität, Premium-Gerät | Warm, ruhig, Shop-nah | Emotional, Menschen im Bild | Technisch, datengetrieben |
| Fotos | nur Produkt + Referenz | Säulen- und Blog-Karten | Säulen, Fachbereiche, Referenz, Blog | nur Produkt + Referenz |
| LCP-Risiko | gering | gering | mittel (Hero-Foto groß) | gering |
| Image-Budget | am einfachsten | wie SC-001 | am engsten | einfach |

## Offene Vertragspunkte für die Umsetzung (egal welche Variante)

- `DESIGN-SYSTEM-CONTRACT.md` §3.1 sagt seit SC-001 „Die Kopfzeile ist hell"; §3.2 kennt genau einen
  Akzent (Teal). Navy-Header und Blau-Akzent brauchen eine neue Scope-Änderung (SC-002) plus
  DS-Changelog-Eintrag und neue Visual-Baselines.
- Nächste offene Arbeitspakete laut `scope/MASTER-SCOPE.md`: AP28 Docker/Deploy, AP29 SEO-Migration,
  AP30 Pre-Launch-QA (enthält Visual QA der Startseite), AP31 Go-live. Kein AP enthält Designarbeit;
  eine Design-Iteration läuft wie SC-001 als Scope-Änderung neben der AP-Reihe.
- `building-docs/state/AP-STATE.md` ist veraltet (steht auf „PT27.6 NOT STARTED", obwohl AP27 per
  Commit geschlossen ist) und sollte nachgezogen werden.
