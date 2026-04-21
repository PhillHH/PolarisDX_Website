const fs = require('fs');
const path = require('path');

const localesDir = 'public/locales';
const languages = ['de', 'en', 'fr', 'it', 'pl', 'es', 'pt', 'cs', 'da', 'nl'];

const translations = {
    de: { term: "3-5 Werktage", replacement: "3-5 Werktage" },
    en: { term: "3-5 business days", replacement: "3-5 business day" }, // for '48-hour' -> '3-5 business day'
    fr: { term: "3-5 jours ouvrés", replacement: "3-5 jours ouvrés" },
    it: { term: "3-5 giorni lavorativi", replacement: "3-5 giorni lavorativi" },
    pl: { term: "3-5 dni roboczych", replacement: "3-5 dni roboczych" },
    es: { term: "3-5 días hábiles", replacement: "3-5 días hábiles" },
    pt: { term: "3-5 dias úteis", replacement: "3-5 dias úteis" },
    cs: { term: "3-5 pracovní dny", replacement: "3-5 pracovních dnů" },
    da: { term: "3-5 arbejdsdage", replacement: "3-5 arbejdsdage" },
    nl: { term: "3-5 werkdagen", replacement: "3-5 werkdagen" }
};

// Map specifically for the service sentences replacements to avoid grammar issues where possible
// Simple replace strategy:
// de: "48-Stunden-" -> "3-5 Werktage ", "48-Stunden" -> "3-5 Werktage"
// en: "48-hour" -> "3-5 business day"
// fr: "48 heures" -> "3-5 jours ouvrés"
// it: "48 ore" -> "3-5 giorni lavorativi"
// pl: "48-godzinnej" -> "3-5 dni roboczych"
// es: "48 horas" -> "3-5 días hábiles"
// pt: "48 horas" -> "3-5 dias úteis"
// cs: "48hodinového" -> "3-5 pracovních dnů"
// da: "48-timers" -> "3-5 arbejdsdage"
// nl: "48-uurs" -> "3-5 werkdagen"

const replacements = {
    de: [
        { search: "48h", replace: "3-5 Werktage" },
        { search: "48-Stunden-Remote-Setup-Service", replace: "Remote-Setup-Service innerhalb von 3-5 Werktagen" },
        { search: "48-Stunden-Inbetriebnahme", replace: "Inbetriebnahme innerhalb von 3-5 Werktagen" }
    ],
    en: [
        { search: "48h", replace: "3-5 business days" },
        { search: "48-hour remote setup service", replace: "remote setup service within 3-5 business days" },
        { search: "48-hour commissioning", replace: "commissioning within 3-5 business days" }
    ],
    fr: [
        { search: "48h", replace: "3-5 jours ouvrés" },
        { search: "configuration à distance en 48 heures", replace: "configuration à distance en 3-5 jours ouvrés" },
        { search: "mise en service en 48 heures", replace: "mise en service en 3-5 jours ouvrés" }
    ],
    it: [
        { search: "48h", replace: "3-5 giorni lavorativi" },
        { search: "configurazione remota in 48 ore", replace: "configurazione remota in 3-5 giorni lavorativi" },
        { search: "messa in servizio in 48 ore", replace: "messa in servizio in 3-5 giorni lavorativi" }
    ],
    pl: [
        { search: "48h", replace: "3-5 dni roboczych" },
        { search: "48-godzinnej zdalnej konfiguracji", replace: "zdalnej konfiguracji w 3-5 dni roboczych" },
        { search: "48-godzinnego uruchomienia", replace: "uruchomienia w 3-5 dni roboczych" }
    ],
    es: [
        { search: "48h", replace: "3-5 días hábiles" },
        { search: "configuración remota de 48 horas", replace: "configuración remota en 3-5 días hábiles" },
        { search: "puesta en marcha en 48 horas", replace: "puesta en marcha en 3-5 días hábiles" }
    ],
    pt: [
        { search: "48h", replace: "3-5 dias úteis" },
        { search: "configuração remota de 48 horas", replace: "configuração remota em 3-5 dias úteis" },
        { search: "comissionamento em 48 horas", replace: "comissionamento em 3-5 dias úteis" }
    ],
    cs: [
        { search: "48h", replace: "3-5 pracovní dny" },
        { search: "48hodinového servisu", replace: "servisu do 3-5 pracovních dnů" },
        { search: "48hodinového uvedení", replace: "uvedení do provozu do 3-5 pracovních dnů" }
    ],
    da: [
        { search: "48h", replace: "3-5 arbejdsdage" },
        { search: "48-timers remote setup service", replace: "remote setup service inden for 3-5 arbejdsdage" },
        { search: "48-timers idriftsættelse", replace: "idriftsættelse inden for 3-5 arbejdsdage" }
    ],
    nl: [
        { search: "48h", replace: "3-5 werkdagen" },
        { search: "48-uurs remote setup service", replace: "remote setup service binnen 3-5 werkdagen" },
        { search: "48-uurs inbedrijfstelling", replace: "inbedrijfstelling binnen 3-5 werkdagen" }
    ]
};

function processFile(filePath, lang) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Specific replacements for this language
    const langReplacements = replacements[lang] || [];

    // Also add generic fallback replacement for the simple '48h' value if it appears in quotes strictly as "48h"
    // But since we are editing JSON, we can parse it.

    try {
        const json = JSON.parse(content);

        // Recursive function to walk the JSON tree
        function walk(obj) {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    // Check for exact match "48h"
                    if (obj[key] === '48h') {
                        obj[key] = translations[lang].term;
                        modified = true;
                    } else {
                        // Check for substrings based on replacements list
                        langReplacements.forEach(rep => {
                            if (obj[key].includes(rep.search)) {
                                obj[key] = obj[key].replace(rep.search, rep.replace);
                                modified = true;
                            }
                        });
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    walk(obj[key]);
                }
            }
        }

        walk(json);

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
            console.log(`Updated ${filePath}`);
        }
    } catch (e) {
        console.error(`Error parsing ${filePath}:`, e);
    }
}

languages.forEach(lang => {
    processFile(path.join(localesDir, lang, 'home.json'), lang);
    processFile(path.join(localesDir, lang, 'services.json'), lang);
});
