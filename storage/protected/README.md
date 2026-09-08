# Geschützte Asset-Ablage (AP19 PT19.3)

Dieses Verzeichnis liegt **außerhalb von `public/`** und wird von keinem
Static-Handler ausgeliefert. Dateien hier sind ausschließlich über
`GET /api/content-download/asset/:assetId` mit gültigem Entitlement erreichbar.

**Layout:** identisch zur Registry — `epigenetics/de/xx.pdf` liegt hier unter
`storage/protected/epigenetics/de/xx.pdf`. Der Pfad kommt immer aus
`server/resource-registry.json`, **niemals** aus dem Request.

**Invariante:** eine Datei, die zu einem `GATED` Asset gehört, darf nicht
zusätzlich unter `public/downloads/` liegen — sonst wäre das Gate über die
vorhersagbare öffentliche URL umgehbar. `npm run check:content-download`
lässt den Build in diesem Fall scheitern.

Der Ablageort ist über `POLARIS_PROTECTED_ASSET_DIR` überschreibbar.

Heute (PT19.3) ist kein Asset `GATED`; die Auswahl der Lead-Magnet-Kandidaten
ist **PT19.4**.
