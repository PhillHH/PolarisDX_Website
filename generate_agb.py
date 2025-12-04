import re

raw_text = """Allgemeine Geschaeftsbedingungen
Polaris Diagnostics Europe UG (haftungsbeschraenkt)
In-vitro-Diagnostik | Medizinprodukte | Software & Cloud-Dienste
Stand: Dezember 2025
§ 1 Geltungsbereich
§ 1.1 Diese Allgemeinen Geschaeftsbedingungen (AGB) gelten fuer alle Geschaeftsbeziehungen zwischen der Polaris Diagnostics Europe UG (haftungsbeschraenkt), nachfolgend 'Polaris' genannt, und dem Kunden. Sie gelten fuer den Verkauf und die Lieferung von In-vitro-Diagnostik-Medizinprodukten (IVD), Geraeten, Testkits, Verbrauchsmaterialien, Software und Cloud-Diensten.
§ 1.2 Die AGB gelten ausschliesslich. Abweichende, entgegenstehende oder ergaenzende Allgemeine Geschaeftsbedingungen des Kunden werden nur dann Vertragsbestandteil, wenn Polaris ihrer Geltung ausdruecklich schriftlich zugestimmt hat.
§ 1.3 Die AGB gelten auch fuer alle zukuenftigen Geschaefte mit dem Kunden, soweit es sich um Rechtsgeschaefte verwandter Art handelt.
§ 1.4 Im Einzelfall getroffene, individuelle Vereinbarungen mit dem Kunden (einschliesslich Nebenabreden, Ergaenzungen und Aenderungen) haben in jedem Fall Vorrang vor diesen AGB. Fuer den Inhalt derartiger Vereinbarungen ist ein schriftlicher Vertrag bzw. die schriftliche Bestaetigung durch Polaris massgebend.
§ 1.5 Die Angebote von Polaris richten sich ausschliesslich an Unternehmer im Sinne von § 14 BGB, juristische Personen des oeffentlichen Rechts oder oeffentlich-rechtliche Sondervermoegen (B2B). Verbrauchergeschaefte im Sinne von § 13 BGB sind ausgeschlossen.
§ 2 Vertragsschluss
§ 2.1 Die Darstellung der Produkte auf der Website, in Katalogen, Prospekten oder sonstigen Werbematerialien stellt kein rechtlich bindendes Angebot, sondern eine unverbindliche Aufforderung zur Abgabe eines Angebots dar.
§ 2.2 Durch die Bestellung erklaert der Kunde verbindlich, die bestellten Produkte erwerben zu wollen. Die Bestellung kann schriftlich, per E-Mail, ueber die Website oder telefonisch erfolgen.
§ 2.3 Der Vertrag kommt erst durch die schriftliche Auftragsbestaetigung von Polaris oder durch die Lieferung der Ware zustande. Die automatische Eingangsbestaetigung einer Online-Bestellung stellt noch keine Annahme des Angebots dar.
§ 2.4 Polaris behaelt sich das Recht vor, Bestellungen ohne Angabe von Gruenden abzulehnen, insbesondere bei begruendeten Zweifeln an der Bonitaet des Kunden oder bei Lieferengpaessen.
§ 2.5 Der Kunde ist an seine Bestellung fuer die Dauer von 14 Tagen gebunden. Der Vertrag kann in deutscher oder englischer Sprache geschlossen werden.
§ 3 Preise und Zahlungsbedingungen
§ 3.1 Es gelten die Preise zum Zeitpunkt der Bestellung gemaess der aktuellen Preisliste von Polaris. Alle Preise verstehen sich in Euro, zuzueglich der gesetzlichen Mehrwertsteuer und eventueller Versandkosten.
§ 3.2 Sofern nicht anders vereinbart, ist der Kaufpreis innerhalb von 14 Tagen nach Rechnungsdatum ohne Abzug zur Zahlung faellig. Massgeblich fuer die Rechtzeitigkeit der Zahlung ist der Zahlungseingang bei Polaris.
§ 3.3 Bei Zahlungsverzug ist Polaris berechtigt, Verzugszinsen in Hoehe von 9 Prozentpunkten ueber dem jeweiligen Basiszinssatz zu berechnen. Die Geltendmachung eines hoeheren Verzugsschadens bleibt vorbehalten.
§ 3.4 Der Kunde hat nur dann ein Recht zur Aufrechnung, wenn seine Gegenansprueche rechtskraeftig festgestellt, unbestritten oder von Polaris anerkannt sind. Der Kunde ist zur Ausuebung eines Zurueckbehaltungsrechts nur insoweit befugt, als sein Gegenanspruch auf demselben Vertragsverhaeltnis beruht.
§ 3.5 Polaris ist berechtigt, bei Neukunden oder bei begruendeten Zweifeln an der Zahlungsfaehigkeit Vorkasse, Anzahlung oder andere Sicherheiten zu verlangen.
§ 3.6 Fuer wiederkehrende Leistungen (Abonnements, Software-Lizenzen, Cloud-Dienste, Wartungsvertraege) erfolgt die Abrechnung im Voraus fuer den jeweiligen Abrechnungszeitraum, sofern nicht anders vereinbart.
§ 4 Lieferung und Versand
§ 4.1 Die Lieferung erfolgt ab Lager Polaris bzw. direkt vom Hersteller. Liefertermine und -fristen sind nur verbindlich, wenn sie von Polaris ausdruecklich schriftlich als verbindlich bestaetigt wurden.
§ 4.2 Die Gefahr des zufaelligen Untergangs und der zufaelligen Verschlechterung der Ware geht mit der Uebergabe an den Spediteur, den Frachtfuehrer oder die sonst zur Ausfuehrung der Versendung bestimmte Person auf den Kunden ueber.
§ 4.3 Teillieferungen sind zulaessig, soweit sie dem Kunden zumutbar sind. Jede Teillieferung gilt als selbststaendiges Geschaeft und kann separat abgerechnet werden.
§ 4.4 Kommt der Kunde in Annahmeverzug oder verletzt er schuldhaft sonstige Mitwirkungspflichten, ist Polaris berechtigt, den entstehenden Schaden einschliesslich etwaiger Mehraufwendungen ersetzt zu verlangen.
§ 4.5 Im Falle von hoeherer Gewalt, Betriebsstoerungen, Streiks, Aussperrungen, behoerdlichen Anordnungen oder sonstigen unvorhersehbaren Ereignissen verlaengern sich die Lieferfristen entsprechend. Polaris wird den Kunden ueber solche Hindernisse unverzueglich informieren.
§ 4.6 Fuer temperatursensible Produkte (z. B. Testkits, Reagenzien) erfolgt der Versand unter Einhaltung der vorgeschriebenen Kuehlkette. Der Kunde hat bei Anlieferung die Unversehrtheit und Temperatur zu pruefen und etwaige Maengel unverzueglich zu ruegen.
§ 5 Gewaehrleistung und Maengelansprueche
§ 5.1 Die Gewaehrleistungsrechte des Kunden setzen voraus, dass dieser seinen gesetzlichen Untersuchungs- und Ruegepflichten gemaess § 377 HGB ordnungsgemaess nachgekommen ist. Offensichtliche Maengel sind unverzueglich, spaetestens innerhalb von 7 Werktagen nach Erhalt der Ware schriftlich anzuzeigen.
§ 5.2 Bei berechtigten Maengelanspruechen ist Polaris nach eigener Wahl zur Nachbesserung oder Ersatzlieferung berechtigt. Schlaegt die Nacherfuellung fehl, kann der Kunde nach seiner Wahl Minderung oder Ruecktritt vom Vertrag verlangen.
§ 5.3 Die Gewaehrleistungsfrist betraegt 12 Monate ab Lieferung, sofern nicht eine kuerzere Haltbarkeitsdauer des Produkts angegeben ist. Bei Testkits und Verbrauchsmaterialien gilt die auf der Verpackung angegebene Haltbarkeitsdauer.
§ 5.4 Die Gewaehrleistung entfaellt bei unsachgemaesser Lagerung, Handhabung oder Verwendung entgegen der Gebrauchsanweisung, bei eigenmaechtige Aenderungen oder Reparaturen durch den Kunden oder Dritte sowie bei normaler Abnutzung oder Verschleiss.
§ 5.5 Die Gewaehrleistung fuer IVD-Medizinprodukte beschraenkt sich auf die spezifikationsgemaesse Funktion. Eine Garantie fuer bestimmte diagnostische Ergebnisse oder klinische Entscheidungen wird nicht uebernommen.
§ 6 Haftung und Haftungsbeschraenkung
§ 6.1 Polaris haftet unbeschraenkt fuer Schaeden aus der Verletzung des Lebens, des Koerpers oder der Gesundheit, die auf einer vorsaetzlichen oder fahrlaessigen Pflichtverletzung beruhen, sowie fuer Schaeden, die von der Haftung nach dem Produkthaftungsgesetz umfasst werden.
§ 6.2 Fuer sonstige Schaeden haftet Polaris nur bei Vorsatz und grober Fahrlaessigkeit sowie bei schuldhafter Verletzung wesentlicher Vertragspflichten. Die Haftung bei Verletzung wesentlicher Vertragspflichten ist auf den vertragstypischen, vorhersehbaren Schaden begrenzt.
§ 6.3 Eine Haftung fuer mittelbare Schaeden, Folgeschaeden, entgangenen Gewinn, Datenverlust oder Betriebsunterbrechung ist ausgeschlossen, soweit nicht Vorsatz oder grobe Fahrlaessigkeit vorliegt.
§ 6.4 Polaris haftet nicht fuer Schaeden, die durch fehlerhafte diagnostische Entscheidungen entstehen, sofern das Produkt ordnungsgemaess funktioniert hat. Die Verantwortung fuer die klinische Interpretation diagnostischer Ergebnisse liegt allein beim medizinischen Fachpersonal.
§ 6.5 Die vorstehenden Haftungsausschluesse und -beschraenkungen gelten auch zugunsten der gesetzlichen Vertreter, Mitarbeiter und Erfuellungsgehilfen von Polaris.
§ 7 Eigentumsvorbehalt
§ 7.1 Die gelieferten Geraete (insbesondere Igloo Pro Reader), Zubehoerteile sowie saemtliche Software-Lizenzen bleiben bis zur vollstaendigen Bezahlung aller offenen Forderungen im Eigentum der Polaris Diagnostics Europe UG (haftungsbeschraenkt).
§ 7.2 Bis zur vollstaendigen Zahlung erhaelt der Kunde lediglich ein widerrufliches, nicht uebertragbares Nutzungsrecht an Geraet, Software und Cloud-Diensten.
§ 7.3 Der Kunde ist verpflichtet, die Vorbehaltsware pfleglich zu behandeln und gegen Feuer, Wasser und Diebstahl ausreichend zu versichern. Wartungs- und Inspektionsarbeiten sind rechtzeitig durchzufuehren.
§ 7.4 Bei Pfaendungen oder sonstigen Eingriffen Dritter hat der Kunde Polaris unverzueglich schriftlich zu benachrichtigen und auf das Eigentum von Polaris hinzuweisen.
§ 7.5 Eine Weiterverpfaendung oder Sicherungsuebereignung der Vorbehaltsware ist ohne vorherige schriftliche Zustimmung von Polaris nicht gestattet.
§ 8 Nutzungsrechte an Software & Cloud-Diensten
§ 8.1 Die Nutzung der Software, Cloud-Dienste und digitalen Funktionen ist ausschliesslich Kunden gestattet, die ihren vertraglichen und finanziellen Verpflichtungen nachkommen.
§ 8.2 Polaris ist berechtigt, Funktionen oder Zugaenge einzuschraenken, sofern dies zur Wahrung berechtigter Interessen, insbesondere im Falle von Zahlungsverzug, erforderlich ist.
§ 8.3 Die Cloud-Dienste werden mit einer Verfuegbarkeit von 99,0% im Jahresmittel bereitgestellt. Geplante Wartungsfenster werden mindestens 48 Stunden im Voraus angekuendigt und gelten nicht als Ausfallzeit.
§ 8.4 Der Kunde ist fuer die Sicherheit seiner Zugangsdaten selbst verantwortlich. Bei Verdacht auf Missbrauch ist Polaris unverzueglich zu informieren.
§ 8.5 Eine Nutzung der Software oder Cloud-Dienste ueber den vertraglich vereinbarten Umfang hinaus (z.B. Mehrbenutzer, zusaetzliche Geraete) bedarf einer gesonderten Lizenzvereinbarung.
§ 9 Sperrung bei Zahlungsverzug
§ 9.1 Befindet sich der Kunde laenger als 14 Tage im Zahlungsverzug, ist Polaris nach schriftlicher Ankuendigung berechtigt, den Zugang zur Software, Cloud-Diensten oder die Nutzung des Geraets nach Ablauf einer Frist von 48 Stunden teilweise oder vollstaendig zu sperren.
§ 9.2 Die Sperrung dient ausschliesslich der Durchsetzung berechtigter Zahlungsansprueche und stellt keinen Produktmangel oder Serviceausfall dar.
§ 9.3 Nach Ausgleich aller offenen Forderungen wird der Zugang unverzueglich, spaetestens innerhalb von 24 Stunden, wieder freigeschaltet.
§ 9.4 Waehrend der Sperrung bleiben die vertraglichen Zahlungspflichten des Kunden in vollem Umfang bestehen. Die Sperrung befreit nicht von der Pflicht zur Zahlung laufender Entgelte.
§ 9.5 Polaris ist berechtigt, fuer die Freischaltung nach Sperrung eine angemessene Bearbeitungsgebuehr zu erheben.
§ 10 Ruecktritt, Rueckforderung & Widerruf der Nutzung
§ 10.1 Erfolgt trotz Mahnung und Sperrandrohung innerhalb von weiteren 14 Tagen keine Zahlung, ist Polaris berechtigt, vom Vertrag zurueckzutreten und das Geraet gemaess Eigentumsvorbehalt zurueckzufordern.
§ 10.2 In diesem Fall erlischt das Nutzungsrecht an Software und Cloud-Diensten automatisch. Der Kunde ist verpflichtet, das Geraet unverzueglich herauszugeben.
§ 10.3 Polaris ist berechtigt, dem Kunden entstandene Kosten fuer Rueckholung, Transport und Verwaltung in Rechnung zu stellen.
§ 10.4 Im Falle des Ruecktritts ist Polaris berechtigt, fuer die bereits erfolgte Nutzung des Geraets eine angemessene Nutzungsentschaedigung zu verlangen.
§ 10.5 Der Kunde hat keinen Anspruch auf Erstattung bereits gezahlter Betraege, soweit diese auf erbrachte Leistungen entfallen.
§ 11 Ausschluss der Rueckgabe bei Inbetriebnahme von Medizinprodukten
§ 11.1 Bei den gelieferten Geraeten handelt es sich um In-vitro-Diagnostik-Medizinprodukte gemaess Verordnung (EU) 2017/746 (IVDR). Eine Rueckgabe ist ausgeschlossen, sobald das Geraet in Betrieb genommen oder mit Proben/Testkits verwendet wurde.
§ 11.2 Eine Ruecknahme benutzter Medizinprodukte ist aus Sicherheits-, Hygiene- und regulatorischen Gruenden nicht zulaessig.
§ 11.3 Der Kunde kann bei Zahlungsverzug kein Rueckgaberecht geltend machen. Die Zahlungspflicht bleibt in vollem Umfang bestehen.
§ 11.4 Unberechtigte Ruecksendungen duerfen von Polaris verweigert oder auf Kosten des Kunden entsorgt werden.
§ 11.5 Testkits und Verbrauchsmaterialien sind grundsaetzlich von der Rueckgabe ausgeschlossen, es sei denn, es liegt ein Produktmangel vor.
§ 11.6 Die Regelungen dieses Paragraphen dienen dem Schutz der oeffentlichen Gesundheit und der Einhaltung regulatorischer Anforderungen und sind daher zwingend.
§ 12 Produktkonformitaet und regulatorische Anforderungen
§ 12.1 Die von Polaris vertriebenen In-vitro-Diagnostik-Produkte entsprechen den Anforderungen der Verordnung (EU) 2017/746 (IVDR) und tragen die CE-Kennzeichnung gemaess den geltenden Konformitaetsbewertungsverfahren.
§ 12.2 Der Kunde verpflichtet sich, die Produkte nur gemaess ihrer Zweckbestimmung, den Gebrauchsanweisungen und den geltenden gesetzlichen Vorschriften einzusetzen.
§ 12.3 Der Kunde ist verpflichtet, vor Verwendung der Produkte sicherzustellen, dass er ueber die erforderlichen Genehmigungen, Zulassungen und Qualifikationen verfuegt und die regulatorischen Anforderungen seines Landes einhaelt.
§ 12.4 Bei Export der Produkte in Laender ausserhalb der EU ist der Kunde fuer die Einhaltung der dort geltenden regulatorischen Anforderungen selbst verantwortlich. Eine Garantie fuer die Zulassungsfaehigkeit in Drittlaendern wird nicht uebernommen.
§ 13 Vigilanz und Meldepflichten
§ 13.1 Der Kunde verpflichtet sich, Polaris unverzueglich ueber schwerwiegende Vorkommnisse, Fehlfunktionen, Qualitaetsmaengel oder sicherheitsrelevante Ereignisse im Zusammenhang mit den Produkten zu informieren.
§ 13.2 Polaris wird bei Vorkommnismeldungen gemaess den Anforderungen der IVDR und den nationalen Meldesystemen die zustaendigen Behoerden informieren und mit diesen zusammenarbeiten.
§ 13.3 Der Kunde unterstuetzt Polaris bei der Untersuchung von Vorkommnissen durch Bereitstellung relevanter Informationen, Zugang zu betroffenen Produkten und Proben sowie Dokumentation der Anwendungsumstaende.
§ 13.4 Im Falle von Sicherheitskorrekturmassnahmen im Feld (Field Safety Corrective Actions) oder Rueckrufen ist der Kunde verpflichtet, mit Polaris zu kooperieren und die angeordneten Massnahmen unverzueglich umzusetzen.
§ 14 Qualitaetssicherung und Dokumentation
§ 14.1 Der Kunde ist verpflichtet, die Produkte gemaess den beiliegenden Gebrauchsanweisungen und unter Einhaltung der guten Laborpraxis (GLP) zu verwenden.
§ 14.2 Der Kunde fuehrt eigene Qualitaetskontrollen durch und dokumentiert diese ordnungsgemaess. Polaris stellt auf Anfrage Qualitaetskontrollmaterialien zur Verfuegung.
§ 14.3 Der Kunde bewahrt alle relevanten Aufzeichnungen ueber Chargenrueckverfolgbarkeit, Testergebnisse und Qualitaetskontrollen mindestens fuer die in den einschlaegigen Vorschriften vorgeschriebene Dauer auf.
§ 14.4 Polaris stellt dem Kunden auf Anfrage Konformitaetserklaerungen, Analysenzertifikate, Sicherheitsdatenblaetter und sonstige Produktdokumentation zur Verfuegung.
§ 15 Schulung und technischer Support
§ 15.1 Polaris bietet Schulungen zur ordnungsgemaessen Anwendung der Produkte an. Art, Umfang und Kosten der Schulungen werden gesondert vereinbart.
§ 15.2 Technischer Support ist waehrend der ueblichen Geschaeftszeiten (Mo-Fr, 9:00-17:00 Uhr MEZ) per E-Mail und Telefon erreichbar. Erweiterte Supportleistungen koennen gegen Aufpreis vereinbart werden.
§ 15.3 Der Kunde stellt sicher, dass nur entsprechend geschultes Personal die Produkte bedient. Eine Weitergabe der Schulungsinhalte an Dritte bedarf der vorherigen Zustimmung von Polaris.
§ 15.4 Bei Geraeten mit Fernwartungsfunktion ist der Kunde berechtigt, Polaris Fernzugriff fuer Wartungs- und Supportzwecke zu gewaehren. Die Aktivierung des Fernzugriffs erfolgt nur mit ausdruecklicher Zustimmung des Kunden.
§ 16 Wartung und Instandhaltung
§ 16.1 Fuer Geraete bietet Polaris Wartungsvertraege mit unterschiedlichen Leistungsumfaengen an. Umfang, Kosten und Laufzeit werden in separaten Wartungsvertraegen geregelt.
§ 16.2 Der Kunde ist verpflichtet, die vom Hersteller empfohlenen regelmaessigen Wartungsintervalle einzuhalten. Die Nichteinhaltung kann zum Erloeschen von Gewaehrleistungsanspruechen fuehren.
§ 16.3 Reparaturen und Wartungsarbeiten duerfen nur von Polaris oder von Polaris autorisierten Servicepartnern durchgefuehrt werden. Eigenmaechtige Eingriffe fuehren zum Erloeschen der Gewaehrleistung.
§ 16.4 Bei Geraetereparaturen ausserhalb der Gewaehrleistung erfolgt die Abrechnung nach Aufwand gemaess der jeweils gueltigen Preisliste, sofern kein Wartungsvertrag besteht.
§ 17 Software-Updates und Upgrades
§ 17.1 Polaris stellt fuer die Dauer des aktiven Nutzungsvertrags Software-Updates zur Verfuegung, die Fehlerbehebungen und Sicherheitsupdates beinhalten.
§ 17.2 Funktionale Erweiterungen (Upgrades) koennen kostenpflichtig sein. Der Kunde wird ueber verfuegbare Upgrades informiert und kann diese freiwillig erwerben.
§ 17.3 Der Kunde ist verpflichtet, sicherheitsrelevante Updates zeitnah zu installieren. Bei Nichtinstallation kann die Gewaehrleistung fuer daraus resultierende Fehlfunktionen entfallen.
§ 17.4 Polaris behaelt sich das Recht vor, aeltere Softwareversionen nach angemessener Ankuendigungsfrist nicht mehr zu unterstuetzen.
§ 18 Datenschutz und Datensicherheit
§ 18.1 Polaris verarbeitet personenbezogene Daten des Kunden ausschliesslich im Rahmen der geltenden Datenschutzvorschriften, insbesondere der DSGVO, und entsprechend der Datenschutzerklaerung auf www.polarisdx.net.
§ 18.2 Sofern Polaris im Rahmen der Cloud-Dienste Zugang zu personenbezogenen Patientendaten erhaelt, wird ein separater Auftragsverarbeitungsvertrag (AVV) gemaess Art. 28 DSGVO abgeschlossen.
§ 18.3 Die in der Cloud gespeicherten Daten werden auf Servern innerhalb der Europaeischen Union gehostet. Eine Uebermittlung in Drittlaender erfolgt nur unter Einhaltung der gesetzlichen Anforderungen.
§ 18.4 Polaris trifft angemessene technische und organisatorische Massnahmen zum Schutz der Daten vor unbefugtem Zugriff, Verlust oder Zerstoerung. Der Kunde ist fuer die Sicherheit seiner Zugangsdaten selbst verantwortlich.
§ 18.5 Nach Vertragsbeendigung werden die Kundendaten gemaess den gesetzlichen Aufbewahrungspflichten aufbewahrt und anschliessend geloescht, sofern keine laengeren Aufbewahrungspflichten bestehen.
§ 19 Geheimhaltung und Vertraulichkeit
§ 19.1 Die Parteien verpflichten sich, alle im Rahmen der Geschaeftsbeziehung erlangten vertraulichen Informationen, Geschaeftsgeheimnisse und Know-how streng vertraulich zu behandeln und nicht an Dritte weiterzugeben.
§ 19.2 Diese Verpflichtung gilt nicht fuer Informationen, die oeffentlich bekannt sind, dem Empfaenger bereits bekannt waren, von Dritten rechtmaessig erlangt wurden oder aufgrund gesetzlicher oder behoerdlicher Anordnung offengelegt werden muessen.
§ 19.3 Die Geheimhaltungspflicht besteht auch nach Beendigung der Geschaeftsbeziehung fort, mindestens jedoch fuer einen Zeitraum von fuenf Jahren.
§ 20 Geistiges Eigentum
§ 20.1 Alle Rechte an Marken, Patenten, Urheberrechten, Software, Designs, Know-how und sonstigen gewerblichen Schutzrechten verbleiben bei Polaris oder den jeweiligen Rechteinhabern.
§ 20.2 Der Kunde erhaelt ein nicht-exklusives, nicht uebertragbares Nutzungsrecht an der Software im Umfang des jeweiligen Lizenzvertrags. Eine Unterlizenzierung, Weitergabe oder Vervielfaeltigung ist ohne schriftliche Zustimmung untersagt.
§ 20.3 Reverse Engineering, Dekompilierung oder sonstige Versuche, den Quellcode der Software zu ermitteln, sind untersagt, soweit dies nicht durch zwingende gesetzliche Vorschriften erlaubt ist.
§ 20.4 Der Kunde darf Marken und Logos von Polaris nur mit vorheriger schriftlicher Genehmigung und gemaess den Markenrichtlinien von Polaris verwenden.
§ 21 Exportkontrolle und Sanktionen
§ 21.1 Der Kunde verpflichtet sich, alle anwendbaren Export- und Importvorschriften sowie Sanktionsbestimmungen der EU, Deutschlands und gegebenenfalls weiterer relevanter Jurisdiktionen einzuhalten.
§ 21.2 Der Kunde sichert zu, dass die gelieferten Produkte nicht direkt oder indirekt in Laender exportiert werden, gegen die Embargos bestehen, oder an Personen oder Einrichtungen auf Sanktionslisten geliefert werden.
§ 21.3 Bei Verstoessen gegen Exportkontroll- oder Sanktionsvorschriften haftet der Kunde allein fuer alle daraus entstehenden Schaeden und stellt Polaris von saemtlichen Anspruechen Dritter frei.
§ 22 Vertragslaufzeit und Kuendigung
§ 22.1 Kaufvertraege ueber Einzelprodukte werden mit vollstaendiger Erfuellung beendet. Dauerschuldverhaeltnisse (Software-Lizenzen, Cloud-Dienste, Wartungsvertraege) haben die in den jeweiligen Vertraegen festgelegte Laufzeit.
§ 22.2 Sofern nicht anders vereinbart, verlaengern sich Dauerschuldverhaeltnisse automatisch um weitere 12 Monate, wenn sie nicht mit einer Frist von 3 Monaten zum Ende der Laufzeit gekuendigt werden.
§ 22.3 Das Recht zur ausserordentlichen Kuendigung aus wichtigem Grund bleibt unberuehrt. Ein wichtiger Grund liegt insbesondere vor bei wesentlichen Vertragsverletzungen, Zahlungsunfaehigkeit, Eroeffnung eines Insolvenzverfahrens oder Verstoss gegen regulatorische Anforderungen.
§ 22.4 Bei Kuendigung oder Vertragsbeendigung erloeschen alle Nutzungsrechte an Software und Cloud-Diensten. Der Kunde kann seine Daten innerhalb von 30 Tagen nach Vertragsende exportieren.
§ 22.5 Bereits bezahlte Entgelte fuer nicht genutzte Vertragslaufzeiten werden nicht erstattet, es sei denn, die Kuendigung erfolgt durch den Kunden aus von Polaris zu vertretenden Gruenden.
§ 23 Streitbeilegung und Gerichtsstand
§ 23.1 Die Parteien verpflichten sich, bei Streitigkeiten aus oder im Zusammenhang mit diesem Vertrag zunaechst eine guetliche Einigung anzustreben.
§ 23.2 Ausschliesslicher Gerichtsstand fuer alle Streitigkeiten aus diesem Vertragsverhaeltnis ist der Sitz von Polaris, sofern der Kunde Kaufmann, juristische Person des oeffentlichen Rechts oder oeffentlich-rechtliches Sondervermoegen ist.
§ 23.3 Polaris ist berechtigt, den Kunden auch an seinem allgemeinen Gerichtsstand zu verklagen.
§ 23.4 Die Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle ist nicht vorgesehen und wird nicht angeboten, da sich die AGB ausschliesslich an Unternehmer richten.
§ 24 Anwendbares Recht
§ 24.1 Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG) und der Kollisionsnormen des internationalen Privatrechts.
§ 24.2 Soweit zwingende Vorschriften des Rechts am gewoehnlichen Aufenthaltsort des Kunden guenstigere Bestimmungen fuer den Kunden vorsehen, finden diese Anwendung.
§ 25 Schlussbestimmungen
§ 25.1 Aenderungen und Ergaenzungen dieser AGB beduerfen zu ihrer Wirksamkeit der Schriftform. Dies gilt auch fuer die Abbedingung dieses Schriftformerfordernisses.
§ 25.2 Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise unwirksam oder undurchfuehrbar sein oder werden, so wird dadurch die Wirksamkeit der uebrigen Bestimmungen nicht beruehrt. An die Stelle der unwirksamen oder undurchfuehrbaren Bestimmung tritt diejenige wirksame und durchfuehrbare Bestimmung, die dem wirtschaftlichen Zweck der unwirksamen Bestimmung am naechsten kommt.
§ 25.3 Polaris behaelt sich das Recht vor, diese AGB jederzeit mit Wirkung fuer die Zukunft zu aendern. Aenderungen werden dem Kunden mindestens 4 Wochen vor ihrem Inkrafttreten schriftlich oder per E-Mail mitgeteilt. Widerspricht der Kunde nicht innerhalb von 4 Wochen nach Zugang der Mitteilung, gelten die Aenderungen als genehmigt.
§ 25.4 Muendliche Nebenabreden bestehen nicht. Alle Vereinbarungen sind in schriftlicher Form niedergelegt.
§ 25.5 Die deutsche Fassung dieser AGB ist massgeblich. Uebersetzungen dienen nur der Information und begruenden keine eigenen Rechte.

---
Polaris Diagnostics Europe UG (haftungsbeschraenkt)
www.polarisdx.net
Stand: Dezember 2025 | Gerichtsstand: Deutschland
"""

# Extract header info
lines = raw_text.strip().split('\n')
title = lines[0].strip()
subtitle_parts = []
date = ""
start_idx = 0

for i, line in enumerate(lines[1:]):
    line = line.strip()
    if line.startswith('§ 1 '):
        start_idx = i + 1
        break
    if line.startswith('Stand:'):
        date = line
    else:
        subtitle_parts.append(line)

subtitle = " | ".join(subtitle_parts)

# Split by sections
sections = []
current_section = None
buffer = []

def save_section(sec, buff):
    if sec:
        content_lines = []
        for l in buff:
            l = l.strip()
            if l:
                # Format sub-items like § 1.1
                # If a line starts with § X.X, we keep it as a new paragraph
                # The text seems to have explicit line breaks for these.
                content_lines.append(l)
        sec['content'] = content_lines
        sections.append(sec)

lines_to_process = lines[start_idx:]
i = 0
while i < len(lines_to_process):
    line = lines_to_process[i].strip()

    if not line:
        i += 1
        continue

    # Check for new section header § X
    # Regex: Start with §, space, number, space, text (not dot)
    # The text has "§ 1 Geltungsbereich"
    if re.match(r'^§ \d+ .*', line):
        # Save previous
        save_section(current_section, buffer)

        # Start new
        match = re.match(r'^(§ \d+) (.*)', line)
        sec_num = match.group(1)
        sec_title = line
        sec_id = f"section-{sec_num.replace('§ ', '')}"
        current_section = {
            'id': sec_id,
            'title': sec_title,
        }
        buffer = []
    else:
        # Check for footer/end
        if line.startswith('---'):
            break
        buffer.append(line)

    i += 1

save_section(current_section, buffer)

# Generate TS file content
ts_content = "export interface AgbSection {\n  id: string;\n  title: string;\n  content: string[];\n}\n\n"
ts_content += "export const agbData = {\n"
ts_content += f"  title: \"{title}\",\n"
ts_content += f"  subtitle: \"{subtitle}\",\n"
ts_content += f"  date: \"{date}\",\n"
ts_content += "  sections: [\n"

for sec in sections:
    ts_content += "    {\n"
    ts_content += f"      id: \"{sec['id']}\",\n"
    ts_content += f"      title: \"{sec['title']}\",\n"
    ts_content += "      content: [\n"
    for p in sec['content']:
        # Escape quotes
        p_esc = p.replace('"', '\"')
        ts_content += f"        \"{p_esc}\",\n"
    ts_content += "      ]\n"
    ts_content += "    },\n"

ts_content += "  ]\n"
ts_content += "};\n"

with open("src/data/agbContent.ts", "w") as f:
    f.write(ts_content)

print("File created successfully")
