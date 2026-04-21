const fs = require('fs');
const path = require('path');

const localesDir = 'public/locales';
const languages = ['de', 'en', 'fr', 'it', 'pl', 'es', 'pt', 'cs', 'da', 'nl'];

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'services.json');
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('48')) {
        console.log(`\n--- ${lang} ---`);
        const lines = content.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('48')) {
                console.log(`Line ${index + 1}: ${line.trim()}`);
            }
        });
    }
  }
});
