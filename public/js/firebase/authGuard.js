import { auth } from "./config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

export function protectPage(redirectTo = "auth/login.html") {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = redirectTo; // redirect if not signed in
    } else {
      document.body.style.visibility = "visible"; // show page only after auth check
    }
  });
}

export function getUserName(id) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const el = document.getElementById(id);
      if (el) el.textContent = user.displayName || "User";
    }
  });
}
