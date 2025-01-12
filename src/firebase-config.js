// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "react-register-f4977.firebaseapp.com",
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: "react-register-f4977",
  storageBucket: "react-register-f4977.appspot.com",
  messagingSenderId: "756925330854",
  appId: process.env.REACT_APP_APP_ID,
  measurementId: "G-MVLWXJLSGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);