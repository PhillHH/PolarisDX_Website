import json
import os

languages = ['cs', 'da', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt']

# German is source
source_de = {
  "nav": {
    "home": "Home",
    "about": "Über uns",
    "service": "Service",
    "shop": "Shop",
    "blog": "Blog",
    "contact": "Kontakt"
  },
  "badge": {
    "New": "Neu",
    "Popular": "Beliebt",
    "Limited": "Limitiert"
  },
  "category": {
    "Diagnostics": "Diagnostik",
    "Monitoring": "Überwachung",
    "Home Care": "Heimpflege",
    "Chronic Care": "Chronische Pflege",
    "Protection": "Schutz",
    "Hygiene": "Hygiene",
    "Recovery": "Genesung",
    "Emergency": "Notfall",
    "Service": "Service"
  },
  "footer": {
    "description": "Umfassende Betreuung und Fürsorge. Moderne Gesundheitsdienste für Sie und Ihre Familie, rund um die Uhr.",
    "links": "Links",
    "discover": "Entdecken",
    "london": "London",
    "hamburg": "Hamburg",
    "copyright": "Copyright ©PolarisDX 2025 Alle Rechte vorbehalten.",
    "imprint": "Impressum",
    "privacy": "Datenschutzerklärung",
    "doctors": "Unsere Ärzte",
    "testimonials": "Referenzen",
    "faq": "FAQ",
    "appointment": "Termin vereinbaren"
  },
  "cta": {
    "title": "Suchen Sie professionelle & vertrauenswürdige <1>medizinische Versorgung?</1>",
    "description": "Zögern Sie nicht, uns zu kontaktieren. Unser Team ist bereit, Sie zu unterstützen und den richtigen Termin zu planen.",
    "button": "Termin vereinbaren"
  },
  "cta_section": {
    "title": "Sie suchen nach garantierter Performance und POC-Expertise?",
    "text": "Sprechen Sie direkt mit unseren IglooPro-Spezialisten. Unser Team ist bereit, Ihre individuellen Workflow-Anforderungen zu analysieren und Ihnen den schnellsten Weg zur validierten Diagnostik zu zeigen. Bei uns erhalten Sie eine maßgeschneiderte Lösung, keine Standard-Lieferung.",
    "button": "Jetzt Experten-Analyse buchen"
  }
}

translations = {
    "en": {
        "nav": {"home": "Home", "about": "About Us", "service": "Service", "shop": "Shop", "blog": "Blog", "contact": "Contact"},
        "badge": {"New": "New", "Popular": "Popular", "Limited": "Limited"},
        "category": {"Diagnostics": "Diagnostics", "Monitoring": "Monitoring", "Home Care": "Home Care", "Chronic Care": "Chronic Care", "Protection": "Protection", "Hygiene": "Hygiene", "Recovery": "Recovery", "Emergency": "Emergency", "Service": "Service"},
        "footer": {
            "description": "Comprehensive care and support. Modern health services for you and your family, around the clock.",
            "links": "Links", "discover": "Discover", "london": "London", "hamburg": "Hamburg",
            "copyright": "Copyright ©PolarisDX 2025 All Rights Reserved.",
            "imprint": "Imprint", "privacy": "Privacy Policy",
            "doctors": "Our Doctors", "testimonials": "Testimonials", "faq": "FAQ", "appointment": "Book Appointment"
        },
        "cta": {
            "title": "Looking for professional & trusted <1>medical care?</1>",
            "description": "Don't hesitate to contact us. Our team is ready to support you and schedule the right appointment.",
            "button": "Book Appointment"
        },
        "cta_section": {
            "title": "Looking for guaranteed performance and POC expertise?",
            "text": "Speak directly with our IglooPro specialists. Our team is ready to analyze your individual workflow requirements and show you the fastest way to validated diagnostics. With us, you get a tailored solution, not a standard delivery.",
            "button": "Book Expert Analysis Now"
        }
    },
    "fr": {
        "nav": {"home": "Accueil", "about": "À propos", "service": "Service", "shop": "Boutique", "blog": "Blog", "contact": "Contact"},
        "badge": {"New": "Nouveau", "Popular": "Populaire", "Limited": "Limité"},
        "category": {"Diagnostics": "Diagnostics", "Monitoring": "Surveillance", "Home Care": "Soins à domicile", "Chronic Care": "Soins chroniques", "Protection": "Protection", "Hygiene": "Hygiène", "Recovery": "Récupération", "Emergency": "Urgence", "Service": "Service"},
        "footer": {
            "description": "Soins complets et soutien. Des services de santé modernes pour vous et votre famille, 24h/24.",
            "links": "Liens", "discover": "Découvrir", "london": "Londres", "hamburg": "Hambourg",
            "copyright": "Copyright ©PolarisDX 2025 Tous droits réservés.",
            "imprint": "Mentions légales", "privacy": "Politique de confidentialité",
            "doctors": "Nos médecins", "testimonials": "Témoignages", "faq": "FAQ", "appointment": "Prendre rendez-vous"
        },
        "cta": {
            "title": "Vous cherchez des soins médicaux <1>professionnels et de confiance ?</1>",
            "description": "N'hésitez pas à nous contacter. Notre équipe est prête à vous soutenir et à planifier le bon rendez-vous.",
            "button": "Prendre rendez-vous"
        },
        "cta_section": {
            "title": "Vous recherchez une performance garantie et une expertise POC ?",
            "text": "Parlez directement avec nos spécialistes IglooPro. Notre équipe est prête à analyser vos exigences de flux de travail individuelles et à vous montrer le chemin le plus rapide vers des diagnostics validés. Avec nous, vous obtenez une solution sur mesure, pas une livraison standard.",
            "button": "Réserver une analyse d'expert maintenant"
        }
    },
    "es": {
        "nav": {"home": "Inicio", "about": "Sobre nosotros", "service": "Servicio", "shop": "Tienda", "blog": "Blog", "contact": "Contacto"},
        "badge": {"New": "Nuevo", "Popular": "Popular", "Limited": "Limitado"},
        "category": {"Diagnostics": "Diagnóstico", "Monitoring": "Monitoreo", "Home Care": "Cuidado en el hogar", "Chronic Care": "Cuidado crónico", "Protection": "Protección", "Hygiene": "Higiene", "Recovery": "Recuperación", "Emergency": "Emergencia", "Service": "Servicio"},
        "footer": {
            "description": "Atención integral y apoyo. Servicios de salud modernos para usted y su familia, las 24 horas.",
            "links": "Enlaces", "discover": "Descubrir", "london": "Londres", "hamburg": "Hamburgo",
            "copyright": "Copyright ©PolarisDX 2025 Todos los derechos reservados.",
            "imprint": "Aviso legal", "privacy": "Política de privacidad",
            "doctors": "Nuestros médicos", "testimonials": "Testimonios", "faq": "FAQ", "appointment": "Reservar cita"
        },
        "cta": {
            "title": "¿Busca atención médica <1>profesional y de confianza?</1>",
            "description": "No dude en contactarnos. Nuestro equipo está listo para apoyarlo y programar la cita adecuada.",
            "button": "Reservar cita"
        },
        "cta_section": {
            "title": "¿Busca rendimiento garantizado y experiencia en POC?",
            "text": "Hable directamente con nuestros especialistas en IglooPro. Nuestro equipo está listo para analizar sus requisitos de flujo de trabajo individuales y mostrarle el camino más rápido hacia diagnósticos validados. Con nosotros, obtiene una solución a medida, no una entrega estándar.",
            "button": "Reservar análisis de expertos ahora"
        }
    },
    "it": {
        "nav": {"home": "Home", "about": "Chi siamo", "service": "Servizi", "shop": "Negozio", "blog": "Blog", "contact": "Contatti"},
        "badge": {"New": "Nuovo", "Popular": "Popolare", "Limited": "Limitato"},
        "category": {"Diagnostics": "Diagnostica", "Monitoring": "Monitoraggio", "Home Care": "Assistenza domiciliare", "Chronic Care": "Cure croniche", "Protection": "Protezione", "Hygiene": "Igiene", "Recovery": "Recupero", "Emergency": "Emergenza", "Service": "Servizio"},
        "footer": {
            "description": "Assistenza completa e supporto. Servizi sanitari moderni per te e la tua famiglia, 24 ore su 24.",
            "links": "Link", "discover": "Scopri", "london": "Londra", "hamburg": "Amburgo",
            "copyright": "Copyright ©PolarisDX 2025 Tutti i diritti riservati.",
            "imprint": "Note legali", "privacy": "Informativa sulla privacy",
            "doctors": "I nostri medici", "testimonials": "Testimonianze", "faq": "FAQ", "appointment": "Prenota appuntamento"
        },
        "cta": {
            "title": "Cerchi cure mediche <1>professionali e affidabili?</1>",
            "description": "Non esitare a contattarci. Il nostro team è pronto a supportarti e pianificare l'appuntamento giusto.",
            "button": "Prenota appuntamento"
        },
        "cta_section": {
            "title": "Cerchi prestazioni garantite ed esperienza POC?",
            "text": "Parla direttamente con i nostri specialisti IglooPro. Il nostro team è pronto ad analizzare le tue esigenze di flusso di lavoro individuali e mostrarti la via più rapida per una diagnostica validata. Con noi, ottieni una soluzione su misura, non una consegna standard.",
            "button": "Prenota ora un'analisi esperta"
        }
    },
    "pl": {
        "nav": {"home": "Strona główna", "about": "O nas", "service": "Usługi", "shop": "Sklep", "blog": "Blog", "contact": "Kontakt"},
        "badge": {"New": "Nowość", "Popular": "Popularne", "Limited": "Limitowane"},
        "category": {"Diagnostics": "Diagnostyka", "Monitoring": "Monitoring", "Home Care": "Opieka domowa", "Chronic Care": "Opieka przewlekła", "Protection": "Ochrona", "Hygiene": "Higiena", "Recovery": "Regeneracja", "Emergency": "Nagłe wypadki", "Service": "Usługa"},
        "footer": {
            "description": "Kompleksowa opieka i wsparcie. Nowoczesne usługi zdrowotne dla Ciebie i Twojej rodziny, przez całą dobę.",
            "links": "Linki", "discover": "Odkryj", "london": "Londyn", "hamburg": "Hamburg",
            "copyright": "Copyright ©PolarisDX 2025 Wszelkie prawa zastrzeżone.",
            "imprint": "Nota prawna", "privacy": "Polityka prywatności",
            "doctors": "Nasi lekarze", "testimonials": "Opinie", "faq": "FAQ", "appointment": "Umów wizytę"
        },
        "cta": {
            "title": "Szukasz profesjonalnej i zaufanej <1>opieki medycznej?</1>",
            "description": "Nie wahaj się z nami skontaktować. Nasz zespół jest gotowy, aby Cię wesprzeć i zaplanować odpowiednią wizytę.",
            "button": "Umów wizytę"
        },
        "cta_section": {
            "title": "Szukasz gwarantowanej wydajności i ekspertyzy POC?",
            "text": "Porozmawiaj bezpośrednio z naszymi specjalistami IglooPro. Nasz zespół jest gotowy przeanalizować Twoje indywidualne wymagania dotyczące przepływu pracy i pokazać najszybszą drogę do sprawdzonej diagnostyki. U nas otrzymujesz rozwiązanie szyte na miarę, a nie standardową dostawę.",
            "button": "Zamów analizę ekspercką teraz"
        }
    },
    "nl": {
        "nav": {"home": "Home", "about": "Over ons", "service": "Diensten", "shop": "Winkel", "blog": "Blog", "contact": "Contact"},
        "badge": {"New": "Nieuw", "Popular": "Populair", "Limited": "Beperkt"},
        "category": {"Diagnostics": "Diagnostiek", "Monitoring": "Monitoring", "Home Care": "Thuiszorg", "Chronic Care": "Chronische zorg", "Protection": "Bescherming", "Hygiene": "Hygiëne", "Recovery": "Herstel", "Emergency": "Noodgeval", "Service": "Dienst"},
        "footer": {
            "description": "Uitgebreide zorg en ondersteuning. Moderne gezondheidsdiensten voor jou en je familie, 24 uur per dag.",
            "links": "Links", "discover": "Ontdekken", "london": "Londen", "hamburg": "Hamburg",
            "copyright": "Copyright ©PolarisDX 2025 Alle rechten voorbehouden.",
            "imprint": "Colofon", "privacy": "Privacybeleid",
            "doctors": "Onze artsen", "testimonials": "Getuigenissen", "faq": "FAQ", "appointment": "Afspraak maken"
        },
        "cta": {
            "title": "Op zoek naar professionele & vertrouwde <1>medische zorg?</1>",
            "description": "Aarzel niet om contact met ons op te nemen. Ons team staat klaar om je te ondersteunen en de juiste afspraak te plannen.",
            "button": "Afspraak maken"
        },
        "cta_section": {
            "title": "Op zoek naar gegarandeerde prestaties en POC-expertise?",
            "text": "Spreek direct met onze IglooPro-specialisten. Ons team staat klaar om jouw individuele workflow-eisen te analyseren en je de snelste weg naar gevalideerde diagnostiek te tonen. Bij ons krijg je een oplossing op maat, geen standaard levering.",
            "button": "Boek nu een expertanalyse"
        }
    },
    "da": {
        "nav": {"home": "Hjem", "about": "Om os", "service": "Service", "shop": "Shop", "blog": "Blog", "contact": "Kontakt"},
        "badge": {"New": "Ny", "Popular": "Populær", "Limited": "Begrænset"},
        "category": {"Diagnostics": "Diagnostik", "Monitoring": "Overvågning", "Home Care": "Hjemmepleje", "Chronic Care": "Kronisk pleje", "Protection": "Beskyttelse", "Hygiene": "Hygiejne", "Recovery": "Restitution", "Emergency": "Nødsituation", "Service": "Service"},
        "footer": {
            "description": "Omfattende pleje og støtte. Moderne sundhedstjenester til dig og din familie, døgnet rundt.",
            "links": "Links", "discover": "Opdag", "london": "London", "hamburg": "Hamborg",
            "copyright": "Copyright ©PolarisDX 2025 Alle rettigheder forbeholdes.",
            "imprint": "Impressum", "privacy": "Privatlivspolitik",
            "doctors": "Vores læger", "testimonials": "Udtalelser", "faq": "FAQ", "appointment": "Bestil tid"
        },
        "cta": {
            "title": "Leder du efter professionel & betroet <1>lægehjælp?</1>",
            "description": "Tøv ikke med at kontakte os. Vores team står klar til at støtte dig og planlægge den rette aftale.",
            "button": "Bestil tid"
        },
        "cta_section": {
            "title": "Leder du efter garanteret ydeevne og POC-ekspertise?",
            "text": "Tal direkte med vores IglooPro-specialister. Vores team er klar til at analysere dine individuelle workflow-krav og vise dig den hurtigste vej til valideret diagnostik. Hos os får du en skræddersyet løsning, ikke en standardlevering.",
            "button": "Bestil ekspertanalyse nu"
        }
    },
    "cs": {
        "nav": {"home": "Domů", "about": "O nás", "service": "Služby", "shop": "Obchod", "blog": "Blog", "contact": "Kontakt"},
        "badge": {"New": "Nové", "Popular": "Populární", "Limited": "Omezené"},
        "category": {"Diagnostics": "Diagnostika", "Monitoring": "Monitorování", "Home Care": "Domácí péče", "Chronic Care": "Chronická péče", "Protection": "Ochrana", "Hygiene": "Hygiena", "Recovery": "Zotavení", "Emergency": "Pohotovost", "Service": "Služba"},
        "footer": {
            "description": "Komplexní péče a podpora. Moderní zdravotní služby pro vás a vaši rodinu, nepřetržitě.",
            "links": "Odkazy", "discover": "Objevte", "london": "Londýn", "hamburg": "Hamburk",
            "copyright": "Copyright ©PolarisDX 2025 Všechna práva vyhrazena.",
            "imprint": "Tiráž", "privacy": "Ochrana osobních údajů",
            "doctors": "Naši lékaři", "testimonials": "Reference", "faq": "FAQ", "appointment": "Rezervovat termín"
        },
        "cta": {
            "title": "Hledáte profesionální a důvěryhodnou <1>lékařskou péči?</1>",
            "description": "Neváhejte nás kontaktovat. Náš tým je připraven vás podpořit a naplánovat správný termín.",
            "button": "Rezervovat termín"
        },
        "cta_section": {
            "title": "Hledáte zaručený výkon a odbornost POC?",
            "text": "Mluvte přímo s našimi specialisty na IglooPro. Náš tým je připraven analyzovat vaše individuální požadavky na pracovní tok a ukázat vám nejrychlejší cestu k ověřené diagnostice. U nás získáte řešení na míru, ne standardní dodávku.",
            "button": "Objednat expertní analýzu nyní"
        }
    },
    "pt": {
        "nav": {"home": "Início", "about": "Sobre nós", "service": "Serviço", "shop": "Loja", "blog": "Blog", "contact": "Contato"},
        "badge": {"New": "Novo", "Popular": "Popular", "Limited": "Limitado"},
        "category": {"Diagnostics": "Diagnóstico", "Monitoring": "Monitoramento", "Home Care": "Cuidados domiciliares", "Chronic Care": "Cuidados crônicos", "Protection": "Proteção", "Hygiene": "Higiene", "Recovery": "Recuperação", "Emergency": "Emergência", "Service": "Serviço"},
        "footer": {
            "description": "Atendimento abrangente e suporte. Serviços de saúde modernos para você e sua família, 24 horas por dia.",
            "links": "Links", "discover": "Descobrir", "london": "Londres", "hamburg": "Hamburgo",
            "copyright": "Copyright ©PolarisDX 2025 Todos os direitos reservados.",
            "imprint": "Ficha técnica", "privacy": "Política de Privacidade",
            "doctors": "Nossos médicos", "testimonials": "Depoimentos", "faq": "FAQ", "appointment": "Agendar consulta"
        },
        "cta": {
            "title": "Procurando cuidados médicos <1>profissionais e confiáveis?</1>",
            "description": "Não hesite em nos contatar. Nossa equipe está pronta para apoiá-lo e agendar a consulta certa.",
            "button": "Agendar consulta"
        },
        "cta_section": {
            "title": "Procurando desempenho garantido e experiência em POC?",
            "text": "Fale diretamente com nossos especialistas em IglooPro. Nossa equipe está pronta para analisar seus requisitos de fluxo de trabalho individuais e mostrar o caminho mais rápido para diagnósticos validados. Conosco, você obtém uma solução sob medida, não uma entrega padrão.",
            "button": "Agendar análise especializada agora"
        }
    }
}

for lang in languages:
    filepath = f"public/locales/{lang}/common.json"
    content = translations.get(lang)
    if content:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
            print(f"Updated {filepath}")
    else:
        print(f"No translation for {lang}")
