# Preview-Deploy / Restart (preview.polarisdx.net)

> **Ermittelter Ist-Zustand (read-only Analyse, Branch `feat/home-leadmagnet`).** Dieser Server ist die
> **Preview**, nicht Prod. Prod-`./deploy.sh` (Docker) hier **nicht** verwenden.

## Wie die Preview läuft
- **Kein** Docker, **kein** systemd, **kein** pm2/tmux. Der Preview-Server ist ein **detached
  Node-Prozess** (PPID 1), gestartet via `npx tsx server.ts`.
- Verzeichnis: `/home/phillip/01polaris-preview`
- Prozess: `node … tsx … server.ts`, **hört auf `127.0.0.1:9100`**. nginx `preview.polarisdx.net` → 9100.
- **Launch-Umgebung (aus `/proc/<pid>/environ` verifiziert):**
  `PORT=9100`, `NODE_ENV=production`, `BACKEND_URL=http://127.0.0.1:5001`
  (Node v20.19.6 via nvm; `npm_command=exec` / `npm_lifecycle_event=npx` → gestartet als `npx tsx server.ts`).
- **`server.ts` autoloaded KEIN `.env`** (kein dotenv-Import) → Env muss beim Start gesetzt werden.

## Wichtig: Production-Mode serviert aus `dist/`, NICHT aus der Quelle
`server.ts` (Z. 273–290, 468–478): bei `NODE_ENV=production` werden `dist/client/index.html` und
`dist/server/entry-server.js` geladen. **Änderungen an `src/` werden erst nach `npm run build` sichtbar.**
`dist/` ist **gitignored** (`.gitignore:11-12`). Beleg für das Muster: dist-Build `2026-07-03 12:56`,
Server-Start `2026-07-03 12:57:11` — also *build → start*.

## Restart-/Rebuild-Prozedur (nach `src/`-Änderungen)
```bash
cd /home/phillip/01polaris-preview

# 1) Build (regeneriert dist/client + dist/server aus src)
npm run build          # = vite build --outDir dist/client && vite build --ssr src/entry-server.tsx --outDir dist/server

# 2) Alten Preview-Prozess stoppen — NUR über den :9100-Listener.
#    NIEMALS `pkill -f 'tsx server.ts'`: matcht auch Container-Instanzen (/app/node_modules/... = 01polaris-frontend).
PID=$(ss -ltnpH 'sport = :9100' | grep -oP 'pid=\K[0-9]+' | head -1)
PGID=$(ps -o pgid= -p "$PID" | tr -d ' ')
kill -TERM -"$PGID" 2>/dev/null        # killt die ganze Gruppe (npm exec → sh → tsx → node)
sleep 1
ss -ltnH 'sport = :9100' | grep -q . && kill -KILL -"$PGID" 2>/dev/null   # Fallback

# 3) Neu starten, detached (überlebt SSH-Logout), gleiche Env, mit Logfile
PORT=9100 NODE_ENV=production BACKEND_URL=http://127.0.0.1:5001 \
  setsid bash -c 'cd /home/phillip/01polaris-preview && exec npx tsx server.ts' \
  > /home/phillip/01polaris-preview/preview.log 2>&1 &

# 4) Verifizieren
sleep 3
curl -sI http://127.0.0.1:9100/de/ | head -3         # erwartet: HTTP/1.1 200 OK
tail -n 20 /home/phillip/01polaris-preview/preview.log
```

### Hinweise
- **Downtime:** kurzes Fenster zwischen Kill und erneutem `listen` (~2–3 s). Für eine noindex-Preview ok.
- Über SSH `ssh phillip-server "bash -lc '<obige Schritte>'"` ausführen. `setsid` + `&` sorgt dafür, dass
  der Prozess nach SSH-Logout weiterläuft.
- Der Build braucht **kein** `tsc` vorab (Vite typecheckt nicht) — Typprüfung separat via `npx tsc -b --noEmit`.
- Backend-Proxy zeigt auf `127.0.0.1:5001` (Preview-Backend). Kontaktformular-POSTs `/api/*` gehen dorthin.
- **Validierungsstatus:** Mechanismus aus Prozess-Env + `server.ts` hergeleitet (read-only). Erste echte
  Ausführung erfolgt im Screenshot-Schritt von Slice 1.
```
