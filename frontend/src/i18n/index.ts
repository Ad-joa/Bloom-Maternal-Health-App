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

// Twi Translations (Ghana)
const twi = {
  translation: {
    welcome: {
      title: 'Bloom',
      subtitle: 'Wo apɔwmuden kwan, AI aboa wo wɔ anammɔn biara mu.',
      getStarted: 'Hyɛ Ase',
      logIn: 'Kɔ Mu',
    },
    home: {
      trimester: 'BOSOME MPƐN',
      week: 'Dapɛn',
      untilDue: 'nna aka a wobɛwo',
      welcome: 'Akwaaba',
      setupProfile: 'Hyehyɛ wo profile.',
      quickActions: 'Nneɛma a Wobɛyɛ Ntama',
      dailyReflection: 'Da Biara Dwumadi',
      insightsTitle: 'Afotuo • Ɛnnɛ',
      babySize: 'Abofra no kɛseɛ te sɛ',
    },
    actions: {
      log: 'Kyerɛw',
      symptoms: 'Yareɛ nsenia',
      ai: 'Bloom AI',
      checkin: 'Hwɛ Mu',
    }
  }
};

// Ga Translations (Ghana)
const ga = {
  translation: {
    welcome: { title: 'Bloom', subtitle: 'O gbɔmɔtso hewalɛ gbɛ, AI yeɔ ebuao.', getStarted: 'Je Shishi', logIn: 'Bote Mli' },
    home: { trimester: 'NYƆŊI ETE', week: 'Otsii', untilDue: 'gbii ni eshwɛ', welcome: 'Awaa wa', setupProfile: 'To o profile he gbɛjianɔ.', quickActions: 'Nitsumɔi', dailyReflection: 'Daa Gbi', insightsTitle: 'Ŋaawoo • Ŋmɛnɛ', babySize: 'Gbekɛ lɛ kɛlɛ ji' },
    actions: { log: 'Ŋma', symptoms: 'Hela okadii', ai: 'Bloom AI', checkin: 'Kwɛ Mli' }
  }
};

// Ewe Translations (Ghana)
const ewe = {
  translation: {
    welcome: { title: 'Bloom', subtitle: 'Wò lãmesẽ mɔzazã, AI le kpekpem ɖe ŋuwò.', getStarted: 'Dze Egɔme', logIn: 'Ge Ɖe Eme' },
    home: { trimester: 'ƔLETI ETƆ̃', week: 'Kwasiɖa', untilDue: 'ŋkeke siwo susɔ', welcome: 'Woezɔ', setupProfile: 'Trɔ wò nɔnɔme.', quickActions: 'Dɔwɔwɔwo', dailyReflection: 'Gbesiagbe', insightsTitle: 'Aɖaŋuɖoɖo • Egbe', babySize: 'Vi la lolo abe' },
    actions: { log: 'Ŋlɔ', symptoms: 'Dɔléle dzesiwo', ai: 'Bloom AI', checkin: 'Kpɔ Eme' }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      es,
      twi,
      ga,
      ewe
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
