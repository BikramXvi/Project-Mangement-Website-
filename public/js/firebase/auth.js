// public/js/firebase/auth.js
import { auth, googleProvider } from "./config.js";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import { db, serverTimestamp } from "./config.js";


// GitHub provider
const githubProvider = new GithubAuthProvider();

// Google login
export async function googleLogin() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user
    // Add or update user in Firestore
    await createOrUpdateUser(user);
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
    const user = result.user
    // Add or update user in Firestore
    await createOrUpdateUser(user);
    window.location.href = "../home.html";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// Create user doc if not exists
async function createOrUpdateUser(user) {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    // New user → create document
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      photoURL: user.photoURL || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log("✅ New user added to Firestore:", user.uid);
  } else {
    // Existing user → update `updatedAt` timestamp
    await setDoc(userRef, { updatedAt: serverTimestamp() }, { merge: true });
    console.log("♻️ User already exists, updated timestamp:", user.uid);
  }
}


