/* eslint-disable no-undef */
const { initializeApp, getApps, getApp } = require("firebase/app");
const { getAuth, GoogleAuthProvider } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
require('dotenv').config();



const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "shosan-acodemia-app.firebaseapp.com",
  projectId: "shosan-acodemia-app",
  storageBucket: "shosan-acodemia-app.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: "G-ZXK5YT4PBN"
};

// ✅ Ensure Firebase is initialized only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
