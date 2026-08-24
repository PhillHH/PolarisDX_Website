# NETWORK-ALLOWLIST

**Guard-Level: G3.** Wer die CSP in `server.ts`, `index.html` oder eine Provider-Einbindung ändert,
folgt zwingend der Kontextpflicht in §7. Blindes Editieren ist untersagt.

> ## ⚠ Current-State-Warnung
>
> **Die aktuelle Baseline ist NON_COMPLIANT gegenüber `REST-02`.** Der Laufzeitbeweis
> (`CONSENT-TRACKING-NETWORK-BASELINE.md` §15) hat **vor jeder Einwilligung** Anfragen an
> `https://www.googletagmanager.com` und `https://widget.hihuman.co.uk` nachgewiesen — im Zustand
> „keine Entscheidung" **und** „ausdrücklich abgelehnt" identisch.
> **Dieser Vertrag beschreibt SOLL-Verhalten** und ist kein Beleg für Konformität.

---

## 1. Purpose

Dieser Vertrag legt fest, **welche externen Origins die Laufzeit überhaupt kontaktieren darf**, unter
welcher Bedingung, und was die CSP entsprechend erlauben muss.

Er ist die **unterste Schicht** der Kette `Consent → Tracking → Netzwerk`. Er entscheidet nicht, _ob_
gemessen wird (`CONSENT-CONTRACT.md`) und nicht, _was_ gesendet wird (`TRACKING-CONTRACT.md`) — sondern
**wohin überhaupt eine Verbindung entstehen darf.**

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **`REST-02`** (vollständiger Ladeverzicht vor Consent), **`DEC-RL-004`**,
**`DEC-RL-007`** (_„Kein Chat im Relaunch; HiHuman, Chat-Loader, `/api/chat`-Mock und zugehörige
produktive Reste werden entfernt"_), **AP26 PT26.2** (CSP), **AP23 PT23.1** (Ladeverzicht),
**AP25** (Fonts/Assets), **AP28** (Betrieb).

**Launch-Gates:** **Gate 2** (Consent), **Gate 5** (_„CSP ohne Chat-Domains"_), **Gate 12** (Operations/Security).

**Baseline:** `feat/home-leadmagnet@961f65d`. Keine Decision-Lock-Änderung durch diesen Vertrag.

---

## 3. Current Participating Files / Origins

| Datei                                                                                     | Rolle                                                                                | Guard  |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| `server.ts` (`:432-444`)                                                                  | aktive CSP — heute **`Content-Security-Policy-Report-Only`**, zehn Direktiven        | **G3** |
| `index.html`                                                                              | GTM-Loader (`:71-81`), `noscript`-iframe (`:188-201`) — die beiden Bootstrap-Origins | **G3** |
| `src/components/ui/ChatWidget.tsx`                                                        | injiziert das HiHuman-Bundle                                                         | **G3** |
| `src/entry-client.tsx` (`:23`)                                                            | `@fontsource-variable/inter` — **selbstgehostete** Schrift, keine CDN                | G1     |
| `src/components/layout/Footer.tsx`, `TeamSection.tsx`, `AboutPage.tsx`, `ImprintPage.tsx` | `href`-Ziele — **keine** Subressourcen                                               | G1     |
| `src/components/seo/structuredData.ts`                                                    | `schema.org` als `@context`-Bezeichner und `sameAs`-Angaben — **kein** Netzaufruf    | G2     |
| `public/robots.txt`                                                                       | Crawler-Policy                                                                       | G1     |

**Klassifikationsschema dieses Vertrags:**

| Klasse                    | Bedeutung                                                                        |
| ------------------------- | -------------------------------------------------------------------------------- |
| `ESSENTIAL`               | für die Auslieferung der Seite selbst nötig; darf ohne Consent laden             |
| `CONSENT_ANALYTICS`       | erst nach Analytics-Einwilligung                                                 |
| `CONSENT_MARKETING`       | erst nach Marketing-Einwilligung                                                 |
| `NAVIGATION_ONLY`         | ausschließlich `href`-Ziel; **keine** Laufzeitberechtigung, **kein** CSP-Eintrag |
| `FORBIDDEN`               | im Relaunch ausgeschlossen; weder Code noch CSP                                  |
| `STALE_REMOVE`            | heute in der CSP, ohne Laufzeitverwendung — entfernen                            |
| `UNKNOWN_REQUIRES_REVIEW` | Bedarf nicht aus dem Repository ableitbar; vor Freigabe klären                   |

---

## 4. Target Invariants

**N-01 · Selbst gehostet hat Vorrang.** Anwendungscode, Schriften, Bilder, Icons und Dokumente werden
von der eigenen Origin ausgeliefert. Eine externe Origin ist zu begründen, nicht der Normalfall.

**N-02 · Das Schriftmodell bleibt selbstgehostet.** Inter kommt über `@fontsource-variable/inter` aus
dem eigenen Bundle. **Keine Google-Fonts-CDN.** _(Master-Scope AP05 PT05.2.1/PT05.2.8)_

**N-03 · Vor der Einwilligung kontaktiert die Laufzeit ausschließlich `ESSENTIAL`-Origins.**
Alles andere lädt erst nach der zugehörigen Zustimmung. _(`REST-02`, `CONSENT-CONTRACT.md` C-01)_

**N-04 · Google-Tag-Manager- und Analytics-Origins sind consent-gegatet**, niemals `ESSENTIAL`.
_(AP26 PT26.2.2)_

**N-05 · HiHuman ist FORBIDDEN.** Weder `widget.hihuman.co.uk` noch `*.hihuman.co.uk` dürfen im Relaunch
in Code, Konfiguration oder CSP erscheinen. _(`DEC-RL-007`, Gate 5, AP26 PT26.2.1)_

**N-06 · Ein Navigationsziel begründet keine Laufzeitberechtigung.** Ein `<a href>` auf LinkedIn,
Instagram, einen Partner oder eine Behörde erzeugt keine Subressource und bekommt **keinen** CSP-Eintrag.
Wer aus einem solchen Ziel ein Widget, ein Bild oder ein Skript macht, ändert seine Klasse und braucht
eine neue Freigabe.

**N-07 · Die CSP spiegelt die tatsächliche Laufzeitnotwendigkeit.** Jeder Eintrag hat einen belegbaren
Verwender im Code. Ohne Verwender kein Eintrag. _(AP26 PT26.2.5)_

**N-08 · Kein pauschales `https:` in den restriktiven Direktiven der Zielpolicy.** `script-src`,
`connect-src`, `frame-src`, `style-src` und `font-src` führen benannte Origins. Eine Ausnahme ist
ausdrücklich zu begründen und zu befristen. _(AP26 PT26.2.5)_

**N-09 · Veraltete Origins werden entfernt**, nicht „sicherheitshalber" behalten.

**N-10 · Die CSP wandert von `Report-Only` zu einer durchsetzbaren Produktionspolicy.** `Report-Only`
ist nur mit funktionierendem Report-Empfänger zu betreiben; ohne Empfänger ist sie wirkungslos.
_(AP26 PT26.2.3–.4)_

**N-11 · Wer eine Funktion entfernt, entfernt ihre Netzrechte im selben Arbeitsschritt** — Ladepfad,
Consent-Kategorie und CSP-Eintrag. _(`CONSENT-CONTRACT.md` C-24)_

**N-12 · Eine neue Origin durchläuft vor der Freigabe drei Fragen:** Ist sie wirklich nötig? In welche
Klasse fällt sie? Welche Direktiven braucht sie mindestens? Ohne Antwort gilt `UNKNOWN_REQUIRES_REVIEW`
und kein Ladepfad.

**N-13 · Unbekannte Provideranforderungen werden nicht geraten.** Was ein Fremdskript nach dem Laden
kontaktiert, ist ohne Beleg nicht bestimmbar und rechtfertigt keine vorsorgliche Wildcard.

**N-14 · Preview- und Staging-Origins erscheinen nie in produktiven Artefakten** — weder in der CSP noch
in Canonical, Sitemap oder OG. _(`SEO-CONTRACT.md` S-15, AP29 PT29.3.3)_

---

## Origin Classification Table

Bestandsaufnahme aus `CONSENT-TRACKING-NETWORK-BASELINE.md` §9 und §10, mit Zielklassifikation.
**„Runtime Permission" beschreibt den SOLL-Zustand**, nicht den heutigen.

| Origin                         | Purpose                                                   | Target Classification                                                   | Consent Required?  | Runtime Permission                                                                                                                                  |
| ------------------------------ | --------------------------------------------------------- | ----------------------------------------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `www.googletagmanager.com`     | Tag-Manager-Container (`gtm.js`, `ns.html`)               | **CONSENT_ANALYTICS** _(bzw. CONSENT_MARKETING, je nach geladenem Tag)_ | **JA**             | erst nach Einwilligung: `script-src`, `connect-src`; `frame-src` nur, falls ein Tag es nachweislich braucht. **Kein `noscript`-iframe vor Consent** |
| `www.google-analytics.com`     | GA4-Erfassung                                             | **CONSENT_ANALYTICS**                                                   | **JA**             | erst nach Analytics-Einwilligung: `connect-src`                                                                                                     |
| `region1.google-analytics.com` | regionaler GA4-Endpunkt                                   | **CONSENT_ANALYTICS**                                                   | **JA**             | wie oben; nur beibehalten, wenn tatsächlich angesprochen                                                                                            |
| `ssl.google-analytics.com`     | historische GA-Domain                                     | **STALE_REMOVE**                                                        | —                  | **keine** — von GA4 nicht mehr verwendet; aus `script-src` entfernen                                                                                |
| `stats.g.doubleclick.net`      | Ads-/Remarketing-Signale                                  | **CONSENT_MARKETING**                                                   | **JA (Marketing)** | ausschließlich nach Marketing-Einwilligung: `connect-src`. Ohne aktives Ads-Ziel: entfernen                                                         |
| `widget.hihuman.co.uk`         | Chat-Widget-Bundle                                        | **FORBIDDEN**                                                           | —                  | **keine.** Aus Code **und** aus `script-src`, `connect-src`, `frame-src` entfernen (`DEC-RL-007`, Gate 5)                                           |
| `*.hihuman.co.uk`              | Chat-Rückkanäle (Wildcard)                                | **FORBIDDEN**                                                           | —                  | **keine.** Aus `connect-src` entfernen                                                                                                              |
| `fonts.googleapis.com`         | Google-Fonts-Stylesheet                                   | **STALE_REMOVE**                                                        | —                  | **keine** — Fonts sind selbstgehostet (`entry-client.tsx:23`); aus `style-src` entfernen                                                            |
| `fonts.gstatic.com`            | Google-Fonts-Dateien                                      | **STALE_REMOVE**                                                        | —                  | **keine** — dito; aus `font-src` entfernen                                                                                                          |
| `www.linkedin.com`             | Social-Profil-Links, `sameAs` im Schema                   | **NAVIGATION_ONLY**                                                     | —                  | **keine.** Kein CSP-Eintrag. Ein LinkedIn-Insight-Tag wäre eine **neue** Origin-Entscheidung nach N-12                                              |
| `www.instagram.com`            | Social-Profil-Link im Footer                              | **NAVIGATION_ONLY**                                                     | —                  | **keine.** Kein CSP-Eintrag                                                                                                                         |
| `ec.europa.eu`                 | OS-Plattform-Link im Impressum (rechtlich vorgeschrieben) | **NAVIGATION_ONLY**                                                     | —                  | **keine.** Kein CSP-Eintrag. Der Link selbst bleibt bestehen                                                                                        |
| `dx365.world`                  | Partner-Link auf der About-Seite                          | **NAVIGATION_ONLY**                                                     | —                  | **keine.** Kein CSP-Eintrag                                                                                                                         |
| `polarisdx.net`                | eigene Origin: Canonical, Sitemap, Assets, `/api`         | **ESSENTIAL**                                                           | nein               | `default-src 'self'` deckt die Auslieferung; Canonical/Sitemap sind Inhalte, keine Subressourcen                                                    |
| `schema.org`                   | `@context`-Bezeichner in JSON-LD                          | **NAVIGATION_ONLY** _(faktisch: kein Netzaufruf)_                       | —                  | **keine.** Ein `@context`-Wert wird nicht abgerufen; **niemals** in die CSP aufnehmen                                                               |

**15 Origins klassifiziert.** Verteilung im Zielbild: 1 × `ESSENTIAL` · 3 × `CONSENT_ANALYTICS` ·
1 × `CONSENT_MARKETING` · 2 × `FORBIDDEN` · 3 × `STALE_REMOVE` · 5 × `NAVIGATION_ONLY` ·
0 × `UNKNOWN_REQUIRES_REVIEW`.

**Nicht klassifizierbar und deshalb nicht aufgenommen:** was das HiHuman-Bundle nach dem Laden
kontaktiert. Da die Origin `FORBIDDEN` ist, entfällt die Frage — sie wird nicht ersatzweise durch eine
Wildcard beantwortet (N-13).

---

## 5. Current Known Debt

| ID       | Schuld                                                                                                                                                                                                  | Verletzt               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **ND-1** | **Zwei nicht-essenzielle Origins laden vor Consent** — `googletagmanager.com` und `widget.hihuman.co.uk`, nachgewiesen im Zustand „keine Entscheidung" **und** „abgelehnt"                              | N-03, N-04, N-05       |
| **ND-2** | **Pauschales `https:` in sechs Direktiven** — `script-src`, `connect-src`, `img-src`, `style-src`, `font-src`, `frame-src`. Damit ist jede HTTPS-Origin erlaubt und die namentliche Liste bedeutungslos | N-07, N-08             |
| **ND-3** | **`'unsafe-inline'` und `'unsafe-eval'` in `script-src`** — auch im Enforce-Modus keine wirksame Skriptbegrenzung                                                                                       | N-10                   |
| **ND-4** | **CSP ist `Report-Only` ohne `report-uri`/`report-to`** — sie blockiert nichts und meldet an niemanden                                                                                                  | N-10                   |
| **ND-5** | **Drei veraltete Origins in der CSP** — `ssl.google-analytics.com`, `fonts.googleapis.com`, `fonts.gstatic.com`; keine hat einen Verwender im Code                                                      | N-07, N-09             |
| **ND-6** | **HiHuman in drei Direktiven erlaubt** — `script-src`, `connect-src` (inkl. Wildcard `*.hihuman.co.uk`), `frame-src`                                                                                    | N-05                   |
| **ND-7** | **Kein `Strict-Transport-Security`** — HSTS fehlt am produktiven Origin                                                                                                                                 | Gate 12, AP26 PT26.1.2 |
| **ND-8** | **Kein Netz-Guard** — keine Prüfung stellt fest, welche Origins die Seite tatsächlich anfordert                                                                                                         | §8                     |

**Positiv zu erhalten:** Der Schriftpfad ist bereits selbstgehostet (N-02 erfüllt); `default-src 'self'`,
`base-uri 'self'`, `object-src 'none'` und `frame-ancestors 'self'` sind korrekt gesetzt und bleiben.

---

## 6. Modification Rules

**M-01 — Origin zuerst klassifizieren, dann einbauen.** Kein Ladepfad ohne Eintrag in der Tabelle oben.
Neue Origins nach N-12.

**M-02 — CSP-Änderungen sind Vier-Augen-Sache mit AP26.** Eine Direktive zu erweitern ist eine
Sicherheitsentscheidung, keine Implementierungsdetail-Frage.

**M-03 — Entfernen läuft in drei Schritten:** Verwender im Code entfernen → CSP-Eintrag entfernen →
Guard ergänzen, der die Rückkehr verhindert. Für HiHuman zusätzlich: `ChatWidget.tsx` samt Einhängung
**und** `POST /api/chat` (`CONSENT-CONTRACT.md` M-04).

**M-04 — Reihenfolge zur Enforce-Policy:** erst verbotene und veraltete Origins entfernen (N-05, N-09),
dann `https:`-Fallbacks abbauen (N-08), dann einen funktionierenden Report-Empfänger einrichten,
dann Enforce. _(AP26 PT26.2.3–.4)_

**M-05 — `server.ts` nie als Datei aus `main` übernehmen** (**N1** in `BRANCH-RECONCILIATION-MAP.md`).
Der Kandidat **A19** (HiHuman-Domains aus der CSP entfernen) ist als **Hunk** vorgesehen und gehört zu
AP26/AP23, nicht zu einem frühen Import.

**M-06 — Wildcards nur mit Beleg und Befristung.** Eine Subdomain-Wildcard setzt voraus, dass die
konkreten Subdomains nicht bekannt sein _können_ — nicht, dass sie nicht ermittelt wurden.

---

## 7. Required Agent Context

**Dieser Vertrag ist G3.** Vor jeder Änderung an der CSP, an `index.html` oder an einer
Provider-Einbindung:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt (mindestens **AP26 PT26.2**, bei Providern zusätzlich **AP23**)
4. `building-docs/CONSENT-CONTRACT.md`
5. `building-docs/TRACKING-CONTRACT.md` — sobald Ereignisse oder Provider berührt sind
6. **`building-docs/NETWORK-ALLOWLIST.md`** (dieses Dokument)
7. `building-docs/state/AP-STATE.md`
8. die aktuellen Quell- und Testdateien aus §3
9. `git diff -- <Datei>` **vor** der Änderung

Danach: die Prüfungen aus §8 ausführen.

---

## 8. Required Tests / Guards

**Laufzeit** — Playwright mit Request-Protokollierung; externe Ziele werden protokolliert und
**abgebrochen**, damit kein realer Provider erreicht wird (Methode: `CONSENT-TRACKING-NETWORK-BASELINE.md` §15):

| #        | Szenario                                     | Erwartung                                              |
| -------- | -------------------------------------------- | ------------------------------------------------------ |
| **N-G1** | frischer Zustand, keine Entscheidung         | **ausschließlich `ESSENTIAL`-Origins** angefordert     |
| **N-G2** | ausdrückliche Ablehnung                      | identisch zu N-G1                                      |
| **N-G3** | Analytics akzeptiert                         | zusätzlich **nur** `CONSENT_ANALYTICS`-Origins         |
| **N-G4** | Marketing akzeptiert                         | zusätzlich **nur** `CONSENT_MARKETING`-Origins         |
| **N-G5** | Consumer-Seiten                              | identische Origin-Mengen wie im übrigen Auftritt       |
| **N-G6** | jede beobachtete Origin steht in der Tabelle | eine unklassifizierte Origin lässt den Lauf rot werden |

**Statisch:**

| #         | Guard                                                                                                        | Fängt heute                        |
| --------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| **N-G7**  | **keine HiHuman-Referenz** in Quellcode, Konfiguration oder CSP                                              | `ChatWidget.tsx`, 3 CSP-Direktiven |
| **N-G8**  | **kein unbedingter GTM-Loader in `index.html`**                                                              | `index.html:71-81`, `:188-201`     |
| **N-G9**  | kein pauschales `https:` in `script-src`, `connect-src`, `frame-src`, `style-src`, `font-src` der Zielpolicy | 6 Direktiven                       |
| **N-G10** | jeder CSP-Eintrag hat einen belegbaren Verwender im Code                                                     | 3 veraltete Origins                |
| **N-G11** | Sicherheits-Header vollständig (inkl. **HSTS** am produktiven Origin)                                        | HSTS fehlt                         |

N-G7 bis N-G11 sind so zu schreiben, dass sie **heute rot sind** und mit der Umsetzung grün werden.
_(AP26 PT26.5.3, AP27 PT27.6)_

---

## 9. Forbidden Regressions

- ❌ **Eine `FORBIDDEN`-Origin wieder einführen** — insbesondere HiHuman, in Code **oder** CSP (`DEC-RL-007`, Gate 5)
- ❌ Einen nicht-essenziellen Provider vor der Einwilligung laden (`REST-02`)
- ❌ Google-Tag-Manager- oder Analytics-Origins als `ESSENTIAL` behandeln
- ❌ **Ein Navigationsziel in die CSP aufnehmen**, nur weil es im Markup verlinkt ist
- ❌ `schema.org` in die CSP aufnehmen — der `@context`-Wert wird nie abgerufen
- ❌ **Pauschales `https:` in einer restriktiven Direktive der Zielpolicy** ohne begründete, befristete Ausnahme
- ❌ Eine Subdomain-Wildcard ohne Beleg setzen
- ❌ Eine Origin „vorsorglich" erlauben, deren Bedarf nicht belegt ist
- ❌ Veraltete Origins in der Liste belassen
- ❌ `Report-Only` ohne funktionierenden Report-Empfänger betreiben
- ❌ Eine Funktion entfernen und ihre CSP-Rechte stehenlassen
- ❌ Eine Preview-/Staging-Origin in eine produktive Policy schreiben
- ❌ `server.ts` als Datei aus `main` übernehmen (**N1**)
- ❌ Auf eine Google-Fonts-CDN wechseln (N-02)

---

## 10. AP Ownership / Lifecycle

| Phase                 | AP                                 | Ergebnis                                                                                                          |
| --------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Ladeverzicht          | **AP23 PT23.1**                    | vor Consent keine nicht-essenzielle Origin                                                                        |
| Provider-Lebenszyklus | **AP23 PT23.2**                    | wer wann geladen wird → `TRACKING-CONTRACT.md`                                                                    |
| Chat-Entfernung       | **AP06 PT06.4.6**, **AP22 PT22.7** | Widget und Endpunkt raus — **Voraussetzung** für die CSP-Finalisierung                                            |
| **CSP/Eigentum**      | **AP26 PT26.2**                    | Chat-Domains entfernen, GTM/GA4 consent-gesteuert, Report-Empfänger, Enforce-Readiness, keine unnötigen Wildcards |
| Security-Header       | **AP26 PT26.1**                    | HSTS, Referrer-/Permissions-/Frame-Policies                                                                       |
| Assets/Fonts          | **AP05 PT05.2**, **AP25 PT25.4**   | selbstgehostete Schrift bleibt das Modell                                                                         |
| Absicherung           | **AP26 PT26.5.3**, **AP27 PT27.6** | Header-/CSP-Tests in CI                                                                                           |
| Betrieb               | **AP28 PT28.2**, **AP32 PT32.1.7** | Reverse Proxy, CSP-Reports beobachten                                                                             |
| Abnahme               | **AP30 PT30.4.3**, **AP31 PT31.3** | Security-QA und Livecheck                                                                                         |
| Dokumentation         | **AP33 PT33.1.8**                  | Netz-/Consent-Architektur in der Entwicklerdoku                                                                   |

**Änderungen an diesem Vertrag** verantwortet AP26, bei Providerbezug gemeinsam mit AP23.
Decision Locks werden hier nie geändert.
