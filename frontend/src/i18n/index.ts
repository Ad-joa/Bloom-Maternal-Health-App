import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import twi from './locales/twi';
import ewe from './locales/ewe';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      twi,
      ewe
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
