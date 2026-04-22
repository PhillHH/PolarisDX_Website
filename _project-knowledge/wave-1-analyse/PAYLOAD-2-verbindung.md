# PAYLOAD-2 — Frontend-Verbindung & Funktionsstand

## Frontend referenziert Backend?

Keine Treffer auf `payload`, `/api/cms`, `PAYLOAD` oder `localhost:3001` in `src/` oder `server.ts`.
Einzige Backend-Referenz in `server.ts`:

```
28:  const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'
281:     target: BACKEND_URL,
```

→ zielt auf den Mail-Service (`server/server.js`, Port 5000), **nicht** auf das Payload-CMS.

Root-Ebene (`docker-compose.yml`, `vercel.json`, `.env*`): keine Referenz auf Payload/CMS. Treffer ausschließlich innerhalb `backend/`.

## Collections vorhanden

- `backend/cms/src/collections/Users.ts`
- `backend/cms/src/collections/Media.ts`
- `backend/cms/src/collections/Posts.ts`

## Collection-Inhalt (erste 40 Zeilen)

```ts
// Users.ts
export const Users: CollectionConfig = {
  slug: 'users',
  admin: { useAsTitle: 'email' },
  auth: true,
  fields: [],
}

// Media.ts
export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text', required: true }],
  upload: true,
}

// Posts.ts (gekürzt)
const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', defaultColumns: ['title','slug','updatedAt'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug',  type: 'text', admin: { position: 'sidebar' }, hooks: { beforeValidate: [...] } },
    { name: 'content', type: 'richText', required: true, editor: lexicalEditor({...}) },
  ],
}
```

Import in `Posts.ts`: `from 'payload/types'` — in Payload 3.x nicht mehr existent (korrekt wäre `from 'payload'`). → Type-Import würde beim Start fehlschlagen.

## .env.example Variablen

```
DATABASE_URI=mongodb://127.0.0.1/your-database-name
PAYLOAD_SECRET=YOUR_SECRET_HERE
```

Widerspruch: `payload.config.ts` nutzt `sqliteAdapter`, `.env.example` dokumentiert aber `mongodb://`.

## Funktionsstand in einem Satz

Payload-3-Scaffold mit drei Collections (Users, Media, Posts), SQLite-Adapter und fehlerhaftem Posts-Import — nicht ans Frontend angebunden, kein Fetching-Layer in `src/`, keine Env-Variablen im Root-Deployment.
