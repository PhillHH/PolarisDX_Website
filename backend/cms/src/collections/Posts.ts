// src/collections/Posts.ts

import { CollectionConfig } from 'payload/types';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

const Posts: CollectionConfig = {
  // Der Slug definiert den API-Endpunkt (z.B. /api/posts)
  slug: 'posts',
  admin: {
    // Standardmäßig den Titel für die Übersicht verwenden
    useAsTitle: 'title', 
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    // Macht die Daten für das Frontend öffentlich lesbar (wichtig für die API)
    read: () => true, 
  },
  fields: [
    {
      name: 'title',
      label: 'Titel des Beitrags',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'URL Slug',
      type: 'text',
      // Der Slug sollte automatisch vom Titel generiert werden
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value;
            // Generiert den Slug aus dem Titel
            if (data?.title) {
              return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            }
            return value;
          },
        ],
      },
    },
    {
      name: 'content',
      label: 'Inhalt des Beitrags',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        // Standard-Features wie Bold, Italic, Listen, Links sind enthalten.
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // Hier könnten Sie bei Bedarf weitere Features oder Blöcke hinzufügen
        ],
      }),
    },
  ],
};

export default Posts;