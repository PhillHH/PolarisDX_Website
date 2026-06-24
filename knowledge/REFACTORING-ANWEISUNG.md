# Website-Refactoring — Definitive Master-Anweisung nach fuenf Designbuechern (v2)

> **Zweck.** Dies ist die vollstaendige, maschinell abarbeitbare Anweisung fuer einen **KI-Agenten (Claude Code)**, der eine bestehende **React/Next.js**-Website (**App Router**) nach den Paradigmen aus fuenf Standardwerken refactored. Das Dokument hat **einen roten Faden**: _Zweck (WARUM) → Lernen/Prozess (WIE) → Wahrnehmung (CRAFT) → Architektur (STRUKTUR) → System (SYSTEMATIK)_ — in dieser Reihenfolge baut sich auch der Phasenplan auf. Jede Phase folgt strikt dem Schema **Anweisungen (imperativ, nummeriert) → Definition of Done (Checkboxen) → Verifikation (echte Shell-Befehle)**. Der Agent arbeitet die Phasen **in Reihenfolge** ab und schliesst eine Phase erst ab, wenn **alle** DoD-Punkte durch ausgefuehrte Checks belegt sind.
>
> **Diese Version (v2)** vereint zwei Staerken: das **kohaerente Geruest** (durchgaengiges Glossar, stabile `§`-Anker, Regel-genau-einmal-Disziplin, Anti-Pattern-Tabelle mit Anker-Spalte) und **maximale Ausfuehrbarkeit** (vollstaendige, kopierbare React/Next.js-Snippets, ESLint-Boundaries-Config, Style-Dictionary- und Playwright-Skelette).
>
> **Lesbarkeit als Vertrag.** Begriffe sind im Dokument konsistent (Glossar §0.5). Jede Regel steht **genau einmal** kanonisch (mit `§`-Anker) und wird sonst nur **referenziert**, nie umformuliert — so entstehen keine Widersprueche. Querverweise sind explizit (`→ §x.y`).
>
> **Quellen-Kuerzel.** Jede Regel ist mit `[NOR] [BEC] [FIL] [FRO] [BUD]` an ihr Quellbuch gebunden (Tabelle §0.1). Eine Regel ohne Kuerzel ist eine Synthese-/Prozessregel dieses Dokuments und mit `[§]` markiert.

---

## 0. Quell-Paradigmen, Schichtenmodell, Glossar und Lesart

### 0.1 Die fuenf Buecher und ihre Rolle

| Kuerzel | Buch                                                       | Rolle (Leitfrage)                                                                                                                                                                                           | Quelldatei (selber Ordner)                                    |
| ------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `[NOR]` | _Design for a Better World_ — Donald A. Norman             | **WARUM** — meaningful & sustainable, humanity-centered, _with & by_ statt _for_, Wurzelursache statt Symptom, kein WEIRD-Bias, keine Dark Patterns, Stories neben Metriken, Resilienz/lose Kopplung        | `Design for a Better World - Donald A. Norman.md`             |
| `[BEC]` | _Effective UX Design Strategies_ — Christopher Reid Becker | **WIE wir lernen** — Problemdefinition zuerst, Research, (Proto-)Personas, Insights, Dual-Track Agile, foundational-first, Fail Fast / Product Graveyard, Fidelity-Treppe, UX-Maturity, Nielsen-Heuristiken | `Effective UX Design Strategies - Christopher Reid Becker.md` |
| `[FIL]` | _UI Design Principles_ — Michael Filipiuk                  | **Wahrnehmung & Craft** — visuelle Hierarchie, Gestalt, Grid/8pt, Typo-Skala, rollenbasierte Farbe, Kontrast, Schatten/Radius/Border, Buttons                                                               | `UI Design Principles - Michael Filipiuk.md`                  |
| `[FRO]` | _Atomic Design_ — Brad Frost                               | **Architektur** — Atoms→Molecules→Organisms→Templates→Pages, Interface Inventory, Pattern Lineage, Governance, Holy Grail                                                                                   | `Atomic Design - Brad Frost.md`                               |
| `[BUD]` | _UI Design Systems Mastery_ — Marina Budarina              | **Systematik** — 3-Ebenen-Design-Tokens, Token-Pipeline (Single Source), Naming-Convention, Foundations, Theming, Komponenten-Doku, Team-Modelle, Changelog                                                 | `UI Design Systems Mastery - Marina Budarina.md`              |

### 0.2 Die Synthese in einem Satz

> Baue die Website als **humanity-centered, mit/durch echte Menschen entworfenes & nachhaltiges** (`[NOR]`), **problemdefiniert & research-informiertes, foundational-first & in billigen Stufen getestetes** (`[BEC]`), **wahrnehmungs-praezises** (`[FIL]`), **atomar komponiertes mit gepflegtem Lineage** (`[FRO]`), **token-systematisiertes & dokumentiertes** (`[BUD]`) System um — Schicht fuer Schicht, ohne den Build je zu brechen.

### 0.3 Das Schichtenmodell — der mentale Filter fuer JEDE Aenderung (`§0.3`)

Jede Komponente, die der Agent anfasst, durchlaeuft **fuenf Tore in fester Reihenfolge**. Erst wenn alle fuenf „ja" sind, gilt die Komponente als fertig. Die Reihenfolge ist nicht willkuerlich: Sie entspricht dem roten Faden WARUM → WIE → CRAFT → STRUKTUR → SYSTEM und ist deckungsgleich mit dem Phasenplan (§4).

```
        Tor / Frage, die die Aenderung bestehen muss              Bei "nein" →
─────────────────────────────────────────────────────────────────────────────────────
[NOR]   ZWECK        Dient sie einem echten menschlichen Beduerfnis     Wurzelursache klaeren
        (Phase 0,5,6) (kein WEIRD-Default)? Behandelt sie die WURZEL-    (§1.10), Symptom NICHT
                     ursache, nicht das Symptom? Nachhaltig (kein        patchen; ggf. STOPP &
                     JS-/Energie-Abfall)? Frei von Dark Patterns?        nachfragen (§1.17).
                     Bleibt die menschliche Story sichtbar?
[BEC]   PROZESS      Ist das Problem fuer dieses Segment definiert        Erst Problem-Statement
        (Phase 0,6)  (§Phase 0.5)? Auf welcher Evidenz/Insight beruht    + Outline + Hypothese;
                     sie? Steht das Foundationale (Token/Grid/Daten-     billig (Lo-Fi) testen,
                     vertrag) zuerst (§1.3)? Klein & billig testbar?     bevor Code entsteht.
                     Decke ich ALLE UI-States ab (§Phase 6.1)?
[FIL]   WAHRNEHMUNG  Genau 1 dominantes Element? 8pt-Grid? Typo-Skala    Gegen Skala/Grid/Token
        (Phase 3,4)  (Body ≥16px)? Farbe rollenbasiert? Kontrast        korrigieren — nie
                     ≥ WCAG AA? Schatten/Radius regelkonform?            "nach Gefuehl".
[FRO]   STRUKTUR     Kleinstes wiederverwendbares Atom/Molecule/         In passende Ebene
        (Phase 2)    Organism? Kontext-/content-agnostisch benannt?      zerlegen; Lineage
                     Import-Richtung top-down (§2.2)? Lineage aktuell?   (§Phase 2.11) updaten.
[BUD]   SYSTEM       NUR Tokens (kein Rohwert/Primitive direkt, §3)?     Token anbinden;
        (Phase 1,7)  Variants/Sizes/States als Props? Industriestandard- Doku + Changelog
                     Name? Dokumentiert?                                 ergaenzen (§Phase 7).
```

### 0.4 Wie der Agent die Quellbuecher nutzt

Reicht die Direktive hier nicht aus (Grenzfall, Detailwert, Begruendung), liest der Agent den in §9 referenzierten Abschnitt der jeweiligen `.md`-Datei — **bevor** er entscheidet, nicht danach (`[BEC]` „sharpen the axe first": vier von sechs Stunden gehoeren dem Schaerfen der Axt = der Problem-/Kontextklaerung).

> **Hinweis zu Quellen-Seitenzahlen:** Die in §9 genannten Kapitel-/Seitenangaben stammen aus den Buch-Extraktionen und sind **nicht** gegen die On-Disk-`.md`-Dateien verifiziert. Massgeblich ist der per Volltextsuche im Dokument gefundene **Abschnittstitel**, nicht die exakte Seitenzahl.

### 0.5 Glossar — verbindliche Begriffe (kanonische Definition, danach nur referenzieren)

| Begriff                                          | Kanonische Bedeutung in diesem Dokument                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Anker         |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **Rohwert**                                      | Literaler Design-Wert ohne Namen: Hex (`#2f6bff`), `rgb/rgba/hsl`, `px`, nackte Font-Size/Radius/Shadow-Werte. **Kein Token.**                                                                                                                                                                                                                                                                                                                                                                           | §3            |
| **Primitive-/Global-Token**                      | „Was es ist", kontextfrei: `--blue-500`, `--space-4`.                                                                                                                                                                                                                                                                                                                                                                                                                                                    | §3            |
| **Semantic-/Alias-Token**                        | „Was es tut", rollengebunden: `--color-bg`, `--color-action-primary`.                                                                                                                                                                                                                                                                                                                                                                                                                                    | §3            |
| **Component-Token**                              | Komponentengebunden, erbt **nur** von Semantic: `--button-primary-bg`.                                                                                                                                                                                                                                                                                                                                                                                                                                   | §3            |
| **Token-Quelldateien**                           | Orte, an denen Rohwerte leben duerfen — **setup-abhaengig** (§3.0): bei **CSS-first** nur `tokens.css` (`tokens.ts` spiegelt **nur** Variablennamen/Logikwerte, **keine** Farb-/Spacing-Rohwerte); bei **JSON-first** `tokens.json` (generiert `tokens.css`/`tokens.ts`). `tailwind.config.*` enthaelt **nur** `var(--token)`-Referenzen, **keine** Rohwerte (Ausnahme: var()-unfaehige Breakpoints, §3.3). Die Allowlist (§1.19) ist eine **Mess-Ausnahme** gegen Falsch-Positive, **keine** Erlaubnis. | §1.19         |
| **Atom / Molecule / Organism / Template / Page** | Atomic-Ebenen, Definition + Ordner in §2.1; Import-Richtung in §2.2.                                                                                                                                                                                                                                                                                                                                                                                                                                     | §2.1/§2.2     |
| **Dominantes Element**                           | Genau **ein** Element pro View mit der staerksten Hierarchie-Kombination (groesste Groesse + Primary-Farbe + Vordergrund + obere/linke Position).                                                                                                                                                                                                                                                                                                                                                        | §Phase 3.1    |
| **Vanity-Metrik**                                | Leicht messbares Surrogat ohne Bindung an ein Nutzerziel (Pageviews, Verweildauer, rohe Klicks, LoC).                                                                                                                                                                                                                                                                                                                                                                                                    | §Phase 5.7    |
| **Outcome-Event**                                | An ein reales Nutzerergebnis gebundenes Event (Aufgabe abgeschlossen, Formular erfolgreich gesendet).                                                                                                                                                                                                                                                                                                                                                                                                    | §Phase 5.7    |
| **Proto-Persona**                                | Bewusst **verwerfbare** Annahme-Persona (4 Quadranten), die durch Research geschaerft wird — kein Ersatz fuer echte Nutzer.                                                                                                                                                                                                                                                                                                                                                                              | §Phase 0.6    |
| **Narratives Akzeptanzkriterium**                | _„Als <Persona> kann ich <Ziel> erreichen, ohne <Reibung>."_                                                                                                                                                                                                                                                                                                                                                                                                                                             | §Phase 0.6    |
| **Allowlist**                                    | Die wortgleiche Glob-Ausnahmeliste fuer alle Wert-Audits (§1.19).                                                                                                                                                                                                                                                                                                                                                                                                                                        | §1.19         |
| **Soft Grid**                                    | 8pt-System, bei dem **nur die Abstaende** (margin/padding/gap) auf der Skala liegen, nicht zwingend die Eigengroessen der Komponenten.                                                                                                                                                                                                                                                                                                                                                                   | §3.1/§Phase 4 |

---

## 1. Operating Contract — verbindliches Agentenverhalten

Diese Regeln gelten in **jeder** Phase; Verstoss = Abbruchgrund. Jede Regel hat einen stabilen Anker (`§1.x`) und wird im restlichen Dokument nur referenziert.

1. **§1.1 Read-first.** `[BEC]` Vor jeder Aenderung den Ist-Zustand der betroffenen Dateien lesen; keine Annahme ueber Struktur, die nicht durch eine gelesene Datei belegt ist. _Der Agent ist NICHT der User_ — jede Designentscheidung ist eine Hypothese, kein Fakt (`[BEC]` „UX designer is not the user").
2. **§1.2 Problem vor Loesung.** `[BEC]` Pro Route/Segment existiert ein Problem-Statement (§Phase 0.5), bevor strukturell refactored wird. „Confidence in der Loesung ist Nebenprodukt von Confidence in der Problemdefinition." Ist das Problem unklar: Stift weglegen, zurueck zur Definition. Jedes substanzielle Refactoring zahlt nachweisbar auf eines der vier Kriterien **usable/useful/reliable/sustainable** ein; reines Umbenennen/Verschieben ohne Nutzen ist „optional-cleanup".
3. **§1.3 Foundational-first (Dual-Track Agile).** `[BEC]` Foundationales zuerst — **Datenvertraege/Schema, Layout-Primitives/Grid, Design-Tokens** — bevor finales UI darauf baut, damit nachgelagerte Arbeit nicht blockiert wird (`[BEC]` „Development should not be blocked by design"). Entdeckung (Outline/Lo-Fi) laeuft konzeptionell vor Lieferung (Hi-Fi). **Kein Schritt blockiert die Weiterarbeit anderer Bereiche**; unfertige Foundations werden als sauber gekapselter Platzhalter/`TODO(refactor)` markiert, nicht als Single-Point-of-Dependency liegen gelassen. Begruendet die Phasenreihenfolge §4.
4. **§1.4 Build darf nie brechen.** `[§]` Nach jeder logischen Einheit muessen `build`, `typecheck`, `lint` gruen sein (§7). Rot = sofort beheben (`[BEC]` Agile: „keeps software team members unblocked"). Es gibt **keinen** Commit auf dem Refactor-Branch, der die Hauptroute in einen 500-/Build-Fehler-Zustand bringt (git-bisect-tauglich). Vor groesseren Umbauten einen gruenen Rollback-Tag setzen: `git tag pre-refactor-baseline`.
5. **§1.5 Inkrementell, atomar & reversibel.** `[§][BEC]` Eine Aenderung = ein abgegrenzter, **revertierbarer** Commit mit sprechender Message (`refactor(tokens): …`, `refactor(atoms/Button): …`). Kein Big-Bang-Rewrite (`[BEC]` „muddling through"/Inkrementalismus). Pro Fix-Commit im Body **`Symptom:`** und **`Root cause:`** angeben (NTSB-Disziplin, §1.10). Vorgaengerversionen erhalten (Version Control), um zuruecksetzen zu koennen. Bei Anforderungsaenderung Was/Warum/Impact dokumentieren.
6. **§1.6 Refactoring ≠ Verhaltensbruch.** `[§]` Gleiches sichtbares/funktionales Verhalten, bessere Struktur. Absichtliche UX-/Optik-Aenderungen sind erlaubt, aber als solche markiert und gegen die Phase-0-Baseline (Screenshots/Metriken) abgewogen. **Feature-Streichung ist ein legitimes Ergebnis** (`[BEC]` Product Graveyard, §Phase 6.8): „Nein sagen" / Entfernen unbenutzter, schadhafter oder zweck-loser Features ist Wertschoepfung — aber nur als bewusste, dokumentierte Produktentscheidung (Nachfrage §1.17, Nachfrage-Schwelle fuer neue Features §1.16).
7. **§1.7 Token-Pflicht.** `[BUD]` Ab Ende Phase 1 sind hartkodierte Rohwerte (Farben, Pixel-Spacings, Font-Sizes, Radii, Shadows) in **Komponenten** **verboten**. Komponenten konsumieren nur Semantic-/Component-Tokens, **nie** Primitive direkt, **nie** Rohwerte. Rohwerte leben **ausschliesslich** in den Token-Quelldateien (Allowlist §1.19). Diese Regel wird in §3, Phase 1/3/4, §5, §6, §7 nur **referenziert**, nicht neu formuliert.
8. **§1.8 Keine Duplikate / keep-in-use (Circular Design).** `[FRO][NOR]` Vor Neubau pruefen, ob ein Atom/Molecule existiert (Interface Inventory §Phase 0.1). Hierarchie der Eliminierung: **Vermeiden > Wiederverwenden/Reparieren > Umbauen** (`[NOR]` „direct reuse" vor „recycling", das degradiert). Wegwerf-Komponenten und Copy-Paste sind verboten; jedes ungenutzte KB/Export/Pattern ist ein „design flaw" und wird entfernt (`depcheck`/`ts-prune`/`knip`).
9. **§1.9 Lose Kopplung & Resilienz.** `[NOR]` Keine Single-Points-of-Failure: kein globaler shared-mutable State, der viele Komponenten zugleich fallen laesst; State so nah wie moeglich an der Nutzung; Kommunikation ueber typisierte Props/Server-Action-Vertraege; **keine** Zirkular-Abhaengigkeiten (`madge --circular`), kein God-Module mit ueberproportional vielen Importeuren; Drittanbieter-SDKs/-Fetches defensiv (try/catch + Fallback + Timeout) hinter Adaptern in `lib/`. Jedes Route-Segment ist mit `error.tsx`/`loading.tsx`/`not-found.tsx` gekapselt; ein Fehler degradiert nur sein Segment, nie die ganze Seite (§Phase 5.9).
10. **§1.10 Wurzelursache statt Symptom (NTSB-Stil).** `[NOR]` Bei Bug/Incident **alle** beitragenden Faktoren identifizieren und beheben — nicht beim ersten Stack-Frame stoppen („Five Whys" findet faelschlich eine Einzelursache und beschuldigt oft die falsche Stelle). Jeder Fix bekommt einen Regressionstest (vorher rot, nachher gruen) und im PR-Body die Zeilen **`Symptom:`** / **`Root cause:`** plus ≥2 „contributing factors". Defensive Pflaster (zusaetzliches `useMemo`/`setTimeout`/`key`-Toggling/`eslint-disable react-hooks`) statt Behebung der instabilen Quelle sind verboten.
11. **§1.11 A11y & verstaendliche Sprache sind nicht optional.** `[NOR][BEC]` Jede UI ist semantisch, voll tastaturbedienbar, kontraststark (**WCAG 2.2 AA**). „Nicht zugaenglich = nicht nutzbar" (`[BEC]` Moebius). Alle nutzersichtbaren Texte in Alltagssprache, kein Jargon, kein ALL-CAPS-Rechtstext; Fehlermeldungen in Klartext (keine rohen Codes/Stacktraces) mit konkretem Loesungsvorschlag (Nielsen H9). Einhand-/Daumenreichweite (primaere Aktionen erreichbar, keine Hover-only-Interaktion). A11y ist **vor** Delight zu sichern (UX-Maturity-Reihenfolge §Phase 6.6).
12. **§1.12 Kein WEIRD-Bias — Design fuers ganze Oekosystem.** `[NOR]` Nicht nur fuer den Western/White, Educated, Industrialized, Rich, Democratic Default-Nutzer entwerfen. i18n/Lokalisierung, kulturneutrale Beispiele/Farben, locale-flexible Datums-/Zahlen-/Namens-/Adressformate (`Intl.*` mit request-locale, kein festes `en-US`/nacktes `toLocaleString()`; **ein** `fullName`-Feld statt erzwungenem first/last), unterschiedliche Geraete-/Netzkontexte dienen dem **ganzen** Nutzer-Oekosystem (HCD-Prinzip 2/3).
13. **§1.13 Keine Dark Patterns.** `[NOR]` Opt-out so einfach/prominent wie Opt-in; Consent-Checkboxen default-unchecked (kein `defaultChecked`-Opt-in); Abmelden/Loeschen/Kuendigen so leicht wie Anmelden (Schritt-Symmetrie); kein Confirm-Shaming, keine kuenstlichen Countdowns/Fake-Knappheit, kein Roach-Motel-Checkout, keine Koeder-Preise, kein Autoplay/Infinite-Scroll als Verweildauer-Falle. Keine Features hinzufuegen, die niemand braucht, nur weil sie „verkaufen". Der Mensch steuert die Technik.
14. **§1.14 Stories neben Metriken.** `[NOR]` Messungen liefern Fakten, **Stories liefern Bedeutung**. Hinter jeder Metrik/jedem Outcome-Event bleibt die menschliche Geschichte sichtbar (welche reale Nutzeraufgabe steht dahinter). Personas und Akzeptanzkriterien werden narrativ formuliert (§Phase 0.6). Keine Vanity-Metrik als „KPI/success" ohne `whatItProxies` + `validityCaveat`. Nutzersichtbare Status-UIs zeigen **keinen** opaken Aggregat-Score, sondern qualitativen Ueberblick + Drilldown (§Phase 5.7).
15. **§1.15 Verifizieren, nicht behaupten.** `[§]` Jede „erledigt"-Aussage durch ausgefuehrten Check belegen (Befehl + Ergebnis ins Log). Adversarial gegenpruefen: „Womit koennte diese Aenderung etwas kaputt gemacht haben?" Vor Aenderung an einem geteilten Symbol eine **Impact-Map** erstellen (`rg -l "<X[ />]" src` → alle Konsumenten; betroffene `revalidateTag/revalidatePath`) und im Commit/Log vermerken.
16. **§1.16 Fundamental-Stack nicht wechseln; Nachfrage-Schwelle fuer neue Patterns.** `[BEC][FRO]` React/Next.js App Router ist stabile Anforderung — innerhalb des Stacks refactoren, nie ad hoc Framework/Architektur tauschen (`[BEC]` „if coded in React, do not switch to PHP"); Styling-Strategie nicht arbitraer wechseln. Ein neues UI-Pattern entsteht erst beim **zweiten** belegten Use-Case (`[FRO]` Governance), nicht bei jedem Wunsch; vorher One-off lokal belassen oder bestehende Komponente per Prop erweitern.
17. **§1.17 Nachfragen-Schwelle (with & by, not for).** `[NOR][BEC]` Bei jeder **Produktentscheidung** (Markenfarbe, Inhalt, Tonalitaet, Geschaeftsregel, **Feature-Streichung**, Einfuehrung eines Build-Tools/JSON-first-Pipeline) **STOPP & fragen** — nicht raten und nicht so tun, als waeren Stakeholder/Executives die Nutzer. Wo moeglich mit echten beabsichtigten Nutzern entscheiden („Design with and by, not for", HCD-Prinzip 5; der Agent ist Enabler, nicht Bestimmer). Bei rein **technischen** Defaults: sinnvollste Option waehlen und im Log begruenden. Risikoreiche, annahmebasierte UI-Aenderungen hinter Feature-Flag (`lib/flags.ts`) und als „assumption — needs validation" markieren (Searcher statt Planner, erst kleines Subset).
18. **§1.18 Fortschritt sichtbar machen.** `[§][BUD]` `REFACTOR-LOG.md` fuehren (pro Phase Datum, Aenderung, Verifikationsergebnis, offene Punkte, Vorher/Nachher-Metriken) **und** `CHANGELOG.md` (Aenderungstyp **markup/style/script/spec** × Gruppe **new/enhancement/fix/other**, versioniert SemVer + datiert). Gestrichene Features in `docs/GRAVEYARD.md` (Datum, Grund, entfernender Commit). Backlog priorisiert in `docs/REFACTOR_BACKLOG.md` (gruppiert nach Performance/A11y/IA/Visuals; ein PR = ein priorisiertes Thema mit Backlog-ID).
19. **§1.19 Einheitliche Token-Allowlist (Mess-Norm).** `[§][BUD]` **Alle** Design-Wert-Audits (Hex/px/Font/Radius/Shadow) verwenden projektweit **dieselbe** Glob-Allowlist, sodass „0 Treffer" reproduzierbar dieselbe Bedeutung hat:
    ```
    --glob '!**/tokens.json' --glob '!**/tokens.css' --glob '!**/tokens.ts' --glob '!**/tailwind.config.*'
    ```
    `tokens.json` ist enthalten, weil bei JSON-first (§3.0 B) die Rohwerte dort leben (sonst falsch-positive Treffer). Wird in §3, Phase 1, 3, 4, §5, §6 und §7 **wortgleich** genutzt. Mess-Konventionen (`--count-matches` fuer Treffer, `rg -l … | wc -l` fuer Dateien, kein `--type=tsx`) siehe §7. **Wichtig:** Die Allowlist ist eine reine **Mess-Ausnahme** (verhindert Falsch-Positive), **keine** Erlaubnis — bei **CSS-first** duerfen `tokens.json`/`tokens.ts` **keine** Farb-/Spacing-Rohwerte enthalten; ein separater Check (§3.4) deckt solche Doppelpflege auf.
20. **§1.20 One-off-Schwelle fuer Tokens/Patterns.** `[BUD][FRO]` Einen neuen Token erst ab **≥3** Verwendungsstellen anlegen (sonst lokal belassen); ein neues Pattern erst beim **zweiten** Use-Case (§1.16). Verhindert „bloated Wild West".

---

## 2. Ziel-Architektur (React/Next.js, App Router)

Der Agent migriert die bestehende Struktur **schrittweise** hierauf — nicht in einem Rutsch (§1.5). Diese Struktur realisiert das **Holy Grail** (§Phase 7.8): Pattern Library und Produktion teilen **dieselben** Komponenten (kein Copy-Paste-Klon).

```
src/
├── app/                          # App Router. Route-Ordner = "Pages" im Atomic-Sinn [FRO]
│   ├── layout.tsx                # Root-Template (Shell, Provider, <html lang>, next/font)
│   ├── page.tsx
│   ├── error.tsx                 # Resilienz: Root Error Boundary — PFLICHT 'use client' [NOR]
│   ├── global-error.tsx          # Auffangnetz fuer Root-Layout-Fehler — PFLICHT 'use client' [NOR]
│   ├── loading.tsx               # System-Status sichtbar (Nielsen H1); Server Component ok [BEC]
│   ├── not-found.tsx             # Server Component ok
│   └── (routes)/<segment>/
│       ├── page.tsx              # Page = Template + echter Content [FRO]
│       ├── layout.tsx            # Segment-Template
│       ├── loading.tsx           # je Segment [BEC]
│       ├── error.tsx             # je Segment, mit reset() — PFLICHT 'use client' [NOR][BEC]
│       └── not-found.tsx
├── design-system/                # Das Herz: framework-nahes, wiederverwendbares System
│   ├── tokens/
│   │   ├── tokens.json           # OPTIONALE Single Source (Style-Dictionary); generiert css/ts [BUD]
│   │   ├── tokens.css            # SINGLE SOURCE OF TRUTH (oder generiert): 3 Ebenen CSS Vars [BUD]
│   │   ├── tokens.ts             # typsichere Spiegelung (nur Werte fuer Logik/Props)
│   │   ├── build-tokens.mjs      # NUR bei JSON-first: Style-Dictionary-Build (§3.0 B)
│   │   └── README.md             # Naming-Convention + Ebenen-Regel + Pipeline + "Token hinzufuegen"
│   ├── core/        (= ATOMS)    # Button, Input, Text, Heading, Icon, Link, Badge, Avatar [FRO][BUD]
│   ├── compound/    (= MOLECULES)# FormField, Card, SearchForm, Pagination, Dialog [FRO][BUD]
│   ├── sections/    (= ORGANISMS)# Header, Footer, NavBar, HeroSection, ContactForm [FRO]
│   ├── primitives-layout/        # Container, Grid, Stack, Cluster (Layout-Atome) [FIL]
│   ├── feedback/                 # EmptyState, ErrorState, Toast, Skeleton (geteilte Zustands-UI) [BEC]
│   └── index.ts                  # Barrel-Export der oeffentlichen API
├── templates/                    # Layout-Gerueste, Content-STRUKTUR ohne finalen Content [FRO]
├── lib/                          # Utilities, Hooks, Formatter, defensive Fetch-Adapter (kein UI)
│   ├── flags.ts                  # Feature-Flags (Fail-fast / risikoreiche Aenderungen) [BEC][NOR]
│   └── metrics/                  # definitions.ts (Metrik+scaleType+Story), thresholds.ts, aggregate.ts [NOR]
├── content/                      # Texte/Daten getrennt vom UI (Content-First) [BEC][FRO]
├── messages/                     # i18n/zentralisierte nutzersichtbare Strings (Klarheit pruefbar) [NOR]
└── styles/
    └── globals.css               # importiert tokens.css, Reset, Basistypografie
docs/
├── ux/problem-statements.md      # je Segment ein Problem-Statement (v2-Template) [BEC]
├── ux/insights.md                # User-Insight-Mad-Libs, offene Hypothesen [BEC]
├── ux/research-summary.md        # konsumierbare Summary + Quote-Cluster (statt Rohtranskripte) [BEC]
├── ux/heuristics-audit.md        # Nielsen 10 je Seite [BEC]
├── ux/maturity-audit.md          # usable/useful/desirable/delightful je Seite [BEC]
├── ux/user-testing.md            # Protokoll Usability-Runden mit echten Nutzern [BEC][NOR]
├── personas/<name>.md            # Proto-Personas (4 Quadranten, "assumption") [NOR][BEC]
├── interface-inventory.md        # alle einzigartigen UI-Patterns, 16 Kategorien [FRO]
├── REFACTOR_BACKLOG.md           # priorisiert, KEEP/MERGE/DROP je Pattern [BEC][FRO]
├── GRAVEYARD.md                  # gestrichene Features (Datum, Grund, Commit) [BEC]
└── design-system/
    ├── DESIGN_SYSTEM.md          # Governance: Naming, Modify/Add/Remove, Team-/Approver-Modell [FRO][BUD]
    ├── PATTERNS.md               # kanonischer Name → Bedeutung (shared vocabulary) [FRO]
    └── lineage.md                # Pattern-Lineage / Usage-Map (Uses / Used-by) [FRO]
.storybook/                       # lebende Pattern Library & visuelle Referenz [FRO][BUD]
.eslintrc.cjs                     # eslint-plugin-boundaries + jsx-a11y (erzwingt §2.2 / §1.11) [§]
.github/CODEOWNERS                # Governance: Owner fuer tokens/** + design-system/** [BUD]
REFACTOR-LOG.md                   # Arbeitsprotokoll (§1.18)
CHANGELOG.md                      # markup/style/script/spec × new/enhancement/fix [BUD]
```

### 2.1 Atomic-Mapping-Tabelle `[FRO]` `[BUD]`

| Atomic-Ebene `[FRO]` | Granularitaets-Aequivalent (Synthese `[§]`) | Ordner                        | Definition                                                                                                     | Beispiele                                                                        | Single-Responsibility-Regel            |
| -------------------- | ------------------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------- |
| **Atom**             | Core Component                              | `core/`, `primitives-layout/` | Kleinste, nicht weiter zerlegbare UI-Einheit; konsumiert **nur** Tokens; importiert keine eigene UI-Komponente | Button, Input, Label, Icon, Text, Heading, Badge, Avatar, Container, Grid, Stack | Tut genau **eine** Sache               |
| **Molecule**         | Compound Component                          | `compound/`, `feedback/`      | Funktionale Gruppe von Atomen mit **einem** Zweck                                                              | FormField (Label+Input+Error), Card, SearchForm, Pagination, EmptyState          | „do one thing well"                    |
| **Organism**         | Compound (komplex)                          | `sections/`                   | Eigenstaendiger Interface-Abschnitt aus Molecules/Atomen/anderen Organismen                                    | Header, Footer, ProductGrid, HeroSection, ContactForm                            | Gibt Kontext, wiederverwendbar         |
| **Template**         | —                                           | `templates/` + `layout.tsx`   | Content-**Struktur**/Layout (Slots, Grid, Bild-`aspect-ratio`, max. Zeichenlaengen), **kein finaler Content**  | MarketingLayout, ArticleLayout                                                   | „what content is made FROM"            |
| **Page**             | —                                           | `app/**/page.tsx`             | Template-Instanz mit echtem, repraesentativem Content; haertet das System an Varianten                         | Startseite, Produktseite                                                         | Mit Extrem-Content testen (§Phase 6.4) |

**Komponentenkategorien (Budarina, in Doku/Struktur abbilden) `[BUD]`:** Input · Communication · Navigation · Containment. Diese **funktionale** Achse ist **orthogonal** zur Granularitaets-Achse (Atom/Molecule/Organism); die Spalte „Granularitaets-Aequivalent" oben ist deshalb eine **Synthese `[§]`**, **keine** Budarina-Ebenen-Taxonomie (Budarina belegt nur „components are built hierarchically, starting with atoms"). **Startkomponente ist immer der Button** — er enthaelt fast alle Sprachelemente (Farbe, Typo, Spacing, Radius, Shadow, Icon, States, A11y) und dient als Vorlage fuer das Variant/Size/State-Muster aller weiteren Komponenten.

### 2.2 Import-Hierarchie (hart, vollstaendig) `[FRO][BUD]`

> **Import-Richtung:** `Page → Template → Organism → Molecule → Atom → Token`. Eine Ebene darf **nur gleiche oder tiefere** Ebenen importieren. **Niemals rueckwaerts.** Zusaetzlich gilt projektweit: **keine** Zirkular-Abhaengigkeiten (§1.9).

| Ebene (Ordner)                            | Darf importieren                           | Darf NICHT importieren             |
| ----------------------------------------- | ------------------------------------------ | ---------------------------------- |
| **Atom** (`core/`, `primitives-layout/`)  | nur Token                                  | Molecule, Organism, Template, Page |
| **Molecule** (`compound/`, `feedback/`)   | Atom, andere Molecule, Token               | Organism, Template, Page           |
| **Organism** (`sections/`)                | Atom, Molecule, **andere Organism**, Token | Template, Page                     |
| **Template** (`templates/`, `layout.tsx`) | Organism, Molecule, Atom, Token            | Page                               |
| **Page** (`app/**/page.tsx`)              | alles darunter                             | —                                  |

Diese Hierarchie wird in Phase 2 fuer **jede** Ebene verifiziert (nicht nur fuer Atome). Sie wird **maschinell erzwungen** mit `eslint-plugin-boundaries` (§2.4) **und** `madge --circular` — nicht nur per Grep/Review geprueft. Die Strukturhierarchie ist verbindlich; die Styling-Technik (CSS Modules / Tailwind / cva) bleibt frei (`[FRO]` „Atomic design has nothing to do with CSS architecture").

### 2.3 Server/Client-Komponenten (Sustainability + Konvention) `[NOR][§]`

`'use client'` nur, wo Interaktivitaet noetig ist — Server Components sind Default (Bundle/Energie sparen, §Phase 5.8). **Konventions-Ausnahmen (kein Verstoss gegen „minimal"):**

- `error.tsx` und `global-error.tsx` **muessen** Client Components sein (`'use client'` Pflicht, da Error Boundary mit `reset()`).
- `loading.tsx` und `not-found.tsx` koennen Server Components bleiben.

Die „use client minimal"-Regel gilt fuer **interaktive UI-Komponenten**, nicht fuer konventionsgebundene Router-Dateien. Der Agent entfernt `'use client'` **nie** aus `error.tsx`/`global-error.tsx`. Interaktivitaet wird so nah wie moeglich an die **Blaetter** des Komponentenbaums geschoben (`'use client'` an kleinen Interaktions-Komponenten, nicht an grossen Seiten-Subtrees).

### 2.4 `eslint-plugin-boundaries` — Import-Richtung maschinell erzwingen `[FRO][§]`

```js
// .eslintrc.cjs (Auszug) — erzwingt §2.2 HART (Build-Gate), nicht nur per Code-Review.
// jsx-a11y-Regeln erzwingen zugleich §1.11 maschinell.
module.exports = {
  plugins: ['boundaries', 'jsx-a11y'],
  settings: {
    'boundaries/elements': [
      { type: 'token', pattern: 'src/design-system/tokens/*' },
      { type: 'atom', pattern: 'src/design-system/(core|primitives-layout)/*' },
      { type: 'molecule', pattern: 'src/design-system/compound/*' },
      { type: 'feedback', pattern: 'src/design-system/feedback/*' },
      { type: 'organism', pattern: 'src/design-system/sections/*' },
      { type: 'template', pattern: 'src/templates/*' },
      { type: 'page', pattern: 'src/app/**' },
    ],
  },
  rules: {
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          { from: 'atom', allow: ['token'] },
          { from: 'molecule', allow: ['token', 'atom', 'molecule'] },
          { from: 'feedback', allow: ['token', 'atom'] },
          { from: 'organism', allow: ['token', 'atom', 'molecule', 'feedback', 'organism'] },
          { from: 'template', allow: ['token', 'atom', 'molecule', 'feedback', 'organism'] },
          {
            from: 'page',
            allow: ['token', 'atom', 'molecule', 'feedback', 'organism', 'template'],
          },
        ],
      },
    ],
    // A11y-Pflicht (§1.11) maschinell:
    'jsx-a11y/no-static-element-interactions': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
  },
}
```

> **Hinweis:** `feedback/` ist ein eigener boundaries-Typ (nicht mit `compound` zusammengelegt), damit `feedback`-Komponenten klar nur auf `atom`/`token` zugreifen duerfen. `madge --circular src` ergaenzt die Pruefung um Zyklen-Erkennung.

---

## 3. Design-Tokens — 3-Ebenen-System `[BUD]` `[FIL]`

Tokens sind die **Single Source of Truth**: Wert wird einmal geaendert und propagiert ueberall (`[BUD]`). Ein Token = **Rohwert + Name** (= „raw value + shell"). Drei Ebenen, von „was es ist" zu „was es tut":

```
1) PRIMITIVE / GLOBAL   rohe, kontextfreie Werte ("what it is")    --blue-500, --space-4, --font-size-300
2) SEMANTIC / ALIAS     Zweck/Kontext ("what it does")             --color-bg, --color-action-primary
3) COMPONENT-SPECIFIC   komponentengebunden, erbt von Semantic     --button-primary-bg, --card-padding
```

**Regeln** (`§1.7` ist die kanonische Pflicht; hier nur die Token-internen Detailregeln) `[BUD]`:

- Komponenten verwenden **nur** Semantic- oder Component-Tokens, **nie** Primitive direkt, **nie** Rohwerte (→ §1.7).
- Component-Tokens erben von Semantic, Semantic erben von Primitive. Ein Component-Token zeigt **nie** direkt auf einen Rohwert oder ein Primitive.
- Component-spezifische Tokens **isolieren** Komponenten: Aendern eines Buttons darf keine andere Komponente (z. B. Checkbox) beeinflussen.
- **One-off-Regel (§1.20):** Fuer Werte mit nur **einem** Vorkommen keinen Token anlegen; erst ab **≥3** Verwendungsstellen.
- **Naming-Convention (feste Reihenfolge, kebab-case):** `category-property-item-variant-state`
  → z. B. `--color-bg-button-primary-active`, gekuerzt `--color-bg-btn-primary-active`. Globale Farben numerisch 50–900 (50 = hellster … 900 = dunkelster). Optionale Stufen (variant/state) weglassen, wenn nicht noetig. Bei Ordinalwerten gilt diese Reihenfolge konsistent und vorhersagbar.

### 3.0 Token-Pipeline / Single Source `[BUD]`

Tokens sind eine **kompilierte Single Source of Truth** (JSON/YAML → plattform-/formatuebergreifende Outputs). Zwei zulaessige Setups:

- **(A) CSS-first (Default, einfach):** `tokens.css` ist die Single Source; `tokens.ts` spiegelt **nur** die Werte, die JS/TS braucht (Unions, Breakpoint-Zahlen) und referenziert sonst die CSS-Variablennamen. Keine Doppelpflege von Farben/Spacing.
- **(B) JSON-first (skalierend):** `tokens/tokens.json` ist die Single Source; ein Build-Schritt (**Style Dictionary**) **generiert** `tokens.css` **und** `tokens.ts` reproduzierbar. Generierte Dateien tragen einen `/* AUTO-GENERATED — do not edit */`-Header; ein zweiter `tokens:build`-Lauf erzeugt **kein** `git diff`. Setup in `tokens/README.md` dokumentieren.

Der Agent waehlt **(A)** als Default und schlaegt **(B)** vor, sobald >1 Plattform/Output oder Theming-Skalierung absehbar ist — Einfuehrung eines Build-Tools ist eine Produktentscheidung (Nachfrage-Schwelle §1.17).

**Style-Dictionary-Skeleton (nur bei JSON-first, Setup B):**

```js
// design-system/tokens/build-tokens.mjs
import StyleDictionary from 'style-dictionary'
const sd = new StyleDictionary({
  source: ['design-system/tokens/tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'design-system/tokens/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: {
            outputReferences: true, // erhaelt var(--…)-Referenzen statt Werte zu inlinen
            fileHeader: () => ['AUTO-GENERATED — do not edit'],
          },
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'design-system/tokens/',
      files: [{ destination: 'tokens.ts', format: 'javascript/es6' }],
    },
  },
})
await sd.buildAllPlatforms()
// package.json: "tokens:build": "node design-system/tokens/build-tokens.mjs"
```

### 3.1 Foundations-Regeln aus `[FIL]`/`[BUD]` (in die Werte eingebaut)

- **Spacing:** Base Unit **4px**, **8pt-Soft-Grid** (Schritte primaer 8er-Vielfache; 4px/12px als feine Zwischenstufen erlaubt); begrenzte, **non-lineare** Skala (Increment waechst: 4,8,12,16,24,32,40,48,64,80,96); **keine** ungeraden Werte (3/5/7px → Pixel-Splitting). **Soft Grid** (Glossar §0.5): nur Abstaende liegen auf der Skala, nicht zwingend Komponenten-Eigengroessen. Web-Margins grosszuegig, Mobile-Margins 16–24px (safe space). `[FIL][BUD]`
- **Typo:** **ein** Sans-Serif-Typeface mit ≥4 Gewichten (400/500/600/700), grosse x-Hoehe; Body/Input **≥16px**; handgebaute Skala um Basis 16 (fein +/-2px bis 18, grob +4px bis 32, daruber +8/+12/+16), ~7–8 Stufen („the less the better"); keine Ratio-Formel. Script/Display/Handwritten **nie** fuer Body/UI; Serif nur fuer lange redaktionelle Inhalte. `[FIL][BUD]`
- **Line-height:** Body `round(size × 1.5…1.6)`; grosse Header kleiner (≈1.3 ab 24px, ≈1.1 ab 32px); bei gerader Font-Size gerade Line-Height. **Zeilenlaenge** Fliesstext ~50–75 Zeichen (`--reading-width`). Fliesstext **linksbuendig** (zentriert nur fuer kurze Bloecke). `[FIL]`
- **Farbe (rollenbasiert, NICHT starr 60-30-10):** Vier Rollen — **Primary** (Brand; nur Aktion/Focus/dominantes Element), optional **Secondary/Accent**, **Feedback** (success=gruen/warning=orange/danger=rot, immer **mit Icon/Text**, nie Farbe allein wegen Farbenblindheit), **Neutral** (aus Primary abgeleitet: Lightness hoch, Saturation ~20 = „cold greys"). Tint/Shade-Skala 50–900 (~+/-10% Lightness, in HSL); Primary/Neutral 9–10 Stufen, Feedback/Accent 5–6. **Kein** reines `#000000` fuer Text (stattdessen `#1F1F1F`-Grauton) und **kein** `#000` fuer Schatten (Palette-Grau). `[FIL][BUD]`
- **Kontrast:** WCAG 2.2 AA — Body ≥4.5:1, gross/UI ≥3:1; durchgefallene Paare durch dunkleren Text-Shade / helleren Hintergrund fixen, nie durch Pure-Black. `[FIL]`
- **Schatten:** hoher Blur, Opacity 5–10%, leicht erhoehtes Y, gefaerbt mit Palette-Grau — **nur** auf interaktiven/erhobenen Elementen (Button/Card), **nie** auf Text/nicht-klickbar/disabled; im Dark-Mode **keine** weissen Schatten (stattdessen hellerer Surface-Ton). `[FIL]`
- **Radius:** leichte Rundung statt 0 (freundlicher); Border per Inner-Stroke (`box-sizing: border-box`), damit Rahmen die Groesse nicht aufblaeht. `[FIL]`
- **Grid/Breakpoints:** 12-Spalten-Grid (teilbar durch 6/4/3/2; nie 5/7/11), Gutter ~12–16px, grosszuegige Margins; mobile-first; Reading-/Form-Container schmal. Werte als Tokens. `[FIL][BUD]`

### 3.2 `tokens.css` — vollstaendiges, kopierbares Geruest (Agent erweitert es)

```css
/* ============================================================
   design-system/tokens/tokens.css — SINGLE SOURCE OF TRUTH [BUD]
   (bei JSON-first: GENERIERT aus tokens.json — nicht von Hand editieren)
   Ebenen: 1) Primitive  2) Semantic  3) Component
   Naming: category-property-item-variant-state (kebab-case)
   ============================================================ */
:root {
  /* ---------- 1) PRIMITIVE / GLOBAL  ("what it is") ---------- */

  /* Neutral / Grayscale (HSL-Schritte, leicht entsaettigt = "cold greys") [FIL][BUD] */
  --neutral-0: #ffffff;
  --neutral-50: #f7f8fa;
  --neutral-100: #eef0f4;
  --neutral-200: #dfe3ea;
  --neutral-300: #c5ccd6;
  --neutral-400: #9aa3b2;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #343a45;
  --neutral-800: #22272f;
  --neutral-900: #1f1f1f; /* Text-Schwarz – NIE #000000 [FIL] */

  /* Primary (psychologie-/marken-basiert, vom Nutzer bestaetigen [§1.17]) — Tints/Shades 50-900 */
  --blue-50: #eef4ff;
  --blue-100: #d9e6ff;
  --blue-300: #7aa7ff;
  --blue-500: #2f6bff; /* Markenwert – PLATZHALTER, bestaetigen [§1.17] */
  --blue-700: #1f4fd1;
  --blue-900: #143a9e;

  /* Feedback-Farben (immer mit Icon/Text, nie Farbe allein) [FIL] */
  --green-500: #16a34a;
  --orange-500: #f59e0b;
  --red-500: #dc2626;

  /* Spacing: Base 4px, 8pt-Soft-Grid (8er-Vielfache + 4/12 fein), NON-LINEAR [FIL][BUD] */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Typo-Skala: Basis 16px, handgebaut (kein Ratio), ~7-8 Stufen [FIL][BUD] */
  --font-size-100: 0.75rem; /* 12 */
  --font-size-200: 0.875rem; /* 14 */
  --font-size-300: 1rem; /* 16 = Body, MIN */
  --font-size-400: 1.125rem; /* 18 */
  --font-size-500: 1.25rem; /* 20 */
  --font-size-600: 1.5rem; /* 24 */
  --font-size-700: 1.75rem; /* 28 */
  --font-size-800: 2rem; /* 32 */
  --font-size-900: 2.5rem; /* 40 */

  --line-height-tight: 1.1;
  --line-height-heading: 1.3;
  --line-height-body: 1.6;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Schrift: next/font setzt --font-sans; tokens.css referenziert NUR diese Variable [FIL] */
  --font-family-sans: var(--font-sans), system-ui, -apple-system, sans-serif;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Schatten: kein #000, Palette-Grau, niedrige Opacity, erhoehtes Y [FIL] */
  --shadow-1: 0 1px 2px rgb(31 31 31 / 0.06), 0 1px 3px rgb(31 31 31 / 0.08);
  --shadow-2: 0 4px 12px rgb(31 31 31 / 0.1);
  --shadow-3: 0 12px 28px rgb(31 31 31 / 0.12);

  /* Grid / Breakpoints (12-Spalten) [FIL] */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --grid-columns: 12;
  --grid-gutter: 16px;
  --grid-max: 1240px;
  --z-base: 0;
  --z-dropdown: 1000;
  --z-sticky: 1100;
  --z-modal: 1300;
  --z-toast: 1400;

  /* Motion (prefers-reduced-motion respektieren, §Phase 5.4) */
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);

  /* Reading width / Tap target [FIL] */
  --reading-width: 68ch; /* 50-75ch Fliesstext */
  --tap-target-min: 44px; /* Mobile Mindest-Tap */

  /* ---------- 2) SEMANTIC / ALIAS  ("what it does") — rollenbasiert [FIL] ---------- */
  --color-bg: var(--neutral-0); /* hellstes Grau = Hintergrund */
  --color-bg-subtle: var(--neutral-50);
  --color-surface: var(--neutral-0);
  --color-fg: var(--neutral-900); /* dunkelstes Grau = Text */
  --color-fg-muted: var(--neutral-500);
  --color-border: var(--neutral-200);
  --color-action-primary: var(--blue-500); /* Primary NUR fuer Aktion/Focus */
  --color-action-primary-hover: var(--blue-700);
  --color-focus-ring: var(--blue-500);
  --color-success: var(--green-500);
  --color-warning: var(--orange-500);
  --color-danger: var(--red-500);

  --text-body: var(--font-size-300);
  --text-h1: var(--font-size-900);
  --text-h2: var(--font-size-800);
  --text-h3: var(--font-size-600);
  --space-section-gap: var(--space-20);
  --space-stack: var(--space-4);
  --shadow-raised: var(--shadow-1);
  --shadow-overlay: var(--shadow-3);

  /* ---------- 3) COMPONENT-SPECIFIC (erbt NUR von Semantic, isoliert je Komponente) ---------- */
  --button-primary-bg: var(--color-action-primary);
  --button-primary-bg-hover: var(--color-action-primary-hover);
  --button-primary-fg: var(--neutral-0);
  --button-radius: var(--radius-md);
  --button-padding-x: var(--space-8); /* ~32px Web [FIL] */
  --button-min-height: var(--tap-target-min);
  --card-bg: var(--color-surface);
  --card-padding: var(--space-6);
  --card-radius: var(--radius-lg);
  --card-shadow: var(--shadow-raised);
  --input-border: var(--color-border);
  --input-fg: var(--color-fg);
  --input-font-size: var(--font-size-300); /* >=16px [FIL] */
  --input-min-height: var(--tap-target-min);
}

/* Theming = NUR Semantic neu binden (gleiche Namen, andere Werte), KEINE Komponenten-Duplikate [BUD] */
[data-theme='dark'] {
  --color-bg: var(--neutral-900);
  --color-bg-subtle: var(--neutral-800);
  --color-surface: var(--neutral-800); /* hellerer Surface statt weisser Schatten [FIL] */
  --color-fg: var(--neutral-50);
  --color-fg-muted: var(--neutral-400); /* Secondary-Text im Dark Mode [FIL] */
  --color-border: var(--neutral-700);
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 0ms;
    --duration-base: 0ms;
  }
}
```

### 3.3 Tailwind-Mapping (falls Projekt Tailwind nutzt)

`tailwind.config.{js,ts}` speist `theme.extend` **ausschliesslich** aus diesen CSS-Variablen (`var(--token)`) — eine Quelle, kein Parallelwert. **Ausnahme Breakpoints:** CSS Custom Properties funktionieren **nicht** in `@media`-Bedingungen, deshalb stehen `screens` als px-Literale im Config und werden in tokens.css als `--breakpoint-*` gespiegelt — ein **bewusster** Parallelwert. Bei JSON-first (§3.0 B) generiert Style Dictionary **beide** Outputs aus einer Quelle; bei CSS-first die Duplizierung im Config-Kommentar als bewusst markieren. `[BUD][§]`

> **WICHTIG (Bestands-Refactor):** Marken-/Token-Werte gehoeren unter **`theme.extend`**, NICHT auf die Top-Level-`theme`-Keys. Top-Level-Keys (`theme.colors`, `theme.spacing`, …) **ersetzen** die Tailwind-Defaults vollstaendig und entfernen damit `transparent`, `current`, `inherit`, `white`, `black`, `shadow-none`, negative/`auto`-Spacings — das bricht in einer bestehenden Codebase verbreitete Utilities (`bg-transparent`, `border-transparent`, `text-current`, `shadow-none`) mitten im Refactor. Nur bei bewusstem Komplett-Override muessen diese explizit wieder aufgenommen werden.

```js
// tailwind.config.js — Token-Werte unter EXTEND (Defaults bleiben erhalten)
module.exports = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        fg: 'var(--color-fg)',
        'fg-muted': 'var(--color-fg-muted)',
        border: 'var(--color-border)',
        primary: 'var(--color-action-primary)',
        danger: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        'bg-subtle': 'var(--color-bg-subtle)', // noetig fuer hover:bg-bg-subtle (Secondary-Button §Phase 2)
        // transparent/current/inherit/white/black bleiben aus den Defaults erhalten
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
        12: 'var(--space-12)',
        16: 'var(--space-16)',
        20: 'var(--space-20)',
        24: 'var(--space-24)',
      },
      fontSize: {
        base: 'var(--font-size-300)',
        lg: 'var(--font-size-400)',
        xl: 'var(--font-size-500)',
        '2xl': 'var(--font-size-600)',
        '3xl': 'var(--font-size-800)',
        '4xl': 'var(--font-size-900)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        heading: 'var(--line-height-heading)',
        body: 'var(--line-height-body)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius-md)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      boxShadow: { 1: 'var(--shadow-1)', 2: 'var(--shadow-2)', 3: 'var(--shadow-3)' },
      maxWidth: { reading: 'var(--reading-width)', layout: 'var(--grid-max)' },
      screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
    },
  },
}
```

**Folge:** Arbitrary values mit **Hex/nackten px** (`p-[13px]`, `text-[15px]`, `bg-[#2f6bff]`) sind verboten — dafuer Skalen-Klassen. **Explizit erlaubt** ist `*-[var(--token)]` (z. B. `px-[var(--button-padding-x)]`, `min-h-[var(--button-min-height)]`) — das ist der **einzige** Weg, Component-Tokens in Tailwind zu konsumieren, und genau das nutzt die kanonische Button-Komponente (§Phase 2). Durchsetzen per Grep-Gate (§7, mit `var()`-Ausnahme) bzw. ESLint `no-arbitrary-value`, so konfiguriert, dass `[var(--…)]` erlaubt bleibt. Alternativ Component-Tokens ueber `@layer components`/CSS-Klassen statt Tailwind anbinden.

### 3.4 `tokens.ts` — typsichere Spiegelung (fuer Props/Logik)

Nur die Werte spiegeln, die JS/TS braucht (Varianten-Unions, Breakpoint-Zahlen). **Keine** Farb-/Spacing-Werte duplizieren, die schon CSS-Variablen sind — stattdessen die Variablennamen referenzieren. Bei JSON-first (§3.0 B) wird `tokens.ts` **generiert**.

```ts
// design-system/tokens/tokens.ts — nur Logik-relevante Spiegelung (CSS-first)
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 } as const
export type Breakpoint = keyof typeof breakpoints
export const buttonVariants = ['primary', 'secondary', 'tertiary'] as const
export type ButtonVariant = (typeof buttonVariants)[number]
export const sizes = ['sm', 'md', 'lg'] as const
export type Size = (typeof sizes)[number]
```

---

## 4. Phasenplan (Reihenfolge verbindlich — folgt dem roten Faden §0.3)

```
Phase 0  Audit, Baseline, Problem & FRUEHE Lo-Fi-Validierung   (messen, verstehen, billig testen)  [BEC][NOR][FRO]
Phase 1  Foundations / Design Tokens                           (das Fundament — foundational-first) [BUD][FIL][BEC]
Phase 2  Atomic-Restrukturierung & Inventory                   (Architektur)                        [FRO][BUD]
Phase 3  Visueller-Craft-Pass                                  (Wahrnehmung pro Komponente)         [FIL]
Phase 4  Grid, Layout & Responsiveness                         (Struktur der Flaeche)               [FIL]
Phase 5  A11y, Humanity-Centered & Sustainability              (Zugang, Ehrlichkeit, Energie)       [NOR][BEC]
Phase 6  UX-Validierung: States, Content, Maturity, Resilienz  (Fail fast, alle Zustaende)          [BEC][NOR]
Phase 7  Doku, Pattern Library & Governance                    (System dauerhaft am Leben halten)   [BUD][FRO]
```

Abhaengigkeit: `0 → 1 → 2 → {3,4} → 5 → 6 → 7`. Phasen 3 und 4 koennen **pro Komponente** verschraenkt laufen (vertikales Iterieren §Phase 2 statt „erst alle Atoms").

**Fidelity-Treppe (durchgehend) `[BEC]`:** Grosse Struktur-/Flow-Aenderungen erst **roh** validieren (Outline/Wireframe = Lo-Fi), dann Mid-Fi (Typo-Hierarchie, Icons, begrenzte Farbe, Spacing-System), dann Hi-Fi (finale Microcopy/Bilder/Animation — **nur Politur, keine strukturellen Umbauten**). Eine Stufe wird erst verlassen, wenn verifiziert. PRs der Hi-Stufe beruehren keine Routing-/Datenfluss-/JSX-Struktur.

**Fail-fast-Schleife (frueh + spaet) `[BEC]`:** Nutzervalidierung findet **zweimal** statt: (1) **frueh in Phase 0** auf Lo-Fi/Outline-Ebene fuer groessere Flow-Aenderungen, **bevor** Phase-2-Code entsteht (billig scheitern); (2) **in Phase 6** zur Verifikation der finalen Loesung. Validierung erst am Ende waere „zu spaet". Risikoreiche Varianten laufen hinter Feature-Flag (`lib/flags.ts`, §1.17) und werden zuerst fuer ein kleines Subset ausgerollt (Searcher statt Planner).

---

### Phase 0 — Audit, Baseline, Problemdefinition & fruehe Lo-Fi-Validierung `[BEC]` `[NOR]` `[FRO]`

> Erst verstehen, messen, das Problem definieren und billig validieren — dann gestalten. „Fail fast" braucht einen Nullpunkt; „sharpen the axe first". `[BEC]`

**Anweisungen**

1. **Interface Inventory** `[FRO]` in `docs/interface-inventory.md`: das Repo nach **allen einzigartigen** UI-Patterns scannen (je Pattern **eine** Instanz mit Dateipfad + JSX-Snippet) und nach den **16 Kategorien** gruppieren: Global elements · Navigation · Image types · Icons · Forms · Buttons · Headings · Blocks · Lists · Interactive components · Media · Third-party · Advertising · Messaging · Colors · Animation. **Dig deep:** auch `not-found.tsx`, `error.tsx`, `loading.tsx`, Legal-/FAQ-Seiten erfassen. Duplikate (z. B. 37 Button-Stile) sichtbar nebeneinanderstellen.
2. **Komponenten-Inventar & Naming-Map** als Tabelle in `REFACTOR-LOG.md`: Datei · Zweck · kuenftige Atomic-Ebene · Duplikat-von? · alter Name(n) → **struktur-/content-agnostischer** Zielname (§Phase 2.7). Naming-Map in `docs/design-system/PATTERNS.md`.
3. **Werte-Audit** `[BUD]`: alle hartkodierten Hex-Farben, `px`-Spacings, Font-Sizes, Radii, Shadows per ripgrep **zaehlen** (`--count-matches`, §7) → Token-Migrations-Liste.
4. **Tooling-Inventar** `[§]`: pruefen, welche `package.json`-Scripts existieren (`build`, `typecheck`, `lint`, `test`, `build-storybook`). Fehlende anlegen (`typecheck` = `tsc --noEmit`; `lint` = `eslint .` mit `eslint-plugin-jsx-a11y` + `eslint-plugin-boundaries`, §2.4) **oder** in allen folgenden Checks die `npx`-Fallbacks verwenden. Ergebnis ins Log.
5. **Problem-Statements** `[BEC]` in `docs/ux/problem-statements.md`, je App-Router-Segment, **v2-Template (kundenfokussiert):** _„Wenn es um (Situation/Kundentyp) geht, braucht (Nutzer) einen Weg (Job/Problem), sodass (Nutzer-Outcome) und (Business-Ziel) erreicht werden."_ (v1-Template _„(Rolle, Name, Alter) feels … needs to … but is dealing with …"_ ist als Variante zulaessig.) **Akzeptanzkriterien** des Refactorings werden direkt aus dem Statement abgeleitet, nicht aus technischen Diffs. Kein Struktur-Refactoring vor seinem Statement.
6. **(Proto-)Personas & Issue-Stories** `[NOR][BEC]`: 2–4 **Proto-Personas** in `docs/personas/<name>.md` mit **vier Quadranten** (Demografie · Verhalten · Werte/Ziele/Motivationen · Needs/Pain Points), explizit als **„assumption / unvalidated"** markiert. Pro Hauptproblem eine **humanisierte 3-Akt-Story** (Name + Situation → Reibung → gewuenschtes Ergebnis). Je Persona ein **narratives Akzeptanzkriterium**: _„Als <Persona> kann ich <Ziel> erreichen, ohne <Reibung>."_ (§1.14).
7. **User Insights (Mad-Libs, loesungsfrei)** `[BEC]` in `docs/ux/insights.md`: _„[Persona] needs to [need] because of [ueberraschender Insight]."_ Das Insight darf **kein** Loesungsverb enthalten (kein „button/redesign/add"); aus einem Insight mehrere moegliche Loesungen ableiten. Versioniert/lebend halten.
8. **Research konsumierbar machen** `[BEC]` in `docs/ux/research-summary.md`: Executive Summary + getaggte Quote-Cluster statt Rohtranskripte; Komponenten verweisen per Kommentar auf die belegende Insight/Quote.
9. **Baseline-Screenshots** der Hauptseiten bei sm/md/lg/xl sichern (Vergleichsbasis §1.6) — Playwright-Skript §7.4.
10. **Baseline-Metriken** ins Log: Lighthouse (Performance/A11y/Best-Practices/SEO), axe-Verstoesse, **First-Load-JS/Bundle-Groessen pro Route** (`next build`), `typecheck`/`lint`-Fehlerzahl, ungenutzte Deps/Exports/Files (`depcheck`/`ts-prune`/`knip`), zirkulaere Importe (`madge --circular`). (Lighthouse-Scores sind **interne** Eng.-Metriken, nicht nutzersichtbar — Abgrenzung §Phase 5.7.)
11. **Analytics-/Metrik-Audit** `[NOR]`: bestehende GTM/GA4-Events listen; **Vanity-Metriken** (Pageviews, Verweildauer, rohe Klicks, Bounce) markieren — werden in Phase 5/6 durch **Outcome-Events** ersetzt. Pruefen, ob ein opaker Aggregat-„Score" in nutzersichtbaren UIs existiert (→ §Phase 5.7).
12. **Tech-Bestandsaufnahme:** Styling (CSS Modules/Tailwind/styled?), Router (App/Pages), TS ja/nein, vorhandene Tests/Storybook, **bestehende Datenvertraege/APIs** (foundational-first §1.3: Schema klaeren, bevor finales UI darauf baut).
13. **Fruehe Lo-Fi-Validierung** `[BEC]`: fuer jede groessere geplante Flow-/Struktur-Aenderung ein Outline/Wireframe erstellen und **mit mind. einem echten beabsichtigten Nutzer** (nicht Team/Freunde/Stakeholder) gegenpruefen, **bevor** Phase 2 Code umbaut. Ergebnis + offene Hypothesen in `insights.md`. Kleine, rein technische Refactorings sind ausgenommen.
14. **Backlog priorisieren** `[BEC][FRO]` in `docs/REFACTOR_BACKLOG.md`: Optionen gruppieren (Performance/A11y/IA/Visuals), strikt nach Impact/Feasibility ordnen (High/High zuerst), je Pattern eine Entscheidung **KEEP / MERGE-INTO(<kanonisch>) / DROP**. Ein PR = ein priorisiertes Thema (Backlog-ID).
15. **Rollback-Punkt** `[§]`: `git tag pre-refactor-baseline` (§1.4).

**Definition of Done**

- [ ] `docs/interface-inventory.md` deckt alle 16 Kategorien (leer = explizit „keine") inkl. `not-found/error/loading` ab; Duplikate markiert.
- [ ] Komponenten-Inventar + Naming-Map (`PATTERNS.md`) vollstaendig.
- [ ] Zaehler fuer hartkodierte Werte (Farbe/Spacing/Typo/Radius/Shadow) dokumentiert (`--count-matches`).
- [ ] Tooling-Inventar im Log; fehlende Scripts angelegt oder Fallbacks festgelegt.
- [ ] `problem-statements.md` (v2) deckt jedes Segment ab; `personas/*` (4 Quadranten, „assumption"), 3-Akt-Stories, narrative Akzeptanzkriterien, loesungsfreie Insights, `research-summary.md` vorhanden.
- [ ] Baseline-Screenshots (sm/md/lg/xl) + Metriken (Lighthouse/axe/Bundle pro Route/Deps/`madge`) abgelegt.
- [ ] Vanity-Metriken markiert; etwaiger Aggregat-Score erfasst; Datenvertraege dokumentiert.
- [ ] Fuer groessere Flow-Aenderungen: Lo-Fi-Validierung mit echtem Nutzer protokolliert.
- [ ] `REFACTOR_BACKLOG.md` priorisiert mit KEEP/MERGE/DROP; `git tag pre-refactor-baseline` gesetzt.

**Verifikation**

```bash
# hartkodierte Werte ZAEHLEN (echte Treffer, nicht Zeilen) — Mess-Norm §7
rg --count-matches "#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b" src   # Hex (inkl. RGBA)
rg --count-matches "\b[0-9]+px\b" src                  # Pixelwerte
rg -l "<button|<input|<a " src | wc -l                 # Dateien mit nativen Elementen (Inventar)

# Tooling-Inventar
node -e "const s=require('./package.json').scripts||{}; for (const k of ['build','typecheck','lint','test','build-storybook']) console.log(k, k in s ? 'OK' : 'FEHLT')"

# Baseline-Metriken (Server-Start fuer URL-Audits siehe §7 'Audit-Server-Probe')
npx next build                                  # First-Load-JS / Route-Sizes notieren
npx depcheck ; npx knip || npx ts-prune ; npx madge --circular src   # ungenutzte Deps/Exports/Files/Zyklen

# Belege existieren
test -f docs/interface-inventory.md && test -f docs/REFACTOR_BACKLOG.md \
  && test -f docs/ux/problem-statements.md && test -f docs/ux/insights.md \
  && ls docs/personas/*.md >/dev/null 2>&1 && echo OK
git tag | rg -q '^pre-refactor-baseline$' && echo "Rollback-Tag OK"
```

---

### Phase 1 — Foundations / Design Tokens `[BUD]` `[FIL]` `[BEC]`

> Ohne Tokens ist jede spaetere Politur Flickwerk. Foundations sind die unterste Schicht — **foundational-first** (§1.3), damit nachgelagerte Arbeit nicht blockiert. `[BUD][BEC]`

**Anweisungen**

1. `design-system/tokens/tokens.css` nach dem 3-Ebenen-Modell (§3.2) **vollstaendig** anlegen: Grayscale (9–10 Stufen, „cold greys"), Primary/optional Secondary mit Tints/Shades (50–900, HSL), Feedback-Farben (5–6 Stufen), **8pt-Soft-Grid-Spacing** (Base 4px, non-linear, begrenzt), **handgebaute Typo-Skala** (~7–8 Stufen, Basis 16, Body ≥16px), Line-Heights, Radii, Shadows (kein `#000`), Grid/Breakpoints, Z-Index, Motion, Reading-Width, Tap-Target. `[FIL][BUD]`
2. **Semantic-Layer rollenbasiert** definieren (`--color-bg`=hellstes Grau, `--color-fg`=dunkelstes Grau, `--color-action-*`=Primary nur fuer Aktion/Focus, `--text-h1…h3/-body`, `--space-section-gap`, `--shadow-raised/-overlay`). `[BUD][FIL]`
3. **Component-Layer** initial fuer den **Button** anlegen (Startkomponente §2.1), erbt **nur** von Semantic; je Komponente isoliert (§3-Regeln). Tokens nur ab ≥3 Verwendungen (One-off-Regel §1.20).
4. **Naming-Convention** durchsetzen: `category-property-item-variant-state`; in `tokens/README.md` dokumentieren samt „wie fuege ich einen Token hinzu" (§1.20) **und** gewaehltem Pipeline-Setup (CSS-first vs. JSON-first §3.0). `[BUD]`
5. **Theming** ueber `[data-theme="dark"]` realisieren — **nur Semantic neu binden** (identische Namen, andere Werte), keine Komponenten-Duplikate. Dark-Mode: hellerer Surface statt weisser Schatten; `--neutral-400` fuer Secondary-Text. Theme SSR-sicher per `data-theme` am `<html>` setzen (Inline-Script vor Hydration, kein FOUC/Flash); `prefers-color-scheme` als Default. `[BUD][FIL]`
6. `tokens.ts` als typsichere Spiegelung anlegen (nur Werte fuer JS/Props; bei JSON-first generiert).
7. `globals.css` importiert `tokens.css`; CSS-Reset + Basistypografie (`body` nutzt `--text-body`, `--line-height-body`, `--font-family-sans`). Schrift via **`next/font`** in `app/layout.tsx` laden und dessen CSS-Variable als `--font-sans` exponieren (`variable: '--font-sans'`); `tokens.css` referenziert nur `var(--font-sans)` (kein hartkodierter Familienname). Genau **ein** Typeface (zweiter Loader nur als bewusster Mono-/Fallback-Font). `[FIL]`
8. Markenwerte (Primaerfarbe, Schriftfamilie) **vom Nutzer bestaetigen** (§1.17), Platzhalter klar markieren.
9. Bei Tailwind: `theme.extend` aus den CSS-Variablen speisen (§3.3, **nicht** Top-Level-Override), arbitrary values verbieten.
10. `lib/flags.ts` (Feature-Flags) und `lib/metrics/{definitions,thresholds,aggregate}.ts` als Foundation-Stubs anlegen (von Phase 5/6 genutzt).

**`next/font`-Setup mit Anti-Flash-Inline-Script (kopierbar) `[FIL][BUD]`:**

```tsx
// src/app/layout.tsx — Server Component
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={sans.variable} suppressHydrationWarning>
      {/* Theme vor Hydration setzen → kein FOUC/Flash [BUD] */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.dataset.theme=(t||(m?'dark':'light'));}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

**Definition of Done**

- [ ] `tokens.css` deckt **alle** in Phase 0 gefundenen Wert-Kategorien ab; Skala non-linear, keine ungeraden Werte (3/5/7px).
- [ ] Drei Ebenen sauber: Component → nur Semantic, Semantic → nur Primitive; kein Component-Token zeigt auf Rohwert/Primitive.
- [ ] Token-Namen matchen die Convention; `tokens/README.md` inkl. Pipeline-Setup + One-off-Schwelle.
- [ ] Theming-Hook (`[data-theme]`) funktionsfaehig (Light/Dark teilen identische Variablennamen, kein FOUC); genau **ein** Typeface via `next/font`, exponiert als `--font-sans`; `tokens.css` referenziert die Variable.
- [ ] Body/Input-Font-Size ≥16px; kein reines `#000000`/`#000` (auch Space-Syntax) als Token-Wert.
- [ ] Bei Tailwind: Token-Werte unter `theme.extend`; Defaults (`transparent`/`current`/`shadow-none`) erhalten.
- [ ] `lib/flags.ts` + `lib/metrics/{definitions,thresholds,aggregate}.ts` als Stubs vorhanden.

**Verifikation**

```bash
npm run build && npm run typecheck && npm run lint        # gruen (sonst npx tsc --noEmit etc.)

# Token-Namen-Audit (Soll: alle matchen die Convention)
rg -n -- "--(color|space|font|line-height|radius|shadow|z|duration|grid|breakpoint)-[a-z0-9-]+\s*:" \
  src/design-system/tokens/tokens.css | head

# kein reines Schwarz fuer Text/Schatten (Komma- UND Space-Syntax) — Soll: leer (nur Grauton)
rg -ni "#000\b|#000000|rgb\(\s*0[ ,]+0[ ,]+0" src/design-system/tokens/tokens.css

# Light/Dark teilen identische Token-NAMEN (Mengengleichheit der dark-Bloecke pruefen — Teilmenge von :root)
# Hinweis: rg nutzt ohne -P die Rust-Regex-Engine OHNE Look-around -> Lookahead (?=) erfordert -P/--pcre2.
rg -oP -- "--color-[a-z0-9-]+(?=\s*:)" src/design-system/tokens/tokens.css | sort | uniq -c | sort -rn | head
# lookahead-frei (falls rg ohne pcre2 gebaut): rg -o -- "--color-[a-z0-9-]+\s*:" src/design-system/tokens/tokens.css

# genau ein Font-Loader-Aufruf (zweiter nur Mono/Fallback)
rg -n -o "(Inter|Roboto|Geist|[A-Z][a-zA-Z]+)\s*\(" -g '**/font*.*' -g '**/layout.tsx' src

# next/font setzt eine Variable; tokens.css referenziert sie
rg -n "variable:\s*'--font-sans'|var\(--font-sans\)" src

# Body >= 16px
rg -n "font-size-300:\s*1rem" src/design-system/tokens/tokens.css

# Tailwind: kein Top-Level-Override (Soll: 'theme: { extend:' vorhanden)
rg -n "theme:\s*\{\s*extend" tailwind.config.* 2>/dev/null
```

---

### Phase 2 — Atomic-Restrukturierung & Inventory-Konsolidierung `[FRO]` `[BUD]`

> Vom Seiten-Denken zum System-Denken: Atoms → Molecules → Organisms → Templates → Pages. „See something complex? Break it down." Atomic Design ist **nicht linear** — iteriere **vertikal pro Sektion** (gleichzeitig Atom/Molecule/Organism aus einer realen Seite extrahieren und sofort zurueck integrieren), nicht „erst alle Atoms". `[FRO][BUD]`

**Anweisungen (vertikal pro Sektion, aufsteigend in der Hierarchie)**

1. Jede Komponente aus dem Phase-0-Inventar einer Ebene zuordnen und in den Zielordner (§2) verschieben. Duplikate auf **je ein kanonisches** Atom/Molecule konsolidieren (Backlog-Entscheidung KEEP/MERGE/DROP); DROP-Items loeschen. `[FRO]`
2. **Atome zuerst**, beginnend mit **Button** `[BUD]`: minimale, explizite Props-API; Varianten ueber **orthogonale Props** (`variant`/`type`, `size`, `tone`, `iconLeft/iconRight/iconOnly`), **nicht** ueber Kopien. Variant-Auswahl ueber eine Variant-Map (cva/clsx-Lookup), nicht ueber tief verzweigte Inline-Conditions. **Alle States** als Properties: default/hover/focus-visible/active/disabled. Touch-Target ≥44px. `[FIL][BUD]`
3. **Molecules** aus Atomen komponieren unter **Single-Responsibility** `[FRO]` (z. B. `FormField = Label + Input + ErrorText`). Das Eingabe-**Atom** heisst `Input` (nicht `field`); das **Molecule** darf `FormField` heissen — Ebenenbezug beachten. Keine Logik duplizieren, die ein Atom schon kann.
4. **Organisms** (Header, Footer, Hero, Formularbloecke) aus Molecules/Atomen **und ggf. anderen Organismen** zusammensetzen (§2.2).
5. **Templates** als reine Layout-Gerueste mit Slots/`children` und **Content-Guardrails** (max. Zeichenlaengen via Typen/`zod .max`, fixe `aspect-ratio` fuer Bilder via `next/image width/height`, Pflicht-/Optional-Felder) — **kein** finaler Content, keine Inhalts-Literale. Datenbeschaffung (Server Components/`fetch` in `page.tsx`) strikt von der Layout-Struktur trennen. `[FRO]`
6. **Pages** (`app/**/page.tsx`) = Template + echte Daten.
7. **Kontext-/content-agnostische Namen** `[FRO]`: `HomepageCarousel → Carousel`, `ProductCard → Card`, `BlogHeroBanner → Banner`. Orts-/Inhalts-Praefixe aus Datei- und Komponentennamen entfernen (Naming-Map `PATTERNS.md`). „Make it agnostic."
8. **Industriestandard-Namen** `[BUD][FRO]`: `Dialog`, `Tooltip`, `Accordion`, `Input` (Open UI / Component Gallery als Referenz). Keine Eigenerfindungen. Synonym-Dubletten (`Hero` vs. `Banner` fuer dasselbe Modul) auf **einen** kanonischen Namen konsolidieren.
9. **Shared Vocabulary** `[FRO]`: einheitliche PascalCase-Komponenten, projektweit konsistente Prop-Namen (`disabled` statt mal `isDisabled`; eine Achse = ein Prop-Name, nicht mal `kind`/mal `type`/mal `style`). Synonyme eliminieren; in `PATTERNS.md`/`lineage.md` Naming-Map pflegen.
10. **Connect tokens** `[BUD]`: jede migrierte Komponente verdrahtet ausschliesslich Semantic-/Component-Tokens — kein Rohwert, kein Primitive direkt (§1.7).
11. **Pattern-Lineage** `[FRO]` in `docs/design-system/lineage.md` pflegen: pro Komponente **Uses:** (importierte Sub-Komponenten) und **Used-by:** (Verwendungsstellen, reproduzierbar via `rg -l "<X[ />]" app src`). Vor jeder Aenderung an einer geteilten Komponente die Used-by-Liste neu generieren und jede Stelle als QA-Aufgabe vermerken. Komponenten mit **leerer** Used-by-Liste = toter Code → DROP (Graveyard §1.18, Nachfrage §1.17).
12. **Server/Client bewusst trennen (§2.3):** `'use client'` nur, wo Interaktivitaet noetig (Blatt-nah); `error.tsx`/`global-error.tsx` behalten zwingend `'use client'`. Barrel-Export `design-system/index.ts` pflegen; App-Importe umstellen. **Holy Grail (§Phase 7.8):** genau **eine** Definition pro Komponente — Storybook und App importieren dieselbe Quelle, kein Copy-Paste-Klon.
13. **Keine Zirkular-Abhaengigkeiten / kein God-Module** `[NOR]`: Import-Graph pruefen (`madge --circular`); keine Komponente mit ueberproportional vielen eingehenden Kanten.

**Button-Atom (kopierbar, Referenz fuer alle Atome) `[FIL][BUD][NOR]`:**

```tsx
// src/design-system/core/button.tsx  — Atom, importiert NUR Tokens (via CSS Vars)
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef } from 'react'

const button = cva(
  // Basis: Tap-Target, Fokus sichtbar, Token-getrieben — keine Rohwerte
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold ' +
    'min-h-[var(--button-min-height)] px-[var(--button-padding-x)] text-base ' +
    'transition-colors duration-[var(--duration-base)] ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus-ring)] ' +
    'disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--button-primary-bg)] text-[var(--button-primary-fg)] hover:bg-[var(--button-primary-bg-hover)] shadow-1',
        secondary: 'border border-border text-fg bg-transparent hover:bg-bg-subtle', // line/ghost [FIL]
        tertiary: 'text-primary bg-transparent hover:underline px-2', // dezent [FIL]
      },
      size: { sm: 'text-sm min-h-[40px]', md: '', lg: 'text-lg' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={button({ variant, size, className })} {...props} />
  ),
)
Button.displayName = 'Button'
```

**FormField-Molecule (kopierbar) — A11y-Verknuepfung Pflicht `[BEC][NOR]`:**

```tsx
// src/design-system/compound/form-field.tsx — Molecule (Atom + Label + Error)
import { useId } from 'react'
import { Input } from '../core/input' // Atom
import { Label } from '../core/label' // Atom
import { Text } from '../core/text' // Atom

export function FormField({
  label,
  error,
  ...inputProps
}: { label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  const errId = `${id}-err`
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errId : undefined}
        {...inputProps}
      />
      {error && (
        <Text id={errId} role="alert" tone="danger">
          {error}
        </Text>
      )}
    </div>
  )
}
```

**Segment-`error.tsx` (kopierbar) — Resilienz + Klartext `[NOR][BEC]`:**

```tsx
'use client' // PFLICHT — Error Boundary mit reset() [§2.3]
import { Button } from '@/design-system/core/button'
import { useTranslations } from 'next-intl' // echte i18n-Resolution (Provider liefert request-locale), NICHT nur String-Externalisierung
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')
  // technische Details NUR server-seitig loggen, nie im UI [NOR]
  if (process.env.NODE_ENV !== 'production') console.error(error)
  return (
    <div role="alert" className="mx-auto max-w-reading p-8 text-center">
      <h1 className="text-2xl">{t('title')}</h1> {/* Klartext, kein Code */}
      <p className="text-fg-muted mt-2">{t('body')}</p>
      <Button onClick={reset} className="mt-6">
        {t('retry')}
      </Button>
    </div>
  )
}
```

> **i18n-Hinweis:** Ein statisches `messages`-Objekt waere reine **String-Externalisierung**, **keine** Lokalisierung. Echte i18n braucht eine Locale-Dimension (Route `[locale]`/Middleware aus Accept-Language/Cookie) + `next-intl` (`useTranslations` im Client, `getTranslations` server-seitig) + `Intl.*` fuer Zahlen/Daten/Namen (§1.12, §Phase 5.5–5.6). Da `error.tsx` eine Client-Boundary ist, liefert `NextIntlClientProvider` im Root-Layout die request-locale.

**Definition of Done**

- [ ] Jede UI-Komponente liegt in der korrekten Ebene (`core`/`compound`/`sections`/`feedback`/`templates`/`app`); keine verwaisten Ad-hoc-Komponenten.
- [ ] Import-Richtung strikt top-down auf **allen** Ebenen (maschinell via `eslint-plugin-boundaries` §2.4 gruen); **0** Zirkular-Abhaengigkeiten (`madge --circular`).
- [ ] Keine Duplikate; je Kategorie ein kanonisches Atom (Button/Card/Input konsolidiert); Variante via Prop, nicht Kopie; genau **eine** Definition pro Komponente (Holy Grail).
- [ ] Alle Namen struktur-/content-agnostisch + Industriestandard; Prop-Konventionen einheitlich (eine Achse = ein Prop-Name).
- [ ] `docs/design-system/lineage.md` (Uses/Used-by) vorhanden; tote Patterns (leere Used-by) in `GRAVEYARD.md`; `'use client'` minimal (Ausnahme `error.tsx`/`global-error.tsx`).
- [ ] Templates ohne Inhalts-Literale; Content-Guardrails (Zod-maxLength / Bild-`aspect-ratio`) vorhanden.

**Verifikation**

```bash
npm run build && npm run typecheck && npm run lint        # lint enthaelt boundaries-Regel (§2.4)
npx madge --circular src                                  # Soll: keine Zyklen

# Import-Richtung pro Ebene (kein Treffer = gut) — zusaetzlich zur ESLint-Regel
rg -n "from .*(compound|sections|templates)" src/design-system/core      && echo "VERSTOSS: Atom"
rg -n "from .*(sections|templates)"          src/design-system/compound  && echo "VERSTOSS: Molecule"
rg -n "from .*templates"                      src/design-system/sections  && echo "VERSTOSS: Organism"

# orts-/content-spezifische Namen entfernt (kein Treffer = gut)
rg -ni "homepage(Carousel|Banner)|productCard|blogHero" src

# genau EINE Definition pro Komponente (Holy Grail) — Beispiel Button
rg -c "export (default )?function Button|const Button\s*=" src | rg -v "\.stories\.|\.test\." | wc -l

# Templates ohne Inhalts-Literale (lange Satz-Strings) — Soll: leer
rg -n ">[A-Z][a-z].{15,}<" src/templates -g '*.tsx'

# 'use client' bewusst & minimal (error/global-error-Treffer erlaubt)
rg -n "use client" src/design-system
```

---

### Phase 3 — Visueller-Craft-Pass `[FIL]`

> Gutes UI = **Usability + Delightfulness** (Usability ist Minimum, Delight vertreibt sonst Nutzer). „The best interface is no interface" — vereinfachen ist Default. „Wenn alles heraussticht, sticht nichts heraus." `[FIL]`

**Anweisungen (visuelle Hierarchie in dieser Prioritaet)**

1. **Genau EIN dominantes Element pro View** (meist der primaere CTA): groesste Groesse **+** solide Primary-Farbe **+** Vordergrund/Erhebung **+** obere/linke Position gebuendelt; konkurrierende Akzente auf Line-/Ghost-Style zuruecknehmen. Kein zweites Element traegt dieselbe Signal-Kombination. „Squint-Test" (per `getComputedStyle`/Unschaerfe): beim Unscharfstellen sticht genau **ein** Element hervor. `[FIL]`
2. **Groesse** — Wichtiges groesser; konsequente Typo-Skala statt Zufallsgroessen; H1 und primaerer CTA messbar groesser als Sekundaeres. `[FIL]`
3. **Farbe/Kontrast — rollenbasiert** `[FIL]`: Farben per **Rolle** (Background=hellstes Grau, Text=dunkelstes Grau, Primary nur fuer Aktion/Focus/dominantes Element), **KEINE starre 60-30-10-Regel**. Hoechstens **ein** voll eingefaerbter Primary-Button pro Viewport-Sektion; sekundaere Aktionen = neutral/ghost/outline. Text-Kontrast ≥ WCAG AA (4.5:1 Body, 3:1 gross/UI). Hintergruende weich/hell (figure-ground); Bild-Hintergruende mit Text immer mit Overlay; kein knalliges Vollbild als Content-Background.
4. **Position & Proximity** — Wichtiges oben/links (logische CSS-Properties `margin-inline-start`/`text-align: start` fuer RTL-Faehigkeit §1.12); Zusammengehoeriges enger (intra-group-Abstand < inter-group-Abstand), Gruppen klar getrennt (`--space-*`). `[FIL]`
5. **Alignment** — alles am Grid/an gemeinsamen Kanten ausrichten; keine schwebenden/asymmetrischen Ausreisser. `[FIL]`
6. **Common Region & Figure-Ground** — zusammengehoerige Inhalte in **eine** Card/Section mit gemeinsamem Hintergrund/Rahmen kapseln; Vordergrund = interaktiv (Schatten/Erhebung), Hintergrund weich/hell; Text-ueber-Bild immer mit Overlay. `[FIL]`
7. **Typografie** `[FIL]`: ein Typeface; Hierarchie ueber Groesse **und** Gewicht (beim Pairing ein/zwei Gewichte ueberspringen: Regular Body → Bold Header, **nicht** Medium); **Light-Gewichte (100/200/300) fuer kleinen Text verboten**; Body ≥16px; Zeilenlaenge `--reading-width` (50–75ch); Fliesstext **linksbuendig** (zentriert nur kurze Bloecke); `line-height` aus Tokens (Body ~1.5–1.6, Header kleiner).
8. **Buttons** in Varianten primary/secondary/tertiary `[FIL]`: CTA solide+groesst (optional Schatten), Secondary line/dezent, Tertiary klein/dezent; **alle** States `:hover/:active/:focus-visible/:disabled` (disabled ohne Schatten); Mindesthoehe 40–60px, Tap-Ziel ≥44×44px (auch Icon-Buttons/Text-Links per Padding), Web-Padding-x ~32px, Button-Text 16px (nie <13px), **ein** gemeinsamer Radius-Token.
9. **Schatten/Radius/Border** `[FIL]`: weiche Schatten (Blur hoch, Opacity 5–10%, Palette-Grau) **nur** auf interaktiven/erhobenen Elementen; **nie** auf Text/disabled; Dark-Mode keine weissen Schatten; leichte Radien statt 0; Border per Inner-Stroke.
10. Alle visuellen Werte ausschliesslich aus Tokens (§1.7, Allowlist §1.19).

**Definition of Done**

- [ ] Jede Seite hat genau **ein** dominantes Element/CTA pro View; Farben rollenbasiert, keine 60-30-10-Starrheit; max. ein Primary-Button pro Sektion.
- [ ] Alle Texte folgen der Typo-Skala; keine Ad-hoc-`font-size`; Body ≥16px; Fliesstext linksbuendig + begrenzte Breite; kein Light-Gewicht fuer kleinen Text; Header-Body-Gewichtsdifferenz ≥2 Stufen.
- [ ] Alle interaktiven Atome haben sichtbare hover/**focus-visible**/active/disabled-States.
- [ ] Schatten nur auf interaktiven/erhobenen Elementen; keine weissen Schatten im Dark-Mode; disabled ohne Schatten.
- [ ] Keine hartkodierten visuellen Werte mehr (Grep = 0 ausserhalb Token-Quelldateien, §1.19).

**Verifikation**

```bash
# hartkodierte Werte nur noch in Token-Quelldateien (Soll: 0 in Komponenten) — Allowlist §1.19
rg -n "#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b|\b[0-9]+px\b" \
  src/design-system --glob '!**/tokens.json' --glob '!**/tokens.css' --glob '!**/tokens.ts' --glob '!**/tailwind.config.*'

# Button-States vorhanden
rg -n "hover:|active:|disabled:|focus-visible:" src/design-system/core

# Light-Gewicht fuer kleinen Text (Soll: leer) — CSS-Wert UND Tailwind-Utilities UND Props
rg -ni "font-(thin|extralight|light)\b|font-weight\s*:?\s*(100|200|300)|fontWeight[=:]\s*[\"{]?(100|200|300)|weight=[\"']light" src/design-system

# Tap-Ziel / Reading-Width
rg -n "min-h|min-w|tap-target|button-min-height" src/design-system/core
rg -n "max-w-reading|reading-width" src/design-system

# Kontraste (Server vorher starten, §7 Audit-Server-Probe)
npx @axe-core/cli "$URL" --tags wcag2aa
```

---

### Phase 4 — Grid, Layout & Responsiveness `[FIL]`

> Grids geben Struktur, Klarheit und Responsiveness. **Soft Grid** (§0.5): nur Abstaende liegen auf der Skala. `[FIL]`

**Anweisungen**

1. **8pt-Soft-Grid** durchsetzen: alle Margins/Paddings/Gaps = `--space-*`; **keine** arbitrary Pixelwerte; Komponenten-Eigengroessen duerfen inhaltsabhaengig sein (`w-fit`/`w-full`/auto). `[FIL][BUD]`
2. **Spalten-Grid** (meist **12 Spalten**, teilbar durch 6/4/3/2; **nie** 5/7/11; Gutter ~12–16px, Margins grosszuegig; Layout-Region `--grid-max` ~1240px) als Layout-Atom `Grid`/`Container` (`primitives-layout/`) kapseln; Seiten nutzen es statt Ad-hoc-Flex/Margin. `col-span`-Werte teilen 12 sauber. `[FIL]`
3. **Fluid vs. Fixed Grid** bewusst: Marketing-/Content-Sektionen = `max-width: var(--grid-max)` + Fluid (`1fr`-Spalten, fixe gap); **Formulare und Artikel-Lesetexte = schmaler Fixed-Container** (`max-w-reading` + `mx-auto`, nie volle Breite). Header/Footer/Full-Bleed = Hybrid (volle Breite), Content im Container. `[FIL]`
4. **Layout-Primitives** `Stack`/`Cluster`/`Container` fuer konsistente Abstaende; Layout-Logik aus Organismen in **Templates** ziehen (Organismen breakpoint-agnostisch, wo moeglich).
5. **Responsive** Mobile-First an Token-Breakpoints (sm 640 / md 768 / lg 1024 / xl 1280); `grid-cols-12` kollabiert responsiv (`grid-cols-4 md:grid-cols-8 lg:grid-cols-12`); **keine** Horizontal-Scrollbars; mobile Seitenmargins 16–24px als Safe-Space (kein Content darin); Touch-Ziele ≥44×44px.

**Container-Primitive (kopierbar) `[FIL]`:**

```tsx
// src/design-system/primitives-layout/container.tsx — Layout-Atom (nur Token)
export function Container({
  variant = 'layout',
  className = '',
  ...p
}: { variant?: 'layout' | 'reading' } & React.HTMLAttributes<HTMLDivElement>) {
  const max = variant === 'reading' ? 'max-w-reading' : 'max-w-layout'
  return <div className={`mx-auto w-full px-4 md:px-8 lg:px-20 ${max} ${className}`} {...p} />
}
```

**Definition of Done**

- [ ] Konsistentes Grid/Container-System; keine wilden margin/padding-Pixelwerte; `col-span` teilt 12 sauber.
- [ ] Formulare/Artikel in schmalem Fixed-Container (Reading-Width), nicht voller Breite.
- [ ] Alle Hauptseiten bei sm/md/lg/xl ohne Layout-Bruch & ohne Horizontal-Scroll; mobile Safe-Space-Margins 16–24px; Touch-Ziele ≥44px.

**Verifikation**

```bash
# Pixel-Abstaende ausserhalb der Skala (Soll: leer) — Allowlist §1.19
rg -n "(margin|padding|gap)\s*:\s*[0-9]+px" src --type css --glob '!**/tokens.css' | rg -v "var\(--space"
rg -nP "\b[pm][trblxy]?-\[(?!var\()" src   # Tailwind arbitrary spacing mit Hex/px (var(--token) erlaubt; Soll: leer; -P=pcre2)

# col-span teilt 12 (Soll: leer — keine 5/7/11-Spannweiten)
rg -n "col-span-(5|7|11)\b" src

# 12-Spalten responsiv + Reading-Container fuer Forms/Artikel
rg -n "grid-cols-(1|2|4|8|12)" src
rg -n "max-w-reading|max-width:\s*var\(--reading-width" src

# Responsiv-Screenshots sm/md/lg/xl gegen Baseline + Overflow-Check (Playwright §7.4)
```

---

### Phase 5 — A11y, Humanity-Centered & Sustainability `[NOR]` `[BEC]`

> Design dient echten Menschen — dem ganzen Oekosystem, ehrlich und nachhaltig. Zugaenglichkeit ist Kern, nicht Kuer; „nicht zugaenglich = nicht nutzbar" (Moebius). Abfall ist ein Designfehler; jedes ueberfluessige KB heizt den Planeten. `[BEC][NOR]`
>
> **Maturity-Reihenfolge (bottom-up `[BEC]`):** zuerst Usability/Funktion absichern → dann **Accessibility als Pflichtschicht** → erst danach Delight. **Keine** Delight-Features (Confetti/Parallax), solange A11y-Defekte offen sind.

**Anweisungen**

1. **Semantisches HTML** `[BEC]`: `button`/`a`/`nav`/`main`/`header`/`footer`/korrekte Heading-Hierarchie; **keine** `div`-Buttons (kein `onClick` auf nacktem `<div>` ohne `role`/`tabIndex`); Skip-Link. `alt`-Texte und Labels ergaenzen.
2. **Tastatur** `[BEC]`: alles fokussierbar/bedienbar, logische Tab-Reihenfolge, **sichtbarer** `:focus-visible`-Ring (`--color-focus-ring`), keine Hover-only-Interaktionen; Modals mit erreichbarem Close/Cancel (Esc/Backdrop); primaere Aktionen in Daumen-/Einhand-Reichweite. `[NOR]`
3. **ARIA nur wo noetig**, Labels fuer alle Inputs, `alt`-Texte, Formfehler programmatisch verknuepft (`aria-describedby`/`role="alert"`), `aria-busy` an Loading-Regionen. `[BEC]`
4. **Kontrast WCAG 2.2 AA**; `prefers-reduced-motion` respektieren (Tokens setzen Dauer auf 0, §3.2); `prefers-color-scheme` als Theme-Default (§Phase 1.5).
5. **Kein WEIRD-Bias / ganzes Oekosystem** `[NOR]` (§1.12): i18n vorbereiten (`<html lang>`, `messages/` zentral, keine in Code eingebetteten Sprachannahmen); Locale aus Accept-Language/Cookie ableiten (nicht stilles `en`); Datum/Zahl/Waehrung via `Intl.*` mit request-locale (kein festes `en-US`/nacktes `toLocaleString()`); **ein** `fullName`-Feld statt erzwungenem first/last; kulturneutrale Beispiele/Namen/Farben; Tauglichkeit auf langsamen Netzen/kleinen Geraeten pruefen.
6. **Verstaendliche Sprache** `[NOR]` (§1.11): alle nutzersichtbaren Strings nach `messages/` zentralisieren, gruppiert nach Szenario (success/error/empty/destructive); Jargon/ALL-CAPS-Rechtstexte eliminieren; Fehlermeldungen in Klartext + konkretem Loesungsvorschlag, ohne rohe Codes/Stacktraces; **Voice konstant, Tone szenarioabhaengig** (ernster bei Fehlern/Geld als bei Marketing). Gegen eine Persona auf Lesbarkeit pruefen.
7. **Ehrliche Metriken + Stories** `[NOR]` (§1.14): Vanity-Events durch **Outcome-Events** ersetzen (Formular abgeschlossen, Aufgabe erledigt). Pro Event in `lib/metrics/definitions.ts` ein typisiertes Objekt `{name, hypothesis, whatItProxies, validityCaveat, scaleType, story}` (scaleType: ratio/interval/ordinal). **Aggregation:** ordinale Daten → **Median**, nicht arithmetisches Mittel (`lib/metrics/aggregate.ts` + Test). **Keine** Mischung heterogener Dimensionen zu **einem** Score in **nutzersichtbaren** Status-UIs — qualitativer Ueberblick (gut/Achtung/Problem, `StatusBadge` gegen `thresholds.ts`) + progressive disclosure (exakte Zahl erst im Tooltip/Detail). Mind. **eine** subjektive Qualitaetsmetrik (Zufriedenheit/erlebter Erfolg) gleichberechtigt neben technischen/Conversion-Metriken. _(Interne Build-/QA-Metriken wie Lighthouse sind ausgenommen — kein Nutzer-Dashboard.)_
8. **Sustainability/Performance = Circular Design** `[NOR]` (§1.8): ungenutzte Deps/Dead Code/verwaiste Routen/ungenutztes CSS entfernen (`knip`/`ts-prune`/`depcheck` = 0; doppelte npm-Pakete via `npm ls`/dedupe = 0); `next/dynamic` & `dynamic import()` fuer schwere/Below-the-fold-Client-Komponenten; Bilder via `next/image` (AVIF/WebP, responsive `sizes`, `priority` nur fuer LCP, sonst lazy); `next/font` statt Web-Font-Requests; Server Components als Default; aggressives Caching (`fetch`-cache/`revalidate`/static where possible). First-Load-JS/Route gegen Phase-0-Baseline; Bundle-Budget als CI-Gate, < ~100 KB gz pro Route anstreben. Jedes ueberfluessige KB = Designfehler.
9. **Resilienz/lose Kopplung** `[NOR]` (§1.9): pro Route-Segment `error.tsx` (mit `reset()`, `'use client'`) + `loading.tsx` (Suspense-Skeleton) + `not-found.tsx`; Root zusaetzlich `global-error.tsx`; jeder externe Fetch defensiv (try/catch + Fallback-UI + Timeout/Retry/`revalidate`); Drittanbieter-SDKs hinter `lib/`-Adapter. Progressive Enhancement: Kerninhalt server-gerendert, bei deaktiviertem/fehlgeschlagenem JS nutzbar.
10. **Selbstbeobachtung (second-order)** `[NOR]`: `error.tsx`/`global-error.tsx` melden an Monitoring (`captureException`/strukturiertes Logging, technische Details nur serverseitig); Web-Vitals via `useReportWebVitals`; CI-Health-Check + Bundle/Lighthouse-Budget-Gate, das bei Regression rot wird.

**Definition of Done**

- [ ] **0** kritische axe-Verstoesse auf allen Hauptseiten; voll tastaturbedienbar; Fokus immer sichtbar; Lighthouse-A11y ≥95.
- [ ] WCAG 2.2 AA-Kontraste erfuellt; `prefers-reduced-motion` + `prefers-color-scheme` umgesetzt.
- [ ] i18n/Lokalisierung vorbereitet (`<html lang>`, `Intl.*` mit request-locale, `fullName`); keine WEIRD-Hardcodings.
- [ ] Alle nutzersichtbaren Strings in `messages/`; kein ALL-CAPS-Rechtstext/Jargon; Fehlermeldungen Klartext + Loesung; Voice/Tone dokumentiert.
- [ ] Analytics = Outcome-Events mit `definitions.ts` (whatItProxies/validityCaveat/story/scaleType); ordinal→Median (Test gruen); ≥1 subjektive Qualitaetsmetrik; **kein** Aggregat-Score in nutzersichtbaren Status-UIs.
- [ ] Dark-Pattern-Checkliste je Flow gruen (Opt-out=Opt-in, default-unchecked, abbrechbar, Undo, kein erzwungenes Signup vor Mehrwert, keine Countdowns).
- [ ] **Kein toter Code/Deps** (`knip`/`ts-prune`/`depcheck` = 0; keine npm-Duplikate); `next/image`+`dynamic`+`next/font` genutzt; First-Load-JS/Route nicht ueber Baseline **ohne dokumentierte Begruendung**.
- [ ] Jede Route hat `error.tsx`+`loading.tsx`+`not-found.tsx` (Root zusaetzlich `global-error.tsx`); externer Ausfall degradiert nur sein Segment; Monitoring + Web-Vitals in Boundaries gemeldet.

**Verifikation**

```bash
# URL-Audits (Server zuerst starten, §7 'Audit-Server-Probe')
npx @axe-core/cli "$URL" --tags wcag2a,wcag2aa            # Soll: 0 violations
npx lighthouse "$URL" --only-categories=accessibility,performance --output=json --output-path=lh.json
# A11y-Score-Gate maschinell asserten (macht DoD "≥95" belegbar; Soll: Exit 0):
node -e "const r=require('./lh.json');const a=r.categories.accessibility.score;process.exit(a>=0.95?0:(console.error('A11y',a),1))"

# UI-State-Dateien je Segment + global-error
fd -e tsx '(loading|error|not-found|global-error)' src/app

# div-Button-Antipattern (Soll: leer)
rg -n "<div[^>]*onClick" src

# WEIRD-Bias: feste Locale-Literale / firstName-Annahme (Soll: leer/begruendet)
rg -n "'en-US'|toLocaleString\(\)|firstName|lastName" src

# Monitoring + Web-Vitals in Boundaries
rg -n "captureException|reportError|logger\.|useReportWebVitals" src/app

# ordinal→Median (Test gruen)
npm test -- aggregate

# kein toter Code/Deps; Bundle vs. Baseline
npx next build       # First-Load-JS pro Route mit Phase-0-Baseline vergleichen
npx knip || npx ts-prune ; npx depcheck ; npm ls --all 2>/dev/null | rg -c "dedupe" || true   # Soll: 0

# ALL-CAPS-Rechtstext: ganze Caps-PHRASEN; rohe Fehlercodes
rg -n "([A-Z][A-Z ]{15,})" src/messages ; rg -ni "[A-Z]{12,}" src/messages
rg -n "Error [0-9]{3,}|errno|ECONN|stack" src/app -g '**/error.tsx' -g '**/global-error.tsx'

# i18n vorbereitet
rg -n "<html[^>]*lang=" src/app

# Manuell: jede Hauptseite nur per Tastatur; JS deaktiviert → Kerninhalt sichtbar; externen Fetch faken → nur Segment degradiert.
```

---

### Phase 6 — UX-Validierung: States, Content, Maturity & Resilienz `[BEC]` `[NOR]`

> Software ist eine Hypothese; Fail fast, alle Zustaende, echter Content. Bedeutung fuer echte Aufgaben. `[BEC][NOR]`

**Anweisungen**

1. **Alle UI-States** jeder datengetriebenen Komponente: **loading / empty / error / success** (+ partial wo sinnvoll). Loading via `loading.tsx`/Suspense-Skeleton (`aria-busy`) + `useFormStatus`/`isPending` an Submit-Buttons (disabled+Spinner); **Empty** = erklaerender Text + klarer CTA, **nie** leere Flaeche oder generischer Lorem-Platzhalter; Error via `error.tsx` (Klartext + `reset()`-Button, kein Stacktrace/Code im DOM); Success = Toast/Inline-Bestaetigung + aktualisierter Zustand (`revalidatePath`/optimistic UI). Keine „nur Happy Path"-Komponente. `[BEC]`
2. **Content-First** `[BEC]`: Inhalte aus `content/` statt im UI hartkodiert; pro `page.tsx` zuerst ein **Inhalts-Outline** (Informationsbloecke + Reihenfolge + Happy Path) als Kommentar/MDX, **bevor** Layout. „Never sketch a screen without an outline." Alle generischen Platzhalter durch echten, kontextuellen Inhalt ersetzen.
3. **Fehlerpraevention & User Control** `[BEC]` (Nielsen): Formulare clientseitig vor Submit validieren (zod + react-hook-form / Server-Action mit Schema), inline-Fehler neben dem Feld; destruktive/irreversible Aktionen mit Bestaetigungsdialog; jedes Modal/Flow mit sichtbarem Abbrechen/Schliessen (Esc/Backdrop) und wo moeglich Undo (Toast „Rueckgaengig"); kein Datenverlust bei Fehler.
4. **Extrem-Content testen** `[FRO][BEC]`: leerer Zustand, 1 Item, viele Items, sehr lange/sehr kurze Strings, Admin/Nicht-Admin/Erstnutzer, fehlende Bilder — kein Layout-Bruch/Overflow; bricht etwas, auf **atomarerer** Ebene fixen (nicht per Inline-Override in der Page).
5. **Nielsen-10-Heuristik-Audit** `[BEC]` pro Seite in `docs/ux/heuristics-audit.md`: Status sichtbar · Real-World-Sprache · Undo/Exit (User Control) · Konsistenz/Standards · Fehlerpraevention · Recognition>Recall · Shortcuts · minimalistisch · Klartext-Fehler · auffindbare Hilfe. Findings → Tickets/Backlog.
6. **UX-Maturity-Check** `[BEC]` pro Hauptseite in `docs/ux/maturity-audit.md`, **bottom-up additiv**: **usable** (bedienbar/zugaenglich — Minimum) → **useful** (loest das Problem-Statement) → **desirable** (Marke/Vertrauen/Aesthetik) → **delightful** (ueber Erwartung). Mindestziel = usable + useful belegt; desirable/delightful als Tickets. Delight-Features **nicht** vor geschlossenen A11y-Defekten (§Phase 5).
7. **Aufgaben-Orientierung & Story** `[NOR]`: pro Hauptseite die zentrale Nutzeraufgabe (aus Problem-Statement/Persona) benennen; pruefen, ob der primaere CTA sie unmittelbar unterstuetzt und ob das **narrative Akzeptanzkriterium** (§Phase 0.6) erfuellt ist. Jede KPI-/Reporting-Ansicht zeigt neben der Zahl ein kurzes „Was bedeutet das"-Narrativ (§1.14).
8. **Feature-Graveyard pruefen** `[BEC]`: identifizieren, welche Features/Patterns niemand braucht oder das Problem nicht loesen (leere Used-by-Lineage §Phase 2.11, 0-Klick-Analytics) → als Streichungs-Kandidaten in `docs/GRAVEYARD.md` (Datum/Grund/Commit) und via Nachfrage-Schwelle (§1.17) zur Entfernung vorschlagen. „Nein sagen ist Wertschoepfung." Code aus `main` entfernen; History/archivierter Branch erhaelt Nachvollziehbarkeit (Idee statt Code im Bundle).
9. **Scope-Wirkung messen** `[BEC]`: vor jeder Erweiterung Bundle-/Render-/Datenkosten bewerten und die kleinere zielerfuellende Variante waehlen (fewer Items, kuerzere `revalidate` statt zusaetzlichem Client-State); Vorher/Nachher im PR; Web Vitals (LCP/CLS) duerfen sich nicht verschlechtern.
10. **Fail fast & mit echten Nutzern (finale Verifikation)** `[BEC][NOR]`: Aenderungen klein gegen Baseline; pro groesserer Stufe Preview-Deploy + mind. eine Usability-Runde mit **realen, beabsichtigten** Nutzern (nicht Team/Freunde/Stakeholder) — Protokoll in `docs/ux/user-testing.md` (Datum, Teilnehmerprofil, Aufgaben, Beobachtungen, Findings). Offene Annahmen als Hypothese in `insights.md`, betroffene Komponente „needs validation" + Feature-Flag (§1.17).

**Definition of Done**

- [ ] Jede datengetriebene Komponente hat loading/empty/error/success (+partial wo sinnvoll); kein Lorem/`placeholder.png`/Stacktrace in ausgelieferten Views.
- [ ] Layout haelt mit realen, extremen Inhalten (leer/sehr lang/sehr kurz/viele Items/Rollen/fehlende Bilder).
- [ ] Destruktive Aktionen mit Bestaetigung; Modals mit Esc/Close; Forms validiert, kein Datenverlust bei Fehler, Undo/abbrechbar.
- [ ] `heuristics-audit.md` und `maturity-audit.md` je Hauptseite ausgefuellt; Findings als Tickets; Delight nicht vor A11y.
- [ ] Primaerer CTA jeder Hauptseite eindeutig, aufgabenunterstuetzend; narratives Akzeptanzkriterium erfuellt; KPI-Ansichten mit Narrativ.
- [ ] Feature-Graveyard-Kandidaten in `GRAVEYARD.md` (Datum/Grund/Commit); ggf. nach Nachfrage entfernt.
- [ ] Mind. eine Usability-Runde mit echten Nutzern in `user-testing.md` protokolliert; offene Hypothesen in `insights.md`.

**Verifikation**

```bash
# Stories/Tests fuer jeden State + Extrem-Fixtures
npm test
rg -n "loading|empty|error|success" src/design-system -g '*.tsx' | head

# keine generischen Platzhalter / Stacktraces in ausgelieferten Views (Soll: leer)
rg -ni "lorem|placeholder\.(png|jpg)|TODO" src/app
rg -n "stack\b|stacktrace" src/app -g '**/error.tsx'

# destruktive Aktionen mit Bestaetigung (Stichprobe)
rg -n "confirm|AlertDialog|Dialog" src/design-system/compound

# Audit-Artefakte existieren (pruefbarer Beleg)
test -f docs/ux/heuristics-audit.md && test -f docs/ux/maturity-audit.md \
  && test -f docs/ux/user-testing.md && test -f docs/ux/insights.md \
  && test -f docs/GRAVEYARD.md && echo OK

# Manuell: Formulare mit ungueltigen Eingaben → Klartext-Fehler inline, kein Datenverlust; destruktive Aktion → Bestaetigung.
# Manuell: Preview-Deploy fuer Usability-Runde; Protokoll in user-testing.md.
```

---

### Phase 7 — Doku, Pattern Library & Governance `[BUD]` `[FRO]`

> Ein Design-System lebt nur mit Doku, Naming-Disziplin und Pflegeprozess. „Die groesste existenzielle Bedrohung jedes Systems ist Vernachlaessigung." Updates muessen reibungslos sein. `[FRO]`

**Anweisungen**

1. **Lebende Pattern Library** `[FRO][BUD]`: Storybook (oder `/styleguide`-Route) aufsetzen, das **dieselben** Komponenten aus `design-system/` importiert wie die App (Holy Grail, kein Klon); jedes Atom/Molecule/Organism isoliert, mit **allen** Variants/Sizes/States/Types und ueber das Viewport-Spektrum, inkl. Edge-Case-Stories (langer/leerer/Fehler-Zustand).
2. **Komponenten-Doku (5 Pflichtteile)** `[BUD]` je Komponente (MDX/co-located): (1) Beschreibung/Anatomy, (2) Playground + Galerie **aller** Variants/Sizes/States/Types, (3) Usage-Guidelines/Use-Cases, (4) Do's & Don'ts, (5) Code-Snippet aus dem **real** verwendeten Component-Code. Plus Guardrails (maxLength, aspect-ratio). Prop-Namen industriestandard & konsistent.
3. **Komponenten-Test/Abnahme** `[BUD]`: Layer/Props korrekt benannt, jede Konfiguration erzeugt das erwartete visuelle Ergebnis, Text fliesst beim Resizen korrekt (kein Clipping), Komposition/Override leicht. **Visuelle Regressionssuite** (Storybook/Chromatic oder Playwright-Screenshots §7.4) im CI gruen.
4. **Token-Doku** finalisieren (`tokens/README.md`): Naming-Convention, Ebenen-Regel (§3), One-off-Schwelle, Pipeline-Setup (CSS-first/JSON-first §3.0), Token→Verwendung-Mapping. `[BUD]`
5. **Shared Vocabulary** (`PATTERNS.md`) + **Pattern-Lineage** (`lineage.md`) `[FRO]` finalisieren: kanonischer Name → Bedeutung; woraus jede Komponente besteht (**Uses**) + wo verwendet (**Used-by**); ungenutzte Patterns entfernt (`knip`/`ts-prune` = 0). Aenderungs-Impact (Re-QA-Routen) ablesbar.
6. **Governance + Team-/Approver-Modell** `[FRO][BUD]` in `docs/design-system/DESIGN_SYSTEM.md`:
   - **Prozess Modify/Add/Remove:** Modify nur via PR mit aktualisierten Stories/Tests; Add erst beim **zweiten** Use-Case (§1.16/§1.20); Remove als **Deprecation** (JSDoc `@deprecated` + Nachfolger-Hinweis + Dev-`console.warn`) statt Hard-Delete; wer approved.
   - **Team-Modell** explizit benennen `[BUD]`: **Solitary** / **Centralized** / **Federated** + **Makers vs. Users** (wer darf Tokens/Komponenten aendern, wer konsumiert). Als Code-Eigentuemerschaft via `.github/CODEOWNERS` (Owner fuer `tokens/**` + `design-system/**`) + Branch-Protection/Required-Reviews verankern. Bei Unklarheit → Nachfrage-Schwelle §1.17.
   - **Communicating change:** `CHANGELOG.md` als Pflicht-Bestandteil jeder Token-/Komponenten-PR (CI-Check bricht ab, wenn `tokens/`/`design-system/` ohne Changelog-Eintrag geaendert). „Make it official/visible/bigger": Brand, Voice & Tone, Code-Style, Design-Principles in den Hub.
7. **`CHANGELOG.md`** `[BUD]`: Aenderungstyp (markup/style/script/spec) × Gruppe (new/enhancement/fix/other), versioniert (SemVer) + datiert.
8. **Holy Grail** `[FRO]`: Library und Produktion teilen dieselben TSX-Komponenten (kein Copy-Paste von Markup); genau **eine** Definition pro Komponente; geteilte Tokens versioniert, eine Aenderung schlaegt ueberall durch.
9. **`REFACTOR-LOG.md`** abschliessen: Vorher/Nachher-Metriken (Phase 0 vs. final).

**Definition of Done**

- [ ] Storybook/Styleguide deckt alle oeffentlichen Komponenten + alle States + Edge-Cases ab; baut fehlerfrei; importiert dieselbe Quelle wie die App; visuelle Regressionssuite gruen.
- [ ] Jede oeffentliche Komponente hat 5-teilige Usage-Doku (inkl. Do/Don't + Code-Snippet aus echtem Code).
- [ ] `tokens/README.md` (inkl. Pipeline + One-off-Schwelle), `PATTERNS.md`, `lineage.md` (Uses/Used-by), `DESIGN_SYSTEM.md` (Team-/Approver-Modell, Modify/Add/Remove, Deprecation), `CHANGELOG.md`, `.github/CODEOWNERS` vollstaendig.
- [ ] Library und Produktion teilen Komponenten (kein dupliziertes Markup; genau eine Definition pro Komponente); `knip`/`ts-prune` = 0.
- [ ] Abschluss-Metriken im Log; alle Gates erfuellt (§5 Globale DoD).

**Verifikation**

```bash
npm run build-storybook                                   # baut fehlerfrei
npm run build && npm run typecheck && npm run lint        # final gruen

# Doku-Vollstaendigkeit: jede KOMPONENTE (ohne Stories/Tests/Index) hat eine Doku-Datei
for f in $(fd -e tsx -E '*.stories.tsx' -E '*.test.tsx' -E 'index.tsx' . src/design-system/core src/design-system/compound src/design-system/sections); do
  base="${f%.tsx}"; [ -f "$base.mdx" ] || [ -f "$base.md" ] || echo "FEHLT Doku: $f"; done

# genau EINE Definition pro Komponente (Holy Grail) — Beispiel Button
rg -l "export (default )?function Button" src/design-system | wc -l   # Soll: 1

# Governance/Changelog/Lineage/Vocabulary/Token-Doku/Codeowners existieren
test -f docs/design-system/DESIGN_SYSTEM.md && test -f CHANGELOG.md \
  && test -f docs/design-system/lineage.md && test -f docs/design-system/PATTERNS.md \
  && test -f src/design-system/tokens/README.md && test -f .github/CODEOWNERS && echo OK

# Holy Grail: Stories importieren die echte Quelle
rg -n "from .*design-system/(core|compound|sections)" .storybook src/**/*.stories.tsx | head
```

---

## 5. Globale Definition of Done (Projekt gilt erst dann als refactored)

- [ ] **0** hartkodierte Design-Werte ausserhalb der Token-Quelldateien (`tokens.json`/`tokens.css`/`tokens.ts`/`tailwind.config.*` — Allowlist §1.19); Grep-Beweis. `[BUD]`
- [ ] Vollstaendige Atomic-Struktur; Import-Richtung strikt top-down auf **allen** Ebenen (maschinell via `eslint-plugin-boundaries`); **0** Zirkular-Abhaengigkeiten (`madge`); keine Duplikate; alle Namen struktur-/content-agnostisch + Industriestandard. `[FRO][BUD]`
- [ ] Drei Token-Ebenen sauber: Component→Semantic→Primitive; Komponenten nutzen nur Semantic/Component. `[BUD]`
- [ ] Theming ueber Token-Sets (identische Namen, keine Komponenten-Duplikate, kein FOUC/Flash); nur ein Typeface (via `next/font`, `--font-sans`); Body/Input ≥16px. `[BUD][FIL]`
- [ ] Genau ein dominantes Element pro View; max. ein Primary-Button pro Sektion; Farben rollenbasiert (keine 60-30-10-Starrheit); Typo-Skala/8pt-Soft-Grid durchgesetzt; Schatten nur interaktiv. `[FIL]`
- [ ] Forms/Artikel in Reading-Width-Container; 12-Spalten-Grid responsiv ohne Bruch sm/md/lg/xl; Touch-Ziele ≥44px. `[FIL]`
- [ ] WCAG 2.2 AA; voll tastaturbedienbar; 0 kritische axe-Verstoesse; Lighthouse-A11y ≥95; `prefers-reduced-motion`+`prefers-color-scheme`; i18n/`Intl.*`/`fullName` (kein WEIRD-Bias). `[BEC][NOR]`
- [ ] Alle nutzersichtbaren Strings in `messages/`, Klartext-Fehler + Loesung, Voice/Tone-konsistent; keine Dark Patterns (Symmetrie Opt-in/Opt-out). `[NOR]`
- [ ] Analytics = Outcome-Events mit `definitions.ts` (whatItProxies/validityCaveat/scaleType/story); ordinal→Median; ≥1 subjektive Qualitaetsmetrik; kein Aggregat-Score in **nutzersichtbaren** Status-UIs (interne QA-Metriken ausgenommen). `[NOR]`
- [ ] **Kein toter Code/Deps** (`knip`/`ts-prune`/`depcheck` = 0; keine npm-Duplikate); `next/image`+`dynamic`+`next/font`; First-Load-JS/Route nicht ueber Baseline ohne dokumentierte Begruendung; Bundle/Lighthouse-Budget-Gate aktiv. `[NOR]`
- [ ] Jede Route `error.tsx`(+`'use client'`)+`loading.tsx`+`not-found.tsx` (Root +`global-error.tsx`); externer Fetch hinter `lib/`-Adapter mit Fallback; Monitoring + Web-Vitals in Boundaries; externer Ausfall crasht nicht die App. `[NOR]`
- [ ] Alle datengetriebenen UIs mit loading/empty/error/success; Extrem-Content getestet; kein Lorem/Stacktrace ausgeliefert. `[BEC][FRO]`
- [ ] Artefakte vorhanden: interface-inventory, REFACTOR_BACKLOG (KEEP/MERGE/DROP), problem-statements (v2), personas+stories, insights (Mad-Libs), research-summary, heuristics-audit, **maturity-audit**, **user-testing**, GRAVEYARD, PATTERNS, lineage, Governance (inkl. Team-Modell + CODEOWNERS), Changelog. `[BEC][NOR][FRO][BUD]`
- [ ] `build` + `typecheck` + `lint` + `build-storybook` gruen; visuelle Regressionssuite gruen; Storybook + 5-teilige Usage-Doku + Token-Doku vollstaendig; genau eine Definition pro Komponente (Holy Grail). `[FRO][BUD]`
- [ ] `REFACTOR-LOG.md` mit Vorher/Nachher-Metriken; `pre-refactor-baseline`-Tag erhalten. `[§]`

---

## 6. Anti-Patterns / Guardrails (verboten → stattdessen → Quelle → Anker)

| ❌ Verboten                                                                    | ✅ Stattdessen                                                                           | Quelle          | Anker             |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | --------------- | ----------------- |
| Hex/`px`/Font-Size direkt in Komponente                                        | Semantic-/Component-Token                                                                | `[BUD]`         | §1.7              |
| Primitive-Token direkt in Komponente                                           | ueber Semantic-Layer gehen                                                               | `[BUD]`         | §3                |
| Component-Token zeigt auf Rohwert/Primitive                                    | Component → Semantic → Primitive                                                         | `[BUD]`         | §3                |
| Token fuer Einmal-Wert anlegen                                                 | erst ab ≥3 Verwendungen                                                                  | `[BUD]`         | §1.20             |
| Farb-/Spacing-Werte doppelt in css UND ts                                      | eine Single Source (CSS-first) oder generiert (JSON-first)                               | `[BUD]`         | §3.0              |
| Theming durch Komponenten-Duplikate / andere Namen                             | identische Token-Namen, nur Werte tauschen                                               | `[BUD]`         | §3                |
| Eigenerfundene Token-/Komponenten-Namen                                        | `category-property-item-variant-state`; Industriestandard                                | `[BUD]`         | §3 / §Phase 2.8   |
| Eingabe-**Atom** „field" nennen                                                | Atom = `Input`; Molecule darf `FormField` heissen                                        | `[BUD]`         | §Phase 2.3        |
| Eine Achse mal `kind`/`type`/`style` benennen                                  | konsistenter Prop-Name pro Achse                                                         | `[BUD]`         | §Phase 2.9        |
| Willkuerliche/ungerade Spacing-Werte (3/5/13px)                                | begrenzte non-lineare 8pt-Soft-Skala (Base 4px)                                          | `[FIL][BUD]`    | §3.1              |
| Reines `#000000`/`#000` (Komma- ODER Space-Syntax)                             | `#1F1F1F`-Grauton, Palette-Grau-Schatten                                                 | `[FIL]`         | §3.1              |
| Body/Input <16px, Light-Gewicht fuer kleinen Text                              | Body ≥16px, Gewichtskontrast (≥2 Stufen skip)                                            | `[FIL]`         | §Phase 3.7        |
| Starre 60-30-10-Farbregel                                                      | Farben per ROLLE (Bg=hellstes, Text=dunkelstes, Primary nur Aktion/Focus)                | `[FIL]`         | §Phase 3.3        |
| Mehrere konkurrierende CTAs/Primary-Buttons                                    | genau ein dominantes Element pro View, max. 1 Primary/Sektion                            | `[FIL]`         | §Phase 3.1        |
| Schatten auf Text/disabled; weisse Schatten im Dark-Mode                       | Schatten nur interaktiv; hellerer Surface-Ton                                            | `[FIL]`         | §3.1              |
| Forms/Artikel auf volle Breite                                                 | schmaler Fixed-/Reading-Container                                                        | `[FIL]`         | §Phase 4.3        |
| col-span 5/7/11 (teilt 12 nicht)                                               | 12-Spalten teilbar (6/4/3/2)                                                             | `[FIL]`         | §Phase 4.2        |
| Tap-/Klickflaeche <44×44px; Hover-only-Interaktion                             | Mindestgroesse via Padding; auch Tastatur/Touch                                          | `[FIL][NOR]`    | §Phase 5.2        |
| Hardkodierter Font-Family-String trotz `next/font`                             | `next/font` setzt `--font-sans`, Token referenziert es                                   | `[FIL][§]`      | §Phase 1.7        |
| Tailwind Top-Level-`theme.colors/spacing` (loescht Defaults)                   | Token-Werte unter `theme.extend`                                                         | `[§][BUD]`      | §3.3              |
| Tailwind arbitrary values (`p-[13px]`, `bg-[#…]`)                              | Skalen-Klassen aus Token-Mapping                                                         | `[BUD]`         | §3.3              |
| Komponente kopieren & leicht aendern                                           | Variante via orthogonalem Prop am bestehenden Atom                                       | `[FRO][BUD]`    | §Phase 2.2        |
| Zwei Definitionen derselben Komponente (Klon)                                  | eine Quelle, App+Storybook teilen sie (Holy Grail)                                       | `[FRO]`         | §Phase 7.8        |
| Atom→Molecule/Organism importieren (rueckwaerts)                               | nur gleiche/tiefere Ebene; via `eslint-boundaries` erzwingen                             | `[FRO]`         | §2.2 / §2.4       |
| Zirkular-Abhaengigkeit / God-Module                                            | lose Kopplung, `madge --circular`=0                                                      | `[NOR]`         | §1.9              |
| Orts-/content-spezifische Namen (`ProductCard`)                                | struktur-agnostisch (`Card`)                                                             | `[FRO]`         | §Phase 2.7        |
| Synonym-Dubletten (`Hero`+`Banner`)                                            | ein kanonischer Name                                                                     | `[FRO]`         | §Phase 2.8        |
| Template mit hartkodiertem Inhalt                                              | nur Slots/Props + Guardrails (maxLength/aspect-ratio)                                    | `[FRO]`         | §Phase 2.5        |
| Monolithische Mega-Komponente                                                  | in kleinste wiederverwendbare Bausteine zerlegen (SRP)                                   | `[FRO][BUD]`    | §2.1              |
| Neues Pattern bei jedem Wunsch                                                 | erst beim zweiten Use-Case; Governance                                                   | `[FRO]`         | §1.16 / §1.20     |
| Pattern hart loeschen                                                          | `@deprecated` + Nachfolger + Warnung                                                     | `[BUD]`         | §Phase 7.6        |
| Kein Team-/Approver-Modell / kein CODEOWNERS                                   | Solitary/Centralized/Federated + Makers/Users + CODEOWNERS                               | `[BUD]`         | §Phase 7.6        |
| Tokens erstellt aber nicht angebunden                                          | jede Komponente verdrahtet Tokens                                                        | `[BUD]`         | §Phase 2.10       |
| `'use client'` aus `error.tsx`/`global-error.tsx` entfernen                    | Pflicht-Client (Error Boundary)                                                          | `[§]`           | §2.3              |
| `<div onClick>` als Button                                                     | `<button>` / `Button`-Atom                                                               | `[NOR][BEC]`    | §Phase 5.1        |
| Nur Happy-Path-UI / leere Flaeche / Lorem / Stacktrace im DOM                  | loading/empty(+CTA)/error(Klartext)/success                                              | `[BEC]`         | §Phase 6.1        |
| Layout/Screen ohne Inhalts-Outline coden                                       | erst Outline + Happy Path                                                                | `[BEC]`         | §Phase 6.2        |
| Direkt in High-Fidelity loesen                                                 | Fidelity-Treppe low→mid→high                                                             | `[BEC]`         | §4                |
| Nutzervalidierung erst am Ende                                                 | frueh (Lo-Fi, Phase 0) UND spaet (Phase 6)                                               | `[BEC]`         | §4                |
| Nur intern/an Freunden/Stakeholdern testen                                     | mit echten beabsichtigten Nutzern (with & by)                                            | `[BEC][NOR]`    | §1.17             |
| Personas als feststehende Wahrheit                                             | als Proto-/Hypothese starten, schaerfen/verwerfen                                        | `[BEC]`         | §Phase 0.6        |
| Insight mit Loesung vorwegnehmen                                               | loesungsfreies Mad-Libs, dann mehrere Loesungen                                          | `[BEC]`         | §Phase 0.7        |
| Useful/desirable/delightful ignorieren; Delight vor A11y                       | UX-Maturity bottom-up, A11y zuerst                                                       | `[BEC]`         | §Phase 6.6        |
| Totes/zweckloses Feature behalten                                              | Product Graveyard: streichen (nach Nachfrage) ist Wert                                   | `[BEC]`         | §1.6 / §Phase 6.8 |
| Usability ohne Accessibility                                                   | A11y untrennbar (Moebius), WCAG 2.2 AA                                                   | `[BEC]`         | §1.11             |
| Nur fuer westlichen Default-Nutzer; festes `en-US`/`toLocaleString()`          | ganzes Oekosystem: i18n/`Intl.*`/`fullName`                                              | `[NOR]`         | §1.12             |
| `firstName`+`lastName`-Annahme                                                 | einzelnes `fullName`-Feld, locale-flexibel                                               | `[NOR]`         | §1.12             |
| Fundamental-Stack ad hoc wechseln                                              | innerhalb React/Next refactoren                                                          | `[BEC]`         | §1.16             |
| Vanity-Metriken (Pageviews/Verweildauer) als KPI                               | Outcome-Events mit `whatItProxies`/`validityCaveat` + Story + scaleType                  | `[NOR]`         | §Phase 5.7        |
| Ordinaldaten per Mittelwert aggregieren                                        | Median fuer `scaleType:'ordinal'`                                                        | `[NOR]`         | §Phase 5.7        |
| Aggregat-„Score" in NUTZERSICHTBARER Status-UI                                 | qualitativer Ueberblick + progressive disclosure (intern ausgenommen)                    | `[NOR]`         | §Phase 5.7        |
| Metrik ohne dahinterstehende Geschichte                                        | Stories liefern Bedeutung; Narrativ je KPI                                               | `[NOR]`         | §1.14             |
| ALL-CAPS-Rechtstext / Jargon / rohe Fehlercodes/Stacktrace im UI               | Klartext + Loesung, `messages/`, server-only Log                                         | `[NOR]`         | §1.11             |
| Dark Patterns (Confirm-Shaming, Pre-Checked, Countdown, Autoplay, Roach-Motel) | Opt-out=Opt-in, default-unchecked, abbrechbar, Undo                                      | `[NOR]`         | §1.13             |
| Take-Make-Waste (totes JS/Deps/Requests/CSS)                                   | Dead Code/Deps entfernen, `dynamic`/`next/image`/`next/font`                             | `[NOR]`         | §Phase 5.8        |
| Single-Point-of-Failure / harter externer Fetch                                | defensive Fallbacks/Adapter, error/loading je Segment                                    | `[NOR]`         | §1.9              |
| Symptom patchen / Five-Whys-Einzelursache                                      | Wurzelursache, ALLE Faktoren (NTSB), Regressionstest; `Symptom:`/`Root cause:` im Commit | `[NOR]`         | §1.10             |
| Defensives Pflaster (`useMemo`/`setTimeout`/`eslint-disable`) statt Quelle     | instabile Quelle beheben                                                                 | `[NOR]`         | §1.10             |
| Foundationales (Token/Grid/Schema) spaet → blockiert Folgearbeit               | foundational-first, Dev nicht blockieren (Dual-Track)                                    | `[BEC]`         | §1.3              |
| Big-Bang-Rewrite                                                               | kleine atomare, revertierbare Commits hinter Feature-Flags                               | `[BEC][§]`      | §1.5              |
| Build rot lassen & weitermachen                                                | sofort gruen machen                                                                      | `[§]`           | §1.4              |
| „Erledigt" ohne Check; Markenfarbe/Feature-Streichung/Build-Tool raten         | Befehl ausfuehren + Ergebnis; Nutzer fragen                                              | `[§][NOR][BEC]` | §1.15 / §1.17     |

---

## 7. Verifikations-Toolbox (Befehle an `package.json` anpassen)

> **Audit-Server-Probe (vor jedem URL-Audit `axe`/`lighthouse`):** Diese Tools brauchen eine **laufende** URL. Erst bauen, im Hintergrund starten, auf Ready warten, `URL` setzen — sonst „connection refused".
>
> ```bash
> npx next build && (npx next start -p 3000 &) ; \
> URL="http://localhost:3000" ; \
> for i in $(seq 1 30); do curl -sf "$URL" >/dev/null && break || sleep 1; done
> ```

```bash
# --- Kern: nach JEDER Einheit (Fallbacks falls Script fehlt, §Phase 0.4) ---
npm run build      || npx next build
npm run typecheck  || npx tsc --noEmit
npm run lint       || npx eslint .                # eslint-plugin-jsx-a11y + boundaries aktiv (§2.4)

# --- Design-Werte-Audit (Soll nach Phase 1: nur Token-Quelldateien) — Allowlist §1.19 [BUD][FIL] ---
ALLOW="--glob !**/tokens.json --glob !**/tokens.css --glob !**/tokens.ts --glob !**/tailwind.config.*"
rg -n "#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b" src $ALLOW
rg -n "\b[0-9]+px\b" src $ALLOW
rg -n "(margin|padding|gap)\s*:\s*[0-9]+px" src --type css --glob '!**/tokens.css' | rg -v "var\(--space"
rg -nP "\b[pm][trblxy]?-\[(?!var\()" src           # Tailwind arbitrary spacing mit Hex/px (var(--token) erlaubt; Soll: leer; -P=pcre2)
rg -ni "#000\b|#000000|rgb\(\s*0[ ,]+0[ ,]+0" src $ALLOW   # reines Schwarz (Komma+Space-Syntax)
# Root-Config-Dateien liegen NICHT unter src/ -> von obigen src-Audits NICHT erfasst. Dort nur var(--token), keine Rohwerte:
rg -n "#([0-9a-fA-F]{3,8})\b" tailwind.config.* next.config.* 2>/dev/null               # Hex in Root-Configs (Soll: leer)
rg -n "\b[0-9]+px" tailwind.config.* 2>/dev/null | rg -v "screens|sm:|md:|lg:|xl:|2xl:" # nackte px nur in screens/Breakpoints erlaubt (Soll sonst: leer)
rg -ni "font-(thin|extralight|light)\b|font-weight\s*:?\s*(100|200|300)|fontWeight[=:]\s*[\"{]?(100|200|300)|weight=[\"']light" src/design-system

# --- Token-Namen-Convention [BUD] ---
rg -n -- "--(color|space|font|line-height|radius|shadow|z|duration|grid|breakpoint)-[a-z0-9-]+\s*:" \
  src/design-system/tokens/tokens.css

# --- Atomic-Architektur, Import-Richtung pro Ebene + keine Zyklen [FRO][NOR] ---
npx madge --circular src                                                 # 0 Zyklen
rg -n "from .*(compound|sections|templates)" src/design-system/core      # Atom→hoeher (Soll: leer)
rg -n "from .*(sections|templates)"          src/design-system/compound  # Molecule→hoeher (Soll: leer)
rg -n "from .*templates"                      src/design-system/sections  # Organism→Template (Soll: leer)
rg -ni "homepage(Carousel|Banner)|productCard|blogHero" src              # Orts-Namen (Soll: leer)
rg -n "use client" src/design-system                                     # minimal (error/global-error erlaubt)

# --- A11y & Performance [NOR][BEC] (Server vorher starten, s.o.) ---
npx @axe-core/cli "$URL" --tags wcag2a,wcag2aa       # Soll: 0 violations
npx lighthouse "$URL" --only-categories=accessibility,performance --output=json --output-path=lh.json
node -e "const r=require('./lh.json');const a=r.categories.accessibility.score;process.exit(a>=0.95?0:(console.error('A11y',a),1))"  # A11y >=95 asserten (Soll: Exit 0)
npm run check:budget   # Performance-/Bundle-Budget-Gate: bei Regression Exit 1 (z.B. size-limit oder .next-Route-Sizes vs. Baseline)
rg -n "<div[^>]*onClick" src                         # div-Button-Antipattern (Soll: leer)

# --- Humanity-Centered / WEIRD [NOR] ---
rg -n "'en-US'|toLocaleString\(\)|firstName|lastName" src                # Soll: leer/begruendet
rg -n "<html[^>]*lang=" src/app                                          # i18n vorbereitet

# --- Sustainability / keep-in-use [NOR] ---
npx depcheck            # ungenutzte Dependencies (Soll: 0)
npx knip || npx ts-prune  # ungenutzte Exports/Files (Soll: 0)
npx next build          # First-Load-JS pro Route vs. Baseline (Trend)

# --- Resilienz / UI-States + Monitoring [NOR][BEC] ---
fd -e tsx '(loading|error|not-found|global-error)' src/app   # je Segment + global vorhanden?
rg -n "captureException|useReportWebVitals" src/app          # Monitoring/Web-Vitals

# --- Metriken / Ordinal->Median [NOR] ---
npm test -- aggregate                               # Median-Aggregation gruen

# --- Doku / Pattern Library [FRO][BUD] ---
npm run build-storybook || npx storybook build
npm test                                            # Stories/State-Tests + aggregate-Test gruen
```

### 7.4 Baseline-/Responsiv-Screenshots (Playwright, kopierbar) `[§]`

```ts
// scripts/screens.spec.ts — Baseline (Phase 0) & Regress-Vergleich (Phase 3/4) + Overflow-Assert
import { test, expect } from '@playwright/test'
const pages = ['/', '/about', '/contact'] // Hauptseiten anpassen
const sizes = { sm: 375, md: 768, lg: 1024, xl: 1280 }
for (const p of pages)
  for (const [name, w] of Object.entries(sizes)) {
    test(`screenshot ${p} ${name}`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 })
      await page.goto(`http://localhost:3000${p}`)
      // horizontaler Scroll = Layout-Bruch [FIL]
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      )
      expect(overflow, 'kein horizontaler Scroll').toBeFalsy()
      await expect(page).toHaveScreenshot(`${p.replace(/\//g, '_')}-${name}.png`)
    })
  }
```

**Mess-Hinweise (`[§]`):** Fuer **Anzahl echter Treffer** `rg --count-matches PATTERN` (nicht `rg | wc -l`, das zaehlt nur Zeilen); fuer **Anzahl betroffener Dateien** `rg -l PATTERN | wc -l`. `rg` kennt **keinen** Dateityp `tsx` — fuer TSX `-g '*.tsx'` oder `--type ts` (umfasst `.ts` und `.tsx`), nie `--type=tsx`. Im Log explizit notieren, **was** gezaehlt wurde.

---

## 8. Agenten-Arbeitsloop

```
FOR phase IN [0..7]:
  1. Phase-Anweisungen lesen + betroffene Dateien READ-FIRST lesen                       [§1.1][BEC]
  2. Problem/Outline pruefen: Problem-Statement (§Phase 0.5) + Inhalts-Outline da?       [§1.2][BEC]
     wenn nein → erst erstellen (Stift weglegen, zurueck zur Definition)
  3. Foundational-first sicherstellen: stehen Datenvertrag/Grid/Tokens, bevor            [§1.3][BEC]
     darauf aufgebautes UI angefasst wird? sonst zuerst Foundation
  4. Impact-Map des betroffenen Symbols erstellen (rg -l Konsumenten)                     [§1.15]
  5. Aenderung in kleinster, revertierbarer Einheit (Fidelity-Treppe low→mid→high)       [§1.5][BEC]
     - Schichtenfilter §0.3 anlegen: NOR? BEC? FIL? FRO? BUD? — alle "ja"?
     - risikoreiche Flow-Aenderung hinter Feature-Flag (lib/flags.ts)                    [§1.17][BEC]
  6. Nach jeder Einheit: build + typecheck + lint → gruen? sonst SOFORT fixen            [§1.4]
  7. Token-Check: kein Rohwert/Primitive in Komponente (rg, Allowlist §1.19)             [§1.7][BUD]
  8. Phasen-Verifikation ausfuehren; Ergebnisse → REFACTOR-LOG.md (was gezaehlt?)        [§1.15][§1.18]
  9. Adversarial: "Womit koennte das etwas kaputt gemacht haben?"                        [§1.15]
     - gegen Phase-0-Baseline (Screenshots/Metriken): gewollt vs. ungewollt?            [§1.6]
 10. DoD-Checkliste der Phase abarbeiten — Phase erst fertig, wenn ALLE belegt
 11. Commit (atomar, sprechend) + CHANGELOG-Eintrag (markup/style/script/spec)           [§1.5][§1.18][BUD]
     - bei Fix-Commit: Body enthaelt `Symptom:` und `Root cause:`                        [§1.10][NOR]
 12. Bei Produktentscheidung/Unklarheit/Feature-Streichung/Build-Tool → STOPP & FRAGEN   [§1.17]
 13. Bei Bug/Incident: Wurzelursache + ALLE Faktoren (NTSB) + Regressionstest             [§1.10][NOR]
```

---

## 9. Vertiefungs-Pointer in die Quelldateien (selber Ordner)

> Reicht eine Direktive nicht, liest der Agent **vor** der Entscheidung den genannten Abschnitt. **Achtung:** Kapitel-/Seitenangaben stammen aus den Buch-Extraktionen und sind **nicht** gegen die On-Disk-`.md` verifiziert (§0.4). Massgeblich ist der per Volltextsuche gefundene **Abschnittstitel**, nicht die Seitenzahl.

- **`UI Design Systems Mastery - Marina Budarina.md`** `[BUD]` — Token = Rohwert+Name & JSON/YAML als kompilierte Single Source / Token-Pipeline (S.86–92, 100–102); 3 Token-Typen (Global/Alias/Component) + 5-teilige Naming-Convention + Do/Don't inkl. ≥3-Verwendungen-Regel (S.93–100); Theming ueber identische Token-Namen / Light↔Dark durch Wertspiegelung, SSR-sicher (S.97–99, 133–140); Color-Foundation Primary/Accent/Feedback/Neutral, Tint/Shade 50–900 in HSL, „cold greys", 9–10 vs. 5–6 Stufen (S.105–138); Typo-Skala 2/4/8-Increments, Base 16, line-height 1.5/1.2 (S.142–160); Spacing Base-Unit 4/8pt, non-linear, inner/outer (S.180–192); Grids Breakpoints/12-Spalten/Fluid-Fixed-Hybrid/Container 1240 (S.194–207); Komponenten-Anatomie/Hierarchie & Button als Startkomponente, Variants/Sizes/States als Props, Variant×Size×State-Test-Matrix (S.222–248); 5-teilige Komponenten-Doku & Do/Don't (S.270–284); Contributing/Changelog (markup/style/script/spec) & **Team-Modelle Solitary/Centralized/Federated, Makers vs. Users** (S.72–77, 274–277).
- **`Atomic Design - Brad Frost.md`** `[FRO]` — Methodik & „What's in a name?", nicht-linear/„part and the whole"/„dance between contexts", Atoms/Molecules/Organisms/Templates/Pages, „Clean separation between structure and content" (Templates = „what content is made FROM", Content-Guardrails), Pages testen Robustheit mit Extrem-Content (Kap.2); Pattern Libraries, „A shared vocabulary", Brand identity vs. Design language, Voice & Tone (Kap.1); „Providing context with pattern lineage" / Uses+Used-by (Kap.3); „Show, don't tell: interface inventories" + 16 Kategorien + Audit, „dig deep", „one instance of each unique pattern", „Make it agnostic", In-Browser-Iteration/Hot-Potato (Kap.4); „Maintenance and governance" / Make it official/visible/bigger / Modify/Add/Remove / Deprecation / Communicating change / Team makers&users / „In search of the holy grail" / „biggest threat is neglect" (Kap.5).
- **`UI Design Principles - Michael Filipiuk.md`** `[FIL]` — Usability + Delightfulness, „best interface is no interface"; „Perception and visual hierarchy" (Size/Color/Position/Proximity/Alignment/Common region/Figure-ground, genau ein dominantes Element, „when everything stands out, nothing stands out", Squint-Test); „How to build a column grid?" (12 Spalten, Gutter/Margins, Fluid vs. Fixed) + „8pt grid / Hard vs Soft grid / mobile margins 20-24"; „Building a type scale" (Base 16, +/-2/+4/+8) + „line height (×1.6, Header kleiner)" + „optimal line length 50-75ch / left-align" + „font weights / skip a weight"; rollenbasierte Farbe STEP 1–7 (kein 60-30-10), Grayscale/„start with B&W"/kein #000, Tints&Shades HSL 50–900, WCAG-Kontrast; „soft shadows / avoid pure black / not every element / no white shadows in dark"; „Button types / states / height 40-60 / tap area 44 / corner radius".
- **`Effective UX Design Strategies - Christopher Reid Becker.md`** `[BEC]` — Kap.3 **Dual-Track Agile** / foundational-first / Dev nicht blockieren / Versionierung („reset back"); Kap.4 Problemdefinition (Lincoln-Axt, v1/v2-Templates, „Designer ist nicht der User"), **Proto-Personas** (verwerfbar, 4 Quadranten), Humanize/3-Akt-Story; Kap.5 User Insights (Mad-Libs, loesungsfrei) & Daten konsumierbar (Executive Summary/Quote-Cluster); Kap.7 **Fail-fast / Elimination / Idea-Prioritization (limited votes)**; Kap.9 Fidelity-Treppe Lo/Mid/Hi, Design Systems als „kit of parts", In-Browser-Iteration; Kap.10 Nielsens 10 Heuristiken (Status/Recover/Prevention/Control), WCAG/Section 508/EAA, UI-States (loading/empty/error/success); Kap.11 **UX-Maturity (usable→useful→accessible/desirable→delightful, additiv, Moebius)** & Agile-Manifest; Kap.13 Iteration=Learning, changing requirements/„measure impact"/Scope, **foundational code/schema zuerst**, **Product Graveyard / „Nein sagen ist Wertschoepfung"**.
- **`Design for a Better World - Donald A. Norman.md`** `[NOR]` — Kap.7 „The Need for Meaning"; Kap.8–9 „Measurement" / **WEIRD-Kritik** / „Flawed Assumptions" (Koeder-Preise/Manipulation = unethisch), „measure what is important to people" (Skalentypen ratio/interval/ordinal → Median); Kap.10–11 GDP-Opazitaet/„don't combine into one number", „Information Dashboards / Doughnut Model" (qualitativ + Hover-Drilldown statt Aggregat-Score, subjektive Skalen); Kap.12 **„The Power of Stories"** (Stories liefern Bedeutung) / Personas; Kap.13–14 Obsoleszenz/„Throwaway Economy"/Server-Farm-Energie; Kap.16 „Circular Design" (Minimize waste / Keep in use / Vermeiden>Wiederverwenden>Recyceln, „waste = design flaw"); Kap.18 „Resilience / Loosely vs. Tightly Coupled / Redundancy / second-order cybernetic (Selbstbeobachtung)"; Kap.19 „Causality" (NTSB vs. Five Whys, nonobvious feedback loops); Kap.21–22 „systems point of view" / „Five Principles of Humanity-Centered Design" (root cause, systems view, **„with and by, not for"**, Modularitaet+lokale Variation, „everyone is a designer"); Kap.34 „Treating People as Objects" / Flow→Sucht (Anti-Dark-Pattern).

---

> **Merksatz fuer jede einzelne Aenderung (die fuenf Tore §0.3 in einem Satz):**
> _Dient sie echten Menschen — dem ganzen Oekosystem — und der Wurzelursache, nachhaltig, ehrlich & mit sichtbarer Story `[NOR]`? Ist das Problem definiert, evidenz-/hypothesenbasiert, foundational-first, in billiger Stufe (frueh) getestet, mit allen States und passender UX-Maturity `[BEC]`? Stimmt die Wahrnehmung — ein Fokus, 8pt-Soft-Grid, Typo-Skala, rollenbasierte Farbe, Kontrast `[FIL]`? Ist sie das kleinste wiederverwendbare, agnostisch benannte Atom mit korrekter Import-Richtung und gepflegtem Lineage `[FRO]`? Nutzt sie ausschliesslich Tokens, ist als Variant/Size/State modelliert und dokumentiert `[BUD]`?_
> Erst wenn alle fuenf „ja" sind — und ein ausgefuehrter Check es belegt (§1.15) — ist sie fertig.
