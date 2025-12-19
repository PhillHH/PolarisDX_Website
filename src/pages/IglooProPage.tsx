import React from 'react';
import { motion } from 'framer-motion';
import { Wifi, Battery, ShieldCheck, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SectionHeader from '../components/ui/SectionHeader';
import PrimaryButton from '../components/ui/PrimaryButton';
import iglooImage from '../assets/igloo_front.png'; // Using existing asset
import IglooProFlyer from '../assets/downloads/igloo-pro-flyer.pdf';

const IglooProPage: React.FC = () => {
  const { t } = useTranslation(['products']);

  // Data based on the provided PDF content
  const specs = [
    { label: t('products:specs.methods'), value: t('products:specs.methods_value') },
    { label: t('products:specs.samples'), value: t('products:specs.samples_value') },
    { label: t('products:specs.weight'), value: t('products:specs.weight_value') },
    { label: t('products:specs.dimensions'), value: t('products:specs.dimensions_value') },
    { label: t('products:specs.speed'), value: t('products:specs.speed_value') },
    { label: t('products:specs.accuracy'), value: t('products:specs.accuracy_value') },
    { label: t('products:specs.storage'), value: t('products:specs.storage_value') },
    { label: t('products:specs.battery'), value: t('products:specs.battery_value') },
    { label: t('products:specs.communication'), value: t('products:specs.communication_value') }
  ];

  const features = [
    {
      icon: Layers,
      title: t('products:features.methods.title'),
      description: t('products:features.methods.description')
    },
    {
      icon: Battery,
      title: t('products:features.battery.title'),
      description: t('products:features.battery.description')
    },
    {
      icon: Wifi,
      title: t('products:features.connectivity.title'),
      description: t('products:features.connectivity.description')
    },
    {
      icon: ShieldCheck,
      title: t('products:features.precision.title'),
      description: t('products:features.precision.description')
    }
  ];

  const parameters = [
    t('products:parameters.list.vitd3'),
    t('products:parameters.list.crp'),
    t('products:parameters.list.hba1c'),
    t('products:parameters.list.ferritin'),
    t('products:parameters.list.cortisol'),
    t('products:parameters.list.tsh'),
    t('products:parameters.list.ddimer'),
    t('products:parameters.list.troponin'),
    t('products:parameters.list.flu'),
    t('products:parameters.list.rsv'),
    t('products:parameters.list.strep')
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-32 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-6">
              <SectionHeader
                title="Igloo Pro System"
                caption={t('products:hero.caption')}
                align="left"
                className="mb-0"
                titleClassName='text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight'
              />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                {t('products:hero.title').split('Diagnostik').map((part, i) => (
                    i === 0 ? <React.Fragment key={i}>{part}<br/></React.Fragment> : <span key={i} className="text-white drop-shadow-md">Diagnostik{part}</span>
                ))}
              </h1>
              <p className="text-xl text-gray-300 max-w-xl">
                {t('products:hero.description')}
              </p>
              <div className="flex gap-4 pt-4">
                <PrimaryButton as="a" href="/contact">
                  {t('products:hero.cta_order')}
                </PrimaryButton>
                <a
                  href={IglooProFlyer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-full border border-white/20 text-white font-medium hover:bg-white/10 transition-all"
                >
                  {t('products:hero.cta_datasheet')}
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">{t('products:intro.title')}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('products:intro.text1')}
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              {t('products:intro.text2')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50 relative">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-primary/50 transition-colors"
                    >
                        <feature.icon className="w-10 h-10 text-primary mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-500">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('products:specs.title')}</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <div className="grid gap-px bg-gray-100">
                    {specs.map((spec, idx) => (
                        <div key={idx} className="grid md:grid-cols-3 bg-white p-4 hover:bg-gray-50 transition-colors">
                            <div className="font-semibold text-primary">{spec.label}</div>
                            <div className="md:col-span-2 text-gray-600">{spec.value}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* Parameters */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">{t('products:parameters.title')}</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {parameters.map((param, idx) => (
                    <span
                        key={idx}
                        className="px-6 py-3 bg-white rounded-full text-gray-700 font-medium shadow-sm border border-gray-200 hover:bg-primary/5 hover:border-primary hover:text-primary transition-all cursor-default"
                    >
                        {param}
                    </span>
                ))}
            </div>
            <p className="mt-8 text-gray-500">
                {t('products:parameters.disclaimer').split('. ').map((part, i) => (
                  <React.Fragment key={i}>{part}{i < 1 && '.'} <br/></React.Fragment>
                ))}
            </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-deep">
        <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">{t('products:cta_bottom.title')}</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                {t('products:cta_bottom.description')}
            </p>
            <PrimaryButton as="a" href="/contact" className="text-lg px-10 py-4 bg-white text-primary-deep hover:bg-gray-100 border-none shadow-xl">
                {t('products:cta_bottom.button')}
            </PrimaryButton>
        </div>
      </section>
    </div>
  );
};

export default IglooProPage;
