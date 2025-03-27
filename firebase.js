// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsJUZsek_TnVUFfwvxlsK9N6c2843T4sQ",
  authDomain: "cuskey-44d99.firebaseapp.com",
  databaseURL: "https://cuskey-44d99-default-rtdb.firebaseio.com",
  projectId: "cuskey-44d99",
  storageBucket: "cuskey-44d99.firebasestorage.app",
  messagingSenderId: "792737816962",
  appId: "1:792737816962:web:c36dfbe49eddc305d3af9b",
  measurementId: "G-YC8P4GP9JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);