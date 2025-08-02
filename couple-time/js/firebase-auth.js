import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrDulTQ2KcPdXBbUgC303elUXSwyYBRd4",
  authDomain: "couple-time-app.firebaseapp.com",
  projectId: "couple-time-app",
  storageBucket: "couple-time-app.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Therapist Login Function
export async function therapistLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Therapist logged in:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
}

// Couple Account Creation
export async function createCoupleAccount(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Account created:", userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error("Signup error:", error.message);
    throw error;
  }
}

// Auth State Listener
export function initAuthListener(callback) {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}