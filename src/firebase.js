// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3A7HovMjZ-99GndXZeaxYGOLd61NZEhg",
  authDomain: "ios-db-b5f59.firebaseapp.com",
  projectId: "ios-db-b5f59",
  storageBucket: "ios-db-b5f59.firebasestorage.app",
  messagingSenderId: "690455504228",
  appId: "1:690455504228:web:e0e7a94ac4f278a2cdc671",
  measurementId: "G-PZWCBRP4SG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default getFirestore();