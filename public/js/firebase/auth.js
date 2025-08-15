// public/js/firebase/auth.js
import { auth, googleProvider } from "./config.js";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// GitHub provider
const githubProvider = new GithubAuthProvider();

// Google login
export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", result.user);
    window.location.href = "../home.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// GitHub login
export async function githubLogin() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    console.log("GitHub user:", result.user);
    window.location.href = "../home.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Email/password signup
export async function signupWithEmail(name, email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    console.log("Signed up:", cred.user);
    window.location.href = "../home.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}
