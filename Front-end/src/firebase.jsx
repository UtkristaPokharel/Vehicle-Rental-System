// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration - Use environment variables for production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAO0jHgQYzYoP9q0qqExCA1U7Hzgci8TpM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "easywheels-auth.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "easywheels-auth",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "easywheels-auth.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "791297666965",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:791297666965:web:790184ec97bb122eaa909c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-MXDLVWGQ8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure provider for better user experience
provider.setCustomParameters({
  prompt: 'select_account' // Force account selection
});

export { auth, provider, signInWithPopup };
