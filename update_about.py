import json
import os

languages = ['cs', 'da', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt']

# Helper to load existing file if needed
def load_json(path):
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

# Define structure
# Note: Spellings of names are kept as in German source, but Zuccala fixed.
# Roles and Bios are translated.

# Base for translation logic (simplified for script, I will hardcode them)
translations = {
    "en": {
        "hero": {"caption": "ABOUT US", "title": "Redefining Diagnostics", "description": "PolarisDX stands for innovation, precision, and reliability in medical technology. Meet the people behind our mission."},
        "team": {
            "caption": "OUR TEAM", "title": "Meet Our Experts",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "As CEO of Polaris Diagnostics Limited in London, Tim Ritson leads the strategic vision of the company. With decades of operational experience, he steers the global direction and growth of PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Director Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala is responsible for the European business as Director of Polaris Diagnostics Europe U.G. His focus is on sales and strategic market development to make innovative diagnostic solutions accessible."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Sales Director Polaris Diagnostics Europe", "bio": "As Sales Director, Frank Stoffels brings extensive expertise from the MedTech industry. He is the face of PolarisDX at international trade fairs and the first point of contact for our customers on sales issues."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Senior Global Operations Director", "bio": "As Senior Global Operations Director, Ulrike Schuerholz manages operational processes. She ensures efficient processes and the strategic implementation of our corporate goals in a global context."}
            }
        }
    },
    "fr": {
        "hero": {"caption": "À PROPOS DE NOUS", "title": "Redéfinir le diagnostic", "description": "PolarisDX est synonyme d'innovation, de précision et de fiabilité dans la technologie médicale. Rencontrez les personnes derrière notre mission."},
        "team": {
            "caption": "NOTRE ÉQUIPE", "title": "Rencontrez nos experts",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "PDG Polaris Diagnostics Limited", "bio": "En tant que PDG de Polaris Diagnostics Limited à Londres, Tim Ritson dirige la vision stratégique de l'entreprise. Avec des décennies d'expérience opérationnelle, il pilote la direction mondiale et la croissance de PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Directeur Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala est responsable des activités européennes en tant que Directeur de Polaris Diagnostics Europe U.G. Son accent est mis sur les ventes et le développement stratégique du marché pour rendre accessibles des solutions de diagnostic innovantes."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Directeur des ventes Polaris Diagnostics Europe", "bio": "En tant que Directeur des ventes, Frank Stoffels apporte une vaste expertise de l'industrie MedTech. Il est le visage de PolarisDX lors des salons internationaux et le premier point de contact pour nos clients sur les questions de vente."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Directrice principale des opérations mondiales", "bio": "En tant que Directrice principale des opérations mondiales, Ulrike Schuerholz gère les processus opérationnels. Elle assure des processus efficaces et la mise en œuvre stratégique de nos objectifs d'entreprise dans un contexte mondial."}
            }
        }
    },
    "es": {
        "hero": {"caption": "SOBRE NOSOTROS", "title": "Redefiniendo el diagnóstico", "description": "PolarisDX es sinónimo de innovación, precisión y fiabilidad en tecnología médica. Conozca a las personas detrás de nuestra misión."},
        "team": {
            "caption": "NUESTRO EQUIPO", "title": "Conozca a nuestros expertos",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Como CEO de Polaris Diagnostics Limited en Londres, Tim Ritson lidera la visión estratégica de la empresa. Con décadas de experiencia operativa, dirige la dirección global y el crecimiento de PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Director Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala es responsable del negocio europeo como Director de Polaris Diagnostics Europe U.G. Su enfoque está en las ventas y el desarrollo estratégico del mercado para hacer accesibles soluciones de diagnóstico innovadoras."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Director de Ventas Polaris Diagnostics Europe", "bio": "Como Director de Ventas, Frank Stoffels aporta una amplia experiencia de la industria MedTech. Es la cara de PolarisDX en ferias internacionales y el primer punto de contacto para nuestros clientes en temas de ventas."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Directora Senior de Operaciones Globales", "bio": "Como Directora Senior de Operaciones Globales, Ulrike Schuerholz gestiona los procesos operativos. Asegura procesos eficientes y la implementación estratégica de nuestros objetivos corporativos en un contexto global."}
            }
        }
    },
    "it": {
        "hero": {"caption": "CHI SIAMO", "title": "Ridefinire la diagnostica", "description": "PolarisDX è sinonimo di innovazione, precisione e affidabilità nella tecnologia medica. Incontra le persone dietro la nostra missione."},
        "team": {
            "caption": "IL NOSTRO TEAM", "title": "Incontra i nostri esperti",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "In qualità di CEO di Polaris Diagnostics Limited a Londra, Tim Ritson guida la visione strategica dell'azienda. Con decenni di esperienza operativa, dirige la direzione globale e la crescita di PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Direttore Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala è responsabile del business europeo come Direttore di Polaris Diagnostics Europe U.G. Il suo focus è sulle vendite e lo sviluppo strategico del mercato per rendere accessibili soluzioni diagnostiche innovative."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Direttore Vendite Polaris Diagnostics Europe", "bio": "Come Direttore Vendite, Frank Stoffels porta una vasta esperienza dal settore MedTech. È il volto di PolarisDX alle fiere internazionali e il primo punto di contatto per i nostri clienti su questioni di vendita."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Senior Global Operations Director", "bio": "In qualità di Senior Global Operations Director, Ulrike Schuerholz gestisce i processi operativi. Assicura processi efficienti e l'implementazione strategica dei nostri obiettivi aziendali in un contesto globale."}
            }
        }
    },
    "nl": {
        "hero": {"caption": "OVER ONS", "title": "Diagnostiek herdefiniëren", "description": "PolarisDX staat voor innovatie, precisie en betrouwbaarheid in medische technologie. Ontmoet de mensen achter onze missie."},
        "team": {
            "caption": "ONS TEAM", "title": "Ontmoet onze experts",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Als CEO van Polaris Diagnostics Limited in Londen leidt Tim Ritson de strategische visie van het bedrijf. Met tientallen jaren operationele ervaring stuurt hij de wereldwijde richting en groei van PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Directeur Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala is verantwoordelijk voor de Europese activiteiten als Directeur van Polaris Diagnostics Europe U.G. Zijn focus ligt op verkoop en strategische marktontwikkeling om innovatieve diagnostische oplossingen toegankelijk te maken."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Verkoopdirecteur Polaris Diagnostics Europe", "bio": "Als Verkoopdirecteur brengt Frank Stoffels uitgebreide expertise uit de MedTech-industrie mee. Hij is het gezicht van PolarisDX op internationale beurzen en het eerste aanspreekpunt voor onze klanten bij verkoopvragen."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Senior Global Operations Director", "bio": "Als Senior Global Operations Director beheert Ulrike Schuerholz de operationele processen. Ze zorgt voor efficiënte processen en de strategische implementatie van onze bedrijfsdoelstellingen in een wereldwijde context."}
            }
        }
    },
    "pl": {
        "hero": {"caption": "O NAS", "title": "Definiujemy diagnostykę na nowo", "description": "PolarisDX oznacza innowację, precyzję i niezawodność w technologii medycznej. Poznaj ludzi stojących za naszą misją."},
        "team": {
            "caption": "NASZ ZESPÓŁ", "title": "Poznaj naszych ekspertów",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Jako CEO Polaris Diagnostics Limited w Londynie, Tim Ritson kieruje strategiczną wizją firmy. Z dekadami doświadczenia operacyjnego steruje globalnym kierunkiem i wzrostem PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Dyrektor Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala odpowiada za europejską działalność jako Dyrektor Polaris Diagnostics Europe U.G. Koncentruje się na sprzedaży i strategicznym rozwoju rynku, aby udostępniać innowacyjne rozwiązania diagnostyczne."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Dyrektor Sprzedaży Polaris Diagnostics Europe", "bio": "Jako Dyrektor Sprzedaży, Frank Stoffels wnosi bogate doświadczenie z branży MedTech. Jest twarzą PolarisDX na międzynarodowych targach i pierwszym punktem kontaktu dla naszych klientów w sprawach sprzedaży."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Starszy Dyrektor Operacyjny Globalny", "bio": "Jako Starszy Dyrektor Operacyjny Globalny, Ulrike Schuerholz zarządza procesami operacyjnymi. Zapewnia efektywne procesy i strategiczną realizację naszych celów korporacyjnych w kontekście globalnym."}
            }
        }
    },
    "da": {
        "hero": {"caption": "OM OS", "title": "Omdefinerer diagnostik", "description": "PolarisDX står for innovation, præcision og pålidelighed inden for medicinsk teknologi. Mød menneskene bag vores mission."},
        "team": {
            "caption": "VORES TEAM", "title": "Mød vores eksperter",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Som CEO for Polaris Diagnostics Limited i London leder Tim Ritson virksomhedens strategiske vision. Med årtiers operationel erfaring styrer han den globale retning og vækst for PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Direktør Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala er ansvarlig for den europæiske forretning som direktør for Polaris Diagnostics Europe U.G. Hans fokus er på salg og strategisk markedsudvikling for at gøre innovative diagnostiske løsninger tilgængelige."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Salgsdirektør Polaris Diagnostics Europe", "bio": "Som salgsdirektør bringer Frank Stoffels omfattende ekspertise fra MedTech-industrien. Han er PolarisDX's ansigt på internationale messer og første kontaktpunkt for vores kunder vedrørende salgsspørgsmål."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Senior Global Operations Director", "bio": "Som Senior Global Operations Director styrer Ulrike Schuerholz de operationelle processer. Hun sikrer effektive processer og den strategiske implementering af vores virksomhedsmål i en global kontekst."}
            }
        }
    },
    "cs": {
        "hero": {"caption": "O NÁS", "title": "Redefinujeme diagnostiku", "description": "PolarisDX znamená inovaci, přesnost a spolehlivost v lékařské technologii. Poznejte lidi, kteří stojí za naší misí."},
        "team": {
            "caption": "NÁŠ TÝM", "title": "Poznejte naše odborníky",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Jako CEO Polaris Diagnostics Limited v Londýně vede Tim Ritson strategickou vizi společnosti. S desetiletími provozních zkušeností řídí globální směřování a růst PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Ředitel Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala je odpovědný za evropský obchod jako ředitel Polaris Diagnostics Europe U.G. Zaměřuje se na prodej a strategický rozvoj trhu s cílem zpřístupnit inovativní diagnostická řešení."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Obchodní ředitel Polaris Diagnostics Europe", "bio": "Jako obchodní ředitel přináší Frank Stoffels rozsáhlé odborné znalosti z odvětví MedTech. Je tváří PolarisDX na mezinárodních veletrzích a prvním kontaktním bodem pro naše zákazníky v otázkách prodeje."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Senior Global Operations Director", "bio": "Jako Senior Global Operations Director řídí Ulrike Schuerholz provozní procesy. Zajišťuje efektivní procesy a strategickou implementaci našich firemních cílů v globálním kontextu."}
            }
        }
    },
    "pt": {
        "hero": {"caption": "SOBRE NÓS", "title": "Redefinindo Diagnósticos", "description": "PolarisDX significa inovação, precisão e confiabilidade em tecnologia médica. Conheça as pessoas por trás de nossa missão."},
        "team": {
            "caption": "NOSSA EQUIPE", "title": "Conheça Nossos Especialistas",
            "members": {
                "tim_ritson": {"name": "Tim Ritson", "role": "CEO Polaris Diagnostics Limited", "bio": "Como CEO da Polaris Diagnostics Limited em Londres, Tim Ritson lidera a visão estratégica da empresa. Com décadas de experiência operacional, ele dirige a direção global e o crescimento da PolarisDX."},
                "adriano_zucalla": {"name": "Adriano Zuccala", "role": "Diretor Polaris Diagnostics Europe U.G.", "bio": "Adriano Zuccala é responsável pelos negócios europeus como Diretor da Polaris Diagnostics Europe U.G. Seu foco está em vendas e desenvolvimento estratégico de mercado para tornar acessíveis soluções de diagnóstico inovadoras."},
                "frank_stoffels": {"name": "Frank Stoffels", "role": "Diretor de Vendas Polaris Diagnostics Europe", "bio": "Como Diretor de Vendas, Frank Stoffels traz ampla experiência da indústria de tecnologia médica. Ele é o rosto da PolarisDX em feiras internacionais e o primeiro ponto de contato para nossos clientes em questões de vendas."},
                "ulrike_schuerholz": {"name": "Ulrike Schuerholz", "role": "Diretora Sênior de Operações Globais", "bio": "Como Diretora Sênior de Operações Globais, Ulrike Schuerholz gerencia os processos operacionais. Ela garante processos eficientes e a implementação estratégica de nossos objetivos corporativos em um contexto global."}
            }
        }
    }
}

for lang in languages:
    filepath = f"public/locales/{lang}/about.json"
    content = translations.get(lang)
    if content:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
            print(f"Updated {filepath}")
    else:
        print(f"No translation for {lang}")
