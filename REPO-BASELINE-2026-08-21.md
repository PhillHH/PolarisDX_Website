# PolarisDX Relaunch — Repository Baseline 2026-08-21

> Read-only snapshot of the repository at `/home/phillip/01polaris-preview`, taken 2026-08-21.
> No files, branches, commits, services or configuration were modified while producing this document.
> Every assertion below is followed by the repository evidence it rests on (file path, git command output, commit SHA, or configuration location).
> No environment-variable values or secrets are reproduced; only variable _names_ are listed.

---

## 1. Executive Summary

| Fact                                               | Value                                                                                                             | Evidence                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Repository                                         | `PhillHH/PolarisDX_Website`                                                                                       | `git remote -v` → `git@github.com:PhillHH/PolarisDX_Website.git`                                   |
| Working directory                                  | `/home/phillip/01polaris-preview` (a **git worktree**, not the main checkout)                                     | `git rev-parse --show-toplevel`; `git rev-parse --git-common-dir` → `/home/phillip/01polaris/.git` |
| Current branch                                     | `feat/home-leadmagnet`                                                                                            | `git rev-parse --abbrev-ref HEAD`                                                                  |
| HEAD                                               | `961f65d456e2790e7063d1a6575651dff724e4ca` (2026-08-18 12:40)                                                     | `git rev-parse HEAD`                                                                               |
| Upstream                                           | **none configured**                                                                                               | `git rev-parse --abbrev-ref @{u}` → _"no upstream branch configured"_                              |
| Working tree                                       | **dirty**: 1 modified tracked file, 11 untracked files                                                            | `git status --porcelain`                                                                           |
| Documented baseline `feat/home-leadmagnet@961f65d` | **still the HEAD commit** — but the working tree is not clean, and `main` has since become the more advanced line | §3, §4                                                                                             |

The documented baseline commit is present and checked out. Three qualifications matter for planning:

1. **`main@d0fdf29` is now ahead in content, not behind.** `main` carries the same Epigenetik programme plus four further work packages (`AP1`–`AP4`) that do **not** exist on `feat/home-leadmagnet`. The two branches are _diverged_, not fast-forwardable: 120 commits on the branch, 77 on `main`, common ancestor `ae58074` (2026-06-24).
2. **The single uncommitted code change is a partial, known-broken replay of work already committed on `main`** (commit `e21a6e5`). See §4.2 — this is the most consequential finding in this baseline.
3. **The most accurate documentation in the repository is untracked.** `projektverzeichnis/` (11 files, 1384 lines, written 2026-08-20) is not committed and would be lost by a clean checkout, while the tracked docs (`DOCS.md`, `_project-knowledge/AUDIT-REPORT.md`) describe an architecture the code no longer has.

**Classification: READY WITH WARNINGS** (see §12).

---

## 2. Git State

### 2.1 Identity

```
repository root      /home/phillip/01polaris-preview
git common dir       /home/phillip/01polaris/.git      (shared object store + refs)
current branch       feat/home-leadmagnet
HEAD                 961f65d456e2790e7063d1a6575651dff724e4ca
HEAD date            2026-08-18 12:40:10 +0200
HEAD subject         "Epigenetik-Strecke: GenDG-Hinweis auch auf den vier Panels ohne Genotypen"
upstream             (none — no origin/feat/home-leadmagnet exists)
remote origin        git@github.com:PhillHH/PolarisDX_Website.git (fetch + push)
```

This directory is **one of 28 worktrees** sharing a single `.git` (`git worktree list`). The main checkout `/home/phillip/01polaris` holds `main` at `d0fdf29`. Consequences for any relaunch tooling:

- `main` **cannot be checked out here** — it is already checked out in `/home/phillip/01polaris`.
- The stash stack, refs and object store are shared across all 28 worktrees. Current stash depth: **0** (`git stash list | wc -l`).

### 2.2 Status

```
$ git status --porcelain=v1 -uall
 M src/pages/EpigeneticsPage.tsx
?? projektverzeichnis/01-seitenstruktur.md
?? projektverzeichnis/02-navigation.md
?? projektverzeichnis/03-technik.md
?? projektverzeichnis/04-i18n.md
?? projektverzeichnis/05-seo.md
?? projektverzeichnis/06-inhaltsdaten.md
?? projektverzeichnis/07-komponenten.md
?? projektverzeichnis/08-tracking-consent.md
?? projektverzeichnis/09-qualitaet.md
?? projektverzeichnis/10-befunde.md
?? projektverzeichnis/README.md
```

- **Staged changes: none.** `git diff --cached --stat` is empty.
- **Unstaged changes:** one file, `src/pages/EpigeneticsPage.tsx`, +5/−1 (`git diff --stat`).
- **Untracked:** the `projektverzeichnis/` directory only.
- **No merge/rebase/cherry-pick/revert/bisect in progress** — no `MERGE_HEAD`, `REBASE_*`, `CHERRY_PICK_HEAD` or `REVERT_HEAD` in `/home/phillip/01polaris/.git/worktrees/01polaris-preview/`.
- **No conflict markers** anywhere in tracked `*.ts/tsx/js/json/md` (grep for `^<<<<<<< ` / `^>>>>>>> `, excluding `node_modules`, returns nothing).

### 2.3 Branches relevant to the relaunch

Local (`git branch -vv`), most recent first:

| Branch                           | SHA           | Date                 | Upstream                        | Note                                                         |
| -------------------------------- | ------------- | -------------------- | ------------------------------- | ------------------------------------------------------------ |
| `main`                           | `d0fdf29`     | 2026-08-19 17:02     | `origin/main`                   | most advanced line; checked out in `/home/phillip/01polaris` |
| `feat/epigenetik-ap03-panelkopf` | `172d443`     | 2026-08-19 10:55     | —                               | merged into `main` as `50d32f7`                              |
| **`feat/home-leadmagnet`**       | **`961f65d`** | **2026-08-18 12:40** | **—**                           | **HEAD here; documented baseline**                           |
| `feat/epi-welle-0`               | `b8f1934`     | 2026-08-12           | —                               | checked out in `/home/phillip/01polaris-w0`                  |
| `feat/befund-umbau`              | `d5eb46f`     | 2026-08-11           | —                               | checked out in `/home/phillip/01polaris-w1`                  |
| `feat/epigenetik-welle-3`        | `b13494f`     | 2026-08-11           | —                               |                                                              |
| `fix/epigenetik-welle-1`         | `37d01e7`     | 2026-08-11           | —                               |                                                              |
| `feat/contact-joyful`            | `ab373a3`     | 2026-07-03           | —                               | local only                                                   |
| `redesign/preview`               | `5673b61`     | 2026-06-26           | `origin/redesign/preview`       |                                                              |
| `redesign/integration`           | `42e72fd`     | 2026-06-25           | `origin/redesign/integration`   |                                                              |
| `demo-relaunch`                  | `a4c7c2a`     | 2026-06-24           | `origin/archon/thread-3e09bedb` | checked out in `/home/phillip/01polaris-demo`                |
| `feat/blue-token-darker`         | `39896e7`     | 2026-06-23           | `origin/feat/blue-token-darker` |                                                              |

Plus ~20 `archon/thread-*` / `archon/task-*` snapshot branches (all June 2026, all pinned to worktrees under `~/.archon/workspaces/`). 55 refs total (`git for-each-ref | wc -l`).

Remote branches present (`git branch -r`, reflecting the last fetch at **2026-08-19 14:36** plus local pushes):

```
origin/HEAD -> origin/main
origin/main                           d0fdf29
origin/redesign/preview               5673b61
origin/redesign/integration           42e72fd
origin/archon/task-redesign-full      a44ecc5
origin/archon/task-relaunch           44aa451
origin/archon/thread-3e09bedb         a4c7c2a
origin/archon/thread-7f27f682         289a0a9
origin/archon/thread-eeb30702         02b716d
origin/feat/blue-token-darker         (present)
origin/feat/ga-tracking-alllang       259fd00
origin/feature/consumer-landing-pages 8f1d960
```

**Neither `feat/home-leadmagnet` nor `feat/contact-joyful` exists on `origin`** (`git branch -r --list origin/feat/home-leadmagnet` → empty; same for `feat/contact-joyful`). Both are local-only lines. `feat/home-leadmagnet@961f65d` therefore exists in exactly one place: this machine's shared object store.

---

## 3. Baseline and Branch Relationships

### 3.1 Availability of the four named commits

All four exist as reachable commit objects (`git cat-file -t` → `commit` for each):

| Ref                            | SHA (full)                                 | Date             | Subject                                                                   |
| ------------------------------ | ------------------------------------------ | ---------------- | ------------------------------------------------------------------------- |
| `feat/home-leadmagnet@961f65d` | `961f65d456e2790e7063d1a6575651dff724e4ca` | 2026-08-18 12:40 | Epigenetik-Strecke: GenDG-Hinweis auch auf den vier Panels ohne Genotypen |
| `main@d0fdf29`                 | `d0fdf29cb1dbde78cc743b4d7a5077b79c6dafaf` | 2026-08-19 17:02 | Epigenetik-Strecke: AP4 — die laengste Seite der Site                     |
| `redesign/preview@5673b61`     | `5673b611de5225c52fd304c874389c58dee85a14` | 2026-06-26 13:27 | preview snapshot (incl. uncommitted WIP)                                  |
| `feat/contact-joyful@ab373a3`  | `ab373a38b6935d1419ab512c9ae7274b1013b11e` | 2026-07-03 12:56 | feat(contact): joyful single-page contact form with live progress meter   |

The short SHAs given in the task all resolve to the branch tips of the same names — no ambiguity, no drift between the documented SHA and the current branch tip for any of the four.

### 3.2 Ancestry

**All four share a single common ancestor: `ae58074` (2026-06-24, "feat(archon): autonomer Voll-Redesign-Workflow polaris-redesign-auto").** `git merge-base` returns `ae58074` for every one of the six pairings. There is no linear relationship between any two of them — they are four independent lines fanning out from one June point.

`git rev-list --left-right --count A...B` (left-ahead / right-ahead):

| Pair                  | A ahead | B ahead | Relationship |
| --------------------- | ------- | ------- | ------------ |
| `961f65d` … `d0fdf29` | 120     | 77      | **diverged** |
| `961f65d` … `5673b61` | 120     | 31      | diverged     |
| `961f65d` … `ab373a3` | 120     | 1       | diverged     |
| `d0fdf29` … `5673b61` | 77      | 31      | diverged     |
| `d0fdf29` … `ab373a3` | 77      | 1       | diverged     |
| `5673b61` … `ab373a3` | 31      | 1       | diverged     |

`git merge-base --is-ancestor 961f65d d0fdf29` → **NO**. The current HEAD is **not** contained in `main`.
`git branch -a --contains 961f65d` → **`feat/home-leadmagnet` only**. The baseline commit is on no other branch, local or remote.

### 3.3 The critical relationship: `feat/home-leadmagnet` vs `main`

The 120/77 split understates how much overlap exists. `git cherry d0fdf29 961f65d` classifies the branch's 120 commits by whether an equivalent patch is already on `main`:

```
108 commits marked '+'  (unique to feat/home-leadmagnet)
 12 commits marked '-'  (patch-equivalent already on main)
```

Reading the two logs side by side shows the actual situation: **`main` contains a re-authored version of the same Epigenetik programme, plus four work packages beyond it.** Matching subject pairs (branch → main):

| Work                                   | on `feat/home-leadmagnet` | on `main`       |
| -------------------------------------- | ------------------------- | --------------- |
| GenDG-Hinweis auf vier Panels          | `961f65d` (HEAD)          | `721ea8c`       |
| Datenschutz-Link, Kapitelbuendelung    | `e792cd3`                 | `f64d5a1`       |
| Krankheitsaussagen aus Befundtexten    | `40c743f`                 | `af17244`       |
| Frontend-Gruppe der Abnahme            | `af25b83`                 | `9c85515`       |
| Abnahme des Umbaus                     | `f6d3a46`                 | `894c29f`       |
| **AP1 — drei Vertiefungsseiten**       | _absent_                  | `543fe41`       |
| **AP2 — den Trichter schliessen**      | _absent_                  | `05a58f2`       |
| **AP3 — erste Entscheidung nach vorn** | _absent_                  | `86fd38d`       |
| **AP4 — die laengste Seite der Site**  | _absent_                  | `d0fdf29` (tip) |

`main` additionally carries work absent here: `b699435` (Vertiefung auf drei Unterseiten), `c59cf5d` (alle vier Anfragewege messbar), `475fefd` (Rufnummern vereinheitlicht), `e21a6e5` (sticky table header — see §4.2).

`git diff --stat d0fdf29 961f65d` → **312 files changed, 24 004 insertions, 13 950 deletions**. The two lines are substantially different codebases, not a small delta.

### 3.4 The other two branches

- **`redesign/preview@5673b61`** (2026-06-26) is a snapshot branch — its own commit message says _"preview snapshot (incl. uncommitted WIP)"_, i.e. it was created by committing a dirty tree wholesale. It is 31 commits past `ae58074` and has received nothing since June. It is on `origin`.
- **`feat/contact-joyful@ab373a3`** (2026-07-03) is a **single commit** past the June common ancestor and exists only locally. It has not been merged into `main` (`git cherry` pairing not applicable; it is 1 ahead of the merge base, and `main` does not contain it).

Neither branch is a viable relaunch base against the August work on `main`; both predate the entire Epigenetik programme.

---

## 4. Working Tree Delta

### 4.1 Untracked: `projektverzeichnis/` (11 files, 1384 lines, created 2026-08-20 10:12–10:19)

A complete structural documentation set for the project, written the day before this baseline. Per `projektverzeichnis/README.md`: _"Stand der Erhebung: 2026-08-20, Branch `feat/home-leadmagnet`."_ Contents:

| File                     | Lines | Subject                                                     |
| ------------------------ | ----- | ----------------------------------------------------------- |
| `README.md`              | 33    | index + short profile                                       |
| `01-seitenstruktur.md`   | 130   | routes, URLs, slugs, language prefixes, redirects, 404      |
| `02-navigation.md`       | 140   | header/mega menu, footer, chapter bars, anchors             |
| `03-technik.md`          | 195   | stack, SSR architecture, build, server, backend API, deploy |
| `04-i18n.md`             | 91    | 10 languages, 15 namespaces, fallback logic                 |
| `05-seo.md`              | 156   | sitemap, hreflang, canonicals, structured data, robots      |
| `06-inhaltsdaten.md`     | 161   | data sources                                                |
| `07-komponenten.md`      | 176   | component tree, hooks, lib, tokens                          |
| `08-tracking-consent.md` | 86    | GTM, consent mode, cookie banner                            |
| `09-qualitaet.md`        | 92    | tests, linting, scripts, hooks, CI                          |
| `10-befunde.md`          | 124   | 13 documented deviations and legacy items                   |

This is by a wide margin the most current and most accurate documentation in the repository (cross-checked against code in §7 and §9), and it is **not under version control**. A `git clean -fd`, a fresh clone, or a worktree removal destroys it.

### 4.2 Modified: `src/pages/EpigeneticsPage.tsx` (+5 / −1) — **the material finding**

The change makes the comparison table's `<th>` cells sticky:

```diff
-<th key={col} scope="col" className="px-5 py-4 text-sm font-semibold">
+<th
+  key={col}
+  scope="col"
+  className="sticky top-[var(--chapterbar-offset,153px)] z-10 bg-brand-deep px-5 py-4 text-sm font-semibold first:rounded-tl-3xl last:rounded-tr-3xl"
+>
```

**This same change already exists on `main` as commit `e21a6e5`** ("fix(epigenetik): Tabellenkopfzeile bleibt beim Scrollen stehen", 2026-08-11, +14/−2). But `e21a6e5` changes **two** things — the `<th>` cells _and_ the wrapper `<div>`:

```diff
-<div className="mt-10 hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white lg:block">
+<div className="mt-10 hidden rounded-3xl border border-slate-200 bg-white lg:block">
```

Its commit message documents exactly why the wrapper change is required:

> _"Der erste Versuch mit overflow-hidden am Wrapper ging schief: das macht ihn zum Scroll-Container, die Kopfzeile richtete sich dann an ihm statt am Viewport aus und blieb 58px zu weit oben, also weiterhin hinter der Leiste."_

The working tree here still has the overflow on the wrapper ([src/pages/EpigeneticsPage.tsx:401](src/pages/EpigeneticsPage.tsx#L401)):

```
<div className="mt-10 overflow-x-auto rounded-3xl border border-slate-200 bg-white">
```

**Conclusion:** the uncommitted change is a partial hand-replay of `e21a6e5` that reproduces the arrangement the original commit explicitly recorded as broken. The `overflow-x-auto` wrapper makes itself the scroll container, so `position: sticky` on the header cells resolves against the wrapper rather than the viewport. This change should be **discarded**, not committed — `main` already carries the complete and verified version.

(Note also a second, unrelated divergence: on `main`/`e21a6e5` the wrapper carries `hidden … lg:block` — desktop-only. Here it does not, because the branch took a different route on mobile table handling. This is one instance of the broader 312-file divergence from §3.3.)

---

## 5. Runtime and Toolchain

### 5.1 Measured runtime

```
$ node -v   →  v20.19.6
$ npm -v    →  10.8.2
```

**Mismatch against CI and Docker, both of which pin Node 22:**

- `.github/workflows/ci.yml`: `node-version: '22'`
- `Dockerfile`: `FROM node:22-alpine` (both builder and runner stages)
- `Dockerfile.dev`: `FROM node:22-alpine`
- `package.json` declares **no `engines` field** and no `packageManager` field — nothing in the repository pins Node 20 vs 22.

### 5.2 Package manager and lockfile

- **npm**, single `package-lock.json` (`lockfileVersion: 3`, 351 012 bytes). No `yarn.lock`, `pnpm-lock.yaml` or `bun.lockb`.
- `.npmrc` present (22 bytes).
- `npm ls --depth=0` reports **no UNMET / invalid / missing** dependencies. Two packages are flagged `extraneous`: `@emnapi/runtime@1.10.0` and `tslib@2.8.1` — both transitive artefacts of `sharp`, harmless, and cleared by a fresh `npm ci`.
- `package.json` and `package-lock.json` were last changed together in the same commit `185bffe` (2026-08-12, "fix(lint): fehlenden TypeScript-Resolver nachinstallieren") — **they are in sync**.

### 5.3 Package boundaries

**Three** `package.json` files exist outside `node_modules` (`find . -name package.json -not -path '*/node_modules/*'`):

| Path                                       | Name                     | Role                                                                                                              |
| ------------------------------------------ | ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `./package.json`                           | `polarisdx-web`          | **frontend + SSR server** (React 19, Vite 7, Express 5, `server.ts`)                                              |
| `./server/package.json`                    | `polarisdx-mail-service` | **backend mail/API service** (Express **4**, SendGrid, pdfkit) — own lockfile, own `node_modules`, own Dockerfile |
| `./_project-knowledge/config/package.json` | —                        | **archived snapshot**, not a build target (see §8)                                                                |

The two live packages are fully independent: separate dependency trees, separate Express major versions (5 vs 4), separate containers. The root `server` script bridges them: `"server": "cd server && npm install && npm start"`.

### 5.4 Versions from the repository

Root `package.json` — runtime dependencies:

| Package                | Range     | Installed |
| ---------------------- | --------- | --------- |
| `react` / `react-dom`  | `^19.2.0` | 19.2.0    |
| `react-router-dom`     | `^7.9.6`  | 7.9.6     |
| `react-helmet-async`   | `^2.0.5`  | 2.0.5     |
| `express`              | `^5.1.0`  | —         |
| `i18next`              | `^25.6.3` | 25.6.3    |
| `react-i18next`        | `^16.3.5` | 16.3.5    |
| `i18next-http-backend` | `^3.0.2`  | —         |

Dev dependencies:

| Package                | Range     | Installed |
| ---------------------- | --------- | --------- |
| `vite`                 | `^7.2.4`  | 7.2.4     |
| `typescript`           | `~5.9.3`  | 5.9.3     |
| `@vitejs/plugin-react` | `^5.2.0`  | —         |
| `tailwindcss`          | `^3.4.17` | 3.4.18    |
| `vitest`               | `^4.1.5`  | 4.1.5     |
| `typescript-eslint`    | `^8.46.4` | 8.47.0    |
| `lefthook`             | —         | 2.1.6     |
| `tsx`                  | —         | 4.21.0    |

Backend `server/package.json`: `express@^4.19.2`, `@sendgrid/mail@^8.1.6`, `cors`, `dotenv`, `express-rate-limit@^7.4.0`, `pdfkit@^0.15.0`.

### 5.5 Scripts (`package.json`)

```json
"dev":             "tsx server.ts"
"dev:vite":        "vite"
"build":           "npm run build:client && npm run build:server"
"build:client":    "vite build --outDir dist/client"
"build:server":    "vite build --ssr src/entry-server.tsx --outDir dist/server"
"build:prerender": "tsc -b && vite build && node scripts/prerender.mjs"
"prerender":       "node scripts/prerender.mjs"
"start":           "NODE_ENV=production tsx server.ts"
"preview":         "NODE_ENV=production tsx server.ts"
"lint":            "eslint ."
"typecheck":       "tsc -b"
"check:colors":    "node scripts/check-color-tokens.mjs"
"format":          "prettier --write ."
"format:check":    "prettier --check ."
"test":            "vitest run --reporter=default"
"test:e2e":        "playwright test"
"server":          "cd server && npm install && npm start"
"prepare":         "lefthook install"
```

Note `start` and `preview` are **identical** — there is no separate preview build path in the scripts; the preview differs only by the `PORT`/`BACKEND_URL` environment it is launched with (§7.3).

TypeScript is split across four configs: `tsconfig.json` (solution), `tsconfig.app.json`, `tsconfig.node.json`, `tsconfig.server.json`.

---

## 6. Repository Structure

Root directories (`ls -la`, `find -maxdepth 2 -type d`), excluding `node_modules`, `.git`, `dist`:

```
/
├── src/                    application source (React 19 + SSR)
│   ├── pages/         (29 files)   route components incl. musterbefund/, consumer/
│   ├── components/    (78 files)   layout/, sections/, seo/, ui/
│   ├── content/       (17 files)   befunde/*.de.json | *.en.json (6 panels × 2 langs)
│   ├── data/           (6 files)   services, articles, events, downloads, testimonials
│   ├── lib/            (6 files)
│   ├── hooks/          (8 files)
│   ├── api/            (3 files)   backend clients
│   ├── assets/, types/, test/setup.ts
│   ├── App.tsx, entry-client.tsx, entry-server.tsx
│   ├── i18n.ts, i18n.client.ts, i18n.server.ts
│   └── index.css, App.css
├── server/                 SEPARATE backend package (mail/API service)
│   ├── server.js (30 658 B), server.test.js, package.json, package-lock.json
│   ├── Dockerfile, docker-compose.yml
│   └── .env (gitignored), .env.example
├── public/
│   ├── locales/            10 languages × 15 namespaces
│   ├── downloads/          PDFs incl. downloads/epigenetics/{de,en}
│   └── robots.txt          (NO static sitemap.xml — generated at runtime, §7.2)
├── scripts/                build/i18n/debug helpers, prerender.mjs, check-color-tokens.mjs
├── e2e/                    url-smoke.spec.ts (single Playwright spec)
├── email/                  SEPARATE Python container (send.py, Dockerfile, requirements.txt, HTML templates)
├── docs/                   14 markdown files (current-ish project docs)
├── knowledge/              Archon design-reference corpus (5 books + figure PNGs)
├── _project-knowledge/     ARCHIVED pre-refactor source snapshot (see §8)
├── projektverzeichnis/     UNTRACKED — newest structural documentation (2026-08-20)
├── wireframes/             consumer/, ppt/
├── .archon/workflows/      polaris-redesign.yaml, polaris-redesign-auto.yaml
├── .github/workflows/      ci.yml
├── .claude/                settings.local.json (59 B)
└── dist/                   gitignored build output — client/ + server/
```

Root files of note: `server.ts` (33 168 B — the SSR server), `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, `tailwind.config.js` (9 341 B), `eslint.config.js`, `lefthook.yml`, `index.html`, `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `nginx.conf`, `vercel.json`, `deploy.sh`, `preview.log`, `google0a5363efd12b6a30.html` (Search Console verification).

**There is no `AGENTS.md` and no `CLAUDE.md` anywhere in the repository** (`find . -iname 'AGENTS.md' -o -iname 'CLAUDE.md'`, excluding `node_modules` → empty).

---

## 7. Current Runtime / Deployment Topology

Derived from active configuration, not from documentation.

### 7.1 SSR entry points

| Entry            | File                             | Consumed by                                                  |
| ---------------- | -------------------------------- | ------------------------------------------------------------ |
| Client hydration | `src/entry-client.tsx` (2 252 B) | `vite build --outDir dist/client`                            |
| Server render    | `src/entry-server.tsx` (2 995 B) | `vite build --ssr src/entry-server.tsx --outDir dist/server` |

`server.ts` loads them by mode:

- **development** — `vite.ssrLoadModule('/src/entry-server.tsx')` ([server.ts:616](server.ts#L616)) via Vite middleware (HMR).
- **production** — `path.resolve(__dirname, 'dist/server/entry-server.js')` ([server.ts:630](server.ts#L630)) plus `dist/client/index.html`.

**Consequence:** in production mode the server serves from `dist/`, never from `src/`. Source edits are invisible until `npm run build` runs.

### 7.2 Frontend server — `server.ts` (the live topology)

Express 5 SSR server, 33 KB, in TypeScript, executed directly by `tsx` (no compile step).

```
PORT         = process.env.PORT ?? 3000                 (server.ts:27)
BACKEND_URL  = process.env.BACKEND_URL ?? http://localhost:5000   (server.ts:28)
bind         = app.listen(PORT, '127.0.0.1', …)         (server.ts:770)
```

Responsibilities visible in the file:

- 10-language routing — `SUPPORTED_LANGUAGES = ['de','en','pl','fr','it','es','pt','da','nl','cs']`, default `de` ([server.ts:57](server.ts#L57)).
- **Dynamic sitemap generation** from an in-file `SITEMAP_ROUTES` table plus hreflang alternates ([server.ts:156](server.ts#L156), [server.ts:250](server.ts#L250), [server.ts:278](server.ts#L278)). `public/sitemap.xml` **does not exist as a file** — it is a runtime response.
- Security headers, including **`Content-Security-Policy-Report-Only`** — deliberately not enforcing ([server.ts:428](server.ts#L428), comment: _"bricht die Live-Seite NICHT"_).
- `/api/*` reverse proxy to `BACKEND_URL` via `http-proxy-middleware`.
- Font preload tag discovery by scanning `dist/client/assets` for the hashed Inter woff2 ([server.ts:37-53](server.ts#L37-L53)).
- Binding to `127.0.0.1` only — never directly internet-facing; an external reverse proxy is assumed.

### 7.3 Backend server — `server/server.js`

Independent Express **4** service (30 658 B). Endpoints and rate limits per `projektverzeichnis/03-technik.md` §5, verified against the file: `/api/contact`, `/api/support`, `/api/roi-report` are behind `formLimiter`; **`/api/consumer-order` is not** (§10.6). Uses `@sendgrid/mail`; `pdfkit` for the ROI report (`server/server.js:636`). Reads `server/.env` through `dotenv`. Default port 5000.

### 7.4 Preview configuration

Documented in [docs/deploy-preview.md](docs/deploy-preview.md), and corroborated by the running artefacts in this directory:

- **No Docker, no systemd, no pm2.** A detached Node process (`npx tsx server.ts`, PPID 1) listening on `127.0.0.1:9100`; host nginx maps `preview.polarisdx.net` → 9100.
- Launch environment (variable names only): `PORT=9100`, `NODE_ENV=production`, `BACKEND_URL=http://127.0.0.1:5001`.
- **`server.ts` does not autoload `.env`** — no `dotenv` import exists in it; the environment must be set at launch.
- Corroborating artefact: [preview.log](preview.log) (2026-08-04) shows the banner `Mode: Production / URL: http://localhost:9100`, two `<Navigate> must not be used on the initial render in a <StaticRouter>` warnings, and a final `Killed`.
- `docs/deploy-preview.md` explicitly warns: do **not** run the production `./deploy.sh` here, and never `pkill -f 'tsx server.ts'` (it would also kill container instances).

`vite.config.ts` additionally registers a third host: `allowedHosts: ['relaunch.polarisdx.net']` with an HMR host of the same name on port 5173 and a dev proxy to `http://localhost:5000` — the dev-HMR target, only relevant under `npm run dev:vite`.

### 7.5 Docker / Compose — the production path

[docker-compose.yml](docker-compose.yml) defines two services on a bridge network `app-network`:

| Service    | Build context                    | Port mapping            | Environment                                                           |
| ---------- | -------------------------------- | ----------------------- | --------------------------------------------------------------------- |
| `frontend` | `.` / `Dockerfile`               | `127.0.0.1:2026 → 3000` | `NODE_ENV=production`, `PORT=3000`, `BACKEND_URL=http://backend:5000` |
| `backend`  | `./server` / `server/Dockerfile` | `127.0.0.1:5000 → 5000` | `env_file: ./server/.env`                                             |

Both `restart: unless-stopped`; `frontend` has `depends_on: backend`.

[Dockerfile](Dockerfile) is a two-stage Node 22 Alpine build: builder runs `npm ci` + `npm run build`; runner installs `--omit=dev` plus `tsx`, copies `dist/`, `server.ts` and `public/`, exposes 3000, adds a curl healthcheck, and starts `npx tsx server.ts`. Both stages run `npm pkg delete scripts.prepare` to suppress the lefthook `prepare` hook.

[deploy.sh](deploy.sh) wraps this: `build | up | test | logs | down` over `docker compose`.

### 7.6 Active vs apparently legacy deployment files

| File                                              | Status                                              | Evidence                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `server.ts`                                       | **ACTIVE** — the real frontend server in every mode | entry point of `dev`, `start`, `preview`, and the Dockerfile `CMD`                                                                                                                                                                                                                               |
| `docker-compose.yml` + `Dockerfile` + `deploy.sh` | **ACTIVE** — production path                        | ports/env consistent with `server.ts`; `Node 22`                                                                                                                                                                                                                                                 |
| `server/` (Dockerfile, compose, server.js)        | **ACTIVE** — backend                                | referenced by root compose `build.context: ./server`                                                                                                                                                                                                                                             |
| `docs/deploy-preview.md`                          | **ACTIVE** — the preview runbook                    | matches `preview.log` and `server.ts` behaviour                                                                                                                                                                                                                                                  |
| **`nginx.conf`**                                  | **LEGACY, still in root**                           | configures `root /usr/share/nginx/html` + `try_files $uri /index.html` — a _static SPA_ setup. Nothing in `docker-compose.yml` builds or mounts an nginx container; the frontend service is a Node SSR container on port 3000. Confirmed independently in `projektverzeichnis/10-befunde.md` §4. |
| **`vercel.json`**                                 | **LEGACY**                                          | SPA rewrite `/((?!assets/).*) → /index.html` plus `/services/*` → `/diagnostics/*` redirects. No Vercel deployment is referenced by any active config; `.vercel/` is gitignored.                                                                                                                 |
| **`Dockerfile.dev`**                              | **LEGACY/unused**                                   | not referenced by `docker-compose.yml` or `deploy.sh`; its `CMD ["npm","run","dev"]` starts the SSR server, not a Vite dev server, and exposes 3000 while Vite is configured for 5173                                                                                                            |
| **`scripts/prerender.mjs`**                       | **LEGACY**                                          | reachable only via `build:prerender`, which `npm run build` never invokes; its route table is stale (see §9)                                                                                                                                                                                     |

### 7.7 CI and hooks

[.github/workflows/ci.yml](.github/workflows/ci.yml) — triggers on PR to `main` and push to `main`. Node 22, `npm ci`, then: `tsc -b --noEmit` → `eslint .` → `prettier --check .` → `npm test` (vitest) → `npm run build` → Playwright chromium install → `npx playwright test e2e/url-smoke.spec.ts`.

**`feat/home-leadmagnet` has never been exercised by this CI** — it is not on `origin`, so neither the push trigger (`branches: [main]`) nor the PR trigger has ever fired for it.

[lefthook.yml](lefthook.yml) — pre-commit: prettier `--write` + eslint `--fix` on staged files (both with `stage_fixed: true`), then `tsc -b --noEmit` and `node scripts/check-color-tokens.mjs` over the whole project.

---

## 8. Existing Documentation

### 8.1 Inventory

| Location                      | Files                                                                                                                                | Nature                                                                                    | Currency                                                                                                                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`AGENTS.md`**               | **absent**                                                                                                                           | —                                                                                         | —                                                                                                                                                                                                        |
| **`CLAUDE.md`**               | **absent**                                                                                                                           | —                                                                                         | —                                                                                                                                                                                                        |
| `.claude/settings.local.json` | 1 (59 B)                                                                                                                             | local tool settings                                                                       | —                                                                                                                                                                                                        |
| **`projektverzeichnis/`**     | 11 md, 1384 lines                                                                                                                    | **structural documentation of the whole site**                                            | **2026-08-20 — newest, UNTRACKED**                                                                                                                                                                       |
| `docs/`                       | 14 md                                                                                                                                | mixed operational + SEO                                                                   | `deploy-preview.md`, `ci.md`, `design-system.md`, `backlog.md`, `migration-map.md`, `global-fixes.md`, `internal-linking-audit.md`, `seo-analysis-2026-02-06.md`, `docs/seo/*` (4), `docs/content/*` (2) |
| `knowledge/`                  | `ARCHON-README.md`, `COVERAGE.md`, `design-references/`                                                                              | Archon agent-swarm knowledge base: 5 full design books (Atomic Design etc.) + figure PNGs | June 2026                                                                                                                                                                                                |
| `_project-knowledge/`         | ~90 files                                                                                                                            | **archived source snapshot**, not documentation                                           | pre-refactor                                                                                                                                                                                             |
| `.archon/workflows/`          | 2 yaml                                                                                                                               | `polaris-redesign.yaml`, `polaris-redesign-auto.yaml`                                     | June 2026                                                                                                                                                                                                |
| Root markdown                 | `README.md`, `README.de.md`, `DOCS.md`, `SEO_STRATEGY.md`, `AUDIT_I18N_ROUTING.md`, `MISSING_TRANSLATIONS.md`, `CHAT_INTEGRATION.md` | all dated 2026-06-25                                                                      | stale (§9)                                                                                                                                                                                               |

### 8.2 `_project-knowledge/` is a source archive, not knowledge

Despite the name, this directory holds **copies of application source and config**, not prose: `app-shell/{App.tsx, App.lazy.tsx, main.tsx}`, `components/{layout,sections,seo,ui}/*.tsx`, `i18n/*.ts`, `locales/<lang>/*.json`, `config/{package.json, vite.config.ts, tailwind.config.js, tsconfig.json, index.html}`, `deploy/{Dockerfile, docker-compose.yml, nginx.conf, vercel.json, robots.txt}`, plus `wave-1-analyse/`, `wave-2-analyse/` and a single prose file `AUDIT-REPORT.md`.

This creates a real hazard: `_project-knowledge/config/package.json`, `_project-knowledge/deploy/docker-compose.yml` and `_project-knowledge/deploy/nginx.conf` are **frozen historical copies that look like live configuration**. Any grep-based agent scanning for "the Dockerfile" or "the package.json" will find two of each.

`_project-knowledge/AUDIT-REPORT.md` states its own top-5 criticals — and **four of the five are now obsolete** (§9).

### 8.3 Overlap and contradiction map

- **Three overlapping "how it deploys" documents:** `DOCS.md` (root), `projektverzeichnis/03-technik.md`, `docs/deploy-preview.md`. Only the latter two agree with the code.
- **Two i18n audits:** `AUDIT_I18N_ROUTING.md` + `MISSING_TRANSLATIONS.md` (both 2026-06-25) vs `projektverzeichnis/04-i18n.md` (2026-08-20).
- **Two design-system sources:** `docs/design-system.md` vs `knowledge/design-references/` (the Brad Frost corpus driving the June Archon refactor) — plus `projektverzeichnis/07-komponenten.md` for the current token reality.
- **Two component inventories:** `_project-knowledge/components/` (archived files) vs `projektverzeichnis/07-komponenten.md` (current tree, 78 files).

---

## 9. Documentation vs Repository Drift

### 9.1 `DOCS.md` describes an architecture that no longer exists — **highest-impact drift**

[DOCS.md](DOCS.md), last modified 2026-06-25, states:

> _"Stage 2 (Runner): Nginx Alpine Image serviert die statischen Dateien."_
> _"Serving: Nginx ist konfiguriert als Webserver und Reverse Proxy."_
> _"Da es sich um eine Single Page Application (SPA) handelt, leitet Nginx alle unbekannten Anfragen an die index.html weiter."_
> Network flow diagram: `[Browser] -> [Port 80: Nginx Container] -> /usr/share/nginx/html`

Every one of these is false against the current [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml): stage 2 is `node:22-alpine` running `npx tsx server.ts` on port 3000; there is no nginx container; the application is **server-side rendered**, not an SPA. `DOCS.md` also documents a _"Payload CMS (`backend/`)"_ — **no `backend/` directory exists** in the repository.

Its two other claims are still accurate and worth keeping: SMTP via a separate `server/` service, and translations loaded via `i18next-http-backend` from `public/locales/`.

### 9.2 `_project-knowledge/AUDIT-REPORT.md` — 4 of 5 criticals are resolved or wrong

| Audit claim                                                  | Current reality                                                                                                                                                                                                                   | Evidence                                                         |
| ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 1. _"DSGVO-Risiko durch `Vitd3_Mail/kontakte.xlsx` im Repo"_ | **Resolved.** Directory does not exist; `git ls-files \| grep -iE 'kontakte\|xlsx\|Vitd3_Mail'` → empty. `.gitignore` now blocks `*.xlsx`, `*.csv`, `kontakte.*` under the heading _"Kundendaten duerfen nie eingecheckt werden"_ | `.gitignore:38-41`                                               |
| 2. _"i18n unvollständig (792 fehlende Keys, kein hreflang)"_ | **Substantially resolved.** 10 language dirs × 15 namespaces present; hreflang alternates generated in `server.ts`                                                                                                                | `ls public/locales`; [server.ts:339](server.ts#L339)             |
| 3. _"Zwei parallele App-Trees (App.tsx + App.lazy.tsx)"_     | **Resolved.** Only `src/App.tsx` exists; `App.lazy.tsx` survives solely as an archived copy in `_project-knowledge/app-shell/`                                                                                                    | `ls src/App*.tsx`                                                |
| 4. _"sitemap.xml fehlt (in robots.txt aber referenziert)"_   | **Obsolete framing.** No static file exists by design — the sitemap is generated at runtime from `SITEMAP_ROUTES`                                                                                                                 | [server.ts:156](server.ts#L156), [server.ts:250](server.ts#L250) |
| 5. _"ChatWidget ist Mock-Echo, hardcoded Mail-Empfänger"_    | **Still true.** `POST /api/chat` returns fixed strings with simulated latency                                                                                                                                                     | `projektverzeichnis/10-befunde.md` §10                           |

Any planning agent that reads this audit as current will chase four closed items.

### 9.3 `src/App.tsx` header comment contradicts the code it heads

Per `projektverzeichnis/10-befunde.md` §2, the file header at [src/App.tsx:11-16](src/App.tsx#L11-L16) claims `/consumer/*` pages are _"nicht in der Navigation, nicht in der sitemap.xml, noindex und server-seitig per Passwort (Basic Auth) geschützt."_ Verified reality: they **are** in the sitemap (`CONSUMER_SITEMAP_ROUTES`, priority 0.8), they carry **no** noindex, **no** auth middleware exists in `server.ts`, and `robots.txt` explicitly records that `/consumer/*` is site-wide indexable. Only _"not linked in navigation"_ still holds. This is a false-privacy claim sitting in the most-read file of the app.

### 9.4 `scripts/prerender.mjs` carries a stale route catalogue

Per `projektverzeichnis/10-befunde.md` §1: the `ROUTES` list uses underscores where live routes use hyphens (`/diagnostics/poc_systemloesungen` vs `poc-systemloesungen`, and five more), lists article **ids** instead of slugs, names three articles no longer in `articles.ts` (`first_checkup`, `managing_diabetes`, `home_care`), and knows nothing of `/epigenetics`, the Musterbefunde, `/support`, the consumer pages, or language prefixes. It is dead weight that _"looks like a valid route catalogue."_

### 9.5 `nginx.conf` and `vercel.json` read as valid deploy config and are not

See §7.6. Independently documented in `projektverzeichnis/10-befunde.md` §4.

### 9.6 One internal inconsistency inside the newest documentation

`projektverzeichnis/10-befunde.md` §13 states: _"`dist/client/index.html` datiert auf 2026-08-18 12:41. **Die vier Epigenetik-Commits danach** und die uncommitteten Änderungen … sind nicht gebaut."_

On `feat/home-leadmagnet` there are **no** commits after `961f65d` — HEAD _is_ the 2026-08-18 12:40 commit and `dist/` was built one minute later. The four commits it refers to (`543fe41`, `05a58f2`, `86fd38d`, `d0fdf29` = AP1–AP4) exist on **`main`**, not on this branch. The observation about the uncommitted `EpigeneticsPage.tsx` change not being built is correct; the framing of "four commits on this branch" is not. The document was evidently written with `main`'s log in view.

### 9.7 Changes since the last documentation pass (2026-08-20)

`find . -newermt '2026-08-20 00:00'` (excluding `node_modules`, `.git`, `server/node_modules`) returns **exactly the 11 `projektverzeichnis/` files** and nothing else. No source, config, dependency or build artefact has changed since that documentation was written. The `src/pages/EpigeneticsPage.tsx` modification predates it (file mtime 2026-08-19) and is explicitly acknowledged in `10-befunde.md` §13 — so the newest documentation is **not** out of date with respect to this working tree; it is out of date only with respect to `main`, which advanced to `d0fdf29` on 2026-08-19 17:02.

---

## 10. Immediate Risks

Ordered by impact on relaunch planning.

### R1 — Uncommitted change is a broken partial replay of committed work · **HIGH**

`src/pages/EpigeneticsPage.tsx` carries the `<th>` half of `main`'s commit `e21a6e5` without the wrapper half, leaving `overflow-x-auto` on the container — precisely the arrangement `e21a6e5`'s message documents as failing (sticky header resolves against the scroll container, sits 58px too high, stays behind the chapter bar). Committing or building from this tree ships a defect that is already fixed upstream. **Evidence:** §4.2; [src/pages/EpigeneticsPage.tsx:401](src/pages/EpigeneticsPage.tsx#L401); `git show e21a6e5`.

### R2 — The best documentation in the repository is untracked and unbacked-up · **HIGH**

`projektverzeichnis/` (11 files, 1384 lines) exists only in this worktree's working directory. It is not committed, not on `origin`, and not in any other worktree. `git clean -fd`, `git worktree remove`, or a fresh clone destroys it. **Evidence:** `git status --porcelain` shows all 11 as `??`; §4.1.

### R3 — The documented baseline branch is behind the actual work line · **HIGH**

`feat/home-leadmagnet@961f65d` is missing four completed work packages (AP1–AP4) plus phone-number unification and event instrumentation, all of which are on `main@d0fdf29`. Planning against `961f65d` plans against a superseded state. **Evidence:** §3.3; `git merge-base --is-ancestor 961f65d d0fdf29` → NO; `git diff --stat d0fdf29 961f65d` → 312 files / +24 004 / −13 950.

### R4 — The baseline exists on exactly one machine · **HIGH**

`feat/home-leadmagnet` is not on `origin` (`git branch -r --list origin/feat/home-leadmagnet` → empty) and `git branch -a --contains 961f65d` names only that one branch. There is no remote copy of the baseline commit, and CI has never run against it (`ci.yml` triggers only on `main`).

### R5 — Active-looking legacy deployment configuration · **MEDIUM**

`nginx.conf` (static SPA + `/api/` proxy to `backend:5000`) and `vercel.json` (SPA rewrite) are unreferenced by any live deploy path yet sit in the repository root reading as authoritative; `Dockerfile.dev` and `scripts/prerender.mjs` are similarly orphaned. Compounding this, `_project-knowledge/deploy/` and `_project-knowledge/config/` hold _second copies_ of `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `vercel.json`, `package.json`, `vite.config.ts` and `tailwind.config.js`. **Evidence:** §7.6, §8.2.

### R6 — Documentation contradicting code · **MEDIUM**

`DOCS.md` describes an nginx-served SPA and a non-existent `backend/` Payload CMS; `_project-knowledge/AUDIT-REPORT.md` lists five criticals of which four are closed; `src/App.tsx`'s header falsely claims the consumer pages are noindex and Basic-Auth protected. **Evidence:** §9.1–§9.3.

### R7 — Generated `dist/` is out of sync with the working tree · **MEDIUM**

`dist/client/index.html` is dated 2026-08-18 12:41, one minute after HEAD (12:40) — so `dist/` **matches HEAD** but not the working tree: the `EpigeneticsPage.tsx` change (mtime 2026-08-19) is unbuilt, and none of `main`'s AP1–AP4 work is present. Since production mode serves from `dist/`, `preview.polarisdx.net` is showing the 2026-08-18 state. `dist/` is gitignored (`.gitignore:11`), so this is local build staleness, not repository corruption. **Evidence:** `stat dist/client/index.html`; [docs/deploy-preview.md](docs/deploy-preview.md); `projektverzeichnis/10-befunde.md` §13.

### R8 — Node version mismatch between workstation and every build target · **MEDIUM**

Local Node **v20.19.6** vs `node:22-alpine` in both Dockerfiles and `node-version: '22'` in CI. `package.json` declares no `engines` constraint, so nothing catches this. Locally green builds are not evidence of CI/container green builds. **Evidence:** §5.1.

### R9 — CSP is report-only and one API route is unrate-limited · **MEDIUM (security posture, pre-existing)**

[server.ts:428](server.ts#L428) sets `Content-Security-Policy-Report-Only` — deliberately, per its own comment, but it therefore protects nothing. `POST /api/consumer-order` is the only one of four form endpoints not behind `formLimiter`, on a publicly reachable ordering endpoint of a paid campaign page. **Evidence:** `projektverzeichnis/10-befunde.md` §5 and §6.

### R10 — Route ↔ `KNOWN_PATHS` maintenance trap · **MEDIUM**

A new `<Route>` in `src/App.tsx` without a matching entry in `SITEMAP_ROUTES` / `EXTRA_KNOWN_PATHS` in `server.ts` renders correctly in the browser but the server answers **HTTP 404**. The code comments note the mirroring (_"MIRRORS src/App.tsx"_) but nothing enforces it and no test covers it — a direct hazard for any relaunch that adds routes. **Evidence:** `projektverzeichnis/10-befunde.md` §12.

### R11 — Secrets hygiene: **clean, with one caveat** · **LOW**

- `git ls-files` matched against `\.env|secret|credential|\.pem|\.key|\.p12` returns **nothing**. No secret-bearing file is tracked.
- `server/.env` exists on disk and is correctly ignored: `git check-ignore -v server/.env` → `.gitignore:13:*.env`.
- `.gitignore` also blocks customer data: `*.xlsx`, `*.csv`, `kontakte.*`.
- **Caveat (configuration reference, no values):** `docker-compose.yml` wires the backend with `env_file: ./server/.env`, and `server/.env` holds more keys than `server/.env.example` documents. Key **names** present in `.env` but absent from `.env.example`: `SENDGRID_API_KEY`, `CONTACT_RECEIVER`, `SENDER_EMAIL`. Environment variable names referenced in code: `BACKEND_URL`, `CONTACT_RECEIVER`, `DRY_RUN`, `FRONTEND_URL`, `LISTEN_HOST`, `NODE_ENV`, `PORT`, `SENDER_EMAIL`, `SENDGRID_API_KEY`. **No values are recorded in this document.** The gap means a fresh environment provisioned from `.env.example` alone would start without mail credentials.

### R12 — Lockfile consistency: **clean** · **NONE**

`package.json` and `package-lock.json` (v3) last changed in the same commit `185bffe`. `npm ls --depth=0` reports no UNMET/invalid/missing; the only flags are two `extraneous` transitive `sharp` artefacts (`@emnapi/runtime`, `tslib`) that `npm ci` clears. `server/` has its own consistent lockfile.

### R13 — Merge/conflict artefacts: **none** · **NONE**

No `MERGE_HEAD`/`REBASE_*`/`CHERRY_PICK_HEAD`/`REVERT_HEAD`; no conflict markers in tracked sources; stash depth 0.

---

## 11. Recommended Baseline for Relaunch Work

**Recommended baseline commit: `main@d0fdf29cb1dbde78cc743b4d7a5077b79c6dafaf` (2026-08-19 17:02).**

Rationale, on the evidence above:

1. It is the **only** line containing the complete Epigenetik programme through AP4 — `feat/home-leadmagnet` stops four work packages short (§3.3).
2. It is the only relevant line that is **on `origin`** and therefore recoverable and CI-exercised; `ci.yml` triggers on `main` exclusively (§7.7).
3. It contains the correct, verified version of the sticky-header fix (`e21a6e5`) that the working tree here reproduces incompletely (§4.2).
4. `redesign/preview@5673b61` and `feat/contact-joyful@ab373a3` both predate the entire August programme (June 26 / July 3) and are 31 and 1 commits past a June common ancestor — neither is a candidate.

**If the planning constraint requires `feat/home-leadmagnet@961f65d` specifically** (e.g. because the untracked `projektverzeichnis/` documentation was surveyed against it), then record explicitly that the baseline is a **superseded snapshot**, that 108 of its 120 commits have no patch-equivalent on `main` (`git cherry`), and that reconciling it with `main` is a 312-file merge, not a fast-forward.

Preserving actions to take before any relaunch work begins (none performed by this analysis):

- **Commit or copy `projektverzeichnis/` out of the working tree.** It is the most accurate description of the site that exists and is currently one `git clean` from gone (R2).
- **Discard `src/pages/EpigeneticsPage.tsx`** rather than committing it — `main` already carries the complete fix (R1).
- Note that `main` cannot be checked out in this worktree; it is held by `/home/phillip/01polaris` (§2.1).
- Re-fetch before relying on remote-tracking refs: last fetch was **2026-08-19 14:36** (`stat .git/FETCH_HEAD`), earlier than `d0fdf29`'s commit timestamp.

---

## 12. Final Classification

## READY WITH WARNINGS

**Why not NOT READY.** The repository is structurally sound and every hard blocker is absent: no merge, rebase or cherry-pick in progress; no conflict markers in any tracked source; an empty stash; `package.json` and `package-lock.json` in sync from a single commit with no UNMET or invalid dependencies; no secret-bearing file tracked by git, with `server/.env` correctly ignored via `.gitignore:13` and customer-data patterns (`*.xlsx`, `*.csv`, `kontakte.*`) blocked; `dist/` gitignored and consistent with HEAD. All four commits named in the baseline request exist, are reachable, and match their branch tips exactly. A planning agent can take a defensible starting point from this repository today.

**Why not READY.** Four warnings must travel with the baseline:

1. **The working tree is dirty, and the dirt is harmful.** The one modified tracked file is a partial replay of `main@e21a6e5` that omits the wrapper change the original commit documents as mandatory — committing it ships a known defect (R1).
2. **The documented baseline is superseded.** `feat/home-leadmagnet@961f65d` is _not_ an ancestor of `main@d0fdf29`; the two diverged at `ae58074` on 2026-06-24 and now differ by 312 files. `main` holds four completed work packages the baseline lacks (R3).
3. **The baseline and the best documentation both exist in exactly one place.** `961f65d` is on no remote and on no other branch; `projektverzeichnis/` is untracked. Neither survives a clean checkout of this worktree (R2, R4).
4. **Several documents actively contradict the code.** `DOCS.md` describes an nginx-served SPA that was replaced by Express SSR; `_project-knowledge/AUDIT-REPORT.md` lists four already-closed criticals as open; `src/App.tsx`'s own header claims noindex and Basic Auth protections for `/consumer/*` that do not exist. Alongside them sit legacy-but-plausible config (`nginx.conf`, `vercel.json`, `Dockerfile.dev`, `scripts/prerender.mjs`) and a full duplicate config set under `_project-knowledge/` (R5, R6).

None of these prevents work from starting. All of them will mislead an agent that reads the repository's tracked documentation as authoritative. The correct posture is to treat **`projektverzeichnis/` (2026-08-20) and this document as the current description of the system**, and every root-level markdown file dated 2026-06-25 as historical.

---

_Produced by read-only inspection on 2026-08-21. No application code, configuration, dependency, branch, commit, running service or deployment state was modified. No environment-variable values or secrets are reproduced above._
