import { initializeApp, getApps, getApp } from 'firebase/app';
// @ts-expect-error - getReactNativePersistence is not exposed in the default firebase/auth typings but is present at runtime
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDtI0Fp4pjRQgGSLPYb87V07F_2hN9GXZA",
  authDomain: "bloom-maternal-advisory-app.firebaseapp.com",
  projectId: "bloom-maternal-advisory-app",
  storageBucket: "bloom-maternal-advisory-app.firebasestorage.app",
  messagingSenderId: "335978952577",
  appId: "1:335978952577:web:c7cf9d914fe944d86b9a80",
  measurementId: "G-40ZWQNFM98"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with AsyncStorage persistence
const auth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    return getAuth(app);
  }
})();

const db = getFirestore(app);

export { app, auth, db };
