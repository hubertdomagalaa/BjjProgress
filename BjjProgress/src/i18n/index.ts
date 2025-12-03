import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import pt from './locales/pt.json';

const resources = {
  en: { translation: en },
  pt: { translation: pt },
};

const initI18n = async () => {
  let locale = Localization.getLocales()[0]?.languageCode;
  
  // Fallback to English if language not supported
  if (locale !== 'pt') {
    locale = 'en';
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: locale,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
      compatibilityJSON: 'v4', // For Android compatibility
    });
};

initI18n();

export default i18n;
