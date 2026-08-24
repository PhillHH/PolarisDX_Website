# TRACKING-CONTRACT

**Guard-Level: G3.** Wer eine der in §3 genannten Kerndateien ändert, folgt zwingend der
Kontextpflicht in §7. Blindes Editieren ist untersagt.

> ## ⚠ Current-State-Warnung
>
> **Die aktuelle Baseline ist NON_COMPLIANT gegenüber `REST-02`.** Fünf Ereignis-/Netzsysteme
> koexistieren; **vier davon umgehen jede Einwilligungsprüfung**, und das einzige korrekt gegatete
> System ist nicht registriert und damit wirkungslos (`CONSENT-TRACKING-NETWORK-BASELINE.md` §7).
> **Dieser Vertrag beschreibt SOLL-Verhalten** und ist kein Beleg für Konformität.

---

## 1. Purpose

Dieser Vertrag legt fest, **wie** ein Analytics- oder Marketing-Ereignis entsteht, geprüft und zugestellt
wird — und verbietet jeden Weg daran vorbei.

Er ist die **mittlere Schicht** der Kette `Consent → Tracking → Netzwerk`. Die Einwilligung entscheidet
`CONSENT-CONTRACT.md`; welche Origin überhaupt kontaktiert werden darf, entscheidet
`NETWORK-ALLOWLIST.md`. Dieser Vertrag entscheidet nur, **was** gesendet wird und **über welchen Pfad**.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`DEC-RL-004`** (kein Tracking, kein Event-Puffern vor Consent), **`REST-02`**,
**AP23 PT23.2** (Fassade), **AP23 PT23.3** (Taxonomie), **AP23 PT23.4** (Container), **AP23 PT23.5**
(Performance-Monitoring getrennt).

**Mitbetroffene APs:** AP06 (Shell-Ereignisse), AP11 PT11.5.6–.7, AP15 PT15.6.10 (Epigenetik-Inquiry),
AP16 (Musterbefunde), AP19 PT19.3.10 (Gated Download), AP20 PT20.2.7 (Contact),
AP21 PT21.5.9 (Consumer Order), AP22 PT22.6.6 (neue Journeys), AP25 (Web Vitals),
AP27 PT27.4 (Consent-/Tracking-E2E), AP30 PT30.4.6, AP33 PT33.3.6 (Wartungsregel „neuer Tracking-Event").

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files

**Zu konsolidieren — heute fünf Systeme:**

| System                     | Datei                                           | Consent-Gate heute           | Zielrolle                                                                                                                                              |
| -------------------------- | ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A · kanonische Fassade** | `src/lib/tracking.ts`                           | ✅ zwei Sperren, kein Puffer | **wird der einzige Pfad**                                                                                                                              |
| B · Consumer-Helfer        | `src/pages/consumer/tracking.ts`                | ❌                           | **auflösen** in A                                                                                                                                      |
| C · SPA-Pageview           | `src/components/analytics/GtmPageview.tsx`      | ❌                           | **auflösen** in A                                                                                                                                      |
| D · Consumer-Bestellung    | `src/pages/consumer/OrderForm.tsx` (`:164-168`) | ❌                           | **auflösen** in A                                                                                                                                      |
| E · Consumer-Modal         | `src/pages/consumer/OrderModal.tsx` (`:84-85`)  | ❌                           | **auflösen** in A                                                                                                                                      |
| — · Consent-Signalgeber    | `src/components/ui/CookieBanner.tsx` (`:43-88`) | n/a                          | **behält nur Consent-Signale**; sein Ereignisverhalten (Nach-`page_view`, `consent_update`-Push) wandert nach A, soweit die Konsolidierung es verlangt |

**Weitere Beteiligte:** `src/lib/useScrollDepth.ts` (Emittent über A) · `index.html` (definiert `gtag`
und `dataLayer`) · `src/App.tsx` (hängt C ein) · `server.ts` (CSP) · `src/pages/EpigeneticsPage.tsx` und
`src/components/befund/BefundBlocks.tsx` (heutige A-Aufrufer).

---

## 4. Target Invariants

### Einziger Pfad

**T-01 · Jedes Analytics-/Marketing-Ereignis läuft über genau einen consent-bewussten,
providerneutralen Pfad.** Kein zweiter Weg, keine Ausnahme „nur für dieses eine Event".
_(AP23 PT23.2.1, PT23.2.6)_

**T-02 · Kein Feature, keine Seite und keine Sektion schreibt direkt nach `window.dataLayer`, ruft
`window.gtag` auf oder spricht ein Provider-SDK an** — es sei denn, sie **ist** die kanonische
Implementierung, die diese Integration besitzt. _(AP23 PT23.2.3)_

**T-03 · Der Consent-Guard liegt zentral**, im Sendepfad selbst — nicht bei den Aufrufern verteilt.
Ein Aufrufer darf gefahrlos jederzeit senden; die Entscheidung fällt an einer Stelle.
_(AP23 PT23.2.6)_

### Provider-Lebenszyklus

**T-04 · Provider werden bewusst registriert und wieder abgemeldet.** `setTrackingProvider(fn)` beim
Aktivieren, `setTrackingProvider(null)` beim Widerruf; `setTrackingConsent(true|false)` spiegelt den
kanonischen Consent-Zustand. Ohne Registrierung ist der Pfad ein No-Op. _(AP23 PT23.2.2)_

**T-05 · Ohne Provider **und** ohne Einwilligung geschieht nichts.** Beide Bedingungen sind
unabhängig; eine allein genügt nie.

**T-06 · Kein Puffern vor oder nach dem Widerruf.** Ereignisse ohne gültige Einwilligung werden
**verworfen**. Keine Queue, kein Retry, kein Nachsenden. _(AP23 PT23.1.9, `DEC-RL-004`)_

**T-07 · Ein Providerfehler bricht niemals die Bedienung.** Der Aufruf des Providers fängt seine
eigenen Fehler; eine kaputte Messung hält die Seite nicht an.

**T-08 · Widerruf wirkt sofort auf den Sendepfad.** Nach `setTrackingConsent(false)` verlässt kein
weiteres Ereignis das Modul; die vollständige Widerrufswirkung regelt `CONSENT-CONTRACT.md` C-19.

### Nutzlast

**T-09 · Ereignisse sind typisiert.** Name und Nutzlast sind im Typsystem festgelegt; ein Ereignis
außerhalb der Union ist nicht sendbar. _(AP23 PT23.2.4)_

**T-10 · Keine personenbezogenen Daten in Ereignissen.** Keine Namen, E-Mail-Adressen, Telefonnummern,
Freitexte oder Formularinhalte — weder als Parameter noch als Teil eines zusammengesetzten Werts.
_(AP23 PT23.2.5, PT23.4.5)_

**T-11 · Fremdwerte werden gegen eine Allowlist geprüft, bevor sie das Modul verlassen.** Werte aus URL,
`localStorage` oder Nutzereingabe dürfen nicht als frei wählbarer Text in einer Auswertung landen.
Vorbild ist die bestehende Slug-Prüfung in `src/lib/tracking.ts`.

**T-12 · URLs werden nicht ungefiltert übertragen.** Wird ein Pfad gemeldet, wird der **Pfad** gemeldet;
Query-Parameter durchlaufen eine ausdrückliche Allowlist. Ein „volle `href` mitsenden" ist unzulässig,
weil jeder künftige Parameter automatisch mitreisen würde.

### Vokabular

**T-13 · Das Ereignisvokabular hat genau einen Eigentümer: AP23.** Kein Seiten-AP erfindet Ereignisnamen
oder Parameter. Wer ein neues Ereignis braucht, beantragt es bei AP23; die Definition entsteht zentral.
_(AP23 PT23.3)_

**T-14 · Der Master-Scope legt die Conversion-Kategorien fest** (AP23 PT23.3): `page_view`/SPA-Navigation,
`contact_submit`, `support_submit`, `consumer_order_submit`, `roi_report_request`,
`epigenetics_inquiry_submit`, `lead_magnet_submit`, `download_delivered` sowie relevante CTA-, Panel-,
Such- und Outbound-Ereignisse. **Die endgültigen GA4-Namen und Parameterschemata sind noch nicht
entschieden** — sie definiert AP23 PT23.3/PT23.4 gemeinsam mit dem Container. Bis dahin gilt:
**Regel und Eigentum stehen fest, die Geschäftssemantik nicht.** Kein Agent erfindet sie vorweg.

**T-15 · Jede Journey meldet ihre Conversion über den kanonischen Pfad** — Contact, Support,
Consumer Order, ROI-Report, Epigenetik-Inquiry, Lead-Magnet, Download-Zustellung. Heute meldet nur die
Consumer-Bestellung überhaupt etwas. _(AP23 PT23.3.2–.8)_

**T-16 · Scrolltiefe und Interaktionsereignisse folgen denselben Regeln** — typisiert, allowlist-geprüft,
consent-gegatet. Der bestehende `useScrollDepth`-Mechanismus (vier Stufen, je Seitenaufruf einmal) bleibt
das Muster.

### Sauberkeit

**T-17 · Keine Doppelzählung.** Ein Seitenaufruf erzeugt genau ein `page_view`. Bekannte Quellen für
Doppelzählung sind auszuschließen: der Initial-Pageview des Containers, der SPA-Pageview und ein
Nach-Feuern beim Zustimmen. _(AP23 PT23.3.10)_

**T-18 · Technische Observability läuft getrennt.** Web Vitals und Fehler-Reporting nutzen **nicht** den
Marketing-Pfad, haben eine eigene Rechts-/Betriebsgrundlage und enthalten keine PII.
_(AP23 PT23.5; Kandidat **B2** in `BRANCH-RECONCILIATION-MAP.md`, dessen Senke `/api/monitoring/_`
heute nicht existiert)\*

**T-19 · Preview/Staging erzeugen keine produktiven Messdaten.** Entweder ist kein Provider registriert,
oder er zeigt auf ein isoliertes Ziel. Vorbild ist der bestehende `DRY_RUN`-Schalter des Mailversands
(`server/server.js:51-63`) — ein äquivalenter, ausdrücklich deklarierter Schalter ist für Tracking
festzulegen. **Keine erfundenen Flags:** `DRY_RUN` existiert heute ausschließlich für E-Mail.
_(AGENT-CONTRACT Regel 18, AP28 PT28.1.5–.6)_

**T-20 · Provider-Integrationen sind austauschbar.** Die Fassade kennt keinen konkreten Anbieter; ein
Wechsel oder eine Ergänzung berührt nur die Registrierungsstelle, nicht die Aufrufer.

---

## 5. Current Known Debt

Ist-Zustand, **kein zulässiges Zielverhalten**.

| ID        | Schuld                                                                                                                                                                                            | Verletzt   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| **TD-1**  | **Fünf parallele Systeme** statt eines (§3)                                                                                                                                                       | T-01       |
| **TD-2**  | **Die kanonische Fassade ist nie registriert** — `setTrackingProvider`/`setTrackingConsent` werden nirgends aufgerufen; ihre vier typisierten Ereignisse laufen ins Leere                         | T-04, T-05 |
| **TD-3**  | **Zehn direkte `dataLayer`-Schreibzugriffe** außerhalb der Fassade — `consumer/tracking.ts`, `OrderForm.tsx`, `OrderModal.tsx`, `CookieBanner.tsx`, `GtmPageview.tsx`                             | T-02       |
| **TD-4**  | **Sieben direkte `gtag(`-Aufrufe** — fünf `consent update` in `CookieBanner.tsx`, ein `event page_view` dort (`:56`), einer in `GtmPageview.tsx:84`                                               | T-02       |
| **TD-5**  | **`GtmPageview` prüft nur `typeof gtag === 'function'`** — immer wahr, weil `gtag` im Bootstrap definiert wird                                                                                    | T-03       |
| **TD-6**  | **Zwei Doppelzählungsquellen** — SPA-`page_view` und der Nach-Feuer-`page_view` beim Zustimmen, zusätzlich zum Container-Initial-Pageview. `__pvOnGrantFired` schützt nur innerhalb einer Session | T-17       |
| **TD-7**  | **`page_location` überträgt die volle URL inkl. Query** in drei Ereignissen                                                                                                                       | T-12       |
| **TD-8**  | **Von der geforderten Taxonomie existiert genau ein Ereignis** (`consumer_order_submit`); fünf Lead-Journeys melden gar nichts                                                                    | T-15       |
| **TD-9**  | **Kein Web-Vitals-Sammler im aktiven Baum**; die Senke `/api/monitoring/*` existiert in keinem Server                                                                                             | T-18       |
| **TD-10** | **Kein Tracking-/Consent-Test** — weder Unit noch E2E                                                                                                                                             | §8         |
| **TD-11** | **Kein Tracking-`DRY_RUN`-Äquivalent** — Preview kann heute produktive Messdaten erzeugen, sobald ein Provider registriert wird                                                                   | T-19       |

**Positiv zu erhalten:** `src/lib/tracking.ts` erfüllt T-03, T-05 bis T-11 und T-20 bereits. Es ist die
**Zielarchitektur im Kleinen** und wird ausgebaut, nicht ersetzt — `BRANCH-RECONCILIATION-MAP.md` **N9**
verbietet ausdrücklich, es durch `main`s direkte `dataLayer`-Variante zu ersetzen.

---

## 6. Modification Rules

**M-01 — Konsolidieren, nicht ergänzen.** Systeme B–E werden **in** A aufgelöst. Ein sechstes System
anzulegen ist unzulässig, auch „vorübergehend".

**M-02 — Reihenfolge:** erst Consent-Fundament (`CONSENT-CONTRACT.md` C-01 bis C-08), dann
Provider-Registrierung, dann Instrumentierung. **Vor der Consent-Entscheidung geschriebene Aufrufe sind
Nacharbeit** — die Serialisierungsbarriere S3 aus `IMPLEMENTATION-HOTSPOTS.md` bleibt hart, bis dieser
Vertrag und `CONSENT-CONTRACT.md` umgesetzt sind.

**M-03 — `src/lib/tracking.ts` niemals durch `main`s Fassung ersetzen** (**N9**). Erweitern ja, ersetzen
nein. Die Reconciliation-Kandidaten **A2**, **A3** und **A20** sind an die Fassaden-API anzupassen, nicht
umgekehrt.

**M-04 — Ein neues Ereignis entsteht in drei Schritten:** Antrag an AP23 → zentrale Typdefinition und
Allowlist-Regel → Aufruf im Feature. Nie in umgekehrter Reihenfolge.

**M-05 — Beim Entfernen eines Providers** werden Registrierung, Ereignisse, Consent-Kategorie und
CSP-Eintrag im selben Arbeitsschritt entfernt (`CONSENT-CONTRACT.md` C-24).

**M-06 — Container-Konfiguration ist kein Repository-Zustand.** Welche Tags im GTM-Container liegen, ist
von hier nicht prüfbar. Wer Code-seitig ein Ereignis einführt, dokumentiert die erwartete
Container-Gegenseite für AP23 PT23.4 — und behauptet nicht, sie sei erledigt.

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an einer Datei aus §3:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP23**)
4. `building-docs/CONSENT-CONTRACT.md`
5. **`building-docs/TRACKING-CONTRACT.md`** (dieses Dokument)
6. `building-docs/NETWORK-ALLOWLIST.md` — sobald externe Origins oder die CSP berührt sind
7. `building-docs/state/AP-STATE.md`
8. die aktuellen Quell- und Testdateien aus §3
9. `git diff -- <Datei>` **vor** der Änderung

Danach: die Prüfungen aus §8 ausführen.

---

## 8. Required Tests / Guards

**Laufzeit** — Playwright mit Request-Protokollierung und `route.abort()` für externe Ziele:

| #        | Szenario                     | Erwartung                                                                      |
| -------- | ---------------------------- | ------------------------------------------------------------------------------ |
| **T-G1** | frischer Zustand / Ablehnung | **kein** Ereignis verlässt den Pfad, **kein** Provider-Request                 |
| **T-G2** | Analytics akzeptiert         | Pageview und Ereignisse werden **genau einmal** zugestellt                     |
| **T-G3** | Marketing akzeptiert         | nur ausdrücklich erlaubte Marketing-Provider aktiv                             |
| **T-G4** | Widerruf                     | keine weiteren Ereignisse; Provider gemäß C-19 zurückgesetzt                   |
| **T-G5** | kein Nachsenden              | nach nachträglicher Zustimmung werden **keine** früheren Ereignisse zugestellt |
| **T-G6** | Consumer                     | identische Semantik wie im übrigen Auftritt                                    |
| **T-G7** | Doppelzählung                | ein Seitenaufruf ⇒ genau ein `page_view`; SPA-Navigation ⇒ genau eines         |

**Statisch** (Node/Vitest — verfügbar, `QUALITY-BASELINE-LIVE.md` §9.2):

| #         | Guard                                                                              | Fängt heute         |
| --------- | ---------------------------------------------------------------------------------- | ------------------- |
| **T-G8**  | keine `window.dataLayer`-Schreibzugriffe außerhalb der kanonischen Implementierung | 10 Fundstellen      |
| **T-G9**  | keine `gtag(`-Aufrufe außerhalb der kanonischen Implementierung                    | 7 Fundstellen       |
| **T-G10** | kein Ereignis mit PII-fähigem Parameter (Freitext, E-Mail-Muster, volle URL)       | `page_location` × 3 |
| **T-G11** | jedes gesendete Ereignis liegt in der zentralen Typunion                           | —                   |

**Unit:** Sendepfad ohne Provider ⇒ No-Op · ohne Einwilligung ⇒ No-Op · unbekannter Slug ⇒ verworfen ·
Providerfehler ⇒ geschluckt · `setTrackingProvider(null)` ⇒ sofort still. _(AP27 PT27.1.4)_

T-G8 bis T-G10 sind so zu schreiben, dass sie **heute rot sind**.

---

## 9. Forbidden Regressions

- ❌ **Direkt nach `window.dataLayer` schreiben oder `window.gtag` aufrufen** außerhalb der kanonischen Implementierung
- ❌ Ein Provider-SDK direkt in einer Seite oder Sektion einbinden
- ❌ Ein sechstes paralleles Ereignissystem anlegen
- ❌ **Ereignisse vor Consent puffern oder nach Zustimmung nachsenden**
- ❌ Den Consent-Guard aus dem Sendepfad in die Aufrufer verlagern
- ❌ `src/lib/tracking.ts` durch `main`s `trackEvent`-Variante ersetzen (**N9**)
- ❌ Untypisierte Ereignisse oder freie Parameterobjekte senden
- ❌ **PII in einer Ereignisnutzlast** — auch nicht in einem zusammengesetzten String
- ❌ **Die volle URL inklusive Query ungefiltert übertragen**
- ❌ Ereignisnamen oder Parameter außerhalb von AP23 erfinden
- ❌ Endgültige GA4-Namen festschreiben, bevor AP23 PT23.3/PT23.4 sie entschieden hat
- ❌ Mehr als ein `page_view` je Seitenaufruf erzeugen
- ❌ Web Vitals oder Fehler-Reporting über den Marketing-Pfad leiten
- ❌ In Preview/Staging produktive Messdaten erzeugen
- ❌ Einen Provider entfernen und seine Ereignisse, Kategorie oder CSP-Rechte stehenlassen

---

## 10. AP Ownership / Lifecycle

| Phase                | AP                                 | Ergebnis                                                                               |
| -------------------- | ---------------------------------- | -------------------------------------------------------------------------------------- |
| Voraussetzung        | **AP23 PT23.1**                    | Consent-Fundament — ohne es keine Instrumentierung                                     |
| **Fassade/Eigentum** | **AP23 PT23.2**                    | providerneutraler Kern, bewusste Registrierung, typisierte Ereignisse, zentraler Guard |
| **Vokabular**        | **AP23 PT23.3**                    | Pageview- und Conversion-Taxonomie; **Namen und Parameter werden hier entschieden**    |
| Container            | **AP23 PT23.4**                    | Abbildung im GTM-Container, Kern-Conversions, Consent-Szenarien                        |
| Observability        | **AP23 PT23.5 / AP25**             | Web Vitals getrennt, ohne PII                                                          |
| Konsum               | AP06, AP11, AP15, AP16, AP19–AP22  | Journeys melden über den kanonischen Pfad                                              |
| Isolation            | **AP28 PT28.1.5–.6**               | Preview/Staging ohne produktive Messdaten                                              |
| Absicherung          | **AP27 PT27.4**                    | Consent-/Tracking-E2E — Voraussetzung für Gate 2                                       |
| Abnahme              | **AP30 PT30.4.6**, **AP31 PT31.4** | Analytics-QA und Livecheck                                                             |
| Betrieb              | **AP32 PT32.3**                    | Plausibilität, Null-/Doppel-Ereignisse                                                 |
| Wartungsregel        | **AP33 PT33.3.6**                  | „neuer Tracking-Event" als dauerhafte Prozedur                                         |

**Änderungen an diesem Vertrag** verantwortet AP23. Decision Locks werden hier nie geändert.
