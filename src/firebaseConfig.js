// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6UnciWVEZ_HhfEiVRJY2Ikk3s0hJNpsQ",
  authDomain: "wizard-a40d3.firebaseapp.com",
  projectId: "wizard-a40d3",
  storageBucket: "wizard-a40d3.appspot.com",
  messagingSenderId: "108676399172",
  appId: "1:108676399172:web:36b748a0e83b8b1b307c11",
  measurementId: "G-5MLCW5C0FT",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
