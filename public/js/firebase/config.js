// config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDdJgJUf4oKmQ0PBNMnrbhIXH-XxhwFGqA",
  authDomain: "project-management-663b5.firebaseapp.com",
  projectId: "project-management-663b5",
  storageBucket: "project-management-663b5.appspot.com",
  messagingSenderId: "311786732403",
  appId: "1:311786732403:web:d3e3cfbbb2b1d552cee306",
  measurementId: "G-9DPZG1GW8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth instance
const auth = getAuth(app);

// Google provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
