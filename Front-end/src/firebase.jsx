// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAO0jHgQYzYoP9q0qqExCA1U7Hzgci8TpM",
  authDomain: "easywheels-auth.firebaseapp.com",
  projectId: "easywheels-auth",
  storageBucket: "easywheels-auth.firebasestorage.app",
  messagingSenderId: "791297666965",
  appId: "1:791297666965:web:790184ec97bb122eaa909c",
  measurementId: "G-MXDLVWGQ8F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
