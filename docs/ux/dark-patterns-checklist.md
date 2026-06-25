# Dark-Pattern-Checkliste — je Flow

Belegt **Phase 5, DoD-Punkt 6** („Dark-Pattern-Checkliste je Flow grün").
Geprüft gegen die etablierte Taxonomie (Brignull / deceptive.design). „✅" = im
Code/Content bestätigt; „➖" = nicht zutreffend; „⚠️" = ASSUMPTION, menschliche
Bestätigung empfohlen.

## Querschnitt (gilt für alle Flows)

| Dark Pattern                                  | Status | Beleg                                                                                            |
| --------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| Sneaking (versteckte Kosten/Posten)           | ✅     | Preise sichtbar (`PriceBadge`); keine still hinzugefügten Artikel.                               |
| Forced Action (Zwangshandlung)                | ✅     | Kein Wall vor Inhalten; Inhalte ohne Account lesbar.                                             |
| Nagging (wiederholtes Bedrängen)              | ✅     | Cookie-Banner einmalig (Entscheidung in `localStorage`); kein Re-Prompt.                         |
| Obstruction (erschwertes Ausstiegs-/Ablehnen) | ✅     | Ablehnen so leicht wie Zustimmen (s. Consent).                                                   |
| Confirmshaming (Schuld-Sprache beim Ablehnen) | ✅     | Keine abwertenden „Nein, ich will nicht …"-Texte (Voice-Regel).                                  |
| Misdirection / falsche Hierarchie             | ✅     | Genau ein dominanter CTA je View (Phase 3); Ablehnen visuell gleichwertig.                       |
| Fake Urgency / Scarcity                       | ⚠️     | Keine Countdown-/„nur noch X"-Mechaniken gefunden; bei künftigen Promo-Bausteinen erneut prüfen. |

## Flow 1 — Cookie-/Consent (GTM Consent Mode v2)

| Check                                        | Status | Beleg                                                                  |
| -------------------------------------------- | ------ | ---------------------------------------------------------------------- |
| Default = abgelehnt (kein Pre-Opt-in)        | ✅     | `index.html`: `analytics_storage`/`ad_storage` = `denied` per Default. |
| „Ablehnen" gleich erreichbar wie „Zustimmen" | ✅     | `CookieBanner` — gleichwertige Aktionen, keine versteckte Ablehnung.   |
| Keine vorausgewählten Marketing-Häkchen      | ✅     | Granulare Kategorien, opt-in.                                          |
| Entscheidung widerrufbar                     | ✅     | Erneut über Banner/Einstellungen änderbar.                             |

## Flow 2 — Beratungsanfrage / Kontakt (B2B)

| Check                                                 | Status | Beleg                                                                            |
| ----------------------------------------------------- | ------ | -------------------------------------------------------------------------------- |
| Nur nötige Felder; ein `fullName` statt first/last    | ✅     | Keine `firstName`/`lastName`-Trennung im Code (§5.5).                            |
| Klartext-Validierung inline, schuldfrei               | ✅     | `form-field` + `alert` (`aria-describedby`/`role="alert"`).                      |
| Kein erzwungenes Marketing-Opt-in für die Kern-Aktion | ⚠️     | Sichtprüfung Kontaktformular empfohlen (Marketing-Einwilligung optional halten). |
| Erfolg ehrlich kommuniziert (kein Fake-Confirm)       | ✅     | Success-State zeigt realen Folgeschritt (Voice-Muster).                          |

## Flow 3 — Consumer-Bestellung (Spray/Maske/Duo)

| Check                                         | Status | Beleg                                                            |
| --------------------------------------------- | ------ | ---------------------------------------------------------------- |
| Packungsgröße & Preis vor dem CTA sichtbar    | ✅     | `PriceBadge` + Pack-Angabe je Seite (Consumer-Brief).            |
| Modal mit Esc/Close, kein Trap                | ✅     | `OrderModal` schließbar (Esc/Close), Fokus-Handling.             |
| Keine versteckten Gebühren/Auto-Abos          | ✅     | Einmalkauf, keine Abo-Voreinstellung im Flow.                    |
| Mengen-/Bundle-Wahl ohne Trick-Voreinstellung | ✅     | Auswahl explizit, kein teuerstes Bundle vorselektiert als Falle. |

## Flow 4 — Navigation & Abschluss-Hinweise

| Check                                                           | Status | Beleg                                      |
| --------------------------------------------------------------- | ------ | ------------------------------------------ |
| Externe/rechtliche Links auffindbar (Impressum/Datenschutz/AGB) | ✅     | Footer-Links vorhanden; eigene Routen.     |
| Disclaimer bei Gesundheitsaussagen                              | ✅     | `Disclaimer`-Baustein auf Consumer-Seiten. |
| Kein Zwangs-Newsletter vor Inhalt                               | ✅     | Kein Interstitial-Gate gefunden.           |

---

**Fazit:** Alle bestätigten Checks grün; 3 ⚠️-Punkte sind ASSUMPTIONS
(künftige Promo-Bausteine, Marketing-Einwilligung im Kontaktformular) für die
menschliche Freigabe (§1.17), kein aktiver Dark Pattern im aktuellen Stand.
