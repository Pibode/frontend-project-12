// frontend/src/lib/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ruTranslation from '../locales/ru/translation.json';
import enTranslation from '../locales/en/translation.json';

const resources = {
  ru: {
    translation: ruTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(LanguageDetector) // Определяет язык браузера
  .use(initReactI18next) // Интеграция с React
  .init({
    resources,
    fallbackLng: 'ru', // Дефолтная локаль - русский
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React уже экранирует
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'], // Сохраняем выбор языка
    },
  });

export default i18n;