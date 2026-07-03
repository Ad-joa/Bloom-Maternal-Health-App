import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English Translations
const en = {
  translation: {
    welcome: {
      title: 'Bloom',
      subtitle: 'Your maternal health journey, supported every step of the way with AI.',
      getStarted: 'Get Started',
      logIn: 'Log In',
    },
    home: {
      trimester: 'TRIMESTER',
      week: 'Week',
      untilDue: 'days until due date',
      welcome: 'Welcome',
      setupProfile: 'Set up your profile to track your pregnancy.',
      quickActions: 'Quick Actions',
      dailyReflection: 'Daily Reflection',
      insightsTitle: 'My daily insights • Today',
      babySize: 'Baby is the size of',
    },
    actions: {
      log: 'Log',
      symptoms: 'Symptoms',
      ai: 'Bloom AI',
      checkin: 'Check-in',
    }
  }
};

// Spanish Translations
const es = {
  translation: {
    welcome: {
      title: 'Bloom',
      subtitle: 'Tu viaje de salud materna, apoyado en cada paso por la IA.',
      getStarted: 'Empezar',
      logIn: 'Iniciar Sesión',
    },
    home: {
      trimester: 'TRIMESTRE',
      week: 'Semana',
      untilDue: 'días hasta la fecha',
      welcome: 'Bienvenida',
      setupProfile: 'Configura tu perfil para seguir tu embarazo.',
      quickActions: 'Acciones Rápidas',
      dailyReflection: 'Reflexión Diaria',
      insightsTitle: 'Mis consejos diarios • Hoy',
      babySize: 'El bebé tiene el tamaño de',
    },
    actions: {
      log: 'Registrar',
      symptoms: 'Síntomas',
      ai: 'Bloom AI',
      checkin: 'Revisión',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en,
      es,
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
