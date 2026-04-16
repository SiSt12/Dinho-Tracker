import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './en.json';
import ptBR from './pt-BR.json';

const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
  pt: { translation: ptBR },
};

const deviceLocale = Localization.getLocales()[0]?.languageTag ?? 'en';
const supportedLng = Object.keys(resources).find(
  (lng) => deviceLocale.startsWith(lng)
) ?? 'en';

i18n.use(initReactI18next).init({
  resources,
  lng: supportedLng,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  compatibilityJSON: 'v4',
});

export default i18n;
