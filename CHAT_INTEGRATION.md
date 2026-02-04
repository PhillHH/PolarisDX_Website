# Chat-Integration & Microsoft Teams Roadmap

Dieses Dokument beschreibt die aktuelle Implementierung des Chat-Widgets und die Schritte zur Integration mit Microsoft Teams (Bot Framework).

## 1. Aktueller Stand (Prototyp)

Der Chat ist aktuell ein "Mock-Prototyp" mit folgenden Eigenschaften:
- **Frontend (`src/components/ui/ChatWidget.tsx`):**
  - **Desktop:** Öffnet sich automatisch beim Laden der Seite (Breite > 1024px).
  - **Mobile:** Startet geschlossen, kann per Button geöffnet werden.
  - **Nachricht:** Zeigt beim Öffnen sofort eine automatische Nachricht ("...wird in den nächsten Tagen aktiviert...").
  - **API:** Sendet Nachrichten an `/api/chat`, erhält aber aktuell nur Mock-Antworten zurück.
- **Backend (`server/server.js`):**
  - Endpoint `/api/chat` empfängt Nachrichten.
  - Simuliert eine Verzögerung und antwortet mit einfachen Strings ("Hallo", "Termin", etc.) oder einer Standardantwort.

## 2. Integration von Microsoft Teams (Zukunft)

Um den Chatbot mit Microsoft Teams zu verbinden (sodass Nachrichten in Teams ankommen oder ein Bot aus Teams antwortet), wird das **Microsoft Bot Framework** benötigt.

### Phase 1: Azure Bot Service einrichten
1.  **Azure Portal:** Erstellen Sie eine Ressource "Azure Bot".
2.  **Konfiguration:**
    -   Typ: Multi-Tenant oder Single-Tenant (je nach firmeninterner Struktur).
    -   App ID & Client Secret generieren und speichern.
3.  **Kanäle (Channels):**
    -   Aktivieren Sie den Kanal **"Microsoft Teams"**, damit der Bot in Teams agieren kann.
    -   Aktivieren Sie den Kanal **"Direct Line"**, um den Web-Chat auf der Website anzubinden.

### Phase 2: Backend Anpassung (`server/server.js`)
Der Node.js Server muss zum "Bot Adapter" werden.

1.  **Pakete installieren:**
    ```bash
    npm install botbuilder botframework-connector restify
    ```
2.  **Adapter Code (Beispiel):**
    ```javascript
    const { CloudAdapter, ConfigurationBotFrameworkAuthentication } = require('botbuilder');

    const botFrameworkAuthentication = new ConfigurationBotFrameworkAuthentication(process.env);
    const adapter = new CloudAdapter(botFrameworkAuthentication);

    const myBot = new MyEchoBot(); // Ihre Bot-Logik Klasse

    app.post('/api/messages', async (req, res) => {
        await adapter.process(req, res, (context) => myBot.run(context));
    });
    ```
3.  **Environment Variablen:**
    -   `MicrosoftAppId`, `MicrosoftAppPassword`, `MicrosoftAppTenantId` in `.env` hinzufügen.

### Phase 3: Frontend Anpassung (Web Client)
Es gibt zwei Wege, den Chat auf der Website anzuzeigen:

**Option A: Microsoft Web Chat (Einfach)**
Verwenden Sie das fertige React-Paket von Microsoft. Es unterstützt alle "Rich Cards" (Bilder, Buttons) von Teams nativ.
```bash
npm install botframework-webchat
```

**Option B: Custom Widget (Aktuell)**
Wenn Sie das aktuelle Design (`ChatWidget.tsx`) behalten wollen, müssen Sie die "Direct Line API" nutzen.
1.  Der Server muss einen Token via Direct Line Secret generieren (`/api/directline/token`).
2.  Das Frontend verbindet sich per WebSocket oder Polling mit diesem Token.
3.  Nachrichten werden als `Activity` Objekte gesendet und empfangen.

## 3. Umschalten auf Live-Betrieb

Sobald das Backend fertig ist:
1.  In `ChatWidget.tsx`: Entfernen Sie die feste "Prototyp"-Nachricht im `useEffect`.
2.  In `server/server.js`: Ersetzen Sie den Mock-Endpoint `/api/chat` durch den Bot-Adapter `/api/messages`.
3.  Aktualisieren Sie die Texte in `common.json` (entfernen Sie den Hinweis auf "Prototyp").
