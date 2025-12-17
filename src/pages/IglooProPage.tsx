import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Battery, ShieldCheck, Layers } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import PrimaryButton from '../components/ui/PrimaryButton';
import iglooImage from '../assets/igloo_front.png'; // Using existing asset
import IglooProFlyer from '../assets/downloads/igloo-pro-flyer.pdf';

const IglooProPage: React.FC = () => {
  // Data based on the provided PDF content
  const specs = [
    { label: 'Methoden', value: 'Kolorimetrie, Immunfluoreszenz, Mikrofluidik, Multiplex, Quantenpunkte, Trockenchemie' },
    { label: 'Proben', value: 'Serum / Plasma / Vollblut / Kapillarblut / Speichel / Haarprobe / Urin / Stuhl' },
    { label: 'Gewicht', value: 'ca. 400g' }, // Adjusted from text "ca. 290g" vs "ca. 400g" elsewhere, taking safe bet or user provided text "290g"
    { label: 'Abmessungen', value: '87,5 mm x 87,5 mm x 91 mm (LxBxH)' },
    { label: 'Testgeschwindigkeit', value: 'Wenige Sekunden (ohne Inkubationszeit)' },
    { label: 'Genauigkeit', value: 'CV < 2% (Inter-Reader), CV < 3% (Intra-Reader)' },
    { label: 'Datenspeicher', value: '10.000 Ergebnisse' },
    { label: 'Batterie', value: 'Lithium-Akku (bis zu 24 Stunden Dauerbetrieb)' },
    { label: 'Kommunikation', value: 'USB-C, LIMS-Konnektivität, WiFi, Bluetooth' }
  ];

  const features = [
    {
      icon: Layers,
      title: "Vielseitige Methoden",
      description: "Kolorimetrie, Immunfluoreszenz, Mikrofluidik und mehr in einem Gerät."
    },
    {
      icon: Battery,
      title: "24h Akkulaufzeit",
      description: "Lithium-Akku für den mobilen Dauereinsatz."
    },
    {
      icon: Wifi,
      title: "Volle Konnektivität",
      description: "WiFi, Bluetooth und API-Anbindung an Ihre Praxissoftware."
    },
    {
      icon: ShieldCheck,
      title: "Präzision & Sicherheit",
      description: "CV < 2% Genauigkeit und automatische Selbstkalibrierung."
    }
  ];

  const parameters = [
    "Vitamin D3", "CRP", "HbA1c", "Ferritin", "Cortisol", "TSH",
    "D-Dimer", "Troponin", "Influenza A/B", "RSV", "Streptokokken A"
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gradient-to-br from-primary via-primary-deep to-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <SectionHeader
                title="Igloo Pro System"
                caption="Next Gen Diagnostics"
                align="left"
                className="mb-0"
                titleClassName='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Schnelle und präzise <br/>
                <span className="text-white drop-shadow-md">
                  Diagnostik am Point-of-Care
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-xl">
                Ihre Schaltzentrale für schnelle, präzise und flexible Diagnostik.
                Ergebnisse in Laborqualität direkt am Behandlungsort.
              </p>
              <div className="flex gap-4 pt-4">
                <PrimaryButton as="a" href="/contact">
                  Jetzt bestellen
                </PrimaryButton>
                <a
                  href={IglooProFlyer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
                >
                  Datenblatt (PDF)
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
                <img
                  src={iglooImage}
                  alt="Igloo Pro Device"
                  className="relative z-10 w-full max-w-md drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">Das mobile Labor für Ihre Praxis</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Das Igloo Pro ist ein tragbares Point-of-Care-Analysegerät, das fortschrittliche Lateral-Flow-Assay-Technologien verwendet,
              um schnelle und genaue In-vitro-Tests für eine Vielzahl von Blutmarkern, Drogentests und Infektionskrankheiten durchzuführen.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Sie können über Adapter herstellerübergreifend etwa 90% aller auf dem Markt befindlichen Tests in einem kompakten Analyzer auswerten.
              Die Anzeige des Testergebnisses kann dabei wahlweise auf PC, Smartphone oder dem integrierten Display erfolgen.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-900 relative">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary/50 transition-colors"
                    >
                        <feature.icon className="w-10 h-10 text-secondary mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-400">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-[#083358]/30">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Technische Daten</h2>
            <div className="max-w-4xl mx-auto bg-white/5 rounded-3xl overflow-hidden border border-white/10">
                <div className="grid gap-px bg-white/10">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="grid md:grid-cols-3 bg-gray-900/90 p-4 hover:bg-gray-800/80 transition-colors">
                            <div className="font-semibold text-primary">{spec.label}</div>
                            <div className="md:col-span-2 text-gray-300">{spec.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-12">Verfügbare Parameter (Auszug)</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {parameters.map((param, idx) => (
                    <span
                        key={idx}
                        className="px-6 py-3 bg-white/10 rounded-full text-white font-medium border border-white/10 hover:bg-primary/20 hover:border-primary transition-all cursor-default"
                    >
                        {param}
                    </span>
                ))}
            </div>
            <p className="mt-8 text-gray-400">
                Diese und weitere Parameter sind bereits im Labor geprüft und verfügbar. <br/>
                Für weitere Tests sprechen Sie uns gerne an!
            </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-deep/50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Erweitern Sie Ihre diagnostischen Möglichkeiten</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Perfekt für Apotheken, Praxen, Pflegeeinrichtungen, Fitnessstudios und mehr.
            </p>
            <PrimaryButton as="a" href="/contact" className="text-lg px-10 py-4">
                Jetzt Beratungstermin vereinbaren
            </PrimaryButton>
        </div>
      </section>
    </div>
  );
};

export default IglooProPage;
