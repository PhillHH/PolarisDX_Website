import { useTranslation } from 'react-i18next'

const PrivacyPage = () => {
  const { t } = useTranslation('common')

  return (
    <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Datenschutzerklärung</h1>

        <div className="space-y-8 text-gray-700 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-sm leading-relaxed sm:text-base">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">1. Datenschutz auf einen Blick</h2>
            <h3 className="font-semibold mt-4 mb-2">Allgemeine Hinweise</h3>
            <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

            <h3 className="font-semibold mt-4 mb-2">Datenerfassung auf dieser Website</h3>
            <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong></p>
            <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.</p>

            <p className="mt-2"><strong>Wie erfassen wir Ihre Daten?</strong></p>
            <p>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.</p>
            <p>Andere Daten werden automatisch oder nach Ihrer Einwilligung beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs). Die Erfassung dieser Daten erfolgt automatisch, sobald Sie diese Website betreten.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">2. Hosting</h2>
            <p>Wir hosten die Inhalte unserer Website bei einem externen Anbieter. Die personenbezogenen Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe und sonstige Daten, die über eine Website generiert werden, handeln.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">3. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="font-semibold mt-4 mb-2">Datenschutz</h3>
            <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

            <h3 className="font-semibold mt-4 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
            <p className="mt-2">
              PolarisDX Europe UG<br />
              Große Bleichen 1 - 3<br />
              20097 Hamburg<br />
              E-Mail: info@polarisdx.net
            </p>

            <h3 className="font-semibold mt-4 mb-2">Speicherdauer</h3>
            <p>Soweit innerhalb dieser Datenschutzerklärung keine speziellere Speicherdauer genannt wurde, verbleiben Ihre personenbezogenen Daten bei uns, bis der Zweck für die Datenverarbeitung entfällt. Wenn Sie ein berechtigtes Löschersuchen geltend machen oder eine Einwilligung zur Datenverarbeitung widerrufen, werden Ihre Daten gelöscht, sofern wir keine anderen rechtlich zulässigen Gründe für die Speicherung Ihrer personenbezogenen Daten haben (z. B. steuer- oder handelsrechtliche Aufbewahrungsfristen); im letzteren Fall erfolgt die Löschung nach Fortfall dieser Gründe.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">4. Datenerfassung auf dieser Website</h2>
            <h3 className="font-semibold mt-4 mb-2">Kontaktformular</h3>
            <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>
            <p className="mt-2"><strong>Speicherdauer bei Kontaktanfragen:</strong> Wir speichern Ihre Daten aus dem Kontaktformular für einen Zeitraum von bis zu 12 Monaten, um für eventuelle Rückfragen zur Verfügung zu stehen, sofern keine gesetzlichen Aufbewahrungsfristen eine längere Speicherung erfordern.</p>
            <p>Die Verarbeitung dieser Daten erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, sofern Ihre Anfrage mit der Erfüllung eines Vertrags zusammenhängt oder zur Durchführung vorvertraglicher Maßnahmen erforderlich ist. In allen übrigen Fällen beruht die Verarbeitung auf unserem berechtigten Interesse an der effektiven Bearbeitung der an uns gerichteten Anfragen (Art. 6 Abs. 1 lit. f DSGVO) oder auf Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sofern diese abgefragt wurde.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">5. Analyse-Tools und Werbung</h2>
            <p>Soweit Sie Ihre Einwilligung erklärt haben, werden auf dieser Website Cookies und ähnliche Technologien eingesetzt. Sie können Ihre Einwilligung jederzeit über unseren Cookie-Banner oder die Einstellungen in Ihrem Browser widerrufen.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
