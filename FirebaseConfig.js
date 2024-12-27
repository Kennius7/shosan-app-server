/* eslint-disable no-undef */
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// const { dotenv } from require("dotenv");
require('dotenv').config()
// import { getAnalytics } from "firebase/analytics";


// dotenv.config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.VITE_API_KEY,
  authDomain: "shosan-acodemia-app.firebaseapp.com",
  projectId: "shosan-acodemia-app",
  storageBucket: "shosan-acodemia-app.firebasestorage.app",
  messagingSenderId: process.env.VITE_MESSAGING_SENDERID,
  appId: process.env.VITE_APP_ID,
  measurementId: "G-ZXK5YT4PBN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const storage = getStorage(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

