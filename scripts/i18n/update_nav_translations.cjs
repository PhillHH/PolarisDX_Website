const fs = require('fs');
const path = require('path');

const localesDir = 'public/locales';
const languages = ['de', 'en', 'fr', 'it', 'pl', 'es', 'pt', 'cs', 'da', 'nl'];

const translations = {
  de: { events: 'Termine' },
  en: { events: 'Events' },
  fr: { events: 'Événements' },
  it: { events: 'Eventi' },
  pl: { events: 'Wydarzenia' },
  es: { events: 'Eventos' },
  pt: { events: 'Eventos' },
  cs: { events: 'Události' },
  da: { events: 'Begivenheder' },
  nl: { events: 'Evenementen' }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'common.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!content.nav) content.nav = {};

      content.nav.events = translations[lang].events;

      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`Updated ${lang}/common.json`);
    } catch (e) {
      console.error(`Error processing ${lang}:`, e);
    }
  }
});
