# CONTENT-ASSET-CONTRACT

**Guard-Level: G2.** Wer eine der in §3 genannten Content-/Asset-Quellen ändert, folgt der Kontextpflicht
in §8. `public/locales/**` und `src/i18n.ts` sind **G3** und unterliegen zusätzlich `I18N-CONTRACT.md`.

> ## ⚠ Ziel-, nicht Ist-Zustand
>
> Der heutige Content-/Asset-Bestand weicht in mehreren Punkten vom Zielbild ab (§6). **Dieser Vertrag
> beschreibt das SOLL** und ist kein Beleg dafür, dass es hergestellt ist.

---

## 1. Purpose

Dieser Vertrag beantwortet: **Welche Information gehört in welche Content-Schicht — und welche
Verantwortung gehört ausdrücklich nicht dorthin?**

Er zieht die Grenzen zwischen fachlichen Datenmodellen, lokalisierten Texten, spezialisierten
Content-Daten und statischen Assets, modelliert sprachabhängige Assets und die Unterscheidung zwischen
frei zugänglichen und gegateten Ressourcen.

Er ist **kein Content-Audit** und **keine Content-Governance**. Wer welchen Text schreibt, freigibt oder
pflegt, ist nach `DEC-RL-010` ausdrücklich **Backlog** (§4.9).

Was eine Route ist und welche URLs existieren, regelt `ROUTING-CONTRACT.md`. Wie Sprachen vollständig
werden, regelt `I18N-CONTRACT.md`. Dieser Vertrag dupliziert beides nicht.

---

## 2. Authority

Verbindlich in der Reihenfolge aus `PROJECT-CONSTRAINTS.md`.

**Zielautorität:** **AP02 PT02.3** (Content-/Asset-Architektur). **Eigentümer der Umsetzung:** **AP04**
(Content-/Asset-Readiness) und **AP19** (Downloads/Resource Center/Lead Magnet), fachlich verteilt auf
die Domänen-APs in §11.

**Relevante Decision Locks:** `DEC-RL-001` (10 Sprachen), `DEC-RL-005`/`DEC-RL-011` (Epigenetik),
`DEC-RL-006`/`REST-03` (Consumer × 10), `DEC-RL-008` (`CV < 2 %`), `DEC-RL-010` (**Content-Governance ist
Backlog**), `DEC-RL-014` (mindestens ein gated Secondary-Conversion-Pfad), `DEC-RL-015` (Case
Studies/Shop vertagt). **Baseline:** `feat/home-leadmagnet@961f65d`. Keine Lock-Änderung durch diesen
Vertrag.

**Stand AP02 PT02.3 (2026-08-24):** Erstfassung. Ist-Erhebung in **§3.1**, Zielinvarianten
**CA-01 bis CA-40**, Domänenmodelle **§5**, Schulden **CD-1 bis CD-10**, Regeln **CM-01 bis CM-06**,
Nachweise **CA-T1 bis CA-T14** mit `CONTENT-xx`-Zuordnung, Owner-Grenzen **§11**. PT02.3 ist ein reiner
**Dokumentationsschritt**: kein Inhalt migriert, keine Übersetzung erzeugt, kein Asset geändert,
verschoben oder umbenannt, kein Gating implementiert, **kein CMS ausgewählt**.

**Abgrenzung zu bestehenden Verträgen** — dieser Vertrag ergänzt sie und ersetzt keinen:

| Vertrag                                             | Bleibt zuständig für                                                                 |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `I18N-CONTRACT.md`                                  | Sprachmenge, Key-Parität, Namespace-Registrierung, Fallback-Semantik (`I-01`–`I-15`) |
| `ROUTING-CONTRACT.md`                               | Route-Existenz, Slug-Policy, Status, Canonical/hreflang (`R-01`–`R-53`)              |
| `SEO-CONTRACT.md`                                   | Ausgabe von Meta, Canonical, hreflang, Structured Data (`S-01`–`S-17`)               |
| `RUNTIME-CONTRACT.md`                               | SSR, Hydration, Chunk-Verhalten (`RT-38`–`RT-70`)                                    |
| `LEAD-DATA-CONTRACT.md` / `BACKEND-API-CONTRACT.md` | Lead-Daten, Entitlement-Verarbeitung, Zustellung — **PT02.4**                        |

---

## 3. Current Participating Files / Current State

| Datei / Baum                          | Rolle                                                                                            | Guard  |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ | ------ |
| `src/data/services.tsx`               | 9 Services: `id`, `translationKey`, Icon-JSX, `relatedArticleIds`                                | G2     |
| `src/data/articles.ts`                | 6 Artikel: `id`, `slug`, `category`, `author`, `date`, `readTime`, `sections`, Relationen        | G2     |
| `src/data/events.ts`                  | Events: `id`, ISO-`date`/`endDate`, `location`, `partner`, `link`                                | G2     |
| `src/data/testimonials.ts`            | Testimonial-Stammdaten                                                                           | G1     |
| `src/data/blogPosts.ts`               | abgeleitete Teaser-Sicht auf `articles.ts`                                                       | G1     |
| `src/data/README.de.md`               | lokale Konvention der Datenschicht                                                               | G1     |
| `src/content/befunde/**`              | 6 Musterbefunde × `de`/`en` als JSON, `meta.ts`, `index.ts`, `panelNames.ts`, `legacyAnchors.ts` | G2     |
| `src/content/downloads.json`          | Download-Katalog der Seite `/downloads` — **3 Einträge**                                         | G2     |
| `public/locales/**`                   | 10 Sprachen × 15 Dateien = **150**; 14 Namespaces registriert                                    | **G3** |
| `src/i18n.ts` / `.client` / `.server` | Sprach-/Namespace-Konfiguration und Loader                                                       | **G3** |
| `public/downloads/**`                 | **32 Dateien**: 3 im Wurzelverzeichnis, 3 ZIPs, `epigenetics/de` **17**, `epigenetics/en` **9**  | G2     |
| `src/assets/**`                       | gebündelte Bilder, `articleImages.ts`, `epigenetics/befundImages.ts`, `downloads/` (3 PDFs)      | G2     |
| `public/*.jpg`, `*.png`, `*.svg`      | Favicons, Manifest-Icons, OG-Bilder (`og-image`, `og-epigenetics`, `og-vitd3-spray`)             | G1     |

### 3.1 Ist-Zustand Content und Assets (AP02 PT02.3, read-only erhoben 2026-08-24)

**Gemessener IST-Zustand, nicht das SOLL.** Er begründet §4/§5 und die Schulden `CD-1`–`CD-10` in §6.
Keine Freigabe, kein zulässiges Zielverhalten. Erhebung durch Lesen und Auszählen ohne Änderung.

| Klasse                            | Ist-Befund                                                                                                                                                                                                                                                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A** strukturelle TS-Daten       | `services.tsx` (9, mit **Icon-JSX in der Datenschicht** und toten Feldern `title`/`description` als Leerstrings), `articles.ts` (6, `id` **und** `slug` bereits getrennt), `events.ts` (ISO-Daten, sprachneutrale Eigennamen — **sauberstes Modell im Repo**), `testimonials.ts`, `blogPosts.ts` (rein abgeleitet) |
| **B** lokalisierte Texte          | 150 Locale-Dateien, 14 registrierte Namespaces; `casestudies.json` existiert × 10, ist **nicht registriert** und wird nie geladen (`I18N-CONTRACT.md` ID-5)                                                                                                                                                        |
| **C** spezialisierte Content-JSON | `src/content/befunde/` — 12 JSONs (**6 Panels × `de`/`en`**), bewusst außerhalb des i18n-Namensraums. `meta.ts` hält Typen und Metadaten JSON-frei; **`index.ts` importiert jedoch weiterhin alle 12 statisch** (~322 KB Quelltext)                                                                                |
| **D** freie statische Assets      | 10 Bilder unter `public/` (Favicons, Manifest, 3 OG-Bilder) plus gebündelte Assets unter `src/assets/`                                                                                                                                                                                                             |
| **E** Downloads                   | **zwei getrennte Download-Welten**: `src/content/downloads.json` mit **3** Einträgen speist `/downloads`; die **26** Epigenetik-PDFs und **3** ZIPs unter `public/downloads/` erscheinen dort **nicht**                                                                                                            |
| **F** sprachabhängige Downloads   | `public/downloads/epigenetics/de` **17** Dateien gegen `en` **9**. **Die Sprachzuordnung steht als übersetzter String in den Locale-Dateien** (`epigenetics.json` → `downloads.zipFile`, `evidence.file`, `samples.zipFile`, `sheets[].file`); die Seite baut den Pfad aus `ASSET_BASE` + `t(...)`                 |
| **G** hartkodierter Content       | `src/pages/consumer/**` **0 × `useTranslation`** in sieben Dateien, inklusive hartkodierter englischer `SEOHead`-Titel und -Descriptions; `S3LeitliniePage.tsx` und `VitaminD3ImplantologyPage.tsx` hartkodiert deutsch (`I18N-CONTRACT.md` ID-1/ID-2)                                                             |
| **H** veraltete/verwaiste Reste   | `src/assets/downloads/` enthält drei PDFs, die inhaltlich `public/downloads/` doppeln (u. a. `igloo-pro-flyer.pdf` in beiden Bäumen); `casestudies.json` × 10 unregistriert; `shop.json` × 10 registriert, aber ungenutzt (`D-28`)                                                                                 |

**Strukturell entscheidende Befunde:**

1. **Asset-Identität lebt in Übersetzungsdateien.** Welche Datei eine Sprache bekommt, entscheidet ein
   übersetzbarer String. Gemessen tragen `pl`, `fr` und `cs` in `epigenetics.json` die **englischen**
   Dateinamen (`PolarisDX_Unterlagen_EN.zip`, `en/08_Evidence_Base_PolarisDX.pdf`) — ein **stiller
   EN-Asset-Fallback**, der maschinell nicht als Lücke erkennbar ist, weil der Wert wie eine
   vorgenommene Übersetzung aussieht.
2. **Es gibt kein Gating.** Weder in `src/**` noch in `server.ts` oder `server/server.js` existiert ein
   Entitlement-, Gate- oder Lead-Magnet-Mechanismus. Jede Datei unter `public/downloads/` ist über eine
   erratbare statische URL öffentlich — auch die, die nirgends verlinkt sind.
3. **Zwei Download-Kataloge nebeneinander.** `downloads.json` führt drei Einträge mit **hartkodierten
   deutsch-/englischsprachigen Titeln** (`"Igloo Pro System Flyer (DE)"`) statt Translation Keys, dazu
   `size` und `date` als handgepflegte Strings.
4. **Artikel-Datumswerte sind lokalisierte Strings.** `date: '28 Nov 2025'` und `readTime: '6 min read'`
   sind englischsprachige Anzeigetexte in der Datenschicht, keine strukturierten Werte — anders als
   `events.ts`, das ISO-Daten führt.
5. **Consumer hat keine produktspezifischen OG-Bilder.** Die drei Consumer-Seiten übergeben `SEOHead`
   kein `ogImage`; `og-vitd3-spray.jpg` wird ausschließlich von der **B2B**-Seite
   `/vitamin-d3-spray` verwendet.

---

## 4. Target Invariants

### 4.1 Schichtenmodell

**CA-01 · Es gibt genau vier Content-Schichten mit getrennter Verantwortung.**

| Schicht                                | Verantwortet                                                                                                                             | Verantwortet **nicht**                                                               |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **A — Struktur / fachliche Identität** | stabile IDs, Slugs, fachliche Beziehungen, Sortierung, strukturierte Datums-/Zahlenwerte, Kategorien, Asset-Referenzen, Translation Keys | nutzersichtbare Fließtexte in zehn Sprachkopien · Secrets · Lead-/Kundendaten        |
| **B — lokalisierte UI-/Seitentexte**   | Navigation, Überschriften, Beschreibungen, CTAs, Formular-, FAQ-, Hilfe-, Success-/Error-Copy, lokalisierbare SEO-Texte                  | fachliche Identität · Routen · Dateinamen · Datumslogik · Preise als Rechengrundlage |
| **C — spezialisierte Content-Daten**   | große, feature-/routengebundene Inhalte mit eigener Struktur (heute: Musterbefunde)                                                      | globale UI-Texte · Routing-Wahrheit                                                  |
| **D — statische Assets**               | Bilder, Icons, OG-Bilder, PDFs, ZIPs und andere veröffentlichte Dateien                                                                  | fachliche Identität allein über den Dateinamen · Secrets · personenbezogene Daten    |

**CA-02 · Eine Information hat genau eine zuständige Schicht.** Dieselbe Aussage wird nicht in zwei
Schichten gepflegt. Wo eine zweite Schicht sie braucht, **referenziert** sie die erste.

**CA-03 · Die Schichtzuordnung folgt der Frage „ändert sich das mit der Sprache?"** — nicht der Frage,
wo es gerade am bequemsten liegt. Sprachinvariantes gehört nach A oder D, Sprachabhängiges nach B oder C.

**CA-04 · Kein Schichtwechsel ohne Ersatz.** Wird Inhalt aus einer Schicht entfernt, ist die neue
zuständige Schicht benannt. Ein Inhalt darf nie in keiner Schicht liegen.

### 4.2 Strukturelle und fachliche Daten (Schicht A)

**CA-05 · Jede fachliche Ressource besitzt eine stabile, übersetzungsunabhängige Identität.** Die ID
überlebt Umbenennungen, Übersetzungen und Slug-Änderungen.

**CA-06 · Fachliche ID und URL-Slug sind getrennte Konzepte.** Die ID ist intern und stabil; der Slug
folgt der Slug-Policy des Routing-Vertrags. Sie dürfen übereinstimmen, müssen aber nicht.

**CA-07 · Strukturierte Werte bleiben strukturiert.** Datums-, Zeit-, Zahlen-, Mengen- und Größenwerte
liegen in maschinenlesbarer Form (ISO-Datum, Zahl mit Einheit) in Schicht A. Die **Darstellung**
entsteht zur Laufzeit aus Locale-Formatierung, nicht aus einem vorformatierten Text.

**CA-08 · Fachliche Beziehungen werden über IDs ausgedrückt**, nicht über Titel, Pfade oder
Anzeigetexte.

**CA-09 · Schicht A referenziert Texte über Translation Keys und Assets über Asset-Identitäten** — nicht
über eingebettete Fließtexte oder rohe Dateinamen.

### 4.3 Lokalisierte Texte (Schicht B)

> Sprachmenge, Key-Parität, Namespace-Registrierung und Fallback-Semantik stehen abschließend in
> `I18N-CONTRACT.md` (`I-01`–`I-15`) und werden hier **nicht** dupliziert. Dieser Abschnitt regelt nur
> die **Grenze** zwischen Übersetzung und fachlicher Wahrheit.

**CA-10 · Eine Übersetzungsdatei erzeugt keine zweite fachliche Wahrheit.** Sie enthält keine Slugs,
keine Routen, keine Dateinamen, keine IDs, keine Datumslogik und keine Preis-/Rechengrundlagen —
ausschließlich sprachabhängige Anzeigetexte.

**CA-11 · Launchrelevanter, lokalisierbarer Content ist für alle zehn Sprachen abbildbar.** Die
Architektur darf keine Struktur erzwingen, die eine Sprache technisch ausschließt. `DEC-RL-001`.

**CA-12 · Ein EN-Fallback ist defensives Ausfallverhalten, nie das Ziel für fehlenden Launch-Content.**
_(`I18N-CONTRACT.md` I-03/I-14)_

**CA-13 · Namespace-Grenzen bleiben fachlich sinnvoll und lade-bewusst.** Ein global geladenes Bundle
nimmt keine großen, feature-spezifischen Datenmengen auf — dafür ist Schicht C da (CA-15).

**CA-14 · Consumer und Epigenetik sind ausdrücklich Teil des Zehn-Sprachen-Ziels.** Consumer nach
`REST-03`/`DEC-RL-006`, Epigenetik einschließlich Hub, Vertiefungsseiten und Musterbefunden nach
`DEC-RL-005` und `I18N-CONTRACT.md` I-10/I-11.

### 4.4 Spezialisierte Content-Daten (Schicht C)

**CA-15 · Schicht C ist für Inhalte, die bewusst kein global geladener i18n-Namespace sein sollen** —
groß, stark strukturiert und nur auf wenigen Routen gebraucht.

**CA-16 · Spezialisierte Content-Daten sind typisiert und validierbar.** Struktur und Blocktypen sind
deklariert; ungültige Daten sind vor Auslieferung erkennbar.

**CA-17 · Schicht C wird route-/feature-spezifisch geladen.** Der Zugriff auf **einen** Datensatz zieht
nicht die gesamte Sammlung in ein Bundle. Metadaten und Inhalte sind so getrennt, dass ein Import von
Typen oder Metadaten keine Inhalte nachzieht.

**CA-18 · Auch Schicht C ist sprachlich modellierbar.** Die Sprachvariante ist ein explizites Merkmal
des Datensatzes, keine Namenskonvention, die nur zufällig funktioniert.

### 4.5 Statische Assets und Asset-Referenzen (Schicht D)

**CA-19 · Ein Asset hat eine fachliche Identität, die nicht der Dateiname ist.** Der Dateiname ist eine
Eigenschaft des Assets, nicht sein Schlüssel. Code und Content referenzieren die Identität.

**CA-20 · Asset-Referenzen sind stabil, nachvollziehbar und build-/deployment-kompatibel.** Keine
absoluten lokalen Dateisystempfade im Browsercode; veröffentlichte Assets sind aus dem Artefakt
erreichbar (`RUNTIME-CONTRACT.md` RT-01/RT-02).

**CA-21 · Asset-Referenzen sind auf Existenz prüfbar.** Zu jeder Referenz lässt sich maschinell
feststellen, ob die Datei ausgeliefert wird. Eine tote Referenz ist ein Fehler, kein leerer Bereich.

**CA-22 · Kein Asset wird in Content-Dateien dupliziert.** Keine Base64-/Blob-Kopien, keine zweite
Fassung derselben Datei in einem parallelen Baum.

**CA-23 · Bloße Existenz im Repository macht ein Asset nicht zu aktivem Produktinhalt.** Ein Asset ohne
Referenz aus einer Content-Schicht ist verwaist und als solches klassifizierbar.

**CA-24 · Asset-Versionierung funktioniert nicht über Browsercache-Zufall.** Eine geänderte Datei ist
als neue Fassung erkennbar — über Versionsmetadaten, gehashten Auslieferungspfad oder ein gleichwertiges
Verfahren. Welches, entscheidet der Owner-AP.

### 4.6 Sprachabhängige Assets

**CA-25 · Die fachliche Asset-Identität ist sprachunabhängig und stabil.** Eine Broschüre ist **eine**
Ressource mit mehreren Sprachfassungen — nicht zehn unabhängige Dateien.

**CA-26 · Je unterstützter Sprache ist genau eine konkrete Datei zuordenbar** — oder die Ressource ist
ausdrücklich als sprachneutral deklariert.

**CA-27 · Fehlende Sprachvarianten sind maschinell erkennbar.** Eine nicht vorhandene Sprachfassung ist
eine **Lücke im Modell**, kein stillschweigend eingetragener fremdsprachiger Dateiname.

**CA-28 · Kein stiller Fremdsprach-Fallback bei Assets.** Ein Nutzer erhält nicht unbemerkt ein
Dokument in einer anderen Sprache. Ein Fallback ist nur zulässig, wenn er fachlich ausdrücklich erlaubt
**und** für den Nutzer erkennbar ist. hreflang darf kein Ziel bewerben, dessen Asset in dieser Sprache
fehlt (`I18N-CONTRACT.md` I-13, `SEO-CONTRACT.md` S-03).

**CA-29 · Asset-Metadaten bilden mindestens Sprache, Format, Größe und Aktualität ab**, soweit sie
angezeigt oder geprüft werden. Sie werden nicht von Hand gepflegte Anzeigetexte, sondern
maschinell überprüfbare Werte.

### 4.7 Frei zugängliche und gegatete Ressourcen

**CA-30 · Jede Ressource ist eindeutig einer Klasse zugeordnet: PUBLIC oder GATED.** Die Klasse ist ein
deklariertes Merkmal, keine Folge davon, ob irgendwo ein Link existiert.

| Klasse     | Bedeutung                                                                                                        |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| **PUBLIC** | direkt öffentlich zugänglich, normale statische Auslieferung zulässig, kein Lead erforderlich                    |
| **GATED**  | Freigabe erst nach erfolgreichem Gate; Berechtigung technisch prüfbar; Auslieferung referenziert die Resource-ID |

**CA-31 · Eine erratbare statische URL ist kein Schutzmechanismus.** Eine Datei ist **nicht** deshalb
geschützt, weil kein sichtbarer Link auf sie zeigt. Wer echtes Gating zusagt, braucht eine geprüfte
Berechtigung — nicht Unauffindbarkeit.

**CA-32 · Das Gate prüft eine Berechtigung, nicht eine Herkunft.** Ein Referrer, ein Formular-Redirect
oder ein verborgenes Verzeichnis erfüllen die Zusage nicht.

**CA-33 · Freigabe und Zustellung referenzieren die stabile Resource-ID**, nicht einen Dateipfad — damit
ein Sprach-, Versions- oder Formatwechsel den Zustellweg nicht bricht.

**CA-34 · Lead-, CRM- und Kundendaten gehören nie in Asset- oder Content-Metadaten.** Die Ressource
weiß nicht, wer sie angefordert hat. Diese Verbindung entsteht im Lead-Modell (**PT02.4**, AP19/AP22).

### 4.8 Security und Datenschutz

**CA-35 · Repository-Content und Assets enthalten niemals echte Patienten-, Lead- oder Kundendaten**,
auch nicht als Beispiel, Screenshot oder Testdatensatz.

**CA-36 · Musterbefunde und Demomaterial sind synthetisch oder fachlich freigegeben.** Ein Musterbefund
ist ein konstruiertes Beispiel, keine anonymisierte echte Messung.

**CA-37 · Keine Secrets, API-Keys, Tokens oder Zugangsdaten in Content-Dateien oder Assets** — auch
nicht in Dokument-Metadaten eingebetteter PDFs. _(`AGENT-CONTRACT.md` §4)_

**CA-38 · Alles unter einem öffentlich ausgelieferten statischen Pfad gilt als veröffentlicht** —
dauerhaft, auch nach Entfernen des Links, und unabhängig davon, ob es indexiert wird.

### 4.9 CMS- und Governance-Grenze

**CA-39 · Das Launch-Ziel funktioniert ohne CMS.** Kein CMS, kein Headless-Backend und keine
Redaktionspipeline ist Launch-Voraussetzung. Ein CMS wird in diesem Vertrag weder ausgewählt noch
geplant. _(`DEC-RL-010`)_

**CA-40 · Die Architektur bleibt CMS-anschlussfähig, ohne es zu verlangen.** Weil fachliche Identität,
Texte und Assets getrennt sind (CA-01), könnte eine spätere Quelle Schicht A oder B speisen. Das ist
eine **Option**, keine Anforderung, und begründet keine Launch-Arbeit. Formale Content-Owner-, Review-,
Freshness- und Freigabeprozesse bleiben Backlog.

---

## 5. Target Model

### 5.1 Content-Modell ≠ Route Registry

Der Vertrag aus **PT02.2** gilt unverändert und wird hier bestätigt:

```
ROUTE REGISTRY (ROUTING-CONTRACT.md)          CONTENT-DATENQUELLE (dieser Vertrag)
─────────────────────────────────────         ──────────────────────────────────────
kennt:  /[lang]/articles/:slug existiert      kennt:  welche Artikel-Slugs es gibt
        Locale-Policy, Indexierbarkeit,               fachliche Daten, Relationen,
        Status-, Canonical-, hreflang-Regel           Translation Keys, Assets
        (R-24 bis R-29)                               (CA-05 bis CA-09)

        verweist auf die Slug-Quelle  ───────►  besitzt die gültigen Slugs
        (R-33: genau eine je Route)             (CA-05: stabile Identität)
```

Daraus folgt für beide Seiten:

- **Keine doppelte Slug-Wahrheit.** Die Routing-Wahrheit schreibt keine Slug-Liste ab
  (`ROUTING-CONTRACT.md` R-28/R-33), und keine Content-Datei erfindet Routing-Informationen neu (CA-10).
- **Kein Content in der Registry.** Die Registry nimmt keine Titel, Beschreibungen oder Inhaltsblöcke auf.
- **Unbekannter Slug bleibt 404.** Ein Slug ohne Datensatz erzeugt eine echte 404 — die Prüfung ist
  Aufgabe der Routenauflösung gegen die Content-Quelle (`ROUTING-CONTRACT.md` R-30–R-32).

### 5.2 Musterbefund-Modell

**Owner: AP16**, sprachliche Vollständigkeit **AP08**.

- Die **sechs** Musterbefunde sind fachlich identifizierbare Inhalte mit stabiler Panel-/Slug-Identität.
- **Genau eine** Quelle führt Slug-, Panel- und Reihenfolge-Identität. Metadaten und Inhalte
  widersprechen sich nicht über mehrere Dateien hinweg.
- Befundinhalte bleiben **typisiert und validierbar**: Blocktypen, Messwerte und Beschriftungen sind
  deklariert, ungültige Daten sind vor Auslieferung erkennbar (CA-16).
- Befundinhalte werden **nicht site-weit** mit jedem Bundle geladen. Die bewusste Trennung von Metadaten
  und Inhalten bleibt erhalten und muss auch beim Zugriff auf einen einzelnen Befund wirksam sein
  (CA-17) — das ist heute nicht erfüllt (`CD-3`).
- **Sprachvarianten sind explizit modellierbar** und nicht auf `de`/`en` beschränkt (CA-18, CA-11).
- Visualisierte Messwerte und semantische Beschriftungen haben eine benannte, nachvollziehbare
  Datenquelle; die textliche Alternative der Diagramme speist sich aus denselben Daten (AP16 PT16.2).
- Befunddaten sind **synthetisch bzw. freigegeben** und enthalten keine echten Patientendaten (CA-36).

### 5.3 Artikel-Modell

**Owner: AP17.**

- Artikel besitzen eine stabile fachliche `id`; der URL-`slug` ist davon getrennt (CA-06) — im Ist
  bereits erfüllt.
- Metadaten (Schicht A) und lokalisierter Text (Schicht B) werden über die ID **deterministisch**
  zusammengeführt.
- **Publikations- und Aktualisierungsdatum sind strukturierte Werte**, keine vorformatierten
  Anzeigetexte, und werden nie aus Übersetzungsstrings erraten (CA-07) — heute verletzt (`CD-4`).
  Dasselbe gilt für abgeleitete Anzeigewerte wie die Lesezeit.
- SEO-relevante Artikelmetadaten sind aus der kanonischen Datenquelle ableitbar; Article Structured Data
  führt **keine zweite Artikelwahrheit** (§5.7).
- Ein unbekannter Slug bleibt mit dem Routing-/404-Vertrag kompatibel (`ROUTING-CONTRACT.md` R-30/R-31).

### 5.4 Service-Modell

**Owner: AP12/AP13**, Datenmodell mit AP04.

- Die **neun** Services besitzen stabile IDs; die Zuordnung ID ↔ Route ist deterministisch.
- Struktur- und Präsentationsmerkmale (Kategorie, Reihenfolge, Icon-Zuordnung, Relationen) gehören in
  Schicht A; **lokalisierte Texte gehören ausschließlich nach Schicht B** — Felder wie `title` und
  `description` in der Datenschicht sind entweder gefüllt und maßgeblich oder sie existieren nicht
  (`CD-5`).
- Header, Footer und Suche erfinden keine Service-Pfade, sondern leiten sie ab
  (`ROUTING-CONTRACT.md` R-50/R-51).
- Ein unbekannter Service-Slug ist von einem echten Service unterscheidbar und liefert 404.

### 5.5 Event-Modell

**Owner: AP18.**

- Die Event-`id` ist stabile fachliche Identität und zugleich der Schlüssel der zugehörigen Texte.
- Start-/Enddatum, Ort, Partner, Link und Status sind **strukturierte, sprachneutrale** Daten
  (ISO-Datum); Eigennamen bleiben unübersetzt.
- Übersetzbare Titel und Beschreibungen liegen in Schicht B.
- **Vergangen/kommend wird deterministisch aus strukturierten Daten abgeleitet** — nie aus lokalisierten
  Strings, nie aus der Reihenfolge im Array.
- Zeitzonen-/UTC-Verhalten ist ausdrücklich festgelegt, nicht implizit (AP18 PT18.1.7).
- Eine spätere Event-Structured-Data-Nutzung speist sich aus derselben fachlichen Quelle (§5.7).

Das heutige `events.ts` erfüllt dieses Modell bereits weitgehend und ist das **Vorbild** für die übrigen
Datenmodelle.

### 5.6 Resource-/Download-Modell

**Owner: AP19**, Readiness AP04, Sprachparität AP08.

Ein einheitlicher konzeptioneller Ressourcenbegriff ersetzt die heutigen zwei Download-Welten (`CD-1`).
Eine Ressource ist mindestens abbildbar über:

| Merkmal                      | Zweck                                                                                 |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| stabile Resource-ID          | fachliche Identität, unabhängig von Dateiname, Sprache und Version (CA-05, CA-25)     |
| Titel-/Description-Keys      | lokalisierte Anzeige über Schicht B statt hartkodierter Titel (CA-10)                 |
| Kategorie                    | Gruppierung im Resource Center                                                        |
| Asset-Referenz je Sprache    | konkrete Datei pro unterstützter Sprache oder ausdrückliche Sprachneutralität (CA-26) |
| Format                       | PDF, ZIP, …                                                                           |
| Größe                        | maschinell ermittelt, nicht handgepflegt (CA-29)                                      |
| Version / Aktualitätsdatum   | Unterscheidbarkeit von Fassungen (CA-24)                                              |
| Zugangsklasse                | **PUBLIC** oder **GATED** (CA-30)                                                     |
| Indexierbarkeit              | ob die Ressource öffentlich beworben wird — getrennt von der Zugangsklasse            |
| Entitlement-/Delivery-Modell | nur als **Verweis**; die Ausgestaltung gehört PT02.4 und AP19/AP22 (CA-33)            |

Zusätzlich:

- **Leere Kategorien entstehen nicht durch fehlende Daten**, sondern sind als solche erkennbar
  (AP19 PT19.2.5).
- Eine Ressource ohne Asset in einer beworbenen Sprache ist eine erkennbare Lücke (CA-27), kein stiller
  Fremdsprach-Download (CA-28).
- Der ROI-Report, die Epigenetik-Unterlagen und die Musterbefund-PDFs sind **Kandidaten** für den gated
  Pfad nach `DEC-RL-014`; welche Ressource tatsächlich gegated wird, entscheidet **AP19 PT19.4** —
  dieser Vertrag verlangt nur, dass beide Klassen modellierbar sind.

### 5.7 Grenze zu SEO (AP09)

| Content-/Asset-Architektur liefert                   | SEO-Plattform entscheidet                         |
| ---------------------------------------------------- | ------------------------------------------------- |
| verfügbare Asset-Referenzen inkl. Sprache und Format | konkrete Meta-Tag-Ausgabe                         |
| fachliche Identität und Relationen                   | Canonical, hreflang, Robots                       |
| Titel-/Beschreibungs-Keys                            | finale Title-/Description-Zusammensetzung         |
| Artikel-, Event- und Resource-Metadaten              | Structured-Data-Rendering, OG-/Twitter-Einbindung |

**Keine parallele SEO-Plattform in Content-Daten.** Structured Data behauptet nichts, was die
Content-Quelle nicht hergibt (`SEO-CONTRACT.md` S-12), und Content-Dateien führen keine eigenen
Canonical-, hreflang- oder Robots-Entscheidungen.

---

## 6. Current Known Debt

Ist-Zustand aus §3.1. **Kein zulässiges Zielverhalten**; in PT02.3 bewusst **nicht** repariert.
Sprachliche Vollständigkeitslücken sind zusätzlich in `I18N-CONTRACT.md` §5 (`ID-1`–`ID-10`) geführt und
werden hier nicht dupliziert, sondern referenziert.

| ID        | Schuld                                                                                                                                                                                                                                                                                                                      | Verletzt                   | Owner                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------- |
| **CD-1**  | **Zwei getrennte Download-Welten** — `src/content/downloads.json` führt **3** Einträge und speist `/downloads`; die **26** Epigenetik-PDFs und **3** ZIPs unter `public/downloads/` erscheinen dort nicht und werden über einen eigenen Pfad ausgeliefert                                                                   | CA-02, §5.6                | **AP19 PT19.1**                    |
| **CD-2**  | **Asset-Identität liegt in Übersetzungsdateien** — Dateinamen und Sprachzuordnung der Epigenetik-Unterlagen stehen als übersetzbare Strings in `public/locales/*/epigenetics.json`; gemessen tragen `pl`, `fr` und `cs` die **englischen** Dateinamen → **stiller EN-Asset-Fallback**, maschinell nicht als Lücke erkennbar | CA-10, CA-19, CA-27, CA-28 | **AP19** mit **AP08**              |
| **CD-3**  | **Musterbefund-Inhalte werden gebündelt geladen** — `src/content/befunde/index.ts` importiert alle **12** JSONs (~322 KB Quelltext) statisch; die in `meta.ts` angelegte Trennung wirkt beim Zugriff über `index.ts` nicht (deckungsgleich mit `D-29`)                                                                      | CA-17                      | **AP25** mit **AP16**              |
| **CD-4**  | **Artikel-Datumswerte sind lokalisierte Anzeigetexte** — `date: '28 Nov 2025'`, `readTime: '6 min read'` als englischsprachige Strings in `src/data/articles.ts`, statt strukturierter Werte wie in `events.ts`                                                                                                             | CA-07, §5.3                | **AP17 PT17.4**                    |
| **CD-5**  | **Tote Felder im Service-Modell** — `title` und `description` in `src/data/services.tsx` sind leere Strings; die tatsächliche Anzeige läuft über `translationKey`. Zusätzlich liegt Icon-**JSX** in der Datenschicht                                                                                                        | CA-01, CA-09, §5.4         | **AP13** mit AP04                  |
| **CD-6**  | **Download-Metadaten sind handgepflegte Anzeigetexte** — `downloads.json` führt hartkodierte Titel (`"Igloo Pro System Flyer (DE)"`) statt Translation Keys sowie `size` und `date` als Strings                                                                                                                             | CA-10, CA-29               | **AP19 PT19.1**                    |
| **CD-7**  | **Asset-Duplikate über zwei Bäume** — `src/assets/downloads/` enthält drei PDFs, die `public/downloads/` inhaltlich doppeln (u. a. `igloo-pro-flyer.pdf`)                                                                                                                                                                   | CA-22                      | **AP04 PT04.4**                    |
| **CD-8**  | **Kein Gating-Mechanismus vorhanden** — weder Entitlement noch Gate existieren; jede Datei unter `public/downloads/` ist über eine erratbare URL öffentlich, auch die nicht verlinkten. `DEC-RL-014` verlangt mindestens einen gated Pfad                                                                                   | CA-30–CA-32                | **AP19 PT19.3** mit AP22           |
| **CD-9**  | **Consumer ohne produktspezifische OG-Bilder** — die drei Consumer-Seiten übergeben `SEOHead` kein `ogImage` und fallen auf das generische Bild zurück; `og-vitd3-spray.jpg` nutzt ausschließlich die B2B-Seite `/vitamin-d3-spray`                                                                                         | §5.7, CA-21                | **AP21 PT21.6.5**                  |
| **CD-10** | **Unregistrierte und ungenutzte Namespaces** — `casestudies.json` existiert × 10 ohne Registrierung, `shop.json` ist registriert und wird geladen, aber nie gelesen. **Keine Reaktivierungsentscheidung** — `DEC-RL-015` gilt; verlangt ist nur bewusste Behandlung durch den Guard                                         | CA-23                      | **AP08**/**AP27** (`ID-5`, `D-28`) |

**Verweis statt Duplikat:** hartkodierte Consumer- und German-only-Seiten (`ID-1`, `ID-2`), Befundinhalte
nur `de`/`en` (`ID-3`), Key-Paritätslücke (`ID-4`), Systemmails deutsch (`ID-7`) und die
17-zu-9-Asset-Asymmetrie (`ID-8`) stehen in `I18N-CONTRACT.md` §5.

---

## 7. Modification Rules

**CM-01 — Vor dem Anlegen von Inhalt wird die Schicht bestimmt.** Fachliche Identität → A, sprachlicher
Text → B, große feature-gebundene Daten → C, Datei → D. Wer keine Schicht benennen kann, hat den Inhalt
nicht verstanden.

**CM-02 — Ein Dateiname wandert nicht in eine Übersetzungsdatei.** Wer eine sprachabhängige Datei
verknüpft, tut das über die Asset-Identität und eine deklarierte Sprachzuordnung (CA-19, CA-26) — nicht
über einen übersetzbaren String (`CD-2`).

**CM-03 — Ein neues Asset bringt seine Metadaten mit.** Sprache oder ausdrückliche Sprachneutralität,
Format, Aktualität und Zugangsklasse gehören zum Asset, nicht in eine spätere Nacharbeit.

**CM-04 — Eine neue dynamische Ressource benennt ihre Slug-Quelle.** Genau eine, und sie wird nicht in
die Routing-Wahrheit kopiert (`ROUTING-CONTRACT.md` R-33).

**CM-05 — Wer eine Ressource als gated bezeichnet, baut ein Gate.** Solange keine geprüfte Berechtigung
existiert, ist die Ressource **PUBLIC** und wird auch so ausgewiesen. Eine unverlinkte Datei gilt nie
als geschützt (CA-31).

**CM-06 — Content-Änderungen prüfen die Nachbarverträge mit.** Wer Slugs berührt, liest
`ROUTING-CONTRACT.md`; wer Sprachen berührt, `I18N-CONTRACT.md`; wer Metadaten berührt, die in den Head
gehen, `SEO-CONTRACT.md`.

---

## 8. Required Agent Context

Vor jeder Änderung an `src/data/**`, `src/content/**`, `public/locales/**`, `public/downloads/**` oder
`src/assets/**`:

1. `building-docs/AGENT-CONTRACT.md`
2. `building-docs/PROJECT-CONSTRAINTS.md`
3. der zuständige AP-Abschnitt in `scope/MASTER-SCOPE.md` (mindestens **AP04**; je Domäne AP13–AP21)
4. **dieser Vertrag**
5. `building-docs/I18N-CONTRACT.md` — bei allem, was Sprache berührt (**Pflicht** bei `public/locales/**`)
6. `building-docs/ROUTING-CONTRACT.md` — bei allem, was Slugs oder Routen berührt
7. `building-docs/SEO-CONTRACT.md` — bei Metadaten, die in den Head gehen
8. `building-docs/state/AP-STATE.md`
9. die aktuellen Quelldateien aus §3
10. `git diff -- <Datei>` **vor** der Änderung

---

## 9. Required Tests / Proof

| #          | Prüfung                         | Erwartung                                                                                                           | Owner-AP           |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------ |
| **CA-T1**  | **Stabile Identität**           | jede fachliche Ressource hat eine ID, die in keiner Sprachdatei definiert wird                                      | AP27 mit AP04      |
| **CA-T2**  | **Slug-Quelle eindeutig**       | zu jeder dynamischen Route existiert genau eine Slug-Quelle; kein Slug ist doppelt geführt                          | AP10/AP27          |
| **CA-T3**  | **Keine Routing-Daten in i18n** | Locale-Dateien enthalten keine Slugs, Routen oder Dateinamen                                                        | AP08/AP27          |
| **CA-T4**  | **Asset-Existenz**              | jede Asset-Referenz aus Code oder Content zeigt auf eine tatsächlich ausgelieferte Datei                            | AP27 PT27.6        |
| **CA-T5**  | **Sprachzuordnung explizit**    | jede sprachabhängige Ressource hat je beworbener Sprache eine deklarierte Datei oder ist als sprachneutral markiert | AP19/AP08          |
| **CA-T6**  | **Sprachlücken sichtbar**       | fehlende Sprachvarianten erscheinen als Lücke im Modell und nicht als fremdsprachige Datei                          | AP08 PT08.6        |
| **CA-T7**  | **Kein hreflang ohne Asset**    | keine beworbene Sprachvariante ohne Inhalt oder Asset in dieser Sprache                                             | AP08/AP09          |
| **CA-T8**  | **Zugangsklasse maschinell**    | zu jeder Ressource ist PUBLIC oder GATED auslesbar                                                                  | AP19 PT19.2        |
| **CA-T9**  | **Gate hält ohne Link**         | ein gated Asset ist auch bei direktem Aufruf der statischen URL nicht abrufbar                                      | AP19 PT19.3 · AP26 |
| **CA-T10** | **Keine echten Personendaten**  | Content und Assets enthalten keine echten Patienten-, Lead- oder Kundendaten                                        | AP26 PT26.5        |
| **CA-T11** | **Keine Secrets**               | Secret-Scan über Content-Dateien und Asset-Metadaten ist sauber                                                     | AP26 PT26.5        |
| **CA-T12** | **Bundle-Grenze Schicht C**     | der Zugriff auf einen Musterbefund lädt nicht die gesamte Sammlung                                                  | AP25 mit AP16      |
| **CA-T13** | **Strukturierte Datumswerte**   | Artikel- und Event-Daten stammen aus strukturierten Feldern; die Darstellung entsteht aus Locale-Formatierung       | AP17/AP18          |
| **CA-T14** | **Keine verwaisten Assets**     | Assets ohne Referenz sind klassifiziert; keine Duplikate über zwei Bäume                                            | AP04 PT04.4        |

### 9.1 Zuordnung der PT02.3-Zielinvarianten

Die Aufgabenstellung nennt Invarianten als `CONTENT-xx`. Dieser Vertrag führt **keine parallele
ID-Systematik** ein; die Zuordnung auf die hier verwendete `CA-`-Konvention ist:

| CONTENT        | Inhalt                                                | hier                        |
| -------------- | ----------------------------------------------------- | --------------------------- |
| **CONTENT-01** | stabile Identität unabhängig vom Übersetzungstext     | CA-05, CA-06 · CA-T1        |
| **CONTENT-02** | Launch-Content für zehn Sprachen abbildbar            | CA-11, CA-12                |
| **CONTENT-03** | Übersetzungsdatei erfindet keine Route-/Slug-Wahrheit | CA-10 · CA-T3               |
| **CONTENT-04** | Route Registry und Content getrennt                   | §5.1, CA-02                 |
| **CONTENT-05** | dynamische Slugs gegen die Datenquelle validierbar    | §5.1 · CA-T2                |
| **CONTENT-06** | sprachabhängige Assets explizit zugeordnet            | CA-25, CA-26 · CA-T5        |
| **CONTENT-07** | fehlende Sprachassets automatisiert detektierbar      | CA-27, CA-28 · CA-T6, CA-T7 |
| **CONTENT-08** | PUBLIC und GATED maschinell unterscheidbar            | CA-30 · CA-T8               |
| **CONTENT-09** | kein Schutz durch fehlende Verlinkung                 | CA-31, CA-32, CA-38 · CA-T9 |
| **CONTENT-10** | keine echten Leads, Patienten- oder Kundendaten       | CA-35, CA-36 · CA-T10       |
| **CONTENT-11** | keine Secrets                                         | CA-37 · CA-T11              |
| **CONTENT-12** | Asset-Referenzen auf Existenz prüfbar                 | CA-21 · CA-T4               |
| **CONTENT-13** | Musterbefunde nicht global gebündelt                  | CA-17, §5.2 · CA-T12        |
| **CONTENT-14** | Artikel-/Event-Daten aus strukturierten Feldern       | CA-07, §5.3, §5.5 · CA-T13  |
| **CONTENT-15** | Consumer-Content unterstützt zehn Sprachen            | CA-14 (`I-10`, `REST-03`)   |
| **CONTENT-16** | CMS ist keine Launch-Voraussetzung                    | CA-39, CA-40                |

---

## 10. Forbidden Regressions

- ❌ **Dateinamen, Slugs, Routen oder IDs in Übersetzungsdateien führen**
- ❌ **Eine Sprachvariante durch Eintragen eines fremdsprachigen Dateinamens „erledigen"**
- ❌ Ein Asset ohne erkennbare Sprachzuordnung als lokalisiert ausweisen
- ❌ hreflang auf eine Sprache setzen, deren Inhalt oder Asset fehlt
- ❌ Denselben Inhalt in zwei Schichten pflegen
- ❌ Nutzersichtbare Fließtexte in zehn Sprachkopien in die Datenschicht schreiben
- ❌ Vorformatierte Datums-, Zahlen- oder Größenangaben als strukturierte Daten behandeln
- ❌ Datumslogik oder Sortierung aus lokalisierten Strings ableiten
- ❌ Fachliche Beziehungen über Titel oder Pfade statt über IDs ausdrücken
- ❌ **Eine Ressource als „geschützt" bezeichnen, die nur unverlinkt ist**
- ❌ Ein Gate über Referrer, Redirect-Herkunft oder ein verborgenes Verzeichnis „implementieren"
- ❌ Lead-, CRM- oder Kundendaten in Asset- oder Content-Metadaten ablegen
- ❌ **Echte Patienten-, Kunden- oder Lead-Daten in Repository-Content oder Assets aufnehmen**
- ❌ Secrets, Keys oder Tokens in Content-Dateien oder Asset-Metadaten ablegen
- ❌ Assets als Base64-/Blob-Kopie in Content-Dateien duplizieren oder in zwei Bäumen doppelt führen
- ❌ Große feature-spezifische Daten in ein global geladenes i18n-Bundle aufnehmen
- ❌ Eine gesamte Content-Sammlung laden, um einen Datensatz anzuzeigen
- ❌ Eine Slug-Liste aus der Content-Quelle in die Routing-Wahrheit kopieren
- ❌ Canonical-, hreflang- oder Robots-Entscheidungen in Content-Dateien treffen
- ❌ **Ein CMS als Launch-Voraussetzung einführen oder Content-Governance als Launch-Scope erklären** (`DEC-RL-010`)
- ❌ Aus einer dokumentierten Schuld eine neue Product Decision ableiten

---

## 11. AP Ownership / Lifecycle

| Phase                    | AP                     | Ergebnis                                                                        |
| ------------------------ | ---------------------- | ------------------------------------------------------------------------------- |
| **Zielbild/Definition**  | **AP02 PT02.3**        | dieser Vertrag — **festgeschrieben 2026-08-24**                                 |
| **Readiness/Eigentum**   | **AP04**               | Content-Audit, Content-Typen, Launch-Readiness, Asset-Readiness (PT04.1–PT04.4) |
| Sprachen                 | **AP08**               | vollständige 10-Sprachen-Lokalisierung, sprachabhängige Assets (PT08.6)         |
| SEO-Nutzung              | **AP09**               | Ausgabe von Metadaten, Structured Data, OG                                      |
| Services                 | **AP12**/**AP13**      | Service-Datenmodell und Detailseiten                                            |
| IglooPro                 | **AP14**               | Produktdaten, `CV < 2 %` über alle Kanäle (`DEC-RL-008`), PDF-Versionen         |
| Epigenetik/Musterbefunde | **AP15**/**AP16**      | Befund-Datenmodell, Validierung, Charts, 10 Sprachen                            |
| Artikel                  | **AP17**               | Artikelmetadaten, Datumsfelder, Slug-/ID-Konsistenz                             |
| Events                   | **AP18**               | Eventdatenmodell, Zeitlogik, Archiv                                             |
| Downloads/Resources      | **AP19**               | Resource Center, Inventar, Metadaten, **Gating** (PT19.3)                       |
| Consumer                 | **AP21**               | Consumer-Content × 10, produktspezifische OG-Bilder                             |
| Lead-/Backend-Seite      | **AP22** (nach PT02.4) | Entitlement, Zustellung, CRM-Anbindung gegateter Ressourcen                     |
| Performance              | **AP25**               | Bundle-Wirksamkeit der Schicht-C-Trennung (`CD-3`)                              |
| Security                 | **AP26**               | Secret-/Datenscan über Content und Assets                                       |
| Nachweise                | **AP27**               | automatisierte Paritäts-, Existenz- und Klassifikationsguards (§9)              |

**Änderungen an diesem Vertrag** verantwortet AP02 gemeinsam mit AP04; bei Sprachbezug zusätzlich AP08.
Decision Locks werden hier nie geändert.
