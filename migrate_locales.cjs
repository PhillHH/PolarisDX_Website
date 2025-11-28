const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src', 'locales');
const publicLocalesDir = path.join(__dirname, 'public', 'locales');

const languages = ['de', 'en', 'pl', 'fr', 'it', 'es', 'pt', 'da', 'nl', 'cs'];

const newTranslations = {
  de: {
    cta_section: {
      title: "Sie suchen nach garantierter Performance und POC-Expertise?",
      text: "Sprechen Sie direkt mit unseren IglooPro-Spezialisten. Unser Team ist bereit, Ihre individuellen Workflow-Anforderungen zu analysieren und Ihnen den schnellsten Weg zur validierten Diagnostik zu zeigen. Bei uns erhalten Sie eine maßgeschneiderte Lösung, keine Standard-Lieferung.",
      button: "Jetzt Experten-Analyse buchen"
    },
    contact: {
      page: {
        eyebrow: "IHRE PERFORMANCE-ANALYSE",
        title: "IglooPro Performance-Analyse anfordern",
        breadcrumb: "Home / Kontakt"
      },
      info: {
        email_label: "EMAIL (24/7 Service)",
        phone_label: "PHONE (Priority-Line)"
      },
      form: {
        company_label: "Name des Unternehmens / der Praxis",
        company_placeholder: "z.B. Praxis Dr. Müller oder Löwen-Apotheke",
        name_label: "Name",
        name_placeholder: "Ihr vollständiger Name",
        email_label: "Email",
        email_placeholder: "sie@beispiel.de",
        area_label: "Primärer Einsatzbereich",
        area_options: {
          pharmacy: "Apotheke",
          doctor: "Arztpraxis/Klinik",
          vet: "Veterinärmedizin",
          lab: "Forschung/Labor",
          other: "Sonstiges"
        },
        requirements_label: "Ihre spezifischen Anforderungen an IglooPro",
        requirements_placeholder: "Welche Biomarker (z.B. CRP, TSH, HbA1c) sind für Sie primär relevant?",
        submit_button: "Performance-Analyse jetzt anfordern"
      }
    }
  },
  en: {
    cta_section: {
      title: "Looking for guaranteed performance and POC expertise?",
      text: "Speak directly with our IglooPro specialists. Our team is ready to analyze your individual workflow requirements and show you the fastest way to validated diagnostics. With us, you get a tailored solution, not a standard delivery.",
      button: "Book expert analysis now"
    },
    contact: {
      page: {
        eyebrow: "YOUR PERFORMANCE ANALYSIS",
        title: "Request IglooPro Performance Analysis",
        breadcrumb: "Home / Contact Us"
      },
      info: {
        email_label: "EMAIL (24/7 Service)",
        phone_label: "PHONE (Priority-Line)"
      },
      form: {
        company_label: "Company / Practice Name",
        company_placeholder: "e.g. Dr. Miller Practice or Lion Pharmacy",
        name_label: "Name",
        name_placeholder: "Your full name",
        email_label: "Email",
        email_placeholder: "you@example.com",
        area_label: "Primary Field of Application",
        area_options: {
            pharmacy: "Pharmacy",
            doctor: "Doctor's Office/Clinic",
            vet: "Veterinary Medicine",
            lab: "Research/Lab",
            other: "Other"
        },
        requirements_label: "Your Specific Requirements for IglooPro",
        requirements_placeholder: "Which biomarkers (e.g. CRP, TSH, HbA1c) are primarily relevant to you?",
        submit_button: "Request Performance Analysis Now"
      }
    }
  },
  pl: {
    cta_section: {
      title: "Szukasz gwarantowanej wydajności i ekspertyzy POC?",
      text: "Porozmawiaj bezpośrednio z naszymi specjalistami IglooPro. Nasz zespół jest gotowy przeanalizować Twoje indywidualne wymagania dotyczące przepływu pracy i wskazać najszybszą drogę do zwalidowanej diagnostyki. U nas otrzymasz rozwiązanie szyte na miarę, a nie standardową dostawę.",
      button: "Zamów analizę ekspercką teraz"
    },
    contact: {
      page: {
        eyebrow: "TWOJA ANALIZA WYDAJNOŚCI",
        title: "Poproś o analizę wydajności IglooPro",
        breadcrumb: "Strona główna / Kontakt"
      },
      info: {
        email_label: "E-MAIL (Serwis 24/7)",
        phone_label: "TELEFON (Linia priorytetowa)"
      },
      form: {
        company_label: "Nazwa firmy / praktyki",
        company_placeholder: "np. Gabinet Dr. Müllera lub Apteka Lwa",
        name_label: "Imię i nazwisko",
        name_placeholder: "Twoje imię i nazwisko",
        email_label: "E-mail",
        email_placeholder: "ty@przyklad.com",
        area_label: "Główny obszar zastosowania",
        area_options: {
            pharmacy: "Apteka",
            doctor: "Gabinet lekarski/Klinika",
            vet: "Medycyna weterynaryjna",
            lab: "Badania/Laboratorium",
            other: "Inne"
        },
        requirements_label: "Twoje specyficzne wymagania dotyczące IglooPro",
        requirements_placeholder: "Jakie biomarkery (np. CRP, TSH, HbA1c) są dla Ciebie najważniejsze?",
        submit_button: "Zamów analizę wydajności teraz"
      }
    }
  },
  fr: {
    cta_section: {
      title: "Vous recherchez une performance garantie et une expertise POC ?",
      text: "Parlez directement à nos spécialistes IglooPro. Notre équipe est prête à analyser vos besoins spécifiques en matière de flux de travail et à vous montrer la voie la plus rapide vers un diagnostic validé. Avec nous, vous obtenez une solution sur mesure, pas une livraison standard.",
      button: "Réserver une analyse d'expert maintenant"
    },
    contact: {
      page: {
        eyebrow: "VOTRE ANALYSE DE PERFORMANCE",
        title: "Demander une analyse de performance IglooPro",
        breadcrumb: "Accueil / Contact"
      },
      info: {
        email_label: "EMAIL (Service 24/7)",
        phone_label: "TÉLÉPHONE (Ligne prioritaire)"
      },
      form: {
        company_label: "Nom de l'entreprise / du cabinet",
        company_placeholder: "ex. Cabinet Dr. Martin ou Pharmacie Centrale",
        name_label: "Nom",
        name_placeholder: "Votre nom complet",
        email_label: "Email",
        email_placeholder: "vous@exemple.com",
        area_label: "Domaine d'application principal",
        area_options: {
            pharmacy: "Pharmacie",
            doctor: "Cabinet médical/Clinique",
            vet: "Médecine vétérinaire",
            lab: "Recherche/Laboratoire",
            other: "Autre"
        },
        requirements_label: "Vos exigences spécifiques pour IglooPro",
        requirements_placeholder: "Quels biomarqueurs (ex. CRP, TSH, HbA1c) sont principalement pertinents pour vous ?",
        submit_button: "Demander l'analyse de performance maintenant"
      }
    }
  },
  it: {
    cta_section: {
      title: "Cerchi prestazioni garantite ed esperienza POC?",
      text: "Parla direttamente con i nostri specialisti IglooPro. Il nostro team è pronto ad analizzare le tue esigenze specifiche di flusso di lavoro e a mostrarti la via più rapida per una diagnostica validata. Da noi ricevi una soluzione su misura, non una consegna standard.",
      button: "Prenota ora un'analisi esperta"
    },
    contact: {
      page: {
        eyebrow: "LA TUA ANALISI DELLE PRESTAZIONI",
        title: "Richiedi analisi delle prestazioni IglooPro",
        breadcrumb: "Home / Contatti"
      },
      info: {
        email_label: "EMAIL (Servizio 24/7)",
        phone_label: "TELEFONO (Linea prioritaria)"
      },
      form: {
        company_label: "Nome dell'azienda / studio",
        company_placeholder: "es. Studio Dr. Rossi o Farmacia Centrale",
        name_label: "Nome",
        name_placeholder: "Il tuo nome completo",
        email_label: "Email",
        email_placeholder: "tu@esempio.com",
        area_label: "Campo di applicazione primario",
        area_options: {
            pharmacy: "Farmacia",
            doctor: "Studio medico/Clinica",
            vet: "Medicina veterinaria",
            lab: "Ricerca/Laboratorio",
            other: "Altro"
        },
        requirements_label: "Le tue esigenze specifiche per IglooPro",
        requirements_placeholder: "Quali biomarcatori (es. CRP, TSH, HbA1c) sono principalmente rilevanti per te?",
        submit_button: "Richiedi ora l'analisi delle prestazioni"
      }
    }
  },
  es: {
    cta_section: {
      title: "¿Busca rendimiento garantizado y experiencia en POC?",
      text: "Hable directamente con nuestros especialistas en IglooPro. Nuestro equipo está listo para analizar sus requisitos de flujo de trabajo individuales y mostrarle el camino más rápido hacia un diagnóstico validado. Con nosotros obtendrá una solución a medida, no una entrega estándar.",
      button: "Reservar análisis de expertos ahora"
    },
    contact: {
      page: {
        eyebrow: "SU ANALISIS DE RENDIMIENTO",
        title: "Solicitar análisis de rendimiento IglooPro",
        breadcrumb: "Inicio / Contacto"
      },
      info: {
        email_label: "CORREO ELECTRÓNICO (Servicio 24/7)",
        phone_label: "TELÉFONO (Línea prioritaria)"
      },
      form: {
        company_label: "Nombre de la empresa / consulta",
        company_placeholder: "ej. Consulta Dr. Pérez o Farmacia Central",
        name_label: "Nombre",
        name_placeholder: "Su nombre completo",
        email_label: "Correo electrónico",
        email_placeholder: "usted@ejemplo.com",
        area_label: "Campo de aplicación principal",
        area_options: {
            pharmacy: "Farmacia",
            doctor: "Consulta médica/Clínica",
            vet: "Medicina veterinaria",
            lab: "Investigación/Laboratorio",
            other: "Otro"
        },
        requirements_label: "Sus requisitos específicos para IglooPro",
        requirements_placeholder: "¿Qué biomarcadores (ej. CRP, TSH, HbA1c) son principalmente relevantes para usted?",
        submit_button: "Solicitar análisis de rendimiento ahora"
      }
    }
  }
};

// Fallback to English for other languages
['pt', 'da', 'nl', 'cs'].forEach(lang => {
  newTranslations[lang] = newTranslations.en;
});

if (!fs.existsSync(publicLocalesDir)){
    fs.mkdirSync(publicLocalesDir, { recursive: true });
}

languages.forEach(lang => {
  const sourceFile = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(sourceFile)) {
    const content = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

    // 1. common.json
    const common = {
      nav: content.nav,
      footer: content.footer,
      badge: content.badge,
      // Merge new cta_section here
      cta_section: newTranslations[lang]?.cta_section || newTranslations.en.cta_section
    };

    // 2. contact.json
    // Merge existing contact keys with new ones
    const existingContact = content.contact || {};
    const newContact = newTranslations[lang]?.contact || newTranslations.en.contact;

    // We want to override/extend the existing structure.
    // The existing structure has `hero`, `form`, `info`, `bottom_cta`.
    // We are adding `page`, `form` (expanding it), `info` (expanding it).
    // Let's do a deep merge or just manually construct it to ensure we keep old keys if needed,
    // but user wanted a specific cleanup.
    // The user said: "Unten ist noch ein CTL-Section... Den wird er auch noch mal in die eben genannten Sprachen übersetzen. Dazu kommt auf Contact, das Kontaktformular..."
    // The existing 'contact' keys in translation.json seem to be for a DIFFERENT contact form (maybe a modal or previous version) because they have keys like 'specialty', 'doctor' which are not in the current ContactPage.tsx.
    // However, I should preserve them just in case they are used elsewhere (I grepped and didn't find them, but to be safe I'll keep them but prioritize my new structure).

    const contact = {
      ...existingContact,
      ...newContact,
      form: {
        ...existingContact.form,
        ...newContact.form
      },
      info: {
        ...existingContact.info,
        ...newContact.info
      }
    };

    // 3. shop.json
    const shop = {
      products: content.products,
      shop: content.shop,
      category: content.category
    };

    // 4. home.json
    const home = {
      hero: content.hero,
      about: content.about,
      doctors: content.doctors,
      services: content.services,
      testimonials: content.testimonials,
      articles: content.articles,
      blog: content.blog,
      // The `cta` key in original JSON (footer cta) -> keep in home or common?
      // It says "Suchen Sie professionelle...". This is used in the Footer usually or bottom of pages.
      // Let's check where `cta` is used.
      // If it's the one at the bottom of pages, maybe `common` is better.
      // But looking at keys, `cta` has `title`, `description`, `button`.
      // I'll put `cta` in `common` as well, assuming it's a shared component.
    };

    // Let's add the original `cta` key to common too if it exists
    if (content.cta) {
        common.cta = content.cta;
    }


    // Create lang dir
    const langDir = path.join(publicLocalesDir, lang);
    if (!fs.existsSync(langDir)){
        fs.mkdirSync(langDir, { recursive: true });
    }

    // Write files
    fs.writeFileSync(path.join(langDir, 'common.json'), JSON.stringify(common, null, 2));
    fs.writeFileSync(path.join(langDir, 'contact.json'), JSON.stringify(contact, null, 2));
    fs.writeFileSync(path.join(langDir, 'shop.json'), JSON.stringify(shop, null, 2));
    fs.writeFileSync(path.join(langDir, 'home.json'), JSON.stringify(home, null, 2));

    console.log(`Processed ${lang}`);
  } else {
    console.error(`Source file not found for ${lang}`);
  }
});
