import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined" || !isFirebaseConfigured) return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

let db: Firestore | null = null;

/** Lazily create the Firestore instance in the browser only. */
export function getDb(): Firestore | null {
  if (db) return db;
  const app = getFirebaseApp();
  if (!app) return null;
  db = getFirestore(app);
  return db;
}

let authInstance: Auth | null = null;

/** Lazily create the Firebase Auth instance in the browser only. */
export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const app = getFirebaseApp();
  if (!app) return null;
  authInstance = getAuth(app);
  return authInstance;
}
