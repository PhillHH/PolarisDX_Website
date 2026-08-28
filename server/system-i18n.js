/**
 * PT08.5 system-mail copy.
 *
 * The keys of MAIL_COPY are the translation resources, not a second supported-
 * language registry. The G4-adjacent test compares them with src/i18n.ts.
 * Invalid request locales fall back defensively to English.
 */
const MAIL_COPY = {
  de: {
    support: {
      subject: 'Ihre Support-Anfrage wurde empfangen',
      title: 'Ihre Support-Anfrage wurde empfangen',
      greeting: 'Hallo',
      received:
        'vielen Dank für Ihre Support-Anfrage. Wir haben Ihre Nachricht erhalten und melden uns schnellstmöglich bei Ihnen.',
      details: 'Ihre Angaben',
      issueType: 'Problemtyp',
      subjectLabel: 'Betreff',
      regards: 'Mit freundlichen Grüßen',
      team: 'Das PolarisDX Support-Team',
    },
    roi: {
      subject: 'Ihr IglooPro ROI-Report',
      title: 'Ihr IglooPro ROI-Report',
      subtitle: 'Point-of-Care-Diagnostik · PolarisDX',
      introAttachment:
        'Vielen Dank für Ihr Interesse. Auf Basis Ihrer Eingaben haben wir Ihre persönliche Beispielrechnung erstellt; der Report ist auch als PDF beigefügt.',
      introNoAttachment:
        'Vielen Dank für Ihr Interesse. Auf Basis Ihrer Eingaben haben wir Ihre persönliche Beispielrechnung erstellt.',
      inputs: 'Ihre Eingaben',
      results: 'Ihr Ergebnis (Beispielrechnung)',
      cta: 'Beratung buchen',
      disclaimer:
        'Unverbindliche Beispielrechnung auf Basis Ihrer Eingaben. Keine Zusage von Umsatz oder Gewinn — Ergebnisse hängen von Ihren individuellen Praxiswerten ab.',
      practice: 'Praxis',
      area: 'Fachrichtung',
      tests: 'Tests pro Monat',
      price: 'Preis pro Test',
      material: 'Materialkosten pro Test',
      minutes: 'Minuten pro Test',
      staff: 'Personalkosten pro Stunde',
      investment: 'Geräteinvestition',
      month: 'Deckungsbeitrag / Monat',
      revenue: 'Selbstzahler-Umsatz / Monat',
      year: 'Deckungsbeitrag / Jahr',
      perTest: 'Deckungsbeitrag je Test',
      payback: 'Amortisation',
      months: 'Monate',
    },
  },
  en: {
    support: {
      subject: 'Your support request has been received',
      title: 'Your support request has been received',
      greeting: 'Hello',
      received:
        'Thank you for your support request. We have received your message and will get back to you as soon as possible.',
      details: 'Your details',
      issueType: 'Issue type',
      subjectLabel: 'Subject',
      regards: 'Kind regards',
      team: 'The PolarisDX Support Team',
    },
    roi: {
      subject: 'Your IglooPro ROI report',
      title: 'Your IglooPro ROI report',
      subtitle: 'Point-of-care diagnostics · PolarisDX',
      introAttachment:
        'Thank you for your interest. We have prepared your personal example calculation from your inputs; the report is also attached as a PDF.',
      introNoAttachment:
        'Thank you for your interest. We have prepared your personal example calculation from your inputs.',
      inputs: 'Your inputs',
      results: 'Your result (example calculation)',
      cta: 'Book a consultation',
      disclaimer:
        'Non-binding example calculation based on your inputs. No revenue or profit is guaranteed — results depend on your individual practice figures.',
      practice: 'Practice',
      area: 'Specialty',
      tests: 'Tests per month',
      price: 'Price per test',
      material: 'Material cost per test',
      minutes: 'Minutes per test',
      staff: 'Staff cost per hour',
      investment: 'Equipment investment',
      month: 'Contribution margin / month',
      revenue: 'Self-pay revenue / month',
      year: 'Contribution margin / year',
      perTest: 'Contribution margin per test',
      payback: 'Payback period',
      months: 'months',
    },
  },
  pl: {
    support: {
      subject: 'Otrzymaliśmy Twoje zgłoszenie do pomocy technicznej',
      title: 'Otrzymaliśmy Twoje zgłoszenie do pomocy technicznej',
      greeting: 'Dzień dobry',
      received:
        'Dziękujemy za zgłoszenie. Otrzymaliśmy Twoją wiadomość i odpowiemy tak szybko, jak to możliwe.',
      details: 'Twoje dane',
      issueType: 'Rodzaj problemu',
      subjectLabel: 'Temat',
      regards: 'Z poważaniem',
      team: 'Zespół wsparcia PolarisDX',
    },
    roi: {
      subject: 'Twój raport ROI IglooPro',
      title: 'Twój raport ROI IglooPro',
      subtitle: 'Diagnostyka przyłóżkowa · PolarisDX',
      introAttachment:
        'Dziękujemy za zainteresowanie. Na podstawie podanych danych przygotowaliśmy indywidualną kalkulację przykładową; raport dołączono również jako PDF.',
      introNoAttachment:
        'Dziękujemy za zainteresowanie. Na podstawie podanych danych przygotowaliśmy indywidualną kalkulację przykładową.',
      inputs: 'Twoje dane wejściowe',
      results: 'Twój wynik (kalkulacja przykładowa)',
      cta: 'Umów konsultację',
      disclaimer:
        'Niewiążąca kalkulacja przykładowa na podstawie podanych danych. Nie stanowi gwarancji przychodu ani zysku — wyniki zależą od indywidualnych wartości praktyki.',
      practice: 'Praktyka',
      area: 'Specjalizacja',
      tests: 'Testy miesięcznie',
      price: 'Cena za test',
      material: 'Koszt materiałów na test',
      minutes: 'Minuty na test',
      staff: 'Koszt personelu na godzinę',
      investment: 'Inwestycja w urządzenie',
      month: 'Marża pokrycia / miesiąc',
      revenue: 'Przychód od pacjentów prywatnych / miesiąc',
      year: 'Marża pokrycia / rok',
      perTest: 'Marża pokrycia na test',
      payback: 'Okres zwrotu',
      months: 'miesiące',
    },
  },
  fr: {
    support: {
      subject: 'Votre demande d’assistance a bien été reçue',
      title: 'Votre demande d’assistance a bien été reçue',
      greeting: 'Bonjour',
      received:
        'Merci pour votre demande d’assistance. Nous avons reçu votre message et vous répondrons dans les meilleurs délais.',
      details: 'Vos informations',
      issueType: 'Type de problème',
      subjectLabel: 'Objet',
      regards: 'Cordialement',
      team: 'L’équipe d’assistance PolarisDX',
    },
    roi: {
      subject: 'Votre rapport ROI IglooPro',
      title: 'Votre rapport ROI IglooPro',
      subtitle: 'Diagnostic au point de service · PolarisDX',
      introAttachment:
        'Merci pour votre intérêt. Nous avons préparé votre simulation personnalisée à partir de vos données ; le rapport est également joint au format PDF.',
      introNoAttachment:
        'Merci pour votre intérêt. Nous avons préparé votre simulation personnalisée à partir de vos données.',
      inputs: 'Vos données',
      results: 'Votre résultat (simulation)',
      cta: 'Réserver une consultation',
      disclaimer:
        'Simulation indicative fondée sur vos données. Aucun chiffre d’affaires ni bénéfice n’est garanti — les résultats dépendent des valeurs propres à votre cabinet.',
      practice: 'Cabinet',
      area: 'Spécialité',
      tests: 'Tests par mois',
      price: 'Prix par test',
      material: 'Coût du matériel par test',
      minutes: 'Minutes par test',
      staff: 'Coût du personnel par heure',
      investment: 'Investissement matériel',
      month: 'Marge contributive / mois',
      revenue: 'Chiffre d’affaires patients privés / mois',
      year: 'Marge contributive / an',
      perTest: 'Marge contributive par test',
      payback: 'Amortissement',
      months: 'mois',
    },
  },
  it: {
    support: {
      subject: 'La tua richiesta di assistenza è stata ricevuta',
      title: 'La tua richiesta di assistenza è stata ricevuta',
      greeting: 'Buongiorno',
      received:
        'Grazie per la richiesta di assistenza. Abbiamo ricevuto il messaggio e ti risponderemo al più presto.',
      details: 'I tuoi dati',
      issueType: 'Tipo di problema',
      subjectLabel: 'Oggetto',
      regards: 'Cordiali saluti',
      team: 'Il team di assistenza PolarisDX',
    },
    roi: {
      subject: 'Il tuo report ROI IglooPro',
      title: 'Il tuo report ROI IglooPro',
      subtitle: 'Diagnostica point-of-care · PolarisDX',
      introAttachment:
        'Grazie per l’interesse. Abbiamo preparato il calcolo esemplificativo personale in base ai dati inseriti; il report è allegato anche in PDF.',
      introNoAttachment:
        'Grazie per l’interesse. Abbiamo preparato il calcolo esemplificativo personale in base ai dati inseriti.',
      inputs: 'I tuoi dati',
      results: 'Il tuo risultato (calcolo esemplificativo)',
      cta: 'Prenota una consulenza',
      disclaimer:
        'Calcolo esemplificativo non vincolante basato sui dati inseriti. Non garantisce ricavi o profitti — i risultati dipendono dai valori specifici dello studio.',
      practice: 'Studio',
      area: 'Specializzazione',
      tests: 'Test al mese',
      price: 'Prezzo per test',
      material: 'Costo del materiale per test',
      minutes: 'Minuti per test',
      staff: 'Costo del personale per ora',
      investment: 'Investimento in apparecchiatura',
      month: 'Margine di contribuzione / mese',
      revenue: 'Ricavi da pazienti privati / mese',
      year: 'Margine di contribuzione / anno',
      perTest: 'Margine di contribuzione per test',
      payback: 'Ammortamento',
      months: 'mesi',
    },
  },
  es: {
    support: {
      subject: 'Hemos recibido su solicitud de asistencia',
      title: 'Hemos recibido su solicitud de asistencia',
      greeting: 'Hola',
      received:
        'Gracias por su solicitud de asistencia. Hemos recibido su mensaje y responderemos lo antes posible.',
      details: 'Sus datos',
      issueType: 'Tipo de problema',
      subjectLabel: 'Asunto',
      regards: 'Atentamente',
      team: 'El equipo de asistencia de PolarisDX',
    },
    roi: {
      subject: 'Su informe de ROI de IglooPro',
      title: 'Su informe de ROI de IglooPro',
      subtitle: 'Diagnóstico en el punto de atención · PolarisDX',
      introAttachment:
        'Gracias por su interés. Hemos preparado su cálculo de ejemplo personalizado a partir de los datos introducidos; el informe también se adjunta en PDF.',
      introNoAttachment:
        'Gracias por su interés. Hemos preparado su cálculo de ejemplo personalizado a partir de los datos introducidos.',
      inputs: 'Sus datos',
      results: 'Su resultado (cálculo de ejemplo)',
      cta: 'Reservar una consulta',
      disclaimer:
        'Cálculo de ejemplo no vinculante basado en sus datos. No garantiza ingresos ni beneficios — los resultados dependen de los valores individuales de su consulta.',
      practice: 'Consulta',
      area: 'Especialidad',
      tests: 'Pruebas al mes',
      price: 'Precio por prueba',
      material: 'Coste de material por prueba',
      minutes: 'Minutos por prueba',
      staff: 'Coste de personal por hora',
      investment: 'Inversión en equipo',
      month: 'Margen de contribución / mes',
      revenue: 'Ingresos de pacientes privados / mes',
      year: 'Margen de contribución / año',
      perTest: 'Margen de contribución por prueba',
      payback: 'Amortización',
      months: 'meses',
    },
  },
  pt: {
    support: {
      subject: 'Recebemos o seu pedido de suporte',
      title: 'Recebemos o seu pedido de suporte',
      greeting: 'Olá',
      received:
        'Obrigado pelo seu pedido de suporte. Recebemos a sua mensagem e responderemos o mais rapidamente possível.',
      details: 'Os seus dados',
      issueType: 'Tipo de problema',
      subjectLabel: 'Assunto',
      regards: 'Com os melhores cumprimentos',
      team: 'A equipa de suporte PolarisDX',
    },
    roi: {
      subject: 'O seu relatório de ROI IglooPro',
      title: 'O seu relatório de ROI IglooPro',
      subtitle: 'Diagnóstico no local de prestação de cuidados · PolarisDX',
      introAttachment:
        'Obrigado pelo seu interesse. Preparámos o seu cálculo exemplificativo personalizado com base nos dados introduzidos; o relatório segue também em PDF.',
      introNoAttachment:
        'Obrigado pelo seu interesse. Preparámos o seu cálculo exemplificativo personalizado com base nos dados introduzidos.',
      inputs: 'Os seus dados',
      results: 'O seu resultado (cálculo exemplificativo)',
      cta: 'Marcar uma consulta',
      disclaimer:
        'Cálculo exemplificativo não vinculativo baseado nos seus dados. Não garante receitas nem lucros — os resultados dependem dos valores individuais da sua prática.',
      practice: 'Prática',
      area: 'Especialidade',
      tests: 'Testes por mês',
      price: 'Preço por teste',
      material: 'Custo de material por teste',
      minutes: 'Minutos por teste',
      staff: 'Custo de pessoal por hora',
      investment: 'Investimento em equipamento',
      month: 'Margem de contribuição / mês',
      revenue: 'Receita de pacientes particulares / mês',
      year: 'Margem de contribuição / ano',
      perTest: 'Margem de contribuição por teste',
      payback: 'Amortização',
      months: 'meses',
    },
  },
  da: {
    support: {
      subject: 'Vi har modtaget din supportanmodning',
      title: 'Vi har modtaget din supportanmodning',
      greeting: 'Hej',
      received:
        'Tak for din supportanmodning. Vi har modtaget din besked og vender tilbage hurtigst muligt.',
      details: 'Dine oplysninger',
      issueType: 'Problemtype',
      subjectLabel: 'Emne',
      regards: 'Venlig hilsen',
      team: 'PolarisDX-supportteamet',
    },
    roi: {
      subject: 'Din IglooPro ROI-rapport',
      title: 'Din IglooPro ROI-rapport',
      subtitle: 'Point-of-care-diagnostik · PolarisDX',
      introAttachment:
        'Tak for din interesse. Vi har udarbejdet din personlige eksempelberegning ud fra dine oplysninger; rapporten er også vedhæftet som PDF.',
      introNoAttachment:
        'Tak for din interesse. Vi har udarbejdet din personlige eksempelberegning ud fra dine oplysninger.',
      inputs: 'Dine oplysninger',
      results: 'Dit resultat (eksempelberegning)',
      cta: 'Book en rådgivning',
      disclaimer:
        'Uforpligtende eksempelberegning baseret på dine oplysninger. Omsætning eller fortjeneste garanteres ikke — resultaterne afhænger af din praksis’ individuelle værdier.',
      practice: 'Praksis',
      area: 'Fagområde',
      tests: 'Test pr. måned',
      price: 'Pris pr. test',
      material: 'Materialeomkostning pr. test',
      minutes: 'Minutter pr. test',
      staff: 'Personaleomkostning pr. time',
      investment: 'Investering i udstyr',
      month: 'Dækningsbidrag / måned',
      revenue: 'Privatpatientomsætning / måned',
      year: 'Dækningsbidrag / år',
      perTest: 'Dækningsbidrag pr. test',
      payback: 'Tilbagebetalingstid',
      months: 'måneder',
    },
  },
  nl: {
    support: {
      subject: 'Uw supportaanvraag is ontvangen',
      title: 'Uw supportaanvraag is ontvangen',
      greeting: 'Hallo',
      received:
        'Bedankt voor uw supportaanvraag. We hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op.',
      details: 'Uw gegevens',
      issueType: 'Probleemtype',
      subjectLabel: 'Onderwerp',
      regards: 'Met vriendelijke groet',
      team: 'Het PolarisDX-supportteam',
    },
    roi: {
      subject: 'Uw IglooPro ROI-rapport',
      title: 'Uw IglooPro ROI-rapport',
      subtitle: 'Point-of-care-diagnostiek · PolarisDX',
      introAttachment:
        'Bedankt voor uw interesse. Op basis van uw invoer hebben we uw persoonlijke voorbeeldberekening opgesteld; het rapport is ook als pdf bijgevoegd.',
      introNoAttachment:
        'Bedankt voor uw interesse. Op basis van uw invoer hebben we uw persoonlijke voorbeeldberekening opgesteld.',
      inputs: 'Uw invoer',
      results: 'Uw resultaat (voorbeeldberekening)',
      cta: 'Plan een adviesgesprek',
      disclaimer:
        'Niet-bindende voorbeeldberekening op basis van uw invoer. Omzet of winst wordt niet gegarandeerd — resultaten hangen af van de individuele waarden van uw praktijk.',
      practice: 'Praktijk',
      area: 'Vakgebied',
      tests: 'Tests per maand',
      price: 'Prijs per test',
      material: 'Materiaalkosten per test',
      minutes: 'Minuten per test',
      staff: 'Personeelskosten per uur',
      investment: 'Investering in apparatuur',
      month: 'Dekkingsbijdrage / maand',
      revenue: 'Omzet particuliere patiënten / maand',
      year: 'Dekkingsbijdrage / jaar',
      perTest: 'Dekkingsbijdrage per test',
      payback: 'Terugverdientijd',
      months: 'maanden',
    },
  },
  cs: {
    support: {
      subject: 'Obdrželi jsme váš požadavek na podporu',
      title: 'Obdrželi jsme váš požadavek na podporu',
      greeting: 'Dobrý den',
      received:
        'Děkujeme za váš požadavek na podporu. Zprávu jsme obdrželi a ozveme se co nejdříve.',
      details: 'Vaše údaje',
      issueType: 'Typ problému',
      subjectLabel: 'Předmět',
      regards: 'S pozdravem',
      team: 'Tým podpory PolarisDX',
    },
    roi: {
      subject: 'Váš ROI report IglooPro',
      title: 'Váš ROI report IglooPro',
      subtitle: 'Diagnostika v místě péče · PolarisDX',
      introAttachment:
        'Děkujeme za váš zájem. Z vašich údajů jsme připravili osobní modelový výpočet; report je přiložen také jako PDF.',
      introNoAttachment:
        'Děkujeme za váš zájem. Z vašich údajů jsme připravili osobní modelový výpočet.',
      inputs: 'Vaše vstupy',
      results: 'Váš výsledek (modelový výpočet)',
      cta: 'Domluvit konzultaci',
      disclaimer:
        'Nezávazný modelový výpočet založený na vašich údajích. Nezaručuje tržby ani zisk — výsledky závisí na individuálních hodnotách vaší praxe.',
      practice: 'Praxe',
      area: 'Specializace',
      tests: 'Testy za měsíc',
      price: 'Cena za test',
      material: 'Náklady na materiál za test',
      minutes: 'Minuty na test',
      staff: 'Náklady na personál za hodinu',
      investment: 'Investice do zařízení',
      month: 'Příspěvek na úhradu / měsíc',
      revenue: 'Tržby od samoplátců / měsíc',
      year: 'Příspěvek na úhradu / rok',
      perTest: 'Příspěvek na úhradu za test',
      payback: 'Doba návratnosti',
      months: 'měsíce',
    },
  },
}

function resolveMailLocale(value) {
  const requested = typeof value === 'string' ? value.trim().toLowerCase() : ''
  const locale = Object.prototype.hasOwnProperty.call(MAIL_COPY, requested) ? requested : 'en'
  return { locale, requested, didFallback: locale !== requested }
}

function getMailCopy(locale) {
  return MAIL_COPY[resolveMailLocale(locale).locale]
}

function formatMailCurrency(value, locale) {
  const resolved = resolveMailLocale(locale).locale
  return new Intl.NumberFormat(resolved, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(Number.isFinite(+value) ? +value : 0)
}

module.exports = { MAIL_COPY, resolveMailLocale, getMailCopy, formatMailCurrency }
