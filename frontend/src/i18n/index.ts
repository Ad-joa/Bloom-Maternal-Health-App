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
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      forgotPassword: 'Forgot password?',
      email: 'Email Address',
      password: 'Password',
      fullName: 'Full Name',
      signInBtn: 'Sign In',
      createAccountBtn: 'Create Account',
      sendResetLink: 'Send Reset Link',
    },
    profile: {
      ancVisits: 'ANC Visits',
      partnerMode: 'Partner Mode',
      reminders: 'Daily Reminders',
      appLanguage: 'App Language',
      appLock: 'App Lock',
      helpSupport: 'Help & Support',
      exportMedical: 'Export Medical Report (PDF)',
      logout: 'Log Out',
      deleteAccount: 'Delete Account',
      save: 'Save',
      cancel: 'Cancel',
      selectLanguage: 'Select Language'
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
    },
    auth: {
      login: 'Iniciar Sesión',
      signup: 'Regístrate',
      forgotPassword: '¿Olvidaste tu contraseña?',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      fullName: 'Nombre Completo',
      signInBtn: 'Entrar',
      createAccountBtn: 'Crear Cuenta',
      sendResetLink: 'Enviar enlace',
    },
    profile: {
      ancVisits: 'Visitas prenatales',
      partnerMode: 'Modo Pareja',
      reminders: 'Recordatorios',
      appLanguage: 'Idioma',
      appLock: 'Bloqueo de App',
      helpSupport: 'Ayuda',
      exportMedical: 'Exportar Reporte',
      logout: 'Cerrar Sesión',
      deleteAccount: 'Borrar Cuenta',
      save: 'Guardar',
      cancel: 'Cancelar',
      selectLanguage: 'Selecciona Idioma'
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
    },
    auth: {
      login: 'Kɔ Mu',
      signup: 'Kyerɛw Wo Din',
      forgotPassword: 'Wo werɛ afi wo password?',
      email: 'Email',
      password: 'Password',
      fullName: 'Din Mma',
      signInBtn: 'Kɔ Mu',
      createAccountBtn: 'Kyerɛw Din',
      sendResetLink: 'Soma Link',
    },
    profile: {
      ancVisits: 'ANC Nsrahwɛ',
      partnerMode: 'Ɔhokafoɔ Mode',
      reminders: 'Nkaekaeɛ',
      appLanguage: 'Kasa',
      appLock: 'Twa App No To Mu',
      helpSupport: 'Boa',
      exportMedical: 'Yi Medical Report (PDF)',
      logout: 'Pue',
      deleteAccount: 'Pepa Account',
      save: 'Sie',
      cancel: 'Gyae',
      selectLanguage: 'Yi Kasa'
    }
  }
};

// Ga Translations (Ghana)
const ga = {
  translation: {
    welcome: { title: 'Bloom', subtitle: 'O gbɔmɔtso hewalɛ gbɛ, AI yeɔ ebuao.', getStarted: 'Je Shishi', logIn: 'Bote Mli' },
    home: { trimester: 'NYƆŊI ETE', week: 'Otsii', untilDue: 'gbii ni eshwɛ', welcome: 'Awaa wa', setupProfile: 'To o profile he gbɛjianɔ.', quickActions: 'Nitsumɔi', dailyReflection: 'Daa Gbi', insightsTitle: 'Ŋaawoo • Ŋmɛnɛ', babySize: 'Gbekɛ lɛ kɛlɛ ji' },
    actions: { log: 'Ŋma', symptoms: 'Hela okadii', ai: 'Bloom AI', checkin: 'Kwɛ Mli' },
    auth: { login: 'Bote Mli', signup: 'Ŋma Ogbɛi', forgotPassword: 'O hiɛ e kpa o password nɔ?', email: 'Email', password: 'Password', fullName: 'Gbɛi', signInBtn: 'Bote Mli', createAccountBtn: 'Ŋma Ogbɛi', sendResetLink: 'Maje Link' },
    profile: { ancVisits: 'ANC Srai', partnerMode: 'Mɔdɛŋbɔɔ Mode', reminders: 'Kaimɔ', appLanguage: 'Wiemɔ', appLock: 'Naa App Lɛ', helpSupport: 'Yelikɛbuamɔ', exportMedical: 'Jie Report (PDF)', logout: 'Jiemɔ', deleteAccount: 'Tsumɔ Account', save: 'To', cancel: 'Kwa', selectLanguage: 'Hala Wiemɔ' }
  }
};

// Ewe Translations (Ghana)
const ewe = {
  translation: {
    welcome: { title: 'Bloom', subtitle: 'Wò lãmesẽ mɔzazã, AI le kpekpem ɖe ŋuwò.', getStarted: 'Dze Egɔme', logIn: 'Ge Ɖe Eme' },
    home: { trimester: 'ƔLETI ETƆ̃', week: 'Kwasiɖa', untilDue: 'ŋkeke siwo susɔ', welcome: 'Woezɔ', setupProfile: 'Trɔ wò nɔnɔme.', quickActions: 'Dɔwɔwɔwo', dailyReflection: 'Gbesiagbe', insightsTitle: 'Aɖaŋuɖoɖo • Egbe', babySize: 'Vi la lolo abe' },
    actions: { log: 'Ŋlɔ', symptoms: 'Dɔléle dzesiwo', ai: 'Bloom AI', checkin: 'Kpɔ Eme' },
    auth: { login: 'Ge Ɖe Eme', signup: 'Ŋlɔ Ŋkɔ', forgotPassword: 'Wò ŋlɔ wò password bea?', email: 'Email', password: 'Password', fullName: 'Ŋkɔ Blibo', signInBtn: 'Ge Ɖe Eme', createAccountBtn: 'Ŋlɔ Ŋkɔ', sendResetLink: 'Ɖo Link' },
    profile: { ancVisits: 'ANC Sasrãkpɔ', partnerMode: 'Kpeɖeŋutɔ Mode', reminders: 'Ŋkuɖodzinawo', appLanguage: 'Gbe', appLock: 'Tu App La', helpSupport: 'Kpekpeɖeŋu', exportMedical: 'De Medical Report (PDF)', logout: 'Do Go', deleteAccount: 'Tutu Account', save: 'Dzra Ɖo', cancel: 'Gbe', selectLanguage: 'Tia Gbe' }
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
