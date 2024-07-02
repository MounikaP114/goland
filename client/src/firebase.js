// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "goland-a475f.firebaseapp.com",
  projectId: "goland-a475f",
  storageBucket: "goland-a475f.appspot.com",
  messagingSenderId: "626780958698",
  appId: "1:626780958698:web:5c960ceacb3a17fe42cc93"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);