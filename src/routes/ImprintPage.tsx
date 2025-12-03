const ImprintPage = () => {
  return (
    <div className="pt-32 pb-16 lg:pt-48 lg:pb-32 bg-slate-50">
      <div className="mx-auto max-w-container px-4 lg:px-0">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Impressum</h1>

        <div className="space-y-8 text-gray-700 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Angaben gemäß § 5 TMG</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-2">London Office</h3>
                <p><strong>PolarisDX LTD</strong></p>
                <p>262A Fulham Road</p>
                <p>London SW10 9EL</p>
                <p>Vereinigtes Königreich</p>
                <p className="mt-2"><strong>Kontakt:</strong></p>
                <p>Telefon: +44 7879 433019</p>
                <p>E-Mail: hello@polarisdx.net</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Hamburg Office</h3>
                <p><strong>PolarisDX Europe UG</strong></p>
                <p>Große Bleichen 1 - 3</p>
                <p>20097 Hamburg</p>
                <p>Deutschland</p>
                <p className="mt-2"><strong>Kontakt:</strong></p>
                <p>E-Mail: info@polarisdx.net</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Vertretung</h2>
            <p>Vertreten durch die Geschäftsführung.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Registereintrag</h2>
            <p>Eintragung im Handelsregister.</p>
            <p>Registergericht: Amtsgericht Hamburg (für PolarisDX Europe UG)</p>
            <p>Registernummer: [HRB Nummer hier einfügen]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Umsatzsteuer-ID</h2>
            <p>Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:</p>
            <p>[USt-IdNr. hier einfügen]</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Redaktionell verantwortlich</h2>
            <p>PolarisDX Management Team</p>
            <p>262A Fulham Road</p>
            <p>London SW10 9EL</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">EU-Streitschlichtung</h2>
            <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">https://ec.europa.eu/consumers/odr/</a>.</p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ImprintPage
