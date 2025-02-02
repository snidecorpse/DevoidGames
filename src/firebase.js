// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBstRSjJ4RQNZg9GVeHhhOn8C0I2DjI-Jg",
  authDomain: "diddygame-23fbd.firebaseapp.com",
  projectId: "diddygame-23fbd",
  storageBucket: "diddygame-23fbd.firebasestorage.app",
  messagingSenderId: "27124736115",
  appId: "1:27124736115:web:0e8e3ad4fe0c51e0a94a06",
  measurementId: "G-B7D046G95E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);