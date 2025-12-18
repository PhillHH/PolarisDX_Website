import React, { useState, useEffect } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CookieCategory {
  id: string;
  nameKey: string;
  descriptionKey: string;
  required: boolean;
  enabled: boolean;
}

export const CookieBanner: React.FC = () => {
  const { t } = useTranslation('common');
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const defaultCategories: CookieCategory[] = [
    {
      id: 'necessary',
      nameKey: 'cookie.categories.necessary.name',
      descriptionKey: 'cookie.categories.necessary.description',
      required: true,
      enabled: true,
    },
    {
      id: 'marketing',
      nameKey: 'cookie.categories.marketing.name',
      descriptionKey: 'cookie.categories.marketing.description',
      required: false,
      enabled: false,
    },
    {
      id: 'analytics',
      nameKey: 'cookie.categories.analytics.name',
      descriptionKey: 'cookie.categories.analytics.description',
      required: false,
      enabled: false,
    },
  ];

  const [categories, setCategories] = useState<CookieCategory[]>(defaultCategories);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allEnabled = categories.map(c => ({ ...c, enabled: true }));
    setCategories(allEnabled);
    saveConsent(allEnabled);
  };

  const handleSaveSettings = () => {
    saveConsent(categories);
  };

  const saveConsent = (preferences: CookieCategory[]) => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(c =>
        c.id === id && !c.required ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 bg-white border-t border-gray-200 shadow-lg md:p-6 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600 hidden md:block">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {t('cookie.title', 'Wir respektieren Ihre Privatsphäre')}
              </h3>
              <p className="text-gray-600 text-sm md:text-base max-w-3xl">
                {t('cookie.description', 'Wir nutzen Cookies, um Ihnen die bestmögliche Nutzung unserer Webseite zu ermöglichen und unsere Kommunikation mit Ihnen zu verbessern. Wir berücksichtigen hierbei Ihre Präferenzen und verarbeiten Daten nur, wenn Sie uns durch Klicken auf "Alle akzeptieren" Ihr Einverständnis geben oder über "Einstellungen" eine spezifische Auswahl treffen.')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto min-w-[300px]">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors flex items-center justify-center gap-2"
            >
              {showSettings ? t('cookie.hide', 'Ausblenden') : t('cookie.settings', 'Einstellungen')}
              {showSettings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
            >
              {t('cookie.accept_all', 'Alle akzeptieren')}
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 border-t border-gray-100 pt-4 animate-in fade-in duration-200">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border ${category.enabled ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50/50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{t(category.nameKey)}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={category.enabled}
                        disabled={category.required}
                        onChange={() => toggleCategory(category.id)}
                      />
                      <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${category.required ? 'opacity-50 cursor-not-allowed' : ''} peer-checked:bg-blue-600`}></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {t(category.descriptionKey)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="px-6 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
              >
                {t('cookie.save_selection', 'Auswahl speichern')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
