# Voice & Tone — PolarisDX

Belegt **Phase 5, DoD-Punkt 4** („Voice/Tone dokumentiert"; verständliche
Sprache, kein Jargon/ALL-CAPS, Klartext-Fehler + Lösung). Diese Datei ist die
verbindliche Referenz für alle nutzersichtbaren Strings (über i18next-Namespaces).

## Voice (konstant) — wer wir sind

PolarisDX klingt **kompetent, klar und respektvoll**. Wir verkaufen Diagnostik
für medizinische Fachkräfte und Wellbeing-Produkte für Endkund:innen — beide
Zielgruppen treffen Entscheidungen, die Vertrauen verlangen.

Unsere Stimme ist immer:

- **Sachlich statt reißerisch** — Nutzen vor Superlativen. Keine „revolutionär",
  „weltbeste", „einzigartig"-Floskeln ohne Beleg.
- **Klar statt fachsimpelnd** — Fachbegriffe nur, wo die Zielgruppe sie erwartet
  (B2B: „POC", „CRP" ok; Consumer: erklären oder vermeiden).
- **Auf Augenhöhe statt belehrend** — wir erklären, ohne herabzusehen.
- **Ehrlich statt manipulativ** — keine künstliche Dringlichkeit, keine
  versteckten Kosten (siehe `dark-patterns-checklist.md`).

## Tone (szenarioabhängig) — wie wir je nach Situation klingen

| Szenario             | Tone                                 | Beispiel                                                 |
| -------------------- | ------------------------------------ | -------------------------------------------------------- |
| Marketing / Hero     | zuversichtlich, einladend            | „Laborergebnisse in 3 Minuten — direkt in Ihrer Praxis." |
| Fachinhalt / Artikel | präzise, belegend                    | „Die S3-Leitlinie empfiehlt … (Quelle)."                 |
| Formular / Hilfetext | ruhig, unterstützend                 | „Wir melden uns innerhalb eines Werktags."               |
| Fehler               | ruhig, lösungsorientiert, schuldfrei | siehe unten                                              |
| Erfolg               | bestätigend, knapp                   | „Danke — Ihre Anfrage ist eingegangen."                  |
| Leerer Zustand       | orientierend, mit nächstem Schritt   | „Noch keine Einträge. Legen Sie den ersten an."          |

## Schreibregeln (verbindlich)

1. **Kein ALL-CAPS** als Schrei-Mittel. Versalien nur via CSS (`uppercase`) für
   Eyebrows/Labels, nie im übersetzten String selbst.
2. **Kein unerklärter Jargon** in Consumer-Flows. B2B-Fachbegriffe sind ok,
   wenn die Zielgruppe sie aktiv nutzt.
3. **Du/Sie:** Hauptsite + B2B = **Sie**. Konsequent je Sprache/Namespace.
4. **Aktiv vor Passiv**, kurze Sätze, eine Aussage pro Satz.
5. **Zahlen & Einheiten** über `Intl.*` mit Request-Locale — nie hartkodiertes
   `en-US`/`toLocaleString()` (§5.5).

## Klartext-Fehler (Pflichtmuster: _Was · Warum · Lösung_)

Jede Fehlermeldung nennt **was** passiert ist und **was der Nutzer jetzt tun
kann** — niemals ein Stacktrace, Fehlercode-Kauderwelsch oder Schuldzuweisung.

- ✅ „Diese Seite konnte nicht geladen werden. Bitte laden Sie sie neu — Ihre
  Daten sind nicht verloren." (`common:errors.root.body`)
- ✅ „Dieser Bereich konnte nicht geladen werden. Der Rest der Seite funktioniert
  weiterhin. Bitte versuchen Sie es erneut." (`common:errors.segment.body`)
- ✅ Formularfehler inline, programmatisch verknüpft (`aria-describedby` /
  `role="alert"`), mit konkretem Hinweis: „Bitte geben Sie eine gültige
  E-Mail-Adresse ein." statt „Ungültige Eingabe."
- ❌ „Error 500", „undefined is not a function", „FEHLER!!!"

Implementierungs-Anker: `src/routing/RootErrorBoundary.tsx`,
`src/routing/SegmentErrorBoundary.tsx`, `src/design-system/compound/form-field.tsx`,
`src/design-system/feedback/alert.tsx`.
