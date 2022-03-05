// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-F0TWmS5yZthGaN4ijUzShRcF0MBWKwA",
  authDomain: "react-register-f4977.firebaseapp.com",
  databaseURL: "https://react-register-f4977-default-rtdb.firebaseio.com",
  projectId: "react-register-f4977",
  storageBucket: "react-register-f4977.appspot.com",
  messagingSenderId: "756925330854",
  appId: "1:756925330854:web:405a71ed7aa820beb58b67",
  measurementId: "G-MVLWXJLSGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);