# Wave 0 — DSGVO Incident: PII-Datei in Git-History

**Incident-ID:** WAVE-0-DSGVO-001
**Datum der Remediation:** 2026-04-23
**Verantwortlich:** Repository-Owner (PhillHH)
**Rechtsgrundlage:** DSGVO Art. 32 (Sicherheit der Verarbeitung), Art. 33/34 (Meldepflicht)

## Zusammenfassung

Die Datei `Vitd3_Mail/kontakte.xlsx` mit personenbezogenen Daten
(Namen und E-Mail-Adressen einer alten Kundenliste) war versehentlich
in der Git-History des öffentlichen Repositories `PhillHH/PolarisDX_Website`
eingecheckt. Am 2026-04-23 wurde die Datei vollständig aus der History
aller lokal erreichbaren Refs entfernt und `main` mit `--force` auf das
Remote gepusht.

## Was wurde entfernt

- **Pfad:** `Vitd3_Mail/kontakte.xlsx`
- **Dateigröße:** 9256 Bytes
- **Inhalt:** Personenbezogene Daten (Namen, E-Mail-Adressen) — Kundenliste
- **Commits, die die Datei berührten (vor dem Rewrite):**
  - `d4e25be` — Start (Initial Commit)
  - `259b8ec` — Merge pull request #71 from PhillHH/claude/add-vitamin-d3-guide-I2IgQ
  - `cbd56b6` — fix(ssr): Add browser API guards for SSR compatibility
- **Werkzeug:** `git-filter-repo 2.47.0` mit `--path Vitd3_Mail/kontakte.xlsx --invert-paths`
- **Begleitende Änderungen auf `main`:**
  - `3313c00` chore: remove obsolete Vitd3_Mail/ tooling (entfernt den
    kompletten Ordner inkl. `send_emails.py`, `config.py`, `Dockerfile`,
    `docker-compose.yml`, `requirements.txt`, `.env.example`,
    `vitamin-d3-k2-spray.html`)
  - `087f933` chore: prevent customer data files from being tracked
    (ergänzt `.gitignore` um `*.xlsx`, `*.csv`, `kontakte.*`)

## Wann wurde es entfernt

- **Entdeckung der PII im Repo:** 2026-04-23
- **History-Rewrite lokal:** 2026-04-23
- **Force-Push `main`:** 2026-04-23
- **Zeitraum, in dem die Datei öffentlich im Repo lag:** von `d4e25be`
  (Initial Commit, Start des Repos) bis `cbd56b6`. Die Datei war über
  die gesamte Laufzeit des öffentlichen Repos hinweg verfügbar.

## Remediation-Status nach dem Force-Push

| Aktion                                     | Status                     |
| ------------------------------------------ | -------------------------- |
| Datei aus `main` entfernt (Working Tree)   | ✅                         |
| Datei aus `main`-History entfernt          | ✅                         |
| `main` force-gepusht zu origin             | ✅                         |
| `.gitignore` präventiv gehärtet            | ✅                         |
| Andere Remote-Branches bereinigt           | ❌ offen (siehe unten)     |
| GitHub-Support kontaktiert (Cache-Purge)   | ❌ offen                   |
| Fork-Check                                 | ❌ offen                   |
| Betroffene Personen informiert (Art. 34)   | ❌ offen — Prüfung nötig   |
| Meldung an Aufsichtsbehörde (Art. 33, 72h) | ❌ offen — Bewertung nötig |

## Remote-Branches, die die Datei noch in der History tragen

Nur `main` wurde force-gepusht. Alle folgenden Remote-Branches enthalten
die Datei weiterhin in ihrer Commit-History und müssen entweder gelöscht,
rebased oder per eigenem `filter-repo` bereinigt werden:

- `origin/claude/add-playwright-smoke-test-5u4gd`
- `origin/claude/add-smoke-tests-D4tD7`
- `origin/claude/add-vitamin-d3-guide-I2IgQ`
- `origin/claude/docker-polarisdx-deployment-WwOqk`
- `origin/claude/eslint-lefthook-setup-XsxTH`
- `origin/claude/fix-ssr-hidden-content-qiBhy`
- `origin/claude/github-actions-ci-7sLuw`
- `origin/claude/react-ssr-migration-Druht`
- `origin/claude/setup-meta-tags-german-DPO8e`
- `origin/claude/setup-vitest-smoke-test-Ei5JX`
- `origin/claude/update-polarisdx-config-Gm3TJ`

Betroffene offene Pull Requests:

- **PR #86** (`claude/setup-meta-tags-german-DPO8e`) → muss neu erstellt
  oder gegen neues `main` rebased werden
- **PR #24** (`update-igloo-widget-and-header`, jules-bot) → Branch
  enthält die Datei NICHT in der History laut Scan, ist aber durch den
  Force-Push von `main` ohnehin aus dem Base-Kontext gefallen

## Follow-up-Aktionen (Pflicht)

### Sofort (innerhalb von 24h)

1. **GitHub-Support kontaktieren** (https://support.github.com/)
   mit Betreff _"Please purge sensitive data from repository cache"_ und
   folgenden Angaben:
   - Repository: `PhillHH/PolarisDX_Website`
   - Betroffene Commits (vor Rewrite): `d4e25be`, `259b8ec`, `cbd56b6`
   - Pfad der Datei: `Vitd3_Mail/kontakte.xlsx`
   - Bitte um Purge aller Caches, Pull-Request-Refs und Dangling-Objects
2. **Fork-Check.** Via GitHub-UI (`Insights → Forks`) prüfen, ob das Repo
   geforkt wurde. Falls ja: Fork-Owner kontaktieren und um Löschung
   oder eigenen Rewrite bitten.
3. **Feature-Branches entscheiden:**
   - Alle nicht mehr benötigten Branches aus obiger Liste löschen
     (`git push origin --delete <branch>`).
   - Aktive Branches entweder neu aus `main` ableiten oder
     einzeln `git filter-repo` unterziehen und force-pushen.

### Innerhalb von 72h (DSGVO Art. 33 Frist)

4. **Risikobewertung dokumentieren:**
   - Wie viele Personen sind betroffen?
   - Welche Datenkategorien (nur Name/Mail oder zusätzlich sensible Daten)?
   - Wahrscheinlichkeit eines tatsächlichen Zugriffs durch Dritte?
     (Public-Repo + Fork-Möglichkeit = realistisch höher als bei Private)
5. **Meldung an zuständige Aufsichtsbehörde** nach Art. 33 DSGVO, falls
   Risiko nicht ausschließbar ist. (Bei öffentlichem Repo mit Mail/Name
   in der Regel meldepflichtig.)

### Innerhalb angemessener Frist

6. **Benachrichtigung der Betroffenen** nach Art. 34 DSGVO, falls das
   Risiko als hoch eingestuft wird.
7. **Rotation potenziell kompromittierter Anmeldedaten.** Falls
   E-Mail-Adressen aus der Liste auch für andere Services verwendet
   werden, die mit dem Repo verknüpft sind, diese Zugänge prüfen.

## Team-Aktionen

Alle Team-Mitglieder mit lokalem Klon dieses Repos:

1. **Lokalen Klon wegwerfen** und neu klonen (`git clone`). Das alte
   `.git`-Verzeichnis enthält die PII-Datei noch in den Pack-Files.
2. **Alle offenen Feature-Branches** neu aus dem frischen `main`
   ableiten oder in Absprache rebasen.
3. **CI-Artefakte und lokale Caches prüfen** (Build-Artefakte,
   Docker-Images, Deployment-Logs) auf Kopien der Datei.

## Prävention

- `.gitignore` um `*.xlsx`, `*.csv`, `kontakte.*` ergänzt
  (siehe Commit `087f933`).
- Empfehlung: `gitleaks` oder `trufflehog` als pre-commit-Hook
  aktivieren, um PII/Secrets beim Einchecken zu blockieren.
- Empfehlung: Kundendaten grundsätzlich nur in dediziertem
  Private-Storage (Datenbank, S3 mit verschlüsselten Objekten),
  nie im Code-Repository.

## Nachweis-Artefakte

- Branch-Liste vor Rewrite: `/tmp/affected-branches.txt` (Arbeitskopie)
- Rewrite-Tool-Output: siehe CI-Log / Session-Transkript
- Commit-Historie nach Rewrite: `git log --all --full-history --
Vitd3_Mail/kontakte.xlsx` muss leer sein.
